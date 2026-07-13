import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  cm: 0.01,
  ft: 0.3048,
  in: 0.0254,
};
const AREA_TO_M2: Record<string, number> = {
  'm²': 1,
  'cm²': 0.0001,
  'ft²': 0.09290304,
  'in²': 0.00064516,
};
const M_TO_LENGTH: Record<string, number> = {
  m: 1,
  cm: 100,
  ft: 3.280839895,
  in: 39.37007874,
};
const M_PER_S_TO: Record<string, number> = {
  'm/s': 1,
  'ft/s': 3.280839895,
};
const M3_PER_S_TO: Record<string, number> = {
  'm³/s': 1,
  'ft³/s (cfs)': 35.314666721,
};
const LENGTH_UNITS = ['m', 'cm', 'ft', 'in'];
const AREA_UNITS = ['m²', 'cm²', 'ft²', 'in²'];
const SLOPE_UNITS = ['m/m', 'ft/ft'];
// Slope is a dimensionless ratio: m/m and ft/ft are numerically identical.
const SLOPE_FACTOR: Record<string, number> = {
  'm/m': 1,
  'ft/ft': 1,
};

const ManningsEquationCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.manningsEquation;

  const isImperial = unitSystem === 'imperial';

  const [roughness, setRoughness] = useState<number>(0.013); // concrete
  const [area, setArea] = useState<number>(2); // cross-sectional area
  const [wettedPerimeter, setWettedPerimeter] = useState<number>(4); // length
  const [slope, setSlope] = useState<number>(0.001); // m/m or ft/ft

  const [areaUnit, setAreaUnit] = useState<string>('m²');
  const [wettedPerimeterUnit, setWettedPerimeterUnit] = useState<string>('m');
  const [slopeUnit, setSlopeUnit] = useState<string>('m/m');

  const [hydraulicRadius, setHydraulicRadius] = useState<number>(0);
  const [velocity, setVelocity] = useState<number>(0);
  const [discharge, setDischarge] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setArea(2);
      setAreaUnit('ft²');
      setWettedPerimeter(4);
      setWettedPerimeterUnit('ft');
      setSlope(0.001);
      setSlopeUnit('ft/ft');
    } else {
      setArea(2);
      setAreaUnit('m²');
      setWettedPerimeter(4);
      setWettedPerimeterUnit('m');
      setSlope(0.001);
      setSlopeUnit('m/m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (area > 0 && wettedPerimeter > 0 && roughness > 0 && slope >= 0) {
      const area_m2 = area * (AREA_TO_M2[areaUnit] ?? 1);
      const P_m = wettedPerimeter * (LENGTH_TO_M[wettedPerimeterUnit] ?? 1);
      const R_m = area_m2 / P_m;

      const slopeVal = slope * (SLOPE_FACTOR[slopeUnit] ?? 1);

      // Manning's equation in SI base (k = 1.0), lengths in metres.
      const k = 1.0;
      const V_m_s = (k / roughness) * Math.pow(R_m, 2 / 3) * Math.pow(slopeVal, 1 / 2);
      const Q_m3_s = V_m_s * area_m2;

      const resultLengthUnit = isImperial ? 'ft' : 'm';
      const resultVelUnit = isImperial ? 'ft/s' : 'm/s';
      const resultDiscUnit = isImperial ? 'ft³/s (cfs)' : 'm³/s';

      setHydraulicRadius(R_m * (M_TO_LENGTH[resultLengthUnit] ?? 1));
      setVelocity(V_m_s * (M_PER_S_TO[resultVelUnit] ?? 1));
      setDischarge(Q_m3_s * (M3_PER_S_TO[resultDiscUnit] ?? 1));
    } else {
      setHydraulicRadius(0);
      setVelocity(0);
      setDischarge(0);
    }
  }, [roughness, area, wettedPerimeter, slope, areaUnit, wettedPerimeterUnit, slopeUnit, isImperial]);

  const lengthUnit = isImperial ? 'ft' : 'm';
  const velocityUnit = isImperial ? 'ft/s' : 'm/s';
  const dischargeUnit = isImperial ? 'ft³/s (cfs)' : 'm³/s';

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
              <Label>{t?.inputs?.roughness || "Manning's Roughness (n)"}</Label>
              <Input type="number" value={roughness} onChange={(e) => setRoughness(Number(e.target.value))} min={0.001} step={0.001} />
              <p className="text-xs text-muted-foreground mt-1">e.g., Concrete ~0.013, Earth channel ~0.022</p>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.area || 'Cross-sectional Area (A)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={area} onChange={(e) => setArea(Number(e.target.value))} min={0.01} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.area || 'Cross-sectional Area (A)'} unit`}
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {AREA_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.wettedPerimeter || 'Wetted Perimeter (P)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={wettedPerimeter} onChange={(e) => setWettedPerimeter(Number(e.target.value))} min={0.01} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.wettedPerimeter || 'Wetted Perimeter (P)'} unit`}
                  value={wettedPerimeterUnit}
                  onChange={(e) => setWettedPerimeterUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.slope || 'Channel Slope (S)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={slope} onChange={(e) => setSlope(Number(e.target.value))} min={0} step={0.001} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label={`${t?.inputs?.slope || 'Channel Slope (S)'} unit`}
                  value={slopeUnit}
                  onChange={(e) => setSlopeUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {SLOPE_UNITS.map((u) => (
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
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.hydraulicRadius || 'Hydraulic Radius (R)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-primary">{hydraulicRadius.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{lengthUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.velocity || 'Flow Velocity (V)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{velocity.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{velocityUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.discharge || 'Discharge (Q)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{discharge.toFixed(3)}</div>
                    <div className="text-xs text-muted-foreground">{dischargeUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Open Channel Flow Cross-section'}
              </h3>
              <div className="relative h-40 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 150" className="w-full h-full">
                  {/* Channel Base */}
                  <path d="M 50 20 L 100 130 L 300 130 L 350 20" fill="none" stroke="#64748b" strokeWidth="8" />

                  {/* Water Fill */}
                  <path d="M 80 80 L 320 80 L 300 130 L 100 130 Z" fill="#3b82f6" opacity="0.6" />

                  {/* Water Surface Line */}
                  <line x1="70" y1="80" x2="330" y2="80" stroke="#2563eb" strokeWidth="2" strokeDasharray="5,5" />
                  <polygon points="200,80 195,70 205,70" fill="#2563eb" />

                  {/* Wetted Perimeter Highlight */}
                  <path d="M 80 80 L 100 130 L 300 130 L 320 80" fill="none" stroke="#ef4444" strokeWidth="4" />
                  <text x="200" y="145" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Wetted Perimeter (P)</text>

                  {/* Area Label */}
                  <text x="200" y="110" fill="#1e3a8a" fontSize="16" textAnchor="middle" fontWeight="bold">Area (A)</text>

                  {/* Flow arrow */}
                  <circle cx="200" cy="105" r="15" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
                  <circle cx="200" cy="105" r="3" fill="#ffffff" />
                  <text x="225" y="110" fill="#ffffff" fontSize="12" opacity="0.8">Flow (V)</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManningsEquationCalculator;
