'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const units = ['m/s', 'km/h', 'mph', 'knot', 'ft/s'] as const;
type Unit = typeof units[number];

const toMps: Record<Unit, number> = {
  'm/s': 1,
  'km/h': 1 / 3.6,
  'mph': 0.44704,
  'knot': 0.514444,
  'ft/s': 0.3048,
};

const unitLabels: Record<Unit, string> = {
  'm/s': '미터/초(m/s)',
  'km/h': '킬로미터/시간(km/h)',
  'mph': '마일/시간(mph)',
  'knot': '노트(knot)',
  'ft/s': '피트/초(ft/s)',
};

function convertSpeed(value: number, fromUnit: Unit): Record<Unit, number> {
  const mps = value * toMps[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = mps / toMps[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  return n.toFixed(4).replace(/\.?0+$/, '');
}

export default function SpeedConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('km/h');
  const [results, setResults] = useState<Record<Unit, number>>({} as Record<Unit, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertSpeed(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="speedValue" className="w-24">값:</label>
        <Input
          id="speedValue"
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
          <strong>속도 변환기</strong>는 다양한 속도 단위 간의 정확한 변환을 제공하는 도구입니다. 
          미터/초(m/s), 킬로미터/시간(km/h), 마일/시간(mph), 노트(knot), 피트/초(ft/s) 간의 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          자동차 속도, 비행기 속도, 바람 속도 등 일상적인 속도 표현부터 과학적인 계산까지 
          다양한 분야에서 활용되는 필수적인 변환 도구입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">속도 단위 변환 관계</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-1">
            <p className="text-center font-mono text-sm">1 m/s = 3.6 km/h = 2.2369 mph</p>
            <p className="text-center font-mono text-sm">1 km/h = 0.2778 m/s = 0.6214 mph</p>
            <p className="text-center font-mono text-sm">1 mph = 1.6093 km/h = 0.4470 m/s</p>
            <p className="text-center font-mono text-sm">1 knot = 1.852 km/h = 0.5144 m/s</p>
            <p className="text-center font-mono text-sm">1 ft/s = 0.3048 m/s = 1.0973 km/h</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 1노트(nautical knot)는 해상에서 사용되는 단위로, 1시간에 1해리(1.852km)를 이동하는 속도입니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 속도 단위 활용 팁</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">일상적인 속도 비교</p>
              <p className="text-xs mt-1">
                걷기: 약 5km/h / 자전거: 약 15~25km/h / 자동차(도심): 50~60km/h / 
                고속도로: 100~120km/h / 음속: 약 1,235km/h(343m/s)
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">속도 단위별 주요 사용처</p>
              <p className="text-xs mt-1">
                <strong>km/h:</strong> 대부분의 국가에서 도로 교통에 사용<br />
                <strong>mph:</strong> 미국, 영국 도로 교통에 사용<br />
                <strong>m/s:</strong> 과학적 계산, 물리학에서 주로 사용<br />
                <strong>knot:</strong> 항공, 해상 교통에서 사용
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">바람 속도 표기</p>
              <p className="text-xs mt-1">
                기상 예보에서는 주로 km/h 또는 m/s를 사용하며, 태풍의 강도는 풍속으로 분류됩니다. 
                강풍 기준: 17m/s(약 61km/h) 이상
              </p>
            </li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="속도 변환기"
      description="m/s, km/h, mph, knot, ft/s 단위 간 속도를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
