'use client';

import React from 'react';
import SoundPressureCalculator from '@/components/engineering-calculator/SoundPressureCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function SoundPressurePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.soundPressure;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '음압 레벨(SPL, Sound Pressure Level)은 인간이 느끼는 소리의 크기를 데시벨(dB)로 나타낸 값입니다. 점음원(작은 소음원)에서 소리는 거리의 제곱에 비례해 에너지가 퍼져나가므로, 거리가 멀어질수록 레벨은 역제곱 법칙에 따라 감쇠합니다.',
            'The sound pressure level (SPL) expresses how loud a sound is, in decibels (dB). For a point source the acoustic energy spreads over an area proportional to the square of distance, so the level decays with distance according to the inverse-square law.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '기준 거리 r₁에서의 음압 레벨 L₁과 목표 거리 r₂를 입력하면, 자유음장(반사 없는 공간)에서의 L₂를 역제곱 법칙으로 계산합니다. 소음 전파 예측·방음 거리 확보 판단에 쓰입니다.',
              'Given the SPL L₁ at a reference distance r₁ and a target distance r₂, it computes L₂ in a free field (no reflections) via the inverse-square law. It is used to predict noise propagation and judge required screening distance.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('공장·기계 소음이 인접 건물/작업장에 미치는 영향 평가', 'Assessing impact of factory/machine noise on nearby buildings/workplaces')}</li>
            <li>{L('소음 기준(예: 85 dBA)을 만족하는 거리·방음벽 위치 결정', 'Finding distance/barrier placement to meet noise limits (e.g. 85 dBA)')}</li>
            <li>{L('스피커·경보기의 가청 범위 설계', 'Designing audible range of speakers and alarms')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('소리의 역제곱 법칙', 'Inverse Square Law for Sound')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '점음원의 음압 레벨은 거리에 따라 20·log₁₀(r₂/r₁)만큼 감쇠합니다. 거리가 2배가 되면 레벨은 6 dB 낮아집니다(에너지가 1/4로 줄어듦).',
              'The SPL of a point source falls by 20·log₁₀(r₂/r₁) with distance. Doubling the distance lowers the level by 6 dB (energy drops to one quarter).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">L₂ = L₁ − 20 × log₁₀(r₂ / r₁)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">L₁</strong> — {L('기준 거리에서의 음압 레벨 [dB]', 'Sound pressure level at reference distance [dB]')}</li>
          <li><strong className="font-semibold text-red-500">L₂</strong> — {L('목표 거리에서의 음압 레벨 [dB]', 'Sound pressure level at target distance [dB]')}</li>
          <li><strong className="font-semibold text-blue-600">r₁</strong> — {L('기준 거리 [m 또는 ft]', 'Reference distance [m or ft]')}</li>
          <li><strong className="font-semibold text-orange-600">r₂</strong> — {L('목표 거리 [m 또는 ft]', 'Target distance [m or ft]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('거리가 멀어질수록 r₂/r₁ 배수의 로그만큼 선형적으로 dB가 줄어듭니다(데시벨 척도 특성).', 'Farther away, the dB drops linearly with the log of the distance ratio (a property of the dB scale).')}</li>
            <li>{L('거리 2배 → −6 dB, 10배 → −20 dB 감쇠합니다.', 'Doubling distance gives −6 dB; ten times distance gives −20 dB.')}</li>
            <li>{L('레벨은 로그 척도이므로 수치 차이가 작아도 실제 에너지는 크게 다릅니다(3 dB ≈ 에너지 2배).', 'Because the scale is logarithmic, small dB differences mean large energy changes (3 dB ≈ double energy).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('적용 범위와 가정', 'Assumptions & scope')}</h4>
          <p className="text-sm">
            {L(
              '이 식은 자유음장(반사·흡음이 없는 열린 공간)의 점음원에 해당합니다. 실내나 지면 영향, 공기 흡음, 장애물이 있으면 추가 감쇠(또는 증폭)가 생깁니다.',
              'This applies to a point source in a free field (open space with no reflection/absorption). Indoors, ground effect, air absorption and obstacles add extra attenuation (or amplification).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '기준 거리 r₁ = 1 m에서 L₁ = 90 dB인 기계 소음이 r₂ = 10 m 지점에서 얼마인지 구해 봅시다. L₂ = 90 − 20×log₁₀(10/1) = 90 − 20 = 70 dB가 됩니다. 즉 10 m 떨어지면 70 dB로 낮아집니다.',
              'For a machine at L₁ = 90 dB measured at r₁ = 1 m, what is the level at r₂ = 10 m? L₂ = 90 − 20×log₁₀(10/1) = 90 − 20 = 70 dB — the level drops to 70 dB at 10 m.',
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
            <li>{L('6 dB 감쇠는 거리 2배와 같습니다. 방음이 필요하면 거리를 두는 것만으로도 효과가 있습니다.', 'A 6 dB drop equals doubling distance; simply increasing distance helps noise control.')}</li>
            <li>{L('여러 음원이 있으면 에너지(제곱) 합산 후 다시 dB로 변환하세요. 단순 산술 합이 아닙니다.', 'For multiple sources, sum energies (squares) then convert back to dB — not a simple arithmetic sum.')}</li>
            <li>{L('실측 시 A-weighting(dBA)으로 사람 귀 민감도를 반영하세요.', 'Use A-weighting (dBA) in field measurement to reflect human ear sensitivity.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('실내·반사면·지면 효과를 무시한 자유음장 모델이므로 실측과 차이가 날 수 있습니다.', 'It is a free-field model ignoring indoor/reflection/ground effects, so it may differ from measurements.')}</li>
            <li>{L('공기 흡음은 고주파에서만 유의미하며, 장거리 전파 시 추가 감쇠 요인입니다.', 'Air absorption matters only at high frequencies and adds attenuation over long distances.')}</li>
            <li>{L('선형(면/선) 음원(도로, 덕트)은 거리 의존이 다르므로 이 식을 바로 쓸 수 없습니다.', 'Line/area sources (roads, ducts) have different distance dependence and cannot use this formula directly.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '음압 레벨 거리 계산기' : 'Sound Pressure Level (SPL) Distance Calculator')}
      description={t?.description || (ko ? '거리에 따른 음압 레벨 감쇠를 계산합니다.' : 'Calculate sound attenuation over distance.')}
      icon={<span>🔊</span>}
      visualizationComponent={<></>}
      resultComponent={<SoundPressureCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
