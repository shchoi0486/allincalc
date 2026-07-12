import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const WaterHammerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.waterHammer;

  const [density, setDensity] = useState<number>(1000); // kg/m³ or lb/ft³
  const [waveSpeed, setWaveSpeed] = useState<number>(1200); // m/s or ft/s
  const [initialVelocity, setInitialVelocity] = useState<number>(2); // m/s or ft/s
  const [finalVelocity, setFinalVelocity] = useState<number>(0); // m/s or ft/s

  const [pressureSurge, setPressureSurge] = useState<number>(0);

  const isImperial = unitSystem === 'imperial';

  const handleCalculate = useCallback(() => {
    if (density > 0 && waveSpeed > 0) {
      // Joukowsky Equation: deltaP = rho * a * deltaV
      const deltaV = Math.abs(initialVelocity - finalVelocity);
      
      if (isImperial) {
        // Imperial: deltaP (psf) = (rho (lb/ft3) / g_c (32.174 lb·ft/lbf·s2)) * a (ft/s) * deltaV (ft/s)
        // Convert to psi: divide by 144
        const surgePsf = (density / 32.174) * waveSpeed * deltaV;
        setPressureSurge(surgePsf / 144);
      } else {
        // SI: deltaP (Pa) = rho (kg/m3) * a (m/s) * deltaV (m/s)
        // Convert to bar or kPa for better readability, let's keep it in Pa and display dynamically
        const surgePa = density * waveSpeed * deltaV;
        setPressureSurge(surgePa);
      }
    } else {
      setPressureSurge(0);
    }
  }, [density, waveSpeed, initialVelocity, finalVelocity, isImperial]);

  const densityUnit = isImperial ? 'lb/ft³' : 'kg/m³';
  const velocityUnit = isImperial ? 'ft/s' : 'm/s';
  
  // Format pressure output
  let displayPressure = '';
  let pressureUnit = '';
  
  if (isImperial) {
    displayPressure = pressureSurge.toFixed(1);
    pressureUnit = 'psi';
  } else {
    // SI output formatting (Pa -> kPa -> bar or MPa)
    if (pressureSurge > 1000000) {
      displayPressure = (pressureSurge / 1000000).toFixed(2);
      pressureUnit = 'MPa';
    } else if (pressureSurge > 1000) {
      displayPressure = (pressureSurge / 1000).toFixed(1);
      pressureUnit = 'kPa';
    } else {
      displayPressure = pressureSurge.toFixed(0);
      pressureUnit = 'Pa';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.density || 'Fluid Density (ρ)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={density} onChange={(e) => setDensity(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">{densityUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.waveSpeed || 'Wave Speed / Celerity (a)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={waveSpeed} onChange={(e) => setWaveSpeed(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{velocityUnit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Typical for water in steel pipe: ~1200 m/s or ~4000 ft/s</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.initialVelocity || 'Initial Velocity (v₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={initialVelocity} onChange={(e) => setInitialVelocity(Number(e.target.value))} className="min-w-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.finalVelocity || 'Final Velocity (v₂)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={finalVelocity} onChange={(e) => setFinalVelocity(Number(e.target.value))} className="min-w-0 border-red-400" />
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
                  <span className="text-4xl font-bold text-red-500">{displayPressure}</span>
                  <span className="text-xl font-normal text-muted-foreground ml-2">{pressureUnit}</span>
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
