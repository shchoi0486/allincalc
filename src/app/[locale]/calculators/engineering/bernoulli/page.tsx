'use client';

import React from 'react';
import BernoulliCalculator from '@/components/engineering-calculator/BernoulliCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function BernoulliPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.bernoulli;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '베르누이 방정식은 유체 흐름을 따라 압력·속도·높이 사이의 에너지 보존을 나타내는 유체역학의 기본 원리입니다. 이상적인(비압축성·비점성·정상) 흐름에서 한 유선을 따라 이동하는 유체 단위 부피의 총 역학적 에너지가 일정하게 유지된다는 사실을 표현합니다.',
            "Bernoulli's equation is a foundational principle of fluid mechanics expressing conservation of energy along a flow: the trade-off between pressure, velocity, and elevation. For an ideal (incompressible, inviscid, steady) flow, it states that the total mechanical energy per unit volume of fluid stays constant along a streamline.",
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '한 지점(1)의 압력·속도·높이를 알면, 같은 유선 위의 두 번째 지점(2)에서의 미지 값(예: 유속 또는 압력)을 구할 수 있습니다. 관경이 좁아지거나 높이가 바뀔 때 유체가 어떻게 가속되고 압력이 어떻게 변하는지를 정량적으로 예측합니다.',
              'Given the pressure, velocity, and elevation at one point (1), it solves for an unknown quantity (such as velocity or pressure) at a second point (2) on the same streamline. It quantitatively predicts how a fluid accelerates and how its pressure changes as the pipe narrows or the elevation changes.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관 축소부·노즐에서의 유속과 압력 변화 예측', 'Predicting velocity and pressure changes in pipe contractions and nozzles')}</li>
            <li>{L('벤투리관·피토관 등 유량·유속 측정 원리 이해', 'Understanding the operating principle of Venturi meters and Pitot tubes')}</li>
            <li>{L('항공기 날개 양력, 분무기, 유출 속도(토리첼리) 등 응용 해석', 'Analyzing airfoil lift, atomizers, and efflux velocity (Torricelli) applications')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('베르누이 방정식', "Bernoulli's Equation")}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '세 항의 합(정압 + 동압 + 위치압)이 유선을 따라 일정합니다. 각 항은 단위 부피당 에너지(즉 압력) 차원을 가집니다.',
              'The sum of three terms (static + dynamic + hydrostatic pressure) is constant along the streamline. Each term has units of energy per unit volume, i.e. pressure.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">P</strong> — {L('정압 [Pa (psf)]', 'Static pressure [Pa (psf)]')}</li>
          <li><strong className="font-semibold text-green-600">ρ</strong> — {L('유체 밀도 [kg/m³ (lb/ft³)]', 'Fluid density [kg/m³ (lb/ft³)]')}</li>
          <li><strong className="font-semibold text-purple-600">v</strong> — {L('유속 [m/s (ft/s)]', 'Fluid velocity [m/s (ft/s)]')}</li>
          <li><strong className="font-semibold text-red-600">g</strong> — {L('중력 가속도 [9.81 m/s² (32.17 ft/s²)]', 'Acceleration of gravity [9.81 m/s² (32.17 ft/s²)]')}</li>
          <li><strong className="font-semibold text-yellow-600">h</strong> — {L('높이(수두) [m (ft)]', 'Elevation height [m (ft)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('정압(P)·동압(½ρv²)·위치압(ρgh)의 합이 일정하므로, 한 항이 커지면 다른 항이 작아집니다.', 'Because P + ½ρv² + ρgh is constant, if one term rises another must fall.')}</li>
            <li>{L('관이 좁아져 유속 v가 증가하면 동압이 커지고, 그만큼 정압 P는 낮아집니다 (벤투리 효과).', 'Where the pipe narrows and velocity v rises, dynamic pressure increases and static pressure P drops — the Venturi effect.')}</li>
            <li>{L('높이 h가 올라가면 위치압이 늘어 정압이나 동압이 그만큼 줄어듭니다.', 'Raising the elevation h increases the hydrostatic term, reducing pressure or velocity accordingly.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '물(ρ = 1000 kg/m³)이 수평관(h₁ = h₂)을 흐른다고 하자. 지점 1에서 P₁ = 200,000 Pa, v₁ = 2 m/s이고, 관이 좁아져 v₂ = 6 m/s가 되면 P₂ = 200000 + ½·1000·(2² − 6²) = 200000 − 16000 = 184,000 Pa로 압력이 감소합니다.',
              'Water (ρ = 1000 kg/m³) flows in a horizontal pipe (h₁ = h₂). At point 1, P₁ = 200,000 Pa and v₁ = 2 m/s. Where the pipe narrows so v₂ = 6 m/s: P₂ = 200000 + ½·1000·(2² − 6²) = 200000 − 16000 = 184,000 Pa — the pressure drops.',
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
            <li>{L('두 지점은 반드시 같은 유선(또는 같은 관로) 위에 있어야 합니다. 높이 기준(h=0)은 편한 곳으로 잡되 양쪽을 동일하게 적용하세요.', 'The two points must lie on the same streamline (or flow path). Pick a convenient datum (h=0) but apply it consistently to both points.')}</li>
            <li>{L('연속 방정식 A₁v₁ = A₂v₂ 와 함께 쓰면 단면적 변화로부터 유속을 먼저 구할 수 있습니다.', 'Combine with continuity A₁v₁ = A₂v₂ to first find velocity from the change in cross-sectional area.')}</li>
            <li>{L('공기처럼 밀도가 낮은 유체에서는 위치압(ρgh) 항을 무시할 수 있는 경우가 많습니다.', 'For low-density fluids like air, the hydrostatic term (ρgh) can often be neglected.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('점성 마찰 손실을 무시합니다. 긴 배관·엘보·밸브가 있으면 실제 압력은 예측보다 낮습니다 (수두 손실 항 추가 필요).', 'It ignores viscous friction losses. With long pipes, elbows or valves, real pressure is lower than predicted — a head-loss term is needed.')}</li>
            <li>{L('비압축성 가정이므로 마하수 0.3 이상의 고속 압축성 흐름에는 적용할 수 없습니다.', 'The incompressible assumption breaks down for high-speed compressible flow above Mach 0.3.')}</li>
            <li>{L('펌프·팬이 에너지를 추가하는 구간에는 그 일(수두)을 별도로 더해 주어야 합니다.', 'Where a pump or fan adds energy, that work (head) must be added separately.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '베르누이 방정식 계산기' : 'Bernoulli Equation Calculator')}
      description={t?.description || (ko ? '베르누이 원리로 유체의 유속과 압력을 계산합니다.' : "Calculate fluid flow using Bernoulli's principle.")}
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<BernoulliCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
