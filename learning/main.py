from transformers import pipeline

model_name = "mrm8488/distilroberta-finetuned-financial-news-sentiment-analysis"

classifier = pipeline(
    "sentiment-analysis",
    model=model_name
)

# text = "The company's profits increased significantly this quarter."
text = "The company reported a huge loss and its stock price collapsed."

result = classifier(text)

print(result)







# from transformers import pipeline

# classifier = pipeline("sentiment-analysis")

# text = "I really enjoyed learning Hugging Face."

# result = classifier(text)

# print(result)