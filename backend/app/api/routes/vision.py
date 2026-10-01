"""
Computer Vision API Routes

Provides endpoints for Image Classification and Image Captioning.
"""
import logging
from fastapi import APIRouter, File, HTTPException, Query, UploadFile, status

from app.schemas.vision import (
    CaptionResponse,
    ClassificationResponse,
    HealthResponse,
)
from app.services.image_captioning_service import image_captioning_service
from app.services.image_classification_service import image_classification_service
from app.utils.image_utils import validate_and_open_image

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Vision Service Health Check")
async def vision_health():
    """Verify that the Vision API route group is available."""
    return {"status": "ok", "service": "Vision"}


@router.post("/classify", response_model=ClassificationResponse, summary="Image Classification")
async def classify_image(
    file: UploadFile = File(...),
    top_k: int = Query(5, ge=1, le=10, description="Top K prediction classes to return"),
):
    """Classify objects and scenes in an uploaded image file."""
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file was uploaded.")

    try:
        file_bytes = await file.read()
        image = validate_and_open_image(file_bytes)
        result = image_classification_service.classify(image, top_k=top_k)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Image classification error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform image classification.",
        )


@router.post("/caption", response_model=CaptionResponse, summary="Image Captioning")
async def caption_image(file: UploadFile = File(...)):
    """Generate a natural language caption for an uploaded image file."""
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file was uploaded.")

    try:
        file_bytes = await file.read()
        image = validate_and_open_image(file_bytes)
        result = image_captioning_service.generate_caption(image)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Image captioning error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to generate image caption.",
        )
