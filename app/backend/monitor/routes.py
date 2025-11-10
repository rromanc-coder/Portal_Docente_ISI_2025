from fastapi import APIRouter
import httpx, asyncio, time

router = APIRouter()

# === Catálogo completo de servicios ITM y PLN ===
SERVICES = []

# PLN Backends 9001-9006
for i in range(1, 7):
    SERVICES.append({
        "name": f"PLN Backend {9000+i}",
        "url": f"http://10.5.20.50:{9000+i}/health",
        "repo": "https://github.com/rromanc-coder/equipo5"
    })

# PLN Frontends 9301-9306
for i in range(1, 7):
    SERVICES.append({
        "name": f"PLN Frontend {9300+i}",
        "url": f"http://10.5.20.50:{9300+i}/health",
        "repo": "https://github.com/rromanc-coder/equipo5"
    })

# ITM Backends 9101-9108
for i in range(1, 9):
    SERVICES.append({
        "name": f"ITM Backend {9100+i}",
        "url": f"http://10.5.20.50:{9100+i}/health",
        "repo": "https://github.com/rromanc-coder/REPO_ITMX"
    })

# ITM Frontends 9401-9408
for i in range(1, 9):
    SERVICES.append({
        "name": f"ITM Frontend {9400+i}",
        "url": f"http://10.5.20.50:{9400+i}/health",
        "repo": "https://github.com/rromanc-coder/REPO_ITMX"
    })


# === Funciones de monitoreo ===
async def ping_service(service):
    start = time.time()
    try:
        async with httpx.AsyncClient(timeout=3.0) as client:
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
