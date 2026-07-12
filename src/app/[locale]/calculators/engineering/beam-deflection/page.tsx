'use client';

import React from 'react';
import BeamDeflectionCalculator from '@/components/engineering-calculator/BeamDeflectionCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function BeamDeflectionPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.beamDeflection;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '보 처짐(Beam Deflection) 계산기는 한쪽 끝이 고정되고 자유단에 집중 하중이 작용하는 외팔보(Cantilever beam)의 최대 처짐을 구합니다. 처짐은 구조물의 사용성(Serviceability) 지표로, 너무 크면 천장·바닥의 균열, 문틀 걸림, 진동 불쾌감 등을 유발합니다.',
            'The beam-deflection calculator finds the maximum deflection of a cantilever beam — fixed at one end with a point load at the free end. Deflection is a serviceability measure: too much of it causes cracks, sticking doors/frames and objectionable vibration.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '집중 하중 P, 보 길이 L, 탄성 계수 E, 단면 2차 모멘트 I를 입력하면 자유단 최대 처짐 δ를 계산합니다.',
              'Enter the point load P, beam length L, modulus of elasticity E and area moment of inertia I to obtain the maximum free-end deflection δ.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('처짐 한계(예: L/250, L/360) 만족 여부로 사용성 검토', 'Checking serviceability against deflection limits (e.g. L/250, L/360)')}</li>
            <li>{L('건축·기계 지지보의 강성(거푸집·배관 지지) 설계', 'Sizing stiffness of architectural and machine-support beams (formwork, pipe supports)')}</li>
            <li>{L('단면 형상(I)·재질(E) 변경이 처짐에 미치는 영향 비교', 'Comparing how section shape (I) and material (E) affect deflection')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('외팔보 처짐 식', 'Cantilever Beam Deflection')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '자유단에 집중 하중 P가 작용하는 외팔보의 최대 처짐은 길이의 3제곱에 비례합니다. 단위계 일관성만 지키면 미터법·야드·파운드 모두 같은 형태입니다.',
              'For a cantilever with point load P at the free end, maximum deflection is proportional to the cube of the length. With consistent units the formula is identical in SI and US customary systems.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-blue-600">δ = (P × L³) / (3 × E × I)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">δ</strong> — {L('최대 처짐 [mm (Metric) 또는 in (Imperial)]', 'Maximum deflection [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-red-600">P</strong> — {L('집중 하중 [kN (Metric) 또는 kip (Imperial)]', 'Point load [kN (Metric) or kip (Imperial)]')}</li>
          <li><strong className="font-semibold text-green-600">L</strong> — {L('보 길이 [m (Metric) 또는 ft (Imperial)]', 'Beam length [m (Metric) or ft (Imperial)]')}</li>
          <li><strong className="font-semibold text-purple-600">E</strong> — {L('탄성 계수 (강재 ≈ 200 GPa 또는 29 Mpsi)', 'Modulus of Elasticity (steel ≈ 200 GPa or 29 Mpsi)')}</li>
          <li><strong className="font-semibold text-orange-600">I</strong> — {L('단면 2차 모멘트 [cm⁴ (Metric) 또는 in⁴ (Imperial)]', 'Area moment of inertia [cm⁴ (Metric) or in⁴ (Imperial)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('처짐 δ는 길이 L의 3제곱에 비례하므로, 보를 두 배로 길게 하면 처짐은 8배가 됩니다.', 'Deflection δ scales with L³, so doubling the span increases deflection eightfold.')}</li>
            <li>{L('단면 2차 모멘트 I가 클수록(깊은·두꺼운 단면) 처짐이 작아집니다 — 강성 확보의 핵심입니다.', 'A larger moment of inertia I (deeper/thicker section) reduces deflection — the key to stiffness.')}</li>
            <li>{L('탄성 계수 E가 큰 재질(강재 > 알루미늄 > 목재)일수록 처짐이 작아집니다.', 'Higher modulus E (steel > aluminium > timber) gives less deflection.')}</li>
            <li>{L('하중 P가 클수록 처짐도 선형 비례하여 커집니다.', 'Larger load P increases deflection linearly.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'L = 5 m, P = 10 kN, E = 200 GPa(=200,000,000 kN/m²), I = 8000 cm⁴(=8000×10⁻⁸ m⁴ = 8×10⁻⁴ m⁴)인 강재 외팔보: δ = 10×5³/(3×200,000,000×8×10⁻⁴) = 1250 / 480,000 ≈ 0.00260 m = 2.6 mm. 처짐 한계 L/250 = 20 mm보다 작아 안전합니다.',
              'For a steel cantilever with L = 5 m, P = 10 kN, E = 200 GPa (=200,000,000 kN/m²), I = 8000 cm⁴ (=8×10⁻⁴ m⁴): δ = 10×5³/(3×200,000,000×8×10⁻⁴) = 1250/480,000 ≈ 0.00260 m = 2.6 mm, well under the L/250 = 20 mm limit.',
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
            <li>{L('처짐을 줄이려면 길이를 줄이거나, 단면 높이를 키워 I를 늘리는 것이 하중 감소보다 효과적입니다.', 'To cut deflection, shorten the span or increase section depth (raising I) — more effective than just reducing load.')}</li>
            <li>{L('균등 분포 하중(w)일 경우 δ = wL⁴/(8EI), 자유단 모멘트일 경우는 다른 계수를 쓰므로 하중 형태를 구분하세요.', 'For a uniform load w use δ = wL⁴/(8EI); other load cases have different coefficients — identify the load type.')}</li>
            <li>{L('처짐 한계는 용도별로 다릅니다(지붕 L/240, 천장 L/360 등). 설계 기준을 확인하세요.', 'Deflection limits vary by use (roof L/240, ceiling L/360, etc.); check the design code.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 탄성 한도 내, 작은 처짐, 한쪽 고정·다른 쪽 자유단의 이상 외팔보에만 적용됩니다.', 'This formula applies only to small elastic deflections of an ideal cantilever (fixed-free).')}</li>
            <li>{L('연속 보·단순 지지 보·외팔이 섞인 실제 구조는 경계 조건이 달라 다른 식이 필요합니다.', 'Real frames with continuous/simply-supported/ cantilever segments have different boundary conditions and need other formulas.')}</li>
            <li>{L('단위를 섞지 마세요. E·I·P·L의 단위가 한 계(SI 또는 US)로 일관되어야 합니다.', 'Do not mix units — E, I, P and L must be in one consistent system (SI or US).')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '보 처짐 계산기' : 'Beam Deflection Calculator')}
      description={t?.description || (ko ? '외팔보의 최대 처짐을 계산합니다.' : 'Calculate the maximum deflection of a cantilever beam.')}
      icon={<span>🏗️</span>}
      visualizationComponent={<></>}
      resultComponent={<BeamDeflectionCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
