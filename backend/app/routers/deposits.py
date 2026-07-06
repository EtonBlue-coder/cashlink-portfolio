import random
import datetime as dt

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/deposits", tags=["deposits"])


def make_serial(relais: models.Relais) -> str:
    prefix = "".join([w[0] for w in relais.name.split()[:2]]).upper()
    return f"{prefix}-{random.randint(10000, 99999)}"


@router.post("", response_model=schemas.DepositOut)
def create_deposit(payload: schemas.DepositCreate, db: Session = Depends(get_db)):
    """
    Step 1 of the flow: the user declares an intent to deposit cash at a
    given relais. Nothing is credited yet -- this only generates the
    reference code shown as a QR in the app.
    """
    user = db.query(models.User).get(payload.user_id)
    relais = db.query(models.Relais).get(payload.relais_id)
    if not user or not relais:
        raise HTTPException(404, "Utilisateur ou point relais introuvable.")
    if not relais.active:
        raise HTTPException(400, "Ce point relais n'est pas actif actuellement.")
    if payload.amount_cents <= 0:
        raise HTTPException(400, "Montant invalide.")

    deposit = models.Deposit(
        user_id=user.id,
        relais_id=relais.id,
        amount_cents=payload.amount_cents,
        serial=make_serial(relais),
    )
    db.add(deposit)
    db.commit()
    db.refresh(deposit)
    return deposit


@router.post("/{deposit_id}/validate", response_model=schemas.DepositOut)
def validate_deposit(deposit_id: str, db: Session = Depends(get_db)):
    """
    Step 2 of the flow: called from the *partner-facing* interface once
    the relais has physically received and checked the cash. This is the
    only place where the user's balance is credited.

    NOTE: in a real deployment this endpoint must sit behind partner
    authentication, and the actual fund movement must be confirmed by a
    licensed payment partner -- see README -> "Regulatory notice".
    """
    deposit = db.query(models.Deposit).get(deposit_id)
    if not deposit:
        raise HTTPException(404, "Dépôt introuvable.")
    if deposit.status != models.DepositStatus.pending:
        raise HTTPException(400, f"Ce dépôt est déjà au statut '{deposit.status.value}'.")

    deposit.status = models.DepositStatus.validated
    deposit.validated_at = dt.datetime.utcnow()

    user = db.query(models.User).get(deposit.user_id)
    user.balance_cents += deposit.amount_cents

    db.commit()
    db.refresh(deposit)
    return deposit


@router.get("/user/{user_id}", response_model=list[schemas.DepositOut])
def list_user_deposits(user_id: str, db: Session = Depends(get_db)):
    return (
        db.query(models.Deposit)
        .filter(models.Deposit.user_id == user_id)
        .order_by(models.Deposit.created_at.desc())
        .all()
    )
