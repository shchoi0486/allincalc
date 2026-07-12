'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useI18n } from '@/i18n/I18nProvider';

const TorqueCalculator = () => {
  const { dict, locale } = useI18n();
  const t = dict.torqueCalculator;
  const isKo = locale === 'ko';
  const L = (ko: string, en: string) => (isKo ? ko : en);

  const [force, setForce] = useState<number | ''>( '');
  const [distance, setDistance] = useState<number | ''>( '');
  const [forceUnit, setForceUnit] = useState('N');
  const [distanceUnit, setDistanceUnit] = useState('m');
  const [result, setResult] = useState<number | null>(null);

  const calculateTorque = () => {
    if (force === '' || distance === '') {
      alert(t.placeholder);
      return;
    }

    let forceInNewton = Number(force);
    if (forceUnit === 'kN') {
      forceInNewton *= 1000;
    } else if (forceUnit === 'lbf') {
      forceInNewton *= 4.44822;
    }

    let distanceInMeter = Number(distance);
    if (distanceUnit === 'cm') {
      distanceInMeter /= 100;
    } else if (distanceUnit === 'ft') {
      distanceInMeter *= 0.3048;
    }

    const torque = forceInNewton * distanceInMeter;
    setResult(torque);
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-2">
        <label htmlFor="force" className="w-24">{t.inputForce}</label>
        <Input
          id="force"
          type="number"
          value={force}
          onChange={(e) => setForce(Number(e.target.value))}
          placeholder={isKo ? '예: 50' : 'e.g. 50'}
          className="flex-grow"
        />
        <Select onValueChange={setForceUnit} value={forceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="N">N</SelectItem>
            <SelectItem value="kN">kN</SelectItem>
            <SelectItem value="lbf">lbf</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <label htmlFor="distance" className="w-24">{t.inputDistance}</label>
        <Input
          id="distance"
          type="number"
          value={distance}
          onChange={(e) => setDistance(Number(e.target.value))}
          placeholder={isKo ? '예: 2' : 'e.g. 2'}
          className="flex-grow"
        />
        <Select onValueChange={setDistanceUnit} value={distanceUnit}>
          <SelectTrigger className="w-[100px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m">m</SelectItem>
            <SelectItem value="cm">cm</SelectItem>
            <SelectItem value="ft">ft</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={calculateTorque} className="self-start">{t.calculateBtn}</Button>
    </div>
  );

  const resultSection = (
    result !== null ? (
      <Card>
        <CardHeader>
          <CardTitle>{t.resultTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{result.toLocaleString()} N·m</p>
          <p className="text-sm text-muted-foreground mt-2">{t.resultDescription.replace('{value}', result.toLocaleString())}</p>
        </CardContent>
      </Card>
    ) : (
      <div className="flex items-center justify-center text-muted-foreground h-full">
        {t.placeholder}
      </div>
    )
  );

const infoSection = {
  calculatorDescription: (
    <div className="space-y-4">
      <p>
        <strong>{L('토크(Torque) 계산기', 'Torque Calculator')}</strong>{L('는 물체를 특정 축을 중심으로 회전시키려는 힘의 경향을 정확하게 측정하는 물리학 도구입니다. 토크는 단순히 물체를 밀거나 당기는 직선적인 힘과는 달리, 힘이 가해지는 위치와 방향에 따라 그 효과가 달라지는 회전 운동의 핵심 물리량입니다.', ' is a physics tool that accurately measures the tendency of a force to rotate an object about a specific axis. Unlike a simple linear push or pull, torque is a core physical quantity of rotational motion whose effect depends on where and in what direction the force is applied.')}
      </p>
      <p>
        {L('가장 쉬운 예는 문을 여는 것입니다. 문 경첩(회전축)에서 멀리 떨어진 문고리를 밀 때 가장 쉽게 열리고, 경첩에 가까운 곳을 밀수록 더 많은 힘이 필요합니다. 이처럼 회전축으로부터의 거리와 힘의 크기가 결합하여 회전 효과를 만들어내는 것이 바로 토크입니다.', 'The simplest example is opening a door. It opens most easily when you push the handle far from the hinge (the axis), and needs more force near the hinge. Torque arises from the combination of the distance from the axis and the magnitude of the force.')}
      </p>
      <p>
        {L('토크는 자동차 엔진의 회전력, 자전거 페달의 작용력, 나사와 볼트를 조이는 공구의 힘, 심지어 전기 모터의 출력에 이르기까지 기계 시스템의 설계와 분석에 핵심적인 역할을 합니다.', 'Torque plays a central role in designing and analyzing mechanical systems — from a car engine’s rotational force and bicycle pedal force to the force of screwdrivers and wrenches and even electric motor output.')}
      </p>
      <p className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">
        {L('이 계산기는 힘과 회전축으로부터의 거리를 입력받아, 힘이 거리에 수직으로 작용할 때 발생하는 토크의 크기를 계산합니다. 학생들에게는 회전 역학을 이해시키는 교육 도구로서, 엔지니어들에게는 기계 설계, 구조 분석, 동력 시스템 개발 등에서 정확한 토크 데이터를 제공하는 실용적인 도구로 활용됩니다.', 'This calculator takes a force and a distance from the axis and computes the torque magnitude when the force acts perpendicular to the distance. It serves as an educational tool for rotational mechanics and a practical tool that gives engineers accurate torque data for machine design, structural analysis, and power system development.')}
      </p>
      <TermGlossary items={[
        { term: L('토크(Torque)', 'Torque'), desc: L('회전축을 중심으로 물체를 돌리려는 힘의 경향으로, 힘과 회전축까지의 거리(레버 암)에 비례하며 단위는 N·m입니다.', 'The tendency of a force to rotate an object about an axis; proportional to the force and the distance (lever arm) to the axis, with unit N·m.') },
        { term: L('레버 암(Lever arm)', 'Lever Arm'), desc: L('회전축에서 힘이 작용하는 지점까지의 수직 거리입니다. 거리가 멀수록 같은 힘으로 더 큰 토크를 얻습니다.', 'The perpendicular distance from the axis to the point where the force is applied. The farther it is, the greater the torque from the same force.') },
        { term: L('뉴턴미터(N·m)', 'Newton-meter (N·m)'), desc: L('토크의 국제 단위로, 1N의 힘을 1m의 팔길이로 작용시킬 때의 회전 효과를 나타냅니다.', 'The international unit of torque, representing the rotational effect of a 1 N force applied at a 1 m arm length.') },
      ]} />
    </div>
  ),
  calculationFormula: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">{L('토크 계산 기본 공식', 'Basic Torque Formula')}</h4>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">τ = r × F × sin(θ)</p>
        </div>
        <ul className="mt-4 space-y-2 text-sm">
          <li><strong className="font-semibold">τ (tau)</strong>: {L('토크, 국제 표준 단위는 뉴턴미터(N·m)', 'torque, international standard unit newton-meter (N·m)')}</li>
          <li><strong className="font-semibold">r (radius)</strong>: {L('회전축에서 힘이 작용하는 지점까지의 거리(레버 암), 단위는 미터(m)', 'distance from the axis to the force point (lever arm), unit meter (m)')}</li>
          <li><strong className="font-semibold">F (Force)</strong>: {L('가해지는 힘, 단위는 뉴턴(N)', 'applied force, unit newton (N)')}</li>
          <li><strong className="font-semibold">θ (theta)</strong>: {L('거리 벡터와 힘 벡터 사이의 각도', 'the angle between the distance vector and the force vector')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('단순화된 공식 (수직 작용 시)', 'Simplified Formula (Perpendicular Force)')}</h4>
        <p>{L('힘이 레버 암에 대해 수직(θ = 90°)으로 작용하면 sin(90°) = 1이므로:', 'When the force acts perpendicular to the lever arm (θ = 90°), sin(90°) = 1, so:')}</p>
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-center font-mono text-lg">τ = r × F</p>
        </div>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">{L('계산 예시', 'Example')}</h4>
        <p>{L('레버 암 0.5m인 렌치로 50N의 힘을 가할 때의 토크는?', 'What is the torque when a 50 N force is applied with a 0.5 m wrench?')}</p>
        <div className="my-2 p-3 bg-muted rounded-lg">
          <p className="font-mono text-sm text-center">τ = 0.5m × 50N = 25 N·m</p>
        </div>
        <p>{L('따라서 토크는 25 뉴턴미터입니다.', 'Therefore the torque is 25 newton-meters.')}</p>
      </div>
    </div>
  ),
  usefulTips: (
    <div className="space-y-6">
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('토크를 최대화하는 방법', 'How to Maximize Torque')}</h4>
        <p>{L('토크를 최대로 만들기 위한 세 가지 핵심 요소가 있습니다.', 'There are three key factors for maximizing torque.')}</p>
        <ul className="mt-2 list-decimal list-inside space-y-2">
          <li><strong>{L('더 큰 힘 가하기:', 'Apply more force:')}</strong> {L('더 세게 밀거나 당기면 토크가 커집니다.', 'pushing or pulling harder increases torque.')}</li>
          <li><strong>{L('레버 암 길게 하기:', 'Lengthen the lever arm:')}</strong> {L('회전축에서 최대한 멀리 떨어진 곳에 힘을 가합니다.', 'apply force as far from the axis as possible.')}</li>
          <li><strong>{L('각도를 90도로:', 'Angle at 90°:')}</strong> {L('레버 암에 수직으로 힘을 가할 때 토크가 최대가 됩니다.', 'torque is maximal when the force is perpendicular to the lever arm.')}</li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">{L('실생활 적용 사례', 'Real-Life Applications')}</h4>
        <ul className="space-y-3">
          <li className="p-3 border-l-4 border-primary bg-muted rounded-lg">
            <p className="font-semibold text-sm">{L('공구 사용', 'Tool Use')}</p>
            <p className="text-xs mt-1">
              {L('렌치, 스패너, 드라이버 등 모든 공구는 토크의 원리를 활용합니다. 토크 렌치는 특정 토크 값으로 정확하게 조이기 위해 사용됩니다.', 'Wrenches, spanners, and screwdrivers all use the principle of torque. A torque wrench is used to tighten to a specific torque value.')}
            </p>
          </li>
          <li className="p-3 border-l-4 border-primary bg-muted rounded-lg">
            <p className="font-semibold text-sm">{L('자동차', 'Automobile')}</p>
            <p className="text-xs mt-1">
              {L('최대 토크는 엔진이 낼 수 있는 최대 회전력을 의미하며, 정지 출발이나 언덕 오를 때 성능을 결정합니다.', 'Maximum torque is the greatest rotational force an engine can produce, determining performance when starting off or climbing hills.')}
            </p>
          </li>
          <li className="p-3 border-l-4 border-primary bg-muted rounded-lg">
            <p className="font-semibold text-sm">{L('자전거', 'Bicycle')}</p>
            <p className="text-xs mt-1">
              {L('페달을 밟아 크랭크를 돌리는 것이 토크를 생성하는 과정이며, 기어 변속은 토크 관계를 조절하는 것입니다.', 'Pedaling turns the crank, generating torque; gear shifting adjusts the torque relationship.')}
            </p>
          </li>
        </ul>
      </div>
      <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 rounded-r-lg">
        <p className="font-bold text-sm">{L('오른손 법칙', 'Right-Hand Rule')}</p>
        <p className="text-xs mt-1">
          {L('토크는 벡터량으로, 방향은 오른손 법칙으로 결정합니다. 오른손 네 손가락을 회전 방향으로 감았을 때, 엄지손가락이 가리키는 방향이 토크 벡터의 방향입니다.', 'Torque is a vector quantity whose direction is given by the right-hand rule: curl the fingers of the right hand in the rotation direction, and the thumb points along the torque vector.')}
        </p>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">{L('단위 변환', 'Unit Conversion')}</h4>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li><strong>1 N·m</strong> = 1 {L('줄(J)', 'joule (J)')}</li>
          <li><strong>1 kgf·m</strong> = 9.80665 N·m</li>
          <li><strong>1 ft·lbf</strong> = 1.35582 N·m</li>
          <li><strong>1 in·lbf</strong> = 0.11298 N·m</li>
        </ul>
      </div>
    </div>
  )
};

  return (
    <CalculatorsLayout
      title={t.title}
      description={t.description}
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
      variant="split"
    />
  );
};

export default TorqueCalculator;
