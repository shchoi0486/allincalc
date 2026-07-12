'use client';

import React from 'react';
import GearRatioCalculator from '@/components/engineering-calculator/GearRatioCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function GearRatioPage() {
  const { dict, locale, unitSystem } = useI18n();
  const t = dict?.common?.gearRatio;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);
  const torqueUnit = unitSystem === 'imperial' ? 'lb-ft' : 'N·m';

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '기어비(Gear Ratio)는 서로 맞물려 회전하는 두 기어의 잇수(또는 지름) 비율로, 회전 속도와 토크가 어떻게 변환되는지를 결정합니다. 기어열은 동력을 전달하면서 속도와 힘을 서로 맞바꾸는 기계 설계의 가장 기본적인 요소입니다.',
            'The gear ratio is the ratio of teeth (or diameters) between two meshing gears, and it determines how rotational speed and torque are converted. A gear train is one of the most fundamental elements of machine design, trading speed for force (and vice versa) while transmitting power.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '구동 기어와 피동 기어의 잇수, 구동측 회전 속도(RPM)와 토크를 입력하면 기어비, 출력 회전 속도, 출력 토크를 계산합니다.',
              'From the number of teeth on the driving and driven gears, and the input speed (RPM) and torque, it calculates the gear ratio, the output speed, and the output torque.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('감속기·변속기 설계 시 목표 속도와 토크를 얻기 위한 잇수 선정', 'Selecting tooth counts to hit target speed and torque in reducers and gearboxes')}</li>
            <li>{L('모터 사양(정격 RPM·토크)과 부하 요구 조건 매칭', 'Matching motor ratings (rated RPM and torque) to load requirements')}</li>
            <li>{L('자전거·차량 구동계의 속도·힘 트레이드오프 비교', 'Comparing the speed-versus-force trade-off in bicycle or vehicle drivetrains')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('기어비 공식', 'Gear Ratio Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '기어비는 피동 기어 잇수를 구동 기어 잇수로 나눈 값입니다. 회전 속도는 기어비에 반비례하고, 토크는 기어비에 비례합니다(에너지 보존).',
              'The gear ratio is the driven gear\'s teeth divided by the driving gear\'s teeth. Output speed is inversely proportional to the ratio, while torque is directly proportional to it (conservation of energy).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">GR = N₂ / N₁</p>
            <p className="font-mono text-lg text-center">RPM₂ = RPM₁ / GR</p>
            <p className="font-mono text-lg text-center">τ₂ = τ₁ × GR</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">N₁</strong> — {L('구동 기어 잇수', 'Driving gear teeth')}</li>
          <li><strong className="font-semibold text-green-600">N₂</strong> — {L('피동 기어 잇수', 'Driven gear teeth')}</li>
          <li><strong className="font-semibold text-purple-600">GR</strong> — {L('기어비 (무차원)', 'Gear ratio (dimensionless)')}</li>
          <li><strong className="font-semibold text-orange-600">RPM₁, RPM₂</strong> — {L('구동/피동 기어 회전 속도 [rpm]', 'Driving / driven gear speed [rpm]')}</li>
          <li><strong className="font-semibold text-red-600">τ₁, τ₂</strong> — {L(`구동/피동 기어 토크 [${torqueUnit}]`, `Driving / driven gear torque [${torqueUnit}]`)}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('GR > 1 (감속): 피동 기어가 크므로 속도는 줄고 토크는 늘어납니다.', 'GR > 1 (reduction): the driven gear is larger, so speed decreases and torque increases.')}</li>
            <li>{L('GR < 1 (증속): 피동 기어가 작으므로 속도는 늘고 토크는 줄어듭니다.', 'GR < 1 (overdrive): the driven gear is smaller, so speed increases and torque decreases.')}</li>
            <li>{L('이상적으로는 입력 동력 = 출력 동력이므로 속도와 토크는 서로 반대로 변합니다.', 'Ideally input power equals output power, so speed and torque change in opposite directions.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '구동 기어 잇수 N₁ = 20, 피동 기어 잇수 N₂ = 60이면 GR = 60/20 = 3. 구동측이 1500 rpm, 10 N·m라면, 출력은 1500/3 = 500 rpm, 10 × 3 = 30 N·m가 됩니다.',
              'With N₁ = 20 driving teeth and N₂ = 60 driven teeth, GR = 60/20 = 3. If the input is 1500 rpm at 10 N·m, the output becomes 1500/3 = 500 rpm at 10 × 3 = 30 N·m.',
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
            <li>{L('큰 감속비가 필요하면 여러 단의 기어열을 쓰세요. 전체 기어비는 각 단 기어비의 곱입니다.', 'For large reductions, use a multi-stage gear train — the total ratio is the product of each stage\'s ratio.')}</li>
            <li>{L('맞물리는 두 기어는 같은 모듈(또는 diametral pitch)을 가져야 정상적으로 물립니다.', 'Two meshing gears must share the same module (or diametral pitch) to engage properly.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 공식은 마찰·기계 손실을 무시한 이상값입니다. 실제 출력 토크는 기어 효율(보통 95~99%/단)만큼 낮아집니다.', 'These formulas assume an ideal train with no friction or losses; real output torque is reduced by gear efficiency (typically 95–99% per stage).')}</li>
            <li>{L('백래시, 열, 마모, 정렬 오차 등은 고려되지 않으므로 정밀 설계 시 별도 검토가 필요합니다.', 'Backlash, heat, wear and misalignment are not accounted for and require separate consideration in precision design.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('기어비 계산기', 'Gear Ratio Calculator')}
      description={t?.description || L('간단한 기어열의 기어비, 출력 속도, 출력 토크를 계산합니다.', 'Calculate the gear ratio, output speed, and output torque of a simple gear train.')}
      icon={<span>⚙️</span>}
      visualizationComponent={<></>}
      resultComponent={<GearRatioCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
