'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { defaultLocale, intlLocale, Locale, type Dictionary, defaultCurrency, getUnitSystem, UnitSystem } from '@/i18n/config';

interface I18nContextValue {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (value: number, currency?: string, options?: Intl.NumberFormatOptions) => string;
  formatDate: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
  currency: string;
  setCurrency: (currency: string) => void;
  unitSystem: UnitSystem;
  setUnitSystem: (system: UnitSystem) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale: initialLocale,
  dict: initialDict,
  children,
}: {
  locale: Locale;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [dict, setDict] = useState<Dictionary>(initialDict);
  const [currency, setCurrencyState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('currency') || defaultCurrency(initialLocale);
    }
    return defaultCurrency(initialLocale);
  });
  const [unitSystem, setUnitSystemState] = useState<UnitSystem>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('unitSystem') as UnitSystem) || getUnitSystem(initialLocale);
    }
    return getUnitSystem(initialLocale);
  });

  // URL의 [locale] 세그먼트가 바뀌면 레이아웃이 새 locale/dict prop을 내려주는데,
  // useState는 초기값만 잡으므로 prop 변경에 상태를 동기화해야 언어 전환이 전체에 반영된다.
  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  useEffect(() => {
    setDict(initialDict);
  }, [initialDict]);

  useEffect(() => {
    document.cookie = `locale=${locale}; path=/; max-age=31536000; samesite=lax`;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const setCurrency = useCallback((next: string) => {
    setCurrencyState(next);
    localStorage.setItem('currency', next);
  }, []);

  const setUnitSystem = useCallback((next: UnitSystem) => {
    setUnitSystemState(next);
    localStorage.setItem('unitSystem', next);
  }, []);

  // 로케일이 바뀔 때, 로컬 스토리지에 사용자가 명시적으로 저장한 단위/화폐가 없으면 로케일 기본값으로 전환 (선택적 구현)
  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('currency')) {
      setCurrencyState(defaultCurrency(locale));
    }
    if (typeof window !== 'undefined' && !localStorage.getItem('unitSystem')) {
      setUnitSystemState(getUnitSystem(locale));
    }
  }, [locale]);

  const intl = intlLocale(locale);

  const formatNumber = useCallback(
    (value: number, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(intl, options).format(value),
    [intl]
  );

  const formatCurrency = useCallback(
    (value: number, currencyCode = currency, options?: Intl.NumberFormatOptions) =>
      new Intl.NumberFormat(intl, {
        style: 'currency',
        currency: currencyCode,
        maximumFractionDigits: 0,
        ...options,
      }).format(value),
    [intl, currency]
  );

  const formatDate = useCallback(
    (value: Date, options?: Intl.DateTimeFormatOptions) =>
      new Intl.DateTimeFormat(intl, options).format(value),
    [intl]
  );

  return (
    <I18nContext.Provider
      value={{ locale, dict, setLocale, formatNumber, formatCurrency, formatDate, currency, setCurrency, unitSystem, setUnitSystem }}
    >
      {children}
    </I18nContext.Provider>
  );
}

// provider 밖(루트 유틸 라우트 등)에서 호출될 때 사용하는 최소 폴백 사전.
// 클라이언트 번들에 전체 사전(en/ko)을 끌어오지 않기 위해 인라인으로 둔다.
const fallbackDict = {
  common: { searchPlaceholder: 'Search for any calculator...', language: 'Language', selectLanguage: 'Select language', theme: 'Toggle theme', calculate: 'Calculate', home: 'Home' },
  nav: { finance: 'Finance', conversion: 'Conversion', life: 'Life', science: 'Science', engineering: 'Engineering', aiTools: 'AI Tools', game: 'Game', others: 'Others' },
  home: { title: 'Online Calculators for Every Need', subtitle: 'Explore calculators across finance, health, daily life, engineering and more, right now.', press: 'Press', about: 'About AllinCalc' },
  footer: { press: 'Press', editorialPolicy: 'Editorial Policy', partnership: 'Partnership', about: 'About AllinCalc', resources: 'Resources', intro: 'Intro', library: 'Library', affiliate: 'Affiliate', contact: 'Contact', blog: 'Blog', copyright: 'All rights reserved.' },
  mortgage: {} as Record<string, unknown>,
} as unknown as Dictionary;

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    const fallbackCurrency = defaultCurrency(defaultLocale);
    const fallbackUnitSystem = getUnitSystem(defaultLocale);
    return {
      locale: defaultLocale,
      dict: fallbackDict,
      setLocale: () => {},
      formatNumber: (v, o) => new Intl.NumberFormat(intlLocale(defaultLocale), o).format(v),
      formatCurrency: (v, c = fallbackCurrency, o) =>
        new Intl.NumberFormat(intlLocale(defaultLocale), { style: 'currency', currency: c, maximumFractionDigits: 0, ...o }).format(v),
      formatDate: (v, o) => new Intl.DateTimeFormat(intlLocale(defaultLocale), o).format(v),
      currency: fallbackCurrency,
      setCurrency: () => {},
      unitSystem: fallbackUnitSystem,
      setUnitSystem: () => {},
    };
  }
  return ctx;
}
