from langchain_google_genai import ChatGoogleGenerativeAI

from ai.config import GOOGLE_API_KEY, MODEL_NAME


def get_llm():
    """
    Creates and returns the configured Gemini LLM instance.
    """

    return ChatGoogleGenerativeAI(
        model=MODEL_NAME,
        google_api_key=GOOGLE_API_KEY,
        temperature=0.2,
    )