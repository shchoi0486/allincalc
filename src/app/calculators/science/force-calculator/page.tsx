'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Label } from '@/components/ui/label';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>힘(Force) 계산기</strong>는 물리학의 가장 기본적인 원리 중 하나인 뉴턴의 제2운동법칙(F=ma)을 기반으로 작동하는 정교한 계산 도구입니다. 이 계산기는 특정 질량을 가진 물체에 원하는 가속도를 부여하는 데 필요한 힘의 크기를 정확하게 계산하며, 물리학적 현상을 이해하는 데 필수적인 역할을 합니다.
      </p>
      <p>
        물리학에서 <strong>힘</strong>은 물체의 운동 상태나 모양을 변화시키는 원인으로, 정지해 있는 물체를 움직이게 하거나 움직이는 물체의 속도나 방향을 바꾸는 상호작용을 의미합니다. 힘의 표준 단위는 아이작 뉴턴의 이름을 딴 <strong>뉴턴(N)</strong>이며, 1뉴턴은 1kg의 질량을 가진 물체를 1m/s²의 가속도로 가속시키는 데 필요한 힘으로 정의됩니다.
      </p>
      <p>
        이 계산기는 학생들에게 물리학적 개념을 직관적으로 이해시키는 교육 도구로서, 엔지니어들에게는 구조 설계나 기계 개발 시 정확한 힘 분석을 제공하는 실용적인 도구로 활용됩니다. 또한 자동차 공학, 항공우주, 로봇 공학, 스포츠 과학 등 다양한 분야에서 힘의 원리를应用하는 데 유용합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        일상생활에서도 힘의 개념은 폭넓게 적용됩니다. 자동차의 가속 성능, 건물의 구조적 안전성, 스포츠 경기의 역학 분석, 심지어 우주 탐사선의 궤도 설계까지 모두 힘의 계산이 바탕이 됩니다. 이 계산기를 통해 누구나 쉽게 물리학적 힘을 계산하고 분석할 수 있습니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">뉴턴의 제2운동법칙</h4>
        <p>힘 계산의 핵심 공식은 다음과 같습니다.</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">F = m × a</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">F</span>는 힘(Force)을 나타내며, 단위는 뉴턴(N)입니다.</li>
          <li><span className="font-semibold">m</span>은 물체의 질량(mass)을 나타내며, 단위는 킬로그램(kg)입니다.</li>
          <li><span className="font-semibold">a</span>는 물체의 가속도(acceleration)를 나타내며, 단위는 미터 매 초 제곱(m/s²)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">단계별 계산 과정</h4>
        <ol className="list-decimal list-inside mt-2 space-y-1 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <li>질량(m)과 가속도(a) 값을 준비합니다.</li>
          <li>질량에 가속도를 곱합니다 (F = m × a).</li>
          <li>결과값의 단위는 뉴턴(N)이 됩니다.</li>
        </ol>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">계산 예시</h4>
        <p>예를 들어, 질량이 1,000kg인 자동차를 3m/s²의 가속도로 움직이게 하려면?</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">F = 1,000 kg × 3 m/s² = 3,000 N</p>
        </div>
        <p>따라서 3,000 뉴턴의 힘이 필요합니다. 이는 약 306kgf(킬로그램-force)에 해당합니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">단위 변환 요령</h4>
        <p>정확한 계산을 위해 SI 단위계를 사용하는 것이 중요합니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>질량 변환:</strong> 그램(g) → kg: 1,000으로 나누기</li>
          <li><strong>가속도 변환:</strong> km/h² → m/s²: 3.6²으로 나누기</li>
          <li><strong>힘 단위:</strong> 1 N = 0.102 kgf, 1 kgf = 9.8 N</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">다양한 종류의 힘</h4>
        <p>실제 세계에서는 여러 종류의 힘이 동시에 작용합니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>중력:</strong> 질량을 가진 두 물체 사이의 인력 (무게 = mg)</li>
          <li><strong>마찰력:</strong> 두 물체 접촉면에서 운동을 방해하는 힘</li>
          <li><strong>수직항력:</strong> 표면이 물체를 수직으로 밀어내는 힘</li>
          <li><strong>장력:</strong> 줄이나 사슬이 팽팽하게 당겨질 때 작용하는 힘</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 주의사항</p>
        <p className="text-xs mt-1">
          이 계산기는 알짜힘(Net Force)을 계산합니다. 실제 상황에서는 여러 힘이 동시 작용하므로, 모든 힘을 벡터로 분석하여 합력을 구해야 정확한 결과를 얻을 수 있습니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>자동차 공학:</strong> 엔진 출력, 제동 시스템 설계</li>
          <li><strong>건축 및 토목:</strong> 구조물에 작용하는 하중 분석</li>
          <li><strong>스포츠 과학:</strong> 운동선수의 힘 분석 및 훈련 설계</li>
          <li><strong>우주 탐사:</strong> 로켓의 추진력, 위성의 궤도 계산</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">교육 활용법</h4>
        <p>물리학 교육에서 이 계산기는 다음 개념을 이해하는 데 유용합니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>질량과 무게의 차이:</strong> 질량은 물체 고유의 속성, 무게는 중력에 의한 힘</li>
          <li><strong>가속도의 의미:</strong> 속도 변화의 정도를 나타내는 벡터량</li>
          <li><strong>힘의 평형:</strong> 알짜힘이 0일 때 물체는 정지하거나 등속 운동</li>
        </ul>
      </div>
    </div>
  ),
};

export default function ForceCalculatorPage() {
  const [mass, setMass] = useState('');
  const [acceleration, setAcceleration] = useState('');
  const [force, setForce] = useState<number | null>(null);

  const handleCalculate = useCallback(() => {
    const massValue = parseFloat(mass);
    const accelerationValue = parseFloat(acceleration);

    if (!isNaN(massValue) && !isNaN(accelerationValue)) {
      setForce(massValue * accelerationValue);
    } else {
      setForce(null);
    }
  }, [mass, acceleration]);

  const handleReset = useCallback(() => {
    setMass('');
    setAcceleration('');
    setForce(null);
  }, []);

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label htmlFor="mass">질량 (kg)</Label>
        <Input
          id="mass"
          type="number"
          value={mass}
          onChange={(e) => setMass(e.target.value)}
          placeholder="예: 70"
        />
      </div>
      <div>
        <Label htmlFor="acceleration">가속도 (m/s²)</Label>
        <Input
          id="acceleration"
          type="number"
          value={acceleration}
          onChange={(e) => setAcceleration(e.target.value)}
          placeholder="예: 9.8"
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleCalculate} className="flex-1">계산하기</Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {force !== null ? (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">계산된 힘</p>
          <p className="text-2xl font-bold">{force.toLocaleString()} N</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
        </div>
      )}
    </div>
  );

  return (
    <CalculatorsLayout
      title="힘 계산기"
      description="질량과 가속도를 입력하여 힘(F=ma)을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}