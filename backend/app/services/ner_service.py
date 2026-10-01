"""
Named Entity Recognition (NER) Service

Model: dslim/bert-base-NER
Uses Transformers pipeline with aggregation_strategy="first".
Lazy-loads pipeline on first request and reuses it.
"""
from transformers import pipeline
from app.core.config import settings


class NERService:
    def __init__(self):
        self._pipeline = None

    def _load_model(self):
        if self._pipeline is None:
            model_name = getattr(settings, "NER_MODEL", "dslim/bert-base-NER")
            self._pipeline = pipeline(
                "ner",
                model=model_name,
                aggregation_strategy="first",
            )

    def extract_entities(self, text: str) -> dict:
        if not text or not text.strip():
            raise ValueError("Input text cannot be empty.")

        self._load_model()

        raw_results = self._pipeline(text.strip())

        entities = []
        for entity in raw_results:
            entities.append({
                "word": str(entity["word"]),
                "entity_group": str(entity["entity_group"]),
                "score": round(float(entity["score"]), 4),
            })

        return {
            "entities": entities,
        }


ner_service = NERService()
