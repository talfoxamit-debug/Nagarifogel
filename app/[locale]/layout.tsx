import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Assistant, Frank_Ruhl_Libre, Fraunces } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import '../globals.css';
import { locales, isLocale, dir, type Locale } from '@/lib/i18n';
import { getDictionary } from '@/content/dictionaries';
import { siteConfig } from '@/lib/config';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWhatsApp from '@/components/FloatingWhatsApp';

const assistant = Assistant({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-assistant',
  display: 'swap',
});

const frankRuhl = Frank_Ruhl_Libre({
  subsets: ['hebrew', 'latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-frank',
  display: 'swap',
});

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : 'he';
  const dict = getDictionary(locale);
  const title = `${dict.brand.name} — ${dict.brand.tagline}`;
  const description = dict.hero.subtitle;

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title: {
      default: title,
      template: `%s · ${dict.brand.name}`,
    },
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: { he: '/he', en: '/en' },
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'he' ? 'he_IL' : 'en_US',
      siteName: dict.brand.name,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: ['/og.png'] },
    icons: { icon: '/icon.svg' },
  };
}

export const viewport = {
  themeColor: '#4a2f1c',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: dict.brand.name,
    description: dict.hero.subtitle,
    image: `${siteConfig.siteUrl}/og.png`,
    url: `${siteConfig.siteUrl}/${locale}`,
    telephone: siteConfig.contactPhone,
    email: siteConfig.contactEmail,
    areaServed: dict.contact.location,
    priceRange: '₪₪',
    sameAs: [siteConfig.instagram, siteConfig.facebook],
  };

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      className={`${assistant.variable} ${frankRuhl.variable} ${fraunces.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header dict={dict} locale={locale} />
        <main>{children}</main>
        <Footer dict={dict} locale={locale} />
        <FloatingWhatsApp
          label={dict.quote.whatsappCta}
          message={
            locale === 'he'
              ? 'שלום אורי! אשמח להצעת מחיר לפרויקט עבודת עץ.'
              : "Hi Oori! I'd love a quote for a woodworking project."
          }
        />
        <Analytics />
      </body>
    </html>
  );
}
