import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, Briefcase, Landmark, PiggyBank, Building, HandCoins, FileText, Calculator as CalculatorIcon } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface Calculator {
  id: string;
  name: string;
  href: string;
}

interface Subcategory {
  id: string;
  name: string;
  calculators: Calculator[];
}

interface CategoryPageLayoutProps {
  category: {
    name: string;
    description: string;
    subcategories: Subcategory[];
  };
}

const ICONS: { [key: string]: React.ElementType } = {
  'business-calculators': Briefcase,
  'interest-and-loans': Landmark,
  'investment-calculators': PiggyBank,
  'real-estate': Building,
  'tax-calculators': HandCoins,
  default: FileText,
};

const CategoryPageLayout: React.FC<CategoryPageLayoutProps> = ({ category }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { dict, locale } = useI18n();

  const getSubcategoryName = (id: string, fallbackName: string) => {
    const translated = dict.subcategoryNames[id as keyof typeof dict.subcategoryNames];
    return translated || fallbackName;
  };

  const getCalculatorName = (id: string, fallbackName: string) => {
    const translated = dict.calculatorNames[id as keyof typeof dict.calculatorNames];
    return translated || fallbackName;
  };

  const filteredSubcategories = category.subcategories
    .map(subcategory => ({
      ...subcategory,
      calculators: subcategory.calculators.filter(calculator =>
        getCalculatorName(calculator.id, calculator.name).toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter(subcategory => subcategory.calculators.length > 0);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground leading-tight">
            {category.name} {dict.categories.titleSuffix}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {category.description}
          </p>
        </div>

        <div className="mb-10 max-w-lg mx-auto">
          <Input
            type="text"
            placeholder={dict.categories.searchPlaceholder}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-lg rounded-full shadow-sm"
          />
        </div>

        <div className="space-y-12">
          {filteredSubcategories.map(subcategory => {
            const Icon = ICONS[subcategory.id] || ICONS.default;
            return (
              <Card key={subcategory.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-2xl">
                <CardHeader className="bg-muted p-3">
                  <div className="flex items-center space-x-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <CardTitle className="text-xl font-bold text-card-foreground">
                      {getSubcategoryName(subcategory.id, subcategory.name)}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-3">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {subcategory.calculators.map(calculator => (
                      <li key={calculator.id}>
                        <Link href={calculator.href} passHref>
                          <div className="group flex items-center justify-between px-4 py-2 rounded-lg hover:bg-accent transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                              <CalculatorIcon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                              <span className="text-base font-medium text-muted-foreground group-hover:text-foreground">
                                {getCalculatorName(calculator.id, calculator.name)}
                              </span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground transform transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryPageLayout;
