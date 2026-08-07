from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from ai.config import AI_REQUEST_TIMEOUT_SECONDS, MODEL_NAME, get_google_api_key
except ImportError:
    from .config import AI_REQUEST_TIMEOUT_SECONDS, MODEL_NAME, get_google_api_key


def get_llm(model_name: str | None = None, temperature: float = 0.2):
    """
    Creates and returns the configured Gemini LLM instance using LangChain.

    Args:
        model_name (str, optional): Custom Gemini model name. Defaults to configured MODEL_NAME.
        temperature (float, optional): Sampling temperature. Defaults to 0.2.

    Returns:
        ChatGoogleGenerativeAI: Configured LangChain Chat model instance.
    """
    target_model = model_name or MODEL_NAME
    return ChatGoogleGenerativeAI(
        model=target_model,
        google_api_key=get_google_api_key(),
        temperature=temperature,
        timeout=AI_REQUEST_TIMEOUT_SECONDS,
        # Retry behavior is owned by AIInsightService so every endpoint has
        # consistent retry and error handling.
        max_retries=0,
    )
