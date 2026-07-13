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
import { ArrowRight, Briefcase, Landmark, PiggyBank, Building, HandCoins, FileText, Calculator as CalculatorIcon, Coins, Percent, Divide, Sigma, BarChart, Shield, Calendar, Heart, Ruler, ArrowLeftRight, Zap, Wind, Droplets, FlaskConical, Cpu, Gamepad2, Sparkles, Bot, Code, Palette, Timer, Globe, Binary, Link2, Search, Lock, Minimize2, Maximize2, Hash, Mail, Type, Notebook, Wifi, Square, Triangle, Circle, Leaf, Brain, TestTube, Anchor, Sun, Cloud, Flame, DraftingCompass, Rocket, Trophy, Gem, Key, Layers, Monitor, Music, ShoppingCart, Truck, Utensils, Wrench, BookOpen, Waves, HardDrive, Box, Image, FileJson, FileCode, QrCode, Keyboard, Dice5, Beaker, Car, TrendingUp, Receipt, Clock, GraduationCap, Building2, HeartPulse, Scale, Activity } from 'lucide-react';

const CALCULATOR_ICONS: Record<string, React.ElementType> = {
  // 금융
  'loan-interest': Coins,
  'early-repayment-fee': FileText,
  'dti': Percent,
  'dsr-calculator': Percent,
  'installment-interest': Divide,
  'compound-interest': Sigma,
  'installment-savings-monthly-compound-interest': Coins,
  'principal-equal-amortization': BarChart,
  'principal-and-interest-equal-repayment': BarChart,
  'amortization-schedule': BarChart,
  'credit-card-installment-fee': HandCoins,
  'mortgage-calculator': Building,
  'property-tax-calculator': Building,
  'jeonse-deposit-calculator': Building2,
  'charter-loan-calculator': Building2,
  'vat-calculator': Percent,
  'ordinary-wage': Coins,
  'insurance': Shield,
  'retirement': Coins,
  'annual-leave': Calendar,
  'net-salary-calculator': Coins,
  'salary-calculator': Coins,
  'income-tax-calculator': Receipt,
  'stock-compound-interest': BarChart,
  'cagr': BarChart,
  'deposit-interest': Coins,
  'regular-installment-savings': Coins,
  'free-installment-savings': Coins,
  'inflation-calculator': TrendingUp,
  'interest-rate-calculator': Percent,
  'auto-loan-calculator': Car,
  // 변환
  'unit-converter': ArrowLeftRight,
  'conversion-page': ArrowLeftRight,
  'data-size-converter': HardDrive,
  'distance-converter': Ruler,
  'speed-converter': Wind,
  'weight-converter': Minimize2,
  'volume-converter': Droplets,
  'energy-converter': Zap,
  'power-converter': Zap,
  'currency-converter': Coins,
  'timezone-converter': Globe,
  'korean-shoe-size-converter': Ruler,
  'korean-clothing-size-converter': Ruler,
  // 일상
  'bmi-calculator': Heart,
  'bmr-calculator': Heart,
  'weight-loss-calculator': Heart,
  'calorie-calculator': HeartPulse,
  'body-fat-calculator': Activity,
  'ideal-weight-calculator': Scale,
  'pace-calculator': Timer,
  'due-date-calculator': Calendar,
  'korean-age-calculator': Calendar,
  'anniversary-calculator': Calendar,
  'date-difference-calculator': Calendar,
  'countdown-timer': Timer,
  'holiday-calendar': Calendar,
  'time-calculator': Clock,
  'hours-calculator': Clock,
  'discount-calculator': Percent,
  'sales-tax-calculator': Receipt,
  'cbm-calculator': Box,
  'moving-cost-calculator': Truck,
  'qr-generator': QrCode,
  'password-generator': Lock,
  'color-picker': Palette,
  'text-difference': FileText,
  'typing-speed': Keyboard,
  'coin-flip': Coins,
  'virtual-dice': Dice5,
  'notepad': Notebook,
  'gpa-calculator': GraduationCap,
  'concrete-calculator': Box,
  // 과학
  'velocity-calculator': Wind,
  'kinetic-energy-calculator': Zap,
  'torque-calculator': Zap,
  'force-calculator': Zap,
  'molarity-calculator': FlaskConical,
  'molar-mass-calculator': FlaskConical,
  'solution-dilution-calculator': Droplets,
  'percentage-calculator': Percent,
  'fraction-calculator': Divide,
  'triangle-calculator': Triangle,
  'standard-deviation-calculator': Sigma,
  // 엔지니어링
  'free-fall': ArrowLeftRight,
  'beam-deflection': Ruler,
  'spring-rate': Ruler,
  'gear-ratio': Cpu,
  'bearing-life': Cpu,
  'torque-power': Zap,
  'centrifuge': Timer,
  'asce7-wind-load': Wind,
  'korean-wind-load': Wind,
  'stress-strain': Ruler,
  'euler-buckling': Ruler,
  'mannings-equation': Droplets,
  'hydraulic-jump': Droplets,
  'npsh': Droplets,
  'pump-power': Zap,
  'pump-affinity': Droplets,
  'specific-speed': Droplets,
  'tank-volume': Droplets,
  'pipe-friction': Droplets,
  'reynolds-number': Droplets,
  'bernoulli': Droplets,
  'water-hammer': Droplets,
  'orifice-flow': Droplets,
  'cyclone-efficiency': Wind,
  'iso-2533-atmosphere': Cloud,
  'iso-1127-pipe': Droplets,
  'din-10220-pipe': Droplets,
  'asme-b313': Droplets,
  'barlows-formula': Droplets,
  'asme-section-viii': Droplets,
  'api-650-tank': Droplets,
  'heat-transfer': Flame,
  'radiation-heat': Flame,
  'carnot-efficiency': Flame,
  'u-value': Flame,
  'lmtd': Flame,
  'tube-pressure-drop': Droplets,
  'sound-pressure': Waves,
  'sensible-heat': Wind,
  'psychrometric': Wind,
  'cooling-tower': Wind,
  'duct-friction': Wind,
  'ohms-law': Zap,
  'voltage-drop': Zap,
  'rc-circuit': Zap,
  'ac-power': Zap,
  'ideal-gas': FlaskConical,
  'api-gravity': FlaskConical,
  'material-comparison': Beaker,
  'corrosion-compatibility': Beaker,
  'thermal-expansion': Flame,
  'pressure-converter': ArrowLeftRight,
  'flow-rate-converter': ArrowLeftRight,
  'water-density': Droplets,
  'specific-gravity': Droplets,
  'pipe-sizing': Droplets,
  'wire-gauge': Zap,
  'moment-of-inertia': Ruler,
  'heat-capacity': Flame,
  'dew-point': Cloud,
  'convection-heat-transfer': Flame,
  // AI 도구
  'text-summarizer': FileText,
  'lorem-ipsum-generator': FileText,
  'image-resizer': Image,
  'image-converter': Image,
  'json-generator': FileJson,
  'xml-generator': FileCode,
  'yaml-generator': FileCode,
  'json-prettifier': FileJson,
  'json-minifier': FileJson,
  'base64-encoder': Code,
  'base64-decoder': Code,
  'url-encoder': Link2,
  'url-decoder': Link2,
  'morse-code': Hash,
  'prompt-generator': Sparkles,
  'code-explainer': Code,
  'meeting-notes': FileText,
  // 게임
  'dps-calculator': Gamepad2,
  // 기타
  'random-number-generator': Dice5,
  'random-string-generator': Hash,
  'random-email-generator': Mail,
  'invoice-generator': FileText,
  'internet-speed-test': Wifi,
  'ip-lookup': Globe,
  'subnet-calculator': Globe,
};

import { useI18n } from '@/i18n/I18nProvider';

interface Calculator {
  id: string;
  name: string;
  href: string;
  locales?: string[];
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
      calculators: subcategory.calculators.filter(calculator => {
        const nameMatch = getCalculatorName(calculator.id, calculator.name).toLowerCase().includes(searchTerm.toLowerCase());
        const localeMatch = !calculator.locales || calculator.locales.includes(locale);
        return nameMatch && localeMatch;
      }),
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
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                    {subcategory.calculators.map(calculator => (
                      <li key={calculator.id}>
                        <Link href={calculator.href} passHref>
                          <div className="group flex items-center justify-between px-4 py-2 rounded-lg hover:bg-accent transition-colors duration-200">
                            <div className="flex items-center space-x-3">
                              {(() => {
                                const Icon = CALCULATOR_ICONS[calculator.id] || CalculatorIcon;
                                return <Icon className="w-5 h-5 shrink-0 text-muted-foreground group-hover:text-primary" />;
                              })()}
                              <span className="text-base font-medium text-muted-foreground group-hover:text-foreground min-w-0 truncate">
                                {getCalculatorName(calculator.id, calculator.name)}
                              </span>
                            </div>
                            <ArrowRight className="w-5 h-5 text-muted-foreground transform transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary shrink-0" />
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
