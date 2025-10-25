from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class TemporaryCard(Base):
    __tablename__ = "temporary_cards"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("group.id"))
    card_number = Column(String, unique=True, index=True)
    expiry_date = Column(String)  # MM/YY format
    cvv = Column(String)
    balance = Column(Float)
    status = Column(String, default="active")  # active, expired, used
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relaciones
    group = relationship("Group", back_populates="temporary_card")
