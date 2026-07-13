import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const VOLTAGE_TO_V: Record<string, number> = {
  V: 1,
  kV: 1000,
  mV: 0.001,
};

const CURRENT_TO_A: Record<string, number> = {
  A: 1,
  mA: 0.001,
};

const VOLTAGE_UNITS = ['V', 'kV', 'mV'];
const CURRENT_UNITS = ['A', 'mA'];

const AcPowerCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.acPower;

  const isImperial = unitSystem === 'imperial';

  const [voltage, setVoltage] = useState<string>('220'); // V
  const [voltageUnit, setVoltageUnit] = useState<string>('V');
  const [current, setCurrent] = useState<string>('10'); // A
  const [currentUnit, setCurrentUnit] = useState<string>('A');
  const [phaseAngle, setPhaseAngle] = useState<number>(30); // degrees
  const [systemPhase, setSystemPhase] = useState<string>('single'); // single or three

  const [realPower, setRealPower] = useState<number>(0);
  const [reactivePower, setReactivePower] = useState<number>(0);
  const [apparentPower, setApparentPower] = useState<number>(0);
  const [powerFactor, setPowerFactor] = useState<number>(0);

  useEffect(() => {
    if (isImperial) {
      setVoltage('220');
      setVoltageUnit('V');
      setCurrent('10');
      setCurrentUnit('A');
    } else {
      setVoltage('220');
      setVoltageUnit('V');
      setCurrent('10');
      setCurrentUnit('A');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const v = parseFloat(voltage);
    const c = parseFloat(current);
    if (v > 0 && c > 0) {
      const v_V = v * (VOLTAGE_TO_V[voltageUnit] ?? 1);
      const c_A = c * (CURRENT_TO_A[currentUnit] ?? 1);
      const angleRad = phaseAngle * (Math.PI / 180);
      const phaseMultiplier = systemPhase === 'three' ? Math.sqrt(3) : 1;

      const s = phaseMultiplier * v_V * c_A;
      const p = s * Math.cos(angleRad);
      const q = s * Math.sin(angleRad);
      const pf = Math.cos(angleRad);

      setApparentPower(s);
      setRealPower(p);
      setReactivePower(q);
      setPowerFactor(pf);
    } else {
      setApparentPower(0);
      setRealPower(0);
      setReactivePower(0);
      setPowerFactor(0);
    }
  }, [voltage, voltageUnit, current, currentUnit, phaseAngle, systemPhase]);

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
              <Label>{t?.inputs?.systemPhase || 'Phase System'}</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={systemPhase}
                onChange={(e) => setSystemPhase(e.target.value)}
              >
                <option value="single">Single-Phase (1Φ)</option>
                <option value="three">Three-Phase (3Φ)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.voltage || 'Voltage (V)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={voltage} onChange={(e) => setVoltage(e.target.value)} min={0} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Voltage (V) unit"
                  value={voltageUnit}
                  onChange={(e) => setVoltageUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {VOLTAGE_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              {systemPhase === 'three' && <p className="text-xs text-muted-foreground mt-1">Line-to-Line Voltage</p>}
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.current || 'Current (I)'}</Label>
              <div className="flex min-w-0">
                <Input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} min={0} className="min-w-0 flex-1 rounded-r-none" />
                <select
                  aria-label="Current (I) unit"
                  value={currentUnit}
                  onChange={(e) => setCurrentUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {CURRENT_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.phaseAngle || 'Phase Angle (θ)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={phaseAngle} onChange={(e) => setPhaseAngle(Number(e.target.value))} min={-90} max={90} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">°</span>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">
                    {t?.results?.realPower || 'Real Power (P)'}
                  </span>
                  <div className="text-lg font-bold text-green-600">
                    {realPower.toFixed(2)} <span className="text-sm font-normal">W</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">
                    {t?.results?.reactivePower || 'Reactive Power (Q)'}
                  </span>
                  <div className="text-lg font-bold text-red-500">
                    {reactivePower.toFixed(2)} <span className="text-sm font-normal">VAR</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">
                    {t?.results?.apparentPower || 'Apparent Power (S)'}
                  </span>
                  <div className="text-lg font-bold text-blue-600">
                    {apparentPower.toFixed(2)} <span className="text-sm font-normal">VA</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1 text-center">
                    {t?.results?.powerFactor || 'Power Factor (PF)'}
                  </span>
                  <div className="text-lg font-bold text-purple-600">
                    {powerFactor.toFixed(4)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Power Triangle'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border p-4">
                <svg viewBox="-50 -150 250 200" className="w-full h-full">
                  {/* Axes/Grid */}
                  <line x1="0" y1="0" x2="200" y2="0" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4" />

                  {/* Power Triangle based on angle */}
                  {/* P (Real) is horizontal */}
                  <line x1="0" y1="0" x2="120" y2="0" stroke="#16a34a" strokeWidth="4" />
                  <text x="60" y="15" fill="#16a34a" fontSize="12" fontWeight="bold">P (Real)</text>

                  {/* Q (Reactive) is vertical */}
                  <line x1="120" y1="0" x2="120" y2={-120 * Math.tan(phaseAngle * Math.PI / 180)} stroke="#ef4444" strokeWidth="4" />
                  <text x="130" y={-60 * Math.tan(phaseAngle * Math.PI / 180)} fill="#ef4444" fontSize="12" fontWeight="bold">Q (React.)</text>

                  {/* S (Apparent) is hypotenuse */}
                  <line x1="0" y1="0" x2="120" y2={-120 * Math.tan(phaseAngle * Math.PI / 180)} stroke="#2563eb" strokeWidth="4" />
                  <text x="50" y={-50 * Math.tan(phaseAngle * Math.PI / 180) - 10} fill="#2563eb" fontSize="12" fontWeight="bold">S (Apparent)</text>

                  {/* Angle arc */}
                  {phaseAngle !== 0 && (
                    <>
                      <path d={`M 30 0 A 30 30 0 0 ${phaseAngle > 0 ? 0 : 1} ${30 * Math.cos(phaseAngle * Math.PI / 180)} ${-30 * Math.sin(phaseAngle * Math.PI / 180)}`} fill="none" stroke="#9333ea" strokeWidth="2" />
                      <text x="40" y={-10 * Math.sign(phaseAngle)} fill="#9333ea" fontSize="12" fontWeight="bold">θ</text>
                    </>
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

export default AcPowerCalculator;
