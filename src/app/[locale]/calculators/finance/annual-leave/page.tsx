'use client';

import { useState, useMemo } from 'react';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';

export default function AnnualLeaveCalculator() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(5);
  const [annualLeaveDays, setAnnualLeaveDays] = useState<number>(0);

  const calculateAnnualLeave = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // 1년 미만 근속 시 1개월 개근 시 1일 발생
    if (diffDays < 365) {
      const diffMonths = Math.floor(diffDays / 30);
      return diffMonths;
    }

    // 1년 이상 근속 시
    const years = Math.floor(diffDays / 365);
    let leave = 15; // 1년 이상 2년 미만 15일

    if (years >= 3) {
      leave += Math.floor((years - 2) / 2) * 1; // 3년차부터 2년마다 1일 가산
    }
    return leave;
  }, [startDate, endDate, workDaysPerWeek]);

  const handleCalculate = () => {
    setAnnualLeaveDays(calculateAnnualLeave);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setWorkDaysPerWeek(5);
    setAnnualLeaveDays(0);
  };

  const inputSectionContent = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{isKo ? '연차 정보 입력' : 'Enter Leave Info'}</h2>
      <div className="space-y-2">
        <Label htmlFor="startDate">{isKo ? '입사일' : 'Join Date'}</Label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder={isKo ? '입사일 선택' : 'Select join date'} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">{isKo ? '퇴사일 (또는 현재일)' : 'Leave Date (or Today)'}</Label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder={isKo ? '퇴사일 선택' : 'Select leave date'} />
      </div>
      <div>
        <Label>{isKo ? '주당 근무일수' : 'Work Days per Week'}</Label>
        <RadioGroup
          value={String(workDaysPerWeek)}
          onValueChange={(value: string) => setWorkDaysPerWeek(parseFloat(value))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="work5" />
            <Label htmlFor="work5">{isKo ? '5일' : '5 days'}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6" id="work6" />
            <Label htmlFor="work6">{isKo ? '6일' : '6 days'}</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">{isKo ? '계산하기' : 'Calculate'}</Button>
      <Button onClick={handleReset} className="w-full" variant="outline">{isKo ? '초기화' : 'Reset'}</Button>
    </div>
  );

  const resultSectionContent = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{isKo ? '계산 결과' : 'Result'}</h2>
      <div className="bg-muted p-4 rounded-md space-y-2">
        <p><strong>{isKo ? '총 발생 연차:' : 'Total Leave Accrued:'}</strong> {annualLeaveDays}{isKo ? ' 일' : ' days'}</p>
      </div>
    </div>
  );

  return (
    <CalculatorsLayout
      title={isKo ? '연차 계산기' : 'Annual Leave Calculator'}
      variant="split"
      inputSection={inputSectionContent}
      resultSection={resultSectionContent}
      infoSection={{
        calculatorDescription: (
          <>
            <h2 className="text-2xl font-bold mb-4">{isKo ? '연차 계산기: 당신의 소중한 휴가, 정확히 알고 계신가요?' : 'Annual Leave Calculator: Do You Know Your Precious Vacation Accurately?'}</h2>
            <p className="text-foreground">
              {isKo ? '"워라밸"이 중요한 가치가 된 시대, ' : 'In an era where "work-life balance" is a key value, '}<strong>{isKo ? '연차 유급휴가' : 'paid annual leave'}</strong>{isKo ? '는 단순한 쉼을 넘어 재충전과 자기 계발의 기회를 제공하는 핵심적인 근로 조건입니다. 대한민국 근로기준법은 근로자의 휴식권을 보장하기 위해 연차 제도를 명시하고 있으며, 모든 근로자는 법적으로 보장된 자신의 휴가 권리를 정확히 알고 적극적으로 활용해야 합니다. 하지만 근속 연수, 입사 시점, 회사의 정책에 따라 복잡하게 느껴지는 연차 계산, 더 이상 헷갈려 하지 마세요.' : ' is a core labor condition that goes beyond simple rest, offering a chance to recharge and grow. Korea’s Labor Standards Act stipulates the annual leave system to protect workers’ right to rest, and every worker must know and actively use their legally guaranteed leave rights. But don’t be confused by annual leave calculation that feels complex depending on tenure, join date, and company policy.'}
            </p>
            <p className="mt-4 text-foreground">
              {isKo ? 'All-in-Calc의 연차 계산기는 복잡한 법규를 바탕으로 설계되어, 당신의 입사일과 기준일(보통 퇴사일 또는 현재)만 입력하면 몇 번의 클릭만으로 정확한 발생 연차를 알려드립니다. 1년 미만 신규 입사자부터 장기 근속자까지, 자신의 상황에 맞는 연차 일수를 간편하게 확인하고, 계획적인 휴가 설계를 통해 일과 삶의 균형을 찾아보세요. 이 계산기는 당신의 소중한 권리를 지키는 든든한 조력자가 될 것입니다.' : "All-in-Calc's annual leave calculator is built on complex regulations; just enter your join date and reference date (usually leave date or today) and it tells you the exact accrued leave in a few clicks. From new joiners under 1 year to long-tenured workers, easily check your leave days and find work-life balance through planned vacations. This calculator will be a reliable ally protecting your precious rights."}
            </p>            <TermGlossary items={[
              { term: isKo ? '연차 유급휴가' : 'Paid Annual Leave', desc: isKo ? '1년간 80% 이상 출근한 근로자에게 법적으로 부여되는 유급 휴가로, 15일(장기 근속 시 가산)이 기본입니다.' : 'A legally granted paid leave for workers who attended 80%+ of days in a year; the base is 15 days (with additions for long tenure).' },
              { term: isKo ? '통상임금' : 'Ordinary Wage', desc: isKo ? '근로자에게 정기적·일률적·고정적으로 지급하기로 한 임금으로, 연차수당 등 각종 수당 산정의 기준이 됩니다.' : 'Wages agreed to be paid to a worker regularly, uniformly, and fixedly; the basis for calculating various allowances including leave pay.' },
              { term: isKo ? '미사용 연차수당' : 'Unused Leave Allowance', desc: isKo ? '기한 내에 사용하지 못한 연차에 대해 현금으로 보상받을 수 있는 청구권입니다.' : 'A claim to be compensated in cash for leave not used within the deadline.' },
            ]} />

          </>
        ),
        calculationFormula: (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-4">{isKo ? '📜 근로기준법 제60조, 연차 유급휴가의 모든 것' : '📜 Labor Standards Act Art. 60: All About Paid Annual Leave'}</h3>
            <p className="mb-4">
              {isKo ? '연차는 근로자의 근속 기간과 출근율을 기준으로 발생하며, 크게 세 가지 경우로 나뉩니다. 각 기준을 명확히 이해하는 것이 정확한 연차 계산의 첫걸음입니다.' : 'Leave accrues based on a worker’s tenure and attendance rate, and is broadly divided into three cases. Clearly understanding each standard is the first step to accurate leave calculation.'}
            </p>
            <div className="space-y-6">
              <div className="p-4 border-l-4 border-primary bg-muted">
                <h4 className="font-semibold text-lg mb-2">{isKo ? '1. 계속근로기간 1년 미만 또는 1년간 80% 미만 출근 근로자' : '1. Workers with under 1 year of continuous service or under 80% attendance in a year'}</h4>
                <p className="mb-2">
                  {isKo ? '갓 입사한 신규 사원이나, 개인 사정으로 1년간 출근율 80%를 채우지 못한 근로자에게 적용되는 기준입니다.' : 'The standard applied to new hires or workers who, for personal reasons, fail to reach 80% attendance in a year.'}
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>{isKo ? '1개월 개근 시 → 1일의 유급휴가 발생' : '1 month perfect attendance → 1 day paid leave'}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {isKo ? '예를 들어, 2024년 1월 1일에 입사했다면, 1월 한 달을 개근했을 경우 2월 1일에 1일의 연차가 발생합니다. 이런 방식으로 1년(12개월) 동안 최대 ' : 'For example, if you joined on Jan 1, 2024 and had perfect attendance in January, 1 day of leave accrues on Feb 1. This way you can receive up to '}<strong>{isKo ? '11일' : '11 days'}</strong>{isKo ? '의 연차를 받을 수 있습니다. 이 휴가는 발생일로부터 1년간 사용 가능합니다.' : ' of leave over a year (12 months). This leave is usable for 1 year from its accrual date.'}
                </p>
              </div>

              <div className="p-4 border-l-4 border-primary bg-muted">
                <h4 className="font-semibold text-lg mb-2">{isKo ? '2. 계속근로기간 1년 이상, 80% 이상 출근 근로자' : '2. Workers with 1+ years continuous service and 80%+ attendance'}</h4>
                <p className="mb-2">
                  {isKo ? '가장 일반적인 연차 발생 기준으로, 1년 동안 성실히 근무한 근로자에게 주어지는 보상입니다.' : 'The most common accrual standard—a reward given to workers who served diligently for one year.'}
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>{isKo ? '1년간 80% 이상 출근 시 → 15일의 유급휴가 발생' : '80%+ attendance in a year → 15 days paid leave'}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  {isKo ? '2024년 1월 1일에 입사하여 2024년 12월 31일까지 80% 이상 출근했다면, 2025년 1월 1일에 15일의 연차가 발생합니다. 이는 1년 미만일 때 발생한 11일의 휴가와는 별개로 주어지는 것입니다.' : 'If you joined Jan 1, 2024 and attended 80%+ through Dec 31, 2024, 15 days accrue on Jan 1, 2025. This is given separately from the 11 days accrued under 1 year.'}
                </p>
              </div>

              <div className="p-4 border-l-4 border-primary bg-muted">
                <h4 className="font-semibold text-lg mb-2">{isKo ? '3. 3년 이상 장기 근속자 (가산 휴가)' : '3. Long-tenured workers 3+ years (additional leave)'}</h4>
                <p className="mb-2">
                  {isKo ? '회사의 성장에 기여한 장기 근속자에게는 추가적인 휴가가 부여됩니다.' : 'Additional leave is granted to long-tenured workers who contributed to company growth.'}
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>{isKo ? '최초 1년을 제외하고, 매 2년마다 1일 가산 (최대 25일 한도)' : 'Except the first year, +1 day every 2 years (max 25 days)'}</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                  <li>{isKo ? <><strong>3년차:</strong> 기본 15일 + 가산 1일 = 16일</> : <><strong>Year 3:</strong> base 15 + 1 add-on = 16 days</>}</li>
                  <li>{isKo ? <><strong>5년차:</strong> 기본 15일 + 가산 2일 = 17일</> : <><strong>Year 5:</strong> base 15 + 2 add-ons = 17 days</>}</li>
                  <li>{isKo ? <><strong>21년차 이상:</strong> 기본 15일 + 가산 10일 = 최대 25일</> : <><strong>Year 21+:</strong> base 15 + 10 add-ons = max 25 days</>}</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">{isKo ? '💰 잠자는 권리, 미사용 연차수당 제대로 받기' : '💰 Sleeping Right: Properly Receive Unused Leave Allowance'}</h3>
            <p className="mb-4">
              {isKo ? '바쁜 업무로 인해 발생한 연차를 1년 안에 모두 사용하지 못했다면? 휴가는 소멸되지만, 대신 현금으로 보상받을 수 있는 ' : 'If you can’t use all accrued leave within a year due to busy work? The leave lapses, but instead a '}<strong>{isKo ? "'미사용 연차수당 청구권'" : "'unused leave allowance claim'" }</strong>{isKo ? '이 생깁니다.' : ' arises.'}
            </p>
            <div className="mt-4 p-6 bg-muted rounded-lg text-center shadow-inner">
              <p className="font-mono text-xl tracking-wider"><strong>{isKo ? '1일 통상임금 × 잔여 연차일수' : '1 Day Ordinary Wage × Remaining Leave Days'}</strong></p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {isKo ? "여기서 핵심은 '통상임금'입니다. " : "The key here is the 'ordinary wage.' "}<strong>{isKo ? '통상임금' : 'Ordinary wage'}</strong>{isKo ? '이란, 근로자에게 정기적이고 일률적으로 소정 근로의 대가로 지급하기로 정한 금액을 말합니다. 기본급은 물론, 매월 고정적으로 지급되는 직무수당, 직책수당, 면허수당, 기술수당 등이 포함될 수 있습니다. 다만, 성과에 따라 변동되는 상여금이나 실비 변상적인 복리후생비(교통비, 식대 등)는 포함되지 않는 경우가 많으니, 회사의 취업규칙이나 근로계약서를 꼼꼼히 확인해야 합니다.' : ' means the amount agreed to be paid to a worker regularly and uniformly as compensation for scheduled work. It includes base pay as well as monthly fixed duty, position, license, and skill allowances. However, performance-based bonuses or reimbursable welfare benefits (transport, meals, etc.) are often excluded, so check the company rules and labor contract carefully.'}
            </p>
          </>
        ),
        usefulTips: (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-4">{isKo ? '💡 현명한 직장인을 위한 연차 활용 꿀팁 5가지' : '💡 5 Smart Tips to Use Annual Leave'}</h3>
            <ul className="space-y-6">
              <li className="p-4 rounded-md bg-muted shadow">
                <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? "1. '연차 사용 촉진 제도', 함정이 될 수 있어요!" : "1. The 'Leave Use Encouragement System' can be a trap!"}</h4>
                <p>
                  {isKo ? "회사가 법적 절차(서면 촉구 등)에 따라 연차 사용을 독려했음에도 근로자가 사용하지 않으면, 회사는 미사용 연차수당 지급 의무를 면제받습니다. 이를 '연차 사용 촉진 제도'라고 합니다. 회사가 연차 사용 계획을 제출하라고 요청한다면, 이는 단순한 요청이 아닐 수 있습니다. 연차 소진 계획을 미리 세워두고, 회사의 촉진 절차에 적극적으로 대응하여 소중한 휴가와 수당을 모두 지키세요." : "If the company encouraged leave use through legal procedures (written notice, etc.) but the worker didn't use it, the company is exempt from paying the unused-leave allowance. This is the 'leave use encouragement system.' If the company asks you to submit a leave plan, it may not be a simple request. Set a leave-exhaustion plan early and actively respond to the company's encouragement to protect both your precious vacation and allowance."}
                </p>
              </li>
              <li className="p-4 rounded-md bg-muted shadow">
                <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '2. 연차수당 청구권, 3년 안에 행사해야 해요.' : '2. Exercise the leave-allowance claim within 3 years.'}</h4>
                <p>
                  {isKo ? '미사용 연차수당은 임금채권으로, 권리가 발생한 날로부터 ' : 'The unused leave allowance is a wage claim; if not claimed within '}<strong>{isKo ? '3년' : '3 years'}</strong>{isKo ? ' 이내에 청구하지 않으면 소멸시효가 완성되어 받을 수 없습니다. 특히 퇴사 시 정산받지 못한 연차수당이 있다면, 퇴사일로부터 3년이 지나기 전에 반드시 회사에 지급을 요청하거나 법적 조치를 취해야 합니다.' : ' from the date the right arose, it is time-barred and cannot be received. Especially if you have un-settled leave allowance at resignation, you must request payment or take legal action before 3 years from the leave date.'}
                </p>
              </li>
              <li className="p-4 rounded-md bg-muted shadow">
                <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? "3. 퇴사 시 남은 연차, '수당'으로 두둑하게 챙기세요." : "3. At resignation, claim remaining leave as 'allowance.'"}</h4>
                <p>
                  {isKo ? "계약기간 만료나 정년퇴직 등 정상적인 근로관계 종료 시, 사용하지 못한 연차는 모두 수당으로 전환하여 받을 수 있습니다. 마지막 근무일 기준의 '1일 통상임금'으로 계산되며, 퇴직금과 별도로 퇴직일로부터 14일 이내에 지급받는 것이 원칙입니다. 퇴직 전 무리하게 연차를 소진하기보다, 수당으로 받는 것이 유리할 수도 있습니다." : "When the employment relationship ends normally (contract expiry, retirement, etc.), all unused leave can be converted to allowance. It is calculated at the '1-day ordinary wage' as of the last work day and, separately from severance, should be paid within 14 days of leaving. Receiving it as allowance may be more advantageous than forced exhaustion before retirement."}
                </p>
              </li>
              <li className="p-4 rounded-md bg-muted shadow">
                <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? '4. 입사일 기준 vs 회계연도 기준, 내게 유리한 것은?' : '4. Join-date basis vs fiscal-year basis: which is better for you?'}</h4>
                <p>
                  {isKo ? "연차 계산은 근로자 개인의 '입사일'을 기준으로 하는 것이 원칙입니다. 하지만 대부분의 회사는 관리 편의를 위해 전 직원에게 '회계연도(매년 1월 1일)'를 일괄 적용합니다. 회계연도 기준은 중도 입사/퇴사 시 계산이 복잡하고, 근로자에게 불리한 경우가 발생할 수 있습니다. 퇴사 시점에는 반드시 입사일 기준으로 재정산하여, 회계연도 기준으로 계산했을 때보다 불리한 부분(부족하게 받은 연차)이 없는지 확인하고 추가 수당 지급을 요청해야 합니다." : "In principle, leave is calculated on each worker’s own 'join date.' But most companies apply the 'fiscal year (Jan 1 every year)' to all staff for convenience. The fiscal-year basis complicates mid-term join/leave calculation and can disadvantage workers. At resignation, always re-settle on the join-date basis and check that you are not shortchanged versus the fiscal-year basis, then request any additional allowance."}
                </p>
              </li>
              <li className="p-4 rounded-md bg-muted shadow">
                <h4 className="font-semibold text-lg mb-2 text-primary">{isKo ? "5. 5인 미만 사업장, '약정 휴가'를 협의하세요." : "5. At workplaces under 5 employees, negotiate 'contracted leave.'"}</h4>
                <p>
                  {isKo ? '근로기준법상 연차 유급휴가, 연차수당, 연차 사용 촉진 제도는 상시 근로자 ' : 'Under the Labor Standards Act, paid annual leave, leave allowance, and the leave-use encouragement system are mandatory only for workplaces with '}<strong>{isKo ? '5인 이상 사업장' : '5 or more regular workers'}</strong>{isKo ? "에만 의무 적용됩니다. 5인 미만 사업장이라면 법적 연차는 발생하지 않습니다. 하지만 근로계약서나 취업규칙을 통해 '약정 휴가'를 정할 수 있습니다. 입사 시 연차에 준하는 유급휴가를 별도로 합의하여 근로계약서에 명시하는 것이 중요합니다." : '. Workplaces under 5 have no statutory leave. But you can set a "contracted leave" via the labor contract or work rules. It is important to separately agree on paid leave comparable to annual leave at joining and state it in the contract.'}
                </p>
              </li>
            </ul>
          </>
        ),
      }}
    />
  );
};

// export default AnnualLeaveCalculator; // 이 줄을 제거합니다.