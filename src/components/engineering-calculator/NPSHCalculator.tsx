'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';

const NPSHVisualization = dynamic(() => import('@/components/engineering-calculator/NPSHVisualization'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full" />
});

// 압력 단위 변환 함수
const convertPressure = (value: number, fromUnit: string, toUnit: string): number => {
  // 모든 값을 Pa로 변환
  let valueInPa = value;
  switch (fromUnit) {
    case 'Pa': valueInPa = value; break;
    case 'kPa': valueInPa = value * 1000; break;
    case 'bar': valueInPa = value * 100000; break;
    case 'psi': valueInPa = value * 6895; break;
    case 'mmHg': valueInPa = value * 133.322; break;
    case 'atm': valueInPa = value * 101325; break;
  }
  
  // Pa에서 목표 단위로 변환
  switch (toUnit) {
    case 'Pa': return valueInPa;
    case 'kPa': return valueInPa / 1000;
    case 'bar': return valueInPa / 100000;
    case 'psi': return valueInPa / 6895;
    case 'mmHg': return valueInPa / 133.322;
    case 'atm': return valueInPa / 101325;
    default: return valueInPa;
  }
};

// 물의 증기압 계산 (Antoine 방정식) - 하위 호환성을 위해 유지
const getWaterVaporPressure = (temp: number): number => {
  const A = 8.07131;
  const B = 1730.63;
  const C = 233.426;
  
  const logP = A - (B / (C + temp));
  const pressureMmHg = Math.pow(10, logP);
  const pressurePa = pressureMmHg * 133.322;
  
  return pressurePa;
};

// 선택된 유체의 증기압 계산 (Antoine 방정식)
const getVaporPressure = (temp: number, fluidKey: string): number => {
  const fluid = ANTOINE_DATABASE[fluidKey];
  if (!fluid) {
    console.warn(`Unknown fluid: ${fluidKey}, using water as default`);
    return getWaterVaporPressure(temp);
  }
  
  // 온도 범위 확인
  if (temp < fluid.tMin || temp > fluid.tMax) {
    console.warn(`Temperature ${temp}°C is outside valid range (${fluid.tMin}°C to ${fluid.tMax}°C) for ${fluid.name}`);
  }
  
  const { A, B, C } = fluid;
  const logP = A - (B / (C + temp));
  const pressureMmHg = Math.pow(10, logP);
  const pressurePa = pressureMmHg * 133.322;
  
  return pressurePa;
};

// Antoine 계수 데이터베이스
interface AntoineCoefficients {
  A: number;
  B: number;
  C: number;
  tMin: number;
  tMax: number;
  name: string;
  density: number; // kg/m³ at 20°C
}

const ANTOINE_DATABASE: Record<string, AntoineCoefficients> = {
  water: {
    A: 8.07131,
    B: 1730.63,
    C: 233.426,
    tMin: -20,
    tMax: 100,
    name: '물 (Water)',
    density: 998.2
  },
  ethanol: {
    A: 8.20417,
    B: 1642.89,
    C: 230.300,
    tMin: -57,
    tMax: 80,
    name: '에탄올 (Ethanol)',
    density: 789.0
  },
  benzene: {
    A: 6.90565,
    B: 1211.033,
    C: 220.79,
    tMin: -16,
    tMax: 104,
    name: '벤젠 (Benzene)',
    density: 876.5
  },
  toluene: {
    A: 6.95464,
    B: 1344.8,
    C: 219.482,
    tMin: -95,
    tMax: 110,
    name: '톨루엔 (Toluene)',
    density: 866.9
  },
  acetone: {
    A: 7.2316,
    B: 1277.03,
    C: 237.23,
    tMin: -32,
    tMax: 77,
    name: '아세톤 (Acetone)',
    density: 784.0
  },
  methanol: {
    A: 8.08097,
    B: 1582.271,
    C: 239.726,
    tMin: -44,
    tMax: 64,
    name: '메탄올 (Methanol)',
    density: 791.8
  },
  chloroform: {
    A: 6.9371,
    B: 1171.2,
    C: 227,
    tMin: -13,
    tMax: 97,
    name: '클로로포름 (Chloroform)',
    density: 1489.0
  },
  cyclohexane: {
    A: 6.8413,
    B: 1201.531,
    C: 222.647,
    tMin: 6,
    tMax: 105,
    name: '사이클로헥산 (Cyclohexane)',
    density: 778.1
  }
};

export default function NPSHCalculator({ dict }: { dict?: any }) {
  const { unitSystem, locale } = useI18n();
  const isKo = locale === 'ko';
  const headUnit = unitSystem === 'imperial' ? 'ft' : 'm';
  const headFactor = unitSystem === 'imperial' ? 3.28084 : 1;
  const lengthUnitDefault = unitSystem === 'imperial' ? 'ft' : 'm';
  const pressureUnitDefault = unitSystem === 'imperial' ? 'psi' : 'kPa';
  const temperatureUnitDefault = unitSystem === 'imperial' ? '°F' : '°C';
  const densityUnitDefault = unitSystem === 'imperial' ? 'lb/ft³' : 'kg/m³';

  const convertTemperature = (value: number, from: string, to: string) => {
    if (from === to) return value;
    if (from === '°C' && to === '°F') return (value * 9) / 5 + 32;
    if (from === '°F' && to === '°C') return ((value - 32) * 5) / 9;
    return value;
  };

  const convertDensity = (value: number, from: string, to: string) => {
    if (from === to) return value;
    const KG_M3_PER_LB_FT3 = 16.018463;
    if (from === 'kg/m³' && to === 'lb/ft³') return value / KG_M3_PER_LB_FT3;
    if (from === 'lb/ft³' && to === 'kg/m³') return value * KG_M3_PER_LB_FT3;
    return value;
  };

  const [isLoading, setIsLoading] = useState(false);
  const [showFormulas, setShowFormulas] = useState(true);

  const getAdjustedFormulasContent = () => {
    let html = dict?.details?.content || '';
    if (unitSystem === 'imperial') {
      html = html
        .replace(/\(Pa\)/g, '(psi, psf)')
        .replace(/\(kg\/m³\)/g, '(lb/ft³)')
        .replace(/9\.81\s*m\/s²/g, '32.174 ft/s²')
        .replace(/온도\s*\(°C\)/g, '온도 (°F)')
        .replace(/temperature\s*\(°C\)/gi, 'temperature (°F)');
    } else {
      html = html
        .replace(/\(Pa\)/g, '(kPa, Pa)');
    }
    return html;
  };
  
  // 계산 상태 관리
  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedNPSH, setCalculatedNPSH] = useState<number | null>(null);

  // Tank Position 상태
  const [tankPosition, setTankPosition] = useState<'above' | 'below'>('above');

  // 탱크 타입 상태 (대기개방식/밀폐탱크)
  const [tankType, setTankType] = useState<'open' | 'closed'>('open');

  // 선택된 유체 상태
  const [selectedFluid, setSelectedFluid] = useState<string>('water');

  // 입력 상태
  const [atmosphericPressure, setAtmosphericPressure] = useState<string>(
    unitSystem === 'imperial' ? '14.696' : '101.325'
  );
  const [atmosphericPressureUnit, setAtmosphericPressureUnit] = useState<string>(pressureUnitDefault);
  
  const [surfacePressure, setSurfacePressure] = useState<string>('0');
  const [surfacePressureUnit, setSurfacePressureUnit] = useState<string>(pressureUnitDefault);
  
  const [vaporPressure, setVaporPressure] = useState<string>(
    unitSystem === 'imperial' ? '0.339' : '2.337'
  );
  const [vaporPressureUnit, setVaporPressureUnit] = useState<string>(pressureUnitDefault);
  
  const [liquidDensity, setLiquidDensity] = useState<string>(
    unitSystem === 'imperial' ? convertDensity(998.2, 'kg/m³', 'lb/ft³').toFixed(1) : '998.2'
  );
  const [liquidDensityUnit, setLiquidDensityUnit] = useState<string>(densityUnitDefault);

  const [temperature, setTemperature] = useState<string>(
    unitSystem === 'imperial' ? convertTemperature(20, '°C', '°F').toFixed(0) : '20'
  );
  const [temperatureUnit, setTemperatureUnit] = useState<string>(temperatureUnitDefault);
  
  const [distance, setDistance] = useState<string>(unitSystem === 'imperial' ? '6.562' : '2');
  const [distanceUnit, setDistanceUnit] = useState<string>(lengthUnitDefault);
  const [frictionLoss, setFrictionLoss] = useState<string>(unitSystem === 'imperial' ? '4.921' : '1.5');
  const [frictionLossUnit, setFrictionLossUnit] = useState<string>(lengthUnitDefault);
  
  // NPSHR 입력 상태 추가
  const [npshr, setNpshr] = useState<string>('');
  const [npshrUnit, setNpshrUnit] = useState<string>(headUnit);

  useEffect(() => {
    const nextPressureUnit = unitSystem === 'imperial' ? 'psi' : 'kPa';
    setAtmosphericPressure(unitSystem === 'imperial' ? '14.696' : '101.325');
    setAtmosphericPressureUnit(nextPressureUnit);
    setSurfacePressure('0');
    setSurfacePressureUnit(nextPressureUnit);
    setVaporPressure(unitSystem === 'imperial' ? '0.339' : '2.337');
    setVaporPressureUnit(nextPressureUnit);
    setLiquidDensity(unitSystem === 'imperial' ? convertDensity(998.2, 'kg/m³', 'lb/ft³').toFixed(1) : '998.2');
    setLiquidDensityUnit(unitSystem === 'imperial' ? 'lb/ft³' : 'kg/m³');
    setTemperature(unitSystem === 'imperial' ? convertTemperature(20, '°C', '°F').toFixed(0) : '20');
    setTemperatureUnit(unitSystem === 'imperial' ? '°F' : '°C');
    setDistance(unitSystem === 'imperial' ? '6.562' : '2');
    setDistanceUnit(unitSystem === 'imperial' ? 'ft' : 'm');
    setFrictionLoss(unitSystem === 'imperial' ? '4.921' : '1.5');
    setFrictionLossUnit(unitSystem === 'imperial' ? 'ft' : 'm');
    setNpshr('');
    setNpshrUnit(unitSystem === 'imperial' ? 'ft' : 'm');
  }, [unitSystem]);

  // 유체 변경 시 밀도 자동 업데이트
  useEffect(() => {
    const fluid = ANTOINE_DATABASE[selectedFluid];
    if (fluid) {
      const densityInUnit = convertDensity(fluid.density, 'kg/m³', liquidDensityUnit);
      setLiquidDensity(densityInUnit.toFixed(liquidDensityUnit === 'kg/m³' ? 1 : 2));
    }
  }, [selectedFluid]);

  // 온도 또는 유체 변화 시 증기압 자동 계산
  useEffect(() => {
    const tempDisplay = parseFloat(temperature);
    const temp = convertTemperature(tempDisplay, temperatureUnit, '°C');
    if (!isNaN(temp)) {
      const vaporPressurePa = getVaporPressure(temp, selectedFluid);
      const vaporPressureInUnit = convertPressure(vaporPressurePa, 'Pa', vaporPressureUnit);
      setVaporPressure(vaporPressureInUnit.toFixed(3));
    }
  }, [temperature, temperatureUnit, selectedFluid, vaporPressureUnit]);

  // 탱크 타입 변경 시 표면압력 자동 제어
  useEffect(() => {
    if (tankType === 'open') {
      // 대기개방식: 표면압력을 0으로 설정
      setSurfacePressure('0');
    }
  }, [tankType]);

  // 계산 결과 상태
  const [result, setResult] = useState<{
    npshAvailable: number;
    atmosphericHead: number;
    vaporHead: number;
    surfaceHead: number;
    safetyStatus: 'Safe' | 'Caution' | 'Danger';
  } | null>(null);

  const handleCalculate = () => {
    try {
      setIsLoading(true);
      
      // 모든 압력을 Pa로 변환
      const atmPressurePa = convertPressure(parseFloat(atmosphericPressure), atmosphericPressureUnit, 'Pa');
      const surfPressurePa = convertPressure(parseFloat(surfacePressure), surfacePressureUnit, 'Pa');
      const vapPressurePa = convertPressure(parseFloat(vaporPressure), vaporPressureUnit, 'Pa');
      
      const densityDisplay = parseFloat(liquidDensity);
      const density = convertDensity(densityDisplay, liquidDensityUnit, 'kg/m³');
      const g = 9.81;
      const distDisplay = parseFloat(distance);
      const frictionDisplay = parseFloat(frictionLoss);
      const dist = distanceUnit === 'ft' ? distDisplay * 0.3048 : distDisplay;
      const friction = frictionLossUnit === 'ft' ? frictionDisplay * 0.3048 : frictionDisplay;
      
      // 표면 압력 = 대기압 + 표면압력
      const totalSurfacePressure = atmPressurePa + surfPressurePa;
      
      // Tank Position에 따른 Z 값 조정
      const Z = tankPosition === 'above' ? dist : -dist;
      
      // NPSH Available 계산
      const npshAvailable = ((totalSurfacePressure - vapPressurePa) / (density * g)) + Z - friction;
      
      // 각 구성 요소 계산 (미터 단위)
      const atmosphericHead = atmPressurePa / (density * g);
      const vaporHead = vapPressurePa / (density * g);
      const surfaceHead = totalSurfacePressure / (density * g);
      
      // 안전성 평가 (NPSHR 고려)
      let safetyStatus: 'Safe' | 'Caution' | 'Danger' = 'Safe';
      
      if (npshr && parseFloat(npshr) > 0) {
        // NPSHR이 입력된 경우: 1.3배 안전 기준 적용
        const npshrDisplay = parseFloat(npshr);
        const npshrMeters = npshrUnit === 'ft' ? npshrDisplay * 0.3048 : npshrDisplay;
        const ratio = npshAvailable / npshrMeters;
        if (ratio < 1.0) {
          safetyStatus = 'Danger';  // NPSH Available < NPSHR
        } else if (ratio < 1.3) {
          safetyStatus = 'Caution'; // 1.0 ≤ ratio < 1.3 (안전 마진 부족)
        } else {
          safetyStatus = 'Safe';    // ratio ≥ 1.3 (충분한 안전 마진)
        }
      } else {
        // NPSHR이 입력되지 않은 경우: 기존 절대값 기준 적용
        if (npshAvailable < 2) {
          safetyStatus = 'Danger';
        } else if (npshAvailable < 3) {
          safetyStatus = 'Caution';
        }
      }
      
      setResult({
        npshAvailable,
        atmosphericHead,
        vaporHead,
        surfaceHead,
        safetyStatus
      });
      
      // 계산 상태 업데이트
      setCalculatedNPSH(npshAvailable);
      setIsCalculated(true);
      
      toast.success(dict?.messages?.success || 'NPSH calculation complete.');
    } catch (error) {
      console.error('Calculation error:', error);
      toast.error(dict?.messages?.error || 'An error occurred during calculation.');
    } finally {
      setIsLoading(false);
    }
  };

  // 온도 변경 시 자동으로 증기압 업데이트
  const handleTemperatureChange = (temp: string) => {
    setTemperature(temp);
  };



  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* 메인 레이아웃: 2열 그리드 (동일한 폭) - 모바일에서는 1열 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-fit">
        {/* 1열: 입력 필드 */}
        <div className="col-span-1 flex flex-col">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex-1">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              💧 NPSH Calculator
            </h3>

            <div className="mb-4">
              <UnitSystemToggle />
            </div>
            
            <div className="space-y-3">
              {/* Tank Position */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                  {dict?.inputs?.tankPosition || "Tank Position"}
                </label>
                <div className="sm:w-1/2">
                  <select
                    aria-label={isKo ? '탱크 위치' : 'Tank Position'}
                    value={tankPosition}
                    onChange={(e) => setTankPosition(e.target.value as 'above' | 'below')}
                    className="w-full px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="above">{dict?.inputs?.abovePump || "Above Pump"}</option>
                    <option value="below">{dict?.inputs?.belowPump || "Below Pump"}</option>
                  </select>
                </div>
              </div>

              {/* 탱크 타입 선택 */}
              <div className="flex flex-col sm:flex-row sm:items-center border-b border-gray-300 dark:border-gray-600 pb-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                  {dict?.inputs?.tankType || "Tank Type"}
                </label>
                <div className="sm:w-1/2">
                  <select
                    aria-label={isKo ? '탱크 형태' : 'Tank Type'}
                    value={tankType}
                    onChange={(e) => setTankType(e.target.value as 'open' | 'closed')}
                    className="w-full px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    <option value="open">{dict?.inputs?.openTank || "Open Tank"}</option>
                    <option value="closed">{dict?.inputs?.closedTank || "Closed Tank"}</option>
                  </select>
                </div>
              </div>

              {/* 유체 선택 */}
              <div className="flex flex-col sm:flex-row sm:items-center">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                  {dict?.inputs?.fluidSelection || "Fluid Selection"}
                </label>
                <div className="sm:w-1/2">
                  <select
                    aria-label={isKo ? '유체 선택' : 'Fluid Selection'}
                    value={selectedFluid}
                    onChange={(e) => setSelectedFluid(e.target.value)}
                    className="w-full px-2 py-0.5 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  >
                    {Object.entries(ANTOINE_DATABASE).map(([key, fluid]) => (
                      <option key={key} value={key}>
                        {dict?.fluids?.[key] || fluid.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 압력 입력 필드들 */}
              <div className="space-y-2">
                {/* 대기압 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                    {dict?.inputs?.atmosphericPressure || "Atmospheric pressure"}
                  </label>
                  <div className="sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={atmosphericPressure}
                      onChange={(e) => setAtmosphericPressure(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="101325"
                    />
                    <select
                      aria-label={isKo ? '대기압 단위' : 'Atmospheric Pressure Unit'}
                      value={atmosphericPressureUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(atmosphericPressure);
                        if (!isNaN(v)) {
                          const nextValue = convertPressure(v, atmosphericPressureUnit, nextUnit);
                          setAtmosphericPressure(nextValue.toFixed(3));
                        }
                        setAtmosphericPressureUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="Pa">Pa</option>
                      <option value="kPa">kPa</option>
                      <option value="bar">bar</option>
                      <option value="psi">psi</option>
                      <option value="atm">atm</option>
                    </select>
                  </div>
                </div>

                {/* 표면압력 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.surfacePressure || "Surface pressure"}
                    {tankType === 'open' && (
                      <span className="text-xs text-gray-500 block">{dict?.inputs?.sameAsAtmospheric || "(Same as atmospheric)"}</span>
                    )}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={surfacePressure}
                      onChange={(e) => setSurfacePressure(e.target.value)}
                      disabled={tankType === 'open'}
                      className={`flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm ${
                        tankType === 'open' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed' 
                          : ''
                      }`}
                      placeholder="0"
                    />
                    <select
                      aria-label={isKo ? '표면압 단위' : 'Surface Pressure Unit'}
                      value={surfacePressureUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(surfacePressure);
                        if (!isNaN(v)) {
                          const nextValue = convertPressure(v, surfacePressureUnit, nextUnit);
                          setSurfacePressure(nextValue.toFixed(3));
                        }
                        setSurfacePressureUnit(nextUnit);
                      }}
                      disabled={tankType === 'open'}
                      className={`w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs ${
                        tankType === 'open' 
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 cursor-not-allowed appearance-none' 
                          : ''
                      }`}
                      style={tankType === 'open' ? {
                        backgroundImage: 'none',
                        WebkitAppearance: 'none',
                        MozAppearance: 'none'
                      } : {}}
                    >
                      <option value="Pa">Pa</option>
                      <option value="kPa">kPa</option>
                      <option value="bar">bar</option>
                      <option value="psi">psi</option>
                      <option value="atm">atm</option>
                    </select>
                  </div>
                </div>

                {/* 증기압 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.vaporPressure || "Vapor pressure"}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={vaporPressure}
                      onChange={(e) => setVaporPressure(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="2337"
                    />
                    <select
                      aria-label={isKo ? '증기압 단위' : 'Vapor Pressure Unit'}
                      value={vaporPressureUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(vaporPressure);
                        if (!isNaN(v)) {
                          const nextValue = convertPressure(v, vaporPressureUnit, nextUnit);
                          setVaporPressure(nextValue.toFixed(3));
                        }
                        setVaporPressureUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="Pa">Pa</option>
                      <option value="kPa">kPa</option>
                      <option value="bar">bar</option>
                      <option value="psi">psi</option>
                      <option value="atm">atm</option>
                    </select>
                  </div>
                </div>

                {/* 액체 밀도 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.liquidDensity || "Liquid density"}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={liquidDensity}
                      onChange={(e) => setLiquidDensity(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="1000"
                    />
                    <select
                      aria-label={isKo ? '액체 밀도 단위' : 'Liquid Density Unit'}
                      value={liquidDensityUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(liquidDensity);
                        if (!isNaN(v)) {
                          const nextValue = convertDensity(v, liquidDensityUnit, nextUnit);
                          setLiquidDensity(nextValue.toFixed(nextUnit === 'kg/m³' ? 1 : 2));
                        }
                        setLiquidDensityUnit(nextUnit);
                      }}
                      className="w-20 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="kg/m³">kg/m³</option>
                      <option value="lb/ft³">lb/ft³</option>
                    </select>
                  </div>
                </div>

                {/* 온도 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                    {dict?.inputs?.temperature || "Temperature"}
                  </label>
                  <div className="sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={temperature}
                      onChange={(e) => handleTemperatureChange(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="20"
                    />
                    <select
                      aria-label={isKo ? '온도 단위' : 'Temperature Unit'}
                      value={temperatureUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(temperature);
                        if (!isNaN(v)) {
                          const nextValue = convertTemperature(v, temperatureUnit, nextUnit);
                          setTemperature(nextValue.toFixed(0));
                        }
                        setTemperatureUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="°C">°C</option>
                      <option value="°F">°F</option>
                    </select>
                  </div>
                </div>

                {/* 유체와 펌프 간 거리 */}
                <div className="flex flex-col sm:flex-row sm:items-center border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.distance || "Distance"}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="5"
                    />
                    <select
                      aria-label={isKo ? '거리 단위' : 'Distance Unit'}
                      value={distanceUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(distance);
                        if (!isNaN(v)) {
                          const meters = distanceUnit === 'ft' ? v * 0.3048 : v;
                          const nextValue = nextUnit === 'ft' ? meters / 0.3048 : meters;
                          setDistance(nextValue.toFixed(3));
                        }
                        setDistanceUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="m">m</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                {/* 마찰 손실 */}
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.frictionLoss || "Friction loss"}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={frictionLoss}
                      onChange={(e) => setFrictionLoss(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder="0.5"
                    />
                    <select
                      aria-label={isKo ? '마찰 손실 단위' : 'Friction Loss Unit'}
                      value={frictionLossUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(frictionLoss);
                        if (!isNaN(v)) {
                          const meters = frictionLossUnit === 'ft' ? v * 0.3048 : v;
                          const nextValue = nextUnit === 'ft' ? meters / 0.3048 : meters;
                          setFrictionLoss(nextValue.toFixed(3));
                        }
                        setFrictionLossUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="m">m</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>

                {/* NPSHR 입력 필드 추가 */}
                <div className="flex flex-col sm:flex-row sm:items-center border-t border-gray-100 dark:border-gray-700 pt-3 mt-1">
                  <label className="w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300 pr-2 mb-2 sm:mb-0">
                    {dict?.inputs?.npshr || "NPSH Required"}
                  </label>
                  <div className="w-full sm:w-1/2 flex min-w-0">
                    <input
                      type="number"
                      value={npshr}
                      onChange={(e) => setNpshr(e.target.value)}
                      className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                      placeholder={dict?.inputs?.npshrPlaceholder || "Pump datasheet value"}
                    />
                    <select
                      aria-label={isKo ? 'NPSHR 단위' : 'NPSHR Unit'}
                      value={npshrUnit}
                      onChange={(e) => {
                        const nextUnit = e.target.value;
                        const v = parseFloat(npshr);
                        if (!isNaN(v)) {
                          const meters = npshrUnit === 'ft' ? v * 0.3048 : v;
                          const nextValue = nextUnit === 'ft' ? meters / 0.3048 : meters;
                          setNpshr(nextValue.toFixed(3));
                        }
                        setNpshrUnit(nextUnit);
                      }}
                      className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
                    >
                      <option value="m">m</option>
                      <option value="ft">ft</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 계산 버튼 */}
            <button 
              onClick={handleCalculate} 
              disabled={isLoading}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  {dict?.buttons?.calculating || "Calculating..."}
                </>
              ) : (
                dict?.buttons?.calculate || "Calculate NPSH"
              )}
            </button>
          </div>
        </div>
        
        {/* 2열: 시각화 */}
        <div className="col-span-1 flex flex-col h-full">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
            <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
              📊 {dict?.visualization?.title || "NPSH Visualization"}
            </h3>
            
            <div className="flex-1 min-h-[450px] bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center overflow-hidden">
              <NPSHVisualization 
                tankPosition={tankPosition}
                atmosphericPressure={parseFloat(atmosphericPressure) || 101325}
                atmosphericPressureUnit={atmosphericPressureUnit}
                surfacePressure={parseFloat(surfacePressure) || 101325}
                surfacePressureUnit={surfacePressureUnit}
                vaporPressure={parseFloat(vaporPressure) || 2337}
                vaporPressureUnit={vaporPressureUnit}
                liquidDensity={convertDensity(parseFloat(liquidDensity) || 1000, liquidDensityUnit, 'kg/m³')}
                liquidDensityDisplay={parseFloat(liquidDensity) || 1000}
                liquidDensityDisplayUnit={liquidDensityUnit}
                temperature={convertTemperature(parseFloat(temperature) || 20, temperatureUnit, '°C')}
                temperatureDisplay={parseFloat(temperature) || 20}
                temperatureDisplayUnit={temperatureUnit}
                distance={(distanceUnit === 'ft' ? (parseFloat(distance) || 0) * 0.3048 : (parseFloat(distance) || 0)) || 5}
                frictionLoss={(frictionLossUnit === 'ft' ? (parseFloat(frictionLoss) || 0) * 0.3048 : (parseFloat(frictionLoss) || 0)) || 0.5}
                calculatedNPSH={calculatedNPSH ?? undefined}
                showCalculation={isCalculated}
                dict={dict}
                unitSystem={unitSystem}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 계산 결과 */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            📊 {dict?.results?.title || "Calculation Results"}
          </h3>
          
          {/* NPSH Available 메인 결과 */}
          <div className="mb-6">
            <div className={`p-6 rounded-lg border-2 ${result.safetyStatus === 'Safe' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' : 
              result.safetyStatus === 'Caution' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'}`}>
              <div className="flex justify-between items-center">
                <div>
                  <h4 className={`text-lg font-semibold ${result.safetyStatus === 'Safe' ? 'text-green-800 dark:text-green-200' : 
                    result.safetyStatus === 'Caution' ? 'text-yellow-800 dark:text-yellow-200' : 'text-red-800 dark:text-red-200'}`}>
                    {dict?.results?.npsha || "NPSH Available"}
                  </h4>
                  <p className={`text-3xl font-bold ${result.safetyStatus === 'Safe' ? 'text-green-600 dark:text-green-400' : 
                    result.safetyStatus === 'Caution' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {(result.npshAvailable * headFactor).toFixed(2)} {headUnit}
                  </p>
                  <p className={`text-sm ${result.safetyStatus === 'Safe' ? 'text-green-600 dark:text-green-400' : 
                    result.safetyStatus === 'Caution' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                    {result.safetyStatus === 'Safe' ? (dict?.results?.safe || "Safe") : result.safetyStatus === 'Caution' ? (dict?.results?.caution || "Caution") : (dict?.results?.danger || "Danger")}
                  </p>
                </div>
                
                {/* NPSHR 비교 */}
                {npshr && parseFloat(npshr) > 0 && (
                  <div className="text-right">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">{dict?.results?.npshr || "NPSH Required"}</h5>
                    <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{parseFloat(npshr).toFixed(2)} {npshrUnit}</p>
                    <div className="mt-2">
                      {(() => {
                        const npshrDisplay = parseFloat(npshr);
                        const npshrMeters = npshrUnit === 'ft' ? npshrDisplay * 0.3048 : npshrDisplay;
                        const ratio = result.npshAvailable / npshrMeters;
                        const isAdequate = ratio >= 1.3;
                        return (
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            isAdequate 
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                          }`}>
                            {isAdequate ? `✓ ${dict?.results?.adequate || "Adequate"}` : `✗ ${dict?.results?.inadequate || "Inadequate"}`} (×{ratio.toFixed(1)})
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 공식 구성요소 분석 */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">{dict?.results?.analysisTitle || "Formula Component Analysis"}</h4>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <p className="font-mono text-sm text-center bg-white dark:bg-gray-800 p-3 rounded border">
                 {dict?.results?.formulaText ? dict.results.formulaText.replace('{sign}', tankPosition === 'above' ? '+' : '-') : `NPSH Available = (Psurf - Pvap) / (ρ × g) ${tankPosition === 'above' ? '+' : '-'} Z - Hl`}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center mt-2">
                 {dict?.results?.formulaDesc ? dict.results.formulaDesc.replace('{signDesc}', tankPosition === 'above' ? (dict?.results?.signDescAbove || "+ Static Head") : (dict?.results?.signDescBelow || "- Suction Lift")) : `= Pressure Head ${tankPosition === 'above' ? '+ Static Head' : '- Suction Lift'} - Friction Loss`}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 압력 헤드 구성요소 */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">{dict?.results?.pressureHeadTitle || "Pressure Head Components"}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{dict?.results?.atmHead || "Atmospheric Head:"}</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">+{(result.atmosphericHead * headFactor).toFixed(2)} {headUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{dict?.results?.vapHead || "Vapor Head:"}</span>
                    <span className="font-medium text-purple-600 dark:text-purple-400">-{(result.vaporHead * headFactor).toFixed(2)} {headUnit}</span>
                  </div>
                  <div className="border-t border-blue-200 dark:border-blue-600 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-blue-800 dark:text-blue-200">{dict?.results?.netPressureHead || "Net Pressure Head:"}</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {((result.atmosphericHead - result.vaporHead) * headFactor).toFixed(2)} {headUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 위치 헤드 */}
              <div className={`p-4 rounded-lg border ${tankPosition === 'above' 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700' 
                : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700'}`}>
                <h5 className={`font-semibold mb-3 ${tankPosition === 'above' 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-orange-800 dark:text-orange-200'}`}>
                  {dict?.results?.positionHeadTitle || "Position Head"}
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{dict?.results?.tankPositionRes || "Tank Position:"}</span>
                    <span className="font-medium">{tankPosition === 'above' ? (dict?.inputs?.abovePump || 'Above Pump') : (dict?.inputs?.belowPump || 'Below Pump')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{dict?.results?.distanceRes || "Distance:"}</span>
                    <span className="font-medium">{distance} {distanceUnit}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>{dict?.results?.positionHead || "Position Head:"}</span>
                      <span className={tankPosition === 'above' 
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-orange-600 dark:text-orange-400'}>
                        {tankPosition === 'above' ? '+' : '-'}{distance} {distanceUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 손실 헤드 */}
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                <h5 className="font-semibold text-red-800 dark:text-red-200 mb-3">{dict?.results?.frictionHeadTitle || "Friction Head"}</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">{dict?.results?.frictionLossRes || "Friction Loss:"}</span>
                    <span className="font-medium text-red-600 dark:text-red-400">-{frictionLoss} {frictionLossUnit}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {dict?.results?.frictionLossDesc || "Pressure loss due to piping, valves, fittings, etc."}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 계산 요약 */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <h4 className="font-semibold mb-3">{dict?.results?.summaryTitle || "Calculation Summary"}</h4>
            <div className="font-mono text-sm space-y-1">
              <div className="flex justify-between">
                <span>{dict?.results?.summaryPressure || "Pressure Head"} (Psurf - Pvap)/(ρ×g):</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {((result.atmosphericHead - result.vaporHead) * headFactor).toFixed(2)} {headUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{dict?.results?.summaryPosition || "Position Head"} ({tankPosition === 'above' ? '+' : '-'}Z):</span>
                <span className={tankPosition === 'above' 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-orange-600 dark:text-orange-400'}>
                  {tankPosition === 'above' ? '+' : '-'}{distance} {distanceUnit}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{dict?.results?.summaryFriction || "Friction Loss"} (-Hl):</span>
                <span className="text-red-600 dark:text-red-400">-{frictionLoss} {frictionLossUnit}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>{dict?.results?.npsha || "NPSH Available"}:</span>
                  <span className={result.safetyStatus === 'Safe' ? 'text-green-600 dark:text-green-400' : 
                    result.safetyStatus === 'Caution' ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}>
                    {(result.npshAvailable * headFactor).toFixed(2)} {headUnit}
                  </span>
                </div>
              </div>
            </div>
            
            {/* NPSHR 비교 요약 */}
            {npshr && parseFloat(npshr) > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{dict?.results?.vsRequired || "Vs. Required:"}</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {(() => {
                        const npshrDisplay = parseFloat(npshr);
                        const npshrMeters = npshrUnit === 'ft' ? npshrDisplay * 0.3048 : npshrDisplay;
                        const ratio = result.npshAvailable / npshrMeters;
                        return `${(result.npshAvailable * headFactor).toFixed(2)} ${headUnit} ÷ ${npshrDisplay.toFixed(2)} ${npshrUnit} = ×${ratio.toFixed(1)}`;
                      })()}
                    </div>
                    <div className={`text-sm font-medium ${
                      (() => {
                        const npshrDisplay = parseFloat(npshr);
                        const npshrMeters = npshrUnit === 'ft' ? npshrDisplay * 0.3048 : npshrDisplay;
                        return result.npshAvailable / npshrMeters;
                      })() >= 1.3
                        ? 'text-green-600 dark:text-green-400' 
                        : 'text-red-600 dark:text-red-400'
                    }`}>
                      {(() => {
                        const npshrDisplay = parseFloat(npshr);
                        const npshrMeters = npshrUnit === 'ft' ? npshrDisplay * 0.3048 : npshrDisplay;
                        return result.npshAvailable / npshrMeters;
                      })() >= 1.3
                        ? `✓ ${dict?.results?.meetsRequirement || "1.3x+ met (Safe)"}` 
                        : `✗ ${dict?.results?.failsRequirement || "Under 1.3x (Danger)"}`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3행: 상세 공식 펼치기 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setShowFormulas(!showFormulas)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {dict?.details?.title || 'Detailed Formulas & Theory'}
          </h3>
          {showFormulas ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </button>

        {showFormulas && (
          <div className="px-6 pb-6">
            <div dangerouslySetInnerHTML={{ __html: getAdjustedFormulasContent() }} />
          </div>
        )}
      </div>
    </div>
  );
}
