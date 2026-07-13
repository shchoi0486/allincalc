'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

const CalorieCalculator = () => {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    loss: number;
    maintain: number;
    gain: number;
  } | null>(null);

  const activityLevels = [
    { value: 'sedentary', label: isKo ? '좌식 생활 (거의 운동 안 함)' : 'Sedentary (little or no exercise)', multiplier: 1.2 },
    { value: 'light', label: isKo ? '가벼운 활동 (주 1~3회)' : 'Light activity (1-3 times/week)', multiplier: 1.375 },
    { value: 'moderate', label: isKo ? '보통 활동 (주 3~5회)' : 'Moderate activity (3-5 times/week)', multiplier: 1.55 },
    { value: 'active', label: isKo ? '적극적 활동 (주 6~7회)' : 'Active (6-7 times/week)', multiplier: 1.725 },
    { value: 'very-active', label: isKo ? '매우 적극적 (매일 2회 이상)' : 'Very active (2+ times/day)', multiplier: 1.9 },
  ];

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(a) || isNaN(h) || isNaN(w) || a <= 0 || h <= 0 || w <= 0) {
      alert(isKo ? '모든 값을 올바르게 입력해주세요.' : 'Please enter all values correctly.');
      return;
    }

    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }

    const activity = activityLevels.find((l) => l.value === activityLevel);
    const multiplier = activity ? activity.multiplier : 1.2;
    const tdee = bmr * multiplier;

    setResult({
      bmr: parseFloat(bmr.toFixed(0)),
      tdee: parseFloat(tdee.toFixed(0)),
      loss: parseFloat((tdee - 500).toFixed(0)),
      maintain: parseFloat(tdee.toFixed(0)),
      gain: parseFloat((tdee + 500).toFixed(0)),
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '성별' : 'Gender'}:</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{isKo ? '남성' : 'Male'}</SelectItem>
            <SelectItem value="female">{isKo ? '여성' : 'Female'}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '나이' : 'Age'}:</label>
        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder={isKo ? '예: 30' : 'e.g. 30'} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '키 (cm)' : 'Height (cm)'}:</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={isKo ? '예: 170' : 'e.g. 170'} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '체중 (kg)' : 'Weight (kg)'}:</label>
        <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={isKo ? '예: 70' : 'e.g. 70'} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '활동 수준' : 'Activity Level'}:</label>
        <Select value={activityLevel} onValueChange={setActivityLevel}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {activityLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculate}>{isKo ? '계산' : 'Calculate'}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{isKo ? '초기화' : 'Reset'}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result ? (
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">{isKo ? '기초대사량 (BMR)' : 'Basal Metabolic Rate (BMR)'}</p>
            <p className="text-2xl font-bold">{result.bmr} kcal</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">{isKo ? '일일 총 에너지 소비량 (TDEE)' : 'Total Daily Energy Expenditure (TDEE)'}</p>
            <p className="text-2xl font-bold text-primary">{result.tdee} kcal</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-sm">{isKo ? '권장 칼로리 섭취량' : 'Recommended Calorie Intake'}</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground">{isKo ? '감량' : 'Weight Loss'}</p>
                <p className="font-bold text-blue-600 dark:text-blue-400">{result.loss}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground">{isKo ? '유지' : 'Maintain'}</p>
                <p className="font-bold text-green-600 dark:text-green-400">{result.maintain}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-xs text-muted-foreground">{isKo ? '증량' : 'Weight Gain'}</p>
                <p className="font-bold text-orange-600 dark:text-orange-400">{result.gain}</p>
                <p className="text-xs text-muted-foreground">kcal/day</p>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isKo ? '* 감량: TDEE - 500kcal | 유지: TDEE | 증량: TDEE + 500kcal' : '* Loss: TDEE - 500kcal | Maintain: TDEE | Gain: TDEE + 500kcal'}
          </p>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {isKo ? '값을 입력하고 계산 버튼을 눌러주세요.' : 'Enter values and click Calculate.'}
        </div>
      )}
    </div>
  );

  const infoSection = isKo ? (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            하루 동안 내 몸이 소비하는 에너지를 계산하세요!
          </p>
          <p>
            칼로리 계산기는 Mifflin-St Jeor 공식을 기반으로 기초대사량(BMR)과 일일 총 에너지 소비량(TDEE)을 계산합니다.
            BMR은 신체가 생명을 유지하기 위해 무의식적으로 소비하는 최소 에너지이며,
            TDEE는 여기에 활동 수준을 반영한 실제 하루 총 에너지 소비량입니다.
          </p>
          <p>
            TDEE를 기준으로 체중 유지, 감량, 증량 등의 식단 계획을 세울 수 있어
            다이어트, 근육량 증가, 건강 관리 목표에 활용됩니다.
          </p>
          <p>
            한국 영양학회 기준에 따라 활동 수준에 따른 적절한 칼로리 섭취량을 안내하며,
            직장인, 학생, 운동을 시작하려는 분 등 누구나 활용할 수 있는 필수 건강 도구입니다.
          </p>
          <TermGlossary items={[
            { term: '기초대사량 (BMR)', desc: '생명 유지를 위해 심장 박동, 호흡, 세포 재생 등에 쓰이는 최소 에너지 소비량입니다. 휴식 상태에서 소모되는 칼로리로 식단 계획의 기준점이 됩니다.' },
            { term: '총 에너지 소비량 (TDEE)', desc: '기초대사량에 일상 활동과 운동량을 반영한 활동 계수를 곱해 구하는 하루 총 칼로리 소비량입니다. 체중 유지·감량 목표에 활용됩니다.' },
            { term: 'Mifflin-St Jeor 공식', desc: '성별, 나이, 키, 체중을 변수로 기초대사량을 추정하는 공식으로, 현대 영양학에서 가장 정확도가 높은 BMR 산출 방식으로 널리 쓰입니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Mifflin-St Jeor 공식과 TDEE 계산</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">1단계: 기초대사량 (BMR) 계산</p>
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
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">3단계: 목표별 권장 칼로리</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>감량:</strong> TDEE - 500kcal (주 0.5kg 감량 목표)</li>
                <li><strong>유지:</strong> TDEE (현재 체중 유지)</li>
                <li><strong>증량:</strong> TDEE + 500kcal (주 0.5kg 증가 목표)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">칼로리 계산기 활용 핵심 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. BMR 이하로 섭취하지 마세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                BMR 이하로 칼로리를 섭취하면 신체가 대사율을 낮추어 오히려 체중 감량이 어려워질 수 있습니다.
                건강한 감량을 위해서는 TDEE에서 300~500kcal를 줄인 수준이 적절합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 활동 계수를 현실적으로 선택하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                실제로 운동을 하지 않으면서 높은 활동 계수를 선택하면 TDEE가 과대 계산되어
                의도치 않게 과식하는 결과로 이어질 수 있으니 본인의 실제 활동 수준에 맞게 선택하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 근력 운동으로 BMR을 높이세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                근육량이 많을수록 기초대사량이 높아집니다. 규칙적인 근력 운동으로 골격근을 늘리면
                휴식 상태에서도 더 많은 칼로리를 소모하여 체중 관리에 유리해집니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 단백질 섭취를 충분히 하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                다이어트 중 근육량 유지를 위해 체중 1kg당 1.2~1.6g의 단백질 섭취를 권장합니다.
                단백질은 소화 과정에서 에너지 소비가 크고 포만감을 높여줍니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 정기적으로 재계산하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                체중이나 활동 수준이 변할 때마다 BMR과 TDEE를 다시 계산하여 식단 계획을 업데이트하는 것이 효과적입니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. 한국인 식단 기준을 참고하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                한국 영양학회에서 권장하는 1일 영양소 기준에 맞추어 균형 잡힌 식단을 구성하세요.
                탄수화물 50~65%, 단백질 7~20%, 지방 15~30%의 비율이 적절합니다.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  ) : (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            Calculate the energy your body burns in a day!
          </p>
          <p>
            This calorie calculator uses the Mifflin-St Jeor equation to calculate your Basal Metabolic Rate (BMR)
            and Total Daily Energy Expenditure (TDEE).
            BMR is the minimum energy your body unconsciously spends to maintain life, while TDEE is the actual
            daily energy expenditure including your activity level.
          </p>
          <p>
            Based on TDEE, you can plan diets for weight maintenance, loss, or gain,
            making it useful for dieting, muscle building, and health management goals.
          </p>
          <p>
            Following Korean Nutrition Society guidelines, it provides recommended calorie intake by activity level.
            It is an essential health tool for anyone&mdash;office workers, students, those starting to exercise.
          </p>
          <TermGlossary items={[
            { term: 'BMR (Basal Metabolic Rate)', desc: 'The minimum energy spent on heartbeat, breathing, cell renewal, etc. to sustain life. Calories burned at rest, the baseline for diet planning.' },
            { term: 'TDEE (Total Daily Energy Expenditure)', desc: 'Total daily calorie expenditure found by multiplying BMR by an activity factor. Used for weight maintenance/loss goals.' },
            { term: 'Mifflin-St Jeor Equation', desc: 'A formula estimating BMR using sex, age, height, and weight. The most accurate BMR method in modern nutrition.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Mifflin-St Jeor Equation and TDEE</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 1: Calculate BMR</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Male: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(yr) + 5
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Female: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(yr) - 161
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 2: Calculate TDEE</p>
              <p className="text-xs mt-1 mb-2 text-muted-foreground">TDEE = BMR × activity factor</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>1.2:</strong> Sedentary (little or no exercise)</li>
                <li><strong>1.375:</strong> Light activity (1-3 times/week)</li>
                <li><strong>1.55:</strong> Moderate activity (3-5 times/week)</li>
                <li><strong>1.725:</strong> Active (6-7 times/week)</li>
                <li><strong>1.9:</strong> Very active (2+ times/day)</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 3: Target-based Calorie Intake</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>Weight Loss:</strong> TDEE - 500kcal (target 0.5kg/week loss)</li>
                <li><strong>Maintain:</strong> TDEE (maintain current weight)</li>
                <li><strong>Weight Gain:</strong> TDEE + 500kcal (target 0.5kg/week gain)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Key tips for using the Calorie Calculator</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Don&apos;t eat below your BMR</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Eating below BMR can lower your metabolism and make weight loss harder.
                For healthy loss, reducing TDEE by 300~500kcal is appropriate.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Choose a realistic activity factor</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Picking a high activity factor without actually exercising overstates TDEE,
                leading to unintended overeating&mdash;choose based on your real activity level.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Raise your BMR with strength training</p>
              <p className="text-xs mt-1 text-muted-foreground">
                More muscle means a higher BMR. Increasing skeletal muscle through regular strength training
                burns more calories even at rest, helping with weight management.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Get enough protein</p>
              <p className="text-xs mt-1 text-muted-foreground">
                To maintain muscle while dieting, aim for 1.2~1.6g of protein per kg of body weight.
                Protein has a high energy cost to digest and increases satiety.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Recalculate regularly</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Whenever your weight or activity level changes, recalculating BMR and TDEE
                and updating your diet plan is effective.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. Follow Korean Nutrition Society guidelines</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Build a balanced diet based on KNS recommended daily nutrient ratios:
                Carbohydrates 50~65%, Protein 7~20%, Fat 15~30%.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '칼로리 계산기' : 'Calorie Calculator'}
      description={isKo ? 'Mifflin-St Jeor 공식으로 기초대사량(BMR)과 일일 총 에너지 소비량(TDEE)을 계산하고, 목표에 맞는 권장 칼로리 섭취량을 확인합니다.' : 'Calculate your BMR and TDEE using the Mifflin-St Jeor equation, and find recommended calorie intake for your goal.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CalorieCalculator;
