import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const HydraulicJumpCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.hydraulicJump;

  const isImperial = unitSystem === 'imperial';

  const [depth1, setDepth1] = useState<number>(isImperial ? 2 : 0.5); // ft or m
  const [velocity1, setVelocity1] = useState<number>(isImperial ? 20 : 6); // ft/s or m/s

  const [froude1, setFroude1] = useState<number>(0);
  const [depth2, setDepth2] = useState<number>(0);
  const [energyLoss, setEnergyLoss] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (depth1 > 0 && velocity1 > 0) {
      const g = isImperial ? 32.174 : 9.81;

      // Fr1 = v1 / sqrt(g * y1)
      const fr1 = velocity1 / Math.sqrt(g * depth1);
      setFroude1(fr1);

      if (fr1 > 1) {
        // Supercritical flow, jump can occur
        // y2 = (y1 / 2) * (sqrt(1 + 8 * Fr1^2) - 1)
        const y2 = (depth1 / 2) * (Math.sqrt(1 + 8 * Math.pow(fr1, 2)) - 1);
        setDepth2(y2);

        // dE = (y2 - y1)^3 / (4 * y1 * y2)
        const dE = Math.pow(y2 - depth1, 3) / (4 * depth1 * y2);
        setEnergyLoss(dE);
      } else {
        // Subcritical, no jump
        setDepth2(0);
        setEnergyLoss(0);
      }
    } else {
      setFroude1(0);
      setDepth2(0);
      setEnergyLoss(0);
    }
  }, [depth1, velocity1, isImperial]);

  const lenUnit = isImperial ? 'ft' : 'm';
  const velUnit = isImperial ? 'ft/s' : 'm/s';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.depth || 'Initial Depth (y₁)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={depth1} onChange={(e) => setDepth1(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lenUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.velocity || 'Initial Velocity (v₁)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={velocity1} onChange={(e) => setVelocity1(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{velUnit}</span>
              </div>
            </div>

            {froude1 > 0 && froude1 <= 1 && (
              <div className="text-xs text-yellow-600 bg-yellow-50 p-2 rounded border border-yellow-200">
                Froude number is &le; 1 (Subcritical). Hydraulic jump will not occur.
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
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.froudeNumber || 'Froude Number (Fr₁)'}</span>
                  <div className="text-xl font-bold text-blue-600">
                    {froude1.toFixed(2)}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-teal-200 shadow-sm flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/20">
                  <span className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-1">
                    {t?.results?.sequentDepth || 'Sequent Depth (y₂)'}
                  </span>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {depth2 > 0 ? depth2.toFixed(2) : '-'} <span className="text-sm font-normal text-muted-foreground">{lenUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.energyLoss || 'Energy Loss (ΔE)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{energyLoss > 0 ? energyLoss.toFixed(2) : '-'}</div>
                    <div className="text-xs text-muted-foreground">{lenUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Hydraulic Jump Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Bed */}
                  <rect x="0" y="130" width="300" height="20" fill="#94a3b8" />
                  
                  {froude1 > 1 ? (
                    <>
                      {/* Water profile */}
                      <path d="M 0 110 L 100 110 Q 150 110, 180 50 T 300 50 L 300 130 L 0 130 Z" fill="#3b82f6" opacity="0.6" />
                      
                      {/* Turbulence / Rollers */}
                      <path d="M 120 100 Q 130 80, 140 100 T 160 80 T 180 100" fill="none" stroke="#60a5fa" strokeWidth="2" />
                      <path d="M 130 90 Q 140 70, 150 90 T 170 70" fill="none" stroke="#93c5fd" strokeWidth="2" />
                      
                      {/* Labels y1 */}
                      <line x1="50" y1="110" x2="50" y2="130" stroke="#1d4ed8" strokeWidth="2" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
                      <text x="40" y="125" fill="#1d4ed8" fontSize="12" textAnchor="end">y₁</text>

                      {/* Labels y2 */}
                      <line x1="250" y1="50" x2="250" y2="130" stroke="#1d4ed8" strokeWidth="2" markerStart="url(#arrow-blue)" markerEnd="url(#arrow-blue)" />
                      <text x="240" y="95" fill="#1d4ed8" fontSize="12" textAnchor="end">y₂</text>

                      {/* Velocity arrow */}
                      <path d="M 20 80 L 80 80" stroke="#2563eb" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                      <text x="50" y="70" fill="#2563eb" fontSize="12" textAnchor="middle" fontWeight="bold">Fr₁ = {froude1.toFixed(1)}</text>
                    </>
                  ) : (
                    <>
                      {/* Subcritical flow water profile */}
                      <rect x="0" y="50" width="300" height="80" fill="#3b82f6" opacity="0.6" />
                      <text x="150" y="90" fill="#1e3a8a" fontSize="14" textAnchor="middle" fontWeight="bold">Subcritical Flow (No Jump)</text>
                    </>
                  )}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HydraulicJumpCalculator;
