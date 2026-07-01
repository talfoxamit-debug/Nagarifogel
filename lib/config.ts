/**
 * Public site configuration. Values come from environment variables
 * (see .env.example) with safe placeholder fallbacks so the site runs
 * out of the box. Replace the fallbacks or set env vars for production.
 */
export const siteConfig = {
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '972500000000',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+972-50-000-0000',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'oori@example.com',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
} as const;

/** Build a wa.me click-to-chat link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
