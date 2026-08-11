import os
from pathlib import Path

from dotenv import load_dotenv

# Base directory pointing to workspace root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file from root directory or environment
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

MODEL_NAME = os.getenv("MODEL_NAME", "gemini-2.5-flash")
AI_REQUEST_TIMEOUT_SECONDS = float(os.getenv("AI_REQUEST_TIMEOUT_SECONDS", "60"))


class AIConfigurationError(RuntimeError):
    """Raised when the AI provider has not been configured."""


def get_google_api_key() -> str:
    """Return the configured Gemini key, or a safe actionable configuration error.

    This check deliberately happens when an AI request is made rather than while
    importing the FastAPI app. The non-AI MetricMind endpoints can therefore run
    during local development even if AI credentials are not configured.
    """
    api_key = os.getenv("GOOGLE_API_KEY", "").strip()
    if not api_key:
        raise AIConfigurationError(
            "GOOGLE_API_KEY is not configured. Add it to the project .env file."
        )
    return api_key
