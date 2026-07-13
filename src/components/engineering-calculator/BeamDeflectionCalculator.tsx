'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base (N, m, Pa, m^4, m)
const LOAD_TO_N: Record<string, number> = {
  kN: 1000,
  N: 1,
  kip: 4448.2216153,
  lbf: 4.4482216153,
};
const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};
const ELAST_TO_PA: Record<string, number> = {
  GPa: 1e9,
  MPa: 1e6,
  Pa: 1,
  psi: 6894.7572932,
  Mpsi: 6.8947572932e9,
};
const INERTIA_TO_M4: Record<string, number> = {
  'm⁴': 1,
  'cm⁴': 1e-8,
  'mm⁴': 1e-12,
  'in⁴': 4.162314256e-7,
};
const DEFLECT_TO_M: Record<string, number> = {
  m: 1,
  cm: 0.01,
  mm: 0.001,
  ft: 0.3048,
  in: 0.0254,
};

const LOAD_UNITS = ['kN', 'N', 'kip', 'lbf'];
const LENGTH_UNITS = ['m', 'cm', 'mm', 'ft', 'in'];
const ELAST_UNITS = ['GPa', 'MPa', 'psi', 'Mpsi'];
const INERTIA_UNITS = ['cm⁴', 'mm⁴', 'm⁴', 'in⁴'];
const DEFLECT_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

export default function BeamDeflectionCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.beamDeflection;
  const u = dict?.common?.beamDeflection?.units;
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [load, setLoad] = useState('10');
  const [length, setLength] = useState('5');
  const [elasticity, setElasticity] = useState('200');
  const [inertia, setInertia] = useState('8000');

  // Per-input unit selection
  const [loadUnit, setLoadUnit] = useState('kN');
  const [lengthUnit, setLengthUnit] = useState('m');
  const [elasticityUnit, setElasticityUnit] = useState('GPa');
  const [inertiaUnit, setInertiaUnit] = useState('cm⁴');
  const [deflectUnit, setDeflectUnit] = useState('mm');

  // Results (in selected deflection unit)
  const [maxDeflection, setMaxDeflection] = useState<number | null>(null);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setLoad('2.25');
      setLength('16.4');
      setElasticity('29');
      setInertia('192.2');
      setLoadUnit('kip');
      setLengthUnit('ft');
      setElasticityUnit('Mpsi');
      setInertiaUnit('in⁴');
      setDeflectUnit('in');
    } else {
      setLoad('10');
      setLength('5');
      setElasticity('200');
      setInertia('8000');
      setLoadUnit('kN');
      setLengthUnit('m');
      setElasticityUnit('GPa');
      setInertiaUnit('cm⁴');
      setDeflectUnit('mm');
    }
  }, [isImperial]);

  const calculate = () => {
    const P = parseFloat(load);
    const L = parseFloat(length);
    const E = parseFloat(elasticity);
    const I = parseFloat(inertia);

    if (isNaN(P) || isNaN(L) || isNaN(E) || isNaN(I) || E === 0 || I === 0) {
      setMaxDeflection(null);
      return;
    }

    // Convert to SI base
    const P_N = P * (LOAD_TO_N[loadUnit] ?? 1);
    const L_m = L * (LENGTH_TO_M[lengthUnit] ?? 1);
    const E_Pa = E * (ELAST_TO_PA[elasticityUnit] ?? 1);
    const I_m4 = I * (INERTIA_TO_M4[inertiaUnit] ?? 1);

    // δ = P * L^3 / (3 * E * I)  -> meters
    const delta_m = (P_N * Math.pow(L_m, 3)) / (3 * E_Pa * I_m4);
    setMaxDeflection(delta_m / (DEFLECT_TO_M[deflectUnit] ?? 1));
  };

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🏗️ {t?.title || 'Beam Deflection'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the maximum deflection of a cantilever beam with a point load at the free end.'}
        </p>

        <div className="space-y-4 flex-1">
          {/* Point Load */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.load || 'Point Load (P)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.load || 'Point Load (P)'} (${u?.load || 'Unit'})`}
                value={loadUnit}
                onChange={(e) => setLoadUnit(e.target.value)}
                className={unitSelectClass}
              >
                {LOAD_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Beam Length */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.length || 'Beam Length (L)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.length || 'Beam Length (L)'} (${u?.length || 'Unit'})`}
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value)}
                className={unitSelectClass}
              >
                {LENGTH_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Modulus of Elasticity */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.elasticity || 'Modulus of Elasticity (E)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={elasticity}
                onChange={(e) => setElasticity(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.elasticity || 'Modulus of Elasticity (E)'} (${u?.elasticity || 'Unit'})`}
                value={elasticityUnit}
                onChange={(e) => setElasticityUnit(e.target.value)}
                className={unitSelectClass}
              >
                {ELAST_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Moment of Inertia */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.inertia || 'Moment of Inertia (I)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={inertia}
                onChange={(e) => setInertia(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.inertia || 'Moment of Inertia (I)'} (${u?.inertia || 'Unit'})`}
                value={inertiaUnit}
                onChange={(e) => setInertiaUnit(e.target.value)}
                className={unitSelectClass}
              >
                {INERTIA_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
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

          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.maxDeflection || 'Max Deflection (δ)'}</span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400 flex items-baseline gap-2">
              {maxDeflection !== null ? maxDeflection.toFixed(4) : '-'}
              <select
                aria-label={`${t?.results?.maxDeflection || 'Max Deflection (δ)'} (${u?.deflection || 'Unit'})`}
                value={deflectUnit}
                onChange={(e) => setDeflectUnit(e.target.value)}
                className="text-lg font-normal bg-transparent border border-blue-200 dark:border-blue-800 rounded px-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {DEFLECT_UNITS.map((unit) => (
                  <option key={unit} value={unit}>{unit}</option>
                ))}
              </select>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Beam Deflection Diagram'}
            </h4>
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              <div className="absolute left-0 top-0 w-8 h-full bg-gray-400 dark:bg-gray-600 border-r-4 border-gray-500 dark:border-gray-500 flex flex-col justify-evenly overflow-hidden">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-16 h-0.5 bg-gray-500 dark:bg-gray-500 transform -rotate-45 -ml-4" />
                ))}
              </div>

              <div className="absolute left-8 top-12 w-[80%] h-4 bg-gray-300 dark:bg-gray-500 opacity-50 rounded-r-sm"></div>

              <div className="absolute left-8 top-12 w-[80%] h-16 border-t-4 border-r-4 border-blue-500 dark:border-blue-400 rounded-tr-[100%] bg-transparent"></div>

              <div className="absolute right-[calc(20%-2rem)] top-16 flex flex-col items-center">
                <div className="w-1 h-8 bg-red-500 dark:bg-red-400"></div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 dark:border-t-red-400"></div>
                <span className="text-xs font-bold text-red-500 dark:text-red-400 mt-1">P = {load || '-'} {loadUnit}</span>
              </div>

              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 dark:text-gray-400 border-t border-gray-400 w-1/2 text-center pt-1">
                L = {length || '-'} {lengthUnit}
              </div>

              <div className="absolute right-[calc(20%-4rem)] top-[5.5rem] flex items-center">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-sm mr-1">δ</span>
                <div className="h-10 border-l-2 border-dashed border-blue-400 dark:border-blue-500"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
