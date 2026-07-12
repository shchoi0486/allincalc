import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const ApiGravityCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict?.common?.apiGravity;

  const [inputType, setInputType] = useState<'api' | 'sg'>('api');
  const [apiValue, setApiValue] = useState<number>(35);
  const [sgValue, setSgValue] = useState<number>(0.85);

  const [apiResult, setApiResult] = useState<number>(0);
  const [sgResult, setSgResult] = useState<number>(0);
  const [densityKgM3, setDensityKgM3] = useState<number>(0);
  const [densityLbGal, setDensityLbGal] = useState<number>(0);
  const [classification, setClassification] = useState<string>('');

  const handleCalculate = useCallback(() => {
    let api = 0;
    let sg = 0;

    if (inputType === 'api') {
      api = apiValue;
      if (api > -131.5) {
        sg = 141.5 / (api + 131.5);
      }
    } else {
      sg = sgValue;
      if (sg > 0) {
        api = (141.5 / sg) - 131.5;
      }
    }

    setApiResult(api);
    setSgResult(sg);

    if (sg > 0) {
      // Density of water at 60F is ~999.016 kg/m3 or 8.337 lb/gal
      setDensityKgM3(sg * 999.016);
      setDensityLbGal(sg * 8.337);

      // Classification
      if (api > 31.1) {
        setClassification('Light Crude Oil');
      } else if (api >= 22.3 && api <= 31.1) {
        setClassification('Medium Crude Oil');
      } else if (api >= 10 && api < 22.3) {
        setClassification('Heavy Crude Oil');
      } else {
        setClassification('Extra Heavy Crude Oil / Bitumen');
      }
    } else {
      setDensityKgM3(0);
      setDensityLbGal(0);
      setClassification('');
    }
  }, [inputType, apiValue, sgValue]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.inputType || 'Input Type'}</Label>
              <select 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={inputType}
                onChange={(e) => setInputType(e.target.value as 'api' | 'sg')}
              >
                <option value="api">API Gravity (°API)</option>
                <option value="sg">Specific Gravity (SG)</option>
              </select>
            </div>

            {inputType === 'api' ? (
              <div className="space-y-2">
                <Label>{t?.inputs?.apiValue || 'API Gravity'}</Label>
                <div className="flex gap-2">
                  <Input type="number" value={apiValue} onChange={(e) => setApiValue(Number(e.target.value))} className="min-w-0" />
                  <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">°API</span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>{t?.inputs?.sgValue || 'Specific Gravity (SG)'}</Label>
                <Input type="number" value={sgValue} onChange={(e) => setSgValue(Number(e.target.value))} min={0.1} step={0.01} className="min-w-0" />
                <p className="text-xs text-muted-foreground mt-1">Relative to water at 60°F</p>
              </div>
            )}

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.apiGravity || 'API Gravity'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {apiResult.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">°API</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.specificGravity || 'Specific Gravity (SG)'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {sgResult.toFixed(4)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.densityKgM3 || 'Density'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {densityKgM3.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">kg/m³</span>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                    <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.densityLbGal || 'Density'}</span>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                      {densityLbGal.toFixed(3)} <span className="text-xs font-normal text-muted-foreground">lb/gal</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-orange-200 shadow-sm flex flex-col items-center justify-center bg-orange-50 dark:bg-orange-900/20">
                  <span className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">
                    {t?.results?.classification || 'Oil Classification'}
                  </span>
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400 text-center">
                    {classification}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Density Comparison'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Beaker */}
                  <path d="M 120 20 L 120 130 A 10 10 0 0 0 130 140 L 170 140 A 10 10 0 0 0 180 130 L 180 20" fill="none" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="110" y1="20" x2="190" y2="20" stroke="#94a3b8" strokeWidth="3" />
                  
                  {/* Liquid */}
                  {sgResult > 0 && (
                    <path 
                      d="M 122 70 L 122 130 A 8 8 0 0 0 130 138 L 170 138 A 8 8 0 0 0 178 130 L 178 70 Z" 
                      fill={apiResult > 31.1 ? '#fcd34d' : apiResult > 22.3 ? '#d97706' : '#78350f'} 
                      opacity="0.8" 
                    />
                  )}

                  {/* Reference Water Line */}
                  <line x1="185" y1="90" x2="210" y2="90" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                  <text x="215" y="94" fill="#3b82f6" fontSize="12" fontWeight="bold">Water (SG=1)</text>

                  {/* Oil Level depending on SG (lighter oil = floats higher visually, though it's just a symbol) */}
                  <line x1="185" y1={sgResult > 0 ? (sgResult >= 1 ? 110 : 70) : 70} x2="210" y2={sgResult > 0 ? (sgResult >= 1 ? 110 : 70) : 70} stroke="#f97316" strokeWidth="2" />
                  <text x="215" y={sgResult > 0 ? (sgResult >= 1 ? 114 : 74) : 74} fill="#f97316" fontSize="12" fontWeight="bold">Oil (SG={sgResult.toFixed(2)})</text>
                  
                  {sgResult < 1 ? (
                    <text x="70" y="74" fill="#f97316" fontSize="10" textAnchor="end">Floats on water</text>
                  ) : (
                    <text x="70" y="114" fill="#f97316" fontSize="10" textAnchor="end">Sinks in water</text>
                  )}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApiGravityCalculator;
