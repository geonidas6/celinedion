import type { RefObject } from "react";
import type { Song } from "../api/types";
import type { PlayerStatus } from "../hooks/useYouTubePlayer";
import { formatDuration, youtubeThumbnail, youtubeWatchUrl } from "../lib/catalog";
import { EqualizerIcon, PauseIcon, PlayIcon, YouTubeIcon } from "./Icons";

interface StageProps {
  current: Song | null;
  upcoming: Song[];
  status: PlayerStatus;
  error: string | null;
  isPlaying: boolean;
  playerMountRef: RefObject<HTMLDivElement | null>;
  onToggle: () => void;
  onRetry: () => void;
  onSelect: (song: Song) => void;
}

const STATUS_HINT: Partial<Record<PlayerStatus, string>> = {
  loading: "Chargement de la vidéo…",
  buffering: "Mise en mémoire tampon…",
  paused: "En pause",
  playing: "Lecture en cours",
  ended: "Chanson terminée",
};

export function Stage({
  current,
  upcoming,
  status,
  error,
  isPlaying,
  playerMountRef,
  onToggle,
  onRetry,
  onSelect,
}: StageProps) {
  return (
    <section className="scene" id="scene" aria-labelledby="scene-title">
      <div className="scene__video">
        <div className="screen">
          <div className="screen__player" ref={playerMountRef} />
          {!current && (
            <div className="screen__poster">
              <div className="screen__disc" aria-hidden="true" />
              <p className="screen__poster-title">Le concert commence ici</p>
              <p className="screen__poster-text">
                Choisissez une chanson dans la discographie : la vidéo officielle
                s&apos;affiche et se lance dans ce lecteur.
              </p>
              <a className="screen__poster-link" href="#discographie">
                Parcourir la discographie
              </a>
            </div>
          )}
          {current && error && (
            <div className="screen__error" role="alert">
              <p className="screen__error-title">Lecture impossible dans le lecteur</p>
              <p>{error}</p>
              <div className="screen__error-actions">
                <button type="button" className="button button--gold button--small" onClick={onRetry}>
                  Réessayer
                </button>
                <a
                  className="button button--ghost button--small"
                  href={youtubeWatchUrl(current.youtubeId)}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <YouTubeIcon size={16} />
                  Ouvrir sur YouTube
                </a>
              </div>
            </div>
          )}
        </div>
        <p className="scene__credit">
          <YouTubeIcon size={15} />
          Vidéo lue via YouTube. Certaines vidéos peuvent être soumises à des
          restrictions géographiques ou publicitaires.
        </p>
      </div>

      <div className="scene__side">
        <p className="eyebrow eyebrow--small">
          <span className="eyebrow__line" />
          {STATUS_HINT[status] ?? "Prêt à jouer"}
        </p>
        <h2 className="scene__title" id="scene-title">
          {current ? current.title : "Votre scène personnelle"}
        </h2>
        {current ? (
          <>
            <p className="scene__meta">
              {[current.album, current.year].filter(Boolean).join(" · ") || "Céline Dion"}
              {current.duration ? ` · ${formatDuration(current.duration)}` : ""}
            </p>
            <div className="scene__actions">
              <button
                type="button"
                className="button button--gold"
                onClick={onToggle}
                aria-label={isPlaying ? "Mettre en pause" : "Lire la chanson"}
              >
                {isPlaying ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
                {isPlaying ? "Pause" : "Lecture"}
              </button>
              <a
                className="button button--ghost"
                href={youtubeWatchUrl(current.youtubeId)}
                target="_blank"
                rel="noreferrer noopener"
              >
                <YouTubeIcon size={16} />
                YouTube
              </a>
            </div>
          </>
        ) : (
          <p className="scene__meta">
            Un lecteur unique, sans quitter la page. Sélectionnez un titre pour
            commencer, puis enchaînez avec la file d&apos;attente.
          </p>
        )}

        <div className="upnext">
          <div className="upnext__head">
            <span>À suivre</span>
            <span className="upnext__count">{upcoming.length}</span>
          </div>
          {upcoming.length === 0 ? (
            <p className="upnext__empty">
              Lancez une chanson puis une playlist pour remplir la file d&apos;attente.
            </p>
          ) : (
            <ol className="upnext__list">
              {upcoming.slice(0, 6).map((song, index) => (
                <li key={song.id}>
                  <button type="button" className="upnext__item" onClick={() => onSelect(song)}>
                    <span className="upnext__index">{String(index + 1).padStart(2, "0")}</span>
                    <img
                      className="upnext__cover"
                      src={youtubeThumbnail(song.youtubeId, "mq")}
                      alt=""
                      loading="lazy"
                      width={64}
                      height={36}
                    />
                    <span className="upnext__text">
                      <span className="upnext__title">{song.title}</span>
                      <span className="upnext__sub">
                        {[song.album, song.year].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    {current?.id === song.id ? <EqualizerIcon /> : null}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
