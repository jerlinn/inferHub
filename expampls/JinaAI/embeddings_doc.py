from openai import OpenAI
import os

# Initialize OpenAI client
client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

# Read file
def read_whimery_file():
    try:
        with open('expampls/JinaAI/whimery.md', 'r', encoding='utf-8') as file:
            return file.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return None

# Read the content and create embeddings
content = read_whimery_file()
if content:
    response = client.embeddings.create(
        input=content,
        model="gemini-embedding-001"
    )
    
    print("File content successfully processed into embeddings")
    print(f"Embedding dimensions: {len(response.data[0].embedding)}")
    print("First 10 embedding values:", response.data[0].embedding)
else:
    print("Failed to read file content")
