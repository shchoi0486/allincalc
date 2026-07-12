'use client';

import React from 'react';
import ThermalExpansionCalculator from '@/components/engineering-calculator/ThermalExpansionCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function ThermalExpansionPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.thermalExpansion;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '선팽창(Linear Thermal Expansion)은 온도가 변할 때 대부분의 고체가 길이 방향으로 늘어나거나 줄어드는 현상입니다. 분자 간 평균 거리가 온도에 비례해 커지기 때문이며, 이는 배관·교량·레일·구조물 설계에서 반드시 고려해야 할 거동입니다.',
            'Linear thermal expansion is the change in length of most solids as temperature changes, because the average interatomic spacing grows with temperature. It is a behavior that must be accounted for in piping, bridges, rails and structures.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '재질의 선팽창 계수 α, 초기 길이 L₀, 초기·최종 온도(T₁, T₂)를 입력하면 길이 변화 ΔL과 최종 길이 L₁을 계산합니다. 재질별 계수(강철·알루미늄·구리 등)를 기본 제공합니다.',
              'Given the linear expansion coefficient α, initial length L₀ and the initial/final temperatures (T₁, T₂), it returns the length change ΔL and the final length L₁. Built-in coefficients are provided for common materials (steel, aluminum, copper, etc.).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관 팽창 이음(expansion joint)·지지대 간격 설계', 'Sizing expansion joints and support spacing for piping')}</li>
            <li>{L('철도 레일·교량의 온도 응력 및 신축 이음매 설계', 'Temperature stress and expansion gaps in rails and bridges')}</li>
            <li>{L('정밀 기계·계측기의 온도 보정', 'Thermal compensation in precision machines and instruments')}</li>
            <li>{L('건물 외장·유리의 팽창 균열 방지', 'Preventing expansion cracks in façades and glazing')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('선팽창 공식', 'Linear Thermal Expansion')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '온도 변화에 따른 길이 변화는 초기 길이와 온도 차에 비례하며, 그 비례 계수가 재질의 선팽창 계수 α입니다.',
              'The length change is proportional to the initial length and the temperature difference, with the proportionality constant being the material\'s linear expansion coefficient α.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-lg">ΔL = α × L₀ × ΔT</p>
            <p className="text-center font-mono text-lg">L₁ = L₀ + ΔL</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">ΔL</strong> — {L('길이 변화량 [m 또는 ft]', 'Change in length [m or ft]')}</li>
          <li><strong className="font-semibold text-purple-600">α</strong> — {L('선팽창 계수 [1/°C 또는 1/°F]', 'Linear expansion coefficient [1/°C or 1/°F]')}</li>
          <li><strong className="font-semibold text-blue-600">L₀</strong> — {L('초기 길이 [m 또는 ft]', 'Initial length [m or ft]')}</li>
          <li><strong className="font-semibold text-green-600">ΔT</strong> — {L('온도 변화 (T₂ − T₁) [°C 또는 °F]', 'Temperature change (T₂ − T₁) [°C or °F]')}</li>
          <li><strong className="font-semibold text-orange-600">L₁</strong> — {L('최종 길이 [m 또는 ft]', 'Final length [m or ft]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('초기 길이 L₀가 길수록 같은 온도 변화에도 ΔL이 커집니다.', 'A longer L₀ gives a larger ΔL for the same temperature change.')}</li>
            <li>{L('온도 차 ΔT가 클수록 팽창·수축량이 비례해 커집니다.', 'A larger ΔT increases expansion/contraction proportionally.')}</li>
            <li>{L('α가 큰 재질(알루미늄 23 > 강철 12 > 유리 9, ×10⁻⁶/°C)일수록 더 크게 변합니다.', 'Materials with larger α (aluminum 23 > steel 12 > glass 9, ×10⁻⁶/°C) change more.')}</li>
            <li>{L('야드파운드법에서는 α를 1/°F 단위로 환산(÷1.8)해 사용합니다.', 'In imperial units, α is converted to 1/°F basis (÷1.8).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '길이 10 m의 강철 파이프(α = 12×10⁻⁶/°C)가 20°C에서 100°C로 가열되면 ΔT = 80°C이고 ΔL = 12×10⁻⁶ × 10 × 80 = 0.0096 m = 9.6 mm 늘어나, 최종 길이는 약 10.0096 m가 됩니다.',
              'A 10 m steel pipe (α = 12×10⁻⁶/°C) heated from 20°C to 100°C has ΔT = 80°C, so ΔL = 12×10⁻⁶ × 10 × 80 = 0.0096 m = 9.6 mm, giving a final length of about 10.0096 m.',
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
            <li>{L('장대 배관은 팽창 이음매·보상기(expansion loop)로 ΔL을 흡수하도록 설계하세요.', 'Use expansion joints or loops to absorb ΔL in long piping runs.')}</li>
            <li>{L('양단 고정 배관에서는 ΔL이 아니라 온도 응력 σ = E·α·ΔT로 검토해야 합니다.', 'For fully restrained pipes, evaluate temperature stress σ = E·α·ΔT rather than ΔL.')}</li>
            <li>{L('복합 재료는 각 층의 α 차이로 휨이 생길 수 있으니 주의하세요.', 'Composite materials can warp due to differing α across layers.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('본 식은 선형 근사로, 매우 큰 온도 범위에서는 α 자체가 온도에 따라 변합니다.', 'This is a linear approximation; over a wide temperature range α itself varies with temperature.')}</li>
            <li>{L('상변태(녹는점 등) 근처에서는 부피 팽창이 비선형이 되어 부정확합니다.', 'Near phase transitions, volumetric expansion becomes non-linear and inaccurate.')}</li>
            <li>{L('체적팽창은 대략 3α(등방성 고체)이므로 부피 변화가 필요하면 3배를 쓰세요.', 'For volumetric expansion of isotropic solids, use roughly 3α.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '선팽창 계산기' : 'Thermal Expansion Calculator')}
      description={t?.description || (ko ? '온도 변화에 따른 재료의 선팽창을 계산합니다.' : 'Calculate the linear thermal expansion of a material due to temperature changes.')}
      icon={<span>🔥</span>}
      visualizationComponent={<></>}
      resultComponent={<ThermalExpansionCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
