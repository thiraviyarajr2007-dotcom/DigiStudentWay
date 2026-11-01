# DigiStudentWay - Authentication & Firebase Setup Guide

> **Shinchan Online Hackathon 2026**  
> Problem: *Digital Dark Spot - AI-Assisted Information Gap Detection*

This document provides step-by-step instructions for configuring Firebase Authentication, Google Sign-in, Facebook Login, Firestore, and deployment domains.

---

## 🔒 Security Notice: Zero Secret Leakage

- **NEVER** place the **Facebook App Secret**, **Gemini API Key**, or **OpenRouter API Key** in frontend client code, repository commits, or client-side `.env` files.
- The Facebook App Secret is entered **exclusively inside the Firebase Console** under the Facebook provider settings.
- The `GEMINI_API_KEY` and `OPENROUTER_API_KEY` are accessed **only on the serverless backend (`/api/`)** via environment variables.

---

## ⚡ 3-Tier AI Provider Fallback Architecture

DigiStudentWay implements an enterprise-grade resilient AI pipeline:
1. **Tier 1 (Primary):** Google Gemini REST API (`gemini-2.5-flash`, with auto-fallback to `gemini-flash-latest` on 404/429/5xx).
2. **Tier 2 (Fallback):** OpenRouter REST API (`google/gemini-2.0-flash-001`, with auto-fallback to `meta-llama/llama-3.3-70b-instruct:free`).
3. **Tier 3 (Offline Guaranteed):** Deterministic verification engine for offline sample scholarship demonstrations (zero network needed).

To configure in Vercel or locally (`.env.local`):
```bash
GEMINI_API_KEY=your_gemini_api_key_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

### Verification & Health Endpoint
Verify active provider connections at:
- `GET /api/health` ➔ Returns `{ gemini: boolean, openrouter: boolean, firebase: boolean }` (never returns raw keys).
- Or visit the hidden monitor page in the app at `/status`.

---

## 1. Firebase Project Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named `DigiStudentWay` (or use an existing project).
3. Under **Project Settings > General > Your apps**, register a Web app (`</>`).
4. Copy the web config keys and populate them in your `.env`:
   ```bash
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef123456
   ```

---

## 2. Enable Authentication Providers

In Firebase Console, navigate to **Build > Authentication > Sign-in method**:

### A. Google Sign-In
1. Click **Google** in the provider list.
2. Toggle **Enable**.
3. Set your project support email and save.

### B. Email / Password
1. Click **Email/Password**.
2. Toggle **Email/Password** to **Enable**.
3. (Optional) Enable Email link (passwordless sign-in) if desired.
4. Save.

### C. Facebook Sign-In (App ID: `3418668748341022`)
1. Click **Facebook** in the provider list.
2. Toggle **Enable**.
3. Enter the **App ID**: `3418668748341022`.
4. Enter your confidential **App Secret** into the Firebase Console input field. *(Do NOT commit this to code or .env!)*
5. Copy the **OAuth redirect URI** displayed in Firebase Console (e.g. `https://<your-project>.firebaseapp.com/__/auth/handler`).
6. Open the [Meta for Developers Console](https://developers.facebook.com/apps/3418668748341022/):
   - Navigate to **Facebook Login > Settings**.
   - Under **Client OAuth Settings**, locate **Valid OAuth Redirect URIs**.
   - Paste the OAuth redirect URI copied from Firebase.
   - Click **Save Changes**.

---

## 3. Authorized Domains

In Firebase Console under **Authentication > Settings > Authorized domains**, add:
- `localhost` (Default for local development)
- `127.0.0.1`
- Your production Vercel deployment domain: `*.vercel.app` (or custom domain)

---

## 4. Firestore Database Security Rules

1. Navigate to **Firestore Database** in Firebase Console.
2. Create database in production mode.
3. Apply the rules provided in [`firestore.rules`](./firestore.rules):
   ```text
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         match /analyses/{analysisId} {
           allow read, write: if request.auth != null && request.auth.uid == userId;
         }
       }
       match /{document=**} {
         allow read, write: if false;
       }
     }
   }
   ```
4. Deploy the rules via Firebase CLI:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 5. Local Offline Fallback Mode

If no Firebase credentials are configured in `.env`, **DigiStudentWay automatically boots into resilient Local-Storage Fallback Mode**. Judges can click **"Try Sample Demo"** or **"Hackathon Judge Quick Login"** to run full analysis, view dark spots, and test the platform with zero configuration blockers.

