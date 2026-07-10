'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

const VatCalculator = () => {
  const [totalAmount, setTotalAmount] = useState<number>(0)
  const [supplyAmount, setSupplyAmount] = useState<number>(0)
  const [calculationType, setCalculationType] = useState<'totalAmount' | 'supplyAmount'>('totalAmount')

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanedValue = e.target.value.replace(/[^0-9.]/g, '');
    const numericValue = cleanedValue ? parseFloat(cleanedValue) : 0;
    setter(isNaN(numericValue) ? 0 : numericValue);
  };

  const handleReset = () => {
    setTotalAmount(0);
    setSupplyAmount(0);
    setCalculationType('totalAmount');
  };

  const { calculatedSupplyAmount, calculatedVatAmount, calculatedTotalAmount } = useMemo(() => {
    let supply = 0;
    let vat = 0;
    let total = 0;

    if (calculationType === 'totalAmount') {
      // const parsedTotal = parseNumber(totalAmount);
      if (!isNaN(totalAmount) && totalAmount > 0) {
        total = totalAmount;
        supply = Math.round(total / 1.1);
        vat = total - supply;
      }
    } else {
      // const parsedSupply = parseNumber(supplyAmount);
      if (!isNaN(supplyAmount) && supplyAmount > 0) {
        supply = supplyAmount;
        vat = Math.round(supply * 0.1);
        total = supply + vat;
      }
    }

    return {
      calculatedSupplyAmount: supply.toLocaleString(),
      calculatedVatAmount: vat.toLocaleString(),
      calculatedTotalAmount: total.toLocaleString(),
    };
  }, [totalAmount, supplyAmount, calculationType]);

  const inputSection = (
    <div className="space-y-4">
      <RadioGroup
        defaultValue="totalAmount"
        value={calculationType}
        onValueChange={(value: 'totalAmount' | 'supplyAmount') => {
          setCalculationType(value);
          handleReset(); // 계산 방식 변경 시 초기화
        }}
        className="grid grid-cols-2 gap-4"
      >
        <Label
          htmlFor="totalAmountRadio"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupItem id="totalAmountRadio" value="totalAmount" className="sr-only" />
          <span>합계금액으로 계산</span>
        </Label>
        <Label
          htmlFor="supplyAmountRadio"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupItem id="supplyAmountRadio" value="supplyAmount" className="sr-only" />
          <span>공급가액으로 계산</span>
        </Label>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="totalAmountInput">합계금액 (원)</Label>
        <Input
          id="totalAmountInput"
          value={totalAmount.toLocaleString()}
          onChange={handleInputChange(setTotalAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="합계금액 입력"
          disabled={calculationType !== 'totalAmount'}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplyAmountInput">공급가액 (원)</Label>
        <Input
          id="supplyAmountInput"
          value={supplyAmount.toLocaleString()}
          onChange={handleInputChange(setSupplyAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="공급가액 입력"
          disabled={calculationType !== 'supplyAmount'}
        />
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        초기화
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>공급가액:</span>
        <span>{calculatedSupplyAmount} 원</span>
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>부가세:</span>
        <span>{calculatedVatAmount} 원</span>
      </div>
      <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
        <span>합계금액:</span>
        <span>{calculatedTotalAmount} 원</span>
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold">우리가 매일 만나는 세금, 부가가치세(VAT)의 모든 것</p>
        <p>부가가치세(Value Added Tax)는 상품을 사거나 서비스를 이용할 때 가격에 포함되어 있는 세금입니다. 최종 소비자가 부담하지만, 실제로는 물건을 판매하거나 서비스를 제공하는 사업자가 잠시 보관했다가 국가에 대신 납부하는 간접세의 한 종류입니다. 마치 가게 주인이 손님에게 받은 돈의 일부를 세금 상자에 잠시 넣어두었다가 정해진 날에 한 번에 내는 것과 같습니다.</p>
        <p>이 계산기는 사업자들이 거래 금액 속 숨어있는 부가세를 정확히 계산하고 분리해내는 데 도움을 줍니다. 합계 금액(공급대가)만 알 때 공급가액과 부가세를 계산하거나, 반대로 공급가액을 기준으로 부가세와 합계 금액을 계산하는 두 가지 방식을 모두 지원하여, 견적서 작성, 장부 기장, 세금 신고 등 다양한 실무 상황에서 혼동을 줄여줍니다.</p>
        <p>특히 개인사업자, 프리랜서, 소규모 법인 등 세무 관리에 어려움을 겪는 분들에게 유용한 도구입니다. 정확한 부가세 계산은 현금 흐름을 예측하고, 불필요한 가산세를 피하는 첫걸음입니다.</p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h3 className="text-xl font-bold">부가세 계산, 원리만 알면 간단합니다</h3>
        <p>대한민국의 부가가치세율은 기본적으로 <strong>10%</strong>입니다. 계산의 핵심은 이 10%를 어디에 곱하느냐에 있습니다.</p>
        <div className="border-l-4 border-blue-500 pl-4 mt-4">
          <p><strong>용어 정리:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>공급가액:</strong> 부가세가 포함되지 않은 순수한 상품이나 서비스의 가격입니다.</li>
            <li><strong>부가세 (매출세액):</strong> 공급가액의 10%에 해당하는 금액입니다. <code>공급가액 × 0.1</code></li>
            <li><strong>합계금액 (공급대가):</strong> 소비자가 최종적으로 지불하는 금액으로, 공급가액과 부가세가 합쳐진 금액입니다. <code>공급가액 + 부가세</code> 또는 <code>공급가액 × 1.1</code></li>
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">1. 공급가액으로 계산할 때</h4>
          <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded">- 부가세 = <code>공급가액 × 0.1</code></p>
          <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded">- 합계금액 = <code>공급가액 + 부가세</code></p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">2. 합계금액으로 계산할 때</h4>
          <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded">- 공급가액 = <code>합계금액 ÷ 1.1</code> (소수점 이하는 일반적으로 버림 또는 반올림 처리)</p>
          <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded">- 부가세 = <code>합계금액 - 공급가액</code></p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">합계 금액에 이미 10%의 부가세가 포함되어 있으므로, 1.1로 나누어 부가세가 포함되기 전의 원래 가격(공급가액)을 구하는 원리입니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">1. 부가세 신고 및 납부, 언제까지 해야 할까? (2025년 기준)</h4>
          <p>부가세 신고는 사업자 유형에 따라 다릅니다. 미리 달력에 표시해두고 기한을 놓치지 않도록 주의해야 합니다.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>법인사업자:</strong> 1년에 4번, 분기별로 신고 및 납부합니다. (4월 25일, 7월 25일, 10월 25일, 다음 해 1월 25일)</li>
            <li><strong>개인사업자 (일반과세자):</strong> 1년에 2번, 반기별로 신고 및 납부합니다. (7월 25일, 다음 해 1월 25일)</li>
            <li><strong>개인사업자 (간이과세자):</strong> 1년에 1번, 다음 해 1월 25일에 신고 및 납부합니다.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">2. 가장 중요한 증빙, '세금계산서'와 '현금영수증'</h4>
          <p>사업을 위해 지출한 비용에 포함된 부가세(매입세액)는 내가 내야 할 부가세(매출세액)에서 공제받을 수 있습니다. 이를 '매입세액공제'라고 하며, 절세의 가장 기본입니다. 공제를 받으려면 반드시 '세금계산서', '계산서', '신용카드 매출전표', '현금영수증' 등 적격 증빙을 받아야 합니다. 거래 상대방이 사업자라면 반드시 세금계산서 발급을 요청하는 습관을 들여야 합니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">3. 나는 일반과세자? 간이과세자?</h4>
          <p>신규 사업자나 연 매출액이 일정 기준(일반적으로 8,000만원) 미만인 개인사업자는 '간이과세자'로 등록할 수 있습니다. 간이과세자는 일반과세자보다 낮은 세율과 간편한 신고 절차가 적용되지만, 매입세액공제를 일부만 받을 수 있고 세금계산서 발급이 제한되는 등 단점도 있습니다. 자신의 업종과 예상 매출 규모를 고려하여 유리한 유형을 선택하는 것이 중요합니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">4. 부가세가 없는 거래도 있다? (면세와 영세율)</h4>
          <p>모든 거래에 부가세가 붙는 것은 아닙니다. 국민 생활에 필수적인 기초 생활필수품(농·축·수산물, 도서, 교육 용역 등)에는 부가세가 면제됩니다. 이를 '면세'라고 합니다. 또한, 수출하는 재화나 용역에는 0%의 세율을 적용하는데, 이를 '영세율'이라고 합니다. 영세율은 매입세액공제를 전액 환급받을 수 있다는 점에서 면세와 차이가 있습니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">5. 홈택스를 이용한 셀프 신고 활용하기</h4>
          <p>국세청 홈택스(Hometax) 시스템은 부가세 신고에 필요한 대부분의 자료(전자세금계산서, 신용카드 사용 내역 등)를 자동으로 수집하여 제공합니다. 거래 건수가 많지 않은 소규모 사업자라면 세무 대리인 없이도 충분히 직접 신고가 가능합니다. 신고 기간에 홈택스에서 제공하는 '신고도움서비스'를 꼼꼼히 읽어보면 큰 도움이 됩니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="부가가치세 계산기"
      description="합계금액 또는 공급가액을 입력하여 부가가치세를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default VatCalculator