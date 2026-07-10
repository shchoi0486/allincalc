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
        <strong>힘(Force) 계산기</strong>는 물리학의 가장 기본적인 원리 중 하나인 뉴턴의 제2운동법칙(F=ma)을 기반으로 작동합니다. 이 계산기는 특정 질량(mass)을 가진 물체에 특정 가속도(acceleration)를 부여하는 데 필요한 힘의 크기를 계산합니다.
      </p>
      <p>
        물리학에서 <strong>힘</strong>은 물체의 운동 상태나 모양을 변화시키는 원인입니다. 즉, 정지해 있는 물체를 움직이게 하거나, 움직이는 물체의 속도나 방향을 바꾸는 상호작용을 의미합니다. 힘의 표준 단위는 아이작 뉴턴의 이름을 딴 <strong>뉴턴(N)</strong>입니다. 1 뉴턴은 1킬로그램(kg)의 질량을 가진 물체를 1미터 매 초 제곱(m/s²)의 가속도로 가속시키는 데 필요한 힘으로 정의됩니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        이 계산기를 사용하면 질량과 가속도 값을 입력하여 간단하게 힘을 계산할 수 있습니다. 학생, 엔지니어, 또는 물리 법칙에 관심 있는 모든 사람에게 유용한 도구입니다. 차량의 엔진 출력, 건물의 구조적 안정성, 심지어 행성의 궤도를 계산하는 등 광범위한 분야에서 힘의 개념은 핵심적인 역할을 합니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">뉴턴의 제2운동법칙</h4>
        <p>힘 계산의 핵심 공식은 다음과 같습니다.</p>
        <div className="my-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
          <p className="font-mono text-xl font-bold">F = m × a</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">F</span>는 힘(Force)을 나타내며, 단위는 뉴턴(N)입니다.</li>
          <li><span className="font-semibold">m</span>은 물체의 질량(mass)을 나타내며, 단위는 킬로그램(kg)입니다.</li>
          <li><span className="font-semibold">a</span>는 물체의 가속도(acceleration)를 나타내며, 단위는 미터 매 초 제곱(m/s²)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">계산 예시</h4>
        <p>예를 들어, 질량이 1,000kg인 자동차를 3m/s²의 가속도로 움직이게 하려면 얼마만큼의 힘이 필요할까요?</p>
        <ol className="list-decimal list-inside mt-2 space-y-1 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <li><strong>질량(m)</strong> = 1,000 kg</li>
          <li><strong>가속도(a)</strong> = 3 m/s²</li>
          <li><strong>힘(F)</strong> = 1,000 kg × 3 m/s² = 3,000 N</li>
        </ol>
        <p className="mt-2">따라서, 3,000 뉴턴의 힘이 필요합니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">다양한 종류의 힘</h4>
        <p>F=ma에서 'F'는 종종 '알짜힘(Net Force)'을 의미합니다. 실제 세계에서는 여러 종류의 힘이 동시에 작용할 수 있습니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>중력 (Gravity):</strong> 질량을 가진 두 물체 사이에 작용하는 인력입니다. 지구 표면에서 물체가 아래로 떨어지는 것은 지구의 중력 때문입니다. (무게 = 질량 × 중력가속도 g ≈ 9.8 m/s²)</li>
          <li><strong>마찰력 (Friction):</strong> 두 물체의 접촉면 사이에서 운동을 방해하는 힘입니다.</li>
          <li><strong>수직항력 (Normal Force):</strong> 물체가 다른 물체의 표면을 누를 때, 표면이 물체를 수직으로 밀어내는 힘입니다.</li>
          <li><strong>장력 (Tension):</strong> 줄이나 사슬 등이 팽팽하게 당겨질 때 작용하는 힘입니다.</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 단위의 중요성</p>
        <p className="text-xs mt-1">
          정확한 계산을 위해 반드시 표준 단위(SI 단위계)를 사용해야 합니다. 질량은 킬로그램(kg), 가속도는 미터 매 초 제곱(m/s²)으로 입력해야 뉴턴(N) 단위의 올바른 힘 값을 얻을 수 있습니다. 만약 다른 단위(그램, 파운드, km/h² 등)를 사용한다면, 계산 전에 표준 단위로 변환하는 과정이 필수적입니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
        <p>힘의 원리는 우리 주변 모든 곳에 적용됩니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>자동차 공학:</strong> 엔지니어는 자동차의 질량과 원하는 가속 성능을 고려하여 필요한 엔진의 힘(마력, 토크)을 설계합니다. 또한, 제동 시 필요한 마찰력을 계산하여 브레이크 시스템을 개발합니다.</li>
          <li><strong>건축 및 토목:</strong> 다리나 건물을 설계할 때, 바람, 지진, 자체 무게 등 다양한 힘들이 구조물에 어떻게 작용하는지 계산하여 안전성을 확보합니다.</li>
          <li><strong>스포츠 과학:</strong> 운동선수가 공을 던지거나, 점프하거나, 달릴 때 발생하는 힘을 분석하여 경기력을 향상시키는 훈련 방법을 개발합니다.</li>
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