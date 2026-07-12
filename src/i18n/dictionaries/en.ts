export const en = {
  common: {
    searchPlaceholder: 'Search for any calculator...',
    language: 'Language',
    selectLanguage: 'Select language',
    theme: 'Toggle theme',
    calculate: 'Calculate',
    calculating: 'Calculating...',
    result: 'Calculation Result',
    error: 'Please enter valid numbers',
    calculated: 'Calculated successfully.',
    enterValues: 'Please enter values to calculate.',
    clear: 'Clear',
    home: 'Home',
    back: 'Back',
    unitSystem: 'Unit System',
    unitSystemMetric: 'Metric (SI)',
    unitSystemImperial: 'Imperial (US)',
    categories: 'Categories',
    preparing: 'Coming Soon',
    moreTopics: 'More Topics',
    basicUnits: 'Basic Units',
    engineeringUnits: 'Engineering Units',
    unitCategories: {
      length: 'Length',
      area: 'Area',
      volume: 'Volume',
      temperature: 'Temperature',
      energy: 'Energy',
      flow: 'Flow',
      pressure: 'Pressure',
      mass: 'Mass',
      enthalpy: 'Enthalpy',
    },
    ohmsLaw: {
      title: 'Ohm\'s Law Calculator',
      description: 'Enter any 2 values among Voltage (V), Current (I), Resistance (R), and Power (P) to calculate the remaining values.',
      inputs: {
        voltage: 'Voltage (V)',
        current: 'Current (I)',
        resistance: 'Resistance (R)',
        power: 'Power (P)',
      },
      results: {
        enterTwo: 'Please enter exactly 2 values.',
        calculated: 'Calculated successfully.',
        clearTwo: 'Please clear at least 2 fields to calculate.',
      },
      details: {
        title: '📚 Ohm\'s Law Formulas & Theory',
        description: 'Ohm\'s law states that the current through a conductor between two points is directly proportional to the voltage across the two points.',
      }
    },
    idealGas: {
      title: 'Ideal Gas Law Calculator',
      description: 'Enter 3 values among Pressure (P), Volume (V), Moles (n), and Temperature (T) to calculate the remaining one.',
      inputs: {
        calcTarget: 'Calculate',
        pressure: 'Pressure (P)',
        volume: 'Volume (V)',
        moles: 'Moles (n)',
        temperature: 'Temperature (T)',
      },
      results: {
        pressure: 'Pressure (P)',
        volume: 'Volume (V)',
        moles: 'Moles (n)',
        temperature: 'Temperature (T)',
      },
      visualization: {
        title: 'Isotherm (P-V Curve)',
        xAxis: 'Volume (V)',
        yAxis: 'Pressure (P)',
      },
      details: {
        title: '📚 Ideal Gas Law Theory',
        description: 'The ideal gas law, also called the general gas equation, is the equation of state of a hypothetical ideal gas (PV = nRT).',
      }
    },
    pipeFriction: {
      title: 'Pipe Friction Loss Calculator',
      description: 'Calculate the head loss and pressure loss due to friction in a pipe using the Darcy-Weisbach equation.',
      inputs: {
        length: 'Pipe Length (L)',
        diameter: 'Inner Diameter (D)',
        velocity: 'Flow Velocity (v)',
        frictionFactor: 'Darcy Friction Factor (f)',
        density: 'Fluid Density (ρ)',
      },
      results: {
        headLoss: 'Head Loss (h_f)',
        pressureLoss: 'Pressure Loss (ΔP)',
      },
      visualization: {
        title: 'Losses Overview',
      },
      details: {
        title: '📚 Darcy-Weisbach Equation',
        description: 'The Darcy-Weisbach equation is a phenomenological equation that relates the head loss, or pressure loss, due to friction along a given length of pipe to the average velocity of the fluid flow for an incompressible fluid.',
      }
    },
    beamDeflection: {
      title: 'Beam Deflection Calculator',
      description: 'Calculate the maximum deflection of a cantilever beam with a point load at the free end.',
      inputs: {
        load: 'Point Load (P)',
        length: 'Beam Length (L)',
        elasticity: 'Modulus of Elasticity (E)',
        inertia: 'Moment of Inertia (I)',
      },
      results: {
        maxDeflection: 'Max Deflection (δ)',
      },
      visualization: {
        title: 'Beam Deflection Diagram',
      },
      details: {
        title: '📚 Cantilever Beam Deflection',
        description: 'The maximum deflection occurs at the free end of the cantilever beam and is calculated using the formula: δ = (P × L³) / (3 × E × I).',
      }
    },
    voltageDrop: {
      title: 'Voltage Drop Calculator',
      description: 'Calculate the voltage drop in an electrical circuit based on wire size, distance, and load current.',
      inputs: {
        material: 'Wire Material',
        copper: 'Copper (Cu)',
        aluminum: 'Aluminum (Al)',
        wireSize: 'Wire Size (AWG or mm²)',
        voltage: 'System Voltage (V)',
        phase: 'Phase',
        singlePhase: '1-Phase',
        threePhase: '3-Phase',
        current: 'Load Current (A)',
        distance: 'Cable Distance (L)',
      },
      results: {
        voltageDrop: 'Voltage Drop (V_drop)',
        percentage: 'Percentage Drop (%)',
        endVoltage: 'End Voltage (V_end)',
      },
      visualization: {
        title: 'Voltage Drop Diagram',
      },
      details: {
        title: '📚 Voltage Drop Formula',
        description: 'The voltage drop is calculated using Ohm\'s law (V = I × R). For a single-phase circuit: V_drop = 2 × I × R × L / 1000. For three-phase: V_drop = √3 × I × R × L / 1000.',
      }
    },
    thermalExpansion: {
      title: 'Thermal Expansion Calculator',
      description: 'Calculate the linear thermal expansion of a material due to temperature changes.',
      inputs: {
        material: 'Material',
        custom: 'Custom',
        aluminum: 'Aluminum',
        copper: 'Copper',
        steel: 'Steel',
        concrete: 'Concrete',
        glass: 'Glass',
        coefficient: 'Expansion Coefficient (α)',
        length: 'Initial Length (L₀)',
        t1: 'Initial Temp (T₁)',
        t2: 'Final Temp (T₂)',
      },
      results: {
        changeInLength: 'Change in Length (ΔL)',
        finalLength: 'Final Length (L₁)',
      },
      visualization: {
        title: 'Thermal Expansion Diagram',
      },
      details: {
        title: '📚 Linear Thermal Expansion',
        description: 'Linear thermal expansion is the change in length of a material due to a change in temperature. The formula is: ΔL = α × L₀ × ΔT.',
      }
    },
    asmeB313: {
      title: 'ASME B31.3 Pipe Pressure/Thickness',
      description: 'Calculate allowable pressure or required wall thickness of a pipe based on ASME B31.3 code.',
      inputs: {
        calcTarget: 'Calculate',
        targetPressure: 'Allowable Pressure (P)',
        targetThickness: 'Wall Thickness (t)',
        diameter: 'Outside Diameter (D)',
        thickness: 'Wall Thickness (t)',
        pressure: 'Internal Pressure (P)',
        stress: 'Allowable Stress (S)',
        qualityFactor: 'Quality Factor (E)',
        coefficientY: 'Thickness Coefficient (Y)',
        tolerance: 'Thickness Tolerance (α, %)',
      },
      results: {
        allowablePressure: 'Allowable Pressure (P)',
        requiredThickness: 'Required Thickness (t)',
      },
      visualization: {
        title: 'Pipe Cross-Section',
      },
      details: {
        title: '📚 ASME B31.3 Equation',
        description: 'The ASME B31.3 code uses the formula: t = (P × D) / (2 × (S × E + P × Y)) for required thickness, and P = (2 × t × S × E) / (D - 2 × t × Y) for allowable pressure.',
      }
    },
    barlowsFormula: {
      title: 'Barlow\'s Formula Calculator',
      description: 'Calculate the internal, allowable, and ultimate burst pressure of a pipe using Barlow\'s formula.',
      inputs: {
        diameter: 'Outside Diameter (D_o)',
        thickness: 'Wall Thickness (t)',
        yieldStrength: 'Yield Strength (S_y)',
        ultimateStrength: 'Ultimate Strength (S_t)',
        designFactor: 'Design Factor (F_d)',
        jointFactor: 'Joint Factor (F_e)',
        temperatureFactor: 'Temperature Factor (F_t)',
      },
      results: {
        yieldPressure: 'Pressure at Yield (P_y)',
        burstPressure: 'Burst Pressure (P_t)',
        allowablePressure: 'Allowable Pressure (P_a)',
      },
      visualization: {
        title: 'Pressure Limits Overview',
      },
      details: {
        title: '📚 Barlow\'s Formula Theory',
        description: 'Barlow\'s formula relates the internal pressure of a pipe to the dimensions and strength of its material. P_y = (2 × S_y × t) / D_o, P_t = (2 × S_t × t) / D_o, P_a = (2 × S_y × F_d × F_e × F_t × t) / D_o.',
      }
    },
    asmeSectionViii: {
      title: 'ASME Section VIII Vessel Calculator',
      description: 'Calculate the required thickness for cylindrical and spherical pressure vessels under internal pressure according to ASME Section VIII Div 1.',
      inputs: {
        vesselType: 'Vessel Type',
        cylinder: 'Cylinder',
        sphere: 'Sphere',
        pressure: 'Design Pressure (P)',
        radius: 'Inner Radius (R)',
        stress: 'Allowable Stress (S)',
        efficiency: 'Joint Efficiency (E)',
      },
      results: {
        thickness: 'Required Thickness (t)',
      },
      visualization: {
        title: 'Vessel Cross-Section',
      },
      details: {
        title: '📚 ASME Section VIII Div 1',
        description: 'For Cylinders: t = (P × R) / (S × E - 0.6 × P). For Spheres: t = (P × R) / (2 × S × E - 0.2 × P).',
      }
    },
    heatTransfer: {
      title: 'Heat Conduction Calculator',
      description: 'Calculate the rate of heat transfer through a material using Fourier\'s Law of heat conduction.',
      inputs: {
        area: 'Surface Area (A)',
        thickness: 'Material Thickness (d)',
        conductivity: 'Thermal Conductivity (k)',
        t1: 'Hot Temperature (T₁)',
        t2: 'Cold Temperature (T₂)',
      },
      results: {
        heatRate: 'Heat Transfer Rate (Q)',
        heatFlux: 'Heat Flux (q = Q/A)',
      },
      visualization: {
        title: 'Temperature Gradient',
      },
      details: {
        title: '📚 Fourier\'s Law',
        description: 'Fourier\'s law of heat conduction: Q = (k × A × ΔT) / d, where k is thermal conductivity, A is area, and d is thickness.',
      }
    },
    sensibleHeat: {
      title: 'Sensible Heat Calculator',
      description: 'Calculate the sensible heat load required to change the temperature of a substance without changing its phase.',
      inputs: {
        massFlow: 'Mass Flow Rate (m)',
        specificHeat: 'Specific Heat Capacity (C_p)',
        t1: 'Initial Temperature (T₁)',
        t2: 'Final Temperature (T₂)',
      },
      results: {
        heatLoad: 'Sensible Heat Load (Q)',
      },
      visualization: {
        title: 'Heating/Cooling Process',
      },
      details: {
        title: '📚 Sensible Heat Formula',
        description: 'The formula for sensible heat is Q = m × C_p × ΔT. It applies when there is no phase change in the substance.',
      }
    },
    reynoldsNumber: {
      title: 'Reynolds Number Calculator',
      description: 'Calculate the Reynolds number to determine whether fluid flow is laminar or turbulent.',
      inputs: {
        density: 'Fluid Density (ρ)',
        velocity: 'Flow Velocity (v)',
        diameter: 'Pipe Inner Diameter (D)',
        viscosity: 'Dynamic Viscosity (μ)',
      },
      results: {
        reynoldsNumber: 'Reynolds Number (Re)',
        flowRegime: 'Flow Regime',
        laminar: 'Laminar Flow',
        transitional: 'Transitional Flow',
        turbulent: 'Turbulent Flow',
      },
      visualization: {
        title: 'Flow Characteristics',
      },
      details: {
        title: '📚 Reynolds Number Theory',
        description: 'The Reynolds number is a dimensionless quantity used to predict fluid flow patterns. Re = (ρ × v × D) / μ. Laminar < 2300, Transitional 2300-4000, Turbulent > 4000.',
      }
    },
    springRate: {
      title: 'Spring Rate Calculator',
      description: 'Calculate the spring constant (rate) of a helical compression spring.',
      inputs: {
        wireDiameter: 'Wire Diameter (d)',
        outerDiameter: 'Outer Diameter (D_o)',
        activeCoils: 'Number of Active Coils (n_a)',
        shearModulus: 'Shear Modulus (G)',
      },
      results: {
        springRate: 'Spring Rate (k)',
        meanDiameter: 'Mean Diameter (D)',
      },
      visualization: {
        title: 'Spring Geometry',
      },
      details: {
        title: '📚 Spring Rate Formula',
        description: 'The spring rate k is calculated as: k = (G × d⁴) / (8 × D³ × n_a), where D is the mean diameter (D_o - d).',
      }
    },
    radiationHeat: {
      title: 'Radiation Heat Transfer',
      description: 'Calculate the net radiation heat transfer between an object and its surroundings using the Stefan-Boltzmann Law.',
      inputs: {
        emissivity: 'Emissivity (ε)',
        area: 'Surface Area (A)',
        t1: 'Object Temperature (T₁)',
        t2: 'Surroundings Temp (T₂)',
      },
      results: {
        heatTransfer: 'Net Heat Transfer (Q)',
      },
      visualization: {
        title: 'Radiation Process',
      },
      details: {
        title: '📚 Stefan-Boltzmann Law',
        description: 'Net radiation heat transfer Q = ε × σ × A × (T₁⁴ - T₂⁴). σ is the Stefan-Boltzmann constant (5.67×10⁻⁸ W/m²K⁴). Note: Temperatures must be in absolute scale (Kelvin or Rankine).',
      }
    },
    gearRatio: {
      title: 'Gear Ratio Calculator',
      description: 'Calculate the gear ratio, output speed, and output torque of a simple gear train.',
      inputs: {
        teeth1: 'Driving Gear Teeth (N₁)',
        teeth2: 'Driven Gear Teeth (N₂)',
        speed1: 'Driving Gear Speed (RPM₁)',
        torque1: 'Driving Gear Torque (τ₁)',
      },
      results: {
        gearRatio: 'Gear Ratio (GR)',
        speed2: 'Driven Gear Speed (RPM₂)',
        torque2: 'Driven Gear Torque (τ₂)',
      },
      visualization: {
        title: 'Gear Train Process',
      },
      details: {
        title: '📚 Gear Ratio Formula',
        description: 'Gear Ratio = N₂ / N₁. Output Speed = Input Speed / Gear Ratio. Output Torque = Input Torque × Gear Ratio.',
      }
    },
    bernoulli: {
      title: 'Bernoulli Equation Calculator',
      description: 'Calculate fluid velocity or pressure at a second point using Bernoulli\'s equation for incompressible flow.',
      inputs: {
        density: 'Fluid Density (ρ)',
        p1: 'Pressure at Point 1 (P₁)',
        v1: 'Velocity at Point 1 (v₁)',
        h1: 'Elevation at Point 1 (h₁)',
        p2: 'Pressure at Point 2 (P₂)',
        h2: 'Elevation at Point 2 (h₂)',
      },
      results: {
        v2: 'Velocity at Point 2 (v₂)',
      },
      visualization: {
        title: 'Fluid Flow Process',
      },
      details: {
        title: '📚 Bernoulli Equation',
        description: 'P₁ + ½ρv₁² + ρgh₁ = P₂ + ½ρv₂² + ρgh₂. Assumes steady, incompressible, frictionless flow along a streamline.',
      }
    },
    carnotEfficiency: {
      title: 'Carnot Efficiency Calculator',
      description: 'Calculate the maximum theoretical efficiency of a heat engine operating between two temperatures.',
      inputs: {
        th: 'Hot Reservoir Temp (T_H)',
        tc: 'Cold Reservoir Temp (T_C)',
      },
      results: {
        efficiency: 'Carnot Efficiency (η)',
      },
      visualization: {
        title: 'Heat Engine Process',
      },
      details: {
        title: '📚 Carnot Efficiency Formula',
        description: 'η = 1 - (T_C / T_H). Temperatures must be in absolute scale (Kelvin or Rankine). This represents the maximum possible efficiency for any heat engine.',
      }
    },
    stressStrain: {
      title: 'Stress & Strain Calculator',
      description: 'Calculate stress, strain, and Young\'s modulus of a material under axial load.',
      inputs: {
        force: 'Applied Force (F)',
        area: 'Cross-sectional Area (A)',
        originalLength: 'Original Length (L₀)',
        changeLength: 'Change in Length (ΔL)',
      },
      results: {
        stress: 'Stress (σ)',
        strain: 'Strain (ε)',
        youngsModulus: 'Young\'s Modulus (E)',
      },
      visualization: {
        title: 'Deformation Visualization',
      },
      details: {
        title: '📚 Stress and Strain Formulas',
        description: 'Stress σ = F/A, Strain ε = ΔL/L₀, and Young\'s Modulus E = σ/ε.',
      }
    },
    eulerBuckling: {
      title: 'Euler Buckling Load Calculator',
      description: 'Calculate the critical buckling load of a column using Euler\'s formula.',
      inputs: {
        elasticModulus: 'Young\'s Modulus (E)',
        inertia: 'Area Moment of Inertia (I)',
        length: 'Unsupported Length (L)',
        kFactor: 'Effective Length Factor (K)',
      },
      results: {
        criticalLoad: 'Critical Buckling Load (P_cr)',
      },
      visualization: {
        title: 'Buckling Mode Shape',
      },
      details: {
        title: '📚 Euler\'s Critical Load',
        description: 'P_cr = (π² × E × I) / (K × L)². This represents the maximum axial load that a long, slender column can carry without buckling.',
      }
    },
    rcCircuit: {
      title: 'RC Circuit Calculator',
      description: 'Calculate the time constant and maximum charge of a Resistor-Capacitor circuit.',
      inputs: {
        resistance: 'Resistance (R)',
        capacitance: 'Capacitance (C)',
        voltage: 'Source Voltage (V)',
      },
      results: {
        timeConstant: 'Time Constant (τ)',
        maxCharge: 'Max Charge (Q)',
      },
      visualization: {
        title: 'Capacitor Charging Curve',
      },
      details: {
        title: '📚 RC Circuit Equations',
        description: 'Time constant τ = R × C. Max Charge Q = C × V. The voltage across the capacitor during charging is V_c(t) = V × (1 - e^(-t/τ)).',
      }
    },
    acPower: {
      title: 'AC Power Calculator',
      description: 'Calculate Real, Reactive, and Apparent Power in Alternating Current (AC) circuits.',
      inputs: {
        systemPhase: 'Phase System',
        voltage: 'Voltage (V)',
        current: 'Current (I)',
        phaseAngle: 'Phase Angle (θ)',
      },
      results: {
        realPower: 'Real Power (P)',
        reactivePower: 'Reactive Power (Q)',
        apparentPower: 'Apparent Power (S)',
        powerFactor: 'Power Factor (PF)',
      },
      visualization: {
        title: 'Power Triangle',
      },
      details: {
        title: '📚 AC Power Formulas',
        description: 'Apparent Power S = V × I (VA). Real Power P = S × cos(θ) (W). Reactive Power Q = S × sin(θ) (VAR). Power Factor = cos(θ).',
      }
    },
    bearingLife: {
      title: 'Bearing Life (L10) Calculator',
      description: 'Calculate the basic rating life (L10) of rolling bearings based on ISO 281 standards.',
      inputs: {
        bearingType: 'Bearing Type',
        dynamicLoad: 'Dynamic Load Rating (C)',
        equivalentLoad: 'Equivalent Dynamic Load (P)',
        speed: 'Rotational Speed (N)',
      },
      results: {
        lifeRevolutions: 'Life in Revolutions (L10)',
        lifeHours: 'Life in Hours (L10h)',
      },
      visualization: {
        title: 'Bearing Life vs Load Curve',
      },
      details: {
        title: '📚 ISO 281 Bearing Life Equation',
        description: 'L10 = (C/P)^p [million revolutions]. For ball bearings, p = 3. For roller bearings, p = 10/3. L10 represents the life that 90% of a group of apparently identical bearings will complete or exceed before fatigue spalling occurs.',
      }
    },
    manningsEquation: {
      title: 'Manning\'s Equation Calculator',
      description: 'Calculate the flow velocity and discharge rate in an open channel using Manning\'s Equation.',
      inputs: {
        roughness: 'Manning\'s Roughness (n)',
        area: 'Cross-sectional Area (A)',
        wettedPerimeter: 'Wetted Perimeter (P)',
        slope: 'Channel Slope (S)',
      },
      results: {
        hydraulicRadius: 'Hydraulic Radius (R)',
        velocity: 'Flow Velocity (V)',
        discharge: 'Discharge / Flow Rate (Q)',
      },
      visualization: {
        title: 'Open Channel Flow Cross-section',
      },
      details: {
        title: '📚 Manning\'s Equation',
        description: 'V = (1/n) × R^(2/3) × S^(1/2) for SI units. V = (1.486/n) × R^(2/3) × S^(1/2) for Imperial units. Where R = A/P (Hydraulic Radius). Discharge Q = V × A.',
      }
    },
    uValue: {
      title: 'Thermal Transmittance (U-Value) Calculator',
      description: 'Calculate the overall heat transfer coefficient (U-Value) for a multi-layered wall or surface.',
      inputs: {
        insideH: 'Inside Conv. Coefficient (h_i)',
        outsideH: 'Outside Conv. Coefficient (h_o)',
        layer1K: 'Layer 1 Cond. (k₁)',
        layer1D: 'Layer 1 Thickness (d₁)',
        layer2K: 'Layer 2 Cond. (k₂)',
        layer2D: 'Layer 2 Thickness (d₂)',
      },
      results: {
        totalR: 'Total Thermal Resistance (R_t)',
        uValue: 'Thermal Transmittance (U-Value)',
      },
      visualization: {
        title: 'Wall Thermal Profile',
      },
      details: {
        title: '📚 U-Value & Thermal Resistance',
        description: 'Total Resistance R_t = 1/h_i + (d₁/k₁) + (d₂/k₂) + ... + 1/h_o. U-Value = 1 / R_t. Lower U-values indicate better insulation performance.',
      }
    },
    soundPressure: {
      title: 'Sound Pressure Level (SPL) Distance Calculator',
      description: 'Calculate the attenuation of sound pressure level over distance in a free field using the Inverse Square Law.',
      inputs: {
        l1: 'Initial SPL (L₁)',
        r1: 'Reference Distance (r₁)',
        r2: 'Target Distance (r₂)',
      },
      results: {
        l2: 'Target SPL (L₂)',
        attenuation: 'Attenuation / Drop',
      },
      visualization: {
        title: 'Sound Attenuation Curve',
      },
      details: {
        title: '📚 Inverse Square Law for Sound',
        description: 'L₂ = L₁ - 20 × log₁₀(r₂/r₁). In a free field (without reflections), the sound pressure level drops by 6 dB every time the distance from the point source is doubled.',
      }
    },
    pumpAffinity: {
      title: 'Pump Affinity Laws Calculator',
      description: 'Calculate changes in pump performance (flow, head, and power) when the rotational speed or impeller diameter changes.',
      inputs: {
        speed1: 'Initial Speed (N₁)',
        flow1: 'Initial Flow (Q₁)',
        head1: 'Initial Head (H₁)',
        power1: 'Initial Power (P₁)',
        speed2: 'Target Speed (N₂)',
      },
      results: {
        flow2: 'New Flow (Q₂)',
        head2: 'New Head (H₂)',
        power2: 'New Power (P₂)',
      },
      visualization: {
        title: 'Performance Change Comparison',
      },
      details: {
        title: '📚 Affinity Laws for Centrifugal Pumps',
        description: 'Flow: Q₂ = Q₁ × (N₂/N₁). Head: H₂ = H₁ × (N₂/N₁)². Power: P₂ = P₁ × (N₂/N₁)³. These laws apply to geometrically similar pumps.',
      }
    },
    psychrometric: {
      title: 'Psychrometric Calculator',
      description: 'Calculate moist air properties including dew point, absolute humidity, and enthalpy from dry bulb temperature and relative humidity.',
      inputs: {
        dryBulb: 'Dry Bulb Temp (T_db)',
        relativeHumidity: 'Relative Humidity (RH)',
      },
      results: {
        dewPoint: 'Dew Point (T_dp)',
        humidityRatio: 'Humidity Ratio (W)',
        enthalpy: 'Specific Enthalpy (h)',
      },
      visualization: {
        title: 'Air State Overview',
      },
      details: {
        title: '📚 Psychrometric Equations',
        description: 'Calculations use standard atmospheric pressure (101.325 kPa). Vapor pressure is calculated using the Magnus-Tetens formula. Enthalpy combines sensible heat of dry air and latent heat of water vapor.',
      }
    },
    waterHammer: {
      title: 'Water Hammer (Pressure Surge) Calculator',
      description: 'Calculate the maximum pressure surge caused by the sudden closure of a valve using the Joukowsky equation.',
      inputs: {
        density: 'Fluid Density (ρ)',
        waveSpeed: 'Wave Speed / Celerity (a)',
        initialVelocity: 'Initial Velocity (v₁)',
        finalVelocity: 'Final Velocity (v₂)',
      },
      results: {
        pressureSurge: 'Pressure Surge (ΔP)',
      },
      visualization: {
        title: 'Valve Closure Shockwave',
      },
      details: {
        title: '📚 Joukowsky Equation',
        description: 'ΔP = ρ × a × Δv. The sudden change in fluid velocity causes a pressure wave to propagate through the pipe. To avoid damage, valves should be closed slowly over a time greater than 2L/a.',
      }
    },
    coolingTower: {
      title: 'Cooling Tower Design Calculator',
      description: 'Calculate cooling tower Range, Approach, and Effectiveness based on water and air temperatures.',
      inputs: {
        hotWater: 'Hot Water Temp In (T_hw)',
        coldWater: 'Cold Water Temp Out (T_cw)',
        wetBulb: 'Air Wet Bulb Temp (T_wb)',
      },
      results: {
        range: 'Cooling Range',
        approach: 'Approach',
        effectiveness: 'Effectiveness (η)',
      },
      visualization: {
        title: 'Cooling Tower Temperature Profile',
      },
      details: {
        title: '📚 Cooling Tower Performance',
        description: 'Range = T_hw - T_cw. Approach = T_cw - T_wb. Effectiveness = Range / (Range + Approach) × 100%. The Approach indicates how close the cooling water gets to the theoretical limit (Wet Bulb temperature).',
      }
    },
    specificSpeed: {
      title: 'Pump Specific Speed (Ns) Calculator',
      description: 'Calculate the pump specific speed to determine the optimal impeller type (Radial, Mixed, or Axial).',
      inputs: {
        speed: 'Pump Speed (N)',
        flow: 'Flow Rate at BEP (Q)',
        head: 'Head per Stage at BEP (H)',
      },
      results: {
        specificSpeed: 'Specific Speed (N_s)',
        impellerType: 'Recommended Impeller',
      },
      visualization: {
        title: 'Impeller Selection Chart',
      },
      details: {
        title: '📚 Specific Speed Formula',
        description: 'N_s = N × √Q / H^(0.75). The specific speed is a dimensionless index used to classify pump impellers based on their performance and proportions.',
      }
    },
    lmtd: {
      title: 'LMTD Calculator',
      description: 'Calculate the Logarithmic Mean Temperature Difference for heat exchangers.',
      inputs: {
        hotIn: 'Hot Fluid Inlet Temp',
        hotOut: 'Hot Fluid Outlet Temp',
        coldIn: 'Cold Fluid Inlet Temp',
        coldOut: 'Cold Fluid Outlet Temp',
        flowType: 'Flow Configuration',
      },
      results: {
        deltaT1: 'ΔT₁',
        deltaT2: 'ΔT₂',
        lmtd: 'LMTD',
      },
      visualization: {
        title: 'Temperature Profile',
      },
    },
    orificeFlow: {
      title: 'Orifice Plate Flow Calculator',
      description: 'Calculate fluid flow rate through an orifice plate using Bernoulli principle and discharge coefficient.',
      inputs: {
        pipeDiameter: 'Pipe Diameter (D)',
        orificeDiameter: 'Orifice Diameter (d)',
        pressureDrop: 'Pressure Drop (ΔP)',
        density: 'Fluid Density (ρ)',
        dischargeCoefficient: 'Discharge Coefficient (Cd)',
      },
      results: {
        betaRatio: 'Beta Ratio (β)',
        areaOrifice: 'Orifice Area',
        velocity: 'Orifice Velocity',
        flowRate: 'Volumetric Flow Rate (Q)',
      },
      visualization: {
        title: 'Orifice Flow Diagram',
      },
    },
    torquePower: {
      title: 'Torque & Power Calculator',
      description: 'Calculate mechanical power from torque and rotational speed.',
      inputs: {
        torque: 'Torque (τ)',
        speed: 'Rotational Speed (N)',
      },
      results: {
        power: 'Mechanical Power (P)',
      },
      visualization: {
        title: 'Power-Torque Relationship',
      },
    },
    centrifuge: {
      title: 'Centrifuge (RCF) Calculator',
      description: 'Calculate the Relative Centrifugal Force (g-force) based on rotor radius and RPM.',
      inputs: {
        radius: 'Rotor Radius (r)',
        speed: 'Rotational Speed (N)',
      },
      results: {
        rcf: 'Relative Centrifugal Force (RCF)',
        angularVelocity: 'Angular Velocity (ω)',
      },
      visualization: {
        title: 'Centrifugal Force Diagram',
      },
    },
    tubePressureDrop: {
      title: 'Tube Pressure Drop Calculator',
      description: 'Calculate pressure drop inside heat exchanger tubes using Darcy-Weisbach equation.',
      inputs: {
        length: 'Tube Length (L)',
        diameter: 'Inside Diameter (D)',
        velocity: 'Fluid Velocity (v)',
        density: 'Fluid Density (ρ)',
        frictionFactor: 'Friction Factor (f)',
      },
      results: {
        pressureDrop: 'Pressure Drop (ΔP)',
        headLoss: 'Head Loss (h_f)',
      },
      visualization: {
        title: 'Pressure Drop Profile',
      },
    },
    cycloneEfficiency: {
      title: 'Cyclone Separator Calculator',
      description: 'Calculate the cut size (d50) of a cyclone separator using Lapple model.',
      inputs: {
        diameter: 'Cyclone Diameter (D)',
        inletWidth: 'Inlet Width (W)',
        inletVelocity: 'Inlet Velocity (Vi)',
        gasViscosity: 'Gas Viscosity (μ)',
        particleDensity: 'Particle Density (ρp)',
        gasDensity: 'Gas Density (ρg)',
      },
      results: {
        cutSize: 'Cut Size (d50)',
        turns: 'Effective Turns (Ne)',
      },
      visualization: {
        title: 'Cyclone Cut Size Chart',
      },
    },
    ductFriction: {
      title: 'Air Duct Friction Calculator',
      description: 'Calculate friction loss in rectangular or circular air ducts.',
      inputs: {
        flowRate: 'Airflow Rate (Q)',
        width: 'Duct Width (W)',
        height: 'Duct Height (H)',
        roughness: 'Absolute Roughness (ε)',
      },
      results: {
        velocity: 'Air Velocity (v)',
        hydraulicDiameter: 'Hydraulic Diameter (Dh)',
        frictionLoss: 'Friction Loss per length',
      },
      visualization: {
        title: 'Duct Cross Section',
      },
    },
    hydraulicJump: {
      title: 'Hydraulic Jump Calculator',
      description: 'Calculate sequent depth and energy loss in an open channel hydraulic jump.',
      inputs: {
        depth: 'Initial Depth (y₁)',
        velocity: 'Initial Velocity (v₁)',
      },
      results: {
        froudeNumber: 'Froude Number (Fr₁)',
        sequentDepth: 'Sequent Depth (y₂)',
        energyLoss: 'Energy Loss (ΔE)',
      },
      visualization: {
        title: 'Hydraulic Jump Profile',
      },
    },
    apiGravity: {
      title: 'API Gravity Calculator',
      description: 'Calculate API gravity, specific gravity, and density of petroleum liquids per API standards.',
      inputs: {
        inputType: 'Input Type',
        apiValue: 'API Gravity',
        sgValue: 'Specific Gravity (SG)',
      },
      results: {
        apiGravity: 'API Gravity',
        specificGravity: 'Specific Gravity (SG)',
        densityKgM3: 'Density (kg/m³)',
        densityLbGal: 'Density (lb/gal)',
        classification: 'Oil Classification',
      },
      visualization: {
        title: 'Density Comparison',
      },
    },
    api650Tank: {
      title: 'API 650 Tank Thickness',
      description: 'Calculate the minimum required shell thickness for welded steel storage tanks per API 650.',
      inputs: {
        diameter: 'Tank Diameter (D)',
        height: 'Liquid Height (H)',
        specificGravity: 'Specific Gravity (G)',
        allowableStress: 'Allowable Stress (Sd)',
        corrosionAllowance: 'Corrosion Allowance (CA)',
      },
      results: {
        designThickness: 'Design Thickness (t_d)',
        hydrotestThickness: 'Hydrotest Thickness (t_t)',
      },
      visualization: {
        title: 'Tank Shell Profile',
      },
    },
    asce7WindLoad: {
      title: 'ASCE 7-16 Wind Load Calculator',
      description: 'Calculate velocity pressure based on ASCE 7-16 standard for structural wind load design.',
      inputs: {
        windSpeed: 'Basic Wind Speed (V)',
        exposure: 'Exposure Category',
        height: 'Mean Roof Height (z)',
        topographic: 'Topographic Factor (K_zt)',
        directionality: 'Directionality Factor (K_d)',
      },
      results: {
        velocityPressure: 'Velocity Pressure (q_z)',
        exposureCoeff: 'Exposure Coefficient (K_z)',
      },
      visualization: {
        title: 'Wind Pressure Profile',
      },
    },
    iso1127Pipe: {
      title: 'ISO 1127 Stainless Steel Tube',
      description: 'Calculate weight and dimensions of stainless steel tubes according to ISO 1127.',
      inputs: {
        outerDiameter: 'Outer Diameter (D)',
        thickness: 'Wall Thickness (t)',
      },
      results: {
        weight: 'Unit Weight (W)',
        flowArea: 'Internal Flow Area',
      },
      visualization: {
        title: 'Tube Cross-Section',
      },
    },
    din10220Pipe: {
      title: 'DIN EN 10220 Steel Tube Burst Pressure',
      description: 'Calculate allowable and burst pressure for seamless/welded steel tubes per DIN EN 10220 dimensions and DIN material grades.',
      inputs: {
        outerDiameter: 'Outer Diameter (D)',
        thickness: 'Wall Thickness (t)',
        materialGrade: 'DIN Material Grade',
        safetyFactor: 'Safety Factor (FS)',
      },
      results: {
        burstPressure: 'Burst Pressure (P_b)',
        allowablePressure: 'Allowable Pressure (P_allow)',
      },
      visualization: {
        title: 'Pressure Capacity',
      },
    },
    iso2533Atmosphere: {
      title: 'ISO 2533 Standard Atmosphere',
      description: 'Calculate atmospheric properties (temperature, pressure, density) at a given altitude per ISO 2533.',
      inputs: {
        altitude: 'Altitude (h)',
      },
      results: {
        temperature: 'Temperature (T)',
        pressure: 'Pressure (P)',
        density: 'Air Density (ρ)',
        speedOfSound: 'Speed of Sound (a)',
      },
      visualization: {
        title: 'Atmospheric Profile',
      },
    },
  },
  nav: {
    finance: 'Finance',
    conversion: 'Conversion',
    life: 'Life',
    science: 'Science',
    engineering: 'Engineering',
    aiTools: 'AI Tools',
    game: 'Game',
    others: 'Others',
  },
  home: {
    title: 'Online Calculators for Every Need',
    subtitle:
      'Explore calculators across finance, health, daily life, engineering and more, right now.',
    adPlaceholder: 'Ad space (insert AdSense / Coupang code)',
    press: 'Press',
    about: 'About AllinCalc',
  },
  footer: {
    press: 'Press',
    editorialPolicy: 'Editorial Policy',
    partnership: 'Partnership',
    about: 'About AllinCalc',
    resources: 'Resources',
    intro: 'Intro',
    library: 'Library',
    affiliate: 'Affiliate',
    contact: 'Contact',
    blog: 'Blog',
    copyright: 'All rights reserved.',
  },
  categories: {
    searchPlaceholder: 'Search calculators...',
    titleSuffix: 'Calculators',
    notFound: 'Category not found.',
    loading: 'Loading...',
    totalCalculators: 'There are {count} calculators available.',
    finance: {
      name: 'Finance',
      description: 'Use our financial calculators to plan investments, calculate interest rates, and estimate savings. Each calculator includes rich financial information and calculation formulas.',
    },
    conversion: {
      name: 'Conversion',
      description: 'Easily convert between different units. Length, weight, volume, energy, power, currency, timezone and more — fast and accurate conversions for all your needs.',
    },
    life: {
      name: 'Life',
      description: 'Calculators for everyday life including health, time, shopping and more. Plan a healthy lifestyle, manage time efficiently, and make smart purchasing decisions.',
    },
    science: {
      name: 'Science',
      description: 'Scientific calculators for physics, chemistry and more. Solve complex scientific calculations quickly and accurately to aid research and learning.',
    },
    engineering: {
      name: 'Engineering',
      description: 'Engineering calculators for fluid mechanics, material analysis and more. Solve complex engineering problems and streamline design and analysis tasks.',
    },
    'ai-tools': {
      name: 'AI Tools',
      description: 'AI-powered productivity tools. Text summarization, grammar checking, translation, image generation, prompt writing and more.',
    },
    game: {
      name: 'Game',
      description: 'Calculators to help with gaming across various genres including RPG. Calculate character DPS and plan in-game strategies.',
    },
    others: {
      name: 'Others',
      description: "Fun and useful calculators that don't fit into other categories. Random number generators and more to add a bit of fun to your daily life.",
    },
  },
  subcategoryNames: {
    'interest-loan': 'Interest & Loan Calculators',
    'real-estate': 'Real Estate Calculators',
    'business-income': 'Business Income Calculators',
    'salary-income': 'Salary & Income',
    investment: 'Investment',
    savings: 'Savings',
    'unit-converters': 'Unit Converters',
    'special-converters': 'Special Converters',
    health: 'Health Calculators',
    'date-time': 'Date & Time Calculators',
    shopping: 'Shopping Calculators',
    logistics: 'Logistics',
    'utility-tools': 'Utility Tools',
    physics: 'Physics Calculators',
    chemistry: 'Chemistry Calculators',
    'fluid-mechanics': 'Fluid Mechanics',
    piping: 'Piping & Pressure Vessels',
    thermodynamics: 'Thermodynamics',
    hvac: 'HVAC',
    mechanical: 'Mechanical Engineering',
    electrical: 'Electrical Engineering',
    chemical: 'Chemical Engineering',
    material: 'Materials',
    acoustics: 'Acoustics & Vibration',
    'civil-structural': 'Civil & Structural Engineering',
    'text-tools': 'Text Tools',
    'image-tools': 'Image Tools',
    'code-tools': 'Code Tools',
    productivity: 'Productivity Tools',
    rpg: 'RPG Helpers',
    generators: 'Generators',
    network: 'Network',
  },
  calculatorNames: {
    'loan-interest': 'Loan Interest Calculator',
    'early-repayment-fee': 'Early Repayment Fee Calculator',
    dti: 'DTI Calculator',
    'installment-interest': 'Installment Interest Calculator',
    'compound-interest': 'Compound Interest Calculator',
    'installment-savings-monthly-compound-interest':
      'Installment Savings Monthly Compound Interest',
    'principal-equal-amortization': 'Principal Equal Amortization',
    'principal-and-interest-equal-repayment':
      'Principal & Interest Equal Repayment',
    'credit-card-installment-fee': 'Credit Card Installment Fee',
    'mortgage-calculator': 'Mortgage Calculator',
    'property-tax-calculator': 'Property Tax Calculator',
    'vat-calculator': 'VAT Calculator',
    'ordinary-wage': 'Ordinary Wage Calculator',
    insurance: 'Social Insurance Calculator',
    retirement: 'Retirement Pay Calculator',
    'annual-leave': 'Annual Leave Calculator',
    'stock-compound-interest': 'Stock Compound Interest',
    cagr: 'CAGR Calculator',
    'deposit-interest': 'Deposit Interest Calculator',
    'regular-installment-savings': 'Regular Installment Savings',
    'free-installment-savings': 'Free Installment Savings',
    'unit-converter': 'Unit Converter',
    'conversion-page': 'Quick Unit Converter',
    'data-size-converter': 'Data Size Converter',
    'distance-converter': 'Distance Converter',
    'speed-converter': 'Speed Converter',
    'weight-converter': 'Weight Converter',
    'volume-converter': 'Volume Converter',
    'energy-converter': 'Energy Converter',
    'power-converter': 'Power Converter',
    'currency-converter': 'Currency Converter',
    'timezone-converter': 'Timezone Converter',
    'bmi-calculator': 'BMI Calculator',
    'bmr-calculator': 'BMR Calculator',
    'weight-loss-calculator': 'Weight Loss Calculator',
    'korean-age-calculator': 'Korean Age Calculator',
    'anniversary-calculator': 'Anniversary Calculator',
    'date-difference-calculator': 'Date Difference Calculator',
    'countdown-timer': 'Countdown Timer',
    'holiday-calendar': 'Holiday Calendar',
    'discount-calculator': 'Discount Calculator',
    'cbm-calculator': 'CBM Calculator',
    'qr-generator': 'QR Code Generator',
    'password-generator': 'Password Generator',
    'color-picker': 'Color Picker',
    'text-difference': 'Text Difference',
    'typing-speed': 'Typing Speed Test',
    'coin-flip': 'Coin Flip',
    'virtual-dice': 'Virtual Dice',
    notepad: 'Notepad',
    'velocity-calculator': 'Velocity Calculator',
    'kinetic-energy-calculator': 'Kinetic Energy Calculator',
    'torque-calculator': 'Torque Calculator',
    'force-calculator': 'Force Calculator',
    'molarity-calculator': 'Molarity Calculator',
    npsh: 'NPSH Calculator',
    'pump-power': 'Pump Power Calculator',
    'tank-volume': 'Tank Volume Calculator',
    'free-fall': 'Free Fall Calculator',
    'ohms-law': 'Ohm\'s Law Calculator',
    'ideal-gas': 'Ideal Gas Law Calculator',
    'pipe-friction': 'Pipe Friction Loss Calculator',
    'beam-deflection': 'Beam Deflection Calculator',
    'voltage-drop': 'Voltage Drop Calculator',
    'thermal-expansion': 'Thermal Expansion Calculator',
    'asme-b313': 'ASME B31.3 Pipe Calculator',
    'barlows-formula': 'Barlow\'s Formula Calculator',
    'asme-section-viii': 'ASME Sec VIII Vessel Calculator',
    'heat-transfer': 'Heat Transfer Calculator',
    'sensible-heat': 'Sensible Heat Calculator',
    'reynolds-number': 'Reynolds Number Calculator',
    'spring-rate': 'Spring Rate Calculator',
    'radiation-heat': 'Radiation Heat Calculator',
    comparison: 'Material Property Comparison',
    'corrosion-compatibility': 'Corrosion Compatibility Comparison',
    'text-summarizer': 'Text Summarizer',
    'lorem-ipsum-generator': 'Lorem Ipsum Generator',
    'image-resizer': 'Image Resizer',
    'image-converter': 'Image Converter',
    'json-generator': 'JSON Generator',
    'xml-generator': 'XML Generator',
    'yaml-generator': 'YAML Generator',
    'json-prettifier': 'JSON Prettifier',
    'json-minifier': 'JSON Minifier',
    'base64-encoder': 'Base64 Encoder',
    'base64-decoder': 'Base64 Decoder',
    'url-encoder': 'URL Encoder',
    'url-decoder': 'URL Decoder',
    'morse-code': 'Morse Code Converter',
    'prompt-generator': 'Prompt Generator',
    'code-explainer': 'Code Explainer',
    'meeting-notes': 'Meeting Notes',
    'dps-calculator': 'DPS Calculator',
    'random-number-generator': 'Random Number Generator',
    'random-string-generator': 'Random String Generator',
    'random-email-generator': 'Random Email Generator',
    'invoice-generator': 'Invoice Generator',
    'internet-speed-test': 'Internet Speed Test',
    'ip-lookup': 'IP Lookup',
    tank: 'Tank Calculator',
    'concrete-calculator': 'Concrete Calculator',
    'lumber-calculator': 'Lumber Calculator',
    'molar-mass-calculator': 'Molar Mass Calculator',
    'solution-dilution-calculator': 'Solution Dilution Calculator',
    vat: 'VAT Calculator',
    'ac-power': 'AC Power Calculator',
    'api-650-tank': 'API 650 Tank Thickness Calculator',
    'api-gravity': 'API Gravity Calculator',
    'asce7-wind-load': 'ASCE 7 Wind Load Calculator',
    'bearing-life': 'Bearing Life (L10) Calculator',
    bernoulli: 'Bernoulli Equation Calculator',
    'carnot-efficiency': 'Carnot Efficiency Calculator',
    centrifuge: 'Centrifuge RCF Calculator',
    'cooling-tower': 'Cooling Tower Calculator',
    'cyclone-efficiency': 'Cyclone Separation Efficiency Calculator',
    'din-10220-pipe': 'DIN EN 10220 Pipe Calculator',
    'duct-friction': 'Duct Friction Loss Calculator',
    'euler-buckling': 'Euler Buckling Calculator',
    'gear-ratio': 'Gear Ratio Calculator',
    'hydraulic-jump': 'Hydraulic Jump Calculator',
    'iso-1127-pipe': 'ISO 1127 Pipe Calculator',
    'iso-2533-atmosphere': 'ISO 2533 Standard Atmosphere Calculator',
    lmtd: 'LMTD Calculator',
    'mannings-equation': "Manning's Equation Calculator",
    'orifice-flow': 'Orifice Flow Calculator',
    psychrometric: 'Psychrometric Calculator',
    'pump-affinity': 'Pump Affinity Laws Calculator',
    'rc-circuit': 'RC Circuit Time Constant Calculator',
    'sound-pressure': 'Sound Pressure Level (SPL) Calculator',
    'specific-speed': 'Specific Speed (Ns) Calculator',
    'stress-strain': 'Stress & Strain Calculator',
    'torque-power': 'Torque & Power Calculator',
    'tube-pressure-drop': 'Tube Pressure Drop Calculator',
    'u-value': 'U-Value Calculator',
    'water-hammer': 'Water Hammer Calculator',
  },
  calculatorDescriptions: {
    tank: 'Calculate the volume, capacity, and related figures of a tank.',
    npsh: "Calculate a pump's Net Positive Suction Head (NPSH) to prevent cavitation.",
    'pump-power': 'Calculate the power required to operate a pump.',
    'concrete-calculator': 'Calculate the amount of concrete needed for slabs, foundations, stairs, and more.',
    'lumber-calculator': 'Calculate lumber quantities such as board feet and linear feet.',
    'molar-mass-calculator': 'Calculate the molar mass of a chemical formula.',
    'solution-dilution-calculator': 'Calculate the dilution ratio needed to make a solution of the desired concentration.',
    vat: 'Calculate VAT based on the supply value and total amount.',
  },
  calculatorLayout: {
    inputInfo: 'Input Information',
    result: 'Result',
    description: 'Calculator Description',
    formula: 'Formula',
    tips: 'Useful Tips',
  },
  loanInterest: {
    title: 'Loan Interest Calculator',
    description: 'Compare monthly payments and total interest across different repayment methods.',
    inputs: {
      loanAmount: 'Loan Principal ({currency})',
      loanTerm: 'Loan Term (years)',
      annualRate: 'Annual Interest Rate (%)',
    },
    results: {
      totalPrincipal: 'Total Principal',
      totalInterest: 'Total Interest',
      totalRepayment: 'Total Repayment',
      monthlyPayment: 'Monthly Payment',
      monthlyInterest: 'Monthly Interest',
      firstPayment: 'First Payment',
      lastPayment: 'Last Payment',
      placeholder: 'Enter values and press Calculate.',
    },
    tabs: {
      equalPayment: 'Equal Payment',
      equalPrincipal: 'Equal Principal',
      bulletLoan: 'Bullet Loan',
    },
    table: {
      month: 'Mo.',
      monthlyPayment: 'Monthly\nPayment',
      principal: 'Principal\nPaid',
      interest: 'Interest\nPaid',
      balance: 'Remaining\nBalance',
    },
    scheduleTitle: 'Repayment Schedule',
    glossary: {
      equalPayment: 'Equal Payment (Principal & Interest): A fixed amount is paid each month. Early payments are interest-heavy, shifting toward principal over time.',
      equalPrincipal: 'Equal Principal: A fixed principal amount is paid each month, with interest on the remaining balance. Total interest is the lowest of the three methods.',
      bulletLoan: 'Bullet Loan: Only interest is paid monthly, with the full principal due at maturity. Lowest monthly burden but highest end-of-term risk.',
    },
    descriptionContent: `<p class="text-muted-foreground">Whether it's buying a home, purchasing a car, or funding a business, there are moments in life when you need a lump sum. A loan with a reasonable interest rate can help you reach those goals faster. However, since a loan uses future income as collateral for present funds, careful planning and thorough comparison are essential.</p>
<p class="mt-4 text-muted-foreground">The repayment method you choose has a direct impact on your monthly payments and total interest cost — making it the single most important factor to consider. There are three main methods: <strong class="text-foreground">Equal Payment, Equal Principal, and Bullet Loan</strong>. Each has distinct pros and cons, and your choice can significantly affect your financial plan.</p>
<p class="mt-4 text-muted-foreground">For example, borrowing $100,000 at 5% annual interest for 20 years: under Equal Payment, you'd pay about $660 per month. Under Equal Principal, payments start at about $830 in the first month and drop to about $420 by the last month. The difference in total interest alone can amount to thousands of dollars.</p>
<p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc's Loan Interest Calculator</strong> makes this comparison easy. Simply enter the principal, term, and interest rate, and instantly see monthly payments, total interest, and full repayment schedules for all three methods. Whether you're a salaried worker, self-employed, or planning a home purchase, this tool helps you simulate scenarios and choose the best conditions before committing.</p>`,
    formulaContent: `<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Which Repayment Method Is Right for You?</h3>
<p class="text-muted-foreground">Each repayment method has distinct characteristics, so the best choice depends on your current income, future income expectations, and financial plans. Below you can see the key formulas and worked examples for each method.</p>
<div class="space-y-6 mt-4">
<div class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-2 text-foreground">1. Equal Payment (Most Common)</h4>
<p class="text-sm text-muted-foreground">The total monthly payment (principal + interest) stays the same throughout the loan term. Early payments are interest-heavy, but the principal portion grows over time.</p>
<p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>Monthly Payment = P × [r(1+r)^n] / [(1+r)^n - 1]</strong></p>
<p class="text-xs text-muted-foreground mt-1">Example: ₩100M, 5% annual, 20 years → approx. ₩660,000/month</p>
<ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
<li><strong class="text-foreground">Pros:</strong> Predictable fixed payments make budgeting easy.</li>
<li><strong class="text-foreground">Cons:</strong> Higher total interest compared to Equal Principal.</li>
<li><strong class="text-foreground">Best for:</strong> Salaried workers with stable income who prefer predictable expenses.</li>
</ul>
</div>
<div class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-2 text-foreground">2. Equal Principal (Lowest Total Interest)</h4>
<p class="text-sm text-muted-foreground">The principal is divided equally across months. Interest is calculated on the remaining balance, so payments start high and decrease over time.</p>
<p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>Monthly Principal = P / n</strong><br /><strong>Monthly Interest = Remaining Balance × r</strong></p>
<p class="text-xs text-muted-foreground mt-1">Example: ₩100M, 5% annual, 20 years → first month approx. ₩833,000, last month approx. ₩418,000</p>
<ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
<li><strong class="text-foreground">Pros:</strong> Lowest total interest of the three methods.</li>
<li><strong class="text-foreground">Cons:</strong> Higher initial payments can be a burden.</li>
<li><strong class="text-foreground">Best for:</strong> Those with extra funds upfront or expecting income decline (e.g., pre-retirees).</li>
</ul>
</div>
<div class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-2 text-foreground">3. Bullet Loan (Lowest Monthly Burden)</h4>
<p class="text-sm text-muted-foreground">Only interest is paid each month, with the entire principal due at maturity. Commonly used for short-term loans or jeonse (lease deposit) loans.</p>
<p class="font-mono p-2 bg-card rounded-md my-2 text-sm text-primary"><strong>Monthly Interest = P × r</strong></p>
<p class="text-xs text-muted-foreground mt-1">Example: ₩100M, 5% annual → approx. ₩417,000/month interest only, principal repaid at maturity</p>
<ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground">
<li><strong class="text-foreground">Pros:</strong> Lowest monthly payment since only interest is paid.</li>
<li><strong class="text-foreground">Cons:</strong> Highest total interest and a large principal repayment at maturity.</li>
<li><strong class="text-foreground">Best for:</strong> Short-term borrowing needs or when you have a clear plan to repay the principal at maturity.</li>
</ul>
</div>
</div>
<p class="text-xs mt-4 text-muted-foreground">※ P: Loan principal, r: Monthly interest rate (annual rate ÷ 12), n: Total number of months</p>`,
    tipsContent: `<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Smart Borrowing Tips</h3>
<ul class="space-y-6">
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">1. Check Your DSR First</h4>
<p class="text-muted-foreground">DSR (Debt Service Ratio) is the ratio of your total annual loan payments to your annual income — the key metric lenders use today. Calculate your DSR in advance to understand your borrowing capacity. Banks typically require DSR under 40%, and stress DSR rules have tightened further since 2025.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">2. Factor in Prepayment Penalties</h4>
<p class="text-muted-foreground">If you repay your loan early, the bank may charge a prepayment penalty. This typically applies within the first 3 years, and rates vary by institution. Always check the penalty conditions before signing to avoid unexpected costs.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">3. Compare Fixed vs. Variable Rates</h4>
<p class="text-muted-foreground">In a rising rate environment, fixed rates protect you from increases. In a falling rate environment, variable rates adjust downward and may save you money. Choose based on your risk tolerance and market outlook.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">4. Exercise Your Right to Request a Rate Cut</h4>
<p class="text-muted-foreground">If your creditworthiness improves — through a new job, promotion, income increase, or credit score boost — you can legally request a lower interest rate. This is a consumer right guaranteed by law, so don't hesitate to apply if you qualify.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">5. Compare Offers from Multiple Lenders</h4>
<p class="text-muted-foreground">Don't settle for your primary bank. Use online comparison platforms to review rates and limits across multiple institutions. Even a 0.1% rate difference can translate into significant savings over a long loan term.</p>
</li>
</ul>`,
  },
  earlyRepaymentFee: {
    title: 'Early Repayment Fee Calculator',
    description: 'Calculate the early repayment penalty before you prepay your loan.',
    inputs: {
      totalLoanAmount: 'Total Loan Amount (KRW)',
      repaymentAmount: 'Early Repayment Amount (KRW)',
      loanStartDate: 'Loan Start Date',
      repaymentDate: 'Early Repayment Date',
      loanTerm: 'Total Loan Term (months)',
      feeRate: 'Early Repayment Fee Rate (%)',
    },
    results: {
      expectedFee: 'Estimated Early Repayment Fee',
      elapsed: 'Elapsed',
      remaining: 'Remaining',
      loanStart: 'Loan Start',
      maturity: 'Maturity',
      baseAmount: 'Early Repayment Principal',
      appliedRate: 'Applied Fee Rate',
      remainingRatio: 'Remaining Period Ratio',
      remainingMonths: 'Remaining Months',
      placeholder: 'Press Calculate to see the result.',
    },
    exemptions: {
      maturityPassed: 'Loan maturity has passed.',
      threeYears: '3 years have passed since loan execution — fee is exempt.',
      calculationComplete: 'Early repayment fee calculation complete.',
      checkValues: 'Please check your input values.',
    },
    descriptionContent: `<p class="text-muted-foreground">When you come into a lump sum and consider paying off your loan early to reduce interest costs, you may encounter an unexpected expense called an "early repayment fee." This fee is essentially a penalty charged by the lender when you repay the principal before the agreed loan term is fulfilled.</p>
<p class="mt-4 text-muted-foreground">Financial institutions such as banks forecast the interest income they'll earn over the loan period and use this to plan their fund management. When a customer repays early, not only do they lose the expected interest income, but they also face the difficulty of redeploying the sudden influx of capital efficiently. The early repayment fee exists to compensate for this opportunity cost and administrative burden.</p>
<p class="mt-4 text-muted-foreground">Generally, if you repay within <strong class="text-foreground">3 years</strong> of loan execution, a fee is charged. The fee rate typically ranges from 0.5% to 1.5%, varying by institution, product, and agreement terms. Variable-rate loans tend to have lower fees than fixed-rate loans, and in recent years, some internet banks have introduced fee-exempt products.</p>
<p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc's Early Repayment Fee Calculator</strong> is a powerful tool to help you make informed decisions. Beyond simply calculating the fee, it helps you weigh the pros and cons of different repayment timings and develop an optimal financial strategy to avoid unnecessary expenses.</p>`,
    formulaContent: `<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Is the Fee Calculated?</h3>
<p class="text-muted-foreground">Most financial institutions in Korea use the <strong class="text-foreground">"sliding method"</strong>, where the fee burden gradually decreases over time. The more time that has passed since loan execution, the lower the fee.</p>
<div class="mt-4 p-6 bg-muted rounded-lg text-center border border-border">
<p class="font-mono text-xl tracking-tighter text-primary"><strong>Estimated Fee = Early Repayment Principal × Fee Rate × (Remaining Days ÷ Fee Period)</strong></p>
</div>
<div class="mt-8 space-y-6">
<div>
<h4 class="text-lg font-semibold text-foreground">1. Early Repayment Principal</h4>
<p class="mt-2 text-base leading-relaxed text-muted-foreground">The amount of principal you wish to repay ahead of schedule. The larger this amount, the higher the fee.</p>
</div>
<div>
<h4 class="text-lg font-semibold text-foreground">2. Early Repayment Fee Rate</h4>
<p class="mt-2 text-base leading-relaxed text-muted-foreground">The rate agreed upon at the time of loan execution, typically expressed as an annual percentage. Generally set between 1.0% and 1.4%.</p>
</div>
<div>
<h4 class="text-lg font-semibold text-foreground">3. Remaining Period / Fee Period (Core of the Sliding Method)</h4>
<p class="mt-2 text-base leading-relaxed text-muted-foreground">Regardless of the actual total loan term, the fee period is typically limited to <strong class="text-foreground">3 years (1,095 days)</strong>. After 3 years, the early repayment fee drops to zero.</p>
</div>
</div>
<div class="mt-8 p-6 border-l-4 border-primary bg-muted rounded-r-lg">
<h4 class="font-bold text-lg mb-3 text-foreground">Worked Example</h4>
<p class="text-base text-muted-foreground">
- Total loan: 300 million KRW (30-year mortgage)<br />
- Fee rate: 1.2%<br />
- Repayment timing: 1 year 6 months (548 days) after execution<br />
- Amount to prepay: 50 million KRW
</p>
<p class="mt-4 font-mono bg-card p-4 rounded-md text-sm border border-border">
<strong class="text-foreground">1. Remaining fee days:</strong> 1,095 - 548 = 547 days<br/><br/>
<strong class="text-foreground">2. Final fee:</strong> 50,000,000 × 1.2% × (547 ÷ 1,095) = <strong class="text-primary">approx. 299,726 KRW</strong>
</p>
</div>`,
    tipsContent: `<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Smart Tips to Save on Early Repayment Fees</h3>
<ul class="space-y-6">
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">1. Remember the "3-Year Magic"</h4>
<p class="text-muted-foreground">The simplest and most reliable strategy: most loan products waive the fee entirely after 3 years. Even if you have spare cash, waiting until you're close to the 3-year mark can save you the penalty.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">2. Use the "Partial Repayment Exemption"</h4>
<p class="text-muted-foreground">Many banks allow you to repay up to 10% of the principal once a year without any fee. For example, on a 300 million KRW loan, you can prepay up to 30 million KRW annually for free. Check your loan agreement for details.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">3. Compare "Interest Savings" vs. "Fee" for Refinancing</h4>
<p class="text-muted-foreground">If you're considering refinancing to a lower rate, always compare the total interest savings over the remaining term against the early repayment fee plus any additional costs. Use this calculator alongside the Loan Interest Calculator for a complete picture.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">4. Check If You Qualify for Fee Exemption</h4>
<p class="text-muted-foreground">Certain circumstances — such as borrower death, natural disaster, or government-mandated property acquisition — may qualify for fee reduction or exemption. Some policy loan products (e.g., Ddimgol, Bogeumjarone) also offer exemptions based on income/asset criteria.</p>
</li>
<li class="p-4 bg-muted rounded-lg border border-border">
<h4 class="font-semibold text-md mb-1 text-primary">5. Always Verify with Your Loan Agreement</h4>
<p class="text-muted-foreground">This calculator uses the standard sliding method as a baseline, but the actual fee rate, calculation method, and exemption conditions are defined in your <strong class="text-foreground">loan agreement</strong>. Always review your agreement before executing any repayment and contact your lender with questions.</p>
</li>
</ul>`,
  },
  dti: {
    title: 'DTI Calculator (Debt-to-Income Ratio)',
    description: 'Calculate your DTI ratio and estimate your mortgage borrowing capacity.',
    inputs: {
      annualIncome: 'Annual Income (KRW)',
      loanPrincipal: 'Mortgage Principal (KRW)',
      loanTerm: 'Loan Term (years)',
      annualRate: 'Annual Interest Rate (%)',
      otherDebtInterest: 'Other Debt Annual Interest (KRW)',
    },
    results: {
      dtiResult: 'DTI Result',
      totalDebtRepayment: 'Total Annual Debt Repayment',
      annualIncome: 'Annual Income',
      mortgageAnnualPI: 'Mortgage Annual P&I',
      otherInterest: 'Other Debt Annual Interest',
      maxLoanTitle: 'DTI 40% — Max Estimated Loan',
      placeholder: 'Press Calculate to see your DTI.',
      chartTitle: 'Debt vs. Income Breakdown',
    },
    status: {
      veryStable: 'Very Stable',
      stable: 'Stable',
      caution: 'Caution',
      risky: 'Risky',
      highRisk: 'High Risk',
    },
    chart: {
      totalDebt: 'Total Debt',
      availableIncome: 'Available Income',
    },
    tableHeaders: {
      item: 'Item',
      amount: 'Amount (KRW)',
      ratio: 'Ratio (%)',
    },
    descriptionContent: '<p class="text-muted-foreground">When you approach a lender with the dream of owning a home, the first number you encounter is <strong class="text-foreground">DTI (Debt-to-Income ratio)</strong>. DTI is the ratio of your annual debt repayment to your annual income, and it is the core financial health indicator that lenders use to assess your repayment capacity.</p><p class="mt-4 text-muted-foreground">Alongside LTV, which determines the scale of your loan relative to the property value, DTI is one of the two pillars that determine your borrowing limit. A lower DTI ratio signals higher repayment capacity, potentially unlocking larger loan limits and better interest rates. A high DTI, on the other hand, may result in loan denial or a lower-than-desired limit.</p><p class="mt-4 text-muted-foreground">However, DTI calculation is more complex than it seems. It includes not only your mortgage principal & interest but also the interest on existing debts such as personal loans, car financing, and student loans. Many people underestimate their DTI and are caught off guard during the actual loan review process.</p><p class="mt-4 text-muted-foreground"><strong class="text-foreground">All-in-Calc\'s DTI Calculator</strong> solves this complexity and gives you a clear diagnosis of your financial health. With just a few inputs, you can calculate your exact DTI and estimate your borrowing capacity under current regulations.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Is DTI Calculated Exactly?</h3><p class="text-muted-foreground leading-relaxed mb-6">DTI measures the proportion of your annual income consumed by annual debt repayments. While the formula itself looks simple, the result varies significantly depending on which debts are included.</p><div class="mt-4 p-4 bg-muted rounded-md text-center border border-border"><p class="font-mono text-lg tracking-tight text-primary"><strong>DTI (%) = ( (New Mortgage Annual P&I) + (Other Debt Annual Interest) ) / Annual Income × 100</strong></p></div><ul class="list-none space-y-4 mt-6"><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">New Mortgage Annual P&I:</strong> <span class="text-muted-foreground">The total principal and interest due in one year on the new mortgage. The shorter the loan term, the larger this amount becomes.</span></li><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">Other Debt Annual Interest:</strong> <span class="text-muted-foreground">The annual interest on all existing debts — personal loans, overdrafts, car financing, student loans, etc. Unlike DSR, DTI only counts interest, not principal.</span></li><li class="p-4 border-l-4 border-border bg-muted rounded-r-lg"><strong class="font-semibold text-foreground">Annual Income:</strong> <span class="text-muted-foreground">Based on pre-tax (gross) income. Only officially documented income — such as wage income withholding receipts or business income certificates — is recognized.</span></li></ul><h3 class="text-xl font-bold text-foreground mt-10 mb-4">DTI vs DSR — What\'s the Difference?</h3><p class="mb-4 text-muted-foreground leading-relaxed">In today\'s lending market, <strong class="text-foreground">DSR (Debt Service Ratio)</strong> has become the stricter regulatory standard. While DTI focuses primarily on mortgage debt, DSR covers all household debts including personal loans and card financing.</p><div class="overflow-x-auto"><table class="min-w-full divide-y divide-border"><thead class="bg-muted"><tr><th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Category</th><th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">DTI</th><th class="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase">DSR</th></tr></thead><tbody class="bg-card divide-y divide-border"><tr><td class="px-6 py-4 whitespace-nowrap font-semibold text-foreground">Concept</td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground">Annual income vs <strong class="text-foreground">Mortgage P&I + other debt interest</strong></td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground">Annual income vs <strong class="text-foreground">All loans\' P&I</strong></td></tr><tr><td class="px-6 py-4 whitespace-nowrap font-semibold text-foreground">Debt Scope</td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground">New mortgage (P&I) + existing debt (<strong class="text-foreground">interest only</strong>)</td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground">All loans across institutions (<strong class="text-foreground">full P&I</strong>)</td></tr><tr><td class="px-6 py-4 whitespace-nowrap font-semibold text-foreground">Regulatory Strength</td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground">Relatively relaxed</td><td class="px-6 py-4 whitespace-nowrap text-muted-foreground"><strong class="text-foreground">Much stricter</strong></td></tr></tbody></table></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Practical Strategies to Lower DTI and Boost Your Loan Limit</h3><ul class="space-y-6"><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">1. Debt Diet: Pay Off High-Interest Debt First</h4><p class="text-muted-foreground">The most fundamental yet effective approach. Repay high-interest personal loans, card financing, and cash advances first to reduce your total other-debt interest. Less interest means a directly lower DTI ratio.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">2. Maximize Documented Income</h4><p class="text-muted-foreground">Lenders only recognize officially documented income. Beyond wage withholding receipts, submit business income certificates, national pension/health insurance payment records, and consider reporting spousal income for a combined total.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">3. Extend the Loan Term to Reduce Annual Repayment</h4><p class="text-muted-foreground">Extending from 30 to 40 or 50 years significantly reduces the annual P&I amount, lowering your DTI. However, total interest paid increases, so weigh the trade-off carefully.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">4. Understand the Stress DSR System</h4><p class="text-muted-foreground">Stress DSR adds a hypothetical rate buffer to your current rate when calculating borrowing capacity. For variable-rate loans, this can reduce your limit more than expected.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">5. Monitor Policy Changes and Check Regional Regulations</h4><p class="text-muted-foreground">DTI and DSR rules change frequently based on government housing policy and region. First-time buyers and newlyweds often qualify for relaxed standards — always verify the latest rules at application time.</p></li><li class="p-4 rounded-lg bg-muted border border-border"><h4 class="font-semibold text-lg mb-2 text-primary">6. Don\'t Forget to Check DSR Limits Too</h4><p class="text-muted-foreground">Even if your DTI passes, the DSR (typically 40% for primary banks) must also pass. Managing both metrics ensures a smoother loan approval process.</p></li></ul>',
  },
  installmentInterest: {
    title: 'Installment Interest Calculator (Equal P&I)',
    description: 'Calculate installment interest using the equal principal & interest method, with a pie chart showing principal vs interest breakdown.',
    inputs: {
      principal: 'Installment Principal (KRW)',
      months: 'Number of Months',
      annualRate: 'Annual Interest Rate (%)',
    },
    results: {
      monthlyPayment: 'Monthly Payment',
      totalPayment: 'Total Repayment',
      totalInterest: 'Total Interest',
      placeholder: 'Press Calculate to see the result.',
    },
    tableHeaders: {
      category: 'Category',
      amount: 'Amount (KRW)',
    },
    tableRows: {
      monthlyPayment: 'Monthly Payment',
      totalPayment: 'Total Repayment',
      totalInterest: 'Total Interest',
      principal: 'Principal',
      principalInterestRatio: 'Interest-to-Principal Ratio',
      interestPaymentRatio: 'Interest-to-Payment Ratio',
    },
    chartLabels: {
      principal: 'Principal',
      totalInterest: 'Total Interest',
    },
    chartTitle: 'Installment Repayment Details',
    descriptionContent: '<p class="text-muted-foreground">Whether it\'s the latest laptop you\'ve been eyeing or a dream overseas trip, installment purchases let you get what you want without a huge upfront payment. However, hidden behind this convenience is a cost called "installment interest." This calculator serves as your compass to clearly understand that cost and make smarter, more planned purchasing decisions.</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Why Do You Pay Installment Interest?</h3><p class="text-muted-foreground">Installment interest is the "financial service fee" that arises when the card company pays the merchant on your behalf, and you repay that amount over several months. Essentially, you\'re borrowing money from the card company for a short period, and the interest is the cost of that borrowing. The rate varies based on your credit score, installment term, and the card company\'s policy.</p><h3 class="text-xl font-semibold text-foreground mt-6 mb-3">Who Needs This Calculator?</h3><ul class="list-disc pl-5 text-sm space-y-1 mt-2 text-muted-foreground"><li><strong class="text-foreground">Planning a big purchase:</strong> Buying a car, appliance, or other high-value item on installment.</li><li><strong class="text-foreground">Smart shoppers:</strong> Want to examine total interest cost, not just monthly payments.</li><li><strong class="text-foreground">Budget planners:</strong> Need to forecast how installment purchases affect future cash flow.</li><li><strong class="text-foreground">Option comparers:</strong> Want to see how different installment terms affect total interest.</li></ul><p class="text-sm text-muted-foreground p-4 bg-muted rounded-md border border-border mt-4"><strong>Note:</strong> This calculator uses the "Equal Principal & Interest" method. Some card companies use the "Equal Principal" method, so verify the exact amount with your card statement.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Is Installment Interest Calculated?</h3><p class="text-muted-foreground">The Equal Principal & Interest method means your monthly payment stays the same throughout the installment period. Each payment consists of principal and interest — early payments are interest-heavy, while the principal portion grows over time.</p><div class="font-mono p-6 bg-card rounded-lg my-4 text-sm border border-border"><h4 class="font-sans text-lg font-semibold mb-3 text-foreground">Monthly Payment Formula</h4><p class="mb-2 text-foreground"><strong className="font-sans text-base">Monthly Payment</strong> = [Principal × Monthly Rate × (1 + Monthly Rate)^Months] / [(1 + Monthly Rate)^Months − 1]</p><p class="text-foreground"><strong className="font-sans text-base">Total Interest</strong> = (Monthly Payment × Months) − Principal</p></div><div class="p-6 bg-muted rounded-lg border border-border"><h4 class="text-lg font-semibold mb-3 text-foreground">Worked Example</h4><p class="text-muted-foreground">Buying a 1M KRW laptop at 12% annual interest over 12 months:</p><ul class="list-decimal list-inside space-y-2 mt-3 text-sm text-muted-foreground"><li><strong class="text-foreground">Principal:</strong> 1,000,000 KRW</li><li><strong class="text-foreground">Monthly Rate:</strong> 12% / 12 = 1% (0.01)</li><li><strong class="text-foreground">Monthly Payment:</strong> ≈ 88,849 KRW</li><li><strong class="text-foreground">Total Repayment:</strong> 88,849 × 12 = 1,066,188 KRW</li><li><strong class="text-foreground">Total Interest:</strong> 1,066,188 − 1,000,000 = 66,188 KRW</li></ul></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">7 Smart Tips to Maximize Your Installment Savings</h3><ul class="space-y-6"><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">1. Know the Two Faces of "Interest-Free Installments"</h4><p class="mt-2 text-muted-foreground">The best strategy is interest-free installments, but not all are truly free. Some are subsidized by the card company, while others have the interest baked into the product price. Compare prices across retailers.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">2. Check the Fee Rate Brackets by Installment Term</h4><p class="mt-2 text-muted-foreground">Longer terms reduce monthly burden but dramatically increase total interest. Card companies set different rates for specific term brackets (2-3 months, 4-6 months, etc.). Always check the fee schedule before paying.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">3. Prepayment Is the Best Interest Diet</h4><p class="mt-2 text-muted-foreground">When you receive a bonus or unexpected windfall, use it for prepayment. Paying off part or all of the remaining principal early reduces future interest. Most card company apps make this easy.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">4. Treat Revolving Credit as a Last Resort</h4><p class="mt-2 text-muted-foreground">Revolving credit carries high interest rates (often 15-20%+) and can trap you in a debt spiral. It\'s fundamentally different from installments — avoid it whenever possible.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">5. Maintain a Good Credit Score</h4><p class="mt-2 text-muted-foreground">A strong credit score unlocks lower installment rates and higher limits. Simply using cards responsibly and checking your score regularly can save you significant interest costs.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">6. Look for Card-Specific Installment Programs</h4><p class="mt-2 text-muted-foreground">Some cards offer low-rate or interest-free installments for specific sectors (electronics, education, healthcare, etc.). Check your card benefits before a big purchase.</p></li><li class="p-5 rounded-lg bg-muted border-l-4 border-primary"><h4 class="font-bold text-lg text-primary">7. Stay Informed on Consumer Protection Trends</h4><p class="mt-2 text-muted-foreground">Financial regulators are pushing for better disclosure of installment costs at the point of sale. Take advantage of these improvements to make informed decisions.</p></li></ul>',
  },
  compoundInterest: {
    title: 'Monthly Compound Savings Calculator',
    description: 'Calculate the future value of monthly compound savings and see your growth over time.',
    inputs: {
      initialInvestment: 'Initial Investment (KRW)',
      monthlyDeposit: 'Monthly Deposit (KRW)',
      months: 'Investment Period (months)',
      annualRate: 'Annual Interest Rate (%)',
      depositTiming: 'Deposit Timing',
    },
    depositTimingOptions: {
      start: 'Beginning of Month',
      end: 'End of Month',
    },
    results: {
      totalPrincipal: 'Total Principal',
      totalInterest: 'Total Interest (pre-tax)',
      maturityAmount: 'Maturity Amount',
      placeholder: 'Enter your details and press Calculate.',
    },
    tabs: {
      chart: 'Chart',
      details: 'Monthly Details',
    },
    tableHeaders: {
      month: 'Month',
      principal: 'Principal',
      interest: 'Interest (pre-tax)',
      totalWithInterest: 'Total with Interest',
    },
    chartKeys: {
      principal: 'Principal',
      totalWithInterest: 'Total with Interest',
    },
    fullTitle: 'Detailed Analysis',
    descriptionContent: '<p class="text-muted-foreground">Albert Einstein called compound interest "the eighth wonder of the world" and "humankind\'s greatest invention." A compound interest calculator is the essential tool that harnesses this powerful force for your wealth building. Unlike simple interest, which only earns interest on the principal, compound interest works by <strong class="text-foreground">earning interest on interest</strong> — like a snowball rolling downhill, growing exponentially over time.</p><p class="mt-4 text-muted-foreground">This calculator takes your initial investment, regular monthly contributions, expected annual rate, and most importantly, time — then precisely predicts how much your assets will be worth in the future. It transforms vague dreams of wealth into concrete numbers, making it the perfect partner for setting realistic financial goals and staying motivated.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Does Compound Interest Calculation Work?</h3><div class="space-y-4"><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">1. Lump-Sum Investment (No Monthly Deposits)</h4><p class="mb-2">When you only invest the initial amount with no additional contributions.</p><p class="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>FV = P × (1 + r)^n</strong></p><p class="text-sm text-muted-foreground">- P: Initial principal<br/>- r: Monthly rate (annual rate ÷ 12)<br/>- n: Total months</p></div><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">2. Regular Savings (With Monthly Deposits)</h4><p class="mb-2">When you add a fixed amount each month, compound interest effects are maximized. This calculator supports both beginning-of-month and end-of-month deposits.</p><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>Beginning of Month:</strong><br/>FV = [Lump-Sum FV] + M × [((1+r)^n − 1) / r] × (1+r)</p><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>End of Month:</strong><br/>FV = [Lump-Sum FV] + M × [((1+r)^n − 1) / r]</p><p class="text-sm text-muted-foreground">Depositing at the beginning earns one extra month of interest, resulting in a slightly higher final amount. The difference grows significantly over longer investment periods.</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Tips to Maximize Compound Interest Effects</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. Start Now — Time Is the Magic Ingredient</h4><p>The key ingredient for compound interest is time. Compare someone who starts investing 300K/month at age 25 vs. 600K/month at age 35 — at 8% annual return, the early starter has significantly more by age 65. Starting early is the surest way to build wealth with less money.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. Use the Rule of 72 to Feel the Power</h4><p>A simple formula: <strong>72 ÷ Annual Rate(%) ≈ Years to Double</strong>. At 8%, your money doubles roughly every 9 years. Use this to intuitively plan long-term wealth building.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. Manage Taxes Wisely</h4><p>Interest and dividend income from savings and funds are taxed at <strong>15.4%</strong>. Use tax-advantaged accounts — ISA, pension savings, IRP — to maximize your after-tax returns.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. Consistency Is Your Best Weapon</h4><p>Chasing short-term market swings is the enemy of long-term investing. Dollar-cost averaging through regular contributions smooths out volatility and delivers stable long-term returns. Stick to your plan.</p></li></ul>',
  },
  installmentSavingsMonthly: {
    title: 'Monthly Compound Savings Calculator',
    description: 'Calculate the future value of monthly compound savings and see your growth over time.',
    inputs: {
      initialPrincipal: 'Initial Principal (KRW)',
      monthlyDeposit: 'Monthly Deposit (KRW)',
      period: 'Investment Period (months)',
      annualInterestRate: 'Annual Interest Rate (%)',
      depositTiming: 'Deposit Timing',
    },
    depositTimingOptions: {
      beginning: 'Beginning of Month',
      end: 'End of Month',
    },
    results: {
      totalPrincipal: 'Total Principal',
      totalInterest: 'Total Interest (pre-tax)',
      maturityAmount: 'Maturity Amount',
      placeholder: 'Enter your details and press Calculate.',
    },
    tabs: {
      chart: 'Chart',
      details: 'Monthly Details',
    },
    tableHeaders: {
      month: 'Month',
      principal: 'Principal',
      interest: 'Interest (pre-tax)',
      total: 'Total with Interest',
    },
    chartKeys: {
      principal: 'Principal',
      totalWithInterest: 'Total with Interest',
    },
    fullTitle: 'Detailed Analysis',
    descriptionContent: '<p class="text-muted-foreground"><strong>Monthly compound savings</strong> is one of the most fundamental yet powerful financial tools, harnessing the magic of compound interest. Warren Buffett called compound interest the "eighth wonder of the world" — and its effect grows exponentially over time.</p><p class="mt-4 text-muted-foreground">This calculator clearly shows how your regular monthly savings grows like a snowball, powered by two wings: time and interest rate. It goes beyond simply showing the maturity amount — you can simulate scenarios like choosing between beginning-of-month vs. end-of-month deposits, or how a 0.1% rate change affects your future assets.</p><p class="mt-4 text-muted-foreground">This calculator is especially useful for young professionals or anyone starting to save for a lump sum. Watch your principal grow and interest accumulate month by month through charts and detailed tables.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Monthly Compound Savings Formulas</h3><div class="space-y-4"><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">1. Beginning of Month (Annuity Due)</h4><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>S = A × (1 + r) × [ ((1 + r)^n - 1) / r ]</strong></p><p class="text-sm text-muted-foreground">Depositing at the beginning of the month earns one extra month of interest.</p></div><div class="p-4 border-l-4 border-primary bg-muted"><h4 class="font-semibold text-lg mb-2">2. End of Month (Ordinary Annuity)</h4><p class="font-mono p-3 bg-muted rounded-md my-2"><strong>S = A × [ ((1 + r)^n - 1) / r ]</strong></p></div><div class="mt-4 text-sm text-muted-foreground"><p><strong>S</strong>: Total maturity amount (principal + interest)</p><p><strong>A</strong>: Monthly deposit amount</p><p><strong>r</strong>: Monthly interest rate (annual rate / 12)</p><p><strong>n</strong>: Total number of months</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Tips to Maximize Compound Savings</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. Start Now — Time Is the Magic Ingredient</h4><p>The key ingredient for compound interest is time. Starting 10 years earlier can mean hundreds of millions more at retirement. Even small amounts matter — the important thing is to start right now.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. Use the Rule of 72</h4><p><strong>72 / Annual Rate(%) ≈ Years to Double</strong>. At 8%, your money doubles roughly every 9 years.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. Deposit at the Beginning of the Month</h4><p>If your payday is the 25th, set auto-transfer to the 1st of next month instead of the 26th. Over 5 years at 4%, beginning deposits earn about 50,000 KRW more in interest.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. Maximize Tax-Free Accounts</h4><p>Use ISA, pension savings, IRP, and other tax-advantaged accounts to maximize after-tax returns. Deposits up to 50 million KRW can be tax-exempt.</p></li></ul>',
  },
  stockCompoundInterest: {
    title: 'Stock Compound Interest Calculator',
    description: 'See the power of long-term investing through compound interest effects.',
    inputs: {
      initialInvestment: 'Initial Investment (KRW)',
      monthlyInvestment: 'Monthly Additional Investment (KRW)',
      annualReturn: 'Annual Return (%)',
      investmentPeriod: 'Investment Period (years)',
    },
    results: {
      finalValuation: 'Final Valuation',
      detailHint: 'See the table below for details.',
      placeholder: 'Results will appear here.',
    },
    tableHeaders: {
      period: 'Period',
      principal: 'Invested Principal',
      valuation: 'Valuation',
    },
    yearSuffix: 'yr',
    fullTitle: 'Detailed Breakdown',
    descriptionContent: '<p class="text-muted-foreground"><strong>"The eighth wonder of investing."</strong> — Albert Einstein\'s description of compound interest. Stock compound interest calculator is a financial tool that lets you visually experience this powerful principle. It goes beyond simply growing your money — it clearly shows how time exponentially multiplies your assets.</p><p class="mt-4 text-muted-foreground">This calculator is especially useful for those planning long-term investments. Whether you\'re saving for retirement as a young professional or preparing education funds for your children, you can run realistic simulations. Use it as the first step to build your own investment strategy.</p><p class="mt-4 text-muted-foreground">Of course, the world of investing is full of uncertainty. This calculator provides projections based on historical data or user-set expected returns, and does not guarantee future profits. However, understanding the magic of compound interest — where steady investing meets the power of time — will be an excellent compass for your financial journey.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Compound Interest Works</h3><div class="space-y-4"><p>This calculator assumes returns are reinvested at year-end, and annual contributions are added at the beginning of each year.</p><ul class="list-decimal list-inside space-y-2"><li><strong>Year 1 Valuation:</strong><p class="pl-4 mt-1 bg-card p-2 rounded"><code>(Initial Investment + (Monthly Investment x 12)) x (1 + Annual Return)</code></p></li><li><strong>Year 2+ Valuation:</strong><p class="pl-4 mt-1 bg-card p-2 rounded"><code>(Previous Year Valuation + (Monthly Investment x 12)) x (1 + Annual Return)</code></p></li></ul><div class="mt-4 text-sm text-muted-foreground"><p><strong>Initial Investment:</strong> Seed money — the larger it is, the sooner and greater the compound effect.</p><p><strong>Monthly Investment:</strong> The power of dollar-cost averaging. Consistency creates the extraordinary.</p><p><strong>Annual Return:</strong> The engine that grows your assets. S&P 500 historical average is ~10-12%, but this varies.</p><p><strong>Investment Period:</strong> The most important factor. The longer the period, the faster returns generate more returns.</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Tips for Long-Term Stock Investing</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. Set Realistic Return Expectations</h4><p>High returns are attractive, but unrealistic expectations lead to poor decisions. Use the market\'s historical average (e.g., S&P 500 ~10%) as a baseline, and compare conservative (5-7%) and optimistic (12-15%) scenarios.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. Use the Rule of 72</h4><p><strong>72 / Annual Return(%) ≈ Years to Double</strong>. At 8%, your money doubles roughly every 9 years.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. Embrace Dollar-Cost Averaging</h4><p>Investing a fixed amount each month reduces timing risk. Buy more when prices are low, less when high — lowering your average cost over time.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. Mind Taxes and Fees</h4><p>Results are pre-tax. Domestic stocks incur transaction tax on sale, dividends are taxed at 15.4%, and overseas stocks have capital gains tax (22%). Use tax-advantaged accounts like pension funds, IRP, and ISA.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">5. Consider Real Returns (Inflation-Adjusted)</h4><p>If you earn 10% but inflation is 3%, your real return is only 7%. Always factor inflation into long-term goals to preserve purchasing power.</p></li></ul>',
  },
  salary: {
    title: 'Salary Calculator',
    description: 'What is my real take-home pay after 4 major insurances and taxes?',
    inputs: {
      annualSalary: 'Annual Salary (pre-tax)',
      nonTaxableAmount: 'Annual Non-Taxable Amount (meals, vehicle maintenance, etc.)',
      dependents: 'Number of Dependents (including yourself)',
    },
    dependentsPlaceholder: 'Select number of dependents',
    results: {
      estimatedTakeHome: 'Estimated Take-Home Pay',
      monthlyTakeHome: 'Monthly Take-Home Pay',
      annualTakeHome: 'Annual Take-Home Pay',
      placeholder: 'Enter information and press Calculate.',
    },
    tableHeaders: {
      deductionItem: 'Deduction Item',
      amountMonthly: 'Amount (monthly)',
    },
    deductions: {
      nationalPension: 'National Pension (4.5%)',
      healthInsurance: 'Health Insurance (3.545%)',
      longTermCare: 'Long-Term Care Insurance',
      employmentInsurance: 'Employment Insurance (0.9%)',
     四大InsuranceTotal: '4 Major Insurances Total',
      incomeTax: 'Income Tax (Tentative)',
      localIncomeTax: 'Local Income Tax (10%)',
      totalDeductions: 'Total Deductions',
    },
    fullTitle: 'Detailed Breakdown',
    descriptionContent: '<p class="text-muted-foreground"><strong>Salary Calculator</strong> is a smart tool that accurately calculates your monthly take-home pay by deducting complex 4 major insurances and taxes from your annual salary (pre-tax amount) stated in your contract.</p><p class="mt-4 text-muted-foreground">Beyond just seeing numbers, you can clearly understand which items and how much are deducted from your monthly salary. This helps you set up reasonable spending plans and develop tax-saving strategies using non-taxable items — the first step toward smart financial management.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Take-Home Pay Is Calculated (2025)</h3><div class="space-y-4"><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">1. Four Major Social Insurances</h3><ul class="list-disc list-inside space-y-2 text-sm"><li><strong>National Pension (Employee 4.5%):</strong> 4.5% of monthly income. (Monthly cap: 6,170,000 KRW, floor: 390,000 KRW)</li><li><strong>Health Insurance (Employee 3.545%):</strong> 3.545% of taxable monthly salary.</li><li><strong>Long-Term Care Insurance:</strong> 12.95% of health insurance premium. (Rate may vary annually)</li><li><strong>Employment Insurance (Employee 0.9%):</strong> 0.9% of total monthly salary.</li></ul></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">2. Income Tax & Local Income Tax</h3><ul class="list-disc list-inside space-y-2 text-sm"><li><strong>Income Tax:</strong> Determined by the NTS "Tentative Income Tax Table" based on taxable monthly salary and number of dependents.</li><li><strong>Local Income Tax:</strong> 10% of calculated income tax.</li></ul></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Tips to Maximize Your Salary</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. Maximize Non-Taxable Items</h4><p>Meals (up to 200,000 KRW/month), vehicle maintenance (up to 200,000 KRW/month), and childcare allowance (up to 200,000 KRW/month for children under 6) are non-taxable. Using these reduces both insurance premiums and income tax.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. Year-End Adjustment — Get Your "13th Month Salary"</h4><p>Prepare credit/debit card spending, medical expenses, education costs, and rent. Pension savings/IRP accounts offer up to 9 million KRW in tax credits annually.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. Negotiate Salary on Pre-Tax Basis</h4><p>All salary negotiations are based on pre-tax amounts. Research industry averages, document your achievements with concrete numbers, and present clear evidence.</p></li></ul>',
  },
  ordinaryWage: {
    title: 'Ordinary Wage Calculator',
    description: 'Calculate ordinary wage from base salary, allowances, and bonuses.',
    inputs: {
      baseSalary: 'Monthly Base Salary (KRW)',
      monthlyAllowances: 'Monthly Other Allowances (KRW)',
      annualBonuses: 'Annual Bonuses (KRW)',
      workHoursPerWeek: 'Weekly Working Hours',
    },
    results: {
      hourlyWage: 'Hourly Ordinary Wage',
      dailyWage: 'Daily Ordinary Wage',
      monthlyWage: 'Monthly Ordinary Wage',
      annualWage: 'Annual Wage Equivalent',
      placeholder: 'Enter information and press Calculate.',
    },
    fullTitle: 'Detailed Analysis',
    descriptionContent: '<p class="text-muted-foreground"><strong>Ordinary Wage</strong> is a core wage concept that goes beyond a simple monthly salary figure. It serves as the basis for calculating various legally mandated allowances for employees — overtime, night, and holiday premium pay, annual paid leave allowance, dismissal notice pay, and more.</p><p class="mt-4 text-muted-foreground">Knowing your ordinary wage precisely is the path for employees to claim their rightful entitlements, and for employers to prevent potential legal disputes and build stable labor relations. This calculator was created to help you easily understand the complex ordinary wage concept and quickly calculate the amount that applies to your situation.</p>',
    formulaContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">How Ordinary Wage Is Calculated</h3><div class="space-y-4"><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">1. Monthly Ordinary Wage</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">Monthly Ordinary Wage = Monthly Base Salary + Fixed Allowances + (Annual Bonuses / 12)</p><p class="text-xs text-muted-foreground mt-2">Not all allowances and bonuses are included — they must meet the criteria (regularity, universality, fixedness) explained below.</p></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">2. Hourly Ordinary Wage (Most Basic!)</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">Hourly Ordinary Wage = Monthly Ordinary Wage / Monthly Standard Working Hours</p><p class="mt-3"><strong>Monthly Standard Working Hours:</strong></p><p class="text-sm">For 40-hour/5-day work weeks, including paid weekly leave (8 hours Sunday), the average is <strong>209 hours/month</strong>.</p></div><div class="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 class="text-lg font-bold text-primary mb-3">3. Daily Ordinary Wage</h3><p class="font-mono p-3 bg-card rounded-md text-sm shadow-sm">Daily Ordinary Wage = Hourly Ordinary Wage x Daily Working Hours</p></div></div>',
    tipsContent: '<h3 class="text-lg font-semibold mt-6 mb-3 text-foreground">Key Facts About Ordinary Wage (2025)</h3><ul class="space-y-4"><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">1. Three Criteria: Regularity, Universality, Fixedness</h4><p>An item qualifies as ordinary wage only if it meets all three: paid regularly (even quarterly/semi-annually if ongoing), paid to all employees meeting certain conditions, and paid automatically without performance conditions.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">2. Ordinary Wage vs. Average Wage</h4><p>Ordinary wage determines overtime and leave pay. Average wage (total wages over 3 months / total days) determines severance. If average wage is lower than ordinary wage, ordinary wage is used for severance instead (employee protection clause).</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">3. What Ordinary Wage Affects</h4><p>Overtime/night/holiday premium pay (150%), annual leave unused pay, dismissal notice pay (30 days), maternity/parental leave benefits, and severance pay.</p></li><li class="p-4 rounded-md bg-muted shadow"><h4 class="font-semibold text-lg mb-2 text-primary">4. Included vs. Excluded Items</h4><p><strong>Included:</strong> Base salary, job/position allowances, technical/qualification allowances, fixed meal/transport/communication allowances, fixed bonuses. <strong>Excluded:</strong> Performance bonuses, actual expense reimbursements, family allowances varying by dependents, welfare benefits, unused annual leave pay.</p></li></ul>',
  },
  weeklyHoliday: {
    title: 'Weekly Holiday Allowance Calculator',
    description: 'Enter your hourly wage, daily working hours, and weekly working days to calculate your weekly holiday allowance.',
    inputs: {
      hourlyWage: 'Hourly Wage (KRW)',
      workHoursPerDay: 'Daily Working Hours (hours)',
      workDaysPerWeek: 'Weekly Working Days (days)',
    },
    placeholders: {
      hourlyWage: 'Enter hourly wage',
      workHoursPerDay: 'Enter daily working hours',
      workDaysPerWeek: 'Select',
    },
    results: {
      weeklyWorkHours: 'Weekly Scheduled Working Hours:',
      weeklyHolidayAllowance: 'Estimated Weekly Holiday Allowance:',
    },
    reset: 'Reset',
    descriptionContent: '<p class="text-lg font-semibold">If you work faithfully all week, you have the right to a paid day off.</p><p>The weekly holiday allowance is a precious right of workers stipulated in Article 55 of the Labor Standards Act. It guarantees one paid holiday (weekly holiday) per week for workers who have fulfilled all scheduled working days, and pays an additional day\'s wages even if they don\'t work that day. Many part-time and short-hour workers mistakenly believe they aren\'t eligible, but anyone who meets the working conditions can receive it regardless of employment type.</p><p>This calculator helps verify complex eligibility conditions for weekly holiday allowances and calculates the exact allowance amount matching your work pattern, preventing disadvantages such as wage theft. It\'s also useful for checking your effective hourly rate when hourly wage includes the weekly holiday allowance, based on the 2025 minimum wage.</p><p>For business owners, it serves as basic data to pay accurate wages to employees, prevent legal disputes, and build healthy labor-management relations.</p>',
    formulaContent: '<div className="space-y-4 p-4 bg-muted rounded-md"><h3 className="text-xl font-bold">How Is My Weekly Holiday Allowance Calculated?</h3><p>The weekly holiday allowance is calculated proportionally to your weekly scheduled working hours. It\'s easy to understand by considering that the allowance is generated in proportion to the hours worked, based on the legal maximum working hours of 40 hours per week.</p><div className="border-l-4 border-primary pl-4 mt-4"><p><strong>Formula:</strong></p><p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(Weekly Total Scheduled Hours / 40 hours) × 8 hours × Hourly Wage</code></p></div><div className="mt-4"><h4 className="font-semibold">Example:</h4><p>For a worker earning 10,000 KRW per hour, working 6 hours per day for 4 days per week (24 hours total):</p><p className="pl-4 mt-1 bg-card p-2 rounded font-mono"><code>(24 hours / 40 hours) × 8 hours × 10,000 KRW = 48,000 KRW</code></p><p className="text-sm text-muted-foreground mt-1">Therefore, this worker receives 48,000 KRW in weekly holiday allowance in addition to their weekly wage (24 hours × 10,000 KRW = 240,000 KRW), totaling 288,000 KRW.</p></div><p className="text-xs text-muted-foreground mt-4">* Note: Even if you work 40 hours or more per week, the weekly holiday allowance is only paid up to 8 hours (based on 40 hours per week).</p></div>',
    tipsContent: '<div className="space-y-6"><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">1. Conditions for Receiving Weekly Holiday Allowance (Remember These 3!)</h4><p>To receive the weekly holiday allowance, you must meet all three of the following conditions:</p><ul className="list-decimal pl-5 space-y-2 mt-2"><li><strong>15+ hours of weekly working:</strong> The scheduled working hours per week as stated in the employment contract must be 15 hours or more. Overtime, night, and holiday work hours are not included.</li><li><strong>Perfect attendance on scheduled days:</strong> You must attend all days scheduled to work during the week. Tardiness and early departure are not considered absences, so you can still receive the weekly holiday allowance. However, if you are absent without leave for even one day, the allowance for that week will not be generated.</li><li><strong>Expected to work next week:</strong> The weekly holiday allowance is paid on the premise of working the following week. Therefore, you cannot receive it if you work for only one week and then quit.</li></ul></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">2. Do Businesses with Fewer Than 5 Employees Also Need to Pay Weekly Holiday Allowance?</h4><p><strong>Yes, they must.</strong> The weekly holiday allowance is a mandatory provision that applies to all businesses where the Labor Standards Act is enforced, regardless of the number of permanent employees. Not paying weekly holiday allowance due to having fewer than 5 employees is clearly a case of wage theft.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">3. When Monthly Salary Includes Weekly Holiday Allowance (Comprehensive Wage System)</h4><p>In the case of monthly-salaried workers, it\'s common for the monthly salary to include the weekly holiday allowance (comprehensive wage system). However, even in this case, the employment contract must clearly state that "the monthly salary of [amount] includes the weekly holiday allowance." Additionally, dividing the monthly salary including the weekly holiday allowance by actual working hours must result in an hourly wage of at least the minimum wage to be legally valid.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">4. Ultra-Short-Hour Workers and Weekly Holiday Allowance</h4><p>Workers whose average weekly scheduled working hours over 4 weeks are less than 15 hours are called "ultra-short-hour workers." Unfortunately, ultra-short-hour workers are not covered by the weekly holiday allowance, annual paid leave, or severance pay under the Labor Standards Act. This is due to the law\'s intent to encourage long-term employment and guarantee minimum rest.</p></div><div><h4 className="font-semibold text-lg border-l-4 border-primary pl-3 mb-2">5. Weekly Holiday Allowance and Effective Hourly Wage (Based on 2025 Minimum Wage)</h4><p>When including the weekly holiday allowance, your effective hourly wage becomes higher. For example, assuming the 2025 minimum wage is 10,000 KRW and you work 40 hours per week, your weekly wage would be 400,000 KRW and the weekly holiday allowance would be 80,000 KRW. Dividing the total of 480,000 KRW by 40 hours gives an effective hourly wage of 12,000 KRW. This concept can be usefully applied when comparing salary conditions during job searches or negotiating annual salaries.</p></div></div>',
  },
  depositInterest: {
    title: 'Deposit Interest Calculator',
    description: 'Choose simple or compound interest and tax options to calculate your maturity amount.',
    inputs: {
      principal: 'Deposit Amount (KRW)',
      annualRate: 'Annual Interest Rate (%)',
      period: 'Deposit Period (months)',
      interestType: 'Interest Calculation Method',
      taxType: 'Tax Option',
    },
    placeholders: {
      principal: 'e.g., 10,000,000',
      annualRate: 'e.g., 3.5',
      period: 'e.g., 12',
    },
    interestTypeOptions: {
      simple: 'Simple Interest',
      compound: 'Monthly Compound',
    },
    taxTypeOptions: {
      general: 'General Taxation (15.4%)',
      preferential: 'Tax-Advantaged (9.5%)',
      nonTaxable: 'Non-Taxable (0%)',
    },
    results: {
      maturityAmount: 'Maturity Amount',
      principal: 'Principal',
      preTaxInterest: 'Pre-Tax Interest',
      tax: 'Tax',
      afterTaxInterest: 'After-Tax Interest',
    },
    calculate: 'Calculate',
    fullWidthTitle: 'Detailed Breakdown',
    placeholder: 'Enter your information and press Calculate.',
    errorAllFields: 'Please enter all fields correctly.',
    errorPrincipal: 'Deposit amount must be greater than 0.',
    errorRate: 'Annual interest rate must be greater than 0.',
    errorPeriod: 'Deposit period must be greater than 0.',
    toastSuccess: 'Deposit interest calculation complete.',
    descriptionContent: '<h2 className="text-2xl font-bold text-foreground mb-4">Deposit Interest Calculator: How to Make Your Sleeping Money Work</h2><p className="text-lg text-muted-foreground mb-6">The foundation of financial management starts with "not losing money." In that sense, <strong>deposits</strong> are the most reliable and stable financial tool to safely protect and steadily grow your assets in a volatile investment market. In particular, <strong>term deposits</strong> that lock your money for a set period and receive promised interest are highly effective for achieving short-term financial goals like saving for a down payment on a house, paying a housing contract deposit, or funding a vacation.</p><p className="text-foreground leading-relaxed">However, even if you deposit the same amount, the final amount you receive at maturity can vary greatly depending on how interest is calculated (simple/compound) and whether taxes (taxable/non-taxable) apply. Many people sign up for deposits believing only the "3.5% annual rate" and are disappointed when they see the actual amount received after taxes at maturity.</p><p className="mt-4 text-foreground leading-relaxed"><strong>All-in-Calc\'s Deposit Interest Calculator</strong> was created to solve this inconvenience. Simply enter the deposit amount, period, and interest rate, and you can easily check the actual amount you\'ll receive at maturity, considering complex interest calculations and taxes.</p><ul className="list-disc list-inside mt-4 space-y-2 text-foreground bg-muted p-4 rounded-lg"><li>Simple vs compound interest: which method is more favorable for you?</li><li>How much tax will be deducted from your precious interest? (Based on 2025)</li><li>How much more can you receive with non-taxable or tax-advantaged benefits?</li><li>What\'s the difference in actual amount received between a 1-year and 2-year deposit?</li></ul><p className="mt-6 text-foreground leading-relaxed">Now, plan your future with accurate numbers instead of vague expectations. With All-in-Calc, the first step toward stable asset growth becomes easier and clearer.</p>',
    formulaContent: '<h3 className="text-xl font-bold text-foreground mt-8 mb-4">Simple vs Compound Interest: How Is Interest Calculated?</h3><p className="text-foreground leading-relaxed mb-6">Deposit interest calculation methods are broadly divided into simple and compound interest. The method you choose can result in significant differences in your maturity amount, especially as the deposit period lengthens.</p><div className="space-y-6"><div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg"><h4 className="font-semibold text-lg mb-2 text-primary">1. Simple Interest</h4><p className="text-muted-foreground mb-3">Interest is calculated only on the <strong>initial principal</strong>. Even when interest is generated, it is not included in the principal, so the same amount of interest occurs each period.</p><p className="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>Pre-Tax Interest = Principal × Annual Rate × (Deposit Months / 12)</strong></p></div><div className="p-4 pl-0 border-l-4 border-primary bg-muted rounded-r-lg"><h4 className="font-semibold text-lg mb-2 text-primary">2. Monthly Compound Interest</h4><p className="text-muted-foreground mb-3">Generated interest is <strong>added to the principal</strong>, and the combined amount becomes the new principal for calculating the next period\'s interest. This creates a "snowball effect" where interest grows exponentially over time.</p><p className="font-mono p-3 bg-muted rounded-md my-2 text-center"><strong>Pre-Tax Interest = Principal × (1 + Monthly Rate) ^ Deposit Months - Principal</strong></p><p className="text-xs text-muted-foreground text-center">* Monthly Rate = Annual Rate / 12</p></div></div><h3 className="text-xl font-bold text-foreground mt-10 mb-4">Tax That Determines Your Final Amount (Based on 2025)</h3><p className="text-foreground leading-relaxed">Deposit interest is classified as "interest income" and is subject to taxation. Therefore, the final amount is the pre-tax interest minus tax. Since the tax rate varies by tax option, it\'s important to know which rate applies to you.</p><div className="bg-muted p-4 rounded-md my-4 border border-border border-border"><p className="text-center font-semibold text-lg">After-Tax Amount = Principal + Pre-Tax Interest - (Pre-Tax Interest × Tax Rate)</p></div><ul className="list-disc pl-5 mt-6 space-y-4 text-foreground"><li><strong>General Taxation (15.4%):</strong> The basic rate applied to most financial products. 15.4% of interest income is withheld as tax. (Income tax 14% + Local income tax 1.4%)</li><li><strong>Tax-Advantaged (9.5%):</strong> Members or associate members of mutual financial institutions (NACF, Suhyup, credit unions, Saemaul Geumgo, etc.) can receive a lower tax rate on deposits up to 30 million KRW per person.</li><li><strong>Non-Taxable (0%):</strong> "Non-taxable comprehensive savings" for seniors (65+), disabled persons, independence activists, etc. exempts interest income from tax on deposits up to 50 million KRW per person.</li></ul>',
    tipsContent: '<h3 className="text-xl font-bold text-foreground mt-8 mb-4">5 Tips to Get Every Last Penny of Interest</h3><ul className="space-y-6"><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">1. Compare Rates Online Instead of Visiting Banks</h4><p className="text-muted-foreground">You no longer need to visit multiple banks to find higher rates. Through services like the Financial Supervisory Service\'s "Financial Products at a Glance," the Korea Federation of Banks consumer portal, and various fintech apps (Toss, Kakao Bank, Bank Salad, etc.), you can compare all banks\' deposit rates in real time and easily find the best conditions. Even a 0.1% rate difference can make a big difference over the long term.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">2. Use Special Deposit Alerts</h4><p className="text-muted-foreground">Banks occasionally sell "special deposits" at much higher rates than base rates to attract new customers or secure liquidity. They\'re so popular that quotas are filled within hours of launch. Set up app push notifications for banks you\'re interested in or watch fintech communities to catch these opportunities.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">3. Think Twice About Automatic Renewal</h4><p className="text-muted-foreground">Auto-renewal at maturity is convenient, but the rate at renewal may be lower than current rates. When rates are rising, it\'s often better to switch to a higher-rate product (redeposit) rather than auto-renew. Mark the maturity date on your calendar!</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">4. Maximize Non-Taxable/Tax-Advantaged Benefits</h4><p className="text-muted-foreground">Operating deposits through an ISA (Individual Integrated Asset Management Account) allows you to receive tax-free benefits on interest and dividend income up to 2 million KRW (4 million KRW for basic type) within the account. Additionally, if you\'re 65+ or a person with disabilities, be sure to use the "non-taxable comprehensive savings" limit (50 million KRW) to save on taxes.</p></li><li className="p-4 pl-0 rounded-lg bg-muted border-l-4 border-primary"><h4 className="font-semibold text-lg mb-2 text-primary">5. Remember the Depositor Protection Act Limit (50 Million KRW)</h4><p className="text-muted-foreground">As a precaution, it\'s safe to deposit up to 50 million KRW (principal + interest) at a single financial institution. The Depositor Protection Act protects up to 50 million KRW per person even if a financial company goes bankrupt, so it\'s wise to spread large sums across multiple banks. Savings banks may offer higher rates but have relatively lower stability, so this principle should be followed more strictly.</p></li></ul>',
  },
  retirement: {
    title: 'Severance Pay Calculator',
    description: 'Calculate your estimated severance pay based on employment period and salary information.',
    inputs: {
      startDate: 'Start Date',
      endDate: 'End Date',
      last3MonthsSalary: 'Salary for Last 3 Months Before Retirement',
      month1: 'Month 1 Salary',
      month2: 'Month 2 Salary',
      month3: 'Month 3 Salary',
      annualBonus: 'Total Annual Bonus',
      annualLeaveAllowance: 'Annual Leave Allowance',
    },
    calculateButton: 'Calculate Severance Pay',
    results: {
      title: 'Severance Pay Calculation Result',
      totalDays: 'Total Days of Employment',
      dailyAverageWage: 'Daily Average Wage',
      estimatedSeverancePay: 'Estimated Severance Pay',
    },
    placeholder: 'Press Calculate to see the result.',
    toastStartDateRequired: 'Please select both start and end dates.',
    toastEndDateBeforeStart: 'End date cannot be earlier than start date.',
    toastLessThan1Year: 'Employment period less than 1 year is not eligible for severance pay.',
    toastSuccess: 'Severance pay has been calculated.',
    descriptionContent: '<p><strong>Severance pay</strong> is called the "second salary" and is a very important asset for workers\' stable retirement life. It\'s valuable funds paid to workers who have worked for 1 year or more when they retire, as compensation for their labor. In the past, it was common to receive it as a lump sum at retirement, but now it\'s managed more systematically through <strong>retirement pension systems (DB, DC, IRP)</strong>.</p><p>This calculator simplifies the complex severance pay calculation process, helping you easily and quickly check your estimated severance pay. Enter your start date, end date, salary for the 3 months before retirement, and other allowances like annual bonuses to calculate your estimated severance pay according to legal standards.</p><p>Beyond just checking the amount, use this calculation result as the first step to understanding the difference in receive amounts by retirement pension type (DB/DC), and to plan effective tax-saving strategies using IRP accounts and retirement asset growth plans.</p>',
    formulaContent: '<p className="font-semibold">Severance pay is calculated based on the "daily average wage" in proportion to "total days of employment." It\'s important to accurately understand the two key calculation elements.</p><div className="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 className="text-lg font-bold text-primary mb-3">1. Daily Average Wage Calculation</h3><p>The total wages paid during the 3 months before the retirement date divided by the total number of days in that period. This includes not only base salary but also overtime, night, holiday work allowances, and various other allowances.</p><p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm overflow-x-auto mt-2">Daily Average Wage = (Total wages for 3 months before retirement + Annual bonus × 3/12 + Annual leave allowance × 3/12) / Total days in 3 months before retirement</p><p className="text-xs text-muted-foreground dark:text-muted-foreground mt-2">* Allowances and annual leave allowances paid on an annual basis are converted to 3 months and included.</p><p className="text-xs text-primary mt-2">* If the daily average wage is less than the ordinary wage, the ordinary wage must be used as the daily average wage for calculation.</p></div><div className="p-4 bg-muted rounded-lg border-l-4 border-primary"><h3 className="text-lg font-bold text-primary mb-3">2. Estimated Severance Pay Calculation</h3><p>The calculated daily average wage is multiplied by 30 to get the "30-day average wage," which is then proportionally applied to the total employment period to calculate the final severance pay.</p><p className="font-mono p-3 bg-card rounded-md text-sm shadow-sm overflow-x-auto mt-2">Estimated Severance Pay = Daily Average Wage × 30 days × (Total Days of Employment / 365 days)</p><div className="mt-4 p-4 bg-muted rounded-lg border border-border"><h4 className="font-semibold text-foreground mb-2">Calculation Example (Daily Average Wage 100,000 KRW, 5 years of service)</h4><p className="text-sm text-muted-foreground">Total days of employment = 365 × 5 = 1,825 days</p><p className="font-mono text-sm text-primary mt-1">Estimated Severance Pay = 100,000 × 30 × (1,825 / 365) = 100,000 × 30 × 5 = 15,000,000 KRW</p></div></div>',
    tipsContent: '<h2 className="text-2xl font-bold text-foreground mt-10 mb-4">5 Retirement Design Strategies to Maximize Your Severance Pay</h2><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">1. DB vs DC: Which Retirement Pension Is Better for Me?</h3><p className="mt-2">Understanding your company\'s retirement pension system is the first step. <strong>If you prioritize stability, DB (Defined Benefit) may be better; if you expect investment returns, DC (Defined Contribution)</strong> could be more advantageous.</p><ul className="list-disc list-inside mt-3 space-y-2 text-sm"><li><strong>DB (Defined Benefit):</strong> You receive a fixed amount based on average wages at retirement and years of service. The company manages the reserves, making it favorable for workers at large corporations or public institutions with high wage growth rates. Stable but without investment return opportunities.</li><li><strong>DC (Defined Contribution):</strong> The company deposits at least 1/12 of annual total wages into the worker\'s account, and the worker manages (invests) it directly. Severance pay varies based on investment performance. Favorable for those confident in investing and expecting returns higher than wage growth rates.</li></ul></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">2. IRP Account: The Magic Account That Reduces Taxes and Grows Retirement Funds</h3><p className="mt-2">When receiving severance pay, transferring it to an Individual Retirement Pension (IRP) account allows you to <strong>defer retirement income tax and enjoy tax benefits until the pension payout date</strong>. This is a very powerful tax-saving benefit.</p><ul className="list-disc list-inside mt-3 space-y-2 text-sm"><li><strong>Tax deferral effect:</strong> You can reinvest the entire principal without tax deduction, expecting higher returns.</li><li><strong>Low-rate taxation:</strong> When receiving as pension, a lower pension income tax rate (3.3%~5.5%) equivalent to 70% of the existing retirement income tax rate (about 6~45%) applies.</li><li><strong>Tax credit:</strong> You can receive tax credit benefits (13.2% or 16.5%) on additional contributions to the IRP account, up to 9 million KRW annually.</li></ul></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">3. Severance Pay Interim Settlement: Only When Absolutely Necessary!</h3><p className="mt-2">Severance pay interim settlement is not possible unless there are specific reasons prescribed by law, such as home purchase for non-homeowners. Even if possible, you should be cautious. Interim settlement means using long-term retirement assets early, losing the opportunity for compound interest effects. Unless it\'s unavoidable, it\'s wise to preserve severance pay and operate it until retirement.</p></div><div className="p-5 rounded-lg bg-muted border-l-4 border-primary"><h3 className="font-bold text-lg text-primary">4. Severance Pay Also Needs "Investment"</h3><p className="mt-2">DC plan participants or IRP account holders must decide which products to use for their reserves. If you just leave it in principal-guaranteed products thinking "it\'ll work out," its real value may decline as it won\'t keep up with inflation. Consider your investment style and remaining period to create a <strong>portfolio strategy that appropriately allocates between stable bond funds, growth-oriented equity funds, TDF (Target Date Funds), etc.</strong></p></div>',
  },
  unitConverter: {
    title: 'Unit Converter',
    description: 'Convert basic units and engineering units quickly.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    undefinedCategory: 'Undefined unit category.',
    groupLabels: {
      group1: 'Basic Units',
      group2: 'Engineering Units',
    },
    calculatorDescription: {
      p1: '<strong>Unit Converter</strong> is a practical tool that lets you convert all basic units (length, area, volume, temperature) and engineering units (flow, pressure, energy, mass, enthalpy) on a single screen. Select a unit from the dropdown, enter a value, and instantly see the converted results for all units in that category.',
      p2: 'In daily life, unit conversion is often needed for home decoration, cooking, exercise tracking, and more. In industrial sites and research labs, professional unit conversion is essential when dealing with design drawings, test data, and overseas specifications. This tool is divided into a basic tab and an engineering tab so anyone can use it easily.',
      p3: 'For students and teachers, it serves as learning material to understand unit concepts. For engineers and technicians, it is a practical tool for reviewing drawings and specifications. It is also very helpful when reading spec sheets of imported equipment or translating overseas documents.',
      note: 'Conversion coefficients follow the International System of Units (SI) and widely accepted standards. However, temperature (°C, °F, K) is calculated using a separate linear formula, not simple proportion, so be careful not to confuse it with other units.',
    },
    glossary: [
      { term: 'International System of Units (SI)', desc: 'An international standard unit system based on length (m), mass (kg), time (s), and temperature (K). It serves as the basis for most scientific and engineering unit conversions.' },
      { term: 'Enthalpy', desc: 'An engineering unit (usually J or kJ) representing the total heat energy of a substance, frequently used alongside flow and pressure in thermodynamics and plant design.' },
      { term: 'Unit Prefix', desc: 'Abbreviations like k (kilo) = 1,000x, m (milli) = 1/1,000x, µ (micro) = 1/1,000,000x used to adjust the magnitude of units.' },
    ],
    formulaTitle1: 'Linear Unit Conversion Formula',
    formulaDesc1: 'Proportional units like length, area, volume, and mass are converted using reference unit coefficients.',
    formulaFormula: 'Target Value = Input Value × (Target Unit Coefficient / Reference Unit Coefficient)',
    formulaExample: 'e.g. 1 m = 100 cm = 1,000 mm, 1 km = 1,000 m',
    formulaTitle2: 'Temperature Conversion Formula',
    formulaDesc2: 'Temperature has different zero points, so both multiplication and addition are applied.',
    formulaTitle3: 'Calculation Example',
    formulaExampleDesc: 'Converting 5 km to m and cm:',
    formulaExampleResult: '5 km × 1,000 = 5,000 m = 500,000 cm',
    tips: {
      title1: 'Basic Unit Usage',
      items1: ['Length, area, volume, and temperature are the most commonly used units in daily life.', 'Use the basic tab for home interior or exercise tracking.'],
      title2: 'Engineering Unit Usage',
      items2: ['Flow, pressure, energy, mass, and enthalpy are used in plant and mechanical design.', 'Useful when converting units on overseas equipment spec sheets to domestic standards.'],
      title3: 'Temperature Conversion Caution',
      items3: ['Celsius, Fahrenheit, and Kelvin (K) are calculated separately using linear formulas.', 'Do not confuse with proportional units as their zero points differ.'],
      title4: 'Decimals and Significant Figures',
      items4: ['Adjust the number of decimal places to match the precision of your measured values.', 'Excessive decimals can actually reduce credibility.'],
      title5: 'Learn Unit Prefixes',
      items5: ['k (kilo) = 1,000, m (milli) = 0.001, µ (micro) = 0.000001 multipliers.', 'Changing just the prefix makes calculations easier.'],
      title6: 'Verification Habit',
      items6: ['For important design values, use a different calculator to verify results at least twice.', 'Especially with pressure and energy units, dimensional errors are common.'],
    },
  },
  weightConverter: {
    title: 'Weight Converter',
    description: 'Convert weight between mg, g, kg, ton, oz, lb units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    unitLabels: {
      mg: 'Milligram (mg)',
      g: 'Gram (g)',
      kg: 'Kilogram (kg)',
      ton: 'Ton',
      oz: 'Ounce (oz)',
      lb: 'Pound (lb)',
    },
    calculatorDescription: {
      p1: '<strong>Weight Converter</strong> provides accurate conversions between various weight and mass units. You can quickly convert between milligrams (mg), grams (g), kilograms (kg), tons, ounces (oz), and pounds (lb), freely switching between metric and imperial units.',
      p2: 'Weight unit conversion is needed in cooking and baking, science experiments, logistics and transportation, health and weight management, and across daily life and industry. It is particularly useful for preventing unit confusion when dealing with imported food nutrition labels or overseas specification documents.',
      p3: 'For students, it serves as learning material to develop a sense of units. For researchers, chefs, and logistics personnel, it is a practical tool. Accurate measurement is crucial as it determines the success of cooking and the reliability of experiments.',
      note: 'Conversion coefficients follow international standards. 1 kg = 1,000 g = 2.2046 lb, and the ton is based on the metric ton (1,000 kg). Be aware that this differs from the US ton (short ton, approx. 907 kg) and UK ton (long ton, approx. 1,016 kg).',
    },
    glossary: [
      { term: 'Metric vs Imperial', desc: 'The metric system is the international standard based on kg·m·s, while the imperial system uses pounds·ounces·inches. Conversion is necessary as they are used interchangeably across countries and fields.' },
      { term: 'Metric Tonne', desc: 'The international standard ton based on 1,000 kg. It differs from the US short ton (approx. 907 kg) and UK long ton (approx. 1,016 kg), so unit definitions in documents or contracts must be verified.' },
    ],
    formulaTitle: 'Weight Unit Conversion Relationships',
    formulaExample: 'Converting 5 kg to pounds (lb):',
    formulaResult: '5 kg × 2.2046 = 11.023 lb',
    tips: {
      title1: 'Everyday Weight Comparisons',
      items1: ['Apple: approx. 150~200 g, Average adult weight: 70~80 kg', 'Small car: 1~1.5 ton, Elephant: 4~6 ton'],
      title2: 'Weight in Cooking',
      items2: ['Korean cooking mainly uses g, while Western cooking uses oz·cups.', 'Precise weight measurement is important for baking consistency.'],
      title3: 'International Trade',
      items3: ['The metric tonne is the standard in international trade.', 'Used for grain, oil, and mineral trade volume calculations.'],
      title4: 'Laboratory Measurement',
      items4: ['Measure precisely with an electronic balance and standardize units.', 'Mass-based calculation is stable since volume changes with temperature.'],
      title5: 'Ton Unit Caution',
      items5: ['Metric tonne, US ton, and UK ton have different values.', 'Always verify the unit definition in contracts.'],
      title6: 'Health Management',
      items6: ['Record body weight and muscle mass in kg.', 'Distinguish between g and mg on nutrition labels.'],
    },
  },
  distanceConverter: {
    title: 'Distance Converter',
    description: 'Convert distance between mm, cm, m, km, inch, foot, yard, mile units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    unitLabels: {
      mm: 'Millimeter (mm)',
      cm: 'Centimeter (cm)',
      m: 'Meter (m)',
      km: 'Kilometer (km)',
      inch: 'Inch',
      foot: 'Foot',
      yard: 'Yard',
      mile: 'Mile',
    },
    calculatorDescription: {
      p1: '<strong>Distance Converter</strong> provides accurate conversions between various length units including metric and imperial systems. You can quickly change between millimeters (mm), centimeters (cm), meters (m), kilometers (km), inches, feet, yards, and miles.',
      p2: 'Distance unit conversion is needed in travel, architecture, civil engineering, science experiments, and more. It is particularly useful in international environments that use both metric and imperial systems, when reading imported equipment spec sheets, or when working with overseas maps and drawings.',
      p3: 'For students, it serves as learning material to understand unit concepts. For designers and builders, it is a practical tool for coordinating drawings and site measurements. It is also convenient in daily life for comparing heights, built-in wardrobe sizes, and exercise distances.',
      note: 'Conversion coefficients follow international standards (ISO). Inch and centimeter are strictly 1 inch = 2.54 cm, and mile is 1 mile = 1.609344 km. In aviation, nautical miles (1.852 km) are used, so choose the appropriate unit for your purpose.',
    },
    glossary: [
      { term: 'Nautical Mile', desc: 'A length unit used in aviation and maritime, where 1 nautical mile = 1.852 km. It corresponds to 1 minute of latitude at the equator, and differs from the land mile.' },
      { term: 'Metric vs Imperial', desc: 'The metric system uses mm·cm·m·km as the international standard, while the imperial system uses inch·foot·yard·mile. Conversion is needed as they are used interchangeably in some countries like the US.' },
    ],
    formulaTitle: 'Distance Unit Conversion Relationships',
    formulaExample: 'Converting 100 yards to meters:',
    formulaResult: '100 yard × 0.9144 = 91.44 m',
    tips: {
      title1: 'Everyday Distance Comparisons',
      items1: ['Basketball court: 28 m, Football field length: 100~110 m', 'Seoul to Busan: approx. 325 km, Earth circumference: approx. 40,075 km'],
      title2: 'Metric vs Imperial',
      items2: ['Most countries except the US, Liberia, and Myanmar use the metric system.', 'UK road signs display both meters and miles.'],
      title3: 'Aviation Distance',
      items3: ['Aviation uses nautical miles (1.852 km), where 1 nautical mile equals 1 minute at the equator.', 'Map distance and actual flight distance may differ.'],
      title4: 'Architecture and Civil Engineering',
      items4: ['Convert drawing units (feet/inches) to site units (m) to reduce errors.', 'Consider margins when calculating material lengths.'],
      title5: 'Exercise Record Keeping',
      items5: ['Record running distances in both km and mile for comparison.', 'Unify distance units when converting pace.'],
      title6: 'Decimal Caution',
      items6: ['Record significant figures matching precision in precise measurements.', 'Specify units to prevent accidents caused by unit confusion.'],
    },
  },
  volumeConverter: {
    title: 'Volume Converter',
    description: 'Convert volume between mL, L, gal, qt, pt, cup, fl oz, m³, cm³ units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    unitLabels: {
      mL: 'Milliliter (mL)',
      L: 'Liter (L)',
      gal: 'Gallon (gal)',
      qt: 'Quart (qt)',
      pt: 'Pint (pt)',
      cup: 'Cup',
      'fl oz': 'Fluid Ounce (fl oz)',
      'm³': 'Cubic Meter (m³)',
      'cm³': 'Cubic Centimeter (cm³)',
    },
    calculatorDescription: {
      p1: '<strong>Volume Converter</strong> provides accurate conversions between various volume and capacity units. You can quickly convert between milliliters (mL), liters (L), gallons (gal), quarts (qt), pints (pt), cups, fluid ounces (fl oz), cubic meters (m³), and cubic centimeters (cm³).',
      p2: 'Volume unit conversion is frequently needed in cooking and baking, chemistry experiments, engineering design, logistics, and daily life. It is used when switching between metric and imperial units for recipe scaling, reagent mixing, tank capacity calculations, and more.',
      p3: 'For chefs and researchers, it serves as a measuring tool. For engineers and logistics personnel, it is a design and transportation tool. Accurate volume conversion is a key factor that determines the reliability and safety of mixing ratios.',
      note: 'Conversion coefficients follow international standards: 1 L = 1,000 mL = 1,000 cm³, 1 m³ = 1,000 L. However, note that the US gallon (3.78541 L) and the imperial gallon (4.546 L) differ.',
    },
    glossary: [
      { term: 'Gallon Types (US/Imp gal)', desc: 'US gallon is 3.78541 L and imperial gallon is 4.546 L, a difference of about 20%. Always check the gallon type in overseas documents first.' },
      { term: 'Fluid Ounce (fl oz)', desc: 'An ounce for measuring volume, different from the mass unit ounce (oz). 1 fl oz = 29.5735 mL, mainly used for US cooking and beverage volumes.' },
    ],
    formulaTitle: 'Volume Unit Conversion Relationships',
    formulaExample: 'Converting 2 L to US gallons:',
    formulaResult: '2 L ÷ 3.78541 = 0.528 gal',
    tips: {
      title1: 'Volume in Cooking',
      items1: ['Korean cooking uses mL·L, while Western cooking uses cups·tablespoons·teaspoons.', '1 cup ≈ 236.5 mL, 1 tbsp ≈ 15 mL.'],
      title2: 'Everyday Volume Comparisons',
      items2: ['Pet bottle drink: 500 mL, Water bottle: 2 L', 'Bathtub: approx. 150~200 L, Small swimming pool: approx. 50,000~100,000 L'],
      title3: 'Fuel Related',
      items3: ['Vehicle fuel is indicated in L or gal units.', 'The US uses gal, while Europe and Korea primarily use L.'],
      title4: 'Chemistry Experiments',
      items4: ['Measure reagent mixtures precisely in mL·L units.', 'Avoid mid-scale markings considering container scale errors.'],
      title5: 'Gallon Type Caution',
      items5: ['US gal and Imp gal differ by about 20%.', 'Always check the gallon type in overseas documents first.'],
      title6: 'Volume and Mass',
      items6: ['Water is approximately 1 mL = 1 g, but other liquids have different densities.', 'Do not confuse volume and mass when calculating concentration.'],
    },
  },
  dataSizeConverter: {
    title: 'Data Size Converter',
    description: 'Convert data size between Byte, KB, MB, GB, TB, PB units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    unitLabels: {
      Byte: 'Byte',
      KB: 'Kilobyte (KB)',
      MB: 'Megabyte (MB)',
      GB: 'Gigabyte (GB)',
      TB: 'Terabyte (TB)',
      PB: 'Petabyte (PB)',
    },
    calculatorDescription: {
      p1: '<strong>Data Size Converter</strong> is an essential tool that helps convert between various data storage units used in computers. You can check accurate conversion results between Byte, Kilobyte (KB), Megabyte (MB), Gigabyte (GB), Terabyte (TB), and Petabyte (PB) at a glance.',
      p2: 'It allows you to quickly compare and convert multiple units when calculating data throughput, file sizes, storage space, and more, making it useful in web development, data analysis, system management, cloud computing, and various other fields.',
      p3: 'In the digital world, the amount of data is growing exponentially. From 1KB text files to data center storage capacities reaching several PB, accurate unit conversion plays a key role in IT infrastructure planning and cost estimation.',
      note: 'This converter uses Binary standard (1KB = 1,024 Byte) and simultaneously shows conversion results to all units for the entered value. It can be immediately utilized in various situations such as purchasing storage devices, choosing cloud services, and transferring large files.',
    },
    glossary: [
      { term: 'Binary Standard', desc: 'Computers use binary, so 1KB = 1,024 (2^10) Byte. The operating system and most software use this standard.' },
      { term: 'Decimal Standard', desc: 'Storage device manufacturers label 1KB = 1,000 (10^3) Byte. This is why actual usable capacity feels smaller than the displayed capacity.' },
    ],
    formulaTitle: 'Data Size Unit Conversion Formula',
    formulaNote: 'This converter uses Binary (2^10 = 1,024) standard. Some systems or storage device manufacturers may use Decimal (10^3 = 1,000) standard. e.g. 1GB HDD = 1,000,000,000 Byte',
    tips: {
      title1: 'Core Concepts',
      items1: [
        'Binary vs Decimal',
        'Computers use binary so 1KB = 1,024 Byte. However, hard disk manufacturers use 1KB = 1,000 Byte (decimal), which can make actual storage capacity feel smaller than displayed.',
      ],
      title2: 'File Size Reference',
      items2: [
        'Webpage: approx. 2~5MB / HD movie (1080p): approx. 4~8GB / 4K movie: approx. 15~50GB / 1 hour 4K video: approx. 20GB',
      ],
      title3: 'Storage Device Capacity Reference',
      items3: ['USB: 32~256GB', 'SSD: 256GB~4TB', 'HDD: 1~20TB', 'Cloud: TB~PB range'],
      title4: 'Use Cases',
      items4: ['Web Development: Image optimization, resource compression capacity calculation', 'Database: Backup capacity, storage expansion planning', 'Cloud: Storage service plan selection', 'Backup: Required backup storage capacity estimation'],
    },
  },
  speedConverter: {
    title: 'Speed Converter',
    description: 'Convert speed between m/s, km/h, mph, knot, ft/s units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 100',
    unitLabels: {
      'm/s': 'Meter/second (m/s)',
      'km/h': 'Kilometer/hour (km/h)',
      'mph': 'Mile/hour (mph)',
      'knot': 'Knot',
      'ft/s': 'Foot/second (ft/s)',
    },
    calculatorDescription: {
      p1: '<strong>Speed Converter</strong> is a tool that provides accurate conversions between various speed units. You can quickly convert between meter/second (m/s), kilometer/hour (km/h), mile/hour (mph), knot, and foot/second (ft/s), and it is widely used from car, airplane, and wind speed to scientific calculations.',
      p2: 'In physics and engineering, m/s is the standard, while in road traffic km/h is used, and in maritime and aviation, knots are used. This tool easily converts between these units to reduce communication errors.',
      p3: 'For students and researchers, it serves as learning material for kinematics. For drivers, navigators, and weather forecasters, it is a practical tool. It is also very helpful when dealing with overseas vehicle specifications or wind speed data.',
      note: 'Conversion coefficients follow international standards. 1 m/s = 3.6 km/h, and 1 knot is the speed of traveling 1 nautical mile (1.852 km) in 1 hour, i.e., 1.852 km/h. When selecting units, distinguish according to the nature of the measurement target.',
    },
    glossary: [
      { term: 'Knot and Nautical Mile', desc: 'A knot is the speed of traveling 1 nautical mile (1.852 km) in 1 hour (1.852 km/h). It is used in aviation and maritime, and should be distinguished from land km/h.' },
      { term: 'Mile (mph)', desc: 'A speed unit used in English-speaking road systems, where 1 mph = 1.609344 km/h. It is used when comparing US/UK vehicle specifications and wind speed.' },
    ],
    formulaTitle: 'Speed Unit Conversion Relationships',
    formulaExample: 'Converting 100 km/h to m/s:',
    formulaResult: '100 km/h ÷ 3.6 = 27.78 m/s',
    tips: {
      title1: 'Everyday Speed Comparisons',
      items1: ['Walking approx. 5 km/h, Bicycle 15~25 km/h, Highway 100~120 km/h', 'Speed of sound approx. 1,235 km/h (343 m/s)'],
      title2: 'Unit Usage by Application',
      items2: ['km/h: Road traffic in most countries', 'm/s: Scientific calculations and physics, mph: US/UK roads', 'knot: Aviation and maritime traffic'],
      title3: 'Wind Speed Notation',
      items3: ['Weather forecasts mainly use km/h or m/s.', 'Strong wind criteria are wind speed of 17 m/s (approx. 61 km/h) or higher.'],
      title4: 'Vehicle Performance Comparison',
      items4: ['0→100 km/h acceleration time can be compared by converting to m/s².', 'Braking distance calculations are more accurate in m/s units.'],
      title5: 'Aviation and Maritime Use',
      items5: ['Takeoff speed and navigation speed are managed in knot units.', 'Useful for calculating actual speed considering wind speed and counter-currents.'],
      title6: 'Learning Tips',
      items6: ['Understand the difference between speed (scalar without direction) and velocity.', 'Check the dimensions of the formula before unit conversion.'],
    },
  },
  energyConverter: {
    title: 'Energy Converter',
    description: 'Convert energy between J, kJ, cal, kcal, Wh, kWh, BTU units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 100',
    unitLabels: {
      J: 'Joule (J)',
      kJ: 'Kilojoule (kJ)',
      cal: 'Calorie (cal)',
      kcal: 'Kilocalorie (kcal)',
      Wh: 'Watt-hour (Wh)',
      kWh: 'Kilowatt-hour (kWh)',
      BTU: 'BTU',
    },
    calculatorDescription: {
      p1: '<strong>Energy Converter</strong> is a tool that provides accurate conversions between various energy units. You can quickly convert between joule (J), kilojoule (kJ), calorie (cal), kilocalorie (kcal), watt-hour (Wh), kilowatt-hour (kWh), and BTU, and it is used across science, engineering, medicine, and daily life.',
      p2: 'Energy unit conversion is needed in food calorie calculations, home appliance power consumption comparisons, heat capacity design, fuel energy conversions, and more. It is particularly useful for preventing unit confusion when dealing with electricity bills, food nutrition labels, and boiler efficiency.',
      p3: 'For students and researchers, it serves as learning material for thermodynamics. For facility and energy engineers and nutritionists, it is a practical tool. Accurate energy conversion is the first step toward cost savings and efficiency improvement.',
      note: 'Conversion coefficients follow international standards. 1 kcal = 4,184 J, 1 Wh = 3,600 J, 1 kWh = 3.6 MJ, 1 BTU ≈ 1,055 J. Note that the "Calorie" (capital C) on food labels is actually kcal (kilocalorie).',
    },
    glossary: [
      { term: 'Calorie (Calorie vs cal)', desc: 'The capital "Calorie" on food nutrition labels is actually kcal (kilocalorie). Be careful not to confuse it with the lowercase "cal" (4.184 J) in thermodynamics, which differs by 1,000 times.' },
      { term: 'Watt-hour (Wh)', desc: 'The amount of energy used by electrical power (W) for a certain time (h), where 1 Wh = 3,600 J. It is the basic unit for electricity bills and battery capacity calculations.' },
      { term: 'BTU', desc: 'Abbreviation for British Thermal Unit, the heat required to raise 1 pound of water by 1°F (approx. 1,055 J). It is used in air conditioning and heating capacity specifications.' },
    ],
    formulaTitle: 'Energy Unit Conversion Relationships',
    formulaExample: 'Converting 2 kWh to kJ:',
    formulaResult: '2 kWh × 3,600 = 7,200 kJ',
    tips: {
      title1: 'Everyday Energy Comparisons',
      items1: ['Apple approx. 95 kcal, Lunch 600~800 kcal', 'Adult male daily recommended intake 2,000~2,500 kcal'],
      title2: 'Power Consumption Comparison',
      items2: ['LED bulb (10 W, 8 hours) 80 Wh', 'Air conditioner (1 kW, 8 hours) 8 kWh', 'Electric vehicle battery 100 kWh for approx. 400 km driving'],
      title3: 'Fuel Energy Comparison',
      items3: ['Gasoline 1 L approx. 8,900 kcal (approx. 37,000 kJ)', 'Diesel 1 L approx. 8,600 kcal, LPG 1 L approx. 5,900 kcal'],
      title4: 'Calorie Notation Caution',
      items4: ['Food "Calorie" (capital) is kcal.', 'Do not confuse with thermodynamic "cal".'],
      title5: 'Electricity Bill Conversion',
      items5: ['Multiply kWh usage by unit price to calculate bills.', 'Standby power also accumulates in kWh, so unplugging is effective.'],
      title6: 'BTU Usage',
      items6: ['Heating/cooling capacity is displayed in BTU/h.', '1 BTU/h = 0.293 W, so unify units for comparison.'],
    },
  },
  powerConverter: {
    title: 'Power Converter',
    description: 'Convert power between W, kW, MW, hp, BTU/h units.',
    inputLabel: 'Value:',
    inputPlaceholder: 'e.g. 1',
    unitLabels: {
      W: 'Watt (W)',
      kW: 'Kilowatt (kW)',
      MW: 'Megawatt (MW)',
      hp: 'Horsepower (hp)',
      'BTU/h': 'BTU/h',
    },
    calculatorDescription: {
      p1: '<strong>Power Converter</strong> is a tool that provides accurate conversions between various power and output units. You can quickly convert between watt (W), kilowatt (kW), megawatt (MW), horsepower (hp), and BTU/h, and it is used across a wide range of fields including electrical engineering, mechanical engineering, and HVAC.',
      p2: 'Power unit conversion is needed when comparing electrical appliance power consumption, engine output, cooling capacity, and power generation capacity. It is particularly useful when navigating between overseas product specification horsepower (hp) and domestic standard kW, and is essential for equipment selection and energy management.',
      p3: 'For engineers and facility managers, it serves as a design tool. For consumers, it is a tool for comparing home appliance and vehicle specifications. Accurate power conversion is the foundation for appropriate capacity selection and electricity cost savings.',
      note: 'Conversion coefficients follow international standards. 1 kW = 1,000 W, 1 MW = 1,000 kW, 1 hp (mechanical) = 745.7 W, 1 BTU/h = 0.293071 W. Note that there are different types of horsepower (mechanical, electrical, metric), so check the standard.',
    },
    glossary: [
      { term: 'Horsepower (hp) Types', desc: 'Mechanical hp is 745.7 W, electrical hp is 746 W, and metric hp (PS) is 735.5 W, each with different standards. Check the hp type in literature first.' },
      { term: 'BTU/h', desc: 'A cooling/heating capacity unit obtained by dividing BTU by time (h). 1 BTU/h = 0.293071 W, mainly used in air conditioner and boiler specifications.' },
      { term: 'Power Factor', desc: 'The ratio of active power (W) to apparent power (VA) in AC circuits. It should be considered along with efficiency when calculating input power (kW).' },
    ],
    formulaTitle: 'Power Unit Conversion Relationships',
    formulaExample: 'Converting 150 hp to kW:',
    formulaResult: '150 hp × 0.7457 = 111.86 kW',
    tips: {
      title1: 'Everyday Power Comparisons',
      items1: ['LED bulb 10~20 W, Fan 50~100 W', 'Air conditioner 800~2,000 W, Electric vehicle motor 100~500 kW'],
      title2: 'Engine Output Comparison',
      items2: ['Compact car 80~120 hp, Sports car 300~1,000 hp', 'Truck engine 300~600 hp, Jet engine 10,000+ hp'],
      title3: 'Cooling Capacity',
      items3: ['Cooling capacity is mainly displayed in BTU/h.', '3 pyeong room approx. 5,000 BTU/h, 20 pyeong apartment 20,000~30,000 BTU/h'],
      title4: 'Horsepower Type Caution',
      items4: ['Mechanical hp is 745.7 W, electrical hp is 746 W.', 'Check the hp standard in literature first.'],
      title5: 'Equipment Selection',
      items5: ['Add a safety margin to the required output when selecting motors.', 'Consider power factor and efficiency when calculating input power (kW).'],
      title6: 'Power Costs',
      items6: ['kW is instantaneous output, kWh is usage (billing) unit.', 'Distinguish between the two units to understand your bill.'],
    },
  },
  currencyConverter: {
    title: 'Currency Converter',
    description: 'Convert exchange rates between major currencies including USD, EUR, JPY, CNY, KRW, GBP.',
    inputLabel: 'Amount:',
    inputPlaceholder: 'e.g. 1000',
    currencyNames: {
      USD: 'US Dollar (USD)',
      EUR: 'Euro (EUR)',
      JPY: 'Japanese Yen (JPY)',
      CNY: 'Chinese Yuan (CNY)',
      KRW: 'Korean Won (KRW)',
      GBP: 'British Pound (GBP)',
    },
    calculatorDescription: {
      p1: '<strong>Currency Converter</strong> is a practical financial tool that quickly converts exchange rates between major world currencies. Whether traveling, shopping abroad, sending international remittances, or investing, it is conveniently available anytime, anywhere when you need to convert foreign currency values.',
      p2: 'This tool supports 6 major currencies: US Dollar (USD), Euro (EUR), Japanese Yen (JPY), Chinese Yuan (CNY), Korean Won (KRW), and British Pound (GBP). Select a base currency and instantly see conversion results for all other currencies. Financial markets change moment by moment, so approximate reference exchange rates are provided to aid quick estimation.',
      p3: 'Exchange rates directly affect import/export costs, traveler budgets, and global investor returns. Individuals routinely use exchange rate information to reduce fees on overseas transactions, while companies use it to manage the value of foreign currency assets and liabilities.',
      note: 'Exchange rates change daily, and the base exchange rate and fees applied vary between banks and exchange offices. This calculator is for learning and approximate reference only. For actual transactions, please check the real-time exchange rate of the transaction institution.',
    },
    glossary: [
      { term: 'Exchange Rate', desc: 'The rate at which one currency is exchanged for another, changing daily based on interest rates, trade balances, inflation, etc. This tool uses approximate values based on 1 USD for quick estimation.' },
      { term: 'Base Exchange Rate', desc: 'The official exchange rate used by banks as a reference for currency exchange. Exchange fees are added to this rate to determine the actual applied exchange rate (sell/buy rate).' },
      { term: 'Sell Rate and Buy Rate', desc: 'The rate at which customers buy (sell rate) and sell (buy rate) currency differ. When converting both ways, a slight error occurs due to this difference, so check each rate for actual transactions.' },
    ],
    formulaTitle: 'Currency Conversion Formula',
    formulaExample: 'Converting 100 USD to Korean Won:',
    formulaResult: '100 USD × (1,380 KRW / 1 USD) = 138,000 KRW',
    tips: {
      title1: 'Understanding Exchange Fees',
      items1: ['Banks and exchange offices apply exchange rates that include fees on top of the base rate.', 'Internet banking and mobile app exchanges are generally more favorable than branch visits.', 'Airport exchange offices tend to have higher fees, so it is best to avoid them if possible.'],
      title2: 'Travel Exchange Tips',
      items2: ['Exchanging before departure can get you more favorable rates than urgent situations.', 'Credit card overseas transactions incur 1~3% fees, so use a mix of cash and card.', 'Keep remaining foreign currency for re-exchange after returning or for your next trip.'],
      title3: 'Factors Affecting Exchange Rates',
      items3: ['Central bank interest rate decisions have the biggest impact on exchange rates.', 'Import/export trade balances and capital flows determine currency value.', 'Differences in inflation rates between two countries are also reflected in exchange rates.'],
      title4: 'Reverse Exchange Rate Caution',
      items4: ['Converting the same two currencies both ways creates slight errors due to fee differences.', 'For accurate transactions, check the sell rate and buy rate of each transaction institution separately.'],
      title5: 'Large Remittance Precautions',
      items5: ['Additional fees may apply if multiple intermediary banks are involved.', 'It is advisable to prepare documents proving the purpose and source of remittance in advance.'],
      title6: 'Investment and Exchange Rates',
      items6: ['Foreign currency assets see won-denominated returns grow or shrink based on exchange rate fluctuations.', 'When investing in overseas stocks or funds, carefully compare whether currency hedging products are available.'],
    },
  },
  timezoneConverter: {
    title: 'Timezone Converter',
    description: 'Convert time between major world timezones including UTC, US, Europe, and Asia.',
    inputLabel: 'Date/Time:',
    baseTimezoneLabel: 'Base Timezone:',
    timezoneNames: {
      UTC: 'UTC',
      'US-Eastern': 'US Eastern (EST/EDT)',
      'US-Pacific': 'US Pacific (PST/PDT)',
      'Europe-London': 'Europe London (GMT/BST)',
      'Asia-Tokyo': 'Asia Tokyo (JST)',
      'Asia-Seoul': 'Asia Seoul (KST)',
      'Asia-Shanghai': 'Asia Shanghai (CST)',
    },
    calculatorDescription: {
      p1: '<strong>Timezone Converter</strong> is an essential tool that provides time conversions between major timezones around the world. It supports UTC, US Eastern/Pacific, Europe London, and Asia Tokyo/Seoul/Shanghai timezones. Enter a date and time to instantly see conversion results for other timezones.',
      p2: 'It is useful when time zone conversion is needed for international business meetings, overseas travel, remote work, online gaming, and more. It is an indispensable tool for coordinating meeting times with team members scattered across multiple countries.',
      p3: 'This converter performs accurate conversions based on the UTC offset of each timezone. After selecting a timezone, enter a date and time to see the corresponding time in all selected timezones simultaneously, allowing you to quickly identify which timezone is appropriate.',
      note: 'This tool is based on standard timezone offsets. Daylight Saving Time (DST) is not automatically applied and must be manually adjusted if needed.',
    },
    glossary: [
      { term: 'UTC', desc: 'Coordinated Universal Time, the international standard time based on longitude 0 degrees (near London). Each timezone is expressed as an offset from UTC (e.g., KST = UTC+9).' },
      { term: 'Daylight Saving Time (DST)', desc: 'A system that advances clocks by 1 hour during summer, typically applied from March to November in the US and Europe. Korea and Japan do not implement DST, and this converter does not automatically apply it.' },
      { term: 'UTC Offset', desc: 'A value indicating how many hours ahead or behind a specific timezone is compared to UTC. Time is converted by adding or subtracting the offset difference.' },
    ],
    formulaTitle: 'Timezone Conversion Formula',
    formulaExample: 'Converting UTC 10:00 to other timezones:',
    formulaResult: 'Seoul (UTC+9): 19:00, New York (UTC-5): 05:00, London (UTC+0): 10:00',
    tips: {
      title1: 'Core Concepts',
      items1: ['Daylight Saving Time (DST): Many countries advance clocks by 1 hour during summer (US/Europe: March~November). Korea and Japan do not observe DST.', 'International meeting times are usually set based on UTC.'],
      title2: 'Application Cases',
      items2: ['International Business: Coordinating meeting times across multiple timezones', 'Travel: Checking time differences between departure and destination in advance', 'Finance: Checking trading hours for New York, London, Tokyo stock exchanges', 'Online Gaming: Confirming global server event times'],
    },
  },
  discountCalculator: {
    title: 'Discount Calculator',
    description: 'Quickly calculate discount amounts and final prices, or reverse-calculate the discount rate from the payment amount.',
    inputs: {
      calculationMode: 'Calculation Mode',
      calculateDiscount: 'Calculate Discount',
      reverseDiscountRate: 'Reverse Discount Rate',
      originalPrice: 'Original Price (KRW)',
      discountRate: 'Discount Rate (%)',
      salePrice: 'Sale Price (KRW)',
      calculate: 'Calculate',
      reset: 'Reset',
    },
    placeholders: {
      originalPrice: 'e.g. 50000',
      discountRate: 'e.g. 20',
      salePrice: 'e.g. 40000',
    },
    alerts: {
      invalidForward: 'Please enter the original price and discount rate correctly.',
      invalidReverse: 'Please enter the original price and sale price correctly.',
      saleTooHigh: 'The sale price must be less than or equal to the original price.',
    },
    results: {
      discountAmount: 'Discount Amount',
      salePrice: 'Sale Price',
      discountRate: 'Discount Rate',
      discountSuffix: 'discount',
    },
    descriptionContent: {
      heading: 'Calculate discount amounts and final prices quickly!',
      p1: 'When shopping or during promotions, it\'s often difficult to know the actual savings and final payment amount from a discount rate. Especially during sales or with complex discount conditions, predicting exact expenses can be challenging.',
      p2: 'This calculator supports two modes: "Calculate Discount" mode shows savings and final payment from original price and discount rate, while "Reverse Discount Rate" mode calculates what percentage discount you received from the original price and actual payment.',
      p3: 'A useful tool for business owners, shopping mall operators, marketers, and everyday consumers alike.',
    },
    glossary: [
      { term: 'Discount Rate (%)', desc: 'A percentage representing how much of the original price is discounted. Discount amount is calculated by multiplying the original price by (discount rate ÷ 100).' },
      { term: 'VAT', desc: 'An indirect tax applied at each stage of goods or services transactions. The actual payment may vary depending on whether the displayed price includes VAT.' },
    ],
    formula: {
      heading: 'Discount Calculation Formulas',
      step1Title: '1. Discount Amount & Final Price Calculation',
      step1Desc: 'Subtract the discount amount from the original price to get the final price.',
      step1Formula1: 'Discount Amount = Original Price × (Discount Rate ÷ 100)',
      step1Formula2: 'Final Price = Original Price - Discount Amount',
      step1Example: 'Example: 50,000 KRW item at 20% discount → Discount = 50,000 × 0.2 = 10,000 KRW → Final = 40,000 KRW',
      step2Title: '2. Reverse Discount Rate Formula',
      step2Desc: 'Divide the difference between the actual payment and original price by the original price to get the discount percentage.',
      step2Formula: 'Discount Rate(%) = (Original Price - Payment Amount) ÷ Original Price × 100',
      step2Example: 'Example: 50,000 KRW item purchased for 40,000 KRW → (50,000 - 40,000) ÷ 50,000 × 100 = 20% discount',
    },
    tips: {
      heading: '💡 Key Discount Calculation Tips',
      items: [
        { title: '1. Stacking discounts is not simple addition', desc: '"30% off then 20% additional discount" gives a 44% total discount effect (1 - 0.7 × 0.8 = 0.44). Simply adding to 50% overestimates the actual discount.' },
        { title: '2. Application order affects the final price', desc: 'When card discounts, coupons, and points accumulate, the final amount can vary by application order. Compare the most advantageous order in advance.' },
        { title: '3. Check for price increases before discounts', desc: 'Be aware of "fake discounts" where prices are raised before being discounted. Knowing regular prices helps you get real savings.' },
        { title: '4. Use reverse mode to compare coupon efficiency', desc: 'Use the reverse mode to determine which coupon among multiple options provides the most discount.' },
        { title: '5. Check total savings for bulk purchases', desc: 'Multiply the per-item discount by quantity to know total savings for budget management.' },
        { title: '6. Calculate based on VAT-inclusive prices', desc: 'Whether VAT is included can affect the final amount. Always verify if the displayed price includes VAT.' },
        { title: '7. Check refund amounts in advance', desc: 'Calculating the refund amount for discounted items helps prevent unexpected losses.' },
      ],
    },
  },
  countdownTimer: {
    title: 'Countdown Timer',
    description: 'Set a time and start a countdown.',
    inputs: {
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      start: 'Start',
      resume: 'Resume',
      pause: 'Pause',
      reset: 'Reset',
    },
    results: {
      timeUp: 'Time is up!',
      setDuration: 'Set Duration',
      timeRemaining: 'Time Remaining',
      elapsed: 'elapsed',
    },
    descriptionContent: {
      heading: 'Set a time and manage it efficiently with a countdown!',
      p1: 'A countdown timer is a practical tool that counts down a set amount of time and visually shows the progress. It\'s useful for exercise, studying, cooking, presentations, and more.',
      p2: 'You can freely set time in hours, minutes, and seconds, and the progress bar shows status intuitively. When less than 10 seconds remain, the color changes for a tense finish.',
      p3: 'Useful for Pomodoro technique, interval training, cooking timing, presentation time management, and any situation where time matters.',
    },
    glossary: [
      { term: 'D-day', desc: 'A countdown concept that counts the remaining days until an important target date, using that date as the reference point (day 0).' },
    ],
    formula: {
      heading: 'Timer Operation',
      principle: 'Decreases remaining time by 1 every second using setInterval. When it reaches 0, the timer stops and an alarm sounds.',
      alarm: 'Alarm Sound Generation',
      alarmDesc: 'Uses Web Audio API Oscillator to generate alarm sounds by adjusting frequency and duration, without needing audio files.',
      progress: 'Progress Calculation',
      progressFormula: 'Progress(%) = (Set Duration - Remaining Time) / Set Duration × 100',
    },
    tips: {
      heading: 'Timer Usage Tips',
      items: [
        { title: 'Pomodoro Technique', desc: '25 minutes of focus followed by 5 minutes of rest, with a longer 15-30 minute break after 4 sets.' },
        { title: 'Interval Training', desc: 'Precise time management for plank, burpees, squats, and other time-based exercises.' },
        { title: 'Cooking Timing', desc: 'Convenient for accurately timing pasta boiling, oven cooking, and more.' },
        { title: 'Presentation Time Management', desc: 'Setting a timer helps maintain a systematic flow during presentations.' },
        { title: 'Quiz/Games', desc: 'Creates tense time limits for quiz shows, puzzle games, and more.' },
        { title: 'Meditation/Yoga', desc: 'Helps accurately time and maintain consistent meditation practice.' },
      ],
    },
  },
  coinFlip: {
    title: 'Coin Flip',
    description: 'Randomly determines heads or tails.',
    inputs: {
      flipping: 'Flipping...',
      flipCoin: 'Flip Coin',
      reset: 'Reset',
    },
    results: {
      flipping: 'Flipping...',
      heads: 'Heads (H)',
      tails: 'Tails (T)',
      clickToFlip: 'Click the coin to flip',
      headsCount: 'Heads',
      totalFlips: 'Total Flips',
      tailsCount: 'Tails',
      flips: 'flips',
      recentHistory: 'Recent History (newest first):',
      headsTailsRatio: 'Heads/Tails Ratio:',
      headsPercent: 'Heads',
      tailsPercent: 'Tails',
    },
    descriptionContent: {
      heading: 'Make fair decisions with virtual coin flipping!',
      p1: 'Coin flipping is the simplest yet fairest decision-making tool, with each result having a 50% probability. Designed so heads and tails appear with equal probability through computer algorithms.',
      p2: 'Recording multiple flip results and analyzing statistics helps intuitively understand basic probability and statistics concepts, making it useful for educational purposes.',
      p3: 'A versatile decision-making tool for game order, simple decisions, probability learning, educational simulations, and more.',
    },
    formula: {
      heading: 'Law of Probability (Law of Large Numbers)',
      desc: 'Coin flipping is the most basic example of a discrete probability distribution.',
      formula: 'P(Heads) = P(Tails) = 0.5 (50%)',
      lawOfLargeNumbers: 'According to the law of large numbers, as the number of flips increases, the ratio of heads to tails approaches 50:50. For example, flipping 1000 times tends to yield heads between approximately 480-520 times.',
      randomGeneration: 'Random Generation Method',
      randomDesc: 'Uses JavaScript\'s Math.random() function to generate a uniform distribution random number between 0 and 1. If less than 0.5, it\'s heads; if 0.5 or more, it\'s tails.',
    },
    tips: {
      heading: 'Coin Flip Usage Tips',
      items: [
        { title: 'Fair Decision Making', desc: 'Use when you need to decide fairly between two options.' },
        { title: 'Order Selection', desc: 'Convenient for determining the starting order of games or activities.' },
        { title: 'Probability Learning', desc: 'Can be used as an experiential learning tool to teach basic probability concepts to children.' },
        { title: 'Multiple Flips', desc: 'A single flip may be unfair. Consider using majority voting with 3 or 5 flips for a fairer result.' },
        { title: 'Record Keeping', desc: 'Recording flip results lets you experience the law of large numbers firsthand.' },
      ],
    },
  },
  virtualDice: {
    title: 'Virtual Dice',
    description: 'Roll dice randomly. Supports 1-4 dice.',
    inputs: {
      diceCount: 'Number of Dice:',
      rolling: 'Rolling...',
      rollDice: 'Roll Dice',
      reset: 'Reset',
    },
    results: {
      sum: 'Sum',
      totalRolls: 'Total Rolls',
      cumulativeSum: 'Cumulative Sum',
      recentHistory: 'Recent History (newest first):',
      average: 'Average',
      theoreticalAverage: 'Theoretical Average',
      perDice: 'per die',
    },
    descriptionContent: {
      heading: 'Generate random numbers instantly with virtual dice!',
      p1: 'Virtual dice let you generate random numbers from 1 to 6 without physical dice. You can roll 1 to 4 dice simultaneously for various games and activities.',
      p2: 'Useful for dice baseball, board games, TRPGs (Tabletop Role-Playing Games), educational probability simulations, and more.',
      p3: 'Each roll displays results with animation for a realistic dice-rolling experience, and the last 10 rolls are recorded for probability analysis.',
    },
    formula: {
      heading: 'Dice Probability',
      formula: 'P(each face) = 1/6 ≈ 16.67%',
      desc: 'On a fair 6-sided die, each face has equal probability. The sum when rolling n dice follows a sum of discrete uniform distributions.',
      expectedValue: 'Expected Value',
      expectedFormula: 'E(Sum) = n × 3.5',
      expectedDesc: 'Where n is the number of dice. If you roll 1 die 100 times, the sum converges to approximately 350.',
    },
    tips: {
      heading: 'Dice Usage Tips',
      items: [
        { title: 'Board Games', desc: 'Enjoy board games without physical dice.' },
        { title: 'TRPG', desc: 'Use as a substitute for dice rolls in D&D and other tabletop RPGs.' },
        { title: 'Educational Simulations', desc: 'Intuitively explain probability and statistics concepts to students.' },
        { title: 'Meeting Order', desc: 'Determine order fairly and funly when there are multiple people.' },
        { title: 'Multiple Dice', desc: 'Using 2 or more dice makes the sum distribution closer to normal, concentrating results around the average (3.5×n).' },
      ],
    },
  },
  passwordGenerator: {
    title: 'Password Generator',
    description: 'Generate a strong random password.',
    inputs: {
      length: 'Length',
      uppercase: 'Uppercase (A-Z)',
      lowercase: 'Lowercase (a-z)',
      numbers: 'Numbers (0-9)',
      symbols: 'Symbols (!@#$%)',
      generate: 'Generate Password',
      reset: 'Reset',
    },
    results: {
      copied: 'Copied!',
      copy: 'Copy',
      strength: 'Password Strength',
      charCount: 'Characters',
      selectedTypes: 'Selected character types',
      emptyMessage: 'Click the generate password button',
      selectCharset: 'Please select a character set',
    },
    strengthLevels: {
      weak: 'Weak',
      medium: 'Medium',
      strong: 'Strong',
      veryStrong: 'Very Strong',
    },
    descriptionContent: {
      heading: 'Generate strong, secure random passwords instantly!',
      p1: 'A password generator is an essential security tool that creates passwords safe from hacking or brute-force attacks through combinations of uppercase, lowercase, numbers, and special characters.',
      p2: 'Uses the browser\'s Web Crypto API to generate cryptographically secure random values, providing high-quality passwords that are impossible to predict.',
      p3: 'Useful for all users managing multiple online accounts to strengthen security with different strong passwords each time.',
    },
    formula: {
      heading: 'Random Password Generation Principle',
      desc: 'Randomly selects characters from the user-chosen character set for the specified length.',
      code: 'crypto.getRandomValues(new Uint32Array(length))',
      cryptoDesc: 'Uses Web Crypto API\'s crypto.getRandomValues() for cryptographically secure random numbers, much more secure than Math.random().',
      strengthCalc: 'Password Strength Calculation',
      strengthDesc: 'Comprehensively analyzes password length, number of character types (uppercase, lowercase, numbers, symbols), and combination diversity to determine strength in 4 levels.',
    },
    tips: {
      heading: 'Password Security Tips',
      items: [
        { title: 'Use at least 12 characters', desc: 'Passwords of 8 characters or less are vulnerable to brute-force attacks.' },
        { title: 'Combine all character types', desc: 'The more character types, the exponentially longer brute-force attack time becomes.' },
        { title: 'Don\'t include personal information', desc: 'Never include publicly available information like birthdays, names, or phone numbers.' },
        { title: 'Use different passwords for each site', desc: 'Even if one is leaked, it prevents cascading damage to other accounts.' },
        { title: 'Use a password manager', desc: 'Password managers that securely manage and auto-fill multiple passwords are the safest option.' },
        { title: 'Enable two-factor authentication (2FA)', desc: 'Setting up additional authentication beyond passwords greatly strengthens security.' },
        { title: 'Change regularly', desc: 'It\'s recommended to change passwords for important accounts every 3-6 months.' },
      ],
    },
  },
  colorPicker: {
    title: 'Color Picker',
    description: 'Check color codes and convert between various formats.',
    inputs: {
      hex: 'HEX',
      randomColor: 'Random Color',
      reset: 'Reset',
    },
    results: {
      hex: 'HEX',
      rgb: 'RGB',
      hsl: 'HSL',
      copied: 'Copied!',
      copy: 'Copy',
      invalidHex: 'Please enter a valid HEX color code',
    },
    descriptionContent: {
      heading: 'Freely convert and preview HEX, RGB, HSL color codes!',
      p1: 'A color picker is an essential tool for web development, graphic design, UI/UX design, and more, allowing accurate color selection and conversion to various formats.',
      p2: 'Converts between three major color formats - HEX(#RRGGBB), RGB(Red, Green, Blue), HSL(Hue, Saturation, Lightness) - in real-time with instant preview.',
      p3: 'Useful when setting brand colors in website design, managing consistent color palettes during design work, or exploring colors when you don\'t know the color code.',
    },
    formula: {
      heading: 'Color Code Conversion Formulas',
      hexToRgb: 'HEX to RGB Conversion',
      hexToRgbDesc: 'Converts 2-digit hexadecimal to decimal.',
      rgbToHsl: 'RGB to HSL Conversion',
      rgbToHslDesc: 'Calculates Hue(H), Saturation(S), and Lightness(L) based on RGB values.',
    },
    tips: {
      heading: 'Color Code Tips',
      items: [
        { title: 'HEX Code', desc: 'The most commonly used format in web development (#RRGGBB), directly usable in CSS.' },
        { title: 'RGB', desc: 'Suitable for screen display. Use RGBA when adding transparency.' },
        { title: 'HSL', desc: 'Intuitive for color adjustments, easily changing brightness and saturation for design work.' },
        { title: 'Accessibility (WCAG)', desc: 'Maintaining a contrast ratio of 4.5:1 or higher between text and background colors makes websites readable for visually impaired users.' },
        { title: 'CSS Variables', desc: 'Managing project-wide colors with CSS variables makes maintenance easier.' },
        { title: 'Palette Generation', desc: 'Combining analogous and complementary colors based on a main color creates harmonious color schemes.' },
        { title: 'Dark Mode Consideration', desc: 'Choose colors that are visible in both light and dark modes.' },
      ],
    },
  },
  bmiCalculator: {
    inputs: {
      height: 'Height (cm)',
      weight: 'Weight (kg)',
    },
    placeholders: {
      height: 'e.g. 175',
      weight: 'e.g. 70',
    },
    calculate: 'Calculate',
    reset: 'Reset',
    results: {
      bmi: 'Body Mass Index (BMI)',
      status: 'Status',
      standardTable: 'BMI Standard Table',
    },
    status: {
      underweight: 'Underweight',
      normal: 'Normal',
      overweight: 'Overweight',
      obese: 'Obese',
      severelyObese: 'Severely Obese',
    },
    standardTableRows: {
      underweight: 'Underweight: below 18.5',
      normal: 'Normal: 18.5 ~ 24.9',
      overweight: 'Overweight: 25 ~ 29.9',
      obese: 'Obese: 30 ~ 34.9',
      severelyObese: 'Severely Obese: 35 or above',
    },
    error: 'Please enter your height and weight correctly.',
  },
  bmrCalculator: {
    inputs: {
      gender: 'Gender',
      age: 'Age (years)',
      height: 'Height (cm)',
      weight: 'Weight (kg)',
    },
    genderOptions: {
      male: 'Male',
      female: 'Female',
    },
    placeholders: {
      age: 'e.g. 30',
      height: 'e.g. 175',
      weight: 'e.g. 70',
    },
    calculate: 'Calculate',
    reset: 'Reset',
    results: {
      bmr: 'Basal Metabolic Rate (BMR)',
      tdeeTitle: 'Total Daily Energy Expenditure (TDEE) by Activity Level',
    },
    activityLevels: {
      sedentary: 'Sedentary (no exercise)',
      light: 'Light activity (1-3 days/week)',
      moderate: 'Moderate activity (3-5 days/week)',
      active: 'Active activity (6-7 days/week)',
      veryActive: 'Very active (2+ times/day)',
    },
    error: 'Please enter all values correctly.',
  },
  weightLoss: {
    inputs: {
      currentWeight: 'Current Weight (kg)',
      targetWeight: 'Target Weight (kg)',
      height: 'Height (cm)',
      age: 'Age',
      gender: 'Gender',
      activityLevel: 'Activity Level',
    },
    genderOptions: {
      male: 'Male',
      female: 'Female',
    },
    activityOptions: {
      sedentary: 'Sedentary (no exercise)',
      light: 'Light activity (1-3 days/week)',
      moderate: 'Moderate activity (3-5 days/week)',
      active: 'Active activity (6-7 days/week)',
      veryActive: 'Very active (2+ times/day)',
    },
    placeholders: {
      currentWeight: 'e.g. 70',
      targetWeight: 'e.g. 65',
      height: 'e.g. 175',
      age: 'e.g. 30',
    },
    calculate: 'Calculate',
    reset: 'Reset',
    results: {
      dailyCalories: 'Recommended Daily Calories for Weight Loss',
      timeToGoal: 'Estimated Time to Reach Target Weight',
      targetDate: 'Estimated Goal Achievement Date',
    },
    error: 'Please enter all values correctly.',
  },
  koreanAge: {
    inputs: {
      calculationMethod: 'Calculation Method',
      birthDate: 'Birth Date',
      currentYear: 'Current Year',
      birthYear: 'Birth Year',
      birthdayPassed: 'Birthday Passed',
      currentAge: 'Current Age',
    },
    calculationMethods: {
      birthDate: 'Calculate by Birth Date',
      birthYear: 'Calculate by Birth Year',
      currentAge: 'Calculate by Current Age',
    },
    birthdayOptions: {
      yes: 'Yes',
      no: 'No',
    },
    placeholders: {
      calculationMethod: 'Select calculation method',
      birthday: 'Has your birthday passed this year?',
      currentAge: 'Age in years',
    },
    calculate: 'Calculate',
    results: {
      koreanAge: 'Korean Age',
      koreanAgeDesc: '(1 year old at birth, +1 year every January 1st)',
      internationalAge: 'International Age',
      internationalAgeDesc: '(Based on birthday, international standard)',
      yearAge: 'Year Age',
      yearAgeDesc: '(Difference in years only)',
      zodiac: 'Zodiac',
      zodiacDesc: '(12 Chinese Zodiac)',
      daysLived: 'Days Lived',
      nextBirthday: 'Next Birthday',
      daysUntilNext: 'days remaining',
      adultStatus: 'Adult Status',
      adult: 'Adult',
      minor: 'Minor',
      canVote: 'Can Vote',
      canDrink: 'Can Drink',
      possible: 'Possible',
      impossible: 'Impossible',
    },
    calculateHint: 'Press Calculate to see the result',
  },
  dateDifference: {
    inputs: {
      startDate: 'Start Date',
      endDate: 'End Date',
      includeStartDate: 'Include Start Date',
    },
    placeholders: {
      startDate: 'Select start date',
      endDate: 'Select end date',
    },
    calculate: 'Calculate',
    reset: 'Reset',
    results: {
      title: 'Date Difference Calculation Result',
      period: 'Total Period',
      totalDays: 'Total Days',
    },
  },
  anniversary: {
    tabs: {
      wedding: 'Wedding Anniversary',
      relationship: 'Date Started Dating',
      other: 'Other',
    },
    inputs: {
      date: 'Date',
      todayDate: "Today's Date",
    },
    calculate: 'Calculate',
    reset: 'Reset',
    results: {
      nextAnniversary: 'Next Anniversary',
      daysUntilNext: 'Days Until Next Anniversary',
      timeSpent: 'Time Spent Together',
      years: 'Years',
      months: 'Months',
      days: 'Days',
      totalYears: 'Total Years',
      totalMonths: 'Total Months',
      totalWeeks: 'Total Weeks',
      totalDays: 'Total Days',
    },
  },
  typingSpeed: {
    title: 'Typing Speed Test',
    description: 'Measure your typing speed and accuracy.',
    startButton: 'Start Test',
    startPrompt: 'Click the Start Test button to begin.',
    testInProgress: 'In progress...',
    typingPrompt: 'Type the text here...',
    testComplete: 'Test complete!',
    charInput: '{current} / {total} chars typed',
    retake: 'Retake',
    wpmLabel: 'Typing Speed (WPM)',
    wpmUnit: 'Words Per Minute',
    accuracyLabel: 'Accuracy',
    accuracyUnit: 'Character accuracy',
    elapsedTime: 'Elapsed Time',
    totalChars: 'Total Chars',
    correctChars: 'Correct Chars',
    speedRating: 'Speed Rating:',
    veryFast: 'Very fast! Professional level.',
    fast: 'Pretty fast. Good skills.',
    average: 'Average. Keep practicing to improve.',
    slow: 'Needs practice. Keep practicing to improve.',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          Measure your typing speed and accuracy for an objective assessment!
        </p>
        <p>
          The typing speed test measures words per minute (WPM) and accuracy in real time.
          Read randomly provided Korean sentences and type them to objectively evaluate and improve your typing skills.
        </p>
        <p>
          When typing begins, the timer starts from the first character input, calculating elapsed time, correct character count, and WPM.
          Each character is displayed in green for correct input and red for incorrect, providing immediate feedback.
        </p>
        <p>
          Office workers, programmers, writers, students, and anyone for whom typing skills matter
          can use this tool to objectively measure and consistently improve their typing ability.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Glossary</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">WPM (Words Per Minute)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A typing speed unit representing the number of words typed per minute. Usually calculated assuming 1 word = 5 characters.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">CPM (Characters Per Minute)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The number of characters typed per minute, roughly equal to WPM multiplied by 5.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">WPM (Words Per Minute) Calculation</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">WPM = (number of words typed) / (elapsed time in minutes)</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Typically, 1 word is assumed to be 5 characters, so the total number of characters typed is divided by 5 to calculate word count.
            For example, if you type 200 characters in 60 seconds, WPM = (200/5) / 1 = 40 WPM.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Accuracy Calculation</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">Accuracy(%) = (number of correct characters / total characters) × 100</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Compares the original text and user input character by character to calculate the ratio of matching characters.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Speed Grade Criteria</h3>
          <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
            <li><strong>60+ WPM:</strong> Very fast (Professional level)</li>
            <li><strong>40~59 WPM:</strong> Fast (Excellent skills)</li>
            <li><strong>20~39 WPM:</strong> Average (Normal level)</li>
            <li><strong>Under 20 WPM:</strong> Beginner (Needs practice)</li>
          </ul>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">Key Tips for Improving Typing Skills</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Accuracy first:</strong> Focus on accurate typing rather than speed initially. As accuracy improves, speed will naturally increase.</li>
            <li><strong>Home key position:</strong> Place your left hand on 'F' and right hand on 'J' to maintain proper finger positioning and basic posture.</li>
            <li><strong>Proper posture:</strong> Straighten your back and shoulders, bend elbows to 90 degrees, and be careful not to let wrists touch the desk.</li>
            <li><strong>Eyes on screen:</strong> Practice touch typing without looking at the keyboard while looking at the screen to significantly improve speed.</li>
            <li><strong>Consistent practice:</strong> Practicing 10-15 minutes daily will show noticeable improvement within a month.</li>
            <li><strong>Target frequently missed characters:</strong> Recording wrong characters and building muscle memory for specific characters is effective.</li>
          </ul>
        </div>
      </div>
    `,
  },
  textDifference: {
    title: 'Text Difference',
    description: 'Compare two texts for differences.',
    originalLabel: 'Original text:',
    modifiedLabel: 'Modified text:',
    originalPlaceholder: 'Enter original text to compare...',
    modifiedPlaceholder: 'Enter target text to compare...',
    compareButton: 'Compare',
    resetButton: 'Reset',
    added: 'Added',
    removed: 'Removed',
    equal: 'Equal',
    lines: 'lines',
    diffResultTitle: 'Comparison results:',
    emptyLine: '(empty line)',
    originalCharCount: 'Original: {count} chars',
    modifiedCharCount: 'Modified: {count} chars',
    emptyPrompt: 'Enter text and click Compare button',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          Compare differences between two texts line by line and highlight them!
        </p>
        <p>
          The text comparison tool accurately compares differences between two texts line by line,
          intuitively showing additions, deletions, and changes with colors.
        </p>
        <p>
          It is useful for quickly checking source code changes during code reviews, reviewing document modifications in contracts and proposals,
          and finding translation errors by comparing originals with translations.
        </p>
        <p>
          Statistics for added lines, deleted lines, and identical lines are provided together,
          making it useful for developers, translators, document managers, students, and anyone who needs text comparison.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Glossary</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">diff (Difference Comparison)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The process of finding and showing additions, deletions, and changes between two texts.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Line-by-line Comparison</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A comparison method that divides text into lines and judges whether each line is identical, added, or deleted.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">LCS (Longest Common Subsequence)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">An algorithm that finds the longest common subsequence while maintaining order in two strings, used for precise difference comparison.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Text Comparison Algorithm</h3>
          <p className="mb-2 text-muted-foreground">
            Each line is compared sequentially to determine if they are identical. When the number of lines differs,
            the longer text is used as the reference to detect missing parts.
          </p>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <code className="text-sm">for (let i = 0; i &lt; maxLines; i++) {'{'}</code><br/>
            <code className="text-sm">&nbsp;&nbsp;if (line1 === line2) → Identical (no change)</code><br/>
            <code className="text-sm">&nbsp;&nbsp;else → Change detected (addition or deletion)</code><br/>
            <code className="text-sm">{'}'}</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Results are categorized as added (green), deleted (red with strikethrough), and identical (no change),
            and you can see the count of added/deleted/identical lines at a glance in the statistics cards.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">Text Comparison Usage Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Code review:</strong> Useful for quickly checking source code change history in Git commits or Pull Requests.</li>
            <li><strong>Document comparison:</strong> Systematically manage document modifications in contracts, proposals, and papers across versions.</li>
            <li><strong>Translation review:</strong> Quickly discover unintentional translation omissions or errors by comparing originals with translations side by side.</li>
            <li><strong>History management:</strong> Understand text differences across versions at a glance for systematic change management.</li>
            <li><strong>Email/Official document review:</strong> Compare emails or official documents before and after edits to quickly verify changes.</li>
          </ul>
        </div>
      </div>
    `,
  },
  qrGenerator: {
    title: 'QR Code Generator',
    description: 'Convert text or URL to a QR code.',
    inputLabel: 'Enter text or URL:',
    inputPlaceholder: 'https://example.com or enter text',
    generateButton: 'Generate QR Code',
    resetButton: 'Reset',
    downloadButton: 'Download as PNG',
    textLength: 'Input text length: {count} chars',
    emptyPrompt: 'Enter text to display QR code',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          Convert text and URLs to QR codes for quick sharing!
        </p>
        <p>
          The QR code generator converts text, URLs, and contact information into QR codes that can be instantly scanned
          with a smartphone camera. Website links, Wi-Fi passwords, messages, and more can be stored in a single image.
        </p>
        <p>
          Generated QR codes can be downloaded as PNG files and used on business cards, posters, menus, and flyers.
          It can be used instantly in a web browser without separate login or installation, making it useful for both individuals and businesses.
        </p>
        <p>
          For business owners, marketers, teachers, event planners, and anyone who frequently uses QR codes,
          this service provides convenient and fast QR code generation.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Glossary</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">QR Code (Quick Response Code)</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A 2D barcode that stores information in black-and-white grid modules, allowing quick scanning with smartphone cameras to read text and URLs.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Error Correction Level</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The rate of redundant information added to recover data even if the QR code is damaged or contaminated. Higher levels are more resistant to damage but increase code size.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">QR Code Structure and Operation</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Finder Pattern:</strong> Large square patterns on 3 corners that help scanners recognize the QR code's position and orientation.</li>
            <li><strong>Timing Pattern:</strong> Dotted lines between finder patterns that serve as reference lines for determining module size.</li>
            <li><strong>Data Modules:</strong> The area where actual data is encoded, containing text or URL information.</li>
            <li><strong>Error Correction:</strong> Contains redundant data that can recover the code even if partially damaged, ensuring stability.</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Generation Process</h3>
          <p className="text-muted-foreground">
            The entered text is converted to data, the encoded data is placed in the module matrix,
            then finder patterns and timing patterns are added to render the final QR code image.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">QR Code Usage Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>URL sharing:</strong> Create a QR code from a website link and print it on business cards or posters for instant access.</li>
            <li><strong>Wi-Fi connection:</strong> Create a QR code with Wi-Fi network information to share with guests for password-free connection.</li>
            <li><strong>Menus/Catalogs:</strong> Link restaurant menus or product catalogs with QR codes to save paper and enable real-time updates.</li>
            <li><strong>Minimum print size:</strong> QR codes must be printed at least 2cm x 2cm for accurate scanning.</li>
            <li><strong>Maintain Quiet Zone:</strong> Sufficient margin around the QR code is needed for accurate scanner recognition.</li>
            <li><strong>Color contrast:</strong> QR codes typically use dark backgrounds with light modules; inverted colors may be difficult to scan.</li>
          </ul>
        </div>
      </div>
    `,
  },
  notepad: {
    title: 'Notepad',
    description: 'Write simple text notes and auto-save them.',
    placeholder: 'Write your notes here...\n\nThey are automatically saved to the browser.',
    manualSave: 'Manual Save',
    copy: 'Copy',
    clearAll: 'Clear All',
    confirmClear: 'Are you sure you want to delete all notes?',
    copiedMessage: 'Copied to clipboard!',
    saved: '✓ Saved',
    savedAt: '✓ Saved ({time})',
    saving: 'Saving...',
    stats: 'Statistics',
    charCount: 'Characters',
    wordCount: 'Words',
    lineCount: 'Lines',
    byteCount: 'Bytes',
    notesInfo: 'Notes Info',
    infoStorage: 'Automatically saved to browser local storage',
    infoPersistence: 'Content persists even after closing the browser',
    infoDeviceOnly: 'Saved only on the current device',
    infoAutoSave: 'Auto-saves after 1 second of no input',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          Write notes directly in the browser with automatic saving!
        </p>
        <p>
          Notepad is a practical tool for writing simple text notes and automatically saving them in the browser.
          You can start writing immediately without separate installation or login,
          and content persists even after closing the browser using the browser's local storage technology.
        </p>
        <p>
          Real-time statistics including character count, word count, line count, and byte size
          make it useful when writing text for places with character limits.
        </p>
        <p>
          Quick idea notes, to-do lists, code snippet storage, text organization, and more -
          a lightweight and convenient notepad tool for various uses.
        </p>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Auto-Save Feature</h3>
          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">localStorage.setItem('key', content)</code>
          </div>
          <p className="mt-2 text-muted-foreground">
            Uses the Web Storage API's localStorage to permanently store data in the browser.
            Auto-saves after 1 second of no input, and content persists even after closing the browser.
          </p>
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-2">Statistics Calculation</h3>
          <p className="text-muted-foreground">
            Character count is calculated using content.length, word count uses whitespace-based split,
            and byte size uses the Blob object for accurate UTF-8 byte measurement.
          </p>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">Notepad Usage Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Quick notes:</strong> Useful for quickly recording ideas or to-dos during meetings or on the go.</li>
            <li><strong>Text organization:</strong> Use it for drafting long documents or organizing online text.</li>
            <li><strong>Code snippets:</strong> Temporarily store frequently used code or commands for instant copy when needed.</li>
            <li><strong>Copy-paste hub:</strong> Convenient for managing multiple texts in one place and copying them where needed.</li>
            <li><strong>Character limit check:</strong> Verify character count before writing text for SNS, applications, and more.</li>
            <li><strong>Caution:</strong> Do not store important passwords or personal information in the browser.</li>
          </ul>
        </div>
      </div>
    `,
  },
  holidayCalendar: {
    title: 'Holiday Calendar',
    description: 'Check Korean public holidays.',
    yearLabel: 'Year:',
    monthLabel: 'Month:',
    monthHolidays: '{month} Holidays ({count})',
    yearHolidays: '{year} All Holidays ({count})',
    descriptionContent: `
      <div className="space-y-4">
        <p className="text-lg font-semibold text-foreground">
          Check Korean public holidays at a glance on a calendar!
        </p>
        <p>
          The holiday calendar displays Korean public holidays in calendar form,
          making it easy to quickly check each holiday's date and name.
        </p>
        <p>
          It includes holiday information for 2024 and 2025, from fixed annual holidays
          like Seollal, Chuseok, and Children's Day to variable holidays based on the lunar calendar.
        </p>
        <p>
          It is useful for planning annual leave, travel schedules, delivery timing,
          and checking bank/government office operating hours.
        </p>
        <div class="mt-5">
          <h3 class="text-base font-semibold text-foreground mb-3">Glossary</h3>
          <dl class="space-y-3">
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Public Holiday</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">Days when government offices are closed by law, including fixed annual holidays like New Year's Day and Independence Movement Day, as well as lunar-calendar-based holidays like Seollal and Chuseok.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Alternative Holiday</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">A system where the next weekday is designated as a public holiday when a holiday falls on Saturday or Sunday.</dd>
            </div>
            <div class="rounded-lg border border-border bg-muted/40 p-3">
              <dt class="font-semibold text-foreground">Lunar / Solar Calendar</dt>
              <dd class="text-sm text-muted-foreground mt-1 leading-relaxed">The solar calendar is based on Earth's revolution around the sun, while the lunar calendar is based on the moon's phases. Seollal and Chuseok follow lunar calendar dates.</dd>
            </div>
          </dl>
        </div>
      </div>
    `,
    formulaContent: `
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-lg mb-2">Korean Public Holidays List (2024-2025)</h3>
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <p className="font-semibold text-primary">Fixed Annual Holidays:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>New Year's Day (January 1)</li>
              <li>Independence Movement Day (March 1)</li>
              <li>Children's Day (May 5)</li>
              <li>Memorial Day (June 6)</li>
              <li>Liberation Day (August 15)</li>
              <li>National Foundation Day (October 3)</li>
              <li>Hangul Day (October 9)</li>
              <li>Christmas (December 25)</li>
            </ul>
            <p className="mt-2 font-semibold text-primary">Lunar Calendar-based Holidays:</p>
            <ul className="list-disc list-inside text-sm text-muted-foreground">
              <li>Seollal (around Lunar January 1, up to 3 days + alternative holiday)</li>
              <li>Birthday of the Buddha (Lunar April 8)</li>
              <li>Chuseok (around Lunar August 15, up to 3 days + alternative holiday)</li>
            </ul>
          </div>
        </div>
      </div>
    `,
    tipsContent: `
      <div className="space-y-4">
        <div className="p-4 rounded-lg border-l-4 border-primary bg-muted">
          <h3 className="font-semibold text-lg mb-2 text-foreground">Key Holiday Tips</h3>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li><strong>Alternative holiday system:</strong> When a holiday falls on Saturday or Sunday, the next weekday may be designated as an alternative holiday. From 2024, the scope of alternative holidays has been expanded.</li>
            <li><strong>Annual leave strategy:</strong> Using annual leave around holidays can create long vacations. Taking leave on Monday or Friday connected to holidays is effective.</li>
            <li><strong>Delivery:</strong> Delivery may be delayed on holidays, so order important items in advance.</li>
            <li><strong>Banks/Government offices:</strong> Most banks and government offices do not operate on holidays, so check in advance.</li>
            <li><strong>Business hours changes:</strong> On holidays, businesses typically operate on weekend hours, and some stores may be closed.</li>
            <li><strong>Government services:</strong> Civil complaint submission and processing are not possible on holidays, so plan accordingly.</li>
          </ul>
        </div>
      </div>
    `,
  },
  velocityCalculator: {
    title: 'Velocity Calculator',
    description: 'Calculate speed or acceleration by entering distance and time, or velocity change.',
    tabVelocity: 'Velocity Calc',
    tabAcceleration: 'Acceleration Calc',
    inputDistance: 'Distance (m)',
    inputTime: 'Time (s)',
    inputInitialVelocity: 'Initial Velocity (m/s)',
    inputFinalVelocity: 'Final Velocity (m/s)',
    inputAccelTime: 'Time (s)',
    calculateBtn: 'Calculate',
    resetBtn: 'Reset',
    resultVelocity: 'Calculated Velocity',
    resultAcceleration: 'Calculated Acceleration',
    placeholder: 'Press Calculate to see the result.',
    resultTabVelocity: 'Velocity Result',
    resultTabAcceleration: 'Acceleration Result',
  },
  torqueCalculator: {
    title: 'Torque Calculator',
    description: 'Enter force and distance to calculate torque.',
    inputForce: 'Force (F):',
    inputDistance: 'Distance (r):',
    placeholder: 'Enter force and distance, then press Calculate.',
    calculateBtn: 'Calculate',
    resultTitle: 'Result',
    resultDescription: 'The torque is {value} N·m.',
  },
  molarityCalculator: {
    title: 'Molarity Calculator',
    description: 'Enter moles and volume to calculate the molarity of a solution.',
    tabDirect: 'Direct Calculation',
    tabMass: 'Mass-based',
    inputMoles: 'Moles (mol)',
    inputVolume: 'Solution Volume (L)',
    inputMass: 'Solute Mass (g)',
    inputMolecularWeight: 'Molecular Weight (g/mol)',
    inputMassVolume: 'Solution Volume (L)',
    calculateBtn: 'Calculate',
    resetBtn: 'Reset',
    resultDirectTitle: 'Direct Calculation Result',
    resultMassTitle: 'Mass-based Result',
    resultMolarity: 'Calculated Molarity',
    resultMoles: 'Moles',
    resultMolarityLabel: 'Molarity',
    placeholder: 'Press Calculate to see the result.',
  },
  kineticEnergyCalculator: {
    title: 'Kinetic Energy Calculator',
    description: 'Enter mass and velocity, or moment of inertia and angular velocity, to calculate kinetic energy.',
    linearMotion: 'Linear Motion',
    rotationalMotion: 'Rotational Motion',
    inputMass: 'Mass (kg)',
    inputVelocity: 'Velocity (m/s)',
    inputMomentOfInertia: 'Moment of Inertia (kg·m²)',
    inputAngularVelocity: 'Angular Velocity (rad/s)',
    calculateBtn: 'Calculate',
    resultLabel: 'Calculated Kinetic Energy',
    inputValues: 'Input Values',
    placeholder: 'Enter values and press Calculate.',
  },
  forceCalculator: {
    title: 'Force Calculator',
    description: 'Enter mass and acceleration to calculate force (F=ma).',
    inputMass: 'Mass (kg)',
    inputAcceleration: 'Acceleration (m/s²)',
    calculateBtn: 'Calculate',
    resetBtn: 'Reset',
    resultLabel: 'Calculated Force',
    placeholder: 'Press Calculate to see the result.',
  },
  tankCalculator: {
    title: 'Tank Volume Calculator',
    description: 'Calculate the volume and capacity of various tanks.',
    loading3D: 'Loading 3D model...',
    visualization: 'Tank Visualization',
    inputs: {
      tankType: 'Tank Type',
      unit: 'Unit',
      diameter: 'Diameter',
      height: 'Height',
      length: 'Length',
      width: 'Width',
      radius1: 'Radius 1',
      radius2: 'Radius 2',
      coneHeight: 'Cone Height',
      fillHeight: 'Fill Height',
      topDiameter: 'Top Diameter',
      bottomDiameter: 'Bottom Diameter',
      cylinderHeight: 'Cylinder Height',
    },
    results: {
      totalVolume: 'Total Volume',
      filledVolume: 'Filled Volume',
      surfaceArea: 'Surface Area',
      formula: 'Formula Used',
      enterValues: 'Please enter values on the left and click calculate.',
    },
    details: {
      title: '📚 Tank Volume Formulas & Theory',
      types: 'Supported Tank Types',
      partialFill: 'Partial Fill Calculation',
      partialFillDesc: 'Enter a fill height to calculate the volume of a partially filled tank. Complex circular segment formulas are used for horizontal cylinders.',
      unitConversion: 'Unit Conversion',
      unitConversionDesc: 'Supports various unit conversions according to the selected unit system (Metric/Imperial).',
    },
    info: {
      description: `
        <div class="space-y-4">
          <p>The <strong>Tank Volume Calculator</strong> is an engineering tool that accurately calculates the volume of various types of tanks and storage facilities. It supports cylindrical, rectangular, elliptical, and conical tanks, which are essential for storage capacity calculation in industrial fields.</p>
          <p>This calculator is used when designing or verifying the volume of tanks in various industries such as water treatment facilities, chemical plants, oil storage facilities, and agricultural reservoirs. It is also useful for calculating the surface area of a tank to estimate the amount of paint or insulation material.</p>
          <p>Different mathematical formulas are applied depending on the shape of the tank, and users can choose between metric (m, mm) and imperial (ft, in) units for calculation. By specifying the desired fill height, the volume up to that height can also be calculated for practical use.</p>
          <p class="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 rounded-r-lg">Accurate volume calculation when designing a tank directly affects cost efficiency and safety. Underestimating leads to insufficient storage capacity, while overestimating results in unnecessary costs. Please use this calculator to design optimal tanks based on accurate data.</p>
        </div>
      `,
      formula: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">Cylindrical Tank (Vertical)</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = π × r² × h</p>
            </div>
            <ul class="mt-4 space-y-2 text-sm">
              <li><strong class="font-semibold">V</strong>: Volume (unit: m³ or L, etc.)</li>
              <li><strong class="font-semibold">π</strong>: Pi (≈ 3.14159)</li>
              <li><strong class="font-semibold">r</strong>: Radius (Diameter ÷ 2)</li>
              <li><strong class="font-semibold">h</strong>: Height</li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-yellow-500 pl-3">Rectangular Tank</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = Length × Width × Height</p>
            </div>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-purple-500 pl-3">Conical Tank</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">V = (1/3) × π × r² × h</p>
            </div>
          </div>
        </div>
      `,
      tips: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">Tank Type Selection Guide</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>Vertical Cylindrical:</strong> The most common shape, capable of withstanding high pressure</li>
              <li><strong>Horizontal Cylindrical:</strong> Suitable for places with height restrictions</li>
              <li><strong>Rectangular:</strong> Advantageous when customized installation space is required</li>
              <li><strong>Cone Bottom:</strong> Suitable when sediment discharge is needed</li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">Volume Unit Conversion</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>1 m³</strong> = 1,000 Liters (L)</li>
              <li><strong>1 Liter</strong> = 0.001 m³</li>
              <li><strong>1 gal (US)</strong> ≈ 0.003785 m³</li>
            </ul>
          </div>
          <div class="p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-800 dark:text-red-200 rounded-r-lg">
            <p class="font-bold text-sm">⚠️ Precautions</p>
            <p class="text-xs mt-1">When actually manufacturing a tank, it is recommended to design spare capacity considering wall thickness, weld seams, thermal expansion, etc. Generally, 5~10% of the calculated volume is added as a margin.</p>
          </div>
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-teal-500 pl-3">Real-life Application Examples</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>Water Treatment Facilities:</strong> Design of reservoirs for water supply and sewage treatment facilities</li>
              <li><strong>Chemical Plants:</strong> Calculation of raw material and finished product storage tank capacity</li>
              <li><strong>Agriculture:</strong> Design of irrigation reservoirs and fertilizer storage tanks</li>
              <li><strong>Fuel Storage:</strong> Design of fuel storage facilities such as gasoline and diesel</li>
            </ul>
          </div>
        </div>
      `
    }
  },
  pumpPower: {
    title: 'Pump Power Calculator',
    description: 'Calculate shaft power and motor power of a pump system.',
    inputs: {
      flowRate: 'Flow Rate',
      head: 'Head',
      fluidDensity: 'Fluid Density',
      pumpEfficiency: 'Pump Efficiency',
      motorEfficiency: 'Motor Efficiency',
    },
    results: {
      shaftPower: 'Shaft Power',
      motorPower: 'Motor Power',
      motorPowerDesc: '* The total power required to drive the pump, taking motor efficiency into account.',
      enterValues: 'Please enter values on the left and click calculate.',
    }
  },
  freeFall: {
    title: 'Free Fall Calculator',
    description: 'Calculate the velocity and distance traveled by a free falling object.',
    inputs: {
      time: 'Time of Fall',
      initialVelocity: 'Initial Velocity',
      initialHeight: 'Initial Height (Optional)',
    },
    results: {
      finalVelocity: 'Final Velocity',
      distanceTraveled: 'Distance Traveled',
      timeToGround: 'Time to Ground',
      enterValues: 'Please enter values to calculate.',
    },
    visualization: {
      title: 'Velocity and Distance Traveled vs. Time',
      velocity: 'Velocity',
      distance: 'Distance',
      time: 'Time',
      tableTitle: 'Free Falling Object - Data Table',
    },
    details: {
      title: '📚 Free Fall Formulas & Theory',
      description: 'Velocities and distances are achieved without aerodynamic resistance (vacuum conditions). Air resistance or drag force can be significant depending on shape and surface area.',
      formulaTitle: 'Formulas Used',
    }
  },
  npshCalculator: {
    title: 'NPSH Calculator',
    description: 'Calculate the Net Positive Suction Head of a pump.',
    loadingImage: 'Loading image...',
    fluids: {
      water: 'Water',
      ethanol: 'Ethanol',
      benzene: 'Benzene',
      toluene: 'Toluene',
      acetone: 'Acetone',
      methanol: 'Methanol',
      chloroform: 'Chloroform',
      cyclohexane: 'Cyclohexane',
    },
    inputs: {
      tankPosition: 'Tank Position',
      abovePump: 'Above Pump',
      belowPump: 'Below Pump',
      tankType: 'Tank Type',
      openTank: 'Open Tank',
      closedTank: 'Closed Tank',
      fluidSelection: 'Fluid Selection',
      atmosphericPressure: 'Atmospheric pressure',
      surfacePressure: 'Surface pressure',
      sameAsAtmospheric: '(Same as atmospheric)',
      vaporPressure: 'Vapor pressure',
      liquidDensity: 'Liquid density',
      temperature: 'Temperature',
      distance: 'Distance',
      frictionLoss: 'Friction loss',
      npshr: 'NPSH Required',
      npshrPlaceholder: 'Pump datasheet value',
    },
    buttons: {
      calculating: 'Calculating...',
      calculate: 'Calculate NPSH',
    },
    messages: {
      success: 'NPSH calculation complete.',
      error: 'An error occurred during calculation.',
    },
    visualization: {
      title: 'NPSH Visualization',
      needCalculate: 'Calculation Needed',
      needCalculateDesc: 'Please press the calculate button',
      tankAbove: 'Liquid is above pump (Positive head)',
      tankBelow: 'Liquid is below pump (Negative head)',
      openTankDesc: 'Open to atmosphere (Ps = Patm)',
      closedTankDesc: 'Closed tank (Ps = Patm + Psurface)',
      conditions: 'Conditions',
    },
    results: {
      title: 'Calculation Results',
      npsha: 'NPSH Available',
      npshr: 'NPSH Required',
      safe: 'Safe',
      caution: 'Caution',
      danger: 'Danger',
      adequate: 'Adequate',
      inadequate: 'Inadequate',
      analysisTitle: 'Formula Component Analysis',
      formulaText: 'NPSH Available = (Psurf - Pvap) / (ρ × g) {sign} Z - Hl',
      formulaDesc: '= Pressure Head {signDesc} - Friction Loss',
      signDescAbove: '+ Static Head',
      signDescBelow: '- Suction Lift',
      pressureHeadTitle: 'Pressure Head Components',
      atmHead: 'Atmospheric Head:',
      vapHead: 'Vapor Head:',
      netPressureHead: 'Net Pressure Head:',
      positionHeadTitle: 'Position Head',
      tankPositionRes: 'Tank Position:',
      distanceRes: 'Distance:',
      positionHead: 'Position Head:',
      frictionHeadTitle: 'Friction Head',
      frictionLossRes: 'Friction Loss:',
    },
    info: {
      description: `
        <div class="space-y-4">
          <p><strong>NPSH (Net Positive Suction Head) Calculator</strong> is an essential engineering tool for pump design and selection. NPSH represents the pressure head at the pump inlet that allows fluid to be sucked in stably without cavitation.</p>
          <p><strong>Cavitation</strong> is the formation of vapor bubbles when the fluid pressure drops below its vapor pressure. It significantly reduces pump efficiency and causes physical damage to the impeller and casing.</p>
          <p>This calculator evaluates the safety margin against cavitation by comparing NPSHa (Available) and NPSHr (Required). It provides accurate calculations for various fluids under different operating conditions.</p>
        </div>
      `,
      formula: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-green-500 pl-3">NPSHa (Net Positive Suction Head Available)</h4>
            <div class="p-4 bg-muted rounded-lg">
              <p class="text-center font-mono text-lg">NPSHa = Ps/ρg + Vs²/2g - Pv/ρg ± Hs</p>
            </div>
            <ul class="mt-4 space-y-2 text-sm">
              <li><strong>Ps</strong>: Absolute pressure at suction (Pa)</li>
              <li><strong>ρ</strong>: Fluid density (kg/m³)</li>
              <li><strong>g</strong>: Acceleration due to gravity (9.81 m/s²)</li>
              <li><strong>Vs</strong>: Flow velocity at suction (m/s)</li>
              <li><strong>Pv</strong>: Vapor pressure of fluid (Pa)</li>
              <li><strong>Hs</strong>: Suction head (positive = below pump, negative = above pump)</li>
            </ul>
          </div>
        </div>
      `,
      tips: `
        <div class="space-y-6">
          <div>
            <h4 class="font-bold text-lg mb-2 border-l-4 border-indigo-500 pl-3">Tips to Prevent Cavitation</h4>
            <ul class="list-disc list-inside space-y-2 mt-2">
              <li><strong>Minimize suction lift:</strong> Keep the pump as close to the fluid source as possible.</li>
              <li><strong>Increase suction pipe diameter:</strong> Reduces fluid velocity and friction loss.</li>
              <li><strong>Control temperature:</strong> Higher temperatures increase vapor pressure.</li>
            </ul>
          </div>
        </div>
      `
    },
    details: {
      title: 'Detailed Formulas & Theory',
      content: `
        <div class="space-y-6">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-700">
            <h4 class="font-semibold text-blue-800 dark:text-blue-200 mb-3">NPSH Available Formula</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>NPSH Available = (Psurf - Pvap)/(ρ×g) - Z - Hf</strong></p>
              <p>• Psurf: Surface pressure = Patm + Pres (Pa)</p>
              <p>• Pvap: Vapor pressure (Pa)</p>
              <p>• ρ: Liquid density (kg/m³)</p>
              <p>• g: Acceleration due to gravity (9.81 m/s²)</p>
              <p>• Z: Height difference between liquid surface and pump inlet</p>
              <p>• Hf: Friction loss</p>
            </div>
          </div>

          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 border border-orange-200 dark:border-orange-700">
            <h4 class="font-semibold text-orange-800 dark:text-orange-200 mb-3">Tank Position and Z Sign</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Above Pump:</strong> Liquid is above the pump (Z = +distance)</p>
              <p><strong>Below Pump:</strong> Liquid is below the pump (Z = -distance)</p>
              <p>• Positive Z: Gravity helps (static head)</p>
              <p>• Negative Z: Gravity opposes (suction lift)</p>
            </div>
          </div>

          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-700">
            <h4 class="font-semibold text-green-800 dark:text-green-200 mb-3">Vapor Pressure (Antoine Equation)</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>log₁₀(P) = A - B/(C + T)</strong></p>
              <p>• T: temperature (°C), P: vapor pressure (mmHg)</p>
              <p>• Convert to Pa: P(Pa) = P(mmHg) × 133.322</p>
            </div>
          </div>

          <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-700">
            <h4 class="font-semibold text-red-800 dark:text-red-200 mb-3">Safety Criteria</h4>
            <div class="text-sm text-gray-600 dark:text-gray-400 space-y-2">
              <p><strong>Recommended (based on NPSHr):</strong></p>
              <p>• <span class="text-green-600 dark:text-green-400 font-medium">Safe:</span> NPSH Available ≥ 1.3 × NPSHr</p>
              <p>• <span class="text-yellow-600 dark:text-yellow-400 font-medium">Caution:</span> 1.0 × NPSHr ≤ NPSH Available &lt; 1.3 × NPSHr</p>
              <p>• <span class="text-red-600 dark:text-red-400 font-medium">Danger:</span> NPSH Available &lt; NPSHr</p>
              <p class="mt-3"><strong>Absolute thresholds (when NPSHr is not provided):</strong></p>
              <p>• <span class="text-green-600 dark:text-green-400 font-medium">Safe:</span> NPSH Available &gt; 3</p>
              <p>• <span class="text-yellow-600 dark:text-yellow-400 font-medium">Caution:</span> 2 &lt; NPSH Available ≤ 3</p>
              <p>• <span class="text-red-600 dark:text-red-400 font-medium">Danger:</span> NPSH Available ≤ 2</p>
            </div>
          </div>
        </div>
      `,
    },
  },
  corrosionCompatibility: {
    title: 'Corrosion Compatibility Comparison',
    selectChemical: 'Select Chemical',
    selectMaterial: 'Select Material',
    allRatings: 'All Ratings',
    searchChemical: 'Search chemicals...',
    searchMaterial: 'Search materials...',
    allMaterials: 'All Materials',
    compatibilityResult: 'Compatibility Result',
    materialName: 'Material Name',
    concentration: 'Concentration',
    temperature: 'Temperature (°C)',
    compatibilityRating: 'Compatibility Rating',
    remarks: 'Remarks',
    noData: 'No corrosion compatibility data available for this combination.',
    source: 'Source: Alleima (Sandvik)',
  },
  materialComparison: {
    title: 'Material Property Comparison',
    source: 'Source: MakeItFrom',
    description: 'Add materials to compare their properties side by side.',
    majorCategory: 'Select major category',
    middleCategory: 'Select middle category',
    subCategory: 'Select sub-category',
    material: 'Select material',
    addMaterial: 'Add Material',
    searchPlaceholder: 'Search by material name (e.g. 316, 625, Stainless, Alloy)',
    noResults: 'No search results.',
    loadingData: 'Loading data...',
    properties: 'PROPERTIES',
    composition: 'Chemical Composition',
    referencePrice: 'Reference Price',
    property: 'Property',
    unit: 'Unit',
    element: 'Element',
  },
  dpsCalculator: {
    title: 'DPS Calculator',
    description: 'Calculate DPS and compare base vs buffed damage output.',
    inputs: {
      attackPower: 'Attack Power',
      attackSpeed: 'Attack Speed (APS)',
      critChance: 'Crit Chance (%)',
      critMultiplier: 'Crit Multiplier',
      bonusSection: 'Buff Applied',
      bonusDamage: 'Bonus Damage (%)',
      bonusSpeed: 'Attack Speed (%)',
    },
    results: {
      baseDpsNoCrit: 'Base DPS (No Crit)',
      baseDpsWithCrit: 'Base DPS (With Crit)',
      buffedDps: 'Buffed DPS',
    },
    info: {
      title: 'DPS (Damage Per Second) Calculator',
      p1: 'A tool to numerically evaluate a game character\'s combat power by calculating damage per second. Enter attack power, attack speed, crit chance & multiplier, and bonus damage/speed buffs to compare base DPS vs buffed DPS.',
      p2: 'In most games including MMORPGs, action RPGs, and shooters, DPS is a key metric that determines character build direction and equipment investment.',
      p3: 'Useful for general users as a build design and growth guide, and for攻略 writers and guild managers as an analysis tool for party composition.',
      tip: 'DPS is an average. Actual combat involves various factors such as mob defense, invincibility frames, and attack intervals, so use it as a reference. Game-specific coefficients and round mechanics differ, so values are best for relative comparison.',
    },
    glossary: {
      dps: { term: 'DPS (Damage Per Second)', desc: 'Average damage dealt in 1 second, a core metric for evaluating combat power.' },
      crit: { term: 'Critical Hit', desc: 'An attack that hits for a higher multiplier than base damage, determined by chance and multiplier.' },
      attackPower: { term: 'Attack Power', desc: 'Basic damage dealt per attack.' },
      attackSpeed: { term: 'Attack Speed (APS)', desc: 'Number of attacks per second, contributing to DPS proportionally.' },
    },
    formula: {
      baseDpsNoCrit: 'Base DPS (No Crit)',
      baseDpsFormula: 'Base DPS = Attack Power × Attack Speed (APS)',
      critCoefficient: 'Crit Coefficient',
      critFormula: 'Crit Coefficient = 1 + (Crit Chance / 100) × (Crit Multiplier - 1)',
      critDps: 'Crit Applied DPS',
      critDpsFormula: 'DPS = Attack Power × APS × Crit Coefficient',
      buffedDps: 'Buffed DPS',
      buffedFormula: 'Buffed DPS = Attack Power × (1 + Bonus Damage%/100) × APS × (1 + Attack Speed%/100) × Crit Coefficient',
      example: 'Example: Attack Power 100, APS 1.0, Crit 20%/2.0, Buff +10% Damage · +5% Speed → approx. 115.5 DPS',
    },
    tips: {
      critOpt: 'Crit Optimization',
      critTip1: 'The higher the crit chance, the more efficient multiplier investment becomes.',
      critTip2: 'Balance chance and multiplier to maximize expected damage.',
      speedValue: 'Value of Attack Speed',
      speedTip1: 'Attack speed is proportional to DPS, so steady investment is effective.',
      speedTip2: 'Check the speed cap in games that have one.',
      buffStack: 'Buff Stacking',
      buffTip1: 'Multiple buffs are calculated multiplicatively, so stacking effects are significant.',
      buffTip2: 'Check if duplicate effects of the same type apply.',
      gameRef: 'Game-Specific Notes',
      gameTip1: 'MMORPG: Dealers aim for high DPS.',
      gameTip2: 'Shooters: Consider accuracy and projectile speed together.',
      comparison: 'Relative Comparison',
      compTip1: 'Compare DPS before and after equipment changes to set investment priorities.',
      compTip2: 'Check both buff on and off states.',
      limits: 'Understanding Limits',
      limitTip1: 'DPS is an average that doesn\'t reflect defense, invincibility, etc.',
      limitTip2: 'Judge comprehensively with actual patterns.',
    },
  },
  randomStringGenerator: {
    title: 'Random String Generator',
    description: 'Generate random strings for security tokens, passwords, API keys, and more.',
    inputs: {
      stringLength: 'String Length',
      stringCount: 'Number of Strings',
      charType: 'Character Type',
      uppercase: 'Uppercase (A-Z)',
      lowercase: 'Lowercase (a-z)',
      numbers: 'Numbers (0-9)',
      symbols: 'Symbols (!@#$%^&*)',
      generate: 'Generate String',
      reset: 'Reset',
    },
    results: {
      empty: 'Please generate a strings.',
      generated: '{count} generated',
      copyAll: 'Copy All',
    },
    info: {
      title: 'Random String Generator',
      p1: 'A tool that instantly creates random strings for use as security tokens, passwords, API keys, temporary IDs, and more. Select needed character types (uppercase, lowercase, numbers, symbols) and set length and count to generate high-quality strings using cryptographically secure algorithms.',
      p2: 'Useful for temporary password issuance, session/auth token creation, test dummy data, collision-free filenames, and more across development and operations.',
      p3: 'Essential for developers and service operators, and useful for general users as a secure password creation tool. Generated strings can be copied directly to clipboard.',
      tip: 'This tool uses the Web Crypto API (crypto.getRandomValues), making values harder to predict than regular random numbers. Generated values are only displayed on screen and not stored, so save important keys separately.',
    },
    formula: {
      charset: 'Charset Composition',
      charsetDesc: 'Creates the available character set based on selected character types.',
      combinations: 'Possible Combinations',
      comboDesc: 'With length L and charset size N, the total possible strings are:',
      comboFormula: 'Combinations = N^L',
      example: 'Example: 62 characters, length 16 → 62^16 ≈ 4.7×10²⁸',
      mapping: 'Random Mapping',
      mappingDesc: 'Uses the remainder of a random integer divided by charset length as the index.',
      mappingFormula: 'result += charset[random % charset.length]',
      mappingNote: 'This guarantees a uniform distribution where each character has equal probability of selection.',
    },
    tips: {
      passwordLength: 'Password Length',
      tip1: 'Use at least 12 characters for important accounts, 16+ recommended.',
      tip2: 'Enabling all character types increases strength.',
      apiKey: 'API Key Generation',
      apiKeyTip1: 'Special characters may cause escaping issues, so numbers+letters combo is recommended.',
      apiKeyTip2: 'Session/auth tokens of 32+ characters are recommended.',
      noReuse: 'No Reuse',
      noReuseTip1: 'Don\'t reuse the same string across multiple places.',
      noReuseTip2: 'Replace immediately if a leak is suspected.',
      safeStorage: 'Safe Storage',
      safeTip1: 'Generated values are not stored, so use a password manager.',
      safeTip2: 'Be careful not to leave traces in screenshots or logs.',
      testData: 'Test Data',
      testTip1: 'Use bulk generation for dummy data and filename creation.',
      testTip2: 'Up to 50 can be generated at once.',
      complexity: 'Complexity Control',
      complexTip1: 'Adjust symbol inclusion based on usage.',
      complexTip2: 'Numbers+letters combo is suitable when readability is needed.',
    },
  },
  randomNumberGenerator: {
    title: 'Random Number Generator',
    description: 'Generate random numbers within a specified range.',
    inputs: {
      minValue: 'Minimum Value',
      maxValue: 'Maximum Value',
      count: 'Count',
      allowDuplicates: 'Allow Duplicates',
      sort: 'Sort Ascending',
      generate: 'Generate Numbers',
      reset: 'Reset',
    },
    results: {
      empty: 'Please generate numbers.',
      generated: '{count} generated',
      copyAll: 'Copy All',
      history: 'Generation History',
      countUnit: '',
    },
    duplicateAlert: 'When duplicates are not allowed, the maximum count is {range}.',
    info: {
      title: 'Random Number Generator',
      p1: 'A tool that picks random numbers within a specified range. Set min, max, count, and choose duplicate/sort options to create numbers for lottery, sampling, test data, and more.',
      p2: 'Useful for lottery number generation, prize drawings, A/B test sampling, simulation random numbers, and game event probability verification.',
      p3: 'Essential for developers and data analysts as a test data tool, and for event organizers and educators as a fair drawing tool. Recent 10 generation records are also provided.',
      tip: 'Generation uses Math.random() for statistically uniform distribution. For security-critical random numbers (lottery drawings, etc.), use a cryptographic random number generator separately. Records are maintained only during the browser session.',
    },
    formula: {
      baseFormula: 'Base Generation Formula',
      formula: 'random = floor(random() × (max - min + 1)) + min',
      dedup: 'Duplicate Prevention Logic',
      dedupDesc: 'When duplicates are not allowed, already drawn numbers are tracked using a Set.',
      dedupFormula: 'No duplicates: (max - min + 1) ≥ count',
      dedupNote: 'Generating more than the range limits will be restricted.',
      sort: 'Sorting',
      sortFormula: 'Array.sort((a, b) => a - b)',
      sortNote: 'When the ascending sort option is enabled, results are organized by size.',
    },
    tips: {
      lottery: 'Lottery Numbers',
      lotteryTip1: 'Use no duplicates and ascending sort.',
      lotteryTip2: 'Set range and count according to regulations.',
      fairDrawing: 'Fair Drawing',
      fairTip1: 'Allow duplicates to create multiple-draw scenarios.',
      fairTip2: 'Announce the range to participants before selecting winners.',
      testData: 'Test Data',
      testTip1: 'Create sample input values with random numbers in range.',
      testTip2: 'Use the record feature for repetitive verification.',
      gaming: 'Game Use',
      gamingTip1: 'Use for event/item drop probability simulation.',
      gamingTip2: 'Change the random seed to observe distributions.',
      rangeNote: 'Range Caution',
      rangeTip1: 'If min > max, they are automatically swapped.',
      rangeTip2: 'When no duplicates, ensure count doesn\'t exceed range.',
      secureRandom: 'Secure Random',
      secureTip1: 'Not suitable for official drawing/authentication purposes.',
      secureTip2: 'Use a separate cryptographic random generator when needed.',
    },
  },
  randomEmailGenerator: {
    title: 'Random Email Generator',
    description: 'Generate random email addresses for testing and privacy purposes.',
    inputs: {
      domainSelect: 'Select Domain',
      random: 'Random Selection',
      customDomain: 'Custom Domain',
      customDomainLabel: 'Custom Domain',
      count: 'Count',
      generate: 'Generate Email',
      reset: 'Reset',
    },
    results: {
      empty: 'Please generate emails.',
      generated: '{count} generated',
      copyAll: 'Copy All',
    },
    info: {
      title: 'Random Email Generator',
      p1: 'A tool that creates random email addresses for testing, service registration, and privacy protection. Choose from popular domains (gmail, yahoo, outlook, naver, daum, etc.) or enter a custom domain to generate addresses in your desired format.',
      p2: 'Combines English adjectives, nouns, and numbers to create natural, memorable usernames — useful for bulk dummy account creation during development and QA. Up to 50 can be generated at once.',
      p3: 'Useful for developers and testers as email sending function verification, and for general users as a privacy tool for disposable addresses on untrusted sites.',
      tip: 'Emails created with this tool are not real or receivable addresses. For actual registration or mail reception, use a separate temporary mail service or a formal account.',
    },
    formula: {
      structure: 'Structure',
      structureDesc: 'Email is in the format username@domain, where username is adjective+noun+number.',
      structureFormula: 'Email = Adjective + Noun + Number @ Domain',
      combinations: 'Possible Combinations',
      comboDesc: 'With A adjectives, N nouns, and numbers 0~9999, the total possible usernames are:',
      comboFormula: 'Combinations = A × N × 10,000',
      domainSelect: 'Domain Selection',
      domainDesc: 'Combines the user-selected or custom domain with the username.',
      domainFormula: 'return username + "@" + domain',
    },
    tips: {
      testAccounts: 'Test Accounts',
      testTip1: 'Bulk-issue dummy emails for app/website QA.',
      testTip2: 'Suitable for registration flow verification.',
      privacy: 'Privacy Protection',
      privacyTip1: 'Use as disposable addresses on untrusted sites.',
      privacyTip2: 'Don\'t use for important accounts.',
      devTool: 'Developer Tool',
      devTip1: 'Use for email sending/receiving logic testing.',
      devTip2: 'Useful for creating marketing newsletter test lists.',
      domainFormat: 'Domain Format',
      domainTip1: 'Enter custom domains exactly in example.com format.',
      domainTip2: 'The @ symbol is handled automatically.',
      verification: 'Verification Required',
      verTip1: 'Use regex validation before actual registration.',
      verTip2: 'Generated addresses cannot receive mail.',
      bulkGen: 'Bulk Generation',
      bulkTip1: 'Up to 50 can be generated at once.',
      bulkTip2: 'Use Copy All to paste directly into sheets or databases.',
    },
  },
  ipLookup: {
    title: 'IP Lookup',
    description: 'Look up your public IP address and related information.',
    inputs: {
      title: 'IP Address Lookup',
      subtitle: 'Look up your current public IP address and related information.',
      loading: 'Looking up...',
      refresh: 'Refresh',
      notes: 'Notes',
      note1: 'This tool shows public IP addresses.',
      note2: 'When using a VPN, the VPN server\'s IP is displayed.',
      note3: 'IP information is approximate location provided by the ISP.',
      note4: 'Exact location may not be displayed.',
    },
    results: {
      empty: 'Please look up IP information.',
      publicIp: 'Public IP Address',
      city: 'City',
      region: 'Region',
      country: 'Country',
      isp: 'ISP',
      coordinates: 'Coordinates',
      timezone: 'Timezone',
      postal: 'Postal Code',
    },
    errors: {
      fetchFailed: 'Failed to get IP information. Please check your network connection.',
      ipFetchFailed: 'IP lookup failed',
    },
    info: {
      title: 'IP Address Lookup',
      p1: 'A tool that displays your device\'s public IP address and related geographic information in real-time. An IP address is a unique identifier assigned by your ISP (Internet Service Provider).',
      p2: 'Useful for remote access setup, firewall allowlist registration, network troubleshooting, and checking region-restricted content access. Also used for security audits to verify your public IP.',
      p3: 'Useful for network administrators and security personnel as a basic diagnostic tool, and for general users to verify connection information.',
      tip: 'This tool sequentially calls external APIs (ipinfo.io, ipify) to retrieve information. Displayed locations are based on IP assignment and may differ from actual physical location.',
    },
    glossary: {
      publicIp: { term: 'Public IP Address', desc: 'A unique address identifying your device on the internet, assigned by your ISP. Used for external access, unlike private IP used within home or office networks.' },
      isp: { term: 'ISP (Internet Service Provider)', desc: 'Telecom companies like KT, SK Broadband, LG U+ that provide internet lines. They assign public IPs to users.' },
      vpn: { term: 'VPN (Virtual Private Network)', desc: 'A technology that encrypts communications and routes them through different servers. When using a VPN, the VPN server\'s IP is displayed instead of your actual IP.' },
      geoIp: { term: 'IP-based Geolocation', desc: 'A method that estimates approximate city/region using IP assignment information. Cannot determine exact physical address.' },
    },
    formula: {
      lookupMethod: 'Lookup Method',
      lookupDesc: 'Identifies the access IP through external APIs and retrieves geographic information. Two APIs are tried sequentially.',
      primary: 'Primary: ipinfo.io',
      primaryDesc: 'Provides IP, city, region, country, coordinates, ISP, timezone, and more.',
      fallback: 'Fallback: ipify',
      fallbackDesc: 'When the primary fails, retrieves minimum IP information to display.',
    },
    tips: {
      vpn: 'VPN Usage',
      vpnTip1: 'Use a VPN service to hide your IP.',
      vpnTip2: 'Connected VPN changes the displayed IP.',
      privacy: 'Privacy',
      privacyTip1: 'Public IP can expose approximate location.',
      privacyTip2: 'Router external IP is also visible in admin pages.',
      remoteAccess: 'Remote Access Setup',
      remoteTip1: 'Register your IP in firewall allowlists.',
      remoteTip2: 'If not static, update regularly.',
      troubleshooting: 'Network Troubleshooting',
      troubleTip1: 'Check your IP and ISP first when connection issues occur.',
      troubleTip2: 'Consider restarting the router if results differ from expectations.',
      regionCheck: 'Region Restriction Check',
      regionTip1: 'Content access is determined based on IP.',
      regionTip2: 'Note that country information is based on ISP assignment.',
      security: 'Security Audit',
      securityTip1: 'Trace suspicious connections by IP.',
      securityTip2: 'Compare with the IP in login notifications.',
    },
  },
  invoiceGenerator: {
    title: 'Invoice Generator',
    description: 'Create and print professional invoices.',
    inputs: {
      companyName: 'Company Name',
      companyNamePlaceholder: 'Company Name',
      clientName: 'Client Name',
      clientNamePlaceholder: 'Client Name',
      companyAddress: 'Company Address',
      companyAddressPlaceholder: 'Company Address',
      clientAddress: 'Client Address',
      clientAddressPlaceholder: 'Client Address',
      invoiceNumber: 'Invoice Number',
      invoiceDate: 'Issue Date',
      taxRate: 'Tax Rate (%)',
      items: 'Items',
      addItem: 'Add',
      itemName: 'Item Name',
      unitPrice: 'Unit Price',
      notes: 'Notes',
      notesPlaceholder: 'Additional notes (optional)',
      preview: 'Preview',
      backToInput: 'Back to Input',
      print: 'Print',
    },
    results: {
      summary: 'Summary',
      itemCount: 'Items:',
      subtotal: 'Subtotal:',
      tax: 'VAT ({rate}%):',
      total: 'Total:',
      previewHint: 'Press the "Preview" button to view the invoice.',
      countUnit: '',
    },
    preview: {
      title: 'Invoice Preview',
      billTo: 'Bill To:',
      invoiceLabel: 'Invoice',
      number: 'No:',
      date: 'Date:',
      itemHeader: 'Item',
      quantityHeader: 'Qty',
      unitPriceHeader: 'Unit Price',
      amountHeader: 'Amount',
      subtotalLabel: 'Subtotal:',
      taxLabel: 'VAT ({rate}%):',
      totalLabel: 'Total:',
      notesLabel: 'Notes:',
    },
    info: {
      title: 'Invoice Generator',
      p1: 'A tool that makes it easy to create and print professional invoices. Enter company info, client info, item list, and tax rate to automatically calculate subtotal, VAT, and total for a clean invoice.',
      p2: 'Essential for freelancers, small businesses, startups, and sales managers. Create and print invoices directly in the browser without Excel or accounting software.',
      p3: 'Freely add/remove items, manage quantities and unit prices, and customize notes and invoice numbers.',
      tip: 'Korea\'s standard VAT rate is 10%; set 0% for tax-exempt items. For transactions requiring a tax invoice, verify legal requirements (business registration number, company name, supply amount vs tax amount separation) separately. This tool is for reference only.',
    },
    glossary: {
      invoice: { term: 'Invoice', desc: 'A document where the seller lists transaction items, quantities, and amounts to request payment from the buyer. Serves as transaction evidence and payment collection basis.' },
      vat: { term: 'VAT (Value Added Tax)', desc: 'A tax on goods or services transactions, with a standard rate of 10% in Korea. Calculated by multiplying supply amount by tax rate, ultimately borne by the end consumer.' },
      subtotal: { term: 'Subtotal', desc: 'The sum of all item amounts (quantity × unit price) before adding VAT. Adding VAT gives the final total.' },
      taxInvoice: { term: 'Tax Invoice', desc: 'A legal document issued for VAT declaration/deduction in business-to-business transactions. Requires business registration number, supply amount, and tax amount separation.' },
    },
    formula: {
      itemAmount: 'Item Amount',
      itemFormula: 'Item Amount = Quantity × Unit Price',
      subtotal: 'Subtotal',
      subtotalFormula: 'Subtotal = Σ (Quantity × Unit Price)',
      taxTotal: 'VAT and Total',
      taxFormula: 'VAT = Subtotal × (Tax Rate ÷ 100)',
      totalFormula: 'Total = Subtotal + VAT',
      example: 'Example: Subtotal ₩100,000, Tax Rate 10% → VAT ₩10,000, Total ₩110,000',
    },
    tips: {
      itemEntry: 'Item Entry',
      itemTip1: 'Write item names specifically so clients can understand.',
      itemTip2: 'Accurate quantity and unit price input auto-calculates the total.',
      taxSetup: 'Tax Rate Setup',
      taxTip1: 'Standard rate is 10%, tax-exempt items are 0%.',
      taxTip2: 'Check if you\'re a simplified taxpayer first.',
      invoiceNumber: 'Invoice Number',
      numTip1: 'Assign unique numbers for easy tracking and comparison.',
      numTip2: 'Setting a year/month numbering system is convenient.',
      printStore: 'Print and Storage',
      printTip1: 'Print-friendly layout enables PDF saving.',
      printTip2: 'Keep copies with transaction records.',
      legalReqs: 'Legal Requirements',
      legalTip1: 'Include business registration number when issuing tax invoices.',
      legalTip2: 'Separating supply amount and tax amount is standard practice.',
      notes: 'Using Notes',
      notesTip1: 'Include payment deadline, bank account, refund policy in notes.',
      notesTip2: 'Briefly summarize terms to prevent disputes.',
    },
  },
  internetSpeedTest: {
    title: 'Internet Speed Test',
    description: 'Test your internet connection speed. (Simulated results)',
    inputs: {
      title: 'Internet Speed Test',
      subtitle: 'This test provides simulated results and may differ from actual internet speed.',
      startTest: 'Start Test',
      pingTesting: 'Ping Test in Progress...',
      downloadTesting: 'Download Speed Test in Progress...',
      uploadTesting: 'Upload Speed Test in Progress...',
      stop: 'Stop',
      retest: 'Retest',
    },
    results: {
      empty: 'Results will appear when you start the test.',
      ping: 'Ping (ms)',
      download: 'Download (Mbps)',
      upload: 'Upload (Mbps)',
      speedVisual: 'Speed Visualization',
      downloadLabel: 'Download',
      uploadLabel: 'Upload',
      details: 'Detailed Results',
      pingLatency: 'Ping Latency:',
      jitter: 'Jitter:',
      downloadSpeed: 'Download:',
      uploadSpeed: 'Upload:',
    },
    ratings: {
      ping: { excellent: 'Excellent', good: 'Good', fair: 'Fair', poor: 'Poor' },
      download: { excellent: 'Very Fast', good: 'Fast', fair: 'Average', poor: 'Slow' },
      upload: { good: 'Fast', fair: 'Average', poor: 'Slow' },
    },
    info: {
      title: 'Internet Speed Test',
      p1: 'A tool that measures your internet connection\'s download/upload speed and ping latency. Quickly check if your home or office line meets advertised speeds, and if online gaming or video conferencing will be smooth.',
      p2: 'Useful for remote workers, gamers, video streaming users, and network administrators. Identify the gap between ISP contracted speed and actual perceived speed.',
      p3: 'A diagnostic tool for beginners finding slow internet causes, and a first-response tool for IT staff handling incidents. Measurements are more reliable when averaged over multiple runs.',
      tip: 'This tool provides simulated results for reference only. For accurate measurements, use dedicated services like Speedtest.net or Fast.com. Results vary significantly based on measurement environment (WiFi, wired, other device usage).',
    },
    glossary: {
      ping: { term: 'Ping / Latency', desc: 'Round-trip time (ms) for data to reach the server and return. Lower values mean faster response, especially important in online games and video conferencing.' },
      mbps: { term: 'Mbps (Megabits per Second)', desc: 'Internet speed unit indicating data transferred per second. Higher numbers mean faster. 8 Mbps ≈ 1 MB/s.' },
      speeds: { term: 'Download / Upload Speed', desc: 'Download is speed receiving data from the internet; upload is speed sending data from your device. Home lines typically have faster download than upload.' },
      jitter: { term: 'Jitter', desc: 'Variation in ping latency. Lower means more stable connection; higher causes stuttering in calls and games.' },
    },
    formula: {
      ping: 'Ping Measurement',
      pingDesc: 'Sends packets to the server and measures round-trip time.',
      pingFormula: 'Ping = Round-trip Time (RTT) ÷ 2',
      download: 'Download Speed',
      downloadDesc: 'Calculates speed based on time to receive a certain amount of data.',
      downloadFormula: 'Speed (Mbps) = (Data × 8) ÷ Time (seconds) ÷ 1,000,000',
      uploadJitter: 'Upload Speed and Jitter',
      uploadFormula: 'Upload Speed = (Data Transferred × 8) ÷ Time (seconds) ÷ 1,000,000',
      jitterNote: 'Jitter is the variation in ping latency — lower is better.',
    },
    tips: {
      wired: 'Wired Connection',
      wiredTip1: 'Use an Ethernet cable to eliminate WiFi interference.',
      wiredTip2: 'Closer to the router means more stable results.',
      otherDevices: 'Other Devices',
      otherTip1: 'Stop other devices\' streaming/downloads during testing.',
      otherTip2: 'Background updates also consume speed.',
      vpn: 'VPN Disable',
      vpnTip1: 'VPN use increases latency due to encryption overhead.',
      vpnTip2: 'Disable VPN to see pure line speed.',
      repeat: 'Repeat Measurement',
      repeatTip1: 'Measure multiple times and compare average and minimum.',
      repeatTip2: 'Network congestion varies by time of day.',
      speedRef: 'Speed Reference',
      speedRefTip1: 'Web/HD 5~10 Mbps, 4K 25 Mbps, Video Conference 10~20 Mbps recommended.',
      speedRefTip2: 'Online games benefit from ping under 20 ms.',
      troubleshooting: 'Troubleshooting',
      troubleTip1: 'Restart router and check firmware first if slow.',
      troubleTip2: 'Contact ISP for line inspection if issues persist.',
    },
  },
  jsonPrettifier: {
    title: 'JSON Prettifier',
    description: 'Format minified JSON into readable, indented output',
    inputLabelMinified: 'Minified or compact JSON',
    inputLabelIndent: 'Indentation (spaces)',
    button: 'Prettify JSON',
    copyButton: 'Copy',
    emptyPrompt: 'Paste JSON and click Prettify to format it',
    invalidJson: 'Invalid JSON:',
  },
  textSummarizer: {
    title: 'Text Summarizer',
    description: 'Extract and summarize key sentences from long text',
    inputLabel: 'Enter text to summarize',
    inputPlaceholder: 'Enter text...',
    lengthLabel: 'Summary length',
    short: 'Short',
    medium: 'Medium',
    long: 'Long',
    button: 'Summarize',
    wordCount: '{original} words \u2192 {summary} words',
    reduction: '{percent}% reduction',
    copyButton: 'Copy',
    emptyPrompt: 'Enter text and click Summarize',
  },
  yamlGenerator: {
    title: 'YAML Generator',
    description: 'Generate random YAML data with custom structure',
    itemCountLabel: 'Number of items',
    keyNamesLabel: 'Key names (comma separated)',
    button: 'Generate YAML',
    copyButton: 'Copy',
    downloadButton: 'Download',
    emptyPrompt: 'Configure options and click Generate to create YAML data',
    alertMessage: 'Please enter at least one key name.',
  },
  meetingNotes: {
    title: 'Meeting Notes Generator',
    description: 'Automatically generate structured meeting notes in Markdown format',
    titleLabel: 'Meeting title',
    titlePlaceholder: 'Project team meeting',
    dateLabel: 'Meeting date',
    attendeesLabel: 'Attendees',
    attendeesPlaceholder: 'John, Jane, Alex',
    agendaLabel: 'Agenda items',
    agendaItemLabel: 'Item {n}',
    deleteButton: 'Delete',
    topicPlaceholder: 'Agenda topic',
    presenterPlaceholder: 'Presenter',
    discussionPlaceholder: 'Discussion',
    decisionPlaceholder: 'Decision',
    addAgendaButton: 'Add agenda item',
    actionLabel: 'Action items',
    actionItemLabel: 'Task {n}',
    taskPlaceholder: 'Task description',
    assigneePlaceholder: 'Assignee',
    addActionButton: 'Add action item',
    generateButton: 'Generate notes',
    copyButton: 'Copy Markdown',
    emptyPrompt: 'Enter meeting info and click Generate',
  },
  promptGenerator: {
    title: 'Prompt Generator',
    description: 'Generate effective prompts for AI tools',
    categoryLabel: 'Category',
    writing: 'Writing',
    coding: 'Coding',
    analysis: 'Analysis',
    creative: 'Creative',
    detailLabel: 'Detail level',
    basic: 'Basic',
    detailed: 'Detailed',
    veryDetailed: 'Very detailed',
    button: 'Generate prompts',
    copyAllButton: 'Copy all',
    copyButton: 'Copy',
    emptyPrompt: 'Select a category and click Generate',
  },
  xmlGenerator: {
    title: 'XML Generator',
    description: 'Generate random XML documents with custom structure',
    rootLabel: 'Root element name',
    itemLabel: 'Item element name',
    fieldLabel: 'Field names (comma separated)',
    countLabel: 'Number of items',
    button: 'Generate XML',
    copyButton: 'Copy',
    downloadButton: 'Download',
    emptyPrompt: 'Configure options and click Generate to create XML data',
    alertMessage: 'Please enter at least one field name.',
  },
  loremIpsumGenerator: {
    title: 'Lorem Ipsum Generator',
    description: 'Generate random placeholder text for design and testing',
    paragraphsLabel: 'Number of paragraphs',
    sentencesLabel: 'Sentences per paragraph',
    button: 'Generate Lorem Ipsum',
    wordCount: '{n} words',
    charCount: '{n} characters',
    paraCount: '{n} paragraphs',
    copyButton: 'Copy Text',
    emptyPrompt: 'Configure options and click Generate to create placeholder text',
  },
  jsonMinifier: {
    title: 'JSON Minifier',
    description: 'Remove whitespace and compress JSON for production use',
    inputLabel: 'Pretty or formatted JSON',
    button: 'Minify JSON',
    copyButton: 'Copy',
    sizeInfo: 'Original: {original} bytes \u2192 Minified: {minified} bytes ({percent}% saved)',
    emptyPrompt: 'Paste JSON and click Minify to compress it',
    invalidJson: 'Invalid JSON:',
  },
  morseCode: {
    title: 'Morse Code Translator',
    description: 'Convert between text and International Morse Code',
    textToMorse: 'Text \u2192 Morse',
    morseToText: 'Morse \u2192 Text',
    textInputLabel: 'Text input',
    textInputPlaceholder: 'Enter text to convert to Morse code...',
    morseInputLabel: 'Morse code (use dots, dashes, and spaces; / for word gaps)',
    morseInputPlaceholder: '. - .-. / .--. .-.. .- -. . -.-. --- -.. .',
    convertButton: 'Convert',
    playButton: 'Play Sound',
    copyButton: 'Copy Result',
    emptyPrompt: 'Enter text or Morse code and click Convert',
    statsTextToMorse: '{chars} characters \u2192 {symbols} symbols',
    statsMorseToText: '{symbols} symbols \u2192 {chars} characters',
  },
  urlEncoder: {
    title: 'URL Encoder',
    description: 'Encode special characters for safe URL transmission',
    inputLabel: 'Text or URL to encode',
    inputPlaceholder: 'e.g., https://example.com/path?name=John&age=30 or "Hello World & Special chars!"',
    encodeComponentButton: 'encodeURIComponent',
    encodeFullButton: 'encodeURI',
    button: 'Encode URL',
    copyButton: 'Copy Encoded URL',
    emptyPrompt: 'Enter text and click Encode to URL-encode it',
  },
  jsonGenerator: {
    title: 'JSON Generator',
    description: 'Generate random JSON data with custom keys and structure',
    itemCountLabel: 'Number of items',
    keyNamesLabel: 'Key names (comma separated)',
    button: 'Generate JSON',
    copyButton: 'Copy',
    downloadButton: 'Download',
    emptyPrompt: 'Configure options and click Generate to create JSON data',
    alertMessage: 'Please enter at least one key name.',
  },
  urlDecoder: {
    title: 'URL Decoder',
    description: 'Decode percent-encoded URLs back to readable text',
    inputLabel: 'URL-encoded string',
    button: 'Decode URL',
    copyButton: 'Copy Decoded URL',
    emptyPrompt: 'Enter URL-encoded string and click Decode',
    invalidUrl: 'Invalid URL encoding:',
  },
  imageResizer: {
    title: 'Image Resizer',
    description: 'Resize images to your desired dimensions',
    uploadLabel: 'Upload image',
    originalSize: 'Original: {width} x {height}',
    targetSize: 'Target size',
    maintainAspect: 'Maintain aspect ratio',
    resizeButton: 'Resize image',
    resultSize: 'Result: {width} x {height}',
    downloadButton: 'Download',
    emptyPromptResize: 'Set size and click Resize',
    emptyPromptUpload: 'Upload an image',
  },
  imageConverter: {
    title: 'Image Format Converter',
    description: 'Convert images between PNG, JPEG, and WebP formats',
    uploadLabel: 'Upload Image',
    chooseButton: 'Choose Image File',
    formatLabel: 'Output Format',
    qualityLabel: 'Quality: {quality}%',
    converting: 'Converting...',
    convertButton: 'Convert Image',
    convertedInfo: 'Converted: {size} | {format}',
    savedInfo: 'Saved: {size} ({percent}%)',
    downloadButton: 'Download Converted Image',
    originalPreview: 'Original Preview',
    emptyPrompt: 'Upload an image and click Convert to change its format',
    errorSelectFile: 'Please select a valid image file.',
    errorCanvas: 'Failed to create canvas context.',
    errorConversion: 'Conversion failed. Try a different format or lower quality.',
    errorLoad: 'Failed to load the image. The file might be corrupted.',
  },
  base64Encoder: {
    title: 'Base64 Encoder',
    description: 'Encode plain text to Base64 format',
    inputLabel: 'Plain text',
    inputPlaceholder: 'Enter text to encode...',
    button: 'Encode to Base64',
    copyButton: 'Copy Base64',
    emptyPrompt: 'Enter text and click Encode to convert to Base64',
    stats: '{chars} characters ({inputLen} \u2192 {outputLen}, {percent}% increase)',
    encodingError: 'Encoding error:',
  },
  codeExplainer: {
    title: 'Code Explainer',
    description: 'Analyze and explain code structure and elements',
    languageLabel: 'Programming language',
    codeLabel: 'Enter code',
    codePlaceholder: 'Enter code to analyze...',
    button: 'Explain code',
    copyButton: 'Copy explanation',
    emptyPrompt: 'Enter code and click Explain',
  },
  base64Decoder: {
    title: 'Base64 Decoder',
    description: 'Decode Base64 encoded strings back to plain text',
    inputLabel: 'Base64 encoded string',
    inputPlaceholder: 'Enter Base64 string to decode...',
    button: 'Decode Base64',
    copyButton: 'Copy Decoded Text',
    emptyPrompt: 'Enter Base64 string and click Decode to convert to plain text',
    invalidBase64: 'Invalid Base64:',
  },
  mortgage: {
    title: 'Mortgage Calculator',
    description:
      'Calculate your estimated monthly payment including home price, down payment, interest rate and additional costs.',
    inputs: {
      homePrice: 'Home Price',
      downPayment: 'Down Payment',
      downPaymentHint: 'Loan amount:',
      loanTerm: 'Loan Term (years)',
      annualRate: 'Annual Interest Rate (%)',
      startYear: 'Repayment Start Year',
      startMonth: 'Repayment Start Month',
      additionalCosts: 'Additional Monthly Costs (optional)',
      additionalHint:
        'Fixed monthly costs beyond principal & interest. Enter 0 if unknown.',
      propertyTax: 'Property Tax (yearly)',
      homeInsurance: 'Home Insurance (yearly)',
      pmi: 'PMI Insurance (yearly %)',
      hoa: 'HOA Fee (monthly)',
    },
    results: {
      monthlyPayment: 'Estimated Monthly Payment',
      monthlyBreakdown: 'Monthly Breakdown',
      additional: 'Additional Costs',
      principalInterest: 'Principal & Interest',
      propertyTax: 'Property Tax',
      homeInsurance: 'Home Insurance',
      pmi: 'PMI Insurance',
      hoa: 'HOA Fee',
      loanAmount: 'Loan Amount',
      downPayment: 'Down Payment',
      totalInterest: 'Total Interest',
      payoffDate: 'Payoff Date',
      principalInterestSplit: 'Principal vs Interest',
      amortizationSchedule: 'Amortization Schedule (by year)',
      year: 'Year',
      yearlyInterest: 'Yearly Interest',
      yearlyPrincipal: 'Yearly Principal',
      balance: 'Balance',
      detailAnalysis: 'Detailed Analysis',
      calculateHint: "Enter values and press 'Calculate'.",
    },
    glossary: {
      title: 'Glossary',
      downPayment:
        'Down Payment: the cash you pay upfront. A larger down payment means a smaller loan and less interest.',
      propertyTax:
        'Property Tax: an annual tax on owned real estate (based on assessed value).',
      homeInsurance:
        'Home Insurance: protects the home against fire, flood and other damage.',
      pmi:
        'PMI (Private Mortgage Insurance): required when your down payment is small relative to the loan; in Korea often taken as a "mortgage guarantee".',
      hoa:
        'HOA (Homeowners Association): fee for shared amenities in a complex — like a Korean apartment management fee.',
    },
    formula: {
      title: 'Equal Monthly Installment Formula',
      m: 'M: Monthly principal & interest payment',
      p: 'P: Loan amount (home price − down payment)',
      r: 'r: monthly interest rate (annual ÷ 12)',
      n: 'n: total number of months (term in years × 12)',
      note: 'Total monthly payment = monthly principal & interest + monthly portion of (property tax + home insurance + PMI + HOA). Payoff date is n months after the start year/month.',
    },
    tips: {
      title: 'How to use your mortgage wisely',
      items: {
        dti: {
          title: 'Check your DSR first',
          body: 'DSR (Debt Service Ratio) is your total annual loan principal & interest divided by annual income. Since mortgages are large, exceeding the limit cuts your loan cap — confirm how much you can borrow first.',
        },
        downPayment: {
          title: 'Down payment ratio is your monthly cost',
          body: 'A larger down payment lowers the borrowed principal and total interest, reducing your monthly payment. If you have the funds, raising the down payment ratio is the surest way to save on interest.',
        },
        rate: {
          title: 'Compare fixed vs variable rates',
          body: 'Fixed rates protect you when rates rise; variable rates are cheaper when they fall. Over a 30-year loan the total-interest gap from rate type is huge.',
        },
        hidden: {
          title: 'Add the hidden costs, not just principal & interest',
          body: 'Looking only at principal & interest ignores property tax, home insurance, PMI and HOA, understating your real monthly burden. This calculator’s “Monthly Payment” is the true fixed outflow including all of them.',
        },
        policy: {
          title: "Don’t miss policy mortgage products",
          body: 'Bogeumjarone, Ddimgol and Special Bogeumjarone are government-backed products offering below-market rates. Check your eligibility and compare actively.',
        },
        extra: {
          title: 'Prepay to cut interest',
          body: 'When you have spare cash, prepaying part of the principal reduces the interest for the remaining term. Most mortgages waive the prepayment fee once per year (within a total limit) — use it.',
        },
      },
    },
  },
};

export type Dictionary = typeof en;
