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

export default function PrincipalEqualAmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [calculationResults, setCalculationResults] = useState<any>(null); // 초기값을 null로 설정

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyPrincipalPayment = principal / months;
    const monthlyRate = annualRate / 12;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const totalPayment = monthlyPrincipalPayment + interestPayment;
      remainingBalance -= monthlyPrincipalPayment;
      totalInterest += interestPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: Math.round(monthlyPrincipalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(totalPayment),
        remainingBalance: Math.round(remainingBalance < 0 ? 0 : remainingBalance),
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            '월 상환금': parseFloat(totalPayment.toFixed(0)),
            '상환 원금': parseFloat(monthlyPrincipalPayment.toFixed(0)),
            '상환 이자': parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: principal + totalInterest,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization; // useMemo로 계산된 값을 가져옴
    if (results) {
        setCalculationResults(results); // 계산 결과를 상태에 저장
        toast.success("계산이 완료되었습니다.");
    } else {
        setCalculationResults(null); // 유효하지 않은 경우 결과 초기화
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
                    <span className="text-muted-foreground">총 대출 원금</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.totalPrincipal)} 원</span>
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
                                        <TableCell className="whitespace-nowrap w-[60px]">{data.month}</TableCell>
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
          <strong>원금 균등 분할 상환</strong>은 대출 이자를 가장 아낄 수 있는, 가장 정직한 상환 방식입니다. 대출 원금을 상환 기간으로 똑같이 나누어 <strong>매월 동일한 원금</strong>을 갚아나가고, 이자는 남은 원금에 대해서만 계산하여 납부합니다.
        </p>
        <p>
          이 방식의 핵심은 시간이 지날수록 월 상환액이 점차 줄어든다는 것입니다. 원금이 꾸준히 줄어드니 내야 할 이자도 자연스럽게 감소하기 때문입니다. 초기 상환 부담은 다소 높지만, 전체 대출 기간 동안의 총이자 비용을 최소화하고 싶다면 가장 현명한 선택입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">원금 균등 분할 상환의 계산 구조는 매우 직관적입니다. 매월 갚는 원금은 고정되어 있고, 이자만 변동됩니다.</p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">1. 월 상환 원금 (고정)</h3>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm">
            월 상환 원금 = 총 대출 원금 / 상환 개월 수
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">예: 1억 원을 30년(360개월)간 빌렸다면, 매월 갚는 원금은 약 277,777원으로 동일합니다.</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">2. 월 상환 이자 (변동)</h3>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm">
            월 상환 이자 = 전월 대출 잔액 × 월 이자율 (연이율 / 12)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">대출 잔액이 매달 줄어들기 때문에, 이자 금액도 매달 감소합니다.</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-yellow-500">
          <h3 className="text-lg font-bold text-yellow-600 dark:text-yellow-400 mb-3">3. 월 총 상환금 (변동)</h3>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm">
            월 총 상환금 = 월 상환 원금(고정) + 월 상환 이자(변동)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">결과적으로 월 총 상환금은 대출 초기일수록 가장 높고, 회차가 지날수록 점차 줄어드는 계단식 형태를 띱니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">💡 이자를 가장 아끼는 상환법, 2025년 누가 선택해야 할까?</h2>
        
        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-red-500">
          <h3 className="font-bold text-lg text-red-600 dark:text-red-400">1. 원금 균등 vs 원리금 균등: 최종 승자는?</h3>
          <p className="mt-2">정답은 없습니다. 당신의 <strong>자금 상황과 미래 계획</strong>에 따라 최적의 선택이 달라집니다.</p>
          <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20">
              <h4 className="font-bold text-center">원금 균등 상환 (본 계산기)</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>🏆 <strong>총이자 최소화:</strong> 가장 큰 장점. 원금 감소 속도가 빨라 이자 부담이 가장 적습니다.</li>
                <li>📈 <strong>초기 상환 부담:</strong> 가장 큰 단점. 첫 회차 상환액이 가장 높습니다.</li>
                <li><strong>추천 대상:</strong>
                    <ul className="list-['-_'] list-inside ml-4 mt-1">
                        <li>초기 자금 여유가 있는 경우</li>
                        <li>향후 소득 감소가 예상되는 은퇴 예정자</li>
                        <li>1원이라도 이자를 아끼고 싶은 적극적인 재테크 성향</li>
                    </ul>
                </li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">원리금 균등 상환</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>📅 <strong>계획적인 지출:</strong> 매월 상환액이 동일하여 예산 관리가 편리합니다.</li>
                <li>📉 <strong>이자 부담 상대적 높음:</strong> 원금 균등 방식보다 총 납부 이자가 많습니다.</li>
                <li><strong>추천 대상:</strong>
                    <ul className="list-['-_'] list-inside ml-4 mt-1">
                        <li>매월 고정적인 소득이 있는 직장인</li>
                        <li>사회초년생 등 초기 자금 부담을 줄이고 싶은 경우</li>
                        <li>안정적인 자금 흐름을 최우선으로 생각하는 경우</li>
                    </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500">
          <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400">2. DSR 계산 시 원금 균등 방식의 유불리</h3>
          <p className="mt-2">DSR(총부채원리금상환비율)은 연 소득에서 모든 대출의 연간 원리금이 차지하는 비율을 의미합니다. 2025년 현재 은행권은 40%를 적용하고 있습니다.</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li><strong>DSR 산정 방식:</strong> 원금 균등 상환은 초회차 상환액이 가장 높기 때문에, DSR 산정 시 이 <strong>첫해의 높은 상환액</strong>을 기준으로 계산합니다.</li>
            <li><strong>결론:</strong> 동일한 대출 조건이라면, 원리금 균등 방식에 비해 DSR이 더 높게 산정되어 <strong>대출 한도가 더 적게 나올 수 있습니다.</strong> 대출 가능 금액을 최대로 받고 싶다면 원리금 균등 방식이 유리할 수 있습니다.</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-indigo-500">
          <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">3. 중도상환을 계획하고 있다면?</h3>
          <p className="mt-2">원금 균등 상환은 원금 감소 속도가 빠르기 때문에, 중도상환 시 효율이 매우 좋습니다. 조금이라도 여유 자금이 생길 때마다 원금을 갚아나가면, 총이자 절감 효과를 극대화할 수 있습니다.</p>
          <p className="mt-3 text-sm">특히 대출 초기, 이자 비중이 높을 때 중도상환을 하는 것이 가장 효과적입니다. (단, 3년 이내 중도상환수수료는 반드시 확인해야 합니다.)</p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-teal-500">
          <h3 className="font-bold text-lg text-teal-600 dark:text-teal-400">4. 최종 선택을 위한 시뮬레이션의 중요성</h3>
          <p className="mt-2">가장 좋은 방법은 본인의 대출 예상액, 기간, 금리를 가지고 <strong>두 가지 상환 방식(원금 균등, 원리금 균등)을 모두 계산해보는 것</strong>입니다.</p>
          <p className="mt-3 text-sm">각 방식의 월 상환액 변화 추이와 총이자 차이를 직접 눈으로 확인하고, 자신의 미래 자금 계획과 비교하여 최종적으로 가장 적합한 방식을 선택하는 것이 후회 없는 결정의 핵심입니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="원금 균등 분할 상환 계산기"
      description="매월 동일한 원금을 상환하는 원금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다."
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}