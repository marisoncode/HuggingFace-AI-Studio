"""
Image Classification Service

Model: microsoft/resnet-50
Uses Transformers pipeline for image-classification.
Lazy-loads pipeline on first request and reuses it.
"""
from PIL import Image
from transformers import pipeline
from app.core.config import settings


class ImageClassificationService:
    def __init__(self):
        self._pipeline = None

    def _load_model(self):
        if self._pipeline is None:
            model_name = getattr(settings, "IMAGE_CLASSIFICATION_MODEL", "microsoft/resnet-50")
            self._pipeline = pipeline(
                "image-classification",
                model=model_name,
            )

    def classify(self, image: Image.Image, top_k: int = 5) -> dict:
        if image is None:
            raise ValueError("Valid image must be provided.")

        self._load_model()

        # Clamp top_k between 1 and 10 for safety
        safe_top_k = min(max(1, top_k), 10)

        raw_results = self._pipeline(image)

        predictions = []
        for item in raw_results[:safe_top_k]:
            predictions.append({
                "label": str(item["label"]),
                "score": round(float(item["score"]), 4),
            })

        return {
            "predictions": predictions,
        }


image_classification_service = ImageClassificationService()
