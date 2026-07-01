'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LEAD_STATUSES, STATUS_LABELS, type LeadStatus } from '@/lib/crm';

type Props = {
  leadId: string;
  status: LeadStatus;
  followUpAt: string | null;
};

function toDateInputValue(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(9, 0, 0, 0);
  return d.toISOString();
}

export default function LeadActions({ leadId, status, followUpAt }: Props) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = React.useState<LeadStatus>(status);
  const [followUp, setFollowUp] = React.useState(toDateInputValue(followUpAt));
  const [saving, setSaving] = React.useState(false);
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);

  const patch = async (body: Record<string, unknown>, msg: string) => {
    setSaving(true);
    setSavedMsg(null);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      setSavedMsg(res.ok ? msg : 'שגיאה בשמירה');
      router.refresh();
    } catch {
      setSavedMsg('שגיאה בשמירה');
    } finally {
      setSaving(false);
    }
  };

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus;
    setCurrentStatus(next);
    patch({ status: next }, 'הסטטוס עודכן');
  };

  const setFollowUpDate = (iso: string | null) => {
    setFollowUp(iso ? toDateInputValue(iso) : '');
    patch({ follow_up_at: iso }, iso ? 'תאריך המעקב עודכן' : 'המעקב נוקה');
  };

  return (
    <div>
      <div className="lead-actions-row">
        <div className="field">
          <label htmlFor="status-select">סטטוס</label>
          <select id="status-select" value={currentStatus} onChange={onStatusChange} disabled={saving}>
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="followup-date">תאריך מעקב</label>
          <input
            id="followup-date"
            type="date"
            value={followUp}
            onChange={(e) => {
              setFollowUp(e.target.value);
            }}
            onBlur={(e) => {
              const val = e.target.value;
              patch({ follow_up_at: val ? new Date(`${val}T09:00:00`).toISOString() : null }, 'תאריך המעקב עודכן');
            }}
            disabled={saving}
          />
        </div>
      </div>

      <div className="quick-followup">
        <button type="button" className="chip-btn" onClick={() => setFollowUpDate(daysFromNow(1))} disabled={saving}>
          מחר
        </button>
        <button type="button" className="chip-btn" onClick={() => setFollowUpDate(daysFromNow(3))} disabled={saving}>
          בעוד 3 ימים
        </button>
        <button type="button" className="chip-btn" onClick={() => setFollowUpDate(daysFromNow(7))} disabled={saving}>
          שבוע
        </button>
        <button type="button" className="chip-btn" onClick={() => setFollowUpDate(null)} disabled={saving}>
          נקה מעקב
        </button>
      </div>

      {savedMsg && <p className="admin-toast admin-toast--ok">{savedMsg}</p>}
    </div>
  );
}
