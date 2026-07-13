'use client';

import React from 'react';
import DewPoint from '@/components/engineering-calculator/DewPoint';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict?.calculatorNames;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '이슬점(Dew Point)은 공기 중의 수증기가 포화되어 결로가 발생하는 온도입니다. 이 계산기는 건구 온도와 상대 습도를 입력받아 이슬점, 습구 온도(wet bulb), 절대 습도(absolute humidity)를 계산합니다.',
            'The dew point is the temperature at which water vapor in air becomes saturated and condensation occurs. This calculator takes dry-bulb temperature and relative humidity as inputs and computes dew point, wet-bulb temperature, and absolute humidity.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '건구 온도와 상대 습도로부터 Magnus 공식을 사용하여 이슬점 온도를 계산합니다. 추가로 습구 온도, 포화 수증기압, 실제 수증기압, 절대 습도(혼합비)를 제공합니다.',
              'Using the Magnus formula, it calculates the dew point temperature from dry-bulb temperature and relative humidity. Additionally, wet-bulb temperature, saturation vapor pressure, actual vapor pressure, and absolute humidity (mixing ratio) are provided.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('결로 방지: 이슬점 이하로 온도가 내려가면 표면에 결로가 발생하여 부식· 곰팡이를 유발합니다', 'Condensation prevention: temperatures below dew point cause surface condensation, leading to corrosion and mold')}</li>
            <li>{L('실내 쾌적성: 사람의 쾌적 조건은 이슬점에 크게 의존합니다(권장 이슬점: 10~15°C)', 'Indoor comfort: human comfort depends heavily on dew point (recommended: 10–15°C)')}</li>
            <li>{L('공조 설계: 냉방 부하 계산, 제습기 용량 결정에 이슬점이 핵심 파라미터입니다', 'HVAC design: dew point is a key parameter for cooling load calculation and dehumidifier sizing')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('Magnus 공식 (이슬점 계산)', 'Magnus Formula (Dew Point)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'Magnus 공식은 이슬점 계산에 널리 사용되는 경험적 공식으로, −40°C~50°C 범위에서 높은 정확도를 제공합니다.',
              'The Magnus formula is a widely used empirical formula for dew point calculation, providing high accuracy in the range of −40°C to 50°C.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">
              T<sub>d</sub> = (b × α(T, RH)) / (a − α(T, RH))
            </p>
            <p className="font-mono text-lg text-center text-purple-600">
              α(T, RH) = (a × T) / (b + T) + ln(RH/100)
            </p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">T<sub>d</sub></strong> — {L('이슬점 온도 [°C]', 'Dew point temperature [°C]')}</li>
          <li><strong className="font-semibold text-red-500">T</strong> — {L('건구 온도 [°C]', 'Dry-bulb temperature [°C]')}</li>
          <li><strong className="font-semibold text-blue-600">RH</strong> — {L('상대 습도 [%]', 'Relative humidity [%]')}</li>
          <li><strong className="font-semibold text-orange-600">a, b</strong> — {L('상수 (a = 17.27, b = 237.7 °C)', 'Constants (a = 17.27, b = 237.7 °C)')}</li>
          <li><strong className="font-semibold text-purple-600">ln</strong> — {L('자연 로그 (natural logarithm)', 'Natural logarithm')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('포화 수증기압 공식', 'Saturation vapor pressure formula')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">
              e<sub>s</sub>(T) = 6.1078 × exp(17.27 × T / (237.7 + T))
            </p>
          </div>
          <p className="text-sm mt-2">
            {L(
              '단위는 hPa(mbar)이며, 실제 수증기압 e = e_s × RH/100입니다.',
              'Unit is hPa (mbar); actual vapor pressure e = e_s × RH/100.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('습구 온도 근사 (Stull)', 'Wet-bulb temperature approximation (Stull)')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">
              T<sub>w</sub> ≈ T × arctan(0.151977 × √(RH + 8.313659))
            </p>
            <p className="font-mono text-lg text-center text-purple-600">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ arctan(T + RH) − arctan(RH − 1.676331)
            </p>
            <p className="font-mono text-lg text-center text-purple-600">
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;+ 0.00391838 × RH^(3/2) × arctan(0.023101 × RH) − 4.686035
            </p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이슬점이 15°C 이하면 쾌적, 20°C 이상이면 불쾌감이 커집니다', 'Dew point below 15°C is comfortable; above 20°C causes significant discomfort')}</li>
            <li>{L('결로 방지를 위해서는 표면 온도를 이슬점 이상으로 유지하는 것이 핵심입니다', 'Keeping surface temperature above the dew point is key to preventing condensation')}</li>
            <li>{L('HVAC 설계에서 냉방 coils의 출구 온도는 목표 이슬점 이하로 설정해야 합니다', 'In HVAC design, cooling coil outlet temperature must be set below the target dew point')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Magnus 공식은 순수 공기-수증기 혼합물 기준이며, 고농도 오염물질이 있는 경우 오차가 발생합니다', 'The Magnus formula is for pure air-water vapor mixtures; errors occur with high-concentration pollutants')}</li>
            <li>{L('대기압이 표준 대기압(1013.25 hPa)에서 크게 벗어지면 압력 보정이 필요합니다', 'Pressure correction is needed when atmospheric pressure deviates significantly from standard (1013.25 hPa)')}</li>
            <li>{L('습구 온도 근사 공식은 ±0.3°C 이내의 정확도이며, 정밀 측정에는 psychrometric chart를 사용하는 것이 좋습니다', 'Wet-bulb approximation is within ±0.3°C; use psychrometric charts for precise measurements')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['dew-point'] || (ko ? '이슬점 계산기' : 'Dew Point Calculator')}
      description={t?.['dew-point'] || (ko ? '이슬점, 습구 온도 및 절대 습도를 계산합니다' : 'Calculate dew point, wet bulb, absolute humidity')}
      icon={<span>🌡️</span>}
      visualizationComponent={<></>}
      resultComponent={<DewPoint />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
