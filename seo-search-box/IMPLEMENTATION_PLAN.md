# SEO Search Box - Implementation Plan

## Overview
A comprehensive SEO research tool that accepts multiple input types and returns rich, actionable data from multiple API sources, stored in a database for historical tracking.

---

## 1. Input Types & Detection

### Smart Input Parser
Automatically detect and categorize inputs:

| Input Type | Detection Method | Example |
|------------|------------------|---------|
| **Keyword** | Default (no URL/phone pattern) | "best running shoes" |
| **URL** | URL regex, extract domain | "https://example.com/page" → "example.com" |
| **Business Name** | User selection or NLP heuristics | "Acme Corporation" |
| **Phone Number** | Phone regex (various formats) | "(555) 123-4567", "+1-555-123-4567" |

---

## 2. Output Data by Input Type

### A. Keyword Input → Keyword Analysis
- Search volume (monthly, trend over time)
- Cost per click (CPC) - min, max, average
- Competition level (0-100 scale)
- Keyword difficulty score
- Related keywords (semantic, LSI)
- Long-tail variations
- Questions containing keyword
- SERP features present (featured snippets, PAA, local pack)
- Top ranking URLs for keyword
- Seasonal trends

### B. URL Input → Domain & Page Analysis
- **Domain Data:**
  - Domain authority/rating
  - Backlink count & quality
  - Referring domains
  - Organic traffic estimate
  - Top organic keywords
  - WHOIS information (registrar, creation date, expiry, registrant)

- **Page Data:**
  - Page title, meta description, H1-H6 tags
  - Word count
  - Word frequency analysis
  - Content readability score
  - Internal/external link count
  - Image count & alt text analysis
  - Schema markup present
  - Page speed metrics
  - Mobile friendliness

- **Business Information:**
  - Business name (if detectable)
  - Address
  - Phone number
  - Social media profiles
  - LinkedIn company page

### C. Phone Number Input → Business Lookup
- Business name
- Address
- Website URL
- Business category
- Reviews/ratings
- Social profiles
- Related businesses

### D. Business Name Input → Business Intelligence
- Website URL
- Address(es)
- Phone number(s)
- LinkedIn profiles (company + key personnel)
- Social media presence
- Domain information
- Competitors

---

## 3. API Strategy & Cost Projections

### Primary APIs

#### 1. DataForSEO API (Primary SEO Data)
**Endpoints Used:**
- `/keywords_data/google/search_volume` - $0.0006 per keyword
- `/keywords_data/google/keyword_suggestions` - $0.0015 per request
- `/backlinks/summary` - $0.002 per request
- `/on_page/instant_pages` - $0.002 per page
- `/serp/google/organic` - $0.002 per request
- `/domain_analytics/whois` - $0.001 per request

**Monthly Cost Estimate (10,000 searches):**
| Feature | Requests | Cost/Request | Monthly Cost |
|---------|----------|--------------|--------------|
| Search Volume | 10,000 | $0.0006 | $6.00 |
| Keyword Suggestions | 5,000 | $0.0015 | $7.50 |
| Backlinks | 3,000 | $0.002 | $6.00 |
| On-Page Analysis | 3,000 | $0.002 | $6.00 |
| SERP Data | 5,000 | $0.002 | $10.00 |
| WHOIS | 2,000 | $0.001 | $2.00 |
| **Subtotal** | | | **$37.50** |

#### 2. Google APIs
**Custom Search JSON API:**
- 100 queries/day free
- $5 per 1,000 queries after
- Use for: SERP verification, content analysis

**PageSpeed Insights API:**
- Free (with rate limits)
- Use for: Page speed metrics, Core Web Vitals

**Google My Business API:**
- Free (with rate limits)
- Use for: Business information lookup

**Monthly Cost Estimate:**
- Custom Search: ~$25 (5,000 queries)
- PageSpeed: Free
- GMB: Free

#### 3. Bing Web Search API
- $3 per 1,000 transactions (S1 tier)
- Use for: Alternative SERP data, market share comparison

**Monthly Cost Estimate:** ~$15 (5,000 queries)

#### 4. Clearbit API (Business Intelligence)
- Free tier: 50 API calls/month
- Growth: $99/month for 1,000 calls
- Use for: Company enrichment, contact finding

**Monthly Cost Estimate:** $99 (Growth tier)

#### 5. Hunter.io API (Email/Contact Finding)
- Free: 25 searches/month
- Starter: $49/month for 500 searches
- Use for: Contact discovery from domains

**Monthly Cost Estimate:** $49

#### 6. WhoisXML API (WHOIS Data)
- 500 free credits
- $9/month for 500 queries
- Alternative to DataForSEO WHOIS

**Monthly Cost Estimate:** $9

#### 7. LinkedIn API (via Proxycurl or similar)
- Proxycurl: $0.01 per profile
- Use for: Company profiles, employee data

**Monthly Cost Estimate:** ~$50 (5,000 lookups)

### Total Monthly API Cost Projection

| Tier | Searches/Month | Estimated Cost |
|------|----------------|----------------|
| **Starter** | 1,000 | ~$50 |
| **Growth** | 10,000 | ~$285 |
| **Scale** | 50,000 | ~$1,000 |
| **Enterprise** | 100,000+ | ~$2,500+ |

---

## 4. Database Schema

### PostgreSQL Database

```sql
-- Core tables
CREATE TABLE searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    input_type VARCHAR(20) NOT NULL, -- 'keyword', 'url', 'phone', 'business'
    input_value TEXT NOT NULL,
    normalized_value TEXT, -- cleaned/standardized input
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE keyword_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID REFERENCES searches(id),
    keyword TEXT NOT NULL,
    search_volume INTEGER,
    cpc_low DECIMAL(10,2),
    cpc_high DECIMAL(10,2),
    cpc_avg DECIMAL(10,2),
    competition DECIMAL(5,4),
    difficulty INTEGER,
    trend_data JSONB, -- monthly trend array
    serp_features JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE related_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword_data_id UUID REFERENCES keyword_data(id),
    keyword TEXT NOT NULL,
    search_volume INTEGER,
    cpc DECIMAL(10,2),
    relevance_score DECIMAL(5,4),
    keyword_type VARCHAR(20) -- 'related', 'question', 'long_tail'
);

CREATE TABLE domain_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID REFERENCES searches(id),
    domain TEXT NOT NULL,
    domain_authority INTEGER,
    backlink_count INTEGER,
    referring_domains INTEGER,
    organic_traffic INTEGER,
    organic_keywords INTEGER,
    whois_data JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE page_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID REFERENCES searches(id),
    url TEXT NOT NULL,
    title TEXT,
    meta_description TEXT,
    h1_tags JSONB,
    word_count INTEGER,
    word_frequency JSONB,
    readability_score DECIMAL(5,2),
    internal_links INTEGER,
    external_links INTEGER,
    images INTEGER,
    schema_types JSONB,
    page_speed_mobile INTEGER,
    page_speed_desktop INTEGER,
    core_web_vitals JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE business_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    search_id UUID REFERENCES searches(id),
    business_name TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    phone TEXT,
    website TEXT,
    linkedin_url TEXT,
    social_profiles JSONB,
    category TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Historical tracking views
CREATE VIEW keyword_trends AS
SELECT
    k.keyword,
    k.search_volume,
    k.cpc_avg,
    k.created_at,
    LAG(k.search_volume) OVER (PARTITION BY k.keyword ORDER BY k.created_at) as prev_volume,
    k.search_volume - LAG(k.search_volume) OVER (PARTITION BY k.keyword ORDER BY k.created_at) as volume_change
FROM keyword_data k
ORDER BY k.keyword, k.created_at;

-- Indexes for performance
CREATE INDEX idx_searches_input ON searches(input_type, normalized_value);
CREATE INDEX idx_keyword_data_keyword ON keyword_data(keyword);
CREATE INDEX idx_domain_data_domain ON domain_data(domain);
CREATE INDEX idx_business_data_name ON business_data(business_name);
CREATE INDEX idx_searches_created ON searches(created_at);
```

---

## 5. Technical Architecture

### Stack
- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **Backend:** Next.js API Routes (or separate Node.js/Express)
- **Database:** PostgreSQL (Supabase or self-hosted)
- **Caching:** Redis (for API response caching)
- **Queue:** Bull/BullMQ (for async API calls)
- **Hosting:** Vercel (frontend) + Railway/Render (backend services)

### Architecture Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Smart Input │  │   Results   │  │   Historical Charts     │ │
│  │    Parser   │  │   Display   │  │   & Comparisons         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Gateway / Routes                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   /search   │  │  /history   │  │      /export            │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
┌─────────────────┐  ┌─────────────┐  ┌─────────────────┐
│   Job Queue     │  │    Cache    │  │    Database     │
│   (BullMQ)      │  │   (Redis)   │  │  (PostgreSQL)   │
└─────────────────┘  └─────────────┘  └─────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Aggregation Layer                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │DataForSEO│ │ Google   │ │  Bing    │ │ Clearbit │ ...      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Implementation Phases

### Phase 1: Foundation
- [ ] Project setup (Next.js, TypeScript, Tailwind)
- [ ] Database schema creation (PostgreSQL)
- [ ] Smart input parser (detect input type)
- [ ] Basic UI components (search box, results layout)
- [ ] DataForSEO integration (keywords, backlinks)

### Phase 2: Core Features
- [ ] Keyword analysis module
- [ ] URL/Domain analysis module
- [ ] On-page content analysis
- [ ] WHOIS integration
- [ ] Google PageSpeed integration
- [ ] Results caching (Redis)

### Phase 3: Business Intelligence
- [ ] Phone number lookup integration
- [ ] Business name enrichment
- [ ] LinkedIn profile discovery
- [ ] Social media aggregation
- [ ] Clearbit integration

### Phase 4: Historical & Analytics
- [ ] Historical data tracking
- [ ] Trend visualization (charts)
- [ ] Change alerts/notifications
- [ ] Export functionality (CSV, PDF)
- [ ] Comparison views

### Phase 5: Advanced Features
- [ ] Bulk search capability
- [ ] API access for users
- [ ] Scheduled monitoring
- [ ] Competitor tracking
- [ ] Custom reports
- [ ] White-label options

---

## 7. File Structure

```
/seo-search-box
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main search interface
│   │   ├── layout.tsx               # Root layout
│   │   ├── results/
│   │   │   └── [id]/page.tsx        # Results page
│   │   ├── history/
│   │   │   └── page.tsx             # Search history
│   │   └── api/
│   │       ├── search/
│   │       │   └── route.ts         # Main search endpoint
│   │       ├── keyword/
│   │       │   └── route.ts         # Keyword data endpoint
│   │       ├── domain/
│   │       │   └── route.ts         # Domain analysis endpoint
│   │       ├── business/
│   │       │   └── route.ts         # Business lookup endpoint
│   │       └── history/
│   │           └── route.ts         # History endpoint
│   ├── components/
│   │   ├── SearchBox.tsx            # Smart input component
│   │   ├── InputTypeIndicator.tsx   # Shows detected input type
│   │   ├── ResultsPanel.tsx         # Main results container
│   │   ├── KeywordResults.tsx       # Keyword-specific results
│   │   ├── DomainResults.tsx        # Domain-specific results
│   │   ├── BusinessResults.tsx      # Business-specific results
│   │   ├── TrendChart.tsx           # Historical trend charts
│   │   └── ExportButton.tsx         # Export functionality
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts            # Drizzle ORM schema
│   │   │   ├── client.ts            # Database client
│   │   │   └── queries.ts           # Common queries
│   │   ├── api/
│   │   │   ├── dataforseo.ts        # DataForSEO client
│   │   │   ├── google.ts            # Google APIs client
│   │   │   ├── bing.ts              # Bing API client
│   │   │   ├── clearbit.ts          # Clearbit client
│   │   │   ├── hunter.ts            # Hunter.io client
│   │   │   └── whois.ts             # WHOIS client
│   │   ├── parsers/
│   │   │   ├── inputParser.ts       # Smart input detection
│   │   │   ├── urlParser.ts         # URL/domain extraction
│   │   │   └── phoneParser.ts       # Phone number parsing
│   │   ├── analyzers/
│   │   │   ├── contentAnalyzer.ts   # Page content analysis
│   │   │   └── wordFrequency.ts     # Word frequency analysis
│   │   ├── cache.ts                 # Redis caching layer
│   │   └── queue.ts                 # Job queue setup
│   ├── types/
│   │   ├── search.ts                # Search-related types
│   │   ├── keyword.ts               # Keyword data types
│   │   ├── domain.ts                # Domain data types
│   │   └── business.ts              # Business data types
│   └── hooks/
│       ├── useSearch.ts             # Search hook
│       └── useHistory.ts            # History hook
├── prisma/
│   └── schema.prisma                # Alternative: Prisma schema
├── drizzle/
│   └── migrations/                  # Database migrations
├── .env.example                     # Environment variables template
├── docker-compose.yml               # Local dev services (Postgres, Redis)
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

---

## 8. Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/seo_search

# Redis
REDIS_URL=redis://localhost:6379

# DataForSEO
DATAFORSEO_LOGIN=your_login
DATAFORSEO_PASSWORD=your_password

# Google APIs
GOOGLE_API_KEY=your_api_key
GOOGLE_CSE_ID=your_custom_search_engine_id

# Bing API
BING_API_KEY=your_bing_key

# Clearbit
CLEARBIT_API_KEY=your_clearbit_key

# Hunter.io
HUNTER_API_KEY=your_hunter_key

# Proxycurl (LinkedIn)
PROXYCURL_API_KEY=your_proxycurl_key

# WhoisXML
WHOISXML_API_KEY=your_whoisxml_key
```

---

## 9. Key Features Summary

### What Makes This "The World's Best"

1. **Smart Input Detection** - One box, any input type
2. **Comprehensive Data** - Multiple APIs aggregated into unified results
3. **Historical Tracking** - See changes over time, not just snapshots
4. **Cost Efficiency** - Tiered caching, smart API batching
5. **Speed** - Parallel API calls, aggressive caching
6. **Accuracy** - Cross-reference multiple data sources
7. **Actionable Insights** - Not just data, but recommendations
8. **Export & Integration** - CSV, PDF, API access

---

## 10. Next Steps

1. **Approve this plan** - Review and confirm approach
2. **Set up accounts** - Create API accounts for DataForSEO, Google, etc.
3. **Begin Phase 1** - Start with foundation and core integrations
4. **Iterate** - Build, test, refine based on real data

---

Ready to proceed with implementation upon approval.
