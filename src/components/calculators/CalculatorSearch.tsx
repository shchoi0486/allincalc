'use client';

import { Input } from '@/components/ui/input';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Adsense from "@/components/ads/Adsense";
import { useI18n } from '@/i18n/I18nProvider';

export default function CalculatorSearch() {
  const { dict } = useI18n();

  return (
    <section className="container mx-auto py-6 md:py-8 lg:py-8 bg-white dark:bg-gray-900">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900 dark:text-gray-50">
              {dict.home.title}
            </h1>
            <p className="mx-auto max-w-[600px] text-gray-600 md:text-lg dark:text-gray-400">
              {dict.home.subtitle}
            </p>
          </div>
          <div className="w-full max-w-2xl">
            <Adsense />
          </div>
        </div>
      </div>
    </section>
  );
}