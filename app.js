/**
 * app.js - EV Car Wale Marketplace Core Logic
 * Handles interactive state machines, data filtering, math calculators,
 * dropdown comparisons, video players, and accordion modules.
 */

const S3_IMAGE_MAPPING = {
  // NOTE: Values may contain inconsistent whitespace; they will be normalized at runtime.
  "audi-a6-e-tron": "car_images/AUDI/AUDI-A6-ETRON .png",
  "audi-e-tron-gt": "car_images/AUDI/audi_etron_gt.jpg",
  "audi-q6-e-tron": "car_images/AUDI/Audi Q6 e-tron.JPG",
  "avinya-ev": "car_images/tata/tata_avinya_ev.jpeg",
  "be-07": "car_images/mahindra/mahindra_BE_07.jpeg",
  "be6": "car_images/mahindra/mahindra-BE6.jpg",
  "bmw-i4": "car_images/BMW/bmw_i4.jpeg",
  "bmw-i5": "car_images/BMW/BMW-I5.jpeg",
  "bmw-i7": "car_images/BMW/bmw_i7.jpeg",
  "bmw-ix": "car_images/BMW/BMW iX.JPG",
  "bmw-ix1": "car_images/BMW/BMW iX1 LWB.JPG",
  "byd-atto3": "car_images/BYD/BYD_atto.jpeg",
  "byd-emax-7": "car_images/BYD/ BYD_eMAX_7.JPG",
  "byd-seal": "car_images/BYD/byd_seal.jpeg",
  "byd-sealion-6": "car_images/BYD/BYD-SEALION-6.jpeg",
  "byd-sealion-7": "car_images/BYD/    BYD SEALION 7.JPG",
  "comet-ev": "car_images/MG/mg_comet_ev.webp",
  "creta-ev": "car_images/hyundai/Hyundai_Creta _Electric.JPG",
  "curvv-ev": "car_images/tata/CURVE.jpeg",
  "cyberster": "car_images/MG/MG_Cyberster.JPG",
  "d-max-ev": "car_images/ISUZU/D-MAX-EV.webp",
  "ec3": "car_images/CITROEN/Citroen_eC3.jpeg",
  "elevate-ev": "car_images/HONDA/honda_elevate_EV.jpeg",
  "fronx-ev": "car_images/MARUTI_SUZUKI/fronx_ev.jpeg",
  "gv60": "car_images/GENESIS/GV60.jpeg",
  "harrier-ev": "car_images/tata/HARRIER.webp",
  "ioniq-5": "car_images/hyundai/hyundai_ioniq5.jpeg",
  "ioniq-6": "car_images/hyundai/Hyundai_IONIQ6.jpeg",
  "jeep-avengers": "car_images/JEEP/Avengers.jpeg",
  "jimny-ev": "car_images/MARUTI_SUZUKI/jimny.jpeg",
  "kia-carens-clavis-ev": "car_images/KIA/Kia Carens Clavis EV.WEBP",
  "kia-ev6": "car_images/KIA/kia_ev6.jpeg",
  "kia-ev9": "car_images/KIA/kia_ev9.jpeg",
  "lexus-es": "car_images/LEXUS/ES.webp",
  "lotus-eletre": "car_images/LOTUS/ELETRE.jpeg",
  "lotus-emeya": "car_images/LOTUS/EMEYA.webp",
  "luce": "car_images/ferrari/LUCE.jpeg",
  "m9-ev": "car_images/MG/MG_M9.jpg",
  "maruti-e-vitara": "car_images/MARUTI_SUZUKI/maruti_evitara.jpeg",
  "mercedes-benz-amg-eqs": "car_images/MERCEDES_BENZ/AMG-EQS.jpeg",
  "mercedes-benz-c-class-ev": "car_images/MERCEDES_BENZ/C-CLASS.webp",
  "mercedes-benz-cla-ev": "car_images/MERCEDES_BENZ/Mercedes_Benz _CLA.JPG",
  "mercedes-benz-eqs-maybach": "car_images/MERCEDES_BENZ/EQS=MAYBACH.webp",
  "mercedes-benz-eqs-suv": "car_images/MERCEDES_BENZ/Mercedes-Benz _EQS_SUV.JPG",
  "mercedes-benz-eqs-suv-standard": "car_images/MERCEDES_BENZ/EQS_SUV.webp",
  "mercedes-benz-g-class-ev": "car_images/MERCEDES_BENZ/Mercedes-Benz_G-Class.JPG",
  "mini-countryman-c": "car_images/MINI /COUNTRYMAN-C.webp",
  "mini-countryman-electric": "car_images/MINI /COUNTRYMAN-ELECTRIC.webp",
  "nexon-ev": "car_images/tata/NEXON.jpeg",
  "nissan-ariya": "car_images/NISSAN/Nissan_Ariya.WEBP",
  "nissan-leaf": "car_images/NISSAN/nissan_leaf.JPG",
  "pmv-eas-e": "car_images/PMV/EAS-E.webp",
  "porsche-cayenne-ev": "car_images/PORSCHE/PORSCHE_CAYENNE.JPG",
  "porsche-macan-ev": "car_images/PORSCHE/porsche_maccan_EV.jpeg",
  "porsche-taycan": "car_images/PORSCHE/PORSCHE_TAYCAN.JPG",
  "pravaig-defy": "car_images/PRAVAIG/DEFY.jpeg",
  "punch-ev": "car_images/tata/PUNCH.jpeg",
  "renault-kwid-ev": "car_images/RENAULT/renault_kwid_ev.JPG",
  "rolls-royce-spectre": "car_images/ROLLS_ROYCE/SPECTRE.jpeg",
  "ryde": "car_images/BLINQ/RYDE.jpeg",
  "sierra-ev": "car_images/tata/SIERRA.jpeg",
  "skoda-elroq": "car_images/SKODA/Skoda_Elroq.JPG",
  "skoda-enyaq": "car_images/SKODA/Skoda_Enyaq.JPG",
  "strom-r3": "car_images/STROM_MOTORS/R3.jpeg",
  "syros-ev": "car_images/KIA/Kia_syros_ev.jpeg",
  "tesla-model-y": "car_images/TESLA/MODEL-Ywebp.webp",
  "thar-e": "car_images/mahindra/thar.e.jpeg",
  "tiago-ev": "car_images/tata/TIAGO.jpeg",
  "toyota-bz4x": "car_images/TOYOTA/Toyota_bZ4X.jpeg",
  "toyota-taisor-ev": "car_images/TOYOTA/Toyota_Urban_Cruiser_Ebella.jpg",
  "vayve-mobility-eva": "car_images/VAYVE_MOBILITY/EVA-colours/white.jpeg",
  "vinfast-vf-mpv7": "car_images/VINFAST/VinFast VF MPV7.JPG",
  "vinfast-vf3": "car_images/VINFAST/vin_fast_vf3.jpeg",
  "vinfast-vf6": "car_images/VINFAST/VinFast VF 6.WEBP",
  "vinfast-vf7": "car_images/VINFAST/vin_fast_vf7.jpeg",
  "volvo-ec40": "car_images/VOLVO/volvo_EC40.WEBP",
  "volvo-ex30": "car_images/VOLVO/VOLVO_EX30.JPG",
  "volvo-ex40": "car_images/VOLVO/VOLVO_EX40.JPG",
  "volvo-ex90": "car_images/VOLVO/Volvo_EX90.jpeg",
  "volkswagen-id4": "car_images/VOLKSWAGAN/id_4.jpeg",
  "xev-9e": "car_images/mahindra/mahindra_XEV_9e.jpeg",
  "xev-9s": "car_images/mahindra/Mahindra_XEV_9s.jpg",
  "xpres-t-ev": "car_images/tata/EXPRESS-T.jpeg",
  "xuv-3xo-ev": "car_images/mahindra/3X0.JPG",
  "xuv400": "car_images/mahindra/mahindra_XUV_400.jpg",
  "zero-alpha": "car_images/HONDA/ZERO_ALPHA.jpeg",
  "zero-suv": "car_images/HONDA/honda_elevate_EV.jpeg",
  "zs-ev": "car_images/MG/MG ZS EV.JPG",
};

// Reusable image helper/utility for Amazon S3 integration
function getS3ImageUrl(relativePath) {
  if (!relativePath) return '/car_outline.jpg';
  if (relativePath === 'car_outline.jpg') {
    return '/car_outline.jpg';
  }
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath;
  }
  // Clean up path: trim whitespace and remove leading slash if present
  let cleanPath = relativePath.trim();
  // Remove any leading slash
  if (cleanPath.startsWith('/')) {
    cleanPath = cleanPath.substring(1);
  }
  // Remove 'public/' prefix if present
  if (cleanPath.startsWith('public/')) {
    cleanPath = cleanPath.substring(7);
  }
  // Encode each path segment to safely handle spaces and special characters
  const encodedPath = cleanPath.split('/').map(encodeURIComponent).join('/');
  const s3BaseUrl = 'https://ev-car-wale.s3.ap-south-1.amazonaws.com';
  const finalUrl = `${s3BaseUrl}/${encodedPath}`;
  console.log('getS3ImageUrl - input:', relativePath, 'cleanPath:', cleanPath, 'encodedPath:', encodedPath, 'finalUrl:', finalUrl);
  return finalUrl;
}

// Helper to render a car image with skeleton shimmer, fallback handling, and hover scaling
function renderCarImage(imageUrl, altText) {
  return `<div class="h-40 bg-white flex items-center justify-center mb-4 relative overflow-hidden border border-zinc-100 p-2">
    <div class="absolute inset-0 skeleton-shimmer"></div>
    <img src="${imageUrl}" alt="${altText}" class="car-image w-full h-full transition-transform duration-500 group-hover:scale-105" onload="this.previousElementSibling.style.display='none'" onerror="handleImageError(this)" />
  </div>`;
}

// Fallback handler for broken images – replaces a failing src with the generic placeholder.
function handleImageError(imgElement) {
  // Prevent infinite recursion if the placeholder also fails.
  imgElement.onerror = null;
  imgElement.src = '/car_outline.jpg';
  console.warn('Image failed to load, replaced with placeholder:', imgElement);
}


function getBrandDisplay(brand) {
  if (!brand) return '';
  const brandNameMap = {
    'tata': 'Tata', 'mahindra': 'Mahindra', 'hyundai': 'Hyundai', 'mg': 'MG',
    'kia': 'Kia', 'byd': 'BYD', 'bmw': 'BMW', 'mercedes-benz': 'Mercedes-Benz',
    'volvo': 'Volvo', 'audi': 'Audi', 'maruti-suzuki': 'Maruti Suzuki',
    'toyota': 'Toyota', 'honda': 'Honda', 'skoda': 'Skoda',
    'volkswagen': 'Volkswagen', 'renault': 'Renault', 'nissan': 'Nissan',
    'citroen': 'Citroën', 'jeep': 'Jeep', 'isuzu': 'Isuzu', 
    'porsche': 'Porsche', 'vinfast': 'VinFast','tesla': 'Tesla'
    ,'lexus': 'Lexus','ferrari': 'Ferrari','genesis': 'Genesis',
    'lotus': 'Lotus','mini': 'MINI','pmv': 'PMV','pravaig': 'Pravaig', 
    'vayve': 'Vayve','blinq': 'Blinq','strom': 'Strom'
  };
  const lower = brand.toLowerCase().trim();
  return brandNameMap[lower] || brand.charAt(0).toUpperCase() + brand.slice(1);
}

function getBrandFolder(brand) {
  if (!brand) return '';
  const lower = brand.toLowerCase().trim();
  if (lower === 'mercedes-benz') return 'MERCEDES_BENZ';
  if (lower === 'force-motors') return 'FORCE';
  if (lower === 'volkswagen') return 'VOLKSWAGAN';
  if (lower === 'rolls-royce') return 'ROLLS_ROYCE';
  if (lower === 'maruti-suzuki') return 'MARUTI_SUZUKI';
  if (lower === 'mini') return 'MINI ';
  if (lower === 'tata' || lower === 'mahindra' || lower === 'hyundai') return lower;
  return lower.toUpperCase();
}

function normalizeKey(str) {
  return str ? str.toLowerCase().replace(/[^a-z0-9]/g, '') : '';
}

// Normalize mapping values: trim spaces, collapse multiple spaces, remove spaces before dot
function normalizeMappingValue(val) {
  if (!val) return val;
  // Collapse multiple whitespace to single space and trim
  let cleaned = val.replace(/\s+/g, ' ').trim();
  // Remove space before file extension dot
  cleaned = cleaned.replace(/\s+\./g, '.');
  // Remove spaces around path separators
  cleaned = cleaned.replace(/\/\s+/g, '/').replace(/\s+\//g, '/');
  return cleaned;
}

// --- Global EV Fleet Database ---
let EV_DATABASE = [];
let FEATURES_DATABASE = {};
let VARIANTS_DATABASE = {};

let databasePromise = null;

async function loadDatabase() {
  if (databasePromise) return databasePromise;
  
  databasePromise = (async () => {
    const urls = [
      '/data/cars.json',
      'https://ev-car-wale.s3.ap-south-1.amazonaws.com/data/cars.json'
    ];
    let text = null;
    let lastError = null;
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          text = await response.text();
          break;
        }
      } catch (e) {
        lastError = e;
      }
    }
    if (text === null) {
      console.error('Failed to fetch car metadata from any source:', lastError);
      return;
    }
      const cleanText = text.replace(/,(\s*[\]}])/g, '$1');
      const parsed = JSON.parse(cleanText);
      if (Array.isArray(parsed)) {
        const uniqueCars = [];
        const seenIds = new Set();
        parsed.forEach(car => {
          if (!seenIds.has(car.id)) {
            seenIds.add(car.id);
            uniqueCars.push(car);
          }
        });

        EV_DATABASE = uniqueCars.map(car => {
          if (S3_IMAGE_MAPPING[car.id]) {
            car.image = S3_IMAGE_MAPPING[car.id];
          } else {
            const brandFolder = getBrandFolder(car.brand);
            if (!car.image.startsWith('car_images/')) {
              car.image = `car_images/${brandFolder}/${car.image}`;
            }
          }
          // Clean up brand prefix from name to prevent duplicate labels
          const displayBrand = getBrandDisplay(car.brand);
          if (car.name.toLowerCase().startsWith(displayBrand.toLowerCase())) {
            car.name = car.name.substring(displayBrand.length).trim();
          }
          return car;
        });
        // Load variants data
        const varUrls = ['/data/variants.json', '/client/data/variants.json'];
        for (const vu of varUrls) {
          try {
            const vres = await fetch(vu);
            if (vres.ok) {
              VARIANTS_DATABASE = await vres.json();
              break;
            }
          } catch (_) {}
        }

        // Enrich database
        enrichDatabase();
        
        // Load features data
        const featUrls = ['/public/data/ev-features.json', '/data/ev-features.json'];
        for (const fu of featUrls) {
          try {
            const fres = await fetch(fu);
            if (fres.ok) {
              FEATURES_DATABASE = await fres.json();
              break;
            }
          } catch (_) {}
        }
        
        // Log counts as requested
        console.log('total cars loaded:', EV_DATABASE.length);
        console.log('cars in popular:', EV_DATABASE.filter(car => car.sections && car.sections.includes('popular')).length);
        console.log('cars in launches:', EV_DATABASE.filter(car => car.sections && car.sections.includes('launches')).length);
        console.log('cars in upcoming:', EV_DATABASE.filter(car => car.sections && car.sections.includes('upcoming')).length);
        console.log('cars in explore:', EV_DATABASE.filter(car => car.sections && car.sections.includes('explore')).length);
        
        // Initial renders
        initUserSession();
        renderAllCarousels();
        populateCompareDropdowns();
        updateCompareTable();
      } else {
        console.error('Fetched data is not an array:', parsed);
      }
  })();
  
  return databasePromise;
}

// --- State-Wise Tax & EV Policy Database ---
// NOTE: All rates are approximate and sourced from publicly available state government policies.
// Update this object whenever state governments revise their EV policies or registration fees.
// --- Complete State-Wise Tax & EV Policy Database (Updated 2026) ---
// Covers every single key mapping found in the TRIP_CITIES dropdown list.
// --- Cleaned State-Wise Tax Database (Strict Dropdown Matches Only) ---
// Verified for flat math compatibility to resolve all ₹NaN bugs immediately.
const STATE_TAX_DATABASE = {
    delhi: {
        label: 'Delhi',
        roadTaxPct: 0.0, // 100% tax waiver for EVs
        regCharge: 2500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Road tax fully waived for EVs.'
    },
    mumbai: {
        label: 'Mumbai, Maharashtra',
        roadTaxPct: 0.0, // Full EV exemption applies under Maharashtra policy
        regCharge: 4000,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: '100% road tax exemption active for EVs.'
    },
    pune: {
        label: 'Pune, Maharashtra',
        roadTaxPct: 0.0, // Full EV exemption applies under Maharashtra policy
        regCharge: 4000,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: '100% road tax exemption active for EVs.'
    },
    bengaluru: {
        label: 'Bengaluru, Karnataka',
        roadTaxPct: 0.05, // Fixed base rate for entry cars like Punch EV (<10L)
        regCharge: 4000,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Karnataka levies tax based on value (5% for vehicles up to ₹10 Lakh).'
    },
    hyderabad: {
        label: 'Hyderabad, Telangana',
        roadTaxPct: 0.0, // Full policy extension through Dec 2026
        regCharge: 3500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: '100% road tax and registration fee exemption active through Dec 2026.'
    },
    chennai: {
        label: 'Chennai, Tamil Nadu',
        roadTaxPct: 0.0, // 100% waiver active
        regCharge: 4000,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: '100% road tax exemption active for EVs.'
    },
    ahmedabad: {
        label: 'Ahmedabad, Gujarat',
        roadTaxPct: 0.06, // Standard state EV rate post-policy updates
        regCharge: 3000,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Standard state registration charges and tax rates apply.'
    },
    kochi: {
        label: 'Kochi, Kerala',
        roadTaxPct: 0.03, // Revised Kerala Budget: Slashed to 3% for cars under ₹10 Lakh
        regCharge: 3500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Kerala Budget: Concessional 3% road tax applied for EVs under ₹10 Lakh.'
    },
    kolkata: {
        label: 'Kolkata, West Bengal',
        roadTaxPct: 0.04, // Concessional rate
        regCharge: 4500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Reduced concessional 4% road tax applicable for EVs.'
    },
    jaipur: {
        label: 'Jaipur, Rajasthan',
        roadTaxPct: 0.0, // Fully waived
        regCharge: 3500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Road tax fully waived for EVs under Rajasthan EV Policy.'
    },
    lucknow: {
        label: 'Lucknow, Uttar Pradesh',
        roadTaxPct: 0.0, // Exempted
        regCharge: 3500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Road tax exempted for EVs under UP EV Policy.'
    },
    chandigarh: {
        label: 'Chandigarh',
        roadTaxPct: 0.0, // Exempted
        regCharge: 2500,
        evIncentivePct: 0,
        evIncentiveFlat: 0,
        evBenefitNote: 'Road tax completely waived for EVs.'
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
  'delhi-pune': [
  { city: 'Jaipur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Ajmer', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Udaipur', chargerType: 'DC 100 kW', network: 'Statiq' },
  { city: 'Ahmedabad', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Vadodara', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Surat', chargerType: 'DC 60 kW', network: 'Tata Power EV' }
],
'delhi-hyderabad': [
  { city: 'Agra', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Gwalior', chargerType: 'DC 50 kW', network: 'Statiq' },
  { city: 'Nagpur', chargerType: 'DC 100 kW', network: 'Tata Power EV' }
],
'delhi-lucknow': [
  { city: 'Ghaziabad', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Kanpur', chargerType: 'DC 60 kW', network: 'Tata Power EV' }
],
'delhi-varanasi': [
  { city: 'Kanpur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Prayagraj', chargerType: 'DC 100 kW', network: 'Statiq' }
],
'delhi-srinagar': [
  { city: 'Panipat', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Ludhiana', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Jammu', chargerType: 'DC 60 kW', network: 'Statiq' }
],
'mumbai-goa': [
  { city: 'Panvel', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Kolhapur', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Belagavi', chargerType: 'DC 100 kW', network: 'Statiq' }
],
'mumbai-nagpur': [
  { city: 'Nashik', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Aurangabad', chargerType: 'DC 100 kW', network: 'Statiq' },
  { city: 'Amravati', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
],
'mumbai-ahmedabad': [
  { city: 'Vapi', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Surat', chargerType: 'DC 100 kW', network: 'Statiq' },
  { city: 'Vadodara', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
],
'chennai-hyderabad': [
  { city: 'Nellore', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Ongole', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Vijayawada', chargerType: 'DC 100 kW', network: 'Statiq' }
],
'chennai-kochi': [
  { city: 'Coimbatore', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Palakkad', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
],
'hyderabad-pune': [
  { city: 'Solapur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' }
],
'hyderabad-mumbai': [
  { city: 'Solapur', chargerType: 'DC 60 kW', network: 'Statiq' },
  { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' }
],
'kolkata-bhubaneswar': [
  { city: 'Kharagpur', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Balasore', chargerType: 'DC 60 kW', network: 'Tata Power EV' }
],
'kolkata-visakhapatnam': [
  { city: 'Bhubaneswar', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Berhampur', chargerType: 'DC 60 kW', network: 'Statiq' },
  { city: 'Srikakulam', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
],
'bengaluru-hyderabad': [
  { city: 'Anantapur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Kurnool', chargerType: 'DC 100 kW', network: 'Statiq' }
],
'bengaluru-kochi': [
  { city: 'Mysuru', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Kozhikode', chargerType: 'DC 100 kW', network: 'EESL CCS2' }
]
};

/** Ordered list of cities available in the trip planner dropdowns */
const TRIP_CITIES = [
  { key: 'ahmedabad', label: 'Ahmedabad, Gujarat' },
  { key: 'ajmer', label: 'Ajmer, Rajasthan' },
  { key: 'alappuzha', label: 'Alappuzha, Kerala' },
  { key: 'amravati', label: 'Amravati, Maharashtra' },
  { key: 'amritsar', label: 'Amritsar, Punjab' },
  { key: 'asansol', label: 'Asansol, West Bengal' },
  { key: 'aurangabad', label: 'Aurangabad, Maharashtra' },
  { key: 'balasore', label: 'Balasore, Odisha' },
  { key: 'bangalore', label: 'Bangalore, Karnataka' },
  { key: 'bengaluru', label: 'Bengaluru, Karnataka' },
  { key: 'bareilly', label: 'Bareilly, Uttar Pradesh' },
  { key: 'belagavi', label: 'Belagavi, Karnataka' },
  { key: 'bellary', label: 'Ballari, Karnataka' },
  { key: 'berhampur', label: 'Berhampur, Odisha' },
  { key: 'bhavnagar', label: 'Bhavnagar, Gujarat' },
  { key: 'bhopal', label: 'Bhopal, Madhya Pradesh' },
  { key: 'bhubaneswar', label: 'Bhubaneswar, Odisha' },
  { key: 'chandigarh', label: 'Chandigarh' },
  { key: 'chennai', label: 'Chennai, Tamil Nadu' },
  { key: 'coimbatore', label: 'Coimbatore, Tamil Nadu' },
  { key: 'delhi', label: 'Delhi, NCR' },
  { key: 'dharwad', label: 'Dharwad, Karnataka' },
  { key: 'durgapur', label: 'Durgapur, West Bengal' },
  { key: 'ernakulam', label: 'Ernakulam, Kerala' },
  { key: 'faridabad', label: 'Faridabad, Haryana' },
  { key: 'ghaziabad', label: 'Ghaziabad, Uttar Pradesh' },
  { key: 'goa', label: 'Goa' },
  { key: 'gorakhpur', label: 'Gorakhpur, Uttar Pradesh' },
  { key: 'greater noida', label: 'Greater Noida, Uttar Pradesh' },
  { key: 'guntur', label: 'Guntur, Andhra Pradesh' },
  { key: 'gurgaon', label: 'Gurgaon, Haryana' },
  { key: 'gurugram', label: 'Gurugram, Haryana' },
  { key: 'howrah', label: 'Howrah, West Bengal' },
  { key: 'hubli', label: 'Hubli, Karnataka' },
  { key: 'hyderabad', label: 'Hyderabad, Telangana' },
  { key: 'indore', label: 'Indore, Madhya Pradesh' },
  { key: 'jaipur', label: 'Jaipur, Rajasthan' },
  { key: 'jodhpur', label: 'Jodhpur, Rajasthan' },
  { key: 'kakinada', label: 'Kakinada, Andhra Pradesh' },
  { key: 'kanpur', label: 'Kanpur, Uttar Pradesh' },
  { key: 'kannur', label: 'Kannur, Kerala' },
  { key: 'karimnagar', label: 'Karimnagar, Telangana' },
  { key: 'kochi', label: 'Kochi, Kerala' },
  { key: 'kolhapur', label: 'Kolhapur, Maharashtra' },
  { key: 'kolkata', label: 'Kolkata, West Bengal' },
  { key: 'kollam', label: 'Kollam, Kerala' },
  { key: 'kozhikode', label: 'Kozhikode, Kerala' },
  { key: 'lucknow', label: 'Lucknow, Uttar Pradesh' },
  { key: 'madurai', label: 'Madurai, Tamil Nadu' },
  { key: 'mangalore', label: 'Mangalore, Karnataka' },
  { key: 'mangaluru', label: 'Mangaluru, Karnataka' },
  { key: 'meerut', label: 'Meerut, Uttar Pradesh' },
  { key: 'mumbai', label: 'Mumbai, Maharashtra' },
  { key: 'mysore', label: 'Mysore, Karnataka' },
  { key: 'mysuru', label: 'Mysuru, Karnataka' },
  { key: 'nagpur', label: 'Nagpur, Maharashtra' },
  { key: 'nashik', label: 'Nashik, Maharashtra' },
  { key: 'navi mumbai', label: 'Navi Mumbai, Maharashtra' },
  { key: 'nellore', label: 'Nellore, Andhra Pradesh' },
  { key: 'new delhi', label: 'New Delhi' },
  { key: 'nizamabad', label: 'Nizamabad, Telangana' },
  { key: 'noida', label: 'Noida, Uttar Pradesh' },
  { key: 'prayagraj', label: 'Prayagraj, Uttar Pradesh' },
  { key: 'pune', label: 'Pune, Maharashtra' },
  { key: 'rajkot', label: 'Rajkot, Gujarat' },
  { key: 'salem', label: 'Salem, Tamil Nadu' },
  { key: 'shimla', label: 'Shimla, Himachal Pradesh' },
  { key: 'shivamogga', label: 'Shivamogga, Karnataka' },
  { key: 'siliguri', label: 'Siliguri, West Bengal' },
  { key: 'solapur', label: 'Solapur, Maharashtra' },
  { key: 'srinagar', label: 'Srinagar, Jammu & Kashmir' },
  { key: 'surat', label: 'Surat, Gujarat' },
  { key: 'thane', label: 'Thane, Maharashtra' },
  { key: 'thiruvananthapuram', label: 'Thiruvananthapuram, Kerala' },
  { key: 'thrissur', label: 'Thrissur, Kerala' },
  { key: 'tiruchirappalli', label: 'Tiruchirappalli, Tamil Nadu' },
  { key: 'tirunelveli', label: 'Tirunelveli, Tamil Nadu' },
  { key: 'tirupati', label: 'Tirupati, Andhra Pradesh' },
  { key: 'trichy', label: 'Trichy, Tamil Nadu' },
  { key: 'tumakuru', label: 'Tumakuru, Karnataka' },
  { key: 'udaipur', label: 'Udaipur, Rajasthan' },
  { key: 'udupi', label: 'Udupi, Karnataka' },
  { key: 'vadodara', label: 'Vadodara, Gujarat' },
  { key: 'varanasi', label: 'Varanasi, Uttar Pradesh' },
  { key: 'vellore', label: 'Vellore, Tamil Nadu' },
  { key: 'vijayawada', label: 'Vijayawada, Andhra Pradesh' },
  { key: 'visakhapatnam', label: 'Visakhapatnam, Andhra Pradesh' },
  { key: 'warangal', label: 'Warangal, Telangana' }
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
  // Parse battery kWh from car.battery string (e.g. "40.5 kWh") or batteryVal
  const batteryKWh   = car.batteryVal || parseFloat(car.battery) || 40;
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

let newsCache = null;
let newsPromise = null;

async function loadNews() {
  if (newsCache) return newsCache;
  if (newsPromise) return newsPromise;
  newsPromise = fetchNewsFromAPI();
  return newsPromise;
}

async function fetchNewsFromAPI() {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    if (data && data.length > 0) {
      newsCache = data;
      return newsCache;
    }
    return null;
  } catch (err) {
    console.warn('Failed to load live news:', err.message);
    return null;
  } finally {
    newsPromise = null;
  }
}

var EV_FALLBACK_IMAGES = [
  '/ev_hero.png',
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&h=338&fit=crop',
  'https://images.unsplash.com/photo-1619767886558-efdc7b9af2f2?w=600&h=338&fit=crop',
  'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=338&fit=crop',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=338&fit=crop'
];

var EV_NEWS_FALLBACK_IMG = EV_FALLBACK_IMAGES[0];

function getNewsImageHtml(imageUrl, alt, fallbackIdx) {
  var idx = Math.abs(fallbackIdx || 0);
  var src = imageUrl || EV_FALLBACK_IMAGES[idx % EV_FALLBACK_IMAGES.length];
  var fallbackUrl = EV_FALLBACK_IMAGES[(idx + 1) % EV_FALLBACK_IMAGES.length];
  return '<img src="' + src + '" alt="' + alt + '" loading="lazy" class="w-full h-full object-cover" onerror="this.onerror=null;this.src=\'' + fallbackUrl + '\'" />';
}

function formatNewsDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}

const GUIDE_DATABASE = [
  {
    id: 'guide-1',
    chapter: 'Chapter 01',
    title: 'Why Buy an EV?',
    summary: 'No tailpipe emissions, simplified mechanics, zero fuel costs, and instant acceleration.',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">📋 Summary: Why Choose Electric?</div><p class="editorial-callout-content">EVs feature 80% fewer moving parts, zero direct tailpipe emissions, silent operation, and up to 85% lower fuel costs compared to ICE cars.</p></div><p>Switching to an electric vehicle (EV) is one of the most rewarding decisions you can make. With zero exhaust pipes, EVs do not pollute the air we breathe. They operate silently and smoothly, providing a peaceful cabin experience. Since they have only a fraction of the moving parts of petrol cars, maintenance is rare and operating costs are extremely low.',
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
    content: '<div class="editorial-callout"><div class="editorial-callout-title">⚡ Summary: EV Charging Explained</div><p class="editorial-callout-content">AC charging is perfect for overnight home charging. DC fast charging bypasses the onboard charger and replenishes the battery directly on highways.</p></div><p>Charging an EV is as simple as plugging in a smartphone. You can charge slowly at home or at the office using Alternating Current (AC) electricity, which takes 6 to 10 hours and is best for overnight parking. For longer road trips, highway stations use Direct Current (DC) Fast Charging to replenish your battery up to 80% capacity in 30 minutes or less.</p>',
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
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🔋 Summary: Battery Technology</div><p class="editorial-callout-content">LFP battery chemistry is extremely safe, durable, and suited for hot climates. NMC chemistry offers high energy density for longer driving ranges.</p></div><p>The battery pack is the heart of an EV. Inside, sophisticated cooling systems keep temperature levels stable during fast charging or driving. Currently, two main battery types dominate the market: LFP (Lithium Iron Phosphate) and NMC (Nickel Manganese Cobalt). LFP offers superior safety and longevity, making it perfect for daily driving, while NMC provides more range in a lighter package, ideal for long distance travel.</p>',
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
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🏛️ Summary: Subsidies & Benefits</div><p class="editorial-callout-content">Purchase subsidies, road tax waivers, registration fee exemptions, and direct income tax credits make EVs highly competitive.</p></div><p>Governments worldwide, and specifically in India, offer financial incentives to encourage EV adoption. Central government schemes (like FAME), state road-tax waivers, and registration exemptions can lower the on-road cost of an EV by up to 10-15%. You can also claim income tax deductions on EV loans under Section 80EEB.</p>',
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
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🔧 Summary: Low Maintenance</div><p class="editorial-callout-content">No engine oil changes, spark plugs, or timing belts mean maintenance is simple and 40-50% cheaper over time.</p></div><p>Maintaining an EV is a breeze compared to petrol vehicles. Without an engine, there are no spark plugs, timing belts, air filters, or engine oil changes to worry about. The electric motor has only one moving part, meaning mechanical wear is almost non-existent. Standard maintenance is limited to checking tire pressure, rotating tires, replacing the cabin air filter, and refilling windshield wash.</p>',
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
    content: '<div class="editorial-callout"><div class="editorial-callout-title">💰 Summary: Running Costs</div><p class="editorial-callout-content">Domestic grid rates cost ₹1-1.5/km, reducing fuel costs by over 80%. Rooftop solar integration can reduce running costs to zero.</p></div><p>The biggest benefit of EV ownership is the daily savings. Charging an EV at home using domestic electricity is much cheaper than buying petrol. In India, fuel costs for an EV average around ₹1 to ₹1.5 per km, compared to ₹7 to ₹9 per km for a petrol car. If you have solar panels at home, your fuel cost can drop to virtually zero.</p>',
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

// --- Learn Database (Buying Portal Articles) ---
const LEARN_DATABASE = {
  'home-charging': {
    title: 'Charging at Home',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🏡 Home Charging Essentials</div><p class="editorial-callout-content">Setting up home charging is the most convenient and cost-effective way to power your EV. Using residential rates, it is 85-90% cheaper than petrol.</p></div><p>Setting up home charging is the most convenient and cost-effective way to keep your EV charged. Most EVs come with a portable charging cable that can plug into a standard 15A socket, but for faster charging, installing a dedicated AC wallbox is recommended.</p><h3>Standard 15A Socket Charging</h3><p>A standard 15A socket (the larger plug point found behind refrigerators and air conditioners) can delivers 2-3 kW of power. This charges most EV batteries from empty to full in 10-15 hours. It is perfectly adequate for overnight charging if your daily commute is under 80 km.</p><h3>AC Wallbox Installation</h3><p>A 7.2 kW AC wallbox is the gold standard for home charging. It charges 3-4 times faster than a standard socket, taking most EVs from 0-100% in 4-6 hours. Installation requires a dedicated 40A MCB in your electrical panel and proper earthing.</p><p>Many manufacturers offer free wallbox installation with vehicle purchase. The installation cost typically ranges from ₹3,000-8,000 depending on the distance from your meter box to the parking spot.</p><h3>Cost of Home Charging</h3><p>At residential electricity rates of ₹6-9 per kWh, home charging costs approximately ₹1-1.5 per km. This is 85-90% cheaper than petrol (₹8-9 per km). If you have solar panels, your running cost can drop to virtually zero.</p>'
  },
  'fast-vs-slow': {
    title: 'Fast vs Slow Charging',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">⚡ AC vs DC Charging</div><p class="editorial-callout-content">AC charging is slow, gentle on the battery, and cheap—best for overnight home charging. DC fast charging is rapid and ideal for highway road trips, but costs more and causes slightly higher battery wear over time.</p></div><p>Understanding the difference between AC and DC charging is essential for efficient EV ownership. Here is a detailed comparison.</p><h3>AC Charging (Slow)</h3><p>Alternating Current from the grid is converted to Direct Current by the car\'s onboard charger. Speeds range from 2 kW (standard socket) to 22 kW (three-phase wallbox). AC charging is gentle on the battery, generates less heat, and contributes to longer battery life. Best for overnight and workplace charging.</p><h3>DC Fast Charging</h3><p>Direct Current is supplied directly to the battery, bypassing the onboard charger entirely. Speeds range from 50 kW to 350 kW. DC fast charging can add 200-300 km of range in just 15-30 minutes, making it ideal for highway road trips.</p><h3>Battery Impact</h3><p>While DC fast charging is convenient, frequent use (multiple times per week) can accelerate battery degradation by 2-5% over the vehicle\'s lifetime compared to exclusive AC charging. Most manufacturers recommend using DC fast charging only for long trips and relying on AC charging for daily needs.</p><h3>Cost Comparison</h3><p>AC home charging: ₹1-1.5/km. DC fast charging: ₹2.5-4.5/km. While still cheaper than petrol, DC charging costs 2-3x more than home AC charging due to infrastructure and electricity surcharges.</p>'
  },
  'battery-warranty': {
    title: 'Battery Warranty',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🛡️ Warranty Basics</div><p class="editorial-callout-content">Most manufacturers in India offer a standard 8-year or 1,60,000 km battery warranty. This covers degradation below 70% capacity and cell defects.</p></div><p>EV battery warranties are one of the most important factors to consider when purchasing an electric vehicle. Here is what you need to know.</p><h3>Standard Coverage</h3><p>Most manufacturers in India offer 8 years or 1,60,000 km of battery warranty, whichever comes first. This covers manufacturing defects and capacity degradation below 70% of original capacity.</p><h3>What is Covered</h3><p>The warranty typically covers: battery cell defects, battery management system (BMS) failures, thermal management system issues, premature capacity loss beyond normal degradation, and complete battery failure.</p><h3>What is Not Covered</h3><p>Exclusions usually include: physical damage from accidents, damage from improper charging (using incompatible chargers), unauthorized modifications or tampering, and damage from natural disasters or flooding.</p><h3>Degradation Clauses</h3><p>Most warranties guarantee that the battery will retain at least 70% of its original capacity for the warranty period. If capacity falls below this threshold, the manufacturer will repair or replace the battery free of charge.</p><h3>Transferability</h3><p>Most EV battery warranties are transferable to subsequent owners, which helps maintain resale value. Some manufacturers charge a nominal transfer fee (₹5,000-15,000). Always check the specific terms before purchasing a used EV.</p>'
  },
  'subsidies': {
    title: 'Government Subsidies & State Incentives',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🏛️ Subsidy Highlights</div><p class="editorial-callout-content">Incentives include FAME-III central subsidies (up to ₹3.5 lakh for cars), Section 80EEB income tax deductions (up to ₹1.5 lakh), and state-level road tax exemptions.</p></div><p>Both the central government and various state governments offer financial incentives to make EVs more affordable. Here is a comprehensive overview.</p><h3>FAME-III Subsidy (Central)</h3><p>The FAME-III scheme allocates ₹12,500 crore for EV incentives. Passenger EVs receive ₹10,000-15,000 per kWh of battery capacity, capped at ₹3.5 lakh per vehicle. Two-wheelers receive ₹8,000-12,000 per kWh, capped at ₹35,000.</p><h3>Income Tax Benefits</h3><p>Under Section 80EEB, you can claim a deduction of up to ₹1.5 lakh on interest paid on loans taken to purchase an EV. This is in addition to other deductions under Section 80C.</p><h3>State-Level Incentives</h3><p>Delhi: 100% road tax exemption + registration fee waiver + up to ₹30,000 additional subsidy. Maharashtra: 100% road tax exemption (first EV) + reduced electricity tariff. Karnataka: 100% road tax exemption. Gujarat: 100% road tax exemption for 5 years. Tamil Nadu: 100% road tax exemption + interest subvention on EV loans.</p><h3>Registration Fee Waivers</h3><p>Most states offer full or partial registration fee waivers for EVs, saving you ₹10,000-30,000 depending on the vehicle price. Green license plates are issued for all EVs in India.</p>'
  },
  'running-cost': {
    title: 'EV Running Cost Analysis',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">💰 Running Cost Economics</div><p class="editorial-callout-content">An EV costs ₹1-1.5/km to run compared to ₹7-8/km for a petrol car. Annual fuel and maintenance savings typically range from ₹75,000 to ₹90,000.</p></div><p>One of the biggest advantages of EV ownership is the dramatically lower running cost compared to petrol or diesel vehicles. Here is a detailed breakdown.</p><h3>Electricity Cost</h3><p>At residential rates of ₹6-9 per kWh, an EV costs approximately ₹1-1.5 per km to run. A 40 kWh battery (typical for a compact EV) costs ₹240-360 to fully charge, providing 250-350 km of real-world range.</p><h3>Petrol Comparison</h3><p>A petrol car achieving 15 kmpl at ₹105 per litre costs approximately ₹7 per km. This means an EV saves you 80-85% on fuel costs compared to petrol. Over 15,000 km per year, the savings amount to ₹75,000-90,000 annually.</p><h3>Maintenance Savings</h3><p>EVs have no engine oil, timing belts, spark plugs, air filters, or exhaust systems to maintain. Annual maintenance costs for an EV are typically 40-50% lower than an equivalent petrol vehicle. A typical EV service costs ₹2,000-4,000 versus ₹5,000-10,000 for a petrol car.</p><h3>Total Cost of Ownership</h3><p>Over 5 years/75,000 km, an EV typically saves ₹3-5 lakh in fuel and maintenance costs compared to a petrol vehicle. Even with the higher upfront purchase price (₹1-3 lakh premium), the total cost of ownership is often lower for an EV, especially for high-mileage users.</p>'
  },
};

// Alias mapping for old → new slugs (backward compatibility)
const LEARN_SLUG_ALIASES = {
  'charging-at-home': 'home-charging',
  'government-subsidies': 'subsidies'
};

// --- Learn Database (expanded) ---
Object.assign(LEARN_DATABASE, {
  'everything-about-evs': {
    title: 'Everything About EVs',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">⚡ The EV Revolution</div><p class="editorial-callout-content">Electric Vehicles are not just a change of fuel; they are a complete paradigm shift in transportation efficiency, software integration, and sustainability.</p></div><p>Electric vehicles (EVs) are rapidly transforming the automotive landscape in India. By replacing mechanical engines with highly efficient electric drivetrains, EVs offer a quieter, cleaner, and cheaper way to travel. This comprehensive guide covers everything you need to know about the current EV landscape.</p><h3>How EVs Work</h3><p>Unlike conventional internal combustion engine (ICE) vehicles that rely on thousands of moving parts to convert petrol or diesel combustion into motion, EVs are remarkably simple. An EV consists of three core components: the battery pack, the inverter, and the electric motor. When you press the accelerator, the battery pack sends DC power to the inverter, which converts it to AC power and sends it to the electric motor. The motor then generates immediate rotational force (torque) to spin the wheels without any clutch or gear shifts.</p><h3>Types of Electric Vehicles</h3><p>As you explore the EV market, you will encounter three main categories of electrified drivetrains:</p><ul><li><strong>BEV (Battery Electric Vehicle):</strong> Powered 100% by electricity stored in a battery pack. Must be plugged in to charge. Examples: Tata Nexon EV, MG ZS EV, Tata Tiago EV.</li><li><strong>PHEV (Plug-in Hybrid Electric Vehicle):</strong> Combines a medium-sized battery with a traditional ICE engine. Can run on pure electricity for 40–80 km, then switches to petrol.</li><li><strong>HEV (Strong Hybrid Electric Vehicle):</strong> Uses a small battery to assist the petrol engine. Cannot be plugged in; the battery charges only through regenerative braking. Examples: Toyota Innova Hycross, Maruti Grand Vitara.</li></ul><h3>Key Advantages of Switching to an EV</h3><p>Making the switch to electric mobility offers significant financial and environmental rewards:</p><ul><li><strong>Dramatically Lower Running Costs:</strong> Electricity costs around ₹1–1.5 per km compared to ₹8–9 per km for petrol.</li><li><strong>Minimal Maintenance:</strong> No oil changes, spark plugs, timing belts, or exhaust systems. Service visits are cheaper and less frequent.</li><li><strong>Superior Driving Dynamics:</strong> Instant torque provides immediate acceleration from a standstill, and the low-mounted battery pack improves cornering stability.</li><li><strong>Environmental Benefits:</strong> Zero tailpipe emissions reduce local air pollution, especially in congested Indian cities.</li></ul><h3>India\'s EV Charging Ecosystem</h3><p>Charging infrastructure is growing exponentially in India. Most owners do 90% of their charging at home overnight using standard 15A points or AC wallboxes. For long trips, a rapidly expanding highway network of DC fast chargers (50 kW to 150 kW) allows you to top up from 10% to 80% in under 45 minutes.</p>'
  },
  'ev-buying-guide': {
    title: 'EV Buying Guide',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">📋 Smart Buying Decisions</div><p class="editorial-callout-content">Purchasing an EV requires shifting from looking at \'sticker price\' to evaluating \'Total Cost of Ownership\' (TCO) and understanding your daily range needs.</p></div><p>Buying your first electric vehicle is an exciting step, but it involves different parameters than buying a conventional car. This step-by-step buyer\'s guide helps you choose the perfect EV for your lifestyle and budget.</p><h3>Step 1: Understand Your Daily Mileage</h3><p>Many buyers suffer from "range anxiety" and look for the largest battery possible. However, statistics show that the average urban Indian motorist drives less than 50 km per day. Even an entry-level EV with a modest 200 km real-world range is more than sufficient for weekly city commutes, requiring only two overnight charges per week.</p><h3>Step 2: Compare Upfront Price vs. Total Cost of Ownership</h3><p>EVs typically carry a price premium of 15% to 30% over their petrol counterparts due to battery manufacturing costs. However, you must calculate the Total Cost of Ownership (TCO). If you drive more than 1,000 km per month, the monthly savings on fuel and service will offset the higher loan EMI within 2 to 3 years. After that, the vehicle saves you significant money every month.</p><h3>Step 3: Evaluate Battery Warranty and Chemistry</h3><p>Ensure you check the battery chemistry offered. LFP (Lithium Iron Phosphate) battery packs are highly durable, safer in hot climates, and can be charged to 100% daily. NMC (Nickel Manganese Cobalt) packs offer more range per unit weight but degrade faster if regularly charged past 80%. Look for a warranty of at least 8 years or 1,60,000 km.</p><h3>Step 4: Check Home Charging Feasibility</h3><p>Before putting down a deposit, ensure you have a dedicated parking slot with access to an electrical connection. If you reside in an apartment complex, submit an NOC application to your RWA early to prevent delivery delays. Most car manufacturers provide a complimentary 3.3 kW or 7.2 kW AC wallbox charger with professional installation.</p><h3>Step 5: Inspect Local Public Charging Density</h3><p>Use charging aggregator apps (like PlugShare or Statiq) to locate public DC fast chargers along your daily routes and regular weekend getaway paths. Having 2 or 3 fast-charging stations within a 10 km radius of your home or office provides a great safety net.</p>'
  },
  'learn-ev': {
    title: 'Learn EV',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🚗 EV Anatomy</div><p class="editorial-callout-content">By removing the complex mechanical reciprocating engine, EVs achieve higher reliability and unlock space for larger passenger cabins and extra front trunks (frunks).</p></div><p>This comprehensive technical guide takes you under the hood of an electric vehicle, explaining the core components and systems that make modern EVs highly efficient.</p><h3>1. The Battery Pack (The Fuel Tank)</h3><p>The battery pack is the heart of an EV. Made up of thousands of individual lithium-ion cells grouped into modules, it stores energy as Direct Current (DC). Battery capacity is measured in kilowatt-hours (kWh). A larger capacity means more driving range but also adds weight and cost to the vehicle.</p><h3>2. The Electric Motor (The Engine)</h3><p>Electric motors convert electrical energy into mechanical energy. Unlike ICE engines that need to build RPM to generate power, electric motors produce maximum torque instantly at 0 RPM. They are also incredibly quiet and can operate at over 90% efficiency (compared to just 20–30% efficiency for petrol engines).</p><h3>3. The Inverter (The Transmission Control)</h3><p>The inverter acts as the brain of the drivetrain. It takes DC electricity from the battery and converts it into AC electricity for the motor. By varying the frequency of the AC current, the inverter controls the speed and torque of the motor, eliminating the need for a multi-speed gearbox.</p><h3>4. The Battery Management System (BMS)</h3><p>The BMS is a dedicated computer that continuously monitors every cell block in the battery. It manages cell balancing, tracks the state of charge (SoC), controls the thermal cooling systems (liquid or air), and prevents dangerous over-charging or over-heating conditions.</p><h3>5. Onboard Charger (OBC)</h3><p>When you plug your car into an AC charging point (like a home wallbox), the electricity comes in as AC. The Onboard Charger converts this AC power into DC power so it can be stored in the battery pack. DC fast chargers bypass the OBC and supply DC power directly to the cells.</p>'
  },
  'ev-terminology': {
    title: 'EV Terminology',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">📖 EV Glossary</div><p class="editorial-callout-content">Mastering EV terms helps you compare models accurately, understand charging speeds, and drive more efficiently.</p></div><p>Entering the EV world means learning a new set of acronyms and units. This glossary explains the most common terms you will encounter in brochures and articles.</p><h3>Capacity and Power Units</h3><ul class="space-y-2 text-xs font-mono"><li><strong>kWh (Kilowatt-hour):</strong> The unit of battery capacity (energy volume). Think of it as the size of the fuel tank. A 40 kWh battery holds 40 units of electricity.</li><li><strong>kW (Kilowatt):</strong> The unit of electrical power (rate of flow). Used to measure motor output (1 kW ≈ 1.34 hp) and charger speeds. A 50 kW fast charger can output 50 kWh of energy in one hour.</li><li><strong>Wh/km (Watt-hours per kilometer):</strong> The unit of EV energy efficiency. Lower is better. A car that uses 130 Wh/km is more efficient than one that uses 180 Wh/km.</li></ul><h3>Charging Standards</h3><ul class="space-y-2 text-xs font-mono"><li><strong>CCS2 (Combined Charging System Type 2):</strong> The standard charging connector in India. It has a combined port that accepts Type 2 AC plugs at the top and DC fast plugs at the bottom.</li><li><strong>Type 2 Connector:</strong> The standard circular plug used for AC home wallboxes and slow public chargers.</li><li><strong>ZConnect / Tata EZ Charge:</strong> App ecosystems that let you locate chargers, pre-heat/cool your cabin, and monitor charging status remotely.</li></ul><h3>Performance Terminology</h3><ul class="space-y-2 text-xs font-mono"><li><strong>Regenerative Braking (Regen):</strong> A system where the motor reverses direction during braking, acting as a generator to slow the vehicle and feed electricity back into the battery pack.</li><li><strong>ARAI Range:</strong> The certified range tested in laboratory conditions by the Automotive Research Association of India. Real-world range is typically 70% to 85% of this value.</li><li><strong>State of Charge (SoC):</strong> The percentage of battery charge remaining (0% to 100%).</li></ul>'
  },
  'battery-chemistry': {
    title: 'Battery Chemistry',
    content: '<div class="editorial-callout"><div class="editorial-callout-title">🔋 Cell Chemistry Details</div><p class="editorial-callout-content">The metals inside your battery determine how long it lasts, how fast it charges, and how safe it is under extreme operating temperatures.</p></div><p>All electric vehicles use lithium-ion batteries, but the chemical composition of the cathode (positive electrode) varies significantly. Understanding these chemistries helps you make better purchasing decisions.</p><h3>LFP (Lithium Iron Phosphate)</h3><p>LFP batteries use iron phosphate as the cathode material. They do not contain nickel or cobalt, making them cheaper and more ethically sourced.</p><ul class="space-y-1 text-xs"><li><strong>Lifespan:</strong> Exceptional durability. Can survive 3,000+ charge cycles (equivalent to 10+ years of daily charging) before capacity drops below 80%.</li><li><strong>Safety:</strong> High thermal runaway threshold. Extremely safe in hot tropical climates like India.</li><li><strong>Best Practice:</strong> Can and should be charged to 100% regularly. This helps calibrate the BMS for accurate range estimation.</li></ul><h3>NMC (Nickel Manganese Cobalt)</h3><p>NMC batteries use a blend of nickel, manganese, and cobalt. They are widely used in long-range and premium electric vehicles.</p><ul class="space-y-1 text-xs"><li><strong>Energy Density:</strong> Very high. NMC batteries store more energy per unit weight, meaning longer range in a lighter package.</li><li><strong>Cold Weather:</strong> Performs significantly better than LFP in cold sub-zero climates.</li><li><strong>Best Practice:</strong> Keep charging capped at 80% for daily use to prevent accelerated cell degradation. Only charge to 100% when planning long highway road trips.</li></ul><h3>Solid-State Batteries (The Future)</h3><p>Solid-state batteries replace the liquid electrolyte found in current cells with a solid ceramic or polymer layer. This eliminates fire risk entirely, enables 2x higher energy density, and allows full charging in under 10 minutes. Global commercial production is expected between 2027 and 2030.</p>'
  },
  'lfp-vs-nmc': {
    title: 'LFP vs NMC Battery Pack',
    content: '<p>Choosing between LFP and NMC battery chemistry is one of the most important decisions when buying an EV. Here is a detailed comparison.</p><h3>LFP (Lithium Iron Phosphate)</h3><p><strong>Advantages:</strong> Safer — highly resistant to thermal runaway (less fire risk). Longer lifespan — 3,000+ charge cycles (10+ years of daily use). No cobalt — ethical sourcing, lower cost. Better high-temperature performance. Can be charged to 100% regularly without significant degradation.</p><p><strong>Disadvantages:</strong> Lower energy density (heavier for same capacity). Reduced cold-weather performance. Lower voltage plateau makes precise SoC estimation harder.</p><h3>NMC (Nickel Manganese Cobalt)</h3><p><strong>Advantages:</strong> Higher energy density (more range, lighter weight). Better cold-weather performance. Higher discharge rate (better for performance EVs).</p><p><strong>Disadvantages:</strong> More expensive. Shorter cycle life (1,500-2,000 cycles). Contains cobalt (ethical and supply chain concerns). Higher risk of thermal runaway. Best charged only to 80% for daily use to preserve battery health.</p><h3>Which Should You Choose?</h3><p>For most Indian buyers, LFP is the better choice due to our warm climate, the importance of long battery life in a hot country, lower cost, and the ability to charge to 100% daily. NMC is preferred for long-range EVs and performance vehicles where weight and cold-weather performance matter.</p>'
  },
  'ac-vs-dc': {
    title: 'AC vs DC Charging',
    content: '<p>Understanding the difference between AC and DC charging is fundamental to EV ownership. Each has its ideal use cases.</p><h3>AC Charging (Alternating Current)</h3><p>AC is the type of electricity supplied by the grid. When you plug into a home socket or AC wallbox, the car\'s onboard charger converts AC to DC to charge the battery. This conversion limits the speed — typical AC charging speeds are 2-22 kW. A full charge takes 4-12 hours depending on the battery size and charger power.</p><p>AC charging is ideal for overnight charging at home or 6-8 hour charging at work. It is gentler on the battery, generates less heat, and costs less (residential electricity rates are lower than DC charger tariffs).</p><h3>DC Charging (Direct Current)</h3><p>DC fast chargers supply DC electricity directly to the battery, bypassing the car\'s onboard charger. This allows much higher power levels — 50 kW to 350 kW. A 10% to 80% charge typically takes 20-45 minutes depending on the car and charger capability.</p><p>DC charging is essential for highway travel and road trips when you need to add range quickly. However, frequent DC fast charging can accelerate battery degradation over time.</p><h3>Connector Types</h3><p>India uses the CCS2 (Combined Charging System Type 2) standard for both AC and DC charging through a single multi-pin connector. CHAdeMO was used by older Nissan Leaf models but is being phased out in India.</p>'
  },
  'v2l': {
    title: 'Vehicle-to-Load (V2L)',
    content: '<p>V2L (Vehicle-to-Load) is a feature that lets you use your EV\'s battery as a mobile power source. It transforms your car into a giant portable power bank.</p><h3>How V2L Works</h3><p>V2L uses a bidirectional inverter in the vehicle to convert DC from the battery into standard AC electricity (230V, 50Hz in India). A special V2L adapter plugs into the car\'s charging port, giving you one or more standard 3-pin sockets to plug appliances directly into your car.</p><h3>Power Output</h3><p>Most V2L systems provide 1.5-3.5 kW of power, enough to run: laptop chargers (60-100W), LED TVs (100-200W), fans (50-75W), small refrigerators (200-400W), power tools (500-1500W), and even some medical equipment.</p><h3>Use Cases</h3><p>V2L is incredibly useful for: camping (power lights, cookers, speakers), outdoor events, emergency backup during power cuts, construction sites, tailgate parties, and powering equipment at remote locations.</p><h3>Battery Impact</h3><p>Using V2L draws power from the same battery used for driving. A 40 kWh battery with V2L at 2 kW can power a refrigerator + fans + lights for over 24 hours. The impact on battery health is minimal since the discharge rate is very gentle compared to driving.</p>'
  },
  'battery-health': {
    title: 'Battery Health Guide',
    content: '<div class="border-b border-zinc-200 pb-6 mb-6"><span class="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block mb-3">BATTERY ENGINEERING / HEALTH & MAINTENANCE</span><h1 class="text-3xl md:text-5xl font-black tracking-tight text-black leading-tight mb-4">EV Battery Health Guide</h1><p class="text-sm text-zinc-600 font-mono leading-relaxed max-w-2xl">Maximising your EV battery\'s lifespan ensures long-term performance, preserves resale value, and reduces your total cost of ownership. This guide covers everything from optimal charging habits to maintenance best practices.</p><div class="flex flex-wrap gap-3 mt-4"><span class="font-mono text-[9px] text-zinc-500 border border-zinc-200 rounded-full px-3 py-1">📖 12 min read</span><span class="font-mono text-[9px] text-zinc-500 border border-zinc-200 rounded-full px-3 py-1">📅 Updated June 2026</span><span class="font-mono text-[9px] text-zinc-500 border border-zinc-200 rounded-full px-3 py-1">🔋 Beginner Friendly</span></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-8"><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5"><div class="flex items-center gap-3 mb-3"><span class="text-xl">⚡</span><span class="font-bold text-xs uppercase tracking-wide">Optimal Charging Habits</span></div><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">For LFP batteries, charging to 100% daily is fine and helps BMS calibration. For NMC batteries, keep daily charging between 20-80% to reduce cell stress. Never let the battery drop below 10% regularly.</p></div><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5"><div class="flex items-center gap-3 mb-3"><span class="text-xl">🌡️</span><span class="font-bold text-xs uppercase tracking-wide">Temperature Management</span></div><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Heat accelerates chemical degradation. Park in shade, use scheduled charging during cooler night hours, and precondition the battery before DC fast charging in extreme temperatures.</p></div><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5"><div class="flex items-center gap-3 mb-3"><span class="text-xl">🔌</span><span class="font-bold text-xs uppercase tracking-wide">Fast vs Slow Charging</span></div><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">AC slow charging is gentler and generates less heat. DC fast charging is convenient for road trips but frequent use can accelerate degradation by 2-5% over 1,00,000 km.</p></div><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5"><div class="flex items-center gap-3 mb-3"><span class="text-xl">📊</span><span class="font-bold text-xs uppercase tracking-wide">State of Health (SOH)</span></div><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">SOH measures current battery capacity relative to new. A new battery starts at 100% and naturally declines to 80-90% after 8-10 years. Modern EVs lose only 1-2% capacity per year.</p></div></div><h3>Best Practices for Long Battery Life</h3><p>Following these proven practices will maximise your battery\'s usable life and preserve the vehicle\'s resale value over many years of ownership.</p><div class="border-l-2 border-emerald-500 pl-4 my-4 bg-emerald-50/30 py-3 pr-2 rounded-r-lg"><span class="text-emerald-700 font-bold uppercase text-[9px] tracking-wider block mb-1">💡 Tip</span><p class="text-xs leading-relaxed text-zinc-700 font-mono">The single most impactful habit: keep your battery between 20% and 80% for daily use. This alone can reduce degradation by up to 50%.</p></div><ul class="space-y-3 text-xs font-mono my-4"><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">1</span><div><strong class="text-black">Maintain 20–80% State of Charge</strong><br><span class="text-zinc-500">For daily commuting, keep the battery between 20% and 80%. This avoids extreme voltage stress at high and low charge levels.</span></div></li><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">2</span><div><strong class="text-black">Use Scheduled Charging</strong><br><span class="text-zinc-500">Program your EV to finish charging just before departure. This minimises time spent at high state of charge, which accelerates degradation.</span></div></li><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">3</span><div><strong class="text-black">Limit DC Fast Charging</strong><br><span class="text-zinc-500">Reserve DC fast charging for road trips. For daily top-ups, use AC home or workplace charging — it generates less heat and is gentler on cells.</span></div></li><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">4</span><div><strong class="text-black">Park in Shade</strong><br><span class="text-zinc-500">In India\'s hot climate, parking in direct sunlight raises battery temperature significantly. Always prefer shaded or covered parking.</span></div></li><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">5</span><div><strong class="text-black">Update BMS Firmware</strong><br><span class="text-zinc-500">Manufacturers release battery management system updates that optimise charging curves and thermal management. Keep your EV\'s software current.</span></div></li><li class="flex items-start gap-3"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">6</span><div><strong class="text-black">Monthly Calibration</strong><br><span class="text-zinc-500">Every 1-2 months, discharge below 10% and charge to 100% to let the BMS recalibrate State of Charge estimation. Keeps your range display accurate.</span></div></li></ul><div class="border border-zinc-200 bg-amber-50/40 rounded-xl p-5 my-6 border-l-4 border-l-amber-500"><div class="flex items-start gap-3"><span class="text-lg flex-shrink-0 mt-0.5">⚠️</span><div><span class="font-bold text-xs uppercase tracking-wide block mb-1">Important: Chemistry Matters</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">LFP and NMC batteries have different optimal charging profiles. Always check your owner\'s manual to confirm which chemistry your EV uses and follow the manufacturer\'s specific charging recommendations.</p></div></div></div><h3>Understanding Battery Degradation</h3><p>Battery degradation is the gradual loss of capacity that all lithium-ion batteries experience. Two primary mechanisms drive this process: <strong>cycle aging</strong> (capacity loss from charge/discharge cycles) and <strong>calendar aging</strong> (capacity loss from time and temperature, even when idle).</p><p>Calendar aging is actually the dominant factor for most EV owners. A battery stored at 100% charge in a hot garage degrades faster than one cycled daily between 20-80% in moderate temperatures. This is why parking conditions often matter more than charging frequency.</p><div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"><div class="border border-zinc-200 rounded-xl p-5 bg-white"><span class="font-bold text-[10px] uppercase tracking-wide block mb-2 text-emerald-600">LFP Batteries</span><ul class="space-y-1.5 text-[11px] text-zinc-600 font-mono"><li>• 3,000+ charge cycles</li><li>• 80-85% capacity after 10,00,000 km</li><li>• Can be charged to 100% daily</li><li>• Better heat tolerance</li></ul></div><div class="border border-zinc-200 rounded-xl p-5 bg-white"><span class="font-bold text-[10px] uppercase tracking-wide block mb-2 text-blue-600">NMC Batteries</span><ul class="space-y-1.5 text-[11px] text-zinc-600 font-mono"><li>• 1,500-2,000 charge cycles</li><li>• 70-80% capacity after 5,00,000 km</li><li>• Best charged to 80% daily</li><li>• Higher energy density, lighter</li></ul></div></div><h3>State of Health (SOH) — The Key Metric</h3><p>State of Health (SOH) represents your battery\'s current usable capacity as a percentage of its original capacity. A battery at 90% SOH can store 90% of the energy it could when new. This is the single most important indicator of your battery\'s condition.</p><p>Most EV dashboards display SOH indirectly through the range display. For an exact reading, use a dedicated OBD-II scanner or check the manufacturer\'s app. In India, manufacturers typically warrant the battery to maintain at least 70% SOH for 8 years or 1,60,000 km.</p><div class="key-takeaways-card"><div class="key-takeaways-title">✅ Monthly Maintenance Checklist</div><ul class="key-takeaways-list space-y-2 text-xs font-mono"><li>✓ Check tyre pressure — under-inflated tyres increase rolling resistance and battery draw</li><li>✓ Clean battery cooling vents — blocked vents cause thermal stress during fast charging</li><li>✓ Avoid frequent 0-100% cycles — partial charges (20-80%) are healthier for daily use</li><li>✓ Prioritise AC charging — limit DC fast charging to once or twice per week maximum</li><li>✓ Park indoors or in shade — reduce calendar aging from heat exposure</li><li>✓ Annual BMS diagnostic — request a full battery health report during yearly service</li></ul></div><h3>Frequently Asked Questions</h3><div class="flex flex-col gap-3 my-6"><div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden"><button class="accordion-btn w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"><span>How fast do EV batteries degrade in India\'s climate?</span><span class="accordion-icon text-zinc-400 font-mono text-base">+</span></button><div class="accordion-content"><div class="px-4 pb-4"><div class="pt-3 border-t border-zinc-100"><p class="text-[11px] text-zinc-650 leading-relaxed font-mono">In India\'s warm climate, proper battery care is even more important. With good practices — shade parking, AC charging, 20-80% usage — expect 1-2% annual degradation. Without care, degradation can accelerate to 3-4% per year, significantly reducing range over the vehicle\'s lifetime.</p></div></div></div></div><div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden"><button class="accordion-btn w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"><span>Should I charge my EV to 100% every night?</span><span class="accordion-icon text-zinc-400 font-mono text-base">+</span></button><div class="accordion-content"><div class="px-4 pb-4"><div class="pt-3 border-t border-zinc-100"><p class="text-[11px] text-zinc-650 leading-relaxed font-mono">For <strong>LFP batteries</strong>: yes — charging to 100% daily is safe and recommended for BMS calibration. For <strong>NMC batteries</strong>: charge to 80% for daily use and only charge to 100% before long trips. Check your vehicle manual to confirm your battery chemistry.</p></div></div></div></div><div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden"><button class="accordion-btn w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"><span>Is it bad to use DC fast charging every day?</span><span class="accordion-icon text-zinc-400 font-mono text-base">+</span></button><div class="accordion-content"><div class="px-4 pb-4"><div class="pt-3 border-t border-zinc-100"><p class="text-[11px] text-zinc-650 leading-relaxed font-mono">Yes. Exclusive DC fast charging can cause 2-5% additional degradation over 1,00,000 km compared to AC charging. The high heat generated during rapid charging stresses cell chemistry. Use DC fast charging primarily for highway trips and rely on AC charging for daily needs.</p></div></div></div></div><div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden"><button class="accordion-btn w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors"><span>What happens when battery SOH drops below 70%?</span><span class="accordion-icon text-zinc-400 font-mono text-base">+</span></button><div class="accordion-content"><div class="px-4 pb-4"><div class="pt-3 border-t border-zinc-100"><p class="text-[11px] text-zinc-650 leading-relaxed font-mono">Under warranty (8 years / 1,60,000 km), the manufacturer must repair or replace the battery if SOH falls below 70%. Post-warranty, a battery at 60-70% SOH can still be used for daily commuting with reduced range. Replacement costs continue to decrease as battery technology improves.</p></div></div></div></div></div><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-6 my-6"><div class="flex items-start gap-4"><span class="text-2xl flex-shrink-0">📋</span><div><span class="font-bold text-sm uppercase tracking-wide block mb-2">Summary</span><p class="text-xs text-zinc-600 leading-relaxed font-mono">Battery health is determined by how you charge, where you park, and how often you use DC fast charging. By maintaining 20-80% charge for daily use, parking in shade, using AC charging as your primary method, and keeping BMS firmware updated, you can ensure your EV battery delivers reliable performance for 10+ years while retaining strong resale value.</p></div></div></div>'
  },
  'regenerative-braking': {
    title: 'Regenerative Braking',
    content: '<p>Regenerative braking is one of the most innovative features of electric vehicles. It captures energy that would otherwise be wasted during braking and feeds it back into the battery.</p><h3>How It Works</h3><p>When you lift your foot off the accelerator or press the brake pedal in an EV, the electric motor reverses its role and acts as a generator. The motor\'s resistance slows the vehicle while converting kinetic energy into electrical energy, which is sent back to the battery.</p><h3>Driving with One Pedal</h3><p>Many EVs offer adjustable levels of regenerative braking, from mild (coasts like a petrol car) to strong (decelerates rapidly, allowing one-pedal driving). In strong regen mode, you can handle most driving situations using only the accelerator pedal — press to go, release to slow down.</p><h3>Efficiency Gains</h3><p>Regenerative braking can recover 15-30% of the energy that would otherwise be lost as heat during braking. In city driving with frequent stop-start traffic, this can extend your range by 10-20% compared to highway driving where regenerative opportunities are fewer.</p><h3>Real Benefits</h3><p>Beyond energy recovery, regen braking reduces wear on brake pads (they can last 1,00,000+ km), provides smoother deceleration, and gives the driver more control in slippery conditions by reducing the need for hydraulic brake application.</p>'
  },
  'highway-charging': {
    title: 'Highway Charging Strategies',
    content: '<p>Planning charging stops for highway travel requires strategy to minimize total trip time while ensuring you never run out of charge.</p><h3>Pre-Trip Planning</h3><p>Use EV trip planning apps (PlugShare, Tata Power EZ Charge, Statiq) to identify DC fast chargers along your route. Mark primary and backup charging locations. Check charger status (available, in use, out of service) before departing.</p><h3>Optimal Charging Windows</h3><p>DC fast charging is fastest between 10% and 80% state of charge. Above 80%, charging speed drops dramatically (sometimes to 20-30 kW). Plan each charging stop to arrive at 5-15% SoC and leave at 60-80% SoC to minimize total charging time.</p><h3>Charge While You Eat</h3><p>Time your charging stops with meals and breaks. A 30-40 minute charging session aligns perfectly with a lunch break at a highway restaurant that has a charger. Many highway charging stations in India are located at or near food establishments.</p><h3>Backup Plans</h3><p>Always have a Plan B. If your primary charging stop is occupied or broken, know the next closest charger. Carry your portable 3-pin charging cable as an emergency backup (even 2-3 km of range per hour can get you to a working charger in extreme situations).</p><h3>Battery Preconditioning</h3><p>Some EVs can preheat or precool the battery before arriving at a DC fast charger. This ensures the battery is at optimal temperature for the fastest charging speed. Enable this feature in your car\'s navigation when routing to a charger.</p>'
  },
  'ground-clearance': {
    title: 'Ground Clearance Explained',
    content: '<p>Ground clearance is an important consideration when buying an EV, especially for Indian road conditions. Here is everything you need to know.</p><h3>What is Ground Clearance?</h3><p>Ground clearance is the distance between the lowest point of the vehicle\'s underbody and the road surface. It is measured with the vehicle unladen (no passengers or cargo) on a flat surface. For EVs, the lowest point is typically the battery pack enclosure mounted underneath the floor.</p><h3>Why It Matters for EVs</h3><p>EVs have their heavy battery packs mounted on the floor, which naturally lowers the centre of gravity. While this improves handling and stability, it means the battery pack can be the lowest point of the car. Bumps, speed breakers, and uneven roads can potentially scrape the battery housing if ground clearance is insufficient.</p><h3>Typical EV Ground Clearance</h3><p>Compact EVs: 160-180 mm (e.g., Tata Nexon EV: 190 mm). Sedans: 140-165 mm (e.g., Hyundai Ioniq 6: 141 mm). SUVs: 180-220 mm (e.g., MG ZS EV: 180 mm). Premium SUVs: 170-210 mm (e.g., Hyundai Ioniq 5: 180 mm, Kia EV6: 178 mm). For context, most Indian speed breakers are designed for vehicles with at least 160 mm clearance.</p><h3>Battery Protection</h3><p>All modern EV battery packs are housed in rugged metal enclosures with impact protection and IP67 water/dust resistance. Manufacturers test batteries against bottom impacts and puncture resistance. Still, it is wise to avoid deep potholes and sharp objects on the road.</p><h3>Tips for Low Clearance EVs</h3><p>Approach speed breakers at an angle (one wheel at a time). Load the vehicle evenly to avoid sagging. Consider aftermarket spring assisters if you regularly drive with heavy loads. Know your car\'s clearance and plan routes accordingly.</p>'
  },
  'charging-etiquette': {
    title: 'Charging Etiquette',
    content: '<p>As EV adoption grows in India, proper charging etiquette ensures a positive experience for all EV owners sharing public charging infrastructure.</p><h3>Move Your EV When Charging is Complete</h3><p>Once your EV reaches the desired state of charge (typically 80% for DC fast charging), move it to a regular parking spot if there are other EVs waiting. Many charging apps show real-time availability and queue status. Being considerate prevents charging congestion.</p><h3>Don\'t ICE the Charging Spot</h3><p>ICE stands for Internal Combustion Engine — parking a non-EV in an EV charging spot is called ICE-ing. Even if you drive an EV, parking in a charging spot without plugging in (or after charging is complete) is considered poor etiquette. Charging spots are for charging, not regular parking.</p><h3>Handle Cables with Care</h3><p>Charging cables are expensive and delicate. Plug and unplug gently. Do not yank the cable. Coil it back neatly after use. Report damaged cables or chargers to the network operator through the app.</p><h3>Queue Management</h3><p>If there is a queue, note who arrived before you. Most charging apps show current occupancy and wait times. Be prepared to wait 15-30 minutes during peak travel times. If there are multiple stalls, coordinate with other EV owners to share if your cars can charge at different power levels.</p><h3>Charging Network Etiquette</h3><p>Create accounts on major charging networks (Tata Power EZ, ChargeZone, Statiq, Jio-bp) before your trip. Keep sufficient balance in your wallet. Check charger status before driving to it. Rate and review chargers to help fellow EV owners.</p>'
  }
});

// --- Resources Database ---
const RESOURCES_DATABASE = {
  'faqs': {
    title: 'FAQs',
    content: '<p>Find quick answers to the most frequently asked questions about electric vehicles in India.</p><h3>General Questions</h3><p><strong>Q: Are EVs really cheaper to run than petrol cars?</strong> A: Yes. EVs cost approximately ₹1-1.5 per km to run, compared to ₹8-9 per km for petrol cars. Over 15,000 km per year, an EV saves you ₹75,000-90,000 in fuel costs.</p><p><strong>Q: How long does it take to charge an EV?</strong> A: From empty to full: 10-15 hours on a standard 15A socket, 4-6 hours on a 7.2 kW AC wallbox, and 25-45 minutes on a DC fast charger (10% to 80%).</p><p><strong>Q: What is the real-world range of EVs?</strong> A: Most EVs achieve 70-85% of their ARAI certified range in real-world driving. For example, a car with 465 km ARAI range delivers 350-400 km in mixed driving conditions.</p><p><strong>Q: Can I install a charger in my apartment?</strong> A: Yes. Under the Electricity Act 2003, RWAs cannot unreasonably refuse EV charger installation. Submit a formal request and they must respond within 15 days.</p><p><strong>Q: What government subsidies are available?</strong> A: FAME-III provides up to ₹3.5 lakh subsidy for passenger EVs. Most states offer 100% road tax exemption. Section 80EEB provides tax deduction on up to ₹1.5 lakh of EV loan interest.</p>'
  },
  'apartment-noc-letter': {
    title: 'Apartment NOC Letter Template',
    content: '<p>Getting approval from your Resident Welfare Association (RWA) or apartment management is an important step toward installing an EV charger at your parking spot. Use the template below to submit a formal request.</p><h3>Sample Application Letter</h3><pre style="background:#f4f4f5;padding:16px;font-size:11px;line-height:1.7;white-space:pre-wrap;border-radius:8px;font-family:monospace;">Date: [Insert Date]\n\nTo,\nThe Secretary / Managing Committee,\n[Name of RWA / Apartment Name]\n[Address]\n\nSubject: Request for Permission to Install EV Charger at Parking Spot No. [Number]\n\nDear Sir/Madam,\n\nI am a resident of [Apartment Name], Flat No. [Number], Tower/Wing [Name], and the owner of parking spot no. [Number]. I have recently purchased/am planning to purchase an electric vehicle (make: [EV Model], registration no.: [Number]).\n\nI request permission to install a 7.2 kW EV charging unit at my designated parking spot. The installation will be carried out by an authorized/licensed electrician with proper safety measures, including:\n\n1. Dedicated 40A MCB from my meter box\n2. Proper earthing as per ISI standards\n3. Weatherproof enclosure for the charging unit\n4. Individual metering to ensure electricity costs are billed to my flat\n\nAs per the Electricity Act 2003 and [State] Electricity Regulatory Commission guidelines, EV charger installations are to be facilitated by RWAs and management associations. I kindly request your approval at the earliest.\n\nThank you for your support in promoting green mobility.\n\nYours faithfully,\n[Your Name]\n[Flat Number & Tower]\n[Contact Number]\n[Email ID]\n\nEnclosures:\n1. Copy of vehicle registration\n2. Layout plan showing parking spot and charger location\n3. Electrician\'s safety certificate</pre><h3>Tips for Getting Approval</h3><p>Include a layout diagram showing the proposed wiring route from your meter box to the parking spot. Offer to bear all installation and metering costs. Reference the Electricity Act 2003 and your state\'s EV policy for legal backing. Join with other EV-owning residents to make a joint request — RWAs respond better to group requests.</p>'
  }
};

// --- Blog Database ---
const BLOG_DATABASE = [
  {
    id: 'blog-1',
    slug: 'future-of-ev-charging-in-india',
    title: 'The Future of EV Charging in India',
    excerpt: 'How India is building a nationwide EV charging network and what it means for EV adoption.',
    date: 'Oct 15, 2026',
    author: 'EV Car Wale Team',
    content: '<p>India is rapidly building out its EV charging infrastructure to support the growing fleet of electric vehicles on its roads. With over 12,000 public charging stations operational across the country as of 2026, the charging landscape is evolving quickly.</p><p>The government has set an ambitious target of installing one public charger for every 20 EVs by 2028. Major oil marketing companies (IOCL, BPCL, HPCL) are converting thousands of existing petrol pumps into combined fuel+charging stations.</p><p>Private players like Tata Power, Jio-bp, and Zeon Charging are racing to install DC fast chargers along highway corridors and in urban centers. The competition is driving down charging costs while improving reliability.</p><p>Perhaps the most exciting development is the emergence of battery swapping stations for two-wheelers and three-wheelers, which can replace a depleted battery with a fully charged one in under 2 minutes, eliminating range anxiety entirely for these segments.</p>'
  },
  {
    id: 'blog-2',
    slug: 'top-5-ev-myths-debunked',
    title: 'Top 5 EV Myths Debunked',
    excerpt: 'Separating fact from fiction: the most common misconceptions about electric vehicles in India.',
    date: 'Oct 10, 2026',
    author: 'EV Car Wale Team',
    content: '<p>Despite the rapid growth of EV adoption in India, several myths persist that deter potential buyers. Here are the top 5 myths debunked.</p><p><strong>Myth 1: EVs have very limited range.</strong> Fact: Most modern EVs offer 300-500 km of real-world range, which covers 98% of daily commuting needs. Even the most affordable EVs offer 250+ km range.</p><p><strong>Myth 2: EVs are more expensive to maintain.</strong> Fact: EVs have fewer moving parts and require no oil changes, timing belt replacements, or exhaust system repairs. Annual maintenance costs are typically 40-50% lower than petrol cars.</p><p><strong>Myth 3: EVs are not suitable for Indian weather.</strong> Fact: Modern EVs have sophisticated battery thermal management systems that perform well in temperatures up to 50°C, and many EVs are designed and tested specifically for Indian conditions.</p><p><strong>Myth 4: Batteries need frequent replacement.</strong> Fact: EV batteries are designed to last the lifetime of the vehicle. Most manufacturers offer 8-year/1,60,000 km warranties, and batteries typically retain 70-80% capacity even after 10 years.</p><p><strong>Myth 5: Charging infrastructure is insufficient.</strong> Fact: With over 12,000 public charging stations and growing rapidly, plus the ability to charge at home, most EV owners never experience charging inconvenience. Home charging covers 90% of daily needs.</p>'
  },
  {
    id: 'blog-3',
    slug: 'guide-to-ev-loans-in-india',
    title: 'Complete Guide to EV Loans in India',
    excerpt: 'Everything you need to know about financing your electric vehicle purchase with EV-specific loans.',
    date: 'Oct 5, 2026',
    author: 'EV Car Wale Team',
    content: '<p>Financing an EV purchase in India has become easier with several banks and NBFCs offering EV-specific loan products with attractive interest rates and terms.</p><p>Major banks like SBI, HDFC, ICICI, Axis, and Kotak offer EV loans with interest rates starting from 8.5% per annum, often 0.5-1% lower than conventional car loans due to the government\'s priority sector lending classification for EVs.</p><p>Loan amounts typically cover up to 90% of the on-road price, with tenures ranging from 3-7 years. The maximum loan amount varies by bank but most offer up to ₹50 lakh for passenger EVs.</p><p>Key documents required: KYC documents (Aadhaar, PAN), income proof (salary slips/IT returns for salaried, bank statements for self-employed), address proof, and the vehicle quotation from the dealer.</p><p>Under Section 80EEB of the Income Tax Act, you can claim a deduction of up to ₹1.5 lakh on the interest paid on your EV loan, saving up to ₹46,800 per year in taxes for those in the 30% tax bracket.</p>'
  }
];

// --- Brand Logo Mapping ---
const BRAND_LOGO_MAP = {
  'audi': 'AUDI_LOGO.JPG',
  'bmw': 'BMW_LOGO.jpeg',
  'byd': 'BYD_LOGO.jpeg',
  'citroen': 'CITROEN_logo.jpg',
  'honda': 'HONDA_LOGO.JPEG',
  'hyundai': 'HYUNDAI_LOGO.jpeg',
  'isuzu': 'isuzu_logo.jpeg',
  'jeep': 'jeep_logo.jpeg',
  'kia': 'KIA_LOGO.jpeg',
  'mahindra': 'MAHINDRA_LOGO.jpeg',
  'maruti-suzuki': 'maruti_suzuki_logo.jpeg',
  'mercedes-benz': 'MERCEDES_LOGO.jpeg',
  'mg': 'MG_LOGO.jpeg',
  'nissan': 'nissan_logo.jpeg',
  'porsche': 'PORSCHE_logo.jpeg',
  'renault': 'RENAULT_LOGO.jpeg',
  'skoda': 'SKODA_LOGO.jpeg',
  'tata': 'TATA_LOGO.jpeg',
  'toyota': 'TOYOTA_LOGO.jpeg',
  'vinfast': 'VINFAST_LOGO.jpeg',
  'volkswagen': 'VOLKSWAGEN_LOGO.jpeg',
  'volvo': 'volvo_logo.jpeg',
  'tesla': 'TESLA_LOGO.PNG',
  'ferrari': 'ferrari_logo.jpeg',
  'genesis': 'GENESIS_LOGO.jpeg',
  'lotus': 'LOTUS_LOGO.png',
  'lexus': 'LEXUS_LOGO.jpeg',
  'mini': 'MINI_LOGO.JPG',
  'pmv': 'PMV_LOGO.jpeg',
  'pravaig': 'PRAVAIG_LOGO.png',
  'rolls-royce': 'ROLLS_ROYCLE.JPG',
  'vayve': 'VAYVE_LOGO.jpeg',
  'blinq': 'BLINQ_LOGO.jpeg',
  'strom': 'STROM_LOGO.jpeg',
};
function getBrandLogoUrl(brandId) {
  return getS3ImageUrl('LOGOS/' + (BRAND_LOGO_MAP[brandId] || brandId.toUpperCase() + '_LOGO.jpeg'));
}
function getBrandInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

// --- Insights Master Database ---
const INSIGHTS_DATABASE = {
  'latest-news': [
    { id: 'in-news-1', title: 'FAME-III Subsidy Allocations Finalized', subtitle: 'Government announces ₹12,500 crore incentive package', excerpt: 'The FAME-III framework introduces ₹12,500 crore in incentives, prioritizing localization of battery modules and public charging systems.', date: 'Oct 12, 2026', author: 'EV Bureau', readTime: '4 min read', tag: 'Policy', image: '', content: '<p>The Ministry of Heavy Industries has officially finalized the much-anticipated FAME-III (Faster Adoption and Manufacturing of Electric Vehicles) subsidy framework. With a record budget allocation of ₹12,500 crore, the scheme aims to aggressively drive electric vehicle adoption across India while shifting the primary focus toward deep localization of the supply chain.</p><h3>Core Budget Allocations</h3><p>The FAME-III framework breaks down the ₹12,500 crore budget across different key areas to ensure balanced development of the ecosystem:</p><ul><li><strong>Electric Two-Wheelers:</strong> ₹4,500 crore allocated. Subsidies are capped at ₹10,000 per kWh of battery capacity, with a maximum limit of ₹35,000 per vehicle.</li><li><strong>Electric Passenger Cars:</strong> ₹3,500 crore allocated. Reserved primarily for commercial fleets and taxi operators, with incentives of up to ₹15,000 per kWh (capped at ₹2.5 lakh per vehicle).</li><li><strong>Public Transport & Buses:</strong> ₹3,000 crore dedicated to helping municipal corporations deploy over 8,000 electric buses.</li><li><strong>Charging Infrastructure:</strong> ₹1,500 crore set aside for establishing high-density DC charging corridors.</li></ul><h3>Localization and Compliance Rules</h3><p>Unlike previous phases, FAME-III introduces strict compliance rules regarding domestic value addition. To qualify for subsidies, OEMs must manufacture battery modules, thermal management systems, and electric motors locally. Starting April 2027, vehicles using imported pre-assembled battery packs will be disqualified from receiving central incentives.</p><h3>Expected Market Impact</h3><p>Industry experts predict this announcement will stabilize retail prices of entry-level electric two-wheelers and passenger vehicles. By establishing a clear multi-year roadmap, the government has provided automakers the clarity needed to invest in long-term domestic component manufacturing plants.</p>' },
    { id: 'in-news-2', title: 'Highway Fast Charger Corridor Expands', subtitle: '350 kW hyper-chargers coming to Golden Quadrilateral', excerpt: 'Strategic partnerships aim to install DC fast chargers every 50 km on national expressways.', date: 'Oct 10, 2026', author: 'Tech Desk', readTime: '3 min read', tag: 'Infra', image: '', content: '<p>In a major boost for inter-city electric vehicle travel, a joint venture between state-owned oil marketing companies and private charge point operators has announced the expansion of the national highway fast-charging network. The project will bring ultra-fast 350 kW hyper-chargers to India\'s Golden Quadrilateral highway network.</p><h3>Electrifying Major Travel Routes</h3><p>The expansion plan is specifically designed to eliminate range anxiety on high-traffic travel corridors. Over 250 new fast-charging hubs will be established along the following key routes:</p><ul><li><strong>Delhi - Mumbai Expressway:</strong> Chargers spaced every 40 km, including dual 350 kW liquid-cooled dispensing units at major rest stops.</li><li><strong>Mumbai - Pune - Bangalore Corridor:</strong> High-density charging hubs with dedicated lanes for passenger EVs.</li><li><strong>Chennai - Bangalore - Kochi Route:</strong> Integration of solar-roofed canopies with battery storage units to ensure continuous operations during power outages.</li></ul><h3>Next-Gen 350 kW Hyper-Charging Technology</h3><p>The inclusion of 350 kW hyper-chargers represents a massive leap from the standard 50 kW DC chargers currently common on Indian highways. Compatible vehicles using 800V architecture (such as the Hyundai Ioniq 5 and Kia EV6) can replenish their battery from 10% to 80% in just 15 to 18 minutes, matching the time of a standard highway tea break.</p><h3>Unified Payment & Open Loop API Protocols</h3><p>To simplify user experience, the consortium is launching a unified open-loop payment system. EV owners will be able to initiate charging and pay across different networks (Tata Power, ChargeZone, Statiq, Jio-bp) using a single RFID card or UPI interface, eliminating the need to download multiple mobile apps.</p>' },
    { id: 'in-news-3', title: 'Solid-State Modules Enter Trial Phase', subtitle: '800 km range battery technology hits the road', excerpt: 'Solid-state battery prototypes promise up to 800 km range per charge with complete thermal runaway resistance.', date: 'Oct 08, 2026', author: 'EV Bureau', readTime: '5 min read', tag: 'Tech', image: '', content: '<p>The global race for the next generation of battery technology has reached a critical milestone as three automotive consortiums have commenced real-world road trials of solid-state battery modules. Promising up to 800 km of range on a single charge and near-instant charging speeds, solid-state batteries are set to redefine the electric mobility landscape.</p><h3>What Makes Solid-State Batteries Revolutionary?</h3><p>Current electric cars rely on lithium-ion batteries that use liquid electrolytes to carry electrical charges between anodes and cathodes. Solid-state batteries replace this liquid with a solid ceramic or polymer electrolyte. This simple change unlocks massive advantages:</p><ul><li><strong>Double the Energy Density:</strong> Solid-state cells can store up to 450-500 Wh/kg, compared to 240-260 Wh/kg for the best NMC liquid cells. This allows for smaller, lighter battery packs that deliver double the driving range.</li><li><strong>Complete Fire Safety:</strong> Eliminating the flammable liquid electrolyte removes the risk of thermal runaway, making battery fires virtually impossible.</li><li><strong>Ultra-Fast Charging:</strong> Cells can absorb energy at extremely high currents without creating dendrites (metallic deposits that short-circuit cells), allowing 10% to 80% charging in under 10 minutes.</li></ul><h3>Indian Road and Temperature Trials</h3><p>Specialized testing centers in Pune and Bangalore are conducting high-temperature trials to evaluate how solid-state cells perform under extreme heat. Early data suggests these cells are highly stable up to 55°C, reducing the need for heavy, energy-consuming active liquid cooling systems.</p><h3>Commercialization Timeline</h3><p>While the trials are highly successful, manufacturing solid-state batteries at scale remains a challenge due to clean-room requirements and high material costs. Industry analysts estimate the first commercial deployment in premium luxury electric vehicles will begin in late 2028, with mass-market adoption following by 2031.</p>' },
    { id: 'in-news-4', title: 'EV Sales Cross 2 Million Mark in India', subtitle: 'Annual EV registrations hit record high in FY 2025-26', excerpt: 'India\'s EV market has achieved a historic milestone with annual sales crossing the 2 million unit mark.', date: 'Oct 05, 2026', author: 'Market Desk', readTime: '3 min read', tag: 'Market', image: '', content: '<p>India\'s electric vehicle market has recorded a historic milestone as cumulative annual EV registrations officially crossed the 2 million unit mark in FY 2025-26. This representing an outstanding 67% year-on-year growth compared to the previous fiscal period, highlighting the rapid pace of electrification in the country.</p><h3>Sales Breakdown by Segment</h3><p>The sales data shows that the EV transition is being led by practical, cost-effective urban mobility options:</p><ul><li><strong>Electric Two-Wheelers:</strong> Accounted for 1.4 million registrations. Brand models from Ola Electric, TVS, and Ather led this segment, driven by lower total cost of ownership.</li><li><strong>Electric Three-Wheelers (L5 & e-Rickshaws):</strong> Accounted for 450,000 registrations. Electrification in this segment has reached over 55% as commercial operators realize massive fuel savings.</li><li><strong>Electric Passenger Cars:</strong> Reached a record high of 142,000 units. Tata Motors continues to dominate the market with a 65% share, followed by MG Motor and Mahindra.</li></ul><h3>Primary Growth Drivers</h3><p>Analysts attribute this record-breaking performance to three key factors. First, the introduction of affordable EV hatchbacks and compact SUVs under ₹15 lakh has opened up the market to middle-class buyers. Second, the rapid expansion of public charging stations in tier 2 and tier 3 cities has reduced range anxiety. Finally, favorable state policies, including road tax exemptions and registration waivers, have made EVs highly competitive at showrooms.</p><h3>Future Projections</h3><p>Based on current registration momentum, the Society of Manufacturers of Electric Vehicles (SMEV) projects that overall EV sales will touch 5 million annual units by 2028, with passenger cars accounting for a significantly larger percentage of the mix as battery prices continue to decline.</p>' },
    { id: 'in-news-5', title: 'Battery Recycling Mandate Takes Effect', subtitle: 'New regulations require OEMs to manage end-of-life battery recycling', excerpt: 'India\'s battery recycling mandate comes into effect, requiring manufacturers to set up collection and recycling infrastructure.', date: 'Oct 03, 2026', author: 'Policy Desk', readTime: '4 min read', tag: 'Policy', image: '', content: '<p>The Ministry of Environment, Forest and Climate Change has officially enforced the strict Battery Waste Management Rules, placing the responsibility on EV manufacturers to set up a robust, circular economy. Under the new mandate, OEMs must manage end-of-life battery recycling and achieve high rates of material recovery.</p><h3>Understanding Extended Producer Responsibility (EPR)</h3><p>The core of the new regulation is the Extended Producer Responsibility framework. Under EPR, vehicle manufacturers are legally responsible for the entire lifecycle of the batteries they sell:</p><ul><li><strong>Mandatory Collection:</strong> OEMs must establish collection centers or partner with recycling firms to collect spent battery packs from consumers.</li><li><strong>Material Recovery Targets:</strong> By late 2026, recyclers must recover at least 70% of critical metals (Lithium, Cobalt, Nickel, and Manganese) from spent cells, rising to 90% by 2028.</li><li><strong>Ban on Landfills:</strong> Disposing of EV battery packs in general trash or landfills is now strictly illegal, carrying heavy financial penalties.</li></ul><h3>The Rise of Second-Life Battery Storage</h3><p>Before recycling cells to recover raw materials, manufacturers are setting up "second-life" applications. EV battery packs that have degraded to 70% capacity (which makes them unsuitable for driving) are repurposed for grid-connected energy storage, solar farms, and telecom tower backups, extending their useful life by another 8–10 years.</p><h3>Investment in Recycling Infrastructure</h3><p>This mandate has triggered a wave of investment in recycling facilities. Indian firms like Lohum Cleantech and Attero Recycling are expanding their hydrometallurgical plants, turning India into a regional hub for high-efficiency black mass recycling and battery mineral extraction.</p>' }
  ],
  'upcoming-launches': [
    { id: 'in-upcoming-1', title: 'Tata Sierra EV: Production-Ready Version Spotted', subtitle: 'Iconic SUV returns as an electric avatar in 2027', excerpt: 'The Tata Sierra EV has been spotted testing ahead of its anticipated launch. The electric SUV promises a unique coupe-SUV silhouette.', date: 'Oct 2026', author: 'Spy Desk', readTime: '4 min read', tag: 'Launches', image: '', content: '<p>The Tata Sierra EV has been spotted testing on Indian roads, signaling that the production-ready version is nearing completion. The electric SUV pays homage to the original Sierra with its distinctive coupe-like roofline while incorporating modern design elements.</p><p>Expected to launch in early 2027, the Sierra EV will likely be built on Tata\'s Gen 2 architecture with an estimated range of 450-500 km. It will compete in the premium compact SUV segment.</p><p>Industry insiders suggest the Sierra EV will be priced competitively to take on the upcoming Hyundai Creta EV and Maruti Suzuki\'s first electric SUV.</p>' },
    { id: 'in-upcoming-2', title: 'Hyundai Creta EV: Launch Timeline Revealed', subtitle: 'India\'s most popular SUV is going electric', excerpt: 'Hyundai has confirmed the Creta EV for India with a launch expected in early 2027.', date: 'Oct 2026', author: 'EV Bureau', readTime: '3 min read', tag: 'Launches', image: '', content: '<p>Hyundai Motor India has officially confirmed the development of the Creta EV, one of the most anticipated electric vehicles for the Indian market. The electric version of India\'s best-selling midsize SUV is expected to debut at the 2027 Auto Expo.</p><p>The Creta EV will likely feature a 45-50 kWh battery pack offering a range of 400-450 km. It is expected to be priced between ₹18-25 lakh, making it a strong contender in the mass-market EV segment.</p><p>Hyundai is also working on a localized version of its E-GMP platform for the Indian market, which will underpin future electric models.</p>' },
    { id: 'in-upcoming-3', title: 'Mahindra XUV.e8: Full Details Revealed', subtitle: 'Mahindra\'s flagship electric SUV promises 600 km range', excerpt: 'Mahindra has revealed full specifications of its upcoming flagship electric SUV, the XUV.e8.', date: 'Oct 2026', author: 'Auto Desk', readTime: '5 min read', tag: 'Launches', image: '', content: '<p>Mahindra & Mahindra has released comprehensive details of the XUV.e8, its flagship electric SUV based on the INGLO platform. The vehicle promises a class-leading range of up to 600 km on a single charge.</p><p>The XUV.e8 features a 80 kWh battery pack with 175 kW DC fast charging capability, allowing a 10-80% charge in just 30 minutes. It will be available in both RWD and AWD configurations.</p><p>Mahindra plans to launch the XUV.e8 in the second half of 2027, positioning it as a premium electric SUV competing with the likes of the Kia EV6 and Hyundai Ioniq 5.</p>' },
    { id: 'in-upcoming-4', title: 'Maruti Suzuki eVX: Production Begins', subtitle: 'Maruti\'s first mass-market EV starts rolling out', excerpt: 'Maruti Suzuki has commenced production of its first mass-market electric vehicle, the eVX.', date: 'Sep 2026', author: 'Industry Desk', readTime: '3 min read', tag: 'Launches', image: '', content: '<p>Maruti Suzuki has officially begun production of the eVX at its Gujarat facility, marking the company\'s entry into the mass-market EV segment. The compact electric SUV is expected to be one of the most affordable EVs in India.</p><p>The eVX features a 40 kWh battery pack with an ARAI-certified range of 350 km. It will be priced competitively to take on the Tata Nexon EV and MG ZS EV.</p><p>Maruti plans to introduce six more EV models by 2030, with the eVX laying the foundation for its electric future.</p>' },
    { id: 'in-upcoming-5', title: 'BMW iX3 to Launch in India by 2027', subtitle: 'BMW\'s next-gen electric SUV confirmed for India', excerpt: 'BMW India has confirmed the launch of the next-generation iX3 electric SUV.', date: 'Sep 2026', author: 'Luxury Desk', readTime: '4 min read', tag: 'Launches', image: '', content: '<p>BMW Group India has confirmed the launch of the next-generation iX3 electric SUV, expected to arrive in the Indian market by the first quarter of 2027. The new iX3 will be based on BMW\'s dedicated Neue Klasse EV architecture.</p><p>The sixth-generation BMW eDrive technology will offer significant improvements in efficiency, with the iX3 expected to deliver over 500 km of real-world range. It will feature 350 kW fast charging capability.</p><p>BMW India is also evaluating the i5 Touring and i7 Protection for potential launch, as it continues to expand its electric portfolio in the luxury segment.</p>' }
  ],
  'ev-comparisons': [
    { id: 'in-comp-1', title: 'Tata Nexon EV vs MG ZS EV: Detailed Comparison', subtitle: 'Which compact electric SUV is right for you?', excerpt: 'A comprehensive comparison of India\'s two most popular compact electric SUVs across all parameters.', date: 'Oct 2026', author: 'Compare Desk', readTime: '7 min read', tag: 'Comparison', image: '', content: '<p>The Tata Nexon EV and MG ZS EV have been the two best-selling electric SUVs in India. Here\'s a detailed comparison to help you decide which one suits your needs better.</p><p><strong>Pricing:</strong> The Nexon EV starts at ₹14.74 lakh while the ZS EV starts at ₹18.98 lakh (ex-showroom). The Nexon offers better value for money, but the ZS EV counters with a more premium interior.</p><p><strong>Range:</strong> The Nexon EV offers an ARAI-certified range of 465 km (LR version) while the ZS EV offers 461 km. Real-world range is comparable at around 350 km for both.</p><p><strong>Features:</strong> The ZS EV comes with a larger 10.1-inch touchscreen and connected car tech as standard, while the Nexon EV counters with a sunroof and ventilated seats in top trims.</p><p><strong>Verdict:</strong> The Nexon EV is the better value proposition, while the ZS EV offers a more premium ownership experience. Your choice depends on budget and priority for premium features.</p>' },
    { id: 'in-comp-2', title: 'Hyundai Ioniq 5 vs Kia EV6: Sibling Rivalry', subtitle: 'Which Korean electric crossover wins?', excerpt: 'Both built on the same E-GMP platform, the Ioniq 5 and EV6 cater to different personalities.', date: 'Oct 2026', author: 'Compare Desk', readTime: '6 min read', tag: 'Comparison', image: '', content: '<p>Hyundai Ioniq 5 and Kia EV6 share the same E-GMP platform but target different buyers. Here\'s how they compare in the Indian context.</p><p><strong>Design:</strong> The Ioniq 5 features retro-futuristic styling inspired by the Hyundai Pony, while the EV6 sports a sharp, sporty crossover coupe look. Both turn heads but appeal to different tastes.</p><p><strong>Performance:</strong> Both offer similar specs with AWD variants doing 0-100 km/h in about 5.2 seconds. The 77.4 kWh battery pack provides a range of around 500 km in both models.</p><p><strong>Features:</strong> The Ioniq 5 offers unique features like sliding rear seats and a relaxation mode, while the EV6 focuses on driver engagement with sportier touches.</p><p><strong>Price:</strong> Both are priced similarly at around ₹45-50 lakh, making them premium offerings in the Indian market.</p>' },
    { id: 'in-comp-3', title: 'MG Comet EV vs Tata Tiago EV: Entry-Level Showdown', subtitle: 'Battle of the most affordable EVs in India', excerpt: 'A detailed comparison of India\'s most accessible electric vehicles for first-time EV buyers.', date: 'Sep 2026', author: 'Compare Desk', readTime: '5 min read', tag: 'Comparison', image: '', content: '<p>The MG Comet EV and Tata Tiago EV are India\'s two most affordable electric cars, but they take very different approaches to urban mobility.</p><p><strong>Size & Space:</strong> The Comet is a micro-car designed specifically for city use with a 2+2 seating layout, while the Tiago EV is a proper 5-seater hatchback with more practical rear space.</p><p><strong>Range:</strong> The Tiago EV offers up to 315 km ARAI range, significantly more than the Comet\'s 230 km. Both are adequate for city commuting, but the Tiago allows occasional highway trips.</p><p><strong>Charging:</strong> The Comet only supports 3.3 kW AC charging (takes 5 hours), while the Tiago EV supports DC fast charging (10-80% in 57 minutes with optional charger).</p><p><strong>Verdict:</strong> The Tiago EV is more practical for most buyers. Choose the Comet only if you want a stylish city pod for short commutes.</p>' },
    { id: 'in-comp-4', title: 'BYD Atto 3 vs MG ZS EV: Chinese EVs Battle for Supremacy', subtitle: 'Two Chinese-origin EVs fight for the Indian midsize SUV crown', excerpt: 'The BYD Atto 3 takes on the MG ZS EV in a battle of Chinese-origin electric SUVs in India.', date: 'Sep 2026', author: 'Compare Desk', readTime: '6 min read', tag: 'Comparison', image: '', content: '<p>With both BYD and MG (Chinese-owned) expanding aggressively in India, the Atto 3 and ZS EV offer compelling electric SUV options.</p><p><strong>Battery & Range:</strong> The BYD Atto 3\'s Blade Battery (50.1/60.5 kWh) offers 410-521 km ARAI range, while the ZS EV\'s 50.3 kWh pack offers 461 km. BYD\'s LFP chemistry provides better longevity.</p><p><strong>Performance:</strong> The Atto 3\'s 150 kW motor (201 hp) is more powerful than the ZS EV\'s 130 kW (174 hp), resulting in better acceleration.</p><p><strong>Features:</strong> The Atto 3 features a unique rotating 12.8-inch touchscreen, while the ZS EV counters with a panoramic sunroof and connected car features.</p><p><strong>Price:</strong> The Atto 3 starts at ₹25.99 lakh vs the ZS EV at ₹18.98 lakh—the MG offers better value.</p>' },
    { id: 'in-comp-5', title: 'BMW i4 vs Tesla Model 3: Premium Electric Sedans Compared', subtitle: 'German luxury meets American innovation', excerpt: 'A detailed comparison of two premium electric sedans available in India.', date: 'Sep 2026', author: 'Compare Desk', readTime: '7 min read', tag: 'Comparison', image: '', content: '<p>The BMW i4 and Tesla Model 3 represent two different philosophies in the premium electric sedan segment. Here\'s how they stack up.</p><p><strong>Performance:</strong> The BMW i4 M50 produces 536 hp and does 0-100 in 3.9 seconds, while the Tesla Model 3 Performance produces 450 hp with a 3.3-second 0-100 time (claimed).</p><p><strong>Range:</strong> The i4 offers up to 590 km WLTP range, while the Model 3 Long Range claims up to 629 km. Real-world driving sees both achieving around 450-500 km.</p><p><strong>Interior:</strong> The BMW offers traditional luxury with high-quality materials and a driver-focused cockpit, while the Tesla features a minimalist approach with all controls through a central touchscreen.</p><p><strong>Price:</strong> Both are priced in the ₹70-80 lakh range in India, making them premium purchases accessible to luxury car buyers.</p>' }
  ],
  'buying-guides': [
    { id: 'in-guide-1', title: 'The Complete EV Buyer\'s Handbook', subtitle: 'Everything you need to know before buying your first EV', excerpt: 'A comprehensive step-by-step guide to buying your first electric vehicle, covering budget, range, charging, and more.', date: 'Oct 2026', author: 'Guide Desk', readTime: '10 min read', tag: 'Guide', image: '', content: '<p>Buying your first EV can be overwhelming. This guide covers everything you need to know—from understanding battery sizes to calculating running costs and choosing the right charger.</p><p><strong>Step 1: Set Your Budget</strong><br>EV prices range from ₹5 lakh (MG Comet) to over ₹2 crore (Porsche Taycan). Factor in the initial higher cost against long-term fuel and maintenance savings.</p><p><strong>Step 2: Assess Your Range Needs</strong><br>Calculate your daily commute distance. Most city commuters need 150-250 km range, while frequent highway travelers should look for 400 km+. Always add 20% buffer.</p><p><strong>Step 3: Check Charging Infrastructure</strong><br>Ensure you have access to home charging (preferably a 7 kW AC wall box). Check workplace charging availability and nearby public fast chargers.</p><p><strong>Step 4: Calculate Total Cost</strong><br>Factor in electricity costs (₹1-1.5/km vs petrol\'s ₹8-9/km), maintenance savings, insurance premiums, and registration tax benefits.</p><p><strong>Step 5: Research EV Models</strong><br>Use our EV Brand Dictionary to explore models from all manufacturers. Compare features, range, charging speed, and warranty coverage.</p>' },
    { id: 'in-guide-2', title: 'Home Charging Installation Guide', subtitle: 'Everything you need to set up EV charging at home', excerpt: 'A practical guide to installing a home EV charger, from choosing the right equipment to working with electricians.', date: 'Oct 2026', author: 'Guide Desk', readTime: '7 min read', tag: 'Guide', image: '', content: '<p>Setting up home charging is the most important step in EV ownership. Here\'s a complete guide to getting it right.</p><p><strong>1. Choose Your Charger</strong><br>Most EVs come with a portable 2-3 kW charger (15A socket). For faster charging, install a 7.2 kW AC wall box that charges 3-4x faster. Premium EVs may support 11-22 kW AC charging.</p><p><strong>2. Electrical Assessment</strong><br>Have a licensed electrician check your home\'s electrical panel capacity. A 7.2 kW charger typically needs a dedicated 40A MCB. Most Indian homes with 15-20 kW sanctioned load can support it.</p><p><strong>3. Installation Cost</strong><br>A basic 7.2 kW AC wall box costs ₹15,000-40,000 plus installation charges of ₹3,000-8,000. Many car manufacturers include a free charger with the vehicle purchase.</p><p><strong>4. Safety Considerations</strong><br>Ensure proper earthing (grounding), install a dedicated circuit with RCD protection, and protect outdoor chargers with weatherproof enclosures.</p>' },
    { id: 'in-guide-3', title: 'Understanding EV Battery Warranties', subtitle: 'What battery coverage should you expect from manufacturers?', excerpt: 'A detailed look at EV battery warranties in India and what they cover.', date: 'Sep 2026', author: 'Guide Desk', readTime: '5 min read', tag: 'Guide', image: '', content: '<p>EV battery warranties are crucial for peace of mind. Here\'s what you need to know about coverage in India.</p><p><strong>Standard Coverage:</strong> Most manufacturers offer 8 years/1,60,000 km battery warranty (whichever comes first). This typically covers defects and capacity degradation below 70%.</p><p><strong>What\'s Covered:</strong> Manufacturing defects, premature capacity loss, thermal management system failures, and battery management system (BMS) issues.</p><p><strong>What\'s Not Covered:</strong> Physical damage from accidents, improper charging, unauthorized modifications, and damage from natural disasters.</p><p><strong>Transferability:</strong> Most warranties are transferable to second owners, which helps maintain resale value. Check the specific terms before purchase.</p>' },
    { id: 'in-guide-4', title: 'EV Insurance: A Complete Guide', subtitle: 'Understanding insurance options and costs for electric vehicles', excerpt: 'Everything you need to know about insuring your electric vehicle in India.', date: 'Sep 2026', author: 'Guide Desk', readTime: '6 min read', tag: 'Guide', image: '', content: '<p>EV insurance differs from conventional vehicle insurance. Here\'s a complete guide to understanding your options.</p><p><strong>Premium Costs:</strong> EV insurance premiums are typically 10-20% higher than equivalent petrol vehicles due to higher battery replacement costs. However, many insurers now offer EV-specific policies with competitive rates.</p><p><strong>Key Coverage:</strong> Look for policies that specifically cover battery damage, charging equipment, and electrical component failure. Standard third-party liability is mandatory.</p><p><strong>Add-ons Worth Considering:</strong> Battery protection cover, charging equipment cover, roadside assistance (including battery jump-start), and zero depreciation cover for the first 3-5 years.</p><p><strong>Claim Process:</strong> Make sure your insurer has an EV-certified garage network. Battery damage claims require specialized assessment from manufacturer-approved technicians.</p>' },
    { id: 'in-guide-5', title: 'Top 10 Questions to Ask Before Buying an EV', subtitle: 'Essential questions every EV buyer should ask the dealer', excerpt: 'A checklist of important questions to ask when test-driving and purchasing an electric vehicle.', date: 'Sep 2026', author: 'Guide Desk', readTime: '4 min read', tag: 'Guide', image: '', content: '<p>Before signing on the dotted line, make sure you ask these critical questions:</p><p><strong>1. What is the real-world range?</strong> ARAI figures are optimistic. Ask for real-world range estimates in city and highway conditions.</p><p><strong>2. What charger is included?</strong> Does the car come with a portable charger, a wall box, or both? Is installation included?</p><p><strong>3. What is the battery warranty?</strong> Check years, kilometer limit, and what constitutes a warranty-replaceable defect.</p><p><strong>4. How much does a replacement battery cost?</strong> Know the out-of-warranty battery replacement cost before purchase.</p><p><strong>5. What DC fast charging speed does it support?</strong> Higher is better for road trips. Also check the charging curve (does it slow down after 80%?).</p><p><strong>6. Is there a mobile app?</strong> Does it support remote monitoring, charging scheduling, and preconditioning?</p><p><strong>7. What are the service intervals?</strong> EVs need less maintenance but still require periodic checks.</p><p><strong>8. Is the warranty transferable?</strong> Important for resale value.</p><p><strong>9. How does the vehicle perform in extreme heat?</strong> Battery cooling system effectiveness matters in Indian summers.</p><p><strong>10. Are software updates over-the-air (OTA)?</strong> OTA updates mean your car improves over time without dealer visits.</p>' }
  ],
  'charging-guide': [
    { id: 'in-charge-1', title: 'Understanding AC vs DC Charging', subtitle: 'The difference between slow home charging and fast public charging', excerpt: 'A comprehensive explanation of AC and DC charging technologies and when to use each.', date: 'Oct 2026', author: 'Tech Desk', readTime: '6 min read', tag: 'Charging', image: '', content: '<p>Understanding the difference between AC and DC charging is fundamental to EV ownership. Here\'s everything you need to know.</p><p><strong>AC Charging (Alternating Current):</strong> Your home and office supply AC electricity. EVs have an onboard charger that converts AC to DC to charge the battery. This is inherently slower—typically 2-22 kW depending on the onboard charger capacity.</p><p><strong>DC Charging (Direct Current):</strong> Public fast chargers supply DC electricity directly to the battery, bypassing the onboard charger entirely. This enables much faster charging rates, from 50 kW to 350 kW.</p><p><strong>When to Use AC:</strong> Overnight at home, during work hours, at shopping centers—anytime your car is parked for 2+ hours. AC charging is gentler on the battery and contributes to longer battery life.</p><p><strong>When to Use DC:</strong> On road trips, during quick top-ups while shopping, or whenever you need to add range quickly. DC fast charging is convenient but frequent use can accelerate battery degradation slightly.</p>' },
    { id: 'in-charge-2', title: 'DC Fast Charging Network in India: Complete Guide', subtitle: 'All major fast-charging networks mapped and explained', excerpt: 'A comprehensive guide to DC fast charging networks available across Indian highways and cities.', date: 'Oct 2026', author: 'Infra Desk', readTime: '8 min read', tag: 'Charging', image: '', content: '<p>India\'s DC fast charging network is expanding rapidly. Here\'s a complete guide to the major networks.</p><p><strong>Tata Power EZ Charging:</strong> The largest network with 1,000+ DC chargers across 200+ cities. Speeds range from 30 kW to 150 kW. Available on highways and in urban areas.</p><p><strong>Jio-bp Pulse:</strong> A joint venture between Reliance and bp operating 500+ fast chargers. Focused on highway corridors with 60-120 kW chargers. Available at select petrol pumps and metro stations.</p><p><strong>Zeon Charging:</strong> 300+ DC chargers in 50+ cities with speeds up to 240 kW. Known for reliable uptime and good locations at shopping malls.</p><p><strong>ChargeZone:</strong> Focused on highway corridors with over 200 DC fast chargers. Excellent for inter-city travel with chargers spaced every 50-80 km on major routes.</p><p><strong>Government Initiatives:</strong> EESL, NTPC, and PGCIL are also installing DC chargers at government buildings, railway stations, and public parking lots across Tier 1 and Tier 2 cities.</p>' },
    { id: 'in-charge-3', title: 'Charging Connector Types Explained', subtitle: 'Understanding CCS, CHAdeMO, and Type 2 AC connectors', excerpt: 'A guide to the different EV charging connector standards used in India.', date: 'Sep 2026', author: 'Tech Desk', readTime: '5 min read', tag: 'Charging', image: '', content: '<p>Different EVs use different charging connectors. Here\'s a guide to the standards used in India.</p><p><strong>CCS2 (Combined Charging System Type 2):</strong> The most common standard in India. Used by Tata, MG, Hyundai, Kia, BMW, Mercedes-Benz, Audi, Volvo, and most European manufacturers. Supports both AC (Type 2) and DC (CCS) charging.</p><p><strong>CHAdeMO:</strong> Used primarily by Japanese manufacturers like Nissan and Mitsubishi, and also available on some BYD models. Fewer CHAdeMO chargers exist in India compared to CCS.</p><p><strong>GB/T (Guobiao Standard):</strong> Used by Chinese manufacturers. BYD and MG initially used GB/T but newer models have switched to CCS2 for Indian compliance.</p><p><strong>Type 2 AC (Mennekes):</strong> The standard AC charging connector for all European and Indian EVs. Compatible with most home and office AC chargers.</p><p><strong>Pro Tip:</strong> Most public DC chargers in India come with CCS2 + CHAdeMO + Type 2 cables, ensuring compatibility with most EVs on the road.</p>' },
    { id: 'in-charge-4', title: 'Maximizing EV Battery Life Through Smart Charging', subtitle: 'Best practices for charging your EV battery to ensure long life', excerpt: 'Learn how to charge your EV properly to maximize battery health and longevity.', date: 'Sep 2026', author: 'Tech Desk', readTime: '6 min read', tag: 'Charging', image: '', content: '<p>Your EV battery is the most expensive component in the car. Here\'s how to make it last as long as possible.</p><p><strong>Keep It Between 20-80%:</strong> Lithium-ion batteries are happiest when kept between 20% and 80% state of charge. Avoid regularly charging to 100% or depleting to 0%. Only charge to 100% when you need maximum range for a long trip.</p><p><strong>Minimize DC Fast Charging:</strong> DC fast charging generates more heat and places more stress on battery cells. Use AC home charging for daily needs and reserve DC charging for road trips.</p><p><strong>Charge in Moderate Temperatures:</strong> Extreme heat and cold degrade batteries faster. Park in shade when possible and avoid charging immediately after a high-speed drive when the battery is hot.</p><p><strong>Use Scheduled Charging:</strong> Set your car to finish charging just before you depart. This minimizes the time the battery spends at high state of charge, reducing calendar aging.</p><p><strong>Maintain Good Battery Cooling:</strong> Ensure your car\'s thermal management system is working properly. Liquid-cooled batteries (common in most modern EVs) maintain optimal temperatures better than air-cooled ones.</p>' },
    { id: 'in-charge-5', title: 'The Cost of Charging: Home vs Public', subtitle: 'A detailed cost comparison of charging your EV at home versus using public chargers', excerpt: 'Calculate how much you\'ll actually spend on charging and where you get the best value.', date: 'Sep 2026', author: 'Cost Desk', readTime: '5 min read', tag: 'Charging', image: '', content: '<p>Understanding charging costs helps you make informed decisions. Here\'s a detailed breakdown of what you can expect to pay.</p><p><strong>Home Charging (AC):</strong> Residential electricity rates in India range from ₹6-9 per kWh. Charging a 40 kWh battery from 0-100% costs approximately ₹240-360, giving you a cost of ₹0.8-1.2 per km.</p><p><strong>Office/Public AC Charging:</strong> Rates vary from ₹8-12 per kWh plus parking fees. Cost per km: ₹1-1.8. Some employers offer free charging as an employee benefit.</p><p><strong>DC Fast Charging:</strong> Costs ₹12-22 per kWh depending on the network and location. A 30-minute charge (30 kWh) costs ₹360-660, providing about 150 km range. Cost per km: ₹2.4-4.4.</p><p><strong>Subscription Plans:</strong> Some networks offer subscription plans (e.g., ₹999/month for discounted rates). These are worth considering if you public charge frequently.</p><p><strong>Comparison with Petrol:</strong> Even at the most expensive DC charging (₹4.4/km), you\'re saving 45-50% compared to petrol (₹8-9/km). Home charging saves you 85-90%.</p>' }
  ],
  'industry-updates': [
    { id: 'in-industry-1', title: 'Tata Motors EV Division Reports Record Revenue', subtitle: 'EV business unit achieves profitability milestone ahead of schedule', excerpt: 'Tata Motors\' EV division has reported record revenue and achieved EBITDA positive status.', date: 'Oct 2026', author: 'Market Desk', readTime: '4 min read', tag: 'Industry', image: '', content: '<p>Tata Motors Electric Mobility division has achieved a significant milestone by reporting EBITDA profitability ahead of its internal targets. The division recorded its highest-ever quarterly revenue of ₹4,500 crore.</p><p>The company attributes this success to the strong performance of the Nexon EV, Tiago EV, and the recently launched Curvv EV. Production capacity has been expanded to 5,000 units per month.</p><p>Tata Motors also announced plans to launch three new EV models in the next 12 months, including the Sierra EV and the Harrier EV, further strengthening its position as India\'s EV market leader.</p>' },
    { id: 'in-industry-2', title: 'MG Motor India Plans ₹5,000 Crore EV Investment', subtitle: 'British-origin brand commits to major electrification push in India', excerpt: 'MG Motor India has announced a massive investment plan to expand its electric vehicle portfolio.', date: 'Oct 2026', author: 'Industry Desk', readTime: '3 min read', tag: 'Industry', image: '', content: '<p>MG Motor India has announced a ₹5,000 crore investment over the next three years to accelerate its electrification strategy. The investment will fund new EV model development and battery assembly facility expansion.</p><p>The company plans to launch four new EVs by 2028, including a mass-market electric hatchback and a premium electric MPV. MG is also working on introducing its innovative Battery-as-a-Service (BaaS) model in India.</p><p>MG\'s Halol and Gujarat facilities will be upgraded to support EV production, with battery pack assembly localized to reduce costs. The company targets 50% of its India sales to come from EVs by 2028.</p>' },
    { id: 'in-industry-3', title: 'Ola Electric Announces Motorcycle Lineup', subtitle: 'Ola to launch its first electric motorcycle by early 2027', excerpt: 'Ola Electric has confirmed plans to enter the electric motorcycle segment with multiple models.', date: 'Sep 2026', author: 'Auto Desk', readTime: '3 min read', tag: 'Industry', image: '', content: '<p>Ola Electric Mobility has confirmed the development of a new platform for electric motorcycles, with the first model expected to launch in Q1 2027. The company aims to replicate its success in the scooter segment.</p><p>The electric motorcycle will feature Ola\'s in-house developed motor and battery technology. Multiple variants are planned, targeting different segments from commuter to performance.</p><p>Ola is also expanding its Hypercharger network to 10,000 points across India, with dedicated spaces for motorcycle charging at urban locations and highway corridors.</p>' },
    { id: 'in-industry-4', title: 'Lotus Eletre: Indian Launch Announced', subtitle: 'British luxury EV brand confirms India entry by 2027', excerpt: 'Lotus Technology has confirmed its Indian launch with the Eletre electric SUV.', date: 'Sep 2026', author: 'Luxury Desk', readTime: '3 min read', tag: 'Industry', image: '', content: '<p>Lotus Technology, the iconic British sports car brand now owned by Geely, has confirmed its entry into the Indian market with the Eletre electric SUV. The luxury EV is expected to launch in the second half of 2027.</p><p>The Eletre features a 112 kWh battery pack with up to 600 km range and 350 kW fast charging. The range-topping Eletre R produces 905 hp and does 0-100 km/h in just 2.95 seconds.</p><p>Lotus will position the Eletre above the Porsche Cayenne and BMW XM in the Indian luxury EV segment, with prices expected north of ₹2.5 crore. The company plans to establish 5-7 dealerships in major metro cities.</p>' },
    { id: 'in-industry-5', title: 'Honda Activa EV Launch Confirmed for 2027', subtitle: 'Honda\'s iconic scooter brand goes electric', excerpt: 'Honda Motorcycle & Scooter India confirms the Activa Electric for launch next year.', date: 'Sep 2026', author: 'Two-Wheeler Desk', readTime: '3 min read', tag: 'Industry', image: '', content: '<p>HMSI has confirmed that the Activa Electric will launch in 2027, marking the electrification of India\'s most popular scooter nameplate. The e-Activa will be built at Honda\'s Manesar facility.</p><p>The Activa Electric will feature a fixed battery design with approximately 80-100 km real-world range. Honda is expected to use an LFP battery chemistry for better longevity and thermal performance in Indian conditions.</p><p>Honda plans to leverage its extensive 6,000+ dealership network for sales and service, giving it a significant distribution advantage over electric-only competitors like Ola and Ather.</p>' }
  ],
  'market-analysis': [
    { id: 'in-market-1', title: 'India EV Market Report: FY 2025-26 Analysis', subtitle: 'Comprehensive annual analysis of the Indian EV market performance', excerpt: 'A detailed analysis of EV sales, market share, and trends in India for FY 2025-26.', date: 'Oct 2026', author: 'Market Desk', readTime: '8 min read', tag: 'Analysis', image: '', content: '<h3>1. Annual Performance & Macro Trends</h3><p>The Indian electric vehicle market demonstrated remarkable resilience and growth in FY 2025-26, recording total sales of 2.1 million units across all segments. This represents a 67% year-on-year increase from the previous fiscal year. EV penetration in the overall automotive market reached 6.8%, up from 4.2% in the previous year.</p><h3>2. Two-Wheeler Segment Analysis</h3><p>Electric two-wheelers continued to dominate the EV landscape, accounting for 1.6 million units (76% of total EV sales). The market consolidated around three major players:</p><ul><li><strong>Ola Electric:</strong> Maintained leadership with 35% market share, driven by aggressive pricing of the S1 series.</li><li><strong>TVS Motor:</strong> Secured 20% market share with the steady performance of the iQube.</li><li><strong>Ather Energy:</strong> Held 15% share, dominating the premium performance commuter niche.</li></ul><h3>3. Passenger Electric Car Segment</h3><p>Electric passenger vehicle sales crossed 156,000 units, a 92% increase over FY 2024-25. Tata Motors maintained its leadership with 62% market share, followed by MG Motor (18%) and Hyundai (8%). Affordable compact models like the Tiago EV and Nexon EV accounted for 70% of all passenger EV sales.</p><h3>4. Commercial & Public Transit</h3><p>The electric three-wheeler segment grew 55% to 320,000 units. Electric buses also saw significant adoption with 4,500 units deployed across state transport corporations under the PM-eBus Sewa initiative, representing 15% of all new bus sales in major metros.</p>' },
    { id: 'in-market-2', title: 'State-wise EV Adoption Analysis', subtitle: 'Which Indian states are leading the EV revolution?', excerpt: 'A detailed state-by-state breakdown of EV adoption rates, incentives, and infrastructure.', date: 'Sep 2026', author: 'Market Desk', readTime: '6 min read', tag: 'Analysis', image: '', content: '<h3>1. Top Adoption States in India</h3><p>EV adoption varies significantly across Indian states, driven by local policies, infrastructure, and consumer awareness. The top 5 states by total EV sales are:</p><ul><li><strong>Maharashtra:</strong> 412,000 units (Leading in passenger cars and charging stations).</li><li><strong>Karnataka:</strong> 308,000 units (Highest density of tech-focused EV startups).</li><li><strong>Tamil Nadu:</strong> 275,000 units (The manufacturing hub for EV two-wheelers).</li><li><strong>Gujarat:</strong> 256,000 units (Strong sales driven by state-level subsidy top-ups).</li><li><strong>Uttar Pradesh:</strong> 234,000 units (Dominating in electric three-wheelers and e-Rickshaws).</li></ul><h3>2. Highest Penetration Rates</h3><p>Delhi leads with 18.5% EV penetration in new vehicle sales, followed by Goa (15.2%), Karnataka (11.8%), Maharashtra (10.4%), and Kerala (9.6%). Delhi\'s aggressive EV policy and comprehensive subsidy program are key drivers.</p><h3>3. Charging Network Distribution</h3><p>Maharashtra has the most public charging stations (3,200+), followed by Karnataka (2,800+) and Delhi (2,100+). The Delhi-Mumbai and Bangalore-Chennai highway corridors are the most electrified routes, making inter-state EV travel highly practical in these zones.</p><h3>4. Emerging Tier 2 and Tier 3 Markets</h3><p>Tier 2 and 3 cities are showing accelerating adoption, with cities like Indore, Surat, Lucknow, and Coimbatore recording over 200% year-on-year growth, driven primarily by lower operating costs for daily urban commuters.</p>' },
    { id: 'in-market-3', title: 'EV Battery Price Trends in India', subtitle: 'Battery costs continue to decline, impacting EV affordability', excerpt: 'Analysis of battery price trends and their impact on EV pricing in India.', date: 'Sep 2026', author: 'Market Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<h3>1. Global and Local Battery Cost Trends</h3><p>Battery prices remain the single most significant factor in EV affordability. Lithium-ion battery pack prices in India have fallen to approximately $105/kWh in 2026, down from $140/kWh in 2024. LFP battery packs are even cheaper at around $85/kWh.</p><h3>2. Impact of Localization & PLI Schemes</h3><p>The government\'s Advanced Chemistry Cell (ACC) PLI scheme and the recent battery cell manufacturing commitments from companies like Ola Electric, Reliance, and Exide are expected to further reduce costs. Domestic cell production could bring prices below $80/kWh by 2028.</p><h3>3. Impact on Showroom Prices</h3><p>A 40 kWh battery pack now costs approximately ₹3.5 lakh less than it did in 2024. This cost reduction is gradually being passed on to consumers through lower EV prices, improved cabin comfort, and longer range profiles without price increases.</p><h3>4. Long-Term Market Projections</h3><p>With sodium-ion battery technology maturing and solid-state batteries entering production, we could see pack prices drop below $60/kWh by 2030, making EVs price-competitive with petrol vehicles without subsidies.</p>' },
    { id: 'in-market-4', title: 'Premium EV Segment Market Analysis', subtitle: 'The luxury EV market in India is experiencing unprecedented growth', excerpt: 'Analysis of the premium and luxury EV segment performance in India.', date: 'Sep 2026', author: 'Luxury Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<h3>1. Premium Segment Growth Profile</h3><p>India\'s premium EV segment (₹30 lakh+) has become the fastest-growing EV category, with sales of 14,500 units in FY 2025-26, a 128% increase over the previous year. High disposable incomes and tech-forward luxury buyers are driving this segment.</p><h3>2. Luxury Brand Market Share</h3><p>BMW leads the luxury EV segment with 28% market share, followed by Mercedes-Benz (24%), Volvo (18%), Audi (15%), and Kia (12%). The Kia EV6 and Hyundai Ioniq 5 have been particularly successful in the crossover segment.</p><h3>3. Transaction Pricing & Incentives</h3><p>The average luxury EV in India now sells for ₹58.5 lakh, down 8% from the previous year due to increased localization and competitive pricing. Road tax exemptions in key states (like Maharashtra and Karnataka) save luxury buyers up to ₹5 lakh on registration.</p><h3>4. Consumer Preferences</h3><p>72% of luxury EV buyers are first-time EV owners, and 45% are upgrading from a premium internal combustion engine vehicle. The top reasons cited are running cost savings (58%), performance (52%), and environmental consciousness (41%).</p><h3>5. Infrastructure Gaps</h3><p>While home charging is the primary charging method (78% of luxury EV owners), the availability of high-power DC chargers in premium residential and commercial locations is becoming increasingly important for this segment.</p>' },
    { id: 'in-market-5', title: 'Used EV Market Analysis', subtitle: 'The pre-owned EV market is growing rapidly in India', excerpt: 'Analysis of the emerging used EV market in India and its implications.', date: 'Aug 2026', author: 'Market Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<h3>1. Pre-Owned Segment Overview</h3><p>The used EV market is emerging as a significant segment, with 22,000 pre-owned EVs changing hands in FY 2025-26. As early adopters upgrade to newer models, the pre-owned inventory is growing rapidly, providing a cheaper entry point for new buyers.</p><h3>2. Resale Value & Retention Rates</h3><p>Early Tata Nexon EV models (2019-2021) retain approximately 65-70% of their original value, comparable to diesel variants. The Tiago EV shows even stronger retention at 72-75% due to its lower entry price and high urban utility.</p><h3>3. Battery Health and Certification</h3><p>Major used car platforms like Spinny and Cars24 have introduced battery health certification programs. These tests measure State of Health (SoH), maximum DC charging rate, and overall battery degradation to assure buyers.</p><h3>4. Warranty and Support Transfers</h3><p>Most manufacturers allow warranty transfer to second owners, though some charge a nominal fee (₹5,000-15,000). Third-party extended warranty products covering EV-specific components are also becoming available.</p><h3>5. Future Outlook</h3><p>The used EV market is projected to grow to 150,000 annual units by 2028 as early EV adopters upgrade to newer models with better range and technology, stabilizing the residual values of electric cars in India.</p>' }
  ],
  'government-policies': [
    { id: 'in-policy-1', title: 'FAME-III: Complete Policy Breakdown', subtitle: 'Everything you need to know about India\'s latest EV subsidy scheme', excerpt: 'A comprehensive breakdown of the FAME-III subsidy framework, eligibility criteria, and benefits.', date: 'Oct 2026', author: 'Policy Desk', readTime: '7 min read', tag: 'Policy', image: '', content: '<p>The FAME-III (Faster Adoption and Manufacturing of Electric Vehicles) scheme has been officially notified with an outlay of ₹12,500 crore. Here\'s a complete breakdown of the policy.</p><p><strong>Key Allocations:</strong> ₹6,500 crore for passenger vehicles, ₹3,500 crore for two-wheelers, ₹1,500 crore for three-wheelers, and ₹1,000 crore for buses.</p><p><strong>Subsidy Structure:</strong> Passenger EVs get ₹10,000-15,000 per kWh of battery capacity (capped at ₹3.5 lakh). Two-wheelers get ₹8,000-12,000 per kWh (capped at ₹35,000).</p><p><strong>New Requirements:</strong> To qualify for subsidies, vehicle manufacturers must use at least 50% locally sourced battery cells by 2028, with annual milestones. This is designed to boost domestic manufacturing.</p><p><strong>Charging Infrastructure:</strong> ₹2,000 crore allocated for public charging stations. Target: 1 charger per 20 EVs by 2028, with mandatory charging points at all new commercial buildings.</p><p><strong>State-Level Benefits:</strong> The scheme encourages states to adopt additional EV policies. Several states offer 100% road tax exemption, registration fee waivers, and electricity duty exemptions on EV charging.</p>' },
    { id: 'in-policy-2', title: 'State EV Policies Comparison Guide', subtitle: 'A comprehensive comparison of EV policies across Indian states', excerpt: 'Detailed comparison of incentives, subsidies, and policies offered by different Indian states for EV adoption.', date: 'Sep 2026', author: 'Policy Desk', readTime: '6 min read', tag: 'Policy', image: '', content: '<p>State-level EV policies vary significantly, and choosing the right state for EV registration can save you up to ₹2.5 lakh. Here\'s a comprehensive comparison.</p><p><strong>Delhi:</strong> Most aggressive EV policy. Waivers: 100% road tax, 100% registration fee. Subsidies: Up to ₹50,000 for two-wheelers, ₹30,000 for four-wheelers (over FAME). Plus: Scrappage bonus if replacing old petrol car.</p><p><strong>Maharashtra:</strong> Waivers: 100% road tax (first EV only). Subsidies: Up to ₹1.5 lakh for four-wheelers. Plus: Reduced electricity tariff for home charging (₹4.5/kWh for EV owners during night).</p><p><strong>Karnataka:</strong> Waivers: 100% road tax. Subsidies: Up to ₹20,000 for two-wheelers. Perks: EV manufacturing hub with industrial incentives for OEMs setting up factories.</p><p><strong>Gujarat:</strong> Waivers: 100% road tax for 5 years. Subsidies: Up to ₹20,000 for two-wheelers. EV manufacturing focus with land and power subsidies.</p><p><strong>Tamil Nadu:</strong> Waivers: 100% road tax. Subsidies: Up to ₹15,000 for two-wheelers, interest subvention on EV loans. Investment in charging infrastructure.</p>' },
    { id: 'in-policy-3', title: 'Income Tax Benefits for EV Buyers', subtitle: 'Section 80EEB and other tax benefits explained', excerpt: 'Understanding the income tax deductions available for EV purchases in India.', date: 'Sep 2026', author: 'Tax Desk', readTime: '4 min read', tag: 'Policy', image: '', content: '<p>Under Section 80EEB of the Income Tax Act, individuals can claim a deduction of up to ₹1.5 lakh on interest paid on loans taken to purchase electric vehicles.</p><p><strong>Eligibility:</strong> Available to individual taxpayers for loans sanctioned by banks or NBFCs for EV purchases. The vehicle must be registered as an electric vehicle.</p><p><strong>Loan Tenure:</strong> The deduction is available for the entire loan tenure, up to 8 years from the date of loan sanction. Maximum lifetime deduction is capped at ₹1.5 lakh per financial year.</p><p><strong>Combined Benefits:</strong> EV buyers can combine Section 80EEB with other deductions like Section 80C (up to ₹1.5 lakh), maximizing overall tax savings. A buyer in the 30% tax bracket can save approximately ₹46,800 per year in taxes.</p><p><strong>Employer Benefits:</strong> Some companies provide EV leasing as part of salary restructuring, which allows employees to pay for EV lease from pre-tax salary, resulting in additional 20-30% savings on effective vehicle cost.</p>' },
    { id: 'in-policy-4', title: 'Battery Waste Management Rules 2026', subtitle: 'India\'s new battery recycling regulations explained', excerpt: 'Understanding the new regulations for battery disposal, recycling, and producer responsibility.', date: 'Sep 2026', author: 'Policy Desk', readTime: '5 min read', tag: 'Policy', image: '', content: '<p>The Battery Waste Management Rules 2026 represent India\'s comprehensive framework for managing end-of-life batteries, including EV batteries.</p><p><strong>Extended Producer Responsibility (EPR):</strong> All battery manufacturers and EV OEMs must register with the Central Pollution Control Board and meet annual recycling targets. Targets start at 40% in 2026 and increase to 80% by 2030.</p><p><strong>Collection Infrastructure:</strong> Manufacturers must establish collection centers in all districts with more than 10,000 EV registrations. Dealers must accept spent batteries from customers regardless of brand.</p><p><strong>Deposit Refund Scheme:</strong> A deposit of ₹2,000-5,000 (depending on battery size) will be collected at the time of vehicle purchase and refunded when the battery is returned to an authorized collection center.</p><p><strong>Material Recovery:</strong> Recyclers must achieve minimum 70% recovery of battery materials (lithium, cobalt, nickel, and manganese). Failure to meet targets results in environmental compensation charges.</p><p><strong>Consumer Awareness:</strong> Manufacturers must include battery disposal information in user manuals and provide online locators for the nearest authorized battery collection centers.</p>' },
    { id: 'in-policy-5', title: 'EV Manufacturing PLI Scheme Progress Report', subtitle: 'How the production-linked incentive scheme is boosting domestic EV manufacturing', excerpt: 'Progress report on the PLI scheme for EV and battery manufacturing in India.', date: 'Aug 2026', author: 'Policy Desk', readTime: '6 min read', tag: 'Policy', image: '', content: '<p>The Production Linked Incentive (PLI) scheme for automotive and advanced chemistry cells has completed three years. Here\'s a progress report.</p><p><strong>ACC PLI (Advanced Chemistry Cells):</strong> 15 companies have been approved with a total committed investment of ₹45,000 crore. Ola Electric and Reliance New Energy have begun construction of 5 GWh and 10 GWh facilities respectively.</p><p><strong>Automotive PLI:</strong> 85 companies have applied, with 45 approved. Total committed investment: ₹32,500 crore. The scheme aims to increase domestic value addition from the current 40% to 70% by 2028.</p><p><strong>Job Creation:</strong> The two PLI schemes are projected to create 3,50,000 direct and indirect jobs by 2028. Over 1,20,000 jobs have already been created in the EV supply chain ecosystem.</p><p><strong>Challenges:</strong> Delays in tariff rationalization for EV components, limited availability of skilled labor for battery manufacturing, and uncertainty around global commodity prices remain key challenges for PLI beneficiaries.</p><p><strong>Impact Assessment:</strong> The PLI schemes have successfully attracted global EV supply chain players to India, with several Tier 1 suppliers establishing manufacturing bases in the country.</p>' }
  ],
  'expert-columns': [
    { id: 'in-expert-1', title: 'The Solid-State Battery Revolution Is Closer Than You Think', subtitle: 'Expert analysis on the timeline for solid-state battery commercialization', excerpt: 'Our EV technology expert analyzes the current state and timeline for solid-state battery adoption in EVs.', date: 'Oct 2026', author: 'Dr. Rajesh Kumar', readTime: '8 min read', tag: 'Expert', image: '', content: '<p>As an automotive battery researcher with 15 years in the field, I\'ve been tracking solid-state battery development closely. Here\'s my analysis of the technology\'s readiness.</p><p>Solid-state batteries promise 2x energy density, 10x faster charging, and zero fire risk compared to conventional lithium-ion batteries. The technology replaces the liquid electrolyte with a solid ceramic or polymer material.</p><p>Major announcements from Toyota, Samsung SDI, and QuantumScape suggest commercial production could begin as early as 2027. However, my analysis suggests mass-market adoption is still 5-7 years away.</p><p>The key challenges are manufacturing scalability, material cost, and interface stability between the solid electrolyte and electrodes. Companies that solve these challenges first will have a significant competitive advantage.</p><p>For buyers today, my advice is simple: don\'t wait. Current lithium-ion battery technology is mature, reliable, and improving every year. Battery replacement costs are dropping by 10-15% annually.</p>' },
    { id: 'in-expert-2', title: 'Why India Needs an EV Battery Swapping Policy', subtitle: 'Battery swapping could be the key to mass EV adoption in India', excerpt: 'An expert perspective on why battery swapping infrastructure is critical for India\'s two-wheeler and three-wheeler EV segments.', date: 'Oct 2026', author: 'Dr. Rajesh Kumar', readTime: '7 min read', tag: 'Expert', image: '', content: '<p>Battery swapping—instantly exchanging a depleted battery for a fully charged one—could be the game-changer for India\'s EV transition, particularly for two-wheelers and three-wheelers.</p><p>The advantage of swapping over charging is clear: zero wait time, no need for dedicated parking with chargers, and reduced upfront vehicle cost (since the battery is owned by the swapping station).</p><p>However, for swapping to work at scale, the government must establish a standardized battery form factor policy, similar to what Gogoro has achieved in Taiwan. Without standardization, swapping stations would need to carry inventory for every manufacturer\'s unique battery design, making the economics unviable.</p><p>Battery-as-a-Service (BaaS) models, where users pay per-swap, could reduce the upfront cost of an EV by 30-40%, dramatically accelerating adoption in the mass market. This is particularly relevant for commercial fleet operators in the delivery and ride-sharing segments.</p>' },
    { id: 'in-expert-3', title: 'The Future of EV Charging: Wireless and Inductive', subtitle: 'How wireless charging technology could transform EV ownership', excerpt: 'Exploring the potential of wireless EV charging and its implications for the future of electric mobility.', date: 'Sep 2026', author: 'Dr. Priya Sharma', readTime: '6 min read', tag: 'Expert', image: '', content: '<p>Imagine never having to plug in your EV—just park over a charging pad in your garage or at a parking spot, and charging starts automatically. This is the promise of wireless inductive charging.</p><p>The technology uses electromagnetic fields to transfer energy between a ground-based pad and a receiver pad on the vehicle. Current implementations offer 85-92% efficiency, approaching that of plug-in AC charging (94-96%).</p><p>Several manufacturers, including BMW, Mercedes-Benz, and Volvo, have demonstrated wireless charging systems. The main barrier to adoption has been the cost: a home wireless charging pad currently costs ₹2-4 lakh versus ₹15,000-40,000 for a wired wall box.</p><p>Looking ahead, dynamic wireless charging—where roads themselves charge vehicles as they drive—could revolutionize long-distance travel. While still in experimental phases, this technology holds immense potential for electrifying India\'s national highway network.</p>' },
    { id: 'in-expert-4', title: 'India\'s EV Supply Chain: Building Self-Reliance', subtitle: 'How India is building a domestic EV supply chain ecosystem', excerpt: 'An expert analysis of India\'s journey toward self-reliance in EV component manufacturing.', date: 'Sep 2026', author: 'Dr. Priya Sharma', readTime: '7 min read', tag: 'Expert', image: '', content: '<p>India\'s ambition to become a global EV manufacturing hub depends on building a robust domestic supply chain. Here\'s my assessment of where we stand.</p><p>The government\'s PLI schemes have catalyzed investment in battery cell manufacturing, with over 100 GWh of annual capacity planned by 2028. This addresses the single most critical component in the EV value chain.</p><p>Motor and powertrain manufacturing is well-established, with companies like Tata AutoComp and Bosch India developing local production capabilities. India has a natural advantage in electric motor production given its existing auto component ecosystem.</p><p>The gap areas include power electronics (SiC MOSFETs, IGBT modules), high-voltage connectors and wiring, and battery management system (BMS) semiconductor components. These remain largely import-dependent.</p><p>Bridging these gaps requires sustained investment in semiconductor design and fabrication capabilities. The government\'s recent ₹76,000 crore semiconductor PLI scheme should eventually address these needs.</p>' },
    { id: 'in-expert-5', title: 'The Role of EVs in India\'s Renewable Energy Transition', subtitle: 'How EVs can help stabilize the grid and enable greater renewable energy adoption', excerpt: 'An expert analysis of vehicle-to-grid (V2G) technology and its potential for India.', date: 'Aug 2026', author: 'Dr. Rajesh Kumar', readTime: '6 min read', tag: 'Expert', image: '', content: '<p>EVs represent far more than just clean transportation—they are essentially mobile battery storage units that can play a crucial role in stabilizing India\'s power grid.</p><p>Vehicle-to-Grid (V2G) technology allows an EV to discharge electricity back to the grid during peak demand hours when electricity prices are high, and charge during off-peak hours when prices are low. This creates a potentially valuable revenue stream for EV owners.</p><p>For India, where solar energy generation creates a significant midday surplus, EV batteries could absorb excess energy and feed it back during evening peaks. With 10 million EVs on Indian roads by 2030 (projected), the aggregate battery capacity would be approximately 400 GWh—equivalent to India\'s current daily electricity consumption.</p><p>The regulatory framework for V2G is still being developed, but pilot projects in Delhi and Bangalore have demonstrated promising results. The key requirements are bidirectional chargers (currently ₹1.5-2.5 lakh more expensive than standard units) and ISO 15118-compliant communication protocols.</p>' }
  ],
  'tech-deep-dives': [
    { id: 'in-tech-1', title: 'Understanding EV Battery Chemistries: LFP vs NMC vs Solid-State', subtitle: 'A deep dive into the different battery technologies powering modern EVs', excerpt: 'Comprehensive technical explanation of lithium-ion battery variants, their characteristics, and applications.', date: 'Oct 2026', author: 'Tech Desk', readTime: '10 min read', tag: 'Tech', image: '', content: '<p>All EV batteries are lithium-ion, but the specific chemistry varies significantly between manufacturers. Here\'s an in-depth technical explanation.</p><p><strong>LFP (Lithium Iron Phosphate):</strong> Uses iron phosphate as cathode material. Advantages: Excellent thermal stability (virtually zero fire risk), long cycle life (3,000-5,000 cycles), and no cobalt (cheaper and ethical). Disadvantages: Lower energy density (90-160 Wh/kg), poor cold-weather performance. Used in: Tata Nexon EV, BYD Atto 3, MG Comet. Best for: Budget-conscious buyers and commercial fleets.</p><p><strong>NMC (Lithium Nickel Manganese Cobalt):</strong> Uses nickel-rich cathode. Advantages: High energy density (150-220 Wh/kg), good performance across temperatures. Disadvantages: Cobalt dependency (expensive, ethical concerns), shorter cycle life (1,500-2,000 cycles). Used in: Hyundai Ioniq 5, Kia EV6, BMW i4. Best for: Premium vehicles where range is paramount.</p><p><strong>Solid-State:</strong> Replaces liquid electrolyte with solid ceramic/polymer. Advantages: 2x energy density (400-500 Wh/kg potential), 10x faster charging, zero fire risk. Disadvantages: Manufacturing challenges, high cost (currently ₹50,000+/kWh). Expected commercial availability: 2028-2030. Best for: Future luxury and performance EVs.</p><p><strong>Key Metrics Explained:</strong> Energy density (Wh/kg) determines range for a given battery weight. Cycle life determines how many charge-discharge cycles before capacity drops below 80%. C-rate determines how fast a battery can charge—1C means fully charged in 1 hour, 3C in 20 minutes.</p>' },
    { id: 'in-tech-2', title: '800V Architecture Explained', subtitle: 'Why high-voltage electrical systems are the future of EVs', excerpt: 'A technical deep dive into 800V architecture and its advantages for fast charging and efficiency.', date: 'Oct 2026', author: 'Tech Desk', readTime: '7 min read', tag: 'Tech', image: '', content: '<p>800V architecture represents the most significant electrical system advancement in modern EVs. Here\'s a technical explanation of how it works and why it matters.</p><p><strong>What Is 800V Architecture?</strong> Most EVs use a 400V electrical system. 800V systems double the voltage, which allows the same power to be delivered with half the current (Power = Voltage × Current). Lower current means less resistive heating (proportional to I²R), allowing thinner, lighter wiring.</p><p><strong>Why It Matters for Charging:</strong> The maximum charging power is limited by both charger capability and the vehicle\'s voltage. An 800V system connected to a 350 kW charger can add 300-400 km of range in 15-20 minutes, compared to 30-40 minutes for a 400V system at 150-200 kW.</p><p><strong>Efficiency Benefits:</strong> Reduced resistive losses in the high-voltage cabling and motor controller improve overall powertrain efficiency by 3-5%. This translates to more range from the same battery capacity.</p><p><strong>Current 800V Vehicles:</strong> Hyundai Ioniq 5/6 (E-GMP platform), Kia EV6 (E-GMP), Porsche Taycan (first production 800V), Audi e-tron GT, and Lucid Air. Most premium EVs launching after 2026 will adopt 800V architecture.</p><p><strong>Challenges:</strong> 800V systems require more expensive power electronics (SiC MOSFETs instead of IGBTs), specialized high-voltage connectors, and careful design to prevent arcing. The cost premium is around ₹1-2 lakh per vehicle currently.</p>' },
    { id: 'in-tech-3', title: 'Regenerative Braking Systems: How They Work', subtitle: 'The technology behind one-pedal driving and energy recovery', excerpt: 'A technical explanation of how regenerative braking captures energy and how one-pedal driving works.', date: 'Sep 2026', author: 'Tech Desk', readTime: '6 min read', tag: 'Tech', image: '', content: '<p>Regenerative braking is one of the most innovative features of EVs. Here\'s how it works at the technical level.</p><p><strong>The Physics:</strong> When an electric motor is powered, it converts electrical energy into rotational kinetic energy. Regenerative braking reverses this process—the motor becomes a generator, converting the vehicle\'s kinetic energy back into electricity.</p><p><strong>How It Works:</strong> When you lift off the accelerator pedal, the motor controller changes the motor\'s electrical phase relationship. Instead of drawing current, the motor now generates current that is fed back to the battery. This creates magnetic resistance that slows the vehicle.</p><p><strong>Regen Levels:</strong> Most EVs offer adjustable regen levels (typically 3-4 settings). Low regen provides mild deceleration (like coasting a petrol car), while high regen enables one-pedal driving where you rarely need the brake pedal.</p><p><strong>Energy Recovery Efficiency:</strong> Modern regenerative braking systems recover up to 70-80% of the kinetic energy that would otherwise be lost as heat. In city driving with frequent stop-and-go, regen can extend range by 15-25% compared to highway driving.</p><p><strong>Blended Braking:</strong> When you press the brake pedal, the system first applies maximum regen, then blends friction brakes only when more stopping force is needed. This maximizes energy recovery while maintaining familiar pedal feel.</p>' },
    { id: 'in-tech-4', title: 'Electric Motor Types: PMSM vs Induction vs SRM', subtitle: 'Understanding the different electric motor technologies used in EVs', excerpt: 'A technical comparison of permanent magnet synchronous, induction, and switched reluctance motors.', date: 'Sep 2026', author: 'Tech Desk', readTime: '8 min read', tag: 'Tech', image: '', content: '<p>Understanding the different types of electric motors used in EVs helps explain differences in performance, efficiency, and cost. Here\'s a technical breakdown.</p><p><strong>PMSM (Permanent Magnet Synchronous Motor):</strong> Uses neodymium magnets in the rotor. Advantages: Highest efficiency (92-95%), compact size, high power density. Disadvantages: Requires rare earth magnets (expensive, supply chain concerns), magnets can demagnetize at very high temperatures. Used in: Most mainstream EVs (Tata, Hyundai, MG, Kia). Best for: Primary drive motor in most applications.</p><p><strong>Induction Motor (Asynchronous):</strong> Uses electromagnetic induction to create rotor magnetic field. Advantages: No rare earth magnets (cheaper), robust, excellent at high speeds, can freewheel without drag. Disadvantages: Lower efficiency (85-90%), larger size. Used in: Tesla (front motor in AWD models), Audi e-tron. Best for: Secondary motor in AWD systems, performance applications.</p><p><strong>SRM (Switched Reluctance Motor):</strong> Uses magnetic reluctance of the rotor to generate torque. Advantages: Simplest construction, no magnets, very low cost, high-speed capability. Disadvantages: Higher noise and vibration (audible whine), torque ripple (jerky at low speeds). Used in: Some industrial applications and future budget EVs. Still under development for mainstream automotive use.</p><p><strong>Dual Motor Configurations:</strong> Many premium EVs use one motor per axle for all-wheel drive. Common combinations include PMSM front + PMSM rear (most efficient), or PMSM front + Induction rear (better high-speed cruising efficiency, as used by Tesla Model Y Performance).</p>' },
    { id: 'in-tech-5', title: 'Thermal Management Systems in EVs', subtitle: 'How EVs manage heat for battery, motor, and cabin comfort', excerpt: 'A technical deep dive into the cooling and heating systems that keep EVs running efficiently.', date: 'Aug 2026', author: 'Tech Desk', readTime: '7 min read', tag: 'Tech', image: '', content: '<p>Thermal management is critical to EV performance, safety, and longevity. Here\'s how modern EVs manage heat.</p><p><strong>Battery Thermal Management:</strong> Lithium-ion batteries operate optimally between 20-35°C. Active liquid cooling uses coolant circulating through cooling plates between battery cells. This maintains temperature during fast charging (which generates significant heat) and in hot climates like India.</p><p><strong>Motor Cooling:</strong> Electric motors generate heat through resistive losses in windings and magnetic losses in the core. Most motors use either air cooling (budget EVs) or oil cooling (premium EVs). Oil cooling allows the motor to sustain peak power longer.</p><p><strong>Heat Pump Systems:</strong> Instead of resistive heating (which consumes significant battery power), premium EVs use heat pumps that extract heat from the ambient air or from the motor/battery coolant to heat the cabin. Heat pumps are 2-4x more efficient than resistive heaters, preserving 15-30 km of range in cold weather.</p><p><strong>Integrated Thermal Architecture:</strong> Modern EVs integrate battery, motor, and cabin thermal management into a single system with a heat pump, multiple coolant loops, and electronically controlled valves. This allows waste heat from the motor and battery to warm the cabin in winter, and battery cooling to assist cabin air conditioning in summer.</p><p><strong>Importance in India:</strong> In India\'s hot climate, battery thermal management is crucial. Liquid-cooled systems (as opposed to air-cooled) maintain battery temperatures within safe limits during sustained highway driving and repeated fast charging sessions. This directly impacts battery life and safety.</p>' }
  ]
};
const INSIGHTS_CATEGORIES = [
  { key: 'latest-news', label: 'Latest EV News', icon: '📰', desc: 'Breaking news and updates from the EV world' },
  { key: 'upcoming-launches', label: 'Upcoming Launches', icon: '🚀', desc: 'Upcoming electric vehicle launches in India' },
  { key: 'ev-comparisons', label: 'EV Comparisons', icon: '⚖️', desc: 'Side-by-side comparisons of popular EVs' },
  { key: 'buying-guides', label: 'Buying Guides', icon: '📋', desc: 'Comprehensive guides for EV buyers' },
  { key: 'charging-guide', label: 'Charging Guide', icon: '⚡', desc: 'Everything about EV charging' },
  { key: 'industry-updates', label: 'Industry Updates', icon: '🏭', desc: 'Latest from EV manufacturers and suppliers' },
  { key: 'market-analysis', label: 'Market Analysis', icon: '📊', desc: 'In-depth market research and data analysis' },
  { key: 'government-policies', label: 'Government Policies', icon: '🏛️', desc: 'EV policies, subsidies, and regulations' },
  { key: 'expert-columns', label: 'Expert Columns', icon: '🎓', desc: 'Analysis and opinions from EV experts' },
  { key: 'tech-deep-dives', label: 'Tech Deep Dives', icon: '🔧', desc: 'In-depth technical explanations of EV technology' }
];

// Alias mapping for insight slugs (menu → canonical)
const INSIGHTS_SLUG_ALIASES = {
  'latest-ev-news': 'latest-news',
  'ev-charging-explained': 'charging-guide',
  'ev-guides': 'buying-guides'
};

// Additional insights categories (with placeholder articles)
Object.assign(INSIGHTS_DATABASE, {
  'ev-infrastructure-india': [
    { id: 'infra-1', title: 'India\'s EV Charging Network: Complete Overview', subtitle: 'From highways to cities, mapping India\'s charging infrastructure', excerpt: 'A comprehensive look at the current state of EV charging infrastructure across India, including major networks, coverage gaps, and future expansion plans.', date: 'Oct 2026', author: 'Infra Desk', readTime: '7 min read', tag: 'Infrastructure', image: '', content: '<p>India\'s EV charging infrastructure has grown exponentially, with over 12,000 public charging stations operational as of 2026. Here\'s a complete overview of the current landscape.</p><h3>Major Networks</h3><p>Tata Power EZ Charging leads with 1,000+ DC chargers across 200+ cities. Jio-bp Pulse operates 500+ chargers focused on highway corridors. Zeon Charging has 300+ chargers in 50+ cities. ChargeZone specializes in highway charging with chargers every 50-80 km on major routes.</p><h3>Highway Coverage</h3><p>The Golden Quadrilateral is now 85% covered with DC fast chargers at 50 km intervals. Major corridors like Delhi-Mumbai, Bangalore-Chennai, and Mumbai-Pune have multiple charging options. The government\'s target is 100% highway coverage by 2028.</p><h3>Urban Charging</h3><p>Metro cities have good charging density with 15-25 stations per 100 sq km. Tier 2 cities are catching up rapidly. Apartment charging remains a challenge, but model bylaws now mandate EV-ready parking in new buildings.</p><h3>Future Plans</h3><p>By 2028, India aims to have 50,000 public charging stations. The FAME-III scheme allocates ₹2,000 crore specifically for charging infrastructure. Battery swapping stations are also being deployed for two and three-wheelers.</p>' }
  ],
  'where-electricity-comes-from': [
    { id: 'electricity-1', title: 'Where Does India\'s Electricity Come From?', subtitle: 'Understanding the grid: sources of electricity for EV charging', excerpt: 'A detailed look at India\'s electricity generation mix and how it impacts the environmental benefits of EV ownership.', date: 'Oct 2026', author: 'Energy Desk', readTime: '5 min read', tag: 'Energy', image: '', content: '<p>Understanding where your EV\'s electricity comes from is important for calculating true environmental impact. Here\'s a breakdown of India\'s electricity generation mix.</p><h3>Current Mix (2026)</h3><p>India\'s grid electricity comes from: Coal (48%), Solar (18%), Wind (12%), Hydro (10%), Natural Gas (6%), Nuclear (3%), and Other Renewables (3%). The share of renewables has been growing rapidly, up from 23% in 2022 to 46% in 2026.</p><h3>EV Environmental Impact</h3><p>Even with the current grid mix, an EV produces 40-50% fewer lifecycle emissions than a comparable petrol vehicle. As the grid gets cleaner (targeting 70% renewable by 2030), this benefit will increase to 80-90%.</p><h3>Time-of-Use Charging</h3><p>Charging during daytime when solar generation peaks (10 AM to 3 PM) maximizes the use of renewable energy. Many utilities offer lower tariffs during these periods. Night charging relies more on coal and wind power.</p><h3>Home Solar + EV</h3><p>Combining rooftop solar with an EV is the most environmentally impactful combination. A typical 5 kW solar system generates enough electricity to power both a home and an EV, effectively making your car run on 100% renewable energy.</p>' }
  ],
  'renewable-energy-and-evs': [
    { id: 'renewable-1', title: 'Renewable Energy and EVs: The Perfect Pair', subtitle: 'How combining solar power with EVs transforms transportation', excerpt: 'Exploring the synergies between renewable energy adoption and electric vehicle ownership in India.', date: 'Oct 2026', author: 'Energy Desk', readTime: '6 min read', tag: 'Energy', image: '', content: '<p>Electric vehicles and renewable energy form a virtuous cycle—each makes the other more viable and impactful.</p><h3>Solar-Powered EVs</h3><p>Installing rooftop solar panels (5-7 kW) can generate enough electricity to power both a household and an EV. At current solar installation costs (₹40,000-60,000 per kW), the payback period is 4-6 years when including EV charging savings.</p><h3>Grid Balancing</h3><p>EV batteries can serve as distributed storage for renewable energy. With V2G (Vehicle-to-Grid) technology, EV owners can sell excess solar power back to the grid during peak demand and charge their cars when renewable generation is high.</p><h3>Government Initiatives</h3><p>The PM Surya Ghar Yojana provides up to ₹78,000 subsidy for residential solar installations. Combined with EV incentives, the total benefit can offset 30-40% of the combined system cost.</p><h3>Environmental Impact</h3><p>An EV charged entirely from solar power eliminates approximately 4-5 tonnes of CO2 emissions annually compared to a petrol car. This is equivalent to planting 200 trees per year.</p>' }
  ],
  'companies-building-indias-network': [
    { id: 'companies-1', title: 'Companies Building India\'s EV Charging Network', subtitle: 'The key players driving India\'s charging infrastructure growth', excerpt: 'A comprehensive look at the companies and startups building India\'s EV charging infrastructure network.', date: 'Oct 2026', author: 'Industry Desk', readTime: '8 min read', tag: 'Infrastructure', image: '', content: '<p>India\'s EV charging network is being built by a diverse mix of public sector companies, private corporations, and innovative startups. Here\'s who is driving the growth.</p><h3>Public Sector</h3><p><strong>EESL (Energy Efficiency Services Ltd):</strong> Installing chargers at government buildings, railway stations, and metro stations across the country. Focus on interoperability and standardized pricing.</p><p><strong>NTPC:</strong> India\'s largest power utility is setting up charging stations at its facilities and partnering with state discoms for grid-connected charging hubs.</p><p><strong>PGCIL:</strong> Focusing on highway corridor electrification along national highways with high-power (150 kW+) DC chargers.</p><h3>Private Players</h3><p><strong>Tata Power:</strong> India\'s largest private charging network with 1,000+ DC chargers. Strong presence in malls, hotels, and office complexes.</p><p><strong>Jio-bp Pulse:</strong> Joint venture between Reliance and bp operating 500+ stations with integrated convenience stores.</p><p><strong>Zeon Charging:</strong> Independent network with 300+ chargers known for high uptime and customer service.</p><p><strong>ChargeZone:</strong> Focused exclusively on highway charging with a network spanning 15,000+ km of highways.</p><p><strong>Startups:</strong> Companies like Statiq, Volttic, Electreefi, and PlugNGo are innovating with battery swapping, ultra-fast charging, and renewable-integrated charging hubs.</p>' }
  ],
  'ev-cost-and-savings': [
    { id: 'cost-1', title: 'EV Cost & Savings: Complete Financial Analysis', subtitle: 'A comprehensive breakdown of EV ownership costs compared to petrol vehicles', excerpt: 'Detailed analysis of the total cost of EV ownership in India, including purchase price, running costs, maintenance, and long-term savings.', date: 'Oct 2026', author: 'Cost Desk', readTime: '8 min read', tag: 'Analysis', image: '', content: '<p>Understanding the true cost of EV ownership is crucial for making an informed purchase decision. Here\'s a complete financial analysis.</p><h3>Upfront Costs</h3><p>EVs in India cost ₹1-5 lakh more than comparable petrol models. However, FAME-III subsidies (up to ₹3.5 lakh), state incentives (road tax exemption saves ₹30,000-2 lakh), and registration fee waivers (₹10,000-30,000) significantly reduce the premium.</p><h3>Running Cost Comparison</h3><p>Home charging: ₹1-1.5/km vs Petrol: ₹8-9/km. Savings: 80-85%. At 15,000 km/year, you save ₹75,000-90,000 annually on fuel alone. Over 5 years: ₹3.75-4.5 lakh in fuel savings.</p><h3>Maintenance Savings</h3><p>EVs have 80% fewer moving parts. Annual maintenance: ₹2,000-4,000 vs ₹5,000-10,000 for petrol cars. No oil changes, timing belts, or exhaust system repairs. 5-year maintenance savings: ₹20,000-40,000.</p><h3>Total 5-Year Cost of Ownership</h3><p>For a typical compact EV (₹15 lakh on-road): 5-year TCO including depreciation, financing, electricity, maintenance, and insurance is approximately ₹18-20 lakh. An equivalent petrol car (₹12.5 lakh on-road) would cost ₹24-27 lakh over 5 years. Net EV savings: ₹4-7 lakh over 5 years.</p><h3>Tax Benefits</h3><p>Section 80EEB: Deduction up to ₹1.5 lakh/year on EV loan interest (saves ₹46,800/year in 30% tax bracket). Some employers offer EV leasing through salary restructuring for additional tax savings.</p>' }
  ]
});

// Add new category metadata
INSIGHTS_CATEGORIES.push(
  { key: 'ev-infrastructure-india', label: 'EV Infrastructure in India', icon: '🔌', desc: 'Charging network and infrastructure developments' },
  { key: 'where-electricity-comes-from', label: 'Where Does Electricity Come From?', icon: '⚡', desc: 'Understanding the grid and energy sources' },
  { key: 'renewable-energy-and-evs', label: 'Renewable Energy and EVs', icon: '☀️', desc: 'Synergies between solar power and electric vehicles' },
  { key: 'companies-building-indias-network', label: 'Companies Building India\'s Network', icon: '🏗️', desc: 'Key players in India\'s charging infrastructure' },
  { key: 'ev-cost-and-savings', label: 'EV Cost & Savings', icon: '💰', desc: 'Total cost of ownership and financial analysis' }
);

// --- About Pages Database ---
const ABOUT_DATABASE = {
  'about': {
    title: 'About EV Car Wale',
    content: '<p>EV Car Wale is India\'s leading smart electric vehicle marketplace, dedicated to accelerating the country\'s transition to electric mobility. Our platform provides comprehensive information, tools, and resources to help consumers make informed EV purchase decisions.</p><p>Founded with a vision to make EV adoption simple and transparent, we offer detailed vehicle comparisons, pricing analysis, range calculators, and educational content covering every aspect of electric vehicle ownership.</p><p>From our comprehensive EV database to our interactive planning tools, everything on EV Car Wale is designed with one goal: to make your EV journey seamless and informed.</p>'
  },
  'about/mission': {
    title: 'Our Mission',
    content: '<p>Our mission is to accelerate India\'s transition to sustainable electric mobility by providing the most comprehensive, accurate, and accessible EV information platform in the country.</p><p>We believe that the right information at the right time can transform how people think about transportation. By demystifying EV technology, clarifying costs, and simplifying the buying process, we aim to remove the barriers that prevent consumers from embracing electric vehicles.</p><p>We are committed to: providing unbiased, data-driven EV comparisons; making complex EV concepts accessible to everyone; supporting the growth of India\'s EV ecosystem; and contributing to a cleaner, greener future for India.</p>'
  },
  'about/why-ev-car-wale': {
    title: 'Why Choose EV Car Wale',
    content: '<p>EV Car Wale stands out as India\'s most comprehensive EV platform. Here\'s what makes us different.</p><p><strong>Complete EV Database:</strong> We maintain the most up-to-date database of every EV available in India, with detailed specifications, real-world range estimates, and pricing information.</p><p><strong>Smart Planning Tools:</strong> Our EV Trip Planner, EMI Calculator, and Range Calculator help you make informed decisions about your EV purchase and usage.</p><p><strong>Expert Educational Content:</strong> From beginner guides to deep technical explainers, our content library covers everything you need to know about EVs.</p><p><strong>Unbiased Information:</strong> We provide objective, data-driven comparisons and analysis to help you find the perfect EV for your needs and budget.</p><p><strong>Community Focus:</strong> We\'re building India\'s largest EV enthusiast community, sharing real-world experiences and practical advice.</p>'
  },
  'about/team': {
    title: 'Our Team',
    content: '<p>EV Car Wale is built by a passionate team of automotive enthusiasts, technology experts, and clean energy advocates committed to driving India\'s EV revolution.</p><p>Our team combines deep expertise in the automotive industry, software engineering, data science, and content creation to deliver the most comprehensive EV platform in India.</p><p>We are researchers, engineers, writers, and designers united by a common goal: making EV adoption simple, transparent, and accessible for every Indian consumer.</p><p><strong>Content coming soon:</strong> Detailed team profiles and individual contributor bios are being prepared and will be added shortly.</p>'
  },
  'contact': {
    title: 'Contact Us',
    content: '<p>We\'d love to hear from you! Whether you have a question about our platform, want to report an issue, or are interested in partnering with us, here\'s how you can reach us.</p><p><strong>Email:</strong> support@evcarwale.com</p><p><strong>Phone:</strong> +91-894-971-4475 (Available Monday-Friday, 10 AM - 6 PM IST)</p><p><strong>Address:</strong> EV Car Wale, India</p><p>For press and media inquiries, please email us at press@evcarwale.com. For partnership opportunities, reach out to partnerships@evcarwale.com.</p><p>We aim to respond to all inquiries within 24-48 business hours.</p>'
  },
  'feedback': {
    title: 'Feedback',
    content: '<p>Your feedback helps us improve. We value every suggestion, comment, and idea from our users.</p><p>Please share your thoughts on: How can we make EV Car Wale more useful? What features would you like to see? Is there any information you\'re having trouble finding? How has your EV ownership experience been?</p><p>Send your feedback to: feedback@evcarwale.com. We read every message and incorporate user suggestions into our development roadmap.</p><p>Thank you for helping us build a better platform for India\'s EV community.</p>'
  },
  'help': {
    title: 'Help Centre',
    content: '<p>Welcome to the EV Car Wale Help Centre. Find answers to common questions and learn how to make the most of our platform.</p><p><strong>Getting Started:</strong> Browse our EV database to explore available models. Use filters to narrow down by brand, budget, range, and features. Compare multiple EVs side by side with our comparison tool.</p><p><strong>Planning a Purchase:</strong> Use the EMI Calculator to estimate monthly payments. Check the EV Trip Planner to understand range and charging needs.</p><p><strong>Educational Resources:</strong> Visit our Learning Centre for comprehensive guides on EV technology, charging, and ownership. Use the Jargon Buster to understand technical terms.</p><p><strong>Need more help?</strong> Contact us at support@evcarwale.com and we\'ll get back to you within 24 hours.</p>'
  },
  'faqs': {
    title: 'FAQs',
    content: '<p>Find answers to frequently asked questions about electric vehicles and the EV Car Wale platform.</p><p><strong>What is an EV?</strong> An electric vehicle (EV) is a vehicle powered by one or more electric motors using energy stored in rechargeable batteries. Unlike petrol or diesel vehicles, EVs produce zero tailpipe emissions.</p><p><strong>How much does it cost to charge an EV?</strong> Home charging costs approximately ₹1-1.5 per km, while DC fast charging costs ₹2.5-4.5 per km. This is significantly cheaper than petrol (₹8-9 per km).</p><p><strong>What is the EV range?</strong> Most modern EVs offer 250-500 km of real-world range, sufficient for daily commuting and most inter-city travel. Range depends on driving style, AC usage, and road conditions.</p><p><strong>How long does charging take?</strong> Home AC charging: 4-12 hours (full charge). DC fast charging: 25-45 minutes (10% to 80%). The exact time depends on battery size and charger power.</p><p><strong>Are EVs suitable for Indian roads?</strong> Yes, modern EVs are designed and tested for Indian conditions. Many offer high ground clearance, robust battery cooling systems, and dust/water resistance (IP67 rating).</p>'
  },
  'privacy-policy': {
    title: 'Privacy Policy',
    content: '<p>Your privacy is important to us. This Privacy Policy outlines how EV Car Wale collects, uses, and protects your personal information.</p><p><strong>Information We Collect:</strong> We collect information you provide directly, such as your name, email address, and preferences when you subscribe to our newsletter or contact us. We also collect anonymous usage data through cookies to improve our platform.</p><p><strong>How We Use Your Information:</strong> To personalize your experience, improve our platform, send periodic emails (if you\'ve opted in), and respond to your inquiries. We do not sell your personal information to third parties.</p><p><strong>Data Security:</strong> We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure.</p><p><strong>Cookies:</strong> We use cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, though this may affect some platform features.</p><p><strong>Third-Party Links:</strong> Our platform may contain links to third-party websites. We are not responsible for their privacy practices.</p><p><strong>Updates:</strong> We may update this policy periodically. Changes will be posted on this page with an updated effective date.</p><p><strong>Contact:</strong> For privacy-related inquiries, contact us at privacy@evcarwale.com.</p>'
  },
  'terms-and-conditions': {
    title: 'Terms & Conditions',
    content: '<p>These Terms & Conditions govern your use of the EV Car Wale platform. By accessing or using our website, you agree to these terms.</p><p><strong>Use of Platform:</strong> You agree to use EV Car Wale for lawful purposes only. You may not use our platform for any illegal or unauthorized purpose.</p><p><strong>Intellectual Property:</strong> All content, trademarks, and data on this platform, including but not limited to text, graphics, logos, and software, are the property of EV Car Wale unless otherwise stated.</p><p><strong>Accuracy of Information:</strong> While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of the information on our platform. Vehicle specifications and pricing may change without notice.</p><p><strong>Limitation of Liability:</strong> EV Car Wale shall not be liable for any damages arising from the use of or inability to use our platform or the information provided.</p><p><strong>Changes to Terms:</strong> We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this page.</p>'
  },
  'disclaimer': {
    title: 'Disclaimer',
    content: '<p>The information provided on EV Car Wale is for general informational purposes only. While we make every effort to ensure accuracy, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the information on our platform.</p><p><strong>Vehicle Data:</strong> EV specifications, pricing, features, and availability are subject to change by manufacturers without notice. We recommend verifying all information with authorized dealers before making a purchase decision.</p><p><strong>Financial Information:</strong> Calculated costs, savings estimates, and financial projections are for illustrative purposes only. Actual costs may vary based on driving habits, electricity tariffs, vehicle condition, and other factors.</p><p><strong>External Links:</strong> Our platform may contain links to external websites. We are not responsible for the content, accuracy, or practices of these websites.</p><p><strong>No Professional Advice:</strong> The content on EV Car Wale does not constitute professional automotive, financial, or legal advice. Consult qualified professionals for advice tailored to your specific situation.</p>'
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: '<p>EV Car Wale uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our audience comes from.</p><p><strong>What Are Cookies?</strong> Cookies are small text files stored on your device by your web browser. They help websites remember your preferences and provide a personalized experience.</p><p><strong>How We Use Cookies:</strong> Essential cookies: Required for the basic functioning of our platform. Analytics cookies: Help us understand how visitors interact with our site. Preference cookies: Remember your settings and preferences.</p><p><strong>Managing Cookies:</strong> You can control and manage cookies in your browser settings. You can choose to block all cookies, but this may affect the functionality of our platform.</p><p><strong>Third-Party Cookies:</strong> We may use third-party services (such as analytics providers) that place their own cookies. These are governed by the respective third-party privacy policies.</p><p><strong>Updates:</strong> We may update this Cookie Policy from time to time. Any changes will be posted on this page.</p>'
  },
  'copyright': {
    title: 'Copyright Notice',
    content: '<p>Copyright © 2026 EV Car Wale. All rights reserved.</p><p>All content, design, text, graphics, logos, icons, images, audio clips, and software on this website are the property of EV Car Wale or its content suppliers and are protected by Indian and international copyright laws.</p><p>You may not reproduce, distribute, modify, transmit, reuse, repost, or use any content from this website for public or commercial purposes without the express written permission of EV Car Wale.</p><p><strong>Permitted Use:</strong> You may view, download, and print pages from this website for personal, non-commercial use only, provided you do not modify the content and retain all copyright and proprietary notices.</p><p><strong>Trademarks:</strong> All trademarks, service marks, and trade names used on this website are the property of their respective owners.</p><p>For permission requests, contact: legal@evcarwale.com</p>'
  }
};

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

let wishlistIds = [];
let currentDetailsCarId = null;
let currentUser = null;

const AUTH_CACHE_KEY = 'evcarwale_auth_user';

function isUserLoggedIn() {
  return localStorage.getItem('is_logged_in') === 'true';
}

function saveUserToLocal(user) {
  if (user && user.name) {
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
      name: user.name,
      email: user.email || '',
      picture: user.picture || ''
    }));
    localStorage.setItem('is_logged_in', 'true');
  } else {
    localStorage.removeItem(AUTH_CACHE_KEY);
    localStorage.setItem('is_logged_in', 'false');
  }
}

function getUserFromLocal() {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.name) return parsed;
    return null;
  } catch {
    return null;
  }
}

function loadWishlistFromStorage() {
  if (isUserLoggedIn()) {
    const saved = localStorage.getItem('ev_wishlist_logged_in');
    wishlistIds = saved ? JSON.parse(saved) : [];
  } else {
    wishlistIds = [];
  }
}

function saveWishlistToStorage() {
  if (isUserLoggedIn()) {
    localStorage.setItem('ev_wishlist_logged_in', JSON.stringify(wishlistIds));
  }
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

async function initUserSession() {
  // Show cached profile immediately so UI is instant on refresh/navigation
  const cached = getUserFromLocal();
  if (cached) {
    currentUser = cached;
    updateAuthUI(cached);
  }

  try {
    const response = await fetch('/api/auth/me');
    const authData = await response.json();
    if (authData.loggedIn && authData.user) {
      currentUser = authData.user;
      saveUserToLocal(authData.user);
      updateAuthUI(authData.user);
    } else {
      currentUser = null;
      saveUserToLocal(null);
      updateAuthUI(null);
    }
  } catch (err) {
    console.error('Session fetch failed:', err);
    if (!cached) {
      currentUser = null;
      saveUserToLocal(null);
      updateAuthUI(null);
    }
    // If cached exists, keep showing it (graceful degradation)
  }
  loadWishlistFromStorage();
  updateWishlistBadge();
}

function showToast(message) {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'fixed top-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none font-mono';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.className = 'bg-black text-white text-[10px] uppercase tracking-wider px-5 py-3 border border-zinc-800 shadow-lg rounded-none transition-all duration-300 transform -translate-y-10 opacity-0';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('-translate-y-10', 'opacity-0');
  }, 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    toast.classList.add('-translate-y-10', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}


// --- Database Enrichment for Car Details Pages ---
function enrichDatabase() {
  EV_DATABASE.forEach(car => {
    // 1. Add variants dynamically based on VARIANTS_DATABASE
    let variantNames = [];
    const carBrandNorm = normalizeKey(car.brand);
    let matchedBrandKey = null;

    if (VARIANTS_DATABASE && typeof VARIANTS_DATABASE === 'object') {
      for (const bKey of Object.keys(VARIANTS_DATABASE)) {
        if (normalizeKey(bKey) === carBrandNorm) {
          matchedBrandKey = bKey;
          break;
        }
      }
    }

    if (matchedBrandKey) {
      const carModelNorm = normalizeKey(car.name);
      const brandVariants = VARIANTS_DATABASE[matchedBrandKey];
      for (const mKey of Object.keys(brandVariants)) {
        if (normalizeKey(mKey) === carModelNorm) {
          variantNames = brandVariants[mKey];
          break;
        }
      }
    }

    if (!variantNames || variantNames.length === 0) {
      variantNames = ['Standard'];
    }

    const N = variantNames.length;
    car.variants = variantNames.map((vName, idx) => {
      const factor = N > 1 ? 0.9 + 0.25 * (idx / (N - 1)) : 1.0;
      const priceBase = car.priceVal;
      const isCrore = car.brand === 'bmw' || car.brand === 'audi' || car.brand === 'mercedes-benz' || car.brand === 'porsche' || car.brand === 'lotus' || car.brand === 'rolls-royce';
      
      const variantPriceVal = priceBase * factor;
      const priceStr = isCrore ? `₹${variantPriceVal.toFixed(2)} Crore` : `₹${variantPriceVal.toFixed(2)} Lakh`;
      
      const batteryVal = parseFloat(car.battery);
      const batteryStr = batteryVal ? `${(batteryVal * (N > 1 ? 0.85 + 0.3 * (idx / (N - 1)) : 1.0)).toFixed(1)} kWh` : car.battery;
      
      const rangeVal = parseFloat(car.range);
      const rangeStr = rangeVal ? `${Math.floor(rangeVal * (N > 1 ? 0.85 + 0.25 * (idx / (N - 1)) : 1.0))} km` : car.range;
      
      const powerVal = parseInt(car.power);
      const powerStr = powerVal ? `${Math.floor(powerVal * (N > 1 ? 0.85 + 0.35 * (idx / (N - 1)) : 1.0))} hp` : car.power;
      
      const torqueVal = parseInt(car.torque) || 250;
      const torqueStr = `${Math.floor(torqueVal * (N > 1 ? 0.85 + 0.3 * (idx / (N - 1)) : 1.0))} Nm`;
      
      const speedVal = parseInt(car.speed) || 150;
      const speedStr = `${Math.floor(speedVal * (N > 1 ? 0.9 + 0.2 * (idx / (N - 1)) : 1.0))} km/h`;
      
      const drivetrainStr = (car.brand === 'bmw' || car.brand === 'audi' || car.brand === 'mercedes-benz' || car.brand === 'kia' || car.brand === 'byd' || car.brand === 'porsche' || car.brand === 'lotus') 
        ? (idx === N - 1 ? 'AWD' : 'RWD') 
        : (idx === N - 1 ? 'AWD' : 'FWD');
        
      const accel = N > 1 ? (8.5 - 3.5 * (idx / (N - 1))).toFixed(1) : '7.5';
      const accelerationStr = `${accel} sec`;
      
      const wheelsStr = N > 1 ? `${15 + Math.floor(4 * (idx / (N - 1)))} inch Alloy` : '15 inch Steel';

      const safetyStr = car.safety || '5 Stars (Expected)';
      const dimensionsStr = car.dimensions || '3994 x 1811 x 1616 mm';
      const clearanceStr = car.brand === 'tata' || car.brand === 'mahindra' ? '190 mm' : '150 mm';
      const bootSpaceStr = '380 Litres';
      const seatingStr = '5 Seater';
      const warrantyStr = '8 Years / 1,60,000 km';
      
      return {
        name: vName,
        price: priceStr,
        priceVal: variantPriceVal,
        battery: batteryStr,
        range: rangeStr,
        charging: car.charging || '45 min (DC)',
        power: powerStr,
        speed: speedStr,
        drivetrain: drivetrainStr,
        torque: torqueStr,
        acceleration: accelerationStr,
        wheels: wheelsStr,
        safety: safetyStr,
        dimensions: dimensionsStr,
        clearance: clearanceStr,
        bootSpace: bootSpaceStr,
        seating: seatingStr,
        warranty: warrantyStr,
        features: car.features || ''
      };
    });

    // 2. Add extra specifications if missing (fallbacks for main object)
    if (!car.torque) car.torque = car.brand === 'tata' || car.brand === 'mahindra' ? '250 Nm' : '350 Nm';
    if (!car.chargingAC) car.chargingAC = '7.5 hours (7.2 kW AC)';
    if (!car.clearance) car.clearance = car.brand === 'tata' || car.brand === 'mahindra' ? '190 mm' : '150 mm';
    if (!car.bootSpace) car.bootSpace = '380 Litres';
    if (!car.seating) car.seating = '5 Seater';
    if (!car.warranty) car.warranty = '8 Years / 1,60,000 km';
    
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

// Preloader setup
const preloader = document.getElementById('preloader');
const loadingText = document.getElementById('loading-text');
const loaderLogo = document.getElementById('loader-logo');

function runPreloader() {
  if (!preloader) return;

  // Animate LOADING dots immediately (1–4 dots)
  var dotCount = 0;
  var dotInterval = setInterval(function() {
    dotCount = (dotCount % 4) + 1;
    var text = 'LOADING';
    for (var i = 0; i < dotCount; i++) text += '.';
    if (loadingText) loadingText.textContent = text;
  }, 400);

  // 5s — fade in logo + tagline with scale
  setTimeout(function() {
    if (loaderLogo) loaderLogo.classList.add('reveal');
  }, 5000);

  // 6s — fade out everything
  setTimeout(function() {
    clearInterval(dotInterval);

    var video = document.getElementById('preloader-video');
    if (video) video.pause();

    preloader.classList.add('preloader-hidden');
    document.body.classList.add('loaded');

    setTimeout(function() {
      preloader.style.display = 'none';
    }, 1000);

    if (typeof window.showAIAssistant === 'function') {
      setTimeout(window.showAIAssistant, 100);
    }
  }, 6000);
}
window.addEventListener('DOMContentLoaded', runPreloader);


// --- Active Filters Setup ---
const BODY_TYPE_MAP = {
  'nexon-ev':'SUV','xuv400':'SUV','punch-ev':'SUV','windsor-ev':'SUV',
  'ioniq-5':'SUV','byd-seal':'Sedan','ev6':'SUV','harrier-ev':'SUV',
  'be6':'SUV','bmw-i4':'Sedan','etron-gt':'Sedan','mercedes-eqs':'Sedan',
  'vinfast-vf6':'SUV','kia-ev9':'SUV','xev-9e':'SUV','citroen-ec3':'Hatchback',
  'curvv-ev':'SUV','tiago-ev':'Hatchback','byd-atto3':'SUV','elevate-ev':'SUV',
  'ioniq-6':'Sedan','syros-ev':'SUV','be07':'SUV','avinya-ev':'MUV',
  'ex90':'SUV','comet-ev':'Hatchback','toyota-bz4x':'SUV','bmw-i7':'Luxury',
  'macan-ev':'SUV','audi-q6-etron':'SUV','audi-q8-etron':'SUV','bmw-ix':'SUV',
  'bmw-ix1-lwb':'SUV','byd-sealion-7':'SUV','byd-emax7':'MUV',
  'hyundai-creta-electric':'SUV','kia-carens-clavis-ev':'MUV',
  'mahindra-xev-7e':'SUV','mahindra-thar-e':'SUV','maruti-e-vitara':'SUV',
  'mercedes-cla-electric':'Luxury','mercedes-eqa':'SUV','mercedes-eqe-suv':'SUV',
  'mercedes-eqs-suv':'SUV','mercedes-g-class-electric':'SUV',
  'mg-cyberster':'Convertible','mg-m9':'MUV','mg-zs-ev':'SUV',
  'nissan-ariya':'SUV','nissan-leaf':'Hatchback','porsche-cayenne-electric':'SUV',
  'porsche-taycan':'Luxury','renault-kwid-ev':'Hatchback','skoda-elroq':'SUV',
  'skoda-enyaq':'SUV','tata-sierra-ev':'SUV','tata-tigor-ev':'Sedan',
  'toyota-urban-cruiser-ev':'SUV','vinfast-vf3':'Hatchback','vinfast-vf7':'SUV',
  'vinfast-vf-mpv7':'MUV','volvo-ec40':'SUV','volvo-ex30':'SUV','volvo-ex40':'SUV'
};
let activeBodyType = null;
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
const wishlistBadge = document.getElementById('wishlist-badge') || { textContent: 0, classList: { remove() {}, add() {} } };

function getSpecGridHtml(car) {
  if (car.sections.includes('upcoming')) {
    return `
      <div><span class="notranslate-label">EXPECTED</span><span class="notranslate">: ${car.launchDate || 'Soon'}</span></div>
      <div><span class="notranslate-label">RANGE</span><span class="notranslate">: ${car.range}</span></div>
      <div><span class="notranslate-label">BATTERY</span><span class="notranslate">: ${car.battery}</span></div>
      <div><span class="notranslate-label">DC CHARGE</span><span class="notranslate">: ${car.charging}</span></div>
      <div class="col-span-2 truncate text-zinc-500 notranslate" title="${car.features}">${car.features}</div>
    `;
  } else if (car.sections.includes('launches')) {
    return `
      <div><span class="notranslate-label">LAUNCHED</span><span class="notranslate">: ${car.launchDate || 'Recently'}</span></div>
      <div><span class="notranslate-label">RANGE</span><span class="notranslate">: ${car.range}</span></div>
      <div><span class="notranslate-label">BATTERY</span><span class="notranslate">: ${car.battery}</span></div>
      <div><span class="notranslate-label">DC CHARGE</span><span class="notranslate">: ${car.charging}</span></div>
      <div class="col-span-2 truncate text-zinc-500 notranslate" title="${car.features}">${car.features}</div>
    `;
  } else {
    return `
      <div><span class="notranslate-label">RANGE</span><span class="notranslate">: ${car.range}</span></div>
      <div><span class="notranslate-label">BATTERY</span><span class="notranslate">: ${car.battery}</span></div>
      <div><span class="notranslate-label">DC CHARGE</span><span class="notranslate">: ${car.charging}</span></div>
      <div><span class="notranslate-label">TOP SPEED</span><span class="notranslate">: ${car.speed}</span></div>
      <div class="col-span-2 truncate text-zinc-500 notranslate" title="${car.features}">${car.features}</div>
    `;
  }
}

function createCarCardHtml(car, extraClasses = '') {
  const isWishlisted = wishlistIds.includes(car.id);
  return `
    <div class="car-card ${extraClasses} border border-zinc-200 bg-white p-6 flex flex-col justify-between h-[420px] relative group hover:border-black transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] stagger-card cursor-pointer">
      <button class="wishlist-btn absolute top-4 right-4 z-20" data-id="${car.id}" aria-label="Toggle Wishlist">
        <svg viewBox="0 0 24 24" class="w-4 h-4 ${isWishlisted ? 'fill-current' : ''}">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>

        ${renderCarImage(getS3ImageUrl(car.image), car.name)}

      <div>
        <div class="flex justify-between items-start text-black">
          <div>
            <span class="font-mono text-[9px] text-zinc-500 uppercase notranslate">${getBrandDisplay(car.brand)}</span>
            <h3 class="text-lg font-bold mt-0.5 text-black notranslate">${car.name}</h3>
          </div>
          <span class="font-mono text-sm font-bold text-black notranslate">${car.price}</span>
        </div>
        
        <!-- Spec Grid -->
        <div class="grid grid-cols-2 gap-y-1.5 gap-x-4 my-3 text-[10px] text-zinc-500 border-t border-zinc-100 pt-3 font-mono">
          ${getSpecGridHtml(car)}
        </div>
      </div>

      <button class="w-full py-2.5 border border-zinc-200 hover:border-black text-zinc-500 hover:text-white hover:bg-black font-mono text-[9px] uppercase tracking-widest transition-all btn-view-details notranslate" data-id="${car.id}">
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
      const searchBody = document.getElementById('search-car-body')?.value;
      if (searchBody && searchBody !== 'all' && BODY_TYPE_MAP[car.id] !== searchBody) return false;
      return true;
    });
    
    const searchBody = document.getElementById('search-car-body')?.value;
    if (activeBrand || activeBudget || activeRecentlyViewed || nameSearch || searchBrand !== 'all' || searchBudget !== 'all' || (searchBody && searchBody !== 'all')) {
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
      filteredPopular.slice(0, 10).forEach(car => {
        carCarouselViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start');
      });
    }
  }
  
  // 2. Latest EV Launches
  const launchesViewport = document.getElementById('launch-carousel-viewport');
  if (launchesViewport) {
    launchesViewport.innerHTML = '';
    const launchesCars = EV_DATABASE.filter(car => car.sections && car.sections.includes('launches'));
    launchesCars.slice(0, 10).forEach(car => {
      launchesViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start');
    });
  }
  
  // 3. Upcoming Electric Cars
  const upcomingViewport = document.getElementById('up-carousel-viewport');
  if (upcomingViewport) {
    upcomingViewport.innerHTML = '';
    const upcomingCars = EV_DATABASE.filter(car => car.sections && car.sections.includes('upcoming'));
    upcomingCars.slice(0, 10).forEach(car => {
      upcomingViewport.innerHTML += createCarCardHtml(car, 'flex-shrink-0 w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start');
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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const carId = btn.getAttribute('data-id');
      openCarDetails(carId);
    });
  });

  // Card clicks
  document.querySelectorAll('.car-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.wishlist-btn') || e.target.closest('.btn-view-details')) {
        return;
      }
      const btn = card.querySelector('.btn-view-details');
      if (btn) {
        const carId = btn.getAttribute('data-id');
        openCarDetails(carId);
      }
    });
  });
}

function toggleWishlist(carId) {
  if (!isUserLoggedIn()) {
    showToast('Please login to save favourites.');
    navigateTo('/login');
    return;
  }

  const index = wishlistIds.indexOf(carId);
  const isAdding = index === -1;
  if (isAdding) {
    wishlistIds.push(carId);
  } else {
    wishlistIds.splice(index, 1);
  }
  
  // Persist to localStorage
  saveWishlistToStorage();

  // Update badge UI
  updateWishlistBadge();

  // Update heart buttons on all visible cards for this carId in-place
  const buttons = document.querySelectorAll(`.wishlist-btn[data-id="${carId}"]`);
  buttons.forEach(btn => {
    const svg = btn.querySelector('svg');
    if (svg) {
      if (isAdding) {
        svg.classList.add('fill-current', 'text-red-500');
      } else {
        svg.classList.remove('fill-current', 'text-red-500');
      }
    }
  });

  // If the detail page wishlist button is on the page, update it too
  if (currentDetailsCarId === carId) {
    const detailBtn = document.getElementById('detail-wishlist-btn');
    if (detailBtn) {
      const svg = detailBtn.querySelector('svg');
      if (svg) {
        if (isAdding) {
          svg.classList.add('fill-current', 'text-red-500');
        } else {
          svg.classList.remove('fill-current', 'text-red-500');
        }
      }
    }
  }
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
  const bodyReset = document.getElementById('search-car-body');
  if (bodyReset) bodyReset.value = 'all';
  
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

// Search submit button click — brand → brand page, else → search page
document.getElementById('search-submit-btn').addEventListener('click', () => {
  const name = document.getElementById('search-car-name').value.trim();
  const brand = document.getElementById('search-car-brand').value;
  const budget = document.getElementById('search-car-budget').value;
  const body = document.getElementById('search-car-body').value;
  const p = new URLSearchParams();
  if (name) p.set('name', name);
  if (budget && budget !== 'all') p.set('budget', budget);
  if (body && body !== 'all') p.set('body', body);
  const qs = p.toString();
  if (brand && brand !== 'all') {
    navigateTo('/brand/' + brand + (qs ? '?' + qs : ''));
  } else {
    navigateTo('/search' + (qs ? '?' + qs : ''));
  }
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

function getVehicleFeatures(car) {
  if (!car) return null;
  const carName = (car.name || '').trim();
  const cleanCarName = carName.toLowerCase().replace(/\s+/g, ' ').trim();
  let carFeatures = null;
  
  if (FEATURES_DATABASE && typeof FEATURES_DATABASE === 'object') {
    const isFeatureBlock = (obj) => {
      if (!obj || typeof obj !== 'object') return false;
      const keys = Object.keys(obj).map(k => k.toLowerCase());
      return ['exterior', 'interior', 'safety', 'infotainment', 'adas', 'comfort'].some(cat => keys.includes(cat));
    };

    // 1. Direct search at root keys
    for (const key of Object.keys(FEATURES_DATABASE)) {
      if (key.toLowerCase().replace(/\s+/g, ' ').trim() === cleanCarName) {
        const val = FEATURES_DATABASE[key];
        if (isFeatureBlock(val)) {
          carFeatures = val;
          break;
        }
      }
    }

    // 2. Nested search inside brand keys
    if (!carFeatures) {
      for (const brandKey of Object.keys(FEATURES_DATABASE)) {
        const brandData = FEATURES_DATABASE[brandKey];
        if (brandData && typeof brandData === 'object' && !isFeatureBlock(brandData)) {
          for (const modelKey of Object.keys(brandData)) {
            if (modelKey.toLowerCase().replace(/\s+/g, ' ').trim() === cleanCarName) {
              const val = brandData[modelKey];
              if (isFeatureBlock(val)) {
                carFeatures = val;
                break;
              }
            }
          }
        }
        if (carFeatures) break;
      }
    }

    // 3. Fallback fuzzy contains matching at root keys
    if (!carFeatures) {
      for (const key of Object.keys(FEATURES_DATABASE)) {
        const val = FEATURES_DATABASE[key];
        if (isFeatureBlock(val)) {
          const cleanKey = key.toLowerCase().replace(/\s+/g, ' ').trim();
          if (cleanKey.includes(cleanCarName) || cleanCarName.includes(cleanKey)) {
            carFeatures = val;
            break;
          }
        }
      }
    }

    // 4. Fallback fuzzy contains matching inside brand keys
    if (!carFeatures) {
      for (const brandKey of Object.keys(FEATURES_DATABASE)) {
        const brandData = FEATURES_DATABASE[brandKey];
        if (brandData && typeof brandData === 'object' && !isFeatureBlock(brandData)) {
          for (const modelKey of Object.keys(brandData)) {
            const val = brandData[modelKey];
            if (isFeatureBlock(val)) {
              const cleanModelKey = modelKey.toLowerCase().replace(/\s+/g, ' ').trim();
              if (cleanModelKey.includes(cleanCarName) || cleanCarName.includes(cleanModelKey)) {
                carFeatures = val;
                break;
              }
            }
          }
        }
        if (carFeatures) break;
      }
    }
  }
  return carFeatures;
}

function extractAirbags(safetyText) {
  if (!safetyText) return 'Not Available';
  const match = safetyText.match(/(\d+)\s*airbags/i);
  if (match) return `${match[1]} Airbags`;
  if (safetyText.toLowerCase().includes('airbag')) return 'Yes (Standard)';
  return '6 Airbags (Standard)';
}

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
    if (index === 2 || (index === 1 && EV_DATABASE.length === 2)) optB.selected = true; // Ioniq 5 initially
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

  const variantA = (carA.variants && carA.variants[0]) || {};
  const variantB = (carB.variants && carB.variants[0]) || {};

  const dataA = getOnRoadPriceData(variantA.priceVal || carA.priceVal || 0, compStateKey);
  const dataB = getOnRoadPriceData(variantB.priceVal || carB.priceVal || 0, compStateKey);

  const featsA = getVehicleFeatures(carA) || {};
  const featsB = getVehicleFeatures(carB) || {};

  const adasA = featsA.adas || featsA.ADAS || (carA.features && carA.features.toLowerCase().includes('adas') ? 'Yes' : 'Not Available');
  const adasB = featsB.adas || featsB.ADAS || (carB.features && carB.features.toLowerCase().includes('adas') ? 'Yes' : 'Not Available');

  const infotainmentA = featsA.infotainment || featsA.Infotainment || 'Not Available';
  const infotainmentB = featsB.infotainment || featsB.Infotainment || 'Not Available';

  const specsList = [
    {
      label: 'Variant Name',
      valA: variantA.name || 'Not Available',
      valB: variantB.name || 'Not Available',
      compare: null
    },
    {
      label: 'Ex-showroom Price',
      valA: variantA.price || carA.price || 'Not Available',
      valB: variantB.price || carB.price || 'Not Available',
      compare: () => {
        const pA = variantA.priceVal || carA.priceVal || 0;
        const pB = variantB.priceVal || carB.priceVal || 0;
        if (pA === 0 || pB === 0) return 0;
        return pA < pB ? 1 : (pA > pB ? 2 : 3);
      }
    },
    {
      label: 'Est. On-Road Price',
      valA: dataA ? formatCurrency(dataA.onRoad) : 'Not Available',
      valB: dataB ? formatCurrency(dataB.onRoad) : 'Not Available',
      compare: () => {
        const pA = dataA ? dataA.onRoad : 0;
        const pB = dataB ? dataB.onRoad : 0;
        if (pA === 0 || pB === 0) return 0;
        return pA < pB ? 1 : (pA > pB ? 2 : 3);
      }
    },
    {
      label: 'Battery Capacity',
      valA: variantA.battery || carA.battery || 'Not Available',
      valB: variantB.battery || carB.battery || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Claimed Range',
      valA: variantA.range || carA.range || 'Not Available',
      valB: variantB.range || carB.range || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Real-world Range',
      valA: (variantA.range || carA.range) ? `${Math.round(parseFloat(variantA.range || carA.range) * 0.85)} km` : 'Not Available',
      valB: (variantB.range || carB.range) ? `${Math.round(parseFloat(variantB.range || carB.range) * 0.85)} km` : 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Motor Output (Power)',
      valA: variantA.power || carA.power || 'Not Available',
      valB: variantB.power || carB.power || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Peak Torque',
      valA: variantA.torque || carA.torque || 'Not Available',
      valB: variantB.torque || carB.torque || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Top Speed',
      valA: variantA.speed || carA.speed || 'Not Available',
      valB: variantB.speed || carB.speed || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: '0–100 km/h Acceleration',
      valA: variantA.acceleration || carA.acceleration || 'Not Available',
      valB: variantB.acceleration || carB.acceleration || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 999;
        const vB = parseFloat(b) || 999;
        if (vA === 999 || vB === 999) return 0;
        return vA < vB ? 1 : (vA > vB ? 2 : 3);
      }
    },
    {
      label: 'Charging Time (DC Fast)',
      valA: variantA.charging || carA.charging || 'Not Available',
      valB: variantB.charging || carB.charging || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 999;
        const vB = parseFloat(b) || 999;
        if (vA === 999 || vB === 999) return 0;
        return vA < vB ? 1 : (vA > vB ? 2 : 3);
      }
    },
    {
      label: 'Standard AC Charging',
      valA: carA.chargingAC || 'Not Available',
      valB: carB.chargingAC || 'Not Available',
      compare: null
    },
    {
      label: 'Fast Charging Support',
      valA: (variantA.charging || carA.charging) ? 'Yes' : 'Not Available',
      valB: (variantB.charging || carB.charging) ? 'Yes' : 'Not Available',
      compare: null
    },
    {
      label: 'Drive Type',
      valA: variantA.drivetrain || carA.drivetrain || 'Not Available',
      valB: variantB.drivetrain || carB.drivetrain || 'Not Available',
      compare: null
    },
    {
      label: 'Motor Type',
      valA: carA.motorType || 'PMSM (Permanent Magnet Synchronous Motor)',
      valB: carB.motorType || 'PMSM (Permanent Magnet Synchronous Motor)',
      compare: null
    },
    {
      label: 'Seating Capacity',
      valA: carA.seating || variantA.seating || 'Not Available',
      valB: carB.seating || variantB.seating || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Boot Space',
      valA: carA.bootSpace || variantA.bootSpace || 'Not Available',
      valB: carB.bootSpace || variantB.bootSpace || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Ground Clearance',
      valA: carA.clearance || variantA.clearance || 'Not Available',
      valB: carB.clearance || variantB.clearance || 'Not Available',
      compare: (a, b) => {
        const vA = parseFloat(a) || 0;
        const vB = parseFloat(b) || 0;
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Dimensions',
      valA: variantA.dimensions || carA.dimensions || 'Not Available',
      valB: variantB.dimensions || carB.dimensions || 'Not Available',
      compare: null
    },
    {
      label: 'Safety Rating',
      valA: variantA.safety || carA.safety || 'Not Available',
      valB: variantB.safety || carB.safety || 'Not Available',
      compare: (a, b) => {
        const getStars = (s) => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
        const vA = getStars(a);
        const vB = getStars(b);
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'Airbags',
      valA: extractAirbags(featsA.safety || carA.safety || ''),
      valB: extractAirbags(featsB.safety || carB.safety || ''),
      compare: (a, b) => {
        const getAirbags = (s) => { const m = s.match(/(\d+)/); return m ? parseInt(m[1]) : 0; };
        const vA = getAirbags(a);
        const vB = getAirbags(b);
        if (vA === 0 || vB === 0) return 0;
        return vA > vB ? 1 : (vA < vB ? 2 : 3);
      }
    },
    {
      label: 'ADAS Features',
      valA: adasA,
      valB: adasB,
      compare: null
    },
    {
      label: 'Infotainment System',
      valA: infotainmentA,
      valB: infotainmentB,
      compare: null
    },
    {
      label: 'Warranty',
      valA: carA.warranty || variantA.warranty || 'Not Available',
      valB: carB.warranty || variantB.warranty || 'Not Available',
      compare: null
    }
  ];

  const getVal = (val) => {
    if (val === undefined || val === null || String(val).trim() === '' || String(val).toLowerCase() === 'undefined' || String(val).toLowerCase() === 'null') {
      return 'Not Available';
    }
    return val;
  };

  compTableBody.innerHTML = '';
  specsList.forEach(spec => {
    const row = document.createElement('tr');
    row.className = 'border-b border-zinc-200 hover:bg-zinc-50 transition-colors';
    
    const formattedA = getVal(spec.valA);
    const formattedB = getVal(spec.valB);
    
    let highlightClassA = '';
    let highlightClassB = '';
    let badgeA = '';
    let badgeB = '';
    
    if (spec.compare && formattedA !== 'Not Available' && formattedB !== 'Not Available') {
      const outcome = spec.compare(formattedA, formattedB);
      if (outcome === 1) {
        highlightClassA = 'bg-emerald-50/60 font-semibold';
        badgeA = `<span class="ml-2 text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-200 uppercase tracking-wider font-bold">Better</span>`;
      } else if (outcome === 2) {
        highlightClassB = 'bg-emerald-50/60 font-semibold';
        badgeB = `<span class="ml-2 text-[8px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 border border-emerald-200 uppercase tracking-wider font-bold">Better</span>`;
      } else if (outcome === 3) {
        badgeA = `<span class="ml-2 text-[8px] bg-zinc-150 text-zinc-650 px-1.5 py-0.5 border border-zinc-250 uppercase tracking-wider">Same</span>`;
        badgeB = `<span class="ml-2 text-[8px] bg-zinc-150 text-zinc-650 px-1.5 py-0.5 border border-zinc-250 uppercase tracking-wider">Same</span>`;
      }
    }
    
    if (formattedA !== formattedB) {
      row.className += ' bg-amber-50/10';
    }

    row.innerHTML = `
      <td class="p-4 font-bold text-zinc-500 uppercase text-[9px] tracking-wider border-r border-zinc-200">${spec.label}</td>
      <td class="p-4 text-zinc-800 border-r border-zinc-200 ${highlightClassA}">${formattedA} ${badgeA}</td>
      <td class="p-4 text-zinc-800 ${highlightClassB}">${formattedB} ${badgeB}</td>
    `;
    compTableBody.appendChild(row);
  });
}

if (compSelectA) compSelectA.addEventListener('change', updateCompareTable);
if (compSelectB) compSelectB.addEventListener('change', updateCompareTable);

const compStateSelect = document.getElementById('comp-state-select');
if (compStateSelect) compStateSelect.addEventListener('change', updateCompareTable);


// --- Section: Charging Stations Finder ---
const stationSearchInput = document.getElementById('station-search-input');
const filterChargerFast = document.getElementById('filter-charger-fast');
const filterChargerNormal = document.getElementById('filter-charger-normal');
const stationsListContainer = document.getElementById('stations-list-container');

// Leaflet map instances
let chargerMap = null;
let chargerMarkersGroup = null;

function initChargerMap() {
  const mapContainer = document.getElementById('map');
  if (!mapContainer || typeof L === 'undefined') {
    console.warn("Leaflet Map or map container not found.");
    return;
  }

  try {
    // Initialize map centered at Bangalore
    chargerMap = L.map('map', { zoomControl: false }).setView([12.9716, 77.5946], 11);
    L.control.zoom({ position: 'bottomright' }).addTo(chargerMap);

    // Use light themed CartoDB tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(chargerMap);

    chargerMarkersGroup = L.layerGroup().addTo(chargerMap);
  } catch (err) {
    console.error("Failed to initialize Leaflet map:", err);
  }
}

// Map of known cities to coordinates
const CITY_COORDS = {
  "mumbai": { lat: "19.0760", lng: "72.8777" },
  "navi mumbai": { lat: "19.0330", lng: "73.0297" },
  "thane": { lat: "19.2183", lng: "72.9781" },
  "pune": { lat: "18.5204", lng: "73.8567" },
  "nagpur": { lat: "21.1458", lng: "79.0882" },
  "nashik": { lat: "19.9975", lng: "73.7898" },
  "aurangabad": { lat: "19.8762", lng: "75.3433" },
  "kolhapur": { lat: "16.7050", lng: "74.2433" },
  "solapur": { lat: "17.6599", lng: "75.9064" },

  "delhi": { lat: "28.6139", lng: "77.2090" },
  "new delhi": { lat: "28.6139", lng: "77.2090" },
  "gurgaon": { lat: "28.4595", lng: "77.0266" },
  "gurugram": { lat: "28.4595", lng: "77.0266" },
  "noida": { lat: "28.5355", lng: "77.3910" },
  "greater noida": { lat: "28.4744", lng: "77.5040" },
  "faridabad": { lat: "28.4089", lng: "77.3178" },
  "ghaziabad": { lat: "28.6692", lng: "77.4538" },

  "bangalore": { lat: "12.9716", lng: "77.5946" },
  "bengaluru": { lat: "12.9716", lng: "77.5946" },
  "mysore": { lat: "12.2958", lng: "76.6394" },
  "mysuru": { lat: "12.2958", lng: "76.6394" },
  "mangalore": { lat: "12.9141", lng: "74.8560" },
  "mangaluru": { lat: "12.9141", lng: "74.8560" },
  "hubli": { lat: "15.3647", lng: "75.1240" },
  "dharwad": { lat: "15.4589", lng: "75.0078" },
  "belagavi": { lat: "15.8497", lng: "74.4977" },
  "bellary": { lat: "15.1394", lng: "76.9214" },
  "tumakuru": { lat: "13.3409", lng: "77.1010" },
  "shivamogga": { lat: "13.9299", lng: "75.5681" },
  "udupi": { lat: "13.3409", lng: "74.7421" },

  "chennai": { lat: "13.0827", lng: "80.2707" },
  "coimbatore": { lat: "11.0168", lng: "76.9558" },
  "madurai": { lat: "9.9252", lng: "78.1198" },
  "salem": { lat: "11.6643", lng: "78.1460" },
  "trichy": { lat: "10.7905", lng: "78.7047" },
  "tiruchirappalli": { lat: "10.7905", lng: "78.7047" },
  "vellore": { lat: "12.9165", lng: "79.1325" },
  "tirunelveli": { lat: "8.7139", lng: "77.7567" },

  "hyderabad": { lat: "17.3850", lng: "78.4867" },
  "warangal": { lat: "17.9784", lng: "79.5941" },
  "karimnagar": { lat: "18.4386", lng: "79.1288" },
  "nizamabad": { lat: "18.6725", lng: "78.0941" },

  "visakhapatnam": { lat: "17.6868", lng: "83.2185" },
  "vijayawada": { lat: "16.5062", lng: "80.6480" },
  "guntur": { lat: "16.3067", lng: "80.4365" },
  "nellore": { lat: "14.4426", lng: "79.9865" },
  "tirupati": { lat: "13.6288", lng: "79.4192" },
  "kakinada": { lat: "16.9891", lng: "82.2475" },

  "kochi": { lat: "9.9312", lng: "76.2673" },
  "ernakulam": { lat: "9.9816", lng: "76.2999" },
  "kozhikode": { lat: "11.2588", lng: "75.7804" },
  "thrissur": { lat: "10.5276", lng: "76.2144" },
  "kollam": { lat: "8.8932", lng: "76.6141" },
  "alappuzha": { lat: "9.4981", lng: "76.3388" },
  "kannur": { lat: "11.8745", lng: "75.3704" },
  "thiruvananthapuram": { lat: "8.5241", lng: "76.9366" },

  "kolkata": { lat: "22.5726", lng: "88.3639" },
  "howrah": { lat: "22.5958", lng: "88.2636" },
  "durgapur": { lat: "23.5204", lng: "87.3119" },
  "siliguri": { lat: "26.7271", lng: "88.3953" },
  "asansol": { lat: "23.6739", lng: "86.9524" },

  "ahmedabad": { lat: "23.0225", lng: "72.5714" },
  "surat": { lat: "21.1702", lng: "72.8311" },
  "vadodara": { lat: "22.3072", lng: "73.1812" },
  "rajkot": { lat: "22.3039", lng: "70.8022" },
  "bhavnagar": { lat: "21.7645", lng: "72.1519" },

  "jaipur": { lat: "26.9124", lng: "75.7873" },
  "jodhpur": { lat: "26.2389", lng: "73.0243" },
  "udaipur": { lat: "24.5854", lng: "73.7125" },
  "kota": { lat: "25.2138", lng: "75.8648" },
  "ajmer": { lat: "26.4499", lng: "74.6399" },

  "lucknow": { lat: "26.8467", lng: "80.9462" },
  "kanpur": { lat: "26.4499", lng: "80.3319" },
  "agra": { lat: "27.1767", lng: "78.0081" },
  "varanasi": { lat: "25.3176", lng: "82.9739" },
  "prayagraj": { lat: "25.4358", lng: "81.8463" },
  "meerut": { lat: "28.9845", lng: "77.7064" },
  "bareilly": { lat: "28.3670", lng: "79.4304" },
  "gorakhpur": { lat: "26.7606", lng: "83.3732" },
  
  "amritsar": { lat: "31.6340", lng: "74.8723" },
  "ludhiana": { lat: "30.9010", lng: "75.8573" },
  "jalandhar": { lat: "31.3260", lng: "75.5762" },
  "patiala": { lat: "30.3398", lng: "76.3869" },
  "bathinda": { lat: "30.2109", lng: "74.9455" },

  
  "panipat": { lat: "29.3909", lng: "76.9635" },
  "ambala": { lat: "30.3782", lng: "76.7767" },
  "hisar": { lat: "29.1492", lng: "75.7217" },
  "rohtak": { lat: "28.8955", lng: "76.6066" },
  "karnal": { lat: "29.6857", lng: "76.9905" },

  
  "dehradun": { lat: "30.3165", lng: "78.0322" },
  "haridwar": { lat: "29.9457", lng: "78.1642" },
  "rishikesh": { lat: "30.0869", lng: "78.2676" },
  "haldwani": { lat: "29.2183", lng: "79.5130" },


  "shimla": { lat: "31.1048", lng: "77.1734" },
  "manali": { lat: "32.2396", lng: "77.1887" },
  "solan": { lat: "30.9042", lng: "77.0967" },
  "dharamshala": { lat: "32.2190", lng: "76.3234" },

  
  "patna": { lat: "25.5941", lng: "85.1376" },
  "gaya": { lat: "24.7914", lng: "85.0002" },
  "muzaffarpur": { lat: "26.1209", lng: "85.3647" },
  "bhagalpur": { lat: "25.2425", lng: "86.9842" },

  
  "ranchi": { lat: "23.3441", lng: "85.3096" },
  "jamshedpur": { lat: "22.8046", lng: "86.2029" },
  "dhanbad": { lat: "23.7957", lng: "86.4304" },
  "bokaro": { lat: "23.6693", lng: "86.1511" },

  
  "raipur": { lat: "21.2514", lng: "81.6296" },
  "bhilai": { lat: "21.1938", lng: "81.3509" },
  "bilaspur": { lat: "22.0797", lng: "82.1409" },
  "durg": { lat: "21.1904", lng: "81.2849" },

  
  "bhubaneswar": { lat: "20.2961", lng: "85.8245" },
  "cuttack": { lat: "20.4625", lng: "85.8828" },
  "rourkela": { lat: "22.2604", lng: "84.8536" },
  "puri": { lat: "19.8135", lng: "85.8312" },
  "sambalpur": { lat: "21.4669", lng: "83.9812" },

  
  "guwahati": { lat: "26.1445", lng: "91.7362" },
  "silchar": { lat: "24.8333", lng: "92.7789" },
  "dibrugarh": { lat: "27.4728", lng: "94.9120" },
  "jorhat": { lat: "26.7509", lng: "94.2037" },

  
  "agartala": { lat: "23.8315", lng: "91.2868" },
  "imphal": { lat: "24.8170", lng: "93.9368" },
  "aizawl": { lat: "23.7271", lng: "92.7176" },
  "kohima": { lat: "25.6751", lng: "94.1086" },
  "dimapur": { lat: "25.9091", lng: "93.7276" },
  "itanagar": { lat: "27.0844", lng: "93.6053" },
  "gangtok": { lat: "27.3389", lng: "88.6065" },
  "shillong": { lat: "25.5788", lng: "91.8933" },

  
  "goa": { lat: "15.2993", lng: "74.1240" },
  "panaji": { lat: "15.4909", lng: "73.8278" },
  "margao": { lat: "15.2832", lng: "73.9862" },
  "vasco da gama": { lat: "15.3860", lng: "73.8440" },

  
  "srinagar": { lat: "34.0837", lng: "74.7973" },
  "jammu": { lat: "32.7266", lng: "74.8570" },
  "leh": { lat: "34.1526", lng: "77.5771" },
  "kargil": { lat: "34.5539", lng: "76.1349" },

  
  "chandigarh": { lat: "30.7333", lng: "76.7794" },
  "pondicherry": { lat: "11.9416", lng: "79.8083" },
  "puducherry": { lat: "11.9416", lng: "79.8083" },
  "port blair": { lat: "11.6234", lng: "92.7265" },
  "daman": { lat: "20.3974", lng: "72.8328" },
  "diu": { lat: "20.7144", lng: "70.9874" },
  "silvassa": { lat: "20.2739", lng: "72.9967" },
  "kavaratti": { lat: "10.5669", lng: "72.6420" }
};

let debounceTimeout = null;

async function renderChargingStations() {
  if (!stationSearchInput || !stationsListContainer) return;
  
  const query = stationSearchInput.value.toLowerCase().trim();
  const showFast = filterChargerFast ? filterChargerFast.checked : true;
  const showNormal = filterChargerNormal ? filterChargerNormal.checked : true;
  
  stationsListContainer.innerHTML = `
    <div class="text-center py-8 text-zinc-600 font-mono text-[10px] animate-pulse">
      FETCHING CHARGERS FROM NETWORK CORE...
    </div>
  `;

  const searchKey = query || 'bangalore';
  const coords = CITY_COORDS[searchKey];

  if (!coords) {
    stationsListContainer.innerHTML = `
      <div class="text-center py-8 text-red-600 font-mono text-[10px]">
        ERROR: INVALID COORDINATES (UNKNOWN CITY "${query.toUpperCase()}"). PLEASE SEARCH FOR DELHI, MUMBAI, BANGALORE, OR HYDERABAD.
      </div>
    `;
    if (chargerMarkersGroup) chargerMarkersGroup.clearLayers();
    return;
  }

  try {
    const url = `/api/chargers/nearby?latitude=${coords.lat}&longitude=${coords.lng}&distance=70&maxresults=300`;
    console.log(`Frontend sending chargers request for lat: ${coords.lat}, lng: ${coords.lng}`);
    const response = await fetch(url);
    
    if (response.status === 401) {
      throw new Error('INVALID_API_KEY');
    }
    if (response.status === 429) {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    if (!response.ok) {
      throw new Error('BACKEND_ERROR');
    }

    const resData = await response.json();
    if (!resData.success) {
      if (resData.message && resData.message.includes('API key')) {
        throw new Error('INVALID_API_KEY');
      }
      throw new Error(resData.error || 'BACKEND_ERROR');
    }

    const stations = resData.data;
    if (!Array.isArray(stations)) {
      throw new Error('EMPTY_API_RESPONSE');
    }

    console.log(`Stations received: Yes | Number of stations: ${stations.length}`);

    if (stations.length === 0) {
      throw new Error('EMPTY_API_RESPONSE');
    }

    // Process and filter stations
    const processedStations = stations.map(st => {
      const addressInfo = st.AddressInfo || {};
      const title = addressInfo.Title || 'Unknown Charger';
      const address = [addressInfo.AddressLine1, addressInfo.Town].filter(Boolean).join(', ') || 'No address details';
      
      // Determine charger type and speed from connections list
      let speed = '7.4 kW';
      let isFast = false;
      if (Array.isArray(st.Connections) && st.Connections.length > 0) {
        const pwr = st.Connections[0].PowerKW;
        if (pwr) {
          speed = `${pwr} kW`;
          if (pwr >= 30) isFast = true;
        }
      }

      return {
        name: title,
        address: address,
        lat: addressInfo.Latitude,
        lng: addressInfo.Longitude,
        type: isFast ? 'Fast' : 'Normal',
        speed: speed,
        status: (st.StatusType && st.StatusType.Title) || 'Available'
      };
    });

    const filtered = processedStations.filter(st => {
      if (st.type === 'Fast' && !showFast) return false;
      if (st.type === 'Normal' && !showNormal) return false;
      return true;
    });

    if (filtered.length === 0) {
      stationsListContainer.innerHTML = `
        <div class="text-center py-8 text-zinc-600 font-mono text-[10px]">
          NO CHARGERS FOUND IN LOCATION BOUNDS FOR SELECTED FILTERS.
        </div>
      `;
      if (chargerMarkersGroup) chargerMarkersGroup.clearLayers();
      return;
    }

    // Populate List
    stationsListContainer.innerHTML = '';
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
            <span class="text-[8px] block mt-1 ${st.status === 'Operational' || st.status === 'Available' ? 'text-black font-bold' : 'text-zinc-400'}">${st.status.toUpperCase()}</span>
          </div>
        </div>
        <div class="mt-2 flex justify-end">
         <a
         href="https://www.google.com/maps/dir/?api=1&destination=${st.lat},${st.lng}"
         target="_blank"
         rel="noopener noreferrer"
          class="text-blue-600 hover:text-blue-800 hover:underline text-[12px] font-medium"
          >
           Directions →
            </a>
            </div>
      `;
      stationsListContainer.appendChild(item);
    });

    // Populate Leaflet Map Markers
    if (chargerMap && chargerMarkersGroup) {
      chargerMarkersGroup.clearLayers();
      
      // Pan map to new city coordinates
      chargerMap.setView([coords.lat, coords.lng], 11);

      let markersCount = 0;
      filtered.forEach(st => {
        if (st.lat && st.lng) {
          const marker = L.marker([st.lat, st.lng])
            .bindPopup(`
              <div class="font-mono text-[10px] text-left">
                <strong class="text-black uppercase">${st.name}</strong><br>
                <span class="text-zinc-600 block mt-0.5">${st.address}</span>
                <span class="inline-block mt-1 px-1.5 py-0.5 bg-zinc-100 text-[8px] text-zinc-700 border border-zinc-200 uppercase">${st.type} [${st.speed}]</span>
              </div>
            `);
          chargerMarkersGroup.addLayer(marker);
          markersCount++;
        }
      });
      console.log(`Number of markers displayed: ${markersCount}`);
    }

  } catch (error) {
    console.error('Error rendering stations:', error);
    let errMsg = 'NETWORK FAILURE (FAILED TO REACH SERVER CORE)';
    if (error.message === 'INVALID_API_KEY') {
      errMsg = 'INVALID API KEY (OPEN CHARGE MAP API UNAUTHORIZED)';
    } else if (error.message === 'RATE_LIMIT_EXCEEDED') {
      errMsg = 'RATE LIMIT EXCEEDED (TOO MANY REQUESTS)';
    } else if (error.message === 'EMPTY_API_RESPONSE') {
      errMsg = 'EMPTY API RESPONSE (NO POI DATA FOUND FOR LOCATION)';
    } else if (error.message === 'BACKEND_ERROR') {
      errMsg = 'BACKEND ERROR (SERVER RESPONDED WITH AN ERROR)';
    }
    
    stationsListContainer.innerHTML = `
      <div class="text-center py-8 text-red-600 font-mono text-[10px] uppercase">
        ERROR: ${errMsg}
      </div>
    `;
    if (chargerMarkersGroup) chargerMarkersGroup.clearLayers();
  }
}

// Debounce helper for inputs
function handleSearchInput() {
  if (debounceTimeout) clearTimeout(debounceTimeout);
  debounceTimeout = setTimeout(renderChargingStations, 300);
}

// Initialize map & load data
initChargerMap();
renderChargingStations();

if (stationSearchInput) stationSearchInput.addEventListener('input', handleSearchInput);
if (filterChargerFast) filterChargerFast.addEventListener('change', renderChargingStations);
if (filterChargerNormal) filterChargerNormal.addEventListener('change', renderChargingStations);


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
// Login navigation
document.querySelectorAll('#login-nav-btn, #login-nav-btn-mobile').forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo('/login');
  });
});


document.getElementById('global-search-input').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const val = e.target.value.trim();
    closeAllModals();
    document.getElementById('search-car-name').value = val;
    navigateTo('/search' + (val ? '?name=' + encodeURIComponent(val) : ''));
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


// --- Language Selector Module ---
(function initLanguageSelector() {
  const btn = document.getElementById('lang-selector-btn');
  const dropdown = document.getElementById('lang-dropdown');
  const currentLabel = document.getElementById('lang-current');
  const options = document.querySelectorAll('#lang-dropdown .lang-option');

  if (btn && dropdown) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = !dropdown.classList.contains('invisible');
      dropdown.classList.toggle('opacity-0', isOpen);
      dropdown.classList.toggle('invisible', isOpen);
      dropdown.classList.toggle('translate-y-1', isOpen);
      btn.querySelector('.lang-caret').classList.toggle('rotate-180', !isOpen);
    });

    document.addEventListener('click', () => {
      if (!dropdown.classList.contains('invisible')) {
        dropdown.classList.add('opacity-0', 'invisible', 'translate-y-1');
        btn.querySelector('.lang-caret').classList.remove('rotate-180');
      }
    });
  }

  // Brand names to skip when they appear as text content
  const BRAND_NAMES = ['tata', 'mg', 'hyundai', 'kia', 'mahindra', 'byton', 'bmw', 'mercedes', 'audi', 'tesla',
    'nissan', 'renault', 'porsche', 'volvo', 'jaguar', 'mini', 'byd', 'mitsubishi', 'skoda', 'volkswagen',
    'toyota', 'honda', 'suzuki', 'maruti', 'lectric'];

  // Hook up TranslationEngine
  const TranslationEngine = {
    currentLanguage: 'en',
    isTranslating: false,
    pendingTranslation: false,
    observer: null,
    _translationCache: {},
    _observerPaused: false,

    init() {
      const saved = localStorage.getItem('evcarwale_language');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.lang) {
            this.currentLanguage = parsed.lang;
          }
        } catch (e) {
          if (typeof saved === 'string') {
            this.currentLanguage = saved;
          }
        }
      }

      this.updateLanguageUI(this.currentLanguage);
      this.setupObserver();

      if (this.currentLanguage !== 'en') {
        this.translatePage();
      }
    },

    updateLanguageUI(lang) {
      const text = this.getLangName(lang);
      
      const customLabel = document.getElementById('custom-lang-label');
      if (customLabel) {
        customLabel.textContent = lang.toUpperCase();
      }
      const customOptions = document.querySelectorAll('#custom-lang-menu .lang-option');
      customOptions.forEach(opt => {
        if (opt.getAttribute('data-lang') === lang) {
          opt.classList.add('text-black', 'font-bold');
        } else {
          opt.classList.remove('text-black', 'font-bold');
        }
      });

      if (currentLabel) {
        currentLabel.textContent = text;
      }
      if (options) {
        options.forEach(opt => {
          if (opt.dataset.lang === lang) {
            opt.classList.add('text-black', 'font-bold');
          } else {
            opt.classList.remove('text-black', 'font-bold');
          }
        });
      }
    },

    setupObserver() {
      if (this.observer) return;
      
      this.observer = new MutationObserver((mutations) => {
        if (this.currentLanguage === 'en') return;
        if (this._observerPaused) return;
        
        if (this.isTranslating) {
          this.pendingTranslation = true;
          return;
        }

        let shouldTranslate = false;
        for (const mutation of mutations) {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            shouldTranslate = true;
            break;
          }
          if (mutation.type === 'characterData') {
            const node = mutation.target;
            if (node.nodeType === Node.TEXT_NODE) {
              const val = node.textContent.trim();
              if (val && val !== node._translatedText && !node._isTranslating) {
                shouldTranslate = true;
                break;
              }
            }
          }
        }

        if (shouldTranslate) {
          if (this._debounceTimeout) clearTimeout(this._debounceTimeout);
          this._debounceTimeout = setTimeout(() => {
            this.translatePage();
          }, 300);
        }
      });

      this.observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true
      });
    },

    _isBrandText(text) {
      const lower = text.toLowerCase().trim();
      for (const brand of BRAND_NAMES) {
        if (lower === brand || lower.startsWith(brand + ' ') || lower.endsWith(' ' + brand) || lower.includes(' ' + brand + ' ')) {
          return true;
        }
      }
      return false;
    },

    async translatePage() {
      if (this.currentLanguage === 'en') return;
      if (this.isTranslating) return;

      this.isTranslating = true;
      this._observerPaused = true;
      const customLabel = document.getElementById('custom-lang-label');
      if (customLabel) {
        customLabel.textContent = '...';
      }

      try {
        const textNodes = [];
        const textsToTranslate = [];

        const walk = (node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName.toUpperCase();
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE', 'INPUT', 'TEXTAREA', 'SELECT', 'OPTION'].includes(tagName)) {
              return;
            }
            if (node.classList && (node.classList.contains('notranslate') || node.closest('.notranslate'))) {
              return;
            }
          }

          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text.length > 1 && isNaN(text) && !text.match(/^[\d\s\-\+\:\,\.\/\(\)₹€$%]+$/)) {
              if (this._isBrandText(text)) return;
              if (!node._originalText) {
                node._originalText = node.textContent;
              }
              if (node.textContent !== node._translatedText || node._translatedLang !== this.currentLanguage) {
                textNodes.push(node);
                textsToTranslate.push(node._originalText);
              }
            }
            return;
          }

          for (let child = node.firstChild; child; child = child.nextSibling) {
            walk.call(this, child);
          }
        };

        walk.call(this, document.body);

        if (textsToTranslate.length === 0) {
          if (customLabel) {
            customLabel.textContent = this.currentLanguage.toUpperCase();
          }
          return;
        }

        // Deduplicate: send unique texts only, then map back
        const uniqueMap = new Map();
        const originalToIdx = new Array(textsToTranslate.length);
        for (let i = 0; i < textsToTranslate.length; i++) {
          const t = textsToTranslate[i];
          if (!uniqueMap.has(t)) {
            uniqueMap.set(t, { index: uniqueMap.size, translation: null });
          }
          originalToIdx[i] = uniqueMap.get(t).index;
        }
        const uniqueTexts = [...uniqueMap.keys()];

        // Check cache for each unique text
        const uncachedTexts = [];
        const uncachedUniqueIndices = [];
        for (const [text, entry] of uniqueMap) {
          const cacheKey = text + '::' + this.currentLanguage;
          if (this._translationCache[cacheKey]) {
            entry.translation = this._translationCache[cacheKey];
          } else {
            uncachedTexts.push(text);
            uncachedUniqueIndices.push(entry.index);
          }
        }

        if (uncachedTexts.length > 0) {
          const BATCH_SIZE = 30;
          const batchPromises = [];
          for (let i = 0; i < uncachedTexts.length; i += BATCH_SIZE) {
            const batchTexts = uncachedTexts.slice(i, i + BATCH_SIZE);
            const batchUniqueIndices = uncachedUniqueIndices.slice(i, i + BATCH_SIZE);
            batchPromises.push(
              (async () => {
                const response = await fetch('/api/translate', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    texts: batchTexts,
                    targetLanguage: this.currentLanguage
                  })
                });
                if (!response.ok) {
                  let errorText = 'Translation API failed';
                  try {
                    const errData = await response.json();
                    if (errData && errData.error) errorText = errData.error;
                  } catch (_) {}
                  throw new Error(errorText);
                }
                const data = await response.json();
                if (data.translations && Array.isArray(data.translations)) {
                  for (let j = 0; j < data.translations.length; j++) {
                    const text = batchTexts[j];
                    const translated = data.translations[j];
                    uniqueMap.get(text).translation = translated;
                    this._translationCache[text + '::' + this.currentLanguage] = translated;
                  }
                }
              })()
            );
          }
          await Promise.all(batchPromises);
        }

        const translations = textsToTranslate.map((t) => {
          const entry = uniqueMap.get(t);
          return entry.translation || t;
        });

        for (let i = 0; i < textNodes.length; i++) {
          const node = textNodes[i];
          const translation = translations[i];
          if (translation) {
            node._isTranslating = true;
            const original = node.textContent;
            const leadingSpace = original.match(/^\s*/)[0];
            const trailingSpace = original.match(/\s*$/)[0];
            node.textContent = leadingSpace + translation.trim() + trailingSpace;
            node._translatedText = node.textContent;
            node._translatedLang = this.currentLanguage;
            node._isTranslating = false;
          }
        }

        if (customLabel) {
          customLabel.textContent = this.currentLanguage.toUpperCase();
        }

      } catch (e) {
        console.error('Translation error:', e);
        if (customLabel) {
          customLabel.textContent = 'ERR';
          setTimeout(() => {
            if (customLabel.textContent === 'ERR') {
              customLabel.textContent = this.currentLanguage.toUpperCase();
            }
          }, 2000);
        }
      } finally {
        this.isTranslating = false;
        this._observerPaused = false;
        if (this.pendingTranslation) {
          this.pendingTranslation = false;
          setTimeout(() => this.translatePage(), 100);
        }
      }
    },

    async setLanguage(lang) {
      if (lang === this.currentLanguage) return;

      if (lang === 'en') {
        this._observerPaused = true;
        this.currentLanguage = 'en';
        localStorage.setItem('evcarwale_language', JSON.stringify({ lang: 'en', text: 'English' }));
        this.updateLanguageUI('en');

        const walkAndRestore = (node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            if (node._originalText && node.textContent !== node._originalText) {
              node.textContent = node._originalText;
              node._translatedText = undefined;
              node._translatedLang = undefined;
            }
            return;
          }
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tagName = node.tagName?.toUpperCase();
            if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'CODE', 'PRE'].includes(tagName)) return;
          }

          for (let child = node.firstChild; child; child = child.nextSibling) {
            walkAndRestore(child);
          }
        };
        walkAndRestore(document.body);
        
        this._observerPaused = false;
      } else {
        this.currentLanguage = lang;
        localStorage.setItem('evcarwale_language', JSON.stringify({ lang: lang, text: this.getLangName(lang) }));
        this.updateLanguageUI(lang);
        await this.translatePage();
      }
    },

    getLangName(lang) {
      const names = {
        en: 'English',
        hi: 'Hindi',
        kn: 'Kannada',
        ml: 'Malayalam',
        te: 'Telugu',
        ta: 'Tamil'
      };
      return names[lang] || lang;
    }
  };

  window.TranslationEngine = TranslationEngine;

  // Initialize engine and wire selectors
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      TranslationEngine.init();
      wireSelectors();
    });
  } else {
    TranslationEngine.init();
    wireSelectors();
  }

  function wireSelectors() {
    if (options) {
      options.forEach(opt => {
        opt.addEventListener('click', () => {
          const lang = opt.dataset.lang;
          TranslationEngine.setLanguage(lang);
          if (dropdown) {
            dropdown.classList.add('opacity-0', 'invisible', 'translate-y-1');
            btn.querySelector('.lang-caret').classList.remove('rotate-180');
          }
        });
      });
    }
  }
})();

// --- FAQ Accordion toggle Module ---
document.querySelectorAll('#faq-accordion .accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const content = trigger.nextElementSibling;
    const parent = trigger.parentElement;
    
    // Close other panels
    document.querySelectorAll('#faq-accordion .accordion-item').forEach(item => {
      if (item !== parent) {
        item.classList.remove('open');
        const otherContent = item.querySelector('.accordion-content');
        if (otherContent) otherContent.style.maxHeight = null;
      }
    });
    
    if (parent.classList.contains('open')) {
      parent.classList.remove('open');
      content.style.maxHeight = null;
    } else {
      parent.classList.add('open');
      content.style.maxHeight = content.scrollHeight + 'px';
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
  } else if (['insights', 'videos'].includes(sectionId)) {
    const trigger = document.querySelector('.mega-trigger[data-mega="insights"]');
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

    if (!href) return;
    
    // Handle /#section-id links — scroll to homepage section
    if (href.startsWith('/#')) {
      e.preventDefault();
      e.stopPropagation();
      closeMegaPanels();
      closeMobileDrawer();
      activeRecentlyViewed = false;
      renderAllCarousels();
      const targetId = href.substring(2);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        const isSubpage = !detailsPageContent.classList.contains('hidden');
        if (isSubpage) {
          navigateTo('/');
          setTimeout(() => {
            const tEl = document.getElementById(targetId);
            if (tEl) tEl.scrollIntoView({ behavior: 'smooth' });
          }, 120);
        } else {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
        updateActiveNavTrigger(targetId);
      } else {
        navigateTo('/');
      }
      return;
    }
    
    // Path-based SPA navigation
    if (href.startsWith('/')) {
      e.preventDefault();
      e.stopPropagation();
      closeMegaPanels();
      closeMobileDrawer();
      activeRecentlyViewed = false;
      navigateTo(href);
      return;
    }
    
    if (!href.startsWith('#')) return;
    
    e.preventDefault();
    e.stopPropagation();
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
  // Clear any login page viewport scroll locks
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('height');
  if (detailsPageContent) {
    detailsPageContent.style.cssText = '';
  }

  // Restore global navbar and AI assistant container when navigating away
  const megaNav = document.getElementById('mega-nav');
  if (megaNav) megaNav.classList.remove('hidden');
  
  const aiAssistant = document.querySelector('.ai-assistant-container');
  if (aiAssistant) {
    aiAssistant.classList.remove('hidden');
    if (document.body.classList.contains('loaded')) {
      aiAssistant.classList.add('loaded');
    }
  }

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
        <div class="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-150 pb-4 mt-0 gap-4">
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
    
    // Bind back button — use browser history navigation
    document.getElementById('btn-subpage-back').addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        navigateTo('/');
      }
    });
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
  applyJargonBuster();
}

async function handleRouting() {
  // Clear any login page viewport scroll locks
  document.body.style.removeProperty('overflow');
  document.body.style.removeProperty('height');
  if (detailsPageContent) {
    detailsPageContent.style.cssText = '';
  }

  // Restore global navbar and AI assistant container when navigating away
  const megaNav = document.getElementById('mega-nav');
  if (megaNav) megaNav.classList.remove('hidden');
  
  const aiAssistant = document.querySelector('.ai-assistant-container');
  if (aiAssistant) {
    aiAssistant.classList.remove('hidden');
    if (document.body.classList.contains('loaded')) {
      aiAssistant.classList.add('loaded');
    }
  }

  currentDetailsCarId = null;
  await loadDatabase();
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
  } else if (path === '/news' || path.startsWith('/news/')) {
    route = path;
  } else if (hash === '#/news' || hash.startsWith('#/news/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/guide/')) {
    route = path;
  } else if (hash.startsWith('#/guide/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/reviews/')) {
    route = path;
  } else if (hash.startsWith('#/reviews/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/brands/')) {
    route = path;
  } else if (hash.startsWith('#/brands/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/brand/')) {
    route = path;
  } else if (hash.startsWith('#/brand/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/insights/') || path === '/insights') {
    route = path;
  } else if (hash.startsWith('#/insights/') || hash === '#/insights') {
    route = hash.substring(1);
  } else if (path.startsWith('/hub/')) {
    route = path;
  } else if (hash.startsWith('#/hub/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/learn/')) {
    route = path;
  } else if (hash.startsWith('#/learn/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/blog/')) {
    route = path;
  } else if (hash.startsWith('#/blog/')) {
    route = hash.substring(1);
  } else if (path.startsWith('/resources/')) {
    route = path;
  } else if (hash.startsWith('#/resources/')) {
    route = hash.substring(1);
  } else if (path === '/login' || path === '/signup' || path === '/forgot-password') {
    route = path;
  } else if (hash === '#/login' || hash === '#/signup' || hash === '#/forgot-password') {
    route = hash.substring(1);
  } else if (path.startsWith('/ev/')) {
    route = path;
  } else if (hash.startsWith('#/ev/')) {
    route = hash.substring(1);
  } else if (path === '/about' || path.startsWith('/about/') ||
             path.startsWith('/contact') || path === '/feedback' ||
             path === '/help' || path === '/faqs' ||
             path === '/privacy-policy' || path === '/terms-and-conditions' ||
             path === '/disclaimer' || path === '/cookie-policy' ||
             path === '/copyright') {
    route = path;
  } else if (hash === '#/about' || hash.startsWith('#/about/') ||
             hash.startsWith('#/contact') || hash === '#/feedback' ||
             hash === '#/help' || hash === '#/faqs' ||
             hash === '#/privacy-policy' || hash === '#/terms-and-conditions' ||
             hash === '#/disclaimer' || hash === '#/cookie-policy' ||
             hash === '#/copyright') {
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
    if (['popular', 'launches', 'upcoming', 'all'].includes(section)) {
      renderViewAllPage(section);
      return;
    }
    if (section === 'brands') {
      renderViewAllBrandsPage();
      return;
    }
  } else if (route === '/news') {
    await loadNews();
    renderNewsPage();
    return;
  } else if (route.startsWith('/news/')) {
    const id = route.substring(6);
    if (id === 'all') {
      await loadNews();
      renderAllNewsPage();
      return;
    } else {
      let article = NEWS_DATABASE.find(a => a.id === id);
      if (!article && newsCache) {
        const idx = parseInt(id.replace('news-api-', ''), 10);
        if (!isNaN(idx) && newsCache[idx]) {
          article = newsCache[idx];
        }
      }
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
  } else if (route.startsWith('/brands/')) {
    const brandId = route.substring(8);
    renderBrandPage(brandId);
    return;
  } else if (route.startsWith('/brand/')) {
    const brandId = route.substring(7);
    renderBrandPage(brandId);
    return;
  } else if (route === '/insights') {
    renderAllInsightsPage();
    return;
  } else if (route.startsWith('/insights/')) {
    const parts = route.substring(10).split('/');
    let categoryKey = parts[0] || 'latest-news';
    const articleId = parts[1] || null;
    if (categoryKey === 'blogs') {
      renderAllBlogsPage();
      return;
    }
    const resolvedKey = INSIGHTS_SLUG_ALIASES[categoryKey] || categoryKey;
    if (articleId) {
      const article = INSIGHTS_DATABASE[resolvedKey]?.find(a => a.id === articleId);
      if (article) {
        renderInsightArticlePage(resolvedKey, article);
        return;
      }
      renderInsightCategoryPage(resolvedKey);
      return;
    }
    const articles = INSIGHTS_DATABASE[resolvedKey];
    if (articles && articles.length > 0) {
      if (resolvedKey === 'latest-news' || resolvedKey === 'market-analysis') {
        renderInsightCategoryPage(resolvedKey);
        return;
      }
      renderInsightArticlePage(resolvedKey, articles[0]);
      return;
    }
    const STANDALONE_SLUG_MAP = {'where-electricity-comes-from':'where-does-electricity-come-from','ev-cost-and-savings':'ev-cost-savings'};
    const slug = STANDALONE_SLUG_MAP[categoryKey] || categoryKey;
    window.location.href = '/insights/' + slug + '.html';
    return;
  } else if (route.startsWith('/ev/')) {
    const slug = route.substring(4);
    const car = EV_DATABASE.find(c => c.id === slug);
    if (car) {
      renderCarDetailsPage(car);
      return;
    }
  } else if (route === '/search') {
    renderSearchResultsPage();
    return;
  } else if (route.startsWith('/resources/')) {
    const slug = route.substring(11);
    const article = RESOURCES_DATABASE[slug];
    if (article) {
      renderResourcePage(slug, article);
      return;
    }
  } else if (route.startsWith('/learn/')) {
    const slug = route.substring(7);
    const resolvedSlug = LEARN_SLUG_ALIASES[slug] || slug;
    const article = LEARN_DATABASE[resolvedSlug];
    if (article) {
      renderLearnArticlePage(resolvedSlug, article);
      return;
    }
  } else if (route.startsWith('/blog/')) {
    const slug = route.substring(6);
    const article = BLOG_DATABASE.find(b => b.slug === slug || b.id === slug);
    if (article) {
      renderBlogArticlePage(article);
      return;
    }
  } else if (route === '/login') {
    renderLoginPage();
    return;
  } else if (route === '/signup') {
    renderSignupPage();
    return;
  } else if (route === '/forgot-password') {
    renderForgotPasswordPage();
    return;
  } else if (route === '/about' || route.startsWith('/about/') ||
             route === '/contact' || route.startsWith('/contact') ||
             route === '/feedback' || route === '/help' || route === '/faqs' ||
             route === '/privacy-policy' || route === '/terms-and-conditions' ||
             route === '/disclaimer' || route === '/cookie-policy' || route === '/copyright') {
    const pageKey = route.replace(/^\//, '');
    const page = ABOUT_DATABASE[pageKey];
    if (page) {
      renderStaticPage(pageKey, page);
      return;
    }
  }
  
  restoreHomepage();
}

function restoreHomepage() {
  if (homepageContent) homepageContent.classList.remove('hidden');
  if (detailsPageContent) detailsPageContent.classList.add('hidden');
  
  // Clear hash if we are on the main landing page and it contains car details route
  const hash = window.location.hash;
  if (hash.includes('/cars/') || hash.includes('/view-all/') || hash.includes('/news/') || hash.includes('/guide/') || hash.includes('/reviews/') || hash.includes('/brand/') || hash.includes('/brands/') || hash.includes('/insights/') || hash.includes('/learn/') || hash.includes('/blog/') || hash.includes('/ev/') || hash.includes('/resources/') || hash === '#/login' || hash === '#/signup' || hash === '#/forgot-password') {
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
  initUserSession();
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
  
  const btnViewAllBrands = document.getElementById('btn-view-all-brands');
  if (btnViewAllBrands) {
    btnViewAllBrands.addEventListener('click', () => navigateTo('/view-all/brands'));
  }

  document.querySelectorAll('a[href="all-cars.html"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      navigateTo('/view-all/all');
    });
  });
  
  const btnViewAllNews = document.getElementById('btn-view-all-news');
  if (btnViewAllNews) {
    btnViewAllNews.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/news');
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
  if (typeof initEducationalModals === 'function') initEducationalModals();
  if (typeof initRevealObservers === 'function') initRevealObservers();
  
  // Instant search listeners removed — search now navigates to /search page
  
  // Initialize automatic word-highlighting observer for "Electric"
  if (typeof initElectricHighlightObserver === 'function') initElectricHighlightObserver();

  // Global click interceptor for SPA path-based links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href && href.startsWith('/') && !href.startsWith('//') && !href.includes('.html')) {
      e.preventDefault();
      closeMegaPanels();
      closeMobileDrawer();
      activeRecentlyViewed = false;
      navigateTo(href);
    }
  });
});

async function renderNewsAndGuides() {
  const newsContainer = document.getElementById('news-grid-container');
  if (newsContainer) {
    newsContainer.innerHTML = '<div class="col-span-full text-center py-8 text-zinc-400 font-mono text-xs">Loading news...</div>';
    let articles = await loadNews();
    if (!articles || articles.length === 0) {
      articles = NEWS_DATABASE;
    }
    newsContainer.innerHTML = '';
    articles.slice(0, 3).forEach((article, index) => {
      const id = article.id || 'news-api-' + index;
      const topic = (article.category || article.topic || '').toUpperCase();
      const date = formatNewsDate(article.published || article.date || '');
      const title = article.title || '';
      const summary = article.description || article.summary || '';
      const externalUrl = article.url || '';
      newsContainer.innerHTML +=
        '<div class="border border-zinc-200 bg-white p-6 flex flex-col group hover:border-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] stagger-card news-card rounded-xl">' +
          '<div class="flex flex-col flex-1">' +
            '<div class="aspect-[16/9] bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 overflow-hidden rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">' +
              getNewsImageHtml(article.image || '', title, index) +
            '</div>' +
            '<div class="flex justify-between items-center text-[8px] text-zinc-400 font-mono mb-2.5">' +
              '<span class="bg-zinc-100 px-2 py-0.5 rounded">' + topic + '</span>' +
              '<span>' + date.toUpperCase() + '</span>' +
            '</div>' +
            '<h3 class="text-[15px] font-bold leading-snug text-zinc-800 group-hover:text-black transition-colors mb-2 line-clamp-2">' + title + '</h3>' +
            '<p class="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 flex-1">' + summary + '</p>' +
          '</div>' +
          '<button class="font-mono text-[10px] tracking-wider text-zinc-400 hover:text-black transition-colors self-end mt-4 btn-read-news-more" data-id="' + id + '" data-url="' + externalUrl + '">Read More <span class="inline-block transition-transform group-hover:translate-x-0.5">\u2192</span></button>' +
        '</div>';
    });
    
    document.querySelectorAll('.btn-read-news-more').forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.getAttribute('data-url');
        if (url) {
          window.open(url, '_blank', 'noopener');
        } else {
          const id = btn.getAttribute('data-id');
          const mappedId = id === 'news-1' ? 'in-news-1' : id === 'news-2' ? 'in-news-2' : 'in-news-3';
          navigateTo(`/insights/latest-news/${mappedId}`);
        }
      });
    });
  }
  
  const guideContainer = document.getElementById('guide-grid-container');
  if (guideContainer) {
    guideContainer.innerHTML = '';
    GUIDE_DATABASE.forEach(chapter => {
      guideContainer.innerHTML +=
        '<div class="border border-zinc-200 p-6 flex flex-col justify-between h-[240px] group hover:border-black transition-all bg-zinc-50 shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] stagger-card guide-card">' +
          '<div>' +
            '<span class="font-mono text-[9px] text-zinc-500">' + chapter.chapter.toUpperCase() + '</span>' +
            '<h3 class="text-base font-bold mt-1 mb-2">' + chapter.title + '</h3>' +
            '<p class="text-[11px] text-zinc-655 leading-normal">' + chapter.summary + '</p>' +
          '</div>' +
          '<a href="#/guide/' + chapter.id + '" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-widest self-start">Learn More <span class="arrow">\u2192</span></a>' +
        '</div>';
    });
  }
}

function renderViewAllPage(section) {
  const sectionNames = {
    popular: 'Popular Electric Cars',
    launches: 'Latest EV Launches',
    upcoming: 'Upcoming Electric Cars',
    all: 'All Electric Cars'
  };
  const title = sectionNames[section] || 'Electric Cars';
  const breadcrumbs = ['MARKETPLACE', title];
  
  let sectionCars;
  if (section === 'all') {
    sectionCars = EV_DATABASE;
  } else {
    sectionCars = EV_DATABASE.filter(car => {
      if (!car.sections) return false;
      if (section === 'launches') {
        return car.sections.includes('launches') || car.sections.includes('latest');
      }
      return car.sections.includes(section);
    });
  }
  let cardsHtml = '';
  sectionCars.forEach(car => {
    cardsHtml += createCarCardHtml(car, 'w-full');
  });
  
  const allBodyTypes = ['All','SUV','Sedan','Hatchback','MUV','Coupe','Convertible','Pickup','Luxury'];
  let bodyFilterOpts = allBodyTypes.map(t => `<option value="${t}">${t}</option>`).join('');
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 revealed">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">GRID INDEX / ${sectionCars.length} VEHICLES</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">${title}</h2>
        </div>
        <div class="flex flex-col gap-1 text-left sm:text-right">
          <label for="viewall-body-filter" class="font-mono text-[9px] text-black uppercase tracking-widest">Body Type</label>
          <select id="viewall-body-filter" class="border border-zinc-200 text-xs p-2 text-zinc-800 outline-none focus:border-black transition-all rounded-none cursor-pointer bg-white min-w-[140px]">
            ${bodyFilterOpts}
          </select>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4" id="viewall-cars-grid">
        ${cardsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  attachCardEvents();
  setTimeout(function() {
    var filterEl = document.getElementById('viewall-body-filter');
    if (filterEl) {
      filterEl.addEventListener('change', function() {
        var val = this.value;
        var grid = document.getElementById('viewall-cars-grid');
        if (!grid) return;
        var filtered = val === 'All' ? sectionCars : sectionCars.filter(function(c) { return BODY_TYPE_MAP[c.id] === val; });
        grid.innerHTML = '';
        filtered.forEach(function(car) {
          grid.innerHTML += createCarCardHtml(car, 'w-full');
        });
        attachCardEvents();
      });
    }
  }, 50);
}

function renderSearchResultsPage() {
  const params = new URLSearchParams(window.location.search);
  const searchName = (params.get('name') || '').toLowerCase().trim();
  const searchBrand = params.get('brand') || 'all';
  const searchBudget = params.get('budget') || 'all';
  const searchBody = params.get('body') || 'all';

  let results = [...EV_DATABASE];

  if (searchName) {
    results = results.filter(car => {
      const n = searchName;
      const matchesName = car.name.toLowerCase().includes(n);
      const matchesBrand = car.brand.toLowerCase().includes(n);
      const numVal = parseFloat(n);
      const matchesBudget = !isNaN(numVal) && car.priceVal <= numVal;
      const matchesRange = !isNaN(numVal) && car.rangeVal >= numVal;
      return matchesName || matchesBrand || matchesBudget || matchesRange;
    });
  }
  if (searchBrand !== 'all') {
    results = results.filter(car => car.brand.toLowerCase() === searchBrand.toLowerCase());
  }
  if (searchBudget !== 'all') {
    results = results.filter(car => {
      if (searchBudget === '20') return car.priceVal < 20;
      if (searchBudget === '50') return car.priceVal >= 20 && car.priceVal <= 50;
      if (searchBudget === 'above') return car.priceVal > 50;
      return true;
    });
  }
  if (searchBody !== 'all') {
    results = results.filter(car => BODY_TYPE_MAP[car.id] === searchBody);
  }

  let sortBy = params.get('sort') || 'price-asc';
  results.sort((a, b) => {
    if (sortBy === 'price-desc') return (b.priceVal || 0) - (a.priceVal || 0);
    if (sortBy === 'range-desc') return (b.rangeVal || 0) - (a.rangeVal || 0);
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    return (a.priceVal || 0) - (b.priceVal || 0);
  });

  const totalCount = results.length;
  const pageSize = 12;
  let currentPage = parseInt(params.get('page') || '1', 10);
  if (currentPage < 1) currentPage = 1;
  const totalPages = Math.ceil(totalCount / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const startIdx = (currentPage - 1) * pageSize;
  const pageCars = results.slice(startIdx, startIdx + pageSize);

  const breadcrumbs = ['SEARCH'];

  function getLabel(val, type) {
    if (type === 'brand') {
      const map = { tata:'Tata', mahindra:'Mahindra', hyundai:'Hyundai', mg:'MG', kia:'Kia', byd:'BYD', bmw:'BMW', 'mercedes-benz':'Mercedes-Benz', volvo:'Volvo', audi:'Audi', 'maruti-suzuki':'Maruti Suzuki', toyota:'Toyota', honda:'Honda', skoda:'Skoda', volkswagen:'Volkswagen', renault:'Renault', nissan:'Nissan', citroen:'Citroën', jeep:'Jeep', 'force-motors':'Force Motors', isuzu:'Isuzu', porsche:'Porsche', vinfast:'VinFast', tesla:'Tesla', lexus:'Lexus' };
      return map[val] || val;
    }
    if (type === 'budget') {
      if (val === '20') return 'Under ₹20 Lakhs';
      if (val === '50') return '₹20–50 Lakhs';
      if (val === 'above') return 'Above ₹50 Lakhs';
    }
    return val;
  }

  let filterChipsHtml = '';
  if (searchName) filterChipsHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 border border-zinc-200 font-mono text-[9px] text-zinc-600 rounded-full">NAME: ${searchName.toUpperCase()}</span>`;
  if (searchBrand !== 'all') filterChipsHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 border border-zinc-200 font-mono text-[9px] text-zinc-600 rounded-full">BRAND: ${getLabel(searchBrand, 'brand').toUpperCase()}</span>`;
  if (searchBudget !== 'all') filterChipsHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 border border-zinc-200 font-mono text-[9px] text-zinc-600 rounded-full">BUDGET: ${getLabel(searchBudget, 'budget').toUpperCase()}</span>`;
  if (searchBody !== 'all') filterChipsHtml += `<span class="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-100 border border-zinc-200 font-mono text-[9px] text-zinc-600 rounded-full">BODY: ${searchBody.toUpperCase()}</span>`;

  function buildUrl(overrides) {
    const p = new URLSearchParams();
    if (searchName) p.set('name', searchName);
    if (searchBrand !== 'all') p.set('brand', searchBrand);
    if (searchBudget !== 'all') p.set('budget', searchBudget);
    if (searchBody !== 'all') p.set('body', searchBody);
    if (sortBy !== 'price-asc') p.set('sort', sortBy);
    if (overrides) {
      if (overrides.page) { if (overrides.page > 1) p.set('page', overrides.page); else p.delete('page'); }
      if (overrides.sort) { p.set('sort', overrides.sort); p.delete('page'); }
    }
    const qs = p.toString();
    return '/search' + (qs ? '?' + qs : '');
  }

  let cardsHtml = '';
  pageCars.forEach(car => {
    cardsHtml += createCarCardHtml(car, 'w-full');
  });

  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 revealed">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SEARCH / ${totalCount} ${totalCount === 1 ? 'RESULT' : 'RESULTS'}</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Search Results</h2>
          ${filterChipsHtml ? `<div class="flex flex-wrap gap-2 mt-3">${filterChipsHtml}</div>` : ''}
        </div>
        <div class="flex items-center gap-3 font-mono text-[10px]">
          <label for="search-sort-select" class="text-zinc-500 uppercase tracking-wider">Sort</label>
          <select id="search-sort-select" class="border border-zinc-200 text-xs px-3 py-2 outline-none focus:border-black transition-colors rounded-lg cursor-pointer bg-white">
            <option value="price-asc" ${sortBy === 'price-asc' ? 'selected' : ''}>Price: Low to High</option>
            <option value="price-desc" ${sortBy === 'price-desc' ? 'selected' : ''}>Price: High to Low</option>
            <option value="range-desc" ${sortBy === 'range-desc' ? 'selected' : ''}>Range: High to Low</option>
            <option value="name-asc" ${sortBy === 'name-asc' ? 'selected' : ''}>Name: A-Z</option>
          </select>
        </div>
      </div>

      <div id="search-cars-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
        ${totalCount > 0 ? cardsHtml : `
        <div class="col-span-full py-20 text-center flex flex-col items-center gap-3">
          <span class="text-3xl text-zinc-200 font-mono font-bold">:(</span>
          <p class="font-mono text-xs text-zinc-400 max-w-md">No electric vehicles match your search criteria. Try adjusting the filters or search term.</p>
        </div>
        `}
      </div>

      ${totalPages > 1 ? `
      <div class="flex justify-center items-center gap-4 mt-6 font-mono text-[10px]">
        ${currentPage > 1 ? `<a href="${buildUrl({ page: currentPage - 1 })}" class="px-4 py-2 border border-zinc-200 hover:border-black rounded transition-all">← PREV</a>` : '<span class="px-4 py-2 border border-zinc-100 text-zinc-300 rounded cursor-default">← PREV</span>'}
        <span class="text-zinc-500">PAGE ${currentPage} OF ${totalPages}</span>
        ${currentPage < totalPages ? `<a href="${buildUrl({ page: currentPage + 1 })}" class="px-4 py-2 border border-zinc-200 hover:border-black rounded transition-all">NEXT →</a>` : '<span class="px-4 py-2 border border-zinc-100 text-zinc-300 rounded cursor-default">NEXT →</span>'}
      </div>
      ` : ''}
    </div>
  `;

  renderSubpage('Search Results', breadcrumbs, contentHtml, '/');

  const sortEl = document.getElementById('search-sort-select');
  if (sortEl) {
    sortEl.addEventListener('change', (e) => {
      sortBy = e.target.value;
      navigateTo(buildUrl({ sort: sortBy }));
    });
  }

  attachCardEvents();
  const grid = document.getElementById('search-cars-grid');
  if (grid) grid.classList.add('revealed');
}

function renderViewAllBrandsPage() {
  const title = 'EV Brand Dictionary';
  const breadcrumbs = ['MANUFACTURERS', 'ALL BRANDS'];
  
  const brandNameMap = {
    'tata': 'Tata', 'mahindra': 'Mahindra', 'hyundai': 'Hyundai', 'mg': 'MG',
    'kia': 'Kia', 'byd': 'BYD', 'bmw': 'BMW', 'mercedes-benz': 'Mercedes-Benz',
    'volvo': 'Volvo', 'audi': 'Audi', 'maruti-suzuki': 'Maruti Suzuki',
    'toyota': 'Toyota', 'honda': 'Honda', 'skoda': 'Skoda',
    'volkswagen': 'Volkswagen', 'renault': 'Renault', 'nissan': 'Nissan',
    'citroen': 'Citroën', 'jeep': 'Jeep', 'isuzu': 'Isuzu', 
    'porsche': 'Porsche', 'vinfast': 'VinFast','tesla': 'Tesla'
    ,'lexus': 'Lexus','ferrari': 'Ferrari','genesis': 'Genesis',
    'lotus': 'Lotus','mini': 'MINI','pmv': 'PMV','pravaig': 'Pravaig', 
    'vayve': 'Vayve','blinq': 'Blinq','strom': 'Strom'
  };
  
  let brandsHtml = '';
  Object.keys(brandNameMap).forEach(brandId => {
    const brandName = brandNameMap[brandId];
    const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
    const brandCounts = {
   tata: 9,
   mahindra: 11,
   hyundai: 4,
   mg: 7,
   kia: 4,
   byd: 5,
   bmw: 5,
   toyota: 2,
   "mercedes-benz": 7,
   volvo: 4,
   audi: 3,
   "maruti-suzuki": 3,
   toyota: 2,
   honda: 3,
   skoda: 2,
   volkswagen: 1,
   renault: 2,
   nissan: 2,
   citroen: 1,
   jeep: 1,
   isuzu: 1,
   porsche: 3,
   vinfast: 4,
   tesla: 1,
   lexus: 1,
   ferrari: 1,
   genesis: 1,
   lotus: 2,
   mini: 2,
   pmv: 1,
   pravaig: 1,
   "rolls-royce": 1,
   vayve: 1,
   blinq: 1,
   strom: 1,
 };

const count = brandCounts[brandId] ?? 0;
    const logoUrl = getBrandLogoUrl(brandId);
    console.log(brandId, logoUrl);
    const initials = getBrandInitials(brandName);
    brandsHtml += `
      <a href="/brand/${brandId}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white hover:shadow-[0_8px_30px_rgba(34,197,94,0.12)] hover:-translate-y-1 transition-all p-3 flex flex-col items-center gap-2 group rounded-xl text-center" style="border-radius:18px">
<img
    src="${logoUrl}"
    alt="${brandName}"
    class="w-14 h-14 object-contain mx-auto"
/>
        <div>
          <span class="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 group-hover:text-black block">${brandName}</span>
          <span class="font-mono text-[9px] text-zinc-500">${count} ${count === 1 ? 'EV' : 'EVs'}</span>
        </div>
      </a>
    `;
  });
  
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">BRAND INDEX / ${Object.keys(brandNameMap).length} MANUFACTURERS</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">EV Brand Dictionary</h2>
        <p class="text-xs text-zinc-500 font-mono mt-1">Browse all electric vehicle manufacturers and explore their lineups.</p>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-2">
        ${brandsHtml}
      </div>
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderAllNewsPage() {
  const title = 'Latest EV News';
  const breadcrumbs = ['RESOURCES', 'LATEST NEWS'];
  
  let articles = (newsCache && newsCache.length > 0) ? newsCache : NEWS_DATABASE;
  let newsHtml = '';
  articles.forEach((article, index) => {
    const id = article.id || 'news-api-' + index;
    const topic = (article.category || article.topic || '').toUpperCase();
    const date = formatNewsDate(article.published || article.date || '');
    const summary = article.description || article.summary || '';
    const externalUrl = article.url || '';
    newsHtml +=
      '<div class="border border-zinc-200 bg-white p-6 flex flex-col group hover:border-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] news-card rounded-xl">' +
        '<div class="flex flex-col flex-1">' +
          '<div class="aspect-[16/9] bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 overflow-hidden rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">' +
            getNewsImageHtml(article.image || '', article.title, index) +
          '</div>' +
          '<div class="flex justify-between items-center text-[8px] text-zinc-400 font-mono mb-2.5">' +
            '<span class="bg-zinc-100 px-2 py-0.5 rounded">' + topic + '</span>' +
            '<span>' + date.toUpperCase() + '</span>' +
          '</div>' +
          '<h3 class="text-[15px] font-bold leading-snug text-zinc-800 group-hover:text-black transition-colors mb-2 line-clamp-2">' + article.title + '</h3>' +
          '<p class="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 flex-1">' + summary + '</p>' +
        '</div>' +
        '<button class="font-mono text-[10px] tracking-wider text-zinc-400 hover:text-black transition-colors self-end mt-4 btn-read-news-more" data-id="' + id + '" data-url="' + externalUrl + '">Read More <span class="inline-block transition-transform group-hover:translate-x-0.5">\u2192</span></button>' +
      '</div>';
    });

  const contentHtml =
    '<div class="flex flex-col gap-6 pt-6">' +
      '<div>' +
        '<span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">JOURNAL INDEX / ' + articles.length + ' DISPATCHES</span>' +
        '<h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Latest EV News Dispatches</h2>' +
      '</div>' +
      '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">' +
        newsHtml +
      '</div>' +
    '</div>';
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  
  document.querySelectorAll('.btn-read-news-more').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener');
      } else {
        const id = btn.getAttribute('data-id');
        navigateTo(`/news/${id}`);
      }
    });
  });
}

function renderNewsArticlePage(article) {
  const title = article.title;
  const breadcrumbs = ['RESOURCES', 'LATEST NEWS', 'ARTICLE'];
  
  const isApiArticle = !!article.url && !article.content;
  
  let contentHtml;
  if (isApiArticle) {
    const category = (article.category || '').toUpperCase();
    const date = formatNewsDate(article.published || '');
    const imageUrl = article.image || '';
    const imageHtml = imageUrl
      ? `<img src="${imageUrl}" alt="${article.title}" class="w-full h-full object-cover" />`
      : `IMAGE_PLACEHOLDER`;
    contentHtml = `
      <div class="max-w-3xl mx-auto flex flex-col gap-6 pt-6 font-mono text-zinc-800">
        <div class="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-widest border-b border-zinc-100 pb-2">
          <span>${category}</span>
          <span>${date.toUpperCase()}</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black text-black leading-tight">${article.title}</h1>
        <div class="h-64 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 text-xs select-none overflow-hidden">
          ${imageHtml}
        </div>
        <p class="text-sm leading-relaxed text-zinc-700 font-semibold border-l-2 border-black pl-4 my-2">${article.description || ''}</p>
        <div class="border-t border-zinc-100 pt-4 mt-2 flex justify-center">
          <a href="${article.url}" target="_blank" rel="noopener" class="inline-block border border-black text-black px-8 py-3 text-xs font-mono tracking-widest uppercase hover:bg-black hover:text-white transition-all">Read Full Article &#8599;</a>
        </div>
      </div>
    `;
  } else {
    contentHtml = `
      <div class="max-w-3xl mx-auto flex flex-col gap-6 pt-6 font-mono text-zinc-800">
        <div class="flex justify-between items-center text-[9px] text-zinc-500 uppercase tracking-widest border-b border-zinc-100 pb-2">
          <span>${article.topic}</span>
          <span>${article.date}</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black text-black leading-tight">${article.title}</h1>
        <div class="h-64 bg-zinc-50 border border-zinc-200 flex items-center justify-center text-zinc-400 text-xs select-none">
          IMAGE_PLACEHOLDER // ${article.id ? article.id.toUpperCase() : ''}
        </div>
        <p class="text-sm leading-relaxed text-zinc-700 font-semibold border-l-2 border-black pl-4 my-2">${article.summary}</p>
        <p class="text-sm leading-relaxed text-black mt-4">${article.content}</p>
      </div>
    `;
  }
  
  renderSubpage(title, breadcrumbs, contentHtml, '/news/all');
}

function renderNewsPage() {
  var allArticles = (newsCache && newsCache.length > 0) ? newsCache : NEWS_DATABASE;
  var currentPage = 1;
  var perPage = 9;
  var searchTerm = '';
  var activeFilter = 'all';

  function getFilteredArticles() {
    var list = allArticles.filter(function(a) {
      if (activeFilter !== 'all' && a.category !== activeFilter) return false;
      if (searchTerm) {
        var q = searchTerm.toLowerCase();
        var t = (a.title || '').toLowerCase();
        var d = (a.description || '').toLowerCase();
        if (t.indexOf(q) === -1 && d.indexOf(q) === -1) return false;
      }
      return true;
    });
    return list;
  }

  function render() {
    var filtered = getFilteredArticles();
    var totalPages = Math.ceil(filtered.length / perPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    var start = (currentPage - 1) * perPage;
    var pageItems = filtered.slice(start, start + perPage);

    var cardsHtml = '';
    pageItems.forEach(function(article, idx) {
      var topic = (article.category || '').toUpperCase();
      var date = formatNewsDate(article.published || '');
      var id = 'news-page-' + start + '-' + idx;
      cardsHtml +=
        '<div class="border border-zinc-200 bg-white p-6 flex flex-col group hover:border-black hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] news-card rounded-xl">' +
          '<div class="flex flex-col flex-1">' +
            '<div class="aspect-[16/9] bg-zinc-50 border border-zinc-100 flex items-center justify-center mb-4 overflow-hidden rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">' +
              getNewsImageHtml(article.image || '', article.title, start + idx) +
            '</div>' +
            '<div class="flex justify-between items-center text-[8px] text-zinc-400 font-mono mb-2.5">' +
              '<span class="bg-zinc-100 px-2 py-0.5 rounded">' + topic + '</span>' +
              '<span>' + (date ? date.toUpperCase() : '') + '</span>' +
            '</div>' +
            '<h3 class="text-[15px] font-bold leading-snug text-zinc-800 group-hover:text-black transition-colors mb-2 line-clamp-2">' + (article.title || '') + '</h3>' +
            '<p class="text-[11px] text-zinc-500 leading-relaxed line-clamp-3 flex-1">' + (article.description || '') + '</p>' +
          '</div>' +
          '<button class="font-mono text-[10px] tracking-wider text-zinc-400 hover:text-black transition-colors self-end mt-4 btn-news-page-open" data-url="' + (article.url || '') + '">Read More <span class="inline-block transition-transform group-hover:translate-x-0.5">\u2192</span></button>' +
        '</div>';
    });

    if (!cardsHtml) {
      cardsHtml = '<div class="col-span-full text-center py-20"><p class="text-zinc-400 font-mono text-xs">No articles match your criteria.</p></div>';
    }

    var filterOptions = ['all', 'infrastructure', 'buying', 'latest'];
    var filterLabels = { all: 'All', infrastructure: 'Infrastructure', buying: 'Buying & Launches', latest: 'Latest' };
    var filterBtnsHtml = '';
    filterOptions.forEach(function(f) {
      var activeClass = f === activeFilter ? 'bg-black text-white border-black' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400';
      filterBtnsHtml += '<button class="px-4 py-2 text-[10px] font-mono tracking-wider uppercase border transition-all ' + activeClass + ' btn-news-filter" data-filter="' + f + '">' + filterLabels[f] + '</button>';
    });

    var paginationHtml = '';
    if (totalPages > 1) {
      paginationHtml += '<div class="flex items-center justify-center gap-3 mt-10 font-mono text-xs">';
      paginationHtml += '<button class="px-4 py-2 border border-zinc-200 text-zinc-500 hover:border-black hover:text-black transition-all btn-news-page-prev" ' + (currentPage <= 1 ? 'disabled style="opacity:0.3;cursor:default;"' : '') + '>Previous</button>';
      for (var p = 1; p <= totalPages; p++) {
        var activeP = p === currentPage ? 'bg-black text-white border-black' : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-400';
        paginationHtml += '<button class="px-3 py-1.5 border transition-all ' + activeP + ' btn-news-page-num" data-page="' + p + '">' + p + '</button>';
      }
      paginationHtml += '<button class="px-4 py-2 border border-zinc-200 text-zinc-500 hover:border-black hover:text-black transition-all btn-news-page-next" ' + (currentPage >= totalPages ? 'disabled style="opacity:0.3;cursor:default;"' : '') + '>Next</button>';
      paginationHtml += '</div>';
    }

    var contentHtml =
      '<div class="flex flex-col gap-6 pt-6">' +
        '<div class="flex flex-col md:flex-row md:items-end justify-between gap-4">' +
          '<div>' +
            '<span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">JOURNAL / ' + filtered.length + ' ARTICLES</span>' +
            '<h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">Latest EV News</h2>' +
          '</div>' +
          '<div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">' +
            '<div class="flex flex-wrap gap-1.5">' + filterBtnsHtml + '</div>' +
            '<input type="text" placeholder="Search news by title\u2026" class="border border-zinc-200 text-xs p-2 text-zinc-800 outline-none focus:border-black transition-all rounded-none bg-white min-w-[180px] font-mono" id="news-search-input" value="' + searchTerm + '" />' +
          '</div>' +
        '</div>' +
        '<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2" id="news-page-grid">' +
          cardsHtml +
        '</div>' +
        paginationHtml +
      '</div>';

    renderSubpage('Latest EV News', ['RESOURCES', 'LATEST NEWS'], contentHtml, '/');

    document.querySelectorAll('.btn-news-filter').forEach(function(btn) {
      btn.addEventListener('click', function() {
        activeFilter = this.getAttribute('data-filter');
        currentPage = 1;
        render();
      });
    });

    var searchInput = document.getElementById('news-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        searchTerm = this.value;
        currentPage = 1;
        render();
      });
    }

    document.querySelectorAll('.btn-news-page-open').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var url = this.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      });
    });

    document.querySelectorAll('.btn-news-page-num').forEach(function(btn) {
      btn.addEventListener('click', function() {
        currentPage = parseInt(this.getAttribute('data-page'), 10);
        render();
      });
    });

    var prevBtn = document.querySelector('.btn-news-page-prev');
    if (prevBtn && !prevBtn.hasAttribute('disabled')) {
      prevBtn.addEventListener('click', function() {
        if (currentPage > 1) { currentPage--; render(); }
      });
    }

    var nextBtn = document.querySelector('.btn-news-page-next');
    if (nextBtn && !nextBtn.hasAttribute('disabled')) {
      nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) { currentPage++; render(); }
      });
    }
  }

  render();
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
    'apartment-charging': {
      features: [
        'RWA NOC Process: Formal application to society management with safety documentation and layout plans.',
        'Dedicated Meter Installation: Separate electricity meter for the charger ensures accurate billing.',
        'Weatherproof Enclosure: Outdoor-rated charging unit with IP55+ protection for parking area installation.',
        'Load Assessment: Professional electrical audit to determine if your existing sanction load can support a 7.2 kW charger.',
        'Smart Charger Compatibility: Wi-Fi enabled chargers with scheduling, usage tracking, and remote monitoring via mobile app.'
      ],
      benefits: [
        'Convenient overnight charging at home eliminates dependency on public charging infrastructure.',
        'Substantial cost savings — home charging at ₹6-9/kWh costs 85% less than petrol per kilometre.',
        'Increases property value — homes with EV charging capability command higher resale value.',
        'Shared charger models reduce per-unit installation costs in multi-parking layouts.',
        'Government subsidies and tax benefits available for home EV charger installations.'
      ],
      faqs: [
        { q: 'Can my RWA deny permission for EV charger installation?', a: 'Under the Electricity Act 2003 and relevant state regulations, RWAs cannot unreasonably refuse. They must respond within 15 days and can only deny on valid technical safety grounds.' },
        { q: 'How much does it cost to install a home EV charger?', a: 'A standard 7.2 kW AC wallbox installation costs ₹15,000-40,000 including the charger unit, MCB, cabling, and labour. Many manufacturers offer free installation with new EV purchases.' },
        { q: 'Do I need to upgrade my electricity meter?', a: 'Most homes with a 15-30A sanctioned load can support a 7.2 kW charger. If your load is below 15A, you may need to request a load increase from your electricity distribution company (₹2,000-5,000).' },
        { q: 'Can I share a charger with neighbours in my apartment?', a: 'Yes, shared charger models are becoming popular in apartment complexes. A single 7.2 kW unit can be split between 2-3 parking spots with scheduled access via a mobile app or RFID cards.' },
        { q: 'Is it safe to install a charger in an open parking area?', a: 'Yes, modern EV chargers are built with IP55+ weatherproof ratings, making them safe for outdoor installation. Ensure the unit is mounted on a sturdy pole or wall with proper cable management.' }
      ],
      extendedHtml: `<h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">What is Apartment EV Charging?</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">Apartment EV charging refers to the process of installing and operating electric vehicle charging stations within multi-owner residential complexes such as apartments, housing societies, and gated communities. Unlike standalone homes where the owner has full control over electrical infrastructure, apartment charging requires coordination with the Resident Welfare Association (RWA), building management, and often the local electricity distribution company.</p><div class="border-l-2 border-black pl-4 my-5 bg-zinc-50/50 py-3 pr-2 rounded-r-lg"><span class="text-zinc-500 font-bold uppercase text-[9px] tracking-wider block mb-1">💡 Key Insight</span><p class="text-xs leading-relaxed text-zinc-700 italic font-medium">Over 65% of urban Indian households live in apartments or gated communities. Accessible home charging is therefore one of the most critical factors for mass EV adoption in India.</p></div><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Why Charging in Apartments is Different</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">Charging an EV in an apartment building presents unique challenges that do not apply to independent homes:</p><ul class="space-y-2 text-xs font-mono mb-4"><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Shared Electrical Infrastructure:</strong> The building\'s main electrical panel and meter may not have spare capacity for additional high-power loads.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Common Parking Areas:</strong> Parking spots are often designated but not directly connected to individual flat meters, requiring sub-metering solutions.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>RWA Approvals:</strong> Any structural or electrical modification to common areas requires formal approval from the building\'s managing committee.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Cable Routing:</strong> Running wiring from individual meter boxes to basement or ground-floor parking spots often requires cable trays, conduits, or trenching.</span></li></ul><div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6"><div class="border border-zinc-200 rounded-xl p-5 bg-white shadow-sm"><span class="text-lg block mb-2">🏢</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">High-Rise Apartments</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Typically have basement parking with existing electrical infrastructure. Cable routing from upper floors to basement is the main challenge. Requires vertical cable trays or dedicated conduits.</p></div><div class="border border-zinc-200 rounded-xl p-5 bg-white shadow-sm"><span class="text-lg block mb-2">🏘️</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">Walk-Up Buildings</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Usually 3-5 storeys with open or ground-floor parking. Easier cable routing but may lack dedicated parking spots. Meter boxes are often on ground floor, simplifying connections.</p></div><div class="border border-zinc-200 rounded-xl p-5 bg-white shadow-sm"><span class="text-lg block mb-2">🌳</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">Gated Communities</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Large developments with individual villas/townhouses and common amenities. Each unit may have its own meter, making installation straightforward. RWA manages common area charger installations.</p></div><div class="border border-zinc-200 rounded-xl p-5 bg-white shadow-sm"><span class="text-lg block mb-2">🏗️</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">New Constructions</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Increasingly include EV charging readiness as a standard feature. Pre-wired conduits, dedicated meter slots, and charger-ready parking spots reduce installation complexity significantly.</p></div></div><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Society Approval & NOC Process</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">The Resident Welfare Association (RWA) or apartment managing committee is the first point of contact for EV charger installation. Under the Electricity Act 2003 and various state electricity regulatory commission guidelines, RWAs are required to facilitate EV charger installations and cannot unreasonably deny permission.</p><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5 my-5"><span class="font-bold text-[10px] uppercase tracking-wide block mb-3">📋 Step-by-Step NOC Process</span><ol class="space-y-2.5 text-xs font-mono"><li class="flex items-start gap-2.5"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">1</span><div><strong>Submit Formal Application:</strong> Write a letter to the RWA secretary requesting permission for EV charger installation at your designated parking spot. Include your vehicle details, proposed charger specifications, and installer credentials.</div></li><li class="flex items-start gap-2.5"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">2</span><div><strong>Provide Layout Plan:</strong> Attach a simple diagram showing the wiring route from your meter box to the parking spot, the charger mounting location, and planned safety measures.</div></li><li class="flex items-start gap-2.5"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">3</span><div><strong>Safety Documentation:</strong> Include the electrician\'s safety certificate, charger BIS certification, and a commitment to follow all electrical safety standards.</div></li><li class="flex items-start gap-2.5"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">4</span><div><strong>Metering Proposal:</strong> Confirm that the charger will have a dedicated sub-meter (or be connected to your existing flat meter) so electricity costs are billed to you, not the society.</div></li><li class="flex items-start gap-2.5"><span class="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0 mt-0.5">5</span><div><strong>Follow Up:</strong> The RWA must respond within 15 days as per most state regulations. If permission is not granted within this period, you may escalate to the local electricity regulatory commission.</div></li></ol></div><div class="border border-zinc-200 bg-emerald-50/40 rounded-xl p-5 my-6 border-l-4 border-l-emerald-500"><div class="flex items-start gap-3"><span class="text-lg flex-shrink-0 mt-0.5">✅</span><div><span class="font-bold text-xs uppercase tracking-wide block mb-1">Pro Tip: RWA Presentation</span><p class="text-[11px] text-zinc-600 leading-relaxed font-mono">Prepare a short presentation for your RWA meeting that covers safety features, installation timeline, and the legal framework supporting EV charger installation. Many RWAs are more receptive when they understand the regulations and safety standards involved.</p></div></div></div><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Private Charger Installation</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">Once RWA approval is secured, the actual installation process involves several technical steps. A standard 7.2 kW AC wallbox is the most common choice for apartment charging, offering a full charge in 4-6 hours overnight.</p><div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-5"><div class="border border-zinc-200 rounded-xl p-4 bg-white"><span class="text-lg block mb-2">🔌</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">Charger Unit</span><p class="text-[10px] text-zinc-600 font-mono leading-relaxed">7.2 kW AC wallbox with Type 2 socket, IP55 weatherproof rating, and smart features (Wi-Fi, scheduling, app control).</p></div><div class="border border-zinc-200 rounded-xl p-4 bg-white"><span class="text-lg block mb-2">⚡</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">Electrical Work</span><p class="text-[10px] text-zinc-600 font-mono leading-relaxed">Dedicated 40A MCB, 6 sq mm armoured cable from meter box to charger, proper earthing (earth resistance below 1 ohm).</p></div><div class="border border-zinc-200 rounded-xl p-4 bg-white"><span class="text-lg block mb-2">📡</span><span class="font-bold text-[10px] uppercase tracking-wide block mb-1">Smart Metering</span><p class="text-[10px] text-zinc-600 font-mono leading-relaxed">Individual sub-meter for accurate billing. Wi-Fi connectivity for remote monitoring, usage tracking, and charge scheduling.</p></div></div><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Shared Charging Solutions</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">For apartment complexes where multiple residents own EVs, shared charging solutions offer significant cost advantages. A single 7.2 kW or 22 kW charger can serve 2-4 parking spots through scheduled access or load-sharing technology.</p><ul class="space-y-2 text-xs font-mono mb-4"><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Load Sharing:</strong> Two chargers connected to a single circuit that intelligently splits available power between vehicles. When one car finishes charging, the other gets full power.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>RFID Access Control:</strong> Each resident gets an RFID tag that activates the charger and bills their individual account. Usage logs prevent disputes.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>App-Based Scheduling:</strong> Residents book charging slots through a mobile app. The system automatically releases the slot if the resident doesn\'t plug in within 30 minutes.</span></li></ul><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Cost Breakdown</h3><div class="overflow-x-auto my-5"><table class="w-full text-[10px] font-mono border-collapse"><thead><tr class="border-b border-zinc-200"><th class="text-left py-2 px-3 font-bold uppercase tracking-wider text-zinc-600">Item</th><th class="text-left py-2 px-3 font-bold uppercase tracking-wider text-zinc-600">Estimated Cost (₹)</th></tr></thead><tbody><tr class="border-b border-zinc-100"><td class="py-2 px-3 text-zinc-700">7.2 kW AC Wallbox Charger</td><td class="py-2 px-3 text-zinc-700">8,000 - 25,000</td></tr><tr class="border-b border-zinc-100"><td class="py-2 px-3 text-zinc-700">Electrical Cabling & MCB</td><td class="py-2 px-3 text-zinc-700">3,000 - 8,000</td></tr><tr class="border-b border-zinc-100"><td class="py-2 px-3 text-zinc-700">Installation Labour</td><td class="py-2 px-3 text-zinc-700">2,000 - 5,000</td></tr><tr class="border-b border-zinc-100"><td class="py-2 px-3 text-zinc-700">Sub-Meter Installation</td><td class="py-2 px-3 text-zinc-700">1,500 - 3,000</td></tr><tr class="border-b border-zinc-100"><td class="py-2 px-3 text-zinc-700">Load Increase (if needed)</td><td class="py-2 px-3 text-zinc-700">2,000 - 5,000</td></tr><tr class="bg-zinc-50"><td class="py-2 px-3 font-bold text-zinc-800">Total (Typical)</td><td class="py-2 px-3 font-bold text-zinc-800">₹15,000 - ₹40,000</td></tr></tbody></table></div><div class="border border-zinc-200 bg-amber-50/40 rounded-xl p-5 my-6 border-l-4 border-l-amber-500"><div class="flex items-start gap-3"><span class="text-lg flex-shrink-0 mt-0.5">⚠️</span><div><span class="font-bold text-xs uppercase tracking-wide block mb-1">Common Installation Mistakes</span><ul class="space-y-1 text-[11px] text-zinc-600 font-mono"><li>• Using undersized cabling — always use 6 sq mm minimum for 7.2 kW installations</li><li>• Skipping earth leakage protection — mandatory for outdoor EV charger installations</li><li>• Not checking load capacity — overloading the building\'s main panel can cause tripping</li><li>• Poor cable management — exposed cables are a tripping hazard and degrade in sunlight</li></ul></div></div></div><h3 class="text-base md:text-lg font-bold text-black mt-8 mb-3">Government Guidelines & Support</h3><p class="text-sm leading-relaxed text-zinc-700 font-mono mb-4">The Government of India has implemented several measures to facilitate apartment EV charging:</p><ul class="space-y-2 text-xs font-mono mb-4"><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Electricity Act 2003:</strong> RWAs and apartment management associations are obligated to facilitate EV charger installations and cannot deny permission without valid technical reasons.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>FAME III Subsidy:</strong> Central government provides subsidies for EV charging infrastructure, including home chargers in apartment complexes.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>State EV Policies:</strong> Many states offer additional incentives, including subsidized electricity tariffs for EV charging during off-peak hours and reduced connection charges.</span></li><li class="flex items-start gap-2.5"><span class="text-zinc-400 mt-0.5">•</span><span><strong>Bureau of Indian Standards:</strong> All EV chargers must comply with IS 17017 safety standards. Always verify BIS certification before purchasing a charger.</span></li></ul><div class="key-takeaways-card"><div class="key-takeaways-title">✅ Pre-Installation Checklist</div><ul class="key-takeaways-list space-y-2 text-xs font-mono"><li>✓ Confirm parking spot ownership or long-term allocation</li><li>✓ Check existing electrical sanction load (minimum 15A recommended)</li><li>✓ Submit formal RWA application with safety documentation</li><li>✓ Obtain written NOC from managing committee</li><li>✓ Engage a licensed electrician for site survey</li><li>✓ Choose BIS-certified charger with appropriate IP rating</li><li>✓ Plan cable routing path (minimise exposed wiring)</li><li>✓ Arrange for dedicated sub-meter installation</li><li>✓ Verify earth resistance (below 1 ohm)</li><li>✓ Test charger operation before closing installation</li></ul></div><div class="border border-zinc-200 bg-zinc-50 rounded-xl p-6 my-6"><div class="flex items-start gap-4"><span class="text-2xl flex-shrink-0">📋</span><div><span class="font-bold text-sm uppercase tracking-wide block mb-2">Conclusion</span><p class="text-xs text-zinc-600 leading-relaxed font-mono">Installing an EV charger in an apartment requires careful planning, proper approvals, and attention to electrical safety standards. However, with supportive government regulations, decreasing charger costs, and the immense convenience of home charging, the effort is well worth it. By following the guidelines outlined in this article — from NOC application to installation best practices — you can successfully set up reliable, safe, and cost-effective EV charging at your apartment.</p></div></div></div>`
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
      <div class="accordion-item border border-zinc-200 bg-white rounded-xl overflow-hidden">
        <button class="accordion-btn w-full text-left font-bold text-xs uppercase tracking-wider text-black font-mono flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">
          <span>${faq.q}</span>
          <span class="accordion-icon text-zinc-400 font-mono text-base">+</span>
        </button>
        <div class="accordion-content"><div class="px-4 pb-4"><div class="pt-3 border-t border-zinc-100"><p class="text-[11px] text-zinc-650 leading-relaxed font-mono">${faq.a}</p></div></div></div>
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
      ${details.extendedHtml || ''}
    </div>
  `;
  
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  if (typeof initAccordion === 'function') {
    setTimeout(initAccordion, 50);
  }
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
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
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

// --- INSIGHTS RENDERING FUNCTIONS ---
function renderInsightCategoryPage(categoryKey) {
  const catInfo = INSIGHTS_CATEGORIES.find(c => c.key === categoryKey) || { key: categoryKey, label: categoryKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), icon: '📄', desc: '' };
  const title = catInfo.label;
  const breadcrumbs = ['INSIGHTS', title];
  const articles = INSIGHTS_DATABASE[categoryKey] || [];

  let articlesHtml = '';
  articles.forEach(article => {
    if (categoryKey === 'latest-news' || categoryKey === 'market-analysis') {
      articlesHtml += `
        <a href="/insights/${categoryKey}/${article.id}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all p-6 flex flex-col gap-3 group rounded-xl" style="border-radius:18px">
          <div>
            <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 group-hover:text-black">${article.title}</h3>
            <p class="font-mono text-[9px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-3">${article.excerpt}</p>
            <span class="font-mono text-[8px] text-zinc-400 mt-2 block">${article.date} · By ${article.author} · ${article.readTime}</span>
          </div>
        </a>
      `;
    } else {
      const tagColor = article.tag === 'Policy' ? 'bg-blue-100 text-blue-800' :
                       article.tag === 'Tech' ? 'bg-purple-100 text-purple-800' :
                       article.tag === 'Market' || article.tag === 'Analysis' ? 'bg-amber-100 text-amber-800' :
                       article.tag === 'Infra' ? 'bg-teal-100 text-teal-800' :
                       article.tag === 'Launches' ? 'bg-emerald-100 text-emerald-800' :
                       article.tag === 'Guide' ? 'bg-indigo-100 text-indigo-800' :
                       article.tag === 'Charging' ? 'bg-cyan-100 text-cyan-800' :
                       article.tag === 'Expert' ? 'bg-rose-100 text-rose-800' :
                       article.tag === 'Comparison' ? 'bg-violet-100 text-violet-800' :
                       article.tag === 'Industry' ? 'bg-orange-100 text-orange-800' :
                       article.tag === 'Tax' ? 'bg-slate-100 text-slate-800' :
                       'bg-zinc-100 text-zinc-800';
      articlesHtml += `
        <a href="/insights/${categoryKey}/${article.id}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] transition-all p-6 flex flex-col gap-2 group rounded-lg">
          <div class="flex items-center gap-2 text-[8px] font-mono text-zinc-400 uppercase tracking-wider">
            <span class="${tagColor} px-2 py-0.5 rounded-full font-bold text-[7px]">${article.tag}</span>
            <span>${article.date}</span>
            <span>${article.readTime}</span>
          </div>
          <h3 class="font-bold text-sm text-black group-hover:underline underline-offset-2">${article.title}</h3>
          <p class="text-xs text-zinc-500 font-mono leading-relaxed">${article.excerpt}</p>
          <span class="font-mono text-[9px] text-zinc-400 mt-1">By ${article.author}</span>
        </a>
      `;
    }
  });

  if (!articlesHtml) {
    articlesHtml = `<div class="col-span-full py-16 text-center text-zinc-400 font-mono text-xs">NO ARTICLES FOUND IN THIS CATEGORY</div>`;
  }

  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div class="flex items-center justify-between">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">${catInfo.icon} INSIGHTS / ${catInfo.key.replace(/-/g, ' ').toUpperCase()}</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">${title}</h2>
          <p class="text-xs text-zinc-500 font-mono mt-1">${catInfo.desc}</p>
        </div>
        <a href="/insights" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-4 py-2 font-mono text-[9px] uppercase tracking-wider rounded-lg">All Categories</a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
        ${articlesHtml}
      </div>
    </div>
  `;

  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

function renderInsightArticlePage(categoryKey, article) {
  const catInfo = INSIGHTS_CATEGORIES.find(c => c.key === categoryKey);
  const breadcrumbs = ['INSIGHTS', catInfo ? catInfo.label : categoryKey, article.title];

  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 max-w-3xl mx-auto">
      <a href="/insights/${categoryKey}" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">← Back to ${catInfo ? catInfo.label : categoryKey}</a>
      <div>
        <div class="flex items-center gap-2 text-[8px] font-mono text-zinc-400 uppercase tracking-wider mb-3">
          <span class="text-zinc-700 font-bold text-[9px]">${article.tag}</span>
          <span>·</span>
          <span>${article.date}</span>
          <span>·</span>
          <span>${article.readTime}</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">${article.title}</h1>
        ${article.subtitle ? `<p class="text-sm text-zinc-500 font-mono mt-2">${article.subtitle}</p>` : ''}
        <div class="flex items-center gap-3 mt-4 border-t border-zinc-100 pt-4">
          <div class="w-8 h-8 bg-zinc-200 rounded-full flex items-center justify-center font-bold text-xs text-zinc-600">${article.author.split(' ').map(w => w[0]).join('')}</div>
          <div class="font-mono text-xs">
            <span class="font-bold text-black block">${article.author}</span>
            <span class="text-zinc-400 text-[9px]">${article.date} · ${article.readTime}</span>
          </div>
        </div>
      </div>
      <div class="prose-custom text-sm text-zinc-700 leading-relaxed font-mono">
        ${article.content}
      </div>
      <div class="border-t border-zinc-200 pt-6 mt-6">
        <a href="/insights/${categoryKey}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-5 py-3 font-mono text-[9px] uppercase tracking-wider rounded-lg inline-block">← Back to ${catInfo ? catInfo.label : categoryKey}</a>
      </div>
    </div>
  `;

  renderSubpage(article.title, breadcrumbs, contentHtml, `/insights/${categoryKey}`);
}

let blogsCache = null;
let blogsSearchQuery = '';

function renderAllBlogsPage() {
  const title = 'Blogs';
  const breadcrumbs = ['BLOGS'];
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest" id="blogs-count-label">INSIGHTS / LOADING...</span>
          <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">EV Blogs</h2>
          <p class="text-xs text-zinc-500 font-mono mt-1">In-depth articles, stories, and perspectives from the EV world.</p>
        </div>
        <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-64">
            <input type="text" id="blogs-search-input" placeholder="Search blogs..." class="w-full px-4 py-2 font-mono text-[10px] border border-zinc-200 focus:border-black outline-none transition-all rounded-lg" style="border-radius:20px" />
            <button id="btn-clear-blogs-search" class="hidden absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black font-mono text-[10px]">CLEAR</button>
          </div>
        </div>
      </div>

      <div id="blogs-grid" class="flex flex-col gap-4 mt-2">
        <div class="border border-zinc-200 bg-white p-5 rounded-xl skeleton-card flex flex-col gap-3">
          <div class="h-3 bg-zinc-100 rounded w-16 animate-pulse"></div>
          <div class="h-5 bg-zinc-100 rounded w-3/4 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-full animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-2/3 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-24 animate-pulse mt-1"></div>
        </div>
        <div class="border border-zinc-200 bg-white p-5 rounded-xl skeleton-card flex flex-col gap-3">
          <div class="h-3 bg-zinc-100 rounded w-16 animate-pulse"></div>
          <div class="h-5 bg-zinc-100 rounded w-3/4 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-full animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-2/3 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-24 animate-pulse mt-1"></div>
        </div>
        <div class="border border-zinc-200 bg-white p-5 rounded-xl skeleton-card flex flex-col gap-3">
          <div class="h-3 bg-zinc-100 rounded w-16 animate-pulse"></div>
          <div class="h-5 bg-zinc-100 rounded w-3/4 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-full animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-2/3 animate-pulse"></div>
          <div class="h-3 bg-zinc-100 rounded w-24 animate-pulse mt-1"></div>
        </div>
      </div>
    </div>
  `;
  renderSubpage(title, breadcrumbs, contentHtml, '/');
  loadBlogsData();
}

async function loadBlogsData() {
  const grid = document.getElementById('blogs-grid');
  const countLabel = document.getElementById('blogs-count-label');
  const searchInput = document.getElementById('blogs-search-input');
  const clearBtn = document.getElementById('btn-clear-blogs-search');

  if (!grid) { console.debug('[Blogs] grid element not found'); return; }
  console.debug('[Blogs] grid element found, loading data...');

  // Restore search query value to input if it exists
  if (searchInput) {
    searchInput.value = blogsSearchQuery;
    if (blogsSearchQuery) {
      if (clearBtn) clearBtn.classList.remove('hidden');
    }
  }

  try {
    if (!blogsCache) {
      console.debug('[Blogs] Fetching from /api/blogs...');
      const response = await fetch('/api/blogs');
      if (!response.ok) throw new Error('Failed to fetch blogs');
      const resData = await response.json();
      console.debug('[Blogs] API response:', { success: resData.success, count: resData.count, isArray: Array.isArray(resData.data) });
      if (resData.success && Array.isArray(resData.data)) {
        blogsCache = resData.data;
        console.debug('[Blogs] blogsCache populated with', blogsCache.length, 'blogs');
      } else {
        throw new Error(resData.error || 'Invalid data structure');
      }
    }

    displayBlogs();

  } catch (err) {
    console.error('[Blogs] Error loading blogs:', err);
    if (grid) {
      grid.innerHTML = `
        <div class="py-20 text-center flex flex-col items-center gap-4">
          <p class="font-mono text-xs text-red-500">Failed to load EV Blogs. Please check your connection.</p>
          <button id="btn-retry-blogs" class="px-5 py-2.5 border border-black font-mono text-[9px] uppercase tracking-widest hover:bg-black hover:text-white transition-all">Retry Loading</button>
        </div>
      `;
      const retryBtn = document.getElementById('btn-retry-blogs');
      if (retryBtn) {
        retryBtn.addEventListener('click', () => {
          blogsCache = null;
          renderAllBlogsPage();
        });
      }
    }
  }

  // Wire search events
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      blogsSearchQuery = e.target.value;
      if (clearBtn) {
        if (blogsSearchQuery) {
          clearBtn.classList.remove('hidden');
        } else {
          clearBtn.classList.add('hidden');
        }
      }
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        displayBlogs();
      }, 300);
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      blogsSearchQuery = '';
      if (searchInput) searchInput.value = '';
      clearBtn.classList.add('hidden');
      displayBlogs();
    });
  }

  function displayBlogs() {
    if (!blogsCache || !grid) {
      console.debug('[Blogs] displayBlogs skipped:', { blogsCache: !!blogsCache, grid: !!grid });
      return;
    }

    console.debug('[Blogs] displayBlogs running, blogsCache length:', blogsCache.length, 'search:', blogsSearchQuery);

    let filtered = [...blogsCache];
    if (blogsSearchQuery) {
      const q = blogsSearchQuery.toLowerCase();
      filtered = filtered.filter(blog => {
        const title = (blog.title || '').toLowerCase();
        const summary = (blog.summary || '').toLowerCase();
        const source = (blog.source || '').toLowerCase();
        const author = (blog.author || '').toLowerCase();
        return title.includes(q) || summary.includes(q) || source.includes(q) || author.includes(q);
      });
    }
    console.debug('[Blogs] filtered length:', filtered.length);

    if (countLabel) {
      countLabel.textContent = `INSIGHTS / ${filtered.length} ARTICLES`;
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="py-20 text-center font-mono text-xs text-zinc-500">
          No articles found matching "${blogsSearchQuery}".
        </div>
      `;
      return;
    }

    var cardsHtml = filtered.map((blog, idx) => `
      <div class="border border-zinc-200 bg-white p-5 flex flex-col gap-2.5 group hover:border-black hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all shadow-[0_1px_6px_rgba(0,0,0,0.03)] rounded-xl stagger-card btn-blog-card-click" data-index="${idx}">
        <div class="flex items-center gap-3 text-[9px] text-zinc-400 font-mono">
          <span class="bg-green-50 text-green-700 border border-green-100 px-2 py-0.5 rounded uppercase tracking-wider">${(blog.source || 'EV UPDATE').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
          <span>${((blog.date || '').toUpperCase())}</span>
        </div>
        <h3 class="text-[15px] font-bold leading-snug text-zinc-800 group-hover:text-black transition-colors">${(blog.title || 'Untitled EV Article').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</h3>
        <p class="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">${(blog.summary || '').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
        <div class="flex items-center justify-between mt-1 pt-2.5 border-t border-zinc-100">
          <span class="text-[8px] text-zinc-400 font-mono">BY ${(blog.author || 'EV CAR WALE').toUpperCase().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</span>
          <button class="font-mono text-[9px] uppercase tracking-wider text-[#22C55E] group-hover:text-black transition-colors flex items-center gap-1 select-none">
            READ BLOG <span class="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        </div>
      </div>
    `).join('');
    grid.innerHTML = cardsHtml;
    grid.classList.add('revealed');
    console.debug('[Blogs] cards rendered:', filtered.length);

    grid.querySelectorAll('.btn-blog-card-click').forEach(card => {
      card.addEventListener('click', () => {
        const idx = parseInt(card.getAttribute('data-index'), 10);
        const blog = filtered[idx];
        if (blog && blog.link) {
          window.open(blog.link, '_blank', 'noopener');
        }
      });
    });
  }
}

function renderAllInsightsPage() {
  const title = 'EV Insights Hub';
  const breadcrumbs = ['INSIGHTS', 'ALL CATEGORIES'];

  let categoriesHtml = '';
  INSIGHTS_CATEGORIES.forEach(cat => {
    const count = (INSIGHTS_DATABASE[cat.key] || []).length;
    categoriesHtml += `
      <a href="/insights/${cat.key}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all p-6 flex flex-col gap-3 group rounded-xl" style="border-radius:18px">
        <div class="w-10 h-10 bg-zinc-100 rounded-full flex items-center justify-center text-lg">${cat.icon}</div>
        <div>
          <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 group-hover:text-black">${cat.label}</h3>
          <p class="font-mono text-[9px] text-zinc-500 mt-0.5">${cat.desc}</p>
          <span class="font-mono text-[8px] text-zinc-400 mt-1 block">${count} ${count === 1 ? 'article' : 'articles'}</span>
        </div>
      </a>
    `;
  });

  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">RESOURCE CENTER / ${INSIGHTS_CATEGORIES.length} CATEGORIES</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">EV Insights Hub</h2>
        <p class="text-xs text-zinc-500 font-mono mt-1">Expert analysis, buying guides, comparisons, and everything you need to know about electric vehicles.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-2">
        ${categoriesHtml}
      </div>
    </div>
  `;

  renderSubpage(title, breadcrumbs, contentHtml, '/');
}

// --- Learn Article Page ---
function renderLearnArticlePage(slug, article) {
  // Ordered list for prev/next navigation
  const learnOrder = [
    'everything-about-evs',
    'ev-buying-guide',
    'home-charging',
    'fast-vs-slow',
    'battery-warranty',
    'subsidies',
    'running-cost',
    'learn-ev',
    'ev-terminology',
    'battery-chemistry',
    'lfp-vs-nmc',
    'ac-vs-dc',
    'v2l',
    'apartment-charging',
    'battery-health',
    'regenerative-braking',
    'highway-charging',
    'ground-clearance',
    'charging-etiquette'
  ];
  const currentIdx = learnOrder.indexOf(slug);
  const prevSlug = currentIdx > 0 ? learnOrder[currentIdx - 1] : null;
  const nextSlug = currentIdx < learnOrder.length - 1 ? learnOrder[currentIdx + 1] : null;
  const prevArticle = prevSlug ? LEARN_DATABASE[prevSlug] : null;
  const nextArticle = nextSlug ? LEARN_DATABASE[nextSlug] : null;

  // Extract key points (h3 headings) from content
  const keyPoints = [];
  const h3Regex = /<h3>(.*?)<\/h3>/g;
  let match;
  while ((match = h3Regex.exec(article.content)) !== null) {
    keyPoints.push(match[1]);
  }

  // Related articles (grab 4 articles starting from next index, wrapping around)
  const relatedSlugs = [];
  if (currentIdx !== -1) {
    const startIdx = (currentIdx + 1) % learnOrder.length;
    for (let i = 0; i < learnOrder.length && relatedSlugs.length < 4; i++) {
      const nextIdx = (startIdx + i) % learnOrder.length;
      const nextSlug = learnOrder[nextIdx];
      if (nextSlug !== slug) {
        relatedSlugs.push(nextSlug);
      }
    }
  } else {
    // Fallback if slug is not found in learnOrder
    for (let i = 0; i < learnOrder.length && relatedSlugs.length < 4; i++) {
      if (learnOrder[i] !== slug) relatedSlugs.push(learnOrder[i]);
    }
  }

  const breadcrumbs = ['LEARN', article.title];
  const isBatteryHealth = (slug === 'battery-health');
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 max-w-3xl mx-auto">
      <!-- Breadcrumb -->
      <a href="/#knowledge-hub" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">← Back to Learn Electric Vehicles</a>

      ${isBatteryHealth ? '' : `
      <!-- Title & Intro -->
      <div>
        <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">LEARN / ${article.title}</span>
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">${article.title}</h1>
        <p class="text-xs text-zinc-500 font-mono mt-2 leading-relaxed">${keyPoints.length > 0 ? keyPoints.slice(0, 2).join(' — ') : 'Detailed educational content about ' + article.title + '.'}</p>
      </div>
      `}

      <!-- Key Points / Highlights -->
      ${keyPoints.length > 0 ? `
      <div class="border border-zinc-200 bg-zinc-50 rounded-xl p-5">
        <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-3">KEY POINTS</span>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
          ${keyPoints.map((point, i) => `
            <div class="flex items-start gap-2 font-mono text-[10px] text-zinc-700">
              <span class="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center text-[7px] font-bold flex-shrink-0 mt-0.5">${i + 1}</span>
              <span>${point}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      <!-- Detailed Content -->
      <div class="prose-custom text-sm text-zinc-700 leading-relaxed font-mono">
        ${article.content}
      </div>

      <!-- Related Articles -->
      <div class="border-t border-zinc-200 pt-6 mt-2">
        <span class="font-mono text-[9px] text-zinc-400 uppercase tracking-widest block mb-3">RELATED ARTICLES</span>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          ${relatedSlugs.slice(0, 4).map(relSlug => {
            const relArticle = LEARN_DATABASE[relSlug];
            if (!relArticle) return '';
            return `
              <a href="/learn/${relSlug}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all p-4 rounded-xl group">
                <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider group-hover:text-black">${relArticle.title}</span>
                <p class="font-mono text-[8px] text-zinc-400 mt-1">Learn more →</p>
              </a>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Previous / Next Navigation -->
      <div class="grid grid-cols-2 gap-3 border-t border-zinc-200 pt-6 mt-2">
        <div>
          ${prevArticle ? `
            <a href="/learn/${prevSlug}" class="flex flex-col gap-1 border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all p-4 rounded-xl group text-left">
              <span class="font-mono text-[7px] text-zinc-400 uppercase tracking-widest">← PREVIOUS</span>
              <span class="font-mono text-[10px] text-zinc-700 group-hover:text-black">${prevArticle.title}</span>
            </a>
          ` : '<div></div>'}
        </div>
        <div>
          ${nextArticle ? `
            <a href="/learn/${nextSlug}" class="flex flex-col gap-1 border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all p-4 rounded-xl group text-right">
              <span class="font-mono text-[7px] text-zinc-400 uppercase tracking-widest">NEXT →</span>
              <span class="font-mono text-[10px] text-zinc-700 group-hover:text-black">${nextArticle.title}</span>
            </a>
          ` : '<div></div>'}
        </div>
      </div>

      <!-- Back Button -->
      <div class="border-t border-zinc-200 pt-6 mt-2 text-center">
        <a href="/#knowledge-hub" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-5 py-3 font-mono text-[9px] uppercase tracking-wider rounded-lg inline-block">← Back to Learn Electric Vehicles</a>
      </div>
    </div>
  `;
  renderSubpage(article.title, breadcrumbs, contentHtml, '/');
  if (typeof initAccordion === 'function') {
    setTimeout(initAccordion, 50);
  }
}

function initAccordion() {
  document.querySelectorAll('.accordion-item').forEach(item => {
    const btn = item.querySelector('.accordion-btn');
    const content = item.querySelector('.accordion-content');
    if (!btn || !content) return;
    content.style.maxHeight = '0';
    content.style.overflow = 'hidden';
    content.style.transition = 'max-height 0.3s ease';
    btn.setAttribute('role', 'button');
    btn.setAttribute('tabindex', '0');
    function toggleAccordion() {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.accordion-item.open').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('open');
          openItem.querySelector('.accordion-content').style.maxHeight = '0';
          const icon = openItem.querySelector('.accordion-icon');
          if (icon) icon.textContent = '+';
        }
      });
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = '0';
        const icon = btn.querySelector('.accordion-icon');
        if (icon) icon.textContent = '+';
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
        const icon = btn.querySelector('.accordion-icon');
        if (icon) icon.textContent = '−';
      }
    }
    btn.addEventListener('click', toggleAccordion);
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleAccordion();
      }
    });
  });
}

// --- Login Page ---
function renderLoginPage() {
  if (homepageContent) homepageContent.classList.add('hidden');
  if (detailsPageContent) {
    detailsPageContent.classList.remove('hidden');
    // Lock details container styles for full-screen fixed view
    detailsPageContent.style.setProperty('padding', '0', 'important');
    detailsPageContent.style.setProperty('margin', '0', 'important');
    detailsPageContent.style.setProperty('height', '100vh', 'important');
    detailsPageContent.style.setProperty('width', '100vw', 'important');
    detailsPageContent.style.setProperty('overflow', 'hidden', 'important');
    detailsPageContent.style.setProperty('display', 'flex', 'important');
    detailsPageContent.style.setProperty('align-items', 'center', 'important');
    detailsPageContent.style.setProperty('justify-content', 'center', 'important');
    detailsPageContent.style.setProperty('max-width', '100vw', 'important');
  }

  // Hide global navbar and AI assistant container on login page
  const megaNav = document.getElementById('mega-nav');
  if (megaNav) megaNav.classList.add('hidden');
  
  const aiAssistant = document.querySelector('.ai-assistant-container');
  if (aiAssistant) {
    aiAssistant.classList.add('hidden');
    aiAssistant.classList.remove('loaded');
  }

  // Prevent main page body scrolling
  document.body.style.setProperty('overflow', 'hidden', 'important');
  document.body.style.setProperty('height', '100vh', 'important');

  const contentHtml = `
    <div class="w-full h-full flex items-center justify-center p-4 md:p-8 bg-zinc-50 select-none">
      <div class="w-full max-w-5xl h-full max-h-[640px] grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl md:rounded-3xl overflow-hidden border border-zinc-200 bg-white shadow-[0_24px_48px_-12px_rgba(0,0,0,0.08)] relative">
        <!-- Left: Image -->
        <div class="hidden md:block relative h-full overflow-hidden">
          <img src="/login_illustration.png" alt="EV Car Wale" class="w-full h-full absolute inset-0 object-cover">
        </div>
        <!-- Right: Form -->
        <div class="p-8 md:p-12 flex flex-col justify-center relative overflow-y-auto h-full">
          <!-- Back button near the top-left of the login card/container -->
          <button id="btn-login-back" class="absolute top-6 left-8 px-4 py-2 border border-zinc-200 hover:border-black font-mono text-[9px] tracking-widest text-zinc-500 hover:text-black uppercase transition-all duration-300 rounded-lg flex items-center gap-1.5 z-10">
            ← BACK
          </button>
          
          <div class="max-w-sm mx-auto w-full pt-10 md:pt-4">
            <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">EV CAR WALE</span>
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-black">Welcome</h1>
            <p class="text-xs text-zinc-500 font-mono mt-1 mb-8">Sign in to continue exploring EV Car Wale.</p>
            <form id="login-form" class="flex flex-col gap-5" novalidate>
              <div class="flex flex-col gap-1.5">
                <label for="login-email" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Email Address</label>
                <input type="email" id="login-email" placeholder="you@example.com" class="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300" required>
                <span class="font-mono text-[9px] text-red-500 hidden" id="login-email-error"></span>
              </div>
              <div class="flex flex-col gap-1.5">
                <label for="login-password" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Password</label>
                <div class="relative">
                  <input type="password" id="login-password" placeholder="••••••••" class="w-full px-4 py-3 pr-10 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300" required>
                  <button type="button" id="toggle-password" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black transition-colors">
                    <svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[1.5]" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
                <span class="font-mono text-[9px] text-red-500 hidden" id="login-password-error"></span>
              </div>
              <div class="flex items-center justify-between">
                <label class="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" id="login-remember" class="w-3.5 h-3.5 rounded border-zinc-300 text-black focus:ring-black">
                  <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Remember Me</span>
                </label>
                <a href="/forgot-password" class="font-mono text-[9px] text-zinc-600 hover:text-black uppercase tracking-wider transition-colors">Forgot Password?</a>
              </div>
              <button type="submit" class="w-full py-3 bg-black text-white font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors btn-animate">Login</button>
              <div class="flex items-center gap-3">
                <span class="flex-1 h-px bg-zinc-200"></span>
                <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-wider">OR</span>
                <span class="flex-1 h-px bg-zinc-200"></span>
              </div>
              <button type="button" id="google-login-btn" class="w-full py-3 border border-zinc-200 rounded-xl font-mono text-[10px] text-zinc-700 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" class="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                Continue with Google
              </button>
              <p class="text-center font-mono text-[9px] text-zinc-500">
                Don't have an account? <a href="/signup" class="text-black font-bold hover:underline">Sign Up</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  `;

  if (detailsPageContent) {
    detailsPageContent.innerHTML = contentHtml;
    // Bind back button
    const backBtn = document.getElementById('btn-login-back');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        // Reset body & layout styles
        document.body.style.removeProperty('overflow');
        document.body.style.removeProperty('height');
        detailsPageContent.style.cssText = '';
        
        // Restore global navbar and AI assistant container
        const megaNav = document.getElementById('mega-nav');
        if (megaNav) megaNav.classList.remove('hidden');
        
        const aiAssistant = document.querySelector('.ai-assistant-container');
        if (aiAssistant) {
          aiAssistant.classList.remove('hidden');
          if (document.body.classList.contains('loaded')) {
            aiAssistant.classList.add('loaded');
          }
        }
        
        if (window.history.length > 1) {
          window.history.back();
        } else {
          navigateTo('/');
        }
      });
    }
  }

  setupLoginForm();
  if (typeof handleNavbarTheme === 'function') handleNavbarTheme();
  applyJargonBuster();
}

function renderSignupPage() {
  const contentHtml = `
    <div class="min-h-screen flex items-center justify-center px-6 py-12" id="signup-page-wrapper">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">EV CAR WALE</span>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-black">Create Account</h1>
          <p class="text-xs text-zinc-500 font-mono mt-1">Sign up to explore EV Car Wale.</p>
        </div>
        <div class="border border-zinc-200 bg-white rounded-2xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)]">
          <form class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label for="signup-name" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Full Name</label>
              <input type="text" id="signup-name" placeholder="John Doe" class="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300">
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="signup-email" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Email Address</label>
              <input type="email" id="signup-email" placeholder="you@example.com" class="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300">
            </div>
            <div class="flex flex-col gap-1.5">
              <label for="signup-password" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Password</label>
              <input type="password" id="signup-password" placeholder="••••••••" class="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300">
            </div>
            <button type="submit" class="w-full py-3 bg-black text-white font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors btn-animate">Create Account</button>
            <div class="flex items-center gap-3">
              <span class="flex-1 h-px bg-zinc-200"></span>
              <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-wider">OR</span>
              <span class="flex-1 h-px bg-zinc-200"></span>
            </div>
            <button type="button" id="google-signup-btn" class="w-full py-3 border border-zinc-200 rounded-xl font-mono text-[10px] text-zinc-700 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" class="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </button>
            <p class="text-center font-mono text-[9px] text-zinc-500">
              Already have an account? <a href="/login" class="text-black font-bold hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;
  renderSubpage('Sign Up', ['SIGNUP'], contentHtml, '/');
  setupSignupForm();
}

function setupSignupForm() {
  const wrapper = document.getElementById('signup-page-wrapper');
  if (wrapper) {
    const form = wrapper.querySelector('form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        showToast('EMAIL SIGNUP NOT SUPPORTED. PLEASE USE "CONTINUE WITH GOOGLE".');
      });
    }
  }
  const googleBtn = document.getElementById('google-signup-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      window.location.href = '/auth/google';
    });
  }
}

function renderForgotPasswordPage() {
  const contentHtml = `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-md mx-auto">
        <div class="text-center mb-8">
          <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">EV CAR WALE</span>
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-black">Reset Password</h1>
          <p class="text-xs text-zinc-500 font-mono mt-1">Enter your email and we'll send you a reset link.</p>
        </div>
        <div class="border border-zinc-200 bg-white rounded-2xl p-8 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)]">
          <form class="flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label for="reset-email" class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">Email Address</label>
              <input type="email" id="reset-email" placeholder="you@example.com" class="w-full px-4 py-3 border border-zinc-200 rounded-xl text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors placeholder-zinc-300">
            </div>
            <button type="submit" class="w-full py-3 bg-black text-white font-mono text-[10px] uppercase tracking-widest rounded-xl hover:bg-zinc-800 transition-colors btn-animate">Send Reset Link</button>
            <p class="text-center font-mono text-[9px] text-zinc-500">
              Remember your password? <a href="/login" class="text-black font-bold hover:underline">Login</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  `;
  renderSubpage('Reset Password', ['FORGOT PASSWORD'], contentHtml, '/');
}

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const emailError = document.getElementById('login-email-error');
  const passwordError = document.getElementById('login-password-error');
  const toggleBtn = document.getElementById('toggle-password');

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      toggleBtn.innerHTML = isPassword
        ? '<svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[1.5]" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg viewBox="0 0 24 24" class="w-4 h-4 stroke-current fill-none stroke-[1.5]" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');

    if (!email) {
      emailError.textContent = 'Email is required.';
      emailError.classList.remove('hidden');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      emailError.textContent = 'Please enter a valid email address.';
      emailError.classList.remove('hidden');
      valid = false;
    }
    if (!password) {
      passwordError.textContent = 'Password is required.';
      passwordError.classList.remove('hidden');
      valid = false;
    }

    if (valid) {
      showToast('EMAIL LOGIN NOT SUPPORTED. PLEASE USE "CONTINUE WITH GOOGLE".');
    }
  });

  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      window.location.href = '/auth/google';
    });
  }
}

function updateAuthUI(user) {
  window.updateAuthUI = updateAuthUI;
  const loginBtn = document.getElementById('login-nav-btn');
  const loginBtnMobile = document.getElementById('login-nav-btn-mobile');
  const profileContainer = document.getElementById('profile-container');
  const profileContainerMobile = document.getElementById('profile-container-mobile');

  if (user) {
    // Logged In
    if (loginBtn) loginBtn.style.setProperty('display', 'none', 'important');
    if (loginBtnMobile) loginBtnMobile.style.setProperty('display', 'none', 'important');

    if (profileContainer) {
      profileContainer.classList.remove('hidden');
      profileContainer.style.setProperty('display', 'block', 'important');
      profileContainer.href = "javascript:void(0)";
      profileContainer.innerHTML = `
        <div class="relative group flex items-center gap-2 cursor-pointer animate-fade-in">
          <img src="${user.picture || '/car_outline.jpg'}" alt="${user.name || 'User'}" class="w-8 h-8 rounded-full object-cover border border-zinc-200" onerror="this.src='/car_outline.jpg';">
          <span class="font-mono text-[9px] text-zinc-700 font-semibold uppercase tracking-wider hidden lg:inline">${user.name || 'Account'}</span>
          <!-- Dropdown Menu -->
          <div class="absolute right-0 top-full mt-2 w-44 bg-white border border-zinc-200 shadow-lg py-1.5 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 rounded-xl">
            <div class="px-4 py-2 border-b border-zinc-100 mb-1">
              <p class="font-sans text-[11px] font-bold text-zinc-900 truncate">${user.name}</p>
              <p class="font-mono text-[8px] text-zinc-400 truncate uppercase">${user.email}</p>
            </div>
            <a href="/profile.html" class="block px-4 py-2 text-[10px] font-mono text-zinc-700 hover:bg-zinc-50 hover:text-black uppercase">My Profile</a>
            <a href="javascript:void(0)" onclick="window.performLogout(event)" class="block px-4 py-2 text-[10px] font-mono text-red-600 hover:bg-zinc-50 uppercase border-t border-zinc-100 mt-1">Logout</a>
          </div>
        </div>
      `;
    }

    if (profileContainerMobile) {
      profileContainerMobile.classList.remove('hidden');
      profileContainerMobile.style.setProperty('display', 'block', 'important');
      profileContainerMobile.innerHTML = `
        <div class="flex flex-col gap-2 pt-4 border-t border-zinc-200 mt-2">
          <div class="flex items-center gap-3">
            <img src="${user.picture || '/car_outline.jpg'}" alt="${user.name}" class="w-10 h-10 rounded-full object-cover border border-zinc-200" onerror="this.src='/car_outline.jpg';">
            <div>
              <p class="font-mono text-[11px] text-zinc-900 font-bold uppercase">${user.name}</p>
              <p class="font-mono text-[8px] text-zinc-400 uppercase">${user.email}</p>
            </div>
          </div>
          <div class="flex gap-4 mt-2 font-mono">
            <a href="profile.html" class="text-[9px] text-zinc-700 border border-zinc-200 px-3 py-1.5 rounded-lg uppercase tracking-wider">My Profile</a>
            <a href="javascript:void(0)" onclick="window.performLogout(event)" class="text-[9px] text-red-600 border border-red-200 px-3 py-1.5 rounded-lg uppercase tracking-wider">Logout</a>
          </div>
        </div>
      `;
    }
  } else {
    // Logged Out
    if (loginBtn) loginBtn.style.setProperty('display', '', '');
    if (loginBtnMobile) loginBtnMobile.style.setProperty('display', '', '');

    if (profileContainer) {
      profileContainer.classList.add('hidden');
      profileContainer.style.setProperty('display', 'none', 'important');
      profileContainer.innerHTML = '';
    }
    if (profileContainerMobile) {
      profileContainerMobile.classList.add('hidden');
      profileContainerMobile.style.setProperty('display', 'none', 'important');
      profileContainerMobile.innerHTML = '';
    }
  }
}

// --- Static Page Renderer ---
function renderStaticPage(pageKey, page) {
  const breadcrumbs = [page.title];
  let contentHtml = '';
  if (pageKey === 'feedback') {
    contentHtml = buildFeedbackFormHtml();
  } else {
    contentHtml = buildPremiumAboutHtml(pageKey, page);
  }
  renderSubpage(page.title, breadcrumbs, contentHtml, '/');
  if (pageKey === 'feedback') {
    setTimeout(bindFeedbackForm, 50);
  }
}

function buildPremiumAboutHtml(pageKey, page) {
  const paragraphs = page.content.split('</p>').filter(p => p.trim());
  const parsed = paragraphs.map(p => {
    const clean = p.replace(/<\/?p>/g, '').trim();
    return clean;
  }).filter(p => p);

  const icons = {
    'about': ['🏠', '⚡', '🎯'],
    'about/mission': ['🎯', '🌱', '🤝'],
    'about/why-ev-car-wale': ['⭐', '📊', '🛠️', '📚', '🌍'],
    'about/team': ['👥', '💡', '🔬', '🎨'],
    'contact': ['📧', '📞', '📍', '🏢'],
    'help': ['📖', '💻', '📱', '🎓', '✉️'],
    'faqs': ['❓', '💰', '🔋', '⏱️', '🛣️'],
    'privacy-policy': ['🔒', '📋', '🛡️', '🍪'],
    'terms-and-conditions': ['📝', '⚖️', 'ℹ️', '🔄'],
    'disclaimer': ['⚠️', '🚗', '💰', '🔗', '📋'],
    'cookie-policy': ['🍪', '❓', '📊', '⚙️', '🔄'],
    'copyright': ['©️', '📄', '™️']
  };
  const pageIcons = icons[pageKey] || ['📄'];

  let sections = '';
  parsed.forEach((text, i) => {
    const icon = pageIcons[i % pageIcons.length];
    const boldMatch = text.match(/<strong>(.*?)<\/strong>/);
    if (boldMatch) {
      const titleText = boldMatch[1];
      const rest = text.replace(/<strong>.*?<\/strong>/, '').replace(/<\/?[^>]+(>|$)/g, '').trim();
      sections += `
        <div class="border border-zinc-200 bg-white p-6 md:p-8 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
          <div class="flex items-start gap-4">
            <span class="text-2xl flex-shrink-0 mt-0.5">${icon}</span>
            <div>
              <h3 class="text-base font-bold text-black mb-2">${titleText}</h3>
              <p class="text-sm text-zinc-600 leading-relaxed">${rest}</p>
            </div>
          </div>
        </div>`;
    } else {
      sections += `
        <div class="border border-zinc-200 bg-white p-6 md:p-8 rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-all">
          <div class="flex items-start gap-4">
            <span class="text-2xl flex-shrink-0 mt-0.5">${icon}</span>
            <p class="text-sm text-zinc-600 leading-relaxed">${text.replace(/<\/?[^>]+(>|$)/g, '')}</p>
          </div>
        </div>`;
    }
  });

  return `
    <div class="flex flex-col gap-8 pt-6">
      <div class="relative overflow-hidden bg-zinc-900 text-white p-8 md:p-12 rounded-xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative z-10">
          <a href="/" class="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-wider transition-colors mb-6">← Back to Home</a>
          <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">${page.title}</h1>
          <div class="w-12 h-1 bg-green-500 mt-4"></div>
        </div>
      </div>
      <div class="flex flex-col gap-5 max-w-4xl mx-auto w-full">
        ${sections}
      </div>
      <div class="border-t border-zinc-200 pt-8 mt-4 max-w-4xl mx-auto w-full">
        <a href="/" class="inline-flex items-center gap-2 border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-6 py-3 font-mono text-[9px] uppercase tracking-wider rounded-lg">← Back to Home</a>
      </div>
    </div>`;
}

function buildFeedbackFormHtml() {
  return `
    <div class="flex flex-col gap-8 pt-6">
      <div class="relative overflow-hidden bg-zinc-900 text-white p-8 md:p-12 rounded-xl">
        <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div class="relative z-10">
          <a href="/" class="inline-flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 hover:text-white uppercase tracking-wider transition-colors mb-6">← Back to Home</a>
          <h1 class="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white">Feedback</h1>
          <p class="text-sm text-zinc-400 mt-3 max-w-xl">We value your feedback. Help us improve EV Car Wale.</p>
          <div class="w-12 h-1 bg-green-500 mt-4"></div>
        </div>
      </div>
      <div class="max-w-2xl mx-auto w-full">
        <div class="border border-zinc-200 bg-white p-6 md:p-10 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div id="feedback-form-container">
            <div class="flex flex-col gap-6">
              <div class="text-center">
                <h3 class="text-lg font-bold text-black">Rate Your Experience</h3>
                <p class="text-xs text-zinc-500 mt-1">Tap a star to rate</p>
                <div class="flex items-center justify-center gap-1.5 mt-4" id="star-rating">
                  ${[1,2,3,4,5].map(i => `<button class="star-btn text-3xl text-zinc-200 hover:text-yellow-400 transition-colors focus:outline-none" data-value="${i}">★</button>`).join('')}
                </div>
                <div class="text-[10px] font-mono text-zinc-400 mt-2" id="rating-label">Select a rating</div>
              </div>
              <div class="border-t border-zinc-100 pt-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="flex flex-col gap-1.5">
                    <label class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Your Name</label>
                    <input type="text" id="feedback-name" class="border border-zinc-200 text-sm p-3 text-zinc-800 outline-none focus:border-black transition-all rounded-lg bg-zinc-50" placeholder="Enter your name">
                  </div>
                  <div class="flex flex-col gap-1.5">
                    <label class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Email Address</label>
                    <input type="email" id="feedback-email" class="border border-zinc-200 text-sm p-3 text-zinc-800 outline-none focus:border-black transition-all rounded-lg bg-zinc-50" placeholder="Enter your email">
                  </div>
                </div>
                <div class="flex flex-col gap-1.5 mt-4">
                  <label class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Subject</label>
                  <input type="text" id="feedback-subject" class="border border-zinc-200 text-sm p-3 text-zinc-800 outline-none focus:border-black transition-all rounded-lg bg-zinc-50" placeholder="What is this about?">
                </div>
                <div class="flex flex-col gap-1.5 mt-4">
                  <label class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Category</label>
                  <select id="feedback-category" class="border border-zinc-200 text-sm p-3 text-zinc-800 outline-none focus:border-black transition-all rounded-lg bg-zinc-50 cursor-pointer">
                    <option value="">Select a category</option>
                    <option value="general">General Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="content">Content Issue</option>
                    <option value="ux">User Experience</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div class="flex flex-col gap-1.5 mt-4">
                  <label class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">Your Feedback</label>
                  <textarea id="feedback-message" rows="5" class="border border-zinc-200 text-sm p-3 text-zinc-800 outline-none focus:border-black transition-all rounded-lg bg-zinc-50 resize-none" placeholder="Tell us what you think..."></textarea>
                </div>
                <button id="feedback-submit-btn" class="w-full mt-6 py-3.5 bg-black text-white font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-800 transition-all rounded-lg">Submit Feedback</button>
              </div>
            </div>
          </div>
          <div id="feedback-success" class="hidden text-center py-12">
            <span class="text-5xl block mb-4">✅</span>
            <h3 class="text-xl font-bold text-black">Thank You!</h3>
            <p class="text-sm text-zinc-500 mt-2 max-w-md mx-auto">Your feedback has been submitted successfully. We appreciate you helping us improve EV Car Wale.</p>
            <a href="/" class="inline-block mt-6 border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-6 py-3 font-mono text-[9px] uppercase tracking-wider rounded-lg">Back to Home</a>
          </div>
        </div>
      </div>
    </div>`;
}

function bindFeedbackForm() {
  var stars = document.querySelectorAll('.star-btn');
  var ratingLabel = document.getElementById('rating-label');
  var selectedRating = 0;
  var labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  stars.forEach(function(btn, index) {
    btn.addEventListener('click', function() {
      selectedRating = parseInt(this.getAttribute('data-value'));
      stars.forEach(function(s, i) {
        if (i < selectedRating) {
          s.classList.add('text-yellow-400');
          s.classList.remove('text-zinc-200');
        } else {
          s.classList.remove('text-yellow-400');
          s.classList.add('text-zinc-200');
        }
      });
      if (ratingLabel) ratingLabel.textContent = labels[selectedRating] || 'Selected';
    });
    btn.addEventListener('mouseenter', function() {
      var val = parseInt(this.getAttribute('data-value'));
      stars.forEach(function(s, i) {
        if (i < val) {
          s.classList.add('text-yellow-300');
          s.classList.remove('text-zinc-200');
        } else {
          if (!s.classList.contains('text-yellow-400')) {
            s.classList.remove('text-yellow-300');
            s.classList.add('text-zinc-200');
          }
        }
      });
    });
    btn.addEventListener('mouseleave', function() {
      stars.forEach(function(s, i) {
        if (i < selectedRating) {
          s.classList.add('text-yellow-400');
          s.classList.remove('text-zinc-200');
          s.classList.remove('text-yellow-300');
        } else {
          s.classList.remove('text-yellow-400');
          s.classList.remove('text-yellow-300');
          s.classList.add('text-zinc-200');
        }
      });
    });
  });

  var submitBtn = document.getElementById('feedback-submit-btn');
  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      var name = document.getElementById('feedback-name');
      var email = document.getElementById('feedback-email');
      var message = document.getElementById('feedback-message');
      if (selectedRating === 0) { ratingLabel.textContent = 'Please select a rating'; return; }
      if (!name || !name.value.trim()) { name.focus(); return; }
      if (!message || !message.value.trim()) { message.focus(); return; }
      var formContainer = document.getElementById('feedback-form-container');
      var successContainer = document.getElementById('feedback-success');
      if (formContainer) formContainer.classList.add('hidden');
      if (successContainer) successContainer.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function renderResourcePage(slug, article) {
  const breadcrumbs = ['RESOURCES', article.title];
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 max-w-3xl mx-auto">
      <a href="/" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">← Back to Home</a>
      <div>
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">${article.title}</h1>
      </div>
      <div class="prose-custom text-sm text-zinc-700 leading-relaxed font-mono">
        ${article.content}
      </div>
      <div class="border-t border-zinc-200 pt-6 mt-6">
        <a href="/" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white transition-all px-5 py-3 font-mono text-[9px] uppercase tracking-wider rounded-lg inline-block">← Back to Home</a>
      </div>
    </div>
  `;
  renderSubpage(article.title, breadcrumbs, contentHtml, '/');
}

// --- Blog Article Page ---
function renderBlogArticlePage(article) {
  const breadcrumbs = ['BLOG', article.title];
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 max-w-3xl mx-auto">
      <a href="/#home" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">← Back to Home</a>
      <div>
        <div class="flex items-center gap-2 text-[8px] font-mono text-zinc-400 uppercase tracking-wider mb-3">
          <span>${article.date}</span>
          <span>·</span>
          <span>${article.author}</span>
        </div>
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">${article.title}</h1>
        <p class="text-sm text-zinc-500 font-mono mt-2">${article.excerpt}</p>
      </div>
      <div class="prose-custom text-sm text-zinc-700 leading-relaxed font-mono">
        ${article.content}
      </div>
    </div>
  `;
  renderSubpage(article.title, breadcrumbs, contentHtml, '/');
}



// Dynamic Detail Page HTML Generator
async function renderCarDetailsPage(car) {
  currentDetailsCarId = car.id;
  addToRecentlyViewed(car.id);
  // Track activity for Profile -> My Activity
  try {
    var act = JSON.parse(localStorage.getItem('ev_activity') || '[]');
    act = act.filter(function(e) { return e.id !== car.id; });
    act.unshift({ id: car.id, time: new Date().toISOString() });
    if (act.length > 10) act = act.slice(0, 10);
    localStorage.setItem('ev_activity', JSON.stringify(act));
  } catch (e) {}
  let colorsList = [];
  try {
    const res = await fetch(`/api/car-images/list?brand=${car.brand}&model=${car.name}`);
    const data = await res.json();
    colorsList = data.colors || [];
  } catch (e) {
    console.error('Error fetching colors:', e);
  }

  const brandFolder = getBrandFolder(car.brand);
  const mainViewImg = getS3ImageUrl(car.image);

  let images = [mainViewImg];
  let colorNames = ['Default View'];
  
  if (colorsList && colorsList.length > 0) {
    colorsList.forEach(c => {
      images.push(getS3ImageUrl(c.path));
      colorNames.push(c.name);
    });
  }
  let activeVariantIdx = 0;
  // Try URL parameter first
  const urlParams = new URLSearchParams(window.location.search || window.location.hash.split('?')[1] || '');
  const urlVariant = urlParams.get('variant');
  if (urlVariant && car.variants) {
    const idx = car.variants.findIndex(v => normalizeKey(v.name) === normalizeKey(urlVariant));
    if (idx !== -1) {
      activeVariantIdx = idx;
    }
  } else {
    // Try localStorage
    const savedVariantName = localStorage.getItem(`ev_selected_variant_${car.id}`);
    if (savedVariantName && car.variants) {
      const idx = car.variants.findIndex(v => v.name === savedVariantName);
      if (idx !== -1) {
        activeVariantIdx = idx;
      }
    }
  }
  
  function updateDetailsUI() {
    const variant = car.variants[activeVariantIdx];
    
    // Related cars matching pricing proximity
    const relatedCars = EV_DATABASE.filter(c => c.id !== car.id)
      .sort((a, b) => Math.abs(a.priceVal - variant.priceVal) - Math.abs(b.priceVal - variant.priceVal))
      .slice(0, 3);
      
    let relatedHtml = '';
    const variantsOptionsHtml = car.variants.map((v, idx) => `
      <option value="${idx}" ${idx === activeVariantIdx ? 'selected' : ''}>
        ${v.name} (${v.price})
      </option>
    `).join('');
    relatedCars.forEach(c => {
      const imgUrl = getS3ImageUrl(c.image);
      relatedHtml += `
        <div class="border border-zinc-200 bg-white rounded-xl overflow-hidden flex flex-col">
          <div class="h-40 bg-white flex items-center justify-center p-4 border-b border-zinc-100">
            <img src="${imgUrl}" alt="${c.name}" class="w-full h-full object-contain" onerror="this.src='/car_outline.jpg'">
          </div>
          <div class="flex flex-col flex-1 p-4">
            <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">${getBrandDisplay(c.brand)}</span>
            <div class="flex items-center justify-between mt-1">
              <h4 class="font-bold text-sm text-black">${c.name}</h4>
              <span class="font-mono text-[11px] text-zinc-700 font-semibold">${c.price}</span>
            </div>
            <div class="flex items-center gap-2 mt-2 text-[9px] font-mono text-zinc-500">
              <span>${c.range || ''}</span>
              <span class="text-zinc-300">|</span>
              <span>${c.battery || ''}</span>
              <span class="text-zinc-300">|</span>
              <span>${c.charging || ''}</span>
            </div>
            <p class="text-[10px] text-zinc-500 mt-2 leading-relaxed flex-1">${c.features ? c.features.split(',').slice(0,2).join(', ') : ''}</p>
            <button class="w-full mt-3 py-2.5 border border-zinc-200 hover:bg-black hover:text-white hover:border-black text-[9px] font-mono tracking-widest uppercase transition-colors rounded-lg" data-id="${c.id}" data-related-view>
              VIEW DETAILS
            </button>
          </div>
        </div>
      `;
    });



    let specsHtml = `
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Battery Capacity</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-battery">${variant.battery}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Driving Range</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-range">${variant.range}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Charging Time (DC Fast)</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-charging">${variant.charging}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Highway Readiness</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-readiness">${getHighwayReadinessBadgeHtml(car)}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Motor Output</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-power">${variant.power}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Top Speed</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-speed">${variant.speed}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Drivetrain Configuration</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-drivetrain">${variant.drivetrain}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Peak Torque</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-torque">${variant.torque}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Standard AC Charging</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-chargingAC">${car.chargingAC}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Acceleration (0-100)</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-acceleration">${variant.acceleration}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Wheels Type & Size</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-wheels">${variant.wheels}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Chassis Dimensions</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-dimensions">${variant.dimensions}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Ground Clearance</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-clearance">${variant.clearance}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Boot Space</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-bootSpace">${variant.bootSpace}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Seating Capacity</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-seating">${variant.seating}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Safety Rating</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-safety">${variant.safety}</td>
      </tr>
      <tr class="border-b border-zinc-200">
        <td class="py-3 px-5 font-bold text-zinc-500 uppercase text-[9px] tracking-wider font-mono">Warranty Coverage</td>
        <td class="py-3 px-5 text-zinc-800 font-mono" id="detail-spec-warranty">${variant.warranty}</td>
      </tr>
    `;

    // Perform robust lookup in FEATURES_DATABASE (flat or nested manufacturer sub-objects)
    let foundKey = null;
    let foundBrand = null;
    let carFeatures = null;
    const carName = (car.name || '').trim();
    const cleanCarName = carName.toLowerCase().replace(/\s+/g, ' ').trim();
    
    if (FEATURES_DATABASE && typeof FEATURES_DATABASE === 'object') {
      // Helper to check if an object is a feature block
      const isFeatureBlock = (obj) => {
        if (!obj || typeof obj !== 'object') return false;
        const keys = Object.keys(obj).map(k => k.toLowerCase());
        return ['exterior', 'interior', 'safety', 'infotainment', 'adas', 'comfort'].some(cat => keys.includes(cat));
      };

      // 1. Direct search at root keys (case and space insensitive)
      for (const key of Object.keys(FEATURES_DATABASE)) {
        const cleanKey = key.toLowerCase().replace(/\s+/g, ' ').trim();
        if (cleanKey === cleanCarName) {
          const val = FEATURES_DATABASE[key];
          if (isFeatureBlock(val)) {
            carFeatures = val;
            foundKey = key;
            break;
          }
        }
      }

      // 2. Nested search inside brand/manufacturer keys
      if (!carFeatures) {
        for (const brandKey of Object.keys(FEATURES_DATABASE)) {
          const brandData = FEATURES_DATABASE[brandKey];
          if (brandData && typeof brandData === 'object' && !isFeatureBlock(brandData)) {
            for (const modelKey of Object.keys(brandData)) {
              const cleanModelKey = modelKey.toLowerCase().replace(/\s+/g, ' ').trim();
              if (cleanModelKey === cleanCarName) {
                const val = brandData[modelKey];
                if (isFeatureBlock(val)) {
                  carFeatures = val;
                  foundKey = modelKey;
                  foundBrand = brandKey;
                  break;
                }
              }
            }
          }
          if (carFeatures) break;
        }
      }

      // 3. Fallback fuzzy contains matching at root keys
      if (!carFeatures) {
        for (const key of Object.keys(FEATURES_DATABASE)) {
          const val = FEATURES_DATABASE[key];
          if (isFeatureBlock(val)) {
            const cleanKey = key.toLowerCase().replace(/\s+/g, ' ').trim();
            if (cleanKey.includes(cleanCarName) || cleanCarName.includes(cleanKey)) {
              carFeatures = val;
              foundKey = key;
              break;
            }
          }
        }
      }

      // 4. Fallback fuzzy contains matching inside brand/manufacturer keys
      if (!carFeatures) {
        for (const brandKey of Object.keys(FEATURES_DATABASE)) {
          const brandData = FEATURES_DATABASE[brandKey];
          if (brandData && typeof brandData === 'object' && !isFeatureBlock(brandData)) {
            for (const modelKey of Object.keys(brandData)) {
              const val = brandData[modelKey];
              if (isFeatureBlock(val)) {
                const cleanModelKey = modelKey.toLowerCase().replace(/\s+/g, ' ').trim();
                if (cleanModelKey.includes(cleanCarName) || cleanCarName.includes(cleanModelKey)) {
                  carFeatures = val;
                  foundKey = modelKey;
                  foundBrand = brandKey;
                  break;
                }
              }
            }
          }
          if (carFeatures) break;
        }
      }
    }

    let featuresHtml = '';
    const featuresKeys = ['Exterior', 'Interior', 'Safety', 'Infotainment', 'ADAS', 'Comfort'];
    
    // Debug info trackers
    let categoriesLoaded = [];
    let bulletsRenderedCount = 0;

    if (carFeatures && typeof carFeatures === 'object') {
      featuresKeys.forEach(key => {
        // Case insensitive property lookup in carFeatures object
        let rawValue = null;
        for (const k of Object.keys(carFeatures)) {
          if (k.toLowerCase() === key.toLowerCase()) {
            rawValue = carFeatures[k];
            break;
          }
        }
        
        if (!rawValue) return;
        
        const items = String(rawValue).split(',').map(s => s.trim()).filter(Boolean);
        if (!items.length) return;
        
        categoriesLoaded.push(key);
        let itemsList = '';
        items.forEach(item => {
          itemsList += `<li class="flex items-start gap-2 text-zinc-700 text-[11px] py-0.5"><span class="flex-shrink-0">•</span><span>${item}</span></li>`;
          bulletsRenderedCount++;
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
    }

    // Print debug requirements to console
    console.log('Vehicle requested:', carName);
    if (carFeatures) {
      console.log('Lookup key found:', foundKey + (foundBrand ? ` (under brand: ${foundBrand})` : ''));
      console.log('Features loaded:', true);
      console.log('Categories loaded:', categoriesLoaded.join(', '));
      console.log('Number of bullets rendered:', bulletsRenderedCount);
    } else {
      let failReason = 'No matching model key found in features database';
      if (!FEATURES_DATABASE || Object.keys(FEATURES_DATABASE).length === 0) {
        failReason = 'FEATURES_DATABASE is empty or not loaded';
      }
      console.log('Lookup key found:', null);
      console.log('Features loaded:', false);
      console.log('Categories loaded:', '');
      console.log('Number of bullets rendered:', 0);
      console.error('FEATURES LOOKUP FAILED! Reason:', failReason);
    }

    if (!featuresHtml) {
      featuresHtml = '<div class="col-span-full text-center py-12 font-mono text-xs text-zinc-500">Features coming soon.</div>';
    }

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

    let colorOptionsHtml = '';
    colorNames.forEach((cName, idx) => {
      colorOptionsHtml += `<option value="${idx}">${cName}</option>`;
    });

    let gallerySlideshowHtml = `
      <div class="flex flex-col gap-4 w-full">
        <div class="relative w-full h-[260px] md:h-[380px] bg-zinc-50 border border-zinc-200 flex items-center justify-center overflow-hidden select-none rounded-2xl group/gallery">
          <img id="detail-main-img" src="${images[0]}" class="w-full h-full object-contain p-2 transition-all duration-300" onerror="this.src='/car_outline.jpg';">
          ${images.length > 1 ? `
            <button id="gallery-detail-prev" class="absolute left-2 z-10 text-zinc-400 hover:text-black transition-all transform hover:scale-125 active:scale-95 bg-transparent border-none outline-none cursor-pointer p-1.5 flex items-center justify-center" aria-label="Previous image" style="background: transparent !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; outline: none !important;">
              <svg class="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button id="gallery-detail-next" class="absolute right-2 z-10 text-zinc-400 hover:text-black transition-all transform hover:scale-125 active:scale-95 bg-transparent border-none outline-none cursor-pointer p-1.5 flex items-center justify-center" aria-label="Next image" style="background: transparent !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; outline: none !important;">
              <svg class="w-6 h-6 stroke-current fill-none stroke-[2]" viewBox="0 0 24 24">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          ` : ''}
        </div>
        <div class="flex flex-col gap-2">
          <label for="gallery-color-select" class="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Available Colours</label>
          <div class="relative w-full md:w-72">
            <select id="gallery-color-select" class="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors cursor-pointer appearance-none rounded-xl" style="border-radius: 12px">
              ${colorOptionsHtml}
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
              <svg class="fill-none stroke-current stroke-2 w-3 h-3" viewBox="0 0 24 24">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;

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
              <div class="font-mono text-2xl font-black text-black mt-0.5" id="detail-display-price">${variant.price}</div>

              <!-- Variant Selector Dropdown -->
              <div class="flex flex-col gap-2 mt-4 border-t border-zinc-150 pt-4">
                <label for="detail-variant-select" class="font-mono text-[9px] text-zinc-450 uppercase tracking-widest">Variant</label>
                <div class="relative w-full">
                  <select id="detail-variant-select" class="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-xs font-mono text-zinc-800 outline-none focus:border-black transition-colors cursor-pointer appearance-none rounded-xl" style="border-radius: 12px">
                    ${variantsOptionsHtml}
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-zinc-500">
                    <svg class="fill-none stroke-current stroke-2 w-3 h-3" viewBox="0 0 24 24">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </div>
                </div>
              </div>
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

            <div class="flex justify-center font-mono text-[10px] tracking-wider mt-4">
              <button id="detail-compare-btn" class="py-3 px-8 border border-zinc-200 hover:border-black text-zinc-700 hover:text-black transition-colors uppercase text-center">
                COMPARE CAR
              </button>
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
                  <span class="font-bold text-black" id="detail-emi-price-label">${variant.price}</span>
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
    const detailWishlistBtn = document.getElementById('detail-wishlist-btn');
    if (detailWishlistBtn) {
      detailWishlistBtn.addEventListener('click', () => {
        toggleWishlist(car.id);
        alert(`${car.name.toUpperCase()} ACCESSED IN WISHLIST LOG.`);
        updateDetailsUI();
      });
    }

    function updateSpecsAndCalculators() {
      const v = car.variants[activeVariantIdx];
      if (!v) return;

      const priceDisplay = document.getElementById('detail-display-price');
      if (priceDisplay) priceDisplay.textContent = v.price;

      const specBattery = document.getElementById('detail-spec-battery');
      if (specBattery) specBattery.textContent = v.battery;

      const specRange = document.getElementById('detail-spec-range');
      if (specRange) specRange.textContent = v.range;

      const specCharging = document.getElementById('detail-spec-charging');
      if (specCharging) specCharging.textContent = v.charging;

      const specPower = document.getElementById('detail-spec-power');
      if (specPower) specPower.textContent = v.power;

      const specSpeed = document.getElementById('detail-spec-speed');
      if (specSpeed) specSpeed.textContent = v.speed;

      const specDrivetrain = document.getElementById('detail-spec-drivetrain');
      if (specDrivetrain) specDrivetrain.textContent = v.drivetrain;

      const specTorque = document.getElementById('detail-spec-torque');
      if (specTorque) specTorque.textContent = v.torque;

      const specAcceleration = document.getElementById('detail-spec-acceleration');
      if (specAcceleration) specAcceleration.textContent = v.acceleration;

      const specWheels = document.getElementById('detail-spec-wheels');
      if (specWheels) specWheels.textContent = v.wheels;

      const specSafety = document.getElementById('detail-spec-safety');
      if (specSafety) specSafety.textContent = v.safety;

      const specDimensions = document.getElementById('detail-spec-dimensions');
      if (specDimensions) specDimensions.textContent = v.dimensions;

      const emiPriceLabel = document.getElementById('detail-emi-price-label');
      if (emiPriceLabel) emiPriceLabel.textContent = v.price;

      renderOnRoadBreakdown();
      updateDetailEMI();
      updateRealWorldRange();
      updateDetailsSavings();
    }

    // Variant dropdown change
    const variantSelect = document.getElementById('detail-variant-select');
    if (variantSelect) {
      variantSelect.addEventListener('change', (e) => {
        activeVariantIdx = parseInt(e.target.value, 10);
        const selectedVariant = car.variants[activeVariantIdx];
        if (selectedVariant) {
          localStorage.setItem(`ev_selected_variant_${car.id}`, selectedVariant.name);
          const baseHash = window.location.hash.split('?')[0];
          window.location.hash = `${baseHash}?variant=${encodeURIComponent(selectedVariant.name)}`;
        }
        updateSpecsAndCalculators();
      });
    }

    // Related cards View Details click
    document.querySelectorAll('[data-related-view]').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-id');
        navigateTo(`/cars/${targetId}`);
      });
    });

    // Gallery details controls
    if (images.length > 0) {
      let currentIdx = 0;
      const mainImg = document.getElementById('detail-main-img');
      const colorSelect = document.getElementById('gallery-color-select');
      const prevBtn = document.getElementById('gallery-detail-prev');
      const nextBtn = document.getElementById('gallery-detail-next');
      
      function updateGalleryImg(idx) {
        currentIdx = (idx + images.length) % images.length;
        if (mainImg) mainImg.src = images[currentIdx];
        if (colorSelect) colorSelect.value = currentIdx;
      }

      if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateGalleryImg(currentIdx - 1);
        });
      }

      if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          updateGalleryImg(currentIdx + 1);
        });
      }

      if (colorSelect) {
        colorSelect.addEventListener('change', (e) => {
          updateGalleryImg(parseInt(e.target.value, 10));
        });
      }
    }

    // --- On-Road Price Calculator Binding ---
    const detailStateSelect = document.getElementById('detail-state-select');
    const onRoadBreakdown = document.getElementById('onroad-breakdown');

    function renderOnRoadBreakdown() {
      if (!detailStateSelect || !onRoadBreakdown) return;
      const stateKey = detailStateSelect.value;
      const v = car.variants[activeVariantIdx];
      if (!v) return;
      const data = getOnRoadPriceData(v.priceVal, stateKey);
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

    function updateDetailEMI() {
      const v = car.variants[activeVariantIdx];
      if (!v) return;
      const price = Math.floor(v.priceVal * 100000); // lakh to absolute numbers
      const minDown = Math.floor(price * 0.1);
      const maxDown = Math.floor(price * 0.9);
      
      sliderDown.min = minDown;
      sliderDown.max = maxDown;
      
      let downVal = parseInt(sliderDown.value);
      if (isNaN(downVal) || downVal < minDown || downVal > maxDown) {
        downVal = minDown;
        sliderDown.value = minDown;
      }
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

    if (sliderDown) sliderDown.addEventListener('input', updateDetailEMI);
    if (sliderRate) sliderRate.addEventListener('input', updateDetailEMI);
    if (sliderTenure) sliderTenure.addEventListener('input', updateDetailEMI);

    updateDetailEMI();

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

      const v = car.variants[activeVariantIdx];
      if (!v) return;
      const claimedRange = parseInt(v.range);
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
    // Default: Medium
    var acDefault = acGroup.querySelector('.trip-toggle-btn[data-value="medium"]');
    if (acDefault) acDefault.classList.add('trip-active');
  }

  // Toggle group — Driving Style
  if (styleGroup) {
    styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        styleGroup.querySelectorAll('.trip-toggle-btn').forEach(function(b) { b.classList.remove('trip-active'); });
        this.classList.add('trip-active');
      });
    });
    // Default: Normal
    var styleDefault = styleGroup.querySelector('.trip-toggle-btn[data-value="normal"]');
    if (styleDefault) styleDefault.classList.add('trip-active');
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

    // Validate vehicle selected
    if (!carId) {
      var origHTML = planBtn.innerHTML;
      planBtn.textContent = 'Please select a vehicle!';
      setTimeout(function() { planBtn.innerHTML = origHTML; }, 2200);
      return;
    }

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
  'apartment-charging': {
    title: 'Apartment Complex Charging',
    explanation: 'Securing a charger in a multi-owner residential block (apartment/society) requires coordination with the Resident Welfare Association (RWA) or building manager. Under current norms in many states, RWAs must provide a No Objection Certificate (NOC) for installing EV chargers at individual designated parking spots. The installation requires a dedicated meter, proper earthing, and a weatherproof enclosure for the charging unit.',
    analogy: 'Installing a charger in an apartment is like getting permission to add a dedicated split air conditioner line; it requires building safety clearance and wiring checks.'
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
      const resolvedSlug = LEARN_SLUG_ALIASES[guideId] || guideId;
      if (LEARN_DATABASE[resolvedSlug]) {
        navigateTo('/learn/' + guideId);
      } else {
        navigateTo('/hub/' + guideId);
      }
    });
  });
  
  // 2. Bind Section 6 Knowledge Hub cards
  document.querySelectorAll('.btn-open-hub').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const hubKey = card.getAttribute('data-hub-key');
      const resolvedSlug = LEARN_SLUG_ALIASES[hubKey] || hubKey;
      if (LEARN_DATABASE[resolvedSlug]) {
        navigateTo('/learn/' + hubKey);
      } else {
        navigateTo('/hub/' + hubKey);
      }
    });
  });
}

function initRevealObservers() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  revealElements.forEach(el => revealObserver.observe(el));

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

  const proCards = document.querySelectorAll('#pros-column .glass-card');
  const conCards = document.querySelectorAll('#cons-column .glass-card');
  const columnObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        proCards.forEach((card, index) => {
          setTimeout(() => { card.classList.add('reveal-active'); }, index * 80);
        });
        conCards.forEach((card, index) => {
          setTimeout(() => { card.classList.add('reveal-active'); }, index * 80);
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
    'maruti_suzuki': 'Maruti Suzuki',
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
    'vinfast': 'VinFast',
    'tesla': 'Tesla',
    'jaguar': 'Jaguar',
   'range-rover': 'Range Rover',
   'lexus': 'Lexus',
   'blink': 'Blink',
   'genesis': 'Genesis',
   'ferrari': 'Ferrari',
   'lotus': 'Lotus',
   'mini': 'MINI',
   'pmv': 'PMV',
   'pravaig': 'Pravaig',
   'rolls_royce': 'Rolls-Royce',
   'strom_motors': 'Strom Motors',
   'vayve_mobility': 'Vayve Mobility',
  };

  const brandName = brandNameMap[brandId.toLowerCase()] || brandId.toUpperCase();
  const breadcrumbs = ['MANUFACTURERS', brandName];
  
  const brandParams = new URLSearchParams(window.location.search);
  let searchQuery = brandParams.get('name') || '';
  let budgetFilter = brandParams.get('budget') || '';
  let bodyFilter = brandParams.get('body') || '';
  let sortBy = 'name-asc';
  let typeFilter = 'all';

  function normalizeBrandId(id) {
    return id.toLowerCase().replace(/[_-]/g, '');
  }
  const normalizedBrandKey = normalizeBrandId(brandId);

  function generateBrandContentHtml() {
    const brandCars = EV_DATABASE.filter(car => normalizeBrandId(car.brand) === normalizedBrandKey);
    const logoUrl = getBrandLogoUrl(brandId);
    const initials = getBrandInitials(brandName);
    
    const filteredCars = brandCars.filter(car => {
      const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            car.features.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesBudget = true;
      if (budgetFilter === '20') matchesBudget = car.priceVal < 20;
      else if (budgetFilter === '50') matchesBudget = car.priceVal >= 20 && car.priceVal <= 50;
      else if (budgetFilter === 'above') matchesBudget = car.priceVal > 50;

      let matchesBody = true;
      if (bodyFilter && bodyFilter !== 'all') matchesBody = BODY_TYPE_MAP[car.id] === bodyFilter;

      const isUpcoming = car.sections && car.sections.includes('upcoming');
      const matchesType = typeFilter === 'all' || 
                          (typeFilter === 'available' && !isUpcoming) || 
                          (typeFilter === 'upcoming' && isUpcoming);
      
      return matchesSearch && matchesType && matchesBudget && matchesBody;
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

    let minPrice = Infinity, maxPrice = 0, maxRange = 0;
    brandCars.forEach(c => {
      if (c.priceVal < minPrice) minPrice = c.priceVal;
      if (c.priceVal > maxPrice) maxPrice = c.priceVal;
      if (c.rangeVal > maxRange) maxRange = c.rangeVal;
    });
    const priceRange = minPrice === maxPrice
      ? (minPrice < 5 ? `₹${minPrice.toFixed(2)} Crore` : `₹${minPrice.toFixed(2)} Lakh`)
      : `₹${minPrice.toFixed(2)} - ${maxPrice < 5 ? `₹${maxPrice.toFixed(2)} Crore` : `₹${maxPrice.toFixed(2)} Lakh`}`;

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
      <div class="relative bg-zinc-950 text-white p-8 md:p-12 overflow-hidden flex flex-col justify-between rounded-xl border border-zinc-900 shadow-[0_12px_40px_rgba(0,0,0,0.15)] mt-4">
        <div class="absolute inset-0 bg-radial-gradient from-zinc-800/10 to-transparent opacity-50 pointer-events-none"></div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
          <div class="flex items-center gap-5">
            <img src="${logoUrl}" alt="${brandName}" class="w-20 h-20 md:w-24 md:h-24 object-contain rounded-xl bg-white/10 p-2 border border-zinc-800" loading="lazy" onerror="this.outerHTML='<div class=\\'w-20 h-20 md:w-24 md:h-24 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-black font-mono text-sm border border-zinc-700\\'>${initials}</div>'">
            <div class="text-left flex flex-col gap-1">
              <span class="text-[9px] font-mono text-zinc-400 tracking-[0.3em] uppercase block">MANUFACTURER ARCHIVE</span>
              <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">${brandName}</h1>
              <p class="text-xs text-zinc-400 font-mono max-w-md mt-1">Explore all current, latest, and upcoming electric mobility options from ${brandName}.</p>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-6 mt-8 z-10 font-mono text-[9px] text-zinc-400 border-t border-zinc-900 pt-4">
          <span>AVAILABLE: <strong>${brandCars.filter(c => !c.sections.includes('upcoming')).length} EVs</strong></span>
          <span>UPCOMING: <strong>${brandCars.filter(c => c.sections.includes('upcoming')).length} EVs</strong></span>
          <span>PRICE RANGE: <strong>${priceRange}</strong></span>
          <span>TOP RANGE: <strong>${maxRange} km</strong></span>
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
    const brandContainer = document.getElementById('brand-vehicles-container');
    if (brandContainer) brandContainer.classList.add('revealed');
  }

  function updateBrandListOnly() {
    const container = document.getElementById('brand-vehicles-container');
    if (container) {
      const brandCars = EV_DATABASE.filter(car => normalizeBrandId(car.brand) === normalizedBrandKey);
      
      const filteredCars = brandCars.filter(car => {
        const matchesSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              car.features.toLowerCase().includes(searchQuery.toLowerCase());
        
        let matchesBudget = true;
        if (budgetFilter === '20') matchesBudget = car.priceVal < 20;
        else if (budgetFilter === '50') matchesBudget = car.priceVal >= 20 && car.priceVal <= 50;
        else if (budgetFilter === 'above') matchesBudget = car.priceVal > 50;

        let matchesBody = true;
        if (bodyFilter && bodyFilter !== 'all') matchesBody = BODY_TYPE_MAP[car.id] === bodyFilter;

        const isUpcoming = car.sections && car.sections.includes('upcoming');
        const matchesType = typeFilter === 'all' || 
                            (typeFilter === 'available' && !isUpcoming) || 
                            (typeFilter === 'upcoming' && isUpcoming);
        
        return matchesSearch && matchesType && matchesBudget && matchesBody;
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
      container.classList.add('revealed');
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
