# EVcarwale Codebase Dependency Graph

The project utilizes a zero-build pipeline. Connections are established directly at the browser level through HTML scripts, style link tags, and Javascript DOM selection.

---

## 1. Modular Relationships (Mermaid Graph)

```mermaid
graph TD
    %% Base Entry Point
    index.html[index.html: Entry Host]

    %% Stylesheet relationships
    subgraph Styling Layer
        index.html -->|Links Tag| style.css[style.css: Grayscale design system]
        index.html -->|Script Tag| Tailwind[Tailwind CSS Play CDN]
        Tailwind -.->|Applies utility rules to| index.html
    end

    %% Javascript relationships
    subgraph Execution & Data Layer
        index.html -->|Script Tag| app.js[app.js: Core database & driver]
        app.js -->|Mutates / Reads DOM| index.html
    end

    %% External libraries
    subgraph External Dependencies
        index.html -->|Script Tag| jsPDF[jsPDF CDN: Document generator]
        app.js -->|Calls window.jspdf| jsPDF
    end

    %% Styling linkages
    style.css -.->|Provides custom animations & layouts for| index.html
    style.css -.->|Provides transitions for dynamic cards injected by| app.js
    
    style index.html fill:#fffde7,stroke:#fbc02d,stroke-width:1.5px;
    style app.js fill:#e3f2fd,stroke:#1e88e5,stroke-width:1.5px;
    style style.css fill:#eceff1,stroke:#546e7a,stroke-width:1.5px;
```

---

## 2. Core Dependency Specifications

### A. Host File (`index.html`) Dependencies:
- **`style.css`** (Internal Link): Loaded via `<link rel="stylesheet" href="style.css">` on line 38. Sets up initial grayscale design system overrides.
- **Tailwind Play CDN** (External Script): Loaded via `<script src="https://cdn.tailwindcss.com"></script>` on line 15. Performs runtime compilation of utility classes.
- **jsPDF Library** (External Script): Loaded via `<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>` on line 17. Exposes `window.jspdf` for document downloads.
- **Google Fonts Link**: Loads Plus Jakarta Sans, Inter, and Manrope fonts.
- **`app.js`** (Internal Script): Loaded at the very bottom on line 2534 to prevent blocking layout renders.

### B. Controller File (`app.js`) Selector Dependencies:
The JavaScript file is heavily dependent on specific element IDs and class hooks defined inside `index.html`. Modifying these hooks inside the HTML will break corresponding features:

| Selector Key (ID / Class) | Type | Responsible System / Function | Result of Modification / Removal |
| :--- | :--- | :--- | :--- |
| `#homepage-content` | Div | `handleRouting()` / `restoreHomepage()` | SPA main landing page content will fail to show/hide. |
| `#details-page-content` | Div | `handleRouting()` / `renderCarDetailsPage()` | Vehicle details template injection will fail, breaking subpages. |
| `#preloader` / `#loader-progress` | Div | `runPreloader()` | Preloader screen will hang or show errors on page startup. |
| `#slider-price` / `#slider-down` | Slider | `updateEMICalculator()` | EMI repayments calculator will throw exceptions. |
| `#savings-select-ev` | Select | `updateLandingSavings()` | Landing savings calculator will fail to load EV efficiency rates. |
| `.jargon-term` | Class | `applyJargonBuster()` | Custom EV definition hover tooltips will fail to bind. |
| `.variant-tab-btn` | Class | `renderCarDetailsPage()` | In-page variant trim pricing changes will not register. |

---

## 3. High Impact Files (Files to Modify with Caution)

### 1. [app.js](file:///Users/tanisha/Documents/EVcarwale/app.js) (Critical Impact)
Contains the entirety of the local databases, SPA routing pathways, calculation models, and DOM node binding callbacks. Changes in variable naming, route string schemas, or parameter keys will cause system-wide failures.

### 2. [index.html](file:///Users/tanisha/Documents/EVcarwale/index.html) (High Impact)
Houses structural nodes, navbar trigger targets, modal backdrops, and input sliders. Removing or renaming selectors will break Javascript selectors in `app.js`.

### 3. [style.css](file:///Users/tanisha/Documents/EVcarwale/style.css) (Medium Impact)
Contains design rules, transitions, and scrollbar layouts. Modifying this file will not break JavaScript execution, but can severely degrade the user experience and visual design.
