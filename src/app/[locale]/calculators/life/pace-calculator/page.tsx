'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

const PaceCalculator = () => {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';

  const [mode, setMode] = useState<'distance-time' | 'distance-pace' | 'time-pace'>('distance-time');
  const [distance, setDistance] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [seconds, setSeconds] = useState('');
  const [paceMin, setPaceMin] = useState('');
  const [paceSec, setPaceSec] = useState('');
  const [result, setResult] = useState<{
    distance?: number;
    timeStr?: string;
    paceStr?: string;
    speed?: number;
    totalSeconds?: number;
  } | null>(null);

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = Math.round(totalSec % 60);
    if (h > 0) return `${h}시간 ${m}분 ${s}초`;
    return `${m}분 ${s}초`;
  };

  const formatPace = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = Math.round(totalSec % 60);
    return `${m}'${s.toString().padStart(2, '0')}"`;
  };

  const calculate = () => {
    const d = parseFloat(distance);
    const h = parseFloat(hours) || 0;
    const m = parseFloat(minutes) || 0;
    const s = parseFloat(seconds) || 0;
    const pm = parseFloat(paceMin) || 0;
    const ps = parseFloat(paceSec) || 0;

    if (mode === 'distance-time') {
      if (isNaN(d) || d <= 0) {
        alert(isKo ? '거리를 올바르게 입력해주세요.' : 'Please enter a valid distance.');
        return;
      }
      const totalSec = h * 3600 + m * 60 + s;
      if (totalSec <= 0) {
        alert(isKo ? '시간을 올바르게 입력해주세요.' : 'Please enter a valid time.');
        return;
      }
      const pace = totalSec / d;
      const speed = (d / totalSec) * 3600;

      setResult({
        distance: d,
        timeStr: formatTime(totalSec),
        paceStr: formatPace(pace),
        speed: parseFloat(speed.toFixed(2)),
        totalSeconds: totalSec,
      });
    } else if (mode === 'distance-pace') {
      if (isNaN(d) || d <= 0) {
        alert(isKo ? '거리를 올바르게 입력해주세요.' : 'Please enter a valid distance.');
        return;
      }
      const paceTotal = pm * 60 + ps;
      if (paceTotal <= 0) {
        alert(isKo ? '페이스를 올바르게 입력해주세요.' : 'Please enter a valid pace.');
        return;
      }
      const totalTime = paceTotal * d;
      const speed = (d / totalTime) * 3600;

      setResult({
        distance: d,
        timeStr: formatTime(totalTime),
        paceStr: formatPace(paceTotal),
        speed: parseFloat(speed.toFixed(2)),
        totalSeconds: totalTime,
      });
    } else {
      if (isNaN(d) || d <= 0) {
        alert(isKo ? '거리를 올바르게 입력해주세요.' : 'Please enter a valid distance.');
        return;
      }
      const totalSec = h * 3600 + m * 60 + s;
      if (totalSec <= 0) {
        alert(isKo ? '시간을 올바르게 입력해주세요.' : 'Please enter a valid time.');
        return;
      }
      const pace = totalSec / d;
      const speed = (d / totalSec) * 3600;

      setResult({
        distance: d,
        timeStr: formatTime(totalSec),
        paceStr: formatPace(pace),
        speed: parseFloat(speed.toFixed(2)),
        totalSeconds: totalSec,
      });
    }
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '계산 모드' : 'Mode'}:</label>
        <Select value={mode} onValueChange={(v: any) => { setMode(v); setResult(null); }}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="distance-time">{isKo ? '거리 + 시간 → 페이스' : 'Distance + Time → Pace'}</SelectItem>
            <SelectItem value="distance-pace">{isKo ? '거리 + 페이스 → 시간' : 'Distance + Pace → Time'}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '거리 (km)' : 'Distance (km)'}:</label>
        <Input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder={isKo ? '예: 5' : 'e.g. 5'} step="0.01" />
      </div>

      {mode === 'distance-time' ? (
        <div className="flex items-center space-x-4">
          <label className="w-28 text-sm font-medium">{isKo ? '시간' : 'Time'}:</label>
          <div className="flex items-center space-x-1">
            <Input type="number" value={hours} onChange={(e) => setHours(e.target.value)} placeholder={isKo ? '시' : 'hr'} className="w-20" min="0" />
            <span className="text-muted-foreground">:</span>
            <Input type="number" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder={isKo ? '분' : 'min'} className="w-20" min="0" max="59" />
            <span className="text-muted-foreground">:</span>
            <Input type="number" value={seconds} onChange={(e) => setSeconds(e.target.value)} placeholder={isKo ? '초' : 'sec'} className="w-20" min="0" max="59" />
          </div>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <label className="w-28 text-sm font-medium">{isKo ? '페이스 (분/km)' : 'Pace (min/km)'}:</label>
          <div className="flex items-center space-x-1">
            <Input type="number" value={paceMin} onChange={(e) => setPaceMin(e.target.value)} placeholder={isKo ? '분' : 'min'} className="w-20" min="0" />
            <span className="text-muted-foreground">:</span>
            <Input type="number" value={paceSec} onChange={(e) => setPaceSec(e.target.value)} placeholder={isKo ? '초' : 'sec'} className="w-20" min="0" max="59" />
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={calculate}>{isKo ? '계산' : 'Calculate'}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{isKo ? '초기화' : 'Reset'}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">{isKo ? '페이스' : 'Pace'}</p>
              <p className="text-xl font-bold text-primary">{result.paceStr}</p>
              <p className="text-xs text-muted-foreground">{isKo ? '분/km' : 'min/km'}</p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">{isKo ? '속도' : 'Speed'}</p>
              <p className="text-xl font-bold text-primary">{result.speed}</p>
              <p className="text-xs text-muted-foreground">km/h</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
              <span className="text-muted-foreground">{isKo ? '거리' : 'Distance'}</span>
              <strong>{result.distance} km</strong>
            </div>
            <div className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
              <span className="text-muted-foreground">{isKo ? '총 시간' : 'Total Time'}</span>
              <strong>{result.timeStr}</strong>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">{isKo ? '참고: 일반적인 러닝 페이스' : 'Reference: Typical Running Paces'}</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>- {isKo ? '마라톤 엘리트: 3~4분/km' : 'Marathon elite: 3-4 min/km'}</li>
              <li>- {isKo ? '마라톤 완주: 5~7분/km' : 'Marathon finisher: 5-7 min/km'}</li>
              <li>- {isKo ? '조깅: 7~9분/km' : 'Jogging: 7-9 min/km'}</li>
              <li>- {isKo ? '걷기: 10~13분/km' : 'Walking: 10-13 min/km'}</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {isKo ? '값을 입력하고 계산 버튼을 눌러주세요.' : 'Enter values and click Calculate.'}
        </div>
      )}
    </div>
  );

  const infoSection = isKo ? (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            러닝/워킹 페이스와 속도를 간편하게 계산하세요!
          </p>
          <p>
            페이스 계산기는 거리, 시간, 페이스 중 두 가지를 입력하면 나머지 하나를 자동으로 계산합니다.
            러닝, 마라톤, 워킹 등 다양한 운동에서 자신의 페이스와 속도를 파악하는 데 활용됩니다.
          </p>
          <p>
            페이스(min/km)는 1km를 달리는데 걸리는 시간(분)을 나타내며,
            속도(km/h)는 1시간 동안 이동하는 거리(km)를 나타냅니다.
            서로 역수 관계로 변환할 수 있습니다.
          </p>
          <p>
            마라톤 훈련, 인터벌 트레이닝, 목표 시간 설정 등에 활용하여
            효과적인 운동 계획을 세울 수 있습니다.
          </p>
          <TermGlossary items={[
            { term: '페이스 (Pace)', desc: '1km를 이동하는 데 걸리는 시간(분)입니다. 값이 작을수록 빠른 속도를 의미합니다. 러닝에서 가장 많이 사용되는 속도 표현 방식입니다.' },
            { term: '속도 (Speed)', desc: '1시간 동안 이동하는 거리(km)입니다. 페이스와 역수 관계이며, km/h 단위로 표시합니다.' },
            { term: '마라톤 페이스', desc: '42.195km를 완주하기 위한 균일한 속도입니다. 엘리트 선수는 3~4분/km, 일반 참가자는 5~7분/km 수준입니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">페이스 계산 공식</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">기본 관계식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                페이스(min/km) = 총 시간(초) ÷ 거리(km) ÷ 60
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                속도(km/h) = 거리(km) ÷ 총 시간(시간) × 3600
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">변환 공식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                속도(km/h) = 60 ÷ 페이스(min/km)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                페이스(min/km) = 60 ÷ 속도(km/h)
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">참고: 일반적인 페이스 범위</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>3~4분/km:</strong> 마라톤 엘리트 선수</li>
                <li><strong>5~7분/km:</strong> 마라톤 완주 수준</li>
                <li><strong>7~9분/km:</strong> 조깅/러닝</li>
                <li><strong>10~13분/km:</strong> 빠른 걷기</li>
                <li><strong>13분/km 이상:</strong> 일반 걷기</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">페이스 관리 핵심 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. 초반에 너무 빠르게 뛰지 마세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                마라톤이나 장거리 러닝에서 가장 흔한 실수는 초반 과속입니다.
                처음 3km는 평소보다 약간 느린 페이스로 시작하는 것이 좋습니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 균일한 페이스를 유지하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                전체 구간에서 페이스 변동폭을 ±10초 이내로 유지하면 에너지 효율이 높아집니다.
                스피드워치나 GPS 시계를 활용하여 페이스를 실시간으로 모니터링하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 목표 페이스로 훈련하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                원하는 기록을 달성하려면 목표 페이스로 일정 거리를 뛰는 훈련이 필요합니다.
                예: 풀코스 4시간 완주는 목표 페이스 5분41초/km로 훈련합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 호흡과 페이스를 연결하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                일정한 호흡 리듬을 유지하면 페이스 안정에 도움이 됩니다.
                일반적으로 3-2 리듬(들숨 3보, 날숨 2보)이 효과적입니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 환경에 따라 페이스를 조절하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                오르막, 더위, 바람 등의 영향을 고려하여 페이스를 조절해야 합니다.
                평지 기준 페이스에서 오르막은 10~20% 느리게 뛰는 것이 적절합니다.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  ) : (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            Easily calculate running/walking pace and speed!
          </p>
          <p>
            The pace calculator automatically computes the remaining value when you enter any two of
            distance, time, or pace. It is used for running, marathons, walking, and other exercises
            to understand your pace and speed.
          </p>
          <p>
            Pace (min/km) represents the time taken to run 1km, while speed (km/h) shows the distance
            covered in 1 hour. They can be converted between each other as reciprocals.
          </p>
          <p>
            Useful for marathon training, interval training, and setting goal times to create
            effective exercise plans.
          </p>
          <TermGlossary items={[
            { term: 'Pace', desc: 'Time (minutes) to travel 1km. Lower values mean faster speed. The most common speed expression in running.' },
            { term: 'Speed', desc: 'Distance (km) traveled in 1 hour. Reciprocal of pace, expressed in km/h.' },
            { term: 'Marathon Pace', desc: 'Uniform speed to finish 42.195km. Elite: 3-4 min/km, general: 5-7 min/km.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Pace Calculation Formulas</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Basic Relationships</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Pace (min/km) = Total time (sec) ÷ Distance (km) ÷ 60
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Speed (km/h) = Distance (km) ÷ Total time (hours) × 3600
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Conversion Formulas</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Speed (km/h) = 60 ÷ Pace (min/km)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Pace (min/km) = 60 ÷ Speed (km/h)
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Reference: Typical Pace Ranges</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>3-4 min/km:</strong> Marathon elite</li>
                <li><strong>5-7 min/km:</strong> Marathon finisher</li>
                <li><strong>7-9 min/km:</strong> Jogging/running</li>
                <li><strong>10-13 min/km:</strong> Fast walking</li>
                <li><strong>13+ min/km:</strong> Normal walking</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Key tips for pace management</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Don&apos;t start too fast</p>
              <p className="text-xs mt-1 text-muted-foreground">
                The most common mistake in marathons is going out too fast.
                Start the first 3km at a slightly slower pace than usual.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Maintain an even pace</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Keeping pace variation within ±10 seconds improves energy efficiency.
                Use a GPS watch or running app to monitor pace in real time.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Train at target pace</p>
              <p className="text-xs mt-1 text-muted-foreground">
                To achieve your goal time, train at the target pace for consistent distances.
                E.g., a 4-hour marathon requires training at 5:41/km pace.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Link breathing with pace</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Maintaining a consistent breathing rhythm helps stabilize pace.
                A 3-2 rhythm (inhale 3 steps, exhale 2 steps) is generally effective.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Adjust pace for conditions</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Account for hills, heat, and wind. On uphills, run 10-20% slower
                than your flat-land pace for optimal effort management.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '페이스 계산기' : 'Pace Calculator'}
      description={isKo ? '거리, 시간, 페이스를 이용하여 러닝/워킹 페이스와 속도를 계산합니다.' : 'Calculate running/walking pace and speed using distance, time, and pace.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default PaceCalculator;
