"use client";

import React, { useState, useMemo, useCallback } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { toast } from 'sonner';
import { round } from 'mathjs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface RepaymentScheduleItem {
  회차: number;
  원금상환액: number;
  할부수수료: number;
  월납부액: number;
  누적상환액: number;
}

interface CalculationResults {
  monthlyPayment: number;
  totalPayment: number;
  totalFee: number;
  principal: number;
  principalToTotalFeeRatio: number;
  totalFeeToTotalPaymentRatio: number;
  schedule: RepaymentScheduleItem[];
  statusBadgeColor: string;
  statusText: string;
}

const CreditCardInstallmentFeeCalculator: NextPage = () => {
  const [paymentAmount, setPaymentAmount] = useState<number>(1000000);
  const [installmentMonths, setInstallmentMonths] = useState<number>(12);
  const [interestFreeMonths, setInterestFreeMonths] = useState<number>(0);
  const [annualFeeRate, setAnnualFeeRate] = useState<number>(15);
  const [calculationCompleted, setCalculationCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value.replace(/,/g, ''));
    if (!isNaN(value)) {
      setter(value);
    } else {
      setter(0);
    }
  };

  const calculationResults = useMemo<CalculationResults>(() => {
    if (paymentAmount <= 0 || installmentMonths <= 0 || annualFeeRate < 0) {
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalFee: 0,
        principal: 0,
        principalToTotalFeeRatio: 0,
        totalFeeToTotalPaymentRatio: 0,
        schedule: [],
        statusBadgeColor: 'bg-gray-500',
        statusText: '입력 오류',
      };
    }

    let totalFee = 0;
    let totalPayment = 0;
    const schedule: RepaymentScheduleItem[] = [];
    let remainingPrincipal = paymentAmount;

    for (let i = 1; i <= installmentMonths; i++) {
      let fee = 0;
      let principalRepayment = 0;
      let currentMonthlyPayment = 0;

      if (i <= interestFreeMonths) {
        // 무이자 기간
        principalRepayment = paymentAmount / installmentMonths;
        fee = 0;
        currentMonthlyPayment = principalRepayment;
      } else {
        // 유이자 기간
        const effectiveMonths = installmentMonths - interestFreeMonths;
        const monthlyRate = annualFeeRate / 100 / 12;

        if (effectiveMonths > 0 && monthlyRate > 0) {
          // 무이자 기간 이후 남은 원금에 대해 원리금 균등 상환 계산
          const principalAfterInterestFree = paymentAmount - (paymentAmount / installmentMonths) * interestFreeMonths;
          const monthlyPaymentForInterestPeriod = (principalAfterInterestFree * monthlyRate * Math.pow(1 + monthlyRate, effectiveMonths)) / (Math.pow(1 + monthlyRate, effectiveMonths) - 1);
          
          // 현재 회차의 이자 계산 (남은 원금 기준)
          fee = remainingPrincipal * monthlyRate;
          principalRepayment = monthlyPaymentForInterestPeriod - fee;
          currentMonthlyPayment = monthlyPaymentForInterestPeriod;

          // 마지막 회차 처리: 오차로 인해 남은 원금을 모두 상환하도록 조정
          if (i === installmentMonths) {
            principalRepayment = remainingPrincipal;
            currentMonthlyPayment = principalRepayment + fee;
          }

        } else if (effectiveMonths > 0 && monthlyRate === 0) {
          // 이자율이 0인 유이자 기간 (거의 발생하지 않지만 예외 처리)
          principalRepayment = remainingPrincipal / (installmentMonths - i + 1);
          fee = 0;
          currentMonthlyPayment = principalRepayment;
        } else {
          // 무이자 기간이 전체 할부 개월 수와 같거나 긴 경우
          principalRepayment = remainingPrincipal / (installmentMonths - i + 1);
          fee = 0;
          currentMonthlyPayment = principalRepayment;
        }
      }
      
      remainingPrincipal -= principalRepayment;
      totalFee += fee;
      totalPayment += currentMonthlyPayment;

      schedule.push({
        회차: i,
        원금상환액: round(principalRepayment),
        할부수수료: round(fee),
        월납부액: round(currentMonthlyPayment),
        누적상환액: round(totalPayment),
      });
    }

    const principalToTotalFeeRatio = totalFee > 0 ? (totalFee / paymentAmount) * 100 : 0;
    const totalFeeToTotalPaymentRatio = totalPayment > 0 ? (totalFee / totalPayment) * 100 : 0;

    let statusBadgeColor = 'bg-green-500';
    let statusText = '정상';
    if (totalFeeToTotalPaymentRatio > 10) {
      statusBadgeColor = 'bg-red-500';
      statusText = '수수료 높음';
    } else if (totalFeeToTotalPaymentRatio > 5) {
      statusBadgeColor = 'bg-yellow-500 text-black';
      statusText = '수수료 보통';
    }


    return {
      monthlyPayment: round(totalPayment / installmentMonths),
      totalPayment: round(totalPayment),
      totalFee: round(totalFee),
      principal: paymentAmount,
      principalToTotalFeeRatio: round(principalToTotalFeeRatio, 2),
      totalFeeToTotalPaymentRatio: round(totalFeeToTotalPaymentRatio, 2),
      schedule,
      statusBadgeColor,
      statusText,
    };
  }, [paymentAmount, installmentMonths, interestFreeMonths, annualFeeRate]);

  const handleCalculate = useCallback(() => {
    if (paymentAmount <= 0) {
      toast.error("결제 금액을 입력해주세요.");
      setCalculationCompleted(false);
      return;
    }
    if (installmentMonths <= 0) {
      toast.error("할부 개월 수를 입력해주세요.");
      setCalculationCompleted(false);
      return;
    }
    if (annualFeeRate < 0) {
      toast.error("할부 수수료율은 0 이상이어야 합니다.");
      setCalculationCompleted(false);
      return;
    }
    // calculationResults useMemo에 의해 자동 계산되므로 별도 로직 불필요
    toast.success("할부 수수료 계산이 완료되었습니다.");
    setCalculationCompleted(true);
  }, [paymentAmount, installmentMonths, annualFeeRate]);

  const pieData = useMemo(() => {
    if (!calculationCompleted || calculationResults.totalPayment === 0) return [];
    return [
      { name: '원금', value: calculationResults.principal, fill: '#8884d8' },
      { name: '총 할부 수수료', value: calculationResults.totalFee, fill: '#82ca9d' },
    ];
  }, [calculationCompleted, calculationResults]);

  const inputSection = (
    <div className="space-y-6">
      {/* 결제 금액 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="paymentAmount">결제 금액 (원)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-gray-400 hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>결제할 금액을 입력합니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="paymentAmount"
          type="text"
          value={formatNumber(paymentAmount)}
          onChange={handleInputChange(setPaymentAmount)}
          placeholder="예: 5,000,000"
          className="text-right"
        />
      </div>

      {/* 할부 개월 수 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="installmentMonths">할부 개월 수 (개월)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-gray-400 hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>할부 기간을 개월 단위로 입력합니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="installmentMonths"
          type="number"
          value={installmentMonths}
          onChange={handleInputChange(setInstallmentMonths)}
          placeholder="예: 12"
          className="text-right"
        />
        <p className="text-sm text-gray-500 mt-1">일반적으로 최대 36개월까지 가능합니다.</p>
      </div>

      {/* 무이자 할부 개월 수 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="interestFreeMonths">무이자 할부 개월 수 (개월)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-gray-400 hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>무이자 할부 기간을 개월 단위로 입력합니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="interestFreeMonths"
          type="number"
          value={interestFreeMonths}
          onChange={handleInputChange(setInterestFreeMonths)}
          placeholder="예: 0"
          className="text-right"
        />
        <p className="text-sm text-gray-500 mt-1">할부 개월 수보다 클 수 없습니다.</p>
      </div>

      {/* 할부 수수료율 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="annualFeeRate">할부 수수료율 (연 %)</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-gray-400 hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>연간 할부 수수료율을 퍼센트 단위로 입력합니다.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="annualFeeRate"
          type="number"
          value={annualFeeRate}
          onChange={handleInputChange(setAnnualFeeRate)}
          placeholder="예: 15"
          step="0.1"
          className="text-right"
        />
        <p className="text-sm text-gray-500 mt-1">일반적으로 카드사마다 다르며 0.5%~1.5% 내외입니다.</p>
      </div>

      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {calculationCompleted && calculationResults.totalPayment > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">계산 결과:</span>
            <Badge className={`${calculationResults.statusBadgeColor} text-base`}>{calculationResults.statusText}</Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>총 결제 금액:</span>
              <span>{formatNumber(calculationResults.principal)} 원</span>
            </div>
            <div className="flex justify-between">
              <span>총 할부 수수료:</span>
              <span>{formatNumber(calculationResults.totalFee)} 원</span>
            </div>
            <div className="flex justify-between">
              <span>총 상환 금액:</span>
              <span className="font-bold">{formatNumber(calculationResults.totalPayment)} 원</span>
            </div>
            <div className="flex justify-between">
              <span>월 평균 납부액:</span>
              <span>{formatNumber(calculationResults.monthlyPayment)} 원</span>
            </div>
            <div className="flex justify-between">
              <span>원금 대비 할부 수수료 비율:</span>
              <span>{calculationResults.principalToTotalFeeRatio}%</span>
            </div>
            <div className="flex justify-between">
              <span>총 상환 금액 대비 할부 수수료 비율:</span>
              <span>{calculationResults.totalFeeToTotalPaymentRatio}%</span>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="mb-4">
            <div className="flex flex-row items-center justify-between mb-4">
              <h3 className="text-base font-semibold">할부 구성</h3>
              {calculationCompleted && (
                <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="table">
                  <ToggleGroupItem value="table">테이블</ToggleGroupItem>
                  <ToggleGroupItem value="chart">차트</ToggleGroupItem>
                </ToggleGroup>
              )}
            </div>
            {calculationCompleted && calculationResults.totalPayment > 0 ? (
              viewMode === 'chart' ? (
                <div className="w-full h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <RechartsTooltip
                        formatter={(value: number) => `${formatNumber(value)} 원`}
                      />
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="max-h-[400px] overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="whitespace-nowrap w-[50px] text-xs">회차</TableHead>
                        <TableHead className="text-right whitespace-nowrap">원금</TableHead>
                        <TableHead className="text-right whitespace-nowrap">수수료</TableHead>
                        <TableHead className="text-right whitespace-nowrap">월 납부</TableHead>
                        <TableHead className="text-right whitespace-nowrap">누적 상환</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {calculationResults.schedule.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="whitespace-nowrap w-[50px] text-xs">{item.회차}</TableCell>
                          <TableCell className="text-right">{formatNumber(item.원금상환액)}</TableCell>
                          <TableCell className="text-right">{formatNumber(item.할부수수료)}</TableCell>
                          <TableCell className="text-right">{formatNumber(item.월납부액)}</TableCell>
                          <TableCell className="text-right">{formatNumber(item.누적상환액)}</TableCell>
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
        <h2 className="text-2xl font-bold text-foreground mb-4">신용카드 할부 수수료 계산기: 현명한 소비의 첫걸음</h2>
        <p className="text-lg text-muted-foreground mb-6">
          갖고 싶었던 최신형 노트북, 온 가족이 함께 떠나는 해외여행... 목돈이 들어가는 소비를 계획할 때, 신용카드 할부 결제는 참 매력적인 선택지입니다. 당장의 부담을 덜고 원하는 것을 먼저 얻을 수 있으니까요. 하지만 '할부'라는 편리함 뒤에는 '수수료'라는 비용이 숨어있다는 사실, 알고 계셨나요?
        </p>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          신용카드 할부 수수료는 카드사가 고객을 대신해 가맹점에 먼저 대금을 지불하고, 고객으로부터 그 돈을 여러 달에 걸쳐 나눠 받는 과정에서 발생하는 일종의 이자입니다. 이 수수료는 할부 개월 수, 수수료율, 그리고 개인의 신용도에 따라 달라지기 때문에, 무심코 할부를 이용했다가는 생각보다 많은 추가 비용을 지불하게 될 수도 있습니다. 이는 마치 작은 빚을 지는 것과 같아서, 계획 없이 사용하면 가계에 부담이 될 수 있습니다.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <strong>All-in-Calc의 신용카드 할부 수수료 계산기</strong>는 바로 이런 상황을 방지하기 위해 탄생했습니다. 복잡한 계산은 저희에게 맡기시고, 여러분은 현명한 소비 계획만 세우세요. 이 계산기를 통해 여러분은 다음 정보를 명확하고 직관적으로 파악할 수 있습니다:
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-gray-700 dark:text-gray-300">
          <li><strong className="font-semibold">정확한 월 납부액:</strong> 매월 상환해야 할 원금과 수수료가 얼마인지 정확히 알 수 있습니다.</li>
          <li><strong className="font-semibold">총 할부 수수료:</strong> 할부 기간이 끝날 때까지 총 얼마의 수수료를 내게 되는지 명확히 보여줍니다.</li>
          <li><strong className="font-semibold">총 상환 금액:</strong> 원금과 수수료를 합한 최종 상환 금액을 한눈에 확인할 수 있습니다.</li>
          <li><strong className="font-semibold">상세 상환 스케줄:</strong> 매 회차별 원금 상환액, 수수료, 잔여 원금을 표로 상세히 제공하여 현금 흐름을 예측하는 데 도움을 줍니다.</li>
        </ul>
        <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
          단순히 숫자를 나열하는 것을 넘어, 계산 결과를 바탕으로 여러분의 할부 계획이 합리적인지 판단해주는 '수수료 상태' 분석까지 제공합니다. 이제 막연한 추측이 아닌, 정확한 데이터에 기반하여 합리적인 소비 결정을 내리세요!
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">📈 할부 수수료, 어떻게 계산될까요?</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          신용카드 할부 수수료는 기본적으로 '아직 갚지 않은 돈(잔여 원금)'에 대해 부과되는 이자라고 생각하면 쉽습니다. 대부분의 카드사는 <strong>'잔여 원금 균등 방식'</strong>(원금 균등 상환 방식과 유사)으로 수수료를 계산합니다. 이는 매달 할부 원금의 일부를 갚아나가면서, 남은 원금에 대해서만 수수료를 계산하는 방식입니다. 따라서 시간이 지날수록 내야 할 수수료가 조금씩 줄어드는 구조입니다.
        </p>
        <div className="mt-6 space-y-4">
          <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-gray-800 rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-green-800 dark:text-green-300">월별 할부 수수료 계산</h4>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center text-sm">
              <strong>월 수수료 = 잔여 원금 × (연 수수료율 / 12)</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              예를 들어, 100만원을 12개월 할부(연 15%)로 결제했다면, 첫 달에는 100만원 전체에 대한 수수료가, 두 번째 달에는 원금 일부를 상환하고 남은 금액에 대한 수수료가 부과됩니다.
            </p>
          </div>
          <div className="p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-gray-800 rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-yellow-800 dark:text-yellow-300">총 할부 수수료 (근사치)</h4>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center text-sm">
              <strong>총 수수료 ≈ [결제 원금 × 연 수수료율 × (할부 개월 수 + 1) / 2] / 12</strong>
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              이 공식은 전체 기간 동안의 평균 잔액에 이자율을 적용하는 방식으로, 실제 총 수수료와 약간의 차이가 있을 수 있지만 전체적인 비용을 가늠하는 데 유용합니다. 저희 계산기는 이보다 더 정확한 월별 계산 방식을 사용합니다.
            </p>
          </div>
        </div>
        <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          본 계산기는 실제 카드사의 복잡한 내부 로직을 가장 근사하게 구현한 표준 방식을 사용하여 월별 상환액을 계산하며, 무이자 할부 기간까지 고려하여 더욱 정확한 결과를 제공합니다.
        </p>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mt-8 mb-4">💡 할부 수수료 절약을 위한 5가지 꿀팁</h3>
        <ul className="space-y-6">
          <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">1. 무이자 할부 혜택을 최대한 활용하세요.</h4>
            <p className="text-gray-600 dark:text-gray-400">가장 확실한 절약 방법입니다. 카드사나 가맹점에서 제공하는 무이자 할부 이벤트를 적극적으로 찾아보세요. 2~3개월 무이자 할부만 이용해도 상당한 수수료를 아낄 수 있습니다. 단, 무이자 할부 이용 시 카드 실적에서 제외되는 경우가 많으니 실적 조건도 함께 확인해야 합니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-green-600 dark:text-green-400">2. 할부 개월 수는 짧을수록 좋습니다.</h4>
            <p className="text-gray-600 dark:text-gray-400">할부 개월 수가 길어질수록 매월 부담은 줄어들지만, 총 수수료는 눈덩이처럼 불어납니다. 12개월 할부의 총 수수료는 6개월 할부의 2배 이상이 될 수 있습니다. 감당할 수 있는 범위 내에서 최대한 짧은 개월 수를 선택하는 것이 현명합니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-yellow-600 dark:text-yellow-400">3. '부분 무이자 할부'의 함정을 조심하세요.</h4>
            <p className="text-gray-600 dark:text-gray-400">"10개월 할부 시 1~3회차 무이자"와 같은 부분 무이자 할부는 언뜻 보면 유리해 보이지만, 나머지 4~10회차에는 정상 수수료가 부과됩니다. 전체 기간에 대한 총 수수료를 반드시 계산해보고 전체 무이자 할부와 비교해야 합니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-red-600 dark:text-red-400">4. 선결제를 적극적으로 활용하세요.</h4>
            <p className="text-gray-600 dark:text-gray-400">여유 자금이 생겼다면 할부 잔액의 일부 또는 전부를 미리 갚는 '선결제'를 이용하세요. 선결제 시점 이후의 수수료는 면제되므로 총 수수료를 크게 줄일 수 있습니다. 대부분의 카드사 앱이나 홈페이지에서 간편하게 신청할 수 있습니다.</p>
          </li>
          <li className="p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md transition-transform hover:scale-105">
            <h4 className="font-semibold text-lg mb-2 text-purple-600 dark:text-purple-400">5. 할부 결제 전, 정말 필요한 소비인지 다시 한번 생각하세요.</h4>
            <p className="text-gray-600 dark:text-gray-400">할부 수수료는 결국 '미래의 소득'을 앞당겨 쓰는 대가입니다. 할부 결제가 꼭 필요한 상황인지, 혹은 조금 기다렸다가 일시불로 구매할 수는 없는지 신중하게 고민하는 습관이 불필요한 지출을 막는 가장 근본적인 방법입니다.</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="신용카드 할부 수수료 계산기"
      description="신용카드 할부 구매 시 발생하는 수수료와 월별 상환액을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CreditCardInstallmentFeeCalculator;