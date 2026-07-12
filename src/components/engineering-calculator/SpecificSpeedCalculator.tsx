import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const SpecificSpeedCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.specificSpeed;

  const [speed, setSpeed] = useState<number>(1750); // RPM
  const [flow, setFlow] = useState<number>(500); // m3/h or US gpm
  const [head, setHead] = useState<number>(30); // m or ft

  const [specificSpeed, setSpecificSpeed] = useState<number>(0);
  const [impellerType, setImpellerType] = useState<string>('');

  const isImperial = unitSystem === 'imperial';

  const handleCalculate = useCallback(() => {
    if (speed > 0 && flow > 0 && head > 0) {
      // Ns = N * sqrt(Q) / H^0.75
      const ns = (speed * Math.sqrt(flow)) / Math.pow(head, 0.75);
      setSpecificSpeed(ns);

      // Impeller classification rules of thumb
      // Imperial (US gpm, ft): Radial < 4000, Mixed 4000-8000, Axial > 8000
      // SI (m3/s, m) typically has different values, but often SI uses m3/min or m3/h.
      // If we use m3/h and m: 
      // Ns(metric) approx = Ns(US) / 51.64
      // Let's use simple logic based on unit system
      if (isImperial) {
        if (ns < 500) setImpellerType('Positive Displacement (Not Centrifugal)');
        else if (ns < 4000) setImpellerType(locale === 'ko' ? 'Radial Flow (원심형)' : 'Radial Flow');
        else if (ns < 8000) setImpellerType(locale === 'ko' ? 'Mixed Flow (사류형)' : 'Mixed Flow');
        else setImpellerType(locale === 'ko' ? 'Axial Flow (축류형)' : 'Axial Flow');
      } else {
        // Assuming Q in m3/h and H in m. The conversion from US to metric (m3/h, m) is Ns_metric = Ns_US / 1.16 roughly, 
        // wait, let's use standard European Nq (Q in m3/s, H in m) -> Nq = Ns_US / 51.64
        // If Q is m3/h: Ns(m3/h, m) = Ns_US / 0.86
        if (ns < 500 / 0.86) setImpellerType('Positive Displacement / Special');
        else if (ns < 4000 / 0.86) setImpellerType(locale === 'ko' ? 'Radial Flow (원심형)' : 'Radial Flow');
        else if (ns < 8000 / 0.86) setImpellerType(locale === 'ko' ? 'Mixed Flow (사류형)' : 'Mixed Flow');
        else setImpellerType(locale === 'ko' ? 'Axial Flow (축류형)' : 'Axial Flow');
      }
    } else {
      setSpecificSpeed(0);
      setImpellerType('');
    }
  }, [speed, flow, head, isImperial]);

  const flowUnit = isImperial ? 'US gpm' : 'm³/h';
  const headUnit = isImperial ? 'ft' : 'm';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.speed || 'Pump Speed (N)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">RPM</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.flow || 'Flow Rate at BEP (Q)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={flow} onChange={(e) => setFlow(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">{flowUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.head || 'Head per Stage at BEP (H)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={head} onChange={(e) => setHead(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{headUnit}</span>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-2">
                    {t?.results?.specificSpeed || 'Specific Speed (N_s)'}
                  </span>
                  <span className="text-4xl font-bold text-blue-600">{specificSpeed.toFixed(0)}</span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-2">
                    {t?.results?.impellerType || 'Recommended Impeller'}
                  </span>
                  <span className="text-xl font-bold text-green-600">{impellerType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Impeller Selection Chart'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Axis */}
                  <line x1="20" y1="130" x2="380" y2="130" stroke="#94a3b8" strokeWidth="4" />
                  <text x="380" y="145" fill="#64748b" fontSize="12" textAnchor="end">Specific Speed (N_s)</text>
                  
                  {/* Radial Zone */}
                  <rect x="20" y="50" width="120" height="70" fill="#3b82f6" opacity="0.3" />
                  <text x="80" y="40" fill="#1d4ed8" fontSize="12" textAnchor="middle" fontWeight="bold">Radial</text>
                  
                  {/* Mixed Zone */}
                  <rect x="140" y="50" width="120" height="70" fill="#10b981" opacity="0.3" />
                  <text x="200" y="40" fill="#047857" fontSize="12" textAnchor="middle" fontWeight="bold">Mixed</text>
                  
                  {/* Axial Zone */}
                  <rect x="260" y="50" width="120" height="70" fill="#8b5cf6" opacity="0.3" />
                  <text x="320" y="40" fill="#6d28d9" fontSize="12" textAnchor="middle" fontWeight="bold">Axial</text>

                  {/* Indicator based on Ns */}
                  {specificSpeed > 0 && (
                    <g transform={`translate(${Math.min(370, Math.max(30, isImperial ? (specificSpeed / 10000) * 360 : (specificSpeed / 11600) * 360))}, 110)`}>
                      <polygon points="-10,10 10,10 0,-10" fill="#ef4444" />
                      <text x="0" y="-15" fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">Current</text>
                    </g>
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

export default SpecificSpeedCalculator;
