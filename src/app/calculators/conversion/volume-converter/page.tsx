'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['mL', 'L', 'gal', 'qt', 'pt', 'cup', 'fl oz', 'm³', 'cm³'] as const;
type Unit = typeof units[number];

const toLiters: Record<Unit, number> = {
  mL: 0.001,
  L: 1,
  gal: 3.78541,
  qt: 0.946353,
  pt: 0.473176,
  cup: 0.236588,
  'fl oz': 0.0295735,
  'm³': 1000,
  'cm³': 0.001,
};

const unitLabels: Record<Unit, string> = {
  mL: '밀리리터(mL)',
  L: '리터(L)',
  gal: '갤런(gal)',
  qt: '쿼트(qt)',
  pt: '파인트(pt)',
  cup: '컵(cup)',
  'fl oz': '액량온스(fl oz)',
  'm³': '세제곱미터(m³)',
  'cm³': '세제곱센티미터(cm³)',
};

function convertVolume(value: number, fromUnit: Unit): Record<Unit, number> {
  const liters = value * toLiters[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = liters / toLiters[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function VolumeConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('L');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertVolume(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="volumeValue" className="w-24">값:</label>
        <Input
          id="volumeValue"
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
          <strong>부피 변환기</strong>는 다양한 부피/용적 단위 간의 정확한 변환을 제공하는 도구입니다. 
          밀리리터(mL), 리터(L), 갤런(gal), 쿼트(qt), 파인트(pt), 컵(cup), 액량온스(fl oz), 
          세제곱미터(m³), 세제곱센티미터(cm³) 간의 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          요리, 화학, 공학, 일상생활 등 다양한 상황에서 부피 단위 변환이 필요할 때 활용할 수 있으며, 
          미터법과 영미법 부피 단위 간의 정확한 변환을 제공합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">부피 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 L = 1,000 mL = 1,000 cm³</p>
            <p className="text-center font-mono text-sm">1 m³ = 1,000 L</p>
            <p className="text-center font-mono text-sm">1 gal(US) = 3.78541 L</p>
            <p className="text-center font-mono text-sm">1 qt = 0.946353 L</p>
            <p className="text-center font-mono text-sm">1 pt = 0.473176 L</p>
            <p className="text-center font-mono text-sm">1 cup = 0.236588 L</p>
            <p className="text-center font-mono text-sm">1 fl oz = 29.5735 mL</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 이 변환기는 US(미국) 액량 단위를 기준으로 합니다. 
          영국 갤런(Imp gallon, 약 4.546L)과는 차이가 있습니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 부피 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">요리에서의 부피</p>
              <p className="text-xs mt-1">
                한국 요리에서는 주로 mL, L을 사용하지만, 영미권 레시피에서는 컵(cup), 테이블스푼(tbsp), 
                티스푼(tsp) 등을 사용합니다. 1컵 ≈ 236.5mL
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 부피 비교</p>
              <p className="text-xs mt-1">
                페트병 음료수: 500mL(0.5L) / 생수통: 2L / 
                욕조: 약 150~200L / 수영장(소형): 약 50,000~100,000L
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">연료 관련</p>
              <p className="text-xs mt-1">
                자동차 연료는 리터(L) 또는 갤런(gal) 단위로 표시됩니다. 
                미국에서는 갤런을, 유럽과 한국에서는 리터를 주로 사용합니다.
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="부피 변환기"
      description="mL, L, gal, qt, pt, cup, fl oz, m³, cm³ 단위 간 부피를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
