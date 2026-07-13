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

const fromCelsius = (val: number, unit: string): number => {
  if (unit === '°F') return (val * 9) / 5 + 32;
  if (unit === 'K') return val + 273.15;
  return val;
};

const DewPoint = () => {
  const { locale, unitSystem } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const [dryBulb, setDryBulb] = useState('25');
  const [temperatureUnit, setTemperatureUnit] = useState('°C');
  const [relativeHumidity, setRelativeHumidity] = useState('50');
  const [results, setResults] = useState<{
    dewPoint: number | null;
    absHumidity: number | null;
    wetBulb: number | null;
  }>({ dewPoint: null, absHumidity: null, wetBulb: null });

  useEffect(() => {
    if (isImperial) {
      setDryBulb('77');
      setTemperatureUnit('°F');
    } else {
      setDryBulb('25');
      setTemperatureUnit('°C');
    }
  }, [isImperial]);

  const calcDewPoint = (T: number, RH: number): number => {
    const a = 17.27;
    const b = 237.7;
    const alpha = Math.log(RH / 100) + (a * T) / (b + T);
    return (b * alpha) / (a - alpha);
  };

  const calcWetBulb = (T: number, RH: number): number => {
    return T * Math.atan(0.151977 * Math.sqrt(RH + 8.313659)) +
      Math.atan(T + RH) -
      Math.atan(RH - 1.676331) +
      0.00391838 * Math.pow(RH, 1.5) * Math.atan(0.023101 * RH) -
      4.686035;
  };

  const calcAbsHumidity = (T: number, Td: number): number => {
    const es = 6.112 * Math.exp((17.67 * Td) / (Td + 243.5));
    const P = 1013.25;
    return (0.622 * es) / (P - es) * (273.15 / (T + 273.15)) * 1000;
  };

  const handleCalculate = useCallback(() => {
    const Traw = parseFloat(dryBulb);
    const RH = parseFloat(relativeHumidity);
    if (isNaN(Traw) || isNaN(RH) || RH < 0 || RH > 100) {
      setResults({ dewPoint: null, absHumidity: null, wetBulb: null });
      return;
    }
    const T = toCelsius(Traw, temperatureUnit);
    const Td = calcDewPoint(T, RH);
    const Tw = calcWetBulb(T, RH);
    const ah = calcAbsHumidity(T, Td);
    setResults({
      dewPoint: Td,
      absHumidity: ah,
      wetBulb: Tw,
    });
  }, [dryBulb, relativeHumidity, temperatureUnit]);

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
              <Label>{L('건구 온도', 'Dry Bulb Temperature')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={dryBulb}
                  onChange={(e) => setDryBulb(e.target.value)}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label="Dry Bulb Temperature unit"
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

            <div className="space-y-2">
              <Label>{L('상대 습도', 'Relative Humidity')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={relativeHumidity}
                  onChange={(e) => setRelativeHumidity(e.target.value)}
                  min={0}
                  max={100}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border-y border-r border-gray-300 dark:border-gray-600 shrink-0 w-12 text-sm">
                  %
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
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {L('이슬점 온도', 'Dew Point Temperature')}
                </span>
                <span className="text-4xl font-bold text-primary">
                  {results.dewPoint !== null ? fromCelsius(results.dewPoint, temperatureUnit).toFixed(2) : '-'}
                </span>
                <span className="text-sm font-normal text-muted-foreground mt-1">{temperatureUnit}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('절대 습도', 'Absolute Humidity')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {results.absHumidity !== null ? results.absHumidity.toFixed(4) : '-'}{' '}
                  <span className="text-xs font-normal">g/m³</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('습구 온도', 'Wet Bulb Temperature')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {results.wetBulb !== null ? fromCelsius(results.wetBulb, temperatureUnit).toFixed(2) : '-'}{' '}
                  <span className="text-xs font-normal">{temperatureUnit}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DewPoint;
