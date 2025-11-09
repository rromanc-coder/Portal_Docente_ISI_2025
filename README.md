# Portal Docente ISI 2025

Dashboard docente para monitoreo y administración de laboratorios (PLN / ITM / ISI).

## Arquitectura
- **Backend**: FastAPI (puerto interno 9090) con acceso a Docker Engine vía `/var/run/docker.sock` (solo lectura).
- **Frontend**: React + Vite + Tailwind + Recharts servido con **nginx** (puerto 9390).
- **Red**: `pln_net` (externa).

El **frontend** usa **nginx** como *reverse proxy* para enrutar `/api/*` hacia `backend:9090` dentro de la red Docker, por lo que **no se expone** el API hacia fuera.

## Requisitos
- Docker y Docker Compose v2
- Red externa `pln_net` creada previamente
  ```bash
  docker network create pln_net || true
  ```

## Despliegue
```bash
docker compose build --no-cache
docker compose up -d
# Abrir: http://<host>:9390
```

## Endpoints backend
- `GET /` — ping
- `GET /health` — estado Docker
- `GET /containers` — lista de contenedores (equipo*, itm*, proyecto_isi*, postgres*)
- `POST /containers/restart/{name}` — reinicia contenedor
- `GET /containers/logs/{name}?lines=80` — últimas líneas de logs
- `GET /metrics` — métricas agregadas

---
Centro Universitario UAEM Nezahualcóyotl – Ingeniería en Sistemas Inteligentes
