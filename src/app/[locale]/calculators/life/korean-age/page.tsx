'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parse, isBefore, isAfter, addYears, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import { useI18n } from '@/i18n/I18nProvider';

const KoreanAgeCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.koreanAge;
  const isKo = locale === 'ko';
  const unknownLabel = isKo ? '알 수 없음' : 'Unknown';
  const yearSuffix = isKo ? '세' : ' yrs';
  const daySuffix = isKo ? '일' : ' days';
  const zodiacSigns = isKo
    ? ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양']
    : ['Monkey', 'Rooster', 'Dog', 'Pig', 'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake', 'Horse', 'Goat'];
  const birthdayFormat = isKo ? 'yyyy년 MM월 dd일' : 'MMM d, yyyy';

  const [calculationMethod, setCalculationMethod] = useState<'birthDate' | 'birthYear' | 'currentAge'>('birthDate');
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined);
  const [birthYear, setBirthYear] = useState<number | ''>( '');
  const [currentAge, setCurrentAge] = useState<number | ''>( '');
  const [hasBirthdayPassed, setHasBirthdayPassed] = useState<boolean | null>(null);
  const [result, setResult] = useState<{
    koreanAge: number;
    internationalAge: number;
    yearAge: number;
    daysLived: number;
    nextBirthday: Date | string;
    zodiac: string;
    isAdult: boolean;
    canVote: boolean;
    canDrink: boolean;
  } | null>(null);
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  const calculateKoreanAge = () => {
    if (calculationMethod === 'birthDate') {
      if (!birthDate) {
        alert(t.placeholders.birthday);
        return;
      }
      calculateFromBirthDate(birthDate);
    } else if (calculationMethod === 'birthYear') {
      if (!birthYear) {
        alert(t.placeholders.birthday);
        return;
      }
      calculateFromBirthYear(Number(birthYear));
    } else {
      if (currentAge === '') {
        alert(t.placeholders.birthday);
        return;
      }
      if (hasBirthdayPassed === null) {
        alert(t.placeholders.birthday);
        return;
      }
      calculateFromCurrentAge(Number(currentAge), hasBirthdayPassed);
    }
  };

  const calculateFromBirthDate = (birthDate: Date) => {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    
    const koreanAge = currentYear - birthYear + 1;
    
    let internationalAge = currentYear - birthYear;
    const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (isAfter(today, thisYearBirthday)) {
      internationalAge--;
    }
    
    const yearAge = currentYear - birthYear;
    
    const daysLived = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (isAfter(today, nextBirthday)) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    

    const zodiac = zodiacSigns[birthYear % 12];
    
    const isAdult = internationalAge >= 19;
    const canVote = internationalAge >= 18;
    const canDrink = internationalAge >= 19;

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      daysLived,
      nextBirthday: nextBirthday,
      zodiac,
      isAdult,
      canVote,
      canDrink
    });
  };

  const calculateFromBirthYear = (birthYear: number) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const koreanAge = currentYear - birthYear + 1;
    const internationalAge = currentYear - birthYear;
    const yearAge = currentYear - birthYear;
    

    const zodiac = zodiacSigns[birthYear % 12];
    
    const isAdult = internationalAge >= 19;
    const canVote = internationalAge >= 18;
    const canDrink = internationalAge >= 19;

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      daysLived: 0,
      nextBirthday: unknownLabel,
      zodiac,
      isAdult,
      canVote,
      canDrink
    });
  };

  const calculateFromCurrentAge = (currentAge: number, hasBirthdayPassed: boolean) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    
    const birthYear = currentYear - currentAge - (hasBirthdayPassed ? 0 : 1);
    const koreanAge = currentAge + 1;
    const internationalAge = currentAge;
    const yearAge = currentYear - birthYear;
    

    const zodiac = zodiacSigns[birthYear % 12];
    
    const isAdult = internationalAge >= 19;
    const canVote = internationalAge >= 18;
    const canDrink = internationalAge >= 19;

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      daysLived: 0,
      nextBirthday: unknownLabel,
      zodiac,
      isAdult,
      canVote,
      canDrink
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="calculationMethod" className="w-24">{t.inputs.calculationMethod}:</label>
        <Select onValueChange={(value: 'birthDate' | 'birthYear' | 'currentAge') => setCalculationMethod(value)} value={calculationMethod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t.placeholders.calculationMethod} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthDate">{t.calculationMethods.birthDate}</SelectItem>
            <SelectItem value="birthYear">{t.calculationMethods.birthYear}</SelectItem>
            <SelectItem value="currentAge">{t.calculationMethods.currentAge}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {calculationMethod === 'birthDate' ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="birthDate" className="w-24">{t.inputs.birthDate}:</label>
            <Input
              id="birthDate"
              type="date"
              value={birthDate ? format(birthDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setBirthDate(e.target.value ? parse(e.target.value, 'yyyy-MM-dd', new Date()) : undefined)}
              placeholder="YYYY-MM-DD"
              className="w-[180px]"
              max={format(currentDate, 'yyyy-MM-dd')}
            />
          </div>
        </div>
      ) : calculationMethod === 'birthYear' ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="currentYear" className="w-24">{t.inputs.currentYear}:</label>
            <Input id="currentYear" type="number" value={currentYear} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed w-[180px]" />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="birthYear" className="w-24">{t.inputs.birthYear}:</label>
            <Input
              id="birthYear"
              type="number"
              value={birthYear}
              onChange={(e) => setBirthYear(Number(e.target.value))}
              placeholder="YYYY"
              className="w-[180px]"
              min={1900}
              max={currentYear}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="hasBirthdayPassed" className="w-24">{t.inputs.birthdayPassed}:</label>
            <Select onValueChange={(value) => setHasBirthdayPassed(value === 'yes')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t.placeholders.birthday} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">{t.birthdayOptions.yes}</SelectItem>
                <SelectItem value="no">{t.birthdayOptions.no}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="currentAge" className="w-24">{t.inputs.currentAge}:</label>
            <Input
              id="currentAge"
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              placeholder={t.placeholders.currentAge}
              className="w-[180px]"
              min={0}
              max={120}
            />
          </div>
        </div>
      )}
      <Button onClick={calculateKoreanAge} className="self-start">{t.calculate}</Button>
    </div>
  );

  const resultSection = (
    result ? (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">{t.results.koreanAge}</h3>
            <p className="text-2xl font-bold text-blue-600">{result.koreanAge}{yearSuffix}</p>
            <p className="text-sm text-blue-600 mt-1">{t.results.koreanAgeDesc}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">{t.results.internationalAge}</h3>
            <p className="text-2xl font-bold text-green-600">{result.internationalAge}{yearSuffix}</p>
            <p className="text-sm text-green-600 mt-1">{t.results.internationalAgeDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">{t.results.yearAge}</h3>
            <p className="text-2xl font-bold text-purple-600">{result.yearAge}{yearSuffix}</p>
            <p className="text-sm text-purple-600 mt-1">{t.results.yearAgeDesc}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">{t.results.zodiac}</h3>
            <p className="text-2xl font-bold text-orange-600">{result.zodiac}{isKo ? '띠' : ''}</p>
            <p className="text-sm text-orange-600 mt-1">{t.results.zodiacDesc}</p>
          </div>
        </div>

        {result.daysLived > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">{t.results.daysLived}</h3>
            <p className="text-2xl font-bold text-gray-600">{result.daysLived.toLocaleString()}{daySuffix}</p>
          </div>
        )}

        {result.nextBirthday !== unknownLabel && (
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <h3 className="font-semibold text-pink-800 mb-2">{t.results.nextBirthday}</h3>
            <p className="text-2xl font-bold text-pink-600">{format(result.nextBirthday as Date, birthdayFormat)}</p>
            <p className="text-sm text-pink-600 mt-1">까지 {Math.ceil(((result.nextBirthday as Date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}{t.results.daysUntilNext}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg border ${result.isAdult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className="font-semibold mb-1">{t.results.adultStatus}</h3>
            <p className={`text-lg font-bold ${result.isAdult ? 'text-green-600' : 'text-red-600'}`}>
              {result.isAdult ? t.results.adult : t.results.minor}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${result.canVote ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-1">{t.results.canVote}</h3>
            <p className={`text-lg font-bold ${result.canVote ? 'text-blue-600' : 'text-gray-600'}`}>
              {result.canVote ? t.results.possible : t.results.impossible}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${result.canDrink ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-1">{t.results.canDrink}</h3>
            <p className={`text-lg font-bold ${result.canDrink ? 'text-purple-600' : 'text-gray-600'}`}>
              {result.canDrink ? t.results.possible : t.results.impossible}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center text-muted-foreground h-full">
        {t.calculateHint}
      </div>
    )
  );

  const infoSection = isKo ? (
    {
      calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          "대체 제 나이가 몇 살이죠?" 한국의 복잡한 나이 계산법을 한 번에 해결하세요!
        </p>
        <p>
          2023년 6월, 대한민국은 사회적·행정적 혼란을 줄이기 위해 '만 나이'로 법적 기준을 통일했습니다.
          하지만 여전히 일상에서는 태어나자마자 한 살이 되고 매년 1월 1일에 한 살씩 더 먹는 '세는 나이'가 관습적으로 사용되고 있습니다.
          이 계산기는 법적 기준인 '만 나이', 전통 관습인 '세는 나이', 병역법 등에서 사용하는 '연 나이'까지 세 가지를 한 번에 계산합니다.
        </p>
        <p>
          단순한 나이 계산을 넘어, 자신의 띠(12간지), 법적 성인 여부, 투표 및 음주 가능 여부 등
          나이와 관련된 다양한 정보를 종합적으로 제공하여 사용자의 궁금증을 완벽하게 해소해 드립니다.
        </p>
        <p>
          만 나이 통일법 시행 이후 금융, 보험, 의료, 행정 등 다양한 분야에서 혼란이 줄었지만,
          일부 법률에서는 여전히 '연 나이'를 사용하고 있어 이 계산기를 통해 정확한 기준을 파악하는 것이 중요합니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">만 나이 (International Age)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">전 세계 공통의 국제 표준 나이로, 출생 시 0세이며 매년 생일마다 1세씩 증가합니다. 2023년 6월부터 대한민국 법적 기준으로 통일되었습니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">세는 나이 (Korean Age)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">태어나자마자 1세가 되고 매년 1월 1일에 모든 사람이 동시에 1세씩 먹는 한국의 전통 나이 계산법입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">연 나이 (Year Age)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">현재 연도에서 출생 연도를 뺀 값으로, 생일과 관계없이 계산됩니다. 병역법, 청소년보호법 등 일부 법률에서 사용됩니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">띠 (12간지)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">출생 연도를 12로 나눈 나머지에 따라 결정되는 동양의 십이지 동물입니다. 쥐, 소, 호랑이, 토끼, 용, 뱀, 말, 양, 원숭이, 닭, 개, 돼지 순입니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
      calculationFormula: `
      <div className="space-y-6">
        <h3 className="font-semibold text-xl mb-4 border-b-2 border-border pb-2">세 가지 나이, 어떻게 계산될까요?</h3>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">1. 만 나이 (International Age) - 법적 표준</h4>
          <p class="mb-2 text-muted-foreground">전 세계 공통의 국제 표준이자 2023년 6월부터 대한민국 법적 기준입니다.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>공식:</strong> (현재 연도 - 출생 연도) - (생일 지남 여부에 따라 0 또는 1)</li>
            <li><strong>특징:</strong> 출생 시 0세, 매년 생일마다 1세 증가</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">2. 세는 나이 (Korean Age) - 전통 관습</h4>
          <p class="mb-2 text-muted-foreground">한국에서 전통적으로 사용해 온 비공식 나이 계산법입니다.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>공식:</strong> 현재 연도 - 출생 연도 + 1</li>
            <li><strong>특징:</strong> 태어나자마자 1세, 매년 1월 1일마다 모든 사람이 함께 1세 증가</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">3. 연 나이 (Year Age) - 특정 법률용</h4>
          <p class="mb-2 text-muted-foreground">병역법, 청소년 보호법 등 일부 법률에서 규제 편의를 위해 사용합니다.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>공식:</strong> 현재 연도 - 출생 연도</li>
            <li><strong>특징:</strong> 생일과 관계없이 특정 연도에 태어난 모든 사람이 같은 나이</li>
          </ul>
        </div>
      </div>
    `,
      usefulTips: `
      <div className="space-y-6">
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">만 나이 통일법, 무엇이 달라졌을까요?</h3>
          <p class="mb-2 text-muted-foreground">
            2023년 6월 28일부터 시행된 '만 나이 통일법'은 법률, 계약, 공문서 등에서 나이를 계산할 때 '만 나이'만을 사용하도록 명시한 법입니다.
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>금융/보험:</strong> 연금 수령 시점, 보험 가입 가능 연령 등이 '만 나이' 기준으로 명확해졌습니다.</li>
            <li><strong>의료/복지:</strong> 국가 건강검진, 복지 혜택 수급 연령 기준의 혼선이 사라졌습니다.</li>
            <li><strong>행정/법률:</strong> 모든 공문서와 법적 절차에서 '만 나이'를 원칙으로 합니다.</li>
            <li><strong>주의:</strong> 초중등교육법(취학 연령), 병역법(징병검사 연령), 청소년보호법 등 일부 법률에서는 '연 나이'를 기준으로 합니다.</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">그래서, 술과 담배는 언제부터?</h3>
          <p class="text-muted-foreground">
            청소년 보호법에서는 청소년을 "'연 나이' 19세 미만인 사람"으로 규정합니다.
            따라서 '연 나이'로 19세가 되는 해의 1월 1일부터 술과 담배 구매가 가능합니다.
            예를 들어, 2005년생은 생일과 관계없이 2024년 1월 1일부터 성인으로 인정받습니다.
          </p>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">띠(12간지) 계산법</h3>
          <p class="text-muted-foreground">
            출생 연도의 12를 나눈 나머지에 따라 띠가 결정됩니다. 원숭이(0), 닭(1), 개(2), 돼지(3), 쥐(4), 소(5), 호랑이(6), 토끼(7), 용(8), 뱀(9), 말(10), 양(11) 순서입니다.
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
          "Wait, how old am I exactly?" Solve Korea's complicated age system all at once!
        </p>
        <p>
          In June 2023, South Korea unified its legal standard to "international age" to reduce social and administrative confusion.
          But in daily life, the traditional "counting age (Korean age)"&mdash;where you become 1 at birth and gain a year every January 1&mdash;is still used by custom.
          This calculator computes all three at once: the legal "international age," the traditional "counting age (Korean age)," and the "year age" used in laws such as the Military Service Act.
        </p>
        <p>
          Beyond simple age calculation, it comprehensively provides age-related info such as your zodiac (12 earthly branches), legal adult status, and voting and drinking eligibility to fully answer your questions.
        </p>
        <p>
          After the international-age unification law, confusion eased across finance, insurance, healthcare, and administration, but some laws still use "year age," so it is important to know the correct standard through this calculator.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Terminology</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">International Age</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The common international standard age: 0 at birth, increasing by 1 each birthday. Unified as Korea's legal standard since June 2023.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Korean Age (Counting Age)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">Korea's traditional method: you become 1 at birth and everyone gains a year together every January 1.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Year Age</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The current year minus the birth year, calculated regardless of birthday. Used in some laws such as the Military Service Act and the Youth Protection Act.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Zodiac (12 Earthly Branches)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The Oriental zodiac of 12 animals determined by the remainder of the birth year divided by 12: Rat, Ox, Tiger, Rabbit, Dragon, Snake, Horse, Goat, Monkey, Rooster, Dog, Pig.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
      calculationFormula: `
      <div className="space-y-6">
        <h3 className="font-semibold text-xl mb-4 border-b-2 border-border pb-2">The three ages, how are they calculated?</h3>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">1. International Age &mdash; legal standard</h4>
          <p class="mb-2 text-muted-foreground">The common international standard and Korea's legal standard since June 2023.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Formula:</strong> (Current year - Birth year) - (0 or 1 depending on whether your birthday has passed)</li>
            <li><strong>Feature:</strong> 0 at birth, +1 each birthday</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">2. Korean Age (Counting Age) &mdash; tradition</h4>
          <p class="mb-2 text-muted-foreground">Korea's traditionally used, unofficial age method.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Formula:</strong> Current year - Birth year + 1</li>
            <li><strong>Feature:</strong> 1 at birth, everyone gains a year together every January 1</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h4 class="font-semibold text-lg mb-2">3. Year Age &mdash; for specific laws</h4>
          <p class="mb-2 text-muted-foreground">Used for regulatory convenience in some laws such as the Military Service Act and Youth Protection Act.</p>
          <ul class="list-disc list-inside space-y-1 text-muted-foreground">
            <li><strong>Formula:</strong> Current year - Birth year</li>
            <li><strong>Feature:</strong> Everyone born in a given year has the same age regardless of birthday</li>
          </ul>
        </div>
      </div>
    `,
      usefulTips: `
      <div className="space-y-6">
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">International age unification law, what changed?</h3>
          <p class="mb-2 text-muted-foreground">
            The "International Age Unification Law," effective June 28, 2023, is a law stating that only international age may be used when calculating age in laws, contracts, and official documents.
          </p>
          <ul class="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Finance/Insurance:</strong> Pension eligibility and insurable ages are now clearly based on international age.</li>
            <li><strong>Medical/Welfare:</strong> Confusion over national health-check and welfare eligibility ages disappeared.</li>
            <li><strong>Administration/Law:</strong> All official documents and legal procedures follow international age in principle.</li>
            <li><strong>Caution:</strong> Some laws, such as the Elementary and Secondary Education Act (school-entry age), Military Service Act (draft age), and Youth Protection Act, still use year age.</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">So, when can you drink and smoke?</h3>
          <p class="text-muted-foreground">
            The Youth Protection Act defines a youth as "a person under year age 19." Therefore, from January 1 of the year you turn 19 by year age, you may purchase alcohol and tobacco.
            For example, someone born in 2005 is recognized as an adult from January 1, 2024, regardless of birthday.
          </p>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 class="font-semibold text-lg mb-2 text-foreground">Zodiac (12 Earthly Branches) calculation</h3>
          <p class="text-muted-foreground">
            The zodiac is determined by the remainder of the birth year divided by 12, in this order: Monkey(0), Rooster(1), Dog(2), Pig(3), Rat(4), Ox(5), Tiger(6), Rabbit(7), Dragon(8), Snake(9), Horse(10), Goat(11).
          </p>
        </div>
      </div>
    `
    }
  );


  return (
    <CalculatorsLayout
      title={isKo ? '한국 나이 계산기' : 'Korean Age Calculator'}
      description={isKo ? '생년월일과 연도를 입력하면 계산기가 한국 나이를 계산해 줍니다.' : "Enter your birth date and year, and the calculator computes your Korean age."}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default KoreanAgeCalculator;
