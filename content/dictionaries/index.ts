import type { Locale } from '@/lib/i18n';
import type { Dict } from './types';
import { he } from './he';
import { en } from './en';

const dictionaries: Record<Locale, Dict> = { he, en };

export function getDictionary(locale: Locale): Dict {
  return dictionaries[locale] ?? he;
}

export type { Dict };
