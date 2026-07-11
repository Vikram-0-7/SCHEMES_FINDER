from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


# --- Scheme Schemas ---
class SchemeBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    state: Optional[str] = "Central"
    eligibility: Optional[str] = None
    benefits: Optional[str] = None
    documents_required: Optional[str] = None
    application_url: Optional[str] = None
    source: Optional[str] = None
    application_process: Optional[str] = None
    scheme_type: Optional[str] = "central"
    tags: Optional[List[str]] = []


class SchemeCreate(SchemeBase):
    pass


class SchemeResponse(SchemeBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SchemeListResponse(BaseModel):
    schemes: List[SchemeResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


# --- Category Schemas ---
class CategoryResponse(BaseModel):
    id: int
    name: str
    icon: Optional[str] = None
    scheme_count: int = 0

    class Config:
        from_attributes = True


# --- Discover Schemas ---
class DiscoverRequest(BaseModel):
    profiles: List[str] = []
    category: Optional[str] = "Any category"
    state: Optional[str] = "All India"
    keyword: Optional[str] = ""


class DiscoverResponse(BaseModel):
    schemes: List[SchemeResponse]
    state_count: int
    central_count: int
    total: int


# --- Chat Schemas ---
class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


# --- Widget Chat Schemas (AI Copilot) ---
class WidgetChatRequest(BaseModel):
    message: str
    page_context: Optional[str] = None  # Current URL or page description
    scheme_context: Optional[str] = None  # Scheme title/details user is viewing
    conversation_history: Optional[List[dict]] = []  # Previous messages for continuity


class WidgetAction(BaseModel):
    type: str  # 'navigate', 'filter', 'search', 'open_discover', 'none'
    payload: Optional[str] = None  # URL path, category name, search query, etc.


class WidgetChatResponse(BaseModel):
    reply: str
    action: Optional[WidgetAction] = None  # UI command for the frontend to execute
    detected_language: Optional[str] = "en"  # Language detected from user input

# --- User & Auth Schemas ---
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    state: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    gender: Optional[str] = None
    income: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    state: Optional[str] = None
    age: Optional[int] = None
    occupation: Optional[str] = None
    gender: Optional[str] = None
    income: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
