/**
 * Detailed features and specification tables, transcribed from the manufacturer
 * brochures in /public/brochures. Merged into PRODUCTS by id (see products.ts).
 * Setting `bro: undefined` drops the short "From the Brochure" list where the
 * detailed content below already covers it.
 */
import type { Product } from './types';

type Details = Pick<Product, 'featureList' | 'specTables' | 'bro'>;

const USG_WORKFLOW = ['Training & workflow', 'iScanHelper step-by-step guidance, Smart Vue standard-plane recognition, iWorks protocol scanning'];

export const PRODUCT_DETAILS: Record<string, Details> = {
  /* ------------------------------ IMAGING ------------------------------ */
  carm: {
    bro: undefined,
    featureList: [
      'High power output — 5 kW generator for orthopaedic, spine, vascular, urology and pain-management procedures',
      'Carbon-shielded 22 × 22 cm flat panel detector, ultra-sharp 139 µm pixel pitch',
      'Auto collimation focuses on the area of interest to reduce unnecessary exposure',
      'Automatic Brightness Stabilization (ABS) and pre-programmed imaging modes',
      '27" high-resolution monitor with live + reference split screen',
      '15" intuitive touch control panel that swivels and tilts',
      'Fully counterbalanced C-arm stays at any angle; colour-coded axes and handles',
      'DSA and roadmapping (optional) for vascular and interventional work',
      'Real-time noise reduction, 1.5K CINE recording and live-to-reference image shift',
      'Live DAP dose display with overdose warning; removable anti-scatter grid',
      'Dual footswitch, two-way laser positioning and DICOM 3.0 / PACS compatibility',
      'Standby power (UPS) — move between ORs without losing data',
    ],
    specTables: [{
      title: 'ERAY SMART 5C',
      rows: [
        ['Generator'], ['Power', '5 kW'], ['Max. voltage', '125 kV'], ['kV range', '40 – 125 kV'], ['mA in pulse fluoro', 'Max. 32 mA'], ['mA in continuous fluoroscopy', 'Max. 6.3 mA'], ['mA in digital radiography', 'Max. 100 mA'], ['Generator frequency', '50 kHz'],
        ['X-Ray Tube'], ['Type', 'Stationary anode'], ['Focal spot', '0.6 / 1.2 mm'], ['Anode heat capacity', '80 kHU'], ['Collimator', 'Fixed (standard) / Motorized (optional)'],
        ['Flat Panel Detector'], ['Technology', 'Amorphous silicon (a-Si) with CsI'], ['Size', '22 cm × 22 cm'], ['Image matrix', '1.5K × 1.5K'], ['Frame rate', '18 frames/s'], ['Pixel pitch', '139 µm'], ['AD conversion', '16 bit'],
        ['C-Arm'], ['L × W × H', '195.1 × 85.3 × 167.4 cm'], ['SID', '1100 mm'], ['Free space in arc', '880 mm'], ['Depth in arc', '710 mm'], ['Orbital rotation', '150° (+117° / −33°)'], ['Lateral rotation', '450° (+225° / −225°)'], ['Wig-wag', '30° (±15°)'], ['Horizontal travel', '200 mm'], ['Vertical travel', '400 mm (motorized)'], ['Weight', '300 kg'],
        ['Touch Control Panel'], ['Size', '15" touch screen'], ['Swivel', '360° (±180°)'], ['Tilt', '120° (+90° / −30°)'],
        ['Monitor'], ['Size', '27" high-resolution'], ['Display', 'Split screen (live + reference), anti-glare'], ['Mounting', 'Mobile monitor trolley'], ['Image matrix', '2.5K × 1.5K'],
        ['Other'], ['Exposure control', 'Wired hand switch & footswitch'], ['Laser localizer', 'Two-way laser positioning'], ['DAP', 'Available'], ['Grid', 'Yes'], ['UPS power supply', 'Yes'], ['DSA', 'Optional'], ['Roadmapping', 'Optional'], ['Image storage', '10,000 images'], ['Power supply', 'Single phase 220–240 V AC, 50 Hz; 3 m cable'], ['Voltage stabilizer', 'Available'], ['Connectivity', 'USB'],
      ],
    }],
  },

  m6: {},

  'resona-i9': {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', '23.8" bezel-less full HD on dual-wing floating arm'], ['Touch screen', '15.6" full HD'], ['Control panel', 'iConsole — full-space floating, exam-specific layout with E-ink keys'],
        ['Advanced imaging', 'Ultra Micro Angiography (UMA), UWN+ contrast (CEUS), HiFR STE elastography, HR Flow'], ['Quantification', 'Fatty liver lab (USAT), RIMT, TTQA'],
        ['Smart tools', 'Smart Breast, Smart Thyroid, Smart Bladder'], ['Transducers', 'Convex, linear, phased array, endocavity and others'],
        ['Battery', 'Up to 4 hours of scanning without power cable'], ['Noise', '26 dB super-silent design'], ['Transport', 'Folds to 1 m minimum height; fits in an MPV; flight case available'], ['Service', 'Modular design for easy maintenance'],
      ],
    }],
  },

  'nuewa-i9': {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', '23.8" bezel-less full HD on dual-wing floating arm'], ['Touch screen', '15.6" full HD'], ['Control panel', 'iConsole — full-space floating, exam-specific layout with E-ink keys'],
        ['Smart Scene 3D', 'Auto ROI, auto volume rendering, auto plane acquisition, auto measurement and analysis'], ['Advanced imaging', 'Ultra Micro Angiography (UMA), elastography, realistic 3D / 4D rendering'],
        ['Obstetric tools', 'Smart Face, Smart Planes CNS, Smart ICV, fetal heart and pulmonary vein flow'], ['Gynaecology tools', 'Smart FLC, Smart ERA, Smart Pelvic, IOTA-ADNEX, uterine elastography'],
        ['Battery', 'Up to 4 hours of scanning without power cable'], ['Noise', '26 dB super-silent design'], ['Transport', 'Folds to 1 m minimum height; fits in an MPV; flight case available'], ['Service', 'Modular design for easy maintenance'],
      ],
    }],
  },

  mx7: {
    specTables: [
      {
        title: 'System',
        rows: [
          ['Type', 'Dedicated portable ultrasound system'], ['Platform', 'ZST+ channel-data processing'], ['Weight', 'About 3 kg (main unit)'], ['Thickness', '44 mm'], ['Battery', 'Up to 8 hours'],
          ['Advanced imaging', 'UWN+ contrast imaging, Natural Touch Elastography, iNeedle+ (linear & convex)'],
          ['Cardiovascular tools', 'TTQA tissue tracking, Auto EF, Stress Echo, TDI (TVI, TEI, TVD, TVM), LVO, RIMT, R-VQS'],
        ],
      },
      {
        title: 'Transducers',
        head: ['Transducer', 'Type', 'Highlights'],
        rows: [
          ['C5-1s', '3T convex', 'High colour sensitivity, contrast imaging · biopsy kit NGB-031'],
          ['L13-3Ns', 'ComboWave linear', 'Balanced penetration & resolution, elastography · NGB-007'],
          ['L14-6Ns', 'ComboWave linear', 'High frequency, small footprint, elastography · NGB-007'],
          ['L20-5s', 'ComboWave linear', 'High frequency, high resolution, small footprint'],
          ['L9-3s', 'ComboWave linear', 'Vascular performance, elastography · NGB-034'],
          ['L16-4Hs', 'Hockey stick', 'MSK & rheumatology, elastography'],
          ['P4-2s', 'Phased array', '2.0 – 38.0 cm depth, low-MI contrast · NGB-011'],
          ['P10-4s', 'Phased array', '2.0 – 16.5 cm depth, paediatric & neonatal cardiac'],
          ['P7-3Ts', 'TEE', '1.9 – 8.2 MHz, 90° FOV, adult cardiac'],
          ['P8-3Ts', 'TEE', '2.8 – 7 MHz, 90° FOV, paediatric cardiac'],
          ['CW2s', 'Pedoff (CW)', 'Continuous-wave Doppler for TCD'],
        ],
      },
    ],
  },

  n6: {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', '21.5" full HD, adjustable view angle'], ['Touch screen', '13.3" full HD'],
        ['Transducers', 'ComboWave transducer family — convex, linear, volume, endocavity, bi-plane, phased array'],
        ['Imaging technologies', 'PSH, Glazing Flow, NTE, iClear, HR Flow, iBeam, HD-Scope, UWN+ contrast imaging'],
        ['General imaging tools', 'iTouch+, Smart HRI, Smart Bladder, Smart Calc'],
        ['Cardiovascular tools', 'RIMT, Auto EF, TDI'], ['Women’s health tools', 'Smart Face, Glazing Flow, Smart OB'],
        USG_WORKFLOW,
        ['Ergonomics', 'Rotatable control panel, adjustable height, water- and dust-proof panel, noise-reduced design, storage space'], ['Power', 'Built-in battery'],
      ],
    }],
  },

  n7: {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', '21.5" full HD on lifting monitor arm'], ['Touch screen', '13.3" full HD'],
        ['Transducers', 'ComboWave transducer family'],
        ['Imaging technologies', 'PSH, NTE, iClear, HR Flow, iBeam, HD Scope'],
        ['General imaging tools', 'iTouch+, Smart HRI, Smart Calc, NTE stiffness display'],
        ['Cardiovascular tools', 'RIMT, Auto EF, TTQA'],
        ['Women’s health tools', 'Smart Scene 3D (Smart Face, Smart Planes CNS, Smart Fetal HR), Smart FLC 2D/3D, Smart OB'],
        USG_WORKFLOW,
        ['Ergonomics', 'Rotatable control panel, lifting monitor arm, adjustable height, water- and dust-proof panel, noise-reduced design, storage space'], ['Power', 'Built-in battery'],
      ],
    }],
  },

  n8: {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', '21.5" full HD on dual-wing floating arm'], ['Touch screen', 'Up to 15.6"'],
        ['Transducers', 'Single-crystal and ComboWave transducers'],
        ['General imaging tools', 'iTouch+, Smart HRI, Smart Hip, Smart Calc, Smart Breast (ACR BI-RADS), Smart Thyroid'],
        ['Cardiovascular tools', 'RIMT, Auto EF, TTQA, R-VQS (vascular stiffness & pulse-wave velocity)'],
        ['Obstetrics & gynecology tools', 'Smart Scene 3D, Smart Face, Smart Planes CNS, Smart FLC 2D/3D, Smart OB, iLive fetal 3D'],
        USG_WORKFLOW,
        ['Ergonomics', 'Rotatable control panel, dual-wing floating arm, adjustable height, water- and dust-proof panel, low noise, storage space'], ['Power', 'Built-in battery'],
      ],
    }],
  },

  n9: {
    specTables: [{
      rows: [
        ['Platform', 'ZST+ channel-data processing'], ['Main monitor', 'Up to 23.8" full HD on dual-wing floating arm'], ['Touch screen', 'Up to 15.6"'],
        ['Transducers', 'Single-crystal and ComboWave transducers'],
        ['General imaging tools', 'iTouch+, Smart HRI, Smart Bladder, Smart Hip, Smart B-line, Smart Calc, Smart Breast (ACR BI-RADS), Smart Thyroid (ACR TI-RADS)'],
        ['Cardiovascular tools', 'RIMT, Auto EF, TTQA, R-VQS (vascular stiffness & pulse-wave velocity)'],
        ['Obstetrics & gynecology tools', 'Smart Scene 3D, Smart Face, Smart Planes CNS, Smart FLC 2D/3D, Smart OB, real-time 4D with iLive'],
        USG_WORKFLOW,
        ['Ergonomics', 'Rotatable control panel, dual-wing floating arm, adjustable height, water- and dust-proof panel, low noise, storage space'], ['Power', 'Built-in battery'],
      ],
    }],
  },

  /* ---------------------------- CRITICAL CARE --------------------------- */
  monitor: {
    bro: undefined,
    featureList: [
      'Medical-grade colour TFT display — 10.4", 12.1" or 15", optional capacitive touch screen',
      'Standard ECG, SpO₂, NIBP, temperature and respiration; EtCO₂, IBP and cardiac output on ND12 / ND15',
      '3/5/6/12-lead ECG with automatic lead recognition and Glasgow 12-lead resting ECG analysis',
      '38-type arrhythmia analysis, ST-segment and QT/QTc analysis for adult, paediatric and neonatal patients',
      'Comen, Masimo or Nellcor SpO₂ modules, with dual-SpO₂ and perfusion index',
      'Clinical assistive apps: Sepsis guide, EWS, GCS, 24-hour ECG summary and CCHD screening',
      'Drug, haemodynamic, oxygenation, ventilation and renal calculations',
      '240 hours of tabular and graphic trends, 72-hour waveform review, 48-hour arrhythmia recall',
      'Built-in Wi-Fi, HL7 and eCenter central monitoring; HIS / EMR compatible',
      'Built-in 3-channel thermal recorder',
      'Li-ion battery — up to 8 hours with the optional 5000 mAh pack',
    ],
    specTables: [
      {
        title: 'Models',
        head: ['Parameter', 'ND10', 'ND12', 'ND15'],
        rows: [
          ['Display', '10.4", 800 × 600', '12.1", 800 × 600', '15", 1024 × 768'], ['Waveforms', 'Up to 8', 'Up to 8', 'Up to 10'],
          ['Size', '300 × 210 × 189 mm', '340 × 236 × 185 mm', '394 × 280 × 189 mm'], ['Weight', '3.5 kg', '4 kg', '5 kg'],
          ['EtCO₂, IBP, cardiac output', 'Not available', 'Supported', 'Supported'],
          ['Battery runtime (2500 mAh)', '≥ 4 h', '≥ 4 h', '≥ 2.5 h'], ['Battery runtime (5000 mAh, optional)', '≥ 8 h', '≥ 8 h', '≥ 6 h'],
          ['Protection level', 'IPX1'],
        ],
      },
      {
        title: 'Key Parameters',
        rows: [
          ['ECG'], ['Lead sets', '3, 5, 6 or 12-lead, automatic recognition'], ['Heart rate', 'Adult 15–300 bpm; paediatric/neonate 15–350 bpm'], ['Arrhythmia', '38 classifications'], ['ST analysis', '−2.5 to +2.5 mV'], ['QT / QTc', '200 – 800 ms'], ['Defibrillation protection', '5000 VAC (360 J), recovery ≤ 5 s'],
          ['Respiration'], ['Method / range', 'RA–LL impedance, 0 – 200 rpm; apnea alarm 10 – 60 s'],
          ['NIBP'], ['Method / modes', 'Automatic oscillometric; manual, auto, STAT and sequence'], ['Range / accuracy', '0 – 300 mmHg, ±3 mmHg'], ['Auto interval', '1 – 720 min'],
          ['SpO₂'], ['Modules', 'Comen, Masimo or Nellcor'], ['Range / accuracy', '0 – 100%; ±2% adult/paediatric, ±3% neonate (70 – 100%)'],
          ['Temperature'], ['Channels / range', '2 channels, 0 – 50 °C, ±0.1 °C'],
          ['EtCO₂ (ND12 / ND15)'], ['Modules', 'Comen, Masimo or CapnoTrak — mainstream or sidestream'], ['Range', '0 – 150 mmHg (Comen); awRR 0 – 150 rpm'],
          ['IBP (ND12 / ND15)'], ['Channels / range', 'Up to 2 channels, −50 to 370 mmHg; PPV, SPV, PAWP'],
          ['Cardiac Output (ND12 / ND15)'], ['Method / range', 'Thermodilution, 0.1 – 20 L/min'],
          ['Data & Connectivity'], ['Trends', '240 h tabular & graphic; 3500 NIBP groups; 2500 alarm events'], ['Network', 'Wi-Fi 802.11a/b/g/n, LAN, HL7 V2.6, eCenter CMS'], ['Ports', '2 × USB 2.0, VGA, network, optional multi-function'], ['Recorder', 'Built-in thermal, 3 channels, 50 mm'],
          ['Power & Environment'], ['Power supply', '100 – 240 V, 50/60 Hz'], ['Battery', 'Li-ion 10.8 V, 2500 mAh (5000 mAh optional)'], ['Operating conditions', '5 – 40 °C, 15 – 95% RH (non-condensing)'],
        ],
      },
    ],
  },

  'monitor-npro': {
    featureList: [
      'Capacitive touch screens — 10.1", 12.1" or 15.6"',
      'Modular design: add anaesthetic gas (AG), BIS, NMT, ICG, cardiac output, IBP, EtCO₂ and O₂ as needed',
      'Masimo Rainbow SET option — SpHb, SpOC, SpCO, SpMet, PVi and RRa',
      'Respiratory mechanics monitoring (Paw, TVi / TVe)',
      '3/5/6/12-lead ECG with Glasgow 12-lead analysis, 27-type arrhythmia, ST and QT/QTc analysis',
      'Clinical assistive apps: Sepsis guide, EWS, GCS, 24-hour ECG summary and CCHD',
      'Up to 2400 hours of trends (optional) and full-disclosure review',
      'Built-in Wi-Fi, HL7 and central monitoring; HIS / EMR compatible',
      'Built-in 3-channel thermal recorder',
      'Li-ion battery — N15M Pro up to 9 hours with two batteries',
    ],
    specTables: [
      {
        title: 'Models',
        head: ['Parameter', 'N10M Pro', 'N12M Pro', 'N15M Pro'],
        rows: [
          ['Display', '10.1", 1280 × 800', '12.1", 1280 × 800', '15.6", 1366 × 768'], ['Waveforms', 'Up to 8', 'Up to 10', 'Up to 12'],
          ['Size', '261 × 247 × 181 mm', '308 × 282 × 185 mm', '460.5 × 351 × 202.5 mm'], ['Weight', '3.87 kg', '4.06 kg', '5.10 kg'],
          ['Battery (standard)', '10.8 V / 2500 mAh', '10.8 V / 2500 mAh', '10.8 V / 5000 mAh'], ['Runtime, standard battery', '≥ 3 h', '≥ 2 h', '≥ 4.5 h'], ['Runtime, 5000 mAh / two batteries', '≥ 6 h', '≥ 4.5 h', '≥ 9 h (two batteries)'],
          ['Touch screen', 'Capacitive'],
        ],
      },
      {
        title: 'Parameters & Modules',
        rows: [
          ['Standard'], ['ECG', '3, 5, 6 or 12-lead; 27-type arrhythmia; ST and QT/QTc analysis; Glasgow 12-lead algorithm'], ['Respiration', 'Impedance, 0 – 200 rpm'], ['NIBP', 'Comen or Suntech; 0 – 300 mmHg, ±3 mmHg'], ['SpO₂', 'Comen, Masimo or Nellcor; 0 – 100%'], ['Temperature', 'Dual channel, 0 – 50 °C'],
          ['Optional Modules'], ['EtCO₂', 'Comen, Masimo or Respironics — mainstream or sidestream'], ['IBP', '−50 to 370 mmHg; PPV, SPV, PAWP'], ['Cardiac output', 'Thermodilution, 0.1 – 20 L/min'], ['ICG', 'Impedance cardiography — ACI, VI, PEP, LVET, TFI, C.O.'],
          ['Anaesthetic gas (AG)', 'CO₂, N₂O, O₂ and agents; auto identification, MAC; two mixed agents'], ['BIS', 'Bispectral index 0 – 100, SQI, DSA trend'], ['NMT', 'Acceleromyography; TOF, PTC, ST, DBS and tetanus modes'],
          ['Masimo Rainbow SET', 'SpHb, SpOC, SpCO, SpMet, RRa, PI, PVi'], ['Respiratory mechanics', 'Paw −20 to 100 cmH₂O, TVi / TVe, awRR'], ['O₂', '0 – 100%, ±1%'],
          ['Data & Power'], ['Trends', '120 h standard; 240 h and 2400 h (10-min) optional'], ['Network', 'Wi-Fi 802.11a/b/g/n, LAN, HL7'], ['Recorder', 'Built-in thermal, 3 channels'], ['Power supply', '100 – 240 V, 50/60 Hz'], ['Operating conditions', '5 – 40 °C, 15 – 93% RH (non-condensing)'],
        ],
      },
    ],
  },

  s5: {
    featureList: [
      '4-in-1: manual defibrillation, AED, pacing and monitoring',
      'Manual synchronous cardioversion and asynchronous defibrillation',
      'AED mode with patented analysis algorithm and voice guidance for BLS',
      'Non-invasive pacing — demand and fixed modes',
      '5-lead ECG standard; optional SpO₂, NIBP, PR and EtCO₂',
      'Biphasic Truncated Exponential (BTE) waveform with automatic impedance compensation',
      'Up to 360 J energy for high-impedance patients',
      'Charges to 200 J and shocks in 3 seconds; one knob, three steps: select, charge, shock',
      'Multifunction paddles for adults and children',
      'EN 1789 certified for ambulance use; IP44; from 5.6 kg',
      'Fast-charging battery — up to 210 maximum-energy discharges',
    ],
    specTables: [{
      title: 'Key Specifications — S5',
      rows: [
        ['Functions', 'Manual defibrillation, AED, pacing, monitoring'], ['Waveform', 'Biphasic Truncated Exponential (BTE), automatic impedance compensation'], ['Maximum energy', '360 J'], ['Charge time', '200 J in 3 seconds'],
        ['Pacing', 'Demand and fixed mode, non-invasive'], ['Monitoring', '5-lead ECG standard; SpO₂, NIBP, PR, EtCO₂ optional'], ['Paddles', 'Multifunction, adult and paediatric'],
        ['Weight', 'From 5.6 kg'], ['Protection', 'IP44'], ['Certification', 'EN 1789 (ambulance)'], ['Battery', 'Two capacities; up to 210 maximum-energy discharges; fast charging'],
      ],
    }],
  },

  cm1200a: {
    featureList: [
      '12-lead acquisition with 12 ECG waveforms recorded simultaneously',
      '8.4" LED touch screen with on-screen grid and 1:1 diagnosis display',
      'Manual, auto and rhythm working modes',
      'Print formats 12 × 1, 6 × 2 + 1R and 3 × 4 + 1R, with average template',
      '210 mm and 216 mm roll or Z-fold paper; A4 printing over USB without a computer',
      'Alphanumeric keyboard and multi-language operation',
      'Stores 300 ECG records; optional SD card holds 40,000 cases',
      'USB data transfer, PC-ECG software support and external printer connection',
      'AC / DC power with built-in battery for up to 4 hours',
    ],
    specTables: [{
      title: 'Key Specifications — CM1200A',
      rows: [
        ['Channels', '12-channel, simultaneous 12-lead acquisition'], ['Display', '8.4" LED touch screen'], ['Working modes', 'Manual, auto, rhythm'],
        ['Print formats', '12 × 1, 6 × 2 + 1R, 3 × 4 + 1R; average template'], ['Paper', '210 mm / 216 mm roll and Z-fold; A4 via USB printer'], ['Storage', '300 records internal; up to 40,000 cases on optional SD card'],
        ['Connectivity', 'USB, PC-ECG software, external printer'], ['Input', 'Alphanumeric keyboard; multi-language'], ['Power', 'AC / DC; built-in battery up to 4 hours'],
      ],
    }],
  },

  v3: {
    bro: undefined,
    featureList: [
      'Up to 12 ventilation modes, including advanced VS and PSV-S/T',
      'Invasive, non-invasive (NIV) and high-flow oxygen therapy (HFNC) in one ventilator',
      'Tidal volume 20 – 2200 ml — infant to adult patients',
      'Built-in high-performance turbine — no compressed medical air required',
      'Lightweight (about 10 kg) with up to 5 hours of battery; mounts on a trolley or transport bed',
      '12" flippable capacitive touch screen with integrated navigation knob',
      'IntelliSynTec automatic expiratory-trigger adjustment and ATRC tube-resistance compensation',
      'Dynamic lung view showing compliance, resistance and patient triggering in real time',
      'Weaning indicators (P0.1, NIF, RSBI), P-V tool for best PEEP, lung recruitment and sigh function',
      'Tool-free, 2-step detachable, autoclavable expiratory valve',
    ],
    specTables: [{
      title: 'Key Specifications',
      rows: [
        ['Ventilation modes', 'V-A/C, P-A/C, V-SIMV, P-SIMV, CPAP/PSV, DuoVent, APRV, PRVC-SIMV, PRVC, VS, PSV-S/T, Manual'],
        ['Therapy types', 'Invasive, non-invasive, HFNC oxygen therapy'], ['Patient types', 'Adult and paediatric'], ['Tidal volume', '20 – 2200 ml'],
        ['Gas source', 'Internal turbine, up to 210 L/min; 20,000-hour turbine life'], ['Display', '12" capacitive touch screen, flippable'], ['Weight', 'About 10 kg'], ['Battery', 'Up to 5 hours'],
        ['Expiratory valve', 'Tool-free, 2-step detachable, autoclavable'], ['Monitoring tools', 'Dynamic lung, P0.1, NIF, RSBI, P-V tool'], ['Mounting', 'Trolley or transport bed'],
      ],
    }],
  },

  /* -------------------------- OPERATION THEATRE ------------------------- */
  a700: {
    bro: undefined,
    featureList: [
      '12.1" four-way rotating touch screen; maximum 2-level menu for every operation',
      'Real-time airway pressure, flow, volume, compliance and resistance with P-V, F-V and P-F loops',
      'SIMV, SIMV + PS and pressure support ventilation with apnea backup; electronic PEEP',
      'Minimum tidal volume down to 5 ml — neonates to adults',
      'Dual high-precision flow sensors (7%) monitor inspiration and expiration',
      'Automatic compensation for fresh-gas flow, system compliance and leakage',
      'Breathing-circuit leakage below 65 ml/min for low-flow anaesthesia',
      'Anaesthetic gas monitoring with automatic agent identification and MAC (optional AG / EtCO₂ / BIS modules)',
      'PPSU breathing circuit, autoclavable at 134 °C; built-in heater prevents condensation',
      'CO₂ bypass and one-hand soda-lime canister — change during surgery without leakage',
      'Electronic flow meter with backlight; 60-hour trends and 2000 event records',
      'Options: AGSS, ACGO, GCX bracket, Comen modular monitor; central brake on AX-700',
    ],
    specTables: [{
      title: 'Key Specifications — AX-600 / AX-700',
      rows: [
        ['Display', '12.1" four-way rotating touch screen'], ['Ventilation', 'SIMV, SIMV + PS, PSV with apnea backup, electronic PEEP'], ['Minimum tidal volume', '5 ml'], ['Flow sensors', 'Dual high-precision (7%), inspiration & expiration'],
        ['Valve', 'NORGREN digital proportional valve, closed-loop control'], ['Compensation', 'Fresh-gas flow, compliance and leakage'], ['Circuit leakage', '< 65 ml/min'],
        ['Breathing system', 'Closed and semi-closed; PPSU, autoclavable at 134 °C; built-in heater; CO₂ bypass'], ['Gas monitoring', 'AG, EtCO₂, BIS modules (optional); auto agent ID & MAC'],
        ['Data', '60-hour trends; 2000 event records'], ['Workbench', '1170 cm²; adjustable deck light; lockable rotating drawer'],
        ['Quick O₂', 'Pressure on vaporizer < 1.6 kPa during O₂ flush'], ['Options', 'AGSS, ACGO, auxiliary O₂, GCX bracket, central brake (AX-700)'],
      ],
    }],
  },

  a7: {
    featureList: [
      'Ventilation modes: VCV, PCV, SIMV-VC, SIMV-PC, PSV / CPAP, PRVC, SIMV-PRVC and PSVPro',
      'PSVPro — smarter, more efficient pressure support for the patient',
      'Highly integrated, low-resistance breathing circuit with fresh-gas compensation for adults and children',
      'Fast-relief APL valve in manual mode; bypass lets the circuit be changed during surgery without leakage',
      'Three-slot modular design: AG + O₂, AG, BIS, CO and NMT monitoring',
      'Automatic anaesthetic-agent identification with synchronised values and waveforms',
      '8.4" touch screen showing up to five waveforms, with smart pulmonary loops',
      '2000 setting logs and 60 hours of data review; connects to AIMS',
      'Backup battery up to 6 hours',
      'Dual-channel mechanical flowmeter, 0 – 15 L/min',
      'ACGO, AGSS, O₂ flush and GCX mounting rail; three-drawer storage',
    ],
    specTables: [{
      title: 'Key Specifications — A7',
      rows: [
        ['Ventilation modes', 'VCV, PCV, SIMV-VC, SIMV-PC, PSV / CPAP, PRVC, SIMV-PRVC, PSVPro'], ['Patients', 'Adult and paediatric'], ['Display', '8.4" touch screen, up to 5 waveforms'],
        ['Monitoring modules', '3 slots — AG + O₂, AG, BIS, CO, NMT'], ['Flowmeter', 'Dual-channel mechanical, 0 – 15 L/min'], ['Data', '2000 setting logs; 60-hour review; AIMS connectivity'],
        ['Backup battery', 'Up to 6 hours'], ['Options', 'ACGO, AGSS, O₂ flush, GCX rail, Comen patient monitor'], ['Storage', 'Three drawers'],
      ],
    }],
  },

  ax800: {
    featureList: [
      '15" four-way rotating touch screen',
      'NORGREN (UK) digital proportional valve — 5 ms response, airflow up to 120 L/min, closed-loop control',
      'Minimum tidal volume 5 ml (PCV) — neonates to adults',
      'SIMV, SIMV + PS, pressure support with apnea backup and electronic PEEP',
      'Dual high-precision (7%) flow sensors on inspiration and expiration',
      'Automatic compensation for fresh-gas flow, system compliance and leakage; circuit leakage below 65 ml/min',
      'Dräger Vapor 2000 vaporizers with automatic temperature, pressure and volume compensation',
      'Solvay PPSU breathing circuit — autoclavable at 134 °C, 1000+ sterilisation cycles; built-in heater',
      'Saint-Gobain breathing tubes, LEGRIS quick connectors and STEINCO castors with central brake',
      'Modular AG, EtCO₂ and BIS monitoring; backlit electronic flow meter',
      'AGSS, ACGO, auxiliary O₂, adjustable deck light and 1170 cm² workbench',
    ],
    specTables: [{
      title: 'Key Specifications — AX-800',
      rows: [
        ['Display', '15" four-way rotating touch screen'], ['Ventilation', 'SIMV, SIMV + PS, PSV with apnea backup, electronic PEEP'], ['Minimum tidal volume', '5 ml (PCV)'],
        ['Proportional valve', 'NORGREN, 5 ms response, up to 120 L/min'], ['Flow sensors', 'Dual high-precision (7%)'], ['Circuit leakage', '< 65 ml/min'], ['Vaporizer', 'Dräger Vapor 2000 (300 ml capacity)'],
        ['Breathing system', 'Closed / semi-closed; PPSU, autoclavable at 134 °C; built-in heater; CO₂ bypass'], ['Gas monitoring', 'Modular AG, EtCO₂, BIS; auto agent ID & MAC'],
        ['Data', '60-hour trends; 2000 event records'], ['Castors', 'STEINCO with central brake'], ['Options', 'AGSS, ACGO, auxiliary O₂, GCX bracket, Comen C90 monitor'],
      ],
    }],
  },

  ax900: {
    featureList: [
      'Electronic fresh-gas control on a dedicated 8" touch screen — set O₂ concentration directly',
      'Best Flow indicator tool and real-time balance-gas correction',
      'Pneumatic-drive, electronic-control ventilator with classic ascending bellows',
      'Control modes VCV, PCV and PRVC; SIMV-VC, SIMV-PC and SIMV-PRVC; CPAP / PSV and PSVPro',
      'Intelligent SIMV-PRVC for faster, smoother weaning',
      'Tidal volume from 5 ml (PCV, infants) up to 1500 ml; tidal-volume error under 5 ml',
      'Circuit leakage below 65 ml/min; PEEP for lung protection and recruitment',
      'Auxiliary gas supply for non-pure-oxygen delivery and high-pressure jet ventilation',
      'Power-on self-test and leak test, shutdown delay and risk-operation reminders',
      'Soda-lime consumption and anaesthetic-agent usage statistics for quality control',
      'Electronic gas-source pressure gauge',
    ],
    specTables: [{
      title: 'Key Specifications — AX-900',
      rows: [
        ['Fresh-gas control', 'Electronic, closed-loop; 8" touch screen; direct O₂ setting; Best Flow indicator'], ['Ventilator drive', 'Pneumatic drive, electronic control; ascending bellows'],
        ['Ventilation modes', 'VCV, PCV, PRVC, SIMV-VC, SIMV-PC, SIMV-PRVC, CPAP / PSV, PSVPro'], ['Tidal volume', '5 ml (PCV) to 1500 ml; error < 5 ml'], ['Circuit leakage', '< 65 ml/min'],
        ['Safety', 'Self-test & leak test, shutdown delay, risk-operation reminders'], ['Quality control', 'Soda-lime consumption and agent usage statistics'], ['Auxiliary supply', 'Non-pure O₂ supply and high-pressure jet ventilation'],
      ],
    }],
  },

  /* -------------------------- HOSPITAL FURNITURE ------------------------- */
  otlight: {
    specTables: [{
      head: ['Parameter', 'OT-103', 'OT-104', 'OT-105', 'OT-106'],
      rows: [
        ['Type', 'Double dome ceiling LED (4 + 4)', 'Double dome ceiling LED', 'Single dome ceiling LED', 'Examination light (mobile)'],
        ['Intensity', '1,20,000 + 1,20,000 lux', '1,50,000 + 1,50,000 lux', '1,50,000 lux', '60,000 lux'],
        ['Spot diameter', '100 – 150 mm', '100 – 150 mm', '100 – 150 mm', '100 – 120 mm'], ['Depth of illumination', '10 – 15 cm', '10 – 15 cm', '10 – 15 cm', '10 – 12 cm'],
        ['Colour temperature', '4300 – 5200 K', '4300 – 5200 K', '4300 – 5200 K', '3800 – 4500 K'], ['Colour rendering index', '95 Ra', '95 Ra', '95 Ra', '91 Ra'],
        ['Focusing', 'Adjustable', 'Fixed', 'Adjustable', 'Fixed'], ['Number of LEDs', '76 + 76', '54 + 54', '95', '19 or 21'], ['Light diameter', '650 mm', '550 mm', '650 mm', '160 mm'],
        ['Intensity control', '10 – 99 digital touch', '10 – 99 digital touch', '10 – 99 digital touch', '1 – 9 digital touch'], ['Power consumption', '80 + 80 W', '60 W', '100 W', '20 W'],
        ['Special function', 'Remote operated', 'Remote operated', 'Remote operated', 'Yellow & white LED combination'],
        ['LED average life', '> 50,000 hours'], ['Power supply', '220 V / 50 Hz AC, DC 24 V drive'],
      ],
    }],
  },

  ottable: {
    specTables: [{
      rows: [
        ['Movements', 'Trendelenburg / reverse Trendelenburg, left / right tilt, back up / down, leg up / down, elevator up / down'],
        ['Accessories', 'Lithotomy leg supports, arm boards, shoulder and body supports, anaesthesia screen'],
      ],
    }],
  },

  icubed: {
    specTables: [{
      rows: [
        ['Mattress platform', 'Four-section MS'], ['Adjustments', 'Backrest, knee rest, Trendelenburg / reverse Trendelenburg and height — motorized (S101) or manual crank (S102, S103)'],
        ['Side rails', 'ABS moulded split-type safety side rails (swing type)'], ['Head & foot panels', 'ABS moulded, removable without tools'], ['Castors', '125 mm single-wheel synthetic body with diagonal locking'],
        ['Size', '80" (L) × 36" (W); height range 20" – 36"'], ['Frame', 'Mild steel, pre-treated and epoxy powder coated'],
        ['Optional', 'SS heavy-duty IV rod (two hooks, four-side fixing), SS collapsible side rails, SS head & foot bows'],
      ],
    }],
  },

  hospbed: {
    specTables: [{
      head: ['Model', 'Size (L × W × H)', 'Key features'],
      rows: [
        ['S104 Fowler bed (deluxe)', '80" × 36" × 24"', 'Manual key-operated backrest & knee rest; ABS head & foot panels; 100 mm castors with diagonal locking'],
        ['S105 Fowler bed', '80" × 36" × 24"', 'Manual key-operated backrest & knee rest; S.S. / M.S. head & foot panels'],
        ['S106 Semi-Fowler bed (deluxe)', '77" × 36" × 24"', 'Manual backrest; ABS panels; 100 mm castors; single-section platform'],
        ['S107 Semi-Fowler bed', '77" × 36" × 24"', 'Manual backrest; S.S. / M.S. panels; single-section platform'],
        ['S108 Plain bed (premium)', '72" × 36" × 24"', 'ABS head & foot panels; urine bag holder'],
        ['S109 Plain bed', '72" × 36" × 24"', 'S.S. / M.S. panels; urine bag holder'],
        ['S110 Paediatric bed (deluxe)', '60" × 30" × 24"', 'Manual backrest; S.S. telescopic collapsible side rails; urine bag holder'],
        ['S111 Paediatric bed', '60" × 30" × 24"', 'CRCA sheet top; two-side full-length detachable rails'],
        ['S112 Reclining chair cum attendant bed', '30" – 72" × 24" × 18"', 'CRCA top with tubular frame; fixed upholstered top'],
        ['S113 Attendant bed', '72" × 24" × 18"', 'S.S. / M.S. head & foot panels; single-section platform'],
        ['S114 Labour bed', '—', '530 mm minimum height; central-locking castors; removable leg section; height-adjustable lithotomy crutches'],
        ['S115 Labour table', '—', 'Backrest on ratchet; Trendelenburg on screw; U-notch with bowl; sliding foot end; 35 mm mattress'],
        ['All beds', '—', 'Mild steel frame, pre-treated and epoxy powder coated; optional SS IV rod and SS collapsible side rails'],
      ],
    }],
  },

  stretcher: {
    specTables: [{
      title: 'S301 — Emergency & Recovery Trolley',
      rows: [
        ['Top', 'Two-section, with removable X-ray-permeable stretcher'], ['Height adjustment', 'Smooth crank mechanism'], ['Backrest', 'Raised on ratchet'],
        ['Castors', '125 mm synthetic body — two with brakes, two without'], ['Safety', 'Push-pull handle, safety belts, swing-away side rails'], ['Finish', 'Pre-treated, epoxy powder coated'],
        ['Supply', 'Semi knock-down'], ['Optional', 'Stainless steel IV pole with provision at 4 positions'],
      ],
    }],
  },

  /* ------------------------------ ENDOSCOPY ----------------------------- */
  x2200: {
    featureList: [
      'Compact, one-stop HD video system with integrated 2-LED light source',
      'White light, enhanced white light and SFI / VIST chromoendoscopy for clearer mucosa and vessels',
      '1080p output (2 × DVI, 2 × SDI) and up to 2× digital zoom',
      'All essential settings on the front control panel; data saved to external USB storage',
      '2200 series scopes with upgraded tubing for patient and operator comfort',
      'One-step, fully waterproof scope connection with hot plugging',
      'Water-jet on every scope; long-life LED lighting',
    ],
    specTables: [
      {
        title: 'X-2200 Pro Video System Center',
        rows: [
          ['Video output', '1080p, 2 × DVI, 2 × SDI'], ['Light modes', 'WL, eWL, SFI / VIST chromoendoscopy'], ['Main lamp', 'White LED 70 W, blue-violet LED 130 W'], ['Digital zoom', 'Up to 2.0×'], ['IRIS', 'Peak / Average / Auto'],
          ['Colour adjustment', 'Red, blue, chroma (±8 levels)'], ['Brightness', 'Auto / manual, 1 – 19 levels'], ['Image enhancement', '1 – 3 levels, 0 – 8 steps per level'], ['White balance', 'Auto-saved'], ['Air feeding', '4 levels (Off / L / M / H)'],
          ['Transillumination', '6 – 8 seconds'], ['Freeze', 'Scope button, keyboard, footswitch or front-panel SNAP'], ['Data management', 'External USB disk'], ['Hot plugging', 'Yes'], ['Dimensions / weight', '491 × 376 × 179 mm / 15.5 kg'],
        ],
      },
      {
        title: '2200 Series Video Scopes',
        head: ['Parameter', 'EG-2200 (gastroscope)', 'EC-2200 (colonoscope)', 'EC-2200L (colonoscope)'],
        rows: [
          ['Field of view', '140°'], ['Depth of view', '3 – 100 mm'], ['Distal-end diameter', '9.3 mm', '12.0 mm', '12.0 mm'], ['Insertion tube diameter', '9.3 mm', '12.5 mm', '12.5 mm'], ['Instrument channel', '2.8 mm', '3.8 mm', '3.8 mm'],
          ['Angulation', 'Up 210°, down 90°, L/R 100°', 'Up/down 180°, L/R 160°', 'Up/down 180°, L/R 160°'], ['Working length', '1050 mm', '1350 mm', '1700 mm'], ['Total length', '1400 mm', '1700 mm', '2050 mm'],
          ['Water-jet', 'Yes'], ['Connection', 'One-step, waterproof'],
        ],
      },
    ],
  },

  hd500: {
    bro: undefined,
    featureList: [
      'HD-500 image processor with VLS-50D 2-LED light source (white LED 70 W, violet LED 50 W)',
      'VIST chromoendoscopy for better contrast of mucosa and blood vessels at the touch of a button',
      'Bright far-field images in both white-light and VIST modes',
      'Built-in workstation with 500 GB storage, DICOM, patient database and report printing — no external software needed',
      '500 series CMOS scopes with multi-stage colour, edge and structure enhancement',
      'Ergonomic scope handle, short bending radius and gradual stiffness for smoother insertion',
      'Water-jet on every scope; large instrument channels for therapeutic work',
      'LED light source rated for 10,000+ hours — lower maintenance cost',
    ],
    specTables: [
      {
        title: 'HD-500 Image Processor',
        rows: [
          ['Video output', 'SDI, DVI, VGA, CVBS, S-video'], ['Resolution', '960p'], ['Digital zoom', '1.4×, 1.6×, 1.8×'], ['Patient data', '≥ 10,000 records'], ['IRIS', 'Peak / Average / Auto'],
          ['Colour adjustment', 'Red, blue, chroma, ±15 levels'], ['Air feeding', '4 levels (Off / L / M / H)'], ['AGC', 'Yes'], ['Data management', '500 GB built-in, 4 × USB, DICOM'], ['White balance', 'Auto-saved'],
          ['Image enhancement', 'Structure and edge enhancement'], ['Contrast / denoise', 'L / M / H, auto-denoise'], ['Dimensions', '480 × 370 × 125 mm'],
        ],
      },
      {
        title: 'VLS-50D Light Source',
        rows: [
          ['Main lamp', 'White LED 70 W, violet LED 50 W'], ['White-light mode', 'High colour rendering and luminous flux'], ['VIST chromoendoscopy', 'Versatile Intelligent Staining Technology'], ['Brightness', 'Auto / manual, 1 – 19 levels'],
          ['Transillumination', '6 – 8 seconds'], ['Service life', '10,000 hours (continuous use)'], ['Hot plugging', 'Yes'], ['Dimensions', '473 × 370 × 154 mm'],
        ],
      },
      {
        title: '500 Series Scopes',
        head: ['Parameter', 'EG-500', 'EG-500L', 'EC-500', 'EC-500T', 'EC-500L', 'EC-500L/T'],
        rows: [
          ['Type', 'Gastroscope', 'Gastroscope', 'Colonoscope', 'Colonoscope', 'Colonoscope', 'Colonoscope'],
          ['Field of view', '140°'], ['Depth of view', '3 – 100 mm'],
          ['Distal-end diameter', '9.3 mm', '9.8 mm', '12 mm', '12 mm', '12.9 mm', '12.9 mm'],
          ['Insertion diameter', '9.3 mm', '9.8 mm', '12.5 mm', '12.5 mm', '12.9 mm', '12.9 mm'],
          ['Instrument channel', '2.8 mm', '3.2 mm', '3.8 mm', '3.8 mm', '4.2 mm', '4.2 mm'],
          ['Angulation', 'U 210°, D 90°, L/R 100°', 'U 210°, D 90°, L/R 100°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°'],
          ['Working length', '1050 mm', '1050 mm', '1350 mm', '1700 mm', '1350 mm', '1700 mm'],
          ['Water-jet', 'Yes'],
        ],
      },
    ],
  },

  hd510: {
    featureList: [
      'Full HD 1080p processor — up to 2 MP clarity with 550 series CMOS scopes',
      'Multi-mode chromoendoscopy at one touch: white light, SFI (vascular) and VIST (mucosal and vascular)',
      'VLS-50T 2-LED light source — 10,000-hour life, balanced brightness with minimal light loss',
      'Built-in workstation with 500 GB storage: capture images and video, create and edit reports',
      'Compatible with both 500 and 550 series CMOS scopes',
      'Ergonomic scope handle, short bending radius and large instrument channel',
      'Water-jet on every scope',
      'One-Touch hot-plug connection and fully waterproof 550 series scopes',
    ],
    specTables: [
      {
        title: 'HD-510 Video Processor',
        rows: [
          ['Station', 'Separated'], ['Video output', 'SDI, DVI, VGA, CVBS, S-video'], ['Resolution', '1080p'], ['Chromoendoscopy', 'SFI / VIST'], ['Digital zoom', '1.4×, 1.6×, 1.8×'], ['Patient data', '≥ 10,000 records'],
          ['IRIS', 'Peak / Average / Auto'], ['Colour adjustment', 'Red, blue, chroma, ±15 levels'], ['Air feeding', '4 levels (Off / L / M / H)'], ['AGC', 'Yes'], ['Data management', '500 GB built-in, 5 × USB'], ['White balance', 'Auto-saved'],
          ['Image enhancement', 'Structure and edge enhancement'], ['Contrast / denoise', 'L / M / H, auto-denoise'], ['Dimensions', '480 × 370 × 125 mm'],
        ],
      },
      {
        title: 'VLS-50T Light Source',
        rows: [['Main lamp', 'White LED + violet LED'], ['White-light mode', 'High colour rendering and luminous flux'], ['SFI / VIST', 'High brightness and specific spectra in both special light modes'], ['Brightness', 'Auto / manual, 1 – 19 levels'], ['Transillumination', '6 – 8 seconds'], ['Service life', '10,000 hours (continuous use)'], ['Hot plugging', 'Yes'], ['Dimensions', '473 × 370 × 154 mm']],
      },
      {
        title: '500 & 550 Series Scopes',
        head: ['Parameter', 'EG-500 / EG-550', 'EG-500L / EG-550L', 'EC-500 / EC-550', 'EC-500T / EC-550T', 'EC-500L / EC-550L', 'EC-500L/T / EC-550L/T'],
        rows: [
          ['Type', 'Gastroscope', 'Gastroscope', 'Colonoscope', 'Colonoscope', 'Colonoscope', 'Colonoscope'], ['Field of view', '140°'], ['Depth of view', '3 – 100 mm'],
          ['Distal-end diameter', '9.3 mm', '9.8 mm', '12 mm', '12 mm', '12.9 mm', '12.9 mm'], ['Insertion diameter', '9.3 mm', '9.8 mm', '12.5 mm', '12.5 mm', '12.9 mm', '12.9 mm'], ['Instrument channel', '2.8 mm', '3.2 mm', '3.8 mm', '3.8 mm', '4.2 mm', '4.2 mm'],
          ['Angulation', 'U 210°, D 90°, L/R 100°', 'U 210°, D 90°, L/R 100°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°'], ['Working length', '1050 mm', '1050 mm', '1350 mm', '1700 mm', '1350 mm', '1700 mm'],
          ['Water-jet', 'Yes'], ['One-Touch connection', '550 series only'], ['Optical fibre transmission', '550 series only'],
        ],
      },
    ],
  },

  hd550: {
    featureList: [
      'Full HD 1080p imaging under all light modes',
      'VLS-55 4-LED light source for multi-spectrum, multi-mode imaging with superior brightness',
      'White light for routine observation, SFI (normal focus) for lesion detection and VIST (near focus) for characterisation',
      'Extended LED life — 10,000 hours of continuous use',
      'Upgraded 550 series scope tubing and lightweight handle for comfort in long procedures',
      'Short bending radius, large field of view, water-jet and generous instrument channel',
      'One-Touch connection and real waterproof scopes for easy cleaning and disinfection',
      'Built-in 500 GB workstation with DICOM',
    ],
    specTables: [
      {
        title: 'HD-550 Video Processor',
        rows: [
          ['Station', 'Separated'], ['Video output', 'SDI, DVI, VGA, CVBS, S-video'], ['Resolution', '1080p'], ['Chromoendoscopy', 'SFI / VIST'], ['Digital zoom', '1.4×, 1.6×, 1.8×'], ['Patient data', '≥ 10,000 records'],
          ['IRIS', 'Peak / Average / Auto'], ['Colour adjustment', 'Red, blue, chroma, ±15 levels'], ['Air feeding', '4 levels (Off / L / M / H)'], ['AGC', 'Yes'], ['Data management', '500 GB built-in, 5 × USB, DICOM'], ['White balance', 'Auto-saved'],
          ['Image enhancement', 'Structure and edge enhancement'], ['Contrast / denoise', 'L / M / H, auto-denoise'], ['Dimensions', '480 × 370 × 125 mm'],
        ],
      },
      {
        title: 'VLS-55 Light Source',
        rows: [['Main lamp', 'Four LED lamps of different colours'], ['White-light mode', 'High colour rendering and luminous flux'], ['SFI / VIST', 'High brightness and specific spectra in both special light modes'], ['Brightness', 'Auto / manual, 1 – 19 levels'], ['Transillumination', '6 – 8 seconds'], ['Service life', '10,000 hours (continuous use)'], ['Hot plugging', 'Yes'], ['Dimensions', '473 × 370 × 154 mm']],
      },
      {
        title: '550 Series Scopes',
        head: ['Parameter', 'EG-550', 'EG-550L', 'EC-550', 'EC-550T', 'EC-550L', 'EC-550L/T'],
        rows: [
          ['Type', 'Gastroscope', 'Gastroscope', 'Colonoscope', 'Colonoscope', 'Colonoscope', 'Colonoscope'], ['Field of view', '140°'], ['Depth of view', '3 – 100 mm'],
          ['Distal-end diameter', '9.3 mm', '9.8 mm', '12 mm', '12 mm', '12.9 mm', '12.9 mm'], ['Insertion diameter', '9.3 mm', '9.8 mm', '12.5 mm', '12.5 mm', '12.9 mm', '12.9 mm'], ['Instrument channel', '2.8 mm', '3.2 mm', '3.8 mm', '3.8 mm', '4.2 mm', '4.2 mm'],
          ['Angulation', 'U 210°, D 90°, L/R 100°', 'U 210°, D 90°, L/R 100°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°', 'U/D 180°, L/R 160°'], ['Working length', '1050 mm', '1050 mm', '1350 mm', '1700 mm', '1350 mm', '1700 mm'],
          ['Water-jet', 'Yes'], ['One-Touch connection', 'Yes'], ['Optical fibre transmission', 'Yes'],
        ],
      },
    ],
  },

  /* ----------------------------- LAPAROSCOPY ---------------------------- */
  x2600: {
    featureList: [
      'Integrated HD video system centre compatible with flexible, rigid and fibre scopes',
      'Automatically identifies the connected scope type and switches to the matching interface',
      '2-LED light source rated for 50,000+ hours — brighter images with minimal light loss',
      'Full HD 1080p output with up to 4× digital zoom',
      'SFI / VIST chromoendoscopy and CHb haemoglobin enhancement',
      '8" touch screen with tactile control panel and one-tap screen lock',
      'Four lightweight camera heads with universal coupling for rigid and fibre scopes',
      'X20 series flexible scopes for gastroenterology, pulmonology, urology and surgery',
      'Picture-by-picture (PBP), one-step connection and hot plugging',
    ],
    specTables: [
      {
        title: 'X-2600 Integrated Endoscopy Video System Centre',
        rows: [
          ['Video output', '1080p, 2 × DVI, 2 × SDI'], ['Light source', '2-LED, ≥ 50,000 hours'], ['User interface', '8" touch screen'], ['Storage', 'Picture / video recording to portable USB memory'], ['Digital zoom', 'Up to 4.0×'],
          ['White balance', 'Auto & memory'], ['Brightness adjustment', 'Automatic gain control; auto / manual 1 – 19 levels'], ['IRIS', 'Peak / Average / Auto (flexible); full / wide / circular screen (rigid)'],
          ['Transillumination', '6 – 8 seconds'], ['CHb haemoglobin enhancement', 'Yes'], ['Picture by picture (PBP)', 'Yes'], ['One-step connection / hot plugging', 'Yes / Yes'],
          ['Power', '100 – 240 V AC, 50/60 Hz, 350 VA'], ['Dimensions / weight', '492 × 373.5 × 205 mm / 16.7 kg'],
        ],
      },
      {
        title: 'Camera Heads',
        rows: [
          ['Lens mount', 'Universal coupling'], ['Pickup system', 'CMOS image sensor'], ['10.110.201', 'Focal lens 19 – 38 mm, up to 2.0×'], ['10.111.201', 'Focal lens 18 mm'], ['10.112.201', 'Focal lens 32 mm'], ['10.100.201', 'Focal lens 18 mm'],
          ['Electric-shock protection', 'Type BF'], ['Liquid protection', 'IPX7'],
        ],
      },
      {
        title: 'X20 Series Flexible Scopes',
        head: ['Parameter', 'EG-X20', 'EC-X20', 'EC-X20L', 'EB-X20T', 'EB-X20', 'ECY-X20'],
        rows: [
          ['Speciality', 'Gastroenterology', 'Gastroenterology', 'Gastroenterology', 'Pulmonology', 'Pulmonology', 'Surgical'],
          ['Field of view', '145°', '145°', '145°', '120°', '120°', '120°'],
          ['Depth of field', '2 – 100 mm', '2 – 100 mm', '2 – 100 mm', '2 – 100 mm', '2 – 100 mm', '3 – 50 mm'],
          ['Distal-end diameter', '9.3 mm', '12 mm', '12 mm', '5.9 mm', '4.9 mm', '2.7 mm'],
          ['Insertion diameter', '9.3 mm', '12.5 mm', '12.5 mm', '5.9 mm', '4.9 mm', '5.5 mm'],
          ['Instrument channel', '2.8 mm', '3.8 mm', '3.8 mm', '2.8 mm', '2.0 mm', '2.2 mm'],
          ['Angulation', 'U/D 210/120°, L/R 100/100°', 'U/D 180/180°, L/R 160/160°', 'U/D 180/180°, L/R 160/160°', 'U/D 180/130°', 'U/D 180/130°', 'U/D 220/130°'],
          ['Working length', '1050 mm', '1350 mm', '1700 mm', '600 mm', '600 mm', '380 mm'],
        ],
      },
    ],
  },
};
