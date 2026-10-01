"""
Pydantic Data Schemas for Computer Vision Operations
"""
from typing import List
from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class ClassificationPrediction(BaseModel):
    label: str
    score: float


class ClassificationResponse(BaseModel):
    predictions: List[ClassificationPrediction]


class CaptionResponse(BaseModel):
    caption: str
