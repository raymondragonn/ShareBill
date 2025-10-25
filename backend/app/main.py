from fastapi import FastAPI
from app.database import Base, engine
from app.routes import users, tickets

app = FastAPI(
    title="ShareBill API",
    description="API para procesar tickets y dividir gastos",
    version="1.0.0"
)

Base.metadata.create_all(bind=engine)

app.include_router(users.router)
app.include_router(tickets.router)

@app.get("/")
def root():
    return {"message": "ShareBill API - OK"}
