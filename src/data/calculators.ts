import { BarChart, Waves, Factory, Droplets, Beaker, Atom, Dna, Leaf, Brain, TestTube, Calculator as CalculatorIcon, Anchor, Wind, Sun, Cloud, Zap, Flame, DraftingCompass, Ruler, Square, Triangle, Circle, Sigma, Percent, Divide, Plus, Minus, Gamepad2, MoreHorizontal } from 'lucide-react';

export const calculatorCategories = [
  {
    id: 'finance',
    name: '금융',
    icon: Percent,
    href: '/calculators/finance',
    subcategories: [
      {
        id: 'interest-loan',
        name: '이자 및 대출 계산기',
        calculators: [
          
          { id: 'loan-interest', name: '대출 이자 계산기', href: '/calculators/finance/loan-interest' },
          { id: 'early-repayment-fee', name: '중도상환수수료 계산기', href: '/calculators/finance/early-repayment-fee' },
          { id: 'dti', name: 'DTI 계산기', href: '/calculators/finance/dti' },
          { id: 'installment-interest', name: '할부이자 계산기', href: '/calculators/finance/installment-interest' },
          { id: 'compound-interest', name: '복리 계산기', href: '/calculators/finance/compound-interest' },
          { id: 'installment-savings-monthly-compound-interest', name: '적립식 월 복리 계산기', href: '/calculators/finance/installment-savings-monthly-compound-interest' },
          { id: 'principal-equal-amortization', name: '원금 균등상환 계산기', href: '/calculators/finance/principal-equal-amortization' },
          { id: 'principal-and-interest-equal-repayment', name: '원리금 균등상환 계산기', href: '/calculators/finance/principal-and-interest-equal-repayment' },
          { id: 'credit-card-installment-fee', name: '신용카드 할부 수수료 계산기', href: '/calculators/finance/credit-card-installment-fee' },

        ],
      },
      {
        id: 'real-estate',
        name: '부동산 계산기',
        calculators: [
          { id: 'mortgage-calculator', name: '주택담보대출 계산기', href: '/calculators/finance/mortgage-calculator' },
          { id: 'property-tax-calculator', name: '부동산세 계산기', href: '/calculators/finance/property-tax-calculator' },
        ],
      },
      {
        id: 'business-income',
        name: '사업소득 계산기',
        calculators: [
          { id: 'vat-calculator', name: '부가가치세 계산기', href: '/calculators/finance/vat' },
        ],
      },
      {
        id: 'salary-income',
        name: '급여 및 소득',
        calculators: [
          { id: 'ordinary-wage', name: '통상임금 계산기', href: '/calculators/finance/ordinary-wage' },
          { id: 'insurance', name: '4대보험 계산기', href: '/calculators/finance/insurance' },
          { id: 'retirement', name: '퇴직금 계산기', href: '/calculators/finance/retirement' },
          { id: 'annual-leave', name: '연차 계산기', href: '/calculators/finance/annual-leave' },
        ],
      },
      {
        id: 'investment',
        name: '투자',
        calculators: [
          { id: 'stock-compound-interest', name: '주식 복리 계산기', href: '/calculators/finance/stock-compound-interest' },
          { id: 'cagr', name: 'CAGR 계산기', href: '/calculators/finance/cagr' },
        ],
      },
      {
        id: 'savings',
        name: '예/적금',
        calculators: [
          {
            id: 'deposit-interest',
            name: '정기예금 이자 계산기',
            href: '/calculators/finance/deposit-interest',
          },
          {
            id: 'regular-installment-savings',
            name: '정기적금 계산기',
            href: '/calculators/finance/regular-installment-savings',
          },
          {
            id: 'free-installment-savings',
            name: '자유적금 계산기',
            href: '/calculators/finance/free-installment-savings',
          },
        ],
      },
    ],
  },
  {
    id: 'conversion',
    name: '변환',
    icon: Ruler,
    href: '/calculators/conversion',
    subcategories: [
      {
        id: 'length',
        name: '길이 변환',
        calculators: [
          { id: 'cm-to-inch', name: '센티미터-인치 변환', href: '/calculators/conversion/cm-to-inch' },
        ],
      },
      {
        id: 'area',
        name: '넓이 변환',
        calculators: [
          { id: 'sqm-to-pyeong', name: '제곱미터-평 변환', href: '/calculators/conversion/sqm-to-pyeong' },
        ],
      },
      {
        id: 'temperature',
        name: '온도 변환',
        calculators: [
          { id: 'celsius-to-fahrenheit', name: '섭씨-화씨 변환', href: '/calculators/conversion/celsius-to-fahrenheit' },
        ],
      },
    ],
  },
  {
    id: 'life',
    name: '일상',
    icon: Sun,
    href: '/calculators/life',
    subcategories: [
      {
        id: 'health',
        name: '건강 계산기',
        calculators: [
          { id: 'bmi-calculator', name: 'BMI 계산기', href: '/calculators/life/bmi-calculator' },
          { id: 'bmr-calculator', name: '기초대사량 계산기', href: '/calculators/life/bmr-calculator' },
          { id: 'weight-loss-calculator', name: '체중 감량 계산기', href: '/calculators/life/weight-loss' },
        ],
      },
      {
        id: 'date-time',
        name: '날짜/시간 계산기',
        calculators: [

          { id: 'korean-age-calculator', name: '한국 나이 계산기', href: '/calculators/life/korean-age' },
          { id: 'anniversary-calculator', name: '기념일 계산기', href: '/calculators/life/anniversary' },
          { id: 'date-difference-calculator', name: '날짜 차이 계산기', href: '/calculators/life/date-difference-calculator' },
        ],
      },
      {
        id: 'shopping',
        name: '쇼핑 계산기',
        calculators: [
          { id: 'discount-calculator', name: '할인율 계산기', href: '/calculators/life/discount-calculator' },
        ],
      },
      {
        id: 'logistics',
        name: '물류',
        icon: Anchor,
        calculators: [
          { id: 'cbm-calculator', name: 'CBM 계산기', href: '/calculators/life/logistics/cbm-calculator' },
        ],
      },
    ],
  },
  {
    id: 'science',
    name: '과학',
    icon: Atom,
    href: '/calculators/science',
    subcategories: [
      {
        id: 'physics',
        name: '물리 계산기',
        calculators: [
            { id: 'velocity-calculator', name: '속도 계산기', href: '/calculators/science/velocity-calculator' },
            { id: 'kinetic-energy-calculator', name: '운동 에너지 계산기', href: '/calculators/science/kinetic-energy-calculator' },
            { id: 'torque-calculator', name: '토크 계산기', href: '/calculators/science/torque-calculator' },
            { id: 'force-calculator', name: '힘 계산기', href: '/calculators/science/force-calculator' },
          ],
      },
      {
        id: 'chemistry',
        name: '화학 계산기',
        calculators: [
          { id: 'molarity-calculator', name: '몰농도 계산기', href: '/calculators/science/molarity-calculator' },
        ],
      },
    ],
  },
  {
    id: 'engineering',
    name: '엔지니어링',
    icon: DraftingCompass,
    href: '/calculators/engineering',
    subcategories: [
      {
        id: 'fluid-mechanics',
        name: '유체 역학',
        calculators: [
          { id: 'npsh', name: 'NPSH 계산기', href: '/calculators/engineering/npsh' },
          { id: 'pump-power', name: '펌프 동력 계산기', href: '/calculators/engineering/pump-power' },
          { id: 'tank-volume', name: '탱크 용량 계산기', href: '/calculators/engineering/tank' },
        ],
      },
    ],
  },
  {
    id: 'material',
    name: '재질',
    icon: Beaker,
    href: '/calculators/material',
    subcategories: [
      {
        id: 'material-properties',
        name: '재질 속성',
        calculators: [
          { id: 'materials', name: '재질 데이터베이스', href: '/calculators/material/materials' },

        ],
      },
      {
        id: 'material-comparison',
        name: '재질별 물성',
        calculators: [
          { id: 'comparison', name: '재질 물성 비교', href: '/calculators/material/comparison' },
        ],
      },
      {
        id: 'corrosion-calculator',
        name: '부식 계산기',
        calculators: [
          { id: 'corrosion', name: '부식률 계산', href: '/calculators/material/corrosion' },
          { id: 'corrosion-compatibility', name: '부식성 호환성 비교', href: '/calculators/material/corrosion-compatibility' },
        ],
      },
    ],
  },
  {
    id: 'game',
    name: '게임',
    icon: Gamepad2,
    href: '/calculators/game',
    subcategories: [
      {
        id: 'rpg',
        name: 'RPG 도우미',
        calculators: [
          { id: 'dps-calculator', name: 'DPS 계산기', href: '/calculators/game/dps-calculator' },
        ],
      },
    ],
  },

  {
    id: 'others',
    name: '기타',
    icon: MoreHorizontal,
    href: '/calculators/others',
    subcategories: [
      {
        id: 'fun',
        name: '재미있는 계산기',
        calculators: [
          { id: 'random-number-generator', name: '랜덤 숫자 생성기', href: '/calculators/others/random-number-generator' },
        ],
      },
    ],
  },
];

export const calculators = {
  engineering: [
    {
      id: 'tank',
      name: 'Tank 계산기',
      description: '탱크의 부피, 용량 및 관련 수치를 계산합니다.',
      href: '/calculators/engineering/tank',
      icon: '🛢️',
      popular: true,
    },
    {
      id: 'npsh',
      name: 'NPSH 계산기',
      description: '펌프의 유효흡입수두(NPSH)를 계산하여 캐비테이션을 방지합니다.',
      href: '/calculators/engineering/npsh',
      icon: '💧',
      popular: true,
    },
    {
      id: 'pump-power',
      name: '펌프 동력 계산기',
      description: '펌프 작동에 필요한 동력을 계산합니다.',
      href: '/calculators/engineering/pump-power',
      icon: '⚡',
      popular: true,
    },
    {
      id: 'concrete-calculator',
      name: '콘크리트 계산기',
      description: '슬래브, 기초, 계단 등에 필요한 콘크리트 양을 계산합니다.',
      href: '/concrete-calculator',
      popular: true,
    },
    {
      id: 'lumber-calculator',
      name: '목재 계산기',
      description: '보드 피트, 선형 피트 등 목재 수량을 계산합니다.',
      href: '/lumber-calculator',
    },
  ],
  chemistry: [
    {
      id: 'molar-mass-calculator',
      name: '몰 질량 계산기',
      description: '화학식의 몰 질량을 계산합니다.',
      href: '/molar-mass-calculator',
      popular: true,
    },
    {
      id: 'solution-dilution-calculator',
      name: '용액 희석 계산기',
      description: '원하는 농도의 용액을 만들기 위해 필요한 희석 비율을 계산합니다.',
      href: '/solution-dilution-calculator',
    },
  ],
  finance: [
    {
      id: 'vat',
      name: '부가가치세 계산기',
      description: '공급가액과 합계금액을 기준으로 부가세를 계산합니다.',
      href: '/calculators/finance/vat',
      icon: '🧾',
      popular: true,
    },
  ],
  // 다른 카테고리 및 계산기들...
};

export const popularCalculators = Object.values(calculators)
  .flat()
  .filter(calc => calc.popular)
  .slice(0, 8);