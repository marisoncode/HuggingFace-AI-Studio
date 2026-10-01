"""
Core Application Configuration
"""


class Settings:
    APP_NAME: str = "AI Intelligence Studio API"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = "development"
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # Hugging Face Model Registries
    SENTIMENT_MODEL: str = "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"
    SUMMARIZATION_MODEL: str = "sshleifer/distilbart-cnn-12-6"
    NER_MODEL: str = "dslim/bert-base-NER"
    QA_MODEL: str = "distilbert-base-cased-distilled-squad"
    TRANSLATION_MODEL: str = "google-t5/t5-small"
    IMAGE_CLASSIFICATION_MODEL: str = "microsoft/resnet-50"
    IMAGE_CAPTIONING_MODEL: str = "Salesforce/blip-image-captioning-base"
    SPEECH_TO_TEXT_MODEL: str = "openai/whisper-tiny"


settings = Settings()
