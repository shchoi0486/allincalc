'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const TypingSpeed: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.typingSpeed;
  const isKo = locale === 'ko';

  const sampleTexts = isKo
    ? [
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
      ]
    : [
        "The weather is really nice today. It is a perfect day for a walk.",
        "Programming builds logical thinking and problem solving skills.",
        "To improve typing speed, practice accuracy first.",
        "Artificial intelligence is gradually changing our daily lives.",
        "Good habits are the first step toward success.",
        "Learning never ends. Keep growing constantly.",
        "Hope you have a day where you do your best.",
        "A healthy body and mind are the foundation of a happy life.",
        "Technology makes human life more convenient.",
        "Cooperation and communication are key to team success.",
      ];
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
          <p className="text-lg mb-4">{t.description}</p>
          <Button onClick={startTest} size="lg" className="px-8">
            {t.startButton}
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
            placeholder={t.typingPrompt}
          />

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {isFinished ? t.testComplete : t.charInput.replace('{current}', String(userInput.length)).replace('{total}', String(text.length))}
            </p>
            <div className="space-x-2">
              {isFinished && (
                <Button onClick={startTest} variant="outline">
                  {t.retake}
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
                <p className="text-sm text-muted-foreground">{t.wpmLabel}</p>
                <p className="text-4xl font-bold text-blue-500">{wpm}</p>
                <p className="text-xs text-muted-foreground">{t.wpmUnit}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground">{t.accuracyLabel}</p>
                <p className="text-4xl font-bold text-green-500">{accuracy}%</p>
                <p className="text-xs text-muted-foreground">{t.accuracyUnit}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-muted-foreground">{t.elapsedTime}</p>
                  <p className="text-xl font-bold">{elapsedTime}{isKo ? '초' : 's'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.totalChars}</p>
                  <p className="text-xl font-bold">{text.length}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.correctChars}</p>
                  <p className="text-xl font-bold">{correctChars}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <p className="text-sm font-medium mb-2">{t.speedRating}</p>
              <p className="text-lg">
                {wpm >= 60
                  ? t.veryFast
                  : wpm >= 40
                  ? t.fast
                  : wpm >= 20
                  ? t.average
                  : t.slow}
              </p>
            </CardContent>
          </Card>
        </>
      ) : isStarted ? (
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-muted-foreground">{t.testInProgress}</p>
              <p className="text-4xl font-bold text-blue-500">{elapsedTime}{isKo ? '초' : 's'}</p>
              <p className="text-xs text-muted-foreground">{t.elapsedTime}</p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground h-32">
          {t.startPrompt}
        </div>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: t.descriptionContent,
    calculationFormula: t.formulaContent,
    usefulTips: t.tipsContent,
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default TypingSpeed;
