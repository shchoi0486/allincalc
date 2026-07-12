'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function ThermalExpansionCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.thermalExpansion;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [material, setMaterial] = useState('steel');
  const [customCoeff, setCustomCoeff] = useState('12'); // x10^-6
  const [length, setLength] = useState('10'); // m or ft
  const [t1, setT1] = useState('20'); // C or F
  const [t2, setT2] = useState('100'); // C or F

  // Results
  const [changeInLength, setChangeInLength] = useState<number | null>(null);
  const [finalLength, setFinalLength] = useState<number | null>(null);

  // Coefficients (x 10^-6 /°C)
  const coeffs: Record<string, number> = {
    aluminum: 23,
    copper: 17,
    steel: 12,
    concrete: 10,
    glass: 9,
  };

  // Unit Labels
  const units = {
    length: isImperial ? 'ft' : 'm',
    temp: isImperial ? '°F' : '°C',
    change: isImperial ? 'in' : 'mm',
  };

  useEffect(() => {
    if (isImperial) {
      setLength('32.8'); // ~10m in ft
      setT1('68'); // 20C in F
      setT2('212'); // 100C in F
    } else {
      setLength('10');
      setT1('20');
      setT2('100');
    }
  }, [isImperial]);

  const calculate = () => {
    const L0 = parseFloat(length);
    const T1 = parseFloat(t1);
    const T2 = parseFloat(t2);
    let alpha = material === 'custom' ? parseFloat(customCoeff) : coeffs[material];

    if (isNaN(L0) || isNaN(T1) || isNaN(T2) || isNaN(alpha)) {
      setChangeInLength(null);
      setFinalLength(null);
      return;
    }

    // Alpha is usually given per °C. If imperial, we need it per °F.
    // 1 /°C = 1 / 1.8 /°F
    const alphaActual = isImperial ? (alpha * 1e-6) / 1.8 : alpha * 1e-6;
    const deltaT = T2 - T1;

    // deltaL = alpha * L0 * deltaT
    const deltaL = alphaActual * L0 * deltaT;
    
    // deltaL is in the same unit as L0. Let's convert to mm or inches for better readability.
    const deltaL_display = isImperial ? deltaL * 12 : deltaL * 1000;
    
    setChangeInLength(deltaL_display);
    setFinalLength(L0 + deltaL);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🔥 {t?.title || 'Thermal Expansion'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate linear thermal expansion.'}
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

          {/* Initial Length */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.length || 'Initial Length (L₀)'}
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

          {/* T1 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.t1 || 'Initial Temp (T₁)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.temp}
              </span>
            </div>
          </div>

          {/* T2 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.t2 || 'Final Temp (T₂)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={t2}
                onChange={(e) => setT2(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.temp}
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
          
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-100 dark:border-red-800 flex flex-col items-center justify-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.changeInLength || 'Change in Length (ΔL)'}</span>
            <span className="text-4xl font-bold text-red-600 dark:text-red-400">
              {changeInLength !== null ? (changeInLength > 0 ? '+' : '') + changeInLength.toFixed(4) : '-'} <span className="text-lg font-normal">{units.change}</span>
            </span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.finalLength || 'Final Length (L₁)'}</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {finalLength !== null ? finalLength.toFixed(4) : '-'} <span className="text-sm font-normal">{units.length}</span>
            </span>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Thermal Expansion Diagram'}
            </h4>
            {/* Diagram */}
            <div className="relative w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex flex-col justify-center px-4">
              {/* L0 Bar */}
              <div className="w-[70%] h-4 bg-gray-400 dark:bg-gray-500 rounded relative">
                <span className="absolute -top-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-600 dark:text-gray-300">L₀</span>
              </div>
              
              {/* Delta L expansion visualization */}
              {changeInLength !== null && changeInLength > 0 && (
                <div className="w-[85%] flex items-center mt-2">
                  <div className="w-[82.35%] h-4 bg-gray-400 dark:bg-gray-500 rounded-l"></div>
                  <div className="w-[17.65%] h-4 bg-red-500 dark:bg-red-400 rounded-r relative flex items-center">
                    <span className="absolute -right-6 text-xs font-bold text-red-600 dark:text-red-400 ml-1">+ΔL</span>
                  </div>
                </div>
              )}
              {changeInLength !== null && changeInLength < 0 && (
                <div className="w-[70%] flex items-center mt-2">
                  <div className="w-[80%] h-4 bg-gray-400 dark:bg-gray-500 rounded-l"></div>
                  <div className="w-[20%] h-4 bg-blue-300 dark:bg-blue-800 rounded-r relative flex items-center border border-dashed border-blue-500">
                    <span className="absolute -right-6 text-xs font-bold text-blue-600 dark:text-blue-400 ml-1">-ΔL</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
