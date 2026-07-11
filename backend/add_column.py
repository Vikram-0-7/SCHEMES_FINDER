from sqlalchemy import create_engine, text
from app.config import settings

db_url = settings.DATABASE_URL.replace("&", "&")
engine = create_engine(db_url)

with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE schemes ADD COLUMN application_process TEXT;"))
        conn.commit()
        print("Column added successfully")
    except Exception as e:
        print(f"Error: {e}")
