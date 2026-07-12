"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';
import { useI18n } from '@/i18n/I18nProvider';

const GamePage = () => {
  const { dict } = useI18n();
  const gameCategory = calculatorCategories.find(cat => cat.id === 'game');

  if (!gameCategory) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categoryWithDescription = {
    ...gameCategory,
    name: dict.categories.game.name,
    description: dict.categories.game.description,
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default GamePage;