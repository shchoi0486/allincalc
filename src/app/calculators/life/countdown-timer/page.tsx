'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const CountdownTimer: React.FC = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const formatTime = (totalSec: number): string => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const playAlarm = useCallback(() => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (freq: number, startTime: number, duration: number) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;
      playBeep(880, now, 0.2);
      playBeep(880, now + 0.3, 0.2);
      playBeep(1100, now + 0.6, 0.3);
    } catch {
      // Audio not available
    }
  }, []);

  const startTimer = useCallback(() => {
    if (remaining <= 0) {
      if (totalSeconds > 0) {
        setRemaining(totalSeconds);
        setIsFinished(false);
      } else {
        return;
      }
    }

    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsFinished(true);
          playAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [remaining, totalSeconds, playAlarm]);

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setRemaining(0);
    setIsRunning(false);
    setIsFinished(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const progress = totalSeconds > 0 ? ((totalSeconds - remaining) / totalSeconds) * 100 : 0;

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4 justify-center">
        <div className="text-center">
          <label className="block text-sm mb-1">시간</label>
          <Input
            type="number"
            min={0}
            max={23}
            value={hours}
            onChange={(e) => setHours(Math.min(23, Math.max(0, Number(e.target.value))))}
            className="w-20 text-center text-2xl"
            disabled={isRunning}
          />
        </div>
        <span className="text-2xl font-bold mt-5">:</span>
        <div className="text-center">
          <label className="block text-sm mb-1">분</label>
          <Input
            type="number"
            min={0}
            max={59}
            value={minutes}
            onChange={(e) => setMinutes(Math.min(59, Math.max(0, Number(e.target.value))))}
            className="w-20 text-center text-2xl"
            disabled={isRunning}
          />
        </div>
        <span className="text-2xl font-bold mt-5">:</span>
        <div className="text-center">
          <label className="block text-sm mb-1">초</label>
          <Input
            type="number"
            min={0}
            max={59}
            value={seconds}
            onChange={(e) => setSeconds(Math.min(59, Math.max(0, Number(e.target.value))))}
            className="w-20 text-center text-2xl"
            disabled={isRunning}
          />
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        {!isRunning ? (
          <Button onClick={startTimer} className="px-8">
            {remaining > 0 ? '계속' : '시작'}
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="secondary" className="px-8">
            일시정지
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline">
          초기화
        </Button>
      </div>
    </div>
  );

  const resultSection = (
    <div className="flex flex-col items-center space-y-4">
      <div
        className={`text-6xl font-mono font-bold transition-colors ${
          isFinished
            ? 'text-red-500 animate-pulse'
            : remaining <= 10 && remaining > 0
            ? 'text-orange-500'
            : 'text-primary'
        }`}
      >
        {formatTime(remaining > 0 ? remaining : totalSeconds)}
      </div>

      {totalSeconds > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              isFinished ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {isFinished && (
        <Card className="w-full border-red-200 bg-red-50">
          <CardContent className="p-4 text-center">
            <p className="text-xl font-bold text-red-600">시간이 종료되었습니다!</p>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        <p>설정 시간: {formatTime(totalSeconds)}</p>
        {remaining > 0 && !isFinished && (
          <p>남은 시간: {formatTime(remaining)} ({Math.round(progress)}% 경과)</p>
        )}
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg">카운트다운 타이머는 특정 시간만큼 시간을 재고 시간 경과를 시각적으로 보여주는 도구입니다.</p>
        <p>운동, 공부, 요리 등 다양한 활동에서 시간을 효율적으로 관리할 수 있으며, 시간 종료 시 알림 소리로 알려줍니다.</p>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">타이머 동작 원리</h3>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">setInterval(() => remaining--, 1000)</code>
          </div>
          <p className="mt-2">1초마다 남은 시간을 1씩 감소시키며, 0이 되면 타이머를 종료하고 알림을 발생시킵니다.</p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">알림 소리 생성</h3>
          <p>Web Audio API의 Oscillator를 사용하여 주파수와 지속 시간을 조절하여 알림 소리를 생성합니다.</p>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">타이머 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>포모도로 기법:</strong> 25분 집중 후 5분 휴식하는 학습/업무 방식</li>
            <li><strong>운동:</strong> 인터벌 트레이닝, 플랭크 등 시간 기반 운동</li>
            <li><strong>요리:</strong> 조리 시간을 정확하게 재기</li>
            <li><strong> 발표:</strong> 발표 시간을 준수하기 위한 타이밍 관리</li>
            <li><strong> 게임:</strong> 퀴즈 시간 제한, 퍼즐 게임 등</li>
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title="카운트다운 타이머"
      description="시간을 설정하고 카운트다운을 시작합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CountdownTimer;
