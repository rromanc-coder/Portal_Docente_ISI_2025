from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import containers, health, metrics

app = FastAPI(title="Portal Docente ISI 2025 - API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["health"])
app.include_router(containers.router, prefix="", tags=["containers"])
app.include_router(metrics.router, prefix="/metrics", tags=["metrics"])

@app.get("/")
def root():
    return {"name": "Portal Docente ISI 2025 - API", "ok": True}
