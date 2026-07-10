'use client';

import React from 'react';
import TankCalculator from '@/components/engineering-calculator/TankCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>Tank 부피 계산기</strong>는 다양한 형태의 탱크와 저장 시설의 부피를 정확하게 계산하는 공학 도구입니다. 원통형, 직사각형, 타원형, 원추형 등 다양한 탱크 유형을 지원하며, 산업 현장에서 필수적인 저장 용량 계산에 활용됩니다.
      </p>
      <p>
        이 계산기는 수처리 시설, 화학 공장, 석유 저장 시설, 농업용 저수조 등 다양한 산업 분야에서 탱크의 부피를 설계하거나 검증할 때 사용됩니다. 또한, 탱크의 표면적을 함께 계산하여 도장이나 절연 재료의 양을 산정하는 데도 유용합니다.
      </p>
      <p>
        탱크의 형태에 따라 서로 다른 수학 공식을 적용하며, 사용자는 미터(m)와 밀리미터(mm) 단위를 선택하여 계산할 수 있습니다. 원하는 채움 높이를 지정하면 해당 높이까지의 부피도 계산할 수 있어, 실용적인 활용이 가능합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        탱크 설계 시 정확한 부피 계산은 비용 효율성과 안전성에 직접적인 영향을 미칩니다. 과소 계산하면 저장 용량이 부족하고, 과대 계산하면 불필요한 비용이 발생합니다. 이 계산기를 통해 정확한 데이터를 기반으로 최적의 탱크 설계를 진행하시기 바랍니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">원통형 탱크 (수직)</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">V = π × r² × h</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong className="font-semibold">V</strong>: 부피, 단위는 m³ 또는 L</li>
          <li><strong className="font-semibold">π</strong>: 원주율 (≈ 3.14159)</li>
          <li><strong className="font-semibold">r</strong>: 반지름 (지름 ÷ 2)</li>
          <li><strong className="font-semibold">h</strong>: 높이</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">직사각형 탱크</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">V = 길이 × 너비 × 높이</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">원추형 탱크</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">V = (1/3) × π × r² × h</p>
        </div>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">탱크 유형 선택 가이드</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>수직 원통형:</strong> 가장 일반적인 형태로, 높은 압력을 견딜 수 있음</li>
          <li><strong>수평 원통형:</strong> 높이 제한이 있는 장소에 적합</li>
          <li><strong>직사각형:</strong> 맞춤형 설치 공간이 필요할 때 유리</li>
          <li><strong>원추형 바닥:</strong> 침전물 배출이 필요한 경우에 적합</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">부피 단위 변환</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>1 m³</strong> = 1,000 리터(L)</li>
          <li><strong>1 리터</strong> = 0.001 m³</li>
          <li><strong>1 gal(미국)</strong> ≈ 0.003785 m³</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 주의사항</p>
        <p className="text-xs mt-1">
          실제 탱크 제작 시에는 벽두께, 용접 이음새, 열팽창 등을 고려하여 여유 용량을 설계하는 것이 좋습니다. 일반적으로 계산된 부피의 5~10%를 여유분으로 추가합니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>수처리 시설:</strong> 급수, 하수 처리 시설의 저장조 설계</li>
          <li><strong>화학 공장:</strong> 원자재 및 완제품 저장 탱크 용량 산정</li>
          <li><strong>농업:</strong> 관개용 저수조, 비료 저장 탱크 설계</li>
          <li><strong>연료 저장:</strong> 가솔린, 디젤 등 연료 저장 시설 설계</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">설계 시 고려사항</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>지반 조건:</strong> 탱크 무게에 대한 지반의 지지력 확인</li>
          <li><strong>바람 하중:</strong> 높은 탱크의 경우 바람에 의한 안정성 검토</li>
          <li><strong>지진 하중:</strong> 지진 발생 지역에서는 내진 설계 필요</li>
          <li><strong>부식 방지:</strong> 저장 물질에 따른 적절한 내부 코팅 적용</li>
        </ul>
      </div>
    </div>
  ),
};

export default function TankCalculatorPage() {
  return (
    <CalculatorLayout
      title="Tank 부피 계산기"
      description="원통형 탱크의 부피와 무게를 계산합니다."
      icon={<span>🛢️</span>}
      visualizationComponent={<></>}
      resultComponent={<TankCalculator />}
      infoSection={infoSection}
    >
      {/* children 속성에 빈 프래그먼트를 명시적으로 전달합니다. */}
      <></>
    </CalculatorLayout>
  );
}