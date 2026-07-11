/**
 * app.js - EV Car Wale Marketplace Core Logic
 * Handles interactive state machines, data filtering, math calculators,
 * dropdown comparisons, video players, and accordion modules.
 */

// --- Global EV Fleet Database ---
const EV_DATABASE = [
  {
    id: 'nexon-ev',
    name: 'Nexon EV',
    brand: 'tata',
    priceVal: 14.50,
    price: '₹14.50 Lakh',
    rangeVal: 465,
    range: '465 km',
    battery: '40.5 kWh',
    charging: '56 min (DC)',
    speed: '150 km/h',
    power: '143 hp',
    safety: '5 Stars (BNCAP)',
    features: 'Ventilated seats, 12.3-inch screen, V2L capability',
    dimensions: '3994 x 1811 x 1616 mm',
    image: 'tata_nexon_ev.jpeg',
    sections: ['popular']
  },
  {
    id: 'xuv400',
    name: 'XUV400',
    brand: 'mahindra',
    priceVal: 15.49,
    price: '₹15.49 Lakh',
    rangeVal: 456,
    range: '456 km',
    battery: '39.4 kWh',
    charging: '50 min (DC)',
    speed: '160 km/h',
    power: '150 hp',
    safety: '5 Stars (Expected)',
    features: 'Single pane sunroof, Drive modes, 10.25-inch touchscreen',
    dimensions: '4200 x 1821 x 1634 mm',
    image: 'mahindra_XUV_400.jpg',
    sections: ['popular']
  },
  {
    id: 'punch-ev',
    name: 'Punch EV',
    brand: 'tata',
    priceVal: 10.99,
    price: '₹10.99 Lakh',
    rangeVal: 421,
    range: '421 km',
    battery: '35 kWh',
    charging: '56 min (DC)',
    speed: '140 km/h',
    power: '122 hp',
    safety: '5 Stars (BNCAP)',
    features: 'Electronic parking brake, Sunroof, Paddle shifters for regeneration',
    dimensions: '3827 x 1742 x 1615 mm',
    image: 'tata_punch_ev.jpg',
    sections: ['popular']
  },
  {
    id: 'windsor-ev',
    name: 'Windsor EV',
    brand: 'mg',
    priceVal: 13.50,
    price: '₹13.50 Lakh',
    rangeVal: 331,
    range: '331 km',
    battery: '38 kWh',
    charging: '40 min (DC)',
    speed: '140 km/h',
    power: '136 hp',
    safety: '5 Stars (Expected)',
    features: 'Aero Lounge seats, 15.6-inch Grand View touch, Smart connection',
    dimensions: '4295 x 1850 x 1677 mm',
    image: 'MG_windsor_EV.jpeg',
    sections: ['popular', 'launches'],
    launchDate: '2 Days Ago'
  },
  {
    id: 'ioniq-5',
    name: 'Ioniq 5',
    brand: 'hyundai',
    priceVal: 46.05,
    price: '₹46.05 Lakh',
    rangeVal: 631,
    range: '631 km',
    battery: '72.6 kWh',
    charging: '18 min (DC)',
    speed: '185 km/h',
    power: '217 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Dual screens, Relaxion seats, V2L, Premium Bose Sound',
    dimensions: '4635 x 1890 x 1605 mm',
    image: 'hyundai_ioniq5.jpeg',
    sections: ['popular']
  },
  {
    id: 'byd-seal',
    name: 'BYD Seal',
    brand: 'byd',
    priceVal: 41.00,
    price: '₹41.00 Lakh',
    rangeVal: 650,
    range: '650 km',
    battery: '82.5 kWh',
    charging: '26 min (DC)',
    speed: '240 km/h',
    power: '530 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Rotating screen, Cell-to-body tech, Head-up display',
    dimensions: '4800 x 1875 x 1460 mm',
    image: 'byd_seal.jpeg',
    sections: ['popular', 'launches'],
    launchDate: '20 Days Ago'
  },
  {
    id: 'ev6',
    name: 'Kia EV6',
    brand: 'kia',
    priceVal: 49.00,
    price: '₹49.00 Lakh',
    rangeVal: 708,
    range: '708 km',
    battery: '77.4 kWh',
    charging: '18 min (DC)',
    speed: '192 km/h',
    power: '325 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Augmented reality HUD, Sunroof, Meridian Audio',
    dimensions: '4695 x 1890 x 1550 mm',
    image: 'kia_ev6.jpeg',
    sections: ['popular']
  },
  {
    id: 'harrier-ev',
    name: 'Harrier EV',
    brand: 'tata',
    priceVal: 22.00,
    price: '₹22.00 Lakh',
    rangeVal: 500,
    range: '500 km',
    battery: '60 kWh',
    charging: '45 min (DC)',
    speed: '170 km/h',
    power: '218 hp',
    safety: '5 Stars (Expected)',
    features: 'AWD option, V2L & V2V charging, 12.3-inch infotainment',
    dimensions: '4605 x 1922 x 1718 mm',
    image: 'tata_harrier_ev.jpg',
    sections: ['popular', 'launches'],
    launchDate: '5 Days Ago'
  },
  {
    id: 'be6',
    name: 'BE6',
    brand: 'mahindra',
    priceVal: 24.00,
    price: '₹24.00 Lakh',
    rangeVal: 450,
    range: '450 km',
    battery: '60 kWh',
    charging: '30 min (DC)',
    speed: '180 km/h',
    power: '280 hp',
    safety: '5 Stars (Expected)',
    features: 'Futuristic design, Digital cockpit, Advanced ADAS',
    dimensions: '4370 x 1900 x 1635 mm',
    image: 'mahindra-BE6.jpg',
    sections: ['popular', 'launches'],
    launchDate: '22 Days Ago'
  },
  {
    id: 'bmw-i4',
    name: 'BMW i4',
    brand: 'bmw',
    priceVal: 72.50,
    price: '₹72.50 Lakh',
    rangeVal: 590,
    range: '590 km',
    battery: '83.9 kWh',
    charging: '31 min (DC)',
    speed: '190 km/h',
    power: '340 hp',
    safety: '4 Stars (Euro NCAP)',
    features: 'Curved display, Reversing assistant, Glass roof',
    dimensions: '4783 x 1852 x 1448 mm',
    image: 'bmw_i4.jpeg',
    sections: ['popular']
  },
  {
    id: 'etron-gt',
    name: 'Audi e-tron GT',
    brand: 'audi',
    priceVal: 195.00,
    price: '₹1.95 Crore',
    rangeVal: 500,
    range: '500 km',
    battery: '93.4 kWh',
    charging: '22 min (DC)',
    speed: '245 km/h',
    power: '530 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Matrix LED headlights, e-tron sport sound, Virtual cockpit',
    dimensions: '4989 x 1964 x 1413 mm',
    image: 'audi_etron_gt.jpg',
    sections: ['popular']
  },
  {
    id: 'mercedes-eqs',
    name: 'Mercedes EQS',
    brand: 'mercedes-benz',
    priceVal: 162.00,
    price: '₹1.62 Crore',
    rangeVal: 857,
    range: '857 km',
    battery: '107.8 kWh',
    charging: '31 min (DC)',
    speed: '210 km/h',
    power: '523 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Hyperscreen display, Rear axle steering, Burmester 3D',
    dimensions: '5216 x 1926 x 1512 mm',
    image: 'mercedes_eqs_sedan.webp',
    sections: ['popular']
  },
  {
    id: 'vinfast-vf6',
    name: 'VF6',
    brand: 'vinfast',
    priceVal: 18.00,
    price: '₹18.00 Lakh',
    rangeVal: 399,
    range: '399 km',
    battery: '59.6 kWh',
    charging: '38 min (DC)',
    speed: '150 km/h',
    power: '174 hp',
    safety: '4 Stars (Expected)',
    features: 'Vietnamese engineering, HUD, open cockpit screen',
    dimensions: '4238 x 1820 x 1590 mm',
    image: 'vin_fast_vf6.jpeg',
    sections: ['launches'],
    launchDate: '10 Days Ago'
  },
  {
    id: 'kia-ev9',
    name: 'EV9',
    brand: 'kia',
    priceVal: 110.00,
    price: '₹1.10 Crore',
    rangeVal: 561,
    range: '561 km',
    battery: '99.8 kWh',
    charging: '24 min (DC)',
    speed: '200 km/h',
    power: '384 hp',
    safety: '5 Stars (Euro NCAP)',
    features: '3-row seating, Swivel seats, dual sunroof, LiDAR-ready ADAS',
    dimensions: '5010 x 1980 x 1755 mm',
    image: 'kia_ev9.jpeg',
    sections: ['launches', 'explore'],
    launchDate: '18 Days Ago'
  },
  {
    id: 'xev-9e',
    name: 'XEV 9e',
    brand: 'mahindra',
    priceVal: 38.00,
    price: '₹38.00 Lakh',
    rangeVal: 533,
    range: '533 km',
    battery: '79 kWh',
    charging: '35 min (DC)',
    speed: '180 km/h',
    power: '286 hp',
    safety: '5 Stars (Expected)',
    features: 'Triple screen console, Augmented reality HUD, futuristic silhouette',
    dimensions: '4790 x 1905 x 1690 mm',
    image: 'thar.e.jpeg',
    sections: ['launches'],
    launchDate: '1 Month Ago'
  },
  {
    id: 'citroen-ec3',
    name: 'Citroën eC3 Facelift',
    brand: 'citroen',
    priceVal: 12.50,
    price: '₹12.50 Lakh',
    rangeVal: 320,
    range: '320 km',
    battery: '29.2 kWh',
    charging: '57 min (DC)',
    speed: '107 km/h',
    power: '57 hp',
    safety: '3 Stars (Expected)',
    features: 'Refreshed bumpers, LED signature design, larger touchscreen',
    dimensions: '3981 x 1733 x 1604 mm',
    image: 'Citroen_eC3.jpeg',
    sections: ['launches'],
    launchDate: '25 Days Ago'
  },
  {
    id: 'curvv-ev',
    name: 'Curvv EV',
    brand: 'tata',
    priceVal: 17.49,
    price: '₹17.49 Lakh',
    rangeVal: 585,
    range: '585 km',
    battery: '55 kWh',
    charging: '40 min (DC)',
    speed: '160 km/h',
    power: '167 hp',
    safety: '5 Stars (BNCAP)',
    features: 'Coupe design, gesture tailgate, flush handles, Arcade.ev app suite',
    dimensions: '4310 x 1810 x 1637 mm',
    image: 'tata_curve_ev.jpeg',
    sections: ['launches']
  },
  {
    id: 'tiago-ev',
    name: 'Tiago EV',
    brand: 'tata',
    priceVal: 8.69,
    price: '₹8.69 Lakh',
    rangeVal: 315,
    range: '315 km',
    battery: '24 kWh',
    charging: '58 min (DC)',
    speed: '120 km/h',
    power: '74 hp',
    safety: '4 Stars (GNCAP)',
    features: 'Multi-mode regen, connected car tech, cruise control',
    dimensions: '3769 x 1677 x 1536 mm',
    image: 'tata_tiago_EV.jpeg',
    sections: ['launches']
  },
  {
    id: 'byd-atto3',
    name: 'BYD Atto 3',
    brand: 'byd',
    priceVal: 24.99,
    price: '₹24.99 Lakh',
    rangeVal: 521,
    range: '521 km',
    battery: '60.48 kWh',
    charging: '50 min (DC)',
    speed: '160 km/h',
    power: '201 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Blade battery, rotation screen, panoramic roof, ambient lighting',
    dimensions: '4455 x 1875 x 1615 mm',
    image: 'BYD_atto.jpeg',
    sections: ['upcoming']
  },
  {
    id: 'elevate-ev',
    name: 'Elevate EV',
    brand: 'honda',
    priceVal: 18.00,
    price: '₹18.00 Lakh',
    rangeVal: 400,
    range: '400 km',
    battery: '48 kWh',
    charging: '45 min (DC)',
    speed: '150 km/h',
    power: '150 hp',
    safety: '5 Stars (Expected)',
    features: 'Honda Sensing ADAS package, spacious cabin, premium seating',
    dimensions: '4312 x 1790 x 1650 mm',
    image: 'honda_elevate_EV.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Mid 2027'
  },
  {
    id: 'ioniq-6',
    name: 'Ioniq 6',
    brand: 'hyundai',
    priceVal: 65.00,
    price: '₹65.00 Lakh',
    rangeVal: 614,
    range: '614 km',
    battery: '77.4 kWh',
    charging: '18 min (DC)',
    speed: '250 km/h',
    power: '320 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Aerodynamic streamliner, interactive lighting, dual motors',
    dimensions: '4855 x 1880 x 1495 mm',
    image: 'Hyundai_IONIQ6.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Jan 2027'
  },
  {
    id: 'syros-ev',
    name: 'Syros EV',
    brand: 'kia',
    priceVal: 15.00,
    price: '₹15.00 Lakh',
    rangeVal: 350,
    range: '350 km',
    battery: '35 kWh',
    charging: '40 min (DC)',
    speed: '150 km/h',
    power: '150 hp',
    safety: '5 Stars (Expected)',
    features: 'Connected telematics, tall-boy stance, compact city footprint',
    dimensions: '4100 x 1780 x 1600 mm',
    image: 'Kia_syros_ev.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Feb 2027'
  },
  {
    id: 'be07',
    name: 'BE.07',
    brand: 'mahindra',
    priceVal: 28.00,
    price: '₹28.00 Lakh',
    rangeVal: 500,
    range: '500 km',
    battery: '60 kWh',
    charging: '45 min (DC)',
    speed: '170 km/h',
    power: '230 hp',
    safety: '5 Stars (Expected)',
    features: 'INGLO platform core, edge-to-edge screens, panoramic canopy',
    dimensions: '4560 x 1900 x 1660 mm',
    image: 'mahindra_BE_07.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Mid 2027'
  },
  {
    id: 'avinya-ev',
    name: 'Avinya EV',
    brand: 'tata',
    priceVal: 35.00,
    price: '₹35.00 Lakh',
    rangeVal: 500,
    range: '500 km',
    battery: '80 kWh',
    charging: '30 min (DC)',
    speed: '200 km/h',
    power: '350 hp',
    safety: '5 Stars (Expected)',
    features: 'Skateboard chassis, rotating lounge chairs, bio-degradable cabin materials',
    dimensions: '4600 x 1900 x 1550 mm',
    image: 'tata_avinya_ev.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Late 2027'
  },
  {
    id: 'sierra-ev',
    name: 'Sierra EV',
    brand: 'tata',
    priceVal: 25.00,
    price: '₹25.00 Lakh',
    rangeVal: 500,
    range: '500 km',
    battery: '60 kWh',
    charging: '40 min (DC)',
    speed: '160 km/h',
    power: '200 hp',
    safety: '5 Stars (Expected)',
    features: 'Signature split glass house, premium captain lounge, high-end upholstery',
    dimensions: '4350 x 1850 x 1700 mm',
    image: 'tata_sierra.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Late 2027'
  },
  {
    id: 'ex90',
    name: 'EX90',
    brand: 'volvo',
    priceVal: 120.00,
    price: '₹1.20 Crore',
    rangeVal: 600,
    range: '600 km',
    battery: '111 kWh',
    charging: '30 min (DC)',
    speed: '180 km/h',
    power: '517 hp',
    safety: '5 Stars (Expected)',
    features: 'Roof-mounted LiDAR, safety shield bubble, recycled materials interior',
    dimensions: '5037 x 1964 x 1747 mm',
    image: 'Volvo_EX90.jpeg',
    sections: ['upcoming'],
    launchDate: 'Expected Apr 2027'
  },
  {
    id: 'comet-ev',
    name: 'Comet EV',
    brand: 'mg',
    priceVal: 6.99,
    price: '₹6.99 Lakh',
    rangeVal: 230,
    range: '230 km',
    battery: '17.3 kWh',
    charging: '7 hours (AC)',
    speed: '100 km/h',
    power: '42 hp',
    safety: '3 Stars (Expected)',
    features: 'Ultra-compact footprint, dual screens, Apple-like key layout, city runabout',
    dimensions: '2974 x 1505 x 1631 mm',
    image: 'mg_comet_ev.webp',
    sections: ['explore']
  },
  {
    id: 'toyota-bz4x',
    name: 'bZ4X',
    brand: 'toyota',
    priceVal: 55.00,
    price: '₹55.00 Lakh',
    rangeVal: 516,
    range: '516 km',
    battery: '71.4 kWh',
    charging: '30 min (DC)',
    speed: '160 km/h',
    power: '214 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'AWD system with X-Mode, high durability battery claim, premium SUV stance',
    dimensions: '4690 x 1860 x 1650 mm',
    image: 'Toyota_bZ4X.jpeg',
    sections: ['explore']
  },
  {
    id: 'bmw-i7',
    name: 'BMW i7',
    brand: 'bmw',
    priceVal: 203.00,
    price: '₹2.03 Crore',
    rangeVal: 625,
    range: '625 km',
    battery: '101.7 kWh',
    charging: '34 min (DC)',
    speed: '250 km/h',
    power: '544 hp',
    safety: '5 Stars (Euro NCAP)',
    features: 'Rear theatre screen, crystal headlights, executive lounge seats',
    dimensions: '5391 x 1950 x 1544 mm',
    image: 'bmw_i7.jpeg',
    sections: ['explore']
  },
  {
    id: 'macan-ev',
    name: 'Porsche Macan EV',
    brand: 'porsche',
    priceVal: 165.00,
    price: '₹1.65 Crore',
    rangeVal: 613,
    range: '613 km',
    battery: '100 kWh',
    charging: '21 min (DC)',
    speed: '220 km/h',
    power: '408 hp',
    safety: '5 Stars (Expected)',
    features: 'Aero active shutter vents, rear axle steering, high speed handling bias',
    dimensions: '4784 x 1938 x 1622 mm',
    image: 'porsche_maccan_EV.jpeg',
    sections: ['explore']
  }
];

// --- State-Wise Tax & EV Policy Database ---
// NOTE: All rates are approximate and sourced from publicly available state government policies.
// Update this object whenever state governments revise their EV policies or registration fees.
const STATE_TAX_DATABASE = {
  delhi: {
    label: 'Delhi',
    roadTaxPct: 0,          // Delhi waives road tax for EVs
    regCharge: 2500,        // flat registration charge (₹)
    evIncentivePct: 0,      // No additional incentive beyond road tax waiver
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax fully waived for EVs.'
  },
  mumbai: {
    label: 'Mumbai, Maharashtra',
    roadTaxPct: 0,          // EV road tax waiver up to ₹25 Lakh
    regCharge: 4000,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax waived for EVs under ₹25 Lakh (FAME-III policy).'
  },
  pune: {
    label: 'Pune, Maharashtra',
    roadTaxPct: 0,
    regCharge: 4000,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax waived for EVs under ₹25 Lakh (FAME-III policy).'
  },
  bengaluru: {
    label: 'Bengaluru, Karnataka',
    roadTaxPct: 0,          // Karnataka exempts EVs from road tax
    regCharge: 4000,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax fully exempted for EVs in Karnataka.'
  },
  hyderabad: {
    label: 'Hyderabad, Telangana',
    roadTaxPct: 0,          // Telangana EV policy: road tax exemption
    regCharge: 3500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax exempted for EVs under Telangana EV Policy 2020-30.'
  },
  chennai: {
    label: 'Chennai, Tamil Nadu',
    roadTaxPct: 0.06,       // TN levies 6% road tax on EVs (as of last update)
    regCharge: 4000,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax at 6% applicable. No additional state EV waiver currently.'
  },
  ahmedabad: {
    label: 'Ahmedabad, Gujarat',
    roadTaxPct: 0,          // Gujarat waives road tax for EVs
    regCharge: 3000,
    evIncentivePct: 0,
    evIncentiveFlat: 20000, // Gujarat EV subsidy (up to ₹20,000 on select models)
    evBenefitNote: 'Road tax waived. Additional subsidy of up to ₹20,000 under Gujarat EV Policy.'
  },
  kochi: {
    label: 'Kochi, Kerala',
    roadTaxPct: 0,          // Kerala exempts road tax for EVs
    regCharge: 3500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax fully exempted for EVs in Kerala.'
  },
  kolkata: {
    label: 'Kolkata, West Bengal',
    roadTaxPct: 0.04,       // WB levies reduced 4% road tax on EVs
    regCharge: 4500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Reduced 4% road tax applicable for EVs.'
  },
  jaipur: {
    label: 'Jaipur, Rajasthan',
    roadTaxPct: 0,          // Rajasthan exempts road tax for EVs
    regCharge: 3500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax fully waived for EVs under Rajasthan EV Policy.'
  },
  lucknow: {
    label: 'Lucknow, Uttar Pradesh',
    roadTaxPct: 0,
    regCharge: 3500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax exempted for EVs under UP EV Policy 2022.'
  },
  chandigarh: {
    label: 'Chandigarh',
    roadTaxPct: 0,
    regCharge: 2500,
    evIncentivePct: 0,
    evIncentiveFlat: 0,
    evBenefitNote: 'Road tax waived for EVs.'
  }
};

/**
 * Calculate on-road price breakdown for a given ex-showroom price and state.
 * @param {number} exShowroomLakh  Ex-showroom price in Lakhs
 * @param {string} stateKey        Key from STATE_TAX_DATABASE
 * @returns {object}               Breakdown object with all cost components
 */
function getOnRoadPriceData(exShowroomLakh, stateKey) {
  const state = STATE_TAX_DATABASE[stateKey];
  if (!state) return null;

  const exShowroom = Math.round(exShowroomLakh * 100000);
  const roadTax = Math.round(exShowroom * state.roadTaxPct);
  const regCharge = state.regCharge;
  const evBenefit = state.evIncentiveFlat + Math.round(exShowroom * state.evIncentivePct);
  const insurance = Math.round(exShowroom * 0.025);  // ~2.5% approximate first-year insurance
  const handling = 2000; // standard dealer handling charge
  const onRoad = exShowroom + roadTax + regCharge + insurance + handling - evBenefit;

  return {
    exShowroom,
    roadTax,
    regCharge,
    insurance,
    handling,
    evBenefit,
    onRoad,
    evBenefitNote: state.evBenefitNote,
    stateLabel: state.label
  };
}


// ========================================================
// EV TRIP PLANNER — Data & Calculation Engine
// ========================================================

/**
 * Road distances between major Indian city pairs.
 * Keys are two city slugs joined by '-', always sorted alphabetically
 * so lookup works regardless of which direction the user picks.
 * NOTE: distances are approximate road distances (not crow-fly).
 * Replace getRouteData() with a real Google Maps Directions API call
 * when an API key is available.
 */
const CITY_DISTANCE_DATABASE = {
  'ahmedabad-delhi':       { distanceKm: 950,  driveTimeHours: 14   },
  'ahmedabad-mumbai':      { distanceKm: 530,  driveTimeHours: 8    },
  'ahmedabad-pune':        { distanceKm: 660,  driveTimeHours: 10   },
  'ahmedabad-surat':       { distanceKm: 265,  driveTimeHours: 4    },
  'amritsar-chandigarh':   { distanceKm: 230,  driveTimeHours: 3.5  },
  'amritsar-delhi':        { distanceKm: 450,  driveTimeHours: 6.5  },
  'bengaluru-chennai':     { distanceKm: 345,  driveTimeHours: 5.5  },
  'bengaluru-coimbatore':  { distanceKm: 360,  driveTimeHours: 6    },
  'bengaluru-delhi':       { distanceKm: 2150, driveTimeHours: 34   },
  'bengaluru-hyderabad':   { distanceKm: 570,  driveTimeHours: 9    },
  'bengaluru-kochi':       { distanceKm: 540,  driveTimeHours: 9    },
  'bengaluru-mumbai':      { distanceKm: 990,  driveTimeHours: 15   },
  'bengaluru-mysuru':      { distanceKm: 145,  driveTimeHours: 2.5  },
  'bengaluru-pune':        { distanceKm: 840,  driveTimeHours: 13   },
  'chandigarh-delhi':      { distanceKm: 250,  driveTimeHours: 4    },
  'chandigarh-shimla':     { distanceKm: 120,  driveTimeHours: 2.5  },
  'chennai-coimbatore':    { distanceKm: 495,  driveTimeHours: 7.5  },
  'chennai-delhi':         { distanceKm: 2200, driveTimeHours: 35   },
  'chennai-hyderabad':     { distanceKm: 630,  driveTimeHours: 10   },
  'chennai-kochi':         { distanceKm: 690,  driveTimeHours: 11   },
  'chennai-mumbai':        { distanceKm: 1330, driveTimeHours: 20   },
  'delhi-goa':             { distanceKm: 1880, driveTimeHours: 29   },
  'delhi-hyderabad':       { distanceKm: 1550, driveTimeHours: 24   },
  'delhi-jaipur':          { distanceKm: 280,  driveTimeHours: 4.5  },
  'delhi-kolkata':         { distanceKm: 1470, driveTimeHours: 22   },
  'delhi-lucknow':         { distanceKm: 555,  driveTimeHours: 8    },
  'delhi-mumbai':          { distanceKm: 1450, driveTimeHours: 22   },
  'delhi-nagpur':          { distanceKm: 1090, driveTimeHours: 16   },
  'delhi-pune':            { distanceKm: 1475, driveTimeHours: 22.5 },
  'delhi-srinagar':        { distanceKm: 800,  driveTimeHours: 13   },
  'delhi-varanasi':        { distanceKm: 820,  driveTimeHours: 12   },
  'delhi-visakhapatnam':   { distanceKm: 1700, driveTimeHours: 26   },
  'goa-mumbai':            { distanceKm: 590,  driveTimeHours: 9    },
  'goa-pune':              { distanceKm: 455,  driveTimeHours: 7    },
  'hyderabad-mumbai':      { distanceKm: 710,  driveTimeHours: 11   },
  'hyderabad-nagpur':      { distanceKm: 500,  driveTimeHours: 7.5  },
  'hyderabad-pune':        { distanceKm: 565,  driveTimeHours: 8.5  },
  'hyderabad-visakhapatnam': { distanceKm: 620, driveTimeHours: 9.5 },
  'jaipur-udaipur':        { distanceKm: 395,  driveTimeHours: 6    },
  'kochi-mysuru':          { distanceKm: 270,  driveTimeHours: 4.5  },
  'kolkata-bhubaneswar':   { distanceKm: 445,  driveTimeHours: 7    },
  'kolkata-visakhapatnam': { distanceKm: 950,  driveTimeHours: 14   },
  'lucknow-varanasi':      { distanceKm: 320,  driveTimeHours: 5    },
  'mumbai-nagpur':         { distanceKm: 830,  driveTimeHours: 12   },
  'mumbai-pune':           { distanceKm: 150,  driveTimeHours: 2.5  },
  'mumbai-surat':          { distanceKm: 285,  driveTimeHours: 4.5  },
  'nagpur-pune':           { distanceKm: 715,  driveTimeHours: 10.5 },
  'nagpur-varanasi':       { distanceKm: 700,  driveTimeHours: 10.5 },
  'srinagar-amritsar':     { distanceKm: 370,  driveTimeHours: 7    },
  'bhopal-delhi':          { distanceKm: 780,  driveTimeHours: 11.5 },
  'bhopal-mumbai':         { distanceKm: 755,  driveTimeHours: 11   },
  'bhopal-nagpur':         { distanceKm: 350,  driveTimeHours: 5.5  },
  'indore-delhi':          { distanceKm: 900,  driveTimeHours: 13   },
  'indore-mumbai':         { distanceKm: 590,  driveTimeHours: 9    },
  'indore-pune':           { distanceKm: 565,  driveTimeHours: 8.5  },
};

/**
 * Recommended fast charging stops for major corridors.
 * Key format: 'cityA-cityB' (alphabetically sorted).
 * Each array entry: { city, chargerType, network }
 */
const ROUTE_STATIONS = {
  'delhi-mumbai': [
    { city: 'Jaipur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
    { city: 'Ajmer', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
    { city: 'Ahmedabad', chargerType: 'DC 100 kW', network: 'EESL / Statiq' },
    { city: 'Surat', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
    { city: 'Vadodara', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
    { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' },
  ],
  'bengaluru-delhi': [
    { city: 'Hyderabad', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
    { city: 'Nagpur', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
    { city: 'Bhopal', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
    { city: 'Agra', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
    { city: 'Gwalior', chargerType: 'DC 50 kW', network: 'Statiq' },
  ],
  'bengaluru-mumbai': [
    { city: 'Hubli', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
    { city: 'Kolhapur', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
    { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' },
  ],
  'bengaluru-chennai': [
    { city: 'Vellore', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  ],
  'delhi-kolkata': [
    { city: 'Kanpur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
    { city: 'Varanasi', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
    { city: 'Patna', chargerType: 'DC 60 kW', network: 'Statiq' },
    { city: 'Asansol', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
  ],
  'chennai-mumbai': [
    { city: 'Bengaluru', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
    { city: 'Hubli', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
    { city: 'Kolhapur', chargerType: 'DC 50 kW', network: 'EESL CCS2' },
    { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' },
  ],
  'bengaluru-hyderabad': [
    { city: 'Kurnool', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  ],
  'hyderabad-mumbai': [
    { city: 'Solapur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
    { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' },
  ],
  'mumbai-pune': [
    { city: 'Lonavala', chargerType: 'DC 50 kW', network: 'Statiq' },
  ],
};

/** Ordered list of cities available in the trip planner dropdowns */
const TRIP_CITIES = [
  { key: 'ahmedabad',     label: 'Ahmedabad, Gujarat' },
  { key: 'amritsar',      label: 'Amritsar, Punjab' },
  { key: 'bengaluru',     label: 'Bengaluru, Karnataka' },
  { key: 'bhopal',        label: 'Bhopal, Madhya Pradesh' },
  { key: 'bhubaneswar',   label: 'Bhubaneswar, Odisha' },
  { key: 'chandigarh',    label: 'Chandigarh' },
  { key: 'chennai',       label: 'Chennai, Tamil Nadu' },
  { key: 'coimbatore',    label: 'Coimbatore, Tamil Nadu' },
  { key: 'delhi',         label: 'Delhi, NCR' },
  { key: 'goa',           label: 'Goa' },
  { key: 'hyderabad',     label: 'Hyderabad, Telangana' },
  { key: 'indore',        label: 'Indore, Madhya Pradesh' },
  { key: 'jaipur',        label: 'Jaipur, Rajasthan' },
  { key: 'kochi',         label: 'Kochi, Kerala' },
  { key: 'kolkata',       label: 'Kolkata, West Bengal' },
  { key: 'lucknow',       label: 'Lucknow, Uttar Pradesh' },
  { key: 'mumbai',        label: 'Mumbai, Maharashtra' },
  { key: 'mysuru',        label: 'Mysuru, Karnataka' },
  { key: 'nagpur',        label: 'Nagpur, Maharashtra' },
  { key: 'pune',          label: 'Pune, Maharashtra' },
  { key: 'shimla',        label: 'Shimla, Himachal Pradesh' },
  { key: 'srinagar',      label: 'Srinagar, J&K' },
  { key: 'surat',         label: 'Surat, Gujarat' },
  { key: 'udaipur',       label: 'Udaipur, Rajasthan' },
  { key: 'varanasi',      label: 'Varanasi, Uttar Pradesh' },
  { key: 'visakhapatnam', label: 'Visakhapatnam, AP' },
];

/**
 * Route data lookup — tries both orderings of city keys.
 * Abstraction layer: replace the body with a real Google Maps
 * Directions API call when an API key becomes available.
 * @param {string} fromKey  City slug (e.g. 'delhi')
 * @param {string} toKey    City slug (e.g. 'mumbai')
 * @returns {object|null}   { distanceKm, driveTimeHours } or null
 */
function getRouteData(fromKey, toKey) {
  const k1 = fromKey + '-' + toKey;
  const k2 = toKey + '-' + fromKey;
  return CITY_DISTANCE_DATABASE[k1] || CITY_DISTANCE_DATABASE[k2] || null;
}

/**
 * Get route stations recommendation — same bidirectional lookup.
 * @returns {Array} array of station objects, or empty array
 */
function getRouteStations(fromKey, toKey) {
  const k1 = fromKey + '-' + toKey;
  const k2 = toKey + '-' + fromKey;
  return ROUTE_STATIONS[k1] || ROUTE_STATIONS[k2] || [];
}

/**
 * Core trip calculation engine.
 * Adjusts real-world range from claimed range based on driving conditions,
 * then derives all cost and time figures.
 *
 * Real-world range adjustment factors:
 *   AC:    off=1.00, low=0.97, medium=0.93, high=0.88
 *   Style: eco=1.05, normal=1.00, sport=0.88
 *   Pax:   1=1.00, 2=0.99, 3=0.97, 4=0.95, 5=0.93
 *
 * Charging model:
 *   - Target 85% SoC at each stop (so effective range per leg = realRange * 0.85)
 *   - Charging time per stop: fill 70% of battery at car's DC kW
 *   - DC kW derived from charging minutes field in EV_DATABASE
 *
 * @param {string} carId
 * @param {string} fromKey
 * @param {string} toKey
 * @param {number} days
 * @param {number} passengers
 * @param {string} acUsage  ('off'|'low'|'medium'|'high')
 * @param {string} drivingStyle ('eco'|'normal'|'sport')
 * @returns {object|null}
 */
function calcTripData(carId, fromKey, toKey, days, passengers, acUsage, drivingStyle) {
  const car = EV_DATABASE.find(function(c) { return c.id === carId; });
  if (!car) return null;

  const routeData = getRouteData(fromKey, toKey);
  if (!routeData) return null;

  // --- Range adjustment ---
  const acFactor     = { off: 1.00, low: 0.97, medium: 0.93, high: 0.88 }[acUsage] || 0.93;
  const styleFactor  = { eco: 1.05, normal: 1.00, sport: 0.88 }[drivingStyle] || 1.00;
  const paxFactor    = [1.00, 1.00, 0.99, 0.97, 0.95, 0.93][Math.min(passengers, 5)];
  const claimedRange = car.rangeVal || 400;  // km, from EV_DATABASE
  const realRange    = Math.round(claimedRange * acFactor * styleFactor * paxFactor);

  // --- Derive DC charging speed (kW) from car.charging string ---
  const chargingMinutes = (function() {
    if (!car.charging) return 60;
    var m = car.charging.match(/(\d+)\s*min/);
    return m ? parseInt(m[1]) : 60;
  })();
  // Approximate DC power: charge 70% of battery in chargingMinutes
  const batteryKWh   = car.batteryVal || 40;  // from EV_DATABASE
  const dcChargeKW   = Math.round((batteryKWh * 0.70) / (chargingMinutes / 60));

  // --- Route metrics ---
  const distance       = routeData.distanceKm;
  const driveTimeHours = routeData.driveTimeHours;

  // Effective range per leg (charge to ~85% for speed)
  const legRange = Math.round(realRange * 0.85);

  // Charging stops (start fully charged; stop to charge before running out)
  const chargingStops = Math.max(0, Math.ceil(distance / legRange) - 1);

  // Time to charge per stop: 10% → 80% = 70% of battery
  const chargingTimePerStopHours = (batteryKWh * 0.70) / dcChargeKW;
  const chargingTimePerStopMins  = Math.round(chargingTimePerStopHours * 60);
  const totalChargingMins        = chargingStops * chargingTimePerStopMins;
  const totalChargingHrs         = Math.floor(totalChargingMins / 60);
  const totalChargingRemMins     = totalChargingMins % 60;

  // Total kWh required for the journey
  const efficiencyKmPerKWh = claimedRange / batteryKWh; // claimed efficiency
  const totalKWh           = Math.round(distance / (efficiencyKmPerKWh * acFactor * styleFactor * paxFactor));

  // Costs
  const evChargingCost = Math.round(totalKWh * 20);       // ₹20/kWh average DC rate
  const petrolCostRaw  = (distance / 15) * 105;           // 15 kmpl petrol car, ₹105/litre
  const petrolCost     = Math.round(petrolCostRaw);
  const savings        = Math.max(0, petrolCost - evChargingCost);
  const savingsPct     = petrolCost > 0 ? Math.round((savings / petrolCost) * 100) : 0;

  // Total trip time (drive + charge)
  const totalTripHours = driveTimeHours + totalChargingMins / 60;
  const totalDays      = Math.ceil(totalTripHours / 10); // ~10 driving hours/day

  // Highway readiness
  const hwData = getHighwayReadinessData(car);

  return {
    car,
    fromKey,
    toKey,
    days,
    distance,
    driveTimeHours,
    realRange,
    chargingStops,
    chargingTimePerStopMins,
    totalChargingHrs,
    totalChargingRemMins,
    totalKWh,
    dcChargeKW,
    evChargingCost,
    petrolCost,
    savings,
    savingsPct,
    totalTripHours,
    batteryKWh,
    hwData,
  };
}

const NEWS_DATABASE = [
  {
    id: 'news-1',
    topic: 'Market Trends',
    date: 'Oct 12, 2026',
    title: 'FAME-III Subsidy Allocations Finalized',
    summary: 'New policy outlines tax breaks for high-voltage commercial and passenger vehicle frameworks.',
    content: 'The FAME-III framework introduces ₹12,500 crore in incentives, prioritizing localization of battery modules and public charging systems. Industry leaders expect this to drive electric vehicle adoption significantly across passenger and commercial segments.'
  },
  {
    id: 'news-2',
    topic: 'Infrastructure',
    date: 'Oct 10, 2026',
    title: 'Highway Fast Charger Corridor Expands',
    summary: 'Grid operator adds 350 kW hyper-chargers on Golden Quadrilateral transit highways.',
    content: 'Strategic partnerships aim to install DC fast chargers every 50 km on national expressways, boosting inter-city travel stability. The new 350 kW hyper-chargers will enable compatible premium vehicles to recharge from 10% to 80% in under 15 minutes.'
  },
  {
    id: 'news-3',
    topic: 'Battery Tech',
    date: 'Oct 08, 2026',
    title: 'Solid-State Modules Enter Trial Phase',
    summary: 'Bespoke luxury manufacturer initiates high-density solid-state battery road runs.',
    content: 'Solid-state battery prototypes promise up to 800 km range per charge and complete thermal runaway resistance, scaling production indexes. Crucially, these new modules offer double the energy density of current lithium-ion equivalents, opening up new possibilities for long-distance luxury touring.'
  }
];

const GUIDE_DATABASE = [
  {
    id: 'guide-1',
    chapter: 'Chapter 01',
    title: 'Why Buy an EV?',
    summary: 'No tailpipe emissions, simplified mechanics, zero fuel costs, and instant acceleration.',
    content: 'Switching to an electric vehicle (EV) is one of the most rewarding decisions you can make. With zero exhaust pipes, EVs do not pollute the air we breathe. They operate silently and smoothly, providing a peaceful cabin experience. Since they have only a fraction of the moving parts of petrol cars, maintenance is rare and operating costs are extremely low.',
    diagram: `<svg viewBox="0 0 400 150" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><g transform="translate(10, 0)"><text x="50" y="25" font-family="monospace" font-size="10" font-weight="bold" fill="black">PETROL CAR (2,000+ PARTS)</text><rect x="10" y="40" width="160" height="8" fill="#e4e4e7" stroke="#000" stroke-width="1"/><rect x="20" y="60" width="40" height="30" fill="none" stroke="black" stroke-width="1.5"/><text x="40" y="78" font-family="monospace" font-size="8" text-anchor="middle">ENGINE</text><rect x="70" y="65" width="30" height="20" fill="none" stroke="black" stroke-width="1.5"/><text x="85" y="77" font-family="monospace" font-size="8" text-anchor="middle">GEARS</text><line x1="110" y1="75" x2="160" y2="75" stroke="black" stroke-width="1.5"/><rect x="130" y="70" width="20" height="10" fill="none" stroke="black" stroke-width="1"/><text x="140" y="92" font-family="monospace" font-size="8" text-anchor="middle">EXHAUST</text></g><line x1="200" y1="20" x2="200" y2="130" stroke="#e4e4e7" stroke-dasharray="4"/><g transform="translate(210, 0)"><text x="50" y="25" font-family="monospace" font-size="10" font-weight="bold" fill="black">ELECTRIC EV (20+ PARTS)</text><rect x="20" y="60" width="60" height="30" fill="none" stroke="black" stroke-width="1.5"/><text x="50" y="78" font-family="monospace" font-size="8" text-anchor="middle">BATTERY</text><circle cx="120" cy="75" r="15" fill="none" stroke="black" stroke-width="1.5"/><text x="120" y="78" font-family="monospace" font-size="8" text-anchor="middle">MOTOR</text><path d="M80,75 L105,75" stroke="black" stroke-width="2" stroke-dasharray="3"/></g></svg>`,
    terms: [
      {
        name: 'Instant Torque',
        explanation: 'The electric motor delivers its full power the split second you step on the accelerator, without waiting for gears to shift or engine revs to build up.',
        why: 'Makes overtaking on highways effortless and driving in stop-and-go city traffic feel extremely snappy and responsive.',
        example: 'Like turning on a light switch—the light appears instantly, unlike waiting for a gas stove burner to slowly heat up.'
      }
    ]
  },
  {
    id: 'guide-2',
    chapter: 'Chapter 02',
    title: 'Charging Explained',
    summary: 'Charge slowly at home overnight using standard AC power, or use high-speed DC fast chargers on highways.',
    content: 'Charging an EV is as simple as plugging in a smartphone. You can charge slowly at home or at the office using Alternating Current (AC) electricity, which takes 6 to 10 hours and is best for overnight parking. For longer road trips, highway stations use Direct Current (DC) Fast Charging to replenish your battery up to 80% capacity in 30 minutes or less.',
    diagram: `<svg viewBox="0 0 400 160" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><g transform="translate(10, 10)"><text x="10" y="15" font-family="monospace" font-size="9" font-weight="bold" fill="black">AC HOME CHARGING (SLOW & STEADY)</text><rect x="10" y="30" width="40" height="25" fill="none" stroke="black" stroke-width="1"/><text x="30" y="45" font-family="monospace" font-size="8" text-anchor="middle">GRID (AC)</text><path d="M50,42.5 L80,42.5" stroke="black" stroke-width="1.5"/><rect x="80" y="30" width="50" height="25" fill="none" stroke="black" stroke-width="1"/><text x="105" y="42" font-family="monospace" font-size="7" text-anchor="middle">ONBOARD</text><text x="105" y="50" font-family="monospace" font-size="7" text-anchor="middle">CHARGER</text><path d="M130,42.5 L160,42.5" stroke="black" stroke-width="1.5"/><rect x="160" y="30" width="40" height="25" fill="none" stroke="black" stroke-width="1.5"/><text x="180" y="45" font-family="monospace" font-size="8" text-anchor="middle">BATTERY</text></g><g transform="translate(10, 85)"><text x="10" y="15" font-family="monospace" font-size="9" font-weight="bold" fill="black">DC FAST CHARGING (HIGH-SPEED BYPASS)</text><rect x="10" y="30" width="50" height="25" fill="none" stroke="black" stroke-width="1"/><text x="35" y="42" font-family="monospace" font-size="7" text-anchor="middle">FAST STN</text><text x="35" y="50" font-family="monospace" font-size="7" text-anchor="middle">(DC)</text><path d="M60,42.5 L160,42.5" stroke="black" stroke-width="2"/><rect x="160" y="30" width="40" height="25" fill="none" stroke="black" stroke-width="1.5"/><text x="180" y="45" font-family="monospace" font-size="8" text-anchor="middle">BATTERY</text></g></svg>`,
    terms: [
      {
        name: 'DC Fast Charging',
        explanation: 'High-power charging stations that send electricity directly to your car’s battery pack, skipping the slower onboard charger.',
        why: 'Allows you to quickly top up your battery during highway road trips, reducing stop times to a quick coffee break.',
        example: 'Like filling a swimming pool with a high-pressure fire hose instead of a standard garden hose.'
      },
      {
        name: '800V Architecture',
        explanation: 'An advanced high-voltage electrical system in premium EVs that allows them to charge much faster and run cooler.',
        why: 'Drastically cuts down the time you spend waiting at charging stations and improves overall vehicle efficiency.',
        example: 'Like using a much wider water pipe that lets more water flow through quickly without creating high friction heat.'
      }
    ]
  },
  {
    id: 'guide-3',
    chapter: 'Chapter 03',
    title: 'Battery Technology',
    summary: 'Understand the difference between LFP batteries (safe & durable) and NMC batteries (long-range & light).',
    content: 'The battery pack is the heart of an EV. Inside, sophisticated cooling systems keep temperature levels stable during fast charging or driving. Currently, two main battery types dominate the market: LFP (Lithium Iron Phosphate) and NMC (Nickel Manganese Cobalt). LFP offers superior safety and longevity, making it perfect for daily driving, while NMC provides more range in a lighter package, ideal for long distance travel.',
    diagram: `<svg viewBox="0 0 400 150" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><text x="10" y="20" font-family="monospace" font-size="9" font-weight="bold" fill="black">BATTERY PACK SAFETY & COOLING</text><rect x="20" y="40" width="360" height="90" fill="none" stroke="black" stroke-width="2" rx="4"/><text x="30" y="53" font-family="monospace" font-size="7" fill="zinc-400">HEAVY ARMORED PROTECTION SHELL</text><rect x="30" y="65" width="80" height="50" fill="none" stroke="black" stroke-width="1" stroke-dasharray="2"/><rect x="120" y="65" width="80" height="50" fill="none" stroke="black" stroke-width="1" stroke-dasharray="2"/><rect x="210" y="65" width="80" height="50" fill="none" stroke="black" stroke-width="1" stroke-dasharray="2"/><text x="70" y="93" font-family="monospace" font-size="8" text-anchor="middle">MODULE 1</text><text x="160" y="93" font-family="monospace" font-size="8" text-anchor="middle">MODULE 2</text><text x="250" y="93" font-family="monospace" font-size="8" text-anchor="middle">MODULE 3</text><path d="M 20 120 L 380 120" stroke="#059669" stroke-width="4" opacity="0.3"/><text x="300" y="115" font-family="monospace" font-size="7" fill="#047857">LIQUID COOLING TUBE</text></svg>`,
    terms: [
      {
        name: 'LFP Battery',
        explanation: 'A battery chemistry that stays cooler under load, has an extremely long lifespan, and performs exceptionally well in hot Indian weather.',
        why: 'Highly safe and virtually free from the risk of overheating or catching fire, plus it lasts the entire lifetime of the car without losing much capacity.',
        example: 'Like a heavy-duty thermos flask built to survive years of daily usage without wearing down.'
      },
      {
        name: 'NMC Battery',
        explanation: 'A battery chemistry that packs a high amount of energy into a compact and lightweight structure.',
        why: 'Provides a longer driving range on a single charge without making the vehicle too heavy.',
        example: 'Like a dense energy bar that packs a lot of calories into a small pocket-sized snack.'
      }
    ]
  },
  {
    id: 'guide-4',
    chapter: 'Chapter 04',
    title: 'Government Subsidies',
    summary: 'Central schemes, road tax waivers, and local state incentives lower your final purchase cost.',
    content: 'Governments worldwide, and specifically in India, offer financial incentives to encourage EV adoption. Central government schemes (like FAME), state road-tax waivers, and registration exemptions can lower the on-road cost of an EV by up to 10-15%. You can also claim income tax deductions on EV loans under Section 80EEB.',
    diagram: `<svg viewBox="0 0 400 150" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><text x="10" y="20" font-family="monospace" font-size="9" font-weight="bold" fill="black">HOW EV SUBSIDIES LOWER COST</text><g transform="translate(10, 40)"><text x="15" y="12" font-family="monospace" font-size="8" fill="black">PETROL CAR</text><rect x="80" y="2" width="220" height="15" fill="black"/><text x="310" y="12" font-family="monospace" font-size="8" fill="black">₹12,00,000</text></g><g transform="translate(10, 70)"><text x="15" y="12" font-family="monospace" font-size="8" fill="black">EV BASE</text><rect x="80" y="2" width="260" height="15" fill="#e4e4e7" stroke="black" stroke-width="0.5"/><text x="310" y="12" font-family="monospace" font-size="8" fill="black">₹14,00,000</text></g><g transform="translate(10, 100)"><text x="15" y="12" font-family="monospace" font-size="8" fill="black">EV FINAL</text><rect x="80" y="2" width="190" height="15" fill="#10b981"/><rect x="270" y="2" width="70" height="15" fill="none" stroke="#10b981" stroke-dasharray="2 2"/><text x="310" y="12" font-family="monospace" font-size="8" fill="black" font-weight="bold">₹10,50,000</text></g></svg>`,
    terms: [
      {
        name: 'FAME-II Scheme',
        explanation: 'A government subsidy program designed to directly lower the purchase price of clean-energy electric vehicles.',
        why: 'Saves you money upfront at the dealership, making the purchase price of an EV comparable to a petrol car.',
        example: 'Like an instant cashback discount applied automatically at the checkout screen.'
      }
    ]
  },
  {
    id: 'guide-5',
    chapter: 'Chapter 05',
    title: 'EV Maintenance',
    summary: 'No engine oil changes, timing belts, or spark plugs to replace. Just basic checks on fluids, tires, and brakes.',
    content: 'Maintaining an EV is a breeze compared to petrol vehicles. Without an engine, there are no spark plugs, timing belts, air filters, or engine oil changes to worry about. The electric motor has only one moving part, meaning mechanical wear is almost non-existent. Standard maintenance is limited to checking tire pressure, rotating tires, replacing the cabin air filter, and refilling windshield wash.',
    diagram: `<svg viewBox="0 0 400 150" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><text x="10" y="20" font-family="monospace" font-size="9" font-weight="bold" fill="black">REGENERATIVE BRAKING ENERGY FLOW</text><g transform="translate(0, 20)"><circle cx="60" cy="70" r="25" fill="none" stroke="black" stroke-width="2"/><circle cx="60" cy="70" r="10" fill="none" stroke="black" stroke-width="1"/><text x="60" y="110" font-family="monospace" font-size="8" text-anchor="middle">Wheels Roll</text><path d="M90,70 L150,70" stroke="black" stroke-width="1.5" stroke-dasharray="4"/><rect x="160" y="45" width="70" height="50" fill="none" stroke="black" stroke-width="1.5"/><text x="195" y="70" font-family="monospace" font-size="8" text-anchor="middle">MOTOR acts</text><text x="195" y="80" font-family="monospace" font-size="8" text-anchor="middle">as Generator</text><path d="M240,70 L300,70" stroke="#10b981" stroke-width="2"/><rect x="310" y="45" width="60" height="50" fill="none" stroke="black" stroke-width="1.5"/><text x="340" y="73" font-family="monospace" font-size="8" text-anchor="middle">BATTERY</text><text x="340" y="83" font-family="monospace" font-size="7" text-anchor="middle" fill="#10b981">CHARGES</text></g></svg>`,
    terms: [
      {
        name: 'Regenerative Braking',
        explanation: 'A system where the electric motor reverses direction when you lift off the accelerator, acting as a generator to slow the car down and feed electricity back into the battery.',
        why: 'Recovers free range while driving down slopes or stopping, and saves your physical brakes from wearing out.',
        example: 'Like a small dynamo generator attached to a bicycle tire that generates power to light up a bulb as you coast.'
      }
    ]
  },
  {
    id: 'guide-6',
    chapter: 'Chapter 06',
    title: 'Running Cost',
    summary: 'Running an EV costs ₹1 to ₹1.5 per kilometer, compared to ₹7 to ₹9 per kilometer for a petrol car.',
    content: 'The biggest benefit of EV ownership is the daily savings. Charging an EV at home using domestic electricity is much cheaper than buying petrol. In India, fuel costs for an EV average around ₹1 to ₹1.5 per km, compared to ₹7 to ₹9 per km for a petrol car. If you have solar panels at home, your fuel cost can drop to virtually zero.',
    diagram: `<svg viewBox="0 0 400 150" class="w-full max-w-lg mx-auto bg-zinc-50 border border-zinc-200 p-4"><text x="10" y="20" font-family="monospace" font-size="9" font-weight="bold" fill="black">RUNNING COST PER KILOMETER (INR)</text><g transform="translate(10, 45)"><rect x="100" y="5" width="220" height="20" fill="black"/><text x="15" y="18" font-family="monospace" font-size="9" fill="black">PETROL CAR</text><text x="330" y="18" font-family="monospace" font-size="9" fill="black" font-weight="bold">₹8.50 / km</text></g><g transform="translate(10, 85)"><rect x="100" y="5" width="31" height="20" fill="#10b981"/><text x="15" y="18" font-family="monospace" font-size="9" fill="black">EV (GRID)</text><text x="140" y="18" font-family="monospace" font-size="9" fill="black" font-weight="bold">₹1.20 / km</text></g></svg>`,
    terms: [
      {
        name: 'Net Metering',
        explanation: 'A billing mechanism that credits solar energy system owners for the excess electricity they feed back into the grid.',
        why: 'Allows you to offset your night-time EV charging costs by generating excess solar power during the day.',
        example: 'Like a digital reward wallet where you save points in the afternoon to buy groceries at night.'
      }
    ]
  }
];


// --- Charging Stations Database ---
const STATIONS_DATABASE = [
  { city: 'mumbai', name: 'Tata Power EZ Charger - Bandra', type: 'Fast', speed: '60 kW', address: 'Turner Road, Bandra West', status: 'Available' },
  { city: 'mumbai', name: 'Zeon Charging - Lower Parel', type: 'Fast', speed: '120 kW', address: 'Phoenix Palladium Mall', status: 'In Use' },
  { city: 'mumbai', name: 'Jio-bp pulse - Andheri East', type: 'Normal', speed: '22 kW', address: 'WEH Metro Station', status: 'Available' },
  { city: 'delhi', name: 'Fortum Charge & Drive - Connaught Place', type: 'Fast', speed: '50 kW', address: 'Outer Circle, Block E', status: 'Available' },
  { city: 'delhi', name: 'Statcon Energia - Saket', type: 'Normal', speed: '22 kW', address: 'Select Citywalk Mall', status: 'Available' },
  { city: 'bangalore', name: 'Ather Grid - Indiranagar', type: 'Fast', speed: '80 kW', address: '100 Feet Road', status: 'Available' },
  { city: 'bangalore', name: 'Shell Recharge - Whitefield', type: 'Fast', speed: '150 kW', address: 'ITPB Road', status: 'In Use' },
  { city: 'pune', name: 'Tata Power - Hinjawadi', type: 'Normal', speed: '22 kW', address: 'Phase 1 Tech Park', status: 'Available' }
];

// Wishlist array
let wishlistIds = [];

// --- Database Enrichment for Car Details Pages ---
function enrichDatabase() {
  EV_DATABASE.forEach(car => {
    // 1. Add variants if missing
    if (!car.variants) {
      const priceBase = car.priceVal;
      const isCrore = car.brand === 'bmw' || car.brand === 'audi' || car.brand === 'mercedes-benz';
      car.variants = [
        {
          name: 'Executive Core',
          price: isCrore ? `₹${(priceBase * 0.95).toFixed(2)} Crore` : `₹${(priceBase * 0.95).toFixed(2)} Lakh`,
          priceVal: priceBase * 0.95,
          battery: `${(parseFloat(car.battery) * 0.85).toFixed(1)} kWh`,
          range: `${Math.floor(parseFloat(car.range) * 0.85)} km`,
          charging: car.charging,
          power: `${Math.floor(parseInt(car.power) * 0.85)} hp`,
          speed: car.speed,
          drivetrain: car.brand === 'bmw' || car.brand === 'kia' || car.brand === 'byd' ? 'RWD' : 'FWD'
        },
        {
          name: 'Empowered Luxury',
          price: car.price,
          priceVal: priceBase,
          battery: car.battery,
          range: car.range,
          charging: car.charging,
          power: car.power,
          speed: car.speed,
          drivetrain: car.brand === 'bmw' || car.brand === 'kia' || car.brand === 'byd' ? 'RWD' : 'FWD'
        },
        {
          name: 'Performance Flagship',
          price: isCrore ? `₹${(priceBase * 1.15).toFixed(2)} Crore` : `₹${(priceBase * 1.15).toFixed(2)} Lakh`,
          priceVal: priceBase * 1.15,
          battery: `${(parseFloat(car.battery) * 1.15).toFixed(1)} kWh`,
          range: `${Math.floor(parseFloat(car.range) * 1.1)} km`,
          charging: car.charging,
          power: `${Math.floor(parseInt(car.power) * 1.25)} hp`,
          speed: `${Math.floor(parseInt(car.speed) * 1.1)} km/h`,
          drivetrain: car.brand === 'bmw' || car.brand === 'audi' || car.brand === 'kia' || car.brand === 'byd' ? 'AWD' : 'FWD'
        }
      ];
    }
    
    // 2. Add extra specifications if missing
    if (!car.torque) car.torque = car.brand === 'tata' || car.brand === 'mahindra' ? '250 Nm' : '350 Nm';
    if (!car.chargingAC) car.chargingAC = '7.5 hours (7.2 kW AC)';
    if (!car.clearance) car.clearance = car.brand === 'tata' || car.brand === 'mahindra' ? '190 mm' : '150 mm';
    if (!car.bootSpace) car.bootSpace = '380 Litres';
    if (!car.seating) car.seating = '5 Seater';
    if (!car.warranty) car.warranty = '8 Years / 1,60,000 km';
    
    // 3. Add features list if missing
    if (!car.featuresList) {
      car.featuresList = {
        exterior: ['LED Projector Headlamps', 'Alloy Wheels', 'Gloss Black Grille', 'Rear Spoiler'],
        interior: ['Premium Dual Tone Dashboard', 'Soft Touch Door Pads', 'Leather Wrapping'],
        safety: ['6 Airbags', 'Electronic Stability Program', 'ABS with EBD', 'ISOFIX Mounts'],
        infotainment: ['10.25-inch Touchscreen Navigation', 'Premium Audio Channels', 'OTA Wireless Updates'],
        adas: ['Lane Keep Assist', 'Blind Spot Monitoring', 'Adaptive Cruise Control', 'Emergency Brake Assist'],
        comfort: ['Wireless Smartphone Charging', 'Smart Keyless Access', 'Ventilated Climate Seats']
      };
    }
    
    // 4. Add expert review if missing
    if (!car.expertReview) {
      car.expertReview = {
        rating: car.id === 'ioniq-5' ? '4.8 / 5' : '4.5 / 5',
        verdict: `A highly competent and premium EV that represents the absolute future of zero-emission mobility in its category. Highly recommended.`,
        pros: ['Exceptional ride stability', 'Class-leading charging speed', 'Futuristic design aesthetics'],
        cons: ['Limited rear visibility', 'Steering feedback is muted']
      };
    }
    
    // 5. Add customer reviews if missing
    if (!car.customerReviews) {
      car.customerReviews = [
        {
          author: 'Aniruddh D.',
          duration: '6 Months',
          score: '5.0 / 5',
          feedback: `Running costs dropped significantly. Charging at home overnight is extremely convenient. Driving dynamics in sports mode are punchy.`
        },
        {
          author: 'Kabir M.',
          duration: '12 Months',
          score: '4.5 / 5',
          feedback: `Outstanding highway range. I regularly get over 500 km on a single charge. Cabin build quality feels incredibly high-end.`
        }
      ];
    }
  });
}
enrichDatabase();

// --- Preloader Engine ---
const preloader = document.getElementById('preloader');
const loaderProgress = document.getElementById('loader-progress');
const loaderPercent = document.getElementById('loader-percent');

function runPreloader() {
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('preloader-hidden');
        document.body.classList.add('loaded'); // Trigger hero section luxury page-load sequence
        setTimeout(() => preloader.style.display = 'none', 700);
      }, 300);
    }
    loaderProgress.style.width = progress + '%';
    loaderPercent.textContent = progress + '%';
  }, 40);
}
window.addEventListener('DOMContentLoaded', runPreloader);


// --- Active Filters Setup ---
let activeBrand = null;
let activeBudget = null;
let activeRecentlyViewed = false;

function addToRecentlyViewed(carId) {
  try {
    let list = JSON.parse(localStorage.getItem('recently_viewed_evs') || '[]');
    list = list.filter(id => id !== carId);
    list.unshift(carId);
    if (list.length > 6) list.pop();
    localStorage.setItem('recently_viewed_evs', JSON.stringify(list));
  } catch (e) {
    console.error(e);
  }
}

const carCarouselViewport = document.getElementById('car-carousel-viewport');
const brandChips = document.querySelectorAll('.brand-chip');
const budgetChips = document.querySelectorAll('.budget-chip');
const filterResetContainer = document.getElementById('filter-reset-container');
const wishlistBadge = document.getElementById('wishlist-badge');

function getSpecGridHtml(car) {
  if (car.sections.includes('upcoming')) {
    return `
      <div>EXPECTED: <span class="text-zinc-800 font-bold">${car.launchDate || 'Soon'}</span></div>
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div class="col-span-2 truncate text-zinc-500" title="${car.features}">${car.features}</div>
    `;
  } else if (car.sections.includes('launches')) {
    return `
      <div>LAUNCHED: <span class="text-zinc-800 font-bold">${car.launchDate || 'Recently'}</span></div>
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div class="col-span-2 truncate text-zinc-500" title="${car.features}">${car.features}</div>
    `;
  } else {
    return `
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div>TOP SPEED: <span class="text-zinc-800">${car.speed}</span></div>
      <div class="col-span-2 truncate text-zinc-500" title="${car.features}">${car.features}</div>
    `;
  }
}

function createCarCardHtml(car, extraClasses = '') {
  const isWishlisted = wishlistIds.includes(car.id);
  return `
    <div class="car-card ${extraClasses} border border-zinc-200 bg-white p-6 flex flex-col justify-between h-[420px] relative group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] stagger-card">
      <button class="wishlist-btn absolute top-4 right-4 z-20" data-id="${car.id}" aria-label="Toggle Wishlist">
        <svg viewBox="0 0 24 24" class="w-4 h-4 ${isWishlisted ? 'fill-current' : ''}">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

      <div class="h-40 bg-zinc-50 flex items-center justify-center mb-4 relative overflow-hidden select-none border border-zinc-100">
        <!-- Skeleton Shimmer -->
        <div class="absolute inset-0 skeleton-shimmer"></div>
        <img src="${car.image}" alt="${car.name}" class="w-full h-full object-contain relative z-10 transition-transform duration-500" onload="this.previousElementSibling.classList.add('hidden')">
      </div>

      <div>
        <div class="flex justify-between items-start text-black">
          <div>
            <span class="font-mono text-[9px] text-zinc-500 uppercase">${car.brand}</span>
            <h3 class="text-lg font-bold mt-0.5 text-black">${car.name}</h3>
          </div>
          <span class="font-mono text-sm font-bold text-black">${car.price}</span>
        </div>
        
        <!-- Spec Grid -->
        <div class="grid grid-cols-2 gap-y-1.5 gap-x-4 my-3 text-[10px] text-zinc-500 border-t border-zinc-100 pt-3 font-mono">
          ${getSpecGridHtml(car)}
        </div>
      </div>

      <button class="w-full py-2.5 border border-zinc-200 hover:border-black text-zinc-500 hover:text-white hover:bg-black font-mono text-[9px] uppercase tracking-widest transition-all btn-view-details" data-id="${car.id}">
        VIEW DETAILS
      </button>
    </div>
  `;
}

function renderAllCarousels() {
  // 1. Popular Cars
  if (carCarouselViewport) {
    carCarouselViewport.innerHTML = '';
    const popularCars = EV_DATABASE.filter(car => car.sections && car.sections.includes('popular'));
    
    // Apply filters
    const nameSearch = document.getElementById('search-car-name').value.toLowerCase().trim();
    const searchBrand = document.getElementById('search-car-brand').value;
    const searchBudget = document.getElementById('search-car-budget').value;
    
    const filteredPopular = popularCars.filter(car => {
      if (activeRecentlyViewed) {
        const list = JSON.parse(localStorage.getItem('recently_viewed_evs') || '[]');
        if (!list.includes(car.id)) return false;
      }
      if (activeBrand && car.brand !== activeBrand) return false;
      if (activeBudget) {
        if (activeBudget === '20' && car.priceVal >= 20) return false;
        if (activeBudget === '50' && (car.priceVal < 20 || car.priceVal > 50)) return false;
        if (activeBudget === 'above' && car.priceVal <= 50) return false;
      }
      if (nameSearch) {
        const matchesName = car.name.toLowerCase().includes(nameSearch);
        const matchesBrand = car.brand.toLowerCase().includes(nameSearch);
        const numVal = parseFloat(nameSearch);
        const matchesBudget = !isNaN(numVal) && car.priceVal <= numVal;
        const matchesRange = !isNaN(numVal) && car.rangeVal >= numVal;
        if (!matchesName && !matchesBrand && !matchesBudget && !matchesRange) return false;
      }
      if (searchBrand !== 'all' && car.brand !== searchBrand) return false;
      if (searchBudget !== 'all') {
        if (searchBudget === '20' && car.priceVal >= 20) return false;
        if (searchBudget === '50' && (car.priceVal < 20 || car.priceVal > 50)) return false;
        if (searchBudget === 'above' && car.priceVal <= 50) return false;
      }
      return true;
    });
    
    if (activeBrand || activeBudget || activeRecentlyViewed || nameSearch || searchBrand !== 'all' || searchBudget !== 'all') {
      filterResetContainer.classList.remove('hidden');
    } else {
      filterResetContainer.classList.add('hidden');
    }
    
    if (filteredPopular.length === 0) {
      carCarouselViewport.innerHTML = `
        <div class="w-full text-center py-16 font-mono text-zinc-650 text-xs">
          NO ELECTRIC VEHICLES FOUND MATCHING ACTIVE BROWSE CRITERIA.
        </div>
      `;
    } else {
      filteredPopular.forEach(car => {
        carCarouselViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start');
      });
    }
  }
  
  // 2. Latest EV Launches
  const launchesViewport = document.getElementById('launch-carousel-viewport');
  if (launchesViewport) {
    launchesViewport.innerHTML = '';
    const launchesCars = EV_DATABASE.filter(car => car.sections && car.sections.includes('launches'));
    launchesCars.forEach(car => {
      launchesViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start');
    });
  }
  
  // 3. Upcoming Electric Cars
  const upcomingViewport = document.getElementById('up-carousel-viewport');
  if (upcomingViewport) {
    upcomingViewport.innerHTML = '';
    const upcomingCars = EV_DATABASE.filter(car => car.sections && car.sections.includes('upcoming'));
    upcomingCars.forEach(car => {
      upcomingViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start');
    });
  }
  
  attachCardEvents();
}

function attachCardEvents() {
  // Wishlist clicks
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const carId = btn.getAttribute('data-id');
      toggleWishlist(carId);
    });
  });

  // View Details clicks
  document.querySelectorAll('.btn-view-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const carId = btn.getAttribute('data-id');
      openCarDetails(carId);
    });
  });
}

function toggleWishlist(carId) {
  const index = wishlistIds.indexOf(carId);
  if (index === -1) {
    wishlistIds.push(carId);
  } else {
    wishlistIds.splice(index, 1);
  }
  
  // Update badge UI
  if (wishlistIds.length > 0) {
    wishlistBadge.textContent = wishlistIds.length;
    wishlistBadge.classList.remove('scale-0');
    wishlistBadge.classList.add('scale-100');
  } else {
    wishlistBadge.classList.remove('scale-100');
    wishlistBadge.classList.add('scale-0');
  }
  
  renderAllCarousels();
}

// Reset browse logic
document.getElementById('filter-reset-btn').addEventListener('click', () => {
  activeBrand = null;
  activeBudget = null;
  activeRecentlyViewed = false;
  
  brandChips.forEach(c => c.classList.remove('selected'));
  budgetChips.forEach(c => c.classList.remove('selected'));
  
  document.getElementById('search-car-name').value = '';
  document.getElementById('search-car-brand').value = 'all';
  document.getElementById('search-car-budget').value = 'all';
  
  renderAllCarousels();
});

// Brand chips redirects
brandChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const brand = chip.getAttribute('data-brand');
    navigateTo('/brand/' + brand);
  });
});

// Budget chips toggles
budgetChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const budget = chip.getAttribute('data-budget');
    if (activeBudget === budget) {
      activeBudget = null;
      chip.classList.remove('selected');
    } else {
      activeBudget = budget;
      budgetChips.forEach(c => c.classList.remove('selected'));
      chip.classList.add('selected');
    }
    renderAllCarousels();
  });
});

// Search submit button click
document.getElementById('search-submit-btn').addEventListener('click', () => {
  renderAllCarousels();
  document.getElementById('popular-evs').scrollIntoView({ behavior: 'smooth' });
});

// Initial carousels load
renderAllCarousels();

function scrollCarousel(viewport, direction) {
  const isMobile = window.innerWidth < 640;
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  let scrollAmount = viewport.clientWidth;
  if (isTablet) {
    scrollAmount = viewport.clientWidth / 2;
  } else if (!isMobile) {
    scrollAmount = viewport.clientWidth / 3;
  }
  
  if (direction === 'prev') {
    viewport.scrollLeft -= scrollAmount;
  } else {
    viewport.scrollLeft += scrollAmount;
  }
}

// Controls
document.getElementById('pop-car-prev').addEventListener('click', () => scrollCarousel(carCarouselViewport, 'prev'));
document.getElementById('pop-car-next').addEventListener('click', () => scrollCarousel(carCarouselViewport, 'next'));

const upCarouselViewport = document.getElementById('up-carousel-viewport');
document.getElementById('up-car-prev').addEventListener('click', () => scrollCarousel(upCarouselViewport, 'prev'));
document.getElementById('up-car-next').addEventListener('click', () => scrollCarousel(upCarouselViewport, 'next'));

const launchCarouselViewport = document.getElementById('launch-carousel-viewport');
document.getElementById('launch-car-prev').addEventListener('click', () => scrollCarousel(launchCarouselViewport, 'prev'));
document.getElementById('launch-car-next').addEventListener('click', () => scrollCarousel(launchCarouselViewport, 'next'));



// --- Section: Compare Cars Engine ---
const compSelectA = document.getElementById('comp-select-a');
const compSelectB = document.getElementById('comp-select-b');
const compHdrA = document.getElementById('comp-hdr-a');
const compHdrB = document.getElementById('comp-hdr-b');
const compTableBody = document.getElementById('comp-table-body');

function populateCompareDropdowns() {
  compSelectA.innerHTML = '';
  compSelectB.innerHTML = '';
  
  EV_DATABASE.forEach((car, index) => {
    const optA = document.createElement('option');
    optA.value = car.id;
    optA.textContent = car.name;
    if (index === 0) optA.selected = true; // Nexon initially
    compSelectA.appendChild(optA);

    const optB = document.createElement('option');
    optB.value = car.id;
    optB.textContent = car.name;
    if (index === 2) optB.selected = true; // Ioniq 5 initially
    compSelectB.appendChild(optB);
  });
}

function updateCompareTable() {
  const carIdA = compSelectA.value;
  const carIdB = compSelectB.value;
  
  const carA = EV_DATABASE.find(c => c.id === carIdA);
  const carB = EV_DATABASE.find(c => c.id === carIdB);
  
  if (!carA || !carB) return;
  
  compHdrA.textContent = carA.name;
  compHdrB.textContent = carB.name;
  
  const compStateKey = document.getElementById('comp-state-select') ? document.getElementById('comp-state-select').value : 'delhi';

  const specs = [
    { label: 'PRICE (EX-SHOWROOM)', key: 'price' },
    { label: 'EST. ON-ROAD PRICE', key: 'onRoadPrice' },
    { label: 'BATTERY POWER', key: 'battery' },
    { label: 'DRIVING RANGE', key: 'range' },
    { label: 'CHARGING DURATION', key: 'charging' },
    { label: 'HIGHWAY READINESS', key: 'highwayReadiness' },
    { label: 'MOTOR POWER Output', key: 'power' },
    { label: 'MAX SPEED LIMIT', key: 'speed' },
    { label: 'SAFETY COEFFICIENT', key: 'safety' },
    { label: 'FEATURES SUMMARY', key: 'features' },
    { label: 'CHASSIS DIMENSIONS', key: 'dimensions' },
  ];
  
  compTableBody.innerHTML = '';
  specs.forEach(spec => {
    const row = document.createElement('tr');
    row.className = 'border-b border-zinc-200 hover:bg-zinc-50 transition-colors';
    
    let valA, valB;
    if (spec.key === 'highwayReadiness') {
      valA = getHighwayReadinessBadgeHtml(carA);
      valB = getHighwayReadinessBadgeHtml(carB);
    } else if (spec.key === 'onRoadPrice') {
      const dataA = getOnRoadPriceData(carA.priceVal, compStateKey);
      const dataB = getOnRoadPriceData(carB.priceVal, compStateKey);
      valA = dataA ? '<span class="font-bold text-black">' + formatCurrency(dataA.onRoad) + '</span><span class="block text-[8px] text-zinc-500 mt-0.5 font-mono">' + dataA.stateLabel + '</span>' : '-';
      valB = dataB ? '<span class="font-bold text-black">' + formatCurrency(dataB.onRoad) + '</span><span class="block text-[8px] text-zinc-500 mt-0.5 font-mono">' + dataB.stateLabel + '</span>' : '-';
    } else {
      valA = carA[spec.key];
      valB = carB[spec.key];
    }

    row.innerHTML = `
      <td class="p-4 font-bold text-zinc-500 uppercase text-[9px] tracking-wider">${spec.label}</td>
      <td class="p-4 text-zinc-800">${valA}</td>
      <td class="p-4 text-zinc-800">${valB}</td>
    `;
    compTableBody.appendChild(row);
  });
}

populateCompareDropdowns();
updateCompareTable();

compSelectA.addEventListener('change', updateCompareTable);
compSelectB.addEventListener('change', updateCompareTable);

const compStateSelect = document.getElementById('comp-state-select');
if (compStateSelect) compStateSelect.addEventListener('change', updateCompareTable);


// --- Section: Charging Stations Finder ---
const stationSearchInput = document.getElementById('station-search-input');
const filterChargerFast = document.getElementById('filter-charger-fast');
const filterChargerNormal = document.getElementById('filter-charger-normal');
const stationsListContainer = document.getElementById('stations-list-container');

function renderChargingStations() {
  const query = stationSearchInput.value.toLowerCase().trim();
  const showFast = filterChargerFast.checked;
  const showNormal = filterChargerNormal.checked;
  
  stationsListContainer.innerHTML = '';
  
  const filtered = STATIONS_DATABASE.filter(st => {
    if (query && !st.city.includes(query) && !st.name.toLowerCase().includes(query)) return false;
    if (st.type === 'Fast' && !showFast) return false;
    if (st.type === 'Normal' && !showNormal) return false;
    return true;
  });
  
  if (filtered.length === 0) {
    stationsListContainer.innerHTML = `
      <div class="text-center py-8 text-zinc-600 font-mono text-[10px]">
        NO CHARGERS FOUND IN LOCATION BOUNDS.
      </div>
    `;
    return;
  }
  
  filtered.forEach(st => {
    const item = document.createElement('div');
    item.className = 'border-b border-zinc-100 pb-3 text-left font-mono';
    item.innerHTML = `
      <div class="flex justify-between items-start text-xs">
        <div>
          <h4 class="font-bold text-zinc-850">${st.name}</h4>
          <span class="text-[9px] text-zinc-500">${st.address}</span>
        </div>
        <div class="text-right">
          <span class="px-1.5 py-0.5 bg-zinc-100 text-[8px] text-zinc-655 border border-zinc-200 uppercase">${st.type} [${st.speed}]</span>
          <span class="text-[8px] block mt-1 ${st.status === 'Available' ? 'text-black font-bold' : 'text-zinc-400'}">${st.status.toUpperCase()}</span>
        </div>
      </div>
    `;
    stationsListContainer.appendChild(item);
  });
}

// Initial stations list load (using Mumbai as search default query placeholder)
renderChargingStations();
stationSearchInput.addEventListener('input', renderChargingStations);
filterChargerFast.addEventListener('change', renderChargingStations);
filterChargerNormal.addEventListener('change', renderChargingStations);


// --- Section: EMI Loan Calculator ---
const sliderPrice = document.getElementById('slider-price');
const sliderDown = document.getElementById('slider-down');
const sliderRate = document.getElementById('slider-rate');
const sliderTenure = document.getElementById('slider-tenure');

const lblPriceVal = document.getElementById('lbl-price-val');
const lblDownVal = document.getElementById('lbl-down-val');
const lblRateVal = document.getElementById('lbl-rate-val');
const lblTenureVal = document.getElementById('lbl-tenure-val');

const lblDownMin = document.getElementById('lbl-down-min');
const lblDownMax = document.getElementById('lbl-down-max');

const resLoanAmt = document.getElementById('res-loan-amt');
const resInterestRatio = document.getElementById('res-interest-ratio');
const emiCalcResult = document.getElementById('emi-calc-result');

function formatCurrency(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

function updateEMICalculator() {
  const price = parseInt(sliderPrice.value);
  
  // Down payment bounds adjust (min 10%, max 90%)
  const minDown = Math.floor(price * 0.1);
  const maxDown = Math.floor(price * 0.9);
  
  sliderDown.min = minDown;
  sliderDown.max = maxDown;
  
  // Make sure current down payment fits inside bounds
  let downVal = parseInt(sliderDown.value);
  if (downVal < minDown) {
    downVal = minDown;
    sliderDown.value = minDown;
  } else if (downVal > maxDown) {
    downVal = maxDown;
    sliderDown.value = maxDown;
  }
  
  const rate = parseFloat(sliderRate.value);
  const tenure = parseInt(sliderTenure.value);
  
  const loanAmt = price - downVal;
  
  // Label UI update
  lblPriceVal.textContent = formatCurrency(price);
  lblDownVal.textContent = formatCurrency(downVal);
  lblDownMin.textContent = formatCurrency(minDown);
  lblDownMax.textContent = formatCurrency(maxDown);
  lblRateVal.textContent = rate.toFixed(1) + '%';
  lblTenureVal.textContent = tenure + (tenure === 1 ? ' Year' : ' Years');
  
  resLoanAmt.textContent = formatCurrency(loanAmt);
  if (resInterestRatio) resInterestRatio.textContent = rate.toFixed(1) + '%';
  
  // Amortization Math Formula:
  // EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
  const monthlyRate = (rate / 12) / 100;
  const months = tenure * 12;
  
  let emi = 0;
  if (monthlyRate > 0) {
    const factor = Math.pow(1 + monthlyRate, months);
    emi = Math.floor(loanAmt * monthlyRate * factor / (factor - 1));
  } else {
    emi = Math.floor(loanAmt / months);
  }
  
  // Output update
  emiCalcResult.textContent = formatCurrency(emi);
}

sliderPrice.addEventListener('input', updateEMICalculator);
sliderDown.addEventListener('input', updateEMICalculator);
sliderRate.addEventListener('input', updateEMICalculator);
sliderTenure.addEventListener('input', updateEMICalculator);

updateEMICalculator(); // initial calculation call

// --- Petrol Savings Calculator (Landing Page) ---
function animateSavingsNumber(elementId, targetValue) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  const startValue = parseFloat(element.getAttribute('data-val') || '0');
  const duration = 300; // ms
  const startTime = performance.now();
  
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = progress * (2 - progress); // easeOutQuad
    const currentValue = startValue + (targetValue - startValue) * ease;
    
    element.textContent = '₹' + Math.round(currentValue).toLocaleString('en-IN');
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.setAttribute('data-val', targetValue);
      element.textContent = '₹' + Math.round(targetValue).toLocaleString('en-IN');
    }
  }
  
  requestAnimationFrame(update);
}

const selectSavingsEv = document.getElementById('savings-select-ev');
const sliderSavingsDist = document.getElementById('slider-savings-distance');
const sliderSavingsPetrol = document.getElementById('slider-savings-petrol-price');
const sliderSavingsTariff = document.getElementById('slider-savings-tariff');
const sliderSavingsPeriod = document.getElementById('slider-savings-period');

function updateLandingSavings() {
  if (!sliderSavingsDist || !sliderSavingsPetrol || !sliderSavingsTariff || !sliderSavingsPeriod) return;

  const dist = parseInt(sliderSavingsDist.value);
  const petrolPrice = parseFloat(sliderSavingsPetrol.value);
  const tariff = parseFloat(sliderSavingsTariff.value);
  const period = parseInt(sliderSavingsPeriod.value);

  // Display inputs
  document.getElementById('lbl-savings-distance').textContent = `${dist} km`;
  document.getElementById('lbl-savings-petrol-price').textContent = `₹${petrolPrice}`;
  document.getElementById('lbl-savings-tariff').textContent = `₹${tariff}`;
  document.getElementById('lbl-savings-period').textContent = `${period} ${period === 1 ? 'Year' : 'Years'}`;

  // Petrol car mileage: assumed 15 km/l
  const monthlyDist = dist * 30;
  const monthlyPetrolCost = (monthlyDist / 15) * petrolPrice;

  // Fetch EV efficiency from selected car
  let efficiency = 0.15; // default kWh/km if not found
  if (selectSavingsEv && selectSavingsEv.value) {
    const carId = selectSavingsEv.value;
    const car = EV_DATABASE.find(c => c.id === carId);
    if (car) {
      const battery = parseFloat(car.battery) || 50;
      const range = parseInt(car.range) || 400;
      efficiency = battery / range;
    }
  }

  const monthlyEvCost = monthlyDist * efficiency * tariff;
  const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);
  const annualSavings = monthlySavings * 12;
  const totalSavings = annualSavings * period;

  document.getElementById('res-savings-petrol-cost').textContent = formatCurrency(Math.round(monthlyPetrolCost));
  document.getElementById('res-savings-ev-cost').textContent = formatCurrency(Math.round(monthlyEvCost));
  document.getElementById('res-savings-monthly').textContent = formatCurrency(Math.round(monthlySavings));
  document.getElementById('res-savings-annual').textContent = formatCurrency(Math.round(annualSavings));
  
  document.getElementById('lbl-savings-total-duration').textContent = `OVER ${period} ${period === 1 ? 'YEAR' : 'YEARS'}`;
  
  animateSavingsNumber('res-savings-total', Math.round(totalSavings));
}

if (selectSavingsEv) selectSavingsEv.addEventListener('change', updateLandingSavings);
if (sliderSavingsDist) sliderSavingsDist.addEventListener('input', updateLandingSavings);
if (sliderSavingsPetrol) sliderSavingsPetrol.addEventListener('input', updateLandingSavings);
if (sliderSavingsTariff) sliderSavingsTariff.addEventListener('input', updateLandingSavings);
if (sliderSavingsPeriod) sliderSavingsPeriod.addEventListener('input', updateLandingSavings);

// Populate EV Dropdown on landing page
if (selectSavingsEv) {
  selectSavingsEv.innerHTML = '';
  EV_DATABASE.forEach(car => {
    selectSavingsEv.innerHTML += `<option value="${car.id}">${car.name} (${car.brand.toUpperCase()})</option>`;
  });
  updateLandingSavings();
}


// --- Modal Management Modules ---
const modalTD = document.getElementById('modal-test-drive');
const modalSearch = document.getElementById('modal-search-overlay');
const modalVideo = document.getElementById('modal-video-overlay');
const modalInfo = document.getElementById('modal-info-reader');

// Close any open modal helper
document.querySelectorAll('.modal-close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    closeAllModals();
  });
});

function closeAllModals() {
  [modalTD, modalSearch, modalVideo, modalInfo].forEach(modal => {
    modal.classList.add('opacity-0', 'pointer-events-none');
  });
  // Clear video source to kill playbacks
  document.getElementById('video-modal-iframe').src = '';
}

// Book Test drive trigger
const tdCarSelect = document.getElementById('td-car');
function openTestDriveModal(preselectedCar = '') {
  // Populate dropdown selection inside form
  tdCarSelect.innerHTML = '';
  EV_DATABASE.forEach(car => {
    const opt = document.createElement('option');
    opt.value = car.id;
    opt.textContent = car.name;
    if (preselectedCar && car.name === preselectedCar) opt.selected = true;
    tdCarSelect.appendChild(opt);
  });
  
  modalTD.classList.remove('opacity-0', 'pointer-events-none');
}

document.querySelectorAll('.btn-book-test-drive').forEach(btn => {
  btn.addEventListener('click', () => {
    openTestDriveModal();
  });
});

document.getElementById('form-test-drive').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('TEST DRIVE REQUEST SUBMITTED. OUR LOCAL PARTNER NETWORK WILL CONTACT YOU SHORTLY.');
  closeAllModals();
});

// Search icon in nav
document.getElementById('search-nav-btn').addEventListener('click', () => {
  modalSearch.classList.remove('opacity-0', 'pointer-events-none');
  document.getElementById('global-search-input').focus();
});

document.getElementById('global-search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    document.getElementById('search-car-name').value = val;
    closeAllModals();
    renderAllCarousels();
    document.getElementById('popular-evs').scrollIntoView({ behavior: 'smooth' });
  }
});

// Video links
document.querySelectorAll('.btn-video-play').forEach(btn => {
  btn.addEventListener('click', () => {
    const url = btn.getAttribute('data-video');
    const title = btn.getAttribute('data-title');
    
    document.getElementById('video-modal-title').textContent = title;
    document.getElementById('video-modal-iframe').src = url;
    
    modalVideo.classList.remove('opacity-0', 'pointer-events-none');
  });
});

// Info/Read More button modal triggers
const infoText = document.getElementById('info-reader-text');
document.querySelectorAll('.btn-read-more').forEach(btn => {
  btn.addEventListener('click', () => {
    const topicText = btn.getAttribute('data-topic');
    infoText.textContent = topicText;
    modalInfo.classList.remove('opacity-0', 'pointer-events-none');
  });
});

// Dynamic local image checker for additional vehicle gallery assets
async function getVehicleImages(car) {
  const images = [car.image];
  
  // Potential suffixes for additional views
  const suffixes = ['_front', '_rear', '_side', '_interior', '_dashboard', '_1', '_2', '_3'];
  const dotIndex = car.image.lastIndexOf('.');
  if (dotIndex === -1) return images;
  
  const baseName = car.image.substring(0, dotIndex);
  const ext = car.image.substring(dotIndex);
  
  for (const suffix of suffixes) {
    const testUrl = `${baseName}${suffix}${ext}`;
    try {
      // Lightweight HEAD request to check asset existence without downloading
      const response = await fetch(testUrl, { method: 'HEAD' });
      if (response.ok) {
        images.push(testUrl);
      }
    } catch (e) {
      // ignore
    }
  }
  return images;
}

// Redirect openCarDetails to SPA path for detailed page view
function openCarDetails(carId) {
  navigateTo(`/cars/${carId}`);
}


// --- Newsletter Form Submission ---
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('NEWSLETTER REGISTRATION SECURE. THANKS FOR SUBSCRIBING.');
  e.target.reset();
});


// --- FAQ Accordion toggle Module ---
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const parent = trigger.parentElement;
    const icon = trigger.querySelector('.acc-icon');
    
    // Close other panels
    document.querySelectorAll('.accordion-content').forEach(c => {
      if (c !== content) {
        c.style.maxHeight = null;
        c.parentElement.querySelector('.acc-icon').textContent = '+';
      }
    });
    
    if (content.style.maxHeight) {
      content.style.maxHeight = null;
      icon.textContent = '+';
    } else {
      content.style.maxHeight = content.scrollHeight + 'px';
      icon.textContent = '-';
    }
  });
});

// ==========================================
//        PREMIUM INTERACTIVITY ENGINE
// ==========================================

// --- 1. Premium Mega Menu Interaction Engine ---
const megaTriggers = document.querySelectorAll('.mega-trigger');
const megaPanels = document.querySelectorAll('.mega-panel');
const megaBackdrop = document.getElementById('mega-backdrop');
const megaHamburger = document.getElementById('mega-hamburger');
const mobileDrawer = document.getElementById('mega-mobile-drawer');

let activePanel = null;
let panelTimeout = null;

// Helper to open a mega panel
function openMegaPanel(panelId) {
  clearTimeout(panelTimeout);
  
  // Hide other panels
  megaPanels.forEach(panel => {
    if (panel.getAttribute('id') !== panelId) {
      panel.classList.add('hidden');
      panel.classList.remove('mega-panel-visible');
    }
  });

  const panel = document.getElementById(panelId);
  if (panel) {
    panel.classList.remove('hidden');
    // Force reflow for transition
    panel.offsetHeight;
    panel.classList.add('mega-panel-visible');
    activePanel = panel;
    
    if (megaBackdrop) {
      megaBackdrop.classList.remove('hidden');
      megaBackdrop.offsetHeight;
      megaBackdrop.classList.add('opacity-100');
    }
  }
}

// Helper to close mega panels
function closeMegaPanels() {
  clearTimeout(panelTimeout);
  panelTimeout = setTimeout(() => {
    megaPanels.forEach(panel => {
      panel.classList.remove('mega-panel-visible');
      setTimeout(() => {
        if (!panel.classList.contains('mega-panel-visible')) {
          panel.classList.add('hidden');
        }
      }, 200);
    });
    
    if (megaBackdrop) {
      megaBackdrop.classList.remove('opacity-100');
      setTimeout(() => {
        if (!megaBackdrop.classList.contains('opacity-100')) {
          megaBackdrop.classList.add('hidden');
        }
      }, 200);
    }
    activePanel = null;
  }, 100);
}

// Bind hover listeners for desktop
megaTriggers.forEach(trigger => {
  const megaId = trigger.getAttribute('data-mega');
  const panelId = `mega-panel-${megaId}`;
  
  trigger.addEventListener('mouseenter', () => {
    openMegaPanel(panelId);
  });
  
  trigger.addEventListener('mouseleave', () => {
    closeMegaPanels();
  });
});

megaPanels.forEach(panel => {
  panel.addEventListener('mouseenter', () => {
    clearTimeout(panelTimeout);
  });
  
  panel.addEventListener('mouseleave', () => {
    closeMegaPanels();
  });
});

if (megaBackdrop) {
  megaBackdrop.addEventListener('mouseenter', () => {
    closeMegaPanels();
  });
}

// Active State Management based on scroll
function updateActiveNavTrigger(sectionId) {
  document.querySelectorAll('.mega-trigger, .mega-nav-item').forEach(el => {
    el.classList.remove('mega-active');
  });
  
  if (!sectionId || sectionId === 'home') {
    const homeLink = document.querySelector('.mega-nav-item[href="#home"]');
    if (homeLink) homeLink.classList.add('mega-active');
  } else if (['popular-evs', 'launches', 'upcoming', 'browse', 'compare'].includes(sectionId)) {
    const trigger = document.querySelector('.mega-trigger[data-mega="discover"]');
    if (trigger) trigger.classList.add('mega-active');
  } else if (['trip-planner', 'emi', 'petrol-savings', 'stations'].includes(sectionId)) {
    const trigger = document.querySelector('.mega-trigger[data-mega="tools"]');
    if (trigger) trigger.classList.add('mega-active');
  } else if (['guide', 'faq'].includes(sectionId)) {
    const trigger = document.querySelector('.mega-trigger[data-mega="learn"]');
    if (trigger) trigger.classList.add('mega-active');
  } else if (['news', 'videos'].includes(sectionId)) {
    const trigger = document.querySelector('.mega-trigger[data-mega="news"]');
    if (trigger) trigger.classList.add('mega-active');
  }
}

// Mobile Hamburger toggle
if (megaHamburger && mobileDrawer) {
  megaHamburger.addEventListener('click', () => {
    const isOpen = megaHamburger.classList.contains('open');
    if (isOpen) {
      megaHamburger.classList.remove('open');
      megaHamburger.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.add('translate-x-full');
    } else {
      megaHamburger.classList.add('open');
      megaHamburger.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.remove('translate-x-full');
    }
  });
}

// Mobile Accordions trigger
const accordionTriggers = document.querySelectorAll('.mobile-accordion-trigger');
accordionTriggers.forEach(trigger => {
  trigger.addEventListener('click', () => {
    const parent = trigger.parentElement;
    const body = parent.querySelector('.mobile-accordion-body');
    const isExpanded = parent.classList.contains('open');
    
    // Close other mobile accordions
    document.querySelectorAll('.mobile-accordion').forEach(acc => {
      if (acc !== parent) {
        acc.classList.remove('open');
        const b = acc.querySelector('.mobile-accordion-body');
        if (b) b.style.maxHeight = null;
      }
    });
    
    if (isExpanded) {
      parent.classList.remove('open');
      if (body) body.style.maxHeight = null;
    } else {
      parent.classList.add('open');
      if (body) body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

// Close drawer helper
function closeMobileDrawer() {
  if (megaHamburger && mobileDrawer) {
    megaHamburger.classList.remove('open');
    megaHamburger.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.add('translate-x-full');
  }
}

// Smooth scrolling and navigation logic
let isScrollingFromNav = false;

// Intercept all links in mega panels or drawer
document.querySelectorAll('.mega-item, .mobile-sub-link, .mega-nav-item, .mobile-nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    
    // Check if Recently Viewed clicked
    if (text.includes('Recently Viewed') || link.id === 'nav-btn-recently-viewed') {
      e.preventDefault();
      closeMegaPanels();
      closeMobileDrawer();
      activeRecentlyViewed = true;
      renderAllCarousels();
      
      const isSubpage = !detailsPageContent.classList.contains('hidden');
      if (isSubpage) {
        navigateTo('/');
        setTimeout(() => {
          const tEl = document.getElementById('popular-evs');
          if (tEl) tEl.scrollIntoView({ behavior: 'smooth' });
        }, 120);
      } else {
        const tEl = document.getElementById('popular-evs');
        if (tEl) tEl.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }
    
    // Check if Real World Range Calculator clicked
    if (text.includes('Real World Range Calculator') || link.id === 'nav-btn-range-calc') {
      e.preventDefault();
      closeMegaPanels();
      closeMobileDrawer();
      navigateTo('/cars/nexon-ev');
      setTimeout(() => {
        const rangeEl = document.getElementById('range-traffic');
        if (rangeEl) rangeEl.scrollIntoView({ behavior: 'smooth' });
      }, 300);
      return;
    }

    if (!href || !href.startsWith('#')) return;
    
    e.preventDefault();
    closeMegaPanels();
    closeMobileDrawer();
    
    // Clear recently viewed filter for other normal navigation links
    activeRecentlyViewed = false;
    renderAllCarousels();
    
    const targetId = href;
    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      isScrollingFromNav = true;
      
      const isSubpage = !detailsPageContent.classList.contains('hidden');
      if (isSubpage) {
        navigateTo('/');
        setTimeout(() => {
          const tEl = document.querySelector(targetId);
          if (tEl) {
            tEl.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => { isScrollingFromNav = false; }, 850);
          }
        }, 120);
      } else {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { isScrollingFromNav = false; }, 850);
      }
      
      // Update active highlights
      updateActiveNavTrigger(targetId.substring(1));
    }
  });
});

// Intersection observer scrollspy for active parent trigger
const spySections = [
  document.getElementById('home'),
  document.getElementById('popular-evs'),
  document.getElementById('compare'),
  document.getElementById('upcoming'),
  document.getElementById('news'),
  document.getElementById('reviews'),
  document.getElementById('stations'),
  document.getElementById('emi'),
  document.getElementById('trip-planner'),
  document.getElementById('guide'),
  document.getElementById('faq'),
  document.getElementById('petrol-savings'),
  document.getElementById('launches')
].filter(Boolean);

const spyObserver = new IntersectionObserver((entries) => {
  if (isScrollingFromNav) return;
  
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      updateActiveNavTrigger(id);
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

spySections.forEach(sec => spyObserver.observe(sec));

// Set initial active state after preloader
window.addEventListener('load', () => {
  setTimeout(() => {
    updateActiveNavTrigger('home');
  }, 1050);
});



// --- 2. Scroll Reveal Animations ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.05,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal-on-scroll').forEach(el => revealObserver.observe(el));


// --- 3. Image Parallax Scrolling (Hero Background & Card SVGs) ---
const heroBgImg = document.getElementById('hero-bg-img');
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const viewportHeight = window.innerHeight;
  
  // Hero background parallax
  if (heroBgImg && scrolled < viewportHeight) {
    heroBgImg.style.transform = `translateY(${scrolled * 0.15}px) scale(1.02)`;
  }
  
  // Card Images scroll parallax
  const cardImages = document.querySelectorAll('.car-card img, .upcoming-card img, .launch-card img');
  cardImages.forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < viewportHeight && rect.bottom > 0) {
      const relativeY = (rect.top + rect.height / 2) - (viewportHeight / 2);
      // Translate Image gently vertically based on scroll offset relative to viewport center
      const translateY = relativeY * 0.05;
      img.style.setProperty('--scroll-translate-y', `${translateY}px`);
    }
  });
});


// --- 4. Grayscale Click Ripple Animation ---
const rippleTargets = '.btn-animate, .brand-chip, .budget-chip, #pop-car-prev, #pop-car-next, #up-car-prev, #up-car-next, .accordion-trigger, .nav-link';

document.addEventListener('click', (e) => {
  const target = e.target.closest(rippleTargets);
  if (!target) return;
  
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = `${size}px`;
  
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  
  if (getComputedStyle(target).position === 'static') {
    target.style.position = 'relative';
  }
  
  target.appendChild(ripple);
  
  ripple.addEventListener('animationend', () => {
    ripple.remove();
  });
});

// --- 5. Dynamic Navbar Theme Toggle (Dark on Hero, Light on White Sections) ---
function handleNavbarTheme() {
  const navElement = document.querySelector('nav');
  const heroSection = document.getElementById('home');
  if (!navElement || !heroSection) return;
  
  const heroHeight = heroSection.offsetHeight;
  const navHeight = navElement.offsetHeight;
  const scrolled = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
  
  // Transition threshold: scroll position meets the bottom of the hero section minus the navbar height
  if (scrolled >= (heroHeight - navHeight)) {
    navElement.classList.add('nav-light-theme');
  } else {
    navElement.classList.remove('nav-light-theme');
  }
}

// Bind navbar theme handlers
window.addEventListener('scroll', handleNavbarTheme);
window.addEventListener('resize', handleNavbarTheme);
window.addEventListener('DOMContentLoaded', handleNavbarTheme);
window.addEventListener('load', handleNavbarTheme);

// Also run check immediately to catch initial scroll state on load
handleNavbarTheme();


// ========================================================
//      INDIVIDUAL CAR DETAILS VIEW PAGES ROUTING
// ========================================================
const homepageContent = document.getElementById('homepage-content');
const detailsPageContent = document.getElementById('details-page-content');

// Helper to format absolute currency values dynamically
function formatCurrency(val) {
  return '₹' + Number(val).toLocaleString('en-IN');
}

function navigateTo(url) {
  try {
    history.pushState(null, '', url);
  } catch (e) {
    // Fallback to hash routing for file:// protocol or direct static server limits
    window.location.hash = url.startsWith('/') ? '#' + url : '#/' + url;
  }
  handleRouting();
}

function renderSubpage(title, breadcrumbs, contentHtml, backPath = '/') {
  if (homepageContent) homepageContent.classList.add('hidden');
  if (detailsPageContent) {
    detailsPageContent.classList.remove('hidden');
    
    // Generate breadcrumb items
    let breadcrumbHtml = `<a href="#/" class="hover:text-black transition-colors">HOME</a>`;
    breadcrumbs.forEach(b => {
      breadcrumbHtml += ` <span class="mx-2">/</span> <span class="text-zinc-500 uppercase">${b}</span>`;
    });
    
    detailsPageContent.innerHTML = `
      <div class="max-w-6xl mx-auto flex flex-col gap-8 text-left">
        <!-- Back & Breadcrumbs Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-150 pb-4 mt-6 gap-4">
          <button id="btn-subpage-back" class="px-5 py-2.5 border border-zinc-200 hover:border-black font-mono text-[9px] tracking-widest text-zinc-655 hover:text-black uppercase transition-all duration-300 self-start">
            ← BACK
          </button>
          <div class="font-mono text-[9px] text-zinc-400 uppercase">
            ${breadcrumbHtml}
          </div>
        </div>
        
        <!-- Subpage Content -->
        <div class="min-h-[400px]">
          ${contentHtml}
        </div>
      </div>
    `;
    
    // Bind back button
    document.getElementById('btn-subpage-back').addEventListener('click', () => {
      navigateTo(backPath);
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
  applyJargonBuster();
}

function handleRouting() {
  const path = window.location.pathname;
  const hash = window.location.hash;
  
  let route = '/';
  if (path.startsWith('/cars/')) {
    route = path;
  } else if (hash.startsWith('#/cars/')) {
    route = hash.substring(1);
  } else if (hash.startsWith('#cars/')) {
    route = '/' + hash.substring(1);
  } else if (path.startsWith('/view-all/')) {
    route = path;
  } else if (hash.startsWith('#/view-all/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/news/')) {
    route = path;
  } else if (hash.startsWith('#/news/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/guide/')) {
    route = path;
  } else if (hash.startsWith('#/guide/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/reviews/')) {
    route = path;
  } else if (hash.startsWith('#/reviews/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/brand/')) {
    route = path;
  } else if (hash.startsWith('#/brand/')) {
    route = hash.substring(1);
  }
  
  // Parse route parameters
  if (route.startsWith('/cars/')) {
    const carId = route.substring(6);
    const car = EV_DATABASE.find(c => c.id === carId);
    if (car) {
      renderCarDetailsPage(car);
      return;
    }
  } else if (route.startsWith('/view-all/')) {
    const section = route.substring(10);
    if (['popular', 'launches', 'upcoming'].includes(section)) {
      renderViewAllPage(section);
      return;
    }
  } else if (route.startsWith('/news/')) {
    const id = route.substring(6);
    if (id === 'all') {
      renderAllNewsPage();
      return;
    } else {
      const article = NEWS_DATABASE.find(a => a.id === id);
      if (article) {
        renderNewsArticlePage(article);
        return;
      }
    }
  } else if (route.startsWith('/guide/')) {
    const id = route.substring(7);
    const chapter = GUIDE_DATABASE.find(g => g.id === id);
    if (chapter) {
      renderGuideArticlePage(chapter);
      return;
    }
  } else if (route.startsWith('/hub/')) {
    const key = route.substring(5);
    renderHubArticlePage(key);
    return;
  } else if (route.startsWith('/reviews/')) {
    const type = route.substring(9);
    if (type === 'expert') {
      renderExpertReviewsPage();
      return;
    } else if (type === 'customer') {
      renderCustomerReviewsPage();
      return;
    }
  } else if (route.startsWith('/brand/')) {
    const brandId = route.substring(7);
    renderBrandPage(brandId);
    return;
  }
  
  restoreHomepage();
}

function restoreHomepage() {
  if (homepageContent) homepageContent.classList.remove('hidden');
  if (detailsPageContent) detailsPageContent.classList.add('hidden');
  
  // Clear hash if we are on the main landing page and it contains car details route
  const hash = window.location.hash;
  if (hash.includes('/cars/') || hash.includes('/view-all/') || hash.includes('/news/') || hash.includes('/guide/') || hash.includes('/reviews/') || hash.includes('/brand/')) {
    try {
      history.pushState(null, '', '/');
    } catch (e) {
      window.location.hash = '#/';
    }
  }
  
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
  applyJargonBuster();
  if (typeof initScrollDividers === 'function') initScrollDividers();
  if (typeof initRevealObservers === 'function') initRevealObservers();
}

// Re-route on browser back/forward buttons
window.addEventListener('popstate', handleRouting);
window.addEventListener('hashchange', handleRouting);

// Check path on page load
window.addEventListener('load', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);

// Intercept navigation triggers
document.addEventListener('DOMContentLoaded', () => {
  const logo = document.querySelector('.logo-link');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/');
      const hero = document.getElementById('home');
      if (hero) hero.scrollIntoView({ behavior: 'smooth' });
    });
  }
  
  // Dynamic Views Bindings
  const btnPopAll = document.getElementById('btn-view-all-popular');
  if (btnPopAll) {
    btnPopAll.addEventListener('click', () => navigateTo('/view-all/popular'));
  }
  
  const btnUpAll = document.getElementById('btn-view-all-upcoming');
  if (btnUpAll) {
    btnUpAll.addEventListener('click', () => navigateTo('/view-all/upcoming'));
  }
  
  const btnLaunchAll = document.getElementById('btn-view-all-launches');
  if (btnLaunchAll) {
    btnLaunchAll.addEventListener('click', () => navigateTo('/view-all/launches'));
  }
  
  const btnViewAllNews = document.getElementById('btn-view-all-news');
  if (btnViewAllNews) {
    btnViewAllNews.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/news/all');
    });
  }
  
  const btnExpert = document.getElementById('btn-view-all-expert-reviews');
  if (btnExpert) {
    btnExpert.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/reviews/expert');
    });
  }
  
  const btnCustomer = document.getElementById('btn-view-all-customer-reviews');
  if (btnCustomer) {
    btnCustomer.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/reviews/customer');
    });
  }
  
  // Render guides and news dynamically
  renderNewsAndGuides();
  if (typeof initScrollDividers === 'function') initScrollDividers();
  
  // Initialize new premium educational features
  if (typeof initWhyEVAccordion === 'function') initWhyEVAccordion();
  if (typeof renderEVGallery === 'function') renderEVGallery();
  if (typeof initEducationalModals === 'function') initEducationalModals();
  if (typeof initRevealObservers === 'function') initRevealObservers();
  
  // Bind instant search event listeners
  const nameSearchEl = document.getElementById('search-car-name');
  const brandSearchEl = document.getElementById('search-car-brand');
  const budgetSearchEl = document.getElementById('search-car-budget');
  if (nameSearchEl) nameSearchEl.addEventListener('input', renderAllCarousels);
  if (brandSearchEl) brandSearchEl.addEventListener('change', renderAllCarousels);
  if (budgetSearchEl) budgetSearchEl.addEventListener('change', renderAllCarousels);
  
  // Initialize automatic word-highlighting observer for "Electric"
  if (typeof initElectricHighlightObserver === 'function') initElectricHighlightObserver();
});

function renderNewsAndGuides() {
  const newsContainer = document.getElementById('news-grid-container');
  if (newsContainer) {
    newsContainer.innerHTML = '';
    NEWS_DATABASE.forEach(article => {
      newsContainer.innerHTML += `
        <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col justify-between h-[360px] group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] stagger-card news-card">
          <div>
            <div class="h-28 bg-zinc-100/50 border border-zinc-150 flex items-center justify-center mb-4 text-zinc-500 font-mono text-[8px]">
              IMAGE_PLACEHOLDER // ${article.id.toUpperCase()}
            </div>
            <div class="flex justify-between items-center text-[8px] text-zinc-500 font-mono mb-2">
              <span>${article.topic.toUpperCase()}</span>
              <span>${article.date.toUpperCase()}</span>
            </div>
            <h3 class="text-base font-bold leading-snug group-hover:text-zinc-700 transition-colors mb-2">${article.title}</h3>
            <p class="text-[11px] text-zinc-650 leading-normal">${article.summary}</p>
          </div>
          <button class="font-mono text-[10px] tracking-wider text-zinc-500 hover:text-black transition-colors self-end btn-read-news-more" data-id="${article.id}">
            Read More
          </button>
        </div>
      `;
    });
    
    // Bind clicks
    document.querySelectorAll('.btn-read-news-more').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        navigateTo(`/news/${id}`);
      });
    });
  }
  
  const guideContainer = document.getElementById('guide-grid-container');
  if (guideContainer) {
    guideContainer.innerHTML = '';
    GUIDE_DATABASE.forEach(chapter => {
      guideContainer.innerHTML += `
        <div class="border border-zinc-200 p-6 flex flex-col justify-between h-[240px] group hover:border-black transition-all bg-zinc-50 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] stagger-card guide-card">
          <div>
            <span class="font-mono text-[9px] text-zinc-500">${chapter.chapter.toUpperCase()}</span>
            <h3 class="text-base font-bold mt-1 mb-2">${chapter.title}</h3>
            <p class="text-[11px] text-zinc-655 leading-normal">${chapter.summary}</p>
          </div>
          <a href="#/guide/${chapter.id}" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-widest self-start">
            Learn More <span class="arrow">→</span>
          </a>
        </div>
      `;
    });
  }
}

function renderViewAllPage(section) {
  const sectionNames = {
    popular: 'Popular Electric Cars',
    launches: 'Latest EV Launches',
    upcoming: 'Upcoming Electric Cars'
  };
  const title = sectionNames[section];
  const breadcrumbs = ['MARKETPLACE', title];
  
  const sectionCars = EV_DATABASE.filter(car => car.sections && car.sections.includes(section));
  let cardsHtml = '';
  sectionCars.forEach(car => {
    cardsHtml += createCarCardHtml(car, 'w-full');
  });
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">GRID INDEX / ${sectionCars.length} VEHICLES</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">${title}</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        ${cardsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  attachCardEvents();
}

function renderAllNewsPage() {
  const title = 'Latest EV News';
  const breadcrumbs = ['RESOURCES', 'LATEST NEWS'];
  
  let newsHtml = '';
  NEWS_DATABASE.forEach(article => {
    newsHtml += `
      <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col justify-between h-[360px] group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] news-card">
        <div>
          <div class="h-28 bg-zinc-100/50 border border-zinc-150 flex items-center justify-center mb-4 text-zinc-500 font-mono text-[8px]">
            IMAGE_PLACEHOLDER // ${article.id.toUpperCase()}
          </div>
          <div class="flex justify-between items-center text-[8px] text-zinc-500 font-mono mb-2">
            <span>${article.topic.toUpperCase()}</span>
            <span>${article.date.toUpperCase()}</span>
          </div>
          <h3 class="text-base font-bold leading-snug group-hover:text-zinc-700 transition-colors mb-2">${article.title}</h3>
          <p class="text-[11px] text-zinc-650 leading-normal">${article.summary}</p>
        </div>
        <button class="font-mono text-[10px] tracking-wider text-zinc-500 hover:text-black transition-colors self-end btn-read-news-more" data-id="${article.id}">
          Read More
        </button>
      </div>
    `;
  });
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">JOURNAL INDEX / ${NEWS_DATABASE.length} DISPATCHES</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Latest EV News Dispatches</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        ${newsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  document.querySelectorAll('.btn-read-news-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      navigateTo(`/news/${id}`);
    });
  });
}

function renderNewsArticlePage(article) {
  const title = article.title;
  const breadcrumbs = ['RESOURCES', 'LATEST NEWS', 'ARTICLE'];
  
  const contentHtml = `
    <div class="max-w-3xl mx-auto flex flex-col gap-6 pt-6 font-mono text-zinc-800">
      <div class="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-widest border-b border-zinc-100 pb-2">
        <span>${article.topic}</span>
        <span>${article.date}</span>
      </div>
      <h1 class="text-2xl md:text-4xl font-black text-black leading-tight">${article.title}</h1>
      <div class="h-64 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 text-xs select-none">
        IMAGE_PLACEHOLDER // ${article.id.toUpperCase()}
      </div>
      <p class="text-sm leading-relaxed text-zinc-700 font-semibold border-l-2 border-black pl-4 my-2">${article.summary}</p>
      <p class="text-sm leading-relaxed text-black mt-4">${article.content}</p>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/news/all');
}

function renderGuideArticlePage(chapter) {
  const title = chapter.title;
  const breadcrumbs = ['RESOURCES', 'EV BUYING GUIDE', chapter.chapter];
  
  let termsHtml = '';
  if (chapter.terms && chapter.terms.length > 0) {
    chapter.terms.forEach(term => {
      termsHtml += `
        <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-4 shadow-sm my-4 text-left">
          <div class="border-b border-zinc-200 pb-2">
            <span class="text-[8px] text-zinc-500 uppercase tracking-widest font-mono font-bold block mb-1">TECHNICAL TERM CALLOUT</span>
            <h4 class="font-bold text-sm text-black font-mono">${term.name}</h4>
          </div>
          <div class="flex flex-col gap-3 font-mono text-[11px] leading-relaxed">
            <div>
              <span class="text-zinc-500 font-bold uppercase text-[8px] tracking-wider block mb-0.5">Simple Explanation:</span>
              <p class="text-zinc-850">${term.explanation}</p>
            </div>
            <div>
              <span class="text-zinc-500 font-bold uppercase text-[8px] tracking-wider block mb-0.5">Why It Matters:</span>
              <p class="text-zinc-850">${term.why}</p>
            </div>
            <div>
              <span class="text-zinc-500 font-bold uppercase text-[8px] tracking-wider block mb-0.5">Everyday Example:</span>
              <p class="text-zinc-850 italic">${term.example}</p>
            </div>
          </div>
        </div>
      `;
    });
  }

  const contentHtml = `
    <div class="max-w-3xl mx-auto flex flex-col gap-6 pt-6 font-mono text-zinc-800">
      <span class="text-[9px] text-zinc-500 uppercase tracking-widest border-b border-zinc-100 pb-2">${chapter.chapter}</span>
      <h1 class="text-2xl md:text-4xl font-black text-black leading-tight">${chapter.title}</h1>
      <p class="text-sm leading-relaxed text-zinc-700 font-semibold border-l-2 border-black pl-4 my-2">${chapter.summary}</p>
      
      <div class="my-6">
        <span class="text-[8px] text-zinc-500 uppercase tracking-widest block mb-3 text-center">SYSTEM SCHEMATIC DIAGRAM</span>
        ${chapter.diagram}
      </div>

      <p class="text-sm leading-relaxed text-black mt-4">${chapter.content}</p>
      
      ${termsHtml}
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderHubArticlePage(key) {
  const data = hubExplanations[key];
  if (!data) {
    navigateTo('/');
    return;
  }
  
  const title = data.title;
  const breadcrumbs = ['RESOURCES', 'KNOWLEDGE HUB', title.toUpperCase()];
  
  // Decide which image to show based on key
  let illustrationImg = 'why_ev_illustration.jpeg';
  if (key === 'battery-health' || key === 'lfp-nmc') {
    illustrationImg = 'battery_care_illustration.jpeg';
  } else if (key === 'regen-braking' || key === 'ac-dc' || key === 'v2l') {
    illustrationImg = 'WHY_BUY_EV.jpeg';
  }
  
  // Additional mock specs/features/benefits/FAQs specific to the hub article
  const articleInfo = {
    'regen-braking': {
      features: [
        'Kinetic Energy Recovery (converts movement back to battery charge)',
        'One-Pedal Driving mode (accelerate and brake using only the accelerator)',
        'Reduced brake pad wear (saves money on mechanical brake maintenance)'
      ],
      benefits: [
        'Extends city range by up to 15-20% through stop-and-go energy harvesting.',
        'Provides a smoother and more relaxed driving experience in urban congestion.',
        'Virtually eliminates brake dust, keeping wheels cleaner and reducing local particulates.'
      ],
      faqs: [
        { q: 'Does regenerative braking replace mechanical brakes?', a: 'No, mechanical friction brakes are always present and act as backup for sudden emergency stops.' },
        { q: 'Is it hard to learn how to drive with one-pedal mode?', a: 'Most drivers adapt in less than 15 minutes. It becomes natural very quickly.' }
      ]
    },
    'lfp-nmc': {
      features: [
        'LFP (Lithium Iron Phosphate): Superior thermal stability, lower cost, longer lifecycle.',
        'NMC (Nickel Manganese Cobalt): Higher energy density, better cold weather performance.',
        'Thermal Management: Liquid cooling systems keep battery temperatures optimal.'
      ],
      benefits: [
        'LFP is ideal for budget-oriented EVs, allowing 100% daily charging without degradation.',
        'NMC provides longer range for premium cars with smaller, lighter battery packs.',
        'Understanding your chemistry helps optimize charging habits for maximum lifespan.'
      ],
      faqs: [
        { q: 'Which chemistry is better for hot climates?', a: 'LFP is generally more robust in extremely hot temperatures due to its high thermal runaway threshold.' },
        { q: 'Can I charge NMC to 100% every day?', a: 'It is recommended to charge NMC to 80% for daily use to prolong its lifespan, whereas LFP can be charged to 100% regularly.' }
      ]
    },
    'ac-dc': {
      features: [
        'AC Charging (Alternating Current): Standard power used for overnight home and office charging.',
        'DC Fast Charging (Direct Current): High power used at highway rest stops to charge directly.',
        'Onboard Charger: Converts AC grid power into DC power for the battery.'
      ],
      benefits: [
        'AC charging is cheaper, gentler on the battery, and highly convenient for home routines.',
        'DC fast charging makes long-distance road trips viable, adding 200+ km in 15-30 minutes.',
        'Knowing the difference helps plan routes and choose the right charging gear.'
      ],
      faqs: [
        { q: 'Why does charging speed slow down after 80%?', a: 'To protect the battery from overheating, the battery management system reduces power intake as it nears full capacity.' },
        { q: 'Can I use a DC charger every single day?', a: 'Frequent DC fast charging can speed up battery degradation. AC charging is recommended for daily use.' }
      ]
    },
    'v2l': {
      features: [
        'Bidirectional Power Flow (battery discharges power out of the charging port)',
        'Built-in AC Outlets (standard wall sockets on the car exterior or interior)',
        'Safety Shutoff (stops discharging when car battery drops to a pre-set level, e.g. 20%)'
      ],
      benefits: [
        'Power appliances, laptops, camping gear, or power tools directly from your EV.',
        'Use your vehicle as a backup home generator during blackouts or emergencies.',
        'Charge another stranded electric vehicle on the road (Vehicle-to-Vehicle charging).'
      ],
      faqs: [
        { q: 'Will using V2L drain my car battery completely?', a: 'No, you can configure a safety limit in the car dashboard so V2L stops automatically, ensuring you always have enough range to drive home.' },
        { q: 'What appliances can I power with V2L?', a: 'Most EVs support up to 3.6kW, which can run refrigerators, microwave ovens, power tools, electric grills, and kettles.' }
      ]
    },
    'clearance': {
      features: [
        'Floor-mounted Battery Shielding (thick steel or titanium plates protecting the battery pack)',
        'Low Center of Gravity (batteries placed low between the axles improves stability on uneven roads)',
        'Adaptive Air Suspension (lifts the vehicle dynamically on rough terrain, in premium EVs)'
      ],
      benefits: [
        'High ground clearance (170mm-200mm) prevents battery scraping on large speed bumps.',
        'Reinforced underbody protection guards the battery against stones and road debris.',
        'Provides confidence when driving in monsoon flooded roads or rural tracks.'
      ],
      faqs: [
        { q: 'Does high ground clearance affect range?', a: 'Slightly. Taller vehicles have more aerodynamic drag, but clever EV design minimizes this impact.' },
        { q: 'Is it dangerous if the bottom of my EV scrapes?', a: 'EVs have extremely tough armor plates protecting the battery, but severe impact should always be inspected by a professional.' }
      ]
    },
    'battery-health': {
      features: [
        'SOH (State of Health): Percentage representing current battery capacity relative to new.',
        'BMS (Battery Management System): Active monitoring of cells to prevent degradation.',
        'Thermal Conditioning: Pre-heating or cooling cells before fast charging.'
      ],
      benefits: [
        'Maintains vehicle resale value through transparent health statistics.',
        'Ensures range predictions remain accurate over years of ownership.',
        'Prevents unexpected battery failure through early detection of weak cells.'
      ],
      faqs: [
        { q: 'How fast do EV batteries degrade?', a: 'Modern EV batteries lose only about 1-2% of their capacity per year. Most will outlast the vehicle itself.' },
        { q: 'What is the best way to maintain battery health?', a: 'Keep the charge between 20% and 80% for daily use, avoid parking in direct sunlight for long periods, and use slow AC charging when possible.' }
      ]
    },
    'etiquette': {
      features: [
        'Fair Use Policy (vacate charging space immediately when charge reaches target)',
        'Queue Management (booking chargers in advance via mobile apps)',
        'Clean Charging Bays (handling cables carefully and leaving space tidy)'
      ],
      benefits: [
        'Reduces waiting times and frustration for other EV drivers.',
        'Prevents parking fines or idle fees at busy charging hubs.',
        'Protects expensive charging hardware from damage and wear.'
      ],
      faqs: [
        { q: 'What is an "idle fee"?', a: 'A per-minute charge applied by network operators if your vehicle remains plugged in after charging is complete, to encourage vacating the spot.' },
        { q: 'Is it okay to unplug someone else’s car?', a: 'Only if their session has clearly finished, their charging light indicates complete, and the connector is unlocked.' }
      ]
    },
    'highway': {
      features: [
        'Route Planning Apps (PlugsShare, ABRP to map chargers along your journey)',
        'Cabin Pre-conditioning (heating or cooling while plugged in to save battery on the road)',
        'Optimal Speed Cruise (maintaining steady speed to maximize aerodynamic efficiency)'
      ],
      benefits: [
        'Eliminates range anxiety during long trips with predictable charging stops.',
        'Saves time by targeting fast DC chargers that match your vehicle\'s peak charging speed.',
        'Lowers trip costs by utilizing cheaper charging stations along the route.'
      ],
      faqs: [
        { q: 'How often should I stop to charge on a highway trip?', a: 'Every 2-3 hours of driving is typical. This matches normal driving break recommendations.' },
        { q: 'Do highway speeds drain the battery faster?', a: 'Yes. Driving at 110 km/h consumes significantly more energy than driving at 80-90 km/h due to aerodynamic drag.' }
      ]
    }
  };
  
  const details = articleInfo[key] || {
    features: ['Technical insights', 'Detailed systems layout', 'Safety protocols'],
    benefits: ['Optimized energy usage', 'Extended battery life', 'Lower operational costs'],
    faqs: [
      { q: 'How does this technology work?', a: 'It utilizes state-of-the-art EV principles to deliver efficient, silent, and sustainable performance.' },
      { q: 'Is it standard on all vehicles?', a: 'Most modern electric vehicles implement this feature to varying degrees depending on class and price.' }
    ]
  };

  let featuresHtml = '';
  details.features.forEach(f => {
    featuresHtml += `<li class="flex items-start gap-2.5">
      <span class="text-emerald-500 font-bold mt-0.5">•</span>
      <span class="text-zinc-800 font-mono text-[11px] leading-relaxed">${f}</span>
    </li>`;
  });

  let benefitsHtml = '';
  details.benefits.forEach(b => {
    benefitsHtml += `<li class="flex items-start gap-2.5">
      <span class="text-emerald-500 font-bold mt-0.5">+</span>
      <span class="text-zinc-800 font-mono text-[11px] leading-relaxed">${b}</span>
    </li>`;
  });

  let faqsHtml = '';
  details.faqs.forEach(faq => {
    faqsHtml += `
      <div class="accordion-item border border-zinc-200 bg-white rounded-xl p-4 flex flex-col gap-2">
        <button class="w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between">
          <span>${faq.q}</span>
          <span class="text-zinc-400 font-mono">+</span>
        </button>
        <p class="text-[11px] text-zinc-650 leading-relaxed font-mono mt-1 pt-2 border-t border-zinc-100">${faq.a}</p>
      </div>
    `;
  });

  const contentHtml = `
    <div class="max-w-3xl mx-auto flex flex-col gap-6 pt-6 text-left font-mono">
      <span class="text-[9px] text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2">KNOWLEDGE HUB // ARTICLE</span>
      <h1 class="text-2xl md:text-4xl font-black text-black leading-tight uppercase">${data.title}</h1>
      
      <div class="w-full aspect-[16/9] border border-zinc-200 bg-zinc-50 rounded-2xl overflow-hidden shadow-sm my-4 flex items-center justify-center">
        <img src="${illustrationImg}" alt="${data.title}" class="w-full h-full object-cover">
      </div>

      <div class="flex flex-col gap-6 my-2">
        <div>
          <span class="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Technical Overview:</span>
          <p class="text-sm leading-relaxed text-black">${data.explanation}</p>
        </div>
        
        <div class="border-l-2 border-black pl-4 my-2 bg-zinc-50/50 py-3 pr-2">
          <span class="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Everyday Analogy:</span>
          <p class="text-xs leading-relaxed text-zinc-700 italic font-medium">${data.analogy}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
        <div class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3">
          <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Key Features</h4>
          <ul class="flex flex-col gap-2.5">
            ${featuresHtml}
          </ul>
        </div>
        
        <div class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3">
          <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Major Benefits</h4>
          <ul class="flex flex-col gap-2.5">
            ${benefitsHtml}
          </ul>
        </div>
      </div>

      <div class="my-4">
        <h4 class="font-bold text-xs uppercase tracking-wider text-black mb-4">Frequently Asked Questions</h4>
        <div class="flex flex-col gap-3">
          ${faqsHtml}
        </div>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderExpertReviewsPage() {
  const title = 'Expert Lab Reviews';
  const breadcrumbs = ['RESOURCES', 'EXPERT REVIEWS'];
  
  let reviewsHtml = '';
  EV_DATABASE.forEach(car => {
    let prosList = '';
    car.expertReview.pros.forEach(p => {
      prosList += `<li>+ ${p}</li>`;
    });
    let consList = '';
    car.expertReview.cons.forEach(c => {
      consList += `<li class="text-zinc-500">- ${c}</li>`;
    });
    
    reviewsHtml += `
      <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col justify-between h-[380px] group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] review-card">
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div>
              <h4 class="font-bold text-base text-black">${car.name}</h4>
              <span class="font-mono text-[8px] text-zinc-400 uppercase">${car.brand} // LAB TEST</span>
            </div>
            <div class="text-right">
              <span class="text-lg font-bold text-black font-mono">${car.expertReview.rating}</span>
              <span class="text-[8px] text-zinc-450 block uppercase font-mono">LAB RATING</span>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4 text-[10px] font-mono">
            <div>
              <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">PROS</span>
              <ul class="flex flex-col gap-1 text-zinc-700">${prosList}</ul>
            </div>
            <div>
              <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">CONS</span>
              <ul class="flex flex-col gap-1 text-zinc-500">${consList}</ul>
            </div>
          </div>
          
          <div class="text-[11px] font-mono leading-relaxed border-t border-zinc-150 pt-3">
            <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">FINAL VERDICT</span>
            <p class="text-zinc-700 italic truncate" title="${car.expertReview.verdict}">"${car.expertReview.verdict}"</p>
          </div>
        </div>
        
        <button class="w-full mt-4 py-2 border border-zinc-200 hover:border-black text-[9px] font-mono tracking-widest uppercase transition-colors btn-expert-details" data-id="${car.id}">
          Read Full Lab Report →
        </button>
      </div>
    `;
  });
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">EVALUATION INDEX / ${EV_DATABASE.length} VEHICLES TESTED</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Expert Diagnostics & Ratings</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        ${reviewsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  document.querySelectorAll('.btn-expert-details').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      navigateTo(`/cars/${id}`);
    });
  });
}

function renderCustomerReviewsPage() {
  const title = 'Customer Feedback';
  const breadcrumbs = ['RESOURCES', 'CUSTOMER REVIEWS'];
  
  let reviewsHtml = '';
  EV_DATABASE.forEach(car => {
    car.customerReviews.forEach(r => {
      reviewsHtml += `
        <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col justify-between h-[220px] group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] review-card">
          <div>
            <div class="flex justify-between items-center text-xs font-mono">
              <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-zinc-200 flex items-center justify-center font-bold text-[9px] text-zinc-700">${r.author.substring(0,2)}</div>
                <div>
                  <h5 class="font-bold text-black">${r.author}</h5>
                  <span class="text-[8px] text-zinc-500 uppercase">OWNED FOR ${r.duration.toUpperCase()}</span>
                </div>
              </div>
              <div class="text-right">
                <span class="font-bold text-black font-mono">${r.score}</span>
                <span class="text-[8px] text-zinc-500 block uppercase font-mono">${car.name.toUpperCase()} OWNER</span>
              </div>
            </div>
            <p class="text-[11px] text-zinc-655 leading-normal italic font-mono mt-4">"${r.feedback}"</p>
          </div>
          
          <button class="font-mono text-[9px] text-zinc-550 hover:text-black uppercase tracking-widest mt-3 self-start btn-view-customer-car" data-id="${car.id}">
            View Vehicle Profile →
          </button>
        </div>
      `;
    });
  });
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">FEEDBACK LOG / VERIFIED OWNER VOICES</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Verified Electric Vehicle Owner Reviews</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
        ${reviewsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  document.querySelectorAll('.btn-view-customer-car').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      navigateTo(`/cars/${id}`);
    });
  });
}

function getCarSuitabilityCard(car) {
  const isBudget = car.priceVal < 20;
  const isSedan = car.id === 'byd-seal' || car.id === 'bmw-i4' || car.id === 'bmw-i7' || car.id === 'audi-etron-gt' || car.id === 'mercedes-eqs';
  const isSUV = !isSedan && car.priceVal >= 15;

  let bestFor = [];
  let avoid = [];

  if (isBudget) {
    bestFor = ['City Driving', 'Daily Office Commute', 'Family'];
    avoid = ['Long Highway Trips', 'Off-road Driving'];
  } else if (isSedan) {
    bestFor = ['Expressway Cruising', 'Daily Office Commute', 'Premium Comfort'];
    avoid = ['Off-road Driving', 'Tall Speedbumps'];
  } else if (isSUV) {
    bestFor = ['Family Roadtrips', 'High Speedbumps', 'All-weather Driving'];
    avoid = ['Tight Parallel Parking', 'Track Racing'];
  } else {
    bestFor = ['City Driving', 'Daily Office Commute', 'Family'];
    avoid = ['Long Highway Trips', 'Off-road Driving'];
  }

  const rating = parseFloat(car.expertReview.rating) || 8.5;
  const starCount = Math.round(rating / 2);
  const starsHtml = '★'.repeat(starCount) + '☆'.repeat(5 - starCount);

  return `
    <div class="border border-zinc-200 bg-zinc-50 p-4 font-mono text-[9px] flex flex-col gap-3 shadow-sm rounded-none">
      <div class="flex justify-between items-center border-b border-zinc-200 pb-2">
        <div class="flex flex-col">
          <span class="text-[7.5px] text-zinc-500 uppercase tracking-wider font-bold">Recommended Rating</span>
          <span class="text-black text-xs font-black mt-0.5">${rating}/10</span>
        </div>
        <div class="text-right">
          <span class="text-zinc-400 text-[10px] tracking-wider font-bold text-amber-500">${starsHtml}</span>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-3 text-left">
        <div>
          <span class="text-[7.5px] text-emerald-600 font-bold uppercase tracking-wider block mb-1">Best For</span>
          <ul class="flex flex-col gap-1 text-zinc-700 font-semibold text-[8px]">
            ${bestFor.map(item => '<li class="flex items-center gap-1"><span>✅</span><span>' + item + '</span></li>').join('')}
          </ul>
        </div>
        <div>
          <span class="text-[7.5px] text-red-650 font-bold uppercase tracking-wider block mb-1">Avoid / Limits</span>
          <ul class="flex flex-col gap-1 text-zinc-500 text-[8px]">
            ${avoid.map(item => '<li class="flex items-center gap-1"><span>❌</span><span>' + item + '</span></li>').join('')}
          </ul>
        </div>
      </div>
    </div>
  `;
}

// Dynamic Detail Page HTML Generator
async function renderCarDetailsPage(car) {
  addToRecentlyViewed(car.id);
  const images = await getVehicleImages(car);
  let activeVariantIdx = 0;
  
  function updateDetailsUI() {
    const variant = car.variants[activeVariantIdx];
    
    // Related cars matching pricing proximity
    const relatedCars = EV_DATABASE.filter(c => c.id !== car.id)
      .sort((a, b) => Math.abs(a.priceVal - variant.priceVal) - Math.abs(b.priceVal - variant.priceVal))
      .slice(0, 3);
      
    let relatedHtml = '';
    relatedCars.forEach(c => {
      relatedHtml += `
        <div class="border border-zinc-200 bg-white p-5 flex flex-col justify-between h-[360px] group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] related-card">
          <div class="h-28 bg-zinc-50 flex items-center justify-center mb-3 relative overflow-hidden border border-zinc-100">
            <img src="${c.image}" alt="${c.name}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105">
          </div>
          <div>
            <span class="font-mono text-[8px] text-zinc-500 uppercase">${c.brand}</span>
            <h4 class="font-bold text-xs text-black mt-0.5">${c.name}</h4>
            <span class="font-mono text-[10px] text-zinc-650 block mt-1">${c.price}</span>
          </div>
          <button class="w-full mt-3 py-2 border border-zinc-200 hover:border-black text-[9px] font-mono tracking-widest uppercase transition-colors btn-related-view" data-id="${c.id}">
            VIEW DETAILS
          </button>
        </div>
      `;
    });

    let variantsTabsHtml = '';
    car.variants.forEach((v, idx) => {
      variantsTabsHtml += `
        <button class="variant-tab-btn flex-1 py-3 px-4 text-center border font-mono text-[10px] tracking-wider transition-all duration-300 uppercase ${idx === activeVariantIdx ? 'bg-black text-white border-black font-bold' : 'bg-white border-zinc-200 text-zinc-650 hover:border-zinc-500'}" data-idx="${idx}">
          ${v.name}<br><span class="text-[9px] font-semibold mt-1 inline-block">${v.price}</span>
        </button>
      `;
    });

    let specsHtml = `
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Battery Capacity</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="battery-capacity">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.battery}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Driving Range</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="driving-range">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.range}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Charging Time (DC Fast)</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="charging-time">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.charging}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Highway Readiness</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${getHighwayReadinessBadgeHtml(car)}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Motor Output</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.power}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Top Speed</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.speed}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Drivetrain Configuration</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${variant.drivetrain}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Peak Torque</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="torque">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.torque}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Standard AC Charging</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.chargingAC}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Chassis Dimensions</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.dimensions}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Ground Clearance</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="clearance">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.clearance}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Boot Space</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.bootSpace}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Seating Capacity</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.seating}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">
          <div class="flex items-center justify-between gap-2">
            <span>Safety Rating</span>
            <button class="btn-explain-spec font-mono text-[7.5px] text-zinc-400 hover:text-black uppercase tracking-wider underline border-none bg-transparent cursor-pointer" data-spec="safety-rating">Explain</button>
          </div>
        </td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.safety}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Warranty Coverage</td>
        <td class="py-3 px-5 text-zinc-800 font-mono">${car.warranty}</td>
      </tr>
    `;

    const featuresKeys = ['exterior', 'interior', 'safety', 'infotainment', 'adas', 'comfort'];
    let featuresHtml = '';
    featuresKeys.forEach(key => {
      let itemsList = '';
      car.featuresList[key].forEach(item => {
        itemsList += `<li class="flex items-center gap-2 text-zinc-700 text-[11px] py-0.5"><span class="w-1 h-1 bg-black rounded-none"></span>${item}</li>`;
      });
      featuresHtml += `
        <div class="border border-zinc-200 p-5 bg-zinc-50">
          <h4 class="font-bold text-[10px] tracking-wider uppercase text-black border-b border-zinc-250 pb-2 mb-3 font-mono">${key}</h4>
          <ul class="flex flex-col gap-1 text-left font-mono">
            ${itemsList}
          </ul>
        </div>
      `;
    });

    let prosHtml = '';
    car.expertReview.pros.forEach(p => {
      prosHtml += `<li class="flex items-start gap-1.5 py-0.5"><span>+</span><span>${p}</span></li>`;
    });
    let consHtml = '';
    car.expertReview.cons.forEach(c => {
      consHtml += `<li class="flex items-start gap-1.5 py-0.5 text-zinc-550"><span>-</span><span>${c}</span></li>`;
    });

    let customerReviewsHtml = '';
    car.customerReviews.forEach(r => {
      customerReviewsHtml += `
        <div class="border border-zinc-200 bg-zinc-50 p-5 flex flex-col gap-3 shadow-sm">
          <div class="flex justify-between items-center text-xs font-mono">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 bg-zinc-200 flex items-center justify-center font-bold text-[9px] text-zinc-700">${r.author.substring(0,2)}</div>
              <div>
                <h5 class="font-bold text-black">${r.author}</h5>
                <span class="text-[8px] text-zinc-500 uppercase">OWNED FOR ${r.duration.toUpperCase()}</span>
              </div>
            </div>
            <div class="text-right">
              <span class="font-bold text-black">${r.score}</span>
              <span class="text-[8px] text-zinc-550 block uppercase">VERIFIED OWNER</span>
            </div>
          </div>
          <p class="text-[11px] text-zinc-650 leading-normal italic font-mono">"${r.feedback}"</p>
        </div>
      `;
    });

    let gallerySlideshowHtml = '';
    if (images.length > 1) {
      let thumbnailsHtml = '';
      images.forEach((img, idx) => {
        thumbnailsHtml += `
          <button class="gallery-thumb-btn w-12 h-12 border transition-all duration-300 bg-zinc-50 overflow-hidden flex-shrink-0 ${idx === 0 ? 'border-black opacity-100 scale-105' : 'border-zinc-200 opacity-60 hover:opacity-100'}" data-img-idx="${idx}">
            <img src="${img}" class="w-full h-full object-contain">
          </button>
        `;
      });
      
      gallerySlideshowHtml = `
        <div class="flex flex-col gap-3 w-full">
          <div class="relative w-full h-[260px] md:h-[380px] bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden select-none shadow-[inset_0_0_20px_rgba(0,0,0,0.015)]">
            <img id="detail-main-img" src="${images[0]}" class="w-full h-full object-contain p-4 transition-all duration-300">
            <button id="gallery-detail-prev" class="absolute left-4 p-2 bg-white/90 hover:bg-black hover:text-white text-zinc-700 border border-zinc-200 text-xs font-bold font-mono transition-colors">←</button>
            <button id="gallery-detail-next" class="absolute right-4 p-2 bg-white/90 hover:bg-black hover:text-white text-zinc-700 border border-zinc-200 text-xs font-bold font-mono transition-colors">→</button>
            <div id="gallery-detail-counter" class="absolute bottom-4 right-4 text-[8px] text-zinc-500 bg-white/90 px-2 py-0.5 border border-zinc-200 font-mono font-semibold">1 / ${images.length}</div>
          </div>
          <div class="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            ${thumbnailsHtml}
          </div>
        </div>
      `;
    } else {
      gallerySlideshowHtml = `
        <div class="w-full h-[260px] md:h-[380px] bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden select-none">
          <img src="${car.image}" class="w-full h-full object-contain p-4">
        </div>
      `;
    }

    const htmlContent = `
      <div class="flex flex-col gap-12">
        <!-- 1. Hero Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <!-- Gallery Block (Left) -->
          <div class="lg:col-span-7 flex flex-col gap-4">
            ${gallerySlideshowHtml}
          </div>

          <!-- Hero Details Block (Right) -->
          <div class="lg:col-span-5 flex flex-col gap-6">
            <div>
              <span class="font-mono text-[10px] text-zinc-500 uppercase tracking-widest">${car.brand}</span>
              <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight text-black mt-1 mb-2">${car.name}</h2>
              <p class="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Starting Price</p>
              <div class="font-mono text-2xl font-black text-black mt-0.5">${variant.price}</div>
            </div>

            <!-- On-Road Price Calculator -->
            <div class="border border-zinc-200 bg-zinc-50 p-4 flex flex-col gap-3" id="onroad-price-panel">
              <div class="flex items-center justify-between">
                <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">On-Road Price Calculator</span>
                <span class="font-mono text-[8px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5">LIVE ESTIMATE</span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="detail-state-select" class="font-mono text-[8px] text-zinc-500 uppercase tracking-wider">Select State / City</label>
                <select id="detail-state-select" class="bg-white border border-zinc-200 text-xs p-2.5 text-zinc-800 outline-none focus:border-black transition-all cursor-pointer font-mono rounded-none w-full">
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai, Maharashtra</option>
                  <option value="pune">Pune, Maharashtra</option>
                  <option value="bengaluru">Bengaluru, Karnataka</option>
                  <option value="hyderabad">Hyderabad, Telangana</option>
                  <option value="chennai">Chennai, Tamil Nadu</option>
                  <option value="ahmedabad">Ahmedabad, Gujarat</option>
                  <option value="kochi">Kochi, Kerala</option>
                  <option value="kolkata">Kolkata, West Bengal</option>
                  <option value="jaipur">Jaipur, Rajasthan</option>
                  <option value="lucknow">Lucknow, Uttar Pradesh</option>
                  <option value="chandigarh">Chandigarh</option>
                </select>
              </div>
              <!-- Breakdown summary injected by JS -->
              <div id="onroad-breakdown" class="flex flex-col gap-0 transition-all duration-300"></div>
              <p class="text-[8px] text-zinc-400 font-mono leading-relaxed mt-1 border-t border-zinc-200 pt-2">⚠️ Estimated on-road price. Taxes, incentives, and charges vary by state and may change over time.</p>
            </div>

            ${getCarSuitabilityCard(car)}

            <div class="flex flex-col gap-3 font-mono text-[10px] tracking-wider">
              <div class="grid grid-cols-2 gap-3">
                <button id="detail-compare-btn" class="py-3 px-4 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors uppercase text-center">
                  COMPARE CAR
                </button>
                <button id="detail-wishlist-btn" class="py-3 px-4 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors uppercase text-center flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 ${wishlistIds.includes(car.id) ? 'fill-current' : ''}">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>WISHLIST</span>
                </button>
              </div>
            </div>

            <!-- Variants Switcher Panel -->
            <div class="border-t border-zinc-150 pt-5">
              <h4 class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mb-3">SELECT VARIANT SPECIFICATION</h4>
              <div class="flex flex-col md:flex-row gap-2">
                ${variantsTabsHtml}
              </div>
            </div>
          </div>
        </div>

        <!-- 2. Variants & Complete Specifications -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-zinc-150 pt-10">
          <div class="lg:col-span-4 text-left">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">METRIC MATRIX</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">Technical Specifications</h3>
            <p class="text-xs text-zinc-500 mt-2 leading-relaxed font-mono">Compare engine outputs, lithium battery limits, charging coefficients, chassis sizes, and structural safety ratios.</p>
          </div>
          <div class="lg:col-span-8 bg-zinc-50 border border-zinc-200 shadow-sm overflow-hidden">
            <table class="w-full text-left font-mono text-xs text-zinc-650">
              <tbody id="detail-specs-table-body">
                ${specsHtml}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Real World Range Calculator Section -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start border-t border-zinc-150 pt-10">
          <div class="lg:col-span-4 text-left">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">RANGE SIMULATOR</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">Real World Range Calculator</h3>
            <p class="text-xs text-zinc-500 mt-2 leading-relaxed font-mono">Calculate real-world range by selecting driving conditions below.</p>
          </div>
          <div class="lg:col-span-8 bg-zinc-50 border border-zinc-200 shadow-sm p-6 flex flex-col gap-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Dropdown 1: Traffic -->
              <div class="flex flex-col gap-1 text-left font-mono">
                <label for="range-traffic" class="text-zinc-500 text-[8px] uppercase tracking-wider">Traffic</label>
                <select id="range-traffic" class="bg-white border border-zinc-200 p-2.5 text-[11px] text-zinc-800 outline-none focus:border-black transition-colors rounded-none">
                  <option value="light">Light</option>
                  <option value="moderate" selected>Moderate</option>
                  <option value="heavy">Heavy (Bumper-to-Bumper)</option>
                </select>
              </div>
              <!-- Dropdown 2: AC Usage -->
              <div class="flex flex-col gap-1 text-left font-mono">
                <label for="range-ac" class="text-zinc-500 text-[8px] uppercase tracking-wider">AC Usage</label>
                <select id="range-ac" class="bg-white border border-zinc-200 p-2.5 text-[11px] text-zinc-800 outline-none focus:border-black transition-colors rounded-none">
                  <option value="off">Off</option>
                  <option value="low">Low</option>
                  <option value="medium" selected>Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <!-- Dropdown 3: Driving Style -->
              <div class="flex flex-col gap-1 text-left font-mono">
                <label for="range-style" class="text-zinc-500 text-[8px] uppercase tracking-wider">Driving Style</label>
                <select id="range-style" class="bg-white border border-zinc-200 p-2.5 text-[11px] text-zinc-800 outline-none focus:border-black transition-colors rounded-none">
                  <option value="eco">Eco</option>
                  <option value="normal" selected>Normal</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
              <!-- Dropdown 4: Weather -->
              <div class="flex flex-col gap-1 text-left font-mono">
                <label for="range-weather" class="text-zinc-500 text-[8px] uppercase tracking-wider">Weather</label>
                <select id="range-weather" class="bg-white border border-zinc-200 p-2.5 text-[11px] text-zinc-800 outline-none focus:border-black transition-colors rounded-none">
                  <option value="cool">Cool</option>
                  <option value="normal" selected>Normal</option>
                  <option value="hot">Hot Indian Summer</option>
                </select>
              </div>
              <!-- Dropdown 5: Passengers -->
              <div class="flex flex-col gap-1 text-left font-mono">
                <label for="range-passengers" class="text-zinc-500 text-[8px] uppercase tracking-wider">Passengers</label>
                <select id="range-passengers" class="bg-white border border-zinc-200 p-2.5 text-[11px] text-zinc-800 outline-none focus:border-black transition-colors rounded-none">
                  <option value="1" selected>1</option>
                  <option value="2-3">2–3</option>
                  <option value="full">Full Car</option>
                </select>
              </div>
            </div>
            
            <!-- Result Display -->
            <div class="border-t border-zinc-200 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="p-4 border border-zinc-200 bg-white flex flex-col justify-center text-center font-mono">
                <span class="text-[8px] text-zinc-500 uppercase tracking-widest block mb-1">Claimed Range</span>
                <span id="range-claimed-display" class="text-xl font-black text-black">-- km</span>
              </div>
              <div class="p-4 border border-black bg-black text-white flex flex-col justify-center text-center font-mono relative overflow-hidden">
                <span class="text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">Estimated Real World Range</span>
                <span id="range-estimated-display" class="text-2xl font-black text-white">-- km</span>
              </div>
            </div>
            
            <p class="text-[9px] text-zinc-450 italic font-mono mt-1 text-center">
              "Estimated range based on Indian driving conditions. Actual results may vary."
            </p>
          </div>
        </div>

        <!-- 3. Features Accordions Grid -->
        <div class="flex flex-col gap-6 border-t border-zinc-150 pt-10">
          <div class="text-left">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">COMPILATION DECK</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">Key Vehicle Features</h3>
            <p class="text-xs text-zinc-500 mt-1">Full cabin console, driver safety suites, comfort parameters, and connectivity standards.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${featuresHtml}
          </div>
        </div>

        <!-- 4. Reviews Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 border-t border-zinc-150 pt-10">
          <!-- Expert Evaluation (Left) -->
          <div class="lg:col-span-6 flex flex-col gap-5">
            <div>
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">EVALUATION LOG</span>
              <h3 class="text-xl font-bold tracking-tight">EV Car Wale Expert Review</h3>
            </div>
            
            <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-5 shadow-sm">
              <div class="flex items-center justify-between border-b border-zinc-200 pb-3">
                <div>
                  <h4 class="font-bold text-sm text-black">${car.name}</h4>
                  <span class="font-mono text-[8px] text-zinc-400">TEST LAB DIAGNOSTICS</span>
                </div>
                <div class="text-right">
                  <span class="text-xl font-bold text-black font-mono">${car.expertReview.rating}</span>
                  <span class="text-[8px] text-zinc-400 block uppercase font-mono">LAB RATING</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">PROS</span>
                  <ul class="flex flex-col gap-1 text-[11px] text-zinc-700">
                    ${prosHtml}
                  </ul>
                </div>
                <div>
                  <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">CONS</span>
                  <ul class="flex flex-col gap-1 text-[11px] text-zinc-500">
                    ${consHtml}
                  </ul>
                </div>
              </div>
              <div class="border-t border-zinc-200 pt-3 text-[11px] font-mono leading-relaxed">
                <span class="font-bold text-[8px] text-zinc-500 block uppercase mb-1">FINAL VERDICT</span>
                <p class="text-zinc-700 italic">"${car.expertReview.verdict}"</p>
              </div>
            </div>
          </div>

          <!-- Customer Reviews (Right) -->
          <div class="lg:col-span-6 flex flex-col gap-5">
            <div>
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">CUSTOMER INSIGHT</span>
              <h3 class="text-xl font-bold tracking-tight">Owner Verification Feedback</h3>
            </div>
            <div class="flex flex-col gap-4">
              ${customerReviewsHtml}
            </div>
          </div>
        </div>

        <!-- 5. EMI Calculator Panel -->
        <div class="border-t border-zinc-150 pt-10">
          <div class="text-center mb-8">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">FINANCIAL COEFFICIENT</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">EMI Loan Calculator</h3>
          </div>
          
          <div class="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <!-- Sliders -->
            <div class="md:col-span-7 flex flex-col gap-5">
              <!-- Price Slider (Static for variant) -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">VEHICLE PRICE</span>
                  <span class="font-bold text-black">${variant.price}</span>
                </div>
                <div class="h-[2px] bg-black w-full"></div>
              </div>
              <!-- Down Payment -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">DOWN PAYMENT</span>
                  <span id="detail-lbl-down-val" class="font-bold text-black">₹0</span>
                </div>
                <input type="range" id="detail-slider-down" min="0" max="0" step="50000" value="0" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span id="detail-lbl-down-min">₹0</span>
                  <span id="detail-lbl-down-max">₹0</span>
                </div>
              </div>
              <!-- Interest Rate -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">INTEREST RATE (P.A.)</span>
                  <span id="detail-lbl-rate-val" class="font-bold text-black">9.5%</span>
                </div>
                <input type="range" id="detail-slider-rate" min="7" max="15" step="0.1" value="9.5" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>7.0%</span>
                  <span>15.0%</span>
                </div>
              </div>
              <!-- Tenure -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">LOAN PERIOD</span>
                  <span id="detail-lbl-tenure-val" class="font-bold text-black">5 Years</span>
                </div>
                <input type="range" id="detail-slider-tenure" min="1" max="7" step="1" value="5" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>1 Year</span>
                  <span>7 Years</span>
                </div>
              </div>
            </div>
            <!-- Results -->
            <div class="md:col-span-5 border-t md:border-t-0 md:border-l border-zinc-200 p-6 flex flex-col justify-between items-center text-center font-mono">
              <div class="w-full">
                <span class="text-[9px] text-zinc-500 uppercase tracking-widest block mb-4">CALCULATED INTEREST LOAN</span>
                <div class="grid grid-cols-2 gap-4 text-left text-[10px] text-zinc-500 mb-6">
                  <div>LOAN AMOUNT:<br><span id="detail-res-loan-amt" class="text-black font-bold">₹0</span></div>
                  <div>INTEREST RATE:<br><span class="text-black font-bold" id="detail-res-interest-val">9.5%</span></div>
                </div>
              </div>
              <div class="my-6">
                <span class="text-[9px] text-zinc-500 uppercase tracking-widest block mb-1">Estimated Monthly EMI</span>
                <span id="detail-emi-calc-result" class="text-3xl font-extrabold text-black tracking-tight">₹0</span>
                <span class="text-[8px] text-zinc-400 block uppercase mt-1">PER MONTH</span>
              </div>
              <button id="detail-loan-apply-btn" class="w-full py-3 bg-black text-white font-semibold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors">
                APPLY FOR EV LOAN
              </button>
            </div>
          </div>
        </div>

        <!-- Petrol Savings Calculator Panel -->
        <div class="border-t border-zinc-150 pt-10">
          <div class="text-center mb-8">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">EFFICIENCY MATRIX</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">Petrol Savings Calculator</h3>
          </div>
          
          <div class="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <!-- Sliders -->
            <div class="md:col-span-7 flex flex-col gap-5">
              <!-- Daily Distance Slider -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">DAILY DISTANCE</span>
                  <span id="detail-lbl-savings-distance" class="font-bold text-black">50 km</span>
                </div>
                <input type="range" id="detail-slider-savings-distance" min="10" max="200" step="5" value="50" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>10 km</span>
                  <span>200 km</span>
                </div>
              </div>

              <!-- Petrol Price Slider -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">PETROL PRICE (PER LITRE)</span>
                  <span id="detail-lbl-savings-petrol-price" class="font-bold text-black">₹100</span>
                </div>
                <input type="range" id="detail-slider-savings-petrol-price" min="80" max="150" step="1" value="100" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>₹80</span>
                  <span>₹150</span>
                </div>
              </div>

              <!-- Electricity Tariff Slider -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">ELECTRICITY TARIFF (PER KWH)</span>
                  <span id="detail-lbl-savings-tariff" class="font-bold text-black">₹8</span>
                </div>
                <input type="range" id="detail-slider-savings-tariff" min="3" max="15" step="0.5" value="8" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>₹3</span>
                  <span>₹15</span>
                </div>
              </div>

              <!-- Ownership Period Slider -->
              <div class="flex flex-col gap-2 text-left font-mono">
                <div class="flex justify-between text-xs">
                  <span class="text-zinc-500">OWNERSHIP PERIOD</span>
                  <span id="detail-lbl-savings-period" class="font-bold text-black">5 Years</span>
                </div>
                <input type="range" id="detail-slider-savings-period" min="1" max="10" step="1" value="5" class="w-full accent-black h-[2px] bg-zinc-200 cursor-pointer">
                <div class="flex justify-between text-[9px] text-zinc-400">
                  <span>1 Year</span>
                  <span>10 Years</span>
                </div>
              </div>
            </div>

            <!-- Results -->
            <div class="md:col-span-5 border-t md:border-t-0 md:border-l border-zinc-200 p-6 flex flex-col justify-between font-mono">
              <div class="flex flex-col gap-4 text-left text-xs text-zinc-500">
                <div>MONTHLY PETROL COST:<br><span id="detail-res-savings-petrol-cost" class="text-black font-bold">₹0</span></div>
                <div>MONTHLY EV CHARGING COST:<br><span id="detail-res-savings-ev-cost" class="text-black font-bold">₹0</span></div>
                <div class="border-t border-zinc-200 pt-3">
                  MONTHLY SAVINGS:<br><span id="detail-res-savings-monthly" class="text-black font-bold">₹0</span>
                </div>
                <div>
                  ANNUAL SAVINGS:<br><span id="detail-res-savings-annual" class="text-black font-bold">₹0</span>
                </div>
              </div>

              <!-- Highlight Card with subtle green accent -->
              <div class="my-6 p-5 bg-emerald-50/50 border border-emerald-500/20 text-center relative overflow-hidden rounded-none shadow-[0_2px_10px_rgba(16,185,129,0.03)]">
                <span class="text-[8px] text-emerald-600 font-bold uppercase tracking-widest block mb-2">Projected Savings</span>
                <span id="detail-res-savings-total" class="text-3xl font-extrabold text-emerald-700 tracking-tight" data-val="0">₹0</span>
                <span id="detail-lbl-savings-total-duration" class="text-[8px] text-emerald-550 block uppercase tracking-widest mt-1">OVER 5 YEARS</span>
              </div>

              <p class="text-[9px] text-zinc-500 italic text-center">
                "Choosing this EV could save you thousands in fuel over time."
              </p>
            </div>
          </div>
        </div>

        <!-- Apartment Charging Guide Panel -->
        <div class="border-t border-zinc-150 pt-10">
          <div class="text-left mb-8">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-2">INFRASTRUCTURE GUIDE</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">🏢 Apartment Charging Guide</h3>
            <p class="text-xs text-zinc-655 mt-2 leading-relaxed font-mono">Living in an apartment? Here's everything you need to know before buying an EV.</p>
          </div>
          
          <div class="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch bg-zinc-50 border border-zinc-200 p-8 shadow-sm">
            <!-- Left: Checklist & Checkbox -->
            <div class="md:col-span-7 flex flex-col gap-5 text-left font-mono">
              <span class="text-[8px] text-zinc-500 uppercase tracking-widest font-bold block border-b border-zinc-200 pb-2">PRE-INSTALLATION CHECKLIST</span>
              
              <ul class="flex flex-col gap-2.5 text-zinc-755 text-xs pl-1">
                <li class="flex items-center gap-2">
                  <span class="text-black font-bold">✓</span>
                  <span>Do you have an assigned parking space?</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-black font-bold">✓</span>
                  <span>Is there an electrical connection nearby?</span>
                </li>
                <li class="flex items-center gap-2">
                  <span class="text-black font-bold">✓</span>
                  <span>Does your apartment society (RWA) require approval?</span>
                </li>
              </ul>
              
              <div class="flex items-center gap-3 text-xs text-zinc-800 border border-zinc-200 p-4 bg-white mt-2">
                <input type="checkbox" id="chk-live-apartment" class="w-4 h-4 accent-black cursor-pointer rounded-none">
                <label for="chk-live-apartment" class="cursor-pointer select-none">I live in an apartment</label>
              </div>
              
              <div id="apartment-info-box" class="hidden border border-zinc-250 bg-white p-4 text-[10px] text-zinc-700 leading-relaxed transition-all duration-300">
                Good news! Most apartment societies in India can approve EV charger installation after receiving a formal request.
              </div>
            </div>
            
            <!-- Right: Actions -->
            <div class="md:col-span-5 border-t md:border-t-0 md:border-l border-zinc-200 p-6 flex flex-col justify-center gap-4 text-center font-mono">
              <span class="text-[8px] text-zinc-500 uppercase tracking-widest block mb-1">STEPS & DOCUMENTATION</span>
              
              <button id="btn-check-requirements" class="w-full py-3 border border-zinc-300 hover:border-black text-zinc-700 hover:text-black font-semibold text-xs tracking-widest uppercase transition-colors bg-white">
                Check Requirements
              </button>
              
              <button id="btn-download-rwa" class="w-full py-3 bg-black text-white font-semibold text-xs tracking-widest uppercase hover:bg-zinc-800 transition-colors">
                Download RWA Letter (PDF)
              </button>
            </div>
          </div>
        </div>

        <!-- 6. Related Cars Section -->
        <div class="border-t border-zinc-150 pt-10 pb-8">
          <div class="text-left mb-8">
            <span class="font-mono text-[9px] text-zinc-500 tracking-[0.25em] uppercase block mb-1">CATEGORICAL PAIRINGS</span>
            <h3 class="text-xl md:text-2xl font-bold tracking-tight">Related Electric Vehicles</h3>
            <p class="text-xs text-zinc-500 mt-1">Similar EVs by budget pricing indices and body dimensions.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            ${relatedHtml}
          </div>
        </div>
      </div>
    `;
    
    renderSubpage(car.name, ['MARKETPLACE', car.name], htmlContent, '/');
    
    // Compare CTA
    document.getElementById('detail-compare-btn').addEventListener('click', () => {
      navigateTo('/');
      setTimeout(() => {
        const compareSelect = document.getElementById('comp-select-a');
        if (compareSelect) {
          compareSelect.value = car.id;
          updateCompareTable();
        }
        const compSection = document.getElementById('compare');
        if (compSection) compSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    });

    // Wishlist CTA
    document.getElementById('detail-wishlist-btn').addEventListener('click', () => {
      toggleWishlist(car.id);
      alert(`${car.name.toUpperCase()} ACCESSED IN WISHLIST LOG.`);
      updateDetailsUI();
    });

    // Variant tab buttons click
    document.querySelectorAll('.variant-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeVariantIdx = parseInt(btn.getAttribute('data-idx'));
        updateDetailsUI();
      });
    });

    // Related cards View Details click
    document.querySelectorAll('.btn-related-view').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-id');
        navigateTo(`/cars/${targetId}`);
      });
    });

    // Gallery details controls
    if (images.length > 1) {
      let currentIdx = 0;
      const mainImg = document.getElementById('detail-main-img');
      const counter = document.getElementById('gallery-detail-counter');
      const thumbs = document.querySelectorAll('.gallery-thumb-btn');
      
      function updateGalleryImg(idx) {
        currentIdx = idx;
        mainImg.src = images[currentIdx];
        if (counter) counter.textContent = `${currentIdx + 1} / ${images.length}`;
        
        thumbs.forEach((t, tIdx) => {
          if (tIdx === currentIdx) {
            t.classList.add('border-black', 'scale-105', 'opacity-100');
            t.classList.remove('border-zinc-200', 'opacity-60');
          } else {
            t.classList.remove('border-black', 'scale-105', 'opacity-100');
            t.classList.add('border-zinc-200', 'opacity-60');
          }
        });
      }

      const prevBtn = document.getElementById('gallery-detail-prev');
      const nextBtn = document.getElementById('gallery-detail-next');

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nextIdx = (currentIdx - 1 + images.length) % images.length;
          updateGalleryImg(nextIdx);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const nextIdx = (currentIdx + 1) % images.length;
          updateGalleryImg(nextIdx);
        });
      }

      thumbs.forEach((thumb, tIdx) => {
        thumb.addEventListener('click', () => {
          updateGalleryImg(tIdx);
        });
      });
    }

    // --- On-Road Price Calculator Binding ---
    const detailStateSelect = document.getElementById('detail-state-select');
    const onRoadBreakdown = document.getElementById('onroad-breakdown');

    function renderOnRoadBreakdown() {
      if (!detailStateSelect || !onRoadBreakdown) return;
      const stateKey = detailStateSelect.value;
      const data = getOnRoadPriceData(variant.priceVal, stateKey);
      if (!data) { onRoadBreakdown.innerHTML = ''; return; }

      // Build breakdown rows with subtle animation
      const rows = [
        { label: 'Ex-Showroom Price', value: formatCurrency(data.exShowroom), accent: false },
        { label: 'Est. Road Tax', value: data.roadTax === 0 ? '₹0 (Waived)' : formatCurrency(data.roadTax), accent: false },
        { label: 'Registration Charges', value: formatCurrency(data.regCharge), accent: false },
        { label: 'Insurance (1st Year ~2.5%)', value: formatCurrency(data.insurance), accent: false },
        { label: 'Dealer Handling', value: formatCurrency(data.handling), accent: false },
      ];

      let rowsHtml = rows.map(r =>
        '<div class="flex justify-between items-center py-1.5 border-b border-zinc-200 last:border-0">' +
          '<span class="font-mono text-[8.5px] text-zinc-500 uppercase tracking-wide">' + r.label + '</span>' +
          '<span class="font-mono text-[9px] font-semibold text-zinc-800">' + r.value + '</span>' +
        '</div>'
      ).join('');

      if (data.evBenefit > 0) {
        rowsHtml += '<div class="flex justify-between items-center py-1.5 border-b border-zinc-200">' +
          '<span class="font-mono text-[8.5px] text-emerald-700 uppercase tracking-wide">State EV Benefit</span>' +
          '<span class="font-mono text-[9px] font-semibold text-emerald-700">-' + formatCurrency(data.evBenefit) + '</span>' +
        '</div>';
      }

      rowsHtml += '<div class="flex justify-between items-center py-2.5 mt-1 bg-black px-3">' +
        '<span class="font-mono text-[8.5px] text-white uppercase tracking-widest font-bold">Est. On-Road Price</span>' +
        '<span class="font-mono text-[11px] font-black text-white">' + formatCurrency(data.onRoad) + '</span>' +
      '</div>';

      if (data.evBenefitNote) {
        rowsHtml += '<div class="text-[7.5px] text-emerald-700 font-mono mt-1.5 leading-relaxed">' +
          '<span class="font-bold uppercase">State Policy: </span>' + data.evBenefitNote +
        '</div>';
      }

      onRoadBreakdown.style.opacity = '0';
      onRoadBreakdown.style.transform = 'translateY(4px)';
      setTimeout(() => {
        onRoadBreakdown.innerHTML = rowsHtml;
        onRoadBreakdown.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        onRoadBreakdown.style.opacity = '1';
        onRoadBreakdown.style.transform = 'translateY(0)';
      }, 80);
    }

    if (detailStateSelect) {
      detailStateSelect.addEventListener('change', renderOnRoadBreakdown);
      renderOnRoadBreakdown(); // initial render
    }

    // Dynamic EMI Calculations for Variant
    const sliderDown = document.getElementById('detail-slider-down');
    const sliderRate = document.getElementById('detail-slider-rate');
    const sliderTenure = document.getElementById('detail-slider-tenure');


    const lblDownVal = document.getElementById('detail-lbl-down-val');
    const lblDownMin = document.getElementById('detail-lbl-down-min');
    const lblDownMax = document.getElementById('detail-lbl-down-max');
    const lblRateVal = document.getElementById('detail-lbl-rate-val');
    const lblTenureVal = document.getElementById('detail-lbl-tenure-val');

    const resLoanAmt = document.getElementById('detail-res-loan-amt');
    const resInterestVal = document.getElementById('detail-res-interest-val');
    const emiCalcResult = document.getElementById('detail-emi-calc-result');

    const price = Math.floor(variant.priceVal * 100000); // lakh to absolute numbers
    const minDown = Math.floor(price * 0.1);
    const maxDown = Math.floor(price * 0.9);
    
    sliderDown.min = minDown;
    sliderDown.max = maxDown;
    sliderDown.value = minDown;

    function updateDetailEMI() {
      const downVal = parseInt(sliderDown.value);
      const rate = parseFloat(sliderRate.value);
      const tenure = parseInt(sliderTenure.value);
      
      const loanAmt = price - downVal;
      
      lblDownVal.textContent = formatCurrency(downVal);
      lblDownMin.textContent = formatCurrency(minDown);
      lblDownMax.textContent = formatCurrency(maxDown);
      lblRateVal.textContent = rate.toFixed(1) + '%';
      lblTenureVal.textContent = tenure + (tenure === 1 ? ' Year' : ' Years');
      
      resLoanAmt.textContent = formatCurrency(loanAmt);
      resInterestVal.textContent = rate.toFixed(1) + '%';
      
      const monthlyRate = (rate / 12) / 100;
      const months = tenure * 12;
      
      let emi = 0;
      if (monthlyRate > 0) {
        const factor = Math.pow(1 + monthlyRate, months);
        emi = Math.floor(loanAmt * monthlyRate * factor / (factor - 1));
      } else {
        emi = Math.floor(loanAmt / months);
      }
      
      emiCalcResult.textContent = formatCurrency(emi);
    }

    sliderDown.addEventListener('input', updateDetailEMI);
    sliderRate.addEventListener('input', updateDetailEMI);
    sliderTenure.addEventListener('input', updateDetailEMI);

    updateDetailEMI();
    
    document.getElementById('detail-loan-apply-btn').addEventListener('click', () => {
      alert('LOAN ELIGIBILITY REQUEST INITIATED. OUR PARTNERS WILL CONTACT YOU.');
    });

    // Dynamic Real World Range Calculations
    const selectTraffic = document.getElementById('range-traffic');
    const selectAC = document.getElementById('range-ac');
    const selectStyle = document.getElementById('range-style');
    const selectWeather = document.getElementById('range-weather');
    const selectPassengers = document.getElementById('range-passengers');

    const rangeClaimedDisplay = document.getElementById('range-claimed-display');
    const rangeEstimatedDisplay = document.getElementById('range-estimated-display');

    function updateRealWorldRange() {
      if (!selectTraffic || !selectAC || !selectStyle || !selectWeather || !selectPassengers) return;

      const trafficMap = { light: 1.0, moderate: 0.9, heavy: 0.75 };
      const acMap = { off: 1.0, low: 0.95, medium: 0.9, high: 0.82 };
      const styleMap = { eco: 1.05, normal: 1.0, aggressive: 0.8 };
      const weatherMap = { cool: 1.0, normal: 1.0, hot: 0.85 };
      const passengerMap = { '1': 1.0, '2-3': 0.96, full: 0.9 };

      const claimedRange = parseInt(variant.range);
      const factor = trafficMap[selectTraffic.value] *
                     acMap[selectAC.value] *
                     styleMap[selectStyle.value] *
                     weatherMap[selectWeather.value] *
                     passengerMap[selectPassengers.value];

      const estimatedRange = Math.round(claimedRange * factor);

      if (rangeClaimedDisplay) rangeClaimedDisplay.textContent = `${claimedRange} km`;
      if (rangeEstimatedDisplay) rangeEstimatedDisplay.textContent = `${estimatedRange} km`;
    }

    if (selectTraffic) selectTraffic.addEventListener('change', updateRealWorldRange);
    if (selectAC) selectAC.addEventListener('change', updateRealWorldRange);
    if (selectStyle) selectStyle.addEventListener('change', updateRealWorldRange);
    if (selectWeather) selectWeather.addEventListener('change', updateRealWorldRange);
    if (selectPassengers) selectPassengers.addEventListener('change', updateRealWorldRange);

    updateRealWorldRange();

    // Dynamic Savings Calculator logic for Details page
    const detailSliderSavingsDist = document.getElementById('detail-slider-savings-distance');
    const detailSliderSavingsPetrol = document.getElementById('detail-slider-savings-petrol-price');
    const detailSliderSavingsTariff = document.getElementById('detail-slider-savings-tariff');
    const detailSliderSavingsPeriod = document.getElementById('detail-slider-savings-period');

    const detailLblSavingsDist = document.getElementById('detail-lbl-savings-distance');
    const detailLblSavingsPetrol = document.getElementById('detail-lbl-savings-petrol-price');
    const detailLblSavingsTariff = document.getElementById('detail-lbl-savings-tariff');
    const detailLblSavingsPeriod = document.getElementById('detail-lbl-savings-period');

    const detailResSavingsPetrolCost = document.getElementById('detail-res-savings-petrol-cost');
    const detailResSavingsEvCost = document.getElementById('detail-res-savings-ev-cost');
    const detailResSavingsMonthly = document.getElementById('detail-res-savings-monthly');
    const detailResSavingsAnnual = document.getElementById('detail-res-savings-annual');
    const detailResSavingsTotal = document.getElementById('detail-res-savings-total');
    const detailLblSavingsTotalDuration = document.getElementById('detail-lbl-savings-total-duration');

    function updateDetailsSavings() {
      if (!detailSliderSavingsDist || !detailSliderSavingsPetrol || !detailSliderSavingsTariff || !detailSliderSavingsPeriod) return;

      const dist = parseInt(detailSliderSavingsDist.value);
      const petrolPrice = parseFloat(detailSliderSavingsPetrol.value);
      const tariff = parseFloat(detailSliderSavingsTariff.value);
      const period = parseInt(detailSliderSavingsPeriod.value);

      // Display inputs
      detailLblSavingsDist.textContent = `${dist} km`;
      detailLblSavingsPetrol.textContent = `₹${petrolPrice}`;
      detailLblSavingsTariff.textContent = `₹${tariff}`;
      detailLblSavingsPeriod.textContent = `${period} ${period === 1 ? 'Year' : 'Years'}`;

      // Petrol car mileage: assumed 15 km/l
      const monthlyDist = dist * 30;
      const monthlyPetrolCost = (monthlyDist / 15) * petrolPrice;

      // EV efficiency: battery size / range
      const battery = parseFloat(variant.battery) || 50;
      const range = parseInt(variant.range) || 400;
      const efficiency = battery / range; // kWh/km
      const monthlyEvCost = monthlyDist * efficiency * tariff;

      const monthlySavings = Math.max(0, monthlyPetrolCost - monthlyEvCost);
      const annualSavings = monthlySavings * 12;
      const totalSavings = annualSavings * period;

      detailResSavingsPetrolCost.textContent = formatCurrency(Math.round(monthlyPetrolCost));
      detailResSavingsEvCost.textContent = formatCurrency(Math.round(monthlyEvCost));
      detailResSavingsMonthly.textContent = formatCurrency(Math.round(monthlySavings));
      detailResSavingsAnnual.textContent = formatCurrency(Math.round(annualSavings));
      
      detailLblSavingsTotalDuration.textContent = `OVER ${period} ${period === 1 ? 'YEAR' : 'YEARS'}`;
      
      animateSavingsNumber('detail-res-savings-total', Math.round(totalSavings));
    }

    if (detailSliderSavingsDist) detailSliderSavingsDist.addEventListener('input', updateDetailsSavings);
    if (detailSliderSavingsPetrol) detailSliderSavingsPetrol.addEventListener('input', updateDetailsSavings);
    if (detailSliderSavingsTariff) detailSliderSavingsTariff.addEventListener('input', updateDetailsSavings);
    if (detailSliderSavingsPeriod) detailSliderSavingsPeriod.addEventListener('input', updateDetailsSavings);

    updateDetailsSavings();

    // Technical Specification explanations listener
    const specExplanations = {
      'battery-capacity': {
        title: 'Battery Capacity & kWh',
        explanation: "Think of this as the size of the car's fuel tank.",
        kwh: 'Measures how much electricity the battery can store.',
        analogy: 'Like measuring a petrol fuel tank in litres, we measure electric battery capacity in kWh (Kilowatt-hour) units.'
      },
      'driving-range': {
        title: 'Driving Range',
        explanation: 'How far the car can travel on a single full charge under standard driving conditions.',
        analogy: 'Similar to how many kilometers a petrol car can run on a full tank of fuel.'
      },
      'charging-time': {
        title: 'Charging Speed & Time',
        explanation: 'Higher charging speed means less waiting.',
        analogy: 'DC Fast Chargers replenish your battery rapidly during road trips (similar to a phone quick charger).'
      },
      'torque': {
        title: 'Peak Torque',
        explanation: 'Instant pulling power when you press the accelerator.',
        analogy: 'EVs deliver peak torque instantly, giving you immediate power without waiting for gears to rev up.'
      },
      'clearance': {
        title: 'Ground Clearance',
        explanation: 'The height between the lowest part of the car chassis and the road.',
        analogy: 'Higher ground clearance helps navigate tall speedbumps and potholes safely.'
      },
      'safety-rating': {
        title: 'Safety Rating',
        explanation: 'Crash test safety rating evaluated by independent groups.',
        analogy: 'Higher stars (up to 5) indicate better cabin safety and protection for passengers.'
      }
    };

    document.querySelectorAll('.btn-explain-spec').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const specKey = btn.getAttribute('data-spec');
        const data = specExplanations[specKey];
        if (data) {
          const infoText = document.getElementById('info-reader-text');
          const modalInfo = document.getElementById('modal-info-reader');
          if (infoText && modalInfo) {
            infoText.innerHTML = `
              <div class="flex flex-col gap-3 pt-2 font-mono">
                <h4 class="font-bold text-sm text-white tracking-wide uppercase border-b border-zinc-900 pb-2">${data.title}</h4>
                <div>
                  <span class="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold mb-0.5">Simple Explanation:</span>
                  <p class="text-zinc-200 text-[10.5px] leading-relaxed">${data.explanation}</p>
                </div>
                ${data.kwh ? '<div><span class="text-zinc-550 uppercase text-[8px] tracking-wider block font-bold mb-0.5">What is kWh?</span><p class="text-zinc-200 text-[10.5px] leading-relaxed">' + data.kwh + '</p></div>' : ''}
                <div>
                  <span class="text-zinc-500 uppercase text-[8px] tracking-wider block font-bold mb-0.5">Everyday Analogy:</span>
                  <p class="text-zinc-200 text-[10.5px] leading-relaxed italic">${data.analogy}</p>
                </div>
              </div>
            `;
            modalInfo.classList.remove('opacity-0', 'pointer-events-none');
          }
        }
      });
    });

    // Apartment Charging Guide Checkbox Toggle
    const chkApartment = document.getElementById('chk-live-apartment');
    const apartmentInfoBox = document.getElementById('apartment-info-box');
    if (chkApartment && apartmentInfoBox) {
      chkApartment.addEventListener('change', () => {
        if (chkApartment.checked) {
          apartmentInfoBox.classList.remove('hidden');
        } else {
          apartmentInfoBox.classList.add('hidden');
        }
      });
    }

    // Apartment Charging Guide Action Buttons
    const btnCheckRequirements = document.getElementById('btn-check-requirements');
    if (btnCheckRequirements) {
      btnCheckRequirements.addEventListener('click', () => {
        const infoText = document.getElementById('info-reader-text');
        const modalInfo = document.getElementById('modal-info-reader');
        if (infoText && modalInfo) {
          infoText.innerHTML = `
            <div class="flex flex-col gap-4 pt-2 font-mono">
              <h4 class="font-bold text-sm text-white tracking-wide uppercase border-b border-zinc-900 pb-2">📦 Installation Requirements</h4>
              <ul class="flex flex-col gap-3 text-zinc-200 text-[10.5px] leading-relaxed text-left list-disc pl-4">
                <li><strong>Dedicated Parking:</strong> A dedicated, private parking space is highly preferred for installing a home charger.</li>
                <li><strong>RWA Approval:</strong> Prior permission or a No Objection Certificate (NOC) from the apartment management or Resident Welfare Association (RWA) is usually required.</li>
                <li><strong>Licensed Electrician:</strong> All wiring and charging equipment should be installed by a certified, licensed electrician to ensure safety.</li>
                <li><strong>Power Metering:</strong> The charger can usually be connected directly to your apartment's domestic meter, or a separate commercial/EV meter depending on your society's guidelines.</li>
                <li><strong>State Variables:</strong> Regulations, subsidies, and connection requirements can vary significantly by state and local electricity distribution company (DISCOM).</li>
              </ul>
            </div>
          `;
          modalInfo.classList.remove('opacity-0', 'pointer-events-none');
        }
      });
    }

    const btnDownloadRWA = document.getElementById('btn-download-rwa');
    if (btnDownloadRWA) {
      btnDownloadRWA.addEventListener('click', () => {
        downloadRWAPdf(car.name);
      });
    }
    applyJargonBuster();
  }

  updateDetailsUI();
}

// PDF Generation Helper for RWA request letter
function downloadRWAPdf(carName) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  doc.setFont("Helvetica", "normal");
  
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.text(`Date: ${dateStr}`, 20, 25);
  
  doc.setFont("Helvetica", "bold");
  doc.text("To,", 20, 35);
  doc.text("The Management Committee / Resident Welfare Association (RWA),", 20, 40);
  doc.setFont("Helvetica", "normal");
  doc.text("[Apartment Society Name]", 20, 45);
  doc.text("[City, State]", 20, 50);

  doc.setFont("Helvetica", "bold");
  doc.text("Subject: Request for Permission to Install EV Charging Point in Parking Space", 20, 62);
  doc.setLineWidth(0.3);
  doc.line(20, 64, 155, 64);
  
  doc.setFont("Helvetica", "normal");
  doc.setFontSize(10.5);
  let y = 74;
  
  doc.text("Dear Sir/Madam,", 20, y);
  y += 10;
  
  const text1 = "I am writing to formally request permission to install a private Electric Vehicle (EV) charging point in my designated parking space for my upcoming electric vehicle, the " + carName.toUpperCase() + ".";
  const text2 = "Please find the applicant and parking details below for your reference and records:";
  
  const splitText1 = doc.splitTextToSize(text1, 170);
  doc.text(splitText1, 20, y);
  y += splitText1.length * 5 + 2;
  
  doc.text(text2, 20, y);
  y += 10;
  
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 250, 252);
  doc.rect(20, y, 170, 46, "FD");
  
  doc.setFont("Helvetica", "bold");
  doc.text("Applicant Name:", 25, y + 8);
  doc.text("Flat Number:", 25, y + 16);
  doc.text("Parking Space No:", 25, y + 24);
  doc.text("Vehicle Model:", 25, y + 32);
  doc.text("Contact Number:", 25, y + 40);
  
  doc.setFont("Helvetica", "normal");
  doc.text("___________________________", 65, y + 8);
  doc.text("___________________________", 65, y + 16);
  doc.text("___________________________", 65, y + 24);
  doc.text(carName.toUpperCase(), 65, y + 32);
  doc.text("___________________________", 65, y + 40);
  
  y += 56;
  
  const text3 = "I would like to assure the association that the installation will meet the following criteria:";
  doc.setFont("Helvetica", "bold");
  doc.text(text3, 20, y);
  y += 8;
  
  doc.setFont("Helvetica", "normal");
  const bulletPoints = [
    "The charging point will be installed by a certified electrical technician.",
    "The cabling and equipment will comply with all electrical and fire safety guidelines.",
    "Electricity will be drawn from my personal domestic electricity meter, and all installation/running costs will be borne entirely by me.",
    "The installation will not cause any obstruction or risk to other residents or vehicles in the society."
  ];
  
  bulletPoints.forEach(bullet => {
    const splitBullet = doc.splitTextToSize("•  " + bullet, 165);
    doc.text(splitBullet, 22, y);
    y += splitBullet.length * 5 + 1;
  });
  
  y += 6;
  
  const text4 = "I request you to kindly review my application and grant the necessary permission (No Objection Certificate) at your earliest convenience so that the work can begin.";
  const splitText4 = doc.splitTextToSize(text4, 170);
  doc.text(splitText4, 20, y);
  y += splitText4.length * 5 + 10;
  
  doc.text("Thanking you,", 20, y);
  y += 6;
  doc.text("Yours sincerely,", 20, y);
  
  y += 16;
  doc.text("Signature: ______________________", 20, y);
  
  const safeCarName = carName.replace(/\s+/g, '_');
  doc.save("RWA_EV_Charger_Request_" + safeCarName + ".pdf");
}

function getHighwayReadinessData(car) {
  const match = car.charging.match(/(\d+)\s*min/);
  const minutes = match ? parseInt(match[1]) : 50;

  const isPremium = car.priceVal >= 40.0;
  
  let category, badgeColor, icon, maxSpeed, time1080, recommendation;

  if (minutes <= 30) {
    category = 'Highway Ready';
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-500/20';
    icon = '🟢';
    maxSpeed = isPremium ? '150 kW - 350 kW' : '100 kW';
    time1080 = minutes + ' mins (10-80%)';
    recommendation = 'Excellent for frequent highway trips.';
  } else if (minutes <= 50) {
    category = 'Mixed Use';
    badgeColor = 'text-amber-700 bg-amber-50 border-amber-500/20';
    icon = '🟡';
    maxSpeed = isPremium ? '80 kW' : '50 kW';
    time1080 = minutes + ' mins (10-80%)';
    recommendation = 'Suitable for both city and occasional highway driving.';
  } else {
    category = 'City Commuter';
    badgeColor = 'text-red-750 bg-red-50 border-red-500/20';
    icon = '🔴';
    maxSpeed = '25 kW - 30 kW';
    time1080 = minutes + ' mins (10-80%)';
    recommendation = 'Best suited for daily city commuting.';
  }

  return {
    category,
    badgeColor,
    icon,
    maxSpeed,
    time1080,
    recommendation
  };
}

function getHighwayReadinessBadgeHtml(car) {
  const data = getHighwayReadinessData(car);
  let dotColor = '';

  if (data.category === 'Highway Ready') {
    dotColor = 'bg-emerald-500';
  } else if (data.category === 'Mixed Use') {
    dotColor = 'bg-amber-500';
  } else {
    dotColor = 'bg-red-500';
  }

  return '<div class="flex flex-col gap-1.5 py-1 text-left font-mono">' +
    '<div class="flex items-center gap-2">' +
      '<span class="inline-flex items-center gap-1.5 px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-wider border rounded-none ' + data.badgeColor + '">' +
        '<span class="w-1.5 h-1.5 ' + dotColor + ' rounded-full"></span>' +
        data.icon + ' ' + data.category.toUpperCase() +
      '</span>' +
    '</div>' +
    '<div class="text-[9.5px] leading-relaxed text-zinc-655 mt-1">' +
      '<div><span class="text-zinc-450 uppercase text-[7.5px] font-bold block mb-0.5">Max DC Speed</span><span class="text-black font-bold">' + data.maxSpeed + '</span></div>' +
      '<div class="mt-1"><span class="text-zinc-450 uppercase text-[7.5px] font-bold block mb-0.5">Est. 10-80% Time</span><span class="text-black font-bold">' + data.time1080 + '</span></div>' +
      '<div class="text-zinc-600 mt-1.5 italic">"' + data.recommendation + '"</div>' +
    '</div>' +
  '</div>';
}


/** Build a trip stat card for the results grid */
function makeTripStatCard(label, value, sub) {
  return '<div class="trip-stat-card">' +
    '<span class="font-mono text-[7.5px] text-zinc-400 uppercase tracking-wider transition-colors">' + label + '</span>' +
    '<span class="font-mono text-xl md:text-2xl font-black leading-none mt-1 trip-stat-value">' + value + '</span>' +
    (sub ? '<span class="font-mono text-[8px] mt-0.5 trip-stat-sub">' + sub + '</span>' : '') +
  '</div>';
}

/** Format decimal hours into a human-readable string */
function fmtHours(h) {
  var hrs  = Math.floor(h);
  var mins = Math.round((h - hrs) * 60);
  if (hrs  === 0) return mins + ' min';
  if (mins === 0) return hrs + ' hr';
  return hrs + ' hr ' + mins + ' min';
}

/** Render trip results into the pre-built DOM result panel */
function renderTripResults(data) {
  if (!data) return;

  var fromCity = (TRIP_CITIES.find(function(c) { return c.key === data.fromKey; }) || {}).label || data.fromKey;
  var toCity   = (TRIP_CITIES.find(function(c) { return c.key === data.toKey;   }) || {}).label || data.toKey;

  // Header
  document.getElementById('trip-res-route').textContent = fromCity + '  \u2192  ' + toCity;
  document.getElementById('trip-res-days').textContent  =
    data.days + '-day trip  |  ' + data.car.name + '  |  Real-world range: ' + data.realRange + ' km';

  // Highway readiness badge (light-theme from spec data)
  var hw = data.hwData;
  document.getElementById('trip-res-badge').innerHTML =
    '<div class="flex flex-col items-end gap-1">' +
      '<span class="inline-flex items-center gap-2 px-3 py-1.5 border font-mono text-[8.5px] uppercase tracking-wider ' + hw.badgeColor + '">' +
        hw.icon + ' ' + hw.category +
      '</span>' +
      '<span class="font-mono text-[7px] text-zinc-500">' + hw.recommendation + '</span>' +
    '</div>';

  var statsGrid = document.getElementById('trip-stats-grid');
  var totalChargeLbl = data.totalChargingHrs + ' hr ' + data.totalChargingRemMins + ' min';
  if (data.totalChargingHrs === 0) totalChargeLbl = data.totalChargingRemMins + ' min';
  if (data.chargingStops === 0)    totalChargeLbl = 'None needed';

  statsGrid.innerHTML =
    makeTripStatCard('Total Distance',      data.distance.toLocaleString('en-IN') + ' km', 'Road distance') +
    makeTripStatCard('Est. Drive Time',     fmtHours(data.driveTimeHours), 'Driving only') +
    makeTripStatCard('Real Highway Range',  data.realRange + ' km', 'Adjusted for conditions') +
    makeTripStatCard('Charging Stops',      data.chargingStops + (data.chargingStops === 1 ? ' Stop' : ' Stops'), 'Approx. 85% SoC target') +
    makeTripStatCard('Time Per Stop',       (data.chargingStops > 0 ? data.chargingTimePerStopMins + ' min' : 'N/A'), data.dcChargeKW + ' kW DC  |  10-80%') +
    makeTripStatCard('Total Charge Time',   totalChargeLbl, data.chargingStops > 0 ? (data.chargingStops + ' \u00d7 ' + data.chargingTimePerStopMins + ' min') : 'Single charge sufficient');

  // Cost comparison values
  document.getElementById('trip-res-ev-cost').textContent     = '\u20B9' + data.evChargingCost.toLocaleString('en-IN');
  document.getElementById('trip-res-petrol-cost').textContent = '\u20B9' + data.petrolCost.toLocaleString('en-IN');
  document.getElementById('trip-res-savings').textContent     = '\u20B9' + data.savings.toLocaleString('en-IN');
  document.getElementById('trip-res-savings-pct').textContent = 'Save ' + data.savingsPct + '% vs petrol on this trip';

  // Animate cost bars after DOM settles
  var maxCost = Math.max(data.evChargingCost, data.petrolCost);
  setTimeout(function() {
    var evPct = maxCost > 0 ? Math.round((data.evChargingCost / maxCost) * 100) : 0;
    document.getElementById('trip-bar-ev').style.width     = evPct + '%';
    document.getElementById('trip-bar-petrol').style.width = '100%';
  }, 400);

  // Details row
  var detailsRow = document.getElementById('trip-details-row');
  var paxEl = document.getElementById('trip-pax');
  var paxCount = paxEl ? paxEl.value : '?';
  detailsRow.innerHTML =
    makeTripStatCard('Total kWh Required', data.totalKWh + ' kWh', 'Full journey') +
    makeTripStatCard('Battery Capacity',   data.batteryKWh + ' kWh', data.car.name) +
    makeTripStatCard('DC Charge Speed',    data.dcChargeKW + ' kW', 'Derived from spec') +
    makeTripStatCard('Trip Config',        data.days + ' Days / ' + paxCount + ' Pax', 'Selected settings');

  // Charging stations (light theme borders and colors)
  var stations = getRouteStations(data.fromKey, data.toKey);
  var stationsList = document.getElementById('trip-stations-list');
  if (stations.length > 0) {
    stationsList.innerHTML = stations.map(function(s, i) {
      return '<div class="flex items-center gap-3 border border-zinc-200 bg-white hover:border-black transition-all duration-300 p-3" style="animation:tripCardIn 0.4s ' + (0.05 + i * 0.07).toFixed(2) + 's both cubic-bezier(0.16,1,0.3,1)">' +
        '<div class="w-6 h-6 border border-zinc-300 flex items-center justify-center flex-shrink-0">' +
          '<span class="font-mono text-[8px] text-zinc-500">' + (i + 1) + '</span>' +
        '</div>' +
        '<div class="flex flex-col gap-0.5">' +
          '<span class="font-mono text-[9px] text-black font-semibold">' + s.city + '</span>' +
          '<span class="font-mono text-[7.5px] text-zinc-400">' + s.chargerType + ' &nbsp;&middot;&nbsp; ' + s.network + '</span>' +
        '</div>' +
        '<div class="ml-auto"><svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-2 text-zinc-400" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg></div>' +
      '</div>';
    }).join('');
  } else {
    stationsList.innerHTML =
      '<div class="col-span-2 font-mono text-[8.5px] text-zinc-500 border border-zinc-200 bg-zinc-50 p-4 leading-relaxed">' +
        '<span class="text-black block mb-1 font-bold">Charging station data</span>' +
        'Tata Power EV, Statiq, and EESL CCS2 chargers are available in most major cities along this route. ' +
        'Live station-by-station mapping will be available once the Google Maps API is connected.' +
      '</div>';
  }

  // Reveal the results panel
  var resultsEl = document.getElementById('trip-results');
  resultsEl.classList.add('trip-results-visible');
  setTimeout(function() {
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 180);
}

/** Initialize all Trip Planner UI bindings on page load */
function initTripPlanner() {
  var vehicleSelect = document.getElementById('trip-vehicle');
  var fromSelect    = document.getElementById('trip-from');
  var toSelect      = document.getElementById('trip-to');
  var daysSlider    = document.getElementById('trip-days');
  var daysVal       = document.getElementById('trip-days-val');
  var paxSlider     = document.getElementById('trip-pax');
  var paxVal        = document.getElementById('trip-pax-val');
  var planBtn       = document.getElementById('btn-plan-trip');
  var acGroup       = document.getElementById('trip-ac-group');
  var styleGroup    = document.getElementById('trip-style-group');

  if (!vehicleSelect || !fromSelect || !toSelect || !planBtn) return;

  // Populate vehicle dropdown from EV_DATABASE
  EV_DATABASE.forEach(function(car) {
    var opt = document.createElement('option');
    opt.value = car.id;
    opt.textContent = car.name;
    vehicleSelect.appendChild(opt);
  });

  // Populate city dropdowns
  TRIP_CITIES.forEach(function(city) {
    var optA = document.createElement('option');
    optA.value = city.key;
    optA.textContent = city.label;
    fromSelect.appendChild(optA);

    var optB = document.createElement('option');
    optB.value = city.key;
    optB.textContent = city.label;
    toSelect.appendChild(optB);
  });

  // Defaults: Delhi -> Mumbai
  fromSelect.value = 'delhi';
  toSelect.value   = 'mumbai';

  // Slider live labels
  daysSlider.addEventListener('input', function() {
    daysVal.textContent = this.value + (this.value === '1' ? ' Day' : ' Days');
  });
  paxSlider.addEventListener('input', function() {
    paxVal.textContent = this.value + (this.value === '1' ? ' Person' : ' People');
  });

  // Toggle group — AC
  if (acGroup) {
    acGroup.querySelectorAll('.trip-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        acGroup.querySelectorAll('.trip-toggle-btn').forEach(function(b) { b.classList.remove('trip-active'); });
        this.classList.add('trip-active');
      });
    });
  }

  // Toggle group — Driving Style
  if (styleGroup) {
    styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(b) { b.classList.remove('trip-active'); });
        this.classList.add('trip-active');
      });
    });
  }

  // Plan My Trip button
  planBtn.addEventListener('click', function() {
    var carId      = vehicleSelect.value;
    var fromKey    = fromSelect.value;
    var toKey      = toSelect.value;
    var days       = parseInt(daysSlider.value);
    var passengers = parseInt(paxSlider.value);

    var acBtn    = acGroup    ? acGroup.querySelector('.trip-active')    : null;
    var styleBtn = styleGroup ? styleGroup.querySelector('.trip-active') : null;
    var acUsage      = acBtn    ? acBtn.getAttribute('data-value')    : 'medium';
    var drivingStyle = styleBtn ? styleBtn.getAttribute('data-value') : 'normal';

    // Same city check
    if (fromKey === toKey) {
      var origHTML = planBtn.innerHTML;
      planBtn.textContent = 'Please select different cities!';
      setTimeout(function() { planBtn.innerHTML = origHTML; }, 2200);
      return;
    }

    // Route not in database
    if (!getRouteData(fromKey, toKey)) {
      var fromLabel = (TRIP_CITIES.find(function(c) { return c.key === fromKey; }) || {}).label || fromKey;
      var toLabel   = (TRIP_CITIES.find(function(c) { return c.key === toKey;   }) || {}).label || toKey;
      var resultsEl = document.getElementById('trip-results');
      resultsEl.classList.add('trip-results-visible');
      document.getElementById('trip-stats-grid').innerHTML =
        '<div class="col-span-3 border border-zinc-700 p-5 font-mono text-[9px] text-zinc-400 leading-relaxed">' +
          '<span class="text-white font-bold block mb-1">Route not yet in database.</span>' +
          'Direct road data for ' + fromLabel + ' \u2192 ' + toLabel +
          ' is not yet mapped. Try popular corridors like Delhi \u2192 Mumbai, Bengaluru \u2192 Delhi, or Mumbai \u2192 Pune. ' +
          'Live Google Maps API integration will cover all Indian routes once connected.' +
        '</div>';
      document.getElementById('trip-details-row').innerHTML        = '';
      document.getElementById('trip-stations-list').innerHTML      = '';
      document.getElementById('trip-res-route').textContent        = fromLabel + '  \u2192  ' + toLabel;
      document.getElementById('trip-res-days').textContent         = 'Route data coming soon';
      document.getElementById('trip-res-badge').innerHTML          = '';
      document.getElementById('trip-res-ev-cost').textContent      = '\u2014';
      document.getElementById('trip-res-petrol-cost').textContent  = '\u2014';
      document.getElementById('trip-res-savings').textContent      = '\u2014';
      document.getElementById('trip-res-savings-pct').textContent  = '';
      setTimeout(function() { resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 180);
      return;
    }

    // Loading state
    planBtn.disabled = true;
    planBtn.textContent = 'Calculating...';

    setTimeout(function() {
      var tripData = calcTripData(carId, fromKey, toKey, days, passengers, acUsage, drivingStyle);
      renderTripResults(tripData);
      planBtn.disabled = false;
      planBtn.innerHTML = 'Plan My Trip &nbsp;\u2192';
    }, 340);
  });
}

// Jargon Buster Dictionary & Logic
const JARGON_DICTIONARY = {
  'V2L (Vehicle-to-Load)': 'Lets you power appliances like a laptop, fan, or small refrigerator directly from your EV.',
  'V2L': 'Lets you power appliances like a laptop, fan, or small refrigerator directly from your EV.',
  'Regenerative Braking': 'Recovers energy while slowing down and sends it back to the battery, helping increase driving range.',
  'Ground Clearance': 'The height between the road and the bottom of the car. Higher ground clearance is better for speed breakers and rough roads.',
  'kWh': 'The size of the battery. A larger kWh value usually means a longer driving range.',
  'kW Charging': 'The charging power. Higher kW means faster charging.',
  'Torque': 'The instant pulling power you feel when you accelerate.',
  'CCS2': 'The standard charging connector type used in India. It supports both AC and DC fast charging.',
  'ADAS': 'Advanced Driver Assistance Systems. Includes safety features like automatic emergency braking and lane keep assist.',
  'BMS': 'Battery Management System. The brain of the battery that ensures it charges and discharges safely.'
};

function applyJargonBuster() {
  const container = document.body;
  const terms = Object.keys(JARGON_DICTIONARY).sort((a, b) => b.length - a.length);
  
  const textNodes = [];
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tagName = parent.tagName.toUpperCase();
        if (tagName === 'SCRIPT' || 
            tagName === 'STYLE' || 
            tagName === 'A' || 
            tagName === 'BUTTON' || 
            tagName === 'TEXTAREA' || 
            tagName === 'SELECT' || 
            tagName === 'OPTION' || 
            tagName === 'INPUT' || 
            parent.closest('.jargon-term') || 
            parent.closest('nav') ||
            parent.closest('#mega-nav') ||
            parent.closest('#mega-mobile-drawer')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  
  while(walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }
  
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  for (let i = textNodes.length - 1; i >= 0; i--) {
    const node = textNodes[i];
    let text = node.nodeValue;
    let modified = false;
    let html = text;
    
    for (const term of terms) {
      const regex = new RegExp('\\b' + escapeRegExp(term) + '\\b', 'gi');
      if (regex.test(html)) {
        html = html.replace(regex, (match) => {
          modified = true;
          return `<span class="jargon-term" data-tooltip="${JARGON_DICTIONARY[term]}">${match}</span>`;
        });
      }
    }
    
    if (modified) {
      const span = document.createElement('span');
      span.innerHTML = html;
      node.parentNode.replaceChild(span, node);
    }
  }
  
  document.querySelectorAll('.jargon-term').forEach(termEl => {
    if (termEl.getAttribute('data-listener-bound')) return;
    termEl.setAttribute('data-listener-bound', 'true');
    termEl.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasActive = termEl.classList.contains('active');
      document.querySelectorAll('.jargon-term.active').forEach(el => el.classList.remove('active'));
      if (!wasActive) {
        termEl.classList.add('active');
      }
    });
  });
}

document.addEventListener('click', () => {
  document.querySelectorAll('.jargon-term.active').forEach(el => el.classList.remove('active'));
});

// Animated scroll dividers helper driven entirely by scroll position
let scrollDividers = [];
let dividerAnimFrame = null;

function updateDividerPositions() {
  const viewportHeight = window.innerHeight;
  
  // Animate over a range: start when divider is at bottom of viewport,
  // end when divider is 30% of viewport height above the bottom edge.
  const startY = viewportHeight;
  const endY = viewportHeight * 0.7;
  const distance = startY - endY;

  scrollDividers.forEach(div => {
    if (!div.element) return;
    const rect = div.element.getBoundingClientRect();
    const y = rect.top; // relative to viewport top
    
    let progress = 0;
    if (y <= startY) {
      if (y <= endY) {
        progress = 1;
      } else {
        const raw = (startY - y) / distance;
        // easeOutCubic: f(x) = 1 - (1-x)^3
        progress = 1 - Math.pow(1 - raw, 3);
      }
    } else {
      progress = 0;
    }
    
    div.element.style.setProperty('--divider-progress', progress.toFixed(4));
  });
}

function handleScrollDividerEvent() {
  if (dividerAnimFrame) return;
  dividerAnimFrame = requestAnimationFrame(() => {
    updateDividerPositions();
    dividerAnimFrame = null;
  });
}

function initScrollDividers() {
  const divs = document.querySelectorAll('.section-divider');
  scrollDividers = Array.from(divs).map(div => {
    div.style.setProperty('--divider-progress', '0');
    return { element: div };
  });
  
  // Trigger initial position calculations
  updateDividerPositions();
}

// Bind scroll/resize event listeners once globally
window.removeEventListener('scroll', handleScrollDividerEvent);
window.removeEventListener('resize', handleScrollDividerEvent);
window.addEventListener('scroll', handleScrollDividerEvent, { passive: true });
window.addEventListener('resize', handleScrollDividerEvent, { passive: true });

// Boot the trip planner
initTripPlanner();

// ===================================================
// NEW CODE: PREMIUM EDUCATIONAL HOMEPAGE SECTIONS
// ===================================================

function initWhyEVAccordion() {
  const items = document.querySelectorAll('#why-ev-accordion .accordion-item');
  if (items.length === 0) return;

  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all items
      items.forEach(otherItem => {
        otherItem.classList.remove('open');
        const otherContent = otherItem.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = '0';
      });
      
      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
  
  // Open first item by default
  const firstItem = items[0];
  const firstContent = firstItem.querySelector('.accordion-content');
  if (firstItem && firstContent) {
    firstItem.classList.add('open');
    firstContent.style.maxHeight = firstContent.scrollHeight + 'px';
  }
}

function renderEVGallery() {
  const container = document.getElementById('gallery-viewport');
  if (!container) return;
  container.innerHTML = '';
  
  // Get cars belonging to the explore section
  const cars = EV_DATABASE.filter(car => car.sections && car.sections.includes('explore'));
  cars.forEach(car => {
    const card = document.createElement('div');
    card.className = 'gallery-card border border-zinc-150 bg-zinc-50/50 p-5 flex flex-col justify-between h-[360px] rounded-xl hover:border-black transition-all hover:scale-[1.01] hover:shadow-[0_8px_30px_rgba(0,0,0,0.03)] cursor-pointer snap-start group';
    card.innerHTML = `
      <div class="flex flex-col gap-3">
        <div class="h-40 bg-white border border-zinc-100 rounded-lg overflow-hidden flex items-center justify-center p-4 relative">
          <img src="${car.image || 'tata_nexon_ev_1782477217305.png'}" alt="${car.name}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105">
        </div>
        <div class="text-left font-mono">
          <span class="text-[9px] text-zinc-400 uppercase tracking-widest block">${car.brand}</span>
          <h3 class="text-xs font-bold uppercase tracking-wider text-black mt-1">${car.name}</h3>
          <p class="text-[10px] text-zinc-500 mt-2 flex flex-col gap-1 border-t border-zinc-100 pt-2">
            <span>RANGE: <strong>${car.range}</strong></span>
            <span>BATTERY: <strong>${car.battery}</strong></span>
            <span>PRICE: <strong>${car.price}</strong></span>
          </p>
        </div>
      </div>
      <button class="w-full py-2 bg-black hover:bg-zinc-800 text-white font-mono text-[9px] uppercase tracking-widest transition-colors mt-4 opacity-80 group-hover:opacity-100">
        Quick View
      </button>
    `;
    
    // Handle click anywhere on card or quick view button
    card.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(`/cars/${car.id}`);
    });
    
    container.appendChild(card);
  });
  
  // Bind scroll controls
  const btnPrev = document.getElementById('gallery-prev');
  const btnNext = document.getElementById('gallery-next');
  if (btnPrev && btnNext) {
    // Clean old listeners to prevent stacking
    const newPrev = btnPrev.cloneNode(true);
    const newNext = btnNext.cloneNode(true);
    btnPrev.parentNode.replaceChild(newPrev, btnPrev);
    btnNext.parentNode.replaceChild(newNext, btnNext);
    
    newPrev.addEventListener('click', () => {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    });
    newNext.addEventListener('click', () => {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    });
  }
}

const guideExplanations = {
  'home-charging': {
    title: 'Home Charging Setup',
    explanation: 'AC Slow charging at home is the most common way to top up your EV. Standard setup uses a 15A single-phase plug (charging at 2-3 kW) taking 12-16 hours. Installing a dedicated 7.2 kW AC Wallbox charger reduces charging duration to 6-8 hours. Make sure to check load allowances on your home electricity meter.',
    analogy: 'Home charging is like charging your phone overnight; it takes time but is cheap, convenient, and ensures a full battery when you wake up.'
  },
  'apartment-charging': {
    title: 'Apartment Complex Charging',
    explanation: 'Securing a charger in a multi-owner residential block (apartment/society) requires coordination with the Resident Welfare Association (RWA) or building manager. Under current norms in many states, RWAs must provide a No Objection Certificate (NOC) for installing EV chargers at individual designated parking spots.',
    analogy: 'Installing a charger in an apartment is like getting permission to add a dedicated split air conditioner line; it requires building safety clearance and wiring checks.'
  },
  'fast-vs-slow': {
    title: 'Fast (DC) vs Slow (AC) Charging',
    explanation: 'Alternating Current (AC) is what comes from standard grids and home slots, which the onboard car charger converts to DC. DC Fast Chargers feed Direct Current directly to the battery, allowing extremely high power output (up to 350kW+) and short sessions (e.g. 10% to 80% in 30 minutes). Use DC charging for highway travel, and AC slow charging for daily use.',
    analogy: 'AC slow charging is like refilling a small water bottle from a standard household tap, whereas DC fast charging is like filling a barrel with a high-pressure fire hose.'
  },
  'battery-warranty': {
    title: 'EV Battery Warranty & Lifespan',
    explanation: 'Most EV manufacturers in India provide a dedicated warranty of 8 years or 1,60,000 km (whichever is earlier) on the battery pack, guaranteeing that capacity will not drop below 70-80%. Modern batteries are managed by active cooling networks and are projected to outlast the car\'s standard lifecycle.',
    analogy: 'EV battery warranty ensures that even after years of active daily use, you still retain a highly efficient pack, just like structural warranties on standard appliances.'
  },
  'subsidies': {
    title: 'State Subsidies & Benefits',
    explanation: 'The government of India provides substantial EV incentives. Under national FAME schemes, direct cash subsidies are offered. Additionally, multiple states waive road taxes and registration fees entirely. Under Section 80EEB of the Income Tax Act, buyers can also deduct up to ₹1.5 Lakh of interest paid on EV loans.',
    analogy: 'State subsidies are direct financial discounts and tax credits that reduce your net buying cost, similar to corporate tax rebates.'
  },
  'running-cost': {
    title: 'EV Running Cost Analysis',
    explanation: 'Electric vehicles offer unmatched operating economy. A standard petrol hatchback costs ₹7-9 per km to run. An EV running on home electricity tariffs costs only ₹1-1.5 per km. Over an annual distance of 15,005 km, this translates to direct savings of over ₹1,00,000 in fuel costs alone.',
    analogy: 'An EV running cost is like operating a highly efficient LED bulb, whereas a petrol car is like running an old incandescent bulb that wastes 80% of its energy as heat.'
  },
  'trip-planning': {
    title: 'EV Road Trip Planning',
    explanation: 'Planning a road trip in an EV requires identifying DC fast charging hubs along your route. Use EV navigation apps to check real-time status and connector compatibility. Driving at a steady 80-90 km/h and pre-cooling the cabin while plugged in preserves highway range.',
    analogy: 'EV trip planning is like booking flights with layovers; you plan ahead to make brief stops at key charging terminals while stretching your legs.'
  },
  'real-range': {
    title: 'Real-World Range Variables',
    explanation: 'An EV\'s real-world range is usually 20-30% lower than the ARAI certified range. Variables that affect battery consumption include driving speed (driving at 120 km/h depletes the battery much faster than at 80 km/h), passenger weight load, cabin AC usage, and uphill driving.',
    analogy: 'Just like a smartphone battery drains faster when playing high-end graphics games with maximum screen brightness, an EV uses more charge at high speeds with full AC.'
  }
};

const hubExplanations = {
  'regen-braking': {
    title: 'Regenerative Braking',
    explanation: 'When you lift your foot off the accelerator, the electric motor runs in reverse, acting as a generator to slow the vehicle down. This process converts kinetic energy back into electrical energy, sending it to the battery and extending your range by up to 10-15% while reducing brake pad wear.',
    analogy: 'It is like a dynamo generator on a bicycle that charges the lights when you peddle down a hill.'
  },
  'lfp-nmc': {
    title: 'LFP vs NMC Battery Chemistry',
    explanation: 'Lithium Iron Phosphate (LFP) batteries are highly durable, support more charge cycles, and can be charged to 100% regularly. Nickel Manganese Cobalt (NMC) batteries have a higher energy density, providing longer range in a lighter package, but degrade faster if charged to 100% daily.',
    analogy: 'LFP is like a heavy-duty workhorse that works reliably for decades; NMC is like a high-performance athlete that is lighter and faster but needs careful recovery.'
  },
  'ac-dc': {
    title: 'AC vs DC Charging Standards',
    explanation: 'Alternating Current (AC) is what comes from standard grids and home sockets; the car\'s onboard charger must convert it to Direct Current (DC) to store it in the battery. DC Fast Chargers bypass the onboard charger and feed electricity directly into the battery, enabling high charging speeds.',
    analogy: 'AC slow charging is like refilling a small water bottle from a standard household tap; DC fast charging is like filling a barrel with a high-pressure fire hose.'
  },
  'v2l': {
    title: 'Vehicle-to-Load (V2L) Technology',
    explanation: 'V2L is a feature that allows your EV to act as a mobile power bank. It provides 230V AC power from the charging port, letting you plug in and run standard home appliances (up to 3kW+) like laptops, power tools, electric kettles, or even charge another electric vehicle.',
    analogy: 'V2L turns your electric car into a heavy-duty portable generator that can power your campsite or your house during a blackout.'
  },
  'clearance': {
    title: 'EV Ground Clearance Challenges',
    explanation: 'Ground clearance is the distance between the lowest point of the vehicle chassis and the road. EVs often have lower ground clearance due to the floor-mounted battery pack. In India, a ground clearance of 170-190mm is ideal to protect the battery casing from high speed breakers and water-logged roads.',
    analogy: 'It is like wearing thick-soled shoes to protect your feet from sharp stones on rough roads.'
  },
  'battery-health': {
    title: 'Understanding Battery Health (SOH)',
    explanation: 'Battery health represents the State of Health (SOH) of the battery cells relative to when they were new. Over years of use, all batteries experience slow capacity degradation. Maintaining healthy charging habits (avoiding deep discharges, limiting DC fast charging) preserves battery health and resale value.',
    analogy: 'It is like the battery health percentage shown in your smartphone settings; it starts at 100% and slowly drops to 80-90% over years of regular use.'
  },
  'etiquette': {
    title: 'Public EV Charging Etiquette',
    explanation: 'When using public charging stations, vacate the bay immediately after your session ends (preferably at 80% charge, as the rate slows down significantly past this point). Never block a charging bay if you are not charging, and report any faulty equipment to the network provider.',
    analogy: 'It is like moving your car away from a fuel pump immediately after refuelling so the next driver can pull up.'
  },
  'highway': {
    title: 'Highway Charging Strategies',
    explanation: 'Long-distance highway travel in an EV requires planning stops at high-power DC chargers (50kW+). Drive at a steady speed (80-90 km/h is the sweet spot for efficiency), pre-heat/cool the cabin while plugged in, and keep a buffer of 15-20% battery between stops.',
    analogy: 'It is like planning rest stops on a family road trip to coincide with meal times and restroom breaks.'
  }
};

function initEducationalModals() {
  // 1. Bind Section 4 Read More buttons
  document.querySelectorAll('.btn-read-guide').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const guideId = btn.getAttribute('data-guide-id');
      navigateTo('/guide/guide-' + guideId);
    });
  });
  
  // 2. Bind Section 6 Knowledge Hub cards
  document.querySelectorAll('.btn-open-hub').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const hubKey = card.getAttribute('data-hub-key');
      navigateTo('/hub/' + hubKey);
    });
  });
}

function initRevealObservers() {
  // Observers for reveal-on-scroll elements
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  revealElements.forEach(el => revealObserver.observe(el));
  
  // Staggered reveals for battery care cards
  const batteryCards = document.querySelectorAll('.battery-tip-card');
  const batteryObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        batteryCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('reveal-active');
          }, index * 100);
        });
      }
    });
  }, { threshold: 0.1 });
  const batteryGrid = document.getElementById('battery-tips-grid');
  if (batteryGrid) batteryObserver.observe(batteryGrid);
  
  // Staggered reveals for Pros vs Considerations columns
  const proCards = document.querySelectorAll('#pros-column .glass-card');
  const conCards = document.querySelectorAll('#cons-column .glass-card');
  
  const columnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        proCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('reveal-active');
          }, index * 80);
        });
        conCards.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add('reveal-active');
          }, index * 80);
        });
      }
    });
  }, { threshold: 0.1 });
  const columnsGrid = document.getElementById('should-you-buy');
  if (columnsGrid) columnObserver.observe(columnsGrid);
}

function renderBrandPage(brandId) {
  const brandNameMap = {
    'tata': 'Tata Motors',
    'mahindra': 'Mahindra Electric',
    'hyundai': 'Hyundai',
    'mg': 'MG Motor',
    'kia': 'Kia',
    'byd': 'BYD',
    'bmw': 'BMW',
    'mercedes-benz': 'Mercedes-Benz',
    'volvo': 'Volvo',
    'audi': 'Audi',
    'maruti-suzuki': 'Maruti Suzuki',
    'toyota': 'Toyota',
    'honda': 'Honda',
    'skoda': 'Skoda',
    'volkswagen': 'Volkswagen',
    'renault': 'Renault',
    'nissan': 'Nissan',
    'citroen': 'Citroën',
    'jeep': 'Jeep',
    'force-motors': 'Force Motors',
    'isuzu': 'Isuzu',
    'porsche': 'Porsche',
    'vinfast': 'VinFast'
  };

  const brandName = brandNameMap[brandId.toLowerCase()] || brandId.toUpperCase();
  const breadcrumbs = ['MANUFACTURERS', brandName];
  
  let searchQuery = '';
  let sortBy = 'name-asc';
  let typeFilter = 'all';

  function generateBrandContentHtml() {
    const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
    
    const filteredCars = brandCars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            car.features.toLowerCase().includes(searchQuery.toLowerCase());
      
      const isUpcoming = car.sections && car.sections.includes('upcoming');
      const matchesType = typeFilter === 'all' || 
                          (typeFilter === 'available' && !isUpcoming) || 
                          (typeFilter === 'upcoming' && isUpcoming);
      
      return matchesSearch && matchesType;
    });

    filteredCars.sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceVal - b.priceVal;
      if (sortBy === 'price-desc') return b.priceVal - a.priceVal;
      if (sortBy === 'range-desc') return b.rangeVal - a.rangeVal;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });

    const availableCars = filteredCars.filter(c => !c.sections.includes('upcoming'));
    const upcomingCars = filteredCars.filter(c => c.sections.includes('upcoming'));

    let availableGridHtml = '';
    if (availableCars.length > 0) {
      availableCars.forEach(car => {
        availableGridHtml += createCarCardHtml(car, 'w-full');
      });
    } else {
      availableGridHtml = `<div class="col-span-full py-12 text-center text-zinc-400 font-mono text-xs">NO VEHICLES AVAILABLE</div>`;
    }

    let upcomingGridHtml = '';
    if (upcomingCars.length > 0) {
      upcomingCars.forEach(car => {
        upcomingGridHtml += createCarCardHtml(car, 'w-full');
      });
    } else {
      upcomingGridHtml = `<div class="col-span-full py-12 text-center text-zinc-400 font-mono text-xs">NO UPCOMING VEHICLES PLANNED</div>`;
    }

    return `
      <div class="relative bg-zinc-950 text-white p-8 md:p-12 overflow-hidden flex flex-col justify-between min-h-[220px] rounded-xl border border-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.15)] mt-4">
        <div class="absolute inset-0 bg-radial-gradient from-zinc-800/10 to-transparent opacity-50 pointer-events-none"></div>
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div class="text-left flex flex-col gap-2">
            <span class="text-[9px] font-mono text-zinc-400 tracking-[0.3em] uppercase block">MANUFACTURER ARCHIVE</span>
            <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">${brandName}</h1>
            <p class="text-xs text-zinc-400 font-mono max-w-md mt-1">Explore all current, latest, and upcoming electric mobility options from ${brandName}.</p>
          </div>
          
          <div class="border border-zinc-800 bg-zinc-900/50 px-6 py-6 flex items-center justify-center min-w-[120px] rounded-lg">
            <span class="font-mono text-lg font-black tracking-widest text-white uppercase">${brandId.replace('-', ' ')}</span>
          </div>
        </div>

        <div class="flex items-center gap-6 mt-8 z-10 font-mono text-[9px] text-zinc-400 border-t border-zinc-900 pt-4">
          <span>AVAILABLE: <strong>${brandCars.filter(c => !c.sections.includes('upcoming')).length} EVs</strong></span>
          <span>UPCOMING: <strong>${brandCars.filter(c => c.sections.includes('upcoming')).length} EVs</strong></span>
        </div>
      </div>

      <div class="flex flex-col md:flex-row gap-4 justify-between items-center border-b border-zinc-150 pb-4 mt-8 font-mono">
        <div class="w-full md:w-auto flex flex-col md:flex-row gap-3">
          <input type="text" id="brand-search-input" value="${searchQuery}" placeholder="Search within ${brandName}..." class="bg-zinc-50 border border-zinc-200 text-xs px-4 py-2.5 outline-none focus:border-black transition-colors rounded-lg w-full md:w-64">
          
          <select id="brand-type-filter" class="bg-zinc-50 border border-zinc-200 text-xs px-4 py-2.5 outline-none focus:border-black transition-colors rounded-lg cursor-pointer">
            <option value="all" ${typeFilter === 'all' ? 'selected' : ''}>All Vehicles</option>
            <option value="available" ${typeFilter === 'available' ? 'selected' : ''}>Available Now</option>
            <option value="upcoming" ${typeFilter === 'upcoming' ? 'selected' : ''}>Upcoming Models</option>
          </select>
        </div>

        <div class="w-full md:w-auto flex items-center gap-2 justify-end">
          <label for="brand-sort-select" class="text-[9px] text-zinc-500 uppercase tracking-wider">Sort By</label>
          <select id="brand-sort-select" class="bg-zinc-50 border border-zinc-200 text-xs px-4 py-2.5 outline-none focus:border-black transition-colors rounded-lg cursor-pointer">
            <option value="name-asc" ${sortBy === 'name-asc' ? 'selected' : ''}>Name (A-Z)</option>
            <option value="price-asc" ${sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="range-desc" ${sortBy === 'range-desc' ? 'selected' : ''}>Range: High to Low</option>
          </select>
        </div>
      </div>

      <div id="brand-vehicles-container" class="mt-8 flex flex-col gap-12">
        ${typeFilter !== 'upcoming' ? `
          <div>
            <div class="text-left mb-4 border-b border-zinc-100 pb-2">
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase">NOW RUNNING IN INDIA</span>
              <h2 class="text-lg font-bold uppercase tracking-wide text-black">Available Electric Vehicles</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              ${availableGridHtml}
            </div>
          </div>
        ` : ''}

        ${typeFilter !== 'available' ? `
          <div>
            <div class="text-left mb-4 border-b border-zinc-100 pb-2">
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase">FUTURE LAUNCH ROADMAP</span>
              <h2 class="text-lg font-bold uppercase tracking-wide text-black">Upcoming Electric Vehicles</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              ${upcomingGridHtml}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  function render() {
    const contentHtml = generateBrandContentHtml();
    
    renderSubpage(brandName, breadcrumbs, contentHtml, '/');
    
    const searchInp = document.getElementById('brand-search-input');
    const typeFilt = document.getElementById('brand-type-filter');
    const sortSel = document.getElementById('brand-sort-select');

    if (searchInp) {
      searchInp.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        updateBrandListOnly();
      });
    }

    if (typeFilt) {
      typeFilt.addEventListener('change', (e) => {
        typeFilter = e.target.value;
        render();
      });
    }

    if (sortSel) {
      sortSel.addEventListener('change', (e) => {
        sortBy = e.target.value;
        updateBrandListOnly();
      });
    }

    attachCardEvents();
  }

  function updateBrandListOnly() {
    const container = document.getElementById('brand-vehicles-container');
    if (container) {
      const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
      
      const filteredCars = brandCars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              car.features.toLowerCase().includes(searchQuery.toLowerCase());
        
        const isUpcoming = car.sections && car.sections.includes('upcoming');
        const matchesType = typeFilter === 'all' || 
                            (typeFilter === 'available' && !isUpcoming) || 
                            (typeFilter === 'upcoming' && isUpcoming);
        
        return matchesSearch && matchesType;
      });

      filteredCars.sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceVal - b.priceVal;
        if (sortBy === 'price-desc') return b.priceVal - a.priceVal;
        if (sortBy === 'range-desc') return b.rangeVal - a.rangeVal;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
      });

      const availableCars = filteredCars.filter(c => !c.sections.includes('upcoming'));
      const upcomingCars = filteredCars.filter(c => c.sections.includes('upcoming'));

      let availableGridHtml = '';
      if (availableCars.length > 0) {
        availableCars.forEach(car => {
          availableGridHtml += createCarCardHtml(car, 'w-full');
        });
      } else {
        availableGridHtml = `<div class="col-span-full py-12 text-center text-zinc-400 font-mono text-xs">NO VEHICLES AVAILABLE</div>`;
      }

      let upcomingGridHtml = '';
      if (upcomingCars.length > 0) {
        upcomingCars.forEach(car => {
          upcomingGridHtml += createCarCardHtml(car, 'w-full');
        });
      } else {
        upcomingGridHtml = `<div class="col-span-full py-12 text-center text-zinc-400 font-mono text-xs">NO UPCOMING VEHICLES PLANNED</div>`;
      }

      container.innerHTML = `
        ${typeFilter !== 'upcoming' ? `
          <div>
            <div class="text-left mb-4 border-b border-zinc-100 pb-2">
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase">NOW RUNNING IN INDIA</span>
              <h2 class="text-lg font-bold uppercase tracking-wide text-black">Available Electric Vehicles</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              ${availableGridHtml}
            </div>
          </div>
        ` : ''}

        ${typeFilter !== 'available' ? `
          <div>
            <div class="text-left mb-4 border-b border-zinc-100 pb-2">
              <span class="font-mono text-[9px] text-zinc-500 tracking-[0.2em] uppercase">FUTURE LAUNCH ROADMAP</span>
              <h2 class="text-lg font-bold uppercase tracking-wide text-black">Upcoming Electric Vehicles</h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              ${upcomingGridHtml}
            </div>
          </div>
        ` : ''}
      `;
      attachCardEvents();
    }
  }

  render();
}

let isHighlighting = false;
function highlightElectricWord(rootElement = document.body) {
  if (isHighlighting) return;
  isHighlighting = true;
  
  try {
    const walker = document.createTreeWalker(
      rootElement,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node) {
          // Reject if inside Hero section (id="home")
          let parent = node.parentElement;
          while (parent) {
            if (parent.id === 'home' || 
                parent.tagName === 'SCRIPT' || 
                parent.tagName === 'STYLE' || 
                parent.tagName === 'TITLE' || 
                parent.tagName === 'SELECT' || 
                parent.tagName === 'OPTION' || 
                parent.tagName === 'INPUT' || 
                parent.tagName === 'TEXTAREA') {
              return NodeFilter.FILTER_REJECT;
            }
            parent = parent.parentElement;
          }
          
          // Reject if already highlighted
          if (node.parentElement && node.parentElement.classList.contains('electric-highlight')) {
            return NodeFilter.FILTER_REJECT;
          }
          
          // Only highlight if inside a heading tag (H1-H6)
          let isInsideHeading = false;
          let p = node.parentElement;
          while (p) {
            if (/^H[1-6]$/i.test(p.tagName)) {
              isInsideHeading = true;
              break;
            }
            p = p.parentElement;
          }
          if (!isInsideHeading) return NodeFilter.FILTER_REJECT;
          
          return /\bElectric\b/.test(node.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    const nodes = [];
    while (walker.nextNode()) {
      nodes.push(walker.currentNode);
    }

    nodes.forEach(node => {
      const parent = node.parentNode;
      if (!parent) return;

      const text = node.nodeValue;
      const parts = text.split(/\bElectric\b/);
      
      const fragment = document.createDocumentFragment();
      parts.forEach((part, index) => {
        if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
        if (index < parts.length - 1) {
          const span = document.createElement('span');
          span.className = 'electric-highlight';
          span.style.color = '#22C55E';
          span.style.fontWeight = 'inherit';
          span.textContent = 'Electric';
          fragment.appendChild(span);
        }
      });

      parent.replaceChild(fragment, node);
    });
  } catch (err) {
    console.error("Error highlighting Electric:", err);
  } finally {
    isHighlighting = false;
  }
}

function initElectricHighlightObserver() {
  // Highlight initial DOM
  highlightElectricWord();
  
  // Set up MutationObserver to watch for additions/updates
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (let mutation of mutations) {
      if (mutation.type === 'childList') {
        for (let addedNode of mutation.addedNodes) {
          if (addedNode.nodeType === Node.ELEMENT_NODE) {
            // Check if it is inside Hero
            if (addedNode.id === 'home' || addedNode.closest('#home')) continue;
            shouldRun = true;
            break;
          }
        }
      } else if (mutation.type === 'characterData') {
        if (mutation.target.parentNode && !mutation.target.parentNode.closest('#home')) {
          shouldRun = true;
        }
      }
      if (shouldRun) break;
    }
    
    if (shouldRun) {
      // Disconnect observer temporarily to prevent infinite loop
      observer.disconnect();
      highlightElectricWord();
      // Re-observe
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
}
