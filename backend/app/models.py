import uuid
import datetime as dt

from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Enum
import enum

from .database import Base


def gen_id():
    return str(uuid.uuid4())[:8]


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    balance_cents = Column(Float, default=0)
    created_at = Column(DateTime, default=dt.datetime.utcnow)


class Relais(Base):
    __tablename__ = "relais"

    id = Column(String, primary_key=True, default=gen_id)
    name = Column(String, nullable=False)
    zone = Column(String, nullable=False)
    active = Column(Boolean, default=True)


class DepositStatus(str, enum.Enum):
    pending = "pending"
    validated = "validated"
    cancelled = "cancelled"


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(String, primary_key=True, default=gen_id)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    relais_id = Column(String, ForeignKey("relais.id"), nullable=False)
    amount_cents = Column(Float, nullable=False)
    status = Column(Enum(DepositStatus), default=DepositStatus.pending)
    serial = Column(String, nullable=False)  # display-only reference code, not a real banknote serial
    created_at = Column(DateTime, default=dt.datetime.utcnow)
    validated_at = Column(DateTime, nullable=True)
