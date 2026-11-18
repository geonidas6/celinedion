"""Song catalog and domain models for the Céline Dion API.

The catalog is a curated selection of Céline Dion's biggest hits. Every entry
carries a verified YouTube video ID so the frontend can embed the video in its
player. The list is intentionally extensible: new songs can be appended here
(or loaded from another source) without changing the API contract.
"""

from pydantic import BaseModel


class Song(BaseModel):
    id: str
    title: str
    album: str | None = None
    year: int | None = None
    youtube_video_id: str
    duration: str | None = None


SONGS: list[Song] = [
    Song(
        id="my-heart-will-go-on",
        title="My Heart Will Go On",
        album="Let's Talk About Love",
        year=1997,
        youtube_video_id="mNsm2P0l_7Y",
        duration="4:40",
    ),
    Song(
        id="because-you-loved-me",
        title="Because You Loved Me",
        album="Falling Into You",
        year=1996,
        youtube_video_id="3RbcGowL1qQ",
        duration="4:33",
    ),
    Song(
        id="the-power-of-love",
        title="The Power of Love",
        album="The Colour of My Love",
        year=1993,
        youtube_video_id="Y8HOfcYWZoo",
        duration="4:11",
    ),
    Song(
        id="thats-the-way-it-is",
        title="That's the Way It Is",
        album="All the Way... A Decade of Song",
        year=1999,
        youtube_video_id="T6wbugWrfLU",
        duration="4:01",
    ),
    Song(
        id="a-new-day-has-come",
        title="A New Day Has Come",
        album="A New Day Has Come",
        year=2002,
        youtube_video_id="NaGLVS5b_ZY",
        duration="4:23",
    ),
    Song(
        id="im-alive",
        title="I'm Alive",
        album="A New Day Has Come",
        year=2002,
        youtube_video_id="E-PwDv-QYcA",
        duration="4:20",
    ),
]

_BY_ID: dict[str, Song] = {song.id: song for song in SONGS}


def list_songs() -> list[Song]:
    return list(SONGS)


def song_by_id(song_id: str) -> Song | None:
    return _BY_ID.get(song_id)
