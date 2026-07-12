'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function HeatTransferCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.heatTransfer;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [area, setArea] = useState('10'); // A
  const [thickness, setThickness] = useState('0.15'); // d
  const [conductivity, setConductivity] = useState('0.04'); // k (e.g. fiberglass insulation)
  const [t1, setT1] = useState('25'); // Hot Temp
  const [t2, setT2] = useState('5'); // Cold Temp

  // Results
  const [heatRate, setHeatRate] = useState<number | null>(null);
  const [heatFlux, setHeatFlux] = useState<number | null>(null);

  // Unit Labels
  const units = {
    area: isImperial ? 'ft²' : 'm²',
    thickness: isImperial ? 'in' : 'm',
    conductivity: isImperial ? 'BTU/(hr·ft·°F)' : 'W/(m·K)',
    temp: isImperial ? '°F' : '°C',
    heatRate: isImperial ? 'BTU/hr' : 'W',
    heatFlux: isImperial ? 'BTU/(hr·ft²)' : 'W/m²',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setArea('100'); // ft2
      setThickness('6'); // inches
      setConductivity('0.023'); // BTU/(hr·ft·°F) approx for fiberglass
      setT1('77'); // 25C
      setT2('41'); // 5C
    } else {
      setArea('10');
      setThickness('0.15');
      setConductivity('0.04');
      setT1('25');
      setT2('5');
    }
  }, [isImperial]);

  const calculate = () => {
    const A = parseFloat(area);
    const d = parseFloat(thickness);
    const k = parseFloat(conductivity);
    const T_hot = parseFloat(t1);
    const T_cold = parseFloat(t2);

    if (isNaN(A) || isNaN(d) || isNaN(k) || isNaN(T_hot) || isNaN(T_cold) || d === 0) {
      setHeatRate(null);
      setHeatFlux(null);
      return;
    }

    const deltaT = Math.abs(T_hot - T_cold);

    if (isImperial) {
      // Q = (k * A * deltaT) / (d_in / 12)
      const d_ft = d / 12;
      const Q = (k * A * deltaT) / d_ft;
      setHeatRate(Q);
      setHeatFlux(Q / A);
    } else {
      // Q = (k * A * deltaT) / d
      const Q = (k * A * deltaT) / d;
      setHeatRate(Q);
      setHeatFlux(Q / A);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🌡️ {t?.title || 'Heat Conduction Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate heat transfer rate using Fourier\'s Law.'}
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

          {/* Thickness */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.thickness || 'Material Thickness (d)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={thickness}
                onChange={(e) => setThickness(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.thickness}
              </span>
            </div>
          </div>

          {/* Conductivity */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.conductivity || 'Thermal Conductivity (k)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={conductivity}
                onChange={(e) => setConductivity(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-[10px] font-semibold">
                {units.conductivity}
              </span>
            </div>
          </div>

          {/* Hot Temp */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.t1 || 'Hot Temperature (T₁)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={t1}
                onChange={(e) => setT1(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.temp}
              </span>
            </div>
          </div>

          {/* Cold Temp */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.t2 || 'Cold Temperature (T₂)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={t2}
                onChange={(e) => setT2(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.heatRate || 'Heat Transfer Rate (Q)'}</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {heatRate !== null ? heatRate.toFixed(2) : '-'} <span className="text-sm font-normal">{units.heatRate}</span>
              </span>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.heatFlux || 'Heat Flux (q)'}</span>
              <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {heatFlux !== null ? heatFlux.toFixed(2) : '-'} <span className="text-sm font-normal">{units.heatFlux}</span>
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Temperature Gradient'}
            </h4>
            {/* Diagram */}
            <div className="relative w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              {/* Hot Side */}
              <div className="absolute left-0 w-1/4 h-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center border-r border-red-300">
                <span className="text-red-600 font-bold">T₁: {t1}°</span>
              </div>
              
              {/* Material */}
              <div className="absolute left-1/4 w-1/2 h-full bg-gray-300 dark:bg-gray-500 border-x-4 border-gray-400 dark:border-gray-400 flex flex-col items-center justify-between py-2">
                <span className="text-xs font-mono">k = {conductivity}</span>
                {/* Gradient Line */}
                <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                  <line x1="0" y1="20%" x2="100%" y2="80%" stroke="currentColor" strokeWidth="2" className="text-orange-500" strokeDasharray="4 4" />
                </svg>
                <div className="bg-white/80 dark:bg-black/50 px-2 py-1 rounded text-xs z-10 font-bold text-orange-600">Q ➔</div>
                <span className="text-xs font-mono">d = {thickness}</span>
              </div>

              {/* Cold Side */}
              <div className="absolute right-0 w-1/4 h-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border-l border-blue-300">
                <span className="text-blue-600 font-bold">T₂: {t2}°</span>
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
