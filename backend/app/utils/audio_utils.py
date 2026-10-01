"""
Audio Input Validation and Utility Functions
"""
import os
import tempfile
from pathlib import Path

MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024  # 25 MB limit
ALLOWED_AUDIO_EXTENSIONS = {".wav", ".mp3", ".m4a", ".flac", ".ogg"}


def validate_and_save_temp_audio(file_bytes: bytes, filename: str) -> str:
    """
    Validates audio file bytes and saves to a temporary file.

    Raises ValueError if:
    - Bytes are empty
    - Bytes exceed max allowed file size (25 MB)
    - Extension is not in allowed formats list
    """
    if not file_bytes:
        raise ValueError("Uploaded audio file is empty.")

    if len(file_bytes) > MAX_AUDIO_SIZE_BYTES:
        raise ValueError(f"Audio file exceeds maximum limit of {MAX_AUDIO_SIZE_BYTES // (1024 * 1024)} MB.")

    ext = Path(filename).suffix.lower() if filename else ".wav"
    if ext not in ALLOWED_AUDIO_EXTENSIONS:
        raise ValueError(
            f"Unsupported audio format '{ext}'. Allowed formats: {', '.join(sorted(ALLOWED_AUDIO_EXTENSIONS))}"
        )

    # Save to temp file for pipeline processing
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        temp_file.write(file_bytes)
        temp_path = temp_file.name

    return temp_path
