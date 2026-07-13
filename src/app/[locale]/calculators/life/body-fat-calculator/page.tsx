'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

const BodyFatCalculator = () => {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';

  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<{
    bodyFat: number;
    category: string;
    categoryColor: string;
    fatMass: number;
    leanMass: number;
  } | null>(null);

  const getCategory = (bf: number, isMale: boolean) => {
    if (isMale) {
      if (bf < 6) return { category: isKo ? '필수 지방 (Essential Fat)' : 'Essential Fat', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
      if (bf < 14) return { category: isKo ? '운동선수 (Athletes)' : 'Athletes', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' };
      if (bf < 18) return { category: isKo ? '건강 (Fitness)' : 'Fitness', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
      if (bf < 25) return { category: isKo ? '보통 (Acceptable)' : 'Acceptable', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' };
      return { category: isKo ? '비만 (Obese)' : 'Obese', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' };
    } else {
      if (bf < 14) return { category: isKo ? '필수 지방 (Essential Fat)' : 'Essential Fat', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
      if (bf < 21) return { category: isKo ? '운동선수 (Athletes)' : 'Athletes', color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' };
      if (bf < 25) return { category: isKo ? '건강 (Fitness)' : 'Fitness', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' };
      if (bf < 32) return { category: isKo ? '보통 (Acceptable)' : 'Acceptable', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' };
      return { category: isKo ? '비만 (Obese)' : 'Obese', color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' };
    }
  };

  const calculate = () => {
    const a = parseFloat(age);
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const n = parseFloat(neck);
    const wa = parseFloat(waist);
    const hipVal = parseFloat(hip);

    if (isNaN(a) || isNaN(h) || isNaN(w) || isNaN(n) || isNaN(wa)) {
      alert(isKo ? '필수 값을 모두 입력해주세요.' : 'Please enter all required values.');
      return;
    }

    if (gender === 'female' && isNaN(hipVal)) {
      alert(isKo ? '여성은 엉덩이둘레를 입력해주세요.' : 'Females must enter hip circumference.');
      return;
    }

    let bodyFat: number;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(wa - n) + 0.15456 * Math.log10(h)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(wa + hipVal - n) + 0.22100 * Math.log10(h)) - 450;
    }

    if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 60) {
      alert(isKo ? '입력값을 확인해주세요. 측정값이 올바르지 않습니다.' : 'Please check your input values. Measurements seem incorrect.');
      return;
    }

    const { category, color } = getCategory(bodyFat, gender === 'male');
    const fatMass = parseFloat(((bodyFat / 100) * w).toFixed(1));
    const leanMass = parseFloat((w - fatMass).toFixed(1));

    setResult({
      bodyFat: parseFloat(bodyFat.toFixed(1)),
      category,
      categoryColor: color,
      fatMass,
      leanMass,
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
        <label className="w-28 text-sm font-medium">{isKo ? '목둘레 (cm)' : 'Neck (cm)'}:</label>
        <Input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} placeholder={isKo ? '예: 38' : 'e.g. 38'} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-28 text-sm font-medium">{isKo ? '허리둘레 (cm)' : 'Waist (cm)'}:</label>
        <Input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} placeholder={isKo ? '예: 80' : 'e.g. 80'} />
      </div>
      {gender === 'female' && (
        <div className="flex items-center space-x-4">
          <label className="w-28 text-sm font-medium">{isKo ? '엉덩이둘레 (cm)' : 'Hip (cm)'}:</label>
          <Input type="number" value={hip} onChange={(e) => setHip(e.target.value)} placeholder={isKo ? '예: 95' : 'e.g. 95'} />
        </div>
      )}
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
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">{isKo ? '체지방률' : 'Body Fat Percentage'}</p>
            <p className="text-2xl font-bold text-primary">{result.bodyFat}%</p>
          </div>
          <div className="flex justify-between items-center p-2 bg-muted rounded-md">
            <span className="text-sm">{isKo ? '분류' : 'Category'}:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.categoryColor}`}>{result.category}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">{isKo ? '지방량' : 'Fat Mass'}</p>
              <p className="font-bold">{result.fatMass} kg</p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground">{isKo ? '근육량 (제지방)' : 'Lean Mass'}</p>
              <p className="font-bold">{result.leanMass} kg</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">{isKo ? '남성 기준 체지방율 분류' : 'Male Body Fat Categories'}</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>- {isKo ? '6% 미만: 필수 지방 (위험)' : '<6%: Essential Fat (dangerous)'}</li>
              <li>- {isKo ? '6~14%: 운동선수' : '6-14%: Athletes'}</li>
              <li>- {isKo ? '14~18%: 건강' : '14-18%: Fitness'}</li>
              <li>- {isKo ? '18~25%: 보통' : '18-25%: Acceptable'}</li>
              <li>- {isKo ? '25% 이상: 비만' : '25%+: Obese'}</li>
            </ul>
            <p className="font-semibold mb-2 mt-3">{isKo ? '여성 기준 체지방율 분류' : 'Female Body Fat Categories'}</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>- {isKo ? '14% 미만: 필수 지방 (위험)' : '<14%: Essential Fat (dangerous)'}</li>
              <li>- {isKo ? '14~21%: 운동선수' : '14-21%: Athletes'}</li>
              <li>- {isKo ? '21~25%: 건강' : '21-25%: Fitness'}</li>
              <li>- {isKo ? '25~32%: 보통' : '25-32%: Acceptable'}</li>
              <li>- {isKo ? '32% 이상: 비만' : '32%+: Obese'}</li>
            </ul>
          </div>
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
            US Navy 방법으로 체지방률을 정확하게 측정하세요!
          </p>
          <p>
            체지방률 계산기는 미 해군(US Navy)에서 개발한 측정 방법을 사용하여
            체내 지방 비율을 추정합니다. 신장, 체중, 목둘레, 허리둘레(여성은 엉덩이둘레 포함)를
            측정하면 과학적으로 체지방 비율을 계산할 수 있습니다.
          </p>
          <p>
            체지방률은 BMI보다 정확한 체형 분석 지표로, 근육량과 지방량의 비율을 파악하는 데 유용합니다.
            동일한 BMI라도 근육이 많은 사람과 지방이 많은 사람은 건강 상태가 크게 다를 수 있으므로
            체지방률을 함께 확인하는 것이 중요합니다.
          </p>
          <p>
            결과에 따라 필수 지방, 운동선수, 건강, 보통, 비만 등으로 분류되며
            개인의 건강 목표에 맞는 식단 및 운동 계획 수립에 활용됩니다.
          </p>
          <TermGlossary items={[
            { term: '체지방률 (Body Fat %)', desc: '전체 체중 중 지방이 차지하는 비율입니다. 체중만으로는 파악하기 어려운 체내 지방-근육 비율을 보여주는 중요한 건강 지표입니다.' },
            { term: 'US Navy 방법', desc: '미 해군에서 개발한 체지방 추정 공식으로, 신장과 신체 부위 둘레(목, 허리, 엉덩이)를 이용하여 체지방률을 계산합니다. 캘리퍼스 없이도 비교적 정확한 추정이 가능합니다.' },
            { term: '제지방량 (Lean Mass)', desc: '체중에서 지방을 제외한 근육, 뼈, 장기 등의 무게입니다. 기초대사량에 직접 영향을 주며, 건강한 체중 관리의 핵심 지표입니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">US Navy 체지방률 계산 공식</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">남성 공식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BF% = 495 / (1.0324 - 0.19077 × log10(허리둘레 - 목둘레) + 0.15456 × log10(키)) - 450
              </code>
              <p className="text-xs text-muted-foreground mt-1">허리둘레와 목둘레의 차이를 이용하여 상대적 지방 분포를 추정합니다.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">여성 공식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BF% = 495 / (1.29579 - 0.35004 × log10(허리둘레 + 엉덩이둘레 - 목둘레) + 0.22100 × log10(키)) - 450
              </code>
              <p className="text-xs text-muted-foreground mt-1">여성은 골반 주변의 지방 분포를 반영하기 위해 엉덩이둘레를 추가합니다.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">체지방률 분류 기준</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs font-semibold">남성</p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>6% 미만: 필수 지방</li>
                    <li>6~14%: 운동선수</li>
                    <li>14~18%: 건강</li>
                    <li>18~25%: 보통</li>
                    <li>25% 이상: 비만</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold">여성</p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>14% 미만: 필수 지방</li>
                    <li>14~21%: 운동선수</li>
                    <li>21~25%: 건강</li>
                    <li>25~32%: 보통</li>
                    <li>32% 이상: 비만</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">체지방률 측정 핵심 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. 아침 공복에 측정하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                식사나 수분 섭취 전 측정해야 가장 정확한 결과를 얻을 수 있습니다.
                샤워 후 가벼운 옷차림에서 측정하는 것이 좋습니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 줄자를 수평으로 유지하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                목, 허리, 엉덩이둘레를 측정할 때 줄자를 몸에 수평으로 유지하고
                너무 조이지 않게 자연스럽게 감싸주세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 허리둘레 측정 위치를 정확히 하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                남성은 늑골 아래와 장골 위의 중간, 여성은 가장 좁은 부분(자연스러운 허리 라인)에서 측정합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 정기적으로 추이를 관찰하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                절대값보다 변화 추이를 관찰하는 것이 더 중요합니다.
                2~4주 간격으로 정기적으로 측정하여 식단과 운동 효과를 확인하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 체지방률에만 의존하지 마세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                체지방률은 BMI와 함께 참고 지표로 활용하고,
                허리둘레, 혈액검사, 체형 등 종합적인 건강 상태를 고려하세요.
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
            Accurately measure body fat percentage with the US Navy method!
          </p>
          <p>
            This body fat calculator uses the US Navy method to estimate your body fat ratio.
            By measuring height, weight, neck circumference, and waist circumference (plus hip for females),
            it scientifically calculates body fat percentage.
          </p>
          <p>
            Body fat percentage is a more accurate body composition indicator than BMI, useful for understanding
            the muscle-to-fat ratio. Two people with the same BMI can have very different health statuses
            depending on muscle vs. fat, making body fat measurement important.
          </p>
          <p>
            Results are classified as Essential Fat, Athletes, Fitness, Acceptable, or Obese,
            and are used for planning personalized diet and exercise programs.
          </p>
          <TermGlossary items={[
            { term: 'Body Fat Percentage', desc: 'The ratio of fat to total body weight. An important health indicator showing the fat-muscle ratio that weight alone cannot reveal.' },
            { term: 'US Navy Method', desc: 'A body fat estimation formula developed by the US Navy using height and body measurements (neck, waist, hip). Allows reasonably accurate estimation without calipers.' },
            { term: 'Lean Mass', desc: 'Weight minus fat: muscles, bones, organs, etc. Directly affects BMR and is a key indicator for healthy weight management.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">US Navy Body Fat Formula</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Male Formula</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BF% = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450
              </code>
              <p className="text-xs text-muted-foreground mt-1">Uses the difference between waist and neck to estimate relative fat distribution.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Female Formula</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BF% = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450
              </code>
              <p className="text-xs text-muted-foreground mt-1">Includes hip circumference to reflect fat distribution around the pelvis.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Body Fat Classification</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <p className="text-xs font-semibold">Male</p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>Below 6%: Essential Fat</li>
                    <li>6-14%: Athletes</li>
                    <li>14-18%: Fitness</li>
                    <li>18-25%: Acceptable</li>
                    <li>25%+: Obese</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold">Female</p>
                  <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground">
                    <li>Below 14%: Essential Fat</li>
                    <li>14-21%: Athletes</li>
                    <li>21-25%: Fitness</li>
                    <li>25-32%: Acceptable</li>
                    <li>32%+: Obese</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Key tips for body fat measurement</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Measure in the morning on an empty stomach</p>
              <p className="text-xs mt-1 text-muted-foreground">
                For the most accurate results, measure before eating or drinking.
                Measure after showering in light clothing.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Keep the tape horizontal</p>
              <p className="text-xs mt-1 text-muted-foreground">
                When measuring neck, waist, and hip, keep the tape level with the floor
                and wrap it naturally without pulling too tight.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Measure waist at the correct position</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Males: midpoint between the lowest rib and iliac crest.
                Females: at the narrowest part (natural waistline).
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Track trends regularly</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Trends matter more than absolute values. Measure every 2-4 weeks
                to verify the effectiveness of your diet and exercise.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Don&apos;t rely on body fat alone</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Use body fat percentage as a reference alongside BMI, and consider
                waist circumference, blood tests, and overall body composition.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '체지방률 계산기' : 'Body Fat Calculator'}
      description={isKo ? 'US Navy 방법으로 체지방률을 계산하고 체지방 분류를 확인합니다.' : 'Calculate body fat percentage using the US Navy method and check your body fat category.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default BodyFatCalculator;
