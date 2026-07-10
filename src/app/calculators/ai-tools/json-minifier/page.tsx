'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const JsonMinifier = () => {
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
      setError(`Invalid JSON: ${e.message}`);
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
        <label className="text-sm font-medium">Pretty or formatted JSON</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "name": "John",\n  "age": 30\n}'}
          className="min-h-[200px] font-mono text-xs"
        />
      </div>
      <Button onClick={minify} className="w-full">Minify JSON</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-sm">
        Original: {originalSize.toLocaleString()} bytes → Minified: {minifiedSize.toLocaleString()} bytes ({savings}% saved)
      </div>
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">Copy</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Paste JSON and click Minify to compress it
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
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold">Before (formatted):</p>
        <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono text-xs whitespace-pre">
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
      title="JSON Minifier"
      description="Remove whitespace and compress JSON for production use"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default JsonMinifier;
