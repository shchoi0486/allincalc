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
          <strong>통합 단위 변환기</strong>는 길이, 면적, 부피, 온도 등 기본 단위와 유량, 압력, 에너지, 질량, 엔탈피 등 공학 단위를 하나의 화면에서 모두 변환할 수 있는 실용적인 도구입니다. 드롭다운에서 단위를 선택하고 값을 입력하면 해당 카테고리의 모든 단위로 자동 환산된 결과를 한눈에 확인할 수 있습니다.
        </p>
        <p>
          일상생활에서는 집 꾸미기, 요리, 운동 기록 등에서 자주 단위 환산이 필요하고, 산업 현장과 연구소에서는 설계 도면, 시험 데이터, 해외 규격을 다룰 때 전문 단위 변환이 필수적입니다. 이 도구는 기본 탭과 공학 탭으로 나뉘어 누구나 쉽게 사용할 수 있습니다.
        </p>
        <p>
          학생과 교사에게는 단위 개념을 익히는 학습 자료로, 엔지니어와 기술자에게는 도면과 시방서를 검토하는 실무 도구로 유용합니다. 또한 수입 장비의 사양서를 읽거나 해외 문헌을 번역할 때도 큰 도움이 됩니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          변환 계수는 국제 단위계(SI)와 널리 통용되는 표준을 따릅니다. 다만 온도(°C, °F, K)는 단순 비례가 아닌 별도의 선형 공식으로 계산되므로 다른 단위와 혼동하지 않도록 주의하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">선형 단위 변환 공식</h4>
          <p>길이, 면적, 부피, 질량 등 비례 단위는 기준 단위 계수를 이용해 환산합니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-xl font-bold">대상값 = 입력값 × (대상 단위 계수 / 기준 단위 계수)</p>
          </div>
          <p className="text-sm text-muted-foreground">예: 1 m = 100 cm = 1,000 mm, 1 km = 1,000 m</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">온도 변환 공식</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">°F = °C × 9/5 + 32</p>
            <p className="font-mono text-sm mt-1">K = °C + 273.15</p>
          </div>
          <p className="text-sm text-muted-foreground">온도는 영점이 다르므로 곱셈과 덧셈이 함께 적용됩니다.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">계산 예시</h4>
          <p>5 km를 m과 cm로 변환하면:</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">5 km × 1,000 = 5,000 m = 500,000 cm</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">기본 단위 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>길이, 면적, 부피, 온도는 일상에서 가장 자주 쓰이는 단위입니다.</li>
            <li>집 인테리어나 운동 기록 정리에 기본 탭을 활용하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">공학 단위 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>유량, 압력, 에너지, 질량, 엔탈피는 플랜트와 기계 설계에 사용됩니다.</li>
            <li>해외 장비 사양서의 단위를 국내 기준으로 바꿀 때 유용합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">온도 변환 주의</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>섭씨, 화씨, 절대온도(K)는 선형 공식으로 따로 계산합니다.</li>
            <li>영점이 다르므로 비례 단위와 혼동하지 마세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">소수점과 유효숫자</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>측정값의 정밀도에 맞춰 결과의 자릿수를 조정하세요.</li>
            <li>과도한 소수점은 오히려 신뢰도를 떨어뜨릴 수 있습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">단위 접두어 익히기</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>k(킬로)=1,000, m(밀리)=0.001, µ(마이크로)=0.000001 배수입니다.</li>
            <li>접두어만 바꿔도 계산이 쉬워집니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">검증 습관</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중요한 설계 값은 계산기를 바꿔 두 번 이상 확인하세요.</li>
            <li>특히 압력과 에너지 단위는 차원이 잘못되기 쉽습니다.</li>
          </ul>
        </div>
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
