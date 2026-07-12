'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function AsmeSectionViiiCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.asmeSectionViii;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [vesselType, setVesselType] = useState('cylinder'); // 'cylinder' or 'sphere'
  const [pressure, setPressure] = useState('2.5'); // P (MPa or psi)
  const [radius, setRadius] = useState('500'); // R (mm or in)
  const [stress, setStress] = useState('138'); // S (MPa or psi)
  const [efficiency, setEfficiency] = useState('1.0'); // E (0.1 ~ 1.0)

  // Results
  const [thickness, setThickness] = useState<number | null>(null);

  // Unit Labels
  const units = {
    pressure: isImperial ? 'psi' : 'MPa',
    radius: isImperial ? 'in' : 'mm',
    stress: isImperial ? 'psi' : 'MPa',
    thickness: isImperial ? 'in' : 'mm',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setPressure('360'); // ~2.5 MPa
      setRadius('20'); // ~500 mm
      setStress('20000'); // ~138 MPa
    } else {
      setPressure('2.5');
      setRadius('500');
      setStress('138');
    }
  }, [isImperial]);

  const calculate = () => {
    const P = parseFloat(pressure);
    const R = parseFloat(radius);
    const S = parseFloat(stress);
    const E = parseFloat(efficiency);

    if (isNaN(P) || isNaN(R) || isNaN(S) || isNaN(E) || E <= 0 || E > 1) {
      setThickness(null);
      return;
    }

    let t_req = 0;
    if (vesselType === 'cylinder') {
      // Cylinder: t = (P * R) / (S * E - 0.6 * P)
      const denom = S * E - 0.6 * P;
      if (denom <= 0) {
        setThickness(null);
        return;
      }
      t_req = (P * R) / denom;
    } else {
      // Sphere: t = (P * R) / (2 * S * E - 0.2 * P)
      const denom = 2 * S * E - 0.2 * P;
      if (denom <= 0) {
        setThickness(null);
        return;
      }
      t_req = (P * R) / denom;
    }

    setThickness(t_req);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🛡️ {t?.title || 'ASME Section VIII Vessel Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the required thickness for cylindrical and spherical pressure vessels under internal pressure.'}
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

          {/* Inner Radius */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.radius || 'Inner Radius (R)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.radius}
              </span>
            </div>
          </div>

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

          {/* Joint Efficiency */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.efficiency || 'Joint Efficiency (E)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={efficiency}
                onChange={(e) => setEfficiency(e.target.value)}
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
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center mb-6">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t?.results?.thickness || 'Required Thickness (t)'}
            </span>
            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              {thickness !== null ? thickness.toFixed(4) : '-'}
              <span className="text-lg font-normal ml-1">
                {units.thickness}
              </span>
            </span>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Vessel Cross-Section'}
            </h4>
            {/* Diagram */}
            <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
              {vesselType === 'cylinder' ? (
                // Cylinder View
                <div className="relative w-40 h-24 bg-gray-300 dark:bg-gray-500 border-4 border-gray-400 dark:border-gray-400 rounded-sm flex items-center justify-center">
                  <div className="w-full h-16 bg-blue-100 dark:bg-blue-900/40 shadow-inner flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">P →</span>
                  </div>
                  {/* Annotations */}
                  <div className="absolute -top-4 w-full text-center text-xs font-mono">Cylindrical Shell</div>
                </div>
              ) : (
                // Sphere View
                <div className="relative w-32 h-32 rounded-full border-4 border-gray-400 dark:border-gray-500 bg-gray-300 dark:bg-gray-500 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/40 shadow-inner flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 text-lg font-bold">⤡ P ⤢</span>
                  </div>
                  <div className="absolute -top-6 w-full text-center text-xs font-mono">Spherical Shell</div>
                </div>
              )}

              {/* R and t annotations */}
              <div className="absolute bottom-2 left-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                R = {radius || '?'} {units.radius}
              </div>
              <div className="absolute bottom-2 right-4 text-xs font-mono text-gray-600 dark:text-gray-400">
                t = {thickness !== null ? thickness.toFixed(2) : '?'} {units.thickness}
              </div>
            </div>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
