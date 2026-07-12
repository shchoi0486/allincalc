'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

interface StringOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  count: number;
}

const RandomStringGenerator: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.randomStringGenerator;

  const [options, setOptions] = useState<StringOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    count: 5,
  });
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomString = useCallback((length: number, opts: StringOptions): string => {
    let charset = '';
    if (opts.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.numbers) charset += '0123456789';
    if (opts.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') charset = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    return result;
  }, []);

  const handleGenerate = () => {
    const strings: string[] = [];
    for (let i = 0; i < options.count; i++) {
      strings.push(generateRandomString(options.length, options));
    }
    setGeneratedStrings(strings);
    setCopiedIndex(null);
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedStrings.join('\n'));
  };

  const handleClear = () => {
    setGeneratedStrings([]);
    setCopiedIndex(null);
  };

  const toggleOption = (key: keyof Omit<StringOptions, 'length' | 'count'>) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.stringLength}</label>
        <Input
          type="number"
          min={1}
          max={256}
          value={options.length}
          onChange={(e) => setOptions(prev => ({ ...prev, length: Math.max(1, Math.min(256, parseInt(e.target.value) || 1)) }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.stringCount}</label>
        <Input
          type="number"
          min={1}
          max={50}
          value={options.count}
          onChange={(e) => setOptions(prev => ({ ...prev, count: Math.max(1, Math.min(50, parseInt(e.target.value) || 1)) }))}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">{t.inputs.charType}</label>
        {[
          { key: 'uppercase' as const, label: t.inputs.uppercase },
          { key: 'lowercase' as const, label: t.inputs.lowercase },
          { key: 'numbers' as const, label: t.inputs.numbers },
          { key: 'symbols' as const, label: t.inputs.symbols },
        ].map(item => (
          <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options[item.key]}
              onChange={() => toggleOption(item.key)}
              className="form-checkbox"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleGenerate}>{t.inputs.generate}</Button>
        <Button variant="secondary" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-1" /> {t.inputs.reset}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {generatedStrings.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{t.results.empty}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{t.results.generated.replace('{count}', String(generatedStrings.length))}</span>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="w-4 h-4 mr-1" /> {t.results.copyAll}
            </Button>
          </div>
          {generatedStrings.map((str, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <code className="flex-1 text-sm font-mono break-all select-all">{str}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(str, index)}
                className="shrink-0"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </>
      )}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.info.title}</strong> {t.info.p1}
        </p>
        <p>{t.info.p2}</p>
        <p>{t.info.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.info.tip}
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.charset}</h4>
          <p>{t.formula.charsetDesc}</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">uppercase + lowercase + numbers + symbols</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.combinations}</h4>
          <p>{t.formula.comboDesc}</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.comboFormula}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formula.example}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.mapping}</h4>
          <p>{t.formula.mappingDesc}</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">{t.formula.mappingFormula}</p>
          </div>
          <p>{t.formula.mappingNote}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.passwordLength}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.tip1}</li>
            <li>{t.tips.tip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.apiKey}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.apiKeyTip1}</li>
            <li>{t.tips.apiKeyTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.noReuse}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.noReuseTip1}</li>
            <li>{t.tips.noReuseTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.safeStorage}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.safeTip1}</li>
            <li>{t.tips.safeTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.testData}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.testTip1}</li>
            <li>{t.tips.testTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.complexity}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.complexTip1}</li>
            <li>{t.tips.complexTip2}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RandomStringGenerator;
