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

export default function PrincipalEqualAmortizationCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const [loanAmount, setLoanAmount] = useState<string>('100000000');
  const [loanTerm, setLoanTerm] = useState<string>('30');
  const [interestRate, setInterestRate] = useState<string>('4.5');
  const [viewMode, setViewMode] = useState<"chart" | "table">("chart");
  const [calculationResults, setCalculationResults] = useState<any>(null); // 초기값을 null로 설정

  const calculateAmortization = useMemo(() => {
    const principal = parseFloat(loanAmount);
    const years = parseInt(loanTerm, 10);
    const annualRate = parseFloat(interestRate) / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyPrincipalPayment = principal / months;
    const monthlyRate = annualRate / 12;

    let remainingBalance = principal;
    const repaymentSchedule: RepaymentDetail[] = [];
    const chartData: ChartData[] = [];
    let totalInterest = 0;

    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const totalPayment = monthlyPrincipalPayment + interestPayment;
      remainingBalance -= monthlyPrincipalPayment;
      totalInterest += interestPayment;

      repaymentSchedule.push({
        month: i,
        principalPayment: Math.round(monthlyPrincipalPayment),
        interestPayment: Math.round(interestPayment),
        totalPayment: Math.round(totalPayment),
        remainingBalance: Math.round(remainingBalance < 0 ? 0 : remainingBalance),
      });
      
      if (i % 12 === 0 || i === 1 || i === months) {
        chartData.push({
            month: i,
            monthlyPayment: parseFloat(totalPayment.toFixed(0)),
            principal: parseFloat(monthlyPrincipalPayment.toFixed(0)),
            interest: parseFloat(interestPayment.toFixed(0)),
        });
      }
    }

    return {
      repaymentSchedule,
      totalPrincipal: principal,
      totalInterest: totalInterest,
      totalRepayment: principal + totalInterest,
      chartData,
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    const results = calculateAmortization; // useMemo로 계산된 값을 가져옴
    if (results) {
        setCalculationResults(results); // 계산 결과를 상태에 저장
        toast.success(isKo ? "계산이 완료되었습니다." : "Calculation completed.");
    } else {
        setCalculationResults(null); // 유효하지 않은 경우 결과 초기화
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
                    <span className="text-muted-foreground">{isKo ? '총 대출 원금' : 'Total loan principal'}</span>
                    <span className="font-bold text-lg">{formatNumber(calculationResults.totalPrincipal)} {isKo ? '원' : 'KRW'}</span>
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
                  <TableCell className="whitespace-nowrap w-[60px]">{data.month}</TableCell>
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
          <strong>{isKo ? '원금 균등 분할 상환' : 'Equal principal installment repayment'}</strong>{isKo
            ? '은 대출 이자를 가장 아낄 수 있는, 가장 정직한 상환 방식입니다. 대출 원금을 상환 기간으로 똑같이 나누어 매월 동일한 원금을 갚아나가고, 이자는 남은 원금에 대해서만 계산하여 납부합니다.'
            : ' is the most honest repayment method that saves the most on loan interest. The loan principal is divided equally over the repayment period, so you repay the same principal each month, and interest is charged only on the remaining principal.'}
        </p>
        <p>
          {isKo
            ? '이 방식의 핵심은 시간이 지날수록 월 상환액이 점차 줄어든다는 것입니다. 원금이 꾸준히 줄어드니 내야 할 이자도 자연스럽게 감소하기 때문입니다. 초기 상환 부담은 다소 높지만, 전체 대출 기간 동안의 총이자 비용을 최소화하고 싶다면 가장 현명한 선택입니다.'
            : 'The key of this method is that the monthly payment gradually decreases over time. As the principal steadily shrinks, the interest you must pay naturally decreases. The initial burden is somewhat higher, but if you want to minimize total interest over the whole loan period, it is the wisest choice.'}</p>        <TermGlossary items={[
          { term: isKo ? '원금 균등 상환' : 'Equal principal repayment', desc: isKo ? '매월 동일한 원금을 갚고 남은 원금에 대해서만 이자를 내는 방식으로, 세 방식 중 총이자가 가장 적습니다.' : 'A method of repaying the same principal each month and paying interest only on the remaining principal; of the three methods it has the least total interest.' },
          { term: isKo ? 'DSR (총부채원리금상환비율)' : 'DSR (Debt Service Ratio)', desc: isKo ? '연소득 대비 모든 대출의 연간 원리금 상환액 비율로, 대출 한도 심사의 핵심 기준입니다.' : 'The ratio of total annual principal and interest payments on all loans to annual income; a key criterion in loan limit reviews.' },
          { term: isKo ? '중도상환수수료' : 'Early repayment fee', desc: isKo ? '대출 기간 중 원금을 미리 갚을 때 부과되는 수수료로, 보통 실행 후 3년까지 적용됩니다.' : 'A fee charged when you repay principal early during the loan term, usually applied for up to 3 years after origination.' },
        ]} />

      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-6">
        <p className="font-semibold">{isKo ? '원금 균등 분할 상환의 계산 구조는 매우 직관적입니다. 매월 갚는 원금은 고정되어 있고, 이자만 변동됩니다.' : 'The calculation structure of equal principal installment repayment is very intuitive. The principal repaid each month is fixed, and only the interest varies.'}</p>
        
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '1. 월 상환 원금 (고정)' : '1. Monthly principal (fixed)'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '월 상환 원금 = 총 대출 원금 / 상환 개월 수' : 'Monthly principal = Total loan principal / Number of repayment months'}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{isKo ? '예: 1억 원을 30년(360개월)간 빌렸다면, 매월 갚는 원금은 약 277,777원으로 동일합니다.' : 'Example: If you borrow 100 million KRW for 30 years (360 months), the monthly principal is the same at about 277,777 KRW.'}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '2. 월 상환 이자 (변동)' : '2. Monthly interest (variable)'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '월 상환 이자 = 전월 대출 잔액 × 월 이자율 (연이율 / 12)' : 'Monthly interest = Previous month\'s loan balance × Monthly rate (Annual rate / 12)'}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{isKo ? '대출 잔액이 매달 줄어들기 때문에, 이자 금액도 매달 감소합니다.' : 'Because the loan balance decreases each month, the interest amount also decreases each month.'}</p>
        </div>

        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h3 className="text-lg font-bold text-primary mb-3">{isKo ? '3. 월 총 상환금 (변동)' : '3. Monthly total payment (variable)'}</h3>
          <p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm">
            {isKo ? '월 총 상환금 = 월 상환 원금(고정) + 월 상환 이자(변동)' : 'Monthly total = Monthly principal (fixed) + Monthly interest (variable)'}
          </p>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{isKo ? '결과적으로 월 총 상환금은 대출 초기일수록 가장 높고, 회차가 지날수록 점차 줄어드는 계단식 형태를 띱니다.' : 'As a result, the monthly total is highest early in the loan and gradually decreases in a step-like pattern as periods pass.'}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 이자를 가장 아끼는 상환법, 2025년 누가 선택해야 할까?' : '💡 The most interest-saving repayment: who should choose it in 2025?'}</h2>
        
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '1. 원금 균등 vs 원리금 균등: 최종 승자는?' : '1. Equal principal vs equal payment: who wins?'}</h3>
          <p className="mt-2">{isKo ? '정답은 없습니다. 당신의 자금 상황과 미래 계획에 따라 최적의 선택이 달라집니다.' : 'There is no single answer. The optimal choice depends on your financial situation and future plans.'}</p>
          <div className="grid md:grid-cols-2 gap-6 mt-4 text-sm">
            <div className="p-4 border rounded-lg bg-muted">
              <h4 className="font-bold text-center">{isKo ? '원금 균등 상환 (본 계산기)' : 'Equal principal (this calculator)'}</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>🏆 <strong>{isKo ? '총이자 최소화:' : 'Minimize total interest:'}</strong> {isKo ? '가장 큰 장점. 원금 감소 속도가 빨라 이자 부담이 가장 적습니다.' : 'The biggest advantage. Principal decreases fast, so interest burden is least.'}</li>
                <li>📈 <strong>{isKo ? '초기 상환 부담:' : 'Initial burden:'}</strong> {isKo ? '가장 큰 단점. 첫 회차 상환액이 가장 높습니다.' : 'The biggest drawback. The first payment is the highest.'}</li>
                <li><strong>{isKo ? '추천 대상:' : 'Recommended for:'}</strong>
                    <ul className="list-['-_'] list-inside ml-4 mt-1">
                        <li>{isKo ? '초기 자금 여유가 있는 경우' : 'Those with ample initial funds'}</li>
                        <li>{isKo ? '향후 소득 감소가 예상되는 은퇴 예정자' : 'Soon-to-retire people expecting lower future income'}</li>
                        <li>{isKo ? '1원이라도 이자를 아끼고 싶은 적극적인 재테크 성향' : 'Active savers who want to save every bit of interest'}</li>
                    </ul>
                </li>
              </ul>
            </div>
            <div className="p-4 border rounded-lg">
              <h4 className="font-bold text-center">{isKo ? '원리금 균등 상환' : 'Equal payment'}</h4>
              <ul className="mt-3 space-y-2 list-disc list-inside">
                <li>📅 <strong>{isKo ? '계획적인 지출:' : 'Planned spending:'}</strong> {isKo ? '매월 상환액이 동일하여 예산 관리가 편리합니다.' : 'The same monthly payment makes budgeting easy.'}</li>
                <li>📉 <strong>{isKo ? '이자 부담 상대적 높음:' : 'Relatively higher interest:'}</strong> {isKo ? '원금 균등 방식보다 총 납부 이자가 많습니다.' : 'Total interest paid is more than the equal principal method.'}</li>
                <li><strong>{isKo ? '추천 대상:' : 'Recommended for:'}</strong>
                    <ul className="list-['-_'] list-inside ml-4 mt-1">
                        <li>{isKo ? '매월 고정적인 소득이 있는 직장인' : 'Salaried workers with fixed monthly income'}</li>
                        <li>{isKo ? '사회초년생 등 초기 자금 부담을 줄이고 싶은 경우' : 'New graduates wanting to reduce initial burden'}</li>
                        <li>{isKo ? '안정적인 자금 흐름을 최우선으로 생각하는 경우' : 'Those prioritizing stable cash flow'}</li>
                    </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '2. DSR 계산 시 원금 균등 방식의 유불리' : '2. Pros and cons of equal principal under DSR'}</h3>
          <p className="mt-2">{isKo ? 'DSR(총부채원리금상환비율)은 연 소득에서 모든 대출의 연간 원리금이 차지하는 비율을 의미합니다. 2025년 현재 은행권은 40%를 적용하고 있습니다.' : 'DSR (Debt Service Ratio) is the ratio of total annual principal and interest of all loans to annual income. As of 2025, banks apply 40%.'}</p>
          <ul className="mt-3 space-y-2 list-disc list-inside text-sm">
            <li><strong>{isKo ? 'DSR 산정 방식:' : 'DSR calculation:'}</strong> {isKo ? '원금 균등 상환은 초회차 상환액이 가장 높기 때문에, DSR 산정 시 이 첫해의 높은 상환액을 기준으로 계산합니다.' : 'With equal principal, the first payment is highest, so DSR is calculated based on this high first-year payment.'}</li>
            <li><strong>{isKo ? '결론:' : 'Conclusion:'}</strong> {isKo ? '동일한 대출 조건이라면, 원리금 균등 방식에 비해 DSR이 더 높게 산정되어 대출 한도가 더 적게 나올 수 있습니다.' : 'Under the same loan terms, DSR is calculated higher than with equal payment, so the loan limit may be lower.'}</li>
          </ul>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '3. 중도상환을 계획하고 있다면?' : '3. Planning early repayment?'}</h3>
          <p className="mt-2">{isKo ? '원금 균등 상환은 원금 감소 속도가 빠르기 때문에, 중도상환 시 효율이 매우 좋습니다. 조금이라도 여유 자금이 생길 때마다 원금을 갚아나가면, 총이자 절감 효과를 극대화할 수 있습니다.' : 'Equal principal reduces principal quickly, so early repayment is very efficient. Paying down principal whenever you have spare funds maximizes total interest savings.'}</p>
          <p className="mt-3 text-sm">{isKo ? '특히 대출 초기, 이자 비중이 높을 때 중도상환을 하는 것이 가장 효과적입니다. (단, 3년 이내 중도상환수수료는 반드시 확인해야 합니다.)' : 'It is most effective to repay early in the loan when interest is a large share. (But always check the early repayment fee within 3 years.)'}</p>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="font-bold text-lg text-primary">{isKo ? '4. 최종 선택을 위한 시뮬레이션의 중요성' : '4. The importance of simulation for the final choice'}</h3>
          <p className="mt-2">{isKo ? '가장 좋은 방법은 본인의 대출 예상액, 기간, 금리를 가지고 두 가지 상환 방식(원금 균등, 원리금 균등)을 모두 계산해보는 것입니다.' : 'The best approach is to calculate both repayment methods (equal principal, equal payment) with your expected loan amount, term, and rate.'}</p>
          <p className="mt-3 text-sm">{isKo ? '각 방식의 월 상환액 변화 추이와 총이자 차이를 직접 눈으로 확인하고, 자신의 미래 자금 계획과 비교하여 최종적으로 가장 적합한 방식을 선택하는 것이 후회 없는 결정의 핵심입니다.' : 'See the monthly payment trend and total interest difference of each method with your own eyes, compare with your future financial plan, and choose the most suitable method—that is the key to a regret-free decision.'}</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title={isKo ? "원금 균등 분할 상환 계산기" : "Equal Principal Amortization Calculator"}
      description={isKo ? "매월 동일한 원금을 상환하는 원금 균등 분할 상환 방식의 월 상환금, 총 이자, 상환 스케줄을 계산합니다." : "Calculate the monthly payment, total interest, and schedule for equal principal amortization."}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? "상세 분석" : "Detailed analysis"}
      inputSection={LeftColumn}
      resultSection={RightColumn}
      infoSection={InfoSection}
    />
  );
}
