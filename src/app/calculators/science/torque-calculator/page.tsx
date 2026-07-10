'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TorqueCalculator = () => {
  const [force, setForce] = useState<number | ''>( '');
  const [distance, setDistance] = useState<number | ''>( '');
  const [forceUnit, setForceUnit] = useState('N');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [result, setResult] = useState<number | null>(null);

  const calculateTorque = () => {
    if (force === '' || distance === '') {
      alert('힘과 거리를 모두 입력해주세요.');
      return;
    }

    let forceInNewton = Number(force);
    if (forceUnit === 'kN') {
      forceInNewton *= 1000;
    } else if (forceUnit === 'lbf') {
      forceInNewton *= 4.44822;
    }

    let distanceInMeter = Number(distance);
    if (distanceUnit === 'cm') {
      distanceInMeter /= 100;
    } else if (distanceUnit === 'ft') {
      distanceInMeter *= 0.3048;
    }

    const torque = forceInNewton * distanceInMeter;
    setResult(torque);
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="force" className="w-24">힘 (F):</label>
        <Input
          id="force"
          type="number"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          placeholder="예: 50"
          className="flex-grow"
        />
        <Select onValueChange={setForceUnit} value={forceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N">N</SelectItem>
            <SelectItem value="kN">kN</SelectItem>
            <SelectItem value="lbf">lbf</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="distance" className="w-24">거리 (r):</label>
        <Input
          id="distance"
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder="예: 2"
          className="flex-grow"
        />
        <Select onValueChange={setDistanceUnit} value={distanceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculateTorque} className="self-start">계산</Button>
    </div>
  );

  const resultSection = (
    result !== null ? (
      <Card>
        <CardHeader>
          <CardTitle>계산 결과</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{result.toLocaleString()} N·m</p>
          <p className="text-sm text-muted-foreground mt-2">토크는 {result.toLocaleString()} 뉴턴 미터입니다.</p>
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center justify-center text-muted-foreground h-full">
        힘과 거리를 입력하고 계산 버튼을 눌러주세요.
      </div>
    )
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>토크(Torque)</strong>, 또는 <strong>돌림힘</strong>은 물체를 특정 축을 중심으로 <strong>회전</strong>시키려는 힘의 경향을 측정하는 물리량입니다. 단순히 물체를 밀거나 당기는 직선적인 힘(Force)과는 달리, 토크는 힘이 가해지는 <strong>위치</strong>와 <strong>방향</strong>에 따라 그 효과가 달라집니다.
        </p>
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          가장 쉬운 예는 문을 여는 것입니다. 문 경첩(회전축)에서 멀리 떨어진 문고리를 밀 때 가장 쉽게 열리고, 경첩에 가까운 곳을 밀수록 더 많은 힘이 필요합니다. 이처럼 회전축으로부터의 거리와 힘의 크기가 결합하여 회전 효과를 만들어내는 것이 바로 토크입니다.
        </p>
        <p>
          본 계산기는 힘과 회전축으로부터의 거리를 입력받아, 힘이 거리에 수직으로 작용할 때 발생하는 토크의 크기를 계산합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">토크 계산 기본 공식</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-center font-mono text-lg">τ = r × F</p>
          </div>
          <p className="mt-4">
            더 정확하게는, 토크는 힘(F)과 거리(r) 벡터의 외적(cross product)으로 정의됩니다. 그 크기는 다음과 같이 계산할 수 있습니다.
          </p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-2">
            <p className="text-center font-mono text-lg">τ = r * F * sin(θ)</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">τ (tau)</strong>: 토크, 국제 표준 단위는 <strong>뉴턴미터(N·m)</strong>입니다.</li>
            <li><strong className="font-semibold">r (radius)</strong>: 회전축에서 힘이 작용하는 지점까지의 거리(레버 암, Lever Arm), 단위는 <strong>미터(m)</strong>입니다.</li>
            <li><strong className="font-semibold">F (Force)</strong>: 가해지는 힘, 단위는 <strong>뉴턴(N)</strong>입니다.</li>
            <li><strong className="font-semibold">θ (theta)</strong>: 거리 벡터(r)와 힘 벡터(F) 사이의 각도입니다.</li>
          </ul>
           <p className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-lg text-sm">
            <strong>참고:</strong> 본 계산기는 가장 효율적인 경우, 즉 힘이 레버 암에 대해 <strong>수직(θ = 90°)</strong>으로 작용하는 상황을 가정합니다. sin(90°) = 1이므로, 공식은 τ = r * F로 단순화됩니다.
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 토크를 최대로 활용하는 방법</h4>
          <p>
            공식(τ = r * F * sin(θ))에서 알 수 있듯이, 토크를 최대로 만들기 위한 세 가지 핵심 요소가 있습니다.
          </p>
          <ul className="mt-2 list-decimal list-inside space-y-2">
            <li><strong>더 큰 힘(F) 가하기:</strong> 당연하게도 더 세게 밀거나 당기면 토크가 커집니다.</li>
            <li><strong>레버 암(r) 길게 하기:</strong> 회전축에서 최대한 멀리 떨어진 곳에 힘을 가합니다. 긴 렌치를 사용하면 짧은 렌치보다 볼트를 풀기 쉬운 이유입니다.</li>
            <li><strong>각도(θ)를 90도로 만들기:</strong> 레버 암에 수직으로 힘을 가할 때 토크가 최대가 됩니다. 렌치를 비스듬히 미는 것보다 직각으로 밀 때 가장 큰 힘을 발휘할 수 있습니다.</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">🔩 실생활 속 토크의 예시</h4>
          <ul className="space-y-4">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">🔧 공구 사용</p>
              <p className="text-xs mt-1">
                렌치나 스패너로 볼트를 조이거나 풀 때, 드라이버로 나사를 돌릴 때 우리는 토크를 사용합니다. '토크 렌치'는 특정 토크 값으로 정확하게 조이기 위해 사용하는 전문 공구입니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">🚗 자동차</p>
              <p className="text-xs mt-1">
                자동차 제원에서 '최대 토크'는 엔진이 낼 수 있는 최대 회전력을 의미합니다. 토크가 높을수록 정지 상태에서 출발하거나 언덕을 오를 때 더 강력한 힘을 발휘할 수 있습니다. (마력은 높은 속도에서의 성능과 관련이 깊습니다.)
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">🚲 자전거</p>
              <p className="text-xs mt-1">
                페달을 밟아 크랭크(회전축)를 돌리는 것이 바로 토크를 생성하는 과정입니다. 기어를 변속하는 것은 페달을 밟는 힘과 바퀴의 회전 속도 사이의 토크 관계를 조절하는 것입니다.
              </p>
            </li>
          </ul>
        </div>
         <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 rounded-r-lg">
          <p className="font-bold text-sm">🌀 토크의 방향: 오른손 법칙</p>
          <p className="text-xs mt-1">
            토크는 크기뿐만 아니라 방향도 가진 벡터량입니다. 그 방향은 보통 '오른손 법칙'으로 결정합니다. 오른손 네 손가락을 회전 방향으로 감았을 때, 엄지손가락이 가리키는 방향이 토크 벡터의 방향이 됩니다. (반시계 방향 회전은 보통 양(+)의 토크)
          </p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="토크 계산기"
      description="힘과 거리를 입력하여 토크(돌림힘)를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TorqueCalculator;