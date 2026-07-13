'use client';

import React from 'react';
import MomentOfInertia from '@/components/engineering-calculator/MomentOfInertia';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict?.calculatorNames;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '단면 2차 모멘트(Moment of Inertia, 관성 모멘트)는 단면의 휨 강성을 나타내는 기하학적 성질입니다. 부재의 재료와 단면 형상에 따라 빔의 휨 거동이 달라지며, 구조 설계에서 반드시 계산해야 하는 값입니다.',
            'The second moment of area (moment of inertia) is a geometric property representing the bending stiffness of a cross-section. Bending behavior of members depends on material and section shape, and it must be calculated in structural design.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '사각형, 원형, T형, I형, 각형(앵글), 채널 등 다양한 단면 형상에 대해 단면 2차 모멘트(Ix, Iy)를 계산합니다. 단면의 중심축 기준으로 계산됩니다.',
              'Calculates the second moment of area (Ix, Iy) for various cross-section shapes including rectangular, circular, T-section, I-section, angle, and channel sections. Values are computed about the centroidal axis.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('빔·서포트의 휨 응력과 처짐 계산에 필수적인 단면 성질입니다', 'Essential section property for calculating bending stress and deflection of beams and supports')}</li>
            <li>{L('복합보(built-up section)의 등가 단면을 설계할 때 활용됩니다', 'Used when designing equivalent sections for built-up members')}</li>
            <li>{L('내진 설계에서 부재의 강성(stiffness) 결정에 직결됩니다', 'Directly related to determining member stiffness in seismic design')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('기본 단면의 2차 모멘트 공식', 'Second Moment of Area for Basic Sections')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '가장 흔히 사용되는 단면 형상들의 2차 모멘트 공식입니다. 모든 값은 단면 중심축(centroidal axis)을 기준으로 합니다.',
              'Formulas for the most commonly used cross-section shapes. All values are about the centroidal axis.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <div>
              <p className="font-semibold text-sm mb-1">{L('사각형 (Rectangle)', 'Rectangle')}</p>
              <p className="font-mono text-lg text-center text-purple-600">I = b × h³ / 12</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">{L('원형 (Circle)', 'Circle')}</p>
              <p className="font-mono text-lg text-center text-purple-600">I = π × d⁴ / 64</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">{L('빈 원형 (Hollow circle)', 'Hollow circle')}</p>
              <p className="font-mono text-lg text-center text-purple-600">I = π × (D⁴ − d⁴) / 64</p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">{L('I형 (I-beam)', 'I-beam')}</p>
              <p className="font-mono text-lg text-center text-purple-600">I = (BH³ − bh³) / 12</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">I</strong> — {L('단면 2차 모멘트 [mm⁴, cm⁴, m⁴]', 'Second moment of area [mm⁴, cm⁴, m⁴]')}</li>
          <li><strong className="font-semibold text-red-500">b, h</strong> — {L('사각형의 폭과 높이 [mm]', 'Width and height of rectangle [mm]')}</li>
          <li><strong className="font-semibold text-blue-600">d, D</strong> — {L('원의 직경 [mm] (D: 외경, d: 내경)', 'Circle diameter [mm] (D: outer, d: inner)')}</li>
          <li><strong className="font-semibold text-orange-600">B, H</strong> — {L('I형 외부 치수 [mm]', 'I-beam outer dimensions [mm]')}</li>
          <li><strong className="font-semibold text-purple-600">b, h (I형 내부)</strong> — {L('I형 복판(web) 제외 내부 치수 [mm]', 'I-beam internal dimensions excluding flanges [mm]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('단면계수와의 관계', 'Relation to section modulus')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">S = I / c</p>
            <p className="font-mono text-lg text-center text-purple-600">σ = M / S = M × c / I</p>
          </div>
          <ul className="space-y-2 text-sm mt-2">
            <li><strong className="font-semibold text-green-600">S</strong> — {L('단면계수(section modulus) [mm³]', 'Section modulus [mm³]')}</li>
            <li><strong className="font-semibold text-red-500">c</strong> — {L('중심축으로부터 가장 먼 섬유까지의 거리 [mm]', 'Distance from centroid to extreme fiber [mm]')}</li>
            <li><strong className="font-semibold text-blue-600">M</strong> — {L('휨 모멘트 [N·mm]', 'Bending moment [N·mm]')}</li>
            <li><strong className="font-semibold text-orange-600">σ</strong> — {L('휨 응력 [MPa]', 'Bending stress [MPa]')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('I형 강재는 강재 규격표(KS, JIS, ASTM)에서 Ix, Iy 값을 직접 확인할 수 있습니다', 'Ix and Iy values for I-beams can be looked up directly in steel specification tables (KS, JIS, ASTM)')}</li>
            <li>{L('빈 사각형(파이프)의 I는 바깥 사각형에서 안쪽 사각형을 뺀 값으로 계산합니다', 'The I of hollow rectangles (pipes) is calculated by subtracting the inner rectangle from the outer rectangle')}</li>
            <li>{L('편심 하중이 작용하면 비틀림(torsion) 모멘트도 함께 검토해야 합니다', 'When eccentric loads act, torsion moments must also be reviewed')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산기는 단면의 기하학적 성질만 계산하며, 재료 거동(항복, 파단)은 고려하지 않습니다', 'This calculator computes only the geometric properties of sections, not material behavior (yield, fracture)')}</li>
            <li>{L('합성 단면(복합재료)의 경우 유효 단면 변환이 필요하며 이 계산기로는 불가능합니다', 'Composite sections (multi-material) require effective section transformation, which this calculator cannot handle')}</li>
            <li>{L('국부 좌굴(local buckling)이 발생하면 유효 단면이 감소하므로 별도 검토가 필요합니다', 'Local buckling reduces effective section and requires separate review')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['moment-of-inertia'] || (ko ? '단면 2차 모멘트 계산기' : 'Moment of Inertia Calculator')}
      description={t?.['moment-of-inertia'] || (ko ? '다양한 단면의 2차 모멘트를 계산합니다' : 'Calculate second moment of area for various sections')}
      icon={<span>📐</span>}
      visualizationComponent={<></>}
      resultComponent={<MomentOfInertia />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
