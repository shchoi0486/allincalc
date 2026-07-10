'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, parse, isBefore, isAfter, addYears, differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

const KoreanAgeCalculator = () => {
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
        alert('출생일을 입력해주세요.');
        return;
      }
      calculateFromBirthDate(birthDate);
    } else if (calculationMethod === 'birthYear') {
      if (!birthYear) {
        alert('출생 연도를 입력해주세요.');
        return;
      }
      calculateFromBirthYear(Number(birthYear));
    } else {
      if (currentAge === '') {
        alert('현재 나이를 입력해주세요.');
        return;
      }
      if (hasBirthdayPassed === null) {
        alert('생일 지남 여부를 선택해주세요.');
        return;
      }
      calculateFromCurrentAge(Number(currentAge), hasBirthdayPassed);
    }
  };

  const calculateFromBirthDate = (birthDate: Date) => {
    const today = new Date();
    const birthYear = birthDate.getFullYear();
    
    // 한국 나이 (세는나이)
    const koreanAge = currentYear - birthYear + 1;
    
    // 만 나이 (국제 표준)
    let internationalAge = currentYear - birthYear;
    const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (isAfter(today, thisYearBirthday)) {
      internationalAge--;
    }
    
    // 연 나이
    const yearAge = currentYear - birthYear;
    
    // 살아온 일수
    const daysLived = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // 다음 생일
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (isAfter(today, nextBirthday)) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }
    
    // 띠 계산
    const zodiacSigns = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
    const zodiac = zodiacSigns[birthYear % 12];
    
    // 법적 권한 확인
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
    
    // 띠 계산
    const zodiacSigns = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
    const zodiac = zodiacSigns[birthYear % 12];
    
    // 법적 권한 확인
    const isAdult = internationalAge >= 19;
    const canVote = internationalAge >= 18;
    const canDrink = internationalAge >= 19;

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      daysLived: 0, // 출생일을 모르므로 0으로 설정
      nextBirthday: '알 수 없음',
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
    
    // 띠 계산
    const zodiacSigns = ['원숭이', '닭', '개', '돼지', '쥐', '소', '호랑이', '토끼', '용', '뱀', '말', '양'];
    const zodiac = zodiacSigns[birthYear % 12];
    
    // 법적 권한 확인
    const isAdult = internationalAge >= 19;
    const canVote = internationalAge >= 18;
    const canDrink = internationalAge >= 19;

    setResult({
      koreanAge,
      internationalAge,
      yearAge,
      daysLived: 0, // 출생일을 모르므로 0으로 설정
      nextBirthday: '알 수 없음',
      zodiac,
      isAdult,
      canVote,
      canDrink
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label htmlFor="calculationMethod" className="w-24">계산 방식:</label>
        <Select onValueChange={(value: 'birthDate' | 'birthYear' | 'currentAge') => setCalculationMethod(value)} value={calculationMethod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="계산 방식 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthDate">출생일로 계산</SelectItem>
            <SelectItem value="birthYear">출생 연도로 계산</SelectItem>
            <SelectItem value="currentAge">현재 나이로 계산</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {calculationMethod === 'birthDate' ? (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <label htmlFor="birthDate" className="w-24">출생일:</label>
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
            <label htmlFor="currentYear" className="w-24">현재 연도:</label>
            <Input id="currentYear" type="number" value={currentYear} disabled className="bg-gray-100 text-gray-500 cursor-not-allowed w-[180px]" />
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="birthYear" className="w-24">출생 연도:</label>
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
            <label htmlFor="hasBirthdayPassed" className="w-24">생일 지남:</label>
            <Select onValueChange={(value) => setHasBirthdayPassed(value === 'yes')}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="올해 생일이 지났나요?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">예</SelectItem>
                <SelectItem value="no">아니오</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <label htmlFor="currentAge" className="w-24">현재 나이:</label>
            <Input
              id="currentAge"
              type="number"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              placeholder="만 나이"
              className="w-[180px]"
              min={0}
              max={120}
            />
          </div>
        </div>
      )}
      <Button onClick={calculateKoreanAge} className="self-start">계산</Button>
    </div>
  );

  const resultSection = (
    result ? (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2">한국 나이</h3>
            <p className="text-2xl font-bold text-blue-600">{result.koreanAge}세</p>
            <p className="text-sm text-blue-600 mt-1">(출생 시 1세, 매년 1월 1일 +1세)</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">만 나이</h3>
            <p className="text-2xl font-bold text-green-600">{result.internationalAge}세</p>
            <p className="text-sm text-green-600 mt-1">(생일 기준, 국제 표준)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2">연 나이</h3>
            <p className="text-2xl font-bold text-purple-600">{result.yearAge}세</p>
            <p className="text-sm text-purple-600 mt-1">(연도 차이만 계산)</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-2">띠</h3>
            <p className="text-2xl font-bold text-orange-600">{result.zodiac}띠</p>
            <p className="text-sm text-orange-600 mt-1">(12간지)</p>
          </div>
        </div>

        {result.daysLived > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-gray-800 mb-2">살아온 일수</h3>
            <p className="text-2xl font-bold text-gray-600">{result.daysLived.toLocaleString()}일</p>
          </div>
        )}

        {result.nextBirthday !== '알 수 없음' && (
          <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
            <h3 className="font-semibold text-pink-800 mb-2">다음 생일</h3>
            <p className="text-2xl font-bold text-pink-600">{format(result.nextBirthday as Date, 'yyyy년 MM월 dd일')}</p>
            <p className="text-sm text-pink-600 mt-1">까지 {Math.ceil(((result.nextBirthday as Date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}일 남음</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-3 rounded-lg border ${result.isAdult ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <h3 className="font-semibold mb-1">성인 여부</h3>
            <p className={`text-lg font-bold ${result.isAdult ? 'text-green-600' : 'text-red-600'}`}>
              {result.isAdult ? '성인' : '미성년자'}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${result.canVote ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-1">투표 가능</h3>
            <p className={`text-lg font-bold ${result.canVote ? 'text-blue-600' : 'text-gray-600'}`}>
              {result.canVote ? '가능' : '불가능'}
            </p>
          </div>
          <div className={`p-3 rounded-lg border ${result.canDrink ? 'bg-purple-50 border-purple-200' : 'bg-gray-50 border-gray-200'}`}>
            <h3 className="font-semibold mb-1">음주 가능</h3>
            <p className={`text-lg font-bold ${result.canDrink ? 'text-purple-600' : 'text-gray-600'}`}>
              {result.canDrink ? '가능' : '불가능'}
            </p>
          </div>
        </div>
      </div>
    ) : (
      <div className="flex items-center justify-center text-muted-foreground h-full">
        계산하기 버튼을 눌러주세요
      </div>
    )
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg"><strong>"대체 제 나이가 몇 살이죠?"</strong> 한국의 복잡한 나이 계산법 때문에 한 번쯤은 가져봤을 의문입니다. 한국 나이 계산기는 이러한 혼란을 명쾌하게 해결해주는 도구입니다.</p>
        <p>2023년 6월, 대한민국은 사회적, 행정적 혼란을 줄이기 위해 <strong>'만 나이'로 법적 기준을 통일</strong>했습니다. 하지만 여전히 일상에서는 태어나자마자 한 살이 되고 매년 1월 1일에 한 살씩 더 먹는 '세는 나이'가 관습적으로 사용되고 있습니다. 이 계산기는 법적 기준인 '만 나이'는 물론, '세는 나이'와 병역법 등 일부 법률에서 사용하는 '연 나이'까지 세 가지 나이를 한 번에 계산하여 보여줍니다.</p>
        <p>단순한 나이 계산을 넘어, 자신의 띠(12간지), 법적 성인 여부, 투표 및 음주 가능 여부 등 나이와 관련된 다양한 정보를 종합적으로 제공하여 사용자의 궁금증을 완벽하게 해소해 드립니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <h3 className="font-semibold text-xl mb-4 border-b-2 border-gray-200 pb-2">세 가지 나이, 어떻게 계산될까요?</h3>
        
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h4 className="font-semibold text-lg mb-2">1. 만 나이 (International Age) - 법적 표준</h4>
          <p className="mb-2">전 세계 공통으로 사용하는 국제 표준 나이 계산법이며, 2023년 6월부터 대한민국의 법적, 행정적 기준이 되었습니다.</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>계산법:</strong> 현재 연도에서 출생 연도를 뺀 후, 생일이 지났으면 그대로, 지나지 않았으면 1을 더 뺍니다.</li>
            <li><strong>공식:</strong> <code>(현재 연도 - 출생 연도) - (생일 지남 여부에 따라 0 또는 1)</code></li>
            <li><strong>특징:</strong> 출생 시 0세로 시작하며, 매년 생일이 돌아올 때마다 1세씩 증가합니다. 가장 정확하고 합리적인 계산법입니다.</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
          <h4 className="font-semibold text-lg mb-2">2. 세는 나이 (Korean Age) - 전통적 관습</h4>
          <p className="mb-2">한국에서 전통적으로 사용해 온 나이 계산법으로, 주로 비공식적인 관계나 사회적 서열을 따질 때 사용됩니다.</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>계산법:</strong> 현재 연도에서 출생 연도를 뺀 후, 1을 더합니다.</li>
            <li><strong>공식:</strong> <code>현재 연도 - 출생 연도 + 1</code></li>
            <li><strong>특징:</strong> 태어나자마자 1세가 되며, 해가 바뀔 때마다(매년 1월 1일) 모든 사람이 함께 1세씩 증가합니다. 생일과 관계없이 나이가 변동됩니다.</li>
          </ul>
        </div>

        <div className="p-4 rounded-lg border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20">
          <h4 className="font-semibold text-lg mb-2">3. 연 나이 (Year Age) - 특정 법률용</h4>
          <p className="mb-2">주로 병역법, 청소년 보호법 등 일부 법률에서 규제의 편의성을 위해 사용하는 나이 계산법입니다.</p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>계산법:</strong> 현재 연도에서 출생 연도를 뺍니다.</li>
            <li><strong>공식:</strong> <code>현재 연도 - 출생 연도</code></li>
            <li><strong>특징:</strong> 생일과 관계없이, 특정 연도에 태어난 모든 사람을 같은 나이로 간주합니다. 예를 들어, 2024년에는 2005년생 모두가 '연 나이'로 19세가 됩니다.</li>
          </ul>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">만 나이 통일법, 무엇이 달라졌을까요?</h3>
          <p className="mb-2">2023년 6월 28일부터 시행된 '만 나이 통일법'은 법률, 계약, 공문서 등에서 나이를 계산할 때 '만 나이'만을 사용하도록 명시한 법입니다. 이로 인해 발생하는 주요 변경점은 다음과 같습니다.</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>금융/보험:</strong> 연금 수령 시점, 보험 가입 가능 연령 등이 모두 '만 나이' 기준으로 명확해졌습니다.</li>
            <li><strong>의료/복지:</strong> 국가 건강검진, 복지 혜택 수급 연령 기준의 혼선이 사라졌습니다.</li>
            <li><strong>행정/법률:</strong> 모든 공문서와 법적 절차에서 나이 표기는 '만 나이'를 원칙으로 합니다.</li>
            <li><strong>주의! 계속 '연 나이'를 사용하는 경우:</strong> <span className="font-semibold">초중등교육법(취학 연령), 병역법(징병검사 연령), 청소년보호법(청소년 정의)</span> 등 일부 법률에서는 여전히 '연 나이'를 기준으로 하므로 주의가 필요합니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <h3 className="font-semibold text-lg mb-2">그래서, 술과 담배는 언제부터?</h3>
          <p>청소년 보호법에서는 청소년을 "<strong>'연 나이' 19세 미만</strong>인 사람"으로 규정합니다. 따라서, '연 나이'로 19세가 되는 해의 <strong>1월 1일부터</strong> 술과 담배 구매가 가능합니다. 예를 들어, 2005년생은 생일과 관계없이 2024년 1월 1일부터 성인으로 인정받아 주류 및 담배 구매가 가능합니다.</p>
        </div>
      </div>
    `
  };


  return (
    <CalculatorsLayout
      title="한국 나이 계산기"
      description="생년월일과 연도를 입력하면 계산기가 한국 나이를 계산해 줍니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default KoreanAgeCalculator;