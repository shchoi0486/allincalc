'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

interface DiffSegment {
  text: string;
  type: 'equal' | 'added' | 'removed';
}

const TextDifference: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.textDifference;
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [showDiff, setShowDiff] = useState(false);

  const calculateDiff = () => {
    setShowDiff(true);
  };

  const reset = () => {
    setText1('');
    setText2('');
    setShowDiff(false);
  };

  const diffResult = useMemo((): DiffSegment[] => {
    if (!showDiff) return [];

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);

    const result: DiffSegment[] = [];

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] ?? '';
      const line2 = lines2[i] ?? '';

      if (line1 === line2) {
        result.push({ text: line1, type: 'equal' });
      } else {
        if (line1) result.push({ text: line1, type: 'removed' });
        if (line2) result.push({ text: line2, type: 'added' });
      }
    }

    return result;
  }, [text1, text2, showDiff]);

  const diffStats = useMemo(() => {
    if (!showDiff) return { added: 0, removed: 0, equal: 0 };

    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);

    let added = 0;
    let removed = 0;
    let equal = 0;

    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] ?? '';
      const line2 = lines2[i] ?? '';

      if (line1 === line2) {
        equal++;
      } else {
        if (line1) removed++;
        if (line2) added++;
      }
    }

    return { added, removed, equal };
  }, [text1, text2, showDiff]);

  const charDiff = useMemo(() => {
    if (!showDiff) return { added: 0, removed: 0 };
    return {
      added: Math.abs(text2.length - text1.length),
      removed: Math.abs(text1.length - text2.length),
    };
  }, [text1, text2, showDiff]);

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">{t.originalLabel}</label>
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="w-full min-h-[150px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.originalPlaceholder}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">{t.modifiedLabel}</label>
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="w-full min-h-[150px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder={t.modifiedPlaceholder}
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={calculateDiff} disabled={!text1 && !text2}>
          {t.compareButton}
        </Button>
        <Button variant="secondary" onClick={reset}>
          {t.resetButton}
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {showDiff ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">{t.added}</p>
                <p className="text-2xl font-bold text-green-500">{diffStats.added}</p>
                <p className="text-xs text-muted-foreground">{t.lines}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">{t.removed}</p>
                <p className="text-2xl font-bold text-red-500">{diffStats.removed}</p>
                <p className="text-xs text-muted-foreground">{t.lines}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">{t.equal}</p>
                <p className="text-2xl font-bold text-blue-500">{diffStats.equal}</p>
                <p className="text-xs text-muted-foreground">{t.lines}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">{t.diffResultTitle}</p>
              <div className="font-mono text-sm whitespace-pre-wrap border rounded-lg p-4 bg-gray-50 max-h-[400px] overflow-y-auto">
                {diffResult.map((segment, index) => (
                  <div
                    key={index}
                    className={`px-2 py-0.5 ${
                      segment.type === 'added'
                        ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                        : segment.type === 'removed'
                        ? 'bg-red-100 text-red-800 border-l-4 border-red-500 line-through'
                        : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-2 text-xs text-gray-400 select-none">
                      {segment.type === 'added' ? '+' : segment.type === 'removed' ? '-' : ' '}
                    </span>
                    {segment.text || t.emptyLine}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground text-center">
            <p>{t.originalCharCount.replace('{count}', String(text1.length))}, {t.modifiedCharCount.replace('{count}', String(text2.length))}</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          {t.emptyPrompt}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: t.descriptionContent,
    calculationFormula: t.formulaContent,
    usefulTips: t.tipsContent,
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TextDifference;
