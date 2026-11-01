import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, EyeOff, Server, FileText, ArrowLeft } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero PII & Data Protection</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white">
          Privacy Policy & Security Architecture
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          DigiStudentWay is built on the principle of <strong>Zero Personally Identifiable Information (PII) harvesting</strong>. Academic applicants should never have their personal identity, marks, or family financial secrets collected by an audit tool.
        </p>
      </div>

      {/* Core Guarantees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800 flex items-center justify-center text-brand-teal mb-3">
            <EyeOff className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
            Zero Student PII
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            We only scan public notices, government circulars, and university guidelines. We do not require or store student Aadhaar, PAN, roll numbers, or personal tax records.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 mb-3">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
            Client-Side Document Parsing
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            PDF circulars uploaded by users are parsed locally inside the browser using `pdfjs-dist`. Raw binary files are never stored on external cloud storage.
          </p>
        </Card>

        <Card className="p-5 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/80 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">
            User-Isolated Firestore
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Your saved audit checklists are protected by Firestore security rules (<code>users/&#123;userId&#125;/analyses/**</code>). No other user or third-party can read your saved audits.
          </p>
        </Card>
      </div>

      {/* Detailed Provisions */}
      <Card className="p-6 sm:p-8 space-y-5">
        <h2 className="font-heading font-bold text-lg text-slate-900 dark:text-white">
          Information We Process
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            <strong>1. Public URLs & Notice Texts:</strong> When you provide a government portal URL or paste text from a scholarship circular, our backend fetches the page using SSRF-safe protocols to extract clauses, dates, and requirements.
          </p>
          <p>
            <strong>2. Authentication Credentials:</strong> When signing in with Google or Facebook, authentication tokens are handled securely by Firebase Auth. We only store your email address and chosen display name to maintain your audit history.
          </p>
          <p>
            <strong>3. AI Processing:</strong> Ingested public notice chunks are transmitted to Gemini 2.5 Flash strictly for clause comparison and gap identification. We do not use your audits to train public AI models.
          </p>
          <p>
            <strong>4. Data Deletion:</strong> You have full sovereignty over your history. Clicking the delete icon on the History page immediately wipes the audit from both local storage and Firestore.
          </p>
        </div>
      </Card>

      <div className="pt-4 flex items-center justify-between">
        <Link to="/">
          <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Back to Home
          </Button>
        </Link>
        <Link to="/app/new">
          <Button variant="primary" size="md">
            Start An Audit
          </Button>
        </Link>
      </div>
    </div>
  );
};
