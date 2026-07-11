# EVcarwale Database Map & Data Schema

EVcarwale maintains no server-side databases. All collections, tables, state configurations, and constants reside in-memory as JavaScript structures within `app.js`, with limited local persistence handled via the browser's `localStorage` API.

---

## 1. In-Memory Static Databases

### A. Global EV Fleet Database (`EV_DATABASE`)
An array of objects representing the catalog of electric vehicles in India.

#### Core Schema Definition (as defined in code):
* `id` (string, unique key, e.g. `'punch-ev'`)
* `name` (string, display name)
* `brand` (string, lower-case identifier, e.g. `'tata'`)
* `priceVal` (number, base ex-showroom cost in Lakhs, e.g. `10.99`)
* `price` (string, formatted display price, e.g. `'₹10.99 Lakh'`)
* `rangeVal` (number, claimed range in km, e.g. `421`)
* `range` (string, formatted range, e.g. `'421 km'`)
* `battery` (string, battery capacity, e.g. `'35 kWh'`)
* `charging` (string, DC fast charge speed summary, e.g. `'56 min (DC)'`)
* `speed` (string, top speed rating, e.g. `'140 km/h'`)
* `power` (string, electric motor output, e.g. `'122 hp'`)
* `safety` (string, NCAP rating details, e.g. `'5 Stars (BNCAP)'`)
* `features` (string, highlight list of features, e.g. `'Electronic parking brake, Sunroof'`)
* `dimensions` (string, dimensions in mm, e.g. `'3827 x 1742 x 1615 mm'`)
* `image` (string, local filename under workspace, e.g. `'tata_punch_ev.jpg'`)
* `sections` (array of strings, landing page tabs where it appears, e.g. `['popular', 'launches']`)
* `launchDate` (string, optional, date or delta, e.g. `'2 Days Ago'`)

#### Dynamic Enrichment Schema (Injected on-load by `enrichDatabase()`):
* `variants` (array of 3 objects representing price trims: `'Executive Core'`, `'Empowered Luxury'`, `'Performance Flagship'`)
  * Each variant has fields: `name`, `price`, `priceVal`, `battery`, `range`, `charging`, `power`, `speed`, `drivetrain` (`'FWD'` | `'RWD'` | `'AWD'`).
* `torque` (string, fallback default `'250 Nm'` or `'350 Nm'`)
* `chargingAC` (string, fallback default `'7.5 hours (7.2 kW AC)'`)
* `clearance` (string, fallback `'190 mm'` for Indian SUVs, else `'150 mm'`)
* `bootSpace` (string, default `'380 Litres'`)
* `seating` (string, default `'5 Seater'`)
* `warranty` (string, default `'8 Years / 1,60,000 km'`)
* `featuresList` (object containing category string arrays: `exterior`, `interior`, `safety`, `infotainment`, `adas`, `comfort`)
* `expertReview` (object with fields: `rating` (e.g. `'4.5 / 5'`), `verdict`, `pros` (array), `cons` (array))
* `customerReviews` (array of objects: `{ author, duration, score, feedback }`)

---

### B. State Tax & EV Policy Database (`STATE_TAX_DATABASE`)
An object mapping 12 Indian regions to their registration taxes and subsidies.

#### Schema Definition:
* `label` (string, display name, e.g. `'Delhi'`)
* `roadTaxPct` (number, percentage multiplier for road tax, e.g. `0` for waivers or `0.06` for Tamil Nadu)
* `regCharge` (number, flat registration charge in Rupees, e.g. `4000`)
* `evIncentivePct` (number, subsidy percentage multiplier)
* `evIncentiveFlat` (number, flat state incentive subsidy, e.g. `20000` for Gujarat)
* `evBenefitNote` (string, explanatory summary of concessions)

---

### C. Corridor Distance Database (`CITY_DISTANCE_DATABASE`)
An object mapping alphabetical city-pair keys (e.g., `'ahmedabad-delhi'`) to distance data.

#### Schema Definition:
* `distanceKm` (number, highway distance)
* `driveTimeHours` (number, average road travel time)

---

### D. Corridor Chargers Database (`ROUTE_STATIONS`)
An object mapping city-pair keys to arrays of recommended charger stops.

#### Schema Definition:
* Array of charging station details: `{ city, chargerType, network }`
* Example: `{ city: 'Jaipur', chargerType: 'DC 60 kW', network: 'Tata Power EV' }`

---

### E. Knowledge Bases

#### `NEWS_DATABASE`
* Array of objects: `{ id, topic, date, title, summary, content }`

#### `GUIDE_DATABASE`
* Array of objects: `{ id, chapter, title, summary, content, diagram (inline SVG text), terms (array of objects: { name, explanation, why, example }) }`

#### `GUIDE_DETAILS_EXTENDED`
* Structured key-value database mapping guide and hub slug IDs to their detailed features, benefits, chronological step-by-step instructions, FAQs, and article recommendations. Used to dynamically build comprehensive detailed resource views.

#### `hubExplanations`
* Key-value dictionary matching slug keys to article summaries: `{ title, explanation, analogy }`

#### `JARGON_DICTIONARY`
* Key-value glossary mapping abbreviations to simple definitions (e.g., `'V2L'` to definition).

#### `SUPPORTED_BRANDS`
* Array of brand configurations: `{ id, name, origin }` (covers 21 national-presence manufacturers, e.g. Tata, BYD).

#### `INTERNATIONAL_BRANDS`
* Array of international brand configurations: `{ id, name, origin }` (covers 33 global manufacturers, e.g. Tesla, Porsche).

#### `brandNameMap`
* Key-value mapping matching lower-case brand IDs to official presentation display names. Added `'maruti-suzuki'` display name mapping.

---

## 2. Browser Storage & Persistence Buffers

### A. LocalStorage (`recently_viewed_evs`)
- **Format**: JSON serialized array of strings containing vehicle IDs.
- **Limit**: Max 6 unique items.
- **Data flow**: Appended when a user triggers `renderCarDetailsPage()`.
- **Purpose**: Displays a filtered "Recently Viewed" collection in the landing page carrousel when selected in navigation.

---

## 3. Session-Only State (In-Memory)

### A. Wishlist IDs (`wishlistIds`)
- **Format**: Standard Javascript Array of strings: `let wishlistIds = [];`
- **Mutated by**: `toggleWishlist(carId)` (adds or deletes ID elements).
- **Scope**: Session-only. **WARNING**: Wishlisted items are lost upon browser tab reload (not persisted to `localStorage` despite pre-existing system notes).
- **UI Element**: `#wishlist-badge` displaying the item count.
