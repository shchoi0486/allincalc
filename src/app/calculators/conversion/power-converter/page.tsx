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
          <strong>출력 변환기</strong>는 다양한 동력·출력 단위 간의 정확한 변환을 제공하는 도구입니다. 와트(W), 킬로와트(kW), 메가와트(MW), 마력(hp), BTU/h 간의 환산을 빠르게 수행할 수 있으며, 전기공학·기계공학·HVAC(난방·환기·냉방) 등 광범위한 분야에서 활용됩니다.
        </p>
        <p>
          전기 기기의 소비 전력, 엔진 출력, 냉방 용량, 발전 용량 등을 비교할 때 출력 단위 변환이 필요합니다. 특히 해외 제품 사양서의 마력(hp)과 국내 기준 kW를 오갈 때 유용하며, 설비 선정과 에너지 관리에 필수적입니다.
        </p>
        <p>
          엔지니어와 설비 담당자에게는 설계 도구로, 소비자에게는 가전·차량 사양을 비교하는 도구로 활용됩니다. 정확한 출력 환산은 적정 용량 선정과 전력 비용 절감의 기초입니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준을 따릅니다. 1 kW = 1,000 W, 1 MW = 1,000 kW, 1 hp(메커니컬) = 745.7 W, 1 BTU/h = 0.293071 W입니다. 마력에는 메커니컬·전기·미터법 등 종류가 있으므로 기준을 확인하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">출력 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 kW = 1,000 W</p>
            <p className="font-mono text-sm">1 MW = 1,000 kW = 1,000,000 W</p>
            <p className="font-mono text-sm">1 hp(메커니컬) = 745.7 W</p>
            <p className="font-mono text-sm">1 BTU/h = 0.293071 W</p>
            <p className="font-mono text-sm">1 kW ≈ 1.341 hp</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 150 hp를 kW로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">150 hp × 0.7457 = 111.86 kW</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 전력 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>LED 전구 10~20 W, 선풍기 50~100 W</li>
            <li>에어컨 800~2,000 W, 전기차 모터 100~500 kW</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">엔진 출력 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>소형차 80~120 hp, 스포츠카 300~1,000 hp</li>
            <li>트럭 엔진 300~600 hp, 제트 엔진 10,000 hp 이상</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">냉방 용량</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>냉방 용량은 주로 BTU/h로 표시됩니다.</li>
            <li>3평 방 약 5,000 BTU/h, 20평 아파트 20,000~30,000 BTU/h</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">마력 종류 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>메커니컬 hp는 745.7 W, 전기 hp는 746 W입니다.</li>
            <li>문헌의 hp 기준을 먼저 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">설비 선정</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>필요 출력에 여유(안전율)를 더해 모터를 선정하세요.</li>
            <li>역률과 효율을 고려해 입력 전력(kW)을 산정하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">전력 비용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>kW는 순간 출력, kWh는 사용량(요금) 단위입니다.</li>
            <li>두 단위를 구분해 청구서를 이해하세요.</li>
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
