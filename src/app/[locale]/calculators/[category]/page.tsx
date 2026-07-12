'use client';

import { useParams } from 'next/navigation';
import { calculators, calculatorCategories } from '@/data/calculators';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

export default function CategoryPage() {
  const params = useParams();
  const { dict } = useI18n();

  if (!params) {
    return <div>{dict.categories.loading}</div>;
  }

  const categorySlug = params.category as string;

  const category = calculatorCategories.find(cat => cat.href === `/calculators/${categorySlug}`);
  const categoryCalculators = calculators[categorySlug as keyof typeof calculators] || [];

  if (!category) {
    return <div>{dict.categories.notFound}</div>;
  }

  const categorySlugToName: Record<string, { name: string; description: string }> = {
    finance: dict.categories.finance,
    conversion: dict.categories.conversion,
    life: dict.categories.life,
    science: dict.categories.science,
    engineering: dict.categories.engineering,
    'ai-tools': dict.categories['ai-tools'],
    game: dict.categories.game,
    others: dict.categories.others,
  };
  const categoryName = categorySlugToName[categorySlug]?.name || category.name;
  const countText = dict.categories.totalCalculators.replace('{count}', String(categoryCalculators.length));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{categoryName} {dict.categories.titleSuffix}</h1>
      <p className="text-lg text-muted-foreground mb-8">{countText}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categoryCalculators.map((calculator) => (
          <Link href={`/calculators/${categorySlug}/${calculator.id}`} key={calculator.id} className="group">

            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{dict.calculatorNames[calculator.id as keyof typeof dict.calculatorNames] || calculator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{dict.calculatorDescriptions[calculator.id as keyof typeof dict.calculatorDescriptions] || calculator.description}</p>
              </CardContent>
            </Card>

          </Link>
        ))}
      </div>
    </div>
  );
}