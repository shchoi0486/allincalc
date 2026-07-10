'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Trash2, History } from 'lucide-react';

interface NumberOptions {
  min: number;
  max: number;
  count: number;
  allowDuplicates: boolean;
  sort: boolean;
}

interface GenerationHistory {
  numbers: number[];
  timestamp: Date;
}

const RandomNumberGenerator: React.FC = () => {
  const [options, setOptions] = useState<NumberOptions>({
    min: 1,
    max: 100,
    count: 5,
    allowDuplicates: true,
    sort: false,
  });
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  const generateNumbers = () => {
    const { min, max, count, allowDuplicates, sort } = options;
    const validMin = Math.min(min, max);
    const validMax = Math.max(min, max);
    const range = validMax - validMin + 1;

    if (!allowDuplicates && count > range) {
      alert(`중복 불가 시 최대 생성 가능 개수는 ${range}개입니다.`);
      return;
    }

    const numbers: number[] = [];
    const used = new Set<number>();

    while (numbers.length < count) {
      const num = Math.floor(Math.random() * range) + validMin;
      if (allowDuplicates || !used.has(num)) {
        numbers.push(num);
        used.add(num);
      }
    }

    const result = sort ? [...numbers].sort((a, b) => a - b) : numbers;
    setGeneratedNumbers(result);
    setCopiedIndex(null);
    setCopiedAll(false);

    setHistory(prev => [
      { numbers: result, timestamp: new Date() },
      ...prev.slice(0, 9),
    ]);
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedNumbers.join(', '));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleClear = () => {
    setGeneratedNumbers([]);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">최소값</label>
          <Input
            type="number"
            value={options.min}
            onChange={(e) => setOptions(prev => ({ ...prev, min: parseInt(e.target.value) || 0 }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">최대값</label>
          <Input
            type="number"
            value={options.max}
            onChange={(e) => setOptions(prev => ({ ...prev, max: parseInt(e.target.value) || 0 }))}
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">생성 개수</label>
        <Input
          type="number"
          min={1}
          max={100}
          value={options.count}
          onChange={(e) => setOptions(prev => ({ ...prev, count: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }))}
        />
      </div>
      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.allowDuplicates}
            onChange={(e) => setOptions(prev => ({ ...prev, allowDuplicates: e.target.checked }))}
            className="form-checkbox"
          />
          <span className="text-sm">중복 허용</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={options.sort}
            onChange={(e) => setOptions(prev => ({ ...prev, sort: e.target.checked }))}
            className="form-checkbox"
          />
          <span className="text-sm">오름차순 정렬</span>
        </label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={generateNumbers}>숫자 생성</Button>
        <Button variant="secondary" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-1" /> 초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {generatedNumbers.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">숫자를 생성해주세요.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{generatedNumbers.length}개 생성됨</span>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              {copiedAll ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
              전체 복사
            </Button>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {generatedNumbers.map((num, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-muted rounded-md"
              >
                <code className="text-sm font-mono select-all">{num}</code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(String(num), index)}
                  className="shrink-0 h-6 w-6"
                >
                  {copiedIndex === index ? (
                    <Check className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        </>
      )}

      {history.length > 0 && (
        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">이전 생성 기록</span>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {history.map((entry, i) => (
              <div key={i} className="p-2 bg-muted rounded-md text-xs">
                <div className="flex justify-between text-muted-foreground mb-1">
                  <span>{entry.numbers.length}개</span>
                  <span>{entry.timestamp.toLocaleTimeString()}</span>
                </div>
                <code className="break-all">{entry.numbers.join(', ')}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>랜덤 숫자 생성기</strong>는 지정한 범위 내에서 무작위 숫자를 뽑아주는 도구입니다. 최소값·최대값·개수를 설정하고 중복 허용 여부와 오름차순 정렬 옵션을 선택하면, 추첨·샘플링·테스트 데이터 등에 바로 쓸 수 있는 숫자를 만듭니다.
        </p>
        <p>
          복권 번호 생성, 경품 추첨, A/B 테스트 샘플 추출, 시뮬레이션용 난수, 게임 이벤트 확률 검증 등 다양한 상황에서 활용됩니다. 중복을 막으면 로또처럼 고유한 번호 집합을, 중복을 허용하면 여러 번 뽑기 시나리오를 만들 수 있습니다.
        </p>
        <p>
          개발자와 데이터 분석가에게는 테스트 데이터 생성 도구로, 이벤트 운영자와 교육자에게는 공정한 추첨 도구로 유용합니다. 최근 10회 생성 기록도 함께 제공되어 반복 작업에 편리합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          생성에는 Math.random()을 사용하며 통계적으로 균등한 분포를 가집니다. 단, 보안이 필요한 난수(복권 당첨 번호 발표 등)에는 암호학적 난수 생성기를 별도로 사용하세요. 기록은 브라우저 세션 동안만 유지됩니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">기본 생성 공식</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">random = floor(random() × (max - min + 1)) + min</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">중복 방지 로직</h4>
          <p>중복을 허용하지 않을 때는 이미 뽑힌 숫자를 집합(Set)으로 추적합니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">중복 불가 시: (max - min + 1) ≥ 개수</p>
          </div>
          <p className="text-sm text-muted-foreground">범위보다 많은 개수를 요청하면 생성이 제한됩니다.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">정렬</h4>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">Array.sort((a, b) =&gt; a - b)</p>
          </div>
          <p>오름차순 정렬 옵션을 켜면 결과를 크기순으로 정리합니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">복권 번호</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중복 불가와 오름차순 정렬을 사용하세요.</li>
            <li>범위와 개수를 규정에 맞춰 설정하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">공정한 추첨</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중복 허용으로 여러 번 뽑기 시나리오를 만들 수 있습니다.</li>
            <li>당첨자 선정 전 범위를 참가자에게 공개하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">테스트 데이터</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>범위 내 난수로 샘플 입력값을 만드세요.</li>
            <li>반복 검증 시 기록 기능을 활용하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">게임 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>이벤트·아이템 드롭 확률 시뮬레이션에 사용하세요.</li>
            <li>난수 시드를 바꿔 분포를 관찰하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">범위 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>최소값이 최대값보다 크면 자동으로 교환됩니다.</li>
            <li>중복 불가 시 개수가 범위를 넘지 않게 하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">보안 난수</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>공인된 당첨·인증 용도에는 부적합합니다.</li>
            <li>필요 시 별도 암호학적 난수기를 사용하세요.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="랜덤 숫자 생성기"
      description="지정된 범위에서 무작위 숫자를 생성합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RandomNumberGenerator;
