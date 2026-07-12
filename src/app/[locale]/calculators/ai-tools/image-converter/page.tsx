'use client';

import { useState, useRef } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

const ImageConverter = () => {
  const { dict, locale } = useI18n();
  const t = dict.imageConverter;
  const isKo = locale === 'ko';
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/png');
  const [quality, setQuality] = useState<number>(92);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [convertedSize, setConvertedSize] = useState<number>(0);
  const [convertedUrl, setConvertedUrl] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t.errorSelectFile);
      return;
    }

    setError('');
    setImageFile(file);
    setOriginalSize(file.size);
    setConvertedUrl('');
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const convert = () => {
    if (!imageFile) return;

    setIsConverting(true);
    setError('');

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError(t.errorCanvas);
        setIsConverting(false);
        return;
      }

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setConvertedUrl(url);
            setConvertedSize(blob.size);
          } else {
            setError(t.errorConversion);
          }
          setIsConverting(false);
        },
        outputFormat,
        outputFormat === 'image/jpeg' || outputFormat === 'image/webp' ? quality / 100 : undefined
      );
    };

    img.onerror = () => {
      setError(t.errorLoad);
      setIsConverting(false);
    };

    img.src = preview;
  };

  const download = () => {
    if (!convertedUrl) return;
    const ext = outputFormat.split('/')[1];
    const a = document.createElement('a');
    a.href = convertedUrl;
    a.download = `converted-image.${ext}`;
    a.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.uploadLabel}</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
          {imageFile ? imageFile.name : t.chooseButton}
        </Button>
        {imageFile && (
          <p className="text-xs text-muted-foreground text-center">
            {t.convertedInfo.replace('{size}', formatSize(originalSize)).replace('{format}', imageFile.type.split('/')[1].toUpperCase())}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t.formatLabel}</label>
        <div className="flex gap-2">
          {(['image/png', 'image/jpeg', 'image/webp'] as OutputFormat[]).map((fmt) => (
            <Button
              key={fmt}
              variant={outputFormat === fmt ? 'default' : 'outline'}
              onClick={() => setOutputFormat(fmt)}
              className="flex-1"
            >
              {fmt.split('/')[1].toUpperCase()}
            </Button>
          ))}
        </div>
      </div>

      {(outputFormat === 'image/jpeg' || outputFormat === 'image/webp') && (
        <div className="space-y-2">
          <label className="text-sm font-medium">{t.qualityLabel.replace('{quality}', String(quality))}</label>
          <input
            type="range"
            min={10}
            max={100}
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <Button onClick={convert} disabled={!imageFile || isConverting} className="w-full">
        {isConverting ? t.converting : t.convertButton}
      </Button>
    </div>
  );

  const resultSection = convertedUrl ? (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>{t.convertedInfo.replace('{size}', formatSize(convertedSize)).replace('{format}', outputFormat.split('/')[1].toUpperCase())}</p>
        <p>{t.savedInfo.replace('{size}', formatSize(Math.abs(originalSize - convertedSize))).replace('{percent}', String(Math.round((1 - convertedSize / originalSize) * 100)))}</p>
      </div>
      <Button variant="outline" size="sm" onClick={download} className="w-full">{t.downloadButton}</Button>
      <div className="flex items-center justify-center bg-muted rounded-lg p-2">
        <img src={convertedUrl} alt="Converted" className="max-h-[300px] object-contain rounded" />
      </div>
    </div>
  ) : preview ? (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center">{t.originalPreview}</p>
      <div className="flex items-center justify-center bg-muted rounded-lg p-2">
        <img src={preview} alt="Original" className="max-h-[300px] object-contain rounded" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      {t.emptyPrompt}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>Image Format Converter</strong> converts images between PNG, JPEG, and WebP formats directly in your browser. No server upload required - all processing happens locally.
        </p>
        <p>
          Choose the right format for your needs: PNG for transparency and lossless quality, JPEG for small file sizes with photos, and WebP for the best of both worlds.
        </p>
        <TermGlossary items={[
          { term: 'PNG', desc: isKo ? '무손실 압축을 사용하는 이미지 형식으로, 투명 배경을 지원합니다. 로고나 그래픽, 스크린샷에 적합합니다.' : 'A lossless image format that supports transparent backgrounds. Ideal for logos, graphics, and screenshots.' },
          { term: 'JPEG', desc: isKo ? '손실 압축을 사용하는 이미지 형식으로, 사진처럼 복잡한 이미지를 작은 파일 크기로 저장할 때 적합합니다. 투명도는 지원하지 않습니다.' : 'A lossy image format suited for storing complex images like photos at small file sizes. Does not support transparency.' },
          { term: 'WebP', desc: isKo ? '구글이 만든 현대적 이미지 형식으로, 손실/무손실 모드를 모두 지원하며 같은 화질에서 JPEG보다 25~35% 더 작습니다.' : 'A modern image format by Google supporting both lossy and lossless modes, 25-35% smaller than JPEG at the same quality.' },
          { term: isKo ? '손실/무손실 압축' : 'Lossy/Lossless Compression', desc: isKo ? '손실 압축은 품질을 약간 희생해 용량을 줄이고, 무손실 압축은 원본 품질을 그대로 유지하며 압축합니다.' : 'Lossy compression reduces size by sacrificing some quality, while lossless compression keeps the original quality intact.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Format Comparison:</p>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="font-bold">PNG</p>
            <p>Lossless compression, supports transparency. Best for graphics, logos, and screenshots.</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="font-bold">JPEG</p>
            <p>Lossy compression, adjustable quality. Best for photographs and complex images.</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="font-bold">WebP</p>
            <p>Modern format with both lossy and lossless modes. 25-35% smaller than JPEG at same quality.</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>PNG to JPEG conversion will remove transparency (filled with white background).</li>
          <li>Lower quality settings significantly reduce file size for JPEG and WebP.</li>
          <li>WebP is supported by all modern browsers but not by older versions of Safari.</li>
          <li>All conversions happen in your browser - no data is uploaded to any server.</li>
        </ul>
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

export default ImageConverter;
