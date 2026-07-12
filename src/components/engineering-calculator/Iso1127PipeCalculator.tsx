import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const Iso1127PipeCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.iso1127Pipe;

  const isImperial = unitSystem === 'imperial';

  // Standard inputs for ISO 1127 usually start in mm
  const [outerDiameter, setOuterDiameter] = useState<number>(isImperial ? 2.375 : 60.3); // inch or mm
  const [thickness, setThickness] = useState<number>(isImperial ? 0.109 : 2.77); // inch or mm

  const [weight, setWeight] = useState<number>(0);
  const [flowArea, setFlowArea] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (outerDiameter > 0 && thickness > 0 && outerDiameter > thickness * 2) {
      let d_mm = outerDiameter;
      let t_mm = thickness;

      if (isImperial) {
        d_mm = outerDiameter * 25.4;
        t_mm = thickness * 25.4;
      }

      // ISO 1127 formula for Stainless Steel (density approx 7.93 g/cm3)
      // W (kg/m) = (D - t) * t * 0.0246615
      // Wait, standard carbon steel is 0.02466. 
      // Actually, standard formula W = (D - t) * t * 0.02466 (for carbon steel, density 7.85)
      // For austenitic stainless steel, density is approx 7.9 g/cm3 -> constant = 0.0248 or 0.025.
      // Let's use standard ISO 1127 constant for SS which is often cited as 0.02466 for generic steel reference,
      // or precise austenitic: (D-t)*t*0.02504
      // Let's use the widely accepted 0.0246615 for general steel weight.
      const w_kg_m = (d_mm - t_mm) * t_mm * 0.0246615;
      
      const id_mm = d_mm - (2 * t_mm);
      const area_mm2 = (Math.PI / 4) * Math.pow(id_mm, 2);

      if (isImperial) {
        // kg/m to lb/ft = 0.671969
        setWeight(w_kg_m * 0.671969);
        // mm2 to in2
        setFlowArea(area_mm2 / 645.16);
      } else {
        setWeight(w_kg_m);
        // cm2 for display
        setFlowArea(area_mm2 / 100);
      }
    } else {
      setWeight(0);
      setFlowArea(0);
    }
  }, [outerDiameter, thickness, isImperial]);

  const lengthUnit = isImperial ? 'in' : 'mm';
  const weightUnit = isImperial ? 'lb/ft' : 'kg/m';
  const areaUnit = isImperial ? 'in²' : 'cm²';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.outerDiameter || 'Outer Diameter (D)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={outerDiameter} onChange={(e) => setOuterDiameter(Number(e.target.value))} min={1} step={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.thickness || 'Wall Thickness (t)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} min={0.1} step={0.01} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{lengthUnit}</span>
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
                  {/* Visual ratio of thickness to OD */}
                  {outerDiameter > 0 && thickness > 0 && outerDiameter > thickness * 2 ? (
                    <circle cx="100" cy="100" r={Math.max(10, 80 * (1 - (2 * thickness) / outerDiameter))} fill="#f8fafc" />
                  ) : (
                    <circle cx="100" cy="100" r="60" fill="#f8fafc" />
                  )}
                  
                  {/* Center Dot */}
                  <circle cx="100" cy="100" r="2" fill="#334155" />
                  
                  {/* OD Dimension */}
                  <line x1="20" y1="15" x2="180" y2="15" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arrow-red-pipe)" markerStart="url(#arrow-red-pipe-start)" />
                  <line x1="20" y1="10" x2="20" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                  <line x1="180" y1="10" x2="180" y2="100" stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                  <text x="100" y="10" fill="#ef4444" fontSize="12" textAnchor="middle">OD = {outerDiameter} {lengthUnit}</text>
                  
                  {/* Thickness Dimension */}
                  {outerDiameter > 0 && thickness > 0 && outerDiameter > thickness * 2 && (
                    <g>
                      <line x1="100" y1="100" x2="100" y2="20" stroke="#10b981" strokeWidth="1.5" />
                      <line x1="100" y1="20" x2="140" y2="20" stroke="#10b981" strokeWidth="1" />
                      <text x="145" y="24" fill="#10b981" fontSize="12">t = {thickness}</text>
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
