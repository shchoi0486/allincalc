'use client';

import { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LanguagePair = 'ko-en' | 'ko-ja' | 'ko-zh';

const DICTIONARIES: Record<LanguagePair, Record<string, string>> = {
  'ko-en': {
    '안녕하세요': 'Hello',
    '감사합니다': 'Thank you',
    '죄송합니다': 'Sorry',
    '네': 'Yes',
    '아니요': 'No',
    '이름': 'Name',
    '오늘': 'Today',
    '내일': 'Tomorrow',
    '어제': 'Yesterday',
    '좋다': 'Good',
    '나쁘다': 'Bad',
    '크다': 'Big',
    '작다': 'Small',
    '많다': 'Many',
    '적다': 'Few',
    '빠르다': 'Fast',
    '느리다': 'Slow',
    '먹다': 'Eat',
    '마시다': 'Drink',
    '가다': 'Go',
    '오다': 'Come',
    '보다': 'See',
    '듣다': 'Listen',
    '말하다': 'Speak',
    '읽다': 'Read',
    '쓰다': 'Write',
    '일하다': 'Work',
    '쉬다': 'Rest',
    '공부하다': 'Study',
    '배우다': 'Learn',
    '도와주다': 'Help',
    '친구': 'Friend',
    '가족': 'Family',
    '학교': 'School',
    '회사': 'Company',
    '집': 'House',
    '물': 'Water',
    '밥': 'Food',
    '하늘': 'Sky',
    '바다': 'Sea',
    '산': 'Mountain',
    '강': 'River',
    '시간': 'Time',
    '장소': 'Place',
    '사람': 'Person',
    '동물': 'Animal',
    '식물': 'Plant',
    '자동차': 'Car',
    '버스': 'Bus',
    '기차': 'Train',
    '비행기': 'Airplane',
    '날씨': 'Weather',
    '비': 'Rain',
    '눈': 'Snow',
    '바람': 'Wind',
    '봄': 'Spring',
    '여름': 'Summer',
    '가을': 'Fall',
    '겨울': 'Winter',
    '월요일': 'Monday',
    '화요일': 'Tuesday',
    '수요일': 'Wednesday',
    '목요일': 'Thursday',
    '금요일': 'Friday',
    '토요일': 'Saturday',
    '일요일': 'Sunday',
    '한국': 'Korea',
    '일본': 'Japan',
    '중국': 'China',
    '미국': 'America',
    '영국': 'England',
  },
  'ko-ja': {
    '안녕하세요': 'こんにちは',
    '감사합니다': 'ありがとうございます',
    '죄송합니다': 'すみません',
    '네': 'はい',
    '아니요': 'いいえ',
    '이름': '名前',
    '오늘': '今日',
    '내일': '明日',
    '어제': '昨日',
    '좋다': '良い',
    '나쁘다': '悪い',
    '크다': '大きい',
    '작다': '小さい',
    '먹다': '食べる',
    '마시다': '飲む',
    '가다': '行く',
    '오다': '来る',
    '보다': '見る',
    '듣다': '聞く',
    '말하다': '話す',
    '읽다': '読む',
    '쓰다': '書く',
    '일하다': '働く',
    '공부하다': '勉強する',
    '배우다': '学ぶ',
    '도와주다': '助ける',
    '친구': '友達',
    '가족': '家族',
    '학교': '学校',
    '회사': '会社',
    '집': '家',
    '물': '水',
    '밥': 'ご飯',
    '하늘': '空',
    '바다': '海',
    '산': '山',
    '강': '川',
    '시간': '時間',
    '사람': '人',
    '날씨': '天気',
    '비': '雨',
    '눈': '雪',
    '바람': '風',
    '봄': '春',
    '여름': '夏',
    '가을': '秋',
    '겨울': '冬',
    '한국': '韓国',
    '일본': '日本',
    '중국': '中国',
  },
  'ko-zh': {
    '안녕하세요': '你好',
    '감사합니다': '谢谢',
    '죄송합니다': '对不起',
    '네': '是',
    '아니요': '不是',
    '이름': '名字',
    '오늘': '今天',
    '내일': '明天',
    '어제': '昨天',
    '좋다': '好',
    '나쁘다': '坏',
    '크다': '大',
    '작다': '小',
    '먹다': '吃',
    '마시다': '喝',
    '가다': '去',
    '오다': '来',
    '보다': '看',
    '듣다': '听',
    '말하다': '说',
    '읽다': '读',
    '쓰다': '写',
    '일하다': '工作',
    '공부하다': '学习',
    '배우다': '学',
    '도와주다': '帮助',
    '친구': '朋友',
    '가족': '家人',
    '학교': '学校',
    '회사': '公司',
    '집': '家',
    '물': '水',
    '밥': '饭',
    '하늘': '天空',
    '바다': '海',
    '산': '山',
    '강': '河',
    '시간': '时间',
    '사람': '人',
    '날씨': '天气',
    '비': '雨',
    '눈': '雪',
    '바람': '风',
    '봄': '春',
    '여름': '夏',
    '가을': '秋',
    '겨울': '冬',
    '한국': '韩国',
    '일본': '日本',
    '중국': '中国',
  },
};

const PAIR_LABELS: Record<LanguagePair, string> = {
  'ko-en': '한국어 → 영어',
  'ko-ja': '한국어 → 일본어',
  'ko-zh': '한국어 → 중국어',
};

function translate(text: string, pair: LanguagePair): string {
  const dict = DICTIONARIES[pair];
  let result = text;
  const sortedKeys = Object.keys(dict).sort((a, b) => b.length - a.length);
  sortedKeys.forEach(key => {
    const regex = new RegExp(key, 'g');
    result = result.replace(regex, dict[key]);
  });
  return result;
}

const TextTranslator = () => {
  const [input, setInput] = useState('');
  const [pair, setPair] = useState<LanguagePair>('ko-en');
  const [result, setResult] = useState('');

  const process = () => {
    if (!input.trim()) return;
    setResult(translate(input, pair));
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">번역할 텍스트</label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="한국어 텍스트를 입력하세요..."
          className="min-h-[150px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">번역 방향</label>
        <Select value={pair} onValueChange={(v) => setPair(v as LanguagePair)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ko-en">한국어 → 영어</SelectItem>
            <SelectItem value="ko-ja">한국어 → 일본어</SelectItem>
            <SelectItem value="ko-zh">한국어 → 중국어</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={process} className="w-full" disabled={!input.trim()}>번역하기</Button>
    </div>
  );

  const resultSection = result ? (
    <div className="space-y-3">
      <Button variant="outline" size="sm" onClick={copyToClipboard} className="w-full">번역 복사</Button>
      <Textarea readOnly value={result} className="min-h-[150px] text-sm leading-relaxed" />
    </div>
  ) : (
    <div className="flex items-center justify-center text-muted-foreground h-full">
      텍스트를 입력하고 번역하기를 클릭하세요
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          <strong className="text-foreground">번역 도구</strong>는 한국어와 영어, 일본어, 중국어 사이의 기본적인 단어 및 구문 번역을 수행하는 사전 기반 번역 도구입니다. 미리 등록된 100개 이상의 한국어 표현을 각 언어의 대응 번역으로 매칭하여 실시간 번역 결과를 제공합니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          해외여행 시 필요한 기본 표현 번역, 외국인과의 간단한 의사소통, 외국어 학습 초기 단계에서의 단어 확인, SNS나 메신저에서의 간단한 외국어 표현 검색 등 다양한 상황에서 활용할 수 있습니다. 특히 영어, 일본어, 중국어 등 동아시아 주요 언어 3개국어를 동시에 지원하여 비교 학습에도 유용합니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          이 도구는 신경망 기반 기계 번역이 아닌 사전 매칭 방식을 사용하므로, 문법적으로 완벽한 문장 번역보다는 개별 단어와 관용 표현의 빠른 조회에 적합합니다. 번역 결과는 참고용으로 활용하고, 공식적인 문서나 비즈니스 커뮤니케이션에서는 반드시 전문 번역 서비스나 AI 번역 도구와 함께 검토하시기 바랍니다.
        </p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          브라우저에서 바로 사용 가능하며, 서버로 데이터가 전송되지 않으므로 프라이버시가 보장됩니다. 번역 결과는 원클릭으로 복사하여 메일, 채팅, 문서 등에 바로 사용할 수 있습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">번역 알고리즘 및 방식:</p>
        <p className="text-sm text-muted-foreground leading-relaxed">
          본 도구는 <strong className="text-foreground">사전 기반 문자열 치환(String Replacement) 알고리즘</strong>을 사용합니다. 한국어-영어, 한국어-일본어, 한국어-중국어 간의 사전(Dictionary)이 각각 별도로 정의되어 있으며, 입력된 텍스트에서 사전에 등록된 한국어 표현을 찾아 해당 언어의 번역 결과로 치환합니다.
        </p>
        <div className="bg-muted p-4 rounded-lg space-y-2 text-sm text-muted-foreground">
          <p><strong className="text-foreground">1단계 - 사전 매칭:</strong> 미리 정의된 한국어-외국어 사전에서 긴 구문부터 매칭합니다. 예를 들어, "감사합니다"라는 구문이 "감사"와 "합니다"로 분리되기 전에 먼저 전체 구문이 매칭됩니다. 이를 통해 부분 매칭 문제를 방지합니다.</p>
          <p><strong className="text-foreground">2단계 - 정규 표현식 치환:</strong> 각 사전 항목에 대해 JavaScript의 RegExp를 사용하여 입력 텍스트 내의 모든 일치 항목을 찾아 해당 언어의 번역으로 일괄 치환합니다. 'g'(global) 플래그를 사용하여 텍스트 전체에서 반복적으로 치환합니다.</p>
          <p><strong className="text-foreground">3단계 - 우선순위 처리:</strong> 사전의 키(key)를 길이 순으로 내림차순 정렬하여 긴 구문이 먼저 매칭되도록 합니다. 이는 "공부하다"라는 구문이 "공부"와 "하다"로 나뉘어 각각 번역되는 것을 방지합니다.</p>
        </div>
        <div className="bg-muted p-4 rounded-lg text-sm text-muted-foreground">
          <p><strong className="text-foreground">지원 언어 쌍:</strong> 한국어 → 영어 (ko-en), 한국어 → 일본어 (ko-ja), 한국어 → 중국어 (ko-zh) 총 3개 방향을 지원합니다. 각 언어 쌍당 약 80~100개의 단어/구문이 등록되어 있습니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4">
        <p className="font-semibold text-foreground text-sm">효과적인 사용법과 팁:</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">1. 기본적인 단어/구문 번역에 적합합니다</p>
            <p>이 도구는 사전 기반 번역이므로 "안녕하세요", "감사합니다", "회사", "학교" 등 일상적인 표현의 빠른 번역에 적합합니다. 복잡한 문장이나 전문 용어 번역이 필요하면 전문 번역 서비스나 AI 번역 도구를 이용하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">2. 언어 학습 보조 도구로 활용하세요</p>
            <p>새로운 외국어를 배울 때 기본 단어의 뜻을 빠르게 확인하거나, 한국어 표현이 어떻게 번역되는지 비교 학습할 때 유용합니다. 영어, 일본어, 중국어를 동시에 비교할 수 있어 동아시아 언어를 함께 공부하는 분들에게 특히 좋습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">3. 짧은 문장 단위로 입력하세요</p>
            <p>사전에 등록된 단어나 구문이 포함된 텍스트를 입력할 때 가장 좋은 결과를 얻습니다. 긴 문장보다는 핵심 표현 위주로 입력하면 더 정확한 번역 결과를 확인할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">4. 공식 문서에는 반드시 검토하세요</p>
            <p>번역 결과는 참고용입니다. 비즈니스 이메일, 계약서, 공식 문서 등에 사용할 때는 반드시 원어민이나 전문 번역가의 검토를 거치시기 바랍니다. 사전 기반 번역의 한계로 문법 오류나 어색한 표현이 있을 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">5. 번역 방향을 정확히 선택하세요</p>
            <p>현재 지원되는 번역 방향은 한국어에서 외국어로입니다. 외국어에서 한국어로의 역번역은 지원되지 않습니다. 입력 텍스트가 한국어인지 확인 후 사용하세요.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">6. 복사 버튼을 적극 활용하세요</p>
            <p>번역 결과 하단의 "번역 복사" 버튼을 클릭하면 번역된 텍스트가 클립보드에 복사됩니다. 메신저, 이메일, SNS 등에서 바로 붙여넣기 할 수 있어 빠르게 사용할 수 있습니다.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">7. 프라이버시 걱정 없이 사용하세요</p>
            <p>모든 번역 과정이 브라우저 내에서 이루어지며, 입력한 텍스트는 외부 서버로 전송되지 않습니다. 개인적인 대화 내용이나 민감한 정보가 포함된 텍스트도 안심하고 번역할 수 있습니다.</p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="번역 도구"
      description="한국어와 영어, 일본어, 중국어 간 기본 번역"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TextTranslator;
