from openai import OpenAI
import os

client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1"
)

resp = client.responses.create(
    model="o3",
    tools=[{
        "type": "mcp",
        "server_label": "deepwiki",
        "server_url": "https://mcp.deepwiki.com/mcp",
        "require_approval": "never",
        "allowed_tools": ["ask_question"],
    }],
    input="What transport protocols does the 2025-03-26 version of the MCP spec (modelcontextprotocol/modelcontextprotocol) support?",
)

print(resp.output_text)