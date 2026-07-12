'use client';

import React from 'react';
import UValueCalculator from '@/components/engineering-calculator/UValueCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function UValuePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.uValue;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '열관류율(U-Value)은 벽·지붕·바닥 등 건축 외피나 열교환기 벽을 통해 단위 면적·단위 온도차당 전달되는 열량입니다. 값이 작을수록 단열 성능이 우수합니다. 총 열저항 R_t의 역수로 정의됩니다.',
            'The U-value (thermal transmittance) is the heat transferred per unit area per unit temperature difference through an envelope such as a wall, roof or floor, or a heat-exchanger wall. A smaller value means better insulation. It is defined as the reciprocal of the total thermal resistance R_t.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '각 층의 두께 d와 열전도율 k, 그리고 안팎 대류 열전달 계수 h_i, h_o를 입력하면 다층 벽의 총 열저항 R_t와 열관류율 U를 계산합니다.',
              'Enter each layer\'s thickness d and thermal conductivity k, plus the interior/exterior convective coefficients h_i and h_o, to compute the multi-layer wall\'s total resistance R_t and U-value.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('건물 에너지 효율·단열 설계 및 법규(U값) 적합성', 'Building energy efficiency, insulation design and code (U-value) compliance')}</li>
            <li>{L('냉난방 부하 및 에너지 비용 산정', 'Heating/cooling load and energy-cost estimation')}</li>
            <li>{L('열교환기 벽면 전열 설계', 'Heat-exchanger wall heat-transfer design')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('열관류율 및 열저항', 'U-Value & Thermal Resistance')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '각 층의 전도 열저항(d/k)이 직렬로 더해지고, 양면의 대류 저항(1/h)이 추가됩니다. 전체 저항의 역수가 U값입니다.',
              'Each layer\'s conductive resistance (d/k) adds in series, and the two convective resistances (1/h) are added at the surfaces. The reciprocal of the total resistance is the U-value.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-lg text-blue-600">R_t = 1/h_i + (d₁/k₁) + (d₂/k₂) + ... + 1/h_o</p>
            <p className="text-center font-mono text-lg text-red-500">U = 1 / R_t</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">R_t</strong> — {L('총 열저항 [m²·K/W 또는 h·ft²·°F/Btu]', 'Total thermal resistance [m²·K/W or h·ft²·°F/Btu]')}</li>
          <li><strong className="font-semibold text-red-500">U</strong> — {L('열관류율 [W/(m²·K) 또는 Btu/(h·ft²·°F)]', 'Thermal transmittance / U-value [W/(m²·K) or Btu/(h·ft²·°F)]')}</li>
          <li><strong className="font-semibold text-purple-600">h</strong> — {L('대류 열전달 계수 [W/(m²·K)]', 'Convective heat transfer coefficient [W/(m²·K)]')}</li>
          <li><strong className="font-semibold text-green-600">k</strong> — {L('재질 열전도율 [W/(m·K)]', 'Thermal conductivity of material [W/(m·K)]')}</li>
          <li><strong className="font-semibold text-orange-600">d</strong> — {L('재질 두께 [m]', 'Material thickness [m]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('열전도율 k가 작을수록(단열재), 두께 d가 클수록 해당 층 저항이 커져 U는 작아집니다.', 'Smaller k (insulation) and larger d raise that layer\'s resistance, lowering U.')}</li>
            <li>{L('대류 계수 h가 크면(강제 송풍) 표면 저항 1/h가 작아져 전체 U에 덜 영향을 줍니다.', 'A larger h (forced convection) lowers the surface resistance 1/h, reducing its influence on U.')}</li>
            <li>{L('U는 R_t의 역수이므로, 저항을 아무리 크게해도 U는 0에만 가까워지지 0이 되지는 않습니다.', 'Since U = 1/R_t, increasing resistance only approaches U = 0, never reaching it.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '콘크리트 100 mm(k=1.7), 단열재 50 mm(k=0.04), h_i=8, h_o=20 W/(m²·K)인 벽이면: R_t = 1/8 + 0.1/1.7 + 0.05/0.04 + 1/20 ≈ 0.125 + 0.059 + 1.25 + 0.05 = 1.484 m²·K/W, 따라서 U ≈ 0.67 W/(m²·K)입니다.',
              'For a wall with 100 mm concrete (k=1.7), 50 mm insulation (k=0.04), h_i=8, h_o=20 W/(m²·K): R_t = 1/8 + 0.1/1.7 + 0.05/0.04 + 1/20 ≈ 0.125 + 0.059 + 1.25 + 0.05 = 1.484 m²·K/W, so U ≈ 0.67 W/(m²·K).',
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
            <li>{L('단열 성능을 크게 높이려면 가장 작은 k를 가진 층의 두께를 늘리세요(수익이 큼).', 'To boost insulation most, thicken the layer with the smallest k (best payoff).')}</li>
            <li>{L('실제 시공에서는 열교(bridge)와 공기층·표면 오염을 고려해 설계값보다 약간 높게 잡으세요.', 'Real construction has thermal bridges and air gaps — expect slightly higher U than design.')}</li>
            <li>{L('정지 공기층은 복사·대류를 포함한 등가 저항으로 다루세요.', 'Treat a still air gap by its combined radiative/convective equivalent resistance.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('본 모델은 1차원 정상상태 전도를 가정하며, 습기·풍속·복사 변화에는 보정이 필요합니다.', 'This model assumes 1-D steady conduction; moisture, wind and radiation variations need correction.')}</li>
            <li>{L('h 값은 표면 상태·유체 속도에 따라 크게 달라지므로 신뢰할 수 있는 값을 쓰세요.', 'h depends strongly on surface condition and fluid velocity — use reliable values.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '열관류율(U-Value) 계산기' : 'Thermal Transmittance (U-Value) Calculator')}
      description={t?.description || (ko ? '다층 벽의 열관류율과 열저항을 계산합니다.' : 'Calculate U-Value and thermal resistance.')}
      icon={<span>🧱</span>}
      visualizationComponent={<></>}
      resultComponent={<UValueCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
