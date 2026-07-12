'use client';

import React from 'react';
import EulerBucklingCalculator from '@/components/engineering-calculator/EulerBucklingCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function EulerBucklingPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.eulerBuckling;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '좌굴(buckling)은 가늘고 긴 기둥이 압축 하중을 받을 때, 재료가 압축 파괴에 이르기 전에 갑자기 옆으로 휘어져 무너지는 불안정 현상입니다. 오일러의 임계 좌굴 하중 공식은 이상적인 탄성 기둥이 좌굴을 일으키기 시작하는 최소 압축 하중을 예측합니다.',
            'Buckling is the instability in which a slender column under compression suddenly bows sideways and collapses before the material reaches its compressive strength. Euler’s critical load formula predicts the minimum compressive load at which an ideal elastic column begins to buckle.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것: 임계 좌굴 하중 P_cr', 'What this calculator finds: the critical buckling load P_cr')}</h4>
          <p>
            {L(
              'P_cr는 기둥이 좌굴 없이 견딜 수 있는 최대 축방향 압축 하중입니다. 이 값을 넘는 하중이 걸리면 기둥은 재료 강도와 무관하게 휘어져 붕괴합니다. 따라서 가느다란 부재의 설계에서는 압축 강도가 아니라 이 좌굴 하중이 지배적 기준이 됩니다.',
              'P_cr is the maximum axial compressive load a column can carry without buckling. Beyond this load, the column bows and collapses regardless of its material strength. For slender members, therefore, this buckling load — not the compressive strength — governs the design.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('기둥·지주·나사·피스톤 로드 등 압축 부재의 안전성 검증', 'Verifying the safety of compression members such as columns, struts, screws, and piston rods')}</li>
            <li>{L('단면 형상·재료·길이 변경이 안정성에 미치는 영향 비교', 'Comparing how changes in cross-section, material, or length affect stability')}</li>
            <li>{L('단부 지지 조건(고정/힌지)에 따른 유효 길이 반영', 'Accounting for end-support conditions (fixed/pinned) via the effective length')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('오일러의 임계 좌굴 하중 공식', "Euler's Critical Load Formula")}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '임계 하중은 재료의 강성(E), 단면의 형상(I), 그리고 유효 길이(K·L)로 결정됩니다.',
              'The critical load is set by the material stiffness (E), the cross-section shape (I), and the effective length (K·L).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">P_cr = (π² × E × I) / (K × L)²</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">P_cr</strong> — {L('임계 좌굴 하중 [N (lbf)]', 'Critical buckling load [N (lbf)]')}</li>
          <li><strong className="font-semibold text-blue-600">E</strong> — {L('영률 (탄성 계수) [Pa (psi)]', "Young's modulus [Pa (psi)]")}</li>
          <li><strong className="font-semibold text-green-600">I</strong> — {L('단면 2차 모멘트 (최소값 사용) [m⁴ (in⁴)]', 'Area moment of inertia (use the minimum) [m⁴ (in⁴)]')}</li>
          <li><strong className="font-semibold text-purple-600">L</strong> — {L('기둥의 지지되지 않은 길이 [m (in)]', 'Unsupported length of column [m (in)]')}</li>
          <li><strong className="font-semibold text-orange-600">K</strong> — {L('기둥의 유효 길이 계수 (양단 힌지=1.0, 양단 고정=0.5, 고정-자유=2.0)', 'Column effective-length factor (pinned–pinned = 1.0, fixed–fixed = 0.5, fixed–free = 2.0)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('임계 하중은 길이의 제곱에 반비례합니다. 기둥이 2배 길어지면 좌굴 하중은 1/4로 급감합니다.', 'The critical load is inversely proportional to the square of length — doubling the length cuts the buckling load to one-quarter.')}</li>
            <li>{L('단면 2차 모멘트 I가 클수록(재료를 중심에서 멀리 배치할수록) 임계 하중이 커집니다.', 'A larger moment of inertia I (material placed farther from the center) increases the critical load.')}</li>
            <li>{L('유효 길이 계수 K가 작을수록(단부를 더 강하게 고정할수록) 좌굴에 강해집니다.', 'A smaller effective-length factor K (stiffer end fixity) makes the column more resistant to buckling.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '강재(E = 200 GPa), I = 5×10⁻⁶ m⁴, 길이 L = 3 m, 양단 힌지(K = 1.0)인 기둥의 임계 하중은 P_cr = π² × 200×10⁹ × 5×10⁻⁶ / (1.0 × 3)² = π² × 1,000,000 / 9 ≈ 1.097×10⁶ N, 즉 약 1,097 kN입니다.',
              'For a steel column (E = 200 GPa), I = 5×10⁻⁶ m⁴, L = 3 m, pinned–pinned (K = 1.0): P_cr = π² × 200×10⁹ × 5×10⁻⁶ / (1.0 × 3)² = π² × 1,000,000 / 9 ≈ 1.097×10⁶ N, i.e. about 1,097 kN.',
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
            <li>{L('기둥은 가장 약한 축으로 좌굴하므로 항상 최소 단면 2차 모멘트(I_min)를 사용하세요.', 'A column buckles about its weakest axis, so always use the minimum moment of inertia (I_min).')}</li>
            <li>{L('실제 설계에서는 P_cr에 안전율(예: 2~3)을 적용해 허용 하중을 정합니다.', 'In practice, apply a safety factor (e.g. 2–3) to P_cr to set the allowable load.')}</li>
            <li>{L('중간에 지지대를 추가해 지지되지 않은 길이 L을 줄이면 좌굴 하중이 제곱으로 크게 증가합니다.', 'Adding an intermediate support to shorten the unsupported length L raises the buckling load quadratically.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('오일러 공식은 세장비가 큰(가늘고 긴) 탄성 기둥에만 유효합니다. 짧고 굵은 기둥은 좌굴 전에 항복하므로 존슨식 등을 써야 합니다.', 'Euler’s formula is valid only for slender elastic columns; short, stocky columns yield before buckling and need the Johnson formula instead.')}</li>
            <li>{L('재료가 비례 한도(탄성 영역) 내에 있어야 하며, 응력이 항복 강도를 넘으면 공식이 성립하지 않습니다.', 'The material must remain within its proportional (elastic) limit; the formula fails once stress exceeds the yield strength.')}</li>
            <li>{L('초기 휨·편심 하중·잔류 응력이 있으면 실제 좌굴 하중은 이론값보다 낮아집니다.', 'Initial crookedness, eccentric loading, or residual stress lowers the real buckling load below the theoretical value.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '오일러 좌굴 하중 계산기' : 'Euler Buckling Load Calculator')}
      description={t?.description || (ko ? '오일러 공식으로 기둥의 임계 좌굴 하중을 계산합니다.' : "Calculate the critical buckling load of a column using Euler's formula.")}
      icon={<span>🏛️</span>}
      visualizationComponent={<></>}
      resultComponent={<EulerBucklingCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
