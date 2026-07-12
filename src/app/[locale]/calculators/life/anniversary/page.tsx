'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from '@/i18n/I18nProvider';


const AnniversaryCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.anniversary;
  const isKo = locale === 'ko';

  const [baseDate, setBaseDate] = useState(new Date().toISOString().split('T')[0]);
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);
  const [result, setResult] = useState<any>(null);

  const calculateAnniversary = () => {
    const base = new Date(baseDate);
    const today = new Date(todayDate);

    if (isNaN(base.getTime())) return;

    const diffTime = Math.abs(today.getTime() - base.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const years = today.getFullYear() - base.getFullYear();
    const months = today.getMonth() - base.getMonth();
    const days = today.getDate() - base.getDate();

    let totalYears = years;
    let totalMonths = months;
    let totalDays = days;

    if (totalDays < 0) {
      totalMonths -= 1;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      totalDays += prevMonth.getDate();
    }

    if (totalMonths < 0) {
      totalYears -= 1;
      totalMonths += 12;
    }

    const nextAnniversary = new Date(base);
    nextAnniversary.setFullYear(today.getFullYear());
    if (nextAnniversary < today) {
      nextAnniversary.setFullYear(today.getFullYear() + 1);
    }

    const daysToNextAnniversary = Math.ceil((nextAnniversary.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({
      nextAnniversary: nextAnniversary.toLocaleDateString(),
      daysToNextAnniversary,
      totalYears,
      totalMonths,
      totalDays,
      diffDays,
      diffWeeks: Math.floor(diffDays / 7),
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <Tabs defaultValue="wedding" className="w-full">
        <TabsList>
          <TabsTrigger value="wedding">{t.tabs.wedding}</TabsTrigger>
          <TabsTrigger value="relationship">{t.tabs.relationship}</TabsTrigger>
          <TabsTrigger value="other">{t.tabs.other}</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding">
          <div className="flex items-center space-x-4 mt-4">
            <label htmlFor="baseDate" className="w-24">{t.inputs.date}:</label>
            <CustomDatePickerWithPopover
              date={new Date(baseDate)}
              setDate={(date) => date && setBaseDate(date.toISOString().split('T')[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center space-x-4">
        <label htmlFor="todayDate" className="w-24">{t.inputs.todayDate}:</label>
        <CustomDatePickerWithPopover
          date={new Date(todayDate)}
          setDate={(date) => date && setTodayDate(date.toISOString().split('T')[0])}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateAnniversary}>{t.calculate}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{t.reset}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.results.nextAnniversary}:</span>
            <strong>{result.nextAnniversary}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.daysUntilNext}:</span>
              <strong>{result.daysToNextAnniversary} {isKo ? '일' : 'days'}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.timeSpent}:</span>
            <strong>{result.totalYears} {t.results.years}, {result.totalMonths} {t.results.months}, {result.totalDays} {t.results.days}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.totalYears}:</span>
            <strong>{result.totalYears} {t.results.years}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.totalMonths}:</span>
            <strong>{result.totalYears * 12 + result.totalMonths} {t.results.months}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.totalWeeks}:</span>
              <strong>{result.diffWeeks} {isKo ? '주' : 'wks'}</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.totalDays}:</span>
            <strong>{result.diffDays} {t.results.days}</strong>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = isKo ? (
    {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          소중한 기념일까지 남은 시간을 정확하게 계산하세요!
        </p>
        <p>
          기념일 계산기는 두 사람의 소중한 첫 만남, 결혼기념일, 아기의 백일이나 돌, 혹은 잊지 말아야 할 중요한 계약일까지
          삶의 모든 특별한 순간을 기억하고 기념할 수 있도록 도와주는 편리한 도구입니다.
        </p>
        <p>
          단순히 날짜만 계산하는 것을 넘어, 그날이 갖는 의미를 되새기고 앞으로 다가올 기념일을 미리 준비하며 설렘을 더할 수 있습니다.
          기준일과 오늘 날짜를 입력하기만 하면 함께한 시간이 며칠, 몇 주, 몇 개월, 몇 년인지 한눈에 보여주며,
          다음 기념일까지 남은 날짜도 정확하게 알려줍니다.
        </p>
        <p>
          연인들은 사귄 날짜를 기준으로 100일, 200일, 1주년 등 각종 기념일을 쉽게 확인할 수 있고,
          부모님은 아기의 성장 이벤트를 관리할 수 있으며, 중요한 시험이나 프로젝트 마감일의 D-day도 설정할 수 있습니다.
          금연이나 다이어트 시작일을 설정하고 자신의 노력을 시간으로 확인하며 동기 부여를 얻는 데에도 활용해 보세요.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">기념일</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">잊지 않고 기억하거나 축하하기 위해 정한 특별한 날로, 결혼기념일·생일·100일 등이 포함됩니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">음력 / 양력</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">부모님 생신 등 음력 기념일은 양력으로 변환해야 정확한 날짜에 계산할 수 있으므로 변환 후 입력하세요.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-border pb-2">기념일 계산의 핵심 원리</h3>
          <p className="mb-4 text-muted-foreground">
            기념일 계산은 JavaScript의 Date 객체를 기반으로 이루어집니다.
            기준일과 오늘 날짜를 Date 객체로 변환한 후, 두 날짜 사이의 시간 차이를 밀리초(ms) 단위로 계산합니다.
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">const diffTime = Math.abs(today.getTime() - base.getTime());</code>
          </div>
          <p className="mt-4 text-muted-foreground">
            getTime() 메소드는 1970년 1월 1일 UTC로부터 경과된 시간을 밀리초로 반환합니다.
            이 값을 이용해 총 경과일을 계산할 수 있습니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">1. 총 경과 시간 계산</h3>
          <ul className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li><strong>총 경과일:</strong> 밀리초를 초(1000), 분(60), 시간(60), 일(24)로 나누어 계산합니다. Math.ceil을 사용하여 하루가 조금이라도 지났으면 1일로 계산합니다.</li>
            <li><strong>총 경과 주:</strong> 총 경과일을 7로 나누어 주 단위를 계산합니다.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">2. "몇 년, 몇 개월, 며칠" 계산</h3>
          <p className="mb-2 text-muted-foreground">
            각 달의 일수가 다르기 때문에 단순 나누기가 아닌, 연도·월·일 차이를 각각 구한 후 정확도를 보정하는 과정을 거칩니다.
            일 차이가 음수이면 월에서 1을 빼고 이전 달의 마지막 날짜를 더하고, 월 차이가 음수이면 연에서 1을 뺍니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">3. 다음 기념일 계산</h3>
          <p className="mb-2 text-muted-foreground">
            기준일의 연도를 현재 연도로 설정한 뒤, 만약 설정된 날짜가 이미 지났으면 다음 해의 기념일을 목표로 설정합니다.
            오늘부터 다음 기념일까지 남은 날짜(D-day)는 두 날짜의 차이를 다시 일 단위로 계산하여 구합니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">💡 기념일을 더 특별하게 만드는 팁</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>주년(週年) 기념일:</strong> 1000일, 2000일 같은 '일' 단위 기념일은 색다른 특별함을 선사합니다.</li>
            <li><strong>포토북 제작:</strong> 함께한 시간의 사진을 모아 포토북을 만들면 시각적으로 되돌아보는 큰 감동을 줍니다.</li>
            <li><strong>타임캡슐:</strong> 기념일에 서로의 편지나 의미 있는 물건을 함께 넣어보세요.</li>
            <li><strong>음력 기념일:</strong> 부모님 생신 등 음력 기념일은 포털 사이트의 '음력 변환기'를 활용하여 양력으로 변환 후 입력하세요.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">📅 D-Day 활용법</h3>
          <p class="text-muted-foreground">기념일 계산기는 D-Day 카운터로도 활용할 수 있습니다.</p>
          <ul class="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
            <li><strong>시험/자격증 준비:</strong> 시험 날짜를 기준일로 설정하고 남은 시간을 체계적으로 관리하세요.</li>
            <li><strong>여행 계획:</strong> 여행 출발일을 D-day로 설정하고 남은 날짜에 맞춰 준비물을 챙기세요.</li>
            <li><strong>출산 예정일:</strong> 아기를 만날 날을 기준일로 설정하여 출산 준비를 차근차근 진행할 수 있습니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">⚠️ 주의사항</h3>
          <p class="text-muted-foreground">
            본 계산기는 국제 표준에 따라 날짜와 시간의 차이를 기반으로 계산합니다.
            '첫날을 포함하는지' 여부(D-day vs D+1)는 사용자가 목적에 맞게 해석하는 것이 좋습니다.
          </p>
        </div>
      </div>
    `
    }
  ) : (
    {
    calculatorDescription: `
      <div className="space-y-4">
        <p class="text-lg font-semibold text-foreground">
          Accurately calculate the time remaining until your special anniversary!
        </p>
        <p>
          The anniversary calculator is a handy tool that helps you remember and celebrate every special moment of life&mdash;
          a couple's precious first meeting, wedding anniversary, a baby's 100th day or first birthday, or an important contract date you must not forget.
        </p>
        <p>
          Beyond simply calculating dates, it lets you reflect on the meaning of the day and prepare for upcoming anniversaries in advance, adding excitement.
          Just enter the base date and today's date, and it shows at a glance how many days, weeks, months, and years you have spent together,
          and accurately tells you the days remaining until the next anniversary.
        </p>
        <p>
          Couples can easily check various anniversaries like the 100th day, 200th day, and 1st year based on the date they started dating;
          parents can manage a baby's growth events; and you can set a D-day for an important exam or project deadline.
          Try using it to set a quit-smoking or diet start date and motivate yourself by seeing your effort measured in time.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Terminology</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Anniversary</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A special day set aside to remember or celebrate&mdash;wedding anniversaries, birthdays, 100th days, etc.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Lunar / Solar calendar</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">Lunar anniversaries such as parents' birthdays must be converted to the solar calendar to be calculated on the exact date, so convert before entering.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 class="font-semibold text-xl mb-2 border-b-2 border-border pb-2">Core principle of anniversary calculation</h3>
          <p class="mb-4 text-muted-foreground">
            Anniversary calculation is based on JavaScript's Date object.
            After converting the base date and today's date into Date objects, it calculates the time difference between the two dates in milliseconds (ms).
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">const diffTime = Math.abs(today.getTime() - base.getTime());</code>
          </div>
          <p class="mt-4 text-muted-foreground">
            The getTime() method returns the elapsed time since January 1, 1970 UTC in milliseconds.
            This value is used to calculate the total days elapsed.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">1. Total elapsed time</h3>
          <ul class="list-decimal list-inside space-y-2 text-muted-foreground">
            <li><strong>Total days elapsed:</strong> Divide milliseconds by seconds(1000), minutes(60), hours(60), days(24). Math.ceil counts a day as 1 if even a little has passed.</li>
            <li><strong>Total weeks elapsed:</strong> Divide total days elapsed by 7 to get the weekly unit.</li>
          </ul>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">2. "How many years, months, days"</h3>
          <p class="mb-2 text-muted-foreground">
            Because each month has a different number of days, instead of simple division it finds the year/month/day differences separately and then corrects for accuracy.
            If the day difference is negative, subtract 1 from the month and add the previous month's last day; if the month difference is negative, subtract 1 from the year.
          </p>
        </div>
        <div>
          <h3 class="font-semibold text-lg mb-2">3. Next anniversary</h3>
          <p class="mb-2 text-muted-foreground">
            Set the base date's year to the current year; if that date has already passed, target the next year's anniversary.
            The remaining days (D-day) until the next anniversary is found by recalculating the difference between the two dates in days.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">💡 Tips to make anniversaries more special</h3>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Milestone (year) anniversaries:</strong> Day-unit milestones like 1000 or 2000 days offer a special uniqueness.</li>
            <li><strong>Make a photo book:</strong> Collect photos of your time together into a photo book for a big visual trip down memory lane.</li>
            <li><strong>Time capsule:</strong> On the anniversary, put each other's letters or meaningful items together in a time capsule.</li>
            <li><strong>Lunar anniversaries:</strong> For lunar anniversaries like parents' birthdays, use a portal site's lunar-to-solar converter and enter the solar date.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">📅 Using D-Day</h3>
          <p class="text-muted-foreground">The anniversary calculator can also be used as a D-Day counter.</p>
          <ul class="list-disc list-inside space-y-2 mt-2 text-muted-foreground">
            <li><strong>Exam/certification prep:</strong> Set the exam date as the base and manage your remaining time systematically.</li>
            <li><strong>Travel planning:</strong> Set the departure date as D-day and pack according to the remaining days.</li>
            <li><strong>Due date:</strong> Set the day you meet the baby as the base to proceed step by step with birth preparations.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">⚠️ Notes</h3>
          <p class="text-muted-foreground">
            This calculator computes based on the difference in dates and times per international standards.
            Whether to "include the first day" (D-day vs D+1) is best interpreted by the user according to their purpose.
          </p>
        </div>
      </div>
    `
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '기념일 계산기' : 'Anniversary Calculator'}
      description={isKo ? '특별한 날로부터 얼마나 지났는지 계산해보세요.' : 'Calculate how much time has passed since your special day.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default AnniversaryCalculator;
