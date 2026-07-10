'use client';

import { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// 2025년 근로소득 간이세액표 (일부, 1인 가구 기준)
const incomeTaxTable: { max: number; tax: number }[] = [
  { max: 1060000, tax: 0 },
  { max: 1500000, tax: 6210 },
  { max: 2000000, tax: 25380 },
  { max: 2500000, tax: 61380 },
  { max: 3000000, tax: 113380 },
  { max: 3500000, tax: 187010 },
  { max: 4000000, tax: 277010 },
  { max: 4500000, tax: 382010 },
  { max: 5000000, tax: 497140 },
  { max: 6000000, tax: 737140 },
  { max: 7000000, tax: 1012140 },
  { max: 8000000, tax: 1322140 },
  { max: Infinity, tax: 1662140 },
];

const getIncomeTax = (monthlyTaxableIncome: number, dependents: number) => {
  // 부양가족 수에 따른 공제 (단순화된 예시)
  const deduction = (dependents - 1) * 20000;
  const taxableIncomeAfterDependents = Math.max(0, monthlyTaxableIncome - deduction);

  const matchedBracket = incomeTaxTable.find(bracket => taxableIncomeAfterDependents < bracket.max);
  return matchedBracket ? matchedBracket.tax : incomeTaxTable[incomeTaxTable.length - 1].tax;
};

export default function SalaryCalculator() {
  const [annualSalary, setAnnualSalary] = useState('50,000,000');
  const [nonTaxableAmount, setNonTaxableAmount] = useState('2,400,000'); // 식대 20만원 * 12개월
  const [dependents, setDependents] = useState('1');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    const annual = parseNumber(annualSalary);
    const nonTaxable = parseNumber(nonTaxableAmount);
    const numDependents = parseInt(dependents, 10);

    const taxableAnnual = annual - nonTaxable;
    const monthlySalary = annual / 12;
    const monthlyTaxable = taxableAnnual / 12;

    // 2025년 기준
    const nationalPensionMin = 390000;
    const nationalPensionMax = 6170000;
    const monthlySalaryForPension = Math.max(nationalPensionMin, Math.min(monthlySalary, nationalPensionMax));
    
    const nationalPension = monthlySalaryForPension * 0.045;
    const healthInsurance = monthlyTaxable * 0.03545;
    const longTermCareInsurance = healthInsurance * 0.1295; // 건강보험료의 12.95% (변동 가능)
    const employmentInsurance = monthlySalary * 0.009;

    const incomeTax = getIncomeTax(monthlyTaxable, numDependents);
    const localIncomeTax = incomeTax * 0.1;

    const totalDeductions = nationalPension + healthInsurance + longTermCareInsurance + employmentInsurance + incomeTax + localIncomeTax;
    const netMonthlySalary = monthlySalary - totalDeductions;

    setResult({
      annualSalary: annual,
      monthlySalary,
      nonTaxable,
      deductions: {
        nationalPension,
        healthInsurance,
        longTermCareInsurance,
        employmentInsurance,
        incomeTax,
        localIncomeTax,
      },
      totalDeductions,
      netMonthlySalary,
      netAnnualSalary: netMonthlySalary * 12,
    });
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="annualSalary">연봉 (세전)</Label>
        <Input id="annualSalary" value={annualSalary} onChange={e => setAnnualSalary(formatNumber(e.target.value))} className="text-right" />
      </div>
      <div>
        <Label htmlFor="nonTaxableAmount">연간 비과세액 (식대, 차량유지비 등)</Label>
        <Input id="nonTaxableAmount" value={nonTaxableAmount} onChange={e => setNonTaxableAmount(formatNumber(e.target.value))} className="text-right" />
      </div>
      <div>
        <Label htmlFor="dependents">부양가족 수 (본인 포함)</Label>
        <Select value={dependents} onValueChange={setDependents}>
            <SelectTrigger>
                <SelectValue placeholder="부양가족 수를 선택하세요" />
            </SelectTrigger>
            <SelectContent>
                {[...Array(10)].map((_, i) => (
                    <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}명</SelectItem>
                ))}
            </SelectContent>
        </Select>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = result ? (
    <Card>
      <CardHeader>
        <CardTitle>예상 실수령액</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-lg">월 실수령액</p>
          <p className="text-3xl font-bold text-blue-600">{formatNumber(Math.round(result.netMonthlySalary))}원</p>
          <p className="text-muted-foreground mt-1">연 실수령액: {formatNumber(Math.round(result.netAnnualSalary))}원</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>공제 항목</TableHead>
              <TableHead className="text-right">금액 (월)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>국민연금 (4.5%)</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.nationalPension))}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>건강보험 (3.545%)</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.healthInsurance))}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>장기요양보험</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.longTermCareInsurance))}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>고용보험 (0.9%)</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.employmentInsurance))}원</TableCell>
            </TableRow>
            <TableRow className="font-semibold">
              <TableCell>4대 보험 합계</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.nationalPension + result.deductions.healthInsurance + result.deductions.longTermCareInsurance + result.deductions.employmentInsurance))}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>소득세 (간이세액)</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.incomeTax))}원</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>지방소득세 (10%)</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.deductions.localIncomeTax))}원</TableCell>
            </TableRow>
            <TableRow className="text-lg font-bold bg-gray-50 dark:bg-gray-800">
              <TableCell>총 공제액</TableCell>
              <TableCell className="text-right">{formatNumber(Math.round(result.totalDeductions))}원</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-40">정보 입력 후 계산하기 버튼을 눌러주세요.</div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          '내 통장에 찍히는 진짜 내 돈은 얼마일까?' 모든 직장인의 공통적인 궁금증일 겁니다. <strong>연봉 계산기</strong>는 계약서에 명시된 연봉(세전 금액)을 기준으로, 복잡한 4대 보험과 세금을 제외하고 매달 실제로 수령하게 될 금액(세후 금액)을 정확하게 계산해주는 스마트한 도구입니다.
        </p>
        <p>
          단순히 숫자만 확인하는 것을 넘어, 내 월급에서 어떤 항목들이 얼마나 공제되는지 명확히 파악할 수 있습니다. 이를 통해 합리적인 소비 계획을 세우고, 비과세 항목을 활용한 절세 전략을 수립하는 등 현명한 재무 관리의 첫걸음을 뗄 수 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">실수령액은 연봉에서 비과세 소득을 제외한 과세 대상 금액을 기준으로 각종 공제 항목을 뺀 금액입니다. 주요 공제 항목은 다음과 같습니다. (2025년 기준)</p>
        
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">1. 4대 사회보험</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>국민연금 (근로자 4.5%):</strong> 월 소득액의 4.5%를 공제합니다. (월 소득 상한 617만원, 하한 39만원 적용)
            </li>
            <li><strong>건강보험 (근로자 3.545%):</strong> 과세 대상 월 급여의 3.545%를 공제합니다.</li>
            <li><strong>장기요양보험:</strong> 산출된 건강보험료의 12.95%를 추가로 공제합니다. (요율은 매년 변동될 수 있습니다)</li>
            <li><strong>고용보험 (근로자 0.9%):</strong> 전체 월 급여의 0.9%를 공제합니다.</li>
          </ul>
        </div>

        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-green-500">
          <h3 className="text-lg font-bold text-green-600 dark:text-green-400 mb-3">2. 소득세 및 지방소득세</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>소득세:</strong> 과세 대상 월 급여와 부양가족 수에 따라 국세청의 '근로소득 간이세액표'를 기준으로 결정됩니다. 본 계산기는 이를 바탕으로 한 추정치를 제공합니다.</li>
            <li><strong>지방소득세:</strong> 산출된 소득세의 10%를 공제합니다.</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">💡 연봉 200% 활용을 위한 직장인 재테크 꿀팁</h2>
        
        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
          <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">1. '비과세 항목'을 최대로 활용하라</h3>
          <p className="mt-2">연봉 협상 시, 비과세 항목을 적극적으로 활용하면 실질 소득을 높일 수 있습니다. 대표적인 비과세 항목은 다음과 같습니다.</p>
          <ul className="list-disc list-inside mt-3 space-y-2 text-sm">
            <li><strong>식대:</strong> 월 20만원까지 비과세 (연 240만원)</li>
            <li><strong>차량유지비(자가운전보조금):</strong> 본인 명의 차량을 업무에 사용할 경우 월 20만원까지 비과세</li>
            <li><strong>육아수당:</strong> 만 6세 이하 자녀가 있을 경우 월 20만원까지 비과세</li>
          </ul>
          <p className="mt-2 text-sm">예를 들어 연봉 5,000만원인 경우, 식대 비과세 240만원을 적용하면 과세 대상 소득이 4,760만원으로 줄어들어 4대 보험료와 소득세를 모두 절약할 수 있습니다.</p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500">
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400">2. 연말정산, 미리 준비하는 자가 '13월의 월급'을 얻는다</h3>
          <p className="mt-2">연말정산은 1년 동안 낸 세금을 최종 정산하는 과정입니다. 어떻게 준비하느냐에 따라 세금을 돌려받을 수도, 더 낼 수도 있습니다. 신용카드/체크카드 사용액, 의료비, 교육비, 월세액 등 공제 항목을 꼼꼼히 챙겨두세요. 특히 <strong>연금저축/IRP</strong>는 연간 최대 900만원까지 세액공제가 가능한 강력한 절세 상품이므로, 노후 준비와 절세를 동시에 잡는 것을 추천합니다.</p>
        </div>

        <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-yellow-500">
          <h3 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">3. 연봉 협상, '세전' 기준으로 당당하게 요구하라</h3>
          <p className="mt-2">모든 연봉 협상은 '세전' 금액을 기준으로 진행됩니다. 협상 전, 동종 업계와 직무의 평균 연봉 수준을 파악하고(커리어 플랫폼, 채용 사이트 등 활용), 지난 1년간의 자신의 성과를 구체적인 수치와 사례로 정리해두는 것이 중요합니다. 막연한 인상 요구보다는, '매출 10% 상승에 기여', '프로젝트 기간 2주 단축' 등 명확한 근거를 제시할 때 성공 확률이 높아집니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="연봉 실수령액 계산기"
      description="4대 보험과 세금을 제외한 내 진짜 월급은 얼마일까요?"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}