# Nigeria Property Centre (NPC) - Real Estate & Property Marketplace

A production-grade web application modelled after **nigeriapropertycenter.com**, Nigeria's leading real estate platform for buying, renting, and leasing residential, commercial, and land properties across Lagos, Abuja, Port Harcourt, and other Nigerian states.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Google GenAI SDK (Gemini 3.8 Flash)**, and **Plus Jakarta Sans** typography.

---

## 1. Table of Contents

1. [Project Overview](#2-project-overview)
2. [Tech Stack & Architecture](#3-tech-stack--architecture)
3. [Key Features & User Modules](#4-key-features--user-modules)
4. [Nigerian Real Estate Domain Specifics](#5-nigerian-real-estate-domain-specifics)
5. [Directory Structure](#6-directory-structure)
6. [Server-Side AI API Route](#7-server-side-ai-api-route)
7. [Running & Building Locally](#8-running--building-locally)
8. [Design System & Constitution](#9-design-system--constitution)

---

## 2. Project Overview

Finding and transacting real estate in Nigeria requires specialized knowledge of title documentation, land registries, local infrastructure dependencies (power, water treatment, security), and currency dynamics.

**Nigeria Property Centre** solves these challenges by combining:
- Verified property listings across prime Nigerian neighborhoods (Lekki Phase 1, Ikoyi, Banana Island, Victoria Island, Maitama, Asokoro, Wuse 2, Port Harcourt Old GRA).
- Direct WhatsApp & phone access to verified real estate agents.
- Nigerian title verification badges (Certificate of Occupancy, Governor's Consent, Government Gazette).
- AI-powered market valuation and legal advisory powered by **Google Gemini 3.8 Flash**.
- A Seeker Request Board allowing prospective buyers and tenants to post custom requirements and match with agents.
- Comprehensive financial tools: Mortgage Calculator, and Acquisition Closing Cost & Statutory Fee Calculator.

---

## 3. Tech Stack & Architecture

- **Framework**: Next.js 15.4 (App Router, standalone output, React Server & Client Components)
- **UI Library**: React 19, Lucide React icons
- **Styling**: Tailwind CSS v4, PostCSS, modern flexbox & grid layouts
- **AI Integration**: `@google/genai` TypeScript SDK (model: `gemini-3.8-flash`) executed strictly in server-side API routes (`app/api/valuation/route.ts`)
- **Typography**: Google Fonts `Plus Jakarta Sans` with monospace tabular numerals for currency figures
- **Media Assets**: High-resolution architectural photography generated specifically for Nigerian residential enclaves (Lekki contemporary duplexes, Ikoyi waterfront penthouses, Maitama villas, Banana Island terraces, Lagos lagoon skyline)

---

## 4. Key Features & User Modules

### 4.1 Top Navigation Bar (Strict 3-Zone Contract)
- **Zone 1 (Brand Wordmark)**: Distinctive single-line wordmark "Nigeria Property Centre" with the brand insignia.
- **Zone 2 (Navigation)**: Single-line links for *For Sale*, *For Rent*, *Property Requests*, *Market Trends*, and *AI Advisor*.
- **Zone 3 (Utilities & Primary Action)**: 
  - **Currency Switcher**: Toggle between Nigerian Naira (**₦ NGN**) and US Dollar (**$ USD** at realistic market rate ~₦1,450/$).
  - **Closing Fees Calculator Quick Launch**.
  - **Verified Agents Directory Quick Launch**.
  - **Comparison Counter & Modal**.
  - **Saved Favorites Drawer**.
  - **Primary CTA**: "Post a Property" button.

### 4.2 Hero Section & Nigerian Property Filter Console
- **Category Tabs**: For Sale, For Rent, Short Let, and Joint Venture.
- **State & Area Dropdowns**: Dynamically updates areas based on chosen state (Lagos, Abuja FCT, Rivers, Oyo, Ogun, Delta).
- **Property Types**: Detached Duplex, Semi-Detached, Terraced Duplex, Flat / Apartment, Luxury Penthouse, Land Plots, and Office Space.
- **Bedrooms**: Any, 1, 2, 3, 4, 5+ Beds.
- **Keyword Search**: Matches titles, amenities (pool, BQ, cinema, inverter), and addresses.
- **Title Document Filter**: Filter by C of O, Governor's Consent, Gazette, Federal C of O, or Registered Deed.
- **Max Price Slider**: Up to ₦1 Billion+ with instant price formatting in words.
- **One-Click Popular Presets**: Quick search for *Lekki Phase 1*, *Ikoyi Waterfront*, *Maitama Abuja*, *Banana Island*, *Short Let Apartments*, and *Governor's Consent*.
- **Quantitative Proof Strip**: Verified stats (45k+ Listings, 100% Title Verified, 2.4k+ Vetted Agents, ₦0 Free Buyer Enquiries).

### 4.3 Property Catalog & Zero-Pill Property Cards
- Displays listings with lead photography (4:3 aspect ratio), category overlays, and verified badges.
- **Zero-Pill Metadata**: Clean unboxed inline specs with subtle typographic separators (`5 Beds · 6 Baths · 4 Cars · 600 sqm · C of O`).
- **Tabular Numerals**: High-legibility Naira price display with rental period indicators (`/yr`, `/day`).
- **Action Affordances**:
  - Direct **WhatsApp Agent** button with prefilled listing title, location, and price.
  - **Schedule Inspection** button.
  - **Compare Property** toggle (compare up to 3 properties).
  - **Bookmark / Favorite** toggle.
- **Sorting & View Toggle**: Sort by Featured, Price (Low to High / High to Low), Bedrooms, or Newest. Switch between Grid and Compact List views.

### 4.4 Contiguous Property Detail View & Booking Module
- High-res photo gallery with thumbnail switcher.
- Full specifications: Title document, Land size, Year built, Electricity status, Water treatment plant, Security post, and Boys Quarters (BQ).
- Verified Agent contact card with phone, direct WhatsApp link, and rating.
- **Interactive Inspection Scheduler**:
  - Choose between **Physical On-Site Inspection** or **Virtual Video Tour**.
  - Select date and time slot (Morning / Afternoon).
  - Instant booking confirmation receipt.
- **Nigerian Mortgage Calculator**:
  - Adjust down payment (10% to 50%), loan tenure (5 to 25 years), and interest rate (12% to 28% p.a.).
  - Calculates estimated monthly repayment in ₦ Naira.
- **Embedded AI Due Diligence**:
  - One-click trigger to generate an instant comparative valuation and title safety assessment for the active property.

### 4.5 Seeker Request Board ("Post a Request")
- Enables home seekers, corporate tenants, and diaspora buyers to broadcast custom requirements to verified agents.
- Filter requests by purpose: Buy, Rent, Short Let, Land.
- "Post a Request" form capturing budget, preferred area, bedrooms, specific amenities, and direct contact.
- Agents can click "Match on WhatsApp" to initiate direct conversation with the seeker.

### 4.6 Nigerian Market Intelligence & Neighborhood Price Trends
- Displays verified benchmark data across major enclaves:
  - Average Duplex Sale Price in Naira
  - Average Annual Rent in Naira
  - Gross Rental Yield (%)
  - Year-over-Year Capital Appreciation (YoY %)
  - Land Price per SQM in Naira
  - Demand Index & neighborhood investment commentary
- State filter: Lagos, Abuja (FCT), Rivers.
- Integrated AI Valuation button on any neighborhood.

### 4.7 Property Closing Costs & Legal Fees Calculator
- Calculates the true "cash-to-close" amount for Nigerian property acquisitions:
  - **Governor's Consent & Registration Fee**: ~3% in Lagos (1.5% consent + 0.5% capital gains + 1% registration) / 2.5% in Abuja AGIS.
  - **Federal / State Stamp Duty**: ~1.5%.
  - **Legal / Conveyancing Fee**: 5% (Nigerian Bar Association standard property conveyancing rate).
  - **Agency Brokerage Commission**: 5% standard.
  - **Survey Plan & Charting Fee**: ₦450,000 flat.
- Itemized breakdown table and one-click "Copy Closing Summary" button for easy forwarding to lawyers or mortgage banks.

### 4.8 Verified Agents Directory
- Directory of licensed estate practitioners and agencies.
- Filter by state (Lagos, Abuja, Rivers) or search by area.
- Displays agency names, years of experience, specialization (e.g. Luxury Duplexes, AGIS Lands), active listings count, and direct WhatsApp / Call triggers.

### 4.9 "Post a Property" Listing Portal
- Working form for landlords, agents, and developers to list a property.
- Captures title, category, property type, price, state, area, street address, bedrooms, bathrooms, parking, title document, amenities checkboxes, agent credentials, and photo selection.
- Instantly adds the new listing to the live catalog in React state.

### 4.10 AI Real Estate Advisor & Title Checker (Gemini 3.8 Flash)
- Interactive conversational modal powered by `@google/genai`.
- Pre-built quick queries:
  - Lekki Phase 1 rental benchmarks.
  - Legal distinction between Governor's Consent, C of O, and Gazette under the Land Use Act 1978.
  - Step-by-step title search procedures at Alausa Lands Bureau (Lagos) or AGIS (Abuja).
  - High-yield neighborhoods in Abuja.
- Custom user prompt handling with formatted markdown responses and one-click copy.

### 4.11 Nigerian Land Titles & Legal Due Diligence Guide
- In-depth guide explaining:
  - **Certificate of Occupancy (C of O)**
  - **Governor's Consent**
  - **Government Gazette & Excision**
  - **Deed of Assignment & Registered Survey**
- **5-Step Land Verification Protocol**: Physical site visit, survey coordinate charting, lands registry search, legal deed execution, and Governor's Consent filing.

---

## 5. Nigerian Real Estate Domain Specifics

| Concept | Explanation in Nigerian Context |
| :--- | :--- |
| **Land Use Act of 1978** | Federal law vesting all state lands in the State Governor, who holds it in trust. Individuals own 99-year leaseholds, not absolute freehold. |
| **Governor's Consent** | Required for any subsequent assignment, mortgage, or transfer of land that already has a C of O. Without it, legal ownership is not perfected. |
| **Gazette / Excision** | Official government gazette publication legally carving out ancestral community land from government acquisition. Safe root of title. |
| **Boys Quarters (BQ)** | Detached or semi-detached self-contained domestic staff room common in Nigerian luxury houses and duplexes. |
| **24/7 Power / Dual Gen** | Uninterrupted electricity provided by dedicated community generators, solar inverters, or independent power plants (IPP), critical in Nigerian listings. |
| **Industrial Water Treatment** | On-site reverse osmosis or multi-stage filtration system installed on boreholes to guarantee drinkable clean water. |
| **Omo-onile Prevention** | Traditional land-owning families whose claims can cause conflict unless property title has registered C of O or Governor's Consent. |

---

## 6. Directory Structure

```
├── app/
│   ├── api/
│   │   └── valuation/
│   │       └── route.ts          # Server-side Gemini 3.8 Flash route
│   ├── globals.css               # Tailwind CSS v4 imports
│   ├── layout.tsx                # Plus Jakarta Sans & SEO metadata
│   └── page.tsx                  # Master page integrating all modules
├── components/
│   ├── AgentDirectoryModal.tsx   # Verified agents directory
│   ├── AiAdvisorModal.tsx        # Gemini AI Real Estate Advisor
│   ├── ClosingCostCalculatorModal.tsx # Statutory & legal fees breakdown
│   ├── CompareModal.tsx          # Side-by-side comparison table
│   ├── FavoritesDrawer.tsx       # Saved properties slide-over drawer
│   ├── Footer.tsx                # Footer with quick links & legal notes
│   ├── HeroSearch.tsx            # Search console, category tabs & filters
│   ├── MarketTrends.tsx          # Neighborhood price & rental yield index
│   ├── Navbar.tsx                # 3-Zone Top Bar with currency switcher
│   ├── NigerianTitleGuide.tsx    # Land Use Act legal due diligence guide
│   ├── PostPropertyModal.tsx     # Agent/owner listing submission portal
│   ├── PropertyCard.tsx          # Zero-pill property card with WhatsApp CTA
│   ├── PropertyDetailModal.tsx   # Gallery, specs, inspection & mortgage
│   └── PropertyRequestsModal.tsx # Seeker requests & agent matching board
├── lib/
│   ├── property-data.ts          # Nigerian properties, requests, trends & agents
│   └── utils.ts                  # Classnames & styling helper
├── public/
│   └── images/                   # Generated Nigerian luxury architectural photography
│       ├── abuja_maitama_villa_*.jpg
│       ├── banana_island_terrace_*.jpg
│       ├── hero_lekki_mansion_*.jpg
│       ├── ikoyi_waterfront_penthouse_*.jpg
│       └── lagos_skyline_aerial_*.jpg
├── metadata.json                 # AI Studio metadata & major capabilities
└── package.json                  # Dependencies & scripts
```

---

## 7. Server-Side AI API Route

The endpoint at `/app/api/valuation/route.ts` runs on the server using `@google/genai`:

- **Model**: `gemini-3.8-flash`
- **Environment Variable**: `process.env.GEMINI_API_KEY` (kept strictly server-side)
- **Telemetry**: Configured with `httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }`
- **Capabilities**:
  - Estimates fair market sales values and annual rents in ₦ Naira.
  - Calculates expected gross rental yields for Nigerian neighborhoods.
  - Explains legal safety, red flags, and search steps at Alausa (Lagos) or AGIS (Abuja).

---

## 8. Running & Building Locally

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env.local` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the portal.

### Production Build
```bash
npm run build
npm run start
```

### Code Quality & Linting
```bash
npm run lint
```

---

## 9. Design System & Constitution

This application strictly complies with the **Universal Frontend Design Constitution**:
1. **Top Bar Contract**: Exactly 3 zones (Brand wordmark, 4-5 single-line links, 1 primary action button).
2. **Zero-Pill Discipline**: Metadata is formatted as clean unboxed inline text separated by `·` rather than colored pill capsules.
3. **No Slop**: Zero mechanical code comment prefixes (`//`), no fake version numbers, no decorative status pulse dots on static titles.
4. **60-30-10 Palette**: 60% clean canvas (`bg-slate-50`), 30% structural surfaces (`border-slate-200`, `bg-white`), 10% Nigerian emerald green accent (`#008751` / `bg-emerald-800`).
5. **Tabular Numerals**: All currency figures and metrics use `font-mono tabular-nums` for vertical alignment.
6. **Zero-Broken-Image Policy**: All image elements feature styled CSS fallbacks and `referrerPolicy="no-referrer"`.
