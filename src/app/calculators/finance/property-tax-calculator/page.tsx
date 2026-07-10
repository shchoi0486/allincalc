'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { formatNumber } from '@/utils/formatNumber';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const PropertyTaxCalculator: NextPage = () => {
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
      toast.success('계산이 완료되었습니다.');
    } else {
      toast.error('입력값을 확인해주세요.');
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="assessedValue">공시가격 (원)</Label>
        <Input
          id="assessedValue"
          value={assessedValue.toLocaleString()}
          onChange={(e) => setAssessedValue(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="numHouses">주택 수</Label>
        <Select value={numHouses} onValueChange={setNumHouses}>
          <SelectTrigger id="numHouses">
            <SelectValue placeholder="주택 수 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1주택</SelectItem>
            <SelectItem value="2">2주택</SelectItem>
            <SelectItem value="3">3주택 이상</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="fairValueRatio">공정가액비율 (%)</Label>
        <Input
          id="fairValueRatio"
          value={fairValueRatio}
          onChange={(e) => setFairValueRatio(parseFloat(e.target.value))}
          className="text-right"
          type="number"
          step="1"
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
            <div className="font-medium">공정가액</div>
            <div className="text-right">{formatNumber(Math.round(results.fairValue))}원</div>
            <div className="font-medium">과세표준</div>
            <div className="text-right">{formatNumber(Math.round(results.taxBase))}원</div>
            <div className="font-medium">부동산세</div>
            <div className="text-right font-bold text-red-600">{formatNumber(results.propertyTax)}원</div>
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
          <strong className="text-foreground">종합부동산세(종부세)</strong>는 고가 주택과 토지 등 부동산을 보유한 자에게 과세표준에 따라 부과되는 국세입니다. 부동산의 과도한 집중을 완화하고 보유 단계의 형평성을 높이기 위한 목적으로 운영됩니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          세액은 공시가격에 공정가액비율을 적용한 공정가액에서 주택 수에 따른 기본공제를 뺀 과세표준에 누진세율을 곱해 산출됩니다. 주택 수와 공정가액비율에 따라 과세표준과 세율이 크게 달라집니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          다주택 투자자, 고가 주택 보유자, 그리고 상속·증여로 부동산을 취득한 분들에게 특히 중요합니다. 보유 부동산의 연간 세 부담을 미리 파악하면 현금 흐름 계획과 매도·증여 타이밍 결정에 큰 도움이 됩니다.
        </p>
        <p className="mt-4 text-muted-foreground">
          <strong className="text-foreground">All_in_Calc의 부동산세 계산기</strong>는 공시가격, 주택 수, 공정가액비율을 입력하면 공정가액·과세표준·부동산세를 자동 계산합니다. 1주택 6억, 2주택 9억, 3주택 이상 12억 원의 기본공제와 누진세율이 자동 적용됩니다.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">부동산세 계산 공식 및 세율</h3>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">1. 과세표준 계산</h4>
            <div className="font-mono p-2 bg-card rounded-md text-sm text-primary">
              <strong>공정가액 = 공시가격 × 공정가액비율</strong><br />
              <strong>과세표준 = 공정가액 − 기본공제</strong>
            </div>
            <p className="text-sm text-muted-foreground mt-1">기본공제: 1주택 6억, 2주택 9억, 3주택 이상 12억 원</p>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">2. 누진세율 (과세표준 기준)</h4>
            <div className="font-mono p-2 bg-card rounded-md text-sm text-primary space-y-1">
              <p>1.2억 이하: 0.5%</p>
              <p>1.2억~4.8억: 0.75%</p>
              <p>4.8억~8.8억: 1.0%</p>
              <p>8.8억~15억: 1.5%</p>
              <p>15억~30억: 2.5%</p>
              <p>30억~50억: 3.5%</p>
              <p>50억 초과: 4.5%</p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">※ 각 구간마다 해당 구간 금액에만 세율이 적용되는 누진 구조입니다.</p>
          </div>
          <div className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-2 text-foreground">계산 예시</h4>
            <p className="text-sm text-muted-foreground">공시가격 8억, 공정가액비율 70%, 1주택인 경우</p>
            <p className="font-mono text-sm text-primary mt-1">공정가액 = 800,000,000 × 0.7 = 560,000,000원</p>
            <p className="font-mono text-sm text-primary">과세표준 = 560,000,000 − 600,000,000 = 0원 → 부동산세 0원</p>
            <p className="text-xs text-muted-foreground mt-1">기본공제(6억)가 공정가액보다 크면 과세표준이 0이 되어 종부세가 부과되지 않습니다.</p>
          </div>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">부동산세 절세를 위한 유용한 팁</h3>
        <ul className="space-y-6">
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">1. 1세대 1주택자 공제 혜택을 확인하세요.</h4>
            <p className="text-muted-foreground">1세대 1주택자는 공정가액 6억 원까지 기본공제가 적용됩니다. 특별공제 등 추가 혜택이 있는지 자격 요건을 확인하고 적극 활용하세요.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">2. 공정가액비율을 정확히 파악하세요.</h4>
            <p className="text-muted-foreground">공정가액비율은 매년 국세청이 고시합니다. 주택·토지별로 비율이 다를 수 있으므로 정확한 값을 입력해야 정밀한 계산이 가능합니다.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">3. 공시가격 확인 및 이의신청을 검토하세요.</h4>
            <p className="text-muted-foreground">공시가격은 세금의 기초입니다. 적정하지 않다고 판단되면 발표 시 이의신청을 통해 조정받을 수 있으므로 반드시 확인하세요.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">4. 주택 수 변경에 따른 세율 변화를 고려하세요.</h4>
            <p className="text-muted-foreground">주택 수가 늘어나면 기본공제가 축소되고 누진세율이 높아집니다. 추가 취득 전 부동산세 영향과 대안(증여·매도)을 꼼꼼히 비교하세요.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">5. 전문가 상담을 적절히 활용하세요.</h4>
            <p className="text-muted-foreground">공제·감면·세율 적용은 개인별 상황에 따라 다릅니다. 복잡한 경우 세무사 상담을 통해 합리적인 절세 방안을 마련하세요.</p>
          </li>
          <li className="p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-md mb-1 text-primary">6. 보유와 매도의 세 부담을 함께 따져보세요.</h4>
            <p className="text-muted-foreground">종부세뿐 아니라 양도소득세, 취득세 등을 종합적으로 비교하여 보유 계속 또는 매도 중 유리한 선택을 결정하세요.</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="부동산세 계산기"
      description="공시가격, 주택 수, 공정가액비율을 입력하여 부동산세를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default PropertyTaxCalculator;
