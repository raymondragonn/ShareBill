from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.payments import Payment
from app.models.user import User
from app.database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["Payments"])

class PaymentCreate(BaseModel):
    card_number: str
    expiry_date: str
    cvc: str
    postal_code: str
    user_id: int  # para asociar el pago al usuario

class PaymentResponse(BaseModel):
    id: int
    card_number: str
    expiry_date: str
    postal_code: str

    class Config:
        orm_mode = True

@router.post("/add", response_model=PaymentResponse)
def add_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    new_payment = Payment(
        card_number=payment.card_number,
        expiry_date=payment.expiry_date,
        cvc=payment.cvc,
        postal_code=payment.postal_code,
        user_id=payment.user_id
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment
