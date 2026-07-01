import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

type LeadPayload = {
  full_name?: string;
  phone?: string;
  email?: string;
  project_type?: string;
  budget?: string;
  timeline?: string;
  description?: string;
  preferred_contact?: string;
  consent?: boolean;
  locale?: string;
};

function clean(value: unknown, max = 2000): string {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const lead = {
    full_name: clean(body.full_name, 120),
    phone: clean(body.phone, 40),
    email: clean(body.email, 160),
    project_type: clean(body.project_type, 60),
    budget: clean(body.budget, 60),
    timeline: clean(body.timeline, 60),
    description: clean(body.description, 4000),
    preferred_contact: clean(body.preferred_contact, 40),
    locale: clean(body.locale, 8) || 'he',
    consent: body.consent === true,
  };

  // Minimal validation: need a name and at least one way to reach them.
  if (!lead.full_name || (!lead.phone && !lead.email)) {
    return NextResponse.json({ ok: false, error: 'missing_fields' }, { status: 422 });
  }

  const userAgent = request.headers.get('user-agent') || '';
  const record = { ...lead, source: 'website', user_agent: userAgent.slice(0, 400) };

  let stored = false;
  let emailed = false;

  // 1) Persist to Supabase (if configured).
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('leads').insert(record);
      if (error) {
        console.error('[quote] supabase insert error:', error.message);
      } else {
        stored = true;
      }
    } catch (err) {
      console.error('[quote] supabase exception:', err);
    }
  }

  // 2) Email the owner (if Resend is configured).
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
          from: `Oori Website <${fromEmail}>`,
          to: [toEmail],
          reply_to: lead.email || undefined,
          subject: `בקשת הצעת מחיר חדשה — ${lead.full_name}`,
          html: buildEmailHtml(record),
        }),
      });
      emailed = res.ok;
      if (!res.ok) {
        console.error('[quote] resend error:', res.status, await res.text());
      }
    } catch (err) {
      console.error('[quote] resend exception:', err);
    }
  }

  // Always log so a lead is never silently lost, even with no backend configured.
  if (!stored && !emailed) {
    console.log('[quote] new lead (no backend configured):', JSON.stringify(record));
  }

  return NextResponse.json({ ok: true, stored, emailed });
}

function esc(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildEmailHtml(r: Record<string, unknown>): string {
  const row = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:8px 12px;color:#8a7a68;white-space:nowrap;">${label}</td>` +
        `<td style="padding:8px 12px;color:#2b211a;font-weight:600;">${esc(String(value))}</td></tr>`
      : '';
  return `
  <div dir="rtl" style="font-family:Arial,Helvetica,sans-serif;background:#f4ede3;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#fffdf9;border:1px solid #e6dccb;border-radius:14px;overflow:hidden;">
      <div style="background:#3b2c20;padding:20px 24px;color:#f4ede3;font-size:18px;font-weight:700;">
        בקשת הצעת מחיר חדשה מהאתר
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:15px;">
        ${row('שם', r.full_name)}
        ${row('טלפון', r.phone)}
        ${row('אימייל', r.email)}
        ${row('סוג פרויקט', r.project_type)}
        ${row('תקציב', r.budget)}
        ${row('לוח זמנים', r.timeline)}
        ${row('אופן יצירת קשר מועדף', r.preferred_contact)}
        ${row('תיאור', r.description)}
      </table>
    </div>
  </div>`;
}
