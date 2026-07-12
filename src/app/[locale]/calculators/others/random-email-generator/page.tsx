'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Trash2 } from 'lucide-react';
import { useI18n } from '@/i18n/I18nProvider';

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'naver.com', 'daum.net'] as const;
type DomainOption = (typeof DOMAINS)[number] | 'custom' | 'random';

const ADJECTIVES = [
  'happy', 'sunny', 'lucky', 'clever', 'brave', 'swift', 'calm', 'eager', 'fair', 'kind',
  'bold', 'cool', 'dark', 'deep', 'fast', 'free', 'gold', 'gray', 'huge', 'keen',
  'long', 'mild', 'neat', 'rich', 'rose', 'safe', 'tall', 'thin', 'true', 'warm',
  'wild', 'wise', 'blue', 'cyan', 'lime', 'pink', 'red', 'teal', 'wine', 'coral',
];

const NOUNS = [
  'tiger', 'eagle', 'river', 'stone', 'cloud', 'flame', 'storm', 'pearl', 'tiger', 'wolf',
  'bear', 'hawk', 'lion', 'fox', 'deer', 'swan', 'moon', 'star', 'wind', 'rain',
  'snow', 'fire', 'wave', 'rock', 'tree', 'leaf', 'rose', 'lily', 'iris', 'vale',
  'lake', 'hill', 'cape', 'gate', 'ford', 'port', 'dale', 'field', 'grove', 'marsh',
];

const RandomEmailGenerator: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.randomEmailGenerator;

  const [domain, setDomain] = useState<DomainOption>('random');
  const [customDomain, setCustomDomain] = useState('');
  const [count, setCount] = useState(5);
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomEmail = useCallback((useCustom: boolean, customDom: string): string => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 9999);
    const username = `${adj}${noun}${num}`;

    let selectedDomain: string;
    if (useCustom && customDom.trim()) {
      selectedDomain = customDom.trim().replace('@', '');
    } else if (domain === 'random') {
      selectedDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    } else {
      selectedDomain = domain;
    }

    return `${username}@${selectedDomain}`;
  }, [domain]);

  const handleGenerate = () => {
    const emails: string[] = [];
    const useCustom = domain === 'custom';
    for (let i = 0; i < count; i++) {
      emails.push(generateRandomEmail(useCustom, customDomain));
    }
    setGeneratedEmails(emails);
    setCopiedIndex(null);
  };

  const handleCopy = async (email: string, index: number) => {
    await navigator.clipboard.writeText(email);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedEmails.join('\n'));
  };

  const handleClear = () => {
    setGeneratedEmails([]);
    setCopiedIndex(null);
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.domainSelect}</label>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value as DomainOption)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="random">{t.inputs.random}</option>
          {DOMAINS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
          <option value="custom">{t.inputs.customDomain}</option>
        </select>
      </div>

      {domain === 'custom' && (
        <div>
          <label className="block text-sm font-medium mb-1">{t.inputs.customDomainLabel}</label>
          <Input
            type="text"
            placeholder="example.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.count}</label>
        <Input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
        />
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
      {generatedEmails.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">{t.results.empty}</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{t.results.generated.replace('{count}', String(generatedEmails.length))}</span>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="w-4 h-4 mr-1" /> {t.results.copyAll}
            </Button>
          </div>
          {generatedEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <code className="flex-1 text-sm font-mono break-all select-all">{email}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(email, index)}
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
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.structure}</h4>
          <p>{t.formula.structureDesc}</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">{t.formula.structureFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.combinations}</h4>
          <p>{t.formula.comboDesc}</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.comboFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.domainSelect}</h4>
          <p>{t.formula.domainDesc}</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">{t.formula.domainFormula}</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.testAccounts}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.testTip1}</li>
            <li>{t.tips.testTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.privacy}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.privacyTip1}</li>
            <li>{t.tips.privacyTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.devTool}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.devTip1}</li>
            <li>{t.tips.devTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.domainFormat}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.domainTip1}</li>
            <li>{t.tips.domainTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.verification}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.verTip1}</li>
            <li>{t.tips.verTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.bulkGen}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.bulkTip1}</li>
            <li>{t.tips.bulkTip2}</li>
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

export default RandomEmailGenerator;
