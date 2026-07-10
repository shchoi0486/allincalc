'use client';

import { useState, useRef } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';

type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

const ImageConverter = () => {
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
      setError('Please select a valid image file.');
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
        setError('Failed to create canvas context.');
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
            setError('Conversion failed. Try a different format or lower quality.');
          }
          setIsConverting(false);
        },
        outputFormat,
        outputFormat === 'image/jpeg' || outputFormat === 'image/webp' ? quality / 100 : undefined
      );
    };

    img.onerror = () => {
      setError('Failed to load the image. The file might be corrupted.');
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
        <label className="text-sm font-medium">Upload Image</label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="w-full">
          {imageFile ? imageFile.name : 'Choose Image File'}
        </Button>
        {imageFile && (
          <p className="text-xs text-muted-foreground text-center">
            Original: {formatSize(originalSize)} | {imageFile.type.split('/')[1].toUpperCase()}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Output Format</label>
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
          <label className="text-sm font-medium">Quality: {quality}%</label>
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
        {isConverting ? 'Converting...' : 'Convert Image'}
      </Button>
    </div>
  );

  const resultSection = convertedUrl ? (
    <div className="space-y-3">
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Converted: {formatSize(convertedSize)} | {outputFormat.split('/')[1].toUpperCase()}</p>
        <p>Saved: {formatSize(Math.abs(originalSize - convertedSize))} ({Math.round((1 - convertedSize / originalSize) * 100)}%)</p>
      </div>
      <Button variant="outline" size="sm" onClick={download} className="w-full">Download Converted Image</Button>
      <div className="flex items-center justify-center bg-muted rounded-lg p-2">
        <img src={convertedUrl} alt="Converted" className="max-h-[300px] object-contain rounded" />
      </div>
    </div>
  ) : preview ? (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground text-center">Original Preview</p>
      <div className="flex items-center justify-center bg-muted rounded-lg p-2">
        <img src={preview} alt="Original" className="max-h-[300px] object-contain rounded" />
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Upload an image and click Convert to change its format
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
      title="Image Format Converter"
      description="Convert images between PNG, JPEG, and WebP formats"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default ImageConverter;
