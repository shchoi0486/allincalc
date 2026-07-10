'use client';

import React from 'react';
import NPSHCalculator from '@/components/engineering-calculator/NPSHCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>NPSH(순흡입수두) 계산기</strong>는 펌프 설계 및 선정 시 필수적인 순흡입수두(Net Positive Suction Head)를 계산하는 공학 도구입니다. NPSH은 펌프 입구에서 유체가 캐비테이션 없이 안정적으로 흡입될 수 있는 압력 수두를 나타내며, 펌프의 안전한 운전을 위해 반드시 고려해야 합니다.
      </p>
      <p>
        <strong>캐비테이션</strong>은 유체의 압력이 증기압 이하로 떨어질 때 발생하는 기포 형성 현상입니다. 캐비테이션이 발생하면 펌프의 효율이 급격히 떨어지고, 임펠러와 케이싱에 물리적 손상을 일으켜 펌프 수명을 크게 단축시킵니다.
      </p>
      <p>
        이 계산기는 NPSHa(가용 순흡입수두)와 NPSHr(필요 순흡입수두)를 비교하여 펌프의 캐비테이션 안전 마진을 평가합니다. 다양한 유체(물, 에탄올, 메탄올 등)와 operating 조건에서 정확한 계산을 제공합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        산업 현장에서 펌프 시스템을 설계하거나 기존 시스템의 문제를 진단할 때 NPSH 계산은 매우 중요합니다. 특히 흡입 높이가 크거나 고온의 유체를 취급하는 경우 정확한 NPSH 계산이 필수적입니다. 이 계산기를 통해 펌프 시스템의 안정성과 효율성을 확보하시기 바랍니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">NPSHa (가용 순흡입수두)</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">NPSHa = Ps/ρg + Vs²/2g - Pv/ρg ± Hs</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong className="font-semibold">Ps</strong>: 흡입 측 절대 압력 (Pa)</li>
          <li><strong className="font-semibold">ρ</strong>: 유체 밀도 (kg/m³)</li>
          <li><strong className="font-semibold">g</strong>: 중력 가속도 (9.81 m/s²)</li>
          <li><strong className="font-semibold">Vs</strong>: 흡입관 내 유속 (m/s)</li>
          <li><strong className="font-semibold">Pv</strong>: 유체의 증기압 (Pa)</li>
          <li><strong className="font-semibold">Hs</strong>: 흡입 수두 (positive = below pump, negative = above pump)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">캐비테이션 방지 조건</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">NPSHa ≥ NPSHr + 안전 마진</p>
        </div>
        <p className="mt-2 text-sm">일반적으로 안전 마진은 최소 0.5m 이상 또는 NPSHr의 10~20%를 추가합니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">캐비테이션 예방 요령</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>흡입 높이 최소화:</strong> 펌프 입구 높이와 유체 수면 높이의 차이를 최소화합니다.</li>
          <li><strong>흡입관 직경 확대:</strong> 유속을 줄여 마찰 손실을 감소시킵니다.</li>
          <li><strong>온도 관리:</strong> 유체 온도가 높으면 증기압이 상승하므로 주의합니다.</li>
          <li><strong>여과기 청소:</strong> 흡입관의 막힘을 방지하여 압력 강하를 줄입니다.</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 캐비테이션 징후</p>
        <p className="text-xs mt-1">
          캐비테이션이 발생하면 이상 소음(자갈이 돌아가는 듯한 소리), 진동 증가, 유량 감소, 임펠러 손상 등의 증상이 나타납니다. 이러한 징후가 발견되면 즉시 운전 조건을 점검해야 합니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">유체별 증기압 참고</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>물 (20°C):</strong> 약 2.34 kPa</li>
          <li><strong>에탄올 (20°C):</strong> 약 5.95 kPa</li>
          <li><strong>메탄올 (20°C):</strong> 약 12.8 kPa</li>
          <li><strong>가솔린 (20°C):</strong> 약 40~80 kPa (성분에 따라 변동)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">펌프 시스템 설계 체크리스트</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>정지 흡입 고도:</strong> 최대 작동 수위에서의 흡입 고도 확인</li>
          <li><strong>마찰 손실:</strong> 흡입관, 피팅, 밸브의 마찰 손실 계산</li>
          <li><strong>안전 계수:</strong> 제조사 NPSHr에 충분한 여유 확보</li>
          <li><strong>시동 조건:</strong> 최대 온도에서의 시동 시 NPSH 확인</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">적용 분야</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>화학 공정:</strong> 반응물 및 용매 이송 펌프 설계</li>
          <li><strong>수처리:</strong> 급수, 배수 시스템의 펌프 선정</li>
          <li><strong>석유화학:</strong> 원유 정제 공정의 펌프 시스템</li>
          <li><strong>식품:</strong> 위생적 펌프 시스템 설계</li>
        </ul>
      </div>
    </div>
  ),
};

export default function NPSHCalculatorPage() {
  return (
    <CalculatorLayout
      title="NPSH 계산기"
      description="펌프의 순흡입수두/Net Positive Suction Head를 계산합니다."
      icon={<span>💧</span>}
      visualizationComponent={<></>}
      resultComponent={<NPSHCalculator />}
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}