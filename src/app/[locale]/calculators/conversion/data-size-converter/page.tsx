'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type Unit = typeof units[number];

const toBytes: Record<Unit, number> = {
  Byte: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

function convertDataSize(value: number, fromUnit: Unit): Record<Unit, number> {
  const bytes = value * toBytes[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = bytes / toBytes[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n >= 1e15) return n.toExponential(2);
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(6).replace(/\.?0+$/, '');
}

export default function DataSizeConverter() {
  const { dict } = useI18n();
  const t = dict.dataSizeConverter;

  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('GB');
  const [results, setResults] = useState<Record<Unit, number>>({
    Byte: 0, KB: 0, MB: 0, GB: 1, TB: 0, PB: 0,
  });

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertDataSize(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="dataValue" className="w-24">{t.inputLabel}</label>
        <Input
          id="dataValue"
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
          <span className="text-sm font-bold text-primary">{formatNumber(results[u])} {u}</span>
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
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {t.calculatorDescription.note}
        </p>
        <TermGlossary items={t.glossary} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{t.formulaTitle}</h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center font-mono text-lg">1 KB = 1,024 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 MB = 1,024 KB = 1,048,576 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 GB = 1,024 MB = 1,073,741,824 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 TB = 1,024 GB</p>
            <p className="text-center font-mono text-lg mt-2">1 PB = 1,024 TB</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>Note:</strong> {t.formulaNote}
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{t.tips.title1}</h4>
          <ul className="space-y-3">
            <li className="p-3 bg-muted rounded-lg border-l-4 border-primary">
              <p className="font-semibold text-sm">{t.tips.items1[0]}</p>
              <p className="text-xs mt-1">
                {t.tips.items1[1]}
              </p>
            </li>
            <li className="p-3 bg-muted rounded-lg border-l-4 border-primary">
              <p className="font-semibold text-sm">{t.tips.title2}</p>
              <p className="text-xs mt-1">
                {t.tips.items2[0]}
              </p>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{t.tips.title3}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items3.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{t.tips.title4}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items4.map((item: string, i: number) => <li key={i}>{item}</li>)}
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
