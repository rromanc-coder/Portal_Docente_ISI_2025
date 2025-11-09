import docker
from typing import List, Dict

_client = None

def get_client():
    global _client
    if _client is None:
        _client = docker.from_env()
    return _client

TARGET_PREFIXES = ("equipo", "itm", "proyecto_isi", "postgres")

def list_containers() -> List[Dict]:
    client = get_client()
    containers = client.containers.list(all=True)
    out = []
    for c in containers:
        name = c.name
        if not name.startswith(TARGET_PREFIXES):
            continue
        state = c.status
        ports = c.attrs.get("NetworkSettings", {}).get("Ports", {})
        networks = list((c.attrs.get("NetworkSettings", {}).get("Networks") or {}).keys())
        out.append({
            "name": name,
            "image": c.image.tags[0] if c.image.tags else c.image.short_id,
            "status": state,
            "ports": ports,
            "networks": networks,
            "created": c.attrs.get("Created"),
        })
    return sorted(out, key=lambda x: x["name"])

def restart_container(name: str) -> Dict:
    client = get_client()
    c = client.containers.get(name)
    c.restart()
    c.reload()
    return {"name": c.name, "status": c.status}

def tail_logs(name: str, lines: int = 80) -> str:
    client = get_client()
    c = client.containers.get(name)
    logs = c.logs(tail=lines).decode(errors="ignore")
    return logs
