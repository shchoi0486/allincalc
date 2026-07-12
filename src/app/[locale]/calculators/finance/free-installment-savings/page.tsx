'use client'

import React, { useState, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useFieldArray } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { differenceInDays } from 'date-fns'
import { Trash2, PlusCircle, HelpCircle, FileText, PiggyBank } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from 'sonner'
import { formatNumber, parseNumber } from '@/utils/formatNumber'
import { Table, TableBody, TableCell, TableRow, TableHeader, TableHead } from '@/components/ui/table'
import CalculatorsLayout from '@/components/calculators/Calculatorslayout'
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const FreeInstallmentSavingsPage: React.FC = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';

  const depositSchema = z.object({
    date: z.date({ required_error: isKo ? '날짜를 입력해주세요.' : 'Please enter a date.' }),
    amount: z.number({ required_error: isKo ? '유효한 숫자를 입력해주세요.' : 'Please enter a valid number.' })
      .refine(val => val > 0, { message: isKo ? '납입금액은 0보다 커야 합니다.' : 'The deposit amount must be greater than 0.' }),
  });

  const formSchema = z.object({
    deposits: z.array(depositSchema).min(1, isKo ? '하나 이상의 납입금이 필요합니다.' : 'At least one deposit is required.'),
    maturityDate: z.date({ required_error: isKo ? '만기일을 입력해주세요.' : 'Please enter a maturity date.' }),
    interestRate: z.number({ required_error: isKo ? '유효한 숫자를 입력해주세요.' : 'Please enter a valid number.' })
      .refine(val => {
          return val >= 0 && val <= 100;
      }, { message: isKo ? '이자율은 0에서 100 사이여야 합니다.' : 'The interest rate must be between 0 and 100.' }),
    interestType: z.enum(['simple', 'compound']),
    taxType: z.enum(['general', 'preferential', 'non-taxable']),
  }).refine(data => {
      for (const deposit of data.deposits) {
          if (differenceInDays(data.maturityDate, deposit.date) < 0) {
              return false;
          }
      }
      return true;
  }, { message: isKo ? '만기일은 모든 납입일보다 이후여야 합니다.' : 'The maturity date must be after all deposit dates.', path: ['maturityDate'] });

  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      deposits: [{ date: new Date(), amount: 0 }],
      maturityDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      interestRate: 2.5,
      interestType: 'simple',
      taxType: 'general',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'deposits',
  });

  const handleNumericInputChange = useCallback(
    (onChange: (value: number) => void) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        const numericValue = value ? parseFloat(value.replace(/,/g, '')) : 0;
        onChange(isNaN(numericValue) ? 0 : numericValue);
    },
    []
  );

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { deposits, maturityDate, interestRate, interestType, taxType } = values;
    const rate = interestRate / 100;

    let totalInterest = 0;
    const principal = deposits.reduce((sum, p) => sum + p.amount, 0);

    if (interestType === 'simple') {
      totalInterest = deposits.reduce((sum, deposit) => {
        const days = differenceInDays(maturityDate, deposit.date);
        if (days < 0) return sum;
        const interest = deposit.amount * rate * (days / 365);
        return sum + interest;
      }, 0);
    } else { // 월 복리 근사치
      totalInterest = deposits.reduce((sum, deposit) => {
        const months = (maturityDate.getFullYear() - deposit.date.getFullYear()) * 12 + (maturityDate.getMonth() - deposit.date.getMonth());
        if (months <= 0) return sum;
        const monthlyRate = rate / 12;
        const finalValue = deposit.amount * Math.pow(1 + monthlyRate, months);
        return sum + (finalValue - deposit.amount);
      }, 0);
    }

    const preTaxInterest = Math.floor(totalInterest);
    const taxRateValue = taxType === 'general' ? 0.154 : taxType === 'preferential' ? 0.095 : 0;
    const tax = Math.floor(preTaxInterest * taxRateValue);
    const postTaxInterest = preTaxInterest - tax;
    const finalAmount = principal + postTaxInterest;

    setResult({
      principal,
      preTaxInterest,
      tax,
      postTaxInterest,
      finalAmount,
      taxRate: taxRateValue * 100,
    });
    toast.success(isKo ? '자유적금 계산이 완료되었습니다.' : 'Free savings calculation completed.');
  };

  const LeftColumn = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
        <div className="space-y-6 flex-grow">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{isKo ? '납입금 정보' : 'Deposit information'}</h3>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start space-x-2 p-2 border rounded-md">
                <div className="flex-grow space-y-2">
                  <FormField
                    control={form.control}
                    name={`deposits.${index}.date`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isKo ? '납입일' : 'Deposit date'}</FormLabel>
                        <FormControl><CustomDatePickerWithPopover date={field.value} setDate={field.onChange} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`deposits.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{isKo ? '납입금액 (원)' : 'Deposit amount (KRW)'}</FormLabel>
                        <FormControl><Input placeholder={isKo ? '납입금액' : 'Deposit amount'} {...field} onChange={handleNumericInputChange(field.onChange)} className="text-right" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="mt-7">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => append({ date: new Date(), amount: 0 })} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" /> {isKo ? '납입금 추가' : 'Add deposit'}
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{isKo ? '적금 정보' : 'Savings information'}</h3>
            <FormField
              control={form.control}
              name="maturityDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isKo ? '만기일' : 'Maturity date'}</FormLabel>
                  <FormControl><CustomDatePickerWithPopover date={field.value} setDate={field.onChange} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isKo ? '연 이자율 (%)' : 'Annual interest rate (%)'}</FormLabel>
                  <FormControl><Input placeholder={isKo ? '연 이자율' : 'Annual rate'} {...field} onChange={handleNumericInputChange(field.onChange)} className="text-right" /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interestType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isKo ? '이자 계산 방식' : 'Interest calculation method'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isKo ? '이자 계산 방식을 선택하세요' : 'Select interest method'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="simple">{isKo ? '단리' : 'Simple'}</SelectItem>
                      <SelectItem value="compound">{isKo ? '월복리' : 'Monthly compound'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{isKo ? '과세 옵션' : 'Taxation option'}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isKo ? '과세 옵션을 선택하세요' : 'Select tax option'} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">{isKo ? '일반과세 (15.4%)' : 'General (15.4%)'}</SelectItem>
                      <SelectItem value="preferential">{isKo ? '세금우대 (9.5%)' : 'Preferential (9.5%)'}</SelectItem>
                      <SelectItem value="non-taxable">{isKo ? '비과세 (0%)' : 'Non-taxable (0%)'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-auto pt-4">
          <Button type="submit" className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
        </div>
      </form>
    </Form>
  );

  const RightColumn = (
    <div className="h-full flex flex-col">
      <CardContent className="flex-grow">
        {result ? (
          <div className="space-y-4">
            <div className="text-center py-4">
              <p className="text-muted-foreground">{isKo ? '만기 시 예상 수령액' : 'Expected maturity amount'}</p>
              <p className="text-4xl font-bold text-primary">{formatNumber(result.finalAmount)}{isKo ? '원' : ' KRW'}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center text-muted-foreground">
            {isKo ? '계산하기 버튼을 눌러주세요' : 'Please press Calculate'}
          </div>
        )}
      </CardContent>
    </div>
  );

  const fullWidthSection = result ? (
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>{isKo ? '총 납입 원금' : 'Total principal deposited'}</TableCell>
          <TableCell className="text-right">{formatNumber(result.principal)}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? '세전 이자' : 'Pre-tax interest'}</TableCell>
          <TableCell className="text-right">{formatNumber(result.preTaxInterest)}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>{isKo ? `이자과세 (${result.taxRate}%)` : `Interest tax (${result.taxRate}%)`}</TableCell>
          <TableCell className="text-right text-red-500">-{formatNumber(result.tax)}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
        <TableRow className="font-semibold">
          <TableCell>{isKo ? '세후 수령 이자' : 'After-tax interest received'}</TableCell>
          <TableCell className="text-right">{formatNumber(result.postTaxInterest)}{isKo ? '원' : ' KRW'}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ) : null;



  const infoSection = {
    calculatorDescription: (
      <>
        <h2 className="text-2xl font-bold text-foreground mb-4">{isKo ? '자유적금 계산기: 당신의 저축 스타일에 자유를 더하다' : 'Free Savings Calculator: Add Freedom to Your Saving Style'}</h2>
        <p className="text-lg text-muted-foreground mb-6">
          {isKo
            ? '매달 정해진 날짜, 정해진 금액을 넣어야 하는 정기적금의 빡빡함에 지치셨나요? 자유적금은 그 이름처럼, 당신이 원할 때, 원하는 만큼만 자유롭게 입금하며 목돈을 만들어나가는 혁신적이고 유연한 금융 상품입니다. 저축에 대한 스트레스는 줄이고, 성취감은 높여주는 스마트한 재테크 도구이죠.'
            : 'Tired of the rigid routine of regular savings, where you must deposit a fixed amount on a fixed date every month? As its name suggests, a free savings account is an innovative and flexible product that lets you build a lump sum by depositing freely, whenever you want and as much as you want. It is a smart money-management tool that reduces saving stress and boosts your sense of achievement.'}
        </p>
        <div className="mt-6 text-foreground leading-relaxed bg-muted p-6 rounded-lg border-l-4 border-primary">
          <h3 className="text-xl font-semibold text-foreground mb-3">{isKo ? '🎯 누구에게 가장 필요할까요?' : '🎯 Who needs it most?'}</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>{isKo ? '프리랜서, 자영업자:' : 'Freelancers, self-employed:'}</strong> {isKo ? '매달 수입이 일정하지 않아 고정적인 저축이 부담스러운 분' : 'Those whose monthly income is irregular and find fixed savings burdensome'}</li>
            <li><strong>{isKo ? '사회초년생, 학생:' : 'New grads, students:'}</strong> {isKo ? '아직 소득이 적지만, 소액이라도 꾸준히 저축하는 습관을 만들고 싶은 분' : 'Those with little income who still want to build a habit of saving steadily, even in small amounts'}</li>
            <li><strong>{isKo ? '직장인:' : 'Office workers:'}</strong> {isKo ? '월급 외에 비정기적인 보너스나 성과급을 받을 때, 그냥 두지 않고 바로 저축하고 싶은 분' : 'Those who, when receiving irregular bonuses or incentives beyond salary, want to save them immediately rather than leave them idle'}</li>
            <li><strong>{isKo ? 'N잡러, 긱 워커:' : 'Side-hustlers, gig workers:'}</strong> {isKo ? '여러 소득 파이프라인에서 들어오는 돈을 하나의 통장으로 효율적으로 관리하고 싶은 분' : 'Those who want to efficiently manage money from multiple income streams in one account'}</li>
          </ul>
        </div>
        <p className="mt-8 text-base leading-relaxed">
          {isKo
            ? '자유적금의 가장 큰 매력은 \'유연성\'입니다. 갑자기 목돈이 필요할 때 적금을 깨야 하는 부담이 적고, 반대로 여유 자금이 생겼을 때는 추가 납입을 통해 만기 이자를 더욱 높일 수 있습니다. 하지만 이러한 자유로움 때문에 이자 계산법은 정기적금보다 다소 복잡하게 느껴질 수 있습니다.'
            : "The biggest charm of free savings is its 'flexibility'. There is less pressure to break the account when you suddenly need a lump sum, and conversely, when you have spare funds, additional deposits can raise your maturity interest. But because of this freedom, the interest calculation can feel somewhat more complex than with regular savings."}
        </p>
        <p className="mt-4 text-base leading-relaxed">
          {isKo
            ? 'All-in-Calc의 자유적금 계산기는 당신의 자유로운 저축 스타일에 맞춰, 각기 다른 날짜와 금액으로 납입된 모든 돈이 만기일에 얼마가 되어 돌아올지, 세금은 얼마나 떼이는지 등을 한눈에 명확하게 보여줍니다. 더 이상 복잡한 엑셀 계산은 필요 없습니다. 당신의 저축 여정에 든든한 네비게이터가 되어드리겠습니다.'
            : "All-in-Calc's free savings calculator adapts to your flexible saving style, clearly showing at a glance how much all deposits made on different dates and amounts will become at maturity, and how much tax will be deducted. No more complicated Excel calculations. We will be a reliable navigator for your saving journey."}</p>        <TermGlossary items={[
          { term: isKo ? '자유적금' : 'Free savings', desc: isKo ? '정해진 날짜와 금액에 얽매이지 않고, 원할 때 원하는 만큼 자유롭게 입금하며 목돈을 만드는 적금 상품입니다.' : 'A savings product that lets you freely deposit as much as you want, whenever you want, without being tied to a fixed date or amount, to build a lump sum.' },
          { term: isKo ? '비과세요 종합저축' : 'Non-taxable comprehensive savings', desc: isKo ? '만 65세 이상·장애인 등 요건 충족 시 전 금융기관 통합 5,000만 원 한도 내 이자 소득이 면제되는 상품입니다.' : 'A product where, if you meet conditions such as being 65 or older or disabled, interest income is exempt up to a combined 50 million KRW limit across all institutions.' },
          { term: isKo ? '선납 효과' : 'Early-payment effect', desc: isKo ? '같은 금액이라도 적금 초반에 일찍 납입할수록 예치일수가 길어져 더 많은 이자를 받게 되는 효과입니다.' : 'The effect that, for the same amount, depositing earlier in the term yields more interest because the days on deposit are longer.' },
        ]} />

      </>
    ),
    calculationFormula: (
      <>
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '💰 자유적금 이자, 어떻게 계산될까요?' : '💰 How is free savings interest calculated?'}</h2>
        <p className="text-base leading-relaxed mb-6">
          {isKo
            ? '자유적금 이자 계산의 핵심 원리는 \'각각의 입금 건을 별개의 정기예금처럼 취급\'하는 것입니다. 즉, 모든 납입금에 동일한 이자가 붙는 것이 아니라, 돈을 \'일찍\', 그리고 \'많이\' 넣을수록 더 많은 이자를 받게 됩니다. 이자는 \'일(日) 단위\'로 계산되는 것이 가장 큰 특징입니다.'
            : "The core principle of free savings interest is to 'treat each deposit as a separate time deposit'. That is, the same interest is not applied to every deposit; the earlier and the more you deposit, the more interest you earn. The biggest feature is that interest is calculated on a daily basis."}
        </p>
        <div className="mt-4 p-6 bg-muted rounded-lg text-center shadow-inner">
          <p className="font-mono text-xl tracking-tighter"><strong>{isKo ? '총 이자 = (1번 납입금 × 연이율 × 예치일수/365) + (2번 납입금 × 연이율 × 예치일수/365) + ...' : 'Total interest = (1st deposit × Annual rate × Days/365) + (2nd deposit × Annual rate × Days/365) + ...'}</strong></p>
        </div>
        <div className="mt-8 p-6 border-l-4 border-primary bg-muted rounded-r-lg">
          <h4 className="font-bold text-lg mb-3">{isKo ? '💡 실제 계산 예시로 이해하기' : '💡 Understanding with a real example'}</h4>
          <p className="text-base">
            {isKo ? '- 약정 이율: 연 3.5% (단리)' : '- Agreed rate: 3.5% annual (simple)'}<br />
            {isKo ? '- 만기일: 2025년 12월 31일' : '- Maturity: Dec 31, 2025'}<br />
            {isKo ? '- 납입 내역:' : '- Deposits:'}
              <ul className="list-disc list-inside ml-4 mt-2">
                <li>{isKo ? '2025년 1월 1일: 100만원 납입 (예치일수: 364일)' : 'Jan 1, 2025: 1,000,000 deposited (364 days on deposit)'}</li>
                <li>{isKo ? '2025년 7월 1일: 50만원 납입 (예치일수: 183일)' : 'Jul 1, 2025: 500,000 deposited (183 days on deposit)'}</li>
              </ul>
          </p>
          <p className="mt-4 font-mono bg-card p-4 rounded-md text-sm">
            <strong>{isKo ? '1. 100만원에 대한 이자:' : '1. Interest on 1,000,000:'}</strong><br/>
            {isKo ? '1,000,000원 × 3.5% × (364일 / 365일) = 34,904원' : '1,000,000 × 3.5% × (364 days / 365 days) = 34,904 KRW'}<br/><br/>
            <strong>{isKo ? '2. 50만원에 대한 이자:' : '2. Interest on 500,000:'}</strong><br/>
            {isKo ? '500,000원 × 3.5% × (183일 / 365일) = 8,763원' : '500,000 × 3.5% × (183 days / 365 days) = 8,763 KRW'}<br/><br/>
            <strong>{isKo ? '3. 세전 총 이자:' : '3. Total pre-tax interest:'}</strong><br/>
            {isKo ? '34,904원 + 8,763원 = ' : '34,904 + 8,763 = '}<strong>{isKo ? '43,667원' : '43,667 KRW'}</strong>
          </p>
        </div>
        <h3 className="text-xl font-bold text-foreground mt-10 mb-4">{isKo ? '단리 vs 월복리, 무엇이 더 유리할까?' : 'Simple vs Monthly Compound: Which is better?'}</h3>
        <p className="text-base leading-relaxed mb-4">
          {isKo
            ? '적금 상품을 선택할 때 반드시 고려해야 할 요소입니다. 본 계산기는 두 가지 방식을 모두 지원하여 최적의 선택을 돕습니다.'
            : 'This is a factor you must consider when choosing a savings product. This calculator supports both methods to help you choose optimally.'}
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg">{isKo ? '단리(Simple Interest)' : 'Simple Interest'}</h4>
            <p className="mt-2 text-sm">{isKo ? '오직 \'원금\'에 대해서만 약속된 이율로 이자를 계산하는 가장 단순한 방식입니다. 계산이 직관적이고 이해하기 쉽습니다. 대부분의 은행 적금 상품이 단리 방식을 채택하고 있습니다.' : 'The simplest method, where interest is calculated at the agreed rate only on the principal. It is intuitive and easy to understand. Most bank savings products use simple interest.'}</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-lg">{isKo ? '월복리(Monthly Compound Interest)' : 'Monthly Compound Interest'}</h4>
            <p className="mt-2 text-sm">{isKo ? '\'원금 + 이자\'에 다시 이자가 붙는 마법 같은 방식입니다. 매월 발생한 이자를 원금에 더한 후, 그 합산된 금액에 다시 이자가 붙습니다. 예치 기간이 길어질수록 단리와의 격차가 기하급수적으로 벌어져 장기 목돈 마련에 매우 유리합니다. (본 계산기에서는 월복리를 근사치로 계산하여 제공합니다.)' : "A magical method where interest accrues again on 'principal + interest'. Each month's interest is added to the principal, and interest is then charged on that sum. The longer the term, the exponentially larger the gap from simple interest, which is very advantageous for long-term lump-sum goals. (This calculator provides monthly compound as an approximation.)"}</p>
          </div>
        </div>
      </>
    ),
    usefulTips: (
      <>
        <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{isKo ? '🚀 자유적금 200% 활용 꿀팁: 단순 저축을 넘어 재테크로!' : '🚀 Tips to Get 200% from Free Savings: Beyond Simple Saving!'}</h2>
        <div className="space-y-8">
          <div className="p-4 rounded-md bg-muted">
            <h4 className="font-bold text-lg text-primary">{isKo ? '1. \'초반\'에 \'자주\', \'많이\' 납입하세요 (선납 효과)' : '1. Deposit "early", "often", and "a lot" (early-payment effect)'}</h4>
            <p className="mt-2 text-base">
              {isKo
                ? '자유적금 이자는 \'예치일수\'가 생명입니다. 같은 금액이라도 적금 초반에 넣는 것이 만기일에 가깝게 넣는 것보다 훨씬 더 많은 이자를 받을 수 있습니다. 여유 자금이 생기면 하루라도 미루지 말고 바로바로 입금하는 습관이 이자 수익의 차이를 만듭니다. 특히, 가입 초기에 목돈을 예치하면 사실상 정기예금과 같은 효과를 누릴 수 있습니다. (이를 \'선납\' 효과라고 합니다.)'
                : "With free savings, the 'days on deposit' are everything. For the same amount, depositing early in the term earns far more interest than depositing close to maturity. When you have spare funds, depositing promptly rather than delaying makes the difference in interest income. In particular, depositing a lump sum early gives you virtually the same effect as a time deposit. (This is called the 'early-payment' effect.)"}
            </p>
          </div>
          <div className="p-4 rounded-md bg-muted">
            <h4 className="font-bold text-lg text-primary">{isKo ? '2. 정기적금 vs 자유적금, 금리 비교는 필수!' : '2. Compare rates: regular vs free savings!'}</h4>
            <p className="mt-2 text-base">
              {isKo
                ? '일반적으로 자유적금은 정기적금보다 기본 금리가 0.1%p ~ 0.5%p 가량 낮은 경향이 있습니다. 은행 입장에서는 자금 운용의 예측 가능성이 떨어지기 때문입니다. 따라서, 매달 고정적인 저축이 가능하다면 정기적금이 더 유리할 수 있습니다. 하지만, 우대금리 조건을 꼼꼼히 따져보면 자유적금이 더 높은 금리를 제공하는 경우도 있으니, 반드시 두 상품의 최종 적용 금리를 비교하는 것이 현명합니다.'
                : 'Generally, free savings tends to have a base rate about 0.1–0.5 percentage points lower than regular savings, because from the bank\'s perspective the predictability of fund management is lower. So if you can save a fixed amount every month, regular savings may be more advantageous. But if you examine preferential rate conditions closely, free savings sometimes offers a higher rate, so it is wise to always compare the final applied rates of the two products.'}
            </p>
          </div>
          <div className="p-4 rounded-md bg-muted">
            <h4 className="font-bold text-lg text-primary">{isKo ? '3. \'자동이체\'로 자유적금의 단점을 보완하세요.' : '3. Compensate for free savings\' weakness with auto-transfer.'}</h4>
            <p className="mt-2 text-base">
              {isKo
                ? '자유롭다는 장점은 \'저축을 미루게 되는\' 단점으로 이어질 수 있습니다. 이를 방지하기 위해 최소한의 금액이라도 매월 특정일에 자동이체를 설정해두세요. 그리고 추가적인 수입이 생길 때마다 \'수시 납입\'을 하는 방식으로 운영하면, 꾸준한 저축 습관과 유연한 자금 운용이라는 두 마리 토끼를 모두 잡을 수 있습니다.'
                : "The advantage of freedom can lead to the drawback of 'postponing saving'. To prevent this, set up an auto-transfer of at least a minimum amount on a certain day each month. Then operate with 'ad-hoc deposits' whenever extra income arrives, and you can catch both rabbits: a steady saving habit and flexible fund management."}
            </p>
          </div>
          <div className="p-4 rounded-md bg-muted">
            <h4 className="font-bold text-lg text-primary">{isKo ? '4. 비과세 및 세금우대 혜택, 놓치면 손해! (2025년 기준)' : '4. Don\'t miss non-taxable and preferential tax benefits! (as of 2025)'}</h4>
            <p className="mt-2 text-base">
              {isKo
                ? '이자소득에 대한 세금(일반과세 15.4%)은 생각보다 큽니다. 2025년 현재, 만 65세 이상 거주자, 장애인, 독립유공자 등은 비과세 종합저축 한도(최대 5천만원) 내에서 세금 없이 이자를 모두 받을 수 있습니다. 또한, ISA(개인종합자산관리계좌)를 통해 가입하면 별도의 비과세 혜택을 누릴 수 있습니다. 가입 요건이 된다면 이러한 절세 상품을 최우선으로 고려하여 만기 수령액을 극대화하세요.'
                : 'The tax on interest income (15.4% general) is larger than you might think. As of 2025, residents aged 65 or older, persons with disabilities, and independence activists can receive all interest tax-free within the non-taxable comprehensive savings limit (up to 50 million KRW). Also, subscribing via an ISA (Individual Comprehensive Asset Management Account) grants separate non-taxable benefits. If you qualify, prioritize these tax-saving products to maximize your maturity amount.'}
            </p>
          </div>
          <div className="p-4 rounded-md bg-muted">
            <h4 className="font-bold text-lg text-primary">{isKo ? '5. 목표 달성을 위한 \'통장 쪼개기\'에 활용하세요.' : '5. Use "account splitting" to achieve your goals.'}</h4>
            <p className="mt-2 text-base">
              {isKo
                ? '자유적금은 단기/중기 재무 목표를 달성하기 위한 훌륭한 도구입니다. \'1년 뒤 해외여행 자금\', \'2년 뒤 자동차 계약금\', \'3년 뒤 전세 보증금\' 등 각 목표별로 자유적금 통장을 만들어보세요. 각 통장에 목표 이름을 붙여두면 저축에 대한 동기부여가 훨씬 강해지고, 목표 달성 현황을 직관적으로 파악할 수 있습니다.'
                : "Free savings is a great tool for achieving short- and mid-term financial goals. Create a separate free savings account for each goal, such as 'overseas trip funds in 1 year', 'car down payment in 2 years', or 'jeonse deposit in 3 years'. Naming each account after its goal greatly strengthens saving motivation and lets you intuitively track progress."}
            </p>
          </div>
        </div>
      </>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? "자유적금 계산기" : "Free Savings Calculator"}
      description={isKo ? "자유로운 납입 계획에 따른 만기 수령액을 계산해보세요." : "Calculate the maturity amount based on your flexible deposit plan."}
      inputSection={LeftColumn}
      resultSection={RightColumn}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? "상세 내역" : "Details"}
      infoSection={infoSection}
    />
  )
}

export default FreeInstallmentSavingsPage
