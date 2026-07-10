'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>속도 계산기</strong>는 물체의 이동 속도와 가속도를 정확하게 계산하는 필수적인 물리학 도구입니다. 이 계산기는 <strong>평균 속도</strong>와 <strong>가속도</strong> 두 가지 핵심 개념을 다루며, 일상생활부터 전문 분야까지 폭넓게 활용됩니다.
      </p>
      <p>
        <strong>속도(velocity)</strong>는 물체의 위치 변화율로, 단위 시간당 이동하는 거리를 나타냅니다. 속도의 표준 단위는 <strong>미터 매 초(m/s)</strong>이며, 자동차의 속도, 달리기 속도, 바람의 속도 등 일상생활에서 매우 빈번하게 사용되는 물리량입니다. 속도는 방향을 포함한 벡터량으로, 동일한 속력이라도 방향이 다르면 서로 다른 속도가 됩니다.
      </p>
      <p>
        <strong>가속도(acceleration)</strong>는 속도의 변화율로, 단위 시간당 속도가 얼마나 변하는지를 나타냅니다. 가속도의 단위는 <strong>미터 매 초 제곱(m/s²)</strong>입니다. 자동차의 출발, 브레이크를 밟을 때의 감속, 자유 낙하 운동 등에서 중요한 역할을 하며, 양의 가속도는 속도 증가를, 음의 가속도는 감속을 의미합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        이 계산기는 학생들에게 운동학적 개념을 직관적으로 이해시키는 교육 도구로서, 엔지니어들에게는 차량 성능 분석, 교통 시스템 설계, 항공우주 프로젝트 등에서 정확한 속도 및 가속도 데이터를 제공하는 실용적인 도구로 활용됩니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">평균 속도 공식</h4>
        <p>물체가 일정한 거리를 이동하는 데 걸린 시간을 알고 있을 때 속도를 계산합니다.</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">v = d / t</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">v</span>는 속도(velocity)를 나타내며, 단위는 m/s입니다.</li>
          <li><span className="font-semibold">d</span>는 거리(distance)를 나타내며, 단위는 미터(m)입니다.</li>
          <li><span className="font-semibold">t</span>는 시간(time)을 나타내며, 단위는 초(s)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">가속도 공식</h4>
        <p>초기 속도와 최종 속도, 그리고 시간을 통해 가속도를 계산합니다.</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">a = (v - v₀) / t</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">a</span>는 가속도(acceleration)를 나타내며, 단위는 m/s²입니다.</li>
          <li><span className="font-semibold">v</span>는 최종 속도(final velocity)를 나타내며, 단위는 m/s입니다.</li>
          <li><span className="font-semibold">v₀</span>는 초기 속도(initial velocity)를 나타내며, 단위는 m/s입니다.</li>
          <li><span className="font-semibold">t</span>는 시간(time)을 나타내며, 단위는 초(s)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">계산 예시</h4>
        <p>예를 들어, 자동차가 100m를 5초 만에 주행했다면?</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">v = 100 m / 5 s = 20 m/s (72 km/h)</p>
        </div>
        <p>자동차가 초당 20미터를 이동하며, 이는 시속 72km에 해당합니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">핵심 공식 정리</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>평균 속도:</strong> v = d/t (거리/시간)</li>
          <li><strong>가속도:</strong> a = (v - v₀)/t (속도 변화율)</li>
          <li><strong>최종 속도:</strong> v = v₀ + at (등가속도 운동)</li>
          <li><strong>이동 거리:</strong> d = v₀t + ½at² (등가속도 운동)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">단위 변환 요령</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>1 m/s</strong> = 3.6 km/h (시속으로 변환: 3.6 곱하기)</li>
          <li><strong>1 km/h</strong> = 0.2778 m/s (초속으로 변환: 3.6 나누기)</li>
          <li><strong>1 mph</strong> ≈ 0.4470 m/s (마일퍼아워 → m/s)</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 속도와 속력의 차이</p>
        <p className="text-xs mt-1">
          물리학에서 <strong>속도(velocity)</strong>는 방향을 포함한 벡터량이고, <strong>속력(speed)</strong>는 방향이 없는 스칼라량입니다. 예를 들어, 10m/s로 북쪽으로 달리는 선수와 10m/s로 남쪽으로 달리는 선수는 속력은 같지만 속도는 다릅니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>교통공학:</strong> 도로 설계, 교통 흐름 분석, 신호 체계 설계</li>
          <li><strong>스포츠:</strong> 선수 기록 분석, 훈련 프로그램 설계</li>
          <li><strong>항공우주:</strong> 비행기 이륙 속도, 위성 궤도 속도 계산</li>
          <li><strong>자동차 공학:</strong> 0→100km/h 가속 시간, 제동 거리 계산</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">교육 활용법</h4>
        <p>이 계산기는 다음 개념을 이해하는 데 유용합니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>일정 속도 운동:</strong> 가속도가 0일 때의 등속 직선 운동</li>
          <li><strong>등가속도 운동:</strong> 중력 가속도(9.8 m/s²)를 이용한 자유 낙하</li>
          <li><strong>속도-시간 그래프:</strong> 기울기는 가속도, 면적은 이동 거리</li>
        </ul>
      </div>
    </div>
  ),
};

export default function VelocityCalculatorPage() {
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [velocity, setVelocity] = useState<number | null>(null);

  const [initialVelocity, setInitialVelocity] = useState('');
  const [finalVelocity, setFinalVelocity] = useState('');
  const [accelTime, setAccelTime] = useState('');
  const [acceleration, setAcceleration] = useState<number | null>(null);

  const handleVelocityCalculate = useCallback(() => {
    const d = parseFloat(distance);
    const t = parseFloat(time);
    if (!isNaN(d) && !isNaN(t) && t !== 0) {
      setVelocity(d / t);
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
    const t = parseFloat(accelTime);
    if (!isNaN(v0) && !isNaN(v) && !isNaN(t) && t !== 0) {
      setAcceleration((v - v0) / t);
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
        <TabsTrigger value="velocity">속도 계산</TabsTrigger>
        <TabsTrigger value="acceleration">가속도 계산</TabsTrigger>
      </TabsList>
      <TabsContent value="velocity" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="distance">거리 (m)</Label>
          <Input
            id="distance"
            type="number"
            value={distance}
            onChange={(e) => setDistance(e.target.value)}
            placeholder="예: 100"
          />
        </div>
        <div>
          <Label htmlFor="time">시간 (s)</Label>
          <Input
            id="time"
            type="number"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="예: 5"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleVelocityCalculate} className="flex-1">계산하기</Button>
          <Button onClick={handleVelocityReset} variant="outline" className="flex-1">초기화</Button>
        </div>
      </TabsContent>
      <TabsContent value="acceleration" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="initialVelocity">초기 속도 (m/s)</Label>
          <Input
            id="initialVelocity"
            type="number"
            value={initialVelocity}
            onChange={(e) => setInitialVelocity(e.target.value)}
            placeholder="예: 0"
          />
        </div>
        <div>
          <Label htmlFor="finalVelocity">최종 속도 (m/s)</Label>
          <Input
            id="finalVelocity"
            type="number"
            value={finalVelocity}
            onChange={(e) => setFinalVelocity(e.target.value)}
            placeholder="예: 20"
          />
        </div>
        <div>
          <Label htmlFor="accelTime">시간 (s)</Label>
          <Input
            id="accelTime"
            type="number"
            value={accelTime}
            onChange={(e) => setAccelTime(e.target.value)}
            placeholder="예: 5"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleAccelerationCalculate} className="flex-1">계산하기</Button>
          <Button onClick={handleAccelerationReset} variant="outline" className="flex-1">초기화</Button>
        </div>
      </TabsContent>
    </Tabs>
  );

  const resultSection = (
    <Tabs defaultValue="velocity">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="velocity">속도 결과</TabsTrigger>
        <TabsTrigger value="acceleration">가속도 결과</TabsTrigger>
      </TabsList>
      <TabsContent value="velocity" className="mt-4">
        {velocity !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">계산된 속도</p>
            <p className="text-2xl font-bold">{velocity.toFixed(4)} m/s</p>
            <p className="text-sm text-muted-foreground mt-2">
              {(velocity * 3.6).toFixed(2)} km/h
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="acceleration" className="mt-4">
        {acceleration !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">계산된 가속도</p>
            <p className="text-2xl font-bold">{acceleration.toFixed(4)} m/s²</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  return (
    <CalculatorsLayout
      title="속도 계산기"
      description="거리와 시간을 입력하여 속도, 또는 속도 변화를 통해 가속도를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
