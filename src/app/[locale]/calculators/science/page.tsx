"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const SciencePage = () => {
  const { dict } = useI18n();
  const scienceCategory = calculatorCategories.find(cat => cat.id === 'science');

  if (!scienceCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...scienceCategory,
    name: dict.categories.science.name,
    description: dict.categories.science.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default SciencePage;