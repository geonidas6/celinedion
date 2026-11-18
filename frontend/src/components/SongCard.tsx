import type { Song } from "../api/types";
import { formatDuration, youtubeThumbnail } from "../lib/catalog";
import { EqualizerIcon, PlayIcon } from "./Icons";

interface SongCardProps {
  song: Song;
  isCurrent: boolean;
  isPlaying: boolean;
  onSelect: (song: Song) => void;
}

export function SongCard({ song, isCurrent, isPlaying, onSelect }: SongCardProps) {
  return (
    <li>
      <button
        type="button"
        className={`song-card${isCurrent ? " song-card--current" : ""}`}
        onClick={() => onSelect(song)}
        aria-label={`Lire ${song.title}`}
      >
        <span className="song-card__art">
          <img src={youtubeThumbnail(song.youtubeId, "mq")} alt="" loading="lazy" width={320} height={180} />
          <span className="song-card__shade" aria-hidden="true" />
          <span className="song-card__play" aria-hidden="true">
            <PlayIcon size={20} />
          </span>
          <span className="song-card__duration">{formatDuration(song.duration)}</span>
          {isCurrent ? (
            <span className="song-card__now">
              <EqualizerIcon />
              {isPlaying ? "En lecture" : "En pause"}
            </span>
          ) : null}
        </span>
        <span className="song-card__body">
          <span className="song-card__title">{song.title}</span>
          <span className="song-card__meta">
            {[song.album, song.year].filter(Boolean).join(" · ") || "Céline Dion"}
          </span>
        </span>
      </button>
    </li>
  );
}
