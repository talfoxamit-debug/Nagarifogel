'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LEAD_STATUSES, STATUS_LABELS, followUpUrgency, type Lead, type LeadStatus } from '@/lib/crm';

export default function LeadRow({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = React.useState<LeadStatus>(lead.status);
  const [saving, setSaving] = React.useState(false);

  const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as LeadStatus;
    setStatus(next);
    setSaving(true);
    try {
      await fetch(`/api/admin/leads/${lead.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const urgency = followUpUrgency(lead.follow_up_at);
  const due = lead.follow_up_at ? new Date(lead.follow_up_at) : null;
  const created = new Date(lead.created_at);

  return (
    <tr>
      <td>
        <div className="leads-table__name">
          <Link href={`/admin/leads/${lead.id}`}>{lead.full_name}</Link>
        </div>
        <div className="leads-table__meta">{lead.phone || lead.email || '—'}</div>
      </td>
      <td>{lead.project_type || '—'}</td>
      <td>
        <select value={status} onChange={onStatusChange} disabled={saving}>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </td>
      <td>
        {due ? (
          <span className={`badge badge--${urgency}`}>{due.toLocaleDateString('he-IL')}</span>
        ) : (
          <span className="leads-table__meta">—</span>
        )}
      </td>
      <td className="leads-table__meta">{created.toLocaleDateString('he-IL')}</td>
    </tr>
  );
}
