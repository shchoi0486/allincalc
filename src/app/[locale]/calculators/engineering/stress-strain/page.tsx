'use client';

import React from 'react';
import StressStrainCalculator from '@/components/engineering-calculator/StressStrainCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function StressStrainPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.stressStrain;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '응력(Stress)과 변형률(Strain)은 재료역학의 가장 기본이 되는 두 양입니다. 응력은 단면적당 작용하는 내부 힘이고, 변형률은 원래 길이에 대한 늘어난 정도입니다. 이 둘의 비인 영률(Young\'s Modulus, E)은 재료 자체의 강성(stiffness)을 나타내는 고유 물성치입니다.',
            'Stress and strain are the two most fundamental quantities in mechanics of materials. Stress is the internal force per unit area, while strain is the fractional elongation relative to the original length. Their ratio, Young\'s modulus (E), is an intrinsic property describing the material\'s stiffness.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '축 방향 하중 F, 단면적 A, 원래 길이 L₀, 길이 변화 ΔL을 입력하면 인장 응력 σ, 변형률 ε, 그리고 영률 E를 계산합니다. 재료의 탄성 거동을 정량화하는 데 쓰입니다.',
              'Enter the axial load F, cross-sectional area A, original length L₀ and change in length ΔL to obtain the tensile stress σ, strain ε and Young\'s modulus E — quantifying the elastic behavior of the material.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('구조 부품의 안전율과 항복 여부 판정', 'Assessing safety factor and yield condition of structural parts')}</li>
            <li>{L('처짐(변위) 예측 및 강성 설계', 'Predicting deflection and designing for stiffness')}</li>
            <li>{L('재료 선정 시 강성·탄성 비교', 'Comparing stiffness and elasticity when selecting materials')}</li>
            <li>{L('응력-변형률 선도 해석의 기초 입력', 'Base input for interpreting stress–strain diagrams')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('응력·변형률·영률 공식', 'Stress, Strain & Young\'s Modulus')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '선형 탄성 범위(훅의 법칙)에서 응력은 변형률에 비례하며, 그 비례 상수가 영률 E입니다.',
              'Within the linear elastic range (Hooke\'s law), stress is proportional to strain, and the proportionality constant is Young\'s modulus E.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-lg">σ = F / A</p>
            <p className="text-center font-mono text-lg">ε = ΔL / L₀</p>
            <p className="text-center font-mono text-lg">E = σ / ε = (F · L₀) / (A · ΔL)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">F</strong> — {L('작용 하중(인장/압축) [N 또는 lbf]', 'Applied axial force [N or lbf]')}</li>
          <li><strong className="font-semibold text-green-600">A</strong> — {L('단면적 [m² 또는 in²]', 'Cross-sectional area [m² or in²]')}</li>
          <li><strong className="font-semibold text-purple-600">L₀</strong> — {L('원래 길이 [m 또는 in]', 'Original length [m or in]')}</li>
          <li><strong className="font-semibold text-red-600">ΔL</strong> — {L('길이 변화량 [m 또는 in]', 'Change in length [m or in]')}</li>
          <li><strong className="font-semibold text-yellow-600">σ, ε, E</strong> — {L('각각 응력 [Pa], 변형률 [무차원], 영률 [Pa]', 'Stress [Pa], strain [dimensionless], Young\'s modulus [Pa]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('하중 F가 클수록 응력 σ가 커지고, 단면적 A가 클수록 응력은 작아집니다.', 'Larger F raises stress σ; larger area A lowers it.')}</li>
            <li>{L('변형률 ε은 길이 변화 ΔL에 비례하고 원래 길이 L₀에 반비례합니다.', 'Strain ε is proportional to ΔL and inversely proportional to L₀.')}</li>
            <li>{L('영률 E가 클수록 같은 하중에 덜 늘어나는 "단단한" 재료입니다(강철 > 알루미늄 > 고무).', 'A larger E means a "stiffer" material that stretches less under the same load (steel > aluminum > rubber).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '지름 10 mm 원형 봉(A ≈ 78.5 mm² = 7.85×10⁻⁵ m²), 원래 길이 1 m에 10 kN(1×10⁴ N)을 인장해 0.5 mm 늘어났다고 하면: σ = 1×10⁴ / 7.85×10⁻⁵ ≈ 127 MPa, ε = 0.5×10⁻³ / 1 = 5×10⁻⁴, E ≈ 127×10⁶ / 5×10⁻⁴ ≈ 254 GPa로 강철과 비슷한 값이 나옵니다.',
              'For a 10 mm diameter rod (A ≈ 78.5 mm² = 7.85×10⁻⁵ m²) and original length 1 m, a 10 kN (1×10⁴ N) tensile load causing 0.5 mm elongation gives: σ = 1×10⁴ / 7.85×10⁻⁵ ≈ 127 MPa, ε = 0.5×10⁻³ / 1 = 5×10⁻⁴, and E ≈ 127×10⁶ / 5×10⁻⁴ ≈ 254 GPa — close to steel.',
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
            <li>{L('응력은 "공칭(engineering) 응력" F/A로 구하며, 네킹 이후에는 진응력(true stress)과 구분합니다.', 'Use nominal (engineering) stress F/A; beyond necking, distinguish true stress.')}</li>
            <li>{L('단면적이 일정하지 않으면 최소 단면(A_min)에서 최대 응력이 발생하므로 이 곳을 기준으로 하세요.', 'If area varies, the maximum stress occurs at the minimum section A_min — design against that.')}</li>
            <li>{L('온도 상승 시 대부분 재료의 E는 약간 감소합니다.', 'E generally decreases slightly as temperature rises.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 탄성 한도 내에서만 성립하며, 항복점을 넘으면 영률로 설명되지 않는 소성 변형이 생깁니다.', 'Valid only within the elastic limit; beyond yield, plastic deformation not described by E occurs.')}</li>
            <li>{L('좌굴·전단·비틀림 등 다른 변형 모드는 이 축방향 공식으로 다루지 않습니다.', 'Buckling, shear and torsion are different deformation modes not covered here.')}</li>
            <li>{L('복합 응력 상태(다축)에서는 단순 비례가 깨지므로 항복 이론을 함께 적용해야 합니다.', 'Under multiaxial stress the simple proportionality breaks; apply a yield criterion.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '응력·변형률 계산기' : 'Stress & Strain Calculator')}
      description={t?.description || (ko ? '축 하중을 받는 재료의 응력, 변형률, 영률을 계산합니다.' : 'Calculate stress, strain, and Young\'s modulus of a material under axial load.')}
      icon={<span>🏗️</span>}
      visualizationComponent={<></>}
      resultComponent={<StressStrainCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
