export type Language = "fr" | "en";

/**
 * Normalised song model used by the whole UI.
 * Mirrors the `Song` schema from backend/openapi.json, with the YouTube field
 * mapped to `youtubeId` and the duration converted to seconds.
 */
export interface Song {
  id: string;
  title: string;
  album: string | null;
  year: number | null;
  language: Language | null;
  youtubeId: string;
  /** Duration in seconds, when known. */
  duration: number | null;
  channel?: string | null;
}

/** Raw payload of `GET /api/songs` (see backend/openapi.json). */
export interface SongDTO {
  id: string;
  title: string;
  album: string | null;
  year: number | null;
  youtube_video_id: string;
  duration: string | null;
}

/** Raw payload of `GET /api/health`. */
export interface HealthDTO {
  status: string;
}

export type ApiStatus = "checking" | "online" | "offline";

export type RepeatMode = "off" | "all" | "one";

export type SortMode = "year-desc" | "year-asc" | "title-asc" | "album-asc";
