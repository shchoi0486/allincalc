'use client';

import React from 'react';
import Din10220PipeCalculator from '@/components/engineering-calculator/Din10220PipeCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function Din10220PipePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.din10220Pipe;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'DIN EN 10220은 이음매 없는(seamless) 및 용접(welded) 강관의 표준 치수(외경·두께)를 규정하는 유럽 규격입니다. 이 계산기는 그 표준 치수와 강재 재질의 항복 강도를 이용해, 내압을 받는 관이 파열되는 압력(파열 압력)과 안전율을 적용한 허용 압력을 구합니다.',
            'DIN EN 10220 is the European standard that specifies the standard dimensions (outer diameter and wall thickness) of seamless and welded steel tubes. Using these dimensions together with the yield strength of the steel grade, this calculator determines the pressure at which an internally pressurized tube bursts (burst pressure) and the allowable pressure after applying a safety factor.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '얇은 벽 원통 이론(후프 응력)을 바탕으로 한 Barlow 공식으로 파열 압력 P_b를 계산하고, 여기에 안전율 FS를 나눠 실제 운전에서 사용할 수 있는 허용 압력 P_allow를 산출합니다.',
              'It calculates the burst pressure P_b using Barlow’s formula, which is based on thin-wall cylinder (hoop-stress) theory, and then divides by a safety factor FS to give the allowable pressure P_allow usable in real operation.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배관·유압 라인이 설계 압력을 안전하게 견디는지 검증', 'Verifying that a pipe or hydraulic line safely withstands the design pressure')}</li>
            <li>{L('필요한 두께·재질 등급 선정 및 대안 비교', 'Selecting the required wall thickness or material grade and comparing alternatives')}</li>
            <li>{L('압력 용기·배관 규격 준수 여부 사전 점검', 'Pre-checking compliance with pressure-piping requirements')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-red-500 pl-3">
            {L('파열 압력 공식 (Barlow의 공식)', "Burst Pressure Formula (Barlow's)")}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'Barlow 공식은 내압을 받는 얇은 벽 원통에 생기는 원주(후프) 응력이 재료 강도와 같아지는 순간을 파열로 봅니다.',
              'Barlow’s formula treats bursting as the moment when the circumferential (hoop) stress in a thin-wall pressurized cylinder equals the material strength.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-3">
            <div className="text-center">
              <p className="font-semibold text-xs text-muted-foreground mb-1">{L('파열 압력 (P_b)', 'Burst Pressure (P_b)')}</p>
              <p className="font-mono text-lg text-red-600">P_b = (2 · S · t) / D</p>
            </div>
            <div className="w-full border-t border-dashed my-1"></div>
            <div className="text-center">
              <p className="font-semibold text-xs text-muted-foreground mb-1">{L('허용 압력 (P_allow)', 'Allowable Pressure (P_allow)')}</p>
              <p className="font-mono text-lg text-green-600">P_allow = P_b / FS</p>
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-600">P_b</strong> — {L('파열 압력 [MPa]', 'Burst pressure [MPa]')}</li>
          <li><strong className="font-semibold text-green-600">S</strong> — {L('재질 항복 강도 [MPa] (예: St37.0 = 235 MPa)', 'Material yield strength [MPa] (e.g. St37.0 = 235 MPa)')}</li>
          <li><strong className="font-semibold text-purple-600">t, D</strong> — {L('배관 두께 및 외경 [mm]', 'Wall thickness and outer diameter [mm]')}</li>
          <li><strong className="font-semibold text-orange-600">FS</strong> — {L('안전율 (설계 여유 계수)', 'Safety factor (design margin)')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('두께 t가 두꺼울수록, 항복 강도 S가 클수록 파열 압력이 높아집니다.', 'A thicker wall t or a higher yield strength S raises the burst pressure.')}</li>
            <li>{L('외경 D가 클수록 같은 두께라도 파열 압력이 낮아집니다 (큰 관일수록 벽에 더 큰 힘).', 'A larger outer diameter D lowers the burst pressure for the same thickness (bigger pipes see higher wall force).')}</li>
            <li>{L('안전율 FS가 클수록 허용 압력은 낮아져 더 보수적인(안전한) 설계가 됩니다.', 'A larger safety factor FS lowers the allowable pressure, giving a more conservative (safer) design.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'St37.0 강(S = 235 MPa), 외경 D = 48.3 mm, 두께 t = 3.2 mm인 관의 파열 압력은 P_b = (2 × 235 × 3.2) / 48.3 ≈ 31.1 MPa입니다. 안전율 FS = 4를 적용하면 허용 압력은 P_allow = 31.1 / 4 ≈ 7.8 MPa가 됩니다.',
              'For St37.0 steel (S = 235 MPa) with D = 48.3 mm and t = 3.2 mm, the burst pressure is P_b = (2 × 235 × 3.2) / 48.3 ≈ 31.1 MPa. Applying a safety factor FS = 4 gives P_allow = 31.1 / 4 ≈ 7.8 MPa.',
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
            <li>{L('표준 치수는 DIN EN 10220 표에서 확인하고, 재질 등급별 항복 강도를 정확히 입력하세요.', 'Take dimensions from the DIN EN 10220 table and enter the correct yield strength for the material grade.')}</li>
            <li>{L('안전율은 유체·용도에 따라 다릅니다. 정적 수압은 낮게, 반복·충격·부식 환경은 높게 잡습니다.', 'Choose the safety factor to suit the service — lower for static water pressure, higher for cyclic, impact, or corrosive conditions.')}</li>
            <li>{L('부식 여유(corrosion allowance)를 고려해 두께 t에서 예상 부식량을 빼고 계산하세요.', 'Account for a corrosion allowance by subtracting the expected loss from the wall thickness t.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('Barlow 공식은 얇은 벽(D/t가 대략 20 이상) 가정입니다. 두꺼운 벽 관에는 Lamé 등 후벽 이론을 사용하세요.', 'Barlow’s formula assumes a thin wall (roughly D/t ≥ 20); use thick-wall theory (Lamé) for heavy-wall tubes.')}</li>
            <li>{L('용접부·이음·나사부는 모재보다 약할 수 있으므로 이음 효율(joint efficiency)을 반영해야 합니다.', 'Welds, joints, and threads may be weaker than the base metal — apply a joint efficiency factor.')}</li>
            <li>{L('온도 상승 시 항복 강도가 감소하므로 고온 사용에는 온도 보정된 허용 응력을 쓰세요.', 'Yield strength decreases at elevated temperature; use temperature-corrected allowable stress for hot service.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? 'DIN EN 10220 강관 파열 압력' : 'DIN EN 10220 Steel Tube Burst Pressure')}
      description={t?.description || (ko ? 'DIN EN 10220 치수와 DIN 재질 등급 기준으로 강관의 허용·파열 압력을 계산합니다.' : 'Calculate allowable and burst pressure for seamless/welded steel tubes per DIN EN 10220 dimensions and DIN material grades.')}
      icon={<span>🛡️</span>}
      visualizationComponent={<></>}
      resultComponent={<Din10220PipeCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
