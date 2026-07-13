'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

export default function ThermalExpansionCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.thermalExpansion;

  // Unit system state (global)
  const isImperial = unitSystem === 'imperial';

  // Inputs
  const [material, setMaterial] = useState('steel');
  const [customCoeff, setCustomCoeff] = useState('12'); // x10^-6 per chosen coeff unit
  const [length, setLength] = useState('10'); // L0
  const [t1, setT1] = useState('20'); // Initial temp
  const [t2, setT2] = useState('100'); // Final temp

  // Per-input unit selection
  const [lengthUnit, setLengthUnit] = useState<string>('m');
  const [t1Unit, setT1Unit] = useState<string>('°C');
  const [t2Unit, setT2Unit] = useState<string>('°C');
  const [coeffUnit, setCoeffUnit] = useState<string>('1/°C');

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

  // Conversion maps (to SI base)
  const LENGTH_TO_M: Record<string, number> = {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    in: 0.0254,
    ft: 0.3048,
  };
  const LENGTH_FROM_M: Record<string, number> = {
    mm: 1000,
    cm: 100,
    m: 1,
    in: 39.37007874,
    ft: 3.280839895,
  };
  // Absolute temperature -> Celsius (offset based)
  const TEMP_TO_C: Record<string, (v: number) => number> = {
    '°C': (v) => v,
    '°F': (v) => (v - 32) * 5 / 9,
    'K': (v) => v - 273.15,
  };
  // Linear expansion coefficient: 1/°F = 1.8 /°C
  const COEFF_TO_PER_C: Record<string, number> = {
    '1/°C': 1,
    '1/°F': 1.8,
  };

  const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
  const TEMP_UNITS = ['°C', '°F', 'K'];
  const COEFF_UNITS = ['1/°C', '1/°F'];

  useEffect(() => {
    if (isImperial) {
      setLength('32.8'); // ~10m in ft
      setT1('68'); // 20C in F
      setT2('212'); // 100C in F
      setCustomCoeff('6.7'); // 12 /°C = 6.7 /°F
      setLengthUnit('ft');
      setT1Unit('°F');
      setT2Unit('°F');
      setCoeffUnit('1/°F');
    } else {
      setLength('10');
      setT1('20');
      setT2('100');
      setCustomCoeff('12');
      setLengthUnit('m');
      setT1Unit('°C');
      setT2Unit('°C');
      setCoeffUnit('1/°C');
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

    // Convert to SI base
    const L0_m = L0 * (LENGTH_TO_M[lengthUnit] ?? 1);
    const alpha_per_C = (material === 'custom' ? alpha * (COEFF_TO_PER_C[coeffUnit] ?? 1) : alpha) * 1e-6;

    const T1_C = (TEMP_TO_C[t1Unit] ?? ((v: number) => v))(T1);
    const T2_C = (TEMP_TO_C[t2Unit] ?? ((v: number) => v))(T2);
    const deltaT = T2_C - T1_C;

    // deltaL = alpha * L0 * deltaT  (in metres)
    const deltaL_m = alpha_per_C * L0_m * deltaT;

    const changeUnit = isImperial ? 'in' : 'mm';
    const finalUnit = isImperial ? 'ft' : 'm';

    setChangeInLength(deltaL_m * (LENGTH_FROM_M[changeUnit] ?? 1));
    setFinalLength((L0_m + deltaL_m) * (LENGTH_FROM_M[finalUnit] ?? 1));
  };

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
      {/* Left: Input */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-6 gap-3">
          <h3 className="text-xl font-semibold flex items-center shrink-0">
            🔥 {t?.title || 'Thermal Expansion'}
          </h3>
          <UnitSystemToggle className="shrink-0" />
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || 'Calculate linear thermal expansion.'}
        </p>

        {/* Material */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
            {t?.inputs?.material || 'Material'}
          </Label>
          <div className="sm:w-1/2">
            <select
              aria-label={t?.inputs?.material || 'Material'}
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="w-full px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="aluminum">{t?.inputs?.aluminum || 'Aluminum'}</option>
              <option value="copper">{t?.inputs?.copper || 'Copper'}</option>
              <option value="steel">{t?.inputs?.steel || 'Steel'}</option>
              <option value="concrete">{t?.inputs?.concrete || 'Concrete'}</option>
              <option value="glass">{t?.inputs?.glass || 'Glass'}</option>
              <option value="custom">{t?.inputs?.custom || 'Custom'}</option>
            </select>
          </div>
        </div>

        {/* Custom coefficient */}
        {material === 'custom' && (
          <div className="flex flex-col sm:flex-row sm:items-center mb-4">
            <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.coefficient || 'Expansion Coefficient (α) ×10⁻⁶'}
            </Label>
            <div className="sm:w-1/2 flex min-w-0">
              <Input
                type="number"
                value={customCoeff}
                onChange={(e) => setCustomCoeff(e.target.value)}
                className="flex-1 min-w-0 rounded-r-none focus-visible:ring-1"
              />
              <select
                aria-label={`${t?.inputs?.coefficient || 'Expansion Coefficient (α)'} unit`}
                value={coeffUnit}
                onChange={(e) => setCoeffUnit(e.target.value)}
                className={unitSelectClass}
              >
                {COEFF_UNITS.map((u) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Initial Length */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
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
            <select
              aria-label={`${t?.inputs?.length || 'Initial Length (L₀)'} unit`}
              value={lengthUnit}
              onChange={(e) => setLengthUnit(e.target.value)}
              className={unitSelectClass}
            >
              {LENGTH_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* T1 */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
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
            <select
              aria-label={`${t?.inputs?.t1 || 'Initial Temp (T₁)'} unit`}
              value={t1Unit}
              onChange={(e) => setT1Unit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
        </div>

        {/* T2 */}
        <div className="flex flex-col sm:flex-row sm:items-center mb-4">
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
            <select
              aria-label={`${t?.inputs?.t2 || 'Final Temp (T₂)'} unit`}
              value={t2Unit}
              onChange={(e) => setT2Unit(e.target.value)}
              className={unitSelectClass}
            >
              {TEMP_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
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
              {changeInLength !== null ? (changeInLength > 0 ? '+' : '') + changeInLength.toFixed(4) : '-'} <span className="text-lg font-normal">{isImperial ? 'in' : 'mm'}</span>
            </span>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center">
            <span className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t?.results?.finalLength || 'Final Length (L₁)'}</span>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {finalLength !== null ? finalLength.toFixed(4) : '-'} <span className="text-sm font-normal">{isImperial ? 'ft' : 'm'}</span>
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
      </div>
    </div>
  );
}
