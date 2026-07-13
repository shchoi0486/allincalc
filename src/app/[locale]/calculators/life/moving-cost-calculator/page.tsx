'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

type MovingType = 'oneroom' | 'tworoom' | 'threeroom' | 'office';

const baseCosts: Record<MovingType, { min: number; max: number }> = {
  oneroom: { min: 50000, max: 150000 },
  tworoom: { min: 150000, max: 300000 },
  threeroom: { min: 250000, max: 500000 },
  office: { min: 200000, max: 600000 },
};

const distanceCostPerKm = 500;
const optionCosts: Record<string, { cost: number; ko: string; en: string }> = {
  aircon: { cost: 50000, ko: '에어컨 설치/이전', en: 'Air Conditioner' },
  piano: { cost: 150000, ko: '피아노 운반', en: 'Piano Moving' },
  wardrobe: { cost: 30000, ko: '붙박이장 이전', en: 'Wardrobe Moving' },
  fridge: { cost: 40000, ko: '냉장고 이전', en: 'Refrigerator Moving' },
  washer: { cost: 30000, ko: '세탁기 이전', en: 'Washer Moving' },
  disassembly: { cost: 30000, ko: '가구 분리/조립', en: 'Furniture Assembly' },
};

const formatWon = (n: number) => `\u20A9${n.toLocaleString()}`;

export default function MovingCostCalculatorPage() {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [movingType, setMovingType] = useState<MovingType>('tworoom');
  const [distance, setDistance] = useState('');
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [floor, setFloor] = useState('');
  const [hasElevator, setHasElevator] = useState('yes');
  const [result, setResult] = useState<{ base: number; dist: number; floorExtra: number; options: number; total: number } | null>(null);

  const toggleOption = (key: string) => {
    setSelectedOptions(prev =>
      prev.includes(key) ? prev.filter(o => o !== key) : [...prev, key]
    );
  };

  const calculate = () => {
    const base = (baseCosts[movingType].min + baseCosts[movingType].max) / 2;
    const dist = (parseFloat(distance) || 0) * distanceCostPerKm;
    const floorNum = parseInt(floor) || 1;
    const floorExtra = floorNum >= 6 && hasElevator === 'no' ? (floorNum - 5) * 10000 : 0;
    const options = selectedOptions.reduce((sum, key) => sum + (optionCosts[key]?.cost || 0), 0);
    setResult({ base, dist, floorExtra, options, total: base + dist + floorExtra + options });
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <Label>{L('이사 유형', 'Moving Type')}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {([
            ['oneroom', '원룸', 'Studio'],
            ['tworoom', '투룸', '2-Room'],
            ['threeroom', '쓰리룸', '3-Room'],
            ['office', '사무실', 'Office'],
          ] as const).map(([key, ko, en]) => (
            <Button
              key={key}
              variant={movingType === key ? 'default' : 'outline'}
              onClick={() => setMovingType(key)}
              className="text-sm"
            >
              {L(ko, en)}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label>{L('이사 거리 (km)', 'Distance (km)')}</Label>
        <Input type="number" value={distance} onChange={e => setDistance(e.target.value)} placeholder="0" className="mt-1" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>{L('층수', 'Floor')}</Label>
          <Input type="number" value={floor} onChange={e => setFloor(e.target.value)} placeholder="1" className="mt-1" />
        </div>
        <div>
          <Label>{L('엘리베이터', 'Elevator')}</Label>
          <div className="flex gap-2 mt-1">
            <Button variant={hasElevator === 'yes' ? 'default' : 'outline'} size="sm" onClick={() => setHasElevator('yes')}>{L('있음', 'Yes')}</Button>
            <Button variant={hasElevator === 'no' ? 'default' : 'outline'} size="sm" onClick={() => setHasElevator('no')}>{L('없음', 'No')}</Button>
          </div>
        </div>
      </div>
      <div>
        <Label>{L('추가 옵션', 'Additional Options')}</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {Object.entries(optionCosts).map(([key, opt]) => (
            <Button
              key={key}
              variant={selectedOptions.includes(key) ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleOption(key)}
              className="text-xs"
            >
              {L(opt.ko, opt.en)}
            </Button>
          ))}
        </div>
      </div>
      <Button onClick={calculate} className="w-full">{L('계산하기', 'Calculate')}</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Card className="p-4 text-center">
        <p className="text-sm text-muted-foreground">{L('예상 총 이사 비용', 'Estimated Total Cost')}</p>
        <p className="text-2xl font-bold text-primary mt-1">{formatWon(result.total)}</p>
      </Card>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span>{L('기본 이사비', 'Base Cost')}</span><span className="font-mono">{formatWon(result.base)}</span></div>
        <div className="flex justify-between"><span>{L('운송 거리비', 'Distance Cost')}</span><span className="font-mono">{formatWon(result.dist)}</span></div>
        <div className="flex justify-between"><span>{L('층수 추가비', 'Floor Surcharge')}</span><span className="font-mono">{formatWon(result.floorExtra)}</span></div>
        <div className="flex justify-between"><span>{L('추가 옵션비', 'Options Cost')}</span><span className="font-mono">{formatWon(result.options)}</span></div>
      </div>
    </div>
  ) : (
    <div className="text-center py-8">
      <p className="text-lg text-muted-foreground">{L('이사 정보를 입력하세요', 'Enter moving details to get an estimate')}</p>
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{L('이사 비용 계산기', 'Moving Cost Calculator')}</strong>
          {L('는 이사 유형, 거리, 옵션 등을 기반으로 예상 이사 비용을 계산하는 도구입니다.', ' calculates estimated moving costs based on moving type, distance, and options.')}
        </p>
        <p>{L('한국 시장 기준으로, 원룸부터 사무실까지 다양한 이사 유형에 대한 대략적인 비용 범위를 제공합니다.', 'Provides approximate cost ranges for various moving types from studios to offices, based on the Korean market.')}</p>
        <TermGlossary items={[
          { term: L('기본 이사비', 'Base Moving Cost'), desc: L('이사 유형에 따른 기본 운송비입니다.', 'Base transport cost based on moving type.') },
          { term: L('운송 거리비', 'Distance Cost'), desc: L('이사 거리(km)에 따라 추가되는 비용입니다.', 'Additional cost based on distance.') },
          { term: L('이사 성수기', 'Peak Season'), desc: L('2~3월, 9~10월은 비용이 20~30% 높아질 수 있습니다.', 'Costs may increase by 20-30% during peak months.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <h4 className="font-bold">{L('비용 계산 공식', 'Cost Formula')}</h4>
        <div className="p-4 bg-muted rounded-lg font-mono text-sm text-center space-y-2">
          <p>{L('총 비용 = 기본비 + 거리비 + 층수추가비 + 옵션비', 'Total = Base + Distance + Floor Surcharge + Options')}</p>
        </div>
        <div className="space-y-2 text-sm">
          <p><strong>{L('기본비', 'Base')}:</strong> {L('이사 유형에 따른 범위 내 평균', 'Average within type range')}</p>
          <p><strong>{L('거리비', 'Distance')}:</strong> {L('km x \u20A9500', 'km x \u20A9500')}</p>
          <p><strong>{L('층수추가비', 'Floor')}:</strong> {L('6층 이상 + 엘리베이터 없음: (층수-5) x \u20A910,000', '6F+ no elevator: (floor-5) x \u20A910,000')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <h4 className="font-bold">{L('이사 비용 절약 팁', 'Cost Saving Tips')}</h4>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>{L('이사 성수기(2~3월, 9~10월)를 피하면 비용을 절약할 수 있습니다.', 'Avoiding peak season can save costs.')}</li>
          <li>{L('최소 3곳 이상의 이사업체에서 견적을 받아 비교하세요.', 'Get quotes from at least 3 companies.')}</li>
          <li>{L('불필요한 물건을 미리 정리하면 이사 비용을 줄일 수 있습니다.', 'Sorting unnecessary items in advance reduces costs.')}</li>
          <li>{L('에어컨, 피아노 등 대형 가전/가구는 사전에 업체에 알려 정확한 견적을 받으세요.', 'Inform about large items in advance for accurate quotes.')}</li>
        </ul>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={L('이사 비용 계산기', 'Moving Cost Calculator')}
      description={L('이사 유형, 거리, 옵션에 따른 예상 이사 비용을 계산합니다.', 'Estimate moving costs based on type, distance, and options.')}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
}
