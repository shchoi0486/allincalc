import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const CentrifugeCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.centrifuge;

  const isImperial = unitSystem === 'imperial';

  const [radius, setRadius] = useState<number>(isImperial ? 4 : 10); // in or cm
  const [speed, setSpeed] = useState<number>(3000); // RPM

  const [rcf, setRcf] = useState<number>(0);
  const [angularVelocity, setAngularVelocity] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (radius > 0 && speed > 0) {
      let r_cm = radius;
      if (isImperial) {
        r_cm = radius * 2.54; // inches to cm
      }

      // RCF = 1.118 * 10^-5 * r(cm) * N(RPM)^2
      const calcRcf = 1.118e-5 * r_cm * Math.pow(speed, 2);
      setRcf(calcRcf);

      // Angular velocity ω = 2 * π * N / 60
      const calcOmega = (2 * Math.PI * speed) / 60;
      setAngularVelocity(calcOmega);
    } else {
      setRcf(0);
      setAngularVelocity(0);
    }
  }, [radius, speed, isImperial]);

  const radiusUnit = isImperial ? 'in' : 'cm';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.radius || 'Rotor Radius (r)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={radius} onChange={(e) => setRadius(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{radiusUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed || 'Rotational Speed (N)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">RPM</span>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    {t?.results?.rcf || 'Relative Centrifugal Force (RCF)'}
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {rcf.toFixed(0)} <span className="text-lg font-normal text-muted-foreground">× g</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.angularVelocity || 'Angular Velocity (ω)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{angularVelocity.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">rad/s</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Centrifugal Force Diagram'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {/* Center axis */}
                  <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                  <circle cx="150" cy="100" r="5" fill="#475569" />

                  {/* Rotor Arm */}
                  <g style={{ animation: speed > 0 ? `spin ${60/speed}s linear infinite` : 'none', transformOrigin: '150px 100px' }}>
                    <line x1="150" y1="100" x2="250" y2="100" stroke="#cbd5e1" strokeWidth="6" />
                    {/* Tube */}
                    <rect x="240" y="85" width="20" height="30" rx="3" fill="#3b82f6" opacity="0.8" />
                    <path d="M 260 100 L 280 100" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-red)" />
                  </g>

                  {/* Labels */}
                  <text x="200" y="90" fill="#64748b" fontSize="12" textAnchor="middle">r = {radius} {radiusUnit}</text>
                  <text x="285" y="105" fill="#ef4444" fontSize="12" fontWeight="bold">RCF</text>
                  
                  {/* Rotation indication */}
                  <path d="M 120 70 A 40 40 0 0 1 180 70" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                  <text x="150" y="55" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">ω</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CentrifugeCalculator;
