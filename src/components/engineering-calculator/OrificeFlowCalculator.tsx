import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base
const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};
const PRESSURE_TO_PA: Record<string, number> = {
  Pa: 1,
  kPa: 1000,
  bar: 100000,
  psi: 6894.76,
  MPa: 1e6,
};
const DENSITY_TO_KGM3: Record<string, number> = {
  'kg/m³': 1,
  'lb/ft³': 16.0185,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const PRESSURE_UNITS = ['Pa', 'kPa', 'bar', 'psi', 'MPa'];
const DENSITY_UNITS = ['kg/m³', 'lb/ft³'];

const OrificeFlowCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.orificeFlow;

  const isImperial = unitSystem === 'imperial';

  // default values
  const [pipeDiameter, setPipeDiameter] = useState<number>(isImperial ? 4 : 0.1); // in or m
  const [orificeDiameter, setOrificeDiameter] = useState<number>(isImperial ? 2 : 0.05); // in or m
  const [pressureDrop, setPressureDrop] = useState<number>(isImperial ? 5 : 50000); // psi or Pa
  const [density, setDensity] = useState<number>(isImperial ? 62.4 : 1000); // lb/ft3 or kg/m3
  const [cd, setCd] = useState<number>(0.61);

  // Per-input unit selection
  const [pipeDiameterUnit, setPipeDiameterUnit] = useState(isImperial ? 'in' : 'm');
  const [orificeDiameterUnit, setOrificeDiameterUnit] = useState(isImperial ? 'in' : 'm');
  const [pressureDropUnit, setPressureDropUnit] = useState(isImperial ? 'psi' : 'Pa');
  const [densityUnit, setDensityUnit] = useState(isImperial ? 'lb/ft³' : 'kg/m³');

  const [beta, setBeta] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [flowRate, setFlowRate] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(true);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setPipeDiameter(4);
      setOrificeDiameter(2);
      setPressureDrop(5);
      setDensity(62.4);
      setPipeDiameterUnit('in');
      setOrificeDiameterUnit('in');
      setPressureDropUnit('psi');
      setDensityUnit('lb/ft³');
    } else {
      setPipeDiameter(0.1);
      setOrificeDiameter(0.05);
      setPressureDrop(50000);
      setDensity(1000);
      setPipeDiameterUnit('m');
      setOrificeDiameterUnit('m');
      setPressureDropUnit('Pa');
      setDensityUnit('kg/m³');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (pipeDiameter > 0 && orificeDiameter > 0 && pressureDrop > 0 && density > 0 && cd > 0) {
      // Convert each input to its SI base via the unit maps
      const D = pipeDiameter * (LENGTH_TO_M[pipeDiameterUnit] ?? 1); // m
      const d = orificeDiameter * (LENGTH_TO_M[orificeDiameterUnit] ?? 1); // m
      const dP = pressureDrop * (PRESSURE_TO_PA[pressureDropUnit] ?? 1); // Pa
      const rho = density * (DENSITY_TO_KGM3[densityUnit] ?? 1); // kg/m3

      const calcBeta = d / D;
      const calcArea = (Math.PI * Math.pow(d, 2)) / 4;

      if (calcBeta < 1) {
        const denom = Math.sqrt(1 - Math.pow(calcBeta, 4));
        const velocityOrifice = cd * Math.sqrt((2 * dP) / rho) / denom;
        const q = calcArea * velocityOrifice; // m3/s

        setBeta(calcBeta);

        if (isImperial) {
          setArea(calcArea * 1550.0031); // m2 to in2
          setVelocity(velocityOrifice * 3.28084); // m/s to ft/s
          setFlowRate(q * 15850.323); // m3/s to gpm (US)
        } else {
          setArea(calcArea);
          setVelocity(velocityOrifice);
          setFlowRate(q * 3600); // m3/s to m3/h
        }
      } else {
        setBeta(calcBeta);
        setArea(0);
        setVelocity(0);
        setFlowRate(0);
      }
    } else {
      setBeta(0);
      setArea(0);
      setVelocity(0);
      setFlowRate(0);
    }
    setPlaying(true);
  }, [pipeDiameter, orificeDiameter, pressureDrop, density, cd, pipeDiameterUnit, orificeDiameterUnit, pressureDropUnit, densityUnit, isImperial]);

  const areaUnit = isImperial ? 'in²' : 'm²';
  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const flowUnit = isImperial ? 'US gpm' : 'm³/h';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.pipeDiameter || 'Pipe Diameter (D)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={pipeDiameter} onChange={(e) => setPipeDiameter(Number(e.target.value))} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.pipeDiameter || 'Pipe Diameter (D)'} value={pipeDiameterUnit} onChange={(e) => setPipeDiameterUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.orificeDiameter || 'Orifice Diameter (d)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={orificeDiameter} onChange={(e) => setOrificeDiameter(Number(e.target.value))} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.orificeDiameter || 'Orifice Diameter (d)'} value={orificeDiameterUnit} onChange={(e) => setOrificeDiameterUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.pressureDrop || 'Pressure Drop (ΔP)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={pressureDrop} onChange={(e) => setPressureDrop(Number(e.target.value))} min={0} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={t?.inputs?.pressureDrop || 'Pressure Drop (ΔP)'} value={pressureDropUnit} onChange={(e) => setPressureDropUnit(e.target.value)} className={unitSelectClass}>
                  {PRESSURE_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.density || 'Fluid Density (ρ)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={t?.inputs?.density || 'Fluid Density (ρ)'} value={densityUnit} onChange={(e) => setDensityUnit(e.target.value)} className={unitSelectClass}>
                  {DENSITY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.dischargeCoefficient || 'Discharge Coefficient (Cd)'}</Label>
              <Input type="number" value={cd} onChange={(e) => setCd(Number(e.target.value))} min={0.5} max={1} step={0.01} className="min-w-0" />
              <p className="text-xs text-muted-foreground mt-1">Typical value is ~0.61 for standard orifice plates.</p>
            </div>

            {beta >= 1 && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
                Orifice diameter must be less than pipe diameter (β &lt; 1).
              </div>
            )}

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.betaRatio || 'Beta Ratio (β)'}</span>
                  <div className="text-xl font-bold text-gray-700 dark:text-gray-200">
                    {beta.toFixed(3)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.areaOrifice || 'Orifice Area'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{area.toExponential(2)}</div>
                    <div className="text-xs text-muted-foreground">{areaUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.velocity || 'Orifice Velocity'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{velocity.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{velUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    {t?.results?.flowRate || 'Volumetric Flow Rate (Q)'}
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {flowRate.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">{flowUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t?.visualization?.title || 'Orifice Flow Diagram'}
                </h3>
                {flowRate > 0 && (
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
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  <style>{'@keyframes flow { from { stroke-dashoffset: 40; } to { stroke-dashoffset: 0; } }'}</style>
                  {/* Pipe */}
                  <rect x="20" y="30" width="360" height="90" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" opacity="0.5" />

                  {/* Orifice Plate */}
                  <rect x="195" y="10" width="10" height="130" fill="#475569" />
                  <rect x="195" y="55" width="10" height="40" fill="#e2e8f0" /> {/* Hole */}

                  {/* Flow Lines */}
                  {flowRate > 0 && (
                    <g className="opacity-70">
                      <path d="M 20 50 C 100 50, 150 50, 195 65 C 240 80, 280 50, 380 50" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10,10" style={{ animation: playing ? 'flow 1s linear infinite' : 'none' }} />
                      <path d="M 20 75 L 380 75" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="15,10" style={{ animation: playing ? 'flow 0.8s linear infinite' : 'none' }} />
                      <path d="M 20 100 C 100 100, 150 100, 195 85 C 240 70, 280 100, 380 100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="10,10" style={{ animation: playing ? 'flow 1s linear infinite' : 'none' }} />
                    </g>
                  )}

                  {/* Vena Contracta */}
                  <ellipse cx="230" cy="75" rx="10" ry="15" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                  <text x="230" y="45" fill="#ef4444" fontSize="10" textAnchor="middle">Vena Contracta</text>

                  {/* Labels */}
                  <line x1="20" y1="20" x2="20" y2="130" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4" />
                  <text x="10" y="75" fill="#64748b" fontSize="12" textAnchor="end" transform="rotate(-90 10,75)">D</text>

                  <line x1="185" y1="55" x2="185" y2="95" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <text x="175" y="75" fill="#64748b" fontSize="12" textAnchor="end">d</text>

                  <text x="100" y="25" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">P₁</text>
                  <text x="300" y="25" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">P₂</text>

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrificeFlowCalculator;
