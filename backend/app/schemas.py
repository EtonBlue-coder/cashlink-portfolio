import datetime as dt
from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    name: str
    email: EmailStr


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    balance_cents: float

    class Config:
        from_attributes = True


class RelaisOut(BaseModel):
    id: str
    name: str
    zone: str
    active: bool

    class Config:
        from_attributes = True


class DepositCreate(BaseModel):
    user_id: str
    relais_id: str
    amount_cents: float


class DepositOut(BaseModel):
    id: str
    user_id: str
    relais_id: str
    amount_cents: float
    status: str
    serial: str
    created_at: dt.datetime
    validated_at: dt.datetime | None = None

    class Config:
        from_attributes = True
