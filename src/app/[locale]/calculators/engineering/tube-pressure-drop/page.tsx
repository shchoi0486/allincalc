'use client';

import React from 'react';
import TubePressureDropCalculator from '@/components/engineering-calculator/TubePressureDropCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function TubePressureDropPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.tubePressureDrop;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '관 내 압력 강하(Pressure Drop)는 유체가 배관·열교환기 튜브를 통과할 때 마찰과 국부 저항으로 인해 잃는 에너지입니다. 펌프 양정, 배관 지름, 그리고 운전 비용을 결정하는 핵심 요소입니다.',
            'Pressure drop inside a pipe is the energy lost to friction and minor losses as fluid flows through piping or heat-exchanger tubes. It is a key factor setting pump head, pipe diameter and operating cost.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '길이 L, 내경 D, 유속 v, 유체 밀도 ρ, 그리고 Darcy 마찰 계수 f를 입력하면 튜브 내 압력 강하 ΔP(또는 수두 손실 h_f)를 계산합니다. 열교환기 튜브 설계에 주로 쓰입니다.',
              'Given length L, inside diameter D, velocity v, fluid density ρ and the Darcy friction factor f, it computes the pressure drop ΔP (or head loss h_f) inside the tube — chiefly used for heat-exchanger tube design.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('펌프/압축기 필요 양정·동력 산정', 'Sizing required pump/compressor head and power')}</li>
            <li>{L('배관 지름·유속 최적화(에너지 vs 투자비)', 'Optimizing pipe diameter and velocity (energy vs capital cost)')}</li>
            <li>{L('열교환기 튜브 측 압력 손실 평가', 'Evaluating tube-side pressure loss in heat exchangers')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('Darcy-Weisbach 방정식', 'Darcy-Weisbach Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '압력 강하는 마찰 계수 f, 길이-지름비 L/D, 그리고 동압(ρv²/2)에 비례합니다. 수두 손실 h_f는 중력 가속도 g로 나눈 형태입니다.',
              'The pressure drop is proportional to the friction factor f, the length-to-diameter ratio L/D, and the dynamic pressure (ρv²/2). Head loss h_f is the same relation divided by g.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-xl">ΔP = f · (L/D) · (ρv²/2)</p>
            <p className="font-mono text-lg mt-2">h_f = f · (L/D) · (v²/2g)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">ΔP</strong> — {L('압력 강하 [Pa]', 'Pressure drop [Pa]')}</li>
          <li><strong className="font-semibold text-blue-600">h_f</strong> — {L('수두 손실 [m]', 'Head loss [m]')}</li>
          <li><strong className="font-semibold text-green-600">f</strong> — {L('Darcy 마찰 계수 (무차원)', 'Darcy friction factor (dimensionless)')}</li>
          <li><strong className="font-semibold text-purple-600">L, D</strong> — {L('길이 및 내부 지름 [m]', 'Length and inside diameter [m]')}</li>
          <li><strong className="font-semibold text-yellow-600">v, ρ</strong> — {L('유속 [m/s] 및 밀도 [kg/m³]', 'Velocity [m/s] and density [kg/m³]')}</li>
          <li><strong className="font-semibold text-orange-600">g</strong> — {L('중력 가속도 (≈ 9.81 m/s²)', 'Gravitational acceleration (≈ 9.81 m/s²)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('마찰 계수 f는 Reynolds 수(Re = ρvD/μ)와 관 거칠기로 결정되며, 난류일수록 커집니다.', 'f is set by Reynolds number (Re = ρvD/μ) and roughness; it grows with turbulence.')}</li>
            <li>{L('압력 강하는 유속의 제곱(v²)에 비례 → 유속을 2배하면 손실은 4배가 됩니다.', 'Drop scales with v² → doubling velocity quadruples the loss.')}</li>
            <li>{L('지름 D가 작아지면 L/D와 동압 모두 커져 손실이 급증합니다.', 'A smaller D raises both L/D and dynamic pressure, sharply increasing loss.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '물(ρ = 1000 kg/m³)이 내경 50 mm, 길이 10 m 튜브를 2 m/s로 흐르고 f = 0.02라고 하면: ΔP = 0.02 × (10/0.05) × (1000×2²/2) = 0.02 × 200 × 2000 = 8000 Pa = 8 kPa, 수두 손실 h_f ≈ 0.82 m입니다.',
              'For water (ρ = 1000 kg/m³) flowing at 2 m/s in a 50 mm ID, 10 m long tube with f = 0.02: ΔP = 0.02 × (10/0.05) × (1000×2²/2) = 0.02 × 200 × 2000 = 8000 Pa = 8 kPa, with head loss h_f ≈ 0.82 m.',
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
            <li>{L('마찰 계수 f는 Moody 차트나 Colebrook-White 식으로 구하세요(완전 발달 난류 기준).', 'Obtain f from the Moody chart or Colebrook–White equation (fully developed turbulent flow).')}</li>
            <li>{L('엘보우·밸브 등 국부 손실은 등가 길이(Le)로 환산해 L에 더하세요.', 'Add minor losses (elbows, valves) as equivalent length Le to L.')}</li>
            <li>{L('경제적 유속 범위(물 약 1~3 m/s) 내에서 지름을 정하면 비용이 균형잡힙니다.', 'Pick diameter within an economic velocity range (water ≈ 1–3 m/s) for balanced cost.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('본 식은 단상·뉴턴 유체의 완전 발달 유동에 적합하며, 층류에서는 f = 64/Re입니다.', 'Valid for single-phase Newtonian fully developed flow; in laminar flow f = 64/Re.')}</li>
            <li>{L('비뉴턴 유체·다상 유동·압축성 효과가 크면 별도 상관식을 써야 합니다.', 'For non-Newtonian, multiphase or strongly compressible flow, use dedicated correlations.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '튜브 압력 강하 계산기' : 'Tube Pressure Drop Calculator')}
      description={t?.description || (ko ? 'Darcy-Weisbach 식으로 튜브 내 압력 강하를 계산합니다.' : 'Calculate pressure drop in tubes.')}
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<TubePressureDropCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
