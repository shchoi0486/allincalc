'use client';

import React from 'react';
import IdealGasCalculator from '@/components/engineering-calculator/IdealGasCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function IdealGasCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.idealGas;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '이상기체 법칙(Ideal Gas Law)은 기체의 압력, 부피, 몰수, 온도 사이의 관계를 하나의 상태 방정식으로 묶은 열역학의 기본 법칙입니다. 보일 법칙, 샤를 법칙, 아보가드로 법칙을 통합한 결과로, 상온·상압의 대부분 기체를 잘 근사합니다.',
            'The ideal gas law is a fundamental thermodynamic relation that ties together a gas\'s pressure, volume, amount (moles), and temperature in a single equation of state. It combines Boyle\'s, Charles\'s, and Avogadro\'s laws and describes most gases well at ordinary temperatures and pressures.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 P, V, n, T 네 변수 중 세 개를 알면 나머지 하나를 이상기체 상태 방정식으로 구합니다. 다양한 단위(Pa/atm/psi, m³/L/ft³ 등)를 지원합니다.',
              'Given any three of the four variables P, V, n, and T, this calculator solves for the remaining one using the ideal gas equation of state, supporting a range of units (Pa/atm/psi, m³/L/ft³, and so on).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('화학 반응의 기체 생성량·소모량 계산 (화학량론)', 'Calculating amounts of gas produced or consumed in reactions (stoichiometry)')}</li>
            <li>{L('탱크·용기 내 기체의 압력·부피 예측과 저장 설계', 'Predicting gas pressure and volume in tanks and vessels for storage design')}</li>
            <li>{L('온도 변화에 따른 기체 팽창·수축 산정 (HVAC, 공정)', 'Estimating gas expansion or contraction with temperature (HVAC, process engineering)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('이상기체 상태 방정식', 'Ideal Gas Law Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '이상기체 법칙은 압력과 부피의 곱이 몰수, 기체 상수, 절대온도의 곱과 같다는 관계입니다.',
              'The ideal gas law states that the product of pressure and volume equals the product of the number of moles, the gas constant, and the absolute temperature.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex justify-center">
            <p className="font-mono text-xl tracking-widest text-center">P · V = n · R · T</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-purple-600">P</strong> — {L('압력 [Pa, atm, psi]', 'Pressure [Pa, atm, psi]')}</li>
          <li><strong className="font-semibold text-blue-600">V</strong> — {L('부피 [m³, L, ft³]', 'Volume [m³, L, ft³]')}</li>
          <li><strong className="font-semibold text-green-600">n</strong> — {L('몰수 [mol]', 'Number of moles [mol]')}</li>
          <li><strong className="font-semibold text-red-600">T</strong> — {L('절대 온도 [K]', 'Absolute temperature [K]')}</li>
          <li><strong className="font-semibold text-yellow-600">R</strong> — {L('이상기체 상수 (≈ 8.314 J/(mol·K) 또는 0.08206 L·atm/(mol·K))', 'Ideal gas constant (≈ 8.314 J/(mol·K) or 0.08206 L·atm/(mol·K))')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('온도 T가 일정하면 P와 V는 반비례합니다 (보일 법칙): 압축하면 압력이 오릅니다.', 'At constant temperature T, P and V are inversely related (Boyle\'s law): compressing the gas raises its pressure.')}</li>
            <li>{L('압력 P가 일정하면 V는 절대온도 T에 비례합니다 (샤를 법칙): 데우면 팽창합니다.', 'At constant pressure P, V is proportional to absolute temperature T (Charles\'s law): heating expands the gas.')}</li>
            <li>{L('몰수 n이 많을수록 같은 부피·온도에서 압력이 높아집니다.', 'More moles n produce a higher pressure at the same volume and temperature.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '0 °C(273.15 K), 1 atm에서 기체 1 mol의 부피를 구하면 V = nRT/P = (1 × 0.08206 × 273.15) / 1 ≈ 22.4 L. 이것이 표준 상태에서 이상기체 1 mol의 몰부피(22.4 L)입니다.',
              'At 0 °C (273.15 K) and 1 atm, the volume of 1 mol of gas is V = nRT/P = (1 × 0.08206 × 273.15) / 1 ≈ 22.4 L — the familiar molar volume of an ideal gas at standard conditions (22.4 L).',
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
            <li>{L('온도는 반드시 절대온도(K)로 넣어야 합니다. 섭씨는 K = °C + 273.15로 변환하세요.', 'Always use absolute temperature (K). Convert from Celsius with K = °C + 273.15.')}</li>
            <li>{L('R 값은 사용하는 단위계와 일치해야 합니다 (SI에서는 8.314 J/(mol·K)).', 'The value of R must match your unit system (use 8.314 J/(mol·K) in SI).')}</li>
            <li>{L('상태 변화 문제에서는 P₁V₁/T₁ = P₂V₂/T₂ (결합기체 법칙)로 두 상태를 비교하면 편리합니다.', 'For state changes, comparing two states with P₁V₁/T₁ = P₂V₂/T₂ (the combined gas law) is convenient.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이상기체 가정은 고압·저온에서 무너집니다. 이때는 분자 간 힘과 분자 부피를 고려한 반데르발스 식 등 실제 기체 상태식이 필요합니다.', 'The ideal-gas assumption breaks down at high pressure and low temperature; real-gas equations such as van der Waals (accounting for intermolecular forces and molecular volume) are then needed.')}</li>
            <li>{L('기체가 응축(액화)에 가까워지거나 임계점 근처에서는 오차가 커집니다.', 'Errors grow as the gas approaches condensation or its critical point.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('이상기체 법칙 계산기', 'Ideal Gas Law Calculator')}
      description={t?.description || L('압력, 부피, 몰수, 온도의 관계를 이상기체 법칙으로 계산합니다.', 'Solve for pressure, volume, moles, or temperature using the ideal gas law.')}
      icon={<span>🧪</span>}
      visualizationComponent={<></>}
      resultComponent={<IdealGasCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
