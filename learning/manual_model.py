from transformers import AutoTokenizer, AutoModelForSequenceClassification

model_name = "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"

tokenizer = AutoTokenizer.from_pretrained(model_name)

model = AutoModelForSequenceClassification.from_pretrained(model_name)

text = "The company reported strong profits this quarter."

inputs = tokenizer(text, return_tensors="pt")

print(inputs)


import torch

with torch.no_grad():
    outputs = model(**inputs)

print(outputs)
print(model.config.id2label)


probabilities = torch.softmax(outputs.logits, dim=-1)
print(probabilities)


predicted_class = torch.argmax(probabilities, dim=-1)

print("Predicted class:", predicted_class.item())
print("Predicted label:", model.config.id2label[predicted_class.item()])