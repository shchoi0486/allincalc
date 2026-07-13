'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

export default function PercentageCalculatorPage() {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [mode1A, setMode1A] = useState('');
  const [mode1B, setMode1B] = useState('');
  const [mode2A, setMode2A] = useState('');
  const [mode2B, setMode2B] = useState('');
  const [mode3A, setMode3A] = useState('');
  const [mode3B, setMode3B] = useState('');
  const [result1, setResult1] = useState<number | null>(null);
  const [result2, setResult2] = useState<number | null>(null);
  const [result3, setResult3] = useState<number | null>(null);

  const calcMode1 = useCallback(() => {
    const a = parseFloat(mode1A);
    const b = parseFloat(mode1B);
    if (!isNaN(a) && !isNaN(b)) setResult1((a * b) / 100);
    else setResult1(null);
  }, [mode1A, mode1B]);

  const calcMode2 = useCallback(() => {
    const a = parseFloat(mode2A);
    const b = parseFloat(mode2B);
    if (!isNaN(a) && !isNaN(b) && b !== 0) setResult2((a / b) * 100);
    else setResult2(null);
  }, [mode2A, mode2B]);

  const calcMode3 = useCallback(() => {
    const a = parseFloat(mode3A);
    const b = parseFloat(mode3B);
    if (!isNaN(a) && !isNaN(b)) setResult3(a * (1 + b / 100));
    else setResult3(null);
  }, [mode3A, mode3B]);

  const resetMode1 = () => { setMode1A(''); setMode1B(''); setResult1(null); };
  const resetMode2 = () => { setMode2A(''); setMode2B(''); setResult2(null); };
  const resetMode3 = () => { setMode3A(''); setMode3B(''); setResult3(null); };

  const inputSection = (
    <Tabs defaultValue="mode1">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mode1">{L('A의 B%?', 'A of B%?')}</TabsTrigger>
        <TabsTrigger value="mode2">{L('A는 B의 몇%?', 'A is what % of B?')}</TabsTrigger>
        <TabsTrigger value="mode3">{L('A에서 B% 증감', 'A +/- B%')}</TabsTrigger>
      </TabsList>
      <TabsContent value="mode1" className="space-y-4 mt-4">
        <div>
          <Label>{L('값 (A)', 'Value (A)')}</Label>
          <Input type="number" value={mode1A} onChange={e => setMode1A(e.target.value)} placeholder={isKo ? '예: 200' : 'e.g. 200'} />
        </div>
        <div>
          <Label>{L('퍼센트 (B%)', 'Percentage (B%)')}</Label>
          <Input type="number" value={mode1B} onChange={e => setMode1B(e.target.value)} placeholder={isKo ? '예: 15' : 'e.g. 15'} />
        </div>
        <div className="flex space-x-2">
          <Button onClick={calcMode1} className="flex-1">{L('계산', 'Calculate')}</Button>
          <Button onClick={resetMode1} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
        </div>
      </TabsContent>
      <TabsContent value="mode2" className="space-y-4 mt-4">
        <div>
          <Label>{L('값 (A)', 'Value (A)')}</Label>
          <Input type="number" value={mode2A} onChange={e => setMode2A(e.target.value)} placeholder={isKo ? '예: 30' : 'e.g. 30'} />
        </div>
        <div>
          <Label>{L('전체 값 (B)', 'Total Value (B)')}</Label>
          <Input type="number" value={mode2B} onChange={e => setMode2B(e.target.value)} placeholder={isKo ? '예: 200' : 'e.g. 200'} />
        </div>
        <div className="flex space-x-2">
          <Button onClick={calcMode2} className="flex-1">{L('계산', 'Calculate')}</Button>
          <Button onClick={resetMode2} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
        </div>
      </TabsContent>
      <TabsContent value="mode3" className="space-y-4 mt-4">
        <div>
          <Label>{L('원래 값 (A)', 'Original Value (A)')}</Label>
          <Input type="number" value={mode3A} onChange={e => setMode3A(e.target.value)} placeholder={isKo ? '예: 100000' : 'e.g. 100000'} />
        </div>
        <div>
          <Label>{L('변화율 (B%, 음수 가능)', 'Change Rate (B%, negative for decrease)')}</Label>
          <Input type="number" value={mode3B} onChange={e => setMode3B(e.target.value)} placeholder={isKo ? '예: 20 또는 -10' : 'e.g. 20 or -10'} />
        </div>
        <div className="flex space-x-2">
          <Button onClick={calcMode3} className="flex-1">{L('계산', 'Calculate')}</Button>
          <Button onClick={resetMode3} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
        </div>
      </TabsContent>
    </Tabs>
  );

  const resultSection = (
    <Tabs defaultValue="mode1">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="mode1">{L('A의 B%', 'A of B%')}</TabsTrigger>
        <TabsTrigger value="mode2">{L('몇%?', 'What %?')}</TabsTrigger>
        <TabsTrigger value="mode3">{L('증감 결과', 'Change Result')}</TabsTrigger>
      </TabsList>
      <TabsContent value="mode1" className="mt-4">
        {result1 !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{isKo ? `${mode1A}의 ${mode1B}%` : `${mode1B}% of ${mode1A}`}</p>
            <p className="text-2xl font-bold">{result1.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">{isKo ? '값을 입력하세요' : 'Enter values to calculate'}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="mode2" className="mt-4">
        {result2 !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{isKo ? `${mode2A}는 ${mode2B}의` : `${mode2A} is what % of ${mode2B}`}</p>
            <p className="text-2xl font-bold">{result2.toLocaleString(undefined, { maximumFractionDigits: 4 })}%</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">{isKo ? '값을 입력하세요' : 'Enter values to calculate'}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="mode3" className="mt-4">
        {result3 !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{isKo ? `${mode3A}에서 ${mode3B}% ${parseFloat(mode3B) >= 0 ? '증가' : '감소'}` : `${mode3A} ${parseFloat(mode3B) >= 0 ? 'increased' : 'decreased'} by ${Math.abs(parseFloat(mode3B))}%`}</p>
            <p className="text-2xl font-bold">{result3.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {isKo ? `변화량: ${Math.abs(result3 - parseFloat(mode3A || '0')).toLocaleString(undefined, { maximumFractionDigits: 6 })}` : `Change: ${Math.abs(result3 - parseFloat(mode3A || '0')).toLocaleString(undefined, { maximumFractionDigits: 6 })}`}
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">{isKo ? '값을 입력하세요' : 'Enter values to calculate'}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('퍼센트 계산기', 'Percentage Calculator')}</strong>{L('는 일상생활과 업무에서 빈번하게 사용되는 퍼센트(%) 관련 계산을 손쉽게 수행할 수 있는 도구입니다. ', ' is a tool that makes it easy to perform percentage (%) calculations frequently used in daily life and work. ')}
          {L('할인율 계산, 세금 계산, 성적 분석, 수익률 비교 등 다양한 상황에서 활용됩니다.', 'It is used in various situations such as discount rate calculations, tax calculations, grade analysis, and return rate comparisons.')}
        </p>
        <p>
          {L('이 계산기는 세 가지 기본 퍼센트 계산 모드를 제공합니다:', 'This calculator provides three basic percentage calculation modes:')}
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>{L('A의 B%는?', 'What is B% of A?')}</strong> - {L('특정 값의 일정 비율을 계산합니다.', 'Calculates a certain proportion of a specific value.')}</li>
          <li><strong>{L('A는 B의 몇%?', 'A is what % of B?')}</strong> - {L('두 값 사이의 비율(퍼센트)을 구합니다.', 'Finds the ratio (percentage) between two values.')}</li>
          <li><strong>{L('A에서 B% 증감', 'A +/- B%')}</strong> - {L('값에 퍼센트를 적용하여 증감된 최종 값을 계산합니다.', 'Applies a percentage to a value and calculates the final value after increase or decrease.')}</li>
        </ul>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('퍼센트는 "100분의 1"을 의미하는 수학적 표현으로, 비율을 쉽게 비교하고 표현할 수 있게 해줍니다. 예를 들어, 50%는 절반, 25%는 사분의 일을 의미합니다.', 'Percentage is a mathematical expression meaning "one hundredth," making it easy to compare and express ratios. For example, 50% means half, 25% means one-quarter.')}
        </p>
        <TermGlossary items={[
          { term: L('퍼센트(%)', 'Percentage (%)'), desc: L('100을 기준으로 한 비율을 나타내는 수학적 표현입니다.', 'A mathematical expression representing a ratio based on 100.') },
          { term: L('비율(Ratio)', 'Ratio'), desc: L('두 값 사이의 크기 관계를 나타내며, 퍼센트는 이 비율을 100을 기준으로 표현한 것입니다.', 'Represents the size relationship between two values; percentage expresses this ratio based on 100.') },
          { term: L('감소율(Decrease Rate)', 'Decrease Rate'), desc: L('값이 감소한 비율을 나타내며, 음수 퍼센트로 표현할 수 있습니다.', 'The rate at which a value has decreased, which can be expressed as a negative percentage.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('모드 1: A의 B% 계산', 'Mode 1: B% of A')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">A × (B / 100)</p>
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>A</strong> - {L('기준 값 (전체)', 'Base value (total)')}</li>
            <li><strong>B</strong> - {L('퍼센트 값 (%)', 'Percentage value (%)')}</li>
            <li>{L('결과: A에서 B%에 해당하는 값', 'Result: The value corresponding to B% of A')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('모드 2: A는 B의 몇%?', 'Mode 2: A is what % of B?')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">(A / B) × 100</p>
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>A</strong> - {L('부분 값', 'Part value')}</li>
            <li><strong>B</strong> - {L('전체 값', 'Whole value')}</li>
            <li>{L('결과: A가 B 전체에서 차지하는 비율(%)', 'Result: The ratio (%) that A represents of the whole B')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('모드 3: A에서 B% 증감', 'Mode 3: A +/- B%')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">A × (1 ± B/100)</p>
          </div>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>A</strong> - {L('원래 값', 'Original value')}</li>
            <li><strong>B</strong> - {L('증감율 (%). 양수는 증가, 음수는 감소', 'Change rate (%). Positive for increase, negative for decrease')}</li>
            <li>{L('결과: 증감된 최종 값', 'Result: Final value after increase/decrease')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('계산 예시', 'Examples')}</h4>
          <div className="my-2 p-3 bg-muted rounded-lg space-y-2">
            <p className="font-mono text-sm">{L('모드 1: 200,000원의 15% = 200,000 × 0.15 = 30,000원', 'Mode 1: 15% of 200,000 = 200,000 × 0.15 = 30,000')}</p>
            <p className="font-mono text-sm">{L('모드 2: 30은 200의 몇%? = (30/200) × 100 = 15%', 'Mode 2: 30 is what % of 200? = (30/200) × 100 = 15%')}</p>
            <p className="font-mono text-sm">{L('모드 3: 100,000에서 20% 증가 = 100,000 × 1.2 = 120,000', 'Mode 3: 100,000 increased by 20% = 100,000 × 1.2 = 120,000')}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('실생활 활용 예시', 'Real-Life Applications')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>{L('쇼핑 할인:', 'Shopping discounts:')}</strong> {L('30% 할인된 59,900원 상품의 실제 가격: 59,900 × 0.7 = 41,930원', 'Actual price of a 30% discounted item at 59,900: 59,900 × 0.7 = 41,930')}</li>
            <li><strong>{L('세금 계산:', 'Tax calculation:')}</strong> {L('부가세 10% 포함 가격: 10,000원 × 1.1 = 11,000원', 'Price including 10% VAT: 10,000 × 1.1 = 11,000')}</li>
            <li><strong>{L('수익률:', 'Return rate:')}</strong> {L('1,000만원 투자 후 1,150만원이 되었다면 수익률 15%', 'If 10 million becomes 11.5 million, the return rate is 15%')}</li>
            <li><strong>{L('시험 점수:', 'Test scores:')}</strong> {L('50문제 중 42개 맞힘: (42/50) × 100 = 84%', '42 correct out of 50: (42/50) × 100 = 84%')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('자주 쓰는 퍼센트 변환', 'Common Percentage Conversions')}</h4>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">10% = 0.1</div>
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">25% = 0.25</div>
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">33.3% ≈ 1/3</div>
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">50% = 0.5</div>
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">75% = 0.75</div>
            <div className="p-2 bg-muted rounded text-sm text-center font-mono">100% = 1</div>
          </div>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-r-lg">
          <p className="font-bold text-sm">{L('알고 계셨나요?', 'Did you know?')}</p>
          <p className="text-xs mt-1">
            {L('30% 할인과 30% 추가 할인은 60% 할인이 아닙니다! 100,000원 상품에 30% 할인 → 70,000원, 여기에 추가 30% 할인 → 49,000원 (총 51% 할인). 이는 퍼센트의 "기준 값"이 달라지기 때문입니다.', '30% off plus another 30% off is NOT 60% off! A 100,000 item with 30% off → 70,000, then another 30% off → 49,000 (total 51% off). This is because the "base value" changes for each percentage.')}
          </p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '퍼센트 계산기' : 'Percentage Calculator'}
      description={isKo ? '세 가지 모드로 퍼센트(%) 관련 계산을 간편하게 수행합니다.' : 'Perform percentage calculations easily with three modes.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
