'use client';

import React from 'react';
import SpringRateCalculator from '@/components/engineering-calculator/SpringRateCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function SpringRatePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.springRate;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '스프링 상수(Spring Rate, k)는 코일 스프링이 얼마나 "단단한지"를 나타내는 값으로, 작용 하중 1N당 발생하는 변위(m)입니다. 헬리컬 압축 스프링은 기계의 완충, 복원, 하중 지지, 진동 절연 등에 쓰이며 그 거동은 재질의 전단 탄성 계수와 치수로 정해집니다.',
            'The spring rate (k) expresses how "stiff" a coil spring is — the deflection (in m) produced per newton of applied load. Helical compression springs are used for cushioning, return force, load support and vibration isolation, and their behavior is set by the material shear modulus and the coil geometry.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '와이어 지름 d, 평균 코일 지름 D, 유효 권수 n, 그리고 재질의 전단 탄성 계수 G를 입력하면 스프링 상수 k를 계산합니다. 이로써 설계 하중에 대한 변위나 필요 강성을 미리 예측할 수 있습니다.',
              'Given the wire diameter d, mean coil diameter D, number of active coils n and the material shear modulus G, the calculator returns the spring rate k, letting you predict deflection under a design load or the stiffness you need.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('밸브 스프링, 서스펜션, 클러치 등 기계 부품의 강성 설계', 'Sizing stiffness for valve springs, suspensions, clutches and other machine parts')}</li>
            <li>{L('목표 하중-변위 선도(force-deflection)得到满足하기 위한 권수·지름 결정', 'Choosing coil count and diameters to meet a target force–deflection curve')}</li>
            <li>{L('피로 수명과 응력 산정의 전단계 입력', 'Feeding the pre-step input for stress and fatigue-life calculations')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-gray-500 pl-3">
            {L('스프링 상수 공식 (원형 와이어 헬리컬 스프링)', 'Spring Rate Formula (round-wire helical spring)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '위어(굽힘) 보정이 없는 기본식으로, 선형 탄성 범위에서 성립합니다. 원형 단면 와이어에 대한 표준 해석식입니다.',
              'This is the standard closed-form relation for a round-wire spring in the linear elastic range, without curvature (Wahl) correction.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">k = (G × d⁴) / (8 × D³ × n)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-gray-700">k</strong> — {L('스프링 상수 [N/m 또는 lb/in]', 'Spring rate [N/m or lb/in]')}</li>
          <li><strong className="font-semibold text-blue-600">G</strong> — {L('전단 탄성 계수(Shear Modulus) [Pa 또는 psi]', 'Shear modulus [Pa or psi]')}</li>
          <li><strong className="font-semibold text-green-600">d</strong> — {L('와이어(소선) 지름 [m 또는 in]', 'Wire diameter [m or in]')}</li>
          <li><strong className="font-semibold text-red-600">D</strong> — {L('평균 코일 지름(유효경) [m 또는 in]', 'Mean coil diameter [m or in]')}</li>
          <li><strong className="font-semibold text-purple-600">n</strong> — {L('유효 권수(active coils)', 'Number of active coils')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('와이어 지름 d에 4제곱으로 비례 → d를 조금만 키워도 강성이 급격히 커집니다.', 'k scales with d⁴, so a small increase in wire diameter sharply raises stiffness.')}</li>
            <li>{L('평균 지름 D에 3제곱의 역비례 → 코일을 크게 감을수록 스프링은 유연해집니다.', 'k is inversely proportional to D³, so a larger coil diameter makes the spring more flexible.')}</li>
            <li>{L('유효 권수 n이 많을수록 강성이 낮아집니다(역비례).', 'More active coils n lower the stiffness (inverse proportionality).')}</li>
            <li>{L('전단 탄성 계수 G가 클수록(강철 > 구리) 강성이 커집니다.', 'A larger shear modulus G (steel > copper) gives a stiffer spring.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '강철 스프링(G ≈ 79.3×10⁹ Pa), 와이어 지름 d = 2 mm, 평균 지름 D = 20 mm, 유효 권수 n = 10인 경우: d⁴ = 1.6×10⁻¹¹, D³ = 8×10⁻⁶, k = 79.3×10⁹ × 1.6×10⁻¹¹ / (8 × 8×10⁻⁶ × 10) ≈ 1980 N/m (≈ 11.3 lb/in)가 됩니다.',
              'For a steel spring (G ≈ 79.3×10⁹ Pa) with wire diameter d = 2 mm, mean diameter D = 20 mm and n = 10 active coils: with d⁴ = 1.6×10⁻¹¹ and D³ = 8×10⁻⁶, k = 79.3×10⁹ × 1.6×10⁻¹¹ / (8 × 8×10⁻⁶ × 10) ≈ 1980 N/m (≈ 11.3 lb/in).',
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
            <li>{L('강성을 크게 바꾸려면 지름 D보다 와이어 지름 d 조정이 훨씬 효과적입니다.', 'To change stiffness a lot, adjusting wire diameter d is far more effective than changing D.')}</li>
            <li>{L('유효 권수는 양끝 고정 형태에 따라 달라지므로, 전체 권수에서 지지 권수를 뺀 값을 쓰세요.', 'Active coils differ by end-fixing style; subtract the inactive (dead) coils from the total.')}</li>
            <li>{L('정밀 설계에서는 Wahl 보정계수로 곡률·전단 응력 집중을 반영하세요.', 'For precision design, apply the Wahl correction factor to account for curvature and stress concentration.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('본 식은 선형 탄성 범위(항복 이전)에서만 정확하며, 영구 변형이 생기면 무효입니다.', 'The formula is valid only in the linear elastic range, before yielding; permanent set invalidates it.')}</li>
            <li>{L('스프링 지수(D/d)가 매우 작거나 크면 응력 집중으로 실제 거동과 차이가 납니다.', 'Very small or very large spring index (D/d) introduces stress concentration not captured here.')}</li>
            <li>{L('온도가 오르면 G가 낮아져 강성도 함께 감소합니다.', 'Rising temperature lowers G and therefore the stiffness as well.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '스프링 상수 계산기' : 'Spring Rate Calculator')}
      description={t?.description || (ko ? '헬리컬 압축 스프링의 스프링 상수(강성)를 계산합니다.' : 'Calculate the spring constant (rate) of a helical compression spring.')}
      icon={<span>⚙️</span>}
      visualizationComponent={<></>}
      resultComponent={<SpringRateCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
