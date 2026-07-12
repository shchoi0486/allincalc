'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const MonthlyCompoundSavingsCalculator: NextPage = () => {
  const { dict, locale } = useI18n();
  const t = dict.compoundInterest;
  const isKo = locale === 'ko';

  const [initialInvestment, setInitialInvestment] = useState<number>(0)
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [depositTiming, setDepositTiming] = useState<'start' | 'end'>('end')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const [hasCalculated, setHasCalculated] = useState<boolean>(false)

  const { futureValue, totalInterest, totalPrincipal, chartData, error } = useMemo(() => {
    const p = initialInvestment;
    const m = monthlyDeposit;
    const t = months;
    const r = annualRate / 100;
    const isStartOfMonth = depositTiming === 'start';

    if (isNaN(p) || isNaN(m) || isNaN(t) || isNaN(r)) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "Please enter valid values." };
    }
    if (t <= 0) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "Period must be greater than 0." };
    }

    const monthlyRate = r / 12;

    let calculatedFV = p * Math.pow(1 + monthlyRate, t);
    if (m > 0) {
      if (isStartOfMonth) {
        calculatedFV += m * ((Math.pow(1 + monthlyRate, t) - 1) / monthlyRate) * (1 + monthlyRate);
      } else {
        calculatedFV += m * ((Math.pow(1 + monthlyRate, t) - 1) / monthlyRate);
      }
    }

    const finalTotalPrincipal = p + (m * t);
    const finalTotalInterest = calculatedFV - finalTotalPrincipal;

    const data = Array.from({ length: t + 1 }, (_, i) => {
      const currentMonth = i;
      let principalAtMonth = p + (m * currentMonth);
      let monthEndValue = p * Math.pow(1 + monthlyRate, currentMonth);
      if (m > 0 && currentMonth > 0) {
        if (isStartOfMonth) {
          monthEndValue += m * ((Math.pow(1 + monthlyRate, currentMonth) - 1) / monthlyRate) * (1 + monthlyRate);
        } else {
          monthEndValue += m * ((Math.pow(1 + monthlyRate, currentMonth) - 1) / monthlyRate);
        }
      }
      const monthlyInterest = monthEndValue - principalAtMonth;

      return {
        month: `${currentMonth}`,
        principal: Math.round(principalAtMonth),
        interest: Math.round(monthlyInterest),
        totalWithInterest: Math.round(monthEndValue),
      };
    });

    return {
      futureValue: Math.round(calculatedFV),
      totalInterest: Math.round(finalTotalInterest),
      totalPrincipal: Math.round(finalTotalPrincipal),
      chartData: data,
      error: null
    };
  }, [initialInvestment, monthlyDeposit, months, annualRate, depositTiming]);

  React.useEffect(() => {
    if (hasCalculated) {
      if (error) {
        toast.error(error);
      } else if (!error) {
        toast.success('Monthly compound savings calculation complete.');
      }
    }
  }, [hasCalculated, futureValue, error]);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true)
  }, [])

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initialInvestment">{t.inputs.initialInvestment}</Label>
        <Input
          id="initialInvestment"
          value={initialInvestment.toLocaleString()}
          onChange={handleInputChange(setInitialInvestment)}
          placeholder="0"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyDeposit">{t.inputs.monthlyDeposit}</Label>
        <Input
          id="monthlyDeposit"
          value={monthlyDeposit.toLocaleString()}
          onChange={handleInputChange(setMonthlyDeposit)}
          placeholder="100,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="months">{t.inputs.months}</Label>
        <Input
          id="months"
          value={months.toLocaleString()}
          onChange={handleInputChange(setMonths)}
          placeholder="12"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">{t.inputs.annualRate}</Label>
        <Input
          id="annualRate"
          value={annualRate.toLocaleString()}
          onChange={handleInputChange(setAnnualRate)}
          placeholder="5"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="depositTiming">{t.inputs.depositTiming}</Label>
        <ToggleGroup type="single" value={depositTiming} onValueChange={(value: 'start' | 'end') => setDepositTiming(value)} className="w-full">
          <ToggleGroupItem value="start" className="flex-1">{t.depositTimingOptions.start}</ToggleGroupItem>
          <ToggleGroupItem value="end" className="flex-1">{t.depositTimingOptions.end}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">
        {dict.common.calculate}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col justify-center h-full space-y-2">
      {hasCalculated && !error ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t.results.totalPrincipal}</span>
            <span className="text-lg font-bold">{totalPrincipal?.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">{t.results.totalInterest}</span>
            <span className="text-lg font-bold text-green-600">{totalInterest?.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold">{t.results.maturityAmount}</span>
            <span className="text-2xl font-extrabold text-primary">{futureValue?.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground h-full flex items-center justify-center">
          {t.results.placeholder}
        </div>
      )}
    </div>
  );

  const fullWidthSection = hasCalculated && !error ? (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList>
        <TabsTrigger value="chart">{t.tabs.chart}</TabsTrigger>
        <TabsTrigger value="details">{t.tabs.details}</TabsTrigger>
      </TabsList>
      <TabsContent value="chart">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()}{isKo ? '원' : ' KRW'}`} />
              <Legend wrapperStyle={{ position: 'relative' }} />
              <Line type="monotone" dataKey="principal" name={t.chartKeys.principal} stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="totalWithInterest" name={t.chartKeys.totalWithInterest} stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="overflow-y-auto max-h-[300px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.tableHeaders.month}</TableHead>
                <TableHead className="text-right">{t.tableHeaders.principal}</TableHead>
                <TableHead className="text-right">{t.tableHeaders.interest}</TableHead>
                <TableHead className="text-right">{t.tableHeaders.totalWithInterest}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {chartData.map((data) => (
                <TableRow key={data.month}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell className="text-right">{data.principal.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
                  <TableCell className="text-right">{data.interest.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
                  <TableCell className="text-right">{data.totalWithInterest.toLocaleString()}{isKo ? '원' : ' KRW'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <>
        <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? '복리 (Compound Interest)' : 'Compound Interest', desc: isKo ? '이자가 원금에 더해져 다음 기간의 이자 계산에 포함되는 방식으로, 시간이 지날수록 자산이 눈덩이처럼 불어납니다.' : 'Interest added to the principal so it earns interest in the next period; assets snowball and grow over time.' },
            { term: isKo ? '단리 (Simple Interest)' : 'Simple Interest', desc: isKo ? '처음 투자한 원금에 대해서만 이자를 계산하는 방식으로, 복리에 비해 동일 조건에서 최종 수령액이 적습니다.' : 'Interest calculated only on the initially invested principal; yields less than compound interest under the same conditions.' },
            { term: isKo ? '72의 법칙' : "The Rule of 72", desc: isKo ? '원금이 2배가 되는 데 걸리는 대략적인 기간(년)을 구하는 공식으로, 72를 연이율(%)로 나누면 됩니다.' : 'A formula to estimate the approximate years for principal to double: divide 72 by the annual interest rate (%).' },
          ]} />
      </>
    ),
    calculationFormula: (
      <div dangerouslySetInnerHTML={{ __html: t.formulaContent }} />
    ),
    usefulTips: (
      <div dangerouslySetInnerHTML={{ __html: t.tipsContent }} />
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.fullTitle}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default MonthlyCompoundSavingsCalculator
