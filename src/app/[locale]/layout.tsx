import { isLocale, locales, type Locale } from '@/i18n/config';
import { en } from '@/i18n/dictionaries/en';
import { ko } from '@/i18n/dictionaries/ko';
import { I18nProvider } from '@/i18n/I18nProvider';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dict = locale === 'ko' ? ko : en;
  return (
    <I18nProvider locale={locale as Locale} dict={dict}>
      {children}
    </I18nProvider>
  );
}
