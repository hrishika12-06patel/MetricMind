from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from ai.config import AI_REQUEST_TIMEOUT_SECONDS, MODEL_NAME, get_google_api_key
except ImportError:
    from .config import AI_REQUEST_TIMEOUT_SECONDS, MODEL_NAME, get_google_api_key


def get_llm(model_name: str | None = None, temperature: float = 0.2) -> ChatGoogleGenerativeAI:
    """
    Construct and return the configured ChatGoogleGenerativeAI model instance using LangChain.

    Args:
        model_name: Name of target Gemini model (e.g. 'gemini-2.5-flash'). Defaults to MODEL_NAME.
        temperature: Sampling temperature for output generation. Defaults to 0.2 for analytical consistency.

    Returns:
        ChatGoogleGenerativeAI: Initialized LangChain chat model.
    """
    target_model = model_name or MODEL_NAME
    return ChatGoogleGenerativeAI(
        model=target_model,
        google_api_key=get_google_api_key(),
        timeout=AI_REQUEST_TIMEOUT_SECONDS,
        # Retry behavior is owned by AIInsightService so every endpoint has
        # consistent retry and error handling.
        max_retries=0,
    )
