'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


const AnniversaryCalculator = () => {
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
          <TabsTrigger value="wedding">결혼기념일</TabsTrigger>
          <TabsTrigger value="relationship">사귄날</TabsTrigger>
          <TabsTrigger value="other">기타</TabsTrigger>
        </TabsList>
        <TabsContent value="wedding">
          <div className="flex items-center space-x-4 mt-4">
            <label htmlFor="baseDate" className="w-24">날짜:</label>
            <CustomDatePickerWithPopover
              date={new Date(baseDate)}
              setDate={(date) => date && setBaseDate(date.toISOString().split('T')[0])}
            />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center space-x-4">
        <label htmlFor="todayDate" className="w-24">오늘 날짜:</label>
        <CustomDatePickerWithPopover
          date={new Date(todayDate)}
          setDate={(date) => date && setTodayDate(date.toISOString().split('T')[0])}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateAnniversary}>계산하기</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>다음 기념일:</span>
            <strong>{result.nextAnniversary}</strong>
          </div>
          <div className="flex justify-between">
            <span>다음 기념일까지:</span>
            <strong>{result.daysToNextAnniversary} 일</strong>
          </div>
          <div className="flex justify-between">
            <span>함께한 시간:</span>
            <strong>{result.totalYears} 년, {result.totalMonths} 개월, {result.totalDays} 일</strong>
          </div>
          <div className="flex justify-between">
            <span>햇수:</span>
            <strong>{result.totalYears} 년</strong>
          </div>
          <div className="flex justify-between">
            <span>개월수:</span>
            <strong>{result.totalYears * 12 + result.totalMonths} 개월</strong>
          </div>
          <div className="flex justify-between">
            <span>주수:</span>
            <strong>{result.diffWeeks} 주</strong>
          </div>
          <div className="flex justify-between">
            <span>일수:</span>
            <strong>{result.diffDays} 일</strong>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div class="space-y-4">
        <p class="text-lg">기념일 계산기는 두 사람의 소중한 첫 만남, 결혼기념일, 아기의 백일이나 돌, 혹은 잊지 말아야 할 중요한 계약일까지, 삶의 모든 특별한 순간을 기억하고 기념할 수 있도록 도와주는 편리한 도구입니다.</p>
        <p>단순히 날짜만 계산하는 것을 넘어, 그날이 갖는 의미를 되새기고 앞으로 다가올 기념일을 미리 준비하며 설렘을 더할 수 있습니다. 기준일과 오늘 날짜를 입력하기만 하면, 그동안 함께한 시간이 며칠, 몇 주, 몇 개월, 몇 년인지 한눈에 보여주며, 다음 기념일까지 남은 날짜도 정확하게 알려주어 특별한 날을 놓치지 않도록 도와줍니다.</p>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 class="font-semibold text-md mb-2">다양한 활용법:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>연인들을 위한 필수 앱:</strong> 사귄 날짜를 입력하고 100일, 200일, 1주년 등 각종 기념일을 쉽게 확인하세요.</li>
            <li><strong>부모님을 위한 육아 도우미:</strong> 아기가 태어난 날을 기준으로 50일, 100일 촬영 등 성장 이벤트를 관리할 수 있습니다.</li>
            <li><strong>중요한 계약 및 시험 관리:</strong> D-day 설정으로 중요한 시험이나 프로젝트 마감일을 체계적으로 준비할 수 있습니다.</li>
            <li><strong>개인적인 목표 설정:</strong> 금연이나 다이어트 시작일을 설정하고, 자신의 노력을 시간으로 확인하며 동기 부여를 얻을 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `,
    calculationFormula: `
      <div class="space-y-6">
        <div>
          <h3 class="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">기념일 계산의 핵심 원리</h3>
          <p class="mb-4">기념일 계산은 JavaScript의 <strong>Date 객체</strong>를 기반으로 이루어집니다. 사용자가 입력한 '기준일'과 '오늘 날짜'를 Date 객체로 변환한 후, 두 날짜 사이의 시간 차이를 밀리초(ms) 단위로 계산하는 것이 핵심입니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code class="text-sm">const diffTime = Math.abs(today.getTime() - base.getTime());</code>
          </div>
          <p class="mt-4"><code>getTime()</code> 메소드는 1970년 1월 1일 00:00:00 UTC로부터 경과된 시간을 밀리초로 반환합니다. 이 값을 이용해 총 경과일을 계산할 수 있습니다.</p>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">1. 총 경과 시간 계산</h3>
          <ul class="list-decimal list-inside space-y-2">
            <li><strong>총 경과일:</strong> <code>Math.ceil(diffTime / (1000 * 60 * 60 * 24))</code><br/>밀리초를 초(1000), 분(60), 시간(60), 일(24)로 나누어 계산합니다. <code>Math.ceil</code>을 사용하여 하루가 조금이라도 지났으면 1일로 계산합니다.</li>
            <li><strong>총 경과 주:</strong> <code>Math.floor(총 경과일 / 7)</code><br/>계산된 총 경과일을 7로 나누어 주 단위를 계산합니다.</li>
          </ul>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">2. "몇 년, 몇 개월, 며칠" 계산</h3>
          <p class="mb-2">단순히 날짜를 나누는 것만으로는 정확한 개월 수를 계산하기 어렵습니다. 각 달의 일수가 다르기 때문입니다. 따라서 다음과 같은 단계로 계산합니다.</p>
          <ol class="list-decimal list-inside space-y-2 pl-4">
            <li><strong>연도 차이 계산:</strong> <code>today.getFullYear() - base.getFullYear()</code></li>
            <li><strong>월 차이 계산:</strong> <code>today.getMonth() - base.getMonth()</code></li>
            <li><strong>일 차이 계산:</strong> <code>today.getDate() - base.getDate()</code></li>
            <li><strong>정확도 보정:</strong>
              <ul class="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>일(day) 차이가 음수일 경우, 월(month)에서 1을 빼고 이전 달의 마지막 날짜를 더해줍니다.</li>
                <li>월(month) 차이가 음수일 경우, 연(year)에서 1을 빼고 12개월을 더해줍니다.</li>
              </ul>
            </li>
          </ol>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">3. 다음 기념일 계산</h3>
          <p class="mb-2">다음 기념일은 기준일의 연도를 현재 연도로 설정하는 것부터 시작합니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code class="text-sm">
              const nextAnniversary = new Date(base);<br/>
              nextAnniversary.setFullYear(today.getFullYear());
            </code>
          </div>
          <p class="mt-2">만약 이렇게 설정된 날짜가 이미 지났다면(<code>nextAnniversary < today</code>), 연도를 1년 더해 다음 해의 기념일을 목표로 설정합니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
            <code class="text-sm">
              if (nextAnniversary < today) {<br/>
              &nbsp;&nbsp;nextAnniversary.setFullYear(today.getFullYear() + 1);<br/>
              }
            </code>
          </div>
          <p class="mt-2">마지막으로, 오늘부터 다음 기념일까지 남은 날짜(D-day)는 두 날짜의 차이를 다시 일 단위로 계산하여 구합니다.</p>
        </div>
      </div>
    `,
    usefulTips: `
      <div class="space-y-6">
        <div class="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 class="font-semibold text-lg mb-2">💡 기념일을 더 특별하게 만드는 팁</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>주년(週年) 기념일 챙기기:</strong> 1주년, 2주년 같은 '연' 단위 기념일 외에도, '1000일' 혹은 '2000일' 같은 '일' 단위 기념일은 색다른 특별함을 선사합니다. 계산기를 통해 다음 n천일 기념일을 미리 확인하고 이벤트를 준비해보세요.</li>
            <li><strong>포토북 제작:</strong> 1년 혹은 특정 기간 동안의 사진을 모아 포토북을 만들어보세요. 함께한 시간의 흐름을 시각적으로 되돌아보는 것은 큰 감동을 줍니다.</li>
            <li><strong>타임캡슐 만들기:</strong> 기념일에 서로에게 편지를 쓰거나, 의미 있는 물건을 함께 타임캡슐에 넣어보세요. 다음 기념일에 함께 열어보면 소중한 추억이 될 것입니다.</li>
            <li><strong>음력 기념일 확인:</strong> 부모님 생신 등 음력으로 기념일을 챙겨야 할 경우, 양력으로 변환하여 계산기에 입력해야 정확한 계산이 가능합니다. 포털 사이트의 '음력 변환기'를 활용하세요.</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 class="font-semibold text-lg mb-2">📅 D-Day 활용법</h3>
          <p>기념일 계산기는 D-Day 카운터로도 훌륭하게 활용될 수 있습니다.</p>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>시험/자격증 준비:</strong> 중요한 시험 날짜를 기준일로 설정하고, 남은 시간을 효율적으로 관리하세요. '며칠 남았지?'라는 초조함 대신 체계적인 계획을 세울 수 있습니다.</li>
            <li><strong>여행 계획:</strong>待ちに待った旅行 출발일을 D-Day로 설정하고 설렘을 즐겨보세요. 남은 날짜에 맞춰 준비물을 챙기고 일정을 계획하는 데 도움이 됩니다.</li>
            <li><strong>출산 예정일:</strong> 아기를 만날 날을 기준일로 설정하여, 남은 기간 동안 출산 준비를 차근차근 진행할 수 있습니다.</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20">
          <h3 class="font-semibold text-lg mb-2">⚠️ 주의사항</h3>
          <p>날짜 계산 시 '만 나이'와 '한국식 나이'처럼 계산 기준에 따라 결과가 달라질 수 있습니다. 본 기념일 계산기는 국제 표준에 따라 날짜와 시간의 차이를 기반으로 계산하며, '첫날을 포함하는지' 여부(예: D-Day vs D+1)는 사용자가 목적에 맞게 하루를 가감하여 해석하는 것이 좋습니다. 예를 들어, 오늘부터 1일이라고 계산하고 싶다면 결과값에 +1을 하여 생각할 수 있습니다.</p>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="기념일 계산기"
      description="특별한 날로부터 얼마나 지났는지 계산해보세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default AnniversaryCalculator;