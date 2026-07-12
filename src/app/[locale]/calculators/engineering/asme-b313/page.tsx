'use client';

import React from 'react';
import AsmeB313Calculator from '@/components/engineering-calculator/AsmeB313Calculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function AsmeB313Page() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.asmeB313;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'ASME B31.3 배관 계산기는 공정 배관(Piping) 코드인 ASME B31.3에 따라, 내압을 받는 원형 배관의 필요 벽 두께 또는 허용 설계 압력을 구합니다. 화학·석유·가스 플랜트의 배관이 파열 없이 운전되도록 최소 두께와 안전 여유를 정합니다.',
            'The ASME B31.3 piping calculator applies the process-piping code ASME B31.3 to find the required wall thickness or the allowable internal design pressure of a circular pipe under pressure. It sets the minimum thickness and safety margin so plant piping operates without rupture.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '설계 압력·배관 외경·허용 응력·품질 계수·Y계수를 입력하면 필요 두께 t(제조 공차 반영)를, 두께를 입력하면 허용 압력 P를 계산합니다.',
              'Enter design pressure, outside diameter, allowable stress, quality factor and Y coefficient to get the required thickness t (including mill tolerance), or enter thickness to get the allowable pressure P.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('플랜트 배관의 파열 방지 및 안전 설계', 'Preventing pipe rupture and ensuring safe plant design')}</li>
            <li>{L('경제적 벽 두께 선정(과도한 두께 방지) 및 재질/등급 결정', 'Selecting economic wall thickness and choosing material grade')}</li>
            <li>{L('기존 배관의 잔여 허용 압력(감육 고려) 평가', 'Assessing remaining allowable pressure of in-service piping (allowing for wall loss)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('ASME B31.3 식', 'ASME B31.3 Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '원형 배관의 후육(두꺼운 벽)을 고려한 링 응력 평형식입니다. Y는 벽 두께 계수(온도·재질에 따라 0.4 등)입니다.',
              'It is a hoop-stress equilibrium relation that accounts for thick-wall pipe; Y is the wall-thickness coefficient (e.g. 0.4 depending on temperature and material).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-blue-600">t = (P × D) / (2 × (S × E + P × Y))</p>
            <p className="font-mono text-lg text-green-600">P = (2 × t × S × E) / (D − 2 × t × Y)</p>
          </div>
          <p className="text-sm mt-2">
            {L(
              '제조 공차(α)를 포함한 실제 필요 두께: t_req = t / (1 − α/100). 예: 공차 12.5%면 t_req = t / 0.875.',
              'Required thickness including mill tolerance α: t_req = t / (1 − α/100). E.g. with 12.5% tolerance, t_req = t / 0.875.',
            )}
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong>t</strong> — {L('필요 벽 두께 [mm (Metric) 또는 in (Imperial)]', 'Required wall thickness [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-red-600">P</strong> — {L('내부 설계 압력 [MPa (Metric) 또는 psi (Imperial)]', 'Internal design pressure [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong className="font-semibold text-green-600">D</strong> — {L('배관 외경 [mm (Metric) 또는 in (Imperial)]', 'Outside diameter of pipe [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-purple-600">S</strong> — {L('허용 인장 응력 [MPa (Metric) 또는 psi (Imperial)]', 'Allowable tensile stress [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong className="font-semibold text-orange-600">E</strong> — {L('품질(용접) 계수 (0.1 ~ 1.0)', 'Quality (weld joint) factor (0.1 ~ 1.0)')}</li>
          <li><strong>Y</strong> — {L('벽 두께 계수 (일반적으로 0.4)', 'Wall-thickness coefficient (commonly 0.4)')}</li>
          <li><strong>α</strong> — {L('제조 두께 공차 (예: 12.5%)', 'Manufacturer thickness tolerance (e.g. 12.5%)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('압력 P나 외경 D가 클수록, 허용 응력 S나 품질 계수 E가 작을수록 필요 두께 t가 커집니다.', 'Higher P or D, or lower S or E, increases the required thickness t.')}</li>
            <li>{L('Y항(P×Y)은 후육 배관에서 응력 분포를 보정하며, 얇은 벽에서는 무시할 수 있습니다.', 'The P×Y term corrects hoop stress for thick walls and is negligible for thin walls.')}</li>
            <li>{L('제조 공차를 빼지 않으면 실제 두께가 설계보다 얇아질 수 있으므로 t_req로 보정합니다.', 'Without the tolerance correction the delivered wall can be thinner than design, so t_req is used.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '외경 D = 114.3 mm, P = 1.5 MPa, S = 137.9 MPa, E = 1.0, Y = 0.4인 배관: t = (1.5×114.3)/(2×(137.9×1.0 + 1.5×0.4)) = 171.45 / 276.94 ≈ 0.619 mm. 공차 12.5%를 더하면 t_req ≈ 0.619/0.875 ≈ 0.707 mm가 필요합니다.',
              'For D = 114.3 mm, P = 1.5 MPa, S = 137.9 MPa, E = 1.0, Y = 0.4: t = (1.5×114.3)/(2×(137.9×1.0 + 1.5×0.4)) = 171.45/276.94 ≈ 0.619 mm. With 12.5% tolerance, t_req ≈ 0.619/0.875 ≈ 0.707 mm is required.',
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
            <li>{L('S 값은 ASME B31.3 부록 A의 재질별 허용 응력표에서 온도별로 선택하세요.', 'Select S from the ASME B31.3 Appendix A allowable-stress tables by material and temperature.')}</li>
            <li>{L('E는 용접 검사 수준(100% RT, 부분 검사 등)에 따라 결정되므로 시공 사양과 일치시켜야 합니다.', 'E depends on the level of weld examination (100% RT, spot, etc.) and must match the construction spec.')}</li>
            <li>{L('부식/침식 여유(CA)가 있으면 계산 두께에 반드시 더해야 합니다.', 'If a corrosion/erosion allowance (CA) applies, add it to the calculated thickness.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 내압에 의한 후크 응력만 다루며, 외압·굽힘·열응력·지지 조건은 별도로 검토해야 합니다.', 'This relation covers only internal-pressure hoop stress; external pressure, bending, thermal and support loads need separate checks.')}</li>
            <li>{L('충격·피로·고온 크리프가 중요한 배관은 추가 평가가 필요합니다.', 'Piping subject to shock, fatigue or high-temperature creep needs additional evaluation.')}</li>
            <li>{L('단위계(메트릭 MPa·mm ↔ 임페리얼 psi·in)를 일치시키세요.', 'Keep the unit system consistent (Metric MPa·mm vs Imperial psi·in).')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'ASME B31.3 배관 계산기' : 'ASME B31.3 Pipe Calculator')}
      description={t?.description || (ko ? 'ASME B31.3 코드 기반으로 배관의 허용 압력 또는 필요 벽 두께를 계산합니다.' : 'Calculate allowable pressure or required wall thickness of a pipe.')}
      icon={<span>🔧</span>}
      visualizationComponent={<></>}
      resultComponent={<AsmeB313Calculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
