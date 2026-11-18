from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_ok():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_list_songs():
    response = client.get("/api/songs")
    assert response.status_code == 200
    songs = response.json()
    assert isinstance(songs, list)
    assert len(songs) >= 1
    for song in songs:
        assert set(["id", "title", "youtube_video_id"]).issubset(song.keys())
        assert song["youtube_video_id"]


def test_get_song_by_id():
    response = client.get("/api/songs/my-heart-will-go-on")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == "my-heart-will-go-on"
    assert data["title"] == "My Heart Will Go On"
    assert data["youtube_video_id"]


def test_get_unknown_song_returns_404():
    response = client.get("/api/songs/does-not-exist")
    assert response.status_code == 404


def test_openapi_documents_endpoints():
    response = client.get("/api/openapi.json")
    assert response.status_code == 200
    doc = response.json()
    paths = doc.get("paths", {})
    assert "/api/health" in paths
    assert "/api/songs" in paths
    assert "/api/songs/{song_id}" in paths
