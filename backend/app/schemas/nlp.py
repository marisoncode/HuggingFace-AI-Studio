"""
Pydantic Data Schemas for NLP Operations
"""
from typing import Dict, List, Optional
from pydantic import BaseModel, Field, field_validator


class HealthResponse(BaseModel):
    status: str
    service: str


# --- Sentiment Analysis Schemas ---
class SentimentRequest(BaseModel):
    text: str = Field(..., description="Text to analyze for sentiment", min_length=1)

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Text input cannot be empty or whitespace only.")
        return v.strip()


class SentimentResponse(BaseModel):
    label: str
    score: float
    probabilities: Dict[str, float]


# --- Summarization Schemas ---
class SummarizeRequest(BaseModel):
    text: str = Field(..., description="Text to summarize", min_length=10)
    max_length: Optional[int] = Field(60, ge=10, le=500)
    min_length: Optional[int] = Field(20, ge=5, le=200)

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Text input cannot be empty or whitespace only.")
        return v.strip()


class SummarizeResponse(BaseModel):
    summary: str


# --- Named Entity Recognition (NER) Schemas ---
class NERRequest(BaseModel):
    text: str = Field(..., description="Text to extract named entities from", min_length=1)

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Text input cannot be empty or whitespace only.")
        return v.strip()


class NEREntity(BaseModel):
    word: str
    entity_group: str
    score: float


class NERResponse(BaseModel):
    entities: List[NEREntity]


# --- Question Answering Schemas ---
class QARequest(BaseModel):
    question: str = Field(..., description="Question to answer", min_length=1)
    context: str = Field(..., description="Context text containing the answer", min_length=1)

    @field_validator("question", "context")
    @classmethod
    def input_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Input field cannot be empty or whitespace only.")
        return v.strip()


class QAResponse(BaseModel):
    question: str
    answer: str


# --- Translation Schemas ---
class TranslateRequest(BaseModel):
    text: str = Field(..., description="English text to translate", min_length=1)
    target_language: Optional[str] = Field("French", description="Target language")

    @field_validator("text")
    @classmethod
    def text_must_not_be_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Text input cannot be empty or whitespace only.")
        return v.strip()


class TranslateResponse(BaseModel):
    source_text: str
    translated_text: str
    target_language: str
