'use client';

import React, { useState, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let charset = '';
    let result = '';

    if (useUppercase) charset += uppercase;
    if (useLowercase) charset += lowercase;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;

    if (charset === '') {
      setPassword('문자 집합을 선택해주세요');
      return;
    }

    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
    setCopied(false);
  }, [length, useUppercase, useLowercase, useNumbers, useSymbols]);

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = password;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStrength = (): { label: string; color: string; percent: number } => {
    let score = 0;
    if (length >= 8) score++;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 24) score++;
    if (useUppercase) score++;
    if (useLowercase) score++;
    if (useNumbers) score++;
    if (useSymbols) score++;

    const types = [useUppercase, useLowercase, useNumbers, useSymbols].filter(Boolean).length;
    if (types >= 3) score++;
    if (types === 4) score++;

    if (score <= 3) return { label: '약함', color: 'bg-red-500', percent: 25 };
    if (score <= 5) return { label: '보통', color: 'bg-orange-500', percent: 50 };
    if (score <= 7) return { label: '강함', color: 'bg-blue-500', percent: 75 };
    return { label: '매우 강함', color: 'bg-green-500', percent: 100 };
  };

  const strength = getStrength();

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-28">길이: {length}</label>
        <input
          type="range"
          min={8}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="flex-1"
        />
        <span className="w-10 text-center">{length}</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useUppercase}
            onChange={(e) => setUseUppercase(e.target.checked)}
            className="form-checkbox"
          />
          <span>대문자 (A-Z)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useLowercase}
            onChange={(e) => setUseLowercase(e.target.checked)}
            className="form-checkbox"
          />
          <span>소문자 (a-z)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useNumbers}
            onChange={(e) => setUseNumbers(e.target.checked)}
            className="form-checkbox"
          />
          <span>숫자 (0-9)</span>
        </label>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useSymbols}
            onChange={(e) => setUseSymbols(e.target.checked)}
            className="form-checkbox"
          />
          <span>기호 (!@#$%)</span>
        </label>
      </div>

      <div className="flex space-x-2">
        <Button onClick={generatePassword}>비밀번호 생성</Button>
        <Button variant="secondary" onClick={() => { setPassword(''); setCopied(false); }}>
          초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {password ? (
        <>
          <div className="flex items-center space-x-2">
            <Input
              value={password}
              readOnly
              className="font-mono text-lg flex-1"
            />
            <Button onClick={copyToClipboard} variant={copied ? 'default' : 'outline'}>
              {copied ? '복사됨!' : '복사'}
            </Button>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between mb-2">
                <span>비밀번호 강도:</span>
                <span className="font-bold">{strength.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`${strength.color} h-3 rounded-full transition-all duration-300`}
                  style={{ width: `${strength.percent}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="text-sm text-muted-foreground">
            <p>글자 수: {password.length}자</p>
            <p>선택된 문자 유형: {[useUppercase && '대문자', useLowercase && '소문자', useNumbers && '숫자', useSymbols && '기호'].filter(Boolean).join(', ')}</p>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          비밀번호 생성 버튼을 눌러주세요
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          강력하고 안전한 랜덤 비밀번호를 즉시 생성하세요!
        </p>
        <p>
          비밀번호 생성기는 대문자, 소문자, 숫자, 특수문자 조합과 길이 설정을 통해
          해킹이나 무차별 대입 공격으로부터 안전한 비밀번호를 손쉽게 만들어주는 필수 보안 도구입니다.
        </p>
        <p>
          브라우저의 Web Crypto API를 사용하여 cryptographically secure한 랜덤 값을 생성하므로
          예측이 불가능한 고품질의 비밀번호를 제공합니다. 비밀번호 강도를 실시간으로 분석하여
          현재 생성된 비밀번호의 보안 수준을直观적으로 확인할 수 있습니다.
        </p>
        <p>
          웹사이트, 이메일, 은행 업무 등 온라인에서 여러 계정을 관리하는 모든 사용자에게
          매번 다른 강력한 비밀번호를 생성하여 보안을 강화하는 데 유용합니다.
        </p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">랜덤 비밀번호 생성 원리</h3>
          <p className="mb-2 text-muted-foreground">
            사용자가 선택한 문자 집합에서 지정된 길이만큼 무작위로 문자를 선택하여 비밀번호를 생성합니다.
          </p>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">crypto.getRandomValues(new Uint32Array(length))</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Web Crypto API의 crypto.getRandomValues()를 사용하여 cryptographically secure한 난수를 생성합니다.
            이는 일반적인 Math.random()보다 훨씬 더 안전하여 보안이 중요한 환경에 적합합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">비밀번호 강도 계산</h3>
          <p className="text-muted-foreground">
            비밀번호 길이, 문자 유형 수(대문자, 소문자, 숫자, 기호), 조합 다양성을 종합적으로 분석하여
            '약함', '보통', '강함', '매우 강함' 4단계로 판정합니다.
          </p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">비밀번호 보안 핵심 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>최소 12자 이상 사용하세요:</strong> 8자 이하의 비밀번호는 무차별 대입 공격에 취약합니다.</li>
            <li><strong>대문자, 소문자, 숫자, 특수문자를 모두 조합하세요:</strong> 문자 유형이 많을수록 브루트포스 공격 시간이 기하급수적으로 증가합니다.</li>
            <li><strong>개인정보를 포함하지 마세요:</strong> 생년월일, 이름, 전화번호 등 공개된 정보는 비밀번호에 절대 넣지 마세요.</li>
            <li><strong>각 사이트마다 다른 비밀번호를 사용하세요:</strong> 하나가 유출되더라도 다른 계정까지 연쇄 피해를 막을 수 있습니다.</li>
            <li><strong>비밀번호 관리자를 활용하세요:</strong> 여러 비밀번호를 안전하게 관리하고 자동 입력해 주는 비밀번호 관리자가 가장 안전합니다.</li>
            <li><strong>2단계 인증(2FA)을 활성화하세요:</strong> 비밀번호 외에 추가 인증 수단을 설정하면 보안이 크게 강화됩니다.</li>
            <li><strong>정기적으로 변경하세요:</strong> 주요 계정의 비밀번호는 3~6개월마다 변경하는 것이 좋습니다.</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="비밀번호 생성기"
      description="강력한 랜덤 비밀번호를 생성합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default PasswordGenerator;
