'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { formatNumber } from '@/utils/formatNumber';
import { intlLocale } from '@/i18n/config';
import { useI18n } from '@/i18n/I18nProvider';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface AmortRow {
  month: number;
  date: string;
  interest: number;
  principal: number;
  balance: number;
}

const MortgageCalculator: React.FC = () => {
  const { dict: d, locale, formatCurrency } = useI18n();
  const m = d.mortgage;

  const [homePrice, setHomePrice] = useState<number>(500000000);
  const [downPayment, setDownPayment] = useState<number>(100000000);
  const [loanTermYears, setLoanTermYears] = useState<number>(30);
  const [annualRate, setAnnualRate] = useState<number>(4.5);
  const [startYear, setStartYear] = useState<number>(2026);
  const [startMonth, setStartMonth] = useState<number>(0); // index 0-11
  // 추가 비용
  const [propertyTaxYearly, setPropertyTaxYearly] = useState<number>(1000000); // 연 세액(원)
  const [homeInsuranceYearly, setHomeInsuranceYearly] = useState<number>(500000);
  const [pmiRate, setPmiRate] = useState<number>(0); // 연 % (주택가격 대비)
  const [hoaMonthly, setHoaMonthly] = useState<number>(0);

  const [calculated, setCalculated] = useState<boolean>(false);

  useEffect(() => {
    setCalculated(false);
  }, [homePrice, downPayment, loanTermYears, annualRate, startYear, startMonth, propertyTaxYearly, homeInsuranceYearly, pmiRate, hoaMonthly]);

  const loanAmount = useMemo(() => Math.max(0, homePrice - downPayment), [homePrice, downPayment]);

  const calc = useMemo(() => {
    const n = loanTermYears * 12;
    const r = annualRate / 100 / 12;
    if (loanAmount <= 0 || n <= 0 || annualRate <= 0) {
      return null;
    }
    const monthlyPI = loanAmount * ((r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    const totalPI = monthlyPI * n;
    const totalInterest = totalPI - loanAmount;

    const monthlyTax = propertyTaxYearly / 12;
    const monthlyIns = homeInsuranceYearly / 12;
    const monthlyPmi = (homePrice * pmiRate) / 100 / 12;
    const monthlyOther = monthlyTax + monthlyIns + monthlyPmi + hoaMonthly;
    const totalMonthly = monthlyPI + monthlyOther;

    const totalCost = totalPI + monthlyOther * n;

    const startDate = new Date(startYear, startMonth, 1);
    const payoffDate = new Date(startDate);
    payoffDate.setMonth(payoffDate.getMonth() + n);

    const schedule: AmortRow[] = [];
    let balance = loanAmount;
    for (let mo = 1; mo <= n; mo++) {
      const interest = balance * r;
      const principal = monthlyPI - interest;
      balance = Math.max(0, balance - principal);
      const dt = new Date(startDate);
      dt.setMonth(dt.getMonth() + mo - 1);
      schedule.push({
        month: mo,
        date: `${dt.getFullYear()}.${String(dt.getMonth() + 1).padStart(2, '0')}`,
        interest: Math.round(interest),
        principal: Math.round(principal),
        balance: Math.round(balance),
      });
    }

    return {
      monthlyPI: Math.round(monthlyPI),
      monthlyTax: Math.round(monthlyTax),
      monthlyIns: Math.round(monthlyIns),
      monthlyPmi: Math.round(monthlyPmi),
      hoaMonthly: Math.round(hoaMonthly),
      totalMonthly: Math.round(totalMonthly),
      totalPI: Math.round(totalPI),
      totalInterest: Math.round(totalInterest),
      totalCost: Math.round(totalCost),
      payoffDate,
      schedule,
    };
  }, [loanAmount, loanTermYears, annualRate, startYear, startMonth, propertyTaxYearly, homeInsuranceYearly, pmiRate, hoaMonthly]);

  const pieData = useMemo(() => {
    if (!calc) return [];
    return [
      { name: m.results.principalInterest, value: loanAmount, fill: '#3b82f6' },
      { name: m.results.totalInterest, value: calc.totalInterest, fill: '#ef4444' },
    ];
  }, [calc, loanAmount, m]);

  const monthLabels = useMemo(() => {
    const fmt = new Intl.DateTimeFormat(intlLocale(locale), { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => fmt.format(new Date(2021, i, 1)));
  }, [locale]);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="homePrice">{m.inputs.homePrice}</Label>
        <Input id="homePrice" value={formatNumber(homePrice)} onChange={(e) => setHomePrice(parseFloat(e.target.value.replace(/,/g, '')) || 0)} className="text-right" />
      </div>

      <div className="space-y-1">
        <Label htmlFor="downPayment">{m.inputs.downPayment}</Label>
        <Input id="downPayment" value={formatNumber(downPayment)} onChange={(e) => setDownPayment(Math.max(0, parseFloat(e.target.value.replace(/,/g, '')) || 0))} className="text-right" />
        <p className="text-xs text-muted-foreground">{m.inputs.downPaymentHint} <strong className="text-foreground">{formatCurrency(Math.round(loanAmount), 'KRW')}</strong></p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="loanTermYears">{m.inputs.loanTerm}</Label>
          <Input id="loanTermYears" type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(Math.max(1, parseInt(e.target.value) || 1))} className="text-right" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="annualRate">{m.inputs.annualRate}</Label>
          <Input id="annualRate" type="number" step="0.1" value={annualRate} onChange={(e) => setAnnualRate(Math.max(0, parseFloat(e.target.value) || 0))} className="text-right" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="startYear">{m.inputs.startYear}</Label>
          <Input id="startYear" type="number" value={startYear} onChange={(e) => setStartYear(parseInt(e.target.value) || new Date().getFullYear())} className="text-right" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="startMonth">{m.inputs.startMonth}</Label>
          <select id="startMonth" value={startMonth} onChange={(e) => setStartMonth(parseInt(e.target.value))} className="w-full border border-border rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring">
            {monthLabels.map((mn, i) => (
              <option key={i} value={i}>{mn}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-3 border-t border-border">
        <p className="text-sm font-semibold text-foreground mb-2">{m.inputs.additionalCosts}</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="propertyTax" className="text-xs">{m.inputs.propertyTax}</Label>
            <Input id="propertyTax" value={formatNumber(propertyTaxYearly)} onChange={(e) => setPropertyTaxYearly(parseFloat(e.target.value.replace(/,/g, '')) || 0)} className="text-right text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="homeInsurance" className="text-xs">{m.inputs.homeInsurance}</Label>
            <Input id="homeInsurance" value={formatNumber(homeInsuranceYearly)} onChange={(e) => setHomeInsuranceYearly(parseFloat(e.target.value.replace(/,/g, '')) || 0)} className="text-right text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="pmiRate" className="text-xs">{m.inputs.pmi}</Label>
            <Input id="pmiRate" type="number" step="0.1" value={pmiRate} onChange={(e) => setPmiRate(Math.max(0, parseFloat(e.target.value) || 0))} className="text-right text-sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hoaMonthly" className="text-xs">{m.inputs.hoa}</Label>
            <Input id="hoaMonthly" type="number" value={hoaMonthly} onChange={(e) => setHoaMonthly(Math.max(0, parseFloat(e.target.value) || 0))} className="text-right text-sm" />
          </div>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{m.inputs.additionalHint}</p>
      </div>

      <Button onClick={() => setCalculated(true)} className="w-full" size="lg">{d.common.calculate}</Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-5">
      {calculated && calc ? (
        <>
          {/* 월 납부액 강조 */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-center">
            <p className="text-sm text-muted-foreground">{m.results.monthlyPayment}</p>
            <p className="text-4xl font-extrabold text-primary mt-1">{formatCurrency(calc.totalMonthly, 'KRW')}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.results.principalInterest} {formatCurrency(calc.monthlyPI, 'KRW')} + {m.results.additional} {formatCurrency(calc.totalMonthly - calc.monthlyPI, 'KRW')}</p>
          </div>

          {/* 구성 요소 표 */}
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <tbody>
                {[
                  [m.results.principalInterest, calc.monthlyPI, '#3b82f6'],
                  [m.results.propertyTax, calc.monthlyTax, '#10b981'],
                  [m.results.homeInsurance, calc.monthlyIns, '#f59e0b'],
                  [m.results.pmi, calc.monthlyPmi, '#8b5cf6'],
                  [m.results.hoa, calc.hoaMonthly, '#ec4899'],
                ].map(([label, val, color]) => (
                  <tr key={label as string} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color as string }} />
                        <span className="text-muted-foreground">{label as string}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium">{formatCurrency(val as number, 'KRW')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 요약 */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{m.results.loanAmount}</p>
              <p className="font-bold text-foreground">{formatCurrency(loanAmount, 'KRW')}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{m.results.downPayment}</p>
              <p className="font-bold text-foreground">{formatCurrency(Math.round(downPayment), 'KRW')}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{m.results.totalInterest}</p>
              <p className="font-bold text-red-500">{formatCurrency(calc.totalInterest, 'KRW')}</p>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{m.results.payoffDate}</p>
              <p className="font-bold text-foreground">{calc.payoffDate.getFullYear()}.{String(calc.payoffDate.getMonth() + 1).padStart(2, '0')}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
          <p>{m.results.calculateHint}</p>
        </div>
      )}
    </div>
  );

  const fullWidthSection = calculated && calc ? (
    <div className="space-y-8">
      {/* 원리금 분포 차트 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">{m.results.principalInterestSplit}</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 8, right: 8, bottom: 8, left: 8 }}>
              <RechartsTooltip formatter={(value: number) => formatCurrency(value, 'KRW')} />
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={105}
                paddingAngle={2}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
                  const r = innerRadius + (outerRadius - innerRadius) / 2;
                  const x = cx + r * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + r * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={15} fontWeight={700}>
                      {`${((percent ?? 0) * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
                labelLine={false}
              >
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={28} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 분할상환표 */}
      <div>
        <h3 className="text-base font-semibold text-foreground mb-2">{m.results.amortizationSchedule}</h3>
        <div className="max-h-[360px] overflow-auto rounded-lg border border-border">
          <table className="w-full text-xs border-collapse">
            <thead className="sticky top-0 bg-muted">
              <tr className="text-muted-foreground border-b border-border">
                <th className="px-3 py-2 text-left font-medium">{m.results.year}</th>
                <th className="px-3 py-2 text-right font-medium">{m.results.yearlyInterest}</th>
                <th className="px-3 py-2 text-right font-medium">{m.results.yearlyPrincipal}</th>
                <th className="px-3 py-2 text-right font-medium">{m.results.balance}</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: loanTermYears }).map((_, y) => {
                const rows = calc.schedule.slice(y * 12, (y + 1) * 12);
                const yInterest = rows.reduce((s, r) => s + r.interest, 0);
                const yPrincipal = rows.reduce((s, r) => s + r.principal, 0);
                const lastBalance = rows[rows.length - 1]?.balance ?? 0;
                return (
                  <tr key={y} className="border-b border-border">
                    <td className="px-3 py-2 text-foreground">{startYear + y}</td>
                    <td className="px-3 py-2 text-right text-red-500">{formatCurrency(yInterest, 'KRW')}</td>
                    <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(yPrincipal, 'KRW')}</td>
                    <td className="px-3 py-2 text-right text-muted-foreground">{formatCurrency(lastBalance, 'KRW')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null;

  const descriptionKO = (
    <>
      <p className="text-muted-foreground">
        <strong className="text-foreground">주택담보대출 계산기</strong>는 내 집 마련의 꿈을 현실로 바꾸는 가장 보편적인 금융 수단입니다. 주택을 담보로 제공하고 은행에서 목돈을 빌려 매월 원리금을 나누어 갚아가는 구조로, 신용대출보다 낮은 금리로 큰 금액을 조달할 수 있다는 장점이 있습니다.
      </p>
      <p className="mt-4 text-muted-foreground">
        calculator.net과 같은 종합형 계산기는 대출금액뿐 아니라 <strong className="text-foreground">선수금, 재산세, 주택보험, PMI, HOA 관리비</strong>까지 모두 고려하여 '진짜 월 부담액'을 보여줍니다. 주택 구매 시 매월 빠져나가는 고정 지출을 한눈에 파악하는 것이 현명한 첫걸음입니다.
      </p>
      <p className="mt-4 text-muted-foreground">
        본 계산기는 항목을 입력하고 <strong className="text-foreground">'계산하기'</strong>를 누르면, 월 예상 납부액·비용 구성·상환 종료일·분할 상환 스케줄까지 한 번에 제공합니다. 낯선 용어는 아래 용어 풀이를 참고하세요.
      </p>
    </>
  );

  const descriptionEN = (
    <>
      <p className="text-muted-foreground">
        <strong className="text-foreground">Mortgage Calculator</strong> is the most common financial tool for turning the dream of homeownership into reality. You pledge the home as collateral and borrow a lump sum from a bank, repaying it monthly as principal & interest — usually at a lower rate than unsecured loans.
      </p>
      <p className="mt-4 text-muted-foreground">
        Comprehensive calculators like calculator.net consider not just the loan amount but also <strong className="text-foreground">down payment, property tax, home insurance, PMI and HOA fees</strong> to show your &quot;true monthly burden.&quot; Seeing every fixed monthly outflow at a glance is the smart first step.
      </p>
      <p className="mt-4 text-muted-foreground">
        Enter your inputs and press <strong className="text-foreground">&apos;Calculate&apos;</strong> to get the estimated monthly payment, cost breakdown, payoff date and amortization schedule at once. See the glossary below for unfamiliar terms.
      </p>
    </>
  );

  const calculatorDescription = locale === 'ko' ? descriptionKO : descriptionEN;

  const infoSection = {
    calculatorDescription: (
      <>
        {calculatorDescription}
        <h3 className="text-base font-semibold mt-6 mb-2 text-foreground">{m.glossary.title}</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {Object.entries(m.glossary)
            .filter(([key]) => key !== 'title')
            .map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
        </ul>
      </>
    ),
    calculationFormula: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-3 text-foreground">{m.formula.title}</h3>
        <div className="font-mono p-3 bg-card rounded-md my-2 text-sm text-primary">
          <strong>M = P × [ r(1+r)^n ] / [ (1+r)^n − 1 ]</strong>
        </div>
        <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
          <li><strong className="text-foreground">{m.formula.m}</strong></li>
          <li><strong className="text-foreground">{m.formula.p}</strong></li>
          <li><strong className="text-foreground">{m.formula.r}</strong></li>
          <li><strong className="text-foreground">{m.formula.n}</strong></li>
        </ul>
        <p className="mt-4 text-muted-foreground text-sm">{m.formula.note}</p>
      </>
    ),
    usefulTips: (
      <>
        <h3 className="text-lg font-semibold mt-6 mb-4 text-foreground">{m.tips.title}</h3>
        <div className="space-y-4">
          {Object.values(m.tips.items).map((tip, i) => (
            <div key={i} className="flex gap-3">
              <span className="shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-sm">
                {i + 1}
              </span>
              <div>
                <h4 className="font-semibold text-foreground">{tip.title}</h4>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{tip.body}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title={m.title}
      description={m.description}
      variant="grouped"
      fullWidthSection={fullWidthSection}
      fullWidthTitle={m.results.detailAnalysis}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default MortgageCalculator;
