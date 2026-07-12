'use client';

import React from 'react';
import ReynoldsNumberCalculator from '@/components/engineering-calculator/ReynoldsNumberCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function ReynoldsNumberPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.reynoldsNumber;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '레이놀즈 수(Reynolds Number, Re)는 유체의 관성력과 점성력의 비를 나타내는 무차원수입니다. 이 값 하나로 관 내부 유동이 층류인지 난류인지, 그 사이 천이 영역인지를 판별하며, 관 마찰계수·열전달·압력 손실 해석의 출발점입니다.',
            'The Reynolds number (Re) is a dimensionless ratio of inertial to viscous forces in a fluid. From this single value we decide whether pipe flow is laminar, turbulent, or in between (transitional), and it is the starting point for friction-factor, heat-transfer and pressure-drop analysis.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '밀도(또는 비중), 유속, 관 내경, 동점성 계수(또는 동점도)를 입력받아 Re를 계산하고, 해당하는 유동 영역(층류/천이/난류)을 표시합니다.',
              'It takes density (or specific gravity), velocity, pipe inner diameter and dynamic viscosity (or kinematic viscosity), computes Re, and reports the corresponding flow regime (laminar/transitional/turbulent).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('관 마찰계수(무역) 선정과 압력 손실(다르시-베이스바흐) 계산', 'Selecting pipe friction factor and computing pressure drop (Darcy–Weisbach)')}</li>
            <li>{L('열교환기 설계에서 대류 열전달 계수 상관식 선택', 'Choosing convection correlations in heat-exchanger design')}</li>
            <li>{L('펌프·밸브·측정기의 적정 유속 범위 검토', 'Checking suitable velocity ranges for pumps, valves and meters')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('레이놀즈 수 공식', 'Reynolds Number Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '원관 내부 유동에서 관성력(ρVD)을 점성력(μ)으로 나눈 값입니다. 동점성 계수 ν = μ/ρ를 쓰면 Re = VD/ν로도 쓸 수 있습니다.',
              'For internal pipe flow it is the inertia force (ρVD) divided by the viscous force (μ). Using kinematic viscosity ν = μ/ρ it can also be written Re = VD/ν.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Re = (ρ × V × D) / μ</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">Re</strong> — {L('레이놀즈 수 (무차원수)', 'Reynolds number (dimensionless)')}</li>
          <li><strong className="font-semibold text-green-600">ρ</strong> — {L('유체 밀도 [kg/m³ 또는 lb/ft³]', 'Fluid density [kg/m³ or lb/ft³]')}</li>
          <li><strong className="font-semibold text-yellow-600">V</strong> — {L('유속(평균속도) [m/s 또는 ft/s]', 'Flow velocity (mean) [m/s or ft/s]')}</li>
          <li><strong className="font-semibold text-red-600">D</strong> — {L('관 내경 [m 또는 ft]', 'Pipe inner diameter [m or ft]')}</li>
          <li><strong className="font-semibold text-purple-600">μ</strong> — {L('동점성 계수(점도) [Pa·s 또는 lb/(ft·s)]', 'Dynamic viscosity [Pa·s or lb/(ft·s)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('유속 V나 관경 D가 클수록, 밀도가 클수록 Re가 커져 난류가 되기 쉽습니다.', 'Higher velocity V, larger diameter D or higher density raise Re, favouring turbulence.')}</li>
            <li>{L('점도 μ가 클수록(기름, 차가운 액체) Re가 작아져 층류가 유지됩니다.', 'Higher viscosity μ (oils, cold liquids) lowers Re and keeps flow laminar.')}</li>
            <li>{L('Re는 관성 대 점성의 비이므로, 값이 작으면 점성이 지배하고 값이 크면 관성이 지배합니다.', 'As a ratio of inertia to viscosity, small Re means viscosity dominates, large Re means inertia dominates.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('유동 영역', 'Flow regimes')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>{L('층류 (Laminar): ', 'Laminar Flow: ')}</strong>{L('Re < 2300 — 매끄러운 층상 유동', 'Re < 2300 — smooth layered flow')}</li>
            <li><strong>{L('천이 (Transient): ', 'Transient Flow: ')}</strong>{L('2300 ≤ Re ≤ 4000 — 층류와 난류 사이 불안정 구간', '2300 ≤ Re ≤ 4000 — unstable region between laminar and turbulent')}</li>
            <li><strong>{L('난류 (Turbulent): ', 'Turbulent Flow: ')}</strong>{L('Re > 4000 — 와류 섞임이 지배적인 유동', 'Re > 4000 — flow dominated by turbulent eddies')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '20°C 물(ρ ≈ 998 kg/m³, μ ≈ 1.002×10⁻³ Pa·s)이 내경 D = 0.05 m 관을 V = 1 m/s로 흐를 때: Re = (998 × 1 × 0.05) / (1.002×10⁻³) ≈ 49,800으로 난류입니다. 같은 조건에서 V = 0.02 m/s라면 Re ≈ 996으로 층류가 됩니다.',
              'For 20 °C water (ρ ≈ 998 kg/m³, μ ≈ 1.002×10⁻³ Pa·s) in a D = 0.05 m pipe at V = 1 m/s: Re = (998 × 1 × 0.05) / (1.002×10⁻³) ≈ 49,800 — turbulent. At V = 0.02 m/s the same setup gives Re ≈ 996 — laminar.',
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
            <li>{L('압력 손실을 줄이려면 난류 영역에서 유속을 낮추는 것이 효과적입니다(마찰계수가 높음).', 'To cut pressure drop, lowering velocity in the turbulent region is effective (friction factor is high).')}</li>
            <li>{L('점도는 온도에 매우 민감하므로, 운전 온도의 물성을 쓰세요(특히 기름류).', 'Viscosity is very temperature-sensitive — use the operating-temperature properties, especially for oils.')}</li>
            <li>{L('비원형 관은 동가수반경(d_e = 4A/P)을 D 대신 쓰세요.', 'For non-circular ducts use the equivalent hydraulic diameter (d_e = 4A/P) in place of D.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('경계값(2300, 4000)은 매끄러운 원관 기준이며, 거칠기·입구·굴곡에 따라 달라집니다.', 'The 2300/4000 thresholds are for smooth straight pipes; roughness, inlet and bends shift them.')}</li>
            <li>{L('천이 구간에서는 유동이 불안정해 상관식의 오차가 큽니다.', 'In the transitional range flow is unstable and correlations are inaccurate.')}</li>
            <li>{L('이 식은 내부 관 유동 기준입니다. 외부 유동(물체 주위)은 특성길이 정의가 다릅니다.', 'This form is for internal pipe flow; external flow uses a different characteristic length.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '레이놀즈 수 계산기' : 'Reynolds Number Calculator')}
      description={t?.description || (ko ? '레이놀즈 수를 계산해 유동이 층류·천이·난류 중 어느 것인지 판별합니다.' : 'Calculate the Reynolds number to determine whether a fluid flow is laminar, transient, or turbulent.')}
      icon={<span>🌊</span>}
      visualizationComponent={<></>}
      resultComponent={<ReynoldsNumberCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
