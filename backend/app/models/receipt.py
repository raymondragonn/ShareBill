from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Receipt(Base):
    __tablename__ = "receipts"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    image_url = Column(String)
    total_amount = Column(Float)
    scanned_at = Column(DateTime, default=datetime.utcnow)
    merchant_name = Column(String, nullable=True)
    
    # Relaciones
    group = relationship("Group", back_populates="receipt")
