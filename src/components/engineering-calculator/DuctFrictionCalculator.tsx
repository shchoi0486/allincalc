import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const DuctFrictionCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.ductFriction;

  const isImperial = unitSystem === 'imperial';

  const [flowRate, setFlowRate] = useState<number>(isImperial ? 1000 : 1700); // CFM or m3/h
  const [width, setWidth] = useState<number>(isImperial ? 12 : 300); // in or mm
  const [height, setHeight] = useState<number>(isImperial ? 12 : 300); // in or mm
  const [roughness, setRoughness] = useState<number>(isImperial ? 0.0003 : 0.09); // ft or mm (Galvanized steel)

  const [velocity, setVelocity] = useState<number>(0);
  const [hydraulicDiameter, setHydraulicDiameter] = useState<number>(0);
  const [frictionLoss, setFrictionLoss] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (flowRate > 0 && width > 0 && height > 0 && roughness > 0) {
      let Q = flowRate;
      let W = width;
      let H = height;
      let e = roughness;

      if (isImperial) {
        // Imperial calculation
        // Q: CFM, W,H: inches
        const A_sqft = (W * H) / 144;
        const V_fpm = Q / A_sqft; // ft/min
        setVelocity(V_fpm);

        const De_in = (1.3 * Math.pow(W * H, 0.625)) / Math.pow(W + H, 0.25);
        setHydraulicDiameter(De_in); // in

        // Friction loss empirical formula for standard air (ASHRAE)
        // dP = (0.109136 * (V_fpm / 1000)^1.9) / (De_in^1.22)
        // Note: Simple approximation for galvanized duct.
        const dp = (0.109136 * Math.pow(V_fpm / 1000, 1.9)) / Math.pow(De_in, 1.22);
        setFrictionLoss(dp); // in.w.g. per 100 ft
      } else {
        // SI calculation
        // Q: m3/h, W,H: mm
        const Q_m3s = Q / 3600;
        const W_m = W / 1000;
        const H_m = H / 1000;
        const A_m2 = W_m * H_m;
        
        const V_ms = Q_m3s / A_m2;
        setVelocity(V_ms);

        const De_m = (1.3 * Math.pow(W_m * H_m, 0.625)) / Math.pow(W_m + H_m, 0.25);
        setHydraulicDiameter(De_m * 1000); // mm

        // Friction loss Pa/m
        // dp = 0.002268 * e^0.15 * V^1.85 * De^-1.22 * density (approx 1.2) -> using empirical
        // Or using conversion from Imperial formula: 1 inwg/100ft = 0.817 Pa/m
        // Let's use the imperial formula internally and convert
        const A_sqft = (W / 25.4 * H / 25.4) / 144;
        const Q_cfm = Q_m3s * 2118.88;
        const V_fpm = Q_cfm / A_sqft;
        const De_in = De_m * 39.3701;
        const dp_inwg_100ft = (0.109136 * Math.pow(V_fpm / 1000, 1.9)) / Math.pow(De_in, 1.22);
        
        setFrictionLoss(dp_inwg_100ft * 0.8166); // Pa/m
      }
    } else {
      setVelocity(0);
      setHydraulicDiameter(0);
      setFrictionLoss(0);
    }
  }, [flowRate, width, height, roughness, isImperial]);

  const flowUnit = isImperial ? 'CFM' : 'm³/h';
  const lenUnit = isImperial ? 'in' : 'mm';
  const roughUnit = isImperial ? 'ft' : 'mm';
  const velUnit = isImperial ? 'ft/min' : 'm/s';
  const frictionUnit = isImperial ? 'in.wg/100ft' : 'Pa/m';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.flowRate || 'Airflow Rate (Q)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={flowRate} onChange={(e) => setFlowRate(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{flowUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.width || 'Duct Width (W)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.height || 'Duct Height (H)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.roughness || 'Absolute Roughness (ε)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={roughness} onChange={(e) => setRoughness(Number(e.target.value))} min={0.00001} step={0.0001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{roughUnit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Galvanized Steel: ~0.0003 ft (0.09 mm)</p>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-teal-200 shadow-sm flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/20">
                  <span className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-1">
                    {t?.results?.frictionLoss || 'Friction Loss per length'}
                  </span>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {frictionLoss.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">{frictionUnit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.velocity || 'Air Velocity (v)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {velocity.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{velUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.hydraulicDiameter || 'Equiv. Diameter (De)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {hydraulicDiameter.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{lenUnit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Duct Cross Section'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Duct */}
                  <rect x="50" y="50" width="100" height="100" fill="none" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Airflow arrows */}
                  <g className="opacity-50" fill="#3b82f6">
                    <circle cx="100" cy="100" r="15" fill="#3b82f6" opacity="0.3" />
                    <circle cx="100" cy="100" r="5" />
                    <circle cx="70" cy="70" r="3" />
                    <circle cx="130" cy="70" r="3" />
                    <circle cx="70" cy="130" r="3" />
                    <circle cx="130" cy="130" r="3" />
                  </g>
                  
                  {/* Labels */}
                  <line x1="50" y1="35" x2="150" y2="35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="50" y1="30" x2="50" y2="40" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="150" y1="30" x2="150" y2="40" stroke="#94a3b8" strokeWidth="1" />
                  <text x="100" y="25" fill="#64748b" fontSize="12" textAnchor="middle">W</text>

                  <line x1="35" y1="50" x2="35" y2="150" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="30" y1="50" x2="40" y2="50" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="30" y1="150" x2="40" y2="150" stroke="#94a3b8" strokeWidth="1" />
                  <text x="25" y="105" fill="#64748b" fontSize="12" textAnchor="middle" transform="rotate(-90 25,105)">H</text>
                  
                  <text x="100" y="180" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">Flow: Out of screen</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DuctFrictionCalculator;
