from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import schemes, discover, chatbot, auth, personalized
from .database import engine, Base

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SchemesMadeSimple API",
    description="API for discovering Indian government welfare schemes",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(schemes.router)
app.include_router(discover.router)
app.include_router(chatbot.router)
app.include_router(auth.router)
app.include_router(personalized.router)


@app.get("/")
def root():
    return {
        "message": "SchemesMadeSimple API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
