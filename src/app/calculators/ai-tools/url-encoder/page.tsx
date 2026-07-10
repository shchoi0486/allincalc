'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const UrlEncoder = () => {
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
        <label className="text-sm font-medium">Text or URL to encode</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g., https://example.com/path?name=John&age=30 or "Hello World & Special chars!"'
          className="min-h-[120px]"
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant={mode === 'component' ? 'default' : 'outline'}
          onClick={() => setMode('component')}
          className="flex-1"
        >
          encodeURIComponent
        </Button>
        <Button
          variant={mode === 'full' ? 'default' : 'outline'}
          onClick={() => setMode('full')}
          className="flex-1"
        >
          encodeURI
        </Button>
      </div>
      <Button onClick={encode} className="w-full">Encode URL</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">Copy Encoded URL</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Enter text and click Encode to URL-encode it
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
      title="URL Encoder"
      description="Encode special characters for safe URL transmission"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default UrlEncoder;
