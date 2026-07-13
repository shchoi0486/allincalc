'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

export default function StandardDeviationCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [input, setInput] = useState('');
  const [result, setResult] = useState<{
    count: number; mean: number; populationVariance: number; sampleVariance: number;
    populationStd: number; sampleStd: number; steps: { value: number; diff: number; diffSq: number }[];
  } | null>(null);

  const calculate = useCallback(() => {
    const nums = input.split(/[,，\s]+/).map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
    if (nums.length < 2) { setResult(null); return; }
    const n = nums.length;
    const mean = nums.reduce((a, b) => a + b, 0) / n;
    const steps = nums.map(value => {
      const diff = value - mean;
      return { value, diff, diffSq: diff * diff };
    });
    const sumDiffSq = steps.reduce((a, s) => a + s.diffSq, 0);
    const popVar = sumDiffSq / n;
    const sampleVar = sumDiffSq / (n - 1);
    setResult({
      count: n, mean, populationVariance: popVar, sampleVariance: sampleVar,
      populationStd: Math.sqrt(popVar), sampleStd: Math.sqrt(sampleVar), steps,
    });
  }, [input]);

  const reset = () => { setInput(''); setResult(null); };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('숫자 목록 (콤마 또는 공백 구분)', 'Number List (comma or space separated)')}</Label>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={isKo ? '예: 2, 4, 4, 4, 5, 5, 7, 9' : 'e.g. 2, 4, 4, 4, 5, 5, 7, 9'}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculate} className="flex-1">{L('계산', 'Calculate')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{L('데이터 수 (n)', 'Count (n)')}</p>
              <p className="text-xl font-bold">{result.count}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{L('평균 (μ)', 'Mean (μ)')}</p>
              <p className="text-xl font-bold">{result.mean.toFixed(4)}</p>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('모집단 분산 (σ²)', 'Population Variance (σ²)')}</p>
            <p className="text-lg font-bold">{result.populationVariance.toFixed(4)}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('모집단 표준편차 (σ)', 'Population Std Dev (σ)')}</p>
            <p className="text-2xl font-bold text-primary">{result.populationStd.toFixed(4)}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('표본 분산 (s²)', 'Sample Variance (s²)')}</p>
            <p className="text-lg font-bold">{result.sampleVariance.toFixed(4)}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('표본 표준편차 (s)', 'Sample Std Dev (s)')}</p>
            <p className="text-2xl font-bold text-primary">{result.sampleStd.toFixed(4)}</p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2 text-sm">{L('단계별 계산', 'Step-by-Step')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="p-1 text-left">x</th>
                    <th className="p-1 text-left">x - μ</th>
                    <th className="p-1 text-left">(x - μ)²</th>
                  </tr>
                </thead>
                <tbody>
                  {result.steps.map((s, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="p-1 font-mono">{s.value}</td>
                      <td className="p-1 font-mono">{s.diff.toFixed(4)}</td>
                      <td className="p-1 font-mono">{s.diffSq.toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs mt-2 text-muted-foreground">
              Σ(x - μ)² = {result.steps.reduce((a, s) => a + s.diffSq, 0).toFixed(4)}
            </p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? '숫자를 입력하세요' : 'Enter numbers to calculate'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('표준편차 계산기', 'Standard Deviation Calculator')}</strong>{L('는 데이터셋의 산포도를 측정하는 표준편차를 계산하는 통계 도구입니다.', ' is a statistics tool that calculates the standard deviation, a measure of data dispersion.')}
        </p>
        <p>
          {L('표준편차는 데이터가 평균으로부터 얼마나 퍼져 있는지를 나타냅니다. 표준편차가 작으면 데이터가 평균에 가깝게 모여 있고, 크면 데이터가 넓게 퍼져 있다는 의미입니다.', 'Standard deviation indicates how spread out the data is from the mean. A small standard deviation means data is clustered around the mean, while a large one means data is widely spread.')}
        </p>
        <p>
          {L('이 계산기는 모집단 표준편차(σ)와 표본 표준편차(s)를 모두 계산하며, 분모가 다르다는 점에 유의하세요:', 'This calculator computes both population standard deviation (σ) and sample standard deviation (s); note the different denominators:')}
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>{L('모집단:', 'Population:')}</strong> {L('전체 데이터를 모두 포함할 때 (분모: N)', 'When all data is included (denominator: N)')}</li>
          <li><strong>{L('표본:', 'Sample:')}</strong> {L('전체 중 일부를 표본으로 사용할 때 (분모: N-1, 베팔 교정)', 'When a subset is used as a sample (denominator: N-1, Bessel correction)')}</li>
        </ul>
        <TermGlossary items={[
          { term: L('표준편차(Standard Deviation)', 'Standard Deviation'), desc: L('데이터의 산포도를 나타내는 가장 널리 쓰이는 통계량으로, 분산의 제곱근입니다.', 'The most widely used statistic for data dispersion; the square root of variance.') },
          { term: L('분산(Variance)', 'Variance'), desc: L('데이터와 평균의 차이를 제곱한 값의 평균입니다.', 'The average of squared differences between data and mean.') },
          { term: L('모집단 vs 표본', 'Population vs Sample'), desc: L('모집단은 관심 대상 전체이며, 표본은 모집단에서 추출한 일부입니다. 표본은 모집단을 대표하되, N-1로 나누어 편향을 보정합니다.', 'Population is the entire group of interest; sample is a subset drawn from it. Sample uses N-1 to correct bias.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('평균 (Mean)', 'Mean')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">μ = Σx / N</p>
          </div>
          <p className="text-sm">{L('모든 데이터의 합을 데이터 수로 나눕니다.', 'Sum all data and divide by the count.')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('모집단 표준편차', 'Population Standard Deviation')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">σ = √(Σ(x - μ)² / N)</p>
          </div>
          <p className="text-sm">{L('전체 데이터를 사용하며, 분모는 데이터 수(N)입니다.', 'Uses all data; denominator is the count (N).')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('표본 표준편차', 'Sample Standard Deviation')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">s = √(Σ(x - x̄)² / (n - 1))</p>
          </div>
          <p className="text-sm">{L('표본을 사용하며, 분모는 n-1(베팔 교정)입니다. 모집단 분산을 추정할 때 사용합니다.', 'Uses sample data; denominator is n-1 (Bessel correction). Used when estimating population variance.')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('표준편차 해석', 'Interpreting Standard Deviation')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>{L('정규분포의 68-95-99.7 규칙:', '68-95-99.7 Rule:')}</strong></li>
            <li>{L('평균 ± 1σ: 약 68%의 데이터', 'Mean ± 1σ: ~68% of data')}</li>
            <li>{L('평균 ± 2σ: 약 95%의 데이터', 'Mean ± 2σ: ~95% of data')}</li>
            <li>{L('평균 ± 3σ: 약 99.7%의 데이터', 'Mean ± 3σ: ~99.7% of data')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('실생활 활용', 'Real-Life Applications')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>{L('금융:', 'Finance:')}</strong> {L('주식 수익률의 변동성 측정', 'Measuring volatility of stock returns')}</li>
            <li><strong>{L('품질관리:', 'Quality control:')}</strong> {L('제품 치수의 일관성 확인', 'Checking consistency of product dimensions')}</li>
            <li><strong>{L('시험 점수:', 'Test scores:')}</strong> {L('반 내 성적 분포 분석', 'Analyzing grade distribution within a class')}</li>
            <li><strong>{L('기상:', 'Weather:')}</strong> {L('기온 변화의 불안정성 측정', 'Measuring temperature variability')}</li>
          </ul>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-r-lg">
          <p className="font-bold text-sm">{L('모집단 vs 표본, 언제 어떤 것을 사용하나?', 'Population vs Sample: When to use which?')}</p>
          <p className="text-xs mt-1">
            {L('관심 있는 전체 데이터를 다 가지고 있으면 모집단(σ), 전체 중 일부만 관찰했으면 표본(s)을 사용합니다. 예를 들어, "우리 반 학생 전체의 성적"은 모집단, "무작위로 뽑은 10명의 성적"은 표본입니다.', 'If you have all the data of interest, use population (σ); if you observed only a subset, use sample (s). For example, "all students in our class" is population, "10 randomly selected students" is sample.')}
          </p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '표준편차 계산기' : 'Standard Deviation Calculator'}
      description={isKo ? '데이터셋의 평균, 분산, 표준편차를 모집단과 표본으로 구분하여 계산합니다.' : 'Calculate mean, variance, and standard deviation for population and sample datasets.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}