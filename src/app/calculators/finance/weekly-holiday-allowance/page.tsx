'use client'

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const WeeklyHolidayAllowanceCalculator = () => {
  const [hourlyWage, setHourlyWage] = useState<number>(0);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(0);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(0);

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = parseFloat(value.replace(/,/g, ''));
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (value: string) => {
    const parsedValue = parseFloat(value);
    setter(isNaN(parsedValue) ? 0 : parsedValue);
  };

  const handleReset = () => {
    setHourlyWage(0);
    setWorkHoursPerDay(0);
    setWorkDaysPerWeek(0);
  };

  const { calculatedWeeklyHolidayAllowance, calculatedWeeklyWorkHours } = useMemo(() => {
    if (isNaN(hourlyWage) || isNaN(workHoursPerDay) || isNaN(workDaysPerWeek) || hourlyWage <= 0 || workHoursPerDay <= 0 || workDaysPerWeek <= 0) {
      return {
        calculatedWeeklyHolidayAllowance: 0,
        calculatedWeeklyWorkHours: 0,
      };
    }

    const weeklyWorkHours = workHoursPerDay * workDaysPerWeek;
    let weeklyHolidayAllowance = 0;

    if (weeklyWorkHours >= 15) {
      weeklyHolidayAllowance = (weeklyWorkHours / 40) * 8 * hourlyWage; // 40시간 기준 8시간 유급휴일
    }

    return {
      calculatedWeeklyHolidayAllowance: Math.round(weeklyHolidayAllowance),
      calculatedWeeklyWorkHours: weeklyWorkHours,
    };
  }, [hourlyWage, workHoursPerDay, workDaysPerWeek]);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="hourlyWage">시급 (원)</Label>
        <Input
          id="hourlyWage"
          value={hourlyWage.toLocaleString()}
          onChange={handleInputChange(setHourlyWage)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="시급 입력"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workHoursPerDay">1일 소정근로시간 (시간)</Label>
        <Input
          id="workHoursPerDay"
          value={workHoursPerDay.toLocaleString()}
          onChange={handleInputChange(setWorkHoursPerDay)}
          type="text"
          inputMode="numeric"
          className="text-right"
          placeholder="1일 소정근로시간 입력"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="workDaysPerWeek">1주 소정근로일수 (일)</Label>
        <Select onValueChange={handleSelectChange(setWorkDaysPerWeek)} value={String(workDaysPerWeek)}>
          <SelectTrigger id="workDaysPerWeek">
            <SelectValue placeholder="선택" />
          </SelectTrigger>
          <SelectContent>
            {[...Array(7)].map((_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>{i + 1}일</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        초기화
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="flex justify-between text-lg font-semibold">
        <span>주간 소정근로시간:</span>
        <span>{calculatedWeeklyWorkHours.toLocaleString()} 시간</span>
      </div>
      <div className="flex justify-between text-xl font-bold border-t pt-4 mt-4">
        <span>예상 주휴수당:</span>
        <span>{calculatedWeeklyHolidayAllowance.toLocaleString()} 원</span>
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold">일주일을 성실하게 일한 당신, 하루의 유급휴가를 받을 권리가 있습니다.</p>
        <p>주휴수당은 근로기준법 제55조에 명시된 근로자의 소중한 권리입니다. 1주일 동안 계약한 근무일수를 모두 채운 근로자에게 주 1회의 유급 휴일(주휴일)을 보장하고, 그날 일하지 않아도 하루치 임금을 추가로 지급하는 제도입니다. 흔히 아르바이트생이나 단시간 근로자는 해당되지 않는다고 오해하지만, 근무 조건만 충족하면 고용 형태와 관계없이 누구나 받을 수 있습니다.</p>
        <p>이 계산기는 복잡한 주휴수당 발생 조건을 확인하고, 자신의 근무 형태에 맞는 정확한 수당 금액을 계산하여 임금 체불과 같은 불이익을 방지하는 데 도움을 줍니다. 2025년 최저시급을 기준으로 자신의 시급이 주휴수당을 포함했을 때 실질적으로 얼마인지 확인해보는 용도로도 유용합니다.</p>
        <p>사장님에게는 근로자에게 정확한 급여를 지급하여 법적 분쟁을 예방하고, 건강한 노사 관계를 구축하는 기초 자료로 활용될 수 있습니다.</p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4 p-4 bg-muted rounded-md">
        <h3 className="text-xl font-bold">내 주휴수당, 어떻게 계산될까?</h3>
        <p>주휴수당은 1주일간의 소정근로시간에 비례하여 계산됩니다. 법정 최대 근로시간인 주 40시간을 기준으로 내가 일한 시간의 비율만큼 수당이 발생한다고 이해하면 쉽습니다.</p>
        <div className="border-l-4 border-primary pl-4 mt-4">
          <p><strong>계산 공식:</strong></p>
          <p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(1주일 총 소정근로시간 / 40시간) × 8시간 × 시급</code></p>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">계산 예시:</h4>
          <p>예를 들어, 시급 10,000원을 받고 하루 6시간씩 주 4일(총 24시간)을 일하는 근로자의 경우:</p>
          <p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(24시간 / 40시간) × 8시간 × 10,000원 = 48,000원</code></p>
          <p className="text-sm text-muted-foreground mt-1">따라서 이 근로자는 1주일 급여(24시간 × 10,000원 = 240,000원) 외에 주휴수당 48,000원을 추가로 받아 총 288,000원을 받게 됩니다.</p>
        </div>
        <p className="text-xs text-muted-foreground mt-4">* 참고: 주 40시간 이상 일해도 주휴수당은 최대 8시간분(주 40시간 기준)까지만 지급됩니다.</p>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">1. 주휴수당 지급 조건 (이 3가지는 꼭 기억하세요!)</h4>
          <p>주휴수당을 받기 위해서는 아래 세 가지 조건을 모두 충족해야 합니다.</p>
          <ul className="list-decimal pl-5 space-y-2 mt-2">
            <li><strong>주 15시간 이상 근무:</strong> 근로계약서에 명시된 1주일간의 소정근로시간이 15시간 이상이어야 합니다. 연장, 야간, 휴일근로 시간은 포함되지 않습니다.</li>
            <li><strong>소정근로일 개근:</strong> 1주일 동안 일하기로 약속한 날에 모두 출근해야 합니다. 지각이나 조퇴는 결근이 아니므로 주휴수당을 받을 수 있지만, 하루라도 무단결근하면 해당 주의 주휴수당은 발생하지 않습니다.</li>
            <li><strong>다음 주 근로 예정:</strong> 주휴수당은 다음 주의 근로를 전제로 지급되는 것입니다. 따라서 1주일만 일하고 그만두는 경우에는 주휴수당을 받을 수 없습니다.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">2. 5인 미만 사업장도 주휴수당을 지급해야 하나요?</h4>
          <p><strong>네, 반드시 지급해야 합니다.</strong> 주휴수당은 사업장의 상시 근로자 수와 관계없이 근로기준법이 적용되는 모든 사업장에 해당되는 의무 조항입니다. 5인 미만 사업장이라는 이유로 주휴수당을 지급하지 않는 것은 명백한 임금체불에 해당합니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">3. 월급에 주휴수당이 포함된 경우 (포괄임금제)</h4>
          <p>월급제 근로자의 경우, 월급에 주휴수당이 포함된 것으로 간주하는 경우가 많습니다(포괄임금제). 하지만 이 경우에도 근로계약서에 '월급 OOO원에는 주휴수당이 포함되어 있다'는 내용이 명확하게 기재되어 있어야 합니다. 또한, 주휴수당을 포함한 월급을 실제 근로시간으로 나누어 계산한 시급이 최저시급 이상이어야 법적으로 유효합니다. 애매한 문구로 주휴수당 지급을 회피하는 경우, 법적 분쟁의 소지가 될 수 있습니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">4. 초단시간 근로자와 주휴수당</h4>
          <p>4주 평균하여 1주 소정근로시간이 15시간 미만인 근로자를 '초단시간 근로자'라고 합니다. 안타깝게도 초단시간 근로자에게는 근로기준법상 주휴수당, 연차유급휴가, 퇴직금이 적용되지 않습니다. 이는 장기 근속을 유도하고 최소한의 휴식을 보장하려는 법의 취지 때문입니다.</p>
        </div>
        <div>
          <h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">5. 주휴수당과 실질 시급 (2025년 최저시급 기준)</h4>
          <p>주휴수당을 포함하면 내가 받는 실질적인 시급은 더 높아집니다. 예를 들어 2025년 최저시급이 10,000원이라고 가정하고 주 40시간을 일한다면, 주급은 400,000원이고 주휴수당은 80,000원입니다. 총 480,000원을 40시간으로 나누면 실질 시급은 12,000원이 되는 셈입니다. 이는 구직 시 급여 조건을 비교하거나 연봉 협상을 할 때 유용하게 활용할 수 있는 개념입니다.</p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="주휴수당 계산기"
      description="시급, 1일 소정근로시간, 1주 소정근로일수를 입력하여 주휴수당을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default WeeklyHolidayAllowanceCalculator;