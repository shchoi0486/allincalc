'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function ReynoldsNumberCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.reynoldsNumber;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [density, setDensity] = useState('1000'); // kg/m3 or lb/ft3
  const [velocity, setVelocity] = useState('2'); // m/s or ft/s
  const [diameter, setDiameter] = useState('0.1'); // m or in
  const [viscosity, setViscosity] = useState('0.001'); // Pa.s or lb/(ft.s)

  // Results
  const [reynolds, setReynolds] = useState<number | null>(null);
  const [regime, setRegime] = useState<string>('');

  // Unit Labels
  const units = {
    density: isImperial ? 'lb/ft³' : 'kg/m³',
    velocity: isImperial ? 'ft/s' : 'm/s',
    diameter: isImperial ? 'in' : 'm',
    viscosity: isImperial ? 'lb/(ft·s)' : 'Pa·s',
  };

  useEffect(() => {
    if (isImperial) {
      setDensity('62.4'); // Water at 20C
      setVelocity('6.56'); // ~2 m/s
      setDiameter('3.94'); // ~0.1 m
      setViscosity('0.000672'); // Water at 20C in lb/(ft.s)
    } else {
      setDensity('1000');
      setVelocity('2');
      setDiameter('0.1');
      setViscosity('0.001');
    }
  }, [isImperial]);

  const calculate = () => {
    const rho = parseFloat(density);
    const v = parseFloat(velocity);
    const D = parseFloat(diameter);
    const mu = parseFloat(viscosity);

    if (isNaN(rho) || isNaN(v) || isNaN(D) || isNaN(mu) || mu === 0) {
      setReynolds(null);
      setRegime('');
      return;
    }

    let Re = 0;
    if (isImperial) {
      // Re = (rho * v * D) / mu
      // D is in inches, so D/12 for ft
      const D_ft = D / 12;
      Re = (rho * v * D_ft) / mu;
    } else {
      // Metric: Re = (rho * v * D) / mu
      Re = (rho * v * D) / mu;
    }

    setReynolds(Re);

    if (Re < 2300) {
      setRegime('laminar');
    } else if (Re <= 4000) {
      setRegime('transitional');
    } else {
      setRegime('turbulent');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🌊 {t?.title || 'Reynolds Number Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the Reynolds number to determine whether fluid flow is laminar or turbulent.'}
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

          {/* Velocity */}
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
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.velocity}
              </span>
            </div>
          </div>

          {/* Diameter */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.diameter}
              </span>
            </div>
          </div>

          {/* Viscosity */}
          <div className="flex flex-col sm:flex-row sm:items-center">
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
              <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-[10px] font-semibold">
                {units.viscosity}
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
              {reynolds !== null ? reynolds.toLocaleString(undefined, {maximumFractionDigits: 0}) : '-'}
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

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Flow Characteristics'}
            </h4>
            {/* Diagram */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              {/* Pipe Body */}
              <div className="absolute w-[80%] h-16 bg-white dark:bg-gray-800 border-y-4 border-gray-400 dark:border-gray-500 overflow-hidden">
                {/* Flow lines based on regime */}
                {regime === 'laminar' && (
                  <div className="absolute inset-0 flex flex-col justify-evenly py-2 px-4 opacity-70">
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                    <div className="h-0.5 bg-blue-500 w-full"></div>
                  </div>
                )}
                
                {regime === 'transitional' && (
                  <div className="absolute inset-0 flex flex-col justify-evenly py-2 px-4 opacity-70">
                    <svg className="w-full h-full" preserveAspectRatio="none">
                      <path d="M 0 10 Q 50 15, 100 5 T 200 15 T 300 10 T 400 15" stroke="currentColor" className="text-orange-500" strokeWidth="2" fill="none" />
                      <path d="M 0 30 Q 60 25, 120 35 T 220 25 T 320 35 T 400 30" stroke="currentColor" className="text-orange-500" strokeWidth="2" fill="none" />
                      <path d="M 0 50 Q 40 55, 90 45 T 190 55 T 290 45 T 400 50" stroke="currentColor" className="text-orange-500" strokeWidth="2" fill="none" />
                    </svg>
                  </div>
                )}

                {regime === 'turbulent' && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-70 overflow-hidden">
                    <svg className="w-[120%] h-full -ml-[10%]" preserveAspectRatio="none">
                      <path d="M 0 20 Q 20 60, 40 10 T 80 50 T 120 10 T 160 50 T 200 10 T 240 50 T 280 10 T 320 50 T 360 10 T 400 50 T 440 10" stroke="currentColor" className="text-red-500" strokeWidth="2" fill="none" />
                      <path d="M 0 40 Q 30 10, 60 50 T 100 10 T 140 50 T 180 10 T 220 50 T 260 10 T 300 50 T 340 10 T 380 50 T 420 10" stroke="currentColor" className="text-red-500" strokeWidth="2" fill="none" />
                      {/* Swirls */}
                      <circle cx="100" cy="30" r="10" stroke="currentColor" className="text-red-400" strokeWidth="1.5" fill="none" strokeDasharray="30 10" />
                      <circle cx="250" cy="25" r="12" stroke="currentColor" className="text-red-400" strokeWidth="1.5" fill="none" strokeDasharray="30 10" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
