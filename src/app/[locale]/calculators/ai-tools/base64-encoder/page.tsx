'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const Base64Encoder = () => {
  const { dict, locale } = useI18n();
  const t = dict.base64Encoder;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setResult(encoded);
    } catch (e: any) {
      setError(`${t.encodingError} ${e.message}`);
      setResult('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.inputLabel}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="min-h-[150px]"
        />
      </div>
      <Button onClick={encode} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
      <p className="text-xs text-muted-foreground text-center">
        {t.stats.replace('{chars}', String(result.length)).replace('{inputLen}', String(input.length)).replace('{outputLen}', String(result.length)).replace('{percent}', String(Math.round((result.length / input.length) * 100 - 100)))}
      </p>
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
          <strong>Base64 Encoder</strong> converts plain text into Base64 encoded format. Base64 is a binary-to-text encoding scheme that represents binary data using ASCII characters.
        </p>
        <p>
          Base64 encoding is commonly used for transmitting data over media that handle text (like email, URLs, JSON) and for embedding images or other binary data in HTML/CSS.
        </p>
        <TermGlossary items={[
          { term: 'Base64', desc: isKo ? '바이너리 데이터를 ASCII 문자(A-Z, a-z, 0-9, +, /) 64개로 표현하는 인코딩 방식입니다. 이메일 첨부나 데이터 URI 등 텍스트 환경에서 데이터를 다룰 때 사용합니다.' : 'An encoding scheme that represents binary data using 64 ASCII characters (A-Z, a-z, 0-9, +, /). Used for handling data in text environments such as email attachments and data URIs.' },
          { term: isKo ? '패딩(Padding)' : 'Padding', desc: isKo ? 'Base64 출력 길이를 4의 배수로 맞추기 위해 붙이는 = 문자입니다. 원본 데이터가 3바이트 단위로 나누어 떨어지지 않을 때 사용합니다.' : 'The = character appended to make the Base64 output length a multiple of 4. Used when the original data is not evenly divisible into 3-byte units.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">How Base64 Works:</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Character Set:</strong> Uses 64 characters: A-Z, a-z, 0-9, +, /</li>
          <li><strong>Padding:</strong> = character(s) added to make the output length a multiple of 4.</li>
          <li><strong>Size Increase:</strong> Encoded output is approximately 33% larger than the input.</li>
        </ul>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-center font-mono text-sm">
            "Hello" → "SGVsbG8=" (4 bytes → 8 characters)
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Base64 is <strong>not encryption</strong> - it's just encoding. Anyone can decode it.</li>
          <li>Common use cases: email attachments (MIME), embedding images in CSS/HTML, JWT tokens.</li>
          <li>For secure data transmission, always use HTTPS and proper encryption on top of Base64.</li>
          <li>The encoder handles Unicode/UTF-8 text properly.</li>
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

export default Base64Encoder;
