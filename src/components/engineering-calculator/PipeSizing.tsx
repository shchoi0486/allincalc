'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

// Conversion to SI base
const FLOW_TO_M3S: Record<string, number> = {
  'm³/h': 1 / 3600,
  'gpm': 0.00378541 / 60,
  'L/s': 0.001,
  'ft³/s': 0.0283168,
};
const VELOCITY_TO_MS: Record<string, number> = {
  'm/s': 1,
  'ft/s': 0.3048,
  'km/h': 1000 / 3600,
};

const FLOW_UNITS = ['m³/h', 'gpm', 'L/s', 'ft³/s'];
const VELOCITY_UNITS = ['m/s', 'ft/s', 'km/h'];

const PipeSizing = () => {
  const { locale, unitSystem } = useI18n();
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const isImperial = unitSystem === 'imperial';

  const [flowRate, setFlowRate] = useState(isImperial ? '220' : '50');
  const [maxVelocity, setMaxVelocity] = useState(isImperial ? '9.84' : '3');
  const [flowUnit, setFlowUnit] = useState(isImperial ? 'gpm' : 'm³/h');
  const [velUnit, setVelUnit] = useState(isImperial ? 'ft/s' : 'm/s');

  const [results, setResults] = useState<{
    diameter: number | null;
    actualVelocity: number | null;
    reynolds: number | null;
    regime: string;
  }>({ diameter: null, actualVelocity: null, reynolds: null, regime: '' });

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setFlowRate('220');
      setMaxVelocity('9.84');
      setFlowUnit('gpm');
      setVelUnit('ft/s');
    } else {
      setFlowRate('50');
      setMaxVelocity('3');
      setFlowUnit('m³/h');
      setVelUnit('m/s');
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const Q = parseFloat(flowRate);
    const vMax = parseFloat(maxVelocity);
    if (isNaN(Q) || isNaN(vMax) || Q <= 0 || vMax <= 0) {
      setResults({ diameter: null, actualVelocity: null, reynolds: null, regime: '' });
      return;
    }

    // Convert each input to its SI base via the unit maps
    const Qms = Q * (FLOW_TO_M3S[flowUnit] ?? 1); // m3/s
    const vMax_ms = vMax * (VELOCITY_TO_MS[velUnit] ?? 1); // m/s

    const D = Math.sqrt((4 * Qms) / (Math.PI * vMax_ms)); // m
    const Dmm = D * 1000;
    const actualV = Qms / (Math.PI * (D / 2) * (D / 2)); // m/s

    const mu = 0.001;
    const rho = 1000;
    const Re = (rho * actualV * D) / mu;
    let regime: string;
    if (Re < 2300) regime = 'laminar';
    else if (Re <= 4000) regime = 'transitional';
    else regime = 'turbulent';

    const diameterDisplay = isImperial ? Dmm / 25.4 : Dmm; // in or mm
    const velocityDisplay = isImperial ? actualV / 0.3048 : actualV; // ft/s or m/s

    setResults({
      diameter: diameterDisplay,
      actualVelocity: velocityDisplay,
      reynolds: Re,
      regime,
    });
  }, [flowRate, maxVelocity, flowUnit, velUnit, isImperial]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">{L('입력', 'Inputs')}</h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{L('유량', 'Flow Rate')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={flowRate}
                  onChange={(e) => setFlowRate(e.target.value)}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={L('유량 단위', 'Flow Rate unit')}
                  value={flowUnit}
                  onChange={(e) => setFlowUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {FLOW_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{L('최대 유속', 'Max Velocity')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={maxVelocity}
                  onChange={(e) => setMaxVelocity(e.target.value)}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={L('최대 유속 단위', 'Max Velocity unit')}
                  value={velUnit}
                  onChange={(e) => setVelUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {VELOCITY_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
            >
              {locale === 'ko' ? '계산하기' : 'Calculate'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4 bg-primary/5">
            <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">
              {L('계산 결과', 'Results')}
            </h3>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('권장 직경', 'Recommended Diameter')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.diameter !== null ? results.diameter.toFixed(2) : '-'}{' '}
                  <span className="text-sm font-normal">{isImperial ? 'in' : 'mm'}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('실제 유속', 'Actual Velocity')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.actualVelocity !== null ? results.actualVelocity.toFixed(3) : '-'}{' '}
                  <span className="text-sm font-normal">{velUnit}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('레이놀즈 수', 'Reynolds Number')}
                </span>
                <span className="text-lg font-bold text-primary">
                  {results.reynolds !== null ? results.reynolds.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '-'}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('유동 체제', 'Flow Regime')}
                </span>
                <span className={`text-lg font-bold ${results.regime === 'laminar' ? 'text-blue-600' : results.regime === 'turbulent' ? 'text-red-600' : 'text-orange-600'}`}>
                  {results.regime === 'laminar'
                    ? L('계류 유동', 'Laminar')
                    : results.regime === 'turbulent'
                    ? L('난류 유동', 'Turbulent')
                    : results.regime === 'transitional'
                    ? L('과도기 유동', 'Transitional')
                    : '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PipeSizing;
