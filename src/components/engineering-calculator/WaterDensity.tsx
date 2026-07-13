'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const TEMPERATURE_UNITS = ['°C', '°F', 'K'];

const toCelsius = (val: number, unit: string): number => {
  if (unit === '°F') return (val - 32) * 5 / 9;
  if (unit === 'K') return val - 273.15;
  return val;
};

const WaterDensity = () => {
  const { locale, unitSystem } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const [temperature, setTemperature] = useState('20');
  const [temperatureUnit, setTemperatureUnit] = useState('°C');
  const [results, setResults] = useState<{
    densityKg: number | null;
    densityLbFt: number | null;
    specificWeight: number | null;
    dynamicViscosity: number | null;
  }>({ densityKg: null, densityLbFt: null, specificWeight: null, dynamicViscosity: null });

  useEffect(() => {
    if (isImperial) {
      setTemperature('68');
      setTemperatureUnit('°F');
    } else {
      setTemperature('20');
      setTemperatureUnit('°C');
    }
  }, [isImperial]);

  const calcDensityKg = (tC: number): number => {
    return (
      999.842594 +
      6.793952e-2 * tC -
      9.09529e-3 * tC * tC +
      1.001685e-4 * tC * tC * tC -
      1.120083e-6 * tC * tC * tC * tC
    );
  };

  const calcViscosity = (tC: number): number => {
    const tK = tC + 273.15;
    return 2.414e-5 * Math.pow(10, 247.8 / (tK - 140));
  };

  const handleCalculate = useCallback(() => {
    let tC = parseFloat(temperature);
    if (isNaN(tC)) {
      setResults({ densityKg: null, densityLbFt: null, specificWeight: null, dynamicViscosity: null });
      return;
    }
    tC = toCelsius(tC, temperatureUnit);
    const rho = calcDensityKg(tC);
    const lbFt = rho * 0.06242796;
    const gamma = rho * 9.80665 / 1000;
    const mu = calcViscosity(tC);
    setResults({ densityKg: rho, densityLbFt: lbFt, specificWeight: gamma, dynamicViscosity: mu });
  }, [temperature, temperatureUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap border-b pb-2">
              <h3 className="font-semibold text-lg shrink-0">
                {L('입력', 'Inputs')}
              </h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{L('온도', 'Temperature')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label="Temperature unit"
                  value={temperatureUnit}
                  onChange={(e) => setTemperatureUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TEMPERATURE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('밀도', 'Density')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.densityKg !== null
                    ? (isImperial ? results.densityLbFt!.toFixed(4) : results.densityKg.toFixed(4)) : '-'}{' '}
                  <span className="text-sm font-normal">{isImperial ? 'lb/ft³' : 'kg/m³'}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('비중량', 'Specific Weight')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.specificWeight !== null
                    ? (isImperial
                        ? (results.densityLbFt! * 1).toFixed(4)
                        : results.specificWeight.toFixed(4)) : '-'}{' '}
                  <span className="text-sm font-normal">{isImperial ? 'lbf/ft³' : 'kN/m³'}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('동점도', 'Dynamic Viscosity')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.dynamicViscosity !== null ? results.dynamicViscosity.toExponential(3) : '-'}{' '}
                  <span className="text-sm font-normal">Pa·s</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WaterDensity;
