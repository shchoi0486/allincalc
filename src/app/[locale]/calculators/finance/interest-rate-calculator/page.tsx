'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { parseNumber } from '@/utils/formatNumber';

type RateUnit = 'annual' | 'monthly' | 'daily';

export default function InterestRateCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [inputRate, setInputRate] = useState('5');
  const [inputUnit, setInputUnit] = useState<RateUnit>('annual');
  const [compoundingFreq, setCompoundingFreq] = useState('12');
  const [result, setResult] = useState<{
    annualRate: number;
    monthlyRate: number;
    dailyRate: number;
    nominalRate: number;
    effectiveRate: number;
  } | null>(null);

  const handleCalculate = () => {
    const rate = parseNumber(inputRate) / 100;
    const n = parseInt(compoundingFreq, 10) || 12;

    let annualRate: number;

    switch (inputUnit) {
      case 'annual':
        annualRate = rate;
        break;
      case 'monthly':
        annualRate = rate * 12;
        break;
      case 'daily':
        annualRate = rate * 365;
        break;
      default:
        annualRate = rate;
    }

    const monthlyRate = annualRate / 12;
    const dailyRate = annualRate / 365;

    const effectiveRate = Math.pow(1 + annualRate / n, n) - 1;

    setResult({
      annualRate,
      monthlyRate,
      dailyRate,
      nominalRate: annualRate,
      effectiveRate,
    });
  };

  const fmt = (v: number) => (v * 100).toFixed(4);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="inputRate">{isKo ? '이자율 (%)' : 'Interest Rate (%)'}</Label>
        <Input
          id="inputRate"
          value={inputRate}
          onChange={(e) => setInputRate(e.target.value)}
          placeholder="5"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label>{isKo ? '입력 단위' : 'Input Unit'}</Label>
        <ToggleGroup type="single" value={inputUnit} onValueChange={(v: RateUnit) => { if (v) setInputUnit(v); }} className="w-full">
          <ToggleGroupItem value="annual" className="flex-1">{isKo ? '연이율' : 'Annual'}</ToggleGroupItem>
          <ToggleGroupItem value="monthly" className="flex-1">{isKo ? '월이율' : 'Monthly'}</ToggleGroupItem>
          <ToggleGroupItem value="daily" className="flex-1">{isKo ? '일이율' : 'Daily'}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="compoundingFreq">{isKo ? '이자 계산 주기 (연)' : 'Compounding Frequency (per year)'}</Label>
        <Input
          id="compoundingFreq"
          value={compoundingFreq}
          onChange={(e) => setCompoundingFreq(e.target.value)}
          placeholder="12"
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
        <CardTitle>{isKo ? '환산 결과' : 'Conversion Result'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '연이율' : 'Annual Rate'}</span>
          <span className="font-bold">{fmt(result.annualRate)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '월이율' : 'Monthly Rate'}</span>
          <span className="font-bold">{fmt(result.monthlyRate)}%</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '일이율' : 'Daily Rate'}</span>
          <span className="font-bold">{fmt(result.dailyRate)}%</span>
        </div>
        <div className="border-t pt-3 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{isKo ? '명목 이자율' : 'Nominal Rate'}</span>
            <span className="font-semibold">{fmt(result.nominalRate)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{isKo ? '실효 이자율' : 'Effective Rate'}</span>
            <span className="font-bold text-primary text-lg">{fmt(result.effectiveRate)}%</span>
          </div>
          <div className="p-3 bg-muted rounded-lg text-sm text-center">
            {isKo
              ? `명목 ${fmt(result.nominalRate)}% → 실효 ${fmt(result.effectiveRate)}% (복리 ${compoundingFreq}회)`
              : `Nominal ${fmt(result.nominalRate)}% → Effective ${fmt(result.effectiveRate)}% (compounded ${compoundingFreq}x)`
            }
          </div>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      {isKo ? '이자율 입력 후 계산하기 버튼을 눌러주세요.' : 'Enter an interest rate and click Calculate.'}
    </div>
  );

  const fullWidthSection = result ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{isKo ? '구분' : 'Type'}</TableHead>
          <TableHead className="text-right">{isKo ? '연이율' : 'Annual'}</TableHead>
          <TableHead className="text-right">{isKo ? '월이율' : 'Monthly'}</TableHead>
          <TableHead className="text-right">{isKo ? '일이율' : 'Daily'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-semibold">{isKo ? '명목 이자율' : 'Nominal Rate'}</TableCell>
          <TableCell className="text-right">{fmt(result.nominalRate)}%</TableCell>
          <TableCell className="text-right">{fmt(result.monthlyRate)}%</TableCell>
          <TableCell className="text-right">{fmt(result.dailyRate)}%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-semibold">{isKo ? '실효 이자율' : 'Effective Rate'}</TableCell>
          <TableCell className="text-right">{fmt(result.effectiveRate)}%</TableCell>
          <TableCell className="text-right">-</TableCell>
          <TableCell className="text-right">-</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          {isKo ? '이자율 변환 계산기는 연이율, 월이율, 일이율을 서로 환산하고, 명목 이자율과 실효 이자율(복리 적용)의 차이를 보여주는 도구입니다. 예금·대출·적금 상품의 실질 이자를 비교할 때 유용합니다.' : 'The Interest Rate Calculator converts between annual, monthly, and daily rates and shows the difference between nominal and effective (compound) interest rates. Useful for comparing the real interest of deposits, loans, and savings products.'}</p>
        <TermGlossary items={[
          { term: isKo ? '명목 이자율' : 'Nominal Interest Rate', desc: isKo ? '복리를 고려하지 않은 표면상의 이자율입니다. 상품에서 제시하는 이자율이 이에 해당합니다.' : 'The stated interest rate without considering compounding. This is the rate quoted by financial products.' },
          { term: isKo ? '실효 이자율' : 'Effective Interest Rate', desc: isKo ? '복리를 포함한 실제 이자 부담율 또는 수익률입니다. 이자 계산 주기가 짧을수록 명목 이자율보다 높아집니다.' : 'The actual interest burden or yield including compounding. The more frequent the compounding, the higher it is relative to the nominal rate.' },
          { term: isKo ? '복리' : 'Compound Interest', desc: isKo ? '이자가 원금에 더해져 다음 기간의 이자 계산에 포함되는 방식으로, 단리보다 실질 수익이 높습니다.' : 'Interest added to the principal for the next period\'s calculation; yields more than simple interest.' },
          { term: isKo ? '이자 계산 주기' : 'Compounding Frequency', desc: isKo ? '이자가 원금에 합쳐지는 주기로, 연 1회(연복리), 월 1회(월복리), 매일(일복리) 등이 있습니다.' : 'How often interest is added to principal: annually, monthly, daily, etc.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '이자율 환산 공식' : 'Interest Rate Conversion Formulas'}</p>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 연·월·일 이자율 환산' : '1. Annual/Monthly/Daily Rate Conversion'}</h3>
          <ul className="list-disc list-inside space-y-2 text-sm font-mono">
            <li>{isKo ? '연이율 = 월이율 × 12 = 일이율 × 365' : 'Annual = Monthly × 12 = Daily × 365'}</li>
            <li>{isKo ? '월이율 = 연이율 ÷ 12' : 'Monthly = Annual ÷ 12'}</li>
            <li>{isKo ? '일이율 = 연이율 ÷ 365' : 'Daily = Annual ÷ 365'}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 실효 이자율' : '2. Effective Interest Rate'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '실효이자율 = (1 + 명목이자율/n)^n - 1' : 'Effective Rate = (1 + Nominal Rate/n)^n - 1'}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{isKo ? '※ n = 연간 복리 횟수 (월복리이면 12, 일복리이면 365)' : '※ n = compounding frequency per year (12 for monthly, 365 for daily)'}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '3. 복리 주기에 따른 실효 이자율 예시 (명목 연 5% 기준)' : '3. Effective Rate Examples by Compounding Frequency (Nominal 5%/year)'}</h3>
          <div className="text-sm space-y-1">
            <p>{isKo ? '연복리(1회): (1+0.05/1)^1 - 1 = 5.0000%' : 'Annual (1x): (1+0.05/1)^1 - 1 = 5.0000%'}</p>
            <p>{isKo ? '반기복리(2회): (1+0.05/2)^2 - 1 = 5.0625%' : 'Semi-annual (2x): (1+0.05/2)^2 - 1 = 5.0625%'}</p>
            <p>{isKo ? '분기복리(4회): (1+0.05/4)^4 - 1 = 5.0945%' : 'Quarterly (4x): (1+0.05/4)^4 - 1 = 5.0945%'}</p>
            <p>{isKo ? '월복리(12회): (1+0.05/12)^12 - 1 = 5.1162%' : 'Monthly (12x): (1+0.05/12)^12 - 1 = 5.1162%'}</p>
            <p>{isKo ? '일복리(365회): (1+0.05/365)^365 - 1 = 5.1267%' : 'Daily (365x): (1+0.05/365)^365 - 1 = 5.1267%'}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 이자율 비교 꿀팁' : '💡 Interest Rate Comparison Tips'}</h2>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 실효 이자율로 비교하라' : '1. Compare Using Effective Rates'}</h3>
          <p className="mt-2">{isKo ? '예금·적금·대출 상품을 비교할 때는 반드시 실효 이자율로 비교하세요. 같은 명목 5%라도 월복리 상품이 연복리보다 실효 이자율이 높아 실질 수익이 더 큽니다.' : 'Always compare deposit, savings, and loan products using effective rates. The same nominal 5% monthly-compounding product yields more than annual compounding.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. 대출은 월이율로 비교하라' : '2. Compare Loans Using Monthly Rates'}</h3>
          <p className="mt-2">{isKo ? '대출 상품의 경우 월 상환금을 기준으로 비교하면 더 직관적입니다. 연이율을 월이율로 환산하면 월 이자 부담을 바로 파악할 수 있습니다.' : 'Comparing loan products by monthly payments is more intuitive. Converting the annual rate to a monthly rate lets you immediately assess monthly interest burden.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '3. 복리의 힘을 활용하라' : '3. Harness the Power of Compounding'}</h3>
          <p className="mt-2">{isKo ? '복리 투자는 시간이 길수록 효과가 극대화됩니다. 적금·예금·주식 투자 시 이자 계산 주기가 짧은 상품(월복리, 일복리)을 선택하면 같은 명목 이자율이라도 더 높은 실질 수익을 얻을 수 있습니다.' : 'Compound investments grow more over longer periods. Choosing products with more frequent compounding (monthly, daily) yields higher real returns at the same nominal rate.'}</p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '이자율 변환 계산기' : 'Interest Rate Converter'}
      description={isKo ? '연이율, 월이율, 일을율을 환산하고 실효 이자율을 계산합니다.' : 'Convert between annual, monthly, and daily rates and compute effective interest rates.'}
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? '명목 vs 실효 이자율 비교' : 'Nominal vs Effective Rate Comparison'}
      infoSection={infoSection}
    />
  );
}
