'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { formatNumber } from '@/utils/formatNumber';

const MortgageCalculator: NextPage = () => {
  const [loanAmount, setLoanAmount] = useState<number>(300000000);
  const [annualRate, setAnnualRate] = useState<number>(4.0);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [results, setResults] = useState<{
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const P = loanAmount;
    const annualRateDecimal = annualRate / 100;
    const n = loanTermYears * 12;
    const r = annualRateDecimal / 12;

    if (isNaN(P) || P <= 0 || isNaN(annualRateDecimal) || annualRateDecimal <= 0 || isNaN(n) || n <= 0) {
      return null;
    }

    const monthlyPayment = P * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalRepayment = monthlyPayment * n;
    const totalInterest = totalRepayment - P;

    return { monthlyPayment, totalInterest, totalRepayment };
  }, [loanAmount, annualRate, loanTermYears]);

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
        <Label htmlFor="loanAmount">대출금액 (원)</Label>
        <Input
          id="loanAmount"
          value={loanAmount.toLocaleString()}
          onChange={(e) => setLoanAmount(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">연이자율 (%)</Label>
        <Input
          id="annualRate"
          value={annualRate}
          onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
          className="text-right"
          type="number"
          step="0.1"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loanTermYears">대출기간 (년)</Label>
        <Input
          id="loanTermYears"
          value={loanTermYears}
          onChange={(e) => setLoanTermYears(parseInt(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {results ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-medium">월 상환액</div>
            <div className="text-right font-bold text-blue-600">{formatNumber(Math.round(results.monthlyPayment))}원</div>
            <div className="font-medium">총 이자</div>
            <div className="text-right text-red-600">{formatNumber(Math.round(results.totalInterest))}원</div>
            <div className="font-medium">총 상환금액</div>
            <div className="text-right font-bold">{formatNumber(Math.round(results.totalRepayment))}원</div>
          </div>
        </div>
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
          <strong className="text-foreground">주택담보대출</strong>은 내 집 마련의 꿈을 현실로 바꾸는 가장 보편적인 금융 수단입니다. 주택을 담보로 제공하고 은행 또는 금융기관에서 목돈을 빌려, 매월 원리금을 나누어 갚아가는 구조로, 신용대출보다 낮은 금리로 큰 금액을 조달할 수 있다는 장점이 있습니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          가장 널리 쓰이는 방식은 <strong className="text-foreground">원리금 균등상환</strong>입니다. 대출 기간 내내 매월 동일한 금액을 상환하므로 자금 계획을 세우기 매우 용이하며, 초기에는 이자 비중이 높고 후기에는 원금 비중이 높아지는 체감 구조를 가집니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          누구에게나 필요한 계산기입니다. 내 집 마련을 앞둔 실수요자, 기존 대출을 갈아타려는 분, 그리고 월 고정 지출을 미리 점검하려는 직장인 모두에게 유용합니다. 대출 실행 전 예상 상환 부담을 가늠해보는 것이 현명한 첫걸음입니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          <strong className="text-foreground">All_in_Calc의 주택담보대출 계산기</strong>는 대출금액, 연이자율, 대출기간만 입력하면 월 상환액, 총 이자, 총 상환금액을 즉시 보여줍니다. 은행 창구에 가지 않고도 합리적인 주택 마련 시뮬레이션을 시작해 보세요.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">원리금 균등상환 계산 공식</h3>
        <p className="text-muted-foreground">
          원리금 균등상환의 월 상환금은 다음 공식으로 구합니다. 이자는 매월 잔액에 대해 붙고, 원금과 이자를 합한 금액이 매달 같아지도록 설계됩니다.
        </p>
        <div className="font-mono p-3 bg-card rounded-md my-2 text-sm text-primary">
          <strong>M = P × [ r(1+r)^n ] / [ (1+r)^n − 1 ]</strong>
        </div>
        <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
          <li><strong className="text-foreground">M:</strong> 월 상환금</li>
          <li><strong className="text-foreground">P:</strong> 대출 원금 (Principal)</li>
          <li><strong className="text-foreground">r:</strong> 월 이자율 (연이율 ÷ 12)</li>
          <li><strong className="text-foreground">n:</strong> 총 상환 개월 수 (대출기간(년) × 12)</li>
        </ul>
        <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
          <h4 className="font-semibold text-md mb-2 text-foreground">계산 예시</h4>
          <p className="text-sm text-muted-foreground">대출금액 3억 원, 연 4.0%, 30년(360개월)인 경우</p>
          <p className="font-mono text-sm text-primary mt-1">r = 4.0% ÷ 12 = 0.003333…</p>
          <p className="font-mono text-sm text-primary">M = 300,000,000 × [0.003333 × (1.003333)^360] / [(1.003333)^360 − 1] ≈ 1,432,053원</p>
          <p className="text-xs text-muted-foreground mt-1">총 상환금액 ≈ 1,432,053 × 360 = 515,539,080원, 총 이자 ≈ 215,539,080원</p>
        </div>
        <p className="mt-4 text-muted-foreground text-sm">
          실제 대출은 중도상환수수료, 보험료, 금리 방식(고정·변동) 등에 따라 달라질 수 있으니 최종 계약 전 금융기관과 상담하시기 바랍니다.
        </p>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">주택담보대출 이용 시 유용한 팁</h3>
        <ul className="space-y-6">
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">1. DSR(총부채원리금상환비율)을 먼저 확인하세요.</h4>
            <p className="text-muted-foreground">DSR은 연 소득 대비 모든 가계대출의 연간 원리금 상환액 비율입니다. 주택담보대출은 금액이 커 DSR 기준을 넘으면 한도가 줄어듭니다. 신청 전 미리 계산해보는 것이 필수입니다.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">2. 고정금리와 변동금리를 비교하세요.</h4>
            <p className="text-muted-foreground">금리 상승기에는 고정금리가, 하락기에는 변동금리가 유리합니다. 장기 대출 특성상 금리 변동에 따른 이자 부담 차이를 신중히 따져야 합니다.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">3. 중도상환수수료 조건을 점검하세요.</h4>
            <p className="text-muted-foreground">목돈이 생겨 원금을 조기 상환할 때 통상 3년 이내는 수수료가 부과됩니다. 면제 조건을 확인하면 불필요한 비용을 줄일 수 있습니다.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">4. 보금자리론·디딤돌대출 등 정책 상품을 활용하세요.</h4>
            <p className="text-muted-foreground">주택금융공사의 보금자리론, 디딤돌대출 등은 시장 금리보다 낮은 금리로 자금을 빌릴 수 있는 제도입니다. 자격을 확인하고 적극 활용하세요.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">5. 여러 금융기관의 금리를 비교하세요.</h4>
            <p className="text-muted-foreground">동일 조건이라도 은행별 금리가 다릅니다. 주거래 은행만 고집하지 말고 비교하여 최적 조건을 찾으세요. 0.1% 차이도 장기적으로 큰 절감입니다.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">6. 원금 균등 방식과 총이자를 비교하세요.</h4>
            <p className="text-muted-foreground">원금 균등은 총이자가 적지만 초기 부담이 큽니다. 두 방식의 월 납부액과 총이자를 모두 시뮬레이션해 자신의 상황에 맞는 방식을 고르세요.</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="주택담보대출 계산기"
      description="대출금액, 연이자율, 대출기간을 입력하여 월 상환액과 총 이자를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default MortgageCalculator;
