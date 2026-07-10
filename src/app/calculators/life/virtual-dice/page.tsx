'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const DiceFace: React.FC<{ value: number; isRolling: boolean }> = ({ value, isRolling }) => {
  const getDots = (val: number): boolean[][] => {
    const patterns: Record<number, boolean[][]> = {
      1: [
        [false, false, false],
        [false, true, false],
        [false, false, false],
      ],
      2: [
        [false, false, true],
        [false, false, false],
        [true, false, false],
      ],
      3: [
        [false, false, true],
        [false, true, false],
        [true, false, false],
      ],
      4: [
        [true, false, true],
        [false, false, false],
        [true, false, true],
      ],
      5: [
        [true, false, true],
        [false, true, false],
        [true, false, true],
      ],
      6: [
        [true, false, true],
        [true, false, true],
        [true, false, true],
      ],
    };
    return patterns[val] || patterns[1];
  };

  const dots = getDots(value);

  return (
    <div
      className={`w-20 h-20 bg-white rounded-xl border-2 border-gray-300 shadow-lg p-2 transition-all duration-200 ${
        isRolling ? 'animate-bounce' : ''
      }`}
    >
      <div className="grid grid-cols-3 grid-rows-3 gap-1 h-full">
        {dots.flat().map((hasDot, i) => (
          <div
            key={i}
            className={`rounded-full ${
              hasDot ? 'bg-gray-800' : 'bg-transparent'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

const VirtualDice: React.FC = () => {
  const [diceCount, setDiceCount] = useState(1);
  const [values, setValues] = useState<number[]>([1]);
  const [isRolling, setIsRolling] = useState(false);
  const [totalSum, setTotalSum] = useState(0);
  const [rollHistory, setRollHistory] = useState<number[]>([]);

  const rollDice = () => {
    if (isRolling) return;

    setIsRolling(true);
    const newValues: number[] = [];

    let rollCount = 0;
    const interval = setInterval(() => {
      const tempValues = Array.from({ length: diceCount }, () =>
        Math.floor(Math.random() * 6) + 1
      );
      setValues(tempValues);
      rollCount++;

      if (rollCount >= 10) {
        clearInterval(interval);
        const finalValues = Array.from({ length: diceCount }, () =>
          Math.floor(Math.random() * 6) + 1
        );
        setValues(finalValues);
        const sum = finalValues.reduce((a, b) => a + b, 0);
        setTotalSum(prev => prev + sum);
        setRollHistory(prev => [sum, ...prev].slice(0, 10));
        setIsRolling(false);
      }
    }, 60);
  };

  const changeDiceCount = (count: number) => {
    setDiceCount(count);
    setValues(Array(count).fill(1));
  };

  const resetDice = () => {
    setValues(Array(diceCount).fill(1));
    setTotalSum(0);
    setRollHistory([]);
  };

  const inputSection = (
    <div className="flex flex-col items-center space-y-6">
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium">주사위 개수:</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((count) => (
            <Button
              key={count}
              variant={diceCount === count ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeDiceCount(count)}
            >
              {count}개
            </Button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {values.map((value, index) => (
          <DiceFace key={index} value={value} isRolling={isRolling} />
        ))}
      </div>

      {diceCount > 1 && (
        <div className="text-2xl font-bold">
          합계: {values.reduce((a, b) => a + b, 0)}
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={rollDice} disabled={isRolling} className="px-8">
          {isRolling ? '굴리는 중...' : '주사위 굴리기'}
        </Button>
        <Button variant="secondary" onClick={resetDice}>
          초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">총 굴린 횟수</p>
            <p className="text-3xl font-bold text-blue-500">{rollHistory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">누적 합계</p>
            <p className="text-3xl font-bold text-green-500">{totalSum}</p>
          </CardContent>
        </Card>
      </div>

      {rollHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">최근 기록 (최신순):</p>
            <div className="flex flex-wrap gap-2">
              {rollHistory.map((sum, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                >
                  {sum}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {rollHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">평균:</p>
            <p className="text-xl font-bold">
              {(totalSum / rollHistory.length).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              이론적 평균: {diceCount * 3.5} (1개당 3.5)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg">가상 주사위는 실제 주사위 없이도 랜덤 숫자를 생성할 수 있는 도구입니다.</p>
        <p>1개에서 4개까지의 주사위를 동시에 굴릴 수 있으며, 주사위 야구, 보드게임, TRPG 등 다양한 게임에서 활용할 수 있습니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">주사위 확률</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">P(각 면) = 1/6 ≈ 16.67%</code>
          </div>
          <p className="mt-2">공정한 6면체 주사위에서 각 면이 나올 확률은 동일하며, n개의 주사위를 굴렸을 때의 합계는 이산 균일 분포의 합으로 나타납니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">기대값</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">E(합계) = n × 3.5</code>
          </div>
          <p className="mt-2">여기서 n은 주사위의 개수입니다. 1개의 주사위를 100번 굴렸다면 합계는 약 350에 수렴합니다.</p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">주사위 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>부르프리즈:</strong> 6면체 주사위로 간단한 랜덤 숫자 생성</li>
            <li><strong>TRPG:</strong> D&D 등 테이블 롤플레잉 게임에서 주사위 굴림 대용</li>
            <li><strong>교육:</strong> 확률과 통계 개념을 학생들에게 직관적으로 설명</li>
            <li><strong>회의:</strong> 팀 회의에서 공정한 순서 정하기</li>
            <li><strong>justice:</strong> 여러 선택지 중 공정하게 선택할 때</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="가상 주사위"
      description="랜덤으로 주사위를 굴립니다. 1~4개까지 지원합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default VirtualDice;
