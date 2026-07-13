'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const ConvectionHeatTransfer = () => {
  const { locale, unitSystem } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const fluidProps: Record<string, { label: string; rho: number; mu: number; k: number; pr: number }> = {
    air: { label: L('공기', 'Air'), rho: 1.225, mu: 1.81e-5, k: 0.0257, pr: 0.713 },
    water: { label: L('물', 'Water'), rho: 998, mu: 1.002e-3, k: 0.598, pr: 7.01 },
    oil: { label: L('오일', 'Oil'), rho: 880, mu: 0.3, k: 0.145, pr: 1830 },
  };

  const [fluid, setFluid] = useState('air');
  const [velocity, setVelocity] = useState('1');
  const [velocityUnit, setVelocityUnit] = useState('m/s');
  const [charLength, setCharLength] = useState('0.5');
  const [charLengthUnit, setCharLengthUnit] = useState('m');
  const [useCustomProps, setUseCustomProps] = useState(false);
  const [customProps, setCustomProps] = useState({ rho: '1.225', mu: '0.0000181', k: '0.0257', pr: '0.713' });
  const [customRhoUnit, setCustomRhoUnit] = useState('kg/m³');
  const [customMuUnit, setCustomMuUnit] = useState('Pa·s');
  const [customKUnit, setCustomKUnit] = useState('W/m·K');

  const updateCustomProp = (key: string, value: string) => {
    setCustomProps((prev) => ({ ...prev, [key]: value }));
  };

  const [results, setResults] = useState<{
    reynolds: number | null;
    nusselt: number | null;
    h: number | null;
    regime: string;
  }>({ reynolds: null, nusselt: null, h: null, regime: '' });

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setVelocity('3.28');
      setVelocityUnit('ft/s');
      setCharLength('1.64');
      setCharLengthUnit('ft');
      setCustomProps({ rho: '19.62', mu: '2.69e-5', k: '0.01485', pr: '0.713' });
      setCustomRhoUnit('lb/ft³');
      setCustomMuUnit('lb/(ft·s)');
      setCustomKUnit('BTU/hr·ft·°F');
    } else {
      setVelocity('1');
      setVelocityUnit('m/s');
      setCharLength('0.5');
      setCharLengthUnit('m');
      setCustomProps({ rho: '1.225', mu: '0.0000181', k: '0.0257', pr: '0.713' });
      setCustomRhoUnit('kg/m³');
      setCustomMuUnit('Pa·s');
      setCustomKUnit('W/m·K');
    }
  }, [isImperial]);

  // Conversion maps to SI base
  const VELOCITY_TO_MS: Record<string, number> = { 'm/s': 1, 'ft/s': 0.3048 };
  const LENGTH_TO_M: Record<string, number> = { mm: 0.001, cm: 0.01, m: 1, in: 0.0254, ft: 0.3048 };
  const RHO_TO_KGM3: Record<string, number> = { 'kg/m³': 1, 'lb/ft³': 16.0185 };
  const MU_TO_PAS: Record<string, number> = { 'Pa·s': 1, 'lb/(ft·s)': 1.48816 };
  const K_TO_WMK: Record<string, number> = { 'W/m·K': 1, 'BTU/hr·ft·°F': 0.57779 };

  const VELOCITY_UNITS = ['m/s', 'ft/s'];
  const LENGTH_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];
  const RHO_UNITS = ['kg/m³', 'lb/ft³'];
  const MU_UNITS = ['Pa·s', 'lb/(ft·s)'];
  const K_UNITS = ['W/m·K', 'BTU/hr·ft·°F'];

  const H_TO_SI: Record<string, number> = { 'W/m²·K': 1, 'BTU/hr·ft²·°F': 0.17611 };
  const H_UNITS = ['W/m²·K', 'BTU/hr·ft²·°F'];

  const handleCalculate = useCallback(() => {
    const v_raw = parseFloat(velocity);
    const Lc_raw = parseFloat(charLength);
    const v = v_raw * (VELOCITY_TO_MS[velocityUnit] ?? 1);
    const Lc = Lc_raw * (LENGTH_TO_M[charLengthUnit] ?? 1);
    if (isNaN(v) || isNaN(Lc) || v <= 0 || Lc <= 0) {
      setResults({ reynolds: null, nusselt: null, h: null, regime: '' });
      return;
    }

    let rho: number, mu: number, k: number, Pr: number;

    if (useCustomProps) {
      rho = parseFloat(customProps.rho) * (RHO_TO_KGM3[customRhoUnit] ?? 1);
      mu = parseFloat(customProps.mu) * (MU_TO_PAS[customMuUnit] ?? 1);
      k = parseFloat(customProps.k) * (K_TO_WMK[customKUnit] ?? 1);
      Pr = parseFloat(customProps.pr);
      if (isNaN(rho) || isNaN(mu) || isNaN(k) || isNaN(Pr) || mu === 0) {
        setResults({ reynolds: null, nusselt: null, h: null, regime: '' });
        return;
      }
    } else {
      const props = fluidProps[fluid];
      rho = props.rho;
      mu = props.mu;
      k = props.k;
      Pr = props.pr;
    }

    const Re = (rho * v * Lc) / mu;
    let regime: string;
    let Nu: number;

    if (Re < 5e5) {
      regime = 'laminar';
      Nu = 0.664 * Math.pow(Re, 0.5) * Math.pow(Pr, 1 / 3);
    } else {
      regime = 'turbulent';
      Nu = 0.0296 * Math.pow(Re, 0.8) * Math.pow(Pr, 1 / 3);
    }

    const hCoeff = (Nu * k) / Lc; // W/m²·K

    setResults({ reynolds: Re, nusselt: Nu, h: hCoeff, regime });
  }, [fluid, velocity, velocityUnit, charLength, charLengthUnit, useCustomProps, customProps, customRhoUnit, customMuUnit, customKUnit]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  const hUnit = isImperial ? 'BTU/hr·ft²·°F' : 'W/m²·K';
  const hDisplay = results.h !== null ? results.h / (H_TO_SI[hUnit] ?? 1) : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">
                {L('입력', 'Inputs')}
              </h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{L('유체 선택', 'Fluid Type')}</Label>
              <div className="flex gap-2">
                {Object.entries(fluidProps).map(([key, p]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFluid(key)}
                    className={`flex-1 py-2 rounded-md border text-sm font-medium transition-colors ${
                      fluid === key && !useCustomProps
                        ? 'bg-blue-600 text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="useCustom"
                checked={useCustomProps}
                onChange={(e) => setUseCustomProps(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="useCustom">{L('유체 속성 수동 입력', 'Custom Fluid Properties')}</Label>
            </div>

            {useCustomProps && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">ρ</Label>
                  <div className="flex min-w-0">
                    <Input
                      type="number"
                      value={customProps.rho}
                      onChange={(e) => updateCustomProp('rho', e.target.value)}
                      className="min-w-0 flex-1 rounded-r-none"
                    />
                    <select
                      aria-label="Density unit"
                      value={customRhoUnit}
                      onChange={(e) => setCustomRhoUnit(e.target.value)}
                      className={unitSelectClass}
                    >
                      {RHO_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">μ</Label>
                  <div className="flex min-w-0">
                    <Input
                      type="number"
                      value={customProps.mu}
                      onChange={(e) => updateCustomProp('mu', e.target.value)}
                      step={0.000001}
                      className="min-w-0 flex-1 rounded-r-none"
                    />
                    <select
                      aria-label="Dynamic viscosity unit"
                      value={customMuUnit}
                      onChange={(e) => setCustomMuUnit(e.target.value)}
                      className={unitSelectClass}
                    >
                      {MU_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">k</Label>
                  <div className="flex min-w-0">
                    <Input
                      type="number"
                      value={customProps.k}
                      onChange={(e) => updateCustomProp('k', e.target.value)}
                      step={0.001}
                      className="min-w-0 flex-1 rounded-r-none"
                    />
                    <select
                      aria-label="Thermal conductivity unit"
                      value={customKUnit}
                      onChange={(e) => setCustomKUnit(e.target.value)}
                      className={unitSelectClass}
                    >
                      {K_UNITS.map((u) => (
                        <option key={u} value={u}>{u}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Pr</Label>
                  <Input type="number" value={customProps.pr} onChange={(e) => updateCustomProp('pr', e.target.value)} />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>{L('유속', 'Flow Velocity')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={velocity}
                  onChange={(e) => setVelocity(e.target.value)}
                  min={0}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={`${L('유속', 'Flow Velocity')} unit`}
                  value={velocityUnit}
                  onChange={(e) => setVelocityUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {VELOCITY_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{L('특성 길이', 'Characteristic Length')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={charLength}
                  onChange={(e) => setCharLength(e.target.value)}
                  min={0.01}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={`${L('특성 길이', 'Characteristic Length')} unit`}
                  value={charLengthUnit}
                  onChange={(e) => setCharLengthUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {LENGTH_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
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
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border flex flex-col items-center justify-center">
                <span className="text-sm font-medium text-muted-foreground mb-2">
                  {L('대류 열전달 계수', 'Convection Coefficient (h)')}
                </span>
                <span className="text-4xl font-bold text-primary">
                  {hDisplay !== null ? hDisplay.toFixed(2) : '-'}
                </span>
                <span className="text-sm font-normal text-muted-foreground mt-1">
                  {hUnit}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('레이놀즈 수', 'Reynolds Number (Re)')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {results.reynolds !== null
                    ? results.reynolds.toLocaleString(undefined, { maximumFractionDigits: 0 })
                    : '-'}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('뉴셀트 수', 'Nusselt Number (Nu)')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {results.nusselt !== null ? results.nusselt.toFixed(4) : '-'}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('유동 체제', 'Flow Regime')}
                </span>
                <span
                  className={`text-sm font-bold ${
                    results.regime === 'laminar' ? 'text-blue-600' : 'text-red-600'
                  }`}
                >
                  {results.regime === 'laminar'
                    ? L('계류 유동 (Laminar)', 'Laminar Flow')
                    : results.regime === 'turbulent'
                    ? L('난류 유동 (Turbulent)', 'Turbulent Flow')
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

export default ConvectionHeatTransfer;
