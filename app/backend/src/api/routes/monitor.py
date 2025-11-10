# app/backend/src/api/routes/monitor.py
from fastapi import APIRouter
import httpx
import asyncio
import time

router = APIRouter(prefix="/monitor", tags=["Monitor"])

# 🔹 Servicios a monitorear (visibles desde la red externa 10.5.20.50)
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

    {"name": "PLN Backend 9004", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9004/health", "repo": "https://github.com/rromanc-coder/equipo4"},
    {"name": "PLN Frontend 9304", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9304/health", "repo": "https://github.com/rromanc-coder/equipo4"},

    {"name": "PLN Backend 9005", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9005/health", "repo": "https://github.com/rromanc-coder/equipo5"},
    {"name": "PLN Frontend 9305", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9305/health", "repo": "https://github.com/rromanc-coder/equipo5"},

    {"name": "PLN Backend 9006", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9006/health", "repo": "https://github.com/rromanc-coder/equipo6"},
    {"name": "PLN Frontend 9306", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9306/health", "repo": "https://github.com/rromanc-coder/equipo6"},

    # ==== EQUIPOS ITM ====
    {"name": "ITM Backend 9101", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9101/health", "repo": "https://github.com/rromanc-coder/REPO_ITM1"},
    {"name": "ITM Frontend 9401", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9401/health", "repo": "https://github.com/rromanc-coder/REPO_ITM1"},

    {"name": "ITM Backend 9102", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9102/health", "repo": "https://github.com/rromanc-coder/REPO_ITM2"},
    {"name": "ITM Frontend 9402", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9402/health", "repo": "https://github.com/rromanc-coder/REPO_ITM2"},

    {"name": "ITM Backend 9103", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9103/health", "repo": "https://github.com/rromanc-coder/REPO_ITM3"},
    {"name": "ITM Frontend 9403", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9403/health", "repo": "https://github.com/rromanc-coder/REPO_ITM3"},

    {"name": "ITM Backend 9104", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9104/health", "repo": "https://github.com/rromanc-coder/REPO_ITM4"},
    {"name": "ITM Frontend 9404", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9404/health", "repo": "https://github.com/rromanc-coder/REPO_ITM4"},

    {"name": "ITM Backend 9105", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9105/health", "repo": "https://github.com/rromanc-coder/REPO_ITM5"},
    {"name": "ITM Frontend 9405", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9405/health", "repo": "https://github.com/rromanc-coder/REPO_ITM5"},

    {"name": "ITM Backend 9106", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9106/health", "repo": "https://github.com/rromanc-coder/REPO_ITM6"},
    {"name": "ITM Frontend 9406", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9406/health", "repo": "https://github.com/rromanc-coder/REPO_ITM6"},

    {"name": "ITM Backend 9107", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9107/health", "repo": "https://github.com/rromanc-coder/REPO_ITM7"},
    {"name": "ITM Frontend 9407", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9407/health", "repo": "https://github.com/rromanc-coder/REPO_ITM7"},

    {"name": "ITM Backend 9108", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9108/health", "repo": "https://github.com/rromanc-coder/REPO_ITM8"},
    {"name": "ITM Frontend 9408", "status": None, "latency_ms": None,
     "url": "http://10.5.20.50:9408/health", "repo": "https://github.com/rromanc-coder/REPO_ITM8"},
]

async def ping_service(service: dict):
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
