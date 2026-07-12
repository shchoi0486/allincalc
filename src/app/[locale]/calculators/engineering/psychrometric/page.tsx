'use client';

import React from 'react';
import PsychrometricCalculator from '@/components/engineering-calculator/PsychrometricCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function PsychrometricPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.psychrometric;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '습공기선도(Psychrometric chart)는 공기와 수증기의 혼합물인 습공기의 열역학적 상태를 나타내는 도표입니다. 건구 온도와 상대습도만 알아도 절대습도, 엔탈피, 이슬점 등 공조 설계에 필요한 모든 성질을 구할 수 있습니다.',
            'The psychrometric chart describes the thermodynamic state of moist air — a mixture of air and water vapor. From just the dry-bulb temperature and relative humidity you can obtain every property needed for HVAC design: humidity ratio, enthalpy, dew point and more.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '건구 온도 T와 상대습도 RH, 그리고 대기압 P_atm으로부터 포화 수증기압 P_ws, 실제 수증기압 P_w, 절대습도 W, 비엔탈피 h를 계산합니다. 냉방·난방 부하와 가습·제습 설계의 기초입니다.',
              'From dry-bulb temperature T, relative humidity RH and atmospheric pressure P_atm it computes saturation vapor pressure P_ws, actual vapor pressure P_w, humidity ratio W and specific enthalpy h. It is the basis of cooling/heating load and humidification/dehumidification design.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('공조기의 냉방/가습 부하 산정', 'Estimating cooling and humidification loads for air handlers')}</li>
            <li>{L('이슬점 확인으로 결로(condensation) 위험 평가', 'Checking dew point to assess condensation risk')}</li>
            <li>{L('혼합 공기, 가열/냉각/가습 공정의 상태 변화 추적', 'Tracking state changes through mixing, heating, cooling and humidification processes')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('Magnus-Tetens 식 (수증기압)', 'Magnus-Tetens Formula (Vapor Pressure)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '온도 T(°C)에서의 포화 수증기압 P_ws를 구하는 실용 경험식입니다. 상대습도로 실제 수증기압 P_w를 얻습니다.',
              'A practical empirical relation for the saturation vapor pressure P_ws at temperature T (°C). The actual vapor pressure P_w follows from the relative humidity.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-blue-600">P_ws = 0.61078 × exp( 17.27·T / (T + 237.3) )</p>
            <p className="font-mono text-lg text-center text-blue-400">P_w = P_ws × (RH / 100)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('절대습도와 비엔탈피', 'Humidity Ratio & Enthalpy')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '절대습도 W는 건공기 1kg당 수증기 질량이며, 비엔탈피 h는 건공기 1kg당 총 열량(현열+잠열)입니다.',
              'Humidity ratio W is the mass of water vapor per kg of dry air; specific enthalpy h is the total heat (sensible + latent) per kg of dry air.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-green-600">W = 0.621945 × P_w / (P_atm − P_w)</p>
            <p className="font-mono text-lg text-center text-red-500">h = 1.006·T + W·(2501 + 1.86·T)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-gray-700">T</strong> — {L('건구 온도 [°C (°F)]', 'Dry bulb temperature [°C (°F)]')}</li>
          <li><strong className="font-semibold text-blue-600">P_ws</strong> — {L('포화 수증기압 [kPa]', 'Saturation vapor pressure [kPa]')}</li>
          <li><strong className="font-semibold text-blue-400">P_w</strong> — {L('실제 수증기압 [kPa]', 'Actual vapor pressure [kPa]')}</li>
          <li><strong className="font-semibold text-green-600">W</strong> — {L('절대습도 (건공기 1kg당 수증기 kg)', 'Humidity ratio (kg water vapor / kg dry air)')}</li>
          <li><strong className="font-semibold text-red-500">h</strong> — {L('비엔탈피 (건공기 1kg당 열량 kJ)', 'Specific enthalpy (kJ per kg dry air)')}</li>
          <li><strong className="font-semibold text-gray-600">P_atm</strong> — {L('대기압 (통상 101.325 kPa)', 'Atmospheric pressure (typically 101.325 kPa)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('온도가 높을수록 포화 수증기압이 지수적으로 커져 같은 RH에서도 수증기량이 늘어납니다.', 'Higher temperature raises saturation vapor pressure exponentially, so the same RH carries more moisture.')}</li>
            <li>{L('절대습도 W는 실제 수증기압 P_w에 비례하고 대기압과의 차이에 반비례합니다.', 'Humidity ratio W is proportional to actual vapor pressure P_w and inversely related to (P_atm − P_w).')}</li>
            <li>{L('비엔탈피에서 2501은 물의 증발 잠열(0°C 기준)로, 수증기량 W에 의한 잠열이 지배적입니다.', 'In enthalpy, 2501 is water\'s latent heat of vaporization (at 0°C); the W term (latent heat) usually dominates.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '25°C, RH 60%, 대기압 101.325 kPa인 경우: P_ws = 0.61078·exp(17.27×25/(25+237.3)) ≈ 3.17 kPa, P_w = 3.17×0.60 ≈ 1.90 kPa. W = 0.621945×1.90/(101.325−1.90) ≈ 0.0119 kg/kg. h = 1.006×25 + 0.0119×(2501+1.86×25) ≈ 25.2 + 30.1 ≈ 55.3 kJ/kg 가 됩니다.',
              'At 25°C, RH 60%, P_atm 101.325 kPa: P_ws = 0.61078·exp(17.27×25/(25+237.3)) ≈ 3.17 kPa, so P_w = 3.17×0.60 ≈ 1.90 kPa. W = 0.621945×1.90/(101.325−1.90) ≈ 0.0119 kg/kg. h = 1.006×25 + 0.0119×(2501+1.86×25) ≈ 25.2 + 30.1 ≈ 55.3 kJ/kg.',
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
            <li>{L('고도가 높으면 대기압이 낮아져 같은 조건에서 절대습도가 약간 커집니다. 고산 지역은 P_atm을 보정하세요.', 'At high altitude lower P_atm slightly raises humidity ratio for the same conditions — correct P_atm.')}</li>
            <li>{L('냉각 코일이 이슬점 아래로 내려가면 제습(응축)이 일어나므로 h는 W와 함께 감소합니다.', 'When a cooling coil drops below dew point, dehumidification (condensation) occurs and h falls together with W.')}</li>
            <li>{L('공기 혼합은 절대습도와 엔탈피의 질량 가중 평균으로 구할 수 있습니다.', 'Air mixing can be found as the mass-weighted average of humidity ratio and enthalpy.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Magnus-Tetens 식은 약 0~50°C 범위에서 높은 정확도를 가지며, 극한 온도에서는 오차가 커집니다.', 'The Magnus-Tetens relation is accurate roughly 0–50°C; error grows at extreme temperatures.')}</li>
            <li>{L('이 모델은 이상기체 근사이며, 고압(밀폐 용기) 상태에는 적합하지 않습니다.', 'This model uses the ideal-gas approximation and is unsuitable for high-pressure (enclosed) states.')}</li>
            <li>{L('염분·불순물이 포함된 공기나 플라즈마 상태는 고려하지 않습니다.', 'Air with salts/impurities or plasma states is not considered.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout 
      title={t?.title || "Psychrometric Calculator"}
      description={t?.description || "Calculate air properties and states."}
      icon={<span>☁️</span>}
      visualizationComponent={<></>}
      resultComponent={<PsychrometricCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
