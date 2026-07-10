'use client';

import React, { useState, useRef, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Play, Square, RotateCcw, Wifi, Download, Upload, Clock } from 'lucide-react';

type TestPhase = 'idle' | 'ping' | 'download' | 'upload' | 'complete';

interface SpeedResult {
  ping: number;
  downloadSpeed: number;
  uploadSpeed: number;
  jitter: number;
}

const InternetSpeedTest: React.FC = () => {
  const [phase, setPhase] = useState<TestPhase>('idle');
  const [result, setResult] = useState<SpeedResult | null>(null);
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, []);

  const simulatePing = (): Promise<number> => {
    return new Promise((resolve) => {
      const pingValues: number[] = [];
      let count = 0;
      const maxPings = 10;

      intervalRef.current = setInterval(() => {
        const simulatedPing = 5 + Math.random() * 45;
        pingValues.push(simulatedPing);
        count++;

        setCurrentProgress((count / maxPings) * 100);
        setCurrentSpeed(simulatedPing);

        if (count >= maxPings) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          const avgPing = pingValues.reduce((a, b) => a + b, 0) / pingValues.length;
          resolve(Math.round(avgPing * 100) / 100);
        }
      }, 100);
    });
  };

  const simulateDownload = (): Promise<number> => {
    return new Promise((resolve) => {
      let progress = 0;
      const speeds: number[] = [];

      intervalRef.current = setInterval(() => {
        progress += 2;
        const speed = 50 + Math.random() * 150;
        speeds.push(speed);

        setCurrentProgress(Math.min(progress, 100));
        setCurrentSpeed(Math.round(speed * 10) / 10);

        if (progress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
          resolve(Math.round(avgSpeed * 10) / 10);
        }
      }, 100);
    });
  };

  const simulateUpload = (): Promise<number> => {
    return new Promise((resolve) => {
      let progress = 0;
      const speeds: number[] = [];

      intervalRef.current = setInterval(() => {
        progress += 2;
        const speed = 20 + Math.random() * 80;
        speeds.push(speed);

        setCurrentProgress(Math.min(progress, 100));
        setCurrentSpeed(Math.round(speed * 10) / 10);

        if (progress >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
          resolve(Math.round(avgSpeed * 10) / 10);
        }
      }, 100);
    });
  };

  const startTest = async () => {
    setPhase('ping');
    setCurrentProgress(0);
    setCurrentSpeed(0);
    setResult(null);

    const ping = await simulatePing();

    setPhase('download');
    setCurrentProgress(0);
    setCurrentSpeed(0);
    const download = await simulateDownload();

    setPhase('upload');
    setCurrentProgress(0);
    setCurrentSpeed(0);
    const upload = await simulateUpload();

    const jitter = Math.round((Math.random() * 5 + 1) * 100) / 100;

    setResult({ ping, downloadSpeed: download, uploadSpeed: upload, jitter });
    setPhase('complete');
    setCurrentProgress(0);
    setCurrentSpeed(0);
  };

  const stopTest = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();
    setPhase('idle');
    setCurrentProgress(0);
    setCurrentSpeed(0);
  };

  const resetTest = () => {
    stopTest();
    setResult(null);
    setPhase('idle');
  };

  const getSpeedRating = (speed: number, type: 'download' | 'upload' | 'ping'): string => {
    if (type === 'ping') {
      if (speed < 10) return '매우 우수';
      if (speed < 30) return '우수';
      if (speed < 60) return '보통';
      return '느림';
    }
    if (type === 'download') {
      if (speed > 100) return '매우 빠름';
      if (speed > 50) return '빠름';
      if (speed > 20) return '보통';
      return '느림';
    }
    if (speed > 50) return '빠름';
    if (speed > 20) return '보통';
    return '느림';
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="text-center p-6">
        <Wifi className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">인터넷 속도 테스트</h3>
        <p className="text-sm text-muted-foreground mb-4">
          이 테스트는 시뮬레이션된 결과입니다. 실제 인터넷 속도와 다를 수 있습니다.
        </p>

        {phase === 'idle' && (
          <Button onClick={startTest} size="lg" className="w-full">
            <Play className="w-5 h-5 mr-2" /> 테스트 시작
          </Button>
        )}

        {phase !== 'idle' && phase !== 'complete' && (
          <div className="space-y-4">
            <div className="text-sm font-medium">
              {phase === 'ping' && '핑(Ping) 테스트 중...'}
              {phase === 'download' && '다운로드 속도 테스트 중...'}
              {phase === 'upload' && '업로드 속도 테스트 중...'}
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-primary h-full transition-all duration-100 ease-linear"
                style={{ width: `${currentProgress}%` }}
              />
            </div>

            <div className="text-2xl font-bold text-primary">
              {phase === 'ping' ? `${currentSpeed} ms` : `${currentSpeed} Mbps`}
            </div>

            <Button variant="destructive" onClick={stopTest} className="w-full">
              <Square className="w-4 h-4 mr-2" /> 중지
            </Button>
          </div>
        )}

        {phase === 'complete' && result && (
          <Button variant="secondary" onClick={resetTest} className="w-full">
            <RotateCcw className="w-4 h-4 mr-2" /> 다시 테스트
          </Button>
        )}
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!result ? (
        <p className="text-muted-foreground text-center py-8">테스트를 시작하면 결과가 표시됩니다.</p>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-muted rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{result.ping}</div>
              <div className="text-xs text-muted-foreground">핑 (ms)</div>
              <div className="text-xs text-green-600 font-medium mt-1">{getSpeedRating(result.ping, 'ping')}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Download className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <div className="text-2xl font-bold">{result.downloadSpeed}</div>
              <div className="text-xs text-muted-foreground">다운로드 (Mbps)</div>
              <div className="text-xs text-green-600 font-medium mt-1">{getSpeedRating(result.downloadSpeed, 'download')}</div>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <Upload className="w-6 h-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold">{result.uploadSpeed}</div>
              <div className="text-xs text-muted-foreground">업로드 (Mbps)</div>
              <div className="text-xs text-green-600 font-medium mt-1">{getSpeedRating(result.uploadSpeed, 'upload')}</div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">속도 시각화</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>다운로드</span>
                  <span>{result.downloadSpeed} Mbps</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-green-500 h-full rounded-full"
                    style={{ width: `${Math.min((result.downloadSpeed / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>업로드</span>
                  <span>{result.uploadSpeed} Mbps</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-full rounded-full"
                    style={{ width: `${Math.min((result.uploadSpeed / 200) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg text-sm">
            <h4 className="font-semibold mb-2">상세 결과</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>핑 지연 시간: <strong>{result.ping} ms</strong></div>
              <div>지터(Jitter): <strong>{result.jitter} ms</strong></div>
              <div>다운로드: <strong>{result.downloadSpeed} Mbps</strong></div>
              <div>업로드: <strong>{result.uploadSpeed} Mbps</strong></div>
            </div>
          </div>
        </>
      )}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>인터넷 속도 테스트</strong>는 현재 인터넷 연결의 다운로드·업로드 속도와 핑(Ping) 지연 시간을 측정하는 도구입니다. 가정이나 사무실의 회선이 약속된 속도를 내는지, 온라인 게임이나 화상 회의가 끊김 없이 가능한지 빠르게 점검할 수 있습니다.
        </p>
        <p>
          재택근무자, 게이머, 영상 스트리밍 이용자, 네트워크 관리자에게 유용합니다. 통신사 가입 속도와 실제 체감 속도의 차이를 확인하고, 문제 발생 시 원인(와이파이 간섭, 타 기기 점유 등)을 좁혀가는 데 활용됩니다.
        </p>
        <p>
          초보자에게는 느린 인터넷의 원인을 찾는 진단 도구로, IT 담당자에게는 장애 대응의 1차 확인 도구로 쓰입니다. 측정값은 여러 번 반복해 평균을 내는 것이 신뢰도가 높습니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          이 도구는 시뮬레이션된 결과를 제공하므로 참고용입니다. 실제 정확한 측정에는 Speedtest.net, Fast.com 등 전용 서비스를 이용하세요. 측정 환경(와이파이·유선·다른 기기 사용 여부)에 따라 결과가 크게 달라집니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">핑(Ping) 측정</h4>
          <p>서버에 패킷을 보내고 응답까지 왕복 시간을 측정합니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">Ping = 왕복 시간(RTT) ÷ 2</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">다운로드 속도</h4>
          <p>일정량의 데이터를 받는 데 걸린 시간으로 속도를 계산합니다.</p>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">속도(Mbps) = (데이터량 × 8) ÷ 시간(초) ÷ 1,000,000</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">업로드 속도와 지터</h4>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">업로드 속도 = (전송량 × 8) ÷ 시간(초) ÷ 1,000,000</p>
          </div>
          <p>지터(Jitter)는 핑 지연 시간의 변동폭으로, 작을수록 안정적입니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">유선 연결</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>가능하면 이더넷 케이블을 사용해 와이파이 간섭을 제거하세요.</li>
            <li>공유기와 가까울수록 안정적인 결과를 얻습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">다른 기기 차단</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>테스트 중 다른 기기의 스트리밍·다운로드를 멈추세요.</li>
            <li>백그라운드 업데이트도 속도를 잡아먹습니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">VPN 비활성화</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>VPN 사용 시 암호화 오버헤드로 지연이 커집니다.</li>
            <li>순수 회선 속도를 보려면 VPN을 끄세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">반복 측정</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>여러 번 측정해 평균과 최솟값을 비교하세요.</li>
            <li>시간대에 따라 망 혼잡도가 달라집니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">속도 기준</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>웹·HD 5~10 Mbps, 4K 25 Mbps, 화상회의 10~20 Mbps 권장</li>
            <li>온라인 게임은 핑 20 ms 이하가 유리합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">문제 대응</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>느리면 공유기 재시작과 펌웨어 점검을 먼저 하세요.</li>
            <li>지속 이상 시 통신사에 회선 점검을 요청하세요.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="인터넷 속도 테스트"
      description="인터넷 연결 속도를 시뮬레이션하여 측정합니다. (시뮬레이션 결과)"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default InternetSpeedTest;
