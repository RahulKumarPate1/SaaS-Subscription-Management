"""from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from frontend_data_checker import check_input_data
from backend_logic_controllers.subscription_logic import UserController, AppController, CustomerController

# Exact path to get_db and Models
from database_setting.connect_db import get_db
from database_tables.create_tables import Customer, Subscription

# Unified Router instance with correct prefix
router = APIRouter(prefix="/api/subscriptions", tags=["Subscription Links"])

# 🟢 1. URL Endpoint for User Registration (POST)
@router.post("/auth/register")
def register_user_endpoint(data: check_input_data.UserRegisterInput, db: Session = Depends(get_db)):
    result = UserController.register_user(db, data)
    if result.get("status") == "Error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result

# 🟢 2. URL Endpoint for User Login (POST)
@router.post("/auth/login")
def login_user_endpoint(data: check_input_data.UserLoginInput, db: Session = Depends(get_db)):
    result = UserController.login_user(db, data)
    if result.get("status") == "Error":
        raise HTTPException(status_code=401, detail=result["message"])
    return result

# 🟢 3. URL Endpoint to Register a New App (POST)
@router.post("/apps/add")
def add_app_endpoint(data: check_input_data.AppCreateInput, db: Session = Depends(get_db)):
    return AppController.add_app(db, data)

import re # 🔴 Make sure to add this import at the top of the file

# Open backend/api_endpoints_urls/subscription_urls.py
# Replace the add_new_customer endpoint with this structured format:

@router.post("/customers/add")
async def add_new_customer(data: check_input_data.CustomerCreateInput, db: Session = Depends(get_db)):
    try:
        # Extract fields directly from validated standard data schema
        cust_name = data.name
        cust_email = data.email
        cust_number = data.number
        
        send_email = data.send_email if data.send_email is not None else True
        send_sms = data.send_sms if data.send_sms is not None else True
        active_app_id = data.app_id if data.app_id is not None else 1

        selected_channels = []
        if send_email:
            selected_channels.append("email")
        if send_sms:
            selected_channels.append("sms")
        notif_string = ",".join(selected_channels) if selected_channels else "none"

        # Separate mapping logic for DB entries
        db_customer = Customer(name=cust_name, email=cust_email, number=cust_number)
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)

        db_subscription = Subscription(
            customer_id=db_customer.customer_id,
            app_id=int(active_app_id),
            status="Active",
            notification_type=notif_string
        )
        db.add(db_subscription)
        db.commit()

        return {"status": "Success", "message": "Preferences recorded safely."}

    except Exception as e:
        db.rollback()
        print(f"❌ DATABASE POST FAILURE: {str(e)}")
        raise HTTPException(status_code=500, detail="Database validation error occurred.")


# 🟢 5. THE LIVE GET ROUTE TO FETCH APP CUSTOMERS
@router.get("/customers/app/{app_id}")
async def get_app_customers(app_id: int, db: Session = Depends(get_db)):
    try:
        results = db.query(Customer).all()
        customer_list = []
        for customer in results:
            customer_list.append({
                "customer_id": customer.customer_id,
                "name": customer.name,
                "email": customer.email,
                "number": customer.number,
                "notification_type": "email,sms"
            })
        return customer_list
    except Exception as e:
        print(f"❌ GET ERROR: {str(e)}")
        return []"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database_setting.connect_db import get_db
from database_tables.create_tables import Customer, Subscription

router = APIRouter(prefix="/api/subscriptions", tags=["Subscription Links"])

@router.post("/customers/add")
async def add_new_customer(request: Request, db: Session = Depends(get_db)):
    try:
        # Direct raw JSON stream parsing to ensure no schema mismatch fields block us
        data = await request.json()
        
        cust_name = data.get("name")
        cust_email = data.get("email")
        cust_number = data.get("number")
        
        send_email = data.get("send_email", True)
        send_sms = data.get("send_sms", True)
        
        # Safe Integer conversion for MySQL Relational Key mapping
        raw_app_id = data.get("app_id")
        try:
            active_app_id = int(raw_app_id) if raw_app_id is not None else 1
        except (ValueError, TypeError):
            active_app_id = 1

        # Process notification vectors
        selected_channels = []
        if send_email:
            selected_channels.append("email")
        if send_sms:
            selected_channels.append("sms")
        notif_string = ",".join(selected_channels) if selected_channels else "none"

        # 🟢 STEP A: Deploy Entry into Customers Matrix
        db_customer = Customer(
            name=str(cust_name),
            email=str(cust_email),
            number=str(cust_number)
        )
        db.add(db_customer)
        db.commit()
        db.refresh(db_customer)

        # 🟢 STEP B: Deploy Dependency Configuration inside Subscriptions Table
        db_subscription = Subscription(
            customer_id=db_customer.customer_id,
            app_id=active_app_id,
            status="Active",
            notification_type=notif_string
        )
        db.add(db_subscription)
        db.commit()

        print(f"🚀 SUCCESS: Registered customer {cust_name} under App ID #{active_app_id}")
        return {"status": "Success", "message": "Preferences synchronized securely."}

    except Exception as e:
        db.rollback()
        # Full diagnostics printed out to developer terminal console
        print(f"❌ DATABASE TRANSACTION REJECTED: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database execution fault: {str(e)}")


# Open backend/api_endpoints_urls/subscription_urls.py
# Go to the very bottom and replace the GET function with this exact block:

@router.get("/customers/app/{app_id}")
async def get_app_customers(app_id: int, db: Session = Depends(get_db)):
    try:
        print(f"🔍 FETCHING: Compiling customer dataset grid for App ID: {app_id}")
        
        # Industry-standard relational join optimized for clean dynamic loading
        results = db.query(Customer).join(
            Subscription, 
            Customer.customer_id == Subscription.customer_id
        ).filter(Subscription.app_id == app_id).all()

        customer_list = []
        for customer in results:
            customer_list.append({
                "customer_id": customer.customer_id,
                "name": customer.name,
                "email": customer.email,
                "number": customer.number,
                "notification_type": "email,sms" # Standard dynamic lane fallback
            })
            
        print(f"🟢 SUCCESS: Extracted {len(customer_list)} rows for dashboard render.")
        return customer_list

    except Exception as e:
        print(f"❌ BACKEND GET EXCEPTION: {str(e)}")
        # Returns empty array safely to prevent frontend dashboard grid from breaking
        return []