"""Céline Dion API application factory.

Endpoints:
  GET /api/health          -> {"status": "ok"}
  GET /api/songs           -> list of songs (with YouTube video IDs)
  GET /api/songs/{song_id} -> single song detail
  GET /api/openapi.json    -> OpenAPI schema (auto-served by FastAPI)
"""

from fastapi import FastAPI

from .songs import router as songs_router

app = FastAPI(
    title="Céline Dion API",
    description="Backend for the Céline Dion fan page. Serves the song catalog "
    "with YouTube video IDs so the frontend can play the videos in a player.",
    version="1.0.0",
    openapi_url="/api/openapi.json",
    contact={
        "name": "Céline Dion fan page",
        "url": "https://celine-dion.it-sefako.com",
    },
    license_info={
        "name": "Proprietary",
    },
)


@app.get(
    "/api/health",
    tags=["health"],
    summary="Health check",
    description="Returns the service status. Used by reverse proxies and "
    "orchestrators to verify the backend is reachable.",
)
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(songs_router)
