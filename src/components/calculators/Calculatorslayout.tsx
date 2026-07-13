'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, HelpCircle, Sigma, Lightbulb } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

type LayoutVariant = 'split' | 'single' | 'grouped';

interface CalculatorsLayoutProps {
  title: string;
  description?: React.ReactNode;
  inputSection: React.ReactNode;
  resultSection: React.ReactNode;
  infoSection: {
    calculatorDescription: React.ReactNode;
    calculationFormula: React.ReactNode;
    containerSpecifications?: React.ReactNode;
    usefulTips: React.ReactNode;
  };
  /**
   * split   : 입력 | 결과 두 열 (기본값, 범용)
   * single  : 좁은 한 열에 입력→결과 세로 스택 (단일 결과·간단 계산기)
   * grouped : 입력 영역을 넓게(3/5), 결과를 2/5 (입력이 많은 계산기)
   */
  variant?: LayoutVariant;
  /**
   * 차트·상세 표 등 넓은 콘텐츠를 입력/결과 아래 전체 너비로 배치 (차트 중심형·표 중심형)
   */
  fullWidthSection?: React.ReactNode;
  fullWidthTitle?: string;
  /**
   * 미터법/야드파운드법(imperial) 전환이 실제로 필요한 계산기에서만 true (기본값: false)
   */
  showUnitToggle?: boolean;
}

const CalculatorsLayout: React.FC<CalculatorsLayoutProps> = ({
  title,
  description,
  inputSection,
  resultSection,
  infoSection,
  variant = 'split',
  fullWidthSection,
  fullWidthTitle,
  showUnitToggle = false,
}: CalculatorsLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { dict } = useI18n();

  const handleBackClick = () => {
    const pathSegments = (pathname || '').split('/').filter(segment => segment !== '');
    if (pathSegments.length > 1) {
      const parentPath = '/' + pathSegments.slice(0, -1).join('/');
      router.push(parentPath);
    } else {
      router.push('/');
    }
  };

  const infoItems = [
    {
      value: 'description',
      title: dict.calculatorLayout.description,
      content: infoSection.calculatorDescription,
      icon: <HelpCircle className="w-5 h-5" />,
    },
    {
      value: 'formula',
      title: dict.calculatorLayout.formula,
      content: infoSection.calculationFormula,
      icon: <Sigma className="w-5 h-5" />,
    },
    {
      value: 'tips',
      title: dict.calculatorLayout.tips,
      content: infoSection.usefulTips,
      icon: <Lightbulb className="w-5 h-5" />,
    },
  ];

  const gridClass =
    variant === 'single'
      ? 'grid grid-cols-1 max-w-2xl mx-auto gap-8'
      : variant === 'grouped'
        ? 'grid grid-cols-1 lg:grid-cols-5 gap-8'
        : 'grid grid-cols-1 lg:grid-cols-2 gap-8';

  const inputColClass = variant === 'grouped' ? 'lg:col-span-3' : '';
  const resultColClass = variant === 'grouped' ? 'lg:col-span-2' : '';

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <div className="text-center mb-6 relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2"
          onClick={handleBackClick}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      <div className={`${gridClass} mb-8`}>
        <Card className={inputColClass}>
          <CardHeader className="border-b">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="min-w-0">{dict.calculatorLayout.inputInfo}</CardTitle>
              {showUnitToggle && <UnitSystemToggle className="shrink-0" />}
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-4 overflow-hidden break-words">
            {inputSection}
          </CardContent>
        </Card>
        <Card className={resultColClass}>
          <CardHeader className="border-b">
            <CardTitle>{dict.calculatorLayout.result}</CardTitle>
          </CardHeader>
          <CardContent className="p-3 space-y-4 overflow-hidden break-words">
            {resultSection}
          </CardContent>
        </Card>
      </div>

      {fullWidthSection && (
        <Card className="mb-8">
          {fullWidthTitle && (
            <CardHeader className="border-b">
              <CardTitle>{fullWidthTitle}</CardTitle>
            </CardHeader>
          )}
          <CardContent className="p-3">
            {fullWidthSection}
          </CardContent>
        </Card>
      )}

      <Accordion
        type="multiple"
        defaultValue={infoItems.map(item => item.value)}
        className="w-full space-y-4"
      >
        {infoItems.map((item) => (
          <AccordionItem
            value={item.value}
            key={item.value}
            className="border rounded-lg bg-card"
          >
            <AccordionTrigger className="text-lg font-semibold hover:no-underline p-4 data-[state=open]:bg-accent/20 rounded-lg">
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-left">{item.title}</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6 pt-2">
              <div className="accordion-content-optimized">
                {typeof item.content === 'string' ? (
                  <div dangerouslySetInnerHTML={{ __html: item.content }} />
                ) : (
                  item.content
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CalculatorsLayout;
