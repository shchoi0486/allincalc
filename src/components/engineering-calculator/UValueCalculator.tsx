'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const UValueCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.uValue;
  const isImperial = unitSystem === 'imperial';

  const [insideH, setInsideH] = useState('8'); // W/(m2K)
  const [insideHUnit, setInsideHUnit] = useState('W/m²·K');
  const [outsideH, setOutsideH] = useState('25'); // W/(m2K)
  const [outsideHUnit, setOutsideHUnit] = useState('W/m²·K');
  const [layer1K, setLayer1K] = useState('0.04'); // W/(mK)
  const [layer1KUnit, setLayer1KUnit] = useState('W/m·K');
  const [layer1D, setLayer1D] = useState('0.1'); // m
  const [layer1DUnit, setLayer1DUnit] = useState('m');
  const [layer2K, setLayer2K] = useState('1.5'); // W/(mK)
  const [layer2KUnit, setLayer2KUnit] = useState('W/m·K');
  const [layer2D, setLayer2D] = useState('0.2'); // m
  const [layer2DUnit, setLayer2DUnit] = useState('m');

  const [totalR, setTotalR] = useState(0);
  const [uValue, setUValue] = useState(0);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setInsideH('1.409');
      setInsideHUnit('BTU/hr·ft²·°F');
      setOutsideH('4.403');
      setOutsideHUnit('BTU/hr·ft²·°F');
      setLayer1K('0.0231');
      setLayer1KUnit('BTU/hr·ft·°F');
      setLayer1D('0.328');
      setLayer1DUnit('ft');
      setLayer2K('0.867');
      setLayer2KUnit('BTU/hr·ft·°F');
      setLayer2D('0.656');
      setLayer2DUnit('ft');
    } else {
      setInsideH('8');
      setInsideHUnit('W/m²·K');
      setOutsideH('25');
      setOutsideHUnit('W/m²·K');
      setLayer1K('0.04');
      setLayer1KUnit('W/m·K');
      setLayer1D('0.1');
      setLayer1DUnit('m');
      setLayer2K('1.5');
      setLayer2KUnit('W/m·K');
      setLayer2D('0.2');
      setLayer2DUnit('m');
    }
  }, [isImperial]);

  // Conversion maps to SI base
  const H_TO_SI: Record<string, number> = { 'W/m²·K': 1, 'BTU/hr·ft²·°F': 0.17611 };
  const K_TO_SI: Record<string, number> = { 'W/m·K': 1, 'BTU/hr·ft·°F': 0.57779 };
  const D_TO_M: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 };

  const H_UNITS = ['W/m²·K', 'BTU/hr·ft²·°F'];
  const K_UNITS = ['W/m·K', 'BTU/hr·ft·°F'];
  const D_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

  const handleCalculate = useCallback(() => {
    const hi = parseFloat(insideH) * (H_TO_SI[insideHUnit] ?? 1);
    const ho = parseFloat(outsideH) * (H_TO_SI[outsideHUnit] ?? 1);
    const k1 = parseFloat(layer1K) * (K_TO_SI[layer1KUnit] ?? 1);
    const d1 = parseFloat(layer1D) * (D_TO_M[layer1DUnit] ?? 1);
    const k2 = parseFloat(layer2K) * (K_TO_SI[layer2KUnit] ?? 1);
    const d2 = parseFloat(layer2D) * (D_TO_M[layer2DUnit] ?? 1);

    if (hi > 0 && ho > 0 && k1 > 0 && k2 > 0) {
      const rInside = 1 / hi;
      const rOutside = 1 / ho;
      const rLayer1 = d1 / k1;
      const rLayer2 = d2 / k2;

      const rt = rInside + rLayer1 + rLayer2 + rOutside; // (m²·K)/W
      setTotalR(rt);
      setUValue(1 / rt); // W/(m²·K)
    } else {
      setTotalR(0);
      setUValue(0);
    }
  }, [insideH, insideHUnit, outsideH, outsideHUnit, layer1K, layer1KUnit, layer1D, layer1DUnit, layer2K, layer2KUnit, layer2D, layer2DUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  const uDisplay = uValue * (isImperial ? 0.17611 : 1);
  const rDisplay = totalR * (isImperial ? 5.67826 : 1);
  const uUnit = isImperial ? 'BTU/hr·ft²·°F' : 'W/m²·K';
  const rUnit = isImperial ? '(h·ft²·°F)/Btu' : '(m²·K)/W';

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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.insideH || 'Inside Conv. (h_i)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={insideH} onChange={(e) => setInsideH(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.insideH || 'Inside Conv. (h_i)'} unit`}
                    value={insideHUnit}
                    onChange={(e) => setInsideHUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {H_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.outsideH || 'Outside Conv. (h_o)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={outsideH} onChange={(e) => setOutsideH(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.outsideH || 'Outside Conv. (h_o)'} unit`}
                    value={outsideHUnit}
                    onChange={(e) => setOutsideHUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {H_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 pb-1 border-t">
              <h4 className="font-medium text-sm text-blue-600">Layer 1</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.layer1K || 'Cond. (k₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={layer1K} onChange={(e) => setLayer1K(e.target.value)} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.layer1K || 'Cond. (k₁)'} unit`}
                    value={layer1KUnit}
                    onChange={(e) => setLayer1KUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {K_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.layer1D || 'Thickness (d₁)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={layer1D} onChange={(e) => setLayer1D(e.target.value)} min={0} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.layer1D || 'Thickness (d₁)'} unit`}
                    value={layer1DUnit}
                    onChange={(e) => setLayer1DUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {D_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-2 pb-1 border-t">
              <h4 className="font-medium text-sm text-gray-600">Layer 2</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.layer2K || 'Cond. (k₂)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={layer2K} onChange={(e) => setLayer2K(e.target.value)} min={0.001} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.layer2K || 'Cond. (k₂)'} unit`}
                    value={layer2KUnit}
                    onChange={(e) => setLayer2KUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {K_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.layer2D || 'Thickness (d₂)'}</Label>
                <div className="flex min-w-0">
                  <Input type="number" value={layer2D} onChange={(e) => setLayer2D(e.target.value)} min={0} className="min-w-0 flex-1 rounded-r-none" />
                  <select
                    aria-label={`${t?.inputs?.layer2D || 'Thickness (d₂)'} unit`}
                    value={layer2DUnit}
                    onChange={(e) => setLayer2DUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {D_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
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
                  <span className="text-sm font-medium text-muted-foreground mb-1">
                    {t?.results?.uValue || 'U-Value'}
                  </span>
                  <div className="text-center">
                    <span className="text-3xl font-bold text-red-500">{uDisplay.toFixed(3)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">{uUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-1">
                    {t?.results?.totalR || 'Total Thermal Resistance (R_t)'}
                  </span>
                  <div className="text-center">
                    <span className="text-xl font-bold text-primary">{rDisplay.toFixed(3)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">{rUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Wall Thermal Profile'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Inside Air */}
                  <rect x="0" y="20" width="80" height="160" fill="#fecaca" opacity="0.3" />
                  <text x="40" y="100" fill="#ef4444" fontSize="14" textAnchor="middle">Inside</text>
                  <text x="40" y="120" fill="#ef4444" fontSize="10" textAnchor="middle">h_i</text>

                  {/* Layer 1 */}
                  <rect x="80" y="20" width="100" height="160" fill="#bfdbfe" stroke="#3b82f6" strokeWidth="2" />
                  <text x="130" y="100" fill="#1d4ed8" fontSize="14" textAnchor="middle">Layer 1</text>
                  <text x="130" y="120" fill="#1d4ed8" fontSize="10" textAnchor="middle">k₁, d₁</text>

                  {/* Layer 2 */}
                  <rect x="180" y="20" width="120" height="160" fill="#e2e8f0" stroke="#64748b" strokeWidth="2" />
                  <text x="240" y="100" fill="#475569" fontSize="14" textAnchor="middle">Layer 2</text>
                  <text x="240" y="120" fill="#475569" fontSize="10" textAnchor="middle">k₂, d₂</text>

                  {/* Outside Air */}
                  <rect x="300" y="20" width="100" height="160" fill="#bae6fd" opacity="0.3" />
                  <text x="350" y="100" fill="#3b82f6" fontSize="14" textAnchor="middle">Outside</text>
                  <text x="350" y="120" fill="#3b82f6" fontSize="10" textAnchor="middle">h_o</text>

                  {/* Heat Flux Arrow */}
                  <path d="M 30 185 L 370 185" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,5" />
                  <polygon points="365,180 375,185 365,190" fill="#ef4444" />
                  <text x="200" y="175" fill="#ef4444" fontSize="12" textAnchor="middle" fontWeight="bold">Heat Flux (Q)</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UValueCalculator;
