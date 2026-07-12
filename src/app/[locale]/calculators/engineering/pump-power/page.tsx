'use client';

import React from 'react';
import PumpPowerCalculator from '@/components/engineering-calculator/PumpPowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

export default function PumpPowerCalculatorPage() {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict.pumpPower;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '펌프 동력 계산기는 펌프 시스템이 유체를 이송하는 데 필요한 동력, 즉 축 동력(Shaft Power)과 모터 동력(Motor Power)을 구하는 공학 도구입니다. 유량·양정·유체 밀도·효율 등을 바탕으로 필요 에너지를 산정해 적절한 펌프와 모터를 선정하는 데 필수적입니다.',
            'The pump power calculator computes the power needed to move fluid through a pump system — the shaft power and the motor power. Based on flow, head, fluid density and efficiencies, it estimates the required energy so the right pump and motor can be selected.',
          )}
        </p>
        <p>
          {L(
            '펌프 동력 계산은 유량, 양정, 유체 밀도, 펌프 효율, 모터 효율 등의 변수를 기반으로 합니다. 정확한 동력 계산은 과소 설계로 인한 성능 부족과 과대 설계로 인한 비용·에너지 낭비를 모두 방지합니다.',
            'Pump power calculation rests on variables such as flow rate, head, fluid density, pump efficiency and motor efficiency. Accurate sizing prevents both underperformance from undersizing and wasted cost/energy from oversizing.',
          )}
        </p>
        <p>
          {L(
            '이 계산기는 축 동력(펌프가 유체를 실제로 이송하는 데 필요한 유체역학적 동력)과 모터 동력(그 펌프를 구동하는 모터가 소비하는 총 동력)을 계산하며, 각 단계의 효율 손실을 정확히 반영합니다.',
            'This calculator computes the shaft power (the actual hydraulic power the pump imparts to the fluid) and the motor power (the total power the driving motor consumes), correctly accounting for efficiency losses at each stage.',
          )}
        </p>
        <TermGlossary items={[
          { term: L('양정(Head)', 'Head'), desc: L('펌프가 유체를 들어 올리거나 밀어내는 높이를 압력 수두로 환산한 값', 'The height a pump lifts or pushes fluid, expressed as a pressure head') },
          { term: L('유량(Flow rate)', 'Flow rate'), desc: L('단위 시간당 이송되는 유체의 부피', 'The volume of fluid transferred per unit time') },
          { term: L('축 동력(Shaft power)', 'Shaft power'), desc: L('펌프가 유체를 실제로 이송하는 데 필요한 동력', 'The actual power the pump needs to transfer fluid') },
          { term: L('모터 동력(Motor power)', 'Motor power'), desc: L('펌프를 구동하는 모터가 소비하는 총 동력', 'The total power consumed by the motor that drives the pump') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('축 동력 (Shaft Power)', 'Shaft Power')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '유체를 양정 H만큼 들어 올리고 유량 Q로 이송하는 데 필요한 유체역학적 동력입니다. 밀도 ρ와 중력가속도 g를 곱해 단위시간당 이득하는 위치에너지를 구한 뒤 펌프 효율 ηp로 나누어 실제 필요 축 동력을 얻습니다.',
              'This is the hydraulic power required to lift fluid by head H and move it at flow Q. Multiplying density ρ and gravity g gives the rate of potential-energy gain; dividing by pump efficiency ηp yields the actual shaft power needed.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Pshaft = (ρ × g × H × Q) / (ηp × 1000)</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">ρ</strong> — {L('유체 밀도 [kg/m³ 또는 lb/ft³]', 'Fluid density [kg/m³ or lb/ft³]')}</li>
            <li><strong className="font-semibold">g</strong> — {L('중력가속도 (9.81 m/s² 또는 32.174 ft/s²)', 'Gravitational acceleration (9.81 m/s² or 32.174 ft/s²)')}</li>
            <li><strong className="font-semibold">H</strong> — {L('펌프 양정 [m 또는 ft]', 'Pump head [m or ft]')}</li>
            <li><strong className="font-semibold">Q</strong> — {L('유량 [m³/s 또는 gpm]', 'Flow rate [m³/s or gpm]')}</li>
            <li><strong className="font-semibold">ηp</strong> — {L('펌프 효율 (0~1 사이 소수)', 'Pump efficiency (decimal, 0–1)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">
            {L('모터 동력 (Motor Power)', 'Motor Power')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '축 동력을 펌프에 전달하는 모터가 소비하는 총 동력입니다. 모터 효율 ηm으로 다시 나누어 입력 전력을 구합니다.',
              'This is the total power the motor consumes to deliver the shaft power to the pump. Divide by the motor efficiency ηm to obtain the required input electrical power.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Pmotor = Pshaft / ηm</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">ηm</strong> — {L('모터 효율 (0~1 사이 소수)', 'Motor efficiency (decimal, 0–1)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('유량·양정·밀도가 클수록 필요 동력이 선형적으로 커집니다.', 'Larger flow, head or density increases the required power linearly.')}</li>
            <li>{L('효율이 낮을수록 같은 유량·양정을 내기 위해 더 큰 동력이 필요합니다. 따라서 고효율 펌프·모터 선정이 중요합니다.', 'Lower efficiency means more input power is needed for the same duty, so selecting high-efficiency pump and motor matters.')}</li>
            <li>{L('1000으로 나누는 이유는 kg·m²/s³ = W 단위 결과를 kW로 환산하기 위함입니다(미터법 기준).', 'The division by 1000 converts the W result (kg·m²/s³) to kW in the metric system.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '물(ρ = 1000 kg/m³)을 양정 H = 20 m, 유량 Q = 0.05 m³/s로 이송하고 펌프 효율 ηp = 0.75, 모터 효율 ηm = 0.9라고 하면: 유체 동력 = 1000 × 9.81 × 20 × 0.05 = 9810 W. 축 동력 = 9810 / (0.75 × 1000) ≈ 13.08 kW, 모터 동력 = 13.08 / 0.9 ≈ 14.53 kW가 필요합니다.',
              'For water (ρ = 1000 kg/m³) lifted H = 20 m at Q = 0.05 m³/s with pump ηp = 0.75 and motor ηm = 0.9: hydraulic power = 1000 × 9.81 × 20 × 0.05 = 9810 W. Shaft power = 9810 / (0.75 × 1000) ≈ 13.08 kW, and motor power = 13.08 / 0.9 ≈ 14.53 kW.',
            )}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('효율 향상 방법', 'Efficiency Improvement Methods')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>{L('적절한 펌프 선정: ', 'Proper Pump Selection: ')}</strong>{L('운전 포인트에 가장 가까운 최고효율점(BEP) 부근에서 운전되는 펌프를 선택합니다.', 'choose a pump that operates near its best-efficiency point (BEP) for the duty.')}</li>
            <li><strong>{L('변속 구동(VFD): ', 'Variable Frequency Drive (VFD): ')}</strong>{L('유량 조절이 필요할 때 밸브 절탁보다 변속 구동이 에너지 효율적입니다.', 'when flow adjustment is needed, VFD is more energy efficient than throttling valves.')}</li>
            <li><strong>{L('관로 최적화: ', 'Piping Optimization: ')}</strong>{L('불필요한 피팅과 길이를 줄여 마찰 손실을 최소화합니다.', 'minimize friction losses by reducing unnecessary fittings and pipe length.')}</li>
            <li><strong>{L('정기 보수: ', 'Regular Maintenance: ')}</strong>{L('임펠러 마모, 씰 마모 등을 점검하여 효율 저하를 방지합니다.', 'inspect impeller wear, seal wear, etc. to prevent efficiency loss.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('위 식은 정격 효율을 가정한 정상상태 계산이며, 부분부하에서 실효율은 더 낮아질 수 있습니다.', 'This is a steady-state calculation using rated efficiency; real efficiency at part load can be lower.')}</li>
            <li>{L('마찰·국부 손실, NPSH 여유, 시작 토크 등은 별도로 검토해야 합니다.', 'Friction/local losses, NPSH margin and starting torque must be checked separately.')}</li>
            <li>{L('점도가 높은 액체(오일 등)는 효율과 양정이 크게 떨어지므로 물 기준값을 그대로 쓰면 안 됩니다.', 'High-viscosity liquids (oils, etc.) sharply reduce efficiency and head, so water-based values should not be used directly.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t.title}
      description={t.description}
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={<PumpPowerCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
