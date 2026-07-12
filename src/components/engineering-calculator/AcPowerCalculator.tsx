import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const AcPowerCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict?.common?.acPower;

  const [voltage, setVoltage] = useState<number>(220); // V
  const [current, setCurrent] = useState<number>(10); // A
  const [phaseAngle, setPhaseAngle] = useState<number>(30); // degrees
  const [systemPhase, setSystemPhase] = useState<string>('single'); // single or three

  const [realPower, setRealPower] = useState<number>(0);
  const [reactivePower, setReactivePower] = useState<number>(0);
  const [apparentPower, setApparentPower] = useState<number>(0);
  const [powerFactor, setPowerFactor] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (voltage > 0 && current > 0) {
      const angleRad = phaseAngle * (Math.PI / 180);
      const phaseMultiplier = systemPhase === 'three' ? Math.sqrt(3) : 1;

      const s = phaseMultiplier * voltage * current;
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
  }, [voltage, current, phaseAngle, systemPhase]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
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
              <div className="flex gap-2">
                <Input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} min={0} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">V</span>
              </div>
              {systemPhase === 'three' && <p className="text-xs text-muted-foreground mt-1">Line-to-Line Voltage</p>}
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.current || 'Current (I)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={current} onChange={(e) => setCurrent(Number(e.target.value))} min={0} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">A</span>
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
