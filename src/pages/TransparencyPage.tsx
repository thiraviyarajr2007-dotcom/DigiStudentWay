import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';

export const TransparencyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Ethics, Methodology & Limitations</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
          How DigiStudentWay Works & Its Limitations
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          DigiStudentWay is an assistive verification system designed to help students discover unstated prerequisites, document contradictions, and outdated terms. Here is complete transparency on how we process documents and where AI can err.
        </p>
      </div>

      {/* Section 1: The 4-Layer Verification Architecture */}
      <section className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          The 4-Layer Evidence Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-accent">
                Layer 1: Chunk Offsets
              </span>
              <Badge variant="fact" size="sm">Provenance</Badge>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Deterministic Text Ingestion
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every ingested HTML portal or uploaded PDF is split into overlapping chunks with character offsets (`startChar`, `endChar`). We never pass raw uncontrolled context without exact coordinate markers.
            </p>
          </Card>

          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
                Layer 2: Matrix Scan
              </span>
              <Badge variant="gap" size="sm">Dark Spot Detection</Badge>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Expected Attribute Matrix
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard chatbots answer what is present. DigiStudentWay matches against a required checklist (eligibility, income proof, renewal threshold, application link) to find what is <strong>absent</strong>.
            </p>
          </Card>

          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] border-l-4 border-l-blue-500 shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Layer 3: Guardrail
              </span>
              <Badge variant="ai" size="sm">Anti-Hallucination</Badge>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Server-Side Quote Verification
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              When the AI extracts a fact or conflict quote, our server runs normalized substring verification against the source chunks. If the quote does not exist verbatim, it is flagged or demoted to an unverified hypothesis.
            </p>
          </Card>

          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Layer 4: Math Scoring
              </span>
              <Badge variant="brand" size="sm">Deterministic</Badge>
            </div>
            <h3 className="font-heading font-bold text-sm text-white">
              Deterministic Decision Readiness
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our 0-100% Decision Readiness Score is calculated with a strict mathematical penalty formula based on unverified P1 items and conflicting clauses, rather than generated by an LLM prompt.
            </p>
          </Card>
        </div>
      </section>

      {/* Section 2: Why AI Can Be Wrong */}
      <section className="p-6 sm:p-8 rounded-3xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl space-y-4 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-lg text-amber-200">
              Why AI Can Be Wrong: Known Failure Modes
            </h2>
            <p className="text-xs text-amber-300/80">
              High-stakes government applications require human discernment.
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
          <p>
            • <strong>OCR & Scanned Gazettes:</strong> Some state education circulars are uploaded as scanned low-resolution image PDFs. Text extraction can miss numbers or confuse dates.
          </p>
          <p>
            • <strong>Unwritten Institutional Practices:</strong> College financial aid desks often enforce localized customs that are never published in gazettes (e.g. asking for college-specific bona fide forms).
          </p>
          <p>
            • <strong>Jurisdictional Nuances:</strong> A central guideline might say Form 16 is permitted, but state quota reservations may legally override this rule without notifying the central portal team.
          </p>
          <p>
            • <strong>AI Misinterpretations:</strong> Even with anti-hallucination quote verification, LLMs can misread complex nested legal clauses or exception provisos.
          </p>
        </div>
      </section>

      {/* Section 3: Student Golden Verification Rules */}
      <section className="space-y-4">
        <h2 className="font-heading font-bold text-xl text-white">
          The 4 Golden Rules for Every Student
        </h2>

        <div className="space-y-3">
          {[
            {
              title: '1. Use findings as an inquiry checklist, not legal truth',
              desc: 'When DigiStudentWay flags that renewal criteria are missing or income documents conflict, bring that exact inquiry to your college nodal officer or registrar.',
            },
            {
              title: '2. Check the original source link',
              desc: 'Click on the SourceChip or drawer quote to inspect the original circular snapshot and verify the date.',
            },
            {
              title: '3. Respect State Nodal Authority overrides',
              desc: 'State circulars for state-allocated quotas almost always supersede generic central portal defaults during college verification.',
            },
            {
              title: '4. Submit before college desk review cut-offs',
              desc: 'Never wait until the final portal deadline. Institutional verification windows close 3 to 10 days earlier.',
            },
          ].map((rule, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="font-heading font-bold text-sm text-white">
                  {rule.title}
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {rule.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="pt-4 flex items-center justify-between border-t border-white/10">
        <Link to="/app/analysis/demo">
          <Button variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Explore Active Audit
          </Button>
        </Link>
        <Link to="/app/new">
          <Button variant="outline" size="md">
            Start New Verification Scan
          </Button>
        </Link>
      </div>
    </div>
  );
};
