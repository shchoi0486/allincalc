'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

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
  const { dict, locale } = useI18n();
  const t = dict.virtualDice;
  const isKo = locale === 'ko';
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
        <label className="text-sm font-medium">{t.inputs.diceCount}</label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((count) => (
            <Button
              key={count}
              variant={diceCount === count ? 'default' : 'outline'}
              size="sm"
              onClick={() => changeDiceCount(count)}
            >
              {count}{isKo ? '개' : ''}
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
          {t.results.sum}: {values.reduce((a, b) => a + b, 0)}
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={rollDice} disabled={isRolling} className="px-8">
          {isRolling ? t.inputs.rolling : t.inputs.rollDice}
        </Button>
        <Button variant="secondary" onClick={resetDice}>
          {t.inputs.reset}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.results.totalRolls}</p>
            <p className="text-3xl font-bold text-blue-500">{rollHistory.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.results.cumulativeSum}</p>
            <p className="text-3xl font-bold text-green-500">{totalSum}</p>
          </CardContent>
        </Card>
      </div>

      {rollHistory.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">{t.results.recentHistory}</p>
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
            <p className="text-sm font-medium mb-2">{t.results.average}:</p>
            <p className="text-xl font-bold">
              {(totalSum / rollHistory.length).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t.results.theoreticalAverage}: {diceCount * 3.5} ({t.results.perDice} 3.5)
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          ${t.descriptionContent.heading}
        </p>
        <p>
          ${t.descriptionContent.p1}
        </p>
        <p>
          ${t.descriptionContent.p2}
        </p>
        <p>
          ${t.descriptionContent.p3}
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.heading}</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.formula}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            ${t.formula.desc}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.expectedValue}</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.expectedFormula}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            ${t.formula.expectedDesc}
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">${t.tips.heading}</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            ${t.tips.items.map((item: { title: string; desc: string }) => `
            <li><strong>${item.title}:</strong> ${item.desc}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default VirtualDice;
