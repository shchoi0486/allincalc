'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const units = ['mg', 'g', 'kg', 'ton', 'oz', 'lb'] as const;
type Unit = typeof units[number];

const toGrams: Record<Unit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  ton: 1000000,
  oz: 28.3495,
  lb: 453.592,
};

function convertWeight(value: number, fromUnit: Unit): Record<Unit, number> {
  const grams = value * toGrams[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = grams / toGrams[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function WeightConverter() {
  const { dict } = useI18n();
  const t = dict.weightConverter;
  const pathname = usePathname();
  const isKo = pathname.startsWith('/ko');

  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>(isKo ? 'kg' : 'lb');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertWeight(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="weightValue" className="w-24">{t.inputLabel}</label>
        <Input
          id="weightValue"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="flex-grow"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as Unit)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {units.map((u) => (
        <div key={u} className="flex items-center justify-between p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">{t.unitLabels[u]}</span>
          <span className="text-sm font-bold text-primary">{formatNumber(results[u] ?? 0)} {u}</span>
        </div>
      ))}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p dangerouslySetInnerHTML={{ __html: t.calculatorDescription.p1 }} />
        <p>{t.calculatorDescription.p2}</p>
        <p>{t.calculatorDescription.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.calculatorDescription.note}
        </p>
        <TermGlossary items={t.glossary} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formulaTitle}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 kg = 1,000 g = 1,000,000 mg</p>
            <p className="font-mono text-sm">1 ton = 1,000 kg</p>
            <p className="font-mono text-sm">1 oz = 28.3495 g</p>
            <p className="font-mono text-sm">1 lb = 16 oz = 453.592 g</p>
            <p className="font-mono text-sm">1 kg ≈ 2.2046 lb</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{dict.unitConverter.formulaTitle3}</h4>
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
            {t.tips.items1.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title2}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items2.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title3}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items3.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title4}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items4.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title5}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items5.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title6}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items6.map((item: string, i: number) => <li key={i}>{item}</li>)}
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
