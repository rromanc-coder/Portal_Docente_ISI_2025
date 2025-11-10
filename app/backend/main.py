from fastapi import FastAPI
from routers.health import router as health_router
from monitor.routes import router as monitor_router

app = FastAPI(title="Portal Docente ISI 2025")

# 🔹 Endpoint de salud
app.include_router(health_router, prefix="/health", tags=["Health"])

# 🔹 Endpoint de monitoreo
app.include_router(monitor_router, prefix="/monitor", tags=["Monitor"])


@app.get("/")
def root():
    return {"message": "Backend Portal Docente ISI 2025 operativo"}
