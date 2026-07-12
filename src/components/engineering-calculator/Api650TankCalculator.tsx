import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const Api650TankCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.api650Tank;

  const isImperial = unitSystem === 'imperial';

  // API 650 1-foot method inputs
  const [diameter, setDiameter] = useState<number>(isImperial ? 50 : 15); // ft or m
  const [height, setHeight] = useState<number>(isImperial ? 32 : 10); // ft or m
  const [specificGravity, setSpecificGravity] = useState<number>(1.0);
  const [allowableStress, setAllowableStress] = useState<number>(isImperial ? 23200 : 160); // psi or MPa
  const [hydrotestStress, setHydrotestStress] = useState<number>(isImperial ? 24900 : 171); // psi or MPa
  const [corrosionAllowance, setCorrosionAllowance] = useState<number>(isImperial ? 0.125 : 3.0); // in or mm

  const [designThickness, setDesignThickness] = useState<number>(0);
  const [testThickness, setTestThickness] = useState<number>(0);
  const [requiredThickness, setRequiredThickness] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (diameter > 0 && height > 0 && specificGravity > 0 && allowableStress > 0 && hydrotestStress > 0) {
      let td = 0;
      let tt = 0;

      if (isImperial) {
        // Imperial formula API 650
        // td = (2.6 * D * (H - 1) * G) / Sd + CA
        td = ((2.6 * diameter * (height - 1) * specificGravity) / allowableStress) + corrosionAllowance;
        // tt = (2.6 * D * (H - 1)) / St
        tt = ((2.6 * diameter * (height - 1)) / hydrotestStress);
      } else {
        // SI formula API 650
        // td = (4.9 * D * (H - 0.3) * G) / Sd + CA
        td = ((4.9 * diameter * (height - 0.3) * specificGravity) / allowableStress) + corrosionAllowance;
        // tt = (4.9 * D * (H - 0.3)) / St
        tt = ((4.9 * diameter * (height - 0.3)) / hydrotestStress);
      }

      // API 650 Nominal thickness minima based on diameter
      // D < 15m (50ft) -> t_min = 5mm (3/16 in = 0.1875 in)
      // D <= 36m (120ft) -> t_min = 6mm (1/4 in = 0.25 in)
      // D <= 60m (200ft) -> t_min = 8mm (5/16 in = 0.3125 in)
      // D > 60m (200ft) -> t_min = 10mm (3/8 in = 0.375 in)
      let t_min = 0;
      if (isImperial) {
        if (diameter < 50) t_min = 0.1875;
        else if (diameter <= 120) t_min = 0.25;
        else if (diameter <= 200) t_min = 0.3125;
        else t_min = 0.375;
      } else {
        if (diameter < 15) t_min = 5;
        else if (diameter <= 36) t_min = 6;
        else if (diameter <= 60) t_min = 8;
        else t_min = 10;
      }

      setDesignThickness(td);
      setTestThickness(tt);
      setRequiredThickness(Math.max(td, tt, t_min));
    } else {
      setDesignThickness(0);
      setTestThickness(0);
      setRequiredThickness(0);
    }
  }, [diameter, height, specificGravity, allowableStress, hydrotestStress, corrosionAllowance, isImperial]);

  const lenUnit = isImperial ? 'ft' : 'm';
  const thkUnit = isImperial ? 'in' : 'mm';
  const stressUnit = isImperial ? 'psi' : 'MPa';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.diameter || 'Tank Diameter (D)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.height || 'Liquid Height (H)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.specificGravity || 'Specific Gravity (G)'}</Label>
              <Input type="number" value={specificGravity} onChange={(e) => setSpecificGravity(Number(e.target.value))} min={0.1} step={0.01} className="min-w-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.allowableStress || 'Allowable Stress (Sd)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={allowableStress} onChange={(e) => setAllowableStress(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-xs">{stressUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Hydrotest Stress (St)</Label>
                <div className="flex gap-2">
                  <Input type="number" value={hydrotestStress} onChange={(e) => setHydrotestStress(Number(e.target.value))} min={1} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-xs">{stressUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.corrosionAllowance || 'Corrosion Allowance (CA)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={corrosionAllowance} onChange={(e) => setCorrosionAllowance(Number(e.target.value))} min={0} step={0.01} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{thkUnit}</span>
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.designThickness || 'Design Thickness (td)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {designThickness.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">{thkUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.hydrotestThickness || 'Hydrotest Thickness (tt)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {testThickness.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">{thkUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 mt-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Required Minimum Thickness (Bottom Course)
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {requiredThickness.toFixed(3)} <span className="text-lg font-normal text-muted-foreground">{thkUnit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    (Max of td, tt, and nominal minimum based on diameter)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Tank Shell Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Ground */}
                  <rect x="20" y="160" width="160" height="10" fill="#94a3b8" />
                  
                  {/* Tank Shell */}
                  <rect x="50" y="40" width="100" height="120" fill="none" stroke="#475569" strokeWidth="4" />
                  
                  {/* Liquid Level */}
                  <rect x="52" y="60" width="96" height="100" fill="#3b82f6" opacity="0.5" />
                  
                  {/* Labels */}
                  <line x1="160" y1="40" x2="160" y2="160" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                  <text x="170" y="105" fill="#64748b" fontSize="12" textAnchor="middle">H</text>

                  <line x1="50" y1="25" x2="150" y2="25" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                  <text x="100" y="20" fill="#64748b" fontSize="12" textAnchor="middle">D</text>

                  {/* 1-Foot point indication */}
                  <line x1="40" y1="140" x2="160" y2="140" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                  <text x="35" y="145" fill="#ef4444" fontSize="10" textAnchor="end">1-ft point</text>
                  
                  {/* Highlight bottom course */}
                  <rect x="48" y="130" width="4" height="30" fill="#ef4444" />
                  <rect x="148" y="130" width="4" height="30" fill="#ef4444" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Api650TankCalculator;
