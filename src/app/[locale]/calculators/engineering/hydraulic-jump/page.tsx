'use client';

import React from 'react';
import HydraulicJumpCalculator from '@/components/engineering-calculator/HydraulicJumpCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function HydraulicJumpPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.hydraulicJump;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '수력 도약(Hydraulic Jump)은 개수로에서 빠르고 얕은 흐름(사류, supercritical)이 갑자기 느리고 깊은 흐름(상류, subcritical)으로 바뀌면서 수면이 급격히 솟구치는 현상입니다. 이 과정에서 난류와 소용돌이가 발생해 상당한 에너지가 소산됩니다.',
            'A hydraulic jump is the abrupt rise of the water surface in an open channel where a fast, shallow (supercritical) flow suddenly transitions to a slow, deep (subcritical) flow. The turbulence and eddies produced in this transition dissipate a significant amount of energy.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 도약 전 수심과 유속으로부터 상류측 프루드 수(Fr₁), 도약 후 수심(y₂, sequent depth), 그리고 도약에서 소산되는 에너지 손실(ΔE)을 계산합니다.',
              'This calculator determines the upstream Froude number (Fr₁), the depth after the jump (y₂, the sequent depth), and the energy loss (ΔE) dissipated in the jump, from the initial depth and velocity.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('댐 여수로·수문 하류의 감세공(stilling basin) 설계로 수류 에너지를 안전하게 소산', 'Designing stilling basins downstream of spillways and gates to safely dissipate flow energy')}</li>
            <li>{L('세굴 방지를 위한 도약 위치·길이 예측', 'Predicting the location and length of the jump to prevent scour')}</li>
            <li>{L('개수로 흐름 상태(사류/상류) 판정과 하류 수심 산정', 'Determining the flow regime (super-/subcritical) and computing downstream depth in open channels')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('수력 도약 방정식', 'Hydraulic Jump Equations')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '도약 전후의 수심 관계는 운동량 보존으로부터 유도되며, 상류측 프루드 수만으로 결정됩니다(Bélanger 방정식). 에너지 손실은 두 수심의 차이로부터 구합니다.',
              'The relation between the depths before and after the jump is derived from momentum conservation and depends only on the upstream Froude number (the Bélanger equation). The energy loss follows from the difference between the two depths.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <p className="font-mono text-base text-center">Fr₁ = v₁ / √(g · y₁)</p>
            <p className="font-mono text-base text-center">y₂ = (y₁ / 2) · [ √(1 + 8·Fr₁²) − 1 ]</p>
            <p className="font-mono text-base text-center">ΔE = (y₂ − y₁)³ / (4 · y₁ · y₂)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">Fr₁</strong> — {L('상류측(도약 전) 프루드 수 (무차원)', 'Upstream (pre-jump) Froude number (dimensionless)')}</li>
          <li><strong className="font-semibold text-teal-600">v₁</strong> — {L('도약 전 유속 [m/s]', 'Velocity before the jump [m/s]')}</li>
          <li><strong className="font-semibold text-green-600">y₁, y₂</strong> — {L('도약 전 수심 / 도약 후 수심(sequent depth) [m]', 'Depth before the jump / sequent depth after the jump [m]')}</li>
          <li><strong className="font-semibold text-purple-600">g</strong> — {L('중력 가속도 (9.81 m/s²)', 'Acceleration of gravity (9.81 m/s²)')}</li>
          <li><strong className="font-semibold text-red-600">ΔE</strong> — {L('단위 무게당 에너지 손실(수두 손실) [m]', 'Energy (head) loss per unit weight [m]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Fr₁ > 1일 때만 사류이며 수력 도약이 발생합니다. Fr₁ ≤ 1이면 도약이 생기지 않습니다.', 'A jump occurs only when Fr₁ > 1 (supercritical). If Fr₁ ≤ 1, no jump forms.')}</li>
            <li>{L('Fr₁이 클수록 도약 후 수심 y₂가 커지고 에너지 손실 ΔE도 급격히 증가합니다.', 'The larger Fr₁ is, the greater the sequent depth y₂ and the more sharply the energy loss ΔE grows.')}</li>
            <li>{L('에너지 손실은 (y₂ − y₁)의 세제곱에 비례하므로, 강한 도약일수록 소산 능력이 매우 큽니다.', 'Energy loss scales with the cube of (y₂ − y₁), so stronger jumps dissipate dramatically more energy.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '도약 전 수심 y₁ = 0.3 m, 유속 v₁ = 6 m/s라면 Fr₁ = 6 / √(9.81 × 0.3) ≈ 3.5 (사류). 도약 후 수심 y₂ = (0.3/2)·[√(1 + 8×3.5²) − 1] ≈ 1.35 m, 에너지 손실 ΔE = (1.35 − 0.3)³ / (4 × 0.3 × 1.35) ≈ 0.71 m가 됩니다.',
              'For y₁ = 0.3 m and v₁ = 6 m/s, Fr₁ = 6 / √(9.81 × 0.3) ≈ 3.5 (supercritical). The sequent depth is y₂ = (0.3/2)·[√(1 + 8×3.5²) − 1] ≈ 1.35 m, and the energy loss is ΔE = (1.35 − 0.3)³ / (4 × 0.3 × 1.35) ≈ 0.71 m.',
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
            <li>{L('Fr₁에 따라 도약의 종류가 나뉩니다: 1.7~2.5는 약한 도약, 2.5~4.5는 진동 도약, 4.5~9.0은 안정된(정상) 도약으로 감세공에 이상적입니다.', 'The jump type depends on Fr₁: 1.7–2.5 is a weak jump, 2.5–4.5 an oscillating jump, and 4.5–9.0 a steady jump that is ideal for stilling basins.')}</li>
            <li>{L('도약 길이는 대략 6·y₂ 정도로 잡아 감세공 길이를 설계하는 경험식이 널리 쓰입니다.', 'The jump length is often estimated as roughly 6·y₂ to size stilling basins.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 수평·직사각형 단면의 개수로를 가정합니다. 경사가 크거나 단면이 다르면 보정이 필요합니다.', 'The equations assume a horizontal, rectangular channel; steep slopes or other cross-sections require corrections.')}</li>
            <li>{L('바닥 마찰은 무시되므로, 실제 긴 구간에서는 마찰 손실을 별도로 고려해야 합니다.', 'Bed friction is neglected, so friction losses must be considered separately over long reaches.')}</li>
            <li>{L('진동 도약(Fr₁ 2.5~4.5)은 하류로 파를 전달해 침식을 유발할 수 있으므로 설계 시 피하는 것이 좋습니다.', 'Oscillating jumps (Fr₁ 2.5–4.5) send waves downstream that can cause erosion and are best avoided in design.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('수력 도약 계산기', 'Hydraulic Jump Calculator')}
      description={t?.description || L('개수로 수력 도약의 도약 후 수심과 에너지 손실을 계산합니다.', 'Calculate sequent depth and energy loss in an open channel hydraulic jump.')}
      icon={<span>🌊</span>}
      visualizationComponent={<></>}
      resultComponent={<HydraulicJumpCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
