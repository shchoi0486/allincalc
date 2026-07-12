import type { Dictionary } from './en';

export const ko: Dictionary = {
  common: {
    searchPlaceholder: '계산기를 검색하세요...',
    language: '언어',
    selectLanguage: '언어 선택',
    theme: '테마 전환',
    calculate: '계산하기',
    calculating: '계산 중...',
    result: '계산 결과',
    error: '유효한 숫자를 입력해주세요',
    calculated: '계산되었습니다.',
    enterValues: '값을 입력해주세요.',
    clear: '초기화',
    home: '홈',
    back: '뒤로가기',
    unitSystem: '단위 체계',
    unitSystemMetric: '미터법 (SI)',
    unitSystemImperial: '야드·파운드 (Imperial)',
    categories: '카테고리',
    preparing: '준비중',
    moreTopics: '더 많은 토픽',
    basicUnits: '기본 단위',
    engineeringUnits: '공학 단위',
    unitCategories: {
      length: '길이',
      area: '면적',
      volume: '체적',
      temperature: '온도',
      energy: '열에너지',
      flow: '유량',
      pressure: '압력',
      mass: '질량',
      enthalpy: '엔탈피',
    },
    ohmsLaw: {
      title: '옴의 법칙 계산기',
      description: '전압(V), 전류(I), 저항(R), 전력(P) 중 2가지 값을 입력하면 나머지 값을 계산합니다.',
      inputs: {
        voltage: '전압 (Voltage, V)',
        current: '전류 (Current, I)',
        resistance: '저항 (Resistance, R)',
        power: '전력 (Power, P)',
      },
      results: {
        enterTwo: '2개의 값을 입력해주세요.',
        calculated: '계산 완료',
        clearTwo: '계산하려면 최소 2개의 필드를 비워주세요.',
      },
      details: {
        title: '📚 옴의 법칙 공식 및 이론',
        description: '옴의 법칙은 도체의 두 지점 사이에 흐르는 전류가 두 지점 간의 전위차(전압)에 비례한다는 법칙입니다.',
      }
    },
    idealGas: {
      title: '이상기체 상태방정식 계산기',
      description: '압력(P), 부피(V), 몰수(n), 온도(T) 중 3가지를 입력하여 나머지 하나를 계산합니다.',
      inputs: {
        calcTarget: '계산할 항목',
        pressure: '압력 (Pressure, P)',
        volume: '부피 (Volume, V)',
        moles: '몰수 (Moles, n)',
        temperature: '온도 (Temperature, T)',
      },
      results: {
        pressure: '압력 (P)',
        volume: '부피 (V)',
        moles: '몰수 (n)',
        temperature: '온도 (T)',
      },
      visualization: {
        title: '등온선 (P-V Curve)',
        xAxis: '부피 (V)',
        yAxis: '압력 (P)',
      },
      details: {
        title: '📚 이상기체 상태방정식 이론',
        description: '이상기체 상태방정식(PV = nRT)은 이상기체의 압력, 부피, 온도 간의 관계를 나타냅니다.',
      }
    },
    pipeFriction: {
      title: '파이프 마찰 손실 계산기',
      description: 'Darcy-Weisbach 방정식을 사용하여 파이프 내 마찰로 인한 수두 손실 및 압력 손실을 계산합니다.',
      inputs: {
        length: '파이프 길이 (L)',
        diameter: '내경 (D)',
        velocity: '유속 (v)',
        frictionFactor: 'Darcy 마찰 계수 (f)',
        density: '유체 밀도 (ρ)',
      },
      results: {
        headLoss: '수두 손실 (h_f)',
        pressureLoss: '압력 손실 (ΔP)',
      },
      visualization: {
        title: '손실 요약',
      },
      details: {
        title: '📚 Darcy-Weisbach 방정식',
        description: 'Darcy-Weisbach 방정식은 비압축성 유체 흐름에서 파이프 길이에 따른 마찰로 인한 수두 손실 또는 압력 손실을 평균 유속과 연관시키는 현상학적 방정식입니다.',
      }
    },
    beamDeflection: {
      title: '빔 처짐 계산기',
      description: '자유단에 집중 하중이 가해지는 외팔보(Cantilever beam)의 최대 처짐량을 계산합니다.',
      inputs: {
        load: '집중 하중 (P)',
        length: '빔 길이 (L)',
        elasticity: '탄성 계수 (E)',
        inertia: '단면 2차 모멘트 (I)',
      },
      results: {
        maxDeflection: '최대 처짐량 (δ)',
      },
      visualization: {
        title: '빔 처짐 다이어그램',
      },
      details: {
        title: '📚 외팔보 처짐 공식',
        description: '최대 처짐은 외팔보의 자유단에서 발생하며, 다음 공식을 사용하여 계산됩니다: δ = (P × L³) / (3 × E × I).',
      }
    },
    voltageDrop: {
      title: '전압 강하 계산기',
      description: '전선 굵기, 거리, 부하 전류에 따른 전기 회로의 전압 강하를 계산합니다.',
      inputs: {
        material: '전선 재질',
        copper: '구리 (Cu)',
        aluminum: '알루미늄 (Al)',
        wireSize: '전선 굵기 (AWG 또는 mm²)',
        voltage: '시스템 전압 (V)',
        phase: '상 (Phase)',
        singlePhase: '단상 (1-Phase)',
        threePhase: '3상 (3-Phase)',
        current: '부하 전류 (A)',
        distance: '케이블 길이 (L)',
      },
      results: {
        voltageDrop: '전압 강하 (V_drop)',
        percentage: '강하율 (%)',
        endVoltage: '도달 전압 (V_end)',
      },
      visualization: {
        title: '전압 강하 다이어그램',
      },
      details: {
        title: '📚 전압 강하 공식',
        description: '전압 강하는 옴의 법칙(V = I × R)을 사용하여 계산됩니다. 단상 회로의 경우: V_drop = 2 × I × R × L / 1000. 3상 회로의 경우: V_drop = √3 × I × R × L / 1000.',
      }
    },
    thermalExpansion: {
      title: '열팽창 계산기',
      description: '온도 변화에 따른 재질의 선팽창 길이를 계산합니다.',
      inputs: {
        material: '재질',
        custom: '사용자 지정',
        aluminum: '알루미늄',
        copper: '구리',
        steel: '강철',
        concrete: '콘크리트',
        glass: '유리',
        coefficient: '열팽창 계수 (α)',
        length: '초기 길이 (L₀)',
        t1: '초기 온도 (T₁)',
        t2: '최종 온도 (T₂)',
      },
      results: {
        changeInLength: '길이 변화량 (ΔL)',
        finalLength: '최종 길이 (L₁)',
      },
      visualization: {
        title: '열팽창 다이어그램',
      },
      details: {
        title: '📚 선팽창 공식',
        description: '선팽창은 온도 변화로 인해 재질의 길이가 변하는 현상입니다. 공식: ΔL = α × L₀ × ΔT.',
      }
    },
    asmeB313: {
      title: 'ASME B31.3 배관 두께/압력 계산기',
      description: 'ASME B31.3 코드에 따른 배관의 허용 압력 또는 요구 벽 두께를 계산합니다.',
      inputs: {
        calcTarget: '계산할 항목',
        targetPressure: '허용 압력 (P)',
        targetThickness: '벽 두께 (t)',
        diameter: '외경 (D)',
        thickness: '벽 두께 (t)',
        pressure: '내부 압력 (P)',
        stress: '허용 응력 (S)',
        qualityFactor: '품질 계수 (E)',
        coefficientY: '두께 계수 (Y)',
        tolerance: '두께 허용 오차 (α, %)',
      },
      results: {
        allowablePressure: '허용 압력 (P)',
        requiredThickness: '요구 두께 (t)',
      },
      visualization: {
        title: '배관 단면 다이어그램',
      },
      details: {
        title: '📚 ASME B31.3 공식',
        description: 'ASME B31.3 코드는 요구 두께에 대해 t = (P × D) / (2 × (S × E + P × Y)), 허용 압력에 대해 P = (2 × t × S × E) / (D - 2 × t × Y) 공식을 사용합니다.',
      }
    },
    barlowsFormula: {
      title: '바를로(Barlow) 공식 계산기',
      description: '바를로의 공식을 사용하여 파이프의 항복 압력, 파열 압력 및 최대 허용 압력을 계산합니다.',
      inputs: {
        diameter: '외경 (D_o)',
        thickness: '벽 두께 (t)',
        yieldStrength: '항복 강도 (S_y)',
        ultimateStrength: '인장 강도 (S_t)',
        designFactor: '설계 계수 (F_d)',
        jointFactor: '이음 계수 (F_e)',
        temperatureFactor: '온도 저하 계수 (F_t)',
      },
      results: {
        yieldPressure: '항복 압력 (P_y)',
        burstPressure: '파열 압력 (P_t)',
        allowablePressure: '허용 설계 압력 (P_a)',
      },
      visualization: {
        title: '압력 한계 요약',
      },
      details: {
        title: '📚 바를로의 공식 이론',
        description: '바를로의 공식은 파이프의 치수 및 재질 강도와 내부 압력 간의 관계를 나타냅니다. P_y = (2 × S_y × t) / D_o, P_t = (2 × S_t × t) / D_o, P_a = (2 × S_y × F_d × F_e × F_t × t) / D_o.',
      }
    },
    asmeSectionViii: {
      title: 'ASME Section VIII 압력용기 계산기',
      description: 'ASME Section VIII Div 1에 따라 내압을 받는 원통형 및 구형 압력용기의 요구 두께를 계산합니다.',
      inputs: {
        vesselType: '용기 형태',
        cylinder: '원통형 (Cylinder)',
        sphere: '구형 (Sphere)',
        pressure: '설계 압력 (P)',
        radius: '내부 반지름 (R)',
        stress: '허용 응력 (S)',
        efficiency: '용접 효율 (E)',
      },
      results: {
        thickness: '요구 두께 (t)',
      },
      visualization: {
        title: '압력용기 단면',
      },
      details: {
        title: '📚 ASME Section VIII Div 1 공식',
        description: '원통형: t = (P × R) / (S × E - 0.6 × P). 구형: t = (P × R) / (2 × S × E - 0.2 × P).',
      }
    },
    heatTransfer: {
      title: '열전도 계산기',
      description: '푸리에의 열전도 법칙(Fourier\'s Law)을 사용하여 재질을 통과하는 열전달률을 계산합니다.',
      inputs: {
        area: '표면적 (A)',
        thickness: '재질 두께 (d)',
        conductivity: '열전도율 (k)',
        t1: '고온 측 온도 (T₁)',
        t2: '저온 측 온도 (T₂)',
      },
      results: {
        heatRate: '열전달률 (Q)',
        heatFlux: '열유속 (q = Q/A)',
      },
      visualization: {
        title: '온도 구배 다이어그램',
      },
      details: {
        title: '📚 푸리에의 법칙 (Fourier\'s Law)',
        description: '푸리에의 열전도 법칙: Q = (k × A × ΔT) / d. (k: 열전도율, A: 면적, d: 두께)',
      }
    },
    sensibleHeat: {
      title: '현열 부하 계산기',
      description: '상변화 없이 물질의 온도를 변화시키는 데 필요한 현열 부하(가열/냉각)를 계산합니다.',
      inputs: {
        massFlow: '질량 유량 (m)',
        specificHeat: '비열 (C_p)',
        t1: '초기 온도 (T₁)',
        t2: '최종 온도 (T₂)',
      },
      results: {
        heatLoad: '현열 부하 (Q)',
      },
      visualization: {
        title: '가열/냉각 프로세스',
      },
      details: {
        title: '📚 현열 공식',
        description: '현열 공식은 Q = m × C_p × ΔT 입니다. 물질의 상태 변화가 없을 때 적용됩니다.',
      }
    },
    reynoldsNumber: {
      title: '레이놀즈 수 계산기',
      description: '유체 흐름이 층류인지 난류인지를 판별하기 위해 레이놀즈 수를 계산합니다.',
      inputs: {
        density: '유체 밀도 (ρ)',
        velocity: '유속 (v)',
        diameter: '파이프 내경 (D)',
        viscosity: '동점성 계수 (μ)',
      },
      results: {
        reynoldsNumber: '레이놀즈 수 (Re)',
        flowRegime: '흐름 상태',
        laminar: '층류 (Laminar)',
        transitional: '천이 영역 (Transitional)',
        turbulent: '난류 (Turbulent)',
      },
      visualization: {
        title: '유동 특성 시각화',
      },
      details: {
        title: '📚 레이놀즈 수 이론',
        description: '레이놀즈 수는 유체 흐름의 패턴을 예측하는 무차원 수입니다. Re = (ρ × v × D) / μ. Re < 2300: 층류, 2300-4000: 천이 영역, Re > 4000: 난류.',
      }
    },
    springRate: {
      title: '스프링 상수 계산기',
      description: '나선형 압축 스프링의 스프링 상수(Spring Rate)를 계산합니다.',
      inputs: {
        wireDiameter: '소선 직경 (d)',
        outerDiameter: '외경 (D_o)',
        activeCoils: '유효 권수 (n_a)',
        shearModulus: '전단 탄성 계수 (G)',
      },
      results: {
        springRate: '스프링 상수 (k)',
        meanDiameter: '평균 직경 (D)',
      },
      visualization: {
        title: '스프링 제원',
      },
      details: {
        title: '📚 스프링 상수 공식',
        description: '스프링 상수 k의 계산식: k = (G × d⁴) / (8 × D³ × n_a), 여기서 평균 직경 D = D_o - d 입니다.',
      }
    },
    radiationHeat: {
      title: '복사 열전달 계산기',
      description: '슈테판-볼츠만 법칙(Stefan-Boltzmann Law)을 사용하여 물체와 주위 환경 간의 순 복사 열전달량을 계산합니다.',
      inputs: {
        emissivity: '방사율 (ε)',
        area: '표면적 (A)',
        t1: '물체 온도 (T₁)',
        t2: '주위 온도 (T₂)',
      },
      results: {
        heatTransfer: '순 복사 열전달량 (Q)',
      },
      visualization: {
        title: '복사 프로세스',
      },
      details: {
        title: '📚 슈테판-볼츠만 법칙',
        description: '순 복사 열전달량 Q = ε × σ × A × (T₁⁴ - T₂⁴). σ는 슈테판-볼츠만 상수(5.67×10⁻⁸ W/m²K⁴)입니다. 참고: 계산 시 온도는 절대온도(K 또는 R)로 변환되어 적용됩니다.',
      }
    },
    gearRatio: {
      title: '기어비 계산기',
      description: '단순 기어 트레인의 기어비, 출력 속도 및 출력 토크를 계산합니다.',
      inputs: {
        teeth1: '구동 기어 잇수 (N₁)',
        teeth2: '피동 기어 잇수 (N₂)',
        speed1: '구동 기어 속도 (RPM₁)',
        torque1: '구동 기어 토크 (τ₁)',
      },
      results: {
        gearRatio: '기어비 (GR)',
        speed2: '피동 기어 속도 (RPM₂)',
        torque2: '피동 기어 토크 (τ₂)',
      },
      visualization: {
        title: '기어 회전 프로세스',
      },
      details: {
        title: '📚 기어비 공식',
        description: '기어비 = N₂ / N₁. 출력 속도 = 입력 속도 / 기어비. 출력 토크 = 입력 토크 × 기어비.',
      }
    },
    bernoulli: {
      title: '베르누이 방정식 계산기',
      description: '비압축성 유동에 대한 베르누이 방정식을 사용하여 두 번째 지점의 유속이나 압력을 계산합니다.',
      inputs: {
        density: '유체 밀도 (ρ)',
        p1: '지점 1의 압력 (P₁)',
        v1: '지점 1의 유속 (v₁)',
        h1: '지점 1의 높이 (h₁)',
        p2: '지점 2의 압력 (P₂)',
        h2: '지점 2의 높이 (h₂)',
      },
      results: {
        v2: '지점 2의 유속 (v₂)',
      },
      visualization: {
        title: '유체 흐름 프로세스',
      },
      details: {
        title: '📚 베르누이 방정식',
        description: 'P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂. 유선에 따른 정상, 비압축성, 비점성 유동을 가정합니다.',
      }
    },
    carnotEfficiency: {
      title: '카르노 효율 계산기',
      description: '두 온도 사이에서 작동하는 열기관의 최대 이론적 효율을 계산합니다.',
      inputs: {
        th: '고열원 온도 (T_H)',
        tc: '저열원 온도 (T_C)',
      },
      results: {
        efficiency: '카르노 효율 (η)',
      },
      visualization: {
        title: '열기관 프로세스',
      },
      details: {
        title: '📚 카르노 효율 공식',
        description: 'η = 1 - (T_C / T_H). 온도는 절대 온도 스케일(Kelvin 또는 Rankine)로 계산됩니다. 이는 어떠한 열기관이 가질 수 있는 최대 한계 효율을 나타냅니다.',
      }
    },
    stressStrain: {
      title: '응력 및 변형률 계산기',
      description: '축 하중을 받는 재료의 응력, 변형률 및 영률(탄성 계수)을 계산합니다.',
      inputs: {
        force: '작용하는 힘 (F)',
        area: '단면적 (A)',
        originalLength: '원래 길이 (L₀)',
        changeLength: '길이 변화량 (ΔL)',
      },
      results: {
        stress: '응력 (σ)',
        strain: '변형률 (ε)',
        youngsModulus: '영률 (E)',
      },
      visualization: {
        title: '변형 프로세스',
      },
      details: {
        title: '📚 응력 및 변형률 공식',
        description: '응력 σ = F/A, 변형률 ε = ΔL/L₀, 영률 E = σ/ε 입니다.',
      }
    },
    eulerBuckling: {
      title: '오일러 좌굴 하중 계산기',
      description: '오일러의 공식을 사용하여 기둥이 좌굴되기 시작하는 임계 하중을 계산합니다.',
      inputs: {
        elasticModulus: '영률 (E)',
        inertia: '단면 2차 모멘트 (I)',
        length: '지지되지 않은 길이 (L)',
        kFactor: '유효 길이 계수 (K)',
      },
      results: {
        criticalLoad: '임계 좌굴 하중 (P_cr)',
      },
      visualization: {
        title: '좌굴 모드 형상',
      },
      details: {
        title: '📚 오일러의 임계 하중 공식',
        description: 'P_cr = (π² × E × I) / (K × L)². 이 값은 길고 가느다란 기둥이 좌굴 없이 지탱할 수 있는 최대 축 하중을 나타냅니다.',
      }
    },
    rcCircuit: {
      title: 'RC 회로 시정수 계산기',
      description: '저항-커패시터(RC) 회로의 시정수와 최대 충전량을 계산합니다.',
      inputs: {
        resistance: '저항 (R)',
        capacitance: '정전 용량 (C)',
        voltage: '공급 전압 (V)',
      },
      results: {
        timeConstant: '시정수 (τ)',
        maxCharge: '최대 전하량 (Q)',
      },
      visualization: {
        title: '커패시터 충전 곡선',
      },
      details: {
        title: '📚 RC 회로 공식',
        description: '시정수 τ = R × C. 최대 전하량 Q = C × V. 충전 중 커패시터 양단의 전압은 V_c(t) = V × (1 - e^(-t/τ)) 입니다.',
      }
    },
    acPower: {
      title: '교류 전력 계산기',
      description: '교류(AC) 회로에서의 유효 전력, 무효 전력 및 피상 전력을 계산합니다.',
      inputs: {
        systemPhase: '상 시스템 (Phase)',
        voltage: '전압 (V)',
        current: '전류 (I)',
        phaseAngle: '위상각 (θ)',
      },
      results: {
        realPower: '유효 전력 (P)',
        reactivePower: '무효 전력 (Q)',
        apparentPower: '피상 전력 (S)',
        powerFactor: '역률 (PF)',
      },
      visualization: {
        title: '전력 삼각형 (Power Triangle)',
      },
      details: {
        title: '📚 교류 전력 공식',
        description: '피상 전력 S = V × I (VA). 유효 전력 P = S × cos(θ) (W). 무효 전력 Q = S × sin(θ) (VAR). 역률 = cos(θ).',
      }
    },
    bearingLife: {
      title: '베어링 수명 (L10) 계산기',
      description: 'ISO 281 규격을 기반으로 구름 베어링의 기본 정격 수명(L10)을 계산합니다.',
      inputs: {
        bearingType: '베어링 유형',
        dynamicLoad: '동적 정격 하중 (C)',
        equivalentLoad: '등가 동하중 (P)',
        speed: '회전 속도 (N)',
      },
      results: {
        lifeRevolutions: '회전 수명 (L10)',
        lifeHours: '시간 수명 (L10h)',
      },
      visualization: {
        title: '베어링 수명-하중 곡선',
      },
      details: {
        title: '📚 ISO 281 베어링 수명 공식',
        description: 'L10 = (C/P)^p [백만 회전]. 볼 베어링의 경우 p = 3, 롤러 베어링의 경우 p = 10/3 입니다. L10 수명은 동일한 베어링 군의 90%가 피로 박리 없이 도달하거나 초과하는 수명을 의미합니다.',
      }
    },
    manningsEquation: {
      title: '매닝의 방정식 계산기',
      description: '매닝의 방정식(Manning\'s Equation)을 사용하여 개수로(Open Channel)의 유속과 유량을 계산합니다.',
      inputs: {
        roughness: '조도 계수 (n)',
        area: '단면적 (A)',
        wettedPerimeter: '윤변 (P)',
        slope: '수로 경사 (S)',
      },
      results: {
        hydraulicRadius: '경심 (R)',
        velocity: '유속 (V)',
        discharge: '유량 (Q)',
      },
      visualization: {
        title: '개수로 유동 단면',
      },
      details: {
        title: '📚 매닝의 방정식 (Manning\'s Equation)',
        description: 'SI 단위계: V = (1/n) × R^(2/3) × S^(1/2). Imperial 단위계: V = (1.486/n) × R^(2/3) × S^(1/2). 경심 R = A/P 이며, 유량 Q = V × A 입니다.',
      }
    },
    uValue: {
      title: '열관류율 (U-Value) 계산기',
      description: '다층 벽체나 표면의 종합적인 열 전달 계수(열관류율, U-Value)를 계산합니다.',
      inputs: {
        insideH: '실내 열전달 계수 (h_i)',
        outsideH: '실외 열전달 계수 (h_o)',
        layer1K: '층 1 열전도율 (k₁)',
        layer1D: '층 1 두께 (d₁)',
        layer2K: '층 2 열전도율 (k₂)',
        layer2D: '층 2 두께 (d₂)',
      },
      results: {
        totalR: '총 열저항 (R_t)',
        uValue: '열관류율 (U-Value)',
      },
      visualization: {
        title: '벽체 열 프로파일',
      },
      details: {
        title: '📚 열관류율 및 열저항',
        description: '총 열저항 R_t = 1/h_i + (d₁/k₁) + (d₂/k₂) + ... + 1/h_o. 열관류율 U-Value = 1 / R_t. 열관류율 값이 낮을수록 단열 성능이 우수함을 의미합니다.',
      }
    },
    soundPressure: {
      title: '음압 레벨 (SPL) 거리 계산기',
      description: '역제곱 법칙(Inverse Square Law)을 사용하여 자유 음장에서 거리에 따른 음압 레벨의 감쇠를 계산합니다.',
      inputs: {
        l1: '초기 음압 레벨 (L₁)',
        r1: '기준 거리 (r₁)',
        r2: '목표 거리 (r₂)',
      },
      results: {
        l2: '목표 음압 레벨 (L₂)',
        attenuation: '감쇠량 (Drop)',
      },
      visualization: {
        title: '소리 감쇠 곡선',
      },
      details: {
        title: '📚 소리에 대한 역제곱 법칙',
        description: 'L₂ = L₁ - 20 × log₁₀(r₂/r₁). 반사가 없는 자유 음장에서는 점음원으로부터 거리가 2배 멀어질 때마다 음압 레벨이 약 6dB씩 감소합니다.',
      }
    },
    pumpAffinity: {
      title: '펌프 상사법칙 계산기',
      description: '회전 속도나 임펠러 직경이 변할 때 원심 펌프의 성능(유량, 양정, 동력) 변화를 계산합니다.',
      inputs: {
        speed1: '초기 속도 (N₁)',
        flow1: '초기 유량 (Q₁)',
        head1: '초기 양정 (H₁)',
        power1: '초기 축동력 (P₁)',
        speed2: '목표 속도 (N₂)',
      },
      results: {
        flow2: '새로운 유량 (Q₂)',
        head2: '새로운 양정 (H₂)',
        power2: '새로운 축동력 (P₂)',
      },
      visualization: {
        title: '성능 변화 비교',
      },
      details: {
        title: '📚 원심 펌프의 상사법칙 (Affinity Laws)',
        description: '유량: Q₂ = Q₁ × (N₂/N₁). 양정: H₂ = H₁ × (N₂/N₁)². 축동력: P₂ = P₁ × (N₂/N₁)³. 이 법칙은 기하학적으로 상사한 펌프에 적용됩니다.',
      }
    },
    psychrometric: {
      title: '사이크로메트릭 (공기선도) 계산기',
      description: '건구 온도와 상대 습도를 기반으로 이슬점(노점), 절대 습도, 엔탈피 등 습공기의 상태를 계산합니다.',
      inputs: {
        dryBulb: '건구 온도 (T_db)',
        relativeHumidity: '상대 습도 (RH)',
      },
      results: {
        dewPoint: '이슬점 온도 (T_dp)',
        humidityRatio: '절대 습도 (W)',
        enthalpy: '비엔탈피 (h)',
      },
      visualization: {
        title: '습공기 상태 개요',
      },
      details: {
        title: '📚 공기선도 상태 방정식',
        description: '표준 대기압(101.325 kPa)을 기준으로 계산됩니다. 포화 수증기압은 Magnus-Tetens 공식을 사용하며, 엔탈피는 건공기의 현열과 수증기의 잠열을 합산하여 도출됩니다.',
      }
    },
    waterHammer: {
      title: '수격 현상 (Water Hammer) 계산기',
      description: 'Joukowsky 방정식을 사용하여 밸브의 급격한 차단으로 인해 발생하는 배관 내 최대 압력 상승(수격 현상)을 계산합니다.',
      inputs: {
        density: '유체 밀도 (ρ)',
        waveSpeed: '음속 / 파동 속도 (a)',
        initialVelocity: '초기 유속 (v₁)',
        finalVelocity: '최종 유속 (v₂)',
      },
      results: {
        pressureSurge: '압력 상승분 (ΔP)',
      },
      visualization: {
        title: '밸브 차단 충격파',
      },
      details: {
        title: '📚 Joukowsky 방정식',
        description: 'ΔP = ρ × a × Δv. 유체의 급격한 속도 변화는 배관 내에 압력파를 발생시킵니다. 배관 파손을 방지하기 위해 밸브는 2L/a 보다 긴 시간에 걸쳐 서서히 차단되어야 합니다.',
      }
    },
    coolingTower: {
      title: '쿨링타워 (냉각탑) 설계 계산기',
      description: '냉각탑의 입구/출구 수온과 대기의 습구 온도를 바탕으로 Range(냉각폭), Approach(접근도), Effectiveness(효율)를 계산합니다.',
      inputs: {
        hotWater: '입구 온수 온도 (T_hw)',
        coldWater: '출구 냉수 온도 (T_cw)',
        wetBulb: '대기 습구 온도 (T_wb)',
      },
      results: {
        range: 'Range (냉각폭)',
        approach: 'Approach (접근도)',
        effectiveness: 'Effectiveness (냉각 효율 η)',
      },
      visualization: {
        title: '냉각탑 온도 프로파일',
      },
      details: {
        title: '📚 냉각탑 성능 지표',
        description: 'Range = T_hw - T_cw. Approach = T_cw - T_wb. 효율 = Range / (Range + Approach) × 100%. Approach(접근도)가 작을수록 냉각수가 이론적 한계인 습구 온도에 가깝게 냉각됨을 의미합니다.',
      }
    },
    specificSpeed: {
      title: '펌프 비속도 (Ns) 계산기',
      description: '펌프의 비속도(Specific Speed)를 계산하여 가장 적합한 임펠러 형상(원심형, 사류형, 축류형)을 판별합니다.',
      inputs: {
        speed: '펌프 회전수 (N)',
        flow: '최고 효율점 유량 (Q)',
        head: '최고 효율점 1단 양정 (H)',
      },
      results: {
        specificSpeed: '비속도 (N_s)',
        impellerType: '추천 임펠러 형상',
      },
      visualization: {
        title: '임펠러 선정 차트',
      },
      details: {
        title: '📚 비속도 공식',
        description: 'N_s = N × √Q / H^(0.75). 비속도는 펌프의 성능과 기하학적 비례를 분류하는 무차원(또는 특정 단위 체계의) 지수입니다. 낮은 비속도는 원심형(Radial), 높은 비속도는 축류형(Axial)에 적합합니다.',
      }
    },
    lmtd: {
      title: '대수평균온도차(LMTD) 계산기',
      description: '열교환기의 성능 평가를 위한 대수평균온도차(LMTD)를 계산합니다.',
      inputs: {
        hotIn: '고온 유체 입구 온도',
        hotOut: '고온 유체 출구 온도',
        coldIn: '저온 유체 입구 온도',
        coldOut: '저온 유체 출구 온도',
        flowType: '유동 형태',
      },
      results: {
        deltaT1: 'ΔT₁',
        deltaT2: 'ΔT₂',
        lmtd: '대수평균온도차 (LMTD)',
      },
      visualization: {
        title: '온도 프로파일',
      },
    },
    orificeFlow: {
      title: '오리피스 유량 계산기',
      description: '오리피스 플레이트를 통과하는 유체의 유량을 베르누이 방정식과 유량 계수를 사용하여 계산합니다.',
      inputs: {
        pipeDiameter: '배관 직경 (D)',
        orificeDiameter: '오리피스 직경 (d)',
        pressureDrop: '차압 (ΔP)',
        density: '유체 밀도 (ρ)',
        dischargeCoefficient: '유량 계수 (Cd)',
      },
      results: {
        betaRatio: '베타 비 (β)',
        areaOrifice: '오리피스 단면적',
        velocity: '오리피스 통과 유속',
        flowRate: '체적 유량 (Q)',
      },
      visualization: {
        title: '오리피스 유동 다이어그램',
      },
    },
    torquePower: {
      title: '토크 및 동력 계산기',
      description: '토크와 회전 속도를 기반으로 기계적 동력을 계산합니다.',
      inputs: {
        torque: '토크 (τ)',
        speed: '회전 속도 (N)',
      },
      results: {
        power: '기계적 동력 (P)',
      },
      visualization: {
        title: '동력-토크 상관관계',
      },
    },
    centrifuge: {
      title: '원심 분리기 (RCF) 계산기',
      description: '로터 반경과 RPM을 기반으로 상대 원심력(g-force)을 계산합니다.',
      inputs: {
        radius: '로터 반경 (r)',
        speed: '회전 속도 (N)',
      },
      results: {
        rcf: '상대 원심력 (RCF)',
        angularVelocity: '각속도 (ω)',
      },
      visualization: {
        title: '원심력 다이어그램',
      },
    },
    tubePressureDrop: {
      title: '열교환기 튜브 압력 강하 계산기',
      description: 'Darcy-Weisbach 방정식을 이용하여 열교환기 튜브 내부의 압력 강하를 계산합니다.',
      inputs: {
        length: '튜브 길이 (L)',
        diameter: '내부 직경 (D)',
        velocity: '유속 (v)',
        density: '유체 밀도 (ρ)',
        frictionFactor: '마찰 계수 (f)',
      },
      results: {
        pressureDrop: '압력 강하 (ΔP)',
        headLoss: '수두 손실 (h_f)',
      },
      visualization: {
        title: '압력 강하 프로파일',
      },
    },
    cycloneEfficiency: {
      title: '사이클론 분리기 효율 계산기',
      description: 'Lapple 모델을 사용하여 사이클론 분리기의 분리 한계 입경(cut size, d50)을 계산합니다.',
      inputs: {
        diameter: '사이클론 직경 (D)',
        inletWidth: '입구 폭 (W)',
        inletVelocity: '입구 유속 (Vi)',
        gasViscosity: '가스 점도 (μ)',
        particleDensity: '입자 밀도 (ρp)',
        gasDensity: '가스 밀도 (ρg)',
      },
      results: {
        cutSize: '분리 한계 입경 (d50)',
        turns: '유효 회전수 (Ne)',
      },
      visualization: {
        title: '사이클론 분리 한계 차트',
      },
    },
    ductFriction: {
      title: '공기 덕트 마찰 손실 계산기',
      description: '사각 또는 원형 공기 덕트의 마찰 손실을 계산합니다.',
      inputs: {
        flowRate: '공기 유량 (Q)',
        width: '덕트 폭 (W)',
        height: '덕트 높이 (H)',
        roughness: '절대 조도 (ε)',
      },
      results: {
        velocity: '공기 유속 (v)',
        hydraulicDiameter: '수력 직경 (Dh)',
        frictionLoss: '단위 길이당 마찰 손실',
      },
      visualization: {
        title: '덕트 단면도',
      },
    },
    hydraulicJump: {
      title: '수력 도약 계산기',
      description: '개수로 내 수력 도약(Hydraulic Jump) 발생 시의 도약 후 수심과 에너지 손실을 계산합니다.',
      inputs: {
        depth: '초기 수심 (y₁)',
        velocity: '초기 유속 (v₁)',
      },
      results: {
        froudeNumber: '프루드 수 (Fr₁)',
        sequentDepth: '도약 후 수심 (y₂)',
        energyLoss: '에너지 손실 (ΔE)',
      },
      visualization: {
        title: '수력 도약 프로파일',
      },
    },
    apiGravity: {
      title: 'API 비중 계산기',
      description: 'API 규격에 따른 석유류의 API 비중, 비중(SG) 및 밀도를 상호 변환하고 계산합니다.',
      inputs: {
        inputType: '입력 방식',
        apiValue: 'API 비중',
        sgValue: '비중 (SG)',
      },
      results: {
        apiGravity: 'API 비중',
        specificGravity: '비중 (SG)',
        densityKgM3: '밀도 (kg/m³)',
        densityLbGal: '밀도 (lb/gal)',
        classification: '원유 분류',
      },
      visualization: {
        title: '밀도 비교',
      },
    },
    api650Tank: {
      title: 'API 650 탱크 두께 계산기',
      description: 'API 650 규격에 따른 강제 저장 탱크의 최소 요구 쉘 두께를 계산합니다.',
      inputs: {
        diameter: '탱크 직경 (D)',
        height: '액체 높이 (H)',
        specificGravity: '비중 (G)',
        allowableStress: '허용 응력 (Sd)',
        corrosionAllowance: '부식 여유 (CA)',
      },
      results: {
        designThickness: '설계 두께 (t_d)',
        hydrotestThickness: '수압 시험 두께 (t_t)',
      },
      visualization: {
        title: '탱크 쉘 프로파일',
      },
    },
    asce7WindLoad: {
      title: 'ASCE 7-16 풍하중 계산기',
      description: 'ASCE 7-16 규격에 따라 구조물 설계용 설계 풍압(Velocity Pressure)을 계산합니다.',
      inputs: {
        windSpeed: '기본 풍속 (V)',
        exposure: '노출 카테고리 (Exposure)',
        height: '기준 지붕 높이 (z)',
        topographic: '지형 계수 (K_zt)',
        directionality: '방향성 계수 (K_d)',
      },
      results: {
        velocityPressure: '설계 풍압 (q_z)',
        exposureCoeff: '노출 계수 (K_z)',
      },
      visualization: {
        title: '풍압 프로파일 시각화',
      },
    },
    iso1127Pipe: {
      title: 'ISO 1127 스텐레스 배관 계산기',
      description: 'ISO 1127 규격에 따른 스텐레스 강관의 단위 무게 및 단면적을 계산합니다.',
      inputs: {
        outerDiameter: '외경 (D)',
        thickness: '두께 (t)',
      },
      results: {
        weight: '단위 길이당 무게 (W)',
        flowArea: '내부 유로 면적',
      },
      visualization: {
        title: '배관 단면도',
      },
    },
    din10220Pipe: {
      title: 'DIN EN 10220 강관 파열 압력 계산기',
      description: 'DIN EN 10220 치수 규격 및 DIN 재질 등급을 기반으로 강관의 파열 압력 및 허용 압력을 계산합니다.',
      inputs: {
        outerDiameter: '외경 (D)',
        thickness: '두께 (t)',
        materialGrade: 'DIN 재질 등급',
        safetyFactor: '안전율 (FS)',
      },
      results: {
        burstPressure: '파열 압력 (P_b)',
        allowablePressure: '허용 압력 (P_allow)',
      },
      visualization: {
        title: '압력 한계 시각화',
      },
    },
    iso2533Atmosphere: {
      title: 'ISO 2533 표준 대기 계산기',
      description: 'ISO 2533 규격에 따라 특정 고도에서의 대기 특성(온도, 압력, 밀도)을 계산합니다.',
      inputs: {
        altitude: '고도 (h)',
      },
      results: {
        temperature: '온도 (T)',
        pressure: '대기압 (P)',
        density: '공기 밀도 (ρ)',
        speedOfSound: '음속 (a)',
      },
      visualization: {
        title: '대기 프로파일',
      },
    },
  },
  nav: {
    finance: '금융',
    conversion: '변환',
    life: '일상',
    science: '과학',
    engineering: '엔지니어링',
    aiTools: 'AI 도구',
    game: '게임',
    others: '기타',
  },
  home: {
    title: '모든 필요를 위한 온라인 계산기',
    subtitle:
      '금융, 건강, 일상, 엔지니어링 등 다양한 분야의 계산기를 지금 바로 만나보세요.',
    adPlaceholder: '광고 영역 (애드센스 / 쿠팡 코드 삽입)',
    press: '프레스',
    about: 'AllinCalc 소개',
  },
  footer: {
    press: '프레스',
    editorialPolicy: '편집 정책',
    partnership: '파트너십',
    about: 'AllinCalc 소개',
    resources: '자료실',
    intro: '소개',
    library: '자료실',
    affiliate: '제휴',
    contact: '문의하기',
    blog: '블로그',
    copyright: 'All rights reserved.',
  },
  categories: {
    searchPlaceholder: '계산기 검색...',
    titleSuffix: '계산기',
    notFound: '카테고리를 찾을 수 없습니다.',
    loading: '로딩 중...',
    totalCalculators: '총 {count}개의 계산기가 있습니다.',
    finance: {
      name: '금융',
      description: '저희 금융 계산기를 사용하여 투자 계획을 세우고, 이자율을 계산하고, 구매 시 절약되는 금액을 예상해 보세요. 각 계산기에는 해당 주제에 대한 풍부한 금융 정보와 함께 계산 공식이 포함되어 있습니다.',
    },
    conversion: {
      name: '변환',
      description: '다양한 단위를 손쉽게 변환해 보세요. 길이, 무게, 부피, 에너지, 전력, 환율, 시간대 등生活中 필요한 모든 변환을 빠르고 정확하게 처리할 수 있습니다.',
    },
    life: {
      name: '일상',
      description: '건강, 시간, 쇼핑 등 일상 생활과 관련된 다양한 계산기를 제공합니다. 저희 계산기를 사용하여 건강한 삶을 계획하고 시간을 효율적으로 관리하며 현명한 소비를 경험해 보세요.',
    },
    science: {
      name: '과학',
      description: '물리학, 화학 등 다양한 과학 분야의 계산기를 제공합니다. 복잡한 과학적 계산을 빠르고 정확하게 해결하여 연구와 학습에 도움을 받으세요.',
    },
    engineering: {
      name: '엔지니어링',
      description: '유체 역학, 재질 분석 등 다양한 공학 분야의 계산기를 제공합니다. 복잡한 공학 문제를 해결하고 설계 및 분석 작업을 효율적으로 수행해 보세요.',
    },
    'ai-tools': {
      name: 'AI 도구',
      description: 'AI 기반 생산성 도구를 제공합니다. 텍스트 요약, 맞춤법 검사, 번역, 이미지 생성, 프롬프트 작성 등 다양한 AI 도구를 활용해 보세요.',
    },
    game: {
      name: '게임',
      description: 'RPG 등 다양한 장르의 게임 플레이에 도움이 되는 계산기를 제공합니다. 캐릭터의 DPS를 계산하고 게임 내 전략을 세우는 데 활용해 보세요.',
    },
    others: {
      name: '기타',
      description: '어디에도 속하지 않는 재미있고 유용한 계산기들을 모아두었습니다. 무작위 숫자 생성기 등 일상에 소소한 재미를 더해 줄 계산기들을 만나 보세요.',
    },
  },
  subcategoryNames: {
    'interest-loan': '이자 및 대출 계산기',
    'real-estate': '부동산 계산기',
    'business-income': '사업소득 계산기',
    'salary-income': '급여 및 소득',
    investment: '투자',
    savings: '예/적금',
    'unit-converters': '단위 변환',
    'special-converters': '특수 변환',
    health: '건강 계산기',
    'date-time': '날짜 및 시간 계산기',
    shopping: '쇼핑 계산기',
    logistics: '물류/택배',
    'utility-tools': '유틸리티 도구',
    physics: '물리학 계산기',
    chemistry: '화학 계산기',
    'fluid-mechanics': '유체 역학',
    piping: '배관 및 압력용기',
    thermodynamics: '열역학',
    hvac: '공기조화 (HVAC)',
    mechanical: '기계 공학',
    electrical: '전기 공학',
    chemical: '화학 공학',
    material: '재질',
    acoustics: '음향 및 진동',
    'civil-structural': '토목 및 구조 공학',
    'text-tools': '텍스트 도구',
    'image-tools': '이미지 도구',
    'code-tools': '코드 도구',
    productivity: '생산성 도구',
    rpg: 'RPG 도우미',
    generators: '생성기',
    network: '네트워크',
  },
  calculatorNames: {
    'loan-interest': '대출 이자 계산기',
    'early-repayment-fee': '중도상환수수료 계산기',
    dti: 'DTI 계산기',
    'installment-interest': '할부이자 계산기',
    'compound-interest': '복리 계산기',
    'installment-savings-monthly-compound-interest': '적립식 월 복리 계산기',
    'principal-equal-amortization': '원금 균등상환 계산기',
    'principal-and-interest-equal-repayment': '원리금 균등상환 계산기',
    'credit-card-installment-fee': '신용카드 할부 수수료 계산기',
    'mortgage-calculator': '주택담보대출 계산기',
    'property-tax-calculator': '부동산세 계산기',
    'vat-calculator': '부가가치세 계산기',
    'ordinary-wage': '통상임금 계산기',
    insurance: '4대보험 계산기',
    retirement: '퇴직금 계산기',
    'annual-leave': '연차 계산기',
    'stock-compound-interest': '주식 복리 계산기',
    cagr: 'CAGR 계산기',
    'deposit-interest': '정기예금 이자 계산기',
    'regular-installment-savings': '정기적금 계산기',
    'free-installment-savings': '자유적금 계산기',
    'unit-converter': '통합 단위 변환기',
    'conversion-page': '빠른 단위 변환',
    'data-size-converter': '데이터 크기 변환',
    'distance-converter': '거리 변환',
    'speed-converter': '속도 변환',
    'weight-converter': '무게 변환',
    'volume-converter': '부피 변환',
    'energy-converter': '에너지 변환',
    'power-converter': '전력 변환',
    'currency-converter': '환율 변환',
    'timezone-converter': '시간대 변환',
    'bmi-calculator': 'BMI 계산기',
    'bmr-calculator': '기초대사량 계산기',
    'weight-loss-calculator': '체중 감량 계산기',
    'korean-age-calculator': '한국 나이 계산기',
    'anniversary-calculator': '기념일 계산기',
    'date-difference-calculator': '날짜 차이 계산기',
    'countdown-timer': '카운트다운 타이머',
    'holiday-calendar': '휴일 캘린더',
    'discount-calculator': '할인율 계산기',
    'cbm-calculator': 'CBM 계산기',
    'qr-generator': 'QR 코드 생성기',
    'password-generator': '비밀번호 생성기',
    'color-picker': '색상 선택기',
    'text-difference': '텍스트 차이 비교',
    'typing-speed': '타이핑 속도 테스트',
    'coin-flip': '동전 던지기',
    'virtual-dice': '가상 주사위',
    notepad: '메모장',
    'velocity-calculator': '속도 계산기',
    'kinetic-energy-calculator': '운동 에너지 계산기',
    'torque-calculator': '토크 계산기',
    'force-calculator': '힘 계산기',
    'molarity-calculator': '몰농도 계산기',
    npsh: 'NPSH 계산기',
    'pump-power': '펌프 동력 계산기',
    'tank-volume': '탱크 용량 계산기',
    'free-fall': '자유 낙하 계산기',
    'ohms-law': '옴의 법칙 계산기',
    'ideal-gas': '이상기체 상태방정식 계산기',
    'pipe-friction': '파이프 마찰 손실 계산기',
    'beam-deflection': '빔 처짐 계산기',
    'voltage-drop': '전압 강하 계산기',
    'thermal-expansion': '열팽창 계산기',
    'asme-b313': 'ASME B31.3 배관 두께/압력 계산기',
    'barlows-formula': '바를로 공식 계산기',
    'asme-section-viii': 'ASME Sec VIII 압력용기 계산기',
    'heat-transfer': '열전도 계산기',
    'sensible-heat': '현열 부하 계산기',
    'reynolds-number': '레이놀즈 수 계산기',
    'spring-rate': '스프링 상수 계산기',
    'radiation-heat': '복사 열전달 계산기',
    comparison: '재질 물성 비교',
    'corrosion-compatibility': '부식성 호환성 비교',
    'text-summarizer': '텍스트 요약 도구',
    'lorem-ipsum-generator': '로렘 Ipsum 생성기',
    'image-resizer': '이미지 리사이저',
    'image-converter': '이미지 변환',
    'json-generator': 'JSON 생성기',
    'xml-generator': 'XML 생성기',
    'yaml-generator': 'YAML 생성기',
    'json-prettifier': 'JSON 예쁘게',
    'json-minifier': 'JSON 축소',
    'base64-encoder': 'Base64 인코더',
    'base64-decoder': 'Base64 디코더',
    'url-encoder': 'URL 인코더',
    'url-decoder': 'URL 디코더',
    'morse-code': '모스 부호 변환',
    'prompt-generator': '프롬프트 생성기',
    'code-explainer': '코드 설명기',
    'meeting-notes': '회의록 작성기',
    'dps-calculator': 'DPS 계산기',
    'random-number-generator': '랜덤 숫자 생성기',
    'random-string-generator': '랜덤 문자열 생성기',
    'random-email-generator': '랜덤 이메일 생성기',
    'invoice-generator': '인보이스 생성기',
    'internet-speed-test': '인터넷 속도 테스트',
    'ip-lookup': 'IP 주소 조회',
    tank: 'Tank 계산기',
    'concrete-calculator': '콘크리트 계산기',
    'lumber-calculator': '목재 계산기',
    'molar-mass-calculator': '몰질량 계산기',
    'solution-dilution-calculator': '용액 희석 계산기',
    vat: '부가가치세 계산기',
    'ac-power': '교류 전력 계산기',
    'api-650-tank': 'API 650 탱크 두께 계산기',
    'api-gravity': 'API 비중 계산기',
    'asce7-wind-load': 'ASCE 7 풍하중 계산기',
    'bearing-life': '베어링 수명 (L10) 계산기',
    bernoulli: '베르누이 방정식 계산기',
    'carnot-efficiency': '카르노 효율 계산기',
    centrifuge: '원심 분리기 (RCF) 계산기',
    'cooling-tower': '쿨링타워 (냉각탑) 설계 계산기',
    'cyclone-efficiency': '사이클론 분리기 효율 계산기',
    'din-10220-pipe': 'DIN EN 10220 강관 파열 압력 계산기',
    'duct-friction': '공기 덕트 마찰 손실 계산기',
    'euler-buckling': '오일러 좌굴 하중 계산기',
    'gear-ratio': '기어비 계산기',
    'hydraulic-jump': '수력 도약 계산기',
    'iso-1127-pipe': 'ISO 1127 스텐레스 배관 계산기',
    'iso-2533-atmosphere': 'ISO 2533 표준 대기 계산기',
    lmtd: '대수평균온도차 (LMTD) 계산기',
    'mannings-equation': '매닝의 방정식 (개수로 유동)',
    'orifice-flow': '오리피스 유량 계산기',
    psychrometric: '사이크로메트릭 (공기선도) 계산기',
    'pump-affinity': '펌프 상사법칙 계산기',
    'rc-circuit': 'RC 회로 시정수 계산기',
    'sound-pressure': '음압 레벨 (SPL) 거리 계산기',
    'specific-speed': '펌프 비속도 (Ns) 계산기',
    'stress-strain': '응력 및 변형률 계산기',
    'torque-power': '토크 및 동력 계산기',
    'tube-pressure-drop': '열교환기 튜브 압력 강하 계산기',
    'u-value': '열관류율 (U-Value) 계산기',
    'water-hammer': '수격 현상 (Water Hammer) 계산기',
  },
  calculatorDescriptions: {
    tank: '탱크의 부피, 용량 및 관련 수치를 계산합니다.',
    npsh: '펌프의 유효흡입수두(NPSH)를 계산하여 캐비테이션을 방지합니다.',
    'pump-power': '펌프 작동에 필요한 동력을 계산합니다.',
    'concrete-calculator': '슬래브, 기초, 계단 등에 필요한 콘크리트 양을 계산합니다.',
    'lumber-calculator': '보드 피트, 선형 피트 등 목재 수량을 계산합니다.',
    'molar-mass-calculator': '화학식의 몰 질량을 계산합니다.',
    'solution-dilution-calculator': '원하는 농도의 용액을 만들기 위해 필요한 희석 비율을 계산합니다.',
    vat: '공급가액과 합계금액을 기준으로 부가세를 계산합니다.',
  },
  calculatorLayout: {
    inputInfo: '정보 입력',
    result: '계산 결과',
    description: '계산기 설명',
    formula: '계산 공식',
    tips: '유용한 팁',
  },
  loanInterest: {
    title: '대출 이자 계산기',
    description: '대출 상환 방식에 따른 월 상환금과 총 이자를 비교 분석합니다.',
    inputs: {
      loanAmount: '대출 원금 ({currency})',
      loanTerm: '대출 기간 (년)',
      annualRate: '연 이자율 (%)',
    },
    results: {
      totalPrincipal: '총 대출 원금',
      totalInterest: '총 이자',
      totalRepayment: '총 상환금액',
      monthlyPayment: '월 상환금',
      monthlyInterest: '월 이자상환액',
      firstPayment: '초회차 상환금',
      lastPayment: '최종회차 상환금',
      placeholder: '입력 후 계산하기 버튼을 눌러주세요.',
    },
    tabs: {
      equalPayment: '원리금 균등',
      equalPrincipal: '원금 균등',
      bulletLoan: '만기일시',
    },
    table: {
      month: '개월',
      monthlyPayment: '월\n상환금',
      principal: '상환\n원금',
      interest: '상환\n이자',
      balance: '대출 잔액',
    },
    scheduleTitle: '상세 내역',
    glossary: {
      equalPayment: '원리금 균등 상환: 매달 동일한 금액을 갚는 가장 일반적인 방식으로, 초기엔 이자 비중이 높고 원금 비중이 점차 커집니다.',
      equalPrincipal: '원금 균등 상환: 매달 동일한 원금을 갚고 남은 원금에 대해서만 이자를 내는 방식으로, 세 방식 중 총이자가 가장 적습니다.',
      bulletLoan: '만기일시상환: 매월 이자만 내고 원금은 만기일에 한꺼번에 상환하는 방식으로, 월 부담은 가장 적지만 만기 부담이 큽니다.',
    },
    descriptionContent: '<p class="text-muted-foreground">인생을 살아가다 보면 주택 마련, 자동차 구매, 사업 자금 등 목돈이 필요한 순간들이 찾아옵니다. 합리적인 금리의 대출은 이러한 목표를 더 빨리 달성할 수 있도록 돕는 유용한 금융 도구가 될 수 있습니다. 하지만 대출은 미래의 소득을 담보로 현재의 자금을 융통하는 것이므로, 신중한 계획과 철저한 비교가 반드시 필요합니다.</p><p class="mt-4 text-muted-foreground">특히 대출 상환 방식은 매월 납부해야 하는 금액과 총 이자 비용에 직접적인 영향을 미치기 때문에 가장 중요하게 고려해야 할 요소 중 하나입니다. 상환 방식은 크게 <strong class="text-foreground">원리금 균등분할상환, 원금 균등분할상환, 만기일시상환</strong> 세 가지로 나뉩니다.</p><p class="mt-4 text-muted-foreground">예를 들어, 1억 원을 연 5% 금리로 20년간 대출받는다고 가정하면, 원리금 균등상환 방식에서는 매월 약 66만 원을 납부하지만, 원금 균등상환 방식에서는 첫 달 약 83만 원에서 시작하여 마지막 달 약 42만 원으로 줄어듭니다.</p><p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc의 대출 이자 계산기</strong>는 바로 이러한 복잡함을 해결해 드립니다. 대출 원금, 기간, 금리만 입력하면 세 가지 상환 방식에 따른 월별 상환금, 총 이자, 상환 스케줄을 한눈에 비교하여 보여줍니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">어떤 상환 방식이 나에게 맞을까?</h3><p class="text-muted-foreground">대출 상환 방식은 각각의 특징이 명확하므로, 자신의 현재 소득, 미래 소득 예상, 자금 운용 계획 등을 종합적으로 고려하여 선택해야 합니다.</p><div class="space-y-6 mt-4"><div class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-2 text-foreground">1. 원리금 균등분할상환 (가장 일반적인 방식)</h4><p class="text-sm text-muted-foreground">매월 상환하는 원금과 이자의 합계(원리금)가 대출 기간 내내 동일하게 유지되는 방식입니다.</p><p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 상환금 = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p><ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground"><li><strong class="text-foreground">장점:</strong> 매월 동일한 금액을 상환하므로 예측 가능하고 안정적입니다.</li><li><strong class="text-foreground">단점:</strong> 원금 균등방식에 비해 총 이자 부담이 높습니다.</li><li><strong class="text-foreground">추천 대상:</strong> 매월 고정적인 소득이 있고 계획적인 지출 관리를 선호하는 직장인.</li></ul></div><div class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-2 text-foreground">2. 원금 균등분할상환 (총 이자가 가장 적은 방식)</h4><p class="text-sm text-muted-foreground">대출 원금을 균등하게 나누어 매월 동일한 원금을 상환하고, 이자는 남은 원금에 대해서만 계산하여 납부하는 방식입니다.</p><p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 원금 상환액 = P / n</strong><br /><strong>월 이자 = 잔여 원금 × r</strong></p><ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground"><li><strong class="text-foreground">장점:</strong> 세 가지 방식 중 총 이자 부담이 가장 적습니다.</li><li><strong class="text-foreground">단점:</strong> 초기 상환액이 커서 부담이 될 수 있습니다.</li><li><strong class="text-foreground">추천 대상:</strong> 초기 자금 여유가 있거나 향후 소득 감소가 예상되는 은퇴 예정자.</li></ul></div><div class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-2 text-foreground">3. 만기일시상환 (월 부담이 가장 적은 방식)</h4><p class="text-sm text-muted-foreground">대출 기간 동안에는 매월 이자만 납부하고, 만기일에 원금 전액을 한 번에 상환하는 방식입니다.</p><p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>월 이자 = P × r</strong></p><ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground"><li><strong class="text-foreground">장점:</strong> 매월 이자만 내므로 월 상환 부담이 가장 적습니다.</li><li><strong class="text-foreground">단점:</strong> 총 이자 부담이 가장 크며 만기 시 원금 상환 부담이 큽니다.</li><li><strong class="text-foreground">추천 대상:</strong> 단기간 자금 융통이 필요하거나 만기 시 원금 상환이 가능한 경우.</li></ul></div></div><p class="text-xs mt-4 text-muted-foreground">※ P: 대출원금, r: 월이율(연이율/12), n: 총 상환 개월 수</p>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">현명한 대출을 위한 실전 꿀팁</h3><ul class="space-y-6"><li class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-1 text-primary">1. DSR(총부채원리금상환비율)을 먼저 확인하세요.</h4><p class="text-muted-foreground">DSR은 연 소득 대비 모든 가계대출의 연간 원리금 상환액 비율을 의미하며, 현재 금융권 대출 심사의 핵심 기준입니다.</p></li><li class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-1 text-primary">2. 중도상환수수료를 반드시 고려하세요.</h4><p class="text-muted-foreground">대출 기간 중 목돈이 생겨 원금을 미리 갚을 경우, 은행은 중도상환수수료를 부과할 수 있습니다.</p></li><li class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-1 text-primary">3. 금리 변동기에는 고정금리와 변동금리의 유불리를 따져보세요.</h4><p class="text-muted-foreground">금리 상승기에는 고정금리가, 하락기에는 변동금리가 유리할 수 있습니다.</p></li><li class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-1 text-primary">4. 금리인하요구권을 적극적으로 활용하세요.</h4><p class="text-muted-foreground">신용상태에 긍정적인 변화가 생겼다면, 은행에 대출 금리 인하를 요구할 수 있습니다.</p></li><li class="p-4 bg-muted rounded-lg border border-border"><h4 class="font-semibold text-md mb-1 text-primary">5. 여러 금융사의 상품을 한 번에 비교하세요.</h4><p class="text-muted-foreground">발품을 팔수록 더 좋은 조건의 대출을 찾을 확률이 높아집니다.</p></li></ul>',
  },
  earlyRepaymentFee: {
    title: '중도상환수수료 계산기',
    description: '대출금 중도상환 시 발생할 수 있는 수수료를 미리 계산해보세요.',
    inputs: {
      totalLoanAmount: '총 대출금액 (원)',
      repaymentAmount: '중도상환금액 (원)',
      loanStartDate: '대출 시작일',
      repaymentDate: '중도상환일',
      loanTerm: '총 대출기간 (개월)',
      feeRate: '중도상환수수료율 (%)',
    },
    results: {
      expectedFee: '예상 중도상환수수료',
      elapsed: '경과일',
      remaining: '잔여일',
      loanStart: '대출 시작',
      maturity: '만기',
      baseAmount: '중도상환원금',
      appliedRate: '적용 수수료율',
      remainingRatio: '잔존기간 비율',
      remainingMonths: '남은 개월 수',
      placeholder: '계산하기 버튼을 눌러주세요',
    },
    exemptions: {
      maturityPassed: '대출 만기일이 경과했습니다.',
      threeYears: '대출 실행일로부터 3년이 경과하여 수수료가 면제됩니다.',
      calculationComplete: '중도상환수수료 계산이 완료되었습니다.',
      checkValues: '입력값을 확인해주세요.',
    },
    descriptionContent: '<p class="text-muted-foreground">목돈이 생겨 대출금을 미리 갚아 이자 부담을 덜어내려는 순간, \'중도상환수수료\'라는 예상치 못한 지출과 마주할 수 있습니다. 중도상환수수료는 금융기관과의 약속된 대출 기간을 채우지 못하고 원금을 미리 상환할 때 발생하는 위약금입니다.</p><p class="mt-4 text-muted-foreground">은행과 같은 금융기관은 고객의 대출 기간 동안 발생할 이자 수익을 예측하고, 이를 바탕으로 자금을 조달하고 운용하는 복잡한 계획을 세웁니다. 하지만 고객이 예상보다 일찍 대출금을 상환하면, 계획했던 이자 수익을 얻지 못할 뿐만 아니라 갑자기 들어온 목돈을 즉시 효율적인 곳에 재투자하기 어렵습니다. 이 과정에서 발생하는 기회비용과 행정적 비용을 보전하기 위해 중도상환수수료가 존재합니다.</p><p class="mt-4 text-muted-foreground">일반적으로 대출 실행일로부터 <strong class="text-foreground">3년 이내</strong>에 원금을 상환할 경우 수수료가 부과되며, 수수료율은 금융기관, 대출 상품, 약정 조건에 따라 0.5%에서 1.5%까지 다양하게 적용됩니다. 변동금리 대출이 고정금리 대출보다 수수료율이 낮은 경향이 있으며, 최근에는 인터넷 은행을 중심으로 중도상환수수료 면제 상품도 등장하고 있습니다.</p><p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc의 중도상환수수료 계산기</strong>는 이러한 복잡한 조건 속에서 당신의 현명한 의사결정을 돕는 강력한 도구입니다. 단순히 수수료를 계산하는 것을 넘어, 상환 시점에 따른 유불리를 따져보고, 불필요한 지출을 막는 최적의 재무 전략을 세울 수 있도록 돕습니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">중도상환수수료, 어떻게 계산될까요?</h3><p class="text-base leading-relaxed mb-6 text-muted-foreground">현재 국내 대부분의 금융기관은 시간이 지남에 따라 수수료 부담이 점차 줄어드는 <strong class="text-foreground">\'슬라이딩 방식\'</strong>을 사용합니다. 대출 만기가 많이 남았을수록 높은 수수료를, 만기에 가까워질수록 낮은 수수료를 내는 합리적인 구조입니다.</p><div class="mt-4 p-6 bg-muted rounded-lg text-center border border-border"><p class="font-mono text-xl tracking-tighter text-primary"><strong>예상 수수료 = 중도상환원금 × 수수료율 × (잔여일수 ÷ 부과기간)</strong></p></div><div class="mt-8 space-y-6"><div><h4 class="text-lg font-semibold text-foreground">① 중도상환원금</h4><p class="mt-2 text-base leading-relaxed text-muted-foreground">만기 전에 미리 갚으려는 대출 원금을 의미합니다. 갚으려는 금액이 클수록 당연히 수수료도 함께 증가합니다.</p></div><div><h4 class="text-lg font-semibold text-foreground">② 중도상환수수료율</h4><p class="mt-2 text-base leading-relaxed text-muted-foreground">대출 약정 시 정해진 비율로, 보통 연 단위(%)로 표시됩니다. 일반적으로 1.0% ~ 1.4% 사이에서 책정됩니다.</p></div><div><h4 class="text-lg font-semibold text-foreground">③ 잔여기간 / 부과기간 (슬라이딩 방식의 핵심)</h4><p class="mt-2 text-base leading-relaxed text-muted-foreground">실제 총 대출 기간과 상관없이, 수수료가 부과되는 기간은 보통 <strong class="text-foreground">3년(1,095일)</strong>으로 한정됩니다. 대출받은 지 3년이 지나면 중도상환수수료는 0원이 됩니다.</p></div></div><div class="mt-8 p-6 border-l-4 border-primary bg-muted rounded-r-lg"><h4 class="font-bold text-lg mb-3 text-foreground">실제 계산 예시</h4><p class="text-base text-muted-foreground">- 총 대출금: 3억 원 (30년 만기 주택담보대출)<br/>- 중도상환수수료율: 1.2%<br/>- 상환 시점: 대출 실행 후 1년 6개월 (548일) 뒤<br/>- 상환 희망 원금: 5,000만 원</p><p class="mt-4 font-mono bg-card p-4 rounded-md text-sm border border-border"><strong class="text-foreground">1. 수수료 부과 잔여일수:</strong> 1,095일 - 548일 = 547일<br/><br/><strong class="text-foreground">2. 최종 수수료:</strong> 50,000,000원 × 1.2% × (547일 ÷ 1,095일) = <strong class="text-primary">약 299,726원</strong></p></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">중도상환수수료 절약 실전 꿀팁</h3><ul class="space-y-6"><li class="p-4 rounded-md bg-muted border border-border"><h4 class="font-bold text-lg text-primary">1. \'3년의 마법\'을 기억하세요.</h4><p class="mt-2 text-base text-muted-foreground">가장 기본적이면서도 확실한 방법입니다. 대부분의 금융상품은 대출 실행일로부터 3년이 지나면 중도상환수수료가 완전히 면제됩니다.</p></li><li class="p-4 rounded-md bg-muted border border-border"><h4 class="font-bold text-lg text-primary">2. \'부분 상환 면제\' 조건을 적극 활용하세요.</h4><p class="mt-2 text-base text-muted-foreground">많은 은행에서 1년에 한 번, 대출 원금의 10% 이내에서 중도상환수수료 없이 원금을 갚을 수 있는 제도를 운영합니다.</p></li><li class="p-4 rounded-md bg-muted border border-border"><h4 class="font-bold text-lg text-primary">3. 대환대출, \'이자 절감액\' vs \'수수료\' 비교 필수!</h4><p class="mt-2 text-base text-muted-foreground">더 낮은 금리의 대출로 갈아타기 위해 중도상환을 고민 중이라면, \'앞으로 아낄 총 이자\'와 \'당장 내야 할 중도상환수수료 + 부대비용\'을 반드시 비교해야 합니다.</p></li><li class="p-4 rounded-md bg-muted border border-border"><h4 class="font-bold text-lg text-primary">4. 수수료 면제 대상인지 확인해보세요.</h4><p class="mt-2 text-base text-muted-foreground">채무자의 사망, 천재지변, 담보주택의 수용 등으로 대출 상환이 불가피한 경우나, 일부 정책금융상품은 소득/자산 기준을 충족하면 수수료가 감면되거나 면제될 수 있습니다.</p></li><li class="p-4 rounded-md bg-muted border border-border"><h4 class="font-bold text-lg text-primary">5. 가장 정확한 정보는 \'대출 약정서\'에 있습니다.</h4><p class="mt-2 text-base text-muted-foreground">본 계산기는 가장 일반적인 슬라이딩 방식을 기준으로 하지만, 실제 적용되는 수수료율, 계산 방식, 면제 조건 등은 <strong class="text-foreground">대출 약정서</strong>에 담겨 있습니다.</p></li></ul>',
  },
  dti: {
    title: 'DTI 계산기 (총부채상환비율)',
    description: '연간 소득과 부채 정보를 바탕으로 DTI를 계산하고 대출 가능성을 확인해보세요.',
    inputs: {
      annualIncome: '연간 소득 (원)',
      loanPrincipal: '주택담보대출 원금 (원)',
      loanTerm: '대출 기간 (년)',
      annualRate: '연간 이자율 (%)',
      otherDebtInterest: '기타부채 연간 이자 (원)',
    },
    results: {
      dtiResult: 'DTI 결과',
      totalDebtRepayment: '총부채 연간 원리금 상환액',
      annualIncome: '연간 소득',
      mortgageAnnualPI: '주택담보대출 연간 원리금',
      otherInterest: '기타부채 연간 이자',
      maxLoanTitle: 'DTI 40% 기준, 최대 대출 가능 금액',
      placeholder: '계산하기 버튼을 클릭하여 결과를 확인하세요.',
      chartTitle: '소득 대비 부채 구성',
    },
    status: {
      veryStable: '매우 안정',
      stable: '안정',
      caution: '주의',
      risky: '위험',
      highRisk: '고위험',
    },
    chart: {
      totalDebt: '총부채',
      availableIncome: '가용 소득',
    },
    tableHeaders: {
      item: '항목',
      amount: '금액 (원)',
      ratio: '비율 (%)',
    },
    descriptionContent: '<p class="text-muted-foreground">내 집 마련의 꿈을 안고 금융기관의 문을 두드릴 때, 가장 먼저 마주하게 되는 숫자가 바로 <strong class="text-foreground">DTI(총부채상환비율, Debt to Income)</strong>입니다. DTI는 연간 소득 대비 연간 부채 상환액이 얼마나 되는지를 나타내는 비율로, 금융기관이 상환 능력을 판단하는 핵심적인 재무 건전성 지표입니다.</p><p class="mt-4 text-muted-foreground">주택 가격과 함께 대출의 규모를 결정하는 LTV와 더불어, DTI는 대출 한도를 결정하는 양대 산맥입니다. DTI 비율이 낮을수록 상환 능력이 높게 평가되며, 더 많은 대출 한도와 유리한 금리 조건으로 이어질 수 있습니다. 반대로 DTI가 높다면, 대출이 거절되거나 원하는 만큼의 한도를 확보하지 못할 수도 있습니다.</p><p class="mt-4 text-muted-foreground">하지만 DTI 계산은 생각보다 복잡합니다. 주택담보대출의 원리금뿐만 아니라, 기존에 가지고 있던 신용대출, 자동차 할부, 학자금 대출 등 다른 부채의 \'이자\'까지 고려해야 하기 때문입니다.</p><p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc의 DTI 계산기</strong>는 이러한 복잡함을 해결하고, 재정 상태를 명확하게 진단해주는 든든한 조력자입니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">DTI, 정확히 어떻게 계산될까요?</h3><p class="text-muted-foreground leading-relaxed mb-6">DTI는 연간 총소득에서 1년 동안 갚아야 할 대출 원리금과 이자가 차지하는 비율을 의미합니다.</p><div class="mt-4 p-4 bg-muted rounded-md text-center border border-border"><p class="font-mono text-lg tracking-tight text-primary"><strong>DTI (%) = ( (신규 주택담보대출 연간 원리금) + (기타 부채의 연간 이자) ) / 연간 소득 × 100</strong></p></div><ul class="list-none space-y-4 mt-6"><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">신규 주택담보대출 연간 원리금:</strong> <span class="text-muted-foreground">새로 받으려는 주택담보대출에 대해 1년 동안 상환해야 할 원금과 이자의 합계입니다.</span></li><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">기타 부채의 연간 이자:</strong> <span class="text-muted-foreground">신용대출, 마이너스 통장, 자동차 할부, 학자금 대출 등 기존에 보유한 모든 부채의 1년 치 이자 비용입니다.</span></li><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">연간 소득:</strong> <span class="text-muted-foreground">세금을 공제하기 전의 소득(세전 소득)을 기준으로 하며, 공인된 서류로 증빙된 금액만 인정됩니다.</span></li></ul><h3 class="text-xl font-bold text-foreground mt-10 mb-4">DTI vs DSR, 무엇이 다를까요?</h3><p class="mb-4 text-muted-foreground leading-relaxed">최근 대출 시장에서는 DTI보다 더 강력한 규제인 <strong class="text-foreground">DSR(총부채원리금상환비율)</strong>이 핵심적인 기준으로 자리 잡았습니다.</p>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">DTI 낮추고 대출 한도 늘리는 현실적인 전략</h3><ul class="space-y-6"><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">1. 부채 다이어트: 이자 높은 빚부터 정리하기</h4><p class="text-muted-foreground">가장 기본적이면서도 효과적인 방법입니다. 금리가 높은 신용대출, 카드론, 현금서비스부터 상환하여 \'기타 부채 이자\' 총액을 줄이세요.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">2. 소득 증명: 인정 소득 최대한 끌어모으기</h4><p class="text-muted-foreground">금융기관은 서류로 증빙되는 \'공식 소득\'만 인정합니다. 근로소득 원천징수영수증 외에도 사업소득금액증명원, 국민연금/건강보험료 납부 내역 등을 통해 소득을 추가로 인정받을 수 있습니다.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">3. 대출 기간: 길게 설정하여 연간 상환 부담 줄이기</h4><p class="text-muted-foreground">대출 기간을 30년에서 40년, 50년으로 늘리면 매년 갚아야 할 원리금 상환액이 줄어듭니다. DTI 비율을 낮추는 데 매우 효과적이지만, 총 이자 부담은 늘어나므로 신중하게 결정해야 합니다.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">4. 스트레스 DSR 제도 이해하고 대비하기</h4><p class="text-muted-foreground">스트레스 DSR 제도는 미래 금리 인상 가능성을 반영하여 대출 한도를 산정합니다. 변동금리 대출 시 현재 금리에 가산금리가 더해져 계산되므로, 예상보다 대출 한도가 줄어들 수 있습니다.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">5. 정부 정책 모니터링 및 규제 지역 확인은 필수</h4><p class="text-muted-foreground">DTI와 DSR 규제는 정부의 부동산 정책 방향과 지역에 따라 수시로 변동됩니다. 생애최초 주택구매자, 신혼부부 등을 위한 완화된 기준이 적용되는 경우가 많으니, 대출 신청 시점의 최신 정책을 반드시 확인하세요.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">6. DSR 한도도 함께 점검하세요.</h4><p class="text-muted-foreground">DTI 기준을 충족하더라도 모든 대출의 원리금을 포함하는 DSR(통상 1금융권 40%)을 넘으면 대출이 거절될 수 있습니다.</p></li></ul>',
  },
  installmentInterest: {
    title: '할부이자 계산기 (원리금 균등 상환)',
    description: '원리금 균등 상환 방식의 할부 이자를 간편하게 계산하고, 원금과 이자 비율을 파이 차트로 확인하세요.',
    inputs: {
      principal: '할부 원금 (원)',
      months: '할부 개월 수',
      annualRate: '연 이자율 (%)',
    },
    results: {
      monthlyPayment: '월 상환금',
      totalPayment: '총 상환액',
      totalInterest: '총 이자',
      placeholder: '계산 버튼을 눌러 결과를 확인하세요.',
    },
    tableHeaders: {
      category: '구분',
      amount: '금액',
    },
    tableRows: {
      monthlyPayment: '월 상환금',
      totalPayment: '총 상환액',
      totalInterest: '총 이자',
      principal: '원금',
      principalInterestRatio: '원금 대비 총 이자율',
      interestPaymentRatio: '총 상환액 대비 이자 비율',
    },
    chartLabels: {
      principal: '원금',
      totalInterest: '총이자',
    },
    chartTitle: '할부 상환 상세',
    descriptionContent: '<p class="text-muted-foreground">갖고 싶었던 최신형 노트북, 꿈에 그리던 해외여행. 목돈 부담 때문에 망설이셨나요? 할부 구매는 당장의 큰 지출 없이 원하는 것을 얻게 해주는 현대적인 금융 도구입니다. 하지만 이 편리함 뒤에는 \'할부 이자\'라는 숨은 비용이 존재합니다.</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">할부 이자, 왜 내는 걸까요?</h3><p class="text-muted-foreground">할부 이자는 카드사가 당신을 대신해 가맹점에 상품 대금을 먼저 지불해주고, 당신은 그 돈을 여러 달에 걸쳐 카드사에 갚아나가는 과정에서 발생하는 \'금융 서비스 이용료\'입니다.</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">이 계산기는 누구에게 필요할까요?</h3><ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground"><li><strong class="text-foreground">고가의 상품 구매를 앞둔 분:</strong> 자동차, 가전제품 등 큰 금액의 결제를 할부로 계획 중인 분</li><li><strong class="text-foreground">현명한 소비를 지향하는 분:</strong> 월 납입금뿐 아니라 총이자 비용까지 꼼꼼히 따져보고 싶은 분</li><li><strong class="text-foreground">재정 계획을 세우는 분:</strong> 할부 구매가 미래의 현금 흐름에 미치는 영향을 정확히 예측하고 싶은 분</li><li><strong class="text-foreground">다양한 할부 옵션을 비교하는 분:</strong> 할부 개월 수에 따라 총이자 비용이 어떻게 달라지는지 비교하고 싶은 분</li></ul>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">할부 이자, 어떻게 계산될까?</h3><p class="text-muted-foreground">원리금 균등 분할 상환 방식은 매달 갚는 돈(월 상환금)이 할부 기간 내내 동일하다는 특징이 있습니다.</p><div class="font-mono p-6 bg-card rounded-lg my-4 text-sm border border-border"><h4 class="font-sans text-lg font-semibold mb-3 text-foreground">원리금 균등 상환 월 상환금 공식</h4><p class="mb-2 text-foreground"><strong className="font-sans text-base">월 상환금</strong> = [원금 × 월이율 × (1 + 월이율)^개월수] / [(1 + 월이율)^개월수 − 1]</p><p class="text-foreground"><strong className="font-sans text-base">총 이자</strong> = (월 상환금 × 개월수) − 원금</p></div><div class="p-6 bg-muted rounded-lg border border-border"><h4 class="text-lg font-semibold mb-3 text-foreground">예시로 쉽게 이해하기</h4><p class="text-muted-foreground">100만원짜리 노트북을 연 12% 이자율로 12개월 할부 구매했다면?</p><ul class="list-decimal list-inside space-y-2 mt-3 text-sm text-muted-foreground"><li><strong class="text-foreground">원금:</strong> 1,000,000원</li><li><strong class="text-foreground">월이율:</strong> 12% / 12 = 1% (0.01)</li><li><strong class="text-foreground">월 상환금:</strong> ≈ 88,849원</li><li><strong class="text-foreground">총 상환액:</strong> 1,066,188원</li><li><strong class="text-foreground">총 이자:</strong> 66,188원</li></ul></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">할부 이자, 200% 활용하는 7가지 스마트 팁</h3><ul class="space-y-6"><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">1. \'무이자 할부\'의 두 얼굴을 파악하세요.</h4><p class="mt-2 text-muted-foreground">가장 좋은 전략은 단연 무이자 할부입니다. 하지만 모든 무이자가 같은 것은 아닙니다.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">2. 할부 개월 수, \'수수료율 구간\'을 확인하세요.</h4><p class="mt-2 text-muted-foreground">할부 개월이 길면 월 부담은 줄지만 총이자는 눈덩이처럼 불어납니다.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">3. \'선결제\'는 최고의 이자 다이어트.</h4><p class="mt-2 text-muted-foreground">보너스 등 예상치 못한 여유 자금이 생겼다면, 주저 말고 \'선결제\'를 활용하세요.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">4. \'리볼빙\' 서비스는 최후의 보루로.</h4><p class="mt-2 text-muted-foreground">일부결제금액이월약정(리볼빙)은 평균 10% 후반, 높게는 20%에 육박하는 고금리 서비스입니다.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">5. 신용점수 관리는 기본 중의 기본.</h4><p class="mt-2 text-muted-foreground">높은 신용점수는 더 낮은 할부 이자율, 더 높은 한도로 이어집니다.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">6. 카드사별 특별 할부 프로그램을 노리세요.</h4><p class="mt-2 text-muted-foreground">특정 업종에 대해 저리 또는 무이자 할부 혜택을 제공하는 카드가 있습니다.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">7. 정보 제공 강화 동향을 주목하세요.</h4><p class="mt-2 text-muted-foreground">금융당국은 소비자가 금융상품의 비용과 위험을 더 명확히 인지할 수 있도록 정보 제공을 강화하고 있습니다.</p></li></ul>',
  },
  compoundInterest: {
    title: '월 복리 적금 계산기',
    description: '매월 꾸준히 모아 목돈을 만드는 월 복리 적금, 만기 예상 금액을 확인해보세요.',
    inputs: {
      initialInvestment: '초기 투자금 (원)',
      monthlyDeposit: '월 적립금 (원)',
      months: '투자기간 (개월)',
      annualRate: '연 이자율 (%)',
      depositTiming: '적립 시점',
    },
    depositTimingOptions: {
      start: '월초',
      end: '월말',
    },
    results: {
      totalPrincipal: '총 원금',
      totalInterest: '총 이자 (세전)',
      maturityAmount: '만기지급금액',
      placeholder: '계산 정보를 입력하고 계산하기 버튼을 눌러주세요.',
    },
    tabs: {
      chart: '차트',
      details: '월별 상세 내역',
    },
    tableHeaders: {
      month: '개월차',
      principal: '원금',
      interest: '이자 (세전)',
      totalWithInterest: '이자포함원금',
    },
    chartKeys: {
      principal: '원금',
      totalWithInterest: '이자포함원금',
    },
    fullTitle: '상세 분석',
    descriptionContent: '<p class="text-muted-foreground">알버트 아인슈타인이 "인류 최고의 발명"이자 "세계 8대 불가사의"라고 칭했던 <strong>복리(Compound Interest)</strong>. 복리 계산기는 바로 이 강력한 힘을 여러분의 자산 증식에 활용할 수 있도록 돕는 필수 도구입니다.</p><p class="mt-4 text-muted-foreground">이 계산기는 초기 투자금, 매월 꾸준히 납입할 적립금, 기대 연이율, 그리고 가장 중요한 \'시간\'이라는 변수를 입력하여 미래의 내 자산이 얼마나 될지 정밀하게 예측해 줍니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">복리 계산, 어떻게 이루어지나요?</h3><div class="space-y-4"><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">1. 거치식 투자 (월 적립금 없는 경우)</h4><p class="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>미래가치(FV) = 원금(P) * (1 + 월이율)^개월수</strong></p></div><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">2. 적립식 투자 (월 적립금 있는 경우)</h4><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>월초 납입 시:</strong> FV = [거치식 FV] + M * [((1+r)^n - 1) / r] * (1+r)</p><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>월말 납입 시:</strong> FV = [거치식 FV] + M * [((1+r)^n - 1) / r]</p><p class="text-sm text-muted-foreground">월초에 납입하면 한 달치 이자를 더 받기 때문에 월말보다 최종 금액이 약간 더 커집니다.</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">복리 효과 200% 활용을 위한 유용한 팁</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. 시간의 마법사, 지금 바로 시작하세요</h4><p>복리 효과의 핵심 재료는 \'시간\'입니다. 일찍 시작하는 것이 적은 돈으로 더 큰 부를 쌓는 가장 확실한 방법입니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. \'72의 법칙\'으로 복리의 힘 체감하기</h4><p><strong>72 / 연이율(%) ≈ 원금 2배 달성 기간(년)</strong>. 연이율 8%라면 약 9년마다 자산이 두 배로 불어납니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. 세금, 똑똑하게 관리하기</h4><p>이자 소득에는 <strong>15.4%의 세금</strong>이 부과됩니다. ISA, 연금저축, IRP 등 절세 상품을 활용하세요.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. 꾸준함이 최고의 무기입니다</h4><p>감정에 휘둘리지 말고, 세워둔 계획에 따라 꾸준히 투자하는 것이 성공의 왕도입니다.</p></li></ul>',
  },
  weeklyHoliday: {
    title: '주휴수당 계산기',
    description: '시급, 1일 소정근로시간, 1주 소정근로일수를 입력하여 주휴수당을 계산합니다.',
    inputs: {
      hourlyWage: '시급 (원)',
      workHoursPerDay: '1일 소정근로시간 (시간)',
      workDaysPerWeek: '1주 소정근로일수 (일)',
    },
    placeholders: {
      hourlyWage: '시급 입력',
      workHoursPerDay: '1일 소정근로시간 입력',
      workDaysPerWeek: '선택',
    },
    results: {
      weeklyWorkHours: '주간 소정근로시간:',
      weeklyHolidayAllowance: '예상 주휴수당:',
    },
    reset: '초기화',
    descriptionContent: '<p className="text-lg font-semibold">일주일을 성실하게 일한 당신, 하루의 유급휴가를 받을 권리가 있습니다.</p><p>주휴수당은 근로기준법 제55조에 명시된 근로자의 소중한 권리입니다. 1주일 동안 계약한 근무일수를 모두 채운 근로자에게 주 1회의 유급 휴일(주휴일)을 보장하고, 그날 일하지 않아도 하루치 임금을 추가로 지급하는 제도입니다. 흔히 아르바이트생이나 단시간 근로자는 해당되지 않는다고 오해하지만, 근무 조건만 충족하면 고용 형태와 관계없이 누구나 받을 수 있습니다.</p><p>이 계산기는 복잡한 주휴수당 발생 조건을 확인하고, 자신의 근무 형태에 맞는 정확한 수당 금액을 계산하여 임금 체불과 같은 불이익을 방지하는 데 도움을 줍니다. 2025년 최저시급을 기준으로 자신의 시급이 주휴수당을 포함했을 때 실질적으로 얼마인지 확인해보는 용도로도 유용합니다.</p><p>사장님에게는 근로자에게 정확한 급여를 지급하여 법적 분쟁을 예방하고, 건강한 노사 관계를 구축하는 기초 자료로 활용될 수 있습니다.</p>',
    formulaContent: '<div className="space-y-4 p-4 bg-muted rounded-md"><h3 className="text-xl font-bold">내 주휴수당, 어떻게 계산될까?</h3><p>주휴수당은 1주일간의 소정근로시간에 비례하여 계산됩니다. 법정 최대 근로시간인 주 40시간을 기준으로 내가 일한 시간의 비율만큼 수당이 발생한다고 이해하면 쉽습니다.</p><div className="border-l-4 border-primary pl-4 mt-4"><p><strong>계산 공식:</strong></p><p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(1주일 총 소정근로시간 / 40시간) × 8시간 × 시급</code></p></div><div className="mt-4"><h4 className="font-semibold">계산 예시:</h4><p>예를 들어, 시급 10,000원을 받고 하루 6시간씩 주 4일(총 24시간)을 일하는 근로자의 경우:</p><p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(24시간 / 40시간) × 8시간 × 10,000원 = 48,000원</code></p><p className="text-sm text-muted-foreground mt-1">따라서 이 근로자는 1주일 급여(24시간 × 10,000원 = 240,000원) 외에 주휴수당 48,000원을 추가로 받아 총 288,000원을 받게 됩니다.</p></div><p className="text-xs text-muted-foreground mt-4">* 참고: 주 40시간 이상 일해도 주휴수당은 최대 8시간분(주 40시간 기준)까지만 지급됩니다.</p></div>',
    tipsContent: '<div className="space-y-6"><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">1. 주휴수당 지급 조건 (이 3가지는 꼭 기억하세요!)</h4><p>주휴수당을 받기 위해서는 아래 세 가지 조건을 모두 충족해야 합니다.</p><ul className="list-decimal pl-5 space-y-2 mt-2"><li><strong>주 15시간 이상 근무:</strong> 근로계약서에 명시된 1주일간의 소정근로시간이 15시간 이상이어야 합니다. 연장, 야간, 휴일근로 시간은 포함되지 않습니다.</li><li><strong>소정근로일 개근:</strong> 1주일 동안 일하기로 약속한 날에 모두 출근해야 합니다. 지각이나 조퇴는 결근이 아니므로 주휴수당을 받을 수 있지만, 하루라도 무단결근하면 해당 주의 주휴수당은 발생하지 않습니다.</li><li><strong>다음 주 근로 예정:</strong> 주휴수당은 다음 주의 근로를 전제로 지급되는 것입니다. 따라서 1주일만 일하고 그만두는 경우에는 주휴수당을 받을 수 없습니다.</li></ul></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">2. 5인 미만 사업장도 주휴수당을 지급해야 하나요?</h4><p><strong>네, 반드시 지급해야 합니다.</strong> 주휴수당은 사업장의 상시 근로자 수와 관계없이 근로기준법이 적용되는 모든 사업장에 해당되는 의무 조항입니다. 5인 미만 사업장이라는 이유로 주휴수당을 지급하지 않는 것은 명백한 임금체불에 해당합니다.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">3. 월급에 주휴수당이 포함된 경우 (포괄임금제)</h4><p>월급제 근로자의 경우, 월급에 주휴수당이 포함된 것으로 간주하는 경우가 많습니다(포괄임금제). 하지만 이 경우에도 근로계약서에 \'월급 OOO원에는 주휴수당이 포함되어 있다\'는 내용이 명확하게 기재되어 있어야 합니다. 또한, 주휴수당을 포함한 월급을 실제 근로시간으로 나누어 계산한 시급이 최저시급 이상이어야 법적으로 유효합니다. 애매한 문구로 주휴수당 지급을 회피하는 경우, 법적 분쟁의 소지가 될 수 있습니다.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">4. 초단시간 근로자와 주휴수당</h4><p>4주 평균하여 1주 소정근로시간이 15시간 미만인 근로자를 \'초단시간 근로자\'라고 합니다. 안타깝게도 초단시간 근로자에게는 근로기준법상 주휴수당, 연차유급휴가, 퇴직금이 적용되지 않습니다. 이는 장기 근속을 유도하고 최소한의 휴식을 보장하려는 법의 취지 때문입니다.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">5. 주휴수당과 실질 시급 (2025년 최저시급 기준)</h4><p>주휴수당을 포함하면 내가 받는 실질적인 시급은 더 높아집니다. 예를 들어 2025년 최저시급이 10,000원이라고 가정하고 주 40시간을 일한다면, 주급은 400,000원이고 주휴수당은 80,000원입니다. 총 480,000원을 40시간으로 나누면 실질 시급은 12,000원이 되는 셈입니다. 이는 구직 시 급여 조건을 비교하거나 연봉 협상을 할 때 유용하게 활용할 수 있는 개념입니다.</p></div></div>',
  },
  depositInterest: {
    title: '정기예금 이자 계산기',
    description: '단리/복리, 과세 옵션을 선택하여 만기 수령액을 계산해보세요.',
    inputs: {
      principal: '예치금액 (원)',
      annualRate: '연 이자율 (%)',
      period: '예치기간 (개월)',
      interestType: '이자 계산 방식',
      taxType: '과세 옵션',
    },
    placeholders: {
      principal: '예: 10,000,000',
      annualRate: '예: 3.5',
      period: '예: 12',
    },
    interestTypeOptions: {
      simple: '단리',
      compound: '월복리',
    },
    taxTypeOptions: {
      general: '일반과세 (15.4%)',
      preferential: '세금우대 (9.5%)',
      nonTaxable: '비과세 (0%)',
    },
    results: {
      maturityAmount: '만기 지급액',
      principal: '원금',
      preTaxInterest: '세전 이자',
      tax: '세금',
      afterTaxInterest: '세후 이자',
    },
    calculate: '계산하기',
    fullWidthTitle: '상세 내역',
    placeholder: '정보를 입력하고 계산하기 버튼을 누르세요.',
    errorAllFields: '모든 필드를 올바르게 입력해주세요.',
    errorPrincipal: '예치금액은 0보다 커야 합니다.',
    errorRate: '연 이자율은 0보다 커야 합니다.',
    errorPeriod: '예치기간은 0보다 커야 합니다.',
    toastSuccess: '예금 이자 계산이 완료되었습니다.',
    descriptionContent: '<h2 className="text-2xl font-bold text-foreground mb-4">정기예금 이자 계산기: 잠자는 내 돈, 확실하게 깨우는 법</h2><p className="text-lg text-muted-foreground mb-6">재테크의 가장 기본은 \'잃지 않는 것\'에서 시작합니다. 그런 의미에서 <strong>예금</strong>은 변동성이 큰 투자 시장 속에서 여러분의 자산을 가장 안전하게 지키고, 꾸준히 불려 나갈 수 있는 가장 확실하고 안정적인 재테크 수단입니다. 특히 목돈을 일정 기간 묶어두고 약속된 이자를 받는 <strong>정기예금</strong>은 종잣돈을 마련하거나, 주택 계약금, 여행 자금 등 단기적인 금융 목표를 달성하는 데 매우 효과적입니다.</p><p className="text-foreground leading-relaxed">하지만 같은 금액을 예치하더라도 이자를 계산하는 방식(단리/복리)과 세금(과세/비과세) 적용 여부에 따라 만기 시 손에 쥐게 되는 금액은 크게 달라질 수 있습니다. 많은 사람들이 "연 3.5% 금리"라는 말만 믿고 예금에 가입했다가, 만기 후 세금을 떼고 난 실제 수령액을 보고 실망하는 경우가 많습니다. 복잡한 계산 과정 때문에 자신의 최종 수령액을 정확히 예측하는 데 어려움을 겪기 때문입니다.</p><p className="mt-4 text-foreground leading-relaxed"><strong>All-in-Calc의 예금 이자 계산기</strong>는 이러한 불편함을 해결하기 위해 만들어졌습니다. 예치할 금액, 기간, 금리만 입력하면, 복잡한 이자 계산과 세금까지 모두 고려하여 만기 시 받게 될 실수령액을 쉽고 빠르게 확인할 수 있습니다. 이 계산기를 통해 아래 질문들에 대한 명확한 답을 얻을 수 있습니다.</p><ul className="list-disc list-inside mt-4 space-y-2 text-foreground bg-muted p-4 rounded-lg"><li>단리와 복리, 어떤 방식이 나에게 더 유리할까?</li><li>내 소중한 이자에서 세금은 얼마나 빠져나갈까? (2025년 기준)</li><li>비과세나 세금우대 혜택을 받으면 얼마나 더 받을 수 있을까?</li><li>1년 만기 예금과 2년 만기 예금의 실제 수령액 차이는 얼마나 될까?</li></ul><p className="mt-6 text-foreground leading-relaxed">이제 막연한 기대 대신, 정확한 숫자를 통해 미래를 계획하세요. All-in-Calc과 함께라면 안정적인 자산 증식의 첫걸음이 더욱 쉽고 명확해집니다.</p>',
    formulaContent: '<h3 className="text-xl font-bold text-foreground mt-8 mb-4">💰 단리 vs 복리, 이자는 어떻게 계산될까?</h3><p className="text-foreground leading-relaxed mb-6">예금 이자를 계산하는 방식은 크게 단리와 복리로 나뉩니다. 어떤 방식을 선택하느냐에 따라, 특히 예치 기간이 길어질수록 만기 수령액에 상당한 차이가 발생합니다. 두 방식의 차이점을 명확히 이해하는 것이 중요합니다.</p><div className="space-y-6"><div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg"><h4 className="font-semibold text-lg mb-2 text-primary">1. 단리 (Simple Interest)</h4><p className="text-muted-foreground mb-3">오직 <strong>처음 예치한 원금</strong>에 대해서만 약속된 이자를 계산하는 방식입니다. 이자가 발생하더라도 이를 원금에 포함시키지 않기 때문에, 매번 동일한 금액의 이자가 발생합니다. 계산이 단순하고 이해하기 쉽다는 특징이 있습니다.</p><p className="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>세전 이자 = 원금 × 연이율 × (예치 개월 수 / 12)</strong></p></div><div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg"><h4 className="font-semibold text-lg mb-2 text-primary">2. 월복리 (Monthly Compound Interest)</h4><p className="text-muted-foreground mb-3">발생한 이자를 <strong>원금에 합산</strong>하고, 그 합산된 금액을 새로운 원금으로 간주하여 다음 기간의 이자를 계산하는 방식입니다. 이자가 이자를 낳는 구조로, 시간이 지날수록 이자가 기하급수적으로 늘어나는 \'눈덩이 효과\'를 기대할 수 있습니다.</p><p className="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>세전 이자 = 원금 × (1 + 월이율) ^ 예치 개월 수 - 원금</strong></p><p className="text-xs text-muted-foreground text-center">* 월이율 = 연이율 / 12</p></div></div><h3 className="text-xl font-bold text-foreground mt-10 mb-4">💸 최종 수령액을 결정하는 \'세금\' (2025년 기준)</h3><p className="text-foreground leading-relaxed">예금 이자는 \'이자소득\'으로 분류되어 세금이 부과됩니다. 따라서 최종 수령액은 세전 이자에서 세금을 제외한 금액이 됩니다. 과세 옵션에 따라 공제되는 세율이 다르므로, 자신에게 적용되는 세율을 정확히 아는 것이 중요합니다.</p><div className="bg-muted p-4 rounded-md my-4 border border-border border-border"><p className="text-center font-semibold text-lg">세후 수령액 = 원금 + 세전 이자 - (세전 이자 × 세율)</p></div><ul className="list-disc pl-5 mt-6 space-y-4 text-foreground"><li><strong>일반과세 (15.4%):</strong> 대부분의 금융상품에 적용되는 기본 세율입니다. 이자소득의 15.4%가 세금으로 원천징수됩니다. (소득세 14% + 지방소득세 1.4%)</li><li><strong>세금우대 (9.5%):</strong> 상호금융기관(농협, 수협, 신협, 새마을금고 등)의 조합원 또는 준조합원인 경우, 1인당 3,000만원 한도 내의 예탁금에 대해 낮은 세율을 적용받을 수 있습니다. (이자소득세 면제, 농어촌특별세 1.4%만 부과) 2025년 현재 이 제도가 유지되고 있으나, 정책 변경 가능성에 유의해야 합니다.</li><li><strong>비과세 (0%):</strong> 만 65세 이상 노인, 장애인, 독립유공자 등이 가입하는 \'비과세 종합저축\'은 1인당 5,000만원 한도 내에서 이자소득에 대한 세금이 완전히 면제됩니다. 절세 혜택이 가장 크므로, 자격이 된다면 반드시 활용해야 합니다.</li></ul>',
    tipsContent: '<h3 className="text-xl font-bold text-foreground mt-8 mb-4">💡 이자 한 푼이라도 더 받는 5가지 꿀팁</h3><ul className="space-y-6"><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">1. 발품 대신 \'손품\'을 팔아 금리를 비교하세요.</h4><p className="text-muted-foreground">더 이상 높은 금리를 찾기 위해 여러 은행을 방문할 필요가 없습니다. 금융감독원의 \'금융상품 한눈에\' 서비스나 은행연합회 소비자포털, 그리고 다양한 핀테크 앱(토스, 카카오뱅크, 뱅크샐러드 등)을 통해 모든 은행의 예금 금리를 실시간으로 비교하고 가장 좋은 조건을 쉽게 찾을 수 있습니다. 0.1%의 금리 차이라도 장기적으로는 큰 차이를 만듭니다.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">2. \'특판 예금\' 출시 알림을 활용하세요.</h4><p className="text-muted-foreground">은행들은 유동성 확보나 신규 고객 유치를 위해 종종 기본 금리보다 훨씬 높은 금리를 제공하는 \'특판 예금\'을 한시적으로 판매합니다. 판매 시작 몇 시간 만에 한도가 소진될 정도로 인기가 높습니다. 평소 관심 있는 은행의 앱 푸시 알림을 설정해두거나, 재테크 커뮤니티(예: 뽐뿌 재테크 포럼)를 주시하면 좋은 기회를 놓치지 않을 수 있습니다.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">3. \'만기 자동 연장\'은 다시 한번 생각해보세요.</h4><p className="text-muted-foreground">만기 시 자동 연장 옵션은 편리하지만, 연장 시점의 금리가 현재보다 낮을 수 있습니다. 특히 금리 인상기에는 손해가 될 가능성이 높습니다. 만기가 도래하면 자동 연장하기보다는, 그 시점에서 가장 금리가 높은 다른 상품으로 갈아타는(재예치) 것이 대부분의 경우 더 유리합니다. 캘린더에 만기일을 꼭 표시해두세요.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">4. \'비과세·세금우대\' 혜택을 최대한 활용하세요.</h4><p className="text-muted-foreground">ISA(개인종합자산관리계좌)를 통해 예금을 운용하면 계좌 내에서 발생한 이자 및 배당소득에 대해 200만원(서민형은 400만원)까지 비과세 혜택을 받을 수 있습니다. 또한, 만 65세 이상이거나 장애인 복지법에 따른 장애인이라면 \'비과세 종합저축\' 한도(5,000만원)를 반드시 활용하여 세금을 아끼는 것이 중요합니다.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">5. 예금자보호법 한도(5,000만 원)를 기억하세요.</h4><p className="text-muted-foreground">만약의 사태에 대비해, 한 금융기관에는 원금과 이자를 합쳐 5,000만 원까지만 예치하는 것이 안전합니다. 예금자보호법은 금융회사가 파산하더라도 1인당 최대 5,000만 원까지 보호해주므로, 이 금액을 초과하는 목돈은 여러 은행에 나누어 예치하는 것이 현명한 방법입니다. 저축은행의 경우 금리가 높은 대신 안정성이 상대적으로 낮을 수 있으므로 이 원칙을 더욱 철저히 지키는 것이 좋습니다.</p></li></ul>',
  },
  retirement: {
    title: '퇴직금 계산기',
    description: '근로기간과 급여 정보를 바탕으로 예상 퇴직금을 계산합니다.',
    inputs: {
      startDate: '입사일',
      endDate: '퇴사일',
      last3MonthsSalary: '퇴직 전 3개월 급여',
      month1: '1개월차 급여',
      month2: '2개월차 급여',
      month3: '3개월차 급여',
      annualBonus: '연간 상여금 총액',
      annualLeaveAllowance: '연차수당',
    },
    calculateButton: '퇴직금 계산하기',
    results: {
      title: '퇴직금 계산 결과',
      totalDays: '총 재직일수',
      dailyAverageWage: '1일 평균임금',
      estimatedSeverancePay: '예상 퇴직금',
    },
    placeholder: '계산하기 버튼을 눌러주세요',
    toastStartDateRequired: '입사일과 퇴사일을 모두 선택해주세요.',
    toastEndDateBeforeStart: '퇴사일은 입사일보다 빠를 수 없습니다.',
    toastLessThan1Year: '근무 기간이 1년 미만인 경우 퇴직금 지급 대상이 아닙니다.',
    toastSuccess: '퇴직금이 계산되었습니다.',
    descriptionContent: '<p><strong>퇴직금</strong>은 \'제2의 월급\'이라 불릴 만큼, 근로자의 안정적인 노후 생활을 위한 매우 중요한 자산입니다. 1년 이상 근무한 근로자가 퇴직할 때, 그동안의 근로에 대한 대가로 지급받는 소중한 자금이죠. 과거에는 퇴직 시 일시금으로 받는 것이 일반적이었지만, 현재는 <strong>퇴직연금제도(DB, DC, IRP)</strong>를 통해 더욱 체계적으로 관리되고 있습니다.</p><p>이 계산기는 복잡한 퇴직금 계산 과정을 간소화하여, 여러분의 예상 퇴직금을 쉽고 빠르게 확인할 수 있도록 돕습니다. 입사일, 퇴사일, 퇴직 전 3개월간의 급여, 그리고 연간 상여금과 같은 기타 수당을 입력하면, 법적 기준에 따른 예상 퇴직금을 산출해 보여줍니다.</p><p>단순히 금액을 확인하는 것을 넘어, 이 계산 결과를 바탕으로 본인의 퇴직연금 종류(DB/DC)에 따른 수령액 차이를 이해하고, IRP 계좌를 활용한 효과적인 절세 전략과 은퇴 자산 증식 계획을 세우는 첫걸음으로 활용하시길 바랍니다.</p>',
    formulaContent: '<p className="font-semibold">퇴직금은 \'1일 평균임금\'을 기준으로 \'총 재직일수\'에 비례하여 산정됩니다. 계산의 핵심 두 가지 요소를 정확히 이해하는 것이 중요합니다.</p><div className="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 className="text-lg font-bold text-primary mb-3">1. 1일 평균임금 산정</h3><p>퇴직일 이전 3개월 동안 지급된 임금 총액을 그 기간의 총 일수로 나눈 금액입니다. 여기에는 기본급뿐만 아니라 연장, 야간, 휴일근로수당 등과 같은 각종 수당이 포함됩니다.</p><p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm overflow-x-auto mt-2">1일 평균임금 = (퇴직 전 3개월 임금 총액 + 연간 상여금 × 3/12 + 연차수당 × 3/12) / 퇴직 전 3개월 총 일수</p><p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">※ 상여금, 연차수당 등 1년 단위로 지급된 임금은 3개월분으로 환산하여 포함합니다.</p><p className="text-xs text-primary mt-2">※ 1일 평균임금이 통상임금보다 적을 경우, 통상임금을 1일 평균임금으로 하여 계산해야 합니다.</p></div><div className="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 className="text-lg font-bold text-primary mb-3">2. 예상 퇴직금 계산</h3><p>산정된 1일 평균임금에 30일을 곱하여 \'30일분 평균임금\'을 구하고, 이를 총 재직기간에 비례하여 최종 퇴직금을 계산합니다.</p><p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm overflow-x-auto mt-2">예상 퇴직금 = 1일 평균임금 × 30일 × (총 재직일수 / 365일)</p><div className="mt-4 p-4 bg-muted rounded-lg border border-border"><h4 className="font-semibold text-foreground mb-2">계산 예시 (1일 평균임금 100,000원, 근속 5년)</h4><p className="text-sm text-muted-foreground">총 재직일수 = 365 × 5 = 1,825일</p><p className="font-mono text-sm text-primary mt-1">예상 퇴직금 = 100,000 × 30 × (1,825 / 365) = 100,000 × 30 × 5 = 15,000,000원</p></div></div>',
    tipsContent: '<h2 className="text-2xl font-bold text-foreground mt-10 mb-4">💡 2025년 퇴직금 200% 활용을 위한 은퇴 설계 전략</h2><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">1. DB vs DC, 내게 유리한 퇴직연금은?</h3><p className="mt-2">회사의 퇴직연금제도를 파악하는 것이 첫걸음입니다. <strong>안정성을 중시한다면 DB(확정급여형), 투자 수익을 기대한다면 DC(확정기여형)</strong>가 유리할 수 있습니다.</p><ul className="list-disc list-inside mt-3 space-y-2 text-sm"><li><strong>DB (Defined Benefit):</strong> 퇴직 시점의 평균임금과 근속연수에 따라 정해진 금액을 받는 방식. 회사가 적립금을 운용하며, 임금 상승률이 높은 대기업이나 공공기관 근로자에게 유리합니다. 안정적이지만, 투자 수익의 기회는 없습니다.</li><li><strong>DC (Defined Contribution):</strong> 회사가 매년 연간 임금 총액의 1/12 이상을 근로자의 계좌에 넣어주면, 근로자가 직접 운용(투자)하는 방식. 투자 성과에 따라 퇴직금이 달라집니다. 투자에 자신 있고, 임금 상승률보다 높은 수익을 기대하는 경우 유리합니다.</li></ul></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">2. IRP 계좌: 세금은 줄이고, 노후 자금은 늘리는 마법의 통장</h3><p className="mt-2">퇴직금을 수령할 때, 개인형 퇴직연금(IRP) 계좌로 이전하면 <strong>퇴직소득세를 당장 내지 않고, 연금 수령 시점까지 과세를 이연</strong>할 수 있습니다. 이는 매우 강력한 절세 혜택입니다.</p><ul className="list-disc list-inside mt-3 space-y-2 text-sm"><li><strong>과세이연 효과:</strong> 세금을 떼지 않은 원금 전체를 재투자하여 더 높은 수익을 기대할 수 있습니다. (일명 \'세금으로 투자하기\')</li><li><strong>저율과세:</strong> 연금으로 수령 시, 기존 퇴직소득세율(약 6~45%)의 70%에 해당하는 낮은 연금소득세율(3.3%~5.5%)을 적용받습니다.</li><li><strong>세액공제:</strong> IRP 계좌에 추가로 납입하는 금액에 대해서는 연간 최대 900만원까지 세액공제 혜택(13.2% 또는 16.5%)을 받을 수 있습니다.</li></ul></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">3. 퇴직금 중간정산, 정말 필요할 때만!</h3><p className="mt-2">무주택자의 주택 구입 등 법에서 정한 특정한 사유가 아니면 퇴직금 중간정산은 불가능합니다. 설령 가능하더라도 신중해야 합니다. 중간정산은 장기적인 노후 자산을 미리 당겨 쓰는 것으로, 복리 효과를 누릴 기회를 잃게 만듭니다. 불가피한 상황이 아니라면, 퇴직금은 최대한 보존하여 은퇴 시점까지 운용하는 것이 현명합니다.</p></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">4. 퇴직금도 \'투자\'가 필요하다</h3><p className="mt-2">DC형 가입자나 IRP 계좌 보유자는 적립금을 어떤 상품으로 운용할지 직접 결정해야 합니다. \'알아서 되겠지\'라는 생각으로 원리금보장상품에만 넣어두면, 물가상승률을 따라가지 못해 실질 가치가 하락할 수 있습니다. 본인의 투자 성향과 남은 기간을 고려하여, <strong>안정적인 채권형 펀드와 성장 가능성이 있는 주식형 펀드, TDF(Target Date Fund) 등을 적절히 배분</strong>하는 포트폴리오 전략이 필요합니다.</p></div>',
  },
  installmentSavingsMonthly: {
    title: '월 복리 적금 계산기',
    description: '매월 꾸준히 모아 목돈을 만드는 월 복리 적금, 만기 예상 금액을 확인해보세요.',
    inputs: {
      initialPrincipal: '초기 원금 (원)',
      monthlyDeposit: '월 적립금 (원)',
      period: '투자기간 (개월)',
      annualInterestRate: '연 이자율 (%)',
      depositTiming: '적립 시점',
    },
    depositTimingOptions: {
      beginning: '월초',
      end: '월말',
    },
    results: {
      totalPrincipal: '총 원금',
      totalInterest: '총 이자 (세전)',
      maturityAmount: '만기지급금액',
      placeholder: '계산 정보를 입력하고 계산하기 버튼을 눌러주세요.',
    },
    tabs: {
      chart: '차트',
      details: '월별 상세 내역',
    },
    tableHeaders: {
      month: '개월차',
      principal: '원금',
      interest: '이자 (세전)',
      total: '이자포함원금',
    },
    chartKeys: {
      principal: '원금',
      totalWithInterest: '이자포함원금',
    },
    fullTitle: '상세 분석',
    descriptionContent: '<p class="text-muted-foreground"><strong>월 복리 적금</strong>은 복리의 마법을 활용하는 가장 기본적이면서도 강력한 금융 도구입니다. 워렌 버핏은 복리를 "세계 8대 불가사의"라고 칭했습니다.</p><p class="mt-4 text-muted-foreground">이 계산기는 시간과 이자율이라는 두 날개를 단你的 월별 적금이 눈덩이처럼 불어나는 과정을 명확하게 보여줍니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">월 복리 적금 공식</h3><div class="space-y-4"><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">1. 월초 납입 (선납형)</h4><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>S = A × (1 + r) × [ ((1 + r)^n - 1) / r ]</strong></p></div><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">2. 월말 납입 (후납형)</h4><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>S = A × [ ((1 + r)^n - 1) / r ]</strong></p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">복리 적금 200% 활용 팁</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. 지금 당장 시작하세요</h4><p>복리의 핵심 재료는 시간입니다. 10년 먼저 시작하면 은퇴 시 수억 원의 차이가 날 수 있습니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. 72의 법칙을 활용하세요</h4><p><strong>72 / 연이율(%) ≈ 원금 2배 달성 기간(년)</strong></p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. 월초에 납입하세요</h4><p>월급날이 25일이라면 26일이 아닌 다음 달 1일에 자동이체를 설정하세요.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. 비과세 상품을 활용하세요</h4><p>ISA, 연금저축, IRP 등 비과세/절세 상품을 최우선으로 활용하세요.</p></li></ul>',
  },
  stockCompoundInterest: {
    title: '주식 복리 계산기',
    description: '복리 효과를 통한 장기 투자의 힘을 확인해보세요.',
    inputs: {
      initialInvestment: '초기 투자금 (원)',
      monthlyInvestment: '월 추가 투자금 (원)',
      annualReturn: '연 수익률 (%)',
      investmentPeriod: '투자 기간 (년)',
    },
    results: {
      finalValuation: '최종 평가액',
      detailHint: '아래 표에서 상세 내역을 확인하세요.',
      placeholder: '결과가 여기에 표시됩니다.',
    },
    tableHeaders: {
      period: '기간',
      principal: '투자 원금',
      valuation: '평가액',
    },
    yearSuffix: '년',
    fullTitle: '상세 분석',
    descriptionContent: '<p class="text-muted-foreground"><strong>"투자의 세계 8대 불가사의"</strong> — 알버트 아인슈타인이 복리를 두고 한 말입니다. 주식 복리 계산기는 이 강력한 원리를 시각적으로 체험할 수 있는 금융 도구입니다.</p><p class="mt-4 text-muted-foreground">이 계산기는 시간이 자산을 지수적으로 증가시키는 과정을 명확하게 보여줍니다. 은퇴 자금 마련이든 자녀 교육 자금이든, 현실적인 시뮬레이션을 실행할 수 있습니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">복리 계산 방식</h3><div class="space-y-4"><ul class="list-decimal list-inside space-y-2"><li><strong>1년차 평가액:</strong><p class="pl-4 mt-1 bg-card p-2 rounded"><code>(초기 투자금 + (월 투자금 x 12)) x (1 + 연 수익률)</code></p></li><li><strong>2년차 이후:</strong><p class="pl-4 mt-1 bg-card p-2 rounded"><code>(전년 평가액 + (월 투자금 x 12)) x (1 + 연 수익률)</code></p></li></ul></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">장기 주식 투자 팁</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. 현실적인 수익률 기대치를 설정하세요</h4><p>S&P 500 역사적 평균은 약 10-12%입니다. 보수적(5-7%)과 낙관적(12-15%) 시나리오를 비교하세요.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. 적립식 투자를 활용하세요</h4><p>매월 일정 금액을 투자하면 타이밍 리스크를 줄일 수 있습니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. 세금과 수수료를 고려하세요</h4><p>국내 주식은 매도 시 양도소득세, 배당은 15.4% 과세됩니다. 연금저축, IRP, ISA를 활용하세요.</p></li></ul>',
  },
  salary: {
    title: '급여 계산기',
    description: '4대보험과 세금 공제 후 실수령액을 정확하게 계산합니다.',
    inputs: {
      annualSalary: '연봉 (세전)',
      nonTaxableAmount: '연간 비과세 금액 (식대, 차량유지비 등)',
      dependents: '부양가족 수 (본인 포함)',
    },
    dependentsPlaceholder: '부양가족 수 선택',
    results: {
      estimatedTakeHome: '예상 실수령액',
      monthlyTakeHome: '월 실수령액',
      annualTakeHome: '연 실수령액',
      placeholder: '정보를 입력하고 계산하기 버튼을 눌러주세요.',
    },
    tableHeaders: {
      deductionItem: '공제 항목',
      amountMonthly: '금액 (월)',
    },
    deductions: {
      nationalPension: '국민연금 (4.5%)',
      healthInsurance: '건강보험 (3.545%)',
      longTermCare: '장기요양보험',
      employmentInsurance: '고용보험 (0.9%)',
      四大InsuranceTotal: '4대보험 합계',
      incomeTax: '소득세 (간이세액)',
      localIncomeTax: '지방소득세 (10%)',
      totalDeductions: '공제 합계',
    },
    fullTitle: '상세 내역',
    descriptionContent: '<p class="text-muted-foreground"><strong>급여 계산기</strong>는 계약서상 연봉(세전 금액)에서 복잡한 4대보험과 세금을 공제하여 월 실수령액을 정확하게 계산하는 스마트한 도구입니다.</p><p class="mt-4 text-muted-foreground">단순히 숫자를 넘어, 매달 급여에서 어떤 항목이 얼마씩 공제되는지 명확하게 파악할 수 있습니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">실수령액 계산 방식 (2025년)</h3><div class="space-y-4"><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">1. 4대 사회보험</h3><ul class="list-disc list-inside space-y-2 text-sm"><li><strong>국민연금 (근로자 4.5%):</strong> 월 급여의 4.5%</li><li><strong>건강보험 (근로자 3.545%):</strong> 보수월액의 3.545%</li><li><strong>장기요양보험:</strong> 건강보험료의 12.95%</li><li><strong>고용보험 (근로자 0.9%):</strong> 총 월급여의 0.9%</li></ul></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">2. 소득세 및 지방소득세</h3><ul class="list-disc list-inside space-y-2 text-sm"><li><strong>소득세:</strong> 국세청 "간이세액표"에 따라 보수월액과 부양가족 수로 결정</li><li><strong>지방소득세:</strong> 산출된 소득세의 10%</li></ul></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">급여 200% 활용 팁</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. 비과세 항목을 최대한 활용하세요</h4><p>식대(월 20만원), 차량유지비(월 20만원), 자녀수당(6세 이하 월 20만원)은 비과세입니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. 연말정산으로 "13월의 월급"을 받으세요</h4><p>신용/직불카드 사용액, 의료비, 교육비, 주거비를 준비하세요. 연금저축/IRP는 연간 최대 900만원까지 세액공제됩니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. 세전 기준으로 연봉을 협상하세요</h4><p>모든 연봉 협상은 세전 기준입니다. 업계 평균을 조사하고, 성과를 구체적인 숫자로 증명하세요.</p></li></ul>',
  },
  ordinaryWage: {
    title: '통상임금 계산기',
    description: '기본급, 수당, 상여금 등을 기반으로 통상임금을 계산합니다.',
    inputs: {
      baseSalary: '월 기본급 (원)',
      monthlyAllowances: '월 기타 수당 (원)',
      annualBonuses: '연간 상여금 (원)',
      workHoursPerWeek: '주 소정근로시간',
    },
    results: {
      hourlyWage: '시급 (통상임금)',
      dailyWage: '일급 (통상임금)',
      monthlyWage: '월급 (통상임금)',
      annualWage: '연 환산 급여',
      placeholder: '정보를 입력하고 계산하기 버튼을 눌러주세요.',
    },
    fullTitle: '상세 분석',
    descriptionContent: '<p class="text-muted-foreground"><strong>통상임금</strong>은 단순한 월급 약간을 넘어서는 핵심 임금 개념입니다. 연장/야간/휴일수당, 연차수당, 해고예고수당 등 각종 법정수당의 계산 기준이 됩니다.</p><p class="mt-4 text-muted-foreground">통상임금을 정확히 파악하는 것은 근로자가 정당한 권리를 주장하고, 고용주는 잠재적 법적 분쟁을 예방하는 길입니다.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">통상임금 계산 방식</h3><div class="space-y-4"><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">1. 월 통상임금</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">월 통상임금 = 월 기본급 + 고정 수당 + (연간 상여금 / 12)</p></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">2. 시급 (통상임금)</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">시급 = 월 통상임금 / 월 소정근로시간</p><p class="mt-3"><strong>월 소정근로시간:</strong></p><p class="text-sm">주 40시간/5일 근무, 유급주휴(일요일 8시간) 포함 시 평균 <strong>209시간/월</strong></p></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">3. 일급 (통상임금)</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">일급 = 시급 x 1일 소정근로시간</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">통상임금 핵심 정보 (2025년)</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. 세 가지 기준: 정기성, 일반성, 고정성</h4><p>통상임금에 해당하려면 이 세 가지를 모두 충족해야 합니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. 통상임금 vs 평균임금</h4><p>통상임금은 연장/야간/휴일수당과 연차수당의 기준, 평균임금은 퇴직금의 기준입니다.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. 통상임금이 영향을 미치는 항목</h4><p>연장/야간/휴일수당(150%), 미사용 연차수당, 해고예고수당(30일), 출산/육아휴직급여, 퇴직금</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. 포함 vs 제외 항목</h4><p><strong>포함:</strong> 기본급, 직무/직급수당, 기술/자격수당, 고정 식대/교통/통신비, 고정 상여금<br/><strong>제외:</strong> 성과상여금, 실비변상적 급여, 부양가족 수당, 복리후생비, 미사용 연차수당</p></li></ul>',
  },
  unitConverter: {
    title: '통합 단위 변환기',
    description: '기본 단위 및 공학 단위를 빠르게 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    undefinedCategory: '정의되지 않은 단위 카테고리입니다.',
    groupLabels: {
      group1: '기본 단위',
      group2: '공학 단위',
    },
    calculatorDescription: {
      p1: '<strong>통합 단위 변환기</strong>는 길이, 면적, 부피, 온도 등 기본 단위와 유량, 압력, 에너지, 질량, 엔탈피 등 공학 단위를 하나의 화면에서 모두 변환할 수 있는 실용적인 도구입니다. 드롭다운에서 단위를 선택하고 값을 입력하면 해당 카테고리의 모든 단위로 자동 환산된 결과를 한눈에 확인할 수 있습니다.',
      p2: '일상생활에서는 집 꾸미기, 요리, 운동 기록 등에서 자주 단위 환산이 필요하고, 산업 현장과 연구소에서는 설계 도면, 시험 데이터, 해외 규격을 다룰 때 전문 단위 변환이 필수적입니다. 이 도구는 기본 탭과 공학 탭으로 나뉘어 누구나 쉽게 사용할 수 있습니다.',
      p3: '학생과 교사에게는 단위 개념을 익히는 학습 자료로, 엔지니어와 기술자에게는 도면과 시방서를 검토하는 실무 도구로 유용합니다. 또한 수입 장비의 사양서를 읽거나 해외 문헌을 번역할 때도 큰 도움이 됩니다.',
      note: '변환 계수는 국제 단위계(SI)와 널리 통용되는 표준을 따릅니다. 다만 온도(°C, °F, K)는 단순 비례가 아닌 별도의 선형 공식으로 계산되므로 다른 단위와 혼동하지 않도록 주의하세요.',
    },
    glossary: [
      { term: '국제 단위계(SI)', desc: '길이(m), 질량(kg), 시간(s), 온도(K) 등을 기본으로 하는 국제 표준 단위계입니다. 대부분의 과학·공학 단위 변환의 기준이 됩니다.' },
      { term: '엔탈피', desc: '물질이 가진 총 열에너지를 나타내는 공학 단위(보통 J 또는 kJ)로, 열역학·플랜트 설계에서 유량·압력과 함께 자주 다뤄집니다.' },
      { term: '단위 접두어', desc: 'k(킬로)=1,000배, m(밀리)=1/1,000배, µ(마이크로)=1/1,000,000배 등으로 단위 크기를 조정하는 약어입니다.' },
    ],
    formulaTitle1: '선형 단위 변환 공식',
    formulaDesc1: '길이, 면적, 부피, 질량 등 비례 단위는 기준 단위 계수를 이용해 환산합니다.',
    formulaFormula: '대상값 = 입력값 × (대상 단위 계수 / 기준 단위 계수)',
    formulaExample: '예: 1 m = 100 cm = 1,000 mm, 1 km = 1,000 m',
    formulaTitle2: '온도 변환 공식',
    formulaDesc2: '온도는 영점이 다르므로 곱셈과 덧셈이 함께 적용됩니다.',
    formulaTitle3: '계산 예시',
    formulaExampleDesc: '5 km를 m과 cm로 변환하면:',
    formulaExampleResult: '5 km × 1,000 = 5,000 m = 500,000 cm',
    tips: {
      title1: '기본 단위 활용',
      items1: ['길이, 면적, 부피, 온도는 일상에서 가장 자주 쓰이는 단위입니다.', '집 인테리어나 운동 기록 정리에 기본 탭을 활용하세요.'],
      title2: '공학 단위 활용',
      items2: ['유량, 압력, 에너지, 질량, 엔탈피는 플랜트와 기계 설계에 사용됩니다.', '해외 장비 사양서의 단위를 국내 기준으로 바꿀 때 유용합니다.'],
      title3: '온도 변환 주의',
      items3: ['섭씨, 화씨, 절대온도(K)는 선형 공식으로 따로 계산합니다.', '영점이 다르므로 비례 단위와 혼동하지 마세요.'],
      title4: '소수점과 유효숫자',
      items4: ['측정값의 정밀도에 맞춰 결과의 자릿수를 조정하세요.', '과도한 소수점은 오히려 신뢰도를 떨어뜨릴 수 있습니다.'],
      title5: '단위 접두어 익히기',
      items5: ['k(킬로)=1,000, m(밀리)=0.001, µ(마이크로)=0.000001 배수입니다.', '접두어만 바꿔도 계산이 쉬워집니다.'],
      title6: '검증 습관',
      items6: ['중요한 설계 값은 계산기를 바꿔 두 번 이상 확인하세요.', '특히 압력과 에너지 단위는 차원이 잘못되기 쉽습니다.'],
    },
  },
  weightConverter: {
    title: '무게 변환기',
    description: 'mg, g, kg, ton, oz, lb 단위 간 무게를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    unitLabels: {
      mg: '밀리그램(mg)',
      g: '그램(g)',
      kg: '킬로그램(kg)',
      ton: '톤(ton)',
      oz: '온스(oz)',
      lb: '파운드(lb)',
    },
    calculatorDescription: {
      p1: '<strong>무게 변환기</strong>는 다양한 무게·질량 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리그램(mg), 그램(g), 킬로그램(kg), 톤(ton), 온스(oz), 파운드(lb) 간의 환산을 빠르게 수행할 수 있으며, 미터법과 영미법 단위를 자유롭게 오갈 수 있습니다.',
      p2: '요리와 베이킹, 과학 실험, 물류와 운송, 헬스와 체중 관리 등 일상과 산업 전반에서 무게 단위 변환이 필요합니다. 특히 수입 식품의 영양성분 표시나 해외 규격 문서를 다룰 때 단위 혼선을 막는 데 유용합니다.',
      p3: '학생에게는 단위 감각을 익히는 학습 자료로, 연구자와 조리사, 물류 담당자에게는 실무 도구로 활용됩니다. 정확한 계량은 요리의 성공과 실험의 신뢰성을 좌우하므로 정밀한 환산이 중요합니다.',
      note: '변환 계수는 국제 표준을 따릅니다. 1 kg = 1,000 g = 2.2046 lb이며, 톤(ton)은 메트릭 톤(1,000 kg)을 기준으로 합니다. 미국 톤(short ton, 약 907 kg)과 영국 톤(long ton, 약 1,016 kg)과는 다르므로 주의하세요.',
    },
    glossary: [
      { term: '미터법과 영미법', desc: '미터법은 kg·m·s를 기반으로 한 국제 표준 단위계이고, 영미법은 파운드·온스·인치 등을 쓰는 단위계입니다. 국가와 분야에 따라 혼용되므로 변환이 필요합니다.' },
      { term: '메트릭 톤(tonne)', desc: '1,000 kg을 기준으로 하는 국제 표준 톤입니다. 미국 쇼트톤(약 907 kg), 영국 롱톤(약 1,016 kg)과 수치가 달라 문서나 계약서상 단위 정의를 확인해야 합니다.' },
    ],
    formulaTitle: '무게 단위 변환 관계',
    formulaExample: '예를 들어 5 kg을 파운드(lb)로 변환하면:',
    formulaResult: '5 kg × 2.2046 = 11.023 lb',
    tips: {
      title1: '일상적인 무게 비교',
      items1: ['사과 1개 약 150~200 g, 성인 평균 체중 70~80 kg', '소형차 1~1.5 ton, 코끼리 4~6 ton'],
      title2: '요리에서의 무게',
      items2: ['한국 요리는 주로 g을, 영미권은 oz·컵을 사용합니다.', '베이킹은 정확한 무게 측정이 맛의 일관성에 중요합니다.'],
      title3: '국제 무역',
      items3: ['국제 무역은 메트릭 톤(tonne)이 표준입니다.', '곡물·석유·광물 거래량 산정에 사용됩니다.'],
      title4: '실험실 계량',
      items4: ['전자 저울로 정확히 측정하고 단위를 통일하세요.', '온도에 따라 부피가 변하므로 질량 기준 계산이 안정적입니다.'],
      title5: '톤 단위 주의',
      items5: ['메트릭 톤과 미국·영국 톤은 수치가 다릅니다.', '계약서상 단위 정의를 반드시 확인하세요.'],
      title6: '건강 관리',
      items6: ['체중과 근육량을 kg 단위로 기록하세요.', '영양성분 표시의 g과 mg을 구분하세요.'],
    },
  },
  distanceConverter: {
    title: '거리 변환기',
    description: 'mm, cm, m, km, inch, foot, yard, mile 단위 간 거리를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    unitLabels: {
      mm: '밀리미터(mm)',
      cm: '센티미터(cm)',
      m: '미터(m)',
      km: '킬로미터(km)',
      inch: '인치(inch)',
      foot: '피트(foot)',
      yard: '야드(yard)',
      mile: '마일(mile)',
    },
    calculatorDescription: {
      p1: '<strong>거리 변환기</strong>는 미터법과 영미법 등 다양한 길이 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리미터(mm), 센티미터(cm), 미터(m), 킬로미터(km), 인치(inch), 피트(foot), 야드(yard), 마일(mile) 간의 환산을 통해 국제적으로 통용되는 거리 단위를 빠르게 바꿀 수 있습니다.',
      p2: '여행, 건축, 토목, 공학, 과학 실험 등 다양한 분야에서 거리 단위 변환이 필요합니다. 특히 미터법과 영미법을 혼용하는 국제 환경, 수입 설비 사양서를 읽을 때, 또는 해외 지도와 도면을 다룰 때 매우 유용합니다.',
      p3: '학생들에게는 단위 개념을 익히는 학습 자료로, 설계자와 시공자에게는 도면과 현장 측정값을 조율하는 실무 도구로 활용됩니다. 일상에서도 신장, 붙박이장 크기, 운동 거리를 비교할 때 편리합니다.',
      note: '변환 계수는 국제 표준(ISO)을 따릅니다. 인치와 센티미터는 엄밀하게 1 inch = 2.54 cm이며, 마일은 1 mile = 1.609344 km입니다. 항공에서는 해리(nautical mile, 1.852 km)를 사용하므로 용도에 맞는 단위를 선택하세요.',
    },
    glossary: [
      { term: '해리(nautical mile)', desc: '항공·해상에서 쓰는 길이 단위로 1해리 = 1.852 km입니다. 적도에서 위도 1분에 해당하며, 육상 마일(mile)과 다릅니다.' },
      { term: '미터법과 영미법', desc: '미터법은 mm·cm·m·km를 쓰는 국제 표준이고, 영미법은 inch·foot·yard·mile을 씁니다. 미국 등 일부 국가에서 혼용되므로 변환이 필요합니다.' },
    ],
    formulaTitle: '거리 단위 변환 관계',
    formulaExample: '예를 들어 100 yard를 미터로 변환하면:',
    formulaResult: '100 yard × 0.9144 = 91.44 m',
    tips: {
      title1: '일상적인 거리 비교',
      items1: ['농구 코트: 28 m, 축구장 길이: 100~110 m', '서울~부산: 약 325 km, 지구 둘레: 약 40,075 km'],
      title2: '미터법 vs 영미법',
      items2: ['미국, 라이베리아, 미얀마를 제외한 대부분의 국가가 미터법을 사용합니다.', '영국 도로 표지판은 미터와 마일을 혼용 표시합니다.'],
      title3: '항공 거리',
      items3: ['항공에서는 해리(1.852 km)를 사용하며, 1해리는 적도에서 1분에 해당합니다.', '지도상 거리와 실제 비행 거리는 다를 수 있습니다.'],
      title4: '건축·토목 활용',
      items4: ['도면 단위(피트/인치)를 현장 단위(m)로 환산해 오차를 줄이세요.', '자재 길이 산정 시 여유분을 고려하세요.'],
      title5: '운동 기록 관리',
      items5: ['러닝 거리를 km와 mile로 함께 기록해 비교하세요.', '페이스 환산 시 거리 단위를 먼저 통일하세요.'],
      title6: '소수점 주의',
      items6: ['정밀 측정에서는 유효숫자를 맞춰 기록하세요.', '단위 혼용으로 인한 사고를 막기 위해 단위를 명시하세요.'],
    },
  },
  volumeConverter: {
    title: '부피 변환기',
    description: 'mL, L, gal, qt, pt, cup, fl oz, m³, cm³ 단위 간 부피를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    unitLabels: {
      mL: '밀리리터(mL)',
      L: '리터(L)',
      gal: '갤런(gal)',
      qt: '쿼트(qt)',
      pt: '파인트(pt)',
      cup: '컵(cup)',
      'fl oz': '액량온스(fl oz)',
      'm³': '세제곱미터(m³)',
      'cm³': '세제곱센티미터(cm³)',
    },
    calculatorDescription: {
      p1: '<strong>부피 변환기</strong>는 다양한 부피·용적 단위 간의 정확한 변환을 제공하는 도구입니다. 밀리리터(mL), 리터(L), 갤런(gal), 쿼트(qt), 파인트(pt), 컵(cup), 액량온스(fl oz), 세제곱미터(m³), 세제곱센티미터(cm³) 간의 환산을 빠르게 수행할 수 있습니다.',
      p2: '요리와 베이킹, 화학 실험, 공학 설계, 물류와 일상생활 등에서 부피 단위 변환이 자주 필요합니다. 미터법과 영미법 단위를 오가며 레시피 scaling이나 시약 배합, 탱크 용량 산정 등에 활용됩니다.',
      p3: '조리사와 연구자에게는 계량 도구로, 엔지니어와 물류 담당자에게는 설계·운송 도구로 유용합니다. 정확한 부피 환산은 배합 비율의 신뢰성과 안전성을 결정짓는 요소입니다.',
      note: '변환 계수는 국제 표준을 따르며, 1 L = 1,000 mL = 1,000 cm³, 1 m³ = 1,000 L입니다. 다만 갤런은 미국 갤런(US gal, 3.78541 L)과 영국 갤런(Imp gal, 4.546 L)이 다르므로 주의하세요.',
    },
    glossary: [
      { term: '갤런 종류(US/Imp gal)', desc: '미국 갤런(US gal)은 3.78541 L, 영국 갤런(Imp gal)은 4.546 L로 약 20% 차이가 납니다. 해외 문헌의 gal 종류를 먼저 확인하세요.' },
      { term: '액량온스(fl oz)', desc: '부피를 재는 온스로 질량 단위 온스(oz)와 다릅니다. 1 fl oz = 29.5735 mL이며 주로 미국 요리·음료 용량에 쓰입니다.' },
    ],
    formulaTitle: '부피 단위 변환 관계',
    formulaExample: '예를 들어 2 L를 US 갤런으로 변환하면:',
    formulaResult: '2 L ÷ 3.78541 = 0.528 gal',
    tips: {
      title1: '요리에서의 부피',
      items1: ['한국 요리는 mL·L을, 영미권은 컵·큰술·작은술을 사용합니다.', '1 cup ≈ 236.5 mL, 1 tbsp ≈ 15 mL입니다.'],
      title2: '일상적인 부피 비교',
      items2: ['페트병 음료 500 mL, 생수통 2 L', '욕조 약 150~200 L, 수영장(소형) 약 50,000~100,000 L'],
      title3: '연료 관련',
      items3: ['자동차 연료는 L 또는 gal 단위로 표시됩니다.', '미국은 gal, 유럽과 한국은 L를 주로 사용합니다.'],
      title4: '화학 실험',
      items4: ['시약 배합은 mL·L 단위로 정밀하게 측정하세요.', '용기 눈금의 오차를 고려해 중간 눈금을 피하세요.'],
      title5: '갤런 종류 주의',
      items5: ['US gal과 Imp gal은 약 20% 차이가 납니다.', '해외 문헌의 gal 종류를 먼저 확인하세요.'],
      title6: '부피와 질량',
      items6: ['물은 1 mL ≒ 1 g이지만 다른 액체는 밀도가 다릅니다.', '농도 계산 시 부피와 질량을 혼동하지 마세요.'],
    },
  },
  dataSizeConverter: {
    title: '데이터 크기 변환기',
    description: 'Byte, KB, MB, GB, TB, PB 단위 간 데이터 크기를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    unitLabels: {
      Byte: '바이트(Byte)',
      KB: '킬로바이트(KB)',
      MB: '메가바이트(MB)',
      GB: '기가바이트(GB)',
      TB: '테라바이트(TB)',
      PB: '페타바이트(PB)',
    },
    calculatorDescription: {
      p1: '<strong>데이터 크기 변환기</strong>는 컴퓨터에서 사용되는 다양한 데이터 저장 단위 간의 변환을 돕는 필수적인 도구입니다. 바이트(Byte), 킬로바이트(KB), 메가바이트(MB), 기가바이트(GB), 테라바이트(TB), 페타바이트(PB) 간의 정확한 변환 결과를 한 번에 확인할 수 있습니다.',
      p2: '데이터 처리량, 파일 크기, 저장 공간 등을 계산할 때 여러 단위를 빠르게 비교하고 변환할 수 있어 웹 개발, 데이터 분석, 시스템 관리, 클라우드 컴퓨팅 등 다양한 분야에서 활용됩니다.',
      p3: '디지털 세계에서 데이터의 양은 기하급수적으로 증가하고 있습니다. 1KB의 텍스트 파일부터 수 PB에 달하는 데이터센터의 저장 용량까지, 정확한 단위 변환은 IT 인프라 계획과 비용 산정에 핵심적인 역할을 합니다.',
      note: '이 변환기는 이진(Binary) 기준(1KB = 1,024 Byte)을 사용하며, 입력된 값에 대해 모든 단위로의 변환 결과를 동시에 보여줍니다. 저장 장치 구매, 클라우드 서비스 선택, 대용량 파일 전송 등 다양한 상황에서 즉시 활용할 수 있습니다.',
    },
    glossary: [
      { term: '이진(Binary) 기준', desc: '컴퓨터는 2진법을 쓰므로 1KB = 1,024(2^10) Byte로 계산합니다. 운영체제와 대부분의 소프트웨어가 이 기준을 사용합니다.' },
      { term: '십진(Decimal) 기준', desc: '저장 장치 제조사는 1KB = 1,000(10^3) Byte로 표기합니다. 그래서 실제 사용 가능 용량이 표시 용량보다 작게 느껴지는 원인이 됩니다.' },
    ],
    formulaTitle: '데이터 크기 단위 변환 공식',
    formulaNote: '이 변환기는 이진(Binary, 2^10 = 1,024) 기준을 사용합니다. 일부 시스템이나 저장 장치 제조사에서는 십진(Decimal, 10^3 = 1,000) 기준을 사용할 수 있습니다. 예: 1GB HDD = 1,000,000,000 Byte',
    tips: {
      title1: '핵심 개념',
      items1: [
        '이진(Binary) vs 십진(Decimal)',
        '컴퓨터는 이진법을 사용하므로 1KB = 1,024 Byte입니다. 그러나 하드 디스크 제조사는 1KB = 1,000 Byte(십진)를 사용하여 실제 저장 용량이 표시 용량보다 작게 느껴질 수 있습니다.',
      ],
      title2: '파일 크기 참고',
      items2: [
        '웹페이지: 약 2~5MB / 고화질 영화(1080p): 약 4~8GB / 4K 영화: 약 15~50GB / 1시간 4K 영상: 약 20GB',
      ],
      title3: '저장 장치 용량 참고',
      items3: ['USB: 32~256GB', 'SSD: 256GB~4TB', 'HDD: 1~20TB', '클라우드: 수 TB~PB 단위'],
      title4: '활용 사례',
      items4: ['웹 개발: 이미지 최적화, 리소스 압축 용량 계산', '데이터베이스: 백업 용량, 저장소 확장 계획', '클라우드: 저장 서비스 요금제 선택', '백업: 필요한 백업 스토리지 용량 산정'],
    },
  },
  speedConverter: {
    title: '속도 변환기',
    description: 'm/s, km/h, mph, knot, ft/s 단위 간 속도를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 100',
    unitLabels: {
      'm/s': '미터/초(m/s)',
      'km/h': '킬로미터/시간(km/h)',
      'mph': '마일/시간(mph)',
      'knot': '노트(knot)',
      'ft/s': '피트/초(ft/s)',
    },
    calculatorDescription: {
      p1: '<strong>속도 변환기</strong>는 다양한 속도 단위 간의 정확한 변환을 제공하는 도구입니다. 미터/초(m/s), 킬로미터/시간(km/h), 마일/시간(mph), 노트(knot), 피트/초(ft/s) 간의 환산을 빠르게 수행할 수 있으며, 자동차·비행기·바람 속도부터 과학적 계산까지 폭넓게 활용됩니다.',
      p2: '물리학과 공학에서는 m/s가 표준이고, 도로 교통에서는 km/h, 해상·항공에서는 노트(knot)가 쓰이는 등 분야마다 다른 단위가 사용됩니다. 이 도구는 이러한 단위를 손쉽게 변환하여 소통 오류를 줄여줍니다.',
      p3: '학생과 연구자에게는 운동학 학습 자료로, 운전자와 항해사, 기상 예보자에게는 실무 도구로 유용합니다. 또한 해외 차량 사양이나 풍속 데이터를 다룰 때 큰 도움이 됩니다.',
      note: '변환 계수는 국제 표준을 따릅니다. 1 m/s = 3.6 km/h이며, 1 노트는 1시간에 1해리(1.852 km)를 이동하는 속도, 즉 1.852 km/h입니다. 단위 선택 시 측정 대상의 성격에 맞춰 구분하세요.',
    },
    glossary: [
      { term: '노트(knot)와 해리', desc: '노트는 1시간에 1해리(1.852 km)를 가는 속도(1.852 km/h)입니다. 항공·해상에서 쓰이며, 육상 km/h와 구분해야 합니다.' },
      { term: '마일(mph)', desc: '영미권 도로에서 쓰는 속도 단위로 1 mph = 1.609344 km/h입니다. 미국·영국 차량 사양과 풍속 비교 시 사용됩니다.' },
    ],
    formulaTitle: '속도 단위 변환 관계',
    formulaExample: '100 km/h를 m/s로 변환하면:',
    formulaResult: '100 km/h ÷ 3.6 = 27.78 m/s',
    tips: {
      title1: '일상적인 속도 비교',
      items1: ['걷기 약 5 km/h, 자전거 15~25 km/h, 고속도로 100~120 km/h', '음속 약 1,235 km/h(343 m/s)'],
      title2: '단위별 주요 사용처',
      items2: ['km/h: 대부분 국가의 도로 교통', 'm/s: 과학 계산과 물리학, mph: 미국·영국 도로', 'knot: 항공·해상 교통'],
      title3: '바람 속도 표기',
      items3: ['기상예보는 주로 km/h 또는 m/s를 사용합니다.', '강풍 기준은 풍속 17 m/s(약 61 km/h) 이상입니다.'],
      title4: '자동차 성능 비교',
      items4: ['0→100 km/h 가속 시간은 m/s²로 환산해 비교할 수 있습니다.', '제동 거리 계산 시 초속 단위가 정확합니다.'],
      title5: '항공·해상 활용',
      items5: ['이륙 속도와 항해 속도는 노트 단위로 관리됩니다.', '풍속과 대조류를 고려한 실속도 계산에 유용합니다.'],
      title6: '학습 팁',
      items6: ['속도와 속력(방향 없는 스칼라)의 차이를 이해하세요.', '단위 환산 전 식의 차원을 먼저 점검하세요.'],
    },
  },
  energyConverter: {
    title: '에너지 변환기',
    description: 'J, kJ, cal, kcal, Wh, kWh, BTU 단위 간 에너지를 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 100',
    unitLabels: {
      J: '줄(J)',
      kJ: '킬로줄(kJ)',
      cal: '칼로리(cal)',
      kcal: '킬로칼로리(kcal)',
      Wh: '와트시(Wh)',
      kWh: '킬로와트시(kWh)',
      BTU: 'BTU',
    },
    calculatorDescription: {
      p1: '<strong>에너지 변환기</strong>는 다양한 에너지 단위 간의 정확한 변환을 제공하는 도구입니다. 줄(J), 킬로줄(kJ), 칼로리(cal), 킬로칼로리(kcal), 와트시(Wh), 킬로와트시(kWh), BTU 간의 환산을 빠르게 수행할 수 있으며, 과학·공학·의학·일상생활 전반에서 활용됩니다.',
      p2: '음식의 칼로리 계산, 가전제품의 전력 소비량 비교, 열량 설계, 연료 에너지 환산 등 다양한 상황에서 에너지 단위 변환이 필요합니다. 특히 전기요금과 식품 영양표시, 보일러 효율을 다룰 때 단위 혼선을 막는 데 유용합니다.',
      p3: '학생과 연구자에게는 열역학 학습 자료로, 설비·에너지 엔지니어와 영양사에게는 실무 도구로 활용됩니다. 정확한 에너지 환산은 비용 절감과 효율 개선의 첫걸음입니다.',
      note: '변환 계수는 국제 표준을 따릅니다. 1 kcal = 4,184 J, 1 Wh = 3,600 J, 1 kWh = 3.6 MJ, 1 BTU ≈ 1,055 J입니다. 식품 라벨의 \'Calorie\'(대문자 C)는 실제로 kcal(킬로칼로리)임을 주의하세요.',
    },
    glossary: [
      { term: '칼로리(Calorie vs cal)', desc: '식품 영양표시의 대문자 Calorie는 실제로 kcal(킬로칼로리)입니다. 열역학의 소문자 cal(4.184 J)과 1,000배 차이가 나므로 혼동하지 마세요.' },
      { term: '와트시(Wh)', desc: '전력(W)을 시간(h)만큼 사용한 에너지량으로, 1 Wh = 3,600 J입니다. 전기요금과 배터리 용량 산정의 기본 단위입니다.' },
      { term: 'BTU', desc: 'British Thermal Unit의 약자로, 1파운드의 물을 1°F 올리는 데 필요한 열량(약 1,055 J)입니다. 냉난방기 용량 표기에 쓰입니다.' },
    ],
    formulaTitle: '에너지 단위 변환 관계',
    formulaExample: '2 kWh를 kJ로 변환하면:',
    formulaResult: '2 kWh × 3,600 = 7,200 kJ',
    tips: {
      title1: '일상적인 에너지 비교',
      items1: ['사과 1개 약 95 kcal, 점심식사 600~800 kcal', '성인 남성 일일 권장 섭취량 2,000~2,500 kcal'],
      title2: '전력 소비 비교',
      items2: ['LED 전구(10 W, 8시간) 80 Wh', '에어컨(1 kW, 8시간) 8 kWh', '전기차 배터리 100 kWh로 약 400 km 주행'],
      title3: '연료 에너지 비교',
      items3: ['휘발유 1 L 약 8,900 kcal(약 37,000 kJ)', '경유 1 L 약 8,600 kcal, LPG 1 L 약 5,900 kcal'],
      title4: '칼로리 표기 주의',
      items4: ['식품의 Calorie(대문자)는 kcal입니다.', '열역학의 cal과 혼동하지 마세요.'],
      title5: '전기요금 환산',
      items5: ['kWh 단위 사용량에 요금단가를 곱해 요금을 계산합니다.', '대기전력도 kWh로 누적되므로 콘센트 차단이 효과적입니다.'],
      title6: 'BTU 활용',
      items6: ['냉난방기 용량은 BTU/h로 표시됩니다.', '1 BTU/h = 0.293 W이므로 단위를 통일해 비교하세요.'],
    },
  },
  powerConverter: {
    title: '출력 변환기',
    description: 'W, kW, MW, hp, BTU/h 단위 간 출력을 변환합니다.',
    inputLabel: '값:',
    inputPlaceholder: '예: 1',
    unitLabels: {
      W: '와트(W)',
      kW: '킬로와트(kW)',
      MW: '메가와트(MW)',
      hp: '마력(hp)',
      'BTU/h': 'BTU/h',
    },
    calculatorDescription: {
      p1: '<strong>출력 변환기</strong>는 다양한 동력·출력 단위 간의 정확한 변환을 제공하는 도구입니다. 와트(W), 킬로와트(kW), 메가와트(MW), 마력(hp), BTU/h 간의 환산을 빠르게 수행할 수 있으며, 전기공학·기계공학·HVAC(난방·환기·냉방) 등 광범위한 분야에서 활용됩니다.',
      p2: '전기 기기의 소비 전력, 엔진 출력, 냉방 용량, 발전 용량 등을 비교할 때 출력 단위 변환이 필요합니다. 특히 해외 제품 사양서의 마력(hp)과 국내 기준 kW를 오갈 때 유용하며, 설비 선정과 에너지 관리에 필수적입니다.',
      p3: '엔지니어와 설비 담당자에게는 설계 도구로, 소비자에게는 가전·차량 사양을 비교하는 도구로 활용됩니다. 정확한 출력 환산은 적정 용량 선정과 전력 비용 절감의 기초입니다.',
      note: '변환 계수는 국제 표준을 따릅니다. 1 kW = 1,000 W, 1 MW = 1,000 kW, 1 hp(메커니컬) = 745.7 W, 1 BTU/h = 0.293071 W입니다. 마력에는 메커니컬·전기·미터법 등 종류가 있으므로 기준을 확인하세요.',
    },
    glossary: [
      { term: '마력(hp) 종류', desc: '메커니컬 hp는 745.7 W, 전기 hp는 746 W, 미터법 hp(PS)는 735.5 W로 기준이 다릅니다. 문헌의 hp 종류를 먼저 확인하세요.' },
      { term: 'BTU/h', desc: 'BTU를 시간(h)으로 나눈 냉·난방 용량 단위입니다. 1 BTU/h = 0.293071 W이며 에어컨·보일러 사양에 주로 쓰입니다.' },
      { term: '역률(파워팩터)', desc: '교류 회로에서 유효 전력(W)과 겉보기 전력(VA)의 비율입니다. 입력 전력(kW) 산정 시 효율과 함께 고려해야 합니다.' },
    ],
    formulaTitle: '출력 단위 변환 관계',
    formulaExample: '150 hp를 kW로 변환하면:',
    formulaResult: '150 hp × 0.7457 = 111.86 kW',
    tips: {
      title1: '일상적인 전력 비교',
      items1: ['LED 전구 10~20 W, 선풍기 50~100 W', '에어컨 800~2,000 W, 전기차 모터 100~500 kW'],
      title2: '엔진 출력 비교',
      items2: ['소형차 80~120 hp, 스포츠카 300~1,000 hp', '트럭 엔진 300~600 hp, 제트 엔진 10,000 hp 이상'],
      title3: '냉방 용량',
      items3: ['냉방 용량은 주로 BTU/h로 표시됩니다.', '3평 방 약 5,000 BTU/h, 20평 아파트 20,000~30,000 BTU/h'],
      title4: '마력 종류 주의',
      items4: ['메커니컬 hp는 745.7 W, 전기 hp는 746 W입니다.', '문헌의 hp 기준을 먼저 확인하세요.'],
      title5: '설비 선정',
      items5: ['필요 출력에 여유(안전율)를 더해 모터를 선정하세요.', '역률과 효율을 고려해 입력 전력(kW)을 산정하세요.'],
      title6: '전력 비용',
      items6: ['kW는 순간 출력, kWh는 사용량(요금) 단위입니다.', '두 단위를 구분해 청구서를 이해하세요.'],
    },
  },
  currencyConverter: {
    title: '환율 변환기',
    description: 'USD, EUR, JPY, CNY, KRW, GBP 주요 통화 간 환율을 변환합니다.',
    inputLabel: '금액:',
    inputPlaceholder: '예: 1000',
    currencyNames: {
      USD: '미국 달러(USD)',
      EUR: '유로(EUR)',
      JPY: '일본 엔(JPY)',
      CNY: '위안(CNY)',
      KRW: '한국 원(KRW)',
      GBP: '영국 파운드(GBP)',
    },
    calculatorDescription: {
      p1: '<strong>환율 변환기</strong>는 세계 주요 통화 간의 환율을 빠르게 환산해 주는 실용적인 금융 도구입니다. 여행, 해외 쇼핑, 국제 송금, 투자 등 외국 화폐의 가치를 우리 돈이나 다른 통화로 바꿔야 할 때 언제 어디서든 편리하게 활용할 수 있습니다.',
      p2: '이 도구는 미국 달러(USD), 유로(EUR), 일본 엔(JPY), 중국 위안(CNY), 한국 원(KRW), 영국 파운드(GBP) 등 주요 6개 통화를 지원하며, 기준 통화를 선택하면 나머지 통화로의 환산 결과를 한눈에 보여줍니다. 금융 시장은 시시각각 변하므로 대략적인 기준 환율을 제공하여 빠른 가늠을 돕습니다.',
      p3: '환율은 수출입 기업의 원가, 해외 여행객의 예산, 글로벌 투자자의 수익률에 직결되는 핵심 지표입니다. 개인은 해외 결제 시 발생하는 수수료를 줄이기 위해, 기업은 외화 자산과 부채의 가치를 관리하기 위해 환율 정보를 일상적으로 활용합니다.',
      note: '환율은 매일 변동하며 은행이나 환전소마다 적용되는 매매기준율과 수수료가 다릅니다. 이 계산기는 학습과 대략적인 참고용이며, 실제 거래에는 반드시 거래 기관의 실시간 환율을 확인하시기 바랍니다.',
    },
    glossary: [
      { term: '환율', desc: '한 통화를 다른 통화로 바꾸는 비율로, 금리·무역수지·인플레이션 등에 따라 매일 변동합니다. 1 USD 기준 근사치를 사용해 빠른 가늠을 돕습니다.' },
      { term: '매매기준율', desc: '은행이 환전 시 기준으로 삼는 공식 환율입니다. 여기에 환전 수수료가 가산되어 실제 적용 환율(매도율·매수율)이 결정됩니다.' },
      { term: '매도율과 매수율', desc: '고객이 사는 환율(매도율)과 파는 환율(매수율)은 다릅니다. 양방향 환산 시 이 차이로 미세한 오차가 생기므로 실거래는 각각 확인하세요.' },
    ],
    formulaTitle: '환율 변환 공식',
    formulaExample: '100 USD를 한국 원으로 환산할 경우:',
    formulaResult: '100 USD × (1,380 KRW / 1 USD) = 138,000 KRW',
    tips: {
      title1: '환전 수수료 이해하기',
      items1: ['은행과 환전소는 매매기준율에 환전 수수료를 포함한 환율을 적용합니다.', '인터넷 뱅킹이나 모바일 앱 환전이 영업점 방문보다 일반적으로 유리합니다.', '공항 환전소는 수수료가 높은 편이므로 가급적 피하는 것이 좋습니다.'],
      title2: '여행 시 환전 팁',
      items2: ['출발 전 미리 환전하면 급한 상황보다 유리한 환율을 적용받을 수 있습니다.', '신용카드 해외 결제 시 1~3%의 수수료가 붙으므로 현금과 적절히 혼용하세요.', '남은 외화는 귀국 후 재환전하거나 다음 여행에 대비해 보관하세요.'],
      title3: '환율에 영향을 주는 요인',
      items3: ['중앙은행의 금리 결정이 환율에 가장 큰 영향을 미칩니다.', '수출입 무역수지와 자본 이동이 통화 가치를 좌우합니다.', '양국의 인플레이션율 차이도 환율에 반영됩니다.'],
      title4: '역환율 주의',
      items4: ['같은 두 통화를 양방향으로 환산하면 수수료 차이로 미세한 오차가 생깁니다.', '정확한 거래에는 거래 기관의 매도율과 매수율을 각각 확인하세요.'],
      title5: '고액 송금 시 유의사항',
      items5: ['중개 은행이 여러 곳을 거치면 추가 수수료가 발생할 수 있습니다.', '송금 목적과 출처를 증빙할 서류를 미리 준비해 두는 것이 좋습니다.'],
      title6: '투자와 환율',
      items6: ['외화 자산은 환율 변동에 따라 원화 환산 수익이 커지거나 줄어듭니다.', '해외 주식이나 펀드에 투자할 때 환헤지 상품 여부를 꼼꼼히 비교하세요.'],
    },
  },
  timezoneConverter: {
    title: '시간대 변환기',
    description: '전 세계 주요 시간대 간의 시간을 변환합니다.',
    inputLabel: '날짜/시간:',
    baseTimezoneLabel: '기준 시간대:',
    timezoneNames: {
      UTC: 'UTC',
      'US-Eastern': '미국 동부(EST/EDT)',
      'US-Pacific': '미국 서부(PST/PDT)',
      'Europe-London': '유럽 런던(GMT/BST)',
      'Asia-Tokyo': '아시아 도쿄(JST)',
      'Asia-Seoul': '아시아 서울(KST)',
      'Asia-Shanghai': '아시아 상하이(CST)',
    },
    calculatorDescription: {
      p1: '<strong>시간대 변환기</strong>는 전 세계 주요 시간대 간의 시간 변환을 제공하는 필수적인 도구입니다. UTC, 미국 동부/서부, 유럽 런던, 아시아 도쿄/서울/상하이 시간대를 지원하며, 날짜와 시간을 입력하면 다른 시간대로의 변환 결과를 즉시 확인할 수 있습니다.',
      p2: '국제 비즈니스 미팅, 해외 여행, 원격 근무, 온라인 게임 등에서 시간대 변환이 필요할 때 활용할 수 있습니다. 특히 여러 국가에 흩어진 팀원들과의 협업 시 회의 시간을 조율하는 데 필수적인 도구입니다.',
      p3: '이 변환기는 각 시간대의 UTC 오프셋을 기반으로 정확한 변환을 수행합니다. 시간대 선택 후 날짜와 시간을 입력하면 선택한 모든 시간대에서의 해당 시간을 동시에 보여주어, 어떤 시간대가 적절한지 한눈에 파악할 수 있습니다.',
      note: '이 도구는 표준 시간대 오프셋을 기반으로 합니다. 서머타임(DST)은 자동으로 적용되지 않으며, 필요 시 수동으로 오프셋을 조정해야 합니다.',
    },
    glossary: [
      { term: 'UTC', desc: '협정 세계시(Coordinated Universal Time)로, 경도 0도(런던 근처)를 기준으로 한 국제 표준 시간입니다. 각 시간대는 UTC로부터의 오프셋(예: KST = UTC+9)으로 표현됩니다.' },
      { term: '서머타임(DST)', desc: '여름철에 시계를 1시간 앞당기는 제도로, 미국·유럽 등은 보통 3월~11월에 적용됩니다. 한국·일본은 시행하지 않으며, 본 변환기는 자동 적용되지 않습니다.' },
      { term: 'UTC 오프셋', desc: '특정 시간대가 UTC보다 몇 시간 빠르거나 느린지를 나타내는 값입니다. 오프셋 차이만큼 시간을 더하거나 빼서 변환합니다.' },
    ],
    formulaTitle: '시간대 변환 공식',
    formulaExample: 'UTC 10:00을 다른 시간대로 변환하면:',
    formulaResult: '서울(UTC+9): 19:00, 뉴욕(UTC-5): 05:00, 런던(UTC+0): 10:00',
    tips: {
      title1: '핵심 개념',
      items1: ['서머타임(DST): 많은 국가에서는 여름철에 시계를 1시간 앞당깁니다(미국·유럽: 3월~11월). 한국과 일본은 시행하지 않습니다.', '국제 회의 시간은 보통 UTC를 기준으로 정합니다.'],
      title2: '활용 사례',
      items2: ['국제 비즈니스: 여러 시간대에 걸친 팀 미팅 시간 조율', '여행: 출발지와 도착지의 시간 차이 사전 확인', '금융: 뉴욕, 런던, 도쿄 증시 거래 시간 확인', '온라인 게임: 글로벌 서버 이벤트 시간 확인'],
    },
  },
  bmiCalculator: {
    inputs: {
      height: '키 (cm)',
      weight: '체중 (kg)',
    },
    placeholders: {
      height: '예: 175',
      weight: '예: 70',
    },
    calculate: '계산하기',
    reset: '초기화',
    results: {
      bmi: '체질량 지수 (BMI)',
      status: '상태',
      standardTable: 'BMI 기준표',
    },
    status: {
      underweight: '저체중',
      normal: '정상',
      overweight: '과체중',
      obese: '비만',
      severelyObese: '고도비만',
    },
    standardTableRows: {
      underweight: '저체중: 18.5 미만',
      normal: '정상: 18.5 ~ 24.9',
      overweight: '과체중: 25 ~ 29.9',
      obese: '비만: 30 ~ 34.9',
      severelyObese: '고도비만: 35 이상',
    },
    error: '키와 체중을 정확히 입력해주세요.',
  },
  bmrCalculator: {
    inputs: {
      gender: '성별',
      age: '나이 (세)',
      height: '키 (cm)',
      weight: '체중 (kg)',
    },
    genderOptions: {
      male: '남성',
      female: '여성',
    },
    placeholders: {
      age: '예: 30',
      height: '예: 175',
      weight: '예: 70',
    },
    calculate: '계산하기',
    reset: '초기화',
    results: {
      bmr: '기초대사량 (BMR)',
      tdeeTitle: '활동 수준별 일일 에너지 소비량 (TDEE)',
    },
    activityLevels: {
      sedentary: '좌식 생활 (운동 없음)',
      light: '가벼운 활동 (주 1-3일)',
      moderate: '보통 활동 (주 3-5일)',
      active: '적극적 활동 (주 6-7일)',
      veryActive: '매우 적극적 (매일 2회+)',
    },
    error: '모든 값을 정확히 입력해주세요.',
  },
  weightLoss: {
    inputs: {
      currentWeight: '현재 체중 (kg)',
      targetWeight: '목표 체중 (kg)',
      height: '신장 (cm)',
      age: '나이',
      gender: '성별',
      activityLevel: '활동 수준',
    },
    genderOptions: {
      male: '남성',
      female: '여성',
    },
    activityOptions: {
      sedentary: '거의 운동 안함',
      light: '가벼운 활동 (주 1-3일)',
      moderate: '보통 활동 (주 3-5일)',
      active: '적극적인 활동 (주 6-7일)',
      veryActive: '매우 적극적인 활동 (매일 2회 이상)',
    },
    placeholders: {
      currentWeight: '예: 70',
      targetWeight: '예: 65',
      height: '예: 175',
      age: '예: 30',
    },
    calculate: '계산하기',
    reset: '초기화',
    results: {
      dailyCalories: '체중 감량을 위한 일일 권장 칼로리',
      timeToGoal: '목표 체중 도달까지 예상 시간',
      targetDate: '예상 목표 달성일',
    },
    error: '모든 값을 정확히 입력해주세요.',
  },
  koreanAge: {
    inputs: {
      calculationMethod: '계산 방식',
      birthDate: '출생일',
      currentYear: '현재 연도',
      birthYear: '출생 연도',
      birthdayPassed: '생일 지남',
      currentAge: '현재 나이',
    },
    calculationMethods: {
      birthDate: '출생일로 계산',
      birthYear: '출생 연도로 계산',
      currentAge: '현재 나이로 계산',
    },
    birthdayOptions: {
      yes: '예',
      no: '아니오',
    },
    placeholders: {
      calculationMethod: '계산 방식 선택',
      birthday: '올해 생일이 지났나요?',
      currentAge: '만 나이',
    },
    calculate: '계산',
    results: {
      koreanAge: '한국 나이',
      koreanAgeDesc: '(출생 시 1세, 매년 1월 1일 +1세)',
      internationalAge: '만 나이',
      internationalAgeDesc: '(생일 기준, 국제 표준)',
      yearAge: '연 나이',
      yearAgeDesc: '(연도 차이만 계산)',
      zodiac: '띠',
      zodiacDesc: '(12간지)',
      daysLived: '살아온 일수',
      nextBirthday: '다음 생일',
      daysUntilNext: '일 남음',
      adultStatus: '성인 여부',
      adult: '성인',
      minor: '미성년자',
      canVote: '투표 가능',
      canDrink: '음주 가능',
      possible: '가능',
      impossible: '불가능',
    },
    calculateHint: '계산하기 버튼을 눌러주세요',
  },
  dateDifference: {
    inputs: {
      startDate: '시작일',
      endDate: '종료일',
      includeStartDate: '초일 산입',
    },
    placeholders: {
      startDate: '시작일 선택',
      endDate: '종료일 선택',
    },
    calculate: '계산',
    reset: '초기화',
    results: {
      title: '날짜차이 계산결과',
      period: '총 기간',
      totalDays: '총 일수',
    },
  },
  anniversary: {
    tabs: {
      wedding: '결혼기념일',
      relationship: '사귄날',
      other: '기타',
    },
    inputs: {
      date: '날짜',
      todayDate: '오늘 날짜',
    },
    calculate: '계산하기',
    reset: '초기화',
    results: {
      nextAnniversary: '다음 기념일',
      daysUntilNext: '다음 기념일까지',
      timeSpent: '함께한 시간',
      years: '년',
      months: '개월',
      days: '일',
      totalYears: '햇수',
      totalMonths: '개월수',
      totalWeeks: '주수',
      totalDays: '일수',
    },
  },
  discountCalculator: {
    title: '할인율 계산기',
    description: '할인 금액과 최종 가격을 빠르게 계산하거나, 결제 금액으로 할인율을 역산합니다.',
    inputs: {
      calculationMode: '계산 방식',
      calculateDiscount: '할인가 계산',
      reverseDiscountRate: '할인율 역산',
      originalPrice: '원가 (원)',
      discountRate: '할인율 (%)',
      salePrice: '입력가격 (원)',
      calculate: '계산하기',
      reset: '초기화',
    },
    placeholders: {
      originalPrice: '예: 50000',
      discountRate: '예: 20',
      salePrice: '예: 40000',
    },
    alerts: {
      invalidForward: '원가와 할인율을 정확히 입력해주세요.',
      invalidReverse: '원가와 입력가격을 정확히 입력해주세요.',
      saleTooHigh: '입력가격은 원가보다 작거나 같아야 합니다.',
    },
    results: {
      discountAmount: '할인 금액',
      salePrice: '할인가격',
      discountRate: '할인율',
      discountSuffix: '할인',
    },
    descriptionContent: {
      heading: '할인 금액과 최종 가격을 빠르게 계산하세요!',
      p1: '쇼핑이나 프로모션에서 할인율을 보고 실제 절약하는 금액과 최종 결제 금액을 바로 알기 어려울 때가 많습니다. 특히 세일 기간이나 복잡한 할인 조건이 적용될 때 정확한 지출을 예측하기란 쉽지 않습니다.',
      p2: '본 계산기는 두 가지 모드를 지원합니다. \'할인가 계산\' 모드는 원가와 할인율을 입력하면 절약 금액과 최종 결제 금액을 보여주고, \'할인율 역산\' 모드는 원가와 실제 결제 금액을 입력하면 몇 퍼센트 할인을 받은 것인지 역으로 계산해 줍니다.',
      p3: '자영업자, 쇼핑몰 운영자, 마케팅 담당자뿐만 아니라 일반 소비자 누구나 할인 조건을 빠르게 분석하고 현명한 소비를 할 수 있는 유용한 도구입니다.',
    },
    glossary: [
      { term: '할인율 (%)', desc: '원가에서 얼마나 할인되는지를 백분율로 나타낸 값입니다. 할인 금액은 원가에 (할인율 ÷ 100)을 곱해 구합니다.' },
      { term: '부가세 (VAT)', desc: '재화나 서비스의 거래 단계마다 부과되는 간접세입니다. 표시 가격이 부가세 포함인지 여부에 따라 실제 결제 금액이 달라질 수 있어 확인이 필요합니다.' },
    ],
    formula: {
      heading: '할인 계산 공식과 단계별 설명',
      step1Title: '1. 할인 금액 및 최종 가격 계산',
      step1Desc: '원가에서 할인율에 해당하는 금액을 차감하여 최종 가격을 산출합니다.',
      step1Formula1: '할인 금액 = 원가 × (할인율 ÷ 100)',
      step1Formula2: '최종 가격 = 원가 - 할인 금액',
      step1Example: '예시: 50,000원 상품을 20% 할인받으면 → 할인 금액 = 50,000 × 0.2 = 10,000원 → 최종 = 40,000원',
      step2Title: '2. 할인율 역산 공식',
      step2Desc: '실제 결제 금액과 원가의 차이를 원가로 나누어 할인 비율을 구합니다.',
      step2Formula: '할인율(%) = (원가 - 결제금액) ÷ 원가 × 100',
      step2Example: '예시: 50,000원 상품을 40,000원에 구매 → (50,000 - 40,000) ÷ 50,000 × 100 = 20% 할인',
    },
    tips: {
      heading: '💡 할인 계산 활용 핵심 팁',
      items: [
        { title: '1. 할인 중복 적용은 단순 합산이 아닙니다', desc: '"30% 할인 후 20% 추가 할인"은 총 44% 할인 효과가 있습니다 (1 - 0.7 × 0.8 = 0.44). 단순히 50%로 생각하면 실제 할인율보다 과대 계산하게 됩니다.' },
        { title: '2. 적용 순서에 따라 최종 가격이 달라집니다', desc: '카드사 할인, 쿠폰, 포인트 적립 등 다양한 할인이 중복될 때 적용 순서에 따라 최종 금액이 달라질 수 있으므로 가장 유리한 순서를 미리 비교해 보세요.' },
        { title: '3. 가격 인상 후 할인 여부를 확인하세요', desc: '가격을 올린 뒤 할인하는 \'허위 할인\' 사례가 있으므로, 평소 관심 상품의 가격을 미리 파악해 두면 진짜 할인 혜택을 누릴 수 있습니다.' },
        { title: '4. 역산 모드로 쿠폰 효율을 비교하세요', desc: '여러 쿠폰 중 어떤 것이 가장 많은 할인을 제공하는지 역산 모드를 활용하면 실질적으로 가장 이득인 쿠폰을 선택할 수 있습니다.' },
        { title: '5. 대량 구매 시 총 절약액도 확인하세요', desc: '개당 할인액에 수량을 곱하면 총 절약액을 알 수 있어 예산 관리에 도움이 됩니다.' },
        { title: '6. 부가세 포함 금액을 기준으로 계산하세요', desc: '할인가 계산 시 부가세 포함 여부에 따라 최종 금액이 달라질 수 있으므로, 표시된 가격이 부가세 포함인지 여부를 반드시 확인하세요.' },
        { title: '7. 환불 금액도 미리 확인하세요', desc: '할인받은 상품을 환불할 때 어떤 금액이 반환되는지 미리 계산해 보면 예기치 못한 손실을 예방하는 데 도움이 됩니다.' },
      ],
    },
  },
  countdownTimer: {
    title: '카운트다운 타이머',
    description: '시간을 설정하고 카운트다운을 시작합니다.',
    inputs: {
      hours: '시간',
      minutes: '분',
      seconds: '초',
      start: '시작',
      resume: '계속',
      pause: '일시정지',
      reset: '초기화',
    },
    results: {
      timeUp: '시간이 종료되었습니다!',
      setDuration: '설정 시간',
      timeRemaining: '남은 시간',
      elapsed: '경과',
    },
    descriptionContent: {
      heading: '시간을 설정하고 카운트다운으로 효율적으로 시간을 관리하세요!',
      p1: '카운트다운 타이머는 특정 시간만큼 시간을 재고 경과를 시각적으로 보여주는 실용적인 도구입니다. 운동, 공부, 요리, 발표 등 다양한 활동에서 시간을 효율적으로 관리할 수 있으며, 시간 종료 시 알림 소리로 알려줍니다.',
      p2: '시, 분, 초 단위로 자유롭게 시간을 설정할 수 있고, 진행 상황은 프로그레스 바로 직관적으로 확인할 수 있습니다. 남은 시간이 10초 이하로 줄어들면 색상이 변경되어 긴장감 있는 마무리를 도와줍니다.',
      p3: '포모도로 기법 실천, 운동 인터벌 트레이닝, 요리 타이밍, 발표 시간 관리 등 시간이 중요한 모든 상황에서 유용하게 활용할 수 있습니다.',
    },
    glossary: [
      { term: 'D-day', desc: '중요한 목표 날짜를 기준점(0일)으로 삼아, 그날까지 남은 날짜를 세는 카운트다운 개념입니다.' },
    ],
    formula: {
      heading: '타이머 동작 원리',
      principle: '1초마다 남은 시간을 1씩 감소시키며, 0이 되면 타이머를 종료하고 알림을 발생시킵니다.',
      alarm: '알림 소리 생성',
      alarmDesc: 'Web Audio API의 Oscillator를 사용하여 주파수와 지속 시간을 조절하여 알림 소리를 생성합니다.',
      progress: '진행률 계산',
      progressFormula: '진행률(%) = (설정 시간 - 남은 시간) / 설정 시간 × 100',
    },
    tips: {
      heading: '타이머 활용 핵심 팁',
      items: [
        { title: '포모도로 기법', desc: '25분 집중 후 5분 휴식하는 학습/업무 방식으로, 4세트 후 15~30분 긴 휴식을 취합니다.' },
        { title: '운동 인터벌', desc: '플랭크, 버피, 스쿼트 등 시간 기반 운동에서 정확한 시간 관리가 가능합니다.' },
        { title: '요리 타이밍', desc: '파스타 삶기, 오븐 조리 등 정확한 조리 시간을 재는 데 편리합니다.' },
        { title: '발표 시간 관리', desc: '발표 시간을 준수하기 위해 타이머를 설정하면 체계적인 진행이 가능합니다.' },
        { title: '퀴즈/게임', desc: '퀴즈 시간 제한, 퍼즐 게임 등에서 긴장감 넘치는 시간 제한을 만들 수 있습니다.' },
        { title: '명상/요가', desc: '명상 시간을 정확히 재고 꾸준히 연습하는 데 도움이 됩니다.' },
      ],
    },
  },
  coinFlip: {
    title: '동전 던지기',
    description: '랜덤으로 앞면 또는 뒷면을 결정합니다.',
    inputs: {
      flipping: '던지는 중...',
      flipCoin: '동전 던지기',
      reset: '초기화',
    },
    results: {
      flipping: '던지는 중...',
      heads: '앞면 (Heads)',
      tails: '뒷면 (Tails)',
      clickToFlip: '동전을 클릭하여 던지세요',
      headsCount: '앞면',
      totalFlips: '총 횟수',
      tailsCount: '뒷면',
      flips: '던짐',
      recentHistory: '최근 기록 (최신순):',
      headsTailsRatio: '앞면/뒷면 비율:',
      headsPercent: '앞면',
      tailsPercent: '뒷면',
    },
    descriptionContent: {
      heading: '가상 동전 던지기로 공정한 의사결정을 하세요!',
      p1: '동전 던지기는 가장 단순하면서도 공정한 의사결정 도구로, 각 결과가 50%의 확률로 발생합니다. 컴퓨터 알고리즘을 통해 앞면과 뒷면이 동일한 확률로 나오도록 설계되어 있어 두 가지 선택지 중 하나를 공정하게 결정해야 할 때 유용합니다.',
      p2: '여러 번 던진 결과를 기록하고 통계를 분석하면 확률과 통계의 기본 개념을 직관적으로 이해할 수 있어 교육적인 목적에도 활용할 수 있습니다.',
      p3: '게임의 순서 정하기, 간단한 결정, 확률 학습, 교육용 시뮬레이션 등 다양한 상황에서 가볍게 사용할 수 있는 만능 의사결정 도구입니다.',
    },
    formula: {
      heading: '확률의 법칙 (대수의 법칙)',
      desc: '동전 던지기는 이산 확률 분포의 가장 기본적인 예시입니다.',
      formula: 'P(앞면) = P(뒷면) = 0.5 (50%)',
      lawOfLargeNumbers: '대수의 법칙에 따르면, 던지는 횟수가 늘어날수록 앞면과 뒷면의 비율은 50:50에 수렴합니다. 예를 들어 1000번 던지면 앞면이 약 480~520번 사이로 나오는 경향이 있습니다.',
      randomGeneration: '랜덤 생성 방식',
      randomDesc: 'JavaScript의 Math.random() 함수를 사용하여 0~1 사이의 균일 분포 난수를 생성하고, 0.5 미만이면 앞면, 이상이면 뒷면으로 판정합니다.',
    },
    tips: {
      heading: '동전 던지기 활용 팁',
      items: [
        { title: '공정한 의사결정', desc: '두 선택지 사이에서 공정하게 결정해야 할 때 활용합니다.' },
        { title: '순서 정하기', desc: '게임이나 활동의 시작 순서를 정할 때 편리합니다.' },
        { title: '확률 학습', desc: '자녀에게 확률의 기본 개념을 가르칠 때 체험형 학습 도구로 활용할 수 있습니다.' },
        { title: '여러 번 던지기', desc: '한 번만으로는 불공평할 수 있으므로 3번이나 5번 중多数결로 결정하면 더 공정합니다.' },
        { title: '기록 관리', desc: '던진 결과를 기록하면 대수의 법칙을 직접 체험할 수 있습니다.' },
      ],
    },
  },
  virtualDice: {
    title: '가상 주사위',
    description: '랜덤으로 주사위를 굴립니다. 1~4개까지 지원합니다.',
    inputs: {
      diceCount: '주사위 개수:',
      rolling: '굴리는 중...',
      rollDice: '주사위 굴리기',
      reset: '초기화',
    },
    results: {
      sum: '합계',
      totalRolls: '총 굴린 횟수',
      cumulativeSum: '누적 합계',
      recentHistory: '최근 기록 (최신순):',
      average: '평균',
      theoreticalAverage: '이론적 평균',
      perDice: '1개당',
    },
    descriptionContent: {
      heading: '가상 주사위로 랜덤 숫자를 즉시 생성하세요!',
      p1: '가상 주사위는 실제 주사위 없이도 1부터 6까지의 랜덤 숫자를 생성할 수 있는 편리한 도구입니다. 1개에서 4개까지의 주사위를 동시에 굴릴 수 있어 다양한 게임과 활동에 활용할 수 있습니다.',
      p2: '주사위 야구, 보드게임, TRPG(테이블 롤플레잉 게임), 교육용 확률 시뮬레이션 등 다양한 상황에서 실제 주사위를 대체할 수 있으며, 굴린 결과의 합계와 평균, 이론적 평균값도 함께 보여줍니다.',
      p3: '주사위를 한 번 굴릴 때마다 애니메이션과 함께 결과가 표시되어 실제 주사위를 굴리는 듯한 재미를 느낄 수 있으며, 최근 10회 기록을 관리하여 확률 분석에도 활용할 수 있습니다.',
    },
    formula: {
      heading: '주사위 확률',
      formula: 'P(각 면) = 1/6 ≈ 16.67%',
      desc: '공정한 6면체 주사위에서 각 면이 나올 확률은 동일하며, n개의 주사위를 굴렸을 때의 합계는 이산 균일 분포의 합으로 나타납니다.',
      expectedValue: '기대값 (Expected Value)',
      expectedFormula: 'E(합계) = n × 3.5',
      expectedDesc: '여기서 n은 주사위의 개수입니다. 1개의 주사위를 100번 굴렸다면 합계는 약 350에 수렴합니다.',
    },
    tips: {
      heading: '주사위 활용 팁',
      items: [
        { title: '부루마블/보드게임', desc: '실제 주사위 없이도 보드게임을 즐길 수 있습니다.' },
        { title: 'TRPG', desc: 'D&D 등 테이블 롤플레잉 게임에서 주사위 굴림 대용으로 사용할 수 있습니다.' },
        { title: '교육용 시뮬레이션', desc: '확률과 통계 개념을 학생들에게 직관적으로 설명하는 데 활용하세요.' },
        { title: '회의 순서 정하기', desc: '여러 명이 있을 때 공정하고 재미있게 순서를 정할 수 있습니다.' },
        { title: '여러 개 주사위 사용', desc: '2개 이상의 주사위를 사용하면 합계의 분포가 정규 분포에 가까워져 평균값(3.5×n) 주변으로 결과가 집중됩니다.' },
      ],
    },
  },
  passwordGenerator: {
    title: '비밀번호 생성기',
    description: '강력한 랜덤 비밀번호를 생성합니다.',
    inputs: {
      length: '길이',
      uppercase: '대문자 (A-Z)',
      lowercase: '소문자 (a-z)',
      numbers: '숫자 (0-9)',
      symbols: '기호 (!@#$%)',
      generate: '비밀번호 생성',
      reset: '초기화',
    },
    results: {
      copied: '복사됨!',
      copy: '복사',
      strength: '비밀번호 강도',
      charCount: '글자 수',
      selectedTypes: '선택된 문자 유형',
      emptyMessage: '비밀번호 생성 버튼을 눌러주세요',
      selectCharset: '문자 집합을 선택해주세요',
    },
    strengthLevels: {
      weak: '약함',
      medium: '보통',
      strong: '강함',
      veryStrong: '매우 강함',
    },
    descriptionContent: {
      heading: '강력하고 안전한 랜덤 비밀번호를 즉시 생성하세요!',
      p1: '비밀번호 생성기는 대문자, 소문자, 숫자, 특수문자 조합과 길이 설정을 통해 해킹이나 무차별 대입 공격으로부터 안전한 비밀번호를 손쉽게 만들어주는 필수 보안 도구입니다.',
      p2: '브라우저의 Web Crypto API를 사용하여 cryptographically secure한 랜덤 값을 생성하므로 예측이 불가능한 고품질의 비밀번호를 제공합니다.',
      p3: '웹사이트, 이메일, 은행 업무 등 온라인에서 여러 계정을 관리하는 모든 사용자에게 매번 다른 강력한 비밀번호를 생성하여 보안을 강화하는 데 유용합니다.',
    },
    formula: {
      heading: '랜덤 비밀번호 생성 원리',
      desc: '사용자가 선택한 문자 집합에서 지정된 길이만큼 무작위로 문자를 선택하여 비밀번호를 생성합니다.',
      code: 'crypto.getRandomValues(new Uint32Array(length))',
      cryptoDesc: 'Web Crypto API의 crypto.getRandomValues()를 사용하여 cryptographically secure한 난수를 생성합니다.',
      strengthCalc: '비밀번호 강도 계산',
      strengthDesc: '비밀번호 길이, 문자 유형 수(대문자, 소문자, 숫자, 기호), 조합 다양성을 종합적으로 분석하여 4단계로 판정합니다.',
    },
    tips: {
      heading: '비밀번호 보안 핵심 팁',
      items: [
        { title: '최소 12자 이상 사용하세요', desc: '8자 이하의 비밀번호는 무차별 대입 공격에 취약합니다.' },
        { title: '대문자, 소문자, 숫자, 특수문자를 모두 조합하세요', desc: '문자 유형이 많을수록 브루트포스 공격 시간이 기하급수적으로 증가합니다.' },
        { title: '개인정보를 포함하지 마세요', desc: '생년월일, 이름, 전화번호 등 공개된 정보는 비밀번호에 절대 넣지 마세요.' },
        { title: '각 사이트마다 다른 비밀번호를 사용하세요', desc: '하나가 유출되더라도 다른 계정까지 연쇄 피해를 막을 수 있습니다.' },
        { title: '비밀번호 관리자를 활용하세요', desc: '여러 비밀번호를 안전하게 관리하고 자동 입력해 주는 비밀번호 관리자가 가장 안전합니다.' },
        { title: '2단계 인증(2FA)을 활성화하세요', desc: '비밀번호 외에 추가 인증 수단을 설정하면 보안이 크게 강화됩니다.' },
        { title: '정기적으로 변경하세요', desc: '주요 계정의 비밀번호는 3~6개월마다 변경하는 것이 좋습니다.' },
      ],
    },
  },
  colorPicker: {
    title: '컬러 피커',
    description: '색상 코드를 확인하고 다양한 포맷으로 변환합니다.',
    inputs: {
      hex: 'HEX',
      randomColor: '랜덤 색상',
      reset: '초기화',
    },
    results: {
      hex: 'HEX',
      rgb: 'RGB',
      hsl: 'HSL',
      copied: '복사됨!',
      copy: '복사',
      invalidHex: '유효한 HEX 색상 코드를 입력해주세요',
    },
    descriptionContent: {
      heading: 'HEX, RGB, HSL 색상 코드를 자유롭게 변환하고 미리보세요!',
      p1: '컬러 피커는 웹 개발, 그래픽 디자인, UI/UX 디자인 등에서 색상을 정확하게 선택하고 다양한 포맷으로 변환하여 활용할 수 있는 필수 도구입니다.',
      p2: 'HEX(#RRGGBB), RGB(레드, 그린, 블루), HSL(색상, 채도, 명도) 세 가지 주요 색상 포맷을 실시간으로相互変換하고 색상 미리보기를 통해 결과를 즉시 확인할 수 있습니다.',
      p3: '웹사이트 디자인 시 브랜드 색상을 정확하게 설정하거나, 디자인 작업 중 일관된 색상 팔레트를 관리할 때, 또는 색상 코드를 모르는 상황에서 원하는 색상을 탐색할 때 유용하게 활용할 수 있습니다.',
    },
    formula: {
      heading: '색상 코드 변환 공식',
      hexToRgb: 'HEX to RGB 변환',
      hexToRgbDesc: '16진수 2자리를 10진수로 변환합니다.',
      rgbToHsl: 'RGB to HSL 변환',
      rgbToHslDesc: 'RGB 값을 기반으로 색상(H), 채도(S), 명도(L)를 계산합니다.',
    },
    tips: {
      heading: '색상 코드 활용 팁',
      items: [
        { title: 'HEX 코드', desc: '웹 개발에서 가장 많이 사용되는 형식(#RRGGBB)으로, CSS에서 직접 입력할 수 있습니다.' },
        { title: 'RGB', desc: '화면 표시에 적합하며, 투명도를 추가할 때 RGBA를 사용합니다.' },
        { title: 'HSL', desc: '색상 조정 시 직관적이며, 밝기와 채도를 쉽게 변경 가능하여 디자인 작업에 편리합니다.' },
        { title: '접근성(WCAG)', desc: '텍스트와 배경색의 대비율을 4.5:1 이상 유지하면 시각장애인도 읽기 쉬운 웹사이트를 만들 수 있습니다.' },
        { title: 'CSS 변수 활용', desc: '프로젝트 전체에서 사용할 색상을 CSS 변수로 관리하면 유지보수가 편리합니다.' },
        { title: '팔레트 생성', desc: '메인 색상을 기반으로 유사색, 보색 등을 조합하면 조화로운 색상 구성이 가능합니다.' },
        { title: '다크모드 고려', desc: '라이트모드와 다크모드 모두에서 잘 보이는 색상을 선택하는 것이 좋습니다.' },
      ],
    },
  },
  typingSpeed: {
    title: '타이핑 속도 테스트',
    description: '타이핑 속도와 정확도를 측정합니다.',
    startButton: '테스트 시작',
    startPrompt: '테스트 시작 버튼을 눌러주세요',
    testInProgress: '진행 중...',
    typingPrompt: '여기에 텍스트를 입력하세요...',
    testComplete: '테스트 완료!',
    charInput: '{current} / {total} 자 입력',
    retake: '다시 하기',
    wpmLabel: '타이핑 속도 (WPM)',
    wpmUnit: '분당 단어 수',
    accuracyLabel: '정확도',
    accuracyUnit: '글자 정확도',
    elapsedTime: '소요 시간',
    totalChars: '총 글자',
    correctChars: '정확한 글자',
    speedRating: '속도 평가:',
    veryFast: '매우 빠릅니다! 전문가 수준이에요.',
    fast: '빠른 편이에요. 좋은 실력입니다.',
    average: '보통 수준이에요. 꾸준히 연습하면 더 빨라질 거예요.',
    slow: '연습이 필요해요. 꾸준히 연습하면 실력이 향상됩니다.',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          타이핑 속도와 정확도를 측정하여 실력을 객관적으로 평가하세요!
        </p>
        <p>
          타이핑 속도 테스트는 분당 타이핑하는 단어 수(WPM)와 정확도를 실시간으로 측정하는 도구입니다.
          랜덤으로 제공되는 한국어 문장을 보고 직접 타이핑하여 자신의 타이핑 실력을 객관적으로 평가하고 개선할 수 있습니다.
        </p>
        <p>
          타이핑이 시작되면 첫 글자를 입력한 시점부터 타이머가 가동되어 경과 시간, 정확한 글자 수, WPM을 계산합니다.
          각 글자는 올바르게 입력되면 초록색으로, 틀리면 빨간색으로 표시되어 즉시 피드백을 받을 수 있습니다.
        </p>
        <p>
          사무직 종사자, 프로그래머, 작가, 학생 등 타이핑 능력이 중요한 모든 분들이
          자신의 타이핑 실력을 객관적으로 측정하고 꾸준히 향상시키는 데 활용할 수 있습니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">WPM (Words Per Minute)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">분당 입력한 단어 수를 의미하는 타이핑 속도 단위입니다. 보통 1단어를 5글자로 환산하여 계산합니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">CPM (Characters Per Minute)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">분당 입력한 문자(글자) 수를 의미하며, WPM에 5를 곱한 값과 대략 일치합니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">WPM (Words Per Minute) 계산</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">WPM = (입력한 단어 수) / (경과 시간(분))</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            일반적으로 1단어 = 5글자로 가정하며, 타이핑한 총 글자 수를 5로 나누어 단어 수를 계산합니다.
            예를 들어 60초 동안 200글자를 입력하면 WPM = (200/5) / 1 = 40WPM이 됩니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">정확도 계산</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">정확도(%) = (정확한 글자 수 / 전체 글자 수) × 100</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            원본 텍스트와 사용자 입력을 글자 단위로 비교하여 일치하는 글자의 비율을 계산합니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">속도 등급 기준</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li><strong>60 WPM 이상:</strong> 매우 빠름 (전문가 수준)</li>
            <li><strong>40~59 WPM:</strong> 빠름 (우수한 실력)</li>
            <li><strong>20~39 WPM:</strong> 보통 (일반적인 수준)</li>
            <li><strong>20 WPM 미만:</strong> 초보 (연습 필요)</li>
          </ul>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">타이핑 실력 향상 핵심 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>정확성 우선:</strong> 처음에는 속도보다 정확한 타이핑에 집중하세요. 정확도가 높아지면 자연히 속도도 향상됩니다.</li>
            <li><strong>홈 키 위치:</strong> 왼손은 'ㅁF', 오른손은 'ㅗJ'를 기준으로 손가락 위치를 잡고 기본 자세를 유지하세요.</li>
            <li><strong>올바른 자세:</strong> 등과 어깨를 펴고 팔꿈치를 90도로 구부리며, 손목이 바닥에 닿지 않도록 주의하세요.</li>
            <li><strong>눈은 화면으로:</strong> 키보드를 보지 않고 화면을 보며 타이핑하는 연습(터치 타이핑)을 하면 속도가 크게 향상됩니다.</li>
            <li><strong>꾸준한 연습:</strong> 매일 10~15분씩 꾸준히 연습하면 한 달 내에 눈에 띄는 실력 향상을 경험할 수 있습니다.</li>
            <li><strong>자주 틀리는 글자 집중 공략:</strong> 틀린 글자를 기록하여 특정 글자에 대한 근육 기억을 키우는 것이 효과적입니다.</li>
          </ul>
        </div>
      </div>
    `,
  },
  textDifference: {
    title: '텍스트 비교',
    description: '두 텍스트의 차이점을 비교합니다.',
    originalLabel: '원본 텍스트:',
    modifiedLabel: '변경된 텍스트:',
    originalPlaceholder: '비교할 원본 텍스트를 입력하세요...',
    modifiedPlaceholder: '비교할 대상 텍스트를 입력하세요...',
    compareButton: '비교하기',
    resetButton: '초기화',
    added: '추가됨',
    removed: '삭제됨',
    equal: '동일',
    lines: '줄',
    diffResultTitle: '차이점 비교 결과:',
    emptyLine: '(빈 줄)',
    originalCharCount: '원본: {count}자',
    modifiedCharCount: '변경: {count}자',
    emptyPrompt: '텍스트를 입력하고 비교하기 버튼을 눌러주세요',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          두 텍스트의 차이점을 한 줄 단위로 비교하고 하이라이트하세요!
        </p>
        <p>
          텍스트 비교 도구는 두 텍스트 간의 차이점을 한 줄 단위로 정확하게 비교하고
          추가, 삭제, 변경 사항을 색상으로 직관적으로 보여주는 강력한 분석 도구입니다.
        </p>
        <p>
          코드 리뷰에서 소스코드 변경 이력을 빠르게 확인하거나, 계약서·제안서 등 문서 수정 사항을 검토하거나,
          원문과 번역문을 대조하여 오역을 발견하는 등 다양한 상황에서 원본과 변경본의 차이점을 신속하게 파악할 수 있습니다.
        </p>
        <p>
          추가된 줄, 삭제된 줄, 동일한 줄의 통계를 함께 제공하여 변경 규모를 한눈에 파악할 수 있으며,
          개발자, 번역가, 문서 관리자, 학생 등 텍스트 비교가 필요한 모든 사용자에게 유용합니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">diff (차이 비교)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">두 텍스트 사이의 추가·삭제·변경된 부분을 찾아내어 보여주는 비교 과정입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">줄 단위 비교</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">텍스트를 줄(라인) 단위로 나누어 같은 줄인지, 추가되거나 삭제되었는지 판단하는 비교 방식입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">LCS (최장 공통 부분 수열)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">두 문자열에서 순서를 유지하며 공통으로 나타나는 가장 긴 부분을 찾는 알고리즘으로, 정밀한 차이 비교에 활용됩니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">텍스트 비교 알고리즘</h3>
          <p className="mb-2 text-muted-foreground">
            각 줄을 순서대로 비교하여 동일 여부를 판단합니다. 두 텍스트의 줄 수가 다를 경우
            더 긴 쪽을 기준으로 빠진 부분을 감지합니다.
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <code className="text-sm">for (let i = 0; i &lt; maxLines; i++) {'{'}</code><br/>
            <code className="text-sm">&nbsp;&nbsp;if (line1 === line2) → 동일 (변경 없음)</code><br/>
            <code className="text-sm">&nbsp;&nbsp;else → 변경 감지 (추가 또는 삭제)</code><br/>
            <code className="text-sm">{'}'}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            비교 결과는 추가(초록색), 삭제(빨간색 + 줄긋기), 동일(변경 없음)으로 구분되며,
            통계 카드에서 추가/삭제/동일 줄 수를 한눈에 확인할 수 있습니다.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">텍스트 비교 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>코드 리뷰:</strong> Git 커밋이나 Pull Request에서 소스코드 변경 이력을 빠르게 확인할 때 유용합니다.</li>
            <li><strong>문서 비교:</strong> 계약서, 제안서, 논문 등 여러 버전의 문서 수정 사항을 체계적으로 관리할 수 있습니다.</li>
            <li><strong>번역 검토:</strong> 원문과 번역문을 나란히 대조하여 의도치 않은 번역 누락이나 오역을 빠르게 발견할 수 있습니다.</li>
            <li><strong>이력 관리:</strong> 여러 버전의 텍스트 차이를 한눈에 파악하여 변경 이력을 체계적으로 관리하세요.</li>
            <li><strong>이메일/공문 검토:</strong> 수정 전후의 메일이나 공문을 비교하여 변경 사항을 빠르게 확인하세요.</li>
          </ul>
        </div>
      </div>
    `,
  },
  qrGenerator: {
    title: 'QR 코드 생성기',
    description: '텍스트나 URL을 QR 코드로 변환합니다.',
    inputLabel: '텍스트 또는 URL 입력:',
    inputPlaceholder: 'https://example.com 또는 텍스트 입력',
    generateButton: 'QR 코드 생성',
    resetButton: '초기화',
    downloadButton: 'PNG로 다운로드',
    textLength: '입력된 텍스트 길이: {count}자',
    emptyPrompt: '텍스트를 입력하면 QR 코드가 표시됩니다',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          텍스트와 URL을 QR 코드로 변환하여 빠르게 공유하세요!
        </p>
        <p>
          QR 코드 생성기는 텍스트, URL, 연락처 정보 등을 QR 코드로 변환하여 스마트폰 카메라로 스캔하면 바로 연결되는
          편리한 공유 도구입니다. 웹사이트 링크, 와이파이 비밀번호, 메시지 등 다양한 정보를 하나의 이미지로 담을 수 있습니다.
        </p>
        <p>
          생성된 QR 코드는 PNG 파일로 다운로드하여 명함, 포스터, 메뉴판, 전단지 등에 활용할 수 있습니다.
          별도의 로그인이나 설치 없이 웹 브라우저에서 즉시 사용할 수 있어 개인과 비즈니스 모두에게 유용합니다.
        </p>
        <p>
          자영업자, 마케터, 교사, 이벤트 기획자뿐 아니라 일상에서 QR 코드를 자주 활용하는 모든 분들에게
          간편하고 빠른 QR 코드 생성 서비스를 제공합니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">QR 코드 (Quick Response Code)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">흑백 격자 모듈에 정보를 담은 2차원 바코드로, 스마트폰 카메라로 빠르게 스캔하여 텍스트·URL 등을 읽을 수 있습니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">오류 정정 레벨</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">QR 코드가 훼손되거나 오염되어도 데이터를 복구할 수 있도록 중복 정보를 추가하는 비율입니다. 레벨이 높을수록 손상에 강하지만 코드가 커집니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">QR 코드의 구조와 작동 원리</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Finder Pattern:</strong> 3개의 코너에 위치한 큰 정사각형 패턴으로 스캐너가 QR 코드의 위치와 방향을 인식합니다.</li>
            <li><strong>Timing Pattern:</strong> Finder 패턴 사이의 점선으로 모듈 크기를 결정하는 기준선 역할을 합니다.</li>
            <li><strong>Data Modules:</strong> 실제 데이터가 인코딩된 영역으로, 텍스트나 URL 정보가 담깁니다.</li>
            <li><strong>Error Correction:</strong> QR 코드가 부분적으로 손상되어도 복구 가능한 중복 데이터가 포함되어 있어 안정적입니다.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">생성 과정</h3>
          <p className="text-muted-foreground">
            입력된 텍스트를 데이터로 변환하고, 인코딩된 데이터를 모듈 행렬에 배치한 뒤,
            Finder 패턴과 Timing 패턴을 추가하여 최종적인 QR 코드 이미지를 렌더링합니다.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">QR 코드 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>URL 공유:</strong> 웹사이트 링크를 QR 코드로 만들어 명함이나 포스터에 인쇄하면 방문자가 즉시 접속할 수 있습니다.</li>
            <li><strong>와이파이 연결:</strong> Wi-Fi 네트워크 정보를 QR 코드로 만들어 손님에게 공유하면 비밀번호 입력 없이 연결됩니다.</li>
            <li><strong>메뉴판/카탈로그:</strong> 식당 메뉴나 제품 카탈로그를 QR 코드로 연결하여 종이를 절약하고 실시간 업데이트가 가능합니다.</li>
            <li><strong>인쇄물 최소 크기:</strong> QR 코드는 최소 2cm x 2cm 이상으로 인쇄해야 정확한 스캔이 가능합니다.</li>
            <li><strong>여백(Quiet Zone) 유지:</strong> QR 코드 주변에 충분한 여백을 두어야 스캐너가 정확하게 인식합니다.</li>
            <li><strong>색상 대비:</strong> QR 코드는 어두운색 바탕에 밝은색 모듈이 일반적이며, 반전된 색상은 스캔이 어려울 수 있습니다.</li>
          </ul>
        </div>
      </div>
    `,
  },
  notepad: {
    title: '메모장',
    description: '간단한 텍스트 메모를 작성하고 자동 저장합니다.',
    placeholder: '여기에 메모를 작성하세요...\n\n자동으로 브라우저에 저장됩니다.',
    manualSave: '수동 저장',
    copy: '복사',
    clearAll: '전체 삭제',
    confirmClear: '정말로 모든 메모를 삭제하시겠습니까?',
    copiedMessage: '클립보드에 복사되었습니다!',
    saved: '✓ 저장됨',
    savedAt: '✓ 저장됨 ({time})',
    saving: '저장 중...',
    stats: '통계',
    charCount: '글자 수',
    wordCount: '단어 수',
    lineCount: '줄 수',
    byteCount: '바이트',
    notesInfo: '메모 정보',
    infoStorage: '브라우저 로컬 스토리지에 자동 저장됩니다',
    infoPersistence: '브라우저를 닿아도 내용이 유지됩니다',
    infoDeviceOnly: '같은 기기에서만 저장됩니다',
    infoAutoSave: '1초 동안 입력이 없으면 자동 저장됩니다',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          브라우저에서 바로 메모를 작성하고 자동으로 저장하세요!
        </p>
        <p>
          메모장은 간단한 텍스트 메모를 작성하고 브라우저에 자동 저장해주는 실용적인 도구입니다.
          별도의 설치나 로그인 없이 바로 메모를 작성할 수 있으며,
          브라우저의 로컬 스토리지 기술을 활용하여 브라우저를 닫아도 내용이 유지됩니다.
        </p>
        <p>
          글자 수, 단어 수, 줄 수, 바이트 용량 등 메모의 통계 정보를 실시간으로 확인할 수 있어
          글자 수 제한이 있는 곳에 텍스트를 작성할 때 유용합니다.
        </p>
        <p>
          빠른 아이디어 메모, 할 일 목록, 코드 스니펫 임시 저장, 텍스트 정리 등
          다양한 용도로 활용할 수 있는 가볍고 편리한 메모 도구입니다.
        </p>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">자동 저장 기능</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">localStorage.setItem('key', content)</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Web Storage API의 localStorage를 사용하여 브라우저에 데이터를 영구 저장합니다.
            1초 동안 입력이 없으면 자동으로 저장되며, 브라우저를 닫아도 내용이 유지됩니다.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">통계 계산</h3>
          <p className="text-muted-foreground">
            글자 수는 content.length, 단어 수는 공백 기준 split으로 계산하며,
            바이트 용량은 Blob 객체를 사용하여 정확한 UTF-8 바이트 수를 측정합니다.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">메모장 활용 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>빠른 메모:</strong> 회의 중이나 이동 중에 아이디어나 할 일을 빠르게 기록할 때 유용합니다.</li>
            <li><strong>텍스트 정리:</strong> 긴 글의 초안을 작성하거나 온라인 텍스트를 정리할 때 활용하세요.</li>
            <li><strong>코드 스니펫:</strong> 자주 사용하는 코드 조각이나 명령어를 임시 저장하여 필요할 때 즉시 복사할 수 있습니다.</li>
            <li><strong>복붙 허브:</strong> 여러 텍스트를 한 곳에서 관리하다가 필요한 곳으로 복사하여 붙여넣기 할 때 편리합니다.</li>
            <li><strong>글자 수 제한 확인:</strong> SNS, 지원서 등 글자 수 제한이 있는 곳에 텍스트를 작성할 때 미리 확인하세요.</li>
            <li><strong>주의사항:</strong> 중요한 비밀번호나 개인정보는 브라우저에 저장하지 마세요.</li>
          </ul>
        </div>
      </div>
    `,
  },
  holidayCalendar: {
    title: '공휴일 캘린더',
    description: '대한민국 공휴일을 확인합니다.',
    yearLabel: '연도:',
    monthLabel: '월:',
    monthHolidays: '{month}월 공휴일 ({count}개)',
    yearHolidays: '{year}년 전체 공휴일 ({count}개)',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          대한민국 공휴일을 달력에서 한눈에 확인하세요!
        </p>
        <p>
          공휴일 캘린더는 대한민국의 법정 공휴일을 달력 형태로 표시하여
          각 공휴일의 날짜와 이름을 쉽고 빠르게 확인할 수 있는 도구입니다.
        </p>
        <p>
          2024년과 2025년의 공휴일 정보를 포함하고 있으며, 설날·추석·어린이날 등
          매년 고정된 공휴일부터 음력에 따른 변동 공휴일까지 모두 확인할 수 있습니다.
        </p>
        <p>
          연차 계획, 여행 일정, 택배 배송, 은행·관공서 운영 확인 등
          공휴일에 따라 달라지는 일상생활 정보를 미리 파악하는 데 유용하게 활용할 수 있습니다.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">용어 설명</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">공휴일</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">법령에 따라 관공서가 휴무하는 날로, 신정·삼일절 등 매년 고정된 날과 설날·추석 등 음력 기반의 날이 포함됩니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">대체공휴일</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">공휴일이 토요일이나 일요일과 겹칠 때, 다음 첫 번째 평일을 공휴일로 대체하여 지정하는 제도입니다.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">음력 / 양력</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">양력은 지구의 태양 공전을 기준으로 한 달력이고, 음력은 달의 위상을 기준으로 한 달력입니다. 설날과 추석은 음력 날짜를 따릅니다.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">대한민국 공휴일 목록 (2024-2025)</h3>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-primary">매년 고정 공휴일:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>신정 (1월 1일)</li>
              <li>삼일절 (3월 1일)</li>
              <li>어린이날 (5월 5일)</li>
              <li>현충일 (6월 6일)</li>
              <li>광복절 (8월 15일)</li>
              <li>개천절 (10월 3일)</li>
              <li>한글날 (10월 9일)</li>
              <li>크리스마스 (12월 25일)</li>
            </ul>
            <p className="mt-2 font-semibold text-primary">음력 기반 공휴일:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>설날 (음력 1월 1일 전후, 최대 3일 + 대체공휴일)</li>
              <li>부처님 오신 날 (음력 4월 8일)</li>
              <li>추석 (음력 8월 15일 전후, 최대 3일 + 대체공휴일)</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">공휴일 활용 핵심 팁</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>대체공휴일 제도:</strong> 공휴일이 토요일이나 일요일과 겹치면 다음 평일이 대체공휴일로 지정될 수 있습니다. 2024년부터 대체공휴일 적용 범위가 확대되었습니다.</li>
            <li><strong>연차 활용 전략:</strong> 공휴일 전후로 연차를 사용하면 장기 휴가를 만들 수 있습니다. 공휴일과 이어지는 월요일이나 금요일에 연차를 내면 효과적입니다.</li>
            <li><strong>택배/배송:</strong> 공휴일에는 택배 배송이 지연될 수 있으므로 중요한 물건은 미리 주문하세요.</li>
            <li><strong>은행/관공서:</strong> 공휴일에는 대부분의 은행과 관공서가 운영하지 않으니 사전 확인이 필요합니다.</li>
            <li><strong>영업시간 변경:</strong> 공휴일에는 일반적으로 주말 영업시간으로 운영되며, 일부 매장은 휴무일 수 있습니다.</li>
            <li><strong>공공기관 민원:</strong> 공휴일에는 민원 접수 및 처리가 불가능하므로 업무 일정에 참고하세요.</li>
          </ul>
        </div>
      </div>
    `,
  },
  velocityCalculator: {
    title: '속도 계산기',
    description: '거리와 시간을 입력하여 속도, 또는 속도 변화를 통해 가속도를 계산합니다.',
    tabVelocity: '속도 계산',
    tabAcceleration: '가속도 계산',
    inputDistance: '거리 (m)',
    inputTime: '시간 (s)',
    inputInitialVelocity: '초기 속도 (m/s)',
    inputFinalVelocity: '최종 속도 (m/s)',
    inputAccelTime: '시간 (s)',
    calculateBtn: '계산하기',
    resetBtn: '초기화',
    resultVelocity: '계산된 속도',
    resultAcceleration: '계산된 가속도',
    placeholder: '계산하기 버튼을 클릭하여 결과를 확인하세요.',
    resultTabVelocity: '속도 결과',
    resultTabAcceleration: '가속도 결과',
  },
  torqueCalculator: {
    title: '토크 계산기',
    description: '힘과 거리를 입력하여 토크(돌림힘)를 계산합니다.',
    inputForce: '힘 (F):',
    inputDistance: '거리 (r):',
    placeholder: '힘과 거리를 입력하고 계산 버튼을 눌러주세요.',
    calculateBtn: '계산',
    resultTitle: '계산 결과',
    resultDescription: '토크는 {value} 뉴턴 미터입니다.',
  },
  molarityCalculator: {
    title: '몰농도 계산기',
    description: '몰 수와 부피를 입력하여 용액의 몰농도를 계산합니다.',
    tabDirect: '직접 계산',
    tabMass: '질량 기반',
    inputMoles: '몰 수 (mol)',
    inputVolume: '용액의 부피 (L)',
    inputMass: '용질의 질량 (g)',
    inputMolecularWeight: '몰 질량 (g/mol)',
    inputMassVolume: '용액의 부피 (L)',
    calculateBtn: '계산하기',
    resetBtn: '초기화',
    resultDirectTitle: '직접 계산 결과',
    resultMassTitle: '질량 기반 결과',
    resultMolarity: '계산된 몰농도',
    resultMoles: '몰 수',
    resultMolarityLabel: '몰농도',
    placeholder: '계산하기 버튼을 클릭하여 결과를 확인하세요.',
  },
  kineticEnergyCalculator: {
    title: '운동 에너지 계산기',
    description: '질량과 속도 또는 관성 모멘트와 각속도를 입력하여 운동 에너지를 계산합니다.',
    linearMotion: '선형 운동',
    rotationalMotion: '회전 운동',
    inputMass: '질량 (kg)',
    inputVelocity: '속도 (m/s)',
    inputMomentOfInertia: '관성 모멘트 (kg·m²)',
    inputAngularVelocity: '각속도 (rad/s)',
    calculateBtn: '계산하기',
    resultLabel: '계산된 운동 에너지',
    inputValues: '입력값',
    placeholder: '정보를 입력하고 계산 버튼을 눌러주세요.',
  },
  forceCalculator: {
    title: '힘 계산기',
    description: '질량과 가속도를 입력하여 힘(F=ma)을 계산합니다.',
    inputMass: '질량 (kg)',
    inputAcceleration: '가속도 (m/s²)',
    calculateBtn: '계산하기',
    resetBtn: '초기화',
    resultLabel: '계산된 힘',
    placeholder: '계산하기 버튼을 클릭하여 결과를 확인하세요.',
  },
  tankCalculator: {
    title: 'Tank 부피 계산기',
    description: '원통형 탱크의 부피와 용량을 계산합니다.',
    loading3D: '3D 모델 로딩 중...',
    visualization: 'Tank 시각화',
    inputs: {
      tankType: '탱크 타입 (Tank Type)',
      unit: '단위 (Unit)',
      diameter: '직경 (Diameter)',
      height: '높이 (Height)',
      length: '길이 (Length)',
      width: '너비 (Width)',
      radius1: '반지름 1 (Radius 1)',
      radius2: '반지름 2 (Radius 2)',
      coneHeight: '원뿔 높이 (Cone Height)',
      fillHeight: '채움 높이 (Fill Height)',
      topDiameter: '상단 직경 (Top Diameter)',
      bottomDiameter: '하단 직경 (Bottom Diameter)',
      cylinderHeight: '원통 높이 (Cylinder Height)',
    },
    results: {
      totalVolume: '총 부피 (Total Volume)',
      filledVolume: '채워진 부피 (Filled Volume)',
      surfaceArea: '표면적 (Surface Area)',
      formula: '사용된 공식',
      enterValues: '좌측에서 값을 입력하고 계산하기 버튼을 눌러주세요.',
    },
    details: {
      title: '📚 Tank Volume 공식 및 이론',
      types: '지원하는 Tank 타입',
      partialFill: '부분 채움 계산',
      partialFillDesc: '채움 높이를 입력하면 부분적으로 채워진 Tank의 부피를 계산할 수 있습니다. 수평 원통의 경우 복잡한 원형 세그먼트 공식을 사용합니다.',
      unitConversion: '단위 변환',
      unitConversionDesc: '선택한 단위 시스템(Metric/Imperial)에 맞게 다양한 단위 변환을 지원합니다.',
    },
    info: {
      description: `
        <div class="space-y-4">
          <p><strong>Tank 부피 계산기</strong>는 다양한 형태의 탱크와 저장 시설의 부피를 정확하게 계산하는 공학 도구입니다. 원통형, 직사각형, 타원형, 원추형 등 다양한 탱크 유형을 지원하며, 산업 현장에서 필수적인 저장 용량 계산에 활용됩니다.</p>
          <p>이 계산기는 수처리 시설, 화학 공장, 석유 저장 시설, 농업용 저수조 등 다양한 산업 분야에서 탱크의 부피를 설계하거나 검증할 때 사용됩니다. 또한, 탱크의 표면적을 함께 계산하여 도장이나 절연 재료의 양을 산정하는 데도 유용합니다.</p>
          <p>탱크의 형태에 따라 서로 다른 수학 공식을 적용하며, 사용자는 미터법(m, mm) 및 야드파운드법(ft, in) 단위를 선택하여 계산할 수 있습니다. 원하는 채움 높이를 지정하면 해당 높이까지의 부피도 계산할 수 있어, 실용적인 활용이 가능합니다.</p>
          <p class="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">탱크 설계 시 정확한 부피 계산은 비용 효율성과 안전성에 직접적인 영향을 미칩니다. 과소 계산하면 저장 용량이 부족하고, 과대 계산하면 불필요한 비용이 발생합니다. 이 계산기를 통해 정확한 데이터를 기반으로 최적의 탱크 설계를 진행하시기 바랍니다.</p>
        </div>
      `,
      formula: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">원통형 탱크 (수직)</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = π × r² × h</p>
            </div>
            <ul class="mt-4 space-y-2 text-sm">
              <li><strong class="font-semibold">V</strong>: 부피 (단위: m³ 또는 L)</li>
              <li><strong class="font-semibold">π</strong>: 원주율 (≈ 3.14159)</li>
              <li><strong class="font-semibold">r</strong>: 반지름 (지름 ÷ 2)</li>
              <li><strong class="font-semibold">h</strong>: 높이</li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">직사각형 탱크</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = 길이 × 너비 × 높이</p>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">원추형 탱크</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = (1/3) × π × r² × h</p>
            </div>
          </div>
        </div>
      `,
      tips: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">탱크 유형 선택 가이드</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>수직 원통형:</strong> 가장 일반적인 형태로, 높은 압력을 견딜 수 있음</li>
              <li><strong>수평 원통형:</strong> 높이 제한이 있는 장소에 적합</li>
              <li><strong>직사각형:</strong> 맞춤형 설치 공간이 필요할 때 유리</li>
              <li><strong>원추형 바닥:</strong> 침전물 배출이 필요한 경우에 적합</li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">부피 단위 변환</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>1 m³</strong> = 1,000 리터(L)</li>
              <li><strong>1 리터</strong> = 0.001 m³</li>
              <li><strong>1 gal(미국)</strong> ≈ 0.003785 m³</li>
            </ul>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
            <p class="font-bold text-sm">⚠️ 주의사항</p>
            <p class="text-xs mt-1">실제 탱크 제작 시에는 벽두께, 용접 이음새, 열팽창 등을 고려하여 여유 용량을 설계하는 것이 좋습니다. 일반적으로 계산된 부피의 5~10%를 여유분으로 추가합니다.</p>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">실생활 적용 사례</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>수처리 시설:</strong> 급수, 하수 처리 시설의 저장조 설계</li>
              <li><strong>화학 공장:</strong> 원자재 및 완제품 저장 탱크 용량 산정</li>
              <li><strong>농업:</strong> 관개용 저수조, 비료 저장 탱크 설계</li>
              <li><strong>연료 저장:</strong> 가솔린, 디젤 등 연료 저장 시설 설계</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  pumpPower: {
    title: '펌프 동력 계산기',
    description: '펌프 시스템의 축 동력과 모터 동력을 계산합니다.',
    inputs: {
      flowRate: '유량 (Flow Rate)',
      head: '양정 (Head)',
      fluidDensity: '유체 밀도 (Fluid Density)',
      pumpEfficiency: '펌프 효율 (Pump Efficiency)',
      motorEfficiency: '모터 효율 (Motor Efficiency)',
    },
    results: {
      shaftPower: '축 동력 (Shaft Power)',
      motorPower: '모터 동력 (Motor Power)',
      motorPowerDesc: '* 모터 효율을 고려하여 펌프를 구동하는 데 필요한 총 동력입니다.',
      enterValues: '좌측에서 값을 입력하고 계산하기 버튼을 눌러주세요.',
    }
  },
  freeFall: {
    title: '자유 낙하 계산기',
    description: '자유 낙하하는 물체의 속도와 이동 거리를 계산합니다.',
    inputs: {
      time: '낙하 시간 (Time)',
      initialVelocity: '초기 속도 (Initial Velocity)',
      initialHeight: '초기 높이 (선택사항, Initial Height)',
    },
    results: {
      finalVelocity: '최종 속도 (Final Velocity)',
      distanceTraveled: '이동 거리 (Distance Traveled)',
      timeToGround: '지면 도달 시간 (Time to Ground)',
      enterValues: '값을 입력하여 계산을 진행해주세요.',
    },
    visualization: {
      title: '시간에 따른 속도 및 이동 거리',
      velocity: '속도 (Velocity)',
      distance: '거리 (Distance)',
      time: '시간 (Time)',
      tableTitle: '자유 낙하 데이터 테이블',
    },
    details: {
      title: '📚 자유 낙하 공식 및 이론',
      description: '이 계산은 공기 저항이 없는 진공 상태를 가정합니다. 실제 환경에서는 물체의 모양과 표면적에 따라 공기 저항(항력)이 크게 작용할 수 있습니다.',
      formulaTitle: '사용된 공식',
    }
  },
  npshCalculator: {
    title: 'NPSH 계산기',
    description: '펌프의 순흡입수두/Net Positive Suction Head를 계산합니다.',
    loadingImage: '이미지 로딩 중...',
    fluids: {
      water: '물 (Water)',
      ethanol: '에탄올 (Ethanol)',
      benzene: '벤젠 (Benzene)',
      toluene: '톨루엔 (Toluene)',
      acetone: '아세톤 (Acetone)',
      methanol: '메탄올 (Methanol)',
      chloroform: '클로로포름 (Chloroform)',
      cyclohexane: '사이클로헥산 (Cyclohexane)',
    },
    inputs: {
      tankPosition: '탱크 위치 (Tank Position)',
      abovePump: '펌프 위 (Above Pump)',
      belowPump: '펌프 아래 (Below Pump)',
      tankType: '탱크 타입 (Tank Type)',
      openTank: '대기개방식 (Open Tank)',
      closedTank: '밀폐탱크 (Closed Tank)',
      fluidSelection: '유체 선택 (Fluid Selection)',
      atmosphericPressure: '대기압 (Atmospheric pressure)',
      surfacePressure: '표면압력 (Surface pressure)',
      sameAsAtmospheric: '(대기압과 동일)',
      vaporPressure: '증기압 (Vapor pressure)',
      liquidDensity: '액체 밀도 (Liquid density)',
      temperature: '온도 (Temperature)',
      distance: '거리 (Distance)',
      frictionLoss: '마찰 손실 (Friction loss)',
      npshr: 'NPSH Required (펌프 요구값)',
      npshrPlaceholder: '펌프 데이터시트 값',
    },
    buttons: {
      calculating: '계산 중...',
      calculate: 'NPSH 계산하기',
    },
    messages: {
      success: 'NPSH 계산이 완료되었습니다.',
      error: '계산 중 오류가 발생했습니다.',
    },
    visualization: {
      title: 'NPSH 시각화',
      needCalculate: '계산 필요',
      needCalculateDesc: '계산하기 버튼을 눌러주세요',
      tankAbove: '액체가 펌프보다 위에 위치 (정압 수두)',
      tankBelow: '액체가 펌프보다 아래 위치 (부압 수두)',
      openTankDesc: '대기개방 조건 (Ps = Patm)',
      closedTankDesc: '밀폐탱크 조건 (Ps = Patm + Psurface)',
      conditions: '주요 파라미터',
    },
    results: {
      title: '계산 결과',
      npsha: 'NPSH Available',
      npshr: 'NPSH Required',
      safe: '안전',
      caution: '주의',
      danger: '위험',
      adequate: '충족',
      inadequate: '부족',
      analysisTitle: '공식 구성요소 분석',
      formulaText: 'NPSH Available = (Psurf - Pvap) / (ρ × g) {sign} Z - Hl',
      formulaDesc: '= 압력 헤드 {signDesc} - 마찰 손실',
      signDescAbove: '+ 정압 수두',
      signDescBelow: '- 흡입 양정',
      pressureHeadTitle: '압력 헤드 구성',
      atmHead: '대기압 헤드:',
      vapHead: '증기압 헤드:',
      netPressureHead: '순 압력 헤드:',
      positionHeadTitle: '위치 헤드',
      tankPositionRes: '탱크 위치:',
      distanceRes: '거리:',
      positionHead: '위치 헤드:',
      frictionHeadTitle: '손실 헤드',
      frictionLossRes: '마찰 손실:',
    },
    info: {
      description: `
        <div class="space-y-4">
          <p><strong>NPSH(순흡입수두) 계산기</strong>는 펌프 설계 및 선정 시 필수적인 순흡입수두(Net Positive Suction Head)를 계산하는 공학 도구입니다. NPSH은 펌프 입구에서 유체가 캐비테이션 없이 안정적으로 흡입될 수 있는 압력 수두를 나타내며, 펌프의 안전한 운전을 위해 반드시 고려해야 합니다.</p>
          <p><strong>캐비테이션</strong>은 유체의 압력이 증기압 이하로 떨어질 때 발생하는 기포 형성 현상입니다. 캐비테이션이 발생하면 펌프의 효율이 급격히 떨어지고, 임펠러와 케이싱에 물리적 손상을 일으켜 펌프 수명을 크게 단축시킵니다.</p>
          <p>이 계산기는 NPSHa(가용 순흡입수두)와 NPSHr(필요 순흡입수두)를 비교하여 펌프의 캐비테이션 안전 마진을 평가합니다. 다양한 유체(물, 에탄올, 메탄올 등)와 operating 조건에서 정확한 계산을 제공합니다.</p>
        </div>
      `,
      formula: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">NPSHa (가용 순흡입수두)</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">NPSHa = Ps/ρg + Vs²/2g - Pv/ρg ± Hs</p>
            </div>
            <ul class="mt-4 space-y-2 text-sm">
              <li><strong>Ps</strong>: 흡입 측 절대 압력 (Pa)</li>
              <li><strong>ρ</strong>: 유체 밀도 (kg/m³)</li>
              <li><strong>g</strong>: 중력 가속도 (9.81 m/s²)</li>
              <li><strong>Vs</strong>: 흡입관 내 유속 (m/s)</li>
              <li><strong>Pv</strong>: 유체의 증기압 (Pa)</li>
              <li><strong>Hs</strong>: 흡입 수두 (positive = below pump, negative = above pump)</li>
            </ul>
          </div>
        </div>
      `,
      tips: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">캐비테이션 예방 요령</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>흡입 높이 최소화:</strong> 펌프 입구 높이와 유체 수면 높이의 차이를 최소화합니다.</li>
              <li><strong>흡입관 직경 확대:</strong> 유속을 줄여 마찰 손실을 감소시킵니다.</li>
              <li><strong>온도 관리:</strong> 유체 온도가 높으면 증기압이 상승하므로 주의합니다.</li>
            </ul>
          </div>
        </div>
      `
    },
    details: {
      title: '상세 공식 및 이론',
      content: `
        <div class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-3">NPSH Available 공식</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>NPSH Available = (Psurf - Pvap)/(ρ×g) - Z - Hf</strong></p>
              <p>• Psurf: 표면 압력 = Patm + Pres (Pa)</p>
              <p>• Pvap: 증기압 (Pa)</p>
              <p>• ρ: 액체 밀도 (kg/m³)</p>
              <p>• g: 중력가속도 (9.81 m/s²)</p>
              <p>• Z: 액체 표면과 펌프 입구 사이의 높이</p>
              <p>• Hf: 마찰 손실</p>
            </div>
          </div>

          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <h4 class="font-semibold text-orange-800 dark:text-orange-200 mb-3">Tank Position에 따른 Z 값</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Above Pump:</strong> 액체가 펌프보다 위에 있음 (Z = +거리)</p>
              <p><strong>Below Pump:</strong> 액체가 펌프보다 아래에 있음 (Z = -거리)</p>
              <p>• 양수 Z: 중력이 도움 (정압 수두)</p>
              <p>• 음수 Z: 중력이 방해 (흡입 양정)</p>
            </div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h4 class="font-semibold text-green-800 dark:text-green-200 mb-3">증기압 (Antoine 방정식)</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>log₁₀(P) = A - B/(C + T)</strong></p>
              <p>• T: 온도 (°C), P: 증기압 (mmHg)</p>
              <p>• Pa 변환: P(Pa) = P(mmHg) × 133.322</p>
            </div>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <h4 class="font-semibold text-red-800 dark:text-red-200 mb-3">NPSH 안전 기준</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>NPSHr 기반 평가 (권장):</strong></p>
              <p>• <span class="text-green-600 dark:text-green-400 font-medium">안전:</span> NPSH Available ≥ 1.3 × NPSHr</p>
              <p>• <span class="text-yellow-600 dark:text-yellow-400 font-medium">주의:</span> 1.0 × NPSHr ≤ NPSH Available &lt; 1.3 × NPSHr</p>
              <p>• <span class="text-red-600 dark:text-red-400 font-medium">위험:</span> NPSH Available &lt; NPSHr</p>
              <p class="mt-3"><strong>절대값 기준 (NPSHr 미입력시):</strong></p>
              <p>• <span class="text-green-600 dark:text-green-400 font-medium">안전:</span> NPSH Available &gt; 3</p>
              <p>• <span class="text-yellow-600 dark:text-yellow-400 font-medium">주의:</span> 2 &lt; NPSH Available ≤ 3</p>
              <p>• <span class="text-red-600 dark:text-red-400 font-medium">위험:</span> NPSH Available ≤ 2</p>
            </div>
          </div>
        </div>
      `,
    },
  },
  corrosionCompatibility: {
    title: 'Material Corrosion Compatibility',
    selectChemical: '화학물질 선택',
    selectMaterial: '재질 선택',
    allRatings: '모든 등급',
    searchChemical: '화학물질 검색...',
    searchMaterial: '재질 검색...',
    allMaterials: '모든 재질',
    compatibilityResult: '호환성 결과',
    materialName: '재질명',
    concentration: '농도',
    temperature: '온도 (°C)',
    compatibilityRating: '호환성 등급',
    remarks: '비고',
    noData: '해당 조합에 대한 호환성 데이터가 없습니다.',
    source: '출처: Alleima (Sandvik)',
  },
  materialComparison: {
    title: 'Material Properties',
    source: '출처: MakeItFrom',
    description: '재질을 추가하면 상대적인 비교를 할 수 있습니다.',
    majorCategory: '대분류를 선택하세요',
    middleCategory: '중분류를 선택하세요',
    subCategory: '소분류를 선택하세요',
    material: '재질을 선택하세요',
    addMaterial: '재질 추가',
    searchPlaceholder: '재료명으로 검색하세요 (예: 316, 625, Stainless, Alloy)',
    noResults: '검색 결과가 없습니다.',
    loadingData: '데이터를 불러오는 중...',
    properties: 'PROPERTIES',
    composition: 'Chemical Composition',
    referencePrice: 'Reference Price',
    property: '물성',
    unit: '단위',
    element: '원소',
  },
  dpsCalculator: {
    title: 'DPS 계산기',
    description: '초당 데미지(DPS)를 계산하고 버프 적용 효과를 확인합니다.',
    inputs: {
      attackPower: '공격력',
      attackSpeed: '공격 속도 (APS)',
      critChance: '치명타 확률 (%)',
      critMultiplier: '치명타 배율',
      bonusSection: '버프 적용',
      bonusDamage: '추가 데미지 (%)',
      bonusSpeed: '공격속도 (%)',
    },
    results: {
      baseDpsNoCrit: '기본 DPS (치명타 미적용)',
      baseDpsWithCrit: '기본 DPS (치명타 적용)',
      buffedDps: '버프 적용 DPS',
    },
    info: {
      title: 'DPS(초당 데미지) 계산기',
      p1: '게임 캐릭터의 전투력을 수치로 평가하는 도구입니다. 공격력, 공격 속도, 치명타 확률과 배율, 그리고 추가 데미지·공격속도 버프를 입력하면 기본 DPS와 버프 적용 DPS를 비교하여 얼마나 강한지 한눈에 파악할 수 있습니다.',
      p2: 'MMORPG, 액션 RPG, 슈팅 게임 등 대부분의 게임에서 DPS는 캐릭터 육성과 장비 투자의 방향을 결정하는 핵심 지표입니다.',
      p3: '일반 유저에게는 빌드 설계와 성장 가이드로, 공략 작성자와 길드 관리자에게는 파티 구성을 위한 분석 도구로 유용합니다.',
      tip: 'DPS는 평균 데미지입니다. 실제 전투는 몹의 방어력, 무적 프레임, 공격 간격 등 다양한 요인이 작용하므로 참고 지표로 활용하세요.',
    },
    glossary: {
      dps: { term: 'DPS(초당 데미지)', desc: '1초 동안 가하는 평균 데미지로, 캐릭터의 전투력을 평가하는 핵심 지표입니다.' },
      crit: { term: '치명타', desc: '공격이 기본 데미지보다 큰 배율로 적중하는 것을 의미하며, 확률과 배율로 결정됩니다.' },
      attackPower: { term: '공격력', desc: '1회 공격으로 주는 기본 데미지입니다.' },
      attackSpeed: { term: '공격 속도(APS)', desc: '1초당 공격 횟수로, DPS에 비례하여 전투력에 기여합니다.' },
    },
    formula: {
      baseDpsNoCrit: '기본 DPS (치명타 미적용)',
      baseDpsFormula: '기본 DPS = 공격력 × 공격속도(APS)',
      critCoefficient: '치명타 계수',
      critFormula: '치명타 계수 = 1 + (치명타확률 / 100) × (치명타배율 - 1)',
      critDps: '치명타 적용 DPS',
      critDpsFormula: 'DPS = 공격력 × APS × 치명타 계수',
      buffedDps: '버프 적용 DPS',
      buffedFormula: '버프 DPS = 공격력 × (1 + 추가데미지%/100) × APS × (1 + 공격속도%/100) × 치명타 계수',
      example: '예: 공격력 100, APS 1.0, 치명타 20%/2.0, 버프 +10% 데미지·+5% 속도 → 약 115.5 DPS',
    },
    tips: {
      critOpt: '치명타 최적화',
      critTip1: '치명타 확률이 높을수록 배율 투자의 효율이 커집니다.',
      critTip2: '확률과 배율의 균형을 맞춰 기대 데미지를 높이세요.',
      speedValue: '공격속도의 가치',
      speedTip1: '공격속도는 DPS에 비례하므로 꾸준한 투자가 효과적입니다.',
      speedTip2: '속도 상한(캡)이 있는 게임은 한계를 확인하세요.',
      buffStack: '버프 중첩',
      buffTip1: '여러 버프는 곱셈으로 계산되므로 중첩 효과가 큽니다.',
      buffTip2: '동일 효과는 중복 적용되지 않는지 규칙을 확인하세요.',
      gameRef: '게임별 참고',
      gameTip1: 'MMORPG: 딜러는 높은 DPS를 목표로 합니다.',
      gameTip2: '슈팅 게임: 명중률과 탄속도 함께 고려하세요.',
      comparison: '상대 비교',
      compTip1: '장비 교체 전후 DPS를 비교해 투자 우선순위를 정하세요.',
      compTip2: '버프 온·오프 상태를 모두 확인하세요.',
      limits: '한계 이해',
      limitTip1: 'DPS는 방어력·무적 등을 반영하지 않는 평균값입니다.',
      limitTip2: '실전 패턴과 함께 종합적으로 판단하세요.',
    },
  },
  randomStringGenerator: {
    title: '랜덤 문자열 생성기',
    description: '보안 토큰, 비밀번호 등에 사용할 랜덤 문자열을 생성합니다.',
    inputs: {
      stringLength: '문자열 길이',
      stringCount: '문자열 수',
      charType: '문자 유형',
      uppercase: '대문자 (A-Z)',
      lowercase: '소문자 (a-z)',
      numbers: '숫자 (0-9)',
      symbols: '특수문자 (!@#$%^&*)',
      generate: '문자열 생성',
      reset: '초기화',
    },
    results: {
      empty: '문자열을 생성해주세요.',
      generated: '{count}개 생성됨',
      copyAll: '전체 복사',
    },
    info: {
      title: '랜덤 문자열 생성기',
      p1: '보안 토큰, 비밀번호, API 키, 임시 ID 등에 사용할 무작위 문자열을 즉시 만들어 주는 도구입니다. 대문자·소문자·숫자·특수문자 중 필요한 문자 유형을 선택하고 길이와 개수를 설정하면, 암호학적으로 안전한 난수 생성 알고리즘으로 고품질 문자열을 생성합니다.',
      p2: '회원가입 임시 비밀번호 발급, 세션·인증 토큰 생성, 테스트용 더미 데이터 작성, 충돌 없는 파일명 생성 등 개발과 운영 전반에서 활용됩니다.',
      p3: '개발자와 서비스 운영자에게는 필수 유틸리티로, 일반 사용자에게는 안전한 비밀번호를 만드는 도구로 유용합니다.',
      tip: '이 도구는 브라우저의 Web Crypto API(crypto.getRandomValues)를 사용하므로 일반 난수보다 예측이 어렵습니다. 다만 생성된 값은 화면에만 표시되고 저장되지 않으므로, 중요한 키는 별도 보안 장소에 보관하세요.',
    },
    formula: {
      charset: '문자셋 구성',
      charsetDesc: '선택한 문자 유형에 따라 사용 가능한 문자 집합을 만듭니다.',
      combinations: '가능한 조합 수',
      comboDesc: '길이 L, 문자셋 크기 N일 때 가능한 문자열의 총수는 다음과 같습니다.',
      comboFormula: '조합 수 = N^L',
      example: '예: 문자 62개, 길이 16 → 62^16 ≈ 4.7×10²⁸개',
      mapping: '난수 매핑',
      mappingDesc: 'crypto.getRandomValues로 만든 무작위 정수를 문자셋 길이로 나눈 나머지를 인덱스로 사용합니다.',
      mappingFormula: 'result += charset[random % charset.length]',
      mappingNote: '이 방식은 각 문자가 동일한 확률로 선택되는 균일 분포를 보장합니다.',
    },
    tips: {
      passwordLength: '비밀번호 길이',
      tip1: '중요 계정은 최소 12자, 권장 16자 이상을 사용하세요.',
      tip2: '모든 문자 유형을 활성화할수록 강도가 올라갑니다.',
      apiKey: 'API 키 생성',
      apiKeyTip1: '특수문자는 이스케이프 문제가 생길 수 있으므로 숫자+영문 조합을 추천합니다.',
      apiKeyTip2: '세션·인증 토큰은 32자 이상을 권장합니다.',
      noReuse: '재사용 금지',
      noReuseTip1: '같은 문자열을 여러 곳에 재사용하지 마세요.',
      noReuseTip2: '유출 의심 시 즉시 새 것으로 교체하세요.',
      safeStorage: '안전한 보관',
      safeTip1: '생성값은 저장되지 않으므로 비밀번호 관리자를 이용하세요.',
      safeTip2: '화면 캡처나 로그에 남지 않도록 주의하세요.',
      testData: '테스트 데이터',
      testTip1: '더미 데이터와 파일명 생성에 대량 생성을 활용하세요.',
      testTip2: '개수는 한 번에 최대 50개까지 가능합니다.',
      complexity: '복잡도 조절',
      complexTip1: '사용처에 따라 특수문자 포함 여부를 조절하세요.',
      complexTip2: '가독성이 필요하면 숫자+영문 조합이 적당합니다.',
    },
  },
  randomNumberGenerator: {
    title: '랜덤 숫자 생성기',
    description: '지정된 범위에서 무작위 숫자를 생성합니다.',
    inputs: {
      minValue: '최소값',
      maxValue: '최대값',
      count: '생성 개수',
      allowDuplicates: '중복 허용',
      sort: '오름차순 정렬',
      generate: '숫자 생성',
      reset: '초기화',
    },
    results: {
      empty: '숫자를 생성해주세요.',
      generated: '{count}개 생성됨',
      copyAll: '전체 복사',
      history: '이전 생성 기록',
      countUnit: '개',
    },
    duplicateAlert: '중복 불가 시 최대 생성 가능 개수는 {range}개입니다.',
    info: {
      title: '랜덤 숫자 생성기',
      p1: '지정한 범위 내에서 무작위 숫자를 뽑아주는 도구입니다. 최소값·최대값·개수를 설정하고 중복 허용 여부와 오름차순 정렬 옵션을 선택하면, 추첨·샘플링·테스트 데이터 등에 바로 쓸 수 있는 숫자를 만듭니다.',
      p2: '복권 번호 생성, 경품 추첨, A/B 테스트 샘플 추출, 시뮬레이션용 난수, 게임 이벤트 확률 검증 등 다양한 상황에서 활용됩니다.',
      p3: '개발자와 데이터 분석가에게는 테스트 데이터 생성 도구로, 이벤트 운영자와 교육자에게는 공정한 추첨 도구로 유용합니다. 최근 10회 생성 기록도 함께 제공됩니다.',
      tip: '생성에는 Math.random()을 사용하며 통계적으로 균등한 분포를 가집니다. 단, 보안이 필요한 난수(복권 당첨 번호 발표 등)에는 암호학적 난수 생성기를 별도로 사용하세요. 기록은 브라우저 세션 동안만 유지됩니다.',
    },
    formula: {
      baseFormula: '기본 생성 공식',
      formula: 'random = floor(random() × (max - min + 1)) + min',
      dedup: '중복 방지 로직',
      dedupDesc: '중복을 허용하지 않을 때는 이미 뽑힌 숫자를 집합(Set)으로 추적합니다.',
      dedupFormula: '중복 불가 시: (max - min + 1) ≥ 개수',
      dedupNote: '범위보다 많은 개수를 요청하면 생성이 제한됩니다.',
      sort: '정렬',
      sortFormula: 'Array.sort((a, b) => a - b)',
      sortNote: '오름차순 정렬 옵션을 켜면 결과를 크기순으로 정리합니다.',
    },
    tips: {
      lottery: '복권 번호',
      lotteryTip1: '중복 불가와 오름차순 정렬을 사용하세요.',
      lotteryTip2: '범위와 개수를 규정에 맞춰 설정하세요.',
      fairDrawing: '공정한 추첨',
      fairTip1: '중복 허용으로 여러 번 뽑기 시나리오를 만들 수 있습니다.',
      fairTip2: '당첨자 선정 전 범위를 참가자에게 공개하세요.',
      testData: '테스트 데이터',
      testTip1: '범위 내 난수로 샘플 입력값을 만드세요.',
      testTip2: '반복 검증 시 기록 기능을 활용하세요.',
      gaming: '게임 활용',
      gamingTip1: '이벤트·아이템 드롭 확률 시뮬레이션에 사용하세요.',
      gamingTip2: '난수 시드를 바꿔 분포를 관찰하세요.',
      rangeNote: '범위 주의',
      rangeTip1: '최소값이 최대값보다 크면 자동으로 교환됩니다.',
      rangeTip2: '중복 불가 시 개수가 범위를 넘지 않게 하세요.',
      secureRandom: '보안 난수',
      secureTip1: '공인된 당첨·인증 용도에는 부적합합니다.',
      secureTip2: '필요 시 별도 암호학적 난수기를 사용하세요.',
    },
  },
  randomEmailGenerator: {
    title: '랜덤 이메일 생성기',
    description: '테스트 및 프라이버시 목적으로 사용할 랜덤 이메일 주소를 생성합니다.',
    inputs: {
      domainSelect: '도메인 선택',
      random: '랜덤 선택',
      customDomain: '커스텀 도메인',
      customDomainLabel: '커스텀 도메인',
      count: '생성 개수',
      generate: '이메일 생성',
      reset: '초기화',
    },
    results: {
      empty: '이메일을 생성해주세요.',
      generated: '{count}개 생성됨',
      copyAll: '전체 복사',
    },
    info: {
      title: '랜덤 이메일 생성기',
      p1: '테스트, 서비스 가입, 프라이버시 보호 등에 사용할 무작위 이메일 주소를 만드는 도구입니다. 인기 도메인(gmail, yahoo, outlook, naver, daum 등) 중 선택하거나 커스텀 도메인을 입력해 원하는 형식의 주소를 생성합니다.',
      p2: '영문 형용사·명사 풀과 숫자를 조합해 자연스럽고 기억하기 쉬운 사용자명을 만들므로, 개발과 QA 과정에서 더미 계정을 대량으로 발급할 때 유용합니다. 최대 50개까지 한 번에 생성할 수 있습니다.',
      p3: '개발자와 테스터에게는 이메일 발송 기능 검증용으로, 일반 사용자에게는 불필요한 사이트 가입 시 일회용 주소처럼 활용되는 프라이버시 도구로 유용합니다.',
      tip: '이 도구로 만든 이메일은 실제로 존재하거나 수신 가능한 주소가 아닙니다. 실제 가입이나 메일 수신이 필요한 경우 별도의 임시 메일 서비스나 정식 계정을 사용하세요.',
    },
    formula: {
      structure: '구조',
      structureDesc: '이메일은 사용자명@도메인 형식이며, 사용자명은 형용사+명사+숫자의 조합입니다.',
      structureFormula: '이메일 = 형용사 + 명사 + 숫자 @ 도메인',
      combinations: '가능한 조합 수',
      comboDesc: '형용사 A개, 명사 N개, 숫자 0~9999일 때 가능한 사용자명 총수는 다음과 같습니다.',
      comboFormula: '조합 수 = A × N × 10,000',
      domainSelect: '도메인 선택',
      domainDesc: '사용자가 고른 도메인 또는 커스텀 도메인을 사용자명에 결합합니다.',
      domainFormula: 'return username + "@" + domain',
    },
    tips: {
      testAccounts: '테스트 계정',
      testTip1: '앱·웹사이트 QA용 더미 이메일을 대량 발급하세요.',
      testTip2: '회원가입 플로우 검증에 적합합니다.',
      privacy: '프라이버시 보호',
      privacyTip1: '신뢰하기 어려운 사이트 가입 시 일회용처럼 활용하세요.',
      privacyTip2: '중요 계정에는 사용하지 마세요.',
      devTool: '개발자 도구',
      devTip1: '이메일 발송·수신 로직 테스트에 활용하세요.',
      devTip2: '마케팅 뉴스레터 발송 테스트 목록 생성에 유용합니다.',
      domainFormat: '도메인 형식',
      domainTip1: '커스텀 도메인은 example.com 형식으로 정확히 입력하세요.',
      domainTip2: '@ 기호는 자동으로 처리됩니다.',
      verification: '검증 필요',
      verTip1: '실제 가입에는 정규식 검증 후 사용하세요.',
      verTip2: '생성 주소는 수신이 불가능합니다.',
      bulkGen: '대량 생성',
      bulkTip1: '한 번에 최대 50개까지 생성 가능합니다.',
      bulkTip2: '전체 복사로 시트나 DB에 바로 붙여넣기 하세요.',
    },
  },
  ipLookup: {
    title: 'IP 주소 조회',
    description: '현재 공인 IP 주소와 관련 정보를 조회합니다.',
    inputs: {
      title: 'IP 주소 조회',
      subtitle: '현재 사용 중인 공인 IP 주소와 관련 정보를 조회합니다.',
      loading: '조회 중...',
      refresh: '새로고침',
      notes: '참고사항',
      note1: '이 도구는 공인 IP 주소를 표시합니다.',
      note2: 'VPN 사용 시 VPN 서버의 IP가 표시됩니다.',
      note3: 'IP 정보는 ISP에서 제공하는 대략적인 위치입니다.',
      note4: '정확한 위치는 표시되지 않을 수 있습니다.',
    },
    results: {
      empty: 'IP 정보를 조회해주세요.',
      publicIp: '공인 IP 주소',
      city: '도시',
      region: '지역',
      country: '국가',
      isp: 'ISP',
      coordinates: '좌표',
      timezone: '시간대',
      postal: '우편번호',
    },
    errors: {
      fetchFailed: 'IP 정보를 가져오는데 실패했습니다. 네트워크 연결을 확인해주세요.',
      ipFetchFailed: 'IP 조회 실패',
    },
    info: {
      title: 'IP 주소 조회',
      p1: '현재 인터넷에 연결된 기기의 공인 IP 주소와 관련 지리 정보를 실시간으로 표시합니다. IP 주소는 인터넷에서 기기를 식별하는 고유 번호로, ISP(인터넷 서비스 제공업체)가 할당합니다.',
      p2: '원격 접속 설정, 방화벽 허용 목록 등록, 네트워크 문제 진단, 지역 제한 콘텐츠 접근 여부 확인 등에 활용됩니다. 또한 보안 감사에도 쓰입니다.',
      p3: '네트워크 관리자와 보안 담당자에게는 기본 진단 도구로, 일반 사용자에게는 내 접속 정보를 확인하는 도구로 유용합니다.',
      tip: '이 도구는 외부 API(ipinfo.io, ipify)를 순차 호출해 정보를 가져옵니다. 표시되는 위치는 IP 할당 기준이므로 실제 물리 위치와 차이가 있을 수 있습니다.',
    },
    glossary: {
      publicIp: { term: '공인 IP 주소', desc: '인터넷망에서 내 기기를 식별하는 고유 주소로, ISP가 할당합니다. 사설 IP와 달리 외부에서 접근할 때 사용됩니다.' },
      isp: { term: 'ISP (인터넷 서비스 제공업체)', desc: 'KT, SK브로드밴드, LG유플러스처럼 인터넷 회선을 제공하는 통신사입니다. 사용자에게 공인 IP를 배정합니다.' },
      vpn: { term: 'VPN (가상 사설망)', desc: '통신을 암호화하고 다른 서버를 경유시키는 기술로, 사용 시 실제 IP 대신 VPN 서버의 IP가 표시됩니다.' },
      geoIp: { term: 'IP 기반 지리위치', desc: 'IP 주소의 할당 정보를 이용해 대략적인 도시·지역을 추정하는 방식으로, 정확한 실제 주소는 알 수 없습니다.' },
    },
    formula: {
      lookupMethod: '조회 방식',
      lookupDesc: '외부 API를 통해 접속 IP를 파악하고 지리 정보를 조회합니다. 두 API를 순차로 시도합니다.',
      primary: '1차 시도: ipinfo.io',
      primaryDesc: 'IP, 도시, 지역, 국가, 좌표, ISP, 시간대 등 상세 정보를 제공합니다.',
      fallback: '대체: ipify',
      fallbackDesc: '1차 실패 시 최소한의 IP 정보를 가져와 표시합니다.',
    },
    tips: {
      vpn: 'VPN 활용',
      vpnTip1: 'IP를 숨기려면 VPN 서비스를 사용하세요.',
      vpnTip2: 'VPN 연결 시 표시 IP가 달라집니다.',
      privacy: '프라이버시',
      privacyTip1: '공인 IP는 대략적인 위치를 노출할 수 있습니다.',
      privacyTip2: '공유기 외부 IP는 관리 페이지에서도 확인 가능합니다.',
      remoteAccess: '원격 접속 설정',
      remoteTip1: '방화벽 허용 목록에 내 IP를 등록하세요.',
      remoteTip2: '고정 IP가 아니면 주기적으로 갱신하세요.',
      troubleshooting: '네트워크 진단',
      troubleTip1: '연결 문제 발생 시 내 IP와 ISP를 먼저 확인하세요.',
      troubleTip2: '예상과 다르면 공유기 재시작을 고려하세요.',
      regionCheck: '지역 제한 확인',
      regionTip1: '콘텐츠 접근 가능 여부를 IP 기반으로 판단합니다.',
      regionTip2: '국가 정보는 ISP 할당 기준임을 유의하세요.',
      security: '보안 감사',
      securityTip1: '의심스러운 접속은 IP로 출처를 추적하세요.',
      securityTip2: '로그인 알림의 IP와 비교해 보세요.',
    },
  },
  invoiceGenerator: {
    title: '인보이스 생성기',
    description: '전문적인 청구서(인보이스)를 작성하고 인쇄할 수 있습니다.',
    inputs: {
      companyName: '회사명',
      companyNamePlaceholder: '회사 이름',
      clientName: '고객명',
      clientNamePlaceholder: '고객 이름',
      companyAddress: '회사 주소',
      companyAddressPlaceholder: '회사 주소',
      clientAddress: '고객 주소',
      clientAddressPlaceholder: '고객 주소',
      invoiceNumber: '인보이스 번호',
      invoiceDate: '발행일',
      taxRate: '세율 (%)',
      items: '품목',
      addItem: '추가',
      itemName: '품목명',
      unitPrice: '단가',
      notes: '비고',
      notesPlaceholder: '추가 메모 (선택사항)',
      preview: '미리보기',
      backToInput: '입력으로 돌아가기',
      print: '인쇄',
    },
    results: {
      summary: '요약',
      itemCount: '품목 수:',
      subtotal: '소계:',
      tax: '부가세 ({rate}%):',
      total: '합계:',
      previewHint: '「미리보기」 버튼을 눌러 인보이스를 확인하세요.',
      countUnit: '개',
    },
    preview: {
      title: '인보이스 미리보기',
      billTo: '청구 대상:',
      invoiceLabel: '인보이스 (청구서)',
      number: '번호:',
      date: '날짜:',
      itemHeader: '품목',
      quantityHeader: '수량',
      unitPriceHeader: '단가',
      amountHeader: '금액',
      subtotalLabel: '소계:',
      taxLabel: '부가세 ({rate}%):',
      totalLabel: '합계:',
      notesLabel: '비고:',
    },
    info: {
      title: '인보이스 생성기',
      p1: '전문적인 청구서(인보이스)를 손쉽게 작성하고 인쇄할 수 있는 도구입니다. 회사 정보, 고객 정보, 품목 목록, 세율 등을 입력하면 소계·부가세·합계를 자동으로 계산하여 깔끔한 인보이스를 만들어 줍니다.',
      p2: '프리랜서, 소상공인, 스타트업, 영업 담당자에게 매출 관리와 고객 청구는 필수 업무입니다. 엑셀이나 회계 소프트웨어 없이도 브라우저에서 바로 청구서를 발급하고 인쇄·PDF 저장할 수 있습니다.',
      p3: '품목을 자유롭게 추가·삭제하고 수량과 단가를 관리할 수 있으며, 비고와 인보이스 번호도 직접 지정할 수 있습니다.',
      tip: '한국의 표준 부가세율은 10%이며, 면세 품목은 0%로 설정합니다. 세금계산서가 필요한 거래는 법적 요건(사업자등록번호, 상호, 공급가액과 세액 구분 등)을 별도로 확인하세요. 이 도구는 참고용 양식입니다.',
    },
    glossary: {
      invoice: { term: '인보이스(청구서)', desc: '판매자가 구매자에게 거래 품목·수량·금액을 정리해 대금을 청구하는 문서입니다. 거래 내역 증빙과 대금 회수의 기준이 됩니다.' },
      vat: { term: '부가가치세(VAT)', desc: '재화나 용역 거래에 붙는 세금으로 한국의 표준세율은 10%입니다. 공급가액에 세율을 곱해 계산하며, 최종 소비자가 부담합니다.' },
      subtotal: { term: '소계(Subtotal)', desc: '부가세를 더하기 전 모든 품목 금액(수량 × 단가)을 합한 금액입니다. 여기에 부가세를 더하면 최종 합계가 됩니다.' },
      taxInvoice: { term: '세금계산서', desc: '사업자 간 거래에서 부가세 신고·공제를 위해 발급하는 법정 증빙 서류입니다. 사업자등록번호, 공급가액과 세액 구분 등 필수 기재사항이 있습니다.' },
    },
    formula: {
      itemAmount: '품목별 금액',
      itemFormula: '품목 금액 = 수량 × 단가',
      subtotal: '소계 (Subtotal)',
      subtotalFormula: '소계 = Σ (수량 × 단가)',
      taxTotal: '부가세와 합계',
      taxFormula: '부가세 = 소계 × (세율 ÷ 100)',
      totalFormula: '합계 = 소계 + 부가세',
      example: '예: 소계 100,000원, 세율 10% → 부가세 10,000원, 합계 110,000원',
    },
    tips: {
      itemEntry: '품목 작성',
      itemTip1: '품목명은 구체적으로 작성해 고객이 이해하기 쉽게 하세요.',
      itemTip2: '수량과 단가를 정확히 입력하면 합계가 자동 계산됩니다.',
      taxSetup: '세율 설정',
      taxTip1: '표준 세율은 10%, 면세 품목은 0%입니다.',
      taxTip2: '간이과세자 여부를 먼저 확인하세요.',
      invoiceNumber: '인보이스 번호',
      numTip1: '고유 번호를 부여해 추적과 대조를 쉽게 하세요.',
      numTip2: '연도·월별 번호 체계를 정해 두면 편리합니다.',
      printStore: '인쇄와 보관',
      printTip1: '인쇄 친화 레이아웃으로 PDF 저장이 가능합니다.',
      printTip2: '발행 복사본은 거래 내역과 함께 보관하세요.',
      legalReqs: '법적 요건',
      legalTip1: '세금계산서 발행 시 사업자등록번호 등을 기재하세요.',
      legalTip2: '공급가액과 세액을 구분 기재하는 것이 일반적입니다.',
      notes: '비고 활용',
      notesTip1: '결제 기한·계좌·환불 정책 등을 비고에 적으세요.',
      notesTip2: '약관을 간략히 적어 분쟁을 예방하세요.',
    },
  },
  internetSpeedTest: {
    title: '인터넷 속도 테스트',
    description: '인터넷 연결 속도를 시뮬레이션하여 측정합니다. (시뮬레이션 결과)',
    inputs: {
      title: '인터넷 속도 테스트',
      subtitle: '이 테스트는 시뮬레이션된 결과입니다. 실제 인터넷 속도와 다를 수 있습니다.',
      startTest: '테스트 시작',
      pingTesting: '핑(Ping) 테스트 중...',
      downloadTesting: '다운로드 속도 테스트 중...',
      uploadTesting: '업로드 속도 테스트 중...',
      stop: '중지',
      retest: '다시 테스트',
    },
    results: {
      empty: '테스트를 시작하면 결과가 표시됩니다.',
      ping: '핑 (ms)',
      download: '다운로드 (Mbps)',
      upload: '업로드 (Mbps)',
      speedVisual: '속도 시각화',
      downloadLabel: '다운로드',
      uploadLabel: '업로드',
      details: '상세 결과',
      pingLatency: '핑 지연 시간:',
      jitter: '지터(Jitter):',
      downloadSpeed: '다운로드:',
      uploadSpeed: '업로드:',
    },
    ratings: {
      ping: { excellent: '매우 우수', good: '우수', fair: '보통', poor: '느림' },
      download: { excellent: '매우 빠름', good: '빠름', fair: '보통', poor: '느림' },
      upload: { good: '빠름', fair: '보통', poor: '느림' },
    },
    info: {
      title: '인터넷 속도 테스트',
      p1: '현재 인터넷 연결의 다운로드·업로드 속도와 핑(Ping) 지연 시간을 측정하는 도구입니다. 가정이나 사무실의 회선이 약속된 속도를 내는지 빠르게 점검할 수 있습니다.',
      p2: '재택근무자, 게이머, 영상 스트리밍 이용자, 네트워크 관리자에게 유용합니다. 통신사 가입 속도와 실제 체감 속도의 차이를 확인하고 문제를 좁혀가는 데 활용됩니다.',
      p3: '초보자에게는 느린 인터넷의 원인을 찾는 진단 도구로, IT 담당자에게는 장애 대응의 1차 확인 도구로 쓰입니다.',
      tip: '이 도구는 시뮬레이션된 결과를 제공하므로 참고용입니다. 실제 정확한 측정에는 Speedtest.net, Fast.com 등 전용 서비스를 이용하세요.',
    },
    glossary: {
      ping: { term: '핑(Ping) / 지연 시간', desc: '데이터가 서버까지 갔다 돌아오는 데 걸리는 왕복 시간(ms)입니다. 값이 작을수록 반응이 빠르며, 온라인 게임과 화상회의에서 특히 중요합니다.' },
      mbps: { term: 'Mbps (초당 메가비트)', desc: '초당 전송되는 데이터 양을 나타내는 인터넷 속도 단위입니다. 숫자가 클수록 빠르며, 8Mbps가 약 1MB/s에 해당합니다.' },
      speeds: { term: '다운로드 / 업로드 속도', desc: '다운로드는 인터넷에서 데이터를 받는 속도, 업로드는 내 기기에서 인터넷으로 보내는 속도입니다. 일반 가정 회선은 다운로드가 업로드보다 빠른 경우가 많습니다.' },
      jitter: { term: '지터(Jitter)', desc: '핑 지연 시간이 얼마나 들쭉날쭉한지를 나타내는 변동폭입니다. 작을수록 연결이 안정적이며, 크면 통화나 게임에서 끊김이 생깁니다.' },
    },
    formula: {
      ping: '핑(Ping) 측정',
      pingDesc: '서버에 패킷을 보내고 응답까지 왕복 시간을 측정합니다.',
      pingFormula: 'Ping = 왕복 시간(RTT) ÷ 2',
      download: '다운로드 속도',
      downloadDesc: '일정량의 데이터를 받는 데 걸린 시간으로 속도를 계산합니다.',
      downloadFormula: '속도(Mbps) = (데이터량 × 8) ÷ 시간(초) ÷ 1,000,000',
      uploadJitter: '업로드 속도와 지터',
      uploadFormula: '업로드 속도 = (전송량 × 8) ÷ 시간(초) ÷ 1,000,000',
      jitterNote: '지터(Jitter)는 핑 지연 시간의 변동폭으로, 작을수록 안정적입니다.',
    },
    tips: {
      wired: '유선 연결',
      wiredTip1: '가능하면 이더넷 케이블을 사용해 와이파이 간섭을 제거하세요.',
      wiredTip2: '공유기와 가까울수록 안정적인 결과를 얻습니다.',
      otherDevices: '다른 기기 차단',
      otherTip1: '테스트 중 다른 기기의 스트리밍·다운로드를 멈추세요.',
      otherTip2: '백그라운드 업데이트도 속도를 잡아먹습니다.',
      vpn: 'VPN 비활성화',
      vpnTip1: 'VPN 사용 시 암호화 오버헤드로 지연이 커집니다.',
      vpnTip2: '순수 회선 속도를 보려면 VPN을 끄세요.',
      repeat: '반복 측정',
      repeatTip1: '여러 번 측정해 평균과 최솟값을 비교하세요.',
      repeatTip2: '시간대에 따라 망 혼잡도가 달라집니다.',
      speedRef: '속도 기준',
      speedRefTip1: '웹·HD 5~10 Mbps, 4K 25 Mbps, 화상회의 10~20 Mbps 권장',
      speedRefTip2: '온라인 게임은 핑 20 ms 이하가 유리합니다.',
      troubleshooting: '문제 대응',
      troubleTip1: '느리면 공유기 재시작과 펌웨어 점검을 먼저 하세요.',
      troubleTip2: '지속 이상 시 통신사에 회선 점검을 요청하세요.',
    },
  },
  jsonPrettifier: {
    title: 'JSON 프리티피어',
    description: '미니파이된 JSON을 읽기 쉬운 들여쓰기 형식으로 포맷합니다',
    inputLabelMinified: '압축된 JSON 입력',
    inputLabelIndent: '들여쓰기 (칸 수)',
    button: 'JSON 포맷하기',
    copyButton: '복사',
    emptyPrompt: 'JSON을 붙여넣고 포맷 버튼을 클릭하세요',
    invalidJson: '잘못된 JSON:',
  },
  textSummarizer: {
    title: '텍스트 요약 도구',
    description: '긴 텍스트를 핵심 문장만 추출하여 요약합니다',
    inputLabel: '요약할 텍스트 입력',
    inputPlaceholder: '텍스트를 입력하세요...',
    lengthLabel: '요약 길이',
    short: '짧게',
    medium: '보통',
    long: '길게',
    button: '요약하기',
    wordCount: '{original} 단어 \u2192 {summary} 단어',
    reduction: '{percent}% 축소',
    copyButton: '복사',
    emptyPrompt: '텍스트를 입력하고 요약하기를 클릭하세요',
  },
  yamlGenerator: {
    title: 'YAML 생성기',
    description: '커스텀 구조로 랜덤 YAML 데이터를 생성합니다',
    itemCountLabel: '항목 수',
    keyNamesLabel: '키 이름 (쉼표로 구분)',
    button: 'YAML 생성',
    copyButton: '복사',
    downloadButton: '다운로드',
    emptyPrompt: '옵션을 설정하고 생성 버튼을 클릭하세요',
    alertMessage: '하나 이상의 키 이름을 입력하세요.',
  },
  meetingNotes: {
    title: '회의록 작성기',
    description: '체계적인 회의록을 마크다운 형식으로 자동 생성합니다',
    titleLabel: '회의 제목',
    titlePlaceholder: '프로젝트 팀 미팅',
    dateLabel: '회의 날짜',
    attendeesLabel: '참석자',
    attendeesPlaceholder: '홍길동, 김철수, 이영희',
    agendaLabel: '안건',
    agendaItemLabel: '안건 {n}',
    deleteButton: '삭제',
    topicPlaceholder: '안건 주제',
    presenterPlaceholder: '발표자',
    discussionPlaceholder: '논의 내용',
    decisionPlaceholder: '결정 사항',
    addAgendaButton: '안건 추가',
    actionLabel: '액션 아이템',
    actionItemLabel: '작업 {n}',
    taskPlaceholder: '작업 내용',
    assigneePlaceholder: '담당자',
    addActionButton: '액션 아이템 추가',
    generateButton: '회의록 생성',
    copyButton: '마크다운 복사',
    emptyPrompt: '회의 정보를 입력하고 회의록 생성을 클릭하세요',
  },
  promptGenerator: {
    title: '프롬프트 생성기',
    description: 'AI 도구 활용을 위한 효과적인 프롬프트를 생성합니다',
    categoryLabel: '카테고리',
    writing: '글쓰기',
    coding: '코딩',
    analysis: '분석',
    creative: '창작',
    detailLabel: '상세도',
    basic: '기본',
    detailed: '상세',
    veryDetailed: '매우 상세',
    button: '프롬프트 생성',
    copyAllButton: '전체 복사',
    copyButton: '복사',
    emptyPrompt: '카테고리를 선택하고 프롬프트 생성을 클릭하세요',
  },
  xmlGenerator: {
    title: 'XML 생성기',
    description: '커스텀 구조로 랜덤 XML 문서를 생성합니다',
    rootLabel: '루트 요소 이름',
    itemLabel: '항목 요소 이름',
    fieldLabel: '필드 이름 (쉼표로 구분)',
    countLabel: '항목 수',
    button: 'XML 생성',
    copyButton: '복사',
    downloadButton: '다운로드',
    emptyPrompt: '옵션을 설정하고 생성 버튼을 클릭하세요',
    alertMessage: '하나 이상의 필드 이름을 입력하세요.',
  },
  loremIpsumGenerator: {
    title: '로렘 입숨 생성기',
    description: '디자인 및 테스트용 랜덤 플레이스홀더 텍스트를 생성합니다',
    paragraphsLabel: '문단 수',
    sentencesLabel: '문단당 문장 수',
    button: '로렘 입숨 생성',
    wordCount: '{n} 단어',
    charCount: '{n} 자',
    paraCount: '{n} 문단',
    copyButton: '텍스트 복사',
    emptyPrompt: '옵션을 설정하고 생성 버튼을 클릭하세요',
  },
  jsonMinifier: {
    title: 'JSON 미니파이어',
    description: 'JSON에서 불필요한 공백을 제거하고 압축합니다',
    inputLabel: '포맷된 JSON 입력',
    button: 'JSON 미니파이',
    copyButton: '복사',
    sizeInfo: '원본: {original} 바이트 \u2192 압축됨: {minified} 바이트 ({percent}% 절약)',
    emptyPrompt: 'JSON을 붙여넣고 미니파이 버튼을 클릭하세요',
    invalidJson: '잘못된 JSON:',
  },
  morseCode: {
    title: '모스 부호 변환기',
    description: '텍스트와 국제 모스 부호를相互 변환합니다',
    textToMorse: '텍스트 \u2192 모스',
    morseToText: '모스 \u2192 텍스트',
    textInputLabel: '텍스트 입력',
    textInputPlaceholder: '모스 부호로 변환할 텍스트를 입력하세요...',
    morseInputLabel: '모스 부호 (점, 대시, 공백 사용; 단어 구분은 /)',
    morseInputPlaceholder: '. - .-. / .--. .-.. .- -. . -.-. --- -.. .',
    convertButton: '변환',
    playButton: '소리 재생',
    copyButton: '결과 복사',
    emptyPrompt: '텍스트 또는 모스 부호를 입력하고 변환 버튼을 클릭하세요',
    statsTextToMorse: '{chars} 자 \u2192 {symbols} 기호',
    statsMorseToText: '{symbols} 기호 \u2192 {chars} 자',
  },
  urlEncoder: {
    title: 'URL 인코더',
    description: '안전한 URL 전송을 위해 특수 문자를 인코딩합니다',
    inputLabel: '인코딩할 텍스트 또는 URL',
    inputPlaceholder: '예: https://example.com/path?name=John&age=30 또는 "Hello World & Special chars!"',
    encodeComponentButton: 'encodeURIComponent',
    encodeFullButton: 'encodeURI',
    button: 'URL 인코딩',
    copyButton: '인코딩된 URL 복사',
    emptyPrompt: '텍스트를 입력하고 인코딩 버튼을 클릭하세요',
  },
  jsonGenerator: {
    title: 'JSON 생성기',
    description: '커스텀 키와 구조로 랜덤 JSON 데이터를 생성합니다',
    itemCountLabel: '항목 수',
    keyNamesLabel: '키 이름 (쉼표로 구분)',
    button: 'JSON 생성',
    copyButton: '복사',
    downloadButton: '다운로드',
    emptyPrompt: '옵션을 설정하고 생성 버튼을 클릭하세요',
    alertMessage: '하나 이상의 키 이름을 입력하세요.',
  },
  urlDecoder: {
    title: 'URL 디코더',
    description: '퍼센트 인코딩된 URL을 원래 텍스트로 복원합니다',
    inputLabel: 'URL 인코딩 문자열',
    button: 'URL 디코딩',
    copyButton: '디코딩된 URL 복사',
    emptyPrompt: 'URL 인코딩 문자열을 입력하고 디코딩 버튼을 클릭하세요',
    invalidUrl: '잘못된 URL 인코딩:',
  },
  imageResizer: {
    title: '이미지 리사이저',
    description: '이미지 크기를 원하는 크기로 변환합니다',
    uploadLabel: '이미지 업로드',
    originalSize: '원본: {width} x {height}',
    targetSize: '목표 크기',
    maintainAspect: '비율 유지',
    resizeButton: '이미지 리사이즈',
    resultSize: '결과: {width} x {height}',
    downloadButton: '다운로드',
    emptyPromptResize: '크기를 설정하고 리사이즈를 클릭하세요',
    emptyPromptUpload: '이미지를 업로드하세요',
  },
  imageConverter: {
    title: '이미지 형식 변환기',
    description: 'PNG, JPEG, WebP 형식간 이미지를 변환합니다',
    uploadLabel: '이미지 업로드',
    chooseButton: '이미지 파일 선택',
    formatLabel: '출력 형식',
    qualityLabel: '품질: {quality}%',
    converting: '변환 중...',
    convertButton: '이미지 변환',
    convertedInfo: '변환됨: {size} | {format}',
    savedInfo: '절약됨: {size} ({percent}%)',
    downloadButton: '변환된 이미지 다운로드',
    originalPreview: '원본 미리보기',
    emptyPrompt: '이미지를 업로드하고 변환 버튼을 클릭하세요',
    errorSelectFile: '유효한 이미지 파일을 선택하세요.',
    errorCanvas: 'Canvas 컨텍스트를 생성할 수 없습니다.',
    errorConversion: '변환에 실패했습니다. 다른 형식이나 낮은 품질을 시도하세요.',
    errorLoad: '이미지를 불러올 수 없습니다. 파일이 손상되었을 수 있습니다.',
  },
  base64Encoder: {
    title: 'Base64 인코더',
    description: '일반 텍스트를 Base64 형식으로 인코딩합니다',
    inputLabel: '일반 텍스트',
    inputPlaceholder: '인코딩할 텍스트를 입력하세요...',
    button: 'Base64로 인코딩',
    copyButton: 'Base64 복사',
    emptyPrompt: '텍스트를 입력하고 인코딩 버튼을 클릭하세요',
    stats: '{chars} 자 ({inputLen} \u2192 {outputLen}, {percent}% 증가)',
    encodingError: '인코딩 오류:',
  },
  codeExplainer: {
    title: '코드 설명기',
    description: '코드를 분석하여 구조와 요소를 설명합니다',
    languageLabel: '프로그래밍 언어',
    codeLabel: '코드 입력',
    codePlaceholder: '분석할 코드를 입력하세요...',
    button: '코드 설명',
    copyButton: '설명 복사',
    emptyPrompt: '코드를 입력하고 코드 설명을 클릭하세요',
  },
  base64Decoder: {
    title: 'Base64 디코더',
    description: 'Base64 인코딩 문자열을 원래 텍스트로 복원합니다',
    inputLabel: 'Base64 인코딩 문자열',
    inputPlaceholder: '디코딩할 Base64 문자열을 입력하세요...',
    button: 'Base64 디코딩',
    copyButton: '디코딩된 텍스트 복사',
    emptyPrompt: 'Base64 문자열을 입력하고 디코딩 버튼을 클릭하세요',
    invalidBase64: '잘못된 Base64:',
  },
  mortgage: {
    title: '주택담보대출 계산기',
    description:
      '주택 가격, 선수금, 금리, 추가 비용까지 고려한 월 예상 납부액을 계산합니다.',
    inputs: {
      homePrice: '주택 가격',
      downPayment: '선수금 / 다운페이먼트',
      downPaymentHint: '대출 원금:',
      loanTerm: '대출 기간 (년)',
      annualRate: '연 이자율 (%)',
      startYear: '상환 시작 연도',
      startMonth: '상환 시작 월',
      additionalCosts: '월 추가 비용 (선택)',
      additionalHint: '원리금 외 매달 고정 지출입니다. 모르면 0으로 두세요.',
      propertyTax: '재산세 (연, 원)',
      homeInsurance: '주택 보험 (연, 원)',
      pmi: 'PMI 보험 (연 %)',
      hoa: 'HOA 관리비 (월, 원)',
    },
    results: {
      monthlyPayment: '월 예상 납부액',
      monthlyBreakdown: '월 비용 구성',
      additional: '추가 비용',
      principalInterest: '원리금 상환',
      propertyTax: '재산세',
      homeInsurance: '주택 보험',
      pmi: 'PMI 보험',
      hoa: 'HOA 관리비',
      loanAmount: '대출 원금',
      downPayment: '선수금',
      totalInterest: '총 이자',
      payoffDate: '상환 종료일',
      principalInterestSplit: '원금·이자 분포',
      amortizationSchedule: '분할 상환 스케줄 (연도별)',
      year: '연도',
      yearlyInterest: '연간 이자',
      yearlyPrincipal: '연간 원금',
      balance: '잔액',
      detailAnalysis: '상세 분석',
      calculateHint: "입력 후 '계산하기' 버튼을 눌러주세요.",
    },
    glossary: {
      title: '용어 풀이',
      downPayment:
        '선수금(다운페이먼트): 주택 매입 시 내가 직접 내는 돈. 클수록 빌리는 원금과 이자가 줄어듭니다.',
      propertyTax:
        '재산세: 보유한 부동산에 매년 부과되는 세금(공시가격 기준).',
      homeInsurance:
        '주택 보험: 화재·풍수해 등으로 인한 주택 손해를 보장하는 보험료입니다.',
      pmi:
        'PMI: Private Mortgage Insurance(민간 모기지 보험). 선수금 비중이 낮을 때 가입하는 보험료로, 한국에선 주택담보대출 보증 형태로 흔히 가입합니다.',
      hoa:
        'HOA: Homeowners Association(공동주택 관리회). 아파트 단지 공용시설 유지비로 한국 아파트 관리비에 해당합니다.',
    },
    formula: {
      title: '원리금 균등상환 공식',
      m: 'M: 월 원리금 상환액',
      p: 'P: 대출 원금 (주택가격 − 선수금)',
      r: 'r: 월 이자율 (연이율 ÷ 12)',
      n: 'n: 총 상환 개월 수 (대출기간(년) × 12)',
      note: '월 총 납부액 = 월 원리금 + (재산세 + 주택보험 + PMI + HOA)의 월 환산액입니다. 상환 종료일은 시작 연/월로부터 n개월 후로 계산됩니다.',
    },
    tips: {
      title: '주택담보대출, 이렇게 활용하세요',
      items: {
        dti: {
          title: 'DSR부터 먼저 따져보세요',
          body: 'DSR(총부채상환비율)은 연 소득 대비 모든 가계대출의 연간 원리금 상환액 비율입니다. 주택담보대출은 금액이 커 이 기준을 넘으면 대출 한도가 줄어드니, 실제 빌릴 수 있는 금액을 먼저 확인하세요.',
        },
        downPayment: {
          title: '선수금 비율이 곧 매달 내 돈',
          body: '선수금(다운페이먼트)을 많이 낼수록 빌리는 원금과 총 이자가 줄어 매월 납부액이 낮아집니다. 자금 여력이 된다면 선수금 비율을 높이는 것이 가장 확실한 이자 절약 방법입니다.',
        },
        rate: {
          title: '고정금리와 변동금리를 비교하세요',
          body: '금리 상승기에는 금리 변동 위험을 막아주는 고정금리가, 하락기에는 초기 금리가 낮은 변동금리가 유리합니다. 30년 같은 장기 대출은 금리 변동에 따른 총이자 차이가 큽니다.',
        },
        hidden: {
          title: '「원리금」만 보지 말고 숨은 비용을 합치세요',
          body: '재산세, 주택보험, PMI, HOA 관리비를 빼고 원리금만 보면 실제 월 부담을 과소평가합니다. 이 계산기의 「월 예상 납부액」은 이 모든 항목을 합친 진짜 고정 지출입니다.',
        },
        policy: {
          title: '정책 모기지 상품을 놓치지 마세요',
          body: '보금자리론, 디딤돌대출, 특례보금자리론 등은 시중 금리보다 낮은 금리로 이용할 수 있는 정부 지원 상품입니다. 가입 자격을 확인하고 적극 비교해 보세요.',
        },
        extra: {
          title: '중도 상환(추가 납입)으로 이자를 줄이세요',
          body: '여유 자금이 생기면 원금 일부를 중도 상환하면 남은 기간의 이자가 줄어듭니다. 대부분의 주택담보대출은 연 1회(총 한도 내) 중도상환 수수료가 면제되니 활용해 보세요.',
        },
      },
    },
  },
};
