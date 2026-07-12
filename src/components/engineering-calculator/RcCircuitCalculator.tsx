import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useI18n } from '@/i18n/I18nProvider';

const RcCircuitCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict?.common?.rcCircuit;

  const [resistance, setResistance] = useState<number>(1000); // Ohms
  const [capacitance, setCapacitance] = useState<number>(0.0001); // Farads
  const [voltage, setVoltage] = useState<number>(12); // Volts

  const [timeConstant, setTimeConstant] = useState<number>(0);
  const [maxCharge, setMaxCharge] = useState<number>(0);

  const handleCalculate = useCallback(() => {
    if (resistance > 0 && capacitance > 0) {
      const tau = resistance * capacitance;
      setTimeConstant(tau);
      setMaxCharge(capacitance * voltage);
    } else {
      setTimeConstant(0);
      setMaxCharge(0);
    }
  }, [resistance, capacitance, voltage]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h3 className="font-semibold mb-4 text-lg border-b pb-2">Inputs</h3>
            
            <div className="space-y-2">
              <Label>{t?.inputs?.resistance || 'Resistance (R)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={resistance} onChange={(e) => setResistance(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">Ω</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.capacitance || 'Capacitance (C)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={capacitance} onChange={(e) => setCapacitance(Number(e.target.value))} min={0.000000001} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">F</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Note: 1 µF = 0.000001 F</p>
            </div>

            <div className="space-y-2">
              <Label>{t?.inputs?.voltage || 'Source Voltage (V)'}</Label>
              <div className="flex gap-2">
                <Input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} min={0.1} className="min-w-0" />
                <span className="flex items-center justify-center bg-muted px-3 rounded-md border shrink-0 w-16 text-sm">V</span>
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
              
              <div className="grid gap-4">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.timeConstant || 'Time Constant (τ)'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{timeConstant.toExponential(3)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">s</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-primary/20 shadow-sm flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">
                    {t?.results?.maxCharge || 'Max Charge (Q)'}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-primary">{maxCharge.toExponential(3)}</span>
                    <span className="text-sm font-normal text-muted-foreground ml-1">C</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visualization */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4 text-sm text-muted-foreground">
                {t?.visualization?.title || 'Capacitor Charging Curve'}
              </h3>
              <div className="relative h-48 w-full flex items-end overflow-hidden bg-white dark:bg-gray-900 rounded-lg border p-2">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  {/* Axes */}
                  <line x1="30" y1="170" x2="380" y2="170" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="30" y1="170" x2="30" y2="20" stroke="#94a3b8" strokeWidth="2" />
                  
                  <text x="380" y="190" fill="#64748b" fontSize="12" textAnchor="end">Time (t)</text>
                  <text x="10" y="30" fill="#64748b" fontSize="12" transform="rotate(-90 20,30)">Voltage (Vc)</text>

                  {/* Max Voltage Line */}
                  <line x1="30" y1="40" x2="380" y2="40" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="5,5" />
                  <text x="380" y="35" fill="#94a3b8" fontSize="10" textAnchor="end">V_max = {voltage}V</text>

                  {/* Charging Curve: Vc(t) = V*(1 - e^(-t/tau)) */}
                  <path 
                    d="M 30 170 Q 100 40, 380 40" 
                    fill="none" 
                    stroke="#3b82f6" 
                    strokeWidth="3" 
                  />

                  {/* 1 Tau Point (63.2%) */}
                  <circle cx="100" cy="87.8" r="4" fill="#ef4444" />
                  <line x1="100" y1="170" x2="100" y2="87.8" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  <line x1="30" y1="87.8" x2="100" y2="87.8" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" />
                  
                  <text x="100" y="185" fill="#ef4444" fontSize="10" textAnchor="middle">1τ</text>
                  <text x="25" y="90" fill="#ef4444" fontSize="10" textAnchor="end">63%</text>

                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RcCircuitCalculator;
