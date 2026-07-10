"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { formatNumber, parseNumber } from "@/utils/formatNumber";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function CagrCalculator() {
  const [startValue, setStartValue] = useState<number>(10000000);
  const [endValue, setEndValue] = useState<number>(20000000);
  const [period, setPeriod] = useState<number>(5);
  const [cagr, setCagr] = useState<number | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [view, setView] = useState('chart');

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const calculate = () => {
    if (isNaN(startValue) || startValue <= 0) {
      toast.error("초기 자산을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(endValue)) {
      toast.error("최종 자산을 올바르게 입력해주세요.");
      return;
    }
    if (isNaN(period) || period <= 0) {
      toast.error("투자 기간을 올바르게 입력해주세요.");
      return;
    }

    const cagrValue = (Math.pow(endValue / startValue, 1 / period) - 1) * 100;

    if (isNaN(cagrValue) || !isFinite(cagrValue)) {
      setCagr(null);
      setChartData([]);
      toast.error("계산 결과가 유효하지 않습니다. 입력값을 확인해주세요.");
      return;
    }

    setCagr(cagrValue);

    const data = Array.from({ length: period + 1 }, (_, i) => {
      const year = i;
      const value = startValue * Math.pow(1 + cagrValue / 100, year);
      return {
        year: `${year}년차`,
        '자산가치': parseFloat(value.toFixed(0)),
      };
    });
    setChartData(data);
    toast.success("CAGR 계산이 완료되었습니다.");
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="startValue">초기 자산 (원)</Label>
        <Input
          id="startValue"
          value={startValue.toLocaleString()}
          onChange={handleInputChange(setStartValue)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="endValue">최종 자산 (원)</Label>
        <Input
          id="endValue"
          value={endValue.toLocaleString()}
          onChange={handleInputChange(setEndValue)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <div>
        <Label htmlFor="period">투자 기간 (년)</Label>
        <Input
          id="period"
          value={period.toLocaleString()}
          onChange={handleInputChange(setPeriod)}
          className="text-right"
          type="text"
          inputMode="numeric"
        />
      </div>
      <Button onClick={calculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <div className="h-full w-full flex flex-col">
      {cagr !== null ? (
        <div className="text-center mb-4">
          <p className="text-lg text-muted-foreground">연평균 성장률 (CAGR)</p>
          <p className="text-4xl sm:text-5xl font-bold text-primary">
            {cagr.toFixed(2)}%
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p>계산 결과가 여기에 표시됩니다.</p>
        </div>
      )}
      {cagr !== null && chartData.length > 0 && (
        <div className="flex-grow">
          <div className="flex justify-end mb-2">
            <ToggleGroup type="single" value={view} onValueChange={(value) => value && setView(value)} size="sm">
              <ToggleGroupItem value="chart">차트</ToggleGroupItem>
              <ToggleGroupItem value="table">표</ToggleGroupItem>
            </ToggleGroup>
          </div>
          {view === 'chart' ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" fontSize={12} />
                <YAxis tickFormatter={(value) => value.toLocaleString()} fontSize={12} />
                <RechartsTooltip formatter={(value: number) => `${value.toLocaleString()} 원`} />
                <Legend />
                <Line type="monotone" dataKey="자산가치" stroke="hsl(var(--primary))" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="max-h-[300px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>연도</TableHead>
                    <TableHead className="text-right">자산가치 (원)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {chartData.map((data) => (
                    <TableRow key={data.year}>
                      <TableCell>{data.year}</TableCell>
                      <TableCell className="text-right">{data.자산가치.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const infoSectionContent = {
    calculatorDescription: (
      <>
        <h2 className="text-2xl font-bold mb-4">CAGR 계산기: 투자의 진정한 성과를 측정하는 눈</h2>
        <p className="text-gray-700 dark:text-gray-300">
          변동성이 큰 투자의 세계에서 특정 기간의 수익률만 보고 웃고 우는 것은 나무만 보고 숲을 보지 못하는 것과 같습니다. <strong>연평균 성장률(CAGR, Compound Annual Growth Rate)</strong>은 바로 그 숲, 즉 당신의 투자가 시간이 지남에 따라 어떤 '평균적인' 성장세를 보였는지 알려주는 강력한 나침반입니다. 매년 들쑥날쑥하는 수익률의 안개를 걷어내고, 마치 매년 일정하게 복리로 성장한 것처럼 환산하여 투자의 장기적인 성과를 명료하게 보여줍니다.
        </p>
        <p className="mt-4 text-gray-700 dark:text-gray-300">
          All-in-Calc의 CAGR 계산기는 주식, 펀드, 부동산, 암호화폐 등 다양한 자산의 성과를 객관적으로 평가하고, 여러 투자 대안을 동일한 기준으로 비교할 수 있도록 돕습니다. 더 나아가 기업의 매출 성장률, 사용자 증가 추이 등 비즈니스 성과를 분석하는 데에도 핵심적인 지표로 활용될 수 있습니다. 이제 복잡한 계산은 저희에게 맡기고, 당신은 데이터가 말해주는 통찰에만 집중하세요.
        </p>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-xl font-semibold mt-6 mb-4">📈 CAGR 공식, 복리의 마법을 숫자로 풀다</h3>
        <p className="mb-4">
          CAGR의 핵심은 '복리'의 개념을 역으로 추적하는 데 있습니다. 최종 자산이 초기 자산으로부터 매년 복리로 성장했다고 가정할 때, 그 평균적인 연간 성장률이 얼마인지를 계산하는 것입니다.
        </p>
        <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-inner">
          <p className="font-mono text-xl tracking-wider"><strong>CAGR (%) = [ ( 최종 가치 / 초기 가치 )^(1 / 기간) - 1 ] * 100</strong></p>
        </div>
        <div className="mt-6 space-y-4 text-sm">
          <p><strong className="text-blue-600">- 최종 가치 / 초기 가치:</strong> 전체 기간 동안 자산이 총 몇 배로 성장했는지를 나타냅니다.</p>
          <p><strong className="text-green-600">- ^(1 / 기간):</strong> '거듭제곱근' 계산입니다. 총 성장 배수를 투자 기간(년)으로 나누어 연평균 성장률을 구하는 과정입니다. 예를 들어 5년이면 5제곱근을, 10년이면 10제곱근을 취하는 것과 같습니다.</p>
          <p><strong className="text-red-600">- (- 1) * 100:</strong> 계산된 연평균 성장률을 백분율(%)로 변환합니다.</p>
        </div>
        <div className="mt-6 p-4 border-l-4 border-yellow-500 bg-yellow-50 dark:bg-gray-800">
          <h4 className="font-semibold text-md mb-2">계산 예시)</h4>
          <p>2020년 초에 1,000만 원으로 시작한 투자가 2025년 초에 2,500만 원이 되었다면, 투자 기간은 5년입니다.</p>
          <ul className="list-decimal list-inside mt-2 space-y-1">
            <li>총 성장 배수: 2,500만 원 / 1,000만 원 = 2.5배</li>
            <li>연평균 성장률 환산: 2.5 ^ (1/5) ≈ 1.2011</li>
            <li>백분율 변환: (1.2011 - 1) * 100 ≈ 20.11%</li>
          </ul>
          <p className="mt-2 font-semibold">→ 즉, 이 투자는 5년간 매년 평균 <strong>20.11%</strong>씩 복리로 성장한 것과 같습니다.</p>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-xl font-semibold mt-6 mb-4">💡 투자 고수처럼 CAGR 활용하기: 5가지 실전 전략</h3>
        <ul className="space-y-6">
          <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">1. '기간'이 다른 투자 성과, 공정하게 비교하기</h4>
            <p>"A 주식은 3년간 50% 수익, B 펀드는 5년간 80% 수익." 언뜻 보면 B 펀드가 더 우수해 보입니다. 정말 그럴까요? CAGR로 연평균 수익률을 계산해보면 진실이 보입니다.<br/>- A 주식 CAGR: ((1.5)^(1/3) - 1) * 100 ≈ <strong>14.47%</strong><br/>- B 펀드 CAGR: ((1.8)^(1/5) - 1) * 100 ≈ <strong>12.47%</strong><br/>결론적으로 연평균 성장률은 A 주식이 더 높았습니다. 이처럼 CAGR은 투자 기간의 함정을 제거하고 객관적인 비교를 가능하게 합니다.</p>
          </li>
          <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">2. '과정의 변동성'이라는 숨겨진 리스크를 인지하기</h4>
            <p>CAGR은 시작과 끝만 보기 때문에 중간의 롤러코스터 같은 변동성을 보여주지 않습니다. CAGR 10%를 달성한 두 상품이 있더라도, 하나는 꾸준히 성장했고 다른 하나는 +100%와 -50%를 오갔을 수 있습니다. 높은 변동성은 투자 심리를 흔들어 잘못된 매매를 유발할 수 있습니다. CAGR과 함께 <strong>표준편차</strong>나 <strong>MDD(최대 낙폭)</strong> 같은 변동성 지표를 함께 확인하여 투자의 '질'을 평가하는 습관을 들이세요.</p>
          </li>
          <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">3. 과거 데이터는 참고자료일 뿐, 미래를 보장하지 않는다</h4>
            <p>과거의 높은 CAGR이 미래의 고수익을 약속하는 수정 구슬은 아닙니다. 특히 기술주처럼 폭발적으로 성장한 산업의 과거 CAGR은 매우 높게 나타날 수 있습니다. 과거 성과의 원인을 분석하고, <strong>산업의 패러다임 변화, 경쟁 환경, 규제 리스크, 기업의 펀더멘털</strong> 등 질적 요소를 반드시 함께 고려하여 미래 성장 지속 가능성을 판단해야 합니다.</p>
          </li>
          <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">4. '72의 법칙'으로 복리의 힘을 직관적으로 이해하기</h4>
            <p>CAGR과 함께 알아두면 유용한 것이 '72의 법칙'입니다. <strong>'72 / CAGR(%) ≈ 원금이 2배가 되는 기간(년)'</strong> 입니다. 예를 들어, CAGR이 12%라면 원금이 2배가 되는 데 약 6년(72/12)이 걸린다고 빠르게 어림짐작할 수 있습니다. 이는 장기 투자의 목표를 세우고 복리의 힘을 체감하는 데 유용한 사고 도구입니다.</p>
          </li>
          <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
            <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">5. CAGR의 한계를 명확히 알고 보완 지표 활용하기</h4>
            <p>CAGR은 중간에 자금을 추가 투입하거나 인출하는 경우를 전혀 반영하지 못합니다. 매월 적립식으로 투자하는 경우, CAGR은 실제 최종 수익률과 큰 차이를 보일 수 있습니다. 이럴 때는 현금 흐름까지 고려하는 <strong>금액가중수익률(MWRR)</strong>이나, 외부 요인(입출금)을 제거하고 순수 운용 성과만 측정하는 <strong>시간가중수익률(TWRR)</strong>을 참고하는 것이 더 정확할 수 있습니다. CAGR의 한계를 명확히 인지하고 상황에 맞는 지표를 선택하는 것이 중요합니다.</p>
          </li>
        </ul>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title="CAGR (연평균 성장률) 계산기"
      description="투자의 연평균 성장률을 계산하여 성과를 측정합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSectionContent}
    />
  );
}