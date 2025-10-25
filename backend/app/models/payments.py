from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    card_number = Column(String)
    expiry_date = Column(String)
    cvc = Column(String)
    postal_code = Column(String)

    # Relación con el usuario
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="payment")
