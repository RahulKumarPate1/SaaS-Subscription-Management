from sqlalchemy.orm import Session
from database_tables import create_tables
from frontend_data_checker import check_input_data
from datetime import datetime
# Add these lines at the very top of your subscription_logic.py file

from frontend_data_checker.check_input_data import CustomerCreateInput
from database_tables.create_tables import Customer, Subscription

class SubscriptionController:

    # 1. LOGIC: Nayi Subscription Database Me Save Karna
    @staticmethod
    def buy_subscription(db: Session, data: check_input_data.SubscriptionInputCheck):
        # Aaj ki date nikalna string format me (kyunki aapke DB me varchar/string hai)
        today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Database ke table model ke hisab se data arrange karna
        new_sub = create_tables.Subscription(
            customer_id=data.customer_id,
            Notification_type=data.Notification_type,
            is_opted_in=data.is_opted_in,
            opt_in_date=today_str,
            opt_out_date=None,  # Khareedte waqt opt-out khali rahega
            user_id=data.user_id,
            apps_id=data.apps_id
        )
        
        # Database me daalna aur save (commit) karna
        db.add(new_sub)
        db.commit()
        db.refresh(new_sub) # Nayi generated subscription_id lene ke liye
        
        return new_sub

    # 2. LOGIC: Customer Ki Subscription Details Check Karna
    @staticmethod
    def check_subscription(db: Session, customer_id: int):
        # Database me is customer_id ki sabse naye subscription dhoondna
        sub = db.query(create_tables.Subscription).\
            filter(create_tables.Subscription.customer_id == customer_id).\
            order_by(create_tables.Subscription.subscription_id.desc()).first()
            
        if not sub:
            return {"status": "No Subscription", "message": "Is customer ki koi subscription nahi mili."}
            
        return {
            "customer_id": sub.customer_id,
            "plan_type": sub.Notification_type,
            "is_opted_in": sub.is_opted_in,
            "joined_at": sub.opt_in_date
        }
    # 3. LOGIC: Subscription Update Karne Ke Liye (PUT)
    @staticmethod
    def update_subscription(db: Session, subscription_id: int, notification_type: str, is_opted_in: int):
        # Pehle database me us subscription ko dhoondo jise update karna hai
        sub = db.query(create_tables.Subscription).filter(create_tables.Subscription.subscription_id == subscription_id).first()
        
        if not sub:
            return None # Agar record nahi mila to None return karo
            
        # Agar mil gaya, to naye data se update kar do
        sub.Notification_type = notification_type
        sub.is_opted_in = is_opted_in
        
        db.commit() # Database me save karo
        db.refresh(sub)
        return sub

    # 4. LOGIC: Subscription Delete Karne Ke Liye (DELETE)
    @staticmethod
    def delete_subscription(db: Session, subscription_id: int):
        # Pehle database me dhoondo
        sub = db.query(create_tables.Subscription).filter(create_tables.Subscription.subscription_id == subscription_id).first()
        
        if not sub:
            return False # Agar record nahi mila to False
            
        # Agar mil gaya, to delete kar do
        db.delete(sub)
        db.commit() # Changes save karo
        return True
    # -------------------------------------------------------------------------
# Controller class to handle User Authentication business logic
# -------------------------------------------------------------------------
class UserController:

    # 1. LOGIC: Register a new user
    @staticmethod
    def register_user(db: Session, data: check_input_data.UserRegisterInput):
        # Check if the email already exists in the database
        existing_user = db.query(create_tables.User).filter(create_tables.User.email == data.email).first()
        if existing_user:
            return {"status": "Error", "message": "Email is already registered!"}

        # Format current time to string for database consistency
        today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Prepare new user database row model
        # Note: In production, passwords should be hashed (e.g., using bcrypt)
        new_user = create_tables.User(
            name=data.name,
            email=data.email,
            number=data.number,
            password=data.password, # Plain text for simplicity now
            customer_id=None,       # Keeping empty as per your DB structure
            apps_id=None
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "Success", "message": "User registered successfully!", "user_id": new_user.user_id}

    # 2. LOGIC: Verify user credentials for Login
    @staticmethod
    def login_user(db: Session, data: check_input_data.UserLoginInput):
        # Search for user with matching email and password
        user = db.query(create_tables.User).filter(
            create_tables.User.email == data.email,
            create_tables.User.password == data.password
        ).first()

        if not user:
            return {"status": "Error", "message": "Invalid email or password!"}

        return {
            "status": "Success",
            "message": "Login successful!",
            "user": {
                "user_id": user.user_id,
                "name": user.name,
                "email": user.email
            }
        }
    

# -------------------------------------------------------------------------
# Controller class to handle App management business logic
# -------------------------------------------------------------------------
class AppController:

    # 1. LOGIC: Add a new app to the database
    @staticmethod
    def add_app(db: Session, data: check_input_data.AppCreateInput):
        new_app = create_tables.App(
            app_name=data.app_name
            # If you add user_id column in MySQL apps table later, uncomment below line:
            # user_id=data.user_id
        )
        db.add(new_app)
        db.commit()
        db.refresh(new_app)
        return {"status": "Success", "message": "App registered successfully!", "app_id": new_app.app_id}

    # 2. LOGIC: Get all registered apps
    @staticmethod
    def get_all_apps(db: Session):
        apps_list = db.query(create_tables.App).all()
        return apps_list
    

    # -------------------------------------------------------------------------
# Controller class to handle Customer management business logic
# -------------------------------------------------------------------------
class CustomerController:

    # 1. LOGIC: Add a new customer to the database
   """ @staticmethod
    def add_customer(db: Session, data: check_input_data.CustomerCreateInput):
        new_customer = create_tables.Customer(
            app_id=data.app_id,
            name=data.name,
            email=data.email,
            number=data.number
        )
        db.add(new_customer)
        db.commit()
        db.refresh(new_customer)
        return {
            "status": "Success", 
            "message": "Customer added successfully!", 
            "customer_id": new_customer.customer_id
        }"""
   # Inside backend_logic_controllers/subscription_logic.py



@classmethod
def add_customer(cls, db: Session, data: CustomerCreateInput):
    # 1. Pehle logic se "email,sms" wali string taiyar karo
    selected_channels = []
    if data.send_email:
        selected_channels.append("email")
    if data.send_sms:
        selected_channels.append("sms")
    notif_string = ",".join(selected_channels) if selected_channels else "none"

    # 2. STEP A: Data ko pehle Customer table me save karo
    db_customer = Customer(
        name=data.name,
        email=data.email,
        number=data.number
    )
    db.add(db_customer)
    db.commit() # Isse customer_id generate ho jayegi
    db.refresh(db_customer)

    # 3. STEP B: Ab wahi customer_id utha kar Subscription table me notification_type ke sath dalo!
    db_subscription = Subscription(
        customer_id=db_customer.customer_id, # Linking both tables automatically
        app_id=data.app_id,
        status="Active",
        notification_type=notif_string # 🔴 Stored safely in subscription table!
    )
    db.add(db_subscription)
    db.commit()

    return db_customer

    # 2. LOGIC: Fetch all customers belonging to a specific app
    @staticmethod
    def get_customers_by_app(db: Session, app_id: int):
        customers_list = db.query(create_tables.Customer).filter(
            create_tables.Customer.app_id == app_id
        ).all()
        return customers_list