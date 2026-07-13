'use client';

import React, { useState } from 'react';
import CalculatorsLayout from '@/components/calculators/Calculatorslayout';
import TermGlossary from '@/components/calculators/TermGlossary';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useI18n } from '@/i18n/I18nProvider';

const DueDateCalculator = () => {
  const { dict, locale } = useI18n();
  const isKo = locale === 'ko';

  const [lastPeriod, setLastPeriod] = useState('');
  const [result, setResult] = useState<{
    dueDate: string;
    currentWeek: number;
    trimester: string;
    trimesterColor: string;
    daysRemaining: number;
    milestones: { week: number; label: string; description: string }[];
  } | null>(null);

  const calculate = () => {
    if (!lastPeriod) {
      alert(isKo ? '마지막 생리 첫날 날짜를 입력해주세요.' : 'Please enter the first day of your last period.');
      return;
    }

    const lmp = new Date(lastPeriod);
    if (isNaN(lmp.getTime())) {
      alert(isKo ? '올바른 날짜를 입력해주세요.' : 'Please enter a valid date.');
      return;
    }

    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    lmp.setHours(0, 0, 0, 0);

    const daysSinceLMP = Math.floor((today.getTime() - lmp.getTime()) / (1000 * 60 * 60 * 24));
    const currentWeek = Math.floor(daysSinceLMP / 7);
    const daysRemaining = Math.max(0, Math.floor((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));

    let trimester: string;
    let trimesterColor: string;
    if (currentWeek < 13) {
      trimester = isKo ? '1분기 (1~12주)' : '1st Trimester (Week 1-12)';
      trimesterColor = 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300';
    } else if (currentWeek < 27) {
      trimester = isKo ? '2분기 (13~26주)' : '2nd Trimester (Week 13-26)';
      trimesterColor = 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300';
    } else {
      trimester = isKo ? '3분기 (27~40주)' : '3rd Trimester (Week 27-40)';
      trimesterColor = 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300';
    }

    const formatDate = (d: Date) => {
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
    };

    const milestones = [
      { week: 4, label: isKo ? '생리 예정일' : 'Expected Period', description: isKo ? '임신 초기, 태아 크기 겨자씨 크기' : 'Early pregnancy, poppy seed size' },
      { week: 8, label: isKo ? '초음파 확인' : 'Ultrasound Confirmation', description: isKo ? '심장 박동 확인 가능, 블루베리 크기' : 'Heartbeat visible, blueberry size' },
      { week: 12, label: isKo ? '1분기 종료' : 'End of 1st Trimester', description: isKo ? '유산 위험 감소, 레몬 크기' : 'Miscarriage risk decreases, lemon size' },
      { week: 16, label: isKo ? '양수 검사 가능' : 'Amniocentesis Available', description: isKo ? '태아 성별 확인 가능, 아보카도 크기' : 'Gender may be visible, avocado size' },
      { week: 20, label: isKo ? '대형 초음파' : 'Anatomy Scan', description: isKo ? '태아 기형 검사, 바나나 크기' : 'Detailed anatomy scan, banana size' },
      { week: 24, label: isKo ? '생존 가능성' : 'Viability Milestone', description: isKo ? '조산 시 생존 가능성 인정, 옥수수 크기' : 'Premature survival possible, corn size' },
      { week: 28, label: isKo ? '3분기 시작' : 'Start of 3rd Trimester', description: isKo ? '태동 느낄 수 있음, 대파 크기' : 'Feel movements, leek size' },
      { week: 32, label: isKo ? '태아 성장 촉진' : 'Rapid Growth', description: isKo ? '폐 성숙 시작, 코코넛 크기' : 'Lung maturation begins, coconut size' },
      { week: 36, label: isKo ? '만삭 전 검사' : 'Pre-term Check', description: isKo ? '태아 위치 확인, 상추 크기' : 'Baby position check, lettuce size' },
      { week: 40, label: isKo ? '출산 예정일' : 'Due Date', description: isKo ? '출산 예정일, 수박 크기' : 'Due date, watermelon size' },
    ];

    const formatDateEN = (d: Date) => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
    };

    setResult({
      dueDate: isKo ? formatDate(dueDate) : formatDateEN(dueDate),
      currentWeek: Math.min(currentWeek, 40),
      trimester,
      trimesterColor,
      daysRemaining,
      milestones,
    });
  };

  const inputSection = (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center space-x-4">
        <label className="w-40 text-sm font-medium">{isKo ? '마지막 생리 첫날' : 'First Day of Last Period'}:</label>
        <Input type="date" value={lastPeriod} onChange={(e) => setLastPeriod(e.target.value)} />
      </div>
      <div className="flex space-x-2">
        <Button onClick={calculate}>{isKo ? '계산' : 'Calculate'}</Button>
        <Button variant="secondary" onClick={() => setResult(null)}>{isKo ? '초기화' : 'Reset'}</Button>
      </div>
      <p className="text-xs text-muted-foreground">
        {isKo ? '* 마지막 생리 첫날으로부터 280일(40주) 후를 출산 예정일로 계산합니다.' : '* Due date is calculated as 280 days (40 weeks) from the first day of the last period.'}
      </p>
    </div>
  );

  const resultSection = (
    <div className="h-full">
      {result ? (
        <div className="space-y-4">
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <p className="text-sm text-muted-foreground">{isKo ? '출산 예정일' : 'Due Date'}</p>
            <p className="text-2xl font-bold text-primary">{result.dueDate}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{isKo ? '현재 주차' : 'Current Week'}</p>
              <p className="text-xl font-bold">{result.currentWeek}주</p>
            </div>
            <div className="p-3 bg-muted rounded-lg text-center">
              <p className="text-xs text-muted-foreground">{isKo ? '남은 기간' : 'Days Remaining'}</p>
              <p className="text-xl font-bold">{result.daysRemaining}{isKo ? '일' : ' days'}</p>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 bg-muted rounded-md">
            <span className="text-sm">{isKo ? '삼분기' : 'Trimester'}:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${result.trimesterColor}`}>{result.trimester}</span>
          </div>
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm">
            <p className="font-semibold mb-2">{isKo ? '주차별 이정표' : 'Weekly Milestones'}</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {result.milestones.map((m) => (
                <div key={m.week} className={`p-2 rounded-md text-xs ${m.week <= result.currentWeek ? 'bg-primary/10 border border-primary/20' : 'bg-card border border-border'}`}>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{isKo ? `${m.week}주` : `Week ${m.week}`}: {m.label}</span>
                    {m.week <= result.currentWeek && <span className="text-primary">{isKo ? '✓ 완료' : '✓ Done'}</span>}
                  </div>
                  <p className="text-muted-foreground mt-1">{m.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {isKo ? '마지막 생리 첫날 날짜를 입력하고 계산 버튼을 눌러주세요.' : 'Enter the first day of your last period and click Calculate.'}
        </div>
      )}
    </div>
  );

  const infoSection = isKo ? (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            출산 예정일을 정확하게 계산하세요!
          </p>
          <p>
            출산 예정일 계산기는 마지막 생리 첫날을 기준으로 출산 예정일을 계산합니다.
            의학적으로 임신 기간은 마지막 생리 첫날으로부터 280일(40주)로 산정됩니다.
          </p>
          <p>
            계산된 출산 예정일은 참고용이며, 실제 출산일은 예정일 전후 2주 정도 차이가 날 수 있습니다.
            임신 37~42주 사이의 출산을 만삭 출산으로 보며, 이 기간 내의 출산은 정상 범위입니다.
          </p>
          <p>
            현재 주차와 삼분기를 알려주고, 주차별 주요 이정표와 태아 성장 상태를 안내하여
            임신 기간 동안의 관리에 도움을 줍니다.
          </p>
          <TermGlossary items={[
            { term: '출산 예정일 (EDC)', desc: 'Estimated Date of Confinement. 마지막 생리 첫날으로부터 280일(40주) 후를 출산 예정일로 정합니다. 실제 출산일은 ±2주 차이가 날 수 있습니다.' },
            { term: '삼분기 (Trimester)', desc: '임신 기간을 3등분 한 것입니다. 1분기(1~12주), 2분기(13~26주), 3분기(27~40주)로 구분합니다.' },
            { term: '만삭', desc: '임신 37~42주를 만삭으로 봅니다. 이 기간 내 출산은 의학적으로 정상으로 간주됩니다.' },
            { term: '생리 첫날 (LMP)', desc: 'Last Menstrual Period. 마지막 월경 첫날을 의미하며, 임신 주수 계산의 기준점이 됩니다.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">출산 예정일 계산 공식</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">기본 공식 (Naegele&apos;s Rule)</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                출산 예정일 = 마지막 생리 첫날 + 280일 (40주)
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                또는 마지막 생리 첫날의 월에서 3을 빼고, 일에서 7을 더하는 방법도 사용됩니다.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                예시: 마지막 생리 첫날 = 2026년 1월 15일 → 출산 예정일 = 2026년 10월 22일
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">삼분기 구분</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-2 text-muted-foreground">
                <li><strong>1분기 (1~12주):</strong> 태아 장기 형성기, 유산 위험 가장 높음</li>
                <li><strong>2분기 (13~26주):</strong> 태아 성장기, 비교적 안정적인 시기</li>
                <li><strong>3분기 (27~40주):</strong> 태아 성숙기, 출산 준비 단계</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">태아 성장 크기 비교</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>4주:</strong> 겨자씨 (1~2mm)</li>
                <li><strong>8주:</strong> 블루베리 (1.5~2cm)</li>
                <li><strong>12주:</strong> 레몬 (5~6cm)</li>
                <li><strong>20주:</strong> 바나나 (25cm)</li>
                <li><strong>28주:</strong> 대파 (35cm)</li>
                <li><strong>36주:</strong> 상추 (47cm)</li>
                <li><strong>40주:</strong> 수박 (50~52cm)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">임신 관리 핵심 팁</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. 정기 검진을 놓치지 마세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                1분기에는 4주마다, 2분기에는 2~3주마다, 3분기에는 매주 검진을 받는 것이 권장됩니다.
                태아의 성장과 모체 건강을 체크하는 것이 중요합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. 엽산과 철분 섭취를 시작하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                임신 초기에는 엽산(400~800μg/일)이 태아 신경관 결손 예방에 중요하며,
                2분기부터는 철분제 보충이 빈혈 예방에 도움이 됩니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. 적절한 체중 증가를 유지하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                임신 전 BMI에 따라 적절한 체중 증가 범위가 다릅니다.
                정상 체중의 경우 임신 기간 중 11.5~16kg 증가가 적절합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. 운동은 가볍게 하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                임신 중 걷기, 수영, 가벼운 요가 등은 권장됩니다.
                하지만 고강도 운동이나 충격이 있는 활동은 피해야 합니다.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. 비상 연락처를 준비하세요</p>
              <p className="text-xs mt-1 text-muted-foreground">
                3분기에는 분만 병원 연락처, 응급 연락처, 출산 가방을 미리 준비해 두세요.
                진통이 시작되면 바로 병원에 연락할 수 있도록 준비합니다.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  ) : (
    {
      calculatorDescription: (
        <div className="space-y-4">
          <p className="text-lg font-semibold text-foreground">
            Accurately calculate your due date!
          </p>
          <p>
            The due date calculator computes your expected delivery date based on the first day
            of your last menstrual period (LMP). Medically, pregnancy duration is calculated
            as 280 days (40 weeks) from the LMP.
          </p>
          <p>
            The calculated due date is an estimate. The actual delivery date may differ by about
            ±2 weeks. Deliveries between weeks 37-42 are considered full-term and normal.
          </p>
          <p>
            It shows your current week, trimester, and provides weekly milestones and fetal
            development status to help you manage your pregnancy.
          </p>
          <TermGlossary items={[
            { term: 'Due Date (EDC)', desc: 'Estimated Date of Confinement. Set 280 days (40 weeks) from the first day of the last period. Actual delivery may vary ±2 weeks.' },
            { term: 'Trimester', desc: 'Pregnancy divided into three periods: 1st (weeks 1-12), 2nd (weeks 13-26), 3rd (weeks 27-40).' },
            { term: 'Full Term', desc: 'Weeks 37-42 of pregnancy. Deliveries during this period are considered medically normal.' },
            { term: 'LMP (Last Menstrual Period)', desc: 'The first day of the last menstrual period. Serves as the reference point for calculating pregnancy weeks.' },
          ]} />
        </div>
      ),
      calculationFormula: (
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Due Date Calculation Formula</h3>
          <div className="space-y-4 text-sm">
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Basic Formula (Naegele&apos;s Rule)</p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Due Date = LMP + 280 days (40 weeks)
              </code>
              <p className="text-xs text-muted-foreground mt-1">
                Alternatively: subtract 3 months from LMP month and add 7 days.
              </p>
              <code className="block bg-muted p-2 rounded-md my-2 text-xs">
                Example: LMP = January 15, 2026 → Due Date = October 22, 2026
              </code>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Trimester Breakdown</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-2 text-muted-foreground">
                <li><strong>1st Trimester (Weeks 1-12):</strong> Organ formation, highest miscarriage risk</li>
                <li><strong>2nd Trimester (Weeks 13-26):</strong> Fetal growth, relatively stable period</li>
                <li><strong>3rd Trimester (Weeks 27-40):</strong> Fetal maturation, birth preparation</li>
              </ul>
            </div>
            <div className="p-3 bg-card rounded-md shadow-sm border border-border">
              <p className="font-semibold text-primary">Fetal Size Comparison</p>
              <ul className="list-disc list-inside text-xs space-y-1 mt-1 text-muted-foreground">
                <li><strong>4 weeks:</strong> Poppy seed (1-2mm)</li>
                <li><strong>8 weeks:</strong> Blueberry (1.5-2cm)</li>
                <li><strong>12 weeks:</strong> Lemon (5-6cm)</li>
                <li><strong>20 weeks:</strong> Banana (25cm)</li>
                <li><strong>28 weeks:</strong> Leek (35cm)</li>
                <li><strong>36 weeks:</strong> Lettuce (47cm)</li>
                <li><strong>40 weeks:</strong> Watermelon (50-52cm)</li>
              </ul>
            </div>
          </div>
        </div>
      ),
      usefulTips: (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4 border-l-4 border-primary pl-3">Key tips for pregnancy management</h3>
          <div className="space-y-4">
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">1. Don&apos;t miss regular checkups</p>
              <p className="text-xs mt-1 text-muted-foreground">
                1st trimester: every 4 weeks; 2nd: every 2-3 weeks; 3rd: weekly checkups are recommended.
                Monitor fetal growth and maternal health.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">2. Start folic acid and iron supplements</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Early pregnancy requires folic acid (400-800μg/day) for neural tube defect prevention.
                From the 2nd trimester, iron supplementation helps prevent anemia.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">3. Maintain appropriate weight gain</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Weight gain varies by pre-pregnancy BMI. For normal weight, 11.5-16kg during
                pregnancy is appropriate.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">4. Exercise gently</p>
              <p className="text-xs mt-1 text-muted-foreground">
                Walking, swimming, and light yoga are recommended during pregnancy.
                Avoid high-intensity or high-impact activities.
              </p>
            </div>
            <div className="p-3 border-l-4 border-primary bg-muted rounded-lg">
              <p className="font-semibold text-sm">5. Prepare emergency contacts</p>
              <p className="text-xs mt-1 text-muted-foreground">
                In the 3rd trimester, prepare your delivery hospital contact, emergency contacts,
                and hospital bag in advance so you can respond immediately when labor begins.
              </p>
            </div>
          </div>
        </div>
      ),
    }
  );

  return (
    <CalculatorsLayout
      title={isKo ? '출산 예정일 계산기' : 'Due Date Calculator'}
      description={isKo ? '마지막 생리 첫날을 기준으로 출산 예정일, 현재 주차, 삼분기를 계산합니다.' : 'Calculate your due date, current week, and trimester based on the first day of your last period.'}
      variant="split"
      inputSection={inputSection}
      resultSection={resultSection}
      infoSection={infoSection}
    />
  );
};

export default DueDateCalculator;
