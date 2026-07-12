import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const TorquePowerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.torquePower;

  const isImperial = unitSystem === 'imperial';

  const [torque, setTorque] = useState<number>(isImperial ? 100 : 135); // lb-ft or N·m
  const [speed, setSpeed] = useState<number>(1750); // RPM
  const [power, setPower] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (torque > 0 && speed > 0) {
      if (isImperial) {
        // P (HP) = T (lb-ft) * N (RPM) / 5252
        setPower((torque * speed) / 5252);
      } else {
        // P (W) = T (N·m) * (2 * pi * N / 60)
        // Convert to kW
        setPower((torque * 2 * Math.PI * speed) / 60000);
      }
    } else {
      setPower(0);
    }
  }, [torque, speed, isImperial]);

  const torqueUnit = isImperial ? 'lb-ft' : 'N·m';
  const powerUnit = isImperial ? 'hp' : 'kW';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.torque || 'Torque (τ)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={torque} onChange={(e) => setTorque(Number(e.target.value))} min={0} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">{torqueUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed || 'Rotational Speed (N)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={0} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">RPM</span>
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
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-green-200 shadow-sm flex flex-col items-center justify-center bg-green-50 dark:bg-green-900/20">
                <span className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  {t?.results?.power || 'Mechanical Power (P)'}
                </span>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400">
                  {power.toFixed(2)} <span className="text-xl font-normal text-muted-foreground">{powerUnit}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Power-Torque Relationship'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {/* Shaft */}
                  <rect x="50" y="85" width="200" height="30" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                  
                  {/* Shaft rotation indicator */}
                  <ellipse cx="250" cy="100" rx="10" ry="15" fill="none" stroke="#64748b" strokeWidth="2" />
                  <ellipse cx="50" cy="100" rx="10" ry="15" fill="#cbd5e1" stroke="#64748b" strokeWidth="2" />
                  
                  {/* Rotation Arrow (Speed) */}
                  <path d="M 60 50 A 50 50 0 0 1 120 70" fill="none" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow-blue)" />
                  <polygon points="120,70 115,60 110,75" fill="#3b82f6" />
                  <text x="90" y="40" fill="#3b82f6" fontSize="12" fontWeight="bold">N ({speed} RPM)</text>

                  {/* Torque Arrow */}
                  <path d="M 240 150 A 60 60 0 0 0 180 130" fill="none" stroke="#ef4444" strokeWidth="4" markerEnd="url(#arrow-red)" />
                  <polygon points="180,130 185,140 190,125" fill="#ef4444" />
                  <text x="210" y="165" fill="#ef4444" fontSize="12" fontWeight="bold">τ ({torque} {torqueUnit})</text>

                  {/* Power Label */}
                  <rect x="110" y="85" width="80" height="30" fill="#10b981" opacity="0.2" />
                  <text x="150" y="105" fill="#047857" fontSize="14" fontWeight="bold" textAnchor="middle">{power.toFixed(1)} {powerUnit}</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TorquePowerCalculator;
