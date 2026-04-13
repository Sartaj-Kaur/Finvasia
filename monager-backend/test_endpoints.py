import sys
import unittest
from fastapi.testclient import TestClient

# Add current dir to path just in case
sys.path.append('.')

from main import app

client = TestClient(app)

class TestMonagerEndpoints(unittest.TestCase):
    
    def test_health_check(self):
        response = client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn("status", response.json())

    def test_wallet_profile(self):
        response = client.get("/api/wallet/profile")
        self.assertEqual(response.status_code, 200)
        self.assertIn("archetype", response.json())

    def test_wallet_cards(self):
        response = client.get("/api/wallet/cards")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_wallet_tags(self):
        response = client.get("/api/wallet/tags")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_investment_punchcard(self):
        response = client.get("/api/investment/punchcard")
        self.assertEqual(response.status_code, 200)
        self.assertIn("flip_side_analytics", response.json())

    def test_investment_sip(self):
        response = client.get("/api/investment/sip")
        self.assertEqual(response.status_code, 200)

    def test_docs_all(self):
        response = client.get("/api/docs/all")
        self.assertEqual(response.status_code, 200)
        self.assertIn("insurance_policies", response.json())

    def test_docs_translate(self):
        response = client.post("/api/docs/translate", json={"jargon_text": "Sum Assured"})
        self.assertEqual(response.status_code, 200)
        self.assertIn("translated", response.json())

    def test_binder_overview(self):
        # Need a test user_id
        response = client.get("/api/binder/overview/test_user")
        self.assertEqual(response.status_code, 200)
        self.assertIn("monthly_activity_heatmap", response.json())

    def test_binder_category(self):
        response = client.get("/api/binder/category/Food")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["category"], "Food")

if __name__ == "__main__":
    unittest.main()
