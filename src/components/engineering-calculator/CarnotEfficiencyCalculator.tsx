import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const CarnotEfficiencyCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.carnotEfficiency;

  const [th, setTh] = useState<number>(1000); // K or R
  const [tc, setTc] = useState<number>(300); // K or R
  const [efficiency, setEfficiency] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (th > 0 && tc >= 0 && th > tc) {
      const eff = 1 - (tc / th);
      setEfficiency(eff * 100); // percentage
    } else {
      setEfficiency(0);
    }
  }, [th, tc]);

  const tempUnit = unitSystem === 'imperial' ? '°R' : 'K';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            <div className="space-y-2">
              <Label>{t?.inputs?.th || 'Hot Reservoir Temp (T_H)'}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={th}
                  onChange={(e) => setTh(Number(e.target.value))}
                  min={0}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">
                  {tempUnit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Must be absolute temperature</p>
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.tc || 'Cold Reservoir Temp (T_C)'}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={tc}
                  onChange={(e) => setTc(Number(e.target.value))}
                  min={0}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">
                  {tempUnit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Must be absolute temperature</p>
            </div>
            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {t?.results?.efficiency || 'Carnot Efficiency (η)'}
                </span>
                <span className="text-4xl font-bold text-primary">
                  {efficiency.toFixed(2)} <span className="text-2xl font-normal text-muted-foreground">%</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Heat Engine Process'}
              </h3>
              <div className="relative h-48 w-full flex flex-col items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <div className="w-full flex flex-col items-center gap-2">
                  {/* Hot Reservoir */}
                  <div className="w-3/4 bg-red-500 text-white text-center py-2 rounded shadow-md font-medium text-sm">
                    Hot Reservoir (T_H: {th}{tempUnit})
                  </div>
                  
                  {/* Engine & Arrows */}
                  <div className="flex items-center w-3/4 justify-center relative py-4">
                    {/* Q_in arrow */}
                    <div className="absolute top-0 flex flex-col items-center -translate-y-2">
                      <div className="w-1 h-6 bg-red-400"></div>
                      <div className="w-3 h-3 border-l-4 border-b-4 border-red-400 transform -rotate-45 -mt-1"></div>
                      <span className="text-xs text-red-500 font-bold ml-8">Q_in</span>
                    </div>

                    {/* Heat Engine */}
                    <div className="w-16 h-16 rounded-full border-4 border-primary flex items-center justify-center bg-white z-10">
                      <span className="text-xs font-bold text-primary">HE</span>
                    </div>

                    {/* W_out arrow */}
                    <div className="absolute right-8 flex items-center translate-x-4">
                      <div className="w-10 h-1 bg-primary"></div>
                      <div className="w-3 h-3 border-t-4 border-r-4 border-primary transform 45deg -ml-1"></div>
                      <span className="text-xs font-bold ml-2">W_out ({(efficiency).toFixed(0)}%)</span>
                    </div>

                    {/* Q_out arrow */}
                    <div className="absolute bottom-0 flex flex-col items-center translate-y-2">
                      <div className="w-1 h-6 bg-blue-400"></div>
                      <div className="w-3 h-3 border-l-4 border-b-4 border-blue-400 transform -rotate-45 -mt-1"></div>
                      <span className="text-xs text-blue-500 font-bold ml-10">Q_out</span>
                    </div>
                  </div>
                  
                  {/* Cold Reservoir */}
                  <div className="w-3/4 bg-blue-500 text-white text-center py-2 rounded shadow-md font-medium text-sm">
                    Cold Reservoir (T_C: {tc}{tempUnit})
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

export default CarnotEfficiencyCalculator;
