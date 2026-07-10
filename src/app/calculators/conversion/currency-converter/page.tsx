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
          <strong>환율 변환기</strong>는 주요 국제 통화 간의 환율 변환을 제공하는 도구입니다. 
          미국 달러(USD), 유로(EUR), 일본 엔(JPY), 중국 위안(CNY), 한국 원(KRW), 영국 파운드(GBP) 간의 
          환율 변환을 빠르게 수행할 수 있습니다.
        </p>
        <p>
          여행, 국제 거래, 투자 등 다양한 상황에서 환율 변환이 필요할 때 활용할 수 있으며, 
          실시간이 아닌 참고용 근사 환율을 사용합니다.
        </p>
        <div className="p-3 bg-orange-50 dark:bg-orange-900/30 border-l-4 border-orange-500 rounded-r-lg text-sm">
          <strong>주의:</strong> 이 변환기는 고정된 근사 환율을 사용합니다. 
          실제 거래 시에는 은행이나 환전소의 실시간 환율을 확인하시기 바랍니다.
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">환율 변환 공식</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
            <p className="text-center font-mono text-sm">대상 통화 금액 = 원래 금액 × (대상 통화 환율 / 원래 통화 환율)</p>
            <div className="mt-4 text-sm space-y-1">
              <p className="text-center">기준 환율 (1 USD 기준, 근사치):</p>
              <p className="text-center font-mono">1 USD = 1 EUR = 149 JPY = 7.1 CNY = 1,350 KRW = 0.79 GBP</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 환율은 매일 변동하며, 매매 기준율과 실시간 매매율之间有差异。 
          환전 수수료도 실제 환율에 영향을 줍니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 환율 관련 핵심 정보</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">환전 수수료 이해하기</p>
              <p className="text-xs mt-1">
                은행이나 환전소는 매매기준율에 수수료를 포함한 환율을 적용합니다. 
                인터넷 뱅킹이나 모바일 앱을 통한 환전이 일반적으로 더 유리합니다. 
                공항 환전소는 수수료가 높은 편이므로 가급적 피하는 것이 좋습니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">주요 환율 관련 경제 지표</p>
              <p className="text-xs mt-1">
                <strong>금리:</strong> 중앙은행 금리 결정이 환율에 큰 영향<br />
                <strong>무역수지:</strong> 수출입 균형이 통화 가치에 영향<br />
                <strong>인플레이션:</strong> 물가 상승률 차이가 환율에 반영
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">여행 시 환전 팁</p>
              <p className="text-xs mt-1">
               旅行先의 통화를 출발 전에 미리 환전하는 것이 일반적으로 유리합니다. 
                신용카드를 사용할 때는 해외 결제 수수료(약 1~3%)가 부과될 수 있으므로, 
                현금과 카드를 적절히 혼용하는 것이 좋습니다.
              </p>
            </li>
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
