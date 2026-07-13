import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LOAD_TO_N: Record<string, number> = {
  N: 1,
  lbf: 4.44822,
  kgf: 9.80665,
};

const LOAD_UNITS = ['N', 'lbf', 'kgf'];

const BearingLifeCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.bearingLife;

  const isImperial = unitSystem === 'imperial';

  const [bearingType, setBearingType] = useState<string>('ball');
  const [dynamicLoad, setDynamicLoad] = useState<number>(30000);
  const [equivalentLoad, setEquivalentLoad] = useState<number>(5000);
  const [speed, setSpeed] = useState<number>(1500);

  const [dynamicLoadUnit, setDynamicLoadUnit] = useState<string>('N');
  const [equivalentLoadUnit, setEquivalentLoadUnit] = useState<string>('N');

  const [lifeRevolutions, setLifeRevolutions] = useState<number>(0);
  const [lifeHours, setLifeHours] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setDynamicLoad(6744);
      setEquivalentLoad(1124);
      setDynamicLoadUnit('lbf');
      setEquivalentLoadUnit('lbf');
    } else {
      setDynamicLoad(30000);
      setEquivalentLoad(5000);
      setDynamicLoadUnit('N');
      setEquivalentLoadUnit('N');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    if (dynamicLoad > 0 && equivalentLoad > 0 && speed > 0) {
      const p = bearingType === 'ball' ? 3 : 10 / 3;

      // Convert loads to SI base (N) for a consistent ratio
      const C = dynamicLoad * (LOAD_TO_N[dynamicLoadUnit] ?? 1);
      const P = equivalentLoad * (LOAD_TO_N[equivalentLoadUnit] ?? 1);

      // L10 in million revolutions
      const l10 = Math.pow(C / P, p);

      // L10h in hours
      const l10h = (1000000 / (60 * speed)) * l10;

      setLifeRevolutions(l10);
      setLifeHours(l10h);
    } else {
      setLifeRevolutions(0);
      setLifeHours(0);
    }
  }, [bearingType, dynamicLoad, equivalentLoad, speed, dynamicLoadUnit, equivalentLoadUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  // Dynamic L10h (hours) vs Load curve on log-log scale: L10h = 1e6/(60·N) · (C/P)^p
  const pExp = bearingType === 'ball' ? 3 : 10 / 3;
  let curvePath = '';
  let ptX = 0;
  let ptY = 0;
  let curL10h = 0;
  let hasPoint = false;
  const gridH: { y: number; label: string }[] = [];
  const gridV: number[] = [];
  if (dynamicLoad > 0 && equivalentLoad > 0 && speed > 0) {
    const Pmin = Math.max(1, equivalentLoad * 0.15);
    const Pmax = equivalentLoad * 4;
    const l10h = (pp: number) => (1000000 / (60 * speed)) * Math.pow(dynamicLoad / pp, pExp);
    const logPmin = Math.log10(Pmin);
    const logPmax = Math.log10(Pmax);
    const logLmax = Math.log10(l10h(Pmin));
    const logLmin = Math.log10(l10h(Pmax));
    const xOf = (pp: number) => 45 + ((Math.log10(pp) - logPmin) / (logPmax - logPmin)) * 335;
    const yOf = (L: number) => 175 - ((Math.log10(L) - logLmin) / (logLmax - logLmin)) * 160;
    const parts: string[] = [];
    for (let i = 0; i <= 64; i++) {
      const pp = Math.pow(10, logPmin + (i / 64) * (logPmax - logPmin));
      parts.push(`${i === 0 ? 'M' : 'L'} ${xOf(pp).toFixed(1)} ${yOf(l10h(pp)).toFixed(1)}`);
    }
    curvePath = parts.join(' ');
    ptX = xOf(equivalentLoad);
    ptY = yOf(l10h(equivalentLoad));
    curL10h = l10h(equivalentLoad);
    hasPoint = true;
    for (let d = Math.ceil(logLmin); d <= Math.floor(logLmax); d++) {
      const L = Math.pow(10, d);
      gridH.push({ y: yOf(L), label: L < 1 ? L.toPrecision(1) : `${L}` });
    }
    for (let d = Math.ceil(logPmin); d <= Math.floor(logPmax); d++) {
      gridV.push(xOf(Math.pow(10, d)));
    }
  }

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
                <Input type="number" value={dynamicLoad} onChange={(e) => setDynamicLoad(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.dynamicLoad || 'Dynamic Load Rating (C)'} unit`} value={dynamicLoadUnit} onChange={(e) => setDynamicLoadUnit(e.target.value)} className={unitSelectClass}>
                  {LOAD_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.equivalentLoad || 'Equivalent Dynamic Load (P)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={equivalentLoad} onChange={(e) => setEquivalentLoad(Number(e.target.value))} min={1} className="min-w-0 flex-1 rounded-r-none" />
                <select aria-label={`${t?.inputs?.equivalentLoad || 'Equivalent Dynamic Load (P)'} unit`} value={equivalentLoadUnit} onChange={(e) => setEquivalentLoadUnit(e.target.value)} className={unitSelectClass}>
                  {LOAD_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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
                  {/* Gridlines (log decades) */}
                  {gridH.map((g, i) => (
                    <g key={`h${i}`}>
                      <line x1="40" y1={g.y} x2="380" y2={g.y} stroke="#e2e8f0" strokeWidth="1" />
                      <text x="38" y={g.y + 3} fill="#94a3b8" fontSize="9" textAnchor="end">{g.label}</text>
                    </g>
                  ))}
                  {gridV.map((x, i) => (
                    <line key={`v${i}`} x1={x} y1="20" x2={x} y2="170" stroke="#e2e8f0" strokeWidth="1" />
                  ))}

                  {/* Axes */}
                  <line x1="40" y1="170" x2="380" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="40" y1="170" x2="40" y2="20" stroke="#94a3b8" strokeWidth="2" />

                  <text x="380" y="192" fill="#64748b" fontSize="11" textAnchor="end">Load P ({equivalentLoadUnit})</text>
                  <text x="13" y="95" fill="#64748b" fontSize="11" textAnchor="middle" transform="rotate(-90 13 95)">Life (L10h, hours)</text>

                  {/* Dynamic L10 vs P curve on log-log scale: L10 = (C/P)^p */}
                  <path d={curvePath} fill="none" stroke="#3b82f6" strokeWidth="3" />

                  {/* Current operating point (updates with inputs) */}
                  {hasPoint && (
                    <>
                      <line x1={ptX} y1={170} x2={ptX} y2={ptY} stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1={40} y1={ptY} x2={ptX} y2={ptY} stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                      <circle cx={ptX} cy={ptY} r="6" fill="#ef4444" />
                      <text x={Math.min(ptX + 8, 300)} y={Math.max(ptY - 8, 14)} fill="#ef4444" fontSize="10" textAnchor="start">
                        P={equivalentLoad} · L10h={curL10h >= 1000 ? curL10h.toExponential(1) : Math.round(curL10h).toLocaleString()}
                      </text>
                    </>
                  )}
                </svg>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t?.visualization?.caption || 'Blue curve: life drops sharply as load rises (L10 = (C/P)^p). Red dot: your current operating point.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BearingLifeCalculator;
