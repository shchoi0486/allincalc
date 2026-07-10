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
          <strong>무게 변환기</strong>는 다양한 무게·질량 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리그램(mg), 그램(g), 킬로그램(kg), 톤(ton), 온스(oz), 파운드(lb) 간의 환산을 빠르게 수행할 수 있으며, 미터법과 영미법 단위를 자유롭게 오갈 수 있습니다.
        </p>
        <p>
          요리와 베이킹, 과학 실험, 물류와 운송, 헬스와 체중 관리 등 일상과 산업 전반에서 무게 단위 변환이 필요합니다. 특히 수입 식품의 영양성분 표시나 해외 규격 문서를 다룰 때 단위 혼선을 막는 데 유용합니다.
        </p>
        <p>
          학생에게는 단위 감각을 익히는 학습 자료로, 연구자와 조리사, 물류 담당자에게는 실무 도구로 활용됩니다. 정확한 계량은 요리의 성공과 실험의 신뢰성을 좌우하므로 정밀한 환산이 중요합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준을 따릅니다. 1 kg = 1,000 g = 2.2046 lb이며, 톤(ton)은 메트릭 톤(1,000 kg)을 기준으로 합니다. 미국 톤(short ton, 약 907 kg)과 영국 톤(long ton, 약 1,016 kg)과는 다르므로 주의하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">무게 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 kg = 1,000 g = 1,000,000 mg</p>
            <p className="font-mono text-sm">1 ton = 1,000 kg</p>
            <p className="font-mono text-sm">1 oz = 28.3495 g</p>
            <p className="font-mono text-sm">1 lb = 16 oz = 453.592 g</p>
            <p className="font-mono text-sm">1 kg ≈ 2.2046 lb</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 5 kg을 파운드(lb)로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">5 kg × 2.2046 = 11.023 lb</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 무게 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>사과 1개 약 150~200 g, 성인 평균 체중 70~80 kg</li>
            <li>소형차 1~1.5 ton, 코끼리 4~6 ton</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">요리에서의 무게</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>한국 요리는 주로 g을, 영미권은 oz·컵을 사용합니다.</li>
            <li>베이킹은 정확한 무게 측정이 맛의 일관성에 중요합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">국제 무역</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>국제 무역은 메트릭 톤(tonne)이 표준입니다.</li>
            <li>곡물·석유·광물 거래량 산정에 사용됩니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">실험실 계량</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>전자 저울로 정확히 측정하고 단위를 통일하세요.</li>
            <li>온도에 따라 부피가 변하므로 질량 기준 계산이 안정적입니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">톤 단위 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>메트릭 톤과 미국·영국 톤은 수치가 다릅니다.</li>
            <li>계약서상 단위 정의를 반드시 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">건강 관리</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>체중과 근육량을 kg 단위로 기록하세요.</li>
            <li>영양성분 표시의 g과 mg을 구분하세요.</li>
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
