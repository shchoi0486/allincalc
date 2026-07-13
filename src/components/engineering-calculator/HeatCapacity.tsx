'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const HeatCapacity = () => {
  const { locale, unitSystem } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const materials: { key: string; label: string; cp: number }[] = [
    { key: 'water', label: L('물', 'Water'), cp: 4186 },
    { key: 'aluminum', label: L('알루미늄', 'Aluminum'), cp: 897 },
    { key: 'copper', label: L('구리', 'Copper'), cp: 385 },
    { key: 'steel', label: L('강철', 'Steel'), cp: 502 },
    { key: 'concrete', label: L('콘크리트', 'Concrete'), cp: 880 },
    { key: 'glass', label: L('유리', 'Glass'), cp: 840 },
  ];

  const [mass, setMass] = useState('1');
  const [massUnit, setMassUnit] = useState('kg');
  const [material, setMaterial] = useState('water');
  const [tempChange, setTempChange] = useState('50');
  const [tempChangeUnit, setTempChangeUnit] = useState('K');
  const [customCp, setCustomCp] = useState('4.186');
  const [customCpUnit, setCustomCpUnit] = useState('kJ/kg·K');
  const [useCustom, setUseCustom] = useState(false);
  const [heatEnergy, setHeatEnergy] = useState<number | null>(null);
  const [cpUsed, setCpUsed] = useState(0);

  // Reset defaults + units when global unit system changes
  useEffect(() => {
    if (isImperial) {
      setMass('2.205');
      setMassUnit('lb');
      setTempChange('90');
      setTempChangeUnit('°F');
      setCustomCp('1');
      setCustomCpUnit('BTU/lb·°F');
    } else {
      setMass('1');
      setMassUnit('kg');
      setTempChange('50');
      setTempChangeUnit('K');
      setCustomCp('4.186');
      setCustomCpUnit('kJ/kg·K');
    }
  }, [isImperial]);

  // Conversion maps to SI base
  const MASS_TO_KG: Record<string, number> = { kg: 1, g: 0.001, lb: 0.453592, ton: 1000 };
  const DT_TO_K: Record<string, number> = { '°C': 1, 'K': 1, '°F': 5 / 9 };
  const CP_TO_SI: Record<string, number> = { 'kJ/kg·K': 1000, 'BTU/lb·°F': 4186.8 };

  const MASS_UNITS = ['kg', 'g', 'lb', 'ton'];
  const DT_UNITS = ['K', '°C', '°F'];
  const CP_UNITS = ['kJ/kg·K', 'BTU/lb·°F'];

  const handleCalculate = useCallback(() => {
    const m = parseFloat(mass) * (MASS_TO_KG[massUnit] ?? 1);
    const dt = parseFloat(tempChange) * (DT_TO_K[tempChangeUnit] ?? 1);
    const cp = useCustom
      ? parseFloat(customCp) * (CP_TO_SI[customCpUnit] ?? 1)
      : materials.find((m) => m.key === material)?.cp ?? 4186;

    if (isNaN(m) || isNaN(dt) || isNaN(cp) || m <= 0) {
      setHeatEnergy(null);
      return;
    }

    const Q = m * cp * dt; // J
    setHeatEnergy(Q);
    setCpUsed(cp);
  }, [mass, massUnit, material, tempChange, tempChangeUnit, customCp, customCpUnit, useCustom]);

  const unitSelectClass =
    'w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  const selectedCp = useCustom ? (parseFloat(customCp) * (CP_TO_SI[customCpUnit] ?? 1)) || 0 : materials.find((m) => m.key === material)?.cp ?? 0;

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
              <Label>{L('질량', 'Mass')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  min={0}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={`${L('질량', 'Mass')} unit`}
                  value={massUnit}
                  onChange={(e) => setMassUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {MASS_UNITS.map((u) => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="useCustom"
                  checked={useCustom}
                  onChange={(e) => setUseCustom(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="useCustom">{L('수동 입력', 'Manual Input')}</Label>
              </div>
              {!useCustom ? (
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 bg-background text-sm"
                >
                  {materials.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label} ({m.cp} J/(kg·K))
                    </option>
                  ))}
                </select>
              ) : (
                <div className="flex min-w-0">
                  <Input
                    type="number"
                    value={customCp}
                    onChange={(e) => setCustomCp(e.target.value)}
                    className="min-w-0 flex-1 rounded-r-none"
                  />
                  <select
                    aria-label={`${L('비열', 'Specific Heat')} unit`}
                    value={customCpUnit}
                    onChange={(e) => setCustomCpUnit(e.target.value)}
                    className={unitSelectClass}
                  >
                    {CP_UNITS.map((u) => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>{L('온도 변화', 'Temperature Change (ΔT)')}</Label>
              <div className="flex min-w-0">
                <Input
                  type="number"
                  value={tempChange}
                  onChange={(e) => setTempChange(e.target.value)}
                  className="min-w-0 flex-1 rounded-r-none"
                />
                <select
                  aria-label={`${L('온도 변화', 'Temperature Change (ΔT)')} unit`}
                  value={tempChangeUnit}
                  onChange={(e) => setTempChangeUnit(e.target.value)}
                  className={unitSelectClass}
                >
                  {DT_UNITS.map((u) => (
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
                  {L('필요 열량', 'Heat Energy Required (Q)')}
                </span>
                <span className="text-4xl font-bold text-primary">
                  {heatEnergy !== null
                    ? heatEnergy >= 1e6
                      ? (heatEnergy / 1e6).toFixed(2)
                      : heatEnergy.toFixed(2)
                    : '-'}
                </span>
                <span className="text-sm font-normal text-muted-foreground mt-1">
                  {heatEnergy !== null && heatEnergy >= 1e6 ? 'MJ' : 'J'}
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('비열', 'Specific Heat Capacity')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {cpUsed > 0 ? cpUsed.toFixed(1) : selectedCp.toFixed(1)}{' '}
                  <span className="text-xs font-normal">J/(kg·K)</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {L('열량 (kWh)', 'Energy (kWh)')}
                </span>
                <span className="text-sm font-bold text-primary">
                  {heatEnergy !== null ? (heatEnergy / 3600000).toFixed(4) : '-'}{' '}
                  <span className="text-xs font-normal">kWh</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HeatCapacity;
