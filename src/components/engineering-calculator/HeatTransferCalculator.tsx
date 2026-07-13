'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base (m², m, W/(m·K), K-deltaT, W)
const AREA_TO_M2: Record<string, number> = {
  'm²': 1,
  'cm²': 1e-4,
  'ft²': 0.09290304,
  'in²': 0.00064516,
};
const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};
const K_TO_SI: Record<string, number> = {
  'W/(m·K)': 1,
  'W/(cm·K)': 100,
  'BTU/(hr·ft·°F)': 1.730734666,
  'BTU·in/(hr·ft²·°F)': 0.144228,
  'kcal/(hr·m·°C)': 1.163,
};
const HEATRATE_TO_W: Record<string, number> = {
  W: 1,
  kW: 1000,
  'BTU/hr': 0.29307107,
  'kcal/hr': 1.163,
};
const HEATFLUX_TO_WM2: Record<string, number> = {
  'W/m²': 1,
  'kW/m²': 1000,
  'BTU/(hr·ft²)': 3.1545907,
};
// Temperature delta conversion factor (×5/9 for Fahrenheit/Rankine scales)
const TEMP_DELTA_FACTOR: Record<string, number> = {
  '°C': 1,
  K: 1,
  '°F': 5 / 9,
  '°R': 5 / 9,
};

const AREA_UNITS = ['m²', 'cm²', 'ft²', 'in²'];
const THICKNESS_UNITS = ['m', 'cm', 'mm', 'ft', 'in'];
const CONDUCTIVITY_UNITS = ['W/(m·K)', 'W/(cm·K)', 'BTU/(hr·ft·°F)', 'BTU·in/(hr·ft²·°F)'];
const TEMP_UNITS = ['°C', 'K', '°F', '°R'];
const HEATRATE_UNITS = ['W', 'kW', 'BTU/hr', 'kcal/hr'];
const HEATFLUX_UNITS = ['W/m²', 'kW/m²', 'BTU/(hr·ft²)'];

export default function HeatTransferCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.heatTransfer;
  const u = dict?.common?.heatTransfer?.units;
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [area, setArea] = useState('10'); // A
  const [thickness, setThickness] = useState('0.15'); // d
  const [conductivity, setConductivity] = useState('0.04'); // k
  const [t1, setT1] = useState('25'); // Hot Temp
  const [t2, setT2] = useState('5'); // Cold Temp

  // Per-input unit selection
  const [areaUnit, setAreaUnit] = useState('m²');
  const [thicknessUnit, setThicknessUnit] = useState('m');
  const [conductivityUnit, setConductivityUnit] = useState('W/(m·K)');
  const [tempUnit, setTempUnit] = useState('°C');
  const [heatRateUnit, setHeatRateUnit] = useState('W');
  const [heatFluxUnit, setHeatFluxUnit] = useState('W/m²');

  // Results (in selected display units)
  const [heatRate, setHeatRate] = useState<number | null>(null);
  const [heatFlux, setHeatFlux] = useState<number | null>(null);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setArea('100');
      setThickness('6');
      setConductivity('0.023');
      setT1('77');
      setT2('41');
      setAreaUnit('ft²');
      setThicknessUnit('in');
      setConductivityUnit('BTU/(hr·ft·°F)');
      setTempUnit('°F');
      setHeatRateUnit('BTU/hr');
      setHeatFluxUnit('BTU/(hr·ft²)');
    } else {
      setArea('10');
      setThickness('0.15');
      setConductivity('0.04');
      setT1('25');
      setT2('5');
      setAreaUnit('m²');
      setThicknessUnit('m');
      setConductivityUnit('W/(m·K)');
      setTempUnit('°C');
      setHeatRateUnit('W');
      setHeatFluxUnit('W/m²');
    }
  }, [isImperial]);

  const calculate = () => {
    const A = parseFloat(area);
    const d = parseFloat(thickness);
    const k = parseFloat(conductivity);
    const T_hot = parseFloat(t1);
    const T_cold = parseFloat(t2);

    if (isNaN(A) || isNaN(d) || isNaN(k) || isNaN(T_hot) || isNaN(T_cold) || d === 0) {
      setHeatRate(null);
      setHeatFlux(null);
      return;
    }

    // Convert to SI base
    const A_m2 = A * (AREA_TO_M2[areaUnit] ?? 1);
    const d_m = d * (LENGTH_TO_M[thicknessUnit] ?? 1);
    const k_SI = k * (K_TO_SI[conductivityUnit] ?? 1);
    const dT = Math.abs(T_hot - T_cold) * (TEMP_DELTA_FACTOR[tempUnit] ?? 1);

    // Fourier: Q = k * A * ΔT / d  (Watts)
    const Q_W = (k_SI * A_m2 * dT) / d_m;
    const q_Wm2 = Q_W / A_m2;

    setHeatRate(Q_W / (HEATRATE_TO_W[heatRateUnit] ?? 1));
    setHeatFlux(q_Wm2 / (HEATFLUX_TO_WM2[heatFluxUnit] ?? 1));
  };

  const unitSelectClass =
    'w-24 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-[10px] font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🌡️ {t?.title || 'Heat Conduction Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate heat transfer rate using Fourier\'s Law.'}
        </p>

        {/* Area */}
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
              aria-label={`${t?.inputs?.area || 'Surface Area (A)'} (${u?.area || 'Unit'})`}
              value={areaUnit}
              onChange={(e) => setAreaUnit(e.target.value)}
              className={unitSelectClass}
            >
              {AREA_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Thickness */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.thickness || 'Material Thickness (d)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.thickness || 'Material Thickness (d)'} (${u?.thickness || 'Unit'})`}
              value={thicknessUnit}
              onChange={(e) => setThicknessUnit(e.target.value)}
              className={unitSelectClass}
            >
              {THICKNESS_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Conductivity */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.conductivity || 'Thermal Conductivity (k)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={conductivity}
              onChange={(e) => setConductivity(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.conductivity || 'Thermal Conductivity (k)'} (${u?.conductivity || 'Unit'})`}
              value={conductivityUnit}
              onChange={(e) => setConductivityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {CONDUCTIVITY_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Hot Temp */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.t1 || 'Hot Temperature (T₁)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={t1}
              onChange={(e) => setT1(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.t1 || 'Hot Temperature (T₁)'} (${u?.temp || 'Unit'})`}
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cold Temp */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.t2 || 'Cold Temperature (T₂)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={t2}
              onChange={(e) => setT2(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.t2 || 'Cold Temperature (T₂)'} (${u?.temp || 'Unit'})`}
              value={tempUnit}
              onChange={(e) => setTempUnit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.heatRate || 'Heat Transfer Rate (Q)'}</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400 flex items-baseline gap-1">
                {heatRate !== null ? heatRate.toFixed(2) : '-'}
                <select
                  aria-label={`${t?.results?.heatRate || 'Heat Transfer Rate (Q)'} (${u?.heatRate || 'Unit'})`}
                  value={heatRateUnit}
                  onChange={(e) => setHeatRateUnit(e.target.value)}
                  className="text-sm font-normal bg-transparent border border-red-200 dark:border-red-800 rounded px-1 focus:outline-none focus:ring-1 focus:ring-red-500"
                >
                  {HEATRATE_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </span>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.heatFlux || 'Heat Flux (q)'}</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400 flex items-baseline gap-1">
                {heatFlux !== null ? heatFlux.toFixed(2) : '-'}
                <select
                  aria-label={`${t?.results?.heatFlux || 'Heat Flux (q)'} (${u?.heatFlux || 'Unit'})`}
                  value={heatFluxUnit}
                  onChange={(e) => setHeatFluxUnit(e.target.value)}
                  className="text-sm font-normal bg-transparent border border-orange-200 dark:border-orange-800 rounded px-1 focus:outline-none focus:ring-1 focus:ring-orange-500"
                >
                  {HEATFLUX_UNITS.map((unit) => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Temperature Gradient'}
            </h4>
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              <div className="absolute left-0 w-1/4 h-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-r border-red-300">
                <span className="text-red-600 font-bold">T₁: {t1}{tempUnit}</span>
              </div>

              <div className="absolute left-1/4 w-1/2 h-full bg-gray-300 dark:bg-gray-500 border-x-4 border-gray-400 dark:border-gray-400 flex flex-col items-center justify-between py-2">
                <span className="text-xs font-mono">k = {conductivity} {conductivityUnit}</span>
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line x1="0" y1="20%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="2" className="text-orange-500" strokeDasharray="4 4" />
                </svg>
                <div className="bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-xs z-10 font-bold text-orange-600">Q ➔</div>
                <span className="text-xs font-mono">d = {thickness} {thicknessUnit}</span>
              </div>

              <div className="absolute right-0 w-1/4 h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-l border-blue-300">
                <span className="text-blue-600 font-bold">T₂: {t2}{tempUnit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
