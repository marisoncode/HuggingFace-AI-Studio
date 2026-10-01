"""
Speech-to-Text Transcriber Service

Model: openai/whisper-tiny
Uses Transformers pipeline for automatic-speech-recognition with soundfile decoding,
numpy 16kHz resampling, and long-form timestamp support.
Lazy-loads pipeline on first request and reuses it.
"""
import os
import numpy as np
import soundfile as sf
from transformers import pipeline
from app.core.config import settings


class SpeechToTextService:
    def __init__(self):
        self._transcriber = None

    def _load_model(self):
        if self._transcriber is None:
            model_name = getattr(settings, "SPEECH_TO_TEXT_MODEL", "openai/whisper-tiny")
            self._transcriber = pipeline(
                "automatic-speech-recognition",
                model=model_name,
            )

    def transcribe(self, audio_input) -> dict:
        """
        Transcribes audio file or audio array to text.
        Accepts audio file path (str), audio bytes, or dict.
        Supports both short-form and long-form audio (>30s).
        """
        if not audio_input:
            raise ValueError("Valid audio input must be provided.")

        self._load_model()

        # Handle file path input using soundfile if string
        if isinstance(audio_input, str) and os.path.exists(audio_input):
            audio_data, sr = sf.read(audio_input)

            # Convert multi-channel (stereo) to mono
            if hasattr(audio_data, "ndim") and audio_data.ndim > 1:
                audio_data = audio_data.mean(axis=1)

            # Resample to 16,000 Hz if necessary using numpy linear interpolation
            target_sr = 16000
            if sr != target_sr:
                num_samples = int(len(audio_data) * target_sr / sr)
                audio_data = np.interp(
                    np.linspace(0, len(audio_data), num_samples, endpoint=False),
                    np.arange(len(audio_data)),
                    audio_data,
                )
                sr = target_sr

            inputs = {"array": audio_data.astype(np.float32), "sampling_rate": sr}
        else:
            inputs = audio_input

        # Pass return_timestamps=True to support audio longer than 30s
        result = self._transcriber(inputs, return_timestamps=True)

        transcription_text = ""
        if isinstance(result, dict) and "text" in result:
            transcription_text = str(result["text"]).strip()
        elif isinstance(result, list) and len(result) > 0 and "text" in result[0]:
            transcription_text = str(result[0]["text"]).strip()

        return {
            "text": transcription_text,
        }


speech_to_text_service = SpeechToTextService()
