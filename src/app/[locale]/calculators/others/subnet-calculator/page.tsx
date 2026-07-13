'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { useI18n } from '@/i18n/I18nProvider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

function ipToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map(Number);
  if (nums.some((n) => isNaN(n) || n < 0 || n > 255)) return null;
  return ((nums[0] << 24) | (nums[1] << 16) | (nums[2] << 8) | nums[3]) >>> 0;
}

function intToIp(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ].join('.');
}

function intToBinary(int: number): string {
  return [
    (int >>> 24) & 255,
    (int >>> 16) & 255,
    (int >>> 8) & 255,
    int & 255,
  ]
    .map((b) => b.toString(2).padStart(8, '0'))
    .join('.');
}

function parseMask(mask: string): number | null {
  const trimmed = mask.trim();
  if (trimmed.startsWith('/')) {
    const cidr = parseInt(trimmed.slice(1), 10);
    if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;
    return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
  }
  const parts = trimmed.split('.');
  if (parts.length === 4) {
    const num = ipToInt(trimmed);
    if (num === null) return null;
    const binary = num.toString(2).padStart(32, '0');
    if (!/^1*0*$/.test(binary)) return null;
    const ones = binary.split('0')[0].length;
    return ones;
  }
  const cidr = parseInt(trimmed, 10);
  if (isNaN(cidr) || cidr < 0 || cidr > 32) return null;
  return cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
}

interface SubnetResult {
  cidr: number;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  totalIPs: number;
  usableHosts: number;
  wildcardMask: string;
  subnetMaskInt: number;
  ipBinary: string;
  maskBinary: string;
}

function calculateSubnet(ip: string, maskInput: string): SubnetResult | null {
  const ipInt = ipToInt(ip);
  if (ipInt === null) return null;

  const maskResult = parseMask(maskInput);
  if (maskResult === null) return null;

  let cidr: number;
  let maskInt: number;

  if (typeof maskResult === 'number' && maskResult <= 32) {
    const trimmed = maskInput.trim();
    if (trimmed.startsWith('/')) {
      cidr = parseInt(trimmed.slice(1), 10);
      maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    } else if (trimmed.split('.').length === 4) {
      maskInt = maskResult;
      cidr = maskInt.toString(2).split('1').length - 1;
    } else {
      cidr = maskResult;
      maskInt = cidr === 0 ? 0 : (~0 << (32 - cidr)) >>> 0;
    }
  } else {
    return null;
  }

  const networkInt = (ipInt & maskInt) >>> 0;
  const broadcastInt = (networkInt | (~maskInt >>> 0)) >>> 0;
  const totalIPs = Math.pow(2, 32 - cidr);
  const usableHosts = cidr >= 31 ? (cidr === 32 ? 1 : 2) : totalIPs - 2;

  return {
    cidr,
    networkAddress: intToIp(networkInt),
    broadcastAddress: intToIp(broadcastInt),
    firstUsable: cidr >= 31 ? intToIp(networkInt) : intToIp((networkInt + 1) >>> 0),
    lastUsable: cidr >= 31 ? intToIp(broadcastInt) : intToIp((broadcastInt - 1) >>> 0),
    totalIPs,
    usableHosts,
    wildcardMask: intToIp((~maskInt) >>> 0),
    subnetMaskInt: maskInt,
    ipBinary: intToBinary(ipInt),
    maskBinary: intToBinary(maskInt),
  };
}

const SubnetCalculator: React.FC = () => {
  const { locale } = useI18n();
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [ip, setIp] = useState('192.168.1.0');
  const [mask, setMask] = useState('/24');

  const results = useMemo(() => {
    if (!ip || !mask) return null;
    return calculateSubnet(ip, mask);
  }, [ip, mask]);

  const handleReset = () => {
    setIp('192.168.1.0');
    setMask('/24');
  };

  const inputSection = (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="ipInput">{L('IP 주소', 'IP Address')}</Label>
        <Input
          id="ipInput"
          type="text"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          placeholder="192.168.1.0"
          className="font-mono"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="maskInput">{L('서브넷 마스크', 'Subnet Mask')}</Label>
        <Input
          id="maskInput"
          type="text"
          value={mask}
          onChange={(e) => setMask(e.target.value)}
          placeholder="/24 or 255.255.255.0"
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          {L('/xx 또는 255.255.xxx 형식 지원', 'Supports /xx or 255.255.xxx format')}
        </p>
      </div>
      <Button onClick={handleReset} className="w-full" variant="outline">
        {L('초기화', 'Reset')}
      </Button>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!results ? (
        <p className="text-muted-foreground text-center py-8">
          {L('IP 주소와 서브넷 마스크를 입력하세요.', 'Enter an IP address and subnet mask.')}
        </p>
      ) : (
        <>
          <div className="p-4 bg-muted rounded-lg text-center">
            <div className="text-sm text-muted-0 mb-1">{L('CIDR 표기', 'CIDR Notation')}</div>
            <div className="text-2xl font-bold font-mono">
              {results.networkAddress}/{results.cidr}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('네트워크 주소', 'Network Address')}</span>
              <span className="font-mono">{results.networkAddress}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('브로드캐스트 주소', 'Broadcast Address')}</span>
              <span className="font-mono">{results.broadcastAddress}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('첫 번째 사용 가능 IP', 'First Usable IP')}</span>
              <span className="font-mono">{results.firstUsable}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('마지막 사용 가능 IP', 'Last Usable IP')}</span>
              <span className="font-mono">{results.lastUsable}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('전체 IP 수', 'Total IPs')}</span>
              <span className="font-mono">{results.totalIPs.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('사용 가능 호스트 수', 'Usable Hosts')}</span>
              <span className="font-mono">{results.usableHosts.toLocaleString()}</span>
            </div>
            <div className="flex justify-between p-3 bg-muted rounded-lg">
              <span className="font-medium">{L('와일드카드 마스크', 'Wildcard Mask')}</span>
              <span className="font-mono">{results.wildcardMask}</span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-sm">{L('바이너리 표현', 'Binary Representation')}</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="text-muted-foreground">
                    <th className="text-left p-1"></th>
                    <th className="p-1 text-center">1~8</th>
                    <th className="p-1 text-center">9~16</th>
                    <th className="p-1 text-center">17~24</th>
                    <th className="p-1 text-center">25~32</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-left p-1 font-medium">{L('IP', 'IP')}</td>
                    {results.ipBinary.split('.').map((octet, i) => (
                      <td key={i} className="p-1 text-center bg-blue-50 dark:bg-blue-900/20 rounded">
                        {octet}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td className="text-left p-1 font-medium">{L('마스크', 'Mask')}</td>
                    {results.maskBinary.split('.').map((octet, i) => (
                      <td key={i} className="p-1 text-center bg-orange-50 dark:bg-orange-900/20 rounded">
                        {octet}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4 leading-relaxed">
        <p>
          {L(
            '서브넷 계산기는 IPv4 주소와 서브넷 마스크를 입력하여 네트워크 주소, 브로드캐스트 주소, 사용 가능한 호스트 범위 등을 계산해주는 도구입니다. 네트워크 설계, IP 할당 계획, 방화벽 규칙 설정 등에 활용됩니다.',
            'The Subnet Calculator computes the network address, broadcast address, and usable host range from an IPv4 address and subnet mask. It is used in network design, IP allocation planning, and firewall rule configuration.',
          )}
        </p>
        <div>
          <h4 className="font-bold text-base mb-2">{L('서브넷 마스크란?', 'What is a Subnet Mask?')}</h4>
          <p className="text-sm">
            {L(
              '서브넷 마스크는 IP 주소의 네트워크 부분과 호스트 부분을 구분하는 32비트 값입니다. CIDR 표기(/24) 또는 듀얼 포맷(255.255.255.0)으로 표현합니다.',
              'A subnet mask is a 32-bit value that separates the network and host portions of an IP address. It is expressed in CIDR notation (/24) or dotted-decimal format (255.255.255.0).',
            )}
          </p>
        </div>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6 leading-relaxed">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-blue-500 pl-3">
            {L('서브넷 계산 공식', 'Subnet Calculation Formulas')}
          </h4>
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <div className="text-center font-mono text-blue-600 space-y-1">
              <p>네트워크 주소 = IP AND 마스크</p>
              <p>브로드캐스트 주소 = 네트워크 OR NOT(마스크)</p>
              <p>전체 IP 수 = 2^(32 - CIDR)</p>
              <p>사용 가능 호스트 = 2^(32 - CIDR) - 2</p>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('계산 예시', 'Example')}</h4>
          <div className="p-4 bg-muted rounded-lg text-sm space-y-1">
            <p><strong>IP:</strong> 192.168.1.100 / <strong>CIDR:</strong> /24</p>
            <p className="font-mono">네트워크 주소 = 192.168.1.0</p>
            <p className="font-mono">브로드캐스트 = 192.168.1.255</p>
            <p className="font-mono">사용 가능: 192.168.1.1 ~ 192.168.1.254</p>
            <p className="font-mono">전체 IP: 256, 호스트: 254</p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-4 leading-relaxed">
        <div>
          <h4 className="font-bold text-base mb-2">{L('CIDR 표기법 가이드', 'CIDR Notation Guide')}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-muted">
                  <th className="border p-2 text-left">CIDR</th>
                  <th className="border p-2 text-left">{L('마스크', 'Mask')}</th>
                  <th className="border p-2 text-center">{L('호스트 수', 'Hosts')}</th>
                  <th className="border p-2 text-left">{L('용도', 'Use Case')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cidr: '/8', mask: '255.0.0.0', hosts: '16,777,214', use: L('대규모 ISP', 'Large ISP') },
                  { cidr: '/16', mask: '255.255.0.0', hosts: '65,534', use: L('대기업', 'Large enterprise') },
                  { cidr: '/24', mask: '255.255.255.0', hosts: '254', use: L('소규모 사무실', 'Small office') },
                  { cidr: '/25', mask: '255.255.255.128', hosts: '126', use: L('서브넷 분할', 'Subnet split') },
                  { cidr: '/28', mask: '255.255.255.240', hosts: '14', use: L('소규모 네트워크', 'Small network') },
                  { cidr: '/30', mask: '255.255.255.252', hosts: '2', use: L('P2P 링크', 'P2P link') },
                ].map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-muted/50' : ''}>
                    <td className="border p-2 font-mono font-medium">{row.cidr}</td>
                    <td className="border p-2 font-mono text-sm">{row.mask}</td>
                    <td className="border p-2 text-center font-mono">{row.hosts}</td>
                    <td className="border p-2">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base mb-2">{L('네트워크 설계 팁', 'Network Design Tips')}</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>{L('불필요한 IP 낭비를 줄이기 위해 호스트 수에 맞는 최적의 서브넷 크기를 선택하세요.', 'Choose the optimal subnet size for the number of hosts to reduce IP waste.')}</li>
            <li>{L('네트워크 주소와 브로드캐스트 주소는 호스트에 할당할 수 없습니다.', 'Network and broadcast addresses cannot be assigned to hosts.')}</li>
            <li>{L('서브넷 분할(Subnetting)으로 하나의 대역을 여러 소규모 네트워크로 나눌 수 있습니다.', 'Subnetting divides a large network into smaller ones.')}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={L('서브넷 계산기', 'Subnet Calculator')}
      description={L(
        'IPv4 주소와 서브넷 마스크를 입력하여 네트워크 정보를 계산합니다.',
        'Enter an IPv4 address and subnet mask to calculate network information.'
      )}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default SubnetCalculator;
