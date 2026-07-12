"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const FinancePage = () => {
  const { dict } = useI18n();
  const financeCategory = calculatorCategories.find(cat => cat.id === 'finance');

  if (!financeCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...financeCategory,
    name: dict.categories.finance.name,
    description: dict.categories.finance.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default FinancePage;