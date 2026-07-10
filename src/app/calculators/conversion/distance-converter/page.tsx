'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['mm', 'cm', 'm', 'km', 'inch', 'foot', 'yard', 'mile'] as const;
type Unit = typeof units[number];

const toMeters: Record<Unit, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

const unitLabels: Record<Unit, string> = {
  mm: '밀리미터(mm)',
  cm: '센티미터(cm)',
  m: '미터(m)',
  km: '킬로미터(km)',
  inch: '인치(inch)',
  foot: '피트(foot)',
  yard: '야드(yard)',
  mile: '마일(mile)',
};

function convertDistance(value: number, fromUnit: Unit): Record<Unit, number> {
  const meters = value * toMeters[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = meters / toMeters[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(6).replace(/\.?0+$/, '');
}

export default function DistanceConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('m');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertDistance(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="distanceValue" className="w-24">값:</label>
        <Input
          id="distanceValue"
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
          <strong>거리 변환기</strong>는 미터법과 영미법 등 다양한 거리/길이 단위 간의 정확한 변환을 제공하는 도구입니다. 
          밀리미터, 센티미터, 미터, 킬로미터, 인치, 피트, 야드, 마일 간의 변환을 통해 국제적으로 통용되는 거리 단위를 빠르게 변환할 수 있습니다.
        </p>
        <p>
          여행, 건축, 공학, 과학 등 다양한 분야에서 거리 단위 변환이 필요할 때 활용할 수 있으며, 
          특히 미터법과 영미법을 혼용하는 국제 환경에서 유용합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">거리 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 m = 100 cm = 1,000 mm</p>
            <p className="text-center font-mono text-sm">1 km = 1,000 m</p>
            <p className="text-center font-mono text-sm">1 inch = 2.54 cm</p>
            <p className="text-center font-mono text-sm">1 foot = 12 inches = 30.48 cm</p>
            <p className="text-center font-mono text-sm">1 yard = 3 feet = 0.9144 m</p>
            <p className="text-center font-mono text-sm">1 mile = 1.609344 km</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 이 변환기는 국제 표준(ISO)에 따른 정확한 변환 계수를 사용합니다. 
          인치-센티미터 변환은 엄밀하게 1 inch = 2.54 cm입니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 거리 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 거리 비교</p>
              <p className="text-xs mt-1">
                농구 코트 길이: 28m(94ft) / 축구장 길이: 100~110m(약 1마일의 1/15) / 
                서울~부산: 약 325km(202마일) / 지구 둘레: 약 40,075km(24,901마일)
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">미터법 vs 영미법</p>
              <p className="text-xs mt-1">
                미국, 라이베리아, 미얀마를 제외한 대부분의 국가가 미터법을 사용합니다. 
                영국에서는 도로 표지판에 미터와 마일을 혼용하여 표시합니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">항공 거리</p>
              <p className="text-xs mt-1">
                항공에서는 해리(Nautical Mile, 1.852km)를 사용하며, 1해리는 적도에서 1분에 해당하는 거리입니다.
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="거리 변환기"
      description="mm, cm, m, km, inch, foot, yard, mile 단위 간 거리를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
