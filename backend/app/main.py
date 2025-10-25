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
    allow_origins=["*"],  # Cambia a IP específica después
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
