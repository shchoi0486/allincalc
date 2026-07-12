import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const LMTDCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.lmtd;

  const [hotIn, setHotIn] = useState<number>(100);
  const [hotOut, setHotOut] = useState<number>(60);
  const [coldIn, setColdIn] = useState<number>(20);
  const [coldOut, setColdOut] = useState<number>(40);
  const [flowType, setFlowType] = useState<string>('counter'); // 'counter' or 'parallel'

  const [deltaT1, setDeltaT1] = useState<number>(0);
  const [deltaT2, setDeltaT2] = useState<number>(0);
  const [lmtd, setLmtd] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    let dt1 = 0;
    let dt2 = 0;

    if (flowType === 'counter') {
      dt1 = hotIn - coldOut;
      dt2 = hotOut - coldIn;
    } else {
      // parallel
      dt1 = hotIn - coldIn;
      dt2 = hotOut - coldOut;
    }

    setDeltaT1(dt1);
    setDeltaT2(dt2);

    if (dt1 <= 0 || dt2 <= 0) {
      setLmtd(0); // Invalid physically for LMTD calculation
    } else if (Math.abs(dt1 - dt2) < 0.001) {
      setLmtd(dt1); // When dt1 = dt2
    } else {
      const calcLmtd = (dt1 - dt2) / Math.log(dt1 / dt2);
      setLmtd(calcLmtd);
    }
  }, [hotIn, hotOut, coldIn, coldOut, flowType]);

  const isImperial = unitSystem === 'imperial';
  const tempUnit = isImperial ? '°F' : '°C';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.flowType || 'Flow Configuration'}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={flowType}
                onChange={(e) => setFlowType(e.target.value)}
              >
                <option value="counter">{locale === 'ko' ? 'Counter Flow (대향류)' : 'Counter Flow'}</option>
                <option value="parallel">{locale === 'ko' ? 'Parallel Flow (평행류)' : 'Parallel Flow'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-red-600">{t?.inputs?.hotIn || 'Hot In'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={hotIn} onChange={(e) => setHotIn(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{tempUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-red-600">{t?.inputs?.hotOut || 'Hot Out'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={hotOut} onChange={(e) => setHotOut(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{tempUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-blue-600">{t?.inputs?.coldIn || 'Cold In'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={coldIn} onChange={(e) => setColdIn(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{tempUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-blue-600">{t?.inputs?.coldOut || 'Cold Out'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={coldOut} onChange={(e) => setColdOut(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{tempUnit}</span>
                </div>
              </div>
            </div>

            {(deltaT1 <= 0 || deltaT2 <= 0) && (
              <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
                Invalid temperature differences. Ensure Hot &gt; Cold at all points.
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.deltaT1 || 'ΔT₁'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {deltaT1.toFixed(1)} <span className="text-xs font-normal">{tempUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.deltaT2 || 'ΔT₂'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {deltaT2.toFixed(1)} <span className="text-xs font-normal">{tempUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-2">
                    {t?.results?.lmtd || 'LMTD'}
                  </span>
                  <div className="text-3xl font-bold text-primary">
                    {lmtd > 0 ? lmtd.toFixed(2) : 'Error'} <span className="text-sm font-normal text-muted-foreground">{tempUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Temperature Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center">
                <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
                  {/* Axis */}
                  <line x1="40" y1="180" x2="360" y2="180" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="180" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  <text x="200" y="195" fill="#64748b" fontSize="12" textAnchor="middle">Position along Heat Exchanger</text>
                  <text x="25" y="100" fill="#64748b" fontSize="12" textAnchor="middle" transform="rotate(-90 25,100)">Temperature</text>

                  {(() => {
                    const minTemp = Math.min(coldIn, coldOut);
                    const maxTemp = Math.max(hotIn, hotOut);
                    const range = Math.max(maxTemp - minTemp, 1);
                    
                    const getY = (temp: number) => 170 - ((temp - minTemp) / range) * 140;

                    const hotStart = getY(hotIn);
                    const hotEnd = getY(hotOut);
                    
                    const coldStart = flowType === 'counter' ? getY(coldOut) : getY(coldIn);
                    const coldEnd = flowType === 'counter' ? getY(coldIn) : getY(coldOut);

                    return (
                      <>
                        {/* Hot Fluid Line */}
                        <path d={`M 50 ${hotStart} C 150 ${hotStart * 0.7 + hotEnd * 0.3}, 250 ${hotStart * 0.3 + hotEnd * 0.7}, 350 ${hotEnd}`} fill="none" stroke="#ef4444" strokeWidth="3" />
                        <circle cx="50" cy={hotStart} r="4" fill="#ef4444" />
                        <circle cx="350" cy={hotEnd} r="4" fill="#ef4444" />
                        <text x="50" y={hotStart - 10} fill="#ef4444" fontSize="12" textAnchor="middle">Th,in</text>
                        <text x="350" y={hotEnd - 10} fill="#ef4444" fontSize="12" textAnchor="middle">Th,out</text>

                        {/* Cold Fluid Line */}
                        <path d={`M 50 ${coldStart} C 150 ${coldStart * 0.7 + coldEnd * 0.3}, 250 ${coldStart * 0.3 + coldEnd * 0.7}, 350 ${coldEnd}`} fill="none" stroke="#3b82f6" strokeWidth="3" />
                        <circle cx="50" cy={coldStart} r="4" fill="#3b82f6" />
                        <circle cx="350" cy={coldEnd} r="4" fill="#3b82f6" />
                        
                        {flowType === 'counter' ? (
                          <>
                            <text x="50" y={coldStart + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,out</text>
                            <text x="350" y={coldEnd + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,in</text>
                            {/* Arrows */}
                            <polygon points="200,180 190,175 190,185" fill="#94a3b8" /> {/* X-axis arrow */}
                            <polygon points="190,180 200,175 200,185" fill="#3b82f6" transform={`translate(0, ${getY((coldIn+coldOut)/2) - 180})`} /> {/* Cold flow arrow left */}
                            <polygon points="200,180 190,175 190,185" fill="#ef4444" transform={`translate(0, ${getY((hotIn+hotOut)/2) - 180})`} /> {/* Hot flow arrow right */}
                          </>
                        ) : (
                          <>
                            <text x="50" y={coldStart + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,in</text>
                            <text x="350" y={coldEnd + 15} fill="#3b82f6" fontSize="12" textAnchor="middle">Tc,out</text>
                            {/* Arrows */}
                            <polygon points="200,180 190,175 190,185" fill="#3b82f6" transform={`translate(0, ${getY((coldIn+coldOut)/2) - 180})`} /> {/* Cold flow arrow right */}
                            <polygon points="200,180 190,175 190,185" fill="#ef4444" transform={`translate(0, ${getY((hotIn+hotOut)/2) - 180})`} /> {/* Hot flow arrow right */}
                          </>
                        )}
                        
                        {/* Delta T lines */}
                        <line x1="60" y1={hotStart} x2="60" y2={coldStart} stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                        <text x="70" y={(hotStart + coldStart)/2} fill="#10b981" fontSize="10">ΔT₁</text>

                        <line x1="340" y1={hotEnd} x2="340" y2={coldEnd} stroke="#10b981" strokeWidth="1" strokeDasharray="4" />
                        <text x="330" y={(hotEnd + coldEnd)/2} fill="#10b981" fontSize="10" textAnchor="end">ΔT₂</text>
                      </>
                    );
                  })()}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LMTDCalculator;
