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
const PRESSURE_UNITS = ['MPa', 'psi', 'kPa', 'bar'];
const THICKNESS_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const STRESS_UNITS = ['MPa', 'psi', 'kPa', 'bar'];

export default function AsmeB313Calculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.asmeB313;
  const u = dict?.common?.asmeB313?.units;
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [calcTarget, setCalcTarget] = useState('thickness'); // 'thickness' or 'pressure'
  const [diameter, setDiameter] = useState('114.3'); // D
  const [pressure, setPressure] = useState('1.5'); // P
  const [thickness, setThickness] = useState('6.02'); // t
  const [stress, setStress] = useState('137.9'); // S
  const [qualityFactor, setQualityFactor] = useState('1.0'); // E
  const [coefficientY, setCoefficientY] = useState('0.4'); // Y
  const [tolerance, setTolerance] = useState('12.5'); // alpha (%)

  // Per-input unit selection
  const [diameterUnit, setDiameterUnit] = useState('mm');
  const [pressureUnit, setPressureUnit] = useState('MPa');
  const [thicknessUnit, setThicknessUnit] = useState('mm');
  const [stressUnit, setStressUnit] = useState('MPa');

  // Results (already in selected display unit)
  const [resultThickness, setResultThickness] = useState<number | null>(null);
  const [resultPressure, setResultPressure] = useState<number | null>(null);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setDiameter('4.5');
      setPressure('217.5');
      setThickness('0.237');
      setStress('20000');
      setDiameterUnit('in');
      setPressureUnit('psi');
      setThicknessUnit('in');
      setStressUnit('psi');
    } else {
      setDiameter('114.3');
      setPressure('1.5');
      setThickness('6.02');
      setStress('137.9');
      setDiameterUnit('mm');
      setPressureUnit('MPa');
      setThicknessUnit('mm');
      setStressUnit('MPa');
    }
  }, [isImperial]);

  const calculate = () => {
    const D = parseFloat(diameter);
    const P = parseFloat(pressure);
    const t_input = parseFloat(thickness);
    const S = parseFloat(stress);
    const E = parseFloat(qualityFactor);
    const Y = parseFloat(coefficientY);
    const alpha = parseFloat(tolerance);

    if (isNaN(D) || isNaN(S) || isNaN(E) || isNaN(Y) || isNaN(alpha)) {
      setResultThickness(null);
      setResultPressure(null);
      return;
    }

    // Convert to SI base
    const D_mm = D * (LENGTH_TO_MM[diameterUnit] ?? 1);
    const S_MPa = S * (PRESSURE_TO_MPA[stressUnit] ?? 1);

    if (calcTarget === 'thickness') {
      if (isNaN(P)) return;
      const P_MPa = P * (PRESSURE_TO_MPA[pressureUnit] ?? 1);
      const t_calc = (P_MPa * D_mm) / (2 * (S_MPa * E + P_MPa * Y));
      const t_req = t_calc / (1 - alpha / 100); // mm
      setResultThickness(t_req / (LENGTH_TO_MM[thicknessUnit] ?? 1));
      setResultPressure(null);
    } else {
      if (isNaN(t_input)) return;
      const t_mm = t_input * (LENGTH_TO_MM[thicknessUnit] ?? 1);
      const t_eff = t_mm * (1 - alpha / 100);
      const denom = D_mm - 2 * t_eff * Y;
      if (denom <= 0) {
        setResultPressure(null);
        return;
      }
      const P_MPa = (2 * t_eff * S_MPa * E) / denom;
      setResultPressure(P_MPa / (PRESSURE_TO_MPA[pressureUnit] ?? 1));
      setResultThickness(null);
    }
  };

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🔧 {t?.title || 'ASME B31.3 Pipe Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate allowable pressure or required wall thickness of a pipe based on ASME B31.3 code.'}
        </p>

        {/* Calc target */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.calcTarget || 'Calculate'}
          </Label>
          <div className="sm:w-1/2">
            <select
              aria-label={t?.inputs?.calcTarget || 'Calculate'}
              value={calcTarget}
              onChange={(e) => setCalcTarget(e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="thickness">{t?.inputs?.targetThickness || 'Wall Thickness (t)'}</option>
              <option value="pressure">{t?.inputs?.targetPressure || 'Allowable Pressure (P)'}</option>
            </select>
          </div>
        </div>

        {/* Diameter */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.diameter || 'Outside Diameter (D)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.diameter || 'Outside Diameter (D)'} (${u?.diameter || 'Unit'})`}
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

        {/* Internal Pressure (if calcTarget is thickness) */}
        {calcTarget === 'thickness' && (
          <div className="flex flex-col sm:flex-row sm:items-center mb-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.pressure || 'Internal Pressure (P)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={pressure}
                onChange={(e) => setPressure(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.pressure || 'Internal Pressure (P)'} (${u?.pressure || 'Unit'})`}
                value={pressureUnit}
                onChange={(e) => setPressureUnit(e.target.value)}
                className={unitSelectClass}
              >
                {PRESSURE_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Wall Thickness (if calcTarget is pressure) */}
        {calcTarget === 'pressure' && (
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
        )}

        {/* Allowable Stress */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.stress || 'Allowable Stress (S)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={stress}
              onChange={(e) => setStress(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.stress || 'Allowable Stress (S)'} (${u?.stress || 'Unit'})`}
              value={stressUnit}
              onChange={(e) => setStressUnit(e.target.value)}
              className={unitSelectClass}
            >
              {STRESS_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quality Factor */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.qualityFactor || 'Quality Factor (E)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={qualityFactor}
              onChange={(e) => setQualityFactor(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
          </div>
        </div>

        {/* Coefficient Y */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.coefficientY || 'Thickness Coefficient (Y)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={coefficientY}
              onChange={(e) => setCoefficientY(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
          </div>
        </div>

        {/* Tolerance */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.tolerance || 'Thickness Tolerance (α, %)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={tolerance}
              onChange={(e) => setTolerance(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              %
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {calcTarget === 'thickness'
                ? (t?.results?.requiredThickness || 'Required Thickness (t)')
                : (t?.results?.allowablePressure || 'Allowable Pressure (P)')}
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {calcTarget === 'thickness'
                ? (resultThickness !== null ? resultThickness.toFixed(4) : '-')
                : (resultPressure !== null ? resultPressure.toFixed(4) : '-')}
              <span className="text-lg font-normal ml-1">
                {calcTarget === 'thickness' ? thicknessUnit : pressureUnit}
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Pipe Cross-Section'}
            </h4>
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              <div className="absolute w-32 h-32 rounded-full border-4 border-gray-400 dark:border-gray-500 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center relative shadow-inner">
                  <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <span className="absolute -top-1 text-blue-600 dark:text-blue-400 text-xs rotate-[-90deg]">→</span>
                    <span className="absolute -bottom-1 text-blue-600 dark:text-blue-400 text-xs rotate-[90deg]">→</span>
                    <span className="absolute -left-1 text-blue-600 dark:text-blue-400 text-xs rotate-[180deg]">→</span>
                    <span className="absolute -right-1 text-blue-600 dark:text-blue-400 text-xs">→</span>
                    <span className="text-blue-800 dark:text-blue-200 font-bold text-sm">P</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 w-32 border-t border-gray-800 dark:border-gray-200 flex justify-center">
                <div className="absolute -top-3 bg-gray-100 dark:bg-gray-700 px-1 text-xs font-mono">D = {diameter || '?'} {diameterUnit}</div>
                <div className="absolute -left-1 -top-1.5">|</div>
                <div className="absolute -right-1 -top-1.5">|</div>
              </div>

              <div className="absolute bottom-4 right-[calc(50%-4rem)] w-4 border-t border-gray-800 dark:border-gray-200 flex justify-center">
                <div className="absolute top-1 bg-gray-100 dark:bg-gray-700 px-1 text-[10px] font-mono whitespace-nowrap">t</div>
                <div className="absolute -left-1 -top-1.5">|</div>
                <div className="absolute -right-1 -top-1.5">|</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
