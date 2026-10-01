"""
Financial Sentiment Analysis Service

Model: mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis
Uses AutoTokenizer and AutoModelForSequenceClassification with PyTorch softmax.
Lazy-loads model weights on first request and reuses them.
"""
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from app.core.config import settings


class SentimentService:
    def __init__(self):
        self._tokenizer = None
        self._model = None

    def _load_model(self):
        if self._model is None or self._tokenizer is None:
            model_name = getattr(settings, "SENTIMENT_MODEL", "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis")
            self._tokenizer = AutoTokenizer.from_pretrained(model_name)
            self._model = AutoModelForSequenceClassification.from_pretrained(model_name)
            self._model.eval()

    def analyze(self, text: str) -> dict:
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")

        self._load_model()

        inputs = self._tokenizer(text.strip(), return_tensors="pt")

        with torch.no_grad():
            outputs = self._model(**inputs)

        probabilities = torch.softmax(outputs.logits, dim=-1)[0]
        predicted_class_idx = torch.argmax(probabilities).item()

        predicted_label = self._model.config.id2label.get(predicted_class_idx, str(predicted_class_idx))
        predicted_score = round(float(probabilities[predicted_class_idx]), 4)

        all_probs = {}
        for idx, prob in enumerate(probabilities):
            lbl = self._model.config.id2label.get(idx, str(idx))
            all_probs[lbl] = round(float(prob), 4)

        return {
            "label": predicted_label,
            "score": predicted_score,
            "probabilities": all_probs,
        }


sentiment_service = SentimentService()
