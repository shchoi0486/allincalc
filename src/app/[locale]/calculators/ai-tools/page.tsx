"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const AiToolsPage = () => {
  const { dict } = useI18n();
  const aiToolsCategory = calculatorCategories.find(cat => cat.id === 'ai-tools');

  if (!aiToolsCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...aiToolsCategory,
    name: dict.categories['ai-tools'].name,
    description: dict.categories['ai-tools'].description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default AiToolsPage;
