# Project Memory & Codebase Intelligence: EVcarwale

This document serves as the permanent brain of the EVcarwale project. It contains comprehensive operational and architectural details, allowing any engineer to immediately understand the system's design, workflows, data models, and constraints.

---

## 1. Project Overview & Business Purpose

### Business Problem Solved
Indian consumers looking to transition to Electric Vehicles (EVs) face significant informational barriers. These include range anxiety, opaque pricing models, confusion about charging infrastructure, and doubts regarding home charging installations (RWAs). 

**EVcarwale** addresses this by providing a unified client-side digital showroom, complete with interactive calculators that estimate real-world range, compute petrol vs. EV savings, and provide pre-filled installation permissions for apartment blocks (RWAs). It is supplemented by a Node.js + Express backend that provides persistent storage via Amazon DynamoDB, S3 file hosting, Firebase Authentication synchronization, YouTube reviews API cache, and currents API news aggregation.

### User Workflow
1. **Landing & Search**: User filters the car catalog by brand, budget, or name search.
2. **Analysis / Tools**: User interacts with the Trip Route Planner, EMI Calculator, Petrol Savings Calculator, and Live Charging Station Locator.
3. **Deep Dive (Details Page)**: User selects a vehicle card to view details (variants, specifications, ground clearance explainers, lab reviews, and image color galleries).
4. **Action (NOC Request / Drive Booking / Reviews)**: User downloads a customized Society permission letter, triggers a Test Drive reservation modal, signs up for newsletters, or adds custom reviews.
5. **AI Consultation**: User chats with the EV WALE AI bot to ask market and spec-related questions.

---

## 2. Tech Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Core** | Vanilla HTML5, Vanilla ES6 JavaScript | Zero-build, client-side SPA executing entirely in the user's browser. |
| **Styling Framework** | Tailwind CSS (Play CDN) & Vanilla CSS | Tailwind handles layouts and utility styles. [style.css](file:///Users/tanisha/Documents/EVcarwale/style.css) defines custom grayscale theme tokens, selections, card hover lifts, and skeleton shimmers. |
| **PDF Generation** | jsPDF (CDN) | Dynamically loaded from `window.jspdf` at runtime to generate RWA NOC request letters. |
| **Backend Framework**| Express (Node.js) | Standard MVC patterns mounted behind `/api`. The root Express application serves static assets and routes unmatched paths to `index.html`. |
| **Database & Cache** | Amazon DynamoDB & S3 | DynamoDB stores metadata for users, cars, brands, favourites, reviews, test drives, news subscription, and chat history. S3 hosts media. |
| **Authentication** | Firebase Admin SDK | Authenticates requests using Firebase ID Tokens passed via the Authorization header. |
| **External APIs** | Google Gemini, YouTube v3, CurrentsAPI | Gemini powers AI chat; CurrentsAPI fetches live EV news; YouTube API searches EV reviews. |
| **Hosting & Deploy** | Vercel | Serves the entire site serverlessly. All requests are routed through `/api/index.js` using `@vercel/node`. |

---

## 3. Repository Structure

```
EVcarwale/
├── .gitignore                      # Git ignore file
├── vercel.json                     # Vercel deployment routes and builds
├── index.html                      # Single page host, header, footer, and overlay modals
├── style.css                       # Grayscale design tokens and custom animations
├── app.js                          # Core frontend script, local databases, routers, and math engines
├── env.js                          # Frontend environment-matching helper (defaults for backend port)
├── firebase.js                     # Frontend Firebase initialization and Google Auth provider
├── aiService.js                    # Gemini API node implementation (called by Express backend)
├── blogsDatabase.js                # Static list of blogs used as fallback and CMS reference
├── api/                            # Vercel serverless function folder
│   ├── index.js                    # Serverless entry point routing all requests through Express createApp()
│   └── tata-vehicles.json          # Cached/Static vehicle metadata
├── LOGOS/                          # Brand logo image files (Tata, BYD, MG, Hyundai, etc.)
├── EV_BUYING_GUIDE/                # Image resources for buying guides
├── everything_u_need/              # Guide support images (Apartment Charging, Fast vs Slow)
├── blogs_images/                   # Blog media assets
├── public/                         # Public asset directory
│   ├── car_images/                 # Brand and model structured color catalog image assets
│   └── data/                       # Static JSON files (e.g. tata-vehicles.json)
├── project-brain/                  # Internal workspace cache (standards, metadata, reviews, tasks)
└── backend/                        # Node.js + Express backend service
    ├── README.md                   # Backend documentation summary
    ├── .env.example                # Example environment file configuration
    ├── .env                        # Local environment parameters (DynamoDB keys, Firebase IDs, etc.)
    └── src/
        ├── app.js                  # App factory setting up CORS, Express body parsing, static assets, and /api routes
        ├── server.js               # Development server listener entry point (port 8081)
        ├── config/                 # Configurations (aws.js, env.js, firebaseAdmin.js)
        ├── middleware/             # Express middlewares (auth.js, errorHandler.js, notFound.js, requestLogger.js)
        ├── utils/                  # Utility helpers (apiError.js, asyncHandler.js, dataState.js)
        ├── models/                 # Table specifications definitions (Car.js, User.js, Favourite.js, etc.)
        ├── repositories/           # DynamoDB database repository access layers (carRepository.js, leadRepository.js, etc.)
        ├── controllers/            # Request handlers (authController.js, carController.js, chatController.js, etc.)
        ├── routes/                 # Endpoint routers (authRoutes.js, carRoutes.js, chargerRoutes.js, etc.)
        └── services/               # Core business services (userService.js, storageService.js)
```

---

## 4. System Architecture

```text
User Actions ➔ Browser Hash SPA Router ➔ DOM Template Injection ➔ (Future / Local) background syncs to API
                                                                
Client Browser ──[ Firebase ID Token / JSON Payload ]──> Vercel Serverless (Express)
                                                                 │
      ┌─────────────────────────┬────────────────────────────────┴────────┬─────────────────────────┐
      ▼                         ▼                                         ▼                         ▼
DynamoDB Service            S3 Client                                Firebase Admin            Third-Party APIs
- Users (Profile)      - Vehicle Images                            - Verify ID Token     - Gemini API (Chat)
- Favourites           - Generated Docs                                                  - CurrentsAPI (EV News)
- Chat History                                                                           - YouTube v3 (Reviews)
- Test Drive Leads                                                                       - OpenChargeMap (Chargers)
```

---

## 5. Routing Map

### A. Frontend SPA Routes (Hash-based)
| Route / Hash Path | Controller Function | Purpose / View | Auth Required |
| :--- | :--- | :--- | :--- |
| `#/` | `restoreHomepage()` | Homepage (Hero search, calculators, car lists, news, reviews). | No |
| `#/cars/:id` | `renderCarDetailsPage(car)` | Specs, range/savings calculator, variant tabs, RWA letters. | No |
| `#/view-all/:section` | `renderViewAllPage(sec)` | Filtered vehicle catalog grids (`popular`, `launches`, `upcoming`). | No |
| `#/news/all` | `renderAllNewsPage()` | Comprehensive listing of industry updates. | No |
| `#/news/:id` | `renderNewsArticlePage(art)` | Full read article view for a news item. | No |
| `#/guide/:id` | `renderGuideArticlePage(ch)` | Educational chapters with inline SVG schematics. | No |
| `#/hub/:key` | `renderHubArticlePage(key)` | FAQ panels for concepts like Regenerative Braking and V2L. | No |
| `#/reviews/expert` | `renderExpertReviewsPage()` | Table displaying expert drive reviews, ratings, pros, and cons. | No |
| `#/reviews/customer` | `renderCustomerReviewsPage()` | Owner feedback logs and ratings. | No |
| `#/brands` | `renderBrandsPage()` | Brand directory grid and brand filter selector. | No |
| `#/brand/:brandId` | `renderBrandPage(brandId)` | dedicated brand catalog lists. | No |

### B. Backend REST API Endpoints (`/api/*`)
| Method | Route | Purpose | Auth Required | Database |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status & database configuration checks | No | None |
| `POST` | `/api/auth/firebase/sync` | Syncs Firebase authenticated user details to DB | Yes (Firebase Token) | users |
| `GET` | `/api/cars/ev-models` | Fetches vehicle details from local JSON database | No | None (Cars.json) |
| `GET` | `/api/car-images/list` | Lists color catalog files dynamically from public folders | No | Filesystem |
| `GET` | `/api/blogs` | Lists blogs filtered by category or search query | No | blogs |
| `GET` | `/api/blogs/:category/:slug` | Fetches a single blog article by slug and category | No | blogs |
| `GET` | `/api/reviews` | Lists approved vehicle reviews (filtered by carId/type) | No | reviews |
| `POST` | `/api/reviews` | Submits a new customer vehicle review | Optional | reviews |
| `GET` | `/api/favourites` | Lists user's favourited car IDs | Yes (Firebase Token) | favourites |
| `POST` | `/api/favourites` | Adds a car to the user's favourites list | Yes (Firebase Token) | favourites |
| `DELETE` | `/api/favourites/:carId` | Removes a car from favourites list | Yes (Firebase Token) | favourites |
| `GET` | `/api/recently-viewed` | Lists user's recently viewed car IDs (up to 12) | Yes (Firebase Token) | recently_viewed |
| `POST` | `/api/recently-viewed` | Logs a car ID as recently viewed by the user | Yes (Firebase Token) | recently_viewed |
| `POST` | `/api/test-drives` | Submits a customer test drive booking lead | No | test_drives |
| `POST` | `/api/newsletter` | Submits a customer newsletter email subscription | No | newsletter |
| `GET` | `/api/chargers/nearby` | Proxies nearby EV charging stations (Open Charge Map) | No | None |
| `GET` | `/api/news` | Aggregates and relevance-scores live Indian EV news | No | Cache / External API |
| `GET` | `/api/videos` | Fetches EV video reviews from YouTube API (whitelisted channels) | No | Cache / External API |
| `POST` | `/api/chat` | Chatbot answering client questions using Google Gemini | No | None / chat_history |
| `*` | `/api/payments` | Placeholder payments route | No | Placeholder response |
| `*` | `/api/notifications` | Placeholder notifications route | No | Placeholder response |
| `*` | `/api/admin` | Placeholder admin route | No | Placeholder response |

---

## 6. Frontend Architecture

### View Lifecycle
The SPA employs an imperative layout system:
1. **Hash Change**: User triggers hash path update.
2. **Clear/Hide Layout**: `handleRouting()` hides the static homepage container `#homepage-content` and clears dynamic container `#details-page-content`.
3. **Template Compilation**: String templates compile HTML with contextual attributes and inject it into `#details-page-content`.
4. **Re-binding Handlers**: Active scripts run to bind user action triggers (variant selectors, EMI range sliders, trip planners).
5. **Jargon Buster scanner**: Triggered after every transition to wrap matching abbreviations in tooltip elements.

### Internal Calculator Math
* **On-Road Pricing**: Computes registration charges, dealer handling, flat/percent incentives, and road tax coefficients across 12 states:
  $$\text{On-Road} = \text{Ex-Showroom} + \text{Road Tax} + \text{Registration} + \text{Insurance} + \text{Handling} - \text{Incentive}$$
* **Petrol vs EV Savings**: Evaluates daily running costs against an ICE baseline of **15 km/l**:
  $$\text{EV efficiency} = \frac{\text{Battery Capacity (kWh)}}{\text{Claimed Range (km)}}$$
  $$\text{Monthly Savings} = \text{ICE Cost} - \text{EV Cost} = \left(\frac{\text{Distance}}{15} \times \text{Petrol Price}\right) - (\text{Distance} \times \text{EV efficiency} \times \text{Tariff})$$
* **Trip Route Planning**: Adjusts claimed ranges according to traffic, climate, style, and passengers:
  $$\text{Real Range} = \text{Claimed Range} \times \text{ACCoef} \times \text{StyleCoef} \times \text{PaxCoef} \times \text{TrafficCoef}$$
  It lists required charging stops (to 85% SoC) and profiles charger locations along Indian highway corridors.

---

## 7. Backend Architecture

The backend is built with a Node.js and Express MVC layered structure:
1. **app.js**: Factory function creating the Express app, binding logger, CORS policy, public static files, routing API, and the wildcard handler redirecting SPA paths to `index.html`.
2. **routes**: Defines router endpoints, mapping paths to controllers, enforcing JWT token validations.
3. **controllers**: Validates input payloads, delegates calls to repository layers, handles responses, catches errors via `asyncHandler`.
4. **repositories**: Accesses Amazon DynamoDB collections. Leverages a generic repository builder (`dynamoRepository.js`) to provide CRUD methods (`scan`, `get`, `query`, `put`, `delete`).
5. **models**: Maps JavaScript entity specs to DynamoDB table keys and schema columns.
6. **services**: Houses business utilities (user upserts, AWS/S3 uploads).
7. **middlewares**:
   - `auth.js`: Extract Firebase tokens, calling Firebase Admin SDK to decode details.
   - `errorHandler.js`: Catches application errors, transforming them into standardized API responses.
   - `notFound.js`: Handles unmatched API route paths.
   - `requestLogger.js`: Visualizes client requests.

---

## 8. Database Architecture

### Persistence Layer: Amazon DynamoDB
All DynamoDB tables share a base design patterns scheme utilizing generic partitions (`pk`) and sorts (`sk`) for single-table indexing flexibility:

* **users**: Profile metadata
  - `pk`: `USER#<firebaseUid>`, `sk`: `PROFILE`
  - Attributes: `firebaseUid`, `name`, `email`, `phone`, `avatar`, `provider`, `role`, `lastLoginAt`
* **favourites**: User wishlists
  - `pk`: `USER#<firebaseUid>`, `sk`: `FAVOURITE#<carId>`
  - Attributes: `firebaseUid`, `carId`
* **recently_viewed**: History logs
  - `pk`: `USER#<firebaseUid>`, `sk`: `RECENT#<carId>`
  - Attributes: `firebaseUid`, `carId`, `viewedAt`
* **blogs**: CMS articles
  - `pk`: `BLOG#<category>#<slug>`, `sk`: `ARTICLE`
  - Attributes: `slug`, `category`, `categoryName`, `title`, `summary`, `htmlContent`, `featuredImage`, `status`, `publishedAt`
* **reviews**: Customer feedback ratings
  - `pk`: `REVIEW#<id>`, `sk`: `DETAILS`
  - Attributes: `id`, `carId`, `firebaseUid`, `type`, `author`, `rating`, `title`, `content`, `pros`, `cons`, `status`
* **test_drives**: Booking leads
  - `pk`: `TEST_DRIVE#<id>`, `sk`: `BOOKING`
  - Attributes: `id`, `carId`, `carName`, `name`, `phone`, `email`, `preferredDate`, `city`, `status`
* **newsletter**: Subscription lists
  - `pk`: `NEWSLETTER#<email>`, `sk`: `SUBSCRIPTION`
  - Attributes: `email`, `source`, `status`
* **chat_history**: Chatbot turn history
  - `pk`: `CHAT#<firebaseUid|anonymous>`, `sk`: `TURN#<createdAt>#<id>`
  - Attributes: `id`, `firebaseUid`, `messages`, `reply`, `provider`

---

## 9. Authentication & Security Flow

```text
Client Browser                     Firebase Auth Server                 EVcarwale Express Backend
      │                                     │                                      │
      ├─────1. Click Google Login──────────>│                                      │
      │<────2. Return User Creds & Token────┤                                      │
      │                                     │                                      │
      ├─────3. POST /api/auth/firebase/sync ──────────────────────────────────────>│ Verify token via Firebase Admin
      │        (Bearer <ID_Token> in Header)                                       │ Sync user attributes to DynamoDB
      │<────4. Return Synced User Profile ─────────────────────────────────────────┤
```

* **Middlewares**: `auth.js` intercepts routes, verifies tokens via `verifyIdToken()`. Enforces strict blocks on write actions while failing gracefully to anonymous mode for reading reviews or running calculations.

---

## 10. Environment Variables

| Variable | Type | Purpose | Production Source |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | String | Environment execution setting (`development`, `production`) | Config |
| `PORT` | Number | Server listener port (defaults to 8081) | System config |
| `CORS_ORIGIN` | String | Restricts resource requests from external clients | CORS Setup |
| `AWS_REGION` | String | Mapped region for AWS services (`ap-south-1`) | AWS Config |
| `AWS_ACCESS_KEY_ID` | String | Credential access key for DynamoDB / S3 | IAM User |
| `AWS_SECRET_ACCESS_KEY` | String | Credential secret key for DynamoDB / S3 | IAM User |
| `AWS_USE_IAM_ROLE` | Boolean| Activates IAM role discovery (useful for ECS/EKS nodes) | AWS IAM |
| `AWS_DYNAMODB_TABLE_PREFIX`| String | Prefix appended to DynamoDB table entities (e.g. `EVCarWale`) | DB Prefixes |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | JSON | Service Account certificate JSON string for Admin verification | Firebase Console |
| `GEMINI_API_KEY` | String | Access credentials for Google Gemini models | Google AI Studio |
| `GEMINI_MODEL` | String | Default generative model (`gemini-2.0-flash`) | AI Settings |
| `CURRENT_NEWS_API_KEY` | String | API key for currentsapi.services news aggregator | Currents API |
| `YOUTUBE_API_KEY` | String | API key for YouTube video search queries | Google Developer Console |
| `OPENCHARGEMAP_API_KEY` | String | API key for locating EV charging stations | OpenChargeMap Console |

---

## 11. Performance Analysis & Technical Debt

### Performance Issues
1. **Large Monolithic Files**: `app.js` is 250+ KB and contains entire static vehicle tables alongside routing and view injections. This slow down browser parser loads.
2. **In-Memory Filtering Scans**: Backend repositories run DynamoDB `.scan()` queries and filter data in-memory inside Node.js processes. For larger catalogs, this will cause memory leakage and high database costs.
3. **No Frontend Cache Control**: The frontend re-fetches and redraws the page DOM dynamically upon route changes without local caching mechanisms (e.g. Service Workers).
4. **Third-Party API Latency**: The `/api/news` and `/api/videos` endpoints request external APIs and wait synchronously for upstream responses if cache misses occur, resulting in up to 10-second response delays.

### Technical Debt
1. **Frontend-Backend Disconnect**: The frontend `app.js` still relies heavily on its own static data structures and browser `localStorage`. Form submissions (Test drives, Newsletter subscriptions) do not post payload data to the Express endpoints.
2. **Lack of Automated Testing**: The test coverage is minimal. No unit tests are configured for the mathematical calculators or database queries.
3. **Missing Indexes**: DynamoDB tables do not specify index mappings (GSIs / LSIs) for sorting reviews, favourites, or chat histories by user or date, relying instead on expensive scans.

---

## 12. Development & Deployment Workflow

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy environment variables to `backend/.env` and insert required secrets.
3. Launch development server:
   ```bash
   npm run dev
   ```
   This runs the static Express server mapping locally to `http://localhost:8081`.

### Production Deployment
The application builds as a Vercel project:
1. `vercel.json` configures the serverless target `@vercel/node` for `api/index.js`.
2. All client queries resolve via routing configuration directly to `api/index.js`, where Express serves public static resources or delegates REST paths to backend endpoints.
3. Environment secrets must be configured within the Vercel dashboard.
