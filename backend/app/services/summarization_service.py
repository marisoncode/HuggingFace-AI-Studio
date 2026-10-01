"""
Text Summarization Service

Model: sshleifer/distilbart-cnn-12-6
Uses AutoTokenizer and AutoModelForSeq2SeqLM.
Lazy-loads model weights on first request and reuses them.
"""
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from app.core.config import settings


class SummarizationService:
    def __init__(self):
        self._tokenizer = None
        self._model = None

    def _load_model(self):
        if self._model is None or self._tokenizer is None:
            model_name = getattr(settings, "SUMMARIZATION_MODEL", "sshleifer/distilbart-cnn-12-6")
            self._tokenizer = AutoTokenizer.from_pretrained(model_name)
            self._model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self._model.eval()

    def summarize(self, text: str, max_length: int = 60, min_length: int = 20) -> dict:
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")
        if len(text.strip()) < 10:
            raise ValueError("Input text is too short for summarization.")

        self._load_model()

        inputs = self._tokenizer(text.strip(), return_tensors="pt", truncation=True)

        with torch.no_grad():
            summary_ids = self._model.generate(
                inputs["input_ids"],
                max_length=max_length,
                min_length=min_length,
                num_beams=4,
                early_stopping=True,
            )

        summary_text = self._tokenizer.decode(summary_ids[0], skip_special_tokens=True)

        return {
            "summary": summary_text,
        }


summarization_service = SummarizationService()
