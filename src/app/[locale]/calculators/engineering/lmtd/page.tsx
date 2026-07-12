'use client';

import React from 'react';
import LMTDCalculator from '@/components/engineering-calculator/LMTDCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function LMTDPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.lmtd;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '대수평균온도차(LMTD, Logarithmic Mean Temperature Difference)는 열교환기 양단에서 뜨거운 유체와 차가운 유체 사이의 온도차가 일정하지 않을 때, 열전달의 “실효 평균 구동력”을 나타내는 값입니다. 온도차는 길이에 따라 지수적으로 변하기 때문에 단순 산술 평균 대신 로그 평균을 사용합니다.',
            'The Logarithmic Mean Temperature Difference (LMTD) represents the effective average driving force for heat transfer in a heat exchanger, where the temperature difference between the hot and cold fluids varies along its length. Because that difference changes exponentially, a logarithmic mean is used instead of a simple arithmetic average.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '이 계산기는 뜨거운 유체와 차가운 유체의 입·출구 온도로부터 열교환기의 LMTD를 계산합니다. 대향류(counter-flow)와 평행류(parallel-flow) 배치를 모두 지원합니다.',
              'This calculator computes a heat exchanger\'s LMTD from the inlet and outlet temperatures of the hot and cold fluids, supporting both counter-flow and parallel-flow arrangements.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('열교환기 설계식 Q = U · A · LMTD에서 필요한 전열 면적 A 산정', 'Sizing the required heat-transfer area A in the design equation Q = U · A · LMTD')}</li>
            <li>{L('대향류/평행류 배치가 성능에 미치는 영향 비교', 'Comparing how counter-flow versus parallel-flow arrangements affect performance')}</li>
            <li>{L('기존 열교환기의 성능 평가와 열부하 검증', 'Evaluating the performance and verifying the heat duty of existing exchangers')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('LMTD 방정식', 'LMTD Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'LMTD는 열교환기 양쪽 끝에서의 온도차 ΔT₁, ΔT₂를 로그 평균한 값입니다. 두 끝단의 온도차를 어떻게 정의하는지는 유동 배치에 따라 달라집니다.',
              'The LMTD is the logarithmic mean of the temperature differences ΔT₁ and ΔT₂ at the two ends of the exchanger. How those end differences are defined depends on the flow arrangement.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex justify-center">
            <p className="font-mono text-lg text-center">LMTD = (ΔT₁ − ΔT₂) / ln(ΔT₁ / ΔT₂)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">LMTD</strong> — {L('대수평균온도차 [°C 또는 K]', 'Logarithmic mean temperature difference [°C or K]')}</li>
          <li><strong className="font-semibold text-green-600">{L('대향류', 'Counter-flow')}</strong> — {L('ΔT₁ = T_h,in − T_c,out | ΔT₂ = T_h,out − T_c,in', 'ΔT₁ = T_h,in − T_c,out | ΔT₂ = T_h,out − T_c,in')}</li>
          <li><strong className="font-semibold text-purple-600">{L('평행류', 'Parallel-flow')}</strong> — {L('ΔT₁ = T_h,in − T_c,in | ΔT₂ = T_h,out − T_c,out', 'ΔT₁ = T_h,in − T_c,in | ΔT₂ = T_h,out − T_c,out')}</li>
          <li><strong className="font-semibold text-orange-600">T_h, T_c</strong> — {L('뜨거운/차가운 유체 온도, 첨자 in/out은 입구/출구 [°C]', 'Hot / cold fluid temperatures; subscripts in/out mean inlet/outlet [°C]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('LMTD가 클수록 열전달 구동력이 커서 같은 열량을 더 작은 면적으로 처리할 수 있습니다.', 'A larger LMTD means a greater driving force, so the same duty can be handled with less area.')}</li>
            <li>{L('같은 입·출구 온도라면 대향류의 LMTD가 평행류보다 항상 크므로 대향류가 더 효율적입니다.', 'For the same inlet/outlet temperatures, counter-flow always yields a larger LMTD than parallel-flow, making it more efficient.')}</li>
            <li>{L('ΔT₁ = ΔT₂이면 로그 식이 0/0이 되므로, 이 경우 LMTD는 그 공통값(산술 평균)으로 정의합니다.', 'If ΔT₁ = ΔT₂ the log expression becomes 0/0, so LMTD is then defined as that common value (the arithmetic mean).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '대향류에서 뜨거운 유체 120 °C → 80 °C, 차가운 유체 30 °C → 70 °C라면 ΔT₁ = 120 − 70 = 50 °C, ΔT₂ = 80 − 30 = 50 °C. 두 값이 같으므로 LMTD = 50 °C. 만약 ΔT₁ = 50, ΔT₂ = 30이라면 LMTD = (50 − 30) / ln(50/30) ≈ 39.2 °C가 됩니다.',
              'In counter-flow with hot fluid 120 °C → 80 °C and cold fluid 30 °C → 70 °C, ΔT₁ = 120 − 70 = 50 °C and ΔT₂ = 80 − 30 = 50 °C. Since they are equal, LMTD = 50 °C. If instead ΔT₁ = 50 and ΔT₂ = 30, then LMTD = (50 − 30) / ln(50/30) ≈ 39.2 °C.',
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
            <li>{L('셸-튜브·교차류 열교환기에서는 보정 계수 F를 곱해 사용합니다: ΔT_eff = F × LMTD (F ≤ 1).', 'For shell-and-tube or cross-flow exchangers, apply a correction factor F: ΔT_eff = F × LMTD (F ≤ 1).')}</li>
            <li>{L('가능하면 대향류로 설계해 더 큰 LMTD를 얻고 전열 면적을 줄이세요.', 'Design for counter-flow when possible to obtain a larger LMTD and reduce heat-transfer area.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('LMTD 법은 총괄 열전달 계수 U와 비열이 열교환기 전체에서 일정하다고 가정합니다.', 'The LMTD method assumes a constant overall heat-transfer coefficient U and constant specific heats throughout the exchanger.')}</li>
            <li>{L('상변화(응축·비등)나 물성이 크게 변하는 경우에는 구간을 나누어 계산해야 정확합니다.', 'For phase change (condensation/boiling) or strongly varying properties, split the exchanger into zones for accuracy.')}</li>
            <li>{L('출구 온도를 모를 때는 LMTD 대신 ε-NTU 방법이 더 편리합니다.', 'When outlet temperatures are unknown, the ε-NTU method is often more convenient than LMTD.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || L('대수평균온도차(LMTD) 계산기', 'LMTD Calculator')}
      description={t?.description || L('열교환기의 대수평균온도차(LMTD)를 계산합니다.', 'Calculate the Logarithmic Mean Temperature Difference for heat exchangers.')}
      icon={<span>🌡️</span>}
      visualizationComponent={<></>}
      resultComponent={<LMTDCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
