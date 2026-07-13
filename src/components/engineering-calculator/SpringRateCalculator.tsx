'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LENGTH_TO_MM: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

const MODULUS_TO_N_PER_MM2: Record<string, number> = {
  GPa: 1000,
  MPa: 1,
  psi: 0.0068947572932,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const MODULUS_UNITS = ['GPa', 'psi', 'MPa'];

export default function SpringRateCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.springRate;

  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [wireDiameter, setWireDiameter] = useState('2'); // d
  const [outerDiameter, setOuterDiameter] = useState('20'); // D_o
  const [activeCoils, setActiveCoils] = useState('10'); // n_a
  const [shearModulus, setShearModulus] = useState('79.3'); // G

  const [wireDiameterUnit, setWireDiameterUnit] = useState('mm');
  const [outerDiameterUnit, setOuterDiameterUnit] = useState('mm');
  const [shearModulusUnit, setShearModulusUnit] = useState('GPa');

  // Results
  const [springRate, setSpringRate] = useState<number | null>(null);
  const [meanDiameter, setMeanDiameter] = useState<number | null>(null);

  useEffect(() => {
    if (isImperial) {
      setWireDiameter('0.08'); // ~2mm
      setOuterDiameter('0.8'); // ~20mm
      setActiveCoils('10');
      setShearModulus('11500000'); // Steel ~ 11.5 Mpsi
      setWireDiameterUnit('in');
      setOuterDiameterUnit('in');
      setShearModulusUnit('psi');
    } else {
      setWireDiameter('2');
      setOuterDiameter('20');
      setActiveCoils('10');
      setShearModulus('79.3'); // Steel ~ 79.3 GPa
      setWireDiameterUnit('mm');
      setOuterDiameterUnit('mm');
      setShearModulusUnit('GPa');
    }
  }, [isImperial]);

  const calculate = () => {
    const d = parseFloat(wireDiameter);
    const D_o = parseFloat(outerDiameter);
    const n_a = parseFloat(activeCoils);
    const G_input = parseFloat(shearModulus);

    if (isNaN(d) || isNaN(D_o) || isNaN(n_a) || isNaN(G_input) || d === 0 || D_o <= d || n_a === 0) {
      setSpringRate(null);
      setMeanDiameter(null);
      return;
    }

    const d_mm = d * (LENGTH_TO_MM[wireDiameterUnit] ?? 1);
    const D_o_mm = D_o * (LENGTH_TO_MM[outerDiameterUnit] ?? 1);
    const D = D_o_mm - d_mm;

    const G = G_input * (MODULUS_TO_N_PER_MM2[shearModulusUnit] ?? 1);

    // k = (G * d^4) / (8 * D^3 * n_a)  => N/mm
    const k = (G * Math.pow(d_mm, 4)) / (8 * Math.pow(D, 3) * n_a);

    setSpringRate(k);
    setMeanDiameter(D);
  };

  const displayRate = isImperial ? (springRate !== null ? springRate * 0.175126 : null) : springRate;
  const rateUnit = isImperial ? 'lbf/in' : 'N/mm';
  const displayMeanDiameter = isImperial ? (meanDiameter !== null ? meanDiameter / 25.4 : null) : meanDiameter;
  const diameterUnit = isImperial ? 'in' : 'mm';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            ⚙️ {t?.title || 'Spring Rate Calculator'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the spring constant (rate) of a helical compression spring.'}
        </p>

        <div className="space-y-4 flex-1">
          {/* Wire Diameter */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.wireDiameter || 'Wire Diameter (d)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={wireDiameter}
                onChange={(e) => setWireDiameter(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.wireDiameter || 'Wire Diameter (d)'} unit`}
                value={wireDiameterUnit}
                onChange={(e) => setWireDiameterUnit(e.target.value)}
                className={unitSelectClass}
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Outer Diameter */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.outerDiameter || 'Outer Diameter (D_o)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={outerDiameter}
                onChange={(e) => setOuterDiameter(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.outerDiameter || 'Outer Diameter (D_o)'} unit`}
                value={outerDiameterUnit}
                onChange={(e) => setOuterDiameterUnit(e.target.value)}
                className={unitSelectClass}
              >
                {LENGTH_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Coils */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.activeCoils || 'Active Coils (n_a)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={activeCoils}
                onChange={(e) => setActiveCoils(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          {/* Shear Modulus */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.shearModulus || 'Shear Modulus (G)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={shearModulus}
                onChange={(e) => setShearModulus(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.shearModulus || 'Shear Modulus (G)'} unit`}
                value={shearModulusUnit}
                onChange={(e) => setShearModulusUnit(e.target.value)}
                className={unitSelectClass}
              >
                {MODULUS_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.springRate || 'Spring Rate (k)'}</span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {displayRate !== null ? displayRate.toFixed(4) : '-'} <span className="text-lg font-normal ml-1">{rateUnit}</span>
            </span>
          </div>

          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">{t?.results?.meanDiameter || 'Mean Diameter (D)'}: </span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{displayMeanDiameter !== null ? displayMeanDiameter.toFixed(2) : '-'} {diameterUnit}</span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Spring Geometry'}
            </h4>
            {/* Spring Diagram using SVG */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              <svg width="200" height="80" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* D_o and d lines */}
                <line x1="20" y1="10" x2="180" y2="10" stroke="currentColor" className="text-gray-400" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="20" y1="70" x2="180" y2="70" stroke="currentColor" className="text-gray-400" strokeWidth="1" strokeDasharray="4 4" />

                {/* Spring Coil path */}
                <path d="M 20 40
                         C 30 10, 40 10, 50 40
                         C 60 70, 70 70, 80 40
                         C 90 10, 100 10, 110 40
                         C 120 70, 130 70, 140 40
                         C 150 10, 160 10, 170 40
                         C 180 70, 190 70, 200 40"
                  stroke="currentColor" className="text-blue-500" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />

                <path d="M 20 40
                         C 30 10, 40 10, 50 40
                         C 60 70, 70 70, 80 40
                         C 90 10, 100 10, 110 40
                         C 120 70, 130 70, 140 40
                         C 150 10, 160 10, 170 40
                         C 180 70, 190 70, 200 40"
                  stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              </svg>

              {/* Annotations */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-[10px] font-mono bg-gray-100 dark:bg-gray-700 px-1 text-gray-500">
                D_o = {outerDiameter} {outerDiameterUnit}
              </div>
              <div className="absolute bottom-1 right-12 text-[10px] font-mono text-gray-500">
                d = {wireDiameter} {wireDiameterUnit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
