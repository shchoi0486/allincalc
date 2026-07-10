"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";

export default function RegularInstallmentSavings() {
  const [monthlyDeposit, setMonthlyDeposit] = useState("100,000");
  const [interestRate, setInterestRate] = useState("3");
  const [period, setPeriod] = useState("12");
  const [interestType, setInterestType] = useState<"simple" | "compound">("simple");
  const [taxation, setTaxation] = useState<"general" | "preferential" | "non-taxable">("general");
  const [result, setResult] = useState({
    principal: 0,
    interest: 0,
    total: 0,
  });

  const handleCalculate = () => {
    const principalAmount = parseNumber(monthlyDeposit);
    const rate = parseNumber(interestRate) / 100;
    const months = parseNumber(period);

    if (isNaN(principalAmount) || principalAmount <= 0) {
      toast.error("월 적립액을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(rate) || rate <= 0) {
      toast.error("연 이자율을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(months) || months <= 0) {
      toast.error("적립 기간을 올바르게 입력해주세요.");
      return;
    }

    let totalInterest = 0;
    const principal = principalAmount * months;

    if (interestType === "simple") {
      totalInterest = (principalAmount * (months * (months + 1)) / 2) * (rate / 12);
    } else { // compound
      let futureValue = 0;
      for (let i = 0; i < months; i++) {
        futureValue = (futureValue + principalAmount) * (1 + rate / 12);
      }
      totalInterest = futureValue - principal;
    }
    
    let taxRate = 0;
    if (taxation === "general") {
      taxRate = 0.154;
    } else if (taxation === "preferential") {
      taxRate = 0.095;
    }

    const tax = totalInterest * taxRate;
    const interestAfterTax = totalInterest - tax;
    const total = principal + interestAfterTax;

    setResult({
      principal: principal,
      interest: interestAfterTax,
      total: total,
    });
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="monthlyDeposit">월 적립액 (원)</Label>
        <Input
          id="monthlyDeposit"
          value={monthlyDeposit}
          onChange={(e) => setMonthlyDeposit(formatNumber(e.target.value))}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="interestRate">연 이자율 (%)</Label>
        <Input
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="period">적립 기간 (개월)</Label>
        <Input
          id="period"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label>이자 계산 방식</Label>
        <Select onValueChange={(value: "simple" | "compound") => setInterestType(value)} defaultValue={interestType}>
          <SelectTrigger>
            <SelectValue placeholder="이자 계산 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="simple">단리</SelectItem>
            <SelectItem value="compound">월복리</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>과세 옵션</Label>
        <RadioGroup defaultValue={taxation} onValueChange={(value: "general" | "preferential" | "non-taxable") => setTaxation(value)} className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="general" id="general" />
            <Label htmlFor="general">일반과세 (15.4%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="preferential" id="preferential" />
            <Label htmlFor="preferential">세금우대 (9.5%)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="non-taxable" id="non-taxable" />
            <Label htmlFor="non-taxable">비과세</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="text-center">
      {result.total > 0 ? (
        <div className="space-y-4">
          <div>
            <p className="text-lg">만기 시 총 수령액</p>
            <p className="text-3xl font-bold">{formatNumber(Math.round(result.total))}원</p>
          </div>
          <div className="flex justify-around text-left w-full">
            <div>
              <p>원금 합계</p>
              <p>{formatNumber(Math.round(result.principal))}원</p>
            </div>
            <div>
              <p>세후 이자</p>
              <p>{formatNumber(Math.round(result.interest))}원</p>
            </div>
          </div>
        </div>
      ) : (
        <p>계산 결과가 여기에 표시됩니다.</p>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          매달 꾸준히, 차곡차곡! 목돈 만들기의 가장 기본적이면서도 확실한 방법, 바로 <strong>정기적금</strong>입니다. 정기적금은 은행 등 금융기관과 약속한 기간 동안 매월 일정한 금액을 납입하고, 만기일에 원금과 약속된 이자를 함께 돌려받는 가장 대표적인 저축 상품입니다.
        </p>
        <p>
          여행 자금, 내 집 마련 계약금, 자녀 학자금 등 구체적인 목표를 위해 계획적으로 돈을 모으는 데 최적화되어 있습니다. 강제성이 부여되어 소비의 유혹을 이겨내고 꾸준한 저축 습관을 형성하는 데 큰 도움을 줍니다.
        </p>
        <p>
          본 정기적금 계산기는 여러분의 소중한 목표 달성을 돕는 스마트한 가이드입니다. 월 적립액, 이자율, 기간, 그리고 복잡한 세금 옵션까지 고려하여 만기 시 실제 손에 쥐게 될 금액을 미리 정확하게 계산해볼 수 있습니다. 이를 통해 여러 금융 상품을 비교하고 가장 유리한 선택을 하도록 도와 성공적인 자산 형성의 첫걸음을 응원합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">정기적금의 이자는 크게 단리와 월복리 방식으로 계산됩니다. 어떤 방식을 선택하느냐에 따라 만기 수령액이 달라지므로, 그 차이를 명확히 이해하는 것이 중요합니다.</p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">1. 단리 계산법 (Simple Interest)</h3>
          <p>매월 납입한 원금에 대해서만 만기까지의 기간을 적용하여 이자를 계산하는 가장 기본적인 방식입니다.</p>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto mt-2">
            총 이자 = 월 납입금 × (연이율 / 12) × (총 납입 개월 수 × (총 납입 개월 수 + 1) / 2)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">※ 각 월의 납입금이 예치되는 기간이 모두 다르기 때문에(첫 달은 12개월, 마지막 달은 1개월) 위와 같은 공식이 사용됩니다.</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">2. 월복리 계산법 (Monthly Compound Interest)</h3>
          <p>매월 발생한 이자를 원금에 더하고, 다음 달에는 '원금+이자'에 대한 이자를 계산하는 방식입니다. 이자에 이자가 붙어 시간이 지날수록 눈덩이처럼 불어나는 효과가 있습니다.</p>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto mt-2">
            만기지급액 = 월 납입금 × [ ( (1 + 월이율)^(납입개월수) - 1 ) / 월이율 ] × (1 + 월이율)
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">※ 월이율 = 연이율 / 12</p>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-red-500">
          <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-3">3. 세금 계산법 (Tax Calculation)</h3>
          <p>이자에 대해서는 세금이 발생하며, 과세 종류에 따라 최종 수령액이 달라집니다. (2025년 기준)</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li><strong>일반과세:</strong> 이자 소득의 15.4% (소득세 14% + 지방소득세 1.4%)</li>
            <li><strong>세금우대:</strong> 이자 소득의 9.5% (특정 금융상품, 한도 내에서 적용)</li>
            <li><strong>비과세:</strong> 0% (비과세 종합저축 등 특정 요건 충족 시)</li>
          </ul>
          <p className="font-mono p-3 bg-white dark:bg-gray-900 rounded-md text-sm shadow-sm overflow-x-auto mt-2">
            실수령액 = 원금 합계 + (총 이자 - (총 이자 × 세율))
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">💡 2025년, 정기적금 200% 활용 가이드</h2>
        
        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">1. '단리 vs 복리' 신화와 진실</h3>
          <p className="mt-2">
            흔히 복리는 무조건 좋다고 알려져 있지만, 1년 만기 정기적금에서는 단리와 월복리의 차이가 미미할 수 있습니다. 하지만 <strong>적금 기간이 길어지고 월 납입액이 커질수록 복리의 마법은 강력해집니다.</strong> 동일한 금리라면 고민 없이 월복리 상품을 선택하는 것이 유리합니다.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500">
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400">2. 금리 쇼핑은 필수! 0.1%의 나비효과</h3>
          <p className="mt-2">
            발품, 아니 손품을 파는 만큼 이자는 올라갑니다. 주거래 은행만 고집하지 말고, <strong>인터넷 전문 은행이나 저축은행의 비대면 상품</strong>을 꼭 비교해보세요. 종종 1%p 이상 높은 금리의 특판 상품을 만날 수 있습니다. 금융감독원의 '금융상품 한눈에' 서비스를 활용하는 것도 좋은 방법입니다.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">3. '선저축 후지출'을 위한 자동이체 시스템 구축</h3>
          <p className="mt-2">
            '월급날 = 적금 이체일' 공식을 만드세요. 월급이 들어오자마자 적금 계좌로 자동이체 되도록 설정하면, 소비의 유혹에서 벗어나 강제적으로 저축하는 습관을 만들 수 있습니다. 이것이 목돈 만들기의 가장 확실한 첫걸음입니다.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500">
          <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400">4. 2025년 비과세 종합저축 한도, 놓치지 마세요!</h3>
          <p className="mt-2">
            만 65세 이상 어르신, 장애인 등 특정 조건을 만족한다면 <strong>전 금융기관 통합 5,000만 원 한도</strong> 내에서 발생하는 이자 소득에 대해 세금을 전혀 내지 않는 '비과세 종합저축'에 가입할 수 있습니다. 15.4%의 세금을 아낄 수 있는 강력한 절세 혜택이므로, 해당된다면 반드시 최우선으로 활용해야 합니다.
          </p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-red-500">
          <h3 className="font-bold text-lg text-red-600 dark:text-red-400">5. 고급 스킬: 풍차돌리기 & 선납이연</h3>
          <p className="mt-2">
            <strong>풍차돌리기</strong>는 매달 1년 만기 적금을 새로 가입하여 1년 뒤부터는 매달 적금 만기의 기쁨을 누리는 방법입니다. 꾸준함을 유지하기 좋고, 급전이 필요할 때 일부만 해지할 수 있는 장점이 있습니다. <strong>선납이연</strong>은 일부 상호금융권(신협, 새마을금고 등)에서 가능한 기술로, 납입 회차와 일자를 조절하여 일반 적금보다 높은 실질 이자를 얻는 방법입니다. 다소 복잡하므로 상품 설명서를 충분히 숙지한 후 도전해보는 것을 추천합니다.
          </p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="정기적금 계산기"
      description="매월 꾸준히 모아 목돈을 만들어보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}