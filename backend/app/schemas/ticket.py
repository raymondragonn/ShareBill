from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ArticuloBase(BaseModel):
    descripcion: str
    cantidad: float
    precio_unitario: float
    monto_linea: float

class ArticuloCreate(ArticuloBase):
    pass

class ArticuloResponse(ArticuloBase):
    id: int
    ticket_id: int
    
    class Config:
        from_attributes = True


class TicketBase(BaseModel):
    nombre_negocio: Optional[str] = None
    total: Optional[float] = None

class TicketCreate(TicketBase):
    pass

class TicketResponse(TicketBase):
    id: int
    fecha_procesamiento: datetime
    articulos: List[ArticuloResponse] = []
    
    class Config:
        from_attributes = True


class TicketProcessResponse(BaseModel):
    ticket_id: int
    nombre_negocio: Optional[str] = None
    total: Optional[float] = None
    articulos: List[ArticuloBase]
    mensaje: str
