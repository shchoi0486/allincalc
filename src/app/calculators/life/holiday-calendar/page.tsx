'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Holiday {
  date: string;
  name: string;
  month: number;
  day: number;
}

const holidays2024: Holiday[] = [
  { date: '2024-01-01', name: '신정', month: 1, day: 1 },
  { date: '2024-02-09', name: '설날 (대체공휴일)', month: 2, day: 9 },
  { date: '2024-02-10', name: '설날', month: 2, day: 10 },
  { date: '2024-02-11', name: '설날', month: 2, day: 11 },
  { date: '2024-02-12', name: '설날 (대체공휴일)', month: 2, day: 12 },
  { date: '2024-03-01', name: '삼일절', month: 3, day: 1 },
  { date: '2024-04-10', name: '제22대 국회의원선거', month: 4, day: 10 },
  { date: '2024-05-05', name: '어린이날', month: 5, day: 5 },
  { date: '2024-05-06', name: '어린이날 (대체공휴일)', month: 5, day: 6 },
  { date: '2024-05-15', name: '부처님 오신 날', month: 5, day: 15 },
  { date: '2024-06-06', name: '현충일', month: 6, day: 6 },
  { date: '2024-08-15', name: '광복절', month: 8, day: 15 },
  { date: '2024-09-16', name: '추석', month: 9, day: 16 },
  { date: '2024-09-17', name: '추석', month: 9, day: 17 },
  { date: '2024-09-18', name: '추석 (대체공휴일)', month: 9, day: 18 },
  { date: '2024-10-03', name: '개천절', month: 10, day: 3 },
  { date: '2024-10-09', name: '한글날', month: 10, day: 9 },
  { date: '2024-12-25', name: '크리스마스', month: 12, day: 25 },
];

const holidays2025: Holiday[] = [
  { date: '2025-01-01', name: '신정', month: 1, day: 1 },
  { date: '2025-01-28', name: '설날', month: 1, day: 28 },
  { date: '2025-01-29', name: '설날', month: 1, day: 29 },
  { date: '2025-01-30', name: '설날', month: 1, day: 30 },
  { date: '2025-03-01', name: '삼일절', month: 3, day: 1 },
  { date: '2025-05-05', name: '어린이날', month: 5, day: 5 },
  { date: '2025-05-06', name: '부처님 오신 날', month: 5, day: 6 },
  { date: '2025-06-06', name: '현충일', month: 6, day: 6 },
  { date: '2025-08-15', name: '광복절', month: 8, day: 15 },
  { date: '2025-10-05', name: '추석', month: 10, day: 5 },
  { date: '2025-10-06', name: '추석', month: 10, day: 6 },
  { date: '2025-10-07', name: '추석', month: 10, day: 7 },
  { date: '2025-10-03', name: '개천절', month: 10, day: 3 },
  { date: '2025-10-09', name: '한글날', month: 10, day: 9 },
  { date: '2025-12-25', name: '크리스마스', month: 12, day: 25 },
];

const HolidayCalendar: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<2024 | 2025>(2024);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  const holidays = selectedYear === 2024 ? holidays2024 : holidays2025;

  const isHoliday = (month: number, day: number): Holiday | undefined => {
    return holidays.find((h) => h.month === month && h.day === day);
  };

  const getDaysInMonth = (year: number, month: number): number => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number): number => {
    return new Date(year, month - 1, 1).getDay();
  };

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월',
  ];

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const monthHolidays = holidays.filter((h) => h.month === selectedMonth);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-16">연도:</label>
        <div className="flex space-x-2">
          <Button
            variant={selectedYear === 2024 ? 'default' : 'outline'}
            onClick={() => setSelectedYear(2024)}
          >
            2024년
          </Button>
          <Button
            variant={selectedYear === 2025 ? 'default' : 'outline'}
            onClick={() => setSelectedYear(2025)}
          >
            2025년
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="w-16">월:</label>
        <div className="grid grid-cols-4 gap-2 flex-1">
          {monthNames.map((name, index) => (
            <Button
              key={index}
              variant={selectedMonth === index + 1 ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedMonth(index + 1)}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <Card>
        <CardHeader className="p-3">
          <CardTitle className="text-center text-lg">
            {selectedYear}년 {selectedMonth}월
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((day, index) => (
              <div
                key={`header-${index}`}
                className={`text-center text-sm font-semibold p-2 ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                }`}
              >
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} className="p-2" />;
              }

              const dayOfWeek = (firstDay + day - 1) % 7;
              const holiday = isHoliday(selectedMonth, day);

              return (
                <div
                  key={`day-${day}`}
                  className={`text-center p-2 rounded-lg text-sm transition-colors ${
                    holiday
                      ? 'bg-red-100 text-red-600 font-bold border-2 border-red-300'
                      : dayOfWeek === 0
                      ? 'text-red-500'
                      : dayOfWeek === 6
                      ? 'text-blue-500'
                      : 'text-gray-700'
                  }`}
                  title={holiday ? holiday.name : ''}
                >
                  {day}
                  {holiday && (
                    <div className="text-[10px] text-red-500 font-normal leading-tight mt-0.5">
                      {holiday.name.length > 4 ? holiday.name.substring(0, 4) + '..' : holiday.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {monthHolidays.length > 0 && (
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">
              {selectedMonth}월 공휴일 ({monthHolidays.length}개)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {monthHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium text-red-700">{holiday.name}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {holiday.month}월 {holiday.day}일
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm mb-2">{selectedYear}년 전체 공휴일 ({holidays.length}개)</h3>
          <div className="max-h-[200px] overflow-y-auto">
            <div className="space-y-1">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span className={holiday.month === selectedMonth ? 'font-bold text-red-600' : ''}>
                    {holiday.name}
                  </span>
                  <span className="text-muted-foreground">{holiday.date}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          대한민국 공휴일을 달력에서 한눈에 확인하세요!
        </p>
        <p>
          공휴일 캘린더는 대한민국의 법정 공휴일을 달력 형태로 표시하여
          각 공휴일의 날짜와 이름을 쉽고 빠르게 확인할 수 있는 도구입니다.
        </p>
        <p>
          2024년과 2025년의 공휴일 정보를 포함하고 있으며, 설날·추석·어린이날 등
          매년 고정된 공휴일부터 음력에 따른 변동 공휴일까지 모두 확인할 수 있습니다.
        </p>
        <p>
          연차 계획, 여행 일정, 택배 배송, 은행·관공서 운영 확인 등
          공휴일에 따라 달라지는 일상생활 정보를 미리 파악하는 데 유용하게 활용할 수 있습니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">대한민국 공휴일 목록 (2024-2025)</h3>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-primary">매년 고정 공휴일:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>신정 (1월 1일)</li>
              <li>삼일절 (3월 1일)</li>
              <li>어린이날 (5월 5일)</li>
              <li>현충일 (6월 6일)</li>
              <li>광복절 (8월 15일)</li>
              <li>개천절 (10월 3일)</li>
              <li>한글날 (10월 9일)</li>
              <li>크리스마스 (12월 25일)</li>
            </ul>
            <p className="mt-2 font-semibold text-primary">음력 기반 공휴일:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>설날 (음력 1월 1일 전후, 최대 3일 + 대체공휴일)</li>
              <li>부처님 오신 날 (음력 4월 8일)</li>
              <li>추석 (음력 8월 15일 전후, 최대 3일 + 대체공휴일)</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">공휴일 활용 핵심 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>대체공휴일 제도:</strong> 공휴일이 토요일이나 일요일과 겹치면 다음 평일이 대체공휴일로 지정될 수 있습니다. 2024년부터 대체공휴일 적용 범위가 확대되었습니다.</li>
            <li><strong>연차 활용 전략:</strong> 공휴일 전후로 연차를 사용하면 장기 휴가를 만들 수 있습니다. 공휴일과 이어지는 월요일이나 금요일에 연차를 내면 효과적입니다.</li>
            <li><strong>택배/배송:</strong> 공휴일에는 택배 배송이 지연될 수 있으므로 중요한 물건은 미리 주문하세요.</li>
            <li><strong>은행/관공서:</strong> 공휴일에는 대부분의 은행과 관공서가 운영하지 않으니 사전 확인이 필요합니다.</li>
            <li><strong>영업시간 변경:</strong> 공휴일에는 일반적으로 주말 영업시간으로 운영되며, 일부 매장은 휴무일 수 있습니다.</li>
            <li><strong>공공기관 민원:</strong> 공휴일에는 민원 접수 및 처리가 불가능하므로 업무 일정에 참고하세요.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="공휴일 캘린더"
      description="대한민국 공휴일을 확인합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default HolidayCalendar;
