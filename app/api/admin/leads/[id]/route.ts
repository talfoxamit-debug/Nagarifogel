import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isLeadStatus } from '@/lib/crm';

export const runtime = 'nodejs';

type Body = {
  status?: string;
  follow_up_at?: string | null;
};

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const { id } = await params;
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  const activities: { type: string; body: string | null }[] = [];

  if (body.status !== undefined) {
    if (!isLeadStatus(body.status)) {
      return NextResponse.json({ ok: false, error: 'bad_status' }, { status: 422 });
    }
    updates.status = body.status;
    activities.push({ type: 'status_change', body: body.status });
  }

  if (body.follow_up_at !== undefined) {
    updates.follow_up_at = body.follow_up_at;
    activities.push({
      type: body.follow_up_at ? 'follow_up_set' : 'follow_up_cleared',
      body: body.follow_up_at || null,
    });
  }

  const { error } = await supabase.from('leads').update(updates).eq('id', id);
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  if (activities.length) {
    await supabase.from('lead_activity').insert(activities.map((a) => ({ lead_id: id, ...a })));
  }

  return NextResponse.json({ ok: true });
}
