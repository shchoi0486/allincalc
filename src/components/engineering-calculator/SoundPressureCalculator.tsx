import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const SoundPressureCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.soundPressure;

  const [l1, setL1] = useState<number>(100); // dB
  const [r1, setR1] = useState<number>(1); // m or ft
  const [r2, setR2] = useState<number>(10); // m or ft

  const [l2, setL2] = useState<number>(0);
  const [attenuation, setAttenuation] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (r1 > 0 && r2 > 0) {
      // Inverse square law: L2 = L1 - 20 * log10(r2 / r1)
      const drop = 20 * Math.log10(r2 / r1);
      setAttenuation(drop);
      setL2(l1 - drop);
    } else {
      setL2(0);
      setAttenuation(0);
    }
  }, [l1, r1, r2]);

  const lengthUnit = unitSystem === 'imperial' ? 'ft' : 'm';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.l1 || 'Initial SPL (L₁)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={l1} onChange={(e) => setL1(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">dB</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.r1 || 'Reference Distance (r₁)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={r1} onChange={(e) => setR1(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.r2 || 'Target Distance (r₂)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={r2} onChange={(e) => setR2(Number(e.target.value))} min={0.1} className="min-w-0" />
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
              
              <div className="grid gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.l2 || 'Target SPL (L₂)'}
                  </span>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">{l2.toFixed(1)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">dB</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.attenuation || 'Attenuation / Drop'}
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-bold text-red-500">-{attenuation.toFixed(1)}</span>
                    <span className="text-xs font-normal text-muted-foreground ml-1">dB</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Sound Attenuation Curve'}
              </h3>
              <div className="relative h-48 w-full flex items-end overflow-hidden bg-white dark:bg-gray-900 rounded-lg border p-2">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Axes */}
                  <line x1="40" y1="170" x2="380" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="170" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  
                  <text x="380" y="190" fill="#64748b" fontSize="12" textAnchor="end">Distance (r)</text>
                  <text x="15" y="30" fill="#64748b" fontSize="12" transform="rotate(-90 25,30)">SPL (dB)</text>

                  {/* Inverse Log Curve Simulation */}
                  <path 
                    d="M 60 40 Q 120 150, 360 160" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                  />

                  {/* Point 1 */}
                  <circle cx="60" cy="40" r="5" fill="#16a34a" />
                  <text x="60" y="30" fill="#16a34a" fontSize="12" textAnchor="middle" fontWeight="bold">L₁</text>
                  <line x1="60" y1="170" x2="60" y2="40" stroke="#16a34a" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Point 2 */}
                  <circle cx="260" cy="145" r="5" fill="#ef4444" />
                  <text x="260" y="135" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">L₂</text>
                  <line x1="260" y1="170" x2="260" y2="145" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />

                  {/* Distance Labels */}
                  <text x="60" y="185" fill="#16a34a" fontSize="10" textAnchor="middle">r₁</text>
                  <text x="260" y="185" fill="#ef4444" fontSize="10" textAnchor="middle">r₂</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SoundPressureCalculator;
