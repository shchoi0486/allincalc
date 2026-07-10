'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const CoinFlip: React.FC = () => {
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [headsCount, setHeadsCount] = useState(0);
  const [tailsCount, setTailsCount] = useState(0);
  const [totalFlips, setTotalFlips] = useState(0);
  const [flipHistory, setFlipHistory] = useState<('heads' | 'tails')[]>([]);

  const flipCoin = () => {
    if (isFlipping) return;

    setIsFlipping(true);
    setResult(null);

    setTimeout(() => {
      const newResult: 'heads' | 'tails' = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(newResult);
      setTotalFlips(prev => prev + 1);
      setFlipHistory(prev => [newResult, ...prev].slice(0, 20));

      if (newResult === 'heads') {
        setHeadsCount(prev => prev + 1);
      } else {
        setTailsCount(prev => prev + 1);
      }

      setIsFlipping(false);
    }, 600);
  };

  const resetStats = () => {
    setResult(null);
    setHeadsCount(0);
    setTailsCount(0);
    setTotalFlips(0);
    setFlipHistory([]);
  };

  const inputSection = (
    <div className="flex flex-col items-center space-y-6">
      <div
        className={`relative w-40 h-40 rounded-full cursor-pointer transition-transform duration-300 ${
          isFlipping ? 'animate-spin' : ''
        } ${
          result === 'heads'
            ? 'bg-gradient-to-br from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-300/50'
            : result === 'tails'
            ? 'bg-gradient-to-br from-gray-300 to-gray-500 shadow-lg shadow-gray-300/50'
            : 'bg-gradient-to-br from-yellow-200 to-gray-200'
        }`}
        onClick={flipCoin}
        style={{
          animationDuration: isFlipping ? '0.1s' : '0s',
          transform: isFlipping ? 'rotateY(720deg)' : 'rotateY(0deg)',
          transition: isFlipping ? 'transform 0.6s ease-out' : 'none',
        }}
      >
        <div className="absolute inset-2 rounded-full border-4 border-white/30 flex items-center justify-center">
          <span className="text-4xl font-bold text-white/80 drop-shadow-lg">
            {result === 'heads' ? 'H' : result === 'tails' ? 'T' : '?'}
          </span>
        </div>
      </div>

      <div className="text-center">
        {isFlipping ? (
          <p className="text-lg text-muted-foreground">던지는 중...</p>
        ) : result ? (
          <p className="text-2xl font-bold">
            {result === 'heads' ? '앞면 (Heads)' : '뒷면 (Tails)'}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">동전을 클릭하여 던지세요</p>
        )}
      </div>

      <div className="flex space-x-2">
        <Button onClick={flipCoin} disabled={isFlipping} className="px-8">
          {isFlipping ? '던지는 중...' : '동전 던지기'}
        </Button>
        <Button variant="secondary" onClick={resetStats}>
          초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">앞면</p>
            <p className="text-3xl font-bold text-yellow-500">{headsCount}</p>
            <p className="text-xs text-muted-foreground">
              {totalFlips > 0 ? Math.round((headsCount / totalFlips) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">총 횟수</p>
            <p className="text-3xl font-bold text-blue-500">{totalFlips}</p>
            <p className="text-xs text-muted-foreground">던짐</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">뒷면</p>
            <p className="text-3xl font-bold text-gray-500">{tailsCount}</p>
            <p className="text-xs text-muted-foreground">
              {totalFlips > 0 ? Math.round((tailsCount / totalFlips) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {flipHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">최근 기록 (최신순):</p>
            <div className="flex flex-wrap gap-1">
              {flipHistory.map((flip, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    flip === 'heads'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {flip === 'heads' ? '앞' : '뒷'}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {totalFlips > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">앞면/뒷면 비율:</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-yellow-400 h-4 transition-all duration-300"
                style={{ width: `${(headsCount / totalFlips) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>앞면 {Math.round((headsCount / totalFlips) * 100)}%</span>
              <span>뒷면 {Math.round((tailsCount / totalFlips) * 100)}%</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          가상 동전 던지기로 공정한 의사결정을 하세요!
        </p>
        <p>
          동전 던지기는 가장 단순하면서도 공정한 의사결정 도구로, 각 결과가 50%의 확률로 발생합니다.
          컴퓨터 알고리즘을 통해 앞면과 뒷면이 동일한 확률로 나오도록 설계되어 있어
          두 가지 선택지 중 하나를 공정하게 결정해야 할 때 유용합니다.
        </p>
        <p>
          여러 번 던진 결과를 기록하고 통계를 분석하면 확률과 통계의 기본 개념을 직관적으로 이해할 수 있어
          교육적인 목적에도 활용할 수 있습니다.
        </p>
        <p>
          게임의 순서 정하기, 간단한 결정, 확률 학습, 교육용 시뮬레이션 등
          다양한 상황에서 가볍게 사용할 수 있는 만능 의사결정 도구입니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">확률의 법칙 (대수의 법칙)</h3>
          <p className="mb-2 text-muted-foreground">
            동전 던지기는 이산 확률 분포의 가장 기본적인 예시입니다.
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">P(앞면) = P(뒷면) = 0.5 (50%)</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            대수의 법칙에 따르면, 던지는 횟수가 늘어날수록 앞면과 뒷면의 비율은 50:50에 수렴합니다.
            예를 들어 1000번 던지면 앞면이 약 480~520번 사이로 나오는 경향이 있습니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">랜덤 생성 방식</h3>
          <p className="text-muted-foreground">
            JavaScript의 Math.random() 함수를 사용하여 0~1 사이의 균일 분포 난수를 생성하고,
            0.5 미만이면 앞면, 이상이면 뒷면으로 판정합니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">동전 던지기 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>공정한 의사결정:</strong> 두 선택지 사이에서 공정하게 결정해야 할 때 활용합니다.</li>
            <li><strong>순서 정하기:</strong> 게임이나 활동의 시작 순서를 정할 때 편리합니다.</li>
            <li><strong>확률 학습:</strong> 자녀에게 확률의 기본 개념을 가르칠 때 체험형 학습 도구로 활용할 수 있습니다.</li>
            <li><strong>여러 번 던지기:</strong> 한 번만으로는 불공평할 수 있으므로 3번이나 5번 중多数결로 결정하면 더 공정합니다.</li>
            <li><strong>기록 관리:</strong> 던진 결과를 기록하면 대수의 법칙을 직접 체험할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="동전 던지기"
      description="랜덤으로 앞면 또는 뒷면을 결정합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CoinFlip;
