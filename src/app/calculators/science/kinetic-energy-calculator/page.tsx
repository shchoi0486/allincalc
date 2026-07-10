'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const KineticEnergyCalculator = () => {
  const [calculationType, setCalculationType] = useState('linear'); // 'linear' or 'rotational'
  const [mass, setMass] = useState<number | ''>('');
  const [velocity, setVelocity] = useState<number | ''>('');
  const [momentOfInertia, setMomentOfInertia] = useState<number | ''>('');
  const [angularVelocity, setAngularVelocity] = useState<number | ''>('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    let ke;
    if (calculationType === 'linear') {
      if (mass === '' || velocity === '') {
        alert('질량과 속도를 입력해주세요.');
        return;
      }
      ke = 0.5 * Number(mass) * Math.pow(Number(velocity), 2);
    } else {
      if (momentOfInertia === '' || angularVelocity === '') {
        alert('관성 모멘트와 각속도를 입력해주세요.');
        return;
      }
      ke = 0.5 * Number(momentOfInertia) * Math.pow(Number(angularVelocity), 2);
    }
    setResult({ kineticEnergy: ke });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={() => setCalculationType('linear')} 
          variant={calculationType === 'linear' ? 'default' : 'outline'}
          className="flex-1"
        >
          선형 운동
        </Button>
        <Button 
          onClick={() => setCalculationType('rotational')} 
          variant={calculationType === 'rotational' ? 'default' : 'outline'}
          className="flex-1"
        >
          회전 운동
        </Button>
      </div>

      {calculationType === 'linear' ? (
        <>
          <div className="space-y-2">
            <label htmlFor="mass" className="text-sm font-medium">질량 (kg)</label>
            <Input 
              id="mass" 
              type="number" 
              value={mass} 
              onChange={(e) => setMass(Number(e.target.value))} 
              placeholder="예: 10"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="velocity" className="text-sm font-medium">속도 (m/s)</label>
            <Input 
              id="velocity" 
              type="number" 
              value={velocity} 
              onChange={(e) => setVelocity(Number(e.target.value))} 
              placeholder="예: 5"
            />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="momentOfInertia" className="text-sm font-medium">관성 모멘트 (kg·m²)</label>
            <Input 
              id="momentOfInertia" 
              type="number" 
              value={momentOfInertia} 
              onChange={(e) => setMomentOfInertia(Number(e.target.value))} 
              placeholder="예: 0.5"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="angularVelocity" className="text-sm font-medium">각속도 (rad/s)</label>
            <Input 
              id="angularVelocity" 
              type="number" 
              value={angularVelocity} 
              onChange={(e) => setAngularVelocity(Number(e.target.value))} 
              placeholder="예: 10"
            />
          </div>
        </>
      )}
      <Button onClick={calculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  const resultSection = result ? (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <p className="text-lg text-muted-foreground">계산된 운동 에너지</p>
      <div className="flex items-baseline my-4">
        <span className="text-6xl font-bold tracking-tight">
          {result.kineticEnergy.toLocaleString(undefined, { maximumFractionDigits: 4 })}
        </span>
        <span className="text-2xl font-medium text-muted-foreground ml-2">J</span>
      </div>
      <div className="bg-muted rounded-lg p-4 w-full">
        <p className="text-sm text-muted-foreground mb-2">입력값</p>
        <div className="text-sm space-y-1">
          {calculationType === 'linear' ? (
            <>
              <div className="flex justify-between">
                <span>질량:</span>
                <span className="font-medium">{mass} kg</span>
              </div>
              <div className="flex justify-between">
                <span>속도:</span>
                <span className="font-medium">{velocity} m/s</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>관성 모멘트:</span>
                <span className="font-medium">{momentOfInertia} kg·m²</span>
              </div>
              <div className="flex justify-between">
                <span>각속도:</span>
                <span className="font-medium">{angularVelocity} rad/s</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      정보를 입력하고 계산 버튼을 눌러주세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>운동 에너지(Kinetic Energy)</strong>는 이름에서 알 수 있듯이, 물체가 <strong>운동</strong>함으로써 가지게 되는 에너지입니다. 정지해 있는 물체는 운동 에너지가 0이지만, 움직이기 시작하는 순간부터 운동 에너지를 갖게 됩니다. 이 에너지는 물체의 <strong>질량(mass)</strong>이 클수록, 그리고 <strong>속도(velocity)</strong>가 빠를수록 커집니다.
        </p>
        <p className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          특히 중요한 점은 운동 에너지가 속도의 <strong>제곱</strong>에 비례한다는 것입니다. 즉, 속도가 2배 빨라지면 운동 에너지는 4배, 속도가 3배 빨라지면 9배로 기하급수적으로 증가합니다. 이것이 바로 과속 운전이 그토록 위험한 이유입니다.
        </p>
        <p>
          본 계산기는 두 가지 주요 유형의 운동 에너지를 계산할 수 있도록 설계되었습니다.
        </p>
        <div>
          <h4 className="font-bold text-lg mb-2">1. 병진 운동 에너지 (Translational Kinetic Energy)</h4>
          <p>
            물체가 한 지점에서 다른 지점으로 직선 또는 곡선 경로를 따라 <strong>이동</strong>할 때의 에너지입니다. 우리가 일상생활에서 '운동 에너지'라고 말할 때 대부분 이 병진 운동 에너지를 의미합니다. 예를 들어, 달리는 자동차, 날아가는 공, 걷고 있는 사람 모두 병진 운동 에너지를 가지고 있습니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2">2. 회전 운동 에너지 (Rotational Kinetic Energy)</h4>
          <p>
            물체가 특정 축을 중심으로 <strong>회전</strong>할 때의 에너지입니다. 팽이가 돌 때, 지구의 자전, 혹은 자동차 바퀴의 회전 등이 여기에 해당합니다. 회전 운동 에너지는 물체의 회전 속도(각속도)와 회전에 대한 저항을 나타내는 '관성 모멘트'에 의해 결정됩니다.
          </p>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">선형(병진) 운동 에너지 계산 공식</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-center font-mono text-lg">KE = ½ × m × v²</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">KE (Kinetic Energy)</strong>: 운동 에너지, 국제 표준 단위는 <strong>줄(Joule)</strong>입니다. 1J은 1뉴턴(N)의 힘으로 물체를 1미터(m) 이동시켰을 때 하는 일의 양과 같습니다.</li>
            <li><strong className="font-semibold">m (mass)</strong>: 물체의 질량, 단위는 <strong>킬로그램(kg)</strong>입니다.</li>
            <li><strong className="font-semibold">v (velocity)</strong>: 물체의 속도, 단위는 <strong>미터 매 초(m/s)</strong>입니다.</li>
          </ul>
        </div>
        <hr />
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">회전 운동 에너지 계산 공식</h4>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-center font-mono text-lg">KE = ½ × I × ω²</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">KE (Kinetic Energy)</strong>: 회전 운동 에너지, 단위는 마찬가지로 <strong>줄(Joule)</strong>입니다.</li>
            <li><strong className="font-semibold">I (Moment of Inertia)</strong>: 관성 모멘트, 단위는 <strong>kg·m²</strong>입니다. 물체가 회전 운동의 변화에 얼마나 저항하는지를 나타내는 척도입니다. 질량이 클수록, 그리고 질량이 회전축에서 멀리 분포할수록 관성 모멘트가 커집니다. (예: 피겨 스케이팅 선수가 팔을 펴면 회전 속도가 느려지고, 팔을 오므리면 빨라지는 원리)</li>
            <li><strong className="font-semibold">ω (omega, Angular Velocity)</strong>: 각속도, 단위는 <strong>라디안 매 초(rad/s)</strong>입니다. 물체가 단위 시간당 얼마나 많은 각도를 회전하는지를 나타냅니다.</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">💡 일-에너지 정리 (Work-Energy Theorem)</h4>
          <p>
            물리학의 핵심 원리 중 하나로, <strong>"물체에 가해진 총 일(net work)의 양은 물체의 운동 에너지 변화량과 같다"</strong>는 정리입니다. 즉, 외부에서 물체에 양(+)의 일을 해주면 운동 에너지가 증가(속도가 빨라짐)하고, 음(-)의 일을 해주면(마찰력 등) 운동 에너지가 감소(속도가 느려짐)합니다. 자동차 브레이크는 마찰력을 이용해 운동 에너지를 열에너지로 변환하여 차를 멈추게 하는 대표적인 예입니다.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">🚀 실생활 속 운동 에너지 활용 사례</h4>
          <ul className="space-y-4">
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">🚗 교통 및 안전</p>
              <p className="text-xs mt-1">
                자동차의 속도가 2배가 되면 운동 에너지는 4배가 됩니다. 이는 제동 거리가 4배로 늘어나고, 충돌 시 파괴력도 4배가 됨을 의미합니다. 자동차 안전 테스트(충돌 테스트)는 바로 이 운동 에너지를 어떻게 효과적으로 흡수하여 탑승자를 보호하는지를 평가하는 과정입니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">⚾ 스포츠 과학</p>
              <p className="text-xs mt-1">
                야구 투수가 와인드업 동작을 통해 몸 전체를 사용하여 공에 운동 에너지를 최대로 전달하는 것처럼, 대부분의 스포츠는 운동 에너지의 효율적인 전달과 관련이 깊습니다. 골프 스윙, 테니스 서브, 축구 킥 모두 운동 에너지의 원리를 활용합니다.
              </p>
            </li>
            <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">💨 재생 에너지</p>
              <p className="text-xs mt-1">
                풍력 발전기는 바람의 운동 에너지를, 수력 발전기는 낙하하는 물의 위치 에너지가 변환된 운동 에너지를, 파력 발전기는 파도의 운동 에너지를 포착하여 전기 에너지로 변환합니다. 이는 자연의 운동 에너지를 인류에게 유용한 에너지 형태로 바꾸는 기술입니다.
              </p>
            </li>
             <li className="p-3 border rounded-lg">
              <p className="font-semibold text-sm">🌌 천문학 및 우주 탐사</p>
              <p className="text-xs mt-1">
                소행성이나 혜성이 지구에 충돌할 때의 파괴력은 그 천체의 거대한 질량과 속도가 만들어내는 엄청난 운동 에너지 때문입니다. 반대로 우주 탐사선이 다른 행성의 중력을 이용해 속도를 높이는 '중력 도움(Slingshot)' 기술 또한 행성의 운동 에너지를 일부 활용하는 것입니다.
              </p>
            </li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
          <p className="font-bold text-sm">⚠️ 상대성 이론에 대하여</p>
          <p className="text-xs mt-1">
            본 계산기에서 사용하는 공식(KE = ½mv²)은 물체의 속도가 빛의 속도에 비해 매우 느릴 때 유효한 고전 역학의 공식입니다. 물체의 속도가 빛의 속도에 가까워지면(상대론적 속도), 질량이 증가하는 효과 등을 고려한 아인슈타인의 특수 상대성 이론에 따른 다른 공식을 사용해야 합니다.
          </p>
        </div>
      </div>
    )
  };

  return (
    <CalculatorsLayout
      title="운동 에너지 계산기"
      description="질량과 속도 또는 관성 모멘트와 각속도를 입력하여 운동 에너지를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default KineticEnergyCalculator;