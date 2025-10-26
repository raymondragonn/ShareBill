from sqlalchemy import Column, Integer, String, Float, Integer, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Item(Base):
    __tablename__ = "items"
    id = Column(Integer, primary_key=True, index=True)
    group_id = Column(Integer, ForeignKey("groups.id"))
    name = Column(String, index=True)
    price = Column(Float)
    quantity = Column(Integer, default=1)
    description = Column(Text, nullable=True)
    
    # Relaciones
    group = relationship("Group", back_populates="items")
    user_selections = relationship("UserSelection", back_populates="item")
