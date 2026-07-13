'use client';

import React from 'react';
import WireGauge from '@/components/engineering-calculator/WireGauge';
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
            'AWG(American Wire Gauge)는 북미에서 사용하는 와이어 직경 표준입니다. 게이지 번호가 작을수록 와이어가 굵고, 전류 용량이 큽니다. 이 계산기는 AWG 게이지 번호를 입력하면 직경, 단면적, 저항 등의 형상 정보를 조회합니다.',
            'AWG (American Wire Gauge) is the wire diameter standard used in North America. Lower gauge numbers mean thicker wire with higher current capacity. This calculator looks up wire dimensions, cross-sectional area, and resistance from an AWG gauge number.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              'AWG 게이지 번호(0000~50)를 입력하면 해당 와이어의 직경(mm, inch), 단면적(mm², cmil), 1000ft당 직류 저항(Ω), 허용 전류(ampacity) 등을 보여줍니다.',
              'Enter an AWG gauge number (0000–50) to see the wire\'s diameter (mm, inch), cross-sectional area (mm², cmil), DC resistance per 1000ft (Ω), and ampacity.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('배선 설계에서 적절한 와이어 게이지는 과열 방지와 안전성 확보에 필수적입니다', 'Proper wire gauge selection is essential for preventing overheating and ensuring safety in wiring design')}</li>
            <li>{L('전기·전자 장비의 설계 시 전류 용량과 전압 강하를 동시에 고려해야 합니다', 'Electrical/electronic equipment design requires considering both current capacity and voltage drop')}</li>
            <li>{L('UL, NEC 등 전기 규정에서 요구하는 최소 와이어 게이지를 준수해야 합니다', 'Compliance with minimum wire gauge requirements in electrical codes like UL and NEC is mandatory')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('AWG 직경 계산 공식', 'AWG Diameter Formula')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              'AWG 게이지 번호 n에서 와이어 직경은 다음 공식으로 계산됩니다. 게이지 번호가 1 증가할 때마다 직경은 약 12.2% 감소합니다.',
              'For AWG gauge number n, the wire diameter is calculated by the following formula. Each increase in gauge number reduces the diameter by approximately 12.2%.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">d(n) = 0.127 mm × 92<sup>(36-n)/39</sup></p>
            <p className="font-mono text-lg text-center text-purple-600">d(n) = 0.005 inch × 92<sup>(36-n)/39</sup></p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-green-600">d(n)</strong> — {L('게이지 번호 n에서의 와이어 직경 [mm 또는 inch]', 'Wire diameter at gauge number n [mm or inch]')}</li>
          <li><strong className="font-semibold text-red-500">n</strong> — {L('AWG 게이지 번호 (0000=−3, 00=−2, 0=−1, 1~50)', 'AWG gauge number (0000=−3, 00=−2, 0=−1, 1–50)')}</li>
          <li><strong className="font-semibold text-blue-600">92</strong> — {L('직경 비율 기수 (10^((36-n)/39)에서의 밑)', 'Diameter ratio base in the 92^((36-n)/39) formula')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('단면적·저항 관계식', 'Cross-section and resistance relationships')}</h4>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-purple-600">A = π × d² / 4</p>
            <p className="font-mono text-lg text-center text-purple-600">R = ρ × L / A</p>
          </div>
          <ul className="space-y-2 text-sm mt-2">
            <li><strong className="font-semibold text-green-600">A</strong> — {L('단면적 [mm², cmil]', 'Cross-sectional area [mm², cmil]')}</li>
            <li><strong className="font-semibold text-red-500">R</strong> — {L('저항 [Ω]', 'Resistance [Ω]')}</li>
            <li><strong className="font-semibold text-blue-600">ρ</strong> — {L('전기 저항률 [Ω·m] (구리: 1.68×10⁻⁸)', 'Electrical resistivity [Ω·m] (copper: 1.68×10⁻⁸)')}</li>
            <li><strong className="font-semibold text-orange-600">L</strong> — {L('와이어 길이 [m]', 'Wire length [m]')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('자주 쓰이는 AWG 규격', 'Common AWG sizes')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('14 AWG: 1.628 mm, 15A (주택 배선용)', '14 AWG: 1.628 mm, 15A (residential wiring)')}</li>
            <li>{L('12 AWG: 2.053 mm, 20A (주방·욕실 배선)', '12 AWG: 2.053 mm, 20A (kitchen/bathroom wiring)')}</li>
            <li>{L('10 AWG: 2.588 mm, 30A (에어컨·전기레인지)', '10 AWG: 2.588 mm, 30A (AC/induction cooktop)')}</li>
            <li>{L('8 AWG: 3.264 mm, 50A (전기 오븐)', '8 AWG: 3.264 mm, 50A (electric oven)')}</li>
            <li>{L('6 AWG: 4.115 mm, 65A (수배전반)', '6 AWG: 4.115 mm, 65A (sub-panel)')}</li>
          </ul>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('실무 팁', 'Practical tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('와이어 게이지 선택 시 전류 용량(ampacity)뿐 아니라 전압 강하도 반드시 확인하세요', 'Check voltage drop as well as ampacity when selecting wire gauge')}</li>
            <li>{L('장거리 배선에서는 전압 강하(3% 이내 권장)가 제약 조건이 될 수 있습니다', 'Voltage drop (recommended within 3%) can become a limiting factor in long-distance wiring')}</li>
            <li>{L('구리 와이어의 허용 전류는 설치 환경(밀폐 덕트, 공기 중 등)에 따라 달라집니다', 'Copper wire ampacity varies depending on installation environment (enclosed duct, open air, etc.)')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 계산기는 구리(Cu) 와이어 기준이며, 알루미늄(Al)은 저항률이 약 1.6배 높습니다', 'This calculator is for copper (Cu) wire; aluminum (Al) has about 1.6× higher resistivity')}</li>
            <li>{L('허용 전류(ampacity)는 NEC Table 310.16 기준이며, 환경 온도·설치 조건에 따라 보정이 필요합니다', 'Ampacity values are based on NEC Table 310.16 and require correction for ambient temperature and installation conditions')}</li>
            <li>{L('스트랜드(manda) 와이어의 경우 표면적이 넓어 고주파에서의 피부 효과 저항이 다릅니다', 'Stranded wire has different skin effect resistance at high frequencies due to larger surface area')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.['wire-gauge'] || (ko ? '와이어 게이지 계산기' : 'Wire Gauge (AWG) Calculator')}
      description={t?.['wire-gauge'] || (ko ? 'AWG 와이어 게이지 치수 및 저항을 조회합니다' : 'Look up AWG wire dimensions and resistance')}
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={<WireGauge />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
