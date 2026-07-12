'use client'

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatNumber } from '@/utils/formatNumber';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ChartData {
    month: number;
    monthlyPayment: number;
    principal: number;
    interest: number;
}

export default function LevelPaymentPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;
    const monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalRepayment = monthlyPayment * months;
    const totalInterest = totalRepayment - principal;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      remainingBalance -= principalPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: Math.round(principalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(monthlyPayment),
        remainingBalance: Math.round(remainingBalance < 0 ? 0 : remainingBalance),
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            monthlyPayment: parseFloat(monthlyPayment.toFixed(0)),
            principal: parseFloat(principalPayment.toFixed(0)),
            interest: parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: totalRepayment,
      monthlyPayment: monthlyPayment,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization;
    if (results) {
        setCalculationResults(results);
        toast.success(isKo ? "계산이 완료되었습니다." : "Calculation completed.");
    } else {
        setCalculationResults(null);
        toast.error(isKo ? "올바른 대출 정보를 입력해주세요." : "Please enter valid loan information.");
    }
  };

  const LeftColumn = (
    <>
      <CardHeader>
        <CardTitle>{isKo ? '대출 정보 입력' : 'Loan information'}</CardTitle>
        <CardDescription>{isKo ? '대출 원금, 기간, 이자율을 입력해주세요.' : 'Enter the loan principal, term, and interest rate.'}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="loanAmount">{isKo ? '대출 원금 (원)' : 'Loan principal (KRW)'}</Label>
          <Input id="loanAmount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} placeholder={isKo ? "예: 100,000,000" : "e.g. 100,000,000"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="loanTerm">{isKo ? '대출 기간 (년)' : 'Loan term (years)'}</Label>
          <Input id="loanTerm" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} placeholder={isKo ? "예: 30" : "e.g. 30"} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interestRate">{isKo ? '연 이자율 (%)' : 'Annual interest rate (%)'}</Label>
          <Input id="interestRate" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} placeholder={isKo ? "예: 4.5" : "e.g. 4.5"} />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
      </CardFooter>
    </>
  );

  const RightColumn = (
    <>
      {calculationResults ? (
        <>
            <CardHeader>
                <CardTitle>{isKo ? '계산 결과 요약' : 'Result summary'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{isKo ? '월 상환금' : 'Monthly payment'}</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.monthlyPayment)} {isKo ? '원' : 'KRW'}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">{isKo ? '총 상환 이자' : 'Total interest paid'}</span>
                    <Badge variant="destructive" className="text-lg">{formatNumber(calculationResults.totalInterest)} {isKo ? '원' : 'KRW'}</Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center text-xl font-semibold">
                    <span>{isKo ? '총 상환 금액' : 'Total repayment'}</span>
                    <span className="text-blue-600">{formatNumber(calculationResults.totalRepayment)} {isKo ? '원' : 'KRW'}</span>
                </div>
            </CardContent>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-full">
          {isKo ? '계산하기 버튼을 눌러주세요' : 'Please press Calculate'}
        </div>
      )}
    </>
  );

  const fullWidthSection = calculationResults ? (
    <Tabs defaultValue="chart" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="chart">{isKo ? '차트' : 'Chart'}</TabsTrigger>
        <TabsTrigger value="details">{isKo ? '월별 상세 내역' : 'Monthly details'}</TabsTrigger>
      </TabsList>
      <TabsContent value="chart">
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={calculationResults.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => value.toLocaleString()} />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} ${isKo ? '원' : 'KRW'}`} />
              <Legend />
              <Line type="monotone" dataKey="monthlyPayment" name={isKo ? '월 상환금' : 'Monthly payment'} stroke="#8884d8" />
              <Line type="monotone" dataKey="principal" name={isKo ? '상환 원금' : 'Principal'} stroke="#82ca9d" />
              <Line type="monotone" dataKey="interest" name={isKo ? '상환 이자' : 'Interest'} stroke="#ffc658" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </TabsContent>
      <TabsContent value="details">
        <div className="overflow-x-auto max-h-[400px] w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-[60px]">{isKo ? '개월' : 'Month'}</TableHead>
                <TableHead className="text-center">{isKo ? '상환' : 'Repaid'}<br />{isKo ? '원금' : 'principal'}</TableHead>
                <TableHead className="text-center">{isKo ? '상환' : 'Repaid'}<br />{isKo ? '이자' : 'interest'}</TableHead>
                <TableHead className="text-center">{isKo ? '총' : 'Total'}<br />{isKo ? '상환금' : 'payment'}</TableHead>
                <TableHead className="text-center">{isKo ? '대출 잔액' : 'Loan balance'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculationResults.repaymentSchedule.map((data: RepaymentDetail) => (
                <TableRow key={data.month}>
                  <TableCell className="text-center whitespace-nowrap w-[60px]">{data.month}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(data.principalPayment)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(data.interestPayment)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(data.totalPayment)}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{formatNumber(data.remainingBalance)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  ) : null;

  const InfoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-4">
        <p>
          <strong>{isKo ? '원리금 균등 분할 상환' : 'Equal payment amortization'}</strong>{isKo
            ? '은 주택담보대출, 신용대출 등 금융권 대출에서 가장 보편적으로 사용되는 상환 방식입니다. 이름 그대로 대출 기간 내내 매월 동일한 금액(원금+이자)을 갚아나가는 것이 핵심입니다.'
            : ' is the most commonly used repayment method in financial loans such as mortgages and personal loans. As the name suggests, the key is repaying the same amount (principal + interest) every month throughout the loan term.'}
        </p>
        <p>
          {isKo
            ? '매달 상환액이 일정하기 때문에 장기적인 자금 계획을 세우기 매우 용이하며, 소득이 일정한 직장인에게 특히 선호됩니다. 이 계산기는 여러분의 대출 조건에 따른 월 상환금을 정확히 계산하고, 전체 상환 스케줄을 한눈에 보여줌으로써 안정적인 금융 계획 수립을 돕습니다.'
            : 'Because the monthly payment is constant, it is very easy to plan long-term finances, and it is especially preferred by salaried workers with stable income. This calculator accurately computes your monthly payment based on your loan terms and shows the entire schedule at a glance, helping you build a stable financial plan.'}</p>        <TermGlossary items={[
          { term: isKo ? '원리금 균등 상환' : 'Equal payment repayment', desc: isKo ? '대출 기간 내내 매월 동일한 금액(원금+이자)을 갚는 방식으로, 자금 계획을 세우기 가장 쉽습니다.' : 'A method of repaying the same amount (principal + interest) every month throughout the loan term; the easiest to plan finances around.' },
          { term: isKo ? '거치기간' : 'Grace period', desc: isKo ? '일정 기간 동안 이자만 내고 원금 상환을 유예하는 기간으로, 당장의 부담은 줄지만 총이자가 늘어납니다.' : 'A period during which you pay only interest and defer principal repayment; eases the immediate burden but increases total interest.' },
          { term: isKo ? '중도상환수수료' : 'Early repayment fee', desc: isKo ? '대출 후 목돈이 생겨 원금을 미리 갚을 때 부과되는 수수료로, 보통 실행 후 3년까지 적용됩니다.' : 'A fee charged when a lump sum lets you repay principal early after taking the loan, usually applied for up to 3 years.' },
        ]} />

      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '원리금 균등 분할 상환액은 복잡한 수학 공식을 통해 계산됩니다. 매월 동일한 금액을 내지만, 그 안의 원금과 이자 비중은 매번 달라집니다.' : 'The equal payment installment amount is calculated through a complex formula. You pay the same amount each month, but the principal and interest shares within it change every time.'}</p>
        
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 월 상환금(고정) 계산 공식' : '1. Monthly payment (fixed) formula'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm overflow-x-auto">
            {isKo ? '월 상환금 = [대출원금 × 월이율 × (1 + 월이율)^상환개월수] / [(1 + 월이율)^상환개월수 - 1]' : 'Monthly payment = [Principal × Monthly rate × (1 + Monthly rate)^Months] / [(1 + Monthly rate)^Months - 1]'}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{isKo ? '※ 월이율 = 연이율 / 12' : '※ Monthly rate = Annual rate / 12'}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 매월 상환 원금 및 이자 계산' : '2. Monthly principal and interest'}</h3>
          <p className="mt-3">{isKo ? '월 상환금은 고정되어 있지만, 그 구성은 매달 변합니다.' : 'The monthly payment is fixed, but its composition changes each month.'}</p>
          <ul className="text-sm list-disc list-inside mt-2 space-y-2">
            <li>
              <strong>{isKo ? '월 상환 이자 (점점 감소):' : 'Monthly interest (decreasing):'}</strong>
              <p className="font-mono p-2 bg-card rounded-md text-xs shadow-sm mt-1">{isKo ? '전월 대출 잔액 × 월이율' : 'Previous month\'s loan balance × Monthly rate'}</p>
            </li>
            <li>
              <strong>{isKo ? '월 상환 원금 (점점 증가):' : 'Monthly principal (increasing):'}</strong>
              <p className="font-mono p-2 bg-card rounded-md text-xs shadow-sm mt-1">{isKo ? '월 상환금(고정) - 월 상환 이자' : 'Monthly payment (fixed) - Monthly interest'}</p>
            </li>
          </ul>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-3">{isKo ? '초기에는 이자 비중이 높고, 시간이 지날수록 원금 상환 비중이 높아지는 구조입니다.' : 'Early on the interest share is high, and over time the principal repayment share grows.'}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '🏠 내 집 마련, 2025년 대출 전략 가이드' : '🏠 Buying a home: 2025 loan strategy guide'}</h2>
        
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 원리금 균등 vs 원금 균등, 나에게 맞는 방식은?' : '1. Equal payment vs equal principal: which fits you?'}</h3>
          <p className="mt-2">{isKo ? '두 방식의 가장 큰 차이는 초기 상환 부담과 총이자 비용입니다.' : 'The biggest difference between the two is the initial repayment burden and the total interest cost.'}</p>
          <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">{isKo ? '원리금 균등 상환 (본 계산기)' : 'Equal payment (this calculator)'}</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong>{isKo ? '장점:' : 'Pros:'}</strong> {isKo ? '매월 상환액 동일 (자금 계획 용이)' : 'Same monthly payment (easy planning)'}</li>
                <li><strong>{isKo ? '단점:' : 'Cons:'}</strong> {isKo ? '원금 균등 방식보다 총이자 많음' : 'More total interest than equal principal'}</li>
                <li><strong>{isKo ? '추천 대상:' : 'Recommended for:'}</strong> {isKo ? '소득이 일정하고 예측 가능한 미래를 계획하는 직장인, 사회초년생' : 'Salaried workers and new grads with stable, predictable income'}</li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">{isKo ? '원금 균등 상환' : 'Equal principal'}</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li><strong>{isKo ? '장점:' : 'Pros:'}</strong> {isKo ? '총이자 비용이 가장 저렴' : 'Least total interest cost'}</li>
                <li><strong>{isKo ? '단점:' : 'Cons:'}</strong> {isKo ? '초기 상환 부담이 큼 (월 상환액이 점점 줄어듦)' : 'High initial burden (payment decreases over time)'}</li>
                <li><strong>{isKo ? '추천 대상:' : 'Recommended for:'}</strong> {isKo ? '초기 자금 여유가 있고, 이자 비용을 최소화하고 싶은 경우, 소득 감소가 예상되는 은퇴 예정자' : 'Those with ample initial funds who want to minimize interest, or retirees expecting lower income'}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. 2025년 강화된 DSR 규제와 스트레스 DSR 이해하기' : '2. Tighter 2025 DSR rules and stress DSR'}</h3>
          <p className="mt-2">{isKo ? '2025년부터는 대출 심사가 더 깐깐해집니다. 특히 스트레스 DSR 제도가 핵심입니다.' : 'From 2025, loan screening becomes stricter. The stress DSR system is key.'}</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li><strong>{isKo ? 'DSR (총부채원리금상환비율):' : 'DSR (Debt Service Ratio):'}</strong> {isKo ? '연 소득 대비 모든 대출의 연간 원리금 상환액 비율. 현재 은행권 40% 적용.' : 'The ratio of total annual principal and interest of all loans to annual income. Banks currently apply 40%.'}</li>
            <li><strong>{isKo ? '스트레스 DSR:' : 'Stress DSR:'}</strong> {isKo ? '미래 금리 인상 가능성을 대비해, 실제 대출금리에 가산금리(스트레스 금리)를 더해 DSR을 산정하는 방식입니다.' : 'A method that adds a stress rate to the actual loan rate to calculate DSR, preparing for future rate hikes.'}</li>
            <li><strong>{isKo ? '결과:' : 'Result:'}</strong> {isKo ? '동일한 소득과 대출이라도, 가산금리가 적용되어 대출 한도가 과거보다 줄어들게 됩니다. 대출 계획 시 예상보다 한도가 적게 나올 수 있음을 반드시 인지해야 합니다.' : 'Even with the same income and loan, the added rate reduces the limit versus the past. You must expect a lower limit than anticipated.'}</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '3. 중도상환수수료, \'3년의 법칙\'을 기억하세요.' : '3. Early repayment fee: remember the "3-year rule".'}</h3>
          <p className="mt-2">{isKo ? '대출 후 목돈이 생겨 원금을 미리 갚고 싶을 때 발생하는 것이 중도상환수수료입니다. 보통 대출 실행 후 3년까지 부과됩니다.' : 'The early repayment fee arises when you want to repay principal early after taking a loan. It is usually charged for up to 3 years after origination.'}</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>{isKo ? '수수료는 보통 1.2% ~ 1.5% 수준이며, 기간에 따라 점차 감소(슬라이딩 방식)합니다.' : 'The fee is typically 1.2%–1.5% and gradually decreases over time (sliding scale).'}</li>
            <li><strong>{isKo ? '전략:' : 'Strategy:'}</strong> {isKo ? '3년 이내 상환 계획이 있다면, 중도상환수수료 면제 상품을 찾아보거나, 수수료와 절감되는 이자를 비교하여 유불리를 따져봐야 합니다. 3년이 지난 후에는 수수료 없이 자유롭게 원금을 상환할 수 있습니다.' : 'If you plan to repay within 3 years, look for fee-waived products or compare the fee with the interest saved. After 3 years you can repay principal freely without a fee.'}</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '4. 거치기간, 정말 필요할까요?' : '4. Do you really need a grace period?'}</h3>
          <p className="mt-2">{isKo ? '거치기간은 일정 기간 동안 이자만 납부하고 원금 상환을 유예하는 기간입니다. 당장의 상환 부담은 줄지만, 총이자 부담은 크게 늘어나는 단점이 있습니다.' : 'A grace period is a time when you pay only interest and defer principal. It eases the immediate burden but greatly increases total interest.'}</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li>{isKo ? '원금 상환이 늦어지는 만큼, 전체 대출 기간 동안 내야 할 총이자가 증가합니다.' : 'The later principal is repaid, the more total interest is paid over the whole term.'}</li>
            <li><strong>{isKo ? '전략:' : 'Strategy:'}</strong> {isKo ? '입주 초기 자금 부담 등 불가피한 경우가 아니라면, 거치기간은 설정하지 않거나 최소화하는 것이 장기적으로 유리합니다.' : 'Unless unavoidable (e.g. early move-in costs), it is better long-term not to set or to minimize the grace period.'}</li>
          </ul>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title={isKo ? "원리금 균등 분할 상환 계산기" : "Equal Payment Amortization Calculator"}
      description={isKo ? "매월 동일한 금액을 상환하는 원리금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다." : "Calculate the monthly payment, total interest, and schedule for equal payment amortization."}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? "상세 분석" : "Detailed analysis"}
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}
