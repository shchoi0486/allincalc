'use client';

import React from 'react';
import ConvectionHeatTransfer from '@/components/engineering-calculator/ConvectionHeatTransfer';
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
            '대류 열전달 계수(Convection Heat Transfer Coefficient, h)는 유체와 고체 표면 사이의 열전달 정도를 나타내는 계수입니다. 뉴턴 냉각 법칙에 따라 열유속 q = h × (T_s − T_∞)로 표현되며, 유속·유체 성질·형상에 따라 달라집니다.',
            'The convection heat transfer coefficient (h) quantifies heat transfer between a fluid and a solid surface. By Newton\'s law of cooling, heat flux is q = h × (T_s − T_∞), varying with velocity, fluid properties, and geometry.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '레이놀즈 수(Re), 프란들 수(Pr)를 계산하고, 적절한 상관식(Nusselt 수 관계식)을 선택하여 대류 열전달 계수 h를 계산합니다. 평판·원관·구 등 다양한 형상을 지원합니다.',
              'It calculates Reynolds number (Re), Prandtl number (Pr), selects the appropriate correlation (Nusselt number relationship), and computes the convection heat transfer coefficient h for various geometries such as flat plates, cylinders, and spheres.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('열교환기 설계에서 전체 열전달 계수(U)를 결정하는 핵심 요소입니다', 'Key factor in determining the overall heat transfer coefficient (U) in heat exchanger design')}</li>
            <li>{L('냉각 시스템(엔진 냉각, 전자기기 냉각 등)의 성능 평가에 필수적입니다', 'Essential for performance evaluation of cooling systems (engine cooling, electronics cooling, etc.)')}</li>
            <li>{L('공정 설비의 가열·냉각 시간 예측에 사용됩니다', 'Used for predicting heating/cooling time of process equipment')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('뉴턴 냉각 법칙', 'Newton\'s Law of Cooling')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '대류 열전달의 기본 공식으로, 유체와 표면 사이의 온도차에 비례하는 열유속을 나타냅니다.',
              'The fundamental formula for convection, expressing heat flux proportional to the temperature difference between fluid and surface.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">q = h × (T<sub>s</sub> − T<sub>∞</sub>)</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">q</strong> — {L('열유속 [W/m²]', 'Heat flux [W/m²]')}</li>
          <li><strong className="font-semibold text-red-500">h</strong> — {L('대류 열전달 계수 [W/(m²·K)]', 'Convection heat transfer coefficient [W/(m²·K)]')}</li>
          <li><strong className="font-semibold text-blue-600">T<sub>s</sub></strong> — {L('표면 온도 [°C 또는 K]', 'Surface temperature [°C or K]')}</li>
          <li><strong className="font-semibold text-orange-600">T<sub>∞</sub></strong> — {L('유체 온도 (자유 유류) [°C 또는 K]', 'Fluid temperature (free stream) [°C or K]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('뉴셀 수 관계식', 'Nusselt number correlations')}</h4>
          <p className="text-sm mb-3">
            {L(
              '뉴스셀 수(Nu)는 무차원 열전달 계수이며, Re와 Pr의 함수로 표현됩니다. 형상과 유동 조건에 따라 적절한 상관식을 선택합니다.',
              'The Nusselt number (Nu) is the dimensionless heat transfer coefficient, expressed as a function of Re and Pr. Select the appropriate correlation based on geometry and flow conditions.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <div>
              <p className="font-semibold text-sm mb-1">{L('평판 난류 (Flat plate turbulent)', 'Flat plate turbulent')}</p>
              <p className="font-mono text-lg text-center text-purple-600">Nu = 0.037 × Re<sup>0.8</sup> × Pr<sup>1/3</sup></p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">{L('원관 난류 (Circular tube turbulent)', 'Circular tube turbulent')}</p>
              <p className="font-mono text-lg text-center text-purple-600">Nu = 0.023 × Re<sup>0.8</sup> × Pr<sup>n</sup></p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-1">{L('구형 (Sphere)', 'Sphere')}</p>
              <p className="font-mono text-lg text-center text-purple-600">Nu = 2 + 0.6 × Re<sup>1/2</sup> × Pr<sup>1/3</sup></p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('대류 열전달 계수 h의 유도', 'Derivation of convection coefficient h')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">h = Nu × k / L</p>
          </div>
          <ul className="space-y-2 text-sm mt-2">
            <li><strong className="font-semibold text-green-600">Nu</strong> — {L('뉴스셀 수 (무차원)', 'Nusselt number (dimensionless)')}</li>
            <li><strong className="font-semibold text-red-500">k</strong> — {L('유체의 열전도율 [W/(m·K)]', 'Thermal conductivity of fluid [W/(m·K)]')}</li>
            <li><strong className="font-semibold text-blue-600">L</strong> — {L('특성 길이 [m] (원관: 직경, 평판: 판 길이)', 'Characteristic length [m] (tube: diameter, plate: length)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('무차원 수 계산 공식', 'Dimensionless number formulas')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">Re = ρ × v × L / μ</p>
            <p className="font-mono text-lg text-center text-purple-600">Pr = μ × c<sub>p</sub> / k</p>
          </div>
          <ul className="space-y-2 text-sm mt-2">
            <li><strong className="font-semibold text-green-600">Re</strong> — {L('레이놀즈 수: 관성력/점성력 비 (Re > 2300: 천이, Re > 10⁴:난류)', 'Reynolds number: ratio of inertial to viscous forces (Re > 2300: transition, Re > 10⁴: turbulent)')}</li>
            <li><strong className="font-semibold text-red-500">Pr</strong> — {L('프란들 수: 운동점성율/열확산율 비 (공기 ≈ 0.71, 물 ≈ 7.0)', 'Prandtl number: ratio of momentum to thermal diffusivity (air ≈ 0.71, water ≈ 7.0)')}</li>
            <li><strong className="font-semibold text-blue-600">μ</strong> — {L('동점성 계수 [Pa·s]', 'Dynamic viscosity [Pa·s]')}</li>
            <li><strong className="font-semibold text-orange-600">v</strong> — {L('유속 [m/s]', 'Velocity [m/s]')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('대류 계수 h의 범위: 공기 자연 대류 5~25, 강제 대류 25~250, 액체 100~20,000 W/(m²·K)', 'Typical h ranges: air natural convection 5–25, forced convection 25–250, liquids 100–20,000 W/(m²·K)')}</li>
            <li>{L('유속이 증가하면 h도 증가하지만, 에로전과 소음도 함께 증가합니다', 'Increasing velocity raises h but also increases erosion and noise')}</li>
            <li>{L('난류 강화를 위해 fin(핀)이나 turbulence promoter를 사용하면 h를 크게 높일 수 있습니다', 'Using fins or turbulence promoters can significantly increase h by enhancing turbulence')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('상관식은 특정 형상·유동 범위에서 유도된 것이므로, 적용 전에 유효 범위를 반드시 확인하세요', 'Correlations are derived for specific geometries/flow ranges; always verify applicability before use')}</li>
            <li>{L('자연 대류와 강제 대류가 동시에 작용하는 혼합 대류는 별도의 상관식이 필요합니다', 'Mixed convection (combined natural and forced) requires separate correlations')}</li>
            <li>{L('비정상(unsteady) 대류 열전달은 이 계산기에서 다루지 않으며, 시간 의존 해석이 필요합니다', 'Transient convection heat transfer is not covered by this calculator and requires time-dependent analysis')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['convection-heat-transfer'] || (ko ? '대류 열전달 계수 계산기' : 'Convection Heat Transfer Calculator')}
      description={t?.['convection-heat-transfer'] || (ko ? '대류 열전달 계수를 계산합니다' : 'Calculate convection heat transfer coefficient')}
      icon={<span>🔥</span>}
      visualizationComponent={<></>}
      resultComponent={<ConvectionHeatTransfer />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
