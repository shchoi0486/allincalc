'use client';

import React from 'react';
import Api650TankCalculator from '@/components/engineering-calculator/Api650TankCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function Api650TankPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.api650Tank;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'API 650 탱크 두께 계산기는 육상 용접 강재 저장탱크의 shell(몸통)에 필요한 최소 판 두께를 API 650 규격의 1-Foot(1피트) 법으로 구합니다. 탱크에 저장된 액체의 정수압은 바닥에 가까울수록 커지므로, shell은 높이별로 다른 두께의 강판을 겹쳐 쌓는 계단식( strake ) 구조를 가집니다.',
            'The API 650 tank-thickness calculator finds the minimum required shell-plate thickness of an aboveground welded steel storage tank using the API 650 "1-Foot" method. Because hydrostatic pressure grows toward the bottom, the shell is built as a stepped stack of plates of increasing thickness with depth.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '설계 조건(탱크 직경, 액체 높이, 비중, 허용 응력, 부식 여유)에 대해 운전 시 필요 두께 t_d와 수압 시험 시 필요 두께 t_t를 계산합니다.',
              'For the design inputs (tank diameter, liquid height, specific gravity, allowable stress, corrosion allowance) it computes the required operating thickness t_d and the hydrostatic-test thickness t_t.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('탱크 붕괴·누유를 방지하는 최소 shell 두께 확보 및 경제적 강판 설계', 'Ensuring minimum shell thickness to prevent collapse/leakage while optimizing plate cost')}</li>
            <li>{L('수압 시험 압력에서의 안전 여유(시험 두께) 확인', 'Checking safety margin under hydrostatic test pressure (test thickness)')}</li>
            <li>{L('부식 여유(CA)를 포함한 내구 수명 설계', 'Designing for service life by including a corrosion allowance (CA)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('API 650 1-Foot 계산법', 'API 650 1-Foot Method')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '가장 아래쪽에서 1피트(약 0.3 m) 위 지점의 환형 판 두께를 기준으로 정수압을 평가하는 경험식입니다. 야드·파운드 단위와 미터법 단위가 다르게 주어집니다.',
              'It is an empirical relation that evaluates hydrostatic pressure at the point 1 foot (about 0.3 m) above the bottom of the course. Separate constants are given for US customary and SI units.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col space-y-4">
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('설계 두께 (t_d)', 'Design Thickness (t_d)')}</p>
              <p className="font-mono text-lg text-blue-600">Imperial: t_d = [2.6 · D · (H - 1) · G] / S_d + CA</p>
              <p className="font-mono text-lg text-blue-600 mt-1">Metric: t_d = [4.9 · D · (H - 0.3) · G] / S_d + CA</p>
            </div>
            <div className="border-t border-dashed my-2"></div>
            <div>
              <p className="font-semibold text-sm text-muted-foreground mb-1">{L('수압 시험 두께 (t_t)', 'Hydrostatic Test Thickness (t_t)')}</p>
              <p className="font-mono text-lg text-teal-600">Imperial: t_t = [2.6 · D · (H - 1)] / S_t</p>
              <p className="font-mono text-lg text-teal-600 mt-1">Metric: t_t = [4.9 · D · (H - 0.3)] / S_t</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">D, H</strong> — {L('탱크 직경 및 액체 높이 [ft (Imperial) 또는 m (Metric)]', 'Tank Diameter and Liquid Height [ft (Imperial) or m (Metric)]')}</li>
          <li><strong className="font-semibold text-green-600">G</strong> — {L('저장 액체의 비중 (물 = 1.0)', 'Specific Gravity of liquid (water = 1.0)')}</li>
          <li><strong className="font-semibold text-purple-600">S_d, S_t</strong> — {L('설계 및 시험 허용 응력 [psi (Imperial) 또는 MPa (Metric)]', 'Allowable Design and Test Stress [psi (Imperial) or MPa (Metric)]')}</li>
          <li><strong className="font-semibold text-orange-600">CA</strong> — {L('부식 여유 (Corrosion Allowance) [in (Imperial) 또는 mm (Metric)]', 'Corrosion Allowance (CA) [in (Imperial) or mm (Metric)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('직경 D와 액체 높이 H가 클수록 정수압이 커져 필요 두께가 비례하여 증가합니다.', 'Larger diameter D and liquid height H raise hydrostatic pressure, increasing required thickness proportionally.')}</li>
            <li>{L('비중 G가 클수록(예: 물보다 무거운 액체) 두께가 커집니다.', 'A larger specific gravity G (heavier-than-water liquids) increases the thickness.')}</li>
            <li>{L('허용 응력 S_d, S_t가 클수록 얇은 강판으로도 버팁니다. 부식 여유 CA는 항상 두께에 더해집니다.', 'Higher allowable stress S_d, S_t permits thinner plates. The corrosion allowance CA is always added to the thickness.')}</li>
            <li>{L('수압 시험 두께 t_t는 비중을 사용하지 않고 시험 수두(보통 지붕판 상단까지의 물 높이)만으로 평가됩니다.', 'Test thickness t_t ignores specific gravity and is based on the test water head (usually to the top of the roof course).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '직경 D = 40 m, 액체 높이 H = 12 m, 비중 G = 1.0, 설계 허용 응력 S_d = 165 MPa, 부식 여유 CA = 1.5 mm인 탱크의 맨 아래 course를 보면(미터법 상수 4.9 사용): t_d = 4.9 × 40 × (12 − 0.3) × 1.0 / 165 + 1.5 ≈ 15.5 mm가 필요합니다.',
              'For a tank with D = 40 m, H = 12 m, G = 1.0, design stress S_d = 165 MPa and CA = 1.5 mm, the bottom course (SI constant 4.9) gives t_d = 4.9 × 40 × (12 − 0.3) × 1.0 / 165 + 1.5 ≈ 15.5 mm required.',
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
            <li>{L('실제 설계는 가장 아래 course부터 위로 올라가며 각 course 별로 두께를 계산하고, 상용 강판 두께(예: 6, 8, 10 mm)로 올림(round-up)합니다.', 'Compute thickness course by course from the bottom up, then round up to commercial plate thicknesses (e.g. 6, 8, 10 mm).')}</li>
            <li>{L('부식이 심한 서비스에는 CA를 3 mm 이상 두기도 하며, 이만큼 두께가 추가됩니다.', 'Corrosive services often use CA ≥ 3 mm, which adds directly to every course thickness.')}</li>
            <li>{L('최소 두께(일반적으로 6 mm 이상)와 지붕·바닥 판 두께 기준도 규격에 별도로 있으니 확인하세요.', 'Note the separate minimum-thickness and roof/floor rules in the code (typically ≥ 6 mm shell minimum).')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('1-Foot 법은 비강화(unanchored) 원형 탱크의 축대칭 정수압에 대한 근사이며, 풍하중·지진·외압 설계는 별도 항목입니다.', 'The 1-Foot method is an approximation for axisymmetric hydrostatic load on unanchored circular tanks; wind, seismic and vacuum designs are handled separately.')}</li>
            <li>{L('온도가 낮은 경우(저온 인성 요구)나 특수 강종 사용 시 허용 응력 선정에 주의가 필요합니다.', 'At low temperatures (toughness requirements) or special steels, allowable-stress selection needs care.')}</li>
            <li>{L('단위(ft vs m, psi vs MPa)와 상수(2.6 vs 4.9)를 혼용하지 마세요. 단위계에 맞는 식을 써야 합니다.', 'Never mix unit systems with constants — use the 2.6 form for US units and 4.9 for SI.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'API 650 탱크 두께 계산기' : 'API 650 Tank Thickness Calculator')}
      description={t?.description || (ko ? "API 650에 따른 육상 강재 저장탱크의 최소 shell 두께를 계산합니다." : "Calculate the minimum required shell thickness for welded steel storage tanks per API 650.")}
      icon={<span>🏭</span>}
      visualizationComponent={<></>}
      resultComponent={<Api650TankCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
