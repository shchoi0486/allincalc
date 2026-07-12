'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function IdealGasCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.common?.idealGas;

  const [calcTarget, setCalcTarget] = useState<'P' | 'V' | 'n' | 'T'>('P');
  
  const [p, setP] = useState('');
  const [pUnit, setPUnit] = useState('atm');
  
  const [v, setV] = useState('');
  const [vUnit, setVUnit] = useState('L');
  
  const [n, setN] = useState('');
  const [nUnit, setNUnit] = useState('mol');
  
  const [tInput, setTInput] = useState('');
  const [tUnit, setTUnit] = useState('K');

  const [chartData, setChartData] = useState<{v: number, p: number}[]>([]);

  // Update default units when unitSystem changes
  useEffect(() => {
    if (unitSystem === 'imperial') {
      setPUnit('psi');
      setVUnit('ft³');
      setTUnit('°F');
    } else {
      setPUnit('atm');
      setVUnit('L');
      setTUnit('°C');
    }
  }, [unitSystem]);

  // Conversions to standard SI (P: Pa, V: m³, T: K, n: mol)
  const pToPa = (val: number, unit: string) => {
    if (unit === 'atm') return val * 101325;
    if (unit === 'kPa') return val * 1000;
    if (unit === 'psi') return val * 6894.76;
    if (unit === 'bar') return val * 100000;
    return val; // Pa
  };
  const paToP = (val: number, unit: string) => {
    if (unit === 'atm') return val / 101325;
    if (unit === 'kPa') return val / 1000;
    if (unit === 'psi') return val / 6894.76;
    if (unit === 'bar') return val / 100000;
    return val;
  };

  const vToM3 = (val: number, unit: string) => {
    if (unit === 'L') return val / 1000;
    if (unit === 'ft³') return val * 0.0283168;
    return val; // m³
  };
  const m3ToV = (val: number, unit: string) => {
    if (unit === 'L') return val * 1000;
    if (unit === 'ft³') return val / 0.0283168;
    return val;
  };

  const tToK = (val: number, unit: string) => {
    if (unit === '°C') return val + 273.15;
    if (unit === '°F') return (val - 32) * 5/9 + 273.15;
    return val; // K
  };
  const kToT = (val: number, unit: string) => {
    if (unit === '°C') return val - 273.15;
    if (unit === '°F') return (val - 273.15) * 9/5 + 32;
    return val;
  };

  const R = 8.314462618; // J/(mol·K) or (Pa·m³)/(mol·K)

  const calculate = () => {
    try {
      const pVal = parseFloat(p);
      const vVal = parseFloat(v);
      const nVal = parseFloat(n);
      const tVal = parseFloat(tInput);

      let pa = pToPa(pVal, pUnit);
      let m3 = vToM3(vVal, vUnit);
      let mol = nVal;
      let k = tToK(tVal, tUnit);

      if (calcTarget === 'P') {
        if (isNaN(m3) || isNaN(mol) || isNaN(k)) throw new Error('Invalid input');
        pa = (mol * R * k) / m3;
        setP(paToP(pa, pUnit).toFixed(4).replace(/\.?0+$/, ''));
      } else if (calcTarget === 'V') {
        if (isNaN(pa) || isNaN(mol) || isNaN(k)) throw new Error('Invalid input');
        m3 = (mol * R * k) / pa;
        setV(m3ToV(m3, vUnit).toFixed(4).replace(/\.?0+$/, ''));
      } else if (calcTarget === 'n') {
        if (isNaN(pa) || isNaN(m3) || isNaN(k)) throw new Error('Invalid input');
        mol = (pa * m3) / (R * k);
        setN(mol.toFixed(4).replace(/\.?0+$/, ''));
      } else if (calcTarget === 'T') {
        if (isNaN(pa) || isNaN(m3) || isNaN(mol)) throw new Error('Invalid input');
        k = (pa * m3) / (mol * R);
        setTInput(kToT(k, tUnit).toFixed(2).replace(/\.?0+$/, ''));
      }

      toast.success(dict?.common?.calculated || 'Calculated successfully.');
      generateChartData(mol, k);
    } catch (e) {
      toast.error(dict?.common?.error || 'Please enter valid numbers.');
    }
  };

  const generateChartData = (mol: number, tempK: number) => {
    if (isNaN(mol) || isNaN(tempK) || mol <= 0 || tempK <= 0) return;
    
    const data = [];
    // Generate volume from 0.1 to 10.0 (relative scale depending on unit system)
    const vBase = unitSystem === 'metric' ? 0.1 : 3.5; // starting m3
    const vStep = unitSystem === 'metric' ? 0.2 : 7.0;

    for (let i = 1; i <= 20; i++) {
      const vol_m3 = vBase * i;
      const pressure_pa = (mol * R * tempK) / vol_m3;
      
      data.push({
        v: m3ToV(vol_m3, vUnit),
        p: paToP(pressure_pa, pUnit),
      });
    }
    setChartData(data);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 입력 필드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
            🧪 {t?.title || "Ideal Gas Law"}
          </h3>
          
          <div className="mb-4 flex justify-between items-center">
            <UnitSystemToggle />
          </div>

          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <label className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2 block">
              {t?.inputs?.calcTarget || "Calculate Target"}
            </label>
            <select
              value={calcTarget}
              onChange={(e) => setCalcTarget(e.target.value as any)}
              className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="P">{t?.inputs?.pressure || "Pressure (P)"}</option>
              <option value="V">{t?.inputs?.volume || "Volume (V)"}</option>
              <option value="n">{t?.inputs?.moles || "Moles (n)"}</option>
              <option value="T">{t?.inputs?.temperature || "Temperature (T)"}</option>
            </select>
          </div>

          <div className="space-y-4 flex-1">
            {/* 압력 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className={`text-sm font-medium mb-1 sm:mb-0 sm:w-1/2 sm:pr-2 ${calcTarget === 'P' ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t?.inputs?.pressure || "Pressure (P)"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  disabled={calcTarget === 'P'}
                  placeholder={calcTarget === 'P' ? '?' : ''}
                  className={`flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${calcTarget === 'P' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 font-bold' : 'dark:bg-gray-800 dark:text-white'}`}
                />
                <select
                  value={pUnit}
                  onChange={(e) => setPUnit(e.target.value)}
                  className="w-20 shrink-0 px-1 py-1.5 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                >
                  <option value="atm">atm</option>
                  <option value="kPa">kPa</option>
                  <option value="psi">psi</option>
                  <option value="bar">bar</option>
                </select>
              </div>
            </div>

            {/* 부피 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className={`text-sm font-medium mb-1 sm:mb-0 sm:w-1/2 sm:pr-2 ${calcTarget === 'V' ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t?.inputs?.volume || "Volume (V)"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={v}
                  onChange={(e) => setV(e.target.value)}
                  disabled={calcTarget === 'V'}
                  placeholder={calcTarget === 'V' ? '?' : ''}
                  className={`flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${calcTarget === 'V' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 font-bold' : 'dark:bg-gray-800 dark:text-white'}`}
                />
                <select
                  value={vUnit}
                  onChange={(e) => setVUnit(e.target.value)}
                  className="w-20 shrink-0 px-1 py-1.5 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                >
                  <option value="L">L</option>
                  <option value="m³">m³</option>
                  <option value="ft³">ft³</option>
                </select>
              </div>
            </div>

            {/* 몰수 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className={`text-sm font-medium mb-1 sm:mb-0 sm:w-1/2 sm:pr-2 ${calcTarget === 'n' ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t?.inputs?.moles || "Moles (n)"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  disabled={calcTarget === 'n'}
                  placeholder={calcTarget === 'n' ? '?' : ''}
                  className={`flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${calcTarget === 'n' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 font-bold' : 'dark:bg-gray-800 dark:text-white'}`}
                />
                <span className="w-20 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                  mol
                </span>
              </div>
            </div>

            {/* 온도 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className={`text-sm font-medium mb-1 sm:mb-0 sm:w-1/2 sm:pr-2 ${calcTarget === 'T' ? 'text-blue-600 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                {t?.inputs?.temperature || "Temperature (T)"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={tInput}
                  onChange={(e) => setTInput(e.target.value)}
                  disabled={calcTarget === 'T'}
                  placeholder={calcTarget === 'T' ? '?' : ''}
                  className={`flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${calcTarget === 'T' ? 'bg-gray-100 dark:bg-gray-700 text-blue-600 font-bold' : 'dark:bg-gray-800 dark:text-white'}`}
                />
                <select
                  value={tUnit}
                  onChange={(e) => setTUnit(e.target.value)}
                  className="w-20 shrink-0 px-1 py-1.5 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs"
                >
                  <option value="K">K</option>
                  <option value="°C">°C</option>
                  <option value="°F">°F</option>
                </select>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
            {dict?.common?.calculate || "계산하기"}
          </Button>
        </div>

        {/* 우측: 차트 시각화 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            📈 {t?.visualization?.title || "Isotherm (P-V Curve)"}
          </h3>
          
          {chartData.length > 0 ? (
            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.5} />
                  <XAxis 
                    dataKey="v" 
                    type="number"
                    domain={['dataMin', 'dataMax']}
                    label={{ value: `${t?.visualization?.xAxis || 'Volume'} (${vUnit})`, position: 'bottom', offset: 0 }} 
                  />
                  <YAxis 
                    dataKey="p" 
                    type="number"
                    domain={['auto', 'auto']}
                    label={{ value: `${t?.visualization?.yAxis || 'Pressure'} (${pUnit})`, angle: -90, position: 'insideLeft', offset: 10 }} 
                  />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => {
                      if (name === 'p') return [`${value.toFixed(2)} ${pUnit}`, t?.visualization?.yAxis || 'Pressure'];
                      return value;
                    }}
                    labelFormatter={(label) => `${t?.visualization?.xAxis || 'Volume'}: ${Number(label).toFixed(2)} ${vUnit}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="p" 
                    stroke="#8b5cf6" 
                    strokeWidth={3} 
                    dot={false}
                  />
                  {/* 계산된 현재 포인트 표시 */}
                  {calcTarget !== 'P' && calcTarget !== 'V' && (
                    <ReferenceLine x={parseFloat(v)} stroke="red" strokeDasharray="3 3" />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
              {dict?.common?.enterValues || "Please enter values to calculate"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}