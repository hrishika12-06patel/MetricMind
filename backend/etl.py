from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
RAW_CSV = BASE_DIR / ".." / "data" / "raw" / "Global_Superstore.csv"
PROCESSED_DIR = BASE_DIR / ".." / "data" / "processed"
OUTPUT_CSV = PROCESSED_DIR / "cleaned_superstore.csv"

try:
    # Extract
    df = pd.read_csv(RAW_CSV)

    # Transform
    df = df.drop_duplicates()
    df = df.dropna()

    df["Order.Date"] = pd.to_datetime(df["Order.Date"])
    df["Ship.Date"] = pd.to_datetime(df["Ship.Date"])

    df["Year"] = df["Order.Date"].dt.year
    df["Month"] = df["Order.Date"].dt.month
    df["Quarter"] = df["Order.Date"].dt.quarter

    # Load
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUTPUT_CSV, index=False)

    print("ETL completed successfully!")
except FileNotFoundError as exc:
    print(f"File not found: {exc.filename}")
except Exception as exc:
    print(f"ETL failed: {exc}")
