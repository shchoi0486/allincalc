'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

export default function RadiationHeatCalculator() {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.radiationHeat;

  // Unit system state (global)
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [emissivity, setEmissivity] = useState('0.9'); // epsilon
  const [area, setArea] = useState('2'); // A
  const [t1, setT1] = useState('200'); // Object Temp
  const [t2, setT2] = useState('25'); // Surroundings Temp

  // Per-input unit selection
  const [areaUnit, setAreaUnit] = useState<string>('m²');
  const [t1Unit, setT1Unit] = useState<string>('°C');
  const [t2Unit, setT2Unit] = useState<string>('°C');

  // Results
  const [heatTransfer, setHeatTransfer] = useState<number | null>(null);
  const [playing, setPlaying] = useState<boolean>(true);

  // Conversion maps (to SI base)
  const AREA_TO_M2: Record<string, number> = {
    'm²': 1,
    'cm²': 0.0001,
    'ft²': 0.09290304,
    'in²': 0.00064516,
  };
  // Absolute temperature -> Kelvin (offset based)
  const TEMP_TO_K: Record<string, (v: number) => number> = {
    '°C': (v) => v + 273.15,
    '°F': (v) => (v - 32) * 5 / 9 + 273.15,
    'K': (v) => v,
  };

  const AREA_UNITS = ['m²', 'cm²', 'ft²', 'in²'];
  const TEMP_UNITS = ['°C', '°F', 'K'];

  useEffect(() => {
    if (isImperial) {
      setArea('21.5'); // ~2m2 in ft2
      setT1('392'); // 200C in F
      setT2('77'); // 25C in F
      setAreaUnit('ft²');
      setT1Unit('°F');
      setT2Unit('°F');
    } else {
      setArea('2');
      setT1('200');
      setT2('25');
      setAreaUnit('m²');
      setT1Unit('°C');
      setT2Unit('°C');
    }
  }, [isImperial]);

  const calculate = () => {
    const e = parseFloat(emissivity);
    const A = parseFloat(area);
    const T1_input = parseFloat(t1);
    const T2_input = parseFloat(t2);

    if (isNaN(e) || isNaN(A) || isNaN(T1_input) || isNaN(T2_input) || e < 0 || e > 1) {
      setHeatTransfer(null);
      return;
    }

    // Stefan-Boltzmann law in SI base (W). sigma = 5.67 * 10^-8 W/(m2 K^4)
    const A_m2 = A * (AREA_TO_M2[areaUnit] ?? 1);
    const T1 = (TEMP_TO_K[t1Unit] ?? ((v: number) => v + 273.15))(T1_input);
    const T2 = (TEMP_TO_K[t2Unit] ?? ((v: number) => v + 273.15))(T2_input);

    const sigma = 5.67e-8;
    const Q_W = e * sigma * A_m2 * (Math.pow(T1, 4) - Math.pow(T2, 4));

    // Display in W (metric) or BTU/hr (imperial)
    setHeatTransfer(isImperial ? Q_W * 3.412141633 : Q_W);
    setPlaying(true);
  };

  const heatRateUnit = isImperial ? 'BTU/hr' : 'W';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            ☀️ {t?.title || 'Radiation Heat Transfer'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the net radiation heat transfer using the Stefan-Boltzmann Law.'}
        </p>

        {/* Surface Area */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.area || 'Surface Area (A)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.area || 'Surface Area (A)'} unit`}
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              className={unitSelectClass}
            >
              {AREA_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Object Temp */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.t1 || 'Object Temperature (T₁)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={t1}
              onChange={(e) => setT1(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.t1 || 'Object Temperature (T₁)'} unit`}
              value={t1Unit}
              onChange={(e) => setT1Unit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Surroundings Temp */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.t2 || 'Surroundings Temp (T₂)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={t2}
              onChange={(e) => setT2(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.t2 || 'Surroundings Temp (T₂)'} unit`}
              value={t2Unit}
              onChange={(e) => setT2Unit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={calculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {dict?.common?.calculate || 'Calculate'}
          </Button>
        </div>
      </div>

      {/* Right: Results & Visualization */}
      <div className="flex flex-col gap-6 h-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex-1">
          <h3 className="text-xl font-semibold mb-6 flex items-center shrink-0">
            ✅ {dict?.common?.result || 'Calculation Result'}
          </h3>

          <div className={`p-6 rounded-lg border flex flex-col items-center justify-center mb-6
            ${heatTransfer !== null && heatTransfer < 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t?.results?.heatTransfer || 'Net Heat Transfer (Q)'}
              {heatTransfer !== null && (heatTransfer < 0 ? ' (Object is absorbing)' : ' (Object is emitting)')}
            </span>
            <span className={`text-4xl font-bold ${heatTransfer !== null && heatTransfer < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {heatTransfer !== null ? Math.abs(heatTransfer).toFixed(2) : '-'} <span className="text-lg font-normal ml-1">{heatRateUnit}</span>
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {t?.visualization?.title || 'Radiation Process'}
              </h4>
              {heatTransfer !== null && (
                <button
                  type="button"
                  onClick={() => setPlaying((p) => !p)}
                  aria-label={playing ? 'Pause animation' : 'Play animation'}
                  className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {playing ? '⏸ ' + (locale === 'ko' ? '일시정지' : 'Pause') : '▶ ' + (locale === 'ko' ? '재생' : 'Play')}
                </button>
              )}
            </div>
            {/* Radiation Diagram */}
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">

              {/* Surroundings */}
              <div className="absolute inset-0 border-8 border-gray-200 dark:border-gray-600 flex justify-between p-2">
                <span className="text-xs font-mono font-bold text-gray-500">Surroundings: {t2}{t2Unit}</span>
              </div>

              {/* Central Object */}
              <div className="relative z-10 w-20 h-20 rounded-full border-4 border-gray-800 dark:border-gray-200 flex items-center justify-center shadow-lg"
                   style={{
                     backgroundColor: heatTransfer !== null && heatTransfer > 0 ? '#fca5a5' : '#93c5fd', // red-300 or blue-300
                   }}>
                <span className="font-bold text-gray-900">{t1}{t1Unit}</span>
              </div>

              {/* Radiation Waves */}
              {heatTransfer !== null && heatTransfer > 0 && (
                <div className={"absolute inset-0 flex items-center justify-center pointer-events-none" + (playing ? " animate-pulse" : "")}>
                  {/* Outward arrows */}
                  <div className="absolute text-red-500 -mt-24 text-2xl">↑</div>
                  <div className="absolute text-red-500 mt-24 text-2xl">↓</div>
                  <div className="absolute text-red-500 -ml-24 text-2xl">←</div>
                  <div className="absolute text-red-500 ml-24 text-2xl">→</div>
                  <div className="absolute top-1/4 left-1/4 text-red-500 text-xl rotate-[-45deg]">↑</div>
                  <div className="absolute bottom-1/4 right-1/4 text-red-500 text-xl rotate-[-45deg]">↓</div>
                </div>
              )}

              {heatTransfer !== null && heatTransfer < 0 && (
                <div className={"absolute inset-0 flex items-center justify-center pointer-events-none" + (playing ? " animate-pulse" : "")}>
                  {/* Inward arrows */}
                  <div className="absolute text-blue-500 -mt-16 text-2xl">↓</div>
                  <div className="absolute text-blue-500 mt-16 text-2xl">↑</div>
                  <div className="absolute text-blue-500 -ml-16 text-2xl">→</div>
                  <div className="absolute text-blue-500 ml-16 text-2xl">←</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
