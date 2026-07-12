'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function PipeFrictionCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.pipeFriction;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [length, setLength] = useState('100'); // L
  const [diameter, setDiameter] = useState('0.1'); // D (m) or (in)
  const [velocity, setVelocity] = useState('2'); // v
  const [frictionFactor, setFrictionFactor] = useState('0.02'); // f
  const [density, setDensity] = useState('1000'); // rho

  // Results
  const [headLoss, setHeadLoss] = useState<number | null>(null);
  const [pressureLoss, setPressureLoss] = useState<number | null>(null);

  // Constants
  const g_metric = 9.81; // m/s^2
  const g_imperial = 32.174; // ft/s^2

  // Unit Labels
  const units = {
    length: isImperial ? 'ft' : 'm',
    diameter: isImperial ? 'in' : 'm',
    velocity: isImperial ? 'ft/s' : 'm/s',
    density: isImperial ? 'lb/ft³' : 'kg/m³',
    headLoss: isImperial ? 'ft' : 'm',
    pressureLoss: isImperial ? 'psi' : 'kPa',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setLength('328.08'); // ~100m in ft
      setDiameter('3.94'); // ~0.1m in inches
      setVelocity('6.56'); // ~2m/s in ft/s
      setDensity('62.43'); // ~1000kg/m3 in lb/ft3
    } else {
      setLength('100');
      setDiameter('0.1');
      setVelocity('2');
      setDensity('1000');
    }
  }, [isImperial]);

  const calculate = () => {
    const L = parseFloat(length);
    let D = parseFloat(diameter);
    const v = parseFloat(velocity);
    const f = parseFloat(frictionFactor);
    const rho = parseFloat(density);

    if (isNaN(L) || isNaN(D) || isNaN(v) || isNaN(f) || isNaN(rho) || D === 0) {
      setHeadLoss(null);
      setPressureLoss(null);
      return;
    }

    if (isImperial) {
      // D is in inches, convert to ft for formula
      const D_ft = D / 12;
      const g = g_imperial;
      // h_f = f * (L / D) * (v^2 / 2g)
      const h_f = f * (L / D_ft) * (Math.pow(v, 2) / (2 * g));
      setHeadLoss(h_f);

      // Delta_P = h_f * rho * (g/g_c) where g/g_c is 1 in English Engineering if using lbf. 
      // Actually, pressure = h_f * specific_weight (gamma). gamma = rho (in lbf/ft3 numerically if density is lb/ft3 and g=32.174).
      // Let's assume density input is specific weight (lb/ft³) for simplicity, which is standard.
      const pressure_psf = h_f * rho;
      const pressure_psi = pressure_psf / 144;
      setPressureLoss(pressure_psi);
    } else {
      const g = g_metric;
      // h_f = f * (L / D) * (v^2 / 2g)
      const h_f = f * (L / D) * (Math.pow(v, 2) / (2 * g));
      setHeadLoss(h_f);

      // Delta_P = h_f * rho * g (Pa)
      const pressure_pa = h_f * rho * g;
      const pressure_kpa = pressure_pa / 1000;
      setPressureLoss(pressure_kpa);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            💧 {t?.title || 'Pipe Friction Loss'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the head loss and pressure loss due to friction.'}
        </p>

                <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2 shrink-0 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
            <Label htmlFor="unit-toggle" className={`text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-colors ${!isImperial ? `bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400` : `text-gray-500 dark:text-gray-400`}`}>
              {dict?.common?.unitSystemMetric || `Metric`}
            </Label>
            <Switch
              id="unit-toggle"
              checked={isImperial}
              onCheckedChange={setIsImperial}
              className="hidden"
            />
            <Label htmlFor="unit-toggle" className={`text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-colors ${isImperial ? `bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400` : `text-gray-500 dark:text-gray-400`}`}>
              {dict?.common?.unitSystemImperial || `Imperial`}
            </Label>
          </div>
        </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.diameter}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.velocity}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.density}
              </span>
            </div>
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
                {headLoss !== null ? headLoss.toFixed(4) : '-'} <span className="text-sm font-normal">{units.headLoss}</span>
              </span>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.pressureLoss || 'Pressure Loss (ΔP)'}</span>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                {pressureLoss !== null ? pressureLoss.toFixed(4) : '-'} <span className="text-sm font-normal">{units.pressureLoss}</span>
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
                L = {length || '-'} {units.length}
              </div>
              
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 -rotate-90 text-xs font-mono text-gray-600 dark:text-gray-400">
                D = {diameter || '-'} {units.diameter}
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
