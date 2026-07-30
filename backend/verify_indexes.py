from database import engine, create_indexes
from sqlalchemy import text

def verify_indexes():
    """Verify that indexes exist in the database"""
    create_indexes(engine)
    
    with engine.connect() as conn:
        result = conn.execute(text(
            "SELECT name FROM sqlite_master WHERE type='index'"
        ))
        indexes = result.fetchall()
        
        print("\n📋 Existing indexes in database:")
        if indexes:
            for idx in indexes:
                print(f"  ✅ {idx[0]}")
        else:
            print("  ⚠️ No indexes found")

if __name__ == "__main__":
    verify_indexes()
