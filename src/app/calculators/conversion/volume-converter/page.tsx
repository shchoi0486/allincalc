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
          <strong>부피 변환기</strong>는 다양한 부피·용적 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리리터(mL), 리터(L), 갤런(gal), 쿼트(qt), 파인트(pt), 컵(cup), 액량온스(fl oz), 세제곱미터(m³), 세제곱센티미터(cm³) 간의 환산을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          요리와 베이킹, 화학 실험, 공학 설계, 물류와 일상생활 등에서 부피 단위 변환이 자주 필요합니다. 미터법과 영미법 단위를 오가며 레시피 scaling이나 시약 배합, 탱크 용량 산정 등에 활용됩니다.
        </p>
        <p>
          조리사와 연구자에게는 계량 도구로, 엔지니어와 물류 담당자에게는 설계·운송 도구로 유용합니다. 정확한 부피 환산은 배합 비율의 신뢰성과 안전성을 결정짓는 요소입니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 표준을 따르며, 1 L = 1,000 mL = 1,000 cm³, 1 m³ = 1,000 L입니다. 다만 갤런은 미국 갤런(US gal, 3.78541 L)과 영국 갤런(Imp gal, 4.546 L)이 다르므로 주의하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">부피 단위 변환 관계</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-1">
            <p className="font-mono text-sm">1 L = 1,000 mL = 1,000 cm³</p>
            <p className="font-mono text-sm">1 m³ = 1,000 L</p>
            <p className="font-mono text-sm">1 gal(US) = 3.78541 L</p>
            <p className="font-mono text-sm">1 qt = 0.946353 L</p>
            <p className="font-mono text-sm">1 cup = 0.236588 L</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 2 L를 US 갤런으로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">2 L ÷ 3.78541 = 0.528 gal</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">요리에서의 부피</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>한국 요리는 mL·L을, 영미권은 컵·큰술·작은술을 사용합니다.</li>
            <li>1 cup ≈ 236.5 mL, 1 tbsp ≈ 15 mL입니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">일상적인 부피 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>페트병 음료 500 mL, 생수통 2 L</li>
            <li>욕조 약 150~200 L, 수영장(소형) 약 50,000~100,000 L</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">연료 관련</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>자동차 연료는 L 또는 gal 단위로 표시됩니다.</li>
            <li>미국은 gal, 유럽과 한국은 L를 주로 사용합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">화학 실험</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>시약 배합은 mL·L 단위로 정밀하게 측정하세요.</li>
            <li>용기 눈금의 오차를 고려해 중간 눈금을 피하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">갤런 종류 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>US gal과 Imp gal은 약 20% 차이가 납니다.</li>
            <li>해외 문헌의 gal 종류를 먼저 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">부피와 질량</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>물은 1 mL ≒ 1 g이지만 다른 액체는 밀도가 다릅니다.</li>
            <li>농도 계산 시 부피와 질량을 혼동하지 마세요.</li>
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
