# MetricMind
Project - 1 for the Data Analytics Internship at Axlero Solutions.  

An AI-powered Semantic Business Intelligence Engine that answers business questions using governed metrics instead of raw SQL.

## Tech Stack

- FastAPI
- Next.js
- LangChain
- PostgreSQL
- Cube.dev
- ECharts

## Dataset

Dataset: Global Superstore Dataset

Source: Kaggle

### Key Columns

- Order Date
- Sales
- Profit
- Shipping Cost
- Region
- Country
- Market
- Category
- Sub-Category
- Customer Segment

## ETL Pipeline

The project includes an automated ETL script that:

- Reads the raw Global Superstore dataset
- Removes duplicate records
- Handles missing values
- Converts date columns
- Creates Year, Month, and Quarter features
- Saves a cleaned dataset for downstream analysis

## Project Status

🚧 Under Development

## Frontend

### Changes Made
- Initialized the Next.js frontend.
- Created the homepage.
- Added a navigation bar.
- Organized the frontend project structure.

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000 in your browser.