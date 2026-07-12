"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const LifePage = () => {
  const { dict } = useI18n();
  const lifeCategory = calculatorCategories.find(cat => cat.id === 'life');

  if (!lifeCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...lifeCategory,
    name: dict.categories.life.name,
    description: dict.categories.life.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default LifePage;