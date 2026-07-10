'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const BMRCalculator = () => {
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: { level: string; multiplier: number; calories: number }[];
  } | null>(null);

  const activityLevels = [
    { level: '좌식 생활 (운동 없음)', multiplier: 1.2 },
    { level: '가벼운 활동 (주 1-3일)', multiplier: 1.375 },
    { level: '보통 활동 (주 3-5일)', multiplier: 1.55 },
    { level: '적극적 활동 (주 6-7일)', multiplier: 1.725 },
    { level: '매우 적극적 (매일 2회+)', multiplier: 1.9 },
  ];

  const calculateBMR = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(a) || isNaN(h) || isNaN(w) || a <= 0 || h <= 0 || w <= 0) {
      alert('모든 값을 정확히 입력해주세요.');
      return;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const tdee = activityLevels.map(({ level, multiplier }) => ({
      level,
      multiplier,
      calories: parseFloat((bmr * multiplier).toFixed(0)),
    }));

    setResult({ bmr: parseFloat(bmr.toFixed(0)), tdee });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">성별:</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">남성</SelectItem>
            <SelectItem value="female">여성</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">나이 (세):</label>
        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="예: 30" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">키 (cm):</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="예: 175" />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">체중 (kg):</label>
        <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 70" />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateBMR}>계산하기</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>초기화</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>기초대사량 (BMR):</span>
            <strong className="text-2xl">{result.bmr} kcal</strong>
          </div>
          <div className="mt-4">
            <p className="font-semibold mb-2 text-sm">활동 수준별 일일 에너지 소비량 (TDEE)</p>
            <div className="space-y-2">
              {result.tdee.map((item) => (
                <div key={item.multiplier} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                  <span className="text-muted-foreground">{item.level} (×{item.multiplier})</span>
                  <strong>{item.calories} kcal</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          하루 동안 내 몸이 소비하는 에너지를 계산하세요!
        </p>
        <p>
          기초대사량(BMR, Basal Metabolic Rate)은 우리 몸이 생명을 유지하는 데 필요한 최소한의 에너지입니다.
          심장 박동, 호흡, 체온 유지, 세포 재생 등 무의식적으로 일어나는 모든 신체 기능에 사용되는 에너지로,
          이 수치를 알면 하루에 필요한 적절한 칼로리 섭취량을 과학적으로 계획할 수 있습니다.
        </p>
        <p>
          BMR에 일상적인 활동량을 반영한 활동 계수를 곱하면 총 에너지 소비량(TDEE)을 구할 수 있습니다.
          TDEE를 기준으로 체중 유지, 감량, 증량 등의 식단 계획을 세울 수 있어 다이어트나 근육량 증가 목표에 활용됩니다.
        </p>
        <p>
          본 계산기는 현재 가장 정확하다고 인정받는 Mifflin-St Jeor 공식을 사용하며,
          성별, 나이, 키, 체중을 입력하면 활동 수준에 따른 TDEE까지 한 번에 계산해 줍니다.
          직장인, 학생, 운동을 시작하려는 분 등 누구나 활용할 수 있는 필수 건강 도구입니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Mifflin-St Jeor 공식과 TDEE 계산</h3>
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">1단계: 기초대사량 (BMR) 계산</p>
            <p className="text-xs mt-1 mb-2 text-muted-foreground">
              Mifflin-St Jeor 공식은 현대 영양학에서 가장 정확도가 높은 BMR 추정 공식으로 널리 사용됩니다.
            </p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              남성: BMR = 10 × 체중(kg) + 6.25 × 키(cm) - 5 × 나이(세) + 5
            </code>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              여성: BMR = 10 × 체중(kg) + 6.25 × 키(cm) - 5 × 나이(세) - 161
            </code>
          </div>
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">2단계: 총 에너지 소비량 (TDEE) 계산</p>
            <p className="text-xs mt-1 mb-2 text-muted-foreground">TDEE = BMR × 활동 계수</p>
            <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
              <li><strong>1.2:</strong> 좌식 생활 (거의 운동 안 함)</li>
              <li><strong>1.375:</strong> 가벼운 활동 (주 1~3회)</li>
              <li><strong>1.55:</strong> 보통 활동 (주 3~5회)</li>
              <li><strong>1.725:</strong> 적극적 활동 (주 6~7회)</li>
              <li><strong>1.9:</strong> 매우 적극적 (매일 2회 이상)</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 기초대사량 활용 핵심 팁</h3>
        <div className="space-y-4">
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">1. 근력 운동으로 BMR을 높이세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              근육량이 많을수록 기초대사량이 높아집니다. 규칙적인 근력 운동으로 골격근을 늘리면
              휴식 상태에서도 더 많은 칼로리를 소모하여 체중 관리에 유리해집니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">2. BMR 이하로 섭취하지 마세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              BMR 이하로 칼로리를 섭취하면 신체가 대사율을 낮추어 오히려 체중 감량이 어려워질 수 있습니다.
              건강한 감량을 위해서는 TDEE에서 300~500kcal를 줄인 수준이 적절합니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">3. 활동 계수를 현실적으로 선택하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              실제로 운동을 하지 않으면서 높은 활동 계수를 선택하면 TDEE가 과대 계산되어
              의도치 않게 과식하는 결과로 이어질 수 있으니 본인의 실제 활동 수준에 맞게 선택하세요.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">4. 나이에 따른 대사 변화를 인지하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              30대 이후부터 매 10년마다 BMR은 약 3~5%씩 낮아지는 경향이 있습니다.
              나이에 맞는 운동과 식단 조절이 장기적 건강 유지에 필수적입니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">5. 다이어트 정체기 극복에 활용하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              다이어트 정체기는 신체가 새로운 대사율에 적응하는 과정에서 발생합니다.
              이때 BMR과 TDEE를 재계산하여 현재에 맞는 식단을 조정하면 정체기를 극복하는 데 도움이 됩니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">6. 단백질 섭취를 충분히 하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              다이어트 중 근육량 유지를 위해 체중 1kg당 1.2~1.6g의 단백질 섭취를 권장합니다.
              단백질은 소화过程中额外卡路里消耗이 크고 포만감을 높여줍니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">7. 정기적으로 재계산하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              체중이나 활동 수준이 변할 때마다 BMR과 TDEE를 다시 계산하여 식단 계획을 업데이트하는 것이 효과적입니다.
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="기초대사량 계산기"
      description="Mifflin-St Jeor 공식으로 기초대사량(BMR)과 활동 수준별 일일 에너지 소비량(TDEE)을 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default BMRCalculator;
