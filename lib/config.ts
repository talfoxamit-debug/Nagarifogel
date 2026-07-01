/**
 * Public site configuration. Values come from environment variables
 * (see .env.example) with sensible fallbacks so the site runs out of the
 * box. These fallbacks are the real, public business details.
 */
export const siteConfig = {
  // International format, no + or spaces (for wa.me links).
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '972584075050',
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+972 58-407-5050',
  // Left empty until a real address is provided — the UI hides the email
  // option when this is blank rather than showing a placeholder.
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || '',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  // Social profiles — add real URLs to surface them in SEO/structured data.
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM || '',
  facebook: process.env.NEXT_PUBLIC_FACEBOOK || '',
} as const;

/** Build a wa.me click-to-chat link with an optional prefilled message. */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
