import unittest
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app


class TestBackendHealth(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_root_health(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "AI Intelligence Studio API is running"})

    def test_nlp_health(self):
        response = self.client.get("/api/nlp/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "NLP"})

    def test_vision_health(self):
        response = self.client.get("/api/vision/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "Vision"})

    def test_audio_health(self):
        response = self.client.get("/api/audio/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "Audio"})

    def test_docs_and_redoc(self):
        docs_resp = self.client.get("/docs")
        self.assertEqual(docs_resp.status_code, 200)

        redoc_resp = self.client.get("/redoc")
        self.assertEqual(redoc_resp.status_code, 200)


if __name__ == "__main__":
    unittest.main()
