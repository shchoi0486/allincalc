'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type RegionType = 'urban' | 'coastal' | 'mountainous';

const REGION_LABELS: Record<RegionType, { ko: string; en: string }> = {
  urban: { ko: '도시지역', en: 'Urban' },
  coastal: { ko: '해안지역', en: 'Coastal' },
  mountainous: { ko: '산간지역', en: 'Mountainous' },
};

const WIND_SPEED_TABLE = [
  { region: '도시 (Urban)', v10: '25.0', v50: '30.0', v100: '33.0' },
  { region: '해안 (Coastal)', v10: '30.0', v50: '36.0', v100: '40.0' },
  { region: '산간 (Mountainous)', v10: '28.0', v50: '33.0', v100: '37.0' },
];

const WIND_PRESSURE_LEVELS = [
  { max: 500, label: { ko: '낮음', en: 'Low' }, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
  { max: 1500, label: { ko: '보통', en: 'Moderate' }, color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' },
  { max: 3000, label: { ko: '높음', en: 'High' }, color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' },
  { max: Infinity, label: { ko: '매우 높음', en: 'Very High' }, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
];

const KoreanWindLoadCalculator: React.FC = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [height, setHeight] = useState<string>('');
  const [windSpeed, setWindSpeed] = useState<string>('');
  const [cp, setCp] = useState<string>('1.3');
  const [area, setArea] = useState<string>('');
  const [region, setRegion] = useState<RegionType>('urban');

  const handleReset = () => {
    setHeight('');
    setWindSpeed('');
    setCp('1.3');
    setArea('');
    setRegion('urban');
  };

  const results = useMemo(() => {
    const h = parseFloat(height);
    const v = parseFloat(windSpeed);
    const cpVal = parseFloat(cp);
    const a = parseFloat(area);

    if (isNaN(h) || isNaN(v) || isNaN(cpVal) || isNaN(a)) return null;

    const rho = 1.225;
    const q0 = 0.5 * rho * v * v;
    const gfBase = region === 'coastal' ? 2.0 : region === 'mountainous' ? 1.8 : 1.5;
    const gf = Math.min(2.2, Math.max(1.0, gfBase + (h > 60 ? 0.2 : 0)));
    const q = q0 * cpVal * gf;
    const windLoad = q * a;

    let level = WIND_PRESSURE_LEVELS[WIND_PRESSURE_LEVELS.length - 1];
    for (const l of WIND_PRESSURE_LEVELS) {
      if (windLoad <= l.max) {
        level = l;
        break;
      }
    }

    return { q0, q, gf, windLoad, level, rho };
  }, [height, windSpeed, cp, area, region]);

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="height">{L('건물높이 (m)', 'Building Height (m)')}</Label>
        <Input
          id="height"
          type="number"
          min="0"
          step="0.1"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          placeholder={L('예: 30', 'e.g. 30')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="windSpeed">{L('기본풍속 (m/s)', 'Basic Wind Speed (m/s)')}</Label>
        <Input
          id="windSpeed"
          type="number"
          min="0"
          step="0.1"
          value={windSpeed}
          onChange={(e) => setWindSpeed(e.target.value)}
          placeholder={L('예: 30', 'e.g. 30')}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="cp">{L('풍압계수 (Cp)', 'Pressure Coefficient (Cp)')}</Label>
        <Input
          id="cp"
          type="number"
          min="0"
          step="0.01"
          value={cp}
          onChange={(e) => setCp(e.target.value)}
          placeholder="1.3"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="area">{L('정면투사면적 (㎡)', 'Projected Frontal Area (㎡)')}</Label>
        <Input
          id="area"
          type="number"
          min="0"
          step="0.1"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder={L('예: 500', 'e.g. 500')}
        />
      </div>
      <div className="space-y-2">
        <Label>{L('지역구분', 'Region Type')}</Label>
        <Select value={region} onValueChange={(v) => setRegion(v as RegionType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urban">{REGION_LABELS.urban[isKo ? 'ko' : 'en']}</SelectItem>
            <SelectItem value="coastal">{REGION_LABELS.coastal[isKo ? 'ko' : 'en']}</SelectItem>
            <SelectItem value="mountainous">{REGION_LABELS.mountainous[isKo ? 'ko' : 'en']}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        {L('초기화', 'Reset')}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!results ? (
        <p className="text-muted-foreground text-center py-8">
          {L('모든 값을 입력하면 결과가 표시됩니다.', 'Enter all values to see results.')}
        </p>
      ) : (
        <>
          <div className={`p-4 rounded-lg text-center ${results.level.color}`}>
            <div className="text-sm font-medium mb-1">{L('풍하중 등급', 'Wind Load Level')}</div>
            <div className="text-2xl font-bold">{results.level.label[isKo ? 'ko' : 'en']}</div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('공기밀도 (ρ)', 'Air Density (ρ)')}</span>
              <span className="font-mono">{results.rho} kg/m³</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('기본풍압 (q₀)', 'Base Pressure (q₀)')}</span>
              <span className="font-mono">{results.q0.toFixed(2)} Pa</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('돌풍계수 (Gf)', 'Gust Factor (Gf)')}</span>
              <span className="font-mono">{results.gf.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('설계풍압 (q)', 'Design Pressure (q)')}</span>
              <span className="font-mono">{results.q.toFixed(2)} Pa</span>
            </div>
            <div className="flex justify-between p-3 border-2 border-primary rounded-lg">
              <span className="font-bold">{L('풍하중 (W)', 'Wind Load (W)')}</span>
              <span className="font-mono font-bold text-lg">{results.windLoad.toFixed(2)} N</span>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '이 계산기는 KDS 4110 (한국건설기술연구원 풍하중 기준)에 따라 건축물에 작용하는 풍하중을 계산합니다. 풍하중은 바람이 건물에 가하는 압력으로, 구조설계 시 반드시 검토해야 하는 주요 자연재해 하중 중 하나입니다.',
            'This calculator computes wind loads on buildings according to KDS 4110 (Korean Institute of Civil Engineering and Building Technology wind load standard). Wind load is the pressure exerted by wind on a structure and is a critical natural hazard load in structural design.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 항목', 'What this calculator computes')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('기본풍압 q₀ = 0.5 × ρ × V²', 'Base pressure q₀ = 0.5 × ρ × V²')}</li>
            <li>{L('설계풍압 q = q₀ × Cp × Gf', 'Design pressure q = q₀ × Cp × Gf')}</li>
            <li>{L('풍하중 W = q × A (정면투사면적)', 'Wind load W = q × A (projected frontal area)')}</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('KDS 4110 풍하중 계산 공식', 'KDS 4110 Wind Load Formula')}
          </h4>
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <p className="text-center font-mono text-lg text-blue-600">q₀ = 0.5 × ρ × V² × 1.0</p>
            <p className="text-center font-mono text-lg text-blue-600">q = q₀ × Cp × Gf</p>
            <p className="text-center font-mono text-lg text-red-500">W = q × A</p>
          </div>
        </div>
        <ul className="space-y-2 text-sm">
          <li><strong className="font-semibold text-blue-500">q₀</strong> — {L('기본풍압 [Pa]', 'Base wind pressure [Pa]')}</li>
          <li><strong className="font-semibold text-blue-600">ρ</strong> — {L('공기밀도 = 1.225 kg/m³ (표준대기)', 'Air density = 1.225 kg/m³ (standard atmosphere)')}</li>
          <li><strong className="font-semibold text-green-600">V</strong> — {L('기본풍속 [m/s] (지역 및 높이에 따라 결정)', 'Basic wind speed [m/s] (determined by region and height)')}</li>
          <li><strong className="font-semibold text-purple-600">Cp</strong> — {L('풍압계수 (건물 형상에 따라 0.7~2.0)', 'Pressure coefficient (0.7–2.0 depending on building shape)')}</li>
          <li><strong className="font-semibold text-orange-600">Gf</strong> — {L('돌풍계수 (1.0~2.2, 높이·지역에 따라 변동)', 'Gust factor (1.0–2.2, varies with height and region)')}</li>
          <li><strong className="font-semibold text-red-500">A</strong> — {L('정면투사면적 [㎡]', 'Projected frontal area [㎡]')}</li>
        </ul>
        <div>
          <h4 className="font-bold text-base mb-2">{L('KDS 4110 기본풍속 참고표', 'KDS 4110 Basic Wind Speed Reference')}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">{L('지역', 'Region')}</th>
                  <th className="border p-2 text-center">V₁₀ (m/s)</th>
                  <th className="border p-2 text-center">V₅₀ (m/s)</th>
                  <th className="border p-2 text-center">V₁₀₀ (m/s)</th>
                </tr>
              </thead>
              <tbody>
                {WIND_SPEED_TABLE.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                    <td className="border p-2 font-medium">{row.region}</td>
                    <td className="border p-2 text-center font-mono">{row.v10}</td>
                    <td className="border p-2 text-center font-mono">{row.v50}</td>
                    <td className="border p-2 text-center font-mono">{row.v100}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('풍하중 설계 시 주의사항', 'Wind Load Design Considerations')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('고층건물(60m 이상)은 돌풍계수가 증가하므로 반드시 고층풍속 보정을 적용하세요.', 'Tall buildings (60m+) require gust factor adjustments; apply high-rise wind speed corrections.')}</li>
            <li>{L('해안지역은 기본풍속이 높으므로 내풍설계가 필수적입니다.', 'Coastal regions have higher basic wind speeds; wind-resistant design is essential.')}</li>
            <li>{L('건물 형상에 따라 풍압계수 Cp가 크게 달라지므로 형상계수를 정확히 적용해야 합니다.', 'Cp varies significantly with building shape; apply the correct shape coefficient.')}</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('돌풍계수(Gf) 산정 기준', 'Gust Factor (Gf) Determination')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('도시지역: Gf ≈ 1.5 (건축밀집 area)', 'Urban: Gf ≈ 1.5 (dense building area)')}</li>
            <li>{L('산간지역: Gf ≈ 1.8 (지형 효과 반영)', 'Mountainous: Gf ≈ 1.8 (terrain effects)')}</li>
            <li>{L('해안지역: Gf ≈ 2.0 (개방지형, 높은 돌풍)', 'Coastal: Gf ≈ 2.0 (open terrain, high gusts)')}</li>
            <li>{L('60m 이상 고층: 추가 보정 +0.2 적용', 'Buildings 60m+: additional correction +0.2')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={L('한국 풍하중 계산기 (KDS 4110)', 'Korean Wind Load Calculator (KDS 4110)')}
      description={L(
        'KDS 4110 기준에 따라 건축물 풍하중을 계산합니다.',
        'Calculate wind loads on buildings per KDS 4110 standard.'
      )}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default KoreanWindLoadCalculator;
