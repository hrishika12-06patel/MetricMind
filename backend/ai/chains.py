from functools import lru_cache

from langchain_core.output_parsers import StrOutputParser

try:
    from ai.llm_factory import get_llm
    from ai.prompt_templates import DATASET_SUMMARY_PROMPT, ORDER_ANALYSIS_PROMPT
except ImportError:
    from .llm_factory import get_llm
    from .prompt_templates import DATASET_SUMMARY_PROMPT, ORDER_ANALYSIS_PROMPT


@lru_cache(maxsize=1)
def get_summary_chain():
    """
    Build and cache the reusable LCEL pipeline for general dataset business summaries.

    Returns:
        Runnable: Combined LangChain chain (Prompt | Gemini LLM | OutputParser).
    """
    return DATASET_SUMMARY_PROMPT | get_llm() | StrOutputParser()


@lru_cache(maxsize=1)
def get_order_summary_chain():
    """
    Build and cache the reusable LCEL pipeline for order-specific metric analysis.

    Returns:
        Runnable: Combined LangChain chain (Order Prompt | Gemini LLM | OutputParser).
    """
    return ORDER_ANALYSIS_PROMPT | get_llm() | StrOutputParser()
