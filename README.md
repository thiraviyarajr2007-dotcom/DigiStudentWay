# DigiStudentWay

An AI-assisted cross-source verification platform that identifies information gaps, conflicting requirements, and outdated details across official publications before key decisions are made.

---

## The Problem

When individuals research critical applications—such as education admissions, job offers, government services, research studies, and regulatory requirements—they must synthesize fragmented documents from multiple sources.

Standard search engines and generic conversational assistants summarize only what is explicitly present in the provided text. They fail to identify what was **omitted**, mask **contradictory clauses** behind polite prose, and overlook **outdated deadlines** or circular cycles. This creates blind spots ("information dark spots") that lead to rejected applications, forfeited fees, or unexpected contractual liabilities.

---

## What DigiStudentWay Does

1. **Multi-Source Ingestion**: Collects and ingests multiple documents via public web links, uploaded files, pasted text, or approved source suggestions.
2. **Decision Checklist Cross-Examination**: Evaluates sources against dynamic decision-maker checklists (e.g. eligibility thresholds, deadlines, document formats, renewal conditions, refund terms).
3. **Information Gap Detection**: Identifies critical requirements that none of the consulted documents address, formulating exact inquiries for users to bring to administrative authorities.
4. **Contradiction Resolution**: Pinpoints directly conflicting claims between sources side by side with verbatim quoted provenance.
5. **Staleness & Cycle Warnings**: Detects outdated regulations, expired years, or undated advisory pages.
6. **Prioritized Action Plan**: Generates an actionable, prioritized (P1/P2/P3) verification checklist specifying exactly which desk or official contact to verify with.
7. **Deterministic Readiness Scoring**: Calculates an objective 0–100% readiness score penalized mathematically by unverified blocking items and unresolved contradictions.

---

## How to Run Locally

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation & Setup

1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/thiraviyarajr2007-dotcom/DigiStudentWay.git
   cd DigiStudentWay
   npm install
   ```

2. Copy the sample environment file and configure necessary variables:
   ```bash
   cp .env.example .env.local
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Run automated test suites:
   ```bash
   npm test
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Limitations

- **Assistive Advisory Only**: DigiStudentWay highlights potential gaps and possible contradictions to guide user inquiries; findings do not constitute legal advice or formal administrative determinations.
- **Scanned Document Quality**: Scanned or low-resolution image files depend on OCR readability and may occasionally miss numbers or dates.
- **Localized Authority Precedence**: Regional or departmental desks may operate under unpublished administrative customs that override public portals.
- **Human Verification Required**: All flagged gaps and conflicting terms should be confirmed directly with designated institutional officers before formal submission.
