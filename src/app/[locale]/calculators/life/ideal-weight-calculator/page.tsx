'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

const IdealWeightCalculator = () => {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';

  const [gender, setGender] = useState('male');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<{
    bmiBased: number;
    devine: number;
    robinson: number;
    healthyMin: number;
    healthyMax: number;
  } | null>(null);

  const cmToInches = (cm: number) => cm / 2.54;

  const calculate = () => {
    const h = parseFloat(height);

    if (isNaN(h) || h <= 0) {
      alert(isKo ? '키를 올바르게 입력해주세요.' : 'Please enter a valid height.');
      return;
    }

    const heightM = h / 100;
    const heightIn = cmToInches(h);
    const isMale = gender === 'male';

    const bmiBased = parseFloat((Math.pow(heightM, 2) * 22).toFixed(1));
    const devine = isMale
      ? parseFloat((50 + 2.3 * (heightIn - 60)).toFixed(1))
      : parseFloat((45.5 + 2.3 * (heightIn - 60)).toFixed(1));
    const robinson = isMale
      ? parseFloat((52 + 1.9 * (heightIn - 60)).toFixed(1))
      : parseFloat((49 + 1.7 * (heightIn - 60)).toFixed(1));

    const healthyMin = parseFloat((Math.pow(heightM, 2) * 18.5).toFixed(1));
    const healthyMax = parseFloat((Math.pow(heightM, 2) * 23).toFixed(1));

    setResult({ bmiBased, devine, robinson, healthyMin, healthyMax });
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
        <label className="w-28 text-sm font-medium">{isKo ? '키 (cm)' : 'Height (cm)'}:</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={isKo ? '예: 170' : 'e.g. 170'} />
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
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">{isKo ? '이상체중 범위 (한국 기준)' : 'Healthy Weight Range (Korean Standard)'}</p>
            <p className="text-2xl font-bold text-primary">{result.healthyMin} ~ {result.healthyMax} kg</p>
            <p className="text-xs text-muted-foreground mt-1">{isKo ? 'BMI 18.5 ~ 23.0 (한국 건강 BMI 기준)' : 'BMI 18.5 ~ 23.0 (Korean healthy BMI range)'}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-sm">{isKo ? '다양한 공식 기반 이상체중' : 'Ideal Weight by Various Formulas'}</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                <span className="text-muted-foreground">{isKo ? 'BMI 기반 (BMI 22)' : 'BMI-based (BMI 22)'}</span>
                <strong>{result.bmiBased} kg</strong>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                <span className="text-muted-foreground">Devine {isKo ? '공식' : 'Formula'}</span>
                <strong>{result.devine} kg</strong>
              </div>
              <div className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                <span className="text-muted-foreground">Robinson {isKo ? '공식' : 'Formula'}</span>
                <strong>{result.robinson} kg</strong>
              </div>
            </div>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">{isKo ? '한국 건강 BMI 기준 (대한비만학회)' : 'Korean Healthy BMI Standard (Korean Society for the Study of Obesity)'}</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>- {isKo ? '18.5 미만: 저체중' : '<18.5: Underweight'}</li>
              <li>- <span className="font-semibold text-primary">{isKo ? '18.5 ~ 23.0: 정상 (건강 범위)' : '18.5 ~ 23.0: Normal (healthy range)'}</span></li>
              <li>- 23.0 ~ 25.0: {isKo ? '과체중' : 'Overweight'}</li>
              <li>- 25.0 ~ 30.0: {isKo ? '비만 1단계' : 'Obese Class I'}</li>
              <li>- 30.0 이상: {isKo ? '비만 2단계 이상' : 'Obese Class II+'}</li>
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
            다양한 공식으로 이상체중을 확인하세요!
          </p>
          <p>
            이상체중 계산기는 BMI 기반, Devine, Robinson 등 다양한 공식을 통해
            개인의 키와 성별에 맞는 이상적인 체중 범위를 계산합니다.
          </p>
          <p>
            한국에서는 WHO 기준보다 엄격한 BMI 18.5~23.0을 건강 기준으로 사용합니다.
            이 범위 내에 있을 때 심혈관 질환, 당뇨, 고혈압 등의 위험이 가장 낮습니다.
          </p>
          <p>
            BMI 22 기반 이상체중은 가장 이상적인 체중으로 간주되며,
            Devine과 Robinson 공식은 의료 현장에서 널리 사용되는 전문적인 이상체중 산출 방식입니다.
            참고용으로 여러 공식의 결과를 비교해 보세요.
          </p>
          <TermGlossary items={[
            { term: '이상체중', desc: '건강상 가장 적절한 체중 범위로, 해당 체중 유지 시 질병 위험이 최소화됩니다. 키와 성별에 따라 달라집니다.' },
            { term: 'BMI 22 기반', desc: 'BMI 22를 이상적인 체질량지수로 보고 키(m)² × 22로 계산하는 방법입니다. 한국 건강검진에서 많이 활용됩니다.' },
            { term: 'Devine 공식', desc: '1974년 개발된 의료용 이상체중 공식으로, 미국 약전(USP)에서 약물 용량 계산 기준으로 사용합니다. 인치(inch) 단위의 키를 사용합니다.' },
            { term: 'Robinson 공식', desc: 'Devine 공식과 유사하나 약간 다른 계수를 사용하는 이상체중 산출 방식입니다. 두 공식의 결과를 비교하면 더 정확한 범위를 파악할 수 있습니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">이상체중 계산 공식</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">1. BMI 22 기반 이상체중</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                이상체중 = 키(m)² × 22
              </code>
              <p className="text-xs text-muted-foreground mt-1">BMI 22는 한국 건강검진에서 가장 이상적인 BMI로 간주됩니다.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">2. Devine 공식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                남성: 50 + 2.3 × (키(inch) - 60)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                여성: 45.5 + 2.3 × (키(inch) - 60)
              </code>
              <p className="text-xs text-muted-foreground mt-1">1인치 = 2.54cm. 60인치 = 152.4cm 기준.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">3. Robinson 공식</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                남성: 52 + 1.9 × (키(inch) - 60)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                여성: 49 + 1.7 × (키(inch) - 60)
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">한국 건강 BMI 기준</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>18.5 ~ 23.0:</strong> 정상 (건강 범위)</li>
                <li><strong>23.0 ~ 25.0:</strong> 과체중</li>
                <li><strong>25.0 ~ 30.0:</strong> 비만 1단계</li>
                <li><strong>30.0 이상:</strong> 비만 2단계 이상</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">이상체중 활용 핵심 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. 한국 기준을 우선시하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                한국인은 서양인에 비해 동일 BMI에서 체지방율이 높은 경향이 있으므로
                건강 BMI 기준을 18.5~23.0으로 보는 것이 적절합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 근육량도 고려하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                근육이 많은 운동선수나 헬스 매니아의 경우 이상체중 공식 결과가 실제 건강 체중보다
                낮게 나올 수 있으니 체지방률과 함께 참고하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 급격한 감량을 피하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                이상체중까지의 감량은 주 0.5~1kg 정도의 완만한 속도가 건강합니다.
                급격한 감량은 근육량 손실과 요요 현상을 유발할 수 있습니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 체형에 따른 차이를 인지하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                같은 키라도 골격 크기, 근육량, 체형에 따라 건강한 체중 범위가 달라질 수 있습니다.
                공식 결과를 절대적 기준으로 삼지 마세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 허리둘레도 함께 확인하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                이상체중 범위라도 복부 비만(남성 90cm 이상, 여성 85cm 이상)인 경우
                대사증후군 위험이 높으므로 허리둘레 측정을 병행하세요.
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
            Check your ideal weight with multiple formulas!
          </p>
          <p>
            The ideal weight calculator computes your ideal weight range using various formulas
            including BMI-based, Devine, and Robinson methods based on your height and sex.
          </p>
          <p>
            Korea uses a stricter BMI range of 18.5~23.0 as the healthy standard, compared to WHO.
            Maintaining weight within this range minimizes the risk of cardiovascular disease, diabetes, and hypertension.
          </p>
          <p>
            BMI 22-based ideal weight is considered the most optimal, while Devine and Robinson formulas
            are professional methods widely used in medical settings. Compare results from multiple formulas for reference.
          </p>
          <TermGlossary items={[
            { term: 'Ideal Weight', desc: 'The healthiest weight range where disease risk is minimized when maintained. Varies by height and sex.' },
            { term: 'BMI 22-based', desc: 'Calculates ideal weight as height(m)² × 22, assuming BMI 22 is optimal. Frequently used in Korean health checkups.' },
            { term: 'Devine Formula', desc: 'A medical ideal weight formula developed in 1974, used by the USP for drug dosage calculations. Uses height in inches.' },
            { term: 'Robinson Formula', desc: 'Similar to Devine but with different coefficients. Comparing both provides a more accurate range.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Ideal Weight Formulas</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">1. BMI 22-based Ideal Weight</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Ideal Weight = height(m)² × 22
              </code>
              <p className="text-xs text-muted-foreground mt-1">BMI 22 is considered the most optimal BMI in Korean health checkups.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">2. Devine Formula</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Male: 50 + 2.3 × (height(in) - 60)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Female: 45.5 + 2.3 × (height(in) - 60)
              </code>
              <p className="text-xs text-muted-foreground mt-1">1 inch = 2.54cm. Base: 60 inches = 152.4cm.</p>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">3. Robinson Formula</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Male: 52 + 1.9 × (height(in) - 60)
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Female: 49 + 1.7 × (height(in) - 60)
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Korean Healthy BMI Standard</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>18.5 ~ 23.0:</strong> Normal (healthy range)</li>
                <li><strong>23.0 ~ 25.0:</strong> Overweight</li>
                <li><strong>25.0 ~ 30.0:</strong> Obese Class I</li>
                <li><strong>30.0+:</strong> Obese Class II+</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Key tips for using Ideal Weight</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Prioritize Korean standards</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Koreans tend to have higher body fat at the same BMI as Westerners,
                so a healthy BMI of 18.5~23.0 is appropriate.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Consider muscle mass</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Athletes and bodybuilders may show lower results than their actual healthy weight.
                Reference body fat percentage as well.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Avoid rapid weight loss</p>
              <p className="text-xs mt-1 text-muted-foreground">
                A gradual rate of 0.5~1kg per week is healthy. Rapid loss causes muscle loss
                and rebound effects.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Recognize body type differences</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Same height can have different healthy weight ranges depending on frame size,
                muscle mass, and body type. Don&apos;t treat formulas as absolute.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Also check waist circumference</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Even within ideal weight, abdominal obesity (waist ≥90cm male, ≥85cm female)
                increases metabolic syndrome risk. Measure waist circumference as well.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '이상체중 계산기' : 'Ideal Weight Calculator'}
      description={isKo ? '다양한 공식(BMI, Devine, Robinson)으로 키와 성별에 맞는 이상체중을 계산합니다.' : 'Calculate ideal weight based on height and sex using multiple formulas (BMI, Devine, Robinson).'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default IdealWeightCalculator;
