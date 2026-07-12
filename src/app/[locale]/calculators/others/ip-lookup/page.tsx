'use client';

import React, { useState, useEffect } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Button } from '@/components/ui/button';
import { Globe, MapPin, Wifi, Server, RefreshCw, Loader2, Copy, Check } from 'lucide-react';
import TermGlossary from '@/components/calculators/TermGlossary';
import { useI18n } from '@/i18n/I18nProvider';

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
  const { dict } = useI18n();
  const t = dict.ipLookup;

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
        throw new Error(t.errors.fetchFailed);
      }
      const data: IPInfo = await response.json();
      setIpInfo(data);
    } catch (err) {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) throw new Error(t.errors.ipFetchFailed);
        const data = await response.json();
        setIpInfo({
          ip: data.ip,
          city: '-',
          region: '-',
          country: '-',
          loc: '-',
          org: '-',
          timezone: '-',
          postal: '-',
        });
      } catch (fallbackErr) {
        setError(t.errors.fetchFailed);
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
        <h3 className="text-xl font-semibold mb-2">{t.inputs.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {t.inputs.subtitle}
        </p>

        {loading ? (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t.inputs.loading}</span>
          </div>
        ) : (
          <Button onClick={fetchIPInfo} className="w-full">
            <RefreshCw className="w-4 h-4 mr-2" /> {t.inputs.refresh}
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-semibold text-sm mb-2">{t.inputs.notes}</h4>
        <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
          <li>{t.inputs.note1}</li>
          <li>{t.inputs.note2}</li>
          <li>{t.inputs.note3}</li>
          <li>{t.inputs.note4}</li>
        </ul>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      {!ipInfo && !loading && !error ? (
        <p className="text-muted-foreground text-center py-8">{t.results.empty}</p>
      ) : ipInfo ? (
        <>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">{t.results.publicIp}</div>
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
                <span>{t.results.city}</span>
              </div>
              <div className="font-medium">{ipInfo.city}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>{t.results.region}</span>
              </div>
              <div className="font-medium">{ipInfo.region}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                <span>{t.results.country}</span>
              </div>
              <div className="font-medium">{ipInfo.country}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Server className="w-4 h-4" />
                <span>{t.results.isp}</span>
              </div>
              <div className="font-medium text-sm">{ipInfo.org}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg col-span-2">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Wifi className="w-4 h-4" />
                <span>{t.results.coordinates}</span>
              </div>
              <div className="font-medium font-mono">{ipInfo.loc}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Globe className="w-4 h-4" />
                <span>{t.results.timezone}</span>
              </div>
              <div className="font-medium text-sm">{ipInfo.timezone}</div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <MapPin className="w-4 h-4" />
                <span>{t.results.postal}</span>
              </div>
              <div className="font-medium">{ipInfo.postal}</div>
            </div>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground text-center py-8">{t.results.empty}</p>
      )}
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.info.title}</strong> {t.info.p1}
        </p>
        <p>{t.info.p2}</p>
        <p>{t.info.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.info.tip}
        </p>
        <TermGlossary
          items={[
            { term: t.glossary.publicIp.term, desc: t.glossary.publicIp.desc },
            { term: t.glossary.isp.term, desc: t.glossary.isp.desc },
            { term: t.glossary.vpn.term, desc: t.glossary.vpn.desc },
            { term: t.glossary.geoIp.term, desc: t.glossary.geoIp.desc },
          ]}
        />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.lookupMethod}</h4>
          <p>{t.formula.lookupDesc}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.primary}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">GET https://ipinfo.io/json?token=demo</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formula.primaryDesc}</p>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.fallback}</h4>
          <div className="my-2 p-3 bg-muted rounded-lg">
            <p className="font-mono text-sm text-center">GET https://api.ipify.org?format=json</p>
          </div>
          <p>{t.formula.fallbackDesc}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.vpn}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.vpnTip1}</li>
            <li>{t.tips.vpnTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.privacy}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.privacyTip1}</li>
            <li>{t.tips.privacyTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.remoteAccess}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.remoteTip1}</li>
            <li>{t.tips.remoteTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.troubleshooting}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.troubleTip1}</li>
            <li>{t.tips.troubleTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.regionCheck}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.regionTip1}</li>
            <li>{t.tips.regionTip2}</li>
          </ul>
        </div>
        <div className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          <h4 className="font-bold text-lg mb-2">{t.tips.security}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.securityTip1}</li>
            <li>{t.tips.securityTip2}</li>
          </ul>
        </div>
      </div>
    ),
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

export default IPLookup;
