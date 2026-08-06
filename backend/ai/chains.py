from langchain_core.output_parsers import StrOutputParser

from ai.llm_factory import get_llm
from ai.prompt_templates import DATASET_SUMMARY_PROMPT


llm = get_llm()

summary_chain = (
    DATASET_SUMMARY_PROMPT
    | llm
    | StrOutputParser()
)