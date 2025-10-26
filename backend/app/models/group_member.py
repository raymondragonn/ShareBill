from sqlalchemy import Column, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class GroupMember(Base):
    __tablename__ = "group_members"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    is_admin = Column(Boolean, default=False)
    joined_at = Column(DateTime, default=datetime.utcnow)
    is_checked_in = Column(Boolean, default=False)
    check_in_time = Column(DateTime, nullable=True)
    
    # Relaciones
    group = relationship("Group", back_populates="members")
    user = relationship("User", back_populates="group_memberships")
