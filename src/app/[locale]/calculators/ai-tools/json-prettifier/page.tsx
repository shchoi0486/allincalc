'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useI18n } from '@/i18n/I18nProvider';

const JsonPrettifier = () => {
  const { dict, locale } = useI18n();
  const t = dict.jsonPrettifier;
  const isKo = locale === 'ko';
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState<number>(2);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const prettify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setResult(JSON.stringify(parsed, null, indent));
    } catch (e: any) {
      setError(`${t.invalidJson} ${e.message}`);
      setResult('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.inputLabelMinified}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{"name":"John","age":30,"scores":[1,2,3]}'
          className="min-h-[150px] font-mono text-xs"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.inputLabelIndent}</label>
        <Input
          type="number"
          min={1}
          max={8}
          value={indent}
          onChange={(e) => setIndent(Math.max(1, Math.min(8, parseInt(e.target.value) || 2)))}
        />
      </div>
      <Button onClick={prettify} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[200px] font-mono text-xs" />
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
          <strong>JSON Prettifier</strong> formats minified or compact JSON into a human-readable format with proper indentation. This is essential for debugging API responses, reading configuration files, and reviewing JSON data.
        </p>
        <p>
          The tool validates your JSON and provides clear error messages if the input is malformed, helping you quickly identify syntax issues.
        </p>
        <TermGlossary items={[
          { term: 'JSON', desc: isKo ? 'JavaScript Object Notation의 약자로, 키와 값의 쌍으로 데이터를 표현하는 가벼운 텍스트 기반 데이터 형식입니다. API 통신과 설정 파일에 널리 쓰입니다.' : 'Short for JavaScript Object Notation, a lightweight text-based data format that represents data as key-value pairs. Widely used for API communication and configuration files.' },
          { term: isKo ? '들여쓰기(Indentation)' : 'Indentation', desc: isKo ? '중첩된 데이터 구조를 사람이 읽기 쉽게 계층별로 공백을 추가해 정렬하는 방식입니다. 보통 2칸 또는 4칸 공백을 사용합니다.' : 'Adding spaces per level so nested data structures are easy for humans to read. Usually 2 or 4 spaces are used per level.' },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Before (minified):</p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs">
          {'{"name":"John","age":30,"active":true}'}
        </div>
        <p className="font-semibold">After (prettified):</p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs whitespace-pre">
{`{
  "name": "John",
  "age": 30,
  "active": true
}`}
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold">Tips:</p>
        <ul className="space-y-2 text-sm">
          <li>Common causes of invalid JSON: trailing commas, missing quotes around keys, single quotes instead of double quotes.</li>
          <li>Use 2 spaces for standard formatting, or 4 spaces for more readable output.</li>
          <li>Prettified JSON is larger in file size but much easier to read and debug.</li>
          <li>Most code editors have built-in JSON formatting, but this tool is useful for quick one-off formatting.</li>
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

export default JsonPrettifier;
