'use client';

import React, { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  icon: ReactNode;
  children: ReactNode;
  visualizationComponent: ReactNode;
  resultComponent: ReactNode;
  infoSection?: {
    calculatorDescription: ReactNode;
    calculationFormula: ReactNode;
    usefulTips: ReactNode;
  };
}

export default function CalculatorLayout({
  title,
  description,
  icon,
  children,
  visualizationComponent,
  resultComponent,
  infoSection,
}: CalculatorLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { dict, locale } = useI18n();

  // Navigate to the parent listing (category) page, e.g. /en/calculators/engineering
  const parentHref =
    (pathname || '').split('/').slice(0, -1).join('/') || `/${locale || 'en'}`;

  const t = dict?.calculatorLayout;
  const backLabel = dict?.common?.back ?? 'Back';

  return (
    <div className="container mx-auto p-4">
      {/* 네비게이션 헤더 */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {icon} {title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {description}
            </p>
          </div>

          <button
            onClick={() => router.push(parentHref)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-1 px-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">{backLabel}</span>
          </button>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 gap-3">
        {/* 좌측: 입력 조건 */}
        <div>
            {children}
        </div>

        {/* 우측: 3D 시각화 및 계산 결과 */}
        <div className="space-y-6">
            {visualizationComponent}
            {resultComponent}
        </div>
      </div>

      {/* 정보 섹션 */}
      {infoSection && (
        <div className="mt-8 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">{t?.description ?? 'Calculator Description'}</h3>
            <div className="text-muted-foreground">
              {infoSection.calculatorDescription}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">{t?.formula ?? 'Formula'}</h3>
            <div className="text-muted-foreground">
              {infoSection.calculationFormula}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">{t?.tips ?? 'Useful Tips'}</h3>
            <div className="text-muted-foreground">
              {infoSection.usefulTips}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}