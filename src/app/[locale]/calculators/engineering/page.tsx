"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const EngineeringPage = () => {
  const { dict } = useI18n();
  const engineeringCategory = calculatorCategories.find(cat => cat.id === 'engineering');

  if (!engineeringCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...engineeringCategory,
    name: dict.categories.engineering.name,
    description: dict.categories.engineering.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default EngineeringPage;