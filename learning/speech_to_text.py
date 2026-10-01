from transformers import pipeline

transcriber = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-tiny"
)

result = transcriber("waw.wav")

print("Transcription:")
print(result["text"])