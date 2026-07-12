import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const BernoulliCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.bernoulli;

  const [density, setDensity] = useState<number>(1000); // kg/m3
  const [p1, setP1] = useState<number>(101325); // Pa
  const [v1, setV1] = useState<number>(2); // m/s
  const [h1, setH1] = useState<number>(5); // m
  
  const [p2, setP2] = useState<number>(101325); // Pa
  const [h2, setH2] = useState<number>(0); // m

  const [v2, setV2] = useState<number>(0); // m/s

  const handleCalculate = useCallback(() => {
    // P1 + 0.5*rho*v1^2 + rho*g*h1 = P2 + 0.5*rho*v2^2 + rho*g*h2
    // 0.5*rho*v2^2 = (P1 - P2) + 0.5*rho*v1^2 + rho*g*(h1 - h2)
    // v2 = sqrt( (2/rho) * [ (P1 - P2) + 0.5*rho*v1^2 + rho*g*(h1 - h2) ] )

    const g = unitSystem === 'imperial' ? 32.174 : 9.80665;
    
    if (density > 0) {
      const term1 = p1 - p2;
      const term2 = 0.5 * density * Math.pow(v1, 2);
      const term3 = density * g * (h1 - h2);
      
      const v2Squared = (2 / density) * (term1 + term2 + term3);
      
      if (v2Squared >= 0) {
        setV2(Math.sqrt(v2Squared));
      } else {
        setV2(0); // Physically impossible or imaginary velocity (flow would be in opposite direction or need more pressure)
      }
    }
  }, [density, p1, v1, h1, p2, h2, unitSystem]);

  const densityUnit = unitSystem === 'imperial' ? 'lb/ft³' : 'kg/m³';
  const pressureUnit = unitSystem === 'imperial' ? 'psf' : 'Pa';
  const velocityUnit = unitSystem === 'imperial' ? 'ft/s' : 'm/s';
  const heightUnit = unitSystem === 'imperial' ? 'ft' : 'm';

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
                <Input
                  type="number"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  min={0.1}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">
                  {densityUnit}
                </span>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t">
              <h4 className="font-medium text-blue-600 dark:text-blue-400">Point 1</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.p1 || 'Pressure (P₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={p1} onChange={(e) => setP1(Number(e.target.value))} className="min-w-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.v1 || 'Velocity (v₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={v1} onChange={(e) => setV1(Number(e.target.value))} className="min-w-0" />
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label>{t?.inputs?.h1 || 'Elevation (h₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={h1} onChange={(e) => setH1(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{heightUnit}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 pb-2 border-t">
              <h4 className="font-medium text-green-600 dark:text-green-400">Point 2</h4>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.p2 || 'Pressure (P₂)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={p2} onChange={(e) => setP2(Number(e.target.value))} className="min-w-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.h2 || 'Elevation (h₂)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={h2} onChange={(e) => setH2(Number(e.target.value))} className="min-w-0" />
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
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Bernoulli Flow'}
              </h3>
              <div className="relative h-48 w-full flex flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Pipe */}
                  <path d="M 20 50 Q 150 50, 200 120 T 380 120" fill="none" stroke="#3b82f6" strokeWidth="20" opacity="0.3" />
                  
                  {/* Flow line 1 */}
                  <path d="M 20 50 Q 150 50, 200 120 T 380 120" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="10,10">
                    <animate attributeName="stroke-dashoffset" from="40" to="0" dur="1s" repeatCount="indefinite" />
                  </path>
                  
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
