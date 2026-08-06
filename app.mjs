import { getNearbyStations } from './chargingService.js';

import { auth, googleProvider } from "./firebase.js";
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { BLOGS_DATABASE, fetchBlogBySlug, fetchDailyBlogs } from "./blogsDatabase.js";
let variantsData = {};

fetch("data/variants.json")

  .then(response => response.json())

  .then(data => {

    variantsData = data;

  });

/**
 * app.js - EV Car Wale Marketplace Core Logic
 * Handles interactive state machines, data filtering, math calculators,
 * dropdown comparisons, video players, and accordion modules.
 */

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
    diagram: '',
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
  },
  {
    id: 'guide-7',
    chapter: 'Chapter 07',
    title: 'Battery Warranty',
    summary: 'EV battery warranties typically guarantee 8 years or 1,60,000 km of durable cell coverage.',
    content: 'Most EV manufacturers in India offer separate and much longer warranties on the battery pack compared to the vehicle itself. A typical warranty covers 8 years or 1,60,000 km, ensuring the battery health (SOH) remains above 70-80% of its original capacity. Advanced battery management systems (BMS) monitor cell voltage and temperature to prevent degradation.',
    diagram: '',
    terms: [
      {
        name: 'State of Health (SOH)',
        explanation: 'The percentage of battery capacity remaining compared to when the battery was brand new.',
        why: 'Helps determine the remaining useful life of the battery pack and tracking long-term range performance.',
        example: 'Like checking the Battery Health percentage in your smartphone settings after a couple of years.'
      }
    ]
  },
  {
    id: 'guide-8',
    chapter: 'Chapter 08',
    title: 'Real World Range',
    summary: 'ARAI range is certified under lab conditions; real-world range varies by driving style and environment.',
    content: 'An electric car\'s real-world range is typically 20-30% lower than its official ARAI certification because lab testing doesn\'t account for heavy traffic, high speeds, air conditioning, or passenger load. To get the best range, drive smoothly, maintain steady highway speeds between 80-90 km/h, and use regenerative braking in the city.',
    diagram: '',
    terms: [
      {
        name: 'ARAI Certification',
        explanation: 'Standardized laboratory testing conducted by the Automotive Research Association of India to certify vehicle efficiency.',
        why: 'Provides a uniform baseline for comparing vehicles, though it rarely matches real-world driving range.',
        example: 'Like fuel efficiency ratings on petrol cars, which are always higher than what you get in city traffic.'
      }
    ]
  }
];


// Wishlist array
let wishlistIds = [];
let scrollDividers = [];
let dividerAnimFrame = null;
let isHighlighting = false;

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

// --- Premium Preloader Engine handled in index.html ---


// --- Active Filters Setup ---
let activeBrand = null;
let activeBudget = null;
let activeRecentlyViewed = false;
let activeBlogScrollListener = null;

function addToRecentlyViewed(carId) {
  try {
    let list = JSON.parse(localStorage.getItem('recently_viewed_evs') || '[]');
    list = list.filter(id => id !== carId);
    list.unshift(carId);
    if (list.length > 6) list.pop();
    localStorage.setItem('recently_viewed_evs', JSON.stringify(list));
    apiRequest('/api/recently-viewed', {
      method: 'POST',
      auth: true,
      body: { carId }
    });
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
  const bodyType = getCarCategory(car);
  const seats = car.seating || '5 Seater';
  if (car.sections.includes('upcoming')) {
    return `
      <div>EXPECTED: <span class="text-zinc-800 font-bold">${car.launchDate || 'Soon'}</span></div>
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div>SEATING: <span class="text-zinc-800">${seats}</span></div>
      <div>BODY: <span class="text-zinc-800">${bodyType}</span></div>
      <div class="col-span-2 truncate text-zinc-500" title="${car.features}">${car.features}</div>
    `;
  } else if (car.sections.includes('launches')) {
    return `
      <div>LAUNCHED: <span class="text-zinc-800 font-bold">${car.launchDate || 'Recently'}</span></div>
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div>SEATING: <span class="text-zinc-800">${seats}</span></div>
      <div>BODY: <span class="text-zinc-800">${bodyType}</span></div>
      <div class="col-span-2 truncate text-zinc-500" title="${car.features}">${car.features}</div>
    `;
  } else {
    return `
      <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
      <div>BATTERY: <span class="text-zinc-800">${car.battery}</span></div>
      <div>DC CHARGE: <span class="text-zinc-800">${car.charging}</span></div>
      <div>TOP SPEED: <span class="text-zinc-800">${car.speed}</span></div>
      <div>SEATING: <span class="text-zinc-800">${seats}</span></div>
      <div>BODY: <span class="text-zinc-800">${bodyType}</span></div>
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
        <img src="${resolveImagePath(car.image)}" alt="${car.name}" class="w-full h-full object-contain relative z-10 transition-transform duration-500" onload="this.previousElementSibling.classList.add('hidden')">
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
  const existed = index !== -1;
  
  // 1. Update visual UI state immediately
  if (existed) {
    wishlistIds.splice(index, 1);
  } else {
    wishlistIds.push(carId);
  }

  const isNowLiked = !existed;
  
  // Toggle fill-current class immediately on all matching elements
  const svgs = document.querySelectorAll(`.wishlist-btn[data-id="${carId}"] svg`);
  svgs.forEach(svg => {
    if (isNowLiked) {
      svg.classList.add('fill-current');
    } else {
      svg.classList.remove('fill-current');
    }
  });

  const detailBtn = document.getElementById('detail-wishlist-btn');
  if (detailBtn) {
    const svg = detailBtn.querySelector('svg');
    if (svg) {
      if (isNowLiked) {
        svg.classList.add('fill-current');
      } else {
        svg.classList.remove('fill-current');
      }
    }
  }

  // 2. Save in background
  try {
    saveWishlist();
    apiRequest(isNowLiked ? '/api/favourites' : `/api/favourites/${encodeURIComponent(carId)}`, {
      method: isNowLiked ? 'POST' : 'DELETE',
      auth: true,
      body: isNowLiked ? { carId } : undefined
    });
    // Sync background lists & page caches
    renderAllCarousels();
    
    const hash = window.location.hash;
    if (hash === '#/favourites' || hash.startsWith('#/favourites')) {
      renderFavouritesPage();
    } else if (hash === '#/account/shortlisted') {
      renderDashboardPage('shortlisted');
    }
  } catch (error) {
    // 3. Revert if save fails
    console.error("Failed to save favourites:", error);
    
    // Revert wishlist state array
    if (existed) {
      wishlistIds.push(carId);
    } else {
      const revIndex = wishlistIds.indexOf(carId);
      if (revIndex !== -1) wishlistIds.splice(revIndex, 1);
    }
    
    // Revert visual state
    svgs.forEach(svg => {
      if (existed) {
        svg.classList.add('fill-current');
      } else {
        svg.classList.remove('fill-current');
      }
    });

    if (detailBtn) {
      const svg = detailBtn.querySelector('svg');
      if (svg) {
        if (existed) {
          svg.classList.add('fill-current');
        } else {
          svg.classList.remove('fill-current');
        }
      }
    }
    
    alert("An error occurred while saving your favourites. Please try again.");
  }
}

const filterResetBtn = document.getElementById('filter-reset-btn');
if (filterResetBtn) {
  filterResetBtn.addEventListener('click', () => {
    activeBrand = null;
    activeBudget = null;
    activeRecentlyViewed = false;
    
    brandChips.forEach(c => c.classList.remove('selected'));
    budgetChips.forEach(c => c.classList.remove('selected'));
    
    const nameInput = document.getElementById('search-car-name');
    const brandInput = document.getElementById('search-car-brand');
    const budgetInput = document.getElementById('search-car-budget');
    if (nameInput) nameInput.value = '';
    if (brandInput) brandInput.value = 'all';
    if (budgetInput) budgetInput.value = 'all';
    
    renderAllCarousels();
  });
}

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
const searchSubmitBtn = document.getElementById('search-submit-btn');
if (searchSubmitBtn) {
  searchSubmitBtn.addEventListener('click', () => {
    renderAllCarousels();
    const popEvs = document.getElementById('popular-evs');
    if (popEvs) popEvs.scrollIntoView({ behavior: 'smooth' });
  });
}

// Initial carousels load
renderAllCarousels();

function scrollCarousel(viewport, direction) {
  if (!viewport) return;
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
const popPrev = document.getElementById('pop-car-prev');
const popNext = document.getElementById('pop-car-next');
if (popPrev) popPrev.addEventListener('click', () => scrollCarousel(carCarouselViewport, 'prev'));
if (popNext) popNext.addEventListener('click', () => scrollCarousel(carCarouselViewport, 'next'));

const upCarouselViewport = document.getElementById('up-carousel-viewport');
const upPrev = document.getElementById('up-car-prev');
const upNext = document.getElementById('up-car-next');
if (upPrev) upPrev.addEventListener('click', () => scrollCarousel(upCarouselViewport, 'prev'));
if (upNext) upNext.addEventListener('click', () => scrollCarousel(upCarouselViewport, 'next'));

const launchCarouselViewport = document.getElementById('launch-carousel-viewport');
const launchPrev = document.getElementById('launch-car-prev');
const launchNext = document.getElementById('launch-car-next');
if (launchPrev) launchPrev.addEventListener('click', () => scrollCarousel(launchCarouselViewport, 'prev'));
if (launchNext) launchNext.addEventListener('click', () => scrollCarousel(launchCarouselViewport, 'next'));



// --- Section: Compare Cars Engine ---
const compSelectA = document.getElementById('comp-select-a');
const compSelectB = document.getElementById('comp-select-b');
const compHdrA = document.getElementById('comp-hdr-a');
const compHdrB = document.getElementById('comp-hdr-b');
const compTableBody = document.getElementById('comp-table-body');

function populateCompareDropdowns() {
  if (!compSelectA || !compSelectB) return;
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
  if (!compSelectA || !compSelectB || !compHdrA || !compHdrB || !compTableBody) return;
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

if (compSelectA && compSelectB) {
  console.log("EV_DATABASE:", EV_DATABASE);
 console.log("Cars count:", EV_DATABASE.length);
  populateCompareDropdowns();
  updateCompareTable();
  compSelectA.addEventListener('change', updateCompareTable);
  compSelectB.addEventListener('change', updateCompareTable);
}

const compStateSelect = document.getElementById('comp-state-select');
if (compStateSelect) compStateSelect.addEventListener('change', updateCompareTable);


// --- Section: Charging Stations Finder ---
const stationSearchInput = document.getElementById('station-search-input');
const filterChargerFast = document.getElementById('filter-charger-fast');
const filterChargerNormal = document.getElementById('filter-charger-normal');
const stationsListContainer = document.getElementById('stations-list-container');

function renderChargingStations() {
  if (!stationSearchInput || !filterChargerFast || !filterChargerNormal || !stationsListContainer) return;
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
if (stationSearchInput && filterChargerFast && filterChargerNormal && stationsListContainer) {
  renderChargingStations();
  stationSearchInput.addEventListener('input', renderChargingStations);
  filterChargerFast.addEventListener('change', renderChargingStations);
  filterChargerNormal.addEventListener('change', renderChargingStations);
}


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
  if (!sliderPrice || !sliderDown || !sliderRate || !sliderTenure || !lblPriceVal || !lblDownVal || !lblDownMin || !lblDownMax || !lblRateVal || !lblTenureVal || !resLoanAmt || !emiCalcResult) return;
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
  const selectedCarId = document.getElementById('td-car').value;
  const selectedCar = EV_DATABASE.find(car => car.id === selectedCarId);
  apiRequest('/api/test-drives', {
    method: 'POST',
    body: {
      carId: selectedCarId,
      carName: selectedCar ? selectedCar.name : '',
      name: document.getElementById('td-name').value,
      phone: document.getElementById('td-phone').value,
      preferredDate: document.getElementById('td-date').value
    }
  });
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
      const response = await fetch(resolveImagePath(testUrl), { method: 'HEAD' });
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
const legacyNewsletterForm = document.getElementById('newsletter-form');
if (legacyNewsletterForm) {
  legacyNewsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    if (emailInput) {
      apiRequest('/api/newsletter', {
        method: 'POST',
        body: { email: emailInput.value, source: 'legacy-newsletter' }
      });
    }
    alert('NEWSLETTER REGISTRATION SECURE. THANKS FOR SUBSCRIBING.');
    e.target.reset();
  });
}


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

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (activePanel && activePanel.id === panelId && activePanel.classList.contains('mega-panel-visible')) {
      closeMegaPanels();
    } else {
      openMegaPanel(panelId);
    }
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

document.addEventListener('click', (e) => {
  if (!activePanel) return;
  const clickedInsideNav = e.target.closest('#mega-nav');
  if (!clickedInsideNav) {
    closeMegaPanels();
  }
});

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

function isMainHomepageVisible() {
  return Boolean(homepageContent && !homepageContent.classList.contains('hidden') && homepageContent.style.display !== 'none');
}

function closeSharedNavigation() {
  closeMegaPanels();
  closeMobileDrawer();
}

function scrollToHomepageSection(targetId, sectionId) {
  const targetEl = document.querySelector(targetId);
  if (!targetEl) return;

  isScrollingFromNav = true;
  targetEl.scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => { isScrollingFromNav = false; }, 850);
  updateActiveNavTrigger(sectionId);
}

function handleSharedNavLinkClick(link, e) {
  const href = link.getAttribute('href');
  const text = link.textContent.trim();

  // Check if Recently Viewed clicked
  if (text.includes('Recently Viewed') || link.id === 'nav-btn-recently-viewed') {
    e.preventDefault();
    closeSharedNavigation();
    navigateTo('/recently-viewed');
    return true;
  }

  if (href && href.startsWith('#/')) {
    e.preventDefault();
    closeSharedNavigation();
    navigateTo(href.substring(1));
    return true;
  }

  if (!href || !href.startsWith('#')) return false;

  e.preventDefault();
  closeSharedNavigation();

  // Clear recently viewed filter for other normal navigation links
  activeRecentlyViewed = false;
  renderAllCarousels();

  const targetId = href;
  const sectionId = targetId.substring(1);
  if (!isMainHomepageVisible()) {
    navigateTo('/');
    setTimeout(() => scrollToHomepageSection(targetId, sectionId), 120);
  } else {
    scrollToHomepageSection(targetId, sectionId);
  }

  return true;
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('.mega-item, .mobile-sub-link, .mega-nav-item, .mobile-nav-link');
  if (!link) return;
  if (handleSharedNavLinkClick(link, e)) {
    e.stopImmediatePropagation();
  }
}, true);

// Intercept all links in mega panels or drawer
document.querySelectorAll('.mega-item, .mobile-sub-link, .mega-nav-item, .mobile-nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    handleSharedNavLinkClick(link, e);
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
      entry.target.classList.add('reveal-active');
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
const loginPageContent = document.getElementById('login-page-content');
const dashboardPageContent = document.getElementById('dashboard-page-content');
let userSession = null;
let lastActiveRoute = '#/';
try {
  const savedSession = localStorage.getItem('ev_user_session');
  if (savedSession) {
    userSession = JSON.parse(savedSession);
  }
} catch (e) {
  console.error('Failed to load user session', e);
}
if (typeof loadWishlist === 'function') loadWishlist();

function resolveImagePath(path) {
  if (!path) return '';
  if (path.startsWith('./')) {
    path = path.substring(2);
  }
  if (path.startsWith('/') || path.startsWith('http')) return path;
  const loc = window.location;
  if (loc.protocol === 'file:') {
    let basePath = loc.pathname;
    const idx = basePath.indexOf('index.html');
    if (idx !== -1) {
      basePath = basePath.substring(0, idx);
    } else {
      const lastSlash = basePath.lastIndexOf('/');
      basePath = basePath.substring(0, lastSlash + 1);
    }
    return basePath + path;
  } else {
    return '/' + path;
  }
}

async function getFirebaseAuthToken() {
  try {
    if (!auth || !auth.currentUser || typeof auth.currentUser.getIdToken !== 'function') {
      return '';
    }
    return await auth.currentUser.getIdToken();
  } catch (error) {
    console.warn('Unable to read Firebase token for API request:', error);
    return '';
  }
}

async function apiRequest(endpoint, options = {}) {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };

    if (options.auth) {
      const token = await getFirebaseAuthToken();
      if (!token) return null;
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
      method: options.method || 'GET',
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;
    if (!response.ok) {
      console.warn('API request failed:', endpoint, data);
      return null;
    }
    return data;
  } catch (error) {
    console.warn('API request unavailable:', endpoint, error);
    return null;
  }
}

function syncAuthenticatedUser(profile = {}) {
  apiRequest('/api/auth/firebase/sync', {
    method: 'POST',
    auth: true,
    body: profile
  });
}

function initLanguageSelector() {
  const langBtn = document.getElementById('lang-selector-btn');
  const langDropdown = document.getElementById('lang-dropdown');
  const selectedLabel = document.getElementById('selected-lang-label');
  const optionBtns = document.querySelectorAll('.lang-option-btn');

  if (!langBtn || !langDropdown || !selectedLabel) return;

  // Load selected language from localStorage
  const savedLang = localStorage.getItem('ev_selected_language') || 'English';
  selectedLabel.textContent = savedLang;

  // Toggle dropdown on button click
  langBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = langDropdown.classList.contains('opacity-100');
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  function openDropdown() {
    langDropdown.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
    langDropdown.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
  }

  function closeDropdown() {
    langDropdown.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    langDropdown.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
  }

  // Handle language option click
  optionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedLang = btn.getAttribute('data-lang');
      selectedLabel.textContent = selectedLang;
      localStorage.setItem('ev_selected_language', selectedLang);
      
      // Dispatch custom language selection event for future API integration
      const langEvent = new CustomEvent('evLanguageSelected', {
        detail: { language: selectedLang }
      });
      window.dispatchEvent(langEvent);

      closeDropdown();
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!langBtn.contains(e.target) && !langDropdown.contains(e.target)) {
      closeDropdown();
    }
  });
}

function initAIChat() {
  const chatBtn = document.getElementById('ai-chat-btn');
  const chatPanel = document.getElementById('ai-chat-panel');
  const chatClose = document.getElementById('ai-chat-close');
  const chatForm = document.getElementById('ai-chat-form');
  const chatInput = document.getElementById('ai-chat-input');
  const chatMessages = document.getElementById('ai-chat-messages');
  const sendBtn = document.getElementById('ai-chat-send-btn');

  if (!chatBtn || !chatPanel || !chatClose || !chatForm || !chatInput || !chatMessages) return;

  let conversationHistory = [];

  function updateSendButtonState() {
    if (sendBtn) {
      sendBtn.disabled = (chatInput.value.trim() === '');
    }
  }

  chatInput.addEventListener('input', updateSendButtonState);
  updateSendButtonState();

  // Toggle chat panel on button click
  chatBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = chatPanel.classList.contains('opacity-100');
    if (isOpen) {
      closeChat();
    } else {
      openChat();
    }
  });

  chatClose.addEventListener('click', (e) => {
    e.stopPropagation();
    closeChat();
  });

  function openChat() {
    chatPanel.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
    chatPanel.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
    chatInput.focus();
  }

  function closeChat() {
    chatPanel.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
    chatPanel.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
  }

  // Handle outside clicks to close panel
  document.addEventListener('click', (e) => {
    if (!chatBtn.contains(e.target) && !chatPanel.contains(e.target)) {
      closeChat();
    }
  });

  // Handle form submit
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = chatInput.value.trim();
    if (!message) return;

    chatInput.value = '';
    updateSendButtonState();
    appendMessage('user', message);
    conversationHistory.push({ role: 'user', content: message });
    
    // Add typing indicator
    const typingIndicator = showTypingIndicator();
    scrollToBottom();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: conversationHistory })
      });

      if (!response.ok) {
        throw new Error('Server responded with an error status: ' + response.status);
      }

      const data = await response.json();
      removeTypingIndicator(typingIndicator);

      if (data.reply) {
        appendMessage('assistant', data.reply);
        conversationHistory.push({ role: 'assistant', content: data.reply });
      } else if (data.error) {
        appendMessage('error', data.error);
      } else {
        appendMessage('error', 'Received invalid response from server.');
      }
    } catch (err) {
      console.error('AI Assistant Error:', err);
      removeTypingIndicator(typingIndicator);
      appendMessage('error', 'Connection lost or API server is offline. Please try again.');
    }
    scrollToBottom();
  });

  function appendMessage(role, text) {
    const bubbleWrapper = document.createElement('div');
    bubbleWrapper.className = 'flex gap-2 max-w-[85%]';
    
    if (role === 'user') {
      bubbleWrapper.className += ' self-end flex-row-reverse';
    } else {
      bubbleWrapper.className += ' self-start';
    }

    // Avatar
    const avatar = document.createElement('div');
    if (role === 'user') {
      avatar.className = 'w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-bold select-none';
      avatar.textContent = 'ME';
    } else {
      avatar.className = 'w-6 h-6 rounded-full overflow-hidden border border-zinc-200 bg-white flex items-center justify-center flex-shrink-0 select-none';
      const img = document.createElement('img');
      img.src = '/ai_robot_avatar.jpg';
      img.alt = 'AI';
      img.className = 'w-full h-full object-cover';
      avatar.appendChild(img);
    }

    // Bubble content
    const bubble = document.createElement('div');
    if (role === 'user') {
      bubble.className = 'bg-black text-white rounded-2xl rounded-tr-none p-3 shadow-[0_2px_8px_rgba(0,0,0,0.05)] text-left leading-relaxed';
    } else if (role === 'error') {
      bubble.className = 'bg-red-50 border border-red-200 text-red-700 rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-left leading-relaxed font-semibold';
      avatar.className = 'w-6 h-6 rounded-full bg-red-650 text-white flex items-center justify-center flex-shrink-0 font-mono text-[9px] font-bold select-none';
      avatar.textContent = '⚠️';
    } else {
      bubble.className = 'bg-white border border-zinc-150 rounded-2xl rounded-tl-none p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-zinc-800 text-left leading-relaxed';
    }

    // Format bold markdown-like text securely
    bubble.innerHTML = formatTextSecurely(text);

    bubbleWrapper.appendChild(avatar);
    bubbleWrapper.appendChild(bubble);
    chatMessages.appendChild(bubbleWrapper);
    console.log("Children:", chatMessages.children.length);
   console.log(chatMessages.innerHTML);
    console.log(chatMessages.children.length);
  }

  function formatTextSecurely(text) {
    // Escape HTML first to prevent XSS
    const div = document.createElement('div');
    div.textContent = text;
    let escaped = div.innerHTML;

    // Support bold: **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Support bullet points: starting with "- " or "* " on newlines
    escaped = escaped.replace(/(?:^|\n)[-*]\s+(.*?)(?=\n|$)/g, '<br>• $1');

    // Clean up double <br> or initial <br> from replacements
    if (escaped.startsWith('<br>')) {
      escaped = escaped.substring(4);
    }
    
    return escaped.replace(/\n/g, '<br>');
  }

  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'ai-typing-indicator';
    indicator.className = 'flex gap-2 max-w-[85%] self-start items-center';
    indicator.innerHTML = `
      <div class="w-6 h-6 rounded-full overflow-hidden border border-zinc-200 bg-white flex items-center justify-center flex-shrink-0 select-none">
        <img src="/ai_robot_avatar.jpg" alt="AI" class="w-full h-full object-cover">
      </div>
      <div class="bg-white border border-zinc-150 rounded-2xl rounded-tl-none px-3.5 py-2.5 shadow-[0_2px_8px_rgba(0,0,0,0.02)] text-zinc-500 flex gap-1 items-center">
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
        <span class="ai-typing-dot"></span>
      </div>
    `;
    chatMessages.appendChild(indicator);
    return indicator;
  }

  function removeTypingIndicator(indicator) {
    if (indicator && indicator.parentNode) {
      indicator.parentNode.removeChild(indicator);
    }
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Periodic random animations for the 3D AI Robot avatar (every 12 seconds)
  let idleAnimTimer = null;
  function startIdleAnimations() {
    if (idleAnimTimer) clearInterval(idleAnimTimer);
    
    idleAnimTimer = setInterval(() => {
      const wrapper = document.getElementById('ai-robot-avatar-wrapper');
      if (!wrapper) return;
      
      const anims = ['robot-head-tilt', 'robot-bounce', 'robot-look'];
      const randomAnim = anims[Math.floor(Math.random() * anims.length)];
      
      // Temporarily transition to special animation
      wrapper.classList.remove('robot-idle');
      wrapper.classList.add(randomAnim);
      
      // Restore idle class after animation completes (2 seconds duration is enough)
      setTimeout(() => {
        wrapper.classList.remove(randomAnim);
        wrapper.classList.add('robot-idle');
      }, 2000);
    }, 12000);
  }
  startIdleAnimations();
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

function toggleMainLayout(view) {
  const megaNav = document.getElementById('mega-nav');
  const footer = document.querySelector('footer');
  
  // Hide all wrappers by default
  [homepageContent, detailsPageContent, loginPageContent, dashboardPageContent].forEach(wrapper => {
    if (!wrapper) return;
    wrapper.style.display = '';
    wrapper.classList.add('hidden');
  });
  
  if (view === 'home' || view === true) {
    if (megaNav) megaNav.style.display = '';
    if (footer) footer.style.display = '';
    if (homepageContent) homepageContent.classList.remove('hidden');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  } else if (view === 'details') {
    if (megaNav) megaNav.style.display = '';
    if (footer) footer.style.display = '';
    if (detailsPageContent) detailsPageContent.classList.remove('hidden');
  } else if (view === 'login' || view === false) {
    if (megaNav) megaNav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (loginPageContent) loginPageContent.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
  } else if (view === 'dashboard') {
    if (megaNav) megaNav.style.display = '';
    if (footer) footer.style.display = '';
    if (dashboardPageContent) dashboardPageContent.classList.remove('hidden');
  }
}

function renderSubpage(title, breadcrumbs, contentHtml, backPath = '/') {
  toggleMainLayout('details');
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
    const backBtn = document.getElementById('btn-subpage-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        navigateTo(backPath);
      });
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
  applyJargonBuster();
}

function handleRouting() {
  if (typeof updateLoginButtonState === 'function') updateLoginButtonState();
  closeSharedNavigation();
  
  const hash = window.location.hash;
  if (hash && hash !== '#/login' && hash !== '#login') {
    lastActiveRoute = hash;
  }
  
  const blogsPage = document.getElementById('blogs-page-content');
  if (blogsPage) {
    blogsPage.style.display = 'none';
  }
  if (activeBlogScrollListener) {
    window.removeEventListener('scroll', activeBlogScrollListener);
    activeBlogScrollListener = null;
  }
  
  const path = window.location.pathname;
  
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
  } else if (path.startsWith('/hub/')) {
    route = path;
  } else if (hash.startsWith('#/hub/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/reviews/')) {
    route = path;
  } else if (hash.startsWith('#/reviews/')) {
    route = hash.substring(1);
  } else if (path === '/brands') {
    route = path;
  } else if (hash === '#/brands') {
    route = hash.substring(1);
  } else if (path.startsWith('/brand/')) {
    route = path;
  } else if (hash.startsWith('#/brand/')) {
    route = hash.substring(1);
  } else if (path === '/login') {
    route = path;
  } else if (hash === '#/login') {
    route = hash.substring(1);
  } else if (path === '/dashboard' || path === '/account') {
    route = path;
  } else if (hash === '#/dashboard' || hash === '#/account') {
    route = hash.substring(1);
  } else if (path.startsWith('/account/')) {
    route = path;
  } else if (hash.startsWith('#/account/')) {
    route = hash.substring(1);
  } else if (path === '/favourites') {
    route = path;
  } else if (hash === '#/favourites') {
    route = hash.substring(1);
  } else if (path === '/about-us') {
    route = path;
  } else if (hash === '#/about-us') {
    route = hash.substring(1);
  } else if (path === '/careers') {
    route = path;
  } else if (hash === '#/careers') {
    route = hash.substring(1);
  } else if (path === '/terms-conditions') {
    route = path;
  } else if (hash === '#/terms-conditions') {
    route = hash.substring(1);
  } else if (path === '/privacy-policy') {
    route = path;
  } else if (hash === '#/privacy-policy') {
    route = hash.substring(1);
  } else if (path === '/corporate-policies') {
    route = path;
  } else if (hash === '#/corporate-policies') {
    route = hash.substring(1);
  } else if (path === '/investors') {
    route = path;
  } else if (hash === '#/investors') {
    route = hash.substring(1);
  } else if (path === '/faqs') {
    route = path;
  } else if (hash === '#/faqs') {
    route = hash.substring(1);
  } else if (path === '/contact-us') {
    route = path;
  } else if (hash === '#/contact-us') {
    route = hash.substring(1);
  } else if (path === '/feedback') {
    route = path;
  } else if (hash === '#/feedback') {
    route = hash.substring(1);
  } else if (path === '/advertise-with-us') {
    route = path;
  } else if (hash === '#/advertise-with-us') {
    route = hash.substring(1);
  } else if (path === '/recently-viewed') {
    route = path;
  } else if (hash === '#/recently-viewed') {
    route = hash.substring(1);
  } else if (path === '/blogs/daily') {
    route = path;
  } else if (hash === '#/blogs/daily') {
    route = hash.substring(1);
  } else if (path.startsWith('/blogs/')) {
    route = path;
  } else if (hash.startsWith('#/blogs/')) {
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
    if (['all', 'popular', 'launches', 'upcoming'].includes(section)) {
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
    let chapter = GUIDE_DATABASE.find(g => g.id === id);
    if (!chapter) {
      const baseId = id.startsWith('guide-') ? id.substring(6) : id;
      const exp = guideExplanations[baseId];
      if (exp) {
        chapter = {
          id: id.startsWith('guide-') ? id : 'guide-' + id,
          chapter: 'Charging Guide',
          title: exp.title,
          summary: exp.explanation.substring(0, 100) + '...',
          content: exp.explanation,
          diagram: '',
          terms: []
        };
      }
    }
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
  } else if (route === '/brands') {
    renderBrandsPage();
    return;
  } else if (route.startsWith('/brand/')) {
    const brandId = route.substring(7);
    renderBrandPage(brandId);
    return;
  } else if (route === '/login') {
    if (userSession) {
      navigateTo('/');
    } else {
      renderLoginPage();
    }
    return;
  } else if (route === '/dashboard' || route === '/account') {
    navigateTo('/account/orders');
    return;
  } else if (route.startsWith('/account/')) {
    if (!userSession) {
      navigateTo('/login');
    } else {
      const tabId = route.substring(9);
      renderDashboardPage(tabId);
    }
    return;
  } else if (route === '/favourites') {
    navigateTo('/account/shortlisted');
    return;
  } else if (route === '/about-us') {
    renderAboutUsPage();
    return;
  } else if (route === '/careers') {
    renderCareersPage();
    return;
  } else if (route === '/terms-conditions') {
    renderTermsConditionsPage();
    return;
  } else if (route === '/privacy-policy') {
    renderPrivacyPolicyPage();
    return;
  } else if (route === '/corporate-policies') {
    renderCorporatePoliciesPage();
    return;
  } else if (route === '/investors') {
    renderInvestorsPage();
    return;
  } else if (route === '/blogs/daily') {
    renderDailyBlogsPage();
    return;
  } else if (route.startsWith('/blogs/')) {
    const parts = route.substring(7).split('/');
    if (parts.length >= 2) {
      renderBlogArticlePage(parts[0], parts[1]);
      return;
    }
  } else if (route === '/faqs') {
    renderFAQsPage();
    return;
  } else if (route === '/contact-us') {
    renderContactUsPage();
    return;
  } else if (route === '/feedback') {
    renderFeedbackPage();
    return;
  } else if (route === '/advertise-with-us') {
    renderAdvertisePage();
    return;
  } else if (route === '/recently-viewed') {
    renderRecentlyViewedPage();
    return;
  }
  
  restoreHomepage();
}

function restoreHomepage() {
  toggleMainLayout('home');
  if (typeof initScrollDividers === 'function') initScrollDividers();
  
  // Clear hash if we are on the main landing page and it contains car details route
  const hash = window.location.hash;
  if (hash.includes('/cars/') || hash.includes('/view-all/') || hash.includes('/news/') || hash.includes('/guide/') || hash.includes('/reviews/') || hash.includes('/brand/') || hash.includes('/brands') || hash.includes('/hub/') || hash.includes('/login') || hash.includes('/dashboard') || hash.includes('/account') || hash.includes('/blogs/') || hash.includes('/recently-viewed')) {
    try {
      history.pushState(null, '', '/');
    } catch (e) {
      window.location.hash = '#/';
    }
  }
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
}

function renderLoginPage() {
  toggleMainLayout('login');
  
  if (loginPageContent) {
    loginPageContent.innerHTML = `
      <div class="h-screen w-full flex overflow-hidden font-sans bg-zinc-50">
        <!-- Left Side: EV Showcase (Desktop only) -->
        <div class="hidden lg:flex lg:w-1/2 bg-white relative items-center justify-center p-8 border-r border-zinc-200">
          <div class="w-full h-full flex items-center justify-center">
            <img src="login_illustration.png" alt="EV Showcase Illustration" class="max-w-full max-h-[90vh] object-contain">
          </div>
        </div>

        <!-- Right Side: Login / Register Form -->
        <div class="w-full lg:w-1/2 flex flex-col justify-between p-4 md:p-6 bg-white relative">
          <!-- Top Bar: Logo & Close -->
          <div class="flex items-center justify-between w-full">
            <a href="#/" class="logo-link font-bold tracking-widest text-sm flex items-center gap-2 group text-black">
              <span class="logo-icon w-2.5 h-2.5 bg-black inline-block rounded-none"></span>
              <span>EV <span class="text-[#22C55E]">CAR WALE</span></span>
            </a>
            <button id="btn-close-login" class="p-2 border border-zinc-200 hover:border-black text-zinc-500 hover:text-black transition-all rounded-full" aria-label="Close">
              <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          <!-- Center Card: Form -->
          <div id="auth-main-card" class="w-full max-w-md mx-auto my-0 py-4 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
              <h1 id="auth-title" class="text-2xl md:text-3xl font-black text-black tracking-tight uppercase">LOGIN OR SIGN UP</h1>
              <p id="auth-subtitle" class="text-xs text-zinc-500 font-mono">Sign in to EV CAR WALE using your email or Google account.</p>
            </div>

            <form class="flex flex-col gap-4 text-left" id="login-form" novalidate>
              
              <!-- Full Name Field (Sign Up only) -->
              <div id="name-input-group" class="hidden flex flex-col gap-1.5">
                <label for="login-name" class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Full Name</label>
                <div class="flex border border-zinc-250 rounded-lg overflow-hidden focus-within:border-black transition-all">
                  <input type="text" id="login-name" placeholder="Enter your full name" class="w-full px-4 py-3 text-xs outline-none font-mono text-black placeholder-zinc-300">
                </div>
                <span id="name-validation-msg" class="text-[9px] text-red-500 font-mono hidden mt-1"></span>
              </div>

              <!-- Email Address Field -->
              <div class="flex flex-col gap-1.5">
                <label for="login-email" class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Email Address</label>
                <div class="flex border border-zinc-250 rounded-lg overflow-hidden focus-within:border-black transition-all">
                  <input type="email" id="login-email" placeholder="email@example.com" required class="w-full px-4 py-3 text-xs outline-none font-mono text-black placeholder-zinc-300">
                </div>
                <span id="email-validation-msg" class="text-[9px] text-red-500 font-mono hidden mt-1"></span>
              </div>

              <!-- Password Field -->
              <div class="flex flex-col gap-1.5">
                <label for="login-password" class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Password</label>
                <div class="flex border border-zinc-250 rounded-lg overflow-hidden focus-within:border-black transition-all">
                  <input type="password" id="login-password" placeholder="••••••••" required class="w-full px-4 py-3 text-xs outline-none font-mono text-black placeholder-zinc-300">
                </div>
                <span id="password-validation-msg" class="text-[9px] text-red-500 font-mono hidden mt-1"></span>
              </div>

              <!-- Action buttons -->
              <div class="flex flex-col gap-2.5 mt-2">
                <button type="submit" id="btn-login-submit" class="w-full bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                  <span id="btn-submit-text">LOGIN</span>
                  <svg id="login-spinner" class="hidden animate-spin h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
                <button type="button" id="btn-signup-toggle" class="w-full bg-zinc-100 hover:bg-zinc-200 text-black font-mono text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all duration-300">
                  CREATE ACCOUNT
                </button>
              </div>
            </form>

            <div class="text-right">
              <a href="#" id="forgot-password-link" class="text-[10px] text-zinc-400 hover:text-black font-mono transition-colors">Forgot Password?</a>
            </div>

            <!-- Divider -->
            <div class="flex items-center gap-4 my-2">
              <div class="h-[1px] bg-zinc-200 flex-1"></div>
              <span class="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest">OR</span>
              <div class="h-[1px] bg-zinc-200 flex-1"></div>
            </div>

            <!-- Google login -->
            <button
              id="google-login-btn"
              type="button"
              class="w-full flex items-center justify-center ..."
           >
              <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>
          </div>

          <!-- Reset Card (UI Only) -->
          <div id="auth-reset-card" class="w-full max-w-md mx-auto my-auto py-8 flex flex-col gap-8 hidden">
            <div class="flex flex-col gap-2">
              <h1 class="text-2xl md:text-3xl font-black text-black tracking-tight uppercase">RESET PASSWORD</h1>
              <p class="text-xs text-zinc-500 font-mono">Enter your email below to receive a password reset message.</p>
            </div>
            
            <form class="flex flex-col gap-4 text-left" id="reset-password-form" novalidate>
              <div class="flex flex-col gap-1.5">
                <label for="reset-email" class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Email Address</label>
                <div class="flex border border-zinc-250 rounded-lg overflow-hidden focus-within:border-black transition-all">
                  <input type="email" id="reset-email" placeholder="email@example.com" required class="w-full px-4 py-3 text-xs outline-none font-mono text-black placeholder-zinc-300">
                </div>
                <span id="reset-validation-msg" class="text-[9px] text-red-500 font-mono hidden mt-1"></span>
              </div>
              
              <div id="reset-success-msg" class="text-green-500 font-bold hidden text-xs font-mono">A password reset email has been sent. Please check your inbox.</div>
              
              <button type="submit" class="w-full bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[10px] font-bold tracking-widest uppercase py-3.5 rounded-lg transition-all duration-300 shadow-md">
                SEND RESET EMAIL
              </button>
            </form>
            
            <div class="text-center">
              <a href="#" id="reset-back-link" class="text-[10px] text-zinc-400 hover:text-black font-mono transition-colors">Back to Login</a>
            </div>
          </div>

          <!-- Bottom: Terms & Privacy -->
          <div class="text-[10px] text-zinc-400 text-center font-mono leading-relaxed mt-4 max-w-sm mx-auto">
            By continuing, you agree to EV CAR WALE’s 
            <a href="#/terms-conditions" class="text-zinc-650 underline hover:text-black">Terms of Service</a> 
            and 
            <a href="#/privacy-policy" class="text-zinc-650 underline hover:text-black">Privacy Policy</a>.
          </div>
        </div>
      </div>
    `;

    // Toggle Sign Up Mode
    let isSignUp = false;
    const nameGroup = loginPageContent.querySelector('#name-input-group');
    const authTitle = loginPageContent.querySelector('#auth-title');
    const authSubtitle = loginPageContent.querySelector('#auth-subtitle');
    const submitBtn = loginPageContent.querySelector('#btn-login-submit');
    const submitBtnText = loginPageContent.querySelector('#btn-submit-text');
    const signupToggle = loginPageContent.querySelector('#btn-signup-toggle');
    const nameInput = loginPageContent.querySelector('#login-name');
    const emailInput = loginPageContent.querySelector('#login-email');
    const passwordInput = loginPageContent.querySelector('#login-password');
    
    const nameError = loginPageContent.querySelector('#name-validation-msg');
    const emailError = loginPageContent.querySelector('#email-validation-msg');
    const passwordError = loginPageContent.querySelector('#password-validation-msg');
    const spinner = loginPageContent.querySelector('#login-spinner');
    
    if (signupToggle) {
      signupToggle.addEventListener('click', () => {
        isSignUp = !isSignUp;
        
        // Reset validation errors
        nameError.classList.add('hidden');
        emailError.classList.add('hidden');
        passwordError.classList.add('hidden');
        
        if (isSignUp) {
          nameGroup.classList.remove('hidden');
          nameInput.setAttribute('required', 'true');
          authTitle.textContent = 'CREATE ACCOUNT';
          authSubtitle.textContent = 'Sign up to start saving and comparing your favourite EVs.';
          submitBtnText.textContent = 'REGISTER & LOGIN';
          signupToggle.textContent = 'BACK TO LOGIN';
        } else {
          nameGroup.classList.add('hidden');
          nameInput.removeAttribute('required');
          authTitle.textContent = 'LOGIN OR SIGN UP';
          authSubtitle.textContent = 'Sign in to EV CAR WALE using your email or Google account.';
          submitBtnText.textContent = 'LOGIN';
          signupToggle.textContent = 'CREATE ACCOUNT';
        }
      });
    }

    // Toggle Forgot Password view
    const mainCard = loginPageContent.querySelector('#auth-main-card');
    const resetCard = loginPageContent.querySelector('#auth-reset-card');
    const forgotLink = loginPageContent.querySelector('#forgot-password-link');
    const resetBackLink = loginPageContent.querySelector('#reset-back-link');
    
    if (forgotLink) {
      forgotLink.addEventListener('click', (e) => {
        e.preventDefault();
        mainCard.classList.add('hidden');
        resetCard.classList.remove('hidden');
      });
    }
    
    if (resetBackLink) {
      resetBackLink.addEventListener('click', (e) => {
        e.preventDefault();
        resetCard.classList.add('hidden');
        mainCard.classList.remove('hidden');
      });
    }

    // Bind password reset form submit
    const resetForm = loginPageContent.querySelector('#reset-password-form');
    if (resetForm) {
      resetForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const resetEmailInput = resetForm.querySelector('#reset-email');
        const resetError = resetForm.querySelector('#reset-validation-msg');
        const resetSuccess = resetForm.querySelector('#reset-success-msg');
        
        resetError.classList.add('hidden');
        resetSuccess.classList.add('hidden');
        
        const emailVal = resetEmailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(emailVal)) {
          resetError.textContent = 'Please enter a valid email address.';
          resetError.classList.remove('hidden');
        } else {
          resetSuccess.classList.remove('hidden');
          resetEmailInput.value = '';
        }
      });
    }

    // Bind logo link click
    const pageLogo = loginPageContent.querySelector('.logo-link');
    if (pageLogo) {
      pageLogo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/');
      });
    }

    // Bind form submit for Email-based authentication
    const googleBtn = loginPageContent.querySelector('#google-login-btn');

    if (googleBtn) {
    googleBtn.addEventListener('click', () => {
        window.location.href = 'http://localhost:8081/auth/google';
    });
   }
    const form = loginPageContent.querySelector('#login-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Reset errors
      nameError.classList.add('hidden');
      emailError.classList.add('hidden');
      passwordError.classList.add('hidden');
      
      let isValid = true;
      
      // 1. Validation Name
      if (isSignUp) {
        const nameVal = nameInput.value.trim();
        if (!nameVal) {
          nameError.textContent = 'Name cannot be empty during sign up.';
          nameError.classList.remove('hidden');
          isValid = false;
        }
      }
      
      // 2. Validation Email
      const emailVal = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailVal)) {
        emailError.textContent = 'Email must be in a valid format.';
        emailError.classList.remove('hidden');
        isValid = false;
      }
      
      // 3. Validation Password
      const passwordVal = passwordInput.value;
      if (passwordVal.length < 8) {
        passwordError.textContent = 'Password must contain at least 8 characters.';
        passwordError.classList.remove('hidden');
        isValid = false;
      }
      
      if (!isValid) return;
      
      // Show loading animation
      spinner.classList.remove('hidden');
      submitBtn.setAttribute('disabled', 'true');
      signupToggle.setAttribute('disabled', 'true');
      
      setTimeout(() => {
        userSession = {
          name: nameInput.value.trim(),
          phone: phoneInput.value.trim(),
          email: emailVal,
          avatar: ""
        };
        localStorage.setItem('ev_user_session', JSON.stringify(userSession));
        syncAuthenticatedUser(userSession);
        
        // Hide loading
        spinner.classList.add('hidden');
        submitBtn.removeAttribute('disabled');
        signupToggle.removeAttribute('disabled');
        
        handlePostLogin();
      }, 1500);
    });

const googleBtn = loginPageContent.querySelector(".google-login-btn");

if (googleBtn) {
  googleBtn.addEventListener("click", async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      userSession = {
        name: user.displayName,
        email: user.email,
        phone: user.phoneNumber || "",
        avatar: user.photoURL
      };

      localStorage.setItem(
        "ev_user_session",
        JSON.stringify(userSession)
      );
      syncAuthenticatedUser(userSession);

      handlePostLogin();

    } catch (error) {
      console.error(error);
      alert("Google Sign-In failed.");
    }
  });
  
  const closeBtn = loginPageContent.querySelector('#btn-close-login');
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.history.length > 1 && lastActiveRoute !== '/login') {
        window.history.back();
      } else {
        window.location.hash = '#/';
      }
    });
  }
}
}

function loadWishlist() {
  let saved = localStorage.getItem('ev_wishlist_global');
  if (!saved && userSession) {
    saved = localStorage.getItem('ev_wishlist_' + userSession.phone);
  }
  wishlistIds = saved ? JSON.parse(saved) : [];
  updateWishlistBadge();
}

function saveWishlist() {
  localStorage.setItem('ev_wishlist_global', JSON.stringify(wishlistIds));
  updateWishlistBadge();
}

function updateWishlistBadge() {
  if (wishlistBadge) {
    if (wishlistIds.length > 0) {
      wishlistBadge.textContent = wishlistIds.length;
      wishlistBadge.classList.remove('scale-0');
      wishlistBadge.classList.add('scale-100');
    } else {
      wishlistBadge.classList.remove('scale-100');
      wishlistBadge.classList.add('scale-0');
    }
  }
}

function handlePostLogin() {
  loadWishlist();

  const pendingAdd = localStorage.getItem('wishlist_pending_add');
  if (pendingAdd) {
    if (!wishlistIds.includes(pendingAdd)) {
      wishlistIds.push(pendingAdd);
      saveWishlist();
    }
    localStorage.removeItem('wishlist_pending_add');
  }

  const redirectPath = localStorage.getItem('post_login_redirect');
  localStorage.removeItem('post_login_redirect');

  updateLoginButtonState();
  
  if (redirectPath) {
    navigateTo(redirectPath);
  } else {
    navigateTo('/');
  }
}

function renderFavouritesPage() {
  const title = 'Favourite Cars';
  const breadcrumbs = ['MARKETPLACE', 'FAVOURITE CARS'];
  
  let contentHtml = '';
  
  if (wishlistIds.length === 0) {
    contentHtml = `
      <div class="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
        <div class="w-12 h-12 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
          <span class="text-2xl">❤️</span>
        </div>
        <div class="flex flex-col gap-1 max-w-sm">
          <h3 class="font-bold text-sm text-black font-mono">NO FAVOURITE VEHICLES YET</h3>
          <p class="text-xs text-zinc-500 font-mono leading-relaxed">Save your favorite electric cars to compare specs, batteries, and subsidies side-by-side.</p>
        </div>
        <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-explore-evs">
          EXPLORE EVS
        </button>
      </div>
    `;
  } else {
    let cardsHtml = '';
    wishlistIds.forEach(id => {
      const car = EV_DATABASE.find(c => c.id === id);
      if (car) {
        cardsHtml += createCarCardHtml(car, 'w-full');
      }
    });

    contentHtml = `
      <div class="flex flex-col gap-6 pt-6 text-left">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">WISHLIST INDEX / ${wishlistIds.length} VEHICLES</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1 uppercase">FAVOURITE CARS</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          ${cardsHtml}
        </div>
      </div>
    `;
  }
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  const exploreBtn = detailsPageContent.querySelector('.btn-explore-evs');
  if (exploreBtn) {
    exploreBtn.addEventListener('click', () => {
      navigateTo('/');
      setTimeout(() => {
        const popularEl = document.getElementById('popular-evs');
        if (popularEl) popularEl.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    });
  }

  attachCardEvents();
}

function renderAboutUsPage() {
  const title = 'About EV Car Wale';
  const breadcrumbs = ['ABOUT', 'OUR STORY'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in">
      <!-- Premium Hero Section -->
      <div class="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
        <div class="relative z-10 max-w-2xl flex flex-col gap-4">
          <span class="font-mono text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">DRIVING THE FUTURE</span>
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Accelerating India's Sustainable Mobility</h2>
          <p class="text-xs md:text-sm text-zinc-400 leading-relaxed font-mono">
            EV Car Wale is India's smart electric vehicle discovery platform built to help users explore, compare and understand electric vehicles with confidence.
          </p>
        </div>
      </div>

      <!-- Content sections grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono text-zinc-700">
        <!-- Our Story -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">📖</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Our Story</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Founded with the vision to simplify electric vehicle adoption in India, EV Car Wale started as a research lab tracking battery chemistry efficiency. Today, we stand as the most trusted EV marketplace providing transparent pricing and verified specifications.
          </p>
        </div>

        <!-- Why EV Car Wale Started -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">💡</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Why We Started</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            As the Indian automotive space shifts toward electric power, users are often met with complex jargon (LFP vs NMC, regenerative braking index, charging curves). We started EV Car Wale to demystify these specifications and provide real-world insights.
          </p>
        </div>

        <!-- Our Mission -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">🎯</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Our Mission</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Our mission is to accelerate India's transition towards sustainable mobility by making EV information simple, transparent, and accessible to everyone.
          </p>
        </div>

        <!-- Our Vision -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">👁️‍🗨️</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Our Vision</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            We envision a zero-emission future where every Indian household has access to clean, affordable, and smart electric vehicles powered by green infrastructure.
          </p>
        </div>

        <!-- Core Values -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">🛡️</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Our Core Values</h3>
          <ul class="text-xs text-zinc-500 flex flex-col gap-2 list-disc list-inside">
            <li><strong>Transparency:</strong> Honest specifications and pricing indices.</li>
            <li><strong>Sustainability:</strong> Accelerating the adoption of zero-emission mobility.</li>
            <li><strong>Innovation:</strong> Delivering smart comparison metrics and simulator tools.</li>
          </ul>
        </div>

        <!-- What We Offer -->
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-xl">🛠️</span>
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">What We Offer</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            From granular battery performance analytics to charging maps, EMI calculators, and expert test assessments, EV Car Wale is a complete directory for electric vehicle buyers.
          </p>
        </div>
      </div>

      <!-- Future Roadmap -->
      <div class="border border-zinc-200 bg-zinc-50 p-8 rounded-3xl flex flex-col gap-4 font-mono">
        <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">THE ROADMAP</span>
        <h3 class="text-lg font-bold text-black uppercase tracking-wider">Future Expansion</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-500 mt-2">
          <div class="flex flex-col gap-1">
            <span class="text-[#39FF14] font-bold">Phase 1: Discovery</span>
            <p>Providing seamless specs comparisons and pricing indices.</p>
          </div>
          <div class="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
            <span class="text-black font-bold">Phase 2: Booking</span>
            <p>Integrating verified test drives and booking direct to showrooms.</p>
          </div>
          <div class="flex flex-col gap-1 border-t md:border-t-0 md:border-l border-zinc-200 pt-4 md:pt-0 md:pl-6">
            <span class="text-zinc-400 font-bold">Phase 3: Battery Lifecycle</span>
            <p>Adding battery health checking and resale diagnostics.</p>
          </div>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="flex flex-col items-center text-center py-8 gap-4 font-mono">
        <h3 class="font-bold text-sm text-black">Ready to discover your next electric car?</h3>
        <button class="px-8 py-3 bg-black hover:bg-[#39FF14] text-white hover:text-black font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300 btn-about-cta">
          BROWSE ELECTRIC CARS
        </button>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  const ctaBtn = detailsPageContent.querySelector('.btn-about-cta');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      navigateTo('/');
      setTimeout(() => {
        const popularEl = document.getElementById('popular-evs');
        if (popularEl) popularEl.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    });
  }
}

function renderCareersPage() {
  const title = 'Careers';
  const breadcrumbs = ['ABOUT', 'CAREERS'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in font-mono text-zinc-700">
      <div class="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl">
        <div class="relative z-10 max-w-2xl flex flex-col gap-4">
          <span class="font-mono text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">JOIN OUR MISSION</span>
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Work With Us</h2>
          <p class="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Build the discovery infrastructure for India's clean energy revolution. We are looking for product builders, software engineers, and automotive analysts.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Why Work With Us</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            We are a high-autonomy team solving technical challenges around EV datasets, range simulation engines, and charging telemetry. You will make an immediate impact on clean energy transit in India.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Our Culture</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            We value extreme transparency, evidence-driven decisions, and an obsession with detail. We provide flexible remote workspaces, healthcare benefits, and continuous learning opportunities.
          </p>
        </div>
      </div>

      <div class="border border-zinc-200 bg-zinc-50 p-6 rounded-2xl flex flex-col gap-3">
        <h3 class="text-sm font-bold text-black uppercase tracking-wider">Internship Opportunities</h3>
        <p class="text-xs text-zinc-500 leading-relaxed">
          We offer summer internships and co-ops for engineering, data analytics, and business design students interested in the sustainable transit space.
        </p>
      </div>

      <div class="border border-zinc-200 bg-white p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
        <span class="text-2xl">💼</span>
        <h3 class="text-sm font-bold text-black uppercase tracking-wider">Current Openings</h3>
        <div class="bg-zinc-50 border border-zinc-150 rounded px-6 py-3 text-xs text-zinc-500 font-bold uppercase tracking-wider">
          No openings available at the moment.
        </div>
        <p class="text-xs text-zinc-400">
          Think you belong here? Submit your resume to: <a href="mailto:careers@evcarwale.com" class="text-black hover:text-[#39FF14] underline font-bold transition-colors">careers@evcarwale.com</a>
        </p>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderTermsConditionsPage() {
  const title = 'Terms & Conditions';
  const breadcrumbs = ['LEGAL', 'TERMS & CONDITIONS'];
  
  const contentHtml = `
    <div class="flex flex-col gap-8 pt-6 text-left subpage-fade-in font-mono text-xs text-zinc-600 leading-relaxed">
      <div>
        <h2 class="text-xl font-bold text-black uppercase tracking-wider">Terms & Conditions</h2>
        <p class="text-zinc-400 mt-1">Last Updated: July 2026</p>
      </div>

      <div class="flex flex-col gap-6 max-w-4xl">
        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">1. Website Usage</h3>
          <p>By accessing EV Car Wale, you agree to comply with and be bound by these terms. This site is created for public information and discovery purposes only.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">2. User Responsibilities</h3>
          <p>Users must submit accurate information for contact, feedback, or test drive bookings. Any misuse of form endpoints or automated crawling of our database is strictly prohibited.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">3. Vehicle Information Disclaimer</h3>
          <p>Pricing data, range estimates, battery metrics, and subsidy projections are displayed for comparison purposes. While we strive to maintain accurate figures, actual pricing index may vary depending on local dealerships, state incentives, and taxes.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">4. Third Party APIs</h3>
          <p>We leverage third-party maps and datasets to display local charging stations and news feeds. We do not guarantee the uptime or precision of these external systems.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">5. Intellectual Property</h3>
          <p>All brand logos, codebases, custom design layouts, and copy are owned by EV Car Wale or our respective partners. Redistributing our assets without written consent is forbidden.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">6. User Accounts</h3>
          <p>Simulated user profiles created on this platform remain private and local. Any security credentials or user session logs are cached safely in client-side cookies and local storage indexes.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">7. Limitation of Liability</h3>
          <p>EV Car Wale is not liable for any financial or transactional outcomes resulting from user decisions, dealership contracts, or test-drive bookings made through this directory.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">8. Governing Law</h3>
          <p>These terms and conditions are governed by and construed in accordance with the laws of India. Any legal disputes shall be handled in designated regional courts.</p>
        </div>

        <div class="flex flex-col gap-2 border-t border-zinc-200 pt-6">
          <h3 class="font-bold text-black uppercase tracking-wider">Contact Information</h3>
          <p>For legal inquiries, contact us at: <a href="mailto:support@evcarwale.com" class="text-black hover:text-[#39FF14] underline font-bold transition-colors">support@evcarwale.com</a></p>
        </div>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderPrivacyPolicyPage() {
  const title = 'Privacy Policy';
  const breadcrumbs = ['LEGAL', 'PRIVACY POLICY'];
  
  const contentHtml = `
    <div class="flex flex-col gap-8 pt-6 text-left subpage-fade-in font-mono text-xs text-zinc-600 leading-relaxed">
      <div>
        <h2 class="text-xl font-bold text-black uppercase tracking-wider">Privacy Policy</h2>
        <p class="text-zinc-400 mt-1">Last Updated: July 2026</p>
      </div>

      <div class="flex flex-col gap-6 max-w-4xl">
        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">1. Information We Collect</h3>
          <p>We collect search parameters, simulator calculations, and form submissions (contact forms, newsletter sign-ups, feedback rating metrics) to serve page content dynamically.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">2. Cookies & Local Storage</h3>
          <p>We use localized browser cookies and local storage tokens to keep you logged in (active user session name/phone cached locally) and manage search results.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">3. Favourite Cars Storage</h3>
          <p>User favourites are persisted completely locally in your browser's local storage index (<code>ev_wishlist_global</code>). This data is never transmitted to an external server database without your consent.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">4. Search History</h3>
          <p>Recently searched vehicle strings are saved locally to speed up search recommendations. You can clear this anytime by wiping your browser cookies.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">5. Contact Forms & Newsletter</h3>
          <p>Email addresses submitted through our contact us or newsletter fields are kept private and used exclusively to send requested information or support responses.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">6. Third Party APIs</h3>
          <p>Our charging location map and expert reviews link out to third-party endpoints. These external entities operate under their own independent privacy agreements.</p>
        </div>

        <div class="flex flex-col gap-2">
          <h3 class="font-bold text-black uppercase tracking-wider">7. Data Protection & Security</h3>
          <p>We follow baseline industry standards to shield all client session logs. Security protocols protect user profiles from access or unauthorized disclosures.</p>
        </div>

        <div class="flex flex-col gap-2 border-t border-zinc-200 pt-6">
          <h3 class="font-bold text-black uppercase tracking-wider">User Rights & Policy Updates</h3>
          <p>You can request to delete all cached session data. We reserve the right to revise this policy to match legal changes. Contact: <a href="mailto:support@evcarwale.com" class="text-black hover:text-[#39FF14] underline font-bold transition-colors">support@evcarwale.com</a></p>
        </div>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderCorporatePoliciesPage() {
  const title = 'Corporate Policies';
  const breadcrumbs = ['CORPORATE', 'POLICIES'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in font-mono text-zinc-700">
      <div class="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl">
        <div class="relative z-10 max-w-2xl flex flex-col gap-4">
          <span class="font-mono text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">ETHICAL GOVERNANCE</span>
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Corporate Policies</h2>
          <p class="text-xs md:text-sm text-zinc-400 leading-relaxed">
            EV Car Wale operates under strict standards of transparency, safety, environmental responsibility, and social accessibility.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Ethics</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            We are committed to absolute integrity in our data. Dealership sponsorships or brand partnerships never compromise our vehicle specifications comparison reviews or scoring.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Transparency</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            All range calculations, battery curves, and subsidy calculations are derived from public datasets and verified tests, displayed clearly without hidden constraints.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Sustainability</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            Our company mission is to reduce global carbon emissions by making sustainable EV transition simple. We strive to maintain a minimal carbon footprint in our server operations.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Accessibility</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            We design our digital interface to be fully responsive and accessible to everyone, regardless of hardware capabilities, language, or physical impairments.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">User Safety</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            All simulated test drive bookings must follow strict safety regulations. We only partner with certified dealerships that follow all national road safety guidelines.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Data Security</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            Our app operates using sandbox limits and client-side encryption. User passwords, session tokens, and wishlists are protected using modern standards.
          </p>
        </div>
      </div>

      <div class="border border-zinc-200 bg-zinc-50 p-6 rounded-2xl flex flex-col gap-3">
        <h3 class="text-xs font-bold text-black uppercase tracking-wider">Equal Opportunity</h3>
        <p class="text-[11px] text-zinc-500 leading-relaxed">
          EV Car Wale is an equal opportunity employer. We hire solely based on skill, merit, and experience, creating an inclusive workplace free of any prejudice.
        </p>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderInvestorsPage() {
  const title = 'Investors';
  const breadcrumbs = ['ABOUT', 'INVESTORS'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in font-mono text-zinc-700">
      <div class="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl">
        <div class="relative z-10 max-w-2xl flex flex-col gap-4">
          <span class="font-mono text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">STARTUP PROFILE</span>
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Investor Relations</h2>
          <p class="text-xs md:text-sm text-zinc-400 leading-relaxed">
            EV Car Wale is India's fastest growing digital EV discovery index, building software tools to simplify sustainable vehicle purchasing.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Growth Vision</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Our goal is to onboard 5 million monthly active users looking to buy EVs, establishing EV Car Wale as the central hub for electric car information, comparative analysis, and digital dealership booking.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Market Opportunity</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            With India's EV market expected to scale to over $100 billion by 2030, our software provides the essential bridge connecting consumers, dealers, and battery manufacturers.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Expansion Strategy</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            We are expanding our tools to incorporate hyper-local solar savings index, battery lifecycle analytics, and an integrated dealership portal.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider">Future Products</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">
            Currently developing EV Charging Network API integrations, instant loan processing interfaces, and localized EV state subsidy trackers.
          </p>
        </div>
      </div>

      <div class="border-2 border-dashed border-zinc-200 bg-zinc-50 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
        <span class="text-3xl">📈</span>
        <h3 class="text-sm font-bold text-black uppercase tracking-wider">Investment Opportunities</h3>
        <div class="bg-black text-[#39FF14] px-6 py-3 text-xs font-bold rounded-lg uppercase tracking-wider">
          Investment opportunities will be announced in the future.
        </div>
        <p class="text-xs text-zinc-400">
          For investor presentations or growth reports, reach out to: <a href="mailto:business@evcarwale.com" class="text-black hover:text-[#39FF14] underline font-bold transition-colors">business@evcarwale.com</a>
        </p>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderFAQsPage() {
  const title = 'FAQs';
  const breadcrumbs = ['HELP', 'FAQs'];
  
  const faqs = [
    { q: "What is EV Car Wale?", a: "EV Car Wale is India's smart electric vehicle discovery platform built to help users explore, compare and understand electric vehicles with confidence." },
    { q: "Is EV Car Wale free?", a: "Yes, our comparison directory, range metrics, and charging station calculators are completely free for all users." },
    { q: "How accurate are vehicle prices?", a: "All prices shown represent estimated showroom baselines. Dealership margins, insurance, registration fees, and local state subsidies can shift these prices." },
    { q: "Can I compare EVs?", a: "Absolutely. Click the 'Compare Car' action on any detail sheet, choose model codes, and review battery range or pricing differences side-by-side." },
    { q: "Can I save favourite cars?", a: "Yes. Simply click the heart icon on any vehicle card across the site. Your favourites are stored persistently in your local storage index." },
    { q: "Do I need an account to browse?", a: "No account is required to browse, search, or favourite vehicles. Having an account unlocks user dashboard stats." },
    { q: "Where does vehicle data come from?", a: "All data is curated from official manufacturer specification manuals, road tests, and certified governmental datasets." },
    { q: "Can I contact support?", a: "Yes, you can reach our customer support desk at support@evcarwale.com for any inquiries or database updates." },
    { q: "How often is data updated?", a: "We monitor EV market updates daily. Specifications, pricing guidelines, and news files are updated in real-time." },
    { q: "What is the difference between LFP and NMC batteries?", a: "LFP (Lithium Iron Phosphate) offers longer lifecycle and thermal stability, whereas NMC (Nickel Manganese Cobalt) offers higher energy density and longer range." },
    { q: "How does regenerative braking work?", a: "Regenerative braking captures the kinetic energy lost during deceleration and feeds it back into the battery pack to extend real-world driving range." },
    { q: "How do I calculate EV charging times?", a: "Charging time depends on battery size and charger capacity. Fast DC chargers take ~30-60 mins, while standard AC home chargers take 6-10 hours." },
    { q: "Are state EV subsidies still active?", a: "State EV subsidies vary by region in India. Please refer to your local RTO or state transport portal for the latest active policies." },
    { q: "Can I advertise on this site?", a: "Yes. Refer to our 'Advertise With Us' page or contact sales at business@evcarwale.com." },
    { q: "Is my personal data safe?", a: "We take your privacy seriously. Your sessions are cached locally, and email inputs are guarded securely under data compliance rules." }
  ];

  let faqHtml = '';
  faqs.forEach((faq, index) => {
    faqHtml += `
      <div class="faq-accordion-item" data-index="${index}">
        <button class="faq-accordion-header">
          <span>${faq.q}</span>
          <span class="faq-accordion-icon">+</span>
        </button>
        <div class="faq-accordion-body">
          <div class="faq-accordion-content">
            ${faq.a}
          </div>
        </div>
      </div>
    `;
  });

  const contentHtml = `
    <div class="flex flex-col gap-8 pt-6 text-left subpage-fade-in">
      <div>
        <h2 class="text-xl font-bold text-black uppercase tracking-wider font-mono">Frequently Asked Questions</h2>
        <p class="text-zinc-400 mt-1 font-mono text-xs">Got questions about electric cars? Find transparent answers here.</p>
      </div>

      <div class="max-w-3xl flex flex-col mt-4 border-t border-zinc-200">
        ${faqHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');

  // Bind accordion actions
  const items = detailsPageContent.querySelectorAll('.faq-accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    const body = item.querySelector('.faq-accordion-body');
    const content = item.querySelector('.faq-accordion-content');
    
    if (header && body && content) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all first
        items.forEach(i => {
          i.classList.remove('active');
          i.querySelector('.faq-accordion-body').style.maxHeight = '0px';
        });
        
        if (!isActive) {
          item.classList.add('active');
          body.style.maxHeight = content.offsetHeight + 'px';
        }
      });
    }
  });
}

function renderContactUsPage() {
  const title = 'Contact Us';
  const breadcrumbs = ['CONNECT', 'CONTACT US'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in font-mono text-zinc-700">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Info Panel -->
        <div class="flex flex-col gap-6">
          <div>
            <span class="text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">GET IN TOUCH</span>
            <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1 uppercase">Contact Information</h2>
            <p class="text-xs text-zinc-400 mt-2">Have questions about listings or partnership opportunities? Reach out directly.</p>
          </div>

          <div class="flex flex-col gap-4 mt-2">
            <div class="border border-zinc-200 bg-white p-4 rounded-xl flex items-start gap-4">
              <span class="text-lg">📧</span>
              <div class="flex flex-col">
                <span class="text-[9px] text-zinc-400 font-bold uppercase">Customer Support</span>
                <a href="mailto:support@evcarwale.com" class="text-xs text-black font-bold hover:text-[#39FF14] transition-colors mt-0.5">support@evcarwale.com</a>
              </div>
            </div>

            <div class="border border-zinc-200 bg-white p-4 rounded-xl flex items-start gap-4">
              <span class="text-lg">💼</span>
              <div class="flex flex-col">
                <span class="text-[9px] text-zinc-400 font-bold uppercase">Business & Sales</span>
                <a href="mailto:business@evcarwale.com" class="text-xs text-black font-bold hover:text-[#39FF14] transition-colors mt-0.5">business@evcarwale.com</a>
              </div>
            </div>

            <div class="border border-zinc-200 bg-zinc-50 p-4 rounded-xl flex items-start gap-4">
              <span class="text-lg">🕒</span>
              <div class="flex flex-col">
                <span class="text-[9px] text-zinc-400 font-bold uppercase">Response Window</span>
                <span class="text-xs text-zinc-500 mt-0.5">We usually reply within 24–48 business hours.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Form Panel -->
        <div class="border border-zinc-200 bg-white p-8 rounded-3xl shadow-sm">
          <h3 class="text-sm font-bold text-black uppercase tracking-wider mb-6">Send Message</h3>
          
          <form id="contact-us-form" class="flex flex-col gap-4 text-xs">
            <div class="flex flex-col gap-1">
              <label for="contact-name" class="text-[9px] text-zinc-400 font-bold uppercase">Your Name</label>
              <input type="text" id="contact-name" required placeholder="Full Name" class="border border-zinc-200 p-2.5 rounded outline-none focus:border-black transition-colors">
            </div>

            <div class="flex flex-col gap-1">
              <label for="contact-email" class="text-[9px] text-zinc-400 font-bold uppercase">Your Email</label>
              <input type="email" id="contact-email" required placeholder="email@example.com" class="border border-zinc-200 p-2.5 rounded outline-none focus:border-black transition-colors">
            </div>

            <div class="flex flex-col gap-1">
              <label for="contact-subject" class="text-[9px] text-zinc-400 font-bold uppercase">Subject</label>
              <input type="text" id="contact-subject" required placeholder="Query Subject" class="border border-zinc-200 p-2.5 rounded outline-none focus:border-black transition-colors">
            </div>

            <div class="flex flex-col gap-1">
              <label for="contact-message" class="text-[9px] text-zinc-400 font-bold uppercase">Message</label>
              <textarea id="contact-message" rows="4" required placeholder="Write your message here..." class="border border-zinc-200 p-2.5 rounded outline-none focus:border-black transition-colors resize-none"></textarea>
            </div>

            <div id="contact-success-msg" class="text-green-500 font-bold hidden py-1">Message sent successfully! We will get back to you shortly.</div>

            <button type="submit" class="w-full py-3 bg-black hover:bg-[#39FF14] text-white hover:text-black font-bold uppercase tracking-wider rounded transition-colors mt-2">
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');

  // Bind Form Submission
  const form = detailsPageContent.querySelector('#contact-us-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = form.querySelector('#contact-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        form.reset();
        setTimeout(() => {
          successMsg.classList.add('hidden');
        }, 5000);
      }
    });
  }
}

function renderFeedbackPage() {
  const title = 'Feedback';
  const breadcrumbs = ['CONNECT', 'FEEDBACK'];
  
  const contentHtml = `
    <div class="flex flex-col gap-8 pt-6 text-left subpage-fade-in font-mono text-zinc-700 max-w-xl">
      <div>
        <span class="text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">HELP US IMPROVE</span>
        <h2 class="text-2xl font-extrabold tracking-tight text-black mt-1 uppercase">Share Feedback</h2>
        <p class="text-xs text-zinc-400 mt-2">Your insights help refine range algorithms, comparison grids, and tools.</p>
      </div>

      <form id="feedback-form" class="border border-zinc-200 bg-white p-8 rounded-3xl shadow-sm flex flex-col gap-6 text-xs mt-2">
        <!-- Stars widget -->
        <div class="flex flex-col gap-2">
          <span class="text-[9px] text-zinc-400 font-bold uppercase">Rate Your Experience</span>
          <div class="flex gap-2" id="feedback-stars">
            <span class="rating-star text-zinc-300" data-val="1">★</span>
            <span class="rating-star text-zinc-300" data-val="2">★</span>
            <span class="rating-star text-zinc-300" data-val="3">★</span>
            <span class="rating-star text-zinc-300" data-val="4">★</span>
            <span class="rating-star text-zinc-300" data-val="5">★</span>
          </div>
          <input type="hidden" id="feedback-rating-val" required value="">
        </div>

        <div class="flex flex-col gap-1">
          <label for="feedback-suggestions" class="text-[9px] text-zinc-400 font-bold uppercase">Suggestions</label>
          <textarea id="feedback-suggestions" rows="3" placeholder="What did you like or dislike?" class="border border-zinc-200 p-2.5 rounded outline-none focus:border-black transition-colors resize-none"></textarea>
        </div>

        <div class="flex flex-col gap-2">
          <span class="text-[9px] text-zinc-400 font-bold uppercase">Select Category</span>
          <div class="grid grid-cols-2 gap-4">
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="feedback-category" value="bug" required class="accent-black">
              <span>Bug Report</span>
            </label>
            <label class="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="feedback-category" value="feature" class="accent-black">
              <span>Feature Request</span>
            </label>
          </div>
        </div>

        <div id="feedback-success-msg" class="text-green-500 font-bold hidden py-1">Thank you for helping improve EV Car Wale!</div>

        <button type="submit" class="w-full py-3 bg-black hover:bg-[#39FF14] text-white hover:text-black font-bold uppercase tracking-wider rounded transition-colors mt-2">
          SUBMIT FEEDBACK
        </button>
      </form>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');

  // Bind Star rating interactions
  const starsContainer = detailsPageContent.querySelector('#feedback-stars');
  const ratingInput = detailsPageContent.querySelector('#feedback-rating-val');
  if (starsContainer && ratingInput) {
    const stars = starsContainer.querySelectorAll('.rating-star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.getAttribute('data-val'));
        ratingInput.value = val;
        
        // Highlight active stars
        stars.forEach(s => {
          const sVal = parseInt(s.getAttribute('data-val'));
          if (sVal <= val) {
            s.classList.remove('text-zinc-300');
            s.classList.add('text-[#39FF14]');
          } else {
            s.classList.remove('text-[#39FF14]');
            s.classList.add('text-zinc-300');
          }
        });
      });
    });
  }

  // Form submit handler
  const form = detailsPageContent.querySelector('#feedback-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const successMsg = form.querySelector('#feedback-success-msg');
      if (successMsg) {
        successMsg.classList.remove('hidden');
        form.reset();
        // Reset stars
        const stars = form.querySelectorAll('.rating-star');
        stars.forEach(s => {
          s.classList.remove('text-[#39FF14]');
          s.classList.add('text-zinc-300');
        });
        ratingInput.value = '';
        setTimeout(() => {
          successMsg.classList.add('hidden');
        }, 5000);
      }
    });
  }
}

function renderAdvertisePage() {
  const title = 'Advertise With Us';
  const breadcrumbs = ['CONNECT', 'ADVERTISE'];
  
  const contentHtml = `
    <div class="flex flex-col gap-12 pt-6 text-left subpage-fade-in font-mono text-zinc-700">
      <div class="bg-black text-white p-8 md:p-12 rounded-3xl relative overflow-hidden border border-zinc-800 shadow-xl">
        <div class="relative z-10 max-w-2xl flex flex-col gap-4">
          <span class="font-mono text-[9px] text-[#39FF14] uppercase tracking-widest font-bold">MEDIA KIT</span>
          <h2 class="text-3xl md:text-5xl font-extrabold tracking-tight">Advertise With Us</h2>
          <p class="text-xs md:text-sm text-zinc-400 leading-relaxed">
            Position your brand directly in front of targeted electric vehicle buyers, sustainability enthusiasts, and fleet operators.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-lg">⭐</span>
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Featured Listings</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            Highlight your automotive listings or dealership offers at the top of filter sliders and search categories.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-lg">📝</span>
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Sponsored Articles</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            Publish sponsored EV reviews, charger technology guides, or sustainability roadmap articles in our news feed.
          </p>
        </div>

        <div class="border border-zinc-200 bg-white p-6 rounded-2xl flex flex-col gap-3 group hover:border-black transition-all duration-300">
          <span class="text-lg">🖥️</span>
          <h3 class="text-xs font-bold text-black uppercase tracking-wider">Banner Ads</h3>
          <p class="text-[11px] text-zinc-500 leading-relaxed">
            Integrate high-impact premium banner advertisements on our comparison layout modules and guide chapters.
          </p>
        </div>
      </div>

      <div class="border border-zinc-200 bg-zinc-50 p-6 rounded-2xl flex flex-col gap-3">
        <h3 class="text-sm font-bold text-black uppercase tracking-wider">Why Advertise on EV Car Wale?</h3>
        <p class="text-xs text-zinc-500 leading-relaxed">
          We maintain an exceptionally high-intent viewer directory. Visitors are actively calculating charging ranges, studying battery lifecycles, comparing prices, and planning dealer test drive visits.
        </p>
      </div>

      <div class="border border-zinc-200 bg-white p-8 rounded-2xl flex flex-col items-center justify-center text-center gap-4">
        <h3 class="text-sm font-bold text-black uppercase tracking-wider">Get in Touch with Sales</h3>
        <p class="text-xs text-zinc-400">
          Ready to partner with EV Car Wale? Tap below to trigger an email to our marketing deck.
        </p>
        <a href="mailto:business@evcarwale.com" class="px-8 py-3 bg-black hover:bg-[#39FF14] text-white hover:text-black font-bold text-[10px] tracking-widest uppercase rounded-lg transition-all duration-300">
          CONTACT SALES
        </a>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function updateLoginButtonState() {
  const container = document.getElementById('auth-nav-container');
  const containerMobile = document.getElementById('auth-nav-container-mobile');

  // Sync wishlist state and badge count on nav state refresh
  loadWishlist();

  const megaWishlistLink = document.getElementById('mega-wishlist-link');
  if (megaWishlistLink) {
    megaWishlistLink.setAttribute('href', '#/account/shortlisted');
  }

  if (userSession) {
    const avatarHtml = userSession.avatar 
      ? `<img src="${userSession.avatar}" alt="Avatar" class="w-7 h-7 rounded-full object-cover inline-block border border-zinc-300 flex-shrink-0">` 
      : `<span class="text-sm">👤</span>`;

    if (container) {
      container.innerHTML = `
        <button id="user-menu-btn" class="flex items-center gap-2 px-3 py-1.5 font-mono text-[10px] tracking-wider border border-zinc-300 hover:border-black text-black hover:bg-zinc-50 transition-all duration-300 btn-animate">
          ${avatarHtml}
          <span>Hello, <span id="user-name-span">${userSession.name}</span> ▼</span>
        </button>
        <div id="user-dropdown-menu" class="hidden absolute right-0 mt-2 w-48 bg-white border border-zinc-200 shadow-xl rounded-lg py-1.5 z-50 font-mono text-[10px] tracking-wide">
          <a href="#/account/orders" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">MY ORDERS</a>
          <a href="#/account/shortlisted" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">FAVOURITE CARS</a>
          <a href="#/account/activity" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">MY ACTIVITY</a>
          <a href="#/account/vehicles" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">MY VEHICLES</a>
          <a href="#/account/garage" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">MY GARAGE</a>
          <a href="#/account/profile" class="block px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black transition-colors">PROFILE SETTINGS</a>
          <div class="h-[1px] bg-zinc-150 my-1"></div>
          <button id="btn-user-logout" class="w-full text-left px-4 py-2 text-red-650 hover:bg-red-50 transition-colors">LOGOUT</button>
        </div>
      `;

      const menuBtn = container.querySelector('#user-menu-btn');
      const dropdown = container.querySelector('#user-dropdown-menu');
      if (menuBtn && dropdown) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          dropdown.classList.toggle('hidden');
        });
      }

      const logoutBtn = container.querySelector('#btn-user-logout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          userSession = null;
          localStorage.removeItem('ev_user_session');
          try {
            signOut(auth);
          } catch (e) {
            console.error('Firebase signOut failed', e);
          }
          updateLoginButtonState();
          navigateTo('/');
        });
      }
    }

    if (containerMobile) {
      containerMobile.innerHTML = `
        <div class="flex flex-col border border-zinc-200 bg-white text-left">
          <div class="px-4 py-3 bg-zinc-50 border-b border-zinc-200 font-mono text-[10px] text-zinc-700 font-bold uppercase flex items-center gap-2">
            ${avatarHtml}
            <span>HELLO, <span id="user-name-span-mobile">${userSession.name}</span></span>
          </div>
          <div class="flex flex-col font-mono text-[10px]">
            <a href="#/account/orders" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">MY ORDERS</a>
            <a href="#/account/shortlisted" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">FAVOURITE CARS</a>
            <a href="#/account/activity" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">MY ACTIVITY</a>
            <a href="#/account/vehicles" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">MY VEHICLES</a>
            <a href="#/account/garage" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">MY GARAGE</a>
            <a href="#/account/profile" class="px-4 py-2.5 hover:bg-zinc-50 transition-colors border-b border-zinc-150 mobile-acc-link">PROFILE SETTINGS</a>
            <button id="btn-user-logout-mobile" class="w-full text-left px-4 py-2.5 text-red-650 hover:bg-red-50 transition-colors">LOGOUT</button>
          </div>
        </div>
      `;

      const links = containerMobile.querySelectorAll('.mobile-acc-link');
      links.forEach(l => {
        l.addEventListener('click', () => {
          if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
        });
      });

      const logoutBtnMobile = containerMobile.querySelector('#btn-user-logout-mobile');
      if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', () => {
          userSession = null;
          localStorage.removeItem('ev_user_session');
          try {
            signOut(auth);
          } catch (e) {
            console.error('Firebase signOut failed', e);
          }
          updateLoginButtonState();
          if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
          navigateTo('/');
        });
      }
    }
  } else {
    if (container) {
      container.innerHTML = `
        <button id="login-nav-btn" class="px-4 py-2 font-mono text-[10px] tracking-wider border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition-all duration-300 btn-animate">
          LOGIN
        </button>
      `;
      const loginBtn = container.querySelector('#login-nav-btn');
      if (loginBtn) {
        loginBtn.addEventListener('click', () => navigateTo('/login'));
      }
    }

    if (containerMobile) {
      containerMobile.innerHTML = `
        <button id="login-nav-btn-mobile" class="w-full py-3 font-mono text-[10px] tracking-wider border border-zinc-300 hover:border-black text-black hover:bg-black hover:text-white transition-all duration-300">LOGIN</button>
      `;
      const loginBtnMobile = containerMobile.querySelector('#login-nav-btn-mobile');
      if (loginBtnMobile) {
        loginBtnMobile.addEventListener('click', () => {
          if (typeof closeMobileDrawer === 'function') closeMobileDrawer();
          navigateTo('/login');
        });
      }
    }
  }
}

// Global click event to close dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('user-dropdown-menu');
  const menuBtn = document.getElementById('user-menu-btn');
  if (dropdown && menuBtn && !menuBtn.contains(e.target) && !dropdown.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

function renderDashboardPage(tabId = 'orders') {
  toggleMainLayout('dashboard');
  
  if (dashboardPageContent) {
    dashboardPageContent.innerHTML = `
      <div class="max-w-6xl mx-auto flex flex-col gap-8 text-left font-mono" id="dashboard-root">
        <!-- Top Profile Card -->
        <div class="border border-zinc-200 rounded-2xl p-6 bg-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <img src="${userSession.avatar}" alt="Avatar" class="w-16 h-16 rounded-full border-2 border-black object-cover">
            <div class="flex flex-col">
              <h2 class="text-lg font-black text-black tracking-tight" id="dash-header-name">${userSession.name}</h2>
              <span class="text-xs text-zinc-400 font-mono">${userSession.phone} &bull; ${userSession.email}</span>
            </div>
          </div>
          
          <div class="border-t md:border-t-0 md:border-l border-zinc-150 pt-4 md:pt-0 md:pl-8 flex gap-6 shrink-0">
            <div class="flex flex-col">
              <span class="text-[9px] text-zinc-400 font-bold tracking-wider font-mono uppercase">MY ORDERS</span>
              <span class="text-xl font-black text-black">0</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] text-zinc-400 font-bold tracking-wider font-mono uppercase">FAVOURITES</span>
              <span class="text-xl font-black text-black">${wishlistIds.length}</span>
            </div>
            <div class="flex flex-col">
              <span class="text-[9px] text-zinc-400 font-bold tracking-wider font-mono uppercase">MY VEHICLES</span>
              <span class="text-xl font-black text-black">0</span>
            </div>
          </div>
        </div>

        <!-- Bottom Workspace: Sidebar + Pane -->
        <div class="flex flex-col lg:flex-row gap-8 items-start">
          <!-- Sidebar Menu Tabs -->
          <div class="flex flex-row overflow-x-auto lg:flex-col gap-1 pb-4 lg:pb-0 border-b lg:border-b-0 lg:border-r border-zinc-200 lg:pr-6 mb-2 lg:mb-0 lg:w-64 w-full shrink-0">
            <a href="#/account/orders" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="orders">
              <span>📦</span> My Orders
            </a>
            <a href="#/account/shortlisted" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="shortlisted">
              <span>❤️</span> Favourite Cars
            </a>
            <a href="#/account/activity" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="activity">
              <span>⚡</span> My Activity
            </a>
            <a href="#/account/vehicles" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="vehicles">
              <span>🚗</span> My Vehicles
            </a>
            <a href="#/account/garage" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="garage">
              <span>🔧</span> My Garage
            </a>
            <a href="#/account/profile" class="tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0" data-tab="profile">
              <span>👤</span> Profile Settings
            </a>
            <div class="h-[1px] bg-zinc-200 my-2 hidden lg:block"></div>
            <button class="logout-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg text-red-650 hover:bg-red-50 transition-colors flex items-center gap-2.5 shrink-0">
              <span>🚪</span> Logout
            </button>
          </div>

          <!-- Right Pane: Active Workspace Content -->
          <div class="flex-1 w-full border border-zinc-200 bg-white rounded-2xl p-6 shadow-sm min-h-[350px]" id="dash-workspace">
            <!-- Active tab content will be loaded dynamically here -->
          </div>
        </div>
      </div>
    `;

    const tabs = dashboardPageContent.querySelectorAll('.tab-btn');
    const workspace = dashboardPageContent.querySelector('#dash-workspace');

    // Highlight the active sidebar button
    tabs.forEach(btn => {
      if (btn.getAttribute('data-tab') === tabId) {
        btn.className = 'tab-btn active text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0 bg-black text-white font-bold';
      } else {
        btn.className = 'tab-btn text-left px-4 py-3 font-mono text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2.5 shrink-0 text-zinc-650 hover:bg-zinc-100 hover:text-black';
      }
    });

    if (tabId === 'orders') {
      workspace.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
          <div class="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <span class="text-2xl">📦</span>
          </div>
          <div class="flex flex-col gap-1 max-w-sm">
            <h3 class="font-bold text-sm text-black font-mono">NO ORDERS FOUND</h3>
            <p class="text-xs text-zinc-500 font-mono leading-relaxed">You haven't placed any bookings or orders yet. Explore our smart EV catalog to get started.</p>
          </div>
          <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-explore-evs">
            EXPLORE EVS
          </button>
        </div>
      `;
      const exploreBtn = workspace.querySelector('.btn-explore-evs');
      if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
          navigateTo('/');
          setTimeout(() => {
            const popularEl = document.getElementById('popular-evs');
            if (popularEl) popularEl.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        });
      }
    } else if (tabId === 'shortlisted') {
      if (wishlistIds.length === 0) {
        workspace.innerHTML = `
          <div class="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
            <div class="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
              <span class="text-2xl">❤️</span>
            </div>
            <div class="flex flex-col gap-1 max-w-sm">
              <h3 class="font-bold text-sm text-black font-mono">NO SHORTLISTED VEHICLES</h3>
              <p class="text-xs text-zinc-500 font-mono leading-relaxed">Save your favorite electric cars to compare specs, batteries, and subsidies side-by-side.</p>
            </div>
            <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-explore-evs">
              EXPLORE EVS
            </button>
          </div>
        `;
        const exploreBtn = workspace.querySelector('.btn-explore-evs');
        if (exploreBtn) {
          exploreBtn.addEventListener('click', () => {
            navigateTo('/');
            setTimeout(() => {
              const popularEl = document.getElementById('popular-evs');
              if (popularEl) popularEl.scrollIntoView({ behavior: 'smooth' });
            }, 150);
          });
        }
      } else {
        let cardsHtml = '';
        wishlistIds.forEach(id => {
          const car = EV_DATABASE.find(c => c.id === id);
          if (car) {
            cardsHtml += `
              <div class="border border-zinc-200 bg-white p-4 rounded-xl flex flex-col justify-between relative group hover:border-black transition-all shadow-sm">
                <button class="wishlist-btn absolute top-3 right-3 z-20" data-id="${car.id}" aria-label="Remove from Wishlist">
                  <svg viewBox="0 0 24 24" class="w-4 h-4 fill-current">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
                
                <div class="h-28 bg-zinc-50 flex items-center justify-center mb-3 rounded-lg overflow-hidden border border-zinc-100">
                  <img src="${resolveImagePath(car.image)}" alt="${car.name}" class="max-h-24 object-contain">
                </div>

                <div class="flex flex-col gap-1 text-left text-black font-mono">
                  <div class="flex justify-between items-start">
                    <div>
                      <span class="text-[9px] text-zinc-500 uppercase font-bold">${car.brand}</span>
                      <h4 class="text-sm font-bold text-black mt-0.5">${car.name}</h4>
                    </div>
                    <span class="text-xs font-bold text-black">${car.price}</span>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-y-1 gap-x-2 my-2 text-[9px] text-zinc-500 border-t border-zinc-100 pt-2">
                    <div>RANGE: <span class="text-zinc-800 font-bold">${car.range}</span></div>
                    <div>BATTERY: <span class="text-zinc-800 font-bold">${car.battery}</span></div>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-2 mt-3 font-mono text-[9px] font-bold">
                  <button class="py-2 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black uppercase rounded transition-colors btn-view-details" data-id="${car.id}">
                    VIEW DETAILS
                  </button>
                  <button class="py-2 bg-zinc-100 hover:bg-red-50 text-zinc-650 hover:text-red-650 uppercase rounded transition-colors btn-remove-wishlist" data-id="${car.id}">
                    REMOVE
                  </button>
                </div>
              </div>
            `;
          }
        });

        workspace.innerHTML = `
          <div class="flex flex-col gap-6 text-left">
            <div>
              <h3 class="font-bold text-sm text-black font-mono uppercase">SHORTLISTED VEHICLES (${wishlistIds.length})</h3>
              <p class="text-[11px] text-zinc-500 font-mono">Your handpicked smart EVs to compare specifications, range performance, and pricing indices.</p>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              ${cardsHtml}
            </div>
          </div>
        `;

        workspace.querySelectorAll('.btn-view-details').forEach(btn => {
          btn.addEventListener('click', () => {
            const carId = btn.getAttribute('data-id');
            openCarDetails(carId);
          });
        });

        workspace.querySelectorAll('.btn-remove-wishlist, .wishlist-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const carId = btn.getAttribute('data-id');
            toggleWishlist(carId);
          });
        });
      }
    } else if (tabId === 'activity') {
      workspace.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
          <div class="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <span class="text-2xl">⚡</span>
          </div>
          <div class="flex flex-col gap-1 max-w-sm">
            <h3 class="font-bold text-sm text-black font-mono">NO ACTIVITY YET</h3>
            <p class="text-xs text-zinc-500 font-mono leading-relaxed">Your comparison sessions, range calculations, and article views will appear here.</p>
          </div>
          <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-read-guide">
            READ EV GUIDE
          </button>
        </div>
      `;
      const readBtn = workspace.querySelector('.btn-read-guide');
      if (readBtn) readBtn.addEventListener('click', () => navigateTo('/guide/guide-1'));
    } else if (tabId === 'vehicles') {
      workspace.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
          <div class="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <span class="text-2xl">🚗</span>
          </div>
          <div class="flex flex-col gap-1 max-w-sm">
            <h3 class="font-bold text-sm text-black font-mono">NO VEHICLES ADDED</h3>
            <p class="text-xs text-zinc-500 font-mono leading-relaxed">Add your vehicle specifications to get premium tracking, charging reminders, and battery health indexes.</p>
          </div>
          <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-add-vehicle">
            ADD VEHICLE
          </button>
        </div>
      `;
      const addBtn = workspace.querySelector('.btn-add-vehicle');
      if (addBtn) addBtn.addEventListener('click', () => alert('Vehicle registration dialog opened (Simulated).'));
    } else if (tabId === 'garage') {
      workspace.innerHTML = `
        <div class="flex flex-col items-center justify-center text-center py-12 px-4 gap-4">
          <div class="w-16 h-16 rounded-full bg-zinc-50 border border-zinc-200 flex items-center justify-center">
            <span class="text-2xl">🔧</span>
          </div>
          <div class="flex flex-col gap-1 max-w-sm">
            <h3 class="font-bold text-sm text-black font-mono">GARAGE IS EMPTY</h3>
            <p class="text-xs text-zinc-500 font-mono leading-relaxed">Your garage houses your EV models to monitor servicing records, insurance renewals, and smart grid syncs.</p>
          </div>
          <button class="px-5 py-2.5 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 btn-configure-garage">
            CONFIGURE GARAGE
          </button>
        </div>
      `;
      const addBtn = workspace.querySelector('.btn-configure-garage');
      if (addBtn) addBtn.addEventListener('click', () => alert('Garage configuration setup opened (Simulated).'));
    } else if (tabId === 'consents') {
      workspace.innerHTML = `
        <div class="flex flex-col gap-6 text-left">
          <div>
            <h3 class="font-bold text-sm text-black font-mono uppercase">MANAGE CONSENTS</h3>
            <p class="text-[11px] text-zinc-500 font-mono">Control how EV CAR WALE collects and manages your profile data, consents, and notification channels.</p>
          </div>
          
          <form id="consent-form" class="flex flex-col gap-4 font-mono text-xs">
            <label class="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <input type="checkbox" checked class="mt-1 w-4 h-4 rounded text-black border-zinc-350 focus:ring-black">
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-black text-[11px]">Marketing Communications</span>
                <span class="text-[10px] text-zinc-400">Receive range planner tips, comparative studies, and special launch offers via WhatsApp and email.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <input type="checkbox" checked class="mt-1 w-4 h-4 rounded text-black border-zinc-350 focus:ring-black">
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-black text-[11px]">Authorized Dealership Sharing</span>
                <span class="text-[10px] text-zinc-400">Permit EV CAR WALE to share your details with brand partners for organizing seamless test drive events.</span>
              </div>
            </label>

            <label class="flex items-start gap-3 cursor-pointer p-4 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors">
              <input type="checkbox" class="mt-1 w-4 h-4 rounded text-black border-zinc-350 focus:ring-black">
              <div class="flex flex-col gap-0.5">
                <span class="font-bold text-black text-[11px]">Cookie & Analytics History</span>
                <span class="text-[10px] text-zinc-400">Allow cookies to save your search history for showing local charging network guidelines automatically.</span>
              </div>
            </label>

            <button type="submit" class="px-5 py-3 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 self-start">
              SAVE PREFERENCES
            </button>
            <span id="consent-status" class="text-[10px] text-emerald-600 font-bold hidden font-mono">✓ Consent settings updated successfully.</span>
          </form>
        </div>
      `;
      const consentForm = workspace.querySelector('#consent-form');
      const statusSpan = workspace.querySelector('#consent-status');
      consentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        statusSpan.classList.remove('hidden');
        setTimeout(() => { if (statusSpan) statusSpan.classList.add('hidden'); }, 3000);
      });
    } else if (tabId === 'profile') {
      workspace.innerHTML = `
        <div class="flex flex-col gap-6 text-left">
          <div>
            <h3 class="font-bold text-sm text-black font-mono uppercase">PROFILE SETTINGS</h3>
            <p class="text-[11px] text-zinc-500 font-mono">Update your account credentials, notifications email, and display avatar details.</p>
          </div>
          
          <form id="profile-settings-form" class="flex flex-col gap-4 font-mono text-xs max-w-md">
            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Full Name</label>
              <input type="text" id="prof-name" value="${userSession.name}" required class="px-4 py-3 border border-zinc-250 rounded-lg outline-none focus:border-black font-mono text-black">
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Email Address</label>
              <input type="email" id="prof-email" value="${userSession.email}" required class="px-4 py-3 border border-zinc-250 rounded-lg outline-none focus:border-black font-mono text-black">
            </div>

            <div class="flex flex-col gap-1.5">
              <label class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Mobile Number (Verified)</label>
              <input type="text" value="${userSession.phone}" disabled class="px-4 py-3 border border-zinc-200 bg-zinc-50 text-zinc-400 rounded-lg font-mono">
            </div>

            <button type="submit" class="px-5 py-3 bg-black hover:bg-[#22C55E] text-white hover:text-black font-mono text-[9px] font-bold tracking-wider uppercase rounded-lg transition-all duration-300 self-start">
              SAVE CHANGES
            </button>
            <span id="profile-status" class="text-[10px] text-emerald-600 font-bold hidden font-mono">✓ Profile settings updated successfully.</span>
          </form>
        </div>
      `;
      const profileForm = workspace.querySelector('#profile-settings-form');
      const statusSpan = workspace.querySelector('#profile-status');
      const nameInput = workspace.querySelector('#prof-name');
      const emailInput = workspace.querySelector('#prof-email');
      const dashHeaderName = dashboardPageContent.querySelector('#dash-header-name');
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        userSession.name = nameInput.value;
        userSession.email = emailInput.value;
        localStorage.setItem('ev_user_session', JSON.stringify(userSession));
        updateLoginButtonState();
        if (dashHeaderName) dashHeaderName.textContent = userSession.name;
        statusSpan.classList.remove('hidden');
        setTimeout(() => { if (statusSpan) statusSpan.classList.add('hidden'); }, 3000);
      });
    }

    const logoutBtn = dashboardPageContent.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        userSession = null;
        localStorage.removeItem('ev_user_session');
        updateLoginButtonState();
        navigateTo('/');
      });
    }
  }
}

//// Intercept navigation triggers
function initializeAppDOM() {
  function safeInit(name, fn) {
    try {
      fn();
    } catch (e) {
      console.error(`Error initializing component ${name}:`, e);
    }
  }

  safeInit('Logo Click', () => {
    const logo = document.querySelector('.logo-link');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/');
        const hero = document.getElementById('home');
        if (hero) hero.scrollIntoView({ behavior: 'smooth' });
      });
    }
  });

  safeInit('View All Buttons', () => {
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
    
    const btnViewAllBrands = document.getElementById('btn-view-all-brands');
    if (btnViewAllBrands) {
      btnViewAllBrands.addEventListener('click', (e) => {
        e.preventDefault();
        navigateTo('/brands');
      });
    }
  });

  safeInit('Guides and News Render', () => {
    renderNewsAndGuides();
  });

  safeInit('Scroll Dividers', () => {
    if (typeof initScrollDividers === 'function') initScrollDividers();
  });

  safeInit('Premium Educational Features', () => {
    if (typeof initWhyEVAccordion === 'function') initWhyEVAccordion();
    if (typeof renderEVGallery === 'function') renderEVGallery();
    if (typeof initEducationalModals === 'function') initEducationalModals();
    if (typeof initRevealObservers === 'function') initRevealObservers();
  });

  safeInit('Instant Search Listeners', () => {
    const nameSearchEl = document.getElementById('search-car-name');
    const brandSearchEl = document.getElementById('search-car-brand');
    const budgetSearchEl = document.getElementById('search-car-budget');
    if (nameSearchEl) nameSearchEl.addEventListener('input', renderAllCarousels);
    if (brandSearchEl) brandSearchEl.addEventListener('change', renderAllCarousels);
    if (budgetSearchEl) budgetSearchEl.addEventListener('change', renderAllCarousels);
  });

  safeInit('Highlight Observers', () => {
    if (typeof initElectricHighlightObserver === 'function') initElectricHighlightObserver();
  });

  safeInit('Login Nav Event Handlers', () => {
    const loginBtn = document.getElementById('login-nav-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        if (userSession) navigateTo('/dashboard');
        else navigateTo('/login');
      });
    }
    const loginBtnMobile = document.getElementById('login-nav-btn-mobile');
    if (loginBtnMobile) {
      loginBtnMobile.addEventListener('click', () => {
        if (userSession) navigateTo('/dashboard');
        else navigateTo('/login');
      });
    }
    updateLoginButtonState();
  });

  safeInit('Footer Newsletter Submit', () => {
    const newsletterForm = document.getElementById('footer-newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('footer-newsletter-email');
        const errorMsg = document.getElementById('footer-newsletter-error');
        const successMsg = document.getElementById('footer-newsletter-success');
        const successTick = document.getElementById('newsletter-success-tick');
        
        if (!emailInput || !errorMsg || !successMsg) return;
        
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        errorMsg.classList.add('hidden');
        successMsg.classList.add('hidden');
        if (successTick) successTick.classList.add('hidden');
        emailInput.classList.remove('newsletter-success-glow');
        
        if (!emailRegex.test(email)) {
          errorMsg.classList.remove('hidden');
        } else {
          successMsg.classList.remove('hidden');
          if (successTick) successTick.classList.remove('hidden');
          emailInput.classList.add('newsletter-success-glow');
          apiRequest('/api/newsletter', {
            method: 'POST',
            body: { email, source: 'footer' }
          });
          emailInput.value = '';
        }
      });
    }
  });

  safeInit('Auth State Changed', () => {
    if (typeof onAuthStateChanged === 'function') {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          userSession = {
            name: user.displayName || 'User',
            email: user.email,
            phone: user.phoneNumber || '+91 XXX XXX XXXX',
            avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80'
          };
          localStorage.setItem('ev_user_session', JSON.stringify(userSession));
          syncAuthenticatedUser(userSession);
        }
        updateLoginButtonState();
      });
    }
  });

  safeInit('Language Selector', () => {
    if (typeof initLanguageSelector === 'function') initLanguageSelector();
  });

  safeInit('AI Chat Assistant', () => {
    if (typeof initAIChat === 'function') initAIChat();
  });
  window.appInitialized = true;
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initializeAppDOM();
} else {
  document.addEventListener('DOMContentLoaded', initializeAppDOM);
}

// Re-route on browser back/forward buttons and hash navigation
window.addEventListener('popstate', handleRouting);
window.addEventListener('hashchange', handleRouting);

// Check path on page load
window.addEventListener('load', handleRouting);
window.addEventListener('DOMContentLoaded', handleRouting);

// Call handleRouting once immediately to parse the initial path
handleRouting();



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
          <button class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-widest self-start btn-learn-guide" data-id="${chapter.id}">
            Learn More <span class="arrow">→</span>
          </button>
        </div>
      `;
    });

    // Bind clicks
    document.querySelectorAll('.btn-learn-guide').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        navigateTo('/guide/' + id);
      });
    });
  }
}

function renderViewAllPage(section) {
  const sectionNames = {
    all: 'All Electric Cars',
    popular: 'Popular Electric Cars',
    launches: 'Latest EV Launches',
    upcoming: 'Upcoming Electric Cars'
  };
  const title = sectionNames[section] || 'All Electric Cars';
  const breadcrumbs = ['MARKETPLACE', title];
  
  const sectionCars = section === 'all'
    ? EV_DATABASE
    : EV_DATABASE.filter(car => car.sections && car.sections.includes(section));
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

const GUIDE_DETAILS_EXTENDED = {
  'guide-1': {
    steps: [
      'Analyze your typical daily driving mileage requirements.',
      'Compare fuel and maintenance costs of standard petrol cars vs EVs.',
      'Research EV models that fit within your budget bracket.',
      'Arrange test drives to feel electric instant torque first-hand.'
    ],
    features: [
      'Zero Exhaust Emissions: Environmentally friendly operation.',
      'Electric Motor Powertrain: Instant torque with no transmission lag.',
      'Low Operating Costs: Up to 80% cheaper per kilometer compared to fuel.'
    ],
    benefits: [
      'Saves money directly on daily commutes and annual fuel spends.',
      'Extremely quiet cabin noise and vibration-free experience.',
      'Fewer moving parts reduces overall mechanical maintenance complexity.'
    ],
    faqs: [
      { q: 'Are EVs really better for the environment?', a: 'Yes, because they emit zero local pollutants, and even lifecycle emissions when powered by the grid are lower than internal combustion cars.' },
      { q: 'How long does it take to get used to instant torque?', a: 'Almost immediately. It makes city driving much simpler and overtaking on highways very safe.' }
    ],
    related: [
      { name: 'AC vs DC Charging Differences (Chapter 2)', url: '#/guide/guide-2' },
      { name: 'EV Battery Tech and Chemistry (Chapter 3)', url: '#/guide/guide-3' }
    ]
  },
  'guide-2': {
    steps: [
      'Connect the AC charging wallbox gun to your car at home/work.',
      'Configure charging times to run during lower overnight grid tariffs.',
      'For highway travel, locate high-power DC fast-charging ports along your route.',
      'Limit DC fast charging past 80% State of Charge (SoC) to protect cells.'
    ],
    features: [
      'AC Charging: Gentler charging method ideal for overnight storage.',
      'DC Fast Charging: High-power charger bypassing onboard conversion.',
      'CCS2 Standards: The unified charger connector used widely across India.'
    ],
    benefits: [
      'Home charging provides absolute comfort and extremely low tariffs.',
      'Highway DC charging makes road trips completely seamless.',
      'Advanced safety features prevent electrical overloads or shocks.'
    ],
    faqs: [
      { q: 'Can I charge my electric vehicle in wet weather?', a: 'Yes. EV charging systems and cables are fully weatherproofed and designed to automatically cut off power if moisture or short circuits are detected.' },
      { q: 'What is the standard charging connector in India?', a: 'CCS2 (Combined Charging System 2) is the standard for DC fast charging, and Type 2 is standard for AC charging.' }
    ],
    related: [
      { name: 'Why Buy an EV? (Chapter 1)', url: '#/guide/guide-1' },
      { name: 'Understanding Battery Chemistry (Chapter 3)', url: '#/guide/guide-3' }
    ]
  },
  'guide-3': {
    steps: [
      'Maintain battery charge between 20% and 80% for daily use.',
      'Avoid parking the vehicle in extreme direct sunlight or heat.',
      'Minimize the regular use of ultra-fast DC highway chargers.',
      'Charge LFP battery chemistry to 100% once a week to calibrate sensors.'
    ],
    features: [
      'LFP (Lithium Iron Phosphate): Offers long cycle life and high thermal safety.',
      'NMC (Nickel Manganese Cobalt): Offers higher energy density and lighter packs.',
      'Liquid-Cooling Channels: Keeps pack temperature stable under high load.'
    ],
    benefits: [
      'LFP batteries are perfect for daily use, allowing 100% charging safely.',
      'NMC packs enable premium, long-range EV models with lower weight.',
      'Active cooling systems prolong overall battery health and range.'
    ],
    faqs: [
      { q: 'Does an EV battery degrade quickly?', a: 'No, modern EV battery packs degrade slowly, usually about 1-2% per year, which means they easily outlast the standard chassis lifecycle.' },
      { q: 'What is SOH in an EV battery?', a: 'SOH stands for State of Health, representing the current battery capacity relative to when it was new.' }
    ],
    related: [
      { name: 'Why Buy an EV? (Chapter 1)', url: '#/guide/guide-1' },
      { name: 'AC vs DC Charging Differences (Chapter 2)', url: '#/guide/guide-2' }
    ]
  },
  'home-charging': {
    steps: [
      'Verify home load capacity by checking your local utility bill meter.',
      'Install a high-quality 15A industrial socket or 7.2 kW Wallbox unit.',
      'Use thick armored wiring routed directly from your main meter board.',
      'Ensure standard grounding/earthing is certified by a licensed electrician.'
    ],
    features: [
      'Standard 15A Single Phase Line: Delivers 2-3 kW of charging power.',
      '7.2 kW AC Wallbox: Cuts charging times down by more than 60%.',
      'Surge Protection Devices (SPD): Safeguards the vehicle from grid spikes.'
    ],
    benefits: [
      'Extremely low running costs using residential electricity rates.',
      'Maximum convenience of starting every day with a fully charged pack.',
      'Slow AC charging preserves overall cell integrity over years of use.'
    ],
    faqs: [
      { q: 'Do I need a separate electricity connection for home charging?', a: 'While not mandatory, many states offer subsidized separate EV connections which reduce charging costs further.' },
      { q: 'How long does a 7.2 kW Wallbox take to charge a standard EV?', a: 'Typically between 6 to 8 hours for an average 30-40 kWh battery size.' }
    ],
    related: [
      { name: 'Apartment Complex Charging Guide', url: '#/guide/guide-apartment-charging' },
      { name: 'Fast vs Slow Charging Differences', url: '#/guide/guide-fast-vs-slow' }
    ]
  },
  'apartment-charging': {
    steps: [
      'Submit the formal RWA NOC Request template to your society management.',
      'Request society electricians to map designated routing paths from your meter.',
      'Run certified armored wiring to your dedicated parking spot.',
      'Install a locked electrical panel box around your charger connection.'
    ],
    features: [
      'RWA NOC Template: Formal request structure for residential approval.',
      'Designated Parking Cabling: Standardized wiring routes for building safety.',
      'Locked Enclosures: Restricts power access to authorized users only.'
    ],
    benefits: [
      'Legally secure charging access at your designated parking slot.',
      'Maintains building aesthetics and wiring compliance standards.',
      'Increases apartment resale value and future-proofs property assets.'
    ],
    faqs: [
      { q: 'Can an RWA refuse my EV charger installation request?', a: 'RWAs cannot unreasonably block installations if building load limits and safety wiring codes are followed.' },
      { q: 'Who bears the cost of apartment charger cabling?', a: 'The individual EV owner pays for all wiring, meters, and charging device components.' }
    ],
    related: [
      { name: 'Home Charging Setup Guide', url: '#/guide/guide-home-charging' },
      { name: 'EV Running Cost Analysis', url: '#/guide/guide-running-cost' }
    ]
  },
  'fast-vs-slow': {
    steps: [
      'Charge slowly at home using AC power for daily commutes.',
      'Utilize DC fast chargers when traveling along major national highways.',
      'Observe charging curves: unplug past 80% as charging rate slows down.',
      'Handle charging cables carefully to protect charging pins.'
    ],
    features: [
      'AC Charging (3.3 kW - 11 kW): Uses car’s onboard converter slowly.',
      'DC Fast Charging (25 kW - 150 kW+): Sends power directly to battery.',
      'CCS2 Connector Standard: The standard public fast charging socket.'
    ],
    benefits: [
      'Saves battery health and prevents degradation through slow AC use.',
      'Allows long-distance highway travel with fast 30-40 minute charge stops.',
      'AC charging at home is highly cost-effective compared to commercial public stations.'
    ],
    faqs: [
      { q: 'Why does charging speed slow down above 80%?', a: 'To protect cell chemistry, the Battery Management System reduces power flow as the battery fills up.' },
      { q: 'Can I use DC fast charging daily?', a: 'Frequent public DC charging raises cell temperatures, which can increase battery degradation over time.' }
    ],
    related: [
      { name: 'Home Charging Setup Guide', url: '#/guide/guide-home-charging' },
      { name: 'EV Road Trip Planning Guide', url: '#/guide/guide-trip-planning' }
    ]
  },
  'battery-warranty': {
    steps: [
      'Review the manufacturer warranty handbook for specific retention limits.',
      'Maintain standard car service logs at authorized dealerships.',
      'Avoid aftermarket modifications that tap directly into high-voltage lines.',
      'Review battery health reports during yearly diagnostics.'
    ],
    features: [
      'Standard 8-Year or 1.6 Lakh km warranty guidelines.',
      '70% SOH minimum capacity retention replacement clauses.',
      'Active Battery Management System (BMS) telemetry log tracking.'
    ],
    benefits: [
      'Provides peace of mind against early battery degradation issues.',
      'Ensures consistent range performance during the warranty lifecycle.',
      'Improves the resale value of pre-owned electric cars.'
    ],
    faqs: [
      { q: 'What happens to the battery after 8 years?', a: 'The battery will continue working perfectly but will have slightly less range than when it was new.' },
      { q: 'Are battery replacements fully covered by warranty?', a: 'Yes, if capacity drops below the specified minimum (usually 70-80%) due to manufacturing defects or normal degradation within the warranty period.' }
    ],
    related: [
      { name: 'EV Running Cost Analysis', url: '#/guide/guide-running-cost' },
      { name: 'Real-World Range Variables', url: '#/guide/guide-real-range' }
    ]
  },
  'subsidies': {
    steps: [
      'Check active state policy benefits for registration waivers and incentives.',
      'Choose dealerships that process road tax waivers directly during registration.',
      'Submit the FAME cash claim forms online at the state portals.',
      'File Section 80EEB deductions in your income tax returns.'
    ],
    features: [
      'FAME-II Subsidies: Central incentives based on battery size.',
      'State waivers: Complete exemption of road tax and registration fees.',
      'Section 80EEB Tax Deductions: Deduct up to ₹1.5 Lakh on EV loan interest.'
    ],
    benefits: [
      'Lowers overall acquisition and on-road prices by up to 10-15%.',
      'Provides substantial financial cashbacks direct to buyers.',
      'Reduces the net interest paid on EV auto loans.'
    ],
    faqs: [
      { q: 'Are subsidies available for all EVs?', a: 'Many state subsidies are capped at cars under ₹15 Lakhs ex-showroom, though road tax waivers can apply to all electric vehicles.' },
      { q: 'How long does it take to receive subsidy cashbacks?', a: 'Direct cashback processing from state portals can take between 3 to 6 months.' }
    ],
    related: [
      { name: 'EV Running Cost Analysis', url: '#/guide/guide-running-cost' },
      { name: 'EV Battery Warranty & Lifespan', url: '#/guide/guide-battery-warranty' }
    ]
  },
  'running-cost': {
    steps: [
      'Calculate EV efficiency using: Battery Capacity (kWh) / Range (km).',
      'Multiply by your home slab rate tariff (e.g. ₹6-8 per unit).',
      'Compare with petrol baseline costs (₹100/litre, 15 km/l baseline).',
      'Calculate annual savings based on your driving distances.'
    ],
    features: [
      'EV consumption metric (kWh/km or Wh/km) tracker.',
      'ICE baseline consumption: 15 km/l fuel efficiency benchmarks.',
      'Home electricity slab rates vs public charging commercial rates.'
    ],
    benefits: [
      'Running costs of ₹1-1.5 per km compared to ₹7 per km for petrol.',
      'Saves ₹80,000+ annually for drivers traveling 12,000+ km.',
      'Virtually zero periodic mechanical maintenance charges.'
    ],
    faqs: [
      { q: 'Does AC usage drastically increase running costs?', a: 'AC reduces range by about 8-10%, which increases running cost slightly to around ₹1.35 per km—still vastly cheaper than petrol.' },
      { q: 'Is EV servicing cheap?', a: 'Yes, standard EV servicing involves only cabin filter replacement, fluid checks (coolant/brake fluid), and tire rotation, costing under ₹3,000 per year.' }
    ],
    related: [
      { name: 'State Subsidies & Benefits', url: '#/guide/guide-subsidies' },
      { name: 'Real-World Range Variables', url: '#/guide/guide-real-range' }
    ]
  },
  'trip-planning': {
    steps: [
      'Map your route using public charger aggregator maps.',
      'Filter stations by charger speed (prefer 50kW+ DC) and status.',
      'Pre-cool the cabin while the vehicle is connected to the charger.',
      'Cruise at steady speeds of 80-90 km/h on expressways.'
    ],
    features: [
      'Aggregated fast charger maps and connector statuses.',
      'Real-time battery SOC monitoring and range estimators.',
      'Expressway charging corridor hubs (CCS2 standard).'
    ],
    benefits: [
      'Eliminates range anxiety by securing guaranteed charging stops.',
      'Saves time by utilizing high-capacity chargers matched to your car.',
      'Ensures a smooth, stress-free road trip experience.'
    ],
    faqs: [
      { q: 'What happens if a highway charger is offline?', a: 'Always plan your stops with a 20% battery buffer so you have enough range to reach an alternative backup charger.' },
      { q: 'How long does a highway charge stop take?', a: 'A quick DC fast charge from 10% to 80% usually takes 35-50 minutes, which is perfect for a meal break.' }
    ],
    related: [
      { name: 'Fast vs Slow Charging Differences', url: '#/guide/guide-fast-vs-slow' },
      { name: 'Real-World Range Variables', url: '#/guide/guide-real-range' }
    ]
  },
  'real-range': {
    steps: [
      'Check your EV\'s claimed range (e.g. ARAI certified).',
      'Apply deductions for highway speed driving (above 90 km/h).',
      'Account for extreme temperatures (hot weather AC load).',
      'Keep tire pressures at recommended levels for optimal rolling resistance.'
    ],
    features: [
      'ARAI / WLTP laboratory certified range benchmarks.',
      'Aerodynamic drag coefficient effects at speed.',
      'Cabin climate control electrical consumption impact.'
    ],
    benefits: [
      'Provides accurate range predictions during long drives.',
      'Prevents getting stranded due to optimistic dashboard range displays.',
      'Optimizes driving style to stretch range in emergency situations.'
    ],
    faqs: [
      { q: 'Why is certified range so much higher than real range?', a: 'Certified tests are conducted in climate-controlled labs at slow speeds with no AC, which does not represent real-world driving conditions.' },
      { q: 'How much does speed affect EV range?', a: 'EV range drops significantly at high speeds. Driving at 110 km/h consumes about 25% more energy than driving at 80 km/h.' }
    ],
    related: [
      { name: 'EV Road Trip Planning Guide', url: '#/guide/guide-trip-planning' },
      { name: 'EV Battery Warranty & Lifespan', url: '#/guide/guide-battery-warranty' }
    ]
  },
  'guide-7': {
    steps: [
      'Verify the manufacturer battery warranty terms before purchasing.',
      'Monitor your State of Health (SOH) using the infotainment screen.',
      'Avoid regular fast charging to 100% to minimize capacity degradation.',
      'Ensure battery coolant levels are checked during periodic service.'
    ],
    features: [
      '8 Years / 1.6 Lakh KM: Standard long-term coverage standard in India.',
      'Active Cell Balancing: Automated software monitoring of individual cells.',
      'Degradation Protection: Guarantees at least 70-80% capacity retention.'
    ],
    benefits: [
      'Protects your vehicle resale value against battery capacity drops.',
      'Provides peace of mind for long-term ownership over a decade.',
      'Zero replacement costs for any manufacturing defect or cell failure.'
    ],
    faqs: [
      { q: 'What happens if battery health drops below 70% during warranty?', a: 'The manufacturer is legally obligated to repair or replace the battery pack free of charge.' },
      { q: 'Does fast charging void my battery warranty?', a: 'No, but regular usage of fast chargers can accelerate wear, so manufacturers recommend AC charging for daily use.' }
    ],
    related: [
      { name: 'Understanding Battery Health', url: '#/hub/battery-health' },
      { name: 'LFP vs NMC Battery Chemistry', url: '#/hub/lfp-nmc' }
    ]
  },
  'guide-8': {
    steps: [
      'Drive at a steady speed of 80-90 km/h on expressways.',
      'Utilize regenerative braking extensively in city traffic.',
      'Pre-cool the cabin while connected to an AC charger.',
      'Maintain correct tire pressures to minimize rolling resistance.'
    ],
    features: [
      'Driving Speed Impact: Wind resistance at 120 km/h reduces range heavily.',
      'Auxiliary Loads: AC cooling and heating deplete battery charge.',
      'Terrain Variables: Climbing slopes increases consumption, descending recovers it.'
    ],
    benefits: [
      'Allows accurate range predictions during long drives.',
      'Prevents getting stranded due to optimistic dashboard range displays.',
      'Helps you achieve maximum possible range on highway corridors.'
    ],
    faqs: [
      { q: 'Why is certified range so much higher than real range?', a: 'Certified tests are conducted in climate-controlled labs at slow speeds with no AC, which does not represent real-world driving conditions.' },
      { q: 'How much does speed affect EV range?', a: 'EV range drops significantly at high speeds. Driving at 110 km/h consumes about 25% more energy than driving at 80 km/h.' }
    ],
    related: [
      { name: 'Regenerative Braking Explained', url: '#/hub/regen-braking' },
      { name: 'EV Road Trip Planning', url: '#/guide/guide-trip-planning' }
    ]
  }
};

const GUIDE_HUB_IMAGES = {
  'guide-1': 'EV_BUYING_GUIDE/WHY_BUY_AN_EV.jpeg',
  'guide-2': 'EV_BUYING_GUIDE/CHARGING_EXPLAINED.jpeg',
  'guide-3': 'EV_BUYING_GUIDE/BATTERY_TECH.jpeg',
  'guide-4': 'EV_BUYING_GUIDE/GOVERNMENT_SUBSIDIES.jpeg',
  'guide-5': 'EV_BUYING_GUIDE/EV_MAINTENANCE.jpeg',
  'guide-6': 'EV_BUYING_GUIDE/RUNNING_COST.jpeg',
  'guide-7': 'everything_u_need/    BATTERY_WARRANTY.jpeg',
  'guide-8': 'everything_u_need/    REAL_WORLD_RANGE.jpeg',
  'home-charging': 'everything_u_need/CHARGING_AT_HOME.jpeg',
  'apartment-charging': 'everything_u_need/APARTMENT_CHARGING.jpeg',
  'fast-vs-slow': 'everything_u_need/FAST_VS_SLOW_CHARGING.jpeg',
  'battery-warranty': 'everything_u_need/    BATTERY_WARRANTY.jpeg',
  'subsidies': 'everything_u_need/    GOVERNMENT_SUBSIDIES.jpeg',
  'running-cost': 'everything_u_need/    RUNNING_COST.jpeg',
  'trip-planning': 'everything_u_need/    TRIP_PLANNING.jpeg',
  'real-range': 'everything_u_need/    REAL_WORLD_RANGE.jpeg',
  'regen-braking': 'Learn_Electric_Vehicles/REGENERATIVE_BRAKING copy.jpeg',
  'lfp-nmc': 'Learn_Electric_Vehicles/    LFP_VS_NMC_BATTERY copy.jpeg',
  'ac-dc': 'Learn_Electric_Vehicles/    AC_VS_DC_CHARGING copy.jpeg',
  'v2l': 'Learn_Electric_Vehicles/    VEHICLE_TO_LOAD_V2L copy.jpeg',
  'clearance': 'Learn_Electric_Vehicles/    GROUND_CLEARANCE copy.jpeg',
  'battery-health': 'Learn_Electric_Vehicles/    BATTERY_HEALTH copy.jpeg',
  'etiquette': 'Learn_Electric_Vehicles/    CHARGING_ETIQUETTE copy.jpeg',
  'highway': 'Learn_Electric_Vehicles/    HIGHWAY_CHARGING copy.jpeg'
};

function renderGuideArticlePage(chapter) {
  // Determine lookup ID
  const rawId = chapter.id;
  const baseId = rawId.startsWith('guide-') ? rawId.substring(6) : rawId;
  
  // Image Mapping
  const imageUrl = resolveImagePath(GUIDE_HUB_IMAGES[rawId] || GUIDE_HUB_IMAGES[baseId] || 'EV_BUYING_GUIDE/WHY_BUY_AN_EV.jpeg');

  const details = GUIDE_DETAILS_EXTENDED[rawId] || GUIDE_DETAILS_EXTENDED[baseId] || {
    steps: ['Check specifications', 'Understand vehicle system rules', 'Apply to daily use'],
    features: ['Technical diagnostics', 'System security guidelines'],
    benefits: ['Reduced operational costs', 'Longer components lifespan'],
    faqs: [
      { q: 'How is this guide structured?', a: 'This guide presents features, benefits, steps, and FAQs matching EV standards.' }
    ],
    related: []
  };

  const title = chapter.title;
  const breadcrumbs = ['RESOURCES', 'EV BUYING GUIDE', chapter.chapter.toUpperCase()];

  const guideMetadata = {
    'guide-1': { author: 'Rajesh Kumar, EV Specialist', date: 'July 1, 2026', readTime: '4 min read' },
    'guide-2': { author: 'Amit Patel, Battery Engineer', date: 'June 28, 2026', readTime: '5 min read' },
    'guide-3': { author: 'Dr. Sunita Sen, Materials Scientist', date: 'June 25, 2026', readTime: '6 min read' },
    'guide-4': { author: 'Vikram Singh, Policy Analyst', date: 'July 2, 2026', readTime: '5 min read' },
    'guide-5': { author: 'Sanjay Dutt, EV Service Head', date: 'June 30, 2026', readTime: '4 min read' },
    'guide-6': { author: 'Nisha Mehta, Financial Advisor', date: 'July 3, 2026', readTime: '4 min read' },
    'guide-7': { author: 'Rohan Sharma, Technical Director', date: 'July 2, 2026', readTime: '5 min read' },
    'guide-8': { author: 'Priyanka Sen, EV Range Expert', date: 'July 4, 2026', readTime: '5 min read' }
  };
  const meta = guideMetadata[rawId] || guideMetadata[baseId] || { author: 'EV Editorial Team', date: 'July 4, 2026', readTime: '5 min read' };

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

  let stepsHtml = '';
  details.steps.forEach((step, idx) => {
    stepsHtml += `
      <div class="flex gap-4 items-start border-l-2 border-zinc-200 pl-4 py-2 relative">
        <div class="absolute -left-[6px] top-4 w-2.5 h-2.5 rounded-full bg-black border-2 border-white"></div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] text-zinc-400 font-mono font-bold uppercase">STEP 0${idx + 1}</span>
          <p class="text-xs text-zinc-800 leading-relaxed font-mono">${step}</p>
        </div>
      </div>
    `;
  });

  let faqsHtml = '';
  details.faqs.forEach((faq, idx) => {
    faqsHtml += `
      <div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden">
        <button class="w-full px-5 py-4 flex justify-between items-center text-left font-mono text-xs uppercase tracking-wider text-black hover:text-black transition-colors focus:outline-none accordion-trigger">
          <span>${faq.q}</span>
          <span class="acc-icon text-zinc-400 font-mono">+</span>
        </button>
        <div class="accordion-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
          <p class="px-5 pb-5 text-[11px] text-zinc-655 leading-relaxed pt-2 border-t border-zinc-100 font-mono">
            ${faq.a}
          </p>
        </div>
      </div>
    `;
  });

  let relatedHtml = '';
  if (details.related && details.related.length > 0) {
    relatedHtml = `
      <div class="mt-8 border-t border-zinc-150 pt-6">
        <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold block mb-3">RELATED EV ARTICLES & RECOMMENDATIONS</span>
        <div class="flex flex-col gap-2">
          ${details.related.map(r => `
            <a href="${r.url}" class="text-zinc-655 hover:text-black text-xs font-mono flex items-center gap-1.5 transition-colors self-start">
              <span>🗎</span>
              <span class="underline">${r.name}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  let termsHtml = '';
  if (chapter.terms && chapter.terms.length > 0) {
    chapter.terms.forEach(term => {
      termsHtml += `
        <div class="border border-zinc-200 bg-zinc-50 p-6 flex flex-col gap-4 shadow-sm my-4 text-left rounded-xl">
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
    <div class="max-w-6xl mx-auto pt-6 text-left font-mono" id="guide-article-root">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Sticky TOC Sidebar -->
        <aside class="hidden lg:block lg:col-span-3 h-fit sticky top-28 select-none">
          <div class="border-l border-zinc-200 pl-6 py-2">
            <h4 class="text-[10px] uppercase font-mono tracking-widest text-zinc-450 mb-6 font-bold">Table of Contents</h4>
            <ul class="flex flex-col gap-3 text-xs text-zinc-500">
              <li class="hover:text-black transition-colors"><a href="#overview" class="toc-link-scroll">1. Overview</a></li>
              <li class="hover:text-black transition-colors"><a href="#key-features" class="toc-link-scroll">2. Key Features</a></li>
              <li class="hover:text-black transition-colors"><a href="#implementation" class="toc-link-scroll">3. Implementation Steps</a></li>
              <li class="hover:text-black transition-colors"><a href="#benefits" class="toc-link-scroll">4. Major Benefits</a></li>
              <li class="hover:text-black transition-colors"><a href="#faqs" class="toc-link-scroll">5. FAQs</a></li>
            </ul>
          </div>
        </aside>

        <!-- Main Column -->
        <main class="lg:col-span-9 flex flex-col gap-6">
          <!-- 1. Large hero image -->
          <div class="w-full aspect-[16/9] border border-zinc-200 bg-zinc-50 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
            <img src="${imageUrl}" alt="${chapter.title}" class="w-full h-full object-cover">
          </div>

          <!-- 2. Title & Metadata -->
          <div>
            <span class="text-[9px] text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2 block mb-2">${chapter.chapter.toUpperCase()} // RESOURCE</span>
            <h1 class="text-2xl md:text-4xl font-black text-black leading-tight uppercase mb-4">${chapter.title}</h1>
            
            <div class="flex items-center gap-3 border-y border-zinc-200 py-3 mb-4 select-none">
              <div class="w-8 h-8 rounded-full bg-zinc-100 text-black flex items-center justify-center font-bold font-mono text-xs border border-zinc-200">
                ${meta.author.charAt(0)}
              </div>
              <div class="text-left font-mono">
                <p class="text-[10px] font-bold text-black">${meta.author}</p>
                <div class="flex gap-2 text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">
                  <span>${meta.date}</span>
                  <span>•</span>
                  <span>${meta.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Description -->
          <div id="overview" class="flex flex-col gap-4 scroll-mt-24">
            <p class="text-sm leading-relaxed text-zinc-700 font-semibold border-l-2 border-black pl-4 my-1">${chapter.summary}</p>
            <p class="text-sm leading-relaxed text-black">${chapter.content}</p>
          </div>

          <!-- 4. Key Features -->
          <div id="key-features" class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Key Features</h4>
            <ul class="flex flex-col gap-2.5">
              ${featuresHtml}
            </ul>
          </div>

          <!-- 5. Step-by-Step Implementation -->
          <div id="implementation" class="flex flex-col gap-6 scroll-mt-24">
            <div class="my-2">
              <h4 class="font-bold text-xs uppercase tracking-wider text-black mb-4">Step-by-Step Implementation</h4>
              <div class="flex flex-col gap-3 ml-2">
                ${stepsHtml}
              </div>
            </div>
            ${termsHtml}
          </div>

          <!-- 6. Benefits -->
          <div id="benefits" class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Major Benefits</h4>
            <ul class="flex flex-col gap-2.5">
              ${benefitsHtml}
            </ul>
          </div>

          <!-- 7. FAQs -->
          <div id="faqs" class="my-4 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black mb-4">Frequently Asked Questions</h4>
            <div class="flex flex-col gap-3">
              ${faqsHtml}
            </div>
          </div>

          <!-- 8. Related articles -->
          ${relatedHtml}
        </main>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  bindLocalAccordions('guide-article-root');

  // Bind TOC smooth scroll
  document.querySelectorAll('#guide-article-root .toc-link-scroll').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

function renderHubArticlePage(key) {
  const data = hubExplanations[key];
  if (!data) {
    navigateTo('/');
    return;
  }
  
  const title = data.title;
  const breadcrumbs = ['RESOURCES', 'KNOWLEDGE HUB', title.toUpperCase()];
  
  // Image Mapping
  const imageUrl = resolveImagePath(GUIDE_HUB_IMAGES[key] || 'Learn_Electric_Vehicles/    REGENERATIVE_BRAKING copy.jpeg');

  // Fetch from details database (which maps to GUIDE_DETAILS_EXTENDED for consistency)
  const details = GUIDE_DETAILS_EXTENDED[key] || {
    features: ['Technical insights', 'Detailed systems layout', 'Safety protocols'],
    benefits: ['Optimized energy usage', 'Extended battery life', 'Lower operational costs'],
    steps: ['Check parameters', 'Monitor state', 'Maximize performance'],
    faqs: [
      { q: 'How does this technology work?', a: 'It utilizes state-of-the-art EV principles to deliver efficient, silent, and sustainable performance.' },
      { q: 'Is it standard on all vehicles?', a: 'Most modern electric vehicles implement this feature to varying degrees depending on class and price.' }
    ],
    related: []
  };

  const hubMetadata = {
    'regen-braking': { author: 'Vikram Singh, Tech Lead', date: 'June 24, 2026', readTime: '4 min read' },
    'lfp-nmc': { author: 'Dr. Sunita Sen, Battery Scientist', date: 'June 25, 2026', readTime: '6 min read' },
    'ac-dc': { author: 'Amit Patel, Electrical Engineer', date: 'June 26, 2026', readTime: '5 min read' },
    'v2l': { author: 'Rajesh Kumar, EV Innovator', date: 'June 27, 2026', readTime: '4 min read' },
    'clearance': { author: 'Rohan Sharma, Chassis Designer', date: 'June 28, 2026', readTime: '4 min read' },
    'battery-health': { author: 'Sanjay Dutt, Service Manager', date: 'June 29, 2026', readTime: '5 min read' },
    'etiquette': { author: 'Nisha Mehta, Community Lead', date: 'June 30, 2026', readTime: '3 min read' },
    'highway': { author: 'Priyanka Sen, Roadtrip Veteran', date: 'July 1, 2026', readTime: '5 min read' }
  };
  const meta = hubMetadata[key] || { author: 'EV Editorial Team', date: 'July 4, 2026', readTime: '5 min read' };

  // Generate recommendations lists dynamically based on what was defined in our mapper
  const recommendationsMap = {
    'regen-braking': [
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' },
      { name: 'Vehicle-to-Load (V2L) Technology', url: '#/hub/v2l' }
    ],
    'lfp-nmc': [
      { name: 'Understanding Battery Health', url: '#/hub/battery-health' },
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' }
    ],
    'ac-dc': [
      { name: 'Understanding Battery Health', url: '#/hub/battery-health' },
      { name: 'Highway Charging Strategies', url: '#/hub/highway' }
    ],
    'v2l': [
      { name: 'Regenerative Braking', url: '#/hub/regen-braking' },
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' }
    ],
    'clearance': [
      { name: 'Understanding Battery Health', url: '#/hub/battery-health' },
      { name: 'Public EV Charging Etiquette', url: '#/hub/etiquette' }
    ],
    'battery-health': [
      { name: 'LFP vs NMC Battery Chemistry', url: '#/hub/lfp-nmc' },
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' }
    ],
    'etiquette': [
      { name: 'Highway Charging Strategies', url: '#/hub/highway' },
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' }
    ],
    'highway': [
      { name: 'Public EV Charging Etiquette', url: '#/hub/etiquette' },
      { name: 'AC vs DC Charging Standards', url: '#/hub/ac-dc' }
    ]
  };

  const related = recommendationsMap[key] || [];

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

  let stepsHtml = '';
  details.steps.forEach((step, idx) => {
    stepsHtml += `
      <div class="flex gap-4 items-start border-l-2 border-zinc-200 pl-4 py-2 relative">
        <div class="absolute -left-[6px] top-4 w-2.5 h-2.5 rounded-full bg-black border-2 border-white"></div>
        <div class="flex flex-col gap-0.5">
          <span class="text-[9px] text-zinc-400 font-mono font-bold uppercase">STEP 0${idx + 1}</span>
          <p class="text-xs text-zinc-800 leading-relaxed font-mono">${step}</p>
        </div>
      </div>
    `;
  });

  let faqsHtml = '';
  details.faqs.forEach((faq, idx) => {
    faqsHtml += `
      <div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden">
        <button class="w-full px-5 py-4 flex justify-between items-center text-left font-mono text-xs uppercase tracking-wider text-black hover:text-black transition-colors focus:outline-none accordion-trigger">
          <span>${faq.q}</span>
          <span class="acc-icon text-zinc-400 font-mono">+</span>
        </button>
        <div class="accordion-content max-h-0 overflow-hidden transition-all duration-300 ease-in-out">
          <p class="px-5 pb-5 text-[11px] text-zinc-655 leading-relaxed pt-2 border-t border-zinc-100 font-mono">
            ${faq.a}
          </p>
        </div>
      </div>
    `;
  });

  let relatedHtml = '';
  if (related && related.length > 0) {
    relatedHtml = `
      <div class="mt-8 border-t border-zinc-150 pt-6">
        <span class="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold block mb-3">RELATED EV ARTICLES & RECOMMENDATIONS</span>
        <div class="flex flex-col gap-2">
          ${related.map(r => `
            <a href="${r.url}" class="text-zinc-655 hover:text-black text-xs font-mono flex items-center gap-1.5 transition-colors self-start">
              <span>🗎</span>
              <span class="underline">${r.name}</span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  }

  const contentHtml = `
    <div class="max-w-6xl mx-auto pt-6 text-left font-mono" id="hub-article-root">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Sticky TOC Sidebar -->
        <aside class="hidden lg:block lg:col-span-3 h-fit sticky top-28 select-none">
          <div class="border-l border-zinc-200 pl-6 py-2">
            <h4 class="text-[10px] uppercase font-mono tracking-widest text-zinc-450 mb-6 font-bold">Table of Contents</h4>
            <ul class="flex flex-col gap-3 text-xs text-zinc-500">
              <li class="hover:text-black transition-colors"><a href="#overview" class="toc-link-scroll">1. Technical Overview</a></li>
              <li class="hover:text-black transition-colors"><a href="#key-features" class="toc-link-scroll">2. Key Features</a></li>
              <li class="hover:text-black transition-colors"><a href="#implementation" class="toc-link-scroll">3. Implementation Steps</a></li>
              <li class="hover:text-black transition-colors"><a href="#benefits" class="toc-link-scroll">4. Major Benefits</a></li>
              <li class="hover:text-black transition-colors"><a href="#faqs" class="toc-link-scroll">5. FAQs</a></li>
            </ul>
          </div>
        </aside>

        <!-- Main Column -->
        <main class="lg:col-span-9 flex flex-col gap-6">
          <!-- 1. Large hero image -->
          <div class="w-full aspect-[16/9] border border-zinc-200 bg-zinc-50 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
            <img src="${imageUrl}" alt="${data.title}" class="w-full h-full object-cover">
          </div>

          <!-- 2. Title & Metadata -->
          <div>
            <span class="text-[9px] text-zinc-400 uppercase tracking-widest border-b border-zinc-150 pb-2 block mb-2">KNOWLEDGE HUB // ARTICLE</span>
            <h1 class="text-2xl md:text-4xl font-black text-black leading-tight uppercase mb-4">${data.title}</h1>
            
            <div class="flex items-center gap-3 border-y border-zinc-200 py-3 mb-4 select-none">
              <div class="w-8 h-8 rounded-full bg-zinc-100 text-black flex items-center justify-center font-bold font-mono text-xs border border-zinc-200">
                ${meta.author.charAt(0)}
              </div>
              <div class="text-left font-mono">
                <p class="text-[10px] font-bold text-black">${meta.author}</p>
                <div class="flex gap-2 text-[8px] text-zinc-400 uppercase tracking-widest mt-0.5">
                  <span>${meta.date}</span>
                  <span>•</span>
                  <span>${meta.readTime}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. Overview -->
          <div id="overview" class="flex flex-col gap-6 scroll-mt-24">
            <div>
              <span class="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Technical Overview:</span>
              <p class="text-sm leading-relaxed text-black">${data.explanation}</p>
            </div>
            
            <div class="border-l-2 border-black pl-4 my-2 bg-zinc-50/50 py-3 pr-2">
              <span class="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block mb-1">Everyday Analogy:</span>
              <p class="text-xs leading-relaxed text-zinc-700 italic font-medium">${data.analogy}</p>
            </div>
          </div>

          <!-- 4. Key Features -->
          <div id="key-features" class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Key Features</h4>
            <ul class="flex flex-col gap-2.5">
              ${featuresHtml}
            </ul>
          </div>

          <!-- 5. Step-by-Step Implementation -->
          <div id="implementation" class="my-2 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black mb-4">Step-by-Step Implementation</h4>
            <div class="flex flex-col gap-3 ml-2">
              ${stepsHtml}
            </div>
          </div>

          <!-- 6. Benefits -->
          <div id="benefits" class="border border-zinc-200 p-5 rounded-2xl bg-white shadow-sm flex flex-col gap-3 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black border-b border-zinc-200 pb-2">Major Benefits</h4>
            <ul class="flex flex-col gap-2.5">
              ${benefitsHtml}
            </ul>
          </div>

          <!-- 7. FAQs -->
          <div id="faqs" class="my-4 scroll-mt-24">
            <h4 class="font-bold text-xs uppercase tracking-wider text-black mb-4">Frequently Asked Questions</h4>
            <div class="flex flex-col gap-3">
              ${faqsHtml}
            </div>
          </div>

          <!-- 8. Related articles -->
          ${relatedHtml}
        </main>
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  bindLocalAccordions('hub-article-root');

  // Bind TOC smooth scroll
  document.querySelectorAll('#hub-article-root .toc-link-scroll').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

const bindLocalAccordions = (containerId) => {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const icon = trigger.querySelector('.acc-icon');
      
      // Close other panels in this container
      container.querySelectorAll('.accordion-content').forEach(c => {
        if (c !== content) {
          c.style.maxHeight = null;
          const oIcon = c.parentElement.querySelector('.acc-icon');
          if (oIcon) oIcon.textContent = '+';
        }
      });
      
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
        if (icon) icon.textContent = '+';
      } else {
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.textContent = '-';
      }
    });
  });
};

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
            <img src="${resolveImagePath(c.image)}" alt="${c.name}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105">
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
            <img src="${resolveImagePath(img)}" class="w-full h-full object-contain">
          </button>
        `;
      });
      
      gallerySlideshowHtml = `
        <div class="flex flex-col gap-3 w-full">
          <div class="relative w-full h-[260px] md:h-[380px] bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden select-none shadow-[inset_0_0_20px_rgba(0,0,0,0.015)]">
            <img id="detail-main-img" src="${resolveImagePath(images[0])}" class="w-full h-full object-contain p-4 transition-all duration-300">
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
          <img src="${resolveImagePath(car.image)}" class="w-full h-full object-contain p-4">
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
                <button id="detail-compare-btn" class="py-9 px-15 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors uppercase text-center">
                  COMPARE CAR
                </button>
                <button id="detail-wishlist-btn" class="py-9 px-15 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors uppercase text-center flex items-center justify-center gap-1.5">
                  <svg viewBox="0 0 24 24" class="w-3.5 h-3.5 ${wishlistIds.includes(car.id) ? 'fill-current' : ''}">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                  <span>WISHLIST</span>
                </button>
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

  var selectedACUsage = null;
  var selectedDrivingStyle = null;

  // Toggle group — AC
  if (acGroup) {
    acGroup.querySelectorAll('.trip-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        acGroup.querySelectorAll('.trip-toggle-btn').forEach(function(b) { b.classList.remove('trip-active'); });
        this.classList.add('trip-active');
        selectedACUsage = this.getAttribute('data-value');
      });
    });
  }

  // Toggle group — Driving Style
  if (styleGroup) {
    styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(b) { b.classList.remove('trip-active'); });
        this.classList.add('trip-active');
        selectedDrivingStyle = this.getAttribute('data-value');
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

    if (!selectedACUsage || !selectedDrivingStyle) {
      var origHTML = planBtn.innerHTML;
      planBtn.textContent = 'Please select AC & Driving Style!';
      setTimeout(function() { planBtn.innerHTML = origHTML; }, 2200);
      return;
    }

    var acUsage      = selectedACUsage;
    var drivingStyle = selectedDrivingStyle;

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

function updateDividerPositions() {
  const viewportHeight = window.innerHeight;

  scrollDividers.forEach(div => {
    if (!div.element) return;
    const dividerRect = div.element.getBoundingClientRect();
    
    const nextSection = div.element.nextElementSibling;
    const heading = nextSection ? nextSection.querySelector('h2') : null;
    
    let H = 150; // default height difference
    let headingTop = dividerRect.top + H;
    
    if (heading) {
      const headingRect = heading.getBoundingClientRect();
      headingTop = headingRect.top;
      H = Math.max(0, headingRect.top - dividerRect.top);
    }
    
    const startHeadingTop = viewportHeight + H;
    const endHeadingTop = viewportHeight * 0.5;
    const travelDistance = startHeadingTop - endHeadingTop;
    
    let progress = 0;
    if (headingTop <= startHeadingTop) {
      if (headingTop <= endHeadingTop) {
        progress = 1;
      } else {
        const raw = (startHeadingTop - headingTop) / travelDistance;
        // Premium Apple-like easing (easeOutQuart: 1 - (1-x)^4)
        progress = 1 - Math.pow(1 - raw, 4);
      }
    } else {
      progress = 0;
    }
    
    const beforeVal = `calc(-100% * (1 - ${progress.toFixed(4)}))`;
    const afterVal = `calc(100% * (1 - ${progress.toFixed(4)}))`;
    div.element.style.setProperty('--divider-translate-x-before', beforeVal);
    div.element.style.setProperty('--divider-translate-x-after', afterVal);
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
          <img src="${resolveImagePath(car.image || 'tata_nexon_ev_1782477217305.png')}" alt="${car.name}" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105">
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
  // Use event delegation for both .btn-read-guide and .btn-open-hub
  document.addEventListener('click', (e) => {
    const hubCard = e.target.closest('.btn-open-hub');
    if (hubCard) {
      e.preventDefault();
      const hubKey = hubCard.getAttribute('data-hub-key');
      navigateTo('/hub/' + hubKey);
      return;
    }

    const guideBtn = e.target.closest('.btn-read-guide');
    if (guideBtn) {
      e.preventDefault();
      const guideId = guideBtn.getAttribute('data-guide-id');
      navigateTo('/guide/guide-' + guideId);
      return;
    }
  });
}

function initRevealObservers() {
  // Observers for reveal-on-scroll elements
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        entry.target.classList.add('revealed');
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
  'maruti-suzuki': 'Maruti-Suzuki',
  'toyota': 'Toyota',
  'honda': 'Honda',
  'skoda': 'Skoda',
  'volkswagen': 'Volkswagen',
  'renault': 'Renault',
  'nissan': 'Nissan',
  'citroen': 'Citroën',
  'jeep': 'Jeep',
  'isuzu': 'Isuzu',
  'porsche': 'Porsche',
  'vinfast': 'VinFast',
  'tesla': 'Tesla',
  'jaguar': 'Jaguar',
  'range-rover': 'Range Rover',
  'lexus': 'Lexus',
};

function renderBrandPage(brandId) {
  const brandName = brandNameMap[brandId.toLowerCase()] || brandId.toUpperCase();
  const breadcrumbs = ['MANUFACTURERS', brandName];
  
  let searchQuery = '';
  let sortBy = 'name-asc';
  let typeFilter = 'all';

  async function generateBrandContentHtml() {
    const brandCars = await BrandDataService.getVehiclesByBrand(brandId);
    const logoUrl = getBrandLogoUrl(brandId);
    const logoHtml = logoUrl ? 
      `<img src="${resolveImagePath(logoUrl)}" class="w-full h-full object-contain" alt="${brandName} Logo">` :
      `<span class="text-zinc-400 font-bold text-2xl font-mono">${brandName.charAt(0)}</span>`;



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
          
          <div class="border border-zinc-800 bg-white p-4 flex items-center justify-center w-24 h-24 rounded-lg">
            ${logoHtml}
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

  async function render() {
    const contentHtml = await generateBrandContentHtml();
    
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

  async function updateBrandListOnly() {
    const container = document.getElementById('brand-vehicles-container');
    if (container) {
      const brandCars = await BrandDataService.getVehiclesByBrand(brandId);
      
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

// --- Brands Directory Module ---
// --- Brands Directory Module ---

const BrandDataService = {
  async getVehiclesByBrand(brandId) {
    return EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
  },
  getBrandInfo(brandId) {
    return {
      id: brandId,
      name: brandNameMap[brandId.toLowerCase()] || brandId.toUpperCase(),
      logoUrl: getBrandLogoUrl(brandId)
    };
  }
};

function getBrandLogoUrl(brandId) {
  const localLogos = {
    'tata': './LOGOS/TATA_LOGO.jpeg',
    'mahindra': './LOGOS/MAHINDRA_LOGO.jpeg',
    'mg': './LOGOS/MG_LOGO.jpeg',
    'hyundai': './LOGOS/HYUNDAI_LOGO.jpeg',
    'kia': './LOGOS/KIA_LOGO.jpeg',
    'byd': './LOGOS/BYD_LOGO.jpeg',
    'citroen': './LOGOS/CITROEN_LOGO.jpg',
    'bmw': './LOGOS/BMW_LOGO.jpeg',
    'mercedes-benz': './LOGOS/MERCEDES_LOGO.jpeg',
    'audi': './LOGOS/AUDI_LOGO.jpeg',
    'volvo': './LOGOS/volvo_logo.jpeg',
    'maruti-suzuki': './LOGOS/maruti_suzuki_logo.jpeg',
    'toyota': './LOGOS/TOYOTA_LOGO.jpeg',
    'nissan': './LOGOS/nissan_logo.jpeg',
    'skoda': './LOGOS/SKODA_LOGO.jpeg',
    'volkswagen': './LOGOS/VOLKSWAGEN_LOGO.jpeg',
    'renault': './LOGOS/RENAULT_LOGO.jpeg',
    'vinfast': './LOGOS/VINFAST_LOGO.jpeg',
    'jeep': './LOGOS/jeep_logo.jpeg',
    'force-motors': './LOGOS/force_logo.jpeg',
    'isuzu': './LOGOS/isuzu_logo.jpeg'
  };
  
  return localLogos[brandId.toLowerCase()] || '';
}

function getCarCategory(car) {
  const name = car.name.toLowerCase();
  const id = car.id.toLowerCase();
  if (id.includes('seal') || id.includes('i4') || id.includes('i7') || id.includes('eqs') || id.includes('etron') || id.includes('ioniq6')) {
    return 'Sedan';
  }
  if (id.includes('comet') || id.includes('tiago') || id.includes('vf3')) {
    return 'Hatchback';
  }
  return 'SUV';
}

function renderBrandsPage() {
  const title = 'Electric Vehicle Brands';
  const breadcrumbs = ['MANUFACTURERS', 'ALL BRANDS'];
  
  if (!window.brandsFilterState) {
    window.brandsFilterState = {
      search: '',
      origin: 'all',
      category: 'all',
      budget: 'all',
      battery: 'all',
      range: 'all',
      charging: 'all',
      seating: 'all',
      availability: 'all',
      isSearchActive: false
    };
  }
  
  const state = window.brandsFilterState;
  
  function getFilteredBrands() {
    return SUPPORTED_BRANDS.filter(brand => {
      // 1. Search brand name
      if (state.search && !brand.name.toLowerCase().includes(state.search.toLowerCase())) {
        return false;
      }
      // 2. Origin
      if (state.origin !== 'all' && brand.origin !== state.origin) {
        return false;
      }
      
      // 3. Vehicle level filters
      const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brand.id.toLowerCase());
      const hasVehicleFilter = state.category !== 'all' || state.budget !== 'all' || 
                               state.battery !== 'all' || state.range !== 'all' || 
                               state.charging !== 'all' || state.seating !== 'all' || 
                               state.availability !== 'all';
                               
      if (hasVehicleFilter) {
        if (brandCars.length === 0) return false;
        return brandCars.some(car => {
          // Category
          if (state.category !== 'all') {
            const cat = getCarCategory(car);
            if (state.category !== cat) return false;
          }
          // Budget
          if (state.budget !== 'all') {
            const price = car.priceVal;
            if (state.budget === 'under-15' && price >= 15) return false;
            if (state.budget === '15-30' && (price < 15 || price > 30)) return false;
            if (state.budget === '30-50' && (price < 30 || price > 50)) return false;
            if (state.budget === 'above-50' && price <= 50) return false;
          }
          // Battery
          if (state.battery !== 'all') {
            const size = parseFloat(car.battery);
            if (state.battery === 'small' && size >= 30) return false;
            if (state.battery === 'medium' && (size < 30 || size > 60)) return false;
            if (state.battery === 'large' && size <= 60) return false;
          }
          // Range
          if (state.range !== 'all') {
            const range = car.rangeVal;
            if (state.range === 'under-300' && range >= 300) return false;
            if (state.range === '300-500' && (range < 300 || range > 500)) return false;
            if (state.range === 'above-500' && range <= 500) return false;
          }
          // Fast Charging
          if (state.charging !== 'all') {
            const dcTime = parseInt(car.charging) || 60;
            if (state.charging === 'fast' && dcTime >= 45) return false;
            if (state.charging === 'very-fast' && dcTime >= 30) return false;
          }
          // Seating
          if (state.seating !== 'all') {
            const seats = car.seating || '5 Seater';
            if (state.seating === '4' && !seats.includes('4') && !car.id.includes('comet')) return false;
            if (state.seating === '5' && !seats.includes('5')) return false;
            if (state.seating === '6-7' && !seats.includes('6') && !seats.includes('7') && !car.id.includes('ev9')) return false;
          }
          // Availability
          if (state.availability !== 'all') {
            const isUpcoming = car.sections && car.sections.includes('upcoming');
            if (state.availability === 'available' && isUpcoming) return false;
            if (state.availability === 'upcoming' && !isUpcoming) return false;
          }
          return true;
        });
      }
      return true;
    });
  }

  function getMatchingVehicles() {
    return EV_DATABASE.filter(car => {
      // 1. Search brand name or model name
      if (state.search) {
        const query = state.search.toLowerCase();
        const brandMatch = car.brand.toLowerCase().includes(query) || car.name.toLowerCase().includes(query);
        const fullBrandName = (brandNameMap[car.brand.toLowerCase()] || '').toLowerCase();
        const fullBrandMatch = fullBrandName.includes(query);
        if (!brandMatch && !fullBrandMatch) return false;
      }
      // 2. Origin
      if (state.origin !== 'all') {
        const brandObj = SUPPORTED_BRANDS.find(b => b.id.toLowerCase() === car.brand.toLowerCase()) || 
                         INTERNATIONAL_BRANDS.find(b => b.id.toLowerCase() === car.brand.toLowerCase());
        const origin = brandObj ? brandObj.origin : 'International';
        if (state.origin !== origin) return false;
      }
      // 3. Category
      if (state.category !== 'all') {
        const cat = getCarCategory(car);
        if (state.category !== cat) return false;
      }
      // 4. Budget
      if (state.budget !== 'all') {
        const price = car.priceVal;
        if (state.budget === 'under-15' && price >= 15) return false;
        if (state.budget === '15-30' && (price < 15 || price > 30)) return false;
        if (state.budget === '30-50' && (price < 30 || price > 50)) return false;
        if (state.budget === 'above-50' && price <= 50) return false;
      }
      // 5. Battery
      if (state.battery !== 'all') {
        const size = parseFloat(car.battery);
        if (state.battery === 'small' && size >= 30) return false;
        if (state.battery === 'medium' && (size < 30 || size > 60)) return false;
        if (state.battery === 'large' && size <= 60) return false;
      }
      // 6. Range
      if (state.range !== 'all') {
        const range = car.rangeVal;
        if (state.range === 'under-300' && range >= 300) return false;
        if (state.range === '300-500' && (range < 300 || range > 500)) return false;
        if (state.range === 'above-500' && range <= 500) return false;
      }
      // 7. Fast Charging
      if (state.charging !== 'all') {
        const dcTime = parseInt(car.charging) || 60;
        if (state.charging === 'fast' && dcTime >= 45) return false;
        if (state.charging === 'very-fast' && dcTime >= 30) return false;
      }
      // 8. Seating
      if (state.seating !== 'all') {
        const seats = car.seating || '5 Seater';
        if (state.seating === '4' && !seats.includes('4') && !car.id.includes('comet')) return false;
        if (state.seating === '5' && !seats.includes('5')) return false;
        if (state.seating === '6-7' && !seats.includes('6') && !seats.includes('7') && !car.id.includes('ev9')) return false;
      }
      // 9. Availability
      if (state.availability !== 'all') {
        const isUpcoming = car.sections && car.sections.includes('upcoming');
        if (state.availability === 'available' && isUpcoming) return false;
        if (state.availability === 'upcoming' && !isUpcoming) return false;
      }
      return true;
    });
  }

  function render() {
    const allDropdownBrands = [
      ...SUPPORTED_BRANDS,
      ...INTERNATIONAL_BRANDS.filter(ib => !SUPPORTED_BRANDS.some(sb => sb.id === ib.id))
    ].sort((a, b) => a.name.localeCompare(b.name));

    // Dynamic brand listing or search result grid
    let resultsSectionHtml = '';

    if (state.isSearchActive) {
      const matchingVehicles = getMatchingVehicles();
      let vehiclesGridHtml = '';
      if (matchingVehicles.length > 0) {
        matchingVehicles.forEach(car => {
          vehiclesGridHtml += createCarCardHtml(car, 'w-full');
        });
        resultsSectionHtml = `
          <div class="mt-8 text-left">
            <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SEARCH RESULTS / ${matchingVehicles.length} VEHICLES FOUND</span>
            <h3 class="text-lg font-bold uppercase tracking-wide text-black mt-1 mb-6">Matching Vehicles</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              ${vehiclesGridHtml}
            </div>
          </div>
        `;
      } else {
        resultsSectionHtml = `
          <div class="py-24 text-center font-mono text-xs text-zinc-500 uppercase tracking-widest border border-zinc-200 bg-zinc-50 rounded-2xl mt-8">
            No electric vehicles match your search criteria. Please try relaxing your filters.
          </div>
        `;
      }
    } else {
      const filteredBrands = getFilteredBrands();
      let brandsGridHtml = '';
      if (filteredBrands.length > 0) {
        filteredBrands.forEach(b => {
          brandsGridHtml += `
            <button class="brand-card border border-zinc-200 hover:border-black bg-white font-mono text-[9px] tracking-wider uppercase transition-all text-zinc-700 hover:text-black shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-1.5 h-20" data-brand="${b.id}">
              <img src="${resolveImagePath(getBrandLogoUrl(b.id))}" class="w-8 h-8 object-contain" alt="${b.name} Logo">
              <span>${b.name}</span>
            </button>
          `;
        });
      } else {
        brandsGridHtml = `<div class="col-span-full py-12 text-center text-zinc-400 font-mono text-xs">NO NATIONAL PRESENCE BRANDS FOUND</div>`;
      }

      resultsSectionHtml = `
        <!-- Supported Brands Section -->
        <div class="mt-8 text-left">
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">NATIONAL PRESENCE / ${filteredBrands.length} BRANDS</span>
          <h3 class="text-lg font-bold uppercase tracking-wide text-black mt-1 mb-4">Supported Brands</h3>
          <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            ${brandsGridHtml}
          </div>
        </div>

        <!-- International Brands Section -->
        <div class="mt-8 border-t border-zinc-150 pt-8 text-left">
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">GLOBAL MANUFACTURERS</span>
          <h3 class="text-lg font-bold uppercase tracking-wide text-black mt-1 mb-4">International Brands</h3>
          <div class="flex flex-wrap gap-2.5">
            ${INTERNATIONAL_BRANDS.map(b => `
              <button class="brand-pill-btn px-4 py-2 border border-zinc-200 hover:border-black bg-white font-mono text-[9.5px] tracking-wider uppercase transition-all text-zinc-700 hover:text-black rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.01)]" data-brand="${b.id}">
                ${b.name}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    const contentHtml = `
      <div class="flex flex-col gap-6 pt-6">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">DIRECTORY / ${SUPPORTED_BRANDS.length + INTERNATIONAL_BRANDS.length - 1} MANUFACTURERS</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">EV Brands Directory</h2>
        </div>
        
        <!-- Filters Panel -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-zinc-50 p-6 border border-zinc-200 rounded-2xl font-mono text-xs">
          <!-- Search -->
          <div class="flex flex-col gap-1.5 relative" id="brands-search-wrapper">
            <label class="text-[9px] text-zinc-500 uppercase">Search Brand</label>
            <input type="text" id="brands-search" value="${state.search}" placeholder="Search brand name..." autocomplete="off" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg w-full cursor-pointer">
            <div id="brands-search-dropdown" class="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-50 hidden max-h-52 overflow-y-auto">
              ${allDropdownBrands.map(b => `<div class="brands-dropdown-item px-3 py-2 font-mono text-xs text-zinc-700 hover:bg-zinc-50 hover:text-black cursor-pointer transition-colors" data-brand-id="${b.id}" data-brand-name="${b.name}">${b.name}</div>`).join('')}
            </div>
          </div>
          <!-- Origin -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Origin</label>
            <select id="brands-origin" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.origin === 'all' ? 'selected' : ''}>All Origins</option>
              <option value="Indian" ${state.origin === 'Indian' ? 'selected' : ''}>Indian Presence</option>
              <option value="International" ${state.origin === 'International' ? 'selected' : ''}>International Only</option>
            </select>
          </div>
          <!-- Category -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Vehicle Category</label>
            <select id="brands-category" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.category === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="Hatchback" ${state.category === 'Hatchback' ? 'selected' : ''}>Hatchback</option>
              <option value="Sedan" ${state.category === 'Sedan' ? 'selected' : ''}>Sedan</option>
              <option value="SUV" ${state.category === 'SUV' ? 'selected' : ''}>SUV</option>
            </select>
          </div>
          <!-- Budget -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Budget</label>
            <select id="brands-budget" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.budget === 'all' ? 'selected' : ''}>Any Budget</option>
              <option value="under-15" ${state.budget === 'under-15' ? 'selected' : ''}>Under 15 Lakh</option>
              <option value="15-30" ${state.budget === '15-30' ? 'selected' : ''}>15 - 30 Lakh</option>
              <option value="30-50" ${state.budget === '30-50' ? 'selected' : ''}>30 - 50 Lakh</option>
              <option value="above-50" ${state.budget === 'above-50' ? 'selected' : ''}>Above 50 Lakh</option>
            </select>
          </div>
          <!-- Battery Capacity -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Battery Capacity</label>
            <select id="brands-battery" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.battery === 'all' ? 'selected' : ''}>Any Capacity</option>
              <option value="small" ${state.battery === 'small' ? 'selected' : ''}>Small (&lt; 30 kWh)</option>
              <option value="medium" ${state.battery === 'medium' ? 'selected' : ''}>Medium (30 - 60 kWh)</option>
              <option value="large" ${state.battery === 'large' ? 'selected' : ''}>Large (&gt; 60 kWh)</option>
            </select>
          </div>
          <!-- Range -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Range</label>
            <select id="brands-range" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.range === 'all' ? 'selected' : ''}>Any Range</option>
              <option value="under-300" ${state.range === 'under-300' ? 'selected' : ''}>Under 300 km</option>
              <option value="300-500" ${state.range === '300-500' ? 'selected' : ''}>300 - 500 km</option>
              <option value="above-500" ${state.range === 'above-500' ? 'selected' : ''}>Above 500 km</option>
            </select>
          </div>
          <!-- Fast Charging -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Fast Charging</label>
            <select id="brands-charging" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.charging === 'all' ? 'selected' : ''}>Any Charging Speed</option>
              <option value="fast" ${state.charging === 'fast' ? 'selected' : ''}>Under 45 mins (DC)</option>
              <option value="very-fast" ${state.charging === 'very-fast' ? 'selected' : ''}>Under 30 mins (DC)</option>
            </select>
          </div>
          <!-- Seating Capacity -->
          <div class="flex flex-col gap-1.5">
            <label class="text-[9px] text-zinc-500 uppercase">Seating Capacity</label>
            <select id="brands-seating" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.seating === 'all' ? 'selected' : ''}>Any Seating</option>
              <option value="4" ${state.seating === '4' ? 'selected' : ''}>4 Seater</option>
              <option value="5" ${state.seating === '5' ? 'selected' : ''}>5 Seater</option>
              <option value="6-7" ${state.seating === '6-7' ? 'selected' : ''}>6 - 7 Seater</option>
            </select>
          </div>
          <!-- Availability -->
          <div class="flex flex-col gap-1.5 sm:col-span-2 md:col-span-3 lg:col-span-4">
            <label class="text-[9px] text-zinc-500 uppercase">Availability</label>
            <select id="brands-availability" class="bg-white border border-zinc-200 px-3 py-2 outline-none focus:border-black rounded-lg cursor-pointer w-full">
              <option value="all" ${state.availability === 'all' ? 'selected' : ''}>All Models</option>
              <option value="available" ${state.availability === 'available' ? 'selected' : ''}>Available Now</option>
              <option value="upcoming" ${state.availability === 'upcoming' ? 'selected' : ''}>Upcoming Models</option>
            </select>
          </div>

          <!-- Explicit Search & Reset Action buttons -->
          <div class="flex items-end gap-3 sm:col-span-2 md:col-span-3 lg:col-span-4 mt-2">
            <button id="btn-brands-search-submit" class="flex-1 py-2.5 bg-black text-white hover:bg-zinc-800 transition-colors font-mono text-[10px] tracking-widest uppercase font-semibold border border-black rounded-lg">
              SEARCH VEHICLES
            </button>
            <button id="btn-brands-search-reset" class="flex-1 py-2.5 bg-white text-zinc-700 hover:text-black hover:border-black transition-colors font-mono text-[10px] tracking-widest uppercase font-semibold border border-zinc-200 rounded-lg">
              RESET FILTERS
            </button>
          </div>
        </div>

        <!-- Render Target Area -->
        <div id="brands-directory-results-area">
          ${resultsSectionHtml}
        </div>
      </div>
    `;
    
    renderSubpage(title, breadcrumbs, contentHtml, '/');
    
    // --- Searchable dropdown for brand search ---
    const searchInp = document.getElementById('brands-search');
    const searchDropdown = document.getElementById('brands-search-dropdown');
    const dropdownItems = searchDropdown ? searchDropdown.querySelectorAll('.brands-dropdown-item') : [];

    function showDropdown() {
      if (searchDropdown) searchDropdown.classList.remove('hidden');
    }
    function hideDropdown() {
      if (searchDropdown) searchDropdown.classList.add('hidden');
    }
    function filterDropdown(query) {
      dropdownItems.forEach(item => {
        const name = item.getAttribute('data-brand-name') || '';
        if (name.toLowerCase().includes(query.toLowerCase())) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    }

    if (searchInp) {
      // Open on focus or click
      searchInp.addEventListener('focus', () => {
        filterDropdown(searchInp.value);
        showDropdown();
      });
      searchInp.addEventListener('click', () => {
        filterDropdown(searchInp.value);
        showDropdown();
      });
      // Filter as user types
      searchInp.addEventListener('input', (e) => {
        const query = e.target.value;
        filterDropdown(query);
        showDropdown();
        state.search = query;
      });
      // Listen to Enter Key for search trigger
      searchInp.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          state.search = searchInp.value;
          state.isSearchActive = true;
          hideDropdown();
          render();
        }
      });
    }

    // Dropdown item selection
    if (searchDropdown) {
      dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
          const name = item.getAttribute('data-brand-name');
          if (searchInp) searchInp.value = name;
          state.search = name;
          state.isSearchActive = true; // Auto execute search on suggestion click
          hideDropdown();
          render();
        });
      });
    }

    // Close dropdown on outside click
    document.addEventListener('mousedown', function onOutsideClick(e) {
      const wrapper = document.getElementById('brands-search-wrapper');
      if (wrapper && !wrapper.contains(e.target)) {
        hideDropdown();
      }
    });
    
    // Bind enter key press to all dropdown selects
    const selects = ['brands-origin', 'brands-category', 'brands-budget', 'brands-battery', 'brands-range', 'brands-charging', 'brands-seating', 'brands-availability'];
    selects.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            // Read values on submit
            state.origin = document.getElementById('brands-origin').value;
            state.category = document.getElementById('brands-category').value;
            state.budget = document.getElementById('brands-budget').value;
            state.battery = document.getElementById('brands-battery').value;
            state.range = document.getElementById('brands-range').value;
            state.charging = document.getElementById('brands-charging').value;
            state.seating = document.getElementById('brands-seating').value;
            state.availability = document.getElementById('brands-availability').value;
            state.isSearchActive = true;
            render();
          }
        });
      }
    });

    // Bind Search Button Click
    const searchBtn = document.getElementById('btn-brands-search-submit');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        state.search = searchInp ? searchInp.value : '';
        state.origin = document.getElementById('brands-origin').value;
        state.category = document.getElementById('brands-category').value;
        state.budget = document.getElementById('brands-budget').value;
        state.battery = document.getElementById('brands-battery').value;
        state.range = document.getElementById('brands-range').value;
        state.charging = document.getElementById('brands-charging').value;
        state.seating = document.getElementById('brands-seating').value;
        state.availability = document.getElementById('brands-availability').value;
        state.isSearchActive = true;
        render();
      });
    }

    // Bind Reset Button Click
    const resetBtn = document.getElementById('btn-brands-search-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        state.search = '';
        state.origin = 'all';
        state.category = 'all';
        state.budget = 'all';
        state.battery = 'all';
        state.range = 'all';
        state.charging = 'all';
        state.seating = 'all';
        state.availability = 'all';
        state.isSearchActive = false;
        render();
      });
    }
    
    attachBrandCardClickEvents();
  }
  
  function attachBrandCardClickEvents() {
    // 1. Grid Supported Brands Card
    document.querySelectorAll('.brand-card').forEach(card => {
      card.addEventListener('click', () => {
        const brandId = card.getAttribute('data-brand');
        navigateTo('/brand/' + brandId);
      });
    });

    // 2. Pill International Brands Button
    document.querySelectorAll('.brand-pill-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const brandId = btn.getAttribute('data-brand');
        navigateTo('/brand/' + brandId);
      });
    });

    // 3. Search Results Details buttons
    attachCardEvents();
  }
  
  render();
  window.appInitialized = true;
}

// ==========================================
//           BLOGS MODULE CONTROLLERS
// ==========================================

function getScrollProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const elementHeight = rect.height;
  const viewportHeight = window.innerHeight;
  
  if (rect.top > 0) return 0;
  if (rect.bottom < viewportHeight) return 100;
  
  const scrolled = -rect.top;
  const scrollable = elementHeight - viewportHeight;
  return Math.min(100, Math.max(0, (scrolled / scrollable) * 100));
}


function renderDailyBlogsPage() {
  if (activeBlogScrollListener) {
    window.removeEventListener('scroll', activeBlogScrollListener);
    activeBlogScrollListener = null;
  }
  
  const homeEl = document.getElementById('homepage-content');
  if (homeEl) homeEl.style.display = 'none';
  
  const detailsEl = document.getElementById('details-page-content');
  if (detailsEl) detailsEl.style.display = 'none';
  
  let blogsPage = document.getElementById('blogs-page-content');
  if (!blogsPage) {
    blogsPage = document.createElement('div');
    blogsPage.id = 'blogs-page-content';
    document.body.appendChild(blogsPage);
  }
  blogsPage.style.display = 'block';
  blogsPage.className = 'blog-light-theme py-20 px-6 lg:px-12 relative z-10';
  
  blogsPage.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <nav class="flex text-[10px] uppercase font-mono tracking-widest text-zinc-550 mb-8 select-none" aria-label="Breadcrumb">
        <a href="#" class="hover:text-[#39FF14] transition-colors">Home</a>
        <span class="mx-2.5 text-zinc-700">/</span>
        <span class="text-zinc-400">Blogs</span>
      </nav>

      <div class="mb-12 text-left">
        <span class="blog-badge mb-3 inline-block">Daily Feed</span>
        <h1 class="text-3xl md:text-6xl font-black uppercase tracking-tight text-green-700 mb-4">EV Insights & Daily Blogs</h1>
        <p class="text-xs md:text-sm text-zinc-600 max-w-2xl leading-relaxed">Stay updated with the latest in charging infrastructure, battery care engineering, government subsidies, and electric mobility shifts.</p>
      </div>

      <div class="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-zinc-200 pb-6 mb-8 select-none">
        <div class="flex flex-wrap gap-2 justify-start w-full md:w-auto" id="blog-category-filters">
          <button class="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-green-600 transition-all bg-green-600 text-white active-filter-pill" data-category="">All</button>
          <button class="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-zinc-200 hover:border-green-500 hover:text-green-700 transition-all bg-white text-zinc-600" data-category="infrastructure">Infrastructure</button>
          <button class="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-zinc-200 hover:border-green-500 hover:text-green-700 transition-all bg-white text-zinc-600" data-category="ownership">Buying & Ownership</button>
          <button class="px-3.5 py-1.5 text-[10px] font-mono uppercase tracking-wider rounded-lg border border-zinc-200 hover:border-green-500 hover:text-green-700 transition-all bg-white text-zinc-600" data-category="daily">Daily Updates</button>
        </div>
        
        <div class="relative w-full md:w-80">
          <input type="text" id="blog-search-box" placeholder="Search within blogs..." class="w-full pl-9 pr-4 py-2 text-xs rounded-lg blog-search-input font-mono animate-all" autocomplete="off">
          <svg viewBox="0 0 24 24" class="absolute left-3 top-2.5 w-3.5 h-3.5 stroke-zinc-550 fill-none stroke-2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="blogs-grid-feed">
        <div class="text-zinc-500 font-mono text-xs py-10 col-span-3">Loading articles...</div>
      </div>
    </div>
  `;

  let currentSearch = "";
  let currentCategory = "";

  async function updateBlogsGrid() {
    const grid = document.getElementById('blogs-grid-feed');
    if (!grid) return;
    
    try {
      const blogs = await fetchDailyBlogs(currentSearch, currentCategory);
      
      if (blogs.length === 0) {
        grid.innerHTML = `
          <div class="col-span-3 text-center py-20 border border-dashed border-zinc-200 rounded-2xl select-none bg-white">
            <span class="text-2xl block mb-2">🔍</span>
            <p class="font-mono text-zinc-550 text-xs">No blogs match your filter criteria.</p>
          </div>
        `;
        return;
      }
      
      grid.innerHTML = blogs.map(blog => `
        <article class="blog-card flex flex-col h-full opacity-0 transform translate-y-4 transition-all duration-300" style="content-visibility: auto">
          <div class="aspect-[16/9] w-full overflow-hidden bg-zinc-50 relative">
            <img src="${resolveImagePath(blog.featuredImage || 'ev_hero.png')}" alt="${blog.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" onerror="this.onerror=null; this.src='/ev_hero.png';">
            <span class="absolute top-4 left-4 blog-badge">${blog.categoryName}</span>
          </div>
          <div class="p-6 flex flex-col flex-1 justify-between">
            <div class="text-left">
              <div class="flex gap-2.5 text-[9px] font-mono text-zinc-550 uppercase tracking-widest mb-3">
                <span>${blog.author.split(',')[0]}</span>
                <span>•</span>
                <span>${blog.date}</span>
              </div>
              <h3 class="text-base font-bold text-zinc-950 tracking-tight leading-snug mb-3 hover:text-green-700 transition-colors cursor-pointer" onclick="window.location.hash='#/blogs/${blog.category}/${blog.slug}'">
                ${blog.title}
              </h3>
              <p class="text-xs text-zinc-600 leading-relaxed line-clamp-3 mb-6">
                ${blog.summary}
              </p>
            </div>
            
            <div class="flex items-center justify-between border-t border-zinc-200 pt-4 mt-auto">
              <span class="text-[9px] font-mono text-zinc-550 uppercase tracking-wider">${blog.readTime}</span>
              <a href="#/blogs/${blog.category}/${blog.slug}" class="text-[10px] font-mono uppercase tracking-widest text-green-700 hover:underline flex items-center gap-1 select-none">
                Read More
                <svg viewBox="0 0 24 24" class="w-3 h-3 stroke-current fill-none stroke-2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>
          </div>
        </article>
      `).join('');
      
      const cards = grid.querySelectorAll('.blog-card');
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-4');
        }, index * 60);
      });
      
    } catch (err) {
      console.error(err);
      grid.innerHTML = `<div class="col-span-3 text-red-500 font-mono text-xs py-10">Failed to load articles. Please reload page.</div>`;
    }
  }

  const searchBox = document.getElementById('blog-search-box');
  if (searchBox) {
    searchBox.value = currentSearch;
    searchBox.addEventListener('input', (e) => {
      currentSearch = e.target.value;
      updateBlogsGrid();
    });
  }

  const filtersContainer = document.getElementById('blog-category-filters');
  if (filtersContainer) {
    filtersContainer.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        filtersContainer.querySelectorAll('button').forEach(b => {
          b.classList.remove('text-white', 'border-green-600', 'bg-green-600', 'active-filter-pill');
          b.classList.add('text-zinc-600', 'bg-white', 'border-zinc-200');
        });
        
        btn.classList.remove('text-zinc-600', 'bg-white', 'border-zinc-200');
        btn.classList.add('text-white', 'bg-green-600', 'border-green-600', 'active-filter-pill');
        
        currentCategory = btn.getAttribute('data-category');
        updateBlogsGrid();
      });
    });
  }

  updateBlogsGrid();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderBlogArticlePage(category, slug) {
  if (activeBlogScrollListener) {
    window.removeEventListener('scroll', activeBlogScrollListener);
    activeBlogScrollListener = null;
  }
  
  const homeEl = document.getElementById('homepage-content');
  if (homeEl) homeEl.style.display = 'none';
  
  const detailsEl = document.getElementById('details-page-content');
  if (detailsEl) detailsEl.style.display = 'none';
  
  let blogsPage = document.getElementById('blogs-page-content');
  if (!blogsPage) {
    blogsPage = document.createElement('div');
    blogsPage.id = 'blogs-page-content';
    document.body.appendChild(blogsPage);
  }
  blogsPage.style.display = 'block';
  blogsPage.className = 'blog-light-theme py-20 px-6 lg:px-12 relative z-10';

  blogsPage.innerHTML = `<div class="max-w-7xl mx-auto py-20 font-mono text-zinc-550 text-xs">Loading article details...</div>`;

  fetchBlogBySlug(category, slug).then(async (blog) => {
    const categoryLabel = blog.categoryName;
    const allBlogsList = BLOGS_DATABASE || [];
    
    const currentIdx = allBlogsList.findIndex(b => b.id === blog.id);
    const prevPost = currentIdx > 0 ? allBlogsList[currentIdx - 1] : null;
    const nextPost = currentIdx < allBlogsList.length - 1 ? allBlogsList[currentIdx + 1] : null;
    
    const relatedPosts = allBlogsList
      .filter(b => b.category === blog.category && b.id !== blog.id)
      .slice(0, 2);

    blogsPage.innerHTML = `
      <div class="blog-progress-container">
        <div class="blog-progress-fill" id="blog-article-progress"></div>
      </div>

      <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": "${blog.title}",
          "image": "${blog.featuredImage}",
          "author": {
            "@type": "Person",
            "name": "${blog.author.split(',')[0]}"
          },
          "datePublished": "${blog.date}",
          "description": "${blog.metaDescription}"
        }
      </script>

      <div class="blog-schema-container" data-meta-title="${blog.metaTitle}" data-meta-desc="${blog.metaDescription}"></div>

      <div class="max-w-7xl mx-auto">
        <nav class="flex text-[10px] uppercase font-mono tracking-widest text-zinc-550 mb-8 select-none" aria-label="Breadcrumb">
          <a href="#" class="hover:text-[#39FF14] transition-colors">Home</a>
          <span class="mx-2.5 text-zinc-700">/</span>
          <a href="#/blogs/daily" class="hover:text-[#39FF14] transition-colors">Blogs</a>
          <span class="mx-2.5 text-zinc-700">/</span>
          <span class="text-zinc-400 font-bold truncate">${blog.title}</span>
        </nav>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <aside class="hidden lg:block lg:col-span-3 h-fit sticky top-28 select-none">
            <div class="border-l border-green-500 pl-6 py-2">
              <h4 class="text-[10px] uppercase font-mono tracking-widest text-zinc-550 mb-6 font-bold">Table of Contents</h4>
              <ul class="blog-toc-list">
                ${blog.toc ? blog.toc.map((item, idx) => `
                  <li class="blog-toc-item ${idx === 0 ? 'active' : ''}" id="toc-item-${item.id}">
                    <a href="#${item.id}" class="blog-toc-link ${idx === 0 ? 'active' : ''}" data-target-id="${item.id}">${item.text}</a>
                  </li>
                `).join('') : '<li class="text-xs text-zinc-550 font-mono">Article sections</li>'}
              </ul>
              
              <div class="border-t border-zinc-200 mt-8 pt-6">
                <h4 class="text-[10px] uppercase font-mono tracking-widest text-zinc-555 mb-4 font-bold">Actions</h4>
                <div class="flex gap-2.5">
                  <button class="blog-action-btn" id="blog-action-bookmark" title="Bookmark Article">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[2]" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </button>
                  <button class="blog-action-btn" id="blog-action-share" title="Share Article">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[2]" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main class="lg:col-span-9" id="blog-article-body">
            
            <header class="mb-10 text-left">
              <span class="blog-badge mb-3 inline-block">${categoryLabel}</span>
              <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-green-700 mb-6 leading-tight">${blog.title}</h1>
              
              <div class="flex items-center gap-3 border-y border-zinc-200 py-4 select-none">
                <div class="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold font-mono text-xs border border-green-600">
                  ${blog.author.charAt(0)}
                </div>
                <div class="text-left font-mono">
                  <p class="text-xs font-bold text-zinc-950">${blog.author}</p>
                  <div class="flex gap-2 text-[9px] text-zinc-550 uppercase tracking-widest mt-0.5">
                    <span>${blog.date}</span>
                    <span>•</span>
                    <span>${blog.readTime}</span>
                  </div>
                </div>
              </div>
            </header>

            <div class="w-full aspect-[21/9] overflow-hidden rounded-2xl border border-zinc-200 mb-10 bg-zinc-50">
              <img src="${resolveImagePath(blog.featuredImage || 'ev_hero.png')}" alt="Featured Banner" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/ev_hero.png';">
            </div>

            <article class="prose max-w-none text-zinc-700 text-sm leading-relaxed text-left gap-4 flex flex-col" id="article-markdown-content">
              ${blog.htmlContent}
            </article>

            <div class="lg:hidden flex gap-4 items-center justify-start border-t border-zinc-200 mt-10 pt-6 select-none">
              <span class="text-[10px] uppercase font-mono tracking-widest text-zinc-550 font-bold">Actions:</span>
              <button class="blog-action-btn" id="blog-action-bookmark-mobile">
                <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[2]" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
              </button>
              <button class="blog-action-btn" id="blog-action-share-mobile">
                <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[2]" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
              </button>
            </div>

            <div class="border-t border-zinc-200 mt-12 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
              ${prevPost ? `
                <a href="#/blogs/${prevPost.category}/${prevPost.slug}" class="flex flex-col p-5 bg-white border border-zinc-200 hover:border-green-400 rounded-xl text-left group">
                  <span class="text-[9px] font-mono text-zinc-550 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 stroke-current fill-none stroke-2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Previous Post
                  </span>
                  <span class="text-xs font-bold text-zinc-950 group-hover:text-green-700 transition-colors truncate">${prevPost.title}</span>
                </a>
              ` : '<div></div>'}
              ${nextPost ? `
                <a href="#/blogs/${nextPost.category}/${nextPost.slug}" class="flex flex-col p-5 bg-white border border-zinc-200 hover:border-green-400 rounded-xl text-right group">
                  <span class="text-[9px] font-mono text-zinc-550 uppercase tracking-widest mb-1.5 flex items-center gap-1 justify-end">
                    Next Post
                    <svg viewBox="0 0 24 24" class="w-2.5 h-2.5 stroke-current fill-none stroke-2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </span>
                  <span class="text-xs font-bold text-zinc-950 group-hover:text-green-700 transition-colors truncate">${nextPost.title}</span>
                </a>
              ` : '<div></div>'}
            </div>

            ${relatedPosts.length > 0 ? `
              <div class="border-t border-zinc-200 mt-12 pt-8 text-left">
                <h3 class="text-sm font-bold font-mono uppercase tracking-widest text-zinc-500 mb-6">Related Articles</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                  ${relatedPosts.map(rel => `
                    <div class="blog-card flex flex-col h-full">
                      <div class="aspect-[16/9] w-full overflow-hidden bg-zinc-50">
                        <img src="${resolveImagePath(rel.featuredImage || 'ev_hero.png')}" alt="${rel.title}" class="w-full h-full object-cover" onerror="this.onerror=null; this.src='/ev_hero.png';">
                      </div>
                      <div class="p-5 flex flex-col justify-between flex-1">
                        <h4 class="text-xs font-bold text-zinc-950 mb-2 hover:text-green-700 transition-colors truncate" onclick="window.location.hash='#/blogs/${rel.category}/${rel.slug}'">
                          ${rel.title}
                        </h4>
                        <p class="text-[11px] text-zinc-600 line-clamp-2 mb-4 leading-relaxed">${rel.summary}</p>
                        <a href="#/blogs/${rel.category}/${rel.slug}" class="text-[9px] font-mono uppercase tracking-widest text-green-700 hover:underline flex items-center gap-1 mt-auto select-none">Read More</a>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

          </main>

        </div>
      </div>
    `;

    const triggerShare = () => {
      if (navigator.share) {
        navigator.share({
          title: blog.title,
          text: blog.summary,
          url: window.location.href
        }).catch(err => console.log('Share canceled', err));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Article URL copied to clipboard!');
      }
    };
    
    const triggerBookmark = (btn) => {
      const isBookmarked = btn.classList.contains('text-green-700');
      if (isBookmarked) {
        btn.classList.remove('text-green-700');
        btn.style.borderColor = '';
        btn.style.boxShadow = '';
      } else {
        btn.classList.add('text-green-700');
        btn.style.borderColor = '#22C55E';
        btn.style.boxShadow = '0 10px 24px rgba(34, 197, 94, 0.16)';
      }
    };

    document.getElementById('blog-action-share')?.addEventListener('click', triggerShare);
    document.getElementById('blog-action-share-mobile')?.addEventListener('click', triggerShare);
    
    const bookmarkBtn = document.getElementById('blog-action-bookmark');
    if (bookmarkBtn) {
      bookmarkBtn.addEventListener('click', () => triggerBookmark(bookmarkBtn));
    }
    const bookmarkBtnMobile = document.getElementById('blog-action-bookmark-mobile');
    if (bookmarkBtnMobile) {
      bookmarkBtnMobile.addEventListener('click', () => triggerBookmark(bookmarkBtnMobile));
    }

    const progressFill = document.getElementById('blog-article-progress');
    activeBlogScrollListener = () => {
      const mainEl = document.getElementById('blog-article-body');
      if (mainEl && progressFill) {
        const pct = getScrollProgress(mainEl);
        progressFill.style.width = pct + '%';
      }

      const headers = document.querySelectorAll('#article-markdown-content h2');
      let activeHeaderId = '';
      headers.forEach(h => {
        const top = h.getBoundingClientRect().top;
        if (top < 150) {
          activeHeaderId = h.getAttribute('id');
        }
      });

      if (activeHeaderId) {
        document.querySelectorAll('.blog-toc-item').forEach(item => {
          item.classList.remove('active');
        });
        document.querySelectorAll('.blog-toc-link').forEach(link => {
          link.classList.remove('active');
        });

        const activeItem = document.getElementById(`toc-item-${activeHeaderId}`);
        if (activeItem) {
          activeItem.classList.add('active');
          activeItem.querySelector('a')?.classList.add('active');
        }
      }
    };

    window.addEventListener('scroll', activeBlogScrollListener, { passive: true });
    
    document.querySelectorAll('.blog-toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('data-target-id');
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const offsetTop = targetEl.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
      });
    });

  }).catch((err) => {
    blogsPage.innerHTML = `
      <div class="max-w-7xl mx-auto text-center py-20">
        <h2 class="text-xl font-bold mb-4">Error loading blog article</h2>
        <p class="text-xs text-red-500 font-mono mb-8">${err.message}</p>
        <a href="#/blogs/daily" class="px-6 py-2.5 font-mono text-[10px] tracking-wider rounded-lg border border-green-600 bg-green-600 text-white hover:bg-green-700 transition-all">Back to daily blogs</a>
      </div>
    `;
  });

  window.scrollTo({ top: 0, behavior: 'instant' });
}

function renderRecentlyViewedPage() {
  const title = 'Recently Viewed Cars';
  const breadcrumbs = ['MARKETPLACE', title];
  
  let list = [];
  try {
    list = JSON.parse(localStorage.getItem('recently_viewed_evs') || '[]');
  } catch (e) {
    console.error(e);
  }
  
  const matchingCars = [];
  list.forEach(carId => {
    const car = EV_DATABASE.find(c => c.id === carId);
    if (car) matchingCars.push(car);
  });
  
  let cardsHtml = '';
  if (matchingCars.length === 0) {
    cardsHtml = `
      <div class="col-span-3 text-center py-16 font-mono text-zinc-550 text-xs border border-dashed border-zinc-900 rounded-2xl select-none">
        You haven't viewed any electric vehicles recently.
      </div>
    `;
  } else {
    matchingCars.forEach(car => {
      cardsHtml += createCarCardHtml(car, 'w-full');
    });
  }
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-550 uppercase tracking-widest">RECENT HISTORY / ${matchingCars.length} VEHICLES</span>
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
