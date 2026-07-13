import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base
const DENSITY_TO_KGM3: Record<string, number> = {
  'kg/m³': 1,
  'lb/ft³': 16.0185,
  'g/cm³': 1000,
};
const VELOCITY_TO_MS: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1 / 3.6,
};
const PRESSURE_TO_PA: Record<string, number> = {
  Pa: 1,
  kPa: 1000,
  MPa: 1e6,
  psi: 6894.76,
  bar: 1e5,
  atm: 101325,
};

const DENSITY_UNITS = ['kg/m³', 'lb/ft³', 'g/cm³'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];
const PRESSURE_UNITS = ['Pa', 'kPa', 'MPa', 'psi', 'bar', 'atm'];

const WaterHammerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.waterHammer;
  const isImperial = unitSystem === 'imperial';

  const [density, setDensity] = useState<number>(1000); // kg/m³
  const [waveSpeed, setWaveSpeed] = useState<number>(1200); // m/s
  const [initialVelocity, setInitialVelocity] = useState<number>(2); // m/s
  const [finalVelocity, setFinalVelocity] = useState<number>(0); // m/s

  const [densityUnit, setDensityUnit] = useState('kg/m³');
  const [velocityUnit, setVelocityUnit] = useState('m/s');
  const [pressureUnit, setPressureUnit] = useState('kPa');

  const [pressureSurge, setPressureSurge] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setDensity(62.4);
      setWaveSpeed(3937);
      setInitialVelocity(6.56);
      setFinalVelocity(0);
      setDensityUnit('lb/ft³');
      setVelocityUnit('ft/s');
      setPressureUnit('psi');
    } else {
      setDensity(1000);
      setWaveSpeed(1200);
      setInitialVelocity(2);
      setFinalVelocity(0);
      setDensityUnit('kg/m³');
      setVelocityUnit('m/s');
      setPressureUnit('kPa');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    // Convert to SI base
    const rho = density * (DENSITY_TO_KGM3[densityUnit] ?? 1);
    const a = waveSpeed * (VELOCITY_TO_MS[velocityUnit] ?? 1);
    const deltaV = Math.abs(initialVelocity - finalVelocity) * (VELOCITY_TO_MS[velocityUnit] ?? 1);

    if (rho > 0 && a > 0) {
      // Joukowsky Equation: deltaP (Pa) = rho (kg/m3) * a (m/s) * deltaV (m/s)
      const surgePa = rho * a * deltaV;
      setPressureSurge(surgePa / (PRESSURE_TO_PA[pressureUnit] ?? 1));
    } else {
      setPressureSurge(0);
    }
  }, [density, waveSpeed, initialVelocity, finalVelocity, densityUnit, velocityUnit, pressureUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 gap-3 flex-wrap border-b pb-2">
              <h3 className="font-semibold text-lg shrink-0">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.density || 'Fluid Density (ρ)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Fluid Density unit"
                  value={densityUnit}
                  onChange={(e) => setDensityUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {DENSITY_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.waveSpeed || 'Wave Speed / Celerity (a)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={waveSpeed} onChange={(e) => setWaveSpeed(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Wave Speed unit"
                  value={velocityUnit}
                  onChange={(e) => setVelocityUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {VELOCITY_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Typical for water in steel pipe: ~1200 m/s or ~4000 ft/s</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.initialVelocity || 'Initial Velocity (v₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={initialVelocity} onChange={(e) => setInitialVelocity(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Initial Velocity unit"
                    value={velocityUnit}
                    onChange={(e) => setVelocityUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {VELOCITY_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.finalVelocity || 'Final Velocity (v₂)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={finalVelocity} onChange={(e) => setFinalVelocity(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none border-red-400" />
                  <select
                    aria-label="Final Velocity unit"
                    value={velocityUnit}
                    onChange={(e) => setVelocityUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {VELOCITY_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {t?.results?.pressureSurge || 'Pressure Surge (ΔP)'}
                </span>
                <div className="text-center">
                  <span className="text-4xl font-bold text-red-500">{pressureSurge.toFixed(2)}</span>
                  <span className="text-xl font-normal text-muted-foreground ml-2">
                    <select
                      aria-label="Pressure Surge unit"
                      value={pressureUnit}
                      onChange={(e) => setPressureUnit(e.target.value)}
                      className="inline-block bg-transparent border border-gray-300 dark:border-gray-600 rounded px-1 py-0.5 text-lg font-normal focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {PRESSURE_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </span>
                </div>
                <p className="text-xs text-red-400 mt-2 font-medium">
                  This is the ADDED pressure on top of the static pressure.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Valve Closure Shockwave'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Pipe */}
                  <path d="M 20 80 L 320 80" stroke="#64748b" strokeWidth="4" />
                  <path d="M 20 120 L 320 120" stroke="#64748b" strokeWidth="4" />

                  {/* Water Flow Arrow */}
                  <path d="M 50 100 L 150 100" stroke="#3b82f6" strokeWidth="4" strokeDasharray="5,5" opacity="0.5" />
                  <polygon points="145,95 155,100 145,105" fill="#3b82f6" opacity="0.5" />
                  <text x="100" y="90" fill="#3b82f6" fontSize="12" textAnchor="middle">v₁ → v₂</text>

                  {/* Valve (Closed) */}
                  <rect x="320" y="60" width="10" height="80" fill="#ef4444" />
                  <path d="M 325 60 L 325 40" stroke="#ef4444" strokeWidth="4" />
                  <circle cx="325" cy="40" r="10" fill="#ef4444" />
                  <text x="325" y="25" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Valve</text>

                  {/* Shockwave representation */}
                  <path d="M 280 85 Q 260 100, 280 115" fill="none" stroke="#ef4444" strokeWidth="3" />
                  <path d="M 260 85 Q 240 100, 260 115" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.7" />
                  <path d="M 240 85 Q 220 100, 240 115" fill="none" stroke="#ef4444" strokeWidth="3" opacity="0.4" />

                  {/* Shockwave direction */}
                  <path d="M 280 140 L 220 140" stroke="#ef4444" strokeWidth="2" />
                  <polygon points="225,135 215,140 225,145" fill="#ef4444" />
                  <text x="250" y="155" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Wave (a)</text>

                  {/* Pressure Surge Area */}
                  <rect x="220" y="82" width="100" height="36" fill="#ef4444" opacity="0.2" />
                  <text x="270" y="105" fill="#ef4444" fontSize="14" textAnchor="middle" fontWeight="bold">+ ΔP</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WaterHammerCalculator;
