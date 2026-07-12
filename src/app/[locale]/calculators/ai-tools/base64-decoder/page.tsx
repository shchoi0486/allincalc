'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const Base64Decoder = () => {
  const { dict, locale } = useI18n();
  const t = dict.base64Decoder;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    try {
      const decoded = decodeURIComponent(escape(atob(input)));
      setResult(decoded);
    } catch (e: any) {
      setError(`${t.invalidBase64} ${e.message}. Make sure the input is valid Base64 encoded text.`);
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
          className="min-h-[150px] font-mono text-xs"
        />
      </div>
      <Button onClick={decode} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[100px]" />
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
          <strong>Base64 Decoder</strong> converts Base64 encoded strings back to their original plain text. This is useful for decoding API responses, JWT tokens, email content, and other Base64-encoded data.
        </p>
        <p>
          The decoder handles Unicode/UTF-8 text properly, returning the exact original text that was encoded.
        </p>
        <TermGlossary items={[
          { term: 'Base64', desc: isKo ? '바이너리 데이터를 ASCII 문자 64개로 표현하는 인코딩 방식입니다. 디코딩하면 원래의 텍스트나 바이너리 데이터를 복원할 수 있습니다.' : 'An encoding scheme that represents binary data using 64 ASCII characters. Decoding restores the original text or binary data.' },
          { term: isKo ? '6비트 인코딩' : '6-bit Encoding', desc: isKo ? 'Base64는 각 문자가 원본 데이터의 6비트를 나타냅니다. 4개의 문자(4x6비트)가 원본 3바이트(24비트)를 표현하는 방식입니다.' : 'In Base64 each character represents 6 bits of the original data. Four characters (4×6 bits) represent the original 3 bytes (24 bits).' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Decoding Process:</p>
        <ul className="space-y-2 text-sm">
          <li><strong>Step 1:</strong> Validate the input contains only valid Base64 characters (A-Z, a-z, 0-9, +, /, =).</li>
          <li><strong>Step 2:</strong> Convert each Base64 character back to its 6-bit value.</li>
          <li><strong>Step 3:</strong> Reassemble the 6-bit groups into 8-bit bytes.</li>
          <li><strong>Step 4:</strong> Convert the byte array back to the original text encoding.</li>
        </ul>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-center font-mono text-sm">
            "SGVsbG8=" → "Hello"
          </p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Valid Base64 strings have a length that is a multiple of 4 (after padding with =).</li>
          <li>If you get garbled output, the original text might have been in a different encoding.</li>
          <li>Common sources of Base64 data: JWT headers, email attachments, HTTP Basic Auth headers.</li>
          <li>The output preserves the original text including any special characters and line breaks.</li>
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

export default Base64Decoder;
