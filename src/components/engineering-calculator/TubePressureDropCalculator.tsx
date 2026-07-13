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
const VELOCITY_TO_MS: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1000 / 3600,
};
const DENSITY_TO_KGM3: Record<string, number> = {
  'kg/m³': 1,
  'lb/ft³': 16.0185,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];
const DENSITY_UNITS = ['kg/m³', 'lb/ft³'];

const TubePressureDropCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.tubePressureDrop;

  const isImperial = unitSystem === 'imperial';

  const [length, setLength] = useState<number>(isImperial ? 20 : 6);
  const [diameter, setDiameter] = useState<number>(isImperial ? 1 : 0.0254);
  const [velocity, setVelocity] = useState<number>(isImperial ? 5 : 1.5);
  const [density, setDensity] = useState<number>(isImperial ? 62.4 : 1000);
  const [frictionFactor, setFrictionFactor] = useState<number>(0.02);

  // Per-input unit selection
  const [lengthUnit, setLengthUnit] = useState(isImperial ? 'ft' : 'm');
  const [diameterUnit, setDiameterUnit] = useState(isImperial ? 'in' : 'm');
  const [velocityUnit, setVelocityUnit] = useState(isImperial ? 'ft/s' : 'm/s');
  const [densityUnit, setDensityUnit] = useState(isImperial ? 'lb/ft³' : 'kg/m³');

  const [pressureDrop, setPressureDrop] = useState<number>(0);
  const [headLoss, setHeadLoss] = useState<number>(0);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setLength(20);
      setDiameter(1);
      setVelocity(5);
      setDensity(62.4);
      setLengthUnit('ft');
      setDiameterUnit('in');
      setVelocityUnit('ft/s');
      setDensityUnit('lb/ft³');
    } else {
      setLength(6);
      setDiameter(0.0254);
      setVelocity(1.5);
      setDensity(1000);
      setLengthUnit('m');
      setDiameterUnit('m');
      setVelocityUnit('m/s');
      setDensityUnit('kg/m³');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (length > 0 && diameter > 0 && velocity > 0 && density > 0 && frictionFactor > 0) {
      const g = 9.81; // m/s2

      // Convert each input to its SI base via the unit maps
      const L_m = length * (LENGTH_TO_M[lengthUnit] ?? 1);
      const D_m = diameter * (LENGTH_TO_M[diameterUnit] ?? 1);
      const V_ms = velocity * (VELOCITY_TO_MS[velocityUnit] ?? 1);
      const rho = density * (DENSITY_TO_KGM3[densityUnit] ?? 1);

      // Darcy-Weisbach in SI base
      const hf_m = frictionFactor * (L_m / D_m) * (Math.pow(V_ms, 2) / (2 * g)); // m
      const dp_pa = rho * g * hf_m; // Pa

      setHeadLoss(isImperial ? hf_m * 3.28084 : hf_m);
      setPressureDrop(isImperial ? dp_pa / 6894.76 : dp_pa);
    } else {
      setPressureDrop(0);
      setHeadLoss(0);
    }
  }, [length, diameter, velocity, density, frictionFactor, lengthUnit, diameterUnit, velocityUnit, densityUnit, isImperial]);

  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const pressureUnit = isImperial ? 'psi' : 'Pa';
  const headUnit = isImperial ? 'ft' : 'm';

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
                <Label>{t?.inputs?.length || 'Tube Length (L)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.length || 'Tube Length (L)'} value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.diameter || 'Inside Diameter (D)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.diameter || 'Inside Diameter (D)'} value={diameterUnit} onChange={(e) => setDiameterUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.velocity || 'Fluid Velocity (v)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} min={0.01} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={t?.inputs?.velocity || 'Fluid Velocity (v)'} value={velocityUnit} onChange={(e) => setVelocityUnit(e.target.value)} className={unitSelectClass}>
                  {VELOCITY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
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
              <Label>{t?.inputs?.frictionFactor || 'Friction Factor (f)'}</Label>
              <Input type="number" value={frictionFactor} onChange={(e) => setFrictionFactor(Number(e.target.value))} min={0.001} step={0.001} className="min-w-0" />
              <p className="text-xs text-muted-foreground mt-1">Darcy friction factor. Typical turbulent flow ~0.02</p>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 shadow-sm flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
                  <span className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    {t?.results?.pressureDrop || 'Pressure Drop (ΔP)'}
                  </span>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {pressureDrop.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">{pressureUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.headLoss || 'Head Loss (h_f)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{headLoss.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{headUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Pressure Drop Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Pipe */}
                  <rect x="20" y="70" width="260" height="40" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" opacity="0.5" />

                  {/* Flow indication */}
                  <path d="M 40 90 L 100 90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" strokeDasharray="4" />
                  <path d="M 120 90 L 180 90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" strokeDasharray="4" />
                  <path d="M 200 90 L 260 90" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" strokeDasharray="4" />

                  {/* Pressure gradient line */}
                  <line x1="20" y1="20" x2="280" y2="50" stroke="#ef4444" strokeWidth="3" />

                  <line x1="20" y1="20" x2="20" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <text x="20" y="15" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">P₁</text>

                  <line x1="280" y1="50" x2="280" y2="70" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <text x="280" y="45" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">P₂</text>

                  {/* Length */}
                  <line x1="20" y1="125" x2="280" y2="125" stroke="#64748b" strokeWidth="1" />
                  <line x1="20" y1="120" x2="20" y2="130" stroke="#64748b" strokeWidth="1" />
                  <line x1="280" y1="120" x2="280" y2="130" stroke="#64748b" strokeWidth="1" />
                  <text x="150" y="140" fill="#64748b" fontSize="12" textAnchor="middle">Length (L)</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TubePressureDropCalculator;
