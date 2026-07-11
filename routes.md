# EVcarwale Client-Side Routes Map

Because EVcarwale is a serverless Single Page Application (SPA), all routing is managed on the client side. The routing engine intercepts hash change and DOM events, parses paths, and dynamically redraws the viewport container.

---

## Route Resolution Mechanics

1. **Routing triggers**:
   - `window.addEventListener('hashchange', handleRouting);`
   - `window.addEventListener('DOMContentLoaded', handleRouting);`
2. **Path parser**:
   - Matches the browser URL pathname or hash value.
   - Example: `window.location.hash` matching `#/cars/punch-ev`.
3. **Template rendering**:
   - Dispatches page template render functions.
   - Clears the details content wrapper `#details-page-content` or hides the landing structure `#homepage-content`.
   - Resets scroll position: `window.scrollTo(0, 0)`.

---

## SPA Routes Table

| Route / Hash Path | Controller Function | Purpose / View | Auth Required | Client Persistence / State |
| :--- | :--- | :--- | :--- | :--- |
| `#/` *(or empty / default)* | `restoreHomepage()` | Displays the central landing dashboard (Trip Planner, EV Gallery, Brands, EMI, Petrol Savings, News, Reviews grid). | **No** | Baseline states (selected filters, active calculations). |
| `#/cars/:id` | `renderCarDetailsPage(car)` | Opens the specifications, active variants, real-world range discounts, and RWA generator for a vehicle. | **No** | Appends `car.id` to `localStorage` key `recently_viewed_evs` (up to 6 items). |
| `#/view-all/:section` | `renderViewAllPage(section)` | Displays filtered grids of EVs. Section must be `'popular'`, `'launches'`, or `'upcoming'`. | **No** | Inline grid bindings. |
| `#/news/all` | `renderAllNewsPage()` | Lists all industry updates from `NEWS_DATABASE`. | **No** | Non-persistent array lookup. |
| `#/news/:id` | `renderNewsArticlePage(article)` | Opens the full read view of a selected news article. | **No** | URL-based parameter lookup. |
| `#/guide/:id` | `renderGuideArticlePage(chapter)` | Renders a specific chapter (e.g. `guide-1`) with interactive SVGs and technical term callouts. | **No** | Injected via `GUIDE_DATABASE` array. |
| `#/hub/:key` | `renderHubArticlePage(key)` | Renders detailed FAQ sheets for topics (e.g. `regen-braking`, `lfp-nmc`, `battery-health`). | **No** | Injected via `hubExplanations` object. |
| `#/reviews/expert` | `renderExpertReviewsPage()` | Displays professional vehicle assessments, pros/cons bullet points, and scores. | **No** | Mapped from `EV_DATABASE`. |
| `#/reviews/customer` | `renderCustomerReviewsPage()` | Displays user feedback cards, owner satisfaction scores, and ownership durations. | **No** | Mapped from `EV_DATABASE`. |
| `#/brands` | `renderBrandsPage()` | Shows a grid of all available automotive brand badges. | **No** | Brand logos listed in directory `LOGOS`. |
| `#/brand/:brandId` | `renderBrandPage(brandId)` | Opens a filtered subpage containing only vehicles belonging to the specified brand. | **No** | URL parameter mapping. |

---

## Route Fallback & Recovery

If a route parameter does not match any entry in the database (e.g., `#/cars/invalid-model` or `#/guide/invalid-chapter`), the router fails gracefully. It catches the mismatch and routes the user back to the primary landing page:

```javascript
// Fallback path in handleRouting()
restoreHomepage();
```
This hides `#details-page-content`, reveals `#homepage-content`, and resets navigation visual states.
