'use client';

import React, { useState, useRef, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/I18nProvider';

const QRGenerator: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.qrGenerator;
  const [text, setText] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQRMatrix = (data: string): boolean[][] => {
    const size = 25;
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

    const setModule = (row: number, col: number, value: boolean) => {
      if (row >= 0 && row < size && col >= 0 && col < size) {
        matrix[row][col] = value;
      }
    };

    const drawFinderPattern = (startRow: number, startCol: number) => {
      for (let i = 0; i < 7; i++) {
        for (let j = 0; j < 7; j++) {
          const isBorder = i === 0 || i === 6 || j === 0 || j === 6;
          const isInner = i >= 2 && i <= 4 && j >= 2 && j <= 4;
          setModule(startRow + i, startCol + j, isBorder || isInner);
        }
      }
    };

    drawFinderPattern(0, 0);
    drawFinderPattern(0, size - 7);
    drawFinderPattern(size - 7, 0);

    for (let i = 8; i < size - 8; i++) {
      setModule(6, i, i % 2 === 0);
      setModule(i, 6, i % 2 === 0);
    }

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (matrix[i][j]) continue;

        const isFinderArea =
          (i < 9 && j < 9) ||
          (i < 9 && j >= size - 8) ||
          (i >= size - 8 && j < 9);

        if (!isFinderArea) {
          const hash = (i * 31 + j * 17 + data.length * 7 + i * j * 3) % 100;
          matrix[i][j] = hash < 45;
        }
      }
    }

    const hash = Array.from(data).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    for (let i = 0; i < 8; i++) {
      const row = size - 9;
      const col = i;
      setModule(row, col, ((hash >> i) & 1) === 1);
    }

    return matrix;
  };

  const generateQR = () => {
    if (!text.trim()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const matrix = generateQRMatrix(text);
    const size = 25;
    const moduleSize = 10;
    const margin = 4 * moduleSize;
    const canvasSize = size * moduleSize + margin * 2;

    canvas.width = canvasSize;
    canvas.height = canvasSize;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.fillStyle = '#000000';
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        if (matrix[row][col]) {
          ctx.fillRect(
            margin + col * moduleSize,
            margin + row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    setQrGenerated(true);
  };

  const downloadQR = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  useEffect(() => {
    if (text.trim()) {
      generateQR();
    }
  }, [text]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block mb-2">{t.inputLabel}</label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.inputPlaceholder}
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={generateQR} disabled={!text.trim()}>
          {t.generateButton}
        </Button>
        <Button variant="secondary" onClick={() => { setText(''); setQrGenerated(false); }}>
          {t.resetButton}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col items-center space-y-4">
      {qrGenerated ? (
        <>
          <div className="border rounded-lg p-4 bg-white">
            <canvas ref={canvasRef} />
          </div>
          <Button onClick={downloadQR}>{t.downloadButton}</Button>
          <p className="text-sm text-muted-foreground text-center">
            {t.textLength.replace('{count}', String(text.length))}
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-48">
          {t.emptyPrompt}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: t.descriptionContent,
    calculationFormula: t.formulaContent,
    usefulTips: t.tipsContent,
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

export default QRGenerator;
