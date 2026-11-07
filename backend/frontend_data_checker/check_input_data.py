from pydantic import BaseModel
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator
import re

# -------------------------------------------------------------------------
# Frontend se jab koi subscription ka data aayega, ye use check karega
# -------------------------------------------------------------------------
class SubscriptionInputCheck(BaseModel):
    customer_id: int
    Notification_type: str  # Jaise: 'Premium', 'Basic'
    is_opted_in: int        # Jaise: '1' ya '0'
    user_id: int
    apps_id: int

# (Optional) Agar baad me naya user register karne ki API banani ho
class UserInputCheck(BaseModel):
    name: str
    email: str
    number: str
    password: str

# -------------------------------------------------------------------------
# Schema to validate User Registration data coming from frontend
# -------------------------------------------------------------------------
# 1. Standard User Registration Input Guard
class UserRegisterInput(BaseModel):
    name: str
    email: EmailStr  # Enforces global standard email validation automatically
    number: str
    password: str

    @field_validator('number')
    @classmethod
    def validate_user_phone(cls, value: str) -> str:
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Phone number must be exactly 10 digits.")
        return value

# 2. Standard Customer Onboarding Input Guard
"""class CustomerCreateInput(BaseModel):
    app_id: int
    name: str
    email: EmailStr  # Accepts any valid global domain extension (.com, .org, .co.in, etc.)
    number: str

    @field_validator('number')
    @classmethod
    def validate_customer_phone(cls, value: str) -> str:
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Phone number must be exactly 10 digits.")
        return value"""

class CustomerCreateInput(BaseModel):
    app_id: int
    name: str
    email: EmailStr
    number: str
    send_email: bool  # 🔴 NEW: True if checked, False if unchecked
    send_sms: bool    # 🔴 NEW: True if checked, False if unchecked

    @field_validator('number')
    @classmethod
    def validate_customer_phone(cls, value: str) -> str:
        if not re.match(r"^[0-9]{10}$", value):
            raise ValueError("Phone number must be exactly 10 digits.")
        return value
# -------------------------------------------------------------------------
# Schema to validate User Login credentials coming from frontend
# -------------------------------------------------------------------------
class UserLoginInput(BaseModel):
    email: str
    password: str

# -------------------------------------------------------------------------
# Schema to validate App Registration data coming from frontend
# -------------------------------------------------------------------------
class AppCreateInput(BaseModel):
    app_name: str
    app_id: int  # To know which user owns this app


    # -------------------------------------------------------------------------
# Schema to validate Customer Creation data coming from frontend
# -------------------------------------------------------------------------
from pydantic import BaseModel, EmailStr, field_validator
import re

"""# -------------------------------------------------------------------------
# Validated Schema to strict-check Customer data rows sent to our system
# -------------------------------------------------------------------------
class CustomerCreateInput(BaseModel):
    app_id: int
    name: str
    email: EmailStr  # Automatically validates correct email syntax on server side
    number: str

    # Field Validator to verify Indian 10-digit phone standards securely
    @field_validator('number')
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        # Checking if the number is exactly 10 digits from 0 to 9
        phone_regex = re.compile(r"^[0-9]{10}$")
        if not phone_regex.match(value):
            raise ValueError("Invalid Format: Phone number must be exactly 10 digits.")
        return value"""


# -------------------------------------------------------------------------
# Strictly Validated Schema to check Customer input rows with strict Regex
# -------------------------------------------------------------------------
"""class CustomerCreateInput(BaseModel):
    app_id: int
    name: str
    email: EmailStr 
    number: str

    # 1. Strict Validator for Email Extension Layout
    @field_validator('email')
    @classmethod
    def validate_strict_email(cls, value: str) -> str:
        # Enforces standard character matching ending with 2 to 4 letter extensions (.com/.in)
        email_regex = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$")
        if not email_regex.match(value):
            raise ValueError("Invalid Domain: Email must end with a standard extension like .com or .in")
        return value

    # 2. Strict Validator for Phone Number Matrix
    @field_validator('number')
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        phone_regex = re.compile(r"^[0-9]{10}$")
        if not phone_regex.match(value):
            raise ValueError("Invalid Format: Phone number must be exactly 10 digits.")
        return value"""


"""class CustomerCreateInput(BaseModel):
    app_id: int
    name: str
    email: str  # Kept as str to apply our custom strict regex check
    number: str

    # Strict Validator to allow ONLY @gmail.com
    @field_validator('email')
    @classmethod
    def validate_strict_gmail(cls, value: str) -> str:
        # Regex explanation: must end exactly with @gmail.com
        gmail_regex = re.compile(r"^[a-zA-Z0-9._%+-]+@gmail\.com$")
        if not gmail_regex.match(value):
            raise ValueError("Access Denied: Only official '@gmail.com' addresses are allowed.")
        return value

    # Strict Validator for Phone Number
    @field_validator('number')
    @classmethod
    def validate_phone_number(cls, value: str) -> str:
        phone_regex = re.compile(r"^[0-9]{10}$")
        if not phone_regex.match(value):
            raise ValueError("Invalid Format: Phone number must be exactly 10 digits.")
        return value"""