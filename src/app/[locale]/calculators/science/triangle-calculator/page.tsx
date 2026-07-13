'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

export default function TriangleCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [mode, setMode] = useState('SAS');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<any>(null);

  const update = (key: string, val: string) => setInputs(prev => ({ ...prev, [key]: val }));

  const calculate = useCallback(() => {
    const v = (key: string) => parseFloat(inputs[key] || '');
    const deg2rad = (d: number) => (d * Math.PI) / 180;
    const rad2deg = (r: number) => (r * 180) / Math.PI;

    let sides: Record<string, number> = {};
    let angles: Record<string, number> = {};
    let area = 0;

    if (mode === 'SAS') {
      const a = v('a'), b = v('b'), C = v('C');
      if (isNaN(a) || isNaN(b) || isNaN(C)) { setResult(null); return; }
      const Crad = deg2rad(C);
      const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(Crad));
      const A = rad2deg(Math.asin((a * Math.sin(Crad)) / c));
      const B = 180 - A - C;
      sides = { a, b, c }; angles = { A, B, C };
      area = 0.5 * a * b * Math.sin(Crad);
    } else if (mode === 'ASA') {
      const A = v('A'), b = v('b'), B = v('B');
      if (isNaN(A) || isNaN(b) || isNaN(B)) { setResult(null); return; }
      const C = 180 - A - B;
      if (C <= 0) { setResult(null); return; }
      const Arad = deg2rad(A), Brad = deg2rad(B), Crad = deg2rad(C);
      const a = (b * Math.sin(Arad)) / Math.sin(Crad);
      const c = (b * Math.sin(Crad)) / Math.sin(Crad);
      sides = { a, b, c }; angles = { A, B, C };
      area = 0.5 * a * b * Math.sin(Crad);
    } else if (mode === 'SSS') {
      const a = v('a'), b = v('b'), c = v('c');
      if (isNaN(a) || isNaN(b) || isNaN(c)) { setResult(null); return; }
      if (a + b <= c || b + c <= a || a + c <= b) { setResult(null); return; }
      const A = rad2deg(Math.acos((b * b + c * c - a * a) / (2 * b * c)));
      const B = rad2deg(Math.acos((a * a + c * c - b * b) / (2 * a * c)));
      const C = 180 - A - B;
      const s = (a + b + c) / 2;
      area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
      sides = { a, b, c }; angles = { A, B, C };
    } else if (mode === 'AAS') {
      const A = v('A'), B = v('B'), a = v('a');
      if (isNaN(A) || isNaN(B) || isNaN(a)) { setResult(null); return; }
      const C = 180 - A - B;
      if (C <= 0) { setResult(null); return; }
      const Arad = deg2rad(A), Crad = deg2rad(C);
      const b = (a * Math.sin(deg2rad(B))) / Math.sin(Arad);
      const c = (a * Math.sin(Crad)) / Math.sin(Arad);
      sides = { a, b, c }; angles = { A, B, C };
      area = 0.5 * a * b * Math.sin(Crad);
    }
    setResult({ sides, angles, area });
  }, [mode, inputs]);

  const reset = () => { setInputs({}); setResult(null); };

  const inputFields: Record<string, { ko: string; en: string }[]> = {
    SAS: [{ ko: '변 a', en: 'Side a' }, { ko: '변 b', en: 'Side b' }, { ko: '각 C (도)', en: 'Angle C (°)' }],
    ASA: [{ ko: '각 A (도)', en: 'Angle A (°)' }, { ko: '변 b', en: 'Side b' }, { ko: '각 B (도)', en: 'Angle B (°)' }],
    SSS: [{ ko: '변 a', en: 'Side a' }, { ko: '변 b', en: 'Side b' }, { ko: '변 c', en: 'Side c' }],
    AAS: [{ ko: '각 A (도)', en: 'Angle A (°)' }, { ko: '각 B (도)', en: 'Angle B (°)' }, { ko: '변 a', en: 'Side a' }],
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('계산 모드', 'Calculation Mode')}</Label>
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="SAS">SAS</TabsTrigger>
            <TabsTrigger value="ASA">ASA</TabsTrigger>
            <TabsTrigger value="SSS">SSS</TabsTrigger>
            <TabsTrigger value="AAS">AAS</TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-xs text-muted-foreground mt-1">
          {mode === 'SAS' && L('양변 + 포합각: 두 변과 그 사이 각', 'Two sides + included angle')}
          {mode === 'ASA' && L('양각 + 포합변: 두 각과 그 사이 변', 'Two angles + included side')}
          {mode === 'SSS' && L('삼변: 세 변의 길이', 'Three sides')}
          {mode === 'AAS' && L('양각 + 비포합변: 두 각과 한 변', 'Two angles + a non-included side')}
        </p>
      </div>
      {inputFields[mode].map((field) => (
        <div key={field.en}>
          <Label>{isKo ? field.ko : field.en}</Label>
          <Input type="number" value={inputs[field.en] || ''} onChange={e => update(field.en, e.target.value)} placeholder="0" />
        </div>
      ))}
      <div className="flex space-x-2">
        <Button onClick={calculate} className="flex-1">{L('계산', 'Calculate')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{L('변의 길이', 'Side Lengths')}</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">a</p><p className="font-bold">{result.sides.a.toFixed(4)}</p></div>
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">b</p><p className="font-bold">{result.sides.b.toFixed(4)}</p></div>
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">c</p><p className="font-bold">{result.sides.c.toFixed(4)}</p></div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">{L('각의 크기', 'Angle Measures')}</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">A</p><p className="font-bold">{result.angles.A.toFixed(2)}°</p></div>
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">B</p><p className="font-bold">{result.angles.B.toFixed(2)}°</p></div>
              <div className="p-2 bg-card rounded"><p className="text-xs text-muted-foreground">C</p><p className="font-bold">{result.angles.C.toFixed(2)}°</p></div>
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('넓이', 'Area')}</p>
            <p className="text-2xl font-bold">{result.area.toFixed(4)}</p>
            <p className="text-xs text-muted-foreground mt-1">= 0.5 × a × b × sin(C)</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? ' 값을 입력하세요' : 'Enter values to calculate'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('삼각형 계산기', 'Triangle Calculator')}</strong>{L('는 삼각형의 알려진 변과 각의 정보를 기반으로 나머지 모든 변과 각, 넓이를 계산하는 기하학 도구입니다.', ' is a geometry tool that calculates all missing sides, angles, and area of a triangle based on known side and angle information.')}
        </p>
        <p>
          {L('삼각형을 정의하는 데 필요한 최소 조건에 따라 네 가지 계산 모드를 제공합니다:', 'Four calculation modes are provided based on the minimum conditions needed to define a triangle:')}
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>SAS</strong> - {L('양변과 포합각: 두 변과 그 사이의 각', 'Two sides and included angle')}</li>
          <li><strong>ASA</strong> - {L('양각과 포합변: 두 각과 그 사이의 변', 'Two angles and included side')}</li>
          <li><strong>SSS</strong> - {L('삼변: 세 변의 길이', 'Three sides')}</li>
          <li><strong>AAS</strong> - {L('양각과 비포합변: 두 각과 한 변', 'Two angles and a non-included side')}</li>
        </ul>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('삼각형의 세 각의 합은 항상 180°이며, 삼각형 부등식(임의의 두 변의 합이 나머지 변보다 커야 함)을 만족해야 합니다.', 'The sum of the three angles of a triangle is always 180°, and the triangle inequality (the sum of any two sides must be greater than the third side) must be satisfied.')}
        </p>
        <TermGlossary items={[
          { term: L('삼비(정비)', 'SSS'), desc: L('세 변의 길이만으로 삼각형을 정의하는 경우입니다.', 'When a triangle is defined by the lengths of three sides only.') },
          { term: L('양변+각(SAS)', 'SAS'), desc: L('두 변과 그 사이의 각이 주어진 경우입니다.', 'When two sides and the included angle are given.') },
          { term: L('코사인 법칙', 'Law of Cosines'), desc: L('c² = a² + b² - 2ab·cos(C): 임의의 삼각형에서 변과 각의 관계를 나타내는 공식입니다.', 'c² = a² + b² - 2ab·cos(C): Formula expressing the relationship between sides and angles in any triangle.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('코사인 법칙 (Law of Cosines)', 'Law of Cosines')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">c² = a² + b² - 2ab·cos(C)</p>
          </div>
          <p className="text-sm">{L('세 번째 변을 구할 때 사용합니다.', 'Used to find the third side.')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('사인 법칙 (Law of Sines)', 'Law of Sines')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">a/sin(A) = b/sin(B) = c/sin(C)</p>
          </div>
          <p className="text-sm">{L(' 알려진 변-각 쌍을 이용해 나머지를 구할 때 사용합니다.', 'Used to find the remaining parts using a known side-angle pair.')}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('넓이 공식', 'Area Formulas')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center space-y-2">
            <p className="font-mono text-lg font-bold">Area = 0.5 × a × b × sin(C)</p>
            <p className="font-mono text-sm">= √(s(s-a)(s-b)(s-c))  {L('(헤론의 공식)', "(Heron's formula)")}</p>
            <p className="text-xs text-muted-foreground">s = (a + b + c) / 2</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('삼각형의 성질', 'Triangle Properties')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{L('세 각의 합 = 180°', 'Sum of three angles = 180°')}</li>
            <li>{L('삼각형 부등식: 임의의 두 변의 합 > 나머지 변', 'Triangle inequality: sum of any two sides > remaining side')}</li>
            <li>{L('큰 변은 큰 각에 맞닿아 있다', 'A larger side is opposite a larger angle')}</li>
            <li>{L('이등변삼각형: 두 변이 같으면 두 밑각도 같다', 'Isosceles triangle: two equal sides means two equal base angles')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('특수한 삼각형', 'Special Triangles')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>{L('직각삼각형:', 'Right triangle:')}</strong> {L('한 각이 90°, 피타고라스 정리 (a² + b² = c²)', 'One angle is 90°, Pythagorean theorem (a² + b² = c²)')}</li>
            <li><strong>{L('정삼각형:', 'Equilateral triangle:')}</strong> {L('세 변과 세 각이 모두 같음 (각 60°)', 'All three sides and angles are equal (60° each)')}</li>
            <li><strong>{L('30-60-90 삼각형:', '30-60-90 triangle:')}</strong> {L('변의 비율 1 : √3 : 2', 'Side ratio 1 : √3 : 2')}</li>
            <li><strong>{L('45-45-90 삼각형:', '45-45-90 triangle:')}</strong> {L('변의 비율 1 : 1 : √2', 'Side ratio 1 : 1 : √2')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '삼각형 계산기' : 'Triangle Calculator'}
      description={isKo ? 'SAS, ASA, SSS, AAS 모드로 삼각형의 모든 변과 각, 넓이를 계산합니다.' : 'Calculate all sides, angles, and area of a triangle using SAS, ASA, SSS, or AAS modes.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
