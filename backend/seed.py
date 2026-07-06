"""
Seeds the demo database with a sample user and a few relais partners.
Run once with: python seed.py
"""
from app.database import Base, engine, SessionLocal
from app import models

Base.metadata.create_all(bind=engine)
db = SessionLocal()

if not db.query(models.User).filter_by(email="demo@cashlink.re").first():
    demo_user = models.User(name="Demo User", email="demo@cashlink.re", balance_cents=0)
    db.add(demo_user)

relais_data = [
    ("Family Arena Réunion", "Saint-Pierre centre"),
    ("Épicerie Bellevue", "Terre Sainte"),
    ("Snack Le Piton", "Ravine Blanche"),
]
for name, zone in relais_data:
    if not db.query(models.Relais).filter_by(name=name).first():
        db.add(models.Relais(name=name, zone=zone, active=True))

db.commit()
print("Seed terminé.")
