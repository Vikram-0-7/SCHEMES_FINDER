from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
from ..database import get_db
from ..models import Scheme, Category
from ..schemas import SchemeResponse, SchemeListResponse, CategoryResponse

router = APIRouter(prefix="/api/schemes", tags=["schemes"])


@router.get("", response_model=SchemeListResponse)
def get_schemes(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, ge=1, le=50),
    category: Optional[str] = None,
    state: Optional[str] = None,
    search: Optional[str] = None,
    scheme_type: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """Get paginated list of schemes with optional filters."""
    query = db.query(Scheme)

    if category and category != "All":
        query = query.filter(Scheme.category == category)
    if state and state != "All":
        query = query.filter(Scheme.state == state)
    if scheme_type:
        query = query.filter(Scheme.scheme_type == scheme_type)
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                Scheme.title.ilike(search_term),
                Scheme.description.ilike(search_term),
                Scheme.eligibility.ilike(search_term),
            )
        )

    total = query.count()
    total_pages = max(1, (total + per_page - 1) // per_page)
    schemes = query.offset((page - 1) * per_page).limit(per_page).all()

    return SchemeListResponse(
        schemes=[SchemeResponse.model_validate(s) for s in schemes],
        total=total,
        page=page,
        per_page=per_page,
        total_pages=total_pages,
    )


@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    """Get all categories with scheme counts."""
    categories = db.query(Category).order_by(Category.name).all()
    return categories


@router.get("/states", response_model=List[str])
def get_states(db: Session = Depends(get_db)):
    """Get all unique states from schemes."""
    states = db.query(Scheme.state).distinct().order_by(Scheme.state).all()
    return [s[0] for s in states if s[0]]


@router.get("/search")
def search_schemes(
    q: str = Query("", min_length=1),
    db: Session = Depends(get_db),
):
    """Full-text search across schemes."""
    search_term = f"%{q}%"
    schemes = (
        db.query(Scheme)
        .filter(
            or_(
                Scheme.title.ilike(search_term),
                Scheme.description.ilike(search_term),
                Scheme.eligibility.ilike(search_term),
                Scheme.benefits.ilike(search_term),
            )
        )
        .limit(20)
        .all()
    )
    return [SchemeResponse.model_validate(s) for s in schemes]


@router.get("/{scheme_id}", response_model=SchemeResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    """Get a single scheme by ID."""
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Scheme not found")
    return SchemeResponse.model_validate(scheme)
