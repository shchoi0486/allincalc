'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';


import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { formatNumber } from '@/utils/formatNumber';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ResultData {
  repaymentSchedule: RepaymentDetail[];
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  firstMonthPayment?: number;
  lastMonthPayment?: number;
  monthlyPayment?: number;
}

const LoanInterestCalculator: NextPage = () => {
  const [loanAmount, setLoanAmount] = useState<number>(100000000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [results, setResults] = useState<{
    equalPrincipal: ResultData | null;
    equalTotal: ResultData | null;
    bullet: ResultData | null;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const principal = loanAmount;
    const years = loanTerm;
    const annualRate = interestRate / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;

    // 1. 원금 균등분할상환
    const principalPaymentPerMonth = principal / months;
    let remainingBalanceEP = principal;
    const scheduleEP: RepaymentDetail[] = [];
    let totalInterestEP = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceEP * monthlyRate;
      const totalPayment = principalPaymentPerMonth + interestPayment;
      remainingBalanceEP -= principalPaymentPerMonth;
      totalInterestEP += interestPayment;
      scheduleEP.push({
        month: i,
        principalPayment: principalPaymentPerMonth,
        interestPayment: interestPayment,
        totalPayment: totalPayment,
        remainingBalance: remainingBalanceEP < 0 ? 0 : remainingBalanceEP,
      });
    }

    // 2. 원리금 균등분할상환
    const monthlyPaymentET =
      principal *
      ((monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1));
    let remainingBalanceET = principal;
    const scheduleET: RepaymentDetail[] = [];
    let totalInterestET = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceET * monthlyRate;
      const principalPayment = monthlyPaymentET - interestPayment;
      remainingBalanceET -= principalPayment;
      totalInterestET += interestPayment;
      scheduleET.push({
        month: i,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        totalPayment: monthlyPaymentET,
        remainingBalance: remainingBalanceET < 0 ? 0 : remainingBalanceET,
      });
    }

    // 3. 만기일시상환
    const interestPaymentB = principal * monthlyRate;
    const scheduleB: RepaymentDetail[] = [];
    for (let i = 1; i <= months; i++) {
      scheduleB.push({
        month: i,
        principalPayment: i === months ? principal : 0,
        interestPayment: interestPaymentB,
        totalPayment: i === months ? principal + interestPaymentB : interestPaymentB,
        remainingBalance: i === months ? 0 : principal,
      });
    }
    const totalInterestB = interestPaymentB * months;

    return {
      equalPrincipal: {
        repaymentSchedule: scheduleEP,
        totalPrincipal: principal,
        totalInterest: totalInterestEP,
        totalRepayment: principal + totalInterestEP,
        firstMonthPayment: scheduleEP[0]?.totalPayment,
        lastMonthPayment: scheduleEP[scheduleEP.length - 1]?.totalPayment,
      },
      equalTotal: {
        repaymentSchedule: scheduleET,
        totalPrincipal: principal,
        totalInterest: totalInterestET,
        totalRepayment: principal + totalInterestET,
        monthlyPayment: monthlyPaymentET,
      },
      bullet: {
        repaymentSchedule: scheduleB,
        totalPrincipal: principal,
        totalInterest: totalInterestB,
        totalRepayment: principal + totalInterestB,
        monthlyPayment: interestPaymentB,
      },
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    if (calculationResults) {
      setResults(calculationResults);
      toast.success('계산이 완료되었습니다.');
    } else {
      toast.error('입력값을 확인해주세요.');
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="loanAmount">대출 원금 (원)</Label>
        <Input
          id="loanAmount"
          value={loanAmount.toLocaleString()}
          onChange={(e) => setLoanAmount(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loanTerm">대출 기간 (년)</Label>
        <Input
          id="loanTerm"
          value={loanTerm}
          onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interestRate">연 이자율 (%)</Label>
        <Input
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const renderResultTab = (title: string, data: ResultData | null) => {
    if (!data) return null;
    return (
      <TabsContent value={title}>
        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">총 대출 원금</div>
              <div className="text-right">{formatNumber(data.totalPrincipal)}원</div>
              <div className="font-medium">총 이자</div>
              <div className="text-right text-red-600">{formatNumber(data.totalInterest)}원</div>
              <div className="font-medium">총 상환금액</div>
              <div className="text-right font-bold">{formatNumber(data.totalRepayment)}원</div>
              {data.monthlyPayment && (
                <>
                  <div className="font-medium">
                    {title === '만기일시상환' ? '월 이자상환액' : '월 상환금'}
                  </div>
                  <div className="text-right font-bold text-blue-600">
                    {formatNumber(data.monthlyPayment)}원
                  </div>
                </>
              )}
              {data.firstMonthPayment && data.lastMonthPayment && (
                <>
                  <div className="font-medium">초회차 상환금</div>
                  <div className="text-right font-bold text-blue-600">{formatNumber(data.firstMonthPayment)}원</div>
                  <div className="font-medium">최종회차 상환금</div>
                  <div className="text-right font-bold text-blue-600">{formatNumber(data.lastMonthPayment)}원</div>
                </>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              <Table className="w-full table-fixed">
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-[35px] px-1 text-xs">개월</TableHead>
                    <TableHead className="text-center px-1 min-w-[65px] text-xs">월<br />상환금</TableHead>
                    <TableHead className="text-center px-1 min-w-[65px] text-xs">상환<br />원금</TableHead>
                    <TableHead className="text-center px-1 min-w-[65px] text-xs">상환<br />이자</TableHead>
                    <TableHead className="text-center px-1 min-w-[85px] text-xs">대출 잔액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.repaymentSchedule.map((item) => (
                    <TableRow key={item.month}>
                      <TableCell className="px-1 text-center whitespace-nowrap w-[35px] text-xs">{item.month}</TableCell>
                      <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatNumber(item.totalPayment)}</TableCell>
                      <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatNumber(item.principalPayment)}</TableCell>
                      <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatNumber(item.interestPayment)}</TableCell>
                      <TableCell className="px-1 text-center whitespace-nowrap min-w-[85px] text-xs">{formatNumber(item.remainingBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  const resultSection = (
    <>
      {results ? (
        <Tabs defaultValue="원리금 균등상환">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="원리금 균등상환">원리금 균등</TabsTrigger>
            <TabsTrigger value="원금 균등상환">원금 균등</TabsTrigger>
            <TabsTrigger value="만기일시상환">만기일시</TabsTrigger>
          </TabsList>
          {renderResultTab('원리금 균등상환', results.equalTotal)}
          {renderResultTab('원금 균등상환', results.equalPrincipal)}
          {renderResultTab('만기일시상환', results.bullet)}
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          입력 후 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <p className="text-muted-foreground">
          인생을 살아가다 보면 주택 마련, 자동차 구매, 사업 자금 등 목돈이 필요한 순간들이 찾아옵니다. 합리적인 금리의 대출은 이러한 목표를 더 빨리 달성할 수 있도록 돕는 유용한 금융 도구가 될 수 있습니다. 하지만 대출은 미래의 소득을 담보로 현재의 자금을 융통하는 것이므로, 신중한 계획과 철저한 비교가 반드시 필요합니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          특히 대출 상환 방식은 매월 납부해야 하는 금액과 총 이자 비용에 직접적인 영향을 미치기 때문에 가장 중요하게 고려해야 할 요소 중 하나입니다. 상환 방식은 크게 <strong className="text-foreground">원리금 균등분할상환, 원금 균등분할상환, 만기일시상환</strong> 세 가지로 나뉩니다. 각 방식의 장단점이 뚜렷하여 어떤 방식을 선택하느냐에 따라 자금 운용 계획이 크게 달라질 수 있습니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          예를 들어, 1억 원을 연 5% 금리로 20년간 대출받는다고 가정하면, 원리금 균등상환 방식에서는 매월 약 66만 원을 납부하지만, 원금 균등상환 방식에서는 첫 달 약 83만 원에서 시작하여 마지막 달 약 42만 원으로 줄어듭니다. 총 이자 차이만 해도 수백만 원에 달할 수 있습니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          <strong className="text-foreground">All_in_Calc의 대출 이자 계산기</strong>는 바로 이러한 복잡함을 해결해 드립니다. 대출 원금, 기간, 금리만 입력하면 세 가지 상환 방식에 따른 월별 상환금, 총 이자, 상환 스케줄을 한눈에 비교하여 보여줍니다. 직장인, 자영업자, 주택 구매 예정자 등 누구나 쉽게 이용할 수 있으며, 대출 실행 전 시뮬레이션을 통해 가장 유리한 조건을 선택하는 데 도움을 줍니다.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">어떤 상환 방식이 나에게 맞을까?</h3>
        <p className="text-muted-foreground">
          대출 상환 방식은 각각의 특징이 명확하므로, 자신의 현재 소득, 미래 소득 예상, 자금 운용 계획 등을 종합적으로 고려하여 선택해야 합니다. 아래에서 각 방식의 핵심 공식과 실제 계산 예시를 확인할 수 있습니다.
        </p>
        <div className="space-y-6 mt-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">1. 원리금 균등분할상환 (가장 일반적인 방식)</h4>
            <p className="text-sm text-muted-foreground">매월 상환하는 원금과 이자의 합계(원리금)가 대출 기간 내내 동일하게 유지되는 방식입니다. 초기에는 이자 비중이 높고 원금 비중이 낮지만, 시간이 지날수록 이자 비중이 줄고 원금 비중이 늘어나는 구조입니다.</p>
            <p className="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 상환금 = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
            <p className="text-xs text-muted-foreground mt-1">예시: 1억 원, 연 5%, 20년(240개월) → 월 약 660,000원</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
              <li><strong className="text-foreground">장점:</strong> 매월 동일한 금액을 상환하므로, 예측 가능하고 안정적인 자금 계획을 세울 수 있습니다.</li>
              <li><strong className="text-foreground">단점:</strong> 원금 균등방식에 비해 총 이자 부담이 다소 높습니다.</li>
              <li><strong className="text-foreground">추천 대상:</strong> 매월 고정적인 소득이 있고, 계획적인 지출 관리를 선호하는 직장인에게 적합합니다.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">2. 원금 균등분할상환 (총 이자가 가장 적은 방식)</h4>
            <p className="text-sm text-muted-foreground">대출 원금을 대출 기간으로 균등하게 나누어 매월 동일한 원금을 상환하고, 이자는 남은 원금에 대해서만 계산하여 납부하는 방식입니다. 따라서 초기 상환 부담이 가장 크고, 시간이 지날수록 월 상환금이 점차 줄어듭니다.</p>
            <p className="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 원금 상환액 = P / n</strong><br /><strong>월 이자 = 잔여 원금 × r</strong></p>
            <p className="text-xs text-muted-foreground mt-1">예시: 1억 원, 연 5%, 20년 → 첫 달 약 833,000원, 마지막 달 약 418,000원</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
              <li><strong className="text-foreground">장점:</strong> 세 가지 방식 중 총 이자 부담이 가장 적습니다.</li>
              <li><strong className="text-foreground">단점:</strong> 초기 상환액이 커서 부담이 될 수 있습니다.</li>
              <li><strong className="text-foreground">추천 대상:</strong> 초기 자금 여유가 있거나, 향후 소득 감소가 예상되는 은퇴 예정자에게 유리할 수 있습니다.</li>
            </ul>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">3. 만기일시상환 (월 부담이 가장 적은 방식)</h4>
            <p className="text-sm text-muted-foreground">대출 기간 동안에는 매월 이자만 납부하고, 만기일에 원금 전액을 한 번에 상환하는 방식입니다. 주로 단기 대출이나 전세자금 대출 등에서 사용됩니다.</p>
            <p className="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 이자 = P × r</strong></p>
            <p className="text-xs text-muted-foreground mt-1">예시: 1억 원, 연 5% → 매월 약 417,000원 이자만 납부, 만기 시 원금 상환</p>
            <ul className="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
              <li><strong className="text-foreground">장점:</strong> 매월 이자만 내므로 월 상환 부담이 가장 적습니다.</li>
              <li><strong className="text-foreground">단점:</strong> 총 이자 부담이 가장 크며, 만기 시 원금 상환 부담이 매우 큽니다.</li>
              <li><strong className="text-foreground">추천 대상:</strong> 단기간 자금을 융통할 필요가 있거나, 만기 시 원금을 확실히 상환할 수 있는 계획이 있는 경우에 적합합니다.</li>
            </ul>
          </div>
        </div>
        <p className="text-xs mt-4 text-muted-foreground">※ P: 대출원금, r: 월이율(연이율/12), n: 총 상환 개월 수</p>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">현명한 대출을 위한 실전 꿀팁</h3>
        <ul className="space-y-6">
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">1. DSR(총부채원리금상환비율)을 먼저 확인하세요.</h4>
            <p className="text-muted-foreground">
              DSR은 연 소득 대비 모든 가계대출의 연간 원리금 상환액 비율을 의미하며, 현재 금융권 대출 심사의 핵심 기준입니다. 자신의 DSR을 미리 계산해보고, 대출 가능한 한도를 파악하는 것이 중요합니다. 일반적으로 은행권은 DSR 40% 이내를 요구하며, 2025년부터는 스트레스 DSR까지 적용되어 규제가 강화되었습니다.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">2. '중도상환수수료'를 반드시 고려하세요.</h4>
            <p className="text-muted-foreground">
              대출 기간 중 목돈이 생겨 원금을 미리 갚을 경우, 은행은 '중도상환수수료'를 부과할 수 있습니다. 보통 대출 실행 후 3년까지 적용되며, 수수료율은 은행과 상품마다 다릅니다. 대출 약정 시 중도상환수수료 면제 조건이나 수수료율을 꼼꼼히 확인해야 불필요한 비용을 줄일 수 있습니다.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">3. 금리 변동기에는 '고정금리'와 '변동금리'의 유불리를 따져보세요.</h4>
            <p className="text-muted-foreground">
              금리 상승기에는 초기 금리가 다소 높더라도 만기까지 이자율이 고정되는 '고정금리'가 유리할 수 있습니다. 반대로 금리 하락기에는 시장 금리를 반영하여 이자율이 조정되는 '변동금리'가 더 나은 선택일 수 있습니다. 자신의 위험 감수 성향과 시장 전망을 고려하여 신중하게 선택해야 합니다.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">4. '금리인하요구권'을 적극적으로 활용하세요.</h4>
            <p className="text-muted-foreground">
              대출 실행 이후 취업, 승진, 소득 증가, 신용등급 상승 등 신용상태에 긍정적인 변화가 생겼다면, 은행에 대출 금리를 낮춰달라고 요구할 수 있는 '금리인하요구권'을 행사할 수 있습니다. 이는 법으로 보장된 소비자의 권리이므로, 조건에 해당된다면 잊지 말고 신청하는 것이 좋습니다.
            </p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">5. 여러 금융사의 상품을 한 번에 비교하세요.</h4>
            <p className="text-muted-foreground">
              발품을 팔수록 더 좋은 조건의 대출을 찾을 확률이 높아집니다. 주거래 은행만 고집하기보다는, 온라인 대출 비교 플랫폼 등을 활용하여 여러 금융사의 금리와 한도를 한눈에 비교해보는 것이 현명합니다. 단 0.1%의 금리 차이라도 장기적으로는 상당한 이자 비용 절감으로 이어질 수 있습니다.
            </p>
          </li>
        </ul>
      </>
    )
  };

  return (
    <CalculatorsLayout
      title="대출 이자 계산기"
      description="대출 상환 방식에 따른 월 상환금과 총 이자를 비교 분석합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default LoanInterestCalculator;