import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { siteConfig } from '@/lib/config';
import type { Lead } from '@/lib/crm';

export const runtime = 'nodejs';

/**
 * Daily digest of due/overdue follow-ups, emailed to the owner.
 * Triggered by Vercel Cron (see vercel.json) which sends
 * `Authorization: Bearer ${CRON_SECRET}` automatically when CRON_SECRET
 * is set as a project env var.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
    }
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const now = new Date();
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .lte('follow_up_at', endOfToday.toISOString())
    .not('follow_up_at', 'is', null)
    .not('status', 'in', '(won,lost)')
    .order('follow_up_at', { ascending: true });

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const leads = (data || []) as Lead[];
  let emailed = false;

  if (leads.length > 0) {
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;
    const fromEmail = process.env.LEAD_FROM_EMAIL || 'onboarding@resend.dev';

    if (resendKey && toEmail) {
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: `Oori CRM <${fromEmail}>`,
            to: [toEmail],
            subject: `תזכורות למעקב — ${leads.length} לידים`,
            html: buildDigestHtml(leads),
          }),
        });
        emailed = res.ok;
        if (!res.ok) {
          console.error('[follow-ups] resend error:', res.status, await res.text());
        }
      } catch (err) {
        console.error('[follow-ups] resend exception:', err);
      }
    } else {
      console.log('[follow-ups] due follow-ups (no email configured):', leads.length);
    }
  }

  return NextResponse.json({ ok: true, due: leads.length, emailed });
}

function esc(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildDigestHtml(leads: Lead[]): string {
  const rows = leads
    .map((l) => {
      const due = l.follow_up_at ? new Date(l.follow_up_at) : null;
      const overdue = due ? due < new Date(new Date().setHours(0, 0, 0, 0)) : false;
      const url = `${siteConfig.siteUrl}/admin/leads/${l.id}`;
      return `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e6dccb;">
          <a href="${url}" style="color:#4a2f1c;font-weight:700;text-decoration:none;">${esc(l.full_name)}</a><br/>
          <span style="color:#8a7a68;font-size:13px;">${esc(l.phone || l.email || '')}</span>
        </td>
        <td style="padding:10px 12px;border-bottom:1px solid #e6dccb;color:#2b211a;">${esc(l.project_type || '—')}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e6dccb;${overdue ? 'color:#9b3324;font-weight:700;' : 'color:#2b211a;'}">
          ${due ? due.toLocaleDateString('he-IL') : '—'}${overdue ? ' (עבר)' : ''}
        </td>
      </tr>`;
    })
    .join('');

  return `
  <div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;background:#f4ede3;padding:24px;">
    <div style="max-width:640px;margin:0 auto;background:#fffdf9;border:1px solid #e6dccb;border-radius:14px;overflow:hidden;">
      <div style="background:#3b2c20;padding:20px 24px;color:#f4ede3;font-size:18px;font-weight:700;">
        תזכורות למעקב היום — ${leads.length} לידים
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        <tr style="background:#efe5d4;">
          <th style="padding:10px 12px;text-align:right;color:#5a4b3c;">ליד</th>
          <th style="padding:10px 12px;text-align:right;color:#5a4b3c;">סוג פרויקט</th>
          <th style="padding:10px 12px;text-align:right;color:#5a4b3c;">תאריך מעקב</th>
        </tr>
        ${rows}
      </table>
    </div>
  </div>`;
}
