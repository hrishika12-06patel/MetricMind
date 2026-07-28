"""
database_utils.py - Utility and health monitoring scripts for the MetricMind SQLite database.
Provides backup, restore, size check, table count, and full health diagnostics.

Usage:
    python database_utils.py [command]

Commands:
    backup   - Backup the database
    restore  - Restore the database
    size     - Check database size
    tables   - Display total table count
    records  - Display record count per table
    indexes  - Verify all required indexes
    version  - Show SQLite version
    modified - Show last modified time
    orders   - Check if orders table exists
    health   - Generate full health report
    all      - Run all basic utilities
"""

import os
import shutil
import sys
from datetime import datetime
from sqlalchemy import create_engine, text

# ─── Database Path Configuration ─────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, '..', 'database', 'metricmind.db')
BACKUP_DIR = os.path.join(BASE_DIR, '..', 'database', 'backups')

engine = create_engine(f"sqlite:///{DB_PATH}", connect_args={"check_same_thread": False})

# ─── Backup Function ──────────────────────────────────────
def backup_database():
    """Backup the SQLite database to a timestamped file in database/backups/."""
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
    """Restore the database from the latest backup or a specified backup file."""
    try:
        if backup_file is None:
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
    """Check and display the current size of the database file."""
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
    """Display the total number of tables in the database."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'"
            ))
            count = result.fetchone()[0]
            print(f"📋 Total tables in database: {count}")
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

# ─── Record Count Function ────────────────────────────────
def display_record_count():
    """Display the total number of records in each table."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ))
            tables = result.fetchall()
            print("📊 Record count per table:")
            for table in tables:
                table_name = table[0]
                count_result = conn.execute(text(f'SELECT COUNT(*) FROM "{table_name}"'))
                count = count_result.fetchone()[0]
                print(f"   - {table_name}: {count} records")
    except Exception as e:
        print(f"❌ Error counting records: {e}")

# ─── Index Verification Function ──────────────────────────
def verify_indexes():
    """Verify that all required indexes exist in the database."""
    required_indexes = [
        "idx_order_id", "idx_customer_id", "idx_region", "idx_category"
    ]
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='index'"
            ))
            existing = [row[0] for row in result.fetchall()]
            print("🔍 Index verification:")
            all_ok = True
            for idx in required_indexes:
                if idx in existing:
                    print(f"   ✅ {idx} exists")
                else:
                    print(f"   ❌ {idx} MISSING")
                    all_ok = False
            return all_ok
    except Exception as e:
        print(f"❌ Error verifying indexes: {e}")
        return False

# ─── SQLite Version Function ──────────────────────────────
def get_sqlite_version():
    """Show the SQLite database version."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT sqlite_version()"))
            version = result.fetchone()[0]
            print(f"🗄️  SQLite version: {version}")
            return version
    except Exception as e:
        print(f"❌ Error getting version: {e}")
        return None

# ─── Last Modified Function ───────────────────────────────
def get_last_modified():
    """Display the last modified timestamp of the database file."""
    try:
        timestamp = os.path.getmtime(DB_PATH)
        modified_time = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        print(f"🕐 Last modified: {modified_time}")
        return modified_time
    except Exception as e:
        print(f"❌ Error getting last modified time: {e}")
        return None

# ─── Orders Table Check ───────────────────────────────────
def check_orders_table_exists():
    """Check whether the orders table exists in the database."""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='Orders'"
            ))
            exists = result.fetchone() is not None
            if exists:
                print("✅ Orders table exists.")
            else:
                print("❌ Orders table does NOT exist.")
            return exists
    except Exception as e:
        print(f"❌ Error checking table: {e}")
        return False

# ─── Full Health Report ───────────────────────────────────
def generate_health_report():
    """Generate a complete database health report."""
    print("\n" + "=" * 55)
    print("🏥  MetricMind Database Health Report")
    print("=" * 55)
    if os.path.exists(DB_PATH):
        print("✅ Database file exists.")
    else:
        print("❌ Database file NOT found!")
        return
    check_database_size()
    display_table_count()
    display_record_count()
    verify_indexes()
    get_sqlite_version()
    get_last_modified()
    check_orders_table_exists()
    print("=" * 55)
    print("✅ Health report complete!")
    print("=" * 55 + "\n")

# ─── Run All Utilities ────────────────────────────────────
def run_all():
    """Run all basic utility functions."""
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
    commands = {
        "backup": backup_database,
        "restore": restore_database,
        "size": check_database_size,
        "tables": display_table_count,
        "all": run_all,
        "health": generate_health_report,
        "records": display_record_count,
        "indexes": verify_indexes,
        "version": get_sqlite_version,
        "modified": get_last_modified,
        "orders": check_orders_table_exists,
    }

    if len(sys.argv) < 2 or sys.argv[1] not in commands:
        print("\nUsage: python database_utils.py [command]")
        print("\nAvailable commands:")
        print("  backup   - Backup the database")
        print("  restore  - Restore the database")
        print("  size     - Check database size")
        print("  tables   - Display total table count")
        print("  records  - Display record count per table")
        print("  indexes  - Verify all required indexes")
        print("  version  - Show SQLite version")
        print("  modified - Show last modified time")
        print("  orders   - Check if orders table exists")
        print("  health   - Generate full health report")
        print("  all      - Run all basic utilities\n")
    else:
        commands[sys.argv[1]]()