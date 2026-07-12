import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const Iso2533AtmosphereCalculator = () => {
  const { dict, unitSystem, locale } = useI18n();
  const t = dict?.common?.iso2533Atmosphere;

  const isImperial = unitSystem === 'imperial';

  const [altitude, setAltitude] = useState<number>(0); // m or ft

  const [temperature, setTemperature] = useState<number>(0); // C or F
  const [pressure, setPressure] = useState<number>(0); // Pa or psi
  const [density, setDensity] = useState<number>(0); // kg/m3 or lb/ft3
  const [speedOfSound, setSpeedOfSound] = useState<number>(0); // m/s or ft/s

  const handleCalculate = useCallback(() => {
    // ISO 2533 Constants (Troposphere: 0 to 11,000m)
    const T0 = 288.15; // K
    const P0 = 101325; // Pa
    const L = 0.0065; // K/m
    const R = 8.31432; // J/(mol*K)
    const M = 0.0289644; // kg/mol
    const g = 9.80665; // m/s2
    const gamma = 1.4;

    let h_m = altitude;
    if (isImperial) {
      h_m = altitude * 0.3048; // ft to m
    }

    if (h_m < -2000 || h_m > 11000) {
      // Simplified: restrict to troposphere for accurate simple equations
      // Just clamp or calculate (real ISO extends higher with different lapse rates)
      // For this tool, let's limit the calculation visually or use standard lapse rate anyway, 
      // but cap it physically if it goes way off.
    }

    // T = T0 - L * h
    const T_K = T0 - L * h_m;
    
    // P = P0 * (1 - L*h/T0)^(g*M / (R*L))
    const exponent = (g * M) / (R * L);
    const P_Pa = P0 * Math.pow(1 - (L * h_m) / T0, exponent);
    
    // rho = (P * M) / (R * T)
    const rho_kgm3 = (P_Pa * M) / (R * T_K);
    
    // a = sqrt(gamma * R_specific * T) => R_specific = R/M = 287.05
    const a_ms = Math.sqrt(gamma * (R / M) * T_K);

    if (isImperial) {
      setTemperature((T_K - 273.15) * 9/5 + 32); // K to F
      setPressure(P_Pa * 0.000145038); // Pa to psi
      setDensity(rho_kgm3 * 0.062428); // kg/m3 to lb/ft3
      setSpeedOfSound(a_ms * 3.28084); // m/s to ft/s
    } else {
      setTemperature(T_K - 273.15); // K to C
      setPressure(P_Pa); // Pa
      setDensity(rho_kgm3); // kg/m3
      setSpeedOfSound(a_ms); // m/s
    }

  }, [altitude, isImperial]);

  const altUnit = isImperial ? 'ft' : 'm';
  const tempUnit = isImperial ? '°F' : '°C';
  const pressUnit = isImperial ? 'psi' : 'Pa';
  const denUnit = isImperial ? 'lb/ft³' : 'kg/m³';
  const speedUnit = isImperial ? 'ft/s' : 'm/s';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.altitude || 'Altitude (h)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={altitude} onChange={(e) => setAltitude(Number(e.target.value))} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">{altUnit}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Calculations based on Troposphere model (-2km to 11km)</p>
            </div>

            <button type="button" onClick={handleCalculate} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors mt-2">{locale === 'ko' ? '계산하기' : 'Calculate'}</button>
          </CardContent>
        </Card>

        {/* Results and Visualization */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-4 space-y-4 bg-primary/5">
              <h3 className="font-semibold mb-4 text-lg border-b border-primary/20 pb-2">Results</h3>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.temperature || 'Temperature'}</span>
                  <div className="text-lg font-bold text-red-500">
                    {temperature.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">{tempUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.pressure || 'Pressure'}</span>
                  <div className="text-lg font-bold text-blue-600">
                    {isImperial ? pressure.toFixed(3) : pressure.toFixed(0)} <span className="text-xs font-normal text-muted-foreground">{pressUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.density || 'Air Density'}</span>
                  <div className="text-lg font-bold text-green-600">
                    {density.toFixed(4)} <span className="text-xs font-normal text-muted-foreground">{denUnit}</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-primary/20 shadow-sm flex flex-col justify-center items-center">
                  <span className="text-xs font-medium text-muted-foreground mb-1">{t?.results?.speedOfSound || 'Speed of Sound'}</span>
                  <div className="text-lg font-bold text-purple-600">
                    {speedOfSound.toFixed(1)} <span className="text-xs font-normal text-muted-foreground">{speedUnit}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Atmospheric Profile'}
              </h3>
              <div className="relative h-48 w-full bg-white dark:bg-gray-900 rounded-lg border p-4 flex items-end justify-center overflow-hidden">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Ground */}
                  <rect x="0" y="180" width="200" height="20" fill="#22c55e" opacity="0.5" />
                  
                  {/* Sky gradient background */}
                  <defs>
                    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1e3a8a" />
                      <stop offset="100%" stopColor="#93c5fd" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="200" height="180" fill="url(#sky)" opacity="0.3" />

                  {/* Altitude indicator line */}
                  {(() => {
                    const maxAlt = isImperial ? 36000 : 11000;
                    const altRatio = Math.max(0, Math.min(1, altitude / maxAlt));
                    const yPos = 180 - (altRatio * 160);

                    return (
                      <g>
                        <line x1="20" y1={yPos} x2="180" y2={yPos} stroke="#ef4444" strokeWidth="2" strokeDasharray="4" />
                        <polygon points={`20,${yPos} 30,${yPos-5} 30,${yPos+5}`} fill="#ef4444" />
                        <text x="35" y={yPos - 5} fill="#ef4444" fontSize="12" fontWeight="bold">{altitude} {altUnit}</text>
                      </g>
                    );
                  })()}

                  {/* Clouds for scale */}
                  <path d="M 140 100 Q 150 90, 160 100 Q 170 95, 175 105 Q 185 110, 175 115 L 140 115 Q 130 110, 140 100 Z" fill="#ffffff" opacity="0.8" />
                  <path d="M 60 60 Q 70 50, 80 60 Q 90 55, 95 65 Q 105 70, 95 75 L 60 75 Q 50 70, 60 60 Z" fill="#ffffff" opacity="0.6" />

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Iso2533AtmosphereCalculator;
