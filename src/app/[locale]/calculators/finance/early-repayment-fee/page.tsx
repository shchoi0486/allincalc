'use client';

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const EarlyRepaymentFeeCalculator: NextPage = () => {
  const { dict, locale } = useI18n();
  const t = dict.earlyRepaymentFee;
  const isKo = locale === 'ko';

  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(100000000)
  const [repaymentAmount, setRepaymentAmount] = useState<number>(50000000)
  const [loanStartDate, setLoanStartDate] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
  )
  const [repaymentDate, setRepaymentDate] = useState<Date | undefined>(new Date())
  const [loanTerm, setLoanTerm] = useState<number>(36)
  const [feeRate, setFeeRate] = useState<number>(1.2)
  const [displayedResult, setDisplayedResult] = useState<any>(null)

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setter(parseFloat(value.replace(/,/g, '')));
  };

  const { calculationResult, error } = useMemo(() => {
    const totalLoan = totalLoanAmount;
    const repayment = repaymentAmount;
    const term = loanTerm;
    const rate = feeRate;

    if (!loanStartDate || !repaymentDate) {
      return { calculationResult: null, error: t.exemptions.checkValues };
    }

    if (isNaN(totalLoan) || isNaN(repayment) || isNaN(term) || isNaN(rate)) {
      return { calculationResult: null, error: t.exemptions.checkValues };
    }

    const totalDays = term * 30;
    const elapsed = Math.floor(
      (repaymentDate.getTime() - loanStartDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const remaining = Math.max(0, totalDays - elapsed);

    if (remaining <= 0) {
      return {
        calculationResult: {
          fee: 0,
          remainingDays: 0,
          totalLoanDays: totalDays,
          elapsedDays: elapsed,
          feeDetails: {
            baseAmount: repayment,
            rate: rate,
            remainingRatio: 0,
            remainingMonths: 0,
            isExempt: true,
            exemptionReason: t.exemptions.maturityPassed,
          },
        },
        error: null
      };
    }

    if (elapsed >= 1095) {
      return {
        calculationResult: {
          fee: 0,
          remainingDays: remaining,
          totalLoanDays: totalDays,
          elapsedDays: elapsed,
          feeDetails: {
            baseAmount: repayment,
            rate: rate,
            remainingRatio: (remaining / totalDays) * 100,
            remainingMonths: Math.ceil(remaining / 30),
            isExempt: true,
            exemptionReason: t.exemptions.threeYears,
          },
        },
        error: null
      };
    }

    const calculatedFee = repayment * (rate / 100) * (remaining / totalDays);

    return {
      calculationResult: {
        fee: Math.round(calculatedFee),
        remainingDays: remaining,
        totalLoanDays: totalDays,
        elapsedDays: elapsed,
        feeDetails: {
          baseAmount: repayment,
          rate: rate,
          remainingRatio: (remaining / totalDays) * 100,
          remainingMonths: Math.ceil(remaining / 30),
          isExempt: false,
          exemptionReason: null,
        },
      },
      error: null
    };
  }, [totalLoanAmount, repaymentAmount, loanStartDate, repaymentDate, loanTerm, feeRate, t]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
      setDisplayedResult(null);
    } else if (calculationResult) {
      setDisplayedResult(calculationResult);
      if (calculationResult.feeDetails.isExempt) {
        toast.success(calculationResult.feeDetails.exemptionReason)
      } else {
        toast.success(t.exemptions.calculationComplete)
      }
    }
  }, [calculationResult, error, t]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalLoanAmount">{t.inputs.totalLoanAmount}</Label>
          <Input id="totalLoanAmount" value={totalLoanAmount.toLocaleString()} onChange={handleInputChange(setTotalLoanAmount)} placeholder="100,000,000" className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentAmount">{t.inputs.repaymentAmount}</Label>
          <Input id="repaymentAmount" value={repaymentAmount.toLocaleString()} onChange={handleInputChange(setRepaymentAmount)} placeholder="50,000,000" className="text-right" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanStartDate">{t.inputs.loanStartDate}</Label>
          <CustomDatePickerWithPopover date={loanStartDate} setDate={setLoanStartDate} placeholder={t.inputs.loanStartDate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentDate">{t.inputs.repaymentDate}</Label>
          <CustomDatePickerWithPopover date={repaymentDate} setDate={setRepaymentDate} placeholder={t.inputs.repaymentDate} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanTerm">{t.inputs.loanTerm}</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))} placeholder="36" className="text-right" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feeRate">{t.inputs.feeRate}</Label>
          <Input id="feeRate" value={feeRate} onChange={(e) => setFeeRate(parseFloat(e.target.value))} placeholder="1.2" className="text-right" type="number" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full">{dict.common.calculate}</Button>
    </div>
  );

  const resultSection = (
    <>
      {displayedResult ? (
        <div className="w-full space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">{t.results.expectedFee}</p>
            <p className="text-4xl font-bold text-primary">
              {displayedResult.fee.toLocaleString()}{isKo ? '원' : ' KRW'}
            </p>
            {displayedResult.feeDetails.isExempt && (
               <Badge variant="secondary" className="mt-2">{displayedResult.feeDetails.exemptionReason}</Badge>
            )}
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 text-center">{dict.calculatorLayout.description}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>{t.results.elapsed}: {displayedResult.elapsedDays.toLocaleString()}{isKo ? '일' : ' days'}</span>
                  <span>{t.results.remaining}: {displayedResult.remainingDays.toLocaleString()}{isKo ? '일' : ' days'}</span>
                </div>
                <Progress value={(displayedResult.elapsedDays / displayedResult.totalLoanDays) * 100} className="w-full" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{t.results.loanStart}</span>
                  <span>{t.results.maturity}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-center">{dict.calculatorLayout.result}</h3>
              <div className="text-left space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>{t.results.baseAmount}:</span>
                  <span className="font-mono">{displayedResult.feeDetails.baseAmount.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.results.appliedRate}:</span>
                  <span className="font-mono">{displayedResult.feeDetails.rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>{t.results.remainingRatio}:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingRatio.toFixed(2)}%</span>
                </div>
                 <div className="flex justify-between">
                  <span>{t.results.remainingMonths}:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingMonths}{isKo ? '개월' : ' months'}</span>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            {t.results.placeholder}
          </div>
        )}
      </>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? '중도상환수수료' : 'Early Repayment Fee', desc: isKo ? '약정된 대출 기간을 채우지 못하고 원금을 미리 갚을 때 금융기관에 내는 위약금 성격의 수수료입니다.' : 'A penalty-type fee charged by the lender when principal is repaid before the agreed loan term ends.' },
            { term: isKo ? '슬라이딩 방식' : 'Sliding Scale', desc: isKo ? '대출 만기와 가까워질수록 수수료 부담이 점차 줄어드는 계산 방식으로, 보통 실행 후 3년이 지나면 면제됩니다.' : 'A calculation method where the fee burden gradually decreases as the loan maturity approaches; usually waived after 3 years.' },
          ]} />
      </>
    ),
    calculationFormula: (
      <div dangerouslySetInnerHTML={{ __html: t.formulaContent }} />
    ),
    usefulTips: (
      <div dangerouslySetInnerHTML={{ __html: t.tipsContent }} />
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default EarlyRepaymentFeeCalculator;
