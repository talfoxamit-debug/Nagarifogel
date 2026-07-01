/**
 * Admin session auth for the /admin CRM. Uses only Web Crypto (available
 * in both the Edge middleware and the Node.js route runtime) so this file
 * is safe to import from either — no Node-only APIs (Buffer, node:crypto).
 *
 * Session token format: `${expiresAtMs}.${hmacHex}` where the signature
 * covers `admin.${expiresAtMs}` under ADMIN_SESSION_SECRET. Stateless —
 * no server-side session store needed.
 */

export const ADMIN_COOKIE_NAME = 'oori_admin_session';
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return toHex(digest);
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return toHex(sig);
}

/** Constant-time comparison of two equal-length hex digests. */
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/** Compares a candidate password to ADMIN_PASSWORD without leaking length via timing. */
export async function verifyAdminPassword(candidate: string): Promise<boolean> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !candidate) return false;
  const [a, b] = await Promise.all([sha256Hex(candidate), sha256Hex(expected)]);
  return timingSafeEqualHex(a, b);
}

export async function createSessionCookieValue(): Promise<string> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured');
  const expires = Date.now() + SESSION_TTL_MS;
  const sig = await hmacSha256Hex(secret, `admin.${expires}`);
  return `${expires}.${sig}`;
}

export async function verifySessionCookieValue(value: string | undefined | null): Promise<boolean> {
  if (!value) return false;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  const [expiresStr, sig] = value.split('.');
  const expires = Number(expiresStr);
  if (!sig || !Number.isFinite(expires)) return false;
  if (Date.now() > expires) return false;
  const expectedSig = await hmacSha256Hex(secret, `admin.${expires}`);
  return timingSafeEqualHex(sig, expectedSig);
}
