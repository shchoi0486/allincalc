'use client';

import React from 'react';
import SensibleHeatCalculator from '@/components/engineering-calculator/SensibleHeatCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function SensibleHeatPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.sensibleHeat;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '현열(Sensible Heat)은 물질의 상(phase) 변화 없이 온도만 바뀔 때 출입하는 열량입니다. 얼음이 녹거나 물이 끓는 잠열(잠재열)과 달리, 가열·냉각 과정에서 온도계 눈금이 오르내리는 열이 바로 현열입니다.',
            'Sensible heat is the heat exchanged when a substance changes temperature without changing phase. Unlike latent heat (melting, boiling), it is the heat that makes a thermometer reading rise or fall during heating or cooling.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '질량 유량(또는 유량)과 비열, 초기·최종 온도를 입력하면 필요한 현열 부하 Q를 계산합니다. 냉방·난방 부하, 공정 가열/냉각 에너지 산정에 쓰입니다.',
              'Given a mass flow rate and specific heat together with the initial and final temperatures, it computes the required sensible-heat load Q. It is used for HVAC heating/cooling loads and process heating/cooling energy.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('공조(HVAC) 냉난방 부하 및 코일 용량 선정', 'Sizing HVAC heating/cooling loads and coil capacity')}</li>
            <li>{L('열교환기·보일러·냉각기의 가열/냉각 에너지 산정', 'Estimating heating/cooling energy for heat exchangers, boilers and chillers')}</li>
            <li>{L('공정 스트림의 온도 제어에 필요한 열량 평가', 'Evaluating heat duty for temperature control of process streams')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-cyan-500 pl-3">
            {L('현열 부하 공식', 'Sensible Heat Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '질량 유량 m에 비열 C_p와 온도 변화 ΔT(=T₂−T₁)를 곱한 값입니다. 미터법에서 kg/s × kJ/(kg·K) × K = kJ/s = kW가 되고, 임페리얼에서 lb/s × BTU/(lb·°F) × °F = BTU/s가 됩니다.',
              'It is the mass flow rate m times the specific heat C_p times the temperature change ΔT (= T₂ − T₁). In metric, kg/s × kJ/(kg·K) × K = kJ/s = kW; in imperial, lb/s × BTU/(lb·°F) × °F = BTU/s.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Q = m × C_p × (T₂ − T₁)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-cyan-600">Q</strong> — {L('현열 부하(열량률) [kW 또는 BTU/s]', 'Sensible heat load (heat rate) [kW or BTU/s]')}</li>
          <li><strong className="font-semibold text-blue-600">m</strong> — {L('질량 유량 [kg/s 또는 lb/s]', 'Mass flow rate [kg/s or lb/s]')}</li>
          <li><strong className="font-semibold text-green-600">C_p</strong> — {L('비열(단위질량당 열용량) [kJ/(kg·K) 또는 BTU/(lb·°F)]', 'Specific heat [kJ/(kg·K) or BTU/(lb·°F)]')}</li>
          <li><strong className="font-semibold text-orange-600">T₁</strong> — {L('초기 온도 [°C 또는 °F]', 'Initial temperature [°C or °F]')}</li>
          <li><strong className="font-semibold text-red-500">T₂</strong> — {L('최종 온도 [°C 또는 °F]', 'Final temperature [°C or °F]')}</li>
          <li><strong className="font-semibold text-purple-600">ΔT</strong> — {L('온도 변화 (T₂ − T₁) [K 또는 °F]', 'Temperature change (T₂ − T₁) [K or °F]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('질량 유량이나 비열이 클수록 같은 온도 변화에 더 많은 열이 필요합니다.', 'Larger mass flow or higher specific heat needs more heat for the same temperature change.')}</li>
            <li>{L('ΔT가 클수록 부하가 선형적으로 커집니다. T₂ < T₁이면 Q가 음수가 되어 냉각(열 제거)을 뜻합니다.', 'Load grows linearly with ΔT. If T₂ < T₁, Q is negative, meaning cooling (heat removal).')}</li>
            <li>{L('비열 C_p는 온도·물질에 따라 달라지므로 정밀 계산 시 운전 온도의 값을 쓰세요(공기 ≈ 1.006 kJ/(kg·K)).', 'Specific heat varies with temperature and substance; use the operating-temperature value for precision (air ≈ 1.006 kJ/(kg·K)).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('체적 유량 형태', 'Volumetric-flow form')}</h4>
          <p className="text-sm">
            {L(
              '밀도 ρ를 알면 m = ρ·V(체적 유량)로 치환해 Q = ρ·V·C_p·ΔT로도 쓸 수 있습니다. 이 형태는 공조 부하 계산에서 자주 쓰입니다.',
              'If density ρ is known, substitute m = ρ·V (volumetric flow) to get Q = ρ·V·C_p·ΔT, a form common in HVAC load calculations.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '공기 m = 1.5 kg/s를 20°C에서 35°C로 가열할 때, C_p = 1.006 kJ/(kg·K), ΔT = 15 K이라 하면 Q = 1.5 × 1.006 × 15 ≈ 22.6 kW가 필요합니다. 냉각(35→20°C)이라면 Q ≈ −22.6 kW(제거열량)가 됩니다.',
              'Heating air at m = 1.5 kg/s from 20 °C to 35 °C with C_p = 1.006 kJ/(kg·K) and ΔT = 15 K needs Q = 1.5 × 1.006 × 15 ≈ 22.6 kW. Cooling (35→20 °C) gives Q ≈ −22.6 kW (heat removed).',
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
            <li>{L('공조 부하 계산 시 현열과 잠열(습공기)을 구분해 합산하세요.', 'In HVAC loads, separate and sum sensible and latent (moist-air) heat.')}</li>
            <li>{L('비열은 물질마다 크게 다릅니다(물 ≈ 4.18, 공기 ≈ 1.0). 잘못된 C_p 선택은 부하를 수 배 어긋나게 합니다.', 'Specific heat varies widely by substance (water ≈ 4.18, air ≈ 1.0); wrong C_p throws the load off by factors.')}</li>
            <li>{L('연속 유량이 아닌 배치(총질량) 가열은 시간으로 나누어 부하를 구하세요.', 'For batch (total mass) heating rather than continuous flow, divide by time to get the load rate.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('상 변화(증발·응축)가 함께 일어나면 이 식만으로는 부족하며 잠열을 더해야 합니다.', 'If phase change (evaporation/condensation) occurs, add latent heat — this formula alone is insufficient.')}</li>
            <li>{L('비열의 온도 의존성을 무시한 상수 취급은 고온 범위에서 오차를 줍니다.', 'Treating C_p as constant ignores its temperature dependence, causing error at high temperature ranges.')}</li>
            <li>{L('열손실(대류·복사)은 별도로 고려해야 하며, 이 식은 이상 단열 가열/냉각 기준입니다.', 'Heat losses (convection, radiation) must be added separately; this is an ideal adiabatic heating/cooling relation.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '현열 계산기' : 'Sensible Heat Calculator')}
      description={t?.description || (ko ? '온도 변화에 필요한 현열 부하를 계산합니다.' : 'Calculate the sensible heat load required to change temperature.')}
      icon={<span>❄️</span>}
      visualizationComponent={<></>}
      resultComponent={<SensibleHeatCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
