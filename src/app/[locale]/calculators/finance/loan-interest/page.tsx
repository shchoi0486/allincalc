'use client';

import React, { useState, useMemo } from 'react';
import { NextPage } from 'next';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { formatNumber } from '@/utils/formatNumber';
import { useI18n } from '@/i18n/I18nProvider';

interface RepaymentDetail {
  month: number;
  principalPayment: number;
  interestPayment: number;
  totalPayment: number;
  remainingBalance: number;
}

interface ResultData {
  repaymentSchedule: RepaymentDetail[];
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  firstMonthPayment?: number;
  lastMonthPayment?: number;
  monthlyPayment?: number;
}

const LoanInterestCalculator: NextPage = () => {
  const { dict, formatCurrency, currency } = useI18n();
  const t = dict.loanInterest;

  const [loanAmount, setLoanAmount] = useState<number>(100000000);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [interestRate, setInterestRate] = useState<number>(4.5);
  const [results, setResults] = useState<{
    equalPrincipal: ResultData | null;
    equalTotal: ResultData | null;
    bullet: ResultData | null;
  } | null>(null);

  const calculationResults = useMemo(() => {
    const principal = loanAmount;
    const years = loanTerm;
    const annualRate = interestRate / 100;

    if (isNaN(principal) || principal <= 0 || isNaN(years) || years <= 0 || isNaN(annualRate) || annualRate <= 0) {
      return null;
    }

    const months = years * 12;
    const monthlyRate = annualRate / 12;

    // 1. Equal Principal
    const principalPaymentPerMonth = principal / months;
    let remainingBalanceEP = principal;
    const scheduleEP: RepaymentDetail[] = [];
    let totalInterestEP = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceEP * monthlyRate;
      const totalPayment = principalPaymentPerMonth + interestPayment;
      remainingBalanceEP -= principalPaymentPerMonth;
      totalInterestEP += interestPayment;
      scheduleEP.push({
        month: i,
        principalPayment: principalPaymentPerMonth,
        interestPayment: interestPayment,
        totalPayment: totalPayment,
        remainingBalance: remainingBalanceEP < 0 ? 0 : remainingBalanceEP,
      });
    }

    // 2. Equal Payment
    const monthlyPaymentET =
      principal *
      ((monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1));
    let remainingBalanceET = principal;
    const scheduleET: RepaymentDetail[] = [];
    let totalInterestET = 0;
    for (let i = 1; i <= months; i++) {
      const interestPayment = remainingBalanceET * monthlyRate;
      const principalPayment = monthlyPaymentET - interestPayment;
      remainingBalanceET -= principalPayment;
      totalInterestET += interestPayment;
      scheduleET.push({
        month: i,
        principalPayment: principalPayment,
        interestPayment: interestPayment,
        totalPayment: monthlyPaymentET,
        remainingBalance: remainingBalanceET < 0 ? 0 : remainingBalanceET,
      });
    }

    // 3. Bullet Loan
    const interestPaymentB = principal * monthlyRate;
    const scheduleB: RepaymentDetail[] = [];
    for (let i = 1; i <= months; i++) {
      scheduleB.push({
        month: i,
        principalPayment: i === months ? principal : 0,
        interestPayment: interestPaymentB,
        totalPayment: i === months ? principal + interestPaymentB : interestPaymentB,
        remainingBalance: i === months ? 0 : principal,
      });
    }
    const totalInterestB = interestPaymentB * months;

    return {
      equalPrincipal: {
        repaymentSchedule: scheduleEP,
        totalPrincipal: principal,
        totalInterest: totalInterestEP,
        totalRepayment: principal + totalInterestEP,
        firstMonthPayment: scheduleEP[0]?.totalPayment,
        lastMonthPayment: scheduleEP[scheduleEP.length - 1]?.totalPayment,
      },
      equalTotal: {
        repaymentSchedule: scheduleET,
        totalPrincipal: principal,
        totalInterest: totalInterestET,
        totalRepayment: principal + totalInterestET,
        monthlyPayment: monthlyPaymentET,
      },
      bullet: {
        repaymentSchedule: scheduleB,
        totalPrincipal: principal,
        totalInterest: totalInterestB,
        totalRepayment: principal + totalInterestB,
        monthlyPayment: interestPaymentB,
      },
    };
  }, [loanAmount, loanTerm, interestRate]);

  const handleCalculate = () => {
    if (calculationResults) {
      setResults(calculationResults);
      toast.success('Calculation complete.');
    } else {
      toast.error('Please check your input values.');
    }
  };

  const TAB_KEYS = ['equalPayment', 'equalPrincipal', 'bulletLoan'] as const;
  const [activeTab, setActiveTab] = useState<string>('equalPayment');

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="loanAmount">{t.inputs.loanAmount.replace('{currency}', currency)}</Label>
        <Input
          id="loanAmount"
          value={loanAmount.toLocaleString()}
          onChange={(e) => setLoanAmount(parseFloat(e.target.value.replace(/,/g, '')))}
          className="text-right"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="loanTerm">{t.inputs.loanTerm}</Label>
        <Input
          id="loanTerm"
          value={loanTerm}
          onChange={(e) => setLoanTerm(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="interestRate">{t.inputs.annualRate}</Label>
        <Input
          id="interestRate"
          value={interestRate}
          onChange={(e) => setInterestRate(parseFloat(e.target.value))}
          className="text-right"
          type="number"
        />
      </div>
      <Button onClick={handleCalculate} className="w-full">{dict.common.calculate}</Button>
    </div>
  );

  const renderResultTab = (tabKey: string, data: ResultData | null) => {
    if (!data) return null;
    const isBullet = tabKey === 'bulletLoan';
    return (
      <TabsContent value={tabKey}>
        <Card>
          <CardHeader>
            <CardTitle>{t.tabs[tabKey as keyof typeof t.tabs]}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="font-medium">{t.results.totalPrincipal}</div>
              <div className="text-right">{formatCurrency(data.totalPrincipal)}</div>
              <div className="font-medium">{t.results.totalInterest}</div>
              <div className="text-right text-red-600">{formatCurrency(data.totalInterest)}</div>
              <div className="font-medium">{t.results.totalRepayment}</div>
              <div className="text-right font-bold">{formatCurrency(data.totalRepayment)}</div>
              {data.monthlyPayment && (
                <>
                  <div className="font-medium">
                    {isBullet ? t.results.monthlyInterest : t.results.monthlyPayment}
                  </div>
                  <div className="text-right font-bold text-blue-600">
                    {formatCurrency(data.monthlyPayment)}
                  </div>
                </>
              )}
              {data.firstMonthPayment && data.lastMonthPayment && (
                <>
                  <div className="font-medium">{t.results.firstPayment}</div>
                  <div className="text-right font-bold text-blue-600">{formatCurrency(data.firstMonthPayment)}</div>
                  <div className="font-medium">{t.results.lastPayment}</div>
                  <div className="text-right font-bold text-blue-600">{formatCurrency(data.lastMonthPayment)}</div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    );
  };

  const resultSection = (
    <>
      {results ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            {TAB_KEYS.map((key) => (
              <TabsTrigger key={key} value={key}>{t.tabs[key]}</TabsTrigger>
            ))}
          </TabsList>
          {TAB_KEYS.map((key) => {
            const data = key === 'equalPayment' ? results.equalTotal : key === 'equalPrincipal' ? results.equalPrincipal : results.bullet;
            return renderResultTab(key, data);
          })}
        </Tabs>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          {t.results.placeholder}
        </div>
      )}
    </>
  );

  const fullWidthSection = results ? (() => {
    const activeData =
      activeTab === 'equalPrincipal' ? results.equalPrincipal :
      activeTab === 'bulletLoan' ? results.bullet :
      results.equalTotal;
    if (!activeData) return null;
    return (
      <div className="max-h-80 overflow-y-auto">
        <Table className="w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[35px] px-1 text-xs">{t.table.month}</TableHead>
              <TableHead className="text-center px-1 min-w-[65px] text-xs whitespace-pre-line">{t.table.monthlyPayment}</TableHead>
              <TableHead className="text-center px-1 min-w-[65px] text-xs whitespace-pre-line">{t.table.principal}</TableHead>
              <TableHead className="text-center px-1 min-w-[65px] text-xs whitespace-pre-line">{t.table.interest}</TableHead>
              <TableHead className="text-center px-1 min-w-[85px] text-xs whitespace-pre-line">{t.table.balance}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeData.repaymentSchedule.map((item) => (
              <TableRow key={item.month}>
                <TableCell className="px-1 text-center whitespace-nowrap w-[35px] text-xs">{item.month}</TableCell>
                <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatCurrency(item.totalPayment)}</TableCell>
                <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatCurrency(item.principalPayment)}</TableCell>
                <TableCell className="px-1 text-center whitespace-nowrap min-w-[65px] text-xs">{formatCurrency(item.interestPayment)}</TableCell>
                <TableCell className="px-1 text-center whitespace-nowrap min-w-[85px] text-xs">{formatCurrency(item.remainingBalance)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  })() : null;

  const infoSection = {
    calculatorDescription: (
      <>
        <div dangerouslySetInnerHTML={{ __html: t.descriptionContent }} />
        <TermGlossary items={[
          { term: t.tabs.equalPayment, desc: t.glossary.equalPayment },
          { term: t.tabs.equalPrincipal, desc: t.glossary.equalPrincipal },
          { term: t.tabs.bulletLoan, desc: t.glossary.bulletLoan },
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
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={t.scheduleTitle}
      infoSection={infoSection}
    />
  );
};

export default LoanInterestCalculator;
