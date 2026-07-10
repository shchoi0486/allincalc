'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

const timezones = [
  { id: 'UTC', label: 'UTC', offset: 0 },
  { id: 'US-Eastern', label: '미국 동부(EST/EDT)', offset: -5 },
  { id: 'US-Pacific', label: '미국 서부(PST/PDT)', offset: -8 },
  { id: 'Europe-London', label: '유럽 런던(GMT/BST)', offset: 0 },
  { id: 'Asia-Tokyo', label: '아시아 도쿄(JST)', offset: 9 },
  { id: 'Asia-Seoul', label: '아시아 서울(KST)', offset: 9 },
  { id: 'Asia-Shanghai', label: '아시아 상하이(CST)', offset: 8 },
] as const;

type TimezoneId = typeof timezones[number]['id'];

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

  const fromOffset = timezones.find((t) => t.id === fromTz)?.offset ?? 0;
  const utcTime = fromDate.getTime() - fromOffset * 60 * 60 * 1000;

  const results: Record<string, Date> = {};
  timezones.forEach((tz) => {
    results[tz.id] = new Date(utcTime + tz.offset * 60 * 60 * 1000);
  });

  return results as Record<TimezoneId, Date>;
}

function formatTimeWithZone(date: Date): string {
  if (isNaN(date.getTime())) return '-';
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일 ${hours}:${minutes}`;
}

function getDayOfWeek(date: Date): string {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  return days[date.getDay()];
}

export default function TimezoneConverter() {
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
        <label htmlFor="dateTime" className="w-24">날짜/시간:</label>
        <Input
          id="dateTime"
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="flex-grow"
        />
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="fromTz" className="w-24">기준 시간대:</label>
        <select
          id="fromTz"
          value={fromTimezone}
          onChange={(e) => setFromTimezone(e.target.value as TimezoneId)}
          className="border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring flex-grow"
        >
          {timezones.map((tz) => (
            <option key={tz.id} value={tz.id}>{tz.label} (UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})</option>
          ))}
        </select>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {timezones
        .filter((tz) => tz.id !== fromTimezone)
        .map((tz) => {
          const date = results[tz.id];
          return (
            <div key={tz.id} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <div>
                <span className="text-sm font-medium">{tz.label}</span>
                <span className="text-xs text-muted-foreground ml-2">(UTC{tz.offset >= 0 ? '+' : ''}{tz.offset})</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-primary">
                  {formatTimeWithZone(date ?? new Date(0))}
                </span>
                <span className="text-xs text-muted-foreground ml-2">
                  ({getDayOfWeek(date ?? new Date(0))})
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
          <strong>시간대 변환기</strong>는 전 세계 주요 시간대 간의 시간 변환을 제공하는 필수적인 도구입니다. UTC, 미국 동부/서부, 유럽 런던, 아시아 도쿄/서울/상하이 시간대를 지원하며, 날짜와 시간을 입력하면 다른 시간대로의 변환 결과를 즉시 확인할 수 있습니다.
        </p>
        <p>
          국제 비즈니스 미팅, 해외 여행, 원격 근무, 온라인 게임 등에서 시간대 변환이 필요할 때 활용할 수 있습니다. 특히 여러 국가에 흩어진 팀원들과의 협업 시 회의 시간을 조율하는 데 필수적인 도구입니다.
        </p>
        <p>
          이 변환기는 각 시간대의 UTC 오프셋을 기반으로 정확한 변환을 수행합니다. 시간대 선택 후 날짜와 시간을 입력하면 선택한 모든 시간대에서의 해당 시간을 동시에 보여주어, 어떤 시간대가 적절한지 한눈에 파악할 수 있습니다.
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          국제선 비행기 스케줄, 글로벌 금융 시장 거래 시간, 해외 이벤트 중계 등 시간대 변환이 필수적인 상황에서 이 도구를 활용하면 시간 계산으로 인한 실수를 예방할 수 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">시간대 변환 공식</h4>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-sm">대상 시간 = 원래 시간 + (대상 시간대 오프셋 - 원래 시간대 오프셋)</p>
            <div className="mt-4 text-sm space-y-1">
              <p className="text-center">시간대 오프셋 (UTC 기준):</p>
              <div className="font-mono text-xs space-y-1 mt-2">
                <p>UTC: +0</p>
                <p>미국 동부: -5 (서머타임: -4)</p>
                <p>미국 서부: -8 (서머타임: -7)</p>
                <p>런던: +0 (서머타임: +1)</p>
                <p>도쿄: +9</p>
                <p>서울: +9</p>
                <p>상하이: +8</p>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
          <strong>참고:</strong> 이 변환기는 표준 시간대 오프셋을 기준으로 합니다. 서머타임(DST)은 자동으로 적용되지 않으며, 필요 시 수동으로 오프셋을 조정해야 합니다.
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">핵심 개념</h4>
          <ul className="space-y-3">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">서머타임(DST) 이해하기</p>
              <p className="text-xs mt-1">
                많은 국가에서는 여름철에 시계를 1시간 앞당기는 서머타임을 실시합니다. 미국과 유럽은 3월~11월, 호주와 뉴질랜드는 반대 시기에 실시합니다. 한국과 일본은 서머타임을 실시하지 않습니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">국제 회의 시간 정하기</p>
              <p className="text-xs mt-1">
                여러 시간대의 참가자가 있는 회의는 보통 UTC를 기준으로 시간을 정합니다. 아시아-유럽 회의: UTC 08:00~10:00 / 아시아-미국 회의: UTC 17:00~19:00
              </p>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">활용 사례</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>국제 비즈니스:</strong> 여러 시간대에 걸친 팀 미팅 시간 조율</li>
            <li><strong>여행:</strong> 출발지와 도착지의 시간 차이 사전 확인</li>
            <li><strong>금융:</strong> 뉴욕, 런던, 도쿄 증시 거래 시간 확인</li>
            <li><strong>온라인 게임:</strong> 글로벌 서버 이벤트 시간 확인</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="시간대 변환기"
      description="전 세계 주요 시간대 간의 시간을 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
