import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const EulerBucklingCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.eulerBuckling;

  const [elasticModulus, setElasticModulus] = useState<number>(200e9); // Pa
  const [inertia, setInertia] = useState<number>(0.00005); // m^4
  const [length, setLength] = useState<number>(5); // m
  const [kFactor, setKFactor] = useState<number>(1); // Pinned-Pinned

  const [criticalLoad, setCriticalLoad] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (length > 0 && kFactor > 0) {
      // P_cr = (pi^2 * E * I) / (K * L)^2
      const effectiveLength = kFactor * length;
      const load = (Math.PI * Math.PI * elasticModulus * inertia) / (effectiveLength * effectiveLength);
      setCriticalLoad(load);
    } else {
      setCriticalLoad(0);
    }
  }, [elasticModulus, inertia, length, kFactor]);

  const isImperial = unitSystem === 'imperial';
  const modulusUnit = isImperial ? 'psi' : 'Pa';
  const inertiaUnit = isImperial ? 'in⁴' : 'm⁴';
  const lengthUnit = isImperial ? 'in' : 'm';
  const loadUnit = isImperial ? 'lbf' : 'N';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.elasticModulus || "Young's Modulus (E)"}</Label>
              <div className="flex gap-2">
                <Input type="number" value={elasticModulus} onChange={(e) => setElasticModulus(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{modulusUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.inertia || 'Area Moment of Inertia (I)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={inertia} onChange={(e) => setInertia(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{inertiaUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.length || 'Unsupported Length (L)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.kFactor || 'Effective Length Factor (K)'}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={kFactor}
                onChange={(e) => setKFactor(Number(e.target.value))}
              >
                <option value={1.0}>Pinned - Pinned (K = 1.0)</option>
                <option value={0.5}>Fixed - Fixed (K = 0.5)</option>
                <option value={0.7}>Fixed - Pinned (K = 0.7)</option>
                <option value={2.0}>Fixed - Free (K = 2.0)</option>
              </select>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {t?.results?.criticalLoad || 'Critical Buckling Load (P_cr)'}
                </span>
                <span className="text-3xl font-bold text-primary">
                  {criticalLoad.toExponential(3)} <span className="text-xl font-normal text-muted-foreground ml-1">{loadUnit}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Buckling Mode Shape'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Load Arrow */}
                  <path d="M 100 10 L 100 30" stroke="#ef4444" strokeWidth="4" />
                  <polygon points="95,30 105,30 100,40" fill="#ef4444" />
                  <text x="110" y="25" fill="#ef4444" fontSize="14" fontWeight="bold">P</text>

                  {/* Column Original */}
                  <line x1="100" y1="40" x2="100" y2="160" stroke="#cbd5e1" strokeWidth="6" strokeDasharray="4" />
                  
                  {/* Column Buckled (Simplified Bezier Curve based on K) */}
                  {kFactor === 1.0 && <path d="M 100 40 Q 150 100 100 160" fill="none" stroke="#3b82f6" strokeWidth="6" />}
                  {kFactor === 0.5 && <path d="M 100 40 C 100 80, 150 80, 150 100 C 150 120, 100 120, 100 160" fill="none" stroke="#3b82f6" strokeWidth="6" />}
                  {kFactor === 0.7 && <path d="M 100 40 C 100 80, 150 100, 100 160" fill="none" stroke="#3b82f6" strokeWidth="6" />}
                  {kFactor === 2.0 && <path d="M 100 160 Q 100 100 150 40" fill="none" stroke="#3b82f6" strokeWidth="6" />}

                  {/* Base Support */}
                  <rect x="70" y="160" width="60" height="10" fill="#64748b" />
                  {/* Top Support (if not free) */}
                  {kFactor !== 2.0 && <rect x="70" y="30" width="60" height="10" fill="#64748b" />}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EulerBucklingCalculator;
