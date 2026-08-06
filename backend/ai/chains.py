from langchain_core.output_parsers import StrOutputParser

try:
    from ai.llm_factory import get_llm
    from ai.prompt_templates import DATASET_SUMMARY_PROMPT, ORDER_ANALYSIS_PROMPT
except ImportError:
    from llm_factory import get_llm
    from prompt_templates import DATASET_SUMMARY_PROMPT, ORDER_ANALYSIS_PROMPT


llm = get_llm()

summary_chain = (
    DATASET_SUMMARY_PROMPT
    | llm
    | StrOutputParser()
)

order_summary_chain = (
    ORDER_ANALYSIS_PROMPT
    | llm
    | StrOutputParser()
)