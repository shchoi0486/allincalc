'use client';

import React from 'react';
import PumpAffinityCalculator from '@/components/engineering-calculator/PumpAffinityCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function PumpAffinityPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.pumpAffinity;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '펌프의 상사법칙(Pump Affinity Laws)은 원심 펌프의 회전수(N)나 임펠러 직경(D)을 바꿀 때 유량(Q), 양정(H), 동력(P)이 어떻게 변하는지 나타내는 관계식입니다. 기하학적으로 상사한(형상 비율이 같은) 펌프 사이에서 성능 곡선을 쉽게 예측할 수 있게 해주므로, 변속 제어(VFD)나 임펠러 가공으로 운전점을 바꾸는 설계·운전에서 필수적으로 쓰입니다.',
            'The pump affinity laws relate how the flow rate (Q), head (H) and power (P) of a centrifugal pump change when its rotational speed (N) or impeller diameter (D) is altered. They let engineers predict the performance curve of geometrically similar pumps and are essential whenever a duty point is shifted via variable-speed control (VFD) or impeller trimming.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '기준 운전 상태(1)의 유량·양정·동력과 새로운 회전수(또는 임펠러 직경) 비율을 입력하면, 법칙에 따라 변경 후 상태(2)의 유량·양정·동력을 계산합니다. 즉 “펌프를 더 빠르게/느리게 돌리면 성능이 얼마나 바뀌는가”를 정량화합니다.',
              'By entering the reference operating point (1) and the ratio of the new speed (or impeller diameter) to the old one, the calculator returns the new flow, head and power (point 2). In short, it quantifies “how much does pump performance change if we spin it faster or slower”.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('변속 구동(VFD) 도입 시 필요 동력·양정 변화를 예측해 모터 용량 선정', 'Sizing motor capacity by predicting power/head changes when adding a VFD')}</li>
            <li>{L('임펠러 절삭(trimming)으로 과대 설계 펌프를 운전점에 맞출 때 성능 추정', 'Estimating performance when trimming an oversized impeller to match the duty point')}</li>
            <li>{L('유량 조절 방식(밸브 절탁 vs 변속)의 에너지 절감 효과 비교', 'Comparing energy savings between throttling and speed control')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('펌프의 상사법칙', 'Pump Affinity Laws')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '아래 세 식은 회전수 또는 임펠러 직경의 비율(x = N₂/N₁ 또는 D₂/D₁)에 대한 관계입니다. 유량은 비율의 1제곱, 양정은 2제곱, 동력은 3제곱에 비례합니다.',
              'The three relations below are written for the ratio x = N₂/N₁ (or D₂/D₁). Flow scales with the first power, head with the square, and power with the cube of the ratio.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-blue-600">Q₂ = Q₁ × (N₂ / N₁)</p>
            <p className="font-mono text-lg text-center text-orange-600">H₂ = H₁ × (N₂ / N₁)²</p>
            <p className="font-mono text-lg text-center text-red-500">P₂ = P₁ × (N₂ / N₁)³</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-gray-700">N</strong> — {L('펌프 회전수 [RPM] 또는 임펠러 직경 [m 또는 ft]', 'Pump speed [RPM] or impeller diameter [m or ft]')}</li>
          <li><strong className="font-semibold text-blue-600">Q</strong> — {L('체적 유량 [m³/h 또는 gpm]', 'Volumetric flow rate [m³/h or gpm]')}</li>
          <li><strong className="font-semibold text-orange-600">H</strong> — {L('펌프 양정 [m 또는 ft]', 'Pump head [m or ft]')}</li>
          <li><strong className="font-semibold text-red-500">P</strong> — {L('소비 동력 [kW 또는 hp]', 'Power consumption [kW or hp]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('회전수를 2배로 높이면 유량은 2배, 양정은 4배, 동력은 8배가 됩니다. 역으로 회전수를 낮추면 동력이 급격히 줄어 에너지 절감 효과가 큽니다.', 'Doubling the speed doubles the flow, quadruples the head, and octuples the power. Conversely, slowing down sharply cuts power, giving large energy savings.')}</li>
            <li>{L('양정은 비율의 제곱, 동력은 세제곱에 민감하므로 조금만 회전수를 올려도 필요 동력이 크게 늘어납니다.', 'Because head depends on the square and power on the cube, even a small speed increase demands much more power.')}</li>
            <li>{L('임펠러 직경 변경 시에도 같은 법칙이 근사적으로 적용되지만, 직경 변화는 효율과 형상에 더 큰 영향을 줍니다.', 'The same laws approximately apply to impeller diameter changes, but diameter changes affect efficiency and geometry more strongly.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('적용 범위와 가정', 'Assumptions & scope')}</h4>
          <p className="text-sm">
            {L(
              '이 법칙은 기하학적으로 상사한 펌프에서, 효율이 일정하다고 가정할 때 엄밀히 성립합니다. 실제로는 회전수가 크게 벗어나면 효율이 변하고, 임펠러 직경 절삭은 형상 비율을 바꾸어 오차를 유발합니다.',
              'These laws hold exactly for geometrically similar pumps under the assumption that efficiency stays constant. In practice efficiency shifts when speed moves far from the design point, and impeller trimming alters geometry ratios, introducing error.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '기준 펌프가 N₁ = 1750 RPM에서 Q₁ = 100 m³/h, H₁ = 50 m, P₁ = 15 kW로 운전되고 있다고 합시다. 회전수를 N₂ = 1400 RPM으로 줄이면 비율 x = 0.8이고, Q₂ = 80 m³/h, H₂ = 32 m, P₂ ≈ 7.68 kW가 됩니다. 동력이 약 절반으로 줄어드는 것을 볼 수 있습니다.',
              'Suppose a pump runs at N₁ = 1750 RPM with Q₁ = 100 m³/h, H₁ = 50 m and P₁ = 15 kW. Reducing speed to N₂ = 1400 RPM gives x = 0.8, so Q₂ = 80 m³/h, H₂ = 32 m and P₂ ≈ 7.68 kW — the power is cut to roughly half.',
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
            <li>{L('유량을 줄여야 할 때는 밸브 절탁보다 변속 구동(VFD)이 동력 절감 면에서 훨씬 유리합니다 (동력이 제곱·세제곱으로 줄어듦).', 'When reducing flow, VFD speed control saves far more power than valve throttling, because power drops with the square/cube of speed.')}</li>
            <li>{L('펌프를 저속으로 운전하면 NPSH 요구량도 비율의 제곱에 비례해 줄어들어 기포 현상(캐비테이션) 위험이 낮아집니다.', 'Running slower also lowers the required NPSH roughly with the square of speed, reducing cavitation risk.')}</li>
            <li>{L('설계점에서 크게 벗어난 회전수에서는 실효율 저하를 감안해 동력을 여유 있게 선정하세요.', 'If operating far from the design speed, allow margin on power because real efficiency drops.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('상사법칙은 효율 불변이라는 이상 가정이므로, 실제 동력은 계산값과 다를 수 있습니다.', 'The laws assume constant efficiency, so real power may differ from the prediction.')}</li>
            <li>{L('임펠러 직경 절삭은 형상 비율(유로 폭 등)을 바꾸어 오차가 커지므로 절삭량이 클수록 신뢰도가 떨어집니다.', 'Impeller trimming changes geometry ratios, so larger trims reduce reliability of the estimate.')}</li>
            <li>{L('비상사한 펌프(형상이 다른 펌프)끼리의 비교에는 사용할 수 없습니다.', 'Do not apply these laws to compare pumps that are not geometrically similar.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '펌프 상사법칙 계산기' : 'Pump Affinity Laws Calculator')}
      description={t?.description || (ko ? '회전수 변화에 따른 펌프 성능 변화를 계산합니다.' : "Calculate pump performance changes using affinity laws.")}
      icon={<span>🔄</span>}
      visualizationComponent={<></>}
      resultComponent={<PumpAffinityCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
