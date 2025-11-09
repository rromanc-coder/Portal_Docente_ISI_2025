from fastapi import APIRouter
from utils.docker_utils import list_containers
from collections import Counter

router = APIRouter()

@router.get("")
def metrics():
    data = list_containers()
    statuses = Counter([c["status"] for c in data])
    kinds = {"backend": 0, "frontend": 0, "database": 0, "other": 0}
    for c in data:
        n = c["name"]
        if n.endswith("_backend"):
            kinds["backend"] += 1
        elif n.endswith("_frontend"):
            kinds["frontend"] += 1
        elif n.startswith("postgres"):
            kinds["database"] += 1
        else:
            kinds["other"] += 1
    return {"counts_by_status": statuses, "counts_by_kind": kinds, "total": len(data)}
