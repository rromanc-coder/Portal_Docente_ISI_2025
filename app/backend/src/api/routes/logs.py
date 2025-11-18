# app/routers/logs.py (ajusta la ruta según tu proyecto)

from fastapi import APIRouter, HTTPException, Query
import docker

router = APIRouter(
    prefix="/api/logs",
    tags=["logs"],
)

# Cliente Docker usando el socket montado
client = docker.from_env()

@router.get("/{container_name}")
def get_logs(
    container_name: str,
    lines: int = Query(200, ge=10, le=2000)
):
    """
    Regresa las últimas `lines` líneas de log de un contenedor Docker.
    Ejemplo:
      GET /api/logs/equipo4_backend?lines=300
    """
    try:
        container = client.containers.get(container_name)
        raw_logs = container.logs(tail=lines)
        # logs viene en bytes, convertimos a str seguro
        text = raw_logs.decode("utf-8", errors="ignore")
        return {
            "container": container_name,
            "lines": lines,
            "logs": text,
        }
    except docker.errors.NotFound:
        raise HTTPException(status_code=404, detail="Contenedor no encontrado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
