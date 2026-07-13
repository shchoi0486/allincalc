'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const CoolingTowerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const t = dict?.common?.coolingTower;

  const [hotWater, setHotWater] = useState('35'); // °C or °F
  const [hotWaterUnit, setHotWaterUnit] = useState('°C');
  const [coldWater, setColdWater] = useState('25'); // °C or °F
  const [coldWaterUnit, setColdWaterUnit] = useState('°C');
  const [wetBulb, setWetBulb] = useState('20'); // °C or °F
  const [wetBulbUnit, setWetBulbUnit] = useState('°C');

  const [range, setRange] = useState(0);
  const [approach, setApproach] = useState(0);
  const [effectiveness, setEffectiveness] = useState(0);

  // Convert a temperature value from its unit to °C base
  const toC = (v: number, unit: string): number => {
    if (unit === '°F') return (v - 32) * 5 / 9;
    if (unit === 'K') return v - 273.15;
    return v; // °C
  };
  // Convert a temperature difference (in °C) to a display difference unit
  const diffFromC = (d: number, unit: string): number => {
    if (unit === '°F') return d * 9 / 5;
    return d; // °C and K share magnitude
  };

  const TEMP_UNITS = ['°C', '°F', 'K'];

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setHotWater('95');
      setHotWaterUnit('°F');
      setColdWater('77');
      setColdWaterUnit('°F');
      setWetBulb('68');
      setWetBulbUnit('°F');
    } else {
      setHotWater('35');
      setHotWaterUnit('°C');
      setColdWater('25');
      setColdWaterUnit('°C');
      setWetBulb('20');
      setWetBulbUnit('°C');
    }
  }, [isImperial]);

  const tempUnit = isImperial ? '°F' : '°C';

  const handleCalculate = useCallback(() => {
    const Th = toC(parseFloat(hotWater), hotWaterUnit);
    const Tc = toC(parseFloat(coldWater), coldWaterUnit);
    const Twb = toC(parseFloat(wetBulb), wetBulbUnit);
    if (Th > Tc && Tc >= Twb) {
      const r = Th - Tc;
      const a = Tc - Twb;
      const e = (r / (r + a)) * 100;

      setRange(diffFromC(r, tempUnit));
      setApproach(diffFromC(a, tempUnit));
      setEffectiveness(e);
    } else {
      setRange(0);
      setApproach(0);
      setEffectiveness(0);
    }
  }, [hotWater, hotWaterUnit, coldWater, coldWaterUnit, wetBulb, wetBulbUnit, tempUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.hotWater || 'Hot Water Temp In (T_hw)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={hotWater} onChange={(e) => setHotWater(e.target.value)} className="min-w-0 flex-1 rounded-r-none border-red-300" />
                <select
                  aria-label={`${t?.inputs?.hotWater || 'Hot Water Temp In (T_hw)'} unit`}
                  value={hotWaterUnit}
                  onChange={(e) => setHotWaterUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TEMP_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.coldWater || 'Cold Water Temp Out (T_cw)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={coldWater} onChange={(e) => setColdWater(e.target.value)} className="min-w-0 flex-1 rounded-r-none border-blue-300" />
                <select
                  aria-label={`${t?.inputs?.coldWater || 'Cold Water Temp Out (T_cw)'} unit`}
                  value={coldWaterUnit}
                  onChange={(e) => setColdWaterUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TEMP_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.wetBulb || 'Air Wet Bulb Temp (T_wb)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={wetBulb} onChange={(e) => setWetBulb(e.target.value)} className="min-w-0 flex-1 rounded-r-none border-green-300" />
                <select
                  aria-label={`${t?.inputs?.wetBulb || 'Air Wet Bulb Temp (T_wb)'} unit`}
                  value={wetBulbUnit}
                  onChange={(e) => setWetBulbUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TEMP_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.range || 'Cooling Range'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-500">{range.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Δ{tempUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.approach || 'Approach'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{approach.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Δ{tempUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.effectiveness || 'Effectiveness (η)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{effectiveness.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Cooling Tower Temperature Profile'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Base Lines */}
                  <line x1="150" y1="20" x2="150" y2="180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />

                  {/* Temps */}
                  {/* Hot Water */}
                  <circle cx="150" cy="40" r="6" fill="#ef4444" />
                  <text x="135" y="45" fill="#ef4444" fontSize="14" textAnchor="end" fontWeight="bold">T_hw ({hotWater}{hotWaterUnit})</text>
                  <path d="M 150 40 L 250 40" stroke="#ef4444" strokeWidth="2" />

                  {/* Cold Water */}
                  <circle cx="150" cy="120" r="6" fill="#3b82f6" />
                  <text x="135" y="125" fill="#3b82f6" fontSize="14" textAnchor="end" fontWeight="bold">T_cw ({coldWater}{coldWaterUnit})</text>
                  <path d="M 150 120 L 250 120" stroke="#3b82f6" strokeWidth="2" />

                  {/* Wet Bulb */}
                  <circle cx="150" cy="170" r="6" fill="#10b981" />
                  <text x="135" y="175" fill="#10b981" fontSize="14" textAnchor="end" fontWeight="bold">T_wb ({wetBulb}{wetBulbUnit})</text>
                  <path d="M 150 170 L 250 170" stroke="#10b981" strokeWidth="2" />

                  {/* Ranges and Approach Brackets */}
                  <path d="M 260 40 L 270 40 L 270 120 L 260 120" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <text x="280" y="85" fill="#ef4444" fontSize="12" fontWeight="bold">Range</text>

                  <path d="M 260 120 L 270 120 L 270 170 L 260 170" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <text x="280" y="150" fill="#3b82f6" fontSize="12" fontWeight="bold">Approach</text>

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoolingTowerCalculator;
