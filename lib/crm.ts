export const LEAD_STATUSES = ['new', 'contacted', 'quoted', 'won', 'lost'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'חדש',
  contacted: 'נוצר קשר',
  quoted: 'הצעת מחיר נשלחה',
  won: 'סגור בהצלחה',
  lost: 'לא התקדם',
};

export const ACTIVITY_TYPES = ['note', 'status_change', 'follow_up_set', 'follow_up_cleared'] as const;
export type ActivityType = (typeof ACTIVITY_TYPES)[number];

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  project_type: string | null;
  budget: string | null;
  timeline: string | null;
  description: string | null;
  preferred_contact: string | null;
  consent: boolean;
  locale: string;
  source: string | null;
  user_agent: string | null;
  status: LeadStatus;
  follow_up_at: string | null;
};

export type LeadActivity = {
  id: string;
  lead_id: string;
  type: ActivityType;
  body: string | null;
  created_at: string;
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

/** "overdue" | "today" | "upcoming" | null (no follow-up set) */
export function followUpUrgency(followUpAt: string | null): 'overdue' | 'today' | 'upcoming' | null {
  if (!followUpAt) return null;
  const due = new Date(followUpAt);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000);
  if (due < startOfToday) return 'overdue';
  if (due < startOfTomorrow) return 'today';
  return 'upcoming';
}
