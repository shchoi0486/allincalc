'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

function timeToMinutes(time: string): number {
  const parts = time.split(':').map(Number);
  if (parts.length >= 2 && parts.every(p => !isNaN(p))) {
    return parts[0] * 60 + parts[1] + (parts.length === 3 ? parts[2] / 60 : 0);
  }
  return NaN;
}

function formatMinutes(mins: number, isKo: boolean = true): string {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.round(Math.abs(mins) % 60);
  return isKo ? `${h}시간 ${m}분` : `${h}h ${m}m`;
}

export default function HoursCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [clockIn, setClockIn] = useState('09:00');
  const [clockOut, setClockOut] = useState('18:00');
  const [breakMinutes, setBreakMinutes] = useState('60');
  const [workDays, setWorkDays] = useState('5');
  const [holidayHours, setHolidayHours] = useState('');
  const [nightStart, setNightStart] = useState('22:00');
  const [nightEnd, setNightEnd] = useState('06:00');
  const [baseHourlyWage, setBaseHourlyWage] = useState('10030');
  const [result, setResult] = useState<any>(null);

  const calculate = useCallback(() => {
    const inMin = timeToMinutes(clockIn);
    const outMin = timeToMinutes(clockOut);
    const brk = parseFloat(breakMinutes) || 0;
    const days = parseInt(workDays) || 0;
    const nightS = timeToMinutes(nightStart);
    const nightE = timeToMinutes(nightEnd);
    const hourlyWage = parseFloat(baseHourlyWage) || 10030;
    const holidayMinInput = parseFloat(holidayHours) || 0;

    if (isNaN(inMin) || isNaN(outMin) || days <= 0) { setResult(null); return; }

    let totalMin = outMin - inMin;
    if (totalMin < 0) totalMin += 24 * 60;
    totalMin -= brk;

    const dailyBaseLimit = 8 * 60;
    const dailyOvertimeLimit = 4 * 60;

    let baseMin = Math.min(totalMin, dailyBaseLimit);
    let overtimeMin = Math.min(Math.max(0, totalMin - dailyBaseLimit), dailyOvertimeLimit);

    let nightMin = 0;
    if (nightS !== nightE && totalMin > 0) {
      const nightStartMin = nightS;
      const nightEndMin = nightE;
      if (nightStartMin > nightEndMin) {
        if (inMin < nightStartMin && outMin > nightStartMin) {
          nightMin = Math.min(outMin, nightEndMin + 24 * 60) - nightStartMin;
        } else if (inMin >= nightStartMin || outMin <= nightEndMin) {
          nightMin = outMin > nightStartMin ? Math.min(outMin, nightEndMin + 24 * 60) - nightStartMin : 0;
        }
      } else {
        if (inMin < nightEndMin && outMin > nightStartMin) {
          nightMin = Math.min(outMin, nightEndMin) - nightStartMin;
        }
      }
      nightMin = Math.max(0, Math.min(nightMin, totalMin));
    }

    const dailyHolidayMin = holidayMinInput;
    const weeklyBaseMin = baseMin * days;
    const weeklyOvertimeMin = overtimeMin * days;
    const weeklyTotalMin = totalMin * days;
    const weeklyHolidayMin = dailyHolidayMin * days;

    const basePay = Math.round((baseMin / 60) * hourlyWage);
    const overtimePay = Math.round((overtimeMin / 60) * hourlyWage * 1.5);
    const nightPay = Math.round((nightMin / 60) * hourlyWage * 0.5);
    const holidayPay = Math.round((dailyHolidayMin / 60) * hourlyWage * 2.0);
    const totalPay = basePay + overtimePay + nightPay + holidayPay;
    const weeklyPay = totalPay * days;

    setResult({
      dailyBase: formatMinutes(baseMin, isKo),
      dailyOvertime: formatMinutes(overtimeMin, isKo),
      dailyNight: formatMinutes(nightMin, isKo),
      dailyHoliday: formatMinutes(dailyHolidayMin, isKo),
      dailyTotal: formatMinutes(totalMin, isKo),
      weeklyBase: formatMinutes(weeklyBaseMin, isKo),
      weeklyOvertime: formatMinutes(weeklyOvertimeMin, isKo),
      weeklyHoliday: formatMinutes(weeklyHolidayMin, isKo),
      weeklyTotal: formatMinutes(weeklyTotalMin, isKo),
      basePay,
      overtimePay,
      nightPay,
      holidayPay,
      totalPay,
      weeklyPay,
      baseMin,
      overtimeMin,
      nightMin,
      holidayMin: dailyHolidayMin,
      days,
    });
  }, [clockIn, clockOut, breakMinutes, workDays, holidayHours, nightStart, nightEnd, baseHourlyWage]);

  const reset = () => { setClockIn('09:00'); setClockOut('18:00'); setBreakMinutes('60'); setWorkDays('5'); setHolidayHours(''); setResult(null); };

  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{L('출근 시간', 'Clock In')}</Label>
          <Input type="time" value={clockIn} onChange={e => setClockIn(e.target.value)} />
        </div>
        <div>
          <Label>{L('퇴근 시간', 'Clock Out')}</Label>
          <Input type="time" value={clockOut} onChange={e => setClockOut(e.target.value)} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{L('휴게시간 (분)', 'Break (min)')}</Label>
          <Input type="number" value={breakMinutes} onChange={e => setBreakMinutes(e.target.value)} placeholder="60" />
        </div>
        <div>
          <Label>{L('근무일수 (주)', 'Work Days/Week')}</Label>
          <Input type="number" value={workDays} onChange={e => setWorkDays(e.target.value)} min="1" max="7" placeholder="5" />
        </div>
      </div>
      <div className="p-3 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-r-lg">
        <p className="text-sm font-semibold">{L('휴일근무 시간 (일)', 'Holiday Hours (daily)')}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {L('공휴일이나 유급휴일에 근무하는 경우 하루 기준 시간을 입력하세요. 휴일수당(200%)이 적용됩니다.', 'Enter daily hours worked on public/paid holidays. Holiday premium (200%) applies.')}
        </p>
        <Input type="number" value={holidayHours} onChange={e => setHolidayHours(e.target.value)} placeholder="0" className="mt-2" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>{L('야간 시작', 'Night Start')}</Label>
          <Input type="time" value={nightStart} onChange={e => setNightStart(e.target.value)} />
        </div>
        <div>
          <Label>{L('야간 종료', 'Night End')}</Label>
          <Input type="time" value={nightEnd} onChange={e => setNightEnd(e.target.value)} />
        </div>
      </div>
      <div>
        <Label>{L('기본 시급 (원)', 'Base Hourly Wage (KRW)')}</Label>
        <Input type="number" value={baseHourlyWage} onChange={e => setBaseHourlyWage(e.target.value)} placeholder="10030" />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculate} className="flex-1">{L('계산', 'Calculate')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{L('일간 근무시간', 'Daily Working Hours')}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span>{L('기본근무', 'Regular')}:</span><span className="font-mono">{result.dailyBase}</span></div>
              <div className="flex justify-between"><span>{L('연장근무', 'Overtime')}:</span><span className="font-mono">{result.dailyOvertime}</span></div>
              <div className="flex justify-between"><span>{L('야간근무', 'Night')}:</span><span className="font-mono">{result.dailyNight}</span></div>
              <div className="flex justify-between"><span>{L('휴일근무', 'Holiday')}:</span><span className="font-mono">{result.dailyHoliday}</span></div>
              <div className="flex justify-between font-bold"><span>{L('총 근무시간', 'Total')}:</span><span className="font-mono">{result.dailyTotal}</span></div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{L('주간 근무시간', 'Weekly Working Hours')}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex justify-between"><span>{L('기본근무', 'Regular')}:</span><span className="font-mono">{result.weeklyBase}</span></div>
              <div className="flex justify-between"><span>{L('연장근무', 'Overtime')}:</span><span className="font-mono">{result.weeklyOvertime}</span></div>
              <div className="flex justify-between"><span>{L('휴일근무', 'Holiday')}:</span><span className="font-mono">{result.weeklyHoliday}</span></div>
              <div className="flex justify-between font-bold"><span>{L('총 근무시간', 'Total')}:</span><span className="font-mono">{result.weeklyTotal}</span></div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{L('예상 급여 (일간)', 'Estimated Pay (Daily)')}</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between"><span>{L('기본급', 'Base')}:</span><span>₩{result.basePay.toLocaleString()}</span></div>
              <div className="flex justify-between"><span>{L('연장수당 (150%)', 'Overtime (150%)')}:</span><span>₩{result.overtimePay.toLocaleString()}</span></div>
              {result.nightPay > 0 && <div className="flex justify-between"><span>{L('야간수당 (50%)', 'Night (50%)')}:</span><span>₩{result.nightPay.toLocaleString()}</span></div>}
              {result.holidayPay > 0 && <div className="flex justify-between"><span>{L('휴일수당 (200%)', 'Holiday (200%)')}:</span><span>₩{result.holidayPay.toLocaleString()}</span></div>}
              <div className="flex justify-between font-bold border-t pt-1"><span>{L('일일 총급여', 'Daily Total')}:</span><span>₩{result.totalPay.toLocaleString()}</span></div>
            </div>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('주간 예상 급여', 'Weekly Estimated Pay')}</p>
            <p className="text-2xl font-bold text-primary">₩{result.weeklyPay.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? '출퇴근 시간을 입력하세요' : 'Enter work hours to calculate'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('근무시간 계산기', 'Working Hours Calculator')}</strong>{L('는 대한민국 노동법 기준으로 근무시간과 급여를 계산하는 도구입니다.', ' calculates working hours and pay based on Korean labor law.')}
        </p>
        <p>
          {L('기본근무, 연장근무, 야간근무, 휴일근무를 구분하여 계산하며, 각각 다른 가산율이 적용됩니다.', 'Distinguishes between regular, overtime, night, and holiday work, each with different premium rates.')}
        </p>
        <p className="p-4 bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 rounded-r-lg">
          {L('휴일근무는 별도로 지정된 공휴일이나 유급휴일에 해당하는 시간만 입력해야 합니다. 주 6일 근무라도 토요일이 유급휴일인지 확인하세요.', 'Holiday work should only include hours on designated public or paid holidays. Even with 6-day workweeks, verify if Saturday is a paid holiday.')}
        </p>
        <TermGlossary items={[
          { term: L('기본근무', 'Regular Work'), desc: L('하루 8시간, 주 40시간 이내의 일반 근무시간입니다.', 'Regular working hours within 8 hours/day, 40 hours/week.') },
          { term: L('연장근무', 'Overtime'), desc: L('하루 8시간을 초과하는 근무시간으로, 법정 연장근무 한도는 1일 4시간, 주 12시간입니다.', 'Work exceeding 8 hours/day; legal limit is 4h/day, 12h/week.') },
          { term: L('야간근무', 'Night Work'), desc: L('밤 10시~오전 6시 사이의 근무시간으로, 통상임금의 50% 가산이 적용됩니다.', 'Work between 10 PM and 6 AM; 50% premium applies.') },
          { term: L('휴일근무', 'Holiday Work'), desc: L('공휴일 또는 유급휴일에 근무하는 경우로, 200%의 가산이 적용됩니다. 주 5일 근무제에서 토요일은 유급휴일일 수 있습니다.', 'Work on public/paid holidays; 200% premium. Saturday may be a paid holiday under 5-day workweek.') },
          { term: L('주 52시간 제도', '52-Hour Workweek'), desc: L('기본 40시간 + 연장 12시간 = 주간 총 52시간을 초과할 수 없습니다.', 'Regular 40h + overtime 12h = max 52h per week.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('근무시간 계산', 'Working Hours Calculation')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="font-mono text-sm">총 근무시간 = 퇴근시간 - 출근시간 - 휴게시간</p>
            <p className="font-mono text-sm">기본근무 = min(총 근무시간, 8시간)</p>
            <p className="font-mono text-sm">연장근무 = max(0, 총 근무시간 - 8시간), 최대 4시간</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('급여 계산 (가산율)', 'Pay Calculation (Premium Rates)')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-3">
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">{L('기본급', 'Base Pay')}</p>
              <p className="font-mono text-xs">기본근무시간 × 시급 × 100%</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">{L('연장근무수당', 'Overtime Pay')}</p>
              <p className="font-mono text-xs">연장근무시간 × 시급 × 150%</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">{L('야간근무수당', 'Night Pay')}</p>
              <p className="font-mono text-xs">야간시간 × 시급 × 50% (추가 가산)</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">{L('휴일근무수당', 'Holiday Pay')}</p>
              <p className="font-mono text-xs">휴일근무시간 × 시급 × 200%</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('2024년 최저시급', '2024 Minimum Wage')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="text-2xl font-bold">₩10,030</p>
            <p className="text-xs text-muted-foreground mt-1">{L('시간당 최저임금 (2024년 기준)', 'Hourly minimum wage (2024 standard)')}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('주 52시간 제도 핵심', '52-Hour Workweek Key Points')}</h4>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li><strong>{L('기본:', 'Regular:')}</strong> {L('주 40시간 (1일 8시간 × 5일)', '40h/week (8h/day × 5 days)')}</li>
            <li><strong>{L('연장:', 'Overtime:')}</strong> {L('주 12시간 (1일 4시간 한도)', '12h/week (max 4h/day)')}</li>
            <li><strong>{L('총 한도:', 'Total limit:')}</strong> {L('주 52시간 초과 불가', 'Cannot exceed 52h/week')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('야간근무 가산', 'Night Work Premium')}</h4>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{L('야간근무(22:00~06:00)에는 통상임금의 50% 이상을 가산 지급해야 합니다.', 'Night work (22:00~06:00) requires at least 50% premium.')}</li>
            <li>{L('연장야간근무는 150% + 50% = 200%가 적용됩니다.', 'Overtime night work: 150% + 50% = 200%.')}</li>
            <li>{L('휴일야간근무는 200% + 50% = 250%가 적용됩니다.', 'Holiday night work: 200% + 50% = 250%.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-orange-500 pl-3">{L('휴일근무 구분', 'Holiday Work Distinction')}</h4>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>{L('주 5일 근무: 토요일은 유급휴일이 아닐 수 있음 (회사 내규 확인 필요)', '5-day week: Saturday may not be a paid holiday (check company rules)')}</li>
            <li>{L('주 6일 근무: 토요일 근무 시 유급휴일 여부에 따라 휴일수당 적용 여부가 달라짐', '6-day week: Saturday holiday premium depends on whether it is a paid holiday')}</li>
            <li>{L('법정 공휴일(설날, 추석 등) 근무 시에는 반드시 휴일수당(200%)이 적용됩니다', 'Legal holidays (Lunar New Year, Chuseok, etc.) always qualify for 200% holiday premium')}</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 rounded-r-lg">
          <p className="font-bold text-sm">{L('주의사항', 'Important Notice')}</p>
          <p className="text-xs mt-1">
            {L('이 계산기는 일반적인 참고용 도구입니다. 실제 급여는 고용계약서, 단체협약, 회사 내규, 특별근로계약 등에 따라 달라질 수 있으므로, 정확한 급여 확인은 인사팀과 상담하시기 바랍니다.', 'This calculator is for general reference only. Actual pay may vary based on employment contracts, collective agreements, and company rules. Please consult your HR department for accurate pay details.')}
          </p>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '근무시간 계산기' : 'Working Hours Calculator'}
      description={isKo ? '대한민국 노동법 기준으로 근무시간과 급여를 계산합니다.' : 'Calculate working hours and pay based on Korean labor law.'}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
