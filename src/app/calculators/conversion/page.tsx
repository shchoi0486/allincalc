"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const ConversionPage = () => {
  const conversionCategory = calculatorCategories.find(cat => cat.id === 'conversion');

  if (!conversionCategory) {
    return <div>변환 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...conversionCategory,
    description: '다양한 단위를 손쉽게 변환해 보세요. 길이, 무게, 부피, 에너지, 전력, 환율, 시간대 등生活中 필요한 모든 변환을 빠르고 정확하게 처리할 수 있습니다.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default ConversionPage;
