'use client';

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

const Iso1127PipeCalculator = () => {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.iso1127Pipe;
  const isImperial = unitSystem === 'imperial';

  const [outerDiameter, setOuterDiameter] = useState<number>(60.3);
  const [thickness, setThickness] = useState<number>(2.77);
  const [outerDiameterUnit, setOuterDiameterUnit] = useState<string>('mm');
  const [thicknessUnit, setThicknessUnit] = useState<string>('mm');

  const [weight, setWeight] = useState<number>(0);
  const [flowArea, setFlowArea] = useState<number>(0);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setOuterDiameter(2.375);
      setThickness(0.109);
      setOuterDiameterUnit('in');
      setThicknessUnit('in');
    } else {
      setOuterDiameter(60.3);
      setThickness(2.77);
      setOuterDiameterUnit('mm');
      setThicknessUnit('mm');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const odMm = outerDiameter * (LENGTH_TO_MM[outerDiameterUnit] ?? 1);
    const tMm = thickness * (LENGTH_TO_MM[thicknessUnit] ?? 1);
    if (odMm > 0 && tMm > 0 && odMm > tMm * 2) {
      // ISO 1127 stainless steel weight constant (kg/m per mm)
      const w_kg_m = (odMm - tMm) * tMm * 0.0246615;
      const id_mm = odMm - 2 * tMm;
      const area_mm2 = (Math.PI / 4) * Math.pow(id_mm, 2);

      if (isImperial) {
        setWeight(w_kg_m * 0.671969); // kg/m -> lb/ft
        setFlowArea(area_mm2 / 645.16); // mm2 -> in2
      } else {
        setWeight(w_kg_m);
        setFlowArea(area_mm2 / 100); // mm2 -> cm2
      }
    } else {
      setWeight(0);
      setFlowArea(0);
    }
  }, [outerDiameter, thickness, outerDiameterUnit, thicknessUnit, isImperial]);

  const weightUnit = isImperial ? 'lb/ft' : 'kg/m';
  const areaUnit = isImperial ? 'in²' : 'cm²';

  // Visualization values (convert to a common mm base so the ratio is unit-safe)
  const odMm = outerDiameter * (LENGTH_TO_MM[outerDiameterUnit] ?? 1);
  const tMm = thickness * (LENGTH_TO_MM[thicknessUnit] ?? 1);
  const validPipe = odMm > 0 && tMm > 0 && odMm > tMm * 2;
  const visInnerR = validPipe ? Math.max(10, 80 * (1 - (2 * tMm) / odMm)) : 60;

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
                <Input
                  type="number"
                  value={outerDiameter}
                  onChange={(e) => setOuterDiameter(Number(e.target.value))}
                  min={1}
                  step={0.1}
                  className="min-w-0 flex-1 rounded-r-none"
                />
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
                <Input
                  type="number"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  min={0.1}
                  step={0.01}
                  className="min-w-0 flex-1 rounded-r-none"
                />
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
            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{dict?.common?.calculate || 'Calculate'}</button>
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
                    {t?.results?.weight || 'Unit Weight (W)'}
                  </span>
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                    {weight.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">{weightUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.flowArea || 'Internal Flow Area'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{flowArea.toFixed(2)}</div>
                    <div className="text-xs text-muted-foreground">{areaUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Tube Cross-Section'}
              </h3>
              <div className="relative h-48 w-full bg-slate-50 dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Outer Circle */}
                  <circle cx="100" cy="100" r="80" fill="#94a3b8" />

                  {/* Inner Circle (Hole) */}
                  {validPipe ? (
                    <circle cx="100" cy="100" r={visInnerR} fill="#f8fafc" />
                  ) : (
                    <circle cx="100" cy="100" r="60" fill="#f8fafc" />
                  )}

                  {/* Center Dot */}
                  <circle cx="100" cy="100" r="2" fill="#334155" />

                  {/* OD Dimension */}
                  <line x1="20" y1="15" x2="180" y2="15" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-pipe)" markerStart="url(#arrow-red-pipe-start)" />
                  <line x1="20" y1="10" x2="20" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                  <line x1="180" y1="10" x2="180" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                  <text x="100" y="10" fill="#ef4444" fontSize="12" textAnchor="middle">OD = {outerDiameter} {outerDiameterUnit}</text>

                  {/* Thickness Dimension (bottom wall bracket, clear of OD label) */}
                  {validPipe && (
                    <g>
                      <line x1="100" y1="180" x2="100" y2={100 + visInnerR} stroke="#10b981" strokeWidth="2" />
                      <line x1="92" y1="180" x2="108" y2="180" stroke="#10b981" strokeWidth="1" />
                      <line x1="92" y1={100 + visInnerR} x2="108" y2={100 + visInnerR} stroke="#10b981" strokeWidth="1" />
                      <text x="112" y="184" fill="#10b981" fontSize="11">t = {thickness} {thicknessUnit}</text>
                    </g>
                  )}

                  <defs>
                    <marker id="arrow-red-pipe" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                    <marker id="arrow-red-pipe-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#ef4444" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Iso1127PipeCalculator;
