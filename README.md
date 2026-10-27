# Nigeria Property Centre (NPC) - Verified Real Estate & Property Marketplace

A production-grade web application modelled after **nigeriapropertycenter.com**, Nigeria's premier real estate platform for buying, renting, and leasing residential, commercial, short-let, and joint-venture properties across Lagos, Abuja, Port Harcourt, and all Nigerian states.

Built with **Next.js 15 (App Router)**, **React 19**, **NeonDB & PostgreSQL**, **Prisma ORM**, **Tailwind CSS v4**, and **Plus Jakarta Sans** typography.

---

## 1. Table of Contents

1. [Project Overview](#2-project-overview)
2. [Tech Stack & Architecture](#3-tech-stack--architecture)
3. [Database & Authentication Architecture (NeonDB + PostgreSQL + Prisma)](#4-database--authentication-architecture-neondb--postgresql--prisma)
4. [User Roles & Security (No Firebase)](#5-user-roles--security-no-firebase)
5. [Connecting Your NeonDB PostgreSQL Database](#6-connecting-your-neondb-postgresql-database)
6. [API Endpoints Reference](#7-api-endpoints-reference)
7. [Key Features & Nigerian Real Estate Modules](#8-key-features--nigerian-real-estate-modules)
8. [Nigerian Real Estate Domain Knowledge](#9-nigerian-real-estate-domain-knowledge)
9. [Directory Structure](#10-directory-structure)
10. [Running & Building Locally](#11-running--building-locally)
11. [Design System & Frontend Constitution](#12-design-system--frontend-constitution)

---

## 2. Project Overview

Finding and transacting real estate in Nigeria requires specialized knowledge of title documentation, land registries (Alausa Lands Bureau, Abuja AGIS), local infrastructure dependencies (24/7 dedicated IPP vs dual estate generators, borehole industrial water treatment, gated island access), and currency dynamics (₦ NGN vs $ USD).

**Nigeria Property Centre** solves these challenges by combining:
- **Verified Property Listings**: Curated across prime Nigerian enclaves (Lekki Phase 1, Ikoyi, Banana Island, Victoria Island, Maitama, Asokoro, Wuse 2, Port Harcourt Old GRA).
- **Relational PostgreSQL Database via NeonDB**: Cloud-native serverless PostgreSQL persistence with Prisma ORM schemas.
- **Full Authentication System (No Firebase)**: Password hashing with `bcryptjs`, JSON Web Tokens (JWT), HTTP-only cookies, and role-based permissions (Verified Agent, Property Seeker, Developer/Landowner).
- **Direct Agent Contact**: One-click WhatsApp links and phone dials with pre-filled listing summaries.
- **Physical & Virtual WhatsApp Inspection Scheduler**: Integrated booking management synced to the database.
- **Nigerian Title Verification Badges**: Certificate of Occupancy (C of O), Governor's Consent, Government Gazette, and Deed of Assignment.
- **Joint Venture & Off-Plan Development Hub**: Equity sharing formulas (Landowner equity vs Developer construction financing) and 5-stage milestone payment schedules.
- **Financial & Due Diligence Suites**: Mortgage Pre-Qualifier (FMBN/NHF, NMRC commercial loans), Closing Costs & Statutory Fees Calculator, and Cadastral Title Charting.

---

## 3. Tech Stack & Architecture

- **Frontend Framework**: Next.js 15.4+ with App Router (React 19, Server & Client Components)
- **Database Engine**: **NeonDB** (Serverless PostgreSQL) via `@neondatabase/serverless`
- **ORM & Schema**: **Prisma ORM** (`prisma/schema.prisma` with `User`, `Property`, `SavedProperty`, `InspectionRequest`, and `PropertyRequest` models)
- **Authentication**: Custom self-contained auth engine (**No Firebase**) using `bcryptjs` for salted hashing, `jsonwebtoken` (JWT) for secure session tokens, and client-side `AuthProvider` context
- **Styling**: Tailwind CSS v4, PostCSS, responsive flexbox/grid layouts
- **Icons**: Lucide React
- **Typography**: Google Fonts `Plus Jakarta Sans` with monospace tabular numerals for currency figures
- **Media Assets**: High-resolution architectural photography of Nigerian luxury homes and prime developments

---

## 4. Database & Authentication Architecture (NeonDB + PostgreSQL + Prisma)

### 4.1 Prisma Schema (`prisma/schema.prisma`)
The application defines a normalized relational schema tailored to Nigerian real estate operations:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum Role {
  SEEKER
  AGENT
  DEVELOPER
  ADMIN
}

enum PropertyType {
  FLAT_APARTMENT
  DETACHED_DUPLEX
  SEMI_DETACHED_DUPLEX
  TERRACE
  COMMERCIAL
  LAND
  SHORT_LET
  OFF_PLAN
}

enum PropertyListingType {
  SALE
  RENT
  SHORT_LET
  JOINT_VENTURE
}

model User {
  id               String              @id @default(uuid())
  email            String              @unique
  passwordHash     String
  fullName         String
  phone            String              // +234 Nigerian format
  role             Role                @default(SEEKER)
  agencyName       String?
  licenseNumber    String?             // e.g. LASRERA or ERCAAN registration
  isVerified       Boolean             @default(false)
  avatarUrl        String?
  createdAt        DateTime            @default(now())
  updatedAt        DateTime            @updatedAt

  properties       Property[]          @relation("AgentProperties")
  savedProperties  SavedProperty[]
  inspections      InspectionRequest[]
  propertyRequests PropertyRequest[]
}

model Property {
  id             String              @id @default(uuid())
  title          String
  description    String
  listingType    PropertyListingType
  propertyType   PropertyType
  price          Float
  currency       String              @default("NGN")
  state          String
  city           String
  neighborhood   String
  bedrooms       Int                 @default(0)
  bathrooms      Int                 @default(0)
  titleDoc       String              // "Governor's Consent", "C of O", "Gazette"
  isVerified     Boolean             @default(false)
  images         String[]
  features       String[]

  agentId        String
  agent          User                @relation("AgentProperties", fields: [agentId], references: [id], onDelete: Cascade)
  savedBy        SavedProperty[]
  inspections    InspectionRequest[]
  createdAt      DateTime            @default(now())
  updatedAt      DateTime            @updatedAt
}

model InspectionRequest {
  id            String   @id @default(uuid())
  userId        String
  propertyId    String
  preferredDate DateTime
  preferredTime String
  type          String   @default("PHYSICAL") // PHYSICAL or VIRTUAL_WHATSAPP
  notes         String?
  status        String   @default("PENDING")
  createdAt     DateTime @default(now())

  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  property      Property @relation(fields: [propertyId], references: [id], onDelete: Cascade)
}
```

### 4.2 NeonDB Serverless PostgreSQL Driver (`lib/db.ts`)
The backend database manager connects to Neon's high-speed connection pool:
- Executes queries via `@neondatabase/serverless`.
- Automatically executes table creation `DDL` (`users`, `inspections`, `saved_properties`) on first query if they do not already exist.
- **Zero-Config Resilient Fallback**: In local preview or sandbox environments where `DATABASE_URL` has not yet been set with live credentials, it falls back to an in-memory repository pre-seeded with realistic Nigerian agent and buyer accounts so the application never crashes.

---

## 5. User Roles & Security (No Firebase)

The authentication system operates without Firebase, giving full control over data sovereignty and compliance with Nigerian data regulations (NDPR):

1. **Realtor / Estate Agent (`AGENT`)**:
   - Register with Agency Name and LASRERA (Lagos State Real Estate Regulatory Authority) / ERCAAN registration license.
   - Verified badge upon providing license.
   - Automatically pre-populates agent information when creating new property listings.
   - Receives physical inspection and WhatsApp video tour leads.

2. **Property Seeker / Buyer (`SEEKER`)**:
   - Save favorite properties across sessions.
   - Schedule on-site physical inspections or live WhatsApp virtual walk-throughs.
   - Track booking status (Pending, Confirmed, Completed) in the **Inspection Schedules** modal.
   - Post custom requests to the Seeker Board.

3. **Property Developer / Landowner (`DEVELOPER`)**:
   - Post joint venture land mandates and off-plan milestone projects.
   - Model JV equity ratios (land equity vs construction financing).

### Pre-Seeded Quick Demo Accounts
For instant testing without filling out forms, the Auth Modal provides 1-click login buttons:
- **Verified Agent**: `agent@nigeriaproperty.com` / `password123` (Adebayo Alabi, LASRERA/REA/2024/0892)
- **Property Seeker**: `seeker@nigeriaproperty.com` / `password123` (Chioma Okonjo)
- **Developer**: `developer@nigeriaproperty.com` / `password123` (Engr. Emeka Danladi)

---

## 6. Connecting Your NeonDB PostgreSQL Database

1. Sign up or log into [Neon Console](https://console.neon.tech).
2. Create a new PostgreSQL project (e.g., `nigeria-property-centre`).
3. Under **Dashboard > Connection Details**, copy the PostgreSQL connection string with `sslmode=require`:
   ```
   postgresql://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require
   ```
4. Put the connection string in the project-root `.env` file (the project uses `.env` only):
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@YOUR_NEON_HOST/neondb?sslmode=require"
   JWT_SECRET="replace_with_a_unique_random_secret"
   ```
5. Add your Gemini API key as `GEMINI_API_KEY` in `.env` to enable AI valuation and legal advisory.
6. Restart your application. If the database schema has not been applied, run the project’s Prisma setup or migration commands.

---

## 7. API Endpoints Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create a new user (with password hashing and role validation) | No |
| `POST` | `/api/auth/login` | Verify credentials and return JWT token + session cookie | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user profile from JWT session | Yes |
| `POST` | `/api/auth/logout` | Clear session cookie and invalidate client state | No |
| `GET` | `/api/inspections` | Fetch all scheduled inspections for logged-in user | Yes |
| `POST` | `/api/inspections` | Schedule a new physical site tour or WhatsApp video inspection | Yes |
| `GET` | `/api/user/saved-properties` | Retrieve array of saved property IDs for user | Yes |
| `POST` | `/api/user/saved-properties` | Toggle save/unsave property bookmark | Yes |
| `POST` | `/api/valuation` | Server-side AI property valuation and legal advisory | No |

---

## 8. Key Features & Nigerian Real Estate Modules

### 8.1 3-Zone Clean Header & User Management
- **Zone 1 (Wordmark)**: "Nigeria Property Centre" wordmark with NPC emblem.
- **Zone 2 (Navigation)**: For Sale, For Rent, Requests, Trends, Title Search, JV & Off-Plan, and AI Advisor.
- **Zone 3 (Controls & Auth)**:
  - Currency switcher (₦ NGN vs $ USD).
  - Mortgage pre-qualifier shortcut.
  - Closing fees calculator shortcut.
  - Saved properties drawer with count badge.
  - **Inspection Schedules modal with booking count badge**.
  - **User Account Menu**: Displays user initials, verification badge, role indicator, and quick links to manage listings or sign out.
  - "Post Property" CTA.

### 8.2 Hero Search & Nigerian Filtering
- Category tabs: For Sale, For Rent, Short Let, Joint Venture.
- Dynamic Nigerian State & Area selector (Lagos, Abuja FCT, Rivers, Oyo, Ogun, Delta).
- Title Document filtering (C of O, Governor's Consent, Gazette, Registered Deed).
- Real-time price slider up to ₦1 Billion+ with verbal Naira formatting (e.g. *Two Hundred and Fifty Million Naira*).

### 8.3 Contiguous Property Detail View & Booking Engine
- Multi-image photo gallery with thumbnail picker.
- Full specifications: Title document, Land size (sqm), Electricity reliability (dedicated IPP vs dual estate generator), Water treatment plant, Security post, and Boys Quarters (BQ).
- **Tab 1: Book Inspection**: Choose Physical On-Site or Live WhatsApp Video Tour with preferred date/time slot. Syncs directly to the user's account and database.
- **Tab 2: Specialized Dynamic Tab**:
  - *Short Let Properties*: Nightly rate calculator, caution deposit (₦50,000), housekeeping fee, and WhatsApp host reservation.
  - *Joint Venture Properties*: Land equity valuation, construction financing feasibility, and JV mandate submission.
  - *Sale/Rent Properties*: Nigerian mortgage amortization calculator with typical 18-21% interest rate and loan term slider.
- **Tab 3: AI Real Estate Due Diligence**: Automated valuation and title safety assessment.

### 8.4 Joint Venture (JV) & Off-Plan Development Hub
- **JV Equity Sharing Calculator**: Models clean land contribution vs developer construction costs to determine equitable sharing ratios and goodwill premium.
- **5-Stage Off-Plan Milestone Payment Planner**:
  1. *Foundation & Piling* (20%)
  2. *Ground Floor to Raft Slab* (20%)
  3. *Carcass & Roofing Structure* (25%)
  4. *MEP, Plastering & Glazing* (20%)
  5. *Handover & Snagging* (15%)
- **Active JV Mandates**: Real proposals in Bourdillon Ikoyi, Katampe Abuja, Admiralty Lekki, and Old GRA Port Harcourt.
- **Legal Safeguards**: Irrevocable Power of Attorney (POA), Joint Development Agreement (JDA), and Bank Performance Bonds.

### 8.5 Closing Costs & Statutory Fees Calculator
- Calculates the true "cash-to-close" amount for Nigerian property acquisitions:
  - **Governor's Consent & Registration Fee**: ~3% in Lagos / 2.5% in Abuja AGIS.
  - **Federal / State Stamp Duty**: ~1.5%.
  - **Legal / Conveyancing Fee**: 5% (NBA property conveyancing standard).
  - **Agency Brokerage Commission**: 5% standard.
  - **Survey Plan & Charting Fee**: ₦450,000 flat.

---

## 9. Nigerian Real Estate Domain Knowledge

| Concept | Explanation in Nigerian Context |
| :--- | :--- |
| **Land Use Act of 1978** | Federal law vesting all state lands in the State Governor, who holds it in trust. Individuals own 99-year leaseholds, not absolute freehold. |
| **Governor's Consent** | Required for any subsequent assignment, mortgage, or transfer of land that already has a C of O. Without it, legal ownership is not perfected. |
| **Gazette / Excision** | Official government publication legally carving out ancestral community land from government acquisition. Safe root of title. |
| **Boys Quarters (BQ)** | Detached or semi-detached self-contained domestic staff room common in Nigerian luxury houses and duplexes. |
| **24/7 Power / Dual Gen** | Uninterrupted electricity provided by dedicated community generators, solar inverters, or independent power plants (IPP), critical in Nigerian listings. |
| **Industrial Water Treatment** | On-site reverse osmosis or multi-stage filtration system installed on boreholes to guarantee drinkable clean water. |
| **LASRERA** | Lagos State Real Estate Regulatory Authority. Official regulatory agency licensing vetted realtors and brokers. |

---

## 10. Directory Structure

```
├── src/
│   ├── app/                           # Next.js routes, API handlers, and global styles
│   ├── assets/images/                 # Local property imagery
│   ├── components/                    # Marketplace UI components
│   ├── contexts/                      # Authentication and inspection state
│   ├── hooks/                         # Shared React hooks
│   └── lib/                           # Authentication, database, and property data
├── prisma/
│   └── schema.prisma                  # Relational PostgreSQL models for Prisma
├── public/                            # Public static assets
├── .env.example                       # Environment variables documentation
└── package.json                       # Dependencies & scripts
```

---

## 11. Running & Building Locally

### Prerequisites
- Node.js 20+
- npm or yarn

### Installation
```bash
npm install
```

Prisma Client is generated automatically before starting the development server or production build. To generate it manually, run:
```bash
npm run db:generate
```

### Environment Variables
Create a project-root `.env` file based on `.env.example` (do not create `.env.local`):
```env
# NeonDB Serverless PostgreSQL Connection String
DATABASE_URL="postgresql://USER:PASSWORD@YOUR_NEON_HOST/neondb?sslmode=require"

# JWT Secret for Session Authentication
JWT_SECRET="replace_with_a_unique_random_secret"

# Gemini API Key (Server-side)
GEMINI_API_KEY="replace_with_your_gemini_api_key"
```
Generate `JWT_SECRET` locally with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Keep `.env` private; it is ignored by Git.

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

## 12. Design System & Frontend Constitution

1. **Top Bar Contract**: Exactly 3 zones (Brand wordmark, single-line links, primary action button and user account controls).
2. **Zero-Pill Discipline**: Metadata is formatted as clean unboxed inline text separated by `·` rather than colored pill capsules.
3. **No Clutter & Anti-AI Slop**: Clean editorial typography and responsive functional controls.
4. **60-30-10 Palette**: 60% clean canvas (`bg-slate-50`), 30% structural surfaces (`border-slate-200`, `bg-white`), 10% Nigerian emerald green accent (`bg-emerald-800`).
5. **Tabular Numerals**: All currency figures and metrics use `tabular-nums` for clean visual alignment.
