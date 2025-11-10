from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.config import settings
from api.routes import health, metrics

app = FastAPI(title="Portal Docente ISI 2025")

# Middleware CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rutas
app.include_router(health.router)
app.include_router(metrics.router)

@app.get("/")
async def root():
    return {"message": "API Portal Docente ISI 2025 funcionando correctamente"}
