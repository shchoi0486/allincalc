'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const timezoneIds = ['UTC', 'US-Eastern', 'US-Pacific', 'Europe-London', 'Asia-Tokyo', 'Asia-Seoul', 'Asia-Shanghai'] as const;
type TimezoneId = typeof timezoneIds[number];

const timezoneOffsets: Record<TimezoneId, number> = {
  UTC: 0,
  'US-Eastern': -5,
  'US-Pacific': -8,
  'Europe-London': 0,
  'Asia-Tokyo': 9,
  'Asia-Seoul': 9,
  'Asia-Shanghai': 8,
};

function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function convertTimezone(
  dateStr: string,
  fromTz: TimezoneId,
): Record<TimezoneId, Date> {
  if (!dateStr) return {} as Record<TimezoneId, Date>;

  const fromDate = new Date(dateStr);
  if (isNaN(fromDate.getTime())) return {} as Record<TimezoneId, Date>;

  const fromOffset = timezoneOffsets[fromTz] ?? 0;
  const utcTime = fromDate.getTime() - fromOffset * 60 * 60 * 1000;

  const results: Record<string, Date> = {};
  timezoneIds.forEach((tz) => {
    results[tz] = new Date(utcTime + timezoneOffsets[tz] * 60 * 60 * 1000);
  });

  return results as Record<TimezoneId, Date>;
}

function formatTimeWithZone(date: Date, isKo: boolean): string {
  if (isNaN(date.getTime())) return '-';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return isKo ? `${month}월 ${day}일 ${hours}:${minutes}` : `${month}/${day} ${hours}:${minutes}`;
}

function getDayOfWeek(date: Date, isKo: boolean): string {
  const daysKo = ['일', '월', '화', '수', '목', '금', '토'];
  const daysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return isKo ? daysKo[date.getDay()] : daysEn[date.getDay()];
}

export default function TimezoneConverter() {
  const { dict, locale } = useI18n();
  const t = dict.timezoneConverter;
  const isKo = locale === 'ko';

  const [dateTime, setDateTime] = useState(formatDateTime(new Date()));
  const [fromTimezone, setFromTimezone] = useState<TimezoneId>('UTC');
  const [results, setResults] = useState<Record<TimezoneId, Date>>({} as Record<TimezoneId, Date>);

  useEffect(() => {
    if (dateTime) {
      setResults(convertTimezone(dateTime, fromTimezone));
    }
  }, [dateTime, fromTimezone]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="dateTime" className="w-24">{t.inputLabel}</label>
        <Input
          id="dateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="flex-grow"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="fromTz" className="w-24">{t.baseTimezoneLabel}</label>
        <select
          id="fromTz"
          value={fromTimezone}
          onChange={(e) => setFromTimezone(e.target.value as TimezoneId)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring flex-grow"
        >
          {timezoneIds.map((tz) => (
            <option key={tz} value={tz}>{t.timezoneNames[tz]} (UTC{timezoneOffsets[tz] >= 0 ? '+' : ''}{timezoneOffsets[tz]})</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {timezoneIds
        .filter((tz) => tz !== fromTimezone)
        .map((tz) => {
          const date = results[tz];
          const offset = timezoneOffsets[tz];
          return (
            <div key={tz} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <span className="text-sm font-medium">{t.timezoneNames[tz]}</span>
                <span className="text-xs text-muted-foreground ml-2">(UTC{offset >= 0 ? '+' : ''}{offset})</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">
                  {formatTimeWithZone(date ?? new Date(0), isKo)}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({getDayOfWeek(date ?? new Date(0), isKo)})
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.calculatorDescription.p1}</strong>
        </p>
        <p>
          {t.calculatorDescription.p2}
        </p>
        <p>
          {t.calculatorDescription.p3}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {t.calculatorDescription.note}
        </p>
        <TermGlossary items={[
          { term: t.glossary[0].term, desc: t.glossary[0].desc },
          { term: t.glossary[1].term, desc: t.glossary[1].desc },
          { term: t.glossary[2].term, desc: t.glossary[2].desc },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{t.formulaTitle}</h4>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-sm">{t.formulaExample}</p>
            <div className="mt-4 text-sm space-y-1">
              <p className="text-center font-mono text-xs">{t.formulaResult}</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>{t.calculatorDescription.note}</strong>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{t.tips.title1}</h4>
          <ul className="space-y-3">
            {t.tips.items1.map((item, i) => (
              <li key={i} className="p-3 bg-muted rounded-lg border-l-4 border-primary">
                <p className="text-sm">{item}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{t.tips.title2}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items2.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      variant="split"
      infoSection={infoSection}
    />
  );
}
