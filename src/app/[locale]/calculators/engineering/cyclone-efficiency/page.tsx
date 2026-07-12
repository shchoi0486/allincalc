'use client';

import React from 'react';
import CycloneEfficiencyCalculator from '@/components/engineering-calculator/CycloneEfficiencyCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CycloneEfficiencyPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.cycloneEfficiency;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '사이클론 분리기(Cyclone Separator)는 회전하는 기류의 원심력을 이용해 가스 중에 부유하는 고체 입자나 액적을 분리·포집하는 장치입니다. 필터처럼 소모되는 부품이 없고 구조가 단순하며 고온·고압 조건에서도 견디기 때문에, 산업 현장의 집진·전처리 장비로 매우 널리 쓰입니다.',
            'A cyclone separator uses the centrifugal force of a swirling gas stream to separate and collect solid particles or liquid droplets suspended in the gas. Because it has no consumable parts like a filter, is mechanically simple, and tolerates high temperature and pressure, it is one of the most widely used devices for dust collection and gas pre-cleaning in industry.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것: 분리 한계 입경 (Cut Size, d₅₀)', 'What this calculator finds: the Cut Size (d₅₀)')}</h4>
          <p>
            {L(
              '사이클론의 성능은 보통 “분리 한계 입경(d₅₀)”으로 나타냅니다. d₅₀는 포집 효율이 정확히 50%가 되는 입자의 직경으로, 이 값보다 큰 입자는 대부분 포집되고 작은 입자는 대부분 배출됩니다. 즉 d₅₀가 작을수록 더 미세한 입자까지 잡아낼 수 있는 “성능이 좋은” 사이클론입니다.',
              'Cyclone performance is usually expressed by its cut size (d₅₀): the particle diameter that is collected with exactly 50% efficiency. Particles larger than d₅₀ are mostly captured, while smaller ones mostly escape. A smaller d₅₀ therefore means a higher-performance cyclone that can capture finer particles.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('집진 설비 설계 시 배출 기준(㎍/㎥)을 만족할 수 있는지 사전 검토', 'Checking whether a dust-collection system can meet emission limits before building it')}</li>
            <li>{L('후단 백필터·전기집진기의 부하를 줄이기 위한 전처리 사이클론 사양 결정', 'Sizing a pre-cleaning cyclone to reduce the load on downstream bag filters or ESPs')}</li>
            <li>{L('입구 유속·치수 변경이 성능에 미치는 영향을 정량적으로 비교', 'Quantitatively comparing how changes in inlet velocity or geometry affect performance')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('Lapple 분리 한계 입경 모델', 'Lapple Cut-Size Model')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '가장 널리 쓰이는 반경험식은 Lapple(1951) 모델입니다. 입자에 작용하는 원심력과 항력(스토크스 항력)이 균형을 이루는 지점에서 d₅₀를 유도합니다.',
              'The most widely used semi-empirical relation is the Lapple (1951) model. It derives d₅₀ from the balance between the centrifugal force on a particle and the (Stokes) drag force opposing it.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">d₅₀ = √[ 9·μ·W / (2π·Nₑ·V_i·(ρ_p − ρ_g)) ]</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-purple-600">d₅₀</strong> — {L('분리 한계 입경 (포집 효율 50%인 입자 직경) [m 또는 µm]', 'Cut size — particle diameter collected at 50% efficiency [m or µm]')}</li>
          <li><strong className="font-semibold text-green-600">μ</strong> — {L('가스의 점성 계수 [kg/(m·s)]', 'Gas dynamic viscosity [kg/(m·s)]')}</li>
          <li><strong className="font-semibold text-blue-600">W</strong> — {L('입구 폭 [m]', 'Inlet width [m]')}</li>
          <li><strong className="font-semibold text-red-600">V_i</strong> — {L('입구 가스 유속 [m/s]', 'Inlet gas velocity [m/s]')}</li>
          <li><strong className="font-semibold text-yellow-600">Nₑ</strong> — {L('유효 회전수 (표준 사이클론에서 보통 ≈ 5)', 'Effective number of turns (typically ≈ 5 for a standard cyclone)')}</li>
          <li><strong className="font-semibold text-orange-600">ρ_p, ρ_g</strong> — {L('각각 입자 밀도와 가스 밀도 [kg/m³]', 'Particle density and gas density respectively [kg/m³]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('입구 유속 V_i가 클수록 원심력이 커져 d₅₀가 작아집니다 → 더 미세한 입자 포집.', 'Higher inlet velocity V_i increases centrifugal force, lowering d₅₀ → finer particles captured.')}</li>
            <li>{L('입자와 가스의 밀도 차(ρ_p − ρ_g)가 클수록 분리가 쉬워져 d₅₀가 작아집니다.', 'A larger particle–gas density difference (ρ_p − ρ_g) makes separation easier, lowering d₅₀.')}</li>
            <li>{L('가스 점도 μ나 입구 폭 W가 크면 항력·이동 거리가 커져 d₅₀가 커집니다 → 성능 저하.', 'Higher gas viscosity μ or a wider inlet W raises drag / travel distance, increasing d₅₀ → poorer performance.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('등급 효율 곡선 (그래프)', 'Grade-efficiency curve (chart)')}</h4>
          <p className="text-sm">
            {L(
              '개별 입경 dp에 대한 포집 효율은 η(dp) = 1 / (1 + (d₅₀/dp)²) 로 근사합니다. 위 그래프의 S자 곡선이 이 관계이며, dp = d₅₀에서 효율이 정확히 50%가 되는 것을 확인할 수 있습니다.',
              'The collection efficiency for an individual particle size dp is approximated by η(dp) = 1 / (1 + (d₅₀/dp)²). The S-shaped curve in the chart above is exactly this relation, and you can see that efficiency is precisely 50% at dp = d₅₀.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '공기(μ ≈ 1.8×10⁻⁵ kg/(m·s), ρ_g ≈ 1.2 kg/m³) 중 밀도 1000 kg/m³ 입자를 입구 폭 0.125 m, 입구 유속 15 m/s, Nₑ = 5 조건에서 분리하면 d₅₀ ≈ 5 µm 수준이 됩니다. 즉 약 5 µm보다 큰 입자는 절반 이상 포집됩니다.',
              'For 1000 kg/m³ particles in air (μ ≈ 1.8×10⁻⁵ kg/(m·s), ρ_g ≈ 1.2 kg/m³) with an inlet width of 0.125 m, inlet velocity 15 m/s and Nₑ = 5, the result is d₅₀ ≈ 5 µm — meaning particles larger than about 5 µm are collected with more than 50% efficiency.',
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
            <li>{L('입구 유속을 높이면 d₅₀는 작아지지만 압력 손실이 유속의 제곱에 비례해 급증합니다. 보통 15~25 m/s가 경제적 범위입니다.', 'Raising inlet velocity lowers d₅₀ but pressure drop rises with the square of velocity. 15–25 m/s is usually the economical range.')}</li>
            <li>{L('여러 대의 소형 사이클론을 병렬(멀티사이클론)로 쓰면 각 몸통 지름이 작아져 미세 입자 포집 성능이 좋아집니다.', 'Using many small cyclones in parallel (multiclones) reduces each body diameter and improves fine-particle capture.')}</li>
            <li>{L('점착성·조해성 분진은 벽면에 달라붙어 성능을 떨어뜨리므로 재질·경사·해머링을 고려하세요.', 'Sticky or hygroscopic dusts foul the walls and degrade performance — consider material, cone angle and rapping.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Lapple 모델은 표준 형상 비율을 가정한 근사식으로, 실제 효율은 ±10~20% 오차가 날 수 있습니다.', 'The Lapple model assumes standard geometry ratios; real efficiency can deviate by ±10–20%.')}</li>
            <li>{L('약 5 µm 이하 미세 입자에는 정확도가 떨어지므로 정밀 집진에는 후단 여과 장치가 필요합니다.', 'Accuracy drops for sub-5 µm particles, so precise cleaning needs a downstream filter stage.')}</li>
            <li>{L('입자 농도가 매우 높으면 입자 간 상호작용으로 실제 효율이 예측보다 높아질 수 있습니다.', 'At very high loadings, particle-to-particle interaction can make real efficiency higher than predicted.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '사이클론 분리기 효율 계산기' : 'Cyclone Separator Calculator')}
      description={t?.description || (ko ? '입구 조건과 물성으로 사이클론의 분리 한계 입경(d₅₀)을 계산합니다.' : 'Calculate the cut size (d₅₀) of a cyclone from inlet conditions and fluid properties.')}
      icon={<span>🌪️</span>}
      visualizationComponent={<></>}
      resultComponent={<CycloneEfficiencyCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
