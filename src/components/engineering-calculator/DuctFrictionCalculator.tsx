import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to the base units the empirical ASHRAE formula expects
// (CFM for flow, inches for length)
const FLOW_TO_CFM: Record<string, number> = {
  'CFM': 1,
  'm³/h': 2118.88 / 3600, // 0.588578
  'L/s': 2.11888,
  'ft³/s': 60,
};
const LENGTH_TO_IN: Record<string, number> = {
  mm: 1 / 25.4,
  cm: 0.393701,
  m: 39.3701,
  in: 1,
  ft: 12,
};

const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
const FLOW_UNITS = ['CFM', 'm³/h', 'L/s', 'ft³/s'];

const DuctFrictionCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.ductFriction;

  const isImperial = unitSystem === 'imperial';

  const [flowRate, setFlowRate] = useState<number>(isImperial ? 1000 : 1700);
  const [width, setWidth] = useState<number>(isImperial ? 12 : 300);
  const [height, setHeight] = useState<number>(isImperial ? 12 : 300);
  const [roughness, setRoughness] = useState<number>(isImperial ? 0.0003 : 0.09);

  // Per-input unit selection
  const [flowUnit, setFlowUnit] = useState(isImperial ? 'CFM' : 'm³/h');
  const [widthUnit, setWidthUnit] = useState(isImperial ? 'in' : 'mm');
  const [heightUnit, setHeightUnit] = useState(isImperial ? 'in' : 'mm');
  const [roughnessUnit, setRoughnessUnit] = useState(isImperial ? 'ft' : 'mm');

  const [velocity, setVelocity] = useState<number>(0);
  const [hydraulicDiameter, setHydraulicDiameter] = useState<number>(0);
  const [frictionLoss, setFrictionLoss] = useState<number>(0);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setFlowRate(1000);
      setWidth(12);
      setHeight(12);
      setRoughness(0.0003);
      setFlowUnit('CFM');
      setWidthUnit('in');
      setHeightUnit('in');
      setRoughnessUnit('ft');
    } else {
      setFlowRate(1700);
      setWidth(300);
      setHeight(300);
      setRoughness(0.09);
      setFlowUnit('m³/h');
      setWidthUnit('mm');
      setHeightUnit('mm');
      setRoughnessUnit('mm');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (flowRate > 0 && width > 0 && height > 0 && roughness > 0) {
      // Convert each input to its base unit via the unit maps
      const Q_cfm = flowRate * (FLOW_TO_CFM[flowUnit] ?? 1);
      const W_in = width * (LENGTH_TO_IN[widthUnit] ?? 1);
      const H_in = height * (LENGTH_TO_IN[heightUnit] ?? 1);

      // ASHRAE empirical formula (works in CFM / inches)
      const A_sqft = (W_in * H_in) / 144;
      const V_fpm = Q_cfm / A_sqft; // ft/min
      const De_in = (1.3 * Math.pow(W_in * H_in, 0.625)) / Math.pow(W_in + H_in, 0.25);
      const dp = (0.109136 * Math.pow(V_fpm / 1000, 1.9)) / Math.pow(De_in, 1.22); // in.wg/100ft

      if (isImperial) {
        setVelocity(V_fpm); // ft/min
        setHydraulicDiameter(De_in); // in
        setFrictionLoss(dp); // in.wg/100ft
      } else {
        setVelocity(V_fpm * 0.00508); // m/s
        setHydraulicDiameter(De_in * 25.4); // mm
        setFrictionLoss(dp * 0.8166); // Pa/m
      }
    } else {
      setVelocity(0);
      setHydraulicDiameter(0);
      setFrictionLoss(0);
    }
  }, [flowRate, width, height, roughness, flowUnit, widthUnit, heightUnit, roughnessUnit, isImperial]);

  const lenUnit = isImperial ? 'in' : 'mm';
  const velUnit = isImperial ? 'ft/min' : 'm/s';
  const frictionUnit = isImperial ? 'in.wg/100ft' : 'Pa/m';

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

            <div className="space-y-2">
              <Label>{t?.inputs?.flowRate || 'Airflow Rate (Q)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={flowRate} onChange={(e) => setFlowRate(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={t?.inputs?.flowRate || 'Airflow Rate (Q)'} value={flowUnit} onChange={(e) => setFlowUnit(e.target.value)} className={unitSelectClass}>
                  {FLOW_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.width || 'Duct Width (W)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.width || 'Duct Width (W)'} value={widthUnit} onChange={(e) => setWidthUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.height || 'Duct Height (H)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                  <select aria-label={t?.inputs?.height || 'Duct Height (H)'} value={heightUnit} onChange={(e) => setHeightUnit(e.target.value)} className={unitSelectClass}>
                    {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.roughness || 'Absolute Roughness (ε)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={roughness} onChange={(e) => setRoughness(Number(e.target.value))} min={0.00001} step={0.0001} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={t?.inputs?.roughness || 'Absolute Roughness (ε)'} value={roughnessUnit} onChange={(e) => setRoughnessUnit(e.target.value)} className={unitSelectClass}>
                  {LENGTH_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Galvanized Steel: ~0.0003 ft (0.09 mm)</p>
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
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-teal-200 shadow-sm flex flex-col items-center justify-center bg-teal-50 dark:bg-teal-900/20">
                  <span className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-1">
                    {t?.results?.frictionLoss || 'Friction Loss per length'}
                  </span>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {frictionLoss.toFixed(3)} <span className="text-sm font-normal text-muted-foreground">{frictionUnit}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.velocity || 'Air Velocity (v)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {velocity.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{velUnit}</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.hydraulicDiameter || 'Equiv. Diameter (De)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {hydraulicDiameter.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{lenUnit}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Duct Cross Section'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Duct */}
                  <rect x="50" y="50" width="100" height="100" fill="none" stroke="#64748b" strokeWidth="4" />

                  {/* Airflow arrows */}
                  <g className="opacity-50" fill="#3b82f6">
                    <circle cx="100" cy="100" r="15" fill="#3b82f6" opacity="0.3" />
                    <circle cx="100" cy="100" r="5" />
                    <circle cx="70" cy="70" r="3" />
                    <circle cx="130" cy="70" r="3" />
                    <circle cx="70" cy="130" r="3" />
                    <circle cx="130" cy="130" r="3" />
                  </g>

                  {/* Labels */}
                  <line x1="50" y1="35" x2="150" y2="35" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="50" y1="30" x2="50" y2="40" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="150" y1="30" x2="150" y2="40" stroke="#94a3b8" strokeWidth="1" />
                  <text x="100" y="25" fill="#64748b" fontSize="12" textAnchor="middle">W</text>

                  <line x1="35" y1="50" x2="35" y2="150" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2" />
                  <line x1="30" y1="50" x2="40" y2="50" stroke="#94a3b8" strokeWidth="1" />
                  <line x1="30" y1="150" x2="40" y2="150" stroke="#94a3b8" strokeWidth="1" />
                  <text x="25" y="105" fill="#64748b" fontSize="12" textAnchor="middle" transform="rotate(-90 25,105)">H</text>

                  <text x="100" y="180" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">Flow: Out of screen</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DuctFrictionCalculator;
