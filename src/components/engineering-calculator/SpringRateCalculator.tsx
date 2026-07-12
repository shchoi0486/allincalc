'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function SpringRateCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.springRate;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [wireDiameter, setWireDiameter] = useState('2'); // d (mm or in)
  const [outerDiameter, setOuterDiameter] = useState('20'); // D_o (mm or in)
  const [activeCoils, setActiveCoils] = useState('10'); // n_a
  const [shearModulus, setShearModulus] = useState('79.3'); // G (GPa or Mpsi - Steel)

  // Results
  const [springRate, setSpringRate] = useState<number | null>(null);
  const [meanDiameter, setMeanDiameter] = useState<number | null>(null);

  // Unit Labels
  const units = {
    diameter: isImperial ? 'in' : 'mm',
    modulus: isImperial ? 'Mpsi' : 'GPa',
    rate: isImperial ? 'lb/in' : 'N/mm',
  };

  useEffect(() => {
    if (isImperial) {
      setWireDiameter('0.08'); // ~2mm
      setOuterDiameter('0.8'); // ~20mm
      setActiveCoils('10');
      setShearModulus('11.5'); // Steel ~ 11.5 Mpsi
    } else {
      setWireDiameter('2');
      setOuterDiameter('20');
      setActiveCoils('10');
      setShearModulus('79.3'); // Steel ~ 79.3 GPa
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

    const D = D_o - d;
    setMeanDiameter(D);

    if (isImperial) {
      // G is in Mpsi (10^6 psi)
      const G = G_input * 1000000;
      // k = (G * d^4) / (8 * D^3 * n_a)  => lb/in
      const k = (G * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * n_a);
      setSpringRate(k);
    } else {
      // G is in GPa (10^9 N/m^2 = 10^3 N/mm^2)
      const G = G_input * 1000;
      // k = (G * d^4) / (8 * D^3 * n_a)  => N/mm
      const k = (G * Math.pow(d, 4)) / (8 * Math.pow(D, 3) * n_a);
      setSpringRate(k);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            ⚙️ {t?.title || 'Spring Rate Calculator'}
          </h3>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the spring constant (rate) of a helical compression spring.'}
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
              className="hidden"
            />
            <Label htmlFor="unit-toggle" className={`text-xs font-semibold cursor-pointer px-3 py-1 rounded-full transition-colors ${isImperial ? 'bg-white dark:bg-gray-600 shadow-sm text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
              {dict?.common?.unitSystemImperial || 'Imperial'}
            </Label>
          </div>
        </div>

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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.diameter}
              </span>
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.diameter}
              </span>
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
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
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.modulus}
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
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-4">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">{t?.results?.springRate || 'Spring Rate (k)'}</span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {springRate !== null ? springRate.toFixed(4) : '-'} <span className="text-lg font-normal ml-1">{units.rate}</span>
            </span>
          </div>

          <div className="text-center mb-6">
            <span className="text-sm text-gray-500">{t?.results?.meanDiameter || 'Mean Diameter (D)'}: </span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">{meanDiameter !== null ? meanDiameter.toFixed(2) : '-'} {units.diameter}</span>
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
                D_o = {outerDiameter} {units.diameter}
              </div>
              <div className="absolute bottom-1 right-12 text-[10px] font-mono text-gray-500">
                d = {wireDiameter} {units.diameter}
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
