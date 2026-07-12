'use client';

import React from 'react';
import NPSHCalculator from '@/components/engineering-calculator/NPSHCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function NPSHCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict.npshCalculator;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'NPSH(Net Positive Suction Head, 순흡입수두)는 펌프 흡입구에서 유체가 캐비테이션(cavitation) 없이 안정적으로 흡입될 수 있는 압력 수두의 여유분을 나타내는 핵심 지표입니다. 펌프 설계·선정 시 누락할 수 없는 항목입니다.',
            'NPSH (Net Positive Suction Head) is the margin of pressure head available at the pump suction that lets the fluid be drawn in stably without cavitation. It is an essential quantity in pump design and selection.',
          )}
        </p>
        <p>
          {L(
            '캐비테이션이란 유체의 압력이 국소적으로 증기압 이하로 떨어질 때 기포가 생성되고, 다시 압력이 회복되며 기포가 붕괴하면서 임펠러와 케이싱에 충격과 침식을 일으키는 현상입니다. 효율 급락, 소음·진동, 그리고 영구적인 손상을 유발합니다.',
            'Cavitation is the formation of vapor bubbles where local fluid pressure falls below the vapor pressure, followed by their violent collapse as pressure recovers — producing shock, erosion, noise and vibration on the impeller and casing, and a sharp drop in efficiency.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '시스템이 제공하는 NPSHa(가용 순흡입수두, Available)를 계산하고, 펌프 데이터시트의 NPSHr(필요 순흡입수두, Required)과 비교하여 캐비테이션 안전 여부를 평가합니다. 탱크 위치(펌프 위/아래), 개방/밀폐 탱크, 유체 종류, 온도, 거리, 마찰 손실을 모두 반영합니다.',
              'It computes NPSHa (Net Positive Suction Head Available) provided by the system and compares it with the pump datasheet value NPSHr (Required) to judge cavitation safety. It accounts for tank position (above/below pump), open/closed tank, fluid, temperature, suction distance and friction loss.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('펌프 고장·수명 단축의 주원인인 캐비테이션을 사전에 방지', 'Preventing cavitation, the leading cause of pump failure and shortened life')}</li>
            <li>{L('흡입 배관布置와 탱크 높이를 결정할 때 안전 마진 확보', 'Securing a safety margin when laying out the suction piping and setting tank elevation')}</li>
            <li>{L('고온 유체·휘발성 유체(물, 에탄올, 벤젠 등)에서의 증기압 영향을 정량 평가', 'Quantifying vapor-pressure effects for hot or volatile fluids (water, ethanol, benzene, etc.)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('NPSHa (가용 순흡입수두)', 'NPSHa (Net Positive Suction Head Available)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '대기압(또는 탱크 표면압) 헤드에서 증기압 헤드를 뺀 압력 여유에, 펌프 대비 액면 높이에 따른 위치 수두 Z와 배관 마찰 손실 수두 Hl을 더하거나 빼서 구합니다. 액면이 펌프보다 위(above)이면 +Z, 아래(below)이면 −Z입니다.',
              'Start from the pressure head of atmospheric (or tank surface) pressure minus the vapor-pressure head, then add the position head Z from the liquid level relative to the pump and subtract the piping friction-loss head Hl. Z is positive when the liquid is above the pump and negative when below.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">NPSHa = (P_surf − P_vap) / (ρ·g) ± Z − H_l</p>
            <p className="font-mono text-sm text-muted-foreground">Z: + above pump, − below pump</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">P_surf</strong> — {L('탱크 표면의 절대 압력 (대기개방 시 대기압) [Pa (psi, psf)]', 'Absolute pressure at the tank surface (atmospheric if open) [Pa (psi, psf)]')}</li>
          <li><strong className="font-semibold text-purple-600">P_vap</strong> — {L('유체의 증기압 (온도에 따라 결정) [Pa (psi, psf)]', 'Fluid vapor pressure (set by temperature) [Pa (psi, psf)]')}</li>
          <li><strong className="font-semibold text-red-600">ρ</strong> — {L('액체 밀도 [kg/m³ (lb/ft³)]', 'Liquid density [kg/m³ (lb/ft³)]')}</li>
          <li><strong className="font-semibold text-orange-600">g</strong> — {L('중력 가속도 (9.81 m/s² 또는 32.174 ft/s²)', 'Gravitational acceleration (9.81 m/s² or 32.174 ft/s²)')}</li>
          <li><strong className="font-semibold text-green-600">Z</strong> — {L('펌프 대비 액면 높이(위치 수두) [m (ft)]', 'Liquid-level elevation relative to pump (position head) [m (ft)]')}</li>
          <li><strong className="font-semibold text-yellow-600">H_l</strong> — {L('흡입 측 마찰·국부 손실 수두 [m (ft)]', 'Suction-side friction and minor loss head [m (ft)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('표면 압력이 높을수록, 증기압이 낮을수록(온도가 낮을수록) NPSHa는 커집니다.', 'Higher surface pressure and lower vapor pressure (lower temperature) increase NPSHa.')}</li>
            <li>{L('액면이 펌프보다 위에 있으면 +Z로 더해지고, 아래 있으면 −Z로 빼져 NPSHa가 줄어듭니다.', 'A liquid level above the pump adds +Z; below the pump subtracts −Z and reduces NPSHa.')}</li>
            <li>{L('흡입 배관이 길수록, 굴곡·밸브가 많을수록 H_l이 커져 NPSHa가 감소합니다.', 'Longer suction piping and more bends/valves raise H_l and lower NPSHa.')}</li>
            <li>{L('안전 판정: NPSHa ≥ NPSHr(권장 1.3배 이상)이면 캐비테이션 안전.', 'Safety rule: NPSHa ≥ NPSHr (ideally ≥ 1.3×) means cavitation-safe.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '20°C 물(ρ ≈ 998 kg/m³, P_vap ≈ 2.34 kPa)을 대기압(101.3 kPa) 개방 탱크에서 펌프보다 2 m 위에 두고, 흡입 마찰 손실 1.5 m인 경우: (101.3−2.34)kPa / (998×9.81) ≈ 10.1 m 의 압력 헤드에 +2 m(위치) − 1.5 m(마찰)을 더해 NPSHa ≈ 10.6 m 가 됩니다.',
              'For 20°C water (ρ ≈ 998 kg/m³, P_vap ≈ 2.34 kPa) in an open tank at atmospheric pressure (101.3 kPa), 2 m above the pump, with 1.5 m suction friction loss: pressure head (101.3−2.34)kPa / (998×9.81) ≈ 10.1 m, plus +2 m (position) minus 1.5 m (friction) gives NPSHa ≈ 10.6 m.',
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
            <li>{L('흡입 양정(펌프보다 아래 위치)을 최소화하세요 — 펌프를 유체에 가깝고 낮게 배치하는 것이 가장 확실합니다.', 'Minimize suction lift — placing the pump close to and below the fluid source is the surest fix.')}</li>
            <li>{L('흡입관 직경을 키워 유속과 마찰 손실을 줄이세요 (손실은 유속의 약 2제곱에 비례).', 'Increase suction-pipe diameter to lower velocity and friction loss (loss scales roughly with velocity squared).')}</li>
            <li>{L('고온 유체는 증기압이 급상승하므로, 가능하면 탱크를 가압하거나 펌프를 액면 아래에 두세요.', 'Hot fluids raise vapor pressure sharply — pressurize the tank or place the pump below the liquid level if possible.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('NPSHr은 펌프 회전수·유량에 따라 변하므로, 운전점(최대 유량) 데이터시트 값을 사용해야 합니다.', 'NPSHr varies with pump speed and flow, so use the value at the operating (maximum-flow) point.')}</li>
            <li>{L('이 계산은 정상 상태 정상 흐름을 가정합니다. 기동·정지 시 과도 압력 변동은 고려하지 않습니다.', 'This calculation assumes steady-state, uniform flow; transient pressure swings at start-up/shut-down are not included.')}</li>
            <li>{L('증기압은 Antoine 식으로 추정되며 유체별 유효 온도 범위를 벗어나면 오차가 큽니다.', 'Vapor pressure is estimated from the Antoine equation; outside each fluid\'s valid temperature range the error grows.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t.title}
      description={t.description}
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<NPSHCalculator dict={t} />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
