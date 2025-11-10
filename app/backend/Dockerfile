FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./src ./src

# Configuración del entorno
ENV PYTHONPATH="/app/src"

EXPOSE 9090

# Ejecuta FastAPI
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "80"]
