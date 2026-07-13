import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LENGTH_TO_M: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
};
const LENGTH_TO_FT: Record<string, number> = {
  mm: 0.0032808399,
  cm: 0.032808399,
  m: 3.2808399,
  in: 0.0833333333,
  ft: 1,
};
const LENGTH_TO_MM: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};
const LENGTH_TO_IN: Record<string, number> = {
  mm: 0.0393700787,
  cm: 0.393700787,
  m: 39.3700787,
  in: 1,
  ft: 12,
};
const PRESSURE_TO_MPA: Record<string, number> = {
  MPa: 1,
  psi: 0.0068947572932,
  kPa: 0.001,
  bar: 0.1,
  Pa: 1e-6,
};
const PRESSURE_TO_PSI: Record<string, number> = {
  MPa: 145.037738,
  psi: 1,
  kPa: 0.145037738,
  bar: 14.5037738,
  Pa: 0.000145037738,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const PRESSURE_UNITS = ['MPa', 'psi', 'kPa', 'bar', 'Pa'];

const Api650TankCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.api650Tank;

  const isImperial = unitSystem === 'imperial';

  // API 650 1-foot method inputs
  const [diameter, setDiameter] = useState<string>(isImperial ? '50' : '15'); // ft or m
  const [diameterUnit, setDiameterUnit] = useState<string>(isImperial ? 'ft' : 'm');
  const [height, setHeight] = useState<string>(isImperial ? '32' : '10'); // ft or m
  const [heightUnit, setHeightUnit] = useState<string>(isImperial ? 'ft' : 'm');
  const [specificGravity, setSpecificGravity] = useState<number>(1.0);
  const [allowableStress, setAllowableStress] = useState<string>(isImperial ? '23200' : '160'); // psi or MPa
  const [allowableStressUnit, setAllowableStressUnit] = useState<string>(isImperial ? 'psi' : 'MPa');
  const [hydrotestStress, setHydrotestStress] = useState<string>(isImperial ? '24900' : '171'); // psi or MPa
  const [hydrotestStressUnit, setHydrotestStressUnit] = useState<string>(isImperial ? 'psi' : 'MPa');
  const [corrosionAllowance, setCorrosionAllowance] = useState<string>(isImperial ? '0.125' : '3.0'); // in or mm
  const [corrosionAllowanceUnit, setCorrosionAllowanceUnit] = useState<string>(isImperial ? 'in' : 'mm');

  const [designThickness, setDesignThickness] = useState<number>(0);
  const [testThickness, setTestThickness] = useState<number>(0);
  const [requiredThickness, setRequiredThickness] = useState<number>(0);
  const [thkUnit, setThkUnit] = useState<string>(isImperial ? 'in' : 'mm');

  useEffect(() => {
    if (isImperial) {
      setDiameter('50');
      setDiameterUnit('ft');
      setHeight('32');
      setHeightUnit('ft');
      setAllowableStress('23200');
      setAllowableStressUnit('psi');
      setHydrotestStress('24900');
      setHydrotestStressUnit('psi');
      setCorrosionAllowance('0.125');
      setCorrosionAllowanceUnit('in');
      setThkUnit('in');
    } else {
      setDiameter('15');
      setDiameterUnit('m');
      setHeight('10');
      setHeightUnit('m');
      setAllowableStress('160');
      setAllowableStressUnit('MPa');
      setHydrotestStress('171');
      setHydrotestStressUnit('MPa');
      setCorrosionAllowance('3.0');
      setCorrosionAllowanceUnit('mm');
      setThkUnit('mm');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const D = parseFloat(diameter);
    const H = parseFloat(height);
    const Sd = parseFloat(allowableStress);
    const St = parseFloat(hydrotestStress);
    const CA = parseFloat(corrosionAllowance);
    if (D > 0 && H > 0 && specificGravity > 0 && Sd > 0 && St > 0 && !isNaN(CA)) {
      let td = 0;
      let tt = 0;
      let t_min = 0;

      if (isImperial) {
        const D_ft = D * (LENGTH_TO_FT[diameterUnit] ?? 1);
        const H_ft = H * (LENGTH_TO_FT[heightUnit] ?? 1);
        const Sd_psi = Sd * (PRESSURE_TO_PSI[allowableStressUnit] ?? 1);
        const St_psi = St * (PRESSURE_TO_PSI[hydrotestStressUnit] ?? 1);
        const CA_in = CA * (LENGTH_TO_IN[corrosionAllowanceUnit] ?? 1);

        // Imperial formula API 650
        td = ((2.6 * D_ft * (H_ft - 1) * specificGravity) / Sd_psi) + CA_in;
        tt = ((2.6 * D_ft * (H_ft - 1)) / St_psi);

        // API 650 Nominal thickness minima based on diameter (ft)
        if (D_ft < 50) t_min = 0.1875;
        else if (D_ft <= 120) t_min = 0.25;
        else if (D_ft <= 200) t_min = 0.3125;
        else t_min = 0.375;
        setThkUnit('in');
      } else {
        const D_m = D * (LENGTH_TO_M[diameterUnit] ?? 1);
        const H_m = H * (LENGTH_TO_M[heightUnit] ?? 1);
        const Sd_MPa = Sd * (PRESSURE_TO_MPA[allowableStressUnit] ?? 1);
        const St_MPa = St * (PRESSURE_TO_MPA[hydrotestStressUnit] ?? 1);
        const CA_mm = CA * (LENGTH_TO_MM[corrosionAllowanceUnit] ?? 1);

        // SI formula API 650
        td = ((4.9 * D_m * (H_m - 0.3) * specificGravity) / Sd_MPa) + CA_mm;
        tt = ((4.9 * D_m * (H_m - 0.3)) / St_MPa);

        // API 650 Nominal thickness minima based on diameter (m)
        if (D_m < 15) t_min = 5;
        else if (D_m <= 36) t_min = 6;
        else if (D_m <= 60) t_min = 8;
        else t_min = 10;
        setThkUnit('mm');
      }

      setDesignThickness(td);
      setTestThickness(tt);
      setRequiredThickness(Math.max(td, tt, t_min));
    } else {
      setDesignThickness(0);
      setTestThickness(0);
      setRequiredThickness(0);
    }
  }, [diameter, diameterUnit, height, heightUnit, specificGravity, allowableStress, allowableStressUnit, hydrotestStress, hydrotestStressUnit, corrosionAllowance, corrosionAllowanceUnit, isImperial]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.diameter || 'Tank Diameter (D)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={diameter} onChange={(e) => setDiameter(e.target.value)} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label="Tank Diameter (D) unit" value={diameterUnit} onChange={(e) => setDiameterUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.height || 'Liquid Height (H)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label="Liquid Height (H) unit" value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.specificGravity || 'Specific Gravity (G)'}</Label>
              <Input type="number" value={specificGravity} onChange={(e) => setSpecificGravity(Number(e.target.value))} min={0.1} step={0.01} className="min-w-0" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.allowableStress || 'Allowable Stress (Sd)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={allowableStress} onChange={(e) => setAllowableStress(e.target.value)} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label="Allowable Stress (Sd) unit" value={allowableStressUnit} onChange={(e) => setAllowableStressUnit(e.target.value)} className={unitSelectClass}>
                    {PRESSURE_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Hydrotest Stress (St)</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={hydrotestStress} onChange={(e) => setHydrotestStress(e.target.value)} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label="Hydrotest Stress (St) unit" value={hydrotestStressUnit} onChange={(e) => setHydrotestStressUnit(e.target.value)} className={unitSelectClass}>
                    {PRESSURE_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.corrosionAllowance || 'Corrosion Allowance (CA)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={corrosionAllowance} onChange={(e) => setCorrosionAllowance(e.target.value)} min={0} step={0.01} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label="Corrosion Allowance (CA) unit" value={corrosionAllowanceUnit} onChange={(e) => setCorrosionAllowanceUnit(e.target.value)} className={unitSelectClass}>
                  {LENGTH_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
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
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.designThickness || 'Design Thickness (td)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {designThickness.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">{thkUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.hydrotestThickness || 'Hydrotest Thickness (tt)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {testThickness.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">{thkUnit}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 mt-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    Required Minimum Thickness (Bottom Course)
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {requiredThickness.toFixed(3)} <span className="text-lg font-normal text-muted-foreground">{thkUnit}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    (Max of td, tt, and nominal minimum based on diameter)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Tank Shell Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Ground */}
                  <rect x="20" y="160" width="160" height="10" fill="#94a3b8" />

                  {/* Tank Shell */}
                  <rect x="50" y="40" width="100" height="120" fill="none" stroke="#475569" strokeWidth="4" />

                  {/* Liquid Level */}
                  <rect x="52" y="60" width="96" height="100" fill="#3b82f6" opacity="0.5" />

                  {/* Labels */}
                  <line x1="160" y1="40" x2="160" y2="160" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                  <text x="170" y="105" fill="#64748b" fontSize="12" textAnchor="middle">H</text>

                  <line x1="50" y1="25" x2="150" y2="25" stroke="#64748b" strokeWidth="1" strokeDasharray="4" />
                  <text x="100" y="20" fill="#64748b" fontSize="12" textAnchor="middle">D</text>

                  {/* 1-Foot point indication */}
                  <line x1="40" y1="140" x2="160" y2="140" stroke="#ef4444" strokeWidth="1" strokeDasharray="2" />
                  <text x="35" y="145" fill="#ef4444" fontSize="10" textAnchor="end">1-ft point</text>

                  {/* Highlight bottom course */}
                  <rect x="48" y="130" width="4" height="30" fill="#ef4444" />
                  <rect x="148" y="130" width="4" height="30" fill="#ef4444" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Api650TankCalculator;
