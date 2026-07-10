'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const MonthlyCompoundSavingsCalculator: NextPage = () => {
  const [initialInvestment, setInitialInvestment] = useState<number>(0)
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [depositTiming, setDepositTiming] = useState<'start' | 'end'>('end') // 월초 또는 월말

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
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "모든 필드를 올바르게 입력해주세요." };
    }
    if (t <= 0) {
      return { futureValue: null, totalInterest: null, totalPrincipal: null, chartData: [], error: "투자기간은 0보다 커야 합니다." };
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
        month: `${currentMonth}개월차`,
        원금: Math.round(principalAtMonth),
        월별이자: Math.round(monthlyInterest),
        이자포함원금: Math.round(monthEndValue),
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
        toast.success('월 복리 적금 계산이 완료되었습니다.');
      }
    }
  }, [hasCalculated, futureValue, error]);

  const handleCalculate = useCallback(() => {
    setHasCalculated(true)
  }, [])

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initialInvestment">초기 투자금 (원)</Label>
        <Input
          id="initialInvestment"
          value={initialInvestment.toLocaleString()}
          onChange={handleInputChange(setInitialInvestment)}
          placeholder="예: 0"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyDeposit">월 적립금 (원)</Label>
        <Input
          id="monthlyDeposit"
          value={monthlyDeposit.toLocaleString()}
          onChange={handleInputChange(setMonthlyDeposit)}
          placeholder="예: 100,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="months">투자기간 (개월)</Label>
        <Input
          id="months"
          value={months.toLocaleString()}
          onChange={handleInputChange(setMonths)}
          placeholder="예: 12"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">연 이자율 (%)</Label>
        <Input
          id="annualRate"
          value={annualRate.toLocaleString()}
          onChange={handleInputChange(setAnnualRate)}
          placeholder="예: 5"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="depositTiming">적립 시점</Label>
        <ToggleGroup type="single" value={depositTiming} onValueChange={(value: 'start' | 'end') => setDepositTiming(value)} className="w-full">
          <ToggleGroupItem value="start" className="flex-1">월초</ToggleGroupItem>
          <ToggleGroupItem value="end" className="flex-1">월말</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col justify-center h-full space-y-2">
      {hasCalculated && !error ? (
        <>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 원금</span>
              <span className="text-lg font-bold">{totalPrincipal?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">총 이자 (세전)</span>
              <span className="text-lg font-bold text-green-600">{totalInterest?.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">만기지급금액</span>
              <span className="text-2xl font-extrabold text-primary">{futureValue?.toLocaleString()}원</span>
            </div>
          </div>
          <Tabs defaultValue="details" className="w-full mt-2 border-b">
            <TabsList>
              <TabsTrigger value="chart">차트</TabsTrigger>
              <TabsTrigger value="details">월별 상세 내역</TabsTrigger>
            </TabsList>
            <TabsContent value="chart">
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => value.toLocaleString()} />
                    <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
                    <Legend wrapperStyle={{ position: 'relative' }} />
                    <Line type="monotone" dataKey="원금" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="이자포함원금" stroke="#82ca9d" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="details">
              <div className="overflow-y-auto max-h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>개월차</TableHead>
                      <TableHead className="text-right">원금</TableHead>
                      <TableHead className="text-right">이자 (세전)</TableHead>
                      <TableHead className="text-right">이자포함원금</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chartData.map((data) => (
                      <TableRow key={data.month}>
                        <TableCell>{data.month}</TableCell>
                        <TableCell className="text-right">{data.원금.toLocaleString()}원</TableCell>
              <TableCell className="text-right">{data.월별이자.toLocaleString()}원</TableCell>
              <TableCell className="text-right">{data.이자포함원금.toLocaleString()}원</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center text-muted-foreground h-full flex items-center justify-center">
          계산 정보를 입력하고 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <h3 className="font-semibold text-xl mb-3 text-primary">"세계 8대 불가사의", 복리 계산기 완벽 가이드</h3>
        <p className="text-foreground leading-relaxed">
          알버트 아인슈타인이 "인류 최고의 발명"이자 "세계 8대 불가사의"라고 칭했던 <strong>복리(Compound Interest)</strong>. 복리 계산기는 바로 이 강력한 힘을 여러분의 자산 증식에 활용할 수 있도록 돕는 필수 도구입니다. 단순히 원금에 대해서만 이자가 붙는 '단리'와는 차원이 다릅니다. 복리는 <strong>'이자에 이자가 붙는'</strong> 마법 같은 원리를 통해, 마치 눈덩이가 언덕을 굴러 내려오며 거대해지듯 여러분의 자산을 기하급수적으로 불려줍니다.
          <br/><br/>
          이 계산기는 초기 투자금, 매월 꾸준히 납입할 적립금, 기대 연이율, 그리고 가장 중요한 '시간'이라는 변수를 입력하여 미래의 내 자산이 얼마나 될지 정밀하게 예측해 줍니다. 막연한 부자의 꿈을 구체적인 숫자로 시각화하여, 현실적인 재무 목표를 설정하고 꾸준히 동기를 부여받는 데 최고의 파트너가 될 것입니다.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3">복리 계산, 어떻게 이루어지나요?</h3>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-primary bg-muted">
            <h4 className="font-semibold text-lg mb-2">1. 거치식 투자 (월 적립금 없는 경우)</h4>
            <p className="mb-2">초기 투자금만 넣어두고 더 이상 추가 납입을 하지 않을 때의 계산법입니다.</p>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
              <strong>미래가치(FV) = 원금(P) * (1 + 월이율)^개월수</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              - <strong>P (Principal)</strong>: 초기 투자 원금<br/>
              - <strong>월이율</strong>: 연이율(r) / 12<br/>
              - <strong>개월수</strong>: 투자 기간(년) * 12
            </p>
          </div>

          <div className="p-4 border-l-4 border-primary bg-muted">
            <h4 className="font-semibold text-lg mb-2">2. 적립식 투자 (월 적립금 있는 경우)</h4>
            <p className="mb-2">매월 꾸준히 일정 금액을 추가로 투자할 때, 복리의 효과는 극대화됩니다. 이 계산기는 월초/월말 납입 시점을 선택하여 더 정밀한 계산이 가능합니다.</p>
            <p className="font-mono p-3 bg-muted rounded-md my-2">
              <strong>월초 납입 시:</strong><br/>
              미래가치(FV) = [거치식 FV] + 월적립액(M) * [((1+월이율)^개월수 - 1) / 월이율] * (1+월이율)
            </p>
            <p className="font-mono p-3 bg-muted rounded-md my-2">
              <strong>월말 납입 시:</strong><br/>
              미래가치(FV) = [거치식 FV] + 월적립액(M) * [((1+월이율)^개월수 - 1) / 월이율]
            </p>
            <p className="text-sm text-muted-foreground">
              월초에 납입하면 한 달치 이자를 더 받기 때문에 월말에 납입하는 것보다 최종 금액이 약간 더 커집니다. 사소한 차이 같지만, 투자 기간이 길어질수록 이 차이는 무시할 수 없는 수준으로 벌어집니다.
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold text-foreground mb-2">계산 예시 (월복리 적립, 월초 납입)</h4>
          <p className="text-sm text-muted-foreground">매월 10만 원, 12개월, 연 5%인 경우</p>
          <p className="font-mono text-sm text-primary mt-1">r = 5% ÷ 12 ≈ 0.0041667</p>
          <p className="font-mono text-sm text-primary">FV = 100,000 × 1.0041667 × [((1.0041667)^12 − 1) / 0.0041667] ≈ 1,238,464원</p>
          <p className="text-xs text-muted-foreground mt-1">원금 합계 1,200,000원 대비 이자 약 38,464원 발생 (월말 납입 시 약 1,233,556원으로 약 4,900원 적음)</p>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3">복리 효과 200% 활용을 위한 유용한 팁</h3>
        <ul className="space-y-4">
          <li className="p-4 rounded-md bg-muted shadow">
            <h4 className="font-semibold text-lg mb-2 text-primary">1. 시간의 마법사, 지금 바로 시작하세요</h4>
            <p>복리 효과의 핵심 재료는 '시간'입니다. 25세에 매월 30만원씩 투자를 시작한 사람과 35세에 매월 60만원씩 시작한 사람을 비교해볼까요? 연 8% 수익률을 가정하면, 65세가 되었을 때 25세에 시작한 사람의 자산이 훨씬 더 많습니다. 일찍 시작하는 것이 적은 돈으로 더 큰 부를 쌓는 가장 확실한 방법입니다.</p>
          </li>
          <li className="p-4 rounded-md bg-muted shadow">
            <h4 className="font-semibold text-lg mb-2 text-primary">2. '72의 법칙'으로 복리의 힘 체감하기</h4>
            <p>복잡한 계산 없이 투자 원금이 2배가 되는 시간을 어림짐작할 수 있는 마법의 공식입니다. <strong>'72 / 연이율(%) ≈ 원금 2배 달성 기간(년)'</strong>. 예를 들어, 연이율이 8%라면 약 9년(72/8)마다 자산이 두 배로 불어나는 셈입니다. 이 법칙을 통해 장기적인 자산 증식 계획을 직관적으로 세울 수 있습니다.</p>
          </li>
          <li className="p-4 rounded-md bg-muted shadow">
            <h4 className="font-semibold text-lg mb-2 text-primary">3. 세금, 똑똑하게 관리하기 (2025년 기준)</h4>
            <p>일반적인 예적금이나 펀드에서 발생하는 이자 및 배당 소득에는 <strong>15.4%의 세금</strong>이 부과됩니다. 1,000만원의 이자 수익이 발생했다면 154만원이 세금으로 나가는 셈이죠. 이 세금을 줄이는 것이 실질 수익률을 높이는 핵심입니다. 개인종합자산관리계좌(ISA), 연금저축, IRP 등 <strong>절세/비과세 혜택을 제공하는 금융 상품</strong>을 최우선으로 활용하여 '세후 수익률'을 극대화하는 전략이 반드시 필요합니다.</p>
          </li>
          <li className="p-4 rounded-md bg-muted shadow">
            <h4 className="font-semibold text-lg mb-2 text-primary">4. 꾸준함이 최고의 무기입니다</h4>
            <p>단기적인 시장의 등락에 일희일비하는 것은 장기 투자의 가장 큰 적입니다. 시장이 좋을 때나 나쁠 때나 꾸준히 정해진 금액을 투자하는 '적립식 투자(코스트 에버리징 효과)'는 평균 매입 단가를 낮춰 장기적으로 안정적인 수익을 기대하게 합니다. 감정에 휘둘리지 말고, 세워둔 계획에 따라 꾸준히 투자하는 것이 성공의 왕도입니다.</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="월 복리 적금 계산기"
      description="매월 꾸준히 모아 목돈을 만드는 월 복리 적금, 만기 예상 금액을 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default MonthlyCompoundSavingsCalculator