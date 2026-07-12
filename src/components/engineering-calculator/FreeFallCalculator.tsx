'use client';

import React, { useState, useMemo } from 'react';
import { useI18n } from '@/i18n/I18nProvider';
import UnitSystemToggle from '@/components/calculators/UnitSystemToggle';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

interface ChartDataPoint {
  time: number;
  velocityMetric: number;
  velocityImperial: number;
  distanceMetric: number;
  distanceImperial: number;
}

export default function FreeFallCalculator() {
  const { dict, unitSystem } = useI18n();
  const t = dict?.freeFall;

  const [timeInput, setTimeInput] = useState<string>('10');
  const [v0Input, setV0Input] = useState<string>('0');
  const [heightInput, setHeightInput] = useState<string>('');

  const [result, setResult] = useState<{
    finalVelocity: number;
    distance: number;
    timeToGround: number | null;
    unitSystemUsed: 'metric' | 'imperial';
  } | null>(null);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  // Constants
  const g_metric = 9.80665; // m/s^2
  const g_imperial = 32.174; // ft/s^2

  const calculate = () => {
    const t_val = parseFloat(timeInput);
    const v0 = parseFloat(v0Input) || 0;
    const h0 = parseFloat(heightInput);
    
    if (isNaN(t_val) || t_val < 0) {
      return;
    }

    const g = unitSystem === 'metric' ? g_metric : g_imperial;
    
    let finalVelocity = v0 + g * t_val;
    let distance = v0 * t_val + 0.5 * g * Math.pow(t_val, 2);
    let timeToGround = null;

    if (!isNaN(h0) && h0 > 0) {
      // Calculate time to hit the ground: h0 = v0*t + 0.5*g*t^2 => 0.5*g*t^2 + v0*t - h0 = 0
      // t = (-v0 + sqrt(v0^2 - 4*(0.5*g)*(-h0))) / g
      // t = (-v0 + sqrt(v0^2 + 2*g*h0)) / g
      const t_ground = (-v0 + Math.sqrt(Math.pow(v0, 2) + 2 * g * h0)) / g;
      timeToGround = t_ground;

      // Cap distance and velocity if it hits the ground before t_val
      if (t_val > t_ground) {
        finalVelocity = v0 + g * t_ground;
        distance = h0; // max distance is the height
      }
    }

    setResult({
      finalVelocity,
      distance,
      timeToGround,
      unitSystemUsed: unitSystem as 'metric' | 'imperial',
    });

    // Generate chart data
    const data: ChartDataPoint[] = [];
    const maxTime = timeToGround && timeToGround < 15 ? Math.ceil(timeToGround) : Math.max(10, Math.ceil(t_val));
    const step = maxTime > 20 ? Math.ceil(maxTime / 20) : 1;

    for (let i = 0; i <= maxTime; i += step) {
      // Calculate both metric and imperial for the table
      const v_m = (unitSystem === 'metric' ? v0 : v0 * 0.3048) + g_metric * i;
      const d_m = (unitSystem === 'metric' ? v0 : v0 * 0.3048) * i + 0.5 * g_metric * Math.pow(i, 2);
      
      const v_ft = (unitSystem === 'imperial' ? v0 : v0 * 3.28084) + g_imperial * i;
      const d_ft = (unitSystem === 'imperial' ? v0 : v0 * 3.28084) * i + 0.5 * g_imperial * Math.pow(i, 2);

      data.push({
        time: i,
        velocityMetric: v_m,
        velocityImperial: v_ft,
        distanceMetric: d_m,
        distanceImperial: d_ft,
      });
    }
    setChartData(data);
  };

  return (
    <div className="space-y-8">
      {/* 1열: 입력과 결과 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 좌측: 입력 필드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
            ⚙️ {t?.title || "Free Fall Calculator"}
          </h3>

          <div className="mb-4">
            <UnitSystemToggle />
          </div>

          <div className="space-y-4 flex-1">
            {/* 시간 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                {t?.inputs?.time || "Time of Fall"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={timeInput}
                  onChange={(e) => setTimeInput(e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  min="0"
                />
                <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                  s
                </span>
              </div>
            </div>

            {/* 초기 속도 */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                {t?.inputs?.initialVelocity || "Initial Velocity"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={v0Input}
                  onChange={(e) => setV0Input(e.target.value)}
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  min="0"
                />
                <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                  {unitSystem === 'metric' ? 'm/s' : 'ft/s'}
                </span>
              </div>
            </div>

            {/* 초기 높이 (선택) */}
            <div className="flex flex-col sm:flex-row sm:items-center">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-0 sm:w-1/2 sm:pr-2">
                {t?.inputs?.initialHeight || "Initial Height (Optional)"}
              </label>
              <div className="sm:w-1/2 flex min-w-0">
                <input
                  type="number"
                  value={heightInput}
                  onChange={(e) => setHeightInput(e.target.value)}
                  placeholder="∞"
                  className="flex-1 min-w-0 px-2 py-1.5 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                  min="0"
                />
                <span className="w-12 shrink-0 px-2 py-1.5 bg-gray-100 dark:bg-gray-700 border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md text-gray-500 flex items-center justify-center text-xs">
                  {unitSystem === 'metric' ? 'm' : 'ft'}
                </span>
              </div>
            </div>
          </div>

          <Button onClick={calculate} className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white">
            {dict?.common?.calculate || "계산하기"}
          </Button>
        </div>

        {/* 우측: 결과 필드 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4 flex items-center shrink-0">
            📊 {dict?.common?.result || "Calculation Result"}
          </h3>
          
          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 flex flex-col justify-center">
            {result ? (
              <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t?.results?.finalVelocity || "Final Velocity"}
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {result.finalVelocity.toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                      {result.unitSystemUsed === 'metric' ? 'm/s' : 'ft/s'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.unitSystemUsed === 'metric' 
                      ? `(${(result.finalVelocity * 3.6).toFixed(2)} km/h)` 
                      : `(${(result.finalVelocity * 0.681818).toFixed(2)} mph)`}
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    {t?.results?.distanceTraveled || "Distance Traveled"}
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {result.distance.toFixed(2)}
                    </span>
                    <span className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
                      {result.unitSystemUsed === 'metric' ? 'm' : 'ft'}
                    </span>
                  </div>
                </div>

                {result.timeToGround !== null && (
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {t?.results?.timeToGround || "Time to Ground"}
                    </h4>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {result.timeToGround.toFixed(2)}
                      </span>
                      <span className="text-md font-medium text-gray-600 dark:text-gray-300 mb-1">
                        s
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400">
                <p>{t?.results?.enterValues || "Please enter values to calculate."}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 시각화 차트 */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center">
            📈 {t?.visualization?.title || "Velocity and Distance Traveled vs. Time"}
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ccc" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  label={{ value: `${t?.visualization?.time || 'Time'} (s)`, position: 'bottom', offset: 0 }} 
                />
                <YAxis 
                  yAxisId="left" 
                  label={{ value: `${t?.visualization?.distance || 'Distance'} (${unitSystem === 'metric' ? 'm' : 'ft'})`, angle: -90, position: 'insideLeft' }} 
                  stroke="#2563eb"
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  label={{ value: `${t?.visualization?.velocity || 'Velocity'} (${unitSystem === 'metric' ? 'm/s' : 'ft/s'})`, angle: 90, position: 'insideRight' }} 
                  stroke="#16a34a"
                />
                <RechartsTooltip 
                  formatter={(value: number, name: string) => {
                    if (name === 'distanceMetric') return [`${value.toFixed(2)} m`, t?.visualization?.distance || 'Distance'];
                    if (name === 'distanceImperial') return [`${value.toFixed(2)} ft`, t?.visualization?.distance || 'Distance'];
                    if (name === 'velocityMetric') return [`${value.toFixed(2)} m/s`, t?.visualization?.velocity || 'Velocity'];
                    if (name === 'velocityImperial') return [`${value.toFixed(2)} ft/s`, t?.visualization?.velocity || 'Velocity'];
                    return value;
                  }}
                  labelFormatter={(label) => `${t?.visualization?.time || 'Time'}: ${label} s`}
                />
                <Legend verticalAlign="top" height={36}/>
                <Line 
                  yAxisId="left" 
                  type="monotone" 
                  dataKey={unitSystem === 'metric' ? "distanceMetric" : "distanceImperial"} 
                  name={`${t?.visualization?.distance || 'Distance'} (${unitSystem === 'metric' ? 'm' : 'ft'})`} 
                  stroke="#2563eb" 
                  strokeWidth={3} 
                  dot={false}
                />
                <Line 
                  yAxisId="right" 
                  type="monotone" 
                  dataKey={unitSystem === 'metric' ? "velocityMetric" : "velocityImperial"} 
                  name={`${t?.visualization?.velocity || 'Velocity'} (${unitSystem === 'metric' ? 'm/s' : 'ft/s'})`} 
                  stroke="#16a34a" 
                  strokeWidth={3} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 데이터 테이블 (사용자 요청 이미지 반영) */}
      {chartData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-center">
              {t?.visualization?.tableTitle || "Free Falling Object - Velocity and Distance Traveled vs. Time"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-center">
              <thead className="bg-[#fff9c4] dark:bg-yellow-900/30 text-gray-900 dark:text-gray-100 border-b-2 border-gray-300 dark:border-gray-600">
                <tr>
                  <th rowSpan={2} className="py-3 px-4 font-bold border-r border-gray-300 dark:border-gray-600">
                    {t?.visualization?.time || "Time"}<br/>(s)
                  </th>
                  <th colSpan={4} className="py-2 px-4 font-bold border-r border-gray-300 dark:border-gray-600">
                    {t?.visualization?.velocity || "Velocity"}
                  </th>
                  <th colSpan={2} className="py-2 px-4 font-bold">
                    {t?.visualization?.distance || "Distance"}
                  </th>
                </tr>
                <tr className="bg-[#fffde7] dark:bg-yellow-800/20 text-xs italic">
                  <th className="py-2 px-3 border-r border-gray-300 dark:border-gray-600 border-t">m/s</th>
                  <th className="py-2 px-3 border-r border-gray-300 dark:border-gray-600 border-t">km/h</th>
                  <th className="py-2 px-3 border-r border-gray-300 dark:border-gray-600 border-t">ft/s</th>
                  <th className="py-2 px-3 border-r border-gray-300 dark:border-gray-600 border-t">mph</th>
                  <th className="py-2 px-3 border-r border-gray-300 dark:border-gray-600 border-t">m</th>
                  <th className="py-2 px-3 border-t">ft</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {chartData.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-2 px-4 font-medium border-r border-gray-200 dark:border-gray-700">{row.time}</td>
                    <td className="py-2 px-3 border-r border-gray-200 dark:border-gray-700">{row.velocityMetric.toFixed(1)}</td>
                    <td className="py-2 px-3 border-r border-gray-200 dark:border-gray-700">{(row.velocityMetric * 3.6).toFixed(1)}</td>
                    <td className="py-2 px-3 border-r border-gray-200 dark:border-gray-700">{row.velocityImperial.toFixed(1)}</td>
                    <td className="py-2 px-3 border-r border-gray-200 dark:border-gray-700">{(row.velocityImperial * 0.681818).toFixed(1)}</td>
                    <td className="py-2 px-3 border-r border-gray-200 dark:border-gray-700">{row.distanceMetric.toFixed(1)}</td>
                    <td className="py-2 px-3">{row.distanceImperial.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            <strong>Note!</strong> {t?.details?.description}
          </div>
        </div>
      )}
    </div>
  );
}
