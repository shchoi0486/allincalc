'use client';

import React, { useState, useMemo, useCallback } from 'react'
import { NextPage } from 'next'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CustomDatePicker, CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import { HelpCircle, FileText, PiggyBank } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

const InsuranceCalculator: NextPage = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const [monthlySalary, setMonthlySalary] = useState<number>(4500000);
  const [employeeCount, setEmployeeCount] = useState<string>('150 미만 기업');
  const [industrialAccidentRate, setIndustrialAccidentRate] = useState<number>(1.26);
  const [isCalculated, setIsCalculated] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, '');
    setter(parseFloat(value || '0'));
  };

  const handleCalculate = useCallback(() => {
    const salary = monthlySalary;
    if (isNaN(salary) || salary <= 0) {
      toast.error(isKo ? '올바른 월 급여를 입력해주세요.' : 'Please enter a valid monthly salary.');
      return;
    }

    const industrialRate = industrialAccidentRate;
    if (isNaN(industrialRate)) {
      toast.error(isKo ? '올바른 산재보험료율을 입력해주세요.' : 'Please enter a valid industrial accident insurance rate.');
      return;
    }

    // 국민연금 (상한액 5,900,000원, 하한액 370,000원 적용)
    const nationalPensionBase = Math.max(370000, Math.min(salary, 5900000));
    const nationalPensionTotal = nationalPensionBase * 0.09;
    const nationalPensionEmployee = nationalPensionTotal / 2;
    const nationalPensionEmployer = nationalPensionTotal / 2;

    // 건강보험
    const healthInsuranceTotal = salary * 0.0709;
    const healthInsuranceEmployee = healthInsuranceTotal / 2;
    const healthInsuranceEmployer = healthInsuranceTotal / 2;

    // 장기요양보험
    const longTermCareInsuranceTotal = healthInsuranceTotal * 0.1295;
    const longTermCareInsuranceEmployee = longTermCareInsuranceTotal / 2;
    const longTermCareInsuranceEmployer = longTermCareInsuranceTotal / 2;

    // 고용보험
    let unemploymentInsuranceRate = 0.009;
    if (employeeCount === '150인 이상 기업(우선 지원대상 기업)') {
      unemploymentInsuranceRate = 0.011;
    } else if (employeeCount === '150인 이상 1,000인 미만 기업') {
      unemploymentInsuranceRate = 0.013;
    } else if (employeeCount === '1,000인 이상기업/국가지방자치단체') {
      unemploymentInsuranceRate = 0.015;
    }
    const unemploymentInsuranceTotal = salary * (unemploymentInsuranceRate + 0.009);
    const unemploymentInsuranceEmployee = salary * 0.009;
    const unemploymentInsuranceEmployer = salary * unemploymentInsuranceRate;


    // 산재보험 (전액 사업주 부담)
    const industrialAccidentInsuranceTotal = salary * (industrialRate / 100);
    const industrialAccidentInsuranceEmployee = 0;
    const industrialAccidentInsuranceEmployer = industrialAccidentInsuranceTotal;

    const totalEmployeeDeduction = nationalPensionEmployee + healthInsuranceEmployee + longTermCareInsuranceEmployee + unemploymentInsuranceEmployee;
    const totalEmployerBurden = nationalPensionEmployer + healthInsuranceEmployer + longTermCareInsuranceEmployer + unemploymentInsuranceEmployer + industrialAccidentInsuranceEmployer;
    const totalInsurance = totalEmployeeDeduction + totalEmployerBurden;
    const actualSalary = salary - totalEmployeeDeduction;

    setResult({
      nationalPension: { total: nationalPensionTotal, employee: nationalPensionEmployee, employer: nationalPensionEmployer },
      healthInsurance: { total: healthInsuranceTotal, employee: healthInsuranceEmployee, employer: healthInsuranceEmployer },
      longTermCareInsurance: { total: longTermCareInsuranceTotal, employee: longTermCareInsuranceEmployee, employer: longTermCareInsuranceEmployer },
      unemploymentInsurance: { total: unemploymentInsuranceTotal, employee: unemploymentInsuranceEmployee, employer: unemploymentInsuranceEmployer },
      industrialAccidentInsurance: { total: industrialAccidentInsuranceTotal, employee: industrialAccidentInsuranceEmployee, employer: industrialAccidentInsuranceEmployer },
      totalEmployeeDeduction,
      totalEmployerBurden,
      totalInsurance,
      actualSalary,
    });
    setIsCalculated(true);
    toast.success(isKo ? '4대보험료가 계산되었습니다.' : 'The four major insurance premiums have been calculated.');
  }, [monthlySalary, employeeCount, industrialAccidentRate, isKo]);

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlySalary">{isKo ? '월 급여 (원)' : 'Monthly Salary (KRW)'}</Label>
          <Input id="monthlySalary" value={monthlySalary.toLocaleString()} onChange={handleInputChange(setMonthlySalary)} placeholder={isKo ? '예: 4,500,000' : 'e.g., 4,500,000'} className="text-right" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="employeeCount">{isKo ? '근로자수' : 'Number of Employees'}</Label>
          <Select value={employeeCount} onValueChange={setEmployeeCount}>
            <SelectTrigger>
              <SelectValue placeholder={isKo ? '근로자수 선택' : 'Select number of employees'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="150 미만 기업">{isKo ? '150인 미만 기업' : 'Under 150 employees'}</SelectItem>
              <SelectItem value="150인 이상 기업(우선 지원대상 기업)">{isKo ? '150인 이상 기업(우선 지원대상 기업)' : '150+ employees (priority support company)'}</SelectItem>
              <SelectItem value="150인 이상 1,000인 미만 기업">{isKo ? '150인 이상 1,000인 미만 기업' : '150 to under 1,000 employees'}</SelectItem>
              <SelectItem value="1,000인 이상기업/국가지방자치단체">{isKo ? '1,000인 이상기업/국가지방자치단체' : '1,000+ employees / government'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="industrialAccidentRate">{isKo ? '산재보험료율 (%)' : 'Industrial Accident Rate (%)'}</Label>
          <div className="flex items-center gap-2">
            <Input id="industrialAccidentRate" value={industrialAccidentRate.toLocaleString()} onChange={handleInputChange(setIndustrialAccidentRate)} placeholder={isKo ? '예: 1.26' : 'e.g., 1.26'} className="text-right" />
            <a href="https://www.comwel.or.kr/comwel/paym/insu/chek1.jsp" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                {isKo ? '알아보기' : 'Look up'} <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          </div>
        </div>
      </div>
      <Button onClick={handleCalculate} className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
    </div>
  );

  const resultSection = isCalculated && result ? (
    <Card>
      <CardHeader>
        <CardTitle>{isKo ? '계산 결과' : 'Calculation Result'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{isKo ? '예상 실수령액' : 'Estimated Net Pay'}</p>
            <p className="text-2xl font-bold">{formatNumber(Math.floor(result.actualSalary))}{isKo ? '원' : ' KRW'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{isKo ? '총 공제액 (근로자 부담)' : 'Total Deduction (Employee)'}</p>
            <p className="text-2xl font-bold text-red-500">{formatNumber(Math.floor(result.totalEmployeeDeduction))}{isKo ? '원' : ' KRW'}</p>
          </div>
        </div>
        <Separator />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="p-2">{isKo ? '구분' : 'Category'}</th>
                <th className="p-2 text-right">{isKo ? '총 보험료' : 'Total Premium'}</th>
                <th className="p-2 text-right">{isKo ? '근로자 부담' : 'Employee'}</th>
                <th className="p-2 text-right">{isKo ? '사업주 부담' : 'Employer'}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-2 font-medium">{isKo ? '국민연금' : 'National Pension'}</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.nationalPension.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{isKo ? '건강보험' : 'Health Insurance'}</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.healthInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{isKo ? '장기요양보험' : 'Long-term Care Insurance'}</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.longTermCareInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{isKo ? '고용보험' : 'Employment Insurance'}</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.unemploymentInsurance.employer).toLocaleString()}</td>
              </tr>
              <tr className="border-b">
                <td className="p-2 font-medium">{isKo ? '산재보험' : 'Industrial Accident Insurance'}</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.total).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.employee).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.industrialAccidentInsurance.employer).toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="font-bold bg-muted">
              <tr>
                <td className="p-2">{isKo ? '합계' : 'Total'}</td>
                <td className="p-2 text-right">{Math.floor(result.totalInsurance).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.totalEmployeeDeduction).toLocaleString()}</td>
                <td className="p-2 text-right">{Math.floor(result.totalEmployerBurden).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </CardContent>
    </Card>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-40">
      {isKo ? '계산하기 버튼을 눌러주세요' : 'Please press the Calculate button'}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="text-base leading-relaxed space-y-6">
        <p>
          {isKo ? <><strong>4대 사회보험 계산기</strong>는 대한민국 직장인이라면 누구나 매달 마주하는 '급여 공제 내역'의 비밀을 명쾌하게 풀어주는 필수 도구입니다. 내 소중한 월급에서 국민연금, 건강보험, 고용보험, 산재보험료가 각각 얼마씩, 왜 공제되는지, 그리고 회사는 나를 위해 얼마의 비용을 추가로 부담하고 있는지 <strong>2025년 최신 요율</strong>에 맞춰 정확하게 계산해 드립니다.</> : <>The <strong>Four Major Social Insurance Calculator</strong> is an essential tool that clearly unravels the secret of the 'salary deduction details' every Korean employee faces each month. It accurately calculates, based on the <strong>latest 2025 rates</strong>, how much and why the National Pension, Health Insurance, Employment Insurance, and Industrial Accident Insurance are deducted from your salary, and how much extra cost the company bears for you.</>}
        </p>
        <p>
          {isKo ? <>단순한 숫자 계산을 넘어, 이 계산기는 <strong>나의 사회적 안전망</strong>이 어떻게 구축되는지를 보여주는 바로미터입니다. 아플 때, 직장을 잃었을 때, 은퇴 후 노후를 맞이했을 때 든든한 버팀목이 되어주는 4대 보험의 가치를 이해하고, 나의 권리와 의무를 명확히 인지하는 계기가 될 것입니다. 또한, 예상 실수령액을 통해 보다 현실적인 재무 계획을 세우고, 합법적인 절세 전략(비과세 소득 활용 등)을 고민해볼 수 있는 출발점을 제공합니다.</> : <>Beyond simple number crunching, this calculator is a barometer showing how <strong>your social safety net</strong> is built. It helps you understand the value of the four insurances that support you when sick, unemployed, or retired, and clearly recognize your rights and obligations. It also provides a starting point to build more realistic financial plans through the estimated net pay and to consider legal tax-saving strategies (using non-taxable income, etc.).</>}
        </p>
        <p>
          {isKo ? '인사 담당자나 소규모 사업주에게는 직원 채용 시 발생하는 인건비 구조를 사전에 파악하고, 정확한 급여 책정을 위한 중요한 참고 자료로 활용될 수 있습니다. 지금 바로 당신의 월급과 미래를 스마트하게 관리해 보세요!' : 'For HR staff and small business owners, it can serve as important reference for understanding the labor cost structure of hiring in advance and for setting accurate salaries. Start managing your salary and future smartly right now!'}
        </p>        <TermGlossary items={[
          { term: isKo ? '4대 사회보험' : 'Four Major Social Insurances', desc: isKo ? '국민연금·건강보험·장기요양보험·고용보험을 묶어 이르는 말로, 근로자의 사회안전망을 위해 급여에서 공제됩니다.' : 'A collective term for National Pension, Health Insurance, Long-term Care Insurance, and Employment Insurance, deducted from salary for the worker\u2019s social safety net.' },
          { term: isKo ? '기준소득월액' : 'Standard Monthly Income', desc: isKo ? '국민연금 보험료 산정 기준이 되는 월 소득으로, 매년 하한(39만 원)과 상한(617만 원) 범위 내에서 결정됩니다.' : 'The monthly income used as the basis for National Pension premiums, set within an annual lower (390K) and upper (6.17M) limit.' },
          { term: isKo ? '보수월액' : 'Monthly Remuneration', desc: isKo ? '건강보험료 등을 산정할 때 기준이 되는 과세 대상 월 급여(비과세 소득 제외)입니다.' : 'The taxable monthly salary (excluding non-taxable income) used as the basis for Health Insurance premiums and more.' },
        ]} />

      </div>
    ),
    calculationFormula: (
      <div className="text-base leading-relaxed space-y-8">
        <p className="text-sm text-muted-foreground">
          {isKo ? <><strong>2025년 최신 요율 기준</strong>이며, 모든 보험료는 과세 대상 소득인 '보수월액'을 기준으로 산정됩니다. (비과세 소득 제외)</> : <>Based on the <strong>latest 2025 rates</strong>; all premiums are computed on the taxable 'monthly remuneration' (excluding non-taxable income).</>}
        </p>
        
        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="text-xl font-bold text-primary mb-3">{isKo ? '1. 국민연금 (총 9%) - 당신의 노후를 위한 최소한의 약속' : '1. National Pension (Total 9%) - A Minimum Promise for Your Retirement'}</h3>
          <p className="mb-3">{isKo ? '국민연금은 노령, 장애, 사망과 같은 예기치 못한 상황이 발생했을 때, 본인이나 유족에게 연금을 지급하여 안정적인 삶을 지원하는 사회보장제도입니다.' : 'The National Pension is a social security system that supports a stable life by paying a pension to you or your survivors upon unexpected events like old age, disability, or death.'}</p>
          <p className="font-mono p-4 bg-card rounded-md text-sm">{isKo ? '보험료 = 기준소득월액 × 9%' : 'Premium = Standard Monthly Income × 9%'}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div><strong>{isKo ? '근로자 부담:' : 'Employee:'}</strong> 4.5%</div>
            <div><strong>{isKo ? '사업주 부담:' : 'Employer:'}</strong> 4.5%</div>
          </div>
          <p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">{isKo ? <>※ 2025년 기준소득월액: <strong>하한 390,000원 ~ 상한 6,170,000원</strong> 범위 내에서 적용됩니다. (변동 가능)</> : <>※ 2025 standard monthly income: applied within a range of <strong>390,000 KRW (lower) to 6,170,000 KRW (upper)</strong>. (subject to change)</>}</p>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="text-xl font-bold text-primary mb-3">{isKo ? '2. 건강보험 (총 7.09%) - 아플 때 기댈 수 있는 든든한 어깨' : '2. Health Insurance (Total 7.09%) - A Reliable Shoulder When Sick'}</h3>
          <p className="mb-3">{isKo ? '질병이나 부상으로 인한 의료비 부담을 줄여주고, 정기적인 건강검진 서비스를 제공하여 국민의 건강을 지키는 핵심적인 사회보험입니다.' : 'A core social insurance that reduces medical cost burdens from illness or injury and provides regular health checkups to protect public health.'}</p>
          <p className="font-mono p-4 bg-card rounded-md text-sm">{isKo ? '보험료 = 보수월액 × 7.09%' : 'Premium = Monthly Remuneration × 7.09%'}</p>
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div><strong>{isKo ? '근로자 부담:' : 'Employee:'}</strong> 3.545%</div>
            <div><strong>{isKo ? '사업주 부담:' : 'Employer:'}</strong> 3.545%</div>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <h4 className="font-semibold text-lg">{isKo ? '+ 장기요양보험 (건강보험료의 12.95%)' : '+ Long-term Care Insurance (12.95% of Health Insurance)'}</h4>
            <p className="text-sm mt-1">{isKo ? '고령이나 노인성 질병으로 혼자 생활하기 어려운 어르신들에게 신체활동 또는 가사활동 지원 등의 요양 서비스를 제공합니다.' : 'Provides care services such as physical or household activity support to seniors who cannot live alone due to old age or geriatric illness.'}</p>
            <p className="font-mono p-3 bg-card rounded-md text-xs mt-2">{isKo ? '보험료 = 건강보험료 × 12.95% (근로자/사업주 절반씩 부담)' : 'Premium = Health Insurance × 12.95% (split equally between employee/employer)'}</p>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="text-xl font-bold text-primary mb-3">{isKo ? '3. 고용보험 - 실직의 불안을 덜고, 새로운 시작을 응원' : '3. Employment Insurance - Easing Job-loss Anxiety and Supporting New Beginnings'}</h3>
          <p className="mb-3">{isKo ? '실직한 근로자에게 실업급여를 지급하여 생계를 지원하고, 재취업 활동을 돕습니다. 또한 육아휴직 급여, 출산전후휴가 급여의 재원이 되기도 합니다.' : 'Pays unemployment benefits to support the livelihood of jobless workers and helps re-employment. It also funds parental leave and maternity leave benefits.'}</p>
          <p className="font-mono p-4 bg-card rounded-md text-sm">{isKo ? '보험료 = 보수월액 × (실업급여 요율 + 고용안정·직업능력개발사업 요율)' : 'Premium = Monthly Remuneration × (Unemployment benefit rate + Employment stability/vocational development rate)'}</p>
          <div className="mt-3 text-sm space-y-2">
            <p><strong>{isKo ? '- 실업급여 (총 1.8%):' : '- Unemployment benefit (total 1.8%):'}</strong> {isKo ? '근로자 0.9% + 사업주 0.9%' : 'Employee 0.9% + Employer 0.9%'}</p>
            <p><strong>{isKo ? '- 고용안정·직업능력개발사업:' : '- Employment stability/vocational development:'}</strong> {isKo ? '사업주만 부담 (기업 규모에 따라 0.25% ~ 0.85% 추가)' : 'Employer only (additional 0.25%–0.85% by company size)'}</p>
          </div>
        </div>

        <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
          <h3 className="text-xl font-bold text-primary mb-3">{isKo ? '4. 산재보험 - 일터의 안전을 지키는 최후의 보루' : '4. Industrial Accident Insurance - The Last Line of Workplace Safety'}</h3>
          <p className="mb-3">{isKo ? '출퇴근을 포함한 모든 업무상 재해(부상, 질병, 사망 등)에 대해 근로자를 보호합니다. 치료비, 휴업급여, 장해급여 등을 지급합니다.' : 'Protects workers against all work-related accidents (injury, illness, death, etc.), including commuting. It pays medical costs, leave benefits, and disability benefits.'}</p>
          <p className="font-mono p-4 bg-card rounded-md text-sm">{isKo ? '보험료 = 보수총액 × 업종별 보험료율' : 'Premium = Total Remuneration × Industry-specific rate'}</p>
            <div className="mt-3 text-sm">
              <p><strong>{isKo ? '근로자 부담: 0% (전액 사업주 부담)' : 'Employee: 0% (fully borne by employer)'}</strong></p>
              <p className="text-xs text-muted-foreground mt-1">{isKo ? '※ 요율은 업종의 위험도에 따라 매우 다양하며, 매년 정부가 고시합니다. (예: 사무직 0.7%, 제조업 1.5%, 건설업 3.6% 등)' : '※ Rates vary widely by industry risk and are announced annually by the government. (e.g., office 0.7%, manufacturing 1.5%, construction 3.6%)'}</p>
            </div>
          <div className="mt-6 p-4 bg-muted rounded-lg border border-border">
            <h4 className="font-semibold text-foreground mb-2">{isKo ? '계산 예시 (월 급여 450만 원, 사무직)' : 'Example (monthly salary 4.5M KRW, office job)'}</h4>
            <p className="text-sm text-muted-foreground">{isKo ? '국민연금 405,000(근로자 202,500) · 건강보험 319,050(159,525)' : 'National Pension 405,000 (employee 202,500) · Health 319,050 (159,525)'}</p>
            <p className="font-mono text-sm text-primary mt-1">{isKo ? '장기요양 41,316(20,658) · 고용보험 81,000(40,500) · 산재 31,500(0)' : 'Long-term care 41,316 (20,658) · Employment 81,000 (40,500) · Industrial 31,500 (0)'}</p>
            <p className="font-mono text-sm text-primary">{isKo ? '근로자 총 부담 ≈ 423,183원 → 예상 실수령액 ≈ 4,076,817원' : 'Total employee burden ≈ 423,183 KRW → estimated net pay ≈ 4,076,817 KRW'}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="text-base leading-relaxed space-y-8">
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💡 4대 보험, 200% 활용하는 스마트 직장인 되기 (2025년 Ver.)' : '💡 Become a Smart Employee Who Uses the Four Insurances to the Fullest (2025 Ver.)'}</h2>
        <div className="space-y-6">
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">{isKo ? "1. '비과세 소득' 항목부터 꼼꼼히 챙기세요." : "1. Start by Carefully Managing 'Non-taxable Income' Items."}</h4>
            <p className="mt-2">{isKo ? <>4대 보험료는 과세소득 기준입니다. 연봉 계약 시 <strong>식대(월 20만원), 차량유지비(월 20만원), 육아수당(월 20만원)</strong> 등 비과세 항목을 최대한 활용하면 보험료와 소득세를 동시에 줄이는 '일석이조'의 효과를 누릴 수 있습니다. 급여명세서에 비과세 항목이 제대로 반영되어 있는지 확인하는 습관이 중요합니다.</> : <>The four insurances are based on taxable income. When signing your salary contract, maximizing non-taxable items like <strong>meal allowance (200K/month), car maintenance (200K/month), childcare allowance (200K/month)</strong> lets you cut both premiums and income tax at once. Make a habit of checking that non-taxable items are properly reflected on your pay stub.</>}</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">{isKo ? "2. 건강보험, 내기만 하지 말고 '혜택'을 누리세요." : "2. Don't Just Pay Health Insurance—Enjoy Its 'Benefits'."}</h4>
            <p className="mt-2">{isKo ? '직장인은 2년에 한 번(비사무직은 매년) 무료로 국가건강검진을 받을 수 있습니다. 위암, 대장암, 유방암 등 주요 암 검진도 포함됩니다. 귀찮다고 미루지 마세요. 질병의 조기 발견은 수천만 원의 치료비를 아끼는 가장 확실한 방법입니다. 또한, 본인부담상한제를 통해 과도한 의료비가 발생했을 경우 일정 금액을 환급받을 수도 있습니다.' : 'Employees can get a free national health checkup once every 2 years (annually for non-office jobs), including major cancer screenings (stomach, colon, breast). Do not put it off. Early detection is the surest way to save tens of millions in treatment costs. You can also get a refund via the out-of-pocket cap system if excessive medical costs arise.'}</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">{isKo ? "3. 국민연금, '추납'과 '임의가입'으로 노후를 업그레이드하세요." : "3. Upgrade Retirement With National Pension 'Back-payment' and 'Voluntary Enrollment'."}</h4>
            <p className="mt-2">{isKo ? "과거에 실직이나 휴직으로 내지 못했던 국민연금 보험료가 있다면 '추후납부(추납)'를 통해 가입 기간을 늘릴 수 있습니다. 가입 기간이 길수록 노후에 받는 연금액이 늘어납니다. 또한, 소득이 없는 배우자도 '임의가입'을 통해 국민연금에 가입하여 각자의 노후를 준비할 수 있다는 점을 기억하세요." : "If you have unpaid National Pension premiums from past unemployment or leave, you can extend your enrollment period via 'back-payment.' Longer enrollment means a larger pension in retirement. Also remember that a spouse with no income can enroll via 'voluntary enrollment' to prepare their own retirement."}</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">{isKo ? "4. 고용보험, 실업급여 외 '내일배움카드'를 주목하세요." : "4. Beyond Unemployment Benefits, Note the Employment Insurance 'Tomorrow Learning Card'."}</h4>
            <p className="mt-2">{isKo ? "고용보험은 실업급여뿐만 아니라, 직무 능력 향상을 위한 훈련비를 지원하는 '국민내일배움카드'의 재원이기도 합니다. 이직을 준비하거나 현재 직무의 전문성을 높이고 싶다면, 1인당 300~500만원까지 지원되는 훈련비를 활용하여 몸값을 높이는 기회로 삼으세요." : "Employment Insurance funds not only unemployment benefits but also the 'National Tomorrow Learning Card,' which supports training costs for skill improvement. If preparing to change jobs or boost your current expertise, use training support of 3–5M KRW per person to raise your market value."}</p>
          </div>
          <div className="p-5 rounded-lg bg-muted border-l-4 border-primary">
            <h4 className="font-bold text-lg text-primary">{isKo ? "5. 이직/퇴사 시, '건강보험 임의계속가입' 제도를 활용하세요." : "5. When Changing Jobs/Resigning, Use the 'Health Insurance Voluntary Continued Enrollment' System."}</h4>
            <p className="mt-2">{isKo ? "퇴사 후에는 직장가입자에서 지역가입자로 전환되면서 소득뿐만 아니라 재산(자동차, 집 등)에도 보험료가 부과되어 건강보험료가 급증할 수 있습니다. 이때 '임의계속가입' 제도를 신청하면, 퇴사 전 직장에서 내던 수준의 보험료를 최대 3년간 유지할 수 있습니다. 실직 기간 동안 보험료 부담을 크게 줄일 수 있는 꿀팁입니다." : "After resigning, you switch from workplace to regional subscriber, and premiums apply not only to income but also to assets (car, home, etc.), spiking your health insurance. Applying for 'voluntary continued enrollment' lets you keep your pre-resignation premium level for up to 3 years—a great tip to greatly reduce premium burden during unemployment."}</p>
          </div>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title={isKo ? '4대보험 계산기' : 'Four Major Insurance Calculator'}
      description={isKo ? '월 급여에 따른 4대보험료를 계산합니다.' : 'Calculate the four major insurance premiums based on monthly salary.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default InsuranceCalculator;