import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const CycloneEfficiencyCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.cycloneEfficiency;

  const isImperial = unitSystem === 'imperial';

  // Lapple standard inputs
  const [diameter, setDiameter] = useState<number>(isImperial ? 20 : 0.5); // in or m
  const [inletWidth, setInletWidth] = useState<number>(isImperial ? 5 : 0.125); // in or m
  const [inletVelocity, setInletVelocity] = useState<number>(isImperial ? 50 : 15); // ft/s or m/s
  const [gasViscosity, setGasViscosity] = useState<number>(isImperial ? 1.2e-5 : 1.8e-5); // lb/(ft*s) or kg/(m*s)
  const [particleDensity, setParticleDensity] = useState<number>(isImperial ? 62.4 : 1000); // lb/ft3 or kg/m3
  const [gasDensity, setGasDensity] = useState<number>(isImperial ? 0.075 : 1.2); // lb/ft3 or kg/m3

  const [cutSize, setCutSize] = useState<number>(0);

  const computeCutSize = useCallback((): number => {
    if (!(diameter > 0 && inletWidth > 0 && inletVelocity > 0 && gasViscosity > 0 && particleDensity > 0)) {
      return 0;
    }
    let W = inletWidth;
    let Vi = inletVelocity;
    let mu = gasViscosity;
    let rhop = particleDensity;
    let rhog = gasDensity;

    if (isImperial) {
      W = inletWidth * 0.0254; // in to m
      Vi = inletVelocity * 0.3048; // ft/s to m/s
      mu = gasViscosity * 1.48816; // lb/(ft*s) to kg/(m*s)
      rhop = particleDensity * 16.0185; // lb/ft3 to kg/m3
      rhog = gasDensity * 16.0185; // lb/ft3 to kg/m3
    }

    const Ne = 5; // effective turns for standard Lapple
    const densityDiff = rhop - rhog;
    if (densityDiff <= 0) return 0;

    const d50_m = Math.sqrt((9 * mu * W) / (2 * Math.PI * Ne * Vi * densityDiff));
    return d50_m * 1e6; // micrometers
  }, [diameter, inletWidth, inletVelocity, gasViscosity, particleDensity, gasDensity, isImperial]);

  const handleCalculate = useCallback(() => {
    setCutSize(computeCutSize());
  }, [computeCutSize]);

  const lenUnit = isImperial ? 'in' : 'm';
  const velUnit = isImperial ? 'ft/s' : 'm/s';
  const viscUnit = isImperial ? 'lb/(ft·s)' : 'kg/(m·s)';
  const denUnit = isImperial ? 'lb/ft³' : 'kg/m³';

  // Dynamic grade-efficiency curve: η(dp) = 1 / (1 + (d50/dp)^2)
  const plotX0 = 62, plotX1 = 300, plotY0 = 160, plotY1 = 24;
  const plotW = plotX1 - plotX0;
  const plotH = plotY0 - plotY1;
  const xMax = cutSize > 0 ? cutSize * 3 : 1;
  const efficiencyPoints = (() => {
    const pts: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const dp = (xMax / steps) * i;
      const eta = dp > 0 && cutSize > 0 ? 1 / (1 + Math.pow(cutSize / dp, 2)) : 0;
      const x = plotX0 + (dp / xMax) * plotW;
      const y = plotY0 - eta * plotH;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  })();
  const d50X = plotX0 + (cutSize / xMax) * plotW; // = plotX0 + plotW/3
  const d50Y = plotY0 - 0.5 * plotH;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.diameter || 'Cyclone Diameter (D)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={diameter} onChange={(e) => setDiameter(Number(e.target.value))} min={0.01} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.inletWidth || 'Inlet Width (W)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={inletWidth} onChange={(e) => setInletWidth(Number(e.target.value))} min={0.01} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-12 text-sm">{lenUnit}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.inletVelocity || 'Inlet Velocity (Vi)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={inletVelocity} onChange={(e) => setInletVelocity(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{velUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.particleDensity || 'Particle Density'}</Label>
                <Input type="number" value={particleDensity} onChange={(e) => setParticleDensity(Number(e.target.value))} min={0.1} className="min-w-0" />
                <p className="text-[10px] text-muted-foreground">{denUnit}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.gasDensity || 'Gas Density'}</Label>
                <Input type="number" value={gasDensity} onChange={(e) => setGasDensity(Number(e.target.value))} min={0.001} className="min-w-0" />
                <p className="text-[10px] text-muted-foreground">{denUnit}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.gasViscosity || 'Gas Viscosity (μ)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={gasViscosity} onChange={(e) => setGasViscosity(Number(e.target.value))} min={0} step={0.000001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-2 rounded-md border shrink-0 w-24 text-xs">{viscUnit}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
            >
              {locale === 'ko' ? '계산하기' : 'Calculate'}
            </button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div id="calculator-results" className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-purple-200 shadow-sm flex flex-col items-center justify-center bg-purple-50 dark:bg-purple-900/20">
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">
                  {t?.results?.cutSize || 'Cut Size (d50)'}
                </span>
                <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">
                  {cutSize.toFixed(2)} <span className="text-xl font-normal text-muted-foreground">µm</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Particles larger than {cutSize.toFixed(1)} µm are collected with &gt;50% efficiency.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Cyclone Cut Size Chart'}
              </h3>
              <div className="relative h-56 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 320 210" className="w-full h-full">
                  {/* Axes */}
                  <line x1={plotX0} y1={plotY0} x2={plotX1} y2={plotY0} stroke="#64748b" strokeWidth="2" />
                  <line x1={plotX0} y1={plotY0} x2={plotX0} y2={plotY1} stroke="#64748b" strokeWidth="2" />

                  {/* Y-axis ticks */}
                  <text x={plotX0 - 6} y={plotY1 + 4} fill="#94a3b8" fontSize="9" textAnchor="end">100</text>
                  <text x={plotX0 - 6} y={plotY0 + 3} fill="#94a3b8" fontSize="9" textAnchor="end">0</text>

                  <text x={(plotX0 + plotX1) / 2} y="200" fill="#64748b" fontSize="12" textAnchor="middle">Particle Size (dp)</text>
                  <text x="16" y={(plotY0 + plotY1) / 2} fill="#64748b" fontSize="12" textAnchor="middle" transform={`rotate(-90 16,${(plotY0 + plotY1) / 2})`}>Efficiency (%)</text>

                  {cutSize > 0 ? (
                    <>
                      {/* Dynamic grade-efficiency curve */}
                      <polyline points={efficiencyPoints} fill="none" stroke="#a855f7" strokeWidth="3" />

                      {/* d50 marker lines */}
                      <line x1={plotX0} y1={d50Y} x2={d50X} y2={d50Y} stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                      <line x1={d50X} y1={d50Y} x2={d50X} y2={plotY0} stroke="#ef4444" strokeWidth="1" strokeDasharray="4" />
                      <circle cx={d50X} cy={d50Y} r="4" fill="#ef4444" />

                      <text x={plotX0 - 6} y={d50Y + 4} fill="#ef4444" fontSize="9" textAnchor="end">50</text>
                      <text x={d50X} y={plotY0 + 15} fill="#ef4444" fontSize="10" textAnchor="middle" fontWeight="bold">
                        d50 = {cutSize.toFixed(1)}µm
                      </text>
                    </>
                  ) : (
                    <text x={(plotX0 + plotX1) / 2} y={(plotY0 + plotY1) / 2} fill="#94a3b8" fontSize="11" textAnchor="middle">
                      {locale === 'ko' ? '계산하기를 눌러 결과를 확인하세요' : 'Press Calculate to see results'}
                    </text>
                  )}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CycloneEfficiencyCalculator;
