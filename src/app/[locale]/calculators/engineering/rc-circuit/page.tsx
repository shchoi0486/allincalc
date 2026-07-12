'use client';

import React from 'react';
import RcCircuitCalculator from '@/components/engineering-calculator/RcCircuitCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function RcCircuitPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.rcCircuit;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'RC 회로는 저항(R)과 축전기(C)로 이루어진 가장 기본적인 1차 동적 회로입니다. 전원을 켜거나 끌 때 전압과 전하가 순간적으로 변하지 않고 지수 함수적으로 천이하며, 이 거동은 필터·지연·적분·미분 회로의 토대가 됩니다.',
            'An RC circuit is the simplest first-order dynamic circuit, made of a resistor (R) and a capacitor (C). When the source is switched on or off, the voltage and charge do not change instantly but transition exponentially — the foundation of filters, delays and integrator/differentiator circuits.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '회로의 시정수(τ), 축전기의 최대 충전 전하량(Q), 그리고 시간 t에 따른 축전기 전압 V_c(t)를 계산합니다. 충전뿐만 아니라 방전 곡선도 시정수로 설명됩니다.',
              'It computes the circuit time constant (τ), the capacitor’s maximum charge (Q), and the capacitor voltage V_c(t) at time t. Both the charging and discharging curves are described by the time constant.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('RC 로우패스/하이패스 필터의 차단주파수(1/2πRC) 설계', 'Designing RC low-pass/high-pass filter cutoff frequencies (1/2πRC)')}</li>
            <li>{L('디지털 회로의 리셋 지연, 디바운싱, 타이밍 설정', 'Reset delays, debouncing and timing in digital circuits')}</li>
            <li>{L('ADC 입력의 샘플앤홀드 안정 시간 추정', 'Estimating settling time of sample-and-hold ADC inputs')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">
            {L('RC 회로 공식', 'RC Circuit Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '시정수 τ는 저항과 축전기의 곱이며, 회로가 안정된 값의 약 63.2%에 도달하는 데 걸리는 시간입니다. 충전 전압은 지수 포물선을 그리며 최종값 V에 점근합니다.',
              'The time constant τ is the product of resistance and capacitance and is the time to reach about 63.2% of the final value. The charging voltage follows an exponential curve asymptoting to the source voltage V.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">τ = R × C</p>
            <p className="font-mono text-lg text-center">Q = C × V</p>
            <p className="font-mono text-lg text-center">V_c(t) = V × (1 − e^(−t/τ))</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-yellow-600">τ</strong> — {L('시정수 [초, s]', 'Time constant [seconds, s]')}</li>
          <li><strong className="font-semibold text-blue-600">R</strong> — {L('저항 [옴, Ω]', 'Resistance [ohms, Ω]')}</li>
          <li><strong className="font-semibold text-green-600">C</strong> — {L('정전 용량(커패시턴스) [패럿, F]', 'Capacitance [farads, F]')}</li>
          <li><strong className="font-semibold text-purple-600">V</strong> — {L('공급 전압 [볼트, V]', 'Source voltage [volts, V]')}</li>
          <li><strong className="font-semibold text-purple-600">t</strong> — {L('경과 시간 [초, s]', 'Elapsed time [seconds, s]')}</li>
          <li><strong className="font-semibold text-purple-600">Q</strong> — {L('축전기 전하량 [쿨롱, C]', 'Capacitor charge [coulombs, C]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('저항 R이나 축전기 C가 클수록 시정수 τ가 커져 충전이 느려집니다.', 'A larger R or C gives a larger τ, so the capacitor charges more slowly.')}</li>
            <li>{L('V_c(t)는 매 τ마다 남은 차이의 약 63.2%를 메우며, 5τ 이후에는 약 99.3% 충전된 것으로 간주합니다.', 'Each τ closes ~63.2% of the remaining gap; after 5τ the capacitor is considered ~99.3% charged.')}</li>
            <li>{L('방전 시에는 V_c(t) = V₀·e^(−t/τ) 꼴로 감소합니다(지수 감쇠).', 'During discharge V_c(t) = V₀·e^(−t/τ), an exponential decay.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('차단주파수', 'Cutoff frequency')}</h4>
          <p className="text-sm">
            {L(
              'RC 필터의 −3 dB 차단주파수는 f_c = 1/(2πRC) = 1/(2πτ)입니다. τ가 클수록(저항·용량이 클수록) 통과 대역이 낮은 주파수로 좁아집니다.',
              'The −3 dB cutoff of an RC filter is f_c = 1/(2πRC) = 1/(2πτ). A larger τ shifts the passband to lower frequencies.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'R = 10 kΩ, C = 100 µF, V = 5 V인 회로에서 τ = 10×10³ × 100×10⁻⁶ = 1 s입니다. 충전 최대 전하량 Q = C·V = 100×10⁻⁶ × 5 = 500 µC. t = 1 s일 때 V_c = 5 × (1 − e⁻¹) ≈ 3.16 V가 됩니다(최종값의 약 63.2%).',
              'For R = 10 kΩ, C = 100 µF and V = 5 V, τ = 10×10³ × 100×10⁻⁶ = 1 s. Maximum charge Q = C·V = 100×10⁻⁶ × 5 = 500 µC. At t = 1 s, V_c = 5 × (1 − e⁻¹) ≈ 3.16 V — about 63.2% of the final value.',
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
            <li>{L('필요한 지연/안정 시간에서 τ를 정한 뒤, 사용 가능한 R·C 조합을 골라 누설전류와 부하 용량을 고려하세요.', 'Pick R and C from the required delay/settling time, then consider leakage current and load capacitance.')}</li>
            <li>{L('디지털 입력 바운스 제거에는 τ를 클럭 주기보다 충분히 길게 잡으세요.', 'For input debouncing, make τ long enough relative to the bounce duration.')}</li>
            <li>{L('축전기 등가직렬저항(ESR)이 크면 충전 곡선이 이상 지수에서 벗어납니다.', 'A large capacitor ESR makes the charge curve deviate from the ideal exponential.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 이상 저항·이상 축전기를 가정하며, 누설·ESR·인덕턴스를 무시합니다.', 'Assumes ideal R and C, ignoring leakage, ESR and inductance.')}</li>
            <li>{L('축전기를 전원에 바로 연결하면 순간 단락 전류가 흐르므로 통전 저항 등을 고려해야 합니다.', 'Connecting a capacitor directly to a source causes a large inrush current — consider series resistance.')}</li>
            <li>{L('고주파에서는 배선 인덕턴스와 기생 성분이 지배적이 되어 1차 모델이 부정확해집니다.', 'At high frequency, wiring inductance and parasitics dominate and the first-order model becomes inaccurate.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'RC 회로 계산기' : 'RC Circuit Calculator')}
      description={t?.description || (ko ? 'RC 회로의 시정수와 충전 특성을 계산합니다.' : 'Calculate RC circuit time constant and charging characteristics.')}
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={<RcCircuitCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
