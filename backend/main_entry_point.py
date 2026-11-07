"""from fastapi import FastAPI

app = FastAPI(title="Subscription service API")

@app.get("/")
def home():
    return {"message": "Server is running perfectly!"}"""




"""from fastapi import FastAPI
from database_setting.connect_db import engine, Base
from database_tables import create_tables

app = FastAPI(title="Subscription Service API")

@app.get("/")
def home():
    return {"status": "Connected", "message": "Aapka Python backend aapke asli MySQL tables se sync ho gaya hai!"}"""


#python -m uvicorn main_entry_point:app --reload ==== ue to start the backend



from fastapi import FastAPI
from database_setting.connect_db import engine, Base
from fastapi.middleware.cors import CORSMiddleware
from database_tables import create_tables
# Naye banaye hue urls router ko import kiya
from api_endpoints_urls import subscription_urls

from database_setting.connect_db import engine, Base
from database_tables import create_tables

# Pehle purani out-dated tables ko delete karega
Base.metadata.drop_all(bind=engine) 

# Ab ekdum fresh aur naye columns (app_id ke sath) table generate karega
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Subscription Service API")

# Router ko include kiya taaki links active ho jayein
app.include_router(subscription_urls.router)

# -------------------------------------------------------------------------
# CORS Config: Enable cross-origin requests for frontend-backend integration
# -------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin or domain
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all communication and authentication headers
)

@app.get("/")
def home():
    return {"status": "Connected", "message": "Backend aur URLs dono full-stack project ke liye ready hain!"}


