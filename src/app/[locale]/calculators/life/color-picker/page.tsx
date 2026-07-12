'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const ColorPicker: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.colorPicker;
  const isKo = locale === 'ko';
  const [hexInput, setHexInput] = useState('#3b82f6');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const isValidHex = (hex: string): boolean => {
    return /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
  };

  const normalizeHex = (hex: string): string => {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }
    return '#' + h.toUpperCase();
  };

  const rgb = hexToRgb(hexInput);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  const handleHexChange = (value: string) => {
    let newVal = value;
    if (!newVal.startsWith('#')) {
      newVal = '#' + newVal;
    }
    setHexInput(newVal);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  const randomColor = () => {
    const hex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    setHexInput(hex.toUpperCase());
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-20">{t.inputs.hex}:</label>
        <Input
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
        <input
          type="color"
          value={isValidHex(hexInput) ? normalizeHex(hexInput) : '#000000'}
          onChange={(e) => setHexInput(e.target.value.toUpperCase())}
          className="w-12 h-10 rounded cursor-pointer border"
        />
      </div>

      {rgb && (
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-sm mb-1">R</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.r}
              onChange={(e) => {
                const r = Math.min(255, Math.max(0, Number(e.target.value)));
                const newHex = '#' + [r, rgb.g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
                setHexInput(newHex);
              }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">G</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.g}
              onChange={(e) => {
                const g = Math.min(255, Math.max(0, Number(e.target.value)));
                const newHex = '#' + [rgb.r, g, rgb.b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
                setHexInput(newHex);
              }}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">B</label>
            <Input
              type="number"
              min={0}
              max={255}
              value={rgb.b}
              onChange={(e) => {
                const b = Math.min(255, Math.max(0, Number(e.target.value)));
                const newHex = '#' + [rgb.r, rgb.g, b].map(c => c.toString(16).padStart(2, '0')).join('').toUpperCase();
                setHexInput(newHex);
              }}
            />
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button onClick={randomColor}>{t.inputs.randomColor}</Button>
        <Button variant="secondary" onClick={() => setHexInput('#3B82F6')}>
          {t.inputs.reset}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {rgb && hsl ? (
        <>
          <div
            className="w-full h-32 rounded-lg border-2 border-gray-200 shadow-inner"
            style={{ backgroundColor: hexInput }}
          />

          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.results.hex}:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{normalizeHex(hexInput)}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(normalizeHex(hexInput), 'hex')}
                  >
                    {copiedField === 'hex' ? t.results.copied : t.results.copy}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.results.rgb}:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  >
                    {copiedField === 'rgb' ? t.results.copied : t.results.copy}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.results.hsl}:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  >
                    {copiedField === 'hsl' ? t.results.copied : t.results.copy}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          {t.results.invalidHex}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          ${t.descriptionContent.heading}
        </p>
        <p>
          ${t.descriptionContent.p1}
        </p>
        <p>
          ${t.descriptionContent.p2}
        </p>
        <p>
          ${t.descriptionContent.p3}
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.heading}</h3>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-primary">${t.formula.hexToRgb}</p>
            <p className="text-xs text-muted-foreground">${t.formula.hexToRgbDesc}</p>
            <code className="text-sm">R = parseInt(hex.substring(1,3), 16)</code><br/>
            <code className="text-sm">G = parseInt(hex.substring(3,5), 16)</code><br/>
            <code className="text-sm">B = parseInt(hex.substring(5,7), 16)</code>
          </div>
          <div className="p-4 bg-muted rounded-lg space-y-2 mt-4">
            <p className="font-semibold text-primary">${t.formula.rgbToHsl}</p>
            <p className="text-xs text-muted-foreground">${t.formula.rgbToHslDesc}</p>
            <code className="text-sm">L = (max(R,G,B) + min(R,G,B)) / 2</code><br/>
            <code className="text-sm">S = (max - min) / (L > 0.5 ? 2 - max - min : max + min)</code><br/>
            <code className="text-sm">${isKo ? 'H = 색상에 따른 각도 계산 (0~360도)' : 'H = hue angle (0~360°)'}</code>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">${t.tips.heading}</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            ${t.tips.items.map((item: { title: string; desc: string }) => `
            <li><strong>${item.title}:</strong> ${item.desc}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ColorPicker;
