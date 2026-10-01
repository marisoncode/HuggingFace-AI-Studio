import unittest
from unittest.mock import patch
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_path = Path(__file__).resolve().parent.parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from fastapi.testclient import TestClient
from app.main import app


class TestNLPEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    # --- Sentiment Analysis Tests ---
    @patch("app.api.routes.nlp.sentiment_service.analyze")
    def test_sentiment_success(self, mock_analyze):
        mock_analyze.return_value = {
            "label": "positive",
            "score": 0.9852,
            "probabilities": {"negative": 0.005, "neutral": 0.0098, "positive": 0.9852},
        }

        response = self.client.post("/api/nlp/sentiment", json={"text": "Profits surged this quarter."})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["label"], "positive")
        self.assertEqual(data["score"], 0.9852)
        mock_analyze.assert_called_once_with("Profits surged this quarter.")

    def test_sentiment_validation_empty(self):
        response = self.client.post("/api/nlp/sentiment", json={"text": "   "})
        self.assertEqual(response.status_code, 422)  # Pydantic validation error

    # --- Summarization Tests ---
    @patch("app.api.routes.nlp.summarization_service.summarize")
    def test_summarize_success(self, mock_summarize):
        mock_summarize.return_value = {"summary": "AI is transforming software development."}

        text = "Artificial intelligence is transforming software development across the globe."
        response = self.client.post("/api/nlp/summarize", json={"text": text, "max_length": 50, "min_length": 10})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["summary"], "AI is transforming software development.")

    def test_summarize_validation_short(self):
        response = self.client.post("/api/nlp/summarize", json={"text": "Short"})
        self.assertEqual(response.status_code, 422)

    # --- NER Tests ---
    @patch("app.api.routes.nlp.ner_service.extract_entities")
    def test_ner_success(self, mock_ner):
        mock_ner.return_value = {
            "entities": [
                {"word": "Elon Musk", "entity_group": "PER", "score": 0.998},
                {"word": "SpaceX", "entity_group": "ORG", "score": 0.995},
            ]
        }

        response = self.client.post("/api/nlp/ner", json={"text": "Elon Musk founded SpaceX."})
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["entities"]), 2)
        self.assertEqual(data["entities"][0]["word"], "Elon Musk")

    def test_ner_validation_empty(self):
        response = self.client.post("/api/nlp/ner", json={"text": ""})
        self.assertEqual(response.status_code, 422)

    # --- Question Answering Tests ---
    @patch("app.api.routes.nlp.qa_service.answer_question")
    def test_qa_success(self, mock_qa):
        mock_qa.return_value = {
            "question": "What does HF provide?",
            "answer": "pretrained models",
        }

        response = self.client.post(
            "/api/nlp/question-answer",
            json={"question": "What does HF provide?", "context": "Hugging Face provides pretrained models."},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["answer"], "pretrained models")

    def test_qa_validation_missing_context(self):
        response = self.client.post("/api/nlp/question-answer", json={"question": "What is AI?"})
        self.assertEqual(response.status_code, 422)

    # --- Translation Tests ---
    @patch("app.api.routes.nlp.translation_service.translate")
    def test_translate_success(self, mock_translate):
        mock_translate.return_value = {
            "source_text": "Hello world",
            "translated_text": "Bonjour le monde",
            "target_language": "French",
        }

        response = self.client.post(
            "/api/nlp/translate",
            json={"text": "Hello world", "target_language": "French"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["translated_text"], "Bonjour le monde")

    def test_translate_validation_empty(self):
        response = self.client.post("/api/nlp/translate", json={"text": ""})
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
