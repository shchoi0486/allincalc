'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const PasswordGenerator: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.passwordGenerator;
  const isKo = locale === 'ko';
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let result = '';

    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (charset === '') {
      setPassword(t.results.selectCharset);
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    setCopied(false);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols, t.results.selectCharset]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = (): { label: string; color: string; percent: number } => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 24) score++;
    if (useUppercase) score++;
    if (useLowercase) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;

    const types = [useUppercase, useLowercase, useNumbers, useSymbols].filter(Boolean).length;
    if (types >= 3) score++;
    if (types === 4) score++;

    if (score <= 3) return { label: t.strengthLevels.weak, color: 'bg-red-500', percent: 25 };
    if (score <= 5) return { label: t.strengthLevels.medium, color: 'bg-orange-500', percent: 50 };
    if (score <= 7) return { label: t.strengthLevels.strong, color: 'bg-blue-500', percent: 75 };
    return { label: t.strengthLevels.veryStrong, color: 'bg-green-500', percent: 100 };
  };

  const strength = getStrength();

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-28">{t.inputs.length}: {length}</label>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-10 text-center">{length}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(e) => setUseUppercase(e.target.checked)}
            className="form-checkbox"
          />
          <span>{t.inputs.uppercase}</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(e) => setUseLowercase(e.target.checked)}
            className="form-checkbox"
          />
          <span>{t.inputs.lowercase}</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
            className="form-checkbox"
          />
          <span>{t.inputs.numbers}</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="form-checkbox"
          />
          <span>{t.inputs.symbols}</span>
        </label>
      </div>

      <div className="flex space-x-2">
        <Button onClick={generatePassword}>{t.inputs.generate}</Button>
        <Button variant="secondary" onClick={() => { setPassword(''); setCopied(false); }}>
          {t.inputs.reset}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {password ? (
        <>
          <div className="flex items-center space-x-2">
            <Input
              value={password}
              readOnly
              className="font-mono text-lg flex-1"
            />
            <Button onClick={copyToClipboard} variant={copied ? 'default' : 'outline'}>
              {copied ? t.results.copied : t.results.copy}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <span>{t.results.strength}:</span>
                <span className="font-bold">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${strength.color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>{t.results.charCount}: {password.length}{isKo ? '자' : ' chars'}</p>
            <p>{t.results.selectedTypes}: {[useUppercase && t.inputs.uppercase, useLowercase && t.inputs.lowercase, useNumbers && t.inputs.numbers, useSymbols && t.inputs.symbols].filter(Boolean).join(', ')}</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          {t.results.emptyMessage}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          ${t.descriptionContent.heading}
        </p>
        <p>
          ${t.descriptionContent.p1}
        </p>
        <p>
          ${t.descriptionContent.p2}
        </p>
        <p>
          ${t.descriptionContent.p3}
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.heading}</h3>
          <p className="mb-2 text-muted-foreground">
            ${t.formula.desc}
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.code}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            ${t.formula.cryptoDesc}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.strengthCalc}</h3>
          <p className="text-muted-foreground">
            ${t.formula.strengthDesc}
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">${t.tips.heading}</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            ${t.tips.items.map((item: { title: string; desc: string }) => `
            <li><strong>${item.title}:</strong> ${item.desc}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `
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

export default PasswordGenerator;
