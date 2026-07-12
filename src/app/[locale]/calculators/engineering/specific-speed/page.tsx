'use client';

import React from 'react';
import SpecificSpeedCalculator from '@/components/engineering-calculator/SpecificSpeedCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function SpecificSpeedPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.specificSpeed;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '비속도(Specific Speed, Ns)는 펌프의 형상, 특히 임펠러 형태를 나타내는 무차원 설계 지표입니다. 동일한 양정과 유량을 내는 펌프라도 임펠러가 원심형·사류형·축류형 중 어느 형태인지가 비속도로 결정됩니다. 즉 비속도는 "임펠러의 뼈대"를 대표하는 숫자입니다.',
            'Specific speed (Ns) is a dimensionless design parameter that characterizes the shape of a pump, especially its impeller. Two pumps that deliver the same head and flow may have radically different impeller geometries — radial, mixed, or axial — and that geometry is captured by specific speed. In short, Ns represents the "skeleton" of the impeller.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '본 계산기는 최고효율점(BEP)에서의 회전수 N, 유량 Q, 양정 H를 입력받아 펌프의 비속도 Ns를 계산합니다. 이 값을 기준으로 적절한 임펠러 형식을 선정하고, 펌프의 효율·흡입성능·운전 범위를 가늠할 수 있습니다.',
              'This calculator takes the rotational speed N, flow rate Q and head H at the best efficiency point (BEP) and computes the pump specific speed Ns. From this value you can select the proper impeller type and assess efficiency, suction performance and the operating range.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('설계 단계에서 임펠러 형식(원심/사류/축류)을 빠르게 결정', 'Quickly deciding the impeller form (radial/mixed/axial) at the design stage')}</li>
            <li>{L('비속도와 효율의 상관관계로 고효율 펌프 형식을 예측', 'Predicting the most efficient pump type from the efficiency-vs-Ns relationship')}</li>
            <li>{L(' cavitation(캐비테이션) 가능성과 흡입 여유도(NPSH) 평가', 'Estimating cavitation risk and net positive suction head (NPSH) margin')}</li>
            <li>{L('유사 펌프 모델 간의 성능 환산 및 스케일업', 'Scaling and performance translation between geometrically similar pump models')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('펌프 비속도 방정식', 'Pump Specific Speed Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '비속도는 "동일한 양정 1 m(또는 1 ft), 동일한 출력(또는 1 m³/s)을 내는 데 필요한 회전수"로 정의되며, 실무적으로는 최고효율점에서의 값으로 계산합니다.',
              'Specific speed is defined as the speed at which a geometrically similar impeller would deliver unit head at unit flow; in practice it is evaluated at the best efficiency point.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">N<sub>s</sub> = N · Q<sup>0.5</sup> / H<sup>0.75</sup></p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">N<sub>s</sub></strong> — {L('비속도 (무차원, 단위계에 따라 수치 범위가 다름)', 'Specific speed (dimensionless; numerical range depends on the unit system)')}</li>
          <li><strong className="font-semibold text-green-600">N</strong> — {L('펌프 회전수 [RPM]', 'Pump speed [RPM]')}</li>
          <li><strong className="font-semibold text-purple-600">Q</strong> — {L('최고효율점 유량 [m³/h 또는 US gpm]', 'Flow rate at best efficiency point [m³/h or US gpm]')}</li>
          <li><strong className="font-semibold text-red-600">H</strong> — {L('1단 양정(최고효율점) [m 또는 ft]', 'Head per stage at best efficiency point [m or ft]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('유량 Q가 클수록 Ns가 커집니다 → 대유량형(축류) 임펠러.', 'A larger flow Q raises Ns → high-flow (axial) impeller.')}</li>
            <li>{L('양정 H가 클수록 Ns가 작아집니다 → 고양정형(원심) 임펠러.', 'A larger head H lowers Ns → high-head (radial) impeller.')}</li>
            <li>{L('회전수 N이 높을수록 Ns가 커지며, 동일 성능의 펌프를 고속 소형으로 설계할 수 있습니다.', 'A higher speed N raises Ns, allowing a smaller, high-speed pump for the same duty.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('임펠러 선정 가이드', 'Impeller Selection Guide')}</h4>
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm">
            <ul className="list-disc list-inside space-y-1 ml-2 text-yellow-700 dark:text-yellow-300">
              <li><strong>{L('원심형(Radial Flow):', 'Radial Flow:')}</strong> {L('저유량·고양정. US 기준 Ns < 4000', 'Low flow, high head. Ns < 4000 (US)')}</li>
              <li><strong>{L('사류형(Mixed Flow):', 'Mixed Flow:')}</strong> {L('중유량·중양정. US 기준 Ns = 4000 ~ 8000', 'Medium flow, medium head. Ns = 4000 ~ 8000 (US)')}</li>
              <li><strong>{L('축류형(Axial Flow):', 'Axial Flow:')}</strong> {L('고유량·저양정. US 기준 Ns > 8000', 'High flow, low head. Ns > 8000 (US)')}</li>
            </ul>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '회전수 1750 RPM, 최고효율점 유량 100 m³/h, 1단 양정 50 m인 펌프를 가정합니다. Q^0.5 ≈ 10, H^0.75 ≈ 18.8이므로 Ns ≈ 1750 × 10 / 18.8 ≈ 930 (metric 기준)으로, 원심형 영역에 해당합니다.',
              'Consider a pump running at 1750 RPM, BEP flow 100 m³/h and per-stage head 50 m. With Q^0.5 ≈ 10 and H^0.75 ≈ 18.8, Ns ≈ 1750 × 10 / 18.8 ≈ 930 (metric basis), placing it in the radial-flow region.',
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
            <li>{L('다단 펌프는 1단 양정(H/단수)을 사용해야 올바른 Ns가 나옵니다.', 'For multi-stage pumps, use the head per stage (H/stages) to get a correct Ns.')}</li>
            <li>{L('양방향 펌프(터빈)의 비속도는 동일 식으로, 단 유량을 양정 1에 대응시켜 비교합니다.', 'Turbine specific speed uses the same form, with flow referred to unit head.')}</li>
            <li>{L('단위계(US gpm/ft vs m³/h/m)에 따라 같은 펌프의 Ns 수치가 다르므로, 비교 시 동일 기준을 쓰세요.', 'The same pump yields different Ns numbers under US vs metric units; always compare on the same basis.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('비속도는 형상 비교 지표이지 성능 보증값이 아닙니다. 실제 효율은 설계·가공 정밀도에 따라 좌우됩니다.', 'Ns is a shape-comparison index, not a performance guarantee; real efficiency depends on design and manufacturing.')}</li>
            <li>{L('너무 높거나 낮은 비속도는 운전 범위가 좁아지고 캐비테이션 여유가 줄어듭니다.', 'Very high or very low Ns narrows the operating range and reduces cavitation margin.')}</li>
            <li>{L('점성 유체에서는 비속도만으로 형식을 정하기 어려우며 보정이 필요합니다.', 'For viscous fluids, Ns alone is insufficient and correction is required.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '펌프 비속도 계산기' : 'Pump Specific Speed Calculator')}
      description={t?.description || (ko ? '비속도로 최적 임펠러 형식을 결정합니다.' : 'Determine impeller type based on specific speed.')}
      icon={<span>🌀</span>}
      visualizationComponent={<></>}
      resultComponent={<SpecificSpeedCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
