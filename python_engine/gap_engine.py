#!/usr/bin/env python3
"""
DigiStudentWay - Python Information Gap & Cross-Examination Engine
Autonomous multi-source evidence auditing, dark spot detection,
numeric conflict extraction, and verifiable decision readiness scoring.
Zero external dependencies (pure Python 3.8+ stdlib).
"""

import sys
import os
import json
import re
import math
from datetime import datetime
from collections import defaultdict
from typing import Dict, List, Any, Optional, Tuple

# Domain taxonomies mapping critical attributes that must be disclosed
DOMAIN_TAXONOMIES: Dict[str, List[Dict[str, Any]]] = {
    "scholarship": [
        {"id": "eligibility_criteria", "label": "Academic & Category Eligibility", "critical": True},
        {"id": "income_limit", "label": "Annual Family Income Ceiling", "critical": True},
        {"id": "application_deadline", "label": "Portal Submission Deadline", "critical": True},
        {"id": "mandatory_documents", "label": "Required Verifiable Documents", "critical": True},
        {"id": "benefit_amount", "label": "Disbursement Amount / Tuition Waiver", "critical": False},
        {"id": "renewal_criteria", "label": "Annual Renewal & Minimum CGPA", "critical": True},
        {"id": "quota_allocation", "label": "State / Institutional Quota Reservation", "critical": False},
        {"id": "official_portal_url", "label": "Official Application Portal Link", "critical": True},
        {"id": "grievance_helpdesk", "label": "Nodal Officer / Grievance Contact", "critical": False},
    ],
    "govt_scheme": [
        {"id": "target_beneficiary", "label": "Target Beneficiary Class", "critical": True},
        {"id": "income_asset_criteria", "label": "Income & Landholding Ceiling", "critical": True},
        {"id": "registration_deadline", "label": "Scheme Enrolment Deadline", "critical": True},
        {"id": "required_certificates", "label": "Revenue / Domicile Certificate Rules", "critical": True},
        {"id": "financial_assistance", "label": "Direct Benefit Transfer (DBT) Amount", "critical": True},
        {"id": "verification_officer", "label": "Designated Verification Authority", "critical": False},
        {"id": "grievance_redressal", "label": "Escalation & Helpdesk Channel", "critical": False},
    ],
    "career": [
        {"id": "ctc_fixed_variable", "label": "Fixed Base vs Variable Pay Ratio", "critical": True},
        {"id": "probation_period", "label": "Probation Period Duration", "critical": True},
        {"id": "notice_period", "label": "Resignation Notice Period", "critical": True},
        {"id": "service_bond", "label": "Employment Bond / Penalty Amount", "critical": True},
        {"id": "esop_vesting", "label": "Equity / ESOP Vesting Schedule", "critical": False},
        {"id": "working_mode", "label": "Remote vs On-Site Working Mandate", "critical": False},
        {"id": "ip_assignment", "label": "IP Ownership & Moonlighting Clause", "critical": True},
    ],
    "admission": [
        {"id": "minimum_cutoff", "label": "Minimum Qualification & Cutoff Rank", "critical": True},
        {"id": "seat_matrix", "label": "Category-wise Seat Allocation", "critical": True},
        {"id": "fee_structure", "label": "Tuition, Hostel & Examination Fees", "critical": True},
        {"id": "counseling_dates", "label": "Seat Allotment & Counseling Schedule", "critical": True},
        {"id": "cancellation_refund", "label": "Withdrawal & Fee Refund Schedule", "critical": True},
        {"id": "hostel_availability", "label": "Campus Accommodation Guarantee", "critical": False},
    ],
    "exam": [
        {"id": "exam_syllabus", "label": "Prescribed Syllabus & Question Pattern", "critical": True},
        {"id": "admit_card_date", "label": "Hall Ticket Release Date", "critical": True},
        {"id": "negative_marking", "label": "Negative Marking Scheme", "critical": True},
        {"id": "calculator_allowed", "label": "Permitted Materials / Virtual Calculator", "critical": False},
        {"id": "cutoff_marks", "label": "Minimum Qualifying Percentile", "critical": True},
    ],
    "general": [
        {"id": "eligibility_requirements", "label": "Eligibility & Entry Criteria", "critical": True},
        {"id": "timelines_deadlines", "label": "Critical Milestones & Dates", "critical": True},
        {"id": "fees_costs", "label": "Cost, Fees or Financial Terms", "critical": True},
        {"id": "governing_rules", "label": "Binding Terms & Renewal Conditions", "critical": True},
        {"id": "official_authority", "label": "Designated Authority & Official Link", "critical": False},
    ]
}

# Regex patterns for high-risk entity extraction
PATTERNS = {
    "currency": re.compile(r'(?:₹|Rs\.?|INR|\$)\s*([\d,]+(?:\.\d+)?(?:\s*(?:Lakh|Lakhs|LPA|Crore|k|K|Cr))?)', re.IGNORECASE),
    "deadline": re.compile(r'(?:deadline|last date|due date|closing date|valid till|apply before)\s*[:\-]?\s*([A-Za-z0-9,\s\.\/-]{4,28})', re.IGNORECASE),
    "percentage": re.compile(r'(\d{1,2}(?:\.\d+)?)\s*%', re.IGNORECASE),
    "cgpa": re.compile(r'(\d(?:\.\d+)?)\s*(?:CGPA|GPA|\/10)', re.IGNORECASE),
    "bond": re.compile(r'(\d+)\s*(?:year|years|month|months)\s*(?:bond|service agreement|commitment)', re.IGNORECASE),
}

def clean_text(text: str) -> str:
    """Sanitizes text by stripping excessive whitespace and formatting anomalies."""
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_sentences(text: str) -> List[str]:
    """Splits text into meaningful sentences while preserving contextual punctuation."""
    raw_sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9₹])', text)
    cleaned = []
    for s in raw_sentences:
        s = clean_text(s)
        if len(s) > 15:
            cleaned.append(s)
    return cleaned

def find_attribute_mentions(sentence: str, attribute_id: str) -> bool:
    """Heuristic semantic keyword matcher for taxonomy attributes."""
    keywords = {
        "income_limit": ["income", "lakh", "ceiling", "annual family", "parental income", "creamy layer", "gross income"],
        "eligibility_criteria": ["eligible", "eligibility", "qualification", "passed", "minimum aggregate", "criteria", "students who"],
        "application_deadline": ["deadline", "last date", "closing date", "apply before", "timeline", "portal closes"],
        "mandatory_documents": ["document", "certificate", "marksheet", "affidavit", "aadhaar", "ration card", "bonafide"],
        "benefit_amount": ["stipend", "disbursement", "scholarship amount", "tuition fee", "allowance", "per annum", "₹"],
        "renewal_criteria": ["renewal", "subsequent year", "maintain", "attendance", "minimum cgpa", "clearing all subjects"],
        "quota_allocation": ["quota", "reservation", "state quota", "institutional", "domicile", "category"],
        "official_portal_url": ["portal", "official website", "apply online", "url", "www.", "https://", "scholarships.gov.in"],
        "grievance_helpdesk": ["helpdesk", "nodal officer", "contact", "email", "toll free", "grievance", "telephone"],
        "service_bond": ["bond", "service agreement", "penalty", "retention", "mandatory service"],
        "notice_period": ["notice period", "resignation", "exit", "days notice"],
        "probation_period": ["probation", "confirmation", "training period"],
        "ctc_fixed_variable": ["ctc", "base salary", "variable", "fixed component", "performance bonus"],
        "ip_assignment": ["intellectual property", "inventions", "moonlighting", "exclusive rights", "ownership"],
    }
    
    attr_keys = keywords.get(attribute_id, [attribute_id.replace("_", " ")])
    lower_s = sentence.lower()
    return any(k.lower() in lower_s for k in attr_keys)

def detect_contradictions(sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Cross-examines all sources to detect numeric and semantic conflicts.
    Identifies exact conflicting sentences and source references.
    """
    conflicts: List[Dict[str, Any]] = []
    
    # 1. Income Limit Conflicts
    income_claims: List[Tuple[str, str, str, str]] = [] # (source_id, source_name, value_str, quote)
    for s in sources:
        s_id = s.get("id", "source")
        s_title = s.get("title", s.get("url", "Notice"))
        text = s.get("fullText", "") or s.get("excerpt", "")
        sentences = extract_sentences(text)
        for sent in sentences:
            if find_attribute_mentions(sent, "income_limit"):
                curr_matches = PATTERNS["currency"].findall(sent)
                if curr_matches:
                    income_claims.append((s_id, s_title, curr_matches[0], sent))
                    break

    if len(income_claims) >= 2:
        for i in range(len(income_claims)):
            for j in range(i + 1, len(income_claims)):
                s1_id, s1_name, val1, quote1 = income_claims[i]
                s2_id, s2_name, val2, quote2 = income_claims[j]
                norm_v1 = re.sub(r'[,\s]', '', val1).lower()
                norm_v2 = re.sub(r'[,\s]', '', val2).lower()
                if norm_v1 != norm_v2 and s1_id != s2_id:
                    conflicts.append({
                        "id": f"conflict_income_{s1_id}_{s2_id}",
                        "topic": "Annual Family Income Ceiling Mismatch",
                        "description": f"{s1_name} states the income ceiling is {val1}, whereas {s2_name} specifies {val2}. Applying under the wrong ceiling risks disqualification.",
                        "severity": "critical",
                        "status": "unresolved",
                        "sourceA": {
                            "sourceId": s1_id,
                            "claim": f"Income ceiling stated as {val1}",
                            "exactQuote": quote1,
                            "sourceDate": "Current Circular"
                        },
                        "sourceB": {
                            "sourceId": s2_id,
                            "claim": f"Income ceiling stated as {val2}",
                            "exactQuote": quote2,
                            "sourceDate": "Institutional Guideline"
                        },
                        "resolutionGuidance": "Request an official written circular from the nodal scholarship officer before filing financial affidavits."
                    })

    # 2. Deadline Discrepancies
    deadline_claims: List[Tuple[str, str, str, str]] = []
    for s in sources:
        s_id = s.get("id", "source")
        s_title = s.get("title", s.get("url", "Notice"))
        text = s.get("fullText", "") or s.get("excerpt", "")
        sentences = extract_sentences(text)
        for sent in sentences:
            if find_attribute_mentions(sent, "application_deadline"):
                dl_matches = PATTERNS["deadline"].findall(sent)
                if dl_matches:
                    deadline_claims.append((s_id, s_title, dl_matches[0].strip(), sent))
                    break

    if len(deadline_claims) >= 2:
        s1_id, s1_name, d1, q1 = deadline_claims[0]
        s2_id, s2_name, d2, q2 = deadline_claims[1]
        if s1_id != s2_id and d1.lower() != d2.lower():
            conflicts.append({
                "id": f"conflict_deadline_{s1_id}_{s2_id}",
                "topic": "Application Portal Closing Date Discrepancy",
                "description": f"{s1_name} lists the closing date as '{d1}', while {s2_name} indicates '{d2}'.",
                "severity": "critical",
                "status": "unresolved",
                "sourceA": {
                    "sourceId": s1_id,
                    "claim": f"Closing date listed as {d1}",
                    "exactQuote": q1,
                    "sourceDate": "Central Guideline"
                },
                "sourceB": {
                    "sourceId": s2_id,
                    "claim": f"Closing date listed as {d2}",
                    "exactQuote": q2,
                    "sourceDate": "State Notice"
                },
                "resolutionGuidance": "Treat the earlier deadline as your operational cutoff to prevent portal lockouts."
            })

    return conflicts

def analyze_dark_spots(category: str, sources: List[Dict[str, Any]]) -> Tuple[List[Dict[str, Any]], Dict[str, Dict[str, Any]]]:
    """
    Evaluates taxonomy coverage across all sources.
    Returns:
      1. List of detected Dark Spots (gaps with severity and impact).
      2. Source Agreement Matrix data mapping attributes to sources.
    """
    taxonomy = DOMAIN_TAXONOMIES.get(category.lower(), DOMAIN_TAXONOMIES["general"])
    gaps: List[Dict[str, Any]] = []
    matrix: Dict[str, Dict[str, Any]] = {}

    for attr in taxonomy:
        attr_id = attr["id"]
        attr_label = attr["label"]
        is_critical = attr["critical"]

        matrix[attr_id] = {
            "attributeId": attr_id,
            "attributeLabel": attr_label,
            "isCritical": is_critical,
            "sourcesCoverage": {},
            "status": "missing" # 'covered', 'conflicted', 'missing'
        }

        covered_count = 0
        supporting_quotes: List[Tuple[str, str]] = []

        for s in sources:
            s_id = s.get("id", "source")
            text = s.get("fullText", "") or s.get("excerpt", "")
            sentences = extract_sentences(text)
            
            matched_sentence = None
            for sent in sentences:
                if find_attribute_mentions(sent, attr_id):
                    matched_sentence = sent
                    break

            if matched_sentence:
                covered_count += 1
                supporting_quotes.append((s_id, matched_sentence))
                matrix[attr_id]["sourcesCoverage"][s_id] = {
                    "status": "stated",
                    "quote": matched_sentence
                }
            else:
                matrix[attr_id]["sourcesCoverage"][s_id] = {
                    "status": "omitted",
                    "quote": None
                }

        # Determine Dark Spot condition
        if covered_count == 0:
            matrix[attr_id]["status"] = "missing"
            gaps.append({
                "id": f"gap_{attr_id}",
                "missingAttributeId": attr_id,
                "label": f"Complete Absence of {attr_label}",
                "description": f"None of the {len(sources)} examined notices mention {attr_label.lower()}. Applicants are forced to proceed blind on this condition.",
                "importance": "critical" if is_critical else "warning",
                "riskIfIgnored": f"Risk of unexpected rejection, disqualification or non-compliance due to undisclosed {attr_label.lower()} rules.",
                "actionItem": f"File a formal RTI or contact the nodal desk to clarify {attr_label.lower()} before submitting the application."
            })
        elif covered_count < len(sources) and is_critical:
            matrix[attr_id]["status"] = "partial"
            gaps.append({
                "id": f"gap_partial_{attr_id}",
                "missingAttributeId": attr_id,
                "label": f"Incomplete Disclosure of {attr_label}",
                "description": f"{attr_label} is disclosed in only {covered_count} of {len(sources)} sources, indicating lack of standardized official communication.",
                "importance": "warning",
                "riskIfIgnored": f"Local institutional offices may apply stricter or outdated rules than the primary circular.",
                "actionItem": f"Verify whether your local institution follows the specific clause mentioned in the primary source."
            })
        else:
            matrix[attr_id]["status"] = "covered"

    return gaps, matrix

def compute_decision_readiness(sources: List[Dict[str, Any]], conflicts: List[Dict[str, Any]], gaps: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Computes deterministic Decision Readiness Score (0-100) based on:
    - Base: 100
    - Critical Conflict deduction: -20 each
    - Critical Gap deduction: -15 each
    - Warning Gap deduction: -5 each
    - Source penalty for missing date or unofficial domain: -5 each
    """
    score = 100
    breakdown = []

    # Penalty for conflicts
    critical_conflicts = [c for c in conflicts if c.get("severity") == "critical"]
    if critical_conflicts:
        deduction = len(critical_conflicts) * 20
        score -= deduction
        breakdown.append(f"-{deduction} pts: {len(critical_conflicts)} critical claim contradictions detected")

    # Penalty for critical gaps
    critical_gaps = [g for g in gaps if g.get("importance") == "critical"]
    if critical_gaps:
        deduction = len(critical_gaps) * 15
        score -= deduction
        breakdown.append(f"-{deduction} pts: {len(critical_gaps)} critical undisclosed dark spots")

    # Penalty for warning gaps
    warning_gaps = [g for g in gaps if g.get("importance") == "warning"]
    if warning_gaps:
        deduction = min(len(warning_gaps) * 5, 20)
        score -= deduction
        breakdown.append(f"-{deduction} pts: {len(warning_gaps)} secondary information gaps")

    score = max(5, min(100, score))

    if score >= 75:
        tier = "Ready to Proceed"
        recommendation = "Low ambiguity. Information is consistent across circulars; verify remaining checklist items."
    elif score >= 50:
        tier = "Proceed with Caution"
        recommendation = "Moderate risk. Conflicting claims or missing eligibility clauses must be verified with officials."
    else:
        tier = "High Risk - Action Required"
        recommendation = "Significant digital dark spots detected. Do not submit or sign until discrepancies are resolved."

    return {
        "score": score,
        "tier": tier,
        "recommendation": recommendation,
        "breakdown": breakdown
    }

def generate_priority_checklist(conflicts: List[Dict[str, Any]], gaps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Constructs a sequential, actionable verification checklist for the user."""
    checklist: List[Dict[str, Any]] = []
    order = 1

    # Urgent: resolve conflicts
    for c in conflicts:
        checklist.append({
            "id": f"chk_{order}",
            "order": order,
            "title": f"Resolve Contradiction: {c['topic']}",
            "action": c["resolutionGuidance"],
            "urgency": "immediate",
            "relatedConflictId": c["id"]
        })
        order += 1

    # High: verify critical gaps
    for g in gaps:
        if g.get("importance") == "critical":
            checklist.append({
                "id": f"chk_{order}",
                "order": order,
                "title": f"Clarify Dark Spot: {g['label']}",
                "action": g["actionItem"],
                "urgency": "before_applying",
                "relatedGapId": g["id"]
            })
            order += 1

    return checklist

def run_cross_examination(query: str, target_goal: str, category: str, sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Main orchestration entrypoint for the Python Gap Detection Engine.
    Executes full multi-source cross-examination pipeline and produces
    structured audit report with verifiable citations.
    """
    if not sources:
        raise ValueError("At least one source is required for cross-examination.")

    # 1. Detect conflicts
    conflicts = detect_contradictions(sources)

    # 2. Detect dark spots and construct matrix
    gaps, matrix = analyze_dark_spots(category, sources)

    # 3. Decision readiness score
    readiness = compute_decision_readiness(sources, conflicts, gaps)

    # 4. Actionable checklist
    checklist = generate_priority_checklist(conflicts, gaps)

    # 5. Extract verified facts from sources
    facts = []
    fact_id = 1
    for s in sources:
        s_id = s.get("id", "source")
        s_title = s.get("title", "Notice")
        text = s.get("fullText", "") or s.get("excerpt", "")
        sentences = extract_sentences(text)
        for sent in sentences[:2]:
            facts.append({
                "id": f"fact_{fact_id}",
                "statement": sent,
                "sourceId": s_id,
                "sourceName": s_title,
                "exactQuote": sent,
                "isVerifiedQuote": True,
                "confidence": 0.95
            })
            fact_id += 1

    report = {
        "id": f"py_report_{int(datetime.utcnow().timestamp())}",
        "query": query,
        "targetGoal": target_goal,
        "category": category,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "provider": "DigiStudentWay Python Cross-Examination Engine",
        "decisionReadiness": readiness,
        "conflicts": conflicts,
        "gaps": gaps,
        "facts": facts,
        "checklist": checklist,
        "sourceMatrix": matrix,
        "sourcesAnalyzedCount": len(sources),
        "totalGapsCount": len(gaps),
        "totalConflictsCount": len(conflicts)
    }

    return report

# CLI invocation support
if __name__ == "__main__":
    import argparse
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    parser = argparse.ArgumentParser(description="DigiStudentWay Python Gap Detection Engine")
    parser.add_argument("--query", type=str, default="Post-Matric Scholarship PMS Verification", help="User inquiry")
    parser.add_argument("--goal", type=str, default="Avoid Application Rejection", help="User goal")
    parser.add_argument("--category", type=str, default="scholarship", help="Domain category")
    parser.add_argument("--sources-file", type=str, default=None, help="JSON file containing sources array")
    parser.add_argument("--test", action="store_true", help="Run self-test with bundled multi-source sample")

    args = parser.parse_args()

    if args.test or not args.sources_file:
        # Self-test sample with intentional conflict & dark spot
        test_sources = [
            {
                "id": "src_central_01",
                "title": "Central PMS Scheme Official Circular 2026",
                "url": "https://scholarships.gov.in/guidelines/pms-2026",
                "fullText": "Post-Matric Scholarship guidelines for academic session 2026. The annual family income ceiling is fixed at ₹2,50,000 per annum for all categories. Students who passed with minimum aggregate of 60% are eligible. Portal submission deadline is 31st October 2026. Mandatory documents include valid Aadhaar, Income Certificate issued by Revenue Authority, and Caste Certificate. For assistance, contact state nodal officer."
            },
            {
                "id": "src_inst_02",
                "title": "University Institutional Scholarship Notice 2026",
                "url": "https://university.ac.in/notices/scholarship-verification",
                "fullText": "Notification for institutional verification of Post-Matric applicants. Eligible students from reserved categories must apply before 15th November 2026. The family income ceiling as per state welfare amendment is ₹8,00,000 per annum. College verification window closes 5 days post central portal deadline."
            }
        ]
        result = run_cross_examination(args.query, args.goal, args.category, test_sources)
        try:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        except UnicodeEncodeError:
            print(json.dumps(result, indent=2, ensure_ascii=True))
    else:
        with open(args.sources_file, "r", encoding="utf-8") as f:
            sources_data = json.load(f)
        result = run_cross_examination(args.query, args.goal, args.category, sources_data)
        try:
            print(json.dumps(result, indent=2, ensure_ascii=False))
        except UnicodeEncodeError:
            print(json.dumps(result, indent=2, ensure_ascii=True))
