from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    nombre_negocio = Column(String(255), nullable=True)
    total = Column(Float, nullable=True)
    fecha_procesamiento = Column(DateTime(timezone=True), server_default=func.now())
    imagen_url = Column(Text, nullable=True)
    

class ArticuloTicket(Base):
    __tablename__ = "articulos_ticket"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, nullable=False)
    descripcion = Column(String(500), nullable=False)
    cantidad = Column(Float, nullable=False)
    precio_unitario = Column(Float, nullable=False)
    monto_linea = Column(Float, nullable=False)
