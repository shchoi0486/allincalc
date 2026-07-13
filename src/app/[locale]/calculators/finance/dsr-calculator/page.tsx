'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DsrCalculator: React.FC = () => {
  const { dict: d, locale } = useI18n();
  const isKo = locale === 'ko';

  const [annualIncome, setAnnualIncome] = useState<number>(5000);
  const [monthlyPrincipal, setMonthlyPrincipal] = useState<number>(150);
  const [monthlyInterest, setMonthlyInterest] = useState<number>(100);
  const [otherLoanPayment, setOtherLoanPayment] = useState<number>(50);

  const [dsr, setDsr] = useState<number | null>(null);

  const calculate = () => {
    if (annualIncome <= 0) return;
    const monthlyIncome = annualIncome / 12;
    const totalMonthly = monthlyPrincipal + monthlyInterest + otherLoanPayment;
    const result = (totalMonthly / monthlyIncome) * 100;
    setDsr(Math.round(result * 100) / 100);
  };

  const getDsrColor = (value: number) => {
    if (value < 30) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', label: isKo ? '양호' : 'Good' };
    if (value <= 40) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', label: isKo ? '주의' : 'Caution' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', label: isKo ? '위험' : 'Risk' };
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="annualIncome">{isKo ? '연소득 (만원)' : 'Annual Income (10K won)'}</Label>
        <Input
          id="annualIncome"
          type="number"
          value={annualIncome}
          onChange={(e) => setAnnualIncome(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="monthlyPrincipal">{isKo ? '월 원금상환액 (만원)' : 'Monthly Principal (10K won)'}</Label>
        <Input
          id="monthlyPrincipal"
          type="number"
          value={monthlyPrincipal}
          onChange={(e) => setMonthlyPrincipal(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="monthlyInterest">{isKo ? '월 이자상환액 (만원)' : 'Monthly Interest (10K won)'}</Label>
        <Input
          id="monthlyInterest"
          type="number"
          value={monthlyInterest}
          onChange={(e) => setMonthlyInterest(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="otherLoanPayment">{isKo ? '기타대출 월 상환액 (만원)' : 'Other Loan Monthly (10K won)'}</Label>
        <Input
          id="otherLoanPayment"
          type="number"
          value={otherLoanPayment}
          onChange={(e) => setOtherLoanPayment(Number(e.target.value))}
          className="text-right"
        />
      </div>
      <Button onClick={calculate} className="w-full">{d.common.calculate}</Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-5">
      {dsr !== null ? (
        <>
          <div className="text-center p-5 rounded-xl border-2" style={{ borderColor: getDsrColor(dsr).text.replace('text-', '').includes('green') ? '#22c55e' : dsr <= 40 ? '#eab308' : '#ef4444' }}>
            <p className="text-sm text-muted-foreground">{isKo ? 'DSR 비율' : 'DSR Ratio'}</p>
            <p className={`text-5xl font-extrabold mt-1 ${getDsrColor(dsr).text}`}>{dsr}%</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getDsrColor(dsr).bg} ${getDsrColor(dsr).text} ${getDsrColor(dsr).border} border`}>
              {getDsrColor(dsr).label}
            </span>
          </div>

          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">{isKo ? '항목' : 'Item'}</th>
                  <th className="px-4 py-2.5 text-right font-medium text-muted-foreground">{isKo ? '금액 (만원)' : 'Amount (10K won)'}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '월 원금상환' : 'Monthly Principal'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{monthlyPrincipal.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '월 이자상환' : 'Monthly Interest'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{monthlyInterest.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '기타대출 월 상환' : 'Other Loan Monthly'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{otherLoanPayment.toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border bg-muted/50 font-semibold">
                  <td className="px-4 py-2.5">{isKo ? '월 총 상환액' : 'Total Monthly Payment'}</td>
                  <td className="px-4 py-2.5 text-right">{(monthlyPrincipal + monthlyInterest + otherLoanPayment).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-border">
                  <td className="px-4 py-2.5 text-muted-foreground">{isKo ? '월 소득 (연소득/12)' : 'Monthly Income (Annual/12)'}</td>
                  <td className="px-4 py-2.5 text-right font-medium">{(annualIncome / 12).toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {dsr > 40 && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {isKo
                ? '⚠️ DSR 40%를 초과합니다. 총대출 1억원 이상인 경우 DSR 40% 규제가 적용되어 대출이 제한될 수 있습니다.'
                : '⚠️ DSR exceeds 40%. Loans may be restricted under the 40% DSR regulation when total loans exceed 100 million won.'}
            </div>
          )}
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
          <strong className="text-foreground">{isKo ? 'DSR(총부채원리금상환비율)' : 'DSR (Debt Service Ratio)'} </strong>
          {isKo
            ? '은 본인의 연 소득 대비 매년 갚아야 할 모든 대출의 원리금이 차지하는 비율을 말합니다. 쉽게 말해 소득에서 대출 상환에 쓰는 비중을 나타내는 지표입니다.'
            : ' is the ratio of all annual loan principal and interest repayments to your annual income. It indicates what portion of your income goes toward loan repayment.'}
        </p>
        <p>
          {isKo
            ? '금융위원회에서는 DSR 40% 규제를 시행하여, 총대출 1억원을 초과하는 모든 가계대출에 대해 DSR이 40%를 넘으면 대출을 제한하고 있습니다.'
            : 'The Financial Services Commission enforces a 40% DSR regulation, restricting loans when DSR exceeds 40% for all household loans exceeding 100 million won.'}
        </p>
        <p>
          {isKo
            ? '2018년 주택담보대출에 먼저 도입되었고, 2022년 1월부터 전체 가계대출(신용대출, 전세자금대출, 자동차대출 등)로 확대 적용되었습니다. 2024년 현재 총대출 1억원 이상인 모든 차입자에게 적용됩니다.'
            : 'Introduced for mortgages in 2018, expanded to all household loans (credit, jeonse, auto, etc.) from January 2022. As of 2024, it applies to all borrowers with total loans exceeding 100 million won.'}
        </p>
        <div className="mt-3 p-3 bg-muted rounded-lg">
          <p className="font-semibold text-foreground mb-1">{isKo ? 'DSR 40% 규제 요약' : 'DSR 40% Regulation Summary'}</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>{isKo ? '총대출 1억원 초과 시 전체 가계대출에 DSR 40% 적용' : 'Applies to all household loans when total loans exceed 100M won'}</li>
            <li>{isKo ? '2018년: 주택담보대출에 먼저 도입' : '2018: Initially introduced for mortgages'}</li>
            <li>{isKo ? '2022년 1월: 전체 가계대출로 확대' : '2022 Jan: Expanded to all household loans'}</li>
            <li>{isKo ? '2024년: 총대출 1억원 이상 모든 차입자에게 적용' : '2024: Applies to all borrowers with total loans over 100M won'}</li>
            <li>{isKo ? 'DSR 40% 이하여야 정상 대출 가능' : 'Must be under 40% DSR for normal loan approval'}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">DSR = (월 원금 + 월 이자 + 기타 대출 월 상환) / (연소득 / 12) × 100</strong>
        </div>
        <div className="font-mono p-4 bg-card border border-border rounded-lg text-sm">
          <strong className="text-primary">DSR = (Monthly Principal + Monthly Interest + Other Loan Monthly) / (Annual Income / 12) × 100</strong>
        </div>
        <p className="mt-3">
          {isKo
            ? '예시: 연소득 5,000만원, 월 원금 150만원, 월 이자 100만원, 기타 대출 50만원인 경우'
            : 'Example: Annual income 50M won, monthly principal 1.5M, monthly interest 1M, other loan 500K'}
        </p>
        <div className="font-mono p-3 bg-muted rounded-lg text-xs">
          {isKo
            ? 'DSR = (150 + 100 + 50) / (5000 / 12) × 100 = 300 / 416.67 × 100 = 72%'
            : 'DSR = (1.5 + 1.0 + 0.5) / (50 / 12) × 100 = 3.0 / 4.17 × 100 = 72%'}
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 text-sm text-muted-foreground">
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">1</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? 'DSR 줄이기 방법' : 'How to Reduce DSR'}</p>
            <p className="mt-1">{isKo ? '대출 기간을 연장하면 월 상환액이 줄어들어 DSR이 낮아집니다. 또한 기존 대출을 상환하면 DSR에 포함되지 않습니다.' : 'Extending loan term reduces monthly payments and lowers DSR. Repaying existing loans removes them from DSR calculation.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">2</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? 'DSR vs DTI 차이' : 'DSR vs DTI Difference'}</p>
            <p className="mt-1">{isKo ? 'DTI는 주택담보대출 원리금 + 기타 부채 이자만 포함하지만, DSR은 모든 대출의 원리금 상환액을 포함합니다. DSR이 더 포괄적입니다.' : 'DTI includes only mortgage P&I plus other debt interest, while DSR includes all loan principal & interest repayments. DSR is more comprehensive.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">3</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? '스트레스 DSR' : 'Stress DSR'}</p>
            <p className="mt-1">{isKo ? '실제 금리에 가산금리(보통 0.6~1.0%)를 더해 산정하므로, 실제 DSR보다 높게 나올 수 있습니다. 금리 인상 가능성을 반영한 것입니다.' : 'A surcharge rate (typically 0.6~1.0%) is added to the actual rate, so stress DSR may be higher than actual DSR. This reflects potential rate increases.'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">4</span>
          <div>
            <p className="font-semibold text-foreground">{isKo ? 'DSR 기준 대출 한도' : 'DSR-Based Loan Limit'}</p>
            <p className="mt-1">{isKo ? 'DSR 40% 기준으로 계산하면: 최대 월 상환액 = (연소득/12) × 0.4. 이를 현재 대출 상환액에서 빼면 추가 대출 가능한 금액을 알 수 있습니다.' : 'Based on 40% DSR: Max monthly payment = (Annual Income/12) × 0.4. Subtract current loan payments to find additional borrowing capacity.'}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? 'DSR 계산기' : 'DSR Calculator'}
      description={isKo ? '총부채원리금상환비율(DSR)을 계산합니다' : 'Calculate your Debt Service Ratio'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DsrCalculator;
