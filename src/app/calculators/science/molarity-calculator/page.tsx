'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>몰농도 계산기</strong>는 용액의 몰농도(molarity)를 정확하게 계산하는 화학 실험실의 핵심 도구입니다. 몰농도는 용액 1리터(L)에 녹아 있는 용질의 몰(mol) 수를 나타내는 농도의 표현 방법으로, 화학 반응의 양적 관계를 이해하는 데 가장 널리 사용되는 단위입니다.
      </p>
      <p>
        <strong>몰농도(M)</strong>는 화학에서 가장 기본적인 농도 단위로, 용액의 부피 대비 용질의 양을 나타냅니다. 몰농도의 단위는 <strong>몰 매 리터(mol/L)</strong> 또는 <strong>M(molar)</strong>이라고 표기하며, 화학 반응의 계량적 계산, 시약 준비, 용액 희석 등 다양한 실험 활동에 필수적입니다.
      </p>
      <p>
        이 계산기는 두 가지 방법으로 몰농도를 계산합니다: 직접 몰 수와 부피를 입력하는 방법, 그리고 용질의 질량과 몰 질량을 통해 간접적으로 계산하는 방법입니다. 실험실에서 시약을 준비하거나 화학 반응을 설계할 때 정확한 농도 계산이 요구되는 다양한 분야에서 활용됩니다.
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        몰농도 계산은 제약 산업, 식품 과학, 환경 분석, 임상 연구 등 광범위한 분야에서 사용됩니다. 학생들에게는 화학의 기본 개념을 이해시키는 교육 도구로서, 연구자들에게는 정확한 실험 데이터를 확보하는 데 기여하는 실용적인 도구로 가치를 발휘합니다.
      </p>
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">몰농도 기본 공식</h4>
        <p>몰농도는 용질의 몰 수를 용액의 부피로 나누어 계산합니다.</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">M = n / V</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">M</span>은 몰농도(molarity)를 나타내며, 단위는 mol/L(M)입니다.</li>
          <li><span className="font-semibold">n</span>은 용질의 몰 수(moles)를 나타내며, 단위는 mol입니다.</li>
          <li><span className="font-semibold">V</span>는 용액의 부피(volume)를 나타내며, 단위는 리터(L)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">질량 기반 계산 공식</h4>
        <p>용질의 질량과 몰 질량을 통해 몰 수를 구한 후 몰농도를 계산합니다.</p>
        <div className="my-4 p-4 bg-muted rounded-lg text-center">
          <p className="font-mono text-xl font-bold">M = (m / MW) / V</p>
        </div>
        <ul className="list-disc list-inside space-y-2">
          <li><span className="font-semibold">m</span>은 용질의 질량(mass)을 나타내며, 단위는 그램(g)입니다.</li>
          <li><span className="font-semibold">MW</span>는 용질의 몰 질량(molecular weight)을 나타내며, 단위는 g/mol입니다.</li>
          <li><span className="font-semibold">V</span>는 용액의 부피(volume)를 나타내며, 단위는 리터(L)입니다.</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">계산 예시</h4>
        <p>예를 들어, NaCl(식염) 58.44g을 물에 녹여 부피를 1L로 만들었다면?</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">M = (58.44g ÷ 58.44g/mol) ÷ 1L = 1M</p>
        </div>
        <p>따라서 이 용액의 몰농도는 1M(1 몰러)이며, 1L당 1몰의 NaCl이 용해되어 있습니다.</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">농도 단위 변환</h4>
        <p>몰농도는 다양한 농도 단위로 변환될 수 있습니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>몰농도(M):</strong> mol/L - 화학에서 가장 일반적으로 사용</li>
          <li><strong>질량농도:</strong> g/L - 질량 기반 농도 표현</li>
          <li><strong>몰분율:</strong> mol/kg - 용매 기준 농도 (고온고압 실험에 유용)</li>
          <li><strong>부피분율:</strong> mL/L - 부피 기반 농도 표현</li>
          <li><strong>백분율:</strong> % - 전체 대비 비율 표현</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">희석 공식 활용</h4>
        <p>농도를 변경할 때 M₁V₁ = M₂V₂ 공식을 사용합니다.</p>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>희석:</strong> 원액을 희석하여 원하는 농도의 용액 준비</li>
          <li><strong>농축:</strong> 용매를 증발시켜 농도를 높임</li>
          <li><strong>혼합:</strong> 서로 다른 농도의 용액을 혼합</li>
        </ul>
      </div>
      <div className="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
        <p className="font-bold text-sm">⚠️ 주의사항</p>
        <p className="text-xs mt-1">
          몰농도 계산 시 용액의 부피는 용질이 용해된 후의 최종 부피를 기준으로 합니다. 용질을 용매에 녹이면 부피가 변할 수 있으므로, 반드시 최종 부피를 측정하여 사용해야 합니다.
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>제약 산업:</strong> 약물의 농도를 정확히 조절하여 의약품 제조</li>
          <li><strong>식품 산업:</strong> 첨가물, 방부제, 향신료 등의 농도 조절</li>
          <li><strong>환경 과학:</strong> 수질 오염도 측정, 대기 오염물질 분석</li>
          <li><strong>임상 연구:</strong> 혈액, 소변 등 생체 시료의 분석</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실험실 팁</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>정밀 계량:</strong> 전자 저울을 사용하여 정확한 질량 측정</li>
          <li><strong>완전 용해:</strong> 용질이 완전히 녹을 때까지 충분히 교반</li>
          <li><strong>온도 확인:</strong> 온도에 따라 부피가 변할 수 있으므로 주의</li>
          <li><strong>안전 장비:</strong> 실험 시 보안경, 장갑 등 안전 장비 착용</li>
        </ul>
      </div>
    </div>
  ),
};

export default function MolarityCalculatorPage() {
  const [moles, setMoles] = useState('');
  const [volume, setVolume] = useState('');
  const [molarity, setMolarity] = useState<number | null>(null);

  const [mass, setMass] = useState('');
  const [molecularWeight, setMolecularWeight] = useState('');
  const [massVolume, setMassVolume] = useState('');
  const [massMolarity, setMassMolarity] = useState<number | null>(null);
  const [massMoles, setMassMoles] = useState<number | null>(null);

  const handleDirectCalculate = useCallback(() => {
    const n = parseFloat(moles);
    const v = parseFloat(volume);
    if (!isNaN(n) && !isNaN(v) && v !== 0) {
      setMolarity(n / v);
    } else {
      setMolarity(null);
    }
  }, [moles, volume]);

  const handleDirectReset = useCallback(() => {
    setMoles('');
    setVolume('');
    setMolarity(null);
  }, []);

  const handleMassCalculate = useCallback(() => {
    const m = parseFloat(mass);
    const mw = parseFloat(molecularWeight);
    const v = parseFloat(massVolume);
    if (!isNaN(m) && !isNaN(mw) && !isNaN(v) && mw !== 0 && v !== 0) {
      const molesValue = m / mw;
      setMassMoles(molesValue);
      setMassMolarity(molesValue / v);
    } else {
      setMassMoles(null);
      setMassMolarity(null);
    }
  }, [mass, molecularWeight, massVolume]);

  const handleMassReset = useCallback(() => {
    setMass('');
    setMolecularWeight('');
    setMassVolume('');
    setMassMoles(null);
    setMassMolarity(null);
  }, []);

  const inputSection = (
    <Tabs defaultValue="direct">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="direct">직접 계산</TabsTrigger>
        <TabsTrigger value="mass">질량 기반</TabsTrigger>
      </TabsList>
      <TabsContent value="direct" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="moles">몰 수 (mol)</Label>
          <Input
            id="moles"
            type="number"
            value={moles}
            onChange={(e) => setMoles(e.target.value)}
            placeholder="예: 1"
          />
        </div>
        <div>
          <Label htmlFor="volume">용액의 부피 (L)</Label>
          <Input
            id="volume"
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="예: 1"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleDirectCalculate} className="flex-1">계산하기</Button>
          <Button onClick={handleDirectReset} variant="outline" className="flex-1">초기화</Button>
        </div>
      </TabsContent>
      <TabsContent value="mass" className="space-y-4 mt-4">
        <div>
          <Label htmlFor="mass">용질의 질량 (g)</Label>
          <Input
            id="mass"
            type="number"
            value={mass}
            onChange={(e) => setMass(e.target.value)}
            placeholder="예: 58.44"
          />
        </div>
        <div>
          <Label htmlFor="molecularWeight">몰 질량 (g/mol)</Label>
          <Input
            id="molecularWeight"
            type="number"
            value={molecularWeight}
            onChange={(e) => setMolecularWeight(e.target.value)}
            placeholder="예: 58.44"
          />
        </div>
        <div>
          <Label htmlFor="massVolume">용액의 부피 (L)</Label>
          <Input
            id="massVolume"
            type="number"
            value={massVolume}
            onChange={(e) => setMassVolume(e.target.value)}
            placeholder="예: 1"
          />
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleMassCalculate} className="flex-1">계산하기</Button>
          <Button onClick={handleMassReset} variant="outline" className="flex-1">초기화</Button>
        </div>
      </TabsContent>
    </Tabs>
  );

  const resultSection = (
    <Tabs defaultValue="direct">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="direct">직접 계산 결과</TabsTrigger>
        <TabsTrigger value="mass">질량 기반 결과</TabsTrigger>
      </TabsList>
      <TabsContent value="direct" className="mt-4">
        {molarity !== null ? (
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">계산된 몰농도</p>
            <p className="text-2xl font-bold">{molarity.toFixed(4)} M</p>
            <p className="text-sm text-muted-foreground mt-2">
              {molarity.toFixed(4)} mol/L
            </p>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="mass" className="mt-4">
        {massMolarity !== null && massMoles !== null ? (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="text-sm text-muted-foreground">계산된 몰농도</p>
              <p className="text-2xl font-bold">{massMolarity.toFixed(4)} M</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">몰 수</p>
                <p className="text-lg font-bold">{massMoles.toFixed(4)} mol</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-xs text-muted-foreground">몰농도</p>
                <p className="text-lg font-bold">{massMolarity.toFixed(4)} mol/L</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-lg text-muted-foreground">계산하기 버튼을 클릭하여 결과를 확인하세요.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );

  return (
    <CalculatorsLayout
      title="몰농도 계산기"
      description="몰 수와 부피를 입력하여 용액의 몰농도를 계산합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
