"use client";

import CategoryPageLayout from '@/components/calculators/CategoryPageLayout';
import { calculatorCategories } from '@/data/calculators';

const AiToolsPage = () => {
  const aiToolsCategory = calculatorCategories.find(cat => cat.id === 'ai-tools');

  if (!aiToolsCategory) {
    return <div>AI 도구 카테고리를 찾을 수 없습니다.</div>;
  }

  const categoryWithDescription = {
    ...aiToolsCategory,
    description: 'AI 기반 생산성 도구를 제공합니다. 텍스트 요약, 맞춤법 검사, 번역, 이미지 생성, 프롬프트 작성 등 다양한 AI 도구를 활용해 보세요.',
  };

  return <CategoryPageLayout category={categoryWithDescription} />;
};

export default AiToolsPage;
