from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/relais", tags=["relais"])


@router.get("", response_model=list[schemas.RelaisOut])
def list_relais(db: Session = Depends(get_db)):
    return db.query(models.Relais).all()
