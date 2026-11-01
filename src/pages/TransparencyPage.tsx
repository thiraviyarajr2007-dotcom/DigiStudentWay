import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ArrowRight,
  AlertTriangle,
  Scale,
  CheckCircle2,
  Layers,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const TransparencyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="pb-6 border-b border-white/10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold mb-3">
          <Scale className="w-3.5 h-3.5" />
          <span>Methodology & Known Limitations</span>
        </div>
        <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
          How Verification Works & Known Limitations
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1.5">
          Assistive gap detection to highlight potential conflicts, omissions, and outdated terms.
        </p>
      </div>

      {/* 3-Step Visual Process */}
      <section className="space-y-4">
        <h2 className="font-heading font-bold text-lg text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-accent" />
          3-Step Verification Loop
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-primary/20 text-accent flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Coordinate Chunking</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every document is split into coordinate chunks with character offsets for verbatim tracking.
            </p>
          </Card>

          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Dark Spot Matrix</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Cross-examines mandatory decision attributes to locate omitted clauses and contradictory quotes.
            </p>
          </Card>

          <Card className="p-5 space-y-2 bg-[rgba(16,26,46,0.7)] backdrop-blur-xl border border-[rgba(148,163,184,0.15)] shadow-soft">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="font-heading font-bold text-sm text-white">Actionable Plan</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Calculates a mathematical readiness score and prioritizes exact P1-P3 questions to ask authorities.
            </p>
          </Card>
        </div>
      </section>

      {/* Limitations Box */}
      <section className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-xl space-y-3 shadow-soft">
        <div className="flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <h2 className="font-heading font-bold text-sm text-amber-200">
            Important Limitations & Advisory
          </h2>
        </div>
        <ul className="space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
          <li>• Findings represent potential gaps and possible conflicts, not legal guarantees.</li>
          <li>• Scanned or low-resolution image PDFs may contain OCR artifacts.</li>
          <li>• Institutional internal guidelines may override generic published policies.</li>
          <li>• Always confirm critical deadlines and document formats directly with the designated office.</li>
        </ul>
      </section>

      {/* Actions */}
      <div className="pt-4 flex items-center justify-between border-t border-white/10">
        <Link to="/app/analysis/demo">
          <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
            View Sample Audit
          </Button>
        </Link>
        <Link to="/app/new">
          <Button variant="outline" size="sm">
            Start New Scan
          </Button>
        </Link>
      </div>
    </div>
  );
};
