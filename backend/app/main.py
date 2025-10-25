from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import users, payments

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend ShareBill")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Cambia a IP específica después
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(users.router)
app.include_router(payments.router)
