import type { Dictionary } from './dictionaries/en';

export const locales = ['en', 'ko'] as const;
export type Locale = (typeof locales)[number];
export type { Dictionary };

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeNames: Record<Locale, string> = {
  en: 'English',
  ko: '한국어',
};

// 언어 → 기본 단위 체계 (미국 영어는 Imperial, 그 외는 Metric)
export type UnitSystem = 'metric' | 'imperial';

export function getUnitSystem(locale: Locale): UnitSystem {
  return locale === 'en' ? 'imperial' : 'metric';
}

// Intl 로케일 태그
export function intlLocale(locale: Locale): string {
  return locale === 'ko' ? 'ko-KR' : 'en-US';
}

// 국가/통화 기본값 (미국 우선)
export function defaultCurrency(locale: Locale): string {
  return locale === 'en' ? 'USD' : 'KRW';
}
