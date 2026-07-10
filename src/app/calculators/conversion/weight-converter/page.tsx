'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['mg', 'g', 'kg', 'ton', 'oz', 'lb'] as const;
type Unit = typeof units[number];

const toGrams: Record<Unit, number> = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  ton: 1000000,
  oz: 28.3495,
  lb: 453.592,
};

const unitLabels: Record<Unit, string> = {
  mg: '밀리그램(mg)',
  g: '그램(g)',
  kg: '킬로그램(kg)',
  ton: '톤(ton)',
  oz: '온스(oz)',
  lb: '파운드(lb)',
};

function convertWeight(value: number, fromUnit: Unit): Record<Unit, number> {
  const grams = value * toGrams[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = grams / toGrams[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function WeightConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('kg');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertWeight(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="weightValue" className="w-24">값:</label>
        <Input
          id="weightValue"
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
          <strong>무게 변환기</strong>는 다양한 무게/질량 단위 간의 정확한 변환을 제공하는 도구입니다. 
          밀리그램(mg), 그램(g), 킬로그램(kg), 톤(ton), 온스(oz), 파운드(lb) 간의 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          요리, 과학 실험, 물류, 운동 등 다양한 상황에서 무게 단위 변환이 필요할 때 활용할 수 있으며, 
          미터법과 영미법 무게 단위 간의 정확한 변환을 제공합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">무게 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 kg = 1,000 g = 1,000,000 mg</p>
            <p className="text-center font-mono text-sm">1 ton = 1,000 kg</p>
            <p className="text-center font-mono text-sm">1 oz = 28.3495 g</p>
            <p className="text-center font-mono text-sm">1 lb = 16 oz = 453.592 g</p>
            <p className="text-center font-mono text-sm">1 kg ≈ 2.2046 lb</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 톤(ton)은 메트릭 톤(1,000kg)을 기준으로 하며, 미국 톤(short ton, 약 907kg)과 영국 톤(long ton, 약 1,016kg)과는 다릅니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 무게 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 무게 비교</p>
              <p className="text-xs mt-1">
                사과 1개: 약 150~200g / 성인 남성 평균 체중: 약 70~80kg / 
                소형 자동차: 약 1~1.5ton / 코끼리: 약 4~6ton
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">요리에서의 무게</p>
              <p className="text-xs mt-1">
                한국 요리에서는 주로 그램(g)을 사용하지만, 영미권 요리에서는 온스(oz), 컵(cup) 등을 사용합니다. 
                베이킹에서는 정확한 무게 측정이 중요합니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">국제 무역에서의 무게</p>
              <p className="text-xs mt-1">
                국제 무역에서는 메트릭 톤(tonne)이 표준으로 사용되며, 
                곡물, 석유, 광물 등의 거래에서 량을 측정하는 데 사용됩니다.
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="무게 변환기"
      description="mg, g, kg, ton, oz, lb 단위 간 무게를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
