import requests
import os

url = 'https://aihubmix.com/v1/embeddings'
headers = {
    'Content-Type': 'application/json',
    "Authorization": f"Bearer {os.environ.get('AIHUBMIX_API_KEY')}",
}

data = {
    "model": "jina-embeddings-v4", # jina-embeddings-v4, jina-embeddings-v3, jina-clip-v2
    "input": [
        {
            "text": "A beautiful sunset over the beach"
        },
        {
            "text": "Un beau coucher de soleil sur la plage"
        },
        {
            "text": "海滩上美丽的日落"
        },
        {
            "text": "浜辺に沈む美しい夕日"
        },
        {
            "image": "https://i.ibb.co/nQNGqL0/beach1.jpg"
        },
        {
            "image": "https://i.ibb.co/r5w8hG8/beach2.jpg"
        },
        {
            "image": "iVBORw0KGgoAAAANSUhEUgAAABwAAAA4CAIAAABhUg/jAAAAMklEQVR4nO3MQREAMAgAoLkoFreTiSzhy4MARGe9bX99lEqlUqlUKpVKpVKpVCqVHksHaBwCA2cPf0cAAAAASUVORK5CYII="
        }
    ]
}

response = requests.post(url, headers=headers, json=data)
print(response.json())