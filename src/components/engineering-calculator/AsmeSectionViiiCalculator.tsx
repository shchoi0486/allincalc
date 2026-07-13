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

const RADIUS_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const PRESSURE_UNITS = ['MPa', 'psi', 'kPa', 'bar'];
const THICKNESS_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const STRESS_UNITS = ['MPa', 'psi', 'kPa', 'bar'];

export default function AsmeSectionViiiCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.asmeSectionViii;
  const u = dict?.common?.asmeSectionViii?.units;
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [vesselType, setVesselType] = useState('cylinder'); // 'cylinder' or 'sphere'
  const [pressure, setPressure] = useState('2.5'); // P
  const [radius, setRadius] = useState('500'); // R
  const [stress, setStress] = useState('138'); // S
  const [efficiency, setEfficiency] = useState('1.0'); // E

  // Per-input unit selection
  const [radiusUnit, setRadiusUnit] = useState('mm');
  const [pressureUnit, setPressureUnit] = useState('MPa');
  const [thicknessUnit, setThicknessUnit] = useState('mm');
  const [stressUnit, setStressUnit] = useState('MPa');

  // Results (in selected thickness unit)
  const [thickness, setThickness] = useState<number | null>(null);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setPressure('360');
      setRadius('20');
      setStress('20000');
      setRadiusUnit('in');
      setPressureUnit('psi');
      setThicknessUnit('in');
      setStressUnit('psi');
    } else {
      setPressure('2.5');
      setRadius('500');
      setStress('138');
      setRadiusUnit('mm');
      setPressureUnit('MPa');
      setThicknessUnit('mm');
      setStressUnit('MPa');
    }
  }, [isImperial]);

  const calculate = () => {
    const P = parseFloat(pressure);
    const R = parseFloat(radius);
    const S = parseFloat(stress);
    const E = parseFloat(efficiency);

    if (isNaN(P) || isNaN(R) || isNaN(S) || isNaN(E) || E <= 0 || E > 1) {
      setThickness(null);
      return;
    }

    // Convert to SI base
    const R_mm = R * (LENGTH_TO_MM[radiusUnit] ?? 1);
    const P_MPa = P * (PRESSURE_TO_MPA[pressureUnit] ?? 1);
    const S_MPa = S * (PRESSURE_TO_MPA[stressUnit] ?? 1);

    let t_mm = 0;
    if (vesselType === 'cylinder') {
      const denom = S_MPa * E - 0.6 * P_MPa;
      if (denom <= 0) {
        setThickness(null);
        return;
      }
      t_mm = (P_MPa * R_mm) / denom;
    } else {
      const denom = 2 * S_MPa * E - 0.2 * P_MPa;
      if (denom <= 0) {
        setThickness(null);
        return;
      }
      t_mm = (P_MPa * R_mm) / denom;
    }

    setThickness(t_mm / (LENGTH_TO_MM[thicknessUnit] ?? 1));
  };

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🛡️ {t?.title || 'ASME Section VIII Vessel Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the required thickness for cylindrical and spherical pressure vessels under internal pressure.'}
        </p>

        {/* Vessel type */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.vesselType || 'Vessel Type'}
          </Label>
          <div className="sm:w-1/2">
            <select
              aria-label={t?.inputs?.vesselType || 'Vessel Type'}
              value={vesselType}
              onChange={(e) => setVesselType(e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="cylinder">{t?.inputs?.cylinder || 'Cylinder'}</option>
              <option value="sphere">{t?.inputs?.sphere || 'Sphere'}</option>
            </select>
          </div>
        </div>

        {/* Inner Radius */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.radius || 'Inner Radius (R)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={`${t?.inputs?.radius || 'Inner Radius (R)'} (${u?.radius || 'Unit'})`}
              value={radiusUnit}
              onChange={(e) => setRadiusUnit(e.target.value)}
              className={unitSelectClass}
            >
              {RADIUS_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

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

        {/* Joint Efficiency */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.efficiency || 'Joint Efficiency (E)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              step="0.1"
              min="0"
              max="1"
              value={efficiency}
              onChange={(e) => setEfficiency(e.target.value)}
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t?.results?.thickness || 'Required Thickness (t)'}
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {thickness !== null ? thickness.toFixed(4) : '-'}
              <span className="text-lg font-normal ml-1">
                {thicknessUnit}
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Vessel Cross-Section'}
            </h4>
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {vesselType === 'cylinder' ? (
                <div className="relative w-40 h-24 bg-gray-300 dark:bg-gray-500 border-4 border-gray-400 dark:border-gray-400 rounded-sm flex items-center justify-center">
                  <div className="w-full h-16 bg-blue-100 dark:bg-blue-900/40 shadow-inner flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">P →</span>
                  </div>
                  <div className="absolute -top-4 w-full text-center text-xs font-mono">Cylindrical Shell</div>
                </div>
              ) : (
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-400 dark:border-gray-500 bg-gray-300 dark:bg-gray-500 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-inner flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">⤡ P ⤢</span>
                  </div>
                  <div className="absolute -top-6 w-full text-center text-xs font-mono">Spherical Shell</div>
                </div>
              )}

              <div className="absolute bottom-2 left-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                R = {radius || '?'} {radiusUnit}
              </div>
              <div className="absolute bottom-2 right-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                t = {thickness !== null ? thickness.toFixed(2) : '?'} {thicknessUnit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
