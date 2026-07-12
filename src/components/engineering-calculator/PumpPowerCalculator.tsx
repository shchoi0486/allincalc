import React, { useState, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';
import { useI18n } from '@/i18n/I18nProvider';
import toast from 'react-hot-toast';

export default function PumpPowerCalculator() {
  const { dict, unitSystem } = useI18n();

  const [flowRate, setFlowRate] = useState<string>('300');
  const [flowRateUnit, setFlowRateUnit] = useState<string>('m³/h');
  const [head, setHead] = useState<string>('100');
  const [headUnit, setHeadUnit] = useState<string>('m');
  const [fluidDensity, setFluidDensity] = useState<string>('1000');
  const [fluidDensityUnit, setFluidDensityUnit] = useState<string>('kg/m³');
  const [pumpEfficiency, setPumpEfficiency] = useState<string>('70');
  const [motorEfficiency, setMotorEfficiency] = useState<string>('90');

  const [result, setResult] = useState<{
    shaftPower: number;
    motorPower: number;
    powerUnit: string;
  } | null>(null);

  useEffect(() => {
    if (unitSystem === 'imperial') {
      setFlowRateUnit('gpm');
      setHeadUnit('ft');
      setFluidDensityUnit('lb/ft³');
    } else {
      setFlowRateUnit('m³/h');
      setHeadUnit('m');
      setFluidDensityUnit('kg/m³');
    }
  }, [unitSystem]);

  const calculatePumpPower = useCallback(() => {
    const q = parseFloat(flowRate);
    const h = parseFloat(head);
    const rho = parseFloat(fluidDensity);
    const np = parseFloat(pumpEfficiency) / 100;
    const nm = parseFloat(motorEfficiency) / 100;

    if (isNaN(q) || isNaN(h) || isNaN(rho) || isNaN(np) || isNaN(nm)) {
      toast.error(dict?.common?.error || "Please enter valid numbers");
      return;
    }

    if (np === 0 || nm === 0) {
      toast.error("Efficiency cannot be zero");
      return;
    }

    let shaftPower = 0;
    let motorPower = 0;
    let powerUnit = 'kW';

    if (unitSystem === 'metric') {
      // Metric Calculation: P (kW) = (ρ * g * H * Q) / (ηp * 1000)
      const g = 9.81; // m/s²
      
      // Convert flow rate to m³/s
      let q_m3s = q;
      if (flowRateUnit === 'm³/h') q_m3s = q / 3600;
      else if (flowRateUnit === 'L/min') q_m3s = q / 60000;
      else if (flowRateUnit === 'm³/s') q_m3s = q;

      shaftPower = (rho * g * h * q_m3s) / (np * 1000);
      motorPower = shaftPower / nm;
      powerUnit = 'kW';
    } else {
      // Imperial Calculation: P (HP) = (Q * H * SG) / (3960 * ηp)
      // Q in gpm, H in ft
      // SG (Specific Gravity) = ρ / 62.4 (since density of water is ~62.4 lb/ft³)
      let q_gpm = q;
      if (flowRateUnit === 'gpm') q_gpm = q;
      else if (flowRateUnit === 'ft³/s') q_gpm = q * 448.831;

      const sg = rho / 62.43;
      
      shaftPower = (q_gpm * h * sg) / (3960 * np);
      motorPower = shaftPower / nm;
      powerUnit = 'HP';
    }

    setResult({ shaftPower, motorPower, powerUnit });
    toast.success("Calculation complete");
  }, [flowRate, flowRateUnit, head, fluidDensity, pumpEfficiency, motorEfficiency, unitSystem, dict]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 좌측: 입력 필드 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
          ⚡ {dict?.pumpPower?.title || "Pump Power Calculator"}
        </h3>

        <div className="mb-4">
          <UnitSystemToggle />
        </div>

        <div className="space-y-4 flex-1">
          {/* 유량 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {dict?.pumpPower?.inputs?.flowRate || "Flow Rate"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={flowRate}
                onChange={(e) => setFlowRate(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <select
                value={flowRateUnit}
                onChange={(e) => setFlowRateUnit(e.target.value)}
                className="w-20 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
              >
                {unitSystem === 'metric' ? (
                  <>
                    <option value="m³/h">m³/h</option>
                    <option value="L/min">L/min</option>
                    <option value="m³/s">m³/s</option>
                  </>
                ) : (
                  <>
                    <option value="gpm">gpm</option>
                    <option value="ft³/s">ft³/s</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* 양정 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {dict?.pumpPower?.inputs?.head || "Head"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={head}
                onChange={(e) => setHead(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <select
                value={headUnit}
                onChange={(e) => setHeadUnit(e.target.value)}
                className="w-16 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
              >
                {unitSystem === 'metric' ? (
                  <option value="m">m</option>
                ) : (
                  <option value="ft">ft</option>
                )}
              </select>
            </div>
          </div>

          {/* 유체 밀도 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {dict?.pumpPower?.inputs?.fluidDensity || "Fluid Density"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={fluidDensity}
                onChange={(e) => setFluidDensity(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <select
                value={fluidDensityUnit}
                onChange={(e) => setFluidDensityUnit(e.target.value)}
                className="w-20 shrink-0 px-1 py-1 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-xs"
              >
                {unitSystem === 'metric' ? (
                  <option value="kg/m³">kg/m³</option>
                ) : (
                  <option value="lb/ft³">lb/ft³</option>
                )}
              </select>
            </div>
          </div>

          {/* 펌프 효율 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {dict?.pumpPower?.inputs?.pumpEfficiency || "Pump Efficiency"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={pumpEfficiency}
                onChange={(e) => setPumpEfficiency(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <span className="w-12 shrink-0 px-2 py-1 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                %
              </span>
            </div>
          </div>

          {/* 모터 효율 */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
              {dict?.pumpPower?.inputs?.motorEfficiency || "Motor Efficiency"}
            </label>
            <div className="sm:w-1/2 flex min-w-0">
              <input
                type="number"
                value={motorEfficiency}
                onChange={(e) => setMotorEfficiency(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
              />
              <span className="w-12 shrink-0 px-2 py-1 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                %
              </span>
            </div>
          </div>
        </div>

        <Button onClick={calculatePumpPower} className="w-full mt-6">
          {dict?.common?.calculate || "Calculate"}
        </Button>
      </div>

      {/* 우측: 결과 필드 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col h-full">
        <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
          📊 {dict?.calculatorLayout?.result || "Calculation Result"}
        </h3>
        
        <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex flex-col justify-center">
          {result ? (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{dict?.pumpPower?.results?.shaftPower || "Shaft Power"}</h4>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {result.shaftPower.toFixed(2)}
                  </span>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {result.powerUnit}
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{dict?.pumpPower?.results?.motorPower || "Motor Power"}</h4>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {result.motorPower.toFixed(2)}
                  </span>
                  <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                    {result.powerUnit}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {dict?.pumpPower?.results?.motorPowerDesc || "* The total power required to drive the pump, accounting for motor efficiency."}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              <p>{dict?.pumpPower?.results?.enterValues || "Enter values on the left and press Calculate."}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}