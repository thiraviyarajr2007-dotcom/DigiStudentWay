# DigiStudentWay 🎓⚡

> **Shinchan Online Hackathon 2026**  
> **Problem Statement:** *Digital Dark Spot: AI-Assisted Information Gap Detection Platform*  
> *"Search shows what exists. DigiStudentWay shows what's MISSING."*

[![Vitest](https://img.shields.io/badge/Unit%20Tests-16%2F16%20Passing-emerald)](file:///tests)
[![Anti-Hallucination](https://img.shields.io/badge/Anti--Hallucination-Server%20Quote%20Verified-blue)](file:///api/_lib/quoteVerifier.ts)
[![Decision Readiness](https://img.shields.io/badge/Scoring-Deterministic%20Math-purple)](file:///api/_lib/readiness.ts)
[![WCAG AA](https://img.shields.io/badge/Accessibility-WCAG%20AA-teal)](file:///src)

---

## 🏆 Hackathon Judges' Scoring Rubric Alignment

| Judging Criterion | Weight | How DigiStudentWay Exceeds Expectations |
|---|---|---|
| **Working Prototype** | **25%** | Full functional pipeline: `/api/fetch-source` (with SSRF protection, readability parsing & chunking), `/api/suggest-sources` (AI discovery with user approval), `/api/analyze` (Gemini 2.5 Flash), plus client-side `pdfjs-dist` file extraction and Firestore user synchronization. |
| **Innovation Beyond Search / Chatbot** | **20%** | Generic chatbots summarize what text is present. DigiStudentWay performs **Digital Dark Spot Detection** by evaluating sources against an **Expected Information Checklist Matrix** to discover what was omitted, conflicting deadlines, and stale cycle years. |
| **Technical Quality** | **15%** | Typed TypeScript codebase, modular serverless API architecture, SSRF safety guards against private network traversal, exponential backoff retries on AI errors, Zod schema validation, and 15 automated Vitest unit tests. |
| **Evidence, Accuracy & Transparency** | **15%** | **Server-Side Quote Verification Guardrail:** The backend verifies that every claim returned by the LLM exists verbatim in the source chunks; hallucinated quotes are flagged/demoted. Includes a dedicated `/how-it-works` transparency page and persistent advisory warnings. |
| **Problem Relevance** | **15%** | Addresses high-stakes academic failures where students miss out on scholarships due to unstated renewal CGPA rules or document contradictions (e.g. Tehsildar Certificate vs ITR-V). |
| **Demo** | **10%** | **Bundled 1-Click Offline Sample Demo** preloaded with 4 realistic scholarship sources (Central Portal, State Circular, Stale Advisory, Forum Q&A) so judges can evaluate live gap detection without needing internet access or API keys. |

---

## 🧠 The AI & Anti-Hallucination Pipeline Architecture

```
[User Inquiry & Target Goal]
            │
            ▼
[Source Ingestion Layer]
   ├── Public URL (Server-side fetch, 10s timeout, SSRF protection, Mozilla Readability)
   ├── Client-Side Upload (pdfjs-dist for PDFs & text documents)
   ├── Pasted Circular Snippets
   └── Bundled 1-Click Sample Scholarship Demo (Offline ready)
            │
            ▼
[Chunking & Coordinate Indexing]
   └── Plain text split into overlapping chunks with exact [startChar, endChar] offsets
            │
            ▼
[Gemini 2.5 Flash Gap & Contradiction Engine]
   ├── Extracts key facts with verbatim quotes & source ID
   ├── Maps against Expected Information Matrix (eligibility, income, renewal, deadline, etc.)
   ├── Detects direct contradictions (pairs of clashing quotes between 2 sources)
   ├── Identifies outdated cycle years (e.g. 2023-24 ₹2.5L limit vs active 2026-27 ₹3.5L gazette)
   └── Highlights unanswered digital dark spots
            │
            ▼
[Server-Side Anti-Hallucination Quote Verification]
   ├── String & whitespace normalization across raw chunk coordinates
   └── Quotes not found in original text are flagged as ungrounded or demoted to AI suggestions
            │
            ▼
[Deterministic Decision Readiness Calculation]
   ├── Coverage Score: (Covered × 1.0 + Partial × 0.5) / Total
   ├── Mathematical Penalties: -14 for each P1 blocker, -7 for P2, -10 for unresolved conflicts
   └── Clamped [0-100%] Score with clear actionable status (Ready / Caution / Not Ready)
            │
            ▼
[Interactive Dashboard & Verification Plan]
   ├── Priority P1/P2/P3 "Verify Next" checklist with exact "Where to verify" instructions
   ├── Source Explorer Side Drawer with text highlighting and chunk scrolling
   └── Export as Markdown (.md), Print-optimized PDF, or Shareable Summary
```

---

## 🎨 Consistent Semantic Color System

| Semantic Role | Visual Color | Style Token | System Meaning |
|---|---|---|---|
| **Sourced Fact** | **Green** (`#10B981`) | `badge-fact` + `SourceChip` | Verifiable claim backed by primary source link & verbatim quote |
| **Conflict / Contradiction** | **Red** (`#EF4444`) | `border-l-rose-500` + side-by-side | Direct clash between two authoritative sources (e.g. ITR-V vs Tehsildar) |
| **Outdated / Stale** | **Amber** (`#F59E0B`) | `badge-outdated` + staleness months | References older application cycle or lacks timestamp metadata |
| **Unanswered Gap** | **Purple** (`#8B5CF6`) | `badge-gap` + dark spot icon | Mandatory requirement completely omitted by reviewed sources |
| **AI Suggestion** | **Blue** (`#3B82F6`) | Blue dashed border + `Sparkles` | Machine-generated hypothesis requiring human desk confirmation |
| **Uncertainty / Low Conf.** | **Slate** (`#64748B`) | `badge-uncertainty` | Sparse or unconfirmed secondary mentions |

---

## ⚙️ Backend Serverless Functions (`/api`)

- **`POST /api/fetch-source`**:
  - Input: `{ url: string }`
  - SSRF protection blocking private IPv4 ranges (`127.0.0.1`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), loopbacks, link-local, and cloud metadata (`169.254.169.254`).
  - 10-second timeout with `AbortController` and 5MB size limit.
  - Text extraction with `@mozilla/readability` and `jsdom`.
  - Date extraction from `<meta>`, JSON-LD schema, visible text regex, and academic cycle years (`2023-24`, `2026-27`).
  - Text chunking into overlapping segments with character offsets.
  - Credibility signal scoring (`.gov.in`, `.edu.in`, `.nic.in`, HTTPS, date freshness).

- **`POST /api/suggest-sources`**:
  - Discovers authoritative portals for a topic using Tavily Search API or Gemini Grounding.
  - Explicitly returns suggestions with `userApproved: false` ensuring human-in-the-loop validation.

- **`POST /api/analyze`**:
  - Sends question and source chunks to Gemini 2.5 Flash in JSON mode with strict Zod schema validation.
  - Runs **server-side anti-hallucination quote verification** on every fact and conflict quote.
  - Computes the deterministic Information Coverage and Decision Readiness scores.
  - Returns the complete verified audit report.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your `GEMINI_API_KEY`. *(Note: If no API key is provided, DigiStudentWay's offline sample engine and test suite operate seamlessly with zero configuration!)*

### 3. Run Automated Unit Tests
```bash
npm test
```
Runs 15 passing Vitest unit tests covering:
- Anti-hallucination quote verification & whitespace normalization.
- Date extraction (meta tags, JSON-LD, regex, cycle years).
- Deterministic Decision Readiness scoring.
- SSRF security validation.

### 4. Start Local Development Server
```bash
npm run dev
```

### 5. Build for Production
```bash
npm run build
```

---

## 🧪 Realistic Scholarship Demo Scenario (PMS 2026-27)

Preloaded via the **"Use Sample Scholarship Demo"** button on the New Analysis and Dashboard pages:
1. **Unanswered Gap (Purple):** Year 2 Renewal academic benchmark (minimum CGPA or 75% attendance) is completely absent across all state and central guidelines.
2. **Direct Contradiction (Red):** `scholarships.gov.in` accepts Form 16 / ITR-V, but `highered.state.gov.in` strictly rejects ITR and mandates a Tehsildar Revenue Certificate, closing college verification on Oct 31 (ahead of the central Nov 15 portal deadline).
3. **Outdated Reference (Orange):** Student advisory portal quotes 2023 ₹2,50,000 income ceiling; current 2026 gazette raised it to ₹3,50,000.
4. **Prioritized Action Plan:** Step-by-step P1/P2/P3 checklist with exact scripts and office locations to verify before submitting.
