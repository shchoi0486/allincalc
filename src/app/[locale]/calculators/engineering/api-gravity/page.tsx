'use client';

import React from 'react';
import ApiGravityCalculator from '@/components/engineering-calculator/ApiGravityCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function ApiGravityPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.apiGravity;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'API 비중(API Gravity) 계산기는 석유 및 석유 제품의 상대 밀도를 표현하는 API ° 단위와 비중(Specific Gravity, SG) 및 밀도 사이의 변환을 수행합니다. API 비중은 물보다 가벼울수록(비중이 1보다 작을수록) 값이 커지는 역비례 척도로, 원유의 등급과 거래, 정제 공정 설계에 널리 쓰입니다.',
            'The API gravity calculator converts between the petroleum industry\'s API-degree scale, specific gravity (SG) and density of crude and refined petroleum liquids. API gravity is an inverse scale — the lighter the liquid (SG below 1), the higher the API number — and is used for grading, trading and refinery design.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '비중(SG, 60°F 기준)을 입력하면 API 비중을, API 비중을 입력하면 비중과 밀도를 구합니다. 또한 경질·중질·초중질 원유 분류를 표시합니다.',
              'Enter specific gravity (SG at 60°F) to get API gravity, or enter API gravity to obtain SG and density, with classification into light/medium/heavy/extra-heavy crude.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('원유 등급 판정 및 가격(경질일수록 프리미엄) 산정', 'Grading crude oil and pricing it (lighter crudes command a premium)')}</li>
            <li>{L('정제 수율 추정, 탱크·배관 물량(부피→질량) 환산', 'Estimating refinery yield and converting tank/pipe volumes to mass')}</li>
            <li>{L('해상 운송·저장 시 부력/침강(물보다 가벼운지 무거운지) 판단', 'Assessing buoyancy/sink behaviour for marine transport and storage')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('API 비중 공식', 'API Gravity Equations')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'API 비중은 60°F(15.6°C)에서의 비중(SG)을 기준으로 정의되며, 물의 비중을 1.0으로 둔 역수 척도입니다.',
              'API gravity is defined relative to specific gravity at 60°F (15.6°C), an inverted scale with water fixed at SG = 1.0.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col space-y-4">
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('1. API 비중 (°API)', '1. API Gravity (°API)')}</p>
              <p className="font-mono text-lg text-blue-600">°API = (141.5 / SG) − 131.5</p>
            </div>
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('2. 비중 (SG, 60°F 기준)', '2. Specific Gravity (SG at 60°F)')}</p>
              <p className="font-mono text-lg text-teal-600">SG = 141.5 / (°API + 131.5)</p>
            </div>
          </div>
          <p className="text-sm mt-2">
            {L(
              '밀도 환산: ρ = SG × 999.0 kg/m³ (또는 SG × 62.4 lb/ft³). 여기서 999.0 kg/m³은 60°F 근방 물의 밀도입니다.',
              'Density conversion: ρ = SG × 999.0 kg/m³ (or SG × 62.4 lb/ft³), where 999.0 kg/m³ is the density of water near 60°F.',
            )}
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-orange-600">°API</strong> — {L('API 비중 (단위 없는 척도, 물 ≈ 10°API)', 'API gravity (dimensionless scale, water ≈ 10°API)')}</li>
          <li><strong className="font-semibold text-teal-600">SG</strong> — {L('비중 = 액체 밀도 / 물 밀도 (60°F 기준, 무차원)', 'Specific gravity = liquid density / water density (at 60°F, dimensionless)')}</li>
          <li><strong>ρ</strong> — {L('액체 밀도 [kg/m³ 또는 lb/ft³]', 'Liquid density [kg/m³ or lb/ft³]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('원유 분류 (기준)', 'Crude oil classification')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong className="font-semibold text-orange-600">Light Crude</strong> — {L('> 31.1 °API (물보다 가벼움)', '> 31.1 °API (lighter than water)')}</li>
            <li><strong className="font-semibold text-orange-700">Medium Crude</strong> — {L('22.3 ~ 31.1 °API', '22.3 ~ 31.1 °API')}</li>
            <li><strong className="font-semibold text-orange-800">Heavy Crude</strong> — {L('10 ~ 22.3 °API', '10 ~ 22.3 °API')}</li>
            <li><strong className="font-semibold text-orange-900">Extra Heavy</strong> — {L('< 10 °API (물보다 무거워 가라앉음, 비투멘)', '< 10 °API (sinks in water, e.g. bitumen)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('비중 SG가 1.0(물)일 때 °API = 10이 되며, SG가 작아질수록(가벼울수록) °API는 급격히 커집니다.', 'At SG = 1.0 (water) °API = 10; as SG decreases (lighter liquid) °API rises sharply.')}</li>
            <li>{L('°API = 10을 기준으로 그보다 크면 물보다 가볍고, 작으면 물보다 무겁습니다.', 'API 10 is the water reference: above it the liquid floats on water, below it sinks.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'SG = 0.85인 원유의 API 비중은 °API = 141.5 / 0.85 − 131.5 ≈ 35.0°API로 경질 원유에 해당하며, 밀도는 0.85 × 999.0 ≈ 849 kg/m³입니다.',
              'For crude with SG = 0.85: °API = 141.5 / 0.85 − 131.5 ≈ 35.0°API, a light crude, with density 0.85 × 999.0 ≈ 849 kg/m³.',
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
            <li>{L('비중은 반드시 60°F(15.6°C) 기준으로 보정된 값(SG₆₀/₆₀)을 써야 API 비중 공식이 성립합니다. 온도가 다르면 보정 테이블(ASTM-IP)을 사용하세요.', 'Use SG corrected to 60°F (SG₆₀/₆₀); for other temperatures apply ASTM-IP correction tables.')}</li>
            <li>{L('경질 원유는 휘발성분이 많아 가벼운 제품(휘발유·등유) 수율이 높고, 중질 원유는 잔유·아스팔트 비중이 큽니다.', 'Light crudes yield more gasoline/kerosene; heavy crudes give more residue/asphalt.')}</li>
            <li>{L('부피(배럴) 거래 시 질량 환산에 밀도를 꼭 적용하세요.', 'When trading by volume (barrels), always convert to mass using density.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 척도는 석유류 전용이며, 일반적인 밀도→비중 변환과 혼동하지 마세요(일반 비중은 4°C 물 기준일 수 있음).', 'This scale is petroleum-specific; do not confuse it with a generic density-to-SG conversion (which may reference 4°C water).')}</li>
            <li>{L('혼합유의 비중은 부피 가산성이 아니므로(부피 수축) 혼합 비율로 단순 환산하면 오차가 생깁니다.', 'Blended liquids are not volume-additive (volume shrinkage), so simple ratio conversion introduces error.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'API 비중 계산기' : 'API Gravity Calculator')}
      description={t?.description || (ko ? 'API 비중과 비중(SG) 및 밀도를 상호 변환합니다.' : 'Convert between API Gravity and Specific Gravity.')}
      icon={<span>🛢️</span>}
      visualizationComponent={<></>}
      resultComponent={<ApiGravityCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
