'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LMTDCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.lmtd;

  const [hotIn, setHotIn] = useState('100');
  const [hotInUnit, setHotInUnit] = useState('°C');
  const [hotOut, setHotOut] = useState('60');
  const [hotOutUnit, setHotOutUnit] = useState('°C');
  const [coldIn, setColdIn] = useState('20');
  const [coldInUnit, setColdInUnit] = useState('°C');
  const [coldOut, setColdOut] = useState('40');
  const [coldOutUnit, setColdOutUnit] = useState('°C');
  const [flowType, setFlowType] = useState<string>('counter'); // 'counter' or 'parallel'

  const [deltaT1, setDeltaT1] = useState(0);
  const [deltaT2, setDeltaT2] = useState(0);
  const [lmtd, setLmtd] = useState(0);

  const isImperial = unitSystem === 'imperial';

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setHotIn('212');
      setHotInUnit('°F');
      setHotOut('140');
      setHotOutUnit('°F');
      setColdIn('68');
      setColdInUnit('°F');
      setColdOut('104');
      setColdOutUnit('°F');
    } else {
      setHotIn('100');
      setHotInUnit('°C');
      setHotOut('60');
      setHotOutUnit('°C');
      setColdIn('20');
      setColdInUnit('°C');
      setColdOut('40');
      setColdOutUnit('°C');
    }
  }, [isImperial]);

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
  const tempUnit = isImperial ? '°F' : '°C';

  const handleCalculate = useCallback(() => {
    const ThIn = toC(parseFloat(hotIn), hotInUnit);
    const ThOut = toC(parseFloat(hotOut), hotOutUnit);
    const TcIn = toC(parseFloat(coldIn), coldInUnit);
    const TcOut = toC(parseFloat(coldOut), coldOutUnit);

    let dt1 = 0;
    let dt2 = 0;

    if (flowType === 'counter') {
      dt1 = ThIn - TcOut;
      dt2 = ThOut - TcIn;
    } else {
      // parallel
      dt1 = ThIn - TcIn;
      dt2 = ThOut - TcOut;
    }

    setDeltaT1(diffFromC(dt1, tempUnit));
    setDeltaT2(diffFromC(dt2, tempUnit));

    if (dt1 <= 0 || dt2 <= 0) {
      setLmtd(0); // Invalid physically for LMTD calculation
    } else if (Math.abs(dt1 - dt2) < 0.001) {
      setLmtd(diffFromC(dt1, tempUnit)); // When dt1 = dt2
    } else {
      const calcLmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
      setLmtd(diffFromC(calcLmtd, tempUnit));
    }
  }, [hotIn, hotInUnit, hotOut, hotOutUnit, coldIn, coldInUnit, coldOut, coldOutUnit, flowType, tempUnit]);

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
              <Label>{t?.inputs?.flowType || 'Flow Configuration'}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={flowType}
                onChange={(e) => setFlowType(e.target.value)}
              >
                <option value="counter">{locale === 'ko' ? 'Counter Flow (대향류)' : 'Counter Flow'}</option>
                <option value="parallel">{locale === 'ko' ? 'Parallel Flow (평행류)' : 'Parallel Flow'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-red-600">{t?.inputs?.hotIn || 'Hot In'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={hotIn} onChange={(e) => setHotIn(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.hotIn || 'Hot In'} unit`}
                    value={hotInUnit}
                    onChange={(e) => setHotInUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {TEMP_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-red-600">{t?.inputs?.hotOut || 'Hot Out'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={hotOut} onChange={(e) => setHotOut(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.hotOut || 'Hot Out'} unit`}
                    value={hotOutUnit}
                    onChange={(e) => setHotOutUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {TEMP_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-blue-600">{t?.inputs?.coldIn || 'Cold In'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={coldIn} onChange={(e) => setColdIn(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.coldIn || 'Cold In'} unit`}
                    value={coldInUnit}
                    onChange={(e) => setColdInUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {TEMP_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-blue-600">{t?.inputs?.coldOut || 'Cold Out'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={coldOut} onChange={(e) => setColdOut(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.coldOut || 'Cold Out'} unit`}
                    value={coldOutUnit}
                    onChange={(e) => setColdOutUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {TEMP_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {(deltaT1 <= 0 || deltaT2 <= 0) && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
                Invalid temperature differences. Ensure Hot &gt; Cold at all points.
              </div>
            )}

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.deltaT1 || 'ΔT₁'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {deltaT1.toFixed(1)} <span className="text-xs font-normal">{tempUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.deltaT2 || 'ΔT₂'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {deltaT2.toFixed(1)} <span className="text-xs font-normal">{tempUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-2">
                    {t?.results?.lmtd || 'LMTD'}
                  </span>
                  <div className="text-3xl font-bold text-primary">
                    {lmtd > 0 ? lmtd.toFixed(2) : 'Error'} <span className="text-sm font-normal text-muted-foreground">{tempUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Temperature Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                  {/* Axis */}
                  <line x1="40" y1="180" x2="360" y2="180" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="180" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  <text x="200" y="195" fill="#64748b" fontSize="12" textAnchor="middle">Position along Heat Exchanger</text>
                  <text x="25" y="100" fill="#64748b" fontSize="12" textAnchor="middle" transform="rotate(-90 25,100)">Temperature</text>

                  {(() => {
                    const minTemp = Math.min(parseFloat(coldIn), parseFloat(coldOut));
                    const maxTemp = Math.max(parseFloat(hotIn), parseFloat(hotOut));
                    const range = Math.max(maxTemp - minTemp, 1);

                    const getY = (temp: number) => 170 - ((temp - minTemp) / range) * 140;

                    const hotStart = getY(parseFloat(hotIn));
                    const hotEnd = getY(parseFloat(hotOut));

                    const coldStart = flowType === 'counter' ? getY(parseFloat(coldOut)) : getY(parseFloat(coldIn));
                    const coldEnd = flowType === 'counter' ? getY(parseFloat(coldIn)) : getY(parseFloat(coldOut));

                    return (
                      <>
                        {/* Hot Fluid Line */}
                        <path d={`M 50 ${hotStart} C 150 ${hotStart * 0.7 + hotEnd * 0.3}, 250 ${hotStart * 0.3 + hotEnd * 0.7}, 350 ${hotEnd}`} fill="none" stroke="#ef4444" strokeWidth="3" />
                        <circle cx="50" cy={hotStart} r="4" fill="#ef4444" />
                        <circle cx="350" cy={hotEnd} r="4" fill="#ef4444" />
                        <text x="50" y={hotStart - 10} fill="#ef4444" fontSize="12" textAnchor="middle">Th,in</text>
                        <text x="350" y={hotEnd - 10} fill="#ef4444" fontSize="12" textAnchor="middle">Th,out</text>

                        {/* Cold Fluid Line */}
                        <path d={`M 50 ${coldStart} C 150 ${coldStart * 0.7 + coldEnd * 0.3}, 250 ${coldStart * 0.3 + coldEnd * 0.7}, 350 ${coldEnd}`} fill="none" stroke="#3b82f6" strokeWidth="3" />
                        <circle cx="50" cy={coldStart} r="4" fill="#3b82f6" />
                        <circle cx="350" cy={coldEnd} r="4" fill="#3b82f6" />

                        {flowType === 'counter' ? (
                          <>
                            <text x="50" y={coldStart + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,out</text>
                            <text x="350" y={coldEnd + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,in</text>
                            {/* Arrows */}
                            <polygon points="200,180 190,175 190,185" fill="#94a3b8" /> {/* X-axis arrow */}
                            <polygon points="190,180 200,175 200,185" fill="#3b82f6" transform={`translate(0, ${(getY((parseFloat(coldIn) + parseFloat(coldOut)) / 2) - 180)})`} /> {/* Cold flow arrow left */}
                            <polygon points="200,180 190,175 190,185" fill="#ef4444" transform={`translate(0, ${(getY((parseFloat(hotIn) + parseFloat(hotOut)) / 2) - 180)})`} /> {/* Hot flow arrow right */}
                          </>
                        ) : (
                          <>
                            <text x="50" y={coldStart + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,in</text>
                            <text x="350" y={coldEnd + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,out</text>
                            {/* Arrows */}
                            <polygon points="200,180 190,175 190,185" fill="#3b82f6" transform={`translate(0, ${(getY((parseFloat(coldIn) + parseFloat(coldOut)) / 2) - 180)})`} /> {/* Cold flow arrow right */}
                            <polygon points="200,180 190,175 190,185" fill="#ef4444" transform={`translate(0, ${(getY((parseFloat(hotIn) + parseFloat(hotOut)) / 2) - 180)})`} /> {/* Hot flow arrow right */}
                          </>
                        )}

                        {/* Delta T lines */}
                        <line x1="60" y1={hotStart} x2="60" y2={coldStart} stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                        <text x="70" y={(hotStart + coldStart) / 2} fill="#10b981" fontSize="10">ΔT₁</text>

                        <line x1="340" y1={hotEnd} x2="340" y2={coldEnd} stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                        <text x="330" y={(hotEnd + coldEnd) / 2} fill="#10b981" fontSize="10" textAnchor="end">ΔT₂</text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LMTDCalculator;
