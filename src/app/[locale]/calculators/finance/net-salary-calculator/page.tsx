'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatNumber, parseNumber } from '@/utils/formatNumber';

const NATIONAL_PENSION_RATE = 0.045;
const NATIONAL_PENSION_MIN = 370000;
const NATIONAL_PENSION_MAX = 5900000;
const HEALTH_INSURANCE_RATE = 0.03545;
const LONG_TERM_CARE_RATE = 0.1281;
const EMPLOYMENT_INSURANCE_RATE = 0.009;

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

function calcIncomeTax(annualTaxableIncome: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => annualTaxableIncome <= b.max);
  if (!bracket) return 0;
  return Math.max(0, annualTaxableIncome * bracket.rate - bracket.deduction);
}

export default function NetSalaryCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [monthlySalary, setMonthlySalary] = useState('500');
  const [nonTaxable, setNonTaxable] = useState('20');
  const [result, setResult] = useState<{
    nationalPension: number;
    healthInsurance: number;
    longTermCare: number;
    employmentInsurance: number;
    totalInsurance: number;
    incomeTax: number;
    localIncomeTax: number;
    totalDeductions: number;
    netSalary: number;
  } | null>(null);

  const handleCalculate = () => {
    const salaryManWon = parseNumber(monthlySalary);
    const nonTaxableManWon = parseNumber(nonTaxable);
    const salary = salaryManWon * 10000;
    const nonTaxableAmt = nonTaxableManWon * 10000;

    const pensionBase = Math.max(NATIONAL_PENSION_MIN, Math.min(salary, NATIONAL_PENSION_MAX));
    const nationalPension = pensionBase * NATIONAL_PENSION_RATE;

    const healthInsurance = salary * HEALTH_INSURANCE_RATE;
    const longTermCare = healthInsurance * LONG_TERM_CARE_RATE;
    const employmentInsurance = salary * EMPLOYMENT_INSURANCE_RATE;
    const totalInsurance = nationalPension + healthInsurance + longTermCare + employmentInsurance;

    const annualTaxable = Math.max(0, (salary - nonTaxableAmt) * 12);
    const annualIncomeTax = calcIncomeTax(annualTaxable);
    const monthlyIncomeTax = annualIncomeTax / 12;
    const localIncomeTax = monthlyIncomeTax * 0.1;

    const totalDeductions = totalInsurance + monthlyIncomeTax + localIncomeTax;
    const netSalary = salary - totalDeductions;

    setResult({
      nationalPension,
      healthInsurance,
      longTermCare,
      employmentInsurance,
      totalInsurance,
      incomeTax: monthlyIncomeTax,
      localIncomeTax,
      totalDeductions,
      netSalary,
    });
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="monthlySalary">{isKo ? '월급 (만원)' : 'Monthly Salary (10K KRW)'}</Label>
        <Input
          id="monthlySalary"
          value={monthlySalary}
          onChange={(e) => setMonthlySalary(e.target.value)}
          placeholder="500"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="nonTaxable">{isKo ? '비과세 (만원)' : 'Non-taxable (10K KRW)'}</Label>
        <Input
          id="nonTaxable"
          value={nonTaxable}
          onChange={(e) => setNonTaxable(e.target.value)}
          placeholder="20"
          className="text-right"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">
        {isKo ? '계산하기' : 'Calculate'}
      </Button>
    </div>
  );

  const resultSection = result ? (
    <Card>
      <CardHeader>
        <CardTitle>{isKo ? '실수령액 결과' : 'Net Salary Result'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-muted-foreground">{isKo ? '월 실수령액' : 'Monthly Net Salary'}</p>
          <p className="text-3xl font-bold text-primary">{formatNumber(Math.round(result.netSalary))}{isKo ? '원' : ' KRW'}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {isKo ? '연 실수령액: ' : 'Annual Net: '}{formatNumber(Math.round(result.netSalary * 12))}{isKo ? '원' : ' KRW'}
          </p>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">{isKo ? '총 공제액' : 'Total Deductions'}</span>
          <span className="font-semibold text-destructive">{formatNumber(Math.round(result.totalDeductions))}{isKo ? '원' : ' KRW'}</span>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center h-40 text-muted-foreground">
      {isKo ? '정보 입력 후 계산하기 버튼을 눌러주세요.' : 'Enter values and click Calculate.'}
    </div>
  );

  const fullWidthSection = result ? (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{isKo ? '공제 항목' : 'Deduction Item'}</TableHead>
          <TableHead className="text-right">{isKo ? '비율' : 'Rate'}</TableHead>
          <TableHead className="text-right">{isKo ? '금액 (월)' : 'Amount (Monthly)'}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>{isKo ? '국민연금' : 'National Pension'}</TableCell>
          <TableCell className="text-right">4.5%</TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.nationalPension))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '건강보험' : 'Health Insurance'}</TableCell>
          <TableCell className="text-right">3.545%</TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.healthInsurance))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '장기요양보험' : 'Long-term Care Insurance'}</TableCell>
          <TableCell className="text-right">12.81%<span className="text-xs text-muted-foreground">{isKo ? '(건강보험 대비)' : '(of health ins.)'}</span></TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.longTermCare))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '고용보험' : 'Employment Insurance'}</TableCell>
          <TableCell className="text-right">0.9%</TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.employmentInsurance))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow className="font-semibold bg-muted/50">
          <TableCell>{isKo ? '4대보험 합계' : 'Total 4 Insurances'}</TableCell>
          <TableCell />
          <TableCell className="text-right">{formatNumber(Math.round(result.totalInsurance))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '소득세' : 'Income Tax'}</TableCell>
          <TableCell className="text-right">{isKo ? '간이세표' : 'Simplified'}</TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.incomeTax))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '지방소득세' : 'Local Income Tax'}</TableCell>
          <TableCell className="text-right">10%</TableCell>
          <TableCell className="text-right">{formatNumber(Math.round(result.localIncomeTax))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow className="text-lg font-bold bg-muted">
          <TableCell>{isKo ? '총 공제액' : 'Total Deductions'}</TableCell>
          <TableCell />
          <TableCell className="text-right">{formatNumber(Math.round(result.totalDeductions))}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          {isKo ? '실수령액 계산기는 매월 급여에서 실제로 빠져나가는 4대보험(국민연금, 건강보험, 장기요양보험, 고용보험)과 소득세, 지방소득세를 정확히 계산하여, 통장에 찍히는 실질 금액을 알려주는 도구입니다.' : 'The Net Salary Calculator accurately computes the 4 insurances (National Pension, Health Insurance, Long-term Care Insurance, Employment Insurance), income tax, and local income tax deducted from your monthly salary to show the actual amount deposited into your account.'}
        </p>
        <p>
          {isKo ? '계약서에 명시된 월급(세전)에서 비과세 금액을 제외한 과세 대상 금액을 기준으로 각 보험료율과 소득세 누진세율을 적용하여 산출합니다. 비과세 항목(식대, 차량유지비 등)을 활용하면 실수령액을 높일 수 있습니다.' : 'It calculates based on the taxable amount (monthly salary minus non-taxable items), applying each insurance rate and progressive income tax rates. Using non-taxable items (meal allowance, vehicle upkeep, etc.) can increase your net salary.'}
        </p>
        <TermGlossary items={[
          { term: isKo ? '4대보험' : 'Four Insurances', desc: isKo ? '국민연금, 건강보험, 장기요양보험, 고용보험으로 근로자의 사회안전망을 위한 공제 항목입니다.' : 'National Pension, Health Insurance, Long-term Care Insurance, and Employment Insurance—the deductions funding the workers\' social safety net.' },
          { term: isKo ? '비과세 소득' : 'Non-taxable Income', desc: isKo ? '과세 대상에서 제외되는 소득으로, 식대·차량유지비 등이 해당됩니다. 4대보험료와 소득세를 함께 절약할 수 있습니다.' : 'Income excluded from the tax base, such as meal and vehicle allowances; it saves both insurance premiums and income tax.' },
          { term: isKo ? '간이세표' : 'Simplified Tax Table', desc: isKo ? '국세청에서 제공하는 근로소득 간이세액표를 기준으로 소득세를 산출하는 방식입니다.' : 'A method of computing income tax based on the NTS Earned Income Simplified Tax Table.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '실수령액 계산 공식 (2024년 기준)' : 'Net Salary Calculation Formula (2024)'}</p>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 4대 사회보험' : '1. Four Social Insurances'}</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>{isKo ? <><strong>국민연금:</strong> 기준소득월액의 4.5% (상한 590만원, 하한 37만원)</> : <><strong>National Pension:</strong> 4.5% of standard pension income (cap 5.9M, floor 370K)</>}</li>
            <li>{isKo ? <><strong>건강보험:</strong> 보수월액의 3.545%</> : <><strong>Health Insurance:</strong> 3.545% of monthly remuneration</>}</li>
            <li>{isKo ? <><strong>장기요양보험:</strong> 건강보험료의 12.81%</> : <><strong>Long-term Care Insurance:</strong> 12.81% of health insurance premium</>}</li>
            <li>{isKo ? <><strong>고용보험:</strong> 보수월액의 0.9%</> : <><strong>Employment Insurance:</strong> 0.9% of monthly remuneration</>}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 소득세 및 지방소득세' : '2. Income Tax & Local Income Tax'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '소득세 = 간이세표 적용 (연간 과세소득 기준 누진세율)' : 'Income Tax = Simplified tax table (progressive rates on annual taxable income)'}
          </p>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm mt-2">
            {isKo ? '지방소득세 = 소득세 × 10%' : 'Local Income Tax = Income Tax × 10%'}
          </p>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '3. 실수령액' : '3. Net Salary'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '실수령액 = 월급 - 4대보험 - 소득세 - 지방소득세' : 'Net Salary = Monthly Salary - 4 Insurances - Income Tax - Local Income Tax'}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 실수령액 높이는 꿀팁' : '💡 Tips to Increase Your Net Salary'}</h2>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 비과세 항목을 최대한 활용하라' : '1. Maximize Non-taxable Items'}</h3>
          <p className="mt-2">{isKo ? '식대(월 20만원), 차량유지비(월 20만원), 육아수당(월 20만원) 등 비과세 항목은 4대보험료와 소득세 모두를 절약할 수 있는 가장 효과적인 방법입니다.' : 'Meal allowance (200K/month), vehicle upkeep (200K/month), childcare allowance (200K/month) etc. are the most effective ways to save on both insurance premiums and income tax.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. 연금저축/IRP로 세액공제를 받으라' : '2. Get Tax Credits with Pension Savings/IRP'}</h3>
          <p className="mt-2">{isKo ? '연간 최대 900만원까지 세액공제가 가능한 연금저축/IRP는 실질적인 세 부담을 줄여주는 강력한 절세 상품입니다. 근로소득 세액공제율은 1,200만원 이하 16.5%, 1,200만원 초과 13.2%입니다.' : 'Pension Savings/IRP, eligible for tax credits up to 9M per year, is a powerful tax saver that effectively reduces your tax burden. The credit rate is 16.5% for contributions ≤12M and 13.2% for contributions >12M.'}</p>
        </div>
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '3. 부양가족 공제를 꼼꼼히 챙겨라' : '3. Carefully Claim Dependent Deductions'}</h3>
          <p className="mt-2">{isKo ? '기본공제(150만원), 부양가족공제, 의료비·교육비 공제 등 연말정산 공제 항목을 빠짐없이 챙기면 환급금을 받을 수 있습니다. 특히 자녀·부모님 인적공제와 의료비 공제는 놓치기 쉬운 항목입니다.' : 'Carefully claiming year-end settlement deductions—basic (1.5M), dependent, medical, education—can yield refunds. Especially dependent deductions for children/parents and medical expense deductions are commonly missed.'}</p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '실수령액 계산기' : 'Net Salary Calculator'}
      description={isKo ? '월급에서 4대보험과 세금을 제외한 실수령액을 계산합니다.' : 'Calculate your net take-home pay after 4 insurances and taxes.'}
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? '상세 공제 내역' : 'Deduction Breakdown'}
      infoSection={infoSection}
    />
  );
}
