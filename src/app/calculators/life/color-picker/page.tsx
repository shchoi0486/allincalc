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
        <p className="text-lg font-semibold text-foreground">
          HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보세요!
        </p>
        <p>
          컬러 피커는 웹 개발, 그래픽 디자인, UI/UX 디자인 등에서 색상을 정확하게 선택하고
          다양한 포맷으로 변환하여 활용할 수 있는 필수 도구입니다.
        </p>
        <p>
          HEX(#RRGGBB), RGB(레드, 그린, 블루), HSL(색상, 채도, 명도) 세 가지 주요 색상 포맷을
          실시간으로相互変換하고 색상 미리보기를 통해 결과를 즉시 확인할 수 있습니다.
        </p>
        <p>
          웹사이트 디자인 시 브랜드 색상을 정확하게 설정하거나, 디자인 작업 중 일관된 색상 팔레트를 관리할 때,
          또는 색상 코드를 모르는 상황에서 원하는 색상을 탐색할 때 유용하게 활용할 수 있습니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">색상 코드 변환 공식</h3>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-primary">HEX to RGB 변환</p>
            <p className="text-xs text-muted-foreground">16진수 2자리를 10진수로 변환합니다.</p>
            <code className="text-sm">R = parseInt(hex.substring(1,3), 16)</code><br/>
            <code className="text-sm">G = parseInt(hex.substring(3,5), 16)</code><br/>
            <code className="text-sm">B = parseInt(hex.substring(5,7), 16)</code>
          </div>
          <div className="p-4 bg-muted rounded-lg space-y-2 mt-4">
            <p className="font-semibold text-primary">RGB to HSL 변환</p>
            <p className="text-xs text-muted-foreground">RGB 값을 기반으로 색상(H), 채도(S), 명도(L)를 계산합니다.</p>
            <code className="text-sm">L = (max(R,G,B) + min(R,G,B)) / 2</code><br/>
            <code className="text-sm">S = (max - min) / (L > 0.5 ? 2 - max - min : max + min)</code><br/>
            <code className="text-sm">H = 색상에 따른 각도 계산 (0~360도)</code>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">색상 코드 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>HEX 코드:</strong> 웹 개발에서 가장 많이 사용되는 형식(#RRGGBB)으로, CSS에서 직접 입력할 수 있습니다.</li>
            <li><strong>RGB:</strong> 화면 표시에 적합하며, 투명도를 추가할 때 RGBA를 사용합니다.</li>
            <li><strong>HSL:</strong> 색상 조정 시 직관적이며, 밝기와 채도를 쉽게 변경 가능하여 디자인 작업에 편리합니다.</li>
            <li><strong>접근성(WCAG):</strong> 텍스트와 배경색의 대비율을 4.5:1 이상 유지하면 시각장애인도 읽기 쉬운 웹사이트를 만들 수 있습니다.</li>
            <li><strong>CSS 변수 활용:</strong> 프로젝트 전체에서 사용할 색상을 CSS 변수로 관리하면 유지보수가 편리합니다.</li>
            <li><strong>팔레트 생성:</strong> 메인 색상을 기반으로 유사색, 보색 등을 조합하면 조화로운 색상 구성이 가능합니다.</li>
            <li><strong>다크모드 고려:</strong> 라이트모드와 다크모드 모두에서 잘 보이는 색상을 선택하는 것이 좋습니다.</li>
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
