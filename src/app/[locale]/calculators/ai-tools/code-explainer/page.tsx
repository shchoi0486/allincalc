'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

type Language = 'javascript' | 'python' | 'java' | 'html' | 'css';

interface CodeExplanation {
  type: string;
  content: string;
}

function analyzeCode(isKo: boolean, code: string, language: Language): CodeExplanation[] {
  const L = (ko: string, en: string) => (isKo ? ko : en);
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
      type: L('함수/메서드', 'Functions/Methods'),
      content: L(`다음 함수/메서드들이 코드에서 사용되었습니다:\n${functions.map(f => `• ${f}()`).join('\n')}\n\n이 함수들은 각각 특정 작업을 수행하며, 코드의 모듈화와 재사용성을 높여줍니다.`,
        `The following functions/methods are used in the code:\n${functions.map(f => `• ${f}()`).join('\n')}\n\nEach performs a specific task, improving the code’s modularity and reusability.`),
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
      type: L('주석', 'Comments'),
      content: L(`코드에 포함된 주석:\n${comments.map(c => `• ${c}`).join('\n')}\n\n주석은 코드의 의도와 동작을 설명하는 중요한 요소입니다.`,
        `Comments included in the code:\n${comments.map(c => `• ${c}`).join('\n')}\n\nComments are important for explaining the intent and behavior of the code.`),
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
      type: L('제어 구조', 'Control Structures'),
      content: L(`사용된 제어 구조:\n${controlKeywords.map(kw => `• ${kw}`).join('\n')}\n\n이 구조들은 코드의 실행 흐름을 제어합니다.`,
        `Control structures used:\n${controlKeywords.map(kw => `• ${kw}`).join('\n')}\n\nThese structures control the execution flow of the code.`),
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
        type: L('변수/클래스 선언', 'Variable/Class Declarations'),
        content: L(`변수 및 클래스 선언:\n${declarations.slice(0, 10).map(d => `• ${d.trim()}`).join('\n')}${declarations.length > 10 ? `\n... 외 ${declarations.length - 10}개` : ''}`,
          `Variable and class declarations:\n${declarations.slice(0, 10).map(d => `• ${d.trim()}`).join('\n')}${declarations.length > 10 ? `\n... and ${declarations.length - 10} more` : ''}`),
      });
    }
  }

  const lineCount = lines.length;
  const charCount = code.length;
  const blankLines = lines.filter(l => l.trim() === '').length;

  explanations.push({
    type: L('코드 통계', 'Code Statistics'),
    content: L(`총 ${lineCount}줄, ${charCount}자\n빈 줄: ${blankLines}줄\n사용된 언어: ${language.charAt(0).toUpperCase() + language.slice(1)}`,
      `Total ${lineCount} lines, ${charCount} characters\nBlank lines: ${blankLines}\nLanguage: ${language.charAt(0).toUpperCase() + language.slice(1)}`),
  });

  if (explanations.length === 0) {
    explanations.push({
      type: L('분석 결과', 'Analysis Result'),
      content: L('특정한 패턴이 감지되지 않았습니다. 코드를 더 입력하면 분석 결과를 확인할 수 있습니다.', 'No specific pattern was detected. Enter more code to see analysis results.'),
    });
  }

  return explanations;
}

const CodeExplainer = () => {
  const { dict, locale } = useI18n();
  const t = dict.codeExplainer;
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState<Language>('javascript');
  const [explanations, setExplanations] = useState<CodeExplanation[]>([]);

  const explain = () => {
    if (!code.trim()) return;
    setExplanations(analyzeCode(isKo, code, language));
  };

  const copyToClipboard = () => {
    const text = explanations.map(e => `[${e.type}]\n${e.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.languageLabel}</label>
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
        <label className="text-sm font-medium">{t.codeLabel}</label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t.codePlaceholder}
          className="min-h-[200px] font-mono text-xs"
        />
      </div>
      <Button onClick={explain} className="w-full" disabled={!code.trim()}>{t.button}</Button>
    </div>
  );

  const resultSection = explanations.length > 0 ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
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
      {t.emptyPrompt}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">{L('코드 설명기', 'Code Explainer')}</strong>{L('는 프로그래밍 코드를 붙여넣으면 정규 표현식(RegExp) 기반의 패턴 매칭을 통해 코드의 구조와 요소를 자동으로 분석하고 설명해주는 개발자 보조 도구입니다. 함수/메서드 정의, 변수/클래스 선언, 제어 구조, 주석, 코드 통계 등 다양한 항목을 종합적으로 분석하여 코드의 전체적인 구조를 한눈에 파악할 수 있도록 돕습니다.', ' is a developer assistant that, when you paste programming code, automatically analyzes and explains its structure and elements through regular-expression (RegExp) based pattern matching. It comprehensively analyzes functions/method definitions, variable/class declarations, control structures, comments, and code statistics to help you grasp the overall structure at a glance.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('JavaScript, Python, Java, HTML, CSS 등 5개 주요 프로그래밍 언어를 지원하며, 각 언어에 맞는 정규 표현식 패턴과 키워드 목록이 별도로 최적화되어 있습니다. 특히 프로그래밍을 처음 시작하는 초보자, 새로운 언어를 학습하는 개발자, 레거시 코드를 리뷰해야 하는 시니어 개발자 모두에게 유용합니다.', 'It supports five major languages — JavaScript, Python, Java, HTML, and CSS — each with separately optimized RegExp patterns and keyword lists. It is useful for beginners just starting programming, developers learning a new language, and senior developers who must review legacy code.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('완전한 AI 기반 코드 분석은 아니지만, 코드 리뷰 미팅에서 빠르게 코드 구조를 파악하거나, 학습 중인 오픈소스 코드의 구성 요소를 이해하거나, 자신이 작성한 코드의 복잡도를 점검하는 데 효과적입니다. 코드를 분석하기 전에 언어를 선택하면 해당 언어에 최적화된 분석 결과를 제공합니다.', 'It is not a full AI-based code analysis, but it is effective for quickly grasping code structure in a review meeting, understanding the components of open-source code you are studying, or checking the complexity of your own code. Selecting the language before analysis gives language-optimized results.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('분석 결과는 함수/메서드 목록, 주석 내용, 제어 구조, 변수 선언, 코드 통계 등 카테고리별로 구조화되어 표시되며, 전체 분석 결과를 한 번에 클립보드에 복사하여 문서화하거나 팀원과 공유할 수도 있습니다.', 'Results are structured by category — functions/methods list, comments, control structures, variable declarations, code statistics — and the full analysis can be copied to the clipboard at once for documentation or sharing with teammates.')}
        </p>
        <TermGlossary items={[
          { term: L('정규 표현식(RegExp)', 'Regular Expression (RegExp)'), desc: L('문자열에서 패턴을 찾거나 분류하는 문법입니다. 이 도구는 각 언어별 함수 선언, 주석, 키워드 패턴을 RegExp로 탐지합니다.', 'Syntax for finding or classifying patterns in strings. This tool detects each language’s function declarations, comments, and keyword patterns via RegExp.') },
          { term: L('제어 구조(Control Flow)', 'Control Flow'), desc: L('코드의 실행 흐름을 제어하는 구문입니다. if, for, while, switch, try/catch 등이 있으며 프로그램의 분기와 반복을 결정합니다.', 'Statements that control the execution flow of code — if, for, while, switch, try/catch — determining branching and repetition.') },
          { term: L('키워드(Keyword)', 'Keyword'), desc: L('프로그래밍 언어에서 특별한 의미를 갖는 예약어입니다. 언어마다 고유한 키워드 목록이 있어 코드의 구조를 파악하는 데 사용됩니다.', 'Reserved words with special meaning in a programming language. Each language has its own keyword list, used to understand code structure.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('코드 분석 알고리즘:', 'Code Analysis Algorithm:')}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('본 도구는 ', 'This tool uses a ')}<strong className="text-foreground">{L('정규 표현식(RegExp) 기반 패턴 매칭 알고리즘', 'regular-expression (RegExp) based pattern-matching algorithm')}</strong>{L('을 사용하여 코드를 분석합니다. 각 프로그래밍 언어별로 특화된 정규 표현식 패턴과 키워드 목록이 정의되어 있으며, 이를 통해 코드 요소를 탐지하고 분류합니다.', ' to analyze code. Specialized RegExp patterns and keyword lists are defined per language, detecting and classifying code elements.')}
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('1단계 - 함수/메서드 탐지:', 'Step 1 - Function/method detection:')}</strong> {L('각 언어의 함수 선언 패턴을 정규 표현식으로 탐지합니다.', 'Detect each language’s function declaration pattern via RegExp.')}</p>
          <p><strong className="text-foreground">{L('2단계 - 주석 추출:', 'Step 2 - Comment extraction:')}</strong> {L('각 언어의 주석 구문을 탐지하여 코드에 포함된 주석의 내용을 추출합니다.', 'Detect each language’s comment syntax and extract the comment content.')}</p>
          <p><strong className="text-foreground">{L('3단계 - 키워드 및 제어 구조 분석:', 'Step 3 - Keyword and control-structure analysis:')}</strong> {L('사전에 정의된 프로그래밍 언어 키워드 목록과 코드를 대조하여 사용된 키워드를 탐지합니다.', 'Compare the code against a predefined keyword list to detect used keywords.')}</p>
          <p><strong className="text-foreground">{L('4단계 - 변수/클래스 선언 탐지:', 'Step 4 - Variable/class declaration detection:')}</strong> {L('변수/클래스 선언 키워드가 포함된 코드 라인을 추출합니다.', 'Extract code lines containing variable/class declaration keywords.')}</p>
          <p><strong className="text-foreground">{L('5단계 - 코드 통계 산출:', 'Step 5 - Code statistics:')}</strong> {L('전체 줄 수, 문자 수, 빈 줄 수, 사용된 언어 등의 기본 통계를 계산합니다.', 'Compute basic statistics: total lines, character count, blank lines, and language used.')}</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('지원 언어별 패턴:', 'Patterns by supported language:')}</strong></p>
          <p>- <strong className="text-foreground">JavaScript:</strong> {L('function, const/let/var 화살표 함수, import/export, 비동기(async/await)', 'function, const/let/var arrow functions, import/export, async/await')}</p>
          <p>- <strong className="text-foreground">Python:</strong> {L('def, class, self, lambda, try/except, with/as', 'def, class, self, lambda, try/except, with/as')}</p>
          <p>- <strong className="text-foreground">Java:</strong> {L('public/private/protected, static, class, interface, try/catch', 'public/private/protected, static, class, interface, try/catch')}</p>
          <p>- <strong className="text-foreground">HTML:</strong> {L('모든 HTML 태그, 속성, 주석', 'all HTML tags, attributes, comments')}</p>
          <p>- <strong className="text-foreground">CSS:</strong> {L('선택자, 속성, 미디어 쿼리, @ 규칙', 'selectors, properties, media queries, @ rules')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('효과적인 사용법과 팁:', 'Effective Usage and Tips:')}</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{L('1. 반드시 프로그래밍 언어를 선택하세요', '1. Always select the programming language')}</p>
            <p>{L('코드를 입력하기 전에 사용 중인 프로그래밍 언어를 드롭다운에서 반드시 선택하세요. 언어에 따라 함수 선언 패턴, 키워드 목록, 주석 구문이 다르므로, 정확한 언어 선택이 분석 정확도에 직접적으로 영향을 미칩니다.', 'Before entering code, always select the language from the dropdown. Function patterns, keyword lists, and comment syntax differ by language, so the correct choice directly affects accuracy.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('2. 충분한 분량의 코드를 입력하세요', '2. Enter a sufficient amount of code')}</p>
            <p>{L('1~2줄의 짧은 코드보다는 함수 여러 개가 포함된 코드 블록이나 전체 파일을 입력하면 더 의미 있는 분석 결과를 얻을 수 있습니다. 최소 10줄 이상의 코드를 권장합니다.', 'Rather than 1–2 short lines, enter a code block with several functions or a whole file for more meaningful results. At least 10 lines is recommended.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('3. 코드 리뷰에 활용하세요', '3. Use it for code review')}</p>
            <p>{L('코드 리뷰 미팅 전에 이 도구를 사용하면 코드의 구조를 빠르게 파악할 수 있습니다.', 'Using this tool before a code review meeting lets you grasp the structure quickly.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('4. 학습 중인 코드를 분석하세요', '4. Analyze code you are studying')}</p>
            <p>{L('새로운 프로그래밍 언어나 프레임워크를 학습할 때, 오픈소스 코드나 예제 코드를 이 도구에 입력하면 코드의 구조와 요소를 빠르게 이해할 수 있습니다.', 'When learning a new language or framework, pasting open-source or example code helps you quickly understand its structure and elements.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('5. 분석 결과를 문서화하세요', '5. Document the analysis results')}</p>
            <p>{L('"설명 복사" 버튼을 사용하면 분석 결과 전체를 클립보드에 복사할 수 있습니다.', 'The "Copy explanation" button copies the entire analysis to the clipboard.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('6. 패턴 기반 분석의 한계를 이해하세요', '6. Understand the limits of pattern-based analysis')}</p>
            <p>{L('이 도구는 정규 표현식 기반 패턴 매칭이므로, 코드의 의미론적 분석(의미 있는 변수명 확인, 로직의 정확성 평가, 성능 분석 등)은 수행하지 않습니다.', 'Because it is RegExp-based pattern matching, it does not perform semantic analysis (meaningful variable names, logic correctness, performance analysis, etc.).')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('7. 여러 언어의 코드를 각각 분석하세요', '7. Analyze mixed-language code separately')}</p>
            <p>{L('JavaScript와 Python이 혼합된 코드는 언어별로 나누어 각각 분석하는 것이 좋습니다.', 'Code mixing JavaScript and Python should be split by language and analyzed separately.')}</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
      variant="split"
     />
  );
};

export default CodeExplainer;
