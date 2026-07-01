import { NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/adminSession';
import { getSupabaseAdmin } from '@/lib/supabaseAdmin';

export const runtime = 'nodejs';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession())) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  const { id } = await params;
  let body: { body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const text = (body.body || '').trim().slice(0, 4000);
  if (!text) {
    return NextResponse.json({ ok: false, error: 'empty' }, { status: 422 });
  }

  const { error } = await supabase.from('lead_activity').insert({ lead_id: id, type: 'note', body: text });
  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  await supabase.from('leads').update({ updated_at: new Date().toISOString() }).eq('id', id);
  return NextResponse.json({ ok: true });
}
