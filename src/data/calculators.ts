import { BarChart, Waves, Factory, Droplets, Beaker, Atom, Dna, Leaf, Brain, TestTube, Calculator as CalculatorIcon, Anchor, Wind, Sun, Cloud, Zap, Flame, DraftingCompass, Ruler, Square, Triangle, Circle, Sigma, Percent, Divide, Plus, Minus, Gamepad2, MoreHorizontal, Sparkles, Bot, FileText, Image, Wand2, Languages, Code, Mic, QrCode, Lock, Palette, GitCompare, Keyboard, Timer, Coins, Dice5, Calendar, Wifi, FileJson, FileCode, FileText as FileTextIcon, FileType, Hash, Mail, Type, Notebook, Globe, Shield, Binary, Link2, Search, Minimize2, Maximize2, ArrowLeftRight } from 'lucide-react';

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
          { id: 'deposit-interest', name: '정기예금 이자 계산기', href: '/calculators/finance/deposit-interest' },
          { id: 'regular-installment-savings', name: '정기적금 계산기', href: '/calculators/finance/regular-installment-savings' },
          { id: 'free-installment-savings', name: '자유적금 계산기', href: '/calculators/finance/free-installment-savings' },
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
        id: 'unit-converters',
        name: '단위 변환',
        calculators: [
          { id: 'unit-converter', name: '통합 단위 변환기', href: '/calculators/conversion/unit-converter' },
          { id: 'conversion-page', name: '빠른 단위 변환', href: '/calculators/conversion' },
          { id: 'data-size-converter', name: '데이터 크기 변환', href: '/calculators/conversion/data-size-converter' },
          { id: 'distance-converter', name: '거리 변환', href: '/calculators/conversion/distance-converter' },
          { id: 'speed-converter', name: '속도 변환', href: '/calculators/conversion/speed-converter' },
          { id: 'weight-converter', name: '무게 변환', href: '/calculators/conversion/weight-converter' },
          { id: 'volume-converter', name: '부피 변환', href: '/calculators/conversion/volume-converter' },
          { id: 'energy-converter', name: '에너지 변환', href: '/calculators/conversion/energy-converter' },
          { id: 'power-converter', name: '전력 변환', href: '/calculators/conversion/power-converter' },
        ],
      },
      {
        id: 'special-converters',
        name: '특수 변환',
        calculators: [
          { id: 'currency-converter', name: '환율 변환', href: '/calculators/conversion/currency-converter' },
          { id: 'timezone-converter', name: '시간대 변환', href: '/calculators/conversion/timezone-converter' },
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
          { id: 'date-difference-calculator', name: '날짜 차이 계산기', href: '/calculators/life/date-difference' },
          { id: 'countdown-timer', name: '카운트다운 타이머', href: '/calculators/life/countdown-timer' },
          { id: 'holiday-calendar', name: '휴일 캘린더', href: '/calculators/life/holiday-calendar' },
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
      {
        id: 'utility-tools',
        name: '유틸리티 도구',
        calculators: [
          { id: 'qr-generator', name: 'QR 코드 생성기', href: '/calculators/life/qr-generator' },
          { id: 'password-generator', name: '비밀번호 생성기', href: '/calculators/life/password-generator' },
          { id: 'color-picker', name: '색상 선택기', href: '/calculators/life/color-picker' },
          { id: 'text-difference', name: '텍스트 차이 비교', href: '/calculators/life/text-difference' },
          { id: 'typing-speed', name: '타이핑 속도 테스트', href: '/calculators/life/typing-speed' },
          { id: 'coin-flip', name: '동전 던지기', href: '/calculators/life/coin-flip' },
          { id: 'virtual-dice', name: '가상 주사위', href: '/calculators/life/virtual-dice' },
          { id: 'notepad', name: '메모장', href: '/calculators/life/notepad' },
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
      {
        id: 'material',
        name: '재질',
        icon: Beaker,
        calculators: [
          { id: 'materials', name: '재질 데이터베이스', href: '/calculators/engineering/material-property' },
          { id: 'comparison', name: '재질 물성 비교', href: '/calculators/engineering/material-comparison' },
          { id: 'corrosion-compatibility', name: '부식성 호환성 비교', href: '/calculators/engineering/corrosion-compatibility' },
        ],
      },
    ],
  },
  {
    id: 'ai-tools',
    name: 'AI 도구',
    icon: Sparkles,
    href: '/calculators/ai-tools',
    subcategories: [
      {
        id: 'text-tools',
        name: '텍스트 도구',
        calculators: [
          { id: 'text-summarizer', name: '텍스트 요약 도구', href: '/calculators/ai-tools/text-summarizer' },
          { id: 'grammar-checker', name: '맞춤법 검사기', href: '/calculators/ai-tools/grammar-checker' },
          { id: 'text-translator', name: '번역 도구', href: '/calculators/ai-tools/text-translator' },
          { id: 'lorem-ipsum-generator', name: '로렘 Ipsum 생성기', href: '/calculators/ai-tools/lorem-ipsum-generator' },
        ],
      },
      {
        id: 'image-tools',
        name: '이미지 도구',
        calculators: [
          { id: 'image-generator', name: '이미지 생성기', href: '/calculators/ai-tools/image-generator' },
          { id: 'image-resizer', name: '이미지 리사이저', href: '/calculators/ai-tools/image-resizer' },
          { id: 'image-converter', name: '이미지 변환', href: '/calculators/ai-tools/image-converter' },
        ],
      },
      {
        id: 'code-tools',
        name: '코드 도구',
        calculators: [
          { id: 'json-generator', name: 'JSON 생성기', href: '/calculators/ai-tools/json-generator' },
          { id: 'xml-generator', name: 'XML 생성기', href: '/calculators/ai-tools/xml-generator' },
          { id: 'yaml-generator', name: 'YAML 생성기', href: '/calculators/ai-tools/yaml-generator' },
          { id: 'json-prettifier', name: 'JSON 예쁘게', href: '/calculators/ai-tools/json-prettifier' },
          { id: 'json-minifier', name: 'JSON 축소', href: '/calculators/ai-tools/json-minifier' },
          { id: 'base64-encoder', name: 'Base64 인코더', href: '/calculators/ai-tools/base64-encoder' },
          { id: 'base64-decoder', name: 'Base64 디코더', href: '/calculators/ai-tools/base64-decoder' },
          { id: 'url-encoder', name: 'URL 인코더', href: '/calculators/ai-tools/url-encoder' },
          { id: 'url-decoder', name: 'URL 디코더', href: '/calculators/ai-tools/url-decoder' },
          { id: 'morse-code', name: '모스 부호 변환', href: '/calculators/ai-tools/morse-code' },
        ],
      },
      {
        id: 'productivity',
        name: '생산성 도구',
        calculators: [
          { id: 'prompt-generator', name: '프롬프트 생성기', href: '/calculators/ai-tools/prompt-generator' },
          { id: 'code-explainer', name: '코드 설명기', href: '/calculators/ai-tools/code-explainer' },
          { id: 'meeting-notes', name: '회의록 작성기', href: '/calculators/ai-tools/meeting-notes' },
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
        id: 'generators',
        name: '생성기',
        calculators: [
          { id: 'random-number-generator', name: '랜덤 숫자 생성기', href: '/calculators/others/random-number-generator' },
          { id: 'random-string-generator', name: '랜덤 문자열 생성기', href: '/calculators/others/random-string-generator' },
          { id: 'random-email-generator', name: '랜덤 이메일 생성기', href: '/calculators/others/random-email-generator' },
          { id: 'invoice-generator', name: '인보이스 생성기', href: '/calculators/others/invoice-generator' },
        ],
      },
      {
        id: 'network',
        name: '네트워크',
        calculators: [
          { id: 'internet-speed-test', name: '인터넷 속도 테스트', href: '/calculators/others/internet-speed-test' },
          { id: 'ip-lookup', name: 'IP 주소 조회', href: '/calculators/others/ip-lookup' },
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