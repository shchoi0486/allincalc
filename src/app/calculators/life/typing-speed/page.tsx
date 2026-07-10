'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const sampleTexts = [
  "오늘 날씨가 정말 좋습니다. 산책하기 딱 좋은 날씨네요.",
  "프로그래밍은 논리적 사고력과 문제 해결 능력을 키워줍니다.",
  "타이핑 속도를 높이려면 정확성부터 연습하는 것이 좋습니다.",
  "인공지능 기술이 우리의 일상생활을 점점 더 많이 변화시키고 있습니다.",
  "좋은 습관은 성공을 향한 첫 번째 단계입니다.",
  "배움에는 끝이 없습니다. 끊임없이 성장하는 것이 중요합니다.",
  "오늘도 최선을 다하는 하루가 되길 바랍니다.",
  "건강한 몸과 마음은 행복한 삶의 기초입니다.",
  "기술의 발전은 인류의 삶을 더욱 편리하게 만들어 줍니다.",
  "협동과 소통은 팀 성공의 핵심 요소입니다.",
];

const TypingSpeed: React.FC = () => {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [correctChars, setCorrectChars] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTest = () => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(null);
    setEndTime(null);
    setIsStarted(true);
    setIsFinished(false);
    setWpm(0);
    setAccuracy(100);
    setCorrectChars(0);
    setTotalKeystrokes(0);
    setElapsedTime(0);
    inputRef.current?.focus();
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isStarted || isFinished) return;

    const value = e.target.value;
    setUserInput(value);

    if (!startTime) {
      setStartTime(Date.now());
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - (startTime || Date.now())) / 1000));
      }, 1000);
    }

    setTotalKeystrokes(prev => prev + 1);

    let correct = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === text[i]) {
        correct++;
      }
    }
    setCorrectChars(correct);

    if (value.length === text.length || value.endsWith('\n')) {
      finishTest();
    }
  };

  const finishTest = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const end = Date.now();
    setEndTime(end);
    setIsFinished(true);

    const timeInMinutes = (end - (startTime || end)) / 60000;
    const wordsTyped = text.split(' ').length;
    const calculatedWpm = timeInMinutes > 0 ? Math.round(wordsTyped / timeInMinutes) : 0;

    let correct = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] === text[i]) {
        correct++;
      }
    }
    const calculatedAccuracy = text.length > 0 ? Math.round((correct / text.length) * 100) : 0;

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setCorrectChars(correct);
  }, [startTime, text, userInput]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const getCharClass = (index: number): string => {
    if (index >= userInput.length) return 'text-gray-400';
    if (userInput[index] === text[index]) return 'text-green-600 bg-green-50';
    return 'text-red-600 bg-red-50 line-through';
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      {!isStarted ? (
        <div className="text-center py-8">
          <p className="text-lg mb-4">타이핑 속도를 테스트합니다.</p>
          <Button onClick={startTest} size="lg" className="px-8">
            테스트 시작
          </Button>
        </div>
      ) : (
        <>
          <Card className="p-4">
            <div className="text-lg leading-relaxed tracking-wide">
              {text.split('').map((char, index) => (
                <span key={index} className={getCharClass(index)}>
                  {char}
                </span>
              ))}
            </div>
          </Card>

          <textarea
            ref={inputRef}
            value={userInput}
            onChange={handleInput}
            disabled={isFinished}
            className="w-full min-h-[120px] p-4 text-lg border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
            placeholder="여기에 텍스트를 입력하세요..."
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {isFinished ? '테스트 완료!' : `${userInput.length} / ${text.length} 자 입력`}
            </p>
            <div className="space-x-2">
              {isFinished && (
                <Button onClick={startTest} variant="outline">
                  다시 하기
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {isFinished ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">타이핑 속도 (WPM)</p>
                <p className="text-4xl font-bold text-blue-500">{wpm}</p>
                <p className="text-xs text-muted-foreground">분당 단어 수</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">정확도</p>
                <p className="text-4xl font-bold text-green-500">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">글자 정확도</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">소요 시간</p>
                  <p className="text-xl font-bold">{elapsedTime}초</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">총 글자</p>
                  <p className="text-xl font-bold">{text.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">정확한 글자</p>
                  <p className="text-xl font-bold">{correctChars}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">속도 평가:</p>
              <p className="text-lg">
                {wpm >= 60
                  ? '매우 빠릅니다! 전문가 수준이에요.'
                  : wpm >= 40
                  ? '빠른 편이에요. 좋은 실력입니다.'
                  : wpm >= 20
                  ? '보통 수준이에요. 꾸준히 연습하면 더 빨라질 거예요.'
                  : '연습이 필요해요. 꾸준히 연습하면 실력이 향상됩니다.'}
              </p>
            </CardContent>
          </Card>
        </>
      ) : isStarted ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">진행 중...</p>
              <p className="text-4xl font-bold text-blue-500">{elapsedTime}초</p>
              <p className="text-xs text-muted-foreground">경과 시간</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          테스트 시작 버튼을 눌러주세요
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg">타이핑 속도 테스트는 분당 타이핑하는 단어 수(WPM)와 정확도를 측정하는 도구입니다.</p>
        <p>랜덤 문장을 보고 직접 타이핑하여 자신의 타이핑 실력을 객관적으로 평가하고 개선할 수 있습니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">WPM (Words Per Minute) 계산</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">WPM = (입력한 단어 수) / (경과 시간(분))</code>
          </div>
          <p className="mt-2">일반적으로 1단어 = 5글자로 가정하며, 타이핑한 총 글자 수를 5로 나누어 단어 수를 계산합니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">정확도 계산</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">정확도 = (정확한 글자 수 / 전체 글자 수) × 100</code>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">타이핑 실력 향상 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>정확성 우선:</strong> 처음에는 속도보다 정확한 타이핑에 집중하세요</li>
            <li><strong>홈 키 위치:</strong> 왼손은 'ㅁF', 오른손은 'ㅗJ'를 기준으로 손가락 위치를 잡으세요</li>
            <li><strong>자세:</strong> 등과 어깨를 펴고 팔꿈치를 90도로 구부리세요</li>
            <li><strong>눈은 화면:</strong> 키보드를 보지 않고 화면을 보며 타이핑하는 연습을 하세요</li>
            <li><strong>꾸준한 연습:</strong> 매일 10~15분씩 꾸준히 연습하면 실력이 크게 향상됩니다</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="타이핑 속도 테스트"
      description="타이핑 속도와 정확도를 측정합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TypingSpeed;
