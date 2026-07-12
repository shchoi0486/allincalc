'use client';

import React from 'react';
import PipeFrictionCalculator from '@/components/engineering-calculator/PipeFrictionCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function PipeFrictionPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.pipeFriction;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '배관 마찰 손실은 압력류(가득 찬 관) 안을 흐르는 유체가 관 벽면과의 마찰로 잃는 에너지를 수두 손실(head loss)로 나타낸 것입니다. 데르시-바이스바흐(Darcy-Weisbach) 방정식은 이를 구하는 가장 일반적이고 정확한 표현입니다.',
            'Pipe friction loss is the energy a fluid loses to wall friction while flowing full in a pressurized pipe, expressed as a head loss. The Darcy-Weisbach equation is the most general and accurate way to compute it.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '관 길이 L, 내경 D, 유속 v, 마찰 계수 f, 유체 밀도 ρ로부터 수두 손실 h_f와 압력 손실 ΔP를 계산합니다. 펌프 양정 선정과 배관 설계의 핵심 입력입니다.',
              'From pipe length L, inner diameter D, velocity v, friction factor f and fluid density ρ it computes the head loss h_f and the pressure loss ΔP. This is a key input for pump-head selection and pipe sizing.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('요구 유량을 보내기 위한 펌프 양정·동력을 결정', 'Determining the pump head and power needed to deliver the required flow')}</li>
            <li>{L('관경·유속 변경이 압력 강하에 미치는 영향 비교 (손실 ∝ v²)', 'Comparing how pipe diameter and velocity changes affect pressure drop (loss ∝ v²)')}</li>
            <li>{L('배관망 해석에서 각 구간의 압력 분배 계산', 'Computing pressure distribution along each segment in a pipe network')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('데르시-바이스바흐 방정식', 'Darcy-Weisbach Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '수두 손실은 마찰 계수 f, 길이-지름비 L/D, 그리고 속도 수두 v²/2g에 비례합니다. 압력 손실은 수두 손실에 유체의 단위중량(ρ·g)을 곱해 얻습니다.',
              'Head loss is proportional to the friction factor f, the length-to-diameter ratio L/D, and the velocity head v²/2g. Pressure loss is obtained by multiplying head loss by the fluid\'s specific weight (ρ·g).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">h_f = f × (L / D) × (v² / 2g)</p>
            <p className="font-mono text-lg text-center text-green-600">ΔP = h_f × ρ × g</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">h_f</strong> — {L('마찰 수두 손실 [m (ft)]', 'Friction head loss [m (ft)]')}</li>
          <li><strong className="font-semibold text-green-600">ΔP</strong> — {L('압력 손실 [Pa (psi)]', 'Pressure loss [Pa (psi)]')}</li>
          <li><strong className="font-semibold text-red-500">f</strong> — {L('데르시 마찰 계수 (무차원; 무디 선도에서 결정)', 'Darcy friction factor (dimensionless; from the Moody chart)')}</li>
          <li><strong className="font-semibold text-purple-600">L</strong> — {L('관 길이 [m (ft)]', 'Pipe length [m (ft)]')}</li>
          <li><strong className="font-semibold text-orange-600">D</strong> — {L('관 내경 [m (in)]', 'Inner diameter [m (in)]')}</li>
          <li><strong className="font-semibold text-yellow-600">v</strong> — {L('유속 [m/s (ft/s)]', 'Flow velocity [m/s (ft/s)]')}</li>
          <li><strong className="font-semibold text-gray-600">ρ, g</strong> — {L('유체 밀도 [kg/m³ (lb/ft³)]와 중력가속도 (9.81 m/s² 또는 32.174 ft/s²)', 'Fluid density [kg/m³ (lb/ft³)] and gravity (9.81 m/s² or 32.174 ft/s²)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('유속 v가 2배가 되면 손실은 4배(∝ v²)로 급증하므로 유속을 낮추는 것이 가장 효과적입니다.', 'Doubling velocity quadruples the loss (∝ v²) — lowering velocity is the most effective remedy.')}</li>
            <li>{L('관경 D가 커지면 L/D와 v²(=Q²/D⁴)이 모두 작아져 손실이 급격히 감소합니다.', 'A larger diameter D shrinks both L/D and v² (=Q²/D⁴), sharply reducing loss.')}</li>
            <li>{L('마찰 계수 f는 난류에서는 거칠기와 레이놀즈 수에, 층류에서는 f = 64/Re 에만 의존합니다.', 'In turbulent flow f depends on roughness and Reynolds number; in laminar flow f = 64/Re only.')}</li>
            <li>{L('단위계: 미국 단위에서는 D를 ft로, 압력은 h_f×ρ(단위중량)로 psi 변환(÷144)합니다.', 'Units: in US customary use D in ft and convert pressure via h_f×ρ (specific weight), dividing by 144 for psi.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '길이 100 m, 내경 0.1 m 관을 물(ρ = 1000 kg/m³)이 2 m/s로 흐르고, f = 0.02라고 하면 h_f = 0.02 × (100/0.1) × (2²/(2×9.81)) ≈ 4.08 m. 압력 손실 ΔP = 4.08 × 1000 × 9.81 ≈ 40 kPa 가 됩니다.',
              'For water (ρ = 1000 kg/m³) in a 100 m long, 0.1 m bore pipe at 2 m/s with f = 0.02: h_f = 0.02 × (100/0.1) × (2²/(2×9.81)) ≈ 4.08 m. The pressure loss ΔP = 4.08 × 1000 × 9.81 ≈ 40 kPa.',
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
            <li>{L('마찰 계수는 무디 선도(Moody chart) 또는 콜브룩-화이트 식으로 구하세요. 매끄러운 관 ≈ 0.015~0.02, 녹슨 강관 ≈ 0.03~0.05.', 'Get f from the Moody chart or Colebrook-White equation: smooth pipe ≈ 0.015–0.02, rusty steel ≈ 0.03–0.05.')}</li>
            <li>{L('경제적 유속(물 ≈ 1~3 m/s) 범위를 유지하면 펌프비와 운전비를 균형잡을 수 있습니다.', 'Keep velocity in the economic range (water ≈ 1–3 m/s) to balance capital and operating cost.')}</li>
            <li>{L('밸브·엘보우 등 국부 손실은 등가관길이로 환산해 L에 더하세요.', 'Convert valve/elbow minor losses to equivalent length and add to L.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산은 완전 발달된 층류·난류 정상 흐름에 기초하며, 입구 부근의 발달 구간은 제외합니다.', 'It assumes fully developed steady laminar/turbulent flow; entrance-development regions are excluded.')}</li>
            <li>{L('마찰 계수 f는 관 내부 상태(스케일·부식)에 따라 시간이 지나며 변합니다.', 'The friction factor f changes over time with internal scale and corrosion.')}</li>
            <li>{L('비압축성 유체(액체) 기준이며, 고속 기체의 밀도 변화는 별도 보정이 필요합니다.', 'It is for incompressible fluids (liquids); compressible-gas density change needs separate correction.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout 
      title={t?.title || "Pipe Friction Loss Calculator"}
      description={t?.description || "Calculate the head loss and pressure loss due to friction in a pipe."}
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<PipeFrictionCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
