import { cookies } from 'next/headers';
import { ADMIN_COOKIE_NAME, verifySessionCookieValue } from './adminAuth';

/** For use in Route Handlers and Server Components (Node runtime only). */
export async function requireAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifySessionCookieValue(store.get(ADMIN_COOKIE_NAME)?.value);
}
