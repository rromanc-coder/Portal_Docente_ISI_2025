from fastapi import APIRouter

router = APIRouter(prefix="/api/metrics", tags=["Metrics"])

@router.get("")
async def get_metrics():
    return {"uptime": "active", "connections": "ready"}
