'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

const BMICalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.bmiCalculator;
  const isKo = locale === 'ko';

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<{ bmi: number; status: string; color: string } | null>(null);

  const getBMIStatus = (bmi: number) => {
    if (bmi < 18.5) return { status: t.status.underweight, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' };
    if (bmi < 25) return { status: t.status.normal, color: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' };
    if (bmi < 30) return { status: t.status.overweight, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' };
    if (bmi < 35) return { status: t.status.obese, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300' };
    return { status: t.status.severelyObese, color: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' };
  };

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (isNaN(h) || isNaN(w) || h <= 0 || w <= 0) {
      alert(t.error);
      return;
    }

    const bmi = w / Math.pow(h / 100, 2);
    const { status, color } = getBMIStatus(bmi);

    setResult({ bmi: parseFloat(bmi.toFixed(1)), status, color });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.height}:</label>
        <Input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder={t.placeholders.height} />
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.weight}:</label>
        <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder={t.placeholders.weight} />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculateBMI}>{t.calculate}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{t.reset}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>{t.results.bmi}:</span>
            <strong className="text-2xl">{result.bmi}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>{t.results.status}:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.color}`}>
              {result.status}
            </span>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">{t.results.standardTable}</p>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>- {t.standardTableRows.underweight}</li>
              <li>- {t.standardTableRows.normal}</li>
              <li>- {t.standardTableRows.overweight}</li>
              <li>- {t.standardTableRows.obese}</li>
              <li>- {t.standardTableRows.severelyObese}</li>
            </ul>
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
            BMI(체질량지수)로 건강 상태를 간편하게 확인하세요!
          </p>
          <p>
            BMI(Body Mass Index)는 키와 체중을 이용하여 체내 지방의 양을 추정하는 가장 보편적인 건강 지표입니다.
            WHO(세계보건기구)에서 표준화한 이 수치는 전 세계적으로 개인의 체중이 건강 범위 내에 있는지를 빠르게 파악하는 데 사용됩니다.
            우리나라에서도 건강검진 항목으로 활용되어 간단한 두 가지 수치만으로 건강 관리의 출발점을 잡을 수 있습니다.
          </p>
          <p>
            BMI 계산기는 직장인, 학생, 주부 등 누구나 쉽게 이용할 수 있습니다.
            특히 다이어트를 시작하거나 건강 관리에 관심이 있는 분들에게 현재 본인 상태를 객관적으로 파악하는 첫 번째 단계가 됩니다.
            병원이나 헬스장에 가지 않아도 집에서 간편하게 자신의 체중 상태를 점검해 보세요.
          </p>
          <p>
            다만 BMI는 근육량, 체형, 골격, 연령, 성별 등은 반영하지 못하는 한계가 있습니다.
            근육이 많은 운동선수나 고령자의 경우 BMI만으로는 정확한 건강 상태를 판단하기 어려우므로,
            BMI를 보조 지표로 활용하고 정확한 건강 판단은 반드시 전문가와 상담하시기 바랍니다.
          </p>
          <TermGlossary items={[
            { term: 'BMI (체질량지수)', desc: '키와 체중으로 체내 지방량을 추정하는 지표로, 체중(kg)을 키(m)의 제곱으로 나눈 값입니다. 전 세계적으로 통용되는 기본 건강 지표입니다.' },
            { term: 'WHO (세계보건기구)', desc: 'BMI 분류 기준(저체중·정상·과체중·비만)을 국제적으로 표준화한 보건 국제 기구입니다. 한국의 건강검진 기준도 이를 따릅니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">BMI 계산 공식과 작동 원리</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">기본 공식: BMI = 체중(kg) ÷ 키(m)²</p>
              <p className="text-xs text-muted-foreground mt-1">
                키를 미터(m) 단위로 변환한 후 제곱하고, 체중을 나누어 BMI를 산출합니다.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                예시: 키 175cm(1.75m), 체중 70kg
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BMI = 70 ÷ (1.75)² = 70 ÷ 3.0625 ≈ 22.9 → 정상
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">WHO BMI 분류 기준표</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-2 text-muted-foreground">
                <li><strong>18.5 미만:</strong> 저체중 (영양실조 주의)</li>
                <li><strong>18.5 ~ 24.9:</strong> 정상 체중 (건강 범위)</li>
                <li><strong>25 ~ 29.9:</strong> 과체중 (1단계 비만)</li>
                <li><strong>30 ~ 34.9:</strong> 비만 (2단계, 건강 관리 필요)</li>
                <li><strong>35 이상:</strong> 고도비만 (3단계, 전문의 상담 권장)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 BMI를 올바르게 활용하는 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. BMI만으로 건강을 판단하지 마세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                근육이 많은 운동선수의 경우 BMI가 높게 나올 수 있지만, 이는 체지방이 아닌 근육량 때문입니다.
                BMI와 함께 허리 둘레, 체지방률, 혈액검사 결과 등을 종합적으로 고려하는 것이 중요합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 연령과 성별에 따른 차이를 고려하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                동일한 BMI라도 연령과 성별에 따라 건강 위험이 다를 수 있습니다.
                특히 65세 이상 고령자는 적절한 체중 유지가 건강에 더 중요하며, 근육량 감소에 주의가 필요합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 허리 둘레도 함께 확인하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                BMI가 정상 범위라 하더라도 복부 비만(허리 둘레 남성 90cm 이상, 여성 85cm 이상)인 경우
                대사증후군, 당뇨, 심혈관 질환 위험이 높아지므로 허리 둘레 측정을 병행하는 것이 좋습니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. BMI 개선을 위한 생활습관</p>
              <p className="text-xs mt-1 text-muted-foreground">
                균형 잡힌 식단과 규칙적인 운동을 병행하고, 일일 섭취 칼로리와 소모 칼로리의 균형을 유지하세요.
                충분한 수면(7~8시간)과 스트레스 관리도 체중 조절에 큰 도움이 됩니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 정기적인 BMI 관리가 중요합니다</p>
              <p className="text-xs mt-1 text-muted-foreground">
                BMI는 한 번 계산하고 끝내는 것이 아니라 주기적으로 측정하여 변화 추이를 관찰하는 것이 효과적입니다.
                월 1~2회 정기적으로 체크하고 식단 및 운동 조절에 반영하세요.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. 소아 청소년은 성인 기준과 다릅니다</p>
              <p className="text-xs mt-1 text-muted-foreground">
                소아 청소년의 BMI는 성인과 달리 동일 연령·성별 아동 중에서의 상대적 위치(백분위수)로 평가됩니다.
                성장 단계에 맞는 전문의 상담을 추천합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">7. BMI 목표를 현실적으로 설정하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                현재 BMI에서 5~10%만 감량해도 건강 개선 효과가 크므로, 무리한 감량보다는 소폭의 꾸준한 변화를 목표로 하는 것이 좋습니다.
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
            Easily check your health status with BMI (Body Mass Index)!
          </p>
          <p>
            BMI (Body Mass Index) is the most common health indicator for estimating body fat from height and weight.
            Standardized by the WHO, this value is used worldwide to quickly see whether a person&apos;s weight is within a healthy range.
            It is also used in health checkups in Korea, so you can set a starting point for health management with just two simple numbers.
          </p>
          <p>
            The BMI calculator is easy for anyone&mdash;office workers, students, homemakers&mdash;to use.
            Especially for those starting a diet or interested in health management, it is the first step to objectively understand your current state.
            Check your weight status at home without going to a hospital or gym.
          </p>
          <p>
            However, BMI has limits: it does not reflect muscle mass, body shape, frame, age, or sex.
            For muscular athletes or the elderly, BMI alone makes an accurate health judgment difficult,
            so use BMI as a supporting indicator and always consult a professional for accurate health assessment.
          </p>
          <TermGlossary items={[
            { term: 'BMI (Body Mass Index)', desc: 'An indicator estimating body fat from height and weight: weight(kg) divided by height(m) squared. A basic health metric used worldwide.' },
            { term: 'WHO (World Health Organization)', desc: 'The international public-health body that standardized BMI classification (underweight, normal, overweight, obese) globally. Korea\'s health-checkup criteria follow it.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">BMI formula and how it works</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Basic formula: BMI = weight(kg) ÷ height(m)²</p>
              <p className="text-xs text-muted-foreground mt-1">
                Convert height to meters, square it, then divide weight by it to get BMI.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Example: height 175cm (1.75m), weight 70kg
              </code>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                BMI = 70 ÷ (1.75)² = 70 ÷ 3.0625 ≈ 22.9 → Normal
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">WHO BMI classification table</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-2 text-muted-foreground">
                <li><strong>Below 18.5:</strong> Underweight (watch for malnutrition)</li>
                <li><strong>18.5 ~ 24.9:</strong> Normal weight (healthy range)</li>
                <li><strong>25 ~ 29.9:</strong> Overweight (obesity stage 1)</li>
                <li><strong>30 ~ 34.9:</strong> Obese (stage 2, health management needed)</li>
                <li><strong>35 and above:</strong> Severe obesity (stage 3, see a specialist)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 Tips for using BMI correctly</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Don&apos;t judge health by BMI alone</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Muscular athletes may show a high BMI, but that is due to muscle, not body fat.
                It is important to consider waist circumference, body-fat percentage, and blood-test results together with BMI.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Consider age and sex differences</p>
              <p className="text-xs mt-1 text-muted-foreground">
                The same BMI can carry different health risks by age and sex.
                Especially for those 65+, maintaining an appropriate weight matters more for health, and attention to muscle loss is needed.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Also check waist circumference</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Even within a normal BMI, abdominal obesity (waist ≥ 90cm male, ≥ 85cm female) raises the risk of metabolic syndrome, diabetes, and cardiovascular disease, so measure waist circumference too.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Lifestyle habits to improve BMI</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Combine a balanced diet with regular exercise and keep a balance between daily calories consumed and burned.
                Enough sleep (7~8 hours) and stress management also help greatly with weight control.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Regular BMI monitoring matters</p>
              <p className="text-xs mt-1 text-muted-foreground">
                BMI is not one-and-done; measuring periodically to observe trends is effective.
                Check regularly 1~2 times a month and reflect it in diet and exercise adjustments.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">6. Children and teens differ from adults</p>
              <p className="text-xs mt-1 text-muted-foreground">
                A child&apos;s or teen&apos;s BMI is evaluated by relative position (percentile) among same-age, same-sex children, unlike adults.
                Consult a pediatrician appropriate to the growth stage.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">7. Set realistic BMI goals</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Losing even 5~10% of your current BMI yields large health benefits, so aim for small, steady changes rather than extreme loss.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? 'BMI 계산기' : 'BMI Calculator'}
      description={isKo ? '체질량지수(BMI)를 통해 현재 체중 상태를 빠르게 확인합니다.' : 'Quickly check your current weight status with the Body Mass Index (BMI).'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default BMICalculator;
