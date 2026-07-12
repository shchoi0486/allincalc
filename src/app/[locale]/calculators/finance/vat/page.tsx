'use client'

import React, { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

// import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

const VatCalculator = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
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
          <span>{isKo ? '합계금액으로 계산' : 'Calculate from Total'}</span>
        </Label>
        <Label
          htmlFor="supplyAmountRadio"
          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
        >
          <RadioGroupItem id="supplyAmountRadio" value="supplyAmount" className="sr-only" />
          <span>{isKo ? '공급가액으로 계산' : 'Calculate from Supply'}</span>
        </Label>
      </RadioGroup>

      <div className="space-y-2">
        <Label htmlFor="totalAmountInput">{isKo ? '합계금액 (원)' : 'Total Amount (KRW)'}</Label>
        <Input
          id="totalAmountInput"
          value={totalAmount.toLocaleString()}
          onChange={handleInputChange(setTotalAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder={isKo ? '합계금액 입력' : 'Enter total amount'}
          disabled={calculationType !== 'totalAmount'}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="supplyAmountInput">{isKo ? '공급가액 (원)' : 'Supply Amount (KRW)'}</Label>
        <Input
          id="supplyAmountInput"
          value={supplyAmount.toLocaleString()}
          onChange={handleInputChange(setSupplyAmount)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder={isKo ? '공급가액 입력' : 'Enter supply amount'}
          disabled={calculationType !== 'supplyAmount'}
        />
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        {isKo ? '초기화' : 'Reset'}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>{isKo ? '공급가액:' : 'Supply Amount:'}</span>
        <span>{calculatedSupplyAmount}{isKo ? '원' : ' KRW'}</span>
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>{isKo ? '부가세:' : 'VAT:'}</span>
        <span>{calculatedVatAmount}{isKo ? '원' : ' KRW'}</span>
      </div>
      <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
        <span>{isKo ? '합계금액:' : 'Total Amount:'}</span>
        <span>{calculatedTotalAmount}{isKo ? '원' : ' KRW'}</span>
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold">{isKo ? '우리가 매일 만나는 세금, 부가가치세(VAT)의 모든 것' : 'Everything About VAT, the Tax We Meet Every Day'}</p>
        <p>{isKo ? '부가가치세(Value Added Tax)는 상품을 사거나 서비스를 이용할 때 가격에 포함되어 있는 세금입니다. 최종 소비자가 부담하지만, 실제로는 물건을 판매하거나 서비스를 제공하는 사업자가 잠시 보관했다가 국가에 대신 납부하는 간접세의 한 종류입니다. 마치 가게 주인이 손님에게 받은 돈의 일부를 세금 상자에 잠시 넣어두었다가 정해진 날에 한 번에 내는 것과 같습니다.' : 'Value Added Tax (VAT) is a tax included in the price when buying goods or using services. The final consumer bears it, but in practice the business selling goods or providing services temporarily holds it and pays it to the state on behalf of the consumer—a type of indirect tax. It is like a shop owner putting part of the money received from a customer into a tax box and paying it all at once on the set date.'}</p>
        <p>{isKo ? '이 계산기는 사업자들이 거래 금액 속 숨어있는 부가세를 정확히 계산하고 분리해내는 데 도움을 줍니다. 합계 금액(공급대가)만 알 때 공급가액과 부가세를 계산하거나, 반대로 공급가액을 기준으로 부가세와 합계 금액을 계산하는 두 가지 방식을 모두 지원하여, 견적서 작성, 장부 기장, 세금 신고 등 다양한 실무 상황에서 혼동을 줄여줍니다.' : 'This calculator helps businesses accurately compute and separate the hidden VAT in transaction amounts. It supports both ways: computing supply amount and VAT when only the total (consideration) is known, and computing VAT and total from the supply amount—reducing confusion in quotes, bookkeeping, and tax filing.'}</p>
        <p>{isKo ? '특히 개인사업자, 프리랜서, 소규모 법인 등 세무 관리에 어려움을 겪는 분들에게 유용한 도구입니다. 정확한 부가세 계산은 현금 흐름을 예측하고, 불필요한 가산세를 피하는 첫걸음입니다.' : 'It is especially useful for sole proprietors, freelancers, and small corporations who struggle with tax management. Accurate VAT calculation is the first step to forecasting cash flow and avoiding unnecessary penalties.'}</p>        <TermGlossary items={[
          { term: isKo ? '부가가치세 (VAT)' : 'Value Added Tax (VAT)', desc: isKo ? '재화·용역의 거래 단계에서 발생한 부가가치를 과세표준으로 하여 최종 소비자가 부담하는 간접세입니다. 기본 세율은 10%입니다.' : 'An indirect tax borne by the final consumer, with the value added at each trade stage of goods/services as the tax base. The basic rate is 10%.' },
          { term: isKo ? '공급가액' : 'Supply Amount', desc: isKo ? '부가세가 포함되지 않은 순수한 재화나 용역의 가격으로, 공급가액에 10%를 더한 금액이 최종 합계금액이 됩니다.' : 'The price of pure goods or services excluding VAT; the supply amount plus 10% becomes the final total.' },
          { term: isKo ? '매입세액공제' : 'Input Tax Credit', desc: isKo ? '사업을 위해 지출한 비용에 포함된 부가세(매입세액)를 내가 내야 할 부가세(매출세액)에서 공제받는 제도입니다.' : 'A system that deducts the VAT included in business expenses (input tax) from the VAT you must pay (output tax).' },
        ]} />

      </div>
    ),
    calculationFormula: (
      <div className="space-y-4 p-4 bg-muted rounded-md">
        <h3 className="text-xl font-bold">{isKo ? '부가세 계산, 원리만 알면 간단합니다' : 'VAT Calculation Is Simple Once You Know the Principle'}</h3>
        <p>{isKo ? '대한민국의 부가가치세율은 기본적으로 ' : "Korea's VAT rate is basically "}<strong>10%</strong>{isKo ? '입니다. 계산의 핵심은 이 10%를 어디에 곱하느냐에 있습니다.' : '. The key is what you multiply this 10% by.'}</p>
        <div className="border-l-4 border-primary pl-4 mt-4">
          <p><strong>{isKo ? '용어 정리:' : 'Terminology:'}</strong></p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>{isKo ? <><strong>공급가액:</strong> 부가세가 포함되지 않은 순수한 상품이나 서비스의 가격입니다.</> : <><strong>Supply Amount:</strong> The price of pure goods or services excluding VAT.</>}</li>
            <li>{isKo ? <><strong>부가세 (매출세액):</strong> 공급가액의 10%에 해당하는 금액입니다. <code>공급가액 × 0.1</code></> : <><strong>VAT (Output Tax):</strong> The amount equal to 10% of the supply amount. <code>Supply × 0.1</code></>}</li>
            <li>{isKo ? <><strong>합계금액 (공급대가):</strong> 소비자가 최종적으로 지불하는 금액으로, 공급가액과 부가세가 합쳐진 금액입니다. <code>공급가액 + 부가세</code> 또는 <code>공급가액 × 1.1</code></> : <><strong>Total Amount (Consideration):</strong> The amount the consumer finally pays, combining supply amount and VAT. <code>Supply + VAT</code> or <code>Supply × 1.1</code></>}</li>
          </ul>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">{isKo ? '1. 공급가액으로 계산할 때' : '1. When calculating from supply amount'}</h4>
          <p className="pl-4 mt-1 bg-card p-2 rounded">{isKo ? '- 부가세 = ' : '- VAT = '}<code>공급가액 × 0.1</code></p>
          <p className="pl-4 mt-1 bg-card p-2 rounded">{isKo ? '- 합계금액 = ' : '- Total = '}<code>공급가액 + 부가세</code></p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">{isKo ? '2. 합계금액으로 계산할 때' : '2. When calculating from total amount'}</h4>
          <p className="pl-4 mt-1 bg-card p-2 rounded">{isKo ? '- 공급가액 = ' : '- Supply = '}<code>합계금액 ÷ 1.1</code> {isKo ? '(소수점 이하는 일반적으로 버림 또는 반올림 처리)' : '(decimals are usually truncated or rounded)'}</p>
          <p className="pl-4 mt-1 bg-card p-2 rounded">{isKo ? '- 부가세 = ' : '- VAT = '}<code>합계금액 - 공급가액</code></p>
          <p className="text-sm text-muted-foreground mt-1">{isKo ? '합계 금액에 이미 10%의 부가세가 포함되어 있으므로, 1.1로 나누어 부가세가 포함되기 전의 원래 가격(공급가액)을 구하는 원리입니다.' : 'Since the total already includes 10% VAT, dividing by 1.1 recovers the original price (supply amount) before VAT.'}</p>
          <div className="mt-4 p-4 bg-card rounded-md border border-border">
            <h4 className="font-semibold text-foreground mb-2">{isKo ? '계산 예시' : 'Calculation Example'}</h4>
            <p className="text-sm text-muted-foreground">{isKo ? '공급가액 100,000원인 경우' : 'When the supply amount is 100,000 KRW'}</p>
            <p className="font-mono text-sm text-primary mt-1">{isKo ? '부가세 = 100,000 × 0.1 = 10,000원' : 'VAT = 100,000 × 0.1 = 10,000 KRW'}</p>
            <p className="font-mono text-sm text-primary">{isKo ? '합계금액 = 100,000 + 10,000 = 110,000원' : 'Total = 100,000 + 10,000 = 110,000 KRW'}</p>
            <p className="text-sm text-muted-foreground mt-2">{isKo ? '합계금액 110,000원만 아는 경우' : 'When only the total 110,000 KRW is known'}</p>
            <p className="font-mono text-sm text-primary">{isKo ? '공급가액 = 110,000 ÷ 1.1 = 100,000원, 부가세 = 10,000원' : 'Supply = 110,000 ÷ 1.1 = 100,000 KRW, VAT = 10,000 KRW'}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">{isKo ? '1. 부가세 신고 및 납부, 언제까지 해야 할까? (2025년 기준)' : '1. VAT Filing & Payment Deadlines (as of 2025)'}</h4>
          <p>{isKo ? '부가세 신고는 사업자 유형에 따라 다릅니다. 미리 달력에 표시해두고 기한을 놓치지 않도록 주의해야 합니다.' : 'VAT filing varies by business type. Mark the calendar in advance and take care not to miss the deadline.'}</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{isKo ? <><strong>법인사업자:</strong> 1년에 4번, 분기별로 신고 및 납부합니다. (4월 25일, 7월 25일, 10월 25일, 다음 해 1월 25일)</> : <><strong>Corporations:</strong> 4 times a year, quarterly (Apr 25, Jul 25, Oct 25, next-year Jan 25).</>}</li>
            <li>{isKo ? <><strong>개인사업자 (일반과세자):</strong> 1년에 2번, 반기별로 신고 및 납부합니다. (7월 25일, 다음 해 1월 25일)</> : <><strong>Sole proprietors (general):</strong> 2 times a year, semi-annually (Jul 25, next-year Jan 25).</>}</li>
            <li>{isKo ? <><strong>개인사업자 (간이과세자):</strong> 1년에 1번, 다음 해 1월 25일에 신고 및 납부합니다.</> : <><strong>Sole proprietors (simplified):</strong> Once a year, on next-year Jan 25.</>}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">{isKo ? "2. 가장 중요한 증빙, '세금계산서'와 '현금영수증'" : "2. The Most Important Evidence: 'Tax Invoice' and 'Cash Receipt'"}</h4>
          <p>{isKo ? "사업을 위해 지출한 비용에 포함된 부가세(매입세액)는 내가 내야 할 부가세(매출세액)에서 공제받을 수 있습니다. 이를 '매입세액공제'라고 하며, 절세의 가장 기본입니다. 공제를 받으려면 반드시 '세금계산서', '계산서', '신용카드 매출전표', '현금영수증' 등 적격 증빙을 받아야 합니다. 거래 상대방이 사업자라면 반드시 세금계산서 발급을 요청하는 습관을 들여야 합니다." : "The VAT included in business expenses (input tax) can be deducted from the VAT you must pay (output tax). This is the 'input tax credit,' the most basic tax saving. To get the credit, you must obtain qualifying evidence such as a 'tax invoice,' 'statement,' 'credit card sales slip,' or 'cash receipt.' If the counterparty is a business, always make a habit of requesting a tax invoice."}</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">{isKo ? '3. 나는 일반과세자? 간이과세자?' : '3. Am I a General or Simplified Taxpayer?'}</h4>
          <p>{isKo ? "신규 사업자나 연 매출액이 일정 기준(일반적으로 8,000만원) 미만인 개인사업자는 '간이과세자'로 등록할 수 있습니다. 간이과세자는 일반과세자보다 낮은 세율과 간편한 신고 절차가 적용되지만, 매입세액공제를 일부만 받을 수 있고 세금계산서 발급이 제한되는 등 단점도 있습니다. 자신의 업종과 예상 매출 규모를 고려하여 유리한 유형을 선택하는 것이 중요합니다." : "A new business or a sole proprietor with annual sales below a threshold (generally 80M) can register as a 'simplified taxpayer.' Simplified taxpayers get a lower rate and easier filing, but receive only partial input tax credit and face restricted tax-invoice issuance. Choose the type advantageous to you considering your industry and expected sales."}</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">{isKo ? '4. 부가세가 없는 거래도 있다? (면세와 영세율)' : '4. Some Transactions Have No VAT? (Exempt vs Zero-rated)'}</h4>
          <p>{isKo ? "모든 거래에 부가세가 붙는 것은 아닙니다. 국민 생활에 필수적인 기초 생활필수품(농·축·수산물, 도서, 교육 용역 등)에는 부가세가 면제됩니다. 이를 '면세'라고 합니다. 또한, 수출하는 재화나 용역에는 0%의 세율을 적용하는데, 이를 '영세율'이라고 합니다. 영세율은 매입세액공제를 전액 환급받을 수 있다는 점에서 면세와 차이가 있습니다." : 'Not every transaction carries VAT. Essentials for daily life (farm/livestock/fishery products, books, educational services, etc.) are VAT-exempt—called "exempt." Exported goods or services are taxed at 0%, called "zero-rated." Zero-rating differs from exemption in that input tax credit is fully refunded.'}</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">{isKo ? '5. 홈택스를 이용한 셀프 신고 활용하기' : '5. Use Hometax for Self-Filing'}</h4>
          <p>{isKo ? "국세청 홈택스(Hometax) 시스템은 부가세 신고에 필요한 대부분의 자료(전자세금계산서, 신용카드 사용 내역 등)를 자동으로 수집하여 제공합니다. 거래 건수가 많지 않은 소규모 사업자라면 세무 대리인 없이도 충분히 직접 신고가 가능합니다. 신고 기간에 홈택스에서 제공하는 '신고도움서비스'를 꼼꼼히 읽어보면 큰 도움이 됩니다." : "The NTS Hometax system automatically collects and provides most data needed for VAT filing (e-invoices, credit card usage, etc.). Small businesses with few transactions can file directly without a tax agent. Reading Hometax's 'filing help service' during the period is very helpful."}</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title={isKo ? '부가가치세 계산기' : 'VAT Calculator'}
      description={isKo ? '합계금액 또는 공급가액을 입력하여 부가가치세를 계산합니다.' : 'Enter the total amount or supply amount to calculate VAT.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  )
}

export default VatCalculator