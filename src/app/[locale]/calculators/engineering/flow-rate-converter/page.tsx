'use client';

import React from 'react';
import FlowRateConverter from '@/components/engineering-calculator/FlowRateConverter';
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
            '유량은 단위 시간당 흐르는 유체의 부피 또는 질량으로, 배관·수처리·화학 공정 설계의 핵심 파라미터입니다. 이 계산기는 LPM, GPM, m³/h, kg/s 등 주요 유량 단위 간의 상호 변환을 수행합니다.',
            'Flow rate is the volume or mass of fluid passing per unit time, a core parameter in piping, water treatment, and chemical process design. This calculator converts between major flow rate units including LPM, GPM, m³/h, and kg/s.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '입력된 유량 값을 선택한 원래 단위에서 대상 단위로 변환합니다. 부피 유량과 질량 유량 모두 지원하며, 유체 밀도가 필요할 경우 자동으로 환산합니다.',
              'It converts an input flow rate value from the selected source unit to the target unit. Both volumetric and mass flow rates are supported, with automatic conversion when fluid density is required.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('각국·각 산업에서 사용하는 유량 단위가 다르므로 정확한 변환이 필요합니다', 'Different countries and industries use different flow rate units, requiring accurate conversion')}</li>
            <li>{L('배관 설계, 밸브 선정, 펌프 용량 결정 시 단위 일치가 필수적입니다', 'Unit consistency is essential in piping design, valve selection, and pump sizing')}</li>
            <li>{L('외국 장비·도면의 유량 데이터를 국내 기준으로 환산해야 하는 경우가 많습니다', 'Converting flow data from foreign equipment/drawings to domestic standards is frequently needed')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('유량 변환 공식', 'Flow Rate Conversion Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '부피 유량은 Q = V / t로 정의되며, 질량 유량은 밀도를 곱하여 환산합니다.',
              'Volumetric flow rate is defined as Q = V/t, and mass flow rate is converted by multiplying by density.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">Q = V / t</p>
            <p className="font-mono text-lg text-center text-purple-600">ṁ = ρ × Q</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">Q</strong> — {L('부피 유량 [LPM, m³/h, GPM 등]', 'Volumetric flow rate [LPM, m³/h, GPM, etc.]')}</li>
          <li><strong className="font-semibold text-red-500">V</strong> — {L('유체 부피 [L, m³, gal]', 'Fluid volume [L, m³, gal]')}</li>
          <li><strong className="font-semibold text-blue-600">t</strong> — {L('시간 [min, h, s]', 'Time [min, h, s]')}</li>
          <li><strong className="font-semibold text-orange-600">ṁ</strong> — {L('질량 유량 [kg/s, lb/min]', 'Mass flow rate [kg/s, lb/min]')}</li>
          <li><strong className="font-semibold text-purple-600">ρ</strong> — {L('유체 밀도 [kg/m³, lb/ft³]', 'Fluid density [kg/m³, lb/ft³]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('자주 쓰이는 환산 계수', 'Common conversion factors')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('1 LPM = 0.06 m³/h = 0.2642 GPM', '1 LPM = 0.06 m³/h = 0.2642 GPM')}</li>
            <li>{L('1 GPM = 3.785 LPM = 0.2271 m³/h', '1 GPM = 3.785 LPM = 0.2271 m³/h')}</li>
            <li>{L('1 m³/h = 16.667 LPM = 4.403 GPM', '1 m³/h = 16.667 LPM = 4.403 GPM')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('질량 유량과 부피 유량을 혼동하지 마세요. 밀도를 반드시 고려하세요', 'Do not confuse mass flow rate and volumetric flow rate — always account for density')}</li>
            <li>{L('미국식 GPM(갤런)과 영국식 Imp GPM(임페리얼 갤런)은 다릅니다', 'US GPM (gallons) and Imperial GPM (Imp gal) are different')}</li>
            <li>{L('정상 유동 조건에서의 값이며, 비정상 유동(transient)에는 별도 해석이 필요합니다', 'Values are for steady-state flow; transient flow requires separate analysis')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('질량 유량 변환 시 유체 밀도를 별도로 입력해야 하며, 온도에 따라 밀도가 변합니다', 'Mass flow conversion requires separate density input, which changes with temperature')}</li>
            <li>{L('가스 유량은 압력·온도 조건에 따라 부피가 크게 달라지므로 표준 조건(Nm³/h)으로 환산이 필요합니다', 'Gas volume varies greatly with pressure/temperature, requiring conversion to standard conditions (Nm³/h)')}</li>
            <li>{L('비압축성 유체(액체)에 해당하는 변환이며, 가스의 경우 압축성까지 고려해야 합니다', 'Conversions apply to incompressible fluids (liquids); gases require compressibility considerations')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['flow-rate-converter'] || (ko ? '유량 단위 변환기' : 'Flow Rate Unit Converter')}
      description={t?.['flow-rate-converter'] || (ko ? '유량 단위를 상호 변환합니다' : 'Convert between flow rate units')}
      icon={<span>🔄</span>}
      visualizationComponent={<></>}
      resultComponent={<FlowRateConverter />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
