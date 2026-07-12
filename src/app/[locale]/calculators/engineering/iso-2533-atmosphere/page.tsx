'use client';

import React from 'react';
import Iso2533AtmosphereCalculator from '@/components/engineering-calculator/Iso2533AtmosphereCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function Iso2533AtmospherePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.iso2533Atmosphere;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'ISO 2533 표준 대기(Standard Atmosphere)는 고도에 따른 대기의 온도, 압력, 밀도를 규정한 국제 참조 모델입니다. 실제 대기는 날씨에 따라 끊임없이 변하기 때문에, 항공기 성능·계기 보정·공학 계산을 위해 합의된 “평균 대기”가 필요하며 이 표준이 그 기준을 제공합니다.',
            'The ISO 2533 Standard Atmosphere is an internationally agreed reference model that defines how air temperature, pressure, and density vary with altitude. Because the real atmosphere constantly changes with weather, aviation performance, instrument calibration, and engineering calculations rely on a consistent "average atmosphere," which this standard provides.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 지정한 고도에서의 온도(T), 압력(P), 밀도(ρ), 음속(a)을 표준 대기 모델로 계산합니다.',
              'This calculator computes the temperature (T), pressure (P), density (ρ), and speed of sound (a) at a specified altitude using the standard atmosphere model.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('항공기 양력·항력·엔진 성능 계산의 기준 대기 조건 제공', 'Providing reference atmospheric conditions for aircraft lift, drag, and engine performance')}</li>
            <li>{L('고도계·대기속도계 등 항공 계기의 보정 기준', 'Serving as the calibration basis for altimeters and airspeed indicators')}</li>
            <li>{L('마하수 산정을 위한 고도별 음속 계산', 'Computing the altitude-dependent speed of sound for Mach number estimates')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('ISO 2533 표준 대기 방정식', 'ISO 2533 Standard Atmosphere Equations')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '대류권(해수면부터 11 km 또는 36,089 ft까지)에서는 온도가 고도에 따라 선형으로 감소합니다. 압력은 정수압 평형과 이 온도 분포로부터 유도되며, 밀도와 음속은 이상기체 관계로 구합니다.',
              'In the troposphere (from sea level up to 11 km or 36,089 ft), temperature decreases linearly with altitude. Pressure is derived from hydrostatic equilibrium combined with this temperature profile, while density and speed of sound follow from the ideal-gas relations.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <p className="font-mono text-base text-center">T = T₀ + (L · h)</p>
            <p className="font-mono text-base text-center">P = P₀ · [1 + (L · h / T₀)] ^ (−g / (R · L))</p>
            <p className="font-mono text-base text-center">ρ = P / (R · T)</p>
            <p className="font-mono text-base text-center">a = √(γ · R · T)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">T, P, ρ, a</strong> — {L('해당 고도의 온도 [K], 압력 [Pa], 밀도 [kg/m³], 음속 [m/s]', 'Temperature [K], pressure [Pa], density [kg/m³], and speed of sound [m/s] at altitude')}</li>
          <li><strong className="font-semibold text-teal-600">h</strong> — {L('고도 [m]', 'Altitude [m]')}</li>
          <li><strong className="font-semibold text-green-600">T₀, P₀</strong> — {L('해수면 표준 온도(288.15 K)와 압력(101,325 Pa)', 'Sea-level standard temperature (288.15 K) and pressure (101,325 Pa)')}</li>
          <li><strong className="font-semibold text-purple-600">L</strong> — {L('온도 감률 (−0.0065 K/m)', 'Temperature lapse rate (−0.0065 K/m)')}</li>
          <li><strong className="font-semibold text-orange-600">R</strong> — {L('공기의 기체 상수 (287.05 J/(kg·K))', 'Specific gas constant for air (287.05 J/(kg·K))')}</li>
          <li><strong className="font-semibold text-red-600">γ</strong> — {L('공기의 비열비 (1.4)', 'Heat capacity ratio for air (1.4)')}</li>
          <li><strong className="font-semibold text-yellow-600">g</strong> — {L('중력 가속도 (9.80665 m/s²)', 'Acceleration of gravity (9.80665 m/s²)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('감률 L이 음수이므로 고도가 높아질수록 온도 T가 선형으로 낮아집니다.', 'Because the lapse rate L is negative, temperature T falls linearly as altitude increases.')}</li>
            <li>{L('압력 P는 지수적으로 감소하며, 지수 −g/(R·L)이 대기의 감소 속도를 결정합니다.', 'Pressure P decreases exponentially, with the exponent −g/(R·L) governing how fast it drops.')}</li>
            <li>{L('온도가 낮아지면 음속 a = √(γ·R·T)도 작아집니다 → 고고도에서는 같은 속도라도 마하수가 커집니다.', 'As temperature falls, the speed of sound a = √(γ·R·T) also decreases, so the same true airspeed gives a higher Mach number at altitude.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '고도 5,000 m에서 T = 288.15 + (−0.0065 × 5000) = 255.65 K (약 −17.5 °C). 압력은 P = 101325 × [1 + (−0.0065 × 5000 / 288.15)]^(−9.80665/(287.05×−0.0065)) ≈ 54,000 Pa, 음속은 a = √(1.4 × 287.05 × 255.65) ≈ 320 m/s가 됩니다.',
              'At 5,000 m, T = 288.15 + (−0.0065 × 5000) = 255.65 K (about −17.5 °C). Pressure is P = 101325 × [1 + (−0.0065 × 5000 / 288.15)]^(−9.80665/(287.05×−0.0065)) ≈ 54,000 Pa, and the speed of sound is a = √(1.4 × 287.05 × 255.65) ≈ 320 m/s.',
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
            <li>{L('밀도가 낮아지면 양력과 엔진 출력이 줄어듭니다. 고고도 이착륙 성능 검토에 밀도 값을 활용하세요.', 'Lower density reduces lift and engine power — use the density value when assessing high-altitude takeoff/landing performance.')}</li>
            <li>{L('마하수는 M = V / a로 구합니다. 고도별 음속 a를 알면 진대기속도로부터 바로 계산됩니다.', 'Mach number is M = V / a; with the altitude speed of sound a, it follows directly from true airspeed.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 선형 감률 식은 대류권(11 km 이하)에서만 유효합니다. 성층권에서는 온도가 일정하거나 증가하므로 다른 식을 써야 합니다.', 'The linear-lapse formula is valid only in the troposphere (below 11 km); the stratosphere requires different relations as temperature becomes constant or rises.')}</li>
            <li>{L('표준 대기는 이상화된 평균값입니다. 실제 기상(기온, 습도, 기압)은 이 값과 크게 다를 수 있습니다.', 'The standard atmosphere is an idealized average; real weather (temperature, humidity, pressure) can differ substantially.')}</li>
            <li>{L('습도의 영향은 무시하며, 건조 공기를 가정합니다.', 'Humidity effects are neglected — dry air is assumed.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('ISO 2533 표준 대기', 'ISO 2533 Standard Atmosphere')}
      description={t?.description || L('ISO 2533 표준 모델로 고도별 대기 물성을 계산합니다.', 'Calculate atmospheric properties at various altitudes based on the ISO 2533 standard model.')}
      icon={<span>☁️</span>}
      visualizationComponent={<></>}
      resultComponent={<Iso2533AtmosphereCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
