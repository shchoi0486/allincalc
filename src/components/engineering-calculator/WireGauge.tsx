'use client';

import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const WireGauge = () => {
  const { locale, unitSystem } = useI18n();
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const isImperial = unitSystem === 'imperial';

  const LENGTH_TO_MM: Record<string, number> = {
    mm: 1,
    cm: 10,
    m: 1000,
    in: 25.4,
    ft: 304.8,
  };
  const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

  const awgData: Record<number, { diameterMm: number; resistanceOhmPerKm: number }> = {
    0: { diameterMm: 8.251, resistanceOhmPerKm: 0.1563 },
    1: { diameterMm: 7.348, resistanceOhmPerKm: 0.1970 },
    2: { diameterMm: 6.544, resistanceOhmPerKm: 0.2485 },
    3: { diameterMm: 5.827, resistanceOhmPerKm: 0.3133 },
    4: { diameterMm: 5.189, resistanceOhmPerKm: 0.3951 },
    5: { diameterMm: 4.621, resistanceOhmPerKm: 0.4982 },
    6: { diameterMm: 4.115, resistanceOhmPerKm: 0.6282 },
    7: { diameterMm: 3.665, resistanceOhmPerKm: 0.7921 },
    8: { diameterMm: 3.264, resistanceOhmPerKm: 0.9987 },
    9: { diameterMm: 2.906, resistanceOhmPerKm: 1.259 },
    10: { diameterMm: 2.588, resistanceOhmPerKm: 1.588 },
    11: { diameterMm: 2.305, resistanceOhmPerKm: 2.003 },
    12: { diameterMm: 2.053, resistanceOhmPerKm: 2.525 },
    13: { diameterMm: 1.828, resistanceOhmPerKm: 3.184 },
    14: { diameterMm: 1.628, resistanceOhmPerKm: 4.016 },
    15: { diameterMm: 1.450, resistanceOhmPerKm: 5.064 },
    16: { diameterMm: 1.291, resistanceOhmPerKm: 6.385 },
    17: { diameterMm: 1.150, resistanceOhmPerKm: 8.051 },
    18: { diameterMm: 1.024, resistanceOhmPerKm: 10.15 },
    19: { diameterMm: 0.912, resistanceOhmPerKm: 12.80 },
    20: { diameterMm: 0.812, resistanceOhmPerKm: 16.14 },
    21: { diameterMm: 0.723, resistanceOhmPerKm: 20.36 },
    22: { diameterMm: 0.644, resistanceOhmPerKm: 25.67 },
    23: { diameterMm: 0.573, resistanceOhmPerKm: 32.37 },
    24: { diameterMm: 0.511, resistanceOhmPerKm: 40.81 },
    25: { diameterMm: 0.455, resistanceOhmPerKm: 51.47 },
    26: { diameterMm: 0.405, resistanceOhmPerKm: 64.90 },
    27: { diameterMm: 0.361, resistanceOhmPerKm: 81.73 },
    28: { diameterMm: 0.321, resistanceOhmPerKm: 103.1 },
    29: { diameterMm: 0.286, resistanceOhmPerKm: 130.0 },
    30: { diameterMm: 0.255, resistanceOhmPerKm: 163.9 },
    31: { diameterMm: 0.227, resistanceOhmPerKm: 206.7 },
    32: { diameterMm: 0.202, resistanceOhmPerKm: 260.8 },
    33: { diameterMm: 0.180, resistanceOhmPerKm: 328.9 },
    34: { diameterMm: 0.160, resistanceOhmPerKm: 414.8 },
    35: { diameterMm: 0.143, resistanceOhmPerKm: 523.1 },
    36: { diameterMm: 0.127, resistanceOhmPerKm: 659.6 },
    37: { diameterMm: 0.113, resistanceOhmPerKm: 831.2 },
    38: { diameterMm: 0.101, resistanceOhmPerKm: 1049 },
    39: { diameterMm: 0.0897, resistanceOhmPerKm: 1325 },
    40: { diameterMm: 0.0799, resistanceOhmPerKm: 1669 },
  };

  const [inputMode, setInputMode] = useState<'awg' | 'diameter'>('awg');
  const [awg, setAwg] = useState('14');
  const [diameterMm, setDiameterMm] = useState('1.628'); // entered value in diameterUnit
  const [diameterUnit, setDiameterUnit] = useState<string>('mm');
  const [results, setResults] = useState<{
    gauge: number | null;
    diameterMm: number | null;
    diameterMils: number | null;
    areaMm2: number | null;
    areaCmil: number | null;
    resPerKm: number | null;
    resPerKft: number | null;
  } | null>(null);

  const handleCalculate = useCallback(() => {
    let gauge: number;
    let diamMm: number;
    let resPerKm: number;

    if (inputMode === 'awg') {
      gauge = parseInt(awg, 10);
      if (isNaN(gauge) || gauge < 0 || gauge > 40) {
        setResults(null);
        return;
      }
      const data = awgData[gauge];
      diamMm = data.diameterMm;
      resPerKm = data.resistanceOhmPerKm;
    } else {
      diamMm = parseFloat(diameterMm) * (LENGTH_TO_MM[diameterUnit] ?? 1);
      if (isNaN(diamMm) || diamMm <= 0) {
        setResults(null);
        return;
      }
      resPerKm = NaN;
      for (const [g, d] of Object.entries(awgData)) {
        if (Math.abs(d.diameterMm - diamMm) < 0.001) {
          gauge = parseInt(g, 10);
          resPerKm = d.resistanceOhmPerKm;
          break;
        }
      }
      if (isNaN(resPerKm)) {
        gauge = -1;
        const R0 = 0.1563;
        resPerKm = R0 * Math.pow(200 / (diamMm / 0.127), 2);
      }
    }

    const diamMils = diamMm / 0.0254;
    const areaMm2 = Math.PI * (diamMm / 2) * (diamMm / 2);
    const areaCmil = diamMils * diamMils;
    const resPerKft = resPerKm * 0.3048;

    setResults({
      gauge: gauge!,
      diameterMm: diamMm,
      diameterMils: diamMils,
      areaMm2: areaMm2,
      areaCmil: areaCmil,
      resPerKm: resPerKm,
      resPerKft: resPerKft,
    });
  }, [inputMode, awg, diameterMm, diameterUnit]);

  const diameterDisplayUnit = isImperial ? 'in' : 'mm';
  const diameterDisplayValue = results ? (isImperial ? results.diameterMm! / 25.4 : results.diameterMm!) : null;

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 className="font-semibold text-lg border-b border-primary/20 pb-2 flex-1">
                {L('입력', 'Inputs')}
              </h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{L('입력 모드', 'Input Mode')}</Label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode('awg')}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
                    inputMode === 'awg'
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  AWG
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('diameter')}
                  className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
                    inputMode === 'diameter'
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {L('직경 입력', 'Diameter Input')}
                </button>
              </div>
            </div>

            {inputMode === 'awg' ? (
              <div className="space-y-2">
                <Label>{L('AWG 게이지 번호', 'AWG Gauge Number')}</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={awg}
                    onChange={(e) => setAwg(e.target.value)}
                    min={0}
                    max={40}
                    className="min-w-0"
                  />
                  <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-12 text-sm">
                    AWG
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{L('선경', 'Wire Diameter')}</Label>
                <div className="flex min-w-0">
                  <Input
                    type="number"
                    value={diameterMm}
                    onChange={(e) => setDiameterMm(e.target.value)}
                    min={0.01}
                    className="min-w-0 flex-1 rounded-r-none"
                  />
                  <select
                    aria-label={`${L('선경', 'Wire Diameter')} unit`}
                    value={diameterUnit}
                    onChange={(e) => setDiameterUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {LENGTH_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

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
            {!results ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                {L(' 값을 입력하고 계산 버튼을 누르세요', 'Enter a value and press Calculate')}
              </p>
            ) : (
              <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">AWG</span>
                  <span className="text-sm font-bold text-primary">
                    {results.gauge !== null && results.gauge >= 0 ? `${results.gauge} AWG` : L('사용자 정의', '(custom)')}
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{L('직경', 'Diameter')}</span>
                  <span className="text-sm font-bold text-primary">
                    {diameterDisplayValue?.toFixed(3)} {diameterDisplayUnit} ({results.diameterMils?.toFixed(1)} mils)
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{L('단면적', 'Area')}</span>
                  <span className="text-sm font-bold text-primary">
                    {results.areaMm2?.toFixed(4)} mm² ({results.areaCmil?.toFixed(0)} cmil)
                  </span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{L('저항', 'Resistance')}</span>
                  <span className="text-sm font-bold text-primary">
                    {results.resPerKm?.toFixed(4)} Ω/km ({results.resPerKft?.toFixed(4)} Ω/kft)
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WireGauge;
