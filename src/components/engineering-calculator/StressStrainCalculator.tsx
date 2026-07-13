import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LOAD_TO_N: Record<string, number> = {
  N: 1,
  lbf: 4.44822,
  kgf: 9.80665,
};

const AREA_TO_M2: Record<string, number> = {
  'm²': 1,
  'mm²': 1e-6,
  'cm²': 1e-4,
  'in²': 0.00064516,
  'ft²': 0.09290304,
};

const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};

const FORCE_UNITS = ['N', 'lbf', 'kgf'];
const AREA_UNITS = ['m²', 'mm²', 'cm²', 'in²', 'ft²'];
const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const StressStrainCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.stressStrain;

  const isImperial = unitSystem === 'imperial';

  const [force, setForce] = useState<string>('10000');
  const [area, setArea] = useState<string>('0.005');
  const [originalLength, setOriginalLength] = useState<string>('2');
  const [changeLength, setChangeLength] = useState<string>('0.001');

  const [forceUnit, setForceUnit] = useState<string>('N');
  const [areaUnit, setAreaUnit] = useState<string>('m²');
  const [originalLengthUnit, setOriginalLengthUnit] = useState<string>('m');
  const [changeLengthUnit, setChangeLengthUnit] = useState<string>('m');

  const [stress, setStress] = useState<number>(0);
  const [strain, setStrain] = useState<number>(0);
  const [youngsModulus, setYoungsModulus] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setForce('2248');
      setArea('7.75');
      setOriginalLength('78.74');
      setChangeLength('0.03937');
      setForceUnit('lbf');
      setAreaUnit('in²');
      setOriginalLengthUnit('in');
      setChangeLengthUnit('in');
    } else {
      setForce('10000');
      setArea('0.005');
      setOriginalLength('2');
      setChangeLength('0.001');
      setForceUnit('N');
      setAreaUnit('m²');
      setOriginalLengthUnit('m');
      setChangeLengthUnit('m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const F = parseFloat(force);
    const A = parseFloat(area);
    const L0 = parseFloat(originalLength);
    const dL = parseFloat(changeLength);

    if (!isNaN(F) && !isNaN(A) && !isNaN(L0) && !isNaN(dL) && A > 0 && L0 > 0) {
      const F_N = F * (LOAD_TO_N[forceUnit] ?? 1);
      const A_m2 = A * (AREA_TO_M2[areaUnit] ?? 1);
      const L0_m = L0 * (LENGTH_TO_M[originalLengthUnit] ?? 1);
      const dL_m = dL * (LENGTH_TO_M[changeLengthUnit] ?? 1);

      const calcStress = F_N / A_m2;
      const calcStrain = dL_m / L0_m;

      setStress(calcStress);
      setStrain(calcStrain);

      if (calcStrain > 0) {
        setYoungsModulus(calcStress / calcStrain);
      } else {
        setYoungsModulus(0);
      }
    }
  }, [force, area, originalLength, changeLength, forceUnit, areaUnit, originalLengthUnit, changeLengthUnit]);

  const stressUnit = isImperial ? 'psi' : 'MPa';
  const displayStress = (v: number) =>
    isImperial ? v * 0.0001450377 : v / 1e6;

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
              <Label>{t?.inputs?.force || 'Applied Force (F)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={force} onChange={(e) => setForce(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.force || 'Applied Force (F)'} unit`} value={forceUnit} onChange={(e) => setForceUnit(e.target.value)} className={unitSelectClass}>
                  {FORCE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.area || 'Cross-sectional Area (A)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={area} onChange={(e) => setArea(e.target.value)} min={0.000001} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.area || 'Cross-sectional Area (A)'} unit`} value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} className={unitSelectClass}>
                  {AREA_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.originalLength || 'Original Length (L₀)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={originalLength} onChange={(e) => setOriginalLength(e.target.value)} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.originalLength || 'Original Length (L₀)'} unit`} value={originalLengthUnit} onChange={(e) => setOriginalLengthUnit(e.target.value)} className={unitSelectClass}>
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.changeLength || 'Change in Length (ΔL)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={changeLength} onChange={(e) => setChangeLength(e.target.value)} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.changeLength || 'Change in Length (ΔL)'} unit`} value={changeLengthUnit} onChange={(e) => setChangeLengthUnit(e.target.value)} className={unitSelectClass}>
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

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.stress || 'Stress (σ)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{displayStress(stress).toExponential(2)}</div>
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
                    <div className="text-xl font-bold text-primary">{displayStress(youngsModulus).toExponential(2)}</div>
                    <div className="text-xs text-muted-foreground">{stressUnit}</div>
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
