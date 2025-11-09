from fastapi import APIRouter
from utils.docker_utils import get_client

router = APIRouter()

@router.get("")
def health():
    try:
        client = get_client()
        client.ping()
        return {"ok": True, "docker": "reachable"}
    except Exception as e:
        return {"ok": False, "error": str(e)}
