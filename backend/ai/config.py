from pathlib import Path
from dotenv import load_dotenv
import os

# Base directory pointing to workspace root
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Load .env file from root directory or environment
env_path = BASE_DIR / ".env"
if env_path.exists():
    load_dotenv(env_path)
else:
    load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
MODEL_NAME = os.getenv("MODEL_NAME", "gemini-1.5-flash")

if not GOOGLE_API_KEY:
    raise ValueError(
        "GOOGLE_API_KEY not found. Please configure your .env file with GOOGLE_API_KEY."
    )