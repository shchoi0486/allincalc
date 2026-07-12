'use client';

import { useState, useRef, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/I18nProvider';

const ImageResizer = () => {
  const { dict, locale } = useI18n();
  const t = dict.imageResizer;
  const isKo = locale === 'ko';
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
        <label className="text-sm font-medium">{t.uploadLabel}</label>
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
            {t.originalSize.replace('{width}', String(originalSize.width)).replace('{height}', String(originalSize.height))}
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <img src={originalImage} alt="Original" className="w-full h-auto" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">{t.targetSize}</label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                min={1}
                max={4000}
                value={targetWidth}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
              />
              <span className="text-muted-foreground">x</span>
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
              <span className="text-muted-foreground">{t.maintainAspect}</span>
            </label>
          </div>
          <Button onClick={resize} className="w-full">{t.resizeButton}</Button>
        </>
      )}
    </div>
  );

  const resultSection = resultImage ? (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground text-center">
        {t.resultSize.replace('{width}', String(targetWidth)).replace('{height}', String(targetHeight))}
      </div>
      <Button variant="outline" size="sm" onClick={downloadImage} className="w-full">{t.downloadButton}</Button>
      <div className="border border-border rounded-lg overflow-hidden">
        <img src={resultImage} alt="Resized" className="w-full h-auto" />
      </div>
    </div>
  ) : originalImage ? (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      {t.emptyPromptResize}
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      {t.emptyPromptUpload}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isKo ? (
            <><strong className="text-foreground">이미지 리사이저</strong>는 업로드한 이미지의 크기를 원하는 너비와 높이로 정확하게 변환하는 브라우저 기반 이미지 처리 도구입니다. HTML5 Canvas API를 활용하여 브라우저 내에서 이미지를 재렌더링하므로, 서버로 데이터가 전송되지 않아 프라이버시가 완벽하게 보장됩니다.</>
          ) : (
            <><strong className="text-foreground">Image Resizer</strong> is a browser-based image processing tool that accurately resizes your uploaded image to the desired width and height. Using the HTML5 Canvas API to re-render the image in the browser means no data is sent to any server, fully protecting your privacy.</>
          )}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isKo ? (
            <>블로그 포스트용 이미지 리사이징, SNS 게시물 크기 조절, 웹사이트 썸네일 생성, 이메일 첨부 이미지 용량 줄이기, 인쇄용 이미지 해상도 조정 등 다양한 목적으로 활용할 수 있습니다. JPG, PNG, GIF, WebP, BMP 등 브라우저가 지원하는 모든 이미지 형식의 입력을 처리하며, 결과물은 PNG 형식(투명도 지원)으로 다운로드할 수 있습니다.</>
          ) : (
            <>It can be used for many purposes: resizing images for blog posts, adjusting SNS post dimensions, generating website thumbnails, reducing email attachment sizes, and tuning print image resolution. It handles all browser-supported image formats such as JPG, PNG, GIF, WebP, and BMP, and the result downloads as a PNG (with transparency support).</>
          )}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isKo ? (
            <>비율 유지 옵션을 통해 원본 이미지의 가로세로 비율을 손상시키지 않으면서 안전하게 리사이즈할 수 있으며, 수동으로 가로세로 비율을 조절하여 왜곡된 이미지도 의도적으로 생성할 수 있습니다. 원본 미리보기와 결과 미리보기를 통해 리사이즈 전후의 결과를 즉시 비교할 수 있습니다.</>
          ) : (
            <>The maintain-aspect-ratio option lets you resize safely without distorting the original proportions, while you can also manually adjust the ratio to intentionally create distorted images. The original and result previews let you instantly compare before and after.</>
          )}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isKo ? (
            <>별도의 소프트웨어 설치나 회원가입 없이 웹 브라우저만으로 바로 사용 가능하며, 전문 이미지 편집 도구(포토샵, GIMP 등) 없이도 빠르게 이미지 크기를 조절하고 싶을 때 매우 유용합니다.</>
          ) : (
            <>It runs directly in any web browser with no software installation or sign-up, and is very handy when you want to quickly resize images without professional editors like Photoshop or GIMP.</>
          )}
        </p>
        <TermGlossary items={[
          { term: 'HTML5 Canvas API', desc: isKo ? '브라우저에서 스크립트로 이미지나 그래픽을 그릴 수 있게 하는 API입니다. 이 도구는 Canvas의 drawImage로 이미지를 메모리상에서 리사이즈합니다.' : 'An API that lets scripts draw images and graphics in the browser. This tool uses Canvas drawImage to resize images in memory.' },
          { term: isKo ? '가로세로 비율(Aspect Ratio)' : 'Aspect Ratio', desc: isKo ? '이미지의 가로와 세로의 비율입니다. 비율을 유지하며 리사이즈하면 이미지가 찌그러지지 않고 자연스러운 형태를 보존합니다.' : 'The ratio of an image’s width to its height. Resizing while preserving it keeps the image from being squashed and preserves its natural shape.' },
          { term: isKo ? '무손실 압축' : 'Lossless Compression', desc: isKo ? '이미지 품질을 전혀 잃지 않고 데이터를 압축하는 방식입니다. PNG가 대표적이며, 원본과 차이가 없는 출력을 보장합니다.' : 'A compression method that loses no image quality. PNG is a prime example, guaranteeing output identical to the original.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{isKo ? '이미지 리사이즈 알고리즘:' : 'Image Resize Algorithm:'}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isKo ? (
            <>본 도구는 <strong className="text-foreground">HTML5 Canvas API의 drawImage() 메서드</strong>를 사용하여 클라이언트 사이드에서 이미지를 리사이즈합니다. 브라우저의 Canvas 2D 컨텍스트가 내부적으로 보간(Interpolation) 알고리즘을 적용하여 새로운 크기의 이미지를 생성합니다.</>
          ) : (
            <>This tool resizes images on the client side using the <strong className="text-foreground">HTML5 Canvas API drawImage() method</strong>. The browser’s Canvas 2D context internally applies an interpolation algorithm to produce the new-sized image.</>
          )}
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">{isKo ? '1단계 - 이미지 로드:' : 'Step 1 - Load Image:'}</strong> {isKo ? '사용자가 업로드한 이미지 파일을 FileReader API로 읽어 data URL로 변환한 후, Image 객체에 로드합니다. 이 과정에서 원본 이미지의 너비, 높이 등의 메타데이터를 추출합니다.' : 'The uploaded image file is read via the FileReader API and converted to a data URL, then loaded into an Image object. During this step, metadata such as the original width and height is extracted.'}</p>
          <p><strong className="text-foreground">{isKo ? '2단계 - 목표 크기 계산:' : 'Step 2 - Calculate Target Size:'}</strong> {isKo ? '사용자가 입력한 목표 너비와 높이를 설정합니다. 비율 유지 옵션이 활성화된 경우, 원본 이미지의 가로세로 비율(Aspect Ratio)을 기반으로 한 축의 크기에 맞춰 다른 축의 크기를 자동 계산합니다.' : 'The user sets the target width and height. When the maintain-aspect-ratio option is enabled, the other axis is auto-calculated from one axis based on the original aspect ratio.'}</p>
          <p><strong className="text-foreground">{isKo ? '3단계 - Canvas 렌더링:' : 'Step 3 - Canvas Rendering:'}</strong> {isKo ? '새로운 Canvas 요소를 생성하고, 크기를 목표 너비/높이로 설정한 후, drawImage() 메서드로 원본 이미지를 목표 크기로 재렌더링합니다.' : 'A new Canvas element is created, its size is set to the target width/height, and the original image is re-rendered to the target size via the drawImage() method.'}</p>
          <p><strong className="text-foreground">{isKo ? '4단계 - 출력:' : 'Step 4 - Output:'}</strong> {isKo ? 'Canvas의 toDataURL() 메서드를 사용하여 리사이즈된 이미지를 PNG 형식의 data URL로 변환합니다.' : 'The resized image is converted to a PNG data URL using the Canvas toDataURL() method.'}</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">{isKo ? '지원 입력 형식:' : 'Supported Input Formats:'}</strong> {isKo ? 'JPG, PNG, GIF, WebP, BMP 등 브라우저가 지원하는 모든 이미지 형식 | 출력 형식: PNG (투명도 지원, 무손실 압축)' : 'All browser-supported image formats such as JPG, PNG, GIF, WebP, BMP | Output Format: PNG (transparency supported, lossless compression)'}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{isKo ? '효과적인 사용법과 팁:' : 'Effective Usage Tips:'}</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{isKo ? '1. 비율 유지 옵션을 기본으로 사용하세요' : '1. Use the maintain-aspect-ratio option by default'}</p>
            <p>{isKo ? '"비율 유지" 체크박스를 활성화하면 원본 이미지의 가로세로 비율이 유지됩니다. 이를 통해 이미지가 찌그러지지 않고 자연스러운 형태로 리사이즈됩니다.' : 'Enabling the "Maintain Aspect Ratio" checkbox preserves the original image proportions so it resizes naturally without distortion.'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '2. 확대보다는 축소를 권장합니다' : '2. Prefer shrinking over enlarging'}</p>
            <p>{isKo ? '이미지를 원본보다 크게 확대하면 픽셀이 늘어나면서 뿌옇거나 계단 현상(앨리어싱)이 발생할 수 있습니다. 가능하면 원본보다 작은 크기로 축소하는 것을 권장합니다.' : 'Enlarging beyond the original size adds pixels, which can cause blur or stair-step artifacts (aliasing). Shrink to a smaller size than the original whenever possible.'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '3. 용도에 맞는 크기를 미리 계산하세요' : '3. Calculate the right size for your purpose beforehand'}</p>
            <p>{isKo ? '- 웹 블로그 본문 이미지: 800~1200px 너비' : '- Web blog body image: 800~1200px width'}</p>
            <p>{isKo ? '- SNS 게시물(인스타그램): 1080x1080px' : '- SNS post (Instagram): 1080x1080px'}</p>
            <p>{isKo ? '- SNS 게시물(페이스북): 1200x630px' : '- SNS post (Facebook): 1200x630px'}</p>
            <p>{isKo ? '- 웹사이트 썸네일: 300~400px 너비' : '- Website thumbnail: 300~400px width'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '4. PNG 형식의 특성을 이해하세요' : '4. Understand PNG characteristics'}</p>
            <p>{isKo ? '결과물은 PNG 형식으로 저장됩니다. PNG는 무손실 압축으로 화질이 손상되지 않지만, JPG보다 파일 크기가 클 수 있습니다.' : 'The result is saved as PNG. PNG uses lossless compression so quality is preserved, but the file size can be larger than JPG.'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '5. 대량 리사이즈가 필요하면 전문 도구를 사용하세요' : '5. Use professional tools for bulk resizing'}</p>
            <p>{isKo ? '여러 이미지를 한 번에 리사이즈해야 하는 경우 ImageMagick, GIMP, 포토샵 등의 전문 도구를 사용하는 것이 더 효율적입니다.' : 'When resizing many images at once, dedicated tools like ImageMagick, GIMP, or Photoshop are more efficient.'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '6. 원본 이미지를 백업하세요' : '6. Back up the original image'}</p>
            <p>{isKo ? '리사이즈 전에 원본 이미지를 별도로 저장해두세요. 리사이즈된 이미지는 되돌릴 수 없으므로, 원본이 필요한 경우에 대비하는 것이 좋습니다.' : 'Save the original separately before resizing. Since a resized image cannot be undone, keep the original in case you need it.'}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{isKo ? '7. 프라이버시가 보장됩니다' : '7. Your privacy is protected'}</p>
            <p>{isKo ? '이미지 처리가 전부 브라우저 내에서 이루어지며, 업로드한 이미지는 외부 서버로 전송되지 않습니다.' : 'All image processing happens entirely within the browser, and your uploaded image is never sent to any external server.'}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
      variant="split"
     />
  );
};

export default ImageResizer;
