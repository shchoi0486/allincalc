import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const MODULUS_TO_PA: Record<string, number> = {
  GPa: 1e9,
  MPa: 1e6,
  psi: 6894.7572932,
};

const INERTIA_TO_M4: Record<string, number> = {
  'mm⁴': 1e-12,
  'cm⁴': 1e-8,
  'm⁴': 1,
  'in⁴': Math.pow(0.0254, 4),
  'ft⁴': Math.pow(0.3048, 4),
};

const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

const LOAD_TO_N: Record<string, number> = {
  N: 1,
  lbf: 4.44822,
};

const MODULUS_UNITS = ['GPa', 'psi', 'MPa'];
const INERTIA_UNITS = ['mm⁴', 'cm⁴', 'm⁴', 'in⁴', 'ft⁴'];
const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const EulerBucklingCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.eulerBuckling;

  const isImperial = unitSystem === 'imperial';

  const [elasticModulus, setElasticModulus] = useState<string>('200'); // GPa
  const [inertia, setInertia] = useState<string>('0.00005'); // m^4
  const [length, setLength] = useState<string>('5'); // m
  const [kFactor, setKFactor] = useState<number>(1); // Pinned-Pinned

  const [elasticModulusUnit, setElasticModulusUnit] = useState<string>('GPa');
  const [inertiaUnit, setInertiaUnit] = useState<string>('m⁴');
  const [lengthUnit, setLengthUnit] = useState<string>('m');

  const [criticalLoad, setCriticalLoad] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setElasticModulus('29007538');
      setInertia('120.12');
      setLength('196.85');
      setElasticModulusUnit('psi');
      setInertiaUnit('in⁴');
      setLengthUnit('in');
    } else {
      setElasticModulus('200');
      setInertia('0.00005');
      setLength('5');
      setElasticModulusUnit('GPa');
      setInertiaUnit('m⁴');
      setLengthUnit('m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const E = parseFloat(elasticModulus);
    const I = parseFloat(inertia);
    const L = parseFloat(length);

    if (!isNaN(E) && !isNaN(I) && !isNaN(L) && L > 0 && kFactor > 0) {
      // P_cr = (pi^2 * E * I) / (K * L)^2
      const E_Pa = E * (MODULUS_TO_PA[elasticModulusUnit] ?? 1);
      const I_m4 = I * (INERTIA_TO_M4[inertiaUnit] ?? 1);
      const L_m = L * (LENGTH_TO_M[lengthUnit] ?? 1);
      const effectiveLength = kFactor * L_m;
      const load = (Math.PI * Math.PI * E_Pa * I_m4) / (effectiveLength * effectiveLength);
      setCriticalLoad(load);
    } else {
      setCriticalLoad(0);
    }
  }, [elasticModulus, inertia, length, kFactor, elasticModulusUnit, inertiaUnit, lengthUnit]);

  const loadUnit = isImperial ? 'lbf' : 'N';

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
              <Label>{t?.inputs?.elasticModulus || "Young's Modulus (E)"}</Label>
              <div className="flex gap-2">
                <Input type="number" value={elasticModulus} onChange={(e) => setElasticModulus(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.elasticModulus || "Young's Modulus (E)"} unit`} value={elasticModulusUnit} onChange={(e) => setElasticModulusUnit(e.target.value)} className={unitSelectClass}>
                  {MODULUS_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.inertia || 'Area Moment of Inertia (I)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={inertia} onChange={(e) => setInertia(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.inertia || 'Area Moment of Inertia (I)'} unit`} value={inertiaUnit} onChange={(e) => setInertiaUnit(e.target.value)} className={unitSelectClass}>
                  {INERTIA_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.length || 'Unsupported Length (L)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={length} onChange={(e) => setLength(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.length || 'Unsupported Length (L)'} unit`} value={lengthUnit} onChange={(e) => setLengthUnit(e.target.value)} className={unitSelectClass}>
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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
                  {(isImperial ? criticalLoad / 4.44822 : criticalLoad).toExponential(3)} <span className="text-xl font-normal text-muted-foreground ml-1">{loadUnit}</span>
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
