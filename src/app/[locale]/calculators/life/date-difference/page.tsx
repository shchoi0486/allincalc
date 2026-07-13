'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';

import { differenceInDays, differenceInMonths, differenceInYears, addDays, intervalToDuration } from 'date-fns';

const DateDifferenceCalculator: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.dateDifference;
  const isKo = locale === 'ko';

  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [includeStartDate, setIncludeStartDate] = useState(false);
  const [result, setResult] = useState<{
    totalYears: number;
    totalMonths: number;
    totalDays: number;
    diffDays: number;
  } | null>(null);

  const calculateDateDifference = () => {
    if (!startDate || !endDate) {
      setResult(null);
      return;
    }

    let start = new Date(startDate);
    let end = new Date(endDate);

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end < start) {
      [start, end] = [end, start];
    }

    const duration = intervalToDuration({ start, end });

    let diffDays = differenceInDays(end, start);

    if (includeStartDate) {
      diffDays += 1;
    }

    setResult({
      totalYears: duration.years || 0,
      totalMonths: duration.months || 0,
      totalDays: duration.days || 0,
      diffDays,
    });
  };

  const resetFields = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setIncludeStartDate(false);
    setResult(null);
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="startDate" className="w-24">{t.inputs.startDate}:</label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder={t.placeholders.startDate} />
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="endDate" className="w-24">{t.inputs.endDate}:</label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder={t.placeholders.endDate} />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeStartDate"
          checked={includeStartDate}
          onChange={(e) => setIncludeStartDate(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="includeStartDate">{t.inputs.includeStartDate}</label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateDateDifference}>{t.calculate}</Button>
        <Button variant="secondary" onClick={resetFields}>{t.reset}</Button>
      </div>
    </div>
  );

  const resultSection = result && (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">{t.results.title}</h3>
        <p className="text-lg">
          {t.results.period}은 <span className="font-bold text-blue-600">{result.totalYears}{isKo ? '년' : ' yr'} {result.totalMonths}{isKo ? '개월' : ' mo'} {result.totalDays}{isKo ? '일' : ' d'}</span> 이고,
        </p>
        <p className="text-lg">
          {t.results.totalDays}은 <span className="font-bold text-blue-600">{result.diffDays}{isKo ? '일' : ' days'}</span> 입니다.
        </p>
    </div>
  );

  const infoSection = isKo ? (
    {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          두 날짜 사이의 기간을 정확하게 계산하세요!
        </p>
        <p>
          날짜 차이 계산기는 두 특정 날짜 사이의 간격을 년, 월, 일 단위로 정확하게 계산해주는 강력하고 직관적인 도구입니다.
          여행 D-day 계산, 프로젝트 마감일 관리, 법적 계약 기간 산정, 역사적 사건 사이의 기간 확인 등
          일상생활과 전문적인 업무 모두에서 필수적인 역할을 합니다.
        </p>
        <p>
          시작일과 종료일을 선택하고 '초일산입' 여부만 결정하면 복잡한 날짜 계산을 즉시 완료하여 시간과 노력을 절약할 수 있습니다.
          정확한 기간 산출, 총 일수 변환, 초일산입 옵션 등 다양한 기능을 제공합니다.
        </p>
        <p>
          부동산 양도소득세 보유기간 계산, 대출 이자 기간 산정, 프로젝트 일정 관리 등
          날짜 계산이 필요한 모든 상황에서 유용하게 활용할 수 있는 필수 도구입니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">양력</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">태양의 움직임을 기준으로 한 현재 일반적으로 사용되는 달력으로, 1년은 약 365.2422일입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">음력</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">달의 위상 변화를 기준으로 한 달력으로, 양력보다 약 11일 짧아 매년 날짜가 달라집니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">윤년</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">4년마다 2월에 하루를 더해 366일로 만드는 해입니다. 연도가 4로 나누어 떨어지고 100으로 나누어 떨어지지 않으면 윤년입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">윤달</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">음력에서 달의 차이를 보정하기 위해 약 2~3년에 한 번씩 한 달을 더 넣는 달입니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-border pb-2">날짜 차이 계산의 기술적 원리</h3>
          <p class="mb-4 text-muted-foreground">
            이 계산기는 date-fns 라이브러리를 사용하여 날짜 계산의 정확성과 효율성을 보장합니다.
            date-fns는 모던 JavaScript 환경에 최적화된 날짜 유틸리티 라이브러리로, 각 함수가 순수 함수로 이루어져 있어 예측 가능한 결과를 제공합니다.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">1. 기간 계산 (년, 월, 일)</h3>
          <p class="mb-2 text-muted-foreground">
            두 날짜 사이의 전체적인 기간을 계산하기 위해 intervalToDuration 함수를 사용합니다.
            시작일과 종료일을 인자로 받아 년(years), 월(months), 일(days) 단위로 나누어 반환합니다.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">2. 총 일수 계산</h3>
          <p class="mb-2 text-muted-foreground">
            전체 기간을 '일' 단위로 환산하기 위해 differenceInDays 함수를 사용합니다.
            두 날짜 사이의 전체 24시간 '일'의 차이를 계산하여 정수 값을 반환합니다.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">3. 초일산입 처리</h3>
          <p class="mb-2 text-muted-foreground">
            민법 원칙에 따라 기간 계산 시 첫날을 포함하지 않는 것이 일반적이지만,
            계약이나 상황에 따라 첫날을 포함해야 할 경우가 있습니다.
            '초일산입' 옵션이 활성화되면 총 일수에 1을 더하여 첫날을 기간에 포함시킵니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">💡 '초일산입' 완벽 이해하기</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>원칙 (초일 불산입):</strong> 민법 제157조에 따라 기간 계산 시 첫날은 포함하지 않는 것이 원칙입니다. 예를 들어 1월 1일부터 3일간이면 1월 2일, 3일, 4일을 의미합니다.</li>
            <li><strong>예외 (초일 산입):</strong> 기간이 오전 0시부터 시작하거나, 나이를 계산할 때, 당사자 간 계약으로 특별히 정한 경우에는 첫날을 포함합니다.</li>
            <li><strong>이 계산기에서는:</strong> '초일산입' 체크박스를 통해 사용자가 직접 선택할 수 있습니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">- 실생활 활용 예시 -</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>부동산 양도소득세:</strong> 비과세 혜택을 위한 '2년 보유' 기간을 계산할 때 초일산입 여부가 중요할 수 있습니다.</li>
            <li><strong>프로젝트 관리:</strong> 시작일과 마감일을 설정하여 총 진행 기간을 파악하고 일정을 효율적으로 분배할 수 있습니다.</li>
            <li><strong>이자 계산:</strong> 예금이나 대출의 이자 계산 기간을 산정할 때 은행 약관에 따라 초일산입 여부가 달라질 수 있습니다.</li>
            <li><strong>역사 공부:</strong> 특정 사건이 지속된 기간을 쉽게 알아볼 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `
    }
  ) : (
    {
    calculatorDescription: `
      <div className="space-y-4">
        <p class="text-lg font-semibold text-foreground">
          Accurately calculate the period between two dates!
        </p>
        <p>
          The date difference calculator is a powerful, intuitive tool that precisely computes the interval between two specific dates in years, months, and days.
          It plays an essential role in both daily life and professional work&mdash;travel D-day counting, project deadline management, legal contract periods, and checking durations between historical events.
        </p>
        <p>
          Just select the start and end dates and decide whether to "include the first day," and complex date math is done instantly, saving time and effort.
          It offers accurate period output, total-day conversion, and a first-day-inclusion option.
        </p>
        <p>
          It is an essential tool useful in any situation requiring date calculation, such as real-estate capital-gains tax holding periods, loan interest periods, and project scheduling.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Terminology</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Solar calendar</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The commonly used calendar based on the sun's movement, with a year of about 365.2422 days.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Lunar calendar</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A calendar based on the moon's phases, about 11 days shorter than the solar calendar, so the date shifts each year.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Leap year</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A year that adds a day to February every 4 years to make 366 days. A year is a leap year if divisible by 4 but not by 100.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Leap month</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">In the lunar calendar, an extra month added about every 2~3 years to correct the difference between months.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 class="font-semibold text-xl mb-2 border-b-2 border-border pb-2">Technical principle of date difference calculation</h3>
          <p class="mb-4 text-muted-foreground">
            This calculator uses the date-fns library to ensure accuracy and efficiency in date calculation.
            date-fns is a date utility library optimized for modern JavaScript environments, with each function being pure and providing predictable results.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">1. Period calculation (years, months, days)</h3>
          <p class="mb-2 text-muted-foreground">
            The intervalToDuration function is used to calculate the overall period between two dates.
            It takes the start and end dates as arguments and returns them divided into years, months, and days.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">2. Total days calculation</h3>
          <p class="mb-2 text-muted-foreground">
            The differenceInDays function is used to convert the whole period into the day unit.
            It calculates the difference in whole 24-hour days between the two dates and returns an integer.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">3. First-day inclusion</h3>
          <p class="mb-2 text-muted-foreground">
            By civil-law principle, the first day is generally not included when calculating a period, but
            there are cases where the first day must be included by contract or situation.
            When the "include first day" option is enabled, 1 is added to the total days to include the first day in the period.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">💡 Fully understanding "first-day inclusion"</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Principle (exclude first day):</strong> Per Article 157 of the Civil Act, the first day is generally not included in period calculation. For example, "3 days from Jan 1" means Jan 2, 3, and 4.</li>
            <li><strong>Exception (include first day):</strong> The first day is included when the period starts at 0:00, when calculating age, or when parties specially agree by contract.</li>
            <li><strong>In this calculator:</strong> You can choose directly via the "include first day" checkbox.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">- Real-life examples -</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Real-estate capital gains tax:</strong> Whether to include the first day can matter when calculating the "2-year holding" period for tax exemption.</li>
            <li><strong>Project management:</strong> Set start and end dates to grasp the total duration and allocate the schedule efficiently.</li>
            <li><strong>Interest calculation:</strong> When determining the interest period for deposits or loans, first-day inclusion may differ by bank terms.</li>
            <li><strong>History study:</strong> Easily see how long a particular event lasted.</li>
          </ul>
        </div>
      </div>
    `
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '날짜차이 계산기' : 'Date Difference Calculator'}
      description={isKo ? '두 날짜 사이의 기간을 계산합니다.' : 'Calculate the period between two dates.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DateDifferenceCalculator;
