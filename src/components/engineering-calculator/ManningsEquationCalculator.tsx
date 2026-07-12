import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const ManningsEquationCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.manningsEquation;

  const [roughness, setRoughness] = useState<number>(0.013); // concrete
  const [area, setArea] = useState<number>(2); // m2 or ft2
  const [wettedPerimeter, setWettedPerimeter] = useState<number>(4); // m or ft
  const [slope, setSlope] = useState<number>(0.001); // m/m or ft/ft

  const [hydraulicRadius, setHydraulicRadius] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [discharge, setDischarge] = useState<number>(0);

  const isImperial = unitSystem === 'imperial';

  const handleCalculate = useCallback(() => {
    if (area > 0 && wettedPerimeter > 0 && roughness > 0 && slope >= 0) {
      const R = area / wettedPerimeter;
      setHydraulicRadius(R);

      // k = 1.0 for SI, 1.486 for Imperial
      const k = isImperial ? 1.486 : 1.0;
      
      const V = (k / roughness) * Math.pow(R, 2/3) * Math.pow(slope, 1/2);
      const Q = V * area;

      setVelocity(V);
      setDischarge(Q);
    } else {
      setHydraulicRadius(0);
      setVelocity(0);
      setDischarge(0);
    }
  }, [roughness, area, wettedPerimeter, slope, isImperial]);

  const areaUnit = isImperial ? 'ft²' : 'm²';
  const lengthUnit = isImperial ? 'ft' : 'm';
  const velocityUnit = isImperial ? 'ft/s' : 'm/s';
  const dischargeUnit = isImperial ? 'ft³/s (cfs)' : 'm³/s';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.roughness || "Manning's Roughness (n)"}</Label>
              <Input type="number" value={roughness} onChange={(e) => setRoughness(Number(e.target.value))} min={0.001} step={0.001} />
              <p className="text-xs text-muted-foreground mt-1">e.g., Concrete ~0.013, Earth channel ~0.022</p>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.area || 'Cross-sectional Area (A)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={0.01} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{areaUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.wettedPerimeter || 'Wetted Perimeter (P)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={wettedPerimeter} onChange={(e) => setWettedPerimeter(Number(e.target.value))} min={0.01} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.slope || 'Channel Slope (S)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={slope} onChange={(e) => setSlope(Number(e.target.value))} min={0} step={0.001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">m/m</span>
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
              
              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.hydraulicRadius || 'Hydraulic Radius (R)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{hydraulicRadius.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{lengthUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.velocity || 'Flow Velocity (V)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{velocity.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{velocityUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.discharge || 'Discharge (Q)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{discharge.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{dischargeUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Open Channel Flow Cross-section'}
              </h3>
              <div className="relative h-40 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Channel Base */}
                  <path d="M 50 20 L 100 130 L 300 130 L 350 20" fill="none" stroke="#64748b" strokeWidth="8" />
                  
                  {/* Water Fill */}
                  <path d="M 80 80 L 320 80 L 300 130 L 100 130 Z" fill="#3b82f6" opacity="0.6" />
                  
                  {/* Water Surface Line */}
                  <line x1="70" y1="80" x2="330" y2="80" stroke="#2563eb" strokeWidth="2" strokeDasharray="5,5" />
                  <polygon points="200,80 195,70 205,70" fill="#2563eb" />

                  {/* Wetted Perimeter Highlight */}
                  <path d="M 80 80 L 100 130 L 300 130 L 320 80" fill="none" stroke="#ef4444" strokeWidth="4" />
                  <text x="200" y="145" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Wetted Perimeter (P)</text>
                  
                  {/* Area Label */}
                  <text x="200" y="110" fill="#1e3a8a" fontSize="16" textAnchor="middle" fontWeight="bold">Area (A)</text>
                  
                  {/* Flow arrow */}
                  <circle cx="200" cy="105" r="15" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5"/>
                  <circle cx="200" cy="105" r="3" fill="#ffffff" />
                  <text x="225" y="110" fill="#ffffff" fontSize="12" opacity="0.8">Flow (V)</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManningsEquationCalculator;
