from fastapi import APIRouter
import httpx, asyncio, time

router = APIRouter()

# 🔹 Servicios a monitorear
services = [
    # ==== EQUIPOS PLN ====
    {"name": "PLN Backend 9001", "status": None, "latency_ms": None, "url": "http://equipo1_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo1"},
    {"name": "PLN Frontend 9301", "status": None, "latency_ms": None, "url": "http://equipo1_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo1"},

    {"name": "PLN Backend 9002", "status": None, "latency_ms": None, "url": "http://equipo2_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo2"},
    {"name": "PLN Frontend 9302", "status": None, "latency_ms": None, "url": "http://equipo2_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo2"},

    {"name": "PLN Backend 9003", "status": None, "latency_ms": None, "url": "http://equipo3_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo3"},
    {"name": "PLN Frontend 9303", "status": None, "latency_ms": None, "url": "http://equipo3_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo3"},

    {"name": "PLN Backend 9004", "status": None, "latency_ms": None, "url": "http://equipo4_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo4"},
    {"name": "PLN Frontend 9304", "status": None, "latency_ms": None, "url": "http://equipo4_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo4"},

    {"name": "PLN Backend 9005", "status": None, "latency_ms": None, "url": "http://equipo5_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo5"},
    {"name": "PLN Frontend 9305", "status": None, "latency_ms": None, "url": "http://equipo5_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo5"},

    {"name": "PLN Backend 9006", "status": None, "latency_ms": None, "url": "http://equipo6_backend:80/health", "repo": "https://github.com/rromanc-coder/equipo6"},
    {"name": "PLN Frontend 9306", "status": None, "latency_ms": None, "url": "http://equipo6_frontend:3000/health", "repo": "https://github.com/rromanc-coder/equipo6"},

    # ==== EQUIPOS ITM ====
    {"name": "ITM Backend 9101", "status": None, "latency_ms": None, "url": "http://itm1_backend:80/health", "repo": "https://github.com/rromanc-coder/itm1"},
    {"name": "ITM Frontend 9401", "status": None, "latency_ms": None, "url": "http://itm1_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm1"},

    {"name": "ITM Backend 9102", "status": None, "latency_ms": None, "url": "http://itm2_backend:80/health", "repo": "https://github.com/rromanc-coder/itm2"},
    {"name": "ITM Frontend 9402", "status": None, "latency_ms": None, "url": "http://itm2_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm2"},

    {"name": "ITM Backend 9103", "status": None, "latency_ms": None, "url": "http://itm3_backend:80/health", "repo": "https://github.com/rromanc-coder/itm3"},
    {"name": "ITM Frontend 9403", "status": None, "latency_ms": None, "url": "http://itm3_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm3"},

    {"name": "ITM Backend 9104", "status": None, "latency_ms": None, "url": "http://itm4_backend:80/health", "repo": "https://github.com/rromanc-coder/itm4"},
    {"name": "ITM Frontend 9404", "status": None, "latency_ms": None, "url": "http://itm4_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm4"},

    {"name": "ITM Backend 9105", "status": None, "latency_ms": None, "url": "http://itm5_backend:80/health", "repo": "https://github.com/rromanc-coder/itm5"},
    {"name": "ITM Frontend 9405", "status": None, "latency_ms": None, "url": "http://itm5_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm5"},

    {"name": "ITM Backend 9106", "status": None, "latency_ms": None, "url": "http://itm6_backend:80/health", "repo": "https://github.com/rromanc-coder/itm6"},
    {"name": "ITM Frontend 9406", "status": None, "latency_ms": None, "url": "http://itm6_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm6"},

    {"name": "ITM Backend 9107", "status": None, "latency_ms": None, "url": "http://itm7_backend:80/health", "repo": "https://github.com/rromanc-coder/itm7"},
    {"name": "ITM Frontend 9407", "status": None, "latency_ms": None, "url": "http://itm7_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm7"},

    {"name": "ITM Backend 9108", "status": None, "latency_ms": None, "url": "http://itm8_backend:80/health", "repo": "https://github.com/rromanc-coder/itm8"},
    {"name": "ITM Frontend 9408", "status": None, "latency_ms": None, "url": "http://itm8_frontend:3000/health", "repo": "https://github.com/rromanc-coder/itm8"},
]




async def ping_service(service):
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=2.5) as client:
            response = await client.get(service["url"])
            latency = round((time.time() - start) * 1000, 2)
            return {
                "name": service["name"],
                "status": response.status_code,
                "latency_ms": latency,
                "url": service["url"],
                "repo": service["repo"]
            }
    except Exception:
        return {
            "name": service["name"],
            "status": "DOWN",
            "latency_ms": None,
            "url": service["url"],
            "repo": service["repo"]
        }


@router.get("/status")
async def get_status():
    results = await asyncio.gather(*(ping_service(s) for s in SERVICES))
    return {"services": results}
