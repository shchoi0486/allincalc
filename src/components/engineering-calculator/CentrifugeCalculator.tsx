import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const LENGTH_TO_CM: Record<string, number> = {
  mm: 0.1,
  cm: 1,
  m: 100,
  in: 2.54,
  ft: 30.48,
};

const RADIUS_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const CentrifugeCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.centrifuge;

  const isImperial = unitSystem === 'imperial';

  const [radius, setRadius] = useState<string>(isImperial ? '4' : '10'); // cm or in
  const [radiusUnit, setRadiusUnit] = useState<string>(isImperial ? 'in' : 'cm');
  const [speed, setSpeed] = useState<number>(3000); // RPM

  const [rcf, setRcf] = useState<number>(0);
  const [angularVelocity, setAngularVelocity] = useState<number>(0);
  const [calculated, setCalculated] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (isImperial) {
      setRadius('4');
      setRadiusUnit('in');
    } else {
      setRadius('10');
      setRadiusUnit('cm');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const r = parseFloat(radius);
    if (r > 0 && speed > 0) {
      const r_cm = r * (LENGTH_TO_CM[radiusUnit] ?? 1);

      // RCF = 1.118 * 10^-5 * r(cm) * N(RPM)^2
      const calcRcf = 1.118e-5 * r_cm * Math.pow(speed, 2);
      setRcf(calcRcf);

      // Angular velocity ω = 2 * π * N / 60
      const calcOmega = (2 * Math.PI * speed) / 60;
      setAngularVelocity(calcOmega);
      setCalculated(true);
      setPlaying(true);
    } else {
      setRcf(0);
      setAngularVelocity(0);
    }
  }, [radius, radiusUnit, speed]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">Inputs</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.radius || 'Rotor Radius (r)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={radius} onChange={(e) => setRadius(e.target.value)} min={0.1} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Rotor Radius (r) unit"
                  value={radiusUnit}
                  onChange={(e) => setRadiusUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {RADIUS_UNITS.map((u) => (
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

              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    {t?.results?.rcf || 'Relative Centrifugal Force (RCF)'}
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {rcf.toFixed(0)} <span className="text-lg font-normal text-muted-foreground">× g</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.angularVelocity || 'Angular Velocity (ω)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{angularVelocity.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">rad/s</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t?.visualization?.title || 'Centrifugal Force Diagram'}
                </h3>
                {calculated && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? 'Pause animation' : 'Play animation'}
                    className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {playing ? '⏸ ' + (locale === 'ko' ? '일시정지' : 'Pause') : '▶ ' + (locale === 'ko' ? '재생' : 'Play')}
                  </button>
                )}
              </div>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
                  {/* Center axis */}
                  <line x1="150" y1="20" x2="150" y2="180" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4" />
                  <circle cx="150" cy="100" r="5" fill="#475569" />

                  {/* Rotor Arm */}
                  <g style={{ animation: calculated && playing && speed > 0 ? `spin ${Math.max(0.4, 60 / speed)}s linear infinite` : 'none', transformOrigin: '150px 100px' }}>
                    <line x1="150" y1="100" x2="250" y2="100" stroke="#cbd5e1" strokeWidth="6" />
                    {/* Tube */}
                    <rect x="240" y="85" width="20" height="30" rx="3" fill="#3b82f6" opacity="0.8" />
                    <path d="M 260 100 L 280 100" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrow-red)" />
                  </g>

                  {/* Labels */}
                  <text x="200" y="90" fill="#64748b" fontSize="12" textAnchor="middle">r = {radius} {radiusUnit}</text>
                  <text x="285" y="105" fill="#ef4444" fontSize="12" fontWeight="bold">RCF</text>

                  {/* Rotation indication */}
                  <path d="M 120 70 A 40 40 0 0 1 180 70" fill="none" stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)" />
                  <text x="150" y="55" fill="#3b82f6" fontSize="12" textAnchor="middle" fontWeight="bold">ω</text>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CentrifugeCalculator;
