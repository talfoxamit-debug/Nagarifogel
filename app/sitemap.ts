import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/config';
import { locales } from '@/lib/i18n';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteConfig.siteUrl}/${locale}`,
    changeFrequency: 'monthly',
    priority: locale === 'he' ? 1 : 0.8,
  }));
}
