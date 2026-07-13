'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

type SizeSystem = 'KR' | 'US' | 'EU' | 'JP' | 'mm';

const conversionTable: Record<SizeSystem, (mm: number) => number> = {
  mm: (mm) => mm,
  KR: (mm) => Math.round((mm * 10) + 5),
  US: (mm) => parseFloat((mm / 25.4 * 3 - (mm >= 250 ? 24 : 23)).toFixed(1)),
  EU: (mm) => Math.round(mm * 1.5 + 2),
  JP: (mm) => Math.round(mm),
};

const sizeToMm: Record<SizeSystem, (size: number) => number> = {
  mm: (s) => s,
  KR: (s) => (s - 5) / 10,
  US: (s) => ((s + 23) / 3) * 25.4,
  EU: (s) => (s - 2) / 1.5,
  JP: (s) => s,
};

const shoeRefTable = [
  { kr: 230, us: 5, eu: 37, jp: 23 },
  { kr: 235, us: 5.5, eu: 37.5, jp: 23.5 },
  { kr: 240, us: 6, eu: 38, jp: 24 },
  { kr: 245, us: 6.5, eu: 38.5, jp: 24.5 },
  { kr: 250, us: 7, eu: 39, jp: 25 },
  { kr: 255, us: 7.5, eu: 40, jp: 25.5 },
  { kr: 260, us: 8, eu: 40.5, jp: 26 },
  { kr: 265, us: 8.5, eu: 41, jp: 26.5 },
  { kr: 270, us: 9, eu: 42, jp: 27 },
  { kr: 275, us: 9.5, eu: 42.5, jp: 27.5 },
  { kr: 280, us: 10, eu: 43, jp: 28 },
  { kr: 285, us: 10.5, eu: 44, jp: 28.5 },
  { kr: 290, us: 11, eu: 44.5, jp: 29 },
];

export default function KoreanShoeSizeConverterPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [fromSystem, setFromSystem] = useState<SizeSystem>('KR');
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<Record<string, number> | null>(null);

  const convert = useCallback(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) { setResults(null); return; }
    const mm = sizeToMm[fromSystem](val);
    if (mm <= 0) { setResults(null); return; }
    const res: Record<string, number> = {};
    for (const sys of Object.keys(conversionTable) as SizeSystem[]) {
      res[sys] = parseFloat(conversionTable[sys](mm).toFixed(1));
    }
    setResults(res);
  }, [inputValue, fromSystem]);

  const reset = () => { setInputValue(''); setResults(null); };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('변환할 시스템', 'System to Convert From')}</Label>
        <Select value={fromSystem} onValueChange={(v) => setFromSystem(v as SizeSystem)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="KR">{L('한국 (KR)', 'Korea (KR)')}</SelectItem>
            <SelectItem value="US">{L('미국 (US)', 'United States (US)')}</SelectItem>
            <SelectItem value="EU">{L('유럽 (EU)', 'Europe (EU)')}</SelectItem>
            <SelectItem value="JP">{L('일본 (JP)', 'Japan (JP)')}</SelectItem>
            <SelectItem value="mm">{L('밀리미터 (mm)', 'Millimeters (mm)')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>{L('사이즈 입력', 'Enter Size')}</Label>
        <Input type="number" value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder={isKo ? '예: 250' : 'e.g. 250'} />
      </div>
      <div className="flex space-x-2">
        <Button onClick={convert} className="flex-1">{L('변환', 'Convert')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {results ? (
        <div className="space-y-4">
          {(['KR', 'US', 'EU', 'JP', 'mm'] as SizeSystem[]).map(sys => (
            <div key={sys} className="flex items-center justify-between p-3 bg-muted rounded-md">
              <span className="text-sm font-medium">
                {sys === 'KR' ? L('한국', 'Korea') : sys === 'US' ? L('미국', 'US') : sys === 'EU' ? L('유럽', 'EU') : sys === 'JP' ? L('일본', 'Japan') : L('밀리미터', 'Millimeters')}
              </span>
              <span className="text-lg font-bold text-primary">{results[sys]} {sys !== 'mm' ? L('호', '') : 'mm'}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg text-muted-foreground">{isKo ? '사이즈를 입력하세요' : 'Enter a size to convert'}</p>
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('한국 신발 사이즈 변환기', 'Korean Shoe Size Converter')}</strong>{L('는 한국, 미국, 유럽, 일본의 신발 사이즈를 상호 변환하는 도구입니다.', ' is a tool that converts shoe sizes between Korean, US, European, and Japanese systems.')}
        </p>
        <p>
          {L('각국의 신발 사이즈 시스템은 측정 단위와 공식이 다르기 때문에, 해외 직구나 여행 시 정확한 사이즈 변환이 필요합니다.', 'Each country has different shoe size measurement units and formulas, so accurate size conversion is needed for overseas purchases or travel.')}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('한국 사이즈는 발 길이(mm) × 10 + 5 공식을 기반으로 합니다. 예: 250mm 발 = 한국 250호.', 'Korean sizes are based on the formula: foot length (mm) × 10 + 5. E.g., 250mm foot = Korea size 250.')}
        </p>
        <TermGlossary items={[
          { term: L('한국 사이즈 (KR)', 'Korea Size (KR)'), desc: L('발 길이(mm)에 10을 곱하고 5를 더한 값입니다. 250, 255, 260 등 5mm 단위로 표시됩니다.', 'foot length (mm) × 10 + 5. Shown in 5mm increments like 250, 255, 260.') },
          { term: L('미국 사이즈 (US)', 'US Size'), desc: L('US 사이즈는 브랜드마다 약간의 차이가 있을 수 있습니다. 일반적으로 발 길이(mm) / 25.4 × 3 - 22~24 공식을 사용합니다.', 'US sizes may vary slightly by brand. Generally uses the formula: foot length (mm) / 25.4 × 3 - 22~24.') },
          { term: L('유럽 사이즈 (EU)', 'EU Size (EUR)'), desc: L('파리 포인트 시스템을 기반으로 하며, 발 길이(mm)에 약 1.5를 곱한 값입니다.', 'Based on the Paris Point system, approximately foot length (mm) × 1.5.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('각국 변환 공식', 'Conversion Formulas')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-3">
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">KR → mm</p>
              <p className="font-mono text-xs">mm = (KR - 5) / 10</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">mm → KR</p>
              <p className="font-mono text-xs">KR = mm × 10 + 5</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">mm → US</p>
              <p className="font-mono text-xs">US = mm / 25.4 × 3 - (22~24)</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">mm → EU</p>
              <p className="font-mono text-xs">EU = mm × 1.5 + 2</p>
            </div>
            <div className="p-2 bg-card rounded">
              <p className="font-semibold text-sm">JP</p>
              <p className="font-mono text-xs">JP ≈ mm (직접 mm 표시)</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('참고 사이즈표', 'Reference Size Table')}</h4>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="p-2 text-left">KR</th>
                  <th className="p-2 text-left">US</th>
                  <th className="p-2 text-left">EU</th>
                  <th className="p-2 text-left">JP</th>
                </tr>
              </thead>
              <tbody>
                {shoeRefTable.map(row => (
                  <tr key={row.kr} className="border-b border-border/50">
                    <td className="p-2 font-mono">{row.kr}</td>
                    <td className="p-2 font-mono">{row.us}</td>
                    <td className="p-2 font-mono">{row.eu}</td>
                    <td className="p-2 font-mono">{row.jp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('신발 사이즈 선택 팁', 'Shoe Size Selection Tips')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{L('양발이 다를 경우 큰 쪽 기준으로 선택하세요.', 'If your feet are different sizes, choose based on the larger one.')}</li>
            <li>{L('하루 중 발이 붓는 시간대(오후~저녁)에 측정하는 것이 정확합니다.', 'Measuring during the time your feet swell (afternoon~evening) is more accurate.')}</li>
            <li>{L('운동화는 일반적으로 발보다 약간 큰 사이즈를 선택하는 것이 편안합니다.', 'For sneakers, choosing slightly larger than your foot is usually more comfortable.')}</li>
            <li>{L('브랜드마다 사이즈가 약간 다를 수 있으므로, 구매 전 사이즈표를 꼭 확인하세요.', 'Sizes may vary slightly by brand, so always check the size chart before purchasing.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('발 측정 방법', 'How to Measure Your Foot')}</h4>
          <ol className="list-decimal list-inside space-y-2 mt-2">
            <li>{L('벽에 종이를 대고 발을 올립니다.', 'Place paper against a wall and step on it.')}</li>
            <li>{L('벽에서 발가락 끝까지의 거리를 잽니다.', 'Measure from the wall to the tip of your longest toe.')}</li>
            <li>{L('양발 모두 측정하여 큰 쪽을 기준으로 합니다.', 'Measure both feet and use the larger one as your reference.')}</li>
            <li>{L('mm 단위로 기록합니다.', 'Record in mm.')}</li>
          </ol>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '한국 신발 사이즈 변환기' : 'Korean Shoe Size Converter'}
      description={isKo ? '한국, 미국, 유럽, 일본 신발 사이즈를 상호 변환합니다.' : 'Convert between Korean, US, European, and Japanese shoe sizes.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
