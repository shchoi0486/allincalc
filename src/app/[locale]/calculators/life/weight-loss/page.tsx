'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';


const WeightLossCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.weightLoss;
  const isKo = locale === 'ko';

  const [currentWeight, setCurrentWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('sedentary');
  const [result, setResult] = useState<any>(null);

  const calculateWeightLoss = () => {
    const cw = parseFloat(currentWeight);
    const tw = parseFloat(targetWeight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    if (isNaN(cw) || isNaN(tw) || isNaN(h) || isNaN(a)) {
      alert(t.error);
      return;
    }

    let bmr;
    if (gender === 'male') {
      bmr = 10 * cw + 6.25 * h - 5 * a + 5;
    } else {
      bmr = 10 * cw + 6.25 * h - 5 * a - 161;
    }

    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9,
    };

    const tdee = bmr * activityMultipliers[activityLevel];
    const caloriesForWeightLoss = tdee - 500;

    const weightToLose = cw - tw;
    const weeksToLose = weightToLose / 0.5;

    setResult({
      caloriesForWeightLoss: caloriesForWeightLoss.toFixed(2),
      weeksToLose: weeksToLose.toFixed(2),
      targetDate: new Date(Date.now() + weeksToLose * 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.currentWeight}:</label>
        <Input type="number" value={currentWeight} onChange={(e) => setCurrentWeight(e.target.value)} placeholder={t.placeholders.currentWeight} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.targetWeight}:</label>
        <Input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder={t.placeholders.targetWeight} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.height}:</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={t.placeholders.height} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.age}:</label>
        <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder={t.placeholders.age} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.gender}:</label>
        <Select value={gender} onValueChange={setGender}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="male">{t.genderOptions.male}</SelectItem>
            <SelectItem value="female">{t.genderOptions.female}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.activityLevel}:</label>
        <Select value={activityLevel} onValueChange={setActivityLevel}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="sedentary">{t.activityOptions.sedentary}</SelectItem>
            <SelectItem value="light">{t.activityOptions.light}</SelectItem>
            <SelectItem value="moderate">{t.activityOptions.moderate}</SelectItem>
            <SelectItem value="active">{t.activityOptions.active}</SelectItem>
            <SelectItem value="veryActive">{t.activityOptions.veryActive}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateWeightLoss}>{t.calculate}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{t.reset}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>{t.results.dailyCalories}:</span>
            <strong>{result.caloriesForWeightLoss} kcal</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.timeToGoal}:</span>
            <strong>약 {result.weeksToLose} 주</strong>
          </div>
          <div className="flex justify-between">
            <span>{t.results.targetDate}:</span>
            <strong>{result.targetDate}</strong>
          </div>
        </div>
      )}
    </div>
  );

  const infoSection = isKo ? (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            나에게 맞는 건강한 다이어트, 과학적인 계획으로 시작하세요!
          </p>
          <p>
            성공적인 체중 감량의 핵심은 '얼마나 적게 먹느냐'가 아니라 '내 몸을 이해하고 현명하게 계획하느냐'에 있습니다.
            이 계산기는 우리 몸의 에너지 소비 원리를 기반으로, 여러분의 건강을 지키면서 목표 체중을 달성할 수 있도록 과학적인 나침반이 되어 드립니다.
          </p>
          <p>
            계산의 중심에는 <strong>기초대사량(BMR)</strong>과 <strong>총 에너지 소비량(TDEE)</strong>이라는 두 가지 중요한 개념이 있습니다.
            BMR은 생명 유지에 필요한 최소 에너지를, TDEE는 일상 활동을 포함한 하루 총 에너지 소비량을 의미합니다.
            이 계산기는 사용자의 신체 정보와 활동 수준을 바탕으로 TDEE를 예측하고, 주당 0.5kg 감량에 맞춘 일일 권장 칼로리를 제안합니다.
          </p>
          <p>
            이제 막 다이어트를 결심한 분, 정체기를 극복하고 싶은 분, 더 건강한 라이프스타일을 만들고 싶은 모든 분들이
            자신만의 건강한 다이어트 로드맵을 그리는 데 이 계산기를 활용해 보세요.
          </p>
          <TermGlossary items={[
            { term: '기초대사량 (BMR)', desc: '생명 유지를 위해 호흡, 체온, 심장 박동 등 무의식적 신체 기능에 쓰이는 최소 에너지 소비량입니다. 휴식 상태에서의 칼로리로 식단 계획의 기준점이 됩니다.' },
            { term: '총 에너지 소비량 (TDEE)', desc: '기초대사량에 일상 활동과 운동으로 소비되는 에너지를 더한 하루 총 칼로리 소비량입니다. 체중 유지·감량·증량 목표 설정에 활용됩니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">내 몸의 에너지 소비량, 어떻게 계산될까요?</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">1단계: 기초대사량 (BMR) 계산</p>
              <p className="text-xs mt-1 mb-2 text-muted-foreground">
                Mifflin-St Jeor 공식을 사용하여 휴식 시 최소 에너지 소비량을 계산합니다.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                남성: 10 × 체중(kg) + 6.25 × 신장(cm) - 5 × 나이 + 5
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                여성: 10 × 체중(kg) + 6.25 × 신장(cm) - 5 × 나이 - 161
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">2단계: 총 에너지 소비량 (TDEE) 계산</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">TDEE = BMR × 활동 계수</code>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>1.2:</strong> 좌식 생활 (운동 없음)</li>
                <li><strong>1.375:</strong> 가벼운 활동 (주 1~3회)</li>
                <li><strong>1.55:</strong> 보통 활동 (주 3~5회)</li>
                <li><strong>1.725:</strong> 적극적 활동 (주 6~7회)</li>
                <li><strong>1.9:</strong> 매우 적극적 (매일 2회 이상)</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">3단계: 목표 칼로리 설정</p>
              <p className="text-xs mt-1 mb-2 text-muted-foreground">
                지방 1kg 감량에는 약 7,700kcal 소모가 필요합니다. 건강한 감량을 위해 주당 0.5kg을 목표로 합니다.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                일일 목표 = TDEE - 500kcal (주당 약 0.5kg 감량)
              </code>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 건강한 다이어트 성공을 위한 핵심 전략</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. 현실적이고 지속 가능한 목표를 설정하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                주당 0.5~1kg 감량을 목표로 장기적 계획을 세우는 것이 중요합니다.
                단기 목표와 장기 목표를 함께 설정하고, 과정 자체를 즐기려는 마음가짐이 성공의 핵심입니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 칼로리보다 '영양의 질'에 집중하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                같은 500kcal라도 가공식품과 자연식품은 우리 몸에서 완전히 다르게 작용합니다.
                통곡물, 신선한 채소, 양질의 단백질, 건강한 지방 위주로 식단을 구성하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 근력 운동과 유산소 운동을 병행하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                유산소는 지방 연소에, 근력 운동은 기초대사량 자체를 높이는 데 효과적입니다.
                주 2~3회 근력 운동을 병행하면 기초대사량이 올라가 체중 관리가 수월해집니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 충분한 수면과 스트레스 관리를 하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                하루 7~8시간의 질 좋은 수면은 식욕 억제 호르몬 분비를 돕고,
                스트레스 관리는 감정적 폭식을 예방하는 데 중요합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 식사 기록으로 습관을 관찰하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                매일 먹는 음식을 간단히 기록하면 자신의 식습관을 객관적으로 파악하고
                개선점을 찾는 데 큰 도움이 됩니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. 전문가 상담을 받으세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                본 계산기는 일반적인 참고용 도구입니다. 질병, 임신, 수유 등 특이 체질에 따라
                다른 접근이 필요할 수 있으므로 의사나 임상 영양사와 상담을 추천합니다.
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
            Start a healthy diet that fits you, with a scientific plan!
          </p>
          <p>
            The key to successful weight loss is not &quot;how little you eat&quot; but &quot;how well you understand your body and plan wisely.&quot;
            Based on your body&apos;s energy expenditure principles, this calculator serves as a scientific compass to help you reach your goal weight while protecting your health.
          </p>
          <p>
            At the center of the calculation are two important concepts: <strong>Basal Metabolic Rate (BMR)</strong> and <strong>Total Daily Energy Expenditure (TDEE)</strong>.
            BMR is the minimum energy needed to sustain life, while TDEE is your total daily energy expenditure including daily activity.
            This calculator predicts TDEE from your body info and activity level, and suggests a daily recommended calorie intake aimed at losing 0.5kg per week.
          </p>
          <p>
            Whether you are just deciding to diet, trying to break through a plateau, or wanting a healthier lifestyle,
            use this calculator to draw your own healthy diet roadmap.
          </p>
          <TermGlossary items={[
            { term: 'BMR (Basal Metabolic Rate)', desc: 'The minimum energy your body spends on unconscious functions like breathing, body temperature, and heartbeat while at rest. It is the baseline for diet planning, expressed in calories at rest.' },
            { term: 'TDEE (Total Daily Energy Expenditure)', desc: 'Your total daily calorie expenditure: BMR plus energy burned through daily activity and exercise. Used to set weight maintenance, loss, or gain goals.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">How is my body&apos;s energy expenditure calculated?</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 1: Calculate BMR</p>
              <p className="text-xs mt-1 mb-2 text-muted-foreground">
                Uses the Mifflin-St Jeor equation to calculate minimum energy expenditure at rest.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Male: 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Female: 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 2: Calculate TDEE</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">TDEE = BMR × activity factor</code>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>1.2:</strong> Sedentary (no exercise)</li>
                <li><strong>1.375:</strong> Light activity (1~3 times/week)</li>
                <li><strong>1.55:</strong> Moderate activity (3~5 times/week)</li>
                <li><strong>1.725:</strong> Active (6~7 times/week)</li>
                <li><strong>1.9:</strong> Very active (2+ times/day)</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Step 3: Set target calories</p>
              <p className="text-xs mt-1 mb-2 text-muted-foreground">
                Losing 1kg of fat requires burning about 7,700kcal. For healthy loss, aim for 0.5kg per week.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Daily target = TDEE - 500kcal (about 0.5kg loss/week)
              </code>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 Key strategies for a successful, healthy diet</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Set realistic and sustainable goals</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Aim to lose 0.5~1kg per week and make a long-term plan.
                Set both short- and long-term goals, and enjoying the process itself is the key to success.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Focus on &quot;quality of nutrition&quot; over calories</p>
              <p className="text-xs mt-1 text-muted-foreground">
                The same 500kcal works very differently in the body depending on processed vs. natural food.
                Build your diet around whole grains, fresh vegetables, quality protein, and healthy fats.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Combine strength and cardio training</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Cardio burns fat, while strength training raises BMR itself.
                Adding strength training 2~3 times a week raises BMR and makes weight management easier.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Get enough sleep and manage stress</p>
              <p className="text-xs mt-1 text-muted-foreground">
                7~8 hours of quality sleep helps release appetite-suppressing hormones,
                and stress management is important to prevent emotional overeating.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Track your meals to observe habits</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Simply recording what you eat each day helps you objectively understand your eating habits
                and find areas for improvement.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. Consult a professional</p>
              <p className="text-xs mt-1 text-muted-foreground">
                This calculator is a general reference tool. Approaches may differ for special conditions such as illness, pregnancy, or breastfeeding, so we recommend consulting a doctor or clinical nutritionist.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '체중 감량 계산기' : 'Weight Loss Calculator'}
      description={isKo ? '목표 체중 달성을 위한 일일 권장 칼로리와 예상 소요 시간을 계산합니다.' : 'Calculate the daily recommended calories and estimated time needed to reach your goal weight.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default WeightLossCalculator;
