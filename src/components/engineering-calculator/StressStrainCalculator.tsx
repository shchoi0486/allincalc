import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const StressStrainCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.stressStrain;

  const [force, setForce] = useState<number>(10000);
  const [area, setArea] = useState<number>(0.005);
  const [originalLength, setOriginalLength] = useState<number>(2);
  const [changeLength, setChangeLength] = useState<number>(0.001);

  const [stress, setStress] = useState<number>(0);
  const [strain, setStrain] = useState<number>(0);
  const [youngsModulus, setYoungsModulus] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (area > 0 && originalLength > 0) {
      const calcStress = force / area;
      const calcStrain = changeLength / originalLength;
      
      setStress(calcStress);
      setStrain(calcStrain);
      
      if (calcStrain > 0) {
        setYoungsModulus(calcStress / calcStrain);
      } else {
        setYoungsModulus(0);
      }
    }
  }, [force, area, originalLength, changeLength]);

  const isImperial = unitSystem === 'imperial';
  const forceUnit = isImperial ? 'lbf' : 'N';
  const areaUnit = isImperial ? 'in²' : 'm²';
  const lengthUnit = isImperial ? 'in' : 'm';
  const stressUnit = isImperial ? 'psi' : 'Pa';
  const modulusUnit = isImperial ? 'psi' : 'Pa';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.force || 'Applied Force (F)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={force} onChange={(e) => setForce(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{forceUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.area || 'Cross-sectional Area (A)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={0.000001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{areaUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.originalLength || 'Original Length (L₀)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={originalLength} onChange={(e) => setOriginalLength(Number(e.target.value))} min={0.001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.changeLength || 'Change in Length (ΔL)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={changeLength} onChange={(e) => setChangeLength(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
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
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.stress || 'Stress (σ)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{stress.toExponential(2)}</div>
                    <div className="text-xs text-muted-foreground">{stressUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.strain || 'Strain (ε)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{strain.toExponential(2)}</div>
                    <div className="text-xs text-muted-foreground">dimensionless</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.youngsModulus || "Young's Modulus (E)"}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{youngsModulus.toExponential(2)}</div>
                    <div className="text-xs text-muted-foreground">{modulusUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Deformation Visualization'}
              </h3>
              <div className="relative h-40 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Fixed Wall */}
                  <rect x="30" y="20" width="20" height="110" fill="#94a3b8" />
                  <line x1="30" y1="20" x2="50" y2="130" stroke="#475569" strokeWidth="2" strokeDasharray="4" />
                  
                  {/* Original Material */}
                  <rect x="50" y="55" width="200" height="40" fill="#cbd5e1" opacity="0.6" stroke="#64748b" strokeWidth="2" strokeDasharray="4" />
                  
                  {/* Deformed Material */}
                  <rect x="50" y="60" width={200 + (strain * 1000)} height="30" fill="#3b82f6" opacity="0.8" />
                  
                  {/* Force Arrow */}
                  <path d={`M ${250 + (strain * 1000)} 75 L ${290 + (strain * 1000)} 75`} stroke="#ef4444" strokeWidth="4" />
                  <polygon points={`${290 + (strain * 1000)},70 ${300 + (strain * 1000)},75 ${290 + (strain * 1000)},80`} fill="#ef4444" />
                  <text x={310 + (strain * 1000)} y="80" fill="#ef4444" fontSize="14" fontWeight="bold">F</text>

                  {/* Labels */}
                  <line x1="50" y1="40" x2="250" y2="40" stroke="#64748b" strokeWidth="1" />
                  <text x="150" y="35" fill="#64748b" fontSize="12" textAnchor="middle">L₀</text>

                  <line x1="250" y1="110" x2={250 + (strain * 1000)} y2="110" stroke="#3b82f6" strokeWidth="1" />
                  <text x={250 + (strain * 500)} y="125" fill="#3b82f6" fontSize="12" textAnchor="middle">ΔL</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StressStrainCalculator;
