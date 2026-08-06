from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from ai.insight_service import InsightService

router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class AIRequest(BaseModel):
    dataset: str


@router.post("/summarize")
def summarize_dataset(request: AIRequest):
    """
    Generate an AI-powered summary of the provided sales dataset.
    """

    try:
        summary = InsightService.summarize_dataset(request.dataset)

        return {
            "success": True,
            "summary": summary,
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )