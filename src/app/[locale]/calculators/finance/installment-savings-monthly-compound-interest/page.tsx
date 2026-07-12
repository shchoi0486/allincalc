'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { NextPage } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';

const InstallmentSavingsMonthlyCompoundInterestCalculator: NextPage = () => {
  const [initialPrincipal, setInitialPrincipal] = useState<number>(0);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(100000);
  const [period, setPeriod] = useState<number>(12);
  const [annualInterestRate, setAnnualInterestRate] = useState<number>(5);
  const [depositTiming, setDepositTiming] = useState<'beginning' | 'end'>('beginning');
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setter(parseFloat(value || '0'));
  };
  
  const handlePeriodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setPeriod(parseInt(value || '0', 10));
  }

  const calculationResult = useMemo(() => {
    const principal = initialPrincipal;
    const monthly = monthlyDeposit;
    const months = period;
    const rate = annualInterestRate / 100;

    if (isNaN(principal) || isNaN(monthly) || isNaN(months) || isNaN(rate) || months <= 0 || rate <= 0) {
      return null;
    }

    const monthlyRate = rate / 12;
    let totalPrincipal = principal;
    let totalAmount = principal;
    const tableData = [];
    const chartData = [];

    for (let i = 1; i <= months; i++) {
      let interestThisMonth = 0;
      if (depositTiming === 'beginning') {
        totalAmount += monthly;
        totalPrincipal += monthly;
        interestThisMonth = totalAmount * monthlyRate;
        totalAmount += interestThisMonth;
      } else { // end of month
        interestThisMonth = totalAmount * monthlyRate;
        totalAmount += interestThisMonth;
        totalAmount += monthly;
        totalPrincipal += monthly;
      }

      tableData.push({
        month: i,
        principal: Math.round(totalPrincipal),
        interest: Math.round(interestThisMonth),
        total: Math.round(totalAmount),
      });

      chartData.push({
        name: `${i}개월`,
        원금: Math.round(totalPrincipal),
        이자와원금: Math.round(totalAmount),
      });
    }

    const totalInterest = totalAmount - totalPrincipal;

    return {
      totalPrincipal: Math.round(totalPrincipal),
      totalInterest: Math.round(totalInterest),
      totalAmount: Math.round(totalAmount),
      tableData,
      chartData,
    };
  }, [initialPrincipal, monthlyDeposit, period, annualInterestRate, depositTiming]);

  const handleCalculate = useCallback(() => {
    if (calculationResult) {
      setResult(calculationResult);
      toast.success('계산이 완료되었습니다.');
    } else {
      toast.error('입력값을 확인해주세요.');
    }
  }, [calculationResult]);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="initialPrincipal">초기 투자금 (원)</Label>
        <Input id="initialPrincipal" value={initialPrincipal.toLocaleString()} onChange={handleInputChange(setInitialPrincipal)} className="text-right" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="monthlyDeposit">월 적립금 (원)</Label>
        <Input id="monthlyDeposit" value={monthlyDeposit.toLocaleString()} onChange={handleInputChange(setMonthlyDeposit)} className="text-right" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="period">투자기간 (개월)</Label>
        <Input id="period" value={period.toLocaleString()} onChange={handlePeriodChange} className="text-right" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="annualInterestRate">연 이자율 (%)</Label>
        <Input id="annualInterestRate" value={annualInterestRate.toLocaleString()} onChange={handleInputChange(setAnnualInterestRate)} className="text-right" />
      </div>
      <div className="space-y-2">
        <Label>적립 시점</Label>
        <ToggleGroup
          type="single"
          value={depositTiming}
          onValueChange={(value: 'beginning' | 'end') => value && setDepositTiming(value)}
          className="grid grid-cols-2"
        >
          <ToggleGroupItem value="beginning">월초</ToggleGroupItem>
          <ToggleGroupItem value="end">월말</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
    </div>
  );

  const resultSection = (
    <>
      {result ? (
        <Card className="p-2">
          <CardHeader className="p-2">
            <CardTitle className="text-lg">계산 결과</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 p-2">
            <div className="flex justify-between">
              <span className="font-medium text-sm">총 원금</span>
              <span className="text-base">{result.totalPrincipal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-sm">총 이자 (세전)</span>
              <span className="text-blue-500 text-base">{result.totalInterest.toLocaleString()}원</span>
            </div>
            <Separator />
            <div className="flex justify-between text-base font-bold">
              <span>만기지급금액</span>
              <span className="text-xl font-bold text-primary">{result.totalAmount.toLocaleString()}원</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-full">
          입력 후 계산하기 버튼을 눌러주세요.
        </div>
      )}
    </>
  );

  const fullWidthSection = result ? (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chart">차트</TabsTrigger>
        <TabsTrigger value="details">월별 상세 내역</TabsTrigger>
      </TabsList>
      <TabsContent value="chart">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={result.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()}원`} />
              <Legend />
              <Line type="monotone" dataKey="원금" stroke="#8884d8" />
              <Line type="monotone" dataKey="이자와원금" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>개월차</TableHead>
                <TableHead className="text-right">원금</TableHead>
                <TableHead className="text-right">이자 (세전)</TableHead>
                <TableHead className="text-right">누계</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.tableData.map((data: any) => (
                <TableRow key={data.month}>
                  <TableCell>{data.month}</TableCell>
                  <TableCell className="text-right">{data.principal.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{data.interest.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{data.total.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  ) : null;

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-6">
        <p>
          <strong>월복리 적금 계산기</strong>는 재테크의 가장 기본이면서도 강력한 원리인 '복리'의 힘을 시각적으로 체험하게 해주는 스마트한 도구입니다. 
          "투자의 대가 워렌 버핏이 '복리는 세계 8대 불가사의'라고 칭했을 만큼, 그 효과는 시간이 지날수록 상상을 초월합니다." 
          이 계산기는 매월 꾸준히 납입하는 소중한 저축액이 시간과 이자율이라는 두 개의 날개를 달고 어떻게 거대한 눈덩이처럼 불어나는지를 명확하게 보여줍니다.
        </p>
        <p>
          단순히 만기 금액을 알려주는 데 그치지 않고, <strong>월초/월말 납입 선택</strong>이라는 미세한 차이가 어떤 나비효과를 가져오는지, 
          금리가 0.1% 변동할 때 미래 자산이 얼마나 달라지는지 등 다양한 시나리오를 시뮬레이션할 수 있습니다. 
          이를 통해 막연했던 '1억 만들기', '결혼 자금 마련'과 같은 재무 목표를 구체적인 월 납입액과 기간으로 변환하고, 실현 가능한 계획으로 만들어 나갈 수 있습니다.
        </p>
        <p>
          특히 사회초년생이나 목돈 마련을 처음 시작하는 분들에게 이 계산기는 훌륭한 금융 멘토가 될 것입니다. 
          차트와 상세 내역표를 통해 매월 원금이 쌓이고 이자가 붙는 과정을 직접 눈으로 확인하며 저축의 재미와 동기부여를 얻어보세요. 
          지금 바로 당신의 미래를 위한 첫걸음을 시작해보세요!
        </p>        <TermGlossary items={[
          { term: '월복리', desc: '매월 발생한 이자를 원금에 합산하여 다음 달 이자에 포함시키는 방식으로, 단리보다 장기적으로 유리합니다.' },
          { term: '기수불 / 기말불', desc: '매월 초(기수불)에 납입하면 말(기말불)보다 한 달치 이자를 더 받아 최종 수령액이 커집니다.' },
          { term: '비과세 종합저축', desc: '요건 충족 시 전 금융기관 통합 5,000만 원 한도 내 이자 소득이 면제되는 적금 상품입니다.' },
        ]} />

      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-8">
        <div>
          <h3 className="text-xl font-bold text-foreground mb-3">📈 복리, 이자가 이자를 낳는 마법</h3>
          <p>
            복리(Compound Interest)는 '이자에 대한 이자'가 붙는다는 점에서 단리(Simple Interest)와 근본적인 차이를 가집니다. 
            단리가 원금에 대해서만 꾸준히 동일한 이자를 지급하는 방식이라면, 복리는 발생한 이자를 원금에 포함시켜(원금화하여) 다음 기간의 이자를 계산합니다. 
            이 작은 차이가 장기적으로는 자산을 기하급수적으로 증가시키는 '눈덩이 효과(Snowball Effect)'를 만들어냅니다.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-3">🧮 월복리 적금 만기액 계산 공식 완전 정복</h3>
          <p className="mb-4">
            월복리 적금의 최종 수령액은 매월 언제 납입하는지에 따라 달라집니다. 하루라도 먼저 넣는 것이 이득이라는 사실을 수식으로 확인해 보세요.
          </p>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">1. 월초 납입 (기수불, Annuity Due)</h4>
            <p className="mt-2 mb-3 text-sm">매월 1일 등 초반에 납입하는 경우입니다. 납입금이 한 달치 이자를 온전히 다 받기 때문에 월말 납입보다 유리합니다.</p>
            <p className="font-mono p-4 bg-card rounded-md text-sm break-words">
              S = A × (1 + r) × [ ( (1 + r)ⁿ - 1 ) / r ]
            </p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary mt-6">
            <h4 className="font-bold text-lg text-primary">2. 월말 납입 (기말불, Ordinary Annuity)</h4>
            <p className="mt-2 mb-3 text-sm">매월 31일 등 마지막 날에 납입하는 경우입니다. 월초 납입 공식에서 이자를 한 번 덜 받는 (1+r) 항이 빠진 것을 볼 수 있습니다.</p>
            <p className="font-mono p-4 bg-card rounded-md text-sm break-words">
              S = A × [ ( (1 + r)ⁿ - 1 ) / r ]
            </p>
          </div>
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p><strong className="font-semibold text-foreground">S</strong>: 만기 시 총 수령액 (원금 + 이자)</p>
            <p><strong className="font-semibold text-foreground">A</strong>: 매월 납입하는 금액 (월 적립금)</p>
            <p><strong className="font-semibold text-foreground">r</strong>: 월 이자율 (연이율 / 12)</p>
            <p><strong className="font-semibold text-foreground">n</strong>: 총 납입 개월 수 (기간)</p>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">계산 예시 (월 10만 원, 12개월, 연 5%, 월초 납입)</h4>
            <p className="text-sm text-muted-foreground">r = 5% / 12 ≈ 0.0041667</p>
            <p className="font-mono text-sm text-primary mt-1">S = 100,000 × 1.0041667 × [((1.0041667)^12 − 1) / 0.0041667] ≈ 1,229,980원</p>
            <p className="text-xs text-muted-foreground mt-1">원금 합계 1,200,000원 대비 이자 약 29,980원 (월말 납입 시 약 1,225,132원)</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">🚀 2025년, 당신의 적금을 성공으로 이끌 7가지 필승 전략</h2>
        <div className="space-y-6">
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">1. '시간의 마법'을 믿고, 지금 당장 시작하세요.</h4>
            <p className="mt-2">복리의 가장 친한 친구는 '시간'입니다. 25세에 매월 30만원씩 연 5% 복리 적금을 시작하면 60세에 약 4억 3천만원을 모을 수 있지만, 10년 늦은 35세에 시작하면 약 2억 3천만원에 그칩니다. 10년의 차이가 2억원의 차이를 만듭니다. 소액이라도 괜찮습니다. 중요한 것은 '지금 바로' 시작하는 것입니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">2. 세금, 모르면 손해! '세금우대'와 '비과세'를 적극 활용하세요.</h4>
            <p className="mt-2">일반적인 적금 이자에는 <strong>15.4%</strong>의 세금이 붙습니다. 하지만 2025년부터 확대되는 ISA(개인종합자산관리계좌) 등을 활용하면 절세 혜택을 누릴 수 있습니다. 또한, 청년희망적금이나 특정 조건을 만족하는 경우 <strong>9.5%의 저율과세</strong>나 <strong>완전 비과세</strong> 혜택을 받을 수 있는 상품도 있으니, 가입 전 자신의 조건에 맞는 '세테크' 상품을 반드시 확인하세요. 5,000만원 한도의 비과세 종합저축도 잊지 마세요.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">3. '월초 납입' 습관, 티끌 모아 태산을 만듭니다.</h4>
            <p className="mt-2">급여일이 25일이라면, 자동이체일을 26일로 설정하는 것보다 다음달 1일로 설정하는 것이 좋습니다. 이 계산기로 직접 시뮬레이션 해보세요. 5년간 매월 50만원을 연 4%로 적금할 경우, 월말 납입 대비 월초 납입 시 약 5만원의 이자를 더 받을 수 있습니다. 작아 보이지만, 이러한 디테일이 모여 부를 이룹니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">4. '실질금리'를 계산하여 돈의 가치를 지키세요.</h4>
            <p className="mt-2">은행이 제시하는 연 5% 금리는 '명목금리'입니다. 만약 그 해의 물가상승률이 3%라면, 내 돈의 실질적인 구매력은 2%만 증가한 셈입니다. 2025년 경제 전망에서 예상하는 물가상승률(예: 2~3%)을 고려하여, 적어도 그 이상의 금리를 제공하는 상품을 선택하는 것이 자산 가치 하락을 막는 현명한 방법입니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">5. '만기 유지'는 철칙, '긴급 예비 자금'을 준비하세요.</h4>
            <p className="mt-2">적금을 중도에 해지하면 약정된 복리 이자는커녕, 푼돈 수준의 중도해지이율이 적용됩니다. 갑작스러운 지출 때문에 적금을 깨는 상황을 막기 위해, 최소 3~6개월치 생활비에 해당하는 '긴급 예비 자금'을 별도의 파킹통장 등에 마련해두는 것이 필수입니다.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">6. '특판 상품'과 '제2금융권'을 노리세요.</h4>
            <p className="mt-2">시중 은행보다 저축은행, 신협, 새마을금고 등 제2금융권이 일반적으로 더 높은 금리를 제공합니다. <strong>예금자보호법에 따라 1인당, 1개 금융기관 당 원리금 5,000만원까지 보호</strong>되므로, 이 한도 내에서 제2금융권의 고금리 상품을 적극적으로 활용하는 것이 스마트한 전략입니다. 특히 연말이나 연초에 나오는 '특판 적금'은 한도가 금방 소진되니, 금융 앱 알림 등을 통해 정보를 놓치지 마세요.</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">7. '72의 법칙'으로 미래를 예측하세요.</h4>
            <p className="mt-2">'72의 법칙'은 복리 이자로 원금이 2배가 되는 데 걸리는 시간을 어림짐작하는 유용한 공식입니다. <strong>'72 ÷ 연이율(%)'</strong>을 계산하면 됩니다. 예를 들어, 연 6% 복리 상품이라면 원금이 2배가 되는 데 약 12년(72 ÷ 6)이 걸립니다. 이 법칙을 이용해 여러 상품의 잠재력을 빠르게 비교하고 장기적인 재무 계획을 세워보세요.</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="월 복리 적금 계산기"
      description="매월 꾸준히 모아 목돈을 만드는 월 복리 적금, 만기 예상 금액을 확인해보세요."
      variant="grouped"
      fullWidthSection={fullWidthSection}
      fullWidthTitle="상세 분석"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default InstallmentSavingsMonthlyCompoundInterestCalculator;