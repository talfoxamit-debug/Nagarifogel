import Link from 'next/link';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { LEAD_STATUSES, STATUS_LABELS, isLeadStatus, type Lead } from '@/lib/crm';
import LeadRow from './LeadRow';

export const dynamic = 'force-dynamic';

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: rawStatus, q } = await searchParams;
  const status = rawStatus && isLeadStatus(rawStatus) ? rawStatus : undefined;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="admin-login__notice">
        Supabase לא מוגדר. יש להגדיר <code>NEXT_PUBLIC_SUPABASE_URL</code> ו־
        <code>SUPABASE_SERVICE_ROLE_KEY</code> ולפרוס מחדש.
      </div>
    );
  }

  let query = supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200);
  if (status) query = query.eq('status', status);
  if (q && q.trim()) {
    // Strip characters that have special meaning in a PostgREST filter string.
    const term = q.trim().replace(/[,()%]/g, '');
    if (term) {
      query = query.or(`full_name.ilike.%${term}%,phone.ilike.%${term}%,email.ilike.%${term}%`);
    }
  }
  const { data, error } = await query;
  const leads = (data || []) as Lead[];

  const tabs: { key: string; label: string }[] = [
    { key: '', label: 'הכול' },
    ...LEAD_STATUSES.map((s) => ({ key: s, label: STATUS_LABELS[s] })),
  ];

  return (
    <div>
      <h1 className="admin-section-title">כל הלידים {leads.length ? `(${leads.length})` : ''}</h1>

      <div className="admin-tabs">
        {tabs.map((t) => (
          <Link
            key={t.key}
            href={t.key ? `/admin/leads?status=${t.key}` : '/admin/leads'}
            className={`admin-tab${(status || '') === t.key ? ' is-active' : ''}`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form method="get" style={{ marginBottom: '1.25rem' }}>
        {status && <input type="hidden" name="status" value={status} />}
        <input
          type="search"
          name="q"
          defaultValue={q || ''}
          placeholder="חיפוש לפי שם, טלפון או אימייל…"
          style={{
            width: '100%',
            maxWidth: 360,
            padding: '0.6rem 0.9rem',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            background: 'var(--surface)',
            fontFamily: 'inherit',
            fontSize: '0.9rem',
          }}
        />
      </form>

      {error && <p className="admin-empty">שגיאה בטעינת לידים: {error.message}</p>}

      {!error && leads.length === 0 ? (
        <p className="admin-empty">אין לידים להצגה.</p>
      ) : (
        <div className="leads-table-wrap">
          <table className="leads-table">
            <thead>
              <tr>
                <th>שם</th>
                <th>סוג פרויקט</th>
                <th>סטטוס</th>
                <th>מעקב</th>
                <th>התקבל</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
