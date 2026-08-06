"""
Simple script to test the AI module independently.

Run:
    python ai/test_ai.py
"""

from ai.insight_service import InsightService


sample_dataset = """
Global Superstore Sales Data

Sales:
120
340
280
560
410

Profit:
20
55
45
120
70
"""


def main():
    print("=" * 60)
    print("MetricMind AI Test")
    print("=" * 60)

    try:
        response = InsightService.summarize_dataset(sample_dataset)

        print("\nAI RESPONSE\n")
        print(response)

    except Exception as e:
        print("\nAI TEST FAILED\n")
        print(e)


if __name__ == "__main__":
    main()