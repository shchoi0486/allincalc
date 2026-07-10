'use client';

import React, { useState, useCallback } from 'react';
import PumpPowerCalculator from '@/components/engineering-calculator/PumpPowerCalculator';
import CalculatorLayout from '@/components/engineering-calculator/CalculatorLayout';

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
    >
      <></>
    </CalculatorLayout>
  );
}
