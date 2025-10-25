from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relaciones
    created_groups = relationship("Group", back_populates="admin")
    group_memberships = relationship("GroupMember", back_populates="user")
    user_selections = relationship("UserSelection", back_populates="user")
    payments = relationship("Payment", back_populates="user")
