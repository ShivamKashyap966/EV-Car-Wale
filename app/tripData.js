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
], 'delhi-lucknow': [
  { city: 'Ghaziabad', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Kanpur', chargerType: 'DC 60 kW', network: 'Tata Power EV' }
], 'delhi-varanasi': [
  { city: 'Kanpur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Prayagraj', chargerType: 'DC 100 kW', network: 'Statiq' }
], 'delhi-srinagar': [
  { city: 'Panipat', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Ludhiana', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Jammu', chargerType: 'DC 60 kW', network: 'Statiq' }
], 'mumbai-goa': [
  { city: 'Panvel', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Kolhapur', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Belagavi', chargerType: 'DC 100 kW', network: 'Statiq' }
], 'mumbai-nagpur': [
  { city: 'Nashik', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Aurangabad', chargerType: 'DC 100 kW', network: 'Statiq' },
  { city: 'Amravati', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
], 'mumbai-ahmedabad': [
  { city: 'Vapi', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Surat', chargerType: 'DC 100 kW', network: 'Statiq' },
  { city: 'Vadodara', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
], 'chennai-hyderabad': [
  { city: 'Nellore', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Ongole', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Vijayawada', chargerType: 'DC 100 kW', network: 'Statiq' }
], 'chennai-kochi': [
  { city: 'Coimbatore', chargerType: 'DC 100 kW', network: 'Tata Power EV' },
  { city: 'Palakkad', chargerType: 'DC 60 kW', network: 'EESL CCS2' }
], 'hyderabad-pune': [
  { city: 'Solapur', chargerType: 'DC 60 kW', network: 'Tata Power EV' },
  { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' }
], 'hyderabad-mumbai': [
  { city: 'Solapur', chargerType: 'DC 60 kW', network: 'Statiq' },
  { city: 'Pune', chargerType: 'DC 150 kW', network: 'Tata Power EV' }
], 'kolkata-bhubaneswar': [
  { city: 'Kharagpur', chargerType: 'DC 60 kW', network: 'EESL CCS2' },
  { city: 'Balasore', chargerType: 'DC 60 kW', network: 'Tata Power EV' }
], 'kolkata-visakhapatnam': [
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

module.exports = {
  CITY_DISTANCE_DATABASE,
  ROUTE_STATIONS,
  TRIP_CITIES,
  getRouteData,
  getRouteStations
};