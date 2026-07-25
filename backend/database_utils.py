"""
database_utils.py - Utility scripts for managing the SQLite database.
Provides backup, restore, size check, and table count functions.

Usage:
    python database_utils.py backup    -> Backup the database
    python database_utils.py restore   -> Restore the database
    python database_utils.py size      -> Check database size
    python database_utils.py tables    -> Display total table count
"""

import os
import shutil
from datetime import datetime
from sqlalchemy import create_engine, text

# ─── Database Path Configuration ─────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'database', 'metricmind.db')
BACKUP_DIR = os.path.join(BASE_DIR, '..', 'database', 'backups')

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

# ─── Backup Function ──────────────────────────────────────
def backup_database():
    """
    Backup the SQLite database to a timestamped file in database/backups/.
    Creates the backups folder if it doesn't exist.
    """
    try:
        os.makedirs(BACKUP_DIR, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = os.path.join(BACKUP_DIR, f"metricmind_backup_{timestamp}.db")
        shutil.copy2(DB_PATH, backup_path)
        print(f"✅ Backup created: {backup_path}")
        return backup_path
    except Exception as e:
        print(f"❌ Backup failed: {e}")
        return None

# ─── Restore Function ─────────────────────────────────────
def restore_database(backup_file=None):
    """
    Restore the database from the latest backup or a specified backup file.
    """
    try:
        if backup_file is None:
            # Find the latest backup
            if not os.path.exists(BACKUP_DIR):
                print("❌ No backups directory found!")
                return False
            backups = sorted(os.listdir(BACKUP_DIR))
            if not backups:
                print("❌ No backup files found!")
                return False
            backup_file = os.path.join(BACKUP_DIR, backups[-1])

        shutil.copy2(backup_file, DB_PATH)
        print(f"✅ Database restored from: {backup_file}")
        return True
    except Exception as e:
        print(f"❌ Restore failed: {e}")
        return False

# ─── Database Size Function ───────────────────────────────
def check_database_size():
    """
    Check and display the current size of the database file.
    """
    try:
        size_bytes = os.path.getsize(DB_PATH)
        size_kb = size_bytes / 1024
        size_mb = size_kb / 1024
        print(f"📦 Database size: {size_bytes} bytes ({size_kb:.2f} KB / {size_mb:.4f} MB)")
        return size_bytes
    except Exception as e:
        print(f"❌ Could not check size: {e}")
        return 0

# ─── Table Count Function ─────────────────────────────────
def display_table_count():
    """
    Display the total number of tables in the database.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
            ))
            count = result.fetchone()[0]
            print(f"📋 Total tables in database: {count}")

            # Also show table names
            result2 = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ))
            tables = result2.fetchall()
            for table in tables:
                print(f"   - {table[0]}")
            return count
    except Exception as e:
        print(f"❌ Could not count tables: {e}")
        return 0

# ─── Run All Utilities ────────────────────────────────────
def run_all():
    """Run all utility functions for a complete database health check."""
    print("=" * 50)
    print("🔧 MetricMind Database Utility Report")
    print("=" * 50)
    check_database_size()
    display_table_count()
    backup_database()
    print("=" * 50)
    print("✅ All utilities completed!")

# ─── Command Line Interface ───────────────────────────────
if __name__ == "__main__":
    import sys
    commands = {
        "backup": backup_database,
        "restore": restore_database,
        "size": check_database_size,
        "tables": display_table_count,
        "all": run_all
    }

    if len(sys.argv) < 2 or sys.argv[1] not in commands:
        print("Usage: python database_utils.py [backup|restore|size|tables|all]")
    else:
        commands[sys.argv[1]]()