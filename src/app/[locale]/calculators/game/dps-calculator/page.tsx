'use client';

import React, { useState, useMemo } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/i18n/I18nProvider';

interface DpsInputs {
  attackPower: number;
  attackSpeed: number;
  critChance: number;
  critMultiplier: number;
  bonusDamage: number;
  bonusSpeed: number;
}

const DpsCalculator: React.FC = () => {
  const { dict } = useI18n();
  const t = dict.dpsCalculator;

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
        <label className="block text-sm font-medium mb-1">{t.inputs.attackPower}</label>
        <Input
          type="number"
          min={0}
          value={inputs.attackPower}
          onChange={(e) => handleChange('attackPower', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.attackSpeed}</label>
        <Input
          type="number"
          min={0}
          step={0.1}
          value={inputs.attackSpeed}
          onChange={(e) => handleChange('attackSpeed', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.critChance}</label>
        <Input
          type="number"
          min={0}
          max={100}
          value={inputs.critChance}
          onChange={(e) => handleChange('critChance', e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{t.inputs.critMultiplier}</label>
        <Input
          type="number"
          min={1}
          step={0.1}
          value={inputs.critMultiplier}
          onChange={(e) => handleChange('critMultiplier', e.target.value)}
        />
      </div>

      <div className="pt-4 border-t">
        <h3 className="text-sm font-semibold mb-3">{t.inputs.bonusSection}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t.inputs.bonusDamage}</label>
            <Input
              type="number"
              value={inputs.bonusDamage}
              onChange={(e) => handleChange('bonusDamage', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">{t.inputs.bonusSpeed}</label>
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
        <span className="text-sm text-muted-foreground">{t.results.baseDpsNoCrit}</span>
        <p className="text-2xl font-bold">{results.baseDps.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <span className="text-sm text-muted-foreground">{t.results.baseDpsWithCrit}</span>
        <p className="text-2xl font-bold text-primary">{results.baseDpsWithCrit.toFixed(1)}</p>
      </div>
      <div className="p-4 bg-accent/20 rounded-lg border">
        <span className="text-sm text-muted-foreground">{t.results.buffedDps}</span>
        <p className="text-2xl font-bold text-primary">{results.buffedDps.toFixed(1)}</p>
      </div>
    </div>
  );

    const infoSection = {
    calculatorDescription: (
      <div className="space-y-4">
        <p>
          <strong>{t.info.title}</strong> {t.info.p1}
        </p>
        <p>{t.info.p2}</p>
        <p>{t.info.p3}</p>
        <p className="p-4 bg-muted rounded-lg border-l-4 border-primary">
          {t.info.tip}
        </p>
      <TermGlossary items={[
        { term: t.glossary.dps.term, desc: t.glossary.dps.desc },
        { term: t.glossary.crit.term, desc: t.glossary.crit.desc },
        { term: t.glossary.attackPower.term, desc: t.glossary.attackPower.desc },
        { term: t.glossary.attackSpeed.term, desc: t.glossary.attackSpeed.desc },
      ]} />
      </div>
    ),
    calculationFormula: (
      <div className="space-y-6">
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.baseDpsNoCrit}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.baseDpsFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.critCoefficient}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.critFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.critDps}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-lg font-bold">{t.formula.critDpsFormula}</p>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-lg mb-2 border-l-4 border-border pl-3">{t.formula.buffedDps}</h4>
          <div className="my-4 p-4 bg-muted rounded-lg text-center">
            <p className="font-mono text-sm">{t.formula.buffedFormula}</p>
          </div>
          <p className="text-sm text-muted-foreground">{t.formula.example}</p>
        </div>
      </div>
    ),
    usefulTips: (
      <div className="space-y-6">
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.critOpt}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.critTip1}</li>
            <li>{t.tips.critTip2}</li>
          </ul>
        </div>
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.speedValue}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.speedTip1}</li>
            <li>{t.tips.speedTip2}</li>
          </ul>
        </div>
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.buffStack}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.buffTip1}</li>
            <li>{t.tips.buffTip2}</li>
          </ul>
        </div>
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.gameRef}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.gameTip1}</li>
            <li>{t.tips.gameTip2}</li>
          </ul>
        </div>
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.comparison}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.compTip1}</li>
            <li>{t.tips.compTip2}</li>
          </ul>
        </div>
        <div className="p-4 border-l-4 border-primary bg-muted rounded-lg">
          <h4 className="font-bold text-lg mb-2">{t.tips.limits}</h4>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>{t.tips.limitTip1}</li>
            <li>{t.tips.limitTip2}</li>
          </ul>
        </div>
      </div>
    ),
  };

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      variant="grouped"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DpsCalculator;
