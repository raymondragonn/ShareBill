from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class Group(Base):
    __tablename__ = "groups"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    admin_id = Column(Integer, ForeignKey("users.id"))
    qr_code = Column(String, unique=True, index=True)
    join_link = Column(String, unique=True, index=True)
    status = Column(String, default="active")  # active, completed, cancelled
    created_at = Column(DateTime, default=datetime.utcnow)
    total_amount = Column(Float, default=0.0)
    
    # Relaciones
    admin = relationship("User", back_populates="created_groups")
    members = relationship("GroupMember", back_populates="group")
    receipt = relationship("Receipt", back_populates="group", uselist=False)
    payments = relationship("Payment", back_populates="group")
    temporary_card = relationship("TemporaryCard", back_populates="group")
    items = relationship("Item", back_populates="group")
