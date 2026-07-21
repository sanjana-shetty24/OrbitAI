"""
Run this once to create the chats/messages tables in Supabase PostgreSQL.
Usage: python create_tables.py
"""

from database import Base, engine
import models  # noqa: F401  (import so models are registered on Base.metadata)


def main():
    print("Creating database tables (if they don't already exist)...")
    Base.metadata.create_all(bind=engine)
    print("Done.")


if __name__ == "__main__":
    main()
