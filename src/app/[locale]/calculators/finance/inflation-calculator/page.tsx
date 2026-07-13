'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatNumber, parseNumber } from '@/utils/formatNumber';

export default function InflationCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const currencySymbol = isKo ? '₩' : '$';

  const [pastAmount, setPastAmount] = useState('10000');
  const [pastIndex, setPastIndex] = useState('85');
  const [currentIndex, setCurrentIndex] = useState('110');
  const [years, setYears] = useState('5');
  const [result, setResult] = useState<{
    currentEquivalent: number;
    purchasingPowerLoss: number;
    purchasingPowerLossPercent: number;
    annualInflationRate: number;
    multiplier: number;
  } | null>(null);

  const handleCalculate = () => {
    const amount = parseNumber(pastAmount);
    const pIdx = parseNumber(pastIndex);
    const cIdx = parseNumber(currentIndex);
    const n = parseInt(years, 10) || 1;

    if (pIdx <= 0 || cIdx <= 0 || n <= 0) return;

    const currentEquivalent = amount * (cIdx / pIdx);
    const purchasingPowerLoss = currentEquivalent - amount;
    const purchasingPowerLossPercent = ((cIdx - pIdx) / pIdx) * 100;
    const annualInflationRate = (Math.pow(cIdx / pIdx, 1 / n) - 1) * 100;
    const multiplier = cIdx / pIdx;

    setResult({
      currentEquivalent,
      purchasingPowerLoss,
      purchasingPowerLossPercent,
      annualInflationRate,
      multiplier,
    });
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pastAmount">{isKo ? `과거 금액 (${currencySymbol})` : `Past Amount (${currencySymbol})`}</Label>
        <Input
          id="pastAmount"
          value={pastAmount}
          onChange={(e) => setPastAmount(e.target.value)}
          placeholder="10000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="pastIndex">{isKo ? '과거 연도 물가지수' : 'Past Year Price Index'}</Label>
        <Input
          id="pastIndex"
          value={pastIndex}
          onChange={(e) => setPastIndex(e.target.value)}
          placeholder="85"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="currentIndex">{isKo ? '현재 연도 물가지수' : 'Current Year Price Index'}</Label>
        <Input
          id="currentIndex"
          value={currentIndex}
          onChange={(e) => setCurrentIndex(e.target.value)}
          placeholder="110"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="years">{isKo ? '경과 연수' : 'Years Elapsed'}</Label>
        <Input
          id="years"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          placeholder="5"
          className="text-right"
          type="number"
          min="1"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
    </div>
  );

  const resultSection = result ? (
    <Card>
      <CardHeader>
        <CardTitle>{isKo ? '물가상승률 결과' : 'Inflation Result'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-muted-foreground">{isKo ? '현재 동일 구매력 금액' : 'Equivalent Purchasing Power'}</p>
          <p className="text-3xl font-bold text-primary">{currencySymbol}{formatNumber(Math.round(result.currentEquivalent))}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '구매력 변화' : 'Purchasing Power Change'}</span>
          <span className="font-bold text-destructive">+{result.purchasingPowerLossPercent.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '연평균 물가상승률' : 'Avg Annual Inflation'}</span>
          <span className="font-semibold">{result.annualInflationRate.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '물가 배율' : 'Price Multiplier'}</span>
          <span className="font-semibold">{result.multiplier.toFixed(4)}x</span>
        </div>
        <div className="p-3 bg-muted rounded-lg text-sm text-center">
          {isKo
            ? `예전 ${currencySymbol}${formatNumber(parseNumber(pastAmount))}의 구매력은 현재 약 ${currencySymbol}${formatNumber(Math.round(result.currentEquivalent))}와 동일합니다.`
            : `The purchasing power of ${currencySymbol}${formatNumber(parseNumber(pastAmount))} in the past is equivalent to about ${currencySymbol}${formatNumber(Math.round(result.currentEquivalent))} today.`
          }
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      {isKo ? '정보 입력 후 계산하기 버튼을 눌러주세요.' : 'Enter values and click Calculate.'}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          {isKo ? '물가상승률 계산기는 과거의 금액이 현재의 화폐 가치로 환산하면 얼마나 되는지, 그리고 연평균 물가상승률은 어느 정도인지 계산해주는 도구입니다. 물가지수를 이용하여 실제 구매력의 변화를 확인할 수 있습니다.' : 'The Inflation Calculator converts a past amount to its current monetary value and computes the average annual inflation rate. Using price indices, it shows the real change in purchasing power.'}</p>
        <TermGlossary items={[
          { term: isKo ? '물가지수' : 'Price Index', desc: isKo ? '소비자물가의 변동을 측정하는 지표로, 기준연도를 100으로 하여 상대적으로 표시합니다.' : 'A measure of consumer price changes, expressed relatively with a base year set to 100.' },
          { term: isKo ? '구매력' : 'Purchasing Power', desc: isKo ? '화폐가 실제로 살 수 있는 재화·서비스의 양을 의미합니다. 물가가 오르면 구매력은 떨어집니다.' : 'The quantity of goods and services that currency can actually buy. When prices rise, purchasing power falls.' },
          { term: isKo ? '연평균 물가상승률' : 'Average Annual Inflation Rate', desc: isKo ? '연도별 물가 상승률의 기하평균으로, 일정 기간 동안의 평균적인 물가 상승 속도를 나타냅니다.' : 'The geometric mean of yearly inflation rates, representing the average pace of price increases over a period.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '물가상승률 계산 공식' : 'Inflation Calculation Formulas'}</p>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 현재 가치 환산' : '1. Present Value Conversion'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '현재가치 = 과거금액 × (현재물가지수 / 과거물가지수)' : 'Present Value = Past Amount × (Current Index / Past Index)'}
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 연평균 물가상승률' : '2. Average Annual Inflation Rate'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '연평균 상승률 = (현재지수 / 과거지수)^(1/n) - 1' : 'Annual Rate = (Current Index / Past Index)^(1/n) - 1'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{isKo ? '※ n = 경과 연수' : '※ n = number of years elapsed'}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '3. 구매력 변화율' : '3. Purchasing Power Change Rate'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '변화율 = (현재지수 - 과거지수) / 과거지수 × 100' : 'Change Rate = (Current Index - Past Index) / Past Index × 100'}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 물가상승률 활용 팁' : '💡 Inflation Calculator Tips'}</h2>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 투자 수익률은 실질 수익률로 비교하라' : '1. Compare Investment Returns Using Real Returns'}</h3>
          <p className="mt-2">{isKo ? '명목 수익률에서 물가상승률을 빼면 실질 수익률을 알 수 있습니다. 예를 들어 연 5% 수익률이지만 물가상승률이 3%라면 실질 수익률은 2%입니다. 물가를 감안한 투자 성과를 비교하는 것이 중요합니다.' : 'Subtract the inflation rate from the nominal return to get the real return. For example, a 5% return with 3% inflation gives a 2% real return. Comparing investment performance adjusted for inflation is crucial.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. 연금·저축 목표는 실질 가치로 설정하라' : '2. Set Pension/Savings Goals in Real Value'}</h3>
          <p className="mt-2">{isKo ? '은퇴 후 30년 뒤 10억 원이면 현재의 약 4~5억 원 정도의 구매력을 가집니다. 물가상승률을 반영하여 연금·저축 목표를 설정해야 합니다.' : '1 billion won in 30 years has the purchasing power of roughly 400-500 million won today. Set pension/savings goals reflecting inflation.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '3. 물가지수 선택이 중요하다' : '3. Choosing the Right Price Index Matters'}</h3>
          <p className="mt-2">{isKo ? '한국은행 소비자물가지수(CPI)가 가장 일반적으로 사용됩니다. 다만 식품·주택 등 개인별 지출 구조가 다르므로, 체감 물가와 차이가 있을 수 있습니다. GDP 디플레이터, 생산자물가지수 등도 참고하면 더 정확한 분석이 가능합니다.' : 'The Bank of Korea Consumer Price Index (CPI) is most commonly used. However, individual spending structures differ (food, housing, etc.), so perceived inflation may vary. GDP deflator and Producer Price Index provide more precise analysis.'}</p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '물가상승률 계산기' : 'Inflation Calculator'}
      description={isKo ? '과거 금액의 현재 구매력과 연평균 물가상승률을 계산합니다.' : 'Calculate the current purchasing power of past amounts and average annual inflation.'}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
