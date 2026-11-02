#!/usr/bin/env python3
"""
Vercel Serverless Function: Python Information Gap & Cross-Examination Engine
Route: /api/gap-engine or /api/gap_engine
Accepts JSON payload: { query, targetGoal, category, sources }
Returns JSON: { success: True, report: AnalysisReport }
"""

from http.server import BaseHTTPRequestHandler
import json
import re
from datetime import datetime
from typing import Dict, List, Any, Tuple

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

PATTERNS = {
    "currency": re.compile(r'(?:₹|Rs\.?|INR|\$)\s*([\d,]+(?:\.\d+)?(?:\s*(?:Lakh|Lakhs|LPA|Crore|k|K|Cr))?)', re.IGNORECASE),
    "deadline": re.compile(r'(?:deadline|last date|due date|closing date|valid till|apply before)\s*[:\-]?\s*([A-Za-z0-9,\s\.\/-]{4,28})', re.IGNORECASE),
}

def clean_text(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_sentences(text: str) -> List[str]:
    raw_sentences = re.split(r'(?<=[.!?])\s+(?=[A-Z0-9₹])', text)
    cleaned = []
    for s in raw_sentences:
        s = clean_text(s)
        if len(s) > 15:
            cleaned.append(s)
    return cleaned

def find_attribute_mentions(sentence: str, attribute_id: str) -> bool:
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
    conflicts: List[Dict[str, Any]] = []
    income_claims: List[Tuple[str, str, str, str]] = []

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

    # Deadline Discrepancies
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
            "status": "missing"
        }

        covered_count = 0
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
                matrix[attr_id]["sourcesCoverage"][s_id] = {
                    "status": "stated",
                    "quote": matched_sentence
                }
            else:
                matrix[attr_id]["sourcesCoverage"][s_id] = {
                    "status": "omitted",
                    "quote": None
                }

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
    score = 100
    breakdown = []

    critical_conflicts = [c for c in conflicts if c.get("severity") == "critical"]
    if critical_conflicts:
        deduction = len(critical_conflicts) * 20
        score -= deduction
        breakdown.append(f"-{deduction} pts: {len(critical_conflicts)} critical claim contradictions detected")

    critical_gaps = [g for g in gaps if g.get("importance") == "critical"]
    if critical_gaps:
        deduction = len(critical_gaps) * 15
        score -= deduction
        breakdown.append(f"-{deduction} pts: {len(critical_gaps)} critical undisclosed dark spots")

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

def run_cross_examination(query: str, target_goal: str, category: str, sources: List[Dict[str, Any]]) -> Dict[str, Any]:
    conflicts = detect_contradictions(sources)
    gaps, matrix = analyze_dark_spots(category, sources)
    readiness = compute_decision_readiness(sources, conflicts, gaps)

    checklist: List[Dict[str, Any]] = []
    order = 1
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

    return {
        "id": f"py_report_{int(datetime.utcnow().timestamp())}",
        "query": query,
        "targetGoal": target_goal,
        "category": category,
        "createdAt": datetime.utcnow().isoformat() + "Z",
        "provider": "DigiStudentWay Cross-Examination Engine",
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

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('content-length', 0))
            body = self.rfile.read(content_length)
            payload = json.loads(body.decode('utf-8'))

            query = payload.get("query", "Inquiry")
            target_goal = payload.get("targetGoal", "Avoid Application Rejection")
            category = payload.get("category", "scholarship")
            sources = payload.get("sources", [])

            if not sources:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "No sources provided for cross-examination."}).encode('utf-8'))
                return

            report = run_cross_examination(query, target_goal, category, sources)

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "report": report}).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

