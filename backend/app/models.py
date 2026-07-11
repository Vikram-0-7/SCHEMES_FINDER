from sqlalchemy import Column, Integer, String, Text, DateTime, ARRAY
from sqlalchemy.sql import func
from .database import Base


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    description = Column(Text)
    category = Column(String(100), index=True)
    state = Column(String(100), default="Central", index=True)
    eligibility = Column(Text)
    benefits = Column(Text)
    documents_required = Column(Text)
    application_url = Column(String(500))
    source = Column(String(200))
    application_process = Column(Text)
    scheme_type = Column(String(50), default="central")  # 'central' or 'state'
    tags = Column(ARRAY(String), default=[])
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    icon = Column(String(50))
    scheme_count = Column(Integer, default=0)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    state = Column(String(100), nullable=True)
    age = Column(Integer, nullable=True)
    occupation = Column(String(100), nullable=True)
    gender = Column(String(50), nullable=True)
    income = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
