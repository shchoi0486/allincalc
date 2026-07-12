'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

type PromptCategory = 'writing' | 'coding' | 'analysis' | 'creative';

const PROMPT_TEMPLATES_KO: Record<PromptCategory, string[]> = {
  writing: [
    '다음 주제에 대해 전문적이고 상세한 글을 작성해주세요: {topic}\n\n대상 독자: {audience}\n목적: {purpose}\n분량: {length}',
    '{topic}에 대한 비교 분석 글을 작성해주세요. 장단점을 균형있게 다루고, 실제 사례를 포함해주세요.',
    '{topic}에 대한 FAQ(자주 묻는 질문) 형식의 글을 작성해주세요. 최소 10개의 질문과 답변을 포함해주세요.',
    '{topic}의 역사, 현재, 미래를 시대별로 정리한 글을 작성해주세요.',
    '{topic}과 관련된 전문가 인터뷰 형식의 글을 작성해주세요. 질문과 답변 형식으로 작성해주세요.',
  ],
  coding: [
    '{language}로 {feature} 기능을 구현해주세요. 다음 요구사항을 충족해야 합니다:\n- {requirement1}\n- {requirement2}\n\n코드에 주석을 포함해주세요.',
    '다음 {language} 코드를 리뷰하고 개선점을 제안해주세요:\n```\n{code}\n```\n\n보안, 성능, 가독성 관점에서 분석해주세요.',
    '{language}로 {feature}에 대한 단위 테스트를 작성해주세요. 경계값 테스트와 예외 처리를 포함해주세요.',
    '{language}로 {feature}의 성능을 최적화하는 방법을 설명하고 코드 예제와 함께 제시해주세요.',
    '{language}로 {feature}를 구현하되, SOLID 원칙과 디자인 패턴을 적용해주세요.',
  ],
  analysis: [
    '다음 데이터를 분석하고 인사이트를 도출해주세요:\n{data}\n\n핵심 발견사항 3가지를 요약해주세요.',
    '{topic}에 대한 시장 분석 보고서를 작성해주세요. 다음 항목을 포함해주세요:\n- 시장 규모 및 성장률\n- 주요 경쟁사\n- SWOT 분석\n- 향후 전망',
    '다음 제품/서비스의 사용자 리뷰를 분석하고 긍정적/부정적 피드백을 분류해주세요:\n{reviews}',
    '{topic}에 대한 A/B 테스트 결과를 분석하고 통계적 유의성을 판단해주세요.',
    '다음 비즈니스 지표를 분석하고 개선 방안을 제시해주세요:\n{metrics}',
  ],
  creative: [
    '다음 키워드를 활용한 창작 스토리를 작성해주세요: {keywords}\n\n장르: {genre}\n분위기: {mood}\n분량: {length}',
    '{topic}에 대한 시(또는 노래 가사)를 작성해주세요. {mood} 분위기로 작성해주세요.',
    '다음 캐릭터에 대한 설정을 작성해주세요:\n이름: {name}\n배경: {background}\n성격: {personality}\n목표: {goal}',
    '{setting}을 배경으로 한 SF 단편 소설의 시작 부분을 작성해주세요.',
    '다음 브랜드의 슬로건과 캠페인 문구를 작성해주세요:\n브랜드: {brand}\n타겟: {target}\n가치관: {values}',
  ],
};

const PROMPT_TEMPLATES_EN: Record<PromptCategory, string[]> = {
  writing: [
    'Write a professional and detailed article on the following topic: {topic}\n\nTarget audience: {audience}\nPurpose: {purpose}\nLength: {length}',
    'Write a comparative analysis of {topic}. Cover pros and cons in a balanced way and include real examples.',
    'Write an FAQ-style article about {topic}. Include at least 10 questions and answers.',
    'Write an article that organizes the history, present, and future of {topic} by era.',
    'Write an article in the form of an expert interview about {topic}. Use a question-and-answer format.',
  ],
  coding: [
    'Implement a {feature} feature in {language}. It must meet the following requirements:\n- {requirement1}\n- {requirement2}\n\nInclude comments in the code.',
    'Review the following {language} code and suggest improvements:\n```\n{code}\n```\n\nAnalyze it from security, performance, and readability perspectives.',
    'Write unit tests for {feature} in {language}. Include boundary-value tests and exception handling.',
    'Explain how to optimize the performance of {feature} in {language}, and provide code examples.',
    'Implement {feature} in {language}, applying SOLID principles and design patterns.',
  ],
  analysis: [
    'Analyze the following data and derive insights:\n{data}\n\nSummarize the three key findings.',
    'Write a market analysis report on {topic}. Include the following:\n- Market size and growth rate\n- Key competitors\n- SWOT analysis\n- Future outlook',
    'Analyze user reviews of the following product/service and classify positive/negative feedback:\n{reviews}',
    'Analyze the A/B test results for {topic} and assess statistical significance.',
    'Analyze the following business metrics and suggest improvements:\n{metrics}',
  ],
  creative: [
    'Write a creative story using the following keywords: {keywords}\n\nGenre: {genre}\nMood: {mood}\nLength: {length}',
    'Write a poem (or song lyrics) about {topic}. Use a {mood} mood.',
    'Write a character profile for the following:\nName: {name}\nBackground: {background}\nPersonality: {personality}\nGoal: {goal}',
    'Write the opening of a science-fiction short story set in {setting}.',
    'Write a slogan and campaign copy for the following brand:\nBrand: {brand}\nTarget: {target}\nValues: {values}',
  ],
};

const FILLS_KO: Record<string, string> = {
  topic: '인공지능의 발전과 사회적 영향',
  audience: '일반 대중',
  purpose: '정보 전달 및 인사이트 제공',
  length: '2000자 내외',
  language: 'Python',
  feature: '사용자 인증 시스템',
  requirement1: 'JWT 토큰 기반 인증',
  requirement2: '비밀번호 해싱 (bcrypt)',
  code: 'function example() {\n  // code here\n}',
  data: '월별 매출: 1월 1000만원, 2월 1200만원, 3월 900만원',
  reviews: '좋았어요! 품질이 뛰어납니다.\n배송이 너무 늦었어요.\n가성비가 좋습니다.',
  metrics: '전환율: 2.5%, 이탈률: 45%, 평균 세션 시간: 3분',
  keywords: '우주, 시간, 외로움, 희망',
  genre: 'SF',
  mood: '몽환적이고 서정적인',
  name: '아라',
  background: '2150년 화성 식민지 출신',
  personality: '호기심이 많고 조용한 성격',
  goal: '지구로의 귀환',
  setting: '2150년 화성 식민지',
  brand: '테크노바',
  target: '20-30대 IT 전문가',
  values: '혁신, 효율성, 지속가능성',
};

const FILLS_EN: Record<string, string> = {
  topic: 'The development of AI and its social impact',
  audience: 'General public',
  purpose: 'Information sharing and insights',
  length: 'Around 2000 characters',
  language: 'Python',
  feature: 'User authentication system',
  requirement1: 'JWT token-based authentication',
  requirement2: 'Password hashing (bcrypt)',
  code: 'function example() {\n  // code here\n}',
  data: 'Monthly revenue: Jan 10M KRW, Feb 12M KRW, Mar 9M KRW',
  reviews: 'Great! Excellent quality.\nDelivery was too slow.\nGood value for money.',
  metrics: 'Conversion rate: 2.5%, Churn rate: 45%, Avg session time: 3 min',
  keywords: 'Space, time, loneliness, hope',
  genre: 'Sci-Fi',
  mood: 'Dreamy and lyrical',
  name: 'Ara',
  background: 'From a 2150 Mars colony',
  personality: 'Curious and quiet',
  goal: 'Return to Earth',
  setting: 'A Mars colony in 2150',
  brand: 'Technova',
  target: 'IT professionals in their 20s-30s',
  values: 'Innovation, efficiency, sustainability',
};

const DETAIL_LEVELS = ['기본', '상세', '매우 상세'];

function generatePrompts(category: PromptCategory, detailLevel: string, templates: Record<PromptCategory, string[]>): string[] {
  const tmpls = templates[category];
  const count = detailLevel === '기본' ? 2 : detailLevel === '상세' ? 4 : 6;
  return tmpls.slice(0, count);
}

function fillTemplate(template: string, fills: Record<string, string>): string {
  let result = template;
  Object.entries(fills).forEach(([key, value]) => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  });
  return result;
}

const PromptGenerator = () => {
  const { dict, locale } = useI18n();
  const t = dict.promptGenerator;
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);
  const [category, setCategory] = useState<PromptCategory>('writing');
  const [detailLevel, setDetailLevel] = useState('상세');
  const [prompts, setPrompts] = useState<string[]>([]);

  const generate = () => {
    const templates = isKo ? PROMPT_TEMPLATES_KO : PROMPT_TEMPLATES_EN;
    const fills = isKo ? FILLS_KO : FILLS_EN;
    const tmpls = generatePrompts(category, detailLevel, templates);
    setPrompts(tmpls.map(tmpl => fillTemplate(tmpl, fills)));
  };

  const copyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(prompts.join('\n\n---\n\n'));
  };

  const CATEGORY_KEYS: Record<PromptCategory, string> = {
    writing: t.writing,
    coding: t.coding,
    analysis: t.analysis,
    creative: t.creative,
  };

  const DETAIL_MAP: Record<string, string> = {
    '기본': t.basic,
    '상세': t.detailed,
    '매우 상세': t.veryDetailed,
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.categoryLabel}</label>
        <Select value={category} onValueChange={(v) => setCategory(v as PromptCategory)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="writing">{t.writing}</SelectItem>
            <SelectItem value="coding">{t.coding}</SelectItem>
            <SelectItem value="analysis">{t.analysis}</SelectItem>
            <SelectItem value="creative">{t.creative}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.detailLabel}</label>
        <Select value={detailLevel} onValueChange={setDetailLevel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DETAIL_LEVELS.map(level => (
              <SelectItem key={level} value={level}>{DETAIL_MAP[level] || level}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button onClick={generate} className="w-full">{t.button}</Button>
    </div>
  );

  const resultSection = prompts.length > 0 ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyAll} className="w-full">{t.copyAllButton}</Button>
      <div className="space-y-3 max-h-[400px] overflow-y-auto">
        {prompts.map((prompt, i) => (
          <div key={i} className="p-3 bg-background border border-border rounded-lg">
            <div className="flex justify-between items-start gap-2">
              <pre className="text-xs whitespace-pre-wrap flex-1 font-sans">{prompt}</pre>
              <Button variant="ghost" size="sm" onClick={() => copyPrompt(prompt)} className="shrink-0">{t.copyButton}</Button>
            </div>
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
          <strong className="text-foreground">{L('프롬프트 생성기', 'Prompt Generator')}</strong>{L('는 ChatGPT, Claude, Gemini 등 AI 도구를 활용할 때 효과적인 프롬프트(Prompt)를 템플릿 기반으로 자동 생성하는 도구입니다. "프롬프트 엔지니어링"의 기본 원리를 활용하여, AI로부터 더 정확하고 유용한 답변을 이끌어낼 수 있는 구조화된 프롬프트를 제공합니다.', ' is a tool that automatically generates effective prompts for AI tools like ChatGPT, Claude, and Gemini based on templates. Using the basics of "prompt engineering", it provides structured prompts that draw more accurate and useful answers from AI.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('글쓰기, 코딩, 데이터 분석, 창작 등 4가지 주요 카테고리에서 총 20개의 전문 프롬프트 템플릿을 제공합니다. 각 템플릿은 실제 AI 활용 사례를 기반으로 설계되었으며, 상세도 수준(기본/상세/매우 상세)을 조절하여 용도에 맞는 길이의 프롬프트를 생성할 수 있습니다.', 'It offers 20 professional prompt templates across four main categories — writing, coding, data analysis, and creative. Each template is designed from real AI use cases, and you can adjust the detail level (basic/detailed/very detailed) to generate prompts of the right length.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('AI에게 "무엇을" 해야 하는지 구체적으로 지시하는 것은 좋은 결과를 얻기 위한 핵심입니다. 이 도구는 역할 지정, 구체적 지시, 제약 조건, 컨텍스트 제공 등 프롬프트 엔지니어링의 핵심 요소를 자동으로 포함시켜, 프롬프트 작성에 익숙하지 않은 사용자도 전문가 수준의 프롬프트를 손쉽게 생성할 수 있도록 돕습니다.', 'Telling the AI specifically "what" to do is key to good results. This tool automatically includes core prompt-engineering elements — role assignment, specific instructions, constraints, and context — so even users unfamiliar with prompt writing can easily generate expert-level prompts.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('생성된 프롬프트는 원클릭으로 복사하여 바로 ChatGPT, Claude, Gemini 등 어떤 AI 도구에 붙여넣기 할 수 있으며, 각 프롬프트의 예시 변수(주제, 언어, 형식 등)는 실제 사용 환경에 맞게 자유롭게 수정하여 사용할 수 있습니다.', 'Generated prompts can be copied with one click and pasted into any AI tool such as ChatGPT, Claude, or Gemini, and each prompt’s example variables (topic, language, format, etc.) can be freely edited to fit your actual use case.')}
        </p>
        <TermGlossary items={[
          { term: L('프롬프트(Prompt)', 'Prompt'), desc: L('AI 모델에 내리는 질문이나 지시문입니다. 어떤 프롬프트를 주느냐에 따라 AI의 출력 결과가 크게 달라집니다.', 'A question or instruction given to an AI model. The output varies greatly depending on the prompt.') },
          { term: L('프롬프트 엔지니어링', 'Prompt Engineering'), desc: L('AI로부터 원하는 결과를 얻기 위해 역할 지정, 구체적 지시, 제약 조건, 컨텍스트 등을 체계적으로 구성하는 기법입니다.', 'The technique of systematically composing role assignment, specific instructions, constraints, and context to get the desired result from AI.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('프롬프트 생성 구조 및 알고리즘:', 'Prompt Generation Structure and Algorithm:')}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('본 도구는 ', 'This tool uses a ')}<strong className="text-foreground">{L('카테고리별 프롬프트 템플릿 매칭 및 변수 치환 알고리즘', 'category-based prompt template matching and variable substitution algorithm')}</strong>{L('을 사용합니다. 미리 설계된 4개 카테고리 x 5개 템플릿 = 총 20개의 프롬프트 템플릿이 데이터베이스에 정의되어 있으며, 선택된 카테고리와 상세도에 따라 적절한 템플릿이 반환됩니다.', '. A pre-designed set of 4 categories × 5 templates = 20 prompt templates is defined, and the appropriate templates are returned based on the selected category and detail level.')}
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('1단계 - 카테고리 선택:', 'Step 1 - Choose category:')}</strong> {L('글쓰기(writing), 코딩(coding), 분석(analysis), 창작(creative) 4개 카테고리 중 하나를 선택합니다. 각 카테고리는 해당 분야에 특화된 5개의 프롬프트 템플릿을 포함하고 있습니다.', 'Choose one of four categories: writing, coding, analysis, creative. Each category contains 5 prompt templates specialized for that field.')}</p>
          <p><strong className="text-foreground">{L('2단계 - 상세도 설정:', 'Step 2 - Set detail level:')}</strong> {L('기본(2개), 상세(4개), 매우 상세(6개) 중 상세도를 선택합니다. 상세도가 높을수록 더 많은 프롬프트 템플릿이 선택되며, 각 프롬프트의 구체성도 증가합니다.', 'Choose a detail level: basic (2), detailed (4), or very detailed (6). Higher detail selects more templates and increases each prompt’s specificity.')}</p>
          <p><strong className="text-foreground">{L('3단계 - 변수 치환:', 'Step 3 - Variable substitution:')}</strong> {L('선택된 템플릿에 포함된 변수({topic}, {language}, {code})를 미리 정의된 예시 값으로 치환합니다. 이를 통해 실제 바로 사용 가능한 완성된 프롬프트가 생성됩니다.', 'The variables in the selected templates ({topic}, {language}, {code}) are replaced with predefined example values, producing a ready-to-use completed prompt.')}</p>
          <p><strong className="text-foreground">{L('4단계 - 출력:', 'Step 4 - Output:')}</strong> {L('생성된 프롬프트들은 화면에 표시되며, 각각 개별 복사 또는 전체 복사가 가능합니다. 프롬프트 간에는 구분선(---)이 포함되어 구분이 용이합니다.', 'The generated prompts are displayed on screen and can be copied individually or all together. A separator (---) is included between prompts for easy distinction.')}</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('카테고리별 템플릿 예시:', 'Template examples by category:')}</strong></p>
          <p>- <strong className="text-foreground">{L('글쓰기:', 'Writing:')}</strong> {L('전문 글, 비교 분석, FAQ, 시대별 정리, 전문가 인터뷰 형식', 'professional articles, comparative analysis, FAQ, era-based organization, expert interview format')}</p>
          <p>- <strong className="text-foreground">{L('코딩:', 'Coding:')}</strong> {L('기능 구현, 코드 리뷰, 단위 테스트, 성능 최적화, SOLID 원칙 적용', 'feature implementation, code review, unit tests, performance optimization, SOLID principles')}</p>
          <p>- <strong className="text-foreground">{L('분석:', 'Analysis:')}</strong> {L('데이터 인사이트, 시장 분석, 사용자 리뷰 분석, A/B 테스트, 비즈니스 지표', 'data insights, market analysis, user review analysis, A/B testing, business metrics')}</p>
          <p>- <strong className="text-foreground">{L('창작:', 'Creative:')}</strong> {L('스토리, 시/가사, 캐릭터 설정, SF 단편, 브랜드 문구', 'stories, poems/lyrics, character profiles, sci-fi shorts, brand copy')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('효과적인 사용법과 팁:', 'Effective Usage and Tips:')}</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{L('1. 생성된 프롬프트를 반드시 수정하여 사용하세요', '1. Always edit the generated prompts before use')}</p>
            <p>{L('템플릿에 포함된 예시 변수(주제, 언어, 형식 등)는 실제 업무에 맞게 반드시 수정해야 합니다. 각 변수를 실제 주제나 프로그래밍 언어로 바꾸어 사용하세요.', 'The example variables in the templates (topic, language, format, etc.) must be edited to fit your actual work. Replace each variable with a real topic or programming language.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('2. 상세도를 목적에 맞게 선택하세요', '2. Choose the detail level to fit your purpose')}</p>
            <p>{L('빠른 아이디어가 필요하면 \'기본\', 구체적인 지시가 필요하면 \'상세\', 매우 정밀한 지시가 필요하면 \'매우 상세\'를 선택하세요. AI의 역량이 높을수록 더 구체적인 프롬프트에 강한 경향이 있습니다.', 'Pick "basic" for quick ideas, "detailed" for specific instructions, and "very detailed" for highly precise instructions. Stronger AI models tend to respond better to more specific prompts.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('3. 프롬프트를 조합하여 활용하세요', '3. Combine prompts for better results')}</p>
            <p>{L('여러 프롬프트의 요소를 조합하면 더 좋은 결과를 얻을 수 있습니다. 예를 들어, 코딩 프롬프트에서 "코드 리뷰"와 "단위 테스트"를 결합하여 한 번에 요청할 수 있습니다.', 'Combining elements of several prompts can yield better results. For example, you can combine "code review" and "unit tests" from a coding prompt into a single request.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('4. AI 출력 형식을 명시하세요', '4. Specify the AI output format')}</p>
            <p>{L('프롬프트에 원하는 출력 형식(표, 리스트, 코드 블록, 마크다운 등)을 명시하면 AI가 더 구조화된 결과를 제공합니다. 생성된 프롬프트에 형식 지시를 추가하면 효과적입니다.', 'Stating the desired output format (table, list, code block, markdown, etc.) in the prompt helps the AI give more structured results. Adding format instructions to generated prompts is effective.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('5. 점진적으로 개선하는 전략을 사용하세요', '5. Use an incremental improvement strategy')}</p>
            <p>{L('첫 번째 결과에서 불만족한 부분을 특정하여 "이 부분을 이렇게 바꿔주세요"라고 추가 지시하면, AI와의 대화를 통해 점진적으로 더 나은 결과를 얻을 수 있습니다.', 'Identify what you are unsatisfied with in the first result and add instructions like "change this part this way" to gradually get better results through conversation with the AI.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('6. 여러 AI 도구에서 비교해보세요', '6. Compare across multiple AI tools')}</p>
            <p>{L('같은 프롬프트를 ChatGPT, Claude, Gemini 등 서로 다른 AI 도구에 입력하면, 각 도구마다 다른 관점의 답변을 얻을 수 있습니다. 여러 도구를 비교하여 가장 적합한 결과를 선택하세요.', 'Entering the same prompt into different AI tools like ChatGPT, Claude, and Gemini yields different perspectives. Compare them and choose the most suitable result.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('7. 좋은 프롬프트의 특성을 학습하세요', '7. Learn the traits of good prompts')}</p>
            <p>{L('생성된 프롬프트를 분석하면 역할 지정, 구체적 지시, 제약 조건, 컨텍스트 제공 등 좋은 프롬프트의 구조를 자연스럽게 학습할 수 있습니다. 이를 통해 직접 프롬프트를 작성하는 능력도 향상됩니다.', 'Analyzing generated prompts naturally teaches the structure of good prompts — role assignment, specific instructions, constraints, and context — improving your own prompt-writing ability.')}</p>
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

export default PromptGenerator;
