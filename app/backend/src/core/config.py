from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Portal Docente ISI 2025"
    POSTGRES_USER: str = "pln_admin"
    POSTGRES_PASSWORD: str = "pln2025"
    POSTGRES_DB: str = "portal_docente"
    POSTGRES_HOST: str = "postgres-pln-itm"
    POSTGRES_PORT: int = 5432

    class Config:
        env_file = ".env"

settings = Settings()
