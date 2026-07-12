'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function BarlowsFormulaCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.barlowsFormula;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [diameter, setDiameter] = useState('219.1'); // D_o (mm or in)
  const [thickness, setThickness] = useState('8.18'); // t (mm or in)
  const [yieldStrength, setYieldStrength] = useState('240'); // S_y (MPa or psi)
  const [ultimateStrength, setUltimateStrength] = useState('415'); // S_t (MPa or psi)
  const [designFactor, setDesignFactor] = useState('0.72'); // F_d
  const [jointFactor, setJointFactor] = useState('1.0'); // F_e
  const [tempFactor, setTempFactor] = useState('1.0'); // F_t

  // Results
  const [yieldPressure, setYieldPressure] = useState<number | null>(null);
  const [burstPressure, setBurstPressure] = useState<number | null>(null);
  const [allowablePressure, setAllowablePressure] = useState<number | null>(null);

  // Unit Labels
  const units = {
    diameter: isImperial ? 'in' : 'mm',
    thickness: isImperial ? 'in' : 'mm',
    pressure: isImperial ? 'psi' : 'MPa',
    strength: isImperial ? 'psi' : 'MPa',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setDiameter('8.625'); // 8 inch pipe
      setThickness('0.322'); // Sch 40
      setYieldStrength('35000'); // ~240 MPa
      setUltimateStrength('60000'); // ~415 MPa
    } else {
      setDiameter('219.1'); // 8 inch pipe
      setThickness('8.18'); // Sch 40
      setYieldStrength('240');
      setUltimateStrength('415');
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

    // P_y = 2 * S_y * t / D
    const Py = (2 * Sy * th) / D;
    setYieldPressure(Py);

    // P_t = 2 * S_t * t / D
    const Pt = (2 * St * th) / D;
    setBurstPressure(Pt);

    // P_a = 2 * S_y * F_d * F_e * F_t * t / D
    const Pa = (2 * Sy * Fd * Fe * Ft * th) / D;
    setAllowablePressure(Pa);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🛢️ {t?.title || 'Barlow\'s Formula Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate internal, allowable, and bursting pressure.'}
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

          {/* Wall Thickness */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.thickness}
              </span>
            </div>
          </div>

          {/* Yield Strength */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.strength}
              </span>
            </div>
          </div>

          {/* Ultimate Strength */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.strength}
              </span>
            </div>
          </div>

          {/* Design Factor */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          {/* Joint Factor */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          {/* Temperature Factor */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
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
          
          <div className="space-y-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.allowablePressure || 'Allowable Pressure (P_a)'}</span>
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {allowablePressure !== null ? allowablePressure.toFixed(2) : '-'} <span className="text-sm font-normal">{units.pressure}</span>
              </span>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.yieldPressure || 'Pressure at Yield (P_y)'}</span>
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {yieldPressure !== null ? yieldPressure.toFixed(2) : '-'} <span className="text-sm font-normal">{units.pressure}</span>
              </span>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t?.results?.burstPressure || 'Burst Pressure (P_t)'}</span>
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {burstPressure !== null ? burstPressure.toFixed(2) : '-'} <span className="text-sm font-normal">{units.pressure}</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Pressure Limits Overview'}
            </h4>
            {/* Simple Bar Chart Visualization */}
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

        {}
        
      </div>
    </div>
  );
}
