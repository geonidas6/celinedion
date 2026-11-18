# syntax=docker/dockerfile:1
FROM python:3.13-slim

WORKDIR /app

# Runtime dependencies only.
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Application code + OpenAPI document.
COPY app ./app
COPY openapi.json .

# The server must listen on all interfaces inside Docker so the reverse proxy
# (Traefik) can reach it. The deployer adds the Traefik labels.
EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
