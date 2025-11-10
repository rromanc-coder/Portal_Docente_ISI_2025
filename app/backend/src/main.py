# app/backend/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import health, metrics, monitor

app = FastAPI(title="Portal Docente ISI 2025")

# CORS (ajusta orígenes si lo deseas)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(health.router)   # /health
app.include_router(metrics.router)  # /metrics
app.include_router(monitor.router)  # /monitor/*

@app.get("/")
async def root():
    return {"message": "API Portal Docente ISI 2025 funcionando correctamente"}
