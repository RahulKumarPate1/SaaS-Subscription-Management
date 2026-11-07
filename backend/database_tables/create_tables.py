from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database_setting.connect_db import Base

class User(Base):
    __tablename__ = "users" # MySQL me jaisa chote aksharon me hai
    
    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    number = Column(String(15))
    password = Column(String(255))
    customer_id = Column(String(50)) # Aapke screenshot ke mutabik
    apps_id = Column(String(50))

class App(Base):
    __tablename__ = "apps"
    
    # -------------------------------------------------------------------------
    # Mapping Python class to the exact MySQL 'apps' table structure
    # -------------------------------------------------------------------------
    app_id = Column(Integer, primary_key=True, index=True)
    app_name = Column(String(100))
    # user_id = Column(Integer) # Keep it commented if not present in your MySQL apps table

    
# In backend/database_tables/create_tables.py

class Customer(Base):
    __tablename__ = "customers"
    
    customer_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    number = Column(String(50), nullable=False)

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    subscription_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    customer_id = Column(Integer, ForeignKey("customers.customer_id"))
    app_id = Column(Integer, default=1) # 🔴 Yeh column hona zaroori hai!
    status = Column(String(50), default="Active")
    notification_type = Column(String(100), default="email,sms") # 🔴 Yeh yahan hona chahiye!