from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("")
async def health_check():
    return {"status": "ok", "service": "backend", "version": "1.0.0"}
