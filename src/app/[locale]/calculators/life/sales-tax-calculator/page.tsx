'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type InputMode = 'supply' | 'vat' | 'total';

const SalesTaxCalculator: React.FC = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [mode, setMode] = useState<InputMode>('supply');
  const [supplyAmount, setSupplyAmount] = useState<string>('');
  const [vatAmount, setVatAmount] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');

  const handleReset = () => {
    setMode('supply');
    setSupplyAmount('');
    setVatAmount('');
    setTotalAmount('');
  };

  const results = useMemo(() => {
    let supply = 0;
    let vat = 0;
    let total = 0;

    if (mode === 'supply') {
      const val = parseFloat(supplyAmount);
      if (isNaN(val) || val < 0) return null;
      supply = val;
      vat = Math.round(supply * 0.1);
      total = supply + vat;
    } else if (mode === 'vat') {
      const val = parseFloat(vatAmount);
      if (isNaN(val) || val < 0) return null;
      vat = val;
      supply = Math.round(vat / 0.1);
      total = supply + vat;
    } else {
      const val = parseFloat(totalAmount);
      if (isNaN(val) || val < 0) return null;
      total = val;
      supply = Math.round(total / 1.1);
      vat = total - supply;
    }

    return { supply, vat, total };
  }, [mode, supplyAmount, vatAmount, totalAmount]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-2">
        {([
          { key: 'supply' as InputMode, label: L('공급가액 입력', 'Supply Amount') },
          { key: 'vat' as InputMode, label: L('부가세 입력', 'VAT Amount') },
          { key: 'total' as InputMode, label: L('합계금액 입력', 'Total Amount') },
        ]).map((item) => (
          <Button
            key={item.key}
            variant={mode === item.key ? 'default' : 'outline'}
            onClick={() => {
              setMode(item.key);
              setSupplyAmount('');
              setVatAmount('');
              setTotalAmount('');
            }}
            className="text-xs sm:text-sm"
          >
            {item.label}
          </Button>
        ))}
      </div>

      {mode === 'supply' && (
        <div className="space-y-2">
          <Label htmlFor="supplyInput">{L('공급가액 (원)', 'Supply Amount (KRW)')}</Label>
          <Input
            id="supplyInput"
            type="text"
            inputMode="numeric"
            value={supplyAmount}
            onChange={(e) => setSupplyAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder={L('공급가액 입력', 'Enter supply amount')}
            className="text-right"
          />
        </div>
      )}

      {mode === 'vat' && (
        <div className="space-y-2">
          <Label htmlFor="vatInput">{L('부가세 (원)', 'VAT Amount (KRW)')}</Label>
          <Input
            id="vatInput"
            type="text"
            inputMode="numeric"
            value={vatAmount}
            onChange={(e) => setVatAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder={L('부가세 입력', 'Enter VAT amount')}
            className="text-right"
          />
        </div>
      )}

      {mode === 'total' && (
        <div className="space-y-2">
          <Label htmlFor="totalInput">{L('합계금액 (원)', 'Total Amount (KRW)')}</Label>
          <Input
            id="totalInput"
            type="text"
            inputMode="numeric"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value.replace(/[^0-9.]/g, ''))}
            placeholder={L('합계금액 입력', 'Enter total amount')}
            className="text-right"
          />
        </div>
      )}

      <Button onClick={handleReset} className="w-full" variant="outline">
        {L('초기화', 'Reset')}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!results ? (
        <p className="text-muted-foreground text-center py-8">
          {L('값을 입력하면 결과가 표시됩니다.', 'Enter a value to see results.')}
        </p>
      ) : (
        <>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('공급가액', 'Supply Amount')}</span>
              <span className="font-mono font-semibold">{results.supply.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('부가세 (10%)', 'VAT (10%)')}</span>
              <span className="font-mono font-semibold">{results.vat.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between p-3 border-2 border-primary rounded-lg">
              <span className="font-bold">{L('합계금액', 'Total Amount')}</span>
              <span className="font-mono font-bold text-lg">{results.total.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
          </div>

          {results.total > 0 && (
            <div className="mt-4">
              <div className="text-sm text-muted-foreground mb-2">{L('금액 비율', 'Amount Breakdown')}</div>
              <div className="w-full h-8 rounded-lg overflow-hidden flex">
                <div
                  className="bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(results.supply / results.total) * 100}%` }}
                >
                  {((results.supply / results.total) * 100).toFixed(1)}%
                </div>
                <div
                  className="bg-orange-500 dark:bg-orange-600 flex items-center justify-center text-white text-xs font-medium"
                  style={{ width: `${(results.vat / results.total) * 100}%` }}
                >
                  {((results.vat / results.total) * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                <span>{L('공급가액', 'Supply')}</span>
                <span>{L('부가세', 'VAT')}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '부가가치세(VAT) 포함 가격 계산기는 한국의 부가세(10%)를 기준으로 공급가액, 부가세, 합계금액을 상호 변환하여 계산해주는 도구입니다. 견적서 작성, 장부 기장, 세금 신고 등 다양한 실무 상황에서 활용할 수 있습니다.',
            'The Sales Tax (VAT) Calculator converts between supply amount, VAT, and total amount based on Korea\'s 10% VAT rate. It is useful for quoting, bookkeeping, and tax filing.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('3가지 입력 모드', '3 Input Modes')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('공급가액 입력 → 부가세(×0.10) + 합계(×1.10)', 'Supply Amount → VAT (×0.10) + Total (×1.10)')}</li>
            <li>{L('부가세 입력 → 공급가액(÷0.10) + 합계(공급+부가세)', 'VAT Amount → Supply (÷0.10) + Total (Supply+VAT)')}</li>
            <li>{L('합계금액 입력 → 공급가액(÷1.10) + 부가세(합계-공급)', 'Total Amount → Supply (÷1.10) + VAT (Total-Supply)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('부가세 계산 공식', 'VAT Calculation Formulas')}
          </h4>
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div>
              <p className="text-sm font-semibold mb-1">{L('1. 공급가액에서 계산', '1. From Supply Amount')}</p>
              <p className="text-center font-mono text-blue-600">부가세 = 공급가액 × 0.10</p>
              <p className="text-center font-mono text-blue-600">합계 = 공급가액 × 1.10</p>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">{L('2. 합계금액에서 계산', '2. From Total Amount')}</p>
              <p className="text-center font-mono text-blue-600">공급가액 = 합계 ÷ 1.10</p>
              <p className="text-center font-mono text-blue-600">부가세 = 합계 - 공급가액</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Calculation Example')}</h4>
          <div className="p-4 bg-muted rounded-lg text-sm space-y-1">
            <p><strong>{L('공급가액 100,000원인 경우:', 'Supply amount = 100,000 KRW:')}</strong></p>
            <p className="font-mono">부가세 = 100,000 × 0.10 = 10,000{isKo ? '원' : ' KRW'}</p>
            <p className="font-mono">합계 = 100,000 + 10,000 = 110,000{isKo ? '원' : ' KRW'}</p>
            <p className="mt-2"><strong>{L('합계 110,000원인 경우:', 'Total = 110,000 KRW:')}</strong></p>
            <p className="font-mono">공급가액 = 110,000 ÷ 1.1 = 100,000{isKo ? '원' : ' KRW'}</p>
            <p className="font-mono">부가세 = 110,000 - 100,000 = 10,000{isKo ? '원' : ' KRW'}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('부가세 계산 시 유의사항', 'VAT Calculation Tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('합계금액에서 공급가액을 구할 때 소수점 이하는 반올림 또는 버림 처리됩니다.', 'When calculating supply from total, decimals are rounded or truncated.')}</li>
            <li>{L('부가세 신고 시 세금계산서·카드매출전표 등 적격증빙을 반드시 확인하세요.', 'Verify qualifying evidence (tax invoices, card slips) when filing VAT.')}</li>
            <li>{L('간이과세자의 경우 세율이 5% 또는 1.5%로 다를 수 있습니다.', 'Simplified taxpayers may have a 5% or 1.5% rate instead of 10%.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('매출세액 vs 매입세액', 'Output Tax vs Input Tax')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('매출세액: 판매 시 부과하는 부가세 (거래처에 청구)', 'Output Tax: VAT charged on sales (billed to customers)')}</li>
            <li>{L('매입세액: 구매 시 지불한 부가세 (사업 경비에 포함)', 'Input Tax: VAT paid on purchases (included in business expenses)')}</li>
            <li>{L('납부세액 = 매출세액 - 매입세액 (매입세액공제)', 'Tax payable = Output tax − Input tax (input tax credit)')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={L('부가세 포함 가격 계산기', 'Sales Tax (VAT) Calculator')}
      description={L(
        '공급가액·부가세·합계금액을 상호 변환합니다.',
        'Convert between supply amount, VAT, and total amount.'
      )}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default SalesTaxCalculator;
