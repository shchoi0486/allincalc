'use client'

import { useState, useMemo } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip as RechartsTooltip, PieLabelRenderProps } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

export default function DtiPage() {
  const [annualIncome, setAnnualIncome] = useState<number>(50000000);
  const [loanPrincipal, setLoanPrincipal] = useState<number>(200000000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [otherDebtInterest, setOtherDebtInterest] = useState<number>(0);
  const [dtiResult, setDtiResult] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");

  const calculationResults = useMemo(() => {
    const income = annualIncome;
    const principal = loanPrincipal;
    const term = loanTerm;
    const rate = interestRate / 100;
    const otherInterest = otherDebtInterest;

    if (income <= 0 || principal <= 0 || term <= 0 || rate <= 0) {
      return null;
    }

    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const annualPrincipalAndInterest = monthlyPayment * 12;
    const totalAnnualDebtRepayment = annualPrincipalAndInterest + otherInterest;
    const calculatedDti = (totalAnnualDebtRepayment / income) * 100;

    let dtiStatus = "";
    let dtiBadgeColor = "";
    if (calculatedDti <= 15) {
      dtiStatus = "매우 안정";
      dtiBadgeColor = "bg-green-500";
    } else if (calculatedDti <= 30) {
      dtiStatus = "안정";
      dtiBadgeColor = "bg-blue-500";
    } else if (calculatedDti <= 40) {
      dtiStatus = "주의";
      dtiBadgeColor = "bg-yellow-500 text-black";
    } else if (calculatedDti <= 50) {
      dtiStatus = "위험";
      dtiBadgeColor = "bg-orange-500";
    } else {
      dtiStatus = "고위험";
      dtiBadgeColor = "bg-red-500";
    }

    const maxAnnualRepayment = income * 0.4; // DTI 40% 기준
    const availableForLoanRepayment = maxAnnualRepayment - otherInterest;
    
    let estimatedAmount = 0;
    if (availableForLoanRepayment > 0) {
        const monthlyPaymentForEstimation = availableForLoanRepayment / 12;
        estimatedAmount = (monthlyPaymentForEstimation * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    const chartData = [
      { name: '총부채', value: totalAnnualDebtRepayment, fill: '#4f46e5' },
      { name: '가용 소득', value: income - totalAnnualDebtRepayment > 0 ? income - totalAnnualDebtRepayment : 0, fill: '#10b981' },
    ];

    return {
      dti: calculatedDti,
      dtiStatus,
      dtiBadgeColor,
      estimatedLoanAmount: estimatedAmount > 0 ? estimatedAmount : 0,
      annualIncome: income,
      totalAnnualDebtRepayment: Math.round(totalAnnualDebtRepayment),
      annualPrincipalAndInterest: Math.round(annualPrincipalAndInterest),
      otherInterest: Math.round(otherInterest),
      chartData,
    };
  }, [annualIncome, loanPrincipal, loanTerm, interestRate, otherDebtInterest]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setter(parseFloat(value.replace(/,/g, '')));
  };

  const calculateDti = () => {
    if (calculationResults) {
      setDtiResult(calculationResults.dti);
      toast.success("DTI 계산이 완료되었습니다.", {
        description: `당신의 DTI는 ${Math.round(calculationResults.dti)}% 입니다.`,
      });
    } else {
      setDtiResult(null);
      toast.error("정확한 값을 입력해주세요.", {
        description: "연소득, 대출 원금, 대출 기간, 금리는 0보다 커야 합니다.",
      });
    }
  };

const inputSection = (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="annual-income">연간 소득 (원)</Label>
            <Input id="annual-income" value={annualIncome.toLocaleString()} onChange={handleInputChange(setAnnualIncome)} placeholder="예: 50,000,000" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="loan-principal">주택담보대출 원금 (원)</Label>
            <Input id="loan-principal" value={loanPrincipal.toLocaleString()} onChange={handleInputChange(setLoanPrincipal)} placeholder="예: 200,000,000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="loan-term">대출 기간 (년)</Label>
            <Input id="loan-term" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} placeholder="예: 30" type="number" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="interest-rate">연간 이자율 (%)</Label>
            <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} placeholder="예: 5" type="number" step="0.1" />
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="other-debt-interest">기타부채 연간 이자 (원)</Label>
            <Input id="other-debt-interest" value={otherDebtInterest.toLocaleString()} onChange={handleInputChange(setOtherDebtInterest)} placeholder="예: 0" />
        </div>
    <Button onClick={calculateDti} className="w-full">계산하기</Button>
  </div>
);

  const resultSection = (
    <div className="space-y-4">
      {dtiResult && calculationResults ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">DTI 결과:</span>
            <Badge className={`${calculationResults.dtiBadgeColor} text-base`}>{Math.round(calculationResults.dti)}% ({calculationResults.dtiStatus})</Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>총부채 연간 원리금 상환액:</span>
              <span>{calculationResults.totalAnnualDebtRepayment.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between">
              <span>연간 소득:</span>
              <span>{calculationResults.annualIncome.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between">
              <span>주택담보대출 연간 원리금:</span>
              <span>{calculationResults.annualPrincipalAndInterest.toLocaleString()} 원</span>
            </div>
            <div className="flex justify-between">
              <span>기타부채 연간 이자:</span>
              <span>{calculationResults.otherInterest.toLocaleString()} 원</span>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="text-center mb-4">
            <p className="text-base font-semibold">DTI 40% 기준, 최대 대출 가능 금액</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-xl font-bold text-blue-600">{Math.round(calculationResults.estimatedLoanAmount).toLocaleString()} 원</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{calculationResults.estimatedLoanAmount.toLocaleString()} 원</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="mb-4">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-base font-semibold">소득 대비 부채 구성</h3>
              {dtiResult && (
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="chart">
                  <ToggleGroupItem value="table">테이블</ToggleGroupItem>
                  <ToggleGroupItem value="chart">차트</ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>
            {dtiResult && calculationResults ? (
              viewMode === 'chart' ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-background p-2 border rounded shadow-lg text-sm">
                                <p className="font-bold">{data.name}</p>
                                <p>{data.value.toLocaleString()} 원</p>
                                <p>{((data.value / calculationResults.annualIncome) * 100).toFixed(2)}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Pie
                        data={calculationResults.chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }: PieLabelRenderProps) => `${name}: ${((percent as number) * 100).toFixed(1)}%`}
                        labelLine={false}
                      >
                        {calculationResults.chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>항목</TableHead>
                        <TableHead>금액 (원)</TableHead>
                        <TableHead>비율 (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculationResults.chartData.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{Math.round(item.value).toLocaleString()} 원</TableCell>
                          <TableCell>{((item.value / calculationResults.annualIncome) * 100).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <p className="text-lg">차트/테이블을 보려면 먼저 계산을 실행하세요.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
      calculatorDescription: (
        <>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">DTI 계산기: 내 집 마련의 첫 관문, 현명하게 통과하기</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            내 집 마련의 꿈을 안고 금융기관의 문을 두드릴 때, 가장 먼저 마주하게 되는 숫자가 바로 <strong>DTI(총부채상환비율, Debt to Income)</strong>입니다. DTI는 당신의 연간 소득 대비 연간 부채 상환액이 얼마나 되는지를 나타내는 비율로, 금융기관이 "이 사람에게 돈을 빌려주었을 때, 안정적으로 갚아나갈 능력이 있는가?"를 판단하는 핵심적인 재무 건전성 지표입니다.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            주택 가격과 함께 대출의 규모를 결정하는 LTV(주택담보대출비율)와 더불어, DTI는 대출 한도를 결정하는 양대 산맥과도 같습니다. DTI 비율이 낮을수록 당신의 상환 능력은 높게 평가되며, 이는 더 많은 대출 한도와 유리한 금리 조건으로 이어질 수 있습니다. 반대로 DTI가 높다면, 대출이 거절되거나 원하는 만큼의 한도를 확보하지 못할 수도 있습니다.
          </p>
          <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            하지만 DTI 계산은 생각보다 복잡합니다. 주택담보대출의 원리금뿐만 아니라, 기존에 가지고 있던 신용대출, 자동차 할부, 학자금 대출 등 다른 부채의 '이자'까지 고려해야 하기 때문입니다. 많은 분들이 자신의 DTI를 어림짐작만 하다가, 실제 대출 심사 과정에서 예상치 못한 결과에 당황하곤 합니다.
          </p>
          <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
            <strong>All-in-Calc의 DTI 계산기</strong>는 이러한 복잡함을 해결하고, 당신의 재정 상태를 명확하게 진단해주는 든든한 조력자입니다. 간단한 정보 입력만으로 당신의 현재 DTI를 정확히 계산하고, 정부의 최신 규제(2025년 기준)에 맞춰 대출 가능한 금액을 예측해볼 수 있습니다. 이제 막연한 불안감 대신, 정확한 데이터에 기반하여 성공적인 내 집 마련 계획을 세워보세요.
          </p>
        </>
      ),
      calculationFormula: (
        <>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">🔍 DTI, 정확히 어떻게 계산될까요?</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
            DTI는 당신의 연간 총소득에서 1년 동안 갚아야 할 대출 원리금과 이자가 차지하는 비율을 의미합니다. 공식 자체는 간단해 보이지만, 어떤 부채가 포함되는지에 따라 결과는 크게 달라집니다.
          </p>
          <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-center shadow-inner">
            <p className="font-mono text-lg tracking-tight">
              <strong>DTI (%) = ( (신규 주택담보대출 연간 원리금) + (기타 부채의 연간 이자) ) / 연간 소득 × 100</strong>
            </p>
          </div>
          <ul className="list-none space-y-4 mt-6">
            <li className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-gray-800 rounded-r-lg">
              <strong className="font-semibold text-green-800 dark:text-green-300">신규 주택담보대출 연간 원리금:</strong> 새로 받으려는 주택담보대출에 대해 1년 동안 상환해야 할 원금과 이자의 합계입니다. 대출 기간이 짧을수록 이 금액은 커집니다.
            </li>
            <li className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-gray-800 rounded-r-lg">
              <strong className="font-semibold text-yellow-800 dark:text-yellow-300">기타 부채의 연간 이자:</strong> 신용대출, 마이너스 통장, 자동차 할부, 학자금 대출 등 기존에 보유한 모든 부채의 1년 치 '이자' 비용입니다. DTI는 DSR과 달리 원금은 제외하고 이자만 계산에 포함하는 것이 특징입니다.
            </li>
            <li className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800 rounded-r-lg">
              <strong className="font-semibold text-blue-800 dark:text-blue-300">연간 소득:</strong> 세금을 공제하기 전의 소득(세전 소득)을 기준으로 하며, 원천징수영수증, 소득금액증명원 등 공인된 서류로 증빙된 금액만 인정됩니다.
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">🤔 DTI vs DSR, 무엇이 다를까요? (2025년 기준 핵심)</h3>
          <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            최근 대출 시장에서는 DTI보다 더 강력한 규제인 <strong>DSR(총부채원리금상환비율, Debt Service Ratio)</strong>이 핵심적인 기준으로 자리 잡았습니다. DTI가 '주택담보대출' 중심의 규제라면, DSR은 신용대출, 카드론 등 모든 가계부채를 포괄하는 더 촘촘하고 강력한 '그물'입니다. 2025년 현재, 대부분의 금융기관은 DSR을 우선적으로 적용하여 대출 한도를 심사합니다.
          </p>
          <div className="overflow-x-auto">
            <Table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <TableHeader className="bg-gray-50 dark:bg-gray-800">
                <TableRow>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DTI (총부채상환비율)</TableHead>
                  <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DSR (총부채원리금상환비율)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">개념</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">연소득 대비 <strong>주담대 원리금 + 기타대출 이자</strong></TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">연소득 대비 <strong>모든 대출의 원리금</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">부채 포함 범위</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">신규 주담대(원리금) + 기존 부채(<strong>이자만</strong>)</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">모든 금융권 대출(<strong>원리금 모두</strong>)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="px-6 py-4 whitespace-nowrap font-semibold">규제 강도</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap">상대적으로 완화</TableCell>
                  <TableCell className="px-6 py-4 whitespace-nowrap"><strong>훨씬 강력함</strong> (대출 한도 더 적게 나옴)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
          <p className="mt-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-gray-800 p-3 rounded-md">
            <strong>중요:</strong> DTI 기준을 충족하더라도, DSR 기준(통상 1금융권 40%, 2금융권 50%)을 넘으면 대출이 거절될 수 있습니다. 따라서 DTI와 함께 DSR도 반드시 함께 고려해야 합니다.
          </p>
        </>
      ),
      usefulTips: (
        <>
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">💡 DTI 낮추고 대출 한도 늘리는 5가지 현실적인 전략</h3>
          <ul className="space-y-6">
            <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
              <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">1. 부채 다이어트: 이자 높은 빚부터 정리하기</h4>
              <p className="text-gray-600 dark:text-gray-400">가장 기본적이면서도 효과적인 방법입니다. 금리가 높은 신용대출, 카드론, 현금서비스부터 상환하여 '기타 부채 이자' 총액을 줄이세요. 사용하지 않는 마이너스 통장도 한도를 줄이거나 해지하는 것이 좋습니다. 이자 부담이 줄면 DTI 비율이 직접적으로 낮아집니다.</p>
            </li>
            <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
              <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">2. 소득 증명: 인정 소득 최대한 끌어모으기</h4>
              <p className="text-gray-600 dark:text-gray-400">금융기관은 서류로 증빙되는 '공식 소득'만 인정합니다. 근로소득 원천징수영수증 외에도, 사업소득금액증명원, 국민연금/건강보험료 납부 내역, 신용카드 사용액 등을 통해 소득을 추가로 인정받을 수 있습니다. 배우자가 소득이 있다면 '부부합산 소득'으로 신고하여 분모를 키우는 것도 좋은 전략입니다.</p>
            </li>
            <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
              <h4 className="font-semibold text-lg mb-2 text-yellow-600 dark:text-yellow-400">3. 대출 기간: 길게 설정하여 연간 상환 부담 줄이기</h4>
              <p className="text-gray-600 dark:text-gray-400">동일한 금액을 빌리더라도 대출 기간을 30년에서 40년, 50년(초장기 모기지)으로 늘리면 매년 갚아야 할 원리금 상환액이 줄어듭니다. 이는 DTI 비율을 낮추는 데 매우 효과적입니다. 단, 총 내야 하는 이자 부담은 늘어나므로, 중도 상환 계획 등을 고려하여 신중하게 결정해야 합니다.</p>
            </li>
            <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
              <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">4. 스트레스 DTI/DSR 제도 이해하고 대비하기</h4>
              <p className="text-gray-600 dark:text-gray-400">2024년부터 단계적으로 시행된 '스트레스 DSR' 제도는 미래 금리 인상 가능성까지 반영하여 대출 한도를 산정합니다. 변동금리 대출 시 현재 금리에 '가산금리'가 더해져 DTI/DSR이 계산되므로, 예상보다 대출 한도가 줄어들 수 있습니다. 고정금리 대출을 선택하거나, 스트레스 금리가 적용되더라도 DTI/DSR이 규제 한도 이내에 들어오도록 자금 계획을 보수적으로 세우는 것이 중요합니다.</p>
            </li>
            <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
              <h4 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-400">5. 정부 정책 모니터링 및 규제 지역 확인은 필수</h4>
              <p className="text-gray-600 dark:text-gray-400">DTI와 DSR 규제는 정부의 부동산 정책 방향과 지역(투기과열지구, 조정대상지역 등)에 따라 수시로 변동됩니다. 특히 생애최초 주택구매자, 신혼부부 등을 위한 완화된 DTI/LTV 기준이 적용되는 경우가 많습니다. 대출 신청 시점의 최신 금융 정책과 내가 주택을 구매하려는 지역의 규제 수준을 반드시 확인하여 예상치 못한 변수를 줄여야 합니다.</p>
            </li>
          </ul>
        </>
      ),
    };

  return (
    <CalculatorsLayout
      title="DTI 계산기 (총부채상환비율)"
      description="연간 소득과 부채 정보를 바탕으로 DTI를 계산하고 대출 가능성을 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}