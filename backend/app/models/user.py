from sqlalchemy import Column, Integer, String
from app.database import Base
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)
    apellido = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)

    # Relaciones
    payments = relationship("Payment", back_populates="user")
    created_groups = relationship("Group", back_populates="admin")
    user_selections = relationship("UserSelection", back_populates="user")
    group_memberships = relationship("GroupMember", back_populates="user")