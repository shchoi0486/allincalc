'use client';

import React from 'react';
import OrificeFlowCalculator from '@/components/engineering-calculator/OrificeFlowCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function OrificeFlowPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.orificeFlow;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '오리피스 유량식은 배관 내에 설치한 얇은 구멍판(orifice plate)을 통과할 때 생기는 차압(ΔP)으로부터 유량을 구하는 관계식입니다. 유량계의 원리이자, 배관의 제한 공(orifice)을 통한 유체 방출을 해석하는 기본식입니다.',
            'The orifice-flow equation relates the flow rate through a thin plate with a hole (orifice plate) installed in a pipe to the pressure drop (ΔP) it creates. It is both the principle of an orifice flow meter and the basic relation for fluid discharge through a pipe restriction.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '오리피스 직경 d, 배관 직경 D, 유체 밀도 ρ, 그리고 차압 ΔP로부터 체적 유량 Q를 계산합니다. 베타비 β = d/D와 유량 계수 C_d를 통해 실제 유량 손실을 보정합니다.',
              'From the orifice diameter d, pipe diameter D, fluid density ρ and pressure drop ΔP, it computes the volumetric flow rate Q. The beta ratio β = d/D and the discharge coefficient C_d correct for real-flow losses.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('차압식 유량계(orifice meter)의 유량 환산 원리 이해', 'Understanding flow conversion in differential-pressure (orifice) meters')}</li>
            <li>{L('배관 내 제한부를 지날 때의 유량·차압 설계', 'Sizing flow and pressure drop across a restriction in a pipeline')}</li>
            <li>{L('탱크·용기의 구멍을 통한 방출 유량 추정', 'Estimating discharge through openings in tanks and vessels')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('오리피스 유량 방정식', 'Orifice Flow Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '차압에 의한 구동 에너지(2ΔP/ρ)를 속도로 환산하고, 오리피스 단면적 A_o와 유량 계수 C_d를 곱합니다. 배관과 오리피스의 면적비에 따른 유속 보정항 (1−β⁴)이 분모에 들어갑니다.',
              'It converts the driving energy from the pressure drop (2ΔP/ρ) into velocity, then multiplies by the orifice area A_o and the discharge coefficient C_d. A velocity-correction term for the area ratio, (1−β⁴), appears in the denominator.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Q = C_d · A_o · √[ 2ΔP / (ρ·(1 − β⁴)) ]</p>
            <p className="font-mono text-sm text-muted-foreground">β = d / D</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">Q</strong> — {L('체적 유량 [m³/s (ft³/s)]', 'Volumetric flow rate [m³/s (ft³/s)]')}</li>
          <li><strong className="font-semibold text-green-600">C_d</strong> — {L('유량 계수 (실제/이론 유량비, 보통 ≈ 0.61)', 'Discharge coefficient (actual/theoretical flow, typically ≈ 0.61)')}</li>
          <li><strong className="font-semibold text-purple-600">A_o</strong> — {L('오리피스 단면적 (π·d²/4) [m² (ft²)]', 'Orifice area (π·d²/4) [m² (ft²)]')}</li>
          <li><strong className="font-semibold text-red-600">ΔP</strong> — {L('차압(압력 강하) [Pa (psi)]', 'Pressure drop [Pa (psi)]')}</li>
          <li><strong className="font-semibold text-yellow-600">ρ</strong> — {L('유체 밀도 [kg/m³ (lb/ft³)]', 'Fluid density [kg/m³ (lb/ft³)]')}</li>
          <li><strong className="font-semibold text-orange-600">β</strong> — {L('베타 비 (오리피스 직경 / 배관 직경)', 'Beta ratio (orifice diameter / pipe diameter)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('차압 ΔP가 클수록 유량은 √ΔP 에 비례해 커집니다.', 'A larger pressure drop ΔP increases flow proportionally to √ΔP.')}</li>
            <li>{L('유체 밀도 ρ가 클수록 같은 차압으로 얻는 유량은 작아집니다 (분모).', 'A larger density ρ reduces the flow for the same drop (denominator).')}</li>
            <li>{L('베타비 β가 1에 가까울수록 (오리피스≈배관) 보정항 (1−β⁴)이 작아져 유량이 커집니다.', 'As the beta ratio β approaches 1 (orifice ≈ pipe), the correction (1−β⁴) shrinks and flow grows.')}</li>
            <li>{L('유량 계수 C_d는 베타비·레이놀즈 수·설치 조건에 따라 달라지며, 표준 오리피스에서 ≈ 0.6~0.62입니다.', 'The discharge coefficient C_d depends on β, Reynolds number and installation; for standard orifices it is ≈ 0.6–0.62.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '직경 100 mm 배관에 50 mm 오리피스(β = 0.5)를 설치하고, 물(ρ = 1000 kg/m³)에서 차압 10 kPa가 걸린다고 가정합니다. 보정항 (1−0.5⁴) = 0.9375, A_o = π·0.05²/4 ≈ 0.001963 m². Q ≈ 0.61 × 0.001963 × √[ 2×10000 / (1000×0.9375) ] ≈ 0.61 × 0.001963 × 4.62 ≈ 0.0055 m³/s (약 5.5 L/s) 가 됩니다.',
              'For a 50 mm orifice (β = 0.5) in a 100 mm pipe with water (ρ = 1000 kg/m³) at a 10 kPa drop: correction (1−0.5⁴) = 0.9375, A_o = π·0.05²/4 ≈ 0.001963 m². Q ≈ 0.61 × 0.001963 × √[ 2×10000 / (1000×0.9375) ] ≈ 0.61 × 0.001963 × 4.62 ≈ 0.0055 m³/s (about 5.5 L/s).',
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
            <li>{L('정확한 C_d를 얻으려면 직선 관 구간(상류 10D, 하류 5D 이상)을 확보해 난류를 안정시키세요.', 'Keep straight pipe runs (≥10D upstream, ≥5D downstream) for a stable turbulent profile and accurate C_d.')}</li>
            <li>{L('베타비는 보통 0.3~0.7 범위에서 설계하며, 너무 크면 차압이 작아 측정 오차가 커집니다.', 'Design beta ratio in roughly 0.3–0.7; too large a β gives a small, error-prone pressure drop.')}</li>
            <li>{L('압축성 기체에서는 밀도 변화(팽창 보정)를 별도로 적용해야 합니다.', 'For compressible gas, apply an expansion correction for density change.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('C_d는 경험 상수로, 오염·마모·설치 오차가 누적되면 정확도가 떨어집니다.', 'C_d is empirical; fouling, wear and installation error degrade accuracy over time.')}</li>
            <li>{L('고점도 유체나 저레이놀즈 영역에서는 C_d가 급변하므로 별도 보정이 필요합니다.', 'At high viscosity or low Reynolds number, C_d changes sharply and needs separate correction.')}</li>
            <li>{L('오리피스는 영구 압력 손실이 커 에너지 효율이 중요한 곳에는 부적합할 수 있습니다.', 'Orifices cause significant permanent pressure loss and may be unsuitable where energy efficiency matters.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout 
      title={t?.title || "Orifice Flow Calculator"}
      description={t?.description || "Calculate flow rate using orifice plate."}
      icon={<span>🚰</span>}
      visualizationComponent={<></>}
      resultComponent={<OrificeFlowCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
