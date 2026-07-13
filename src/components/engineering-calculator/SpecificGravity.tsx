'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const SpecificGravity = () => {
  const { locale } = useI18n();
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const [substanceDensity, setSubstanceDensity] = useState('1000');
  const [referenceTemp, setReferenceTemp] = useState('4');
  const [sg, setSg] = useState<number | null>(null);
  const [comparison, setComparison] = useState('');

  const waterDensityAtTemp = (tC: number): number => {
    return (
      999.842594 +
      6.793952e-2 * tC -
      9.09529e-3 * tC * tC +
      1.001685e-4 * tC * tC * tC -
      1.120083e-6 * tC * tC * tC * tC
    );
  };

  const handleCalculate = useCallback(() => {
    const rho = parseFloat(substanceDensity);
    const tRef = parseFloat(referenceTemp);
    if (isNaN(rho) || isNaN(tRef) || rho <= 0) {
      setSg(null);
      setComparison('');
      return;
    }
    const rhoWater = waterDensityAtTemp(tRef);
    const result = rho / rhoWater;
    setSg(result);
    if (result > 1.001) {
      setComparison(L('물보다 더 무겁습니다', 'Heavier than water'));
    } else if (result < 0.999) {
      setComparison(L('물보다 가볍습니다', 'Lighter than water'));
    } else {
      setComparison(L('물과 거의 같습니다', 'Approximately same as water'));
    }
  }, [substanceDensity, referenceTemp]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">
              {L('입력', 'Inputs')}
            </h3>

            <div className="space-y-2">
              <Label>{L('물질 밀도', 'Substance Density')}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={substanceDensity}
                  onChange={(e) => setSubstanceDensity(e.target.value)}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-16 text-sm">
                  kg/m³
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{L('기준 온도 (참조 수온)', 'Reference Temperature')}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={referenceTemp}
                  onChange={(e) => setReferenceTemp(e.target.value)}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-12 text-sm">
                  °C
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
            >
              {locale === 'ko' ? '계산하기' : 'Calculate'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4 bg-primary/5">
            <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">
              {L('계산 결과', 'Results')}
            </h3>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground mb-2">
                {L('비중 (SG)', 'Specific Gravity (SG)')}
              </span>
              <span className="text-4xl font-bold text-primary">
                {sg !== null ? sg.toFixed(4) : '-'}
              </span>
              {comparison && (
                <p className="text-sm text-muted-foreground mt-3">{comparison}</p>
              )}
            </div>
            {sg !== null && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border text-center">
                <p className="text-sm text-muted-foreground">
                  {L('참조 수온', 'Ref. Water Temp')}:{' '}
                  <span className="font-semibold">{referenceTemp}°C</span>
                  {' → '}
                  {L('참조 수 밀도', 'Ref. Water Density')}:{' '}
                  <span className="font-semibold">
                    {waterDensityAtTemp(parseFloat(referenceTemp)).toFixed(2)} kg/m³
                  </span>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SpecificGravity;
