"""Songs router: catalog listing and single song retrieval."""

from fastapi import APIRouter, HTTPException, Path

from .data import Song, list_songs, song_by_id

router = APIRouter(prefix="/api", tags=["songs"])


@router.get(
    "/songs",
    response_model=list[Song],
    summary="List available Céline Dion songs",
    description="Returns the catalog of songs with their YouTube video IDs so "
    "the frontend player can embed and play them.",
)
def get_songs() -> list[Song]:
    return list_songs()


@router.get(
    "/songs/{song_id}",
    response_model=Song,
    summary="Get a single song by ID",
    description="Returns the details of one song, including its YouTube video "
    "ID for embedding in the player.",
)
def get_song(
    song_id: str = Path(..., description="Unique song identifier"),
) -> Song:
    song = song_by_id(song_id)
    if song is None:
        raise HTTPException(status_code=404, detail="Song not found")
    return song
