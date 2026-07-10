'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const ColorPicker: React.FC = () => {
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
        <label className="w-20">HEX:</label>
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
        <Button onClick={randomColor}>랜덤 색상</Button>
        <Button variant="secondary" onClick={() => setHexInput('#3B82F6')}>
          초기화
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
                <span className="text-sm font-medium">HEX:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">{normalizeHex(hexInput)}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(normalizeHex(hexInput), 'hex')}
                  >
                    {copiedField === 'hex' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">RGB:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">rgb({rgb.r}, {rgb.g}, {rgb.b})</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, 'rgb')}
                  >
                    {copiedField === 'rgb' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">HSL:</span>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, 'hsl')}
                  >
                    {copiedField === 'hsl' ? '복사됨!' : '복사'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          유효한 HEX 색상 코드를 입력해주세요
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg">컬러 피커는 HEX, RGB, HSL 등 다양한 색상 코드를 자유롭게 변환하고 미리 볼 수 있는 웹 디자인 필수 도구입니다.</p>
        <p>웹 개발, 그래픽 디자인, UI/UX 디자인 등에서 색상을 정확하게 선택하고 다양한 포맷으로 변환하여 활용할 수 있습니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">색상 코드 변환 공식</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
            <p><strong>HEX to RGB:</strong></p>
            <code className="text-sm">R = parseInt(hex.substring(1,3), 16)</code><br/>
            <code className="text-sm">G = parseInt(hex.substring(3,5), 16)</code><br/>
            <code className="text-sm">B = parseInt(hex.substring(5,7), 16)</code>
          </div>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2 mt-4">
            <p><strong>RGB to HSL:</strong></p>
            <code className="text-sm">H = acos(-1/3 * ((R-G) + (R-B)) / sqrt((R-G)² + (R-B)(G-B)))</code><br/>
            <code className="text-sm">S = max - min / max + min (L > 0.5)</code><br/>
            <code className="text-sm">L = (max + min) / 2</code>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">색상 코드 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>HEX 코드:</strong> 웹 개발에서 가장 많이 사용되는 형식 (#RRGGBB)</li>
            <li><strong>RGB:</strong> 화면 표시에 적합하며, 투명도를 추가할 때 RGBA 사용</li>
            <li><strong>HSL:</strong> 색상 조정 시 직관적이며, 밝기와 채도를 쉽게 변경 가능</li>
            <li><strong>접근성:</strong> 텍스트와 배경색의 대비율을 4.5:1 이상 유지하세요</li>
            <li><strong>일관성:</strong> 프로젝트 전체에서 사용할 색상을 CSS 변수로 관리하면 유지보수가 편리합니다</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="컬러 피커"
      description="색상 코드를 확인하고 다양한 포맷으로 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ColorPicker;
