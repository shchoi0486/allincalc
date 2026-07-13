'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

function parseTime(str: string): number {
  const parts = str.split(':').map(Number);
  if (parts.length === 3 && parts.every(p => !isNaN(p))) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2 && parts.every(p => !isNaN(p))) {
    return parts[0] * 3600 + parts[1] * 60;
  }
  return NaN;
}

function formatTime(totalSec: number): string {
  const sign = totalSec < 0 ? '-' : '';
  const abs = Math.abs(totalSec);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.round(abs % 60);
  return `${sign}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatTimeVerbose(totalSec: number): string {
  const sign = totalSec < 0 ? '-' : '';
  const abs = Math.abs(totalSec);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.round(abs % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}시간`);
  if (m > 0) parts.push(`${m}분`);
  if (s > 0) parts.push(`${s}초`);
  return sign + (parts.join(' ') || '0초');
}

function formatTimeVerboseEn(totalSec: number): string {
  const sign = totalSec < 0 ? '-' : '';
  const abs = Math.abs(totalSec);
  const h = Math.floor(abs / 3600);
  const m = Math.floor((abs % 3600) / 60);
  const s = Math.round(abs % 60);
  const parts: string[] = [];
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0) parts.push(`${s}s`);
  return sign + (parts.join(' ') || '0s');
}

export default function TimeCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [time1, setTime1] = useState('');
  const [operator, setOperator] = useState('+');
  const [time2, setTime2] = useState('');
  const [result, setResult] = useState<{ formatted: string; verbose: string; totalSeconds: number } | null>(null);

  const calculate = useCallback(() => {
    const t1 = parseTime(time1);
    const t2 = parseTime(time2);
    if (isNaN(t1) || isNaN(t2)) { setResult(null); return; }
    const total = operator === '+' ? t1 + t2 : t1 - t2;
    setResult({
      formatted: formatTime(total),
      verbose: isKo ? formatTimeVerbose(total) : formatTimeVerboseEn(total),
      totalSeconds: total,
    });
  }, [time1, time2, operator, isKo]);

  const reset = () => { setTime1(''); setTime2(''); setResult(null); };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('시간 1 (시:분:초 또는 시:분)', 'Time 1 (hh:mm:ss or hh:mm)')}</Label>
        <Input value={time1} onChange={e => setTime1(e.target.value)} placeholder={isKo ? '예: 01:30:45' : 'e.g. 01:30:45'} />
      </div>
      <div>
        <Label>{L('연산자', 'Operator')}</Label>
        <Select value={operator} onValueChange={setOperator}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="+">+ ({L('덧셈', 'Add')})</SelectItem>
            <SelectItem value="-">- ({L('뺄셈', 'Subtract')})</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{L('시간 2 (시:분:초 또는 시:분)', 'Time 2 (hh:mm:ss or hh:mm)')}</Label>
        <Input value={time2} onChange={e => setTime2(e.target.value)} placeholder={isKo ? '예: 00:45:20' : 'e.g. 00:45:20'} />
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
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{isKo ? '계산 결과' : 'Result'}</p>
            <p className="text-3xl font-bold font-mono mt-2">{result.formatted}</p>
            <p className="text-sm text-muted-foreground mt-2">{result.verbose}</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-semibold mb-1">{L('상세 정보', 'Details')}</p>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 bg-card rounded">
                <p className="text-muted-foreground">{L('시', 'Hours')}</p>
                <p className="font-bold text-lg">{Math.floor(Math.abs(result.totalSeconds) / 3600)}</p>
              </div>
              <div className="p-2 bg-card rounded">
                <p className="text-muted-foreground">{L('분', 'Minutes')}</p>
                <p className="font-bold text-lg">{Math.floor((Math.abs(result.totalSeconds) % 3600) / 60)}</p>
              </div>
              <div className="p-2 bg-card rounded">
                <p className="text-muted-foreground">{L('초', 'Seconds')}</p>
                <p className="font-bold text-lg">{Math.round(Math.abs(result.totalSeconds) % 60)}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? '시간을 입력하세요' : 'Enter times to calculate'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('시간 덧셈/뺄셈 계산기', 'Time Addition/Subtraction Calculator')}</strong>{L('는 두 시간 값의 덧셈 또는 뺄셈을 수행하는 도구입니다.', ' performs addition or subtraction of two time values.')}
        </p>
        <p>
          {L('이 운동 시간 합산, 근무 시간 계산, 비행 시간 계산 등 다양한 상황에서 활용할 수 있습니다.', 'This can be used in various situations such as combining exercise times, calculating work hours, and flight time calculations.')}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('입력 형식은 "시:분:초" 또는 "시:분"으로, 초 단위까지 정확하게 계산됩니다.', 'Input format is "hh:mm:ss" or "hh:mm", with calculations accurate to the second.')}
        </p>
        <TermGlossary items={[
          { term: L('시간 덧셈', 'Time Addition'), desc: L('두 시간을 더하여 총 소요 시간을 구합니다.', 'Adding two times to find the total duration.') },
          { term: L('시간 뺄셈', 'Time Subtraction'), desc: L('두 시간의 차이를 구합니다. 뺄셈 결과가 음수가 되면 시간 초과를 의미합니다.', 'Finding the difference between two times. A negative result means overtime.') },
          { term: L('24시간 형식', '24-Hour Format'), desc: L('오전/오후 구분 없이 0~23시로 표시하는 시간 형식입니다.', 'A time format using 0~23 hours without AM/PM distinction.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('변환 기준', 'Conversion Basis')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="font-mono text-sm text-center">1시간 = 60분 = 3,600초</p>
            <p className="font-mono text-sm text-center">1분 = 60초</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('계산 과정', 'Calculation Process')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm font-semibold">1. {L('입력값을 초 단위로 변환', 'Convert input to seconds')}</p>
            <p className="font-mono text-xs">시간(초) = 시 × 3,600 + 분 × 60 + 초</p>
            <p className="text-sm font-semibold mt-3">2. {L('초 단위로 연산 수행', 'Perform arithmetic in seconds')}</p>
            <p className="font-mono text-xs">{L('덧셈: 초1 + 초2', 'Add: sec1 + sec2')} | {L('뺄셈: 초1 - 초2', 'Subtract: sec1 - sec2')}</p>
            <p className="text-sm font-semibold mt-3">3. {L('결과를 시간 형식으로 변환', 'Convert result back to time format')}</p>
            <p className="font-mono text-xs">{L('시 = 결과 ÷ 3,600', 'Hours = result ÷ 3600')} | {L('분 = (결과 % 3,600) ÷ 60', 'Minutes = (result % 3600) ÷ 60')} | {L('초 = 결과 % 60', 'Seconds = result % 60')}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('활용 예시', 'Examples')}</h4>
          <div className="space-y-2 mt-2">
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('운동 시간 합산', 'Exercise Time Total')}</p>
              <p className="text-xs mt-1 font-mono">00:30:00 + 00:45:00 + 00:15:00 = 01:30:00</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('근무 시간 계산', 'Work Hours Calculation')}</p>
              <p className="text-xs mt-1 font-mono">09:00:00 ~ 18:00:00 = 09:00:00 (점심시간 포함)</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="font-semibold text-sm">{L('이전 기록 대비 차이', 'Difference from Previous Record')}</p>
              <p className="text-xs mt-1 font-mono">01:25:30 - 01:30:00 = -00:04:30 ({L('4분 30초 단축', '4 min 30 sec faster')})</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('참고', 'Notes')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{L('24시간을 초과하는 결과도 정상적으로 계산됩니다.', 'Results exceeding 24 hours are calculated correctly.')}</li>
            <li>{L('뺄셈 결과가 음수면 시간이 모자란다는 의미입니다.', 'A negative subtraction result means the time is insufficient.')}</li>
            <li>{L('입력 시 "01:30:45" 또는 "1:30:45" 모두 가능합니다.', 'Both "01:30:45" and "1:30:45" formats work for input.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '시간 덧셈/뺄셈 계산기' : 'Time Addition/Subtraction Calculator'}
      description={isKo ? '두 시간의 덧셈 또는 뺄셈을 시:분:초 단위로 정확하게 계산합니다.' : 'Accurately add or subtract two times in hours:minutes:seconds format.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
