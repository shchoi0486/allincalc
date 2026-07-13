import AllCalculators from '@/components/AllCalculators';
import CalculatorSearch from '@/components/calculators/CalculatorSearch';
import CalculatorCategories from '@/components/calculators/CalculatorCategories';
import ScientificCalculator from '@/components/calculators/ScientificCalculator';
import FooterSection from '@/components/sections/FooterSection';
import { Card, CardContent } from "@/components/ui/card";
import CombinedUnitConverter from '@/components/calculators/CombinedUnitConverter';
import { en } from '@/i18n/dictionaries/en';
import { ko } from '@/i18n/dictionaries/ko';
import { isLocale, type Locale } from '@/i18n/config';

import { locales } from '@/i18n/config';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function Home({ params }: { params: { locale: string } }) {
  const locale = isLocale(params.locale) ? (params.locale as Locale) : 'en';
  const dict = locale === 'ko' ? ko : en;

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <section className="text-center">
          {/* 애드센스/쿠팡 광고 삽입 영역 */}
          <div className="ad-placeholder my-3 p-6 border border-dashed rounded-lg">
            <p className="text-gray-500">{dict.home.adPlaceholder}</p>
          </div>
          <div className="mt-4 mx-auto">
            <CalculatorSearch />
          </div>
        </section>

        <AllCalculators />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-stretch">
          <div className="lg:col-span-1 h-full">
            <CombinedUnitConverter />
          </div>
          <div className="lg:col-span-1">
            <ScientificCalculator />
          </div>
        </div>
        <CalculatorCategories />

      </div>
      <FooterSection dict={dict} />
    </>
  );
}
