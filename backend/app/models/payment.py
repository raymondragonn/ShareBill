from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Payment(Base):
    __tablename__ = "payments"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    status = Column(String, default="pending")  # pending, completed, failed
    payment_method = Column(String, default="temporary_card")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    group = relationship("Group", back_populates="payments")
    user = relationship("User", back_populates="payments")
