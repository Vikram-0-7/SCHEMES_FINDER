from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models import Scheme

db_url = settings.DATABASE_URL.replace("&", "&")
engine = create_engine(db_url)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()

try:
    schemes = db.query(Scheme).all()
    for scheme in schemes:
        if not scheme.application_process:
            scheme.application_process = "1. Visit the official scheme portal\n2. Register an account using your Aadhar card or mobile number\n3. Fill out the application form with accurate details\n4. Upload necessary supporting documents\n5. Submit the application and save the reference number for tracking"
    db.commit()
    print("Updated mock application_process for existing schemes.")
except Exception as e:
    print(f"Error: {e}")
finally:
    db.close()
