'use client';

import { useState, useRef } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ArtStyle = 'geometric' | 'abstract' | 'landscape' | 'pattern';

function generateSVG(prompt: string, style: ArtStyle): string {
  const width = 400;
  const height = 400;
  const seed = prompt.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const rand = (i: number) => ((seed * (i + 1) * 9301 + 49297) % 233280) / 233280;

  let shapes = '';

  if (style === 'geometric') {
    for (let i = 0; i < 15; i++) {
      const x = rand(i * 4) * width;
      const y = rand(i * 4 + 1) * height;
      const size = 20 + rand(i * 4 + 2) * 80;
      const hue = rand(i * 4 + 3) * 360;
      const opacity = 0.3 + rand(i * 5) * 0.5;
      const shapeType = rand(i * 6) > 0.5 ? 'rect' : 'circle';
      if (shapeType === 'rect') {
        shapes += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="hsl(${hue}, 70%, 60%)" opacity="${opacity}" transform="rotate(${rand(i * 7) * 45} ${x + size / 2} ${y + size / 2})" />`;
      } else {
        shapes += `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="hsl(${hue}, 60%, 55%)" opacity="${opacity}" />`;
      }
    }
  } else if (style === 'abstract') {
    for (let i = 0; i < 8; i++) {
      const x1 = rand(i * 6) * width;
      const y1 = rand(i * 6 + 1) * height;
      const x2 = rand(i * 6 + 2) * width;
      const y2 = rand(i * 6 + 3) * height;
      const hue = rand(i * 6 + 4) * 360;
      shapes += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(${hue}, 70%, 55%)" stroke-width="${3 + rand(i * 6 + 5) * 8}" stroke-linecap="round" opacity="0.6" />`;
    }
    for (let i = 0; i < 5; i++) {
      const cx = rand(i * 3 + 50) * width;
      const cy = rand(i * 3 + 51) * height;
      const r = 15 + rand(i * 3 + 52) * 60;
      const hue = rand(i * 3 + 53) * 360;
      shapes += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="hsl(${hue}, 65%, 60%)" opacity="0.4" />`;
    }
  } else if (style === 'landscape') {
    shapes += `<rect x="0" y="0" width="${width}" height="${height * 0.6}" fill="hsl(200, 60%, 70%)" />`;
    shapes += `<rect x="0" y="${height * 0.6}" width="${width}" height="${height * 0.4}" fill="hsl(120, 40%, 45%)" />`;
    const sunX = width * 0.75;
    const sunY = height * 0.2;
    shapes += `<circle cx="${sunX}" cy="${sunY}" r="40" fill="hsl(45, 90%, 65%)" />`;
    for (let i = 0; i < 4; i++) {
      const mx = rand(i * 2 + 80) * width;
      const mh = 60 + rand(i * 2 + 81) * 120;
      const mw = 80 + rand(i * 2 + 82) * 100;
      shapes += `<polygon points="${mx},${height * 0.6} ${mx + mw / 2},${height * 0.6 - mh} ${mx + mw},${height * 0.6}" fill="hsl(${120 + rand(i * 9) * 30}, 35%, 35%)" />`;
    }
  } else if (style === 'pattern') {
    const cellSize = 40;
    for (let x = 0; x < width; x += cellSize) {
      for (let y = 0; y < height; y += cellSize) {
        const idx = (x / cellSize) * (height / cellSize) + y / cellSize;
        const hue = (idx * 30 + seed) % 360;
        const patternType = Math.floor(rand(idx) * 3);
        if (patternType === 0) {
          shapes += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="hsl(${hue}, 50%, 65%)" opacity="0.7" />`;
        } else if (patternType === 1) {
          shapes += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize / 2.5}" fill="hsl(${hue}, 60%, 55%)" opacity="0.7" />`;
        } else {
          shapes += `<rect x="${x + 2}" y="${y + 2}" width="${cellSize - 4}" height="${cellSize - 4}" fill="none" stroke="hsl(${hue}, 50%, 50%)" stroke-width="2" opacity="0.7" />`;
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="hsl(220, 15%, 95%)" />
    ${shapes}
  </svg>`;
}

const ImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState<ArtStyle>('geometric');
  const [result, setResult] = useState('');
  const svgRef = useRef<HTMLDivElement>(null);

  const generate = () => {
    if (!prompt.trim()) return;
    setResult(generateSVG(prompt, style));
  };

  const downloadSVG = () => {
    const blob = new Blob([result], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-art.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">아트 생성 프롬프트</label>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="예: 산과 강, 추상적인 패턴, 빛과 그림자..."
          className="min-h-[100px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">아트 스타일</label>
        <Select value={style} onValueChange={(v) => setStyle(v as ArtStyle)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geometric">기하학적</SelectItem>
            <SelectItem value="abstract">추상적</SelectItem>
            <SelectItem value="landscape">풍경</SelectItem>
            <SelectItem value="pattern">패턴</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={generate} className="w-full" disabled={!prompt.trim()}>SVG 아트 생성</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={copyToClipboard} className="flex-1">SVG 복사</Button>
        <Button variant="outline" size="sm" onClick={downloadSVG} className="flex-1">다운로드</Button>
      </div>
      <div ref={svgRef} className="border border-border rounded-lg overflow-hidden bg-background flex items-center justify-center p-4" dangerouslySetInnerHTML={{ __html: result }} />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      프롬프트를 입력하고 SVG 아트 생성을 클릭하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">이미지 생성기</strong>는 텍스트 프롬프트를 입력하면 브라우저 내에서 알고리즘 기반의 SVG 아트를 실시간으로 생성하는 도구입니다. 완전한 AI 이미지 생성과는 다르게, 수학적 알고리즘과 의사 난수(Pseudo-Random Number)를 활용하여 기하학적, 추상적, 풍경, 패턴 형태의 독특한 그래픽을 만듭니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          웹사이트 배경 이미지, 블로그 포스트 일러스트, 프레젠테이션 슬라이드 배경, 소셜미디어 게시물 이미지, 포트폴리오용 그래픽, 데코레이티브 아트 등 다양한 목적으로 활용할 수 있습니다. 프롬프트를 바탕으로 시드(Seed) 값을 생성하기 때문에 같은 프롬프트를 입력하면 항상 동일한 결과가 생성되며, 프롬프트를 조금만 바꿔도 완전히 새로운 아트가 탄생합니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          생성되는 이미지는 SVG(Scalable Vector Graphics) 벡터 형식이므로, 어떤 크기로 확대하거나 축소해도 화질이 저하되지 않습니다. 이는 래스터 이미지(JPG, PNG)와 비교할 때 큰 장점으로, 인쇄물, 대형 스크린, 웹 등 다양한 매체에서 품질 손실 없이 사용할 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          별도의 회원가입이나 소프트웨어 설치 없이 웹 브라우저만 있으면 바로 사용 가능하며, 생성된 SVG 코드는 복사하거나 다운로드하여 웹 개발 프로젝트에 직접 통합할 수도 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">SVG 아트 생성 알고리즘:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">시드 기반 의사 난수 생성 알고리즘(Linear Congruential Generator)</strong>과 SVG 그래픽 요소를 조합하여 이미지를 생성합니다. 프롬프트 문자열의 각 문자 코드值를 합산하여 시드(seed) 값을 결정하고, 이 시드로부터 의사 난수 시퀀스를 생성합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 시드 값 산출:</strong> 입력된 프롬프트의 각 문자를 ASCII/유니코드 코드 값으로 변환하여 모두 더합니다. 이 값이 난수 시퀀스의 출발점이 됩니다.</p>
          <p><strong className="text-foreground">2단계 - 의사 난수 생성:</strong> 시드值를 사용하여 선형 합동법(Linear Congruential Generator, LCG) 공식에 따라 0~1 사이의 난수 값을 생성합니다. X(n+1) = (a × X(n) + c) mod m 형태의 공식에서 a=9301, c=49297, m=233280의 상수를 사용합니다.</p>
          <p><strong className="text-foreground">3단계 - 스타일별 도형 생성:</strong> 선택된 아트 스타일(기하학적/추상적/풍경/패턴)에 따라 생성된 난수 값을 활용하여 SVG 도형의 위치(x, y), 크기, 색상(HSL), 투명도, 회전 각도 등의 속성을 결정합니다.</p>
          <p><strong className="text-foreground">4단계 - SVG 코드 조립:</strong> 생성된 도형들을 SVG XML 형식으로 조립하여 400×400 크기의 완성된 SVG 문서를 생성합니다. 배경 사각형 위에 도형들이 렌더링됩니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">스타일 유형:</strong></p>
          <p>- <strong className="text-foreground">기하학적(Geometric):</strong> 사각형과 원형을 회전시켜 배치, HSL 색상으로 시각적 다양성 확보</p>
          <p>- <strong className="text-foreground">추상적(Abstract):</strong> 선분과 원형을 겹쳐서 추상적인 구성을 생성</p>
          <p>- <strong className="text-foreground">풍경(Landscape):</strong> 하늘, 땅, 태양, 산의 레이어로 풍경화 구성</p>
          <p>- <strong className="text-foreground">패턴(Pattern):</strong> 그리드 셀마다 다른 도형과 색상으로 반복 패턴 생성</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 구체적인 프롬프트를 작성하세요</p>
            <p>"산과 강", "추상적인 패턴", "빛과 그림자" 등 구체적인 키워드를 조합하면 더 흥미로운 결과를 얻을 수 있습니다. 추상적이거나 시적인 표현도 독특한 아트를 생성하므로 자유롭게 시도해보세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 다양한 스타일을 비교해보세요</p>
            <p>같은 프롬프트로 4가지 스타일(기하학적, 추상적, 풍경, 패턴)을 모두 시도해보세요. 각 스타일마다 완전히 다른 분위기의 결과가 생성됩니다. 원하는 분위기에 가장 가까운 스타일을 선택하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. SVG 벡터의 장점을 활용하세요</p>
            <p>생성된 이미지는 SVG 벡터 형식이므로 무한 확대/축소가 가능합니다. 웹사이트 아이콘으로 작게 사용하거나, 인쇄물용으로 크게 확대해도 선명한 품질을 유지합니다. 웹 개발에서 직접 SVG 코드를 사용할 수도 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. 동일 프롬프트의 결정적 특성을 이용하세요</p>
            <p>같은 프롬프트를 입력하면 항상 같은 결과가 생성됩니다(결정적 생성). 마음에 드는 프롬프트가 있으면 기록해두었다가 나중에 다시 사용할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 다운로드와 복사를 활용하세요</p>
            <p>"SVG 복사" 버튼으로 SVG 코드를 클립보드에 복사하여 웹 프로젝트에 바로 삽입하거나, "다운로드" 버튼으로 파일을 저장하여 그래픽 에디터에서 편집할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 프롬프트를 수정하여 변형을 만드세요</p>
            <p>마음에 드는 결과가 나왔다면, 프롬프트를 약간만 수정(단어 추가/제거/변경)하여 새로운 변형을 만들어보세요. 비슷하면서도 다른 아트를 연속으로 생성할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 프라이버시가 보장됩니다</p>
            <p>모든 생성 과정이 브라우저에서 이루어지며, 프롬프트 내용은 외부 서버로 전송되지 않습니다. 아이디어나 창작 의도가 담긴 프롬프트도 안심하고 사용할 수 있습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="이미지 생성기"
      description="텍스트 프롬프트로 SVG 아트를 생성합니다"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ImageGenerator;
