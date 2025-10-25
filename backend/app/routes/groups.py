from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.group import Group
from app.models.user import User
from app.models.group_member import GroupMember
from app.database import get_db
from pydantic import BaseModel
import random
import string
import qrcode
import io
import base64
from typing import Optional, List

router = APIRouter(prefix="/groups", tags=["Groups"])

class GroupCreate(BaseModel):
    name: str
    admin_id: Optional[int] = None

class GroupResponse(BaseModel):
    id: int
    name: str
    admin_id: Optional[int] = None
    qr_code: str
    join_link: str
    status: str
    total_amount: float
    
    class Config:
        from_attributes = True

class GroupMemberResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str
    
    class Config:
        from_attributes = True

class GroupDetailResponse(BaseModel):
    id: int
    name: str
    admin_id: Optional[int] = None
    qr_code: str
    join_link: str
    status: str
    total_amount: float
    members_count: int
    
    class Config:
        from_attributes = True

def generate_4_digit_code(db: Session) -> str:
    """Genera un código único de 4 dígitos"""
    while True:
        code = ''.join(random.choices(string.digits, k=4))
        existing = db.query(Group).filter(Group.join_link == code).first()
        if not existing:
            return code

def generate_qr_code(data: str) -> str:
    """Genera un código QR y lo retorna como base64"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convertir imagen a base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_base64}"

@router.post("/create", response_model=GroupResponse)
def create_group(group_data: GroupCreate, db: Session = Depends(get_db)):
    """Crea un nuevo grupo con código de 4 dígitos y QR"""
    
    # Verificar que el usuario existe (solo si se proporciona admin_id)
    if group_data.admin_id:
        user = db.query(User).filter(User.id == group_data.admin_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Generar código de 4 dígitos
    join_code = generate_4_digit_code(db)
    
    # Generar código QR con el código de unión
    qr_code_data = generate_qr_code(join_code)
    
    # Crear grupo
    new_group = Group(
        name=group_data.name,
        admin_id=group_data.admin_id,
        qr_code=qr_code_data,
        join_link=join_code,
        status="active",
        total_amount=0.0
    )
    
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    
    # Agregar al admin como primer miembro (solo si existe)
    if group_data.admin_id:
        admin_member = GroupMember(
            group_id=new_group.id,
            user_id=group_data.admin_id,
            is_admin=True
        )
        db.add(admin_member)
        db.commit()
    
    return new_group

@router.get("/{group_id}", response_model=GroupDetailResponse)
def get_group(group_id: int, db: Session = Depends(get_db)):
    """Obtiene los detalles de un grupo"""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    members_count = db.query(GroupMember).filter(GroupMember.group_id == group_id).count()
    
    return {
        **group.__dict__,
        "members_count": members_count
    }

@router.get("/{group_id}/members", response_model=List[GroupMemberResponse])
def get_group_members(group_id: int, db: Session = Depends(get_db)):
    """Obtiene todos los miembros de un grupo"""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    members = db.query(User).join(GroupMember).filter(
        GroupMember.group_id == group_id
    ).all()
    
    return members

@router.post("/{group_id}/join")
def join_group(group_id: int, user_id: int, db: Session = Depends(get_db)):
    """Agrega un usuario a un grupo"""
    group = db.query(Group).filter(Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Grupo no encontrado")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar si ya es miembro
    existing_member = db.query(GroupMember).filter(
        GroupMember.group_id == group_id,
        GroupMember.user_id == user_id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="Usuario ya es miembro del grupo")
    
    # Agregar miembro
    new_member = GroupMember(
        group_id=group_id,
        user_id=user_id,
        is_admin=False
    )
    db.add(new_member)
    db.commit()
    
    return {"message": "Usuario agregado al grupo exitosamente"}

@router.post("/join-by-code")
def join_group_by_code(code: str, user_id: int, db: Session = Depends(get_db)):
    """Permite a un usuario unirse a un grupo usando el código de 4 dígitos"""
    group = db.query(Group).filter(Group.join_link == code).first()
    if not group:
        raise HTTPException(status_code=404, detail="Código de grupo inválido")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Verificar si ya es miembro
    existing_member = db.query(GroupMember).filter(
        GroupMember.group_id == group.id,
        GroupMember.user_id == user_id
    ).first()
    
    if existing_member:
        # Si ya es miembro, solo retornar la info del grupo
        return {
            "message": "Ya eres miembro de este grupo",
            "group": {
                "id": group.id,
                "name": group.name,
                "join_link": group.join_link,
                "qr_code": group.qr_code
            }
        }
    
    # Agregar miembro
    new_member = GroupMember(
        group_id=group.id,
        user_id=user_id,
        is_admin=False
    )
    db.add(new_member)
    db.commit()
    
    return {
        "message": "Te has unido al grupo exitosamente",
        "group": {
            "id": group.id,
            "name": group.name,
            "join_link": group.join_link,
            "qr_code": group.qr_code
        }
    }

@router.get("/user/{user_id}", response_model=List[GroupDetailResponse])
def get_user_groups(user_id: int, db: Session = Depends(get_db)):
    """Obtiene todos los grupos de un usuario"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    
    # Obtener grupos donde el usuario es miembro
    groups = db.query(Group).join(GroupMember).filter(
        GroupMember.user_id == user_id
    ).all()
    
    result = []
    for group in groups:
        members_count = db.query(GroupMember).filter(GroupMember.group_id == group.id).count()
        result.append({
            **group.__dict__,
            "members_count": members_count
        })
    
    return result

