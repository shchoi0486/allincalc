'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function AsmeB313Calculator() {
  const { dict } = useI18n();
  const t = dict?.common?.asmeB313;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [calcTarget, setCalcTarget] = useState('thickness'); // 'thickness' or 'pressure'
  const [diameter, setDiameter] = useState('114.3'); // D (mm or in)
  const [pressure, setPressure] = useState('1.5'); // P (MPa or psi)
  const [thickness, setThickness] = useState('6.02'); // t (mm or in)
  const [stress, setStress] = useState('137.9'); // S (MPa or psi)
  const [qualityFactor, setQualityFactor] = useState('1.0'); // E
  const [coefficientY, setCoefficientY] = useState('0.4'); // Y
  const [tolerance, setTolerance] = useState('12.5'); // alpha (%)

  // Results
  const [resultThickness, setResultThickness] = useState<number | null>(null);
  const [resultPressure, setResultPressure] = useState<number | null>(null);

  // Unit Labels
  const units = {
    diameter: isImperial ? 'in' : 'mm',
    thickness: isImperial ? 'in' : 'mm',
    pressure: isImperial ? 'psi' : 'MPa',
    stress: isImperial ? 'psi' : 'MPa',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setDiameter('4.5'); // 4.5 in (4 inch pipe)
      setPressure('217.5'); // ~1.5 MPa
      setThickness('0.237'); // 6.02 mm
      setStress('20000'); // ~137.9 MPa
    } else {
      setDiameter('114.3'); // 4 inch pipe
      setPressure('1.5'); // 1.5 MPa
      setThickness('6.02'); // Sch 40
      setStress('137.9'); // ~20,000 psi
    }
  }, [isImperial]);

  const calculate = () => {
    const D = parseFloat(diameter);
    const P = parseFloat(pressure);
    const t_input = parseFloat(thickness);
    const S = parseFloat(stress);
    const E = parseFloat(qualityFactor);
    const Y = parseFloat(coefficientY);
    const alpha = parseFloat(tolerance);

    if (isNaN(D) || isNaN(S) || isNaN(E) || isNaN(Y) || isNaN(alpha)) {
      setResultThickness(null);
      setResultPressure(null);
      return;
    }

    if (calcTarget === 'thickness') {
      if (isNaN(P)) return;
      // ASME B31.3 formula for thickness:
      // t = (P * D) / (2 * (S * E + P * Y))
      // Adding thickness tolerance: t_req = t / (1 - alpha/100)
      const t_calc = (P * D) / (2 * (S * E + P * Y));
      const t_req = t_calc / (1 - alpha / 100);
      setResultThickness(t_req);
      setResultPressure(null);
    } else {
      if (isNaN(t_input)) return;
      // ASME B31.3 formula for pressure:
      // P = (2 * t_effective * S * E) / (D - 2 * t_effective * Y)
      // where t_effective = t_input * (1 - alpha/100)
      const t_eff = t_input * (1 - alpha / 100);
      const P_calc = (2 * t_eff * S * E) / (D - 2 * t_eff * Y);
      setResultPressure(P_calc);
      setResultThickness(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🔧 {t?.title || 'ASME B31.3 Pipe Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate allowable pressure or required wall thickness of a pipe based on ASME B31.3 code.'}
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

          {/* Internal Pressure (if calcTarget is thickness) */}
          {calcTarget === 'thickness' && (
            <div className="flex flex-col sm:flex-row sm:items-center">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                {t?.inputs?.pressure || 'Internal Pressure (P)'}
              </Label>
              <div className="sm:w-1/2 flex min-w-0">
                <Input
                  type="number"
                  value={pressure}
                  onChange={(e) => setPressure(e.target.value)}
                  className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
                />
                <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                  {units.pressure}
                </span>
              </div>
            </div>
          )}

          {/* Wall Thickness (if calcTarget is pressure) */}
          {calcTarget === 'pressure' && (
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
          )}

          {/* Allowable Stress */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.stress || 'Allowable Stress (S)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={stress}
                onChange={(e) => setStress(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.stress}
              </span>
            </div>
          </div>

          {/* Quality Factor */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.qualityFactor || 'Quality Factor (E)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={qualityFactor}
                onChange={(e) => setQualityFactor(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          {/* Coefficient Y */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.coefficientY || 'Thickness Coefficient (Y)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={coefficientY}
                onChange={(e) => setCoefficientY(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                -
              </span>
            </div>
          </div>

          {/* Tolerance */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.tolerance || 'Thickness Tolerance (α)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                %
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
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {calcTarget === 'thickness' 
                ? (t?.results?.requiredThickness || 'Required Thickness (t)') 
                : (t?.results?.allowablePressure || 'Allowable Pressure (P)')}
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {calcTarget === 'thickness' 
                ? (resultThickness !== null ? resultThickness.toFixed(4) : '-') 
                : (resultPressure !== null ? resultPressure.toFixed(4) : '-')}
              <span className="text-lg font-normal ml-1">
                {calcTarget === 'thickness' ? units.thickness : units.pressure}
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Pipe Cross-Section'}
            </h4>
            {/* Pipe Diagram using CSS */}
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {/* Outer Pipe */}
              <div className="absolute w-32 h-32 rounded-full border-4 border-gray-400 dark:border-gray-500 bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                {/* Inner Pipe */}
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center relative shadow-inner">
                  {/* Internal Pressure arrows */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-50">
                    <span className="absolute -top-1 text-blue-600 dark:text-blue-400 text-xs rotate-[-90deg]">→</span>
                    <span className="absolute -bottom-1 text-blue-600 dark:text-blue-400 text-xs rotate-[90deg]">→</span>
                    <span className="absolute -left-1 text-blue-600 dark:text-blue-400 text-xs rotate-[180deg]">→</span>
                    <span className="absolute -right-1 text-blue-600 dark:text-blue-400 text-xs">→</span>
                    <span className="text-blue-800 dark:text-blue-200 font-bold text-sm">P</span>
                  </div>
                </div>
              </div>
              
              {/* Diameter D Line */}
              <div className="absolute top-4 w-32 border-t border-gray-800 dark:border-gray-200 flex justify-center">
                <div className="absolute -top-3 bg-gray-100 dark:bg-gray-700 px-1 text-xs font-mono">D = {diameter || '?'}</div>
                <div className="absolute -left-1 -top-1.5">|</div>
                <div className="absolute -right-1 -top-1.5">|</div>
              </div>

              {/* Thickness t Line */}
              <div className="absolute bottom-4 right-[calc(50%-4rem)] w-4 border-t border-gray-800 dark:border-gray-200 flex justify-center">
                <div className="absolute top-1 bg-gray-100 dark:bg-gray-700 px-1 text-[10px] font-mono whitespace-nowrap">t</div>
                <div className="absolute -left-1 -top-1.5">|</div>
                <div className="absolute -right-1 -top-1.5">|</div>
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
