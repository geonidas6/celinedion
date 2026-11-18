import type { RepeatMode, Song } from "../api/types";
import { formatDuration, youtubeThumbnail, youtubeWatchUrl } from "../lib/catalog";
import {
  EqualizerIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  RepeatIcon,
  ShuffleIcon,
  VolumeIcon,
  YouTubeIcon,
} from "./Icons";

interface PlayerDockProps {
  current: Song;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  queuePosition: { index: number; total: number };
  shuffle: boolean;
  repeat: RepeatMode;
  volume: number;
  muted: boolean;
  onToggle: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  onOpenScene: () => void;
  onSeek: (seconds: number) => void;
}

export function PlayerDock({
  current,
  isPlaying,
  currentTime,
  duration,
  queuePosition,
  shuffle,
  repeat,
  volume,
  muted,
  onToggle,
  onPrev,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  onVolumeChange,
  onToggleMute,
  onOpenScene,
  onSeek,
}: PlayerDockProps) {
  const total = duration > 0 ? duration : current.duration ?? 0;
  const progress = total > 0 ? Math.min(100, (currentTime / total) * 100) : 0;

  return (
    <div className="dock" role="region" aria-label="Lecteur">
      <div className="dock__progress">
        <input
          type="range"
          min={0}
          max={Math.max(1, Math.floor(total))}
          step={1}
          value={Math.min(currentTime, Math.max(1, Math.floor(total)))}
          onChange={(event) => onSeek(Number(event.target.value))}
          aria-label="Position dans la chanson"
          style={{ backgroundSize: `${progress}% 100%` }}
        />
      </div>

      <div className="dock__inner">
        <button type="button" className="dock__song" onClick={onOpenScene} title="Afficher la vidéo">
          <img src={youtubeThumbnail(current.youtubeId, "mq")} alt="" width={64} height={36} />
          <span className="dock__song-text">
            <span className="dock__title">{current.title}</span>
            <span className="dock__sub">
              Céline Dion
              {current.album ? ` · ${current.album}` : ""}
              {current.year ? ` · ${current.year}` : ""}
            </span>
          </span>
          {isPlaying ? (
            <span className="dock__eq" aria-hidden="true">
              <EqualizerIcon />
            </span>
          ) : null}
        </button>

        <div className="dock__controls">
          <button
            type="button"
            className={`icon-button${shuffle ? " icon-button--active" : ""}`}
            onClick={onToggleShuffle}
            aria-pressed={shuffle}
            aria-label="Lecture aléatoire"
            title="Lecture aléatoire"
          >
            <ShuffleIcon />
          </button>
          <button type="button" className="icon-button" onClick={onPrev} aria-label="Chanson précédente" title="Précédent">
            <PrevIcon />
          </button>
          <button
            type="button"
            className="icon-button icon-button--primary"
            onClick={onToggle}
            aria-label={isPlaying ? "Mettre en pause" : "Lire"}
            title={isPlaying ? "Pause" : "Lecture"}
          >
            {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
          </button>
          <button type="button" className="icon-button" onClick={onNext} aria-label="Chanson suivante" title="Suivant">
            <NextIcon />
          </button>
          <button
            type="button"
            className={`icon-button${repeat !== "off" ? " icon-button--active" : ""}`}
            onClick={onCycleRepeat}
            aria-label={`Répétition : ${repeat === "off" ? "désactivée" : repeat === "all" ? "toute la file" : "une chanson"}`}
            title={`Répétition : ${repeat === "off" ? "désactivée" : repeat === "all" ? "toute la file" : "une chanson"}`}
          >
            <RepeatIcon one={repeat === "one"} />
          </button>
        </div>

        <div className="dock__right">
          <span className="dock__time">
            {formatDuration(currentTime)} / {total > 0 ? formatDuration(total) : "--:--"}
          </span>
          <span className="dock__queue" title="Position dans la file d'attente">
            {queuePosition.index + 1}/{queuePosition.total}
          </span>
          <div className="dock__volume">
            <button
              type="button"
              className="icon-button"
              onClick={onToggleMute}
              aria-label={muted ? "Rétablir le son" : "Couper le son"}
              title={muted ? "Rétablir le son" : "Couper le son"}
            >
              <VolumeIcon muted={muted || volume === 0} />
            </button>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={muted ? 0 : volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
              aria-label="Volume"
              style={{ backgroundSize: `${muted ? 0 : volume}% 100%` }}
            />
          </div>
          <a
            className="icon-button"
            href={youtubeWatchUrl(current.youtubeId)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="Ouvrir sur YouTube"
            title="Ouvrir sur YouTube"
          >
            <YouTubeIcon />
          </a>
        </div>
      </div>

    </div>
  );
}
