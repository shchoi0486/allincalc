'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { NextPage } from 'next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculateRequiredContainers, CONTAINER_SPECS } from '@/utils/calculations';

const CBMCalculator: NextPage = () => {
  const [length, setLength] = useState<number>(100);
  const [width, setWidth] = useState<number>(100);
  const [height, setHeight] = useState<number>(100);
  const [weight, setWeight] = useState<number>(10);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<string>('cm');
  const [displayedResult, setDisplayedResult] = useState<any>(null);

  const handleInputChange =
    (setter: React.Dispatch<React.SetStateAction<number>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setter(isNaN(value) ? 0 : value);
    };

  // 단위 변환: 모든 길이를 미터(m)로 변환
  const convertToMeter = (value: number, currentUnit: string): number => {
    switch (currentUnit) {
      case 'cm':
        return value / 100;
      case 'inch':
        return value * 0.0254;
      case 'm':
        return value;
      case 'ft':
        return value * 0.3048;
      default:
        return value;
    }
  };

  const { calculationResult, error } = useMemo(() => {
    const lM = convertToMeter(length, unit);
    const wM = convertToMeter(width, unit);
    const hM = convertToMeter(height, unit);

    if (
      isNaN(lM) ||
      isNaN(wM) ||
      isNaN(hM) ||
      isNaN(weight) ||
      isNaN(quantity) ||
      lM <= 0 ||
      wM <= 0 ||
      hM <= 0 ||
      quantity <= 0
    ) {
      return {
        calculationResult: null,
        error: '모든 필드를 올바르게 입력해주세요.',
      };
    }

    // m³ 기준 계산
    const volumeM3 = lM * wM * hM;
    const totalVolumeM3 = volumeM3 * quantity;
    const totalWeight = weight * quantity;

    // cm³ 변환용 (표시용)
    const volumeCm3 = volumeM3 * 1_000_000;

    return {
      calculationResult: {
        volumeCm3,
        volumeM3,
        totalVolumeM3,
        totalWeight,
      },
      error: null,
    };
  }, [length, width, height, weight, quantity, unit]);

  const handleCalculate = useCallback(() => {
    if (error) {
      toast.error(error);
      setDisplayedResult(null);
    } else if (calculationResult) {
      const { totalVolumeM3, totalWeight, volumeM3 } = calculationResult;
      const hM = convertToMeter(height, unit); // 개별 박스 높이 (미터)

      const requiredContainers = calculateRequiredContainers({
        totalVolumeM3,
        totalWeightKg: totalWeight,
        singleBoxVolumeM3: volumeM3,
        singleBoxHeightM: hM,
      });

      setDisplayedResult({
        ...calculationResult,
        requiredContainers,
      });
      toast.success('CBM 계산이 완료되었습니다.');
    }
  }, [calculationResult, error, height, unit]);

  // 입력 영역
  const inputSection = (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="length">가로</Label>
          <Input
            id="length"
            value={length}
            onChange={handleInputChange(setLength)}
            placeholder="가로 길이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="width">세로</Label>
          <Input
            id="width"
            value={width}
            onChange={handleInputChange(setWidth)}
            placeholder="세로 길이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="height">높이</Label>
          <Input
            id="height"
            value={height}
            onChange={handleInputChange(setHeight)}
            placeholder="높이"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit">단위</Label>
          <Select value={unit} onValueChange={setUnit}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="단위 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm">cm</SelectItem>
              <SelectItem value="inch">inch</SelectItem>
              <SelectItem value="m">m</SelectItem>
              <SelectItem value="ft">ft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="weight">단위 중량 (kg)</Label>
          <Input
            id="weight"
            value={weight}
            onChange={handleInputChange(setWeight)}
            placeholder="단위 중량"
            className="text-right"
            type="number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">수량</Label>
          <Input
            id="quantity"
            value={quantity}
            onChange={handleInputChange(setQuantity)}
            placeholder="수량"
            className="text-right"
            type="number"
          />
        </div>
      </div>

      <Button onClick={handleCalculate} className="w-full">
        계산하기
      </Button>
    </div>
  );

  // 결과 영역
  const resultSection = (
    <>
      {displayedResult ? (
        <div className="w-full space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">BOX 정보</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">개당 부피 (CBM):</span>
                  <span className="font-mono">{displayedResult.volumeM3.toFixed(3)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">개당 부피 (cm³):</span>
                  <span className="font-mono">{displayedResult.volumeCm3.toFixed(0)} cm³</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">계산 결과</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 부피 (CBM):</span>
                  <span className="font-mono font-bold">{displayedResult.totalVolumeM3.toFixed(3)} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 중량:</span>
                  <span className="font-mono font-bold">{displayedResult.totalWeight.toFixed(1)} kg</span>
                </div>
                {displayedResult.requiredContainers && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (1단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].singleStack} 개</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (2단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].doubleStack} 개</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">컨테이너 적재 예상량</CardTitle>
              <p className="text-xs text-muted-foreground mt-2">※ 각 컨테이너에 적재 가능한 박스(개별 화물)의 예상 개수입니다.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="text-center">
                <p className="text-muted-foreground">20ft</p>
                <p>{Math.floor(33.2 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(33.2 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">40ft</p>
                <p>{Math.floor(67.6 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(67.6 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">40HC</p>
                <p>{Math.floor(76.3 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(76.3 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              <div className="text-center">
                <p className="text-muted-foreground">20ft(2단)</p>
                <p>{Math.floor(66.4 / displayedResult.volumeM3)} 개 <br /> (실제 약 {Math.floor(66.4 / displayedResult.volumeM3 * 0.85)}개)</p>
              </div>
              </div>
            </CardContent>
          </Card>

          {/* 결과 총합 */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">결과 총합</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 CBM:</span>
                  <span className="font-mono font-bold">{displayedResult.totalVolumeM3.toFixed(3)} CBM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 중량:</span>
                  <span className="font-mono font-bold">{displayedResult.totalWeight.toFixed(1)} kg</span>
                </div>
                {displayedResult.requiredContainers && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (1단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].singleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].singleStack} 개</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">필요한 컨테이너 (2단 적재):</span>
                      <div className="flex space-x-4">
                        <span className="font-mono">20&apos;ft {displayedResult.requiredContainers['20ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;ft {displayedResult.requiredContainers['40ft'].doubleStack} 개</span>
                        <span className="font-mono">40&apos;HC {displayedResult.requiredContainers['40HC'].doubleStack} 개</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex items-center justify-center text-muted-foreground">
          계산하기 버튼을 눌러주세요
        </div>
      )}
    </>
  );

  const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          글로벌 무역과 물류의 핵심, CBM을 정복하여 운송 비용을 최적화하세요!
        </p>
        <p>
          CBM(Cubic Meter, 입방미터)은 국제 무역 및 물류 현장에서 사용되는 가장 기본적인 부피 단위입니다.
          가로, 세로, 높이가 각각 1미터인 정육면체의 부피를 1 CBM이라고 하며,
          이는 화물의 공간 점유도를 나타내는 '공간의 언어'와 같습니다.
        </p>
        <p>
          정확한 CBM 계산은 운송 비용 산정, 컨테이너 공간 활용 계획, 효율적인 창고 관리,
          그리고 원활한 통관 절차에 이르기까지 물류의 모든 과정에 직접적인 영향을 미칩니다.
          특히 해상 및 항공 운송료는 화물의 실제 중량과 부피 중량 중 더 큰 값을 기준으로 책정되는 경우가 많아
          CBM을 정확히 아는 것이 곧 비용 절감의 첫걸음입니다.
        </p>
        <p>
          본 CBM 계산기는 수출입 기업 담당자, 포워더, 창고 관리자, 해외 구매대행 사업자,
          그리고 해외 이사나 유학을 준비하는 개인까지 물류와 관련된 모든 분들이
          복잡한 계산 없이 신속하고 정확하게 화물의 부피와 필요 컨테이너 수량을 예측할 수 있도록 설계되었습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">CBM 계산, 이렇게 간단합니다!</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">1. 개별 화물 부피 (CBM) 계산</p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              개당 부피 (m³) = 가로(m) × 세로(m) × 높이(m)
            </code>
            <p className="text-xs text-muted-foreground">
              계산기는 cm, inch, ft 등 다양한 단위로 입력해도 자동으로 미터(m)로 변환하여 계산합니다.
            </p>
          </div>
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">2. 총 부피 및 총 중량 계산</p>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              총 부피 (CBM) = 개당 부피 (m³) × 총 수량
            </code>
            <code className="block bg-muted p-2 rounded-md my-2 text-xs">
              총 중량 (kg) = 개당 중량 (kg) × 총 수량
            </code>
            <p className="text-xs text-muted-foreground">
              총 부피는 컨테이너 종류를 선택하는 기준이 되며, 총 중량은 선박이나 항공기의 중량 제한 초과 여부를 확인하는 데 필수적입니다.
            </p>
          </div>
          <div className="p-3 bg-card rounded-md shadow-sm border border-border">
            <p className="font-semibold text-primary">3. 컨테이너 적재 효율</p>
            <p className="text-xs text-muted-foreground mt-1">
              물류 업계에서는 컨테이너 실제 사용 가능 공간을 총 부피의 약 85%로 간주합니다.
              데드 스페이스, 컨테이너 구조, 화물 형태 등 현실적 요인이 반영된 수치입니다.
            </p>
          </div>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="mt-6">
        <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">💡 물류 전문가를 위한 CBM 활용 꿀팁</h3>
        <div className="space-y-4">
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">항공 운송의 핵심, 부피 중량을 이해하세요</p>
            <p className="text-xs mt-1 text-muted-foreground">
              항공 운송료는 실제 중량과 부피 중량 중 더 무거운 쪽을 기준으로 책정됩니다.
              부피 중량은 가로(cm)×세로(cm)×높이(cm) / 5000 공식으로 계산됩니다.
              가볍지만 부피가 큰 화물(솜, 의류, 플라스틱 등)은 부피 중량 때문에 운송비가 높아질 수 있으니 반드시 확인하세요.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">LCL vs FCL, 어떤 것이 유리할까요?</p>
            <p className="text-xs mt-1 text-muted-foreground">
              LCL(소량 화물)은 CBM 단위로 운송료가 계산되므로 CBM을 줄이는 것이 비용 절감에 직접적입니다.
              FCL(전체 컨테이너)은 총 화물량이 15~20CBM 이상일 경우 일반적으로 더 경제적입니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">정확한 측정과 포장 최적화</p>
            <p className="text-xs mt-1 text-muted-foreground">
              비정형 화물은 가장 긴 부분을 기준으로 가상의 직육면체를 만들어 CBM을 계산합니다.
              불필요한 포장재를 줄이거나 맞춤형 박스를 제작하면 CBM을 최소화할 수 있습니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">컨테이너 2단 적재 고려사항</p>
            <p className="text-xs mt-1 text-muted-foreground">
              화물 위에 다른 화물을 쌓으면 공간 효율을 높일 수 있지만,
              하단 화물의 포장이 상단 무게를 견딜 수 있는지 반드시 확인해야 합니다.
            </p>
          </div>
          <div className="p-3 border border-border rounded-lg">
            <p className="font-semibold text-sm">운송사별 부피 중량 환산율 비교</p>
            <p className="text-xs mt-1 text-muted-foreground">
              운송사마다 부피 중량 환산율(division factor)이 다를 수 있으므로,
              여러 운송사의 견적을 비교하여 가장 유리한 조건을 선택하세요.
            </p>
          </div>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="CBM 계산기"
      description="화물의 부피(CBM)와 총 중량을 계산하여 물류 계획에 도움을 받으세요."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default CBMCalculator;
