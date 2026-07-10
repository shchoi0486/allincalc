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
        <p>
          <strong>랜덤 문자열 생성기</strong>는 보안 토큰, 비밀번호, API 키, 임시 ID 등에 사용할 무작위 문자열을 즉시 만들어 주는 도구입니다. 대문자·소문자·숫자·특수문자 중 필요한 문자 유형을 선택하고 길이와 개수를 설정하면, 암호학적으로 안전한 난수 생성 알고리즘으로 고품질 문자열을 생성합니다.
        </p>
        <p>
          회원가입 임시 비밀번호 발급, 세션·인증 토큰 생성, 테스트용 더미 데이터 작성, 충돌 없는 파일명 생성 등 개발과 운영 전반에서 활용됩니다. 특히 보안이 중요한 키 값은 예측 불가능한 난수가 필수적입니다.
        </p>
        <p>
          개발자와 서비스 운영자에게는 필수 유틸리티로, 일반 사용자에게는 안전한 비밀번호를 만드는 도구로 유용합니다. 생성된 문자열은 클립보드로 바로 복사할 수 있어 편리합니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          이 도구는 브라우저의 Web Crypto API(crypto.getRandomValues)를 사용하므로 일반 난수보다 예측이 어렵습니다. 다만 생성된 값은 화면에만 표시되고 저장되지 않으므로, 중요한 키는 별도 보안 장소에 보관하세요.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">문자셋 구성</h4>
          <p>선택한 문자 유형에 따라 사용 가능한 문자 집합을 만듭니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">uppercase + lowercase + numbers + symbols</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">가능한 조합 수</h4>
          <p>길이 L, 문자셋 크기 N일 때 가능한 문자열의 총수는 다음과 같습니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">조합 수 = N^L</p>
          </div>
          <p className="text-sm text-muted-foreground">예: 문자 62개, 길이 16 → 62^16 ≈ 4.7×10²⁸개</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">난수 매핑</h4>
          <p>crypto.getRandomValues로 만든 무작위 정수를 문자셋 길이로 나눈 나머지를 인덱스로 사용합니다.</p>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">result += charset[random % charset.length]</p>
          </div>
          <p>이 방식은 각 문자가 동일한 확률로 선택되는 균일 분포를 보장합니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">비밀번호 길이</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>중요 계정은 최소 12자, 권장 16자 이상을 사용하세요.</li>
            <li>모든 문자 유형을 활성화할수록 강도가 올라갑니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">API 키 생성</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>특수문자는 이스케이프 문제가 생길 수 있으므로 숫자+영문 조합을 추천합니다.</li>
            <li>세션·인증 토큰은 32자 이상을 권장합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">재사용 금지</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>같은 문자열을 여러 곳에 재사용하지 마세요.</li>
            <li>유출 의심 시 즉시 새 것으로 교체하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">안전한 보관</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>생성값은 저장되지 않으므로 비밀번호 관리자를 이용하세요.</li>
            <li>화면 캡처나 로그에 남지 않도록 주의하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">테스트 데이터</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>더미 데이터와 파일명 생성에 대량 생성을 활용하세요.</li>
            <li>개수는 한 번에 최대 50개까지 가능합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">복잡도 조절</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>사용처에 따라 특수문자 포함 여부를 조절하세요.</li>
            <li>가독성이 필요하면 숫자+영문 조합이 적당합니다.</li>
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
