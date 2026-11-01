# Project: DigiStudentWay — Premium Dark AI SaaS Restyle

## Architecture
- **Framework**: React 18 + Vite 5 + TypeScript + Tailwind CSS 3
- **Routing**: React Router DOM (`src/App.tsx`), protected application layout under `/app`
- **State & Providers**: `ThemeProvider` (`src/lib/theme.tsx`), `AuthProvider` (`src/lib/authContext.tsx`), `ToastProvider` (`src/components/common/Toast.tsx`)
- **Backend / Serverless**: Next/Vercel serverless functions in `api/` (`analyze.ts`, `fetch-source.ts`, `health.ts`, `suggest-sources.ts`, `api/_lib/`)
- **Persistence**: Firebase Firestore + LocalStorage fallback for Guest mode (`src/lib/firebase.ts`)
- **Design System**: Dark-first AI SaaS theme (#080D1B canvas, #101A2E cards, #3B82F6/#8B5CF6 gradients, #22D3EE cyan accents), Space Grotesk headings, Inter body, glassmorphism, semantic badges.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Design Tokens & CSS Variables | Tokens defined in `:root` and `.dark` in `src/index.css` (#080D1B, #101A2E, #3B82F6, #8B5CF6, #22D3EE, text colors) | M1 | survey_1, R1 |
| 2 | Tailwind Theme Extensions | Tailwind color aliases, fonts, shadows, and semantic colors mapped in `tailwind.config.js` | M1 | survey_1, R1 |
| 3 | Fonts Architecture | Google Fonts import of Space Grotesk and Inter with `display=swap` in `index.html` and Tailwind font-family mapping | M1 | survey_1, R1 |
| 4 | Dark Mode Default & Light Toggle | Initializing theme to 'dark' by default in `src/lib/theme.tsx` and `<html class="dark">` while keeping toggle operational | M1 | survey_1, R1 |
| 5 | Glassmorphism & Corner Radial Glow | Updating `.glassmorphism` card utility and `.bg-radial-glow` in `src/index.css` with 150-250ms transitions and reduced-motion guard | M1 | survey_1, R3 |
| 6 | Scrollbars & Selection Styling | SaaS custom scrollbars and cyan selection highlight in `src/index.css` | M1 | survey_1, R3 |
| 7 | /app Left Sidebar Navigation | Left sidebar for authenticated/guest `/app` routes with logo on glass chip, items: New Analysis, History, Settings, How it works, and active gradient pill | M2 | survey_2, R2 |
| 8 | /app Top Bar Navigation | Top bar with search-style question input shortcut, theme toggle, and user avatar dropdown menu | M2 | survey_2, R2 |
| 9 | Mobile Responsive Collapse | Sidebar collapses into topbar/drawer navigation at mobile viewport (360px) | M2 | survey_2, R2 |
| 10 | Logo Preservation & Glass Chip | Preserve `public/logo.png` in navbar, sidebar, favicon, and OG image with subtle glass chip isolation | M2 | survey_2, R2 |
| 11 | Landing Page Hero Restyle | Dark gradient with blue/purple glow orbs, "dark spot" document animation as hero visual, gradient headline on "MISSING", glowing CTA "Try Sample Demo" | M3 | survey_2, R3 |
| 12 | Dashboard Stat Cards & Gauge | 5 KPI summary stat cards with glowing icons; Decision Readiness large circular gradient gauge in `ConfidenceMeter.tsx` | M3 | survey_2, R3 |
| 13 | Dashboard Tabs & Glass Drawer | Pill tabs; glassmorphic `SourceDrawer.tsx` with amber quoted text highlight | M3 | survey_2, R3 |
| 14 | Domain Analysis & Trust Components | `SourceAgreementMatrix.tsx` and `TrustPanel.tsx` restyled to dark glass, operating cleanly on both sample demo and real URLs | M3 | survey_2, R3 |
| 15 | Fallback Paste-Text Input | Preserving and styling the inline fallback textarea on `NewAnalysisPage.tsx` when URL fetch fails | M3 | survey_2, R3 |
| 16 | UI Primitives Restyle | Restyle `Button`, `Card`, `Badge`, `Modal`, `Toast`, `SkeletonLoader` to dark glass with 2px hover lift, cyan focus rings, and semantic colors | M3 | survey_2, R3 |
| 17 | Additional Pages Restyle | Apply theme across AuthPage, HistoryPage, Profile/Settings, Transparency, Privacy, Status, and NotFound pages | M3 | survey_2, R2 |
| 18 | Strict Logic & Route Preservation | Strictly preserve all routes (`tests/linkAudit.test.ts`), serverless API contracts, auth flow, and data formats | M1-M5 | survey_3, R4 |
| 19 | Responsive Viewports QA | Verify 360px, 768px, and 1280px viewports with zero horizontal scroll and zero text overflow | M4 | survey_3, AC |
| 20 | WCAG AA Contrast Compliance | Verify every text/background pair meets WCAG AA contrast ratios | M4 | survey_1, AC |
| 21 | Vitest Suite & Build QA | Verify all 18 Vitest unit tests pass and `npm run build` succeeds | M4 | survey_3, AC |
| 22 | Secret Scanning | Verify zero exposed API keys, credentials, or private secrets in repo | M5 | AC |
| 23 | Git Commit & Push | Commit with message "style: premium dark AI theme" and push to main branch | M5 | AC |
| 24 | Final 6-line Report | Deliver final executive summary to Sentinel in exactly 6 lines | M5 | AC |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Design Tokens & Theme Architecture | `index.html`, `tailwind.config.js`, `src/index.css`, `src/lib/theme.tsx` | none | DONE |
| M2 | Application Layout & Navigation Shells | `src/components/layout/AppLayout.tsx`, `ProtectedRoute.tsx`, `Navbar.tsx`, sidebar, mobile drawer | M1 | DONE |
| M3 | Landing, Dashboard & UI Components Restyle | `LandingPage.tsx`, `DashboardPage.tsx`, `NewAnalysisPage.tsx`, `AuthPage.tsx`, `HistoryPage.tsx`, UI primitives & domain components | M2 | IN_PROGRESS |
| M4 | Responsive Polish, WCAG AA Contrast, Vitest & Build QA | Viewport verification (360px, 768px, 1280px), WCAG AA checks, `npm test` (18/18 tests), `npm run build` | M3 | PLANNED |
| M5 | Secret Scan, Git Commit & Push, Final Reporting | Secret scan, git commit "style: premium dark AI theme", git push to main, 6-line report | M4 | PLANNED |

## Interface Contracts
### `src/lib/theme.tsx` ↔ Application Components
- Hook: `useTheme(): { theme: 'light' | 'dark', toggleTheme: () => void, setTheme: (theme: 'light' | 'dark') => void }`
- Invariant: HTML root class `dark` toggled, stored in `localStorage['digi_theme']`, default is `'dark'`.

### `src/components/layout/AppLayout.tsx` ↔ Route Pages
- Wraps `/app/*` protected routes (`NewAnalysisPage`, `DashboardPage`, `HistoryPage`, `ProfilePage`).
- Provides sidebar, top bar, search shortcut, theme toggle, and mobile collapse.
- Outlet rendering preserves all page props, route params, and state.

### `tests/linkAudit.test.ts` ↔ Navigation Links
- All `<Link to="...">` and `navigate(...)` must resolve strictly to registered routes:
  `/`, `/auth`, `/how-it-works`, `/privacy`, `/status`, `/app/new`, `/app/analysis/:id`, `/app/history`, `/app/settings`.

## Code Layout
- `index.html`: Entry point, Google Fonts, theme color, dark class.
- `src/index.css`: Tailwind directives, CSS variables, glassmorphic utilities, custom scrollbars, animations.
- `tailwind.config.js`: Palette, fonts, box shadows, semantic status mappings.
- `src/lib/theme.tsx`: Theme provider with dark default.
- `src/components/layout/`: Global navigation components (`Navbar.tsx`, `Footer.tsx`, `ProtectedRoute.tsx`, `AppLayout.tsx`, `Sidebar.tsx`).
- `src/components/common/`: UI primitives (`Button.tsx`, `Card.tsx`, `Badge.tsx`, `Modal.tsx`, `Toast.tsx`, `ConfidenceMeter.tsx`, `SkeletonLoader.tsx`).
- `src/components/domain/`: Domain components (`SourceAgreementMatrix.tsx`, `TrustPanel.tsx`, `SourceDrawer.tsx`, `ConflictCard.tsx`, `GapCard.tsx`, `ChecklistItem.tsx`).
- `src/pages/`: Page components (`LandingPage.tsx`, `AuthPage.tsx`, `DashboardPage.tsx`, `NewAnalysisPage.tsx`, `HistoryPage.tsx`, `ProfilePage.tsx`, `TransparencyPage.tsx`, `PrivacyPage.tsx`, `StatusPage.tsx`, `NotFoundPage.tsx`).
- `tests/`: 6 Vitest test suites (18 unit tests). STRICTLY READ-ONLY.
