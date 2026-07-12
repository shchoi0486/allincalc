'use client';

import React from 'react';
import BearingLifeCalculator from '@/components/engineering-calculator/BearingLifeCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function BearingLifePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.bearingLife;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '구름 베어링(볼 베어링·롤러 베어링)은 회전축을 지지하며 마찰을 최소화하는 기계 요소입니다. 아무리 잘 만든 베어링이라도 하중을 받으며 회전을 반복하면 접촉면에 반복 응력이 쌓여 결국 표면 피로(스폴링, spalling)로 손상됩니다. 이 “피로 수명”을 통계적으로 예측하는 국제 표준이 ISO 281이며, 이 계산기는 그 기본 정격 수명 L₁₀를 구합니다.',
            'Rolling-element bearings (ball and roller bearings) support a rotating shaft while minimizing friction. Even a perfectly manufactured bearing eventually fails by surface fatigue (spalling) as repeated stress accumulates at the rolling contacts. ISO 281 is the international standard that statistically predicts this fatigue life, and this calculator computes its basic rating life L₁₀.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것: 기본 정격 수명 L₁₀', 'What this calculator finds: the basic rating life L₁₀')}</h4>
          <p>
            {L(
              'L₁₀는 동일한 조건에서 운전한 다수의 베어링 중 90%가 표면 피로 없이 도달하는 수명입니다. 다시 말해 10%만 고장 나는 시점이며, 백만 회전(millions of revolutions) 단위 또는 회전 속도를 반영한 운전 시간(L₁₀h) 단위로 표현됩니다. “평균 수명”이 아니라 신뢰도 90% 기준의 보수적 수명이라는 점이 핵심입니다.',
              'L₁₀ is the life that 90% of a large group of identical bearings will reach or exceed before surface fatigue appears. In other words, only 10% are expected to have failed by that point. It is expressed in millions of revolutions, or in operating hours (L₁₀h) once rotational speed is included. Crucially, it is a conservative life at 90% reliability, not an average life.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('설계 하중과 속도에서 베어링이 요구 수명(예: 20,000시간)을 만족하는지 검증', 'Verifying that a bearing meets a required service life (e.g. 20,000 h) at the design load and speed')}</li>
            <li>{L('여러 베어링 모델의 정격 하중(C)을 비교해 최적 사양 선정', 'Comparing the dynamic load ratings (C) of candidate bearings to select the best size')}</li>
            <li>{L('예방 정비·교체 주기 및 재고 계획 수립', 'Planning preventive-maintenance intervals, replacement cycles and spares inventory')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('ISO 281 베어링 수명 방정식', 'ISO 281 Bearing Life Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '기본 정격 수명은 정격 하중과 실제 하중의 비를 지수 승한 값으로 정의됩니다. 회전 속도를 알면 이를 운전 시간으로 환산합니다.',
              'The basic rating life is defined as the ratio of the load rating to the actual load, raised to an exponent. If the rotational speed is known, it is converted into operating hours.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">L₁₀ = (C / P)ᵖ</p>
            <p className="font-mono text-lg text-center">L₁₀h = (1,000,000 / (60 × N)) × L₁₀</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">L₁₀</strong> — {L('기본 정격 수명 (백만 회전 단위)', 'Basic rating life (in millions of revolutions)')}</li>
          <li><strong className="font-semibold text-green-600">L₁₀h</strong> — {L('작동 시간 기준 기본 정격 수명 [h]', 'Basic rating life in operating hours [h]')}</li>
          <li><strong className="font-semibold text-purple-600">C</strong> — {L('기본 동적 정격 하중 [N (lbf)] (베어링 카탈로그 제공값)', 'Basic dynamic load rating [N (lbf)] — given in the bearing catalog')}</li>
          <li><strong className="font-semibold text-red-500">P</strong> — {L('등가 동하중 (반경·축방향 하중을 합성한 값) [N (lbf)]', 'Equivalent dynamic bearing load (combined radial/axial load) [N (lbf)]')}</li>
          <li><strong className="font-semibold text-orange-600">p</strong> — {L('수명 지수 (볼 베어링 = 3, 롤러 베어링 = 10/3)', 'Life exponent (3 for ball bearings, 10/3 for roller bearings)')}</li>
          <li><strong className="font-semibold text-gray-600">N</strong> — {L('회전 속도 [RPM]', 'Rotational speed [RPM]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('하중 P가 커질수록 수명은 지수적으로 급감합니다. 볼 베어링(p=3)은 하중이 2배가 되면 수명이 1/8로 줄어듭니다.', 'As load P rises, life drops steeply because of the exponent. For a ball bearing (p=3), doubling the load cuts life to one-eighth.')}</li>
            <li>{L('정격 하중 C가 큰(더 큰) 베어링을 고르면 (C/P) 비가 커져 수명이 늘어납니다.', 'Choosing a larger bearing with a higher rating C increases the (C/P) ratio and therefore the life.')}</li>
            <li>{L('회전 속도 N이 높을수록 같은 회전수에 더 빨리 도달하므로 시간 단위 수명 L₁₀h는 짧아집니다.', 'A higher speed N reaches the same number of revolutions sooner, so the time-based life L₁₀h becomes shorter.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '동적 정격 하중 C = 30,000 N인 볼 베어링(p=3)이 등가 하중 P = 3,000 N, 회전 속도 N = 1,500 RPM으로 운전된다고 하면 L₁₀ = (30000/3000)³ = 1,000 백만 회전 = 10억 회전입니다. 시간으로 환산하면 L₁₀h = 1,000,000 / (60 × 1500) × 1000 ≈ 11,111 시간이 됩니다.',
              'A ball bearing (p=3) with C = 30,000 N runs at an equivalent load P = 3,000 N and N = 1,500 RPM. Then L₁₀ = (30000/3000)³ = 1,000 million revolutions. Converting to hours: L₁₀h = 1,000,000 / (60 × 1500) × 1000 ≈ 11,111 hours.',
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
            <li>{L('P는 순수 반경 하중이 아니라 등가 하중입니다. 축방향 하중이 있으면 P = X·Fr + Y·Fa 로 먼저 환산하세요 (X, Y는 베어링별 계수).', 'P is the equivalent load, not the pure radial load. If there is axial load, first compute P = X·Fr + Y·Fa (X, Y are bearing-specific factors).')}</li>
            <li>{L('더 긴 수명이 필요하면 하중을 줄이기보다 한 치수 큰 베어링(더 큰 C)을 쓰는 것이 지수 효과 덕분에 효율적입니다.', 'When longer life is needed, stepping up to a bearing with a higher C is often more effective than reducing load, thanks to the exponent.')}</li>
            <li>{L('실제 신뢰도·윤활·오염을 반영하려면 수정 정격 수명 Lnm = a₁·a_ISO·L₁₀ 를 사용하세요.', 'For real reliability, lubrication and contamination, use the modified rating life Lnm = a₁·a_ISO·L₁₀.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('L₁₀는 표면 피로만 고려합니다. 부적절한 윤활, 오염, 오정렬, 과열 등은 예측보다 훨씬 이른 고장을 유발합니다.', 'L₁₀ only accounts for surface fatigue. Poor lubrication, contamination, misalignment or overheating cause failures far sooner than predicted.')}</li>
            <li>{L('정적(비회전) 하중이 큰 경우에는 정적 안전율(C₀/P₀)을 별도로 확인해야 합니다.', 'For large static (non-rotating) loads, the static safety factor (C₀/P₀) must be checked separately.')}</li>
            <li>{L('매우 저속에서는 회전당 수명이 커도 실제 시간 수명은 짧을 수 있고, 유막 형성이 어려워 별도 검토가 필요합니다.', 'At very low speeds, film formation is difficult and the time-based life may still be short despite a high revolution count.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '베어링 수명(L10) 계산기' : 'Bearing Life (L10) Calculator')}
      description={t?.description || (ko ? 'ISO 281 기준 구름 베어링의 기본 정격 수명을 계산합니다.' : 'Calculate ISO 281 basic rating life for bearings.')}
      icon={<span>⚙️</span>}
      visualizationComponent={<></>}
      resultComponent={<BearingLifeCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
