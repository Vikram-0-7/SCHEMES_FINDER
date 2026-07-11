from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List

from ..database import get_db
from ..models import Scheme, User
from ..schemas import SchemeResponse
from .auth import get_current_user

router = APIRouter(prefix="/personalized", tags=["personalized"])

@router.get("/schemes", response_model=List[SchemeResponse])
def get_personalized_schemes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    # --- Level 1: Strict Match (User State or Central) AND Occupation ---
    # This is the most personalized result.
    base_query = db.query(Scheme)
    
    # Pre-calculate occupation filters
    PROFILE_KEYWORDS = {
        "Farmer": ["agriculture", "farmer", "kisan", "crop", "farming", "rural"],
        "Student": ["education", "student", "scholarship", "school", "college", "academic"],
        "Teacher / Educator": ["teacher", "educator", "teaching", "faculty", "professor", "vidyakunj", "award"],
        "Woman": ["woman", "women", "female", "girl", "mahila", "beti"],
        "Youth (18-35)": ["youth", "young", "employment", "skill", "training"],
        "Senior Citizen 60+": ["senior", "elderly", "pension", "old age", "60+"],
        "BPL / Below Poverty Line": ["bpl", "poverty", "poor", "below poverty", "economically weaker"],
        "SC / ST / OBC": ["sc", "st", "obc", "scheduled caste", "scheduled tribe", "minority", "backward class"],
        "Minority Community": ["minority", "muslim", "christian", "sikh", "buddhist", "jain", "parsi"],
        "Differently Abled / Disabled": ["disabled", "disability", "differently abled", "handicapped", "divyang"],
        "Unemployed": ["unemployed", "jobless", "employment", "skill", "training"],
        "Entrepreneur / Self-Employed": ["entrepreneur", "startup", "business", "self-employed", "msme", "mudra"],
        "Unorganized / Daily Wage Worker": ["unorganized", "daily wage", "informal", "labour", "worker"],
        "Migrant Worker": ["migrant", "worker", "labour", "unorganized", "migration"],
        "Street Vendor": ["vendor", "street", "rehri", "patri", "svanidhi"],
        "Artisan / Weaver": ["artisan", "weaver", "handicraft", "handloom", "vishwakarma"],
        "Ex-Serviceman": ["ex-serviceman", "defense", "military", "army", "navy", "airforce"],
        "Widow / Destitute Woman": ["widow", "destitute", "deserted", "single mother"],
        "Pregnant / New Mother": ["pregnant", "maternity", "mother", "child", "maternal", "nutrition"],
        "Child (0-18)": ["child", "children", "minor", "infant", "juvenile"],
        "Urban Poor": ["urban", "slum", "city", "urban poor"],
        "Fishermen": ["fishermen", "fishing", "marine", "aquaculture", "matsya"],
    }
    
    keywords = PROFILE_KEYWORDS.get(current_user.occupation, [current_user.occupation]) if current_user.occupation else []
    occ_filters = []
    for kw in keywords:
        term = f"%{kw}%"
        occ_filters.append(Scheme.title.ilike(term))
        occ_filters.append(Scheme.description.ilike(term))
        occ_filters.append(Scheme.category.ilike(term))

    # Try Level 1
    query1 = base_query.filter(
        or_(Scheme.state.ilike(current_user.state), Scheme.state.ilike("Central"))
    )
    if occ_filters:
        query1 = query1.filter(or_(*occ_filters))
    
    # Age exclusion applies to all levels
    if current_user.age:
        if current_user.age < 60:
            query1 = query1.filter(and_(~Scheme.title.ilike("%Senior Citizen%"), ~Scheme.title.ilike("%60+%")))
        if current_user.age > 18:
            query1 = query1.filter(and_(~Scheme.title.ilike("%Child%"), ~Scheme.title.ilike("%School Student%")))

    schemes = query1.order_by(Scheme.created_at.desc()).limit(20).all()

    # --- Level 2 Fallback: If nothing found, try ANY Central schemes for that Occupation ---
    if not schemes and occ_filters:
        query2 = base_query.filter(Scheme.state.ilike("Central")).filter(or_(*occ_filters))
        # Re-apply age filter
        if current_user.age:
            if current_user.age < 60: query2 = query2.filter(~Scheme.title.ilike("%Senior Citizen%"))
        schemes = query2.limit(20).all()

    # --- Level 3 Fallback: If still nothing, show general schemes for the user's State ---
    if not schemes and current_user.state:
        query3 = base_query.filter(Scheme.state.ilike(current_user.state))
        # Re-apply age filter
        if current_user.age:
            if current_user.age < 60: query3 = query3.filter(~Scheme.title.ilike("%Senior Citizen%"))
        schemes = query3.limit(10).all()

    # --- Level 4: Absolute Fallback: Global popular central schemes ---
    if not schemes:
        schemes = base_query.filter(Scheme.state.ilike("Central")).limit(10).all()
        
    return schemes
