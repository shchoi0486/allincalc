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
import TermGlossary from '@/components/calculators/TermGlossary';
import { formatNumber } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useI18n } from '@/i18n/I18nProvider';

interface RepaymentScheduleItem {
  period: number;
  principalPayment: number;
  fee: number;
  monthlyPayment: number;
  cumulative: number;
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
  statusKey: 'error' | 'normal' | 'high' | 'medium';
}

const CreditCardInstallmentFeeCalculator: NextPage = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [paymentAmount, setPaymentAmount] = useState<number>(1000000);
  const [installmentMonths, setInstallmentMonths] = useState<number>(12);
  const [interestFreeMonths, setInterestFreeMonths] = useState<number>(0);
  const [annualFeeRate, setAnnualFeeRate] = useState<number>(15);
  const [calculationCompleted, setCalculationCompleted] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');

  const statusLabels: Record<'ko' | 'en', Record<CalculationResults['statusKey'], string>> = {
    ko: { error: '입력 오류', normal: '정상', high: '수수료 높음', medium: '수수료 보통' },
    en: { error: 'Input error', normal: 'Normal', high: 'High fee', medium: 'Moderate fee' },
  };

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
        statusKey: 'error',
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
        period: i,
        principalPayment: round(principalRepayment),
        fee: round(fee),
        monthlyPayment: round(currentMonthlyPayment),
        cumulative: round(totalPayment),
      });
    }

    const principalToTotalFeeRatio = totalFee > 0 ? (totalFee / paymentAmount) * 100 : 0;
    const totalFeeToTotalPaymentRatio = totalPayment > 0 ? (totalFee / totalPayment) * 100 : 0;

    let statusBadgeColor = 'bg-green-500';
    let statusKey: CalculationResults['statusKey'] = 'normal';
    if (totalFeeToTotalPaymentRatio > 10) {
      statusBadgeColor = 'bg-red-500';
      statusKey = 'high';
    } else if (totalFeeToTotalPaymentRatio > 5) {
      statusBadgeColor = 'bg-yellow-500 text-black';
      statusKey = 'medium';
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
      statusKey,
    };
  }, [paymentAmount, installmentMonths, interestFreeMonths, annualFeeRate]);

  const handleCalculate = useCallback(() => {
    if (paymentAmount <= 0) {
      toast.error(isKo ? "결제 금액을 입력해주세요." : "Please enter the payment amount.");
      setCalculationCompleted(false);
      return;
    }
    if (installmentMonths <= 0) {
      toast.error(isKo ? "할부 개월 수를 입력해주세요." : "Please enter the number of installment months.");
      setCalculationCompleted(false);
      return;
    }
    if (annualFeeRate < 0) {
      toast.error(isKo ? "할부 수수료율은 0 이상이어야 합니다." : "The installment fee rate must be 0 or greater.");
      setCalculationCompleted(false);
      return;
    }
    // calculationResults useMemo에 의해 자동 계산되므로 별도 로직 불필요
    toast.success(isKo ? "할부 수수료 계산이 완료되었습니다." : "Installment fee calculation completed.");
    setCalculationCompleted(true);
  }, [paymentAmount, installmentMonths, annualFeeRate, isKo]);

  const pieData = useMemo(() => {
    if (!calculationCompleted || calculationResults.totalPayment === 0) return [];
    return [
      { name: isKo ? '원금' : 'Principal', value: calculationResults.principal, fill: '#8884d8' },
      { name: isKo ? '총 할부 수수료' : 'Total installment fee', value: calculationResults.totalFee, fill: '#82ca9d' },
    ];
  }, [calculationCompleted, calculationResults, isKo]);

  const inputSection = (
    <div className="space-y-6">
      {/* 결제 금액 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="paymentAmount">{isKo ? '결제 금액 (원)' : 'Payment amount (KRW)'}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isKo ? '결제할 금액을 입력합니다.' : 'Enter the amount to be charged.'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="paymentAmount"
          type="text"
          value={formatNumber(paymentAmount)}
          onChange={handleInputChange(setPaymentAmount)}
          placeholder={isKo ? "예: 5,000,000" : "e.g. 5,000,000"}
          className="text-right"
        />
      </div>

      {/* 할부 개월 수 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="installmentMonths">{isKo ? '할부 개월 수 (개월)' : 'Installment period (months)'}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isKo ? '할부 기간을 개월 단위로 입력합니다.' : 'Enter the installment period in months.'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="installmentMonths"
          type="number"
          value={installmentMonths}
          onChange={handleInputChange(setInstallmentMonths)}
          placeholder={isKo ? "예: 12" : "e.g. 12"}
          className="text-right"
        />
        <p className="text-sm text-muted-foreground mt-1">{isKo ? '일반적으로 최대 36개월까지 가능합니다.' : 'Typically available up to 36 months.'}</p>
      </div>

      {/* 무이자 할부 개월 수 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="interestFreeMonths">{isKo ? '무이자 할부 개월 수 (개월)' : 'Interest-free installment months'}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isKo ? '무이자 할부 기간을 개월 단위로 입력합니다.' : 'Enter the interest-free installment period in months.'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="interestFreeMonths"
          type="number"
          value={interestFreeMonths}
          onChange={handleInputChange(setInterestFreeMonths)}
          placeholder={isKo ? "예: 0" : "e.g. 0"}
          className="text-right"
        />
        <p className="text-sm text-muted-foreground mt-1">{isKo ? '할부 개월 수보다 클 수 없습니다.' : 'Cannot exceed the installment period.'}</p>
      </div>

      {/* 할부 수수료율 */}
      <div className="space-y-2">
        <div className="flex items-center gap-1">
          <Label htmlFor="annualFeeRate">{isKo ? '할부 수수료율 (연 %)' : 'Installment fee rate (annual %)'}</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="text-muted-foreground hover:text-gray-600 cursor-help">
                <span className="text-xs">?</span>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isKo ? '연간 할부 수수료율을 퍼센트 단위로 입력합니다.' : 'Enter the annual installment fee rate as a percentage.'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="annualFeeRate"
          type="number"
          value={annualFeeRate}
          onChange={handleInputChange(setAnnualFeeRate)}
          placeholder={isKo ? "예: 15" : "e.g. 15"}
          step="0.1"
          className="text-right"
        />
        <p className="text-sm text-muted-foreground mt-1">{isKo ? '일반적으로 카드사마다 다르며 0.5%~1.5% 내외입니다.' : 'Varies by card issuer, typically around 0.5%–1.5%.'}</p>
      </div>

      <Button onClick={handleCalculate} className="w-full">
        {isKo ? '계산하기' : 'Calculate'}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {calculationCompleted && calculationResults.totalPayment > 0 ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">{isKo ? '계산 결과:' : 'Calculation result:'}</span>
            <Badge className={`${calculationResults.statusBadgeColor} text-base`}>{statusLabels[isKo ? 'ko' : 'en'][calculationResults.statusKey]}</Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>{isKo ? '총 결제 금액:' : 'Total payment amount:'}</span>
              <span>{formatNumber(calculationResults.principal)} {isKo ? '원' : 'KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isKo ? '총 할부 수수료:' : 'Total installment fee:'}</span>
              <span>{formatNumber(calculationResults.totalFee)} {isKo ? '원' : 'KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isKo ? '총 상환 금액:' : 'Total repayment:'}</span>
              <span className="font-bold">{formatNumber(calculationResults.totalPayment)} {isKo ? '원' : 'KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isKo ? '월 평균 납부액:' : 'Average monthly payment:'}</span>
              <span>{formatNumber(calculationResults.monthlyPayment)} {isKo ? '원' : 'KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{isKo ? '원금 대비 할부 수수료 비율:' : 'Installment fee to principal ratio:'}</span>
              <span>{calculationResults.principalToTotalFeeRatio}%</span>
            </div>
            <div className="flex justify-between">
              <span>{isKo ? '총 상환 금액 대비 할부 수수료 비율:' : 'Installment fee to total repayment ratio:'}</span>
              <span>{calculationResults.totalFeeToTotalPaymentRatio}%</span>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">{isKo ? '계산하기 버튼을 클릭하여 결과를 확인하세요.' : 'Click Calculate to see the result.'}</p>
        </div>
      )}
    </div>
  );

  const fullWidthSection = calculationCompleted && calculationResults.totalPayment > 0 ? (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{isKo ? '할부 구성' : 'Installment breakdown'}</h3>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="table">
          <ToggleGroupItem value="table">{isKo ? '테이블' : 'Table'}</ToggleGroupItem>
          <ToggleGroupItem value="chart">{isKo ? '차트' : 'Chart'}</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {viewMode === 'chart' ? (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <RechartsTooltip
                formatter={(value: number) => `${formatNumber(value)} ${isKo ? '원' : 'KRW'}`}
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
                <TableHead className="whitespace-nowrap w-[50px] text-xs">{isKo ? '회차' : 'Period'}</TableHead>
                <TableHead className="text-right whitespace-nowrap">{isKo ? '원금' : 'Principal'}</TableHead>
                <TableHead className="text-right whitespace-nowrap">{isKo ? '수수료' : 'Fee'}</TableHead>
                <TableHead className="text-right whitespace-nowrap">{isKo ? '월 납부' : 'Monthly'}</TableHead>
                <TableHead className="text-right whitespace-nowrap">{isKo ? '누적 상환' : 'Cumulative'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.schedule.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="whitespace-nowrap w-[50px] text-xs">{item.period}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.principalPayment)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.fee)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.monthlyPayment)}</TableCell>
                  <TableCell className="text-right">{formatNumber(item.cumulative)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <>
        <h2 className="text-2xl font-bold text-foreground mb-4">{isKo ? '신용카드 할부 수수료 계산기: 현명한 소비의 첫걸음' : 'Credit Card Installment Fee Calculator: The First Step to Smart Spending'}</h2>
        <p className="text-lg text-muted-foreground mb-6">
          {isKo
            ? '갖고 싶었던 최신형 노트북, 온 가족이 함께 떠나는 해외여행... 목돈이 들어가는 소비를 계획할 때, 신용카드 할부 결제는 참 매력적인 선택지입니다. 당장의 부담을 덜고 원하는 것을 먼저 얻을 수 있으니까요. 하지만 \'할부\'라는 편리함 뒤에는 \'수수료\'라는 비용이 숨어있다는 사실, 알고 계셨나요?'
            : 'The latest laptop you have been wanting, an overseas trip with the whole family... When planning a large purchase, credit card installment payments are a tempting option. You get what you want first while easing the immediate burden. But did you know that behind the convenience of "installments" hides a cost called a "fee"?'}
        </p>
        <p className="text-foreground leading-relaxed">
          {isKo
            ? '신용카드 할부 수수료는 카드사가 고객을 대신해 가맹점에 먼저 대금을 지불하고, 고객으로부터 그 돈을 여러 달에 걸쳐 나눠 받는 과정에서 발생하는 일종의 이자입니다. 이 수수료는 할부 개월 수, 수수료율, 그리고 개인의 신용도에 따라 달라지기 때문에, 무심코 할부를 이용했다가는 생각보다 많은 추가 비용을 지불하게 될 수도 있습니다. 이는 마치 작은 빚을 지는 것과 같아서, 계획 없이 사용하면 가계에 부담이 될 수 있습니다.'
            : 'A credit card installment fee is a kind of interest that arises when the card company pays the merchant on your behalf and then collects that money from you over several months. The fee varies depending on the number of installment months, the fee rate, and your credit profile, so using installments carelessly can mean paying more in extra costs than you expect. It is much like taking on a small debt, and without a plan it can become a burden on your household.'}
        </p>
        <p className="mt-4 text-foreground leading-relaxed">
          {isKo
            ? 'All-in-Calc의 신용카드 할부 수수료 계산기는 바로 이런 상황을 방지하기 위해 탄생했습니다. 복잡한 계산은 저희에게 맡기시고, 여러분은 현명한 소비 계획만 세우세요. 이 계산기를 통해 여러분은 다음 정보를 명확하고 직관적으로 파악할 수 있습니다:'
            : "All-in-Calc's credit card installment fee calculator was created to prevent exactly this kind of situation. Leave the complicated math to us, and you just plan your smart spending. With this calculator you can clearly and intuitively understand the following:"}
        </p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-foreground">
          <li><strong className="font-semibold">{isKo ? '정확한 월 납부액:' : 'Exact monthly payment:'}</strong> {isKo ? '매월 상환해야 할 원금과 수수료가 얼마인지 정확히 알 수 있습니다.' : 'Know exactly how much principal and fee you must repay each month.'}</li>
          <li><strong className="font-semibold">{isKo ? '총 할부 수수료:' : 'Total installment fee:'}</strong> {isKo ? '할부 기간이 끝날 때까지 총 얼마의 수수료를 내게 되는지 명확히 보여줍니다.' : 'Shows clearly how much total fee you will pay by the end of the installment period.'}</li>
          <li><strong className="font-semibold">{isKo ? '총 상환 금액:' : 'Total repayment:'}</strong> {isKo ? '원금과 수수료를 합한 최종 상환 금액을 한눈에 확인할 수 있습니다.' : 'See the final repayment amount combining principal and fee at a glance.'}</li>
          <li><strong className="font-semibold">{isKo ? '상세 상환 스케줄:' : 'Detailed schedule:'}</strong> {isKo ? '매 회차별 원금 상환액, 수수료, 잔여 원금을 표로 상세히 제공하여 현금 흐름을 예측하는 데 도움을 줍니다.' : 'Provides a detailed table of principal repaid, fee, and remaining balance per period to help you forecast cash flow.'}</li>
        </ul>
        <p className="mt-6 text-foreground leading-relaxed bg-muted p-4 rounded-lg border-l-4 border-primary">
          {isKo
            ? '단순히 숫자를 나열하는 것을 넘어, 계산 결과를 바탕으로 여러분의 할부 계획이 합리적인지 판단해주는 \'수수료 상태\' 분석까지 제공합니다. 이제 막연한 추측이 아닌, 정확한 데이터에 기반하여 합리적인 소비 결정을 내리세요!'
            : "Beyond simply listing numbers, it also provides a 'fee status' analysis that judges whether your installment plan is reasonable based on the result. Now make rational spending decisions based on accurate data, not vague guesses!"}
        </p>        <TermGlossary items={[
          { term: isKo ? '할부수수료' : 'Installment fee', desc: isKo ? '카드사가 고객 대신 가맹점에 대금을 먼저 지급하고 여러 달에 걸쳐 나눠 받을 때 발생하는 일종의 이자(금융 서비스 이용료)입니다.' : 'A kind of interest (financial service charge) that occurs when the card company pays the merchant on the customer’s behalf and collects it over several months.' },
          { term: isKo ? '잔여 원금 균등 방식' : 'Remaining-balance equal method', desc: isKo ? '매달 갚은 원금을 제외한 남은 원금에 대해서만 수수료를 계산하는 방식으로, 시간이 지날수록 수수료가 점차 줄어듭니다.' : 'A method where the fee is calculated only on the remaining balance after deducting the principal repaid each month, so the fee gradually decreases over time.' },
          { term: isKo ? '무이자 할부' : 'Interest-free installment', desc: isKo ? '할부 기간 동안 수수료(이자)를 부과하지 않는 할부로, 카드사나 가맹점의 프로모션을 통해 제공됩니다.' : 'Installments with no fee (interest) during the period, offered through promotions by card companies or merchants.' },
        ]} />

      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">{isKo ? '📈 할부 수수료, 어떻게 계산될까요?' : '📈 How is the installment fee calculated?'}</h3>
        <p className="text-foreground leading-relaxed">
          {isKo
            ? '신용카드 할부 수수료는 기본적으로 \'아직 갚지 않은 돈(잔여 원금)\'에 대해 부과되는 이자라고 생각하면 쉽습니다. 대부분의 카드사는 \'잔여 원금 균등 방식\'(원금 균등 상환 방식과 유사)으로 수수료를 계산합니다. 이는 매달 할부 원금의 일부를 갚아나가면서, 남은 원금에 대해서만 수수료를 계산하는 방식입니다. 따라서 시간이 지날수록 내야 할 수수료가 조금씩 줄어드는 구조입니다.'
            : "Think of a credit card installment fee as interest charged on the money you haven't repaid yet (the remaining principal). Most card companies calculate the fee using the 'remaining-balance equal method' (similar to the equal-principal repayment method). Each month you repay part of the installment principal, and the fee is charged only on the remaining balance, so the fee you pay gradually shrinks over time."}
        </p>
        <div className="mt-6 space-y-4">
          <div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '월별 할부 수수료 계산' : 'Monthly installment fee'}</h4>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center text-sm">
              <strong>{isKo ? '월 수수료 = 잔여 원금 × (연 수수료율 / 12)' : 'Monthly fee = Remaining principal × (Annual fee rate / 12)'}</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              {isKo
                ? '예를 들어, 100만원을 12개월 할부(연 15%)로 결제했다면, 첫 달에는 100만원 전체에 대한 수수료가, 두 번째 달에는 원금 일부를 상환하고 남은 금액에 대한 수수료가 부과됩니다.'
                : 'For example, if you pay 1,000,000 KRW in 12 installments (15% annual), the first month is charged a fee on the full 1,000,000 KRW, and the second month on the amount remaining after repaying part of the principal.'}
            </p>
          </div>
          <div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '총 할부 수수료 (근사치)' : 'Total installment fee (approximate)'}</h4>
            <p className="font-mono p-3 bg-muted rounded-md my-2 text-center text-sm">
              <strong>{isKo ? '총 수수료 ≈ [결제 원금 × 연 수수료율 × (할부 개월 수 + 1) / 2] / 12' : 'Total fee ≈ [Principal × Annual fee rate × (Installment months + 1) / 2] / 12'}</strong>
            </p>
            <p className="text-muted-foreground text-sm">
              {isKo
                ? '이 공식은 전체 기간 동안의 평균 잔액에 이자율을 적용하는 방식으로, 실제 총 수수료와 약간의 차이가 있을 수 있지만 전체적인 비용을 가늠하는 데 유용합니다. 저희 계산기는 이보다 더 정확한 월별 계산 방식을 사용합니다.'
                : 'This formula applies the rate to the average balance over the whole period. It may differ slightly from the actual total fee, but is useful for estimating overall cost. Our calculator uses a more accurate month-by-month method.'}
            </p>
          </div>
        </div>
        <p className="mt-6 text-foreground leading-relaxed">
          {isKo
            ? '본 계산기는 실제 카드사의 복잡한 내부 로직을 가장 근사하게 구현한 표준 방식을 사용하여 월별 상환액을 계산하며, 무이자 할부 기간까지 고려하여 더욱 정확한 결과를 제공합니다.'
            : 'This calculator uses the standard method that best approximates the complex internal logic of real card companies to compute monthly repayments, and provides even more accurate results by considering the interest-free period.'}
        </p>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-xl font-bold text-foreground mt-8 mb-4">{isKo ? '💡 할부 수수료 절약을 위한 5가지 꿀팁' : '💡 5 Tips to Save on Installment Fees'}</h3>
        <ul className="space-y-6">
          <li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '1. 무이자 할부 혜택을 최대한 활용하세요.' : '1. Make the most of interest-free installments.'}</h4>
            <p className="text-muted-foreground">{isKo ? '가장 확실한 절약 방법입니다. 카드사나 가맹점에서 제공하는 무이자 할부 이벤트를 적극적으로 찾아보세요. 2~3개월 무이자 할부만 이용해도 상당한 수수료를 아낄 수 있습니다. 단, 무이자 할부 이용 시 카드 실적에서 제외되는 경우가 많으니 실적 조건도 함께 확인해야 합니다.' : 'This is the most reliable way to save. Actively look for interest-free installment events from card companies or merchants. Even 2–3 months of interest-free installments can save a substantial fee. Note, however, that interest-free installments are often excluded from spending requirements, so check those conditions too.'}</p>
          </li>
          <li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '2. 할부 개월 수는 짧을수록 좋습니다.' : '2. Keep the installment period as short as possible.'}</h4>
            <p className="text-muted-foreground">{isKo ? '할부 개월 수가 길어질수록 매월 부담은 줄어들지만, 총 수수료는 눈덩이처럼 불어납니다. 12개월 할부의 총 수수료는 6개월 할부의 2배 이상이 될 수 있습니다. 감당할 수 있는 범위 내에서 최대한 짧은 개월 수를 선택하는 것이 현명합니다.' : 'A longer installment period reduces your monthly burden, but the total fee snowballs. The total fee for 12 months can be more than double that of 6 months. It is wise to choose the shortest period you can afford.'}</p>
          </li>
          <li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '3. \'부분 무이자 할부\'의 함정을 조심하세요.' : '3. Beware the trap of "partial interest-free installments."'}</h4>
            <p className="text-muted-foreground">{isKo ? '"10개월 할부 시 1~3회차 무이자"와 같은 부분 무이자 할부는 언뜻 보면 유리해 보이지만, 나머지 4~10회차에는 정상 수수료가 부과됩니다. 전체 기간에 대한 총 수수료를 반드시 계산해보고 전체 무이자 할부와 비교해야 합니다.' : 'Partial interest-free installments such as "1st–3rd months free on a 10-month plan" may look advantageous, but normal fees apply to the remaining months. Always calculate the total fee for the whole period and compare it with a fully interest-free plan.'}</p>
          </li>
          <li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '4. 선결제를 적극적으로 활용하세요.' : '4. Use early repayment proactively.'}</h4>
            <p className="text-muted-foreground">{isKo ? '여유 자금이 생겼다면 할부 잔액의 일부 또는 전부를 미리 갚는 \'선결제\'를 이용하세요. 선결제 시점 이후의 수수료는 면제되므로 총 수수료를 크게 줄일 수 있습니다. 대부분의 카드사 앱이나 홈페이지에서 간편하게 신청할 수 있습니다.' : 'If you have spare funds, use "early repayment" to pay off part or all of the remaining balance in advance. Fees after the early repayment point are waived, significantly reducing the total fee. Most card company apps or websites let you apply easily.'}</p>
          </li>
          <li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '5. 할부 결제 전, 정말 필요한 소비인지 다시 한번 생각하세요.' : '5. Before choosing installments, ask if it is truly necessary.'}</h4>
            <p className="text-muted-foreground">{isKo ? '할부 수수료는 결국 \'미래의 소득\'을 앞당겨 쓰는 대가입니다. 할부 결제가 꼭 필요한 상황인지, 혹은 조금 기다렸다가 일시불로 구매할 수는 없는지 신중하게 고민하는 습관이 불필요한 지출을 막는 가장 근본적인 방법입니다.' : 'An installment fee is ultimately the price of spending future income early. The most fundamental way to avoid unnecessary spending is the habit of carefully considering whether installments are truly needed, or whether you could wait and pay in full.'}</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? "신용카드 할부 수수료 계산기" : "Credit Card Installment Fee Calculator"}
      description={isKo ? "신용카드 할부 구매 시 발생하는 수수료와 월별 상환액을 계산합니다." : "Calculate the fee and monthly repayment for credit card installment purchases."}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? "비용 분포" : "Cost distribution"}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CreditCardInstallmentFeeCalculator;
