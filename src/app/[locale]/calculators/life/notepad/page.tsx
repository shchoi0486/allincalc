'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const STORAGE_KEY = 'allincalc-notepad-content';

const Notepad: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.notepad;
  const [content, setContent] = useState('');
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setContent(saved);
      setIsSaved(true);
    }
  }, []);

  const saveToStorage = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, content);
    setIsSaved(true);
    setSavedAt(new Date().toLocaleTimeString('ko-KR'));
  }, [content]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content) {
        saveToStorage();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, saveToStorage]);

  const handleClear = () => {
    if (window.confirm(t.confirmClear)) {
      setContent('');
      localStorage.removeItem(STORAGE_KEY);
      setIsSaved(true);
      setSavedAt(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert(t.copiedMessage);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert(t.copiedMessage);
    }
  };

  const wordCount = content.trim() === '' ? 0 : content.trim().split(/\s+/).length;
  const charCount = content.length;
  const lineCount = content === '' ? 0 : content.split('\n').length;
  const byteSize = new Blob([content]).size;

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          setIsSaved(false);
        }}
        className="w-full min-h-[400px] p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
        placeholder={t.placeholder}
      />

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={saveToStorage} variant="default">
            {t.manualSave}
          </Button>
          <Button onClick={handleCopy} variant="outline" disabled={!content}>
            {t.copy}
          </Button>
          <Button onClick={handleClear} variant="destructive" disabled={!content}>
            {t.clearAll}
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {isSaved ? (
            savedAt ? (
              <span className="text-green-600">{t.savedAt.replace('{time}', savedAt)}</span>
            ) : (
              <span className="text-green-600">{t.saved}</span>
            )
          ) : (
            <span className="text-orange-500">{t.saving}</span>
          )}
        </div>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">{t.stats}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{t.charCount}</p>
              <p className="text-2xl font-bold text-blue-600">{charCount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{t.wordCount}</p>
              <p className="text-2xl font-bold text-green-600">{wordCount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{t.lineCount}</p>
              <p className="text-2xl font-bold text-purple-600">{lineCount.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">{t.byteCount}</p>
              <p className="text-2xl font-bold text-orange-600">{byteSize.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">{t.notesInfo}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• {t.infoStorage}</li>
            <li>• {t.infoPersistence}</li>
            <li>• {t.infoDeviceOnly}</li>
            <li>• {t.infoAutoSave}</li>
          </ul>
        </CardContent>
      </Card>
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

export default Notepad;
