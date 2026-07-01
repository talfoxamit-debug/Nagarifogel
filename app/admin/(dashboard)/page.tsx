import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { LEAD_STATUSES, STATUS_LABELS, followUpUrgency, type Lead } from '@/lib/crm';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="admin-login__notice">
        Supabase לא מוגדר. יש להגדיר <code>NEXT_PUBLIC_SUPABASE_URL</code> ו־
        <code>SUPABASE_SERVICE_ROLE_KEY</code>, להריץ את המיגרציות ב־<code>supabase/migrations</code>,
        ולפרוס מחדש.
      </div>
    );
  }

  const [{ count: totalCount }, ...statusCounts] = await Promise.all([
    supabase.from('leads').select('*', { count: 'exact', head: true }),
    ...LEAD_STATUSES.map((s) => supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', s)),
  ]);

  const nowIso = new Date().toISOString();
  const { data: dueData } = await supabase
    .from('leads')
    .select('*')
    .not('follow_up_at', 'is', null)
    .not('status', 'in', '(won,lost)')
    .order('follow_up_at', { ascending: true })
    .limit(30);

  const dueLeads = ((dueData || []) as Lead[]).filter((l) => {
    const urgency = followUpUrgency(l.follow_up_at);
    return urgency === 'overdue' || urgency === 'today';
  });

  return (
    <div>
      <h1 className="admin-section-title">סיכום</h1>

      <div className="admin-cards">
        <Link href="/admin/leads" className="admin-card">
          <span className="admin-card__value">{totalCount ?? 0}</span>
          <span className="admin-card__label">סה״כ לידים</span>
        </Link>
        {LEAD_STATUSES.map((status, i) => (
          <Link key={status} href={`/admin/leads?status=${status}`} className="admin-card">
            <span className="admin-card__value">{statusCounts[i]?.count ?? 0}</span>
            <span className="admin-card__label">{STATUS_LABELS[status]}</span>
          </Link>
        ))}
      </div>

      <h2 className="admin-section-title">מעקבים שדורשים תשומת לב ({dueLeads.length})</h2>
      {dueLeads.length === 0 ? (
        <p className="admin-empty">אין מעקבים שממתינים היום. 🎉</p>
      ) : (
        <div className="followup-list">
          {dueLeads.map((lead) => {
            const urgency = followUpUrgency(lead.follow_up_at);
            const due = lead.follow_up_at ? new Date(lead.follow_up_at) : null;
            return (
              <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="followup-row">
                <span className={`badge badge--${urgency}`}>{urgency === 'overdue' ? 'עבר המועד' : 'היום'}</span>
                <span className="followup-row__name">{lead.full_name}</span>
                <span className="followup-row__meta">{lead.phone || lead.email || ''}</span>
                <span className="followup-row__date">{due ? due.toLocaleDateString('he-IL') : ''}</span>
              </Link>
            );
          })}
        </div>
      )}

      <p className="admin-empty">
        <Link href="/admin/leads">→ צפייה בכל הלידים</Link>
      </p>
    </div>
  );
}
