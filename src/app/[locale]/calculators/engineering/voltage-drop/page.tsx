'use client';

import React from 'react';
import VoltageDropCalculator from '@/components/engineering-calculator/VoltageDropCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function VoltageDropPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.voltageDrop;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '전압 강하(Voltage Drop)는 전선 저항 때문에 부하까지 도달하는 전압이 공급 전압보다 낮아지는 현상입니다. 너무 크면 기기 오동작·발열·효율 저하를 일으키므로, 배선 설계에서 허용 범위 내로 관리해야 합니다.',
            'Voltage drop is the reduction of voltage at the load below the supply voltage due to wire resistance. If too large it causes malfunction, heating and poor efficiency, so wiring design must keep it within an allowable range.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '전선 재질(구리/알루미늄), 상수(단상/삼상), 계통 전압, 부하 전류, 케이블 거리, 선심 단면적을 입력하면 전압 강하(V), 강하율(%), 부하단 전압을 계산합니다.',
              'Enter the wire material (Cu/Al), phase (single/three), system voltage, load current, cable distance and conductor cross-section to obtain the voltage drop (V), percentage drop and load-end voltage.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('적정 선심 단면적 선정(경제성 vs 강하 한도)', 'Selecting adequate conductor size (cost vs drop limit)')}</li>
            <li>{L('기기 안정 동작을 위한 허용 강하(보통 3~5%) 검토', 'Checking the allowable drop (typically 3–5%) for stable operation')}</li>
            <li>{L('원거리 공급·비상 backup 회로 설계', 'Long-distance supply and emergency backup circuit design')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('전압 강하 공식 (Ohm의 법칙 기반)', 'Voltage Drop Formula (Ohm\'s law)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '전선 1선 저항 R = ρ·L/A 이며, 단상은 왕복 2선분(계수 2), 삼상은 상간 관계로 √3을 곱합니다.',
              'The one-way resistance is R = ρ·L/A; single-phase uses the round-trip (factor 2) and three-phase multiplies by √3 for the phase relationship.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-lg">단상: V_drop = 2 × I × R</p>
            <p className="text-center font-mono text-lg">삼상: V_drop = √3 × I × R</p>
            <p className="text-center font-mono text-lg text-blue-600">R = ρ × L / A</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">V_drop</strong> — {L('전압 강하 [V]', 'Voltage drop [V]')}</li>
          <li><strong className="font-semibold text-green-600">I</strong> — {L('부하 전류 [A]', 'Load current [A]')}</li>
          <li><strong className="font-semibold text-blue-600">R</strong> — {L('전선 1선 저항 (왕복 아님) [Ω]', 'One-way wire resistance (not round-trip) [Ω]')}</li>
          <li><strong className="font-semibold text-purple-600">L</strong> — {L('회로 편도 거리 [m 또는 ft]', 'One-way circuit distance [m or ft]')}</li>
          <li><strong className="font-semibold text-orange-600">A, ρ</strong> — {L('선심 단면적 [mm²] 및 비저항 (Cu 0.0168, Al 0.0282 Ω·mm²/m)', 'Conductor area [mm²] and resistivity (Cu 0.0168, Al 0.0282 Ω·mm²/m)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('야드파운드법 (K 상수)', 'Imperial form (K-factor)')}</h4>
          <p className="text-sm">
            {L(
              '미국식에서는 원형 밀(cmil) 단면적과 상수 K(구리 12.9, 알루미늄 21.2 ohm·cmil/ft)를 써 V_drop = (factor × K × I × L) / cmil 로 계산합니다.',
              'In the US form, using circular-mil area and K (copper 12.9, aluminum 21.2 ohm·cmil/ft): V_drop = (factor × K × I × L) / cmil.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('전류 I가 클수록, 거리 L이 멀수록 강하는 비례해 커집니다.', 'Larger current I or longer distance L increases the drop proportionally.')}</li>
            <li>{L('단면적 A가 클수록 저항이 작아져 강하가 줄어듭니다(역비례).', 'A larger area A lowers resistance and thus the drop (inverse proportionality).')}</li>
            <li>{L('구리보다 알루미늄이 비저항이 커 강하가 더 큽니다(같은 단면적 기준).', 'Aluminum has higher resistivity than copper, giving a larger drop for the same area.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '220 V 단상, 구리선 A=4 mm², 거리 50 m, 전류 20 A인 경우: R = 0.0168×50/4 = 0.21 Ω, V_drop = 2×20×0.21 = 8.4 V, 강하율 = 8.4/220 ≈ 3.8%입니다(권장 3~5% 범위).',
              'For 220 V single-phase, copper A=4 mm², 50 m, 20 A: R = 0.0168×50/4 = 0.21 Ω, V_drop = 2×20×0.21 = 8.4 V, drop = 8.4/220 ≈ 3.8% (within the recommended 3–5%).',
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
            <li>{L('강하가 크면 선심을 굵게 하거나 전압을 높이거나(변압 분배) 거리를 줄이세요.', 'If drop is large, enlarge the conductor, raise the voltage, or shorten the run.')}</li>
            <li>{L('삼상 부하는 단상보다 같은 선심으로 강하가 작아 경제적입니다.', 'Three-phase loads have less drop for the same conductor — more economical.')}</li>
            <li>{L('온도 상승 시 비저항이 커져 강하도 약간 증가합니다.', 'Resistivity rises with temperature, slightly increasing the drop.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 식은 저항(Ohmic) 강하만 다루며, 역률·리액턴스에 의한 강하는 미포함입니다.', 'This covers only the resistive (Ohmic) drop; power-factor and reactance effects are excluded.')}</li>
            <li>{L('L은 편도 거리이므로 왕복 거리를 잘못 넣으면 2배 오차가 납니다.', 'L is the one-way distance; using the round-trip length doubles the error.')}</li>
            <li>{L('규정 허용 강하(예: NEC 권고)는 지역·용도마다 다르므로 해당 기준을 확인하세요.', 'Code-allowable drops (e.g., NEC recommendations) vary by region and use — check the applicable standard.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '전압 강하 계산기' : 'Voltage Drop Calculator')}
      description={t?.description || (ko ? '전기 회로의 전압 강하를 계산합니다.' : 'Calculate the voltage drop in an electrical circuit.')}
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={<VoltageDropCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
