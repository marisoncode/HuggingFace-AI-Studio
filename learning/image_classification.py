from transformers import pipeline

classifier = pipeline(
    "image-classification",
    model="microsoft/resnet-50"
)

result = classifier("gemini.png")

print("Image Classification Result:")

for item in result[:5]:
    print(
        f"Label: {item['label']} | "
        f"Score: {item['score']:.4f}"
    )