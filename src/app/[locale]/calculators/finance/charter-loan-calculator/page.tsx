'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const CharterLoanCalculator: React.FC = () => {
  const { dict: d, locale, formatCurrency } = useI18n();
  const isKo = locale === 'ko';

  const [loanAmount, setLoanAmount] = useState<number>(15000);
  const [annualRate, setAnnualRate] = useState<number>(3.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(2);

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalPayment, setTotalPayment] = useState<number | null>(null);

  const calculate = () => {
    if (loanAmount <= 0 || annualRate <= 0 || loanTermYears <= 0) return;

    const n = loanTermYears * 12;
    const r = annualRate / 100 / 12;
    const pmt = loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const total = pmt * n;
    const interest = total - loanAmount;

    setMonthlyPayment(Math.round(pmt));
    setTotalInterest(Math.round(interest));
    setTotalPayment(Math.round(total));
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="loanAmount">{isKo ? '대출금액 (만원)' : 'Loan Amount (10K won)'}</Label>
        <Input
          id="loanAmount"
          type="number"
          value={loanAmount}
          onChange={(e) => setLoanAmount(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="annualRate">{isKo ? '연이자율 (%)' : 'Annual Rate (%)'}</Label>
          <Input
            id="annualRate"
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(Number(e.target.value))}
            className="text-right"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="loanTermYears">{isKo ? '대출기간 (년)' : 'Loan Term (years)'}</Label>
          <Input
            id="loanTermYears"
            type="number"
            value={loanTermYears}
            onChange={(e) => setLoanTermYears(Number(e.target.value))}
            className="text-right"
          />
        </div>
      </div>
      <Button onClick={calculate} className="w-full">{d.common.calculate}</Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-5">
      {monthlyPayment !== null ? (
        <>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
            <p className="text-sm text-muted-foreground">{isKo ? '월 납부액' : 'Monthly Payment'}</p>
            <p className="text-4xl font-extrabold text-primary mt-1">
              {formatCurrency(monthlyPayment, 'KRW', { maximumFractionDigits: 0 }).replace('₩', '')} {isKo ? '만원' : '10K won'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {isKo ? '매월' : 'Per month for'} {loanTermYears} {isKo ? '년간' : 'years'}
            </p>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '대출금액' : 'Loan Amount'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{loanAmount.toLocaleString()} {isKo ? '만원' : '10K won'}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '연이자율' : 'Annual Rate'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{annualRate}%</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '대출기간' : 'Loan Term'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{loanTermYears} {isKo ? '년' : 'years'}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '총 이자' : 'Total Interest'}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-red-500">{totalInterest!.toLocaleString()} {isKo ? '만원' : '10K won'}</td>
                </tr>
                <tr className="bg-muted/50 font-semibold">
                  <td className="px-4 py-2.5">{isKo ? '총 상환액' : 'Total Payment'}</td>
                  <td className="px-4 py-2.5 text-right">{totalPayment!.toLocaleString()} {isKo ? '만원' : '10K won'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <p>{isKo ? '값을 입력하고 계산하기를 눌러주세요.' : 'Enter values and press Calculate.'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">{isKo ? '전세자금대출 계산기' : 'Charter Loan Calculator'}</strong>
          {isKo
            ? '는 전세 보증금을 마련하기 위해 필요한 대출의 월 상환액과 총 이자를 계산합니다. 전세자금대출은 주로 원리금균등 상환 방식을 사용합니다.'
            : ' calculates the monthly payment and total interest for loans used to secure jeonse deposit. Jeonse loans typically use equal installment repayment.'}
        </p>
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <p className="font-semibold text-foreground mb-3">{isKo ? '전세자금대출 유형' : 'Jeonse Loan Types'}</p>
          <div className="space-y-3">
            <div className="border-b border-border pb-3">
              <p className="font-semibold text-foreground">{isKo ? '버팀목 전세자금대출' : 'Butteomjeom Loan'}</p>
              <p className="mt-1">{isKo ? '주택도시기금에서 운영. 연소득 5천만원 이하, 전세보증금 2억 이하(수도권 3억 이하) 조건. 금리 1.5~2.1%.' : 'Operated by Housing & Urban Fund. Income under 50M won, deposit under 200M won (300M in Seoul metro). Rate: 1.5~2.1%.'}</p>
            </div>
            <div className="border-b border-border pb-3">
              <p className="font-semibold text-foreground">{isKo ? '중기청 전세자금대출' : 'SMEs Loan'}</p>
              <p className="mt-1">{isKo ? '중소기업 재직자 대상. 연소득 5천만원 이하, 전세보증금 2억 이하. 금리 1.2~2.1%.' : 'For SME employees. Income under 50M won, deposit under 200M won. Rate: 1.2~2.1%.'}</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">{isKo ? '은행 전세자금대출' : 'Bank Jeonse Loan'}</p>
              <p className="mt-1">{isKo ? '시중은행 대출. DSR 기반 한도 산정. 금리 3~5% 수준.' : 'Commercial bank loans. DSR-based limit calculation. Rate: 3~5%.'}</p>
            </div>
          </div>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground">{isKo ? '원리금균등 상환 공식' : 'Equal Installment Formula'}</h4>
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">M = P × [ r(1+r)^n ] / [ (1+r)^n − 1 ]</strong>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-foreground">M</strong> = {isKo ? '월 납부액 (만원)' : 'Monthly payment (10K won)'}</li>
          <li><strong className="text-foreground">P</strong> = {isKo ? '대출 원금 (만원)' : 'Loan principal (10K won)'}</li>
          <li><strong className="text-foreground">r</strong> = {isKo ? '월 이자율 (연이자율/12)' : 'Monthly rate (annual/12)'}</li>
          <li><strong className="text-foreground">n</strong> = {isKo ? '총 납부 횟수 (기간년 × 12)' : 'Total payments (years × 12)'}</li>
        </ul>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '대출 기간 선택' : 'Loan Term Selection'}</p>
            <p className="mt-1">{isKo ? '전세자금대출은 보통 1~2년 단위로 계약합니다. 만기 시 대출 연장이 필요하며, 이때 금리가 변동될 수 있습니다.' : 'Jeonse loans are typically 1-2 year terms. Renewal is needed at maturity, and rates may change.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '버팀목 vs 은행 대출' : 'Butteomjeom vs Bank Loan'}</p>
            <p className="mt-1">{isKo ? '버팀목은 금리가 낮지만 소득·보증금 요건이 까다롭습니다. 요건 충족 시 버팀목을 우선 활용하세요.' : 'Butteomjeom has lower rates but strict income/deposit requirements. Prioritize it if eligible.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '중도상환 수수료' : 'Prepayment Fees'}</p>
            <p className="mt-1">{isKo ? '일부 대출은 중도상환 시 수수료가 발생할 수 있습니다. 만기 전 상환 시 확인이 필요합니다.' : 'Some loans charge prepayment fees. Verify before early repayment.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '보증금 반환보증보험' : 'Deposit Return Insurance'}</p>
            <p className="mt-1">{isKo ? '전세보증금 반환보증보험(HUG, SGI)에 가입하면 임대인의 보증금 미반환 위험으로부터 보호받을 수 있습니다.' : 'Deposit return insurance (HUG, SGI) protects against landlord default on deposit refund.'}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '전세자금대출 계산기' : 'Charter Loan Calculator'}
      description={isKo ? '전세자금대출 월 상환액과 이자를 계산합니다' : 'Calculate jeonse loan monthly payment and interest'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CharterLoanCalculator;
