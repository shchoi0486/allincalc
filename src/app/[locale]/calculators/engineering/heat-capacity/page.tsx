'use client';

import React from 'react';
import HeatCapacity from '@/components/engineering-calculator/HeatCapacity';
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
            '열용량(Heat Capacity)은 물질의 온도를 1도 올리기 위해 필요한 열에너지의 양입니다. 질량에 비례하며, 물질의 비열 용량(specific heat capacity)에 질량을 곱하여 구합니다.',
            'Heat capacity is the amount of thermal energy required to raise the temperature of a substance by one degree. It is proportional to mass and is found by multiplying specific heat capacity by mass.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '물질의 질량, 비열 용량, 온도 변화량을 입력하면 필요한 열에너지를 J(줄), kJ, kcal, BTU 등 다양한 단위로 계산합니다.',
              'Enter the mass, specific heat capacity, and temperature change of a substance to calculate the required heat energy in various units (J, kJ, kcal, BTU).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('가열·냉각 장치(히터, 쿨러, 보일러 등)의 용량 결정에 필수적입니다', 'Essential for determining capacity of heating/cooling equipment (heaters, coolers, boilers, etc.)')}</li>
            <li>{L('공정열 계산에서 에너지 균형(energy balance)의 핵심 항목입니다', 'Key item in energy balance for process heat calculations')}</li>
            <li>{L('설비의 냉각 시간 예측 및 열 관리 설계에 활용됩니다', 'Used for predicting cooling time and thermal management design')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('열용량 계산 공식', 'Heat Capacity Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '기본 열전달 공식은 Q = m × c × ΔT이며, 이는 물질의 온도 변화에 필요한 열에너지양을 나타냅니다.',
              'The fundamental heat transfer formula is Q = m × c × ΔT, representing the heat energy required for a temperature change.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">Q = m × c × ΔT</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">Q</strong> — {L('필요 열에너지 [J, kJ, kcal, BTU]', 'Required heat energy [J, kJ, kcal, BTU]')}</li>
          <li><strong className="font-semibold text-red-500">m</strong> — {L('질량 [kg, g, lb]', 'Mass [kg, g, lb]')}</li>
          <li><strong className="font-semibold text-blue-600">c</strong> — {L('비열 용량 [J/(kg·K), kJ/(kg·°C), kcal/(kg·°C), BTU/(lb·°F)]', 'Specific heat capacity [J/(kg·K), kJ/(kg·°C), kcal/(kg·°C), BTU/(lb·°F)]')}</li>
          <li><strong className="font-semibold text-orange-600">ΔT</strong> — {L('온도 변화량 [K, °C, °F] (T_final − T_initial)', 'Temperature change [K, °C, °F] (T_final − T_initial)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('일반적인 비열 용량 참고값 (상온)', 'Common specific heat capacity values (at room temperature)')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('물: 4.186 kJ/(kg·K) = 1.000 kcal/(kg·°C)', 'Water: 4.186 kJ/(kg·K) = 1.000 kcal/(kg·°C)')}</li>
            <li>{L('알루미늄: 0.897 kJ/(kg·K)', 'Aluminum: 0.897 kJ/(kg·K)')}</li>
            <li>{L('구리: 0.385 kJ/(kg·K)', 'Copper: 0.385 kJ/(kg·K)')}</li>
            <li>{L('강: 0.490 kJ/(kg·K)', 'Steel: 0.490 kJ/(kg·K)')}</li>
            <li>{L('에어(공기): 1.005 kJ/(kg·K)', 'Air: 1.005 kJ/(kg·K)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('단위 환산', 'Unit conversion')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('1 kJ = 0.239 kcal = 0.9478 BTU', '1 kJ = 0.239 kcal = 0.9478 BTU')}</li>
            <li>{L('1 kcal = 4.186 kJ = 3.968 BTU', '1 kcal = 4.186 kJ = 3.968 BTU')}</li>
            <li>{L('1 BTU = 1.055 kJ = 0.252 kcal', '1 BTU = 1.055 kJ = 0.252 kcal')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('물의 비열 용량이 매우 크므로, 냉각제로 물을 사용하면 효과적인 열 전달이 가능합니다', 'Water\'s high specific heat capacity makes it an effective cooling medium')}</li>
            <li>{L('비열 용량은 온도에 따라 변하므로, 넓은 온도 범위에서는 평균 비열 용량을 사용하는 것이 좋습니다', 'Specific heat capacity changes with temperature; use average values for wide temperature ranges')}</li>
            <li>{L('상변화(증발, 응고)가 동반되면 latent heat(잠열)를 별도로 추가해야 합니다', 'When phase changes (evaporation, solidification) occur, latent heat must be added separately')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('비열 용량은 온도·압력에 따라 변하므로, 상온 근처의 근사값임을 유의하세요', 'Specific heat capacity varies with temperature/pressure; note these are near-room-temperature approximations')}</li>
            <li>{L('기체의 경우 정압비열(Cp)과 정적비열(Cv)이 다르며, 사용 조건에 맞는 값을 선택해야 합니다', 'For gases, specific heat at constant pressure (Cp) and constant volume (Cv) differ; select the appropriate value')}</li>
            <li>{L('혼합물의 비열 용량은 조성에 따라 달라지므로 실험 측정이 권장됩니다', 'Mixture heat capacity varies with composition; experimental measurement is recommended')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['heat-capacity'] || (ko ? '열용량 계산기' : 'Heat Capacity Calculator')}
      description={t?.['heat-capacity'] || (ko ? '물질의 온도 변화에 필요한 열에너지를 계산합니다' : 'Calculate heat energy for temperature change')}
      icon={<span>🔥</span>}
      visualizationComponent={<></>}
      resultComponent={<HeatCapacity />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
