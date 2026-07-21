from database import engine

try:
    conn = engine.connect()
    print("✅ Connected to Supabase successfully!")
    conn.close()

except Exception as e:
    print("❌ Connection failed")
    print(e)