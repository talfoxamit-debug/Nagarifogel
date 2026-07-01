import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import type { Lead, LeadActivity } from '@/lib/crm';
import LeadActions from './LeadActions';
import NoteForm from './NoteForm';
import Timeline from './Timeline';

export const dynamic = 'force-dynamic';

const PROJECT_TYPE_LABELS: Record<string, string> = {
  'custom-furniture': 'רהיט בהזמנה אישית',
  'art-piece': 'יצירת אמנות',
  'kitchen-builtin': 'מטבח או נגרות בנויה',
  restoration: 'שיקום ושחזור',
  other: 'אחר / משהו מיוחד',
};

const CONTACT_LABELS: Record<string, string> = {
  whatsapp: 'וואטסאפ',
  phone: 'שיחת טלפון',
  email: 'אימייל',
};

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return (
      <div className="admin-login__notice">
        Supabase לא מוגדר. יש להגדיר <code>NEXT_PUBLIC_SUPABASE_URL</code> ו־
        <code>SUPABASE_SERVICE_ROLE_KEY</code> ולפרוס מחדש.
      </div>
    );
  }

  const [{ data: lead }, { data: activityData }] = await Promise.all([
    supabase.from('leads').select('*').eq('id', id).maybeSingle(),
    supabase.from('lead_activity').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
  ]);

  if (!lead) notFound();

  const typedLead = lead as Lead;
  const activity = (activityData || []) as LeadActivity[];

  return (
    <div>
      <h1 className="admin-section-title">{typedLead.full_name}</h1>

      <div className="lead-detail">
        <div>
          <div className="lead-panel">
            <h2 className="lead-panel__title">פרטי הפנייה</h2>
            <dl className="lead-fields">
              <div className="lead-field">
                <dt>טלפון</dt>
                <dd dir="ltr">{typedLead.phone || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>אימייל</dt>
                <dd dir="ltr">{typedLead.email || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>סוג פרויקט</dt>
                <dd>{PROJECT_TYPE_LABELS[typedLead.project_type || ''] || typedLead.project_type || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>תקציב</dt>
                <dd>{typedLead.budget || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>לוח זמנים</dt>
                <dd>{typedLead.timeline || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>אופן קשר מועדף</dt>
                <dd>{CONTACT_LABELS[typedLead.preferred_contact || ''] || typedLead.preferred_contact || '—'}</dd>
              </div>
              <div className="lead-field">
                <dt>שפת האתר</dt>
                <dd>{typedLead.locale === 'he' ? 'עברית' : 'English'}</dd>
              </div>
              <div className="lead-field">
                <dt>התקבל בתאריך</dt>
                <dd>{new Date(typedLead.created_at).toLocaleString('he-IL')}</dd>
              </div>
              <div className="lead-field lead-field--full">
                <dt>תיאור הפרויקט</dt>
                <dd className="lead-desc">{typedLead.description || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="lead-panel">
            <h2 className="lead-panel__title">הוספת הערה</h2>
            <NoteForm leadId={typedLead.id} />
          </div>
        </div>

        <div>
          <div className="lead-panel">
            <h2 className="lead-panel__title">סטטוס ומעקב</h2>
            <LeadActions leadId={typedLead.id} status={typedLead.status} followUpAt={typedLead.follow_up_at} />
          </div>

          <div className="lead-panel">
            <h2 className="lead-panel__title">היסטוריה</h2>
            <Timeline activity={activity} createdAt={typedLead.created_at} />
          </div>
        </div>
      </div>
    </div>
  );
}
