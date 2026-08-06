from langchain_google_genai import ChatGoogleGenerativeAI

try:
    from ai.config import GOOGLE_API_KEY, MODEL_NAME
except ImportError:
    from config import GOOGLE_API_KEY, MODEL_NAME


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
        google_api_key=GOOGLE_API_KEY,
        temperature=temperature,
    )