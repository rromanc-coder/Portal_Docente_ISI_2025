# app/backend/src/api/routes/monitor.py

from fastapi import APIRouter, HTTPException
import httpx
import asyncio
import time
import docker

router = APIRouter(prefix="/api/monitor", tags=["Monitor"])

# ============================================================
# 🔥 CLIENTE DOCKER PARA LEER ESTADO REAL DEL CONTENEDOR
# ============================================================
docker_client = docker.DockerClient(base_url="unix://var/run/docker.sock")


# ============================================================
# 🔹 Servicios a monitorear (visibles desde la red externa)
# ============================================================
services = [
    # ==== EQUIPOS PLN ====
    {"name": "PLN Backend 9001", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9001/health", "repo": "https://github.com/rromanc-coder/equipo1"},
    {"name": "PLN Frontend 9301", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9301/health", "repo": "https://github.com/rromanc-coder/equipo1"},

    {"name": "PLN Backend 9002", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9002/health", "repo": "https://github.com/rromanc-coder/equipo2"},
    {"name": "PLN Frontend 9302", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9302/health", "repo": "https://github.com/rromanc-coder/equipo2"},

    {"name": "PLN Backend 9003", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9003/health", "repo": "https://github.com/rromanc-coder/equipo3"},
    {"name": "PLN Frontend 9303", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9303/health", "repo": "https://github.com/rromanc-coder/equipo3"},

    # ==== EQUIPOS ITM ====
    {"name": "ITM Backend 9101", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9101/health", "repo": "https://github.com/rromanc-coder/itm1"},
    {"name": "ITM Frontend 9401", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9401/health", "repo": "https://github.com/rromanc-coder/itm1"},

    {"name": "ITM Backend 9102", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9102/health", "repo": "https://github.com/rromanc-coder/itm2"},
    {"name": "ITM Frontend 9402", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9402/health", "repo": "https://github.com/rromanc-coder/itm2"},

    {"name": "ITM Backend 9103", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9103/health", "repo": "https://github.com/rromanc-coder/itm3"},
    {"name": "ITM Frontend 9403", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9403/health", "repo": "https://github.com/rromanc-coder/itm3"},
]


# ============================================================
# 🔥 PING A LOS SERVICIOS
# ============================================================
async def ping_service(service):
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
            resp = await client.get(service["url"])
            latency = round((time.time() - start) * 1000, 1)
            status = "UP" if resp.status_code == 200 else f"HTTP {resp.status_code}"
            return {**service, "status": status, "latency_ms": latency}
    except Exception:
        return {**service, "status": "DOWN", "latency_ms": None}


@router.get("/status")
async def get_status():
    results = await asyncio.gather(*(ping_service(s) for s in services))
    return {"services": results}


# ============================================================
# 🔥 NUEVO ENDPOINT: ESTADO REAL DEL CONTENEDOR
# ============================================================
@router.get("/container-state/{name}")
def container_state(name: str):
    try:
        container = docker_client.containers.get(name)
        info = container.attrs

        return {
            "name": name,
            "state": info["State"],
            "started_at": info["State"]["StartedAt"]
        }

    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Contenedor '{name}' no encontrado o inaccesible: {str(e)}")
