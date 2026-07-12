'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const UrlEncoder = () => {
  const { dict, locale } = useI18n();
  const t = dict.urlEncoder;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');

  const encode = () => {
    if (mode === 'component') {
      setResult(encodeURIComponent(input));
    } else {
      setResult(encodeURI(input));
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
          className="min-h-[120px]"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={mode === 'component' ? 'default' : 'outline'}
          onClick={() => setMode('component')}
          className="flex-1"
        >
          {t.encodeComponentButton}
        </Button>
        <Button
          variant={mode === 'full' ? 'default' : 'outline'}
          onClick={() => setMode('full')}
          className="flex-1"
        >
          {t.encodeFullButton}
        </Button>
      </div>
      <Button onClick={encode} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
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
          <strong>URL Encoder</strong> converts special characters in URLs and text into percent-encoded format (%XX) that can be safely transmitted over the internet.
        </p>
        <p>
          Two encoding modes are available:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li><strong>encodeURIComponent:</strong> Encodes all special characters. Use for individual parameter values.</li>
          <li><strong>encodeURI:</strong> Preserves URI structure characters (/, :, ?, etc.). Use for complete URLs.</li>
        </ul>
        <TermGlossary items={[
          { term: isKo ? 'URL 인코딩 (퍼센트 인코딩)' : 'URL Encoding (Percent Encoding)', desc: isKo ? 'URL에 들어갈 수 없는 공백이나 특수 문자를 % 뒤에 두 자리 16진수(예: %20)로 바꿔 안전하게 전송할 수 있도록 만드는 과정입니다.' : 'The process of turning spaces and special characters that are invalid in URLs into % followed by a two-digit hex code (e.g., %20) so they can be transmitted safely.' },
          { term: 'encodeURIComponent / encodeURI', desc: isKo ? '자바스크립트의 내장 인코딩 함수입니다. encodeURIComponent는 모든 특수 문자를, encodeURI는 URL 구조 문자(/, :, ? 등)를 보존하며 인코딩합니다.' : 'Built-in JavaScript encoding functions. encodeURIComponent encodes all special characters, while encodeURI preserves URL structure characters (/, :, ?, etc.).' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Encoding Examples:</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg space-y-2">
          <p className="font-mono text-xs">Space → %20</p>
          <p className="font-mono text-xs">! → %21</p>
          <p className="font-mono text-xs"># → %23</p>
          <p className="font-mono text-xs">& → %26</p>
          <p className="font-mono text-xs">+ → %2B</p>
        </div>
        <p className="text-sm">
          Each special character is replaced by % followed by its two-digit hexadecimal ASCII code.
        </p>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Use <code className="bg-muted px-1 py-0.5 rounded text-xs">encodeURIComponent</code> for query parameter values to avoid breaking the URL structure.</li>
          <li>Use <code className="bg-muted px-1 py-0.5 rounded text-xs">encodeURI</code> when you want to encode a complete URL but keep its structure intact.</li>
          <li>Letters, numbers, and - _ . ! ~ * ' are not encoded by encodeURIComponent.</li>
          <li>Spaces are encoded as %20 (not +) when using encodeURIComponent.</li>
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

export default UrlEncoder;
