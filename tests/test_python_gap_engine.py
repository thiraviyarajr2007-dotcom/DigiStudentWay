#!/usr/bin/env python3
"""
Unit tests for DigiStudentWay Python Cross-Examination & Gap Detection Engine
"""

import sys
import os
import unittest
import json

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from python_engine.gap_engine import (
    run_cross_examination,
    detect_contradictions,
    analyze_dark_spots,
    compute_decision_readiness,
)

class TestPythonGapEngine(unittest.TestCase):
    def setUp(self):
        self.sample_sources = [
            {
                "id": "src_central",
                "title": "Central Scholarship Scheme",
                "url": "https://scholarships.gov.in/pms-central",
                "fullText": "Central scheme guidelines. The annual family income ceiling is fixed at ₹2,50,000 per annum. Portal submission deadline is 31st October 2026. Minimum aggregate required is 60%. Valid Aadhaar and Income Certificate are mandatory.",
            },
            {
                "id": "src_state",
                "title": "State Higher Education Circular",
                "url": "https://highered.state.gov.in/pms-state",
                "fullText": "State notification. The annual family income ceiling is updated to ₹8,00,000 per annum. Portal closing date is 15th November 2026. Only Tehsildar-issued revenue certificates will be verified.",
            }
        ]

    def test_numeric_income_contradiction(self):
        conflicts = detect_contradictions(self.sample_sources)
        self.assertGreater(len(conflicts), 0)
        income_conf = next((c for c in conflicts if "Income" in c["topic"]), None)
        self.assertIsNotNone(income_conf)
        self.assertEqual(income_conf["severity"], "critical")
        self.assertIn("2,50,000", income_conf["sourceA"]["exactQuote"])
        self.assertIn("8,00,000", income_conf["sourceB"]["exactQuote"])

    def test_dark_spot_omission_detection(self):
        gaps, matrix = analyze_dark_spots("scholarship", self.sample_sources)
        self.assertGreater(len(gaps), 0)
        # Renewal criteria is completely absent in both notices
        renewal_gap = next((g for g in gaps if g["missingAttributeId"] == "renewal_criteria"), None)
        self.assertIsNotNone(renewal_gap)
        self.assertEqual(renewal_gap["importance"], "critical")
        self.assertIn("renewal_criteria", matrix)
        self.assertEqual(matrix["renewal_criteria"]["status"], "missing")

    def test_decision_readiness_score(self):
        conflicts = detect_contradictions(self.sample_sources)
        gaps, _ = analyze_dark_spots("scholarship", self.sample_sources)
        readiness = compute_decision_readiness(self.sample_sources, conflicts, gaps)
        self.assertLess(readiness["score"], 75)
        self.assertGreater(len(readiness["breakdown"]), 0)
        self.assertNotEqual(readiness["tier"], "Ready to Proceed")

    def test_full_pipeline_orchestration(self):
        report = run_cross_examination(
            "Post-Matric Scholarship Evaluation",
            "Avoid Application Rejection",
            "scholarship",
            self.sample_sources
        )
        self.assertEqual(report["sourcesAnalyzedCount"], 2)
        self.assertEqual(report["sourcesCount"], 2)
        self.assertGreater(report["totalConflictsCount"], 0)
        self.assertGreater(report["totalGapsCount"], 0)
        self.assertGreater(len(report["checklist"]), 0)
        self.assertGreater(len(report["facts"]), 0)
        self.assertIn("expectedAttributes", report)
        self.assertGreater(len(report["expectedAttributes"]), 0)
        self.assertIn("p1PendingCount", report["decisionReadiness"])
        self.assertIn("priority", report["checklist"][0])

if __name__ == "__main__":
    unittest.main()
