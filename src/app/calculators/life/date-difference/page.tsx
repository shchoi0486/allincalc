'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomDatePickerWithPopover } from '@/components/ui/custom-date-picker';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

import { differenceInDays, differenceInMonths, differenceInYears, addDays, intervalToDuration } from 'date-fns';

const DateDifferenceCalculator: React.FC = () => {
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
      [start, end] = [end, start]; // Swap dates if end is before start
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
        <label htmlFor="startDate" className="w-24">시작일:</label>
        <CustomDatePickerWithPopover date={startDate} setDate={setStartDate} placeholder="시작일 선택" />
      </div>
      <div className="flex items-center space-x-4">
        <label htmlFor="endDate" className="w-24">종료일:</label>
        <CustomDatePickerWithPopover date={endDate} setDate={setEndDate} placeholder="종료일 선택" />
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="includeStartDate"
          checked={includeStartDate}
          onChange={(e) => setIncludeStartDate(e.target.checked)}
          className="form-checkbox"
        />
        <label htmlFor="includeStartDate">초일 산입</label>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateDateDifference}>계산</Button>
        <Button variant="secondary" onClick={resetFields}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = result && (
    <div className="mt-6 p-4 border rounded-md bg-gray-50">
      <h3 className="text-xl font-semibold mb-2">날짜차이 계산결과</h3>
      <p className="text-lg">
        총 기간은 <span className="font-bold text-blue-600">{result.totalYears}년 {result.totalMonths}개월 {result.totalDays}일</span> 이고,
      </p>
      <p className="text-lg">
        총 일수는 <span className="font-bold text-blue-600">{result.diffDays}일</span> 입니다.
      </p>
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div class="space-y-4">
        <p class="text-lg">날짜 차이 계산기는 두 특정 날짜 사이의 간격을 년, 월, 일 단위로 정확하게 계산해주는 강력하고 직관적인 도구입니다.</p>
        <p>여행 D-day 계산, 프로젝트 마감일 관리, 법적 효력이 발생하는 계약 기간 산정, 혹은 역사적 사건 사이의 기간을 알아보는 등 일상생활과 전문적인 업무 모두에서 필수적인 역할을 합니다. 시작일과 종료일을 선택하고 '초일산입' 여부만 결정하면, 복잡한 날짜 계산을 즉시 완료하여 시간과 노력을 절약할 수 있습니다.</p>
        <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 class="font-semibold text-md mb-2">주요 기능 및 특징:</h3>
          <ul class="list-disc list-inside space-y-1">
            <li><strong>정확한 기간 산출:</strong> 년, 월, 일을 모두 고려하여 두 날짜 사이의 총 기간을 정확하게 보여줍니다.</li>
            <li><strong>총 일수 변환:</strong> 전체 기간을 총 며칠인지로 환산하여 표시해 주므로, 다양한 기준으로 기간을 파악할 수 있습니다.</li>
            <li><strong>'초일산입' 옵션:</strong> 법률, 금융 등 전문 분야에서 중요한 '초일(첫날)' 포함 여부를 선택하여 계산의 정확도를 높일 수 있습니다.</li>
            <li><strong>사용자 친화적 인터페이스:</strong> 누구나 쉽게 날짜를 선택하고 버튼 클릭 한 번으로 결과를 확인할 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `,
    calculationFormula: `
      <div class="space-y-6">
        <div>
          <h3 class="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">날짜 차이 계산의 기술적 원리</h3>
          <p class="mb-4">이 계산기는 <strong>date-fns 라이브러리</strong>를 사용하여 날짜 계산의 정확성과 효율성을 보장합니다. <code>date-fns</code>는 모던 JavaScript 환경에 최적화된 날짜 유틸리티 라이브러리로, 각 함수가 순수 함수(pure function)로 이루어져 있어 예측 가능한 결과를 제공합니다.</p>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">1. 기간 계산 (년, 월, 일)</h3>
          <p class="mb-2">두 날짜 사이의 전체적인 '기간'을 계산하기 위해 <code>intervalToDuration</code> 함수를 사용합니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code class="text-sm">const duration = intervalToDuration({ start, end });</code>
          </div>
          <p class="mt-2">이 함수는 시작일(start)과 종료일(end)을 인자로 받아, 두 날짜 사이의 차이를 년(years), 월(months), 일(days) 단위로 나누어 객체 형태로 반환합니다. 예를 들어, 2023년 1월 15일과 2024년 3월 20일 사이의 기간은 { years: 1, months: 2, days: 5 } 와 같이 계산됩니다.</p>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">2. 총 일수 계산</h3>
          <p class="mb-2">전체 기간을 '일' 단위로만 환산하기 위해서는 <code>differenceInDays</code> 함수를 사용합니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code class="text-sm">let diffDays = differenceInDays(end, start);</code>
          </div>
          <p class="mt-2">이 함수는 두 날짜 사이의 전체 24시간 '일'의 차이를 계산합니다. 시간, 분, 초는 무시하고 오직 날짜만을 기준으로 계산하여 정수 값을 반환합니다.</p>
        </div>

        <div>
          <h3 class="font-semibold text-lg mb-2">3. 초일산입(初日算入) 처리</h3>
          <p class="mb-2">민법 원칙에 따라 기간 계산 시 첫날을 포함하지 않는 것이 일반적이지만, 계약이나 상황에 따라 첫날을 포함해야 할 경우가 있습니다. '초일산입' 옵션이 활성화되면, 계산된 총 일수에 1을 더하여 첫날을 기간에 포함시킵니다.</p>
          <div class="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code class="text-sm">
              if (includeStartDate) {<br/>
              &nbsp;&nbsp;diffDays += 1;<br/>
              }
            </code>
          </div>
          <p class="mt-2">이 간단한 조건문 추가를 통해 법률적, 행정적 요구사항에 맞는 정확한 기간 산정이 가능해집니다.</p>
        </div>
      </div>
    `,
    usefulTips: `
      <div class="space-y-6">
        <div class="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 class="font-semibold text-lg mb-2">💡 '초일산입' 완벽 이해하기</h3>
          <p class="mb-2">'초일산입'은 날짜 계산에서 가장 헷갈리는 부분 중 하나입니다. 쉽게 이해해 보세요.</p>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>원칙 (초일 불산입):</strong> 민법 제157조에 따라, 기간을 계산할 때 <strong>첫날은 포함하지 않는 것</strong>이 원칙입니다. 예를 들어, 1월 1일부터 3일간이라고 하면, 1월 2일, 3일, 4일을 의미하며 4일 자정에 기간이 만료됩니다.</li>
            <li><strong>예외 (초일 산입):</strong> 하지만, 기간이 <strong>오전 0시부터 시작</strong>하거나(예: 법령 시행일), <strong>나이를 계산</strong>할 때(출생일 포함), 또는 당사자 간의 <strong>계약으로 특별히 정한 경우</strong>에는 첫날을 포함하여 계산합니다.</li>
            <li><strong>이 계산기에서는:</strong> '초일산입' 체크박스를 통해 사용자가 직접 이 원칙을 적용할지 여부를 선택할 수 있습니다. 부동산 양도소득세 보유기간 계산 등 법적 기간 산정이 필요할 때 유용합니다.</li>
          </ul>
        </div>
        <div class="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 class="font-semibold text-lg mb-2">- 실생활 활용 예시 -</h3>
          <ul class="list-disc list-inside space-y-2">
            <li><strong>부동산 양도소득세:</strong> 비과세 혜택을 위한 '2년 보유' 기간을 계산할 때, 취득일(잔금 청산일 또는 등기 접수일 중 빠른 날)과 양도일 사이의 기간을 정확히 계산해야 합니다. 이때 초일산입 여부가 중요할 수 있습니다.</li>
            <li><strong>프로젝트 관리:</strong> 프로젝트 시작일과 마감일을 설정하여 총 진행 기간(일)을 파악하고, 이에 맞춰 일정을 효율적으로 분배할 수 있습니다.</li>
            <li><strong>이자 계산:</strong> 예금이나 대출의 이자 계산 기간을 산정할 때, 은행의 약관에 따라 초일산입 여부가 달라질 수 있으므로 정확한 계산이 필요합니다.</li>
            <li><strong>역사 공부:</strong> 특정 역사적 사건이 시작되고 끝난 날짜를 입력하여, 그 사건이 총 며칠, 몇 년간 지속되었는지 쉽게 알아볼 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="날짜차이 계산기"
      description="두 날짜 사이의 기간을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DateDifferenceCalculator;