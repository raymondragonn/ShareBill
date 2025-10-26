from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.payment import Payment
from app.models.user import User
from app.models.group import Group
from app.database import get_db
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["Payments"])

class PaymentCreate(BaseModel):
    group_id: int
    user_id: int
    amount: float
    payment_method: str = "temporary_card"

class PaymentResponse(BaseModel):
    id: int
    group_id: int
    user_id: int
    amount: float
    status: str
    payment_method: str

    class Config:
        from_attributes = True

@router.post("/add", response_model=PaymentResponse)
def add_payment(payment: PaymentCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == payment.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    group = db.query(Group).filter(Group.id == payment.group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    new_payment = Payment(
        group_id=payment.group_id,
        user_id=payment.user_id,
        amount=payment.amount,
        payment_method=payment.payment_method,
        status="pending"
    )

    db.add(new_payment)
    db.commit()
    db.refresh(new_payment)
    return new_payment
