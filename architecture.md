# EVcarwale System Architecture

EVcarwale is architected as a lightweight, zero-build, serverless **client-side Single Page Application (SPA)**. It runs entirely inside the user's browser, utilizing vanilla HTML5, custom Grayscale CSS, Tailwind CSS (loaded via Play CDN), and vanilla JavaScript.

---

## Architectural Block Diagram

```mermaid
graph TD
    %% Browser & Routing
    subgraph Browser Context
        User([User Action]) -->|URL Hash Change| HashEngine[SPA Hash Routing Engine]
        HashEngine -->|Triggers| RouteDispatcher[handleRouting Controller]
    end

    %% Routing Dispatched Views
    subgraph SPA View Dispatcher
        RouteDispatcher -->|Default / Fallback| HomeView[restoreHomepage: Displays Landing Sections]
        RouteDispatcher -->|#/cars/:id| CarView[renderCarDetailsPage: Injects Details Page DOM]
        RouteDispatcher -->|#/guide/:id| GuideView[renderGuideArticlePage: Chapters & SVGs]
        RouteDispatcher -->|#/hub/:key| HubView[renderHubArticlePage: Detailed Tech FAQs]
        RouteDispatcher -->|#/news/all| NewsView[renderAllNewsPage: News List]
        RouteDispatcher -->|#/reviews/*| ReviewView[renderExpert/CustomerReviewsPage]
    end

    %% Databases and Local Files
    subgraph Codebase Modules
        HomeView & CarView & GuideView & HubView -->|Reads Specs/Rules| EV_DB[(EV_DATABASE app.js)]
        HomeView -->|Reads Distance / Route| Distance_DB[(CITY_DISTANCE_DATABASE app.js)]
        CarView -->|Reads Tax Rates| Tax_DB[(STATE_TAX_DATABASE app.js)]
    end

    %% DOM Injection & Post-Render Subsystems
    subgraph DOM Injection & Binding
        CarView & HomeView & GuideView & HubView -->|1. Inject HTML| MainDOM[details-page-content / homepage-content]
        MainDOM -->|2. Bind Listeners| EventBinder[attachCardEvents / Event Listeners]
        MainDOM -->|3. Scan Text Nodes| JargonBuster[applyJargonBuster: Dotted tooltips]
    end

    %% External CDNs
    subgraph External Libraries & Resources
        style.css[style.css: Grayscale Tokens & Animations] -->|Links| MainDOM
        TailwindCDN[Tailwind CSS Play CDN] -->|Compiles Utilities| MainDOM
        jsPDF[jsPDF CDN: window.jspdf] -->|Triggered by User| PDFGen[downloadRWAPdf: Local Letter PDF]
    end
    
    classDef file fill:#f9f9f9,stroke:#333,stroke-width:1px;
    classDef db fill:#e1f5fe,stroke:#0288d1,stroke-width:1px;
    class style.css,app.js,index.html file;
    class EV_DB,Distance_DB,Tax_DB db;
```

---

## Codebase Modules

The system is decoupled into three primary files:

1. **`index.html`** (Entrypoint Host):
   - Defines the initial HTML structure.
   - Contains placeholder structures, landing page containers (`#homepage-content`), and the subpage destination wrapper (`#details-page-content`).
   - Hosts global overlays (modals for Booking Test Drives, Search Overlay, Video Player, and the generic Information Reader log).
   - Loads Tailwind Play CDN, Google Fonts, and the jsPDF library.
2. **`style.css`** (Design System):
   - Restricts all UI accents to a premium grayscale theme (black, white, and grays).
   - Implements custom styling overrides: custom track scrollbars, selection coloring, skeleton loading shimmer animations (`skeleton-shimmer`), visual card lift states (`car-card`), range slider thumb overrides, and scroll-aligned section dividers.
3. **`app.js`** (Core Driver):
   - Central database repository, SPA router, template compilation engine, calculator compute engine, and dynamic event binder.

---

## Core Subsystems

### 1. Hash Routing Engine
Intercepts `DOMContentLoaded` and `hashchange` browser events. It executes `handleRouting()` which extracts the path name or location hash (e.g. `#/cars/nexon-ev`) to determine the active viewport. It updates the layout by showing/hiding parent DOM wrappers and resets the scroll offset to `(0, 0)`.

### 2. Dynamic Template Compilation & DOM Injection
Pages other than the landing page are compiled on-the-fly. Functions like `renderCarDetailsPage()` build HTML strings using vehicle data, inject them into `#details-page-content`, and then bind local UI handlers (e.g., variant toggles, calculation sliders, and modal buttons).

### 3. Jargon Buster Scanner
After any view update or routing transition, the application triggers `applyJargonBuster()`. This creates a DOM `TreeWalker` to scan all visible text nodes (excluding buttons, inputs, links, and navigations). It wraps matching EV keywords (like *V2L*, *kWh*, *ADAS*, *CCS2*) inside dotted-underline `<span>` tags. Clicking these elements reveals a dynamic scale-up tooltip with simplified everyday definitions.

### 4. Interactive Mathematical Compute Engines
Runs client-side calculations based on slider and select inputs:
- **On-Road Price Breakdowns**: Computes local state road taxes, dealer handling, registration charges, and incentives for 12 regions (e.g., Delhi road-tax waiver vs. Chennai 6% road-tax).
- **Petrol vs EV Savings**: Computes fuel consumption and charging costs over a period of years based on an assumed 15 km/l petrol baseline.
- **Trip Route Planning**: Computes optimal charging stops (to 85% SoC) based on city distances and the vehicle's DC charging performance, adjusting for AC usage, driving styles, and passenger weight.
- **EMI Repayment**: Calculates monthly installments using standard loan amortization.

### 5. Client-Side Document Generator
When a user clicks "Download RWA Letter (PDF)" from a vehicle details view, the app loads `jsPDF` asynchronously from `window.jspdf`, generates a structured Resident Welfare Association NOC request letter pre-populated with the target vehicle model, and prompts a browser file download.
