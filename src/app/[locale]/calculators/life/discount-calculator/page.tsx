'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

const DiscountCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.discountCalculator;
  const isKo = locale === 'ko';
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [mode, setMode] = useState<'forward' | 'reverse'>('forward');
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    savedPercent?: number;
  } | null>(null);

  const calculateDiscount = () => {
    if (mode === 'forward') {
      const original = parseFloat(originalPrice);
      const discount = parseFloat(discountRate);

      if (isNaN(original) || isNaN(discount) || original <= 0 || discount < 0 || discount > 100) {
        alert(t.alerts.invalidForward);
        return;
      }

      const discountAmount = original * (discount / 100);
      const finalPrice = original - discountAmount;

      setResult({
        discountAmount: parseFloat(discountAmount.toFixed(0)),
        finalPrice: parseFloat(finalPrice.toFixed(0)),
      });
    } else {
      const original = parseFloat(originalPrice);
      const sale = parseFloat(salePrice);

      if (isNaN(original) || isNaN(sale) || original <= 0 || sale < 0) {
        alert(t.alerts.invalidReverse);
        return;
      }

      if (sale > original) {
        alert(t.alerts.saleTooHigh);
        return;
      }

      const discountAmount = original - sale;
      const discountPercent = ((discountAmount / original) * 100);

      setResult({
        discountAmount: parseFloat(discountAmount.toFixed(0)),
        finalPrice: sale,
        savedPercent: parseFloat(discountPercent.toFixed(1)),
      });
    }
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.calculationMode}:</label>
        <div className="flex space-x-2">
          <Button
            variant={mode === 'forward' ? 'default' : 'outline'}
            onClick={() => { setMode('forward'); setResult(null); }}
          >
            {t.inputs.calculateDiscount}
          </Button>
          <Button
            variant={mode === 'reverse' ? 'default' : 'outline'}
            onClick={() => { setMode('reverse'); setResult(null); }}
          >
            {t.inputs.reverseDiscountRate}
          </Button>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <label className="w-32">{t.inputs.originalPrice}:</label>
        <Input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} placeholder={t.placeholders.originalPrice} />
      </div>
      {mode === 'forward' ? (
        <div className="flex items-center space-x-4">
          <label className="w-32">{t.inputs.discountRate}:</label>
          <Input type="number" value={discountRate} onChange={(e) => setDiscountRate(e.target.value)} placeholder={t.placeholders.discountRate} />
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <label className="w-32">{t.inputs.salePrice}:</label>
          <Input type="number" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} placeholder={t.placeholders.salePrice} />
        </div>
      )}
      <div className="flex space-x-2">
        <Button onClick={calculateDiscount}>{t.inputs.calculate}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{t.inputs.reset}</Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>{t.results.discountAmount}:</span>
              <strong className="text-lg text-primary">{result.discountAmount.toLocaleString()}{isKo ? ' 원' : ' KRW'}</strong>
          </div>
          <div className="flex justify-between items-center">
            <span>{t.results.salePrice}:</span>
              <strong className="text-2xl">{result.finalPrice.toLocaleString()}{isKo ? ' 원' : ' KRW'}</strong>
          </div>
          {result.savedPercent !== undefined && (
            <div className="flex justify-between items-center">
              <span>{t.results.discountRate}:</span>
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-primary/10 text-primary">
                {result.savedPercent}% {t.results.discountSuffix}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          {t.descriptionContent.heading}
        </p>
        <p>
          {t.descriptionContent.p1}
        </p>
        <p>
          {t.descriptionContent.p2}
        </p>
        <p>
          {t.descriptionContent.p3}
        </p>
        <TermGlossary items={t.glossary} />
      </div>
    ),
    calculationFormula: (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">{t.formula.heading}</h3>
        <div className="space-y-4 text-sm">
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">{t.formula.step1Title}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              {t.formula.step1Desc}
            </p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              {t.formula.step1Formula1}
            </code>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              {t.formula.step1Formula2}
            </code>
            <p className="text-xs mt-2 text-muted-foreground">
              {t.formula.step1Example}
            </p>
          </div>
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">{t.formula.step2Title}</p>
            <p className="text-xs text-muted-foreground mt-1 mb-2">
              {t.formula.step2Desc}
            </p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              {t.formula.step2Formula}
            </code>
            <p className="text-xs mt-2 text-muted-foreground">
              {t.formula.step2Example}
            </p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">{t.tips.heading}</h3>
        <div className="space-y-4">
          {t.tips.items.map((item, i) => (
            <div key={i} className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">{item.title}</p>
              <p className="text-xs mt-1 text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
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

export default DiscountCalculator;
