from transformers import pipeline

model_name = "dslim/bert-base-NER"

ner = pipeline(
    "ner",
    model=model_name,
    aggregation_strategy="first"
)

text = "Elon Musk founded SpaceX in California."

result = ner(text)

for entity in result:
    print(
        f"Text: {entity['word']}"
        f" | Entity: {entity['entity_group']}"
        f" | Score: {entity['score']:.4f}"
    )