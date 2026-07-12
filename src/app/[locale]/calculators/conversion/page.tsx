"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const ConversionPage = () => {
  const { dict } = useI18n();
  const conversionCategory = calculatorCategories.find(cat => cat.id === 'conversion');

  if (!conversionCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...conversionCategory,
    name: dict.categories.conversion.name,
    description: dict.categories.conversion.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default ConversionPage;
