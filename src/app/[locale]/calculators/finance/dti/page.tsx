'use client'

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip as RechartsTooltip, PieLabelRenderProps } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import CalculatorsLayout from "@/components/calculators/Calculatorslayout";
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

export default function DtiPage() {
  const { dict, locale } = useI18n();
  const t = dict.dti;
  const isKo = locale === 'ko';

  const [annualIncome, setAnnualIncome] = useState<number>(50000000);
  const [loanPrincipal, setLoanPrincipal] = useState<number>(200000000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(5);
  const [otherDebtInterest, setOtherDebtInterest] = useState<number>(0);
  const [dtiResult, setDtiResult] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"chart" | "table">("table");

  const calculationResults = useMemo(() => {
    const income = annualIncome;
    const principal = loanPrincipal;
    const term = loanTerm;
    const rate = interestRate / 100;
    const otherInterest = otherDebtInterest;

    if (income <= 0 || principal <= 0 || term <= 0 || rate <= 0) {
      return null;
    }

    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;
    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const annualPrincipalAndInterest = monthlyPayment * 12;
    const totalAnnualDebtRepayment = annualPrincipalAndInterest + otherInterest;
    const calculatedDti = (totalAnnualDebtRepayment / income) * 100;

    let dtiStatus = "";
    let dtiBadgeColor = "";
    if (calculatedDti <= 15) {
      dtiStatus = t.status.veryStable;
      dtiBadgeColor = "bg-green-500";
    } else if (calculatedDti <= 30) {
      dtiStatus = t.status.stable;
      dtiBadgeColor = "bg-blue-500";
    } else if (calculatedDti <= 40) {
      dtiStatus = t.status.caution;
      dtiBadgeColor = "bg-yellow-500 text-black";
    } else if (calculatedDti <= 50) {
      dtiStatus = t.status.risky;
      dtiBadgeColor = "bg-orange-500";
    } else {
      dtiStatus = t.status.highRisk;
      dtiBadgeColor = "bg-red-500";
    }

    const maxAnnualRepayment = income * 0.4;
    const availableForLoanRepayment = maxAnnualRepayment - otherInterest;
    
    let estimatedAmount = 0;
    if (availableForLoanRepayment > 0) {
        const monthlyPaymentForEstimation = availableForLoanRepayment / 12;
        estimatedAmount = (monthlyPaymentForEstimation * (Math.pow(1 + monthlyRate, numberOfPayments) - 1)) / (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments));
    }

    const chartData = [
      { name: t.chart.totalDebt, value: totalAnnualDebtRepayment, fill: '#4f46e5' },
      { name: t.chart.availableIncome, value: income - totalAnnualDebtRepayment > 0 ? income - totalAnnualDebtRepayment : 0, fill: '#10b981' },
    ];

    return {
      dti: calculatedDti,
      dtiStatus,
      dtiBadgeColor,
      estimatedLoanAmount: estimatedAmount > 0 ? estimatedAmount : 0,
      annualIncome: income,
      totalAnnualDebtRepayment: Math.round(totalAnnualDebtRepayment),
      annualPrincipalAndInterest: Math.round(annualPrincipalAndInterest),
      otherInterest: Math.round(otherInterest),
      chartData,
    };
  }, [annualIncome, loanPrincipal, loanTerm, interestRate, otherDebtInterest, t]);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setter(parseFloat(value.replace(/,/g, '')));
  };

  const calculateDti = () => {
    if (calculationResults) {
      setDtiResult(calculationResults.dti);
      toast.success(`${t.results.dtiResult}: ${Math.round(calculationResults.dti)}%`);
    } else {
      setDtiResult(null);
      toast.error(t.results.placeholder);
    }
  };

const inputSection = (
  <div className="space-y-4">
    <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="annual-income">{t.inputs.annualIncome}</Label>
            <Input id="annual-income" value={annualIncome.toLocaleString()} onChange={handleInputChange(setAnnualIncome)} placeholder="50,000,000" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="loan-principal">{t.inputs.loanPrincipal}</Label>
            <Input id="loan-principal" value={loanPrincipal.toLocaleString()} onChange={handleInputChange(setLoanPrincipal)} placeholder="200,000,000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="loan-term">{t.inputs.loanTerm}</Label>
            <Input id="loan-term" value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))} placeholder="30" type="number" />
          </div>
          <div className="space-y-3">
            <Label htmlFor="interest-rate">{t.inputs.annualRate}</Label>
            <Input id="interest-rate" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} placeholder="5" type="number" step="0.1" />
          </div>
        </div>
        <div className="space-y-3">
          <Label htmlFor="other-debt-interest">{t.inputs.otherDebtInterest}</Label>
            <Input id="other-debt-interest" value={otherDebtInterest.toLocaleString()} onChange={handleInputChange(setOtherDebtInterest)} placeholder="0" />
        </div>
    <Button onClick={calculateDti} className="w-full">{dict.common.calculate}</Button>
  </div>
);

  const resultSection = (
    <div className="space-y-4">
      {dtiResult && calculationResults ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <span className="text-base">{t.results.dtiResult}:</span>
            <Badge className={`${calculationResults.dtiBadgeColor} text-base`}>{Math.round(calculationResults.dti)}% ({calculationResults.dtiStatus})</Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3 mb-4">
            <div className="flex justify-between">
              <span>{t.results.totalDebtRepayment}:</span>
              <span>{calculationResults.totalAnnualDebtRepayment.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.results.annualIncome}:</span>
              <span>{calculationResults.annualIncome.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.results.mortgageAnnualPI}:</span>
              <span>{calculationResults.annualPrincipalAndInterest.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
            <div className="flex justify-between">
              <span>{t.results.otherInterest}:</span>
              <span>{calculationResults.otherInterest.toLocaleString()}{isKo ? '원' : ' KRW'}</span>
            </div>
          </div>
          <Separator className="mb-4" />
          <div className="text-center mb-4">
            <p className="text-base font-semibold">{t.results.maxLoanTitle}</p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <p className="text-xl font-bold text-blue-600">{Math.round(calculationResults.estimatedLoanAmount).toLocaleString()}{isKo ? '원' : ' KRW'}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{calculationResults.estimatedLoanAmount.toLocaleString()}{isKo ? '원' : ' KRW'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">{t.results.placeholder}</p>
        </div>
      )}
    </div>
  );

  const fullWidthSection = dtiResult && calculationResults ? (
    <div>
      <div className="flex flex-row items-center justify-between mb-4">
        <h3 className="text-base font-semibold">{t.results.chartTitle}</h3>
        <ToggleGroup type="single" value={viewMode} onValueChange={(value) => { if (value) setViewMode(value as "chart" | "table"); }} defaultValue="chart">
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
          <ToggleGroupItem value="chart">Chart</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {viewMode === 'chart' ? (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <RechartsTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-background p-2 border rounded shadow-lg text-sm">
                        <p className="font-bold">{data.name}</p>
                        <p>{data.value.toLocaleString()}{isKo ? '원' : ' KRW'}</p>
                        <p>{((data.value / calculationResults.annualIncome) * 100).toFixed(2)}%</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={calculationResults.chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }: PieLabelRenderProps) => `${name}: ${((percent as number) * 100).toFixed(1)}%`}
                labelLine={false}
              >
                {calculationResults.chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">{t.tableHeaders.item}</th>
                <th className="text-left">{t.tableHeaders.amount}</th>
                <th className="text-left">{t.tableHeaders.ratio}</th>
              </tr>
            </thead>
            <tbody>
              {calculationResults.chartData.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{Math.round(item.value).toLocaleString()}{isKo ? '원' : ' KRW'}</td>
                  <td>{((item.value / calculationResults.annualIncome) * 100).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  ) : null;

  const infoSection = {
      calculatorDescription: (
        <>
          <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
          <TermGlossary items={[
            { term: isKo ? 'DTI (총부채상환비율)' : 'DTI (Debt-to-Income Ratio)', desc: isKo ? '연소득 대비 주택담보대출 원리금과 기타 부채 이자의 합이 차지하는 비율로, 대출 한도를 결정하는 지표입니다.' : 'The ratio of total annual housing loan principal & interest plus other debt interest to annual income; a key indicator for determining loan limits.' },
            { term: isKo ? 'DSR (총부채원리금상환비율)' : 'DSR (Debt Service Ratio)', desc: isKo ? '연소득 대비 모든 가계대출의 연간 원리금 상환액 비율로, DTI보다 포괄적인 대출 규제 기준입니다.' : 'The ratio of total annual principal & interest repayments on all household loans to annual income; a more comprehensive lending regulation standard than DTI.' },
            { term: isKo ? '스트레스 DSR' : 'Stress DSR', desc: isKo ? '미래 금리 인상 가능성을 반영해 실제 금리에 가산금리를 더해 DSR을 산정하는 제도입니다.' : 'A system that adds a surcharge rate to the actual rate to reflect possible future rate hikes when calculating DSR.' },
          ]} />
        </>
      ),
      calculationFormula: (
        <div dangerouslySetInnerHTML={{ __html: t.formulaContent }} />
      ),
      usefulTips: (
        <div dangerouslySetInnerHTML={{ __html: t.tipsContent }} />
      ),
    };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.results.chartTitle}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
