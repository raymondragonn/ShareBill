from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.user import User
from app.database import get_db
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/users", tags=["Users"])

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: str

class UserCreate(BaseModel):
    nombre: str
    apellido: str
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    nombre: str
    apellido: str
    email: EmailStr

    class Config:
        orm_mode = True


@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = User(**user.dict())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=LoginResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Credenciales inválidas")

    return {
        "id": db_user.id,
        "nombre": db_user.nombre,
        "apellido": db_user.apellido,
        "email": db_user.email,
    }