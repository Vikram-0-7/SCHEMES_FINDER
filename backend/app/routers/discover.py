from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from ..database import get_db
from ..models import Scheme
from ..schemas import DiscoverRequest, DiscoverResponse, SchemeResponse
from ..services.scraper_service import search_and_scrape_schemes
from ..services.groq_service import extract_schemes_from_text
import asyncio

router = APIRouter(prefix="/api/discover", tags=["discover"])

# Mapping of profile tags to relevant search terms
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


@router.post("", response_model=DiscoverResponse)
def discover_schemes(
    request: DiscoverRequest,
    db: Session = Depends(get_db),
):
    """AI-powered scheme matching based on user profile."""
    query = db.query(Scheme)
    filters = []

    # Build keyword filters from selected profiles
    for profile in request.profiles:
        keywords = PROFILE_KEYWORDS.get(profile, [])
        for kw in keywords:
            term = f"%{kw}%"
            filters.append(
                or_(
                    Scheme.title.ilike(term),
                    Scheme.description.ilike(term),
                    Scheme.eligibility.ilike(term),
                    Scheme.benefits.ilike(term),
                )
            )

    # Category filter
    if request.category and request.category != "Any category":
        query = query.filter(Scheme.category == request.category)

    # State filter
    if request.state and request.state != "All India":
        query = query.filter(
            or_(Scheme.state == request.state, Scheme.state == "Central")
        )

    # Keyword filter
    if request.keyword:
        term = f"%{request.keyword}%"
        filters.append(
            or_(
                Scheme.title.ilike(term),
                Scheme.description.ilike(term),
            )
        )

    # Apply profile/keyword filters with OR logic
    if filters:
        query = query.filter(or_(*filters))

    schemes = query.limit(50).all()

    # Count state vs central
    state_count = sum(1 for s in schemes if s.scheme_type == "state")
    central_count = sum(1 for s in schemes if s.scheme_type == "central")

    return DiscoverResponse(
        schemes=[SchemeResponse.model_validate(s) for s in schemes],
        state_count=state_count,
        central_count=central_count,
        total=len(schemes),
    )

from pydantic import BaseModel

class LiveSearchRequest(BaseModel):
    query: str

@router.post("/live-search", response_model=list[SchemeResponse])
async def live_search_schemes(
    request: LiveSearchRequest,
    db: Session = Depends(get_db)
):
    """
    Actively scrape the web for schemes matching the query and extract them.
    Saves new schemes to the database to prevent hallucinations and avoid repeated searches.
    Checks the database first to provide instant results if available.
    """
    # 1. First, check if we already have schemes in the DB matching this query
    # We want to be careful not to return irrelevant results (e.g., Bihar results for a Meghalaya query)
    term = f"%{request.query}%"
    
    # Try to detect if a state is mentioned in the query to make the DB check more accurate
    detected_state = None
    for state_name in ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"]:
        if state_name.lower() in request.query.lower():
            detected_state = state_name
            break
            
    query_filter = or_(
        Scheme.title.ilike(term),
        Scheme.description.ilike(term)
    )
    
    # If a state is detected, ensure the DB results match that state or are 'Central'
    if detected_state:
        query_filter = and_(
            query_filter,
            or_(Scheme.state.ilike(detected_state), Scheme.state.ilike("Central"))
        )

    existing_schemes = db.query(Scheme).filter(query_filter).limit(10).all()
    
    # Only skip the live search if we found a good number of EXACTLY relevant results
    # If a state was mentioned but we found 0 results for that state, we MUST proceed to live search
    if len(existing_schemes) >= 8:
        return [SchemeResponse.model_validate(s) for s in existing_schemes]

    # 2. Perform the deep live search if not enough relevant results are found
    scraped_text = await search_and_scrape_schemes(request.query)
    
    if not scraped_text:
        return [SchemeResponse.model_validate(s) for s in existing_schemes]
        
    extracted_schemes = await extract_schemes_from_text(scraped_text)
    
    saved_schemes = list(existing_schemes)
    existing_titles = [s.title.lower() for s in existing_schemes]
    
    for scheme_data in extracted_schemes:
        title = scheme_data.get("title", "Unknown Scheme")
        # Check if already exists by exact title match (case insensitive)
        if title.lower() in existing_titles:
            continue
            
        # Check database for exact match as well
        db_existing = db.query(Scheme).filter(Scheme.title.ilike(title)).first()
        if db_existing:
            saved_schemes.append(db_existing)
            existing_titles.append(title.lower())
            continue
            
        # Create new scheme
        new_scheme = Scheme(
            title=title,
            description=scheme_data.get("description"),
            category=scheme_data.get("category"),
            state=scheme_data.get("state", "Central"),
            eligibility=scheme_data.get("eligibility"),
            benefits=scheme_data.get("benefits"),
            documents_required=scheme_data.get("documents_required"),
            application_process=scheme_data.get("application_process"),
            application_url=scheme_data.get("application_url"),
            source=scheme_data.get("source"),
            scheme_type=scheme_data.get("scheme_type", "central"),
        )
        db.add(new_scheme)
        try:
            db.commit()
            db.refresh(new_scheme)
            saved_schemes.append(new_scheme)
            existing_titles.append(title.lower())
        except Exception as e:
            db.rollback()
            print(f"Error saving scheme: {e}")
            
    return [SchemeResponse.model_validate(s) for s in saved_schemes]
