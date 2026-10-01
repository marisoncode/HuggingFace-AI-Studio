from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "sshleifer/distilbart-cnn-12-6"

# Load tokenizer
tokenizer = AutoTokenizer.from_pretrained(model_name)

# Load summarization model
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

text = """
Artificial intelligence is transforming software development.
Developers can use large language models to generate code,
analyze documents, automate workflows, and build intelligent
applications. Hugging Face provides access to many pretrained
models that developers can use for different AI tasks.
"""

# Convert text into tokens
inputs = tokenizer(
    text,
    return_tensors="pt",
    truncation=True
)

# Generate summary
summary_ids = model.generate(
    inputs["input_ids"],
    max_length=60,
    min_length=20,
    num_beams=4,
    early_stopping=True
)

# Convert tokens back to text
summary = tokenizer.decode(
    summary_ids[0],
    skip_special_tokens=True
)

print("\nOriginal:")
print(text)

print("\nSummary:")
print(summary)