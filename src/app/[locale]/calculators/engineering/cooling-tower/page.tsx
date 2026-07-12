'use client';

import React from 'react';
import CoolingTowerCalculator from '@/components/engineering-calculator/CoolingTowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function CoolingTowerPage() {
  const { dict, locale } = useI18n();
  const t = dict?.common?.coolingTower;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '냉각탑은 뜨거운 순환수를 대기와 접촉시켜 물의 일부가 증발할 때 열을 빼앗기는 원리(증발 냉각)로 냉각하는 장치입니다. 발전소·냉동기·산업 공정에서 폐열을 대기로 방출하는 핵심 설비이며, 그 성능은 세 가지 온도 지표 — 레인지(Range), 어프로치(Approach), 효율(Effectiveness) — 로 평가합니다.',
            'A cooling tower cools hot circulating water by bringing it into contact with air, so that heat is removed as a fraction of the water evaporates (evaporative cooling). It is the key device for rejecting waste heat to the atmosphere in power plants, chillers, and industrial processes. Its performance is judged by three temperature metrics: Range, Approach, and Effectiveness.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('이 계산기가 구하는 것', 'What this calculator finds')}</h4>
          <p>
            {L(
              '입구 온수 온도, 출구 냉수 온도, 대기 습구 온도만 입력하면 레인지·어프로치·효율을 계산합니다. 레인지는 냉각탑이 실제로 낮춘 온도차, 어프로치는 냉수가 이론적 한계(습구 온도)에 얼마나 근접했는지를 나타냅니다.',
              'From the hot-water inlet temperature, the cold-water outlet temperature, and the ambient wet-bulb temperature, it computes Range, Approach, and Effectiveness. Range is the temperature drop the tower actually achieves, while Approach shows how close the cold water gets to its theoretical limit (the wet-bulb temperature).',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('왜 필요한가', 'Why it matters')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('운전 중 냉각탑이 설계 성능을 유지하는지 진단', 'Diagnosing whether an operating tower is holding its design performance')}</li>
            <li>{L('충전재 노후·공기 유량 부족 등 성능 저하 원인 파악', 'Identifying causes of degradation such as fouled fill or insufficient air flow')}</li>
            <li>{L('냉동기·공정 효율에 직결되는 냉수 온도 확보 여부 확인', 'Confirming the cold-water temperature needed for chiller or process efficiency')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('냉각탑 성능 공식', 'Cooling Tower Performance Formulas')}
          </h4>
          <p className="text-sm mb-3">
            {L(
              '세 지표는 세 온도의 단순한 차이와 비로 정의됩니다. 습구 온도가 이론적 냉각 한계라는 점이 핵심입니다.',
              'The three metrics are defined by simple differences and a ratio of the three temperatures, with the wet-bulb temperature acting as the theoretical cooling limit.',
            )}
          </p>
          <div className="p-4 bg-muted rounded-lg flex flex-col items-center space-y-2">
            <p className="font-mono text-lg text-center text-red-500">Range = T_hw − T_cw</p>
            <p className="font-mono text-lg text-center text-blue-600">Approach = T_cw − T_wb</p>
            <p className="font-mono text-lg text-center text-green-600">Effectiveness = [Range / (Range + Approach)] × 100%</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-red-500">T_hw</strong> — {L('입구 온수 온도 (탑으로 들어오는 뜨거운 물) [°C (°F)]', 'Hot-water temperature entering the tower [°C (°F)]')}</li>
          <li><strong className="font-semibold text-blue-600">T_cw</strong> — {L('출구 냉수 온도 (탑에서 나가는 냉각된 물) [°C (°F)]', 'Cold-water temperature leaving the tower [°C (°F)]')}</li>
          <li><strong className="font-semibold text-green-600">T_wb</strong> — {L('대기 습구 온도 (냉각의 이론적 한계) [°C (°F)]', 'Ambient air wet-bulb temperature (theoretical cooling limit) [°C (°F)]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('식의 의미 (어떻게 구하나)', 'How the formulas work')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('레인지가 클수록 냉각탑이 더 많은 열을 제거했다는 뜻이며, 순환수 유량과 열부하에 좌우됩니다.', 'A larger Range means the tower removed more heat; it is governed by the circulating-water flow and the heat load.')}</li>
            <li>{L('어프로치가 작을수록(냉수가 습구 온도에 가까울수록) 성능이 우수합니다. 어프로치는 0까지 내려갈 수 없습니다.', 'A smaller Approach (cold water closer to the wet-bulb) indicates better performance; Approach can never reach zero.')}</li>
            <li>{L('효율은 실제 냉각량(Range)을 이론적 최대 냉각량(Range + Approach)으로 나눈 값으로, 100%에 가까울수록 이상적입니다.', 'Effectiveness is the achieved cooling (Range) divided by the theoretical maximum (Range + Approach); closer to 100% is ideal.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Worked example')}</h4>
          <p className="text-sm">
            {L(
              'T_hw = 37°C, T_cw = 32°C, T_wb = 27°C인 경우 Range = 37 − 32 = 5°C, Approach = 32 − 27 = 5°C, Effectiveness = 5 / (5 + 5) × 100% = 50%가 됩니다.',
              'For T_hw = 37°C, T_cw = 32°C, T_wb = 27°C: Range = 37 − 32 = 5°C, Approach = 32 − 27 = 5°C, and Effectiveness = 5 / (5 + 5) × 100% = 50%.',
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
            <li>{L('습구 온도는 건구 온도가 아닌 습도를 반영한 값입니다. 정확한 측정을 위해 습도계나 사이크로미터를 사용하세요.', 'The wet-bulb temperature reflects humidity, not dry-bulb; use a hygrometer or psychrometer for accurate readings.')}</li>
            <li>{L('설계 어프로치는 보통 3~5°C 수준입니다. 어프로치가 계속 커지면 충전재 오염이나 공기량 부족을 의심하세요.', 'Design Approach is typically 3–5°C; a rising Approach points to fouled fill or reduced air flow.')}</li>
            <li>{L('레인지가 낮다면 냉각탑 자체보다 순환수 유량이나 열부하 변화가 원인일 수 있습니다.', 'A low Range may reflect changes in circulating flow or heat load rather than the tower itself.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('한계와 주의사항', 'Limitations & cautions')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('이 지표들은 열·물질 전달의 상세 메커니즘이 아니라 온도차 기반의 성능 요약입니다.', 'These metrics summarize performance from temperature differences, not the detailed heat/mass-transfer mechanism.')}</li>
            <li>{L('습구 온도는 이론적 냉각 하한이므로, 냉수 온도가 습구 온도보다 낮아질 수는 없습니다.', 'The wet-bulb temperature is the theoretical floor — cold water can never be cooled below it.')}</li>
            <li>{L('증발·비산·블로다운으로 인한 보충수(make-up)와 농축(사이클)은 별도로 관리해야 합니다.', 'Make-up water and concentration cycles from evaporation, drift, and blowdown must be managed separately.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t?.title || (ko ? '냉각탑 설계 계산기' : 'Cooling Tower Design Calculator')}
      description={t?.description || (ko ? '냉각탑의 레인지, 어프로치, 효율을 계산합니다.' : 'Calculate cooling tower Range, Approach, and Effectiveness.')}
      icon={<span>🏭</span>}
      visualizationComponent={<></>}
      resultComponent={<CoolingTowerCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
