import sqlite3
import pandas as pd
from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent.parent

csv_file = BASE_DIR / "data" / "processed" / "cleaned_superstore.csv"
db_file = BASE_DIR / "database" / "metricmind.db"

# Read the cleaned dataset
df = pd.read_csv(csv_file)

# Connect to SQLite database
conn = sqlite3.connect(db_file)

# Create Orders table and import data
df.to_sql(
    "Orders",
    conn,
    if_exists="replace",
    index=False
)

# Close connection
conn.close()

print("Database created successfully!")
print(f"Database saved at: {db_file}")
print(f"Rows imported: {len(df)}")