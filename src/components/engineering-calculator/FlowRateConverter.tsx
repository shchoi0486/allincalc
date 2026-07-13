'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const FlowRateConverter = () => {
  const { locale } = useI18n();
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const units = [
    { key: 'm3s', label: 'm³/s', factor: 1 },
    { key: 'm3h', label: 'm³/h', factor: 1 / 3600 },
    { key: 'Ls', label: 'L/s', factor: 0.001 },
    { key: 'Lmin', label: 'L/min', factor: 1 / 60000 },
    { key: 'Lh', label: 'L/h', factor: 1 / 3600000 },
    { key: 'gpm', label: 'gal/min (US)', factor: 6.30902e-5 },
    { key: 'gph', label: 'gal/h (US)', factor: 1.0515e-6 },
    { key: 'cfm', label: 'ft³/min (CFM)', factor: 0.000471947 },
    { key: 'cfs', label: 'ft³/s', factor: 0.0283168 },
    { key: 'bbld', label: 'bbl/day', factor: 1.84013e-6 },
  ];

  const [inputUnit, setInputUnit] = useState('m3s');
  const [inputValue, setInputValue] = useState('1');
  const [results, setResults] = useState<Record<string, number>>({});

  const handleCalculate = useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) {
      setResults({});
      return;
    }
    const srcFactor = units.find((u) => u.key === inputUnit)?.factor ?? 1;
    const baseFlow = val * srcFactor;
    const converted: Record<string, number> = {};
    for (const u of units) {
      converted[u.key] = baseFlow / u.factor;
    }
    setResults(converted);
  }, [inputUnit, inputValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">
              {L('입력', 'Inputs')}
            </h3>

            <div className="space-y-2">
              <Label>{L('값', 'Value')}</Label>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>{L('입력 단위', 'Input Unit')}</Label>
              <select
                value={inputUnit}
                onChange={(e) => setInputUnit(e.target.value)}
                className="w-full border rounded-md px-3 py-2 bg-background text-sm"
              >
                {units.map((u) => (
                  <option key={u.key} value={u.key}>
                    {u.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
            >
              {locale === 'ko' ? '변환하기' : 'Convert'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4 bg-primary/5">
            <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">
              {L('변환 결과', 'Conversion Results')}
            </h3>
            {Object.keys(results).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {L('변환할 값을 입력하세요', 'Enter a value to convert')}
              </p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {units.map((u) => (
                  <div
                    key={u.key}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border flex justify-between items-center"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {u.label}
                    </span>
                    <span className="text-sm font-bold text-primary">
                      {results[u.key] !== undefined
                        ? results[u.key] < 0.001 || results[u.key] > 1e9
                          ? results[u.key].toExponential(4)
                          : results[u.key].toFixed(6).replace(/\.?0+$/, '')
                        : '-'}
                      <span className="text-xs font-normal ml-1">{u.key}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FlowRateConverter;
