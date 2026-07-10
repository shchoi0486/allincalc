'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const Base64Encoder = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  const encode = () => {
    setError('');
    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setResult(encoded);
    } catch (e: any) {
      setError(`Encoding error: ${e.message}`);
      setResult('');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Plain text</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to encode..."
          className="min-h-[150px]"
        />
      </div>
      <Button onClick={encode} className="w-full">Encode to Base64</Button>
    </div>
  );

  const resultSection = error ? (
    <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
      {error}
    </div>
  ) : result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">Copy Base64</Button>
      <Textarea readOnly value={result} className="min-h-[100px] font-mono text-xs" />
      <p className="text-xs text-muted-foreground text-center">
        {result.length} characters ({input.length} → {result.length}, {Math.round((result.length / input.length) * 100 - 100)}% increase)
      </p>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      Enter text and click Encode to convert to Base64
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
      title="Base64 Encoder"
      description="Encode plain text to Base64 format"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default Base64Encoder;
