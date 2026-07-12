'use client';

import { useParams } from 'next/navigation';
import { calculators } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

export default function CalculatorPage() {
  const params = useParams();
  const { locale, dict } = useI18n();
  const isKo = locale === 'ko';

  if (!params) {
    return <div>{dict.categories.loading}</div>;
  }

  const categorySlug = params.category as string;
  const calculatorId = params.id as string;

  const categoryCalculators = calculators[categorySlug as keyof typeof calculators] || [];
  const calculator = categoryCalculators.find(calc => calc.id === calculatorId);

  if (!calculator) {
    return <div>{isKo ? '계산기를 찾을 수 없습니다.' : 'Calculator not found.'}</div>;
  }

  const name = dict.calculatorNames[calculator.id as keyof typeof dict.calculatorNames] || calculator.name;
  const description = dict.calculatorDescriptions[calculator.id as keyof typeof dict.calculatorDescriptions] || calculator.description;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <p className="text-lg text-muted-foreground mb-8">{description}</p>
      {/* 여기에 각 계산기의 실제 구현이 들어갑니다. */}
      <div className="bg-muted p-8 rounded-lg">
        <p>{isKo ? '계산기 구현 영역' : 'Calculator implementation area'}</p>
      </div>
    </div>
  );
}