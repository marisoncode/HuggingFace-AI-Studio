import unittest
from unittest.mock import patch
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app


class TestAudioEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)
        cls.dummy_wav_bytes = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"

    @patch("app.api.routes.audio.speech_to_text_service.transcribe")
    def test_transcribe_success(self, mock_transcribe):
        mock_transcribe.return_value = {"text": "Hello world transcription"}

        files = {"file": ("test.wav", self.dummy_wav_bytes, "audio/wav")}
        response = self.client.post("/api/audio/transcribe", files=files)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("text", data)
        self.assertEqual(data["text"], "Hello world transcription")

    def test_empty_file_rejected(self):
        files = {"file": ("empty.wav", b"", "audio/wav")}
        response = self.client.post("/api/audio/transcribe", files=files)
        self.assertEqual(response.status_code, 400)

    def test_unsupported_format_rejected(self):
        files = {"file": ("test.txt", b"plain text content", "text/plain")}
        response = self.client.post("/api/audio/transcribe", files=files)
        self.assertEqual(response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
