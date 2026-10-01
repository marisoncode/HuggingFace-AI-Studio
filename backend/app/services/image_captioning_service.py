"""
Image Captioning Service

Model: Salesforce/blip-image-captioning-base
Uses BlipProcessor and BlipForConditionalGeneration.
Lazy-loads processor and model weights on first request and reuses them.
"""
import torch
from PIL import Image
from transformers import BlipProcessor, BlipForConditionalGeneration
from app.core.config import settings


class ImageCaptioningService:
    def __init__(self):
        self._processor = None
        self._model = None

    def _load_model(self):
        if self._model is None or self._processor is None:
            model_name = getattr(settings, "IMAGE_CAPTIONING_MODEL", "Salesforce/blip-image-captioning-base")
            self._processor = BlipProcessor.from_pretrained(model_name)
            self._model = BlipForConditionalGeneration.from_pretrained(model_name)
            self._model.eval()

    def generate_caption(self, image: Image.Image, max_new_tokens: int = 50) -> dict:
        if image is None:
            raise ValueError("Valid image must be provided.")

        self._load_model()

        rgb_image = image.convert("RGB")
        inputs = self._processor(images=rgb_image, return_tensors="pt")

        with torch.no_grad():
            output = self._model.generate(**inputs, max_new_tokens=max_new_tokens)

        caption_text = self._processor.decode(output[0], skip_special_tokens=True)

        return {
            "caption": caption_text.strip(),
        }


image_captioning_service = ImageCaptioningService()
