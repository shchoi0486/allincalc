'use client';

import { Card, CardContent } from '@/components/ui/card';
import { calculatorCategories } from '@/data/calculators';
import Link from 'next/link';
import { useI18n } from '@/i18n/I18nProvider';

export default function AllCalculators() {
  const { dict } = useI18n();

  const getCategoryName = (id: string, fallbackName: string) => {
    const cat = dict.categories[id as keyof typeof dict.categories];
    return (cat && typeof cat === 'object' && 'name' in cat) ? cat.name : fallbackName;
  };

  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <h2 className="mb-5 text-center text-2xl font-extrabold tracking-tight text-foreground">
          {dict.common.categories}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {calculatorCategories.map((category) => (
            <Link href={category.href} key={category.name} className="group">
              <Card className="h-full flex flex-col items-center justify-center p-4 md:p-6 rounded-xl border border-border bg-card transition-colors duration-200 hover:border-primary/40">
                <CardContent className="flex flex-col items-center justify-center space-y-2 md:space-y-3 p-0">
                  <div className="hidden sm:block p-3 rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <category.icon className="w-6 h-6 md:w-7 h-7" />
                  </div>
                  <span className="text-base md:text-lg font-bold text-center text-foreground">
                    {getCategoryName(category.id, category.name)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}