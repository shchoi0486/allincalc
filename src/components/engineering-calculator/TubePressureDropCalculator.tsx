import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const TubePressureDropCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.tubePressureDrop;

  const isImperial = unitSystem === 'imperial';

  const [length, setLength] = useState<number>(isImperial ? 20 : 6); // ft or m
  const [diameter, setDiameter] = useState<number>(isImperial ? 1 : 0.0254); // in or m
  const [velocity, setVelocity] = useState<number>(isImperial ? 5 : 1.5); // ft/s or m/s
  const [density, setDensity] = useState<number>(isImperial ? 62.4 : 1000); // lb/ft3 or kg/m3
  const [frictionFactor, setFrictionFactor] = useState<number>(0.02); // Darcy friction factor

  const [pressureDrop, setPressureDrop] = useState<number>(0);
  const [headLoss, setHeadLoss] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (length > 0 && diameter > 0 && velocity > 0 && density > 0 && frictionFactor > 0) {
      let L = length;
      let D = diameter;
      let V = velocity;
      let rho = density;
      const g = 9.81; // m/s2
      const gc = 32.174; // ft/s2

      if (isImperial) {
        D = diameter / 12; // in to ft
        // Darcy equation: hf = f * (L/D) * (V^2 / (2*g))
        const hf = frictionFactor * (L / D) * (Math.pow(V, 2) / (2 * gc));
        setHeadLoss(hf); // ft

        // dP = rho * hf * (g/gc) -> for US customary, density in lb/ft3 and head in ft gives pressure in psf
        const dp_psf = rho * hf;
        const dp_psi = dp_psf / 144;
        setPressureDrop(dp_psi);
      } else {
        // SI
        const hf = frictionFactor * (L / D) * (Math.pow(V, 2) / (2 * g));
        setHeadLoss(hf); // m

        // dP = rho * g * hf (Pa)
        const dp_pa = rho * g * hf;
        setPressureDrop(dp_pa);
      }
    } else {
      setPressureDrop(0);
      setHeadLoss(0);
    }
  }, [length, diameter, velocity, density, frictionFactor, isImperial]);

  const lengthUnit = isImperial ? 'ft' : 'm';
  const diaUnit = isImperial ? 'in' : 'm';
  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const densityUnit = isImperial ? 'lb/ft³' : 'kg/m³';
  const pressureUnit = isImperial ? 'psi' : 'Pa';
  const headUnit = isImperial ? 'ft' : 'm';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.length || 'Tube Length (L)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0.1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lengthUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.diameter || 'Inside Diameter (D)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} min={0.001} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{diaUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.velocity || 'Fluid Velocity (v)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={velocity} onChange={(e) => setVelocity(Number(e.target.value))} min={0.01} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{velUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.density || 'Fluid Density (ρ)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{densityUnit}</span>
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
