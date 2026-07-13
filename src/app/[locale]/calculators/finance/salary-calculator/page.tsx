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
import { formatNumber, parseNumber } from '@/utils/formatNumber';

const INCOME_TAX_BRACKETS: { max: number; rate: number; deduction: number }[] = [
  { max: 14000000, rate: 0.06, deduction: 0 },
  { max: 50000000, rate: 0.15, deduction: 1260000 },
  { max: 88000000, rate: 0.24, deduction: 5760000 },
  { max: 150000000, rate: 0.35, deduction: 14960000 },
  { max: 300000000, rate: 0.38, deduction: 19460000 },
  { max: 500000000, rate: 0.40, deduction: 25460000 },
  { max: 1000000000, rate: 0.42, deduction: 35460000 },
  { max: Infinity, rate: 0.45, deduction: 65460000 },
];

function estimateAfterTaxMonthly(annualSalary: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => annualSalary <= b.max);
  if (!bracket) return 0;
  const annualTax = Math.max(0, annualSalary * bracket.rate - bracket.deduction);
  const localTax = annualTax * 0.1;
  const monthlyTax = (annualTax + localTax) / 12;
  return (annualSalary / 12) - monthlyTax;
}

export default function SalaryConverterCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [mode, setMode] = useState<'annual' | 'monthly'>('annual');
  const [inputValue, setInputValue] = useState('5000');
  const [result, setResult] = useState<{
    annual: number;
    monthly: number;
    monthlyAfterTax: number;
    netEstimate: number;
  } | null>(null);

  const handleCalculate = () => {
    const val = parseNumber(inputValue) * 10000;
    let annual: number;
    let monthly: number;

    if (mode === 'annual') {
      annual = val;
      monthly = val / 12;
    } else {
      monthly = val;
      annual = val * 12;
    }

    const monthlyAfterTax = estimateAfterTaxMonthly(annual);
    const annualTax = (() => {
      const bracket = INCOME_TAX_BRACKETS.find((b) => annual <= b.max);
      if (!bracket) return 0;
      return Math.max(0, annual * bracket.rate - bracket.deduction);
    })();
    const totalTax = annualTax + annualTax * 0.1;
    const monthlyInsurance = (monthly * 0.045) + (monthly * 0.03545) + (monthly * 0.03545 * 0.1281) + (monthly * 0.009);
    const netEstimate = monthly - monthlyInsurance - (totalTax / 12);

    setResult({ annual, monthly, monthlyAfterTax, netEstimate });
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{isKo ? '입력 단위' : 'Input Unit'}</Label>
        <ToggleGroup type="single" value={mode} onValueChange={(v: 'annual' | 'monthly') => { if (v) setMode(v); }} className="w-full">
          <ToggleGroupItem value="annual" className="flex-1">{isKo ? '연봉 (만원)' : 'Annual Salary (10K)'}</ToggleGroupItem>
          <ToggleGroupItem value="monthly" className="flex-1">{isKo ? '월급 (만원)' : 'Monthly Salary (10K)'}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="space-y-2">
        <Label htmlFor="inputValue">{mode === 'annual' ? (isKo ? '연봉 (만원)' : 'Annual Salary (10K KRW)') : (isKo ? '월급 (만원)' : 'Monthly Salary (10K KRW)')}</Label>
        <Input
          id="inputValue"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={mode === 'annual' ? '5000' : '417'}
          className="text-right"
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
          <span className="text-muted-foreground">{isKo ? '연봉 (세전)' : 'Annual Salary (Gross)'}</span>
          <span className="font-bold">{formatNumber(Math.round(result.annual))}{isKo ? '원' : ' KRW'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '월급 (세전)' : 'Monthly Salary (Gross)'}</span>
          <span className="font-bold">{formatNumber(Math.round(result.monthly))}{isKo ? '원' : ' KRW'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{isKo ? '세후 월급 (추정)' : 'Monthly After Tax (Est.)'}</span>
          <span className="font-bold text-blue-600">{formatNumber(Math.round(result.monthlyAfterTax))}{isKo ? '원' : ' KRW'}</span>
        </div>
        <div className="flex justify-between items-center border-t pt-3">
          <span className="text-muted-foreground">{isKo ? '실수령 (추정)' : 'Net Take-home (Est.)'}</span>
          <span className="font-bold text-lg text-primary">{formatNumber(Math.round(result.netEstimate))}{isKo ? '원' : ' KRW'}</span>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      {isKo ? '금액 입력 후 계산하기 버튼을 눌러주세요.' : 'Enter an amount and click Calculate.'}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          {isKo ? '연봉 변환 계산기는 연봉과 월급을 서로 환산하고, 세후 예상 실수령액까지 확인할 수 있는 도구입니다. 연봉 협상 시 "이 연봉이면 실질적으로 월에 얼마를 받게 되는지"를 바로 확인할 수 있습니다.' : 'The Salary Converter Calculator converts between annual and monthly salary and shows estimated after-tax take-home pay. When negotiating salary, you can instantly see "how much you actually receive per month from this annual salary."'}</p>
        <TermGlossary items={[
          { term: isKo ? '연봉' : 'Annual Salary', desc: isKo ? '1년 동안의 총 보수(세전)를 의미합니다. 통상 협상하는 금액이 이에 해당합니다.' : 'Total remuneration (gross) for one year. The amount typically negotiated corresponds to this.' },
          { term: isKo ? '월급' : 'Monthly Salary', desc: isKo ? '연봉을 12로 나눈 월별 세전 보수입니다. 매월 통장에 찍히는 금액과는 다릅니다.' : 'Monthly pre-tax remuneration (annual salary ÷ 12). It differs from the amount deposited each month.' },
          { term: isKo ? '세후 금액' : 'After-tax Amount', desc: isKo ? '4대보험과 소득세, 지방소득세를 모두 제외한 실질 수령액입니다.' : 'The actual take-home amount after deducting 4 insurances, income tax, and local income tax.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '연봉 ↔ 월급 환산 공식' : 'Annual ↔ Monthly Salary Conversion'}</p>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 기본 환산' : '1. Basic Conversion'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">{isKo ? '월급 = 연봉 ÷ 12' : 'Monthly Salary = Annual Salary ÷ 12'}</p>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm mt-2">{isKo ? '연봉 = 월급 × 12' : 'Annual Salary = Monthly Salary × 12'}</p>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 세후 월급 추정' : '2. After-tax Monthly Estimate'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '세후 월급 = 월급 - 4대보험 - 소득세/12 - 지방소득세/12' : 'After-tax monthly = Monthly salary - 4 insurances - Income tax/12 - Local income tax/12'}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 연봉 협상 꿀팁' : '💡 Salary Negotiation Tips'}</h2>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 세전 기준으로 협상하라' : '1. Negotiate Based on Gross Amount'}</h3>
          <p className="mt-2">{isKo ? '모든 연봉 협상은 세전( gross ) 금액을 기준으로 진행됩니다. 동종 업계·직무의 평균 연봉을 조사하고, 자신의 성과를 구체적 수치로 정리하여 협상하면 성공 확률이 높아집니다.' : 'All salary negotiations proceed on a gross (pre-tax) basis. Research average salaries for your industry and role, and present your achievements with concrete figures for a higher success rate.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. 총 보상 패키지를 확인하라' : '2. Check Total Compensation Package'}</h3>
          <p className="mt-2">{isKo ? '연봉 외에 상여금, 스톡옵션, 복리후생비(식대·교통비·주택자금 등)가 포함되는지 확인하세요. 비과세 항목이 많을수록 세후 실수령액이 높아집니다.' : 'Check whether bonuses, stock options, and welfare benefits (meal, transport, housing fund) are included in addition to salary. More non-taxable items lead to higher after-tax take-home.'}</p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '연봉 변환 계산기' : 'Salary Converter Calculator'}
      description={isKo ? '연봉과 월급을 서로 환산하고 세후 예상 실수령액을 확인합니다.' : 'Convert between annual and monthly salary and see estimated after-tax pay.'}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
