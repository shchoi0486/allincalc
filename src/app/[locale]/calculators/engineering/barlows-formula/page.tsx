'use client';

import React from 'react';
import BarlowsFormulaCalculator from '@/components/engineering-calculator/BarlowsFormulaCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function BarlowsFormulaPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.barlowsFormula;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'Barlow 공식 계산기는 관(Pipe)·압력 용기의 원주 방향 응력(후크 응력) 평형에서 도출한 식으로, 강관이 견딜 수 있는 항복 압력, 파열(최종) 압력, 그리고 설계 계수가 적용된 최대 허용 압력을 구합니다. 배관의 설계·시공·잔존 수명 평가에 기본적으로 쓰입니다.',
            'Barlow\'s formula calculator is derived from the circumferential (hoop) stress equilibrium of a pipe or pressure vessel. It gives the pressure at minimum yield, the ultimate burst pressure, and the maximum allowable pressure with design factors applied — a foundation of pipeline design, construction and remaining-life assessment.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '외경 D_o, 벽 두께 t, 항복/인장 강도(S_y, S_t)와 설계·이음·온도 계수(F_d, F_e, F_t)를 입력하면 항복 압력 P_y, 파열 압력 P_t, 허용 압력 P_a를 계산합니다.',
              'Enter outside diameter D_o, wall thickness t, yield/ultimate strengths (S_y, S_t) and the design/joint/temperature factors (F_d, F_e, F_t) to get yield pressure P_y, burst pressure P_t and allowable pressure P_a.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('송유·가스 배관의 설계 압력(MOP) 및 파열 안전 여유 산정', 'Setting pipeline design (MOP) pressure and burst safety margin')}</li>
            <li>{L('기존 강관의 잔존 허용 압력(감육·온도 영향) 평가', 'Assessing remaining allowable pressure of in-service pipe (wall loss, temperature)')}</li>
            <li>{L('계수 변화(용접 이음, 고온)가 허용 압력에 미치는 영향 검토', 'Reviewing how factors (welded joint, high temperature) affect allowable pressure')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('Barlow 공식', 'Barlow\'s Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '원주 응력 σ = P·D/(2t) 평형에서 유도된 식으로, 분모의 외경 D_o를 사용하는 형태입니다(중심선 지름을 쓰는 다른 변형도 있음).',
              'Derived from hoop-stress equilibrium σ = P·D/(2t), using the outside diameter D_o in the denominator (other variants use the mean diameter).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-orange-600">P_y = (2 × S_y × t) / D_o</p>
            <p className="font-mono text-lg text-red-500">P_t = (2 × S_t × t) / D_o</p>
            <p className="font-mono text-lg text-blue-600">P_a = (2 × S_y × F_d × F_e × F_t × t) / D_o</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-orange-600">P_y</strong> — {L('항복 압력 (Yield pressure) [MPa (Metric) 또는 psi (Imperial)]', 'Pressure at yield [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong className="font-semibold text-red-500">P_t</strong> — {L('파열(최종) 압력 [MPa 또는 psi]', 'Burst (ultimate) pressure [MPa or psi]')}</li>
          <li><strong className="font-semibold text-blue-600">P_a</strong> — {L('최대 허용 압력 [MPa 또는 psi]', 'Maximum allowable pressure [MPa or psi]')}</li>
          <li><strong className="font-semibold text-green-600">S_y, S_t</strong> — {L('항복/인장 강도 [MPa (Metric) 또는 psi (Imperial)]', 'Yield / Ultimate tensile strength [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong>t</strong> — {L('벽 두께 [mm (Metric) 또는 in (Imperial)]', 'Wall thickness [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-purple-600">D_o</strong> — {L('관 외경 [mm (Metric) 또는 in (Imperial)]', 'Pipe outside diameter [mm (Metric) or in (Imperial)]')}</li>
          <li><strong>F_d, F_e, F_t</strong> — {L('설계·이음·온도 계수 (보통 0.72·1.0·1.0)', 'Design / Joint / Temperature factors (often 0.72 · 1.0 · 1.0)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('두께 t가 두배면 견딜 수 있는 압력도 두배, 외경 D_o가 클수록 압력은 작아집니다(역비례).', 'Doubling thickness doubles the pressure it can hold; larger D_o lowers pressure (inverse proportionality).')}</li>
            <li>{L('P_a는 항복 강도에 설계 계수 F_d(예 0.72)를 곱하므로 P_y보다 훨씬 낮습니다 — 이것이 안전 여유입니다.', 'P_a multiplies yield strength by the design factor F_d (e.g. 0.72), so it is well below P_y — that is the safety margin.')}</li>
            <li>{L('이음 계수 F_e(용접 이음 감소)나 온도 계수 F_t(고온 강도 저하)가 1보다 작으면 허용 압력이 낮아집니다.', 'Joint factor F_e (welded-joint reduction) or temperature factor F_t (high-temp strength drop) below 1 lowers allowable pressure.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '외경 D_o = 219.1 mm, t = 8.18 mm, S_y = 240 MPa, S_t = 415 MPa, F_d = 0.72, F_e = F_t = 1.0인 강관: P_y = 2×240×8.18/219.1 ≈ 17.9 MPa, P_t = 2×415×8.18/219.1 ≈ 31.0 MPa, P_a = 17.9×0.72 ≈ 12.9 MPa입니다.',
              'For D_o = 219.1 mm, t = 8.18 mm, S_y = 240 MPa, S_t = 415 MPa, F_d = 0.72, F_e = F_t = 1.0: P_y = 2×240×8.18/219.1 ≈ 17.9 MPa, P_t = 2×415×8.18/219.1 ≈ 31.0 MPa, P_a = 17.9×0.72 ≈ 12.9 MPa.',
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
            <li>{L('송유관 설계는 보통 항복 기준이 아니라 파열 여유(일반 FS ≥ 1.25~2.0)와 변형 한계를 함께 봅니다.', 'Pipeline design usually checks burst margin (typical FS ≥ 1.25–2.0) and strain limits, not just yield.')}</li>
            <li>{L('고온에서는 S_y, S_t가 온도에 따라 떨어지므로 F_t로 보정하거나 온도별 강도표를 쓰세요.', 'At high temperature S_y, S_t drop, so apply F_t or use temperature-dependent strength tables.')}</li>
            <li>{L('감육(부식)이 있는 배관은 실측 최소 t를 입력해 잔여 P_a를 평가하세요.', 'For corroded pipe, enter the measured minimum t to assess remaining P_a.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Barlow 공식은 얇은 원통의 이상 응력 평형이며, 두꺼운 벽·재료 가소성 거동·결함(균열)은 반영하지 않습니다.', 'Barlow\'s formula is a thin-cylinder ideal-stress relation; thick walls, plasticity and flaws (cracks) are not captured.')}</li>
            <li>{L('실제 파열 압력은 용접 품질·잔류 응력·타원도에 따라 달라지므로 계수로 보수 설계해야 합니다.', 'Real burst pressure varies with weld quality, residual stress and ovality, so apply conservative factors.')}</li>
            <li>{L('단위계(Metric MPa·mm ↔ Imperial psi·in)를 일치시키세요.', 'Keep units consistent (Metric MPa·mm vs Imperial psi·in).')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? "Barlow 공식 계산기" : "Barlow's Formula Calculator")}
      description={t?.description || (ko ? '강관의 내압·허용압·파열압을 계산합니다.' : "Calculate the internal, allowable, and ultimate burst pressure of a pipe.")}
      icon={<span>🛢️</span>}
      visualizationComponent={<></>}
      resultComponent={<BarlowsFormulaCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
