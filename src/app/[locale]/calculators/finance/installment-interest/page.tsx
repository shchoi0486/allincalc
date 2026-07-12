"use client"

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { round } from 'mathjs'
import { Button } from '@/components/ui/button'
import {
  PieChart,
  Pie,
  PieLabelRenderProps,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber } from '@/utils/formatNumber'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const COLORS = ['#0088FE', '#FF8042']

const InstallmentInterestCalculator: NextPage = () => {
  const { dict, locale } = useI18n();
  const t = dict.installmentInterest;
  const isKo = locale === 'ko';

  const [principal, setPrincipal] = useState<number>(1000000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');
  const [calculationCompleted, setCalculationCompleted] = useState<boolean>(false);

  const calculationResults = useMemo(() => {
    if (principal <= 0 || months <= 0 || annualRate < 0) {
      setCalculationCompleted(false);
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        principal: 0,
        principalToTotalInterestRatio: 0,
        totalInterestToTotalPaymentRatio: 0,
      };
    }

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (annualRate === 0) {
      monthlyPayment = principal / months;
      totalPayment = principal;
      totalInterest = 0;
    } else {
      const monthlyRate = annualRate / 100 / 12;
      monthlyPayment =
        principal *
        (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
    }

    const principalToTotalInterestRatio = totalInterest > 0 ? (totalInterest / principal) * 100 : 0;
    const totalInterestToTotalPaymentRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    setCalculationCompleted(true);
    return {
      monthlyPayment: round(monthlyPayment),
      totalPayment: round(totalPayment),
      totalInterest: round(totalInterest),
      principal: principal,
      principalToTotalInterestRatio: round(principalToTotalInterestRatio, 2),
      totalInterestToTotalPaymentRatio: round(totalInterestToTotalPaymentRatio, 2),
    };
  }, [principal, months, annualRate]);

  const pieData = useMemo(() => {
    const principalValue = principal
    if (calculationResults.totalPayment <= 0) return []
    return [
      { name: t.chartLabels.principal, value: principalValue },
      { name: t.chartLabels.totalInterest, value: calculationResults.totalInterest },
    ]
  }, [principal, calculationResults.totalInterest, calculationResults.totalPayment, t])

    const inputSection = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="principal">{t.inputs.principal}</Label>
        <Input
          id="principal"
          type="number"
          value={principal}
          onChange={e => setPrincipal(Number(e.target.value))}
          placeholder="1,000,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="months">{t.inputs.months}</Label>
        <Input
          id="months"
          type="number"
          value={months}
          onChange={e => setMonths(Number(e.target.value))}
          placeholder="12"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">{t.inputs.annualRate}</Label>
        <Input
          id="annualRate"
          type="number"
          step="0.1"
          value={annualRate}
          onChange={e => setAnnualRate(Number(e.target.value))}
          placeholder="5"
          className="text-right"
        />
      </div>
    </div>
        <Button onClick={() => setCalculationCompleted(true)} className="w-full mt-4">
          {dict.common.calculate}
        </Button>
      </>
    );

    const resultSection = (
      <div className="space-y-3">
        {calculationCompleted && calculationResults.totalPayment > 0 ? (
          <>
            <div className="flex justify-between">
              <span>{t.results.monthlyPayment}</span>
              <span className="text-lg font-bold">{formatNumber(calculationResults.monthlyPayment)}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.results.totalPayment}</span>
              <span className="text-lg font-bold">{formatNumber(calculationResults.totalPayment)}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.results.totalInterest}</span>
              <span className="text-lg font-bold text-red-500">{formatNumber(calculationResults.totalInterest)}{isKo ? '원' : ' KRW'}</span>
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-10">
            {t.results.placeholder}
          </div>
        )}
      </div>
    );

    const fullWidthSection = calculationCompleted && calculationResults.totalPayment > 0 ? (
      <div>
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-base font-semibold">{t.chartTitle}</h3>
          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="table">
            <ToggleGroupItem value="table">Table</ToggleGroupItem>
            <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
          </ToggleGroup>
        </div>
        {viewMode === 'table' ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.tableHeaders.category}</TableHead>
                  <TableHead className="text-right">{t.tableHeaders.amount}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{t.tableRows.monthlyPayment}</TableCell>
                  <TableCell className="text-right">{formatNumber(calculationResults.monthlyPayment)}{isKo ? '원' : ' KRW'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t.tableRows.totalPayment}</TableCell>
                  <TableCell className="text-right">{formatNumber(calculationResults.totalPayment)}{isKo ? '원' : ' KRW'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t.tableRows.totalInterest}</TableCell>
                  <TableCell className="text-right text-red-500">{formatNumber(calculationResults.totalInterest)}{isKo ? '원' : ' KRW'}</TableCell>
                </TableRow>
                {calculationResults.principal > 0 && (
                  <>
                    <TableRow>
                      <TableCell>{t.tableRows.principal}</TableCell>
                      <TableCell className="text-right">{formatNumber(calculationResults.principal)}{isKo ? '원' : ' KRW'}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t.tableRows.principalInterestRatio}</TableCell>
                      <TableCell className="text-right">{calculationResults.principalToTotalInterestRatio}%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>{t.tableRows.interestPaymentRatio}</TableCell>
                      <TableCell className="text-right">{calculationResults.totalInterestToTotalPaymentRatio}%</TableCell>
                    </TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="w-full">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }: PieLabelRenderProps) =>
                    `${name} ${((typeof percent === 'number' ? percent : 0) * 100).toFixed(0)}%`
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${formatNumber(value)}{isKo ? '원' : ' KRW'}`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    ) : null;

    const infoSection = {
      calculatorDescription: (
        <>
          <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? '원리금 균등 상환' : 'Equal Principal & Interest', desc: isKo ? '매달 동일한 금액(원금+이자)을 갚는 방식으로, 초기에는 이자 비중이 높고 시간이 지날수록 원금 비중이 커집니다.' : 'Repaying the same amount (principal + interest) each month; the interest share is higher early on and the principal share grows over time.' },
            { term: isKo ? '원금 균등 상환' : 'Equal Principal', desc: isKo ? '매달 동일한 원금을 갚고 남은 원금에 대해서만 이자를 내는 방식으로, 초기 상환액이 크지만 총이자가 적습니다.' : 'Repaying the same principal each month and interest only on the remaining balance; higher early payments but less total interest.' },
            { term: isKo ? '중도상환수수료' : 'Early Repayment Fee', desc: isKo ? '대출 기간 중 원금을 미리 갚을 때 금융기관에 내는 위약금 성격의 수수료입니다.' : 'A penalty-type fee charged by the lender when principal is repaid ahead of schedule.' },
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
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.chartTitle}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}
export default InstallmentInterestCalculator
