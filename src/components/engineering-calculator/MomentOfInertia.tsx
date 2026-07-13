'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

type ShapeType = 'rectangle' | 'circle' | 'hollow_circle' | 'ibeam' | 'tbeam' | 'lbeam';

const LENGTH_TO_MM: Record<string, number> = {
  mm: 1,
  cm: 10,
  m: 1000,
  in: 25.4,
  ft: 304.8,
};

const DIM_UNITS = ['mm', 'cm', 'm', 'in', 'ft'];

const MM4_TO_IN4 = Math.pow(25.4, 4);
const MM3_TO_IN3 = Math.pow(25.4, 3);

const MomentOfInertia = () => {
  const { locale, unitSystem } = useI18n();
  const isImperial = unitSystem === 'imperial';
  const L = (ko: string, en: string) => (locale === 'ko' ? ko : en);

  const shapes: { key: ShapeType; label: string }[] = [
    { key: 'rectangle', label: L('사각형', 'Rectangle') },
    { key: 'circle', label: L('원형', 'Circle') },
    { key: 'hollow_circle', label: L('이중 원형', 'Hollow Circle') },
    { key: 'ibeam', label: L('I형 강', 'I-Beam') },
    { key: 'tbeam', label: L('T형 강', 'T-Beam') },
    { key: 'lbeam', label: L('L형 강', 'L-Beam') },
  ];

  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [inputs, setInputs] = useState({
    b: '100',
    h: '200',
    d: '100',
    t: '10',
    tw: '8',
    tf: '12',
    bf: '150',
    hw: '176',
  });
  const [dimUnits, setDimUnits] = useState<Record<string, string>>({
    b: 'mm',
    h: 'mm',
    d: 'mm',
    t: 'mm',
    tw: 'mm',
    tf: 'mm',
    bf: 'mm',
    hw: 'mm',
  });

  const updateInput = (key: string, value: string) => {
    setInputs((prev) => ({ ...prev, [key]: value }));
  };

  const updateDimUnit = (key: string, value: string) => {
    setDimUnits((prev) => ({ ...prev, [key]: value }));
  };

  const [results, setResults] = useState<{
    ix: number | null;
    iy: number | null;
    sx: number | null;
    sy: number | null;
  }>({ ix: null, iy: null, sx: null, sy: null });

  useEffect(() => {
    if (isImperial) {
      setInputs((prev) => {
        const next: Record<string, string> = {};
        (Object.keys(prev) as string[]).forEach((k) => {
          const v = parseFloat(prev[k as keyof typeof prev]);
          next[k] = isNaN(v) ? prev[k as keyof typeof prev] : (v / 25.4).toString();
        });
        return next as typeof prev;
      });
      setDimUnits({ b: 'in', h: 'in', d: 'in', t: 'in', tw: 'in', tf: 'in', bf: 'in', hw: 'in' });
    } else {
      setInputs((prev) => {
        const next: Record<string, string> = {};
        (Object.keys(prev) as string[]).forEach((k) => {
          const v = parseFloat(prev[k as keyof typeof prev]);
          next[k] = isNaN(v) ? prev[k as keyof typeof prev] : (v * 25.4).toString();
        });
        return next as typeof prev;
      });
      setDimUnits({ b: 'mm', h: 'mm', d: 'mm', t: 'mm', tw: 'mm', tf: 'mm', bf: 'mm', hw: 'mm' });
    }
  }, [isImperial]);

  const handleCalculate = useCallback(() => {
    const dim = (k: string) => parseFloat(inputs[k as keyof typeof inputs]) * (LENGTH_TO_MM[dimUnits[k]] ?? 1);

    const b = dim('b');
    const h = dim('h');
    const d = dim('d');
    const t = dim('t');
    const tw = dim('tw');
    const tf = dim('tf');
    const bf = dim('bf');
    const hw = dim('hw');

    let ix = 0;
    let iy = 0;
    let area = 0;

    switch (shape) {
      case 'rectangle':
        ix = (b * h * h * h) / 12;
        iy = (h * b * b * b) / 12;
        area = b * h;
        break;
      case 'circle':
        ix = (Math.PI * d * d * d * d) / 64;
        iy = ix;
        area = (Math.PI * d * d) / 4;
        break;
      case 'hollow_circle': {
        const dOuter = d;
        const dInner = d - 2 * t;
        ix = (Math.PI * (Math.pow(dOuter, 4) - Math.pow(dInner, 4))) / 64;
        iy = ix;
        area = (Math.PI * (dOuter * dOuter - dInner * dInner)) / 4;
        break;
      }
      case 'ibeam': {
        const hTotal = hw + 2 * tf;
        ix = (bf * Math.pow(hTotal, 3)) / 12 - ((bf - tw) * Math.pow(hw, 3)) / 12;
        iy = (2 * tf * Math.pow(bf, 3)) / 12 + (hw * Math.pow(tw, 3)) / 12;
        area = 2 * bf * tf + hw * tw;
        break;
      }
      case 'tbeam': {
        const hTotal = hw + tf;
        const yBot = ((bf * tf * (hTotal - tf / 2)) + (tw * hw * (hw / 2))) / area || 1;
        area = bf * tf + tw * hw;
        const yCentroid = ((bf * tf * (hTotal - tf / 2)) + (tw * hw * (hw / 2))) / area;
        ix =
          (bf * Math.pow(tf, 3)) / 12 +
          bf * tf * Math.pow(hTotal - yCentroid - tf / 2, 2) +
          (tw * Math.pow(hw, 3)) / 12 +
          tw * hw * Math.pow(yCentroid - hw / 2, 2);
        iy = (tf * Math.pow(bf, 3)) / 12 + (hw * Math.pow(tw, 3)) / 12;
        break;
      }
      case 'lbeam': {
        area = bf * tf + (h - tf) * tw;
        const yCentroid = ((bf * tf * (h - tf / 2)) + (tw * (h - tf) * ((h - tf) / 2))) / area;
        ix =
          (bf * Math.pow(tf, 3)) / 12 +
          bf * tf * Math.pow(h - yCentroid - tf / 2, 2) +
          (tw * Math.pow(h - tf, 3)) / 12 +
          tw * (h - tf) * Math.pow(yCentroid - (h - tf) / 2, 2);
        iy = (tf * Math.pow(bf, 3)) / 12 + ((h - tf) * Math.pow(tw, 3)) / 12;
        break;
      }
    }

    const sx = area > 0 ? ix / (shape === 'rectangle' ? h / 2 : (shape === 'circle' ? d / 2 : (h || d) / 2)) : 0;
    const sy = area > 0 ? iy / (shape === 'rectangle' ? b / 2 : (shape === 'circle' ? d / 2 : (b || d) / 2)) : 0;

    if (isImperial) {
      setResults({
        ix: ix / MM4_TO_IN4,
        iy: iy / MM4_TO_IN4,
        sx: sx / MM3_TO_IN3,
        sy: sy / MM3_TO_IN3,
      });
    } else {
      setResults({ ix: ix / 1e4, iy: iy / 1e4, sx: sx / 1e3, sy: sy / 1e3 });
    }
  }, [shape, inputs, dimUnits, isImperial]);

  const momentUnit = isImperial ? 'in⁴' : 'cm⁴';
  const sectionUnit = isImperial ? 'in³' : 'cm³';

  const unitSelectClass =
    'w-16 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-y border-r border-gray-300 dark:border-gray-600 rounded-r-md text-gray-600 dark:text-gray-300 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4 space-y-4">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-lg">
                {L('단면 선택 및 치수', 'Shape & Dimensions')}
              </h3>
              <UnitSystemToggle className="shrink-0" />
            </div>

            <div className="space-y-2">
              <Label>{L('단면 형상', 'Cross-Section Shape')}</Label>
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as ShapeType)}
                className="w-full border rounded-md px-3 py-2 bg-background text-sm"
              >
                {shapes.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {shape === 'rectangle' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">b</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.b} onChange={(e) => updateInput('b', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="b unit" value={dimUnits.b} onChange={(e) => updateDimUnit('b', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">h</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.h} onChange={(e) => updateInput('h', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="h unit" value={dimUnits.h} onChange={(e) => updateDimUnit('h', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {shape === 'circle' && (
                <div className="space-y-1">
                  <Label className="text-xs">d</Label>
                  <div className="flex min-w-0">
                    <Input type="number" value={inputs.d} onChange={(e) => updateInput('d', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                    <select aria-label="d unit" value={dimUnits.d} onChange={(e) => updateDimUnit('d', e.target.value)} className={unitSelectClass}>
                      {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                    </select>
                  </div>
                </div>
              )}
              {shape === 'hollow_circle' && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">D_outer</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.d} onChange={(e) => updateInput('d', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="D_outer unit" value={dimUnits.d} onChange={(e) => updateDimUnit('d', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">t</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.t} onChange={(e) => updateInput('t', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="t unit" value={dimUnits.t} onChange={(e) => updateDimUnit('t', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                </>
              )}
              {(shape === 'ibeam' || shape === 'tbeam' || shape === 'lbeam') && (
                <>
                  <div className="space-y-1">
                    <Label className="text-xs">bf</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.bf} onChange={(e) => updateInput('bf', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="bf unit" value={dimUnits.bf} onChange={(e) => updateDimUnit('bf', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">h</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.h} onChange={(e) => updateInput('h', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="h unit" value={dimUnits.h} onChange={(e) => updateDimUnit('h', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">tw</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.tw} onChange={(e) => updateInput('tw', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="tw unit" value={dimUnits.tw} onChange={(e) => updateDimUnit('tw', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">tf</Label>
                    <div className="flex min-w-0">
                      <Input type="number" value={inputs.tf} onChange={(e) => updateInput('tf', e.target.value)} className="flex-1 min-w-0 rounded-r-none" />
                      <select aria-label="tf unit" value={dimUnits.tf} onChange={(e) => updateDimUnit('tf', e.target.value)} className={unitSelectClass}>
                        {DIM_UNITS.map((u) => (<option key={u} value={u}>{u}</option>))}
                      </select>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2"
            >
              {locale === 'ko' ? '계산하기' : 'Calculate'}
            </button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 space-y-4 bg-primary/5">
            <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">
              {L('계산 결과', 'Results')}
            </h3>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Ix</span>
                <span className="text-lg font-bold text-primary">
                  {results.ix !== null ? results.ix.toFixed(4) : '-'}{' '}
                  <span className="text-sm font-normal">{momentUnit}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Iy</span>
                <span className="text-lg font-bold text-primary">
                  {results.iy !== null ? results.iy.toFixed(4) : '-'}{' '}
                  <span className="text-sm font-normal">{momentUnit}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Sx</span>
                <span className="text-lg font-bold text-primary">
                  {results.sx !== null ? results.sx.toFixed(4) : '-'}{' '}
                  <span className="text-sm font-normal">{sectionUnit}</span>
                </span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">Sy</span>
                <span className="text-lg font-bold text-primary">
                  {results.sy !== null ? results.sy.toFixed(4) : '-'}{' '}
                  <span className="text-sm font-normal">{sectionUnit}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MomentOfInertia;
