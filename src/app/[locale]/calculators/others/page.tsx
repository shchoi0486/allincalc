"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const OthersPage = () => {
  const { dict } = useI18n();
  const othersCategory = calculatorCategories.find(cat => cat.id === 'others');

  if (!othersCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...othersCategory,
    name: dict.categories.others.name,
    description: dict.categories.others.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default OthersPage;