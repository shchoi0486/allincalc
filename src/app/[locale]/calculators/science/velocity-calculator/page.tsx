'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const infoSection = (isKo: boolean) => {
  const L = (ko: string, en: string) => (isKo ? ko : en);
  return {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>{L('속도 계산기', 'Velocity Calculator')}</strong>{L('는 물체의 이동 속도와 가속도를 정확하게 계산하는 필수적인 물리학 도구입니다. 이 계산기는 ', ' is an essential physics tool that accurately calculates an object’s speed and acceleration. It covers ')}<strong>{L('평균 속도', 'average velocity')}</strong>{L('와 ', ' and ')}<strong>{L('가속도', 'acceleration')}</strong>{L(' 두 가지 핵심 개념을 다루며, 일상생활부터 전문 분야까지 폭넓게 활용됩니다.', ' — two core concepts widely used from everyday life to specialized fields.')}
      </p>
      <p>
        <strong>{L('속도(velocity)', 'Velocity')}</strong>{L('는 물체의 위치 변화율로, 단위 시간당 이동하는 거리를 나타냅니다. 속도의 표준 단위는 ', ' is the rate of change of an object’s position, representing the distance traveled per unit time. Its standard unit is ')}<strong>{L('미터 매 초(m/s)', 'meters per second (m/s)')}</strong>{L('이며, 자동차의 속도, 달리기 속도, 바람의 속도 등 일상생활에서 매우 빈번하게 사용되는 물리량입니다. 속도는 방향을 포함한 벡터량으로, 동일한 속력이라도 방향이 다르면 서로 다른 속도가 됩니다.', ', and is a physical quantity used very frequently in daily life such as car speed, running speed, and wind speed. Velocity is a vector quantity that includes direction, so the same speed with a different direction is a different velocity.')}
      </p>
      <p>
        <strong>{L('가속도(acceleration)', 'Acceleration')}</strong>{L('는 속도의 변화율로, 단위 시간당 속도가 얼마나 변하는지를 나타냅니다. 가속도의 단위는 ', ' is the rate of change of velocity, indicating how much the velocity changes per unit time. Its unit is ')}<strong>{L('미터 매 초 제곱(m/s²)', 'meters per second squared (m/s²)')}</strong>{L('입니다. 자동차의 출발, 브레이크를 밟을 때의 감속, 자유 낙하 운동 등에서 중요한 역할을 하며, 양의 가속도는 속도 증가를, 음의 가속도는 감속을 의미합니다.', '. It plays an important role in a car starting off, decelerating when braking, and free-fall motion; positive acceleration means increasing speed, while negative acceleration means deceleration.')}
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        {L('이 계산기는 학생들에게 운동학적 개념을 직관적으로 이해시키는 교육 도구로서, 엔지니어들에게는 차량 성능 분석, 교통 시스템 설계, 항공우주 프로젝트 등에서 정확한 속도 및 가속도 데이터를 제공하는 실용적인 도구로 활용됩니다.', 'This calculator serves as an educational tool that helps students intuitively understand kinematic concepts, and as a practical tool that provides engineers with accurate velocity and acceleration data for vehicle performance analysis, traffic system design, aerospace projects, and more.')}
      </p>
      <TermGlossary items={[
        { term: L('속도(velocity)', 'Velocity'), desc: L('단위 시간당 위치 변화량으로, 방향을 포함한 벡터량이며 단위는 m/s입니다.', 'Change in position per unit time; a vector quantity that includes direction, with unit m/s.') },
        { term: L('가속도(acceleration)', 'Acceleration'), desc: L('단위 시간당 속도의 변화량으로, 단위는 m/s²입니다.', 'Change in velocity per unit time, with unit m/s².') },
        { term: L('속력(speed)', 'Speed'), desc: L('방향을 포함하지 않는 스칼라량으로, 속도의 크기만을 의미합니다.', 'A scalar quantity without direction, meaning only the magnitude of velocity.') },
      ]} />
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('평균 속도 공식', 'Average Velocity Formula')}</h4>
        <p>{L('물체가 일정한 거리를 이동하는 데 걸린 시간을 알고 있을 때 속도를 계산합니다.', 'Calculate velocity when you know the time taken to travel a certain distance.')}</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">v = d / t</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">v</span>{L('는 속도(velocity)를 나타내며, 단위는 m/s입니다.', ' is velocity, with unit m/s.')}</li>
          <li><span className="font-semibold">d</span>{L('는 거리(distance)를 나타내며, 단위는 미터(m)입니다.', ' is distance, with unit meter (m).')}</li>
          <li><span className="font-semibold">t</span>{L('는 시간(time)을 나타내며, 단위는 초(s)입니다.', ' is time, with unit second (s).')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('가속도 공식', 'Acceleration Formula')}</h4>
        <p>{L('초기 속도와 최종 속도, 그리고 시간을 통해 가속도를 계산합니다.', 'Calculate acceleration from initial velocity, final velocity, and time.')}</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">a = (v - v₀) / t</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">a</span>{L('는 가속도(acceleration)를 나타내며, 단위는 m/s²입니다.', ' is acceleration, with unit m/s².')}</li>
          <li><span className="font-semibold">v</span>{L('는 최종 속도(final velocity)를 나타내며, 단위는 m/s입니다.', ' is the final velocity, with unit m/s.')}</li>
          <li><span className="font-semibold">v₀</span>{L('는 초기 속도(initial velocity)를 나타내며, 단위는 m/s입니다.', ' is the initial velocity, with unit m/s.')}</li>
          <li><span className="font-semibold">t</span>{L('는 시간(time)을 나타내며, 단위는 초(s)입니다.', ' is time, with unit second (s).')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('계산 예시', 'Example')}</h4>
        <p>{L('예를 들어, 자동차가 100m를 5초 만에 주행했다면?', 'For example, if a car travels 100 m in 5 seconds?')}</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">v = 100 m / 5 s = 20 m/s (72 km/h)</p>
        </div>
        <p>{L('자동차가 초당 20미터를 이동하며, 이는 시속 72km에 해당합니다.', 'The car moves 20 meters per second, which equals 72 km/h.')}</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('핵심 공식 정리', 'Key Formulas')}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('평균 속도:', 'Average velocity:')}</strong> v = d/t ({L('거리/시간', 'distance/time')})</li>
          <li><strong>{L('가속도:', 'Acceleration:')}</strong> a = (v - v₀)/t ({L('속도 변화율', 'rate of velocity change')})</li>
          <li><strong>{L('최종 속도:', 'Final velocity:')}</strong> v = v₀ + at ({L('등가속도 운동', 'uniform acceleration')})</li>
          <li><strong>{L('이동 거리:', 'Distance:')}</strong> d = v₀t + ½at² ({L('등가속도 운동', 'uniform acceleration')})</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('단위 변환 요령', 'Unit Conversion Tips')}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>1 m/s</strong> = 3.6 km/h ({L('시속으로 변환: 3.6 곱하기', 'to km/h: multiply by 3.6')})</li>
          <li><strong>1 km/h</strong> = 0.2778 m/s ({L('초속으로 변환: 3.6 나누기', 'to m/s: divide by 3.6')})</li>
          <li><strong>1 mph</strong> ≈ 0.4470 m/s ({L('마일퍼아워 → m/s', 'mph → m/s')})</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ {L('속도와 속력의 차이', 'Difference Between Velocity and Speed')}</p>
        <p className="text-xs mt-1">
          {L('물리학에서 ', 'In physics, ')}<strong>{L('속도(velocity)', 'velocity')}</strong>{L('는 방향을 포함한 벡터량이고, ', ' is a vector quantity that includes direction, while ')}<strong>{L('속력(speed)', 'speed')}</strong>{L('는 방향이 없는 스칼라량입니다. 예를 들어, 10m/s로 북쪽으로 달리는 선수와 10m/s로 남쪽으로 달리는 선수는 속력은 같지만 속도는 다릅니다.', ' is a scalar quantity without direction. For example, a runner moving north at 10 m/s and one moving south at 10 m/s have the same speed but different velocities.')}
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('실생활 적용 사례', 'Real-Life Applications')}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('교통공학:', 'Traffic engineering:')}</strong> {L('도로 설계, 교통 흐름 분석, 신호 체계 설계', 'road design, traffic flow analysis, signal system design')}</li>
          <li><strong>{L('스포츠:', 'Sports:')}</strong> {L('선수 기록 분석, 훈련 프로그램 설계', 'athlete performance analysis, training program design')}</li>
          <li><strong>{L('항공우주:', 'Aerospace:')}</strong> {L('비행기 이륙 속도, 위성 궤도 속도 계산', 'aircraft takeoff speed, satellite orbital speed calculation')}</li>
          <li><strong>{L('자동차 공학:', 'Automotive engineering:')}</strong> {L('0→100km/h 가속 시간, 제동 거리 계산', '0→100 km/h acceleration time, braking distance calculation')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('교육 활용법', 'Educational Use')}</h4>
        <p>{L('이 계산기는 다음 개념을 이해하는 데 유용합니다.', 'This calculator is useful for understanding the following concepts.')}</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('일정 속도 운동:', 'Constant velocity motion:')}</strong> {L('가속도가 0일 때의 등속 직선 운동', 'uniform linear motion when acceleration is zero')}</li>
          <li><strong>{L('등가속도 운동:', 'Uniform acceleration motion:')}</strong> {L('중력 가속도(9.8 m/s²)를 이용한 자유 낙하', 'free fall using gravitational acceleration (9.8 m/s²)')}</li>
          <li><strong>{L('속도-시간 그래프:', 'Velocity-time graph:')}</strong> {L('기울기는 가속도, 면적은 이동 거리', 'slope is acceleration, area is distance')}</li>
        </ul>
      </div>
    </div>
  ),
  };
};

export default function VelocityCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict.velocityCalculator;
  const isKo = locale === 'ko';

  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [velocity, setVelocity] = useState<number | null>(null);

  const [initialVelocity, setInitialVelocity] = useState('');
  const [finalVelocity, setFinalVelocity] = useState('');
  const [accelTime, setAccelTime] = useState('');
  const [acceleration, setAcceleration] = useState<number | null>(null);

  const handleVelocityCalculate = useCallback(() => {
    const d = parseFloat(distance);
    const tVal = parseFloat(time);
    if (!isNaN(d) && !isNaN(tVal) && tVal !== 0) {
      setVelocity(d / tVal);
    } else {
      setVelocity(null);
    }
  }, [distance, time]);

  const handleVelocityReset = useCallback(() => {
    setDistance('');
    setTime('');
    setVelocity(null);
  }, []);

  const handleAccelerationCalculate = useCallback(() => {
    const v0 = parseFloat(initialVelocity);
    const v = parseFloat(finalVelocity);
    const tVal = parseFloat(accelTime);
    if (!isNaN(v0) && !isNaN(v) && !isNaN(tVal) && tVal !== 0) {
      setAcceleration((v - v0) / tVal);
    } else {
      setAcceleration(null);
    }
  }, [initialVelocity, finalVelocity, accelTime]);

  const handleAccelerationReset = useCallback(() => {
    setInitialVelocity('');
    setFinalVelocity('');
    setAccelTime('');
    setAcceleration(null);
  }, []);

  const inputSection = (
    <Tabs defaultValue="velocity">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="velocity">{t.tabVelocity}</TabsTrigger>
        <TabsTrigger value="acceleration">{t.tabAcceleration}</TabsTrigger>
      </TabsList>
      <TabsContent value="velocity" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="distance">{t.inputDistance}</Label>
          <Input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder={isKo ? '예: 100' : 'e.g. 100'}
          />
        </div>
        <div>
          <Label htmlFor="time">{t.inputTime}</Label>
          <Input
            id="time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder={isKo ? '예: 5' : 'e.g. 5'}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleVelocityCalculate} className="flex-1">{t.calculateBtn}</Button>
          <Button onClick={handleVelocityReset} variant="outline" className="flex-1">{t.resetBtn}</Button>
        </div>
      </TabsContent>
      <TabsContent value="acceleration" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="initialVelocity">{t.inputInitialVelocity}</Label>
          <Input
            id="initialVelocity"
            type="number"
            value={initialVelocity}
            onChange={(e) => setInitialVelocity(e.target.value)}
            placeholder={isKo ? '예: 0' : 'e.g. 0'}
          />
        </div>
        <div>
          <Label htmlFor="finalVelocity">{t.inputFinalVelocity}</Label>
          <Input
            id="finalVelocity"
            type="number"
            value={finalVelocity}
            onChange={(e) => setFinalVelocity(e.target.value)}
            placeholder={isKo ? '예: 20' : 'e.g. 20'}
          />
        </div>
        <div>
          <Label htmlFor="accelTime">{t.inputAccelTime}</Label>
          <Input
            id="accelTime"
            type="number"
            value={accelTime}
            onChange={(e) => setAccelTime(e.target.value)}
            placeholder={isKo ? '예: 5' : 'e.g. 5'}
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAccelerationCalculate} className="flex-1">{t.calculateBtn}</Button>
          <Button onClick={handleAccelerationReset} variant="outline" className="flex-1">{t.resetBtn}</Button>
        </div>
      </TabsContent>
    </Tabs>
  );

  const resultSection = (
    <Tabs defaultValue="velocity">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="velocity">{t.resultTabVelocity}</TabsTrigger>
        <TabsTrigger value="acceleration">{t.resultTabAcceleration}</TabsTrigger>
      </TabsList>
      <TabsContent value="velocity" className="mt-4">
        {velocity !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{t.resultVelocity}</p>
            <p className="text-2xl font-bold">{velocity.toFixed(4)} m/s</p>
            <p className="text-sm text-muted-foreground mt-2">
              {(velocity * 3.6).toFixed(2)} km/h
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">{t.placeholder}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="acceleration" className="mt-4">
        {acceleration !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{t.resultAcceleration}</p>
            <p className="text-2xl font-bold">{acceleration.toFixed(4)} m/s²</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">{t.placeholder}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection(isKo)}
      variant="split"
    />
  );
}
