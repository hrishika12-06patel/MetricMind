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
    """
    Retrieve the configured Gemini API key, or raise an actionable configuration error.

    This check is executed dynamically when an AI request is initiated rather than during
    application startup, allowing non-AI backend endpoints to operate normally even if
    credentials are not set.

    Returns:
        str: Configured GOOGLE_API_KEY string.

    Raises:
        AIConfigurationError: If GOOGLE_API_KEY environment variable is missing or blank.
    """
    api_key = os.getenv("GOOGLE_API_KEY", "").strip()
    if not api_key:
        raise AIConfigurationError(
            "GOOGLE_API_KEY is not configured. Add it to the project .env file."
        )
    return api_key
