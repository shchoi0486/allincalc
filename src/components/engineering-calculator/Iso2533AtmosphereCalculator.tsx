import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base (m)
const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

const ALTITUDE_UNITS = ['m', 'cm', 'mm', 'in', 'ft'];

const Iso2533AtmosphereCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.iso2533Atmosphere;
  const isImperial = unitSystem === 'imperial';

  const [altitude, setAltitude] = useState<number>(0); // in selected unit
  const [altitudeUnit, setAltitudeUnit] = useState('m');

  const [temperature, setTemperature] = useState<number>(0); // °C (SI)
  const [pressure, setPressure] = useState<number>(0); // Pa (SI)
  const [density, setDensity] = useState<number>(0); // kg/m3 (SI)
  const [speedOfSound, setSpeedOfSound] = useState<number>(0); // m/s (SI)

  useEffect(() => {
    if (isImperial) {
      setAltitude(0);
      setAltitudeUnit('ft');
    } else {
      setAltitude(0);
      setAltitudeUnit('m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    // ISO 2533 Constants (Troposphere: 0 to 11,000m)
    const T0 = 288.15; // K
    const P0 = 101325; // Pa
    const L = 0.0065; // K/m
    const R = 8.31432; // J/(mol*K)
    const M = 0.0289644; // kg/mol
    const g = 9.80665; // m/s2
    const gamma = 1.4;

    const h_m = altitude * (LENGTH_TO_M[altitudeUnit] ?? 1);

    // T = T0 - L * h
    const T_K = T0 - L * h_m;

    // P = P0 * (1 - L*h/T0)^(g*M / (R*L))
    const exponent = (g * M) / (R * L);
    const P_Pa = P0 * Math.pow(1 - (L * h_m) / T0, exponent);

    // rho = (P * M) / (R * T)
    const rho_kgm3 = (P_Pa * M) / (R * T_K);

    // a = sqrt(gamma * R_specific * T) => R_specific = R/M = 287.05
    const a_ms = Math.sqrt(gamma * (R / M) * T_K);

    setTemperature(T_K - 273.15); // K to °C (SI display)
    setPressure(P_Pa); // Pa
    setDensity(rho_kgm3); // kg/m3
    setSpeedOfSound(a_ms); // m/s

  }, [altitude, altitudeUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  const tempUnit = isImperial ? '°F' : '°C';
  const pressUnit = isImperial ? 'psi' : 'Pa';
  const denUnit = isImperial ? 'lb/ft³' : 'kg/m³';
  const speedUnit = isImperial ? 'ft/s' : 'm/s';

  const displayTemp = isImperial ? temperature * 9 / 5 + 32 : temperature;
  const displayPressure = isImperial ? pressure * 0.000145038 : pressure;
  const displayDensity = isImperial ? density * 0.062428 : density;
  const displaySpeed = isImperial ? speedOfSound * 3.28084 : speedOfSound;

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
              <Label>{t?.inputs?.altitude || 'Altitude (h)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Altitude unit"
                  value={altitudeUnit}
                  onChange={(e) => setAltitudeUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {ALTITUDE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Calculations based on Troposphere model (-2km to 11km)</p>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.temperature || 'Temperature'}</span>
                  <div className="text-lg font-bold text-red-500">
                    {displayTemp.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{tempUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.pressure || 'Pressure'}</span>
                  <div className="text-lg font-bold text-blue-600">
                    {isImperial ? displayPressure.toFixed(3) : displayPressure.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">{pressUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.density || 'Air Density'}</span>
                  <div className="text-lg font-bold text-green-600">
                    {displayDensity.toFixed(4)} <span className="text-xs font-normal text-muted-foreground">{denUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.speedOfSound || 'Speed of Sound'}</span>
                  <div className="text-lg font-bold text-purple-600">
                    {displaySpeed.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{speedUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Atmospheric Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Ground */}
                  <rect x="0" y="180" width="200" height="20" fill="#22c55e" opacity="0.5" />

                  {/* Sky gradient background */}
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="200" height="180" fill="url(#sky)" opacity="0.3" />

                  {/* Altitude indicator line */}
                  {(() => {
                    const maxAlt = isImperial ? 36000 : 11000;
                    const altRatio = Math.max(0, Math.min(1, altitude / maxAlt));
                    const yPos = 180 - (altRatio * 160);

                    return (
                      <g>
                        <line x1="20" y1={yPos} x2="180" y2={yPos} stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                        <polygon points={`20,${yPos} 30,${yPos - 5} 30,${yPos + 5}`} fill="#ef4444" />
                        <text x="35" y={yPos - 5} fill="#ef4444" fontSize="12" fontWeight="bold">{altitude} {altitudeUnit}</text>
                      </g>
                    );
                  })()}

                  {/* Clouds for scale */}
                  <path d="M 140 100 Q 150 90, 160 100 Q 170 95, 175 105 Q 185 110, 175 115 L 140 115 Q 130 110, 140 100 Z" fill="#ffffff" opacity="0.8" />
                  <path d="M 60 60 Q 70 50, 80 60 Q 90 55, 95 65 Q 105 70, 95 75 L 60 75 Q 50 70, 60 60 Z" fill="#ffffff" opacity="0.6" />

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Iso2533AtmosphereCalculator;
