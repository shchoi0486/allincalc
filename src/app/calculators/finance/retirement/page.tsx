'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
// import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { subDays, differenceInDays } from 'date-fns';

const RetirementCalculator: NextPage = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date('2022-01-01'));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [severancePay, setSeverancePay] = useState<number>(0);
  const [totalDays, setTotalDays] = useState<number>(0);
  const [dailyAverageWage, setDailyAverageWage] = useState<number>(0);
  const [isCalculated, setIsCalculated] = useState(false);

  const [last3MonthsWages, setLast3MonthsWages] = useState({
    month1: 3000000,
    month2: 3000000,
    month3: 3000000,
  });
  const [annualBonus, setAnnualBonus] = useState<number>(1000000);
  const [annualLeaveAllowance, setAnnualLeaveAllowance] = useState<number>(500000);

  const handleDateChange = (setter: React.Dispatch<React.SetStateAction<Date | undefined>>) => (date: Date | undefined) => {
    setter(date);
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleNestedInputChange = (
    setter: React.Dispatch<React.SetStateAction<{ month1: number; month2: number; month3: number; }>>,
    field: keyof typeof last3MonthsWages
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(prev => ({ ...prev, [field]: isNaN(numericValue) ? 0 : numericValue }));
  };


  const handleCalculate = () => {
    if (!startDate || !endDate) {
      toast.error('입사일과 퇴사일을 모두 선택해주세요.');
      return;
    }

    if (endDate < startDate) {
      toast.error('퇴사일은 입사일보다 빠를 수 없습니다.');
      return;
    }

    const daysOfEmployment = differenceInDays(endDate, startDate) + 1;
    setTotalDays(daysOfEmployment);

    if (daysOfEmployment < 365) {
      toast.info('근무 기간이 1년 미만인 경우 퇴직금 지급 대상이 아닙니다.');
      setSeverancePay(0);
      setDailyAverageWage(0);
      setIsCalculated(true);
      return;
    }

    const totalWagesLast3Months = last3MonthsWages.month1 + last3MonthsWages.month2 + last3MonthsWages.month3;
    const daysInLast3Months = differenceInDays(endDate, subDays(endDate, 90)) +1;
    
    const calculatedDailyAverageWage = (totalWagesLast3Months + (annualBonus * 3 / 12) + (annualLeaveAllowance * 3 / 12)) / daysInLast3Months;
    setDailyAverageWage(Math.floor(calculatedDailyAverageWage));

    const calculatedSeverancePay = calculatedDailyAverageWage * 30 * (daysOfEmployment / 365);
    setSeverancePay(Math.floor(calculatedSeverancePay));

    setIsCalculated(true);
    toast.success('퇴직금이 계산되었습니다.');
  };

  const inputSection = (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>입사일</Label>
          <CustomDatePickerWithPopover date={startDate} setDate={handleDateChange(setStartDate)} />
        </div>
        <div className="space-y-2">
          <Label>퇴사일</Label>
          <CustomDatePickerWithPopover date={endDate} setDate={handleDateChange(setEndDate)} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">퇴직 전 3개월 급여</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month1">1개월차 급여</Label>
            <Input id="month1" value={last3MonthsWages.month1.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month1')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month2">2개월차 급여</Label>
            <Input id="month2" value={last3MonthsWages.month2.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month2')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month3">3개월차 급여</Label>
            <Input id="month3" value={last3MonthsWages.month3.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month3')} className="text-right" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualBonus">연간 상여금 총액</Label>
          <Input id="annualBonus" value={annualBonus.toLocaleString()} onChange={handleInputChange(setAnnualBonus)} className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annualLeaveAllowance">연차수당</Label>
          <Input id="annualLeaveAllowance" value={annualLeaveAllowance.toLocaleString()} onChange={handleInputChange(setAnnualLeaveAllowance)} className="text-right" />
        </div>
      </div>
      
      <Button onClick={handleCalculate} className="w-full">퇴직금 계산하기</Button>
    </div>
  );

  const resultSection = isCalculated ? (
    <Card>
      <CardHeader>
        <CardTitle>퇴직금 계산 결과</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">총 재직일수</span>
          <span className="font-bold">{totalDays}일</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">1일 평균임금</span>
          <span className="font-bold">{dailyAverageWage.toLocaleString()}원</span>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">예상 퇴직금</p>
          <p className="text-3xl font-bold text-blue-600">{severancePay.toLocaleString()}원</p>
        </div>
      </CardContent>
    </Card>
  ) : (
     <div className="flex items-center justify-center text-muted-foreground h-40">
        계산하기 버튼을 눌러주세요
      </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          <strong>퇴직금</strong>은 '제2의 월급'이라 불릴 만큼, 근로자의 안정적인 노후 생활을 위한 매우 중요한 자산입니다. 1년 이상 근무한 근로자가 퇴직할 때, 그동안의 근로에 대한 대가로 지급받는 소중한 자금이죠. 과거에는 퇴직 시 일시금으로 받는 것이 일반적이었지만, 현재는 <strong>퇴직연금제도(DB, DC, IRP)</strong>를 통해 더욱 체계적으로 관리되고 있습니다.
        </p>
        <p>
          이 계산기는 복잡한 퇴직금 계산 과정을 간소화하여, 여러분의 예상 퇴직금을 쉽고 빠르게 확인할 수 있도록 돕습니다. 입사일, 퇴사일, 퇴직 전 3개월간의 급여, 그리고 연간 상여금과 같은 기타 수당을 입력하면, 법적 기준에 따른 예상 퇴직금을 산출해 보여줍니다.
        </p>
        <p>
          단순히 금액을 확인하는 것을 넘어, 이 계산 결과를 바탕으로 본인의 퇴직연금 종류(DB/DC)에 따른 수령액 차이를 이해하고, IRP 계좌를 활용한 효과적인 절세 전략과 은퇴 자산 증식 계획을 세우는 첫걸음으로 활용하시길 바랍니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">퇴직금은 '1일 평균임금'을 기준으로 '총 재직일수'에 비례하여 산정됩니다. 계산의 핵심 두 가지 요소를 정확히 이해하는 것이 중요합니다.</p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">1. 1일 평균임금 산정</h3>
          <p>퇴직일 이전 3개월 동안 지급된 임금 총액을 그 기간의 총 일수로 나눈 금액입니다. 여기에는 기본급뿐만 아니라 연장, 야간, 휴일근로수당 등과 같은 각종 수당이 포함됩니다.</p>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto mt-2">
            1일 평균임금 = (퇴직 전 3개월 임금 총액 + 연간 상여금 × 3/12 + 연차수당 × 3/12) / 퇴직 전 3개월 총 일수
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">※ 상여금, 연차수당 등 1년 단위로 지급된 임금은 3개월분으로 환산하여 포함합니다.</p>
          <p className="text-xs text-red-500 dark:text-red-400 mt-2">※ 1일 평균임금이 통상임금보다 적을 경우, 통상임금을 1일 평균임금으로 하여 계산해야 합니다.</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">2. 예상 퇴직금 계산</h3>
          <p>산정된 1일 평균임금에 30일을 곱하여 '30일분 평균임금'을 구하고, 이를 총 재직기간에 비례하여 최종 퇴직금을 계산합니다.</p>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto mt-2">
            예상 퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 / 365일)
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">💡 2025년 퇴직금 200% 활용을 위한 은퇴 설계 전략</h2>
        
        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">1. DB vs DC, 내게 유리한 퇴직연금은?</h3>
          <p className="mt-2">회사의 퇴직연금제도를 파악하는 것이 첫걸음입니다. <strong>안정성을 중시한다면 DB(확정급여형), 투자 수익을 기대한다면 DC(확정기여형)</strong>가 유리할 수 있습니다.</p>
          <ul class="list-disc list-inside mt-3 space-y-2 text-sm">
            <li><strong>DB (Defined Benefit):</strong> 퇴직 시점의 평균임금과 근속연수에 따라 정해진 금액을 받는 방식. 회사가 적립금을 운용하며, 임금 상승률이 높은 대기업이나 공공기관 근로자에게 유리합니다. 안정적이지만, 투자 수익의 기회는 없습니다.</li>
            <li><strong>DC (Defined Contribution):</strong> 회사가 매년 연간 임금 총액의 1/12 이상을 근로자의 계좌에 넣어주면, 근로자가 직접 운용(투자)하는 방식. 투자 성과에 따라 퇴직금이 달라집니다. 투자에 자신 있고, 임금 상승률보다 높은 수익을 기대하는 경우 유리합니다.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500">
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400">2. IRP 계좌: 세금은 줄이고, 노후 자금은 늘리는 마법의 통장</h3>
          <p className="mt-2">퇴직금을 수령할 때, 개인형 퇴직연금(IRP) 계좌로 이전하면 <strong>퇴직소득세를 당장 내지 않고, 연금 수령 시점까지 과세를 이연</strong>할 수 있습니다. 이는 매우 강력한 절세 혜택입니다.</p>
          <ul class="list-disc list-inside mt-3 space-y-2 text-sm">
            <li><strong>과세이연 효과:</strong> 세금을 떼지 않은 원금 전체를 재투자하여 더 높은 수익을 기대할 수 있습니다. (일명 '세금으로 투자하기')</li>
            <li><strong>저율과세:</strong> 연금으로 수령 시, 기존 퇴직소득세율(약 6~45%)의 70%에 해당하는 낮은 연금소득세율(3.3%~5.5%)을 적용받습니다.</li>
            <li><strong>세액공제:</strong> IRP 계좌에 추가로 납입하는 금액에 대해서는 연간 최대 900만원까지 세액공제 혜택(13.2% 또는 16.5%)을 받을 수 있습니다.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">3. 퇴직금 중간정산, 정말 필요할 때만!</h3>
          <p className="mt-2">무주택자의 주택 구입 등 법에서 정한 특정한 사유가 아니면 퇴직금 중간정산은 불가능합니다. 설령 가능하더라도 신중해야 합니다. 중간정산은 장기적인 노후 자산을 미리 당겨 쓰는 것으로, 복리 효과를 누릴 기회를 잃게 만듭니다. 불가피한 상황이 아니라면, 퇴직금은 최대한 보존하여 은퇴 시점까지 운용하는 것이 현명합니다.</p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500">
          <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400">4. 퇴직금도 '투자'가 필요하다</h3>
          <p className="mt-2">DC형 가입자나 IRP 계좌 보유자는 적립금을 어떤 상품으로 운용할지 직접 결정해야 합니다. '알아서 되겠지'라는 생각으로 원리금보장상품에만 넣어두면, 물가상승률을 따라가지 못해 실질 가치가 하락할 수 있습니다. 본인의 투자 성향과 남은 기간을 고려하여, <strong>안정적인 채권형 펀드와 성장 가능성이 있는 주식형 펀드, TDF(Target Date Fund) 등을 적절히 배분</strong>하는 포트폴리오 전략이 필요합니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="퇴직금 계산기"
      description="근로기간과 급여 정보를 바탕으로 예상 퇴직금을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RetirementCalculator;