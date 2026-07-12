'use client';

import React from 'react';
import OhmsLawCalculator from '@/components/engineering-calculator/OhmsLawCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function OhmsLawCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.ohmsLaw;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '옴의 법칙(Ohm\'s law)은 도체 양단의 전압, 흐르는 전류, 그리고 저항 사이의 기본 선형 관계를 나타내는 전기회로의 가장 기초적인 법칙입니다. 1827년 게오르크 시몬 옴이 실험적으로 정립했습니다.',
            'Ohm\'s law states the fundamental linear relationship among the voltage across a conductor, the current flowing through it, and its resistance. It is the most basic law of electric circuits, established experimentally by Georg Simon Ohm in 1827.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '전압(V), 전류(I), 저항(R) 세 값 중 두 개를 알면 나머지 하나를 구하고, 이어 전력(P)까지 계산합니다. 회로 설계, 부하 계산, 보호 장치(퓨즈·차단기) 선정의 출발점입니다.',
              'Given any two of voltage (V), current (I) and resistance (R), it finds the third and then the power (P). It is the starting point for circuit design, load calculations and selecting protective devices (fuses, breakers).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('저항기, LED, 모터 등 부품에 인가되는 전압·전류·전력 확인', 'Checking voltage, current and power applied to resistors, LEDs, motors and other components')}</li>
            <li>{L('적정 도체 굵기와 퓨즈 정격 선정으로 과부하·화재 방지', 'Choosing correct wire gauge and fuse rating to prevent overload and fire')}</li>
            <li>{L('직렬·병렬 회로의 전압 분배와 전력 소비 해석', 'Analyzing voltage division and power consumption in series and parallel circuits')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('옴의 법칙 (Ohm\'s Law)', 'Ohm\'s Law')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '도체의 저항이 일정할 때, 양단 전압은 전류에 정비례합니다. 이 비례 상수가 저항 R입니다. 두 값 중 하나를 알면 나머지를 구할 수 있습니다.',
              'When a conductor\'s resistance is constant, the voltage across it is directly proportional to the current; that proportionality constant is the resistance R. Knowing two of the three quantities yields the third.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">V = I × R</p>
            <p className="font-mono text-sm text-muted-foreground">I = V / R&nbsp;&nbsp;&nbsp;R = V / I</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('전력 (Electric Power)', 'Electric Power')}
          </h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">P = V × I</p>
            <p className="font-mono text-sm text-muted-foreground">P = I² × R = V² / R</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">V</strong> — {L('전압(전위차) [Volt, V]', 'Voltage / potential difference [Volts, V]')}</li>
          <li><strong className="font-semibold text-yellow-600">I</strong> — {L('전류 [Ampere, A]', 'Current [Amperes, A]')}</li>
          <li><strong className="font-semibold text-red-600">R</strong> — {L('저항 [Ohm, Ω]', 'Resistance [Ohms, Ω]')}</li>
          <li><strong className="font-semibold text-green-600">P</strong> — {L('전력(소비/공급 에너지율) [Watt, W]', 'Power (rate of energy use/supply) [Watts, W]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('저항 R이 클수록 같은 전압에서 전류가 작아집니다 (I = V/R).', 'A larger resistance R gives less current at the same voltage (I = V/R).')}</li>
            <li>{L('전력은 전압과 전류의 곱이며, 저항을 통해 소산될 때 P = I²R 로 발열합니다.', 'Power is the product V × I, and dissipated in a resistance as heat P = I²R.')}</li>
            <li>{L('같은 전력이라도 전압이 낮으면 전류가 커져 도체 손실이 커지므로, 송전은 고압이 유리합니다.', 'For the same power, lower voltage means higher current and greater conductor loss — which is why transmission uses high voltage.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '12 V 전원에 4 Ω 저항을 연결하면 전류 I = 12 / 4 = 3 A 가 흐르고, 소비 전력은 P = 12 × 3 = 36 W (또는 P = 3² × 4 = 36 W) 가 됩니다.',
              'Connecting a 4 Ω resistor to a 12 V supply gives current I = 12 / 4 = 3 A, and the power dissipated is P = 12 × 3 = 36 W (equivalently P = 3² × 4 = 36 W).',
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
            <li>{L('저항기 정격 전력(예: 1/4 W)보다 실제 소비 전력을 여유 있게 낮게 설계하세요.', 'Keep the actual dissipated power comfortably below the resistor\'s rated power (e.g. 1/4 W).')}</li>
            <li>{L('전선의 저항을 무시할 수 없는 긴 거리에서는 전압 강하를 별도로 계산하세요.', 'For long wire runs where wire resistance is not negligible, calculate voltage drop separately.')}</li>
            <li>{L('교류(AC)에서는 저항 대신 임피던스 Z를 쓰며 위상이 생기므로 유효 전력은 P = V·I·cosφ 입니다.', 'For AC, use impedance Z instead of resistance and account for phase: real power is P = V·I·cosφ.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('옴의 법칙은 선형(오옴) 소자에만 엄밀히 성립합니다. 다이오드·LED·전구(온도 의존 저항) 등 비선형 소자는 전압-전류가 비례하지 않습니다.', 'Ohm\'s law holds strictly only for linear (ohmic) elements; diodes, LEDs and lamp filaments are non-linear.')}</li>
            <li>{L('발열로 저항이 변하면 계산값과 실제가 달라집니다.', 'Self-heating changes resistance, so computed and actual values can diverge.')}</li>
            <li>{L('교류 회로의 유도·정전 용량 성분은 이 계산에 포함되지 않습니다.', 'AC inductive and capacitive effects are not captured by this calculation.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || "Ohm's Law Calculator"}
      description={t?.description || "Calculate voltage, current, resistance and power."}
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={<OhmsLawCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
