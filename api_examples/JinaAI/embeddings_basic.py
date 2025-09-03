from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

response = client.embeddings.create(
    input="Your text string goes here",
    model="jina-embeddings-v3"
)

print(response.data[0].embedding)

"""
text-embedding-3-large
text-embedding-3-small
text-embedding-ada-002
gemini-embedding-exp-03-07
text-embedding-v4
Qwen/Qwen3-Embedding-0.6B
gemini-embedding-001
gemini-embedding-exp-03-07
jina-embeddings-v4
jina-embeddings-v3
jina-embeddings-v2-base-code
doubao-embedding-large-text-240915
doubao-embedding-text-240715
"""