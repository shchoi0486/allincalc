'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Regime thresholds
const LAMINAR_MAX = 2300;
const TURBULENT_MIN = 4000;
// Log scale domain for the bar
const RE_MIN = 1;
const RE_MAX = 100000;

// Map a Reynolds number to a 0-100% position on a log scale
const reToPercent = (re: number): number => {
  if (re <= 0) return 0;
  const clamped = Math.min(Math.max(re, RE_MIN), RE_MAX);
  const pct = ((Math.log10(clamped) - Math.log10(RE_MIN)) / (Math.log10(RE_MAX) - Math.log10(RE_MIN))) * 100;
  return Math.min(Math.max(pct, 0), 100);
};

const laminarEdgePct = reToPercent(LAMINAR_MAX);
const turbulentEdgePct = reToPercent(TURBULENT_MIN);

// Unit conversion factors to SI base (kg/m³, m/s, m, Pa·s)
const DENSITY_TO_SI: Record<string, number> = {
  'kg/m³': 1,
  'lb/ft³': 16.018463,
  'g/cm³': 1000,
};
const VELOCITY_TO_SI: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1 / 3.6,
};
const DIAMETER_TO_SI: Record<string, number> = {
  'm': 1,
  'cm': 0.01,
  'mm': 0.001,
  'in': 0.0254,
  'ft': 0.3048,
};
const VISCOSITY_TO_SI: Record<string, number> = {
  'Pa·s': 1,
  'cP': 0.001,
  'lb/(ft·s)': 1.488164,
};

const DENSITY_UNITS = ['kg/m³', 'lb/ft³', 'g/cm³'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];
const DIAMETER_UNITS = ['m', 'cm', 'mm', 'in', 'ft'];
const VISCOSITY_UNITS = ['Pa·s', 'cP', 'lb/(ft·s)'];

export default function ReynoldsNumberCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.reynoldsNumber;
  const u = dict?.common?.reynoldsNumber?.units;

  const isImperial = unitSystem === 'imperial';

  // Inputs (numeric value)
  const [density, setDensity] = useState('1000');
  const [velocity, setVelocity] = useState('2');
  const [diameter, setDiameter] = useState('0.1');
  const [viscosity, setViscosity] = useState('0.001');

  // Selected units per input
  const [densityUnit, setDensityUnit] = useState(isImperial ? 'lb/ft³' : 'kg/m³');
  const [velocityUnit, setVelocityUnit] = useState(isImperial ? 'ft/s' : 'm/s');
  const [diameterUnit, setDiameterUnit] = useState(isImperial ? 'in' : 'm');
  const [viscosityUnit, setViscosityUnit] = useState(isImperial ? 'lb/(ft·s)' : 'Pa·s');

  // Results
  const [reynolds, setReynolds] = useState<number | null>(null);
  const [regime, setRegime] = useState<string>('');

  // When global unit system changes, reset each unit to the system default
  useEffect(() => {
    setDensityUnit(isImperial ? 'lb/ft³' : 'kg/m³');
    setVelocityUnit(isImperial ? 'ft/s' : 'm/s');
    setDiameterUnit(isImperial ? 'in' : 'm');
    setViscosityUnit(isImperial ? 'lb/(ft·s)' : 'Pa·s');
    if (isImperial) {
      setDensity('62.4');
      setVelocity('6.56');
      setDiameter('3.94');
      setViscosity('0.000672');
    } else {
      setDensity('1000');
      setVelocity('2');
      setDiameter('0.1');
      setViscosity('0.001');
    }
  }, [isImperial]);

  const calculate = () => {
    const rhoRaw = parseFloat(density);
    const vRaw = parseFloat(velocity);
    const DRaw = parseFloat(diameter);
    const muRaw = parseFloat(viscosity);

    if (isNaN(rhoRaw) || isNaN(vRaw) || isNaN(DRaw) || isNaN(muRaw) || muRaw === 0) {
      setReynolds(null);
      setRegime('');
      return;
    }

    // Convert to SI base units
    const rho = rhoRaw * (DENSITY_TO_SI[densityUnit] ?? 1);
    const v = vRaw * (VELOCITY_TO_SI[velocityUnit] ?? 1);
    const D = DRaw * (DIAMETER_TO_SI[diameterUnit] ?? 1);
    const mu = muRaw * (VISCOSITY_TO_SI[viscosityUnit] ?? 1);

    const Re = (rho * v * D) / mu;
    setReynolds(Re);

    if (Re < LAMINAR_MAX) {
      setRegime('laminar');
    } else if (Re <= TURBULENT_MIN) {
      setRegime('transitional');
    } else {
      setRegime('turbulent');
    }
  };

  const markerPct = reynolds !== null ? reToPercent(reynolds) : 0;

  const unitSelectClass =
    'shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <div className="flex justify-between items-center mb-4 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🌊 {t?.title || 'Reynolds Number Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the Reynolds number to determine whether fluid flow is laminar or turbulent.'}
        </p>

        {/* Density */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.density || 'Fluid Density (ρ)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={density}
              onChange={(e) => setDensity(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={u?.density || 'Density Unit'}
              value={densityUnit}
              onChange={(e) => setDensityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {DENSITY_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Velocity */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.velocity || 'Flow Velocity (v)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={velocity}
              onChange={(e) => setVelocity(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={u?.velocity || 'Velocity Unit'}
              value={velocityUnit}
              onChange={(e) => setVelocityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {VELOCITY_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Diameter */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.diameter || 'Pipe Inner Diameter (D)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={u?.diameter || 'Diameter Unit'}
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

        {/* Viscosity */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.viscosity || 'Dynamic Viscosity (μ)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={viscosity}
              onChange={(e) => setViscosity(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={u?.viscosity || 'Viscosity Unit'}
              value={viscosityUnit}
              onChange={(e) => setViscosityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {VISCOSITY_UNITS.map((unit) => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-auto pt-4">
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

          <div className={`p-6 rounded-lg border flex flex-col items-center justify-center mb-6 transition-colors duration-500
            ${regime === 'laminar' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
            ${regime === 'transitional' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800' : ''}
            ${regime === 'turbulent' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : ''}
            ${!regime ? 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-800' : ''}
          `}>
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.reynoldsNumber || 'Reynolds Number (Re)'}</span>
            <span className={`text-4xl font-bold mb-2
              ${regime === 'laminar' ? 'text-blue-600 dark:text-blue-400' : ''}
              ${regime === 'transitional' ? 'text-orange-600 dark:text-orange-400' : ''}
              ${regime === 'turbulent' ? 'text-red-600 dark:text-red-400' : ''}
              ${!regime ? 'text-gray-600 dark:text-gray-400' : ''}
            `}>
              {reynolds !== null ? reynolds.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-'}
            </span>
            <span className={`text-lg font-semibold
              ${regime === 'laminar' ? 'text-blue-700 dark:text-blue-300' : ''}
              ${regime === 'transitional' ? 'text-orange-700 dark:text-orange-300' : ''}
              ${regime === 'turbulent' ? 'text-red-700 dark:text-red-300' : ''}
            `}>
              {regime === 'laminar' ? (t?.results?.laminar || 'Laminar Flow') : ''}
              {regime === 'transitional' ? (t?.results?.transitional || 'Transitional Flow') : ''}
              {regime === 'turbulent' ? (t?.results?.turbulent || 'Turbulent Flow') : ''}
            </span>
          </div>

          {/* Log-scale Reynolds number regime bar */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t?.visualization?.regimeBar || 'Reynolds Number Scale (log)'}
            </h4>
            <div className="relative w-full h-9 rounded-md overflow-hidden flex">
              <div
                className="bg-blue-400 dark:bg-blue-600 h-full flex items-center justify-center"
                style={{ width: `${laminarEdgePct}%` }}
              >
                <span className="text-[10px] font-semibold text-white truncate px-1">{t?.visualization?.laminarZone || 'Laminar'}</span>
              </div>
              <div
                className="bg-orange-400 dark:bg-orange-600 h-full flex items-center justify-center"
                style={{ width: `${turbulentEdgePct - laminarEdgePct}%` }}
              >
                <span className="text-[10px] font-semibold text-white truncate px-1">{t?.visualization?.transitionalZone || 'Transitional'}</span>
              </div>
              <div className="bg-red-400 dark:bg-red-600 h-full flex items-center justify-center flex-1">
                <span className="text-[10px] font-semibold text-white truncate px-1">{t?.visualization?.turbulentZone || 'Turbulent'}</span>
              </div>

              <div className="absolute top-0 bottom-0 border-l border-white/70" style={{ left: `${laminarEdgePct}%` }}>
                <span className="absolute -top-0.5 left-1 text-[9px] text-gray-700 dark:text-gray-200 font-mono">2300</span>
              </div>
              <div className="absolute top-0 bottom-0 border-l border-white/70" style={{ left: `${turbulentEdgePct}%` }}>
                <span className="absolute -top-0.5 left-1 text-[9px] text-gray-700 dark:text-gray-200 font-mono">4000</span>
              </div>

              {reynolds !== null && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-gray-900 dark:bg-white z-10"
                  style={{ left: `${markerPct}%` }}
                >
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-gray-900 dark:bg-white"></div>
                </div>
              )}
            </div>
            {reynolds !== null && (
              <p className="text-[11px] text-center mt-1 text-gray-500 dark:text-gray-400">
                {t?.visualization?.currentPosition || 'Current Re'}: <span className="font-semibold">{reynolds.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </p>
            )}
          </div>

          {/* Flow pattern diagram */}
          <div>
            <h4 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
              {t?.visualization?.flowDiagram || 'Flow Pattern'}
            </h4>
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              <div className="absolute w-[80%] h-16 bg-white dark:bg-gray-800 border-y-4 border-gray-400 dark:border-gray-500 overflow-hidden">
                {regime === 'laminar' && (
                  <div className="absolute inset-0 flex flex-col justify-evenly py-2 opacity-70">
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                  </div>
                )}

                {regime === 'transitional' && (
                  <div className="absolute inset-0 opacity-70">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 60">
                      <path d="M 0 12 Q 12 18, 25 8 T 50 16 T 75 10 T 100 18" stroke="currentColor" className="text-orange-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                      <path d="M 0 30 Q 15 24, 30 36 T 55 26 T 80 36 T 100 28" stroke="currentColor" className="text-orange-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                      <path d="M 0 48 Q 10 54, 20 44 T 45 54 T 70 44 T 100 50" stroke="currentColor" className="text-orange-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                )}

                {regime === 'turbulent' && (
                  <div className="absolute inset-0 opacity-70">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 60">
                      <path d="M 0 14 Q 6 40, 12 8 T 24 34 T 36 10 T 48 38 T 60 12 T 72 36 T 84 10 T 96 34 T 100 14" stroke="currentColor" className="text-red-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                      <path d="M 0 30 Q 8 8, 16 46 T 28 12 T 40 48 T 52 14 T 64 46 T 76 12 T 88 48 T 100 30" stroke="currentColor" className="text-red-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                      <path d="M 0 46 Q 7 20, 14 52 T 26 22 T 38 50 T 50 20 T 62 52 T 74 22 T 86 50 T 98 24 T 100 46" stroke="currentColor" className="text-red-500" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
                      <circle cx="25" cy="30" r="5" stroke="currentColor" className="text-red-400" strokeWidth="1" fill="none" strokeDasharray="15 5" vectorEffect="non-scaling-stroke" />
                      <circle cx="65" cy="28" r="6" stroke="currentColor" className="text-red-400" strokeWidth="1" fill="none" strokeDasharray="15 5" vectorEffect="non-scaling-stroke" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
