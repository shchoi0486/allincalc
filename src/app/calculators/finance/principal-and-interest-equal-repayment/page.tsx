'use client'

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from '@/utils/formatNumber';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ChartData {
    month: number;
    '월 상환금': number;
    '상환 원금': number;
    '상환 이자': number;
}

export default function LevelPaymentPage() {
  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - principal;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(monthlyPayment),
        remainingBalance: Math.round(remainingBalance < 0 ? 0 : remainingBalance),
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            '월 상환금': parseFloat(monthlyPayment.toFixed(0)),
            '상환 원금': parseFloat(principalPayment.toFixed(0)),
            '상환 이자': parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: totalRepayment,
      monthlyPayment: monthlyPayment,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization;
    if (results) {
        setCalculationResults(results);
        toast.success("계산이 완료되었습니다.");
    } else {
        setCalculationResults(null);
        toast.error("올바른 대출 정보를 입력해주세요.");
    }
  };

  const LeftColumn = (
    <>
      <CardHeader>
        <CardTitle>대출 정보 입력</CardTitle>
        <CardDescription>대출 원금, 기간, 이자율을 입력해주세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">대출 원금 (원)</Label>
          <Input id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder="예: 100,000,000" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanTerm">대출 기간 (년)</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder="예: 30" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate">연 이자율 (%)</Label>
          <Input id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder="예: 4.5" />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      </CardFooter>
    </>
  );

  const RightColumn = (
    <>
      {calculationResults ? (
        <>
            <CardHeader>
                <CardTitle>계산 결과 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">월 상환금</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.monthlyPayment)} 원</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">총 상환 이자</span>
                    <Badge variant="destructive" className="text-lg">{formatNumber(calculationResults.totalInterest)} 원</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xl font-semibold">
                    <span>총 상환 금액</span>
                    <span className="text-blue-600">{formatNumber(calculationResults.totalRepayment)} 원</span>
                </div>
            </CardContent>
            <Tabs defaultValue="chart" className="w-full mt-4">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="chart">차트</TabsTrigger>
                    <TabsTrigger value="details">월별 상세 내역</TabsTrigger>
                </TabsList>
                <TabsContent value="chart">
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={calculationResults.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis tickFormatter={(value) => value.toLocaleString()} />
                                <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
                                <Legend />
                                <Line type="monotone" dataKey="월 상환금" stroke="#8884d8" />
                                <Line type="monotone" dataKey="상환 원금" stroke="#82ca9d" />
                                <Line type="monotone" dataKey="상환 이자" stroke="#ffc658" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </TabsContent>
                <TabsContent value="details">
                    <div className="overflow-x-auto max-h-[400px] w-full">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-center w-[60px]">개월</TableHead>
                                    <TableHead className="text-center">상환<br />원금</TableHead>
                                    <TableHead className="text-center">상환<br />이자</TableHead>
                                    <TableHead className="text-center">총<br />상환금</TableHead>
                                    <TableHead className="text-center">대출 잔액</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {calculationResults.repaymentSchedule.map((data: RepaymentDetail) => (
                                    <TableRow key={data.month}>
                                        <TableCell className="text-center whitespace-nowrap w-[60px]">{data.month}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.principalPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.interestPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.totalPayment)}</TableCell>
                                        <TableCell className="text-right whitespace-nowrap">{formatNumber(data.remainingBalance)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-full">
          계산하기 버튼을 눌러주세요
        </div>
      )}
    </>
  );

  const InfoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          <strong>원리금 균등 분할 상환</strong>은 주택담보대출, 신용대출 등 금융권 대출에서 가장 보편적으로 사용되는 상환 방식입니다. 이름 그대로 대출 기간 내내 <strong>매월 동일한 금액(원금+이자)</strong>을 갚아나가는 것이 핵심입니다.
        </p>
        <p>
          매달 상환액이 일정하기 때문에 장기적인 자금 계획을 세우기 매우 용이하며, 소득이 일정한 직장인에게 특히 선호됩니다. 이 계산기는 여러분의 대출 조건에 따른 월 상환금을 정확히 계산하고, 전체 상환 스케줄을 한눈에 보여줌으로써 안정적인 금융 계획 수립을 돕습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">원리금 균등 분할 상환액은 복잡한 수학 공식을 통해 계산됩니다. 매월 동일한 금액을 내지만, 그 안의 원금과 이자 비중은 매번 달라집니다.</p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">1. 월 상환금(고정) 계산 공식</h3>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto">
            월 상환금 = [대출원금 × 월이율 × (1 + 월이율)^상환개월수] / [(1 + 월이율)^상환개월수 - 1]
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">※ 월이율 = 연이율 / 12</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">2. 매월 상환 원금 및 이자 계산</h3>
          <p className="mt-3">월 상환금은 고정되어 있지만, 그 구성은 매달 변합니다.</p>
          <ul className="text-sm list-disc list-inside mt-2 space-y-2">
            <li>
              <strong>월 상환 이자 (점점 감소):</strong>
              <p className="font-mono p-2 bg-white dark:bg-gray-900 rounded-md text-xs shadow-sm mt-1">전월 대출 잔액 × 월이율</p>
            </li>
            <li>
              <strong>월 상환 원금 (점점 증가):</strong>
              <p className="font-mono p-2 bg-white dark:bg-gray-900 rounded-md text-xs shadow-sm mt-1">월 상환금(고정) - 월 상환 이자</p>
            </li>
          </ul>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">초기에는 이자 비중이 높고, 시간이 지날수록 원금 상환 비중이 높아지는 구조입니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">🏠 내 집 마련, 2025년 대출 전략 가이드</h2>
        
        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-red-500">
          <h3 className="font-bold text-lg text-red-600 dark:text-red-400">1. 원리금 균등 vs 원금 균등, 나에게 맞는 방식은?</h3>
          <p className="mt-2">두 방식의 가장 큰 차이는 <strong>초기 상환 부담</strong>과 <strong>총이자 비용</strong>입니다.</p>
          <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">원리금 균등 상환 (본 계산기)</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong>장점:</strong> 매월 상환액 동일 (자금 계획 용이)</li>
                <li><strong>단점:</strong> 원금 균등 방식보다 총이자 많음</li>
                <li><strong>추천 대상:</strong> 소득이 일정하고 예측 가능한 미래를 계획하는 직장인, 사회초년생</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">원금 균등 상환</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong>장점:</strong> 총이자 비용이 가장 저렴</li>
                <li><strong>단점:</strong> 초기 상환 부담이 큼 (월 상환액이 점점 줄어듦)</li>
                <li><strong>추천 대상:</strong> 초기 자금 여유가 있고, 이자 비용을 최소화하고 싶은 경우, 소득 감소가 예상되는 은퇴 예정자</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500">
          <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400">2. 2025년 강화된 DSR 규제와 스트레스 DSR 이해하기</h3>
          <p className="mt-2">2025년부터는 대출 심사가 더 깐깐해집니다. 특히 <strong>스트레스 DSR</strong> 제도가 핵심입니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li><strong>DSR (총부채원리금상환비율):</strong> 연 소득 대비 모든 대출의 연간 원리금 상환액 비율. 현재 은행권 40% 적용.</li>
            <li><strong>스트레스 DSR:</strong> 미래 금리 인상 가능성을 대비해, 실제 대출금리에 <strong>가산금리(스트레스 금리)</strong>를 더해 DSR을 산정하는 방식입니다.</li>
            <li><strong>결과:</strong> 동일한 소득과 대출이라도, 가산금리가 적용되어 대출 한도가 과거보다 줄어들게 됩니다. 대출 계획 시 예상보다 한도가 적게 나올 수 있음을 반드시 인지해야 합니다.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-indigo-500">
          <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">3. 중도상환수수료, '3년의 법칙'을 기억하세요.</h3>
          <p className="mt-2">대출 후 목돈이 생겨 원금을 미리 갚고 싶을 때 발생하는 것이 중도상환수수료입니다. 보통 대출 실행 후 <strong>3년</strong>까지 부과됩니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>수수료는 보통 1.2% ~ 1.5% 수준이며, 기간에 따라 점차 감소(슬라이딩 방식)합니다.</li>
            <li><strong>전략:</strong> 3년 이내 상환 계획이 있다면, 중도상환수수료 면제 상품을 찾아보거나, 수수료와 절감되는 이자를 비교하여 유불리를 따져봐야 합니다. 3년이 지난 후에는 수수료 없이 자유롭게 원금을 상환할 수 있습니다.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-teal-500">
          <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">4. 거치기간, 정말 필요할까요?</h3>
          <p className="mt-2">거치기간은 일정 기간 동안 이자만 납부하고 원금 상환을 유예하는 기간입니다. 당장의 상환 부담은 줄지만, 총이자 부담은 크게 늘어나는 단점이 있습니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>원금 상환이 늦어지는 만큼, 전체 대출 기간 동안 내야 할 총이자가 증가합니다.</li>
            <li><strong>전략:</strong> 입주 초기 자금 부담 등 불가피한 경우가 아니라면, 거치기간은 설정하지 않거나 최소화하는 것이 장기적으로 유리합니다.</li>
          </ul>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="원리금 균등 분할 상환 계산기"
      description="매월 동일한 금액을 상환하는 원리금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}

