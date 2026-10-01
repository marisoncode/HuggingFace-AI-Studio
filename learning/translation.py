from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "google-t5/t5-small"

tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

text = "Artificial intelligence is changing software development."

prompt = "translate English to French: " + text

inputs = tokenizer(
    prompt,
    return_tensors="pt"
)

output_tokens = model.generate(
    **inputs,
    max_length=100
)

translation = tokenizer.decode(
    output_tokens[0],
    skip_special_tokens=True
)

print("Generated tokens:", output_tokens)
print("Translation:", translation)

print("English:")
print(text)

print("\nFrench:")
print(translation)