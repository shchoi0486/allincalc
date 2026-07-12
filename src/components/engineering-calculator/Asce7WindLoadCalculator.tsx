import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const Asce7WindLoadCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.asce7WindLoad;

  const isImperial = unitSystem === 'imperial';

  const [windSpeed, setWindSpeed] = useState<number>(isImperial ? 115 : 51.4); // mph or m/s
  const [exposure, setExposure] = useState<string>('B'); // B, C, D
  const [height, setHeight] = useState<number>(isImperial ? 30 : 9.1); // ft or m
  const [topographic, setTopographic] = useState<number>(1.0); // K_zt
  const [directionality, setDirectionality] = useState<number>(0.85); // K_d

  const [velocityPressure, setVelocityPressure] = useState<number>(0);
  const [exposureCoeff, setExposureCoeff] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (windSpeed > 0 && height > 0 && topographic > 0 && directionality > 0) {
      let z_ft = isImperial ? height : height * 3.28084;
      let v_mph = isImperial ? windSpeed : windSpeed * 2.23694;

      if (z_ft < 15) z_ft = 15; // Minimum height for Kz calculation is 15 ft

      // ASCE 7-16 Exposure Constants
      let alpha, z_g;
      if (exposure === 'B') {
        alpha = 7.0; z_g = 1200;
      } else if (exposure === 'C') {
        alpha = 9.5; z_g = 900;
      } else { // D
        alpha = 11.5; z_g = 700;
      }

      // Kz calculation
      const kz = 2.01 * Math.pow((z_ft / z_g), 2 / alpha);
      setExposureCoeff(kz);

      // qz calculation (psf)
      const qz_psf = 0.00256 * kz * topographic * directionality * Math.pow(v_mph, 2);

      if (isImperial) {
        setVelocityPressure(qz_psf);
      } else {
        // Convert psf to N/m2 (Pa) => 1 psf = 47.8803 Pa
        setVelocityPressure(qz_psf * 47.8803);
      }
    } else {
      setVelocityPressure(0);
      setExposureCoeff(0);
    }
  }, [windSpeed, exposure, height, topographic, directionality, isImperial]);

  const windUnit = isImperial ? 'mph' : 'm/s';
  const heightUnit = isImperial ? 'ft' : 'm';
  const pressureUnit = isImperial ? 'psf' : 'Pa';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.windSpeed || 'Basic Wind Speed (V)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={windSpeed} onChange={(e) => setWindSpeed(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{windUnit}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.exposure || 'Exposure Category'}</Label>
              <div className="flex gap-2">
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={exposure}
                  onChange={(e) => setExposure(e.target.value)}
                >
                  <option value="B">Exposure B (Urban/Suburban)</option>
                  <option value="C">Exposure C (Open Terrain)</option>
                  <option value="D">Exposure D (Flat, unobstructed)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.height || 'Mean Roof Height (z)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} min={1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{heightUnit}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t?.inputs?.topographic || 'Topographic (K_zt)'}</Label>
                <Input type="number" value={topographic} onChange={(e) => setTopographic(Number(e.target.value))} min={1} step={0.1} />
              </div>
              <div className="space-y-2">
                <Label>{t?.inputs?.directionality || 'Directionality (K_d)'}</Label>
                <Input type="number" value={directionality} onChange={(e) => setDirectionality(Number(e.target.value))} min={0.5} max={1} step={0.05} />
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
              
              <div className="grid gap-3">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-blue-200 shadow-sm flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                    {t?.results?.velocityPressure || 'Velocity Pressure (q_z)'}
                  </span>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {velocityPressure.toFixed(2)} <span className="text-lg font-normal text-muted-foreground">{pressureUnit}</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">{t?.results?.exposureCoeff || 'Exposure Coeff. (K_z)'}</span>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-700 dark:text-gray-200">{exposureCoeff.toFixed(3)}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Wind Pressure Profile'}
              </h3>
              <div className="relative h-48 w-full bg-slate-50 dark:bg-gray-900 rounded-lg border p-4 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full">
                  {/* Ground */}
                  <line x1="10" y1="180" x2="290" y2="180" stroke="#64748b" strokeWidth="4" />
                  
                  {/* Building */}
                  <rect x="180" y="60" width="60" height="120" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
                  <text x="210" y="120" fill="#475569" fontSize="12" textAnchor="middle" transform="rotate(-90 210,120)">z = {height} {heightUnit}</text>
                  
                  {/* Wind Profile Curve */}
                  <path d="M 50 180 Q 90 120 140 60" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="4" />
                  
                  {/* Wind Arrows */}
                  <g stroke="#3b82f6" strokeWidth="2" markerEnd="url(#arrow-blue)">
                    <line x1="50" y1="160" x2="175" y2="160" />
                    <line x1="80" y1="120" x2="175" y2="120" />
                    <line x1="120" y1="80" x2="175" y2="80" />
                  </g>
                  
                  {/* Labels */}
                  <text x="110" y="50" fill="#2563eb" fontSize="12" fontWeight="bold">q_z = {velocityPressure.toFixed(1)} {pressureUnit}</text>
                  <text x="60" y="110" fill="#3b82f6" fontSize="10">V = {windSpeed} {windUnit}</text>
                  
                  <defs>
                    <marker id="arrow-blue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                      <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
                    </marker>
                  </defs>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Asce7WindLoadCalculator;
