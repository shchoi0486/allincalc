'use client';

import React from 'react';
import FreeFallCalculator from '@/components/engineering-calculator/FreeFallCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function FreeFallCalculatorPage() {
  const { dict, locale, unitSystem } = useI18n();
  const t = dict?.freeFall;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);
  const imperial = unitSystem === 'imperial';
  const velUnit = imperial ? 'ft/s' : 'm/s';
  const lenUnit = imperial ? 'ft' : 'm';
  const gVal = imperial ? '32.174 ft/s²' : '9.80665 m/s²';

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '자유 낙하(Free Fall)는 물체가 오직 중력의 작용만 받으며 떨어지는 운동을 말합니다. 공기 저항을 무시하면 모든 물체는 질량과 관계없이 동일한 중력 가속도 g로 가속되며, 이는 갈릴레오와 뉴턴이 확립한 고전역학의 기본 원리입니다.',
            'Free fall is the motion of an object under the influence of gravity alone. When air resistance is neglected, every object — regardless of its mass — accelerates at the same gravitational acceleration g. This is one of the foundational principles of classical mechanics established by Galileo and Newton.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 초기 속도, 낙하 시간, 중력 가속도를 이용해 낙하하는 물체의 최종 속도(v)와 이동 거리(s)를 구합니다. 등가속도 직선 운동(운동학) 방정식을 그대로 적용합니다.',
              'This calculator determines the final velocity (v) and the distance traveled (s) of a falling object from its initial velocity, the fall time, and gravitational acceleration. It applies the standard kinematic equations for uniformly accelerated straight-line motion.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('낙하 시간이나 낙하 높이로부터 충돌 속도를 예측 — 안전 설계와 사고 해석', 'Predicting impact velocity from drop height or fall time — for safety design and accident analysis')}</li>
            <li>{L('물리 실험·교육에서 운동학 방정식의 이해와 검증', 'Understanding and verifying kinematic equations in physics teaching and experiments')}</li>
            <li>{L('투하물·낙하물의 도달 거리 및 시간 산정', 'Estimating the reach and timing of dropped or projected objects')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('등가속도 운동 방정식', 'Equations of uniformly accelerated motion')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '중력이 일정한 가속도 g를 만들기 때문에, 자유 낙하는 등가속도 직선 운동으로 기술됩니다. 속도는 시간에 선형으로 증가하고, 거리는 시간의 제곱에 비례해 증가합니다.',
              'Because gravity produces a constant acceleration g, free fall is described by uniformly accelerated straight-line motion. The velocity grows linearly with time, while the distance grows with the square of time.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">v = v₀ + g · t</p>
            <p className="font-mono text-lg text-center">s = v₀ · t + ½ · g · t²</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">v</strong> — {L(`최종 속도 [${velUnit}]`, `Final velocity [${velUnit}]`)}</li>
          <li><strong className="font-semibold text-green-600">v₀</strong> — {L(`초기 속도 [${velUnit}]`, `Initial velocity [${velUnit}]`)}</li>
          <li><strong className="font-semibold text-purple-600">s</strong> — {L(`이동 거리 [${lenUnit}]`, `Distance traveled [${lenUnit}]`)}</li>
          <li><strong className="font-semibold text-red-600">t</strong> — {L('낙하 시간 [s]', 'Time of fall [s]')}</li>
          <li><strong className="font-semibold text-orange-600">g</strong> — {L(`중력 가속도 (${gVal})`, `Acceleration of gravity (${gVal})`)}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('낙하 시간 t가 길수록 속도는 선형으로, 거리는 제곱으로 커집니다.', 'The longer the fall time t, the higher the velocity (linearly) and the greater the distance (quadratically).')}</li>
            <li>{L('초기 속도 v₀가 0이면(정지 상태에서 놓음) v = g·t, s = ½·g·t²로 단순해집니다.', 'If the initial velocity v₀ is zero (released from rest), the equations simplify to v = g·t and s = ½·g·t².')}</li>
            <li>{L('물체의 질량은 식에 나타나지 않습니다 — 공기 저항이 없다면 무거운 물체와 가벼운 물체가 똑같이 떨어집니다.', 'The object\'s mass does not appear in the equations — without air resistance, heavy and light objects fall identically.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '정지 상태(v₀ = 0)에서 물체를 3초 동안 떨어뜨리면(g ≈ 9.80665 m/s²), 최종 속도는 v = 9.80665 × 3 ≈ 29.4 m/s이고, 이동 거리는 s = ½ × 9.80665 × 3² ≈ 44.1 m가 됩니다.',
              'Dropping an object from rest (v₀ = 0) for 3 seconds (g ≈ 9.80665 m/s²) gives a final velocity of v = 9.80665 × 3 ≈ 29.4 m/s and a distance of s = ½ × 9.80665 × 3² ≈ 44.1 m.',
            )}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('높이 h에서 정지 낙하하는 물체의 도달 시간은 t = √(2h/g), 충돌 속도는 v = √(2·g·h)로도 구할 수 있습니다.', 'For a drop from height h at rest, the time is t = √(2h/g) and the impact speed is v = √(2·g·h).')}</li>
            <li>{L('g는 위도와 고도에 따라 약간 달라집니다. 표준 중력 9.80665 m/s²는 지구 평균값입니다.', 'g varies slightly with latitude and altitude; the standard value 9.80665 m/s² is Earth\'s average.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산은 공기 저항이 없는 진공 조건을 가정합니다. 실제로는 항력이 작용하며, 속도가 빠르고 표면적이 클수록 그 영향이 큽니다.', 'The calculation assumes vacuum conditions with no air resistance. In reality drag acts on the object, and its effect grows with higher velocity and larger surface area.')}</li>
            <li>{L('충분히 오래 떨어지면 항력과 중력이 균형을 이뤄 종단 속도(terminal velocity)에 도달하며, 이때는 등가속도 식이 성립하지 않습니다.', 'Over a long enough fall, drag balances gravity and the object reaches terminal velocity, at which point the constant-acceleration equations no longer apply.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('자유 낙하 계산기', 'Free Fall Calculator')}
      description={t?.description || L('초기 속도와 낙하 시간으로 최종 속도와 이동 거리를 계산합니다.', 'Calculate final velocity and distance from initial velocity and fall time.')}
      icon={<span>🍎</span>}
      visualizationComponent={<></>}
      resultComponent={<FreeFallCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
