from fastapi import APIRouter
import httpx, asyncio, time

router = APIRouter()

SERVICES = [
    {"name": "PLN Backend 9001", "url": "http://10.5.20.50:9001/health", "repo": "https://github.com/rromanc-coder/equipo5"},
    {"name": "PLN Frontend 9301", "url": "http://10.5.20.50:9301/health", "repo": "https://github.com/rromanc-coder/equipo5"},
    {"name": "ITM Backend 9101", "url": "http://10.5.20.50:9101/health", "repo": "https://github.com/rromanc-coder/REPO_ITMX"},
    {"name": "ITM Frontend 9401", "url": "http://10.5.20.50:9401/health", "repo": "https://github.com/rromanc-coder/REPO_ITMX"},
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
