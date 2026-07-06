from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import users, relais, deposits

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="CashLink API",
    description="Portfolio project — API de démonstration pour le dépôt d'espèces via un réseau de points relais. "
                 "Voir README pour le disclaimer réglementaire complet.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # demo only -- restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(relais.router)
app.include_router(deposits.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "cashlink-api", "docs": "/docs"}
