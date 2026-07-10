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
          <strong>거리 변환기</strong>는 미터법과 영미법 등 다양한 길이 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리미터(mm), 센티미터(cm), 미터(m), 킬로미터(km), 인치(inch), 피트(foot), 야드(yard), 마일(mile) 간의 환산을 통해 국제적으로 통용되는 거리 단위를 빠르게 바꿀 수 있습니다.
        </p>
        <p>
          여행, 건축, 토목, 공학, 과학 실험 등 다양한 분야에서 거리 단위 변환이 필요합니다. 특히 미터법과 영미법을 혼용하는 국제 환경, 수입 설비 사양서를 읽을 때, 또는 해외 지도와 도면을 다룰 때 매우 유용합니다.
        </p>
        <p>
          학생들에게는 단위 개념을 익히는 학습 자료로, 설계자와 시공자에게는 도면과 현장 측정값을 조율하는 실무 도구로 활용됩니다. 일상에서도 신장, 붙박이장 크기, 운동 거리 등을 비교할 때 편리합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준(ISO)을 따릅니다. 인치와 센티미터는 엄밀하게 1 inch = 2.54 cm이며, 마일은 1 mile = 1.609344 km입니다. 항공에서는 해리(nautical mile, 1.852 km)를 사용하므로 용도에 맞는 단위를 선택하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">거리 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 m = 100 cm = 1,000 mm</p>
            <p className="font-mono text-sm">1 km = 1,000 m</p>
            <p className="font-mono text-sm">1 inch = 2.54 cm</p>
            <p className="font-mono text-sm">1 foot = 12 inch = 30.48 cm</p>
            <p className="font-mono text-sm">1 yard = 3 feet = 0.9144 m</p>
            <p className="font-mono text-sm">1 mile = 1.609344 km</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 100 yard를 미터로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">100 yard × 0.9144 = 91.44 m</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 거리 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>농구 코트: 28 m, 축구장 길이: 100~110 m</li>
            <li>서울~부산: 약 325 km, 지구 둘레: 약 40,075 km</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">미터법 vs 영미법</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>미국, 라이베리아, 미얀마를 제외한 대부분의 국가가 미터법을 사용합니다.</li>
            <li>영국 도로 표지판은 미터와 마일을 혼용 표시합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">항공 거리</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>항공에서는 해리(1.852 km)를 사용하며, 1해리는 적도에서 1분에 해당합니다.</li>
            <li>지도상 거리와 실제 비행 거리는 다를 수 있습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">건축·토목 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>도면 단위(피트/인치)를 현장 단위(m)로 환산해 오차를 줄이세요.</li>
            <li>자재 길이 산정 시 여유분을 고려하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">운동 기록 관리</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>러닝 거리를 km와 mile로 함께 기록해 비교하세요.</li>
            <li>페이스 환산 시 거리 단위를 먼저 통일하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">소수점 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>정밀 측정에서는 유효숫자를 맞춰 기록하세요.</li>
            <li>단위 혼용으로 인한 사고를 막기 위해 단위를 명시하세요.</li>
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
