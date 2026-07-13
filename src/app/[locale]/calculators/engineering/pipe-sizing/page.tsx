'use client';

import React from 'react';
import PipeSizing from '@/components/engineering-calculator/PipeSizing';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict?.calculatorNames;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '배관 사이즈 계산은 유량과 허용 유속을 기반으로 최적의 배관 내경을 결정하는 과정입니다. 유속이 너무 빠르면 마찰 압력 강하가 커지고, 너무 느리면 설비비가 증가합니다.',
            'Pipe sizing determines the optimal pipe diameter based on flow rate and allowable velocity. Excessive velocity increases frictional pressure drop, while too low velocity raises equipment costs.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '유량과 허용 유속을 입력하면 최소 배관 내경을 계산하고, 표준 배관 규격(KS, ANSI, JIS 등)에서 가장 가까운 사이즈를 추천합니다. 유속·마찰 계수·압력 강하도 함께 계산합니다.',
              'Enter the flow rate and allowable velocity to calculate the minimum pipe diameter, and the closest standard pipe specification (KS, ANSI, JIS, etc.) is recommended. Velocity, friction factor, and pressure drop are also calculated.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관비(배관+피팅+설치비)는 전체 플랜트 비용의 30~50%를 차지하므로 경제적 사이즈 선택이 중요합니다', 'Piping costs (pipe+fittings+installation) account for 30–50% of total plant cost, making economical sizing important')}</li>
            <li>{L('과도한 유속은 에로전(부식), 진동, 소음을 유발합니다', 'Excessive velocity causes erosion, vibration, and noise')}</li>
            <li>{L('배관 사이즈에 따라 펌프 전력·운전비가 결정됩니다', 'Pipe size determines pump power and operating costs')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('배관 사이즈 계산 공식', 'Pipe Sizing Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '기본 원리는 연속 방정식(유량 보존)과 유속-단면적 관계입니다.',
              'The basic principle is the continuity equation (flow conservation) and the velocity–cross-section relationship.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">Q = A × v</p>
            <p className="font-mono text-lg text-center text-purple-600">A = π × D² / 4</p>
            <p className="font-mono text-lg text-center text-purple-600">D = √(4Q / (π × v))</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">Q</strong> — {L('부피 유량 [m³/s]', 'Volumetric flow rate [m³/s]')}</li>
          <li><strong className="font-semibold text-red-500">A</strong> — {L('배관 단면적 [m²]', 'Pipe cross-sectional area [m²]')}</li>
          <li><strong className="font-semibold text-blue-600">v</strong> — {L('유속 [m/s]', 'Velocity [m/s]')}</li>
          <li><strong className="font-semibold text-orange-600">D</strong> — {L('배관 내경 [m]', 'Pipe inner diameter [m]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('마찰 압력 강하 (Darcy-Weisbach)', 'Frictional Pressure Drop (Darcy-Weisbach)')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">ΔP = f × (L/D) × (ρ × v² / 2)</p>
          </div>
          <ul className="space-y-2 text-sm mt-2">
            <li><strong className="font-semibold text-green-600">ΔP</strong> — {L('마찰 압력 강하 [Pa]', 'Frictional pressure drop [Pa]')}</li>
            <li><strong className="font-semibold text-red-500">f</strong> — {L('Darcy 마찰 계수 (무차원)', 'Darcy friction factor (dimensionless)')}</li>
            <li><strong className="font-semibold text-blue-600">L</strong> — {L('배관 길이 [m]', 'Pipe length [m]')}</li>
            <li><strong className="font-semibold text-orange-600">ρ</strong> — {L('유체 밀도 [kg/m³]', 'Fluid density [kg/m³]')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('권장 유속 범위', 'Recommended velocity ranges')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('급수 배관: 1.0~2.0 m/s', 'Water supply piping: 1.0–2.0 m/s')}</li>
            <li>{L('온수 배관: 0.8~1.5 m/s', 'Hot water piping: 0.8–1.5 m/s')}</li>
            <li>{L('증기 배관: 20~40 m/s (포화증기)', 'Steam piping: 20–40 m/s (saturated steam)')}</li>
            <li>{L('냉동수 배관: 1.0~2.5 m/s', 'Chilled water piping: 1.0–2.5 m/s')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관은 이론 최소 직경보다 한 단계 큰 표준 규격을 선택하는 것이 일반적입니다', 'It is common to select one standard size larger than the theoretical minimum diameter')}</li>
            <li>{L('배관 길이가 짧고 직경이 클수록 마찰 손실이 작으므로, 경제 배관 속도를 벗어나지 않는 범위에서 큰 직경을 선호합니다', 'Shorter, larger-diameter pipes have less friction loss, so larger diameters are preferred within the economic velocity range')}</li>
            <li>{L('점도가 높은 액체(오일 등)는 유속을 더 낮게 설계해야 합니다', 'High-viscosity liquids (oil, etc.) require lower design velocities')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산기는 정상 유동(steady-state) 기준이며, 수격(hammer)·과도 유동은 별도 검토가 필요합니다', 'This calculator is for steady-state flow; water hammer and transient flow require separate analysis')}</li>
            <li>{L('배관 피팅·벤드의 국소 손실-loss는 포함되지 않으며, 별도의 등가 길이 환산이 필요합니다', 'Minor losses from fittings and bends are not included and require separate equivalent length conversion')}</li>
            <li>{L('부식·스케일 축적을 고려하여 설계 직경을 여유 있게 잡는 것이 좋습니다', 'Design diameter should have margin to account for corrosion and scale buildup')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['pipe-sizing'] || (ko ? '배관 사이즈 계산기' : 'Pipe Sizing Calculator')}
      description={t?.['pipe-sizing'] || (ko ? '최적의 배관 직경을 결정합니다' : 'Determine optimal pipe diameter')}
      icon={<span>🔧</span>}
      visualizationComponent={<></>}
      resultComponent={<PipeSizing />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
