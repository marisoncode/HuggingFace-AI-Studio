"""
NLP API Routes

Provides endpoints for Sentiment Analysis, Summarization, NER, Extractive QA, and Translation.
"""
import logging
from fastapi import APIRouter, HTTPException, status

from app.schemas.nlp import (
    HealthResponse,
    SentimentRequest,
    SentimentResponse,
    SummarizeRequest,
    SummarizeResponse,
    NERRequest,
    NERResponse,
    QARequest,
    QAResponse,
    TranslateRequest,
    TranslateResponse,
)
from app.services.sentiment_service import sentiment_service
from app.services.summarization_service import summarization_service
from app.services.ner_service import ner_service
from app.services.qa_service import qa_service
from app.services.translation_service import translation_service

logger = logging.getLogger(__name__)

router = APIRouter()


@router.get("/health", response_model=HealthResponse, summary="NLP Service Health Check")
async def nlp_health():
    """Verify that the NLP API route group is available."""
    return {"status": "ok", "service": "NLP"}


@router.post("/sentiment", response_model=SentimentResponse, summary="Financial Sentiment Analysis")
async def analyze_sentiment(payload: SentimentRequest):
    """Analyze financial news text sentiment."""
    try:
        result = sentiment_service.analyze(payload.text)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Sentiment analysis error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform sentiment analysis.",
        )


@router.post("/summarize", response_model=SummarizeResponse, summary="Text Summarization")
async def summarize_text(payload: SummarizeRequest):
    """Generate an abstractive summary of input text."""
    try:
        result = summarization_service.summarize(
            payload.text,
            max_length=payload.max_length or 60,
            min_length=payload.min_length or 20,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Summarization error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to perform text summarization.",
        )


@router.post("/ner", response_model=NERResponse, summary="Named Entity Recognition")
async def extract_ner(payload: NERRequest):
    """Extract named entities from input text."""
    try:
        result = ner_service.extract_entities(payload.text)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("NER extraction error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to extract named entities.",
        )


@router.post("/question-answer", response_model=QAResponse, summary="Extractive Question Answering")
async def answer_question(payload: QARequest):
    """Extract answer for question given context text."""
    try:
        result = qa_service.answer_question(payload.question, payload.context)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Question Answering error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process question answering.",
        )


@router.post("/translate", response_model=TranslateResponse, summary="English to French Translation")
async def translate_text(payload: TranslateRequest):
    """Translate English text to target language (default: French)."""
    try:
        result = translation_service.translate(
            payload.text,
            target_language=payload.target_language or "French",
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error("Translation error: %s", str(e), exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to translate text.",
        )
