from fastapi import FastAPI
from routers.health import router as health_router
from monitor.routes import router as monitor_router
from app.routers import logs  # 👈 importa el router de logs (ajusta el path)


app = FastAPI(title="Portal Docente ISI 2025")

# 🔹 Endpoint de salud
app.include_router(health_router, prefix="/health", tags=["Health"])

# 🔹 Endpoint de monitoreo
app.include_router(monitor_router, prefix="/monitor", tags=["Monitor"])

# 🔹 Endpoint de Logs de contenedores
app.include_router(logs.router)  # 👈 registra el router de logs


@app.get("/")
def root():
    return {"message": "Backend Portal Docente ISI 2025 operativo"}
