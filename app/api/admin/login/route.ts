import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE_NAME,
  createSessionCookieValue,
  isAdminConfigured,
  verifyAdminPassword,
} from '@/lib/adminAuth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ ok: false, error: 'not_configured' }, { status: 503 });
  }

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  const valid = await verifyAdminPassword(body.password || '');
  if (!valid) {
    // Small fixed delay to blunt trivial automated brute-forcing.
    await new Promise((resolve) => setTimeout(resolve, 400));
    return NextResponse.json({ ok: false, error: 'invalid_credentials' }, { status: 401 });
  }

  const token = await createSessionCookieValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return res;
}
