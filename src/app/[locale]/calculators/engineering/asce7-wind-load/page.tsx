'use client';

import React from 'react';
import Asce7WindLoadCalculator from '@/components/engineering-calculator/Asce7WindLoadCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function Asce7WindLoadPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.asce7WindLoad;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'ASCE 7 풍하중 계산기는 미 건축구조물 설계 기준인 ASCE 7-16의 속도압(Velocity Pressure) 산정법에 따라, 지표면으로부터 높이 z에서의 설계 풍압 q_z를 구합니다. 이 q_z는 건물 벽·지붕에 작용하는 실제 풍하중으로 변환되는 기초량입니다.',
            'The ASCE 7 wind-load calculator follows the velocity-pressure method of the US standard ASCE 7-16 to compute the design wind pressure q_z at height z above ground. This q_z is the basis from which the actual wind load on walls and roofs is derived.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '기본 풍속 V, 노출 범주(Exposure B/C/D), 지표 높이 z를 입력하면 속도압 q_z와 노출 계수 K_z를 계산합니다.',
              'Enter basic wind speed V, exposure category (B/C/D) and height z to obtain the velocity pressure q_z and exposure coefficient K_z.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('건물·교량·타워의 풍압 기반 구조 설계 및 안전성 검토', 'Wind-pressure-based structural design and safety checks for buildings, bridges and towers')}</li>
            <li>{L('외장(커튼월·지붕) 및 체결부 설계 하중 산정', 'Determining design loads for cladding (curtain walls, roofs) and fasteners')}</li>
            <li>{L('지형·노출 조건 변화가 풍하중에 미치는 영향 비교', 'Comparing how terrain and exposure changes affect wind load')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('ASCE 7 설계 풍압', 'ASCE 7 Velocity Pressure')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '속도압 q_z는 기본 풍속의 동압에 여러 영향 계수를 곱해 구합니다. 단위계(야드·파운드 / 미터법)에 따라 선행 상수가 다릅니다.',
              'Velocity pressure q_z is the dynamic pressure of the basic wind speed multiplied by several influence coefficients; the leading constant differs by unit system.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col space-y-4">
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('속도압 (q_z)', 'Velocity Pressure (q_z)')}</p>
              <p className="font-mono text-lg text-blue-600">Imperial: q_z = 0.00256 · K_z · K_zt · K_d · V²</p>
              <p className="font-mono text-lg text-blue-600 mt-1">Metric: q_z = 0.613 · K_z · K_zt · K_d · V²</p>
            </div>
            <div className="border-t border-dashed my-2"></div>
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('풍압 노출 계수 (K_z)', 'Velocity Pressure Exposure Coefficient (K_z)')}</p>
              <p className="font-mono text-lg text-teal-600">K_z = 2.01 · (z / z_g) ^ (2 / α)</p>
            </div>
          </div>
          <p className="text-sm mt-2">
            {L(
              '설계 풍하중(면압)은 p = q_z · G · C_p 로 구하며, G는 위험률(gust) 계수, C_p는 압력 계수입니다.',
              'The design wind pressure on a surface is p = q_z · G · C_p, where G is the gust-effect factor and C_p the pressure coefficient.',
            )}
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">V</strong> — {L('기본 풍속 [mph (Imperial) 또는 m/s (Metric)]', 'Basic Wind Speed [mph (Imperial) or m/s (Metric)]')}</li>
          <li><strong className="font-semibold text-green-600">z</strong> — {L('지면으로부터의 높이 [ft (Imperial) 또는 m (Metric)]', 'Height above ground level [ft (Imperial) or m (Metric)]')}</li>
          <li><strong>K_z</strong> — {L('높이 z에서의 노출 계수 (무차원)', 'Exposure coefficient at height z [dimensionless]')}</li>
          <li><strong>K_zt</strong> — {L('지형(언덕·능선) 계수 (보통 1.0)', 'Topographic (hill/ridge) factor (usually 1.0)')}</li>
          <li><strong>K_d</strong> — {L('방향성(중요도) 계수 (보통 1.0)', 'Directionality/importance factor (usually 1.0)')}</li>
          <li><strong className="font-semibold text-purple-600">Exposure B</strong> — {L('α = 7.0, z_g = 1200 ft (도심/교외)', 'α = 7.0, z_g = 1200 ft (Urban/Suburban)')}</li>
          <li><strong className="font-semibold text-orange-600">Exposure C</strong> — {L('α = 9.5, z_g = 900 ft (개활지/평탄 지형)', 'α = 9.5, z_g = 900 ft (Open Terrain)')}</li>
          <li><strong className="font-semibold text-blue-600">Exposure D</strong> — {L('α = 11.5, z_g = 700 ft (장애물 없는 평탄/해안 지형)', 'α = 11.5, z_g = 700 ft (Flat, Unobstructed/coastal)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('q_z는 풍속 V의 제곱에 비례하므로, 풍속이 2배면 풍압은 4배가 됩니다.', 'q_z is proportional to V², so doubling wind speed quadruples the pressure.')}</li>
            <li>{L('높이 z가 클수록(바람이 덜 막힌 곳) K_z가 커져 풍압이 증가합니다. Exposure D(해안)가 가장 가혹합니다.', 'Greater height z (less obstructed flow) raises K_z and thus pressure; Exposure D (coastal) is the most severe.')}</li>
            <li>{L('K_zt, K_d가 1보다 크면 풍압이 추가로 커집니다(예: 능선 지형).', 'K_zt or K_d above 1 further increase pressure (e.g. hilltop sites).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'Exposure C, z = 30 ft, V = 115 mph, K_zt = K_d = 1.0인 경우: K_z = 2.01·(30/900)^(2/9.5) ≈ 0.57, q_z = 0.00256·0.57·1·1·115² ≈ 19.4 psf. 미터법으로는 V = 51.4 m/s 사용 시 q_z = 0.613·0.57·51.4² ≈ 924 N/m²(≈ 19.3 psf)가 됩니다.',
              'For Exposure C, z = 30 ft, V = 115 mph, K_zt = K_d = 1.0: K_z = 2.01·(30/900)^(2/9.5) ≈ 0.57, so q_z = 0.00256·0.57·1·1·115² ≈ 19.4 psf. In SI with V = 51.4 m/s, q_z = 0.613·0.57·51.4² ≈ 924 N/m² (≈ 19.3 psf).',
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
            <li>{L('노출 범주는 주변 1마일(약 1.6 km) 범위의 지형을 기준으로 정하세요. 도심 건물군은 B, 평야는 C, 해안/호수는 D입니다.', 'Pick the exposure category from terrain within roughly a 1-mile (1.6 km) radius; city clusters = B, open country = C, coastal/lake = D.')}</li>
            <li>{L('q_z는 구조체 전체에 작용하는 동압이며, 실제 면압은 G·C_p를 곱해 얻습니다.', 'q_z is the dynamic pressure on the whole structure; the actual surface pressure needs G·C_p.')}</li>
            <li>{L('지진과 달리 풍하는 풍속 제곱 의존이므로, 지역 설계 풍속 맵을 정확히 확인하세요.', 'Unlike seismic load, wind scales with V², so read the local design wind-speed map carefully.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산기는 q_z(속도압)까지만 구하며, 편심·와류·동적 거동(풍진동)은 별도 해석이 필요합니다.', 'This calculator stops at q_z; eccentricity, vortex shedding and dynamic aeroelastic response need separate analysis.')}</li>
            <li>{L('국가/지역마다 채택하는 풍하중 기준이 다르므로(예: 한국 KBC, 유럽 EN 1991-1-4), 해외 적용 시 해당 규정을 확인하세요.', 'Wind standards differ by country (e.g. Korean KBC, Eurocode EN 1991-1-4); verify the applicable code for non-US projects.')}</li>
            <li>{L('단위계별 상수(0.00256 vs 0.613)와 풍속 단위(mph vs m/s)를 혼용하지 마세요.', 'Do not mix the constants (0.00256 vs 0.613) with the wrong wind-speed unit (mph vs m/s).')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'ASCE 7-16 풍하중 계산기' : 'ASCE 7-16 Wind Load Calculator')}
      description={t?.description || (ko ? 'ASCE 7-16 기준의 속도압(풍하중)을 계산합니다.' : 'Calculate velocity pressure based on ASCE 7-16 standard for structural wind load design.')}
      icon={<span>🌪️</span>}
      visualizationComponent={<></>}
      resultComponent={<Asce7WindLoadCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
