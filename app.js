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
    sections: ['popular'],
    
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
    sections: ['latest']
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
    sections: ['latest']
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
    sections: ['popular'],
    
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
    sections: ['popular'],
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
  },
 {
  id: 'audi-q6-etron',
  name: 'Audi Q6 e-tron',
  brand: 'audi',
  priceVal: 1.05,
  price: '₹1.05 Crore',
  rangeVal: 625,
  range: '625 km',
  battery: '100 kWh',
  charging: '21 min (DC)',
  speed: '210 km/h',
  power: '388 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Virtual Cockpit, Matrix LED headlights, Quattro AWD',
  dimensions: '4771 x 1939 x 1648 mm',
  image: 'audi_q6_etron.jpg',
  sections: ['explore']
},

{
  id: 'audi-q8-etron',
  name: 'Audi Q8 e-tron',
  brand: 'audi',
  priceVal: 1.15,
  price: '₹1.15 Crore',
  rangeVal: 600,
  range: '600 km',
  battery: '114 kWh',
  charging: '31 min (DC)',
  speed: '200 km/h',
  power: '408 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Adaptive Air Suspension, Quattro AWD, Audi Virtual Cockpit',
  dimensions: '4915 x 1937 x 1633 mm',
  image: 'audi_q8_etron.jpg',
  sections: ['explore']
},

{
  id: 'bmw-ix',
  name: 'BMW iX',
  brand: 'bmw',
  priceVal: 1.40,
  price: '₹1.40 Crore',
  rangeVal: 635,
  range: '635 km',
  battery: '111.5 kWh',
  charging: '35 min (DC)',
  speed: '200 km/h',
  power: '523 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Curved Display, Air Suspension, Driving Assistant Professional',
  dimensions: '4953 x 1967 x 1695 mm',
  image: 'bmw_ix.jpg',
  sections: ['explore']
},

{
  id: 'bmw-ix1-lwb',
  name: 'BMW iX1 LWB',
  brand: 'bmw',
  priceVal: 49.00,
  price: '₹49.00 Lakh',
  rangeVal: 531,
  range: '531 km',
  battery: '66.4 kWh',
  charging: '29 min (DC)',
  speed: '180 km/h',
  power: '204 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Panoramic Sunroof, BMW Curved Display, ConnectedDrive',
  dimensions: '4616 x 1845 x 1641 mm',
  image: 'bmw_ix1_lwb.jpg',
  sections: ['explore']
},

{
  id: 'byd-sealion-7',
  name: 'BYD Sealion 7',
  brand: 'byd',
  priceVal: 48.90,
  price: '₹48.90 Lakh',
  rangeVal: 567,
  range: '567 km',
  battery: '82.5 kWh',
  charging: '24 min (DC)',
  speed: '215 km/h',
  power: '530 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Blade Battery, Rotating Touchscreen, AWD',
  dimensions: '4830 x 1925 x 1620 mm',
  image: 'byd_sealion7.jpg',
  sections: ['explore']
},

{
  id: 'byd-emax7',
  name: 'BYD eMAX 7',
  brand: 'byd',
  priceVal: 26.90,
  price: '₹26.90 Lakh',
  rangeVal: 530,
  range: '530 km',
  battery: '71.8 kWh',
  charging: '37 min (DC)',
  speed: '180 km/h',
  power: '204 hp',
  safety: '5 Stars (ASEAN NCAP)',
  features: '7-Seater MPV, Rotating Touchscreen, Blade Battery',
  dimensions: '4710 x 1810 x 1690 mm',
  image: 'byd_emax7.jpg',
  sections: ['explore']
},

{
  id: 'hyundai-creta-electric',
  name: 'Hyundai Creta Electric',
  brand: 'hyundai',
  priceVal: 18.00,
  price: '₹18.00 Lakh',
  rangeVal: 473,
  range: '473 km',
  battery: '51.4 kWh',
  charging: '58 min (DC)',
  speed: '180 km/h',
  power: '169 hp',
  safety: 'Expected 5 Stars',
  features: 'Level 2 ADAS, Dual 10.25-inch Displays, V2L',
  dimensions: '4340 x 1790 x 1655 mm',
  image: 'hyundai_creta_electric.jpg',
  sections: ['explore']
},

{
  id: 'kia-carens-clavis-ev',
  name: 'Kia Carens Clavis EV',
  brand: 'kia',
  priceVal: 18.50,
  price: '₹18.50 Lakh',
  rangeVal: 490,
  range: '490 km',
  battery: '51.4 kWh',
  charging: '58 min (DC)',
  speed: '170 km/h',
  power: '169 hp',
  safety: 'Expected 5 Stars',
  features: 'ADAS, Dual Displays, Ventilated Seats',
  dimensions: '4550 x 1800 x 1708 mm',
  image: 'kia_carens_clavis_ev.jpg',
  sections: ['explore']
},

{
  id: 'mahindra-xev-7e',
  name: 'Mahindra XEV 7e',
  brand: 'mahindra',
  priceVal: 21.90,
  price: '₹21.90 Lakh (Expected)',
  rangeVal: 650,
  range: '650 km',
  battery: '79 kWh',
  charging: '20 min (DC)',
  speed: '200 km/h',
  power: '282 hp',
  safety: 'Expected 5 Stars',
  features: 'Level 2 ADAS, Panoramic Roof, Connected Car Tech',
  dimensions: '4700 x 1900 x 1750 mm',
  image: 'mahindra_xev7e.jpg',
  sections: ['explore']
},

{
  id: 'mahindra-thar-e',
  name: 'Mahindra Thar.e',
  brand: 'mahindra',
  priceVal: 25.00,
  price: '₹25.00 Lakh (Expected)',
  rangeVal: 500,
  range: '500 km',
  battery: '75 kWh',
  charging: '30 min (DC)',
  speed: '180 km/h',
  power: '250 hp',
  safety: 'Expected 5 Stars',
  features: 'Electric 4x4, Off-road Modes, Digital Cockpit',
  dimensions: '4300 x 1900 x 1850 mm',
  image: 'mahindra_thare.jpg',
  sections: ['explore']
},

{
  id: 'maruti-e-vitara',
  name: 'Maruti e Vitara',
  brand: 'maruti',
  priceVal: 18.00,
  price: '₹18.00 Lakh (Expected)',
  rangeVal: 500,
  range: '500 km',
  battery: '61 kWh',
  charging: '30 min (DC)',
  speed: '160 km/h',
  power: '174 hp',
  safety: 'Expected 5 Stars',
  features: 'ADAS, Connected Car, Panoramic Sunroof',
  dimensions: '4275 x 1800 x 1640 mm',
  image: 'maruti_evitara.jpg',
  sections: ['explore']
},

{
  id: 'mercedes-cla-electric',
  name: 'Mercedes-Benz CLA Electric',
  brand: 'mercedes',
  priceVal: 65.00,
  price: '₹65.00 Lakh (Expected)',
  rangeVal: 792,
  range: '792 km',
  battery: '85 kWh',
  charging: '22 min (DC)',
  speed: '210 km/h',
  power: '268 hp',
  safety: 'Expected 5 Stars',
  features: 'MBUX Superscreen, Level 2 ADAS, OTA Updates',
  dimensions: '4723 x 1855 x 1468 mm',
  image: 'mercedes_cla_electric.jpg',
  sections: ['explore']
},

{
  id: 'mercedes-eqa',
  name: 'Mercedes-Benz EQA',
  brand: 'mercedes',
  priceVal: 67.20,
  price: '₹67.20 Lakh',
  rangeVal: 560,
  range: '560 km',
  battery: '70.5 kWh',
  charging: '30 min (DC)',
  speed: '160 km/h',
  power: '190 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'MBUX Infotainment, Panoramic Sunroof, ADAS',
  dimensions: '4463 x 1834 x 1620 mm',
  image: 'mercedes_eqa.jpg',
  sections: ['explore']
},

{
  id: 'mercedes-eqe-suv',
  name: 'Mercedes-Benz EQE SUV',
  brand: 'mercedes',
  priceVal: 1.39,
  price: '₹1.39 Crore',
  rangeVal: 550,
  range: '550 km',
  battery: '90.6 kWh',
  charging: '32 min (DC)',
  speed: '210 km/h',
  power: '408 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Hyperscreen, Air Suspension, Burmester Audio',
  dimensions: '4863 x 1940 x 1685 mm',
  image: 'mercedes_eqe_suv.jpg',
  sections: ['explore']
},

{
  id: 'mercedes-eqs-suv',
  name: 'Mercedes-Benz EQS SUV',
  brand: 'mercedes',
  priceVal: 1.43,
  price: '₹1.43 Crore',
  rangeVal: 809,
  range: '809 km',
  battery: '122 kWh',
  charging: '31 min (DC)',
  speed: '210 km/h',
  power: '544 hp',
  safety: '5 Stars (Euro NCAP)',
  features: '7-Seater, MBUX Hyperscreen, Air Suspension',
  dimensions: '5125 x 1959 x 1718 mm',
  image: 'mercedes_eqs_suv.jpg',
  sections: ['explore']
},

{
  id: 'mercedes-g-class-electric',
  name: 'Mercedes-Benz G-Class Electric',
  brand: 'mercedes',
  priceVal: 3.00,
  price: '₹3.00 Crore',
  rangeVal: 473,
  range: '473 km',
  battery: '116 kWh',
  charging: '32 min (DC)',
  speed: '180 km/h',
  power: '579 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'G-Turn, 4 Electric Motors, Off-road Crawl Mode',
  dimensions: '4624 x 1931 x 1986 mm',
  image: 'mercedes_g580_eq.jpg',
  sections: ['explore']
},
{
  id: 'mg-cyberster',
  name: 'MG Cyberster',
  brand: 'mg',
  priceVal: 80.00,
  price: '₹80.00 Lakh',
  rangeVal: 580,
  range: '580 km',
  battery: '77 kWh',
  charging: '38 min (DC)',
  speed: '200 km/h',
  power: '510 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Convertible Roadster, Scissor Doors, Bose Audio',
  dimensions: '4535 x 1913 x 1329 mm',
  image: 'MG_Cyberster.JPG',
  sections: ['explore']
},

{
  id: 'mg-m9',
  name: 'MG M9',
  brand: 'mg',
  priceVal: 69.90,
  price: '₹69.90 Lakh',
  rangeVal: 430,
  range: '430 km',
  battery: '90 kWh',
  charging: '30 min (DC)',
  speed: '180 km/h',
  power: '245 hp',
  safety: 'Expected 5 Stars',
  features: 'Luxury MPV, Ottoman Seats, Dual Sunroof',
  dimensions: '5270 x 2000 x 1840 mm',
  image: 'MG_M9.jpg',
  sections: ['explore']
},

{
  id: 'mg-zs-ev',
  name: 'MG ZS EV',
  brand: 'mg',
  priceVal: 18.98,
  price: '₹18.98 Lakh',
  rangeVal: 461,
  range: '461 km',
  battery: '50.3 kWh',
  charging: '60 min (DC)',
  speed: '175 km/h',
  power: '176 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Panoramic Sunroof, ADAS, 10.1-inch Touchscreen',
  dimensions: '4323 x 1809 x 1649 mm',
  image: 'MG_ZS_EV.JPG',
  sections: ['explore']
},

{
  id: 'nissan-ariya',
  name: 'Nissan Ariya',
  brand: 'nissan',
  priceVal: 50.00,
  price: '₹50.00 Lakh (Expected)',
  rangeVal: 529,
  range: '529 km',
  battery: '87 kWh',
  charging: '35 min (DC)',
  speed: '200 km/h',
  power: '242 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'ProPILOT Assist, Dual Displays, e-4ORCE AWD',
  dimensions: '4595 x 1850 x 1660 mm',
  image: 'Nissan_Ariya.WEBP',
  sections: ['explore']
},

{
  id: 'nissan-leaf',
  name: 'Nissan Leaf',
  brand: 'nissan',
  priceVal: 30.00,
  price: '₹30.00 Lakh (Expected)',
  rangeVal: 385,
  range: '385 km',
  battery: '62 kWh',
  charging: '45 min (DC)',
  speed: '157 km/h',
  power: '214 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'ProPILOT Assist, e-Pedal, 360° Camera',
  dimensions: '4490 x 1788 x 1540 mm',
  image: 'nissan_leaf.JPG',
  sections: ['explore']
},

{
  id: 'porsche-cayenne-electric',
  name: 'Porsche Cayenne Electric',
  brand: 'porsche',
  priceVal: 2.00,
  price: '₹2.00 Crore (Expected)',
  rangeVal: 700,
  range: '700 km',
  battery: '100 kWh',
  charging: '18 min (DC)',
  speed: '250 km/h',
  power: '600 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Porsche Active Suspension, AWD, Premium Interior',
  dimensions: '4930 x 1983 x 1698 mm',
  image: 'PORSCHE_CAYENNE.JPG',
  sections: ['explore']
},

{
  id: 'porsche-taycan',
  name: 'Porsche Taycan',
  brand: 'porsche',
  priceVal: 1.70,
  price: '₹1.70 Crore',
  rangeVal: 642,
  range: '642 km',
  battery: '105 kWh',
  charging: '18 min (DC)',
  speed: '260 km/h',
  power: '408 hp',
  safety: '5 Stars (Euro NCAP)',
  features: '800V Charging, Adaptive Air Suspension, Sport Chrono',
  dimensions: '4963 x 1966 x 1381 mm',
  image: 'PORSCHE_TAYCAN.JPG',
  sections: ['explore']
},

{
  id: 'renault-kwid-ev',
  name: 'Renault Kwid EV',
  brand: 'renault',
  priceVal: 8.00,
  price: '₹8.00 Lakh (Expected)',
  rangeVal: 220,
  range: '220 km',
  battery: '27 kWh',
  charging: '40 min (DC)',
  speed: '125 km/h',
  power: '65 hp',
  safety: 'Expected 3 Stars',
  features: 'Compact Hatchback, Digital Cluster, Fast Charging',
  dimensions: '3734 x 1579 x 1515 mm',
  image: 'renault_kwid_ev.JPG',
  sections: ['explore']
},

{
  id: 'skoda-elroq',
  name: 'Skoda Elroq',
  brand: 'skoda',
  priceVal: 35.00,
  price: '₹35.00 Lakh (Expected)',
  rangeVal: 560,
  range: '560 km',
  battery: '77 kWh',
  charging: '28 min (DC)',
  speed: '180 km/h',
  power: '286 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Digital Cockpit, Matrix LED, Travel Assist',
  dimensions: '4488 x 1884 x 1625 mm',
  image: 'Skoda_Elroq.JPG',
  sections: ['explore']
},

{
  id: 'skoda-enyaq',
  name: 'Skoda Enyaq',
  brand: 'skoda',
  priceVal: 65.00,
  price: '₹65.00 Lakh (Expected)',
  rangeVal: 587,
  range: '587 km',
  battery: '82 kWh',
  charging: '28 min (DC)',
  speed: '180 km/h',
  power: '286 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Head-up Display, Matrix LEDs, Canton Audio',
  dimensions: '4649 x 1879 x 1616 mm',
  image: 'Skoda_Enyaq.JPG',
  sections: ['explore']
},

{
  id: 'tata-sierra-ev',
  name: 'Tata Sierra EV',
  brand: 'tata',
  priceVal: 25.00,
  price: '₹25.00 Lakh (Expected)',
  rangeVal: 550,
  range: '550 km',
  battery: '60 kWh',
  charging: '30 min (DC)',
  speed: '180 km/h',
  power: '170 hp',
  safety: 'Expected 5 Stars',
  features: 'Panoramic Sunroof, ADAS, Connected Car Tech',
  dimensions: '4300 x 1820 x 1675 mm',
  image: 'tata_sierra_ev.jpg',
  sections: ['explore']
},

{
  id: 'tata-tigor-ev',
  name: 'Tata Tigor EV',
  brand: 'tata',
  priceVal: 12.49,
  price: '₹12.49 Lakh',
  rangeVal: 315,
  range: '315 km',
  battery: '26 kWh',
  charging: '59 min (DC)',
  speed: '120 km/h',
  power: '74 hp',
  safety: '4 Stars (Global NCAP)',
  features: 'Ziptron Technology, Connected Car, Auto Climate Control',
  dimensions: '3993 x 1677 x 1532 mm',
  image: 'tata_tigor_ev.jpg',
  sections: ['explore']
},

{
  id: 'toyota-urban-cruiser-ev',
  name: 'Toyota Urban Cruiser EV',
  brand: 'toyota',
  priceVal: 18.00,
  price: '₹18.00 Lakh (Expected)',
  rangeVal: 500,
  range: '500 km',
  battery: '61 kWh',
  charging: '30 min (DC)',
  speed: '160 km/h',
  power: '174 hp',
  safety: 'Expected 5 Stars',
  features: 'ADAS, Connected Car, Panoramic Sunroof',
  dimensions: '4275 x 1800 x 1640 mm',
  image: 'Toyota_Urban_Cruiser_Ebella.jpg',
  sections: ['explore']
},

{
  id: 'vinfast-vf3',
  name: 'VinFast VF 3',
  brand: 'vinfast',
  priceVal: 10.00,
  price: '₹10.00 Lakh (Expected)',
  rangeVal: 215,
  range: '215 km',
  battery: '18.6 kWh',
  charging: '36 min (DC)',
  speed: '100 km/h',
  power: '43 hp',
  safety: 'Expected 4 Stars',
  features: 'Mini SUV, Connected Car, Compact Design',
  dimensions: '3190 x 1679 x 1652 mm',
  image: 'vin_fast_vf3.jpeg',
  sections: ['explore']
},

{
  id: 'vinfast-vf7',
  name: 'VinFast VF 7',
  brand: 'vinfast',
  priceVal: 35.00,
  price: '₹35.00 Lakh (Expected)',
  rangeVal: 450,
  range: '450 km',
  battery: '75.3 kWh',
  charging: '30 min (DC)',
  speed: '175 km/h',
  power: '349 hp',
  safety: 'Expected 5 Stars',
  features: 'Panoramic Roof, Level 2 ADAS, HUD',
  dimensions: '4545 x 1890 x 1636 mm',
  image: 'vin_fast_vf7.jpeg',
  sections: ['explore']
},

{
  id: 'vinfast-vf-mpv7',
  name: 'VinFast VF MPV7',
  brand: 'vinfast',
  priceVal: 28.00,
  price: '₹28.00 Lakh (Expected)',
  rangeVal: 450,
  range: '450 km',
  battery: '75 kWh',
  charging: '30 min (DC)',
  speed: '170 km/h',
  power: '201 hp',
  safety: 'Expected 5 Stars',
  features: '7-Seater MPV, Panoramic Roof, ADAS',
  dimensions: '4850 x 1900 x 1760 mm',
  image: 'VinFast_VF_MPV7.JPG',
  sections: ['explore']
},

{
  id: 'volvo-ec40',
  name: 'Volvo EC40',
  brand: 'volvo',
  priceVal: 59.00,
  price: '₹59.00 Lakh',
  rangeVal: 530,
  range: '530 km',
  battery: '82 kWh',
  charging: '28 min (DC)',
  speed: '180 km/h',
  power: '408 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Pilot Assist, Google Built-in, Panoramic Roof',
  dimensions: '4440 x 1873 x 1591 mm',
  image: 'volvo_EC40.WEBP',
  sections: ['explore']
},

{
  id: 'volvo-ex30',
  name: 'Volvo EX30',
  brand: 'volvo',
  priceVal: 50.00,
  price: '₹50.00 Lakh (Expected)',
  rangeVal: 476,
  range: '476 km',
  battery: '69 kWh',
  charging: '26 min (DC)',
  speed: '180 km/h',
  power: '428 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Google Built-in, Harman Kardon Audio, Pilot Assist',
  dimensions: '4233 x 1837 x 1549 mm',
  image: 'VOLVO_EX30.JPG',
  sections: ['explore']
},

{
  id: 'volvo-ex40',
  name: 'Volvo EX40',
  brand: 'volvo',
  priceVal: 57.90,
  price: '₹57.90 Lakh',
  rangeVal: 530,
  range: '530 km',
  battery: '82 kWh',
  charging: '28 min (DC)',
  speed: '180 km/h',
  power: '408 hp',
  safety: '5 Stars (Euro NCAP)',
  features: 'Google Built-in, 360° Camera, Pilot Assist',
  dimensions: '4440 x 1873 x 1651 mm',
  image: 'VOLVO_EX40.JPG',
  sections: ['explore']
}, 
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

// --- Learn Database (Buying Portal Articles) ---
const LEARN_DATABASE = {
  'home-charging': {
    title: 'Charging at Home',
    content: '<p>Setting up home charging is the most convenient and cost-effective way to keep your EV charged. Most EVs come with a portable charging cable that can plug into a standard 15A socket, but for faster charging, installing a dedicated AC wallbox is recommended.</p><h3>Standard 15A Socket Charging</h3><p>A standard 15A socket (the larger plug point found behind refrigerators and air conditioners) can delivers 2-3 kW of power. This charges most EV batteries from empty to full in 10-15 hours. It is perfectly adequate for overnight charging if your daily commute is under 80 km.</p><h3>AC Wallbox Installation</h3><p>A 7.2 kW AC wallbox is the gold standard for home charging. It charges 3-4 times faster than a standard socket, taking most EVs from 0-100% in 4-6 hours. Installation requires a dedicated 40A MCB in your electrical panel and proper earthing.</p><p>Many manufacturers offer free wallbox installation with vehicle purchase. The installation cost typically ranges from ₹3,000-8,000 depending on the distance from your meter box to the parking spot.</p><h3>Cost of Home Charging</h3><p>At residential electricity rates of ₹6-9 per kWh, home charging costs approximately ₹1-1.5 per km. This is 85-90% cheaper than petrol (₹8-9 per km). If you have solar panels, your running cost can drop to virtually zero.</p>'
  },
  'fast-vs-slow': {
    title: 'Fast vs Slow Charging',
    content: '<p>Understanding the difference between AC and DC charging is essential for efficient EV ownership. Here is a detailed comparison.</p><h3>AC Charging (Slow)</h3><p>Alternating Current from the grid is converted to Direct Current by the car\'s onboard charger. Speeds range from 2 kW (standard socket) to 22 kW (three-phase wallbox). AC charging is gentle on the battery, generates less heat, and contributes to longer battery life. Best for overnight and workplace charging.</p><h3>DC Fast Charging</h3><p>Direct Current is supplied directly to the battery, bypassing the onboard charger entirely. Speeds range from 50 kW to 350 kW. DC fast charging can add 200-300 km of range in just 15-30 minutes, making it ideal for highway road trips.</p><h3>Battery Impact</h3><p>While DC fast charging is convenient, frequent use (multiple times per week) can accelerate battery degradation by 2-5% over the vehicle\'s lifetime compared to exclusive AC charging. Most manufacturers recommend using DC fast charging only for long trips and relying on AC charging for daily needs.</p><h3>Cost Comparison</h3><p>AC home charging: ₹1-1.5/km. DC fast charging: ₹2.5-4.5/km. While still cheaper than petrol, DC charging costs 2-3x more than home AC charging due to infrastructure and electricity surcharges.</p>'
  },
  'battery-warranty': {
    title: 'Battery Warranty',
    content: '<p>EV battery warranties are one of the most important factors to consider when purchasing an electric vehicle. Here is what you need to know.</p><h3>Standard Coverage</h3><p>Most manufacturers in India offer 8 years or 1,60,000 km of battery warranty, whichever comes first. This covers manufacturing defects and capacity degradation below 70% of original capacity.</p><h3>What is Covered</h3><p>The warranty typically covers: battery cell defects, battery management system (BMS) failures, thermal management system issues, premature capacity loss beyond normal degradation, and complete battery failure.</p><h3>What is Not Covered</h3><p>Exclusions usually include: physical damage from accidents, damage from improper charging (using incompatible chargers), unauthorized modifications or tampering, and damage from natural disasters or flooding.</p><h3>Degradation Clauses</h3><p>Most warranties guarantee that the battery will retain at least 70% of its original capacity for the warranty period. If capacity falls below this threshold, the manufacturer will repair or replace the battery free of charge.</p><h3>Transferability</h3><p>Most EV battery warranties are transferable to subsequent owners, which helps maintain resale value. Some manufacturers charge a nominal transfer fee (₹5,000-15,000). Always check the specific terms before purchasing a used EV.</p>'
  },
  'subsidies': {
    title: 'Government Subsidies & State Incentives',
    content: '<p>Both the central government and various state governments offer financial incentives to make EVs more affordable. Here is a comprehensive overview.</p><h3>FAME-III Subsidy (Central)</h3><p>The FAME-III scheme allocates ₹12,500 crore for EV incentives. Passenger EVs receive ₹10,000-15,000 per kWh of battery capacity, capped at ₹3.5 lakh per vehicle. Two-wheelers receive ₹8,000-12,000 per kWh, capped at ₹35,000.</p><h3>Income Tax Benefits</h3><p>Under Section 80EEB, you can claim a deduction of up to ₹1.5 lakh on interest paid on loans taken to purchase an EV. This is in addition to other deductions under Section 80C.</p><h3>State-Level Incentives</h3><p>Delhi: 100% road tax exemption + registration fee waiver + up to ₹30,000 additional subsidy. Maharashtra: 100% road tax exemption (first EV) + reduced electricity tariff. Karnataka: 100% road tax exemption. Gujarat: 100% road tax exemption for 5 years. Tamil Nadu: 100% road tax exemption + interest subvention on EV loans.</p><h3>Registration Fee Waivers</h3><p>Most states offer full or partial registration fee waivers for EVs, saving you ₹10,000-30,000 depending on the vehicle price. Green license plates are issued for all EVs in India.</p>'
  },
  'running-cost': {
    title: 'EV Running Cost Analysis',
    content: '<p>One of the biggest advantages of EV ownership is the dramatically lower running cost compared to petrol or diesel vehicles. Here is a detailed breakdown.</p><h3>Electricity Cost</h3><p>At residential rates of ₹6-9 per kWh, an EV costs approximately ₹1-1.5 per km to run. A 40 kWh battery (typical for a compact EV) costs ₹240-360 to fully charge, providing 250-350 km of real-world range.</p><h3>Petrol Comparison</h3><p>A petrol car achieving 15 kmpl at ₹105 per litre costs approximately ₹7 per km. This means an EV saves you 80-85% on fuel costs compared to petrol. Over 15,000 km per year, the savings amount to ₹75,000-90,000 annually.</p><h3>Maintenance Savings</h3><p>EVs have no engine oil, timing belts, spark plugs, air filters, or exhaust systems to maintain. Annual maintenance costs for an EV are typically 40-50% lower than an equivalent petrol vehicle. A typical EV service costs ₹2,000-4,000 versus ₹5,000-10,000 for a petrol car.</p><h3>Total Cost of Ownership</h3><p>Over 5 years/75,000 km, an EV typically saves ₹3-5 lakh in fuel and maintenance costs compared to a petrol vehicle. Even with the higher upfront purchase price (₹1-3 lakh premium), the total cost of ownership is often lower for an EV, especially for high-mileage users.</p>'
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
    content: '<p>Electric vehicles (EVs) are rapidly transforming the automotive landscape in India. This comprehensive guide covers everything you need to know about EVs — from how they work to why they are the future of mobility.</p><h3>How EVs Work</h3><p>Unlike conventional vehicles that run on internal combustion engines, EVs are powered by one or more electric motors using energy stored in rechargeable battery packs. When you press the accelerator, the battery sends electricity to the motor, which turns the wheels instantly. There is no clutch, no gearbox, and no engine idling.</p><h3>Types of EVs</h3><p><strong>BEV (Battery Electric Vehicle):</strong> Runs entirely on battery power. No petrol engine, no tailpipe emissions. Examples: Tata Nexon EV, MG ZS EV, Hyundai Kona Electric.</p><p><strong>Hybrid EVs (HEV/PHEV):</strong> Combine a petrol engine with an electric motor. HEVs charge the battery through regenerative braking. PHEVs can be plugged in to charge. Examples: Toyota Hyryder (HEV), Volvo XC90 Recharge (PHEV).</p><h3>Key EV Advantages</h3><p>Lower running cost (85% cheaper than petrol), instant torque for quick acceleration, zero tailpipe emissions, silent operation, fewer moving parts requiring less maintenance, and access to EV-specific incentives like road tax exemptions and subsidies.</p><h3>Charging Basics</h3><p>EVs can be charged at home using a standard 15A socket (slow) or a dedicated AC wallbox (faster). For highway travel, DC fast chargers can add 200-300 km of range in 25-40 minutes. Public charging infrastructure in India is expanding rapidly with over 12,000 stations across the country.</p>'
  },
  'ev-buying-guide': {
    title: 'EV Buying Guide',
    content: '<p>Buying your first EV is exciting but requires careful consideration. This step-by-step guide walks you through the entire purchase process.</p><h3>Step 1: Assess Your Needs</h3><p>Determine your daily commute distance, whether you have access to home charging, your budget, and must-have features. Most Indians drive under 50 km daily, making even entry-level EVs with 200+ km range more than sufficient.</p><h3>Step 2: Set a Budget</h3><p>EV prices in India range from ₹8 lakh (entry-level) to ₹2.5 crore (luxury). Factor in the upfront cost minus FAME-III subsidy (up to ₹3.5 lakh) and state incentives (road tax exemption saves ₹30,000-2 lakh). Consider TCO (Total Cost of Ownership) rather than just the showroom price.</p><h3>Step 3: Choose the Right Model</h3><p>Compare range, charging speed, boot space, ground clearance, features, and warranty. Test drive shortlisted models. Pay attention to real-world range rather than ARAI certified figures. Check for service center availability in your city.</p><h3>Step 4: Financing</h3><p>Apply for an EV-specific loan which offers 0.5-1% lower interest rates than conventional car loans. Use the EMI calculator to plan your monthly payments. Claim Section 80EEB tax deduction on up to ₹1.5 lakh of interest paid.</p><h3>Step 5: Home Charging Setup</h3><p>Before delivery, arrange for a home charging installation. Most manufacturers include a free AC wallbox with installation. If you live in an apartment, start the RWA approval process early.</p>'
  },
  'learn-ev': {
    title: 'Learn EV',
    content: '<p>This comprehensive guide takes you from EV basics to advanced concepts, helping you understand electric vehicle technology thoroughly.</p><h3>EV Components</h3><p>The main components of an electric vehicle are: the battery pack (stores energy), the electric motor (converts electricity to motion), the onboard charger (converts AC to DC), the inverter (converts DC to AC for the motor), and the BMS or Battery Management System (monitors and protects the battery).</p><h3>How an EV Drives</h3><p>When you press the accelerator, the ECU (Electronic Control Unit) signals the inverter to draw power from the battery and send it to the motor. The motor creates rotational force (torque) instantly, providing smooth and quick acceleration without gear shifts.</p><h3>Battery Technology</h3><p>Most modern EVs use Lithium-ion batteries, which offer high energy density and long cycle life. Battery capacity is measured in kWh — larger numbers mean more range. Typical capacities range from 21 kWh (compact EVs) to 100 kWh (luxury EVs).</p><h3>Charging Levels</h3><p>Level 1: Standard 15A socket (2-3 kW). Level 2: AC wallbox (7-22 kW). Level 3: DC fast charging (50-350 kW). Higher kW means faster charging, but frequent DC fast charging can accelerate battery degradation.</p><h3>EV Maintenance</h3><p>EVs have 80% fewer moving parts than petrol cars. No oil changes, no timing belts, no spark plugs. Main maintenance items are: tire rotation, brake fluid replacement, cabin air filter, and coolant (for battery thermal management). Annual service costs 40-50% less than a petrol car.</p>'
  },
  'ev-terminology': {
    title: 'EV Terminology',
    content: '<p>EV terminology can be confusing for newcomers. This glossary explains the most common terms you will encounter.</p><h3>Battery & Charging Terms</h3><p><strong>kWh (Kilowatt-hour):</strong> A unit of energy used to measure battery capacity. A 40 kWh battery can deliver 40 kW of power for one hour.</p><p><strong>kW (Kilowatt):</strong> A unit of power used to measure charging speed and motor output. A 50 kW charger delivers 50 kWh of energy per hour.</p><p><strong>CCS2:</strong> Combined Charging System Type 2 — the standard charging connector for EVs in India. Supports both AC and DC charging through a single port.</p><p><strong>AC vs DC:</strong> Alternating Current (from the grid) must be converted to Direct Current (battery storage) by the car\'s onboard charger. DC fast charging bypasses the onboard charger, supplying DC directly to the battery.</p><h3>Performance Terms</h3><p><strong>Torque (Nm):</strong> Rotational force produced by the motor. EVs produce maximum torque instantly, providing quick acceleration from a standstill.</p><p><strong>Range (km):</strong> Distance an EV can travel on a full charge. ARAI range is tested in lab conditions; real-world range is typically 70-85% of ARAI figures.</p><p><strong>Regenerative Braking:</strong> Captures kinetic energy during deceleration and converts it back to electricity to recharge the battery.</p><h3>Safety & Features</h3><p><strong>ADAS:</strong> Advanced Driver Assistance Systems — safety features like automatic emergency braking, lane keeping, and adaptive cruise control.</p><p><strong>IP Rating:</strong> Ingress Protection rating for battery and motor. Most EVs have IP67 rating (dust tight and waterproof up to 1 meter depth).</p>'
  },
  'battery-chemistry': {
    title: 'Battery Chemistry',
    content: '<p>Understanding battery chemistry helps you make informed decisions about EV ownership. Here is what you need to know about the different battery types used in EVs.</p><h3>Lithium-ion (Li-ion) Batteries</h3><p>All modern EVs use lithium-ion batteries due to their high energy density and long cycle life. Within the lithium-ion family, there are several popular chemistries with different characteristics.</p><h3>LFP (Lithium Iron Phosphate)</h3><p>LFP batteries use iron and phosphate instead of cobalt and nickel. They are safer (lower fire risk), have longer cycle life (2,000-3,000+ charge cycles), and are more affordable. The trade-off is lower energy density, meaning they weigh more for the same capacity. Popular in: Tata Nexon EV, MG ZS EV (newer models).</p><h3>NMC (Nickel Manganese Cobalt)</h3><p>NMC batteries offer higher energy density, meaning more range in less weight. They perform better in cold weather but have shorter cycle life and contain cobalt, which raises ethical and cost concerns. Popular in: Hyundai Ioniq 5, Kia EV6, BMW i4.</p><h3>Solid-State Batteries (Future)</h3><p>Solid-state batteries replace the liquid electrolyte with a solid material, promising 2x the energy density, faster charging, and improved safety. Commercial deployment is expected from 2027-2030. Toyota and Nissan are leading solid-state development.</p>'
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
    title: 'Battery Health',
    content: '<p>Maximizing your EV battery\'s lifespan ensures long-term performance and preserves resale value. Here are expert tips for maintaining battery health.</p><h3>Optimal Charging Habits</h3><p>For LFP batteries: charging to 100% daily is fine and even recommended for proper BMS calibration. For NMC batteries: keep daily charging between 20-80% to reduce stress on the cells. For both chemistries: avoid letting the battery drop below 10% regularly.</p><h3>Temperature Management</h3><p>Heat is the biggest enemy of battery health. Park in shade whenever possible. Use scheduled charging to charge during cooler night hours. If your EV has battery preconditioning, use it before DC fast charging in extreme temperatures.</p><h3>DC Fast Charging Frequency</h3><p>While convenient, regular DC fast charging can accelerate degradation. Use DC fast charging primarily for road trips. For daily charging, rely on AC home or workplace charging. Studies show that exclusive DC fast charging can cause 2-5% additional degradation over 1,00,000 km compared to AC charging.</p><h3>Battery Calibration</h3><p>Every 1-2 months, let the battery discharge to below 10% and then charge to 100% to let the BMS recalibrate the state of charge estimation. This ensures your range display remains accurate.</p><h3>Warranty Protection</h3><p>Most manufacturers warrant the battery for 8 years or 1,60,000 km, guaranteeing at least 70% capacity retention. Following the above best practices will help ensure your battery stays well within this threshold.</p>'
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
  'audi': 'lAUDI_LOGO.JPG',
  'bmw': 'BMW_LOGO.jpeg',
  'byd': 'BYD_LOGO.jpeg',
  'citroen': 'CITROEN_logo.jpg',
  'force-motors': 'force_logo.jpeg',
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
  'jaguar': 'Jaguar_logo.jpeg',
  'range-rover': 'range_rover_logo.PNG',
  'rolls-royce': 'ROLLS_ROYCE.JPG',
};
function getBrandLogoUrl(brandId) {
  return '/LOGOS/' + (BRAND_LOGO_MAP[brandId] || brandId.toUpperCase() + '_LOGO.jpeg');
}
function getBrandInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

// --- Insights Master Database ---
const INSIGHTS_DATABASE = {
  'latest-news': [
    { id: 'in-news-1', title: 'FAME-III Subsidy Allocations Finalized', subtitle: 'Government announces ₹12,500 crore incentive package', excerpt: 'The FAME-III framework introduces ₹12,500 crore in incentives, prioritizing localization of battery modules and public charging systems.', date: 'Oct 12, 2026', author: 'EV Bureau', readTime: '4 min read', tag: 'Policy', image: '', content: '<p>The Ministry of Heavy Industries has officially finalized the FAME-III subsidy framework, allocating ₹12,500 crore to accelerate electric vehicle adoption across India. The new policy prioritizes localization of battery module manufacturing and expansion of public charging infrastructure.</p><p>Industry leaders expect this to drive electric vehicle adoption significantly across passenger and commercial segments. Key highlights include higher subsidies for vehicles with higher localization percentages and additional incentives for installing home charging units.</p><p>The framework also introduces performance-linked incentives for OEMs that achieve domestic value addition targets, potentially reshaping the supply chain landscape in the coming years.</p>' },
    { id: 'in-news-2', title: 'Highway Fast Charger Corridor Expands', subtitle: '350 kW hyper-chargers coming to Golden Quadrilateral', excerpt: 'Strategic partnerships aim to install DC fast chargers every 50 km on national expressways.', date: 'Oct 10, 2026', author: 'Tech Desk', readTime: '3 min read', tag: 'Infra', image: '', content: '<p>A consortium of energy companies has announced a massive expansion of the highway fast-charging network along India\'s Golden Quadrilateral. The plan includes installation of 350 kW hyper-chargers capable of adding 300 km of range in just 15 minutes.</p><p>Strategic partnerships aim to install DC fast chargers every 50 km on national expressways, boosting inter-city travel stability. The new 350 kW hyper-chargers will enable compatible premium vehicles to recharge from 10% to 80% in under 15 minutes.</p><p>This infrastructure push is expected to significantly reduce range anxiety for inter-city EV travelers and boost adoption in the premium and luxury segments.</p>' },
    { id: 'in-news-3', title: 'Solid-State Modules Enter Trial Phase', subtitle: '800 km range battery technology hits the road', excerpt: 'Solid-state battery prototypes promise up to 800 km range per charge with complete thermal runaway resistance.', date: 'Oct 08, 2026', author: 'EV Bureau', readTime: '5 min read', tag: 'Tech', image: '', content: '<p>Solid-state battery technology has moved from the laboratory to real-world testing, with several manufacturers now conducting road trials. The new modules offer double the energy density of current lithium-ion equivalents.</p><p>Solid-state battery prototypes promise up to 800 km range per charge and complete thermal runaway resistance, scaling production indexes. Crucially, these new modules offer double the energy density of current lithium-ion equivalents, opening up new possibilities for long-distance luxury touring.</p><p>Commercial availability is expected within 18-24 months, potentially marking the biggest leap in EV technology since the mass-market electric car.</p>' },
    { id: 'in-news-4', title: 'EV Sales Cross 2 Million Mark in India', subtitle: 'Annual EV registrations hit record high in FY 2025-26', excerpt: 'India\'s EV market has achieved a historic milestone with annual sales crossing the 2 million unit mark.', date: 'Oct 05, 2026', author: 'Market Desk', readTime: '3 min read', tag: 'Market', image: '', content: '<p>India has emerged as one of the fastest-growing EV markets globally, with annual registrations crossing 2 million units for the first time. The milestone represents a 67% year-on-year growth, driven primarily by two-wheeler and three-wheeler segments.</p><p>Passenger EV sales also saw significant uptick, crossing 150,000 units annually. The growth is attributed to expanding product portfolios, improving charging infrastructure, and sustained government policy support.</p><p>Industry analysts project the market to reach 5 million annual units by 2028, contingent on continued policy support and infrastructure development.</p>' },
    { id: 'in-news-5', title: 'Battery Recycling Mandate Takes Effect', subtitle: 'New regulations require OEMs to manage end-of-life battery recycling', excerpt: 'India\'s battery recycling mandate comes into effect, requiring manufacturers to set up collection and recycling infrastructure.', date: 'Oct 03, 2026', author: 'Policy Desk', readTime: '4 min read', tag: 'Policy', image: '', content: '<p>The Ministry of Environment has enforced the Battery Waste Management Rules, mandating all EV manufacturers to establish end-of-life battery collection and recycling mechanisms. The policy requires a minimum of 70% material recovery from spent batteries.</p><p>This positions India as a leader in circular economy practices for the EV sector. Several manufacturers have already announced partnerships with recycling firms to comply with the mandate.</p><p>The regulation also introduces a deposit-refund scheme to incentivize consumers to return spent batteries to authorized collection centers.</p>' }
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
    { id: 'in-market-1', title: 'India EV Market Report: FY 2025-26 Analysis', subtitle: 'Comprehensive annual analysis of the Indian EV market performance', excerpt: 'A detailed analysis of EV sales, market share, and trends in India for FY 2025-26.', date: 'Oct 2026', author: 'Market Desk', readTime: '8 min read', tag: 'Analysis', image: '', content: '<h3>Market Overview</h3><p>The Indian EV market demonstrated remarkable resilience and growth in FY 2025-26, recording total sales of 2.1 million units across all segments. This represents a 67% year-on-year increase from the previous fiscal year.</p><h3>Two-Wheeler Dominance</h3><p>Electric two-wheelers continued to dominate the EV landscape, accounting for 1.6 million units (76% of total EV sales). Ola Electric led the segment with 35% market share, followed by Oben Electric and Ather Energy.</p><h3>Passenger Vehicle Growth</h3><p>Electric passenger vehicle sales crossed 156,000 units, a 92% increase over FY 2024-25. Tata Motors maintained its leadership with 62% market share, followed by MG Motor and Hyundai.</p><h3>Three-Wheelers and Commercial</h3><p>The electric three-wheeler segment grew 55% to 320,000 units. Electric buses also saw significant adoption with 4,500 units deployed across state transport corporations.</p><h3>Key Takeaways</h3><p>EV penetration in the overall automotive market reached 6.8%, up from 4.2% in the previous year. Continued policy support and expanding product portfolios are expected to drive penetration to 12% by FY 2027-28.</p>' },
    { id: 'in-market-2', title: 'State-wise EV Adoption Analysis', subtitle: 'Which Indian states are leading the EV revolution?', excerpt: 'A detailed state-by-state breakdown of EV adoption rates, incentives, and infrastructure.', date: 'Sep 2026', author: 'Market Desk', readTime: '6 min read', tag: 'Analysis', image: '', content: '<p>EV adoption varies significantly across Indian states, driven by local policies, infrastructure, and consumer awareness. Here\'s the complete analysis for FY 2025-26.</p><p><strong>Top 5 States by EV Sales:</strong> Maharashtra (412,000 units), Karnataka (308,000), Tamil Nadu (275,000), Gujarat (256,000), and Uttar Pradesh (234,000). These five states account for 61% of all EV sales in India.</p><p><strong>Highest EV Penetration:</strong> Delhi leads with 18.5% EV penetration in new vehicle sales, followed by Goa (15.2%), Karnataka (11.8%), Maharashtra (10.4%), and Kerala (9.6%). Delhi\'s aggressive EV policy and comprehensive subsidy program are key drivers.</p><p><strong>Charging Infrastructure:</strong> Maharashtra has the most public charging stations (3,200+), followed by Karnataka (2,800+) and Delhi (2,100+). The Delhi-Mumbai and Bangalore-Chennai highway corridors are the most electrified routes.</p><p><strong>Emerging Markets:</strong> Tier 2 and 3 cities are showing accelerating adoption, with cities like Indore, Surat, Lucknow, and Coimbatore recording over 200% year-on-year growth.</p>' },
    { id: 'in-market-3', title: 'EV Battery Price Trends in India', subtitle: 'Battery costs continue to decline, impacting EV affordability', excerpt: 'Analysis of battery price trends and their impact on EV pricing in India.', date: 'Sep 2026', author: 'Market Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<p>Battery prices remain the single most significant factor in EV affordability. Here\'s the latest analysis on pricing trends.</p><p><strong>Current Pricing:</strong> Lithium-ion battery pack prices in India have fallen to approximately $105/kWh in 2026, down from $140/kWh in 2024. LFP battery packs are even cheaper at around $85/kWh.</p><p><strong>Localization Impact:</strong> The government\'s ACC PLI scheme and the recent battery cell manufacturing commitments from companies like Ola Electric, Reliance, and Exide are expected to further reduce costs. Domestic cell production could bring prices below $80/kWh by 2028.</p><p><strong>Impact on Vehicle Prices:</strong> A 40 kWh battery pack now costs approximately ₹3.5 lakh less than it did in 2024. This cost reduction is gradually being passed on to consumers through lower EV prices and improved feature sets.</p><p><strong>Future Outlook:</strong> With sodium-ion battery technology maturing and solid-state batteries entering production, we could see pack prices drop below $60/kWh by 2030, making EVs price-competitive with petrol vehicles without subsidies.</p>' },
    { id: 'in-market-4', title: 'Premium EV Segment Market Analysis', subtitle: 'The luxury EV market in India is experiencing unprecedented growth', excerpt: 'Analysis of the premium and luxury EV segment performance in India.', date: 'Sep 2026', author: 'Luxury Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<p>India\'s premium EV segment (₹30 lakh+) has become the fastest-growing EV category, with sales of 14,500 units in FY 2025-26, a 128% increase over the previous year.</p><p><strong>Market Leaders:</strong> BMW leads the luxury EV segment with 28% market share, followed by Mercedes-Benz (24%), Volvo (18%), Audi (15%), and Kia (12%). The Kia EV6 and Hyundai Ioniq 5 have been particularly successful in the crossover segment.</p><p><strong>Average Transaction Price:</strong> The average luxury EV in India now sells for ₹58.5 lakh, down 8% from the previous year due to increased localization and competitive pricing.</p><p><strong>Consumer Profile:</strong> 72% of luxury EV buyers are first-time EV owners, and 45% are upgrading from a premium internal combustion engine vehicle. The top reasons cited are running cost savings (58%), performance (52%), and environmental consciousness (41%).</p><p><strong>Infrastructure Gap:</strong> While home charging is the primary charging method (78% of luxury EV owners), the availability of high-power DC chargers in premium residential and commercial locations is becoming increasingly important for this segment.</p>' },
    { id: 'in-market-5', title: 'Used EV Market Analysis', subtitle: 'The pre-owned EV market is growing rapidly in India', excerpt: 'Analysis of the emerging used EV market in India and its implications.', date: 'Aug 2026', author: 'Market Desk', readTime: '5 min read', tag: 'Analysis', image: '', content: '<p>The used EV market is emerging as a significant segment, with 22,000 pre-owned EVs changing hands in FY 2025-26. Here\'s the analysis.</p><p><strong>Resale Value:</strong> Early Tata Nexon EV models (2019-2021) retain approximately 65-70% of their original value, comparable to diesel variants. The Tiago EV shows even stronger retention at 72-75% due to its lower entry price.</p><p><strong>Battery Health Certification:</strong> Major used car platforms like Spinny and Cars24 have introduced battery health certification programs. These tests measure State of Health (SoH), maximum DC charging rate, and overall battery degradation.</p><p><strong>Price Trends:</strong> Used EVs typically sell at a 10-15% premium over comparable petrol models in the same age bracket, largely due to lower running costs. However, this premium is expected to shrink as more EVs enter the used market.</p><p><strong>Warranty Transfer:</strong> Most manufacturers allow warranty transfer to second owners, though some charge a nominal fee (₹5,000-15,000). Third-party extended warranty products covering EV-specific components are also becoming available.</p><p><strong>Market Outlook:</strong> The used EV market is projected to grow to 150,000 annual units by 2028 as early EV adopters upgrade to newer models with better range and technology.</p>' }
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
    content: '<p>We\'d love to hear from you! Whether you have a question about our platform, want to report an issue, or are interested in partnering with us, here\'s how you can reach us.</p><p><strong>Email:</strong> support@evcarwale.com</p><p><strong>Phone:</strong> +91-XXX-XXX-XXXX (Available Monday-Friday, 10 AM - 6 PM IST)</p><p><strong>Address:</strong> EV Car Wale, India</p><p>For press and media inquiries, please email us at press@evcarwale.com. For partnership opportunities, reach out to partnerships@evcarwale.com.</p><p>We aim to respond to all inquiries within 24-48 business hours.</p>'
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
       <img src="public/car_images/${car.brand.toUpperCase()}/${car.image}" alt="${car.name}" class="w-full h-full object-contain">
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
// Login navigation
document.querySelectorAll('#login-nav-btn, #login-nav-btn-mobile').forEach(btn => {
  btn.addEventListener('click', () => {
    navigateTo('/login');
  });
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


// --- Language Selector Module ---
(function initLanguageSelector() {
  const btn = document.getElementById('lang-selector-btn');
  const dropdown = document.getElementById('lang-dropdown');
  const currentLabel = document.getElementById('lang-current');
  const options = document.querySelectorAll('.lang-option');
  if (!btn || !dropdown || !currentLabel) return;

  const LANG_KEY = 'evcarwale_language';
  const saved = localStorage.getItem(LANG_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      currentLabel.textContent = parsed.text || 'English';
      options.forEach(opt => {
        if (opt.dataset.lang === parsed.lang) {
          opt.classList.add('text-black', 'font-bold');
        }
      });
    } catch (e) {}
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = !dropdown.classList.contains('invisible');
    dropdown.classList.toggle('opacity-0', isOpen);
    dropdown.classList.toggle('invisible', isOpen);
    dropdown.classList.toggle('translate-y-1', isOpen);
    btn.querySelector('.lang-caret').classList.toggle('rotate-180', !isOpen);
  });

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const lang = opt.dataset.lang;
      const text = opt.textContent.trim();
      currentLabel.textContent = text;
      options.forEach(o => o.classList.remove('text-black', 'font-bold'));
      opt.classList.add('text-black', 'font-bold');
      localStorage.setItem(LANG_KEY, JSON.stringify({ lang, text }));
      dropdown.classList.add('opacity-0', 'invisible', 'translate-y-1');
      btn.querySelector('.lang-caret').classList.remove('rotate-180');
    });
  });

  document.addEventListener('click', () => {
    if (!dropdown.classList.contains('invisible')) {
      dropdown.classList.add('opacity-0', 'invisible', 'translate-y-1');
      btn.querySelector('.lang-caret').classList.remove('rotate-180');
    }
  });
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
    
    // Path-based SPA navigation
    if (href.startsWith('/')) {
      e.preventDefault();
      closeMegaPanels();
      closeMobileDrawer();
      activeRecentlyViewed = false;
      navigateTo(href);
      return;
    }
    
    if (!href.startsWith('#')) return;
    
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
    if (['popular', 'launches', 'upcoming'].includes(section)) {
      renderViewAllPage(section);
      return;
    }
    if (section === 'brands') {
      renderViewAllBrandsPage();
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
  
  const btnViewAllNews = document.getElementById('btn-view-all-news');
  if (btnViewAllNews) {
    btnViewAllNews.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('/insights/latest-news');
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
  const bodySearchEl = document.getElementById('search-car-body');
  if (bodySearchEl) bodySearchEl.addEventListener('change', renderAllCarousels);
  
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
        const mappedId = id === 'news-1' ? 'in-news-1' : id === 'news-2' ? 'in-news-2' : 'in-news-3';
        navigateTo(`/insights/latest-news/${mappedId}`);
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
  
  const allBodyTypes = ['All','SUV','Sedan','Hatchback','MUV','Coupe','Convertible','Pickup','Luxury'];
  let bodyFilterOpts = allBodyTypes.map(t => `<option value="${t}">${t}</option>`).join('');
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
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
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4" id="viewall-cars-grid">
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

function renderViewAllBrandsPage() {
  const title = 'EV Brand Dictionary';
  const breadcrumbs = ['MANUFACTURERS', 'ALL BRANDS'];
  
  const brandNameMap = {
    'tata': 'Tata', 'mahindra': 'Mahindra', 'hyundai': 'Hyundai', 'mg': 'MG',
    'kia': 'Kia', 'byd': 'BYD', 'bmw': 'BMW', 'mercedes-benz': 'Mercedes-Benz',
    'volvo': 'Volvo', 'audi': 'Audi', 'maruti-suzuki': 'Maruti Suzuki',
    'toyota': 'Toyota', 'honda': 'Honda', 'skoda': 'Skoda',
    'volkswagen': 'Volkswagen', 'renault': 'Renault', 'nissan': 'Nissan',
    'citroen': 'Citroën', 'jeep': 'Jeep', 'force-motors': 'Force Motors',
    'isuzu': 'Isuzu', 'porsche': 'Porsche', 'vinfast': 'VinFast',
    'tesla': 'Tesla',
    'jaguar': 'Jaguar',
    'range-rover': 'Range Rover',
    'lexus': 'Lexus',
    'ferrari': 'Ferrari',
    'lamborghini': 'Lamborghini'
  };
  
  let brandsHtml = '';
  Object.keys(brandNameMap).forEach(brandId => {
    const brandName = brandNameMap[brandId];
    const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
    const count = brandCars.length;
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

// --- INSIGHTS RENDERING FUNCTIONS ---
function renderInsightCategoryPage(categoryKey) {
  const catInfo = INSIGHTS_CATEGORIES.find(c => c.key === categoryKey) || { key: categoryKey, label: categoryKey.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), icon: '📄', desc: '' };
  const title = catInfo.label;
  const breadcrumbs = ['INSIGHTS', title];
  const articles = INSIGHTS_DATABASE[categoryKey] || [];

  let articlesHtml = '';
  articles.forEach(article => {
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

function renderAllBlogsPage() {
  const title = 'Blogs';
  const breadcrumbs = ['BLOGS'];
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6">
      <div>
        <span class="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">INSIGHTS / ${BLOG_DATABASE.length} ARTICLES</span>
        <h2 class="text-2xl md:text-3xl font-extrabold tracking-tight text-black mt-1">EV Blogs</h2>
        <p class="text-xs text-zinc-500 font-mono mt-1">In-depth articles, stories, and perspectives from the EV world.</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        ${BLOG_DATABASE.map(blog => `
          <a href="/blog/${blog.slug}" class="border border-zinc-200 bg-zinc-50 hover:border-black hover:bg-white hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all p-6 flex flex-col gap-3 group rounded-xl" style="border-radius:18px">
            <div>
              <h3 class="font-mono text-xs font-bold uppercase tracking-wider text-zinc-800 group-hover:text-black">${blog.title}</h3>
              <p class="font-mono text-[9px] text-zinc-500 mt-0.5">${blog.excerpt}</p>
              <span class="font-mono text-[8px] text-zinc-400 mt-1 block">${blog.date} · ${blog.author}</span>
            </div>
          </a>
        `).join('')}
      </div>
    </div>
  `;
  renderSubpage(title, breadcrumbs, contentHtml, '/');
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
  const learnOrder = ['regenerative-braking', 'lfp-vs-nmc', 'ac-vs-dc', 'v2l', 'ground-clearance', 'battery-health', 'charging-etiquette', 'highway-charging'];
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

  // Related articles (2 before and after in order, excluding current)
  const relatedSlugs = [];
  for (let i = 0; i < learnOrder.length && relatedSlugs.length < 4; i++) {
    if (learnOrder[i] !== slug) relatedSlugs.push(learnOrder[i]);
  }

  const breadcrumbs = ['LEARN', article.title];
  const contentHtml = `
    <div class="flex flex-col gap-6 pt-6 max-w-3xl mx-auto">
      <!-- Breadcrumb -->
      <a href="/#knowledge-hub" class="font-mono text-[9px] text-zinc-500 hover:text-black uppercase tracking-wider flex items-center gap-1 transition-colors">← Back to Learn Electric Vehicles</a>

      <!-- Hero / Image Placeholder -->
      <div class="w-full h-48 md:h-64 bg-gradient-to-br from-zinc-100 via-zinc-50 to-white border border-zinc-200 rounded-xl flex items-center justify-center overflow-hidden">
        <div class="text-center">
          <span class="text-5xl opacity-20 block">⚡</span>
          <span class="font-mono text-[8px] text-zinc-300 uppercase tracking-widest mt-2 block">${article.title}</span>
        </div>
      </div>

      <!-- Title & Intro -->
      <div>
        <span class="font-mono text-[8px] text-zinc-400 uppercase tracking-widest block mb-1">LEARN / ${article.title}</span>
        <h1 class="text-2xl md:text-4xl font-black tracking-tight text-black leading-tight">${article.title}</h1>
        <p class="text-xs text-zinc-500 font-mono mt-2 leading-relaxed">${keyPoints.length > 0 ? keyPoints.slice(0, 2).join(' — ') : 'Detailed educational content about ' + article.title + '.'}</p>
      </div>

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
}

// --- Login Page ---
function renderLoginPage() {
  const contentHtml = `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">
      <div class="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-zinc-200 bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.06)]">
        <!-- Left: Image -->
        <div class="hidden md:block relative min-h-[500px] overflow-hidden">
          <img src="login_illustration.png" alt="EV Car Wale" class="w-full h-full absolute inset-0 object-cover">
        </div>
        <!-- Right: Form -->
        <div class="p-8 md:p-12 flex flex-col justify-center">
          <div class="max-w-sm mx-auto w-full">
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
  renderSubpage('Login', ['LOGIN'], contentHtml, '/');
  setupLoginForm();
}

function renderSignupPage() {
  const contentHtml = `
    <div class="min-h-screen flex items-center justify-center px-6 py-12">
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
            <button type="button" class="w-full py-3 border border-zinc-200 rounded-xl font-mono text-[10px] text-zinc-700 hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2">
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
      showLoggedInUI();
      navigateTo('/');
    }
  });

  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showLoggedInUI();
      navigateTo('/');
    });
  }
}

function showLoggedInUI() {
  const loginBtn = document.getElementById('login-nav-btn');
  const profileContainer = document.getElementById('profile-container');
  const loginBtnMobile = document.getElementById('login-nav-btn-mobile');
  const profileContainerMobile = document.getElementById('profile-container-mobile');

  if (loginBtn) loginBtn.classList.add('hidden');
  if (profileContainer) profileContainer.classList.remove('hidden');
  if (loginBtnMobile) loginBtnMobile.classList.add('hidden');
  if (profileContainerMobile) profileContainerMobile.classList.remove('hidden');
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
      navigateTo('/learn/' + guideId);
    });
  });
  
  // 2. Bind Section 6 Knowledge Hub cards
  document.querySelectorAll('.btn-open-hub').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const hubKey = card.getAttribute('data-hub-key');
      navigateTo('/learn/' + hubKey);
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
    'vinfast': 'VinFast',
    'tesla': 'Tesla',
    'jaguar': 'Jaguar',
   'range-rover': 'Range Rover',
   'lexus': 'Lexus',
  };

  const brandName = brandNameMap[brandId.toLowerCase()] || brandId.toUpperCase();
  const breadcrumbs = ['MANUFACTURERS', brandName];
  
  let searchQuery = '';
  let sortBy = 'name-asc';
  let typeFilter = 'all';

  function generateBrandContentHtml() {
    const brandCars = EV_DATABASE.filter(car => car.brand.toLowerCase() === brandId.toLowerCase());
    const logoUrl = getBrandLogoUrl(brandId);
    const initials = getBrandInitials(brandName);
    
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
