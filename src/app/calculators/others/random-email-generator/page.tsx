'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Trash2 } from 'lucide-react';

const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'naver.com', 'daum.net'] as const;
type DomainOption = (typeof DOMAINS)[number] | 'custom' | 'random';

const ADJECTIVES = [
  'happy', 'sunny', 'lucky', 'clever', 'brave', 'swift', 'calm', 'eager', 'fair', 'kind',
  'bold', 'cool', 'dark', 'deep', 'fast', 'free', 'gold', 'gray', 'huge', 'keen',
  'long', 'mild', 'neat', 'rich', 'rose', 'safe', 'tall', 'thin', 'true', 'warm',
  'wild', 'wise', 'blue', 'cyan', 'lime', 'pink', 'red', 'teal', 'wine', 'coral',
];

const NOUNS = [
  'tiger', 'eagle', 'river', 'stone', 'cloud', 'flame', 'storm', 'pearl', 'tiger', 'wolf',
  'bear', 'hawk', 'lion', 'fox', 'deer', 'swan', 'moon', 'star', 'wind', 'rain',
  'snow', 'fire', 'wave', 'rock', 'tree', 'leaf', 'rose', 'lily', 'iris', 'vale',
  'lake', 'hill', 'cape', 'gate', 'ford', 'port', 'dale', 'field', 'grove', 'marsh',
];

const RandomEmailGenerator: React.FC = () => {
  const [domain, setDomain] = useState<DomainOption>('random');
  const [customDomain, setCustomDomain] = useState('');
  const [count, setCount] = useState(5);
  const [generatedEmails, setGeneratedEmails] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomEmail = useCallback((useCustom: boolean, customDom: string): string => {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(Math.random() * 9999);
    const username = `${adj}${noun}${num}`;

    let selectedDomain: string;
    if (useCustom && customDom.trim()) {
      selectedDomain = customDom.trim().replace('@', '');
    } else if (domain === 'random') {
      selectedDomain = DOMAINS[Math.floor(Math.random() * DOMAINS.length)];
    } else {
      selectedDomain = domain;
    }

    return `${username}@${selectedDomain}`;
  }, [domain]);

  const handleGenerate = () => {
    const emails: string[] = [];
    const useCustom = domain === 'custom';
    for (let i = 0; i < count; i++) {
      emails.push(generateRandomEmail(useCustom, customDomain));
    }
    setGeneratedEmails(emails);
    setCopiedIndex(null);
  };

  const handleCopy = async (email: string, index: number) => {
    await navigator.clipboard.writeText(email);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedEmails.join('\n'));
  };

  const handleClear = () => {
    setGeneratedEmails([]);
    setCopiedIndex(null);
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">도메인 선택</label>
        <select
          value={domain}
          onChange={(e) => setDomain(e.target.value as DomainOption)}
          className="w-full border rounded-md px-3 py-2 bg-background"
        >
          <option value="random">랜덤 선택</option>
          {DOMAINS.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
          <option value="custom">커스텀 도메인</option>
        </select>
      </div>

      {domain === 'custom' && (
        <div>
          <label className="block text-sm font-medium mb-1">커스텀 도메인</label>
          <Input
            type="text"
            placeholder="example.com"
            value={customDomain}
            onChange={(e) => setCustomDomain(e.target.value)}
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-1">생성 개수</label>
        <Input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => setCount(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
        />
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleGenerate}>이메일 생성</Button>
        <Button variant="secondary" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-1" /> 초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {generatedEmails.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">이메일을 생성해주세요.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{generatedEmails.length}개 생성됨</span>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="w-4 h-4 mr-1" /> 전체 복사
            </Button>
          </div>
          {generatedEmails.map((email, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <code className="flex-1 text-sm font-mono break-all select-all">{email}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(email, index)}
                className="shrink-0"
              >
                {copiedIndex === index ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          ))}
        </>
      )}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>랜덤 이메일 생성기</strong>는 테스트, 서비스 가입, 프라이버시 보호 등에 사용할 무작위 이메일 주소를 만드는 도구입니다. 인기 도메인(gmail, yahoo, outlook, naver, daum 등) 중 선택하거나 커스텀 도메인을 입력해 원하는 형식의 주소를 생성합니다.
        </p>
        <p>
          영문 형용사·명사 풀과 숫자를 조합해 자연스럽고 기억하기 쉬운 사용자명을 만들므로, 개발과 QA 과정에서 더미 계정을 대량으로 발급할 때 유용합니다. 최대 50개까지 한 번에 생성할 수 있습니다.
        </p>
        <p>
          개발자와 테스터에게는 이메일 발송 기능 검증용으로, 일반 사용자에게는 불필요한 사이트 가입 시 일회용 주소처럼 활용되는 프라이버시 도구로 유용합니다. 생성 결과는 클립보드로 바로 복사됩니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          이 도구로 만든 이메일은 실제로 존재하거나 수신 가능한 주소가 아닙니다. 실제 가입이나 메일 수신이 필요한 경우 별도의 임시 메일 서비스나 정식 계정을 사용하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">구조</h4>
          <p>이메일은 사용자명@도메인 형식이며, 사용자명은 형용사+명사+숫자의 조합입니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">이메일 = 형용사 + 명사 + 숫자 @ 도메인</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">가능한 조합 수</h4>
          <p>형용사 A개, 명사 N개, 숫자 0~9999일 때 가능한 사용자명 총수는 다음과 같습니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">조합 수 = A × N × 10,000</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">도메인 선택</h4>
          <p>사용자가 고른 도메인 또는 커스텀 도메인을 사용자명에 결합합니다.</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">return username + "@" + domain</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">테스트 계정</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>앱·웹사이트 QA용 더미 이메일을 대량 발급하세요.</li>
            <li>회원가입 플로우 검증에 적합합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">프라이버시 보호</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>신뢰하기 어려운 사이트 가입 시 일회용처럼 활용하세요.</li>
            <li>중요 계정에는 사용하지 마세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">개발자 도구</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>이메일 발송·수신 로직 테스트에 활용하세요.</li>
            <li>마케팅 뉴스레터 발송 테스트 목록 생성에 유용합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">도메인 형식</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>커스텀 도메인은 example.com 형식으로 정확히 입력하세요.</li>
            <li>@ 기호는 자동으로 처리됩니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">검증 필요</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>실제 가입에는 정규식 검증 후 사용하세요.</li>
            <li>생성 주소는 수신이 불가능합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">대량 생성</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>한 번에 최대 50개까지 생성 가능합니다.</li>
            <li>전체 복사로 시트나 DB에 바로 붙여넣기 하세요.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="랜덤 이메일 생성기"
      description="테스트 및 프라이버시 목적으로 사용할 랜덤 이메일 주소를 생성합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RandomEmailGenerator;
