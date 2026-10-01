"""
Image Input Validation and Processing Utilities
"""
import io
from PIL import Image

MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB limit
ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP", "BMP", "MPO"}


def validate_and_open_image(file_bytes: bytes) -> Image.Image:
    """
    Validates uploaded raw bytes and opens a PIL Image in RGB format.

    Raises ValueError if:
    - Bytes are empty
    - Bytes exceed max allowed file size (10 MB)
    - Content is corrupted or not a valid image
    - Image format is not allowed
    """
    if not file_bytes:
        raise ValueError("Uploaded file is empty.")

    if len(file_bytes) > MAX_IMAGE_SIZE_BYTES:
        raise ValueError(f"Image file exceeds maximum limit of {MAX_IMAGE_SIZE_BYTES // (1024 * 1024)} MB.")

    try:
        image = Image.open(io.BytesIO(file_bytes))
        image.verify()  # Verify file integrity
    except Exception as e:
        raise ValueError("Uploaded file is corrupted or not a valid image.") from e

    # Re-open image after verify() (Pillow requirement)
    image = Image.open(io.BytesIO(file_bytes))

    if image.format and image.format.upper() not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported image format '{image.format}'. Allowed: {', '.join(sorted(ALLOWED_FORMATS))}")

    return image.convert("RGB")
