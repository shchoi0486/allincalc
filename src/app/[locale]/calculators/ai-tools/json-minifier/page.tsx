'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const JsonMinifier = () => {
  const { dict, locale } = useI18n();
  const t = dict.jsonMinifier;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [originalSize, setOriginalSize] = useState(0);
  const [minifiedSize, setMinifiedSize] = useState(0);

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setResult(minified);
      setOriginalSize(new Blob([input]).size);
      setMinifiedSize(new Blob([minified]).size);
    } catch (e: any) {
      setError(`${t.invalidJson} ${e.message}`);
      setResult('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const savings = originalSize > 0 ? Math.round((1 - minifiedSize / originalSize) * 100) : 0;

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.inputLabel}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "John",\n  "age": 30\n}'}
          className="min-h-[200px] font-mono text-xs"
        />
      </div>
      <Button onClick={minify} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
        {t.sizeInfo.replace('{original}', originalSize.toLocaleString()).replace('{minified}', minifiedSize.toLocaleString()).replace('{percent}', String(savings))}
      </div>
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
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
          <strong>JSON Minifier</strong> removes all unnecessary whitespace, line breaks, and indentation from JSON data, reducing file size for production deployment and network transfer.
        </p>
        <p>
          Minified JSON is functionally identical to pretty-printed JSON but takes significantly less space, which is critical for API performance and storage efficiency.
        </p>
        <TermGlossary items={[
          { term: 'JSON', desc: isKo ? 'JavaScript Object Notation의 약자로, 키와 값의 쌍으로 데이터를 표현하는 가벼운 텍스트 기반 데이터 형식입니다. API 통신과 설정 파일에 널리 쓰입니다.' : 'Short for JavaScript Object Notation, a lightweight text-based data format that represents data as key-value pairs. Widely used for API communication and configuration files.' },
          { term: isKo ? '미니파이(Minify)' : 'Minify', desc: isKo ? '불필요한 공백, 줄바꿈, 들여쓰기를 제거해 파일 크기를 줄이는 과정입니다. 기능은 동일하지만 네트워크 전송량과 저장 효율을 높입니다.' : 'The process of removing unnecessary whitespace, line breaks, and indentation to reduce file size. Functionality stays identical while improving transmission and storage efficiency.' },
          { term: isKo ? 'Gzip 압축' : 'Gzip Compression', desc: isKo ? '텍스트 기반 데이터를 추가로 압축하는 방식입니다. 미니파이된 JSON 위에 Gzip을 적용하면 전송 크기를 더욱 줄일 수 있습니다.' : 'A method that further compresses text-based data. Applying Gzip on top of minified JSON reduces the transfer size even more.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Before (formatted):</p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs whitespace-pre overflow-x-auto">
{`{
  "name": "John",
  "age": 30,
  "active": true
}`}
        </div>
        <p className="font-semibold">After (minified):</p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs">
          {'{"name":"John","age":30,"active":true}'}
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Minification typically reduces JSON size by 30-60% depending on formatting.</li>
          <li>Always minify JSON for production API responses to reduce bandwidth usage.</li>
          <li>Keep pretty-printed JSON in development for easier debugging.</li>
          <li>Gzip compression on top of minification can reduce size even further.</li>
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

export default JsonMinifier;
