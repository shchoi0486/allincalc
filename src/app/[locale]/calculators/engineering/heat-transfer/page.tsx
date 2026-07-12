'use client';

import React from 'react';
import HeatTransferCalculator from '@/components/engineering-calculator/HeatTransferCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function HeatTransferPage() {
  const { dict, locale, unitSystem } = useI18n();
  const t = dict?.common?.heatTransfer;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);
  const imperial = unitSystem === 'imperial';
  const kUnit = imperial ? 'BTU/(hr·ft·°F)' : 'W/(m·K)';
  const aUnit = imperial ? 'ft²' : 'm²';
  const dUnit = imperial ? 'in' : 'm';
  const qUnit = imperial ? 'BTU/hr' : 'W';
  const tUnit = imperial ? '°F' : '°C';

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '열전도(Heat Conduction)는 온도가 높은 쪽에서 낮은 쪽으로, 물질 내부의 분자 진동과 자유전자 이동을 통해 열에너지가 전달되는 현상입니다. 벽, 단열재, 창문, 파이프 벽처럼 정지한 고체를 통과하는 열의 흐름을 지배하는 기본 메커니즘입니다.',
            'Heat conduction is the transfer of thermal energy from a hotter region to a colder one through molecular vibration and free-electron motion inside a material. It is the fundamental mechanism governing heat flow through stationary solids such as walls, insulation, windows, and pipe walls.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 재료의 열전도율, 단면적, 두께, 양쪽 표면의 온도차를 이용해 평판을 통과하는 정상 상태 열전달률(Q)과 열유속(Q/A)을 구합니다.',
              'This calculator determines the steady-state heat transfer rate (Q) and the heat flux (Q/A) through a flat slab from the material\'s thermal conductivity, cross-sectional area, thickness, and the temperature difference across the two faces.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('건물 벽·지붕의 단열 성능 평가와 열손실(난방·냉방 부하) 산정', 'Evaluating insulation performance of walls/roofs and estimating heat loss (heating/cooling load)')}</li>
            <li>{L('단열재 두께나 재질 변경이 열손실에 미치는 영향 비교', 'Comparing how changes in insulation thickness or material affect heat loss')}</li>
            <li>{L('공정 장비·파이프의 표면 열손실 및 보온 설계', 'Designing insulation for process equipment and pipes to limit surface heat loss')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('푸리에 열전도 법칙', "Fourier's Law of Conduction")}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '1차원 정상 상태에서 평판을 통과하는 열전달률은 푸리에 법칙으로 주어집니다. 온도차와 단면적, 열전도율에 비례하고 두께에 반비례합니다.',
              'For one-dimensional steady-state conduction through a flat slab, the heat transfer rate is given by Fourier\'s law. It is proportional to the temperature difference, area, and conductivity, and inversely proportional to thickness.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">Q = (k · A · ΔT) / d</p>
            <p className="font-mono text-base text-center text-muted-foreground">q = Q / A</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">Q</strong> — {L(`열전달률 [${qUnit}]`, `Heat transfer rate [${qUnit}]`)}</li>
          <li><strong className="font-semibold text-orange-600">q</strong> — {L(`열유속 (단위 면적당 열전달률) [${imperial ? 'BTU/(hr·ft²)' : 'W/m²'}]`, `Heat flux (rate per unit area) [${imperial ? 'BTU/(hr·ft²)' : 'W/m²'}]`)}</li>
          <li><strong className="font-semibold text-green-600">k</strong> — {L(`재료의 열전도율 [${kUnit}]`, `Thermal conductivity of the material [${kUnit}]`)}</li>
          <li><strong className="font-semibold text-blue-600">A</strong> — {L(`열이 통과하는 단면적 [${aUnit}]`, `Cross-sectional area for heat flow [${aUnit}]`)}</li>
          <li><strong className="font-semibold text-purple-600">d</strong> — {L(`재료의 두께 [${dUnit}]`, `Material thickness [${dUnit}]`)}</li>
          <li><strong className="font-semibold text-yellow-600">ΔT</strong> — {L(`양쪽 표면의 온도차 [${tUnit}]`, `Temperature difference across the faces [${tUnit}]`)}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('온도차 ΔT가 클수록, 면적 A가 넓을수록 열전달률 Q가 커집니다.', 'A larger temperature difference ΔT or a larger area A increases the heat transfer rate Q.')}</li>
            <li>{L('두께 d가 두꺼울수록 열이 지나갈 거리가 길어져 Q가 작아집니다 → 단열 효과.', 'A thicker material d lengthens the heat path and lowers Q — the insulating effect.')}</li>
            <li>{L('열전도율 k가 작은 재료(단열재)일수록 같은 조건에서 열손실이 적습니다.', 'A material with lower conductivity k (an insulator) loses less heat under the same conditions.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '유리섬유 단열재(k ≈ 0.04 W/(m·K))로 된 두께 0.15 m, 면적 10 m²의 벽에서 양쪽 온도차가 20 °C(=20 K)라면, Q = (0.04 × 10 × 20) / 0.15 ≈ 53.3 W. 열유속은 53.3 / 10 ≈ 5.3 W/m²입니다.',
              'For a fiberglass-insulated wall (k ≈ 0.04 W/(m·K)) that is 0.15 m thick and 10 m² in area with a 20 °C (= 20 K) difference across it, Q = (0.04 × 10 × 20) / 0.15 ≈ 53.3 W. The heat flux is 53.3 / 10 ≈ 5.3 W/m².',
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
            <li>{L('여러 층으로 이뤄진 벽은 각 층의 열저항 R = d/(k·A)를 더해서 전체 열저항을 구한 뒤 Q = ΔT / R_total로 계산합니다.', 'For multilayer walls, sum each layer\'s thermal resistance R = d/(k·A) and then compute Q = ΔT / R_total.')}</li>
            <li>{L('온도 단위는 섭씨든 절대온도든 온도차(ΔT)는 동일하므로, 차이 값을 그대로 사용해도 됩니다.', 'The temperature difference ΔT is the same whether in Celsius or Kelvin, so you can use the difference directly.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 정상 상태(온도가 시간에 따라 변하지 않음)와 1차원 열전도만 다룹니다. 과도 상태에는 적용되지 않습니다.', 'This formula covers only steady-state (time-invariant temperatures) and 1-D conduction; it does not apply to transient situations.')}</li>
            <li>{L('실제 표면에는 대류·복사 열저항과 접촉 열저항이 더해지므로, 순수 전도만으로 계산하면 열손실을 과대평가할 수 있습니다.', 'Real surfaces also involve convective/radiative and contact resistances, so a pure-conduction estimate can overpredict heat loss.')}</li>
            <li>{L('열전도율 k는 온도에 따라 변할 수 있으므로 사용 온도 범위의 값을 쓰세요.', 'Thermal conductivity k can vary with temperature, so use the value appropriate for the operating range.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('열전도 계산기', 'Heat Conduction Calculator')}
      description={t?.description || L('재료를 통과하는 열전달률을 계산합니다.', 'Calculate the rate of heat transfer through a material.')}
      icon={<span>🌡️</span>}
      visualizationComponent={<></>}
      resultComponent={<HeatTransferCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
