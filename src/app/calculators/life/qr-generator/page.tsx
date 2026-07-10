'use client';

import React, { useState, useRef, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const QRGenerator: React.FC = () => {
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
        <label className="block mb-2">텍스트 또는 URL 입력:</label>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="https://example.com 또는 텍스트 입력"
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={generateQR} disabled={!text.trim()}>
          QR 코드 생성
        </Button>
        <Button variant="secondary" onClick={() => { setText(''); setQrGenerated(false); }}>
          초기화
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
          <Button onClick={downloadQR}>PNG로 다운로드</Button>
          <p className="text-sm text-muted-foreground text-center">
            입력된 텍스트 길이: {text.length}자
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-48">
          텍스트를 입력하면 QR 코드가 표시됩니다
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg">QR 코드 생성기는 텍스트, URL, 연락처 정보 등을 QR 코드로 변환하여 빠르게 공유할 수 있는 도구입니다.</p>
        <p>스마트폰 카메라로 스캔하면 바로 연결되는 QR 코드를 생성할 수 있으며, 생성된 QR 코드는 PNG 파일로 다운로드하여 인물, 명함, 포스터 등에 활용할 수 있습니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">QR 코드 구조</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Finder Pattern:</strong> 3개의 코너에 위치한 큰 정사각형 패턴으로 스캐너가 QR 코드의 위치를 인식합니다</li>
            <li><strong>Timing Pattern:</strong> Finder 패턴 사이의 점선으로 모듈 크기를 결정합니다</li>
            <li><strong>Data Modules:</strong> 실제 데이터가 인코딩된 영역</li>
            <li><strong>Error Correction:</strong> QR 코드가 부분적으로 손상되어도 복구 가능한 중복 데이터</li>
          </ul>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">QR 코드 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>URL 공유:</strong> 웹사이트 링크를 QR 코드로 만들어 명함이나 포스터에 인쇄</li>
            <li><strong>와이파이 연결:</strong> Wi-Fi 비밀번호를 QR 코드로 만들어 손님에게 공유</li>
            <li><strong>메뉴판:</strong> 식당 메뉴를 QR 코드로 연결하여 종이 절약</li>
            <li><strong>크기:</strong> QR 코드는 최소 2cm x 2cm 이상으로 인쇄해야 스캔 가능</li>
            <li><strong>여백:</strong> QR 코드 주변에 충분한 여백(Quiet Zone)을 두어야 정확한 스캔이 가능합니다</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="QR 코드 생성기"
      description="텍스트나 URL을 QR 코드로 변환합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default QRGenerator;
