'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

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
  const { dict, locale } = useI18n();
  const t = dict.holidayCalendar;
  const isKo = locale === 'ko';

  const monthNames = isKo
    ? ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = isKo
    ? ['일', '월', '화', '수', '목', '금', '토']
    : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const holidayNamesEn: Record<string, string> = {
    '2024-01-01': "New Year's Day",
    '2024-02-09': 'Lunar New Year (Substitute)',
    '2024-02-10': 'Lunar New Year (Seollal)',
    '2024-02-11': 'Lunar New Year (Seollal)',
    '2024-02-12': 'Lunar New Year (Substitute)',
    '2024-03-01': 'Independence Movement Day',
    '2024-04-10': '22nd National Assembly Election',
    '2024-05-05': "Children's Day",
    '2024-05-06': "Children's Day (Substitute)",
    '2024-05-15': "Buddha's Birthday",
    '2024-06-06': 'Memorial Day',
    '2024-08-15': 'Liberation Day',
    '2024-09-16': 'Chuseok (Harvest Festival)',
    '2024-09-17': 'Chuseok (Harvest Festival)',
    '2024-09-18': 'Chuseok (Substitute)',
    '2024-10-03': 'National Foundation Day',
    '2024-10-09': 'Hangul Day',
    '2024-12-25': 'Christmas',
    '2025-01-01': "New Year's Day",
    '2025-01-28': 'Lunar New Year (Seollal)',
    '2025-01-29': 'Lunar New Year (Seollal)',
    '2025-01-30': 'Lunar New Year (Seollal)',
    '2025-03-01': 'Independence Movement Day',
    '2025-05-05': "Children's Day",
    '2025-05-06': "Buddha's Birthday",
    '2025-06-06': 'Memorial Day',
    '2025-08-15': 'Liberation Day',
    '2025-10-05': 'Chuseok (Harvest Festival)',
    '2025-10-06': 'Chuseok (Harvest Festival)',
    '2025-10-07': 'Chuseok (Substitute)',
    '2025-10-03': 'National Foundation Day',
    '2025-10-09': 'Hangul Day',
    '2025-12-25': 'Christmas',
  };

  const holidayName = (h: Holiday): string => isKo ? h.name : (holidayNamesEn[h.date] ?? h.name);
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
        <label className="w-16">{t.yearLabel}</label>
        <div className="flex space-x-2">
          <Button
            variant={selectedYear === 2024 ? 'default' : 'outline'}
            onClick={() => setSelectedYear(2024)}
          >
            {isKo ? '2024년' : '2024'}
          </Button>
          <Button
            variant={selectedYear === 2025 ? 'default' : 'outline'}
            onClick={() => setSelectedYear(2025)}
          >
            {isKo ? '2025년' : '2025'}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <label className="w-16">{t.monthLabel}</label>
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

  const fullWidthSection = (
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
            title={holiday ? holidayName(holiday) : ''}
          >
            {day}
            {holiday && (
              <div className="text-[10px] text-red-500 font-normal leading-tight mt-0.5">
                {(() => {
                  const name = holidayName(holiday);
                  const limit = isKo ? 4 : 9;
                  return name.length > limit ? name.substring(0, limit) + '..' : name;
                })()}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {monthHolidays.length > 0 && (
        <Card>
          <CardHeader className="p-3">
            <CardTitle className="text-sm">
              {t.monthHolidays.replace('{month}', String(selectedMonth)).replace('{count}', String(monthHolidays.length))}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3">
            <div className="space-y-2">
              {monthHolidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                  <div>
                    <span className="font-medium text-red-700">{holidayName(holiday)}</span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {isKo ? `${holiday.month}월 ${holiday.day}일` : `${holiday.month}/${holiday.day}`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-3">
          <h3 className="font-semibold text-sm mb-2">{t.yearHolidays.replace('{year}', String(selectedYear)).replace('{count}', String(holidays.length))}</h3>
          <div className="max-h-[200px] overflow-y-auto">
            <div className="space-y-1">
              {holidays.map((holiday, index) => (
                <div key={index} className="flex items-center justify-between text-sm py-1 border-b last:border-0">
                  <span className={holiday.month === selectedMonth ? 'font-bold text-red-600' : ''}>
                    {holidayName(holiday)}
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
    calculatorDescription: t.descriptionContent,
    calculationFormula: t.formulaContent,
    usefulTips: t.tipsContent,
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      fullWidthSection={fullWidthSection}
      fullWidthTitle={isKo ? `${selectedYear}년 ${selectedMonth}월` : `${selectedYear} ${monthNames[selectedMonth - 1]}`}
      infoSection={infoSection}
    />
  );
};

export default HolidayCalendar;
