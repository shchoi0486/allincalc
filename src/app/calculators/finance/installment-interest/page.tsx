"use client"

import React, { useState, useMemo, createContext } from 'react';
import { NextPage } from 'next';


import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { round } from 'mathjs'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  PieChart,
  Pie,
  PieLabelRenderProps,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'

const COLORS = ['#0088FE', '#FF8042']

const InstallmentInterestCalculator: NextPage = () => {
  const [principal, setPrincipal] = useState<number>(1000000)
  const [months, setMonths] = useState<number>(12)
  const [annualRate, setAnnualRate] = useState<number>(5)
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');

  const [calculationCompleted, setCalculationCompleted] = useState<boolean>(false);

  const calculationResults = useMemo(() => {
    if (principal <= 0 || months <= 0 || annualRate < 0) {
      setCalculationCompleted(false);
      return {
        monthlyPayment: 0,
        totalPayment: 0,
        totalInterest: 0,
        principal: 0,
        principalToTotalInterestRatio: 0,
        totalInterestToTotalPaymentRatio: 0,
      };
    }

    let monthlyPayment = 0;
    let totalPayment = 0;
    let totalInterest = 0;

    if (annualRate === 0) {
      monthlyPayment = principal / months;
      totalPayment = principal;
      totalInterest = 0;
    } else {
      const monthlyRate = annualRate / 100 / 12;
      monthlyPayment =
        principal *
        (monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

      totalPayment = monthlyPayment * months;
      totalInterest = totalPayment - principal;
    }

    const principalToTotalInterestRatio = totalInterest > 0 ? (totalInterest / principal) * 100 : 0;
    const totalInterestToTotalPaymentRatio = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    setCalculationCompleted(true);
    return {
      monthlyPayment: round(monthlyPayment),
      totalPayment: round(totalPayment),
      totalInterest: round(totalInterest),
      principal: principal,
      principalToTotalInterestRatio: round(principalToTotalInterestRatio, 2),
      totalInterestToTotalPaymentRatio: round(totalInterestToTotalPaymentRatio, 2),
    };
  }, [principal, months, annualRate]);

  const pieData = useMemo(() => {
    const principalValue = principal
    if (calculationResults.totalPayment <= 0) return []
    return [
      { name: '원금', value: principalValue },
      { name: '총이자', value: calculationResults.totalInterest },
    ]
  }, [principal, calculationResults.totalInterest, calculationResults.totalPayment])

    const inputSection = (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="principal">할부 원금 (원)</Label>
        <Input
          id="principal"
          type="number"
          value={principal}
          onChange={e => setPrincipal(Number(e.target.value))}
          placeholder="예: 1,000,000"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="months">할부 개월 수</Label>
        <Input
          id="months"
          type="number"
          value={months}
          onChange={e => setMonths(Number(e.target.value))}
          placeholder="예: 12"
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualRate">연 이자율 (%)</Label>
        <Input
          id="annualRate"
          type="number"
          step="0.1"
          value={annualRate}
          onChange={e => setAnnualRate(Number(e.target.value))}
          placeholder="예: 5"
          className="text-right"
        />
      </div>
    </div>
        <Button onClick={() => setCalculationCompleted(true)} className="w-full mt-4">
          계산하기
        </Button>
      </>
    );

    const resultSection = (
      <Card>
        <CardHeader>
          <div className="flex flex-row items-center justify-between">
            <CardTitle>할부 상환 분석</CardTitle>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="table">
              <ToggleGroupItem value="table">테이블</ToggleGroupItem>
              <ToggleGroupItem value="chart">차트</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {calculationCompleted && calculationResults.totalPayment > 0 ? (
        <>
          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>구분</TableHead>
                    <TableHead className="text-right">금액</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>월 상환금</TableCell>
                    <TableCell className="text-right">{formatNumber(calculationResults.monthlyPayment)} 원</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>총 상환액</TableCell>
                    <TableCell className="text-right">{formatNumber(calculationResults.totalPayment)} 원</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>총 이자</TableCell>
                    <TableCell className="text-right text-red-500">{formatNumber(calculationResults.totalInterest)} 원</TableCell>
                  </TableRow>
                  {calculationResults.principal > 0 && (
                    <>
                      <TableRow>
                        <TableCell>원금</TableCell>
                        <TableCell className="text-right">{formatNumber(calculationResults.principal)} 원</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>원금 대비 총 이자율</TableCell>
                        <TableCell className="text-right">{calculationResults.principalToTotalInterestRatio}%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>총 상환액 대비 이자 비율</TableCell>
                        <TableCell className="text-right">{calculationResults.totalInterestToTotalPaymentRatio}%</TableCell>
                      </TableRow>
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }: PieLabelRenderProps) =>
                      `${name} ${((typeof percent === 'number' ? percent : 0) * 100).toFixed(0)}%`
                    }
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) =>
                      `${formatNumber(value)} 원`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          계산 버튼을 눌러 결과를 확인하세요.
        </div>
      )}
        </CardContent>
      </Card>
    );

    const calculatorDescription = (
      <div className="text-base leading-relaxed space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">할부 이자 계산기: 스마트한 소비의 첫걸음</h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          갖고 싶었던 최신형 노트북, 꿈에 그리던 해외여행. 목돈 부담 때문에 망설이셨나요? 할부 구매는 당장의 큰 지출 없이 원하는 것을 얻게 해주는 현대적인 금융 도구입니다. 하지만 이 편리함 뒤에는 '할부 이자'라는 숨은 비용이 존재합니다. 이 계산기는 바로 그 비용을 명확하게 파악하여, 당신이 더 현명하고 계획적인 소비를 할 수 있도록 돕는 나침반이 되어줄 것입니다.
        </p>
        <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">🤔 할부 이자, 왜 내는 걸까요?</h3>
          <p>
            할부 이자는 카드사가 당신을 대신해 가맹점에 상품 대금을 먼저 지불해주고, 당신은 그 돈을 여러 달에 걸쳐 카드사에 갚아나가는 과정에서 발생하는 '금융 서비스 이용료'입니다. 즉, 카드사로부터 단기간 돈을 빌리는 것과 같으며, 그에 대한 대가로 이자를 지불하는 셈입니다. 이자율은 개인의 신용도, 할부 기간, 카드사의 정책에 따라 달라지며, 보통 할부 기간이 길수록 높아집니다.
          </p>
        </div>
        <div className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">🎯 이 계산기는 누구에게 필요할까요?</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>고가의 상품 구매를 앞둔 분:</strong> 자동차, 가전제품, 명품 등 큰 금액의 결제를 할부로 계획 중인 분</li>
            <li><strong>현명한 소비를 지향하는 분:</strong> 단순히 월 납입금만 보는 것이 아니라, 총이자 비용까지 꼼꼼히 따져보고 싶은 분</li>
            <li><strong>재정 계획을 세우는 분:</strong> 할부 구매가 미래의 현금 흐름에 미치는 영향을 정확히 예측하고 싶은 분</li>
            <li><strong>다양한 할부 옵션을 비교하는 분:</strong> 할부 개월 수에 따라 총이자 비용이 어떻게 달라지는지 비교하여 최적의 선택을 하고 싶은 분</li>
          </ul>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-md border border-yellow-200 dark:border-yellow-800">
          <strong>중요:</strong> 본 계산기는 매월 동일한 금액을 상환하는 **'원리금 균등 분할 상환'** 방식을 사용합니다. 이는 대출 상환에 주로 쓰이는 방식으로, 일부 카드사의 할부 방식(원금 균등)과 다를 수 있습니다. 계산 결과는 합리적인 추정치로 활용하시고, 가장 정확한 금액은 카드사 청구서를 통해 확인하시는 것이 좋습니다.
        </p>
      </div>
    );

    const calculationFormula = (
      <div className="text-base leading-relaxed space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">할부 이자, 어떻게 계산될까? (원리금 균등 상환 파헤치기)</h2>
        <p>
          원리금 균등 분할 상환 방식은 매달 갚는 돈(월 상환금)이 할부 기간 내내 동일하다는 특징이 있습니다. 월 상환금은 원금과 이자의 합으로 이루어져 있는데, 상환 초기에는 이자 비중이 높고, 시간이 지날수록 원금 상환 비중이 점차 커지는 구조입니다. 매달 고정된 금액이 지출되므로 재정 계획을 세우기 용이합니다.
        </p>
        <div className="font-mono p-6 bg-gray-100 dark:bg-gray-800 rounded-lg my-4 text-sm shadow-inner">
          <h3 className="font-sans text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">🔢 원리금 균등 상환 월 상환금 공식</h3>
          <p className="mb-2 text-gray-800 dark:text-gray-200">
            <strong className="font-sans text-base">월 상환금</strong> = [원금 × 월이율 × (1 + 월이율)^개월수] / [(1 + 월이율)^개월수 - 1]
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            <strong className="font-sans text-base">총 이자</strong> = (월 상환금 × 개월수) - 원금
          </p>
        </div>
        <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">예시로 쉽게 이해하기</h3>
            <p>100만원짜리 노트북을 연 12% 이자율로 12개월 할부 구매했다면?</p>
            <ul className="list-decimal list-inside space-y-2 mt-3 text-sm">
              <li><strong>원금:</strong> 1,000,000원</li>
              <li><strong>연이율:</strong> 12%</li>
              <li><strong>월이율:</strong> 12% / 12 = 1% (0.01)</li>
              <li><strong>개월 수:</strong> 12개월</li>
              <li><strong>월 상환금:</strong> [1,000,000 × 0.01 × (1 + 0.01)^12] / [(1 + 0.01)^12 - 1] ≈ 88,849원</li>
              <li><strong>총 상환액:</strong> 88,849원 × 12개월 = 1,066,188원</li>
              <li><strong>총 이자:</strong> 1,066,188원 - 1,000,000원 = 66,188원</li>
            </ul>
        </div>
        <div className="mt-6 p-6 bg-green-50 dark:bg-green-900/30 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">비교: 원금 균등 분할 상환 방식</h3>
            <p>신용카드사에서 더 흔히 볼 수 있는 방식입니다. 매달 상환하는 원금은 동일하지만, 이자는 남은 원금에 대해서만 계산되므로 월 상환금이 점차 줄어듭니다.</p>
            <p className="font-mono text-sm mt-2"><strong>월 상환 원금:</strong> 원금 / 개월 수</p>
            <p className="font-mono text-sm"><strong>월 이자:</strong> 남은 원금 × 월이율</p>
            <p className="mt-2 text-sm">초기 상환 부담은 크지만, 총이자 금액은 원리금 균등 방식보다 적다는 장점이 있습니다.</p>
        </div>
      </div>
    );

    const usefulTips = (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-10 mb-4">✨ 할부 이자, 200% 활용하는 7가지 스마트 팁 (2025년 최신판)</h2>
        <div className="space-y-6">
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-blue-500">
            <h4 className="font-bold text-lg text-blue-600 dark:text-blue-400">1. '무이자 할부'의 두 얼굴을 파악하세요.</h4>
            <p className="mt-2">가장 좋은 전략은 단연 무이자 할부입니다. 하지만 모든 무이자가 같은 것은 아닙니다. 카드사가 마케팅 비용으로 이자를 부담하는 '진짜 무이자'가 있는 반면, 판매자가 상품 가격에 이자 비용을 미리 녹여놓은 '무이자처럼 보이는' 경우도 있습니다. 여러 쇼핑몰의 가격을 비교해보는 습관이 필요합니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-green-500">
            <h4 className="font-bold text-lg text-green-600 dark:text-green-400">2. 할부 개월 수, '수수료율 구간'을 확인하세요.</h4>
            <p className="mt-2">할부 개월이 길면 월 부담은 줄지만 총이자는 눈덩이처럼 불어납니다. 특히 카드사들은 2-3개월, 4-6개월 등 특정 구간별로 수수료율을 다르게 책정합니다. 5개월 할부와 6개월 할부의 수수료율이 크게 차이 날 수 있으니, 결제 전 반드시 카드사 앱에서 수수료율 표를 확인하는 것이 절약의 핵심입니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-yellow-500">
            <h4 className="font-bold text-lg text-yellow-600 dark:text-yellow-400">3. '선결제'는 최고의 이자 다이어트.</h4>
            <p className="mt-2">보너스 등 예상치 못한 여유 자금이 생겼다면, 주저 말고 '선결제'를 활용하세요. 할부 원금의 일부 또는 전부를 미리 갚으면, 그만큼 미래에 발생할 이자가 줄어듭니다. 대부분의 카드사 앱에서 간편하게 신청할 수 있으며, 단돈 몇 만 원이라도 미리 갚는 것이 장기적으로 유리합니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-purple-500">
            <h4 className="font-bold text-lg text-purple-600 dark:text-purple-400">4. '리볼빙' 서비스는 최후의 보루로.</h4>
            <p className="mt-2">결제 대금이 부족할 때 유용한 '일부결제금액이월약정(리볼빙)'은 할부와는 개념이 다릅니다. 리볼빙은 평균 10% 후반, 높게는 20%에 육박하는 고금리 서비스로, 한번 이용하기 시작하면 원금이 잘 줄지 않아 빚의 늪에 빠지기 쉽습니다. 할부 이자율보다 훨씬 높으므로, 가급적 이용하지 않는 것이 현명합니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-red-500">
            <h4 className="font-bold text-lg text-red-600 dark:text-red-400">5. 신용점수 관리는 기본 중의 기본.</h4>
            <p className="mt-2">2025년에도 신용점수는 당신의 금융 생활을 좌우하는 가장 중요한 지표입니다. 높은 신용점수는 더 낮은 할부 이자율, 더 높은 한도로 이어집니다. 연체 없이 꾸준히 신용카드를 사용하고, 정기적으로 신용점수를 확인하며 관리하는 것만으로도 미래의 이자 비용을 크게 아낄 수 있습니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-indigo-500">
            <h4 className="font-bold text-lg text-indigo-600 dark:text-indigo-400">6. 카드사별 특별 할부 프로그램을 노리세요.</h4>
            <p className="mt-2">특정 업종(예: 가전, 교육, 병원)에 대해 저리 또는 무이자 할부 혜택을 제공하는 카드가 있습니다. 고가의 결제를 앞두고 있다면, 내가 가진 카드가 어떤 혜택을 제공하는지 미리 확인해보거나, 해당 혜택에 특화된 카드를 발급받는 것도 좋은 전략입니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-gray-50 dark:bg-gray-800 border-l-4 border-gray-500">
            <h4 className="font-bold text-lg text-gray-600 dark:text-gray-400">7. 2025년 금융소비자보호법 강화 동향 주목.</h4>
            <p className="mt-2">금융당국은 소비자가 금융상품의 비용과 위험을 더 명확히 인지할 수 있도록 정보 제공을 강화하고 있습니다. 2025년에는 할부 이자율, 총상환액 등의 핵심 정보가 결제 단계에서 더 눈에 띄게 표시될 가능성이 높습니다. 이러한 변화를 잘 활용하여 불필요한 지출을 막으세요.</p>
          </div>
        </div>
      </div>
    );

    const InfoSection = {
      calculatorDescription: calculatorDescription,
      calculationFormula: calculationFormula,
      usefulTips: usefulTips,
    };

  return (
    <>

      <CalculatorsLayout
        title="할부이자 계산기 (원리금 균등 상환)"
        description="원리금 균등 상환 방식의 할부 이자를 간편하게 계산하고, 원금과 이자 비율을 파이 차트로 확인하세요."
        inputSection={inputSection}
        resultSection={resultSection}
        infoSection={InfoSection}
      />
    </>
  )
}
export default InstallmentInterestCalculator
