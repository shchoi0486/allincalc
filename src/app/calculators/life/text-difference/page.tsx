'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DiffSegment {
  text: string;
  type: 'equal' | 'added' | 'removed';
}

const TextDifference: React.FC = () => {
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
        <label className="block text-sm font-medium mb-1">원본 텍스트:</label>
        <textarea
          value={text1}
          onChange={(e) => setText1(e.target.value)}
          className="w-full min-h-[150px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="비교할 원본 텍스트를 입력하세요..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">변경된 텍스트:</label>
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          className="w-full min-h-[150px] p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500"
          placeholder="비교할 대상 텍스트를 입력하세요..."
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={calculateDiff} disabled={!text1 && !text2}>
          비교하기
        </Button>
        <Button variant="secondary" onClick={reset}>
          초기화
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
                <p className="text-sm text-muted-foreground">추가됨</p>
                <p className="text-2xl font-bold text-green-500">{diffStats.added}</p>
                <p className="text-xs text-muted-foreground">줄</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">삭제됨</p>
                <p className="text-2xl font-bold text-red-500">{diffStats.removed}</p>
                <p className="text-xs text-muted-foreground">줄</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3 text-center">
                <p className="text-sm text-muted-foreground">동일</p>
                <p className="text-2xl font-bold text-blue-500">{diffStats.equal}</p>
                <p className="text-xs text-muted-foreground">줄</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">차이점 비교 결과:</p>
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
                    {segment.text || '(빈 줄)'}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground text-center">
            <p>원본: {text1.length}자, 변경: {text2.length}자</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          텍스트를 입력하고 비교하기 버튼을 눌러주세요
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          두 텍스트의 차이점을 한 줄 단위로 비교하고 하이라이트하세요!
        </p>
        <p>
          텍스트 비교 도구는 두 텍스트 간의 차이점을 한 줄 단위로 정확하게 비교하고
          추가, 삭제, 변경 사항을 색상으로 직관적으로 보여주는 강력한 분석 도구입니다.
        </p>
        <p>
          코드 리뷰에서 소스코드 변경 이력을 빠르게 확인하거나, 계약서·제안서 등 문서 수정 사항을 검토하거나,
          원문과 번역문을 대조하여 오역을 발견하는 등 다양한 상황에서 원본과 변경본의 차이점을 신속하게 파악할 수 있습니다.
        </p>
        <p>
          추가된 줄, 삭제된 줄, 동일한 줄의 통계를 함께 제공하여 변경 규모를 한눈에 파악할 수 있으며,
          개발자, 번역가, 문서 관리자, 학생 등 텍스트 비교가 필요한 모든 사용자에게 유용합니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">텍스트 비교 알고리즘</h3>
          <p className="mb-2 text-muted-foreground">
            각 줄을 순서대로 비교하여 동일 여부를 판단합니다. 두 텍스트의 줄 수가 다를 경우
            더 긴 쪽을 기준으로 빠진 부분을 감지합니다.
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <code className="text-sm">for (let i = 0; i &lt; maxLines; i++) {'{'}</code><br/>
            <code className="text-sm">&nbsp;&nbsp;if (line1 === line2) → 동일 (변경 없음)</code><br/>
            <code className="text-sm">&nbsp;&nbsp;else → 변경 감지 (추가 또는 삭제)</code><br/>
            <code className="text-sm">{'}'}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            비교 결과는 추가(초록색), 삭제(빨간색 + 줄긋기), 동일(변경 없음)으로 구분되며,
            통계 카드에서 추가/삭제/동일 줄 수를 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">텍스트 비교 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>코드 리뷰:</strong> Git 커밋이나 Pull Request에서 소스코드 변경 이력을 빠르게 확인할 때 유용합니다.</li>
            <li><strong>문서 비교:</strong> 계약서, 제안서, 논문 등 여러 버전의 문서 수정 사항을 체계적으로 관리할 수 있습니다.</li>
            <li><strong>번역 검토:</strong> 원문과 번역문을 나란히 대조하여 의도치 않은 번역 누락이나 오역을 빠르게 발견할 수 있습니다.</li>
            <li><strong>이력 관리:</strong> 여러 버전의 텍스트 차이를 한눈에 파악하여 변경 이력을 체계적으로 관리하세요.</li>
            <li><strong>이메일/공문 검토:</strong> 수정 전후의 메일이나 공문을 비교하여 변경 사항을 빠르게 확인하세요.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="텍스트 비교"
      description="두 텍스트의 차이점을 비교합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TextDifference;
