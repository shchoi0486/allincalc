'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const currencies = ['USD', 'EUR', 'JPY', 'CNY', 'KRW', 'GBP'] as const;
type Currency = typeof currencies[number];

const currencyNames: Record<Currency, string> = {
  USD: '미국 달러(USD)',
  EUR: '유로(EUR)',
  JPY: '일본 엔(JPY)',
  CNY: '위안(CNY)',
  KRW: '한국 원(KRW)',
  GBP: '영국 파운드(GBP)',
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  GBP: '£',
};

// Approximate exchange rates (as of 2024, relative to USD)
const toUSD: Record<Currency, number> = {
  USD: 1,
  EUR: 1.08,
  JPY: 0.0067,
  CNY: 0.14,
  KRW: 0.00074,
  GBP: 1.27,
};

function convertCurrency(value: number, fromCurrency: Currency): Record<Currency, number> {
  const usd = value * toUSD[fromCurrency];
  const result: Record<string, number> = {};
  currencies.forEach((c) => {
    result[c] = usd / toUSD[c];
  });
  return result as Record<Currency, number>;
}

function formatCurrency(value: number, currency: Currency): string {
  const symbol = currencySymbols[currency];
  if (currency === 'KRW' || currency === 'JPY') {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
}

function formatNumber(n: number): string {
  if (n === 0) return '0';
  return n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export default function CurrencyConverter() {
  const [value, setValue] = useState('1');
  const [fromCurrency, setFromCurrency] = useState<Currency>('USD');
  const [results, setResults] = useState<Record<Currency, number>>({} as Record<Currency, number>);

  useEffect(() => {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      setResults(convertCurrency(num, fromCurrency));
    } else {
      const empty: Record<string, number> = {};
      currencies.forEach((c) => { empty[c] = 0; });
      setResults(empty as Record<Currency, number>);
    }
  }, [value, fromCurrency]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="currencyValue" className="w-24">금액:</label>
        <Input
          id="currencyValue"
          type="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="예: 1000"
          className="flex-grow"
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value as Currency)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {currencies.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {currencies.map((c) => (
        <div key={c} className="flex items-center justify-between p-3 bg-muted rounded-md">
          <span className="text-sm font-medium">{currencyNames[c]}</span>
          <span className="text-sm font-bold text-primary">{formatCurrency(results[c] ?? 0, c)}</span>
        </div>
      ))}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>환율 변환기</strong>는 세계 주요 통화 간의 환율을 빠르게 환산해 주는 실용적인 금융 도구입니다. 여행, 해외 쇼핑, 국제 송금, 투자 등 외국 화폐의 가치를 우리 돈이나 다른 통화로 바꿔야 할 때 언제 어디서든 편리하게 활용할 수 있습니다.
        </p>
        <p>
          이 도구는 미국 달러(USD), 유로(EUR), 일본 엔(JPY), 중국 위안(CNY), 한국 원(KRW), 영국 파운드(GBP) 등 주요 6개 통화를 지원하며, 기준 통화를 선택하면 나머지 통화로의 환산 결과를 한눈에 보여줍니다. 금융 시장은 시시각각 변하므로 대략적인 기준 환율을 제공하여 빠른 가늠을 돕습니다.
        </p>
        <p>
          환율은 수출입 기업의 원가, 해외 여행객의 예산, 글로벌 투자자의 수익률에 직결되는 핵심 지표입니다. 개인은 해외 결제 시 발생하는 수수료를 줄이기 위해, 기업은 외화 자산과 부채의 가치를 관리하기 위해 환율 정보를 일상적으로 활용합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          환율은 매일 변동하며 은행이나 환전소마다 적용되는 매매기준율과 수수료가 다릅니다. 이 계산기는 학습과 대략적인 참고용이며, 실제 거래에는 반드시 거래 기관의 실시간 환율을 확인하시기 바랍니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">환율 변환 공식</h4>
          <p>기준 통화의 금액을 대상 통화의 환율로 환산하는 공식은 다음과 같습니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">대상 금액 = 원래 금액 × (대상 통화 환율 / 원래 통화 환율)</p>
          </div>
          <p className="text-sm text-muted-foreground">기준 환율(1 USD 기준, 근사치): 1 USD = 1 EUR ≈ 1,491 JPY ≈ 7.25 CNY ≈ 1,380 KRW ≈ 0.79 GBP</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>예를 들어 100 USD를 한국 원으로 환산할 경우:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">100 USD × (1,380 KRW / 1 USD) = 138,000 KRW</p>
          </div>
          <p>같은 방식으로 모든 통화 쌍에 대해 기준 환율 비율을 곱해 결과를 구합니다. (근사치 환율 사용)</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">환전 수수료 이해하기</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>은행과 환전소는 매매기준율에 환전 수수료를 포함한 환율을 적용합니다.</li>
            <li>인터넷 뱅킹이나 모바일 앱 환전이 영업점 방문보다 일반적으로 유리합니다.</li>
            <li>공항 환전소는 수수료가 높은 편이므로 가급적 피하는 것이 좋습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">여행 시 환전 팁</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>출발 전 미리 환전하면 급한 상황보다 유리한 환율을 적용받을 수 있습니다.</li>
            <li>신용카드 해외 결제 시 1~3%의 수수료가 붙으므로 현금과 적절히 혼용하세요.</li>
            <li>남은 외화는 귀국 후 재환전하거나 다음 여행에 대비해 보관하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">환율에 영향을 주는 요인</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중앙은행의 금리 결정이 환율에 가장 큰 영향을 미칩니다.</li>
            <li>수출입 무역수지와 자본 이동이 통화 가치를 좌우합니다.</li>
            <li>양국의 인플레이션율 차이도 환율에 반영됩니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">역환율 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>같은 두 통화를 양방향으로 환산하면 수수료 차이로 미세한 오차가 생깁니다.</li>
            <li>정확한 거래에는 거래 기관의 매도율과 매수율을 각각 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">고액 송금 시 유의사항</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중개 은행이 여러 곳을 거치면 추가 수수료가 발생할 수 있습니다.</li>
            <li>송금 목적과 출처를 증빙할 서류를 미리 준비해 두는 것이 좋습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">투자와 환율</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>외화 자산은 환율 변동에 따라 원화 환산 수익이 커지거나 줄어듭니다.</li>
            <li>해외 주식이나 펀드에 투자할 때 환헤지 상품 여부를 꼼꼼히 비교하세요.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="환율 변환기"
      description="USD, EUR, JPY, CNY, KRW, GBP 주요 통화 간 환율을 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
