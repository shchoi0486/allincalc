'use client';

import React from 'react';
import SpecificGravity from '@/components/engineering-calculator/SpecificGravity';
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
            '비중(Specific Gravity, SG)은 어떤 물질의 밀도를 동일 온도의 물 밀도로 나눈 무차원 수치입니다. 물보다 무거우면 SG > 1, 가볍면 SG < 1이 됩니다.',
            'Specific Gravity (SG) is the ratio of a substance\'s density to the density of water at the same temperature. It is dimensionless: SG > 1 means heavier than water, SG < 1 means lighter.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '물질의 밀도와 온도를 입력하면, 해당 온도의 물 밀도를 기준으로 비중을 계산합니다. 반대로 비중으로부터 물질 밀도도 구할 수 있습니다.',
              'Enter a substance\'s density and temperature to calculate its specific gravity relative to water density at that temperature. You can also find the substance density from its specific gravity.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('부양·침강 판단: SG < 1이면 물에 뜨고, SG > 1이면 가라앉습니다', 'Buoyancy/sinking judgment: SG < 1 floats, SG > 1 sinks in water')}</li>
            <li>{L('화학 물질 식별: 비중은 물질의 순도·조성을 판별하는 빠른 방법입니다', 'Substance identification: specific gravity is a quick way to assess purity and composition')}</li>
            <li>{L('배관·탱크 설계: 유체의 비중은 펌프 전력, 배관 압력 강하 계산에 필수적입니다', 'Piping/tank design: fluid specific gravity is essential for pump power and pressure drop calculations')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('비중 계산 공식', 'Specific Gravity Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '비중은 물질의 밀도를 같은 온도의 물 밀도로 나누어 구합니다. 4°C의 물 밀도(1000 kg/m³)를 기준으로 하거나, 계산 온도의 물 밀도를 사용할 수 있습니다.',
              'Specific gravity is found by dividing the substance density by water density at the same temperature. Either 4°C water density (1000 kg/m³) or the water density at the calculation temperature can be used.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">SG = ρ<sub>substance</sub> / ρ<sub>water</sub></p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">SG</strong> — {L('비중 (무차원)', 'Specific gravity (dimensionless)')}</li>
          <li><strong className="font-semibold text-red-500">ρ<sub>substance</sub></strong> — {L('물질의 밀도 [kg/m³]', 'Density of the substance [kg/m³]')}</li>
          <li><strong className="font-semibold text-blue-600">ρ<sub>water</sub></strong> — {L('같은 온도의 물 밀도 [kg/m³]', 'Density of water at the same temperature [kg/m³]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('밀도 역변환', 'Inverse density calculation')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">ρ<sub>substance</sub> = SG × ρ<sub>water</sub></p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('일반적인 비중 참고값', 'Common specific gravity reference values')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('가솔린: 0.70~0.78', 'Gasoline: 0.70–0.78')}</li>
            <li>{L('알코올(에탄올): 0.79', 'Alcohol (ethanol): 0.79')}</li>
            <li>{L('물: 1.000 (기준)', 'Water: 1.000 (reference)')}</li>
            <li>{L('해수: 1.025', 'Seawater: 1.025')}</li>
            <li>{L('염화나트륨 용액(포화): 1.20', 'Sodium chloride solution (saturated): 1.20')}</li>
            <li>{L('수은: 13.55', 'Mercury: 13.55')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('비중은 온도에 따라 변하므로, 측정 온도를 반드시 기록하세요', 'Specific gravity changes with temperature, so always record the measurement temperature')}</li>
            <li>{L('일반적으로 20°C/4°C 기준(ρ_water = 998.2 kg/m³) 또는 15.6°C/15.6°C(60°F/60°F) 기준을 사용합니다', 'Commonly used references are 20°C/4°C (ρ_water = 998.2 kg/m³) or 15.6°C/15.6°C (60°F/60°F)')}</li>
            <li>{L('비중은 액체 레벨 측정(부이)에서 밀도 보정에 활용됩니다', 'Specific gravity is used for density correction in liquid level measurement (buoyancy)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('비중은 기준 온도에 따라 값이 달라지므로, 기준 온도를 명확히 밝혀야 합니다', 'Specific gravity values vary with reference temperature; the basis must be clearly stated')}</li>
            <li>{L('기체의 비중은 보통 공기(ρ ≈ 1.225 kg/m³) 대비로 정의되며, 이 계산기는 액체 기준입니다', 'Gas specific gravity is typically relative to air (ρ ≈ 1.225 kg/m³); this calculator is for liquids')}</li>
            <li>{L('혼합 액체의 비중은 조성에 따라 크게 달라지므로 실험 측정이 권장됩니다', 'Mixture specific gravity varies greatly with composition; experimental measurement is recommended')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['specific-gravity'] || (ko ? '비중 계산기' : 'Specific Gravity Calculator')}
      description={t?.['specific-gravity'] || (ko ? '물 대비 특정 물질의 비중을 계산합니다' : 'Calculate specific gravity relative to water')}
      icon={<span>⚖️</span>}
      visualizationComponent={<></>}
      resultComponent={<SpecificGravity />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
