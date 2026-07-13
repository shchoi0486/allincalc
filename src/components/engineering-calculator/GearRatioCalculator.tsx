import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const TORQUE_TO_NM: Record<string, number> = {
  'N·m': 1,
  'lbf·ft': 1.35582,
  'kgf·m': 9.80665,
};

const TORQUE_UNITS = ['N·m', 'lbf·ft', 'kgf·m'];

// Build an SVG path for a spur gear with `teeth` trapezoidal teeth.
const buildGearPath = (cx: number, cy: number, teeth: number, rOuter: number, rRoot: number) => {
  const step = (Math.PI * 2) / teeth;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    const profile: Array<[number, number]> = [
      [rRoot, a + step * 0.0],
      [rOuter, a + step * 0.2],
      [rOuter, a + step * 0.4],
      [rRoot, a + step * 0.6],
      [rRoot, a + step * 0.8],
    ];
    for (const [r, ang] of profile) {
      pts.push([cx + r * Math.cos(ang), cy + r * Math.sin(ang)]);
    }
  }
  return (
    'M' +
    pts
      .map((p, i) => (i === 0 ? '' : 'L') + p[0].toFixed(2) + ' ' + p[1].toFixed(2))
      .join(' ') +
    ' Z'
  );
};

const GearTrain = ({
  z1,
  z2,
  speed1,
  speed2,
  running,
  playing,
}: {
  z1: number;
  z2: number;
  speed1: number;
  speed2: number;
  running: boolean;
  playing: boolean;
}) => {
  const pad = 10;
  const rPitchMax = 78;
  const maxZ = Math.max(z1, z2);
  const baseR = rPitchMax / maxZ; // pitch radius per tooth (shared module)
  const rP1 = baseR * z1;
  const rP2 = baseR * z2;
  const add = baseR * 0.95; // addendum
  const ded = baseR * 1.1; // dedendum
  const outer1 = rP1 + add;
  const root1 = rP1 - ded;
  const outer2 = rP2 + add;
  const root2 = rP2 - ded;
  const centerDist = rP1 + rP2;

  const cx1 = pad + outer1;
  const cx2 = cx1 + centerDist;
  const cy = pad + Math.max(outer1, outer2);
  const vbW = cx2 + outer2 + pad;
  const vbH = 2 * Math.max(outer1, outer2) + 2 * pad + 22;

  const dur1 = running && speed1 > 0 ? 60 / speed1 : 0;
  const dur2 = running && speed2 > 0 ? 60 / speed2 : 0;
  const animState = playing ? 'running' : 'paused';

  const gearStyle = (dur: number, reverse: boolean): React.CSSProperties => ({
    transformBox: 'fill-box',
    transformOrigin: 'center',
    animation: dur > 0 ? `spin ${dur}s linear infinite${reverse ? ' reverse' : ''}` : 'none',
    animationPlayState: animState,
  });

  return (
    <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <style>{'@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }'}</style>
      {/* Driving gear */}
      <g style={gearStyle(dur1, false)}>
        <path d={buildGearPath(cx1, cy, z1, outer1, root1)} fill="#3b82f6" />
        <circle cx={cx1} cy={cy} r={Math.max(7, rP1 * 0.26)} fill="#1d4ed8" />
        <circle cx={cx1} cy={cy} r={Math.max(3, rP1 * 0.1)} fill="#bfdbfe" />
      </g>

      {/* Driven gear (rotates opposite direction) */}
      <g style={gearStyle(dur2, true)}>
        <path d={buildGearPath(cx2, cy, z2, outer2, root2)} fill="#22c55e" />
        <circle cx={cx2} cy={cy} r={Math.max(7, rP2 * 0.26)} fill="#15803d" />
        <circle cx={cx2} cy={cy} r={Math.max(3, rP2 * 0.1)} fill="#bbf7d0" />
      </g>

      <text x={cx1} y={cy - rP1 - 6} textAnchor="middle" fontSize="11" fill="currentColor" className="fill-muted-foreground">
        N₁
      </text>
      <text x={cx2} y={cy - rP2 - 6} textAnchor="middle" fontSize="11" fill="currentColor" className="fill-muted-foreground">
        N₂
      </text>
    </svg>
  );
};

const GearRatioCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.gearRatio;

  const isImperial = unitSystem === 'imperial';

  const [teeth1, setTeeth1] = useState<number>(20);
  const [teeth2, setTeeth2] = useState<number>(40);
  const [speed1, setSpeed1] = useState<number>(1000);
  const [torque1, setTorque1] = useState<string>(isImperial ? '37' : '50'); // lbf·ft or N·m
  const [torque1Unit, setTorque1Unit] = useState<string>(isImperial ? 'lbf·ft' : 'N·m');

  const [gearRatio, setGearRatio] = useState<number>(0);
  const [speed2, setSpeed2] = useState<number>(0);
  const [torque2, setTorque2] = useState<number>(0);
  const [calculated, setCalculated] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(true);

  useEffect(() => {
    if (isImperial) {
      setTorque1('37');
      setTorque1Unit('lbf·ft');
    } else {
      setTorque1('50');
      setTorque1Unit('N·m');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const tq = parseFloat(torque1);
    if (teeth1 > 0 && teeth2 > 0) {
      const ratio = teeth2 / teeth1;
      setGearRatio(ratio);
      setSpeed2(speed1 / ratio);
      // Torque scales linearly with ratio regardless of unit
      setTorque2(tq * ratio);
      setCalculated(true);
      setPlaying(true);
    }
  }, [teeth1, teeth2, speed1, torque1]);

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
              <Label>{t?.inputs?.teeth1 || 'Driving Gear Teeth (N₁)'}</Label>
              <Input
                type="number"
                value={teeth1}
                onChange={(e) => setTeeth1(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.teeth2 || 'Driven Gear Teeth (N₂)'}</Label>
              <Input
                type="number"
                value={teeth2}
                onChange={(e) => setTeeth2(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.speed1 || 'Driving Gear Speed (RPM₁)'}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={speed1}
                  onChange={(e) => setSpeed1(Number(e.target.value))}
                  min={0}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">
                  RPM
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.torque1 || 'Driving Gear Torque (τ₁)'}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={torque1}
                  onChange={(e) => setTorque1(e.target.value)}
                  min={0}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label="Driving Gear Torque (τ₁) unit"
                  value={torque1Unit}
                  onChange={(e) => setTorque1Unit(e.target.value)}
                  className={unitSelectClass}
                >
                  {TORQUE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
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

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.gearRatio || 'Gear Ratio (GR)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {gearRatio.toFixed(2)} : 1
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.speed2 || 'Driven Gear Speed (RPM₂)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {speed2.toFixed(2)} <span className="text-sm font-normal text-muted-foreground ml-1">RPM</span>
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.torque2 || 'Driven Gear Torque (τ₂)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {torque2.toFixed(2)} <span className="text-sm font-normal text-muted-foreground ml-1">{torque1Unit}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-muted-foreground">
                  {t?.visualization?.title || 'Gear Train Visualization'}
                </h3>
                {calculated && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-label={playing ? 'Pause animation' : 'Play animation'}
                    className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {playing ? '⏸ ' + (t?.visualization?.pause || 'Pause') : '▶ ' + (t?.visualization?.play || 'Play')}
                  </button>
                )}
              </div>
              <div className="relative w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-2">
                <GearTrain
                  z1={Math.max(1, Math.round(teeth1))}
                  z2={Math.max(1, Math.round(teeth2))}
                  speed1={speed1}
                  speed2={speed2}
                  running={calculated}
                  playing={playing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GearRatioCalculator;
