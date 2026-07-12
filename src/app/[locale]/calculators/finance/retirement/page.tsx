'use client';

import React, { useState } from 'react';
import { NextPage } from 'next';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { subDays, differenceInDays } from 'date-fns';
import { useI18n } from '@/i18n/I18nProvider';

const RetirementCalculator: NextPage = () => {
  const { dict, locale } = useI18n();
  const t = dict.retirement;
  const isKo = locale === 'ko';

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
      toast.error(t.toastStartDateRequired);
      return;
    }

    if (endDate < startDate) {
      toast.error(t.toastEndDateBeforeStart);
      return;
    }

    const daysOfEmployment = differenceInDays(endDate, startDate) + 1;
    setTotalDays(daysOfEmployment);

    if (daysOfEmployment < 365) {
      toast.info(t.toastLessThan1Year);
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
    toast.success(t.toastSuccess);
  };

  const inputSection = (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t.inputs.startDate}</Label>
          <CustomDatePickerWithPopover date={startDate} setDate={handleDateChange(setStartDate)} />
        </div>
        <div className="space-y-2">
          <Label>{t.inputs.endDate}</Label>
          <CustomDatePickerWithPopover date={endDate} setDate={handleDateChange(setEndDate)} />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.inputs.last3MonthsSalary}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="month1">{t.inputs.month1}</Label>
            <Input id="month1" value={last3MonthsWages.month1.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month1')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month2">{t.inputs.month2}</Label>
            <Input id="month2" value={last3MonthsWages.month2.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month2')} className="text-right" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="month3">{t.inputs.month3}</Label>
            <Input id="month3" value={last3MonthsWages.month3.toLocaleString()} onChange={handleNestedInputChange(setLast3MonthsWages, 'month3')} className="text-right" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="annualBonus">{t.inputs.annualBonus}</Label>
          <Input id="annualBonus" value={annualBonus.toLocaleString()} onChange={handleInputChange(setAnnualBonus)} className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="annualLeaveAllowance">{t.inputs.annualLeaveAllowance}</Label>
          <Input id="annualLeaveAllowance" value={annualLeaveAllowance.toLocaleString()} onChange={handleInputChange(setAnnualLeaveAllowance)} className="text-right" />
        </div>
      </div>
      
      <Button onClick={handleCalculate} className="w-full">{t.calculateButton}</Button>
    </div>
  );

  const resultSection = isCalculated ? (
    <Card>
      <CardHeader>
        <CardTitle>{t.results.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t.results.totalDays}</span>
          <span className="font-bold">{totalDays}{isKo ? '일' : ' days'}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t.results.dailyAverageWage}</span>
          <span className="font-bold">{dailyAverageWage.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
        </div>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">{t.results.estimatedSeverancePay}</p>
          <p className="text-3xl font-bold text-blue-600">{severancePay.toLocaleString()}{isKo ? '원' : ' KRW'}</p>
        </div>
      </CardContent>
    </Card>
  ) : (
     <div className="flex items-center justify-center text-muted-foreground h-40">
        {t.placeholder}
      </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? '퇴직금' : 'Severance Pay', desc: isKo ? '1년 이상 근무한 근로자가 퇴직할 때 받는 급여로, 1일 평균임금의 30일분에 총 재직일수를 365일로 나눈 값을 곱해 산정합니다.' : 'Pay received by an employee upon retirement after 1+ years, calculated as 30 days of average daily wage times total tenure divided by 365.' },
            { term: isKo ? '1일 평균임금' : 'Average Daily Wage', desc: isKo ? '퇴직 전 3개월 임금 총액(상여금·연차수당 환산 포함)을 그 기간 총 일수로 나눈 금액입니다.' : 'Total wages for the 3 months before retirement (including bonuses and converted annual-leave pay) divided by the total days in that period.' },
            { term: isKo ? 'IRP (개인형 퇴직연금)' : 'IRP (Individual Retirement Pension)', desc: isKo ? '퇴직금을 이전받아 운용하는 계좌로, 과세를 이연하고 절세 혜택을 누릴 수 있습니다.' : 'An account that receives and manages severance pay, allowing tax deferral and tax-saving benefits.' },
          ]} />
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: t.formulaContent }} />
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8" dangerouslySetInnerHTML={{ __html: t.tipsContent }} />
    )
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RetirementCalculator;
