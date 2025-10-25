from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
import io

from app.database import SessionLocal
from app.models.ticket import Ticket, ArticuloTicket
from app.schemas.ticket import TicketProcessResponse, TicketResponse, ArticuloResponse
from app.services.gemini_service import GeminiService

router = APIRouter(
    prefix="/tickets",
    tags=["tickets"]
)

# Dependency para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/procesar", response_model=TicketProcessResponse)
async def procesar_ticket(
    imagen: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    Endpoint para procesar una imagen de ticket usando Gemini Vision API.
    
    - **imagen**: Archivo de imagen del ticket (JPG, PNG, etc.)
    
    Retorna:
    - ID del ticket creado
    - Nombre del negocio
    - Lista de artículos extraídos
    """
    
    # Validar que sea una imagen
    if not imagen.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="El archivo debe ser una imagen (JPG, PNG, etc.)"
        )
    
    try:
        # Leer los bytes de la imagen
        imagen_bytes = await imagen.read()
        
        # Procesar con Gemini
        gemini_service = GeminiService()
        datos_extraidos = gemini_service.procesar_ticket(imagen_bytes)
        
        # Crear el ticket en la base de datos
        nuevo_ticket = Ticket(
            nombre_negocio=datos_extraidos.get("nombre_negocio")
        )
        db.add(nuevo_ticket)
        db.commit()
        db.refresh(nuevo_ticket)
        
        # Guardar los artículos
        articulos_creados = []
        for articulo_data in datos_extraidos.get("articulos", []):
            nuevo_articulo = ArticuloTicket(
                ticket_id=nuevo_ticket.id,
                descripcion=articulo_data["descripcion"],
                cantidad=articulo_data["cantidad"],
                precio_unitario=articulo_data["precio_unitario"],
                monto_linea=articulo_data["monto_linea"]
            )
            db.add(nuevo_articulo)
            articulos_creados.append(articulo_data)
        
        db.commit()
        
        return TicketProcessResponse(
            ticket_id=nuevo_ticket.id,
            nombre_negocio=nuevo_ticket.nombre_negocio,
            articulos=articulos_creados,
            mensaje="Ticket procesado exitosamente"
        )
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error al procesar el ticket: {str(e)}"
        )


@router.get("/{ticket_id}", response_model=TicketResponse)
def obtener_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Obtener un ticket por su ID con todos sus artículos
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    
    # Obtener artículos del ticket
    articulos = db.query(ArticuloTicket).filter(
        ArticuloTicket.ticket_id == ticket_id
    ).all()
    
    return TicketResponse(
        id=ticket.id,
        nombre_negocio=ticket.nombre_negocio,
        fecha_procesamiento=ticket.fecha_procesamiento,
        articulos=[ArticuloResponse(
            id=art.id,
            ticket_id=art.ticket_id,
            descripcion=art.descripcion,
            cantidad=art.cantidad,
            precio_unitario=art.precio_unitario,
            monto_linea=art.monto_linea
        ) for art in articulos]
    )


@router.get("/", response_model=List[TicketResponse])
def listar_tickets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Listar todos los tickets procesados
    """
    tickets = db.query(Ticket).offset(skip).limit(limit).all()
    
    resultado = []
    for ticket in tickets:
        articulos = db.query(ArticuloTicket).filter(
            ArticuloTicket.ticket_id == ticket.id
        ).all()
        
        resultado.append(TicketResponse(
            id=ticket.id,
            nombre_negocio=ticket.nombre_negocio,
            fecha_procesamiento=ticket.fecha_procesamiento,
            articulos=[ArticuloResponse(
                id=art.id,
                ticket_id=art.ticket_id,
                descripcion=art.descripcion,
                cantidad=art.cantidad,
                precio_unitario=art.precio_unitario,
                monto_linea=art.monto_linea
            ) for art in articulos]
        ))
    
    return resultado


@router.delete("/{ticket_id}")
def eliminar_ticket(ticket_id: int, db: Session = Depends(get_db)):
    """
    Eliminar un ticket y todos sus artículos
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket no encontrado")
    
    # Eliminar artículos primero
    db.query(ArticuloTicket).filter(ArticuloTicket.ticket_id == ticket_id).delete()
    
    # Eliminar ticket
    db.delete(ticket)
    db.commit()
    
    return {"mensaje": "Ticket eliminado exitosamente"}
