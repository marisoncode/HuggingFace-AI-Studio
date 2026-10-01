"""
Audio Processing API Routes

Provides endpoint for Speech-to-Text Automatic Speech Recognition (ASR).
"""
import logging
import os
from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.schemas.audio import HealthResponse, TranscriptionResponse
from app.services.speech_to_text_service import speech_to_text_service
from app.utils.audio_utils import validate_and_save_temp_audio

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="Audio Service Health Check")
async def audio_health():
    """Verify that the Audio API route group is available."""
    return {"status": "ok", "service": "Audio"}


@router.post("/transcribe", response_model=TranscriptionResponse, summary="Speech-to-Text Transcription")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe an uploaded audio file into text using Whisper-tiny."""
    if not file:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No file was uploaded.")

    temp_path = None
    try:
        file_bytes = await file.read()
        temp_path = validate_and_save_temp_audio(file_bytes, file.filename or "audio.wav")
        result = speech_to_text_service.transcribe(temp_path)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Audio transcription error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform speech-to-text transcription.",
        )
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
