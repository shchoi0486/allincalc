'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base (mm for length, MPa for pressure/stress)
const LENGTH_TO_MM: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};
const PRESSURE_TO_MPA: Record<string, number> = {
  MPa: 1,
  psi: 0.0068947572932,
  kPa: 0.001,
  bar: 0.1,
};

const DIAMETER_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const THICKNESS_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const STRENGTH_UNITS = ['MPa', 'psi', 'kPa', 'bar'];

export default function BarlowsFormulaCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.barlowsFormula;
  const u = dict?.common?.barlowsFormula?.units;
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [diameter, setDiameter] = useState('219.1'); // D_o
  const [thickness, setThickness] = useState('8.18'); // t
  const [yieldStrength, setYieldStrength] = useState('240'); // S_y
  const [ultimateStrength, setUltimateStrength] = useState('415'); // S_t
  const [designFactor, setDesignFactor] = useState('0.72'); // F_d
  const [jointFactor, setJointFactor] = useState('1.0'); // F_e
  const [tempFactor, setTempFactor] = useState('1.0'); // F_t

  // Per-input unit selection
  const [diameterUnit, setDiameterUnit] = useState('mm');
  const [thicknessUnit, setThicknessUnit] = useState('mm');
  const [strengthUnit, setStrengthUnit] = useState('MPa');
  const [pressureUnit, setPressureUnit] = useState('MPa');

  // Results (in selected pressure unit)
  const [yieldPressure, setYieldPressure] = useState<number | null>(null);
  const [burstPressure, setBurstPressure] = useState<number | null>(null);
  const [allowablePressure, setAllowablePressure] = useState<number | null>(null);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setDiameter('8.625');
      setThickness('0.322');
      setYieldStrength('35000');
      setUltimateStrength('60000');
      setDiameterUnit('in');
      setThicknessUnit('in');
      setStrengthUnit('psi');
      setPressureUnit('psi');
    } else {
      setDiameter('219.1');
      setThickness('8.18');
      setYieldStrength('240');
      setUltimateStrength('415');
      setDiameterUnit('mm');
      setThicknessUnit('mm');
      setStrengthUnit('MPa');
      setPressureUnit('MPa');
    }
  }, [isImperial]);

  const calculate = () => {
    const D = parseFloat(diameter);
    const th = parseFloat(thickness);
    const Sy = parseFloat(yieldStrength);
    const St = parseFloat(ultimateStrength);
    const Fd = parseFloat(designFactor);
    const Fe = parseFloat(jointFactor);
    const Ft = parseFloat(tempFactor);

    if (isNaN(D) || isNaN(th) || isNaN(Sy) || isNaN(St) || isNaN(Fd) || isNaN(Fe) || isNaN(Ft) || D === 0) {
      setYieldPressure(null);
      setBurstPressure(null);
      setAllowablePressure(null);
      return;
    }

    // Convert to SI base
    const D_mm = D * (LENGTH_TO_MM[diameterUnit] ?? 1);
    const th_mm = th * (LENGTH_TO_MM[thicknessUnit] ?? 1);
    const Sy_MPa = Sy * (PRESSURE_TO_MPA[strengthUnit] ?? 1);
    const St_MPa = St * (PRESSURE_TO_MPA[strengthUnit] ?? 1);

    const toDisplay = (valMpa: number) => valMpa / (PRESSURE_TO_MPA[pressureUnit] ?? 1);

    // P_y = 2 * S_y * t / D
    setYieldPressure(toDisplay((2 * Sy_MPa * th_mm) / D_mm));
    // P_t = 2 * S_t * t / D
    setBurstPressure(toDisplay((2 * St_MPa * th_mm) / D_mm));
    // P_a = 2 * S_y * F_d * F_e * F_t * t / D
    setAllowablePressure(toDisplay((2 * Sy_MPa * Fd * Fe * Ft * th_mm) / D_mm));
  };

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🛢️ {t?.title || 'Barlow\'s Formula Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate internal, allowable, and bursting pressure.'}
        </p>

        {/* Outside Diameter */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.diameter || 'Outside Diameter (D_o)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.diameter || 'Outside Diameter (D_o)'} (${u?.diameter || 'Unit'})`}
              value={diameterUnit}
              onChange={(e) => setDiameterUnit(e.target.value)}
              className={unitSelectClass}
            >
              {DIAMETER_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Wall Thickness */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.thickness || 'Wall Thickness (t)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={thickness}
              onChange={(e) => setThickness(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.thickness || 'Wall Thickness (t)'} (${u?.thickness || 'Unit'})`}
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

        {/* Yield Strength */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.yieldStrength || 'Yield Strength (S_y)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={yieldStrength}
              onChange={(e) => setYieldStrength(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.yieldStrength || 'Yield Strength (S_y)'} (${u?.strength || 'Unit'})`}
              value={strengthUnit}
              onChange={(e) => setStrengthUnit(e.target.value)}
              className={unitSelectClass}
            >
              {STRENGTH_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ultimate Strength */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.ultimateStrength || 'Ultimate Strength (S_t)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={ultimateStrength}
              onChange={(e) => setUltimateStrength(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.ultimateStrength || 'Ultimate Strength (S_t)'} (${u?.strength || 'Unit'})`}
              value={strengthUnit}
              onChange={(e) => setStrengthUnit(e.target.value)}
              className={unitSelectClass}
            >
              {STRENGTH_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Design Factor */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.designFactor || 'Design Factor (F_d)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={designFactor}
              onChange={(e) => setDesignFactor(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
          </div>
        </div>

        {/* Joint Factor */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.jointFactor || 'Joint Factor (F_e)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={jointFactor}
              onChange={(e) => setJointFactor(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
          </div>
        </div>

        {/* Temperature Factor */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.temperatureFactor || 'Temperature Factor (F_t)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={tempFactor}
              onChange={(e) => setTempFactor(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
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

          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.allowablePressure || 'Allowable Pressure (P_a)'}</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allowablePressure !== null ? allowablePressure.toFixed(2) : '-'} <span className="text-sm font-normal">{pressureUnit}</span>
              </span>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.yieldPressure || 'Pressure at Yield (P_y)'}</span>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {yieldPressure !== null ? yieldPressure.toFixed(2) : '-'} <span className="text-sm font-normal">{pressureUnit}</span>
              </span>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.burstPressure || 'Burst Pressure (P_t)'}</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {burstPressure !== null ? burstPressure.toFixed(2) : '-'} <span className="text-sm font-normal">{pressureUnit}</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Pressure Limits Overview'}
            </h4>
            <div className="relative w-full h-12 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
              {burstPressure && yieldPressure && allowablePressure && (
                <>
                  <div
                    className="absolute top-0 left-0 h-full bg-red-400 dark:bg-red-600 opacity-20"
                    style={{ width: '100%' }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 h-full bg-orange-400 dark:bg-orange-600 opacity-40 border-r border-orange-600"
                    style={{ width: `${(yieldPressure / burstPressure) * 100}%` }}
                  ></div>
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 dark:bg-blue-600 opacity-80 border-r border-blue-800"
                    style={{ width: `${(allowablePressure / burstPressure) * 100}%` }}
                  ></div>
                </>
              )}
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>0</span>
              <span>P_a (Allowable)</span>
              <span>P_y (Yield)</span>
              <span>P_t (Burst)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
