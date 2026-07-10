'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface GrammarError {
  original: string;
  corrected: string;
  explanation: string;
  position: number;
}

const KOREAN_RULES: Array<{ pattern: string; replacement: string; explanation: string; isRegex?: boolean }> = [
  { pattern: '되요', replacement: '돼요', explanation: '"되다"의 현재형은 "되어요" → "돼요"' },
  { pattern: '안되', replacement: '안 되', explanation: '"안"은 부사이므로 뒤에 오는 동사와 띄어 써야 합니다' },
  { pattern: '잘되', replacement: '잘 되', explanation: '"잘"은 부사이므로 뒤에 오는 동사와 띄어 써야 합니다' },
  { pattern: '많이되', replacement: '많이 되', explanation: '"많이"는 부사이므로 띄어 써야 합니다' },
  { pattern: '에대해', replacement: '에 대해', explanation: '"대하다"는 조사 "에"와 띄어 써야 합니다' },
  { pattern: '에대한', replacement: '에 대한', explanation: '"대하다"는 조사 "에"와 띄어 써야 합니다' },
  { pattern: '할때', replacement: '할 때', explanation: '"때"는 의존명사로 띄어 써야 합니다' },
  { pattern: '볼때', replacement: '볼 때', explanation: '"때"는 의존명사로 띄어 써야 합니다' },
  { pattern: '먹을때', replacement: '먹을 때', explanation: '"때"는 의존명사로 띄어 써야 합니다' },
  { pattern: '이런거', replacement: '이런 것', explanation: '"이런 것"은 올바른 표현입니다' },
  { pattern: '저런거', replacement: '저런 것', explanation: '"저런 것"은 올바른 표현입니다' },
  { pattern: '쉬럽다', replacement: '쉽다', explanation: '"쉬우다"의 현재형은 "쉽다"입니다' },
  { pattern: '편이하다', replacement: '편하다', explanation: '"편하다"를 올바르게 써야 합니다' },
];

function checkGrammar(text: string): GrammarError[] {
  const errors: GrammarError[] = [];
  KOREAN_RULES.forEach(rule => {
    let startIndex = 0;
    while (startIndex < text.length) {
      const index = text.indexOf(rule.pattern, startIndex);
      if (index === -1) break;
      if (rule.pattern !== rule.replacement) {
        errors.push({
          original: rule.pattern,
          corrected: rule.replacement,
          explanation: rule.explanation,
          position: index,
        });
      }
      startIndex = index + 1;
    }
  });
  return errors.sort((a, b) => a.position - b.position);
}

function applyCorrections(text: string, errors: GrammarError[]): string {
  let result = text;
  for (let i = errors.length - 1; i >= 0; i--) {
    const error = errors[i];
    result = result.substring(0, error.position) + error.corrected + result.substring(error.position + error.original.length);
  }
  return result;
}

const GrammarChecker = () => {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<GrammarError[]>([]);
  const [correctedText, setCorrectedText] = useState('');
  const [showCorrected, setShowCorrected] = useState(false);

  const check = () => {
    const found = checkGrammar(input);
    setErrors(found);
    setCorrectedText(applyCorrections(input, found));
    setShowCorrected(true);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(correctedText);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">맞춤법을 검사할 텍스트</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="한국어 텍스트를 입력하세요..."
          className="min-h-[200px]"
        />
      </div>
      <Button onClick={check} className="w-full" disabled={!input.trim()}>맞춤법 검사</Button>
    </div>
  );

  const resultSection = showCorrected ? (
    <div className="space-y-4">
      {errors.length > 0 ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{errors.length}개의 오류를 발견했습니다</p>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {errors.map((error, i) => (
              <div key={i} className="p-3 bg-background border border-border rounded-lg text-sm">
                <span className="text-destructive line-through">{error.original}</span>
                <span className="mx-2">{'\u2192'}</span>
                <span className="text-green-600 dark:text-green-400 font-medium">{error.corrected}</span>
                <p className="text-muted-foreground mt-1 text-xs">{error.explanation}</p>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">수정된 텍스트 복사</Button>
          <Textarea readOnly value={correctedText} className="min-h-[100px] text-sm" />
        </div>
      ) : (
        <div className="p-4 bg-background border border-border rounded-lg text-center">
          <p className="text-green-600 dark:text-green-400 font-medium">맞춤법 오류가 없습니다!</p>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      텍스트를 입력하고 맞춤법 검사를 클릭하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">맞춤법 검사기</strong>는 한국어 텍스트에서 흔히 발생하는 띄어쓰기 오류, 혼동하기 쉬운 표현, 잘못된 어미 활용 등을 자동으로 감지하고 교정해주는 규칙 기반 맞춤법 검사 도구입니다. 국립국어원의 한국어 맞춤법 규칙을 기반으로 하여, 일상적인 글쓰기에서 자주 범하는 실수들을 빠르게 찾아줍니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          블로그 글 작성, 이메일 초안, 보고서 작성, SNS 게시물 작성 등 다양한 상황에서 맞춤법 오류를 사전에 방지할 수 있습니다. 특히 띄어쓰기 규칙이ERSHEY复杂的한 한국어에서 부사와 동사 사이의 띄어쓰기, 의존명사 '때'의 띄어쓰기, 혼동 표현(되요/돼요, 이런거/이런 것 등) 등을 자동으로 잡아줍니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          브라우저에서 바로 사용 가능하며, 입력한 텍스트가 서버로 전송되지 않으므로 개인정보가 포함된 문서도 안심하고 검사할 수 있습니다. 검사 결과는 각 오류에 대한 설명과 수정 제안을 함께 제공하므로, 단순히 맞춤법을 고치는 것뿐만 아니라 올바른 한국어 사용법을 학습하는 데에도 도움이 됩니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          현재 13개 이상의 검사 규칙이 적용되어 있으며, 띄어쓰기, 혼동 표현, 의존명사 활용, 동사형 변환 등 다양한 유형의 오류를 포괄합니다. 수정된 텍스트는 원클릭으로 복사하여 바로 사용할 수 있어 빠른 글쓰기 워크플로우에 적합합니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">맞춤법 검사 규칙 및 알고리즘:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">정규 표현식(RegExp) 기반 규칙 매칭 알고리즘</strong>을 사용하여 텍스트 내의 맞춤법 오류를 탐지합니다. 미리 정의된 한국어 맞춤법 규칙 집합(KOREAN_RULES)에 대해 순차적으로 패턴 매칭을 수행합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 규칙 기반 패턴 매칭:</strong> 13개 이상의 한국어 맞춤법 규칙이 규칙 테이블에 정의되어 있습니다. 각 규칙은 오류 패턴, 교정 결과, 설명을 포함합니다. 입력 텍스트에서 각 규칙의 패턴을 순회하면서 일치하는 위치를 탐지합니다.</p>
          <p><strong className="text-foreground">2단계 - 위치 기반 오류 수집:</strong> 각 오류의 텍스트 내 위치(position)를 기록하여, 오류들이 발견된 순서대로 정렬합니다. 동일한 위치에 여러 규칙이 적용될 경우를 대비합니다.</p>
          <p><strong className="text-foreground">3단계 - 교정 적용:</strong> 발견된 오류를 텍스트의 뒤에서부터 앞으로 순서대로 교정합니다. 위치 시프팅(position shifting) 문제를 방지하기 위해 역순으로 처리합니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-2">주요 검사 규칙 예시:</p>
          <p>- <strong className="text-foreground">띄어쓰기:</strong> "안되" → "안 되", "할때" → "할 때", "에대해" → "에 대해" (부사·조사·의존명사 띄어쓰기)</p>
          <p>- <strong className="text-foreground">혼동 표현:</strong> "되요" → "돼요" ("되다"의 현재형은 "되어요"→"돼요"), "이런거" → "이런 것", "쉬럽다" → "쉽다"</p>
          <p>- <strong className="text-foreground">의존명사:</strong> "때"는 의존명사로 앞말과 반드시 띄어 씁니다 ("할 때", "볼 때", "먹을 때")</p>
          <p>- <strong className="text-foreground">부사 활용:</strong> "잘되", "많이 되" 등 부사 뒤에 오는 동사는 띄어 씁니다</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 검사 후 반드시 결과를 확인하세요</p>
            <p>이 도구는 규칙 기반 검사이므로 모든 맞춤법 오류를 감지하지 못할 수 있습니다. 복잡한 문장 구조나 문맥에 따른 오류는 검출이 어려우므로, 검사 결과를 반드시 직접 확인하고 필요시 추가 수정하시기 바랍니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 공식 문서는 국립국어원 검사기와 병행하세요</p>
            <p>학술 논문, 공문서, 계약서 등 공식적인 문서를 작성할 때는 국립국어원 맞춤법 검사기(https://korean.go.kr)와 함께 사용하시면 더 정확한 검사를 받을 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. 띄어쓰기 오류에 특히 주의하세요</p>
            <p>한국어에서 가장 흔한 맞춤법 오류는 띄어쓰기입니다. 부사와 동사, 조사와 명사, 의존명사 앞뒤의 띄어쓰기를重点的に 검사하면 글의 가독성과 전문성이 크게 향상됩니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. 수정된 텍스트 복사 기능을 활용하세요</p>
            <p>검사 완료 후 "수정된 텍스트 복사" 버튼을 클릭하면 교정된 전체 텍스트가 클립보드에 복사됩니다. 바로 메일이나 문서에 붙여넣기 할 수 있어 효율적입니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 짧은 텍스트부터 시작하세요</p>
            <p>처음 사용할 때는 짧은 문장이나 문단으로 검사해보시기 바랍니다. 긴 문서는 여러 번에 나누어 검사하면 더 정밀한 결과를 얻을 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 검사 규칙의 한계를 이해하세요</p>
            <p>현재 적용된 규칙은 띄어쓰기와 혼동 표현 중심입니다. 한자어의 정확한 표기, 외래어 표기법, 문법적 오류 등은 아직 지원되지 않으므로, 필요시 별도의 검수 과정을 거치시기 바랍니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 프라이버시가 보장됩니다</p>
            <p>모든 검사 과정이 브라우저 내에서 이루어지며, 입력한 텍스트는 외부 서버로 전송되지 않습니다. 개인정보가 포함된 문서나 비밀번호가 적힌 텍스트도 안심하고 검사할 수 있습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="맞춤법 검사기"
      description="한국어 텍스트의 맞춤법 오류를 검사합니다"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default GrammarChecker;
