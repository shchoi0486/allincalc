"use client";

import { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { UNIT_DEFINITIONS, convert } from '@/utils/unitConversion';

const group1 = ['length', 'area', 'volume', 'temperature'];
const group2 = ['flow', 'pressure', 'energy', 'mass', 'enthalpy'];

const groupLabels: { [key: string]: string } = {
  group1: '기본 단위',
  group2: '공학 단위',
};

const unitCategories = {
  group1: group1.map(id => ({ id, name: UNIT_DEFINITIONS[id]?.name || id })),
  group2: group2.map(id => ({ id, name: UNIT_DEFINITIONS[id]?.name || id })),
};

const NewUnitConverter = ({ category }: { category: string }) => {
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
      setFromUnit(units[0]);
    } else {
      setFromUnit('');
    }
  }, [units, categoryData]);

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

  if (!categoryData) return <p>정의되지 않은 단위 카테고리입니다.</p>;

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
        <p>
          <strong>통합 단위 변환기</strong>는 기본 단위(길이, 면적, 체적, 온도)와 공학 단위(유량, 압력, 에너지, 질량, 엔탈피)를 하나의 화면에서 모두 변환할 수 있는 실용적인 도구입니다.
        </p>
        <p>
          변환할 단위를 선택하고 값을 입력하면, 해당 카테고리의 모든 단위로 자동 변환된 결과를 한눈에 확인할 수 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p>변환 공식: <code>대상값 = 입력값 × (대상 단위 계수 / 기준 단위 계수)</code></p>
        <p>온도 변환은 선형 변환이 아닌 별도 공식을 사용합니다.</p>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <h4 className="font-semibold">활용 팁</h4>
        <ul className="list-disc list-inside space-y-2">
          <li>기본 단위 탭에서는 일상적으로 자주 사용하는 길이, 면적, 체적, 온도 변환을 할 수 있습니다.</li>
          <li>공학 단위 탭에서는 산업 현장에서 사용되는 유량, 압력, 에너지 등의 전문 단위를 변환할 수 있습니다.</li>
          <li>드롭다운에서 기준 단위를 선택하고 값을 입력하면 모든 단위로 동시에 변환됩니다.</li>
        </ul>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="통합 단위 변환기"
      description="기본 단위 및 공학 단위를 빠르게 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default UnitConverterPage;
