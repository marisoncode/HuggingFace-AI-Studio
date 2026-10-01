"""
Extractive Question Answering Service

Model: distilbert-base-cased-distilled-squad
Uses AutoTokenizer and AutoModelForQuestionAnswering.
Lazy-loads model weights on first request and reuses them.
"""
import torch
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
from app.core.config import settings


class QAService:
    def __init__(self):
        self._tokenizer = None
        self._model = None

    def _load_model(self):
        if self._model is None or self._tokenizer is None:
            model_name = getattr(settings, "QA_MODEL", "distilbert-base-cased-distilled-squad")
            self._tokenizer = AutoTokenizer.from_pretrained(model_name)
            self._model = AutoModelForQuestionAnswering.from_pretrained(model_name)
            self._model.eval()

    def answer_question(self, question: str, context: str) -> dict:
        if not question or not question.strip():
            raise ValueError("Question cannot be empty.")
        if not context or not context.strip():
            raise ValueError("Context cannot be empty.")

        self._load_model()

        inputs = self._tokenizer(
            question.strip(),
            context.strip(),
            return_tensors="pt",
            truncation=True,
        )

        with torch.no_grad():
            outputs = self._model(**inputs)

        start_position = torch.argmax(outputs.start_logits)
        end_position = torch.argmax(outputs.end_logits)

        if end_position < start_position:
            end_position = start_position

        answer_tokens = inputs["input_ids"][0, start_position : end_position + 1]
        answer_text = self._tokenizer.decode(answer_tokens, skip_special_tokens=True)

        return {
            "question": question.strip(),
            "answer": answer_text,
        }


qa_service = QAService()
