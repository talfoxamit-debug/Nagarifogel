import { STATUS_LABELS, isLeadStatus, type LeadActivity } from '@/lib/crm';

function describe(item: LeadActivity): string {
  switch (item.type) {
    case 'note':
      return item.body || '';
    case 'status_change':
      return `הסטטוס שונה ל־"${item.body && isLeadStatus(item.body) ? STATUS_LABELS[item.body] : item.body}"`;
    case 'follow_up_set':
      return `נקבע מעקב לתאריך ${item.body ? new Date(item.body).toLocaleDateString('he-IL') : ''}`;
    case 'follow_up_cleared':
      return 'המעקב נוקה';
    default:
      return item.body || '';
  }
}

export default function Timeline({ activity, createdAt }: { activity: LeadActivity[]; createdAt: string }) {
  return (
    <div className="timeline">
      {activity.map((item) => (
        <div className="timeline-item" key={item.id}>
          <span className="timeline-item__dot" aria-hidden />
          <div className="timeline-item__body">
            <div>{describe(item)}</div>
            <div className="timeline-item__meta">{new Date(item.created_at).toLocaleString('he-IL')}</div>
          </div>
        </div>
      ))}
      <div className="timeline-item">
        <span className="timeline-item__dot" aria-hidden style={{ background: 'var(--border)' }} />
        <div className="timeline-item__body">
          <div>הפנייה התקבלה מהאתר</div>
          <div className="timeline-item__meta">{new Date(createdAt).toLocaleString('he-IL')}</div>
        </div>
      </div>
    </div>
  );
}
