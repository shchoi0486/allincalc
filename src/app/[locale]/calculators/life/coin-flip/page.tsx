'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const CoinFlip: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.coinFlip;
  const isKo = locale === 'ko';
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
          <p className="text-lg text-muted-foreground">{t.results.flipping}</p>
        ) : result ? (
          <p className="text-2xl font-bold">
            {result === 'heads' ? t.results.heads : t.results.tails}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">{t.results.clickToFlip}</p>
        )}
      </div>

      <div className="flex space-x-2">
        <Button onClick={flipCoin} disabled={isFlipping} className="px-8">
          {isFlipping ? t.inputs.flipping : t.inputs.flipCoin}
        </Button>
        <Button variant="secondary" onClick={resetStats}>
          {t.inputs.reset}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.results.headsCount}</p>
            <p className="text-3xl font-bold text-yellow-500">{headsCount}</p>
            <p className="text-xs text-muted-foreground">
              {totalFlips > 0 ? Math.round((headsCount / totalFlips) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.results.totalFlips}</p>
            <p className="text-3xl font-bold text-blue-500">{totalFlips}</p>
            <p className="text-xs text-muted-foreground">{t.results.flips}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">{t.results.tailsCount}</p>
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
            <p className="text-sm font-medium mb-2">{t.results.recentHistory}</p>
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
                  {flip === 'heads' ? (isKo ? '앞' : 'Heads') : (isKo ? '뒷' : 'Tails')}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {totalFlips > 0 && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-2">{t.results.headsTailsRatio}</p>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-yellow-400 h-4 transition-all duration-300"
                style={{ width: `${(headsCount / totalFlips) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{t.results.headsPercent} {Math.round((headsCount / totalFlips) * 100)}%</span>
              <span>{t.results.tailsPercent} {Math.round((tailsCount / totalFlips) * 100)}%</span>
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
          <p className="mb-2 text-muted-foreground">
            ${t.formula.desc}
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.formula}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            ${t.formula.lawOfLargeNumbers}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.randomGeneration}</h3>
          <p className="text-muted-foreground">
            ${t.formula.randomDesc}
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

export default CoinFlip;
