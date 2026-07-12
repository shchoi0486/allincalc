'use client';

import React from 'react';
import TankCalculator from '@/components/engineering-calculator/TankCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';
import { useI18n } from '@/i18n/I18nProvider';

export default function TankCalculatorPage() {
  const { dict, locale } = useI18n();
  const t = dict.tankCalculator;
  const ko = locale === 'ko';
  const L = (koText: string, enText: string) => (ko ? koText : enText);

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            'Tank 부피 계산기는 원통형, 직사각형, 타원형, 원추형 등 다양한 형태의 탱크와 저장 시설 부피를 정확하게 계산하는 공학 도구입니다. 산업 현장의 저장 용량 산정에 필수적으로 쓰입니다.',
            'The Tank Volume Calculator is an engineering tool that accurately computes the volume of various tank shapes — cylindrical, rectangular, elliptical and conical — which is essential for storage-capacity sizing in industry.',
          )}
        </p>
        <p>
          {L(
            '수처리 시설, 화학 공장, 석유 저장소, 농업용 저수조 등에서 탱크 부피를 설계·검증할 때 사용됩니다. 표면적을 함께 구해 도장이나 단열재 소요량을 산정하는 용도로도 유용합니다.',
            'It is used to design and verify tank volumes in water treatment, chemical plants, fuel storage and agricultural reservoirs. Computing surface area alongside volume also helps estimate paint or insulation requirements.',
          )}
        </p>
        <p>
          {L(
            '탱크 형태에 따라 서로 다른 수학 공식이 적용되며, 미터법(m, mm)과 야드파운드법(ft, in) 단위를 선택할 수 있습니다. 채움 높이를 지정하면 그 높이까지의 부분 충전 부피도 계산할 수 있어 실무 활용도가 높습니다.',
            'Different mathematical formulas apply per shape, and you can choose metric (m, mm) or imperial (ft, in) units. Specifying a fill height also yields the partially filled volume up to that level, which is very practical.',
          )}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L(
            '탱크 설계에서 정확한 부피 계산은 비용 효율성과 안전성에 직결됩니다. 과소 계산은 저장 용량 부족, 과대 계산은 불필요한 비용을 초래하므로 정확한 데이터를 바탕으로 설계하세요.',
            'Accurate volume calculation directly affects cost efficiency and safety. Underestimating leads to insufficient capacity, while overestimating causes unnecessary cost — design on accurate data.',
          )}
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">
            {L('원통형 탱크 (수직)', 'Cylindrical Tank (Vertical)')}
          </h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center font-mono text-lg">V = π × r² × h</p>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><strong className="font-semibold">V</strong> — {L('부피 [m³ 또는 L 등]', 'Volume [m³ or L, etc.]')}</li>
            <li><strong className="font-semibold">π</strong> — {L('원주율 (≈ 3.14159)', 'Pi (≈ 3.14159)')}</li>
            <li><strong className="font-semibold">r</strong> — {L('반지름 (지름 ÷ 2)', 'Radius (Diameter ÷ 2)')}</li>
            <li><strong className="font-semibold">h</strong> — {L('높이', 'Height')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">
            {L('직사각형 탱크', 'Rectangular Tank')}
          </h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center font-mono text-lg">V = Length × Width × Height</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">
            {L('원추형 탱크', 'Conical Tank')}
          </h4>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-center font-mono text-lg">V = (1/3) × π × r² × h</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('부분 충전과 단위', 'Partial fill & units')}</h4>
          <p className="text-sm">
            {L(
              '채움 높이를 입력하면 해당 높이까지의 부피를 구합니다. 수평 원통의 경우 원형 세그먼트 적분 공식을 사용하며, 단위계(Metric/Imperial)에 맞춰 m³↔ft³, L↔gal로 변환됩니다.',
              'Entering a fill height returns the volume up to that level. Horizontal cylinders use circular-segment integration, and units convert between m³↔ft³ and L↔gal per the selected system.',
            )}
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('탱크 유형 선택 가이드', 'Tank Type Selection Guide')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>{L('수직 원통형:', 'Vertical Cylindrical:')}</strong> {L('가장 일반적이며 고압을 견디기 좋음', 'Most common; withstands high pressure well')}</li>
            <li><strong>{L('수평 원통형:', 'Horizontal Cylindrical:')}</strong> {L('높이 제한이 있는 장소에 적합', 'Good where height is restricted')}</li>
            <li><strong>{L('직사각형:', 'Rectangular:')}</strong> {L('맞춤형 설치 공간에 유리', 'Advantageous for custom installation spaces')}</li>
            <li><strong>{L('원추형 바닥:', 'Cone Bottom:')}</strong> {L('침전물 배출이 필요할 때 적합', 'Suitable when sediment discharge is needed')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('부피 단위 변환', 'Volume Unit Conversion')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>1 m³</strong> = {L('1,000 리터(L)', '1,000 Liters (L)')}</li>
            <li><strong>1 Liter</strong> = {L('0.001 m³', '0.001 m³')}</li>
            <li><strong>1 gal (US)</strong> ≈ {L('0.003785 m³', '0.003785 m³')}</li>
          </ul>
        </div>
        <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
          <p className="font-bold text-sm">⚠️ {L('주의사항', 'Precautions')}</p>
          <p className="text-xs mt-1">
            {L(
              '실제 제작 시에는 벽두께, 용접 이음새, 열팽창 등을 고려해 계산 부피의 5~10%를 여유분으로 추가하는 것이 좋습니다.',
              'When actually manufacturing a tank, add about 5–10% of the calculated volume as margin for wall thickness, weld seams, thermal expansion, etc.',
            )}
          </p>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('실생활 적용 사례', 'Real-life Application Examples')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li><strong>{L('수처리 시설:', 'Water Treatment Facilities:')}</strong> {L('급·하수 처리 저장조 설계', 'Design of supply/sewage storage tanks')}</li>
            <li><strong>{L('화학 공장:', 'Chemical Plants:')}</strong> {L('원자재·완제품 저장 탱크 용량 산정', 'Raw/finished product tank capacity')}</li>
            <li><strong>{L('농업:', 'Agriculture:')}</strong> {L('관개 저수조·비료 탱크 설계', 'Irrigation/fertilizer tank design')}</li>
            <li><strong>{L('연료 저장:', 'Fuel Storage:')}</strong> {L('휘발유·경유 등 저장 시설', 'Gasoline/diesel storage facilities')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorLayout
      title={t.title}
      description={t.description}
      icon={<span>🛢️</span>}
      visualizationComponent={<></>}
      resultComponent={<TankCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
