'use client';

import React, { useState, useCallback } from 'react';
import PumpPowerCalculator from '@/components/engineering-calculator/PumpPowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>펌프 동력 계산기</strong>는 펌프 시스템의 축 동력과 모터 동력을 정확하게 계산하는 공학 도구입니다. 유체 이송에 필요한 에너지양을 산정하여 적절한 펌프와 모터를 선정하는 데 필수적인 계산을 수행합니다.
      </p>
      <p>
        펌프 동력 계산은 <strong>유량</strong>, <strong>양정</strong>, <strong>유체 밀도</strong>, <strong>펌프 효율</strong>, <strong>모터 효율</strong> 등의 변수를 기반으로 합니다. 정확한 동력 계산은 과소 설계로 인한 성능 부족과 과대 설계로 인한 비용 낭비를 모두 방지합니다.
      </p>
      <p>
        이 계산기는 축 동력(펌프가 유체를 이송하는 데 필요한 실제 동력)과 모터 동력(펌프를 구동하는 데 필요한 총 동력을 계산하며, 각 단계에서의 에너지 손실을 정확히 반영합니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        산업 현장에서 펌프 시스템을 설계할 때 정확한 동력 계산은 에너지 효율성과 운전 비용에 직접적인 영향을 미칩니다. 과소 설계된 펌프는 요구 성능을 충족하지 못하고, 과대 설계된 펌프는 불필요한 전력 소비와 높은 초기 비용을 초래합니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">축 동력 (Shaft Power)</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">Pshaft = (ρ × g × H × Q) / (ηp × 1000)</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong className="font-semibold">ρ</strong>: 유체 밀도 (kg/m³)</li>
          <li><strong className="font-semibold">g</strong>: 중력 가속도 (9.81 m/s²)</li>
          <li><strong className="font-semibold">H</strong>: 양정 (m)</li>
          <li><strong className="font-semibold">Q</strong>: 유량 (m³/s)</li>
          <li><strong className="font-semibold">ηp</strong>: 펌프 효율 (소수점)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">모터 동력 (Motor Power)</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">Pmotor = Pshaft / ηm</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong className="font-semibold">ηm</strong>: 모터 효율 (소수점)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">계산 예시</h4>
        <p>유량 300m³/h, 양정 100m, 물(밀도 1000kg/m³), 펌프효율 70%, 모터효율 90%인 경우:</p>
        <ol className="list-decimal list-inside mt-2 space-y-1 p-4 bg-muted rounded-lg">
          <li>유량 변환: 300m³/h = 0.0833m³/s</li>
          <li>축 동력: (1000 × 9.81 × 100 × 0.0833) / (0.70 × 1000) = 116.7 kW</li>
          <li>모터 동력: 116.7 / 0.90 = 129.7 kW</li>
        </ol>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">효율 향상 방법</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>적절한 펌프 선정:</strong> 운전 포인트에 가장 가까운 효율 영역에서 운전되는 펌프를 선택합니다.</li>
          <li><strong>변속 구동(VFD):</strong> 유량 조절이 필요할 때 밸브 개도보다 변속 구동이 에너지 효율적입니다.</li>
          <li><strong>관로 최적화:</strong> 불필요한 피팅과 길이를 줄여 마찰 손실을 최소화합니다.</li>
          <li><strong>정기 보수:</strong> 임펠러 마모, 씰 마모 등을 점검하여 효율 저하를 방지합니다.</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 모터 과부하 방지</p>
        <p className="text-xs mt-1">
          계산된 모터 동력에 안전 계수(일반적으로 10~20%)를 추가하여 모터를 선정합니다. 또한, 시동 시 과전류가 발생할 수 있으므로 과부하 보호 장치를 반드시 설치해야 합니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">공통 유체 밀도 참고</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>물:</strong> 1000 kg/m³ (20°C)</li>
          <li><strong>에탄올:</strong> 789 kg/m³</li>
          <li><strong>엔진 오일:</strong> 870~920 kg/m³</li>
          <li><strong>혼합 슬러리:</strong> 1100~1600 kg/m³ (농도에 따라 변동)</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">설계 시 고려사항</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>시동 전력:</strong> 높은 관성 하중의 경우 시동 전력이 정격의 3~7배 필요</li>
          <li><strong>역전 방지:</strong> 정전 시 역류를 방지하는 밸브 및 장치 설치</li>
          <li><strong>진동 방지:</strong> 진동 측정 및 방지 장치 적용</li>
          <li><strong>여유 용량:</strong> 향후 증가 가능한 유량을 고려한 설계</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">적용 분야</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>수처리:</strong> 급수, 배수, 순환 펌프 시스템</li>
          <li><strong>화학 공정:</strong> 반응물 이송, 냉각수 순환</li>
          <li><strong>에너지:</strong> 보일러 급수, 냉각수 순환</li>
          <li><strong>식품:</strong> 원료 이송, CIP(Clean-In-Place) 시스템</li>
        </ul>
      </div>
    </div>
  ),
};

export default function PumpPowerCalculatorPage() {
  return (
    <CalculatorLayout
      title="펌프 동력 계산기"
      description="펌프의 동력을 계산합니다."
      icon={<span>⚡</span>}
      visualizationComponent={<></>}
      resultComponent={
        <PumpPowerCalculator
          onCalculate={(result) => {
            console.log('Pump power calculation result:', result);
          }}
          setCalculationExplanation={(explanation) => {
            console.log('Calculation explanation:', explanation);
          }}
        />
      }
      infoSection={infoSection}
    >
      <></>
    </CalculatorLayout>
  );
}
