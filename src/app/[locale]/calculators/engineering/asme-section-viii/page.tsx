'use client';

import React from 'react';
import AsmeSectionViiiCalculator from '@/components/engineering-calculator/AsmeSectionViiiCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function AsmeSectionViiiPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.asmeSectionViii;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'ASME Section VIII 압력용기 계산기는 보일러 및 압력용기 규격인 ASCE Section VIII Div.1에 따라, 내압을 받는 원통형·구형 쉘의 필요 벽 두께를 구합니다. 용기 파열을 막기 위해 후크 응력이 재료의 허용 응력을 넘지 않도록 두께를 정합니다.',
            'The ASME Section VIII vessel calculator applies the Boiler & Pressure Vessel Code Section VIII Div.1 to find the required wall thickness of cylindrical and spherical shells under internal pressure. It sets thickness so the hoop stress never exceeds the material\'s allowable stress and the vessel cannot burst.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '용기 형상(원통/구), 설계 압력 P, 내경 반경 R, 허용 응력 S, 접합 효율 E를 입력하면 필요 두께 t를 계산합니다.',
              'Enter vessel shape (cylinder/sphere), design pressure P, inside radius R, allowable stress S and joint efficiency E to obtain the required thickness t.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('압력용기·저장 탱크·열교환기 쉘의 안전 설계', 'Safe design of pressure vessels, storage tanks and heat-exchanger shells')}</li>
            <li>{L('재질·접합 방식(효율)에 따른 경제적 두께 결정', 'Economic thickness selection based on material and joint efficiency')}</li>
            <li>{L('기존 용기의 재평가 및 보수 설계', 'Re-rating and retrofit design of existing vessels')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('ASME Section VIII Div.1 식', 'ASME Section VIII Div.1')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '원통형은 종방향 용접부를 통한 후크 응력을, 구형은 전 방향 균일 응력을 기준으로 합니다. 분모의 0.6P·0.2P 항은 후육 보정입니다.',
              'The cylinder formula is based on hoop stress through the longitudinal weld; the sphere on uniform biaxial stress. The 0.6P / 0.2P terms in the denominator correct for thick walls.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-blue-600">Cylinder: t = (P × R) / (S × E − 0.6 × P)</p>
            <p className="font-mono text-lg text-teal-600">Sphere: t = (P × R) / (2 × S × E − 0.2 × P)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong>t</strong> — {L('필요 벽 두께 [mm (Metric) 또는 in (Imperial)]', 'Required wall thickness [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-red-600">P</strong> — {L('내부 설계 압력 [MPa (Metric) 또는 psi (Imperial)]', 'Internal design pressure [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong className="font-semibold text-green-600">R</strong> — {L('내경 반경 (Inside radius) [mm (Metric) 또는 in (Imperial)]', 'Inside radius [mm (Metric) or in (Imperial)]')}</li>
          <li><strong className="font-semibold text-purple-600">S</strong> — {L('최대 허용 응력값 [MPa (Metric) 또는 psi (Imperial)]', 'Maximum allowable stress value [MPa (Metric) or psi (Imperial)]')}</li>
          <li><strong className="font-semibold text-orange-600">E</strong> — {L('접합 효율 (0.1 ~ 1.0)', 'Joint efficiency (0.1 ~ 1.0)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('압력 P나 반경 R이 클수록, 허용 응력 S나 접합 효율 E가 작을수록 필요 두께 t가 커집니다.', 'Higher P or R, or lower S or E, increases required thickness t.')}</li>
            <li>{L('같은 조건에서 구형이 원통형보다 얇아집니다(분모의 2배 효과).', 'Under the same conditions a sphere is thinner than a cylinder (the denominator is doubled).')}</li>
            <li>{L('분모가 0 이하(허용 응력보다 압력이 지나치게 큼)가 되면 식이 성립하지 않으므로 계산이 거부됩니다.', 'If the denominator drops to zero or below (pressure far too high for the stress), the formula is invalid and no result is returned.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '원통형, P = 2.5 MPa, R = 500 mm, S = 138 MPa, E = 1.0인 경우: t = (2.5×500)/(138×1.0 − 0.6×2.5) = 1250 / 136.5 ≈ 9.16 mm가 필요합니다. 같은 조건의 구형은 t = 1250/(2×138 − 0.2×2.5) = 1250/275.5 ≈ 4.54 mm입니다.',
              'Cylinder with P = 2.5 MPa, R = 500 mm, S = 138 MPa, E = 1.0: t = (2.5×500)/(138×1.0 − 0.6×2.5) = 1250/136.5 ≈ 9.16 mm. A sphere under the same conditions gives t = 1250/(2×138 − 0.2×2.5) = 1250/275.5 ≈ 4.54 mm.',
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
            <li>{L('R은 내경 반경이므로 외경을 쓰는 B31.3 식과 혼동하지 마세요. 이 코드는 내경 기준입니다.', 'R is the inside radius — do not confuse it with the outside-diameter basis used in B31.3.')}</li>
            <li>{L('S는 ASME II Part D의 온도별 허용 응력에서, E는 접합 검사 등급(점진/전수 RT 등)에서 정합니다.', 'Take S from ASME II Part D by temperature and E from the joint-examination grade (progressive/full RT, etc.).')}</li>
            <li>{L('헤드(평판/타원/구형)나 플랜지·노즐은 별도의 부록 식을 사용합니다.', 'Heads (flat/elliptical/torispherical), flanges and nozzles use separate appendix formulas.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('내압 후크 응력만 다루며, 외압 좌굴·지지·열응력·피로는 별도 평가가 필요합니다.', 'Only internal-pressure hoop stress is covered; external-pressure buckling, supports, thermal and fatigue need separate checks.')}</li>
            <li>{L('최소 두께 및 부식 여유(CA) 규정도 적용해야 하므로 계산 두께에 CA를 더하세요.', 'Minimum-thickness and corrosion-allowance (CA) rules also apply, so add CA to the computed thickness.')}</li>
            <li>{L('단위계(Metric MPa·mm ↔ Imperial psi·in)를 일치시키세요.', 'Keep units consistent (Metric MPa·mm vs Imperial psi·in).')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'ASME Section VIII 압력용기 계산기' : 'ASME Section VIII Vessel Calculator')}
      description={t?.description || (ko ? '압력용기의 필요 벽 두께를 계산합니다.' : 'Calculate the required thickness for pressure vessels.')}
      icon={<span>🛡️</span>}
      visualizationComponent={<></>}
      resultComponent={<AsmeSectionViiiCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
