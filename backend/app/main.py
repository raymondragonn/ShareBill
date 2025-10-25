from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routes import users, payments, tickets

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend ShareBill")

# CORS - Permitir múltiples orígenes
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",      # Expo web
        "http://127.0.0.1:8081",      # Expo web alternativo
        "http://10.22.124.98:8081",   # Tu IP local
        "http://192.168.56.1:8081",   # Otras IPs locales
        "*"                            # Permite todos los orígenes (solo para desarrollo)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir rutas
app.include_router(users.router)
app.include_router(payments.router)
app.include_router(tickets.router)

@app.get("/")
def root():
    return {
        "message": "ShareBill API - Backend funcionando correctamente",
        "version": "1.0",
        "endpoints": {
            "users": "/users",
            "payments": "/payments",
            "tickets": "/tickets"
        }
    }
