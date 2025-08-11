from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1",
    timeout=3600
)

input_text = """
Research the economic impact of semaglutide on global healthcare systems.
Do:
- Include specific figures, trends, statistics, and measurable outcomes.
- Prioritize reliable, up-to-date sources: peer-reviewed research, health
  organizations (e.g., WHO, CDC), regulatory agencies, or pharmaceutical
  earnings reports.
- Include inline citations and return all source metadata.

Be analytical, avoid generalities, and ensure that each section supports
data-backed reasoning that could inform healthcare policy or financial modeling.
"""

response = client.responses.create(
  model="o3-deep-research", # o4-mini-deep-research
  input=input_text,
  tools=[
    {"type": "web_search_preview"},
    {"type": "code_interpreter", "container": {"type": "auto"}},
  ],
)

print(response.output_text)
