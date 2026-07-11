# EVcarwale Internal API & Function Map

All business logic, routing transitions, and math equations are executed client-side inside `app.js`. Below is a comprehensive functional inventory of internal APIs.

---

## 1. Mathematical Calculation Engines

### `getOnRoadPriceData(exShowroomLakh, stateKey)`
- **Input**: `exShowroomLakh` (number, price in Lakhs), `stateKey` (string, e.g. `'delhi'`)
- **Output**: Object or `null`
  ```javascript
  { exShowroom, roadTax, regCharge, insurance, handling, evBenefit, onRoad, evBenefitNote, stateLabel }
  ```
- **Formulas**:
  - `roadTax = exShowroom * state.roadTaxPct`
  - `insurance = exShowroom * 0.025` (2.5% premium rate)
  - `evBenefit = state.evIncentiveFlat + (exShowroom * state.evIncentivePct)`
  - `onRoad = exShowroom + roadTax + regCharge + insurance + handling - evBenefit`

---

### `calcTripData(carId, fromKey, toKey, days, passengers, acUsage, drivingStyle)`
- **Input**:
  - `carId` (string, e.g. `'punch-ev'`)
  - `fromKey` / `toKey` (strings, e.g. `'delhi'`, `'mumbai'`)
  - `days` (number of rental/trip days)
  - `passengers` (number of passengers, 1 to 5)
  - `acUsage` (string: `'off'`, `'low'`, `'medium'`, `'high'`)
  - `drivingStyle` (string: `'eco'`, `'normal'`, `'sport'`)
- **Output**: Object or `null` containing comprehensive trip stats (real range, charging stations, DC speed, cost, petrol baseline, carbon offsets, charging times).
- **Core Math / Coefficients**:
  - **AC Discount**: `off = 1.00`, `low = 0.97`, `medium = 0.93`, `high = 0.88`
  - **Style Factor**: `eco = 1.05`, `normal = 1.00`, `sport = 0.88`
  - **Passenger Load Factor**: `1-2 = 1.00`, `3 = 0.99`, `4 = 0.97`, `5 = 0.95`, `>5 = 0.93`
  - **Real World Range**: `realRange = claimedRange * acFactor * styleFactor * paxFactor`
  - **Charging Stops**: `Stops = Math.max(0, Math.ceil(distance / (realRange * 0.85)) - 1)`
  - **Electricity Cost**: `evCost = (distance / (claimedRange / batteryKWh)) * electricityTariff`
  - **Petrol Cost**: `petrolCost = (distance / 15) * petrolPrice` (Baseline 15 km/l)
  - **Carbon Offset**: `carbonSaved = distance * 0.12` kg of CO2 (assuming baseline 120g CO2/km)

---

### `updateEMICalculator()`
- **Input**: Reads values directly from DOM sliders: `#slider-price`, `#slider-down`, `#slider-rate`, `#slider-tenure`.
- **Output**: Void. Updates DOM nodes directly.
- **Formula**:
  - `loanAmt = price - downPayment`
  - `monthlyRate = (annualRate / 12) / 100`
  - `months = tenureYears * 12`
  - `EMI = loanAmt * monthlyRate * (1 + monthlyRate)^months / ((1 + monthlyRate)^months - 1)`

---

### `updateLandingSavings()`
- **Input**: Reads values from DOM elements: `#slider-savings-distance`, `#slider-savings-petrol-price`, `#slider-savings-tariff`, `#slider-savings-period`, `#savings-select-ev`.
- **Output**: Void.
- **Formula**:
  - `monthlyDist = dailyDistance * 30`
  - `monthlyPetrolCost = (monthlyDist / 15) * petrolPrice` (assumed 15 km/l ICE mileage)
  - `efficiency = batteryKWh / rangeKm` (calculated from selected EV spec)
  - `monthlyEvCost = monthlyDist * efficiency * electricityTariff`
  - `monthlySavings = monthlyPetrolCost - monthlyEvCost`
  - `totalSavings = monthlySavings * 12 * periodYears`

---

### `getHighwayReadinessData(car)`
- **Input**: `car` object (from database)
- **Output**: Object
  ```javascript
  { category, badgeColor, icon, maxSpeed, time1080, recommendation }
  ```
- **Rules**:
  - Extracts DC charging duration from the `car.charging` string (e.g. `56 min (DC)` -> `56`).
  - **Highway Ready**: DC time $\le 30$ mins. Rated for $100\text{ kW}-350\text{ kW}$ chargers.
  - **Mixed Use**: DC time between $31$ and $50$ mins. Rated for $50\text{ kW}-80\text{ kW}$ chargers.
  - **City Commuter**: DC time $> 50$ mins. Rated for $25\text{ kW}-30\text{ kW}$ chargers.

---

## 2. Document Generators & Text Parsers

### `downloadRWAPdf(carName)`
- **Input**: `carName` (string)
- **Output**: Prompts file save of `RWA_EV_Charger_Request_[carName].pdf`.
- **Logic**: Instantiates `window.jspdf.jsPDF`, writes standard legal formatting, society contact blocks, safety assurances, and draws input lines for the resident's signature.

---

### `applyJargonBuster()`
- **Input**: Scans body DOM text nodes using `document.createTreeWalker` with text-node filtering.
- **Output**: Void. Replaces plain text with active tooltips.
- **Logic**: Replaces dictionary terms with `<span class="jargon-term" data-tooltip="...">` and binds click/hover expand animations.

---

## 3. SPA Routing & State Dispatchers

- **`handleRouting()`**: Matches current hash and pathname to route rules, calls specific view renderers, and updates nav links.
- **`navigateTo(url)`**: Updates `window.location.hash` programmatically and triggers page transitions.
- **`restoreHomepage()`**: Hides subpages, displays landing page sections, and triggers carousel renders.

---

## 4. UI Rendering Template Functions

- **`renderCarDetailsPage(car)`**: Populates the details page markup. Binds tabs, detail calculators, local savings sliders, and RWA NOC download events.
- **`renderViewAllPage(section)`**: Renders grids for `'popular'`, `'launches'`, or `'upcoming'` cars.
- **`renderAllNewsPage()`**: Compiles all news cards from the array database.
- **`renderNewsArticlePage(article)`**: Renders a dedicated article template for reading a selected item.
- **`renderGuideArticlePage(chapter)`**: Displays buying guide chapters along with SVG inline diagrams.
- **`renderHubArticlePage(key)`**: Compiles details, pros/cons, and custom FAQ templates for Knowledge Hub topics.
- **`renderBrandsPage()`**: Renders the EV Brands Directory. In non-search mode, displays a grid of Supported Brands (cards with logos) and a list of 33 International Brands (pills). In search mode, displays a matching vehicles grid using the vehicle card design. Binds keydown (Enter) and submit search/reset buttons.
- **`renderBrandPage(brandId)`**: Renders a dedicated brand detail page showing available and upcoming models from a specific brand. Displays an API placeholder if no vehicle data exists. Missing logos are handled with clean typography.
- **`renderExpertReviewsPage()`** / `renderCustomerReviewsPage()`: Compiles pros/cons list tables and user satisfaction feedback.

---

## 5. Database Abstraction Service

### `BrandDataService`
- **`async getVehiclesByBrand(brandId)`**:
  - **Input**: `brandId` (string, e.g. `'byd'`, `'tesla'`)
  - **Output**: Array of vehicle objects matching the brand from `EV_DATABASE`.
- **`getBrandInfo(brandId)`**:
  - **Input**: `brandId` (string)
  - **Output**: Object containing the brand id, mapped display name, and local logo URL.
