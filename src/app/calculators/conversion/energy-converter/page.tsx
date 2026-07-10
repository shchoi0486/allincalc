'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'BTU'] as const;
type Unit = typeof units[number];

const toJoules: Record<Unit, number> = {
  J: 1,
  kJ: 1000,
  cal: 4.184,
  kcal: 4184,
  Wh: 3600,
  kWh: 3600000,
  BTU: 1055.06,
};

const unitLabels: Record<Unit, string> = {
  J: '줄(J)',
  kJ: '킬로줄(kJ)',
  cal: '칼로리(cal)',
  kcal: '킬로칼로리(kcal)',
  Wh: '와트시(Wh)',
  kWh: '킬로와트시(kWh)',
  BTU: 'BTU',
};

function convertEnergy(value: number, fromUnit: Unit): Record<Unit, number> {
  const joules = value * toJoules[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = joules / toJoules[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function EnergyConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('kcal');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertEnergy(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="energyValue" className="w-24">값:</label>
        <Input
          id="energyValue"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 100"
          className="flex-grow"
        />
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value as Unit)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {units.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {units.map((u) => (
        <div key={u} className="flex items-center justify-between p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">{unitLabels[u]}</span>
          <span className="text-sm font-bold text-primary">{formatNumber(results[u] ?? 0)} {u}</span>
        </div>
      ))}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>에너지 변환기</strong>는 다양한 에너지 단위 간의 정확한 변환을 제공하는 도구입니다. 
          줄(J), 킬로줄(kJ), 칼로리(cal), 킬로칼로리(kcal), 와트시(Wh), 킬로와트시(kWh), BTU 간의 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          음식의 칼로리 계산, 전력 소비량 비교, 열량 계산 등 다양한 상황에서 에너지 단위 변환이 필요할 때 활용할 수 있으며, 
          과학, 공학, 의학, 일상생활 등 광범위한 분야에서 유용합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">에너지 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 kcal = 4,184 J = 4.184 kJ</p>
            <p className="text-center font-mono text-sm">1 cal = 4.184 J</p>
            <p className="text-center font-mono text-sm">1 Wh = 3,600 J</p>
            <p className="text-center font-mono text-sm">1 kWh = 3,600,000 J = 3.6 MJ</p>
            <p className="text-center font-mono text-sm">1 BTU = 1,055.06 J</p>
            <p className="text-center font-mono text-sm">1 kcal ≈ 3.968 BTU</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 식품에서의 '칼로리(kcal)'와 열역학에서의 '칼로리(cal)'는 다릅니다. 
          식품 라벨에 표시되는 Calorie(大文字 C)는 실제로는 kcal(킬로칼로리)를 의미합니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 에너지 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 에너지 비교</p>
              <p className="text-xs mt-1">
                사과 1개: 약 95 kcal / 점심 식사: 약 600~800 kcal / 
                성인 남성 일일 권장 섭취량: 약 2,000~2,500 kcal
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">전력 소비 비교</p>
              <p className="text-xs mt-1">
                LED 전구(10W, 8시간): 80Wh = 0.08kWh / 
                에어컨(1kW, 8시간): 8kWh / 
                전기차 배터리(100kWh): 약 400km 주행 가능
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">연료 에너지 비교</p>
              <p className="text-xs mt-1">
                휘발유 1L: 약 8,900 kcal(약 37,000 kJ) / 
                경유 1L: 약 8,600 kcal / 
                LPG 1L: 약 5,900 kcal
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="에너지 변환기"
      description="J, kJ, cal, kcal, Wh, kWh, BTU 단위 간 에너지를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
