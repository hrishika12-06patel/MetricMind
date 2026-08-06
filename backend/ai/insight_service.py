from ai.chains import summary_chain


class InsightService:
    """
    Handles AI-powered business insights.
    """

    @staticmethod
    def summarize_dataset(dataset: str) -> str:
        """
        Generate a business summary for the given dataset.
        """

        response = summary_chain.invoke(
            {
                "question": "Summarize this sales dataset.",
                "dataset": dataset,
            }
        )

        return response