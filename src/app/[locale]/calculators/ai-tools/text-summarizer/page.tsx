'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

type SummaryLength = 'short' | 'medium' | 'long';

function splitSentences(text: string): string[] {
  return text
    .split(/[.!?。\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

function getWordFrequency(sentences: string[]): Map<string, number> {
  const freq = new Map<string, number>();
  const stopWords = new Set([
    '이', '가', '을', '를', '은', '는', '에', '의', '도', '로', '으로',
    '와', '과', '하고', '그리고', '그', '저', '것', '수', '등', '때문',
    '더', '좀', '잘', '안', '못', '아니', '있다', '없다', '하다', '되다',
    'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
    'should', 'may', 'might', 'can', 'shall', 'to', 'of', 'in', 'for',
    'on', 'with', 'at', 'by', 'from', 'as', 'into', 'through', 'during',
    'before', 'after', 'and', 'but', 'or', 'nor', 'not', 'so', 'yet',
    'both', 'either', 'neither', 'each', 'every', 'all', 'any', 'few',
    'more', 'most', 'other', 'some', 'such', 'no', 'only', 'own', 'same',
    'than', 'too', 'very', 'just', 'because', 'if', 'when', 'while',
  ]);

  sentences.forEach(sentence => {
    const words = sentence.toLowerCase().split(/\s+/);
    words.forEach(word => {
      const cleaned = word.replace(/[^가-힣a-z0-9]/g, '');
      if (cleaned.length > 1 && !stopWords.has(cleaned)) {
        freq.set(cleaned, (freq.get(cleaned) || 0) + 1);
      }
    });
  });

  return freq;
}

function scoreSentence(sentence: string, freq: Map<string, number>): number {
  const words = sentence.toLowerCase().split(/\s+/);
  let score = 0;
  words.forEach(word => {
    const cleaned = word.replace(/[^가-힣a-z0-9]/g, '');
    score += freq.get(cleaned) || 0;
  });
  return score / Math.max(words.length, 1);
}

function summarize(text: string, length: SummaryLength): string {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return '';
  if (sentences.length <= 2) return sentences.join('. ');

  const targetCount = length === 'short' ? 2 : length === 'medium' ? Math.ceil(sentences.length * 0.3) : Math.ceil(sentences.length * 0.5);
  const count = Math.min(targetCount, sentences.length);

  const freq = getWordFrequency(sentences);
  const scored = sentences.map((s, i) => ({ text: s, score: scoreSentence(s, freq), index: i }));
  const sorted = [...scored].sort((a, b) => b.score - a.score);
  const selected = sorted.slice(0, count).sort((a, b) => a.index - b.index);

  return selected.map(s => s.text).join('. ') + '.';
}

const TextSummarizer = () => {
  const { dict, locale } = useI18n();
  const t = dict.textSummarizer;
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);
  const [input, setInput] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [result, setResult] = useState('');

  const process = () => {
    if (!input.trim()) return;
    setResult(summarize(input, length));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const originalWordCount = input ? input.split(/\s+/).length : 0;
  const summaryWordCount = result ? result.split(/\s+/).length : 0;

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.inputLabel}</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t.inputPlaceholder}
          className="min-h-[200px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">{t.lengthLabel}</label>
        <Select value={length} onValueChange={(v) => setLength(v as SummaryLength)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short">{t.short}</SelectItem>
            <SelectItem value="medium">{t.medium}</SelectItem>
            <SelectItem value="long">{t.long}</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={process} className="w-full" disabled={!input.trim()}>{t.button}</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <div className="flex gap-2 text-xs text-muted-foreground justify-center">
        <span>{t.wordCount.replace('{original}', String(originalWordCount)).replace('{summary}', String(summaryWordCount))}</span>
        <span>|</span>
        <span>{t.reduction.replace('{percent}', String(Math.round((1 - summaryWordCount / originalWordCount) * 100)))}</span>
      </div>
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">{t.copyButton}</Button>
      <Textarea readOnly value={result} className="min-h-[150px] text-sm leading-relaxed" />
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
          <strong className="text-foreground">{L('텍스트 요약 도구', 'Text Summarizer')}</strong>{L('는 긴 문서나 텍스트에서 핵심 문장만을 선별하여 간결한 요약본을 자동으로 생성하는 추출형 요약(Extractive Summarization) 도구입니다. 기존 원문의 문장 중에서 가장 중요한 것들을 골라내어 요약본을 만들기 때문에 원문의 의미가 왜곡되지 않고 정확한 정보 전달이 가능합니다.', ' is an extractive summarization tool that automatically generates a concise summary by selecting only the key sentences from a long document or text. It picks the most important sentences from the original, so the meaning is not distorted and information is conveyed accurately.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('이 도구는 뉴스 기사, 논문 초록, 비즈니스 보고서, 회의록, 블로그 포스트 등 다양한 텍스트를 빠르게 압축하고 싶을 때 매우 유용합니다. 특히 시간이 제한적인 전문가, 학생, 기자, 마케터 등 누구나 손쉽게 활용할 수 있으며, 웹 브라우저에서 바로 사용 가능하여 별도의 소프트웨어 설치가 필요하지 않습니다.', 'It is very useful for quickly compressing news articles, paper abstracts, business reports, minutes, and blog posts. Especially handy for time-pressed professionals, students, journalists, and marketers, it runs right in the browser with no software installation.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('한국어와 영어 텍스트를 모두 지원하며, 요약 길이를 짧게·보통·길게 세 가지 옵션으로 조절할 수 있습니다. 원본 텍스트의 단어 수 대비 요약 후 축소 비율도 함께 표시되어 요약 효율을 한눈에 파악할 수 있습니다. 완전한 AI 기반 요약은 아니지만, 일상적인 업무와 학습에서 빠르게 핵심 내용을 습득하는 데 충분한 성능을 제공합니다.', 'It supports both Korean and English text and lets you adjust the summary length among short, medium, and long. The reduction ratio versus the original word count is also shown, so you can see efficiency at a glance. Not a full AI summary, but capable enough to quickly grasp key points for daily work and study.')}
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('복잡한 설정 없이 텍스트를 붙여넣기만 하면 바로 결과를 확인할 수 있는 직관적인 인터페이스를 제공하며, 요약 결과는 원클릭으로 클립보드에 복사하여 다른 애플리케이션에 즉시 붙여넣기 할 수 있습니다.', 'It offers an intuitive interface — just paste text and see results immediately — and the summary can be copied to the clipboard with one click and pasted into other applications.')}
        </p>
        <TermGlossary items={[
          { term: L('추출형 요약(Extractive Summarization)', 'Extractive Summarization'), desc: L('원문에서 중요한 문장을 골라 그대로 모아 요약하는 방식입니다. 새로운 문장을 생성하는 추상형 요약과 달리 원문에 없는 내용이 추가되지 않습니다.', 'A method that gathers important sentences from the original as-is. Unlike abstractive summarization, it adds no content absent from the source.') },
          { term: L('불용어(Stop Words)', 'Stop Words'), desc: L('문장에서 실제 의미를 거의 갖지 않는 조사, 관사, 전치사 등의 단어입니다(예: 이, 가, the, a). 요약 시 핵심 단어 선별을 위해 제외합니다.', 'Words with little actual meaning in a sentence — particles, articles, prepositions (e.g. 이, 가, the, a). Excluded when selecting key words for summarization.') },
          { term: L('TF(Term Frequency)', 'TF (Term Frequency)'), desc: L('Term Frequency의 약자로, 특정 단어가 텍스트 전체에서 얼마나 자주 등장하는지를 나타내는 빈도입니다. 자주 등장할수록 핵심 주제일 가능성이 높다고 판단합니다.', 'Short for Term Frequency — how often a word appears in the whole text. The more frequent, the more likely it is a key topic.') },
        ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('요약 알고리즘 상세 설명:', 'Detailed Summary Algorithm:')}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {L('본 도구는 ', 'This tool uses a ')}<strong className="text-foreground">{L('TF(Term Frequency) 기반 문장 점수화 알고리즘', 'TF (Term Frequency) based sentence-scoring algorithm')}</strong>{L('을 사용합니다. 이는 자연어 처리에서 전통적으로 사용되는 효과적인 요약 기법으로, 텍스트에서 자주 등장하는 단어가 핵심 주제를 나타낸다는 원리에 기반합니다.', ' . A traditional and effective NLP summarization technique based on the principle that frequently appearing words represent the key topic.')}
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('1단계 - 문장 분리:', 'Step 1 - Sentence splitting:')}</strong> {L('마침표(.), 물음표(?), 느낌표(!), 한글 종결 어미(다, 요, 니다 등), 줄바꿈 문자를 기준으로 입력 텍스트를 개별 문장으로 분리합니다.', 'Split the input text into individual sentences using periods (.), question marks (?), exclamation marks (!), Korean sentence-ending forms (da, yo, nida, etc.), and line breaks.')}</p>
          <p><strong className="text-foreground">{L('2단계 - 전처리 및 불용어 제거:', 'Step 2 - Preprocessing & stop-word removal:')}</strong> {L('각 문장을 소문자로 변환하고, 한글 조사/어미(이, 가, 을, 를, 은, 는, 에, 의 등)와 영어 관사/전치사(the, a, is, of, in 등)를 불용어(Stop Words) 목록에서 제거합니다. 이 과정을 통해 실제 의미를 가진 핵심 단어만 남깁니다.', 'Lowercase each sentence and remove Korean particles/endings (i, ga, eul, reul, eun, neun, e, ui, etc.) and English articles/prepositions (the, a, is, of, in, etc.) using the stop-word list, leaving only meaningful key words.')}</p>
          <p><strong className="text-foreground">{L('3단계 - 단어 빈도수 계산:', 'Step 3 - Word frequency calculation:')}</strong> {L('불용어가 제거된 전체 단어들의 등장 횟수를 집계하여 각 단어의 빈도수(TF)를 계산합니다. 자주 등장할수록 높은 점수를 부여합니다.', 'Count occurrences of all remaining words to compute each word’s frequency (TF). More frequent words get higher scores.')}</p>
          <p><strong className="text-foreground">{L('4단계 - 문장 점수 산출:', 'Step 4 - Sentence scoring:')}</strong> {L('각 문장에 포함된 핵심 단어들의 빈도수를 합산하고, 문장 길이(단어 수)로 나누어 문장당 평균 점수를 계산합니다. 점수 = (문장 내 핵심 단어 빈도수 합) / (문장의 단어 수).', 'Sum the frequencies of key words in each sentence and divide by the sentence length (word count) to get the average score per sentence. Score = (sum of key-word frequencies) / (sentence word count).')}</p>
          <p><strong className="text-foreground">{L('5단계 - 상위 문장 선별 및 정렬:', 'Step 5 - Select & sort top sentences:')}</strong> {L('문장 점수가 높은 순서대로 상위 N개를 선택한 뒤, 원래 텍스트 내의 순서대로 다시 정렬하여 자연스러운 흐름의 요약문을 생성합니다.', 'Select the top N sentences by score, then re-sort them in original text order to produce a naturally flowing summary.')}</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">{L('요약 길이 기준:', 'Summary length criteria:')}</strong> {L('짧게 = 2문장, 보통 = 전체 문장의 약 30%, 길게 = 전체 문장의 약 50%가 선택됩니다. 입력 텍스트가 2문장 이하일 경우 요약 없이 원문이 그대로 반환됩니다.', 'Short = 2 sentences, Medium = about 30% of all sentences, Long = about 50%. If the input is 2 sentences or fewer, the original is returned unchanged.')}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">{L('효과적인 사용법과 팁:', 'Effective Usage and Tips:')}</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">{L('1. 충분한 분량의 텍스트를 입력하세요', '1. Enter a sufficient amount of text')}</p>
            <p>{L('최소 3문장 이상의 텍스트를 입력해야 의미 있는 요약이 생성됩니다. 1~2문장은 요약 대상이 없어 그대로 반환됩니다. 가능하면 10문장 이상의 텍스트를 입력하면 더 정확한 요약 결과를 얻을 수 있습니다.', 'At least 3 sentences are needed for a meaningful summary; 1–2 sentences are returned unchanged. Prefer 10+ sentences for more accurate results.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('2. 요약 길이를 목적에 맞게 선택하세요', '2. Choose summary length to fit your purpose')}</p>
            <p>{L('빠른 확인용이면 \'짧게\', 일반적인 요약이면 \'보통\', 상세한 요약이면 \'길게\'를 선택하세요. 원본 텍스트의 약 30%를 요약하는 \'보통\' 옵션이 가장 균형 잡힌 결과를 제공합니다.', 'Pick "Short" for quick checks, "Medium" for general summaries, "Long" for detailed ones. "Medium" (~30% of the original) gives the most balanced result.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('3. 주제가 명확한 텍스트일수록 효과적입니다', '3. More effective on single-topic text')}</p>
            <p>{L('뉴스 기사, 논문, 보고서 등 하나의 주제에 집중된 텍스트는 요약 품질이 높습니다. 여러 주제가 혼재된 텍스트는 주제별로 나누어 요약하는 것이 좋습니다.', 'News articles, papers, and reports focused on one topic yield higher quality. Mixed-topic text is better summarized per topic.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('4. 추출형 요약의 특성을 이해하세요', '4. Understand extractive summarization')}</p>
            <p>{L('이 도구는 원문에서 핵심 문장만 추출하는 추출형 요약입니다. 새로운 문장을 생성하는 추상형 요약과 달리, 원문에 없는 내용이 추가되지 않으므로 정보의 정확성이 보장됩니다.', 'This tool extracts key sentences from the original (extractive). Unlike abstractive summarization that generates new sentences, it adds no new content, guaranteeing accuracy.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('5. 여러 번 요약하여 결과를 비교하세요', '5. Summarize multiple times to compare')}</p>
            <p>{L('같은 텍스트로 요약 길이를 달리하여 여러 번 실행하면, 각각 다른 관점의 핵심 문장이 선택될 수 있습니다. 필요에 따라 가장 적합한 요약을 골라 사용하세요.', 'Running the same text with different lengths may select different key sentences. Pick the most suitable one for your need.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('6. 요약 결과를 재활용하세요', '6. Reuse the summary')}</p>
            <p>{L('복사 버튼을 활용하여 요약 결과를 바로 메일, 메모, 문서 등에 붙여넣기 할 수 있습니다. 요약된 내용을 다시 프롬프트 생성기나 번역 도구와 연계하여 활용하면 더욱 효율적입니다.', 'Use the copy button to paste the summary into email, notes, or documents. Linking it to a prompt generator or translator makes it even more efficient.')}</p>
          </div>
          <div>
            <p className="font-medium text-foreground">{L('7. 한국어와 영어 모두 활용 가능합니다', '7. Works for both Korean and English')}</p>
            <p>{L('한국어와 영어 텍스트 모두에서 동작하며, 불용어 목록도 두 언어에 최적화되어 있습니다. 혼합된 텍스트도 처리 가능하지만, 한 언어로된 텍스트일 때 요약 품질이 가장 좋습니다.', 'It works for both Korean and English, with stop-word lists optimized for both. Mixed text is supported, but single-language text gives the best quality.')}</p>
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

export default TextSummarizer;
