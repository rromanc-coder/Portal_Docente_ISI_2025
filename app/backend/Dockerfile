# app/backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Instala dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia SOLO el código fuente que realmente usa uvicorn
COPY ./src ./src

# Config env
ENV PYTHONPATH="/app/src"

# Uvicorn escucha en 80 (coincide con docker-compose)
EXPOSE 80

# Ejecuta FastAPI
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]
