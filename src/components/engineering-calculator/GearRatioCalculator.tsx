import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const GearRatioCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.gearRatio;

  const [teeth1, setTeeth1] = useState<number>(20);
  const [teeth2, setTeeth2] = useState<number>(40);
  const [speed1, setSpeed1] = useState<number>(1000);
  const [torque1, setTorque1] = useState<number>(50);

  const [gearRatio, setGearRatio] = useState<number>(0);
  const [speed2, setSpeed2] = useState<number>(0);
  const [torque2, setTorque2] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (teeth1 > 0 && teeth2 > 0) {
      const ratio = teeth2 / teeth1;
      setGearRatio(ratio);
      setSpeed2(speed1 / ratio);
      setTorque2(torque1 * ratio);
    }
  }, [teeth1, teeth2, speed1, torque1]);

  const torqueUnit = unitSystem === 'imperial' ? 'lb-ft' : 'N·m';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            <div className="space-y-2">
              <Label>{t?.inputs?.teeth1 || 'Driving Gear Teeth (N₁)'}</Label>
              <Input
                type="number"
                value={teeth1}
                onChange={(e) => setTeeth1(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.teeth2 || 'Driven Gear Teeth (N₂)'}</Label>
              <Input
                type="number"
                value={teeth2}
                onChange={(e) => setTeeth2(Number(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.speed1 || 'Driving Gear Speed (RPM₁)'}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={speed1}
                  onChange={(e) => setSpeed1(Number(e.target.value))}
                  min={0}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">
                  RPM
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>{t?.inputs?.torque1 || 'Driving Gear Torque (τ₁)'}</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={torque1}
                  onChange={(e) => setTorque1(Number(e.target.value))}
                  min={0}
                  className="min-w-0"
                />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-20 text-sm">
                  {torqueUnit}
                </span>
              </div>
            </div>
            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.gearRatio || 'Gear Ratio (GR)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {gearRatio.toFixed(2)} : 1
                  </span>
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.speed2 || 'Driven Gear Speed (RPM₂)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {speed2.toFixed(2)} <span className="text-sm font-normal text-muted-foreground ml-1">RPM</span>
                  </span>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.torque2 || 'Driven Gear Torque (τ₂)'}
                  </span>
                  <span className="text-xl font-bold text-primary">
                    {torque2.toFixed(2)} <span className="text-sm font-normal text-muted-foreground ml-1">{torqueUnit}</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Gear Train Visualization'}
              </h3>
              <div className="relative h-48 w-full flex items-center justify-center overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-lg border">
                <div className="flex items-center gap-1">
                  {/* Driving Gear */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative rounded-full border-4 border-blue-500 border-dashed flex items-center justify-center"
                      style={{ 
                        width: '80px', 
                        height: '80px',
                        animation: speed1 > 0 ? `spin ${60/speed1}s linear infinite` : 'none',
                        animationDirection: 'normal'
                      }}
                    >
                      <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      <div className="absolute w-full h-1 bg-blue-200"></div>
                      <div className="absolute h-full w-1 bg-blue-200"></div>
                    </div>
                    <span className="mt-2 text-xs font-bold text-blue-600">N₁: {teeth1}</span>
                  </div>

                  {/* Driven Gear */}
                  <div className="flex flex-col items-center">
                    <div 
                      className="relative rounded-full border-4 border-green-500 border-dashed flex items-center justify-center"
                      style={{ 
                        width: `${Math.max(40, Math.min(160, 80 * gearRatio))}px`, 
                        height: `${Math.max(40, Math.min(160, 80 * gearRatio))}px`,
                        animation: speed2 > 0 ? `spin ${60/speed2}s linear infinite` : 'none',
                        animationDirection: 'reverse'
                      }}
                    >
                      <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                      <div className="absolute w-full h-1 bg-green-200"></div>
                      <div className="absolute h-full w-1 bg-green-200"></div>
                    </div>
                    <span className="mt-2 text-xs font-bold text-green-600">N₂: {teeth2}</span>
                  </div>
                </div>
                
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                `}} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GearRatioCalculator;
