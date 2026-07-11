# Project Memory & Codebase Intelligence: EVcarwale

This document serves as the permanent brain of the EVcarwale project. It contains comprehensive operational and architectural details, allowing any engineer to immediately understand the system's design, workflows, data models, and constraints.

---

## 1. Project Overview & Business Purpose

### Business Problem Solved
Indian consumers looking to transition to Electric Vehicles (EVs) face significant informational barriers, including range anxiety, opaque pricing models, confusion about charging infrastructure, and doubts regarding home charging installations. 

**EVcarwale** addresses this by providing a unified client-side digital showroom, complete with interactive calculators that estimate real-world range, compute petrol vs. EV savings, and provide pre-filled installation permissions for apartment blocks (RWAs).

### User Workflow
1. **Landing & Search**: User filters the car catalog by brand, budget, or name search.
2. **Analysis / Tools**: User interacts with the Trip Route Planner, EMI Calculator, and Petrol Savings Calculator.
3. **Deep Dive (Details Page)**: User selects a vehicle card to view details (variants, specifications, ground clearance explainers, and lab reviews).
4. **Action (NOC Request / Drive Booking)**: User downloads a customized Society permission letter or triggers a Test Drive reservation modal.

---

## 2. Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Core Architecture** | Vanilla HTML5, Vanilla ES6 JavaScript | Zero-build, client-side SPA executing entirely in the user's browser. |
| **Styling Framework** | Tailwind CSS (Play CDN) & Vanilla CSS | Tailwind handles layouts and utility styles. [style.css](file:///Users/tanisha/Documents/EVcarwale/style.css) defines custom grayscale theme tokens, selections, card hover lifts, and divider transitions. |
| **PDF Generation** | jsPDF (CDN) | Dynamically loaded from `window.jspdf` at runtime to generate RWA NOC request letters. |
| **Typography** | Google Fonts | Web fonts loaded dynamically: Plus Jakarta Sans, Inter, and Manrope. |
| **Hosting & Deployment** | Vercel | Configured via local configurations in `.vercel` for static site routing. |

---

## 3. Repository Structure

```
EVcarwale/
├── .gitignore                      # Git ignore file
├── .vercel/                        # Local Vercel caching configurations
├── index.html                      # Single page host, header, footer, and overlay modals
├── style.css                       # Grayscale design tokens and custom animations
├── app.js                          # Core script, local databases, routers, and math engines
├── LOGOS/                          # Brand logo image files (Tata, BYD, MG, Hyundai, etc.)
├── EV_BUYING_GUIDE/                # Image resources for buying guides (Tech, Subsidies, Costs)
├── everything_u_need/              # Additional guide support images (Apartment Charging, slow vs fast)
├── project-brain/                  # Internal directories representing past project configurations
│   ├── memory/                     # Documentation maps (Overview, architecture, frontend)
│   ├── standards/                  # Project conventions (naming, performance, security)
│   ├── tasks/                      # Project task checklists and change history logs
│   ├── graph/                      # JSON graph mapping node file types and edges
│   └── reviews/                    # Past architectural review logs
├── BYD_atto.jpeg                   # Vehicle slideshow images
├── Citroen_eC3.jpeg
├── Hyundai_IONIQ6.jpeg
└── ... (Other vehicle images)
```

---

## 4. System Architecture

The application operates as a **client-side Single Page Application (SPA)** with no API backend. 

```
Browser Hash Change ➔ SPA Router (handleRouting) ➔ View Compile ➔ HTML Injection ➔ Event Listener Re-binding
```

All specifications, states, and parameters reside in local array databases in `app.js`. View transition scripts clear the main details wrapper `#details-page-content` or hide the homepage content wrapper `#homepage-content` dynamically based on route matching.

---

## 5. Routing Map

URL route parsing intercepts both URL pathname prefix changes and hash prefixes (`hashchange` listener) to run `handleRouting()`.

| Route Pathway | Target Controller | View Output |
| :--- | :--- | :--- |
| `#/` | `restoreHomepage()` | Homepage (Header Hero search, calculators, car lists, news, reviews). |
| `#/cars/:id` | `renderCarDetailsPage(car)` | Individual vehicle page (spec table, range/savings tool, reviews). |
| `#/view-all/:section` | `renderViewAllPage(section)` | Grid catalog filtering for `'popular'`, `'launches'`, or `'upcoming'`. |
| `#/news/all` | `renderAllNewsPage()` | Comprehensive listing of industry updates. |
| `#/news/:id` | `renderNewsArticlePage(article)` | Full read article view for a news item. |
| `#/guide/:id` | `renderGuideArticlePage(chapter)` | Educational chapters with inline SVG schematics. |
| `#/hub/:key` | `renderHubArticlePage(key)` | FAQ panels for concepts like Regenerative Braking and V2L. |
| `#/reviews/expert` | `renderExpertReviewsPage()` | Table displaying expert drive reviews, ratings, pros, and cons. |
| `#/reviews/customer` | `renderCustomerReviewsPage()` | Owner feedback logs and ratings. |
| `#/brands` | `renderBrandsPage()` | Interactive directory showing Supported Brands (grid) and 33 International Brands (pills), switching to matching vehicles grid upon filter search execution. |
| `#/brand/:brandId` | `renderBrandPage(brandId)` | Dedicated brand archive rendering vehicles with Seating and Body Type specs, or an API placeholder message if no vehicles exist. |

---

## 6. Frontend Architecture & Design Rules

### A. Grayscale Design System:
All accent highlights are restricted to charcoal `#111111`, solid black, pure white, and grays. Section transitions are smoothed using custom scroll dividers that fade from transparent to soft charcoal (height `40-60px`, blur `20-30px`) and back.

### B. Dynamic View Lifecycle:
Every subpage view compiles a string template containing HTML and variables, injects it into the DOM, and executes post-render scripts to:
1. Re-bind click handlers to inputs, sliders, and navigation links.
2. Initialize observers (IntersectionObservers for scroll reveals).
3. Execute `applyJargonBuster()` to scanner-wrap EV terms in tooltips.

---

## 7. Backend & Database Architecture

### A. No API Backend:
There is no server-side execution environment or database server (like SQL or Mongo). All details are stored inside constants inside `app.js`.

### B. In-Memory Collections:
1. **`EV_DATABASE`**: Car definitions (battery capacities, safety scores, prices, torque, warranties, variants).
2. **`STATE_TAX_DATABASE`**: Subsidies, registration charges, and road tax coefficients for 12 Indian regions.
3. **`CITY_DISTANCE_DATABASE`**: Highway mileage distances and average driving times between city pairs.
4. **`ROUTE_STATIONS`**: Charger stops (e.g. Solapur DC, Vellore CCS2) for long-distance routes.
5. **`NEWS_DATABASE`** & **`GUIDE_DATABASE`**: Lists of updates and guide chapters.
6. **`GUIDE_DETAILS_EXTENDED`**: Extended guide features, benefits, chronological steps, recommendations, and FAQs mapping metadata.

### C. Database Abstraction Layer:
- **`BrandDataService`**: Encapsulates all query tasks for manufacturers and vehicles (`getVehiclesByBrand(brandId)`, `getBrandInfo(brandId)`). By routing all brand vehicle rendering queries through this service rather than direct `EV_DATABASE` filters, the application remains decouplable and prepared to swap in direct CarsXE API integrations without template redesigns.

### D. Persistent Storage:
- **`localStorage.getItem('recently_viewed_evs')`**: A JSON string array storing up to 6 unique recently visited car IDs.

---

## 8. Authentication & Session Flow

The project currently contains **no functional authentication system**. 
- Placeholder LOGIN CTA buttons reside in the navigation bar (`#login-nav-btn`) and the mobile menu drawer (`#login-nav-btn-mobile`).
- These buttons are purely visual. They are not bound to any state machine or authentication listener in `app.js`.

---

## 9. Feature Inventory & Calculator Math

### A. Real-World Range Estimator
Calibrates claimed laboratory range using real-world traffic, AC, weather, passengers, and driving styles.
* **AC Coefficients**: Off: `1.00`, Low: `0.97`, Medium: `0.93`, High: `0.88`
* **Driving Style**: Eco: `1.05`, Normal: `1.00`, Aggressive/Sport: `0.88` (or `0.80` on detail view)
* **Passenger Load**: 1 pax: `1.00`, 2-3 pax: `0.96`, Full load: `0.90`
* **Weather**: Cool: `1.00`, Normal: `1.00`, Hot: `0.85`
* **Traffic**: Light: `1.00`, Moderate: `0.90`, Heavy: `0.75`
* **Equation**:
  $$\text{Real Range} = \text{Claimed Range} \times \text{TrafficCoef} \times \text{ACCoef} \times \text{StyleCoef} \times \text{WeatherCoef} \times \text{PaxCoef}$$

### B. Petrol vs EV Savings Calculator
Compares daily fuel expenditures against EV electricity consumption over years.
* Assumes a baseline petrol vehicle fuel efficiency of **15 km/l**.
* EV consumption calculated dynamically as:
  $$\text{EV Efficiency (kWh/km)} = \frac{\text{Battery Capacity (kWh)}}{\text{Claimed Range (km)}}$$
* **Equation**:
  $$\text{Monthly Savings} = \left(\frac{\text{Monthly Distance}}{15} \times \text{Petrol Price}\right) - \left(\text{Monthly Distance} \times \text{EV Efficiency} \times \text{Tariff}\right)$$

### C. Trip Corridor Route Planner
Estimates travel duration, optimal charging stops, grid costs, and carbon offset statistics.
* Assumes starting with 100% battery.
* Targets charging stops to **85% State of Charge (SoC)** for fast-charging efficiency.
* **Leg Range** is computed as:
  $$\text{Leg Range} = \text{Real Range} \times 0.85$$
* **Stops Required**:
  $$\text{Stops} = \max\left(0, \left\lceil \frac{\text{Total Distance}}{\text{Leg Range}} \right\rceil - 1\right)$$

### D. EMI Calculator
EMI calculations are based on standard loan amortization:
$$\text{EMI} = P \times r \times \frac{(1 + r)^n}{(1 + r)^n - 1}$$
Where $P = \text{Price} - \text{Down Payment}$, $r = \frac{\text{Annual Interest Rate}}{12 \times 100}$, and $n = \text{Tenure Years} \times 12$.

### E. Apartment NOC PDF Generator
Loads `jsPDF` asynchronously, fills out structural details for an RWA (Resident Welfare Association) No Objection Certificate template, matches the applicant's vehicle name, and triggers a local file download.

---

## 10. Technical Debt & Known Risks

1. **Wishlist Persistence Bug**: 
   While documentation notes indicate that wishlisted vehicle IDs are persisted in browser `localStorage`, `wishlistIds` is initialized as a simple in-memory session array (`let wishlistIds = [];` on line 1193) and is never read from or written to `localStorage`. Toggling the wishlist is transient and is lost upon page reload.
2. **Zero-Build Scale Issues**:
   The entire application database and UI layout code is compiled in a single 6,000-line script file ([app.js](file:///Users/tanisha/Documents/EVcarwale/app.js)). As more vehicles, news articles, and guides are added, this file will grow, degrading page speed performance.
3. **No Code Splitting**:
   All dynamic page layouts are compiled as raw string templates in JavaScript. This bypasses static IDE checking and syntax coloring, raising the risk of unclosed HTML tags.
4. **Third Party CDN Outages**:
   The app is dependent on external CDN files (Tailwind Play CDN, Google Fonts, and jsPDF). If any of these CDN links go down or are blocked, the styling, typography, or PDF generation of the website will break immediately.

---

## 11. Future Recommendations

1. **Refactor into Modules**: Split `app.js` into separate files: `database.js` (fleet data), `calculators.js` (math models), `router.js` (SPA controller), and `templates.js` (HTML markup builders).
2. **Wishlist localStorage Sync**: Fix the session wishlist bug by reading from and writing `wishlistIds` to `localStorage` inside `toggleWishlist()`.
3. **Tailwind compilation build**: Replace the Play CDN script with a build step compiler (such as Vite or PostCSS) to bundle production CSS, lowering client load times.
4. **Self-Host jsPDF**: Bundle or download the jsPDF library locally under the repository to avoid runtime network dependencies on third-party CDNs.
