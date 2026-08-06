# MetricMind AI Module Setup

## Overview

The AI module uses **LangChain** with **OpenAI** to generate business insights from sales datasets.

---

## Project Structure

```
backend/
│
└── ai/
    ├── config.py
    ├── llm_factory.py
    ├── prompt_templates.py
    ├── chains.py
    ├── insight_service.py
    ├── routes.py
    └── test_ai.py
```

---

## Install Dependencies

```bash
pip install langchain
pip install langchain-openai
pip install python-dotenv
```

---

## Configure Environment

Create a `.env` file in the project root.

Example:

```env
OPENAI_API_KEY=your_api_key_here
MODEL_NAME=gpt-4.1-mini
```

---

## Run Backend

```bash
cd backend

uvicorn app:app --reload
```

---

## Swagger

```
http://127.0.0.1:8000/docs
```

---

## AI Endpoint

```
POST /ai/summarize
```

Example Request

```json
{
    "dataset": "Sales: 100, 200, 300\nProfit: 20, 40, 50"
}
```

---

## Test Script

```bash
python ai/test_ai.py
```

---

## Notes

A valid OpenAI API key is required to generate AI responses.