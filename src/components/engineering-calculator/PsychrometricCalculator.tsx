'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const PsychrometricCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.psychrometric;
  const isImperial = unitSystem === 'imperial';

  const [dryBulb, setDryBulb] = useState('25'); // Celsius
  const [dryBulbUnit, setDryBulbUnit] = useState('°C');
  const [relativeHumidity, setRelativeHumidity] = useState('50'); // %

  const [dewPoint, setDewPoint] = useState(0);
  const [humidityRatio, setHumidityRatio] = useState(0);
  const [enthalpy, setEnthalpy] = useState(0);

  // Convert a temperature value from its unit to °C base
  const toC = (v: number, unit: string): number => {
    if (unit === '°F') return (v - 32) * 5 / 9;
    if (unit === 'K') return v - 273.15;
    return v; // °C
  };

  const TEMP_UNITS = ['°C', '°F', 'K'];

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setDryBulb('77');
      setDryBulbUnit('°F');
    } else {
      setDryBulb('25');
      setDryBulbUnit('°C');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    // Basic Psychrometric calculation at standard pressure (101.325 kPa)
    // Using Magnus-Tetens approximation for vapor pressure

    // Convert to Celsius for internal calculation
    const t_c = toC(parseFloat(dryBulb), dryBulbUnit);
    const rh = parseFloat(relativeHumidity);
    const p_atm = 101.325; // kPa

    if (t_c >= -50 && t_c <= 100 && rh >= 0 && rh <= 100) {
      // Saturation Vapor Pressure (kPa)
      const p_ws = 0.61078 * Math.exp((17.27 * t_c) / (t_c + 237.3));

      // Actual Vapor Pressure (kPa)
      const p_w = p_ws * (rh / 100);

      // Dew Point
      const alpha = Math.log(p_w / 0.61078);
      const dp_c = (237.3 * alpha) / (17.27 - alpha);

      // Humidity Ratio (kg/kg dry air)
      const w_kg = 0.621945 * (p_w / (p_atm - p_w));

      // Enthalpy (kJ/kg dry air)
      // h = 1.006 * T + W * (2501 + 1.86 * T)
      const h_kj = 1.006 * t_c + w_kg * (2501 + 1.86 * t_c);

      // Convert outputs
      if (isImperial) {
        setDewPoint((dp_c * 9 / 5) + 32);
        setHumidityRatio(w_kg * 7000); // grains/lb
        setEnthalpy(h_kj * 0.429923); // Btu/lb
      } else {
        setDewPoint(dp_c);
        setHumidityRatio(w_kg * 1000); // g/kg
        setEnthalpy(h_kj);
      }
    }
  }, [dryBulb, dryBulbUnit, relativeHumidity, isImperial]);

  const tempUnit = isImperial ? '°F' : '°C';
  const hrUnit = isImperial ? 'grains/lb' : 'g/kg';
  const enthalpyUnit = isImperial ? 'Btu/lb' : 'kJ/kg';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.dryBulb || 'Dry Bulb Temp (T_db)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={dryBulb} onChange={(e) => setDryBulb(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.dryBulb || 'Dry Bulb Temp (T_db)'} unit`}
                  value={dryBulbUnit}
                  onChange={(e) => setDryBulbUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TEMP_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.relativeHumidity || 'Relative Humidity (RH)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={relativeHumidity} onChange={(e) => setRelativeHumidity(e.target.value)} min={0} max={100} className="min-w-0 flex-1 rounded-r-none" />
                <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center justify-center">
                  %
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
              <p className="text-xs text-blue-800 dark:text-blue-300">
                Calculations are based on Standard Atmospheric Pressure (101.325 kPa / 14.696 psi) at sea level.
              </p>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.dewPoint || 'Dew Point (T_dp)'}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-blue-600">{dewPoint.toFixed(2)}</span>
                    <span className="text-xs font-normal text-muted-foreground ml-1">{tempUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.humidityRatio || 'Absolute Humidity (W)'}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-green-600">{humidityRatio.toFixed(2)}</span>
                    <span className="text-xs font-normal text-muted-foreground ml-1">{hrUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.enthalpy || 'Specific Enthalpy (h)'}
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-bold text-red-500">{enthalpy.toFixed(2)}</span>
                    <span className="text-xs font-normal text-muted-foreground ml-1">{enthalpyUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Air State Overview'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Thermometer for Dry Bulb */}
                  <rect x="80" y="40" width="20" height="100" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="90" cy="140" r="16" fill="#ef4444" />
                  <rect x="85" y={140 - Math.min(100, Math.max(10, parseFloat(dryBulb) || 0))} width="10" height={Math.min(100, Math.max(10, parseFloat(dryBulb) || 0))} fill="#ef4444" />
                  <text x="90" y="175" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">T_db</text>
                  <text x="90" y="25" fill="#ef4444" fontSize="12" textAnchor="middle">{dryBulb}°</text>

                  {/* Thermometer for Dew Point */}
                  <rect x="180" y="40" width="20" height="100" rx="10" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="2" />
                  <circle cx="190" cy="140" r="16" fill="#3b82f6" />
                  <rect x="185" y={140 - Math.min(100, Math.max(10, dewPoint))} width="10" height={Math.min(100, Math.max(10, dewPoint))} fill="#3b82f6" />
                  <text x="190" y="175" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">T_dp</text>
                  <text x="190" y="25" fill="#3b82f6" fontSize="12" textAnchor="middle">{dewPoint.toFixed(1)}°</text>

                  {/* Relative Humidity Drop */}
                  <path d="M 290 60 C 290 60, 310 90, 310 110 C 310 130, 290 140, 290 140 C 290 140, 270 130, 270 110 C 270 90, 290 60, 290 60 Z" fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
                  <text x="290" y="120" fill="#1e3a8a" fontSize="14" textAnchor="middle" fontWeight="bold">{relativeHumidity}%</text>
                  <text x="290" y="175" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">RH</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PsychrometricCalculator;
