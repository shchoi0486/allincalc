"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { UNIT_DEFINITIONS, convert, DEFAULT_UNITS_BY_LOCALE } from '@/utils/unitConversion';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const group1 = ['length', 'area', 'volume', 'temperature'];
const group2 = ['flow', 'pressure', 'energy', 'mass', 'enthalpy'];

const NewUnitConverter = ({ category }: { category: string }) => {
  const { dict, locale, unitSystem } = useI18n();
  const t = dict.unitConverter;
  const categoryData = UNIT_DEFINITIONS[category];

  const units = useMemo(() => {
    if (!categoryData) return [];
    return Object.keys(categoryData.units);
  }, [categoryData]);

  const [fromUnit, setFromUnit] = useState('');
  const [fromValue, setFromValue] = useState('1');
  const [convertedValues, setConvertedValues] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (categoryData && units.length > 0) {
      const localeKey = unitSystem === 'imperial' ? 'en' : 'ko';
      const defaultUnit = DEFAULT_UNITS_BY_LOCALE[localeKey]?.[category];
      setFromUnit(defaultUnit && units.includes(defaultUnit) ? defaultUnit : units[0]);
    } else {
      setFromUnit('');
    }
  }, [units, categoryData, category, unitSystem, locale]);

  useEffect(() => {
    if (!categoryData || !fromUnit || !units.includes(fromUnit)) {
      setConvertedValues({});
      return;
    }
    const value = parseFloat(fromValue);
    if (!isNaN(value)) {
      const newValues: { [key: string]: number } = {};
      units.forEach(unit => {
        newValues[unit] = convert(value, fromUnit, unit, category);
      });
      setConvertedValues(newValues);
    } else {
      setConvertedValues({});
    }
  }, [fromValue, fromUnit, category, units, categoryData]);

  if (!categoryData) return <p>{t.undefinedCategory}</p>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 relative">
        <select
          aria-label="Select unit to convert from"
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="w-[100px] border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        >
          {units.map(unit => (
            <option key={unit} value={unit}>{unit}</option>
          ))}
        </select>
        <Input
          type="number"
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
          className="text-right text-xs w-[200px]"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {units.map(unit => (
          <div key={unit} className="flex items-center justify-start gap-2">
            <span className="text-right w-[120px] text-xs py-2 px-3 bg-muted rounded-md shadow-inner">{convertedValues[unit]?.toFixed(2) || ''}</span>
            <span className="text-xs text-foreground whitespace-nowrap text-left font-bold">{unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const UnitConverterPage = () => {
  const { dict } = useI18n();
  const t = dict.unitConverter;
  const unitCategories = {
    group1: group1.map((id) => ({ id, name: dict.common.unitCategories[id as keyof typeof dict.common.unitCategories] || id })),
    group2: group2.map((id) => ({ id, name: dict.common.unitCategories[id as keyof typeof dict.common.unitCategories] || id })),
  };

  const groupLabels: { [key: string]: string } = {
    group1: t.groupLabels.group1,
    group2: t.groupLabels.group2,
  };

  const inputSection = (
    <div className="space-y-4">
      <Tabs defaultValue="group1" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="group1">{groupLabels.group1}</TabsTrigger>
          <TabsTrigger value="group2">{groupLabels.group2}</TabsTrigger>
        </TabsList>

        <TabsContent value="group1" className="mt-4">
          <Tabs defaultValue={unitCategories.group1[0].id} className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start flex-wrap gap-1">
              {unitCategories.group1.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {unitCategories.group1.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <NewUnitConverter category={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="group2" className="mt-4">
          <Tabs defaultValue={unitCategories.group2[0].id} className="w-full">
            <TabsList className="inline-flex h-10 items-center justify-start flex-wrap gap-1">
              {unitCategories.group2.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>{category.name}</TabsTrigger>
              ))}
            </TabsList>
            {unitCategories.group2.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-4">
                <NewUnitConverter category={category.id} />
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>
      </Tabs>
    </div>
  );

  const resultSection = null;

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p dangerouslySetInnerHTML={{ __html: t.calculatorDescription.p1 }} />
        <p>{t.calculatorDescription.p2}</p>
        <p>{t.calculatorDescription.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.calculatorDescription.note}
        </p>
        <TermGlossary items={t.glossary} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formulaTitle1}</h4>
          <p>{t.formulaDesc1}</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">{t.formulaFormula}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formulaExample}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formulaTitle2}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">°F = °C × 9/5 + 32</p>
            <p className="font-mono text-sm mt-1">K = °C + 273.15</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formulaDesc2}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formulaTitle3}</h4>
          <p>{t.formulaExampleDesc}</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">{t.formulaExampleResult}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title1}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items1.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title2}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items2.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title3}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items3.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title4}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items4.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title5}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items5.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.title6}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            {t.tips.items6.map((item: string, i: number) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      variant="split"
      infoSection={infoSection}
      showUnitToggle
    />
  );
};

export default UnitConverterPage;
