import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()


class AINotConfigured(Exception):
    """Raised when GROQ_API_KEY isn't set."""


_client = None


def _get_client():
    # Created on first use, so the rest of the API still starts without a key.
    global _client
    if _client is None:
        key = os.getenv("GROQ_API_KEY")
        if not key:
            raise AINotConfigured()
        _client = Groq(api_key=key)
    return _client


def ask_ai(question: str):
    system_prompt = """
You are EcoMind AI.

You are an AI energy management assistant.

Always answer in a helpful way.

Give practical electricity saving advice.

Keep answers short.

If possible mention:
- Energy savings
- Cost savings
- Smart home tips
- Environmental impact
"""

    response = _get_client().chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": question
            }
        ],
        temperature=0.5
    )

    return response.choices[0].message.content