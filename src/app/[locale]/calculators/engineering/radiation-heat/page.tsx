'use client';

import React from 'react';
import RadiationHeatCalculator from '@/components/engineering-calculator/RadiationHeatCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function RadiationHeatPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.radiationHeat;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '복사 열전달(Radiation Heat Transfer)은 매질(공기 등)을 통하지 않고 전자기파(적외선) 형태로 전달되는 열입니다. 태양열, 용광로, radiators, 열차폐 설계 등에서 지배적인 메커니즘이며, 대류·전도와 달리 온도의 4제곱에 민감하게 의존합니다.',
            'Radiation heat transfer is heat carried as electromagnetic waves (infrared) without needing a transmitting medium. It dominates solar heating, furnaces, radiators and thermal-shielding design, and unlike convection or conduction it depends sensitively on the fourth power of temperature.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '물체와 그 주위(또는 두 표면) 사이의 순(net) 복사 열전달량 q를 슈테판-볼츠만 법칙으로 계산합니다. 표면적, 방사율, 두 온도의 차이가 주어지면 단위시간당 전달되는 열량을 구합니다.',
              'It computes the net radiation heat transfer q between a body and its surroundings using the Stefan–Boltzmann law. Given area, emissivity and the two absolute temperatures, it returns the heat transferred per unit time.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('고온 설비(보일러, 가열로)의 열손실 평가 및 단열 설계', 'Evaluating heat loss and insulation design for high-temperature equipment (boilers, furnaces)')}</li>
            <li>{L('태양열 집열·건물 외피의 일사 부하 산정', 'Estimating solar gain and building-envelope radiation loads')}</li>
            <li>{L('전자부품·배터리 등의 수동 냉각(방사 냉각) 검토', 'Assessing passive radiative cooling of electronics and batteries')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('슈테판-볼츠만 법칙', 'Stefan-Boltzmann Law')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '완전히 둘러싸인 큰 주위에 노출된 회색물체의 순 복사 열전달량입니다. 물체가 방출하는 복사와 주위로부터 흡수하는 복사의 차이로, 두 절대온도의 4제곱 차에 비례합니다.',
              'This is the net radiation from a grey body exposed to large surrounding walls. It is the difference between the radiation the body emits and the radiation it absorbs from the surroundings, proportional to the difference of the fourth powers of the two absolute temperatures.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">q = ε × σ × A × (T₁⁴ − T₂⁴)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">q</strong> — {L('순 복사 열전달량 [W 또는 Btu/hr]', 'Net radiation heat transfer [W or Btu/hr]')}</li>
          <li><strong className="font-semibold text-blue-600">ε</strong> — {L('방사율 (0~1, 흑체는 1, 거울면은 ≈0)', 'Emissivity (0–1; 1 for a black body, ≈0 for a mirror)')}</li>
          <li><strong className="font-semibold text-purple-600">σ</strong> — {L('슈테판-볼츠만 상수 (5.67×10⁻⁸ W/(m²·K⁴) 또는 0.1714×10⁻⁸ Btu/(hr·ft²·°R⁴))', 'Stefan-Boltzmann constant (5.67×10⁻⁸ W/(m²·K⁴) or 0.1714×10⁻⁸ Btu/(hr·ft²·°R⁴))')}</li>
          <li><strong className="font-semibold text-green-600">A</strong> — {L('복사 표면적 [m² 또는 ft²]', 'Surface area [m² or ft²]')}</li>
          <li><strong className="font-semibold text-yellow-600">T₁</strong> — {L('물체의 절대 온도 [K 또는 °R]', 'Absolute temperature of the body [K or °R]')}</li>
          <li><strong className="font-semibold text-yellow-600">T₂</strong> — {L('주위의 절대 온도 [K 또는 °R]', 'Absolute temperature of surroundings [K or °R]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('온도 차가 커질수록, 특히 고온일수록 열전달이 급격히 커집니다(4제곱 의존).', 'Heat transfer grows sharply with temperature difference, especially at high temperature (fourth-power dependence).')}</li>
            <li>{L('방사율 ε이 1에 가까울수록(검은 표면) 복사가 크고, 광택 금속표면은 작습니다.', 'Emissivity near 1 (dark surfaces) radiates strongly; polished metals radiate little.')}</li>
            <li>{L('표면적 A에 비례하므로 노출 면적을 줄이면 복사 손실을 줄일 수 있습니다.', 'It is proportional to area A, so reducing exposed area reduces radiative loss.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('적용 범위와 가정', 'Assumptions & scope')}</h4>
          <p className="text-sm">
            {L(
              '이 식은 물체가 주위에 완전히 둘러싸여 있고, 두 표면의 온도가 균일하며, 뷰팩터(view factor)가 1인 이상화(큰 주위) 경우에 해당합니다. 실제 두 표면 사이의 교환이면 뷰팩터와 유효 방사율을 추가로 고려해야 합니다.',
              'This relation assumes the body is completely enclosed by the surroundings, both surfaces are isothermal, and the view factor is 1 (a large enclosure). For exchange between two finite surfaces, a view factor and effective emissivity must be included.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '방사율 ε = 0.9, 표면적 A = 1 m²인 강판이 T₁ = 500 K, 주위 T₂ = 300 K라면: σ = 5.67×10⁻⁸, (500⁴ − 300⁴) = (6.25−0.81)×10¹⁰ ≈ 5.44×10¹⁰. q = 0.9 × 5.67×10⁻⁸ × 1 × 5.44×10¹⁰ ≈ 2776 W입니다.',
              'For a steel plate with ε = 0.9 and A = 1 m² at T₁ = 500 K in surroundings T₂ = 300 K: with σ = 5.67×10⁻⁸ and (500⁴ − 300⁴) ≈ 5.44×10¹⁰, q = 0.9 × 5.67×10⁻⁸ × 1 × 5.44×10¹⁰ ≈ 2776 W.',
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
            <li>{L('표면을 광택 금속(저방사율)으로 처리하거나 단열 덮개를 씌우면 복사 손실을 크게 줄일 수 있습니다.', 'A polished-metal (low-emissivity) surface or insulating blanket sharply cuts radiative loss.')}</li>
            <li>{L('온도는 반드시 절대온도(K 또는 °R)로 입력해야 합니다. 섭씨를 그대로 넣으면 결과가 틀립니다.', 'Always enter absolute temperature (K or °R); using Celsius directly gives wrong results.')}</li>
            <li>{L('복사와 대류는 동시에 일어나므로 총 열손실은 둘을 합산해야 합니다.', 'Radiation and convection occur together, so total loss is their sum.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('큰 주위(뷰팩터=1) 가정에서 벗어나는 두 표면 사이 복사에는 적용할 수 없습니다.', 'Not directly applicable to radiation between two finite surfaces away from the large-enclosure assumption.')}</li>
            <li>{L('방사율은 파장·온도·표면상태에 따라 변하므로 정밀 계산 시 문헌값을 확인하세요.', 'Emissivity varies with wavelength, temperature and surface condition — verify literature values for precision.')}</li>
            <li>{L('매질(증기·가스) 자체의 복사 흡수는 무시한 이상 회색물체 모델입니다.', 'This ideal grey-body model ignores absorption by the intervening gas/vapor.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '복사 열전달 계산기' : 'Radiation Heat Calculator')}
      description={t?.description || (ko ? '슈테판-볼츠만 법칙으로 물체와 주위 사이의 순 복사 열전달량을 계산합니다.' : 'Calculate the net radiation heat transfer between an object and its surroundings using the Stefan-Boltzmann Law.')}
      icon={<span>☀️</span>}
      visualizationComponent={<></>}
      resultComponent={<RadiationHeatCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
