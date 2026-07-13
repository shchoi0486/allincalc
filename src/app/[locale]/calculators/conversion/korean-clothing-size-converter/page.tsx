'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

const krSizes = [85, 90, 95, 100, 105, 110, 115, 120];
const usSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

function krToUs(kr: number): string {
  const idx = krSizes.indexOf(kr);
  if (idx !== -1) return usSizes[idx];
  if (kr < 85) return 'XS';
  if (kr > 120) return '4XL+';
  const closest = krSizes.reduce((prev, curr) => Math.abs(curr - kr) < Math.abs(prev - kr) ? curr : prev);
  return usSizes[krSizes.indexOf(closest)];
}

function usToKr(us: string): number {
  const idx = usSizes.indexOf(us.toUpperCase());
  return idx !== -1 ? krSizes[idx] : 100;
}

function krToEu(kr: number): number {
  return Math.round((kr - 10) * 0.5);
}

function krToChestCm(kr: number): string {
  return `${kr - 10}~${kr - 5}`;
}

function krToWaistCm(kr: number): string {
  return `${kr - 20}~${kr - 15}`;
}

const refTable = [
  { kr: 85, chest: '80~85', waist: '65~70', us: 'XS', eu: '38' },
  { kr: 90, chest: '85~90', waist: '70~75', us: 'S', eu: '40' },
  { kr: 95, chest: '90~95', waist: '75~80', us: 'M', eu: '42' },
  { kr: 100, chest: '95~100', waist: '80~85', us: 'L', eu: '44' },
  { kr: 105, chest: '100~105', waist: '85~90', us: 'XL', eu: '46' },
  { kr: 110, chest: '105~110', waist: '90~95', us: 'XXL', eu: '48' },
  { kr: 115, chest: '110~115', waist: '95~100', us: '3XL', eu: '50' },
  { kr: 120, chest: '115~120', waist: '100~105', us: '4XL', eu: '52' },
];

export default function KoreanClothingSizeConverterPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [mode, setMode] = useState<'krToUs' | 'usToKr' | 'krToBody'>('krToUs');
  const [krSize, setKrSize] = useState('100');
  const [usSize, setUsSize] = useState('L');
  const [result, setResult] = useState<any>(null);

  const convert = useCallback(() => {
    if (mode === 'krToUs') {
      const kr = parseInt(krSize);
      if (isNaN(kr)) { setResult(null); return; }
      setResult({
        type: 'krToUs',
        kr,
        us: krToUs(kr),
        eu: krToEu(kr),
        chest: krToChestCm(kr),
        waist: krToWaistCm(kr),
      });
    } else if (mode === 'usToKr') {
      const kr = usToKr(usSize);
      setResult({
        type: 'usToKr',
        kr,
        us: usSize.toUpperCase(),
        eu: krToEu(kr),
        chest: krToChestCm(kr),
        waist: krToWaistCm(kr),
      });
    } else {
      const kr = parseInt(krSize);
      if (isNaN(kr)) { setResult(null); return; }
      setResult({
        type: 'krToBody',
        kr,
        us: krToUs(kr),
        eu: krToEu(kr),
        chest: krToChestCm(kr),
        waist: krToWaistCm(kr),
      });
    }
  }, [mode, krSize, usSize]);

  const reset = () => { setKrSize('100'); setUsSize('L'); setResult(null); };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('변환 모드', 'Conversion Mode')}</Label>
        <Select value={mode} onValueChange={(v) => setMode(v as any)}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="krToUs">{L('한국 사이즈 → 미국/유럽', 'Korean Size → US/EU')}</SelectItem>
            <SelectItem value="usToKr">{L('미국 사이즈 → 한국', 'US Size → Korean')}</SelectItem>
            <SelectItem value="krToBody">{L('한국 사이즈 → 체형 정보', 'Korean Size → Body Measurements')}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(mode === 'krToUs' || mode === 'krToBody') && (
        <div>
          <Label>{L('한국 의류 사이즈', 'Korean Clothing Size')}</Label>
          <Select value={krSize} onValueChange={setKrSize}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {krSizes.map(s => (
                <SelectItem key={s} value={String(s)}>{s}호</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      {mode === 'usToKr' && (
        <div>
          <Label>{L('미국 의류 사이즈', 'US Clothing Size')}</Label>
          <Select value={usSize} onValueChange={setUsSize}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {usSizes.map(s => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex space-x-2">
        <Button onClick={convert} className="flex-1">{L('변환', 'Convert')}</Button>
        <Button onClick={reset} variant="outline" className="flex-1">{L('초기화', 'Reset')}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div>
      {result ? (
        <div className="space-y-4">
          <div className="p-4 bg-muted rounded-lg text-center">
            <p className="text-sm text-muted-foreground">{L('변환 결과', 'Conversion Result')}</p>
            <div className="flex items-center justify-center space-x-4 mt-2">
              <div>
                <p className="text-xs text-muted-foreground">KR</p>
                <p className="text-2xl font-bold">{result.kr}호</p>
              </div>
              <span className="text-xl">→</span>
              <div>
                <p className="text-xs text-muted-foreground">US</p>
                <p className="text-2xl font-bold">{result.us}</p>
              </div>
              <span className="text-xl">→</span>
              <div>
                <p className="text-xs text-muted-foreground">EU</p>
                <p className="text-2xl font-bold">{result.eu}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{L('가슴둘레 (cm)', 'Chest (cm)')}</p>
              <p className="font-bold">{result.chest}</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{L('허리둘레 (cm)', 'Waist (cm)')}</p>
              <p className="font-bold">{result.waist}</p>
            </div>
          </div>
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
          <strong>{L('한국 의류 사이즈 변환기', 'Korean Clothing Size Converter')}</strong>{L('는 한국 의류 사이즈(95, 100, 105...)를 미국(S, M, L...) 및 유럽 사이즈로 변환하는 도구입니다.', ' converts Korean clothing sizes (95, 100, 105...) to US (S, M, L...) and European sizes.')}
        </p>
        <p>
          {L('한국 의류 사이즈는 가슴둘레를 기준으로 합니다. 예를 들어, 100호는 가슴둘레 약 95~100cm를 의미합니다.', 'Korean clothing sizes are based on chest circumference. For example, size 100 means a chest circumference of about 95~100cm.')}
        </p>
        <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
          {L('해외 브랜드의 사이즈는 한국 사이즈와 차이가 있을 수 있으므로, 구매 전 반드시 사이즈표를 확인하세요.', 'Overseas brand sizes may differ from Korean sizes, so always check the size chart before purchasing.')}
        </p>
        <TermGlossary items={[
          { term: L('한국 의류 사이즈', 'Korean Clothing Size'), desc: L('가슴둘레(cm)를 기반으로 한 사이즈 시스템입니다. 85, 90, 95, 100, 105, 110 등으로 표시됩니다.', 'A size system based on chest circumference (cm). Shown as 85, 90, 95, 100, 105, 110, etc.') },
          { term: L('미국 의류 사이즈', 'US Clothing Size'), desc: L('XS, S, M, L, XL, XXL 같은 영문 레터 시스템을 사용합니다.', 'Uses letter-based systems like XS, S, M, L, XL, XXL.') },
          { term: L('유럽 의류 사이즈', 'EU Clothing Size'), desc: L('숫자 기반 시스템으로, 한국 사이즈보다 약 45~55 정도 큰 숫자를 사용합니다.', 'A numeric system that uses numbers approximately 45~55 larger than Korean sizes.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('한국 사이즈 체계', 'Korean Size System')}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg space-y-2">
            <p className="font-mono text-sm text-center">한국 사이즈 = 가슴둘레(cm) 기준</p>
            <p className="text-xs text-muted-foreground text-center">{L('100호 = 가슴둘레 약 95~100cm', 'Size 100 = chest ~95~100cm')}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('대조표', 'Comparison Table')}</h4>
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b bg-muted">
                  <th className="p-2 text-left">KR</th>
                  <th className="p-2 text-left">US</th>
                  <th className="p-2 text-left">EU</th>
                  <th className="p-2 text-left">{L('가슴(cm)', 'Chest(cm)')}</th>
                  <th className="p-2 text-left">{L('허리(cm)', 'Waist(cm)')}</th>
                </tr>
              </thead>
              <tbody>
                {refTable.map(row => (
                  <tr key={row.kr} className="border-b border-border/50">
                    <td className="p-2 font-mono">{row.kr}호</td>
                    <td className="p-2">{row.us}</td>
                    <td className="p-2 font-mono">{row.eu}</td>
                    <td className="p-2 font-mono">{row.chest}</td>
                    <td className="p-2 font-mono">{row.waist}</td>
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
          <h4 className="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">{L('의류 사이즈 선택 요령', 'Clothing Size Selection Tips')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{L('상의: 가슴둘레를 기준으로 선택합니다. 정 사이즈를 추천합니다.', 'Upper body: Choose based on chest circumference. True-to-size is recommended.')}</li>
            <li>{L('하의: 허리둘레와 엉덩이둘레를 함께 고려합니다.', 'Lower body: Consider both waist and hip circumference.')}</li>
            <li>{L('핏에 따라 사이즈가 달라집니다. 슬림핏은 정 사이즈, 레귤러핏은 약간 여유 있게, 루즈핏은 한 사이즈 크게 추천합니다.', 'Sizing varies by fit. Slim fit: true to size; Regular fit: slightly loose; Loose fit: one size up.')}</li>
            <li>{L('여성 의류는 브랜드마다 사이즈가 크게 다를 수 있습니다.', "Women's clothing sizes can vary greatly between brands.")}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('해외 직구 시 사이즈 참고', 'Size Reference for International Shopping')}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li><strong>{L('미국:', 'US:')}</strong> {L('한국 사이즈보다 보통 1~2 사이즈 작게 생각하면 됩니다. (100호 → L)', 'Think 1~2 sizes smaller than Korean size. (100 → L)')}</li>
            <li><strong>{L('유럽:', 'EU:')}</strong> {L('한국 사이즈 + 45~50 정도가 EU 사이즈입니다. (100호 → EU 44~45)', 'Korean size + 45~50 ≈ EU size. (100 → EU 44~45)')}</li>
            <li><strong>{L('일본:', 'JP:')}</strong> {L('한국과 거의 비슷하지만, 약간 작게 나올 수 있습니다.', 'Similar to Korean sizes, but may run slightly smaller.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={isKo ? '한국 의류 사이즈 변환기' : 'Korean Clothing Size Converter'}
      description={isKo ? '한국(95, 100, 105...), 미국(S, M, L...), 유럽 의류 사이즈를 상호 변환합니다.' : 'Convert between Korean (95, 100, 105...), US (S, M, L...), and EU clothing sizes.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
