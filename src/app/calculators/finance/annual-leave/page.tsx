'use client';

import { useState, useMemo } from 'react';
import { formatNumber, parseNumber } from '@/utils/formatNumber';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';

export default function AnnualLeaveCalculator() {
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
      <h2 className="text-2xl font-bold">연차 정보 입력</h2>
      <div className="space-y-2">
        <Label htmlFor="startDate">입사일</Label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder="입사일 선택" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endDate">퇴사일 (또는 현재일)</Label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder="퇴사일 선택" />
      </div>
      <div>
        <Label>주당 근무일수</Label>
        <RadioGroup
          value={String(workDaysPerWeek)}
          onValueChange={(value: string) => setWorkDaysPerWeek(parseFloat(value))}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="work5" />
            <Label htmlFor="work5">5일</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6" id="work6" />
            <Label htmlFor="work6">6일</Label>
          </div>
        </RadioGroup>
      </div>
      <Button onClick={handleCalculate} className="w-full">계산하기</Button>
      <Button onClick={handleReset} className="w-full" variant="outline">초기화</Button>
    </div>
  );

  const resultSectionContent = (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">계산 결과</h2>
      <div className="bg-gray-100 p-4 rounded-md space-y-2">
        <p><strong>총 발생 연차:</strong> {annualLeaveDays} 일</p>
      </div>
    </div>
  );

  return (
    <CalculatorsLayout
      title="연차 계산기"
      inputSection={inputSectionContent}
      resultSection={resultSectionContent}
      infoSection={{
        calculatorDescription: (
          <>
            <h2 className="text-2xl font-bold mb-4">연차 계산기: 당신의 소중한 휴가, 정확히 알고 계신가요?</h2>
            <p className="text-gray-700 dark:text-gray-300">
              "워라밸"이 중요한 가치가 된 시대, <strong>연차 유급휴가</strong>는 단순한 쉼을 넘어 재충전과 자기 계발의 기회를 제공하는 핵심적인 근로 조건입니다. 대한민국 근로기준법은 근로자의 휴식권을 보장하기 위해 연차 제도를 명시하고 있으며, 모든 근로자는 법적으로 보장된 자신의 휴가 권리를 정확히 알고 적극적으로 활용해야 합니다. 하지만 근속 연수, 입사 시점, 회사의 정책에 따라 복잡하게 느껴지는 연차 계산, 더 이상 헷갈려 하지 마세요.
            </p>
            <p className="mt-4 text-gray-700 dark:text-gray-300">
              All-in-Calc의 연차 계산기는 복잡한 법규를 바탕으로 설계되어, 당신의 입사일과 기준일(보통 퇴사일 또는 현재)만 입력하면 몇 번의 클릭만으로 정확한 발생 연차를 알려드립니다. 1년 미만 신규 입사자부터 장기 근속자까지, 자신의 상황에 맞는 연차 일수를 간편하게 확인하고, 계획적인 휴가 설계를 통해 일과 삶의 균형을 찾아보세요. 이 계산기는 당신의 소중한 권리를 지키는 든든한 조력자가 될 것입니다.
            </p>
          </>
        ),
        calculationFormula: (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-4">📜 근로기준법 제60조, 연차 유급휴가의 모든 것</h3>
            <p className="mb-4">
              연차는 근로자의 근속 기간과 출근율을 기준으로 발생하며, 크게 세 가지 경우로 나뉩니다. 각 기준을 명확히 이해하는 것이 정확한 연차 계산의 첫걸음입니다.
            </p>
            <div className="space-y-6">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-gray-800">
                <h4 className="font-semibold text-lg mb-2">1. 계속근로기간 1년 미만 또는 1년간 80% 미만 출근 근로자</h4>
                <p className="mb-2">
                  갓 입사한 신규 사원이나, 개인 사정으로 1년간 출근율 80%를 채우지 못한 근로자에게 적용되는 기준입니다.
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>1개월 개근 시 → 1일의 유급휴가 발생</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  예를 들어, 2024년 1월 1일에 입사했다면, 1월 한 달을 개근했을 경우 2월 1일에 1일의 연차가 발생합니다. 이런 방식으로 1년(12개월) 동안 최대 <strong>11일</strong>의 연차를 받을 수 있습니다. 이 휴가는 발생일로부터 1년간 사용 가능합니다.
                </p>
              </div>

              <div className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-gray-800">
                <h4 className="font-semibold text-lg mb-2">2. 계속근로기간 1년 이상, 80% 이상 출근 근로자</h4>
                <p className="mb-2">
                  가장 일반적인 연차 발생 기준으로, 1년 동안 성실히 근무한 근로자에게 주어지는 보상입니다.
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>1년간 80% 이상 출근 시 → 15일의 유급휴가 발생</strong>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  2024년 1월 1일에 입사하여 2024년 12월 31일까지 80% 이상 출근했다면, 2025년 1월 1일에 15일의 연차가 발생합니다. 이는 1년 미만일 때 발생한 11일의 휴가와는 별개로 주어지는 것입니다.
                </p>
              </div>

              <div className="p-4 border-l-4 border-purple-500 bg-purple-50 dark:bg-gray-800">
                <h4 className="font-semibold text-lg mb-2">3. 3년 이상 장기 근속자 (가산 휴가)</h4>
                <p className="mb-2">
                  회사의 성장에 기여한 장기 근속자에게는 추가적인 휴가가 부여됩니다.
                </p>
                <p className="font-mono p-3 bg-muted rounded-md my-2 text-center">
                  <strong>최초 1년을 제외하고, 매 2년마다 1일 가산 (최대 25일 한도)</strong>
                </p>
                <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1 mt-2">
                  <li><strong>3년차:</strong> 기본 15일 + 가산 1일 = 16일</li>
                  <li><strong>5년차:</strong> 기본 15일 + 가산 2일 = 17일</li>
                  <li><strong>21년차 이상:</strong> 기본 15일 + 가산 10일 = 최대 25일</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold mt-8 mb-4">💰 잠자는 권리, 미사용 연차수당 제대로 받기</h3>
            <p className="mb-4">
              바쁜 업무로 인해 발생한 연차를 1년 안에 모두 사용하지 못했다면? 휴가는 소멸되지만, 대신 현금으로 보상받을 수 있는 <strong>'미사용 연차수당 청구권'</strong>이 생깁니다.
            </p>
            <div className="mt-4 p-6 bg-gray-100 dark:bg-gray-800 rounded-lg text-center shadow-inner">
              <p className="font-mono text-xl tracking-wider"><strong>1일 통상임금 × 잔여 연차일수</strong></p>
            </div>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              여기서 핵심은 '통상임금'입니다. <strong>통상임금</strong>이란, 근로자에게 정기적이고 일률적으로 소정 근로의 대가로 지급하기로 정한 금액을 말합니다. 기본급은 물론, 매월 고정적으로 지급되는 직무수당, 직책수당, 면허수당, 기술수당 등이 포함될 수 있습니다. 다만, 성과에 따라 변동되는 상여금이나 실비 변상적인 복리후생비(교통비, 식대 등)는 포함되지 않는 경우가 많으니, 회사의 취업규칙이나 근로계약서를 꼼꼼히 확인해야 합니다.
            </p>
          </>
        ),
        usefulTips: (
          <>
            <h3 className="text-xl font-semibold mt-6 mb-4">💡 현명한 직장인을 위한 연차 활용 꿀팁 5가지</h3>
            <ul className="space-y-6">
              <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
                <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">1. '연차 사용 촉진 제도', 함정이 될 수 있어요!</h4>
                <p>
                  회사가 법적 절차(서면 촉구 등)에 따라 연차 사용을 독려했음에도 근로자가 사용하지 않으면, 회사는 미사용 연차수당 지급 의무를 면제받습니다. 이를 '연차 사용 촉진 제도'라고 합니다. 회사가 연차 사용 계획을 제출하라고 요청한다면, 이는 단순한 요청이 아닐 수 있습니다. 연차 소진 계획을 미리 세워두고, 회사의 촉진 절차에 적극적으로 대응하여 소중한 휴가와 수당을 모두 지키세요.
                </p>
              </li>
              <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
                <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">2. 연차수당 청구권, 3년 안에 행사해야 해요.</h4>
                <p>
                  미사용 연차수당은 임금채권으로, 권리가 발생한 날로부터 <strong>3년</strong> 이내에 청구하지 않으면 소멸시효가 완성되어 받을 수 없습니다. 특히 퇴사 시 정산받지 못한 연차수당이 있다면, 퇴사일로부터 3년이 지나기 전에 반드시 회사에 지급을 요청하거나 법적 조치를 취해야 합니다.
                </p>
              </li>
              <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
                <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">3. 퇴사 시 남은 연차, '수당'으로 두둑하게 챙기세요.</h4>
                <p>
                  계약기간 만료나 정년퇴직 등 정상적인 근로관계 종료 시, 사용하지 못한 연차는 모두 수당으로 전환하여 받을 수 있습니다. 마지막 근무일 기준의 '1일 통상임금'으로 계산되며, 퇴직금과 별도로 퇴직일로부터 14일 이내에 지급받는 것이 원칙입니다. 퇴직 전 무리하게 연차를 소진하기보다, 수당으로 받는 것이 유리할 수도 있습니다.
                </p>
              </li>
              <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
                <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">4. 입사일 기준 vs 회계연도 기준, 내게 유리한 것은?</h4>
                <p>
                  연차 계산은 근로자 개인의 '입사일'을 기준으로 하는 것이 원칙입니다. 하지만 대부분의 회사는 관리 편의를 위해 전 직원에게 '회계연도(매년 1월 1일)'를 일괄 적용합니다. 회계연도 기준은 중도 입사/퇴사 시 계산이 복잡하고, 근로자에게 불리한 경우가 발생할 수 있습니다. 퇴사 시점에는 반드시 입사일 기준으로 재정산하여, 회계연도 기준으로 계산했을 때보다 불리한 부분(부족하게 받은 연차)이 없는지 확인하고 추가 수당 지급을 요청해야 합니다.
                </p>
              </li>
              <li className="p-4 rounded-md bg-white dark:bg-gray-800 shadow">
                <h4 className="font-semibold text-lg mb-2 text-blue-600 dark:text-blue-400">5. 5인 미만 사업장, '약정 휴가'를 협의하세요.</h4>
                <p>
                  근로기준법상 연차 유급휴가, 연차수당, 연차 사용 촉진 제도는 상시 근로자 <strong>5인 이상 사업장</strong>에만 의무 적용됩니다. 5인 미만 사업장이라면 법적 연차는 발생하지 않습니다. 하지만 근로계약서나 취업규칙을 통해 '약정 휴가'를 정할 수 있습니다. 입사 시 연차에 준하는 유급휴가를 별도로 합의하여 근로계약서에 명시하는 것이 중요합니다.
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