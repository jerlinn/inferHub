import requests

url = 'https://aihubmix.com/v1/rerank'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-***' # 替换为你的 AiHubMix 密钥
}
data = {
    "model": "jina-reranker-m0",
    "query": "small language model data extraction",
    "documents": [
        {
            "image": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/handelsblatt-preview.png"
        },
        {
            "image": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/paper-11.png"
        },
        {
            "image": "https://raw.githubusercontent.com/jina-ai/multimodal-reranker-test/main/wired-preview.png"
        },
        {
            "text": "We present ReaderLM-v2, a compact 1.5 billion parameter language model designed for efficient web content extraction. Our model processes documents up to 512K tokens, transforming messy HTML into clean Markdown or JSON formats with high accuracy -- making it an ideal tool for grounding large language models. The models effectiveness results from two key innovations: (1) a three-stage data synthesis pipeline that generates high quality, diverse training data by iteratively drafting, refining, and critiquing web content extraction; and (2) a unified training framework combining continuous pre-training with multi-objective optimization. Intensive evaluation demonstrates that ReaderLM-v2 outperforms GPT-4o-2024-08-06 and other larger models by 15-20% on carefully curated benchmarks, particularly excelling at documents exceeding 100K tokens, while maintaining significantly lower computational requirements."
        },
        {
            "image": "https://jina.ai/blog-banner/using-deepseek-r1-reasoning-model-in-deepsearch.webp"
        },
        {
            "text": "数据提取么？为什么不用正则啊，你用正则不就全解决了么？"
        },
        {
            "text": "During the California Gold Rush, some merchants made more money selling supplies to miners than the miners made finding gold."
        },
        {
            "text": "Die wichtigsten Beiträge unserer Arbeit sind zweifach: Erstens führen wir eine neuartige dreistufige Datensynthese-Pipeline namens Draft-Refine-Critique ein, die durch iterative Verfeinerung hochwertige Trainingsdaten generiert; und zweitens schlagen wir eine umfassende Trainingsstrategie vor, die kontinuierliches Vortraining zur Längenerweiterung, überwachtes Feintuning mit spezialisierten Kontrollpunkten, direkte Präferenzoptimierung (DPO) und iteratives Self-Play-Tuning kombiniert. Um die weitere Forschung und Anwendung der strukturierten Inhaltsextraktion zu erleichtern, ist das Modell auf Hugging Face öffentlich verfügbar."
        },
        {
            "image": "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"
        }
    ]
}

response = requests.post(url, headers=headers, json=data)

print(response.json())