'use client';

import { useState, useRef, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ImageResizer = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setOriginalImage(event.target?.result as string);
        setOriginalSize({ width: img.width, height: img.height });
        setTargetWidth(img.width);
        setTargetHeight(img.height);
        setResultImage(null);
        imgRef.current = img;
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, []);

  const handleWidthChange = (value: number) => {
    setTargetWidth(value);
    if (maintainAspect && originalSize.width > 0) {
      setTargetHeight(Math.round((value / originalSize.width) * originalSize.height));
    }
  };

  const handleHeightChange = (value: number) => {
    setTargetHeight(value);
    if (maintainAspect && originalSize.height > 0) {
      setTargetWidth(Math.round((value / originalSize.height) * originalSize.width));
    }
  };

  const resize = () => {
    if (!imgRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(imgRef.current, 0, 0, targetWidth, targetHeight);
    setResultImage(canvas.toDataURL('image/png'));
  };

  const downloadImage = () => {
    if (!resultImage) return;
    const a = document.createElement('a');
    a.href = resultImage;
    a.download = 'resized-image.png';
    a.click();
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">이미지 업로드</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
        />
      </div>
      {originalImage && (
        <>
          <div className="text-xs text-muted-foreground text-center">
            원본: {originalSize.width} x {originalSize.height}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <img src={originalImage} alt="Original" className="w-full h-auto" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">목표 크기</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={1}
                max={4000}
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
              />
              <span className="text-muted-foreground">×</span>
              <Input
                type="number"
                min={1}
                max={4000}
                value={targetHeight}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="rounded"
              />
              <span className="text-muted-foreground">비율 유지</span>
            </label>
          </div>
          <Button onClick={resize} className="w-full">이미지 리사이즈</Button>
        </>
      )}
    </div>
  );

  const resultSection = resultImage ? (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground text-center">
        결과: {targetWidth} x {targetHeight}
      </div>
      <Button variant="outline" size="sm" onClick={downloadImage} className="w-full">다운로드</Button>
      <div className="border border-border rounded-lg overflow-hidden">
        <img src={resultImage} alt="Resized" className="w-full h-auto" />
      </div>
    </div>
  ) : originalImage ? (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      크기를 설정하고 리사이즈를 클릭하세요
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      이미지를 업로드하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">이미지 리사이저</strong>는 업로드한 이미지의 크기를 원하는 너비와 높이로 정확하게 변환하는 브라우저 기반 이미지 처리 도구입니다. HTML5 Canvas API를 활용하여 브라우저 내에서 이미지를 재렌더링하므로, 서버로 데이터가 전송되지 않아 프라이버시가 완벽하게 보장됩니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          블로그 포스트용 이미지 리사이징, SNS 게시물 크기 조절, 웹사이트 썸네일 생성, 이메일 첨부 이미지 용량 줄이기, 인쇄용 이미지 해상도 조정 등 다양한 목적으로 활용할 수 있습니다. JPG, PNG, GIF, WebP, BMP 등 브라우저가 지원하는 모든 이미지 형식의 입력을 처리하며, 결과물은 PNG 형식(투명도 지원)으로 다운로드할 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          비율 유지 옵션을 통해 원본 이미지의 가로세로 비율을 손상시키지 않으면서 안전하게 리사이즈할 수 있으며, 수동으로 가로세로 비율을 조절하여 왜곡된 이미지도 의도적으로 생성할 수 있습니다. 원본 미리보기와 결과 미리보기를 통해 리사이즈 전후의 결과를 즉시 비교할 수 있습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          별도의 소프트웨어 설치나 회원가입 없이 웹 브라우저만으로 바로 사용 가능하며, 전문 이미지 편집 도구(포토샵, GIMP 등) 없이도 빠르게 이미지 크기를 조절하고 싶을 때 매우 유용합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">이미지 리사이즈 알고리즘:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">HTML5 Canvas API의 drawImage() 메서드</strong>를 사용하여 클라이언트 사이드에서 이미지를 리사이즈합니다. 브라우저의 Canvas 2D 컨텍스트가 내부적으로 보간(Interpolation) 알고리즘을 적용하여 새로운 크기의 이미지를 생성합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 이미지 로드:</strong> 사용자가 업로드한 이미지 파일을 FileReader API로 읽어 data URL로 변환한 후, Image 객체에 로드합니다. 이 과정에서 원본 이미지의 너비, 높이 등의 메타데이터를 추출합니다.</p>
          <p><strong className="text-foreground">2단계 - 목표 크기 계산:</strong> 사용자가 입력한 목표 너비와 높이를 설정합니다. 비율 유지 옵션이 활성화된 경우, 원본 이미지의 가로세로 비율(Aspect Ratio)을 기반으로 한 축의 크기에 맞춰 다른 축의 크기를 자동 계산합니다. 공식: 목표 높이 = (목표 너비 / 원본 너비) × 원본 높이.</p>
          <p><strong className="text-foreground">3단계 - Canvas 렌더링:</strong> 새로운 Canvas 요소를 생성하고, its 크기를 목표 너비/높이로 설정한 후, drawImage() 메서드로 원본 이미지를 목표 크기로 재렌더링합니다. 이 과정에서 브라우저의 보간 알고리즘이 적용되어 새로운 크기의 픽셀 데이터를 생성합니다.</p>
          <p><strong className="text-foreground">4단계 - 출력:</strong> Canvas의 toDataURL() 메서드를 사용하여 리사이즈된 이미지를 PNG 형식의 data URL로 변환합니다. 이 data URL은 화면에 표시하거나 다운로드에 사용됩니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">지원 입력 형식:</strong> JPG, PNG, GIF, WebP, BMP 등 브라우저가 지원하는 모든 이미지 형식 | <strong className="text-foreground">출력 형식:</strong> PNG (투명도 지원, 무손실 압축)</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 비율 유지 옵션을 기본으로 사용하세요</p>
            <p>"비율 유지" 체크박스를 활성화하면 원본 이미지의 가로세로 비율이 유지됩니다. 이를 통해 이미지가 찌그러지지 않고 자연스러운 형태로 리사이즈됩니다. 의도적으로 왜곡된 효과가 필요한 경우에만 비율 유지 옵션을 해제하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 확대보다는 축소를 권장합니다</p>
            <p>이미지를 원본보다 크게 확대하면 픽셀이 늘어나면서 뿌옇거나 계단 현상(앨리어싱)이 발생할 수 있습니다. 가능하면 원본보다 작은 크기로 축소하는 것을 권장합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. 용도에 맞는 크기를 미리 계산하세요</p>
            <p>- 웹 블로그 본문 이미지: 800~1200px 너비</p>
            <p>- SNS 게시물(인스타그램): 1080×1080px</p>
            <p>- SNS 게시물(페이스북): 1200×630px</p>
            <p>- 웹사이트 썸네일: 300~400px 너비</p>
            <p>용도에 맞는 목표 크기를 미리 알면 효과적인 리사이즈가 가능합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. PNG 형식의 특성을 이해하세요</p>
            <p>결과물은 PNG 형식으로 저장됩니다. PNG는 무손실 압축으로 화질이 손상되지 않지만, JPG보다 파일 크기가 클 수 있습니다. 웹에서 사용 시 파일 크기가 중요한 경우 별도의 이미지 압축 도구를 활용하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 대량 리사이즈가 필요하면 전문 도구를 사용하세요</p>
            <p>여러 이미지를 한 번에 리사이즈해야 하는 경우 브라우저 기반 도구보다 ImageMagick, GIMP, 포토샵 등의 전문 도구를 사용하는 것이 더 효율적입니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 원본 이미지를 백업하세요</p>
            <p>리사이즈 전에 원본 이미지를 별도로 저장해두세요. 리사이즈된 이미지는 되돌릴 수 없으므로, 원본이 필요한 경우에 대비하는 것이 좋습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 프라이버시가 보장됩니다</p>
            <p>이미지 처리가 전부 브라우저 내에서 이루어지며, 업로드한 이미지는 외부 서버로 전송되지 않습니다. 개인정보가 포함된 사진이나 스크린샷도 안심하고 리사이즈할 수 있습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="이미지 리사이저"
      description="이미지 크기를 원하는 크기로 변환합니다"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ImageResizer;
