'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function BeamDeflectionCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.beamDeflection;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [load, setLoad] = useState('10'); // P
  const [length, setLength] = useState('5'); // L
  const [elasticity, setElasticity] = useState('200'); // E (Steel approx 200 GPa or 29 Mpsi)
  const [inertia, setInertia] = useState('8000'); // I

  // Results
  const [maxDeflection, setMaxDeflection] = useState<number | null>(null);

  // Unit Labels
  const units = {
    load: isImperial ? 'kip' : 'kN',
    length: isImperial ? 'ft' : 'm',
    elasticity: isImperial ? 'Mpsi' : 'GPa',
    inertia: isImperial ? 'in⁴' : 'cm⁴',
    deflection: isImperial ? 'in' : 'mm',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setLoad('2.25'); // ~10kN in kips
      setLength('16.4'); // ~5m in ft
      setElasticity('29'); // ~200 GPa in Mpsi
      setInertia('192.2'); // ~8000 cm4 in in4
    } else {
      setLoad('10');
      setLength('5');
      setElasticity('200');
      setInertia('8000');
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

    if (isImperial) {
      // P: kip, L: ft, E: Mpsi, I: in^4
      // delta = (0.576 * P * L^3) / (E * I)
      const delta = (0.576 * P * Math.pow(L, 3)) / (E * I);
      setMaxDeflection(delta);
    } else {
      // P: kN, L: m, E: GPa, I: cm^4
      // delta = (P * L^3 * 10^5) / (3 * E * I)
      const delta = (P * Math.pow(L, 3) * 100000) / (3 * E * I);
      setMaxDeflection(delta);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🏗️ {t?.title || 'Beam Deflection'}
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the maximum deflection of a cantilever beam with a point load at the free end.'}
        </p>

        <div className="flex justify-end mb-6">
          <div className="flex items-center space-x-2 shrink-0 bg-gray-100 dark:bg-gray-700 p-1.5 rounded-full">
            <Label htmlFor="unit-toggle" className={`text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-colors ${!isImperial ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {dict?.common?.unitSystemMetric || 'Metric'}
            </Label>
            <Switch
              id="unit-toggle"
              checked={isImperial}
              onCheckedChange={setIsImperial}
              className="hidden" // Hiding the actual switch to use custom pill UI
            />
            <Label htmlFor="unit-toggle" className={`text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-colors ${isImperial ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {dict?.common?.unitSystemImperial || 'Imperial'}
            </Label>
          </div>
        </div>

        <div className="space-y-4 flex-1">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.load}
              </span>
            </div>
          </div>

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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.length}
              </span>
            </div>
          </div>

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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.elasticity}
              </span>
            </div>
          </div>

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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.inertia}
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
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.maxDeflection || 'Max Deflection (δ)'}</span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {maxDeflection !== null ? maxDeflection.toFixed(4) : '-'} <span className="text-lg font-normal">{units.deflection}</span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Beam Deflection Diagram'}
            </h4>
            {/* Beam Deflection Diagram using CSS */}
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              {/* Wall (Fixed Support) */}
              <div className="absolute left-0 top-0 w-8 h-full bg-gray-400 dark:bg-gray-600 border-r-4 border-gray-500 dark:border-gray-500 flex flex-col justify-evenly overflow-hidden">
                {/* Wall hatching pattern */}
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="w-16 h-0.5 bg-gray-500 dark:bg-gray-500 transform -rotate-45 -ml-4" />
                ))}
              </div>

              {/* Beam (Undeformed) */}
              <div className="absolute left-8 top-12 w-[80%] h-4 bg-gray-300 dark:bg-gray-500 opacity-50 rounded-r-sm"></div>

              {/* Beam (Deformed - simulated with curved border) */}
              <div className="absolute left-8 top-12 w-[80%] h-16 border-t-4 border-r-4 border-blue-500 dark:border-blue-400 rounded-tr-[100%] bg-transparent"></div>

              {/* Load Arrow */}
              <div className="absolute right-[calc(20%-2rem)] top-16 flex flex-col items-center">
                <div className="w-1 h-8 bg-red-500 dark:bg-red-400"></div>
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 dark:border-t-red-400"></div>
                <span className="text-xs font-bold text-red-500 dark:text-red-400 mt-1">P = {load || '-'} {units.load}</span>
              </div>

              {/* Length Label */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 dark:text-gray-400 border-t border-gray-400 w-1/2 text-center pt-1">
                L = {length || '-'} {units.length}
              </div>

              {/* Deflection Label */}
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
