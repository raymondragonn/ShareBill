from sqlalchemy.orm import Session
from app.models.group import Group
from app.models.user import User
from typing import List, Optional
import uuid

class GroupService:
    """
    Servicio para manejar la lógica de negocio de los grupos
    """
    
    @staticmethod
    def generate_unique_code(db: Session) -> str:
        """
        Genera un código único de 6 caracteres para el grupo
        """
        while True:
            code = str(uuid.uuid4())[:6].upper()
            existing = db.query(Group).filter(Group.code == code).first()
            if not existing:
                return code
    
    @staticmethod
    def create_group(db: Session, name: str, admin_id: int, member_ids: List[int] = None) -> Group:
        """
        Crea un nuevo grupo con un administrador y opcionalmente miembros iniciales
        """
        # Verificar que el admin existe
        admin = db.query(User).filter(User.id == admin_id).first()
        if not admin:
            raise ValueError("Usuario administrador no encontrado")
        
        # Generar código único
        code = GroupService.generate_unique_code(db)
        
        # Crear grupo
        new_group = Group(
            name=name,
            code=code,
            admin_id=admin_id
        )
        
        db.add(new_group)
        db.flush()  # Para obtener el ID sin hacer commit
        
        # Agregar miembros iniciales (incluyendo al admin)
        if member_ids:
            for user_id in set(member_ids):  # set para evitar duplicados
                user = db.query(User).filter(User.id == user_id).first()
                if user and user not in new_group.members:
                    new_group.members.append(user)
        
        # Asegurar que el admin esté en el grupo
        if admin not in new_group.members:
            new_group.members.append(admin)
        
        db.commit()
        db.refresh(new_group)
        
        return new_group
    
    @staticmethod
    def get_group_by_id(db: Session, group_id: int) -> Optional[Group]:
        """
        Obtiene un grupo por su ID
        """
        return db.query(Group).filter(Group.id == group_id).first()
    
    @staticmethod
    def get_group_by_code(db: Session, code: str) -> Optional[Group]:
        """
        Obtiene un grupo por su código único
        """
        return db.query(Group).filter(Group.code == code).first()
    
    @staticmethod
    def add_member_to_group(db: Session, group_id: int, user_id: int) -> bool:
        """
        Agrega un miembro a un grupo
        """
        group = db.query(Group).filter(Group.id == group_id).first()
        user = db.query(User).filter(User.id == user_id).first()
        
        if not group or not user:
            return False
        
        # Verificar si ya es miembro
        if user in group.members:
            return False
        
        group.members.append(user)
        db.commit()
        return True
    
    @staticmethod
    def remove_member_from_group(db: Session, group_id: int, user_id: int) -> bool:
        """
        Remueve un miembro de un grupo (si no es el admin)
        """
        group = db.query(Group).filter(Group.id == group_id).first()
        user = db.query(User).filter(User.id == user_id).first()
        
        if not group or not user:
            return False
        
        # No permitir remover al admin
        if group.admin_id == user_id:
            raise ValueError("No se puede remover al administrador del grupo")
        
        if user in group.members:
            group.members.remove(user)
            db.commit()
            return True
        
        return False
    
    @staticmethod
    def get_user_groups(db: Session, user_id: int) -> List[Group]:
        """
        Obtiene todos los grupos de un usuario
        """
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            return []
        return user.groups
    
    @staticmethod
    def is_group_admin(db: Session, group_id: int, user_id: int) -> bool:
        """
        Verifica si un usuario es el administrador de un grupo
        """
        group = db.query(Group).filter(Group.id == group_id).first()
        if not group:
            return False
        return group.admin_id == user_id