'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

const OrdinaryWageCalculator: NextPage = () => {
  const [baseSalary, setBaseSalary] = useState<number>(3000000);
  const [monthlyAllowances, setMonthlyAllowances] = useState<number>(200000);
  const [annualBonuses, setAnnualBonuses] = useState<number>(5000000);
  const [workHoursPerWeek, setWorkHoursPerWeek] = useState<number>(40);

  // 숫자 입력 처리 핸들러 정의
  const handleInputChange = (setter: (value: number) => void) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
      const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
      setter(isNaN(numericValue) ? 0 : numericValue);
    };
  };

  const [results, setResults] = useState<{
    hourlyWage: number;
    dailyWage: number;
    monthlyWage: number;
    annualWage: number;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const base = baseSalary;
    const allowances = monthlyAllowances;
    const bonuses = annualBonuses;
    const hours = workHoursPerWeek;

    if (isNaN(base) || isNaN(allowances) || isNaN(bonuses) || isNaN(hours) || hours <= 0) {
      return null;
    }

    const totalMonthlyWage = base + allowances + bonuses / 12;
    const calculatedHourlyWage = totalMonthlyWage / 209; // 주 40시간 기준 월 소정근로시간
    const calculatedDailyWage = calculatedHourlyWage * (hours / 5);

    return {
      hourlyWage: calculatedHourlyWage,
      dailyWage: calculatedDailyWage,
      monthlyWage: totalMonthlyWage,
      annualWage: totalMonthlyWage * 12,
    };
  }, [baseSalary, monthlyAllowances, annualBonuses, workHoursPerWeek]);

  const handleCalculate = () => {
    if (calculationResults) {
      setResults(calculationResults);
      toast.success('계산이 완료되었습니다.');
    } else {
      toast.error('입력값을 확인해주세요.');
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="baseSalary">월 기본급 (원)</Label>
        <Input
          id="baseSalary"
          value={baseSalary.toLocaleString()}
          onChange={(e) => handleInputChange(setBaseSalary)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyAllowances">월 기타수당 (원)</Label>
        <Input
          id="monthlyAllowances"
          value={monthlyAllowances.toLocaleString()}
          onChange={(e) => handleInputChange(setMonthlyAllowances)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualBonuses">연간 상여금 (원)</Label>
        <Input
          id="annualBonuses"
          value={annualBonuses.toLocaleString()}
          onChange={(e) => handleInputChange(setAnnualBonuses)(e)}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workHoursPerWeek">주당 근로시간</Label>
        <Input
          id="workHoursPerWeek"
          value={workHoursPerWeek.toLocaleString()}
          onChange={(e) => handleInputChange(setWorkHoursPerWeek)(e)}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {results ? (
        <Card>
          <CardHeader>
            <CardTitle>계산 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <div className="flex justify-between items-center">
              <span>시간급 통상임금</span>
              <span className="font-bold">{results.hourlyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>일급 통상임금</span>
              <span className="font-bold">{results.dailyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>월급 통상임금</span>
              <span className="font-bold">{results.monthlyWage.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between items-center">
              <span>연봉 환산액</span>
              <span className="font-bold">{results.annualWage.toLocaleString()} 원</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          입력 후 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          <strong>통상임금</strong>은 단순한 월급 액수를 넘어, 근로자의 각종 법정 수당을 산정하는 기준이 되는 핵심적인 임금입니다. 연장, 야간, 휴일근로에 대한 가산수당, 연차유급휴가수당, 해고예고수당 등이 모두 통상임금을 기반으로 계산됩니다.
        </p>
        <p>
          따라서 통상임금을 정확히 아는 것은 근로자에게는 자신의 정당한 권리를 찾는 길이며, 사업주에게는 잠재적인 법적 분쟁을 예방하고 안정적인 노사관계를 구축하는 첫걸음입니다. 이 계산기는 복잡하고 어려운 통상임금 개념을 쉽게 이해하고, 자신의 상황에 맞는 금액을 간편하게 계산할 수 있도록 돕기 위해 만들어졌습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">통상임금은 근로자에게 정기적이고 일률적으로 소정근로 또는 총 근로에 대하여 지급하기로 정한 금액을 말합니다. 시간급, 일급, 월급 등 다양한 형태로 계산될 수 있습니다.</p>
        
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">1. 월 통상임금 산정</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            월 통상임금 = 월 기본급 + 각종 수당(매월 고정 지급) + (연간 상여금 및 기타 금품 / 12)
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">※ 모든 수당과 상여금이 통상임금에 포함되는 것은 아니며, 아래 '유용한 팁' 섹션의 포함 기준(정기성, 일률성, 고정성)을 충족해야 합니다.</p>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">2. 시간급 통상임금 산정 (가장 기본!)</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            시간급 통상임금 = 월 통상임금 / 월 소정근로시간
          </p>
          <p className="mt-3"><strong>월 소정근로시간이란?</strong></p>
          <p className="text-sm">근로자와 사용자가 합의한 월 평균 근로시간을 의미합니다. 주 40시간, 주 5일 근무제의 경우, 유급 주휴시간(일요일 8시간)을 포함하여 월 평균 <strong>209시간</strong>으로 산정하는 것이 일반적입니다.</p>
          <ul className="text-xs list-disc list-inside mt-2 space-y-1">
            <li>계산식: (주 40시간 + 주휴 8시간) × (365일 / 7일 / 12개월) ≈ 209시간</li>
            <li>단시간 근로자의 경우, 근로시간에 비례하여 소정근로시간이 달라집니다.</li>
          </ul>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">3. 일급 통상임금 산정</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            일급 통상임금 = 시간급 통상임금 × 1일 소정근로시간
          </p>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">※ 1일 소정근로시간은 보통 8시간입니다.</p>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">계산 예시 (시간급 10,000원, 주 40시간·주 5일)</h4>
            <p className="text-sm text-muted-foreground">월 소정근로시간 = (40 + 8) × (365 / 7 / 12) ≈ 209시간</p>
            <p className="font-mono text-sm text-primary mt-1">월 통상임금 = 10,000 × 209 = 2,090,000원</p>
            <p className="font-mono text-sm text-primary">일급 통상임금 = 10,000 × 8 = 80,000원</p>
          </div>
        </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">💼 통상임금, 2025년 기준 이것만은 꼭 알아두세요!</h2>
        
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">1. 통상임금 판단의 3대 원칙: 정기성, 일률성, 고정성</h3>
          <p className="mt-2">어떤 금품이 통상임금에 속하는지를 판단하는 가장 중요한 기준입니다. 아래 세 가지 요건을 모두 충족해야 합니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li><strong>정기성:</strong> 1개월을 초과하는 기간(분기, 반기 등)에 지급되더라도, 앞으로도 계속적, 주기적으로 지급될 것이 예정되어 있다면 정기성이 인정됩니다. (예: 분기별 정기상여금)</li>
            <li><strong>일률성:</strong> '모든' 근로자가 아닌, '일정한 조건을 충족한 모든' 근로자에게 지급되면 일률성이 인정됩니다. (예: 특정 자격증 소지자에게 지급하는 자격수당)</li>
            <li><strong>고정성:</strong> 근로자가 업적, 성과 등 추가적인 조건을 달성할 필요 없이, 근로를 제공하기만 하면 당연히 지급될 금액이 '사전에 확정'되어 있는 성질을 의미합니다. 이것이 가장 중요하고 까다로운 요건입니다. (예: 실제 야근 여부와 무관하게 매월 고정적으로 지급되는 야간근로수당)</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">2. 통상임금 포함 vs 미포함 대표 항목</h3>
          <div className="grid md:grid-cols-2 gap-6 mt-3">
            <div>
              <h4 className="font-semibold text-primary">✅ 통상임금 포함 (O)</h4>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                <li>기본급</li>
                <li>직무/직책 수당</li>
                <li>기술/자격/면허 수당</li>
                <li>위험 작업 수당</li>
                <li>고정적인 식대, 교통비, 통신비</li>
                <li>사전에 지급액이 확정된 고정상여금</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary">❌ 통상임금 미포함 (X)</h4>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                <li>실제 근무실적에 따라 변동되는 성과급</li>
                <li>출장비, 업무추진비 등 실비변상적 금품</li>
                <li>부양가족 수에 따라 달라지는 가족수당</li>
                <li>결혼 축하금, 경조사비 등 복리후생적 금품</li>
                <li>연차유급휴가 미사용 수당</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">3. 통상임금이 왜 중요한가요? 각종 수당의 기준!</h3>
          <p className="mt-2">통상임금은 아래 수당들을 계산하는 기초가 되기 때문에 매우 중요합니다. 통상임금이 오르면 이 수당들도 함께 오릅니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside">
            <li><strong>연장/야간/휴일 근로수당:</strong> 시간급 통상임금의 50%를 가산하여 지급 (총 150%)</li>
            <li><strong>연차유급휴가 미사용 수당:</strong> 1일 소정근로시간에 해당하는 통상임금으로 지급</li>
            <li><strong>해고예고수당:</strong> 30일분의 통상임금을 지급</li>
            <li><strong>출산전후휴가 및 육아휴직 급여:</strong> 통상임금을 기준으로 상한액 내에서 지급</li>
            <li><strong>퇴직금(평균임금과의 관계):</strong> 퇴직금은 '평균임금'으로 계산하는 것이 원칙이나, 만약 평균임금이 통상임금보다 낮을 경우, 통상임금을 평균임금으로 하여 퇴직금을 산정해야 합니다. (근로자 보호 조항)</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">4. 근로자와 사업주를 위한 최종 조언</h3>
          <p className="mt-2"><strong>근로자라면,</strong> 자신의 급여명세서를 꼼꼼히 살펴보고, 통상임금에 포함되어야 할 항목이 누락되지는 않았는지 확인해보세요. 궁금한 점은 회사의 인사/급여 담당자에게 문의하거나 고용노동부를 통해 상담받을 수 있습니다.</p>
          <p className="mt-3"><strong>사업주라면,</strong> 최신 판례와 법규를 반영하여 통상임금 산정 기준을 명확히 하고, 이를 기반으로 정확한 임금을 지급해야 합니다. 이는 불필요한 법적 분쟁을 막고, 건강한 노사 문화를 만드는 가장 확실한 방법입니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="통상임금 계산기"
      description="월 기본급, 수당, 상여금 등을 입력하여 통상임금을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default OrdinaryWageCalculator;