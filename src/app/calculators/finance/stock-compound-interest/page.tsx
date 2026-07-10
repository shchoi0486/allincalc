"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

interface CalculationResult {
  year: number;
  principal: number;
  valuation: number;
  profit: number;
  rate: number;
}

export default function StockCompoundInterestCalculator() {
  const [initialInvestment, setInitialInvestment] = useState("10,000,000");
  const [monthlyInvestment, setMonthlyInvestment] = useState("500,000");
  const [annualReturn, setAnnualReturn] = useState("15");
  const [investmentPeriod, setInvestmentPeriod] = useState("20");
  const [results, setResults] = useState<CalculationResult[]>([]);

  const calculate = () => {
    const initial = parseNumber(initialInvestment);
    const monthly = parseNumber(monthlyInvestment);
    const annualRate = parseNumber(annualReturn) / 100;
    const period = parseNumber(investmentPeriod);

    if (isNaN(initial) || initial <= 0) {
      toast.error("초기 투자금을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(annualRate) || annualRate <= 0) {
      toast.error("연 수익률을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(period) || period <= 0) {
      toast.error("투자 기간을 올바르게 입력해주세요.");
      return;
    }

    let currentValuation = initial;
    let totalPrincipal = initial;
    const newResults: CalculationResult[] = [];

    for (let i = 1; i <= period; i++) {
      const annualInvestment = monthly * 12;
      totalPrincipal += annualInvestment;
      currentValuation = (currentValuation + annualInvestment) * (1 + annualRate);

      const profit = currentValuation - totalPrincipal;
      const rate = (profit / totalPrincipal) * 100;

      newResults.push({
        year: i,
        principal: Math.round(totalPrincipal),
        valuation: Math.round(currentValuation),
        profit: Math.round(profit),
        rate: parseFloat(rate.toFixed(2)),
      });
    }
    setResults(newResults);
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="initialInvestment">초기 투자금 (원)</Label>
        <Input
          id="initialInvestment"
          value={initialInvestment}
          onChange={(e) => setInitialInvestment(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="monthlyInvestment">월 추가 투자금 (원)</Label>
        <Input
          id="monthlyInvestment"
          value={monthlyInvestment}
          onChange={(e) => setMonthlyInvestment(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="annualReturn">연 수익률 (%)</Label>
        <Input
          id="annualReturn"
          value={annualReturn}
          onChange={(e) => setAnnualReturn(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="investmentPeriod">투자 기간 (년)</Label>
        <Input
          id="investmentPeriod"
          value={investmentPeriod}
          onChange={(e) => setInvestmentPeriod(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <Button onClick={calculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="h-full w-full">
      {results.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>기간</TableHead>
              <TableHead className="text-right">투자 원금</TableHead>
              <TableHead className="text-right">평가 금액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((row) => (
              <TableRow key={row.year}>
                <TableCell>{row.year}년</TableCell>
                <TableCell className="text-right">{formatNumber(row.principal)}원</TableCell>
                <TableCell className="text-right">{formatNumber(row.valuation)}원</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>계산 결과가 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold">"투자의 여덟 번째 불가사의." - 알버트 아인슈타인이 복리 효과를 묘사한 말입니다.</p>
        <p>주식 복리 계산기는 이 강력한 원리를 시각적으로 체험하게 해주는 금융 도구입니다. 단순히 돈을 불리는 것을 넘어, 시간이 자산을 어떻게 기하급수적으로 증식시키는지 명확하게 보여줍니다. 초기 투자금과 매월 꾸준히 적립하는 금액이 연평균 수익률과 만나 어떤 놀라운 결과를 만들어내는지 직접 확인해보세요.</p>
        <p>이 계산기는 특히 장기적인 관점에서 투자를 계획하는 분들에게 유용합니다. 예를 들어, 사회초년생이 은퇴 자금을 마련하거나, 자녀의 미래 교육 자금을 준비하는 등의 목표를 세울 때 현실적인 시뮬레이션이 가능합니다. S&P 500이나 KOSPI 200과 같은 시장 지수 추종 ETF에 장기 적립식으로 투자했을 때의 미래를 예측해보고, 자신만의 투자 전략을 세우는 첫걸음으로 활용할 수 있습니다.</p>
        <p>물론, 투자의 세계는 불확실성으로 가득 차 있습니다. 이 계산기는 과거의 데이터나 사용자가 설정한 기대 수익률을 기반으로 한 예측이며, 미래의 수익을 보장하지는 않습니다. 하지만 꾸준한 투자와 시간의 힘이 만나 만들어내는 복리의 마법을 이해하는 것만으로도 당신의 금융 여정에 훌륭한 나침반이 될 것입니다.</p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md">
        <h3 className="text-xl font-bold">복리 계산의 작동 원리</h3>
        <p>본 계산기는 매년 말에 수익이 재투자되고, 연초에 연간 적립금이 추가되는 것을 가정하여 계산합니다. 이는 실제 투자 상황을 보다 정확하게 반영하기 위함입니다.</p>
        <ul className="list-decimal list-inside space-y-2">
          <li>
            <strong>1년차 평가금액:</strong>
            <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded"><code>(초기 투자금 + (월 추가 투자금 × 12)) × (1 + 연 수익률)</code></p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">첫 해에는 초기 자본과 1년치 적립금이 합쳐진 후, 연말에 수익이 발생합니다.</p>
          </li>
          <li>
            <strong>2년차 이후 평가금액:</strong>
            <p className="pl-4 mt-1 bg-white dark:bg-gray-700 p-2 rounded"><code>(이전 년도 평가금액 + (월 추가 투자금 × 12)) × (1 + 연 수익률)</code></p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">두 번째 해부터는 작년까지의 누적 자산(원금+수익)에 다시 1년치 적립금을 더하고, 그 총액에 대해 다시 수익이 붙는 복리 효과가 본격적으로 나타납니다.</p>
          </li>
        </ul>
        <div className="border-l-4 border-blue-500 pl-4 mt-4">
          <p><strong>핵심 변수 해설:</strong></p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>초기 투자금:</strong> 투자의 씨앗이 되는 돈입니다. 금액이 클수록 복리 효과를 더 빨리, 더 크게 누릴 수 있습니다.</li>
            <li><strong>월 추가 투자금:</strong> '적립식 투자'의 힘을 보여주는 변수입니다. 꾸준함이 비범함을 만듭니다.</li>
            <li><strong>연 수익률:</strong> 자산을 불리는 엔진입니다. S&P 500 지수의 역사적 연평균 수익률은 약 10~12% 수준이지만, 이는 보장된 수치가 아니며 시장 상황에 따라 변동합니다.</li>
            <li><strong>투자 기간:</strong> 복리 효과를 극대화하는 가장 중요한 요소입니다. 시간이 길어질수록 수익이 수익을 낳는 속도가 가속화됩니다.</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">1. 현실적인 수익률 설정의 중요성</h4>
          <p>높은 수익률은 매력적이지만, 비현실적인 기대는 잘못된 의사결정으로 이어질 수 있습니다. 시장의 역사적 평균 수익률(예: S&P 500 약 10%)을 기준으로 삼고, 보수적인 시나리오(5~7%)와 낙관적인 시나리오(12~15%)를 함께 비교해보는 것이 좋습니다. 이는 시장 변동성에 대한 마음의 준비를 하고, 흔들리지 않고 장기 투자를 이어가는 데 도움이 됩니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">2. '72의 법칙'으로 자산 증식 속도 가늠하기</h4>
          <p>복잡한 계산 없이 자산이 두 배가 되는 시간을 어림짐작할 수 있는 유용한 공식입니다. <code className="bg-gray-200 dark:bg-gray-700 p-1 rounded">'72 ÷ 연 수익률(%)'</code>을 계산하면 원금이 2배가 되는 대략적인 기간(년)이 나옵니다. 예를 들어, 연 8% 수익률이라면 약 9년(72 ÷ 8)마다 자산이 두 배로 불어나는 셈입니다. 이를 통해 복리의 힘을 직관적으로 이해할 수 있습니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">3. 적립식 투자(Dollar-Cost Averaging)의 마법</h4>
          <p>매월 정해진 금액을 투자하는 '적립식 투자'는 시장의 타이밍을 예측하려는 위험을 줄여줍니다. 주가가 낮을 때는 더 많은 수량을 매수하고, 높을 때는 더 적은 수량을 매수하게 되어 평균 매수 단가를 낮추는 효과(코스트 에버리징)를 기대할 수 있습니다. 이는 특히 변동성이 큰 주식 시장에서 장기적으로 안정적인 성과를 내는 검증된 전략입니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">4. 세금과 수수료를 잊지 마세요 (2025년 관점)</h4>
          <p>계산 결과는 세전 수익률 기준입니다. 실제 손에 쥐는 돈은 세금과 수수료를 제외한 금액입니다. 국내 주식의 경우 매도 시 증권거래세가 부과되며, 배당금에는 배당소득세(15.4%)가 붙습니다. 해외 주식은 매도 차익에 대해 양도소득세(22%)가 발생합니다. 2025년부터 금융투자소득세 도입이 예정되어 있었으나 현재 유예 상태이므로, 투자 시점의 최신 세법을 반드시 확인해야 합니다. 연금저축펀드, IRP, ISA 등 절세 계좌를 활용하면 세금 부담을 크게 줄일 수 있으니 적극적으로 알아보는 것을 추천합니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-green-500 pl-3 mb-2">5. 인플레이션을 감안한 실질 수익률</h4>
          <p>화폐 가치는 시간이 지남에 따라 하락합니다. 이를 '인플레이션'이라고 합니다. 10%의 수익을 얻었더라도, 같은 기간 물가가 3% 올랐다면 실질적인 자산 증가는 약 7% 수준입니다. 장기 목표를 세울 때는 명목 수익률이 아닌, 인플레이션을 감안한 '실질 수익률'을 고려해야 미래에 내가 원하는 구매력을 확보할 수 있습니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="주식 복리 계산기"
      description="장기 투자의 힘, 복리 효과를 직접 확인해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}