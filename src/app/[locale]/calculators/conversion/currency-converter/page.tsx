'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

import { useRouter, usePathname } from 'next/navigation';

const currencies = ['USD', 'EUR', 'JPY', 'CNY', 'KRW', 'GBP'] as const;
type Currency = typeof currencies[number];

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  GBP: '£',
};

// Approximate exchange rates (as of 2024, relative to USD)
const toUSD: Record<Currency, number> = {
  USD: 1,
  EUR: 1.08,
  JPY: 0.0067,
  CNY: 0.14,
  KRW: 0.00074,
  GBP: 1.27,
};

function convertCurrency(value: number, fromCurrency: Currency): Record<Currency, number> {
  const usd = value * toUSD[fromCurrency];
  const result: Record<string, number> = {};
  currencies.forEach((c) => {
    result[c] = usd / toUSD[c];
  });
  return result as Record<Currency, number>;
}

function formatCurrency(value: number, currency: Currency): string {
  const symbol = currencySymbols[currency];
  if (currency === 'KRW' || currency === 'JPY') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CurrencyConverter() {
  const { dict } = useI18n();
  const t = dict.currencyConverter;
  const pathname = usePathname();
  const isKo = pathname.startsWith('/ko');

  const [value, setValue] = useState('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>(isKo ? 'KRW' : 'USD');
  const [results, setResults] = useState<Record<Currency, number>>({} as Record<Currency, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertCurrency(num, fromCurrency));
    } else {
      const empty: Record<string, number> = {};
      currencies.forEach((c) => { empty[c] = 0; });
      setResults(empty as Record<Currency, number>);
    }
  }, [value, fromCurrency]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="currencyValue" className="w-24">{t.inputLabel}</label>
        <Input
          id="currencyValue"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="flex-grow"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value as Currency)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {currencies.map((c) => (
        <div key={c} className="flex items-center justify-between p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">{t.currencyNames[c]}</span>
          <span className="text-sm font-bold text-primary">{formatCurrency(results[c] ?? 0, c)}</span>
        </div>
      ))}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.calculatorDescription.p1}</strong>
        </p>
        <p>
          {t.calculatorDescription.p2}
        </p>
        <p>
          {t.calculatorDescription.p3}
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.calculatorDescription.note}
        </p>
        <TermGlossary items={[
          { term: t.glossary[0].term, desc: t.glossary[0].desc },
          { term: t.glossary[1].term, desc: t.glossary[1].desc },
          { term: t.glossary[2].term, desc: t.glossary[2].desc },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formulaTitle}</h4>
          <p>{t.formulaExample}</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">{t.formulaResult}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title1}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items1.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title2}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items2.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title3}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items3.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title4}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items4.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title5}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items5.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title6}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items6.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      variant="split"
      infoSection={infoSection}
    />
  );
}
