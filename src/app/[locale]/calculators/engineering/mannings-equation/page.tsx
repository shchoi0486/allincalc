'use client';

import React from 'react';
import ManningsEquationCalculator from '@/components/engineering-calculator/ManningsEquationCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function ManningsEquationPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.manningsEquation;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '매닝의 방정식(Manning\'s equation)은 개수로(open channel)에서 중력에 의해 흐르는 액체의 평균 유속과 유량을 구하는 가장 널리 쓰이는 경험식입니다. 하천, 운하, 배수로, 우수 관거, 정사각·직사각형·원형 단면의 자유수면 흐름 해석에 표준적으로 적용됩니다.',
            'Manning\'s equation is the most widely used empirical relation for finding the average velocity and discharge of a liquid flowing by gravity in an open channel. It is the standard tool for analyzing rivers, canals, drainage ditches, storm sewers, and free-surface flow in rectangular, trapezoidal or circular cross-sections.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '주어진 수로 형상(단면적, 젖음 둘레), 조도 계수 n, 그리고 수로 바닥(또는 수면)의 경사 S로부터 평균 유속 V[m/s(ft/s)]와 총 유량 Q[m³/s(ft³/s)]를 계산합니다. 반대로 목표 유량을 내기 위한 단면 크기나 경사를 역산하는 데에도 쓰입니다.',
              'From the channel geometry (area and wetted perimeter), the roughness coefficient n, and the bed (or water-surface) slope S, it computes the average velocity V [m/s (ft/s)] and the total discharge Q [m³/s (ft³/s)]. It is also used in reverse to size a channel or pick a slope for a target flow.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('홍수 시 하천·배수로가 넘치지 않는지 통수 능력 검토', 'Checking that rivers and storm drains can carry design flood flows without overtopping')}</li>
            <li>{L('우수 관거 및 농업 용수로의 적정 관경·단면 설계', 'Sizing sewer pipes and irrigation channels to the right diameter or cross-section')}</li>
            <li>{L('호안 재료(콘크리트, 석축, 식생)에 따른 조도 변화가 유속에 미치는 영향 비교', 'Comparing how lining material (concrete, stone, vegetation) changes velocity through roughness')}</li>
            <li>{L('침사·퇴적을 막기 위한 최소 유속(소류력) 확보 확인', 'Confirming a minimum velocity (scour/self-cleansing) to avoid sediment deposition')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('매닝의 방정식', 'Manning\'s Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '균일 흐름(uniform flow)을 가정할 때, 평균 유속은 단면의 경심 R의 2/3승과 경사 S의 1/2승에 비례하고 조도 계수 n에 반비례합니다. 완전 발달된 난류 영역에서 도출된 경험식입니다.',
              'For uniform flow, the average velocity is proportional to the hydraulic radius R raised to the 2/3 power and the slope S to the 1/2 power, and inversely proportional to the roughness coefficient n. It is an empirical relation valid in the fully-developed turbulent regime.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">V = (k / n) × R^(2/3) × S^(1/2)</p>
            <p className="font-mono text-lg text-center text-green-600">Q = V × A</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">V</strong> — {L('단면 평균 유속 [m/s (ft/s)]', 'Cross-sectional average velocity [m/s (ft/s)]')}</li>
          <li><strong className="font-semibold text-green-600">Q</strong> — {L('유량(Discharge) [m³/s (ft³/s)]', 'Discharge / flow rate [m³/s (ft³/s)]')}</li>
          <li><strong className="font-semibold text-purple-600">k</strong> — {L('단위 변환 계수 (SI는 1.0, 미국 단위는 1.486)', 'Conversion factor (1.0 for SI, 1.486 for US customary)')}</li>
          <li><strong className="font-semibold text-red-500">n</strong> — {L('매닝 조도 계수 (단위 없음, 0.01~0.04 범위)', 'Manning roughness coefficient (dimensionless, typically 0.01–0.04)')}</li>
          <li><strong className="font-semibold text-orange-600">R</strong> — {L('경심(단면적/젖음둘레, A/P) [m (ft)]', 'Hydraulic radius (A/P) [m (ft)]')}</li>
          <li><strong className="font-semibold text-gray-600">S</strong> — {L('수면 또는 수로 바닥의 경사 (m/m 또는 ft/ft)', 'Slope of water surface or channel bed (m/m or ft/ft)')}</li>
          <li><strong className="font-semibold text-gray-600">A</strong> — {L('흐르는 단면적(통수 단면적) [m² (ft²)]', 'Flow (wetted) cross-sectional area [m² (ft²)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('조도 계수 n이 클수록(거친 벽면) 유속은 느려집니다 — n에 반비례.', 'A larger roughness n (rougher walls) slows the flow — velocity is inversely proportional to n.')}</li>
            <li>{L('경심 R이 클수록 벽면 마찰의 영향이 작아져 유속이 빨라집니다 — R^(2/3)에 비례.', 'A larger hydraulic radius R reduces wall-friction influence, increasing velocity — proportional to R^(2/3).')}</li>
            <li>{L('경사 S가 가파를수록 구동력(중력 분력)이 커져 유속이 빨라집니다 — √S에 비례.', 'A steeper slope S increases the gravity driving force, speeding flow — proportional to √S.')}</li>
            <li>{L('원형 관의 경우 만관(가득 참)일 때보다 반 정도 찬 부분 만수위에서 경심이 최대가 되어 유속이 가장 빠릅니다.', 'For circular pipes, the hydraulic radius peaks at roughly half-full, so velocity is highest at partial fill, not at full bore.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '폭 2 m, 수심 1 m인 직사각형 수로를 생각합니다. 단면적 A = 2 m², 젖음 둘레 P = 2 + 1 + 1 = 4 m 이므로 경심 R = A/P = 0.5 m 입니다. 콘크리트 호안의 조도 n = 0.013, 경사 S = 0.001(0.1%)라면 SI 계수 k = 1.0을 써서 V = (1/0.013) × 0.5^(2/3) × 0.001^(1/2) ≈ 0.85 m/s, 유량 Q = V × A ≈ 1.70 m³/s 가 됩니다.',
              'Consider a rectangular channel 2 m wide with 1 m depth. Area A = 2 m², wetted perimeter P = 2 + 1 + 1 = 4 m, so hydraulic radius R = A/P = 0.5 m. With a concrete lining roughness n = 0.013 and slope S = 0.001 (0.1%), using SI factor k = 1.0: V = (1/0.013) × 0.5^(2/3) × 0.001^(1/2) ≈ 0.85 m/s, giving Q = V × A ≈ 1.70 m³/s.',
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
            <li>{L('조도 계수 n은 벽면 상태에 따라 크게 변합니다: 매끄러운 콘크리트 ≈ 0.012, 식생 하천 ≈ 0.03~0.04. 보수적으로 잡으세요.', 'Roughness n varies strongly with wall condition: smooth concrete ≈ 0.012, vegetated stream ≈ 0.03–0.04. Be conservative.')}</li>
            <li>{L('경사 S는 수면 경사와 바닥 경사가 같다는 균일 흐름 가정에서 성립합니다. 급변하는 단면에서는 근사값이 됩니다.', 'Slope S assumes uniform flow where water-surface and bed slopes are equal; it is only approximate where the section changes rapidly.')}</li>
            <li>{L('미국 단위(ft)를 쓸 때는 반드시 k = 1.486을 적용해야 단위가 맞습니다.', 'When using US customary units (ft), you must use k = 1.486 for dimensional consistency.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('균일·완전 발달 난류 흐름에만 엄밀히 적용됩니다. 급확대·급축소·곡선부 근처의 비균일 흐름에는 부정확합니다.', 'Strictly valid only for uniform, fully-developed turbulent flow; inaccurate near sudden expansions, contractions or bends.')}</li>
            <li>{L('매닝 식은 관수로(압력류)가 아닌 자유수면 흐름용입니다. 압력 관로는 데르시-바이스바흐식을 쓰세요.', 'Manning is for free-surface flow, not pressurized pipe flow — use Darcy-Weisbach for pressurized pipes.')}</li>
            <li>{L('매우 낮은 유속에서는 층류 보정이 필요하고, 동결·퇴적물 영향은 반영되지 않습니다.', 'At very low velocities a laminar correction is needed, and ice or sediment effects are not captured.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout 
      title={t?.title || "Manning's Equation Calculator"}
      description={t?.description || "Calculate open channel flow using Manning's formula."}
      icon={<span>🌊</span>}
      visualizationComponent={<></>}
      resultComponent={<ManningsEquationCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
