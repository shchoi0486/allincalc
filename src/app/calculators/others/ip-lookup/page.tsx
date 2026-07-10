'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Wifi, Server, RefreshCw, Loader2, Copy, Check } from 'lucide-react';

interface IPInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
  timezone: string;
  postal: string;
}

const IPLookup: React.FC = () => {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchIPInfo = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://ipinfo.io/json?token=demo');
      if (!response.ok) {
        throw new Error('IP 정보를 가져오는데 실패했습니다.');
      }
      const data: IPInfo = await response.json();
      setIpInfo(data);
    } catch (err) {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error('IP 조회 실패');
        const data = await response.json();
        setIpInfo({
          ip: data.ip,
          city: '정보 없음',
          region: '정보 없음',
          country: '정보 없음',
          loc: '정보 없음',
          org: '정보 없음',
          timezone: '정보 없음',
          postal: '정보 없음',
        });
      } catch (fallbackErr) {
        setError('IP 정보를 가져오는데 실패했습니다. 네트워크 연결을 확인해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIPInfo();
  }, []);

  const handleCopyIP = async () => {
    if (ipInfo?.ip) {
      await navigator.clipboard.writeText(ipInfo.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="text-center p-6">
        <Globe className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h3 className="text-xl font-semibold mb-2">IP 주소 조회</h3>
        <p className="text-sm text-muted-foreground mb-4">
          현재 사용 중인 공인 IP 주소와 관련 정보를 조회합니다.
        </p>

        {loading ? (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>조회 중...</span>
          </div>
        ) : (
          <Button onClick={fetchIPInfo} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" /> 새로고침
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-semibold text-sm mb-2">참고사항</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>이 도구는 공인 IP 주소를 표시합니다.</li>
          <li>VPN 사용 시 VPN 서버의 IP가 표시됩니다.</li>
          <li>IP 정보는 ISP에서 제공하는 대략적인 위치입니다.</li>
          <li>정확한 위치는 표시되지 않을 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!ipInfo && !loading && !error ? (
        <p className="text-muted-foreground text-center py-8">IP 정보를 조회해주세요.</p>
      ) : ipInfo ? (
        <>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">공인 IP 주소</div>
            <div className="text-3xl font-bold font-mono flex items-center justify-center space-x-2">
              <span>{ipInfo.ip}</span>
              <Button variant="ghost" size="icon" onClick={handleCopyIP} className="shrink-0">
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>도시</span>
              </div>
              <div className="font-medium">{ipInfo.city}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>지역</span>
              </div>
              <div className="font-medium">{ipInfo.region}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                <span>국가</span>
              </div>
              <div className="font-medium">{ipInfo.country}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Server className="w-4 h-4" />
                <span>ISP</span>
              </div>
              <div className="font-medium text-sm">{ipInfo.org}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg col-span-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Wifi className="w-4 h-4" />
                <span>좌표</span>
              </div>
              <div className="font-medium font-mono">{ipInfo.loc}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                <span>시간대</span>
              </div>
              <div className="font-medium text-sm">{ipInfo.timezone}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>우편번호</span>
              </div>
              <div className="font-medium">{ipInfo.postal}</div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-center py-8">IP 정보를 조회해주세요.</p>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg">IP 주소 조회 도구는 현재 인터넷에 연결된 기기의 공인 IP 주소와 관련 지리적 정보를 실시간으로 표시합니다.</p>
        <p>IP 주소는 인터넷에서 기기를 식별하는 고유한 번호이며, ISP(인터넷 서비스 제공업체)가 할당합니다. 이 도구를 통해 자신의 IP 주소, 위치(도시, 국가), ISP 정보 등을 확인할 수 있습니다.</p>
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg border-l-4 border-blue-500">
          <h3 className="font-semibold text-md mb-2">표시 정보:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>공인 IP:</strong> 인터넷에서 보이는 내 기기의 주소</li>
            <li><strong>지리적 위치:</strong> 도시, 지역, 국가 정보</li>
            <li><strong>ISP:</strong> 인터넷 서비스 제공업체 정보</li>
            <li><strong>좌표:</strong> 대략적인 위도/경도</li>
            <li><strong>시간대:</strong> 기기가 속한 시간대</li>
          </ul>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-xl mb-2 border-b-2 border-gray-200 pb-2">IP 조회 방식</h3>
          <p className="mb-4">이 도구는 외부 API를 활용하여 IP 정보를 가져옵니다. 두 가지 API를 순차적으로 시도합니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">1. ipinfo.io API (1차 시도)</h3>
          <p className="mb-2">ipinfo.io는 IP 기반 지리적 위치 정보를 제공하는 서비스입니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">GET https://ipinfo.io/json?token=demo</code>
          </div>
          <p className="mt-2">응답 예시: IP, 도시, 지역, 국가, 좌표, ISP, 시간대 등 상세 정보를 제공합니다.</p>
        </div>

        <div>
          <h3 className="font-semibold text-lg mb-2">2. ipify API (대체)</h3>
          <p className="mb-2">ipinfo.io 실패 시, ipify를 사용하여 최소한의 IP 정보를 가져옵니다.</p>
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <code className="text-sm">GET https://api.ipify.org?format=json</code>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20">
          <h3 className="font-semibold text-lg mb-2">IP 주소 보안 팁</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>VPN 사용:</strong> IP 주소를 숨기기 위해 VPN 서비스를 사용할 수 있습니다.</li>
            <li><strong>프라이버시:</strong> IP 주소는 대략적인 위치를 노출할 수 있으므로 주의가 필요합니다.</li>
            <li><strong>공유기 설정:</strong> 공유기 관리 페이지에서 외부 IP를 확인할 수도 있습니다.</li>
          </ul>
        </div>
        <div className="p-4 rounded-lg border-l-4 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
          <h3 className="font-semibold text-lg mb-2">활용 사례</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>원격 접속 설정:</strong> 방화벽 설정 시自分の IP 확인</li>
            <li><strong>네트워크 문제 해결:</strong> 연결 문제 진단 시 IP 확인</li>
            <li><strong>콘텐츠 접근:</strong> 지역 제한 콘텐츠 접근 가능 여부 확인</li>
            <li><strong>보안 감사:</strong> 예상치 못한 IP에서의 접속 확인</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="IP 주소 조회"
      description="현재 공인 IP 주소와 관련 정보를 조회합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default IPLookup;
