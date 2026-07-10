'use client';

import React, { useState, useEffect, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'] as const;
type Unit = typeof units[number];

const toBytes: Record<Unit, number> = {
  Byte: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
  PB: 1024 ** 5,
};

const unitNames: Record<Unit, string> = {
  Byte: '바이트(Byte)',
  KB: '킬로바이트(KB)',
  MB: '메가바이트(MB)',
  GB: '기가바이트(GB)',
  TB: '테라바이트(TB)',
  PB: '페타바이트(PB)',
};

function convertDataSize(value: number, fromUnit: Unit): Record<Unit, number> {
  const bytes = value * toBytes[fromUnit];
  const result: Record<string, number> = {};
  units.forEach((u) => {
    result[u] = bytes / toBytes[u];
  });
  return result as Record<Unit, number>;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  if (n >= 1e15) return n.toExponential(2);
  if (n < 0.0001 && n > 0) return n.toExponential(2);
  if (Number.isInteger(n)) return n.toLocaleString();
  return n.toFixed(6).replace(/\.?0+$/, '');
}

export default function DataSizeConverter() {
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<Unit>('GB');
  const [results, setResults] = useState<Record<Unit, number>>({
    Byte: 0, KB: 0, MB: 0, GB: 1, TB: 0, PB: 0,
  });

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertDataSize(num, fromUnit));
    } else {
      const empty: Record<string, number> = {};
      units.forEach((u) => { empty[u] = 0; });
      setResults(empty as Record<Unit, number>);
    }
  }, [value, fromUnit]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="dataValue" className="w-24">값:</label>
        <Input
          id="dataValue"
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
          <span className="text-sm font-medium">{unitNames[u]}</span>
          <span className="text-sm font-bold text-primary">{formatNumber(results[u])} {u}</span>
        </div>
      ))}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>데이터 크기 변환기</strong>는 컴퓨터에서 사용되는 다양한 데이터 저장 단위 간의 변환을 돕는 필수적인 도구입니다. 바이트(Byte), 킬로바이트(KB), 메가바이트(MB), 기가바이트(GB), 테라바이트(TB), 페타바이트(PB) 간의 정확한 변환 결과를 한 번에 확인할 수 있습니다.
        </p>
        <p>
          데이터 처리량, 파일 크기, 저장 공간 등을 계산할 때 여러 단위를 빠르게 비교하고 변환할 수 있어 웹 개발, 데이터 분석, 시스템 관리, 클라우드 컴퓨팅 등 다양한 분야에서 활용됩니다.
        </p>
        <p>
          디지털 세계에서 데이터의 양은 기하급수적으로 증가하고 있습니다. 1KB의 텍스트 파일부터 수 PB에 달하는 데이터센터의 저장 용량까지, 정확한 단위 변환은 IT 인프라 계획과 비용 산정에 핵심적인 역할을 합니다.
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          이 변환기는 이진(Binary) 기준(1KB = 1,024 Byte)을 사용하며, 입력된 값에 대해 모든 단위로의 변환 결과를 동시에 보여줍니다. 저장 장치 구매, 클라우드 서비스 선택, 대용량 파일 전송 등 다양한 상황에서 즉시 활용할 수 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">데이터 크기 단위 변환 공식</h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center font-mono text-lg">1 KB = 1,024 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 MB = 1,024 KB = 1,048,576 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 GB = 1,024 MB = 1,073,741,824 Byte</p>
            <p className="text-center font-mono text-lg mt-2">1 TB = 1,024 GB</p>
            <p className="text-center font-mono text-lg mt-2">1 PB = 1,024 TB</p>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 이 변환기는 이진(Binary, 2^10 = 1,024) 기준을 사용합니다. 일부 시스템이나 저장 장치 제조사에서는 십진(Decimal, 10^3 = 1,000) 기준을 사용할 수 있습니다. 예: 1GB HDD = 1,000,000,000 Byte
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">핵심 개념</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">이진(Binary) vs 십진(Decimal)</p>
              <p className="text-xs mt-1">
                컴퓨터는 이진법을 사용하므로 1KB = 1,024 Byte입니다. 그러나 하드 디스크 제조사는 1KB = 1,000 Byte(십진)를 사용하여 실제 저장 용량이 표시 용량보다 작게 느껴질 수 있습니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">파일 크기 참고</p>
              <p className="text-xs mt-1">
                웹페이지: 약 2~5MB / 고화질 영화(1080p): 약 4~8GB / 4K 영화: 약 15~50GB / 1시간 4K 영상: 약 20GB
              </p>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">저장 장치 용량 참고</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>USB:</strong> 32~256GB</li>
            <li><strong>SSD:</strong> 256GB~4TB</li>
            <li><strong>HDD:</strong> 1~20TB</li>
            <li><strong>클라우드:</strong> 수 TB~PB 단위</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">활용 사례</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>웹 개발:</strong> 이미지 최적화, 리소스 압축 용량 계산</li>
            <li><strong>데이터베이스:</strong> 백업 용량, 저장소 확장 계획</li>
            <li><strong>클라우드:</strong> 저장 서비스 요금제 선택</li>
            <li><strong>백업:</strong> 필요한 백업 스토리지 용량 산정</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="데이터 크기 변환기"
      description="Byte, KB, MB, GB, TB, PB 단위 간 데이터 크기를 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
