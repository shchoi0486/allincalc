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
          <strong>에너지 변환기</strong>는 다양한 에너지 단위 간의 정확한 변환을 제공하는 도구입니다. 줄(J), 킬로줄(kJ), 칼로리(cal), 킬로칼로리(kcal), 와트시(Wh), 킬로와트시(kWh), BTU 간의 환산을 빠르게 수행할 수 있으며, 과학·공학·의학·일상생활 전반에서 활용됩니다.
        </p>
        <p>
          음식의 칼로리 계산, 가전제품의 전력 소비량 비교, 열량 설계, 연료 에너지 환산 등 다양한 상황에서 에너지 단위 변환이 필요합니다. 특히 전기요금과 식품 영양표시, 보일러 효율을 다룰 때 단위 혼선을 막는 데 유용합니다.
        </p>
        <p>
          학생과 연구자에게는 열역학 학습 자료로, 설비·에너지 엔지니어와 영양사에게는 실무 도구로 활용됩니다. 정확한 에너지 환산은 비용 절감과 효율 개선의 첫걸음입니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준을 따릅니다. 1 kcal = 4,184 J, 1 Wh = 3,600 J, 1 kWh = 3.6 MJ, 1 BTU ≈ 1,055 J입니다. 식품 라벨의 'Calorie'(대문자 C)는 실제로 kcal(킬로칼로리)임을 주의하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">에너지 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 kcal = 4,184 J = 4.184 kJ</p>
            <p className="font-mono text-sm">1 cal = 4.184 J</p>
            <p className="font-mono text-sm">1 Wh = 3,600 J</p>
            <p className="font-mono text-sm">1 kWh = 3,600,000 J = 3.6 MJ</p>
            <p className="font-mono text-sm">1 BTU = 1,055.06 J</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 2 kWh를 kJ로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">2 kWh × 3,600 = 7,200 kJ</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 에너지 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>사과 1개 약 95 kcal, 점심식사 600~800 kcal</li>
            <li>성인 남성 일일 권장 섭취량 2,000~2,500 kcal</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">전력 소비 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>LED 전구(10 W, 8시간) 80 Wh</li>
            <li>에어컨(1 kW, 8시간) 8 kWh</li>
            <li>전기차 배터리 100 kWh로 약 400 km 주행</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">연료 에너지 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>휘발유 1 L 약 8,900 kcal(약 37,000 kJ)</li>
            <li>경유 1 L 약 8,600 kcal, LPG 1 L 약 5,900 kcal</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">칼로리 표기 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>식품의 Calorie(대문자)는 kcal입니다.</li>
            <li>열역학의 cal과 혼동하지 마세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">전기요금 환산</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>kWh 단위 사용량에 요금단가를 곱해 요금을 계산합니다.</li>
            <li>대기전력도 kWh로 누적되므로 콘센트 차단이 효과적입니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">BTU 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>냉난방기 용량은 BTU/h로 표시됩니다.</li>
            <li>1 BTU/h = 0.293 W이므로 단위를 통일해 비교하세요.</li>
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
