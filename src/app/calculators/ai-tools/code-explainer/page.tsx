'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type Language = 'javascript' | 'python' | 'java' | 'html' | 'css';

interface CodeExplanation {
  type: string;
  content: string;
}

function analyzeCode(code: string, language: Language): CodeExplanation[] {
  const explanations: CodeExplanation[] = [];
  const lines = code.split('\n');

  const functionPatterns: Record<Language, RegExp> = {
    javascript: /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:\([^)]*\)\s*=>|\w+\s*=>))/g,
    python: /def\s+(\w+)\s*\(/g,
    java: /(?:public|private|protected)?\s*(?:static)?\s*\w+\s+(\w+)\s*\(/g,
    html: /<(\w+)(?:\s[^>]*)?>/g,
    css: /(\w+)\s*\{/g,
  };

  const commentPatterns: Record<Language, RegExp> = {
    javascript: /\/\/(.+)|\/\*[\s\S]*?\*\//g,
    python: /#(.+)/g,
    java: /\/\/(.+)|\/\*[\s\S]*?\*\//g,
    html: /<!--[\s\S]*?-->/g,
    css: /\/\*[\s\S]*?\*\//g,
  };

  const keywords: Record<Language, string[]> = {
    javascript: ['if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'return', 'class', 'extends', 'import', 'export', 'const', 'let', 'var', 'function', 'async', 'await', 'try', 'catch', 'throw', 'new', 'this', 'typeof', 'instanceof'],
    python: ['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'return', 'import', 'from', 'try', 'except', 'finally', 'with', 'as', 'yield', 'lambda', 'pass', 'break', 'continue', 'raise', 'True', 'False', 'None', 'self'],
    java: ['if', 'else', 'for', 'while', 'switch', 'case', 'break', 'continue', 'return', 'class', 'interface', 'extends', 'implements', 'import', 'package', 'public', 'private', 'protected', 'static', 'final', 'void', 'new', 'this', 'super', 'try', 'catch', 'finally', 'throw', 'throws'],
    html: ['div', 'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'form', 'input', 'button', 'img', 'section', 'article', 'nav', 'header', 'footer', 'main'],
    css: ['color', 'background', 'margin', 'padding', 'border', 'display', 'position', 'font-size', 'font-weight', 'text-align', 'width', 'height', 'flex', 'grid', 'transition', 'animation', 'transform'],
  };

  const functions: string[] = [];
  const funcPattern = functionPatterns[language];
  let match;
  while ((match = funcPattern.exec(code)) !== null) {
    const name = match[1] || match[2];
    if (name && !functions.includes(name)) {
      functions.push(name);
    }
  }

  if (functions.length > 0) {
    explanations.push({
      type: '함수/메서드',
      content: `다음 함수/메서드들이 코드에서 사용되었습니다:\n${functions.map(f => `• ${f}()`).join('\n')}\n\n이 함수들은 각각 특정 작업을 수행하며, 코드의 모듈화와 재사용성을 높여줍니다.`,
    });
  }

  const comments: string[] = [];
  const commentPattern = commentPatterns[language];
  while ((match = commentPattern.exec(code)) !== null) {
    const comment = (match[1] || match[0]).trim();
    if (comment) {
      comments.push(comment);
    }
  }

  if (comments.length > 0) {
    explanations.push({
      type: '주석',
      content: `코드에 포함된 주석:\n${comments.map(c => `• ${c}`).join('\n')}\n\n주석은 코드의 의도와 동작을 설명하는 중요한 요소입니다.`,
    });
  }

  const usedKeywords = new Set<string>();
  const langKeywords = keywords[language];
  langKeywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    if (regex.test(code)) {
      usedKeywords.add(kw);
    }
  });

  const controlFlow = ['if', 'else', 'for', 'while', 'switch', 'case', 'try', 'catch', 'elif', 'except'];
  const controlKeywords = [...usedKeywords].filter(kw => controlFlow.includes(kw));

  if (controlKeywords.length > 0) {
    explanations.push({
      type: '제어 구조',
      content: `사용된 제어 구조:\n${controlKeywords.map(kw => `• ${kw}`).join('\n')}\n\n이 구조들은 코드의 실행 흐름을 제어합니다.`,
    });
  }

  const variableKeywords = ['const', 'let', 'var', 'def', 'class', 'self', 'this'];
  const varKeywords = [...usedKeywords].filter(kw => variableKeywords.includes(kw));

  if (varKeywords.length > 0) {
    const declarations = code.split('\n').filter(line =>
      varKeywords.some(kw => line.trim().startsWith(kw))
    );
    if (declarations.length > 0) {
      explanations.push({
        type: '변수/클래스 선언',
        content: `변수 및 클래스 선언:\n${declarations.slice(0, 10).map(d => `• ${d.trim()}`).join('\n')}${declarations.length > 10 ? `\n... 외 ${declarations.length - 10}개` : ''}`,
      });
    }
  }

  const lineCount = lines.length;
  const charCount = code.length;
  const blankLines = lines.filter(l => l.trim() === '').length;

  explanations.push({
    type: '코드 통계',
    content: `총 ${lineCount}줄, ${charCount}자\n빈 줄: ${blankLines}줄\n사용된 언어: ${language.charAt(0).toUpperCase() + language.slice(1)}`,
  });

  if (explanations.length === 0) {
    explanations.push({
      type: '분석 결과',
      content: '특정한 패턴이 감지되지 않았습니다. 코드를 더 입력하면 분석 결과를 확인할 수 있습니다.',
    });
  }

  return explanations;
}

const CodeExplainer = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [explanations, setExplanations] = useState<CodeExplanation[]>([]);

  const explain = () => {
    if (!code.trim()) return;
    setExplanations(analyzeCode(code, language));
  };

  const copyToClipboard = () => {
    const text = explanations.map(e => `[${e.type}]\n${e.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">프로그래밍 언어</label>
        <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="java">Java</SelectItem>
            <SelectItem value="html">HTML</SelectItem>
            <SelectItem value="css">CSS</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">코드 입력</label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="분석할 코드를 입력하세요..."
          className="min-h-[200px] font-mono text-xs"
        />
      </div>
      <Button onClick={explain} className="w-full" disabled={!code.trim()}>코드 설명</Button>
    </div>
  );

  const resultSection = explanations.length > 0 ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">설명 복사</Button>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {explanations.map((exp, i) => (
          <div key={i} className="p-3 bg-background border border-border rounded-lg">
            <h4 className="font-medium text-sm mb-2">{exp.type}</h4>
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground font-sans">{exp.content}</pre>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      코드를 입력하고 코드 설명을 클릭하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">코드 설명기</strong>는 프로그래밍 코드를 붙여넣으면 정규 표현식(RegExp) 기반의 패턴 매칭을 통해 코드의 구조와 요소를 자동으로 분석하고 설명해주는 개발자 보조 도구입니다. 함수/메서드 정의, 변수/클래스 선언, 제어 구조, 주석, 코드 통계 등 다양한 항목을 종합적으로 분석하여 코드의 전체적인 구조를 한눈에 파악할 수 있도록 돕습니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          JavaScript, Python, Java, HTML, CSS 등 5개 주요 프로그래밍 언어를 지원하며, 각 언어에 맞는 정규 표현식 패턴과 키워드 목록이 별도로 최적화되어 있습니다. 특히 프로그래밍을 처음 시작하는 초보자, 새로운 언어를 학습하는 개발자, 레거시 코드를 리뷰해야 하는 시니어 개발자 모두에게 유용합니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          완전한 AI 기반 코드 분석은 아니지만, 코드 리뷰 미팅에서 빠르게 코드 구조를 파악하거나, 학습 중인 오픈소스 코드의 구성 요소를 이해하거나,自己가 작성한 코드의 복잡도를 점검하는 데 효과적입니다. 코드를 분석하기 전에 언어를 선택하면 해당 언어에 최적화된 분석 결과를 제공합니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          분석 결과는 함수/메서드 목록, 주석 내용, 제어 구조, 변수 선언, 코드 통계 등 카테고리별로 구조화되어 표시되며, 전체 분석 결과를 한 번에 클립보드에 복사하여 문서화하거나 팀원과 공유할 수도 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">코드 분석 알고리즘:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">정규 표현식(RegExp) 기반 패턴 매칭 알고리즘</strong>을 사용하여 코드를 분석합니다. 각 프로그래밍 언어별로 특화된 정규 표현식 패턴과 키워드 목록이 정의되어 있으며, 이를 통해 코드 요소를 탐지하고 분류합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 함수/메서드 탐지:</strong> 각 언어의 함수 선언 패턴을 정규 표현식으로 탐지합니다. JavaScript는 function 키워드와 화살표 함수(=&gt;), Python은 def 키워드, Java는 접근 제어자와 반환 타입을 기반으로 함수를 감지합니다. 중복된 함수명은 제외합니다.</p>
          <p><strong className="text-foreground">2단계 - 주석 추출:</strong> 각 언어의 주석 구문(//, /* */, #, &lt;!-- --&gt;)을 탐지하여 코드에 포함된 주석의 내용을 추출합니다. 주석은 코드의 의도와 동작을 설명하는 중요한 정보입니다.</p>
          <p><strong className="text-foreground">3단계 - 키워드 및 제어 구조 분석:</strong> 사전에 정의된 프로그래밍 언어 키워드 목록과 코드를 대조하여 사용된 키워드를 탐지합니다. 이 중 if, else, for, while, switch, try, catch 등 제어 흐름과 관련된 키워드를 별도로 분류합니다.</p>
          <p><strong className="text-foreground">4단계 - 변수/클래스 선언 탐지:</strong> const, let, var, def, class, self, this 등의 변수/클래스 선언 키워드가 포함된 코드 라인을 추출합니다. 코드 내의 변수 선언 위치와 방식을 파악할 수 있습니다.</p>
          <p><strong className="text-foreground">5단계 - 코드 통계 산출:</strong> 전체 줄 수, 문자 수, 빈 줄 수, 사용된 언어 등의 기본 통계를 계산하여 코드의 규모와 복잡도를 개괄적으로 보여줍니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">지원 언어별 패턴:</strong></p>
          <p>- <strong className="text-foreground">JavaScript:</strong> function, const/let/var 화살표 함수, import/export, 비동기(async/await)</p>
          <p>- <strong className="text-foreground">Python:</strong> def, class, self, lambda, try/except, with/as</p>
          <p>- <strong className="text-foreground">Java:</strong> public/private/protected, static, class, interface, try/catch</p>
          <p>- <strong className="text-foreground">HTML:</strong> 모든 HTML 태그, 속성, 주석</p>
          <p>- <strong className="text-foreground">CSS:</strong> 선택자, 속성, 미디어 쿼리, @ 규칙</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 반드시 프로그래밍 언어를 선택하세요</p>
            <p>코드를 입력하기 전에 사용 중인 프로그래밍 언어를 드롭다운에서 반드시 선택하세요. 언어에 따라 함수 선언 패턴, 키워드 목록, 주석 구문이 다르므로, 정확한 언어 선택이 분석 정확도에直接影响합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 충분한 분량의 코드를 입력하세요</p>
            <p>1~2줄의 짧은 코드보다는 함수 여러 개가 포함된 코드 블록이나 전체 파일을 입력하면更有意義한 분석 결과를 얻을 수 있습니다. 최소 10줄 이상의 코드를 권장합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. 코드 리뷰에 활용하세요</p>
            <p>코드 리뷰 미팅 전에 이 도구를 사용하면 코드의 구조를 빠르게 파악할 수 있습니다. 함수가 몇 개 있는지, 어떤 제어 구조가 사용되었는지, 주석은 충분한지 등을 미리 확인하면 리뷰가 더 효과적입니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. 학습 중인 코드를 분석하세요</p>
            <p>새로운 프로그래밍 언어나 프레임워크를 학습할 때, 오픈소스 코드나 예제 코드를 이 도구에 입력하면 코드의 구조와 요소를 빠르게 이해할 수 있습니다. 초보자에게 특히 유용합니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 분석 결과를 문서화하세요</p>
            <p>"설명 복사" 버튼을 사용하면 분석 결과 전체를 클립보드에 복사할 수 있습니다. 이를 기술 문서, 위키, README 파일 등에 붙여넣기하여 프로젝트 문서화에 활용할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 패턴 기반 분석의 한계를 이해하세요</p>
            <p>이 도구는 정규 표현식 기반 패턴 매칭이므로, 코드의 의미론적 분석(의미 있는 변수명 확인, 로직의 정확성 평가, 성능 분석 등)은 수행하지 않습니다. 이러한 심층 분석이 필요하면 AI 코딩 어시스턴트를 활용하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 여러 언어의 코드를 각각 분석하세요</p>
            <p>JavaScript와 Python이 혼합된 코드(예: 풀스택 프로젝트)는 언어별로 나누어 각각 분석하는 것이 좋습니다. 한 번에 하나의 언어에 최적화된 분석을 수행하는 것이 정확도가 높습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="코드 설명기"
      description="코드를 분석하여 구조와 요소를 설명합니다"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CodeExplainer;
