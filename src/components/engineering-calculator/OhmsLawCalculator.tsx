'use client';

import React, { useState, useEffect } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

export default function OhmsLawCalculator() {
  const { dict } = useI18n();
  const t = dict?.common?.ohmsLaw;

  // inputs
  const [v, setV] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');
  const [p, setP] = useState('');

  // Count how many inputs are filled
  const getFilledCount = () => {
    let count = 0;
    if (v !== '') count++;
    if (i !== '') count++;
    if (r !== '') count++;
    if (p !== '') count++;
    return count;
  };

  const calculate = () => {
    const filledCount = getFilledCount();
    
    if (filledCount < 2) {
      toast.error(t?.results?.enterTwo || 'Please enter exactly 2 values.');
      return;
    }
    
    if (filledCount > 2) {
      toast.error(t?.results?.clearTwo || 'Please clear at least 2 fields to calculate.');
      return;
    }

    const V = parseFloat(v);
    const I = parseFloat(i);
    const R = parseFloat(r);
    const P = parseFloat(p);

    let calcV = V;
    let calcI = I;
    let calcR = R;
    let calcP = P;

    // V and I
    if (!isNaN(V) && !isNaN(I)) {
      calcR = V / I;
      calcP = V * I;
    }
    // V and R
    else if (!isNaN(V) && !isNaN(R)) {
      calcI = V / R;
      calcP = (V * V) / R;
    }
    // V and P
    else if (!isNaN(V) && !isNaN(P)) {
      calcI = P / V;
      calcR = (V * V) / P;
    }
    // I and R
    else if (!isNaN(I) && !isNaN(R)) {
      calcV = I * R;
      calcP = I * I * R;
    }
    // I and P
    else if (!isNaN(I) && !isNaN(P)) {
      calcV = P / I;
      calcR = P / (I * I);
    }
    // R and P
    else if (!isNaN(R) && !isNaN(P)) {
      calcV = Math.sqrt(P * R);
      calcI = Math.sqrt(P / R);
    }

    setV(isNaN(calcV) ? '' : calcV.toFixed(4).replace(/\.?0+$/, ''));
    setI(isNaN(calcI) ? '' : calcI.toFixed(4).replace(/\.?0+$/, ''));
    setR(isNaN(calcR) ? '' : calcR.toFixed(4).replace(/\.?0+$/, ''));
    setP(isNaN(calcP) ? '' : calcP.toFixed(4).replace(/\.?0+$/, ''));

    toast.success(t?.results?.calculated || 'Calculated successfully.');
  };

  const clearAll = () => {
    setV('');
    setI('');
    setR('');
    setP('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 좌측: 입력 필드 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
          ⚡ {t?.title || "Ohm's Law Calculator"}
        </h3>
        
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {t?.description || "Enter any 2 values to calculate the remaining values."}
        </p>

        <div className="space-y-4 flex-1">
          {/* 전압 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.voltage || "Voltage (V)"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={v}
                onChange={(e) => setV(e.target.value)}
                className={`flex-1 min-w-0 px-2 py-1.5 border ${v ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm`}
              />
              <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                V
              </span>
            </div>
          </div>

          {/* 전류 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.current || "Current (I)"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={i}
                onChange={(e) => setI(e.target.value)}
                className={`flex-1 min-w-0 px-2 py-1.5 border ${i ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm`}
              />
              <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                A
              </span>
            </div>
          </div>

          {/* 저항 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.resistance || "Resistance (R)"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={r}
                onChange={(e) => setR(e.target.value)}
                className={`flex-1 min-w-0 px-2 py-1.5 border ${r ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm`}
              />
              <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                Ω
              </span>
            </div>
          </div>

          {/* 전력 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {t?.inputs?.power || "Power (P)"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={p}
                onChange={(e) => setP(e.target.value)}
                className={`flex-1 min-w-0 px-2 py-1.5 border ${p ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'} rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white text-sm`}
              />
              <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs font-semibold">
                W
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={clearAll} variant="outline" className="w-1/3">
            {dict?.common?.clear || "초기화"}
          </Button>
          <Button onClick={calculate} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
            {dict?.common?.calculate || "계산하기"}
          </Button>
        </div>
      </div>

      {/* 우측: 시각적 공식 요약 (결과 필드 겸용) */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full justify-center items-center">
        <h3 className="text-xl font-semibold mb-6 w-full flex items-center shrink-0">
          📊 {t?.details?.title || "Ohm's Law Wheel"}
        </h3>
        
        {/* 옴의 법칙 다이어그램 (Wheel) */}
        <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full border-4 border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden shrink-0">
          {/* 구분선 */}
          <div className="absolute w-full h-1 bg-gray-300 dark:bg-gray-600 top-1/2 left-0 transform -translate-y-1/2"></div>
          <div className="absolute w-1 h-full bg-gray-300 dark:bg-gray-600 top-0 left-1/2 transform -translate-x-1/2"></div>
          
          {/* 중앙 원 (변수들) */}
          <div className="absolute w-28 h-28 sm:w-36 sm:h-36 bg-white dark:bg-gray-800 rounded-full border-4 border-gray-300 dark:border-gray-600 z-10 flex items-center justify-center shadow-lg">
            <div className="grid grid-cols-2 grid-rows-2 w-full h-full text-center">
              <div className="flex items-center justify-center border-r-2 border-b-2 border-gray-200 dark:border-gray-700 font-bold text-xl sm:text-2xl text-blue-600">V</div>
              <div className="flex items-center justify-center border-b-2 border-gray-200 dark:border-gray-700 font-bold text-xl sm:text-2xl text-green-600">P</div>
              <div className="flex items-center justify-center border-r-2 border-gray-200 dark:border-gray-700 font-bold text-xl sm:text-2xl text-red-600">R</div>
              <div className="flex items-center justify-center font-bold text-xl sm:text-2xl text-yellow-600">I</div>
            </div>
          </div>

          {/* V 구역 (좌상단) */}
          <div className="absolute top-10 left-10 sm:top-16 sm:left-16 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1">
            <span>V = I × R</span>
            <span>V = P / I</span>
            <span>V = √(P × R)</span>
          </div>

          {/* P 구역 (우상단) */}
          <div className="absolute top-10 right-10 sm:top-16 sm:right-16 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1">
            <span>P = V × I</span>
            <span>P = I² × R</span>
            <span>P = V² / R</span>
          </div>

          {/* R 구역 (좌하단) */}
          <div className="absolute bottom-10 left-10 sm:bottom-16 sm:left-16 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1">
            <span>R = V / I</span>
            <span>R = V² / P</span>
            <span>R = P / I²</span>
          </div>

          {/* I 구역 (우하단) */}
          <div className="absolute bottom-10 right-10 sm:bottom-16 sm:right-16 text-xs sm:text-sm font-mono text-gray-700 dark:text-gray-300 flex flex-col items-center gap-0.5 sm:gap-1">
            <span>I = V / R</span>
            <span>I = P / V</span>
            <span>I = √(P / R)</span>
          </div>
        </div>
      </div>
    </div>
  );
}