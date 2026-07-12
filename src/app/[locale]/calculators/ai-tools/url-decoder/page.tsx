'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const UrlDecoder = () => {
  const { dict, locale } = useI18n();
  const t = dict.urlDecoder;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    try {
      const decoded = decodeURIComponent(input);
      setResult(decoded);
    } catch (e: any) {
      setError(`${t.invalidUrl} ${e.message}`);
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
          placeholder='e.g., https%3A%2F%2Fexample.com%2Fpath%3Fname%3DJohn'
          className="min-h-[120px] font-mono text-xs"
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
          <strong>URL Decoder</strong> converts percent-encoded (%XX) characters back to their original form. This is useful for reading encoded URLs, debugging web requests, and inspecting query parameters.
        </p>
        <p>
          The decoder handles all percent-encoded characters including spaces (%20), special characters (%21, %23, etc.), and non-ASCII characters (%E2%82%AC for Euro symbol).
        </p>
        <TermGlossary items={[
          { term: isKo ? 'URL 디코딩' : 'URL Decoding', desc: isKo ? '퍼센트 인코딩(%XX)된 문자열을 원래의 문자로 되돌리는 과정입니다. 웹 요청이나 쿼리 파라미터를 읽을 때 사용합니다.' : 'The process of converting a percent-encoded (%XX) string back to its original characters. Used when reading web requests or query parameters.' },
          { term: isKo ? '퍼센트 인코딩(%XX)' : 'Percent Encoding (%XX)', desc: isKo ? '문자를 %와 두 자리 16진수 ASCII 코드로 표현하는 방식입니다. 예를 들어 공백은 %20, &는 %26으로 나타냅니다.' : 'A scheme that represents characters as % followed by a two-digit hexadecimal ASCII code. For example, a space is %20 and & is %26.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Decoding Examples:</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
          <p className="font-mono text-xs">%20 → Space</p>
          <p className="font-mono text-xs">%21 → !</p>
          <p className="font-mono text-xs">%23 → #</p>
          <p className="font-mono text-xs">%26 → &</p>
          <p className="font-mono text-xs">%2B → +</p>
        </div>
        <p className="text-sm">
          The % symbol followed by two hexadecimal digits is converted back to the corresponding ASCII character.
        </p>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Most browsers show decoded URLs in the address bar but encode them in network requests.</li>
          <li>If decoding produces garbled text, the original encoding might have used a different charset.</li>
          <li>URL encoding is case-sensitive: %2f is different from %2F.</li>
          <li>The + character in form-encoded data represents a space, but in URLs it stays as +.</li>
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

export default UrlDecoder;
