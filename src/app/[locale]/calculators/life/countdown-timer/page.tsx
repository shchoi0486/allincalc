'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useI18n } from '@/i18n/I18nProvider';

const CountdownTimer: React.FC = () => {
  const { dict, locale } = useI18n();
  const t = dict.countdownTimer;
  const isKo = locale === 'ko';
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
          <label className="block text-sm mb-1">{t.inputs.hours}</label>
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
          <label className="block text-sm mb-1">{t.inputs.minutes}</label>
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
          <label className="block text-sm mb-1">{t.inputs.seconds}</label>
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
            {remaining > 0 ? t.inputs.resume : t.inputs.start}
          </Button>
        ) : (
          <Button onClick={pauseTimer} variant="secondary" className="px-8">
            {t.inputs.pause}
          </Button>
        )}
        <Button onClick={resetTimer} variant="outline">
          {t.inputs.reset}
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
            <p className="text-xl font-bold text-red-600">{t.results.timeUp}</p>
          </CardContent>
        </Card>
      )}

      <div className="text-sm text-muted-foreground">
        <p>{t.results.setDuration}: {formatTime(totalSeconds)}</p>
        {remaining > 0 && !isFinished && (
          <p>{t.results.timeRemaining}: {formatTime(remaining)} ({Math.round(progress)}% {t.results.elapsed})</p>
        )}
      </div>
    </div>
  );

  const infoSection = {
    calculatorDescription: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          ${t.descriptionContent.heading}
        </p>
        <p>
          ${t.descriptionContent.p1}
        </p>
        <p>
          ${t.descriptionContent.p2}
        </p>
        <p>
          ${t.descriptionContent.p3}
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">${isKo ? '용어 설명' : 'Terminology'}</h3>
          <dl class="space-y-3">
            ${t.glossary.map((g: { term: string; desc: string }) => `
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">${g.term}</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">${g.desc}</dd>
            </div>
            `).join('')}
          </dl>
        </div>
      </div>
    `,
    calculationFormula: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.heading}</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.principle}</code>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.alarm}</h3>
          <p className="text-muted-foreground">
            ${t.formula.alarmDesc}
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">${t.formula.progress}</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">${t.formula.progressFormula}</code>
          </div>
        </div>
      </div>
    `,
    usefulTips: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">${t.tips.heading}</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            ${t.tips.items.map((item: { title: string; desc: string }) => `
            <li><strong>${item.title}:</strong> ${item.desc}</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CountdownTimer;
