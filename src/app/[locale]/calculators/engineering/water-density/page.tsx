'use client';

import React from 'react';
import WaterDensity from '@/components/engineering-calculator/WaterDensity';
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
            '물의 밀도는 온도에 따라 변하며, 4°C에서 최대값(약 1000 kg/m³)을 나타냅니다. 이 계산기는 온도를 입력받아 물의 밀도를 다항식 근사 공식으로 계산합니다.',
            'Water density varies with temperature, reaching its maximum (approximately 1000 kg/m³) at 4°C. This calculator computes water density from temperature using a polynomial approximation formula.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '주어진 온도(0~100°C 범위)에서 물의 밀도를 kg/m³ 또는 g/cm³ 단위로 계산합니다. 액상수(기본)와 증기 모두 지원합니다.',
              'It calculates water density at a given temperature (0–100°C range) in kg/m³ or g/cm³. Both liquid water (default) and steam are supported.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('유체역학 계산에서 밀도는 Reynolds 수, 유량, 압력 강하 등에 직접 영향을 줍니다', 'Density directly affects Reynolds number, flow rate, pressure drop, and other fluid dynamics calculations')}</li>
            <li>{L('열전달 계산에서 자연 대류의 부력력은 밀도 차이에 의해 결정됩니다', 'Buoyancy force in natural convection is determined by density differences in heat transfer calculations')}</li>
            <li>{L('화학 공정에서 반응물 농도·유량 조절에 물 밀도의 정확한 값이 필요합니다', 'Accurate water density is needed for adjusting reactant concentration and flow rates in chemical processes')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('물 밀도 다항식 근사', 'Polynomial Approximation for Water Density')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'Kell의 다항식을 단순화한 근사 공식을 사용하며, 0~100°C 범위에서 ±0.05% 이내의 정확도를 가집니다.',
              'A simplified version of Kell\'s polynomial is used, providing accuracy within ±0.05% over the 0–100°C range.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">
              ρ(T) = 999.842594 + 6.793952×10⁻²·T − 9.095290×10⁻³·T²
            </p>
            <p className="font-mono text-lg text-center text-purple-600">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 1.001685×10⁻⁴·T³ − 1.120083×10⁻⁶·T⁴
            </p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">ρ(T)</strong> — {L('온도 T에서의 물 밀도 [kg/m³]', 'Water density at temperature T [kg/m³]')}</li>
          <li><strong className="font-semibold text-red-500">T</strong> — {L('섭씨 온도 [°C] (0~100°C)', 'Temperature in Celsius [°C] (0–100°C)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('참고 밀도값', 'Reference density values')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('0°C: 999.8 kg/m³', '0°C: 999.8 kg/m³')}</li>
            <li>{L('4°C: 1000.0 kg/m³ (최대 밀도)', '4°C: 1000.0 kg/m³ (maximum density)')}</li>
            <li>{L('20°C: 998.2 kg/m³', '20°C: 998.2 kg/m³')}</li>
            <li>{L('100°C: 958.4 kg/m³', '100°C: 958.4 kg/m³')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('일반 공정 계산에서는 20°C에서 998.2 kg/m³을 근사값으로 자주 사용합니다', 'For general process calculations, 998.2 kg/m³ at 20°C is commonly used as an approximation')}</li>
            <li>{L('4°C 부근에서 밀도 변화가 작으므로, 냉수 시스템에서는 온도 영향이 크지 않습니다', 'Density change is minimal near 4°C, so temperature effects are small in chilled water systems')}</li>
            <li>{L('해수의 밀도는 염도(약 3.5%) 때문에 약 1025 kg/m³으로 일반 물과 다릅니다', 'Seawater density differs from fresh water at approximately 1025 kg/m³ due to salinity (~3.5%)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 공식은 순수한 물(증류수) 기준이며, 용해된 염류·가스에 의한 밀도 변화는 반영하지 않습니다', 'This formula is for pure (distilled) water and does not account for density changes from dissolved salts or gases')}</li>
            <li>{L('고압 조건(10 bar 이상)에서는 압력에 의한 밀도 변화를 별도로 고려해야 합니다', 'At high pressures (>10 bar), pressure-induced density changes must be considered separately')}</li>
            <li>{L('결빙 시 부피가 약 9% 팽창하므로, 동결 방지 설계 시 주의가 필요합니다', 'Freezing causes ~9% volume expansion, requiring caution in freeze protection design')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['water-density'] || (ko ? '물 밀도 계산기' : 'Water Density Calculator')}
      description={t?.['water-density'] || (ko ? '온도에 따른 물의 밀도를 계산합니다' : 'Calculate water density as a function of temperature')}
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<WaterDensity />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
