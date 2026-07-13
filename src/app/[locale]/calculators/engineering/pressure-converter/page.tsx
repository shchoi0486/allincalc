'use client';

import React from 'react';
import PressureConverter from '@/components/engineering-calculator/PressureConverter';
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
            '압력은 단위 면적당 작용하는 힘으로, 다양한 산업 분야에서 여러 단위로 표현됩니다. 이 계산기는 Pa, kPa, bar, atm, psi, mmHg, cmH₂O, inH₂O 등 주요 압력 단위 간의 상호 변환을 수행합니다.',
            'Pressure is force per unit area, expressed in various units across different industries. This calculator converts between major pressure units including Pa, kPa, bar, atm, psi, mmHg, cmH₂O, and inH₂O.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '입력된 압력 값을 선택한 원래 단위에서 대상 단위로 정확하게 변환합니다. 모든 변환은 기준 대기압 1 atm = 101,325 Pa를 기준으로 합니다.',
              'It accurately converts an input pressure value from the selected source unit to the target unit. All conversions are based on the standard atmospheric pressure of 1 atm = 101,325 Pa.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('각국·각 산업에서 사용하는 압력 단위가 다르므로 정확한 변환이 필수적입니다', 'Different countries and industries use different pressure units, making accurate conversion essential')}</li>
            <li>{L('유체 배관, 압력 용기, HVAC 시스템 설계 시 단위 혼동은 치명적 오류를 초래할 수 있습니다', 'Unit confusion in fluid piping, pressure vessels, and HVAC design can cause critical errors')}</li>
            <li>{L('계측기 교정 및 데이터 비교 시 동일 기준 단위로 환산해야 합니다', 'Calibration of instruments and data comparison require conversion to a common unit basis')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('압력 단위 변환 공식', 'Pressure Unit Conversion Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '모든 압력 단위는 기준 대기압 1 atm = 101,325 Pa를 기준으로 정확한 환산 계수를 사용하여 변환합니다.',
              'All pressure units are converted using exact conversion factors based on the standard atmospheric pressure of 1 atm = 101,325 Pa.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">1 atm = 101,325 Pa = 101.325 kPa = 1.01325 bar</p>
            <p className="font-mono text-lg text-center text-purple-600">1 atm = 14.696 psi = 760 mmHg = 10,332.6 cmH₂O</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">Pa (Pascal)</strong> — {L('SI 기본 단위, 1 N/m²', 'SI base unit, 1 N/m²')}</li>
          <li><strong className="font-semibold text-red-500">atm (표준 대기압)</strong> — {L('해수면에서의 표준 대기압', 'Standard atmospheric pressure at sea level')}</li>
          <li><strong className="font-semibold text-blue-600">bar</strong> — {L('100,000 Pa와 정확히 일치', 'Exactly equal to 100,000 Pa')}</li>
          <li><strong className="font-semibold text-orange-600">psi</strong> — {L('미국·영국에서 흔히 사용, 1 lbf/in²', 'Commonly used in US/UK, 1 lbf/in²')}</li>
          <li><strong className="font-semibold text-purple-600">mmHg</strong> — {L('수은주 압력계 기반, 의료 분야에서 사용', 'Based on mercury column, used in medical fields')}</li>
          <li><strong className="font-semibold text-teal-600">cmH₂O / inH₂O</strong> — {L('수주 압력계 기반, 저압 측정에 적합', 'Water column based, suitable for low-pressure measurement')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('일반 변환 공식', 'General conversion formula')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">P<sub>target</sub> = P<sub>source</sub> × (C<sub>target</sub> / C<sub>source</sub>)</p>
          </div>
          <p className="text-sm mt-2">
            {L(
              '여기서 C는 각 단위의 Pa 환산 계수입니다.',
              'where C is the Pa-equivalent conversion factor for each unit.',
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
            <li>{L('1 bar ≈ 1 atm ≈ 14.5 psi이므로 빠른 근사에 활용할 수 있습니다', '1 bar ≈ 1 atm ≈ 14.5 psi, useful for quick approximations')}</li>
            <li>{L('배관 설계에서는 주로 bar 또는 psi를, 의료 분야에서는 mmHg를 사용합니다', 'Piping design typically uses bar or psi; medical fields use mmHg')}</li>
            <li>{L('고진공 영역에서는 Pa 또는 Torr를 사용하는 것이 일반적입니다', 'High vacuum applications typically use Pa or Torr')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('게이지 압력(gauge)과 절대 압력(absolute)을 구분하여 입력해야 합니다', 'You must distinguish between gauge pressure and absolute pressure when entering values')}</li>
            <li>{L('이 계산기는 절대 압력 기준이며, 게이지 압력은 대기압(101.325 kPa)을 더해야 합니다', 'This calculator uses absolute pressure; add atmospheric pressure (101.325 kPa) for gauge pressure')}</li>
            <li>{L('온도·중력 가속도에 따라 수은주/수주 압력 단위의 값이 미세하게 달라질 수 있습니다', 'Mercury/water column units may vary slightly depending on temperature and gravitational acceleration')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['pressure-converter'] || (ko ? '압력 단위 변환기' : 'Pressure Unit Converter')}
      description={t?.['pressure-converter'] || (ko ? '압력 단위를 상호 변환합니다' : 'Convert between pressure units')}
      icon={<span>🔧</span>}
      visualizationComponent={<></>}
      resultComponent={<PressureConverter />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
