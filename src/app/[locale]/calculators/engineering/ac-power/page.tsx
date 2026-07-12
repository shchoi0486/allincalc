'use client';

import React from 'react';
import AcPowerCalculator from '@/components/engineering-calculator/AcPowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function AcPowerPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.acPower;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '교류(AC) 전력 계산기는 전압과 전류가 정현파로 공급되는 교류 회로에서 유효 전력(Real Power), 무효 전력(Reactive Power), 피상 전력(Apparent Power) 및 역률(Power Factor)을 구합니다. 직류 회로와 달리, 교류 회로에서는 전압과 전류 사이에 위상차가 생기기 때문에 둘을 단순히 곱한 값이 실제로 일을 하는 전력이 되지 않습니다.',
            'The AC power calculator determines the real (active) power, reactive power, apparent power, and power factor of an alternating-current circuit supplied with sinusoidal voltage and current. Unlike a DC circuit, an AC circuit has a phase difference between voltage and current, so the simple product of the two is not the power that actually does useful work.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '입력한 전압(V), 전류(I), 위상각(θ)으로부터 세 가지 전력 성분과 역률을 계산합니다. 단상뿐만 아니라 3상 시스템(√3 인자 적용)도 다룹니다.',
              'From the supplied voltage (V), current (I) and phase angle (θ) it computes the three power components and the power factor, for both single-phase and three-phase (with the √3 factor) systems.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('케이블·차단기·변압기의 정격(피상 전력 기준) 선정 및 과부하 검토', 'Sizing cables, breakers and transformers (rated on apparent power) and checking for overload')}</li>
            <li>{L('역률 개선(PFC)이 필요한지 판단하여 무효 전력 보상 설비 설계', 'Deciding whether power-factor correction is needed and sizing reactive compensation')}</li>
            <li>{L('설비의 실제 에너지 소비(유효 전력)와 전기요금 절감 효과 추정', 'Estimating true energy consumption (real power) and possible billing savings')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('교류 전력 공식', 'AC Power Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '전압과 전류의 위상차 θ에 대해 피상 전력 S는 두 크기의 곱, 유효 전력 P는 위상차만큼의 일량, 무효 전력 Q는 에너지를 왕복시키는 성분입니다.',
              'With phase angle θ between voltage and current, apparent power S is the product of the magnitudes, real power P is the work-producing component, and reactive power Q is the oscillating (non-working) component.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-blue-600">S = V × I</p>
            <p className="font-mono text-lg text-green-600">P = S × cos(θ) = V × I × PF</p>
            <p className="font-mono text-lg text-red-500">Q = S × sin(θ)</p>
            <p className="font-mono text-lg text-purple-600">PF = cos(θ)</p>
          </div>
          <p className="text-sm text-muted-foreground mt-2 italic">{L('* 3상 시스템의 경우 피상 전력에 √3을 곱합니다: S = √3 × V_L × I_L', '* For 3-phase systems, multiply apparent power by √3: S = √3 × V_L × I_L')}</p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">S</strong> — {L('피상 전력 (Volt-Amperes, VA)', 'Apparent Power (Volt-Amperes, VA)')}</li>
          <li><strong className="font-semibold text-green-600">P</strong> — {L('유효(실) 전력 (Watts, W)', 'Real / Active Power (Watts, W)')}</li>
          <li><strong className="font-semibold text-red-500">Q</strong> — {L('무효 전력 (Volt-Amperes Reactive, VAR)', 'Reactive Power (Volt-Amperes Reactive, VAR)')}</li>
          <li><strong className="font-semibold text-purple-600">θ</strong> — {L('전압과 전류 사이의 위상각 (도 또는 rad)', 'Phase angle between voltage and current [° or rad]')}</li>
          <li><strong>V, I</strong> — {L('전압 [V] 및 전류 [A]', 'Voltage [V] and Current [A]')}</li>
          <li><strong className="font-semibold text-purple-600">PF</strong> — {L('역률 (−1 ~ 1, 보통 0 ~ 1)', 'Power Factor [−1 to 1, usually 0 to 1]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('역률 PF가 1에 가까울수록(θ→0) 유효 전력 P가 피상 전력 S에 가까워져 에너지를 효율적으로 사용합니다.', 'As power factor PF approaches 1 (θ → 0), real power P approaches apparent power S, meaning energy is used efficiently.')}</li>
            <li>{L('θ가 커지면 cos(θ)는 작아지고 무효 전력 Q = S·sin(θ)는 커져, 같은 유효 전력을 내기 위해 더 큰 전류가 필요합니다.', 'A larger θ lowers cos(θ) and raises reactive power Q = S·sin(θ), requiring a larger current to deliver the same real power.')}</li>
            <li>{L('3상 시스템은 상 간 위상차 120°를 이용하므로 선간 전압 기준으로 √3 인자가 붙습니다.', 'Three-phase systems exploit the 120° phase shift between phases, so the √3 factor appears when using line-to-line voltage.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '단상 회로에서 V = 230 V, I = 10 A, θ = 36.87°(cosθ = 0.8)라면 S = 2300 VA, P = 2300 × 0.8 = 1840 W, Q = 2300 × sin(36.87°) = 1380 VAR입니다. 역률이 0.8이므로 공급 전류의 20%는 무효 성분으로 소모됩니다.',
              'For a single-phase circuit with V = 230 V, I = 10 A and θ = 36.87° (cosθ = 0.8): S = 2300 VA, P = 2300 × 0.8 = 1840 W, and Q = 2300 × sin(36.87°) = 1380 VAR. The 0.8 power factor means 20% of the supplied current is the reactive component.',
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
            <li>{L('역률이 낮으면 같은 부하에 더 큰 전류가 흘러 배선 손실(I²R)과 전압 강하가 커집니다. 일반적으로 PF ≥ 0.9 권장.', 'A low power factor forces a larger current for the same load, increasing I²R wiring losses and voltage drop; PF ≥ 0.9 is usually recommended.')}</li>
            <li>{L('유도전동기·변압기·형광등 등은 지연(유도성) 부하로 무효 전력을 발생시키므로 평균 역률을 모니터링하세요.', 'Induction motors, transformers and fluorescent lamps are lagging (inductive) loads that generate reactive power, so monitor the average power factor.')}</li>
            <li>{L('축전기(커패시터)를 병렬로 연결하면 무효 전력을 보상해 역률을 올릴 수 있습니다.', 'Connecting capacitors in parallel compensates reactive power and raises the power factor.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산기는 이상적인 정현파와 선형 부하를 가정합니다. 비선형 부하(정류기 등)의 고조파는 별도로 다뤄야 합니다.', 'This calculator assumes ideal sinusoids and linear loads; harmonics from non-linear loads (rectifiers, etc.) must be treated separately.')}</li>
            <li>{L('위상각 θ를 모를 경우 전력계(Wattmeter)나 역률계로 직접 측정하는 것이 정확합니다.', 'If θ is unknown, measure it directly with a wattmeter or power-factor meter for accuracy.')}</li>
            <li>{L('3상 값은 선간 전압(V_L)과 선 전류(I_L) 기준이며, 선·중성선 전압을 쓰면 √3 인자가 달라집니다.', 'Three-phase values use line-to-line voltage (V_L) and line current (I_L); using phase voltage changes the √3 factor.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '교류 전력 계산기' : 'AC Power Calculator')}
      description={t?.description || (ko ? '교류 회로의 유효·무효·피상 전력과 역률을 계산합니다.' : 'Calculate Real, Reactive, and Apparent Power in AC circuits.')}
      icon={<span>🔌</span>}
      visualizationComponent={<></>}
      resultComponent={<AcPowerCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
