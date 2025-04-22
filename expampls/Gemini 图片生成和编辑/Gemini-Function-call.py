from openai import OpenAI
import os

# Define the function declaration for the model
schedule_meeting_function = {
    "name": "schedule_meeting",
    "description": "Schedules a meeting with specified attendees at a given time and date.",
    "parameters": {
        "type": "object",
        "properties": {
            "attendees": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of people attending the meeting.",
            },
            "date": {
                "type": "string",
                "description": "Date of the meeting (e.g., '2024-07-29')",
            },
            "time": {
                "type": "string",
                "description": "Time of the meeting (e.g., '15:00')",
            },
            "topic": {
                "type": "string",
                "description": "The subject or topic of the meeting.",
            },
        },
        "required": ["attendees", "date", "time", "topic"],
    },
}

# Configure the client
client = OpenAI(
    api_key=os.getenv("AIHUBMIX_API_KEY"),
    base_url="https://aihubmix.com/v1",
)

# Send request with function declarations using OpenAI compatible format
response = client.chat.completions.create(
    model="gemini-2.0-flash",
    messages=[
        {"role": "user", "content": "Schedule a meeting with Bob and Alice for 03/14/2025 at 10:00 AM about the Q3 planning."}
    ],
    tools=[{"type": "function", "function": schedule_meeting_function}],
    tool_choice="auto" ## 此处追加了 Aihubmix 兼容，更稳定的请求方式
)

# Check for a function call
if response.choices[0].message.tool_calls:
    tool_call = response.choices[0].message.tool_calls[0]
    function_call = tool_call.function
    print(f"Function to call: {function_call.name}")
    print(f"Arguments: {function_call.arguments}")
    print(response.usage)
    #  In a real app, you would call your function here:
    #  result = schedule_meeting(**json.loads(function_call.arguments))
else:
    print("No function call found in the response.")
    print(response.choices[0].message.content)

"""
Function to call: schedule_meeting
Arguments: {"attendees":["Bob","Alice"],"date":"2025-03-14","time":"10:00","topic":"Q3 planning"}
CompletionUsage(completion_tokens=421, prompt_tokens=165, total_tokens=586, completion_tokens_details=None, prompt_tokens_details=None)
"""