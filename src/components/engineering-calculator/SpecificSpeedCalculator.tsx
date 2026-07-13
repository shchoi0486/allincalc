import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const FLOW_TO_GPM: Record<string, number> = {
  'm³/h': 4.40287,
  'US gpm': 1,
  'm³/s': 15850.3,
  'L/s': 15.8503,
};

const FLOW_TO_M3H: Record<string, number> = {
  'm³/h': 1,
  'US gpm': 0.227125,
  'm³/s': 3600,
  'L/s': 3.6,
};

const LENGTH_TO_FT: Record<string, number> = {
  mm: 0.00328084,
  cm: 0.0328084,
  m: 3.28084,
  in: 1 / 12,
  ft: 1,
};

const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

const FLOW_UNITS = ['m³/h', 'US gpm', 'm³/s', 'L/s'];
const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const SpecificSpeedCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.specificSpeed;

  const isImperial = unitSystem === 'imperial';

  const [speed, setSpeed] = useState<number>(1750); // RPM
  const [flow, setFlow] = useState<string>('500'); // m3/h or US gpm
  const [head, setHead] = useState<string>('30'); // m or ft

  const [flowUnit, setFlowUnit] = useState<string>('m³/h');
  const [headUnit, setHeadUnit] = useState<string>('m');

  const [specificSpeed, setSpecificSpeed] = useState<number>(0);
  const [impellerType, setImpellerType] = useState<string>('');

  useEffect(() => {
    if (isImperial) {
      setFlow('500');
      setHead('30');
      setFlowUnit('US gpm');
      setHeadUnit('ft');
    } else {
      setFlow('500');
      setHead('30');
      setFlowUnit('m³/h');
      setHeadUnit('m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const Q = parseFloat(flow);
    const H = parseFloat(head);

    if (!isNaN(Q) && !isNaN(H) && speed > 0 && Q > 0 && H > 0) {
      let ns: number;
      if (isImperial) {
        const flow_gpm = Q * (FLOW_TO_GPM[flowUnit] ?? 1);
        const head_ft = H * (LENGTH_TO_FT[headUnit] ?? 1);
        // Ns = N * sqrt(Q) / H^0.75  (Q in gpm, H in ft)
        ns = (speed * Math.sqrt(flow_gpm)) / Math.pow(head_ft, 0.75);
      } else {
        const flow_m3h = Q * (FLOW_TO_M3H[flowUnit] ?? 1);
        const head_m = H * (LENGTH_TO_M[headUnit] ?? 1);
        // Ns = N * sqrt(Q) / H^0.75  (Q in m3/h, H in m)
        ns = (speed * Math.sqrt(flow_m3h)) / Math.pow(head_m, 0.75);
      }

      setSpecificSpeed(ns);

      // Impeller classification rules of thumb
      if (isImperial) {
        if (ns < 500) setImpellerType('Positive Displacement (Not Centrifugal)');
        else if (ns < 4000) setImpellerType(locale === 'ko' ? 'Radial Flow (원심형)' : 'Radial Flow');
        else if (ns < 8000) setImpellerType(locale === 'ko' ? 'Mixed Flow (사류형)' : 'Mixed Flow');
        else setImpellerType(locale === 'ko' ? 'Axial Flow (축류형)' : 'Axial Flow');
      } else {
        if (ns < 500 / 0.86) setImpellerType('Positive Displacement / Special');
        else if (ns < 4000 / 0.86) setImpellerType(locale === 'ko' ? 'Radial Flow (원심형)' : 'Radial Flow');
        else if (ns < 8000 / 0.86) setImpellerType(locale === 'ko' ? 'Mixed Flow (사류형)' : 'Mixed Flow');
        else setImpellerType(locale === 'ko' ? 'Axial Flow (축류형)' : 'Axial Flow');
      }
    } else {
      setSpecificSpeed(0);
      setImpellerType('');
    }
  }, [speed, flow, head, flowUnit, headUnit, isImperial, locale]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed || 'Pump Speed (N)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                <span className="flex items-center justify-center bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold shrink-0 w-16">RPM</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.flow || 'Flow Rate at BEP (Q)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={flow} onChange={(e) => setFlow(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.flow || 'Flow Rate at BEP (Q)'} unit`} value={flowUnit} onChange={(e) => setFlowUnit(e.target.value)} className={unitSelectClass}>
                  {FLOW_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.head || 'Head per Stage at BEP (H)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={head} onChange={(e) => setHead(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.head || 'Head per Stage at BEP (H)'} unit`} value={headUnit} onChange={(e) => setHeadUnit(e.target.value)} className={unitSelectClass}>
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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
