'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['W', 'kW', 'MW', 'hp', 'BTU/h'] as const;
type Unit = typeof units[number];

const toWatts: Record<Unit, number> = {
  W: 1,
  kW: 1000,
  MW: 1000000,
  hp: 745.7,
  'BTU/h': 0.293071,
};

const unitLabels: Record<Unit, string> = {
  W: '와트(W)',
  kW: '킬로와트(kW)',
  MW: '메가와트(MW)',
  hp: '마력(hp)',
  'BTU/h': 'BTU/h',
};

function convertPower(value: number, fromUnit: Unit): Record<Unit, number> {
  const watts = value * toWatts[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = watts / toWatts[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function PowerConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('kW');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertPower(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="powerValue" className="w-24">값:</label>
        <Input
          id="powerValue"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 1"
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
          <strong>출력 변환기</strong>는 다양한 동력/출력 단위 간의 정확한 변환을 제공하는 도구입니다. 
          와트(W), 킬로와트(kW), 메가와트(MW), 마력(hp), BTU/h 간의 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          전기 기기의 소비 전력, 엔진 출력, 냉방 용량 등 다양한 상황에서 출력 단위 변환이 필요할 때 활용할 수 있으며, 
          전기공학, 기계공학, HVAC(난방·환기·냉방) 등에서 유용하게 사용됩니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">출력 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 kW = 1,000 W</p>
            <p className="text-center font-mono text-sm">1 MW = 1,000 kW = 1,000,000 W</p>
            <p className="text-center font-mono text-sm">1 hp(메커니컬) = 745.7 W</p>
            <p className="text-center font-mono text-sm">1 BTU/h = 0.293071 W</p>
            <p className="text-center font-mono text-sm">1 kW ≈ 1.341 hp</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 마력(hp)에는 메커니컬 hp, 전기 hp, 미터馬力等多种이 있습니다. 
          이 계산기는 메커니컬 hp(1hp = 745.7W)를 기준으로 합니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 출력 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 전력 비교</p>
              <p className="text-xs mt-1">
                LED 전구: 10~20W / 선풍기: 50~100W / 에어컨: 800~2,000W(1~2.5hp) / 
                전기밥솥: 700~1,000W / 전기차 모터: 100~500kW
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">엔진 출력 비교</p>
              <p className="text-xs mt-1">
                소형차: 80~120hp / 중형차: 150~250hp / 스포츠카: 300~1,000hp / 
                트럭 엔진: 300~600hp / 제트 엔진: 10,000hp 이상
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">냉방 용량</p>
              <p className="text-xs mt-1">
                냉방 용량은 주로 BTU/h로 표시됩니다. 10평방미터(약 3평) 방: 약 5,000 BTU/h / 
                20평 아파트 전체: 약 20,000~30,000 BTU/h
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="출력 변환기"
      description="W, kW, MW, hp, BTU/h 단위 간 출력을 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
