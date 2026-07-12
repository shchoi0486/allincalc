import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const CoolingTowerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.coolingTower;

  const [hotWater, setHotWater] = useState<number>(35); // Celsius or F
  const [coldWater, setColdWater] = useState<number>(25); // Celsius or F
  const [wetBulb, setWetBulb] = useState<number>(20); // Celsius or F

  const [range, setRange] = useState<number>(0);
  const [approach, setApproach] = useState<number>(0);
  const [effectiveness, setEffectiveness] = useState<number>(0);

  const isImperial = unitSystem === 'imperial';
  const tempUnit = isImperial ? '°F' : '°C';

  const handleCalculate = useCallback(() => {
    if (hotWater > coldWater && coldWater >= wetBulb) {
      const r = hotWater - coldWater;
      const a = coldWater - wetBulb;
      const e = (r / (r + a)) * 100;

      setRange(r);
      setApproach(a);
      setEffectiveness(e);
    } else {
      setRange(0);
      setApproach(0);
      setEffectiveness(0);
    }
  }, [hotWater, coldWater, wetBulb]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.hotWater || 'Hot Water Temp In (T_hw)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={hotWater} onChange={(e) => setHotWater(Number(e.target.value))} className="min-w-0 border-red-300" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{tempUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.coldWater || 'Cold Water Temp Out (T_cw)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={coldWater} onChange={(e) => setColdWater(Number(e.target.value))} className="min-w-0 border-blue-300" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{tempUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.wetBulb || 'Air Wet Bulb Temp (T_wb)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={wetBulb} onChange={(e) => setWetBulb(Number(e.target.value))} className="min-w-0 border-green-300" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{tempUnit}</span>
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
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.range || 'Cooling Range'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-red-500">{range.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Δ{tempUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.approach || 'Approach'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{approach.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">Δ{tempUnit}</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.effectiveness || 'Effectiveness (η)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-600">{effectiveness.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Cooling Tower Temperature Profile'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Base Lines */}
                  <line x1="150" y1="20" x2="150" y2="180" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="5,5" />
                  
                  {/* Temps */}
                  {/* Hot Water */}
                  <circle cx="150" cy="40" r="6" fill="#ef4444" />
                  <text x="135" y="45" fill="#ef4444" fontSize="14" textAnchor="end" fontWeight="bold">T_hw ({hotWater}°)</text>
                  <path d="M 150 40 L 250 40" stroke="#ef4444" strokeWidth="2" />
                  
                  {/* Cold Water */}
                  <circle cx="150" cy="120" r="6" fill="#3b82f6" />
                  <text x="135" y="125" fill="#3b82f6" fontSize="14" textAnchor="end" fontWeight="bold">T_cw ({coldWater}°)</text>
                  <path d="M 150 120 L 250 120" stroke="#3b82f6" strokeWidth="2" />

                  {/* Wet Bulb */}
                  <circle cx="150" cy="170" r="6" fill="#10b981" />
                  <text x="135" y="175" fill="#10b981" fontSize="14" textAnchor="end" fontWeight="bold">T_wb ({wetBulb}°)</text>
                  <path d="M 150 170 L 250 170" stroke="#10b981" strokeWidth="2" />

                  {/* Ranges and Approach Brackets */}
                  <path d="M 260 40 L 270 40 L 270 120 L 260 120" fill="none" stroke="#ef4444" strokeWidth="2" />
                  <text x="280" y="85" fill="#ef4444" fontSize="12" fontWeight="bold">Range</text>
                  
                  <path d="M 260 120 L 270 120 L 270 170 L 260 170" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <text x="280" y="150" fill="#3b82f6" fontSize="12" fontWeight="bold">Approach</text>

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoolingTowerCalculator;
