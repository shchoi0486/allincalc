'use client';

import React from 'react';
import WaterHammerCalculator from '@/components/engineering-calculator/WaterHammerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function WaterHammerPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.waterHammer;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '수격 현상(Water Hammer, 유체 충격)은 배관 내 유체가 갑자기 정지하거나 방향이 바뀔 때 발생하는 압력 파(충격파)입니다. 유속 변화가 압축성 효과와 만나 순식간에 큰 압력 상승을 만들며, 배관 파손·소음·밸브 손상의 원인이 됩니다.',
            'Water hammer (fluid hammer) is a pressure wave produced when fluid in a pipe is suddenly stopped or reversed. The velocity change meets compressibility effects and creates a large, near-instant pressure rise that can rupture pipes, cause noise and damage valves.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '유체 밀도 ρ, 압력파 속도(파동 속도) a, 유속 변화 Δv를 입력하면 Joukowsky 식으로 최대 압력 상승 ΔP를 계산합니다.',
              'Enter the fluid density ρ, the pressure-wave (celerity) speed a and the velocity change Δv to compute the maximum pressure surge ΔP via the Joukowsky equation.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관·밸브·지지물 설계 시 허용 압력 검토', 'Checking allowable pressure in pipe, valve and support design')}</li>
            <li>{L('펌프 기동/정지 및 밸브 차단 시나리오 해석', 'Analyzing pump start/stop and valve-closure scenarios')}</li>
            <li>{L('서지 탱크·체크 밸브 등 보호 장치 선정', 'Sizing surge tanks, check valves and other protection devices')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('Joukowsky 방정식 (수격 현상)', 'Joukowsky Equation')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '즉시 차단(순간 정지) 시 발생하는 압력 상승의 최댓값입니다. 유속 변화가 클수록, 파동 속도와 밀도가 클수록 압력 상승이 커집니다.',
              'This is the maximum pressure rise for an instantaneous (sudden) shut-off. Larger velocity change, wave speed and density all raise the surge.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="text-center font-mono text-lg text-red-500">ΔP = ρ × a × Δv</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-500">ΔP</strong> — {L('압력 상승분(서지) [Pa 또는 psi]', 'Pressure surge [Pa or psi]')}</li>
          <li><strong className="font-semibold text-blue-600">ρ</strong> — {L('유체 밀도 [kg/m³ 또는 lb/ft³]', 'Fluid density [kg/m³ or lb/ft³]')}</li>
          <li><strong className="font-semibold text-green-600">a</strong> — {L('파동 속도(음속) [m/s 또는 ft/s]', 'Wave speed / celerity [m/s or ft/s]')}</li>
          <li><strong className="font-semibold text-purple-600">Δv</strong> — {L('유속 변화량 [m/s 또는 ft/s]', 'Change in fluid velocity [m/s or ft/s]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미와 파동 속도', 'How it works & wave speed')}</h4>
          <p className="text-sm">
            {L(
              '파동 속도 a는 유체 체적탄성계수 K와 배관 강성에 따라 a ≈ √[ K/ρ / (1 + (K/E)(D/t)·C ) ] 로 결정됩니다(강관에서 물은 보통 a ≈ 1000~1300 m/s). 배관이 유연할수록 a가 작아져 압력 상승이 완화됩니다.',
              'The wave speed a follows a ≈ √[ K/ρ / (1 + (K/E)(D/t)·C ) ] from the fluid bulk modulus K and pipe stiffness (water in steel is typically a ≈ 1000–1300 m/s). A more flexible pipe lowers a and thus softens the surge.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('임계 차단 시간', 'Critical closure time')}</h4>
          <p className="text-sm text-muted-foreground italic">
            {L(
              '* 참고: 수격 현상을 방지하려면 밸브 차단 시간 T_c가 임계 시간 T_cr = 2L/a 보다 길어야 합니다 (L은 배관 길이). 이보다 빠르면 즉시 차단으로 간주되어 전(全) Joukowsky 압력이 발생합니다.',
              '* Note: to avoid water hammer, the valve closure time T_c should exceed the critical time T_cr = 2L/a (L = pipe length). Faster closure is treated as instantaneous, producing the full Joukowsky pressure.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '물(ρ = 1000 kg/m³)이 파동 속도 a = 1000 m/s로 흐르다 유속이 2 m/s 감소하면 ΔP = 1000 × 1000 × 2 = 2×10⁶ Pa = 2 MPa(약 290 psi)의 압력 상승이 생깁니다.',
              'For water (ρ = 1000 kg/m³) with wave speed a = 1000 m/s and a 2 m/s velocity drop: ΔP = 1000 × 1000 × 2 = 2×10⁶ Pa = 2 MPa (about 290 psi) of surge.',
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
            <li>{L('완만한 밸브 차단, 소프트 스타트/스톱 펌프로 유속 변화 Δv를 줄이세요.', 'Use slow valve closure and soft-start/stop pumps to reduce Δv.')}</li>
            <li>{L('서지 탱크·압력 파괴기(air vessel)로 파동 에너지를 흡수하세요.', 'Use surge tanks or air vessels to absorb wave energy.')}</li>
            <li>{L('배관 지지와 신축 이음매로 충격 하중을 견디도록 하세요.', 'Reinforce supports and expansion joints to withstand the shock load.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Joukowsky 식은 즉시 차단 최댓값이며, 느린 차단이나 감쇠는 실제 압력을 낮춥니다.', 'The Joukowsky equation gives the instantaneous-closure maximum; slow closure or damping lowers the real pressure.')}</li>
            <li>{L('마찰·점성·다중 반사가 있으면 파형이 감쇠하므로 정밀 해석은 특성곡선법을 쓰세요.', 'With friction, viscosity and multiple reflections the wave damps — use the method of characteristics for precision.')}</li>
            <li>{L('증기 암(air/vapor pocket) 형성 시 압력 거동이 비선형이 됩니다.', 'Vapor/air-pocket formation makes the pressure behavior non-linear.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '수격 현상(압력 서지) 계산기' : 'Water Hammer (Pressure Surge) Calculator')}
      description={t?.description || (ko ? '밸브 급폐쇄로 인한 최대 압력 서지를 계산합니다.' : 'Calculate maximum pressure surge from water hammer.')}
      icon={<span>💥</span>}
      visualizationComponent={<></>}
      resultComponent={<WaterHammerCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
