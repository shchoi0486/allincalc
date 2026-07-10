'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>재료 물성 비교 도구</strong>는 다양한 공학 재료의 물리적, 기계적, 열적, 전기적 특성을 체계적으로 비교 분석하는 종합 데이터베이스입니다. 금속, 합금, 세라믹, 고분자 등 광범위한 재료군에 대한 상세한 물성 데이터를 제공합니다.
      </p>
      <p>
        재료 선택은 모든 공학 설계의 시작점입니다. 적절한 재료 선택은 제품의 성능, 안전성, 비용 효율성에 직접적인 영향을 미칩니다. 이 도구는 재료의 밀도, 인장강도, 탄성계수, 열전도도, 전기전도도 등 핵심 물성을 한눈에 비교할 수 있게 해줍니다.
      </p>
      <p>
        특히 동일 카테고리 내의 유사 재료들을 비교할 때 매우 유용합니다. 예를 들어, 304 스테인리스와 316 스테인리스의 내식성 차이, 알루미늄 합금 간의 강도 대비 무게 비교 등 실질적인 재료 선택에 필요한 정보를 제공합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        이 도구는 제조업, 건설업, 항공우주, 자동차, 전자 등 다양한 산업 분야의 엔지니어와 디자이너에게 유용합니다. 또한 공학도들에게는 재료 과학의 기본 개념을 이해하는 데 도움이 되는 교육 자료로서의 가치도 가지고 있습니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">핵심 물성 지표</h4>
        <div className="p-4 bg-muted rounded-lg space-y-2">
          <div><strong>밀도 (Density):</strong> ρ = m/V (질량/부피), 단위: kg/m³ 또는 g/cm³</div>
          <div><strong>인장강도 (UTS):</strong> 재료가 파단까지 견딜 수 있는 최대 응력, 단위: MPa</div>
          <div><strong>항복강도:</strong> 영구 변형이 시작되는 응력, 단위: MPa</div>
          <div><strong>탄성계수:</strong> 탄성 영역에서의 응력-변형률 비율, 단위: GPa</div>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">비강도 (Strength-to-Weight Ratio)</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">비강도 = 인장강도 / 밀도</p>
        </div>
        <p className="mt-2 text-sm">가벼우면서 강한 재료를 평가할 때 중요한 지표입니다. 항공우주, 자동차 분야에서 특히 중요합니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">재료 선택 기준</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>기계적 하중:</strong> 예상 응력에 충분한 강도와 피로 강도 확보</li>
          <li><strong>온도 조건:</strong> 최대/최소 작동 온도에서의 물성 유지</li>
          <li><strong>내식성:</strong> 작동 환경에서의 부식 저항성</li>
          <li><strong>가공성:</strong> 절�기, 용접, 성형 등 제작 공정의 용이성</li>
          <li><strong>비용:</strong> 원자재비, 가공비, 유지보수비를 종합 고려</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 주의사항</p>
        <p className="text-xs mt-1">
          데이터베이스의 물성값은 일반적인 참고용이며, 실제 재료는 제조 공정, 열처리 조건, 합금 원소 함량 등에 따라 물성이 달라질 수 있습니다. 중요한 설계에서는 반드시 실제 시험 데이터를 확인하시기 바랍니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">주요 합금 시리즈</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>2xxx 계열:</strong> Al-Cu 합금, 높은 강도 (항공기 구조물)</li>
          <li><strong>5xxx 계열:</strong> Al-Mg 합금, 우수한 내식성 (선박, 차량)</li>
          <li><strong>6xxx 계열:</strong> Al-Mg-Si 합금, 균형 잡힌 성질 (건축, 자동차)</li>
          <li><strong>7xxx 계열:</strong> Al-Zn 합금, 최고 강도 (항공기, 스포츠 장비)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">열처리 효과</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>용체화 열처리:</strong> 합금 원소를 균일하게 용해시켜 강도 향상</li>
          <li><strong>시효 경화:</strong> 시간에 따른 미세 석출물 형성으로 경도 증가</li>
          <li><strong>소성 가공:</strong> 변형에 의한 결정립 미세화로 강도 향상</li>
          <li><strong>냉간 가공:</strong> 상온에서의 변형으로 경도 및 강도 증가</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">적용 분야별 권장 재료</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>항공우주:</strong> Ti-6Al-4V, Al 7075-T6, Inconel 718</li>
          <li><strong>자동차:</strong> DP강, 알루미늄 6061, 마그네슘 AZ91</li>
          <li><strong>화학 설비:</strong> 316L 스테인리스, Hastelloy C-276</li>
          <li><strong>건축:</strong> SM400, 알루미늄 6063, 구리</li>
        </ul>
      </div>
    </div>
  ),
};

export default function PropertyPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">재료 물성 비교</h1>
        <p className="text-muted-foreground mt-2">다양한 공학 재료의 물성을 비교 분석합니다.</p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-foreground">계산기 설명</h3>
          <div className="text-muted-foreground">
            {infoSection.calculatorDescription}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-foreground">물성 지표</h3>
          <div className="text-muted-foreground">
            {infoSection.calculationFormula}
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-foreground">유용한 팁</h3>
          <div className="text-muted-foreground">
            {infoSection.usefulTips}
          </div>
        </div>
      </div>
    </div>
  );
}