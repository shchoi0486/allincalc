'use client';

import React from 'react';
import CarnotEfficiencyCalculator from '@/components/engineering-calculator/CarnotEfficiencyCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CarnotEfficiencyPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.carnotEfficiency;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '카르노 효율은 두 개의 일정한 온도 열원(고온·저온) 사이에서 작동하는 열기관이 이론적으로 낼 수 있는 최대 효율입니다. 프랑스 공학자 사디 카르노가 제시한 이 값은 열역학 제2법칙에서 유도되며, 어떤 실제 기관도 이 한계를 넘을 수 없습니다.',
            'Carnot efficiency is the maximum efficiency that any heat engine can theoretically achieve when operating between two fixed-temperature reservoirs (hot and cold). Derived by the French engineer Sadi Carnot from the second law of thermodynamics, it is an absolute ceiling that no real engine can exceed.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '고온 열원과 저온 열원의 절대 온도만 입력하면, 그 온도 사이에서 가능한 최대 열-일 변환 효율을 계산합니다. 이는 특정 엔진의 실제 효율이 아니라, 그 온도 조건에서 물리적으로 도달 가능한 상한선입니다.',
              'By entering only the absolute temperatures of the hot and cold reservoirs, it computes the maximum possible heat-to-work conversion efficiency between them. This is not the actual efficiency of a specific engine but the physically attainable upper limit for those temperatures.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('발전소·엔진의 실제 효율이 이론 한계에 얼마나 근접했는지 벤치마크', 'Benchmarking how close a power plant or engine comes to the theoretical limit')}</li>
            <li>{L('고온 열원 온도를 높이는 것이 효율에 미치는 잠재 이득 평가', 'Assessing the potential gain from raising the hot-reservoir temperature')}</li>
            <li>{L('열역학 사이클 설계·교육에서 기준 척도로 활용', 'Serving as a reference benchmark in thermodynamic cycle design and teaching')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('카르노 효율 공식', 'Carnot Efficiency Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '효율은 두 열원의 절대 온도 비에만 의존합니다. 온도는 반드시 절대 온도(K 또는 °R)로 넣어야 합니다.',
              'The efficiency depends only on the ratio of the two reservoirs’ absolute temperatures. Temperatures must be entered on an absolute scale (K or °R).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">η = 1 − (T_C / T_H)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">η</strong> — {L('카르노 효율 (비율 또는 %)', 'Carnot efficiency (ratio or %)')}</li>
          <li><strong className="font-semibold text-blue-600">T_C</strong> — {L('저열원 절대 온도 [K (°R)]', 'Cold-reservoir absolute temperature [K (°R)]')}</li>
          <li><strong className="font-semibold text-orange-600">T_H</strong> — {L('고열원 절대 온도 [K (°R)]', 'Hot-reservoir absolute temperature [K (°R)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('고온 T_H가 높아질수록 T_C/T_H 비가 작아져 효율 η가 커집니다.', 'A higher hot temperature T_H lowers the ratio T_C/T_H, raising the efficiency η.')}</li>
            <li>{L('저온 T_C가 낮아질수록(더 차가운 배출) 효율이 커집니다.', 'A lower cold temperature T_C (colder heat rejection) also raises efficiency.')}</li>
            <li>{L('두 온도가 같으면(T_C = T_H) 효율은 0이 되고, T_C = 0 K(도달 불가)여야만 효율 100%가 됩니다.', 'When the two temperatures are equal (T_C = T_H) efficiency is 0; only at the unreachable T_C = 0 K would efficiency reach 100%.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '고온 열원 T_H = 800 K, 저온 열원 T_C = 300 K인 경우 η = 1 − 300/800 = 0.625, 즉 62.5%입니다. 이 온도 조건에서 어떤 열기관도 62.5%를 초과할 수 없습니다.',
              'For T_H = 800 K and T_C = 300 K, η = 1 − 300/800 = 0.625, i.e. 62.5%. No heat engine operating between these temperatures can exceed 62.5%.',
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
            <li>{L('섭씨/화씨로 입력하지 말고 반드시 켈빈(K = °C + 273.15) 또는 랭킨(°R = °F + 459.67)으로 변환하세요.', 'Never enter °C/°F directly — convert to Kelvin (K = °C + 273.15) or Rankine (°R = °F + 459.67) first.')}</li>
            <li>{L('실제 기관 효율은 카르노 효율의 40~70% 수준인 경우가 많습니다. 이를 “2법칙 효율”로 비교하면 개선 여지를 볼 수 있습니다.', 'Real engines often reach only 40–70% of the Carnot value; comparing them via “second-law efficiency” reveals room for improvement.')}</li>
            <li>{L('효율을 높이려면 저온을 낮추는 것보다 고온을 높이는 편이 대개 더 효과적이고 실용적입니다.', 'Raising the hot temperature is usually more practical and effective for boosting efficiency than lowering the cold side.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('카르노 효율은 가역·무마찰·무손실을 가정한 이상적 상한입니다. 실제 기관은 마찰·열손실·비가역성 때문에 반드시 더 낮습니다.', 'The Carnot value assumes reversible, frictionless, loss-free operation; real engines are always lower due to friction, heat loss and irreversibility.')}</li>
            <li>{L('일정 온도 열원을 가정하므로, 온도가 변하는 실제 사이클(예: 랭킨·브레이턴)에는 근사 기준으로만 사용하세요.', 'It assumes constant-temperature reservoirs, so treat it only as an approximate benchmark for real cycles (e.g. Rankine, Brayton) where temperatures vary.')}</li>
            <li>{L('냉동기·열펌프의 성능(COP)은 이 효율 식과 다르게 정의되므로 혼동하지 마세요.', 'The performance (COP) of refrigerators and heat pumps is defined differently — do not confuse it with this efficiency.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '카르노 효율 계산기' : 'Carnot Efficiency Calculator')}
      description={t?.description || (ko ? '열기관의 이론적 최대 효율을 계산합니다.' : 'Calculate the maximum theoretical efficiency of a heat engine.')}
      icon={<span>🔥</span>}
      visualizationComponent={<></>}
      resultComponent={<CarnotEfficiencyCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
