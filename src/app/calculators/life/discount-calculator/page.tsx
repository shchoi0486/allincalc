'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DiscountCalculator = () => {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    savedPercent?: number;
  } | null>(null);

  const calculateDiscount = () => {
    if (mode === 'forward') {
      const original = parseFloat(originalPrice);
      const discount = parseFloat(discountRate);

      if (isNaN(original) || isNaN(discount) || original <= 0 || discount < 0 || discount > 100) {
        alert('원가와 할인율을 정확히 입력해주세요.');
        return;
      }

      const discountAmount = original * (discount / 100);
      const finalPrice = original - discountAmount;

      setResult({
        discountAmount: parseFloat(discountAmount.toFixed(0)),
        finalPrice: parseFloat(finalPrice.toFixed(0)),
      });
    } else {
      const original = parseFloat(originalPrice);
      const sale = parseFloat(salePrice);

      if (isNaN(original) || isNaN(sale) || original <= 0 || sale < 0) {
        alert('원가와 입력가격을 정확히 입력해주세요.');
        return;
      }

      if (sale > original) {
        alert('입력가격은 원가보다 작거나 같아야 합니다.');
        return;
      }

      const discountAmount = original - sale;
      const discountPercent = ((discountAmount / original) * 100);

      setResult({
        discountAmount: parseFloat(discountAmount.toFixed(0)),
        finalPrice: sale,
        savedPercent: parseFloat(discountPercent.toFixed(1)),
      });
    }
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">계산 방식:</label>
        <div className="flex space-x-2">
          <Button
            variant={mode === 'forward' ? 'default' : 'outline'}
            onClick={() => { setMode('forward'); setResult(null); }}
          >
            할인가 계산
          </Button>
          <Button
            variant={mode === 'reverse' ? 'default' : 'outline'}
            onClick={() => { setMode('reverse'); setResult(null); }}
          >
            할인율 역산
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">원가 (원):</label>
        <Input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder="예: 50000" />
      </div>
      {mode === 'forward' ? (
        <div className="flex items-center space-x-4">
          <label className="w-32">할인율 (%):</label>
          <Input type="number" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} placeholder="예: 20" />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <label className="w-32">입력가격 (원):</label>
          <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder="예: 40000" />
        </div>
      )}
      <div className="flex space-x-2">
        <Button onClick={calculateDiscount}>계산하기</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>할인 금액:</span>
            <strong className="text-lg text-primary">{result.discountAmount.toLocaleString()} 원</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>할인가격:</span>
            <strong className="text-2xl">{result.finalPrice.toLocaleString()} 원</strong>
          </div>
          {result.savedPercent !== undefined && (
            <div className="flex justify-between items-center">
              <span>할인율:</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {result.savedPercent}% 할인
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          할인 금액과 최종 가격을 빠르게 계산하세요!
        </p>
        <p>
          쇼핑이나 프로모션에서 할인율을 보고 실제 절약하는 금액과 최종 결제 금액을 바로 알기 어려울 때가 많습니다.
          특히 세일 기간이나 복잡한 할인 조건이 적용될 때 정확한 지출을 예측하기란 쉽지 않습니다.
          이 계산기를 사용하면 할인율, 할인 금액, 최종 가격을 즉시 확인할 수 있어 합리적인 소비 결정에 도움이 됩니다.
        </p>
        <p>
          본 계산기는 두 가지 모드를 지원합니다.
          '할인가 계산' 모드는 원가와 할인율을 입력하면 절약 금액과 최종 결제 금액을 보여주고,
          '할인율 역산' 모드는 원가와 실제 결제 금액을 입력하면 몇 퍼센트 할인을 받은 것인지 역으로 계산해 줍니다.
        </p>
        <p>
          자영업자, 쇼핑몰 운영자, 마케팅 담당자뿐만 아니라 일반 소비자 누구나
          할인 조건을 빠르게 분석하고 현명한 소비를 할 수 있는 유용한 도구입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">할인 계산 공식과 단계별 설명</h3>
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">1. 할인 금액 및 최종 가격 계산</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              원가에서 할인율에 해당하는 금액을 차감하여 최종 가격을 산출합니다.
            </p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              할인 금액 = 원가 × (할인율 ÷ 100)
            </code>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              최종 가격 = 원가 - 할인 금액
            </code>
            <p className="text-xs mt-2 text-muted-foreground">
              예시: 50,000원 상품을 20% 할인받으면
              → 할인 금액 = 50,000 × 0.2 = 10,000원 → 최종 = 40,000원
            </p>
          </div>
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">2. 할인율 역산 공식</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              실제 결제 금액과 원가의 차이를 원가로 나누어 할인 비율을 구합니다.
            </p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              할인율(%) = (원가 - 결제금액) ÷ 원가 × 100
            </code>
            <p className="text-xs mt-2 text-muted-foreground">
              예시: 50,000원 상품을 40,000원에 구매
              → (50,000 - 40,000) ÷ 50,000 × 100 = 20% 할인
            </p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 할인 계산 활용 핵심 팁</h3>
        <div className="space-y-4">
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">1. 할인 중복 적용은 단순 합산이 아닙니다</p>
            <p className="text-xs mt-1 text-muted-foreground">
              "30% 할인 후 20% 추가 할인"은 총 44% 할인 효과가 있습니다 (1 - 0.7 × 0.8 = 0.44).
              단순히 50%로 생각하면 실제 할인율보다 과대 계산하게 됩니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">2. 적용 순서에 따라 최종 가격이 달라집니다</p>
            <p className="text-xs mt-1 text-muted-foreground">
              카드사 할인, 쿠폰, 포인트 적립 등 다양한 할인이 중복될 때 적용 순서에 따라
              최종 금액이 달라질 수 있으므로 가장 유리한 순서를 미리 비교해 보세요.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">3. 가격 인상 후 할인 여부를 확인하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              가격을 올린 뒤 할인하는 '허위 할인' 사례가 있으므로, 평소 관심 상품의 가격을 미리 파악해 두면
              진짜 할인 혜택을 누릴 수 있습니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">4. 역산 모드로 쿠폰 효율을 비교하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              여러 쿠폰 중 어떤 것이 가장 많은 할인을 제공하는지 역산 모드를 활용하면
              실질적으로 가장 이득인 쿠폰을 선택할 수 있습니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">5. 대량 구매 시 총 절약액도 확인하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              개당 할인액에 수량을 곱하면 총 절약액을 알 수 있어 예산 관리에 도움이 됩니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">6. 부가세 포함 금액을 기준으로 계산하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              할인가 계산 시 부가세 포함 여부에 따라 최종 금액이 달라질 수 있으므로,
              표시된 가격이 부가세 포함인지 여부를 반드시 확인하세요.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">7. 환불 금액도 미리 확인하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              할인받은 상품을 환불할 때 어떤 금액이 반환되는지 미리 계산해 보면
              예기치 못한 손실을 예방하는 데 도움이 됩니다.
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="할인율 계산기"
      description="할인 금액과 최종 가격을 빠르게 계산하거나, 결제 금액으로 할인율을 역산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DiscountCalculator;
