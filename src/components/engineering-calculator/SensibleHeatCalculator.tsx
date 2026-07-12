'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function SensibleHeatCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.sensibleHeat;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [massFlow, setMassFlow] = useState('1.5'); // m (kg/s or lb/s)
  const [specificHeat, setSpecificHeat] = useState('1.006'); // Cp (kJ/kgK or BTU/lbF) - default Air
  const [t1, setT1] = useState('20'); // Initial Temp
  const [t2, setT2] = useState('35'); // Final Temp

  // Results
  const [heatLoad, setHeatLoad] = useState<number | null>(null);

  // Unit Labels
  const units = {
    massFlow: isImperial ? 'lb/s' : 'kg/s',
    specificHeat: isImperial ? 'BTU/(lb·°F)' : 'kJ/(kg·K)',
    temp: isImperial ? '°F' : '°C',
    heatLoad: isImperial ? 'BTU/s' : 'kW',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setMassFlow('3.3'); // ~1.5 kg/s in lb/s
      setSpecificHeat('0.24'); // Cp for air in BTU/lbF
      setT1('68'); // 20C
      setT2('95'); // 35C
    } else {
      setMassFlow('1.5');
      setSpecificHeat('1.006');
      setT1('20');
      setT2('35');
    }
  }, [isImperial]);

  const calculate = () => {
    const m = parseFloat(massFlow);
    const Cp = parseFloat(specificHeat);
    const T_initial = parseFloat(t1);
    const T_final = parseFloat(t2);

    if (isNaN(m) || isNaN(Cp) || isNaN(T_initial) || isNaN(T_final)) {
      setHeatLoad(null);
      return;
    }

    const deltaT = T_final - T_initial; // can be negative if cooling

    // Q = m * Cp * deltaT
    // Metric: kg/s * kJ/(kgK) * K = kJ/s = kW
    // Imperial: lb/s * BTU/(lbF) * F = BTU/s
    const Q = m * Cp * deltaT;
    setHeatLoad(Q);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            ❄️ {t?.title || 'Sensible Heat Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the sensible heat load required for heating or cooling.'}
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

          {/* Specific Heat */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.specificHeat || 'Specific Heat (C_p)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={specificHeat}
                onChange={(e) => setSpecificHeat(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-[10px] font-semibold">
                {units.specificHeat}
              </span>
            </div>
          </div>

          {/* Initial Temp */}
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

          {/* Final Temp */}
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
          
          <div className={`p-6 rounded-lg border flex flex-col items-center justify-center mb-6 ${heatLoad !== null && heatLoad < 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t?.results?.heatLoad || 'Sensible Heat Load (Q)'} 
              {heatLoad !== null && (heatLoad < 0 ? ' (Cooling)' : ' (Heating)')}
            </span>
            <span className={`text-4xl font-bold ${heatLoad !== null && heatLoad < 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
              {heatLoad !== null ? Math.abs(heatLoad).toFixed(2) : '-'}
              <span className="text-lg font-normal ml-1">
                {units.heatLoad}
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Heating/Cooling Process'}
            </h4>
            {/* Process Diagram */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center px-4 justify-between">
              
              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 flex items-center justify-center shadow-md">
                  <span className="font-bold text-sm">{t1}°</span>
                </div>
                <span className="text-xs mt-1 text-gray-500">T₁</span>
              </div>

              {/* Coil/Heat Exchanger */}
              <div className="flex-1 mx-4 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-2 bg-gray-300 dark:bg-gray-500 rounded"></div>
                </div>
                
                {heatLoad !== null && heatLoad > 0 && (
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/40 border-2 border-red-400 rounded flex items-center justify-center z-10 animate-pulse">
                    <span className="text-xl">🔥</span>
                  </div>
                )}
                
                {heatLoad !== null && heatLoad < 0 && (
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/40 border-2 border-blue-400 rounded flex items-center justify-center z-10 animate-pulse">
                    <span className="text-xl">❄️</span>
                  </div>
                )}

                {heatLoad === null && (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 border-2 border-gray-400 rounded flex items-center justify-center z-10">
                    <span className="text-xl">❓</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center z-10">
                <div className="w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-2 border-gray-300 flex items-center justify-center shadow-md">
                  <span className="font-bold text-sm">{t2}°</span>
                </div>
                <span className="text-xs mt-1 text-gray-500">T₂</span>
              </div>
              
              {/* Flow Direction */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-400 tracking-widest">
                FLOW ➔
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
