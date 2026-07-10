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
        <p className="text-lg">랜덤 이메일 생성기는 테스트, 가입, 또는 프라이버시 보호 목적으로 사용할 수 있는 무작위 이메일 주소를 생성하는 도구입니다.</p>
        <p>인기 있는 이메일 도메인(gmail, yahoo, outlook 등) 중 선택하거나 커스텀 도메인을 입력하여 원하는 형식의 이메일을 생성할 수 있습니다. 영문 형용사, 명사, 숫자를 조합하여 자연스럽고 기억하기 쉬운 이메일 주소를 만듭니다.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-md mb-2">주요 기능:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>다양한 도메인:</strong> Gmail, Yahoo, Outlook 등 인기 도메인 지원</li>
            <li><strong>커스텀 도메인:</strong> 원하는 도메인을 직접 입력 가능</li>
            <li><strong>자연스러운 형식:</strong> 형용사+명사+숫자 조합으로 자연스러운 이메일 생성</li>
            <li><strong>대량 생성:</strong> 최대 50개 이메일을 한 번에 생성</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">랜덤 이메일 생성 구조</h3>
          <p className="mb-4">이메일은 <strong>사용자명@도메인</strong> 형식으로 구성되며, 사용자명은 형용사 + 명사 + 숫자의 조합으로 생성됩니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. 사용자명(Username) 생성</h3>
          <p className="mb-2">영문 형용사 풀과 명사 풀에서 무작위로 선택하고, 0~9999 사이의 숫자를 추가합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">
              const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];<br/>
              const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];<br/>
              const num = Math.floor(Math.random() * 9999);<br/>
              const username = `${'{adj}'}${'{noun}'}${'{num}'}`;
            </code>
          </div>
          <p className="mt-2">예: happyTiger42, cleverMoon1337, swiftCloud88</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. 도메인 선택</h3>
          <p className="mb-2">사용자가 선택한 도메인 또는 커스텀 도메인을 사용자명에 결합합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">return `${'{username}'}@${'{selectedDomain}'}`;</code>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">활용 시나리오</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>테스트 계정:</strong> 앱/웹사이트 테스트용 더미 이메일 생성</li>
            <li><strong>프라이버시 보호:</strong> 불필요한 사이트 가입 시 일회용 이메일 사용</li>
            <li><strong>개발자 도구:</strong> 이메일 발송 기능 테스트</li>
            <li><strong>마케팅 샘플:</strong> 뉴스레터 발송 테스트용 목록 생성</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">주의사항</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>이 도구로 생성된 이메일은 실제 존재하지 않는 주소입니다.</li>
            <li>실제 이메일 발송이 필요한 경우 정규 표현식 검증 후 사용하세요.</li>
            <li>커스텀 도메인 사용 시 도메인 형식(예: example.com)을 정확히 입력하세요.</li>
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
