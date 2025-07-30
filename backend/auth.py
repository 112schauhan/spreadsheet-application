from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt as pyjwt
import os

# This is just a simple demo implementation
# In a real application, you would use more secure methods for storing and handling credentials

router = APIRouter()

# Demo users (in a real app, you would use a database)
DEMO_USERS = {
    "user1": {"username": "user1", "password": "password1", "color": "red"},
    "user2": {"username": "user2", "password": "password2", "color": "blue"},
    "user3": {"username": "user3", "password": "password3", "color": "green"},
}

# Secret key for JWT encoding/decoding
# In a real app, store this in environment variables
SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Token model
class Token(BaseModel):
    access_token: str
    token_type: str
    username: str
    color: str

# User model
class User(BaseModel):
    username: str
    color: str

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def authenticate_user(username: str, password: str) -> Optional[User]:
    """Verify username/password and return user if valid"""
    if username in DEMO_USERS and DEMO_USERS[username]["password"] == password:
        return User(username=username, color=DEMO_USERS[username]["color"])
    return None

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Create JWT token with user data"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = pyjwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    """Decode JWT token and return current user"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = pyjwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None or username not in DEMO_USERS:
            raise credentials_exception
    except Exception:
        # Catch all JWT exceptions
        raise credentials_exception
    
    return User(username=username, color=DEMO_USERS[username]["color"])

@router.post("/login", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login endpoint that returns a JWT token"""
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user.username,
        "color": user.color
    }

@router.get("/users/me", response_model=User)
async def read_users_me(current_user: User = Depends(get_current_user)):
    """Test endpoint to verify authentication"""
    return current_user
