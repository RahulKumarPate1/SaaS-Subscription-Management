from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# -------------------------------------------------------------------------
# APNA REAL PASSWORD: Yahan 'root123' ki jagah apna MySQL ka asli password daalna
# -------------------------------------------------------------------------
DATABASE_URL = "mysql+pymysql://root:Rahul%409250@localhost:3306/subscriptionservice"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()