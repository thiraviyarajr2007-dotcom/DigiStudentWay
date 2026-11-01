import { AnalysisReport } from '../types';

/**
 * Formats an AnalysisReport into a clean, markdown document.
 */
export function generateMarkdownChecklist(report: AnalysisReport): string {
  const readiness = report.decisionReadiness;
  const lines: string[] = [];

  lines.push(`# DigiStudentWay Verification Brief: ${report.title}`);
  lines.push(`*Generated on: ${new Date().toLocaleDateString()} | Inquiry: "${report.query}"*`);
  lines.push('');

  lines.push(`## 📊 Decision Readiness Score: ${report.confidenceScore}%`);
  if (readiness) {
    lines.push(`- **Status:** ${readiness.label}`);
    lines.push(`- **Attributes Covered:** ${readiness.coveredCount} / ${report.expectedAttributes?.length || 8}`);
    lines.push(`- **Critical P1 Items to Verify:** ${readiness.p1PendingCount}`);
    lines.push(`- **Summary:** ${readiness.summary}`);
  }
  lines.push('');

  lines.push('---');
  lines.push('## ⚠️ Priority "Verify Next" Action Checklist');
  lines.push('*(Cross-check these items before submitting your application documents)*');
  lines.push('');

  report.checklist.forEach((item, idx) => {
    const checkmark = item.completed ? '[x]' : '[ ]';
    lines.push(`### ${checkmark} [${item.priority}] ${item.title}`);
    lines.push(`- **Why:** ${item.reason}`);
    lines.push(`- **Action:** ${item.suggestedAction}`);
    lines.push(`- **Where to Verify:** ${item.whereToVerify}`);
    if (item.sourceRef) {
      lines.push(`- **Based on:** ${item.sourceRef}`);
    }
    lines.push('');
  });

  if (report.conflicts && report.conflicts.length > 0) {
    lines.push('---');
    lines.push('## 🔴 Detected Document Contradictions');
    report.conflicts.forEach(c => {
      lines.push(`### Discrepancy: ${c.topic}`);
      lines.push(`- **Summary:** ${c.summary}`);
      lines.push(`- **${c.sourceA.sourceTitle}:** "${c.sourceA.quote}"`);
      lines.push(`- **${c.sourceB.sourceTitle}:** "${c.sourceB.quote}"`);
      lines.push(`- **Resolution Tip:** ${c.resolutionTip}`);
      lines.push('');
    });
  }

  if (report.gaps && report.gaps.length > 0) {
    lines.push('---');
    lines.push('## 🟣 Unanswered Information Gaps (Digital Dark Spots)');
    report.gaps.forEach(g => {
      lines.push(`### Gap: ${g.title}`);
      lines.push(`- **Description:** ${g.description}`);
      lines.push(`- **Why It Matters:** ${g.whyItMatters}`);
      lines.push(`- **Question to Ask College Desk:** "${g.suggestedQuestionToAsk}"`);
      lines.push('');
    });
  }

  lines.push('---');
  lines.push('## 📚 Ingested Sources Reviewed');
  report.sources.forEach(s => {
    lines.push(`- [${s.title}](${s.url}) (${s.domain}, Reliability: ${s.reliabilityScore}%)`);
  });
  lines.push('');
  lines.push('*Notice: AI-generated findings are gap alerts, not final legal certifications. Always verify with official authorities.*');

  return lines.join('\n');
}

/**
 * Downloads the verification checklist as a Markdown (.md) or Text file.
 */
export function downloadChecklistFile(report: AnalysisReport, format: 'md' | 'txt' = 'md') {
  const content = generateMarkdownChecklist(report);
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `DigiStudentWay_Checklist_${report.id}.${format}`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Triggers a browser print dialog with styled, printer-optimized checklist for direct PDF save.
 */
export function printChecklistAsPdf(report: AnalysisReport) {
  const content = generateMarkdownChecklist(report)
    .replace(/\n/g, '<br/>')
    .replace(/# (.*?)(?:<br\/>|$)/g, '<h1 style="color:#0F1B3D;font-size:22px;margin-bottom:8px;">$1</h1>')
    .replace(/## (.*?)(?:<br\/>|$)/g, '<h2 style="color:#14B8A6;font-size:16px;border-bottom:1px solid #ddd;padding-bottom:4px;margin-top:16px;">$1</h2>')
    .replace(/### (.*?)(?:<br\/>|$)/g, '<h3 style="font-size:14px;margin-top:12px;margin-bottom:4px;">$1</h3>');

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>DigiStudentWay Checklist - ${report.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.5; color: #1e293b; padding: 24px; max-width: 800px; margin: auto; }
          h1, h2, h3 { font-family: inherit; font-weight: bold; }
          a { color: #0d9488; text-decoration: none; }
          @media print { body { padding: 0; } }
        </style>
      </head>
      <body>
        <div>${content}</div>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

/**
 * Copies a concise shareable summary of gaps and readiness to clipboard.
 */
export async function copyShareableSummary(report: AnalysisReport): Promise<boolean> {
  const p1Items = report.checklist.filter(c => c.priority === 'P1');
  const summary = `
🎓 DigiStudentWay Gap Audit: ${report.title}
⚡ Decision Readiness: ${report.confidenceScore}% (${report.decisionReadiness?.label || 'Review required'})
🟣 Dark Spots Found: ${report.gapsCount} unstated prerequisites
🔴 Direct Conflicts: ${report.conflictsCount} contradicting clauses
📋 Top Verification Action: ${p1Items[0]?.title || 'Verify documents with nodal officer'}
Verified across ${report.sourcesCount} authoritative sources.
Explore full breakdown: ${window.location.origin}/dashboard
`.trim();

  try {
    await navigator.clipboard.writeText(summary);
    return true;
  } catch {
    return false;
  }
}

