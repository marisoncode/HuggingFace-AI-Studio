from transformers import AutoTokenizer, AutoModelForQuestionAnswering
import torch

model_name = "distilbert-base-cased-distilled-squad"

# Load tokenizer and model
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForQuestionAnswering.from_pretrained(model_name)

context = """
Hugging Face is a company and open-source community that provides
tools, libraries, datasets, and pretrained models for machine learning.
The Transformers library allows developers to use pretrained models
for natural language processing, computer vision, and audio tasks.
"""

question = "What does Hugging Face provide?"

# Convert question + context into tokens
inputs = tokenizer(
    question,
    context,
    return_tensors="pt",
    truncation=True
)

# Inference
with torch.no_grad():
    outputs = model(**inputs)

# Find answer start and end positions
start_position = torch.argmax(outputs.start_logits)
end_position = torch.argmax(outputs.end_logits)

# Extract answer tokens
answer_tokens = inputs["input_ids"][
    0,
    start_position:end_position + 1
]

# Convert tokens back to text
answer = tokenizer.decode(
    answer_tokens,
    skip_special_tokens=True
)

print("Question:", question)
print("Answer:", answer)