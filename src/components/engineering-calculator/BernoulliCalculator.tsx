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
const PRESSURE_TO_PA: Record<string, number> = {
  Pa: 1,
  kPa: 1000,
  MPa: 1e6,
  psi: 6894.76,
  bar: 1e5,
  atm: 101325,
};
const VELOCITY_TO_MS: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1 / 3.6,
};
const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

const DENSITY_UNITS = ['kg/m³', 'lb/ft³', 'g/cm³'];
const PRESSURE_UNITS = ['Pa', 'kPa', 'MPa', 'psi', 'bar', 'atm'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];
const HEIGHT_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const BernoulliCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.bernoulli;
  const isImperial = unitSystem === 'imperial';

  const [density, setDensity] = useState<number>(1000); // kg/m3
  const [p1, setP1] = useState<number>(101325); // Pa
  const [v1, setV1] = useState<number>(2); // m/s
  const [h1, setH1] = useState<number>(5); // m

  const [p2, setP2] = useState<number>(101325); // Pa
  const [h2, setH2] = useState<number>(0); // m

  const [densityUnit, setDensityUnit] = useState('kg/m³');
  const [pressureUnit, setPressureUnit] = useState('Pa');
  const [velocityUnit, setVelocityUnit] = useState('m/s');
  const [heightUnit, setHeightUnit] = useState('m');

  const [v2, setV2] = useState<number>(0); // display unit
  const [calculated, setCalculated] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (isImperial) {
      setDensity(62.4);
      setP1(14.7);
      setV1(6.56);
      setH1(16.4);
      setP2(14.7);
      setH2(0);
      setDensityUnit('lb/ft³');
      setPressureUnit('psi');
      setVelocityUnit('ft/s');
      setHeightUnit('ft');
    } else {
      setDensity(1000);
      setP1(101325);
      setV1(2);
      setH1(5);
      setP2(101325);
      setH2(0);
      setDensityUnit('kg/m³');
      setPressureUnit('Pa');
      setVelocityUnit('m/s');
      setHeightUnit('m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    // Convert to SI base
    const rho = density * (DENSITY_TO_KGM3[densityUnit] ?? 1);
    const P1 = p1 * (PRESSURE_TO_PA[pressureUnit] ?? 1);
    const v1SI = v1 * (VELOCITY_TO_MS[velocityUnit] ?? 1);
    const h1SI = h1 * (LENGTH_TO_M[heightUnit] ?? 1);
    const P2 = p2 * (PRESSURE_TO_PA[pressureUnit] ?? 1);
    const h2SI = h2 * (LENGTH_TO_M[heightUnit] ?? 1);

    // P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
    // v2 = sqrt( (2/rho) * [ (P1 - P2) + 0.5*rho*v1^2 + rho*g*(h1 - h2) ] )
    const g = 9.80665;

    if (rho > 0) {
      const term1 = P1 - P2;
      const term2 = 0.5 * rho * Math.pow(v1SI, 2);
      const term3 = rho * g * (h1SI - h2SI);

      const v2Squared = (2 / rho) * (term1 + term2 + term3);

      if (v2Squared >= 0) {
        setV2(Math.sqrt(v2Squared) / (VELOCITY_TO_MS[velocityUnit] ?? 1));
      } else {
        setV2(0); // Physically impossible or imaginary velocity (flow would be in opposite direction or need more pressure)
      }
    }
    setCalculated(true);
    setPlaying(true);
  }, [density, p1, v1, h1, p2, h2, densityUnit, pressureUnit, velocityUnit, heightUnit]);

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
                <Input
                  type="number"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  min={0.1}
                  className="min-w-0 flex-1 rounded-r-none"
                />
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

            <div className="pt-4 pb-2 border-t">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">Point 1</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.p1 || 'Pressure (P₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={p1} onChange={(e) => setP1(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Pressure P1 unit"
                    value={pressureUnit}
                    onChange={(e) => setPressureUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {PRESSURE_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.v1 || 'Velocity (v₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={v1} onChange={(e) => setV1(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Velocity v1 unit"
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
              <div className="space-y-2 col-span-2">
                <Label>{t?.inputs?.h1 || 'Elevation (h₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={h1} onChange={(e) => setH1(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Elevation h1 unit"
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {HEIGHT_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t">
              <h4 className="font-medium text-green-600 dark:text-green-400">Point 2</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.p2 || 'Pressure (P₂)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={p2} onChange={(e) => setP2(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Pressure P2 unit"
                    value={pressureUnit}
                    onChange={(e) => setPressureUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {PRESSURE_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.h2 || 'Elevation (h₂)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={h2} onChange={(e) => setH2(Number(e.target.value))} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label="Elevation h2 unit"
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {HEIGHT_UNITS.map((u) => (
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

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {t?.results?.v2 || 'Velocity at Point 2 (v₂)'}
                </span>
                <span className="text-3xl font-bold text-primary">
                  {v2.toFixed(2)} <span className="text-lg font-normal text-muted-foreground ml-1">{velocityUnit}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t?.visualization?.title || 'Bernoulli Flow'}
                </h3>
                {calculated && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? 'Pause animation' : 'Play animation'}
                    className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {playing ? '⏸ ' + (locale === 'ko' ? '일시정지' : 'Pause') : '▶ ' + (locale === 'ko' ? '재생' : 'Play')}
                  </button>
                )}
              </div>
              <div className="relative h-48 w-full flex flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <style>{'@keyframes flow { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }'}</style>
                  {/* Pipe */}
                  <path d="M 20 50 Q 150 50, 200 120 T 380 120" fill="none" stroke="#3b82f6" strokeWidth="20" opacity="0.3" />

                  {/* Flow line 1 */}
                  <path d="M 20 50 Q 150 50, 200 120 T 380 120" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10" style={{ animation: calculated && playing ? 'flow 1s linear infinite' : 'none' }} />

                  {/* Point 1 */}
                  <circle cx="50" cy="50" r="6" fill="#2563eb" />
                  <text x="50" y="30" fontSize="12" fill="#2563eb" textAnchor="middle">Point 1</text>
                  <text x="50" y="80" fontSize="10" fill="#64748b" textAnchor="middle">v₁: {v1}{velocityUnit}</text>

                  {/* Point 2 */}
                  <circle cx="350" cy="120" r="6" fill="#16a34a" />
                  <text x="350" y="100" fontSize="12" fill="#16a34a" textAnchor="middle">Point 2</text>
                  <text x="350" y="150" fontSize="10" fill="#64748b" textAnchor="middle">v₂: {v2.toFixed(1)}{velocityUnit}</text>

                  {/* Elevation line */}
                  <line x1="20" y1="180" x2="380" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5,5" />
                  <text x="200" y="195" fontSize="10" fill="#94a3b8" textAnchor="middle">Reference Elevation (h=0)</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BernoulliCalculator;
