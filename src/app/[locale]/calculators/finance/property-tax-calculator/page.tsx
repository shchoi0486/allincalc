'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { formatNumber } from '@/utils/formatNumber';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyTaxCalculator: NextPage = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const [assessedValue, setAssessedValue] = useState<number>(800000000);
  const [numHouses, setNumHouses] = useState<string>('1');
  const [fairValueRatio, setFairValueRatio] = useState<number>(70);
  const [results, setResults] = useState<{
    fairValue: number;
    taxBase: number;
    propertyTax: number;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const P = assessedValue;
    const ratio = fairValueRatio / 100;
    const houses = parseInt(numHouses);

    if (isNaN(P) || P <= 0 || isNaN(ratio) || ratio <= 0 || ratio > 1 || isNaN(houses)) {
      return null;
    }

    const fairValue = P * ratio;

    let deduction: number;
    switch (houses) {
      case 1:
        deduction = 600000000;
        break;
      case 2:
        deduction = 900000000;
        break;
      case 3:
      default:
        deduction = 1200000000;
        break;
    }

    const taxBase = Math.max(0, fairValue - deduction);

    const taxBrackets = [
      { limit: 120000000, rate: 0.005 },
      { limit: 480000000, rate: 0.0075 },
      { limit: 880000000, rate: 0.01 },
      { limit: 1500000000, rate: 0.015 },
      { limit: 3000000000, rate: 0.025 },
      { limit: 5000000000, rate: 0.035 },
      { limit: Infinity, rate: 0.045 },
    ];

    let propertyTax = 0;
    let remainingBase = taxBase;
    let prevLimit = 0;

    for (const bracket of taxBrackets) {
      if (remainingBase <= 0) break;

      const bracketSize = bracket.limit - prevLimit;
      const taxableInBracket = Math.min(remainingBase, bracketSize);
      propertyTax += taxableInBracket * bracket.rate;
      remainingBase -= taxableInBracket;
      prevLimit = bracket.limit;
    }

    return { fairValue, taxBase, propertyTax: Math.round(propertyTax) };
  }, [assessedValue, numHouses, fairValueRatio]);

  const handleCalculate = () => {
    if (calculationResults) {
      setResults(calculationResults);
      toast.success(isKo ? '계산이 완료되었습니다.' : 'Calculation complete.');
    } else {
      toast.error(isKo ? '입력값을 확인해주세요.' : 'Please check your input.');
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assessedValue">{isKo ? '공시가격 (원)' : 'Official Assessed Price (KRW)'}</Label>
        <Input
          id="assessedValue"
          value={assessedValue.toLocaleString()}
          onChange={(e) => setAssessedValue(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numHouses">{isKo ? '주택 수' : 'Number of Houses'}</Label>
        <Select value={numHouses} onValueChange={setNumHouses}>
          <SelectTrigger id="numHouses">
            <SelectValue placeholder={isKo ? '주택 수 선택' : 'Select number of houses'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">{isKo ? '1주택' : '1 House'}</SelectItem>
            <SelectItem value="2">{isKo ? '2주택' : '2 Houses'}</SelectItem>
            <SelectItem value="3">{isKo ? '3주택 이상' : '3+ Houses'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fairValueRatio">{isKo ? '공정가액비율 (%)' : 'Fair Value Ratio (%)'}</Label>
        <Input
          id="fairValueRatio"
          value={fairValueRatio}
          onChange={(e) => setFairValueRatio(parseFloat(e.target.value))}
          className="text-right"
          type="number"
          step="1"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
    </div>
  );

  const resultSection = (
    <>
      {results ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="font-medium">{isKo ? '공정가액' : 'Fair Value'}</div>
            <div className="text-right">{formatNumber(Math.round(results.fairValue))}{isKo ? '원' : ' KRW'}</div>
            <div className="font-medium">{isKo ? '과세표준' : 'Tax Base'}</div>
            <div className="text-right">{formatNumber(Math.round(results.taxBase))}{isKo ? '원' : ' KRW'}</div>
            <div className="font-medium">{isKo ? '부동산세' : 'Property Tax'}</div>
            <div className="text-right font-bold text-red-600">{formatNumber(results.propertyTax)}{isKo ? '원' : ' KRW'}</div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {isKo ? '입력 후 계산하기 버튼을 눌러주세요.' : 'Please enter values and click Calculate.'}
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: (
      <>
        <p className="text-muted-foreground">
          <strong className="text-foreground">{isKo ? '종합부동산세(종부세)' : 'Comprehensive Real Estate Tax (CRET)'}</strong>{isKo ? '는 고가 주택과 토지 등 부동산을 보유한 자에게 과세표준에 따라 부과되는 국세입니다. 부동산의 과도한 집중을 완화하고 보유 단계의 형평성을 높이기 위한 목적으로 운영됩니다.' : ' is a national tax levied on owners of high-priced houses, land, and other real estate according to the tax base. It operates to ease excessive concentration of real estate and improve equity at the ownership stage.'}
        </p>
        <p className="mt-4 text-muted-foreground">
          {isKo ? '세액은 공시가격에 공정가액비율을 적용한 공정가액에서 주택 수에 따른 기본공제를 뺀 과세표준에 누진세율을 곱해 산출됩니다. 주택 수와 공정가액비율에 따라 과세표준과 세율이 크게 달라집니다.' : 'The tax is computed by multiplying the tax base—the fair value (official price × fair-value ratio, minus the basic deduction by number of houses)—by a progressive rate. The tax base and rate vary greatly with the number of houses and the fair-value ratio.'}
        </p>
        <p className="mt-4 text-muted-foreground">
          {isKo ? '다주택 투자자, 고가 주택 보유자, 그리고 상속·증여로 부동산을 취득한 분들에게 특히 중요합니다. 보유 부동산의 연간 세 부담을 미리 파악하면 현금 흐름 계획과 매도·증여 타이밍 결정에 큰 도움이 됩니다.' : 'It is especially important for multi-home investors, high-priced home owners, and those who acquired real estate by inheritance or gift. Knowing your annual tax burden in advance greatly helps with cash-flow planning and decisions on timing of sale or gift.'}
        </p>
        <p className="mt-4 text-muted-foreground">
          <strong className="text-foreground">{isKo ? "All_in_Calc의 부동산세 계산기" : "All_in_Calc's Property Tax Calculator"}</strong>{isKo ? '는 공시가격, 주택 수, 공정가액비율을 입력하면 공정가액·과세표준·부동산세를 자동 계산합니다. 1주택 6억, 2주택 9억, 3주택 이상 12억 원의 기본공제와 누진세율이 자동 적용됩니다.' : ' automatically computes the fair value, tax base, and property tax when you enter the official price, number of houses, and fair-value ratio. The basic deductions (600M for 1 house, 900M for 2, 1.2B for 3+) and progressive rates are applied automatically.'}
        </p>
        <TermGlossary
          items={[
            {
              term: isKo ? '공시가격' : 'Official Assessed Price',
              desc: isKo ? '국토교통부가 매년 공시하는 부동산의 공식 가격입니다. 실제 거래 가격(시세)과는 다르며, 세금과 각종 공공요금 부과의 기준이 됩니다.' : "The official real estate price published yearly by the Ministry of Land, Infrastructure and Transport. It differs from the actual market price and serves as the basis for taxes and various public charges.",
            },
            {
              term: isKo ? '공정가액비율' : 'Fair Value Ratio',
              desc: isKo ? '공시가격을 세금 과세표준 산정에 반영하는 비율(0~100%)입니다. 주택은 보통 100%에 가깝게, 토지나 상가는 더 낮게 국세청이 매년 고시합니다. 공정가액 = 공시가격 × 공정가액비율로 계산되므로, 이 값이 낮을수록 과세표준이 작아져 세금이 줄어듭니다.' : 'The ratio (0–100%) that reflects the official price in the tax-base calculation. The NTS announces it yearly—close to 100% for houses, lower for land or commercial property. Since Fair Value = Official Price × Fair-Value Ratio, a lower value means a smaller tax base and less tax.',
            },
            {
              term: isKo ? '공정가액' : 'Fair Value',
              desc: isKo ? '공시가격에 공정가액비율을 곱해 산출한 값으로, 부동산세 계산의 실질적인 기초가 됩니다.' : 'The value obtained by multiplying the official price by the fair-value ratio; the practical basis for property tax calculation.',
            },
            {
              term: isKo ? '과세표준' : 'Tax Base',
              desc: isKo ? '공정가액에서 주택 수에 따른 기본공제(1주택 6억·2주택 9억·3주택 이상 12억 원)를 뺀 금액입니다. 여기에 누진세율을 곱해 세액을 구합니다.' : 'The fair value minus the basic deduction by number of houses (600M for 1, 900M for 2, 1.2B for 3+). Multiply by the progressive rate to get the tax.',
            },
            {
              term: isKo ? '기본공제' : 'Basic Deduction',
              desc: isKo ? '주택 수에 따라 과세표준에서 공제되는 금액입니다. 1주택 6억 원, 2주택 9억 원, 3주택 이상 12억 원이 적용됩니다.' : 'The amount deducted from the tax base by number of houses: 600M for 1 house, 900M for 2, 1.2B for 3+.',
            },
          ]}
        />
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{isKo ? '부동산세 계산 공식 및 세율' : 'Property Tax Formula and Rates'}</h3>
        <div className="space-y-4 mt-4">
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-2 text-foreground">{isKo ? '1. 과세표준 계산' : '1. Tax Base Calculation'}</h4>
            <div className="font-mono text-sm text-primary mt-2 space-y-1">
              <strong>{isKo ? '공정가액 = 공시가격 × 공정가액비율' : 'Fair Value = Official Price × Fair-Value Ratio'}</strong><br />
              <strong>{isKo ? '과세표준 = 공정가액 − 기본공제' : 'Tax Base = Fair Value − Basic Deduction'}</strong>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{isKo ? '기본공제: 1주택 6억, 2주택 9억, 3주택 이상 12억 원' : 'Basic deduction: 600M for 1 house, 900M for 2, 1.2B for 3+'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-2 text-foreground">{isKo ? '2. 누진세율 (과세표준 기준)' : '2. Progressive Rates (by Tax Base)'}</h4>
            <div className="font-mono text-sm text-primary mt-2 space-y-1">
              <p>{isKo ? '1.2억 이하: 0.5%' : 'Up to 120M: 0.5%'}</p>
              <p>{isKo ? '1.2억~4.8억: 0.75%' : '120M–480M: 0.75%'}</p>
              <p>{isKo ? '4.8억~8.8억: 1.0%' : '480M–880M: 1.0%'}</p>
              <p>{isKo ? '8.8억~15억: 1.5%' : '880M–1.5B: 1.5%'}</p>
              <p>{isKo ? '15억~30억: 2.5%' : '1.5B–3B: 2.5%'}</p>
              <p>{isKo ? '30억~50억: 3.5%' : '3B–5B: 3.5%'}</p>
              <p>{isKo ? '50억 초과: 4.5%' : 'Over 5B: 4.5%'}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">{isKo ? '※ 각 구간마다 해당 구간 금액에만 세율이 적용되는 누진 구조입니다.' : '※ A progressive structure where the rate applies only to the amount within each bracket.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-2 text-foreground">{isKo ? '계산 예시' : 'Calculation Example'}</h4>
            <p className="text-sm text-muted-foreground">{isKo ? '공시가격 8억, 공정가액비율 70%, 1주택인 경우' : 'Official price 800M, fair-value ratio 70%, 1 house'}</p>
            <p className="font-mono text-sm text-primary mt-1">{isKo ? '공정가액 = 800,000,000 × 0.7 = 560,000,000원' : 'Fair Value = 800,000,000 × 0.7 = 560,000,000 KRW'}</p>
            <p className="font-mono text-sm text-primary">{isKo ? '과세표준 = 560,000,000 − 600,000,000 = 0원 → 부동산세 0원' : 'Tax Base = 560,000,000 − 600,000,000 = 0 → Property Tax 0'}</p>
            <p className="text-xs text-muted-foreground mt-1">{isKo ? '기본공제(6억)가 공정가액보다 크면 과세표준이 0이 되어 종부세가 부과되지 않습니다.' : 'If the basic deduction (600M) exceeds the fair value, the tax base becomes 0 and no CRET is levied.'}</p>
          </div>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{isKo ? '부동산세 절세를 위한 유용한 팁' : 'Useful Tips to Reduce Property Tax'}</h3>
        <div className="space-y-6 mt-4">
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '1. 1세대 1주택자 공제 혜택을 확인하세요.' : '1. Check the single-household deduction benefit.'}</h4>
            <p className="text-muted-foreground">{isKo ? '1세대 1주택자는 공정가액 6억 원까지 기본공제가 적용됩니다. 특별공제 등 추가 혜택이 있는지 자격 요건을 확인하고 적극 활용하세요.' : 'A one-household, one-home owner gets the basic deduction up to 600M fair value. Check eligibility for extra benefits like special deductions and use them actively.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '2. 공정가액비율을 정확히 파악하세요.' : '2. Know the exact fair-value ratio.'}</h4>
            <p className="text-muted-foreground">{isKo ? '공정가액비율은 매년 국세청이 고시합니다. 주택·토지별로 비율이 다를 수 있으므로 정확한 값을 입력해야 정밀한 계산이 가능합니다.' : 'The fair-value ratio is announced yearly by the NTS. It differs by house or land, so you must enter the exact value for a precise calculation.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '3. 공시가격 확인 및 이의신청을 검토하세요.' : '3. Verify the official price and consider objection.'}</h4>
            <p className="text-muted-foreground">{isKo ? '공시가격은 세금의 기초입니다. 적정하지 않다고 판단되면 발표 시 이의신청을 통해 조정받을 수 있으므로 반드시 확인하세요.' : 'The official price is the basis of tax. If you find it unfair, you can file an objection at publication time, so always check it.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '4. 주택 수 변경에 따른 세율 변화를 고려하세요.' : '4. Consider rate changes from changing house count.'}</h4>
            <p className="text-muted-foreground">{isKo ? '주택 수가 늘어나면 기본공제가 축소되고 누진세율이 높아집니다. 추가 취득 전 부동산세 영향과 대안(증여·매도)을 꼼꼼히 비교하세요.' : 'More houses shrink the basic deduction and raise the progressive rate. Before acquiring more, compare the property-tax impact and alternatives (gift, sale) carefully.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '5. 전문가 상담을 적절히 활용하세요.' : '5. Use expert consultation appropriately.'}</h4>
            <p className="text-muted-foreground">{isKo ? '공제·감면·세율 적용은 개인별 상황에 따라 다릅니다. 복잡한 경우 세무사 상담을 통해 합리적인 절세 방안을 마련하세요.' : 'Deductions, exemptions, and rate application vary by individual situation. For complex cases, consult a tax accountant for a reasonable saving plan.'}</p>
          </div>
          <div className="p-4 pl-3 bg-muted rounded-lg border-l-4 border-primary">
            <h4 className="font-semibold text-md mb-1 text-primary">{isKo ? '6. 보유와 매도의 세 부담을 함께 따져보세요.' : '6. Weigh the tax burden of holding vs selling.'}</h4>
            <p className="text-muted-foreground">{isKo ? '종부세뿐 아니라 양도소득세, 취득세 등을 종합적으로 비교하여 보유 계속 또는 매도 중 유리한 선택을 결정하세요.' : 'Compare not just CRET but also capital gains tax and acquisition tax to decide whether holding or selling is more advantageous.'}</p>
          </div>
        </div>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '부동산세 계산기' : 'Property Tax Calculator'}
      description={isKo ? '공시가격, 주택 수, 공정가액비율을 입력하여 부동산세를 계산합니다.' : 'Calculate property tax by entering the official price, number of houses, and fair-value ratio.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default PropertyTaxCalculator;
