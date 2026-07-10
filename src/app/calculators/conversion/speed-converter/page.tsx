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
          <strong>속도 변환기</strong>는 다양한 속도 단위 간의 정확한 변환을 제공하는 도구입니다. 미터/초(m/s), 킬로미터/시간(km/h), 마일/시간(mph), 노트(knot), 피트/초(ft/s) 간의 환산을 빠르게 수행할 수 있으며, 자동차·비행기·바람 속도부터 과학적 계산까지 폭넓게 활용됩니다.
        </p>
        <p>
          물리학과 공학에서는 m/s가 표준이고, 도로 교통에서는 km/h, 해상·항공에서는 노트(knot)가 쓰이는 등 분야마다 다른 단위가 사용됩니다. 이 도구는 이러한 단위를 손쉽게 변환하여 소통 오류를 줄여줍니다.
        </p>
        <p>
          학생과 연구자에게는 운동학 학습 자료로, 운전자와 항해사, 기상 예보자에게는 실무 도구로 유용합니다. 또한 해외 차량 사양이나 풍속 데이터를 다룰 때 큰 도움이 됩니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준을 따릅니다. 1 m/s = 3.6 km/h이며, 1 노트는 1시간에 1해리(1.852 km)를 이동하는 속도, 즉 1.852 km/h입니다. 단위 선택 시 측정 대상의 성격에 맞춰 구분하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">속도 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 m/s = 3.6 km/h = 2.2369 mph</p>
            <p className="font-mono text-sm">1 km/h = 0.2778 m/s = 0.6214 mph</p>
            <p className="font-mono text-sm">1 knot = 1.852 km/h = 0.5144 m/s</p>
            <p className="font-mono text-sm">1 ft/s = 0.3048 m/s</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 100 km/h를 m/s로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">100 km/h ÷ 3.6 = 27.78 m/s</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 속도 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>걷기 약 5 km/h, 자전거 15~25 km/h, 고속도로 100~120 km/h</li>
            <li>음속 약 1,235 km/h(343 m/s)</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">단위별 주요 사용처</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>km/h: 대부분 국가의 도로 교통</li>
            <li>m/s: 과학 계산과 물리학, mph: 미국·영국 도로</li>
            <li>knot: 항공·해상 교통</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">바람 속도 표기</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>기상예보는 주로 km/h 또는 m/s를 사용합니다.</li>
            <li>강풍 기준은 풍속 17 m/s(약 61 km/h) 이상입니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">자동차 성능 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>0→100 km/h 가속 시간은 m/s²로 환산해 비교할 수 있습니다.</li>
            <li>제동 거리 계산 시 초속 단위가 정확합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">항공·해상 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>이륙 속도와 항해 속도는 노트 단위로 관리됩니다.</li>
            <li>풍속과 대조류를 고려한 실속도 계산에 유용합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">학습 팁</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>속도와 속력(방향 없는 스칼라)의 차이를 이해하세요.</li>
            <li>단위 환산 전 식의 차원을 먼저 점검하세요.</li>
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
