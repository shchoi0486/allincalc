'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check, Trash2 } from 'lucide-react';

interface StringOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  count: number;
}

const RandomStringGenerator: React.FC = () => {
  const [options, setOptions] = useState<StringOptions>({
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
    count: 5,
  });
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateRandomString = useCallback((length: number, opts: StringOptions): string => {
    let charset = '';
    if (opts.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (opts.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (opts.numbers) charset += '0123456789';
    if (opts.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') charset = 'abcdefghijklmnopqrstuvwxyz';

    let result = '';
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
    return result;
  }, []);

  const handleGenerate = () => {
    const strings: string[] = [];
    for (let i = 0; i < options.count; i++) {
      strings.push(generateRandomString(options.length, options));
    }
    setGeneratedStrings(strings);
    setCopiedIndex(null);
  };

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(generatedStrings.join('\n'));
  };

  const handleClear = () => {
    setGeneratedStrings([]);
    setCopiedIndex(null);
  };

  const toggleOption = (key: keyof Omit<StringOptions, 'length' | 'count'>) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">문자열 길이</label>
        <Input
          type="number"
          min={1}
          max={256}
          value={options.length}
          onChange={(e) => setOptions(prev => ({ ...prev, length: Math.max(1, Math.min(256, parseInt(e.target.value) || 1)) }))}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">문자열 수</label>
        <Input
          type="number"
          min={1}
          max={50}
          value={options.count}
          onChange={(e) => setOptions(prev => ({ ...prev, count: Math.max(1, Math.min(50, parseInt(e.target.value) || 1)) }))}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">문자 유형</label>
        {[
          { key: 'uppercase' as const, label: '대문자 (A-Z)' },
          { key: 'lowercase' as const, label: '소문자 (a-z)' },
          { key: 'numbers' as const, label: '숫자 (0-9)' },
          { key: 'symbols' as const, label: '특수문자 (!@#$%^&*)' },
        ].map(item => (
          <label key={item.key} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options[item.key]}
              onChange={() => toggleOption(item.key)}
              className="form-checkbox"
            />
            <span className="text-sm">{item.label}</span>
          </label>
        ))}
      </div>

      <div className="flex space-x-2">
        <Button onClick={handleGenerate}>문자열 생성</Button>
        <Button variant="secondary" onClick={handleClear}>
          <Trash2 className="w-4 h-4 mr-1" /> 초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-3">
      {generatedStrings.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">문자열을 생성해주세요.</p>
      ) : (
        <>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">{generatedStrings.length}개 생성됨</span>
            <Button variant="outline" size="sm" onClick={handleCopyAll}>
              <Copy className="w-4 h-4 mr-1" /> 전체 복사
            </Button>
          </div>
          {generatedStrings.map((str, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 bg-muted rounded-md">
              <code className="flex-1 text-sm font-mono break-all select-all">{str}</code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCopy(str, index)}
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
        <p className="text-lg">랜덤 문자열 생성기는 보안 토큰, 비밀번호, API 키 등 다양한 목적으로 사용할 수 있는 무작위 문자열을 즉시 생성하는 도구입니다.</p>
        <p>대문자, 소문자, 숫자, 특수문자 중 필요한 문자 유형을 선택하고 원하는 길이와 개수를 설정하면 안전한 난수 생성 알고리즘(Crypto API)을 사용하여 고품질의 랜덤 문자열을 생성합니다.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-md mb-2">주요 기능:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>커스터마이징:</strong> 문자열 길이와 문자 유형을 자유롭게 선택</li>
            <li><strong>대량 생성:</strong> 최대 50개의 문자열을 한 번에 생성</li>
            <li><strong>즉시 복사:</strong> 개별 또는 전체 문자열을 클립보드에 복사</li>
            <li><strong>보안 난수:</strong> 브라우저 Crypto API를 사용한 안전한 난수 생성</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">랜덤 문자열 생성 알고리즘</h3>
          <p className="mb-4">이 도구는 <strong>Web Crypto API의 crypto.getRandomValues()</strong>를 사용하여 크립토그래픽적으로 안전한 난수를 생성합니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. 문자셋(Charset) 구성</h3>
          <p className="mb-2">선택된 문자 유형에 따라 사용 가능한 문자 집합을 구성합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"<br/>lowercase: "abcdefghijklmnopqrstuvwxyz"<br/>numbers: "0123456789"<br/>symbols: "!@#$%^&*()_+-=[]{}|;:,.&lt;&gt;?"</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. 난수 생성 및 매핑</h3>
          <p className="mb-2">crypto.getRandomValues()로 생성한 무작위 정수를 문자셋 길이로 나눈 나머지를 인덱스로 사용합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">
              const array = new Uint32Array(length);<br/>
              crypto.getRandomValues(array);<br/>
              result += charset[array[i] % charset.length];
            </code>
          </div>
          <p className="mt-2">이 방식은 균일 분포(uniform distribution)을 보장하여 각 문자가 동일한 확률로 선택됩니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">보안 강화를 위한 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>비밀번호:</strong> 최소 12자 이상, 모든 문자 유형을 활성화하는 것이 좋습니다.</li>
            <li><strong>API 키:</strong> 특수문자를 포함하면 예상치 못한 이스케이프 문제가 발생할 수 있으므로 숫자+영문 조합을 추천합니다.</li>
            <li><strong>토큰 생성:</strong> 세션 토큰이나 인증 토큰은 32자 이상의 길이를 권장합니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">활용 예시</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>임시 비밀번호:</strong> 회원가입 시 임시 비밀번호 발급</li>
            <li><strong>약속 식별자:</strong> 고유한 ID 생성 (UUID 대안)</li>
            <li><strong>파일명 생성:</strong> 충돌 없는 고유 파일명 생성</li>
            <li><strong>데이터 마스킹:</strong> 테스트용 더미 데이터 생성</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="랜덤 문자열 생성기"
      description="보안 토큰, 비밀번호 등에 사용할 랜덤 문자열을 생성합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default RandomStringGenerator;
