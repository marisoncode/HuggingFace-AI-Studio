"""
Pydantic Data Schemas for Audio Operations
"""
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str


class TranscriptionResponse(BaseModel):
    text: str
