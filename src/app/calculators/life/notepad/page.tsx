'use client';

import React, { useState, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const STORAGE_KEY = 'allincalc-notepad-content';

const Notepad: React.FC = () => {
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
    if (window.confirm('정말로 모든 메모를 삭제하시겠습니까?')) {
      setContent('');
      localStorage.removeItem(STORAGE_KEY);
      setIsSaved(true);
      setSavedAt(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      alert('클립보드에 복사되었습니다!');
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert('클립보드에 복사되었습니다!');
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
        placeholder="여기에 메모를 작성하세요...&#10;&#10;자동으로 브라우저에 저장됩니다."
      />

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={saveToStorage} variant="default">
            수동 저장
          </Button>
          <Button onClick={handleCopy} variant="outline" disabled={!content}>
            복사
          </Button>
          <Button onClick={handleClear} variant="destructive" disabled={!content}>
            전체 삭제
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {isSaved ? (
            savedAt ? (
              <span className="text-green-600">✓ 저장됨 ({savedAt})</span>
            ) : (
              <span className="text-green-600">✓ 저장됨</span>
            )
          ) : (
            <span className="text-orange-500">저장 중...</span>
          )}
        </div>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-3">통계</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">글자 수</p>
              <p className="text-2xl font-bold text-blue-600">{charCount.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">단어 수</p>
              <p className="text-2xl font-bold text-green-600">{wordCount.toLocaleString()}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">줄 수</p>
              <p className="text-2xl font-bold text-purple-600">{lineCount.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">바이트</p>
              <p className="text-2xl font-bold text-orange-600">{byteSize.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2">메모 정보</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• 브라우저 로컬 스토리지에 자동 저장됩니다</li>
            <li>• 브라우저를 닿아도 내용이 유지됩니다</li>
            <li>• 같은 기기에서만 저장됩니다</li>
            <li>• 1초 동안 입력이 없으면 자동 저장됩니다</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          브라우저에서 바로 메모를 작성하고 자동으로 저장하세요!
        </p>
        <p>
          메모장은 간단한 텍스트 메모를 작성하고 브라우저에 자동 저장해주는 실용적인 도구입니다.
          별도의 설치나 로그인 없이 바로 메모를 작성할 수 있으며,
          브라우저의 로컬 스토리지 기술을 활용하여 브라우저를 닫아도 내용이 유지됩니다.
        </p>
        <p>
          글자 수, 단어 수, 줄 수, 바이트 용량 등 메모의 통계 정보를 실시간으로 확인할 수 있어
          글자 수 제한이 있는 곳에 텍스트를 작성할 때 유용합니다.
        </p>
        <p>
          빠른 아이디어 메모, 할 일 목록, 코드 스니펫 임시 저장, 텍스트 정리 등
          다양한 용도로 활용할 수 있는 가볍고 편리한 메모 도구입니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">자동 저장 기능</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">localStorage.setItem('key', content)</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Web Storage API의 localStorage를 사용하여 브라우저에 데이터를 영구 저장합니다.
            1초 동안 입력이 없으면 자동으로 저장되며, 브라우저를 닫아도 내용이 유지됩니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">통계 계산</h3>
          <p className="text-muted-foreground">
            글자 수는 content.length, 단어 수는 공백 기준 split으로 계산하며,
            바이트 용량은 Blob 객체를 사용하여 정확한 UTF-8 바이트 수를 측정합니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">메모장 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>빠른 메모:</strong> 회의 중이나 이동 중에 아이디어나 할 일을 빠르게 기록할 때 유용합니다.</li>
            <li><strong>텍스트 정리:</strong> 긴 글의 초안을 작성하거나 온라인 텍스트를 정리할 때 활용하세요.</li>
            <li><strong>코드 스니펫:</strong> 자주 사용하는 코드 조각이나 명령어를 임시 저장하여 필요할 때 즉시 복사할 수 있습니다.</li>
            <li><strong>복붙 허브:</strong> 여러 텍스트를 한 곳에서 관리하다가 필요한 곳으로 복사하여 붙여넣기 할 때 편리합니다.</li>
            <li><strong>글자 수 제한 확인:</strong> SNS, 지원서 등 글자 수 제한이 있는 곳에 텍스트를 작성할 때 미리 확인하세요.</li>
            <li><strong>주의사항:</strong> 중요한 비밀번호나 개인정보는 브라우저에 저장하지 마세요.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="메모장"
      description="간단한 텍스트 메모를 작성하고 자동 저장합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default Notepad;
