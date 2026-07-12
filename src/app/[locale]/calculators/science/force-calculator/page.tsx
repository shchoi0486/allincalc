'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const infoSection = (isKo: boolean) => {
  const L = (ko: string, en: string) => (isKo ? ko : en);
  return {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>{L('힘(Force) 계산기', 'Force Calculator')}</strong>{L('는 물리학의 가장 기본적인 원리 중 하나인 뉴턴의 제2운동법칙(F=ma)을 기반으로 작동하는 정교한 계산 도구입니다. 이 계산기는 특정 질량을 가진 물체에 원하는 가속도를 부여하는 데 필요한 힘의 크기를 정확하게 계산하며, 물리학적 현상을 이해하는 데 필수적인 역할을 합니다.', ' is a sophisticated calculation tool based on one of the most fundamental principles of physics, Newton’s second law of motion (F = ma). It accurately calculates the magnitude of force needed to give a desired acceleration to an object of a given mass, and is essential for understanding physical phenomena.')}
      </p>
      <p>
        {L('물리학에서 ', 'In physics, ')}<strong>{L('힘', 'force')}</strong>{L('은 물체의 운동 상태나 모양을 변화시키는 원인으로, 정지해 있는 물체를 움직이게 하거나 움직이는 물체의 속도나 방향을 바꾸는 상호작용을 의미합니다. 힘의 표준 단위는 아이작 뉴턴의 이름을 딴 ', ' is what causes a change in an object’s state of motion or shape — the interaction that moves a stationary object or changes the speed or direction of a moving one. The standard unit of force is named after Isaac Newton: the ')}<strong>{L('뉴턴(N)', 'newton (N)')}</strong>{L('이며, 1뉴턴은 1kg의 질량을 가진 물체를 1m/s²의 가속도로 가속시키는 데 필요한 힘으로 정의됩니다.', ', where 1 newton is defined as the force needed to accelerate a 1 kg mass at 1 m/s².')}
      </p>
      <p>
        {L('이 계산기는 학생들에게 물리학적 개념을 직관적으로 이해시키는 교육 도구로서, 엔지니어들에게는 구조 설계나 기계 개발 시 정확한 힘 분석을 제공하는 실용적인 도구로 활용됩니다. 또한 자동차 공학, 항공우주, 로봇 공학, 스포츠 과학 등 다양한 분야에서 힘의 원리를 활용하는 데 유용합니다.', 'This calculator serves as an educational tool that helps students intuitively understand physics concepts, and as a practical tool that gives engineers accurate force analysis for structural design and machine development. It is also useful across automotive engineering, aerospace, robotics, and sports science.')}
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        {L('일상생활에서도 힘의 개념은 폭넓게 적용됩니다. 자동차의 가속 성능, 건물의 구조적 안전성, 스포츠 경기의 역학 분석, 심지어 우주 탐사선의 궤도 설계까지 모두 힘의 계산이 바탕이 됩니다. 이 계산기를 통해 누구나 쉽게 물리학적 힘을 계산하고 분석할 수 있습니다.', 'The concept of force is also widely applied in daily life. From a car’s acceleration performance and a building’s structural safety to the mechanics of sports and even spacecraft orbit design, force calculation underlies them all. This calculator lets anyone easily compute and analyze physical force.')}
      </p>
      <TermGlossary items={[
        { term: L('뉴턴(N)', 'Newton (N)'), desc: L('힘의 국제 단위로, 1kg 질량을 1m/s²로 가속하는 데 필요한 힘입니다.', 'The international unit of force; the force needed to accelerate a 1 kg mass at 1 m/s².') },
        { term: L('질량(mass)', 'Mass'), desc: L('물체 고유의 물질량으로, 단위는 kg이며 중력에 의한 무게와는 구별됩니다.', 'An object’s intrinsic amount of matter, with unit kg, distinct from weight due to gravity.') },
        { term: L('가속도(acceleration)', 'Acceleration'), desc: L('속도가 변하는 정도를 나타내는 벡터량으로, 단위는 m/s²입니다.', 'A vector quantity indicating the rate of change of velocity, with unit m/s².') },
      ]} />
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('뉴턴의 제2운동법칙', 'Newton’s Second Law of Motion')}</h4>
        <p>{L('힘 계산의 핵심 공식은 다음과 같습니다.', 'The core formula for force calculation is as follows.')}</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">F = m × a</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">F</span>{L('는 힘(Force)을 나타내며, 단위는 뉴턴(N)입니다.', ' is force, with unit newton (N).')}</li>
          <li><span className="font-semibold">m</span>{L('은 물체의 질량(mass)을 나타내며, 단위는 킬로그램(kg)입니다.', ' is the object’s mass, with unit kilogram (kg).')}</li>
          <li><span className="font-semibold">a</span>{L('는 물체의 가속도(acceleration)를 나타내며, 단위는 미터 매 초 제곱(m/s²)입니다.', ' is the object’s acceleration, with unit meters per second squared (m/s²).')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('단계별 계산 과정', 'Step-by-Step Calculation')}</h4>
        <ol className="list-decimal list-inside mt-2 space-y-1 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg">
          <li>{L('질량(m)과 가속도(a) 값을 준비합니다.', 'Prepare the mass (m) and acceleration (a) values.')}</li>
          <li>{L('질량에 가속도를 곱합니다 (F = m × a).', 'Multiply mass by acceleration (F = m × a).')}</li>
          <li>{L('결과값의 단위는 뉴턴(N)이 됩니다.', 'The result has unit newton (N).')}</li>
        </ol>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('계산 예시', 'Example')}</h4>
        <p>{L('예를 들어, 질량이 1,000kg인 자동차를 3m/s²의 가속도로 움직이게 하려면?', 'For example, to move a 1,000 kg car with an acceleration of 3 m/s²?')}</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">F = 1,000 kg × 3 m/s² = 3,000 N</p>
        </div>
        <p>{L('따라서 3,000 뉴턴의 힘이 필요합니다. 이는 약 306kgf(킬로그램-force)에 해당합니다.', 'Therefore 3,000 newtons of force are required, equivalent to about 306 kgf (kilogram-force).')}</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('단위 변환 요령', 'Unit Conversion Tips')}</h4>
        <p>{L('정확한 계산을 위해 SI 단위계를 사용하는 것이 중요합니다.', 'Using the SI unit system is important for accurate calculations.')}</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('질량 변환:', 'Mass conversion:')}</strong> {L('그램(g) → kg: 1,000으로 나누기', 'gram (g) → kg: divide by 1,000')}</li>
          <li><strong>{L('가속도 변환:', 'Acceleration conversion:')}</strong> {L('km/h² → m/s²: 3.6²으로 나누기', 'km/h² → m/s²: divide by 3.6²')}</li>
          <li><strong>{L('힘 단위:', 'Force units:')}</strong> 1 N = 0.102 kgf, 1 kgf = 9.8 N</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('다양한 종류의 힘', 'Types of Forces')}</h4>
        <p>{L('실제 세계에서는 여러 종류의 힘이 동시에 작용합니다.', 'In the real world, several types of forces act simultaneously.')}</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('중력:', 'Gravity:')}</strong> {L('질량을 가진 두 물체 사이의 인력 (무게 = mg)', 'attraction between two masses (weight = mg)')}</li>
          <li><strong>{L('마찰력:', 'Friction:')}</strong> {L('두 물체 접촉면에서 운동을 방해하는 힘', 'force at a contact surface that opposes motion')}</li>
          <li><strong>{L('수직항력:', 'Normal force:')}</strong> {L('표면이 물체를 수직으로 밀어내는 힘', 'force with which a surface pushes an object perpendicularly')}</li>
          <li><strong>{L('장력:', 'Tension:')}</strong> {L('줄이나 사슬이 팽팽하게 당겨질 때 작용하는 힘', 'force exerted when a rope or chain is pulled taut')}</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ {L('주의사항', 'Caution')}</p>
        <p className="text-xs mt-1">
          {L('이 계산기는 알짜힘(Net Force)을 계산합니다. 실제 상황에서는 여러 힘이 동시 작용하므로, 모든 힘을 벡터로 분석하여 합력을 구해야 정확한 결과를 얻을 수 있습니다.', 'This calculator computes the net force. In real situations multiple forces act at once, so you must analyze all forces as vectors and find the resultant to get an accurate result.')}
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('실생활 적용 사례', 'Real-Life Applications')}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('자동차 공학:', 'Automotive engineering:')}</strong> {L('엔진 출력, 제동 시스템 설계', 'engine output, brake system design')}</li>
          <li><strong>{L('건축 및 토목:', 'Architecture and civil:')}</strong> {L('구조물에 작용하는 하중 분석', 'load analysis on structures')}</li>
          <li><strong>{L('스포츠 과학:', 'Sports science:')}</strong> {L('운동선수의 힘 분석 및 훈련 설계', 'athlete force analysis and training design')}</li>
          <li><strong>{L('우주 탐사:', 'Space exploration:')}</strong> {L('로켓의 추진력, 위성의 궤도 계산', 'rocket thrust, satellite orbit calculation')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('교육 활용법', 'Educational Use')}</h4>
        <p>{L('물리학 교육에서 이 계산기는 다음 개념을 이해하는 데 유용합니다.', 'In physics education, this calculator helps understand the following concepts.')}</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>{L('질량과 무게의 차이:', 'Mass vs. weight:')}</strong> {L('질량은 물체 고유의 속성, 무게는 중력에 의한 힘', 'mass is an object’s intrinsic property; weight is the force due to gravity')}</li>
          <li><strong>{L('가속도의 의미:', 'Meaning of acceleration:')}</strong> {L('속도 변화의 정도를 나타내는 벡터량', 'a vector quantity representing the degree of velocity change')}</li>
          <li><strong>{L('힘의 평형:', 'Force equilibrium:')}</strong> {L('알짜힘이 0일 때 물체는 정지하거나 등속 운동', 'when net force is zero, an object is at rest or in uniform motion')}</li>
        </ul>
      </div>
    </div>
  ),
  };
};

export default function ForceCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict.forceCalculator;
  const isKo = locale === 'ko';

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
        <Label htmlFor="mass">{t.inputMass}</Label>
        <Input
          id="mass"
          type="number"
          value={mass}
          onChange={(e) => setMass(e.target.value)}
          placeholder={isKo ? '예: 70' : 'e.g. 70'}
        />
      </div>
      <div>
        <Label htmlFor="acceleration">{t.inputAcceleration}</Label>
        <Input
          id="acceleration"
          type="number"
          value={acceleration}
          onChange={(e) => setAcceleration(e.target.value)}
          placeholder={isKo ? '예: 9.8' : 'e.g. 9.8'}
        />
      </div>
      <div className="flex space-x-2">
        <Button onClick={handleCalculate} className="flex-1">{t.calculateBtn}</Button>
        <Button onClick={handleReset} variant="outline" className="flex-1">{t.resetBtn}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {force !== null ? (
        <div className="p-4 bg-muted rounded-lg text-center">
          <p className="text-sm text-muted-foreground">{t.resultLabel}</p>
          <p className="text-2xl font-bold">{force.toLocaleString()} N</p>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg">{t.placeholder}</p>
        </div>
      )}
    </div>
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
