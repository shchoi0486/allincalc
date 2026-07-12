'use client';

import React from 'react';
import CentrifugeCalculator from '@/components/engineering-calculator/CentrifugeCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CentrifugePage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.centrifuge;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '원심분리기는 시료를 고속으로 회전시켜 생성되는 원심력으로 밀도가 다른 성분을 분리하는 장치입니다. 실험실과 산업 현장에서 세포·단백질·혈액 성분·침전물 등을 분리하는 데 필수적입니다. 회전 속도(RPM)만으로는 실제로 시료에 걸리는 힘을 알 수 없기 때문에, 회전 반경까지 반영한 상대 원심력(RCF)이 표준 지표로 사용됩니다.',
            'A centrifuge spins samples at high speed so that the resulting centrifugal force separates components of different density. It is essential in laboratories and industry for separating cells, proteins, blood fractions, and precipitates. Because rotational speed (RPM) alone does not tell you the actual force on the sample, the Relative Centrifugal Force (RCF) — which also accounts for the radius — is used as the standard metric.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것: 상대 원심력 (RCF, g-force)', 'What this calculator finds: Relative Centrifugal Force (RCF, g-force)')}</h4>
          <p>
            {L(
              'RCF는 시료에 작용하는 원심 가속도를 중력 가속도(g)의 배수로 나타낸 값입니다. 예를 들어 “1000 × g”는 시료가 중력의 1000배에 해당하는 힘을 받는다는 뜻입니다. 같은 RPM이라도 로터 반경이 크면 RCF가 커지므로, 서로 다른 장비 간에는 RPM이 아니라 RCF로 조건을 맞춰야 합니다.',
              'RCF expresses the centrifugal acceleration on the sample as a multiple of gravitational acceleration (g). For example, “1000 × g” means the sample experiences 1000 times the force of gravity. Since a larger rotor radius gives a higher RCF at the same RPM, protocols must be matched between machines using RCF rather than RPM.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('논문·프로토콜에 명시된 g-force를 내 장비의 RPM으로 환산', 'Converting a protocol’s specified g-force into the correct RPM for your rotor')}</li>
            <li>{L('로터가 다른 장비 간에 동일한 분리 조건 재현', 'Reproducing identical separation conditions across machines with different rotors')}</li>
            <li>{L('시료(세포 등)가 손상되지 않도록 과도한 원심력 방지', 'Avoiding excessive force that could damage delicate samples such as cells')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('상대 원심력 (RCF) 방정식', 'Relative Centrifugal Force (RCF)')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '상수 1.118 × 10⁻⁵는 반경을 cm, 속도를 RPM으로 넣었을 때 결과가 중력 배수(g)로 나오도록 단위를 통합한 값입니다.',
              'The constant 1.118 × 10⁻⁵ combines the unit conversions so that, with radius in cm and speed in RPM, the result comes out as a multiple of gravity (g).',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center">RCF = 1.118 × 10⁻⁵ × r × N²</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-600">RCF</strong> — {L('상대 원심력 (중력 가속도 배수, × g)', 'Relative centrifugal force (multiple of gravity, × g)')}</li>
          <li><strong className="font-semibold text-green-600">r</strong> — {L('로터 반경 [cm]', 'Rotor radius [cm]')}</li>
          <li><strong className="font-semibold text-purple-600">N</strong> — {L('회전 속도 [RPM]', 'Rotational speed [RPM]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formula works')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('RCF는 회전 속도 N의 제곱에 비례합니다. RPM을 2배로 올리면 원심력은 4배가 됩니다.', 'RCF is proportional to the square of speed N — doubling the RPM quadruples the force.')}</li>
            <li>{L('RCF는 반경 r에 정비례합니다. 로터가 클수록 같은 RPM에서 더 큰 힘이 걸립니다.', 'RCF is directly proportional to radius r — a larger rotor produces more force at the same RPM.')}</li>
            <li>{L('반경은 로터 중심에서 튜브 바닥까지의 최대 반경(r_max)을 기준으로 계산하는 것이 일반적입니다.', 'The radius is normally taken as the maximum radius (r_max) from the rotor center to the bottom of the tube.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              '반경 r = 10 cm 로터를 N = 5,000 RPM으로 돌리면 RCF = 1.118 × 10⁻⁵ × 10 × 5000² = 1.118 × 10⁻⁵ × 10 × 25,000,000 ≈ 2,795 × g가 됩니다. 즉 시료에 중력의 약 2,800배 힘이 작용합니다.',
              'Spinning a rotor of radius r = 10 cm at N = 5,000 RPM gives RCF = 1.118 × 10⁻⁵ × 10 × 5000² = 1.118 × 10⁻⁵ × 10 × 25,000,000 ≈ 2,795 × g — about 2,800 times gravity on the sample.',
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
            <li>{L('프로토콜이 g로 주어지면 위 식을 N에 대해 풀어 RPM = √(RCF / (1.118×10⁻⁵ × r))로 환산하세요.', 'When a protocol gives g, rearrange for speed: RPM = √(RCF / (1.118×10⁻⁵ × r)).')}</li>
            <li>{L('반경은 사용하는 로터·튜브 위치에 따라 다르므로 제조사 매뉴얼의 r_max/r_avg 값을 확인하세요.', 'The radius depends on the specific rotor and tube position — check the manufacturer’s r_max/r_avg values.')}</li>
            <li>{L('튜브를 대칭으로 균형 있게 배치해 진동과 로터 손상을 방지하세요.', 'Always balance tubes symmetrically to prevent vibration and rotor damage.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('RCF는 시료에 걸리는 힘만 나타낼 뿐, 실제 분리 효율은 시료 밀도·점도·시간에도 좌우됩니다.', 'RCF describes only the force on the sample; actual separation also depends on density, viscosity, and time.')}</li>
            <li>{L('로터 위치(상단/바닥)에 따라 실제 반경이 달라 RCF가 변하므로 단일 값은 근사입니다.', 'The real radius (and thus RCF) varies along the tube, so a single value is only an approximation.')}</li>
            <li>{L('각 로터·튜브에는 최대 허용 RCF가 있으므로 이를 초과하지 마세요.', 'Every rotor and tube has a maximum rated RCF — never exceed it.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '원심분리기(RCF) 계산기' : 'Centrifuge (RCF) Calculator')}
      description={t?.description || (ko ? '로터 반경과 RPM으로 상대 원심력(g-force)을 계산합니다.' : 'Calculate the Relative Centrifugal Force (g-force) based on rotor radius and RPM.')}
      icon={<span>🔄</span>}
      visualizationComponent={<></>}
      resultComponent={<CentrifugeCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
