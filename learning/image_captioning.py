from transformers import BlipProcessor, BlipForConditionalGeneration
from PIL import Image

model_name = "Salesforce/blip-image-captioning-base"

processor = BlipProcessor.from_pretrained(model_name)
model = BlipForConditionalGeneration.from_pretrained(model_name)

image = Image.open("gemini.png").convert("RGB")

inputs = processor(images=image, return_tensors="pt")

output = model.generate(
    **inputs,
    max_new_tokens=50
)

caption = processor.decode(
    output[0],
    skip_special_tokens=True
)

print("Image Caption:")
print(caption)