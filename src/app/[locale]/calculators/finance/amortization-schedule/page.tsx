'use client';

import { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const AmortizationSchedule: React.FC = () => {
  const { dict: d, locale, formatCurrency } = useI18n();
  const isKo = locale === 'ko';

  const [loanAmount, setLoanAmount] = useState<number>(100000000);
  const [annualRate, setAnnualRate] = useState<number>(5);
  const [loanTermYears, setLoanTermYears] = useState<number>(10);
  const [repaymentType, setRepaymentType] = useState<string>('equal_installment');

  const [calculated, setCalculated] = useState(false);

  const schedule = useMemo((): ScheduleRow[] => {
    if (loanAmount <= 0 || annualRate <= 0 || loanTermYears <= 0) return [];
    const n = loanTermYears * 12;
    const r = annualRate / 100 / 12;
    const rows: ScheduleRow[] = [];
    let balance = loanAmount;

    if (repaymentType === 'equal_installment') {
      // 원리금균등 (PMT)
      const pmt = loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
      for (let mo = 1; mo <= n; mo++) {
        const interest = balance * r;
        const principal = pmt - interest;
        balance = Math.max(0, balance - principal);
        rows.push({ month: mo, payment: Math.round(pmt), principal: Math.round(principal), interest: Math.round(interest), balance: Math.round(balance) });
      }
    } else {
      // 원금균등
      const equalPrincipal = loanAmount / n;
      for (let mo = 1; mo <= n; mo++) {
        const interest = balance * r;
        const payment = equalPrincipal + interest;
        balance = Math.max(0, balance - equalPrincipal);
        rows.push({ month: mo, payment: Math.round(payment), principal: Math.round(equalPrincipal), interest: Math.round(interest), balance: Math.round(balance) });
      }
    }
    return rows;
  }, [loanAmount, annualRate, loanTermYears, repaymentType]);

  const summary = useMemo(() => {
    if (schedule.length === 0) return null;
    const totalPayment = schedule.reduce((s, r) => s + r.payment, 0);
    const totalInterest = schedule.reduce((s, r) => s + r.interest, 0);
    return { totalPayment, totalInterest, totalPrincipal: loanAmount };
  }, [schedule, loanAmount]);

  const calculate = () => {
    setCalculated(true);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="loanAmount">{isKo ? '대출금액 (원)' : 'Loan Amount'}</Label>
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
      <div className="space-y-1">
        <Label>{isKo ? '상환방식' : 'Repayment Type'}</Label>
        <Select value={repaymentType} onValueChange={setRepaymentType}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="equal_installment">{isKo ? '원리금균등' : 'Equal Installment (PMT)'}</SelectItem>
            <SelectItem value="equal_principal">{isKo ? '원금균등' : 'Equal Principal'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculate} className="w-full">{d.common.calculate}</Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-5">
      {calculated && summary ? (
        <>
          {summary && (
            <>
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
                <p className="text-sm text-muted-foreground">{isKo ? '월 납부액 (첫 달)' : 'Monthly Payment (first month)'}</p>
                <p className="text-4xl font-extrabold text-primary mt-1">{formatCurrency(schedule[0].payment)}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">{isKo ? '대출금액' : 'Loan Amount'}</p>
                  <p className="font-bold text-foreground">{formatCurrency(summary.totalPrincipal)}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">{isKo ? '총 이자' : 'Total Interest'}</p>
                  <p className="font-bold text-red-500">{formatCurrency(summary.totalInterest)}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">{isKo ? '총 상환액' : 'Total Payment'}</p>
                  <p className="font-bold text-foreground">{formatCurrency(summary.totalPayment)}</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-muted-foreground text-xs">{isKo ? '이자비율' : 'Interest Ratio'}</p>
                  <p className="font-bold text-foreground">{((summary.totalInterest / summary.totalPayment) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <p>{isKo ? '값을 입력하고 계산하기를 눌러주세요.' : 'Enter values and press Calculate.'}</p>
        </div>
      )}
    </div>
  );

  const fullWidthSection = calculated && schedule.length > 0 ? (
    <div>
      <h3 className="text-base font-semibold text-foreground mb-2">{isKo ? '월별 상환 스케줄' : 'Monthly Amortization Schedule'}</h3>
      <div className="max-h-[480px] overflow-auto rounded-lg border border-border">
        <table className="w-full text-xs border-collapse">
          <thead className="sticky top-0 bg-muted">
            <tr className="text-muted-foreground border-b border-border">
              <th className="px-3 py-2 text-left font-medium">{isKo ? '월' : 'Month'}</th>
              <th className="px-3 py-2 text-right font-medium">{isKo ? '납부액' : 'Payment'}</th>
              <th className="px-3 py-2 text-right font-medium">{isKo ? '원금' : 'Principal'}</th>
              <th className="px-3 py-2 text-right font-medium">{isKo ? '이자' : 'Interest'}</th>
              <th className="px-3 py-2 text-right font-medium">{isKo ? '잔액' : 'Balance'}</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="px-3 py-2 text-foreground">{row.month}</td>
                <td className="px-3 py-2 text-right text-foreground">{formatCurrency(row.payment)}</td>
                <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(row.principal)}</td>
                <td className="px-3 py-2 text-right text-red-500">{formatCurrency(row.interest)}</td>
                <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">{isKo ? '상환 스케줄 계산기' : 'Amortization Schedule Calculator'}</strong>
          {isKo
            ? '는 대출금을 매월 얼마씩 갚아야 하는지, 전체 기간 동안 이자가 얼마 발생하는지 상세히 보여줍니다.'
            : ' shows exactly how much you need to repay each month and how much interest accumulates over the entire loan period.'}
        </p>
        <p>
          {isKo
            ? '원리금균등 방식은 매월 동일한 금액을 납부하고, 원금균등 방식은 매월 동일한 원금에 이자를 더해 납부합니다.'
            : 'Equal Installment (PMT) pays the same amount each month, while Equal Principal pays equal principal plus decreasing interest.'}
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <h4 className="font-semibold text-foreground">{isKo ? '원리금균등 (PMT 공식)' : 'Equal Installment (PMT Formula)'}</h4>
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">M = P × [ r(1+r)^n ] / [ (1+r)^n − 1 ]</strong>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-foreground">M</strong> = {isKo ? '월 납부액' : 'Monthly payment'}</li>
          <li><strong className="text-foreground">P</strong> = {isKo ? '대출 원금' : 'Loan principal'}</li>
          <li><strong className="text-foreground">r</strong> = {isKo ? '월 이자율 (연이자율/12)' : 'Monthly interest rate (annual/12)'}</li>
          <li><strong className="text-foreground">n</strong> = {isKo ? '총 납부 횟수 (기간 × 12)' : 'Total number of payments (term × 12)'}</li>
        </ul>
        <h4 className="font-semibold text-foreground mt-4">{isKo ? '원금균등' : 'Equal Principal'}</h4>
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">{isKo ? '매월 원금 = 대출금 / 총 납부 횟수' : 'Monthly Principal = Loan Amount / Total Payments'}</strong>
        </div>
        <p>{isKo ? '이자 = 잔액 × 월 이자율, 매월 원금이 동일하고 이자가 줄어듭니다.' : 'Interest = Balance × Monthly rate. Principal is equal each month while interest decreases.'}</p>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '원리금균등 vs 원금균등' : 'PMT vs Equal Principal'}</p>
            <p className="mt-1">{isKo ? '원리금균등은 초기 부담이 적고 일정하지만, 원금균등은 총 이자가 적습니다. 원금균등은 시간이 지날수록 상환액이 줄어듭니다.' : 'PMT has lower initial burden and consistent payments, but Equal Principal results in less total interest and decreasing payments over time.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '중도상환 수수료' : 'Prepayment Fees'}</p>
            <p className="mt-1">{isKo ? '대출 상환 스케줄은 예상치이며, 중도상환 시 수수료가 발생할 수 있습니다. 상환 전 금융기관에 확인하세요.' : 'The schedule is an estimate; prepayment fees may apply. Check with your lender before making extra payments.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '이자율 변동' : 'Rate Changes'}</p>
            <p className="mt-1">{isKo ? '변동금리 대출의 경우 실제 이자율이 바뀔 수 있어 상환 스케줄이 달라질 수 있습니다.' : 'For variable-rate loans, actual rates may change, affecting the amortization schedule.'}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '상환 스케줄 계산기' : 'Amortization Schedule Calculator'}
      description={isKo ? '대출 상환 스케줄을 상세히 확인하세요' : 'View detailed loan repayment schedule'}
      variant="split"
      fullWidthSection={fullWidthSection}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default AmortizationSchedule;
