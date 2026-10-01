"""
English to French Translation Service

Model: google-t5/t5-small
Uses AutoTokenizer and AutoModelForSeq2SeqLM with T5 task prompt prefix.
Lazy-loads model weights on first request and reuses them.
"""
import torch
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from app.core.config import settings


class TranslationService:
    def __init__(self):
        self._tokenizer = None
        self._model = None

    def _load_model(self):
        if self._model is None or self._tokenizer is None:
            model_name = getattr(settings, "TRANSLATION_MODEL", "google-t5/t5-small")
            self._tokenizer = AutoTokenizer.from_pretrained(model_name)
            self._model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
            self._model.eval()

    def translate(self, text: str, target_language: str = "French") -> dict:
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")

        self._load_model()

        target_lang = target_language.strip() if target_language else "French"
        prompt = f"translate English to {target_lang}: {text.strip()}"

        inputs = self._tokenizer(prompt, return_tensors="pt")

        with torch.no_grad():
            output_tokens = self._model.generate(**inputs, max_length=100)

        translated_text = self._tokenizer.decode(output_tokens[0], skip_special_tokens=True)

        return {
            "source_text": text.strip(),
            "translated_text": translated_text,
            "target_language": target_lang,
        }


translation_service = TranslationService()
