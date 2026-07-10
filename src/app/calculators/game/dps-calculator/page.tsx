'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import { Input } from '@/components/ui/input';

interface DpsInputs {
  attackPower: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  bonusDamage: number;
  bonusSpeed: number;
}

const DpsCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<DpsInputs>({
    attackPower: 100,
    attackSpeed: 1.0,
    critChance: 20,
    critMultiplier: 2.0,
    bonusDamage: 0,
    bonusSpeed: 0,
  });

  const results = useMemo(() => {
    const baseDps = inputs.attackPower * inputs.attackSpeed;
    const critFactor = 1 + (inputs.critChance / 100) * (inputs.critMultiplier - 1);
    const baseDpsWithCrit = baseDps * critFactor;

    const buffedAttackPower = inputs.attackPower * (1 + inputs.bonusDamage / 100);
    const buffedAttackSpeed = inputs.attackSpeed * (1 + inputs.bonusSpeed / 100);
    const buffedDps = buffedAttackPower * buffedAttackSpeed * critFactor;

    return { baseDps, baseDpsWithCrit, buffedDps };
  }, [inputs]);

  const handleChange = (key: keyof DpsInputs, value: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const inputSection = (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">공격력</label>
        <Input
          type="number"
          min={0}
          value={inputs.attackPower}
          onChange={(e) => handleChange('attackPower', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">공격 속도 (APS)</label>
        <Input
          type="number"
          min={0}
          step={0.1}
          value={inputs.attackSpeed}
          onChange={(e) => handleChange('attackSpeed', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">치명타 확률 (%)</label>
        <Input
          type="number"
          min={0}
          max={100}
          value={inputs.critChance}
          onChange={(e) => handleChange('critChance', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">치명타 배율</label>
        <Input
          type="number"
          min={1}
          step={0.1}
          value={inputs.critMultiplier}
          onChange={(e) => handleChange('critMultiplier', e.target.value)}
        />
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-semibold mb-3">버프 적용</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">추가 데미지 (%)</label>
            <Input
              type="number"
              value={inputs.bonusDamage}
              onChange={(e) => handleChange('bonusDamage', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">공격속도 (%)</label>
            <Input
              type="number"
              value={inputs.bonusSpeed}
              onChange={(e) => handleChange('bonusSpeed', e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const resultSection = (
    <div className="space-y-4">
      <div className="p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">기본 DPS (치명타 미적용)</span>
        <p className="text-2xl font-bold">{results.baseDps.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">기본 DPS (치명타 적용)</span>
        <p className="text-2xl font-bold text-primary">{results.baseDpsWithCrit.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-accent/20 rounded-lg border">
        <span className="text-sm text-muted-foreground">버프 적용 DPS</span>
        <p className="text-2xl font-bold text-primary">{results.buffedDps.toFixed(1)}</p>
      </div>
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>DPS(초당 데미지) 계산기</strong>는 게임 캐릭터의 전투력을 수치로 평가하는 도구입니다. 공격력, 공격 속도, 치명타 확률과 배율, 그리고 추가 데미지·공격속도 버프를 입력하면 기본 DPS와 버프 적용 DPS를 비교하여 얼마나 강한지 한눈에 파악할 수 있습니다.
        </p>
        <p>
          MMORPG, 액션 RPG, 슈팅 게임 등 대부분의 게임에서 DPS는 캐릭터 육성과 장비 투자의 방향을 결정하는 핵심 지표입니다. 어떤 스탯을 올리는 것이 효율적인지, 버프와 재화를 어디에 쓰는 것이 유리한지 판단하는 데 활용됩니다.
        </p>
        <p>
          일반 유저에게는 빌드 설계와 성장 가이드로, 공략 작성자와 길드 관리자에게는 파티 구성을 위한 분석 도구로 유용합니다. 또한 각 스탯의 기여도를 수치로 보여주어 직관적인 이해를 돕습니다.
        </p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          DPS는 평균 데미지입니다. 실제 전투는 몹의 방어력, 무적 프레임, 공격 간격 등 다양한 요인이 작용하므로 참고 지표로 활용하세요. 게임별 계수와 라운드 방식이 다르므로 수치는 상대 비교용으로 보는 것이 좋습니다.
        </p>
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">기본 DPS (치명타 미적용)</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">기본 DPS = 공격력 × 공격속도(APS)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">치명타 계수</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">치명타 계수 = 1 + (치명타확률 / 100) × (치명타배율 - 1)</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">치명타 적용 DPS</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">DPS = 공격력 × APS × 치명타 계수</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">버프 적용 DPS</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">버프 DPS = 공격력 × (1 + 추가데미지%/100) × APS × (1 + 공격속도%/100) × 치명타 계수</p>
          </div>
          <p className="text-sm text-muted-foreground">예: 공격력 100, APS 1.0, 치명타 20%/2.0, 버프 +10% 데미지·+5% 속도 → 약 115.5 DPS</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">치명타 최적화</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>치명타 확률이 높을수록 배율 투자의 효율이 커집니다.</li>
            <li>확률과 배율의 균형을 맞춰 기대 데미지를 높이세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">공격속도의 가치</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>공격속도는 DPS에 비례하므로 꾸준한 투자가 효과적입니다.</li>
            <li>속도 상한(캡)이 있는 게임은 한계를 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">버프 중첩</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>여러 버프는 곱셈으로 계산되므로 중첩 효과가 큽니다.</li>
            <li>동일 효과는 중복 적용되지 않는지 규칙을 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">게임별 참고</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>MMORPG: 딜러는 높은 DPS를 목표로 합니다.</li>
            <li>슈팅 게임: 명중률과 탄속도 함께 고려하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">상대 비교</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>장비 교체 전후 DPS를 비교해 투자 우선순위를 정하세요.</li>
            <li>버프 온·오프 상태를 모두 확인하세요.</li>
          </ul>
        </div>
        <div className="p-4 bg-card rounded-lg border border-border">
          <h4 className="font-bold text-lg mb-2">한계 이해</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>DPS는 방어력·무적 등을 반영하지 않는 평균값입니다.</li>
            <li>실전 패턴과 함께 종합적으로 판단하세요.</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title="DPS 계산기"
      description="초당 데미지(DPS)를 계산하고 버프 적용 효과를 확인합니다."
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DpsCalculator;
