'use client';

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDatePicker, CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import { HelpCircle, FileText, PiggyBank } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const EarlyRepaymentFeeCalculator: NextPage = () => {
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
      return { calculationResult: null, error: "대출 시작일과 중도상환일을 모두 입력해주세요." };
    }

    if (isNaN(totalLoan) || isNaN(repayment) || isNaN(term) || isNaN(rate)) {
      return { calculationResult: null, error: "모든 숫자 필드를 올바르게 입력해주세요." };
    }

    const totalDays = term * 30; // 근사치
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
            exemptionReason: '대출 만기일이 경과했습니다.',
          },
        },
        error: null
      };
    }

    if (elapsed >= 1095) { // 3년(1095일) 이상 경과 시 면제
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
            exemptionReason: '대출 실행일로부터 3년이 경과하여 수수료가 면제됩니다.',
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
  }, [totalLoanAmount, repaymentAmount, loanStartDate, repaymentDate, loanTerm, feeRate]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error)
      setDisplayedResult(null);
    } else if (calculationResult) {
      setDisplayedResult(calculationResult);
      if (calculationResult.feeDetails.isExempt) {
        toast.success(calculationResult.feeDetails.exemptionReason)
      } else {
        toast.success('중도상환수수료 계산이 완료되었습니다.')
      }
    }
  }, [calculationResult, error]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="totalLoanAmount">총 대출금액 (원)</Label>
          <Input id="totalLoanAmount" value={totalLoanAmount.toLocaleString()} onChange={handleInputChange(setTotalLoanAmount)} placeholder="예: 100,000,000" className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentAmount">중도상환금액 (원)</Label>
          <Input id="repaymentAmount" value={repaymentAmount.toLocaleString()} onChange={handleInputChange(setRepaymentAmount)} placeholder="예: 50,000,000" className="text-right" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanStartDate">대출 시작일</Label>
          <CustomDatePickerWithPopover date={loanStartDate} setDate={setLoanStartDate} placeholder="대출 시작일 선택" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="repaymentDate">중도상환일</Label>
          <CustomDatePickerWithPopover date={repaymentDate} setDate={setRepaymentDate} placeholder="중도상환일 선택" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="loanTerm">총 대출기간 (개월)</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(parseFloat(e.target.value))} placeholder="예: 36" className="text-right" type="number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="feeRate">중도상환수수료율 (%)</Label>
          <Input id="feeRate" value={feeRate} onChange={(e) => setFeeRate(parseFloat(e.target.value))} placeholder="예: 1.2" className="text-right" type="number" />
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {displayedResult ? (
        <div className="w-full space-y-6">
          <div className="text-center">
            <p className="text-muted-foreground">예상 중도상환수수료</p>
            <p className="text-4xl font-bold text-primary">
              {displayedResult.fee.toLocaleString()}원
            </p>
            {displayedResult.feeDetails.isExempt && (
               <Badge variant="secondary" className="mt-2">{displayedResult.feeDetails.exemptionReason}</Badge>
            )}
          </div>
          
          <Separator />

          <div>
            <h3 className="text-lg font-semibold mb-3 text-center">대출 진행 상황</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>경과일: {displayedResult.elapsedDays.toLocaleString()}일</span>
                  <span>잔여일: {displayedResult.remainingDays.toLocaleString()}일</span>
                </div>
                <Progress value={(displayedResult.elapsedDays / displayedResult.totalLoanDays) * 100} className="w-full" />
                 <div className="flex justify-between text-xs text-muted-foreground">
                  <span>대출 시작</span>
                  <span>만기</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-3 text-center">상세 계산 내역</h3>
              <ul className="text-left space-y-2 text-sm text-muted-foreground">
                <li className="flex justify-between">
                  <span>중도상환원금:</span>
                  <span className="font-mono">{displayedResult.feeDetails.baseAmount.toLocaleString()}원</span>
                </li>
                <li className="flex justify-between">
                  <span>적용 수수료율:</span>
                  <span className="font-mono">{displayedResult.feeDetails.rate}%</span>
                </li>
                <li className="flex justify-between">
                  <span>잔존기간 비율:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingRatio.toFixed(2)}%</span>
                </li>
                 <li className="flex justify-between">
                  <span>남은 개월 수:</span>
                  <span className="font-mono">{displayedResult.feeDetails.remainingMonths}개월</span>
                </li>
              </ul>
            </div>

          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            계산하기 버튼을 눌러주세요
          </div>
        )}
      </>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">중도상환수수료 계산기: ‘아는’ 당신을 위한 현명한 대출 관리 전략</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          목돈이 생겨 대출금을 미리 갚아 이자 부담을 덜어내려는 순간, '중도상환수수료'라는 예상치 못한 지출과 마주할 수 있습니다. 중도상환수수료(또는 조기상환수수료)는 금융기관과의 약속된 대출 기간을 채우지 못하고 원금을 미리 상환할 때 발생하는 일종의 위약금입니다. 이는 단순히 '벌금'의 개념을 넘어, 금융 시스템의 안정성을 유지하는 중요한 장치이기도 합니다.
        </p>
        <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-green-500">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">🏦 왜 수수료를 내야 할까요? 은행의 속사정</h3>
          <p>
            은행과 같은 금융기관은 고객의 대출 기간 동안 발생할 이자 수익을 예측하고, 이를 바탕으로 자금을 조달하고 운용하는 복잡한 계획을 세웁니다. 하지만 고객이 예상보다 일찍 대출금을 상환하면, 계획했던 이자 수익을 얻지 못할 뿐만 아니라 갑자기 들어온 목돈을 즉시 효율적인 곳에 재투자하기 어렵습니다. 이 과정에서 발생하는 기회비용과 행정적 비용을 보전하고, 고객과의 약속을 지키도록 유도하기 위해 중도상환수수료가 존재합니다.
          </p>
        </div>
        <p className="mt-8 text-base leading-relaxed">
          일반적으로 대출 실행일로부터 <strong>3년 이내</strong>에 원금을 상환할 경우 수수료가 부과되며, 수수료율은 금융기관, 대출 상품, 약정 조건에 따라 0.5%에서 1.5%까지 다양하게 적용됩니다. 변동금리 대출이 고정금리 대출보다 수수료율이 낮은 경향이 있으며, 최근에는 인터넷 은행을 중심으로 중도상환수수료 면제 상품도 등장하고 있습니다.
        </p>
        <p className="mt-4 text-base leading-relaxed">
          <strong>All-in-Calc의 중도상환수수료 계산기</strong>는 이러한 복잡한 조건 속에서 당신의 현명한 의사결정을 돕는 강력한 도구입니다. 단순히 수수료를 계산하는 것을 넘어, 상환 시점에 따른 유불리를 따져보고, 불필요한 지출을 막는 최적의 재무 전략을 세울 수 있도록 든든한 가이드가 되어줄 것입니다.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">🧮 중도상환수수료, 어떻게 계산될까요? (슬라이딩 방식 파헤치기)</h2>
        <p className="text-base leading-relaxed mb-6">
          현재 국내 대부분의 금융기관은 시간이 지남에 따라 수수료 부담이 점차 줄어드는 <strong>'슬라이딩(Sliding) 방식'</strong> 또는 <strong>'일할 계산 방식'</strong>을 사용합니다. 대출 만기가 많이 남았을수록 높은 수수료를, 만기에 가까워질수록 낮은 수수료를 내는 합리적인 구조입니다. 핵심 계산 공식은 다음과 같습니다.
        </p>
        <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-inner">
          <p className="font-mono text-xl tracking-tighter"><strong>예상 수수료 = 중도상환원금 × 수수료율 × (수수료 부과 잔여일수 ÷ 수수료 부과 기간)</strong></p>
        </div>
        <div className="mt-8 space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">① 중도상환원금</h4>
            <p className="mt-2 text-base leading-relaxed">만기 전에 미리 갚으려는 대출 원금을 의미합니다. 갚으려는 금액이 클수록 당연히 수수료도 함께 증가합니다.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">② 중도상환수수료율</h4>
            <p className="mt-2 text-base leading-relaxed">대출 약정 시 정해진 비율로, 보통 연 단위(%)로 표시됩니다. 일반적으로 1.0% ~ 1.4% 사이에서 책정되는 경우가 많습니다. 이자율과 마찬가지로, 이 수수료율은 대출 상품의 중요한 조건 중 하나입니다.</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300">③ 잔여기간 / 부과기간 (슬라이딩 방식의 핵심)</h4>
            <p className="mt-2 text-base leading-relaxed">이 부분이 가장 헷갈리기 쉬운 부분입니다. 실제 총 대출 기간(예: 30년)과 상관없이, 수수료가 부과되는 기간은 보통 <strong>'3년(1,095일)'</strong>으로 한정됩니다. 즉, 대출받은 지 3년이 지나면 중도상환수수료는 0원이 됩니다. 계산기에 사용되는 '잔여기간'은 바로 이 3년 중에서 남은 기간을 의미합니다.</p>
          </div>
        </div>
        <div className="mt-8 p-6 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800/50 rounded-r-lg">
          <h4 className="font-bold text-lg mb-3">💡 실제 계산 예시로 이해하기</h4>
          <p className="text-base">
            - 총 대출금: 3억 원 (30년 만기 주택담보대출)<br />
            - 중도상환수수료율: 1.2%<br />
            - 상환 시점: 대출 실행 후 정확히 1년 6개월 (548일) 뒤<br />
            - 상환 희망 원금: 5,000만 원
          </p>
          <p className="mt-4 font-mono bg-white dark:bg-gray-700 p-4 rounded-md text-sm">
            <strong>1. 수수료 부과 잔여일수 계산:</strong><br/>
            1,095일 (총 부과 기간 3년) - 548일 (경과일) = 547일<br/><br/>
            <strong>2. 최종 수수료 계산:</strong><br/>
            50,000,000원 × 1.2% × (547일 ÷ 1,095일)<br/>
            = 50,000,000원 × 0.012 × 0.4995...<br/>
            = <strong>약 299,726원</strong>
          </p>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">✨ 중도상환수수료, 아는 만큼 아낀다! (7가지 절약 꿀팁)</h2>
        <div className="space-y-8">
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">1. '3년의 마법'을 기억하세요.</h4>
            <p className="mt-2 text-base">
              가장 기본적이면서도 확실한 방법입니다. 대부분의 금융상품은 대출 실행일로부터 3년이 지나면 중도상환수수료가 완전히 면제됩니다. 여유 자금이 생겼더라도 상환 시점이 3년 만기일에 가깝다면, 조금 기다렸다가 상환하는 것이 수수료를 한 푼도 내지 않는 가장 확실한 방법입니다. 달력에 대출 만기 3년이 되는 날을 표시해두는 것도 좋은 습관입니다.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">2. '부분 상환 면제' 조건을 적극 활용하세요.</h4>
            <p className="mt-2 text-base">
              많은 은행에서 1년에 한 번, 대출 원금의 10% 이내에서 중도상환수수료 없이 원금을 갚을 수 있는 '부분 상환 면제' 제도를 운영합니다. 예를 들어 3억 대출이라면 매년 3천만 원까지는 수수료 없이 갚을 수 있습니다. 매년 이 한도를 잘 활용하면 부담 없이 원금을 줄여나가고 총 이자를 아낄 수 있습니다. 대출 약정서나 은행 앱, 고객센터를 통해 내 대출의 면제 조건이 있는지 반드시 확인해보세요.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">3. 대환대출, '이자 절감액' vs '수수료' 꼼꼼히 비교는 필수!</h4>
            <p className="mt-2 text-base">
              더 낮은 금리의 대출로 갈아타기(대환대출) 위해 중도상환을 고민 중이라면, 감정적으로 결정해서는 안 됩니다. '앞으로 아낄 총 이자'와 '당장 내야 할 중도상환수수료 + 대환대출에 필요한 부대비용(인지세 등)'을 반드시 비교해야 합니다. 배보다 배꼽이 더 클 수 있기 때문이죠. 본 계산기를 통해 수수료를 확인하고, 대출 이자 계산기를 함께 사용해 총 이자 절감액을 시뮬레이션해보는 것이 현명합니다.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">4. 2025년부터 달라지는 점도 주목하세요. (소비자 친화적 변화)</h4>
            <p className="mt-2 text-base">
              금융당국은 가계의 금융 부담을 덜어주기 위해 중도상환수수료 체계를 지속적으로 개선하고 있습니다. 2025년부터는 은행들이 수수료 산정 시 실제 자금 운용 차질에 따른 손실, 행정 비용 등 실질적인 비용만을 합리적으로 반영하도록 유도하고 있습니다. 이에 따라 전반적인 수수료 부담이 줄어들 것으로 기대되며, 특히 온라인/비대면 대출의 경우 비용 절감 효과가 더 크게 나타날 수 있습니다.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">5. 수수료 면제 대상인지 확인해보세요.</h4>
            <p className="mt-2 text-base">
              특정 조건에서는 중도상환수수료가 면제될 수 있습니다. 대표적으로 채무자의 사망, 천재지변, 담보주택의 수용 등으로 대출 상환이 불가피한 경우입니다. 또한, 일부 정책금융상품(디딤돌대출, 보금자리론 등)은 특정 소득/자산 기준을 충족하면 수수료가 감면되거나 면제될 수 있으니, 본인의 대출 상품 종류를 확인하는 것이 중요합니다.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">6. 금리 인상기에는 더 신중한 접근이 필요합니다.</h4>
            <p className="mt-2 text-base">
              금리가 계속 오르는 시기에는 변동금리 대출의 이자 부담이 커지므로, 수수료를 내더라도 고정금리로 대환하거나 원금을 상환하는 것이 유리할 수 있습니다. 반대로 금리 하락기에는 서둘러 상환하기보다, 더 낮은 금리의 상품으로 갈아탈 기회를 엿보는 것이 현명한 전략일 수 있습니다. 거시 경제의 흐름을 함께 고려하여 상환 계획을 세우는 지혜가 필요합니다.
            </p>
          </div>
          <div className="p-4 rounded-md bg-gray-50 dark:bg-gray-800">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">7. 가장 정확한 정보는 '대출 약정서'에 있습니다.</h4>
            <p className="mt-2 text-base">
              본 계산기는 가장 일반적인 슬라이딩 방식을 기준으로 하지만, 세상에 완전히 똑같은 대출 상품은 없습니다. 실제 적용되는 수수료율, 계산 방식, 면제 조건, 특약 등 가장 정확하고 법적 효력이 있는 정보는 고객님이 서명한 <strong>'대출 약정서'</strong>에 담겨 있습니다. 상환 실행 전, 반드시 약정서를 다시 한번 확인하고, 궁금한 점은 해당 금융기관에 직접 문의하는 습관을 들이는 것이 불필요한 분쟁과 손해를 막는 가장 확실한 길입니다.
            </p>
          </div>
        </div>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="중도상환수수료 계산기"
      description="대출금 중도상환 시 발생할 수 있는 수수료를 미리 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default EarlyRepaymentFeeCalculator;