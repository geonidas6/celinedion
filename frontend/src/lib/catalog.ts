import type { Language, Song, SongDTO, SortMode } from "../api/types";

export function parseDuration(value: string | null | undefined): number | null {
  if (!value) return null;
  const parts = value.split(":").map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) return null;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return null;
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds <= 0) return "--:--";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function formatLongDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.round((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes} min`;
  return `${hours} h ${minutes.toString().padStart(2, "0")}`;
}

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function normalizeText(value: string): string {
  return stripAccents(value.toLowerCase())
    .replace(/['’`]/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function songKey(song: Pick<Song, "title">): string {
  return normalizeText(song.title);
}

/** Map an API song to the UI model. */
export function fromDto(dto: SongDTO): Song {
  return {
    id: dto.id,
    title: dto.title,
    album: dto.album ?? null,
    year: dto.year ?? null,
    language: null,
    youtubeId: dto.youtube_video_id,
    duration: parseDuration(dto.duration),
  };
}

/**
 * Merge the API catalogue with the verified local catalogue.
 * Local entries are authoritative for duplicates: their YouTube IDs were
 * checked against the official Céline Dion channels. API-only songs are added
 * on top, so the page automatically grows with the backend.
 */
export function mergeCatalogs(apiSongs: Song[], localSongs: Song[]): {
  songs: Song[];
  apiOnly: number;
} {
  const byKey = new Map<string, Song>();
  for (const song of localSongs) {
    byKey.set(songKey(song), { ...song });
  }

  let apiOnly = 0;
  for (const apiSong of apiSongs) {
    const key = songKey(apiSong);
    const local = byKey.get(key);
    if (!local) {
      byKey.set(key, { ...apiSong, language: inferLanguage(apiSong) });
      apiOnly += 1;
      continue;
    }
    // Keep the verified YouTube ID, enrich metadata when the API has some.
    byKey.set(key, {
      ...local,
      album: local.album ?? apiSong.album,
      year: local.year ?? apiSong.year,
      duration: local.duration ?? apiSong.duration,
    });
  }

  return { songs: [...byKey.values()], apiOnly };
}

function inferLanguage(song: Song): Language | null {
  const haystack = `${song.title} ${song.album ?? ""}`.toLowerCase();
  const frenchMarkers = [
    "é", "è", "ê", "à", "â", "ô", "û", "ç", "œ", " que ", " pour ", " les ",
    " des ", " une ", " mon ", " mes ", " avec ", " dans ", " sur ", " t'aime",
    " d'amour", " ne ", " pas ", " plus ", " moi ", " toi ",
  ];
  if (frenchMarkers.some((marker) => haystack.includes(marker))) return "fr";
  if (/[a-z]/.test(haystack)) return "en";
  return null;
}

export function filterAndSort(
  songs: Song[],
  query: string,
  language: Language | "all",
  album: string,
  sort: SortMode,
): Song[] {
  const needle = normalizeText(query);
  const filtered = songs.filter((song) => {
    if (language !== "all" && song.language !== language) return false;
    if (album !== "all" && (song.album ?? "") !== album) return false;
    if (!needle) return true;
    const haystack = normalizeText(`${song.title} ${song.album ?? ""} ${song.year ?? ""}`);
    return needle.split(/\s+/).every((token) => haystack.includes(token));
  });

  const sorted = [...filtered];
  switch (sort) {
    case "year-asc":
      sorted.sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title, "fr"));
      break;
    case "title-asc":
      sorted.sort((a, b) => a.title.localeCompare(b.title, "fr"));
      break;
    case "album-asc":
      sorted.sort(
        (a, b) =>
          (a.album ?? "zzz").localeCompare(b.album ?? "zzz", "fr") ||
          (a.year ?? 9999) - (b.year ?? 9999) ||
          a.title.localeCompare(b.title, "fr"),
      );
      break;
    case "year-desc":
    default:
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title, "fr"));
      break;
  }
  return sorted;
}

export function uniqueAlbums(songs: Song[]): { album: string; year: number | null }[] {
  const seen = new Map<string, number | null>();
  for (const song of songs) {
    if (!song.album) continue;
    const current = seen.get(song.album);
    if (current == null || (song.year != null && (current == null || song.year < current))) {
      seen.set(song.album, song.year ?? current ?? null);
    }
  }
  return [...seen.entries()]
    .map(([album, year]) => ({ album, year }))
    .sort((a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.album.localeCompare(b.album, "fr"));
}

export function youtubeThumbnail(youtubeId: string, quality: "mq" | "hq" | "max" = "mq"): string {
  return `https://i.ytimg.com/vi/${youtubeId}/${quality}default.jpg`;
}

export function youtubeWatchUrl(youtubeId: string): string {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function youtubeEmbedUrl(youtubeId: string, autoplay = false): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?${params.toString()}`;
}
