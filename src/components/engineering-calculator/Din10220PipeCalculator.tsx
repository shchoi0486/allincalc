import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LENGTH_TO_MM: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};
const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const Din10220PipeCalculator = () => {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.din10220Pipe;

  const isImperial = unitSystem === 'imperial';

  const [outerDiameter, setOuterDiameter] = useState<number>(60.3);
  const [thickness, setThickness] = useState<number>(3.91);
  const [outerDiameterUnit, setOuterDiameterUnit] = useState<string>('mm');
  const [thicknessUnit, setThicknessUnit] = useState<string>('mm');
  const [materialYield, setMaterialYield] = useState<number>(235); // MPa (St 37.0 / S235)
  const [safetyFactor, setSafetyFactor] = useState<number>(1.5);

  const [burstPressure, setBurstPressure] = useState<number>(0);
  const [allowablePressure, setAllowablePressure] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setOuterDiameter(2.375);
      setThickness(0.154);
      setOuterDiameterUnit('in');
      setThicknessUnit('in');
    } else {
      setOuterDiameter(60.3);
      setThickness(3.91);
      setOuterDiameterUnit('mm');
      setThicknessUnit('mm');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (outerDiameter > 0 && thickness > 0 && outerDiameter > thickness * 2 && materialYield > 0 && safetyFactor > 0) {
      const d_mm = outerDiameter * (LENGTH_TO_MM[outerDiameterUnit] ?? 1);
      const t_mm = thickness * (LENGTH_TO_MM[thicknessUnit] ?? 1);

      // Burst Pressure (Barlow's formula): P = 2 * S * t / D
      // P in MPa, S in MPa, t and D in mm
      const pb_mpa = (2 * materialYield * t_mm) / d_mm;
      const p_allow_mpa = pb_mpa / safetyFactor;

      if (isImperial) {
        // MPa to psi = 145.038
        setBurstPressure(pb_mpa * 145.038);
        setAllowablePressure(p_allow_mpa * 145.038);
      } else {
        // Display in bar (1 MPa = 10 bar)
        setBurstPressure(pb_mpa * 10);
        setAllowablePressure(p_allow_mpa * 10);
      }
    } else {
      setBurstPressure(0);
      setAllowablePressure(0);
    }
  }, [outerDiameter, thickness, outerDiameterUnit, thicknessUnit, materialYield, safetyFactor, isImperial]);

  const pressureUnit = isImperial ? 'psi' : 'bar';

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h3 className="font-semibold text-lg border-b border-primary/20 pb-2 flex-1">
                Inputs
              </h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.outerDiameter || 'Outer Diameter (D)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={outerDiameter} onChange={(e) => setOuterDiameter(Number(e.target.value))} min={1} step={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.outerDiameter || 'Outer Diameter (D)'} unit`}
                  value={outerDiameterUnit}
                  onChange={(e) => setOuterDiameterUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.thickness || 'Wall Thickness (t)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} min={0.1} step={0.01} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.thickness || 'Wall Thickness (t)'} unit`}
                  value={thicknessUnit}
                  onChange={(e) => setThicknessUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.materialGrade || 'DIN Material Grade'}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={materialYield}
                onChange={(e) => setMaterialYield(Number(e.target.value))}
              >
                <option value={235}>St 37.0 / S235 (Yield: 235 MPa)</option>
                <option value={275}>St 44.0 / S275 (Yield: 275 MPa)</option>
                <option value={355}>St 52.0 / S355 (Yield: 355 MPa)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.safetyFactor || 'Safety Factor (FS)'}</Label>
              <Input type="number" value={safetyFactor} onChange={(e) => setSafetyFactor(Number(e.target.value))} min={1} step={0.1} />
            </div>
            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{dict?.common?.calculate || 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-200 shadow-sm flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/20">
                  <span className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    {t?.results?.burstPressure || 'Burst Pressure (P_b)'}
                  </span>
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {burstPressure.toFixed(0)} <span className="text-lg font-normal text-muted-foreground">{pressureUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-green-200 shadow-sm flex justify-between items-center bg-green-50 dark:bg-green-900/10">
                  <span className="text-sm font-medium text-green-800 dark:text-green-300">
                    {t?.results?.allowablePressure || 'Allowable Pressure (P_allow)'}
                  </span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">{allowablePressure.toFixed(0)}</div>
                    <div className="text-xs text-muted-foreground">{pressureUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Pressure Capacity'}
              </h3>
              <div className="relative h-24 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 100" className="w-full h-full">
                  {/* Gauge Background */}
                  <rect x="20" y="40" width="260" height="20" rx="10" fill="#e2e8f0" />

                  {/* Allowable Zone */}
                  <rect x="20" y="40" width={burstPressure > 0 ? (260 / safetyFactor) : 0} height="20" rx="10" fill="#22c55e" opacity="0.8" />

                  {/* Warning Zone (up to burst) */}
                  {burstPressure > 0 && (
                    <rect x={20 + (260 / safetyFactor)} y="40" width={260 - (260 / safetyFactor)} height="20" fill="#ef4444" opacity="0.8" />
                  )}

                  {/* Labels */}
                  <text x="20" y="30" fill="#64748b" fontSize="10" textAnchor="start">0</text>
                  {burstPressure > 0 && (
                    <>
                      <text x={20 + (260 / safetyFactor)} y="30" fill="#15803d" fontSize="10" textAnchor="middle" fontWeight="bold">Allowable</text>
                      <text x="280" y="30" fill="#b91c1c" fontSize="10" textAnchor="end" fontWeight="bold">Burst</text>
                    </>
                  )}

                  {/* Indicators */}
                  <polygon points={`${20 + (260 / safetyFactor)},60 ${15 + (260 / safetyFactor)},70 ${25 + (260 / safetyFactor)},70`} fill="#15803d" />
                  <polygon points="280,60 275,70 285,70" fill="#b91c1c" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Din10220PipeCalculator;
