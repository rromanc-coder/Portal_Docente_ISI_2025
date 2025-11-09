from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Dict
from utils.docker_utils import list_containers, restart_container, tail_logs

router = APIRouter()

class Container(BaseModel):
    name: str
    image: str
    status: str
    ports: Dict
    networks: List[str]
    created: str | None = None

@router.get("/containers", response_model=List[Container])
def get_all_containers():
    return list_containers()

@router.post("/containers/restart/{name}")
def restart(name: str):
    try:
        return restart_container(name)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/containers/logs/{name}")
def logs(name: str, lines: int = Query(80, ge=1, le=2000)):
    try:
        return {"name": name, "lines": lines, "logs": tail_logs(name, lines)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
