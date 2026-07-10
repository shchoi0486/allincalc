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
        <p>
          <strong>IP 주소 조회</strong> 도구는 현재 인터넷에 연결된 기기의 공인 IP 주소와 관련 지리 정보를 실시간으로 표시합니다. IP 주소는 인터넷에서 기기를 식별하는 고유 번호로, ISP(인터넷 서비스 제공업체)가 할당하며 이 도구로 IP·위치·ISP 등을 한눈에 확인할 수 있습니다.
        </p>
        <p>
          원격 접속 설정, 방화벽 허용 목록 등록, 네트워크 문제 진단, 지역 제한 콘텐츠 접근 여부 확인 등에 활용됩니다. 또한 내 공인 IP가 예상과 다른지, 의심스러운 접속이 없는지 보안 점검에도 쓰입니다.
        </p>
        <p>
          네트워크 관리자와 보안 담당자에게는 기본 진단 도구로, 일반 사용자에게는 내 접속 정보를 확인하는 도구로 유용합니다. 외부 지리위치 정보(IP 기반)는 대략적인 위치만 알려주며 정확한 주소는 아닙니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          이 도구는 외부 API(ipinfo.io, ipify)를 순차 호출해 정보를 가져옵니다. 표시되는 위치는 IP 할당 기준이므로 실제 물리 위치와 차이가 있을 수 있으며, 정밀 위치는 제공되지 않습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">조회 방식</h4>
          <p>외부 API를 통해 접속 IP를 파악하고 지리 정보를 조회합니다. 두 API를 순차로 시도합니다.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">1차 시도: ipinfo.io</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">GET https://ipinfo.io/json?token=demo</p>
          </div>
          <p className="text-sm text-muted-foreground">IP, 도시, 지역, 국가, 좌표, ISP, 시간대 등 상세 정보를 제공합니다.</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">대체: ipify</h4>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">GET https://api.ipify.org?format=json</p>
          </div>
          <p>1차 실패 시 최소한의 IP 정보를 가져와 표시합니다.</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">VPN 활용</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>IP를 숨기려면 VPN 서비스를 사용하세요.</li>
            <li>VPN 연결 시 표시 IP가 달라집니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">프라이버시</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>공인 IP는 대략적인 위치를 노출할 수 있습니다.</li>
            <li>공유기 외부 IP는 관리 페이지에서도 확인 가능합니다.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">원격 접속 설정</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>방화벽 허용 목록에 내 IP를 등록하세요.</li>
            <li>고정 IP가 아니면 주기적으로 갱신하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">네트워크 진단</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>연결 문제 발생 시 내 IP와 ISP를 먼저 확인하세요.</li>
            <li>예상과 다르면 공유기 재시작을 고려하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">지역 제한 확인</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>콘텐츠 접근 가능 여부를 IP 기반으로 판단합니다.</li>
            <li>국가 정보는 ISP 할당 기준임을 유의하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">보안 감사</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>의심스러운 접속은 IP로 출처를 추적하세요.</li>
            <li>로그인 알림의 IP와 비교해 보세요.</li>
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
