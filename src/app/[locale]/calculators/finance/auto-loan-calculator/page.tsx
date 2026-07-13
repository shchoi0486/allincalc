'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AutoLoanCalculator: React.FC = () => {
  const { dict: d, locale, formatCurrency } = useI18n();
  const isEn = locale === 'en';

  const [vehiclePrice, setVehiclePrice] = useState<number>(35000);
  const [downPayment, setDownPayment] = useState<number>(5000);
  const [loanTermMonths, setLoanTermMonths] = useState<number>(60);
  const [apr, setApr] = useState<number>(5.5);

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);
  const [totalInterest, setTotalInterest] = useState<number | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);

  const calculate = () => {
    const principal = Math.max(0, vehiclePrice - downPayment);
    if (principal <= 0 || loanTermMonths <= 0 || apr <= 0) {
      setMonthlyPayment(null);
      setTotalInterest(null);
      setTotalCost(null);
      return;
    }
    const r = apr / 100 / 12;
    const n = loanTermMonths;
    const pmt = principal * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const total = pmt * n;
    const interest = total - principal;
    setMonthlyPayment(Math.round(pmt));
    setTotalInterest(Math.round(interest));
    setTotalCost(Math.round(total));
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="vehiclePrice">{isEn ? 'Vehicle Price ($)' : '차량 가격 ($)'}</Label>
        <Input
          id="vehiclePrice"
          type="number"
          value={vehiclePrice}
          onChange={(e) => setVehiclePrice(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="downPayment">{isEn ? 'Down Payment ($)' : '선수금 ($)'}</Label>
        <Input
          id="downPayment"
          type="number"
          value={downPayment}
          onChange={(e) => setDownPayment(Number(e.target.value))}
          className="text-right"
        />
        <p className="text-xs text-muted-foreground">
          {isEn ? 'Loan Amount: ' : '대출금액: '}
          <strong className="text-foreground">${Math.max(0, vehiclePrice - downPayment).toLocaleString()}</strong>
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="loanTermMonths">{isEn ? 'Loan Term (months)' : '대출기간 (개월)'}</Label>
          <Input
            id="loanTermMonths"
            type="number"
            value={loanTermMonths}
            onChange={(e) => setLoanTermMonths(Number(e.target.value))}
            className="text-right"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="apr">{isEn ? 'APR (%)' : '연이자율 (%)'}</Label>
          <Input
            id="apr"
            type="number"
            step="0.1"
            value={apr}
            onChange={(e) => setApr(Number(e.target.value))}
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
            <p className="text-sm text-muted-foreground">{isEn ? 'Monthly Payment' : '월 납부액'}</p>
            <p className="text-4xl font-extrabold text-primary mt-1">${monthlyPayment.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isEn ? 'per month for' : '매월'} {loanTermMonths} {isEn ? 'months' : '개월'}
            </p>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isEn ? 'Vehicle Price' : '차량 가격'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">${vehiclePrice.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isEn ? 'Down Payment' : '선수금'}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-blue-600">${downPayment.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isEn ? 'Loan Amount' : '대출금액'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">${Math.max(0, vehiclePrice - downPayment).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isEn ? 'Total Interest' : '총 이자'}</td>
                  <td className="px-4 py-2.5 text-right font-medium text-red-500">${totalInterest!.toLocaleString()}</td>
                </tr>
                <tr className="bg-muted/50 font-semibold">
                  <td className="px-4 py-2.5">{isEn ? 'Total Cost' : '총 상환액'}</td>
                  <td className="px-4 py-2.5 text-right">${totalCost!.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{isEn ? 'Interest Rate' : '이자율'}</p>
              <p className="font-bold text-foreground">{apr}% APR</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{isEn ? 'Loan Term' : '대출기간'}</p>
              <p className="font-bold text-foreground">{loanTermMonths} {isEn ? 'months' : '개월'}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <p>{isEn ? 'Enter values and press Calculate.' : '값을 입력하고 계산하기를 눌러주세요.'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">{isEn ? 'Auto Loan Calculator' : '자동차 대출 계산기'}</strong>
          {isEn
            ? ' helps you estimate monthly car payments based on vehicle price, down payment, loan term, and APR. Knowing your monthly obligation before visiting the dealership empowers you to negotiate better.'
            : '는 차량 가격, 선수금, 대출기간, APR을 기반으로 월 납부액을 계산합니다. 딜러를 방문하기 전에 월 부담금을 미리 파악하면 더 좋은 조건으로 협상할 수 있습니다.'}
        </p>
        <p>
          {isEn
            ? 'APR (Annual Percentage Rate) includes not just the interest rate but also fees and other charges associated with the loan, giving you a more accurate picture of borrowing costs.'
            : 'APR(연이자율)은 이자율뿐 아니라 대출과 관련된 수수료와 기타 비용을 포함하여 대출 비용의 더 정확한 그림을 제공합니다.'}
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">PMT = P × r(1+r)^n / ((1+r)^n - 1)</strong>
        </div>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong className="text-foreground">PMT</strong> = {isEn ? 'Monthly payment' : '월 납부액'}</li>
          <li><strong className="text-foreground">P</strong> = {isEn ? 'Principal (Vehicle Price - Down Payment)' : '원금 (차량가격 - 선수금)'}</li>
          <li><strong className="text-foreground">r</strong> = {isEn ? 'Monthly interest rate (APR / 12)' : '월 이자율 (APR / 12)'}</li>
          <li><strong className="text-foreground">n</strong> = {isEn ? 'Number of months' : '총 개월 수'}</li>
        </ul>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</span>
          <div>
            <p className="font-semibold text-foreground">{isEn ? 'Larger Down Payment' : '높은 선수금'}</p>
            <p className="mt-1">{isEn ? 'Putting down 20% or more can help you avoid negative equity and may qualify you for better interest rates.' : '20% 이상의 선수금은 네거티브 이퀴티를 피하고 더 낮은 이자율을 받는 데 도움이 됩니다.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</span>
          <div>
            <p className="font-semibold text-foreground">{isEn ? 'Compare APR, Not Just Rate' : 'APR을 비교하세요'}</p>
            <p className="mt-1">{isEn ? 'Two loans with the same interest rate can have different APRs due to fees. Always compare APR for the true cost.' : '같은 이자율의 두 대출도 수수료 차이로 APR이 다를 수 있습니다. 항상 APR을 비교하여 실제 비용을 확인하세요.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</span>
          <div>
            <p className="font-semibold text-foreground">{isEn ? 'Shorter Term Saves Money' : '기간을 줄이면 절약'}</p>
            <p className="mt-1">{isEn ? 'A 48-month loan instead of 60 months typically saves hundreds in interest, though monthly payments are higher.' : '60개월 대신 48개월 대출은 월 납부액이 높지만 이자를 수백 달러 절약할 수 있습니다.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</span>
          <div>
            <p className="font-semibold text-foreground">{isEn ? 'Credit Score Impact' : '신용점수 영향'}</p>
            <p className="mt-1">{isEn ? 'Your credit score significantly affects the APR offered. Check your score and improve it before applying for the best rates.' : '신용점수가 제공되는 APR에 큰 영향을 미칩니다. 최고 이자율을 받으려면 신청 전 신용점수를 확인하고 개선하세요.'}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isEn ? 'Auto Loan Calculator' : '자동차 대출 계산기'}
      description={isEn ? 'Estimate your monthly car payment' : '자동차 대출 월 납부액 계산'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default AutoLoanCalculator;
