'use client';

import React from 'react';
import TorquePowerCalculator from '@/components/engineering-calculator/TorquePowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function TorquePowerPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.torquePower;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '토크(Torque)는 회전력을, 동력(Power)은 일을 하는 비율(단위 시간당 일)을 나타냅니다. 회전 기계에서는 토크와 회전 속도가 동력으로 연결되며, 이 관계를 이해하면 모터·엔진·터빈의 정격을 선정할 수 있습니다.',
            'Torque represents rotational force, while power is the rate of doing work. In rotating machinery torque and speed combine into power, and understanding this relation lets you select rated motors, engines and turbines.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '토크 τ와 회전 속도 N(RPM)을 입력하면 기계적 동력 P를 계산합니다. 단위계에 따라 미터법(W, N·m)과 야드파운드법(HP, lb-ft) 결과를 모두 다룹니다.',
              'Enter the torque τ and rotational speed N (RPM) to compute the mechanical power P. Both metric (W, N·m) and imperial (HP, lb-ft) bases are handled.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('모터·엔진 정격(출력) 선정 및 과부하 검토', 'Selecting motor/engine ratings and checking overload')}</li>
            <li>{L('감속기·기어비 설계(토크-속도 트레이드오프)', 'Gear-ratio design exploiting the torque–speed trade-off')}</li>
            <li>{L('펌프·압축기·송풍기 구동 동력 산정', 'Driving-power sizing for pumps, compressors and fans')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('동력·토크 관계식', 'Power & Torque Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '동력은 토크에 각속도 ω를 곱한 값입니다(각속도는 ω = 2πN/60, 단위 rad/s). 단위계마다 동력 단위가 달라집니다.',
              'Power equals torque times angular speed ω (with ω = 2πN/60 in rad/s). The power unit differs by unit system.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-4">
            <div className="text-center">
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('미터법 (SI)', 'Metric (SI)')}</p>
              <p className="font-mono text-xl">P (W) = τ (N·m) × [ 2πN(RPM) / 60 ]</p>
            </div>
            <div className="w-full border-t border-dashed border-gray-300"></div>
            <div className="text-center">
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('야드파운드법 (US)', 'Imperial (US)')}</p>
              <p className="font-mono text-xl">P (HP) = [ τ (lb-ft) × N(RPM) ] / 5252</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">P</strong> — {L('기계적 동력 [W 또는 HP]', 'Mechanical power [W or HP]')}</li>
          <li><strong className="font-semibold text-green-600">τ</strong> — {L('토크 [N·m 또는 lb-ft]', 'Torque [N·m or lb-ft]')}</li>
          <li><strong className="font-semibold text-purple-600">N</strong> — {L('회전 속도 [RPM]', 'Rotational speed [RPM]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('동력 P는 토크 τ에 비례합니다 → 같은 속도라면 토크가 클수록 출력이 큽니다.', 'Power P is proportional to torque τ → at the same speed, more torque means more output.')}</li>
            <li>{L('동력은 회전 속도 N에 비례합니다 → 같은 토크라면 고속에서 출력이 큽니다.', 'Power is proportional to speed N → at the same torque, higher speed gives more output.')}</li>
            <li>{L('상수 5252는 HP·lb-ft·RPM 단위계에서 33000/(2π)로부터 유도됩니다.', 'The constant 5252 arises from 33000/(2π) in the HP·lb-ft·RPM system.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '회전 속도 1750 RPM, 토크 100 N·m인 경우: ω = 2π×1750/60 ≈ 183.3 rad/s, P = 100 × 183.3 ≈ 18,300 W ≒ 18.3 kW. 같은 조건을 HP로 환산하면 약 24.5 HP가 됩니다.',
              'At 1750 RPM and 100 N·m: ω = 2π×1750/60 ≈ 183.3 rad/s, so P = 100 × 183.3 ≈ 18,300 W ≒ 18.3 kW. The equivalent in HP is about 24.5 HP.',
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
            <li>{L('저속 고토크가 필요하면 감속기를 써 토크를 높이고 속도를 낮추세요(동력 유지).', 'Use a reducer to raise torque and lower speed (power conserved) when low-speed high-torque is needed.')}</li>
            <li>{L('모터 정격은 "연속/단시간" 구분이 있으니 사용 패턴을 고려하세요.', 'Motor ratings distinguish continuous vs short-time duty — consider the duty cycle.')}</li>
            <li>{L('효율을 고려하면 입력 동력 = 출력 동력 ÷ 효율로 산정합니다.', 'Account for efficiency: input power = output power ÷ efficiency.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('본 식은 축 동력(손실 무시)이며, 전동기는 입력 전력과 효율 차이가 있습니다.', 'This is shaft power (lossless); motors differ by input electrical power and efficiency.')}</li>
            <li>{L('시동 토크·최대 토크는 정격 평균값과 다르므로 기동 조건을 별도 검토하세요.', 'Starting and peak torque differ from rated average — review starting conditions separately.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '토크·동력 계산기' : 'Torque & Power Calculator')}
      description={t?.description || (ko ? '토크와 회전 속도로 기계적 동력을 계산합니다.' : 'Calculate mechanical power from torque.')}
      icon={<span>⚙️</span>}
      visualizationComponent={<></>}
      resultComponent={<TorquePowerCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
