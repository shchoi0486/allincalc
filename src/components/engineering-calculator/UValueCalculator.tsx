import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const UValueCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.uValue;

  const [insideH, setInsideH] = useState<number>(8); // W/(m2K)
  const [outsideH, setOutsideH] = useState<number>(25); // W/(m2K)
  const [layer1K, setLayer1K] = useState<number>(0.04); // W/(mK) insulation
  const [layer1D, setLayer1D] = useState<number>(0.1); // m
  const [layer2K, setLayer2K] = useState<number>(1.5); // W/(mK) concrete
  const [layer2D, setLayer2D] = useState<number>(0.2); // m

  const [totalR, setTotalR] = useState<number>(0);
  const [uValue, setUValue] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (insideH > 0 && outsideH > 0 && layer1K > 0 && layer2K > 0) {
      const rInside = 1 / insideH;
      const rOutside = 1 / outsideH;
      const rLayer1 = layer1D / layer1K;
      const rLayer2 = layer2D / layer2K;

      const rt = rInside + rLayer1 + rLayer2 + rOutside;
      setTotalR(rt);
      setUValue(1 / rt);
    } else {
      setTotalR(0);
      setUValue(0);
    }
  }, [insideH, outsideH, layer1K, layer1D, layer2K, layer2D]);

  const isImperial = unitSystem === 'imperial';
  const hUnit = isImperial ? 'Btu/(h·ft²·°F)' : 'W/(m²·K)';
  const kUnit = isImperial ? 'Btu/(h·ft·°F)' : 'W/(m·K)';
  const dUnit = isImperial ? 'ft' : 'm';
  const rUnit = isImperial ? '(h·ft²·°F)/Btu' : '(m²·K)/W';
  const uUnit = isImperial ? 'Btu/(h·ft²·°F)' : 'W/(m²·K)';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.insideH || 'Inside Conv. (h_i)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={insideH} onChange={(e) => setInsideH(Number(e.target.value))} min={0.1} className="min-w-0" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.outsideH || 'Outside Conv. (h_o)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={outsideH} onChange={(e) => setOutsideH(Number(e.target.value))} min={0.1} className="min-w-0" />
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-muted-foreground">Unit: {hUnit}</p>
              </div>
            </div>

            <div className="pt-2 pb-1 border-t">
              <h4 className="font-medium text-sm text-blue-600">Layer 1</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.layer1K || 'Cond. (k₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={layer1K} onChange={(e) => setLayer1K(Number(e.target.value))} min={0.001} className="min-w-0" />
                </div>
                <p className="text-xs text-muted-foreground">{kUnit}</p>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.layer1D || 'Thickness (d₁)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={layer1D} onChange={(e) => setLayer1D(Number(e.target.value))} min={0} className="min-w-0" />
                </div>
                <p className="text-xs text-muted-foreground">{dUnit}</p>
              </div>
            </div>

            <div className="pt-2 pb-1 border-t">
              <h4 className="font-medium text-sm text-gray-600">Layer 2</h4>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.layer2K || 'Cond. (k₂)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={layer2K} onChange={(e) => setLayer2K(Number(e.target.value))} min={0.001} className="min-w-0" />
                </div>
                <p className="text-xs text-muted-foreground">{kUnit}</p>
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.layer2D || 'Thickness (d₂)'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={layer2D} onChange={(e) => setLayer2D(Number(e.target.value))} min={0} className="min-w-0" />
                </div>
                <p className="text-xs text-muted-foreground">{dUnit}</p>
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
                    <span className="text-3xl font-bold text-red-500">{uValue.toFixed(3)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-2">{uUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex flex-col items-center justify-center">
                  <span className="text-sm font-medium text-muted-foreground mb-1">
                    {t?.results?.totalR || 'Total Thermal Resistance (R_t)'}
                  </span>
                  <div className="text-center">
                    <span className="text-xl font-bold text-primary">{totalR.toFixed(3)}</span>
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
