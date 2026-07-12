import { defaultCurrency, defaultLocale, intlLocale, isLocale, type Locale } from '@/i18n/config';

const resolveLocale = (): Locale => {
  if (typeof document === 'undefined') return defaultLocale;
  const match = document.cookie.match(/(?:^|; )locale=([^;]+)/);
  const value = match?.[1];
  if (value && isLocale(value)) return value;
  return defaultLocale;
};

export const formatNumber = (value: number | string, options?: Intl.NumberFormatOptions): string => {
  if (typeof value === 'number') {
    const locale = resolveLocale();
    return new Intl.NumberFormat(intlLocale(locale), { maximumFractionDigits: 0, ...options }).format(
      Math.round(value)
    );
  }
  return value;
};

export const formatCurrency = (
  value: number,
  currency?: string,
  options?: Intl.NumberFormatOptions
): string => {
  const locale = resolveLocale();
  const currencyCode = currency || defaultCurrency(locale);
  return new Intl.NumberFormat(intlLocale(locale), {
    style: 'currency',
    currency: currencyCode,
    maximumFractionDigits: 0,
    ...options,
  }).format(value);
};

export const parseNumber = (value: string): number => {
  const parsed = parseFloat(value.replace(/,/g, ''));
  return isNaN(parsed) ? 0 : parsed;
};
