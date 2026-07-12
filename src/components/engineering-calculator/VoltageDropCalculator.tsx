'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
export default function VoltageDropCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.voltageDrop;

  // Unit system state
  const [isImperial, setIsImperial] = useState(false);

  // Inputs
  const [material, setMaterial] = useState('copper'); // 'copper' or 'aluminum'
  const [phase, setPhase] = useState('1'); // '1' or '3'
  const [voltage, setVoltage] = useState('220'); // V
  const [current, setCurrent] = useState('20'); // A
  const [distance, setDistance] = useState('50'); // m or ft
  const [wireSize, setWireSize] = useState('4'); // mm2 or AWG

  // Results
  const [voltageDrop, setVoltageDrop] = useState<number | null>(null);
  const [percentage, setPercentage] = useState<number | null>(null);
  const [endVoltage, setEndVoltage] = useState<number | null>(null);

  // Unit Labels
  const units = {
    distance: isImperial ? 'ft' : 'm',
    wireSize: isImperial ? 'AWG' : 'mm²',
  };

  // Convert default values when switching units
  useEffect(() => {
    if (isImperial) {
      setDistance('164'); // ~50m in ft
      setWireSize('12'); // ~4mm2 in AWG
      setVoltage('120');
    } else {
      setDistance('50');
      setWireSize('4');
      setVoltage('220');
    }
  }, [isImperial]);

  const calculate = () => {
    const V = parseFloat(voltage);
    const I = parseFloat(current);
    const L = parseFloat(distance);
    let A = parseFloat(wireSize); // Area

    if (isNaN(V) || isNaN(I) || isNaN(L) || isNaN(A) || V === 0) {
      setVoltageDrop(null);
      setPercentage(null);
      setEndVoltage(null);
      return;
    }

    // Resistivity at 20C
    // Copper: 1.68 * 10^-8 Ohm*m = 0.0168 Ohm*mm2/m
    // Aluminum: 2.82 * 10^-8 Ohm*m = 0.0282 Ohm*mm2/m
    let rho = material === 'copper' ? 0.0168 : 0.0282; // Ohm*mm2/m

    if (isImperial) {
      // In Imperial, usually K is used. K for Cu = ~12.9 ohms-cmil/ft, Al = ~21.2
      // Let's convert AWG to circular mils (cmil)
      // Area in cmil = 105531.48 * (0.79304)^(AWG) - approximation, or use exact formula
      // More accurate AWG to cmil: d = 0.005 * 92^((36-AWG)/39) inches. cmil = (d * 1000)^2
      const awg = A;
      const diameter_in = 0.005 * Math.pow(92, (36 - awg) / 39);
      const cmil = Math.pow(diameter_in * 1000, 2);
      
      const K = material === 'copper' ? 12.9 : 21.2;
      
      // VD = (2 * K * I * L) / cmil for 1-phase
      // VD = (sqrt(3) * K * I * L) / cmil for 3-phase
      const factor = phase === '1' ? 2 : Math.sqrt(3);
      const VD = (factor * K * I * L) / cmil;
      
      setVoltageDrop(VD);
      setPercentage((VD / V) * 100);
      setEndVoltage(V - VD);
    } else {
      // Metric: R = rho * (L / A)
      const R = rho * (L / A);
      
      // VD = 2 * I * R for 1-phase
      // VD = sqrt(3) * I * R for 3-phase
      const factor = phase === '1' ? 2 : Math.sqrt(3);
      const VD = factor * I * R;

      setVoltageDrop(VD);
      setPercentage((VD / V) * 100);
      setEndVoltage(V - VD);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
    {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            ⚡ {t?.title || 'Voltage Drop Calculator'}
          </h3>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate the voltage drop in an electrical circuit.'}
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

          {/* Current */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.current || 'Load Current (A)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                A
              </span>
            </div>
          </div>

          {/* Distance */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.distance || 'Cable Distance (L)'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.distance}
              </span>
            </div>
          </div>

          {/* Wire Size */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.wireSize || 'Wire Size'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={wireSize}
                onChange={(e) => setWireSize(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <span className="w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                {units.wireSize}
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
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.voltageDrop || 'Voltage Drop'}</span>
              <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                {voltageDrop !== null ? voltageDrop.toFixed(2) : '-'} <span className="text-sm font-normal">V</span>
              </span>
            </div>
            
            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-100 dark:border-orange-800 flex flex-col items-center justify-center text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.percentage || 'Percentage Drop'}</span>
              <span className={`text-2xl font-bold ${percentage && percentage > 3 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`}>
                {percentage !== null ? percentage.toFixed(2) : '-'} <span className="text-sm font-normal">%</span>
              </span>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800 flex flex-col items-center justify-center text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.endVoltage || 'End Voltage'}</span>
            <span className="text-3xl font-bold text-green-600 dark:text-green-400">
              {endVoltage !== null ? endVoltage.toFixed(2) : '-'} <span className="text-lg font-normal">V</span>
            </span>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-semibold mb-4 text-gray-700 dark:text-gray-300">
              {t?.visualization?.title || 'Voltage Drop Diagram'}
            </h4>
            {/* Diagram */}
            <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
              {/* Power Source */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-16 bg-yellow-400 border-2 border-yellow-600 rounded flex flex-col items-center justify-center text-yellow-900 font-bold">
                SRC
                <span className="text-xs">{voltage}V</span>
              </div>

              {/* Wire */}
              <div className="absolute left-16 right-16 top-1/2 transform -translate-y-1/2 h-2 bg-orange-400 border-y border-orange-600"></div>

              {/* Voltage Drop Label */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-xs font-mono font-bold text-red-500">
                - {voltageDrop !== null ? voltageDrop.toFixed(2) : '?'} V
              </div>
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 dark:text-gray-400">
                {distance} {units.distance}
              </div>

              {/* Load */}
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-16 bg-blue-400 border-2 border-blue-600 rounded flex flex-col items-center justify-center text-blue-900 font-bold">
                LOAD
                <span className="text-xs">{endVoltage !== null ? endVoltage.toFixed(1) : '?'}V</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              * A voltage drop of less than 3% to 5% is generally recommended for optimal performance.
            </p>
          </div>
        </div>

        {}
        
      </div>
    </div>
  );
}
