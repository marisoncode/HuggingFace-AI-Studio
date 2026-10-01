import io
import unittest
from unittest.mock import patch
import sys
from pathlib import Path
from PIL import Image

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app


def create_dummy_png_bytes() -> bytes:
    """Generates valid 10x10 RGB PNG image bytes for testing."""
    img = Image.new("RGB", (10, 10), color="blue")
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


class TestVisionEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.valid_png_bytes = create_dummy_png_bytes()

    # --- Image Classification Tests ---
    @patch("app.api.routes.vision.image_classification_service.classify")
    def test_classify_success(self, mock_classify):
        mock_classify.return_value = {
            "predictions": [
                {"label": "clock", "score": 0.95},
                {"label": "stopwatch", "score": 0.03},
            ]
        }

        files = {"file": ("test.png", self.valid_png_bytes, "image/png")}
        response = self.client.post("/api/vision/classify?top_k=2", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("predictions", data)
        self.assertEqual(len(data["predictions"]), 2)
        self.assertEqual(data["predictions"][0]["label"], "clock")

    # --- Image Captioning Tests ---
    @patch("app.api.routes.vision.image_captioning_service.generate_caption")
    def test_caption_success(self, mock_caption):
        mock_caption.return_value = {"caption": "a small blue square"}

        files = {"file": ("test.png", self.valid_png_bytes, "image/png")}
        response = self.client.post("/api/vision/caption", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["caption"], "a small blue square")

    # --- Invalid Upload Tests ---
    def test_invalid_text_file_rejected(self):
        files = {"file": ("fake.txt", b"this is not an image", "text/plain")}
        response = self.client.post("/api/vision/classify", files=files)
        self.assertEqual(response.status_code, 400)

    def test_empty_file_rejected(self):
        files = {"file": ("empty.png", b"", "image/png")}
        response = self.client.post("/api/vision/caption", files=files)
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
