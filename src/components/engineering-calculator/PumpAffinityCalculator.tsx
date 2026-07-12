import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const PumpAffinityCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.pumpAffinity;

  const [speed1, setSpeed1] = useState<number>(1750);
  const [flow1, setFlow1] = useState<number>(500);
  const [head1, setHead1] = useState<number>(100);
  const [power1, setPower1] = useState<number>(20);
  const [speed2, setSpeed2] = useState<number>(2000);

  const [flow2, setFlow2] = useState<number>(0);
  const [head2, setHead2] = useState<number>(0);
  const [power2, setPower2] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (speed1 > 0 && speed2 > 0) {
      const ratio = speed2 / speed1;
      setFlow2(flow1 * ratio);
      setHead2(head1 * Math.pow(ratio, 2));
      setPower2(power1 * Math.pow(ratio, 3));
    } else {
      setFlow2(0);
      setHead2(0);
      setPower2(0);
    }
  }, [speed1, flow1, head1, power1, speed2]);

  const isImperial = unitSystem === 'imperial';
  const flowUnit = isImperial ? 'gpm' : 'm³/h';
  const headUnit = isImperial ? 'ft' : 'm';
  const powerUnit = isImperial ? 'hp' : 'kW';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="pt-2 pb-1">
              <h4 className="font-medium text-sm text-blue-600">Initial State (1)</h4>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed1 || 'Initial Speed (N₁)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed1} onChange={(e) => setSpeed1(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">RPM</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.flow1 || 'Flow (Q₁)'}</Label>
                <Input type="number" value={flow1} onChange={(e) => setFlow1(Number(e.target.value))} min={0} className="min-w-0" />
                <p className="text-[10px] text-muted-foreground text-center">{flowUnit}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.head1 || 'Head (H₁)'}</Label>
                <Input type="number" value={head1} onChange={(e) => setHead1(Number(e.target.value))} min={0} className="min-w-0" />
                <p className="text-[10px] text-muted-foreground text-center">{headUnit}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">{t?.inputs?.power1 || 'Power (P₁)'}</Label>
                <Input type="number" value={power1} onChange={(e) => setPower1(Number(e.target.value))} min={0} className="min-w-0" />
                <p className="text-[10px] text-muted-foreground text-center">{powerUnit}</p>
              </div>
            </div>

            <div className="pt-4 pb-1 border-t">
              <h4 className="font-medium text-sm text-green-600">Target State (2)</h4>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed2 || 'Target Speed (N₂)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed2} onChange={(e) => setSpeed2(Number(e.target.value))} min={1} className="min-w-0 border-green-500" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">RPM</span>
              </div>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results (State 2)</h3>
              
              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.flow2 || 'New Flow (Q₂)'}</span>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded">∝ N</span>
                    <div className="text-xl font-bold text-primary">{flow2.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground w-8 text-left">{flowUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.head2 || 'New Head (H₂)'}</span>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-orange-100 text-orange-700 rounded">∝ N²</span>
                    <div className="text-xl font-bold text-primary">{head2.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground w-8 text-left">{headUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.power2 || 'New Power (P₂)'}</span>
                  <div className="text-right flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">∝ N³</span>
                    <div className="text-xl font-bold text-primary">{power2.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground w-8 text-left">{powerUnit}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Performance Change Comparison'}
              </h3>
              <div className="relative h-48 w-full flex items-end justify-around overflow-hidden bg-white dark:bg-gray-900 rounded-lg border p-4 pt-10">
                
                {/* Flow Bar */}
                <div className="flex flex-col items-center justify-end h-full w-16 group">
                  <span className="text-[10px] text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{flow2.toFixed(0)}</span>
                  <div className="w-8 bg-blue-500 rounded-t" style={{ height: `${Math.min(100, (flow2 / Math.max(flow1, flow2)) * 100)}%` }}></div>
                  <div className="w-8 bg-blue-300 opacity-50 absolute rounded-t border border-blue-500 border-dashed" style={{ height: `${Math.min(100, (flow1 / Math.max(flow1, flow2)) * 100)}%` }}></div>
                  <span className="text-xs font-bold mt-2">Q</span>
                </div>

                {/* Head Bar */}
                <div className="flex flex-col items-center justify-end h-full w-16 group">
                  <span className="text-[10px] text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{head2.toFixed(0)}</span>
                  <div className="w-8 bg-orange-500 rounded-t" style={{ height: `${Math.min(100, (head2 / Math.max(head1, head2)) * 100)}%` }}></div>
                  <div className="w-8 bg-orange-300 opacity-50 absolute rounded-t border border-orange-500 border-dashed" style={{ height: `${Math.min(100, (head1 / Math.max(head1, head2)) * 100)}%` }}></div>
                  <span className="text-xs font-bold mt-2">H</span>
                </div>

                {/* Power Bar */}
                <div className="flex flex-col items-center justify-end h-full w-16 group">
                  <span className="text-[10px] text-muted-foreground mb-1 opacity-0 group-hover:opacity-100 transition-opacity">{power2.toFixed(0)}</span>
                  <div className="w-8 bg-red-500 rounded-t" style={{ height: `${Math.min(100, (power2 / Math.max(power1, power2)) * 100)}%` }}></div>
                  <div className="w-8 bg-red-300 opacity-50 absolute rounded-t border border-red-500 border-dashed" style={{ height: `${Math.min(100, (power1 / Math.max(power1, power2)) * 100)}%` }}></div>
                  <span className="text-xs font-bold mt-2">P</span>
                </div>

                {/* Legend */}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 border border-dashed border-gray-500 bg-gray-200 opacity-50"></div>
                    <span className="text-[10px] text-muted-foreground">State 1</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-500"></div>
                    <span className="text-[10px] text-muted-foreground">State 2</span>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PumpAffinityCalculator;
