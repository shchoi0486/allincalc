import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const BearingLifeCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.bearingLife;

  const [bearingType, setBearingType] = useState<string>('ball');
  const [dynamicLoad, setDynamicLoad] = useState<number>(30000);
  const [equivalentLoad, setEquivalentLoad] = useState<number>(5000);
  const [speed, setSpeed] = useState<number>(1500);

  const [lifeRevolutions, setLifeRevolutions] = useState<number>(0);
  const [lifeHours, setLifeHours] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (dynamicLoad > 0 && equivalentLoad > 0 && speed > 0) {
      const p = bearingType === 'ball' ? 3 : 10 / 3;
      
      // L10 in million revolutions
      const l10 = Math.pow(dynamicLoad / equivalentLoad, p);
      
      // L10h in hours
      const l10h = (1000000 / (60 * speed)) * l10;

      setLifeRevolutions(l10);
      setLifeHours(l10h);
    } else {
      setLifeRevolutions(0);
      setLifeHours(0);
    }
  }, [bearingType, dynamicLoad, equivalentLoad, speed]);

  const loadUnit = unitSystem === 'imperial' ? 'lbf' : 'N';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.bearingType || 'Bearing Type'}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={bearingType}
                onChange={(e) => setBearingType(e.target.value)}
              >
                <option value="ball">Ball Bearing (p = 3)</option>
                <option value="roller">Roller Bearing (p = 10/3)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.dynamicLoad || 'Dynamic Load Rating (C)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={dynamicLoad} onChange={(e) => setDynamicLoad(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{loadUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.equivalentLoad || 'Equivalent Dynamic Load (P)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={equivalentLoad} onChange={(e) => setEquivalentLoad(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{loadUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.speed || 'Rotational Speed (N)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={speed} onChange={(e) => setSpeed(Number(e.target.value))} min={1} className="min-w-0" />
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
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="grid gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.lifeRevolutions || 'Life (L10)'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{lifeRevolutions.toFixed(2)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">× 10⁶ revs</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.lifeHours || 'Life (L10h)'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{lifeHours.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">hours</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Bearing Life vs Load Curve'}
              </h3>
              <div className="relative h-48 w-full flex items-end overflow-hidden bg-white dark:bg-gray-900 rounded-lg border p-2">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Axes */}
                  <line x1="40" y1="170" x2="380" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="170" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  
                  <text x="380" y="190" fill="#64748b" fontSize="12" textAnchor="end">Load (P)</text>
                  <text x="15" y="30" fill="#64748b" fontSize="12" transform="rotate(-90 25,30)">Life (L10)</text>

                  {/* Exponential Curve: L10 ~ 1/P^p */}
                  <path 
                    d="M 60 20 Q 80 150, 360 160" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                  />

                  {/* Current Operating Point */}
                  <circle cx="160" cy="115" r="6" fill="#ef4444" />
                  <line x1="160" y1="170" x2="160" y2="115" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="40" y1="115" x2="160" y2="115" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  
                  <text x="160" y="185" fill="#ef4444" fontSize="10" textAnchor="middle">Current P</text>
                  <text x="35" y="118" fill="#ef4444" fontSize="10" textAnchor="end">L10</text>

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BearingLifeCalculator;
