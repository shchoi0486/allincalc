'use client';

import React from 'react';
import DuctFrictionCalculator from '@/components/engineering-calculator/DuctFrictionCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function DuctFrictionPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.ductFriction;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '공기 덕트 마찰 손실은 공조(HVAC) 덕트를 통해 공기가 흐를 때 벽면 마찰로 발생하는 단위 길이당 압력 강하입니다. 이 손실을 정확히 예측해야 팬(송풍기) 용량을 적정하게 선정하고, 각 취출구까지 요구 풍량을 균형 있게 공급할 수 있습니다.',
            'Air duct friction loss is the pressure drop per unit length caused by wall friction as air flows through an HVAC duct. Predicting it accurately is essential for sizing the fan correctly and for delivering the required airflow in balance to every outlet.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '직사각형 덕트의 폭과 높이로부터 원형 덕트와 동일한 마찰을 내는 상당 직경(De)을 먼저 구하고, ASHRAE 경험식을 이용해 100 ft당 마찰 손실(in.w.g.)을 계산합니다. 원형 덕트라면 그 지름을 그대로 De로 사용합니다.',
              'From the width and height of a rectangular duct it first computes the equivalent diameter (De) — the round-duct diameter that gives the same friction — and then uses the ASHRAE empirical formula to find the friction loss per 100 ft (in.w.g.). For a round duct, its diameter is used directly as De.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('덕트 크기 결정 및 팬 정압(외부 정압) 산정', 'Sizing ducts and estimating the fan external static pressure')}</li>
            <li>{L('등마찰법(equal-friction) 설계로 균형 잡힌 풍량 분배', 'Balancing airflow distribution using the equal-friction design method')}</li>
            <li>{L('소음·에너지 측면에서 적정 유속 범위 유지 확인', 'Checking that velocities stay within ranges acceptable for noise and energy')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('공기 덕트 마찰 손실 공식', 'Air Duct Friction Loss')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '먼저 직사각형 단면을 등가 원형 단면으로 환산한 뒤, 유속과 상당 직경으로 마찰 손실을 구합니다.',
              'The rectangular section is first converted to an equivalent round section, then friction loss is found from the velocity and equivalent diameter.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3 text-center">
            <div>
              <p className="font-mono text-xs text-muted-foreground mb-1">{L('상당 직경 (De)', 'Equivalent diameter (De)')}</p>
              <p className="font-mono text-lg text-blue-600">Dₑ = 1.3 × (W·H)^0.625 / (W+H)^0.25</p>
            </div>
            <div className="w-full border-t border-dashed my-1"></div>
            <div>
              <p className="font-mono text-xs text-muted-foreground mb-1">{L('ASHRAE 경험식 (in.w.g. / 100 ft 기준)', 'ASHRAE empirical formula (in.w.g. / 100 ft)')}</p>
              <p className="font-mono text-lg text-red-600">ΔP = 0.109136 × (V/1000)^1.9 / Dₑ^1.22</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">ΔP</strong> — {L('마찰 손실 [in.w.g. / 100 ft]', 'Friction loss [in.w.g. per 100 ft]')}</li>
          <li><strong className="font-semibold text-blue-600">Dₑ</strong> — {L('상당(수력) 직경 [in]', 'Equivalent (hydraulic) diameter [in]')}</li>
          <li><strong className="font-semibold text-green-600">V</strong> — {L('공기 유속 [ft/min]', 'Air velocity [ft/min]')}</li>
          <li><strong className="font-semibold text-purple-600">W, H</strong> — {L('덕트 폭과 높이 [in]', 'Duct width and height [in]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('마찰 손실은 유속 V의 약 1.9제곱에 비례합니다. 유속을 조금만 높여도 손실이 급증합니다.', 'Friction loss rises with roughly the 1.9 power of velocity V, so even a modest speed increase sharply raises the loss.')}</li>
            <li>{L('상당 직경 De가 클수록(덕트가 클수록) 손실이 감소합니다 (De^1.22에 반비례).', 'A larger equivalent diameter De (a bigger duct) reduces the loss (inversely with De^1.22).')}</li>
            <li>{L('같은 단면적이라도 정사각형에 가까울수록 De가 커져 마찰이 적고, 납작할수록 손실이 큽니다.', 'For the same area, a near-square duct has a larger De and less friction, while a flat duct has more loss.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '폭 W = 12 in, 높이 H = 12 in인 덕트의 상당 직경은 De = 1.3 × (144)^0.625 / (24)^0.25 ≈ 1.3 × 21.8 / 2.21 ≈ 12.8 in입니다. 유속 V = 1500 ft/min이면 ΔP = 0.109136 × (1.5)^1.9 / 12.8^1.22 ≈ 0.109136 × 2.14 / 21.9 ≈ 0.011 in.w.g. / 100 ft가 됩니다.',
              'For a duct with W = 12 in and H = 12 in, De = 1.3 × (144)^0.625 / (24)^0.25 ≈ 1.3 × 21.8 / 2.21 ≈ 12.8 in. At V = 1500 ft/min, ΔP = 0.109136 × (1.5)^1.9 / 12.8^1.22 ≈ 0.109136 × 2.14 / 21.9 ≈ 0.011 in.w.g. per 100 ft.',
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
            <li>{L('등마찰법에서는 보통 0.08~0.1 in.w.g./100 ft를 설계 기준으로 잡아 덕트 크기를 정합니다.', 'The equal-friction method typically targets 0.08–0.1 in.w.g./100 ft to size ducts.')}</li>
            <li>{L('주 덕트는 소음을 줄이려 유속을 낮게(예: 1000~1500 ft/min), 지관은 조금 높게 잡습니다.', 'Keep main-duct velocities low to limit noise (e.g. 1000–1500 ft/min) and allow slightly higher speeds in branches.')}</li>
            <li>{L('엘보·티·댐퍼 등 부속의 국부 손실은 별도로 상당 길이나 손실계수로 더해야 전체 정압을 얻습니다.', 'Add local losses from elbows, tees, and dampers separately (equivalent length or loss coefficients) to get total static pressure.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 경험식은 표준 공기(약 20°C, 대기압)와 매끄러운 아연도 강판 덕트를 가정합니다.', 'The empirical formula assumes standard air (~20°C, atmospheric) and smooth galvanized-steel duct.')}</li>
            <li>{L('플렉시블 덕트나 거친 내면은 조도가 커서 실제 손실이 훨씬 큽니다. 보정계수를 적용하세요.', 'Flexible or rough-lined ducts have much higher roughness and loss — apply a correction factor.')}</li>
            <li>{L('공기 밀도가 표준과 다르면(고온·고고도) 손실이 달라지므로 밀도 보정이 필요합니다.', 'If air density differs from standard (hot air, high altitude), a density correction is required.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '공기 덕트 마찰 계산기' : 'Air Duct Friction Calculator')}
      description={t?.description || (ko ? '직사각형 또는 원형 공기 덕트의 마찰 손실을 계산합니다.' : 'Calculate friction loss in rectangular or circular air ducts.')}
      icon={<span>💨</span>}
      visualizationComponent={<></>}
      resultComponent={<DuctFrictionCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
