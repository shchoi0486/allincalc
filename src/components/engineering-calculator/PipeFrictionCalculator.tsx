'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base
const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};
const VELOCITY_TO_MS: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1000 / 3600,
};
const DENSITY_TO_KGM3: Record<string, number> = {
  'kg/m³': 1,
  'lb/ft³': 16.0185,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];
const DENSITY_UNITS = ['kg/m³', 'lb/ft³'];

export default function PipeFrictionCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.pipeFriction;

  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [length, setLength] = useState('100'); // L (used in diagram + calc)
  const [diameter, setDiameter] = useState('0.1'); // D
  const [velocity, setVelocity] = useState('2'); // v
  const [frictionFactor, setFrictionFactor] = useState('0.02'); // f
  const [density, setDensity] = useState('1000'); // rho

  // Per-input unit selection
  const [lengthUnit, setLengthUnit] = useState('m');
  const [diameterUnit, setDiameterUnit] = useState('m');
  const [velocityUnit, setVelocityUnit] = useState('m/s');
  const [densityUnit, setDensityUnit] = useState('kg/m³');

  // Results
  const [headLoss, setHeadLoss] = useState<number | null>(null);
  const [pressureLoss, setPressureLoss] = useState<number | null>(null);

  // Constants
  const g = 9.81; // m/s^2

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setLength('328.08'); // ~100m in ft
      setDiameter('3.94'); // ~0.1m in inches
      setVelocity('6.56'); // ~2m/s in ft/s
      setDensity('62.43'); // ~1000kg/m3 in lb/ft3
      setLengthUnit('ft');
      setDiameterUnit('in');
      setVelocityUnit('ft/s');
      setDensityUnit('lb/ft³');
    } else {
      setLength('100');
      setDiameter('0.1');
      setVelocity('2');
      setDensity('1000');
      setLengthUnit('m');
      setDiameterUnit('m');
      setVelocityUnit('m/s');
      setDensityUnit('kg/m³');
    }
  }, [isImperial]);

  const calculate = () => {
    const L = parseFloat(length);
    const D = parseFloat(diameter);
    const v = parseFloat(velocity);
    const f = parseFloat(frictionFactor);
    const rho = parseFloat(density);

    if (isNaN(L) || isNaN(D) || isNaN(v) || isNaN(f) || isNaN(rho) || D === 0) {
      setHeadLoss(null);
      setPressureLoss(null);
      return;
    }

    // Convert each input to its SI base via the unit maps
    const L_m = L * (LENGTH_TO_M[lengthUnit] ?? 1);
    const D_m = D * (LENGTH_TO_M[diameterUnit] ?? 1);
    const v_ms = v * (VELOCITY_TO_MS[velocityUnit] ?? 1);
    const rho_si = rho * (DENSITY_TO_KGM3[densityUnit] ?? 1);

    // h_f = f * (L / D) * (v^2 / 2g) in SI base (m, m/s)
    const h_f_m = f * (L_m / D_m) * (Math.pow(v_ms, 2) / (2 * g));
    const pressure_pa = rho_si * g * h_f_m; // Pa

    setHeadLoss(isImperial ? h_f_m * 3.28084 : h_f_m);
    setPressureLoss(isImperial ? pressure_pa / 6894.76 : pressure_pa / 1000);
  };

  const headLossUnit = isImperial ? 'ft' : 'm';
  const pressureLossUnit = isImperial ? 'psi' : 'kPa';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            💧 {t?.title || 'Pipe Friction Loss'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the head loss and pressure loss due to friction.'}
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.diameter || 'Inner Diameter (D)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={diameter}
              onChange={(e) => setDiameter(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <select
              aria-label={t?.inputs?.diameter || 'Inner Diameter (D)'}
              value={diameterUnit}
              onChange={(e) => setDiameterUnit(e.target.value)}
              className={unitSelectClass}
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

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
              aria-label={t?.inputs?.velocity || 'Flow Velocity (v)'}
              value={velocityUnit}
              onChange={(e) => setVelocityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {VELOCITY_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.frictionFactor || 'Friction Factor (f)'}
          </Label>
          <div className="sm:w-1/2 flex min-w-0">
            <Input
              type="number"
              value={frictionFactor}
              onChange={(e) => setFrictionFactor(e.target.value)}
              className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
            />
            <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
              -
            </span>
          </div>
        </div>

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
              aria-label={t?.inputs?.density || 'Fluid Density (ρ)'}
              value={densityUnit}
              onChange={(e) => setDensityUnit(e.target.value)}
              className={unitSelectClass}
            >
              {DENSITY_UNITS.map((u) => (
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

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.headLoss || 'Head Loss (h_f)'}</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {headLoss !== null ? headLoss.toFixed(4) : '-'} <span className="text-sm font-normal">{headLossUnit}</span>
              </span>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.pressureLoss || 'Pressure Loss (ΔP)'}</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pressureLoss !== null ? pressureLoss.toFixed(4) : '-'} <span className="text-sm font-normal">{pressureLossUnit}</span>
              </span>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Losses Overview'}
            </h4>
            {/* Pipe Diagram using CSS */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              {/* Pipe Body */}
              <div className="absolute w-[80%] h-16 bg-blue-200 dark:bg-blue-900 border-y-4 border-blue-400 dark:border-blue-700 flex items-center justify-center">
                {/* Flow arrows */}
                <div className="flex space-x-8 opacity-50">
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">→</span>
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">→</span>
                  <span className="text-blue-600 dark:text-blue-300 text-2xl font-bold">→</span>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-2 left-[10%] text-xs font-mono font-bold text-gray-600 dark:text-gray-400">P₁</div>
              <div className="absolute top-2 right-[10%] text-xs font-mono font-bold text-red-500 dark:text-red-400">P₂ = P₁ - ΔP</div>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 dark:text-gray-400">
                L = {length || '-'} {lengthUnit}
              </div>

              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-mono text-gray-600 dark:text-gray-400">
                D = {diameter || '-'} {diameterUnit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
