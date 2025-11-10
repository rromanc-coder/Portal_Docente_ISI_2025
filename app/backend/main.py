from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from monitor.routes import router as monitor_router

app = FastAPI(title="Portal Docente ISI 2025 - Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(monitor_router, prefix="/monitor/api")

@app.get("/health")
async def health():
    return {"status": "ok", "service": "backend"}
