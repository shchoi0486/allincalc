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
        <p className="text-lg">인터넷 속도 테스트는 현재 인터넷 연결의 다운로드, 업로드 속도 및 핑 지연 시간을 측정하는 도구입니다.</p>
        <p><strong>중요:</strong> 이 도구는 시뮬레이션된 결과를 제공합니다. 실제 정확한 속도 측정을 위해서는 Speedtest.net 또는 Fast.com과 같은 전문 서비스를 이용하시기 바랍니다.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-md mb-2">측정 항목:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>핑(Ping):</strong> 서버와 클라이언트 간의 지연 시간 (ms)</li>
            <li><strong>다운로드 속도:</strong> 데이터 수신 속도 (Mbps)</li>
            <li><strong>업로드 속도:</strong> 데이터 송신 속도 (Mbps)</li>
            <li><strong>지터(Jitter):</strong> 핑 지연 시간의 변동폭 (ms)</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">인터넷 속도 측정 원리</h3>
          <p className="mb-4">실제 속도 테스트는 서버와 클라이언트 간에 데이터를 전송하고 그 시간을 측정하여 속도를 계산합니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. 핑(Ping) 측정</h3>
          <p className="mb-2">ICMP Echo Request 패킷을 서버에 전송하고 응답 시간을 측정합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">Ping = 왕복 시간 (RTT) ÷ 2</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. 다운로드 속도</h3>
          <p className="mb-2">서버에서 클라이언트로 일정량의 데이터를 전송하고 소요 시간을 측정합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">다운로드 속도 (Mbps) = (전송된 데이터량 × 8) ÷ 소요 시간 (초) ÷ 1,000,000</code>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">3. 업로드 속도</h3>
          <p className="mb-2">클라이언트에서 서버로 데이터를 전송하는 속도를 측정합니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">업로드 속도 (Mbps) = (전송된 데이터량 × 8) ÷ 소요 시간 (초) ÷ 1,000,000</code>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">정확한 측정을 위한 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>유선 연결:</strong> 가능하면 이더넷 케이블을 사용하여 Wi-Fi 간섭을 제거하세요.</li>
            <li><strong>다른 기기 차단:</strong> 테스트 중 다른 기기의 네트워크 사용을 중지하세요.</li>
            <li><strong>VPN 비활성화:</strong> VPN 사용 시 추가 지연이 발생할 수 있습니다.</li>
            <li><strong>여러 번 테스트:</strong> 여러 번 테스트하여 평균값을 구하는 것이 정확합니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">인터넷 속도 기준</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>웹 서핑:</strong> 최소 5-10 Mbps 권장</li>
            <li><strong>HD 스트리밍:</strong> 최소 5-10 Mbps 권장</li>
            <li><strong>4K 스트리밍:</strong> 최소 25 Mbps 권장</li>
            <li><strong>온라인 게임:</strong> 핑 20ms 이하 권장</li>
            <li><strong>화상 회의:</strong> 최소 10-20 Mbps 권장</li>
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
