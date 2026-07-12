'use client';

import React from 'react';
import Iso1127PipeCalculator from '@/components/engineering-calculator/Iso1127PipeCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function Iso1127PipePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.iso1127Pipe;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'ISO 1127은 스테인리스강 관(튜브)의 치수, 허용 오차, 단위 무게를 규정한 국제 표준입니다. 이 계산기는 그 규격에 따라 외경과 두께로부터 관의 이론적 단위 무게와 내부 유로 단면적을 산출합니다.',
            'ISO 1127 is the international standard that specifies the dimensions, tolerances, and unit masses of stainless-steel tubes. This calculator applies that standard to determine a tube\'s theoretical mass per unit length and its internal flow area from the outer diameter and wall thickness.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '외경(D)과 벽 두께(t)를 입력하면 단위 길이당 무게(kg/m)와 관 내부의 유동 단면적(A)을 계산합니다.',
              'From the outer diameter (D) and wall thickness (t), it calculates the weight per unit length (kg/m) and the internal cross-sectional flow area (A).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관 자재의 무게 산정으로 운송·지지대·구조 하중 설계', 'Estimating material weight for shipping, supports, and structural load design')}</li>
            <li>{L('내부 단면적으로 유량·유속 및 압력손실 계산의 기초 제공', 'Providing the flow area needed to compute flow rate, velocity, and pressure drop')}</li>
            <li>{L('견적·구매를 위한 표준 규격 튜브의 정확한 사양 확인', 'Verifying exact specifications of standard tubes for quotations and procurement')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">
            {L('ISO 1127 강관 무게 공식', 'ISO 1127 Tube Weight Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '단위 무게는 관 벽의 단면적(원환 면적)에 재료 밀도를 곱해 구합니다. 상수 0.0246615는 π/4를 강철 밀도(7.85 g/cm³)와 단위 변환에 맞춰 정리한 값입니다.',
              'The unit mass is the cross-sectional area of the tube wall (an annulus) multiplied by the material density. The constant 0.0246615 packages π/4 together with the steel density (7.85 g/cm³) and the unit conversion.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <p className="font-mono text-lg text-center">W = (D − t) · t · 0.0246615</p>
            <p className="font-mono text-lg text-center">A = (π / 4) · (D − 2t)²</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">W</strong> — {L('단위 길이당 무게 [kg/m]', 'Weight per unit length [kg/m]')}</li>
          <li><strong className="font-semibold text-green-600">D</strong> — {L('외경 [mm]', 'Outer diameter [mm]')}</li>
          <li><strong className="font-semibold text-purple-600">t</strong> — {L('벽 두께 [mm]', 'Wall thickness [mm]')}</li>
          <li><strong className="font-semibold text-blue-600">A</strong> — {L('내부 유로 단면적 [mm²]', 'Internal flow area [mm²]')}</li>
          <li><strong className="font-semibold text-orange-600">0.0246615</strong> — {L('강철 밀도 상수 (7.85 g/cm³ 기준)', 'Density constant for steel (based on 7.85 g/cm³)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('무게 식의 (D − t)·t 는 관 벽 원환의 평균 지름 × 두께로, 벽 단면적에 비례합니다. 두께가 두꺼울수록 무게가 커집니다.', 'The (D − t)·t term is the wall annulus\' mean diameter × thickness, proportional to the wall area — a thicker wall means more mass.')}</li>
            <li>{L('내경은 D − 2t 이므로, 두께가 두꺼울수록 내부 단면적 A는 급격히 줄어듭니다.', 'The inner diameter is D − 2t, so a thicker wall sharply reduces the internal flow area A.')}</li>
            <li>{L('다른 금속(예: 스테인리스 304 ≈ 7.9~8.0 g/cm³)은 밀도 비율만큼 무게를 보정해야 합니다.', 'For other metals (e.g. stainless 304 ≈ 7.9–8.0 g/cm³), scale the weight by the density ratio.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '외경 D = 33.7 mm, 두께 t = 2.0 mm인 관의 무게는 W = (33.7 − 2.0) × 2.0 × 0.0246615 ≈ 1.56 kg/m. 내부 단면적은 A = (π/4) × (33.7 − 4.0)² ≈ 693 mm²입니다.',
              'For a tube with D = 33.7 mm and t = 2.0 mm, the weight is W = (33.7 − 2.0) × 2.0 × 0.0246615 ≈ 1.56 kg/m, and the internal area is A = (π/4) × (33.7 − 4.0)² ≈ 693 mm².',
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
            <li>{L('무게 상수는 강철(7.85 g/cm³) 기준입니다. 스테인리스강은 실제 밀도로 보정하면 약 1~2% 무거워집니다.', 'The constant assumes carbon steel (7.85 g/cm³); stainless is about 1–2% heavier when corrected to its actual density.')}</li>
            <li>{L('내부 단면적 A를 알면 유량 Q = A · v로 평균 유속을 바로 계산할 수 있습니다.', 'Once you know the flow area A, you can find mean velocity directly from Q = A · v.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 값은 공칭 치수 기준의 이론 무게입니다. 실제 제품은 ISO 1127의 허용 오차 범위 내에서 달라질 수 있습니다.', 'These are theoretical values based on nominal dimensions; actual product may vary within the ISO 1127 tolerances.')}</li>
            <li>{L('용접 비드, 표면 처리, 관 끝 가공 등은 무게에 포함되지 않습니다.', 'Weld beads, surface treatments, and end machining are not included in the weight.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('ISO 1127 스테인리스강 튜브', 'ISO 1127 Stainless Steel Tube')}
      description={t?.description || L('ISO 1127 규격에 따라 스테인리스강 튜브의 무게와 치수를 계산합니다.', 'Calculate weight and dimensions of stainless steel tubes according to ISO 1127.')}
      icon={<span>⭕</span>}
      visualizationComponent={<></>}
      resultComponent={<Iso1127PipeCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
